"use client";
import { CHART_DATA } from "@/components/ui/charts/chart-data";
import { LineChart } from "@/components/ui/charts/line-chart";

export default function DemoLineChart() {
  return (
    <LineChart
      className="h-80"
      data={CHART_DATA}
      index="date"
      categories={["SolarPanels", "Inverters"]}
      valueFormatter={(number: number) =>
        `$${Intl.NumberFormat("us").format(number).toString()}`
      }
      onValueChange={(v) => console.log(v)}
    />
  );
}
