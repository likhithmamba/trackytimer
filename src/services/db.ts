import fs from 'fs/promises';
import path from 'path';
import { DbSchema, TrackModule, ActiveSession } from '@/lib/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const INITIAL_DB: DbSchema = {
    userState: {
        uptime: 0,
        securityProtocol: "AES-256",
        specificityLevel: 4
    },
    tracks: [
        {
            id: "SYL_MOD_06_UPLINK",
            name: "Module_06: Technical_Console",
            riskLevel: "MEDIUM",
            status: "ACTIVE",
            objectives: [
                { id: "OBJ_601_CORE", title: "Core Logic Implementation", timeBlock: "08:00 - 09:30", intensity: "HIGH", status: "ACTIVE", progress: 85 },
                { id: "OBJ_602_REDUX", title: "State Management Refactor", timeBlock: "10:00 - 12:30", intensity: "MEDIUM", status: "PENDING", progress: 0 },
                { id: "OBJ_603_INIT", title: "System Initialization", timeBlock: "13:30 - 15:00", intensity: "LOW", status: "COMPLETED", progress: 100 }
            ]
        }
    ],
    currentSession: {
        date: new Date().toISOString().split('T')[0],
        mainTitle: "High-Stakes Focus Mode",
        progressPercent: 72,
        status: "HOLD",
        violations: [],
        warningTriggered: false,
        queue: [] // Will start empty and hydrate from Track
    }
};

async function ensureDb() {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
        await fs.writeFile(DB_PATH, JSON.stringify(INITIAL_DB, null, 2));
    }
}

export async function getDb(): Promise<DbSchema> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export async function saveDb(data: DbSchema): Promise<void> {
    await ensureDb();
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function updateSession(updateFn: (session: ActiveSession) => ActiveSession): Promise<ActiveSession> {
    const db = await getDb();
    if (!db.currentSession) throw new Error("No active session");

    const updatedSession = updateFn(db.currentSession);
    db.currentSession = updatedSession;
    await saveDb(db);
    return updatedSession;
}
