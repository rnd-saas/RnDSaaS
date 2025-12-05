import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList.tsx";
import SettingsButton from "@/components/settingsButton.tsx";

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
  "Remind yourself why you started this journey.",
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
  const [tipIndex, setTipIndex] = useState(() =>
    Math.floor(Math.random() * ADVICE_TIPS.length)
  );
  const currentTip = ADVICE_TIPS[tipIndex];

  const showNextTip = () => {
    setTipIndex((prev) => (prev + 1) % ADVICE_TIPS.length);
  };

  return (
    <div className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto p-6 pb-24 space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* Header */}
      <header className="space-y-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Hi, {firstName}!
          </h1>
          <SettingsButton />
        </div>
        <p className="text-muted-foreground">
          {today} &bull; Let's keep up the momentum.
        </p>
      </header>

      <div className="md:col-span-2 lg:col-span-3">
        <Separator />
      </div>

      {/* Goal Section */}
      <section>
        <Card className="hover:scale-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Weekly Goals</CardTitle>
              <span className="text-sm text-muted-foreground">Progress</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <GoalRow
              label="Workouts completed"
              value={goal.workoutsCompleted.current}
              target={goal.workoutsCompleted.target}
            />
            <GoalRow
              label="Exercises discovered"
              value={goal.exercisesDiscovered.current}
              target={goal.exercisesDiscovered.target}
            />
            <GoalRow
              label="Longest streak"
              value={goal.longestStreak.current}
              target={goal.longestStreak.target}
            />
          </CardContent>
        </Card>
      </section>

      {/* Mood + Next workout */}
      <section className="grid grid-cols-2 gap-4 md:flex md:flex-col md:h-full">
        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-background to-primary/5 py-4 gap-2 md:flex-1 md:justify-center  "
          onClick={() => navigate("/mood")}
        >
          <CardHeader className="pb-0 px-4 flex flex-col items-center">
            <CardTitle className="text-base font-medium">Mood</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-2 px-4">
            <div className="text-4xl mb-2">
              {(() => {
                const key = localStorage.getItem(
                  "currentMood_v1"
                ) as MoodKey | null;
                if (!key || !(key in MOODS)) return "😣";
                return MOODS[key];
              })()}
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              How are you feeling?
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-background to-primary/5 py-4 gap-2 md:flex-1 md:justify-center"
          onClick={() => navigate("/workout/exercise")}
        >
          <CardHeader className="pb-0 px-4 flex flex-col items-center">
            <CardTitle className="text-base font-medium text-center">
              Next Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-2 px-4">
            <div className="text-4xl mb-2">🏋️‍♂️</div>
            <p className="text-[10px] text-muted-foreground text-center">
              Ready to sweat?
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Streak + Level */}
      <section>
        <Card className="hover:scale-none">
          <CardHeader className="pb-0">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <span className="text-3xl font-bold">20 Days</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Level:{" "}
                  <span className="font-medium text-foreground">
                    {level.label}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {level.currentXp} / {level.nextLevelXp} XP
                </span>
              </div>
              <Progress
                value={(level.currentXp / level.nextLevelXp) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Achievements */}
      <section className="lg:col-span-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="h3-styles font-semibold">Achievements</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => navigate("/achievements")}
          >
            View All
          </Button>
        </div>
        <AchievementList />
        <div className="mt-4 flex items-center justify-center gap-2">
          <Dot active />
          <Dot />
          <Dot />
        </div>
      </section>

      {/* Advice */}
      <section className="md:col-span-2 lg:col-span-1">
        <Card className="bg-primary/5 border-primary/10 hover:scale-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-primary">
              Daily Tip
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={showNextTip}
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Next tip</span>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {currentTip}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

/* ---------- Small bits ---------- */

export function GoalRow({
  label,
  value,
  target,
}: {
  label: string;
  value: number;
  target: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / target) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[15px]">
        <span className="list-item ml-6 list-disc marker:text-foreground/80">
          {label}:
        </span>
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
