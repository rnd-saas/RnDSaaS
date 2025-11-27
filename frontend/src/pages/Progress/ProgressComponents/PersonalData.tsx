import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";

export default function PersonalData(){
    const initialValues =[
        {label: "bmi", value: 15},
        {label: "weight", value: 60}
    ]
    return(
        <div>
            {initialValues.map((g) => (
                <div className="flex items-center gap-2">
                    <Label className={"font-normal"} htmlFor={g.label}>Your {g.label}:</Label>
                    <Input id="weight" type="number" className="w-20" value={g.value}/>
                </div>
            ))}
        </div>
    )
}