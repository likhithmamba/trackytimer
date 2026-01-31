import { NextResponse } from 'next/server';
import { getDb, updateSession } from '@/services/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.currentSession);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'RESUME') {
            const updated = await updateSession((session) => {
                if (session.status === 'LOCKED') throw new Error("Session is LOCKED. Use RESTORE.");
                return { ...session, status: 'RUNNING' };
            });
            return NextResponse.json(updated);
        }

        if (action === 'RESTORE') {
            const updated = await updateSession((session) => {
                // STRICT: Only allow restore if locked.
                if (session.status !== 'LOCKED') return session;
                // Reset status, keep violations for history (or clear if we want fresh start - prompt said "Logic should likely keep a count").
                // For now, let's clear the immediate lock triggers to allow running.
                return {
                    ...session,
                    status: 'RUNNING',
                    warningTriggered: false, // Reset warning
                    violations: [] // Clear active violations to prevent instant re-lock
                };
            });
            return NextResponse.json(updated);
        }

        if (action === 'PAUSE') {
            const updated = await updateSession((session) => {
                // Can always pause? Yes.
                return { ...session, status: 'HOLD' };
            });
            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
