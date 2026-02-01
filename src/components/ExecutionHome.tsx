'use client';

import React from 'react';
import { ActiveSession } from '@/lib/types';
import styles from './ExecutionHome.module.css';

interface ExecutionHomeProps {
    session: ActiveSession;
    onStart: () => void;
    onViewTrack: () => void;
    onExit: () => void;
}

export default function ExecutionHome({ session, onStart, onViewTrack, onExit }: ExecutionHomeProps) {
    return (
        <div className={styles.container}>
            {/* Top Bar / Status */}
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.statusDot}></div>
                    <span className={styles.statusText}>EXECUTION STATUS: ACTIVE</span>
                </div>
                <div className={styles.trackName}>{session.mainTitle || 'Midterm 1 – Maths'}</div>
            </header>

            <main className={styles.main}>
                {/* Requirements Block */}
                <div className={styles.requirementsCard}>
                    <h3 className={styles.cardTitle}>TODAY&apos;S REQUIREMENT</h3>
                    <div className={styles.reqList}>
                        <div className={styles.reqItem}>
                            <span className="material-symbols-outlined icon">timer</span>
                            <span>78 minutes</span>
                        </div>
                        <div className={styles.reqItem}>
                            <span className="material-symbols-outlined icon">publish</span>
                            <span>1 topic advancement</span>
                        </div>
                        <div className={styles.reqItem}>
                            <span className="material-symbols-outlined icon">shield</span>
                            <span>2 topics protected</span>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.statBox}>
                        <div className={styles.statLabel}>FAILURES USED</div>
                        <div className={styles.statValue}>
                            <span style={{ color: session.violations.length > 0 ? '#f43f5e' : 'white' }}>
                                {session.violations.length}
                            </span>
                            <span style={{ color: '#64748b' }}> / 2</span>
                        </div>
                    </div>
                    <div className={styles.statBox}>
                        <div className={styles.statLabel}>DESCRIPTION</div>
                        <div className={styles.statValue}>ACTIVE</div>
                    </div>
                </div>

                {/* Primary Action */}
                <div className={styles.actionArea}>
                    <button className={styles.startBtn} onClick={onStart}>
                        <span className="material-symbols-outlined">play_arrow</span>
                        START SESSION
                    </button>
                    <div className={styles.actionSubtext}>
                        Initiating session locks environment for 78m
                    </div>
                </div>
            </main>

            {/* Footer / Secondary Actions */}
            <footer className={styles.footer}>
                <button className={styles.secondaryBtn} onClick={onViewTrack}>
                    <span className="material-symbols-outlined">visibility</span>
                    VIEW TRACK
                </button>
                <div className={styles.divider}></div>
                <button className={`${styles.secondaryBtn} ${styles.danger}`} onClick={onExit}>
                    <span className="material-symbols-outlined">logout</span>
                    EXIT & LOSE STATE
                </button>
            </footer>
        </div>
    );
}
