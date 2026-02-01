'use client';
import React from 'react';
import styles from './FailureScreen.module.css';

interface Violation {
    type: string;
    timestamp: string;
}

export default function FailureScreen({ violations }: { violations: Violation[] }) {
    // 1. Cooldown Logic
    const [secondsLeft, setSecondsLeft] = React.useState(300); // 5 Minutes Cooldown
    const [ritualText, setRitualText] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRestore = async () => {
        if (secondsLeft > 0) return;
        if (ritualText !== "I have failed my objective") {
            alert("Ritual phrase incorrect. Acknowledge your failure.");
            return;
        }

        setIsSubmitting(true);
        // Reset via API
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
                        System interaction suspended. Behavioral fingerprint flagged.
                        <br />
                        <span style={{ color: 'white', marginTop: '1rem', display: 'block' }}>
                            Wait for the cooldown to expire, then acknowledge your failure to proceed.
                        </span>
                    </p>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Penalty Timer</span>
                        <span style={{ color: '#f20d0d', fontWeight: 700, fontSize: '1.25rem' }}>
                            {secondsLeft > 0 ? formatTime(secondsLeft) : "READY"}
                        </span>
                    </div>
                </div>

                <div className={styles.auditLog}>
                    {/* ... (Keep existing log) ... */}
                </div>

                <div className={styles.countdownWrapper} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                        <label style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ritual Phrase</label>
                        <input
                            type="text"
                            placeholder="Type: I have failed my objective"
                            value={ritualText}
                            onChange={(e) => setRitualText(e.target.value)}
                            disabled={secondsLeft > 0}
                            style={{
                                background: 'rgba(20,20,20,0.8)',
                                border: '1px solid #333',
                                padding: '1rem',
                                color: 'white',
                                fontFamily: 'var(--font-mono)',
                                borderRadius: '4px',
                                outline: 'none',
                                opacity: secondsLeft > 0 ? 0.5 : 1
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '12px', color: '#f20d0d', marginBottom: '0.5rem' }}>
                            Waiting 5 days increases daily load by +32 minutes.<br />
                            Without this system, decisions are yours again.
                        </div>
                    </div>

                    <button
                        className={styles.restoreButton}
                        onClick={handleRestore}
                        disabled={secondsLeft > 0 || isSubmitting}
                        style={{
                            opacity: secondsLeft > 0 ? 0.3 : 1,
                            cursor: secondsLeft > 0 ? 'not-allowed' : 'pointer',
                            pointerEvents: secondsLeft > 0 ? 'none' : 'auto'
                        }}
                    >
                        <span>{isSubmitting ? "PROCESSING..." : "Restore 7-Day Lock — ₹99"}</span>
                        <span className="material-symbols-outlined">restart_alt</span>
                    </button>

                    {secondsLeft > 0 && (
                        <div style={{ fontSize: '9px', color: '#f20d0d', alignSelf: 'center', letterSpacing: '0.1em', animation: 'pulse 2s infinite' }}>
                            SYSTEM LOCKDOWN ACTIVE
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
