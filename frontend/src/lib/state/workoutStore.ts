import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LoggedWorkout,
  LoggedExercise,
  LoggedSet,
} from "@/lib/types/Workout.tsx";

interface ActiveWorkoutState {
  isRunning: boolean;
  elapsedTimeSeconds: number;
  workoutId: string;
  // NEW: Store the mood before the workout starts
  preWorkoutMood: number | null;
  setPreWorkoutMood: (mood: number | null) => void;
  
  expandedExerciseId: string | null;
  setExpandedExerciseId: (newId: string | null) => void;
  loggedWorkout: LoggedWorkout | null;
  startWorkout: (id: string, loggedExercises: LoggedExercise[]) => void;
  resumeWorkout: () => void;
  pauseWorkout: () => void;
  resetWorkout: () => void;
  tick: () => void;
  addExercise: (exercise: LoggedExercise) => void;
  getExercise: (exerciseId: string) => LoggedExercise;
  updateExerciseSet: (
    exerciseId: string,
    setIndex: number,
    newValue: Partial<LoggedSet>
  ) => void;
  updateWorkout: (newValue: Partial<LoggedWorkout>) => void;
  updateExercise: (
    exerciseId: string,
    newValue: Partial<LoggedExercise>
  ) => void;
  calculateTotalVolume: () => number; // total volume that you lifted this workout.
  calculateTotalSetsFinished: () => number; // total sets completed in the workout.
}

export const useWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      elapsedTimeSeconds: 0,
      workoutId: "",
      // NEW: Initialize preWorkoutMood
      preWorkoutMood: null,
      setPreWorkoutMood: (mood) => set({ preWorkoutMood: mood }),
      
      expandedExerciseId: null,
      loggedWorkout: null,
      startWorkout: (id: string, loggedExercises: LoggedExercise[]) =>
        set({
          isRunning: true,
          // elapsedTimeSeconds: 0,
          workoutId: id,
          // NEW: Reset mood on start (optional, or keep it if set just before)
          // preWorkoutMood: null, 
          loggedWorkout: {
            workoutId: id,
            exercises: loggedExercises,
            startDatetime: new Date(),
            date: new Date().toDateString(),
          },
        }),
      resumeWorkout: () => {
        console.log("resuming workout");
        set({
          isRunning: true,
        });
      },
      pauseWorkout: () => {
        console.log("run pausing");
        set({
          isRunning: false,
        });
      },
      resetWorkout: () =>
        set({
          isRunning: false,
          elapsedTimeSeconds: 0,
          workoutId: "",
          loggedWorkout: null,
          // NEW: Reset mood when workout is fully reset
          preWorkoutMood: null,
          expandedExerciseId: null

        }),
      tick: () =>
        set((state) => ({ elapsedTimeSeconds: state.elapsedTimeSeconds + 1 })),
      addExercise: (exercise: LoggedExercise) =>
        set((state) => {
          if (!state.loggedWorkout) return state;
          return {
            loggedWorkout: {
              ...state.loggedWorkout,
              exercises: [...(state.loggedWorkout.exercises || []), exercise],
            },
          };
        }),
      getExercise: (exerciseId: string) => {
        return get().loggedWorkout?.exercises?.find(
          (exercise: LoggedExercise) => {
            // console.log(exerciseId);
            return exercise.exerciseInfo.exerciseId === exerciseId;
          }
        ) as LoggedExercise;
      },
      updateExerciseSet: (
        exerciseId: string,
        setNumber: number,
        newValue: Partial<LoggedSet>
      ) => {
        set((state) => {
          if (!state.loggedWorkout || !state.loggedWorkout.exercises) {
            return state;
          }

          const updatedExercises = state.loggedWorkout.exercises.map((ex) => {
            if (ex.exerciseInfo.exerciseId !== exerciseId) return ex;
            const updatedSets = ex.sets.map((set) =>
              set.setNumber === setNumber ? { ...set, ...newValue } : set
            );
            return { ...ex, sets: updatedSets };
          });

          console.log(
            `updated set: ${setNumber} for exerciseId: ${exerciseId}.`
          );
          console.log(updatedExercises);
          return {
            loggedWorkout: {
              ...state.loggedWorkout,
              exercises: updatedExercises,
            },
          };
        });
      },
      updateWorkout: (newValue: Partial<LoggedWorkout>) => {
        set((state) => {
          if (!state.loggedWorkout) {
            return state;
          }
          console.log("updating workout with new value: ", newValue);
          return { loggedWorkout: { ...state.loggedWorkout, ...newValue } };
        });
      },
      updateExercise: (
        exerciseId: string,
        newValue: Partial<LoggedExercise>
      ) => {
        set((state) => {
          if (!state.loggedWorkout || !state.loggedWorkout.exercises) {
            return state;
          }
          const updatedExercises = state.loggedWorkout.exercises.map((ex) => {
            if (ex.exerciseInfo.exerciseId !== exerciseId) return ex;
            return { ...ex, ...newValue };
          });
          return {
            loggedWorkout: {
              ...state.loggedWorkout,
              exercises: updatedExercises,
            },
          };
        });
      },
      calculateTotalVolume: () => {
        const exercises = get().loggedWorkout?.exercises;
        if (!exercises) return 0;

        const totalVolume = exercises.reduce((exerciseSum, ex) => {
          const exerciseVolume = ex.sets.reduce((setSum, set) => {
            if (set.completed === false) return setSum;
            const reps = set.actualReps || 0;
            const weight = set.actualWeightKg || 0;
            return setSum + reps * weight;
          }, 0);

          return exerciseSum + exerciseVolume;
        }, 0);

        return totalVolume;
      },
      calculateTotalSetsFinished: () => {
        const exercises = get().loggedWorkout?.exercises;
        if (!exercises) return 0;

        const totalSets = exercises.reduce((exerciseSetSum, ex) => {
          const completedSets = ex.sets.filter((set) => set.completed).length;
          return exerciseSetSum + completedSets;
        }, 0);

        return totalSets;
      },
      setExpandedExerciseId: (newId) => {
        set({ expandedExerciseId: newId ?? null });
      },
    }),
    { name: "workout-storage" }
  )
);
