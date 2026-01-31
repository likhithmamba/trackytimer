'use client';
import React from 'react';
import styles from './PaywallScreen.module.css';

export default function PaywallScreen({ onPay }: { onPay: (tier: 'ACCESS') => void }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <h2 className={styles.headerTitle}>Protocol Authority</h2>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeading}>
                    <div>
                        <h1 className={styles.title}>03 Access Fee</h1>
                        <p style={{ color: '#6b7280', fontWeight: 500, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>Non-refundable commitment.</p>
                    </div>
                </div>

                <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #1be4c9', backgroundColor: 'white', padding: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>7-Day Lock Access</h2>
                    <div style={{ fontSize: '4rem', fontWeight: 900, textAlign: 'center', marginBottom: '2rem', color: '#11211f' }}>₹49</div>

                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <li style={{ display: 'flex', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1be4c9' }}>lock</span>
                            Irreversible Execution State
                        </li>
                        <li style={{ display: 'flex', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1be4c9' }}>gavel</span>
                            Authority Enforcement
                        </li>
                        <li style={{ display: 'flex', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1be4c9' }}>history</span>
                            Memory of Failure
                        </li>
                    </ul>

                    <button className={styles.commitButton} onClick={() => onPay('ACCESS')}>
                        Initiate Protocol
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1rem', color: '#9ca3af' }}>Re-entry requires additional payment.</p>
                </div>
            </main>
        </div>
    );
}
