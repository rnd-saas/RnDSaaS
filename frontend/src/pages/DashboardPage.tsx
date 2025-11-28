import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { dashboardService, settingsService } from "@/lib/api";
import type { DashboardData } from "@/lib/api/types";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";

const FALLBACK_DASHBOARD: DashboardData = {
  firstName: null,
  trainer: null,
  goal: {
    workoutsCompleted: { current: 70, target: 100 },
    exercisesDiscovered: { current: 30, target: 40 },
    longestStreak: { current: 30, target: 60 },
  },
  level: { label: "Novice", currentXp: 500, nextLevelXp: 1200 },
  achievements: [
    { id: "workouts-100", title: "100 Workouts", sub: "Completed", emoji: "💪" },
    { id: "streak-7", title: "7 Days", sub: "Streak", emoji: "📆" },
    { id: "consecutive-12", title: "Consecutive", sub: "Workout 12", emoji: "🔥" },
  ],
  mood: "😣",
  nextWorkout: "🏋️‍♂️",
  streakDays: 20,
  advice: "Fill half your plate with colorful vegetables!",
};

const ADVICE_TIPS: string[] = [
  "Fill half your plate with colorful vegetables.",
  "Drink a glass of water first thing in the morning.",
  "Take a 5-minute stretch break every hour.",
  "Swap sugary drinks for sparkling water with lemon.",
  "Aim for at least 7 hours of sleep tonight.",
  "Take the stairs instead of the elevator when you can.",
  "Add a source of protein to every meal.",
  "Go for a 10-minute walk after eating.",
  "Plan tomorrow’s workout before you go to bed.",
  "Keep healthy snacks like nuts or fruit within reach.",
  "Limit screen time 30 minutes before bedtime.",
  "Practice 5 deep breaths when you feel stressed.",
  "Set a small, achievable goal for today’s workout.",
  "Prep one healthy meal in advance for tomorrow.",
  "Write down one thing you’re grateful for today.",
  "Include a healthy fat like avocado or olive oil in a meal.",
  "Do a quick posture check: shoulders back, chin up.",
  "Replace one processed snack with a whole food option.",
  "Stand up and move for 2 minutes every 30–60 minutes.",
  "Schedule your next workout in your calendar.",
  "Try a new vegetable you haven’t had in a while.",
  "Keep a reusable water bottle nearby all day.",
  "Take your time while eating—slow down and enjoy it.",
  "Add a serving of berries or fruit to your breakfast.",
  "Do a short mobility routine before your workout.",
  "Set a consistent bedtime and wake-up time this week.",
  "Listen to music or a podcast that boosts your mood.",
  "Stretch your hips and back for a few minutes today.",
  "Swap white bread for whole grain at your next meal.",
  "Take a short walk outside and get some fresh air.",
  "Do a quick body scan and relax any tense muscles.",
  "Add a side salad to one of your meals today.",
  "Keep your phone away from the table when you eat.",
  "Do a 1-minute plank at some point today.",
  "Prepare a healthy snack before you get very hungry.",
  "Try to include protein, carbs, and fats in a meal.",
  "Celebrate a small win from this week’s workouts.",
  "Do 10 bodyweight squats during your next break.",
  "Try to eat at least one home-cooked meal today.",
  "Replace one dessert this week with fruit or yogurt.",
  "Write down your top 3 priorities for tomorrow.",
  "Take a few minutes to tidy your workout space.",
  "Schedule a rest or recovery day on purpose.",
  "Check in with how your body feels before and after a workout.",
  "Take a deep breath before responding when stressed.",
  "Stretch your chest and shoulders to counter sitting.",
  "Put your next workout clothes out in advance.",
  "Drink a glass of water with each meal.",
  "End your day with one positive reflection.",
  "Remind yourself why you started this journey."
];

const MOODS = {
  anxious: "😣",
  insecure: "😟",
  nervous: "😬",
  fine: "🙂",
  comfortable: "😌",
  never_been: "🤷‍♂️",
};

type MoodKey = keyof typeof MOODS;

export default function DashboardPage() {
  const location = useLocation();
  const { state } = location as { state?: { firstName?: string } };
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [streakDisplay, setStreakDisplay] = useState<boolean>(true); // Default to true
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * ADVICE_TIPS.length));

  // Load user settings to check streak_display
  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      setStreakDisplay(settings.streak_display);
    } catch (error: any) {
      // If settings fail to load, default to showing streak
      console.warn("Failed to load settings, defaulting to show streak:", error);
      setStreakDisplay(true);
    }
  };

  // Load settings on mount and when location changes (user returns from settings)
  useEffect(() => {
    loadSettings();
  }, [location.pathname]);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setFetchError(null);
        const data = await dashboardService.fetchDashboard();
        if (!active) return;
        setDashboardData(data);
        if (data.firstName) {
          try {
            localStorage.setItem("firstName", data.firstName);
          } catch {
            // ignore storage failures
          }
        }
      } catch (error: any) {
        if (!active) return;
        console.error("Failed to load dashboard data", error);
        setFetchError(error?.message ?? "Failed to load dashboard data");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const resolvedData = dashboardData ?? FALLBACK_DASHBOARD;
  const firstName =
    dashboardData?.firstName ?? state?.firstName ?? localStorage.getItem("firstName") ?? "User";

  const today = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const goal = resolvedData.goal;
  const level = resolvedData.level;
  const achievements = resolvedData.achievements;
  const streakDays = resolvedData.streakDays;
  const nextWorkoutEmoji = resolvedData.nextWorkout;
  const moodEmoji = getStoredMoodEmoji() ?? FALLBACK_DASHBOARD.mood;
  const currentTip = ADVICE_TIPS[tipIndex];

  const navigate = useNavigate();


  return (
    <>
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Hi, {firstName}!</h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <button
          aria-label="Settings"
          className="rounded-full border p-2 text-muted-foreground hover:bg-accent"
          onClick={() => navigate("/settings")}
        >
          ⚙️
        </button>
      </header>

      <Separator className="my-4" />

        {fetchError && (
          <div className="mb-4 rounded-md border border-amber-500/60 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {fetchError}
          </div>
        )}

        {isLoading && !dashboardData && (
          <p className="mb-4 text-sm text-muted-foreground">Loading your latest stats…</p>
        )}

        {/* To your goal */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">To your goal:</h2>
          <GoalRow label="Workouts completed" value={goal.workoutsCompleted.current} target={goal.workoutsCompleted.target} />
          <GoalRow label="New exercises discovered" value={goal.exercisesDiscovered.current} target={goal.exercisesDiscovered.target} />
          <GoalRow label="Longest streak" value={goal.longestStreak.current} target={goal.longestStreak.target} />
        </section>

        {/* Mood + Next workout */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          className="bg-muted/40 cursor-pointer hover:bg-accent/30 transition-colors"
          onClick={() => navigate("/mood")}
        >
            <CardHeader>
              <CardTitle className="text-2xl">Mood</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-6xl">{moodEmoji}</div>
            </CardContent>
          </Card>

          <Card
            className="bg-muted/40 cursor-pointer hover:bg-accent/30 transition-colors"
            onClick={() => navigate("/workout/exercise")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Next Workout</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-4xl sm:text-5xl text-center whitespace-pre-line">{nextWorkoutEmoji}</div>
            </CardContent>
          </Card>
        </section>

        <p className="mt-3 text-[15px] text-amber-600">Need help calming down?</p>

        {/* Streak - Only show if streak_display is enabled */}
        {streakDisplay && (
          <section className="mt-6 space-y-3">
            <h2 className="text-3xl font-semibold">Streak: {streakDays} days</h2>
          </section>
        )}

        {/* Level - Always show */}
        <section className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground">Current level:</span>
            <span className="text-base font-medium">{level.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <Progress
              value={(level.currentXp / level.nextLevelXp) * 100}
              className="h-4 flex-1 rounded-full"
            />
            <span className="w-24 text-right text-sm text-muted-foreground">
              {level.currentXp}/{level.nextLevelXp}
            </span>
          </div>
        </section>

        {/* Achievements */}
        <section className="mt-5">
          <h3 className="mb-3 text-lg font-semibold">Achievements:</h3>
          <AchievementList achievements={achievements} isLoading={isLoading && !dashboardData} />
          <div className="mt-2 flex items-center justify-center gap-2">
            <Dot active />
            <Dot />
            <Dot />
          </div>
        </section>

        {/* Advice */}
        <section className="mt-6">
          <Card className="bg-muted/40 w-full max-w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Advice</CardTitle>
              <button
                aria-label="Next tip"
                className="rounded-full p-1 text-muted-foreground hover:bg-accent active:rotate-90 transition-transform"
                onClick={() =>
                  setTipIndex((prev) => (prev + 1) % ADVICE_TIPS.length)
                }
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="text-base break-words whitespace-normal">
              {currentTip}
            </CardContent>
          </Card>
        </section>
      </>
  );
}

/* ---------- Small bits ---------- */

function GoalRow({ label, value, target }: { label: string; value: number; target: number }) {
  const pct = Math.max(0, Math.min(100, (value / target) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[15px]">
        <span className="list-item ml-6 list-disc marker:text-foreground/80">{label}:</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <Progress value={pct} className="h-2 rounded-full" />
    </div>
  );
}

function Dot({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`size-2 rounded-full ${
        active ? "bg-foreground" : "bg-muted-foreground/40"
      }`}
    />
  );
}

function getStoredMoodEmoji(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const key = window.localStorage.getItem("currentMood_v1") as MoodKey | null;
  if (!key || !(key in MOODS)) {
    return null;
  }
  return MOODS[key];
}
