import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/backButton";
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
      "You might be feeling uneasy or self-conscious today — that’s okay. Take things slowly, focus on your breathing, and remember: showing up is already progress.",
    level: 1,
    anxious: true,
  },
  {
    key: "nervous",
    label: "I feel nervous",
    emoji: "😬",
    short: "Nervous",
    explanation:
      "You’ve got some butterflies, but that just means you care. A quick warm-up or focusing on one simple goal can help ease that tension.",
    level: 2,
  },
  {
    key: "okay",
    label: "I feel fine most of the time",
    emoji: "🙂",
    short: "Okay",
    explanation:
      "You’re managing things well overall. Some ups and downs are natural — you’re finding balance and building consistency.",
    level: 3,
  },
  {
    key: "comfortable",
    label: "I’m comfortable",
    emoji: "😄",
    short: "Comfortable",
    explanation:
      "You feel confident and settled in your routine. It’s a great place to be — keep that positive momentum going.",
    level: 4,
  },
  {
    key: "never",
    label: "I feel great today",
    emoji: "🤩",
    short: "Great",
    explanation:
      "You’re in a really good headspace — energetic, confident, and ready to go. Enjoy that boost and make the most of it!",
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
    <div className="w-full max-w-md min-h-[75vh] flex flex-col mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Mood</h1>
            <p className="text-sm text-muted-foreground">
              How are you feeling about the gym right now?
            </p>
          </div>
        </div>
      </header>
  
      <Separator className="my-2" />
  
      {/* Mood options */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Pick your current mood</h2>
  
        <div className="grid grid-cols-1 gap-3">
          {MOODS.map((m) => {
            const active = m.key === selected;
  
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setSelected(m.key)}
                aria-pressed={active}
                className={[
                  "group relative flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all",
                  "bg-background hover:bg-accent/30",
                  active
                    ? "border-foreground ring-2 ring-foreground/20 bg-gradient-to-r from-accent/50 to-transparent"
                    : "border-border",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "grid h-10 w-10 place-items-center rounded-full text-xl",
                      active ? "bg-foreground/10" : "bg-muted",
                    ].join(" ")}
                  >
                    {m.emoji}
                  </div>
  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{m.label}</span>
  
                    {/* Comfort meter */}
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={[
                              "inline-block h-1.5 w-5 rounded-full",
                              idx < m.level ? "bg-foreground/80" : "bg-muted",
                            ].join(" ")}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {m.level}/5
                      </span>
                    </div>
                  </div>
                </div>
  
                {/* Right-side selected indicator */}
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full transition-colors",
                    active ? "bg-foreground" : "bg-muted",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </section>
  
      {/* Sticky save bar */}
      <div className="pointer-events-none sticky bottom-[72px] mt-2">
        <div className="pointer-events-auto mx-auto max-w-screen-sm rounded-xl bg-background/80 p-2 backdrop-blur">
          <Button onClick={saveMood} className="w-full rounded-xl">
            Save mood
          </Button>
        </div>
      </div>
  
      <Separator className="my-4" />
  
      {/* Explanation */}
      <section className="space-y-4">
        <Card className="bg-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">{selectedMood.emoji}</span>
              <span>Your mood: {selectedMood.short}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {selectedMood.explanation}
          </CardContent>
        </Card>
  
        {/* If anxious, show calming advice */}
        {selectedMood.anxious && (
          <Card className="bg-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">If you’re feeling anxious</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                {ANXIETY_ADVICE.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
  
              <Button
                variant="secondary"
                className="mt-1 w-full rounded-xl"
                onClick={() => navigate("/chatbot")}
              >
                Talk to your coach
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
  
}
