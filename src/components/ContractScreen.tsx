'use client';
import React from 'react';
import styles from './ContractScreen.module.css';

export default function ContractScreen({ onAccept }: { onAccept: () => void }) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>User Contract</h1>

            <div className={styles.contractBox}>
                <p className={styles.contractText}>
                    &quot;For the next 7 days, I give up control of my daily execution for the syllabus I defined.
                    If I fail twice, access is revoked.
                    To continue from the same state, I must restore access.&quot;
                </p>
            </div>

            <button className={styles.button} onClick={onAccept}>
                I Accept & Pay ₹49
            </button>
        </div>
    );
}
