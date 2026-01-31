import { getDb } from '@/services/db';
import ClientShell from '@/components/ClientShell';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const db = await getDb();
    return <ClientShell db={db} />;
}
