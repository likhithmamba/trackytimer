import { NextResponse } from 'next/server';
import { updateSession } from '@/services/db';
import { Violation, ActiveSession } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type } = body; // 'PHONE_DETECTED' | 'TAB_SWITCH' | 'ABANDONED'

        if (!type) return NextResponse.json({ error: 'Missing violation type' }, { status: 400 });

        const updated = await updateSession((session) => {
            if (session.status === 'LOCKED' || session.status === 'COMPLETED') {
                return session; // No-op if already locked
            }

            const newViolation: Violation = {
                id: Math.random().toString(36).substring(7),
                type,
                timestamp: new Date().toISOString()
            };

            const newViolations = [...session.violations, newViolation];

            let newStatus: ActiveSession['status'] = session.status;
            let warningTriggered = session.warningTriggered;

            // STRICT RULE:
            // 1st failure -> WARNING
            if (newViolations.length === 1) {
                warningTriggered = true;
            }
            // 2nd failure -> LOCKED
            if (newViolations.length >= 2) {
                newStatus = 'LOCKED';
            }

            return {
                ...session,
                violations: newViolations,
                warningTriggered,
                status: newStatus as ActiveSession['status']
            };
        });

        return NextResponse.json(updated);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 }); // strict error
    }
}
