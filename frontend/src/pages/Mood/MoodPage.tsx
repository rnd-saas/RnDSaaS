import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type MoodKey = "anxious" | "nervous" | "okay" | "comfortable" | "never";

const MOODS: {
  key: MoodKey;
  label: string;
  emoji: string;
  short: string;
  explanation: string;
  level: number; // 1..5 comfort scale
  anxious?: boolean;
}[] = [
  {
    key: "anxious",
    label: "I feel anxious and insecure",
    emoji: "😣",
    short: "Anxious",
    explanation:
      "It’s totally normal to feel anxious or insecure at the gym. New environments, unfamiliar equipment, or comparing yourself to others can make your body go into ‘alert mode’.",
    level: 1,
    anxious: true,
  },
  {
    key: "nervous",
    label: "I feel nervous",
    emoji: "😬",
    short: "Nervous",
    explanation:
      "Feeling nervous usually means you care and you’re pushing yourself outside your comfort zone. That’s often the first step to building confidence.",
    level: 2,
  },
  {
    key: "okay",
    label: "I feel fine most of the time",
    emoji: "🙂",
    short: "Okay",
    explanation:
      "You’re doing alright overall. You may still have moments of doubt, but you’re managing them and showing up anyway.",
    level: 3,
  },
  {
    key: "comfortable",
    label: "I’m comfortable",
    emoji: "😄",
    short: "Comfortable",
    explanation:
      "Great! You’re feeling at home in the gym. This is where progress feels sustainable and enjoyable.",
    level: 4,
  },
  {
    key: "never",
    label: "I have never been",
    emoji: "🆕",
    short: "New here",
    explanation:
      "No worries at all. Everyone starts somewhere. The most important thing is that you’re curious and open to trying.",
    level: 5,
  },
];

const ANXIETY_ADVICE = [
  "Focus on your own plan, not other people. Most are busy with themselves.",
  "Start with a simple warm-up you know. Familiar steps reduce stress.",
  "If you’re unsure about a machine, watch one person use it first or ask staff.",
  "Set a tiny goal for today (e.g., 10 minutes). Small wins build confidence.",
  "Try a breathing reset: inhale 4s, hold 2s, exhale 6s, repeat 3 times.",
];

const STORAGE_KEY = "currentMood_v1";

export default function MoodPage() {
  const navigate = useNavigate();

  const savedMoodKey = (localStorage.getItem(STORAGE_KEY) as MoodKey | null) ?? "okay";
  const [selected, setSelected] = useState<MoodKey>(savedMoodKey);

  const selectedMood = useMemo(
    () => MOODS.find((m) => m.key === selected) ?? MOODS[2],
    [selected]
  );

  const saveMood = () => {
    localStorage.setItem(STORAGE_KEY, selected);
    navigate("/dashboard");
  };

  return (
    <>
      {/* Header row */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mood</h1>
          <p className="text-sm text-muted-foreground">
            How are you feeling about the gym right now?
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          Back
        </Button>
      </header>

      <Separator className="my-4" />

      {/* Mood scale / options */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pick your current mood</h2>

        <div className="grid grid-cols-1 gap-3">
          {MOODS.map((m) => {
            const active = m.key === selected;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setSelected(m.key)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors
                  ${active ? "border-foreground bg-accent/40" : "border-border bg-background hover:bg-accent/20"}`}
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">
                    Comfort level: {m.level}/5
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <Button onClick={saveMood} className="w-full rounded-xl">
            Save mood
          </Button>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Explanation */}
      <section className="space-y-3">
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle className="text-lg">
              Your mood: {selectedMood.emoji} {selectedMood.short}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {selectedMood.explanation}
          </CardContent>
        </Card>
      </section>

      {/* If anxious, show calming advice */}
      {selectedMood.anxious && (
        <section className="mt-4 space-y-3">
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-lg">If you’re feeling anxious</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                {ANXIETY_ADVICE.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>

              <Button
                variant="secondary"
                className="mt-2 w-full rounded-xl"
                onClick={() => navigate("/chatbot")}
              >
                Talk to your coach
              </Button>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}
