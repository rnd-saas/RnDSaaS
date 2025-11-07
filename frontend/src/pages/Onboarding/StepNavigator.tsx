import { Button } from "@/components/ui/button"

interface ProgressDefinitions{
    prevStep: () => void,
    nextStep: () => void,
    prevDisabled: boolean,
    nextDisabled: boolean
}
export default function StepNavigator({prevStep, nextStep, prevDisabled, nextDisabled}: ProgressDefinitions) {

    return (
        <div className="flex justify-between">
            <Button type={"button"} size="sm" onClick={prevStep} disabled={prevDisabled}>
                Previous
            </Button>
            <Button type={"button"} size="sm" onClick={nextStep} disabled={nextDisabled}>
                Next
            </Button>
        </div>
    )
}