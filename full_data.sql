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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "username", "display_name", "created_at", "updated_at", "referred_by", "referral_code", "latest_login", "logon_days") VALUES
	('761dd0db-e64f-4935-bbe7-d11e9309507d', 'test', 'test_user', '2025-11-05 18:04:47.639382+00', '2025-11-05 18:04:47.639382+00', NULL, NULL, NULL, NULL),
	('bc17bf6b-4e78-4a65-b1a7-ec0ac16f493f', '111', '111', '2025-11-14 10:34:10.01582+00', '2025-11-14 10:34:10.01582+00', NULL, NULL, NULL, NULL),
	('7e08a514-96fe-4b08-b9b5-fff9b8546aba', '1', '1', '2025-11-14 10:35:52.930022+00', '2025-11-14 10:35:52.930022+00', NULL, NULL, NULL, NULL),
	('c0a22be5-21c1-443f-b3b8-44c8ca924d7d', 'k@k.com', 'k@k.com', '2025-11-14 12:54:47.588583+00', '2025-11-14 12:54:47.588583+00', NULL, NULL, NULL, NULL),
	('a2c1791c-4557-4dff-b0d3-90c6f7b7b854', 'test999@test.com', 'test999@test.com', '2025-11-14 13:04:18.067359+00', '2025-11-14 13:04:18.067359+00', NULL, NULL, NULL, NULL),
	('ecbb8a6e-b9fc-40e1-b1f8-206652b85220', 'test@t.com', 'test@t.com', '2025-11-14 13:40:36.78208+00', '2025-11-14 13:40:36.78208+00', NULL, NULL, NULL, NULL),
	('594aa3b7-2bdc-4dce-b66d-f1eca40e0dff', 'userset@set.com', 'userset@set.com', '2025-11-14 15:51:54.85136+00', '2025-11-14 15:51:54.85136+00', NULL, NULL, NULL, NULL),
	('7637bd9a-3e3d-4a2c-968f-b6d4c8bf7487', 'aikaterini.gkatidou@a.com', 'aikaterini.gkatidou@a.com', '2025-11-21 08:39:50.547504+00', '2025-11-21 08:39:50.547504+00', NULL, NULL, NULL, NULL),
	('3aab63d0-d835-4952-a3b6-ee298f1fcddb', 'test_prompt@t.com', 'test_prompt@t.com', '2025-11-21 09:50:52.299752+00', '2025-11-21 09:50:52.299752+00', NULL, NULL, NULL, NULL),
	('816ba532-bd15-40f0-b583-23ac5a0f8eda', 'test_prompt1@t.com', 'test_prompt1@t.com', '2025-11-21 09:58:18.346705+00', '2025-11-21 09:58:18.346705+00', NULL, NULL, NULL, NULL),
	('7bf8d192-0cdd-4fd1-9d9c-b96b0dbffb20', 'test_prompt2@t.com', 'test_prompt2@t.com', '2025-11-21 10:01:55.361284+00', '2025-11-21 10:01:55.361284+00', NULL, NULL, NULL, NULL),
	('c2c63fc4-10f5-426c-90c9-a0bc5122fd40', 'test_prompt3@t.com', 'test_prompt3@t.com', '2025-11-21 10:06:27.030316+00', '2025-11-21 10:06:27.030316+00', NULL, NULL, NULL, NULL),
	('ae8bbbc5-5702-43ce-9207-fb19338bba26', 'test_prompt4@t.com', 'test_prompt4@t.com', '2025-11-21 10:15:17.257117+00', '2025-11-21 10:15:17.257117+00', NULL, NULL, NULL, NULL),
	('5930fb75-e550-4f74-a9a1-f5021b043bd0', 'test_prompt5@t.com', 'test_prompt5@t.com', '2025-11-21 10:19:13.127445+00', '2025-11-21 10:19:13.127445+00', NULL, NULL, NULL, NULL),
	('b7e14e5c-4fa4-4637-aeae-e446ba4c8f16', 'test_prompt6@t.com', 'test_prompt6@t.com', '2025-11-21 10:28:41.259895+00', '2025-11-21 10:28:41.259895+00', NULL, NULL, NULL, NULL),
	('bbecdbf3-30ca-4ecf-938a-392cf8c49746', 'test_promt6@t.com', 'test_promt6@t.com', '2025-11-21 10:37:26.877136+00', '2025-11-21 10:37:26.877136+00', NULL, NULL, NULL, NULL),
	('5dde6ffc-9cc7-4aac-84e9-d8ef5e1d59f1', 'test_prompt7@t.com', 'test_prompt7@t.com', '2025-11-21 10:41:36.515642+00', '2025-11-21 10:41:36.515642+00', NULL, NULL, NULL, NULL),
	('62639616-db0c-4d5c-8af1-d5302ad72ff7', 'test_prompt8@t.com', 'test_prompt8@t.com', '2025-11-21 10:58:10.136906+00', '2025-11-21 10:58:10.136906+00', NULL, NULL, NULL, NULL),
	('659fa1f0-6ef8-4faa-b631-dd0a22e8f7c8', 'test_promt9@t.com', 'test_promt9@t.com', '2025-11-21 11:03:26.571576+00', '2025-11-21 11:03:26.571576+00', NULL, NULL, NULL, NULL),
	('0808f6e9-b334-4bc4-9426-b4f10053e64b', 'tp1@t.com', 'tp1@t.com', '2025-11-21 11:19:57.509643+00', '2025-11-21 11:19:57.509643+00', NULL, NULL, NULL, NULL),
	('cf956115-3675-48cf-bc85-1f0a41ece72f', 'ttt@t.com', 'ttt@t.com', '2025-11-21 12:39:08.554817+00', '2025-11-21 12:39:08.554817+00', NULL, NULL, NULL, NULL),
	('283656cf-5bcc-4876-93db-f6b5a68b7f34', 'newt@t.com', 'newt@t.com', '2025-11-21 13:25:51.545407+00', '2025-11-21 13:25:51.545407+00', NULL, NULL, NULL, NULL),
	('39c071d7-5f34-4a97-82e3-2da006e1da0e', 'testttt@t.com', 'testttt@t.com', '2025-11-21 15:09:37.04316+00', '2025-11-21 15:09:37.04316+00', NULL, NULL, NULL, NULL),
	('6a1e592d-b516-41ad-90fc-d242351efac7', 'tachieve@t.com', 'tachieve@t.com', '2025-11-27 21:10:38.793635+00', '2025-11-27 21:10:38.793635+00', NULL, NULL, NULL, NULL),
	('6305efaf-d559-48f4-a655-b4334636ab5a', 'tachieve2@t.com', 'tachieve2@t.com', '2025-11-27 21:17:04.581782+00', '2025-11-27 21:17:04.581782+00', NULL, NULL, NULL, NULL),
	('ce77b9d3-0613-4e9b-8aa0-0582550ddcd7', 'tachieve3@t.com', 'tachieve3@t.com', '2025-11-27 21:19:15.743509+00', '2025-11-27 21:19:15.743509+00', NULL, NULL, NULL, NULL),
	('79c75d1a-1368-42f5-a220-f7ca3f595de8', 'tachieve4@t.com', 'tachieve4@t.com', '2025-11-27 21:23:16.966786+00', '2025-11-27 21:23:16.966786+00', NULL, NULL, NULL, NULL),
	('7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'reft1', 'reft1', '2025-11-28 12:58:17.87495+00', '2025-11-28 12:58:17.87495+00', NULL, 'JZ2UHX', NULL, NULL),
	('bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', 'reft2', 'reft2', '2025-11-28 13:05:14.19412+00', '2025-11-28 13:05:14.19412+00', NULL, '2194IN', NULL, NULL),
	('ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', 'reft3', 'reft3', '2025-11-28 13:20:44.145871+00', '2025-11-28 13:20:44.145871+00', NULL, '2RBXOD', NULL, NULL),
	('01a9b209-3d59-4a94-8493-7f087d483121', 'reft5', 'reft5', '2025-11-28 15:08:27.774588+00', '2025-11-28 15:08:27.774588+00', NULL, 'GUI5JG', NULL, NULL),
	('08fd1fc2-93a0-493a-9e52-9a25978ef252', '11', '11', '2025-11-28 15:34:43.935489+00', '2025-11-28 15:34:43.935489+00', NULL, '0VZQYF', NULL, NULL),
	('5864c8e3-bd82-4959-adb4-29b57bb30421', 'wokt', 'wokt', '2025-12-04 15:35:04.903234+00', '2025-12-04 15:35:04.903234+00', NULL, '3ZQSZ9', NULL, NULL),
	('f79e800e-7b3a-4a7c-bc98-03d60850632e', 'wokt1', 'wokt1', '2025-12-04 20:12:48.125485+00', '2025-12-04 20:12:48.125485+00', NULL, 'MFY31J', NULL, NULL),
	('b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'backend_test', 'backend_test', '2025-12-05 09:26:13.028741+00', '2025-12-05 09:26:13.028741+00', NULL, '9HM8S9', NULL, NULL);


--
-- Data for Name: daily_mood; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."daily_mood" ("id", "user_id", "day", "mood", "note", "created_at", "updated_at") VALUES
	('41ae335a-4837-4113-9284-7bb55cdad609', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '2025-11-28', 4, NULL, '2025-11-28 09:34:37.061+00', '2025-11-28 09:37:22.886+00'),
	('3069c95e-9081-4b3d-83b6-866af77b1d6b', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', '2025-11-28', 4, NULL, '2025-11-28 11:31:44.554+00', '2025-11-28 11:31:44.554+00'),
	('f8658d9b-de7d-4d68-96c8-be18dba62232', '3aab63d0-d835-4952-a3b6-ee298f1fcddb', '2025-11-28', 4, NULL, '2025-11-28 12:51:38.15+00', '2025-11-28 12:51:38.15+00'),
	('0f187138-b37d-47c8-bceb-9934d4c0e8ac', '283656cf-5bcc-4876-93db-f6b5a68b7f34', '2025-11-28', 4, NULL, '2025-11-28 14:19:53.292+00', '2025-11-28 14:19:53.292+00'),
	('ad8315f0-ecb6-4728-9ceb-9c3e93d3f06f', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-11-28', 4, NULL, '2025-11-28 14:30:12.448+00', '2025-11-28 14:30:12.448+00'),
	('3c093e9d-0731-46f0-be87-4821f8d8cada', '08fd1fc2-93a0-493a-9e52-9a25978ef252', '2025-11-28', 0, NULL, '2025-11-28 15:39:22.473+00', '2025-11-28 16:04:19.615+00'),
	('d82f52a4-6bd8-4ada-b605-a0ab1ab606d8', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 1, NULL, '2025-12-03 20:07:56.125+00', '2025-12-03 20:07:56.125+00'),
	('343c84f6-aed5-41f9-87d7-d3d6e7b9aa2c', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 1, NULL, '2025-12-03 20:07:56.12+00', '2025-12-03 20:07:56.12+00'),
	('0ed12bd8-f31e-4dcd-88e4-ac1c96b9d90b', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 1, NULL, '2025-12-03 20:07:56.349+00', '2025-12-03 20:07:56.349+00'),
	('5c225dab-892d-4fcf-9ba3-4d508b03d5c8', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 1, NULL, '2025-12-03 20:07:57.055+00', '2025-12-03 20:07:57.055+00'),
	('75e11792-f572-4802-bee1-c6d72c4b590f', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:10:27.557+00', '2025-12-03 20:10:27.557+00'),
	('2e475ce6-0181-4dfd-81dc-bc4cf445cdae', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:10:28.186+00', '2025-12-03 20:10:28.186+00'),
	('98d7b716-25aa-45f5-a09b-7de21d3bc2a3', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:15:33.312+00', '2025-12-03 20:15:33.312+00'),
	('1934059b-8b43-4928-a46d-e06bc78391f2', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:15:38.196+00', '2025-12-03 20:15:38.196+00'),
	('232f4136-a53e-480e-a7c0-4ce39ac701ba', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:16:44.946+00', '2025-12-03 20:16:44.946+00'),
	('061fe14f-b9b3-441f-8445-6dcc67939fc9', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:21:41.024+00', '2025-12-03 20:21:41.024+00'),
	('ebd7037a-18d6-4923-b69f-0e8b1484bfbd', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:23:44.374+00', '2025-12-03 20:23:44.374+00'),
	('d04ee4fa-d9d6-4843-aab1-37d304c3b62c', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:24:05.717+00', '2025-12-03 20:24:05.717+00'),
	('4d5631a1-b78f-41bb-9b4d-6ffb584018e6', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:24:35.751+00', '2025-12-03 20:24:35.751+00'),
	('b593d726-cfdd-4a0a-ac20-7639eeeae26f', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', '2025-12-03', 0, NULL, '2025-12-03 20:32:05.781+00', '2025-12-03 20:32:43.492+00'),
	('d63b05fa-5272-41c8-bc97-c0597708797d', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:38:34.215+00', '2025-12-03 20:38:34.215+00'),
	('5b496c66-61ce-46a7-8bac-a1575715f798', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '2025-12-03', 3, NULL, '2025-12-03 20:27:28.079+00', '2025-12-03 20:56:03.879+00'),
	('021414b0-4a20-4f9b-9450-14cb67ac7032', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:57:12.655+00', '2025-12-03 20:57:12.655+00'),
	('09122adb-609a-41be-a9fc-00a37d499a7e', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:58:05.007+00', '2025-12-03 20:58:05.007+00'),
	('33b8de57-f834-4638-b8bd-778853493f77', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:58:50.789+00', '2025-12-03 20:58:50.789+00'),
	('e38d640b-e95e-4841-b483-8f7d570767cb', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 20:58:51.345+00', '2025-12-03 20:58:51.345+00'),
	('29a82294-cef8-4dbc-81dc-c88782de7963', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '2025-12-02', 1, NULL, '2025-12-03 21:23:21.177569+00', '2025-12-03 21:23:21.177569+00'),
	('fca11fa0-9185-4ec1-a487-1b9937916ea7', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '2025-12-03', 3, NULL, '2025-12-03 21:26:02.595+00', '2025-12-03 21:26:02.595+00'),
	('388f9893-06ab-4da4-bc55-8abff5ed5ae4', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '2025-12-04', 1, NULL, '2025-12-04 15:30:27.825+00', '2025-12-04 15:38:23.293+00'),
	('02a8f54f-6b0e-4519-b178-a16b9378c304', '5864c8e3-bd82-4959-adb4-29b57bb30421', '2025-12-04', 3, NULL, '2025-12-04 15:38:57.861+00', '2025-12-04 15:38:57.861+00'),
	('08f13de5-227c-4485-b0eb-bc00fa511950', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '2025-12-04', 3, NULL, '2025-12-04 20:13:43.2+00', '2025-12-04 20:13:43.2+00'),
	('5fed4e91-73aa-4a62-8139-0abb4f44f75b', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '2025-12-05', 4, NULL, '2025-12-05 08:05:48.413+00', '2025-12-05 08:06:36.261+00'),
	('c6c0c8d8-162a-46b9-9939-4d2edf127ede', '5864c8e3-bd82-4959-adb4-29b57bb30421', '2025-12-05', 3, NULL, '2025-12-05 08:11:24.476+00', '2025-12-05 08:11:24.476+00'),
	('fa8bfc7f-5dcb-4117-a4f4-30eb07f37ac1', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '2025-12-05', 0, NULL, '2025-12-05 08:11:53.09+00', '2025-12-05 08:21:40.559+00'),
	('bd56d7f1-c946-4177-978d-ffda4b64f5b4', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '2025-12-05', 3, NULL, '2025-12-05 09:27:58.848+00', '2025-12-05 09:51:57.834+00');


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--



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


--
-- Data for Name: exercise_muscles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: workout_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."workout_programs" ("id", "user_id", "name", "description", "weeks_count", "is_active", "created_at", "updated_at", "workout_days") VALUES
	('bb64ce16-b231-40d9-8ee5-d3a6f2aa8d48', '5930fb75-e550-4f74-a9a1-f5021b043bd0', 'Beginner Fat Loss Program', 'A 1-week program designed for fat loss with a focus on machine and dumbbell exercises for a user with low gym comfort.', 1, true, '2025-11-21 10:56:41.494736+00', '2025-11-21 10:56:41.494736+00', NULL),
	('0e0a46a4-2e5e-48c6-87e1-08d26db73df6', '62639616-db0c-4d5c-8af1-d5302ad72ff7', 'Beginner Strength Foundation', 'A 1-week strength-focused program designed for beginners with a focus on compound movements and machine assistance, respecting knee limitations.', 1, true, '2025-11-21 11:02:24.150487+00', '2025-11-21 11:02:24.150487+00', NULL),
	('ae725fba-e666-4200-a269-62d24464552b', '659fa1f0-6ef8-4faa-b631-dd0a22e8f7c8', 'General Fitness - 1 Week', 'A balanced 1-week program focused on general fitness for an individual with beginner experience and a preference for machine and dumbbell exercises, with consideration for knee issues. This program is designed for one training day.', 1, true, '2025-11-21 11:04:08.619478+00', '2025-11-21 11:04:08.619478+00', NULL),
	('c058f160-b1bb-43e7-9a36-8de4daebda9f', '659fa1f0-6ef8-4faa-b631-dd0a22e8f7c8', 'Beginner Strength - Upper Body Focus', 'A foundational strength program for beginners, focusing on upper body development with a preference for machine and dumbbell exercises.', 1, true, '2025-11-21 11:05:51.277995+00', '2025-11-21 11:05:51.277995+00', NULL),
	('1905e082-a57f-4f37-af6e-4941a87862fc', '0808f6e9-b334-4bc4-9426-b4f10053e64b', 'tp1 Strength Builder - Week 1', 'A 1-week strength-focused program for tp1, emphasizing foundational movements and machine/dumbbell options due to experience level and knee considerations. Sessions scheduled on Tuesday and Friday.', 1, true, '2025-11-21 11:20:49.179319+00', '2025-11-21 11:20:49.179319+00', NULL),
	('60ce2931-9f4a-4680-bf59-5fe898525bd6', 'cf956115-3675-48cf-bc85-1f0a41ece72f', 'ttt''s Endurance Focus Program', 'A 1-week program for ttt focusing on building endurance, with sessions scheduled on Wednesday and Tuesday, prioritizing machine and dumbbell exercises due to experience level and knee sensitivity.', 1, true, '2025-11-21 12:49:10.415112+00', '2025-11-21 12:49:10.415112+00', NULL),
	('06cfb90c-cb71-4f57-b6db-90f876b8c648', '283656cf-5bcc-4876-93db-f6b5a68b7f34', 'Newt''s Strength Builder - Week 1', 'A 1-week strength-focused program for newt, emphasizing machine and dumbbell exercises due to beginner experience and knee considerations. Splits into two upper body sessions.', 1, true, '2025-11-21 13:27:13.935475+00', '2025-11-21 13:27:13.935475+00', NULL),
	('b4d16866-dc2a-49be-9ba9-103628a47257', '39c071d7-5f34-4a97-82e3-2da006e1da0e', 'ttt''s Strength Builder - Week 1', 'A 1-week strength-focused program for ttt, utilizing machine and dumbbell exercises due to experience level and prioritizing knee-friendly options.', 1, true, '2025-11-21 15:10:43.49815+00', '2025-11-21 15:10:43.49815+00', NULL),
	('9b8a42d8-661d-4b60-973a-c40f9e565495', '6a1e592d-b516-41ad-90fc-d242351efac7', 'Achieve''s 1-Week Endurance Program', 'A beginner-friendly, 1-week program focused on building endurance, with sessions scheduled on Tuesday and Wednesday.', 1, true, '2025-11-27 21:12:03.160265+00', '2025-11-27 21:12:03.160265+00', NULL),
	('906193ff-8dd2-40b7-a099-e4e8abdcdf3d', '6305efaf-d559-48f4-a655-b4334636ab5a', 'Tachieve2''s Beginner Strength Builder', 'A 1-week program designed for beginners focusing on building strength with a focus on machine and dumbbell exercises, while accommodating a nervous gym environment and a lower-back concern.', 1, true, '2025-11-27 21:17:53.085744+00', '2025-11-27 21:17:53.085744+00', NULL),
	('6355f52f-8b6b-4624-b82f-60526a6f0e05', 'ce77b9d3-0613-4e9b-8aa0-0582550ddcd7', 'tachieve3 Endurance Builder', 'A 1-week program designed for tachieve3 to build endurance, focusing on machine and dumbbell exercises due to a nervous gym comfort level and low experience.', 1, true, '2025-11-27 21:20:09.624278+00', '2025-11-27 21:20:09.624278+00', NULL),
	('78a33210-ae92-4761-9879-13b5141556a2', '79c75d1a-1368-42f5-a220-f7ca3f595de8', 'Tchaieve4 Endurance Builder', 'A 1-week program designed for endurance, focusing on accessible exercises for a nervous gym-goer. Sessions are split across Tuesday and Wednesday, emphasizing machine and dumbbell movements.', 1, true, '2025-11-27 21:24:34.488606+00', '2025-11-27 21:24:34.488606+00', NULL),
	('07630ac6-f1ca-4c42-bd3b-eb6858c770d1', 'bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', 'Reft2''s Mobility & Strength Foundation', 'A 1-week program designed for reft2 to improve mobility and build foundational strength, focusing on machine and dumbbell exercises due to lower gym comfort and experience level. Emphasis on controlled movements and proper form.', 1, true, '2025-11-28 13:06:02.852635+00', '2025-11-28 13:06:02.852635+00', NULL),
	('13a82e28-15c2-4e99-bb86-7dffc96465a9', 'ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', 'reft3 Beginner Strength Program', 'A 1-week strength-focused program designed for a beginner with a focus on machine and dumbbell exercises, respecting knee concerns.', 1, true, '2025-11-28 13:21:28.91514+00', '2025-11-28 13:21:28.91514+00', NULL),
	('0d7d0d43-dd64-423a-b25a-481ab2b48480', '01a9b209-3d59-4a94-8493-7f087d483121', 'Beginner Strength Foundation - Upper/Lower Split', 'A 1-week program designed for beginners focusing on strength development with an upper/lower split, prioritizing machine and dumbbell exercises due to experience level and knee considerations.', 1, true, '2025-11-28 15:09:14.171944+00', '2025-11-28 15:09:14.171944+00', NULL),
	('8eccfad5-ab78-44d3-886c-3b4cb78f9a00', '08fd1fc2-93a0-493a-9e52-9a25978ef252', 'Fat Loss Beginner Program', 'A beginner-friendly program designed to promote fat loss with a focus on building a foundation and getting comfortable in the gym. The program emphasizes machine-based exercises to minimize complexity and maximize safety.', 1, true, '2025-11-28 15:35:32.354124+00', '2025-11-28 15:35:32.354124+00', NULL),
	('b625850d-c262-4456-b853-da01587b91b6', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'reft1''s 1-Week Endurance Program', 'A 1-week program focused on building endurance for reft1, with sessions on Tuesday and Wednesday, emphasizing machine and dumbbell exercises due to lower experience and gym comfort levels.', 1, false, '2025-11-28 13:04:26.254479+00', '2025-11-28 13:04:26.254479+00', NULL),
	('e7a399d6-ff3f-4722-8357-deef3bf6adc6', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'AI Modified Plan - 03/12/2025', 'Modified by AI Coach based on user feedback.', 1, false, '2025-12-03 21:28:19.833657+00', '2025-12-03 21:28:19.833657+00', NULL),
	('28d90d65-889a-4f1a-8b74-36e8132a039b', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'AI Modified Plan - 03/12/2025', 'Modified by AI Coach based on user feedback.', 1, true, '2025-12-03 21:30:12.932668+00', '2025-12-03 21:30:12.932668+00', NULL),
	('577fb6ca-c4fc-44d8-b0f5-9b5da1cf2124', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'AI Modified Plan - 04/12/2025', 'Modified by AI Coach based on user feedback.', 1, false, '2025-12-04 16:30:12.886413+00', '2025-12-04 16:30:12.886413+00', '{0,2}'),
	('e7e883ff-bcdc-4ce6-81bc-9b6c36764a61', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'Efficient Endurance & Strength', 'Streamlined plan focusing on key exercises for endurance and strength, with reduced volume.', 1, false, '2025-12-04 16:43:34.087553+00', '2025-12-04 16:43:34.087553+00', '{0,2}'),
	('29476a73-ba20-410f-a776-b9bdd3260d5e', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'Efficient Endurance & Strength (with added running)', 'Updated plan with a dedicated running day to focus on endurance.', 1, false, '2025-12-04 16:45:54.698836+00', '2025-12-04 16:45:54.698836+00', '{0,2,4}'),
	('87be9bc7-da43-4ecc-b9b2-3eac4d091e2a', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'Efficient Endurance & Strength (with adjusted running)', 'Dedicated running day moved to Thursday to better suit user preference.', 1, true, '2025-12-04 16:48:04.690054+00', '2025-12-04 16:48:04.690054+00', '{0,2,4}'),
	('beec1c7b-46b3-4b0c-ada8-5df5d6146a8e', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'Beginner Endurance & Strength Program', 'A 1-week program designed for beginners focusing on endurance with controlled strength building, prioritizing safety and gym comfort.', 1, false, '2025-12-04 15:36:23.362718+00', '2025-12-04 15:36:23.362718+00', '{0,2}'),
	('6d36dc71-4f95-4106-bfda-df108d5d1748', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'Beginner Full Body Endurance with Thursday Cardio', 'Modified program to include an extra cardio session for endurance on Thursdays, with a focus on knee-friendly pacing.', 1, false, '2025-12-04 20:36:48.949253+00', '2025-12-04 20:36:48.949253+00', '{1,3,4,5}'),
	('0eb3c237-b9b0-48a9-bc37-46759cc741a0', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'Modified Beginner Full Body Endurance with Friday Cardio', 'Updated program to include a dedicated running session on Fridays, while maintaining three full-body strength days and focusing on knee-friendly exercises.', 1, true, '2025-12-05 08:15:43.01411+00', '2025-12-05 08:15:43.01411+00', '{1,3,4,5,6}'),
	('781b0d72-4777-481e-a817-eb7174f5db33', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'Beginner Full Body Endurance', 'A 1-week full-body program designed for beginners focusing on endurance, with sessions scheduled on Monday, Wednesday, and Friday.', 1, false, '2025-12-04 20:13:37.433005+00', '2025-12-04 20:13:37.433005+00', '{1,3,5}'),
	('4a3a10db-de53-4a25-a05e-b52a03400485', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'Endurance Builder', 'A 1-week program designed to build endurance with a focus on full-body workouts suitable for beginners.', 1, false, '2025-12-05 09:27:48.82516+00', '2025-12-05 09:32:58.056+00', '{1,3,6}'),
	('377a44aa-1003-45dc-ad8e-7e1e50613934', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'Fat Loss Full Body - Week 1', 'A full body workout program designed to promote fat loss, suitable for beginners with limited experience and knee sensitivity. Focuses on machine and dumbbell exercises with an emphasis on high repetitions and shorter rest periods to maximize calorie expenditure.', 1, false, '2025-12-05 09:32:55.785241+00', '2025-12-05 09:44:53.532+00', '{0,1,2,3,4,5,6}'),
	('430edd9a-8358-41c3-bde2-64e806084736', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'Fat Loss Program - Week 1', 'A 7-day program focused on fat loss with beginner-friendly exercises.', 1, true, '2025-12-05 09:44:51.20347+00', '2025-12-05 09:44:51.20347+00', '{0,1,2,3,4,5,6}');


--
-- Data for Name: workout_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."workout_plans" ("id", "user_id", "program_id", "week_number", "day_number", "name", "description", "scheduled_date", "created_at", "updated_at") VALUES
	('bccc8974-f09b-4a22-89d1-8e3dbd6977e1', '5930fb75-e550-4f74-a9a1-f5021b043bd0', 'bb64ce16-b231-40d9-8ee5-d3a6f2aa8d48', 1, 1, 'Upper Body Strength & Cardio', 'Focus on upper body strength with compound movements and a cardio finisher. | Est. 55 min', NULL, '2025-11-21 10:56:41.558514+00', '2025-11-21 10:56:41.558514+00'),
	('dc6f45eb-adc6-4eb9-ae37-061902ea4934', '5930fb75-e550-4f74-a9a1-f5021b043bd0', 'bb64ce16-b231-40d9-8ee5-d3a6f2aa8d48', 1, 2, 'Lower Body & Core', 'Focus on lower body strength, keeping knee impact low, and a core finisher. | Est. 50 min', NULL, '2025-11-21 10:56:41.558514+00', '2025-11-21 10:56:41.558514+00'),
	('e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', '5930fb75-e550-4f74-a9a1-f5021b043bd0', 'bb64ce16-b231-40d9-8ee5-d3a6f2aa8d48', 1, 3, 'Full Body Conditioning', 'A full-body circuit focusing on metabolic conditioning for fat loss, using machine and dumbbell options. | Est. 55 min', NULL, '2025-11-21 10:56:41.558514+00', '2025-11-21 10:56:41.558514+00'),
	('58cf0fff-726b-4003-9436-c65a881154f3', '0808f6e9-b334-4bc4-9426-b4f10053e64b', '1905e082-a57f-4f37-af6e-4941a87862fc', 1, 2, 'Upper Body Strength - Push Focus', 'Focus on chest and shoulder strength with machine and dumbbell options. | Est. 45 min', NULL, '2025-11-21 11:20:49.489132+00', '2025-11-21 11:20:49.489132+00'),
	('f20c29af-c5a2-49d8-b4ca-cd601053f611', '0808f6e9-b334-4bc4-9426-b4f10053e64b', '1905e082-a57f-4f37-af6e-4941a87862fc', 1, 5, 'Lower Body & Pull Strength', 'Focus on lower body strength with knee-friendly options and upper body pulling movements. | Est. 50 min', NULL, '2025-11-21 11:20:49.489132+00', '2025-11-21 11:20:49.489132+00'),
	('7af80ba1-f980-48ec-b82e-ac77e08c961f', 'cf956115-3675-48cf-bc85-1f0a41ece72f', '60ce2931-9f4a-4680-bf59-5fe898525bd6', 1, 2, 'Upper Body Endurance', 'Focus on building upper body endurance with controlled movements. | Est. 55 min', NULL, '2025-11-21 12:49:10.477904+00', '2025-11-21 12:49:10.477904+00'),
	('b313fa86-c06f-4238-9a8d-753879f4f40e', 'cf956115-3675-48cf-bc85-1f0a41ece72f', '60ce2931-9f4a-4680-bf59-5fe898525bd6', 1, 3, 'Lower Body & Cardio Endurance', 'Focus on lower body endurance and cardiovascular conditioning, mindful of knee sensitivity. | Est. 50 min', NULL, '2025-11-21 12:49:10.477904+00', '2025-11-21 12:49:10.477904+00'),
	('b58c94f2-6bde-4cfe-a558-441e8c875e03', '283656cf-5bcc-4876-93db-f6b5a68b7f34', '06cfb90c-cb71-4f57-b6db-90f876b8c648', 1, 2, 'Upper Body - Session 1', 'Focus on chest, back, and arm strength with machine and dumbbell exercises. | Est. 50 min', NULL, '2025-11-21 13:27:14.000217+00', '2025-11-21 13:27:14.000217+00'),
	('7f964f10-0773-4b18-8c60-eb659d9ef9d2', '283656cf-5bcc-4876-93db-f6b5a68b7f34', '06cfb90c-cb71-4f57-b6db-90f876b8c648', 1, 4, 'Upper Body - Session 2', 'Continue building upper body strength with a slight variation in exercises. | Est. 50 min', NULL, '2025-11-21 13:27:14.000217+00', '2025-11-21 13:27:14.000217+00'),
	('c4f61f8f-e999-400f-bfc1-68e8591da819', '39c071d7-5f34-4a97-82e3-2da006e1da0e', 'b4d16866-dc2a-49be-9ba9-103628a47257', 1, 2, 'Upper Body Strength Focus', 'Focus on building upper body strength with controlled movements. | Est. 50 min', NULL, '2025-11-21 15:10:43.547056+00', '2025-11-21 15:10:43.547056+00'),
	('d6144c96-2081-455d-954e-e1d8f6869391', '39c071d7-5f34-4a97-82e3-2da006e1da0e', 'b4d16866-dc2a-49be-9ba9-103628a47257', 1, 4, 'Lower Body & Core Strength', 'Building lower body and core strength with a focus on knee-friendly machine exercises. | Est. 45 min', NULL, '2025-11-21 15:10:43.547056+00', '2025-11-21 15:10:43.547056+00'),
	('790f3c25-5a97-43a3-a278-e52875d23dca', '6a1e592d-b516-41ad-90fc-d242351efac7', '9b8a42d8-661d-4b60-973a-c40f9e565495', 1, 2, 'Day 1: Full Body Endurance Focus', 'This session incorporates machine and dumbbell exercises for a balanced full-body workout with an emphasis on endurance-style rep ranges. | Est. 55 min', NULL, '2025-11-27 21:12:03.317456+00', '2025-11-27 21:12:03.317456+00'),
	('34fcc180-c5b6-481c-b4b0-ec72b71af9c4', '6a1e592d-b516-41ad-90fc-d242351efac7', '9b8a42d8-661d-4b60-973a-c40f9e565495', 1, 3, 'Day 2: Cardiovascular Endurance', 'Focuses on cardiovascular improvement through treadmill intervals. Adjust intensity based on knee comfort. | Est. 40 min', NULL, '2025-11-27 21:12:03.317456+00', '2025-11-27 21:12:03.317456+00'),
	('85bb7126-12e9-4c35-b764-00b4db2c59b6', '6305efaf-d559-48f4-a655-b4334636ab5a', '906193ff-8dd2-40b7-a099-e4e8abdcdf3d', 1, 2, 'Upper Body Strength - Day 1', 'Focuses on upper body pushing and pulling movements with machine and dumbbell variations. | Est. 55 min', NULL, '2025-11-27 21:17:53.171316+00', '2025-11-27 21:17:53.171316+00'),
	('062a2d79-c4ad-430d-9e62-fb3b9c479d40', '6305efaf-d559-48f4-a655-b4334636ab5a', '906193ff-8dd2-40b7-a099-e4e8abdcdf3d', 1, 4, 'Lower Body & Core Strength - Day 2', 'Focuses on lower body strength with machine exercises and includes a core-friendly cardio option. | Est. 50 min', NULL, '2025-11-27 21:17:53.171316+00', '2025-11-27 21:17:53.171316+00'),
	('92d8fe1b-672b-431a-86fb-553d5b1c49aa', '6305efaf-d559-48f4-a655-b4334636ab5a', '906193ff-8dd2-40b7-a099-e4e8abdcdf3d', 1, 5, 'Upper Body Strength - Day 3', 'Continues upper body development with dumbbell variations and addresses problem areas indirectly. | Est. 55 min', NULL, '2025-11-27 21:17:53.171316+00', '2025-11-27 21:17:53.171316+00'),
	('1a86512c-a62f-40fe-a4a7-32bab2585295', 'ce77b9d3-0613-4e9b-8aa0-0582550ddcd7', '6355f52f-8b6b-4624-b82f-60526a6f0e05', 1, 3, 'Upper Body Endurance', 'Focus on building upper body endurance with controlled movements. | Est. 55 min', NULL, '2025-11-27 21:20:09.700341+00', '2025-11-27 21:20:09.700341+00'),
	('f3930cfe-1016-474a-b090-c50036140fd6', 'ce77b9d3-0613-4e9b-8aa0-0582550ddcd7', '6355f52f-8b6b-4624-b82f-60526a6f0e05', 1, 4, 'Lower Body & Cardio Endurance', 'Focus on lower body strength and cardiovascular endurance, with consideration for lower back sensitivity. | Est. 50 min', NULL, '2025-11-27 21:20:09.700341+00', '2025-11-27 21:20:09.700341+00'),
	('02158894-b865-46f5-a166-e7dccb01d9f3', '79c75d1a-1368-42f5-a220-f7ca3f595de8', '78a33210-ae92-4761-9879-13b5141556a2', 1, 2, 'Upper Body Endurance', 'Focus on upper body endurance with machine and dumbbell exercises. Designed to be comfortable for those new to the gym. | Est. 55 min', NULL, '2025-11-27 21:24:34.576643+00', '2025-11-27 21:24:34.576643+00'),
	('0c882423-a8f2-4ad1-8565-4be9f1a66b69', '79c75d1a-1368-42f5-a220-f7ca3f595de8', '78a33210-ae92-4761-9879-13b5141556a2', 1, 3, 'Full Body Endurance', 'A full-body endurance session incorporating cardiovascular and resistance elements, suitable for lower back awareness and gym nervousness. | Est. 50 min', NULL, '2025-11-27 21:24:34.576643+00', '2025-11-27 21:24:34.576643+00'),
	('25dd6520-fa1a-4880-982b-70308f2fef5d', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'b625850d-c262-4456-b853-da01587b91b6', 1, 2, 'Upper Body Endurance Focus', 'This session targets upper body endurance with controlled movements, prioritizing machine and dumbbell exercises. | Est. 55 min', NULL, '2025-11-28 13:04:26.351137+00', '2025-11-28 13:04:26.351137+00'),
	('1b7e9006-4d95-4d31-ac49-5de47d00517d', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'b625850d-c262-4456-b853-da01587b91b6', 1, 3, 'Lower Body & Cardio Endurance', 'This session focuses on lower body endurance and cardiovascular fitness, utilizing machines and treadmill. | Est. 50 min', NULL, '2025-11-28 13:04:26.351137+00', '2025-11-28 13:04:26.351137+00'),
	('97e07053-89ff-48a7-85cb-7b529ee30e81', 'bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', '07630ac6-f1ca-4c42-bd3b-eb6858c770d1', 1, 3, 'Upper Body Strength & Mobility Focus', 'Focus on building upper body strength with controlled movements and preparing the shoulder joint for a greater range of motion. Machine and dumbbell exercises are prioritized. | Est. 50 min', NULL, '2025-11-28 13:06:02.905726+00', '2025-11-28 13:06:02.905726+00'),
	('b4942804-149c-457a-88e4-8a07aeac6fc5', 'bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', '07630ac6-f1ca-4c42-bd3b-eb6858c770d1', 1, 5, 'Lower Body Activation & Cardio for Mobility', 'Engage lower body muscles with a machine-based exercise, prioritizing knee comfort, and incorporate light cardio to promote circulation and overall mobility. | Est. 45 min', NULL, '2025-11-28 13:06:02.905726+00', '2025-11-28 13:06:02.905726+00'),
	('632a80c0-7e8d-4616-add6-684924d68892', 'ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', '13a82e28-15c2-4e99-bb86-7dffc96465a9', 1, 2, 'Upper Body Strength - Day 1', 'Focus on foundational upper body strength exercises using machines and dumbbells. | Est. 55 min', NULL, '2025-11-28 13:21:28.971385+00', '2025-11-28 13:21:28.971385+00'),
	('b94490f4-9641-4507-ae09-6ce5b89ab239', 'ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', '13a82e28-15c2-4e99-bb86-7dffc96465a9', 1, 4, 'Lower Body & Cardio - Day 2', 'Focus on lower body strength with machine exercises and a short cardio segment, mindful of knee concerns. | Est. 50 min', NULL, '2025-11-28 13:21:28.971385+00', '2025-11-28 13:21:28.971385+00'),
	('4f0305fa-e717-4784-ab0c-ac50809973dc', '01a9b209-3d59-4a94-8493-7f087d483121', '0d7d0d43-dd64-423a-b25a-481ab2b48480', 1, 3, 'Lower Body Strength Focus', 'Focus on foundational lower body strength exercises, with modifications for knee comfort. | Est. 50 min', NULL, '2025-11-28 15:09:14.239217+00', '2025-11-28 15:09:14.239217+00'),
	('f36732b5-e8f1-489b-a715-68f9096c6d77', '01a9b209-3d59-4a94-8493-7f087d483121', '0d7d0d43-dd64-423a-b25a-481ab2b48480', 1, 4, 'Upper Body Strength Focus (Push)', 'Developing upper body pushing strength with a focus on chest and shoulders. | Est. 55 min', NULL, '2025-11-28 15:09:14.239217+00', '2025-11-28 15:09:14.239217+00'),
	('b3819201-d3bd-4961-9304-efbc212058ca', '01a9b209-3d59-4a94-8493-7f087d483121', '0d7d0d43-dd64-423a-b25a-481ab2b48480', 1, 5, 'Upper Body Strength Focus (Pull) & Cardio', 'Focusing on upper body pulling strength and a light cardio session. | Est. 40 min', NULL, '2025-11-28 15:09:14.239217+00', '2025-11-28 15:09:14.239217+00'),
	('33160829-5877-4e85-9260-9b9ee5022f88', '08fd1fc2-93a0-493a-9e52-9a25978ef252', '8eccfad5-ab78-44d3-886c-3b4cb78f9a00', 1, 0, 'Full Body Circuit', 'A full body workout targeting major muscle groups to burn calories and build strength. Focus on proper form and controlled movements. Use lighter weights to start. | Est. 45 min', NULL, '2025-11-28 15:35:32.409745+00', '2025-11-28 15:35:32.409745+00'),
	('74e479bc-d93c-4317-84e2-f210da97c5f1', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'e7a399d6-ff3f-4722-8357-deef3bf6adc6', 1, 2, 'Upper Body Endurance Focus', 'This session targets upper body endurance with controlled movements, prioritizing machine and dumbbell exercises. | Est. 60 min', NULL, '2025-12-03 21:28:19.929517+00', '2025-12-03 21:28:19.929517+00'),
	('62e19d93-a0bd-4377-be45-2f3011b138d4', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '28d90d65-889a-4f1a-8b74-36e8132a039b', 1, 1, 'Cardio & Core', 'Focuses on building running endurance and strengthening your core to support your lower back. | Est. 60 min', NULL, '2025-12-03 21:30:13.03994+00', '2025-12-03 21:30:13.03994+00'),
	('111cf32f-67b0-4428-afc8-51f36943889c', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'beec1c7b-46b3-4b0c-ada8-5df5d6146a8e', 1, 0, 'Upper Body Endurance Focus', 'Focuses on upper body endurance and controlled strength with machine and dumbbell exercises. | Est. 45 min', NULL, '2025-12-04 15:36:23.428871+00', '2025-12-04 15:36:23.428871+00'),
	('af3027ec-860c-423d-9ffe-1d801ea2242e', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'beec1c7b-46b3-4b0c-ada8-5df5d6146a8e', 1, 2, 'Lower Body & Cardio Endurance', 'Focuses on lower body strength and cardiovascular endurance, with modifications for knee comfort. | Est. 55 min', NULL, '2025-12-04 15:36:23.428871+00', '2025-12-04 15:36:23.428871+00'),
	('05f8fb5a-ce05-438b-8c96-3a1c507f1d69', '5864c8e3-bd82-4959-adb4-29b57bb30421', '577fb6ca-c4fc-44d8-b0f5-9b5da1cf2124', NULL, 0, 'Upper Body & Warm-up Walk', 'Focuses on upper body endurance with a gentle warm-up walk.', NULL, '2025-12-04 16:30:12.964502+00', '2025-12-04 16:30:12.964502+00'),
	('48c0b318-30bb-4d20-a1d6-3df1d7bf3bea', '5864c8e3-bd82-4959-adb4-29b57bb30421', '577fb6ca-c4fc-44d8-b0f5-9b5da1cf2124', NULL, 2, 'Lower Body & Extended Cardio Endurance', 'Focuses on lower body strength and extended cardiovascular endurance.', NULL, '2025-12-04 16:30:13.472233+00', '2025-12-04 16:30:13.472233+00'),
	('ff80d559-bcba-4dfd-94e4-4576b3a28dc9', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'e7e883ff-bcdc-4ce6-81bc-9b6c36764a61', NULL, 0, 'Upper Body & Cardio Blast', 'A quicker upper body session paired with a focused cardio burst.', NULL, '2025-12-04 16:43:34.161231+00', '2025-12-04 16:43:34.161231+00'),
	('c548b4fc-d962-43e7-bca7-2ddeaef80e7e', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'e7e883ff-bcdc-4ce6-81bc-9b6c36764a61', NULL, 2, 'Lower Body & Endurance Run', 'A focused lower body circuit followed by a longer cardio session.', NULL, '2025-12-04 16:43:34.567136+00', '2025-12-04 16:43:34.567136+00'),
	('a2cbd940-2eff-40de-aec3-b0a09e7676c2', '5864c8e3-bd82-4959-adb4-29b57bb30421', '29476a73-ba20-410f-a776-b9bdd3260d5e', NULL, 0, 'Upper Body & Cardio Blast', 'A quicker upper body session paired with a focused cardio burst.', NULL, '2025-12-04 16:45:54.816627+00', '2025-12-04 16:45:54.816627+00'),
	('9823a7a3-e6fa-4d9b-85da-e68314ee8801', '5864c8e3-bd82-4959-adb4-29b57bb30421', '29476a73-ba20-410f-a776-b9bdd3260d5e', NULL, 2, 'Lower Body & Endurance Run', 'A focused lower body circuit followed by a longer cardio session.', NULL, '2025-12-04 16:45:55.156391+00', '2025-12-04 16:45:55.156391+00'),
	('6b8974ba-4014-463f-90b3-67e0daeb219c', '5864c8e3-bd82-4959-adb4-29b57bb30421', '29476a73-ba20-410f-a776-b9bdd3260d5e', NULL, 4, 'Dedicated Endurance Run', 'Focused session for building running endurance.', NULL, '2025-12-04 16:45:55.527945+00', '2025-12-04 16:45:55.527945+00'),
	('57af24b9-18d3-4c12-9f49-4424ea60e05b', '5864c8e3-bd82-4959-adb4-29b57bb30421', '87be9bc7-da43-4ecc-b9b2-3eac4d091e2a', NULL, 0, 'Upper Body & Cardio Blast', 'A quicker upper body session paired with a focused cardio burst.', NULL, '2025-12-04 16:48:04.765611+00', '2025-12-04 16:48:04.765611+00'),
	('c4a2b88e-e735-4b4f-b0de-2bce0b3b871b', '5864c8e3-bd82-4959-adb4-29b57bb30421', '87be9bc7-da43-4ecc-b9b2-3eac4d091e2a', NULL, 2, 'Lower Body & Endurance Run', 'A focused lower body circuit followed by a longer cardio session.', NULL, '2025-12-04 16:48:05.098764+00', '2025-12-04 16:48:05.098764+00'),
	('1cae49c7-ba4c-4f1e-9772-566319aa73a9', '5864c8e3-bd82-4959-adb4-29b57bb30421', '87be9bc7-da43-4ecc-b9b2-3eac4d091e2a', NULL, 4, 'Dedicated Endurance Run', 'Focused session for building running endurance.', NULL, '2025-12-04 16:48:05.41814+00', '2025-12-04 16:48:05.41814+00'),
	('05e0fd63-5ee1-48b4-9cc6-59302197dc47', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '781b0d72-4777-481e-a817-eb7174f5db33', 1, 1, 'Full Body - Day 1', 'Focus on building foundational strength and endurance with compound movements and machine-based exercises. | Est. 55 min', NULL, '2025-12-04 20:13:37.537645+00', '2025-12-04 20:13:37.537645+00'),
	('d14fd7ba-4b7c-4503-845e-71dbea6484ec', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '781b0d72-4777-481e-a817-eb7174f5db33', 1, 3, 'Full Body - Day 2', 'Continue building endurance with a slight variation in exercises, emphasizing controlled movements. | Est. 50 min', NULL, '2025-12-04 20:13:37.537645+00', '2025-12-04 20:13:37.537645+00'),
	('0102ea7c-fa7c-494b-970b-e19d8c754ea5', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '781b0d72-4777-481e-a817-eb7174f5db33', 1, 5, 'Full Body - Day 3', 'Final session of the week, reinforcing endurance and strength with a mix of familiar and slightly more challenging variations. | Est. 50 min', NULL, '2025-12-04 20:13:37.537645+00', '2025-12-04 20:13:37.537645+00'),
	('0890c9bf-7d49-49d6-9a5f-db61591432a5', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '6d36dc71-4f95-4106-bfda-df108d5d1748', NULL, 1, 'Full Body - Day 1', 'Focus on building foundational strength and endurance with compound movements and machine-based exercises.', NULL, '2025-12-04 20:36:49.037869+00', '2025-12-04 20:36:49.037869+00'),
	('e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '6d36dc71-4f95-4106-bfda-df108d5d1748', NULL, 3, 'Full Body - Day 2', 'Continue building endurance with a slight variation in exercises, emphasizing controlled movements.', NULL, '2025-12-04 20:36:50.744177+00', '2025-12-04 20:36:50.744177+00'),
	('999173c9-be0b-4492-91db-dfa0ea5d7a1a', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '6d36dc71-4f95-4106-bfda-df108d5d1748', NULL, 5, 'Full Body - Day 3', 'Final session of the week, reinforcing endurance and strength with a mix of familiar and slightly more challenging variations.', NULL, '2025-12-04 20:36:51.934293+00', '2025-12-04 20:36:51.934293+00'),
	('0cf0e67b-3328-4151-8cd5-ee7031840600', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '6d36dc71-4f95-4106-bfda-df108d5d1748', NULL, 4, 'Thursday Cardio - Gentle Run/Walk', 'A dedicated session to build running endurance, focusing on comfortable pacing and listening to your body.', NULL, '2025-12-04 20:36:53.016021+00', '2025-12-04 20:36:53.016021+00'),
	('3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '0eb3c237-b9b0-48a9-bc37-46759cc741a0', NULL, 1, 'Full Body - Day 1', 'Focus on building foundational strength and endurance with compound movements and machine-based exercises.', NULL, '2025-12-05 08:15:43.122173+00', '2025-12-05 08:15:43.122173+00'),
	('9a8b98b0-bc50-42d9-819f-e0543dd5634d', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '0eb3c237-b9b0-48a9-bc37-46759cc741a0', NULL, 3, 'Full Body - Day 2', 'Continue building endurance with a slight variation in exercises, emphasizing controlled movements.', NULL, '2025-12-05 08:15:43.836439+00', '2025-12-05 08:15:43.836439+00'),
	('2ad31611-cd8b-44a0-a660-41182a1fa12f', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '0eb3c237-b9b0-48a9-bc37-46759cc741a0', NULL, 4, 'Thursday Cardio - Gentle Run/Walk', 'A dedicated session to build running endurance, focusing on comfortable pacing and listening to your body.', NULL, '2025-12-05 08:15:44.286849+00', '2025-12-05 08:15:44.286849+00'),
	('3ff3b198-3894-42ec-b9a5-af7981aa5a71', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '0eb3c237-b9b0-48a9-bc37-46759cc741a0', NULL, 5, 'Full Body - Day 3', 'Final session of the week, reinforcing endurance and strength with a mix of familiar variations.', NULL, '2025-12-05 08:15:44.435287+00', '2025-12-05 08:15:44.435287+00'),
	('a084c4f6-879b-4d67-babb-724c9f22f0f1', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '0eb3c237-b9b0-48a9-bc37-46759cc741a0', NULL, 6, 'Friday Cardio - Endurance Run/Walk', 'Dedicated session to build running endurance with comfortable pacing, prioritizing knee health.', NULL, '2025-12-05 08:15:44.875292+00', '2025-12-05 08:15:44.875292+00'),
	('8855571c-ea92-4511-9c9f-3bf6ab854ba9', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '4a3a10db-de53-4a25-a05e-b52a03400485', 1, 1, 'Full Body Endurance - Day 1', 'Full body workout focusing on endurance with lighter weights and higher reps. Prioritizing machine exercises due to experience level. | Est. 45 min', NULL, '2025-12-05 09:27:48.880167+00', '2025-12-05 09:27:48.880167+00'),
	('35647c73-5455-4d53-9ea2-45615cd0473a', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '4a3a10db-de53-4a25-a05e-b52a03400485', 1, 3, 'Full Body Endurance - Day 2', 'Full body workout focusing on endurance with lighter weights and higher reps. Prioritizing machine exercises due to experience level. | Est. 45 min', NULL, '2025-12-05 09:27:48.880167+00', '2025-12-05 09:27:48.880167+00'),
	('5189eb38-0d73-4540-862c-25f3c757004b', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '4a3a10db-de53-4a25-a05e-b52a03400485', 1, 6, 'Full Body Endurance - Day 3', 'Full body workout focusing on endurance with lighter weights and higher reps. Prioritizing machine exercises due to experience level. | Est. 45 min', NULL, '2025-12-05 09:27:48.880167+00', '2025-12-05 09:27:48.880167+00'),
	('3be9a764-c313-4ce3-8177-1f0b16f92f0b', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '377a44aa-1003-45dc-ad8e-7e1e50613934', 1, 1, 'Full Body Circuit 1', 'Full body workout focusing on compound movements with moderate reps for fat loss. | Est. 50 min', NULL, '2025-12-05 09:32:55.868657+00', '2025-12-05 09:32:55.868657+00'),
	('c5a4c677-6e2e-4d53-8d3e-c98436f82192', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '377a44aa-1003-45dc-ad8e-7e1e50613934', 1, 2, 'Cardio & Core', 'Cardio and core focused workout. | Est. 40 min', NULL, '2025-12-05 09:32:55.868657+00', '2025-12-05 09:32:55.868657+00'),
	('4a490252-0fe5-44fd-ae83-dbf9899ae2cc', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '377a44aa-1003-45dc-ad8e-7e1e50613934', 1, 3, 'Full Body Circuit 2', 'Full body workout focusing on machines and dumbbells. | Est. 50 min', NULL, '2025-12-05 09:32:55.868657+00', '2025-12-05 09:32:55.868657+00'),
	('8142b210-2a10-4e41-8557-adc3e1f4e717', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '377a44aa-1003-45dc-ad8e-7e1e50613934', 1, 4, 'Cardio & Light Weight', 'Cardio and light weight workout. | Est. 40 min', NULL, '2025-12-05 09:32:55.868657+00', '2025-12-05 09:32:55.868657+00'),
	('6124cf87-b433-494f-9127-c3168eed456f', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '377a44aa-1003-45dc-ad8e-7e1e50613934', 1, 5, 'Full Body Circuit 3', 'Full body workout focusing on machines and dumbbells. | Est. 50 min', NULL, '2025-12-05 09:32:55.868657+00', '2025-12-05 09:32:55.868657+00'),
	('952c09a9-01c6-45f3-a07f-0399a50d9334', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '377a44aa-1003-45dc-ad8e-7e1e50613934', 1, 6, 'Cardio & Core', 'Cardio and core focused workout. | Est. 40 min', NULL, '2025-12-05 09:32:55.868657+00', '2025-12-05 09:32:55.868657+00'),
	('ba6f4fdd-3cdf-49a1-9c36-c308392bfadd', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '377a44aa-1003-45dc-ad8e-7e1e50613934', 1, 0, 'Active Recovery', 'Light cardio for active recovery. | Est. 30 min', NULL, '2025-12-05 09:32:55.868657+00', '2025-12-05 09:32:55.868657+00'),
	('8a765969-435c-41c7-8997-212781c8bbb7', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '430edd9a-8358-41c3-bde2-64e806084736', 1, 1, 'Full Body Circuit - Day 1', 'Full body circuit training for fat loss. | Est. 55 min', NULL, '2025-12-05 09:44:51.265497+00', '2025-12-05 09:44:51.265497+00'),
	('f63d2597-8ca1-491a-8f13-37f7ae90cad1', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '430edd9a-8358-41c3-bde2-64e806084736', 1, 0, 'Cardio & Core', 'Cardio and core work for active recovery and fat burning. | Est. 40 min', NULL, '2025-12-05 09:44:51.265497+00', '2025-12-05 09:44:51.265497+00'),
	('ad9f3d78-23bd-41a6-960c-8cced3d385a4', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '430edd9a-8358-41c3-bde2-64e806084736', 1, 5, 'Full Body Circuit - Day 2', 'Full body circuit training for fat loss. | Est. 55 min', NULL, '2025-12-05 09:44:51.265497+00', '2025-12-05 09:44:51.265497+00'),
	('7f479145-c109-4788-9ce7-d4cd804c9da0', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '430edd9a-8358-41c3-bde2-64e806084736', 1, 3, 'Cardio & Core', 'Cardio and core work for active recovery and fat burning. | Est. 40 min', NULL, '2025-12-05 09:44:51.265497+00', '2025-12-05 09:44:51.265497+00'),
	('6f827ffa-37be-4370-adf6-41aa52405ad4', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '430edd9a-8358-41c3-bde2-64e806084736', 1, 2, 'Full Body Circuit - Day 3', 'Full body circuit training for fat loss. | Est. 55 min', NULL, '2025-12-05 09:44:51.265497+00', '2025-12-05 09:44:51.265497+00'),
	('04776de4-932d-4a40-9e8e-c7bab2082fa6', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '430edd9a-8358-41c3-bde2-64e806084736', 1, 4, 'Cardio & Core', 'Cardio and core work for active recovery and fat burning. | Est. 40 min', NULL, '2025-12-05 09:44:51.265497+00', '2025-12-05 09:44:51.265497+00'),
	('8f6de638-7b76-4ffe-af5f-30f317d76bd8', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '430edd9a-8358-41c3-bde2-64e806084736', 1, 6, 'Active Recovery', 'Light cardio for active recovery and injury prevention. | Est. 30 min', NULL, '2025-12-05 09:44:51.265497+00', '2025-12-05 09:44:51.265497+00');


--
-- Data for Name: workouts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."workouts" ("id", "user_id", "plan_id", "started_at", "ended_at", "duration_s", "difficulty_rating", "easiest_exercise_id", "hardest_exercise_id", "comfort_rating", "notes", "created_at", "updated_at") VALUES
	('41079440-a52a-48c3-8d3e-5757ae8d6c3d', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '58cf0fff-726b-4003-9436-c65a881154f3', '2025-11-16 09:39:43.687539+00', '2025-11-16 10:09:43.687539+00', 1800, 2, NULL, NULL, NULL, NULL, '2025-11-21 09:39:43.687539+00', '2025-11-21 09:39:43.687539+00'),
	('a3e432c0-f83b-48d7-99c6-ebe8362d3f73', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-20 15:53:34.409323+00', '2025-11-20 16:38:34.409323+00', 2700, 3, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('a7618b26-afb1-475d-961e-84cfb0a28477', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-18 15:53:34.409323+00', '2025-11-18 16:43:34.409323+00', 3000, 4, NULL, NULL, 5, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('c7cd2a26-ad95-4b34-ae17-6deaf409e1b4', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-16 15:53:34.409323+00', '2025-11-16 16:33:34.409323+00', 2400, 3, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('5fed1080-afdc-4421-81c1-fc0ddc2d4230', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-15 15:53:34.409323+00', '2025-11-15 16:48:34.409323+00', 3300, 4, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('4935c25b-bfb4-4429-9db4-8c9349aece4c', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-13 15:53:34.409323+00', '2025-11-13 16:41:34.409323+00', 2880, 3, NULL, NULL, 5, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('6ab690ce-1f74-4746-8010-c5a46474a485', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-11 15:53:34.409323+00', '2025-11-11 16:35:34.409323+00', 2520, 3, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('f5c1def5-8387-4999-8f9b-dd66f4ae5d44', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-09 15:53:34.409323+00', '2025-11-09 16:43:34.409323+00', 3000, 4, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('aab78f38-7301-487c-b176-b1f92bda5349', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-08 15:53:34.409323+00', '2025-11-08 16:38:34.409323+00', 2700, 3, NULL, NULL, 5, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('8c10aeef-752f-4087-aedf-85c8b4a72e8e', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-04 15:53:34.409323+00', '2025-11-04 16:45:34.409323+00', 3120, 4, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('27c357fb-5593-482c-9697-77eccc5a2a2c', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, '2025-11-03 15:53:34.409323+00', '2025-11-03 16:37:34.409323+00', 2640, 3, NULL, NULL, 5, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('024c83e3-04b5-4657-b804-36c48429687b', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '7af80ba1-f980-48ec-b82e-ac77e08c961f', '2025-11-27 09:39:43+00', '2025-11-27 10:19:43+00', 2400, 3, NULL, NULL, NULL, NULL, '2025-11-27 09:39:43+00', '2025-11-27 09:39:43+00'),
	('64a9e527-ae51-4d99-b7f7-5ff9f7c50b75', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '7af80ba1-f980-48ec-b82e-ac77e08c961f', '2025-11-26 19:46:12+00', '2025-11-26 19:46:17+00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-26 19:46:27+00', '2025-11-26 19:46:31+00'),
	('1fa93fe0-3d52-424e-9692-b5c3c497fa7f', '08fd1fc2-93a0-493a-9e52-9a25978ef252', 'b58c94f2-6bde-4cfe-a558-441e8c875e03', '2025-11-01 15:53:34.409323+00', '2025-11-01 16:39:34.409323+00', 2760, 3, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('229084ea-6850-4fc7-87b9-84eaab002840', '08fd1fc2-93a0-493a-9e52-9a25978ef252', '58cf0fff-726b-4003-9436-c65a881154f3', '2025-11-06 15:53:34.409323+00', '2025-11-06 16:31:34.409323+00', 2280, 2, NULL, NULL, 4, NULL, '2025-11-21 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('b40756ae-e913-44f2-b31f-248978f79cbd', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '1b7e9006-4d95-4d31-ac49-5de47d00517d', '2025-12-03 20:02:47.491+00', '2025-12-03 20:03:15.324+00', 27, NULL, NULL, NULL, NULL, NULL, '2025-12-03 20:03:15.799433+00', '2025-12-03 20:03:15.799433+00'),
	('7fdfb185-ebcf-4154-a2c8-606290b49080', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '02158894-b865-46f5-a166-e7dccb01d9f3', '2025-12-03 21:41:20.50266+00', '2025-12-03 22:41:20.50266+00', 2500, 4, NULL, NULL, NULL, NULL, '2025-12-03 21:41:20.50266+00', '2025-12-03 21:41:20.50266+00'),
	('b9de9b6a-40fa-4886-8514-5bbba8feac7f', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '02158894-b865-46f5-a166-e7dccb01d9f3', '2025-12-02 16:01:21+00', NULL, 1100, NULL, NULL, NULL, NULL, NULL, '2025-12-04 16:01:26.31449+00', '2025-12-04 16:01:26.31449+00'),
	('698798e8-8f06-402b-8811-0f2e4273cbb8', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '0cf0e67b-3328-4151-8cd5-ee7031840600', '2025-12-04 20:36:56.534+00', '2025-12-04 20:37:11.492+00', 14, NULL, NULL, NULL, NULL, NULL, '2025-12-04 20:37:11.743356+00', '2025-12-04 20:37:11.743356+00'),
	('591af4eb-5a3f-4f7b-93f5-e660307f30e0', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', '2025-12-05 08:17:34.391+00', '2025-12-05 08:17:56.37+00', 21, NULL, NULL, NULL, NULL, NULL, '2025-12-05 08:17:56.549855+00', '2025-12-05 08:17:56.549855+00'),
	('019b3992-45bd-48ce-b2da-a5250a42d5a9', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '6124cf87-b433-494f-9127-c3168eed456f', '2025-12-05 09:33:21.141+00', '2025-12-05 09:33:37.014+00', 15, NULL, NULL, NULL, NULL, NULL, '2025-12-05 09:33:34.719797+00', '2025-12-05 09:33:34.719797+00'),
	('43914bd8-4283-468e-ae7e-ddf2eb3c3254', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '6124cf87-b433-494f-9127-c3168eed456f', '2025-12-05 09:35:37.224+00', '2025-12-05 09:36:25.739+00', 48, NULL, NULL, NULL, NULL, NULL, '2025-12-05 09:36:23.519663+00', '2025-12-05 09:36:23.519663+00'),
	('4a9df59b-1538-4b3e-a9c8-541bfe9ac6c9', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '2025-12-05 09:52:49.742+00', '2025-12-05 09:54:04.783+00', 75, NULL, NULL, NULL, NULL, NULL, '2025-12-05 09:54:02.447437+00', '2025-12-05 09:54:02.447437+00'),
	('d59a824b-0ac8-4a64-819e-9f056340d343', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '2025-12-05 10:50:11.992+00', '2025-12-05 10:50:15.395+00', 3, NULL, NULL, NULL, NULL, NULL, '2025-12-05 10:50:12.856538+00', '2025-12-05 10:50:12.856538+00'),
	('65cda228-1bec-471a-a8bf-56fe46c7c699', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '2025-12-05 10:50:57.961+00', '2025-12-05 10:51:02.526+00', 4, NULL, NULL, NULL, NULL, NULL, '2025-12-05 10:51:00.006078+00', '2025-12-05 10:51:00.006078+00'),
	('fea8f955-67a7-4159-8743-77fa3d950570', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '2025-12-05 10:51:58.158+00', '2025-12-05 10:52:06.722+00', 8, NULL, NULL, NULL, NULL, NULL, '2025-12-05 10:52:04.192855+00', '2025-12-05 10:52:04.192855+00'),
	('c3c394d3-c93a-4e9c-8e66-42b09268f1c6', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '2025-12-05 10:56:21.453+00', '2025-12-05 10:56:24.777+00', 3, NULL, NULL, NULL, NULL, NULL, '2025-12-05 10:56:22.219362+00', '2025-12-05 10:56:22.219362+00'),
	('958b963d-4c9d-4f6a-a229-3e90352913ec', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '2025-12-05 10:57:41.026+00', '2025-12-05 10:57:43.446+00', 2, NULL, NULL, NULL, NULL, NULL, '2025-12-05 10:57:40.90014+00', '2025-12-05 10:57:40.90014+00'),
	('404fdef0-dea7-4782-8b76-a40cd8113297', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '2025-12-05 10:58:28.288+00', '2025-12-05 10:58:32.802+00', 4, NULL, NULL, NULL, NULL, NULL, '2025-12-05 10:58:30.258234+00', '2025-12-05 10:58:30.258234+00');


--
-- Data for Name: workout_exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."workout_exercises" ("id", "workout_id", "exercise_id", "sequence_no", "note") VALUES
	('563b9d89-f5fa-4217-ba1d-d93b0abfceaa', 'b40756ae-e913-44f2-b31f-248978f79cbd', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, NULL),
	('cebe4884-3932-4864-9ec4-2891a4222ae7', 'b40756ae-e913-44f2-b31f-248978f79cbd', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, NULL),
	('0a871d3a-fa8f-480e-b1fa-33c0902d1eb9', '698798e8-8f06-402b-8811-0f2e4273cbb8', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 'I love running'),
	('490828af-f393-45fd-aebd-d435cc8026f8', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', '5f2b797a-c569-4312-b781-e67070f227f2', 1, NULL),
	('52660946-ab4e-4290-b526-42e1361db395', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('63920643-5982-4d93-9a44-bca69b9f8818', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('cfbf91fb-4a54-4238-a458-18cef04e4fdd', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('293fa6d3-b5fe-4486-a2a1-e7441a8aa4f2', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('2fc63075-0e52-493f-903c-745e5f85348a', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, NULL),
	('d3bebd76-9791-432d-bbbf-a3438d4cb8f4', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, NULL),
	('0b0b46cb-7516-4a51-b893-91f905c4e48a', '019b3992-45bd-48ce-b2da-a5250a42d5a9', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, NULL),
	('2f34afd2-3e6d-4b69-96a5-212360214262', '019b3992-45bd-48ce-b2da-a5250a42d5a9', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, NULL),
	('abc8d3fa-0e39-408c-ae54-730d23949817', '019b3992-45bd-48ce-b2da-a5250a42d5a9', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('25e1b59d-d967-428b-a52e-2f9919f43c6a', '019b3992-45bd-48ce-b2da-a5250a42d5a9', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('2480e8d6-e03d-4723-8cc2-99b9b7b6a803', '019b3992-45bd-48ce-b2da-a5250a42d5a9', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('3b7909c3-e55e-42f9-9084-7509532177a6', '43914bd8-4283-468e-ae7e-ddf2eb3c3254', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, NULL),
	('e7213fde-77cd-447b-8b41-c33339355843', '43914bd8-4283-468e-ae7e-ddf2eb3c3254', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, NULL),
	('4eaa2e8d-e7a5-49bd-9515-7ebb486c11eb', '43914bd8-4283-468e-ae7e-ddf2eb3c3254', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('c4914c60-ae55-4683-8737-14cfb55bc7f5', '43914bd8-4283-468e-ae7e-ddf2eb3c3254', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('0a50033b-7902-4f20-8e76-9841d36a7d31', '43914bd8-4283-468e-ae7e-ddf2eb3c3254', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('3f014eb9-273d-4956-82b1-69187c792853', '4a9df59b-1538-4b3e-a9c8-541bfe9ac6c9', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, NULL),
	('ca6ab855-2ace-435e-ac1a-6230b3487d09', '4a9df59b-1538-4b3e-a9c8-541bfe9ac6c9', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('930899ef-0e76-46fd-94ce-476a147228e0', '4a9df59b-1538-4b3e-a9c8-541bfe9ac6c9', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('da353966-8892-4573-86f0-d466ee5fd960', '4a9df59b-1538-4b3e-a9c8-541bfe9ac6c9', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('666c2f0b-5b2c-4f85-bc43-d6d32172c3ae', '4a9df59b-1538-4b3e-a9c8-541bfe9ac6c9', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('ce7d734e-f6b0-4ddc-80c5-fcb86c09f1c3', 'd59a824b-0ac8-4a64-819e-9f056340d343', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, NULL),
	('df0962ad-20ec-476e-a298-9eb41b531cfb', 'd59a824b-0ac8-4a64-819e-9f056340d343', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('581b07e7-3d74-4c8f-9894-be0ea362d452', 'd59a824b-0ac8-4a64-819e-9f056340d343', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('328260b1-14e7-48df-8fdf-64e2e8bc5d5f', 'd59a824b-0ac8-4a64-819e-9f056340d343', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('d0fe2b71-0d5b-4d33-accc-e70c7ee7b275', 'd59a824b-0ac8-4a64-819e-9f056340d343', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('10de3ea3-6eb2-4036-b2a5-d9f08459e106', '65cda228-1bec-471a-a8bf-56fe46c7c699', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, NULL),
	('ed59b95e-c932-40ac-85d3-60cd07e0ce80', '65cda228-1bec-471a-a8bf-56fe46c7c699', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('f95529b9-496d-4bf5-b8f5-d2d1cf6aaf33', '65cda228-1bec-471a-a8bf-56fe46c7c699', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('e62660b8-e2af-40a9-a7db-7361009d18ed', '65cda228-1bec-471a-a8bf-56fe46c7c699', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('51c90923-8efc-4379-8bae-b25f17166af6', '65cda228-1bec-471a-a8bf-56fe46c7c699', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('5c291541-cb56-4931-b980-26a2bab33558', 'fea8f955-67a7-4159-8743-77fa3d950570', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, NULL),
	('ba448b8b-cd33-4e8a-97db-4c6ae713dc15', 'fea8f955-67a7-4159-8743-77fa3d950570', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('4ee8a080-12b3-4979-9fa8-17e9d57b3814', 'fea8f955-67a7-4159-8743-77fa3d950570', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('da49e297-c61d-4bb5-89d0-5fe46e35ae72', 'fea8f955-67a7-4159-8743-77fa3d950570', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('52b2995f-28a3-4931-8360-4b3bff6c869b', 'fea8f955-67a7-4159-8743-77fa3d950570', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('db5b2f17-6ad7-4c62-8ed3-05763a5dfbf3', 'c3c394d3-c93a-4e9c-8e66-42b09268f1c6', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, NULL),
	('bf9cb0cc-67b5-4659-a65c-65f0c09454f5', 'c3c394d3-c93a-4e9c-8e66-42b09268f1c6', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('0378f463-b3a5-4cbe-bb83-638e30e92b89', 'c3c394d3-c93a-4e9c-8e66-42b09268f1c6', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('c5031389-fc17-401b-a36a-33ecab0f8ce0', 'c3c394d3-c93a-4e9c-8e66-42b09268f1c6', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('8421249d-a30f-4b0f-be09-8f3266d20f4d', 'c3c394d3-c93a-4e9c-8e66-42b09268f1c6', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('fab6240d-762f-4e31-a3e0-3002c0d1c774', '958b963d-4c9d-4f6a-a229-3e90352913ec', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, NULL),
	('0bf85a07-091c-4822-8ed9-9c140c1b1d63', '958b963d-4c9d-4f6a-a229-3e90352913ec', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('93cb4661-be9a-493f-be43-5101fd565965', '958b963d-4c9d-4f6a-a229-3e90352913ec', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('17b992a6-4a42-4db9-b04f-c35bf6370c2d', '958b963d-4c9d-4f6a-a229-3e90352913ec', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('efafc55d-24df-45a4-b660-d16b052be6e3', '958b963d-4c9d-4f6a-a229-3e90352913ec', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL),
	('f959d50d-db1f-4a9f-85cd-54589f1c479f', '404fdef0-dea7-4782-8b76-a40cd8113297', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, NULL),
	('97c3b7a8-217d-4377-b2a0-339fffceda2c', '404fdef0-dea7-4782-8b76-a40cd8113297', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, NULL),
	('522ff0d2-e532-4ff8-b823-cbe04a634114', '404fdef0-dea7-4782-8b76-a40cd8113297', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, NULL),
	('933f0b86-782d-4d03-b8e6-070bece5a73f', '404fdef0-dea7-4782-8b76-a40cd8113297', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, NULL),
	('f3daa23d-b71c-4f59-9b79-a761551e46e7', '404fdef0-dea7-4782-8b76-a40cd8113297', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, NULL);


--
-- Data for Name: exercise_sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."exercise_sets" ("id", "workout_exercises_id", "set_no", "metric1", "value1", "completed", "metric2", "value2") VALUES
	('fb569841-635f-4971-8f0c-9a994b9cc6dd', '563b9d89-f5fa-4217-ba1d-d93b0abfceaa', 1, 'reps', 15, true, 'weight', 4),
	('c2d8a59e-3bd3-4f15-892b-c7b7067b67aa', '563b9d89-f5fa-4217-ba1d-d93b0abfceaa', 2, 'reps', 15, true, 'weight', 5),
	('60b5b268-e58d-4402-8deb-bef85969b610', '563b9d89-f5fa-4217-ba1d-d93b0abfceaa', 3, 'reps', 15, true, 'weight', 6),
	('1cd6dd84-0991-4e6b-8cfa-403fd679e879', 'cebe4884-3932-4864-9ec4-2891a4222ae7', 1, 'duration_s', 1200, true, NULL, NULL),
	('95734eb2-0245-40b4-8bf0-22df52c539e7', '0a871d3a-fa8f-480e-b1fa-33c0902d1eb9', 1, 'duration_s', 1200, true, NULL, NULL),
	('7307230b-d450-46f4-98d5-a7e2861b07ca', '490828af-f393-45fd-aebd-d435cc8026f8', 1, 'reps', 10, true, 'weight', 5),
	('49bbcb6d-7860-4765-9eae-67666dd0e271', '3b7909c3-e55e-42f9-9084-7509532177a6', 1, 'reps', 10, true, 'weight', 10),
	('481dd66c-d2c3-47fa-b8ef-f71808af104b', 'ca6ab855-2ace-435e-ac1a-6230b3487d09', 1, 'reps', 11, true, 'weight', 11);


--
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."friends" ("id", "requester_id", "addressee_id", "status", "created_at", "updated_at") VALUES
	('24abc968-3e44-41e0-874a-7a9f1c960648', '283656cf-5bcc-4876-93db-f6b5a68b7f34', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'accepted', '2025-11-25 15:59:46.303857+00', '2025-11-25 15:59:46.303857+00'),
	('229f6684-15ec-4c66-bc58-dec3ec80a2d1', '283656cf-5bcc-4876-93db-f6b5a68b7f34', '6a1e592d-b516-41ad-90fc-d242351efac7', 'pending', '2025-11-28 10:39:49.231276+00', '2025-11-28 10:39:49.231276+00'),
	('448d8dc8-50f3-4896-8833-161674157fd3', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', 'accepted', '2025-11-28 10:56:07.888723+00', '2025-11-28 11:31:57.827+00'),
	('a61a1c95-d4f0-4425-9990-08a0fdb05e0a', '08fd1fc2-93a0-493a-9e52-9a25978ef252', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', 'pending', '2025-11-28 16:05:33.839435+00', '2025-11-28 16:05:33.839435+00'),
	('0cac7223-337e-4d4f-8bf6-9afe6aaffbae', '08fd1fc2-93a0-493a-9e52-9a25978ef252', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'accepted', '2025-11-28 15:39:47.968963+00', '2025-12-04 15:38:06.616+00'),
	('ee321328-2865-46db-8aff-9cd057f1239f', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'pending', '2025-12-05 09:28:24.855391+00', '2025-12-05 09:28:24.855391+00'),
	('9b413e04-4f09-44c6-af4a-dc2fa0acefd6', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'pending', '2025-12-05 09:28:29.535247+00', '2025-12-05 09:28:29.535247+00');


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."goals" ("id", "user_id", "goals", "goal_type", "target_value", "initial_value", "unit", "status", "created_at", "start_date", "due_date") VALUES
	(4, '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'Exercises discovered', NULL, 10, 0, '', 'active', '2025-12-03 21:39:38.478983+00', '2025-12-03 21:39:38.478983+00', NULL),
	(6, '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'Moods logged', NULL, 7, 0, '', 'active', '2025-12-04 15:38:15.168691+00', '2025-12-04 15:38:15.168691+00', NULL),
	(7, '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'Workouts completed', NULL, 10, 0, '', 'active', '2025-12-04 16:07:57.588247+00', '2025-12-04 16:07:57.588247+00', NULL),
	(8, '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'Longest streak', NULL, 2, 0, '', 'active', '2025-12-05 08:19:27.159216+00', '2025-12-05 08:19:27.159216+00', NULL),
	(9, 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'Longest streak', NULL, 7, 0, '', 'active', '2025-12-05 09:30:02.66216+00', '2025-12-05 09:30:02.66216+00', NULL),
	(11, 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'Moods logged', NULL, 7, 0, '', 'active', '2025-12-05 09:30:14.332864+00', '2025-12-05 09:30:14.332864+00', NULL),
	(13, 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'Workouts completed', NULL, 5, 0, '', 'active', '2025-12-05 11:03:09.411946+00', '2025-12-05 11:03:09.411946+00', NULL),
	(14, 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'Exercises completed', NULL, 10, 0, '', 'active', '2025-12-05 11:03:12.612135+00', '2025-12-05 11:03:12.612135+00', NULL),
	(15, 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'Workouts completed', NULL, 10, 0, '', 'active', '2025-12-05 11:18:26.570591+00', '2025-12-05 11:18:26.570591+00', NULL),
	(16, 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'Exercises completed', NULL, 50, 0, '', 'active', '2025-12-05 11:34:16.48817+00', '2025-12-05 11:34:16.48817+00', NULL);


--
-- Data for Name: goal_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."plan_exercises" ("id", "plan_id", "exercise_id", "sequence_no", "target_sets", "metric", "target_value", "rest_seconds") VALUES
	('50bd2c9c-3434-40f3-8314-4f0bc111ae83', 'bccc8974-f09b-4a22-89d1-8e3dbd6977e1', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 12, 60),
	('57d58055-e47f-43e5-b899-b48e4f0f9629', 'bccc8974-f09b-4a22-89d1-8e3dbd6977e1', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 12, 60),
	('1183623a-d79d-4739-9b6a-2b7c3f2aaf11', 'bccc8974-f09b-4a22-89d1-8e3dbd6977e1', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 10, 60),
	('a97846f3-7cdf-4832-b777-3c0ddb85f5df', 'bccc8974-f09b-4a22-89d1-8e3dbd6977e1', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 10, 60),
	('0ed15138-bf36-4ce5-8b4e-5a3d5fa24195', 'bccc8974-f09b-4a22-89d1-8e3dbd6977e1', '42be1efa-682d-4a40-9567-479b6ce69dbb', 5, 3, 'reps', 15, 45),
	('91dd52ac-cef4-4ed0-a675-8f4109360269', 'bccc8974-f09b-4a22-89d1-8e3dbd6977e1', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 6, 3, 'reps', 12, 45),
	('0a448a58-baad-4b0d-a5ba-1e149d37c6c2', 'bccc8974-f09b-4a22-89d1-8e3dbd6977e1', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 900, 15),
	('9cc4e083-304a-42d2-9ffa-e14bb805d7ad', 'dc6f45eb-adc6-4eb9-ae37-061902ea4934', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 60),
	('5600fcdf-1de8-46b5-8866-56811119967e', 'dc6f45eb-adc6-4eb9-ae37-061902ea4934', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 12, 60),
	('68efb978-1eab-4b36-8b17-7d6bb266df0c', 'dc6f45eb-adc6-4eb9-ae37-061902ea4934', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 3, 3, 'reps', 15, 45),
	('6d80462c-f908-4b70-ac8e-3ac403adf4a8', 'dc6f45eb-adc6-4eb9-ae37-061902ea4934', '92ffbb4c-4909-4952-a8df-5d724164572a', 4, 3, 'reps', 12, 45),
	('6228f536-e6cb-475f-98a6-009a40f2ba48', 'dc6f45eb-adc6-4eb9-ae37-061902ea4934', 'd7c9b705-bff7-4851-863d-0c326387e06e', 5, 3, 'reps', 12, 60),
	('5e0ff318-52c0-4bc3-9f96-461d69d0ba8e', 'dc6f45eb-adc6-4eb9-ae37-061902ea4934', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 6, 3, 'reps', 12, 60),
	('baf7c5fb-fb9c-4036-b99d-e10eea73b32d', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 12, 45),
	('19e040b2-2fde-4719-a3ac-ad3a8f62b189', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 2, 3, 'reps', 15, 45),
	('c552c283-6bde-4c80-9395-42570f612839', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 3, 3, 'reps', 12, 45),
	('91aff17a-b01f-4f02-a177-b0d4179c7dab', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 4, 3, 'reps', 10, 45),
	('05cf4d0d-4c5b-48ae-b3df-145a0c3d0187', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', 'ba15edf2-63a2-442e-b614-a17a949582ff', 5, 3, 'reps', 10, 45),
	('9f824b6f-8a4b-4a74-86a5-0cfc9b07d046', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 6, 3, 'reps', 15, 30),
	('b8db7fb8-d7ea-4966-b623-3b53d050a3a7', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 7, 3, 'reps', 12, 30),
	('04ef9123-cded-498f-b6f2-9004867f323f', 'e8c9b2cf-5f37-490a-81e6-142b58bd6ef7', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 8, 1, 'duration_s', 720, 15),
	('f4cb34ca-280f-460c-a730-1df1fb79682e', '58cf0fff-726b-4003-9436-c65a881154f3', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 10, 90),
	('dd6533ff-b7fc-49f5-8c67-8949abe10a25', '58cf0fff-726b-4003-9436-c65a881154f3', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 2, 3, 'reps', 12, 75),
	('288bfd7b-996c-4a93-ad7f-39de3a6dfa76', '58cf0fff-726b-4003-9436-c65a881154f3', '5f2b797a-c569-4312-b781-e67070f227f2', 3, 3, 'reps', 8, 90),
	('a5cb118d-364e-4bd3-83b0-4002311597a0', '58cf0fff-726b-4003-9436-c65a881154f3', '42be1efa-682d-4a40-9567-479b6ce69dbb', 4, 3, 'reps', 12, 60),
	('1c5c6135-bfff-49f9-b24b-bc3d705298fc', 'f20c29af-c5a2-49d8-b4ca-cd601053f611', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 12, 90),
	('ca3cdaeb-07ef-4e1a-a920-1091e621efcd', 'f20c29af-c5a2-49d8-b4ca-cd601053f611', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 10, 75),
	('cdcbaa26-9fa0-4add-aaa8-2de4c0afb4b8', 'f20c29af-c5a2-49d8-b4ca-cd601053f611', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 3, 3, 'reps', 10, 75),
	('6a416ab4-17a6-4c04-b58a-1aca80a9ac76', 'f20c29af-c5a2-49d8-b4ca-cd601053f611', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 4, 3, 'reps', 12, 60),
	('6f8d06f4-a4b1-4e86-a25e-9354e084f6f5', 'f20c29af-c5a2-49d8-b4ca-cd601053f611', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 5, 1, 'duration_s', 900, 15),
	('be53dc55-7dac-48d4-8fef-7cfc021e3ef4', '7af80ba1-f980-48ec-b82e-ac77e08c961f', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('44c9e02e-9fa0-4776-a357-16cc1a082863', '7af80ba1-f980-48ec-b82e-ac77e08c961f', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('c6461dd4-cd5a-4092-8cc8-6f781a0585c6', '7af80ba1-f980-48ec-b82e-ac77e08c961f', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 15, 60),
	('dd28e7e5-20d9-4035-aaf0-b65bb159e32e', '7af80ba1-f980-48ec-b82e-ac77e08c961f', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 15, 60),
	('92ff6581-c347-4b79-a293-59f450e41a1d', '7af80ba1-f980-48ec-b82e-ac77e08c961f', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('bd8df053-3015-401a-baed-20d651e03947', '7af80ba1-f980-48ec-b82e-ac77e08c961f', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('1b5db013-3e7f-43d8-a354-00a7bac46965', 'b313fa86-c06f-4238-9a8d-753879f4f40e', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 60),
	('3db13ed8-451f-4c24-9d13-768d8b570880', 'b313fa86-c06f-4238-9a8d-753879f4f40e', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1200, 60),
	('bc606371-4628-4981-81a5-102c4de69380', 'b313fa86-c06f-4238-9a8d-753879f4f40e', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 3, 3, 'reps', 15, 60),
	('7eb4b988-f4f2-488c-9cac-7fe2c3139ce6', 'b313fa86-c06f-4238-9a8d-753879f4f40e', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 4, 3, 'reps', 15, 60),
	('3d006f74-a4d0-43ac-8f81-a666ded8225e', 'b58c94f2-6bde-4cfe-a558-441e8c875e03', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 10, 75),
	('b5ac9045-024a-48bd-abc7-93ece35170a5', 'b58c94f2-6bde-4cfe-a558-441e8c875e03', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 10, 75),
	('17294b18-e9a3-4105-a145-0223b4956424', 'b58c94f2-6bde-4cfe-a558-441e8c875e03', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 3, 3, 'reps', 12, 60),
	('8704ddf0-c41b-4ccd-b7f2-85f3a417c462', 'b58c94f2-6bde-4cfe-a558-441e8c875e03', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 10, 60),
	('06bfc254-00e5-4085-b67f-498f4bbcd583', 'b58c94f2-6bde-4cfe-a558-441e8c875e03', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 12, 45),
	('ed491b6c-6707-4de7-9f4b-b7bce096f867', 'b58c94f2-6bde-4cfe-a558-441e8c875e03', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 12, 45),
	('36a6772c-10cc-46e2-87e5-b6aae5679982', '7f964f10-0773-4b18-8c60-eb659d9ef9d2', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 1, 3, 'reps', 10, 75),
	('a9b73e7e-2f42-4343-9548-016048c81277', '7f964f10-0773-4b18-8c60-eb659d9ef9d2', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 10, 75),
	('3cc1be6a-0c2f-4423-abc8-b125b5f9df15', '7f964f10-0773-4b18-8c60-eb659d9ef9d2', 'a83c1ede-ed4c-4c4d-b51a-b408966c37c5', 3, 3, 'reps', 10, 60),
	('51c80975-4964-486f-9718-2a799b3f074b', '7f964f10-0773-4b18-8c60-eb659d9ef9d2', 'd7c9b705-bff7-4851-863d-0c326387e06e', 4, 3, 'reps', 10, 60),
	('06371d6c-7591-41e7-93ff-af95ea7af87e', '7f964f10-0773-4b18-8c60-eb659d9ef9d2', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 12, 45),
	('25e2070c-2ecd-4402-b482-1e7ef438ec0e', '7f964f10-0773-4b18-8c60-eb659d9ef9d2', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 6, 3, 'reps', 12, 45),
	('8b939d6a-6402-4a8d-9190-011f5c4704d7', 'c4f61f8f-e999-400f-bfc1-68e8591da819', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 10, 75),
	('b2c90101-0825-4f18-bc20-72d1987d2b81', 'c4f61f8f-e999-400f-bfc1-68e8591da819', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 12, 60),
	('c9394439-c1bb-4e0f-b2c1-0e8204d404a3', 'c4f61f8f-e999-400f-bfc1-68e8591da819', 'ba15edf2-63a2-442e-b614-a17a949582ff', 3, 3, 'reps', 10, 60),
	('8ac00e29-4c9c-49a8-ab41-66d224dee328', 'c4f61f8f-e999-400f-bfc1-68e8591da819', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 10, 60),
	('d6d8e44f-5ba2-48a8-9cfb-158868e6ead1', 'c4f61f8f-e999-400f-bfc1-68e8591da819', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 12, 60),
	('eaf9334b-c405-49d0-9cb4-312084660e4d', 'c4f61f8f-e999-400f-bfc1-68e8591da819', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 12, 60),
	('7813ff7a-ecb1-4d8e-ad89-2bcc9c2f8e71', 'd6144c96-2081-455d-954e-e1d8f6869391', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 4, 'reps', 12, 90),
	('8b3b8eae-89d0-49f3-89d5-03a2d5114dfa', 'd6144c96-2081-455d-954e-e1d8f6869391', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 10, 60),
	('00f59fc0-f812-41ba-a7e8-9cee00d1b26c', 'd6144c96-2081-455d-954e-e1d8f6869391', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 3, 1, 'duration_s', 900, 15),
	('6abf90b0-052b-4b21-8873-5d38f6576607', '790f3c25-5a97-43a3-a278-e52875d23dca', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('b608c538-a26b-424d-9bd2-68d3451a4911', '790f3c25-5a97-43a3-a278-e52875d23dca', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('a99d21ec-19ce-47e5-9608-ecb9d9a5f1c7', '790f3c25-5a97-43a3-a278-e52875d23dca', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('a71ef1a2-d348-4514-9567-d7a314cb7d75', '790f3c25-5a97-43a3-a278-e52875d23dca', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 15, 60),
	('341252e1-2c0d-43e7-be17-61107d124da0', '790f3c25-5a97-43a3-a278-e52875d23dca', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 5, 3, 'reps', 15, 60),
	('b556301e-9f15-4beb-a7f4-8546c50282d3', '790f3c25-5a97-43a3-a278-e52875d23dca', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 6, 3, 'reps', 15, 45),
	('5ec86687-9d35-4f5b-8217-449e4a4bacc3', '790f3c25-5a97-43a3-a278-e52875d23dca', '42be1efa-682d-4a40-9567-479b6ce69dbb', 7, 3, 'reps', 15, 45),
	('65564449-3f56-406c-8e63-5959d6127e42', '34fcc180-c5b6-481c-b4b0-ec72b71af9c4', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('4e6cd7b5-54af-45aa-b6a6-bd581719be73', '85bb7126-12e9-4c35-b764-00b4db2c59b6', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 10, 75),
	('8ef2ade2-6522-4b48-98a0-eed0e7538a61', '85bb7126-12e9-4c35-b764-00b4db2c59b6', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 10, 75),
	('f86e6ce1-653e-498b-86b4-c59d5005d8be', '85bb7126-12e9-4c35-b764-00b4db2c59b6', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 12, 60),
	('1f0f63ef-8ecd-43c4-bae9-77abde111ea8', '85bb7126-12e9-4c35-b764-00b4db2c59b6', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 10, 60),
	('b97a1d51-de0d-402a-904f-898b7c216c14', '85bb7126-12e9-4c35-b764-00b4db2c59b6', '42be1efa-682d-4a40-9567-479b6ce69dbb', 5, 3, 'reps', 12, 60),
	('fc011eb4-fac1-4a57-9646-088dd23946c1', '85bb7126-12e9-4c35-b764-00b4db2c59b6', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 6, 3, 'reps', 12, 60),
	('f619f5ca-d6f6-4dbb-9e9c-71a4958a2212', '062a2d79-c4ad-430d-9e62-fb3b9c479d40', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 4, 'reps', 10, 90),
	('023dbf28-493d-4ae8-960d-7f5e2f0765ba', '062a2d79-c4ad-430d-9e62-fb3b9c479d40', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1200, 60),
	('2abb688d-1075-404b-a83f-ff085b2aaac9', '062a2d79-c4ad-430d-9e62-fb3b9c479d40', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 3, 3, 'reps', 12, 60),
	('cbaee59b-f293-406d-b625-7688d6e400c0', '92d8fe1b-672b-431a-86fb-553d5b1c49aa', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 10, 75),
	('e56b2696-edd8-41a2-8a93-9ed3c7237b13', '92d8fe1b-672b-431a-86fb-553d5b1c49aa', 'd7c9b705-bff7-4851-863d-0c326387e06e', 2, 3, 'reps', 10, 75),
	('ffc8b5db-7f7e-4d29-a4e2-abea4fdce79c', '92d8fe1b-672b-431a-86fb-553d5b1c49aa', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 12, 60),
	('52800a13-6acb-4bf3-a567-f091430c04b0', '92d8fe1b-672b-431a-86fb-553d5b1c49aa', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 4, 3, 'reps', 10, 60),
	('aa415b7a-5a4b-43b0-8f61-bd6830122bb9', '92d8fe1b-672b-431a-86fb-553d5b1c49aa', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 5, 3, 'reps', 12, 60),
	('a75f5d4e-fee0-4236-adb1-27a2fb119065', '92d8fe1b-672b-431a-86fb-553d5b1c49aa', '92ffbb4c-4909-4952-a8df-5d724164572a', 6, 3, 'reps', 12, 60),
	('ae0656d6-e5d0-4def-af4c-e337f7370d7c', '1a86512c-a62f-40fe-a4a7-32bab2585295', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('a47b16ee-9096-4a07-bf8f-d80891c3e543', '1a86512c-a62f-40fe-a4a7-32bab2585295', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('187e2a56-47c1-43f3-9c75-4f0f271e2bfb', '1a86512c-a62f-40fe-a4a7-32bab2585295', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 3, 3, 'reps', 12, 75),
	('fba113d6-0a3a-4c92-9db6-938c0b64c274', '1a86512c-a62f-40fe-a4a7-32bab2585295', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 12, 75),
	('07524aa5-3e8a-4314-b118-5cfe62ce22ac', '1a86512c-a62f-40fe-a4a7-32bab2585295', '42be1efa-682d-4a40-9567-479b6ce69dbb', 5, 3, 'reps', 15, 60),
	('81ec1980-53e9-4792-98a4-3b3cf92e0e77', '1a86512c-a62f-40fe-a4a7-32bab2585295', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 6, 3, 'reps', 15, 60),
	('4c655327-7678-4dda-9c78-d8e9323fc364', 'f3930cfe-1016-474a-b090-c50036140fd6', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('d0cd7386-6afb-4060-9b2c-3649a595818b', 'f3930cfe-1016-474a-b090-c50036140fd6', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1200, 120),
	('792e08ab-0f02-41e6-ac17-462842d6eab6', 'f3930cfe-1016-474a-b090-c50036140fd6', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 3, 3, 'reps', 15, 60),
	('00865e3a-69b7-42a6-9477-27f054423fff', 'f3930cfe-1016-474a-b090-c50036140fd6', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 4, 3, 'reps', 12, 60),
	('c61269e0-de1f-4f01-b205-d2bd2e55283e', 'f3930cfe-1016-474a-b090-c50036140fd6', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 12, 60),
	('6002eef1-ed71-4c36-84c5-9ba9124cb005', '02158894-b865-46f5-a166-e7dccb01d9f3', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('f2969654-cf26-49aa-b434-79c19287e5ff', '02158894-b865-46f5-a166-e7dccb01d9f3', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('f3b53a2e-22a4-4c02-88dd-8838f5e0f636', '02158894-b865-46f5-a166-e7dccb01d9f3', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 3, 3, 'reps', 12, 60),
	('94d6ff85-14f5-437b-ba4c-628b602f1775', '02158894-b865-46f5-a166-e7dccb01d9f3', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 12, 60),
	('dd8ff303-5831-4e5d-9839-aa0b1c1d4ea3', '02158894-b865-46f5-a166-e7dccb01d9f3', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('228a9982-9b90-4c05-a51b-e80aded95bdb', '02158894-b865-46f5-a166-e7dccb01d9f3', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('2e8d79ea-06f5-4183-a8ab-49afb423401d', '0c882423-a8f2-4ad1-8565-4be9f1a66b69', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1200, 15),
	('c2870d7e-6ef8-44b9-9b95-882e0cff54a7', '0c882423-a8f2-4ad1-8565-4be9f1a66b69', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 2, 3, 'reps', 15, 60),
	('82610c36-2440-48f8-b83b-f9a53494aa97', '0c882423-a8f2-4ad1-8565-4be9f1a66b69', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 3, 3, 'reps', 15, 60),
	('17acac08-92e8-40af-86d9-00e4282a8ee2', '0c882423-a8f2-4ad1-8565-4be9f1a66b69', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('2d5a1f5d-cf29-4727-9de8-5ef94ecbb26b', '0c882423-a8f2-4ad1-8565-4be9f1a66b69', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 5, 3, 'reps', 15, 45),
	('4b81cfbf-910c-4e61-8bd3-1ebf8d66b2df', '0c882423-a8f2-4ad1-8565-4be9f1a66b69', '92ffbb4c-4909-4952-a8df-5d724164572a', 6, 3, 'reps', 12, 45),
	('ede7eb49-3085-40f4-a8e0-8860d1ccc1a2', '25dd6520-fa1a-4880-982b-70308f2fef5d', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('c3af75c5-0bbf-4ba9-a447-a8b7f24cc1a5', '25dd6520-fa1a-4880-982b-70308f2fef5d', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('35b3b8b0-1378-4918-8eba-36a714498e60', '25dd6520-fa1a-4880-982b-70308f2fef5d', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 12, 60),
	('d9426a0b-ad2e-4ac7-b76a-449248c6485e', '25dd6520-fa1a-4880-982b-70308f2fef5d', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 15, 60),
	('687fbbb4-103f-48d7-93d1-f23733e91565', '25dd6520-fa1a-4880-982b-70308f2fef5d', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 12, 60),
	('afad175d-cb35-4bbd-b6b8-22594d2aff23', '25dd6520-fa1a-4880-982b-70308f2fef5d', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 60),
	('df7126b0-87f2-4521-af87-942d7c25b09b', '1b7e9006-4d95-4d31-ac49-5de47d00517d', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('fb932410-afbf-44fc-8b11-7ea4622ce97f', '1b7e9006-4d95-4d31-ac49-5de47d00517d', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1200, 90),
	('531e011f-99b5-4e19-b218-bc48c7fe74be', '97e07053-89ff-48a7-85cb-7b529ee30e81', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 12, 60),
	('cff5a593-4f49-4b2d-9390-ebcea55a2e3b', '97e07053-89ff-48a7-85cb-7b529ee30e81', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 12, 60),
	('933959c3-468c-41e4-927b-760e9f83a2cf', '97e07053-89ff-48a7-85cb-7b529ee30e81', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 10, 60),
	('12741b5a-0cf2-4fc6-bae4-f7e69b9b61cc', '97e07053-89ff-48a7-85cb-7b529ee30e81', 'ba15edf2-63a2-442e-b614-a17a949582ff', 4, 3, 'reps', 10, 60),
	('361939be-222f-4b23-ad0b-c99a7fa8e531', '97e07053-89ff-48a7-85cb-7b529ee30e81', '42be1efa-682d-4a40-9567-479b6ce69dbb', 5, 3, 'reps', 12, 60),
	('73c30637-4223-4292-907d-755d22c95ce8', '97e07053-89ff-48a7-85cb-7b529ee30e81', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 6, 3, 'reps', 12, 60),
	('1342c412-e2d5-44a6-8e74-ec571a1f704b', 'b4942804-149c-457a-88e4-8a07aeac6fc5', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('b914bf6e-843d-4022-b543-84be086a0565', 'b4942804-149c-457a-88e4-8a07aeac6fc5', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1200, 15),
	('f0f8e262-7182-48a8-bc96-fa6affe01c8a', '632a80c0-7e8d-4616-add6-684924d68892', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 10, 75),
	('4862cbd4-4d64-4aed-b43c-24c0e08b8c59', '632a80c0-7e8d-4616-add6-684924d68892', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 10, 75),
	('25bd12fe-b3be-4c17-9574-23f06897b112', '632a80c0-7e8d-4616-add6-684924d68892', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 12, 60),
	('91974d8e-4a85-47db-ac0f-79dab709667c', '632a80c0-7e8d-4616-add6-684924d68892', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 4, 3, 'reps', 10, 75),
	('7d86d588-c57a-4686-90f1-5af15ceb0a82', '632a80c0-7e8d-4616-add6-684924d68892', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 12, 60),
	('ae112931-c369-4e4a-a82b-a8e5fe84d181', '632a80c0-7e8d-4616-add6-684924d68892', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 12, 60),
	('98000db7-c871-4d52-91a5-3039118bc851', 'b94490f4-9641-4507-ae09-6ce5b89ab239', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 12, 90),
	('ac054c76-615c-4ae0-ba53-8152a4428d69', 'b94490f4-9641-4507-ae09-6ce5b89ab239', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1200, 60),
	('e14d8f3d-29a7-41aa-9fca-db9012350263', 'b94490f4-9641-4507-ae09-6ce5b89ab239', 'ba15edf2-63a2-442e-b614-a17a949582ff', 3, 3, 'reps', 10, 75),
	('d9811833-ae5d-4652-ad13-5580c22dcb5f', 'b94490f4-9641-4507-ae09-6ce5b89ab239', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 4, 3, 'reps', 10, 75),
	('b5e7b1af-e330-4227-98a1-da80c8cc2cc0', 'b94490f4-9641-4507-ae09-6ce5b89ab239', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 12, 60),
	('9f76e469-fd38-4f1e-b98c-34d3b04c5d0f', 'b94490f4-9641-4507-ae09-6ce5b89ab239', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 6, 3, 'reps', 12, 60),
	('26e55bdc-5fe4-4009-97e0-2b1a687ae6a9', '4f0305fa-e717-4784-ab0c-ac50809973dc', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 10, 75),
	('4e8c4160-f90b-4565-8cfe-2b59689a45c0', '4f0305fa-e717-4784-ab0c-ac50809973dc', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 12, 60),
	('10030b04-06f7-4f98-a8b1-0090a5c3c5fb', '4f0305fa-e717-4784-ab0c-ac50809973dc', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 3, 3, 'reps', 12, 60),
	('f4a4037d-4d47-40e6-81b1-f0205b53a176', '4f0305fa-e717-4784-ab0c-ac50809973dc', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 4, 3, 'reps', 15, 45),
	('dacbd528-0571-4e10-bd27-c79d9be01de0', '4f0305fa-e717-4784-ab0c-ac50809973dc', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 12, 45),
	('6ce1ab75-470b-4147-a22c-09f721e88628', 'f36732b5-e8f1-489b-a715-68f9096c6d77', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 10, 75),
	('1fd28354-1272-4cdf-a8c5-2de16792bf61', 'f36732b5-e8f1-489b-a715-68f9096c6d77', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 2, 3, 'reps', 12, 60),
	('779f1719-9a1c-45bc-b7b3-8c211c3e08bb', 'f36732b5-e8f1-489b-a715-68f9096c6d77', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 10, 60),
	('91b1ca31-8bba-4150-84ba-5de09420f07a', 'f36732b5-e8f1-489b-a715-68f9096c6d77', '42be1efa-682d-4a40-9567-479b6ce69dbb', 4, 3, 'reps', 15, 45),
	('2cf4f59d-347e-4ea6-b51e-03e33c62fbc8', 'f36732b5-e8f1-489b-a715-68f9096c6d77', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 12, 45),
	('f64e57a9-1888-4599-bf51-46c251d3b56c', 'b3819201-d3bd-4961-9304-efbc212058ca', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 1, 3, 'reps', 12, 60),
	('b03ff1b5-7f94-4184-a709-b1531810a694', 'b3819201-d3bd-4961-9304-efbc212058ca', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 12, 60),
	('1e622d71-5e9b-4ac2-b51c-b77e3902ebe9', 'b3819201-d3bd-4961-9304-efbc212058ca', 'ba15edf2-63a2-442e-b614-a17a949582ff', 3, 3, 'reps', 12, 60),
	('feab2f67-1802-451c-aa30-c0ebe97c7675', 'b3819201-d3bd-4961-9304-efbc212058ca', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 4, 1, 'duration_s', 900, 15),
	('b6b351e4-1a46-4505-8820-c812c5fca988', '33160829-5877-4e85-9260-9b9ee5022f88', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 12, 60),
	('5a3906f3-1649-4d55-9013-60d9bc34510a', '33160829-5877-4e85-9260-9b9ee5022f88', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 12, 60),
	('5e2af632-71e1-449c-abaf-26cbb158f9c8', '33160829-5877-4e85-9260-9b9ee5022f88', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('7fcf2860-2744-4e93-9b12-7b13bebe6a0b', '33160829-5877-4e85-9260-9b9ee5022f88', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('7a2b1b6b-90e3-4706-ba0c-393fc2db1e3d', '33160829-5877-4e85-9260-9b9ee5022f88', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 5, 3, 'reps', 12, 60),
	('67e84300-79f3-4bc2-a9ec-56cdc4046d91', '33160829-5877-4e85-9260-9b9ee5022f88', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 6, 1, 'duration_s', 900, 15),
	('d1761089-f5d4-4528-8d65-411708c6f635', '111cf32f-67b0-4428-afc8-51f36943889c', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('8e220f59-0aa8-4a64-b047-e173de77100f', '111cf32f-67b0-4428-afc8-51f36943889c', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('e693bac2-d2b9-4bee-ba6b-3f12772b3cee', '111cf32f-67b0-4428-afc8-51f36943889c', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 12, 60),
	('528b0a99-4c27-4346-ab09-1315393d61b2', '111cf32f-67b0-4428-afc8-51f36943889c', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 4, 3, 'reps', 15, 60),
	('51125a09-345b-4c70-89ab-aa51ec0bfd38', '111cf32f-67b0-4428-afc8-51f36943889c', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 2, 'reps', 15, 45),
	('394dc166-552e-40a3-9498-8b6be1ba8f3f', '111cf32f-67b0-4428-afc8-51f36943889c', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 2, 'reps', 15, 45),
	('a25da72d-7316-4e3e-ae97-c682196fba98', 'af3027ec-860c-423d-9ffe-1d801ea2242e', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('226de2b1-ca48-4768-9790-14d52fb83b4a', 'af3027ec-860c-423d-9ffe-1d801ea2242e', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1200, 120),
	('4d524827-bd01-4b21-bc78-03269186a0e6', 'af3027ec-860c-423d-9ffe-1d801ea2242e', 'ba15edf2-63a2-442e-b614-a17a949582ff', 3, 3, 'reps', 12, 60),
	('8a1a22ab-560b-4e16-941b-096cf559e475', 'af3027ec-860c-423d-9ffe-1d801ea2242e', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 4, 2, 'reps', 15, 45),
	('01736a18-bc1d-4114-af96-9a04bfd52fc0', 'af3027ec-860c-423d-9ffe-1d801ea2242e', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 2, 'reps', 15, 45),
	('2adb29d5-b630-427b-b75d-780f55e36f12', '05f8fb5a-ce05-438b-8c96-3a1c507f1d69', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 300, 60),
	('bd7fb3b3-9dac-4435-a8fb-0dd51fb51f42', '05f8fb5a-ce05-438b-8c96-3a1c507f1d69', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('7abc0986-98a9-4346-8a1a-cd1728b17307', '05f8fb5a-ce05-438b-8c96-3a1c507f1d69', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('49788e8a-47a3-4d50-b7de-02d16c74beb6', '05f8fb5a-ce05-438b-8c96-3a1c507f1d69', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 3, 3, 'reps', 12, 60),
	('68107fa1-477f-4fb0-a81e-6c8eb7d3cdca', '05f8fb5a-ce05-438b-8c96-3a1c507f1d69', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 4, 3, 'reps', 15, 60),
	('93377e18-954c-4aaf-b311-efe44af1d2ad', '05f8fb5a-ce05-438b-8c96-3a1c507f1d69', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 2, 'reps', 15, 45),
	('e1251ddc-f20c-4103-8921-cde541252622', '05f8fb5a-ce05-438b-8c96-3a1c507f1d69', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 2, 'reps', 15, 45),
	('5914bf50-f42c-46b1-99cd-7b3dbaab270a', '48c0b318-30bb-4d20-a1d6-3df1d7bf3bea', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('06c789e3-8ead-4cca-821a-dae6818d2d01', '48c0b318-30bb-4d20-a1d6-3df1d7bf3bea', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 2, 1, 'duration_s', 1800, 120),
	('eb58ecfe-b15e-4ed6-8db8-c11ba7067588', '48c0b318-30bb-4d20-a1d6-3df1d7bf3bea', 'ba15edf2-63a2-442e-b614-a17a949582ff', 3, 3, 'reps', 12, 60),
	('047bdde3-e8b4-42e1-b171-bc22eca7f108', '48c0b318-30bb-4d20-a1d6-3df1d7bf3bea', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 4, 2, 'reps', 15, 45),
	('ec01c10a-7ee1-4b43-b8d4-98814086b8f4', '48c0b318-30bb-4d20-a1d6-3df1d7bf3bea', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 2, 'reps', 15, 45),
	('634bcd5d-c1e5-4eba-b9fc-af0c4c634d23', 'ff80d559-bcba-4dfd-94e4-4576b3a28dc9', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 1, 3, 'reps', 12, 60),
	('200e602e-2869-4026-a0ec-d50e25486c19', 'ff80d559-bcba-4dfd-94e4-4576b3a28dc9', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 2, 3, 'reps', 12, 60),
	('a4a28297-fbcd-4e1b-9283-f5649b51c0dc', 'ff80d559-bcba-4dfd-94e4-4576b3a28dc9', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 3, 2, 'reps', 15, 45),
	('ca769d62-8e50-445f-b6c4-49374b2ab49d', 'ff80d559-bcba-4dfd-94e4-4576b3a28dc9', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 4, 1, 'duration_s', 300, 60),
	('9a4aaab6-7c38-43fa-ac69-408e315c6816', 'c548b4fc-d962-43e7-bca7-2ddeaef80e7e', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('48720b80-9c7d-4049-8962-9d932b5ebf5b', 'c548b4fc-d962-43e7-bca7-2ddeaef80e7e', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 12, 60),
	('c887809e-2833-4382-9b48-8040dab92036', 'c548b4fc-d962-43e7-bca7-2ddeaef80e7e', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 3, 2, 'reps', 15, 45),
	('ea580584-b4ef-4349-be42-e8a47176e93a', 'c548b4fc-d962-43e7-bca7-2ddeaef80e7e', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 4, 1, 'duration_s', 1200, 120),
	('bb7823fd-9ac1-437c-9b8d-a9bc00c31ac2', 'a2cbd940-2eff-40de-aec3-b0a09e7676c2', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 1, 3, 'reps', 12, 60),
	('0b01993a-baa1-4d90-84c0-343abcc258a5', 'a2cbd940-2eff-40de-aec3-b0a09e7676c2', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 2, 3, 'reps', 12, 60),
	('c1063284-2d54-4753-89d7-201d7610f261', 'a2cbd940-2eff-40de-aec3-b0a09e7676c2', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 3, 2, 'reps', 15, 45),
	('a8d0f1d6-2055-4331-9285-7e2e3667aa25', 'a2cbd940-2eff-40de-aec3-b0a09e7676c2', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 4, 1, 'duration_s', 300, 60),
	('aaee56ee-4b18-4588-85ab-8c393d284e3a', '9823a7a3-e6fa-4d9b-85da-e68314ee8801', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('85ef62df-37c2-49b1-aa11-9ed3a45f580c', '9823a7a3-e6fa-4d9b-85da-e68314ee8801', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 12, 60),
	('64c8f1b2-ad93-4c0a-8b00-bd2179a78739', '9823a7a3-e6fa-4d9b-85da-e68314ee8801', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 3, 2, 'reps', 15, 45),
	('3a69f0fb-9772-4752-bfac-06c84ef9d868', '9823a7a3-e6fa-4d9b-85da-e68314ee8801', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 4, 1, 'duration_s', 1200, 120),
	('75a918cd-2fd2-4efd-86f2-e80d30772c23', '6b8974ba-4014-463f-90b3-67e0daeb219c', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 60),
	('aee7667b-ca0b-4ee5-b33f-69c20b75d961', '57af24b9-18d3-4c12-9f49-4424ea60e05b', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 2, 3, 'reps', 12, 60),
	('3220c6a7-98eb-4363-8fbb-6c7693fcfdd7', '57af24b9-18d3-4c12-9f49-4424ea60e05b', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 1, 3, 'reps', 12, 60),
	('a9e52adf-4e46-44e8-819a-2761b04a636b', '57af24b9-18d3-4c12-9f49-4424ea60e05b', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 3, 2, 'reps', 15, 45),
	('fd2096dc-e574-495f-a6b5-bf1e8872e9dc', '57af24b9-18d3-4c12-9f49-4424ea60e05b', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 4, 1, 'duration_s', 300, 60),
	('3a6600d0-242b-45da-b162-c6c39c385261', 'c4a2b88e-e735-4b4f-b0de-2bce0b3b871b', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 75),
	('1048e492-977c-4a35-ade8-a98bfd938f03', 'c4a2b88e-e735-4b4f-b0de-2bce0b3b871b', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 12, 60),
	('722ba1e1-a0a5-4a05-a830-ee36234921c1', 'c4a2b88e-e735-4b4f-b0de-2bce0b3b871b', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 3, 2, 'reps', 15, 45),
	('c0c79111-1c65-4f91-aebc-5e67deab0a2a', 'c4a2b88e-e735-4b4f-b0de-2bce0b3b871b', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 4, 1, 'duration_s', 1200, 120),
	('1ee2b8cd-4a34-4512-b0cc-3ac21e0d3be5', '1cae49c7-ba4c-4f1e-9772-566319aa73a9', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 60),
	('a948a3db-fc27-4b48-ad78-408761701d27', '05e0fd63-5ee1-48b4-9cc6-59302197dc47', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('3aa80e63-78c9-481b-a9e9-3d3b3c722e5d', '05e0fd63-5ee1-48b4-9cc6-59302197dc47', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('4e88d90c-8514-4cb1-b8fc-2dc2270d6e39', '05e0fd63-5ee1-48b4-9cc6-59302197dc47', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('f0598210-f315-439f-9bbc-d145990fe244', '05e0fd63-5ee1-48b4-9cc6-59302197dc47', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('e013509b-1d3f-4cd6-afb3-fa6604661f3d', '05e0fd63-5ee1-48b4-9cc6-59302197dc47', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('1df93670-e7ee-41b1-9292-914eb5d099ad', '05e0fd63-5ee1-48b4-9cc6-59302197dc47', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('c5f36680-d7a7-49e2-9f49-59406c237ca1', '05e0fd63-5ee1-48b4-9cc6-59302197dc47', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 900, 15),
	('d3fcf527-1cd0-4a58-8337-7d71b9c4f5a1', 'd14fd7ba-4b7c-4503-845e-71dbea6484ec', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 12, 60),
	('996f0dd1-08fd-4ea2-a44a-dc67ec703fb8', 'd14fd7ba-4b7c-4503-845e-71dbea6484ec', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 12, 60),
	('3eb6b755-c5c4-4e59-ad51-6271163c66b3', 'd14fd7ba-4b7c-4503-845e-71dbea6484ec', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('74b56fc1-a81f-486e-bee6-3298600d6147', 'd14fd7ba-4b7c-4503-845e-71dbea6484ec', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('38f9e5c8-4122-4e5c-bc6e-9ca18c53b578', 'd14fd7ba-4b7c-4503-845e-71dbea6484ec', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 15, 45),
	('d6d9cffd-3a42-49e4-b81a-c279e1a2ec2d', 'd14fd7ba-4b7c-4503-845e-71dbea6484ec', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 6, 3, 'reps', 15, 45),
	('3ec01b6c-18c8-412c-a9ed-1fe0cce3fb6b', 'd14fd7ba-4b7c-4503-845e-71dbea6484ec', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 960, 15),
	('67507327-09ec-4374-9716-8dc09a7c61c3', '0102ea7c-fa7c-494b-970b-e19d8c754ea5', '5f2b797a-c569-4312-b781-e67070f227f2', 1, 3, 'reps', 10, 60),
	('af89c923-6c18-4ae2-9be2-afe14cabfb11', '0102ea7c-fa7c-494b-970b-e19d8c754ea5', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 15, 60),
	('78696750-55f0-46aa-9c45-6db858492ea3', '0102ea7c-fa7c-494b-970b-e19d8c754ea5', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('e4212555-db52-4944-9260-ebbf62675a3d', '0102ea7c-fa7c-494b-970b-e19d8c754ea5', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('c47fae12-f577-4df3-a8a8-e9bddc4e0606', '0102ea7c-fa7c-494b-970b-e19d8c754ea5', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('c92b66dd-2f66-42c7-922a-7b4d88309e76', '0102ea7c-fa7c-494b-970b-e19d8c754ea5', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('aba3fe54-c900-4788-9c5f-d94ec3b07865', '0102ea7c-fa7c-494b-970b-e19d8c754ea5', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 1020, 15),
	('f090135f-6e2d-4e2f-928b-64114c6c71a3', '0890c9bf-7d49-49d6-9a5f-db61591432a5', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('26046375-47e1-48ca-a972-dfcea935b56f', '0890c9bf-7d49-49d6-9a5f-db61591432a5', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('8e4121bf-329a-45c5-95ea-2d32aa0463c2', '0890c9bf-7d49-49d6-9a5f-db61591432a5', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('1d3f0aea-3f6c-4901-a471-e419db73ce23', '0890c9bf-7d49-49d6-9a5f-db61591432a5', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('d78bab71-665c-43c7-8b3e-2e413fda86aa', '0890c9bf-7d49-49d6-9a5f-db61591432a5', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('c95bae58-94c8-4691-bf65-785a2dacdf86', '0890c9bf-7d49-49d6-9a5f-db61591432a5', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('47c1ba70-d7c3-45cb-aa91-faa55cd53bb1', '0890c9bf-7d49-49d6-9a5f-db61591432a5', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 900, 15),
	('06622441-ded7-4113-a1b8-8bee53cacd0d', 'e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 12, 60),
	('2444a683-82e9-4e76-8a43-cfdc3a89de8c', 'e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 12, 60),
	('47458499-6eb5-408f-bdb1-059195d17736', 'e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('3e3687b0-7ff4-45e4-9f54-e2ec9ad638ba', 'e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('24a5aa0f-a404-454f-b7ad-e5bef6e1cc68', 'e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 15, 45),
	('bf7bc9ce-f8b7-4367-889c-64c1179e6418', 'e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 6, 3, 'reps', 15, 45),
	('e2fd8741-dfd5-4a9f-8542-bc975badf085', 'e6b489cb-7edf-4cc1-ae14-68ec7a1ac4be', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 960, 15),
	('b4bd058d-f6ed-4b13-bc3f-b9951866fff1', '999173c9-be0b-4492-91db-dfa0ea5d7a1a', '5f2b797a-c569-4312-b781-e67070f227f2', 1, 3, 'reps', 10, 60),
	('1de04bee-d643-4c2e-a185-de3ff301ef19', '999173c9-be0b-4492-91db-dfa0ea5d7a1a', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 15, 60),
	('b0d6f75f-fd92-4541-a0af-309fca498eb5', '999173c9-be0b-4492-91db-dfa0ea5d7a1a', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('3d6623f9-5218-45da-bfd1-871dc139405c', '999173c9-be0b-4492-91db-dfa0ea5d7a1a', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('6d3b61ee-50a7-496b-b4fb-36516e5f66b4', '999173c9-be0b-4492-91db-dfa0ea5d7a1a', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('e8f6b5c4-9318-467a-9038-eecac52d74dd', '999173c9-be0b-4492-91db-dfa0ea5d7a1a', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('e5d6ced1-9990-4c26-8ea7-69329b94e473', '999173c9-be0b-4492-91db-dfa0ea5d7a1a', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 1020, 15),
	('4da027fd-0303-432b-9edd-6c8e4e5eb9e9', '0cf0e67b-3328-4151-8cd5-ee7031840600', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1200, 60),
	('98fb1ef7-ff38-46f5-859f-253f3634e9c3', '3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 60),
	('8e5480bb-703c-4c25-a022-90ab97d5fc01', '3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 60),
	('311836b0-13e6-4e92-b2a1-e64616e26b00', '3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('f3417926-c622-4931-a143-93de5b5927e4', '3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('1cf58ef5-624a-4454-8fb2-2e46017ef01d', '3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('756816cd-cb01-4934-9c37-4231036b7f0a', '3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('c7c45f52-64eb-4b8d-92c8-10bb5ff9412c', '3ec00c6b-a8f3-40a9-8c15-a827b9545e6f', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 900, 15),
	('e4b00c9c-3e4e-4516-bea4-8d925d676ac5', '9a8b98b0-bc50-42d9-819f-e0543dd5634d', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 12, 60),
	('2d959a95-4b76-405a-afba-c367c663d307', '9a8b98b0-bc50-42d9-819f-e0543dd5634d', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 12, 60),
	('94a389eb-6577-4be4-8921-5072ef109068', '9a8b98b0-bc50-42d9-819f-e0543dd5634d', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('ff5b712b-23cc-47c2-b870-23e72a5af8dc', '9a8b98b0-bc50-42d9-819f-e0543dd5634d', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('4a46b6db-976f-4cd6-95ea-111cf07115d6', '9a8b98b0-bc50-42d9-819f-e0543dd5634d', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 15, 45),
	('930f2d6c-1f96-4c9c-a236-80663eb5ab1f', '9a8b98b0-bc50-42d9-819f-e0543dd5634d', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 6, 3, 'reps', 15, 45),
	('7449032a-9f31-402b-b3be-e8a21d5a762e', '9a8b98b0-bc50-42d9-819f-e0543dd5634d', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 960, 15),
	('300ba65f-e8ea-4ca6-b453-3edad2dd4505', '2ad31611-cd8b-44a0-a660-41182a1fa12f', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1200, 60),
	('155b5c83-27f3-4a26-a822-4ba94bbf2ae8', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', '5f2b797a-c569-4312-b781-e67070f227f2', 1, 3, 'reps', 10, 60),
	('54715655-95d6-4db6-a8ed-666ee546a5c7', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 15, 60),
	('6a1fbf0f-9c5b-4314-9819-2ec782c2723e', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 60),
	('832320e5-866e-4a97-a47a-99677dac0aa0', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 60),
	('2a3694ff-8495-4832-aced-d7b1a3dc50e4', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('1a73ac97-7117-4ff3-9a9f-c6ad0556de66', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', '42be1efa-682d-4a40-9567-479b6ce69dbb', 6, 3, 'reps', 15, 45),
	('e1938e80-fb05-4385-b1a8-3eb97354405c', '3ff3b198-3894-42ec-b9a5-af7981aa5a71', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 7, 1, 'duration_s', 1020, 15),
	('62c177c2-04c6-4550-b1f8-1f7513aaa237', 'a084c4f6-879b-4d67-babb-724c9f22f0f1', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1500, 60),
	('a0fcaf96-3143-4c6c-a487-df63f194bd81', '8855571c-ea92-4511-9c9f-3bf6ab854ba9', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 45),
	('37d7e1d1-6113-4017-8508-ab032f0a83c8', '8855571c-ea92-4511-9c9f-3bf6ab854ba9', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 2, 3, 'reps', 15, 45),
	('6e4fc1ee-aaf9-44ab-96bb-ae0447737795', '8855571c-ea92-4511-9c9f-3bf6ab854ba9', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 3, 3, 'reps', 15, 45),
	('74e6f38c-a000-455d-8d95-526c8dc84780', '8855571c-ea92-4511-9c9f-3bf6ab854ba9', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 45),
	('2816fa67-9442-411e-801b-0b4fb831b167', '8855571c-ea92-4511-9c9f-3bf6ab854ba9', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 5, 1, 'duration_s', 600, 15),
	('6e894e55-847c-4bea-aa25-c06f65d0d550', '35647c73-5455-4d53-9ea2-45615cd0473a', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 45),
	('fe78909c-9a07-4370-87c9-7261ddb42f87', '35647c73-5455-4d53-9ea2-45615cd0473a', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 15, 45),
	('680696f1-f981-4e55-8661-b0daa305fba2', '35647c73-5455-4d53-9ea2-45615cd0473a', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 3, 3, 'reps', 15, 45),
	('d7e3b51d-fbcc-4339-bf27-dae51cef06c3', '35647c73-5455-4d53-9ea2-45615cd0473a', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 4, 3, 'reps', 12, 45),
	('433718b7-5025-4d38-8842-992767484aec', '35647c73-5455-4d53-9ea2-45615cd0473a', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 5, 1, 'duration_s', 600, 15),
	('0c44b28d-e8ce-458f-9794-5a22b5429de4', '5189eb38-0d73-4540-862c-25f3c757004b', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 1, 3, 'reps', 15, 45),
	('242af147-8037-4eee-9688-35f962a3d851', '5189eb38-0d73-4540-862c-25f3c757004b', '42be1efa-682d-4a40-9567-479b6ce69dbb', 2, 3, 'reps', 15, 45),
	('0179c343-adbe-4d2d-81a1-33e7c9e249ad', '5189eb38-0d73-4540-862c-25f3c757004b', 'ba15edf2-63a2-442e-b614-a17a949582ff', 3, 3, 'reps', 15, 45),
	('95082a44-341b-4829-8893-dca40035896e', '5189eb38-0d73-4540-862c-25f3c757004b', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 45),
	('48b02970-dbb3-42a2-a7a3-908e297423c0', '5189eb38-0d73-4540-862c-25f3c757004b', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 5, 1, 'duration_s', 600, 15),
	('eb2f6156-928f-4cde-a139-07b88870f69e', '3be9a764-c313-4ce3-8177-1f0b16f92f0b', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 45),
	('cbad847b-2388-4c5a-b9f8-75958e2f6d8b', '3be9a764-c313-4ce3-8177-1f0b16f92f0b', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 45),
	('6339c59e-8e28-42b2-9a3e-f3f4388ed958', '3be9a764-c313-4ce3-8177-1f0b16f92f0b', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 45),
	('67656660-6ea3-4ba3-bd17-dfa4646d33a3', '3be9a764-c313-4ce3-8177-1f0b16f92f0b', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 45),
	('773a66b7-c6b0-4471-8520-cc46906dedd1', '3be9a764-c313-4ce3-8177-1f0b16f92f0b', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('09b3f8e4-b09f-482c-a99f-3f46076d41f0', 'c5a4c677-6e2e-4d53-8d3e-c98436f82192', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('fc90cea3-2cfa-4e24-89ea-d1c462a8d362', 'c5a4c677-6e2e-4d53-8d3e-c98436f82192', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 15, 45),
	('ea1e054c-a833-41c4-bcf5-770afb80c5a4', 'c5a4c677-6e2e-4d53-8d3e-c98436f82192', '42be1efa-682d-4a40-9567-479b6ce69dbb', 3, 3, 'reps', 15, 45),
	('56f13729-59f3-404f-8bbd-926a58aa7136', '4a490252-0fe5-44fd-ae83-dbf9899ae2cc', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 15, 45),
	('208521a9-0de8-4623-9ca6-327f170a0bf0', '4a490252-0fe5-44fd-ae83-dbf9899ae2cc', 'd7c9b705-bff7-4851-863d-0c326387e06e', 2, 3, 'reps', 15, 45),
	('902ccb31-e743-4945-88cc-595468d1506e', '4a490252-0fe5-44fd-ae83-dbf9899ae2cc', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 45),
	('8f9ee764-dbed-4773-b3de-caf887ad9b57', '4a490252-0fe5-44fd-ae83-dbf9899ae2cc', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 45),
	('2910a147-7192-4cd5-a615-c9417d1bb8aa', '4a490252-0fe5-44fd-ae83-dbf9899ae2cc', '92ffbb4c-4909-4952-a8df-5d724164572a', 5, 3, 'reps', 15, 45),
	('3083f8d1-2638-4778-884a-da1e1610ffd3', '8142b210-2a10-4e41-8557-adc3e1f4e717', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('243e7bcd-249b-4eb7-980f-ad7f6bcc5168', '8142b210-2a10-4e41-8557-adc3e1f4e717', 'ba15edf2-63a2-442e-b614-a17a949582ff', 2, 3, 'reps', 15, 45),
	('a1b053d8-8a3d-4435-a7f9-8dbb9f707128', '8142b210-2a10-4e41-8557-adc3e1f4e717', 'daf92e2f-878f-441e-9f5e-9e5d75f142f7', 3, 3, 'reps', 15, 45),
	('8bb53b15-3801-4109-96b4-bd850150abe2', '6124cf87-b433-494f-9127-c3168eed456f', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 45),
	('dfa883ad-9b95-472f-90c8-b2a1bfd15a6b', '6124cf87-b433-494f-9127-c3168eed456f', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 45),
	('c2cc49bd-da8c-4f3e-a37b-dba7fa27443a', '6124cf87-b433-494f-9127-c3168eed456f', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 45),
	('c07a499f-2157-4bae-8435-a2e9f9da532e', '6124cf87-b433-494f-9127-c3168eed456f', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 12, 45),
	('fe4af554-b9b2-436a-ae4d-c38af4216a9a', '6124cf87-b433-494f-9127-c3168eed456f', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('1465ff28-aab6-4285-aed9-dee645a120b9', '952c09a9-01c6-45f3-a07f-0399a50d9334', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('b1768a30-b50f-42e3-9602-db8a892f16a1', '952c09a9-01c6-45f3-a07f-0399a50d9334', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 15, 45),
	('a618608f-29a4-4003-8314-8abfece6a63a', '952c09a9-01c6-45f3-a07f-0399a50d9334', '42be1efa-682d-4a40-9567-479b6ce69dbb', 3, 3, 'reps', 15, 45),
	('76396f71-4cdc-4279-9ff2-24a6039aded8', 'ba6f4fdd-3cdf-49a1-9c36-c308392bfadd', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('0f5ee39c-0b9a-4dd1-82d9-191160803426', '8a765969-435c-41c7-8997-212781c8bbb7', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 45),
	('dfa43b40-e314-429c-85cf-bbe7837a8475', '8a765969-435c-41c7-8997-212781c8bbb7', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 45),
	('5ab15353-32fd-4a80-83ec-c8c0ff29072c', '8a765969-435c-41c7-8997-212781c8bbb7', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 45),
	('4e8088a8-6a07-4a98-8451-eac81ecae172', '8a765969-435c-41c7-8997-212781c8bbb7', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 15, 45),
	('20c6571b-b88d-4e7e-8aff-2013787e4b1d', '8a765969-435c-41c7-8997-212781c8bbb7', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('a6580855-7551-48b5-b52e-eb20bfcf62f5', 'f63d2597-8ca1-491a-8f13-37f7ae90cad1', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('d8c4f4e6-cc3e-449e-888b-0806e323b1a1', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', 'ff7805a3-3914-47c8-abb3-4f8aefadf0e9', 1, 3, 'reps', 15, 45),
	('30ca3481-45f3-4757-b27d-a2adbc37dbc9', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', 'b1f56dbd-240c-42f2-a157-5e678fdb136d', 2, 3, 'reps', 15, 45),
	('16093dae-b0e5-4f71-a26e-b0c4a4489441', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 45),
	('81f7c197-1bfd-4926-93d2-9887338883bb', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 15, 45),
	('df6fd1f8-8ae6-42bc-bd4b-24a42088579e', 'ad9f3d78-23bd-41a6-960c-8cced3d385a4', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('07c028dc-3fd4-473f-a510-8009a7210813', '7f479145-c109-4788-9ce7-d4cd804c9da0', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('bc196920-b5f6-49e0-ad74-98f36a38ccc2', '6f827ffa-37be-4370-adf6-41aa52405ad4', 'ec516eb8-38c4-404f-889a-a8fc566fa49a', 1, 3, 'reps', 15, 45),
	('a06c4f32-16ba-4034-8425-9e656b6d8a03', '6f827ffa-37be-4370-adf6-41aa52405ad4', '699010b2-a7a4-4a1c-950e-cbb004bbeaea', 2, 3, 'reps', 15, 45),
	('234a210c-bc82-45f0-a625-5db6d5c6bab3', '6f827ffa-37be-4370-adf6-41aa52405ad4', '1dade505-a3c8-454f-a0e4-3af73e7fd281', 3, 3, 'reps', 15, 45),
	('1096ee87-0021-443e-a15b-af4a19f54d6f', '6f827ffa-37be-4370-adf6-41aa52405ad4', '141b54ea-d908-4129-8a94-2e4e02dfdcde', 4, 3, 'reps', 15, 45),
	('69aafcab-7520-4896-bfcc-f6d43f364900', '6f827ffa-37be-4370-adf6-41aa52405ad4', 'a7dbdfa5-d846-4211-aa6b-a0491c23e779', 5, 3, 'reps', 15, 45),
	('1c38e715-1573-4b39-ad15-090901912547', '04776de4-932d-4a40-9e8e-c7bab2082fa6', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1800, 15),
	('9f37b49a-7bb8-4bdc-9fcf-7f1d1aa09c7d', '8f6de638-7b76-4ffe-af5f-30f317d76bd8', 'ac826afe-d309-4780-8f1e-abcf9905a41a', 1, 1, 'duration_s', 1200, 15);


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("id", "author_id", "workout_id", "body", "created_at") VALUES
	('e0138c00-1434-47d2-8275-7534174df1dd', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '024c83e3-04b5-4657-b804-36c48429687b', 'I feel good in this exercise ', '2025-11-25 15:35:25.073132+00'),
	('b99c549f-dd4a-421b-b8ed-ec53665ddc7a', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', NULL, 'I have functional sessions today', '2025-11-28 10:32:18.009419+00'),
	('fce040e9-7395-49af-a123-c230a75478a1', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', NULL, 'i am tired today', '2025-11-28 10:55:51.531445+00'),
	('2568706a-5573-4daa-9a95-a704261ce823', '08fd1fc2-93a0-493a-9e52-9a25978ef252', NULL, 'i''m happy', '2025-11-28 16:05:12.437249+00'),
	('c359e3ac-469e-423a-81fa-dc1d1f1f9d77', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', NULL, 'i''m new here, happy to meet you!', '2025-12-05 09:29:02.34553+00');


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_achievements" ("id", "user_id", "achievement_id", "progress", "unlocked_at", "updated_at") VALUES
	('4137cb9b-a9f5-4af9-94a2-136d8d5503b5', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '5ba1edaf-3d28-41d5-9dda-e2112cf81116', 100, '2025-11-21 09:50:04.796065+00', '2025-11-21 09:50:04.796065+00'),
	('ebfc2a1e-a1a9-4212-97e0-287a42011265', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '5ba1edaf-3d28-41d5-9dda-e2112cf81116', 100, '2025-11-21 09:50:19.775562+00', '2025-11-21 09:50:19.775562+00'),
	('7b487611-185d-4dd9-aea5-2ea778f3c4ed', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', '2d23605a-8a9c-4edb-a087-325b284f5961', 100, '2025-11-16 15:53:34.409323+00', '2025-11-21 15:53:34.409323+00'),
	('67d6fae4-a5ee-491c-8615-e85167378a6f', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '254d86a1-807f-4838-83f7-a9940ae2e6fc', 100, '2025-11-21 09:50:04.796065+00', '2025-11-21 09:50:04.796065+00'),
	('73b77b58-6c19-4245-b2f8-691dbf97e405', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '27591905-422c-4b11-bcf2-fb58497c53a3', 100, '2025-11-21 09:50:04.796065+00', '2025-11-21 09:50:04.796065+00'),
	('791910ac-007d-4186-86d3-0b4f19bafc49', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '44b6819d-3765-4e24-a9e9-1ff0f1e4e6df', 100, '2025-11-21 09:44:01.317704+00', '2025-11-21 09:44:01.317704+00'),
	('cbaa13f9-87e7-4c7c-8d55-c8d45863cbe6', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '6e277e46-fb2c-4460-9afa-1a11417aec7e', 100, '2025-11-21 09:50:19.775562+00', '2025-11-21 09:50:19.775562+00'),
	('ef6d9aff-e3b2-45b3-a39f-dcb2faf0abbd', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', '1043a035-3f56-46ff-8a4e-592c7fdeaaa3', 100, '2025-11-21 09:50:19.775562+00', '2025-11-21 09:50:19.775562+00'),
	('12779282-3a4f-479d-8cdc-a5c693dbfb47', '79c75d1a-1368-42f5-a220-f7ca3f595de8', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-11-27 21:24:35.225+00', '2025-11-27 21:24:35.340805+00'),
	('e1de4c3c-dd4e-4ffb-893f-7977ee498d94', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-11-28 13:04:26.882+00', '2025-11-28 13:04:26.950307+00'),
	('808d1c81-a7ad-4956-92eb-1f0ecc0fdd36', 'bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-11-28 13:06:03.357+00', '2025-11-28 13:06:03.417884+00'),
	('021a4fc2-ad07-4b99-a464-47105ba8e786', 'ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-11-28 13:21:29.346+00', '2025-11-28 13:21:29.397711+00'),
	('42781fac-12e8-4d21-b6b9-c0044677c417', '01a9b209-3d59-4a94-8493-7f087d483121', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-11-28 15:09:14.973+00', '2025-11-28 15:09:15.052239+00'),
	('802f5d7d-9b66-4bc0-bb1f-0e48aa03f2e1', '08fd1fc2-93a0-493a-9e52-9a25978ef252', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-11-28 15:35:33.561+00', '2025-11-28 15:35:32.827527+00'),
	('60602309-aa8f-4386-8de0-22bfd29cc5ab', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'a6b68dab-e206-48da-9caf-d3629e781d27', NULL, '2025-12-03 20:03:17.541+00', '2025-12-03 20:03:17.636715+00'),
	('fefc8095-5166-4b92-be2d-1db931872f5c', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', '41860f68-c33b-492a-beee-5908e41e91b0', NULL, '2025-12-03 20:03:17.541+00', '2025-12-03 20:03:17.636715+00'),
	('ed110c9c-f36c-4a33-a17e-643e933cf2fa', '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'bd74b71d-1811-4ecd-bf5e-6fafaa47b20c', NULL, '2025-12-03 20:03:17.541+00', '2025-12-03 20:03:17.636715+00'),
	('338bb3f1-1921-40a2-ac5f-ffe79cee3e0a', '5864c8e3-bd82-4959-adb4-29b57bb30421', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-12-04 15:36:24.335+00', '2025-12-04 15:36:24.423284+00'),
	('e1500a02-7841-4dd7-8f4c-63cf59bdee0f', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-12-04 20:13:38.294+00', '2025-12-04 20:13:38.435089+00'),
	('6367f6a3-bbbb-45fc-90ea-3d32093c151a', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'a6b68dab-e206-48da-9caf-d3629e781d27', NULL, '2025-12-04 20:37:12.251+00', '2025-12-04 20:37:12.332345+00'),
	('4935e4c9-992b-4c2d-8bcd-b56b3d45a386', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '41860f68-c33b-492a-beee-5908e41e91b0', NULL, '2025-12-04 20:37:12.251+00', '2025-12-04 20:37:12.332345+00'),
	('1b3eda15-ca65-48ed-8f58-a31664586970', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'bd74b71d-1811-4ecd-bf5e-6fafaa47b20c', NULL, '2025-12-04 20:37:12.251+00', '2025-12-04 20:37:12.332345+00'),
	('3d58b0cd-5559-4e03-b2e4-53cb58778511', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', '44b6819d-3765-4e24-a9e9-1ff0f1e4e6df', NULL, '2025-12-05 08:17:57.315+00', '2025-12-05 08:17:57.379596+00'),
	('54c73714-4732-45c2-b564-9f2d81347539', 'f79e800e-7b3a-4a7c-bc98-03d60850632e', 'e90f0d80-4765-481d-ac83-9f8f2c63a742', NULL, '2025-12-05 08:17:57.315+00', '2025-12-05 08:17:57.379596+00'),
	('d663781c-63fe-489d-b1e5-d309244bad39', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'dcb51a97-fcbe-429c-941d-081db82edce6', NULL, '2025-12-05 09:27:51.688+00', '2025-12-05 09:27:49.334994+00'),
	('10ed5dbe-5b74-4aef-9ed7-26cc1ae41508', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'bd74b71d-1811-4ecd-bf5e-6fafaa47b20c', NULL, '2025-12-05 09:32:58.706+00', '2025-12-05 09:32:56.334315+00'),
	('00a094c7-0a34-4d3b-b28c-a9deed1d6c1a', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'a6b68dab-e206-48da-9caf-d3629e781d27', NULL, '2025-12-05 09:33:37.725+00', '2025-12-05 09:33:35.356884+00'),
	('cfc810e5-ee04-483e-984a-08f0ac087d14', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', '41860f68-c33b-492a-beee-5908e41e91b0', NULL, '2025-12-05 09:33:37.725+00', '2025-12-05 09:33:35.356884+00');


--
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_info" ("user_id", "preferred_name", "gender", "height_cm", "weight_kg", "primary_goal", "training_days_per_week", "available_days", "session_duration", "problem_areas", "preferred_split", "gym_comfort_level", "created_at", "updated_at", "experience_level", "trainer", "bmi") VALUES
	('c0a22be5-21c1-443f-b3b8-44c8ca924d7d', NULL, NULL, NULL, NULL, NULL, NULL, '{}', 60, NULL, NULL, NULL, '2025-11-14 12:54:47.588583+00', NULL, NULL, NULL, NULL),
	('0808f6e9-b334-4bc4-9426-b4f10053e64b', 'tp1', 'non_binary', 170.00, 100.00, '{strength}', 2, '{2,5}', 60, '{knees}', '{push_pull_legs}', '{distressed}', '2025-11-21 11:19:57.509643+00', '2025-11-21 11:20:44.526+00', 1, false, NULL),
	('ecbb8a6e-b9fc-40e1-b1f8-206652b85220', 'test_metric', 'non_binary', 11.00, 11.00, '{endurance}', 3, '{4,3,2}', 60, '{knees,lower-back}', '{push_pull_legs,upper_lower}', '{excited}', '2025-11-14 13:40:36.78208+00', '2025-11-14 13:41:35.71+00', 1, true, NULL),
	('a2c1791c-4557-4dff-b0d3-90c6f7b7b854', 'kunkun', 'female', 111.00, 111.00, '{fat_loss}', 3, '{1}', 60, '{lower-back}', '{dont_know}', '{interested}', '2025-11-14 13:04:18.067359+00', '2025-11-14 13:08:41.542+00', 0, false, NULL),
	('594aa3b7-2bdc-4dce-b66d-f1eca40e0dff', 'usersetting', 'prefer_not_to_say', 111.00, 503.94, '{general_fitness}', 2, '{0}', 60, '{knees}', '{dont_know}', '{excited}', '2025-11-14 15:51:54.85136+00', '2025-11-14 15:52:40.663+00', 1, false, NULL),
	('7637bd9a-3e3d-4a2c-968f-b6d4c8bf7487', 'a', 'prefer_not_to_say', 2.00, 2.00, '{mobility}', 4, '{0,2,4,5}', 60, '{knees,lower-back}', '{push_pull_legs}', '{upset}', '2025-11-21 08:39:50.547504+00', '2025-11-21 08:41:27.749+00', 2, true, NULL),
	('3aab63d0-d835-4952-a3b6-ee298f1fcddb', 'test_prompt', 'non_binary', 1.00, 1.00, '{endurance}', 3, '{2}', 60, '{knees,lower-back}', '{push_pull_legs,upper_lower}', '{excited}', '2025-11-21 09:50:52.299752+00', '2025-11-21 09:53:25.626+00', 1, false, NULL),
	('816ba532-bd15-40f0-b583-23ac5a0f8eda', 'test_prompt1', 'non_binary', 1.00, 1.00, '{endurance}', 3, '{3,2,4}', 60, '{knees,lower-back}', '{push_pull_legs,upper_lower}', '{distressed,nervous}', '2025-11-21 09:58:18.346705+00', '2025-11-21 09:59:06.214+00', 2, false, NULL),
	('7bf8d192-0cdd-4fd1-9d9c-b96b0dbffb20', 'test_prompt2', 'non_binary', 170.00, 100.00, '{fat_loss}', 3, '{3,2,5}', 60, '{lower-back}', '{full_body}', '{distressed}', '2025-11-21 10:01:55.361284+00', '2025-11-21 10:02:43.352+00', 1, false, NULL),
	('c2c63fc4-10f5-426c-90c9-a0bc5122fd40', 'test_prompt3', 'non_binary', 170.00, 100.00, '{fat_loss}', 3, '{3,2,5}', 60, '{knees,lower-back}', '{upper_lower}', '{distressed}', '2025-11-21 10:06:27.030316+00', '2025-11-21 10:07:26.636+00', 1, false, NULL),
	('ae8bbbc5-5702-43ce-9207-fb19338bba26', 'test_prompt4', 'non_binary', 170.00, 100.00, '{fat_loss}', 4, '{4,2,3,5}', 60, '{knees}', '{upper_lower,full_body}', '{distressed}', '2025-11-21 10:15:17.257117+00', '2025-11-21 10:16:08.208+00', 1, false, NULL),
	('5930fb75-e550-4f74-a9a1-f5021b043bd0', 'test_prompt5', 'prefer_not_to_say', 170.00, 100.00, '{fat_loss}', 3, '{3,2,1}', 60, '{knees}', '{upper_lower}', '{nervous}', '2025-11-21 10:19:13.127445+00', '2025-11-21 10:20:05.37+00', 1, false, NULL),
	('b7e14e5c-4fa4-4637-aeae-e446ba4c8f16', 'test_prompt5', 'prefer_not_to_say', 170.00, 100.00, '{fat_loss}', 3, '{3,2,5}', 60, '{knees}', '{upper_lower}', '{distressed}', '2025-11-21 10:28:41.259895+00', '2025-11-21 10:29:46.104+00', 1, false, NULL),
	('bbecdbf3-30ca-4ecf-938a-392cf8c49746', 'test_promt6', 'prefer_not_to_say', 170.00, 100.00, '{endurance}', 2, '{4,3}', 60, '{knees,lower-back}', '{upper_lower,push_pull_legs}', '{distressed}', '2025-11-21 10:37:26.877136+00', '2025-11-21 10:38:17.226+00', 1, false, NULL),
	('5dde6ffc-9cc7-4aac-84e9-d8ef5e1d59f1', 'test_prompt7', 'prefer_not_to_say', 170.00, 100.00, '{endurance}', 3, '{4,3}', 60, '{none}', '{upper_lower}', '{distressed}', '2025-11-21 10:41:36.515642+00', '2025-11-21 10:42:12.808+00', 1, false, NULL),
	('62639616-db0c-4d5c-8af1-d5302ad72ff7', 'test_prompt8', 'prefer_not_to_say', 170.00, 100.00, '{strength}', 2, '{4,3}', 60, '{knees}', '{push_pull_legs}', '{distressed}', '2025-11-21 10:58:10.136906+00', '2025-11-21 11:02:19.181+00', 1, false, NULL),
	('659fa1f0-6ef8-4faa-b631-dd0a22e8f7c8', 'test_promt9', 'non_binary', 170.00, 100.00, '{strength}', 1, '{6}', 60, '{none}', '{upper_lower}', '{distressed}', '2025-11-21 11:03:26.571576+00', '2025-11-21 11:05:47.975+00', 2, false, NULL),
	('cf956115-3675-48cf-bc85-1f0a41ece72f', 'ttt', 'prefer_not_to_say', 170.00, 100.00, '{endurance}', 2, '{3,2}', 60, '{knees}', '{upper_lower}', '{distressed}', '2025-11-21 12:39:08.554817+00', '2025-11-21 12:49:06.707+00', 1, false, NULL),
	('283656cf-5bcc-4876-93db-f6b5a68b7f34', 'newt', 'non_binary', 170.00, 50.00, '{strength}', 2, '{2,4}', 60, '{knees}', '{upper_lower}', NULL, '2025-11-21 13:25:51.545407+00', '2025-11-21 13:27:08.651+00', 1, false, NULL),
	('39c071d7-5f34-4a97-82e3-2da006e1da0e', 'ttt', 'non_binary', 170.00, 100.00, '{strength}', 2, '{2,4}', 60, '{knees}', '{upper_lower}', '{distressed}', '2025-11-21 15:09:37.04316+00', '2025-11-21 15:10:40.42+00', 1, false, NULL),
	('6a1e592d-b516-41ad-90fc-d242351efac7', 'achieve', 'prefer_not_to_say', 170.00, 50.00, '{endurance}', 2, '{2,3}', 60, '{knees}', '{dont_know}', '{nervous}', '2025-11-27 21:10:38.793635+00', '2025-11-27 21:11:59.206+00', 1, false, NULL),
	('6305efaf-d559-48f4-a655-b4334636ab5a', 'tachieve2', 'non_binary', 100.00, 50.00, '{strength}', 3, '{2,4,5}', 60, '{lower-back}', '{upper_lower}', '{nervous}', '2025-11-27 21:17:04.581782+00', '2025-11-27 21:17:48.505+00', 1, false, NULL),
	('ce77b9d3-0613-4e9b-8aa0-0582550ddcd7', 'tachieve3', 'prefer_not_to_say', 170.00, 50.00, '{endurance}', 2, '{3,4}', 60, '{lower-back}', '{upper_lower}', '{nervous}', '2025-11-27 21:19:15.743509+00', '2025-11-27 21:20:06.329+00', 1, false, NULL),
	('79c75d1a-1368-42f5-a220-f7ca3f595de8', 'tchaieve4', 'prefer_not_to_say', 170.00, 50.00, '{endurance}', 2, '{2,3}', 60, '{lower-back}', '{upper_lower}', '{nervous}', '2025-11-27 21:23:16.966786+00', '2025-11-27 21:24:30.296+00', 1, false, NULL),
	('7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'reft1', 'prefer_not_to_say', 100.00, 50.00, '{endurance}', 2, '{2,3}', 60, '{lower-back}', '{upper_lower}', '{scared}', '2025-11-28 12:58:17.87495+00', '2025-11-28 13:04:22.291+00', 1, false, NULL),
	('bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', 'reft2', 'prefer_not_to_say', 170.00, 50.00, '{mobility}', 2, '{3,5}', 60, '{knees}', '{dont_know,full_body}', '{ashamed,inspired}', '2025-11-28 13:05:14.19412+00', '2025-11-28 13:05:59.827+00', 1, false, NULL),
	('ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', 'reft3', 'non_binary', 170.00, 50.00, '{strength}', 2, '{2,3,4}', 60, '{knees}', '{upper_lower}', '{inspired,guilty}', '2025-11-28 13:20:44.145871+00', '2025-11-28 13:21:24.862+00', 1, false, NULL),
	('01a9b209-3d59-4a94-8493-7f087d483121', 'reft5', 'prefer_not_to_say', 170.00, 50.00, '{strength}', 3, '{4,5,3}', 60, '{knees}', '{upper_lower}', '{inspired,strong}', '2025-11-28 15:08:27.774588+00', '2025-11-28 15:09:07.343+00', 2, false, NULL),
	('08fd1fc2-93a0-493a-9e52-9a25978ef252', '11', 'female', 165.00, 50.00, '{fat_loss}', 1, '{0}', 60, '{shoulders}', '{dont_know}', '{interested}', '2025-11-28 15:34:43.935489+00', '2025-11-28 15:35:28.102+00', 1, false, NULL),
	('5864c8e3-bd82-4959-adb4-29b57bb30421', 'wokt', 'prefer_not_to_say', 170.00, 55.00, '{endurance}', 2, '{0,2}', 60, '{lower-back,knees}', '{upper_lower}', '{nervous,guilty}', '2025-12-04 15:35:04.903234+00', '2025-12-04 15:36:16.956+00', 1, false, NULL),
	('f79e800e-7b3a-4a7c-bc98-03d60850632e', 'wokt1', 'prefer_not_to_say', 170.00, 55.00, '{endurance}', 3, '{1,3,5}', 60, '{knees}', '{full_body}', '{determined}', '2025-12-04 20:12:48.125485+00', '2025-12-04 20:13:32.685+00', 1, false, NULL),
	('7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'charlotte', 'female', 165.00, 54.00, '{general_fitness}', 5, '{1,5,6,3,0}', 60, '{knees}', '{full_body}', NULL, '2025-11-14 10:36:34.698014+00', '2025-12-05 08:28:05.395+00', 2, true, 19.834710743801654),
	('b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'backend_test', 'female', 165.00, 56.00, '{fat_loss}', 7, '{1,0,5,3,2,4,6}', 60, '{knees}', '{dont_know}', '{strong}', '2025-12-05 09:26:13.028741+00', '2025-12-05 09:44:41.231+00', 1, false, 20.569329660238754);


--
-- Data for Name: user_progress_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_progress_history" ("id", "user_id", "data_type", "value", "recorded_at", "created_at") VALUES
	('9247e9f7-952b-4047-a97d-f16b8e6fc47c', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'bmi', 20, '2025-12-02 15:43:16+00', '2025-12-04 15:43:23.263504+00'),
	('5ac13e71-f2ef-4fd2-872d-effa0c33295b', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'weight', 58, '2025-12-04 15:43:48.127+00', '2025-12-04 15:43:48.971643+00'),
	('8b1e6355-d490-4ee9-9e81-ca4a4e516dfd', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'bmi', 21.30394857667585, '2025-12-04 15:43:48.127+00', '2025-12-04 15:43:49.057034+00'),
	('b65fa15a-2b7a-4d52-8fa1-48de895feb7d', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'weight', 57, '2025-12-01 15:44:57+00', '2025-12-04 15:45:01.614282+00'),
	('ac7d37cf-7d96-492b-ba95-9e9016df73a8', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'bmi', 20.94, '2025-12-01 15:46:20+00', '2025-12-04 15:46:37.208225+00'),
	('89510e2a-3d0f-4150-99b5-6fa470a3b1d3', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'weight', 54, '2025-12-05 08:28:05.395+00', '2025-12-05 08:28:03.338064+00'),
	('2261a19f-fc49-44df-812e-e8fe860b9942', '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'bmi', 19.834710743801654, '2025-12-05 08:28:05.395+00', '2025-12-05 08:28:03.397594+00'),
	('183f0ad8-5742-470b-93bf-cb278b32dfc6', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'weight', 56, '2025-12-05 09:44:41.316+00', '2025-12-05 09:44:39.030336+00'),
	('b0266cb4-4dea-4fb3-9bdf-8686d9dc7092', 'b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'bmi', 20.569329660238754, '2025-12-05 09:44:41.316+00', '2025-12-05 09:44:39.107775+00');


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_settings" ("user_id", "units", "notifications_enabled", "weekly_review_day", "streak_display", "goal_display", "trainer", "created_at", "updated_at") VALUES
	('c0a22be5-21c1-443f-b3b8-44c8ca924d7d', 'metric', true, 0, true, 'big', 0, '2025-11-14 12:54:47.588583+00', '2025-11-14 12:54:47.588583+00'),
	('a2c1791c-4557-4dff-b0d3-90c6f7b7b854', 'metric', true, 0, true, 'big', 0, '2025-11-14 13:04:18.067359+00', '2025-11-14 13:04:18.067359+00'),
	('ecbb8a6e-b9fc-40e1-b1f8-206652b85220', 'metric', true, 0, true, 'big', 0, '2025-11-14 13:40:36.78208+00', '2025-11-14 13:40:36.78208+00'),
	('bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', 'metric', true, 0, true, 'big', 0, '2025-11-28 13:05:14.19412+00', '2025-11-28 13:05:59.905+00'),
	('ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', 'metric', true, 0, true, 'big', 0, '2025-11-28 13:20:44.145871+00', '2025-11-28 13:21:24.92+00'),
	('7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'metric', false, 1, true, 'none', 1, '2025-11-21 14:08:39.28148+00', '2025-11-28 14:46:09.978+00'),
	('594aa3b7-2bdc-4dce-b66d-f1eca40e0dff', 'imperial', true, 0, true, 'both', 0, '2025-11-14 15:51:54.85136+00', '2025-11-14 15:53:25.788+00'),
	('7637bd9a-3e3d-4a2c-968f-b6d4c8bf7487', 'metric', true, 0, true, 'big', 1, '2025-11-21 08:39:50.547504+00', '2025-11-21 08:41:28.179+00'),
	('01a9b209-3d59-4a94-8493-7f087d483121', 'metric', true, 0, true, 'big', 0, '2025-11-28 15:08:27.774588+00', '2025-11-28 15:09:07.468+00'),
	('3aab63d0-d835-4952-a3b6-ee298f1fcddb', 'metric', true, 0, true, 'big', 0, '2025-11-21 09:50:52.299752+00', '2025-11-21 09:53:25.925+00'),
	('816ba532-bd15-40f0-b583-23ac5a0f8eda', 'metric', true, 0, true, 'big', 0, '2025-11-21 09:58:18.346705+00', '2025-11-21 09:59:06.289+00'),
	('7bf8d192-0cdd-4fd1-9d9c-b96b0dbffb20', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:01:55.361284+00', '2025-11-21 10:02:43.427+00'),
	('c2c63fc4-10f5-426c-90c9-a0bc5122fd40', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:06:27.030316+00', '2025-11-21 10:07:26.823+00'),
	('ae8bbbc5-5702-43ce-9207-fb19338bba26', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:15:17.257117+00', '2025-11-21 10:16:08.379+00'),
	('5930fb75-e550-4f74-a9a1-f5021b043bd0', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:19:13.127445+00', '2025-11-21 10:20:05.463+00'),
	('b7e14e5c-4fa4-4637-aeae-e446ba4c8f16', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:28:41.259895+00', '2025-11-21 10:29:46.194+00'),
	('bbecdbf3-30ca-4ecf-938a-392cf8c49746', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:37:26.877136+00', '2025-11-21 10:38:17.49+00'),
	('5dde6ffc-9cc7-4aac-84e9-d8ef5e1d59f1', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:41:36.515642+00', '2025-11-21 10:42:12.969+00'),
	('08fd1fc2-93a0-493a-9e52-9a25978ef252', 'metric', true, 0, true, 'big', 0, '2025-11-28 15:34:43.935489+00', '2025-11-28 15:35:28.174+00'),
	('62639616-db0c-4d5c-8af1-d5302ad72ff7', 'metric', true, 0, true, 'big', 0, '2025-11-21 10:58:10.136906+00', '2025-11-21 11:02:19.538+00'),
	('659fa1f0-6ef8-4faa-b631-dd0a22e8f7c8', 'metric', true, 0, true, 'big', 0, '2025-11-21 11:03:26.571576+00', '2025-11-21 11:05:48.049+00'),
	('0808f6e9-b334-4bc4-9426-b4f10053e64b', 'metric', true, 0, true, 'big', 0, '2025-11-21 11:19:57.509643+00', '2025-11-21 11:20:44.725+00'),
	('cf956115-3675-48cf-bc85-1f0a41ece72f', 'metric', true, 0, true, 'big', 0, '2025-11-21 12:39:08.554817+00', '2025-11-21 12:49:06.794+00'),
	('283656cf-5bcc-4876-93db-f6b5a68b7f34', 'metric', true, 0, true, 'big', 0, '2025-11-21 13:25:51.545407+00', '2025-11-21 13:27:08.741+00'),
	('7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'metric', true, 0, true, 'small', 0, '2025-11-28 12:58:17.87495+00', '2025-11-30 21:16:32.125+00'),
	('5864c8e3-bd82-4959-adb4-29b57bb30421', 'metric', true, 0, true, 'big', 0, '2025-12-04 15:35:04.903234+00', '2025-12-04 15:36:17.125+00'),
	('f79e800e-7b3a-4a7c-bc98-03d60850632e', 'metric', true, 0, true, 'big', 0, '2025-12-04 20:12:48.125485+00', '2025-12-04 20:13:32.935+00'),
	('b62232a7-dbb0-4a36-893c-c2f4c7418a96', 'metric', true, 0, true, 'big', 0, '2025-12-05 09:26:13.028741+00', '2025-12-05 09:44:41.569+00'),
	('39c071d7-5f34-4a97-82e3-2da006e1da0e', 'metric', true, 0, true, 'big', 0, '2025-11-21 15:09:37.04316+00', '2025-11-21 15:10:40.474+00'),
	('bc17bf6b-4e78-4a65-b1a7-ec0ac16f493f', 'metric', true, 3, false, 'both', 0, '2025-11-14 15:46:11.294485+00', '2025-11-21 15:38:58.725+00'),
	('6a1e592d-b516-41ad-90fc-d242351efac7', 'metric', true, 0, true, 'big', 0, '2025-11-27 21:10:38.793635+00', '2025-11-27 21:11:59.448+00'),
	('6305efaf-d559-48f4-a655-b4334636ab5a', 'metric', true, 0, true, 'big', 0, '2025-11-27 21:17:04.581782+00', '2025-11-27 21:17:48.657+00'),
	('ce77b9d3-0613-4e9b-8aa0-0582550ddcd7', 'metric', true, 0, true, 'big', 0, '2025-11-27 21:19:15.743509+00', '2025-11-27 21:20:06.428+00'),
	('79c75d1a-1368-42f5-a220-f7ca3f595de8', 'metric', true, 0, true, 'big', 0, '2025-11-27 21:23:16.966786+00', '2025-11-27 21:24:30.52+00');


--
-- Data for Name: user_subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_subscription" ("id", "user_id", "stripe_customer_id", "stripe_subscription_id", "sub_status", "current_period_end", "created_at", "updated_at") VALUES
	(1, '283656cf-5bcc-4876-93db-f6b5a68b7f34', 'cus_TVQdNt5TcuGSSf', 'sub_1SYPmEGK6AjiY8Kv4KNQqjm6', 'active', '2025-12-28 11:23:49+00', '2025-11-28 11:05:56.418296+00', '2025-11-28 11:23:53.132+00'),
	(2, 'bf9656cd-99bd-4b1e-9ad9-fd74abfb886e', 'cus_TVSISJpxrDZvpe', 'sub_1SYRNpGK6AjiY8Kvlty9qsWS', 'trialing', '2025-12-12 13:06:44+00', '2025-11-28 13:06:46.984377+00', '2025-11-28 13:06:46.924+00'),
	(4, 'ad98fe8b-882e-4f3f-a01b-35ff27dbaf51', 'cus_TVSXLSCY0lF7n5', 'sub_1SYRciGK6AjiY8KvWDwTK4nC', 'trialing', '2025-12-12 13:22:07+00', '2025-11-28 13:22:10.53073+00', '2025-11-28 13:22:10.477+00'),
	(5, '01a9b209-3d59-4a94-8493-7f087d483121', 'cus_TVUKmf66JloVPe', 'sub_1SYTLPGK6AjiY8KvNKUP8Uj9', 'trialing', '2025-12-12 15:12:21+00', '2025-11-28 15:12:25.295559+00', '2025-11-28 15:12:25.208+00'),
	(6, '7e08a514-96fe-4b08-b9b5-fff9b8546aba', 'cus_TVUd8XbEFHMhbo', 'sub_1SYTedGK6AjiY8KvRRLUGHIf', 'trialing', '2025-12-12 15:32:14+00', '2025-11-28 15:32:18.169032+00', '2025-11-28 15:32:18.078+00'),
	(3, '7b92fd89-1e4f-459b-aad4-3b369375bbc1', 'cus_TVUen8jyRsoWvn', 'sub_1SYTfdGK6AjiY8KvMVilALDe', 'trialing', '2025-12-12 15:33:15+00', '2025-11-28 13:19:49.764279+00', '2025-11-28 15:33:18.584+00'),
	(7, '08fd1fc2-93a0-493a-9e52-9a25978ef252', 'cus_TVUhUuLU1YYdr2', 'sub_1SYTiIGK6AjiY8KvJQzQNXbr', 'trialing', '2025-12-12 15:36:01+00', '2025-11-28 15:36:04.47872+00', '2025-11-28 15:36:04.424+00');


--
-- Data for Name: weekly_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."weekly_reviews" ("id", "user_id", "date") VALUES
	('154fa063-07fd-4e5b-8f10-3079c2c48945', 'c0a22be5-21c1-443f-b3b8-44c8ca924d7d', '2025-11-14');


--
-- Data for Name: workout_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."workout_feedback" ("id", "workouts_id", "ai_feedback", "difficulty_level", "mood", "mood_notes", "workout_notes", "created_at") VALUES
	('60fa6ef3-e1f9-4fda-9520-24d4ddeacb99', 'b40756ae-e913-44f2-b31f-248978f79cbd', 'Fantastic job hitting your Leg Press targets today! You not only completed all three sets with excellent rep counts, but you also successfully increased the weight across those sets – that''s fantastic progression! It''s great to see you sticking to the plan and pushing yourself. Keep up this momentum!', 3, 3, '', '', '2025-12-03 20:03:35.113067+00'),
	('6677c562-ee63-4c9e-a34d-b7c08dc26ab0', '698798e8-8f06-402b-8811-0f2e4273cbb8', 'Fantastic job hitting your Treadmill Run/Walk goal today! It''s awesome that you got that 1200 seconds in, and your note about loving running is inspiring – that passion definitely shows. Keep up the great work and that positive energy!', 3, 4, 'good', '', '2025-12-04 20:37:27.794102+00'),
	('0095f105-be32-4d59-b76c-4a4e381044ee', '591af4eb-5a3f-4f7b-93f5-e660307f30e0', 'Hey there! I see you hit the Bench Press hard, completing a full set of 10 reps! That''s a fantastic start, and it''s great you''re already focused on getting that weight up. While we didn''t get to the rest of the planned exercises today, every step counts, and showing up for that one exercise is a win in itself. Let''s aim to build on this momentum next time!', 4, 3, '', '', '2025-12-05 08:18:21.35151+00'),
	('e4154668-6b34-4214-8dd9-f6ff60ce172c', '019b3992-45bd-48ce-b2da-a5250a42d5a9', 'Okay, great job getting your workout in today! You hit all the planned exercises: Chest Press, Lat Pulldowns, Leg Press, Shoulder Press, and Bicep Curls! While I don''t have the sets and reps you performed, the important thing is you showed up and put in the work. Let''s focus on tracking those sets and reps next time to ensure we''re progressively overloading and maximizing your gains. Keep crushing it!
', 3, 3, 'good', 'good', '2025-12-05 09:34:11.991602+00'),
	('5d73fe2a-fd3a-471d-b3ab-84988610cb4d', '43914bd8-4283-468e-ae7e-ddf2eb3c3254', 'Hey there! Great job getting in the gym today and starting strong with that chest press! You completed a set of chest press, which is a great start. Next time, let''s aim to complete all the planned sets and reps for each exercise to maximize your workout''s effectiveness. Keep up the effort and you''ll see progress in no time!
', 3, 3, 'good', 'good', '2025-12-05 09:36:49.990152+00'),
	('ca1b5397-372d-463b-bf8e-c7b815895fcd', '4a9df59b-1538-4b3e-a9c8-541bfe9ac6c9', 'Hey there! I see you got a taste of everything today. Great job getting in the gym and starting the workout! You completed one set of seated cable rows with 11 reps at 11 weight, which is a good start. Remember we were aiming for 3 sets of 15 reps for each exercise, so next time, let''s focus on building up to completing those full sets. Even a little progress is still progress!
', 4, 3, '', '', '2025-12-05 09:54:08.456119+00'),
	('f8577d24-6122-42af-8054-0b08acf480d0', 'd59a824b-0ac8-4a64-819e-9f056340d343', 'Hey there! It''s great to see you got a full-body workout in targeting all the major muscle groups. You performed all the exercises planned for today, which is fantastic! Just remember to track your sets and reps next time so we can monitor your progress more accurately. Keep up the awesome work!
', 4, 3, '', '', '2025-12-05 10:50:17.465138+00'),
	('80d5cadf-fb50-4d17-a09d-4757e9066e72', '65cda228-1bec-471a-a8bf-56fe46c7c699', 'Okay, great job getting the workout in! I see you focused on hitting all the major muscle groups with a solid mix of pressing and pulling exercises. While I don''t have the details of your sets and reps, it looks like you stuck to the planned exercises, which is fantastic for consistency. Let''s aim to track those sets and reps next time so we can see how close you got to the 3 sets of 15 reps target and make any needed adjustments. Keep up the great work!
', 4, 4, '', '', '2025-12-05 10:51:34.419288+00'),
	('e925e267-45ad-49f1-9bf3-903eeb05e6aa', 'fea8f955-67a7-4159-8743-77fa3d950570', 'Okay, great job getting the workout in! I noticed you hit all the planned exercises: Dumbbell Bench Press, Seated Cable Row, Leg Press, Dumbbell Shoulder Press, and Bicep Curls! It looks like you didn''t record the sets and reps this time, but completing the exercises is still a win. Let''s focus on tracking those sets and reps next time so we can see your progress and make sure you''re hitting those 15 rep targets for each exercise!
', 5, 2, '', '', '2025-12-05 10:52:09.791096+00'),
	('bbac2695-e868-4bcb-bcde-a4de212086a4', 'c3c394d3-c93a-4e9c-8e66-42b09268f1c6', 'Hey there! Great job getting through your planned workout today! You hit all the exercises we had scheduled: Dumbbell Bench Press, Seated Cable Row, Leg Press, Dumbbell Shoulder Press, and Bicep Curls. It looks like the workout duration wasn''t recorded, so let''s make sure to track that next time to help gauge overall progress and intensity. Keep up the consistent effort!
', 5, 3, '', '', '2025-12-05 10:56:28.475827+00'),
	('4e40acbc-9507-4a8d-9e79-73d9147af425', '958b963d-4c9d-4f6a-a229-3e90352913ec', 'Okay, great start! I see you hit all the exercises planned for today: bench press, cable rows, leg press, shoulder press, and bicep curls. While the sets and reps weren''t recorded, the most important thing is you showed up and put in the work! Let''s focus on tracking those sets and reps next time so we can really dial in your progress and make sure you''re hitting those target goals. Keep crushing it!
', 2, 1, '', '', '2025-12-05 10:57:47.440323+00'),
	('ea4cb26a-d1fc-44a5-b8b9-27664b0f778e', '404fdef0-dea7-4782-8b76-a40cd8113297', 'Hey there! I noticed you tackled all the exercises on the plan today - great job sticking to the routine! While the sets and reps weren''t tracked, completing each exercise is still a win. Let''s focus on logging those sets and reps next time so we can really track your progress and fine-tune your strength gains. Keep up the awesome work!
', 3, 1, '', '', '2025-12-05 10:58:36.085644+00');


--
-- Name: goal_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."goal_progress_id_seq"', 1, false);


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."goals_id_seq"', 16, true);


--
-- Name: user_subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_subscription_id_seq"', 7, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict nAspzQAD2C7l3l1MtaDq5gq05WzoFt6CgTQcvKVvNFDuBz9pBJqEK0r2UI8UJnK

RESET ALL;
