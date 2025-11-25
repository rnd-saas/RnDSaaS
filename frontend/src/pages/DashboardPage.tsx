import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";

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
  "Try to include all three: protein, carbs, and fats in a meal.",
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
  const level = { label: "Novice", currentXp: 0, nextLevelXp: 1200 };
  // ----------------------

  const navigate = useNavigate();

   // ---------- advice tip state ----------
   const [tipIndex, setTipIndex] = useState(
    () => Math.floor(Math.random() * ADVICE_TIPS.length)
  );
   const currentTip = ADVICE_TIPS[tipIndex];

   const showNextTip = () => {
     setTipIndex((prev) => (prev + 1) % ADVICE_TIPS.length);
   };



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
        <Card
          className="bg-muted/40 cursor-pointer hover:bg-accent/30 transition-colors"
          onClick={() => navigate("/mood")}
        >
          <CardHeader>
            <CardTitle className="text-2xl">Mood</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center justify-center py-4">
            <div className="text-6xl">
              {(() => {
                const key = localStorage.getItem("currentMood_v1") as MoodKey | null;
                if (!key || !(key in MOODS)) return "😣"; // fallback
                return MOODS[key];
              })()}
            </div>
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
          <AchievementList/>
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
              className="rounded-full p-1 text-muted-foreground hover:bg-accent active:rotate-90 "
              onClick={showNextTip}
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

export function GoalRow({ label, value, target }: { label: string; value: number; target: number }) {
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
