import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ensureUser } from '@/services/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId } = body;
        const userId = ensureUser();

        let targetSessionId = sessionId;

        if (sessionId === 'CURRENT') {
            const { data, error } = await supabase
                .from('sessions')
                .select('id')
                .eq('user_id', userId)
                .eq('status', 'RUNNING') // Only update running sessions
                .limit(1)
                .single();

            if (error || !data) {
                // No running session, ignore heartbeat (maybe paused or finished)
                return NextResponse.json({ status: 'IGNORED', reason: 'No active session' });
            }
            targetSessionId = data.id;
        }

        const now = Math.floor(Date.now() / 1000);

        // Update last_heartbeat
        const { error: updateError } = await supabase
            .from('sessions')
            .update({ last_heartbeat: now })
            .eq('id', targetSessionId)
            .eq('user_id', userId); // Extra safety

        if (updateError) {
             console.error("Heartbeat update failed:", updateError);
             return NextResponse.json({ error: 'Failed to update heartbeat' }, { status: 500 });
        }

        return NextResponse.json({ status: 'OK' });
    } catch (error: any) {
        console.error("Heartbeat error:", error);
        return NextResponse.json({ error: error.message || 'Failed to process heartbeat' }, { status: 500 });
    }
}
