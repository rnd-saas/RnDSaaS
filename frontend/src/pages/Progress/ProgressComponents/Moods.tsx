import {MoodOptions} from "@/utils/MoodOptions.tsx";
import type {ChartConfig} from "@/components/ui/chart.tsx";
import {ChartContainer} from "@/components/ui/chart.tsx";
import {CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from "recharts";

export default function Moods(){
    const latestMoods = [
        {date: "2025-11-02T09:00:00", mood: MoodOptions.insecure},
        {date: "2025-11-02T11:00:00", mood: MoodOptions.fine},
        {date: "2025-11-04T15:00:00", mood: MoodOptions.anxious},
        {date: "2025-11-05T16:00:00", mood: MoodOptions.comfortable},
    ];

    const chartConfig = {
        moods: {
            label: "Mood",
        },
    } satisfies ChartConfig

    return(
        <div>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <ScatterChart
                    style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                    responsive
                    margin={{
                        top: 20,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="time" unit="days" />
                    <YAxis type="number" dataKey="y" name="mood" width="auto" />
                    <Scatter name="Moods" data={latestMoods} />
                </ScatterChart>
            </ChartContainer>
        </div>
    )
}