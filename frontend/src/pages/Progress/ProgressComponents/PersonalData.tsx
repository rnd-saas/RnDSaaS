import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from "recharts";
import {useState} from "react";

export default function PersonalData(){
    const [weightValues, setWeightValues] = useState([
        {label: "weight", value: 60, date: "2025-11-02T09:00:00"},
        {label: "weight", value: 59, date: "2025-11-05T09:00:00"},
        {label: "weight", value: 60, date: "2025-11-08T09:00:00"}
    ]);
    const [bmiValues, setBmiValues] = useState([
        {label: "bmi", value: 15, date: "2025-11-02T09:00:00"},
        {label: "bmi", value: 15, date: "2025-11-04T09:00:00"},
        {label: "bmi", value: 14, date: "2025-11-06T09:00:00"},
    ]);
    const toChart = (values: {date: string, value: number}[]) =>
        values.map((d) => ({ x: new Date(d.date).getTime(), y: d.value }));

    const dataTracked = [
        {value: "weight", values: weightValues, setFn: setWeightValues, data: toChart(weightValues)},
        {value: "bmi", values: bmiValues, setFn: setBmiValues, data: toChart(bmiValues)}
    ];
    const allXValues = dataTracked.flatMap(item => item.data.map((p: {x: number}) => p.x));
    const minDate = new Date(Math.min(...allXValues));
    const maxDate = new Date(Math.max(...allXValues));
    const dayTicks: number[] = []; const current = new Date(minDate);
    current.setHours(0, 0, 0, 0); while (current <= maxDate) {
        dayTicks.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }

    const handleAddValue = (item: any, enteredValue: string) => {
        if (!enteredValue) return;

        const newEntry = {
            label: item.value,
            value: Number(enteredValue),
            date: new Date().toISOString() // Now
        };

        item.setFn((prev: any[]) => [...prev, newEntry]);
    };

    return(
        <div>
            {dataTracked.map((item) => (
                <div key={item.value} className="w-full text-left">
                    <p>{item.value} over time</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid/>
                            <XAxis dataKey="x" name="Date" type="number" domain={["dataMin", "dataMax"]}
                                   ticks={dayTicks}
                                   tickFormatter={(ts: number) => new Date(ts).toLocaleDateString(undefined, {weekday: "short",})}
                            />
                            <YAxis dataKey="y" name={item.value} domain={[0, "dataMax+5"]} />
                            <Scatter name={item.value} data={item.data}/>
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div className={"pb-10 pt-2 flex gap-2"}>
                        <Label className={"font-normal"} htmlFor={item.value}>Log {item.value}:</Label>
                        <Input id={item.value} type="number" className="w-20"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const target = e.target as HTMLInputElement;
                                    handleAddValue(item, target.value);
                                    target.value = ""; // Clear input
                                }
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}