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
    }
  | {
      id: string;
      title: string;
      type: "multiSelect";
      options: {
        id: string;
        title: string;
      }[];
    }
  | {
      id: string;
      title: string;
      type: "user";
    }
  | {
      id: string;
      title: string;
      type: "text";
    }
  | {
      id: string;
      title: string;
      type: "number";
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

function bucketDataByColumn(
  rows: Row[],
  column: Column,
  dateGrouping?: "week" | "month" | "year",
) {
  switch (column.type) {
    case "select":
      const valuesById = column.options.reduce(
        (acc, option) => {
          acc[option.id] = option.title;
          return acc;
        },
        {} as Record<string, string>,
      );
      return Object.groupBy(rows, (row) => {
        const cell = row.cells.find((c) => c.columnId === column.id)!;
        return valuesById[cell.selectValue ?? ""] ?? "other";
      });
    case "date":
      return Object.groupBy(rows, (row) => {
        const cell = row.cells.find((c) => c.columnId === column.id)!;
        switch (dateGrouping) {
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
    case "multiSelect":
      const groups: Record<string, Row[]> = {};
      rows.forEach((row) => {
        const cell = row.cells.find((c) => c.columnId === column.id)!;
        cell.mutliSelectValue?.forEach((value) => {
          (groups[value] ?? ([] as Row[])).push(row);
        });
      });
      return groups;
    case "user":
      return Object.groupBy(rows, (row) => {
        const cell = row.cells.find((c) => c.columnId === column.id)!;
        return cell.userValue ?? "other";
      });
    case "text":
      return Object.groupBy(rows, (row) => {
        const cell = row.cells.find((c) => c.columnId === column.id)!;
        return cell.textValue ?? "other";
      });
    case "number":
      // not really supported but here anyway
      return Object.groupBy(rows, (row) => {
        const cell = row.cells.find((c) => c.columnId === column.id)!;
        return String(cell.numberValue) ?? "other";
      });
  }
}

function BarVariant({
  config,
}: {
  config: Extract<ChartProps, { chartType: "bar" }>;
}) {
  const column = config.columns.find((c) => c.id === config.option1)!;
  const groups = bucketDataByColumn(config.rows, column, config.option3);
  const chartConfig: ChartConfig = {};
  const chartData = Object.entries(groups).map(([label, rows], idx) => {
    if (!rows) {
      return {
        label,
        value: 0,
        fill: `hsl(var(--chart-${idx + 1}))`,
      };
    }
    chartConfig[label] = {
      label: label,
      color: `hsl(var(--chart-${idx + 1}))`,
    };
    return {
      label,
      value:
        config.option2 === "count"
          ? rows.length
          : rows?.reduce((acc, row) => (row.complete ? acc + 1 : acc), 0) /
            rows.length,
      fill: `hsl(var(--chart-${idx + 1}))`,
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
  const groups = bucketDataByColumn(config.rows, column, config.option3);
  const chartData = Object.entries(groups).map(([key, rows]) => {
    return {
      x: key,
      y: rows?.length ?? 0,
    };
  });
  const chartConfig = {
    y: {
      label: column.title,
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
  const column = config.columns.find((c) => c.id === config.option1)!;
  const groups = bucketDataByColumn(config.rows, column, config.option3);
  const chartConfig: ChartConfig = {};
  const chartData = Object.entries(groups).map(([label, rows], idx) => {
    if (!rows) {
      return {
        label,
        value: 0,
        fill: `hsl(var(--chart-${idx + 1}))`,
      };
    }
    chartConfig[label] = {
      label: label,
      color: `hsl(var(--chart-${idx + 1}))`,
    };
    return {
      label,
      value: rows.length,
      percent: (rows.length / config.rows.length) * 100,
      fill: `hsl(var(--chart-${idx + 1}))`,
    };
  });
  return (
    <ChartContainer config={chartConfig} className={styles.chart}>
      <PieChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
          formatter={(value, name, item, _idx, payload) => {
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
                      {value} ({(payload as any)?.payload?.percent?.toFixed(2)}
                      %)
                    </span>
                  )}
                </div>
              </>
            );
          }}
        />
        <Pie
          startAngle={90}
          endAngle={-270}
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
        startAngle={90}
        endAngle={-360 * percentCompleted + 90}
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
  const column = config.columns.find((c) => c.id === config.option1)!;
  const groups = bucketDataByColumn(config.rows, column, "year");
  const chartConfig: ChartConfig = {};
  const chartData = Object.entries(groups).map(([label, rows], idx) => {
    if (!rows) {
      return {
        label,
        value: 0,
        fill: `hsl(var(--chart-${idx + 1}))`,
      };
    }
    chartConfig[label] = {
      label: label,
      color: `hsl(var(--chart-${idx + 1}))`,
    };
    return {
      label,
      value: rows.length,
      fill: `hsl(var(--chart-${idx + 1}))`,
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
  const column = config.columns.find((c) => c.id === config.option1)!;
  const groups = bucketDataByColumn(config.rows, column, config.option3);
  const chartConfig: ChartConfig = {};
  const chartData = Object.entries(groups).map(([label, rows], idx) => {
    if (!rows) {
      return {
        label,
        value: 0,
        fill: `hsl(var(--chart-${idx + 1}))`,
      };
    }
    chartConfig[label] = {
      label: label,
      color: `hsl(var(--chart-${idx + 1}))`,
    };
    const percenetComplete =
      rows?.reduce((acc, row) => (row.complete ? acc + 1 : acc), 0) /
      rows.length;
    return {
      label,
      value: rows.length,
      outerRadius: percenetComplete,
      fill: `hsl(var(--chart-${idx + 1}))`,
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
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          strokeWidth={5}
          startAngle={90}
          endAngle={-270}
        >
          {chartData.map((entry, idx) => {
            return (
              // @ts-ignore
              <Cell
                key={entry.label}
                fill={entry.fill}
                outerRadius={entry.outerRadius}
              />
            );
          })}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
