import { useEffect } from "react";
import { useWorkoutStore } from "./workoutStore";

// timer needs to start whenever isRunning becomes true essentially.

export default function GlobalTimeRunner() {
  const isRunning = useWorkoutStore((state) => state.isRunning);
  const tick = useWorkoutStore((state) => state.tick);
  const elapsedTimeSeconds = useWorkoutStore(
    (state) => state.elapsedTimeSeconds
  );

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, tick]);

  useEffect(() => {
    // console.log(
    //   "GlobalTimeRunner - isRunning:",
    //   isRunning,
    //   " with value of ",
    //   elapsedTimeSeconds
    // );
  }, [isRunning, elapsedTimeSeconds]);
  return null;
}
