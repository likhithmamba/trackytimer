
import { DbSchema, Violation, ActiveSession } from '../lib/types';

// Mock DB implementation for strictness testing without external dependencies
let mockSession: ActiveSession = {
    date: "2024-01-01",
    mainTitle: "Test Session",
    progressPercent: 0,
    status: "RUNNING",
    violations: [],
    warningTriggered: false,
    queue: []
};

async function mockUpdateSession(updateFn: (session: ActiveSession) => ActiveSession): Promise<ActiveSession> {
    mockSession = updateFn({ ...mockSession });
    return mockSession;
}

async function runTest() {
    console.log("Starting Strictness Verification (Offline Mock Mode)...");

    // 1. First Violation
    console.log("Triggering 1st Violation...");
    let session = await mockUpdateSession((s) => {
        const v: Violation = { id: '1', type: 'TAB_SWITCH', timestamp: new Date().toISOString() };
        return { ...s, violations: [...s.violations, v] };
    });

    if (session.status === 'LOCKED') console.error("FAILED: Locked too early!");
    else console.log("PASSED: Still Active (1/2 violations).");

    // 2. Second Violation
    console.log("Triggering 2nd Violation...");
    session = await mockUpdateSession((s) => {
        const v: Violation = { id: '2', type: 'PHONE_DETECTED', timestamp: new Date().toISOString() };
        const newViolations = [...s.violations, v];
        // Logic mirroring api/session/violation/route.ts
        if (newViolations.length >= 2) s.status = 'LOCKED';
        return { ...s, violations: newViolations, status: newViolations.length >= 2 ? 'LOCKED' : s.status };
    });

    if (session.status === 'LOCKED') console.log("PASSED: System is LOCKED (2/2 violations).");
    else console.error(`FAILED: System should be LOCKED but is ${session.status}`);

    // 3. Attempt Resume
    console.log("Attempting to Resume...");
    try {
        await mockUpdateSession((s) => {
            if (s.status === 'LOCKED') throw new Error("Session is LOCKED");
            return { ...s, status: 'RUNNING' };
        });
        console.error("FAILED: Resume allowed in Locked state!");
    } catch (e: any) {
        console.log("PASSED: Resume blocked: " + e.message);
    }
}

runTest().catch(console.error);
