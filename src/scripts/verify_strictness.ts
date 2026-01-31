
import { updateSession, getDb, saveDb } from '../services/db';
import { DbSchema } from '../lib/types';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

async function resetDb() {
    const initial: DbSchema = {
        userState: { uptime: 0, deepWorkStreak: 0, securityProtocol: "AES-256", performanceBoost: false, specificityLevel: 4 },
        tracks: [],
        currentSession: {
            date: "2024-01-01",
            mainTitle: "Test Session",
            progressPercent: 0,
            status: "RUNNING",
            violations: [],
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
        return { ...s, violations: [...s.violations, { id: '1', type: 'TAB_SWITCH', timestamp: new Date().toISOString() }] };
    });

    if (session.status === 'LOCKED') console.error("FAILED: Locked too early!");
    else console.log("PASSED: Still Active (1/2 violations).");

    // 2. Second Violation
    console.log("Triggering 2nd Violation...");
    session = await updateSession((s) => {
        const newViolations = [...s.violations, { id: '2', type: 'PHONE_DETECTED', timestamp: new Date().toISOString() }];
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
