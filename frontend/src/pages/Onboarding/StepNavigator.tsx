import { Button } from "@/components/ui/button"

interface ProgressDefinitions {
    prevStep: () => void;
    nextStep: () => void;
    prevDisabled: boolean;
    nextDisabled: boolean;
    shouldSubmit: boolean;
    isSubmitting?: boolean;
}

export default function StepNavigator({
    prevStep,
    nextStep,
    prevDisabled,
    nextDisabled,
    shouldSubmit,
    isSubmitting,
}: ProgressDefinitions) {

    return (
        <div className="flex justify-between">
            <Button type={"button"} variant={"outline"} size="sm" onClick={prevStep} disabled={prevDisabled}>
                Previous
            </Button>
            {shouldSubmit && (
                <Button type={"submit"} size="sm" disabled={isSubmitting || nextDisabled}>
                    {isSubmitting ? "Saving..." : "Submit"}
                </Button>
            )}
            {!shouldSubmit && <Button type={"button"} size="sm" onClick={nextStep} disabled={nextDisabled}>
                Next
            </Button>}
        </div>
    )
}