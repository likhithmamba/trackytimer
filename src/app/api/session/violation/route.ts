import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/services/db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Schema for input validation
const ViolationRequestSchema = z.object({
    type: z.enum(['PHONE_DETECTED', 'TAB_SWITCH', 'ABANDONED']).optional().default('TAB_SWITCH')
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate input
        const result = ViolationRequestSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid violation type", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { type } = result.data;

        const updated = await updateSession((session) => {
            // If already completed or abandoned, don't modify (though updateSession usually handles status checks)
            if (session.status === 'COMPLETED' || session.status === 'ABANDONED' || session.status === 'LOCKED') {
                return session;
            }

            // Append violation
            const newViolation = {
                id: uuidv4(),
                type: type,
                timestamp: new Date().toISOString()
            };

            // Check logic: 2nd violation locks access
            // Logic from prompt: "First failure triggers warning. Second failure revokes access."

            const violationCount = session.violations.length + 1;
            let status: import('@/lib/types').SessionStatus = session.status;
            let warningTriggered = session.warningTriggered;

            if (violationCount === 1) {
                warningTriggered = true;
                status = 'WARNING';
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
        // Security: Don't leak internal error details to client
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
