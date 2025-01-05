"use client";

import { BarChart } from "@/components/ui/charts/bar-chart";
import { CHART_DATA } from "@/components/ui/charts/chart-data";

export default function DemoBarChart() {
  return (
    <BarChart
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
