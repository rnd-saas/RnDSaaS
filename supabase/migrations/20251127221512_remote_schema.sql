-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text,
  category character varying CHECK (category::text = ANY (ARRAY['workout'::character varying, 'consistency'::character varying, 'strenght'::character varying, 'social'::character varying, 'milestone'::character varying]::text[])),
  criteria jsonb NOT NULL,
  secret boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT achievements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.daily_mood (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  day date NOT NULL,
  mood integer CHECK (mood >= 0 AND mood <= 4),
  note text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT daily_mood_pkey PRIMARY KEY (id),
  CONSTRAINT daily_mood_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.equipment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  description text,
  created_by uuid,
  is_public boolean DEFAULT true,
  CONSTRAINT equipment_pkey PRIMARY KEY (id),
  CONSTRAINT equipment_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.exercise_equipment (
  exercise_id uuid NOT NULL,
  equipment_id uuid NOT NULL,
  is_required boolean NOT NULL DEFAULT false,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT exercise_equipment_pkey PRIMARY KEY (id),
  CONSTRAINT exercise_equipment_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id),
  CONSTRAINT exercise_equipment_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id)
);
CREATE TABLE public.exercise_muscles (
  exercise_id uuid NOT NULL,
  muscle_id uuid NOT NULL,
  is_primary boolean NOT NULL,
  CONSTRAINT exercise_muscles_pkey PRIMARY KEY (exercise_id, muscle_id),
  CONSTRAINT exercise_muscles_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id),
  CONSTRAINT exercise_muscles_muscle_id_fkey FOREIGN KEY (muscle_id) REFERENCES public.muscles(id)
);
CREATE TABLE public.exercise_sets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workout_exercises_id uuid,
  set_no integer,
  metric character varying NOT NULL CHECK (metric::text = ANY (ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying]::text[])),
  value numeric,
  completed boolean DEFAULT false,
  CONSTRAINT exercise_sets_pkey PRIMARY KEY (id),
  CONSTRAINT exercise_sets_workout_exercises_id_fkey FOREIGN KEY (workout_exercises_id) REFERENCES public.workout_exercises(id)
);
CREATE TABLE public.exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text NOT NULL,
  difficulty integer CHECK (difficulty >= 1 AND difficulty <= 5),
  youtube_url text,
  cues ARRAY,
  log_mode character varying DEFAULT 'reps_weight'::character varying CHECK (log_mode::text = ANY (ARRAY['reps_weight'::character varying, 'reps'::character varying, 'distance'::character varying, 'distance_weight'::character varying, 'time'::character varying, 'time_weight'::character varying]::text[])),
  created_by uuid,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT exercises_pkey PRIMARY KEY (id),
  CONSTRAINT exercises_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.friends (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  addressee_id uuid NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'blocked'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT friends_pkey PRIMARY KEY (id),
  CONSTRAINT friends_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id),
  CONSTRAINT friends_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES public.users(id)
);
CREATE TABLE public.goal_progress (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  goal_id bigint,
  recorded_at time with time zone,
  current_value numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT goal_progress_pkey PRIMARY KEY (id),
  CONSTRAINT goal_progress_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(id)
);
CREATE TABLE public.goals (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  goals text,
  goal_type USER-DEFINED,
  target_value numeric,
  initial_value numeric,
  unit text,
  status text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  start_date timestamp with time zone DEFAULT now(),
  due_date timestamp with time zone,
  CONSTRAINT goals_pkey PRIMARY KEY (id),
  CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.muscles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  parent_id uuid,
  CONSTRAINT muscles_pkey PRIMARY KEY (id),
  CONSTRAINT muscles_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.muscles(id)
);
CREATE TABLE public.plan_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  plan_id uuid,
  exercise_id uuid,
  sequence_no integer,
  target_sets integer,
  metric character varying NOT NULL CHECK (metric::text = ANY (ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying]::text[])),
  target_value numeric NOT NULL,
  rest_seconds numeric NOT NULL,
  CONSTRAINT plan_exercises_pkey PRIMARY KEY (id),
  CONSTRAINT plan_exercises_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.workout_plans(id),
  CONSTRAINT plan_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  author_id uuid,
  workout_id uuid,
  body text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id),
  CONSTRAINT posts_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id)
);
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL,
  progress integer,
  unlocked_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id)
);
CREATE TABLE public.user_info (
  user_id uuid NOT NULL,
  preferred_name character varying,
  gender USER-DEFINED,
  height_cm numeric,
  weight_kg numeric,
  primary_goal ARRAY,
  training_days_per_week integer CHECK (training_days_per_week >= 1 AND training_days_per_week <= 7),
  available_days ARRAY DEFAULT '{}'::integer[] CHECK (available_days IS NULL OR available_days <@ ARRAY[0, 1, 2, 3, 4, 5, 6]),
  session_duration integer DEFAULT 60,
  problem_areas ARRAY,
  preferred_split ARRAY,
  gym_comfort_level ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  experience_level integer,
  trainer boolean,
  CONSTRAINT user_info_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_settings (
  user_id uuid NOT NULL,
  units character varying NOT NULL DEFAULT 'metric'::character varying CHECK (units::text = ANY (ARRAY['metric'::character varying, 'imperial'::character varying]::text[])),
  notifications_enabled boolean DEFAULT true,
  weekly_review_day integer NOT NULL DEFAULT 0 CHECK (weekly_review_day >= 0 AND weekly_review_day <= 6),
  streak_display boolean DEFAULT true,
  goal_display character varying DEFAULT 'big'::character varying CHECK (goal_display::text = ANY (ARRAY['big'::character varying, 'small'::character varying, 'both'::character varying, 'none'::character varying]::text[])),
  trainer integer DEFAULT 0 CHECK (trainer >= 0 AND trainer <= 1),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  username character varying NOT NULL UNIQUE,
  display_name character varying NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.weekly_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date,
  CONSTRAINT weekly_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.workout_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workout_id uuid,
  exercise_id uuid,
  sequence_no integer,
  note text,
  CONSTRAINT workout_exercises_pkey PRIMARY KEY (id),
  CONSTRAINT workout_exercises_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id),
  CONSTRAINT workout_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id)
);
CREATE TABLE public.workout_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  program_id uuid NOT NULL,
  week_number integer,
  day_number integer CHECK (day_number >= 0 AND day_number <= 6),
  name text NOT NULL,
  description text,
  scheduled_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workout_plans_pkey PRIMARY KEY (id),
  CONSTRAINT workout_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT workout_plans_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.workout_programs(id)
);
CREATE TABLE public.workout_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name character varying,
  description text,
  weeks_count integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workout_programs_pkey PRIMARY KEY (id),
  CONSTRAINT workout_programs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.workouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid,
  started_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone,
  duration_s integer,
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  easiest_exercise_id uuid,
  hardest_exercise_id uuid,
  comfort_rating integer CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workouts_pkey PRIMARY KEY (id),
  CONSTRAINT workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT workouts_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.workout_plans(id),
  CONSTRAINT workouts_easiest_exercise_id_fkey FOREIGN KEY (easiest_exercise_id) REFERENCES public.exercises(id),
  CONSTRAINT workouts_hardest_exercise_id_fkey FOREIGN KEY (hardest_exercise_id) REFERENCES public.exercises(id)
);