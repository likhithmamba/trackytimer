export interface UserSystemState {
  identity?: string; // e.g. "SEC-ALPHA-9920-X"
  complianceSignature?: boolean; // Reality Check passed
  activeTrackId?: string; // Selected Track
  accessGranted?: boolean; // Paid ₹49 entry fee
  uptime: number; // accumulated seconds
  securityProtocol: "AES-256";
  specificityLevel: number;
}

export type SessionStatus = 'HOLD' | 'RUNNING' | 'LOCKED' | 'COMPLETED';

export interface TrackModule {
  id: string; // e.g., "SYL_MOD_06_UPLINK"
  name: string; // e.g., "Module_06: Technical_Console"
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  objectives: Objective[];
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface Objective {
  id: string; // "OBJ_601_CORE"
  title: string;
  timeBlock: string; // "08:00 - 09:30"
  intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'QUEUED' | 'ARCHIVED';
  progress: number; // 0-100
}

export interface Violation {
  id: string;
  type: 'PHONE_DETECTED' | 'TAB_SWITCH' | 'ABANDONED';
  timestamp: string;
}

export interface ActiveSession {
  date: string; // "2024-10-24"
  mainTitle: string; // "High-Stakes Focus Mode"
  progressPercent: number;
  violations: Violation[];
  warningTriggered: boolean; // 1st Strike
  queue: Objective[];
  status: SessionStatus;
  startTime?: string; // ISO timestamp
  durationMinutes?: number; // e.g., 60
}

export interface DbSchema {
  userState: UserSystemState;
  tracks: TrackModule[];
  currentSession: ActiveSession | null;
}
