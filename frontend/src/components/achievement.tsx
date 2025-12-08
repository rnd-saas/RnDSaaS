import { Card, CardContent } from "@/components/card";

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
      className={`flex-1 max-w-[20vw] md:max-w-[15vw] lg:max-w-[10vw] justify-between p-0 shadow-none border-0 hover:scale-none ${
        obtained 
          ? 'bg-primary-disabled/20 opacity-100' 
          : 'bg-muted/50 opacity-70 grayscale border border-border/50'
      }`}
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 py-4">
        <div 
          className={`w-12 h-12 flex items-center justify-center overflow-hidden ${obtained ? '' : 'grayscale opacity-60'}`}
          style={{ fontSize: '2.5rem', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontSize: '2.5rem', lineHeight: '1', display: 'inline-block' }}>{image}</span>
        </div>
        <div className={`text-center body-stlyles font-medium leading-tight ${
          obtained 
            ? '' 
            : 'text-foreground/70'
        }`}>
          {title}
        </div>
        <div className={`text-center caption-styles -mt-1 ${
          obtained 
            ? 'text-muted-foreground' 
            : 'text-muted-foreground/80'
        }`}>
          {sub}
        </div>
      </CardContent>
    </Card>
  );
}
