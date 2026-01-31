export async function incrementMetric(name: string) {
    // Kill-Switch Check
    if (process.env.ENABLE_EXTERNAL_APIS !== 'true') return;

    // Fire and forget - we don't await the result primarily to keep the app fast
    // metric name should be namespaced e.g., 'session_start', 'violation'
    fetch(`https://api.countapi.xyz/hit/trackytimer_prod/${name}`)
        .catch(() => { }); // ignore failures
}
