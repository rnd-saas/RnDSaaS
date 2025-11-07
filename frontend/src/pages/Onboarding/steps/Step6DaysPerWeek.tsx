import {FieldDescription, FieldLabel, FieldSet} from "@/components/ui/field.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";


export default function Step6DaysPerWeek() {

    return (
        <div className="w-full max-w-md">
            <FieldSet>
                <FieldLabel>Days per week</FieldLabel>
                <FieldDescription>
                    How many days per week would you like to train?
                </FieldDescription>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select the number of days"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                    </SelectContent>
                </Select>
            </FieldSet>
        </div>
    )
}