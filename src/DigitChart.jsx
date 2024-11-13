"use client"

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const DigitChart = ({ data }) => {
  const chartData = data.map((value, index) => ({
    digit: index,
    value,
  }));
  console.log("chart data", data)
  console.log(chartData, chartData)

  const chartConfig = {
    label: "Prediction",
    color: "hsl(var(--chart-1))", // Adjust the color as needed
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction</CardTitle>
        <CardDescription>Digit Prediction Chart</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={580} height={440} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="digit"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing prediction results for digits 0-9
        </div>
      </CardFooter>
    </Card>
  );
};

export default DigitChart;
