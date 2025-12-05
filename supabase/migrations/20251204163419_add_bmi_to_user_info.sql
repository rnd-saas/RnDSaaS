-- Drop user_progress_data table if it exists
DROP TABLE IF EXISTS public.user_progress_data CASCADE;

-- Add bmi column to user_info table
ALTER TABLE public.user_info 
ADD COLUMN IF NOT EXISTS bmi numeric;

-- Add comment
COMMENT ON COLUMN public.user_info.bmi IS 'Body Mass Index, calculated from weight_kg and height_cm';

