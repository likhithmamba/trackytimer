'use client';
import React from 'react';
import styles from './TracksScreen.module.css';

const TRACKS = [
    { id: 'track_bar', name: 'Bar Exam 2024', desc: 'Legal Studies • Q3 Intake', progress: 82, intensity: 5 },
    { id: 'track_usmle', name: 'USMLE Step 1', desc: 'Medical Boards • 2024 Edition', progress: 45, intensity: 4 },
    { id: 'track_cfa', name: 'CFA Level II', desc: 'Financial Analysis • 2024', progress: 12, intensity: 5 }
];

export default function TracksScreen({ onSelect }: { onSelect: (trackId: string) => void }) {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>terminal</span>
                    <h1 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase' }}>05 Track</h1>
                </div>
                <nav className={styles.nav}>
                    <div className={`${styles.navItem} ${styles.active}`}>
                        <span className="material-symbols-outlined">layers</span>
                        <span>Exam Tracks</span>
                    </div>
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', padding: '0.5rem 1rem', width: '300px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>search</span>
                        <input type="text" placeholder="Search tracks..." style={{ background: 'transparent', border: 'none', marginLeft: '0.5rem', outline: 'none', fontSize: '0.875rem' }} />
                    </div>
                    <button style={{ backgroundColor: '#19e6ca', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bolt</span>
                        Execute Session
                    </button>
                </header>

                <div className={styles.content}>
                    <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                            <div>
                                <h2 className={styles.pageTitle}>Multi-Exam Selector</h2>
                                <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Manage and execute your high-commitment exam tracks.</p>
                            </div>
                            <button style={{ border: '2px solid #cbd5e1', color: '#475569', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="material-symbols-outlined" style={{ color: '#19e6ca' }}>add_circle</span>
                                Add Exam
                            </button>
                        </div>

                        <div className={styles.tracksList}>
                            {TRACKS.map(track => (
                                <div key={track.id} className={styles.trackCard} onClick={() => onSelect(track.id)}>
                                    <div className={styles.iconBox}>
                                        <span className="material-symbols-outlined">balance</span>
                                    </div>
                                    <div className={styles.trackInfo}>
                                        <h3 className={styles.trackName}>{track.name}</h3>
                                        <p className={styles.trackMeta}>{track.desc}</p>
                                    </div>

                                    <div className={styles.intensity}>
                                        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Intensity Level</span>
                                        <div className={styles.segmentedBar}>
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className={`${styles.segment} ${i < track.intensity ? styles.filled : ''}`}></div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.progress}>
                                        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Progress</p>
                                        <p className={styles.progressVal}>{track.progress}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
