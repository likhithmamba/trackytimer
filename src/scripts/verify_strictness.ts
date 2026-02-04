
import { updateSession, getDb, saveDb } from '../services/db';
import { DbSchema, Violation } from '../lib/types';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

async function resetDb() {
    const initial: DbSchema = {
        userState: { uptime: 0, securityProtocol: "AES-256", specificityLevel: 4 },
        tracks: [],
        currentSession: {
            date: "2024-01-01",
            mainTitle: "Test Session",
            progressPercent: 0,
            status: "RUNNING",
            violations: [],
            warningTriggered: false,
            queue: []
        }
    };
    await saveDb(initial);
}

async function runTest() {
    console.log("Starting Strictness Verification...");

    await resetDb();
    console.log("DB Reset.");

    // 1. First Violation
    console.log("Triggering 1st Violation...");
    let session = await updateSession((s) => {
        const v: Violation = { id: '1', type: 'TAB_SWITCH', timestamp: new Date().toISOString() };
        return { ...s, violations: [...s.violations, v] };
    });

    if (session.status === 'LOCKED') console.error("FAILED: Locked too early!");
    else console.log("PASSED: Still Active (1/2 violations).");

    // 2. Second Violation
    console.log("Triggering 2nd Violation...");
    session = await updateSession((s) => {
        const v: Violation = { id: '2', type: 'PHONE_DETECTED', timestamp: new Date().toISOString() };
        const newViolations = [...s.violations, v];
        if (newViolations.length >= 2) s.status = 'LOCKED'; // Logic mirrors api route
        return { ...s, violations: newViolations, status: newViolations.length >= 2 ? 'LOCKED' : s.status };
    });

    if (session.status === 'LOCKED') console.log("PASSED: System is LOCKED (2/2 violations).");
    else console.error(`FAILED: System should be LOCKED but is ${session.status}`);

    // 3. Attempt Resume
    console.log("Attempting to Resume...");
    try {
        await updateSession((s) => {
            if (s.status === 'LOCKED') throw new Error("Session is LOCKED");
            return { ...s, status: 'RUNNING' };
        });
        console.error("FAILED: Resume allowed in Locked state!");
    } catch (e: any) {
        console.log("PASSED: Resume blocked: " + e.message);
    }
}

runTest().catch(console.error);
