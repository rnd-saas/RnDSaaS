import {Card, CardContent} from "@/components/card.tsx";

export default function Achievement({ title, sub, image, obtained }: { title: string; sub: string; image: string, obtained: boolean }) {
    return (
        <Card className="min-w-[120px] justify-between bg-[var(--color-primary-disabled)] p-0 shadow-none " style={{opacity:obtained? 1: 0.3}}>
            <CardContent className="flex flex-col items-center justify-center gap-2 py-4">
                <div className="text-4xl">{image}</div>
                <div className="text-center text-sm font-medium leading-tight">{title}</div>
                <div className="text-center text-xs text-muted-foreground -mt-1">{sub}</div>
            </CardContent>
        </Card>
    );
}