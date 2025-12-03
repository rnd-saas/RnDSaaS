import { Card, CardContent } from "@/components/card.tsx";

export default function Achievement({
  title,
  sub,
  image,
  obtained,
}: {
  title: string;
  sub: string;
  image: string;
  obtained: boolean;
}) {
  return (
    <Card
      className="flex-1 w-[20vw] md:w-[15vw] lg:w-[10vw] justify-between p-0 shadow-none border-0 bg-primary-disabled/20 hover:scale-none"
      style={{ opacity: obtained ? 1 : 0.3 }}
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="text-4xl">{image}</div>
        <div className="text-center body-stlyles font-medium leading-tight">
          {title}
        </div>
        <div className="text-center caption-styles text-muted-foreground -mt-1">
          {sub}
        </div>
      </CardContent>
    </Card>
  );
}
