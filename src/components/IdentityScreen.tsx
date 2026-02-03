'use client';
import React, { useState } from 'react';
import styles from './IdentityScreen.module.css';

export default function IdentityScreen({ onCommit }: { onCommit: (id: string, key?: string) => void }) {
    const [identity, setIdentity] = useState('');
    const [accessKey, setAccessKey] = useState('');

    return (
        <div className={styles.container}>
            <div className={styles.scanlineOverlay}></div>
            <header className={styles.header}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#00E5FF' }}>shield</span>
                    <h2 className={styles.headerTitle}>Identity Systems</h2>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.variantInfo}>Protocol Variant 4 of 10</div>

                    <h1 className={styles.heroTitle}>
                        04 Identity: <span style={{ color: '#00E5FF' }}>Technical Finality</span>
                    </h1>

                    <div className={styles.inputGroup}>
                        <div style={{ width: '100%' }}>
                            <label htmlFor="identity-input" className={styles.label}>Subject Identifier</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="identity-input"
                                    name="identity"
                                    autoComplete="off"
                                    type="text"
                                    className={styles.input}
                                    placeholder="SEC-ALPHA-9920-X"
                                    value={identity}
                                    onChange={e => setIdentity(e.target.value)}
                                />
                                <div className={styles.iconBox}>
                                    <span className="material-symbols-outlined">fingerprint</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%' }}>
                            <label htmlFor="access-key-input" className={styles.label}>Access Key (Optional)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="access-key-input"
                                    name="accessKey"
                                    autoComplete="off"
                                    type="password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    value={accessKey}
                                    onChange={e => setAccessKey(e.target.value)}
                                />
                                <div className={styles.iconBox}>
                                    <span className="material-symbols-outlined">key</span>
                                </div>
                            </div>
                        </div>

                        <label style={{ width: '100%', opacity: 0.5 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <p className={styles.label} style={{ color: '#00E5FF' }}>Identity Binding Finalized</p>
                                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#464649' }}>HASH: 0x82...F21</span>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={styles.input} readOnly value="AETH-SYST-ARCHIVE-CORE-04" style={{ backgroundColor: '#121217', color: '#a9a9ad', cursor: 'default' }} />
                                <div className={styles.iconBox} style={{ backgroundColor: '#121217', color: '#00E5FF' }}>
                                    <span className="material-symbols-outlined">lock</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <button
                        className={styles.commitButton}
                        onClick={() => onCommit(identity, accessKey)}
                        disabled={!identity.trim()}
                        aria-disabled={!identity.trim()}
                    >
                        <span>Commit Identity Anchor</span>
                        <span className="material-symbols-outlined">bolt</span>
                    </button>
                    <p className={styles.warning}>
                        Warning: Finality is immediate. This operation cannot be reversed once the cryptographic anchor is broadcast.
                    </p>
                </div>
            </main>
        </div>
    );
}
