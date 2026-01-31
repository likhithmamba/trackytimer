'use client';
import React, { useState, useEffect } from 'react';
import { DbSchema } from '@/lib/types';
import BootScreen from '@/components/BootScreen';
import RealityCheckScreen from '@/components/RealityCheckScreen';
import IdentityScreen from '@/components/IdentityScreen';
import TracksScreen from '@/components/TracksScreen';
import SyllabusScreen from '@/components/SyllabusScreen';
import PaywallScreen from '@/components/PaywallScreen'; // Phase 3
import HardLockScreen from '@/components/HardLockScreen'; // Phase 3
import NoirSessionScreen from '@/components/NoirSessionScreen'; // Phase 3
import FailureScreen from '@/components/FailureScreen';
import ContractScreen from '@/components/ContractScreen';

type FlowState = 'BOOT' | 'REALITY_CHECK' | 'IDENTITY' | 'TRACKS' | 'SYLLABUS' | 'PAYWALL' | 'HARD_LOCK' | 'SESSION' | 'LOCKED';

export default function ClientShell({ db }: { db: DbSchema }) {
    const [flowState, setFlowState] = useState<FlowState>('BOOT');
    const [bootProgress, setBootProgress] = useState(0);
    const [isDemo, setIsDemo] = useState(false);

    // Hydrate initial state
    useEffect(() => {
        // 1. Check Locked
        if (db.currentSession?.status === 'LOCKED' && !isDemo) {
            setFlowState('LOCKED');
            return;
        }
        // 2. Check Active
        if (db.currentSession && (db.currentSession.status === 'RUNNING')) {
            setFlowState('SESSION');
            return;
        }
        // 3. Boot Animation
        const boot = setInterval(() => {
            setBootProgress(prev => {
                if (prev >= 100) {
                    clearInterval(boot);
                    setFlowState('REALITY_CHECK');
                    return 100;
                }
                return prev + 5; // Faster boot for verification
            });
        }, 50);
        return () => clearInterval(boot);
    }, [db.currentSession, isDemo]);

    // Handlers
    const handleReality = () => setFlowState('IDENTITY');
    const handleIdentity = (id: string, key?: string) => {
        if (id === 'demo' && key === 'demo') {
            setIsDemo(true);
            console.log("DEMO MODE ACTIVE");
        }
        setFlowState('TRACKS');
    };
    const handleTrack = (tid: string) => { console.log("Track:", tid); setFlowState('SYLLABUS'); };
    const handleSyllabus = (objs: string[]) => {
        if (isDemo) {
            setFlowState('HARD_LOCK'); // Bypass Paywall
        } else {
            setFlowState('PAYWALL');
        }
    };

    const handlePay = (tier: string) => {
        console.log("Paid:", tier);
        setFlowState('HARD_LOCK');
    };

    const handleHardLock = async () => {
        // Start Session via API
        await fetch('/api/session/current', {
            method: 'POST',
            body: JSON.stringify({ action: 'RESUME' })
        });
        window.location.reload();
    };

    // Render Map
    if (flowState === 'BOOT') return <BootScreen progress={bootProgress} />;
    if (flowState === 'REALITY_CHECK') return <RealityCheckScreen onConfirm={handleReality} />;
    if (flowState === 'IDENTITY') return <IdentityScreen onCommit={handleIdentity} />;
    if (flowState === 'TRACKS') return <TracksScreen onSelect={handleTrack} />;
    if (flowState === 'SYLLABUS') return <SyllabusScreen onComplete={handleSyllabus} />;
    if (flowState === 'PAYWALL') return <PaywallScreen onPay={handlePay} />;
    if (flowState === 'HARD_LOCK') return <HardLockScreen onLock={handleHardLock} />;

    if (flowState === 'SESSION' && db.currentSession) return <NoirSessionScreen session={db.currentSession} />;

    if (flowState === 'LOCKED') return <FailureScreen violations={db.currentSession?.violations || []} />;

    return <ContractScreen onAccept={() => window.location.reload()} />;
}
