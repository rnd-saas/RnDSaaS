export const MOOD_STRING_TO_INT: Record<string, number> = {
  'depressed': 0,
  'anxious': 1,
  'neutral': 2,
  'confident': 3,
  'happy': 4,
};

export const MOOD_INT_TO_STRING: Record<number, string> = Object.entries(MOOD_STRING_TO_INT).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

export function getMoodInt(mood: string): number | undefined {
  return MOOD_STRING_TO_INT[mood];
}

export function getMoodString(mood: number): string | undefined {
  return MOOD_INT_TO_STRING[mood];
}
