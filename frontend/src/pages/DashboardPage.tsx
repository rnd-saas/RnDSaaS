import { useMemo } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Achievement from "@/components/achievement.tsx";
import type {AchievementType} from "@/utils/AchievementType.tsx";

/**
 * Pure UI mock: no data fetching yet.
 * Replace the hardcoded values with real data when backend wiring is ready.
 */

export default function DashboardPage() {
  const { state } = useLocation() as { state?: { firstName?: string } };
  const firstName =
    state?.firstName ?? localStorage.getItem("firstName") ?? "User";

  const today = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  // ----- Mock data -----
  const goal = {
    workoutsCompleted: { current: 0, target: 5 },
    exercisesDiscovered: { current: 0, target: 10 },
    longestStreak: { current: 0, target: 7 },
  };
  const level = { label: "Novice", currentXp: 500, nextLevelXp: 1200 };
  const achievements: AchievementType[] = [
    { id: 1, title: "100 Workouts", sub: "Completed", image: "💪", obtained:true },
    { id: 2, title: "7 Days", sub: "Streak", image: "📆", obtained: true },
    { id: 3, title: "Consecutive", sub: "Workout 12", image: "🔥", obtained:true },
  ];
  // ----------------------

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
              <div className="text-6xl">😣</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-2xl">Next Workout</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-6xl">🏋️‍♂️</div>
            </CardContent>
          </Card>
        </section>

        <p className="mt-3 text-[15px] text-amber-600">Need help calming down?</p>

        {/* Streak + Level */}
        <section className="mt-6 space-y-3">
          <h2 className="text-3xl font-semibold">Streak: 20 days</h2>

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
              Fill half your plate with colorful vegetables!
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
