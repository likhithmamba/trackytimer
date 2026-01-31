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

import { useRouter } from 'next/navigation';

type FlowState = 'BOOT' | 'REALITY_CHECK' | 'IDENTITY' | 'TRACKS' | 'SYLLABUS' | 'PAYWALL' | 'HARD_LOCK' | 'SESSION' | 'LOCKED';

interface BootState {
    realityConfirmed: boolean;
    identitySet: boolean;
    trackChosen: boolean;
    syllabusDefined: boolean;
}

function resolveInitialFlow(db: DbSchema): FlowState {
    if (!db.currentSession) return 'BOOT';

    switch (db.currentSession.status) {
        case 'LOCKED':
            return 'LOCKED';
        case 'RUNNING':
            return 'SESSION';
        case 'HOLD':
        default:
            return 'BOOT';
    }
}

export default function ClientShell({ db }: { db: DbSchema }) {
    const router = useRouter();
    // Initialize Flow State based on Server Truth
    const [flowState, setFlowState] = useState<FlowState>(() => resolveInitialFlow(db));

    const [bootProgress, setBootProgress] = useState(0);
    const [isDemo, setIsDemo] = useState(false);

    // Boot Checkpoints - Guard against skipping steps
    const [bootState, setBootState] = useState<BootState>({
        realityConfirmed: false,
        identitySet: false,
        trackChosen: false,
        syllabusDefined: false
    });

    // Hydrate initial state
    // Boot Animation only runs if we are in BOOT state
    useEffect(() => {
        if (flowState !== 'BOOT') return;

        const boot = setInterval(() => {
            setBootProgress(prev => {
                if (prev >= 100) {
                    clearInterval(boot);
                    setFlowState('REALITY_CHECK');
                    return 100;
                }
                return prev + 5;
            });
        }, 50);
        return () => clearInterval(boot);
    }, [flowState]);

    // Handlers
    // Handlers with Guards
    const handleReality = () => {
        setBootState(prev => ({ ...prev, realityConfirmed: true }));
        setFlowState('IDENTITY');
    };

    const handleIdentity = (id: string, key?: string) => {
        if (!bootState.realityConfirmed) return; // Guard

        if (id === 'demo' && key === 'demo') {
            setIsDemo(true);
            console.log("DEMO MODE ACTIVE");
        }
        setBootState(prev => ({ ...prev, identitySet: true }));
        setFlowState('TRACKS');
    };

    const handleTrack = (tid: string) => {
        if (!bootState.identitySet) return; // Guard
        console.log("Track:", tid);
        setBootState(prev => ({ ...prev, trackChosen: true }));
        setFlowState('SYLLABUS');
    };

    const handleSyllabus = (objs: string[]) => {
        if (!bootState.trackChosen) return; // Guard
        setBootState(prev => ({ ...prev, syllabusDefined: true }));

        if (isDemo) {
            setFlowState('HARD_LOCK');
        } else {
            setFlowState('PAYWALL');
        }
    };

    const handlePay = (tier: string) => {
        if (!bootState.syllabusDefined) return; // Guard
        console.log("Paid:", tier);
        setFlowState('HARD_LOCK');
    };

    const handleHardLock = async () => {
        // Start Session via API
        await fetch('/api/session/current', {
            method: 'POST',
            body: JSON.stringify({ action: 'RESUME' })
        });
        // Use router.refresh() instead of reload to maintain SPA feel where possible, 
        // though strictly we want to re-hit the server for the new state.
        router.refresh();
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
