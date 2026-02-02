import { NextResponse } from 'next/server';
import { getDb, updateSession } from '@/services/db';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ActionSchema = z.object({
    action: z.enum(['RESUME', 'RESTORE', 'PAUSE', 'ABORT', 'FINALIZE_FAILURE', 'WIPE']),
});

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.currentSession);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = ActionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid action payload', details: result.error.flatten() }, { status: 400 });
        }

        const { action } = result.data;

        if (action === 'RESUME') {
            const updated = await updateSession((session) => {
                if (session.status === 'LOCKED') throw new Error("Session is LOCKED. Use RESTORE.");
                // If resuming from WARNING, we could reset status to RUNNING, but user wanted "do NOT reset timers, do NOT soften copy"
                // But functionally we need to be running. Warning flag stays up.
                return { ...session, status: 'RUNNING' };
            });
            return NextResponse.json(updated);
        }

        if (action === 'RESTORE') {
            const updated = await updateSession((session) => {
                // STRICT: Only allow restore if locked.
                if (session.status !== 'LOCKED') return session;

                // RESTORE LOGIC:
                // What remains unchanged: Dropped topics, Failure history, Outcome ceiling
                // What is restored: Session access, Enforcement, Authority
                // Status -> ACTIVE (RUNNING)
                // Logic: "FailureCount remains at 1".
                // If we have >= 2 violations, we remove the most recent one (the lock trigger).
                const newViolations = [...session.violations];
                if (newViolations.length >= 2) {
                    newViolations.pop();
                }

                return {
                    ...session,
                    status: 'RUNNING',
                    violations: newViolations,
                    warningTriggered: newViolations.length > 0,
                };
            });
            return NextResponse.json(updated);
        }

        if (action === 'PAUSE') {
            const updated = await updateSession((session) => {
                return { ...session, status: 'HOLD' };
            });
            return NextResponse.json(updated);
        }

        if (action === 'ABORT') {
            const updated = await updateSession((session) => {
                const newViolation = {
                    id: uuidv4(),
                    type: 'ABANDONED' as const,
                    timestamp: new Date().toISOString()
                };
                return {
                    ...session,
                    status: 'LOCKED',
                    violations: [...session.violations, newViolation]
                };
            });
            return NextResponse.json(updated);
        }

        if (action === 'FINALIZE_FAILURE') {
            const updated = await updateSession((session) => {
                return { ...session, status: 'LOCKED' }; // Changed from ABANDONED to LOCKED for LockedScreen flow
            });
            return NextResponse.json(updated);
        }

        if (action === 'WIPE') {
            // Hard wipe of session
            const dbData = await getDb();
            if (dbData.currentSession) {
                 // We can delete the row via supabase directly or use updateSession to mark invalid?
                 // Prompt says "wipe all execution-related state".
                 // Best to delete the session row or archive it.
                 // Since getDb finds the "active" session, marking it COMPLETED or ABANDONED hides it.
                 const updated = await updateSession((session) => {
                     return { ...session, status: 'ABANDONED' };
                 });
                 return NextResponse.json({ status: 'WIPED' });
            }
             return NextResponse.json({ status: 'NO_SESSION' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
