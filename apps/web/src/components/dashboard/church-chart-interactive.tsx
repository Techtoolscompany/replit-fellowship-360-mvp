'use client'

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Church attendance and engagement chart"

const chartData = [
  { date: "2024-01-01", attendance: 180, visitors: 12 },
  { date: "2024-01-08", attendance: 195, visitors: 8 },
  { date: "2024-01-15", attendance: 220, visitors: 15 },
  { date: "2024-01-22", attendance: 205, visitors: 10 },
  { date: "2024-01-29", attendance: 240, visitors: 18 },
  { date: "2024-02-05", attendance: 225, visitors: 14 },
  { date: "2024-02-12", attendance: 260, visitors: 20 },
  { date: "2024-02-19", attendance: 245, visitors: 16 },
  { date: "2024-02-26", attendance: 280, visitors: 22 },
  { date: "2024-03-05", attendance: 265, visitors: 18 },
  { date: "2024-03-12", attendance: 290, visitors: 25 },
  { date: "2024-03-19", attendance: 275, visitors: 20 },
  { date: "2024-03-26", attendance: 300, visitors: 28 },
  { date: "2024-04-02", attendance: 285, visitors: 24 },
  { date: "2024-04-09", attendance: 310, visitors: 30 },
  { date: "2024-04-16", attendance: 295, visitors: 26 },
  { date: "2024-04-23", attendance: 320, visitors: 32 },
  { date: "2024-04-30", attendance: 305, visitors: 28 },
  { date: "2024-05-07", attendance: 330, visitors: 35 },
  { date: "2024-05-14", attendance: 315, visitors: 30 },
  { date: "2024-05-21", attendance: 340, visitors: 38 },
  { date: "2024-05-28", attendance: 325, visitors: 33 },
  { date: "2024-06-04", attendance: 350, visitors: 40 },
  { date: "2024-06-11", attendance: 335, visitors: 36 },
  { date: "2024-06-18", attendance: 360, visitors: 42 },
  { date: "2024-06-25", attendance: 345, visitors: 38 },
]

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "var(--primary)",
  },
  visitors: {
    label: "Visitors",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChurchChartInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-25")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Church Attendance & Visitors</CardTitle>
            <CardDescription>
              <span className="hidden sm:block">
                Weekly attendance and visitor trends
              </span>
              <span className="sm:hidden">Weekly trends</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden sm:flex *:data-[slot=toggle-group-item]:!px-4"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-attendance)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-attendance)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="visitors"
              type="natural"
              fill="url(#fillVisitors)"
              stroke="var(--color-visitors)"
              stackId="a"
            />
            <Area
              dataKey="attendance"
              type="natural"
              fill="url(#fillAttendance)"
              stroke="var(--color-attendance)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
