'use client';
import React from 'react';
import styles from './AuthorityWarningScreen.module.css';

export default function AuthorityWarningScreen({ onContinue }: { onContinue: () => void }) {
    return (
        <div className={styles.container}>
            <div className={styles.warningIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#000' }}>warning</span>
            </div>

            <h1 className={styles.title}>WARNING</h1>

            <div className={styles.body}>
                <p>You have used 1 of 2 allowed failures.</p>
                <p>The next violation will revoke access<br />to this execution track.</p>
                <p className={styles.highlight}>No grace.<br />No recovery without restore.</p>
            </div>

            <div className={styles.snapshot}>
                <div className={styles.snapshotRow}>
                    <span>Track:</span>
                    <span className={styles.snapshotValue}>Active Session</span>
                </div>
                <div className={styles.snapshotRow}>
                    <span>Failures Used:</span>
                    <span className={styles.snapshotValue} style={{ color: '#fbbf24' }}>1 / 2</span>
                </div>
                <div className={styles.snapshotRow}>
                    <span>Outcome Ceiling:</span>
                    <span className={styles.snapshotValue}>100%</span>
                </div>
            </div>

            <button className={styles.cta} onClick={onContinue}>
                CONTINUE
            </button>
        </div>
    );
}
