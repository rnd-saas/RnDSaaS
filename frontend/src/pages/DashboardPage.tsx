import { useEffect, useMemo, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { dashboardService } from "@/lib/api";
import type { DashboardData } from "@/lib/api/types";
import Achievement from "@/components/achievement";

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

export default function DashboardPage() {
  const { state } = useLocation() as { state?: { firstName?: string } };
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
  const advice = resolvedData.advice;
  const moodEmoji = resolvedData.mood;
  const nextWorkoutEmoji = resolvedData.nextWorkout;

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
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-2xl">Mood</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-6xl">{moodEmoji}</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-2xl">Next Workout</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-6xl">{nextWorkoutEmoji}</div>
            </CardContent>
          </Card>
        </section>

        <p className="mt-3 text-[15px] text-amber-600">Need help calming down?</p>

        {/* Streak + Level */}
        <section className="mt-6 space-y-3">
          <h2 className="text-3xl font-semibold">Streak: {streakDays} days</h2>

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
          <div className="flex items-stretch gap-3 overflow-x-auto pb-1">
            {achievements.map((a) => (
              <Achievement key={a.id} {...a} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Dot active />
            <Dot />
            <Dot />
          </div>
        </section>

        {/* Advice */}
        <section className="mt-6">
          <Card className="bg-muted/40">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg">Advice</CardTitle>
              <button
                aria-label="More"
                className="rounded-full p-1 text-muted-foreground hover:bg-accent"
              >
                •••
              </button>
            </CardHeader>
            <CardContent className="text-base">
              {advice}
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
