'use client';
import React from 'react';
import styles from './TracksScreen.module.css';

const TRACKS = [
    { id: 'track_bar', name: 'Bar Exam 2024', desc: 'Legal Studies • Q3 Intake', progress: 82, intensity: 5 },
    { id: 'track_usmle', name: 'USMLE Step 1', desc: 'Medical Boards • 2024 Edition', progress: 45, intensity: 4 },
    { id: 'track_cfa', name: 'CFA Level II', desc: 'Financial Analysis • 2024', progress: 12, intensity: 5 }
];


export default function TracksScreen({ onSelect }: { onSelect: (trackId: string) => void }) {

    const [toast, setToast] = React.useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className={styles.container}>
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    background: '#0f172a', border: '1px solid #334155',
                    color: '#fff', padding: '1rem', borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', zIndex: 9999,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ color: '#19e6ca' }}>info</span>
                        <span>{toast}</span>
                    </div>
                </div>
            )}

            <aside className={styles.sidebar}>
                {/* ... Sidebar content identical ... */}
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', padding: '0.5rem 1rem', width: '300px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>search</span>
                        <input type="text" placeholder="Search tracks..." style={{ background: 'transparent', border: 'none', marginLeft: '0.5rem', outline: 'none', fontSize: '0.875rem' }} />
                    </div>
                    <button
                        onClick={() => onSelect(TRACKS[0].id)}
                        style={{ backgroundColor: '#19e6ca', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bolt</span>
                        Execute Session
                    </button>
                </header>

                <div className={styles.content}>
                    <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                        <div className={styles.createTrackSection} style={{ marginBottom: '3rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.5)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '1rem', textTransform: 'uppercase' }}>Create Execution Track</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>TRACK NAME</label>
                                    <input type="text" placeholder="e.g. Midterm Prep" style={{ width: '100%', padding: '0.75rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>PURPOSE</label>
                                    <select style={{ width: '100%', padding: '0.75rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px' }}>
                                        <option>Academic Exam</option>
                                        <option>Professional Cert</option>
                                        <option>Skill Acquisition</option>
                                    </select>
                                </div>
                                <button className={styles.createBtn} onClick={() => onSelect('new_track')} style={{ padding: '0.75rem 1.5rem', background: '#7b5cfa', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>
                                    CREATE
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                            <div>
                                <h2 className={styles.pageTitle}>Existing Tracks</h2>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Select a context to resume execution.</p>
                            </div>
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
