-- Migration: Add engine volume and power fields to cars table
-- Run this SQL in the Supabase SQL Editor

-- Add new columns to the cars table
ALTER TABLE cars 
ADD COLUMN engine_volume TEXT,
ADD COLUMN power TEXT;

-- Update existing records with default values (optional)
-- You can remove this if you want to keep existing records without these fields
UPDATE cars 
SET engine_volume = 'N/A', power = 'N/A' 
WHERE engine_volume IS NULL OR power IS NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN cars.engine_volume IS 'Engine volume/displacement (e.g., 2.0L, 3.0L, Electric)';
COMMENT ON COLUMN cars.power IS 'Engine power output (e.g., 150 kW, 200 HP)';
