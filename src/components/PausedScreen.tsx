'use client';
import React from 'react';
import styles from './PausedScreen.module.css';

export default function PausedScreen({ onResume, onDashboard }: { onResume: () => void, onDashboard: () => void }) {
    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>
            <main className={styles.main}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#fbbf24', marginBottom: '1rem' }}>pause_circle</span>
                <h1 className={styles.title}>SESSION PAUSED</h1>
                <p className={styles.subtitle}>Execution halted. Timer suspended.</p>

                <div className={styles.actions}>
                    <button className={styles.resumeBtn} onClick={onResume}>
                        <span className="material-symbols-outlined">play_arrow</span>
                        RESUME SESSION
                    </button>
                    <button className={styles.dashboardBtn} onClick={onDashboard}>
                        <span className="material-symbols-outlined">dashboard</span>
                        CHECK DASHBOARD (20s)
                    </button>
                </div>
            </main>
        </div>
    );
}
