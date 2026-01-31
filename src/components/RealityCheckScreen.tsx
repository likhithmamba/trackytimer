'use client';
import React, { useState, useRef } from 'react';
import styles from './RealityCheckScreen.module.css';

export default function RealityCheckScreen({ onConfirm }: { onConfirm: () => void }) {
    const [checks, setChecks] = useState({ miss: false, fee: false, refund: false });
    const [holding, setHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const allChecked = checks.miss && checks.fee && checks.refund;

    const startHold = () => {
        if (!allChecked) return;
        setHolding(true);
        let p = 0;
        timerRef.current = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                if (timerRef.current) clearInterval(timerRef.current);
                onConfirm();
            }
        }, 35); // ~700ms total
    };

    const handleClick = () => {
        if (!allChecked) return;
        onConfirm();
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#135bec' }}>verified_user</span>
                    <div>
                        <h2 className={styles.headerTitle}>Elite Accountability</h2>
                        <span className={styles.headerSubtitle}>02 Reality Check: Technical Variant</span>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.contentWrapper}>
                    <div className={styles.variantTag}>Variant 02 / 10</div>

                    <div className={styles.headline}>
                        Commitment<br /><span>Contract</span>
                    </div>
                    <p className={styles.subheadline}>
                        Miss sessions. Lose access. <span style={{ color: 'white', fontWeight: 'bold' }}>Pay to return.</span>
                    </p>

                    <div className={styles.protocolPanel}>
                        <div className={styles.protocolHeader}>
                            <h3 className={styles.protocolTitle}>Technical Accountability Protocol</h3>
                            <p className={styles.protocolText}>
                                Failure results in immediate account suspension and a non-negotiable re-entry fee. This is a binding digital agreement.
                            </p>
                        </div>

                        <div className={styles.checklist}>
                            <label className={styles.checkLabel}>
                                <input type="checkbox" className={styles.checkbox} checked={checks.miss} onChange={e => setChecks({ ...checks, miss: e.target.checked })} />
                                <span className={styles.checkText}>I understand that missing scheduled sessions triggers immediate system lockout.</span>
                            </label>
                            <label className={styles.checkLabel}>
                                <input type="checkbox" className={styles.checkbox} checked={checks.fee} onChange={e => setChecks({ ...checks, fee: e.target.checked })} />
                                <span className={styles.checkText}>I agree to the progressive re-entry fee structure for all missed commitments.</span>
                            </label>
                            <label className={styles.checkLabel}>
                                <input type="checkbox" className={styles.checkbox} checked={checks.refund} onChange={e => setChecks({ ...checks, refund: e.target.checked })} />
                                <span className={styles.checkText}>I acknowledge the strict no-refund policy for performance-based penalties.</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(11,11,11,0.5)', border: '1px solid var(--border-dim)', marginTop: '1rem' }}>
                            <div>
                                <p style={{ color: 'white', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Enforcement Mode</p>
                                <p style={{ color: '#5b6478', fontSize: '12px' }}>Full digital restriction active upon breach</p>
                            </div>
                            <span className="material-symbols-outlined" style={{ color: '#135bec' }}>toggle_on</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <button
                            className={styles.acceptButton}
                            disabled={!allChecked}
                            onClick={handleClick}
                        >
                            <span style={{ position: 'relative', zIndex: 10 }}>I Accept</span>
                            <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
                        </button>
                        <p style={{ color: '#5b6478', fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hold for 700ms to confirm signature</p>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span>LATENCY: 12MS</span>
                    <span>ENC: AES-256-GCM</span>
                </div>
                <div>SYSTEM-REF: EA-V2-2024</div>
            </footer>
        </div>
    );
}
