-- Create table to store historical weight and BMI data
CREATE TABLE IF NOT EXISTS public.user_progress_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  data_type character varying NOT NULL CHECK (data_type::text = ANY (ARRAY['weight'::character varying, 'bmi'::character varying]::text[])),
  value numeric NOT NULL,
  recorded_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_progress_history_pkey PRIMARY KEY (id),
  CONSTRAINT user_progress_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_progress_history_user_id ON public.user_progress_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_history_type ON public.user_progress_history(data_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_history_recorded_at ON public.user_progress_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_history_user_type ON public.user_progress_history(user_id, data_type);

-- Add comment
COMMENT ON TABLE public.user_progress_history IS 'Stores historical weight and BMI data for users to track progress over time';

