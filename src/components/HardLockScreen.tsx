'use client';
import React from 'react';
import styles from './HardLockScreen.module.css';

export default function HardLockScreen({ onLock, loading }: { onLock: () => void, loading?: boolean }) {
    return (
        <div className={styles.container}>
            <div className={styles.scanline}></div>
            <header className={styles.header}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#f20d0d' }}>history_edu</span>
                    <h2 className={styles.headerTitle}>Academic Integrity Enforcer</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: '#f20d0d' }}>FOCUS_LOCK ACTIVE</span>
                    <span>SESSION: FINAL_PREP</span>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#f20d0d' }}>history_edu</span>
                            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', color: '#f20d0d', textTransform: 'uppercase' }}>PROTOCOL 07 // DEEP STUDY</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(242, 13, 13, 0.6)' }}>TARGET: 2024-05-15</div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.leftPanel}>
                            <div style={{ fontSize: '10px', color: 'rgba(242, 13, 13, 0.4)', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1rem' }}>Remaining Study Window</div>
                            <div className={styles.timer}>02:44:59</div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill}></div>
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                <span>Start: 08:00</span>
                                <span>Progress: 65%</span>
                                <span>Target: 12:00</span>
                            </div>
                        </div>

                        <div className={styles.rightPanel}>
                            <div>
                                <h4 className={styles.sectionTitle}>Exam Commitments</h4>
                                <div className={styles.list}>
                                    <div className={styles.listItem}><span style={{ color: '#f20d0d', fontWeight: 700 }}>01</span> ZERO-TOLERANCE DISTRACTION POLICY.</div>
                                    <div className={styles.listItem}><span style={{ color: '#f20d0d', fontWeight: 700 }}>02</span> EXTERNAL SYNC NODES SEVERED.</div>
                                    <div className={styles.listItem}><span style={{ color: '#f20d0d', fontWeight: 700 }}>03</span> REMAINING QUOTA: 4 UNITS.</div>
                                </div>
                            </div>
                            <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>Security Parameters</h4>
                                <div className={styles.list}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>SOCIAL</span><span style={{ color: '#f20d0d', fontWeight: 700 }}>[ LOCKED ]</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>NOTIFICATIONS</span><span style={{ color: '#f20d0d', fontWeight: 700 }}>[ SHUTDOWN ]</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.warningBox}>
                            <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Commit to Final Focus</h3>
                            <p className={styles.warningText}>Initiating the Hard-Lock protocol will disable all communication. There is <span style={{ color: '#f20d0d' }}>no override</span> until countdown zero.</p>
                        </div>
                        <button
                            className={styles.lockButton}
                            onClick={onLock}
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
                        >
                            <span>{loading ? 'INITIALIZING...' : 'Initialize Hard-Lock'}</span>
                            <span className="material-symbols-outlined">lock</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
