import { useParams, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useExercise } from "@/api/workouts";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import type { ExerciseInformation } from "@/lib/types/Workout";
import { Button } from "@/components/WorkoutComponents/button";

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const logMode: Record<ExerciseInformation["logMode"], string> = {
  reps_weight: "Reps and weight",
  reps: "Reps",
  time: "Time",
  time_weight: "Time and weight",
  distance: "Distance",
  distance_weight: "Distance and weight",
};

export default function ExercisePage() {
  const { exerciseSlug } = useParams();
  const { data, isLoading, isError } = useExercise(exerciseSlug as string);
  const exercise = data;
  const navigate = useNavigate();
  const location = useLocation();
  const returnPathRef = useRef<string | null>(null);

  useEffect(() => {
    // 第一次进入此页面时，保存返回路径
    // 只在非 chatbot 来源时设置
    if (!location.state?.fromChatbot && !returnPathRef.current) {
      // 记录当前的 history index - 1 作为返回点
      const storageKey = `exerciseReturn_${exerciseSlug}`;
      const historyLength = window.history.length;
      sessionStorage.setItem(storageKey, String(historyLength - 1));
    }
  }, [exerciseSlug, location.state]);

  const handleBack = () => {
    const storageKey = `exerciseReturn_${exerciseSlug}`;
    const savedLength = sessionStorage.getItem(storageKey);
    
    if (savedLength) {
      const targetLength = parseInt(savedLength, 10);
      const currentLength = window.history.length;
      const stepsBack = currentLength - targetLength;
      
      if (stepsBack > 0) {
        sessionStorage.removeItem(storageKey);
        navigate(-stepsBack);
        return;
      }
    }
    
    // 默认回退一步
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="mx-auto my-auto">
        <p>Loading exercise...</p>
      </div>
    );
  } else if (isError) {
    return (
      <div className="mx-auto my-auto body-styles font-red-500">
        <p>Error retreiving exercise information. Try again...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="mx-auto my-auto body-styles">
        <p>Exercise not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background pb-24 lg:pb-12">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="rounded-full p-1 hover:bg-accent transition-colors"
            >
              <ChevronLeft size={32} className="shrink-0" />
            </button>
            <h1 className="h3-styles text-2xl md:text-3xl">{exercise.name}</h1>
          </div>

          <div className="flex flex-wrap gap-6 md:flex-col md:items-end md:gap-2">
            <div className="flex flex-col gap-1">
              <h4 className="h4-styles text-sm text-muted-foreground">
                Difficulty level:
              </h4>
              <Rating value={3} readOnly>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton
                    className="text-secondary p-0"
                    key={index}
                    size={18}
                  />
                ))}
              </Rating>
            </div>
            <div className="flex flex-col gap-1 md:items-end">
              <h4 className="h4-styles text-sm text-muted-foreground">
                Log mode:
              </h4>
              <p className="body-styles text-sm font-medium">
                {exercise ? logMode[exercise.logMode] : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Video & Description */}
          <div className="space-y-8">
            <section>
              <h3 className="h3-styles mb-3 text-xl">Tutorial</h3>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-sm">
                {exercise?.tutorialUrl && getEmbedUrl(exercise.tutorialUrl) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getEmbedUrl(exercise.tutorialUrl)!}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p className="body-styles">No tutorial video available.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="h3-styles mb-2 text-xl">Description</h3>
              <p className="body-styles leading-relaxed text-muted-foreground">
                {exercise.description}
              </p>
            </section>
          </div>

          {/* Right Column: Instructions & Muscles */}
          <div className="space-y-8">
            <section>
              <h3 className="h3-styles mb-3 text-xl">Instructions</h3>
              {exercise.instructions && exercise.instructions.length > 0 ? (
                <ol className="list-decimal space-y-2 pl-5">
                  {exercise.instructions.map(
                    (instruction: string, index: number) => (
                      <li
                        key={index}
                        className="body-styles pl-1 leading-relaxed text-muted-foreground"
                      >
                        {instruction}
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <p className="body-styles text-muted-foreground">
                  No instructions available for this exercise.
                </p>
              )}
            </section>

            <section>
              <h3 className="h3-styles mb-3 text-xl">Muscle Groups Trained</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.muscleGroups.map(
                  (muscleGroup: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary-foreground"
                    >
                      {muscleGroup}
                    </span>
                  )
                )}
              </div>
            </section>

            <section className="pt-4">
              <h3 className="h3-styles mb-2 text-xl">Need Help?</h3>
              <p className="body-styles mb-4 text-muted-foreground">
                Ask your workout buddy!
              </p>
              <div className="hidden lg:block">
                <Button
                  variant="default"
                  onClick={() => {
                    navigate(`/exercise/${exerciseSlug}/chat`);
                  }}
                  className="w-full text-md shadow-sm"
                >
                  Ask Workout Buddy
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Button */}
      <div className="fixed bottom-6 left-4 right-4 lg:hidden">
        <Button 
          variant="default" 
          className="w-full text-md shadow-lg"
          onClick={() => {
            navigate(`/exercise/${exerciseSlug}/chat`);
          }}
        >
          Ask Workout Buddy
        </Button>
      </div>
    </div>
  );
}
