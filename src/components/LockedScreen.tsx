'use client';
import React from 'react';
import styles from './LockedScreen.module.css';

interface LockedScreenProps {
    onRestore: () => void;
    onExit: () => void;
}

export default function LockedScreen({ onRestore, onExit }: LockedScreenProps) {
    return (
        <div className={styles.container}>
            <div className={styles.scanline}></div>
            <div className={styles.lockIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#000' }}>lock</span>
            </div>

            <h1 className={styles.title}>ACCESS REVOKED</h1>

            <div className={styles.snapshot}>
                <div className={styles.snapshotRow}>
                    <span>Track:</span>
                    <span className={styles.snapshotValue}>Active Session</span>
                </div>
                <div className={styles.snapshotRow}>
                    <span>Topics Completed:</span>
                    <span className={styles.snapshotValue}>0 / 10</span>
                </div>
                <div className={styles.snapshotRow}>
                    <span>Topics Dropped:</span>
                    <span className={styles.snapshotValue}>0</span>
                </div>
            </div>

            <div className={styles.body}>
                <p>Waiting 3 days will increase<br />daily load by +28 minutes.</p>
                <p className={styles.authorityMsg}>Without this system,<br />decisions are yours again.</p>
            </div>

            <button className={styles.primaryCta} onClick={onRestore}>
                RESTORE 7-DAY LOCK — ₹99
            </button>

            <button className={styles.secondaryCta} onClick={onExit}>
                Exit and lose execution state
            </button>
        </div>
    );
}
