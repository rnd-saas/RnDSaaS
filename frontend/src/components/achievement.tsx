import { Card, CardContent } from "@/components/card";
import { cn } from "@/lib/utils";

export default function Achievement({
  title,
  sub,
  image,
  obtained,
  className,
}: {
  title: string;
  sub: string;
  image: string;
  obtained: boolean;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between p-0 shadow-none border-0 hover:scale-none",
        obtained
          ? "bg-primary/10 opacity-100"
          : "bg-muted/50 opacity-70 grayscale border border-border/50",
        className
      )}
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 py-4 px-2 h-full">
        <div
          className={cn(
            "w-12 h-12 flex items-center justify-center overflow-hidden text-4xl mb-1",
            obtained ? "" : "grayscale opacity-60"
          )}
          style={{ lineHeight: "1" }}
        >
          {image}
        </div>
        <div className="text-center text-sm font-semibold leading-tight w-full break-words px-1">
          {title}
        </div>
        <div className="text-center text-xs text-muted-foreground w-full break-words px-1">
          {sub}
        </div>
      </CardContent>
    </Card>
  );
}
