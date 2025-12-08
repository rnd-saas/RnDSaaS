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
        // Removed max-w-[20vw] constraints
        // Added min-w to prevent squishing
        "flex flex-col justify-between p-0 shadow-none border-0 bg-primary/5 hover:scale-none min-w-[100px]",
        className
      )}
      style={{ opacity: obtained ? 1 : 0.4 }}
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 py-4 px-2 h-full">
        <div className="text-3xl md:text-4xl mb-1">{image}</div>
        <div className="text-center text-sm font-semibold leading-tight w-full break-words">
          {title}
        </div>
        <div className="text-center text-xs text-muted-foreground w-full break-words">
          {sub}
        </div>
      </CardContent>
    </Card>
  );
}
