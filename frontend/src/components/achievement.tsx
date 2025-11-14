import {Card, CardContent} from "@/components/card.tsx";

export default function Achievement({ title, sub, emoji }: { title: string; sub: string; emoji: string }) {
    return (
        <Card className="min-w-[120px] justify-between bg-emerald-200/30 p-0 shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-4">
                <div className="text-4xl">{emoji}</div>
                <div className="text-center text-sm font-medium leading-tight">{title}</div>
                <div className="text-center text-xs text-muted-foreground -mt-1">{sub}</div>
            </CardContent>
        </Card>
    );
}