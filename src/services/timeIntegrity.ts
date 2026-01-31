export async function getTrustedUtcTime(): Promise<number | null> {
    // Kill-Switch Check
    if (process.env.ENABLE_EXTERNAL_APIS !== 'true') return null;

    try {
        const res = await fetch(
            'https://timeapi.io/api/Time/current/zone?timeZone=UTC',
            { cache: 'no-store' }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return Date.parse(data.dateTime);
    } catch (error) {
        // Fail silently, do not block app flow
        return null;
    }
}
