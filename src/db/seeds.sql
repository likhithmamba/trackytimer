-- Seed Data for TrackyTimer (Noir Edition)

-- 1. Module 06: Technical_Console (The mock data, preserved)
INSERT INTO tracks (id, name, risk_level, status)
VALUES ('SYL_MOD_06_UPLINK', 'Module_06: Technical_Console', 'MEDIUM', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO track_objectives (id, track_id, title, time_block, intensity)
VALUES
('OBJ_601_CORE', 'SYL_MOD_06_UPLINK', 'Core Logic Implementation', '08:00 - 09:30', 'HIGH'),
('OBJ_602_REDUX', 'SYL_MOD_06_UPLINK', 'State Management Refactor', '10:00 - 12:30', 'MEDIUM'),
('OBJ_603_INIT', 'SYL_MOD_06_UPLINK', 'System Initialization', '13:30 - 15:00', 'LOW')
ON CONFLICT (id) DO NOTHING;

-- 2. Module 01: Protocol_Initialization (Onboarding/Setup)
INSERT INTO tracks (id, name, risk_level, status)
VALUES ('SYL_MOD_01_INIT', 'Module_01: Protocol_Initialization', 'LOW', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO track_objectives (id, track_id, title, time_block, intensity)
VALUES
('OBJ_101_ENV', 'SYL_MOD_01_INIT', 'Environment Hardening', '09:00 - 09:45', 'LOW'),
('OBJ_102_ID', 'SYL_MOD_01_INIT', 'Identity Verification', '10:00 - 10:30', 'LOW'),
('OBJ_103_COMMIT', 'SYL_MOD_01_INIT', 'Contract Signature', '10:45 - 11:00', 'HIGH')
ON CONFLICT (id) DO NOTHING;

-- 3. Module 09: Deep_Cycle_Resonance (High Intensity)
INSERT INTO tracks (id, name, risk_level, status)
VALUES ('SYL_MOD_09_DEEP', 'Module_09: Deep_Cycle_Resonance', 'HIGH', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO track_objectives (id, track_id, title, time_block, intensity)
VALUES
('OBJ_901_FLOW', 'SYL_MOD_09_DEEP', 'Flow State Entry', '22:00 - 23:30', 'URGENT'),
('OBJ_902_EXEC', 'SYL_MOD_09_DEEP', 'Critical Execution Block', '23:45 - 02:00', 'HIGH'),
('OBJ_903_EXIT', 'SYL_MOD_09_DEEP', 'Safe Ejection Protocol', '02:15 - 02:45', 'MEDIUM')
ON CONFLICT (id) DO NOTHING;
