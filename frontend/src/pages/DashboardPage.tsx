import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { dashboardService, settingsService, moodService } from "@/lib/api";
import type { DashboardData, DashboardAchievement } from "@/lib/api/types";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList";
import SettingsButton from "@/components/settingsButton";
import {usePlannedWorkout, useNextPlannedWorkout} from "@/api/workouts"

const ACHIEVEMENTS_PER_PAGE = 3;

const FALLBACK_DASHBOARD: DashboardData = {
  firstName: null,
  trainer: null,
  goal: {
    workoutsCompleted: { current: 0, target: 100 },
    exercisesCompleted: { current: 0, target: 40 },
    longestStreak: { current: 0, target: 60 },
  },
  level: { label: "Novice", currentXp: 0, nextLevelXp: 0 },
  achievements: [],
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
  "Remind yourself why you started this journey.",
];

const LOCAL_MOOD_EMOJI = {
  anxious: "😣",
  nervous: "😬",
  okay: "🙂",
  comfortable: "😌",
  never: "🤩",
} as const;

type LocalMoodKey = keyof typeof LOCAL_MOOD_EMOJI;

const LOCAL_MOOD_TO_DB_INDEX: Record<LocalMoodKey, number> = {
  anxious: 0,
  nervous: 1,
  okay: 2,
  comfortable: 3,
  never: 4,
};

const DB_MOOD_EMOJI = ["😣", "😬", "🙂", "😌", "🤩"];

export default function DashboardPage() {
  const {data, isLoadingg, isError} = usePlannedWorkout(new Date());
  const plannedWorkout = data ?? null;
  const isTodayWorkoutCompleted = plannedWorkout?.isCompleted;
  
  // Fetch the next available workout (looks ahead 7 days)
  const { nextWorkout, upcomingWorkouts } = useNextPlannedWorkout(new Date());
  const location = useLocation();
  const { state } = location as { state?: { firstName?: string } };
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [streakDisplay, setStreakDisplay] = useState<boolean>(true); // Default to true
  const [tipIndex, setTipIndex] = useState(() =>
    Math.floor(Math.random() * ADVICE_TIPS.length)
  );
  const [moodEmoji, setMoodEmoji] = useState<string>(
    () => getStoredMoodEmoji() ?? FALLBACK_DASHBOARD.mood
  );
  const [achievementPage, setAchievementPage] = useState(0);

  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Next page
      if (achievementPage < totalAchievementPages - 1) {
        setAchievementPage((prev) => prev + 1);
      }
    }

    if (isRightSwipe) {
      // Previous page
      if (achievementPage > 0) {
        setAchievementPage((prev) => prev - 1);
      }
    }
  };

  // Load user settings to check streak_display
  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      setStreakDisplay(settings.streak_display);
    } catch (error: unknown) {
      // If settings fail to load, default to showing streak
      console.warn(
        "Failed to load settings, defaulting to show streak:",
        error
      );
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
      } catch (error: unknown) {
        if (!active) return;
        console.error("Failed to load dashboard data", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data";
        setFetchError(message);
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

  useEffect(() => {
    let active = true;

    const loadMood = async () => {
      try {
        const response = await moodService.getTodayMood();
        if (!active) return;

        if (
          typeof response.mood === "number" &&
          response.mood >= 0 &&
          response.mood < DB_MOOD_EMOJI.length
        ) {
          setMoodEmoji(DB_MOOD_EMOJI[response.mood]);
        } else {
          const localKey = getStoredMoodKey();
          const dbIndex = mapLocalKeyToIndex(localKey);
          if (dbIndex !== null) {
            setMoodEmoji(DB_MOOD_EMOJI[dbIndex]);
            try {
              await moodService.saveTodayMood(dbIndex);
            } catch (error) {
              console.warn("Failed to persist mood selection", error);
            }
          } else {
            setMoodEmoji(FALLBACK_DASHBOARD.mood);
          }
        }
      } catch (error) {
        if (!active) return;
        console.warn("Failed to load today's mood", error);
      }
    };

    loadMood();

    return () => {
      active = false;
    };
  }, []);

  const resolvedData = dashboardData ?? FALLBACK_DASHBOARD;
  const firstName =
    dashboardData?.firstName ??
    state?.firstName ??
    localStorage.getItem("firstName") ??
    "User";

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
  const currentTip = ADVICE_TIPS[tipIndex];
  const achievementPages = useMemo(
    () => chunkAchievements(achievements, ACHIEVEMENTS_PER_PAGE),
    [achievements]
  );
  const totalAchievementPages = achievementPages.length;

  const navigate = useNavigate();

  useEffect(() => {
    setAchievementPage(0);
  }, [achievements]);

  useEffect(() => {
    window.tidioChatApi.show();
  }, []);
  return (
    
    <div className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto p-6 pb-24 space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {fetchError && (
        <div className="w-full mb-4 rounded-md border border-amber-500/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 col-span-3">
          {fetchError}
        </div>
      )}
      {/* Header */}
      <header className="space-y-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center justify-between ">
          <h1 className="text-3xl font-bold tracking-tight">
            Hi, {firstName}!
          </h1>
          <SettingsButton />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{today}</p>
          <div className="flex flex-col items-end gap-1 min-w-[150px]">
            <div className="flex items-center justify-between w-full text-xs">
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
              className="h-2 w-full"
            />
          </div>
        </div>
      <div className="md:col-span-2 lg:col-span-3">
        <Separator className="mt-2" />
      </div>
      </header>

      

      {/* Next Workout */}
      <section className="md:col-span-2 lg:col-span-2">
        <Card
          className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-primary/10 bg-linear-to-br from-background to-primary/5 py-8 group"
          onClick={() => navigate("/workout")}
        >
          <div className="w-[85%] md:w-[100%] mx-auto flex flex-col gap-4 md:px-4">
            <CardHeader className="px-0 pb-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {!isTodayWorkoutCompleted ? "Today's Workout" : "Status"}
                  </span>
                  {!isTodayWorkoutCompleted && (
                    <div className="flex items-center text-xs md:text-sm text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      <span>Start Workout</span>
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </div>
                  )}
                </div>
                <CardTitle className={`h2-styles font-bold px-0! leading-tight ${isTodayWorkoutCompleted ? "text-center" : "text-left"}`}>
                  {!isTodayWorkoutCompleted 
                    ? (plannedWorkout?.name || "Training Session")
                    : `Congrats! Next workout is ${
                        nextWorkout?.date 
                          ? new Date(nextWorkout.date).toLocaleDateString('en-US', { weekday: 'long' })
                          : "soon"
                      }`
                  }
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center gap-2">
              {!isTodayWorkoutCompleted ? (
                <>
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">{nextWorkoutEmoji}</div>
                  <div className="w-full px-6 text-left">
                    <p className="body-styles text-muted-foreground font-semibold tracking-wider mt-4">
                      Description
                    </p>
                    <p className="body-styles line-clamp-3">
                      {plannedWorkout?.description || "Get ready to push your limits and build strength."}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-0">
                    Ready to sweat? Tap to start.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl">🎉</div>
                  <div className="w-full px-6 text-center space-y-2">
                    <p className="body-styles font-medium">
                      You crushed {plannedWorkout?.workoutName || "it"}!
                    </p>
                    {nextWorkout ? (
                      <div className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/50">
                        <p className="font-semibold text-foreground">Next Up: {nextWorkout.name}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Rest up and stay hydrated.
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Upcoming Schedule Calendar - Always Visible */}
              <div className="w-full px-0 md:px-4 mt-6">
                <p className="body-styles font-semibold text-muted-foreground mb-3 ">Upcoming Schedule</p>
                <div className="flex justify-between md:justify-start items-center w-full gap-2">
                  {upcomingWorkouts?.map(({ date, workout }) => (
                    <div key={date.toISOString()} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                      </span>
                      <div className={`
                        h-6 w-6 md:h-8 md:w-8 rounded-full flex items-center justify-center text-xs md:text-xs font-bold transition-all
                        ${workout?.workoutId 
                          ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20' 
                          : 'bg-muted/50 text-muted-foreground/50'
                        }
                      `}>
                        {date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            </div>
        </Card>
      </section>

      {/* Goal Section */}
      {isLoading && !dashboardData && (
        <p className="mb-4 text-sm text-muted-foreground">
          Loading your latest stats…
        </p>
      )}
      <section>
        <Card 
          className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-primary/10 bg-linear-to-br from-background to-primary/5 group"
          onClick={() => navigate("/progress")}
        >
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Progress
                </span>
                <div className="flex items-center text-xs md:text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-0.5" />
                </div>
              </div>
              <CardTitle className="text-lg">Weekly Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            <GoalRow
              label="Workouts"
              value={goal.workoutsCompleted.current}
              target={goal.workoutsCompleted.target}
            />
            <GoalRow
              label="Exercises"
              value={goal.exercisesCompleted.current}
              target={goal.exercisesCompleted.target}
            />
            <GoalRow
              label="Streak"
              value={goal.longestStreak.current}
              target={goal.longestStreak.target}
            />
          </CardContent>
        </Card>
      </section>

      {/* Mood */}
      <section>
        <Card
          className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-primary/10 bg-linear-to-br from-background to-primary/5 group"
          onClick={() => navigate("/mood")}
        >
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Wellness
                </span>
                <div className="flex items-center text-xs md:text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Log Mood</span>
                  <ChevronRight className="h-4 w-4 ml-0.5" />
                </div>
              </div>
              <CardTitle className="text-lg">Daily Check-in</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4 pb-2">
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{moodEmoji}</div>
            <p className="text-xs text-muted-foreground text-center font-medium px-2">
              {moodEmoji === "😣" || moodEmoji === "😬" 
                ? "Feeling anxious? A quick workout might help reset." 
                : "Tracking your mood helps build emotional awareness."}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Streak + Level */}
      <section>
        <Card className="hover:scale-none h-full">
          {streakDisplay && (
            <CardHeader className="pb-0">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </CardTitle>
                <span className="text-3xl font-bold">{streakDays} Days</span>
              </div>
            </CardHeader>
          )}
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
        <div className="flex items-center justify-between px-1 mb-4">
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
        <div
          className="overflow-hidden touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${achievementPage * 100}%)` }}
          >
            {achievementPages.map((page, idx) => (
              <div key={`ach-page-${idx}`} className="min-w-full">
                <AchievementList
                  achievements={page}
                  isLoading={isLoading && !dashboardData}
                />
              </div>
            ))}
          </div>
        </div>
        {totalAchievementPages > 1 && (
          <div className="mt-2 flex items-center justify-center gap-2">
            {achievementPages.map((_, idx) => (
              <Dot
                key={`ach-dot-${idx}`}
                active={idx === achievementPage}
                onClick={() => setAchievementPage(idx)}
              />
            ))}
          </div>
        )}
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
              onClick={() =>
                setTipIndex((prev) => (prev + 1) % ADVICE_TIPS.length)
              }
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
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {/* Custom dot instead of list-item for better alignment */}
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
          <span className="font-medium opacity-90">{label}</span>
        </div>
        <span className="tabular-nums text-muted-foreground text-xs">
          <span className="font-medium text-foreground">{value}</span> /{" "}
          <span className="font-medium text-foreground">{target}</span>
        </span>
      </div>
      <Progress value={pct} className="h-2 rounded-full" />
    </div>
  );
}

function Dot({
  active = false,
  onClick,
}: {
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`size-2 rounded-full transition-colors ${
        active ? "bg-foreground" : "bg-muted-foreground/40"
      }`}
      aria-pressed={active}
    />
  );
}

const LOCAL_MOOD_STORAGE_KEY = "currentMood_v1";

function getStoredMoodKey(): LocalMoodKey | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(
    LOCAL_MOOD_STORAGE_KEY
  ) as LocalMoodKey | null;
  if (value && value in LOCAL_MOOD_EMOJI) {
    return value;
  }
  return null;
}

function mapLocalKeyToIndex(key: string | null): number | null {
  if (!key) return null;
  if ((LOCAL_MOOD_TO_DB_INDEX as Record<string, number>)[key] === undefined)
    return null;
  return LOCAL_MOOD_TO_DB_INDEX[key as LocalMoodKey];
}

function getStoredMoodEmoji(): string | null {
  const key = getStoredMoodKey();
  return key ? LOCAL_MOOD_EMOJI[key] : null;
}

function chunkAchievements(items: DashboardAchievement[], size: number) {
  if (!items || items.length === 0) {
    return [[]];
  }
  const chunks: DashboardAchievement[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
