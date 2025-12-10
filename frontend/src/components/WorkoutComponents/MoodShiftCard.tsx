import { Card, CardContent } from "@/components/card";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MoodShiftProps {
  beforeMood: string; // e.g., "😣"
  afterMood: string;  // e.g., "😌"
  beforeLabel: string; // e.g., "Anxious"
  afterLabel: string;  // e.g., "Relieved"
  // NEW: Numeric values to calculate trend
  beforeValue: number;
  afterValue: number;
}

export default function MoodShiftCard({ 
  beforeMood, 
  afterMood, 
  beforeLabel, 
  afterLabel,
  beforeValue,
  afterValue
}: MoodShiftProps) {
  
  let message = "";
  let icon = null;
  let colorClass = "";

  if (afterValue > beforeValue) {
    message = "You successfully shifted your mindset!";
    icon = <TrendingUp className="w-4 h-4" />;
    colorClass = "text-green-600";
  } else if (afterValue === beforeValue) {
    message = "You showed up and stayed consistent.";
    icon = <Minus className="w-4 h-4" />;
    colorClass = "text-blue-600";
  } else {
    message = "It's okay. You still did the work.";
    icon = <TrendingDown className="w-4 h-4" />;
    colorClass = "text-orange-600";
  }

  return (
    <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold text-foreground">Mental Shift</h3>
        
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Before State */}
          <div className="flex flex-col items-center gap-2 opacity-70 grayscale">
            <span className="text-4xl">{beforeMood}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Before</span>
            <span className="text-sm font-semibold">{beforeLabel}</span>
          </div>

          {/* Transition Arrow */}
          <div className="flex flex-col items-center text-primary/50">
            <ArrowRight size={24} />
          </div>

          {/* After State */}
          <div className={`flex flex-col items-center gap-2 scale-110 transition-transform ${afterValue > beforeValue ? 'animate-pulse' : ''}`}>
            <span className="text-5xl drop-shadow-sm">{afterMood}</span>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Now</span>
            <span className="text-sm font-bold text-primary">{afterLabel}</span>
          </div>
        </div>

        <div className={`flex items-center gap-2 text-sm font-medium mt-2 ${colorClass}`}>
          {icon}
          <p>{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}