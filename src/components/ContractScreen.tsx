'use client';
import React from 'react';
import styles from './ContractScreen.module.css';

export default function ContractScreen({ onAccept }: { onAccept: () => void }) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Execution Contract</h1>

            <div className={styles.contractBox}>
                <p className={styles.contractText}>
                    For the next 7 days:<br />
                    • You give up control of daily execution<br />
                    • Failing twice revokes access<br />
                    • Continuing requires paid restoration<br /><br />
                    This system does not promise results.<br />
                    It enforces execution only.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="accept" />
                    <label htmlFor="accept" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>I accept these terms</label>
                </div>
            </div>

            <button className={styles.button} onClick={onAccept}>
                Accept & Continue
            </button>
        </div>
    );
}
