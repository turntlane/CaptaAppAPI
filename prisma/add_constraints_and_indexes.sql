-- Additional constraints and indexes that Prisma doesn't support directly
-- Run this SQL file after creating the tables via Prisma migration or db push

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add CHECK constraints for signal_data.channel (must be 1 or 2)
ALTER TABLE signal_data 
ADD CONSTRAINT check_channel_range CHECK (channel IN (1, 2));

-- Add CHECK constraint for baseline_frequency_bands.power_sign (must be -1, 0, or 1)
ALTER TABLE baseline_frequency_bands 
ADD CONSTRAINT check_power_sign_range CHECK (power_sign IN (-1, 0, 1));

-- Add CHECK constraint for sessions.session_type (already handled by enum, but adding for safety)
-- Note: Prisma enums handle this, but this ensures database-level constraint

-- Add GIN indexes for JSONB columns (for efficient JSON queries)
CREATE INDEX IF NOT EXISTS idx_focus_pre_session_info 
ON focus_aid_sessions USING GIN (pre_session_info);

CREATE INDEX IF NOT EXISTS idx_focus_post_feedback 
ON focus_aid_sessions USING GIN (post_session_feedback);






