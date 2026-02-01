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
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#e2e8f0' }}>This is not a productivity app.</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
                        This system removes daily decision-making.<br />
                        It is strict by design.<br /><br />
                        If you want flexibility, this is not for you.
                    </p>
                </div>

                <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>System Initialization</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className={styles.statusText}>
                        {progress < 100 ? 'LOADING: CONSTRAINT_ENGINE.LIB' : 'SYSTEM READY'}
                    </p>
                </div>
            </main>
        </div>
    );
}
