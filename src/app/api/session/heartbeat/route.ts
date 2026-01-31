import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/services/db';
import db from '@/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId } = body;

        await updateSession((session) => {
            // Monotonic Server Time
            const now = Math.floor(Date.now() / 1000);

            // Raw SQL update to update heartbeat specifically
            // We do this inside the transaction of updateSession implicitly or explicitly here
            db.prepare('UPDATE sessions SET last_heartbeat = ? WHERE id = ?').run(now, sessionId);

            return session; // No state change to the object itself needed for the UI, just the side effect
        });

        return NextResponse.json({ status: 'OK' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process heartbeat' }, { status: 500 });
    }
}
