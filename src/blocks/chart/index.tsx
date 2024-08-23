import clsx from "clsx";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../common/Chart";
import * as commonStyles from "../../common/Chart/styles.module.css";
import * as styles from "./styles.module.css";
import { getWeekNumber } from "./utils";

export type Column =
  | {
      id: string;
      title: string;
      type: "select";
      options: {
        id: string;
        title: string;
      }[];
    }
  | {
      id: string;
      title: string;
      type: "date";
    };

export type Cell = {
  id: string;
  rowId: string;
  columnId: string;
  textValue: string | null;
  numberValue: number | null;
  dateValue: string | null;
  selectValue: string | null;
  userValue: string | null;
  mutliSelectValue: string[] | null;
};

export type Row = {
  id: string;
  cells: Cell[];
  complete: boolean;
};

export type ChartProps =
  | {
      chartType: "bar";
      columns: Column[];
      rows: Row[]; // raw values (index matches columns)
      option1: string; // x-axis (colummns)
      option2: "count" | "percentage"; // y-axis (
      option3?: "week" | "month" | "year"; // if x-axis is date, then this is the date grouping
    }
  | {
      chartType: "line";
      columns: Column[];
      rows: Row[];
      option1: "date"; // x-axis (colummns)
      option2: "count" | "percentage"; // y-axis (
      option3: "week" | "month" | "year";
    }
  | {
      chartType: "donut";
      columns: Column[];
      rows: Row[];
      option1: string; // label
    }
  | {
      chartType: "radar";
      columns: Column[];
      rows: Row[];
      option1: string; // primary grouping (axis)
      option2: string; // secondary grouping (axis) (used by drill)
    }
  | {
      chartType: "polar";
      columns: Column[];
      rows: Row[];
      option1: string; // primary grouping (axis)
      option2: string; // secondary grouping (axis) (used by drill)
    }
  | {
      chartType: "radial";
      columns: Column[];
      rows: Row[];
    };

export function Chart({ config }: { config: ChartProps }) {
  switch (config.chartType) {
    case "bar":
      return <BarVariant config={config} />;
    case "line":
      return <LineVariant config={config} />;
    case "donut":
      return <DonutVariant config={config} />;
    case "radar":
      return <RadarVariant config={config} />;
    case "polar":
      return <PolarVariant config={config} />;
    case "radial":
      return <RadialVariant config={config} />;
    default:
      return null;
  }
}

function BarVariant({
  config,
}: {
  config: Extract<ChartProps, { chartType: "bar" }>;
}) {
  const column = config.columns.find((c) => c.id === config.option1) as Extract<
    Column,
    { type: "select" }
  >;
  const finalData: Record<string, number> = {};
  const groups = Object.groupBy(config.rows, (row) => {
    const cell = row.cells.find((c) => c.columnId === column.id)!;
    return cell.selectValue ?? "other";
  });
  Object.entries(groups).reduce((acc, [key, rows]) => {
    if (config.option2 === "count") {
      acc[key] = rows?.length ?? 0;
    } else {
      const completed = rows!.reduce((acc, row) => {
        if (row.complete) {
          return acc + 1;
        }
        return acc;
      }, 0);
      acc[key] = completed / (rows?.length ?? 1);
    }
    return acc;
  }, finalData);
  const chartConfig: ChartConfig = {};
  const chartData = column.options.map((option, idx) => {
    chartConfig[option.id] = {
      label: option.title,
      color: `hsl(var(--chart-${idx + 1}))`,
    };
    return {
      label: option.title,
      value: finalData[option.id] ?? 0,
      fill: `var(--color-${option.id})`,
    };
  });
  return (
    <ChartContainer config={chartConfig} className={styles.chart}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={"label"}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis axisLine={false} tickLine={false} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={"value"} radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function LineVariant({
  config,
}: {
  config: Extract<ChartProps, { chartType: "line" }>;
}) {
  const column = config.columns.find((c) => c.id === config.option1) as Extract<
    Column,
    { type: "date" }
  >;
  const groups = Object.groupBy(config.rows, (row) => {
    const cell = row.cells.find((c) => c.columnId === column.id)!;
    switch (config.option3) {
      case "week":
        const [year, week] = getWeekNumber(new Date(cell.dateValue!));
        return `${year}-${week}`;
      case "month":
        return `${new Date(cell.dateValue!).getUTCFullYear()}-${
          new Date(cell.dateValue!).getUTCMonth() + 1
        }`;
      case "year":
        return new Date(cell.dateValue!).getUTCFullYear();
      default:
        return cell.dateValue;
    }
  });
  const chartData = Object.entries(groups).map(([key, rows]) => {
    return {
      x: key,
      y: rows?.length ?? 0,
    };
  });
  const chartConfig = {
    y: {
      label: "Month",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig} className={styles.chart}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="x" tickLine={false} tickMargin={8} axisLine={false} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tickCount={5}
        />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="y"
          stroke="var(--color-y)"
          strokeWidth={2}
          type="linear"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function DonutVariant({
  config,
}: {
  config: Extract<ChartProps, { chartType: "donut" }>;
}) {
  const column = config.columns.find((c) => c.id === config.option1) as Extract<
    Column,
    { type: "select" }
  >;
  const finalData: Record<string, number> = {};
  const groups = Object.groupBy(config.rows, (row) => {
    const cell = row.cells.find((c) => c.columnId === column.id)!;
    return cell.selectValue ?? "other";
  });
  Object.entries(groups).reduce((acc, [key, rows]) => {
    acc[key] = rows?.length ?? 0;
    return acc;
  }, finalData);
  const chartConfig: ChartConfig = {};
  const total = Object.values(finalData).reduce((acc, curr) => acc + curr, 0);
  const chartData = column.options.map((option, idx) => {
    chartConfig[option.id] = {
      label: option.title,
      color: `hsl(var(--chart-${idx + 1}))`,
    };
    return {
      label: option.title,
      percent: ((finalData[option.id] ?? 0) / total) * 100,
      value: finalData[option.id] ?? 0,
      fill: `var(--color-${option.id})`,
    };
  });
  return (
    <ChartContainer config={chartConfig} className={styles.chart}>
      <PieChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
          formatter={(value, name, item, idx, payload) => {
            console.log(value, name, item, idx, payload);
            return (
              <>
                <div
                  className={clsx(
                    commonStyles.tooltipIndicator,
                    commonStyles.dot,
                  )}
                  style={
                    {
                      "--color-bg": item.payload.fill,
                      "--color-border": item.payload.fill,
                    } as React.CSSProperties
                  }
                />
                <div
                  className={commonStyles.tooltipContent}
                  style={{
                    minWidth: "100px",
                  }}
                >
                  <div className={commonStyles.tooltipContentInner}>
                    <span className={commonStyles.tooltipContentInner}>
                      {name}
                    </span>
                  </div>
                  {value && (
                    <span className={commonStyles.tooltipContentValue}>
                      {value} ({(payload as any).payload.percent.toFixed(2)}%)
                    </span>
                  )}
                </div>
              </>
            );
          }}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  );
}

function RadialVariant({
  config,
}: {
  config: Extract<ChartProps, { chartType: "donut" }>;
}) {
  const completedRowCount = config.rows.reduce((acc, row) => {
    if (row.complete) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const percentCompleted = completedRowCount / config.rows.length;
  const chartData = [
    {
      label: "Percent completed",
      value: completedRowCount,
      fill: "hsl(var(--chart-1))",
    },
  ];
  const chartConfig = {
    value: {
      label: "Completed",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig} className={styles.chart}>
      <RadialBarChart
        data={chartData}
        endAngle={360 * percentCompleted}
        innerRadius={80}
        outerRadius={140}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className={styles.polarGrid}
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="value" background />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className={styles.donutLabel}
                    >
                      {(percentCompleted * 100).toFixed(0)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className={styles.donutLabelSecondary}
                    >
                      Completed
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

function RadarVariant({
  config,
}: {
  config: Extract<ChartProps, { chartType: "radar" }>;
}) {
  const column = config.columns.find((c) => c.id === config.option1) as Extract<
    Column,
    { type: "select" }
  >;
  const finalData: Record<string, number> = {};
  const groups = Object.groupBy(config.rows, (row) => {
    const cell = row.cells.find((c) => c.columnId === column.id)!;
    return cell.selectValue ?? "other";
  });
  Object.entries(groups).reduce((acc, [key, rows]) => {
    acc[key] = rows?.length ?? 0;
    return acc;
  }, finalData);
  const chartConfig: ChartConfig = {
    value: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
    },
  };
  const chartData = column.options.map((option, idx) => {
    return {
      label: option.title,
      value: finalData[option.id] ?? 0,
      fill: `var(--color-${option.id})`,
    };
  });
  return (
    <ChartContainer
      config={chartConfig}
      className={clsx(styles.chart, styles.square)}
    >
      <RadarChart data={chartData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="label" />
        <PolarGrid />
        <Radar
          dataKey="value"
          fill="var(--color-value)"
          fillOpacity={0.6}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
}

// Polar Variant
function PolarVariant({
  config,
}: {
  config: Extract<ChartProps, { chartType: "polar" }>;
}) {
  const column = config.columns.find((c) => c.id === config.option1) as Extract<
    Column,
    { type: "select" }
  >;
  const finalData: Record<string, { completed: number; total: number }> = {};
  const groups = Object.groupBy(config.rows, (row) => {
    const cell = row.cells.find((c) => c.columnId === column.id)!;
    return cell.selectValue ?? "other";
  });
  Object.entries(groups).reduce((acc, [key, rows]) => {
    const completed = rows!.reduce((acc, row) => {
      if (row.complete) {
        return acc + 1;
      }
      return acc;
    }, 0);
    acc[key] = {
      completed,
      total: rows?.length ?? 1,
    };
    return acc;
  }, finalData);
  const chartConfig: ChartConfig = {};
  const chartData = column.options.map((option, idx) => {
    chartConfig[option.id] = {
      label: option.title,
      color: `hsl(var(--chart-${idx + 1}))`,
    };
    const data = finalData[option.id] ?? { completed: 0, total: 0 };
    return {
      label: option.title,
      outerRadius: data.completed / data.total,
      value: data.total,
      fill: `var(--color-${option.id})`,
    };
  });
  return (
    <ChartContainer config={chartConfig} className={styles.chart}>
      <PieChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        <PolarGrid gridType="circle" />
        <Pie data={chartData} dataKey="value" nameKey="label" strokeWidth={5}>
          {chartData.map((entry, idx) => {
            return (
              // @ts-ignore
              <Cell
                key={entry.label}
                fill={`var(--color-${column.options[idx].id})`}
                outerRadius={entry.outerRadius}
              />
            );
          })}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
