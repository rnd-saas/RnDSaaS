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
  loggedWorkout: LoggedWorkout | null;
  startWorkout: (id: string, loggedExercises) => void;
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
}

export const useWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      elapsedTimeSeconds: 0,
      workoutId: "",
      loggedWorkout: null,
      startWorkout: (id: string, loggedExercises) =>
        set({
          isRunning: true,
          elapsedTimeSeconds: 0,
          workoutId: id,
          loggedWorkout: {
            workoutId: id,
            exercises: loggedExercises,
            startDatetime: new Date(),
            date: new Date().toDateString(),
          },
        }),
      pauseWorkout: () => {
        console.log("run pausing");
        set({
          isRunning: false,
        });
      },
      resetWorkout: () => {
        console.log("stopping timer / workout");
        set({
          isRunning: false,
          workoutId: "",
          elapsedTimeSeconds: 0,
          loggedWorkout: null,
        });
      },
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
          return { loggedWorkout: { ...state.loggedWorkout, ...newValue } };
        });
      },
    }),
    { name: "workout-storage" }
  )
);
