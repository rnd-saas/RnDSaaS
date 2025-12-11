import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { ChevronLeft, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkoutStore } from "@/lib/state/workoutStore";
import { useUpdateWorkoutEvaluation, useAiFeedback } from "@/api/workouts";
import { useLocation } from "react-router-dom";
import type { WorkoutEvaluation } from "@/lib/types/Workout";
import { Skeleton } from "@/components/ui/skeleton";
// NEW: Import the card
import MoodShiftCard from "@/components/WorkoutComponents/MoodShiftCard";
import { trackWorkoutEvaluation, trackWorkoutSkip } from "@/lib/analytics";

export default function WorkoutEvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const workoutId = location.state?.workoutId;
  
  const [difficulty, setDifficulty] = useState(0);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [feelingNotes, setFeelingNotes] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");

  const resetWorkout = useWorkoutStore((state) => state.resetWorkout);
  // NEW: Get pre-workout mood
  const preWorkoutMood = useWorkoutStore((state) => state.preWorkoutMood);
  const { mutate: updateEvaluation, isPending } = useUpdateWorkoutEvaluation();
  const { data: aiFeedback, isLoading: isAiLoading } = useAiFeedback(workoutId);

  // UPDATED: Changed to 0-4 scale to match database and pre-workout mood
  const feelingMap: Record<string, number> = {
    dead: 0,       // 😣 Anxious/Bad
    sad: 1,        // 😬 Nervous/Poor
    sceptic: 2,    // 🙂 Okay
    happy: 3,      // 😌 Comfortable
    veryHappy: 4,  // 🤩 Excited/Great
  };

  // Helper for labels/emojis
  const MOOD_DATA = [
    { emoji: "😣", label: "Anxious" },
    { emoji: "😬", label: "Nervous" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "😌", label: "Good" },
    { emoji: "🤩", label: "Great" },
  ];

  const handleSkip = () => {
    if (!workoutId) {
      // If no workoutId (e.g. direct access), just go home
      resetWorkout();
      navigate("/dashboard", { replace: true });
      return;
    }

    const evaluation: WorkoutEvaluation = {
      workoutId: workoutId,
      feedbackAi: aiFeedback || "",
      difficultyRating: 0, // Default neutral
      moodAfterWorkout: 2, // UPDATED: Default neutral (2 = Okay)
      moodBeforeWorkout: 2, // UPDATED: Default neutral (2 = Okay)
      createdAt: new Date(),
      skipped: true, 
    }; // Fixed syntax error here

    updateEvaluation(
      { workoutId, evaluation },
      {
        onSuccess: () => {
          // Track workout skip
          trackWorkoutSkip(workoutId);
          resetWorkout();
          navigate("/dashboard", { replace: true });
        },
      }
    );
  };

  const handleSubmit = () => {
    if (!workoutId) {
      // If no workoutId (e.g. direct access), just go home
      resetWorkout();
      navigate("/dashboard", { replace: true });
      return;
    }

    const evaluation: WorkoutEvaluation = {
      workoutId: workoutId,
      feedbackAi: aiFeedback || "Great job! You crushed it!",
      difficultyRating: (difficulty || 0) as 0 | 1 | 2 | 3 | 4 | 5,
      // Update property names here:
      moodBeforeWorkout: (preWorkoutMood !== undefined ? preWorkoutMood : 2) as 0 | 1 | 2 | 3 | 4 | 5, // UPDATED: Default to 2 if undefined
      moodAfterWorkout: (feeling ? feelingMap[feeling] : 2) as 0 | 1 | 2 | 3 | 4 | 5, // UPDATED: Default to 2
      moodNotes: feelingNotes,       // Changed from comfortNotes
      performanceNotes: workoutNotes,
      createdAt: new Date(),
      skipped: false,
    };

    updateEvaluation(
      { workoutId, evaluation },
      {
        onSuccess: () => {
          // Track workout evaluation
          trackWorkoutEvaluation(workoutId, evaluation.difficultyRating, evaluation.moodAfterWorkout);
          resetWorkout();
          navigate("/dashboard", { replace: true });
        },
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-center p-4 pt-6 sticky top-0 bg-background z-10">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-6 h-6 w-6 p-0 hover:bg-transparent"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6 text-text" />
        </Button>
        <h2 className="h2-styles">Workout Evaluation</h2>
      </div>

      {/* Main Content - Added pb-32 to clear the fixed footer */}
      <div className="flex-1 flex flex-col items-center p-6 pb-32 gap-8 max-w-md mx-auto w-full overflow-y-auto">
        {/* AI Feedback */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-1">
            <h3 className="text-xl font-bold text-black font-['Comfortaa']">
              AI Feedback
            </h3>
            <Popover>
              <PopoverTrigger>
                <Info className="w-4 h-4 text-zinc-400" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 text-sm">
                <p>AI analysis of your performance vs plan.</p>
              </PopoverContent>
            </Popover>
          </div>
          {isAiLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          ) : (
            <p className="text-sm text-black font-['Nunito_Sans'] leading-normal">
              {aiFeedback || "Generating feedback..."}
            </p>
          )}
        </div>

        {/* Difficulty Level */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-1">
            <h3 className="text-xl font-bold text-black font-['Comfortaa']">
              Difficulty level
            </h3>
            <Popover>
              <PopoverTrigger>
                <Info className="w-4 h-4 text-zinc-400" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 text-sm">
                <p>Rate the perceived exertion of this session.</p>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-1">
            <Rating
              defaultValue={0}
              value={difficulty}
              onValueChange={setDifficulty}
              className="gap-1"
            >
              {[1, 2, 3, 4, 5].map((index) => (
                <RatingButton
                  key={index}
                  className="w-6 h-6 text-yellow-400"
                  // icon={<Star className="stroke-zinc-900" />}
                />
              ))}
            </Rating>
          </div>
        </div>

        {/* How do you feel */}
        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-xl font-bold text-black font-['Comfortaa']">
            Tell us... How do you feel?
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 lg:max-w-[50vw]">
              {[
                { id: "dead", src: "😣" },
                { id: "sad", src: "😬" },
                { id: "sceptic", src: "🙂" },
                { id: "happy", src: "😌" },
                { id: "veryHappy", src: "🤩" },
              ].map((emoji) => (
                <button
                  key={emoji.id}
                  onClick={() => setFeeling(emoji.id)}
                  className={`relative w-[48px] h-[48px] text-3xl rounded-full transition-transform hover:scale-110 ${
                      feeling === emoji.id
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                  }`}
                >
                  {emoji.src}
                </button>
              ))}
            </div>
            <Input
              placeholder="Add notes..."
              value={feelingNotes}
              onChange={(e) => setFeelingNotes(e.target.value)}
              className="bg-white border-none shadow-sm h-11 rounded-lg"
            />
          </div>
        {/* MOVED: Show Mood Shift Card HERE (immediately after mood selection) */}
        {feeling && preWorkoutMood !== null && feelingMap[feeling] !== undefined && (
           <MoodShiftCard 
             beforeMood={MOOD_DATA[preWorkoutMood]?.emoji || "?"}
             beforeLabel={MOOD_DATA[preWorkoutMood]?.label || "Unknown"}
             afterMood={MOOD_DATA[feelingMap[feeling]]?.emoji || "?"}
             afterLabel={MOOD_DATA[feelingMap[feeling]]?.label || "Unknown"}
             beforeValue={preWorkoutMood}
             afterValue={feelingMap[feeling]}
           />
        )}
        </div>


        {/* Workout Notes */}
        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-xl font-bold text-black font-['Comfortaa']">
            How did your workout go?
          </h3>
          <Input
            placeholder="Add notes..."
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            className="bg-white border-none shadow-sm h-11 rounded-lg"
          />
        </div>

      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background border-t">
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 h-[49px] rounded-[10px] border-primary text-primary hover:text-primary hover:bg-primary/10 font-bold font-['Comfortaa'] text-base"
            onClick={handleSkip}
            disabled={isPending}
          >
            Skip
          </Button>
          <Button
            className="flex-1 h-[49px] rounded-[10px] bg-primary hover:bg-primary/90 text-[#f4f9f7] font-bold font-['Comfortaa'] text-base"
            onClick={handleSubmit}
            disabled={isPending || difficulty === 0 || !feeling}
          >
            {isPending ? "Saving..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
