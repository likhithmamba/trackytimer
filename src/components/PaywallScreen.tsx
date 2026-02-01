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

                <div className={styles.pricingCard}>
                    <div className={styles.priceHeader}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>EXECUTION LOCK</h3>
                        <div style={{ color: '#10b981', fontWeight: 700 }}>₹49.00</div>
                    </div>
                    <ul className={styles.features}>
                        <li>7-day controlled environment</li>
                        <li>Strict outcome enforcement</li>
                        <li>No distraction tolerance</li>
                    </ul>
                    <button className={styles.payBtn} onClick={() => onPay('ACCESS')}>
                        UNLOCK AUTHORITY
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                        Non-refundable. Commitment is final.
                    </div>
                </div>
            </main>
        </div>
    );
}
