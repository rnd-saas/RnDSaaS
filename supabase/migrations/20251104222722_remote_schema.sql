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


