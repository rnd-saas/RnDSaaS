


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
    "description" "text"
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
    "metric" character varying(20) NOT NULL,
    "value" numeric,
    "completed" boolean DEFAULT false,
    CONSTRAINT "exercise_sets_metric_check" CHECK ((("metric")::"text" = ANY ((ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying])::"text"[])))
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


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "username" character varying(30) NOT NULL,
    "display_name" character varying(100) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."weekly_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "date" "date"
);


ALTER TABLE "public"."weekly_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_id" "uuid",
    "exercise_id" "uuid",
    "sequence_no" integer,
    "note" "text"
);


ALTER TABLE "public"."workout_exercises" OWNER TO "postgres";


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
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workout_programs" OWNER TO "postgres";


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



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_display_name_key" UNIQUE ("display_name");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."weekly_reviews"
    ADD CONSTRAINT "weekly_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_programs"
    ADD CONSTRAINT "workout_programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_mood"
    ADD CONSTRAINT "daily_mood_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



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



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."weekly_reviews"
    ADD CONSTRAINT "weekly_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id");



ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE CASCADE;



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



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."daily_mood" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_muscles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."muscles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plan_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."weekly_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workouts" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































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



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."weekly_reviews" TO "anon";
GRANT ALL ON TABLE "public"."weekly_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."weekly_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."workout_exercises" TO "anon";
GRANT ALL ON TABLE "public"."workout_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_exercises" TO "service_role";



GRANT ALL ON TABLE "public"."workout_plans" TO "anon";
GRANT ALL ON TABLE "public"."workout_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_plans" TO "service_role";



GRANT ALL ON TABLE "public"."workout_programs" TO "anon";
GRANT ALL ON TABLE "public"."workout_programs" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_programs" TO "service_role";



GRANT ALL ON TABLE "public"."workouts" TO "anon";
GRANT ALL ON TABLE "public"."workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."workouts" TO "service_role";









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

alter table "public"."exercise_sets" add constraint "exercise_sets_metric_check" CHECK (((metric)::text = ANY ((ARRAY['reps'::character varying, 'weight'::character varying, 'distance'::character varying, 'duration_s'::character varying, 'height'::character varying])::text[]))) not valid;

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


