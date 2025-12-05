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
            
            // Calculate start of week (Monday)
            const today = new Date();
            const dayOfWeek = today.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - daysToMonday);
            startOfWeek.setHours(0, 0, 0, 0);
            
            // Filter and map data to only include this week's data
            const fillWeekData = (responseData: Array<{label: string; value: number; date: string}>) => {
                // Create a map of date string (YYYY-MM-DD) to the latest value for that day
                const dataMap = new Map<string, {value: number; date: string}>();
                responseData.forEach((d) => {
                    const date = new Date(d.date);
                    date.setHours(0, 0, 0, 0);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    // Keep the latest entry if multiple entries exist for the same day
                    const existing = dataMap.get(dateStr);
                    if (!existing || new Date(d.date) > new Date(existing.date)) {
                        dataMap.set(dateStr, { value: d.value, date: d.date });
                    }
                });
                
                // Only include days that have data within this week
                const weekData: Array<{label: string; value: number; date: string}> = [];
                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startOfWeek);
                    currentDate.setDate(startOfWeek.getDate() + i);
                    currentDate.setHours(0, 0, 0, 0);
                    const dateStr = currentDate.toISOString().split('T')[0];
                    
                    // Only include days that have data
                    const entry = dataMap.get(dateStr);
                    if (entry) {
                        weekData.push({
                            label: responseData[0]?.label || '',
                            value: entry.value,
                            date: currentDate.toISOString() // Use normalized date to ensure alignment with X-axis ticks
                        });
                    }
                }
                
                return weekData;
            };
            
            setWeightValues(fillWeekData(weightResponse.data));
            setBmiValues(fillWeekData(bmiResponse.data));
        } catch (error) {
            console.error('Failed to load personal data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toChart = (values: {date: string, value: number}[]) =>
        values.map((d) => {
            // Normalize date to midnight local time to ensure alignment with X-axis ticks
            const date = new Date(d.date);
            date.setHours(0, 0, 0, 0);
            return { x: date.getTime(), y: d.value };
        });

    const dataTracked = [
        {value: "weight", values: weightValues, setFn: setWeightValues, data: toChart(weightValues), canEdit: true},
        {value: "bmi", values: bmiValues, setFn: setBmiValues, data: toChart(bmiValues), canEdit: false}
    ];
    // Calculate start of week (Monday) for consistent X-axis ticks
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Generate ticks for all 7 days of the week
    const dayTicks: number[] = [];
    const current = new Date(startOfWeek);
    current.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
        dayTicks.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }
    
    const minDate = startOfWeek;
    const maxDate = new Date(startOfWeek);
    maxDate.setDate(startOfWeek.getDate() + 6);

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
                                <XAxis 
                                    dataKey="x" 
                                    name="Date" 
                                    type="number" 
                                    domain={[minDate.getTime(), maxDate.getTime()]}
                                    ticks={dayTicks}
                                    tickFormatter={(ts: number) => new Date(ts).toLocaleDateString(undefined, {weekday: "short"})}
                                />
                                <YAxis 
                                    dataKey="y" 
                                    name={item.value} 
                                    domain={[0, "dataMax+5"]}
                                    tickFormatter={(value: number) => 
                                        item.value === 'bmi' ? value.toFixed(2) : value.toString()
                                    }
                                />
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