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
import { HyperText } from "./ui/hyper-text"
import { HistoryEntry } from "@/app/velocity/user/[profile]/page"

const chartConfig = {
    wpm: {
        label: "WPM",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export const Chart = ({ userData, totalTest }: { userData: HistoryEntry[] | null, totalTest: number }) => {

    return (
        <Card >
            <CardContent className="px-2 sm:p-6 bg-slate-900 rounded-b-xl">
                {totalTest > 0 ? <div>
                    <span className="flex space-x-1">
                        <span>   Last</span>
                        <HyperText animateOnHover={false}>{totalTest.toString()}</HyperText>
                        <span> Tests</span>
                    </span>
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[200px] w-full"
                    >
                        <LineChart
                            accessibilityLayer
                            data={userData!}
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
                </div> : <div className="w-full flex justify-center items-center h-[200px]">No History</div>
                }
            </CardContent>
        </Card >
    )
}
