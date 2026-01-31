'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActiveSession } from '@/lib/types';
import styles from './Dashboard.module.css';

export default function Dashboard({ session }: { session: ActiveSession }) {
    const router = useRouter();

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                console.log("VIOLATION: HIDDEN");
                await fetch('/api/violation/record', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'TAB_SWITCH' })
                });
                router.refresh();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [router]);

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarLogo}>
                        <span className="material-symbols-outlined" style={{ color: 'white' }}>terminal</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>EXECUTION</span>
                </div>
                <nav className={styles.nav}>
                    <div className={`${styles.navItem} ${styles.active}`}>
                        <span className="material-symbols-outlined">today</span>
                        <span>Today</span>
                    </div>
                </nav>
            </aside>

            <main className={styles.main}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{session.mainTitle}</h1>
                        <p className={styles.subtitle}>{session.date} • <span style={{ color: 'var(--primary)' }}>Strict Mode</span></p>
                    </div>
                    <button style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        ABORT (FAIL)
                    </button>
                </div>

                <div className={styles.statsGrid}>
                    {/* Violations Card */}
                    <div className={`${styles.card} ${styles.violationCard}`}>
                        <div className={styles.violationLabel}>VIOLATIONS (MAX 2)</div>
                        <div className={styles.violationCount}>
                            0{Math.min(session.violations.length, 2)}
                        </div>
                        {session.violations.map(v => (
                            <div key={v.id} style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                                {v.type} @ {v.timestamp.split('T')[1].split('.')[0]}
                            </div>
                        ))}
                    </div>

                    <div className={styles.card}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 'bold' }}>Progress</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{session.progressPercent}%</div>
                    </div>
                </div>

                <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                    <table className={styles.queueTable}>
                        <thead>
                            <tr>
                                <th>Time Block</th>
                                <th>Objective</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {session.queue.length === 0 && (
                                <tr><td colSpan={3} style={{ textAlign: 'center', color: '#6b7280' }}>No active tasks. Syllabus Sync required.</td></tr>
                            )}
                            {session.queue.map(task => (
                                <tr key={task.id}>
                                    <td>{task.timeBlock}</td>
                                    <td style={{ fontWeight: 500 }}>{task.title}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold',
                                            backgroundColor: task.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(123, 92, 250, 0.1)',
                                            color: task.status === 'COMPLETED' ? '#10b981' : '#7b5cfa'
                                        }}>
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
