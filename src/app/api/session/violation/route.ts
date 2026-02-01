import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/services/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type } = body;

        const updated = await updateSession((session) => {
             // If already completed or abandoned, don't modify (though updateSession usually handles status checks)
             if (session.status === 'COMPLETED' || session.status === 'ABANDONED') {
                 return session;
             }

             // Append violation
             const newViolation = {
                 id: uuidv4(),
                 type: type || 'TAB_SWITCH',
                 timestamp: new Date().toISOString()
             };

             // Check logic: 2nd violation locks access
             // Logic from prompt: "First failure triggers warning. Second failure revokes access."

             const violationCount = session.violations.length + 1;
             let status = session.status;
             let warningTriggered = session.warningTriggered;

             if (violationCount === 1) {
                 warningTriggered = true;
             } else if (violationCount >= 2) {
                 status = 'LOCKED';
             }

             return {
                 ...session,
                 violations: [...session.violations, newViolation],
                 warningTriggered,
                 status
             };
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("Violation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
