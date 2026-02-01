'use client';
import React, { useEffect, useState } from 'react';
import styles from './NoirSessionScreen.module.css';
import { ActiveSession } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function NoirSessionScreen({ session }: { session: ActiveSession }) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isMounting, setIsMounting] = useState(true);

    useEffect(() => {
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

    const displayTime = timeLeft !== null ? timeLeft : (session.durationMinutes || 0) * 60;
    const h = Math.floor(displayTime / 3600);
    const m = Math.floor((displayTime % 3600) / 60);
    const s = displayTime % 60;
    const fmt = (n: number) => n.toString().padStart(2, '0');

    // Ring Progress Calculation
    const totalSeconds = (session.durationMinutes || 60) * 60;
    const progressRatio = displayTime / totalSeconds;
    // Circle details: r=200, circumference = 2 * pi * 200 ≈ 1256
    const circumference = 1256;
    const strokeDashoffset = circumference - (progressRatio * circumference);

    const handleHold = async () => {
        await fetch('/api/session/current', { method: 'POST', body: JSON.stringify({ action: 'PAUSE' }) });
        router.refresh();
    };

    const handleAbort = async () => {
        if (!confirm("Are you sure you want to abort? This counts as a failure.")) return;
        await fetch('/api/session/current', {
            method: 'POST',
            body: JSON.stringify({ action: 'ABORT' })
        });
        router.refresh();
    };

    // HEARTBEAT LOOP
    useEffect(() => {
        if (!session || session.status !== 'RUNNING') return;
        const heartbeat = setInterval(() => {
            fetch('/api/session/heartbeat', {
                method: 'POST',
                body: JSON.stringify({ sessionId: 'CURRENT' })
            }).catch(err => console.error("Heartbeat failed", err));
        }, 30000);
        return () => clearInterval(heartbeat);
    }, [session]);

    return (
        <div className={styles.container}>
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
                <div style={{ color: '#2bd4bd', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    Re-establishing Uplink
                </div>
                <div style={{ width: '200px', height: '2px', backgroundColor: 'rgba(43, 212, 189, 0.2)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
                        backgroundColor: '#2bd4bd',
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

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className={styles.pulsingDotWrapper}>
                            <span className={styles.pulsingDot}></span>
                            <span className={styles.solidDot}></span>
                        </div>
                        <h2 className={styles.headerTitle}>Session Locked | Live</h2>
                    </div>
                    <div className={styles.headerDivider}></div>
                    <div className={styles.consoleRestricted}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                        Console Restricted
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.violationBox}>
                        <span className={styles.violationLabel}>Violations</span>
                        <span className={styles.violationCount}>{session.violations.length}/2</span>
                    </div>
                    <div className={styles.shieldIcon}>
                        <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.6)' }}>shield_with_heart</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.ambientBg}>
                    <div className={styles.ambientGlow}></div>
                </div>

                <div className={styles.contentWrapper}>
                    {/* Ring Timer */}
                    <div className={styles.ringContainer}>
                        <svg className={styles.ringSvg}>
                            <circle className={styles.ringBg} cx="210" cy="210" fill="none" r="200" stroke="currentColor" strokeWidth="1"></circle>
                            <circle
                                className={styles.ringProgress}
                                cx="210" cy="210"
                                fill="none" r="200"
                                stroke="currentColor"
                                strokeDasharray="1256"
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                strokeWidth="4"
                            ></circle>
                        </svg>

                        <div className={styles.timerContent}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span className={styles.timerLabel}>Remaining Time</span>
                                <div className={styles.timerDisplay}>
                                    <div className={styles.timerGroup}>
                                        <span>{fmt(h)}</span>
                                        <span className={styles.timerUnit}>Hours</span>
                                    </div>
                                    <span className={styles.timerSep}>:</span>
                                    <div className={styles.timerGroup}>
                                        <span>{fmt(m)}</span>
                                        <span className={styles.timerUnit}>Minutes</span>
                                    </div>
                                    <span className={styles.timerSep}>:</span>
                                    <div className={styles.timerGroup}>
                                        <span>{fmt(s)}</span>
                                        <span className={styles.timerUnit}>Seconds</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressSection}>
                        <div className={styles.progressHeader}>
                            <span className={styles.progressTitle}>Global Progress</span>
                            <span className={styles.progressValue}>{session.progressPercent}% Session Capacity</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.progressFill} style={{ width: `${session.progressPercent}%` }}></div>
                        </div>
                        <p className={styles.progressFooter}>Teal Pulse Enforcement Active • Bio-Metric Lock Engaged</p>
                    </div>

                    {/* Task List (Using session.queue) */}
                    <div className={styles.taskSection}>
                        <h2 className={styles.taskTitle}>Active Enforcement Tasks</h2>
                        <div className={styles.taskList}>
                            {session.queue.length > 0 ? (
                                session.queue.map(task => (
                                    <div key={task.id} className={styles.taskItem}>
                                        <label className={styles.taskLabel}>
                                            <input type="checkbox" className={styles.taskCheckbox} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <p className={styles.taskText}>{task.title}</p>
                                                <p className={styles.taskSub}>
                                                    {task.intensity} PRIORITY • {task.timeBlock}
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                                    NO ACTIVE TASKS IN QUEUE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hidden Actions for Abort/Pause (Hover to reveal) */}
                    <div className={styles.actionsOverlay}>
                        <button className={styles.actionBtn} onClick={handleHold}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>pause</span>
                            Hold
                        </button>
                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleAbort}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>close</span>
                            Abort
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerItem}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#2bd4bd' }}>visibility</span>
                        <span className={styles.footerText}>Eye-Tracking Active</span>
                    </div>
                    <div className={styles.footerDot}></div>
                    <div className={styles.footerItem}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#2bd4bd' }}>wifi_off</span>
                        <span className={styles.footerText}>Network Isolated</span>
                    </div>
                    <div className={styles.footerDot}></div>
                    <div className={styles.footerItem}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#2bd4bd' }}>keyboard</span>
                        <span className={styles.footerText}>Keystroke Log Active</span>
                    </div>
                </div>
            </footer>

            {/* Border Overlay */}
            <div className={styles.overlayHint}></div>
        </div>
    );
}
