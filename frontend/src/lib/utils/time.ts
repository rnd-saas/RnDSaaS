/** helper function to calculate rest times from 5 s to 5 minutes*/
export function calculateRestTimeOptions(
  startTime: number,
  endTime: number
): number[] {
  const options: number[] = [];
  for (let i = startTime; i <= endTime; i += 5) {
    options.push(i);
  }
  return options;
}

/** helper function to convert time in seconds to format "xm ys" */
export function formatRestTime(seconds: number): string {
  if (seconds == 0) return "0s";
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return minutes > 0 ? `${minutes}m ${sec}s` : `${sec}s`;
}
