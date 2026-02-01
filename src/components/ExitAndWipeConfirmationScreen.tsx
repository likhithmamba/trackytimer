'use client';
import React, { useState } from 'react';
import styles from './ExitAndWipeConfirmationScreen.module.css';

interface ExitProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ExitAndWipeConfirmationScreen({ onConfirm, onCancel }: ExitProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        // Simulate API call delay
        await fetch('/api/session/current', { method: 'POST', body: JSON.stringify({ action: 'WIPE' }) });
        onConfirm();
    };

    return (
        <div className={styles.container}>
            <div className={styles.warningBox}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#f43f5e' }}>delete_forever</span>
            </div>

            <h1 className={styles.title}>EXIT EXECUTION SYSTEM</h1>

            <div className={styles.body}>
                <p>This will permanently erase:</p>
                <ul className={styles.list}>
                    <li>Your execution state</li>
                    <li>Dropped topic history</li>
                    <li>Behavior profile</li>
                    <li>Outcome ceiling</li>
                </ul>
                <p className={styles.finalWarning}>This cannot be undone.</p>
            </div>

            <div className={styles.actions}>
                <button className={styles.returnBtn} onClick={onCancel} autoFocus>
                    RETURN TO LOCK
                </button>
                <button className={styles.exitBtn} onClick={handleConfirm} disabled={isDeleting}>
                    {isDeleting ? 'ERASING...' : 'EXIT AND ERASE STATE'}
                </button>
            </div>
        </div>
    );
}
