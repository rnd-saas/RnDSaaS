import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Controller, useFormContext} from "react-hook-form";
import type {Inputs} from "@/pages/Onboarding/OnboardingManager.tsx";


export default function Step9ProtectedAreas() {
    const { control } = useFormContext<Inputs>();
    const areaOptions = [
        { value: "shoulders", label: "Shoulders" },
        { value: "lower-back", label: "Lower back" },
        { value: "knees", label: "Knees" },
        { value: "none", label: "None" },
    ];

    function toggleCheckbox(selected: string[], field, value: string) {
        if (selected.includes(value)) {
            field.onChange(selected.filter(v => v !== value));
        } else {
            field.onChange([...selected, value]);
        }
    }

    function toggleOther(selected: string[], field, checked: boolean) {
        if (!checked) {
            field.onChange(selected.filter(v => !v.startsWith("other:")));
        } else {
            field.onChange([...selected, "other:"]);
        }
    }

    function updateOtherText(selected: string[], field, text: string) {
        const withoutOther = selected.filter(v => !v.startsWith("other:"));
        if (text.trim() === "") {
            field.onChange(withoutOther);
        } else {
            field.onChange([...withoutOther, `other:${text.trim()}`]);
        }
    }

    return (
        <FieldGroup  className="w-[60vw] lg:w-[30vw] lg:ml-[30vw]">
            <FieldSet>
                <FieldLegend variant="label">Vulnerable areas</FieldLegend>
                <FieldDescription>
                    Are there any areas you want to protect that need to be taken into account?
                </FieldDescription>
                <Controller name="problemAreas" control={control} defaultValue={[]}
                    render={({ field }) => {
                        const selected = field.value || [];
                        const hasOther = selected.some(v => v.startsWith("other:"));
                        const otherText = hasOther ? selected.find(v => v.startsWith("other:"))!.replace("other:", "") : "";
                        return (
                            <div className="flex flex-col gap-4">
                                {areaOptions.map(area => (
                                    <Field orientation="horizontal" key={area.value}>
                                        <Checkbox id={area.value} checked={selected.includes(area.value)}
                                                  onCheckedChange={() => toggleCheckbox(selected, field, area.value)}
                                        />
                                        <FieldLabel htmlFor={area.value} className="font-normal">{area.label}</FieldLabel>
                                    </Field>
                                ))}
                                <Field orientation="horizontal">
                                    <Checkbox id="other" checked={hasOther}
                                        onCheckedChange={checked => toggleOther(selected, field, checked)}
                                    />
                                    <FieldLabel htmlFor="other" className="font-normal">Other</FieldLabel>
                                </Field>
                                {hasOther && (
                                    <Field orientation="vertical">
                                        <FieldLabel htmlFor="other-input" className="font-normal">Which other areas? (separate by commas)</FieldLabel>
                                        <Input id="other-input" type="text" value={otherText}
                                            onChange={e => updateOtherText(selected, field, e.target.value)}
                                        />
                                    </Field>
                                )}
                            </div>
                        );
                    }}
                />
            </FieldSet>
        </FieldGroup>
    )
}