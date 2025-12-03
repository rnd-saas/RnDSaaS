import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export default function Workouts(){
    const latestWorkouts = [
        {date: "2025-11-02T09:00:00", length:45},
        {date: "2025-11-02T11:00:00", length: 15},
        {date: "2025-11-04T15:00:00", length: 60},
        {date: "2025-11-05T16:00:00", length: 75},
    ];
    const data = latestWorkouts.map((d) => ({
        time: new Date(d.date).getTime(),
        duration: d.length,
    }));

    const minDate = new Date(Math.min(...data.map(d => d.time)));
    const maxDate = new Date(Math.max(...data.map(d => d.time)));
    const dayTicks = [];
    const current = new Date(minDate);
    current.setHours(0, 0, 0, 0);
    while (current <= maxDate) {
        dayTicks.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }

    return(
        <div className="h-[25vh] w-full">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis
                        dataKey="time"
                        name="Day"
                        ticks={dayTicks}
                        tickFormatter={ts => new Date(ts).toLocaleDateString(undefined, { weekday: "short" })}
                        type="number"
                        domain={["dataMin", "dataMax"]}
                    />
                    <YAxis
                        dataKey="duration"
                        name="Length"
                        domain={[0, 'dataMax+10']}
                    />
                    <Tooltip
                        labelFormatter={ts => new Date(ts).toLocaleDateString()}
                    />
                    <Bar dataKey="duration"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}