import { NextResponse } from 'next/server';
import { getDb } from '@/services/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.userState);
}
