import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from "recharts";
import {useState, useEffect} from "react";
import {progressService} from "@/lib/api";

export default function PersonalData(){
    const [weightValues, setWeightValues] = useState<Array<{label: string; value: number; date: string}>>([]);
    const [bmiValues, setBmiValues] = useState<Array<{label: string; value: number; date: string}>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [weightResponse, bmiResponse] = await Promise.all([
                progressService.getPersonalData('weight'),
                progressService.getPersonalData('bmi')
            ]);
            setWeightValues(weightResponse.data);
            setBmiValues(bmiResponse.data);
        } catch (error) {
            console.error('Failed to load personal data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toChart = (values: {date: string, value: number}[]) =>
        values.map((d) => ({ x: new Date(d.date).getTime(), y: d.value }));

    const dataTracked = [
        {value: "weight", values: weightValues, setFn: setWeightValues, data: toChart(weightValues), canEdit: true},
        {value: "bmi", values: bmiValues, setFn: setBmiValues, data: toChart(bmiValues), canEdit: false}
    ];
    const allXValues = dataTracked.flatMap(item => item.data.map((p: {x: number}) => p.x));
    const minDate = allXValues.length > 0 ? new Date(Math.min(...allXValues)) : new Date();
    const maxDate = allXValues.length > 0 ? new Date(Math.max(...allXValues)) : new Date();
    const dayTicks: number[] = []; const current = new Date(minDate);
    current.setHours(0, 0, 0, 0); while (current <= maxDate) {
        dayTicks.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }

    const handleAddValue = async (item: any, enteredValue: string) => {
        if (!enteredValue) return;

        // BMI cannot be manually entered - it's calculated from weight and height
        if (item.value === 'bmi') {
            alert('BMI is automatically calculated from your weight and height. Please update your weight instead.');
            return;
        }

        try {
            const value = Number(enteredValue);
            await progressService.addPersonalData(item.value as 'weight', value);
            
            // Reload data to get updated weight and BMI history
            await loadData();
        } catch (error: any) {
            console.error('Failed to save personal data:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Failed to save data. Please try again.';
            alert(errorMessage);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-4">Loading personal data...</div>;
    }

    return(
        <div>
            {dataTracked.map((item) => (
                <div key={item.value} className="w-full text-left mb-6">
                    <p className="mb-2">{item.value} over time</p>
                    {item.data.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-500 border border-gray-200 rounded">
                            No {item.value} data available. Add your first entry below.
                        </div>
                    ) : (
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
                    )}
                    {item.canEdit ? (
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
                    ) : (
                        <div className={"pb-10 pt-2 text-sm text-muted-foreground"}>
                            <p>BMI is automatically calculated from your weight and height.</p>
                            <p>Update your weight to see BMI changes.</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}