SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."gender" AS ENUM (
    'male',
    'female',
    'non_binary',
    'other',
    'prefer_not_to_say'
);


ALTER TYPE "public"."gender" OWNER TO "postgres";


CREATE TYPE "public"."goal_type" AS ENUM (
    'endurance',
    'weight_loss',
    'strength'
);


ALTER TYPE "public"."goal_type" OWNER TO "postgres";


CREATE TYPE "public"."gym_comfort_level" AS ENUM (
    'interested',
    'nervous',
    'distressed',
    'excited',
    'upset',
    'strong',
    'guilty',
    'scared',
    'hostile',
    'enthusiastic',
    'proud',
    'irritable',
    'alert',
    'ashamed',
    'inspired',
    'determined'
);


ALTER TYPE "public"."gym_comfort_level" OWNER TO "postgres";


CREATE TYPE "public"."preferred_split" AS ENUM (
    'full_body',
    'upper_lower',
    'push_pull_legs',
    'other',
    'dont_know'
);


ALTER TYPE "public"."preferred_split" OWNER TO "postgres";


CREATE TYPE "public"."primary_goal" AS ENUM (
    'fat_loss',
    'muscle_gain',
    'strength',
    'endurance',
    'mobility',
    'general_fitness'
);


ALTER TYPE "public"."primary_goal" OWNER TO "postgres";


CREATE TYPE "public"."training_location" AS ENUM (
    'gym',
    'home',
    'outdoor',
    'mixed'
);


ALTER TYPE "public"."training_location" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_auth_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- 创建 public.users
  INSERT INTO public.users (id, username, display_name)
  VALUES (NEW.id, NEW.email, NEW.email);

  -- 创建 user_settings（默认值都可插入）
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  -- 创建 user_info（只插入 user_id，其他字段全部使用默认值或 NULL）
  INSERT INTO public.user_info (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_auth_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "icon" "text",
    "category" character varying(20),
    "criteria" "jsonb" NOT NULL,
    "secret" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "achievements_category_check" CHECK ((("category")::"text" = ANY ((ARRAY['workout'::character varying, 'consistency'::character varying, 'strenght'::character varying, 'social'::character varying, 'milestone'::character varying])::"text"[])))
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_mood" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "day" "date" NOT NULL,
    "mood" integer,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "daily_mood_mood_check" CHECK ((("mood" >= 0) AND ("mood" <= 4)))
);


ALTER TABLE "public"."daily_mood" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "created_by" "uuid",
    "is_public" boolean DEFAULT true
);


ALTER TABLE "public"."equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercise_equipment" (
    "exercise_id" "uuid" NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "is_required" boolean DEFAULT false NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."exercise_equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercise_muscles" (
    "exercise_id" "uuid" NOT NULL,
    "muscle_id" "uuid" NOT NULL,
    "is_primary" boolean NOT NULL
);


ALTER TABLE "public"."exercise_muscles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercise_sets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_exercises_id" "uuid",
    "set_no" integer,
    "metric1" character varying(20) NOT NULL,
    "value1" numeric,
    "completed" boolean DEFAULT false,
    "metric2" character varying,
    "value2" numeric,
    CONSTRAINT "exercise_sets_metric_check" CHECK ((("metric1")::"text" = ANY ((ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying])::"text"[])))
);


ALTER TABLE "public"."exercise_sets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying(100) NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text" NOT NULL,
    "difficulty" integer,
    "youtube_url" "text",
    "cues" "text"[],
    "log_mode" character varying(20) DEFAULT 'reps_weight'::character varying,
    "created_by" "uuid",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "exercises_difficulty_check" CHECK ((("difficulty" >= 1) AND ("difficulty" <= 5))),
    CONSTRAINT "exercises_log_mode_check" CHECK ((("log_mode")::"text" = ANY ((ARRAY['reps_weight'::character varying, 'reps'::character varying, 'distance'::character varying, 'distance_weight'::character varying, 'time'::character varying, 'time_weight'::character varying])::"text"[])))
);


ALTER TABLE "public"."exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friends" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "requester_id" "uuid" NOT NULL,
    "addressee_id" "uuid" NOT NULL,
    "status" character varying(10) DEFAULT 'pending'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "friends_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'blocked'::character varying])::"text"[])))
);


ALTER TABLE "public"."friends" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."goal_progress" (
    "id" bigint NOT NULL,
    "goal_id" bigint,
    "recorded_at" time with time zone,
    "current_value" numeric,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."goal_progress" OWNER TO "postgres";


ALTER TABLE "public"."goal_progress" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."goal_progress_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."goals" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "goals" "text",
    "goal_type" "public"."goal_type",
    "target_value" numeric,
    "initial_value" numeric,
    "unit" "text",
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start_date" timestamp with time zone DEFAULT "now"(),
    "due_date" timestamp with time zone
);


ALTER TABLE "public"."goals" OWNER TO "postgres";


ALTER TABLE "public"."goals" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."goals_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."muscles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "parent_id" "uuid"
);


ALTER TABLE "public"."muscles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."plan_exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "plan_id" "uuid",
    "exercise_id" "uuid",
    "sequence_no" integer,
    "target_sets" integer,
    "metric" character varying(20) NOT NULL,
    "target_value" numeric NOT NULL,
    "rest_seconds" numeric NOT NULL,
    CONSTRAINT "plan_exercises_metric_check" CHECK ((("metric")::"text" = ANY ((ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying])::"text"[])))
);


ALTER TABLE "public"."plan_exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_id" "uuid",
    "workout_id" "uuid",
    "body" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "achievement_id" "uuid" NOT NULL,
    "progress" integer,
    "unlocked_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_info" (
    "user_id" "uuid" NOT NULL,
    "preferred_name" character varying(100),
    "gender" "public"."gender",
    "height_cm" numeric(5,2),
    "weight_kg" numeric(5,2),
    "primary_goal" "public"."primary_goal"[],
    "training_days_per_week" integer,
    "available_days" integer[] DEFAULT '{}'::integer[],
    "session_duration" integer DEFAULT 60,
    "problem_areas" "text"[],
    "preferred_split" "public"."preferred_split"[],
    "gym_comfort_level" "public"."gym_comfort_level"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "experience_level" integer,
    "trainer" boolean,
    "bmi" numeric,
    CONSTRAINT "available_days_valid_range" CHECK ((("available_days" IS NULL) OR ("available_days" <@ ARRAY[0, 1, 2, 3, 4, 5, 6]))),
    CONSTRAINT "user_info_training_days_per_week_check" CHECK ((("training_days_per_week" >= 1) AND ("training_days_per_week" <= 7)))
);


ALTER TABLE "public"."user_info" OWNER TO "postgres";


COMMENT ON COLUMN "public"."user_info"."bmi" IS 'Body Mass Index, calculated from weight_kg and height_cm';



CREATE TABLE IF NOT EXISTS "public"."user_progress_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "data_type" character varying NOT NULL,
    "value" numeric NOT NULL,
    "recorded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_progress_history_data_type_check" CHECK ((("data_type")::"text" = ANY (ARRAY[('weight'::character varying)::"text", ('bmi'::character varying)::"text"])))
);


ALTER TABLE "public"."user_progress_history" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_progress_history" IS 'Stores historical weight and BMI data for users to track progress over time';



CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "user_id" "uuid" NOT NULL,
    "units" character varying(10) DEFAULT 'metric'::character varying NOT NULL,
    "notifications_enabled" boolean DEFAULT true,
    "weekly_review_day" integer DEFAULT 0 NOT NULL,
    "streak_display" boolean DEFAULT true,
    "goal_display" character varying(10) DEFAULT 'big'::character varying,
    "trainer" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_settings_goal_display_check" CHECK ((("goal_display")::"text" = ANY ((ARRAY['big'::character varying, 'small'::character varying, 'both'::character varying, 'none'::character varying])::"text"[]))),
    CONSTRAINT "user_settings_trainer_check" CHECK ((("trainer" >= 0) AND ("trainer" <= 1))),
    CONSTRAINT "user_settings_units_check" CHECK ((("units")::"text" = ANY ((ARRAY['metric'::character varying, 'imperial'::character varying])::"text"[]))),
    CONSTRAINT "user_settings_weekly_review_day_check" CHECK ((("weekly_review_day" >= 0) AND ("weekly_review_day" <= 6)))
);


ALTER TABLE "public"."user_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_subscription" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "sub_status" "text" NOT NULL,
    "current_period_end" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_subscription" OWNER TO "postgres";


ALTER TABLE "public"."user_subscription" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_subscription_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "username" character varying(30) NOT NULL,
    "display_name" character varying(100) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "referred_by" "uuid",
    "referral_code" "text",
    "latest_login" "date",
    "logon_days" integer
);


ALTER TABLE "public"."users" OWNER TO "postgres";


-- Ensure columns exist even if table already existed
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "logon_days" integer;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "latest_login" date;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "referral_code" text;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "referred_by" uuid;

COMMENT ON COLUMN "public"."users"."logon_days" IS 'number of distinct days this user has opened the app';



CREATE TABLE IF NOT EXISTS "public"."workout_exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_id" "uuid",
    "exercise_id" "uuid",
    "sequence_no" integer,
    "note" "text"
);


ALTER TABLE "public"."workout_exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "plan_id" "uuid",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "ended_at" timestamp with time zone,
    "duration_s" integer,
    "difficulty_rating" integer,
    "easiest_exercise_id" "uuid",
    "hardest_exercise_id" "uuid",
    "comfort_rating" integer,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "workouts_comfort_rating_check" CHECK ((("comfort_rating" >= 1) AND ("comfort_rating" <= 5))),
    CONSTRAINT "workouts_difficulty_rating_check" CHECK ((("difficulty_rating" >= 1) AND ("difficulty_rating" <= 5)))
);


ALTER TABLE "public"."workouts" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."view_user_stats_aggregated" AS
 SELECT "id" AS "user_id",
    COALESCE(( SELECT "count"(*) AS "count"
           FROM "public"."workouts" "w"
          WHERE ("w"."user_id" = "u"."id")), (0)::bigint) AS "workout_count",
    COALESCE(( SELECT "sum"("w"."duration_s") AS "sum"
           FROM "public"."workouts" "w"
          WHERE ("w"."user_id" = "u"."id")), (0)::bigint) AS "total_workout_seconds",
    COALESCE(( SELECT "count"(DISTINCT "date"("w"."started_at")) AS "count"
           FROM "public"."workouts" "w"
          WHERE ("w"."user_id" = "u"."id")), (0)::bigint) AS "active_days_count",
    COALESCE(( SELECT "count"(*) AS "count"
           FROM ("public"."workout_exercises" "we"
             JOIN "public"."workouts" "w" ON (("we"."workout_id" = "w"."id")))
          WHERE ("w"."user_id" = "u"."id")), (0)::bigint) AS "exercise_complete_count",
    COALESCE(( SELECT "max"("es"."value1") AS "max"
           FROM (("public"."exercise_sets" "es"
             JOIN "public"."workout_exercises" "we" ON (("es"."workout_exercises_id" = "we"."id")))
             JOIN "public"."workouts" "w" ON (("we"."workout_id" = "w"."id")))
          WHERE (("w"."user_id" = "u"."id") AND (("es"."metric1")::"text" = 'weight'::"text"))), (0)::numeric) AS "max_weight_lifted",
    COALESCE(( SELECT "count"(*) AS "count"
           FROM "public"."daily_mood" "dm"
          WHERE ("dm"."user_id" = "u"."id")), (0)::bigint) AS "mood_log_count",
    COALESCE(( SELECT "count"(*) AS "count"
           FROM "public"."friends" "f"
          WHERE ((("f"."requester_id" = "u"."id") OR ("f"."addressee_id" = "u"."id")) AND (("f"."status")::"text" = 'accepted'::"text"))), (0)::bigint) AS "friend_count"
   FROM "public"."users" "u";


ALTER VIEW "public"."view_user_stats_aggregated" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."view_user_streaks" AS
 WITH "unique_dates" AS (
         SELECT DISTINCT "workouts"."user_id",
            "date"("workouts"."started_at") AS "activity_date"
           FROM "public"."workouts"
        ), "groups" AS (
         SELECT "unique_dates"."user_id",
            "unique_dates"."activity_date",
            ("unique_dates"."activity_date" - ("row_number"() OVER (PARTITION BY "unique_dates"."user_id" ORDER BY "unique_dates"."activity_date"))::integer) AS "group_id"
           FROM "unique_dates"
        ), "streak_groups" AS (
         SELECT "groups"."user_id",
            "count"(*) AS "streak_length",
            "max"("groups"."activity_date") AS "last_activity_date"
           FROM "groups"
          GROUP BY "groups"."user_id", "groups"."group_id"
        )
 SELECT "id" AS "user_id",
    COALESCE(( SELECT "max"("sg"."streak_length") AS "max"
           FROM "streak_groups" "sg"
          WHERE (("sg"."user_id" = "u"."id") AND ("sg"."last_activity_date" >= (CURRENT_DATE - 1)))), (0)::bigint) AS "current_workout_streak",
    COALESCE(( SELECT "max"("sg"."last_activity_date") AS "max"
           FROM "streak_groups" "sg"
          WHERE (("sg"."user_id" = "u"."id") AND ("sg"."last_activity_date" >= (CURRENT_DATE - 1)))), NULL::"date") AS "last_streak_date"
   FROM "public"."users" "u";


ALTER VIEW "public"."view_user_streaks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."weekly_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "date" "date"
);


ALTER TABLE "public"."weekly_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workouts_id" "uuid",
    "ai_feedback" character varying,
    "difficulty_level" numeric,
    "mood" numeric,
    "mood_notes" character varying,
    "workout_notes" character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workout_feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "program_id" "uuid" NOT NULL,
    "week_number" integer,
    "day_number" integer,
    "name" "text" NOT NULL,
    "description" "text",
    "scheduled_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "workout_plans_day_of_week_check" CHECK ((("day_number" >= 0) AND ("day_number" <= 6)))
);


ALTER TABLE "public"."workout_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" character varying(200),
    "description" "text",
    "weeks_count" integer,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workout_days" integer[]
);


ALTER TABLE "public"."workout_programs" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_mood"
    ADD CONSTRAINT "daily_mood_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_equipment"
    ADD CONSTRAINT "exercise_equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_muscles"
    ADD CONSTRAINT "exercise_muscles_pkey" PRIMARY KEY ("exercise_id", "muscle_id");



ALTER TABLE ONLY "public"."exercise_sets"
    ADD CONSTRAINT "exercise_sets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_requester_id_addressee_id_key" UNIQUE ("requester_id", "addressee_id");



ALTER TABLE ONLY "public"."goal_progress"
    ADD CONSTRAINT "goal_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."muscles"
    ADD CONSTRAINT "muscles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."muscles"
    ADD CONSTRAINT "muscles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."plan_exercises"
    ADD CONSTRAINT "plan_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."plan_exercises"
    ADD CONSTRAINT "plan_exercises_plan_id_exercise_id_key" UNIQUE ("plan_id", "exercise_id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_info"
    ADD CONSTRAINT "user_info_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_progress_history"
    ADD CONSTRAINT "user_progress_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_subscription"
    ADD CONSTRAINT "user_subscription_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_display_name_key" UNIQUE ("display_name");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_referral_code_key" UNIQUE ("referral_code");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."weekly_reviews"
    ADD CONSTRAINT "weekly_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_feedback"
    ADD CONSTRAINT "workout_feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_programs"
    ADD CONSTRAINT "workout_programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_user_progress_history_recorded_at" ON "public"."user_progress_history" USING "btree" ("recorded_at");



CREATE INDEX "idx_user_progress_history_type" ON "public"."user_progress_history" USING "btree" ("data_type");



CREATE INDEX "idx_user_progress_history_user_id" ON "public"."user_progress_history" USING "btree" ("user_id");



CREATE INDEX "idx_user_progress_history_user_type" ON "public"."user_progress_history" USING "btree" ("user_id", "data_type");



ALTER TABLE ONLY "public"."daily_mood"
    ADD CONSTRAINT "daily_mood_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."exercise_equipment"
    ADD CONSTRAINT "exercise_equipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_equipment"
    ADD CONSTRAINT "exercise_equipment_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_muscles"
    ADD CONSTRAINT "exercise_muscles_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_muscles"
    ADD CONSTRAINT "exercise_muscles_muscle_id_fkey" FOREIGN KEY ("muscle_id") REFERENCES "public"."muscles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_sets"
    ADD CONSTRAINT "exercise_sets_workout_exercises_id_fkey" FOREIGN KEY ("workout_exercises_id") REFERENCES "public"."workout_exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_addressee_id_fkey" FOREIGN KEY ("addressee_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."goal_progress"
    ADD CONSTRAINT "goal_progress_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."muscles"
    ADD CONSTRAINT "muscles_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."muscles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."plan_exercises"
    ADD CONSTRAINT "plan_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."plan_exercises"
    ADD CONSTRAINT "plan_exercises_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_info"
    ADD CONSTRAINT "user_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress_history"
    ADD CONSTRAINT "user_progress_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_subscription"
    ADD CONSTRAINT "user_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_referred_by_fkey" FOREIGN KEY ("referred_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."weekly_reviews"
    ADD CONSTRAINT "weekly_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id");



ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_feedback"
    ADD CONSTRAINT "workout_feedback_workouts_id_fkey" FOREIGN KEY ("workouts_id") REFERENCES "public"."workouts"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."workout_programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_programs"
    ADD CONSTRAINT "workout_programs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_easiest_exercise_id_fkey" FOREIGN KEY ("easiest_exercise_id") REFERENCES "public"."exercises"("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_hardest_exercise_id_fkey" FOREIGN KEY ("hardest_exercise_id") REFERENCES "public"."exercises"("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow owner insert workout_plans" ON "public"."workout_plans" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow owner insert workout_programs" ON "public"."workout_plans" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow owner insert workout_programs" ON "public"."workout_programs" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own settings" ON "public"."user_settings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own settings" ON "public"."user_settings" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own settings" ON "public"."user_settings" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow_insert_via_trigger" ON "public"."user_settings" FOR INSERT WITH CHECK (true);



CREATE POLICY "anyone_select_muscles" ON "public"."muscles" FOR SELECT USING (true);



ALTER TABLE "public"."daily_mood" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_muscles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."goal_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."muscles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plan_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_delete_self" ON "public"."users" FOR DELETE USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."user_info" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_insert_own_equipment" ON "public"."equipment" FOR INSERT WITH CHECK (("created_by" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_insert_own_exercises" ON "public"."exercises" FOR INSERT WITH CHECK (("created_by" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_insert_own_info" ON "public"."user_info" FOR INSERT WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_insert_own_review" ON "public"."weekly_reviews" FOR INSERT WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_insert_self" ON "public"."users" FOR INSERT WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_manage_own_mood" ON "public"."daily_mood" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_manage_own_posts" ON "public"."posts" USING (("author_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("author_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_manage_own_workout" ON "public"."workouts" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_own_achievements" ON "public"."user_achievements" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_own_friends" ON "public"."friends" FOR SELECT USING ((("requester_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("addressee_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "user_select_own_info" ON "public"."user_info" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_own_plan" ON "public"."workout_plans" FOR SELECT USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_own_program" ON "public"."workout_programs" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_own_review" ON "public"."weekly_reviews" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_own_settings" ON "public"."user_settings" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_owned_public_equipment" ON "public"."equipment" FOR SELECT USING (("is_public" OR ("created_by" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "user_select_public_achievements" ON "public"."achievements" FOR SELECT USING ((NOT "secret"));



CREATE POLICY "user_select_public_own_exercises" ON "public"."exercises" FOR SELECT USING (("is_public" OR ("created_by" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "user_select_self" ON "public"."users" FOR SELECT USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_select_through_own_plans" ON "public"."plan_exercises" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."workout_plans" "wp"
  WHERE (("wp"."id" = "plan_exercises"."id") AND ("wp"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "user_select_through_own_workout_exercises" ON "public"."exercise_sets" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."workout_exercises" "we"
     JOIN "public"."workouts" "w" ON (("w"."id" = "we"."workout_id")))
  WHERE ("we"."id" = "exercise_sets"."workout_exercises_id"))));



CREATE POLICY "user_select_through_own_workouts" ON "public"."workout_exercises" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."workouts" "w"
  WHERE ("w"."id" = "workout_exercises"."workout_id"))));



CREATE POLICY "user_select_through_owned_public_exercises" ON "public"."exercise_equipment" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."exercises" "e"
  WHERE (("e"."id" = "exercise_equipment"."exercise_id") AND ("e"."is_public" OR ("e"."created_by" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "user_select_through_owned_public_exercises" ON "public"."exercise_muscles" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."exercises" "e"
  WHERE (("e"."id" = "exercise_muscles"."exercise_id") AND ("e"."is_public" OR ("e"."created_by" = ( SELECT "auth"."uid"() AS "uid")))))));



ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_subscription" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_update_own_equipment" ON "public"."equipment" FOR UPDATE USING (("created_by" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("created_by" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_update_own_exercises" ON "public"."exercises" FOR UPDATE USING (("created_by" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("created_by" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_update_own_friends" ON "public"."friends" FOR UPDATE USING ((("requester_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("addressee_id" = ( SELECT "auth"."uid"() AS "uid")))) WITH CHECK ((("requester_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("addressee_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "user_update_own_info" ON "public"."user_info" FOR UPDATE USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_update_own_plan" ON "public"."workout_plans" FOR UPDATE USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_update_own_review" ON "public"."weekly_reviews" FOR UPDATE USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_update_own_settings" ON "public"."user_settings" FOR UPDATE USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_update_self" ON "public"."users" FOR UPDATE USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "user_view_friends_posts" ON "public"."posts" FOR SELECT USING ((("author_id" = ( SELECT "auth"."uid"() AS "uid")) OR (EXISTS ( SELECT 1
   FROM "public"."friends" "f"
  WHERE ((("f"."status")::"text" = 'accepted'::"text") AND ((("f"."requester_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("f"."addressee_id" = "posts"."author_id")) OR (("f"."addressee_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("f"."requester_id" = "posts"."author_id"))))))));



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."weekly_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workouts" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."daily_mood" TO "anon";
GRANT ALL ON TABLE "public"."daily_mood" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_mood" TO "service_role";



GRANT ALL ON TABLE "public"."equipment" TO "anon";
GRANT ALL ON TABLE "public"."equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_equipment" TO "anon";
GRANT ALL ON TABLE "public"."exercise_equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_equipment" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_muscles" TO "anon";
GRANT ALL ON TABLE "public"."exercise_muscles" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_muscles" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_sets" TO "anon";
GRANT ALL ON TABLE "public"."exercise_sets" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_sets" TO "service_role";



GRANT ALL ON TABLE "public"."exercises" TO "anon";
GRANT ALL ON TABLE "public"."exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."exercises" TO "service_role";



GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";



GRANT ALL ON TABLE "public"."goal_progress" TO "anon";
GRANT ALL ON TABLE "public"."goal_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."goal_progress" TO "service_role";



GRANT ALL ON SEQUENCE "public"."goal_progress_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."goal_progress_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."goal_progress_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";



GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."muscles" TO "anon";
GRANT ALL ON TABLE "public"."muscles" TO "authenticated";
GRANT ALL ON TABLE "public"."muscles" TO "service_role";



GRANT ALL ON TABLE "public"."plan_exercises" TO "anon";
GRANT ALL ON TABLE "public"."plan_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."plan_exercises" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."user_achievements" TO "anon";
GRANT ALL ON TABLE "public"."user_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."user_achievements" TO "service_role";



GRANT ALL ON TABLE "public"."user_info" TO "anon";
GRANT ALL ON TABLE "public"."user_info" TO "authenticated";
GRANT ALL ON TABLE "public"."user_info" TO "service_role";



GRANT ALL ON TABLE "public"."user_progress_history" TO "anon";
GRANT ALL ON TABLE "public"."user_progress_history" TO "authenticated";
GRANT ALL ON TABLE "public"."user_progress_history" TO "service_role";



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";



GRANT ALL ON TABLE "public"."user_subscription" TO "anon";
GRANT ALL ON TABLE "public"."user_subscription" TO "authenticated";
GRANT ALL ON TABLE "public"."user_subscription" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_subscription_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_subscription_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_subscription_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."workout_exercises" TO "anon";
GRANT ALL ON TABLE "public"."workout_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_exercises" TO "service_role";



GRANT ALL ON TABLE "public"."workouts" TO "anon";
GRANT ALL ON TABLE "public"."workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."workouts" TO "service_role";



GRANT ALL ON TABLE "public"."view_user_stats_aggregated" TO "anon";
GRANT ALL ON TABLE "public"."view_user_stats_aggregated" TO "authenticated";
GRANT ALL ON TABLE "public"."view_user_stats_aggregated" TO "service_role";



GRANT ALL ON TABLE "public"."view_user_streaks" TO "anon";
GRANT ALL ON TABLE "public"."view_user_streaks" TO "authenticated";
GRANT ALL ON TABLE "public"."view_user_streaks" TO "service_role";



GRANT ALL ON TABLE "public"."weekly_reviews" TO "anon";
GRANT ALL ON TABLE "public"."weekly_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."weekly_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."workout_feedback" TO "anon";
GRANT ALL ON TABLE "public"."workout_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_feedback" TO "service_role";



GRANT ALL ON TABLE "public"."workout_plans" TO "anon";
GRANT ALL ON TABLE "public"."workout_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_plans" TO "service_role";



GRANT ALL ON TABLE "public"."workout_programs" TO "anon";
GRANT ALL ON TABLE "public"."workout_programs" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_programs" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

alter table "public"."achievements" drop constraint "achievements_category_check";

alter table "public"."exercise_sets" drop constraint "exercise_sets_metric_check";

alter table "public"."exercises" drop constraint "exercises_log_mode_check";

alter table "public"."friends" drop constraint "friends_status_check";

alter table "public"."plan_exercises" drop constraint "plan_exercises_metric_check";

alter table "public"."user_settings" drop constraint "user_settings_goal_display_check";

alter table "public"."user_settings" drop constraint "user_settings_units_check";

alter table "public"."achievements" add constraint "achievements_category_check" CHECK (((category)::text = ANY ((ARRAY['workout'::character varying, 'consistency'::character varying, 'strenght'::character varying, 'social'::character varying, 'milestone'::character varying])::text[]))) not valid;

alter table "public"."achievements" validate constraint "achievements_category_check";

alter table "public"."exercise_sets" add constraint "exercise_sets_metric_check" CHECK (((metric1)::text = ANY ((ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying])::text[]))) not valid;

alter table "public"."exercise_sets" validate constraint "exercise_sets_metric_check";

alter table "public"."exercises" add constraint "exercises_log_mode_check" CHECK (((log_mode)::text = ANY ((ARRAY['reps_weight'::character varying, 'reps'::character varying, 'distance'::character varying, 'distance_weight'::character varying, 'time'::character varying, 'time_weight'::character varying])::text[]))) not valid;

alter table "public"."exercises" validate constraint "exercises_log_mode_check";

alter table "public"."friends" add constraint "friends_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'blocked'::character varying])::text[]))) not valid;

alter table "public"."friends" validate constraint "friends_status_check";

alter table "public"."plan_exercises" add constraint "plan_exercises_metric_check" CHECK (((metric)::text = ANY ((ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying])::text[]))) not valid;

alter table "public"."plan_exercises" validate constraint "plan_exercises_metric_check";

alter table "public"."user_settings" add constraint "user_settings_goal_display_check" CHECK (((goal_display)::text = ANY ((ARRAY['big'::character varying, 'small'::character varying, 'both'::character varying, 'none'::character varying])::text[]))) not valid;

alter table "public"."user_settings" validate constraint "user_settings_goal_display_check";

alter table "public"."user_settings" add constraint "user_settings_units_check" CHECK (((units)::text = ANY ((ARRAY['metric'::character varying, 'imperial'::character varying])::text[]))) not valid;

alter table "public"."user_settings" validate constraint "user_settings_units_check";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


