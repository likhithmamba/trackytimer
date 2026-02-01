import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ensureUser } from '@/services/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { identity, accessKey } = body;
        const userId = ensureUser();

        if (!identity) {
            return NextResponse.json({ error: 'Identity is required' }, { status: 400 });
        }

        // Update user identity
        const { error } = await supabase
            .from('users')
            .update({
                identity_hash: identity
            })
            .eq('id', userId);

        if (error) {
            console.error("Identity update failed:", error);
            return NextResponse.json({ error: 'Failed to update identity' }, { status: 500 });
        }

        return NextResponse.json({ status: 'OK' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
