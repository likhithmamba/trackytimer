'use client';

import React from 'react';
import styles from './SyllabusScreen.module.css'; // Reusing Syllabus styles for visual consistency

export default function ReadOnlyTrackView({ onClose }: { onClose: () => void }) {
    // Mock data for display - in real app this would come from a prop or context
    const objectives = [
        { id: '1', text: 'Quadratic Equations (Review)', priority: 'P0', status: 'PENDING' },
        { id: '2', text: 'Probability Distribution Basics', priority: 'P1', status: 'COMPLETED' },
        { id: '3', text: 'Vector Calculus: Gradient Descent', priority: 'P1', status: 'DROPPED' }
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarIcon}><span className="material-symbols-outlined" onClick={onClose} style={{ cursor: 'pointer' }}>arrow_back</span></div>
            </aside>

            <main className={styles.main}>
                <div className={styles.topBar}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#94a3b8' }}>READ_ONLY_MODE</span>
                        <span style={{ color: '#52525b' }}>{'//'} TRACK.VIEWER</span>
                    </div>
                    <div><button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}>CLOSE X</button></div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.matrixPanel} style={{ gridColumn: 'span 2' }}>
                        <div className={styles.matrixHeader}>
                            <h2 className={styles.panelTitle}>Committed Objectives Matrix</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {objectives.map(obj => (
                                <div key={obj.id} className={styles.objectiveRow} style={{ opacity: obj.status === 'DROPPED' ? 0.5 : 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className={`${styles.statusIndicator} ${obj.status === 'PENDING' ? styles.active : ''}`}></div>
                                    </div>
                                    <div style={{ fontWeight: 500, textDecoration: obj.status === 'DROPPED' ? 'line-through' : 'none' }}>{obj.text}</div>
                                    <div style={{ color: '#c026d3', fontWeight: 700, fontSize: '10px' }}>{obj.priority}</div>
                                    <div style={{ color: obj.status === 'COMPLETED' ? '#10b981' : obj.status === 'DROPPED' ? '#ef4444' : '#71717a', fontSize: '10px' }}>{obj.status}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444', fontSize: '12px', borderTop: '1px solid #333', marginTop: 'auto' }}>
                            READ ONLY MODE. CHANGES ARE LOCKED BY PROTOCOL.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
