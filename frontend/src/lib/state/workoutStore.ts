import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveWorkoutState {
  isRunning: boolean;
  elapsedTimeSeconds: number;
  workoutId: string | null;

  startWorkout: (id: string) => void;
  pauseWorkout: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const useWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set) => ({
      isRunning: false,
      elapsedTimeSeconds: 0,
      workoutId: null,
      startWorkout: (id: string) =>
        set({ isRunning: true, elapsedTimeSeconds: 0, workoutId: id }),
      pauseWorkout: () => {
        console.log("run pausing");
        set({ isRunning: false });
      },
      resetTimer: () => {
        console.log("stopping timer / workout");
        set({ isRunning: false, workoutId: null, elapsedTimeSeconds: 0 });
      },
      tick: () =>
        set((state) => ({ elapsedTimeSeconds: state.elapsedTimeSeconds + 1 })),
    }),
    { name: "workout-storage" }
  )
);
