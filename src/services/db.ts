import { supabase } from '@/lib/supabase';
import { DbSchema, ActiveSession, TrackModule, SessionStatus } from '@/lib/types';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

/**
 * ADAPTER LAYER: Supabase (Postgres) -> App Types
 */

// Helper to get the singleton user from Cookies (set by Middleware)
export function ensureUser(): string {
    const cookieStore = cookies();
    const uid = cookieStore.get('uid')?.value;

    // In strict theory, middleware guarantees this. 
    // Fallback just in case execution is outside middleware scope (unlikely in App Router)
    if (!uid) {
        throw new Error("Security Violation: No User Identity found in request context.");
    }
    return uid;
}

export async function getDb(): Promise<DbSchema> {
    const userId = ensureUser();

    // 1. Fetch User State
    // We try to fetch. If not found, we insert on the fly (JIT provisioning)
    // to map the cookie UUID to a DB row.
    let { data: userRow } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (!userRow) {
        // Create user row if it doesn't exist yet
        const { data: newUser } = await supabase
            .from('users')
            .insert({
                id: userId,
                identity_hash: 'ANON_V1',
                is_demo: 0,
                uptime_seconds: 0
            })
            .select()
            .single();
        userRow = newUser;
    }

    // 2. Optimized Fetch: Get Session + Violations + Queue in ONE query
    const { data: sessionRow } = await supabase
        .from('sessions')
        .select(`
    *,
    violations(*),
    range_objectives(*)
        `)
        .eq('user_id', userId)
        .neq('status', 'COMPLETED')
        .neq('status', 'ABANDONED')
        .order('start_time', { ascending: false })
        .limit(1)
        .single();

    let currentSession: ActiveSession | null = null;

    if (sessionRow) {
        currentSession = {
            date: sessionRow.started_at_iso ? sessionRow.started_at_iso.split('T')[0] : new Date().toISOString().split('T')[0],
            mainTitle: sessionRow.main_title || "Session",
            progressPercent: sessionRow.progress_percent,
            status: sessionRow.status as SessionStatus,
            violations: (sessionRow.violations || []).map((v: any) => ({
                id: v.id,
                type: v.type as any,
                timestamp: v.timestamp_iso
            })),
            warningTriggered: Boolean(sessionRow.warning_triggered),
            queue: (sessionRow.range_objectives || []).map((o: any) => ({
                id: o.id,
                title: o.title,
                timeBlock: o.time_block,
                intensity: o.intensity as any,
                status: o.status as any,
                progress: o.progress
            })),
            startTime: sessionRow.started_at_iso,
            durationMinutes: sessionRow.duration_minutes
        };
    }

    // 3. Mock Tracks (DB tracks TBD)
    const tracks: TrackModule[] = [
        {
            id: "SYL_MOD_06_UPLINK",
            name: "Module_06: Technical_Console",
            riskLevel: "MEDIUM",
            status: "ACTIVE",
            objectives: []
        }
    ];

    return {
        userState: {
            identity: userRow?.identity_hash || 'UNKNOWN',
            uptime: userRow?.uptime_seconds || 0,
            securityProtocol: (userRow?.security_protocol as "AES-256") || "AES-256",
            specificityLevel: userRow?.specificity_level || 4,
        },
        tracks,
        currentSession
    };
}

export async function saveDb(data: DbSchema): Promise<void> {
    throw new Error("saveDb is NOT supported in Production Mode. Use updateSession().");
}

export async function updateSession(updateFn: (session: ActiveSession) => ActiveSession): Promise<ActiveSession> {
    // Note: ensureUser might throw if called outside request context, but updateSession
    // is always called from Route Handlers / Server Actions.
    const dbData = await getDb();

    let session = dbData.currentSession;

    if (!session) {
        // Placeholder for creation
        session = {
            date: new Date().toISOString().split('T')[0],
            mainTitle: "New Session",
            progressPercent: 0,
            status: 'HOLD',
            violations: [],
            warningTriggered: false,
            queue: []
        };
    }

    const updated = updateFn(session);

    // Determine Session ID
    // Note: getDb above fetched the session row (if it existed). 
    // We can infer existence.
    const { data: existingSession } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', ensureUser())
        .neq('status', 'COMPLETED')
        .neq('status', 'ABANDONED')
        .limit(1)
        .single();

    const sessionId = existingSession?.id || uuidv4(); // Generate if new

    if (!existingSession) {
        // Initial Creation (standard insert)
        await supabase.from('sessions').insert({
            id: sessionId,
            user_id: ensureUser(),
            status: updated.status,
            start_time: Math.floor(Date.now() / 1000),
            main_title: updated.mainTitle,
            progress_percent: updated.progressPercent,
            warning_triggered: updated.warningTriggered ? 1 : 0,
            started_at_iso: updated.startTime || new Date().toISOString(),
            duration_minutes: updated.durationMinutes
        });
    }

    // TRANSACTIONAL UPDATE via RPC
    // This atomic function updates the session AND inserts any violations
    // in a single transaction.
    const { error } = await supabase.rpc('update_session_with_violations', {
        p_session_id: sessionId,
        p_status: updated.status,
        p_progress: updated.progressPercent,
        p_warning: updated.warningTriggered,
        p_violations: updated.violations, // Pass array of {id, type, timestamp}
        p_main_title: updated.mainTitle
    });

    if (error) {
        console.error("RPC Update Failed:", error);
        throw new Error("Failed to persist session state safely.");
    }

    return updated;
}
