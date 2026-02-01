'use client';
import React, { useEffect, useState } from 'react';
import styles from './GlobalVisibilityGuard.module.css';
import { useRouter } from 'next/navigation';

export default function GlobalVisibilityGuard({ active }: { active: boolean }) {
    const [isVisible, setIsVisible] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!active) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        const handleBlur = () => setIsVisible(false);
        const handleFocus = () => setIsVisible(true);

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, [active]);

    useEffect(() => {
        if (!isVisible && active) {
            // Report Violation
            fetch('/api/session/violation', {
                method: 'POST',
                body: JSON.stringify({ type: 'TAB_SWITCH' })
            }).then(() => {
                router.refresh();
            }).catch(console.error);
        }
    }, [isVisible, active, router]);

    // If active is false, render nothing
    if (!active) return null;

    // If visible (focused), render nothing (or hidden state)
    if (isVisible) return null;

    // Render Overlay when NOT visible/focused
    return (
        <div className={styles.overlay}>
            <div className={styles.scanline}></div>
            <div className={styles.topBar}></div>

            <div className={styles.warningBox}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#e6474c' }}>warning</span>
                <div>
                    <div className={styles.violationSub}>System Monitoring Active</div>
                    <h2 className={styles.violationTitle}>Protocol Breach</h2>
                </div>
            </div>

            <h1 className={styles.h1}>RETURN TO SESSION IMMEDIATELY</h1>

            <div className={styles.consequence}>
                Focus detected outside of active window.<br />
                <span style={{ color: '#e6474c', fontWeight: 700, textDecoration: 'underline' }}>Second violation will lock access.</span>
            </div>

            <div className={styles.footer}>
                <div className={styles.badge}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                    <span>Biometric & Focus Tracking Engaged</span>
                </div>
                <div style={{ opacity: 0.3, fontSize: '10px', fontFamily: 'monospace' }}>
                    SEC_ID: 0x99281-FG // AUTH_LEVEL: OVERRIDE
                </div>
            </div>
        </div>
    );
}
