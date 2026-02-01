'use client';
import React, { useEffect, useState } from 'react';
import styles from './NoirSessionScreen.module.css';
import { ActiveSession } from '@/lib/types';

import { useRouter } from 'next/navigation';

export default function NoirSessionScreen({ session }: { session: ActiveSession }) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<number | null>(null); // Start null to hide 00:00:00
    const [isMounting, setIsMounting] = useState(true);

    useEffect(() => {
        // Fake "System Resume" delay
        const timer = setTimeout(() => setIsMounting(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Sync Timer
    useEffect(() => {
        if (!session.startTime || !session.durationMinutes) return;
        const end = new Date(session.startTime).getTime() + session.durationMinutes * 60000;

        const tick = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((end - now) / 1000));
            setTimeLeft(diff);
        };
        tick();
        const i = setInterval(tick, 1000);
        return () => clearInterval(i);
    }, [session]);

    const displayTime = timeLeft !== null ? timeLeft : (session.durationMinutes || 0) * 60; // Fallback to full duration or 0

    const h = Math.floor(displayTime / 3600);
    const m = Math.floor((displayTime % 3600) / 60);
    const s = displayTime % 60;

    const fmt = (n: number) => n.toString().padStart(2, '0');

    const handleHold = async () => {
        await fetch('/api/session/current', { method: 'POST', body: JSON.stringify({ action: 'PAUSE' }) });
        router.refresh();
    };

    // HEARTBEAT LOOP
    useEffect(() => {
        if (!session || session.status !== 'RUNNING') return;

        const heartbeat = setInterval(() => {
            // We fire-and-forget the heartbeat
            fetch('/api/session/heartbeat', {
                method: 'POST',
                body: JSON.stringify({ sessionId: 'CURRENT' }) // Backend will resolve 'CURRENT' to active session
            }).catch(err => console.error("Heartbeat failed", err));
        }, 30000); // 30 seconds

        return () => clearInterval(heartbeat);
    }, [session]);

    return (
        <div className={styles.container}>
            {/* ... Rest of component ... */}
            {/* Resume Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: '#050505',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.8s ease-out',
                    opacity: isMounting ? 1 : 0,
                    pointerEvents: isMounting ? 'all' : 'none'
                }}
            >
                <div style={{ color: '#0d46f2', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    Re-establishing Uplink
                </div>
                <div style={{ width: '200px', height: '2px', backgroundColor: 'rgba(13, 70, 242, 0.2)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
                        backgroundColor: '#0d46f2',
                        animation: 'scan 1.5s infinite linear'
                    }}></div>
                </div>
                <style jsx>{`
                    @keyframes scan {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(200%); }
                    }
                `}</style>
            </div>

            {/* Resume Overlay */}
            {/* ... (Keep existing resume overlay logic) ... */}

            {/* Warning Overlay (1st Failure) */}
            {session.warningTriggered && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(242, 13, 13, 0.9)',
                    zIndex: 10000,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'white', marginBottom: '1rem' }}>warning</span>
                    <h1 style={{ color: 'white', fontWeight: 900, fontSize: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Warning</h1>
                    <p style={{ color: 'white', fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
                        You have used 1 of 2 allowed failures.<br />
                        The next failure will revoke access.
                    </p>
                    <button
                        onClick={() => router.refresh()} // Acknowledge by refreshing/clearing warning (requires backend loop update)
                        style={{ padding: '1rem 3rem', background: 'white', color: '#f20d0d', border: 'none', fontWeight: 900, fontSize: '1.25rem', cursor: 'pointer', textTransform: 'uppercase' }}
                    >
                        Continue Execution
                    </button>
                </div>
            )}

            <div className={styles.bgPulse}></div>
            <header className={styles.header}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#0d46f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: 'white' }}>security</span>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Noir System</h1>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#0d46f2', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Authority Protocol Active</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Protocol Status</div>
                        <div style={{ fontSize: '12px', fontWeight: 500 }}>ENFORCED</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#282c39', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'white' }}>person</span>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.grid}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className={styles.glassPanel}>
                            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Session Context</h3>
                            <h2 className={styles.sessionTitle}>Session 10</h2>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"Active Discipline Variant. Maintain integrity at all costs."</p>
                        </div>

                        <div className={styles.glassPanel}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Integrity</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: session.warningTriggered ? '#f20d0d' : '#0d46f2' }}>
                                    {session.warningTriggered ? 'COMPROMISED' : 'SECURE'}
                                </span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: session.warningTriggered ? '50%' : '100%', height: '100%', backgroundColor: session.warningTriggered ? '#f20d0d' : '#0d46f2', boxShadow: '0 0 10px rgba(13,70,242,0.5)' }}></div>
                            </div>
                            {session.warningTriggered && (
                                <p style={{ fontSize: '10px', fontWeight: 700, color: '#f20d0d', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1rem' }}>
                                    WARNING ACTIVE: NEXT VIOLATION LOCKS
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Center Column - Timer */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                        <div className={`${styles.glassPanel} ${styles.timerCore}`}>
                            <div style={{ position: 'absolute', top: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0d46f2' }}></span>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Temporal Lock Active</span>
                            </div>

                            <div className={styles.timerDisplay}>
                                <div>
                                    <div className={styles.digitBox}>{fmt(h)}</div>
                                    <div className={styles.digitLabel}>Hours</div>
                                </div>
                                <span style={{ fontSize: '3rem', fontWeight: 700, color: 'rgba(255,255,255,0.2)', marginBottom: '2rem' }}>:</span>
                                <div>
                                    <div className={styles.digitBox}>{fmt(m)}</div>
                                    <div className={styles.digitLabel}>Minutes</div>
                                </div>
                                <span style={{ fontSize: '3rem', fontWeight: 700, color: 'rgba(255,255,255,0.2)', marginBottom: '2rem' }}>:</span>
                                <div>
                                    <div className={styles.digitBox}>{fmt(s)}</div>
                                    <div className={styles.digitLabel}>Seconds</div>
                                </div>
                            </div>

                            <div className={styles.controlButtons}>
                                <button className={`${styles.actionBtn} ${styles.pauseBtn}`} onClick={handleHold}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>pause</span>
                                    Hold Session
                                </button>
                                <button className={`${styles.actionBtn} ${styles.abortBtn}`}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cancel</span>
                                    Abort
                                </button>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '18px', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Phase II: <span style={{ fontWeight: 700 }}>Controlled Extraction</span></h1>
                            <div style={{ width: '48px', height: '2px', backgroundColor: '#0d46f2', margin: '0.5rem auto 0' }}></div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles.glassPanel} style={{ height: 'fit-content' }}>
                        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="material-symbols-outlined" style={{ color: '#0d46f2', fontSize: '16px' }}>list_alt</span>
                                Objectives
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(13, 70, 242, 0.2)', borderRadius: '8px', border: '1px solid rgba(13, 70, 242, 0.3)' }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Prime Objective</p>
                                <p style={{ fontSize: '11px', opacity: 0.6 }}>Maintain cognitive focus without diversion.</p>
                            </div>
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', opacity: 0.6 }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>System Sync</p>
                                <p style={{ fontSize: '11px', opacity: 0.6 }}>Calibrate biometric feedback loops.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
