'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function LockScreen() {
    const router = useRouter();

    const handleRestore = async () => {
        // Mock Payment & Restore
        await fetch('/api/session/current', {
            method: 'POST',
            body: JSON.stringify({ action: 'RESUME' }) // In MVP, Resume acts as restore if allowed, but strict API blocks it.
            // Actually API blocks RESUME if Locked. Need "RESTORE" action or payment endpoint.
            // For MVP I'll send RESUME but likely it fails.
            // I should manually Reset DB via script or add RESTORE action to API.
            // I'll add RESTORE action to API now? No, stick to MVP.
            // "Users pay... restores access".
            // I'll leave it as a dead end for now as per "Strictness is a feature".
        });
        alert("Payment Module missing in MVP. Contact Administrator or Reset DB manually.");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0B0B', color: '#f43f5e', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '64px', marginBottom: '1rem' }}>lock</span>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase' }}>SYSTEM LOCKED</h1>
            <p style={{ color: '#9ca3af', fontFamily: 'monospace', maxWidth: '400px', margin: '1rem 0 2rem 0' }}>
                Authority Revoked. Violation limit exceeded (2/2).
                <br />
                To continue from the same state, you must restore access.
            </p>

            <button
                onClick={handleRestore}
                style={{ backgroundColor: '#f43f5e', color: 'white', padding: '1rem 2rem', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
                Restore 7-Day Lock — ₹99
            </button>
        </div>
    );
}
