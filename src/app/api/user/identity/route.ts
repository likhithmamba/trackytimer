import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ensureUser } from '@/services/db';
import { z } from 'zod';

const IdentitySchema = z.object({
    identity: z.string().min(1, "Identity is required"),
    accessKey: z.string().optional()
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = IdentitySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid identity payload', details: result.error.flatten() }, { status: 400 });
        }

        const { identity, accessKey } = result.data;
        const userId = ensureUser();

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
