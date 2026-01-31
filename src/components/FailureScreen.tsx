'use client';
import React from 'react';
import styles from './FailureScreen.module.css';

interface Violation {
    type: string;
    timestamp: string;
}

export default function FailureScreen({ violations }: { violations: Violation[] }) {
    const handleRestore = async () => {
        // Mock Payment for audit correction
        await fetch('/api/session/current', { method: 'POST', body: JSON.stringify({ action: 'RESTORE' }) });
        window.location.reload();
    };

    return (
        <div className={styles.container}>
            <div className={styles.crtOverlay}></div>
            <div className={styles.scanline}></div>

            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#f20d0d' }}>
                    <span className="material-symbols-outlined">gpp_bad</span>
                    <span style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>System Audit v1.0.11</span>
                </div>
            </header>

            <main className={styles.main}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', padding: '0.25rem 1rem', backgroundColor: 'rgba(242, 13, 13, 0.1)', color: '#f20d0d', fontSize: '10px', fontWeight: 700, letterSpacing: '0.4em', marginBottom: '1rem' }}>INFRACTION DETECTED</div>
                    <h1 className={styles.headline}>
                        YOU BROKE THE <span className={styles.primaryText}>CONTRACT</span>
                    </h1>
                    <p style={{ color: 'rgba(242, 13, 13, 0.6)', maxWidth: '400px', margin: '0 auto' }}>
                        Terminal interaction suspended. Behavioral fingerprint flagged.
                    </p>
                </div>

                <button className={styles.restoreButton} onClick={handleRestore}>
                    <span>Restore Authority: ₹99</span>
                    <span className="material-symbols-outlined">restart_alt</span>
                </button>
                <div style={{ fontSize: '9px', color: '#f20d0d', marginTop: '1rem', letterSpacing: '0.1em' }}>
                    PAYMENT DOES NOT NEGATE FAILURE. IT MERELY RESTORES ACCESS.
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Audit ID</span>
                        <span style={{ color: 'white', fontWeight: 700 }}>#8829-X-FAIL</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>User_Sig</span>
                        <span style={{ color: 'white', fontWeight: 700 }}>ALPHA_UNIFIED</span>
                    </div>
                    <div className={styles.statBox} style={{ backgroundColor: 'rgba(242, 13, 13, 0.1)' }}>
                        <span className={styles.statLabel} style={{ color: '#f20d0d' }}>Status</span>
                        <span style={{ color: '#f20d0d', fontWeight: 900 }}>LOCKED</span>
                    </div>
                </div>

                <div className={styles.auditLog}>
                    <div className={styles.logHeader}>
                        <span>Violation_Log_Buffer</span>
                        <span style={{ opacity: 0.5 }}>Offset: 0x00</span>
                    </div>
                    <table className={styles.logTable}>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Type</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {violations.map((v, i) => (
                                <tr key={i}>
                                    <td style={{ opacity: 0.5 }}>{v.timestamp.split('T')[1].split('.')[0]}</td>
                                    <td><span style={{ backgroundColor: 'rgba(242, 13, 13, 0.2)', padding: '2px 4px', fontSize: '10px', fontWeight: 700 }}>{v.type}</span></td>
                                    <td>UNAUTHORIZED_ACTION_DETECTED</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.countdownWrapper}>
                    <button className={styles.restoreButton} onClick={handleRestore}>
                        Restore Access — ₹499
                    </button>
                </div>
            </main>
        </div>
    );
}
