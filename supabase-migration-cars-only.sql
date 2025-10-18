-- Simple Migration: Add engine fields to cars table only
-- Use this if you only need to add the engine columns

-- Add new columns to the cars table (only if they don't exist)
DO $$ 
BEGIN
    -- Add engine_volume column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cars' AND column_name = 'engine_volume') THEN
        ALTER TABLE cars ADD COLUMN engine_volume TEXT;
        RAISE NOTICE 'Added engine_volume column to cars table';
    ELSE
        RAISE NOTICE 'engine_volume column already exists in cars table';
    END IF;
    
    -- Add power column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cars' AND column_name = 'power') THEN
        ALTER TABLE cars ADD COLUMN power TEXT;
        RAISE NOTICE 'Added power column to cars table';
    ELSE
        RAISE NOTICE 'power column already exists in cars table';
    END IF;
END $$;

-- Update existing records with default values (only for NULL values)
UPDATE cars 
SET engine_volume = 'N/A', power = 'N/A' 
WHERE engine_volume IS NULL OR power IS NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN cars.engine_volume IS 'Engine volume/displacement (e.g., 2.0L, 3.0L, Electric)';
COMMENT ON COLUMN cars.power IS 'Engine power output (e.g., 150 kW, 200 HP)';
