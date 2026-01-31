'use client';

import React from 'react';
import { ActiveSession } from '@/lib/types';
import styles from './Dashboard.module.css';

interface DashboardProps {
    session: ActiveSession;
    onStart: () => void;
}

export default function Dashboard({ session, onStart }: DashboardProps) {
    const [activeTab, setActiveTab] = React.useState<'today' | 'timeline' | 'history'>('today');

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBox}>
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '20px' }}>terminal</span>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em', color: 'white' }}>EXECUTION</div>
                        <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600 }}>PREMIUM SYSTEM</div>
                    </div>
                </div>
                <nav className={styles.nav}>
                    <div
                        className={`${styles.navItem} ${activeTab === 'today' ? styles.active : ''}`}
                        onClick={() => setActiveTab('today')}
                    >
                        <span className="material-symbols-outlined">today</span>
                        <span>Today</span>
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'timeline' ? styles.active : ''}`}
                        onClick={() => setActiveTab('timeline')}
                    >
                        <span className="material-symbols-outlined">timeline</span>
                        <span>Timeline</span>
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'history' ? styles.active : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <span className="material-symbols-outlined">history</span>
                        <span>History</span>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {activeTab === 'today' && (
                    <div className={styles.contentWrapper}>
                        {/* Header */}
                        <div className={styles.header}>
                            <div>
                                <h1 className={styles.title}>Today's Plan</h1>
                                <p className={styles.subtitle}>{session.date || 'Monday, October 24th'} • <span style={{ color: '#7b5cfa', fontWeight: 'bold' }}>High-Stakes Focus Mode</span></p>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.btnSecondary}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>pause_circle</span>
                                    Hold
                                </button>
                                <button className={styles.btnPrimary} onClick={onStart}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span>
                                    Start Session
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className={styles.statsGrid}>
                            {/* Progress Card */}
                            <div className={`${styles.card} ${styles.colSpan2}`}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div className={styles.progressLabel}>Execution Progress</div>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                            <span className={styles.bigStat}>{session.progressPercent}%</span>
                                            <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 700 }}>+5.2% Today</span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Next milestone: <span style={{ color: 'white' }}>Mock Exam Alpha</span></p>
                                    </div>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid #1E293B', borderTopColor: '#5B7CFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: '#5B7CFA', fontWeight: 700 }}>{session.progressPercent}%</span>
                                    </div>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${session.progressPercent}%` }}></div>
                                </div>
                            </div>

                            {/* Violations */}
                            <div className={`${styles.card} ${styles.violationCard}`}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className={styles.progressLabel} style={{ color: '#f43f5e' }}>Violations</div>
                                    <span className="material-symbols-outlined" style={{ color: '#f43f5e' }}>warning</span>
                                </div>
                                <div className={styles.bigStat}>{session.violations.length.toString().padStart(2, '0')}</div>
                                <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, marginTop: '0.25rem' }}>INTEGRITY ALERT</div>
                            </div>
                        </div>

                        {/* Queue Table */}
                        <div className={styles.queueCard}>
                            <div className={styles.queueHeader}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', margin: 0 }}>Execution Queue</h3>
                            </div>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Time Block</th>
                                            <th>Objective</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ color: '#64748b', textDecoration: 'line-through' }}>08:00 - 09:30</td>
                                            <td style={{ color: '#64748b', textDecoration: 'line-through' }}>Quant Review: Probability Distribution</td>
                                            <td><span className={`${styles.statusPill} ${styles.statusCompleted}`}>ARCHIVED</span></td>
                                            <td><span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '18px' }}>more_horiz</span></td>
                                        </tr>
                                        <tr style={{ backgroundColor: 'rgba(123, 92, 250, 0.05)', borderLeft: '2px solid #7b5cfa' }}>
                                            <td>
                                                <div style={{ fontWeight: 700, color: 'white' }}>10:00 - 12:30</div>
                                                <div style={{ fontSize: '0.625rem', color: '#7b5cfa', fontWeight: 900, marginTop: '2px' }}>CURRENT PHASE</div>
                                            </td>
                                            <td style={{ fontWeight: 700, color: 'white' }}>Mock Exam: Session Alpha (Analytical)</td>
                                            <td><span className={`${styles.statusPill} ${styles.statusActive}`}>IN PROGRESS</span></td>
                                            <td><span className="material-symbols-outlined" style={{ color: '#7b5cfa', fontSize: '18px' }}>open_in_new</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className={styles.contentWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.5 }}>pending</span>
                            <h3>Timeline View</h3>
                            <p>Visual session history and future projections coming in v1.1</p>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className={styles.contentWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.5 }}>history_edu</span>
                            <h3>System Logs</h3>
                            <p>Deep audit logs of all past sessions will appear here.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
