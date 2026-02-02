'use client';
import React, { useState, useEffect } from 'react';
import { DbSchema } from '@/lib/types';
import BootScreen from '@/components/BootScreen';
import RealityCheckScreen from '@/components/RealityCheckScreen';
import IdentityScreen from '@/components/IdentityScreen';
import ExecutionHome from './ExecutionHome'; // Replaces Dashboard
import TracksScreen from '@/components/TracksScreen';
import ReadOnlyTrackView from './ReadOnlyTrackView';
import SyllabusScreen from '@/components/SyllabusScreen';
import PaywallScreen from '@/components/PaywallScreen'; // Phase 3
import HardLockScreen from '@/components/HardLockScreen'; // Phase 3
import NoirSessionScreen from '@/components/NoirSessionScreen'; // Phase 3
import FailureScreen from '@/components/FailureScreen';
import ContractScreen from '@/components/ContractScreen';
import GlobalVisibilityGuard from '@/components/GlobalVisibilityGuard'; // Phase 4
import PausedScreen from '@/components/PausedScreen';
import AuthorityWarningScreen from '@/components/AuthorityWarningScreen';
import LockedScreen from '@/components/LockedScreen';
import RestoreScreen from '@/components/RestoreScreen';
import ExitAndWipeConfirmationScreen from '@/components/ExitAndWipeConfirmationScreen';

import { useRouter } from 'next/navigation';

/**
 * ARCHITECTURE NOTE: SERVER TRUTH & DERIVED STATE
 * 
 * ClientShell is a pure projection of server truth (`db` prop).
 * We do not duplicate server-authoritative states (RUNNING, LOCKED) into local state.
 * 
 * - computedFlowState: Derived on every render. If Server says RUNNING/LOCKED, that wins.
 * - localSetupStep: Only controls the ephemeral "Setup" sequence (Boot -> Dashboard -> Contract).
 */

type SetupStep = 'BOOT' | 'REALITY_CHECK' | 'IDENTITY' | 'DASHBOARD' | 'TRACKS' | 'SYLLABUS' | 'PAYWALL' | 'CONTRACT' | 'HARD_LOCK';

// Combined FlowState includes Server States
type EffectiveFlowState = SetupStep | 'SESSION' | 'LOCKED' | 'PAUSED' | 'WARNING' | 'RESTORE' | 'WIPE_CONFIRM';

export default function ClientShell({ db }: { db: DbSchema }) {
    const router = useRouter();

    // 1. Local State: Only tracks where we are in the "Setup" wizard
    // We default to BOOT, unless we decide to restore a specific wizard step (omitted for MVP)
    const [localSetupStep, setLocalSetupStep] = useState<SetupStep>(() => {
        // Smart Boot: If user has an identity, skip the intro wizard
        if (db.userState?.identity && db.userState.identity !== 'UNKNOWN' && db.userState.identity !== 'ANON_V1') {
            return 'DASHBOARD';
        }
        return 'BOOT';
    });
    const [viewingTrack, setViewingTrack] = useState(false); // Modal state for ExecutionHome
    const [tempDashboardAccess, setTempDashboardAccess] = useState(false);

    // Session Transition Tracking
    const wasRunning = React.useRef(false);
    useEffect(() => {
        if (db.currentSession?.status === 'RUNNING') {
            wasRunning.current = true;
        } else if (!db.currentSession && wasRunning.current) {
            // Session just finished -> Reset to Dashboard
            wasRunning.current = false;
            setIsLocking(false);
            setLocalSetupStep('DASHBOARD');
        }
    }, [db.currentSession]);

    // UI State for Lock Screen Flow
    const [showRestore, setShowRestore] = useState(false);
    const [showWipe, setShowWipe] = useState(false);

    // 2. Boot Animation State
    const [bootProgress, setBootProgress] = useState(0);
    const [isDemo, setIsDemo] = useState(false);

    // 3. Boot Verification Guards (prevent skipping steps via manipulation)
    const [bootState, setBootState] = useState({
        realityConfirmed: false,
        identitySet: false,
        trackChosen: false,
        syllabusDefined: false
    });

    // 4. DERIVED STATE: The Core Architectural Fix
    // We calculate the effective screen to show on every render.
    // Server Truth (db.currentSession) always overrides Local Setup.
    let effectiveFlowState: EffectiveFlowState = localSetupStep;

    if (db.currentSession) {
        if (db.currentSession.status === 'RUNNING') {
            effectiveFlowState = 'SESSION';
        } else if (db.currentSession.status === 'LOCKED') {
            if (showRestore) effectiveFlowState = 'RESTORE';
            else if (showWipe) effectiveFlowState = 'WIPE_CONFIRM';
            else effectiveFlowState = 'LOCKED';
        } else if (db.currentSession.status === 'WARNING') {
            effectiveFlowState = 'WARNING';
        } else if (db.currentSession.status === 'HOLD') {
            if (tempDashboardAccess) {
                effectiveFlowState = 'DASHBOARD';
            } else {
                effectiveFlowState = 'PAUSED';
            }
        }
    }

    // Effect for Temp Dashboard Access Timer
    useEffect(() => {
        if (effectiveFlowState === 'DASHBOARD' && db.currentSession?.status === 'HOLD') {
            const timer = setTimeout(() => {
                setTempDashboardAccess(false);
            }, 20000); // 20 seconds
            return () => clearTimeout(timer);
        }
    }, [effectiveFlowState, db.currentSession]);

    // Effect: Boot Animation (Only runs if we are visibly in BOOT state)
    useEffect(() => {
        if (effectiveFlowState !== 'BOOT') return;

        const boot = setInterval(() => {
            setBootProgress(prev => {
                if (prev >= 100) {
                    clearInterval(boot);
                    setLocalSetupStep('REALITY_CHECK');
                    return 100;
                }
                return prev + 5;
            });
        }, 50);
        return () => clearInterval(boot);
    }, [effectiveFlowState]);

    // --- Actions ---

    const handleReality = () => {
        setBootState(prev => ({ ...prev, realityConfirmed: true }));
        setLocalSetupStep('IDENTITY');
    };

    const handleIdentity = (id: string, key?: string) => {
        if (!bootState.realityConfirmed) return; // Guard
        if (id === 'demo' && key === 'demo') {
            setIsDemo(true);
            console.log("DEMO MODE ACTIVE");
        }

        // Persist Identity
        fetch('/api/user/identity', {
            method: 'POST',
            body: JSON.stringify({ identity: id, accessKey: key })
        }).catch(err => console.error("Failed to persist identity", err));

        setBootState(prev => ({ ...prev, identitySet: true }));
        setLocalSetupStep('DASHBOARD');
    };

    const handleDashboardStart = () => {
        // "Start Session" -> Move to Tracks selection
        setLocalSetupStep('TRACKS');
    };

    const handleTrack = (tid: string) => {
        setBootState(prev => ({ ...prev, trackChosen: true }));
        setLocalSetupStep('SYLLABUS');
    };

    const handleSyllabus = (objs: string[]) => {
        if (!bootState.trackChosen) return;
        setBootState(prev => ({ ...prev, syllabusDefined: true }));
        setLocalSetupStep(isDemo ? 'HARD_LOCK' : 'PAYWALL');
    };

    const handlePay = (tier: string) => {
        if (!bootState.syllabusDefined) return;
        setLocalSetupStep('CONTRACT');
    };

    const handleContract = () => {
        setLocalSetupStep('HARD_LOCK');
    };

    const [isLocking, setIsLocking] = useState(false);

    const handleHardLock = async () => {
        if (isLocking) return;
        setIsLocking(true);
        // Optimistic UI: We visualy lock immediately while waiting for server
        try {
            await fetch('/api/session/current', {
                method: 'POST',
                body: JSON.stringify({ action: 'RESUME' })
            });
            router.refresh();
        } catch (e) {
            setIsLocking(false);
        }
    };

    const handleResume = async () => {
        await fetch('/api/session/current', {
            method: 'POST',
            body: JSON.stringify({ action: 'RESUME' })
        });
        router.refresh();
    };

    const handleWarningContinue = async () => {
        // Acknowledge warning and return to Active Session
        await fetch('/api/session/current', {
            method: 'POST',
            body: JSON.stringify({ action: 'RESUME' })
        });
        router.refresh();
    };

    const handleRestoreSuccess = () => {
         setShowRestore(false);
         router.refresh();
    };

    const handleWipeConfirm = () => {
        // API call is handled inside component, we just reset local state to BOOT
        setLocalSetupStep('BOOT');
        window.location.reload();
    };

    // --- Render Map ---

    // 1. Server-Authoritative Modes
    if (effectiveFlowState === 'SESSION' && db.currentSession) {
        return (
            <>
                <GlobalVisibilityGuard active={true} />
                <NoirSessionScreen session={db.currentSession} />
            </>
        );
    }

    if (effectiveFlowState === 'WARNING') {
        return <AuthorityWarningScreen onContinue={handleWarningContinue} />;
    }

    if (effectiveFlowState === 'LOCKED') {
        return <LockedScreen onRestore={() => setShowRestore(true)} onExit={() => setShowWipe(true)} />;
    }

    if (effectiveFlowState === 'RESTORE') {
        return <RestoreScreen onRestoreSuccess={handleRestoreSuccess} onCancel={() => setShowRestore(false)} />;
    }

    if (effectiveFlowState === 'WIPE_CONFIRM') {
         return <ExitAndWipeConfirmationScreen onConfirm={handleWipeConfirm} onCancel={() => setShowWipe(false)} />;
    }

    // 2.Local Setup Modes
    switch (effectiveFlowState) {
        case 'BOOT':
            return <BootScreen progress={bootProgress} />;
        case 'REALITY_CHECK':
            return <RealityCheckScreen onConfirm={handleReality} />;
        case 'IDENTITY':
            return <IdentityScreen onCommit={handleIdentity} />;
        case 'DASHBOARD':
            // Mock session for pre-start dashboard
            const mockSession = db.currentSession || {
                date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
                mainTitle: 'Daily Execution',
                progressPercent: 0,
                violations: [],
                warningTriggered: false,
                queue: [],
                status: 'HOLD'
            };

            if (viewingTrack) {
                return <ReadOnlyTrackView onClose={() => setViewingTrack(false)} />;
            }

            return (
                <ExecutionHome
                    session={mockSession as any}
                    onStart={handleDashboardStart}
                    onViewTrack={() => setViewingTrack(true)}
                    onExit={() => {
                        if (confirm("WARNING: EXITING WILL LOSE EXECUTION STATE. PROCEED?")) {
                            setLocalSetupStep('BOOT');
                            window.location.reload();
                        }
                    }}
                />
            );
        case 'TRACKS':
            return <TracksScreen onSelect={handleTrack} />;
        case 'SYLLABUS':
            return <SyllabusScreen onComplete={handleSyllabus} />;
        case 'PAYWALL':
            return <PaywallScreen onPay={handlePay} />;
        case 'CONTRACT':
            return <ContractScreen onAccept={handleContract} />;
        case 'HARD_LOCK':
            return <HardLockScreen onLock={handleHardLock} loading={isLocking} />;
        case 'PAUSED':
            return <PausedScreen onResume={handleResume} onDashboard={() => setTempDashboardAccess(true)} />;
        default:
            return <div style={{ color: 'red' }}>ERROR: Unknown Flow State</div>;
    }
}
