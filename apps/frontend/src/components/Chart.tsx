"use client"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { date: "2024-04-01", wpm: 150 },
    { date: "2024-04-02", wpm: 180 },
    { date: "2024-04-03", wpm: 120 },
    { date: "2024-04-04", wpm: 260 },
    { date: "2024-04-05", wpm: 290 },
    { date: "2024-04-06", wpm: 340 },
    { date: "2024-04-07", wpm: 180 },
    { date: "2024-04-08", wpm: 320 },
    { date: "2024-04-09", wpm: 110 },
    { date: "2024-04-10", wpm: 190 },
    { date: "2024-04-11", wpm: 350 },
    { date: "2024-04-12", wpm: 210 },
    { date: "2024-04-13", wpm: 380 },
    { date: "2024-04-14", wpm: 220 },
    { date: "2024-04-15", wpm: 170 },
    { date: "2024-04-16", wpm: 190 },
    { date: "2024-04-17", wpm: 360 },
    { date: "2024-04-18", wpm: 410 },
    { date: "2024-04-19", wpm: 180 },
    { date: "2024-04-20", wpm: 150 },
    { date: "2024-04-21", wpm: 200 },
    { date: "2024-04-22", wpm: 170 },
    { date: "2024-04-23", wpm: 230 },
    { date: "2024-04-24", wpm: 290 },
    { date: "2024-04-25", wpm: 250 },
    { date: "2024-04-26", wpm: 130 },
    { date: "2024-04-27", wpm: 420 },
    { date: "2024-04-28", wpm: 180 },
    { date: "2024-04-29", wpm: 240 },
    { date: "2024-04-30", wpm: 380 },
    { date: "2024-05-01", wpm: 220 },
    { date: "2024-05-02", wpm: 310 },
    { date: "2024-05-03", wpm: 190 },
    { date: "2024-05-04", wpm: 420 },
    { date: "2024-05-05", wpm: 390 },
    { date: "2024-05-06", wpm: 520 },
    { date: "2024-05-07", wpm: 300 },
    { date: "2024-05-08", wpm: 210 },
    { date: "2024-05-09", wpm: 180 },
    { date: "2024-05-10", wpm: 330 },
    { date: "2024-05-11", wpm: 270 },
    { date: "2024-05-12", wpm: 240 },
    { date: "2024-05-13", wpm: 160 },
    { date: "2024-05-14", wpm: 490 },
    { date: "2024-05-15", wpm: 380 },
    { date: "2024-05-16", wpm: 400 },
    { date: "2024-05-17", wpm: 420 },
    { date: "2024-05-18", wpm: 350 },
    { date: "2024-05-19", wpm: 180 },
    { date: "2024-05-20", wpm: 230 },
    { date: "2024-05-21", wpm: 140 },
    { date: "2024-05-22", wpm: 120 },
    { date: "2024-05-23", wpm: 290 },
    { date: "2024-05-24", wpm: 220 },
    { date: "2024-05-25", wpm: 250 },
    { date: "2024-05-26", wpm: 170 },
    { date: "2024-05-27", wpm: 460 },
    { date: "2024-05-28", wpm: 190 },
    { date: "2024-05-29", wpm: 130 },
    { date: "2024-05-30", wpm: 280 },
    { date: "2024-05-31", wpm: 230 },
    { date: "2024-06-01", wpm: 200 },
    { date: "2024-06-02", wpm: 410 },
    { date: "2024-06-03", wpm: 160 },
    { date: "2024-06-04", wpm: 380 },
    { date: "2024-06-05", wpm: 140 },
    { date: "2024-06-06", wpm: 250 },
    { date: "2024-06-07", wpm: 370 },
    { date: "2024-06-08", wpm: 320 },
    { date: "2024-06-09", wpm: 480 },
    { date: "2024-06-10", wpm: 200 },
    { date: "2024-06-11", wpm: 150 },
    { date: "2024-06-12", wpm: 420 },
    { date: "2024-06-13", wpm: 130 },
    { date: "2024-06-14", wpm: 380 },
    { date: "2024-06-15", wpm: 350 },
    { date: "2024-06-16", wpm: 310 },
    { date: "2024-06-17", wpm: 520 },
    { date: "2024-06-18", wpm: 170 },
    { date: "2024-06-19", wpm: 290 },
    { date: "2024-06-20", wpm: 450 },
    { date: "2024-06-21", wpm: 210 },
    { date: "2024-06-22", wpm: 270 },
    { date: "2024-06-23", wpm: 530 },
    { date: "2024-06-24", wpm: 180 },
    { date: "2024-06-25", wpm: 190 },
    { date: "2024-06-26", wpm: 380 },
    { date: "2024-06-27", wpm: 490 },
    { date: "2024-06-28", wpm: 200 },
    { date: "2024-06-29", wpm: 160 },
    { date: "2024-06-30", wpm: 400 },
]

const chartConfig = {
    wpm: {
        label: "WPM",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export const Chart = () => {

    return (
        <Card className="">
            <CardContent className="px-2 sm:p-6 bg-slate-900 rounded-b-xl">
                <p>Last 100 Tests</p>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[200px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey="wpm"
                            type="monotone"
                            stroke={`var(--color-wpm)`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
