import { Progress } from "@/components/ui/progress"

interface ProgressDefinitions{
    currentStep:number;
    totalSteps:number;
}
export default function FormProgress({currentStep, totalSteps}: ProgressDefinitions) {
    const progress = (currentStep / totalSteps) * 100

    return (
        <div
            className="flex justify-center self-start pt-6 w-full"
            style={{
                all: 'revert',
                display: 'flex',
                justifyContent: 'center',
                alignSelf: 'flex-start',
                paddingTop: '1.5rem',
                width: '100%',
                fontSize: '14px',
                lineHeight: '1.5',
                letterSpacing: 'normal'
            }}
        >
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <div className="inline-flex items-center justify-center h-auto">
                        <span className="[font-family:'Comfortaa-Bold',Helvetica] font-bold text-[color:var(--basic-colours-green-950)] text-xs tracking-[0] leading-5 whitespace-nowrap">
                          {currentStep} / {totalSteps}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}