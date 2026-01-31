import React from 'react';
import styles from './BootScreen.module.css';

export default function BootScreen({ progress = 0 }: { progress: number }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logoArea}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary)' }}>terminal</span>
                    <h2 style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>SYSTEM.BOOT_V1.0</h2>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.logoSvg}>
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                        <rect x="10" y="10" width="80" height="80" stroke="white" strokeWidth="1" />
                        <path d="M50 20V80" stroke="var(--primary)" strokeWidth="1" />
                        <path d="M20 50H80" stroke="var(--primary)" strokeWidth="1" />
                        <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="1" />
                    </svg>
                </div>

                <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                        <span>Initialization sequence</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className={styles.statusText}>
                        {progress < 100 ? 'LOADING: CORE_ASSETS.LIB' : 'SYSTEM READY'}
                    </p>
                </div>
            </main>
        </div>
    );
}
