'use client';
import React, { useState } from 'react';
import styles from './SyllabusScreen.module.css';

interface Objective {
    id: string;
    text: string;
    priority: 'P0' | 'P1' | 'P2';
    status: 'PENDING' | 'ACTIVE';
}

export default function SyllabusScreen({ onComplete }: { onComplete: (objectives: string[]) => void }) {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [input, setInput] = useState('');

    const addObjective = () => {
        if (!input.trim() || input.length < 5) {
            alert("DATA_INTEGRITY_ERROR: Objective too short. Min 5 chars.");
            return;
        }
        const newObj: Objective = {
            id: Date.now().toString(),
            text: input,
            priority: 'P1',
            status: 'PENDING'
        };
        setObjectives([...objectives, newObj]);
        setInput('');
    };

    const activeCount = objectives.length;

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarIcon}><span className="material-symbols-outlined">grid_view</span></div>
                <div className={`${styles.sidebarIcon} ${styles.active}`}><span className="material-symbols-outlined">data_object</span></div>
                <div className={styles.sidebarIcon}><span className="material-symbols-outlined">terminal</span></div>
            </aside>

            <main className={styles.main}>
                <div className={styles.topBar}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#c026d3' }}>MANUAL SYLLABUS ENTRY</span>
                        <span style={{ color: '#52525b' }}>{'//'} COGNITIVE.OWNERSHIP</span>
                    </div>
                    <div>STATUS: AWAITING INPUT</div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.matrixPanel}>
                        <div className={styles.matrixHeader}>
                            <h2 className={styles.panelTitle}>Active Objectives Matrix [{activeCount}]</h2>
                            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700 }}>WARNING: EDITS ARE FINAL</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {objectives.map(obj => (
                                <div key={obj.id} className={styles.objectiveRow}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className={`${styles.statusIndicator} ${styles.active}`}></div>
                                    </div>
                                    <div style={{ fontWeight: 500 }}>{obj.text}</div>
                                    <div style={{ color: '#c026d3', fontWeight: 700, fontSize: '10px' }}>{obj.priority}</div>
                                    <div style={{ color: '#71717a', fontSize: '10px' }}>{obj.status}</div>
                                </div>
                            ))}
                            {objectives.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#3f3f46', fontSize: '12px' }}>
                                    YOU MUST MANUALLY TYPE WHAT YOU NEED TO STUDY.<br />
                                    THIS CANNOT BE AUTO-GENERATED.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.controlPanel}>
                        <div className={styles.logPanel}>
                            <div style={{ marginBottom: '0.5rem' }}>[SYSTEM] Initializing input stream...</div>
                            <div style={{ marginBottom: '0.5rem' }}>[SYSTEM] Ready for objective injection.</div>
                            {objectives.map(obj => (
                                <div key={obj.id} style={{ color: '#c026d3' }}>
                                    {`> REGISTERED: ${obj.text.substring(0, 20)}...`}
                                </div>
                            ))}
                        </div>
                        <div className={styles.inputArea}>
                            <textarea
                                className={styles.consoleInput}
                                placeholder="TYPE TOPIC HERE..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        addObjective();
                                    }
                                }}
                            ></textarea>
                            <button className={styles.commitBtn} onClick={addObjective}>INJECT OBJECTIVE</button>

                            <button
                                style={{ marginTop: '2rem', width: '100%', border: '1px solid #3f3f46', color: '#e4e4e7', padding: '0.5rem', fontSize: '10px', textTransform: 'uppercase' }}
                                onClick={() => objectives.length > 0 && onComplete(objectives.map(o => o.text))}
                            >
                                Finalize & Execute Sequence
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
