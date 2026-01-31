-- 1. Enforce "One Active Session" Rule
-- Prevents a user from having multiple sessions in RUNNING state
CREATE UNIQUE INDEX IF NOT EXISTS one_running_session
ON sessions(user_id)
WHERE status = 'RUNNING';

-- 2. Transactional Update Function (RPC)
-- Updates session state AND inserts violations atomically
CREATE OR REPLACE FUNCTION update_session_with_violations(
  p_session_id uuid,
  p_status text,
  p_progress int,
  p_warning boolean,
  p_violations jsonb,
  p_main_title text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the Session
  UPDATE sessions
  SET 
    status = p_status,
    progress_percent = p_progress,
    warning_triggered = (CASE WHEN p_warning THEN 1 ELSE 0 END),
    main_title = p_main_title
  WHERE id = p_session_id::text; -- Casting if ID is text in schema, usually uuid is better

  -- Insert Violations (Ignore duplicates)
  -- Assumes violations list contains {id, type, timestamp}
  INSERT INTO violations (id, session_id, type, timestamp_iso)
  SELECT
    (v->>'id'),
    p_session_id::text,
    (v->>'type'),
    (v->>'timestamp') -- Preserving current string format for compatibility, or cast to int if changed
  FROM jsonb_array_elements(p_violations) v
  ON CONFLICT (id) DO NOTHING;
END;
$$;
