SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict nAspzQAD2C7l3l1MtaDq5gq05WzoFt6CgTQcvKVvNFDuBz9pBJqEK0r2UI8UJnK

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."achievements" ("id", "name", "description", "icon", "category", "criteria", "secret", "created_at", "updated_at") VALUES
	('dcb51a97-fcbe-429c-941d-081db82edce6', 'First Step Taken', 'Completed onboarding.', '🏁', 'milestone', '{"type": "onboarding_complete"}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('dfd63d17-9c44-4d2f-be1b-ed6bfa94f064', 'Showed Up Today', 'Opened the app / signed in.', '🔓', 'milestone', '{"type": "app_open_count", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('a6b68dab-e206-48da-9caf-d3629e781d27', 'You Did It', 'Completed your first workout.', '✨', 'workout', '{"type": "workout_count", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('1043a035-3f56-46ff-8a4e-592c7fdeaaa3', 'Courage Counts', 'Started a workout even when feeling nervous.', '🧠', 'social', '{"mood": "anxious", "type": "workout_started_with_mood"}', true, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('41860f68-c33b-492a-beee-5908e41e91b0', 'Tiny but Mighty', 'Completed at least one exercise.', '🧩', 'workout', '{"type": "exercise_complete_count", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('1af9cca9-bd9c-4b1b-b01e-00e8211c4599', 'Trying is Winning', 'Completed a workout at a comfortable, low intensity.', '🌱', 'workout', '{"type": "workout_completed", "intensity_max": "low"}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('44b6819d-3765-4e24-a9e9-1ff0f1e4e6df', 'Momentum Starter', 'Logged in two days in a row.', '➡️', 'consistency', '{"days": 2, "type": "streak_days", "dimension": "login", "forgiving": true}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('e90f0d80-4765-481d-ac83-9f8f2c63a742', 'Two-Day Start', '2-day workout streak.', '🗓️', 'consistency', '{"days": 2, "type": "streak_days", "dimension": "workout", "forgiving": true}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('6a8938be-fc0f-43d7-94fe-cbfa53fd3819', 'Steady Steps', 'Completed 3 workouts in one week.', '👣', 'consistency', '{"type": "workouts_in_week", "count": 3, "forgiving": true}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('14756219-843c-4689-8d09-94b2b6d140b0', 'Routine Beginner', '1-week streak.', '📅', 'consistency', '{"type": "streak_weeks", "weeks": 1, "dimension": "workout", "forgiving": true}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('2d23605a-8a9c-4edb-a087-325b284f5961', 'Finding Your Flow', '2-week streak.', '🔁', 'consistency', '{"type": "streak_weeks", "weeks": 2, "dimension": "workout", "forgiving": true}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('29470dea-4d51-4590-91a7-678e0754de1c', 'Building a Habit', '30 active days.', '🧱', 'consistency', '{"days": 30, "type": "active_days", "forgiving": true}', true, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('b17f2a0b-f14b-400f-bae9-11b3c5f64461', 'Sticking With It', 'Logged workouts for 2 months.', '⏳', 'consistency', '{"type": "months_with_workouts", "months": 2, "forgiving": true}', true, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('3c47133b-459c-4158-9fb7-ac79888570ee', 'Showed Up Despite Anxiety', 'Completed a workout after logging anxiety.', '💪🧠', 'social', '{"type": "workout_after_mood", "previous_mood": "anxious"}', true, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('9b3ec12a-74a9-4f00-9508-07405c588f8b', 'Calm First', 'Used a calming/breathing tool before exercising.', '🫁', 'social', '{"tool": "breathing", "type": "tool_used", "window_before_workout_min": 60}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('356e303e-0287-4eb2-a4a7-04b770588782', 'Confidence Spark', 'Logged feeling more confident.', '🌟', 'social', '{"mood": "confident", "type": "mood_log"}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('ffe0156a-ebd8-4e91-a9fb-95e5ed1a34f8', 'Small Social Step', 'Engaged once in the anonymous community.', '💬', 'social', '{"type": "community_action", "count": 1, "action": "post_or_reply", "anonymous": true}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('254d86a1-807f-4838-83f7-a9940ae2e6fc', 'Reached Out', 'Used help/exercise guidance instead of avoiding a question.', '🆘', 'social', '{"type": "guidance_request", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('27591905-422c-4b11-bcf2-fb58497c53a3', 'Clear Mind Moment', 'Logged feeling calm during or after a workout.', '🧘', 'social', '{"mood": "calm", "type": "mood_log_after_workout"}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('71c72297-2012-4a58-ab94-7dc3a24688d5', 'Self-Proud', 'Recorded a positive self-reflection.', '💖', 'social', '{"type": "journal_entry", "sentiment": "positive"}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('ff0946dd-9814-4e25-8c64-f6da929a8cb3', 'Learner Mode', 'Watched the first exercise guide.', '🎓', 'milestone', '{"type": "guide_watched", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('c355dd1b-21a8-4881-9dbf-54259368ea1c', 'Form First', 'Practiced proper form for an exercise (form practice mode).', '📐', 'milestone', '{"type": "form_practice", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('5ba1edaf-3d28-41d5-9dda-e2112cf81116', 'New Move Explorer', 'Tried a new exercise.', '🧭', 'milestone', '{"type": "new_exercise_tried", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('858995bb-9ad5-42ea-a59c-01b09e6162b0', 'Plan Follower', 'Completed first planned routine.', '🗺️', 'milestone', '{"type": "planned_routine_complete", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('39dceeff-e603-435f-8a17-bbf60ffb3fdd', 'Mind-Body Connection', 'Logged feeling stronger or more aware of form.', '🧠💪', 'milestone', '{"type": "mood_log", "mood_any_of": ["strong", "aware"]}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('c34371c4-dbc0-4c27-8065-29c1f2ff4ccd', 'Recovery Day', 'Took a planned rest day.', '🌤️', 'milestone', '{"type": "rest_day", "planned": true}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('bd74b71d-1811-4ecd-bf5e-6fafaa47b20c', 'Checked In', 'Logged a mood.', '📝', 'milestone', '{"type": "mood_log_count", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('6e277e46-fb2c-4460-9afa-1a11417aec7e', 'Hydrated & Ready', 'Logged water intake.', '💧', 'milestone', '{"type": "water_log_count", "count": 1}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('94f20172-1a78-45f9-b8c7-ceae9d60ff1a', 'Self-Kindness', 'Responded positively to a journal prompt.', '💬💚', 'milestone', '{"type": "journal_entry", "sentiment": "positive"}', false, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00'),
	('0acb62be-a0f6-44f4-9543-341c38867336', 'Gentle Restart', 'Returned after a break without losing progress.', '🔄', 'milestone', '{"type": "return_after_gap", "days_gap_min": 7, "streak_preserved": true}', true, '2025-11-07 14:08:41.919067+00', '2025-11-07 14:08:41.919067+00');



--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."exercises" ("id", "slug", "name", "description", "difficulty", "youtube_url", "cues", "log_mode", "created_by", "is_public", "created_at", "updated_at") VALUES
	('5f2b797a-c569-4312-b781-e67070f227f2', 'bench-press', 'Bench Press (Barbell)', 'Flat barbell press for chest/shoulders/triceps.', 3, 'https://www.youtube.com/watch?v=gRVjAtPip0Y', '{"Feet planted","Shoulders retracted","Touch lower chest","Press to lockout"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('ec516eb8-38c4-404f-889a-a8fc566fa49a', 'chest-press-machine', 'Chest Press (Machine)', 'Guided machine press; easier setup and stability than barbell.', 2, 'https://www.youtube.com/watch?v=6I9IJtSML7k', '{"Seat so handles align mid-chest","Elbows ~45°","Control tempo","Don’t lock shoulders forward"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 'dumbbell-bench-press', 'Dumbbell Bench Press', 'Flat bench press with dumbbells; greater range of motion and stability.', 2, 'https://www.youtube.com/watch?v=VmB1G1K7v94', '{"Shoulders set","Wrists neutral","DBs to mid-chest","Press in slight arc"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('141b54ea-d908-4129-8a94-2e4e02dfdcde', 'dumbbell-shoulder-press', 'Dumbbell Shoulder Press', 'Overhead press with dumbbells; trains delts and triceps.', 3, 'https://www.youtube.com/watch?v=B-aVuyhvLHU', '{"Core braced","Elbows slightly forward","Press overhead","Head through at top"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('a83c1ede-ed4c-4c4d-b51a-b408966c37c5', 'incline-bench-press', 'Incline Bench Press (Barbell)', 'Press on 15–30° bench; upper-chest emphasis.', 3, 'https://www.youtube.com/watch?v=SrqOu55lrYU', '{"Scaps retracted","Touch upper chest","Forearms vertical","Control lower, drive up"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('699010b2-a7a4-4a1c-950e-cbb004bbeaea', 'lat-pulldown', 'Lat Pulldown', 'Vertical pull on cable machine; lats and upper back.', 2, 'https://www.youtube.com/watch?v=CAwf7n6Luuc', '{"Chest tall","Pull elbows to ribs","Bar to upper chest","Control the return"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('42be1efa-682d-4a40-9567-479b6ce69dbb', 'overhead-triceps-extension-cable', 'Overhead Triceps Extension (Cable)', 'Cable rope extension from overhead position; long head emphasis.', 2, 'https://www.youtube.com/watch?v=G3o5sZQnJxw', '{"Elbows stay fixed","Ribs down","Full elbow extension","Slow eccentric"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('daf92e2f-878f-441e-9f5e-9e5d75f142f7', 'standing-overhead-triceps-extension-db', 'Standing Overhead Triceps Extension (DB)', 'Single or double dumbbell overhead triceps extension.', 3, 'https://www.youtube.com/watch?v=-Vyt2QdsR7E', '{"Elbows narrow","Brace glutes & abs","Lower behind head","Extend to lockout without flaring"}', 'reps_weight', NULL, true, '2025-11-07 13:55:11.591988+00', '2025-11-07 13:59:18.491381+00'),
	('ac826afe-d309-4780-8f1e-abcf9905a41a', 'treadmill', 'Treadmill Run/Walk', 'Cardio performed on treadmill at chosen pace or incline.', 1, 'https://www.youtube.com/watch?v=MWjE5_8jZKc', '{"Start slow","Keep posture upright","Avoid holding handles","Gradually increase speed"}', 'time', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00'),
	('ba15edf2-63a2-442e-b614-a17a949582ff', 'single-arm-dumbbell-row', 'Single-Arm Dumbbell Row', 'Horizontal pull for lats and upper back using one dumbbell and bench support.', 2, 'https://www.youtube.com/watch?v=pYcpY20QaE8', '{"Flat back","Row elbow close","Pause at ribs","Control the descent"}', 'reps_weight', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00'),
	('b1f56dbd-240c-42f2-a157-5e678fdb136d', 'seated-cable-row', 'Seated Cable Row', 'Horizontal pull on cable row machine; mid-back focus.', 2, 'https://www.youtube.com/watch?v=GZbfZ033f74', '{"Chest up","Pull to lower ribs","Squeeze shoulder blades","Control return"}', 'reps_weight', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00'),
	('a7dbdfa5-d846-4211-aa6b-a0491c23e779', 'bicep-curl', 'Bicep Curl', 'Classic dumbbell curl for biceps development.', 1, 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', '{"Elbows stay close","Full range of motion","Don’t swing","Squeeze at top"}', 'reps_weight', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00'),
	('92ffbb4c-4909-4952-a8df-5d724164572a', 'concentration-curl', 'Concentration Curl', 'Seated single-arm curl focusing on biceps isolation.', 2, 'https://www.youtube.com/watch?v=soxrZlIl35U', '{"Elbow pressed into thigh","Controlled tempo","Squeeze at top","Full extension at bottom"}', 'reps_weight', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00'),
	('6e95536f-db9a-4995-bc7b-3b8153288f27', 'chest-dips', 'Chest Dips', 'Bodyweight dip leaning forward to target lower chest and triceps.', 3, 'https://www.youtube.com/watch?v=2z8JmcrW-As', '{"Lean slightly forward","Elbows ~45°","Lower until stretch","Drive up powerfully"}', 'reps', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00'),
	('1dade505-a3c8-454f-a0e4-3af73e7fd281', 'leg-press', 'Leg Press (Machine)', 'Compound lower-body push on sled or plate-loaded machine.', 2, 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', '{"Feet shoulder-width","Knees track over toes","Do not lock out","Control full range"}', 'reps_weight', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00'),
	('d7c9b705-bff7-4851-863d-0c326387e06e', 'seated-cable-row-wide', 'Seated Cable Row (Wide Grip)', 'Horizontal pull on cable with wide bar to emphasize upper back.', 2, 'https://www.youtube.com/watch?v=GZbfZ033f74', '{"Chest proud","Pull to sternum","Lead with elbows","Smooth return"}', 'reps_weight', NULL, true, '2025-11-07 13:59:18.491381+00', '2025-11-07 13:59:18.491381+00');


--
-- Data for Name: exercise_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: muscles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."muscles" ("id", "name", "parent_id") VALUES
	('561b3fe7-b9ce-4237-ac68-a433848ecefe', 'Chest', NULL),
	('fbafb9b3-fe15-4215-a043-e1cd9d60c56b', 'Back', NULL),
	('53d6adec-da17-45d8-a105-69568cac4cc0', 'Shoulders', NULL),
	('3f89f07d-2778-40fb-9d0d-ab3e11cd1436', 'Biceps', NULL),
	('a5851859-b943-4b7d-9f32-892bbfe59df8', 'Triceps', NULL),
	('f0578190-9e3f-48d9-95b1-ce0d1d83fca2', 'Forearms', NULL),
	('3a13cf50-f30c-4b13-9b90-8ef7726530b1', 'Abs', NULL),
	('b9120129-76ba-4372-889a-cd22cb474c9b', 'Quads', NULL),
	('c88de8d9-cc8c-4e23-b67e-feecdd76cc72', 'Hamstrings', NULL),
	('e2e442da-bc2f-4071-8abd-4de19f271a40', 'Glutes', NULL),
	('1edcc1d5-7ac8-4c17-a054-e35676ad8c02', 'Calves', NULL),
	('bc6925f8-889b-47a4-be61-38d0bebed4b3', 'Long Head (triceps)', 'a5851859-b943-4b7d-9f32-892bbfe59df8'),
	('54d3101d-1e03-4b13-b0fc-e3ae72fdfc6c', 'Lateral Head', 'a5851859-b943-4b7d-9f32-892bbfe59df8'),
	('5afe13c8-9ee8-4388-a5a7-38e1e2bc9ffb', 'Medial Head', 'a5851859-b943-4b7d-9f32-892bbfe59df8'),
	('dc90cc06-d91e-4637-8406-7c2873375723', 'Long Head (biceps)', '3f89f07d-2778-40fb-9d0d-ab3e11cd1436'),
	('4af7c2a8-a27c-4794-9ba1-152b7a260f4a', 'Short Head', '3f89f07d-2778-40fb-9d0d-ab3e11cd1436'),
	('82ebd710-0efa-4bdd-98d3-d8d9dc6ff5a4', 'Anterior Deltoid', '53d6adec-da17-45d8-a105-69568cac4cc0'),
	('81d26aca-cb2a-4846-bedc-fe52a97457c4', 'Lateral Deltoid', '53d6adec-da17-45d8-a105-69568cac4cc0'),
	('e2cbd8a5-af87-4d81-83a3-5c792576f81f', 'Posterior Deltoid', '53d6adec-da17-45d8-a105-69568cac4cc0'),
	('c3f2eeef-12b9-47be-b110-7bbb1e57e72c', 'Upper Chest (Clavicular)', '561b3fe7-b9ce-4237-ac68-a433848ecefe'),
	('fee94b8f-f4f2-4ef9-9543-2277fa7c6aee', 'Middle Chest (Sternal)', '561b3fe7-b9ce-4237-ac68-a433848ecefe'),
	('a4c45540-0158-4b8d-a956-469220480d4e', 'Lower Chest (Abdominal)', '561b3fe7-b9ce-4237-ac68-a433848ecefe'),
	('d20d0141-ff93-44fd-832f-8d7c7814d90f', 'Lats', 'fbafb9b3-fe15-4215-a043-e1cd9d60c56b'),
	('06a85189-ffb6-420f-9c99-0b78023bacf1', 'Rhomboids', 'fbafb9b3-fe15-4215-a043-e1cd9d60c56b'),
	('9a69ca6a-62a9-48e0-a44a-580232c4aa28', 'Traps', 'fbafb9b3-fe15-4215-a043-e1cd9d60c56b'),
	('347273c4-dafc-4af2-b3cd-d9304512b194', 'Erector Spinae', 'fbafb9b3-fe15-4215-a043-e1cd9d60c56b'),
	('231c2634-ddee-4ff8-bd09-c1aa2d3ff110', 'Rectus Femoris', 'b9120129-76ba-4372-889a-cd22cb474c9b'),
	('a36974cc-cb16-44c4-a2c7-e22d5d33e00a', 'Vastus Lateralis', 'b9120129-76ba-4372-889a-cd22cb474c9b'),
	('cb5045f3-3350-4b23-9443-f9a62579e87f', 'Vastus Medialis', 'b9120129-76ba-4372-889a-cd22cb474c9b'),
	('b6032011-4d51-43c4-8e4b-293db4b5bf92', 'Vastus Intermedius', 'b9120129-76ba-4372-889a-cd22cb474c9b'),
	('43cba6b4-0154-4f6c-83c7-06036a4ac0f7', 'Biceps Femoris', 'c88de8d9-cc8c-4e23-b67e-feecdd76cc72'),
	('14fef4e4-3dc3-48a0-a149-cd9955db3289', 'Semitendinosus', 'c88de8d9-cc8c-4e23-b67e-feecdd76cc72'),
	('6d1689ed-4624-4672-b3dd-bf58ae82f406', 'Semimembranosus', 'c88de8d9-cc8c-4e23-b67e-feecdd76cc72'),
	('5454f339-9c42-492b-8d28-3c1d3479a883', 'Gastrocnemius', '1edcc1d5-7ac8-4c17-a054-e35676ad8c02'),
	('eb3093e0-3dac-4f84-98a3-514ad8f611f9', 'Soleus', '1edcc1d5-7ac8-4c17-a054-e35676ad8c02');


