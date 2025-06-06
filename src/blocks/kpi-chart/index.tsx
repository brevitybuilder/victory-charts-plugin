import clsx from "clsx";
import * as React from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "../../common/Chart";
import * as commonStyles from "../../common/Chart/styles.module.css";
import * as styles from "./styles.module.css";

export type KPICell = {
	id: string;
	week: number;
	year: number;
	value: number;
};

export type ChartProps =
	| {
			chartType: "line";
			cells: KPICell[];
			startDate: Date;
			endDate: Date;
			option3: "week" | "month" | "quarter" | "year";
			type: "cumulative" | "periodic";
	  };

export function ChartKPI({
	config,
	...props
}: {
	config: ChartProps;
}) {
	if (!config.cells?.length) {
		return <div className={styles.noData}>No data</div>;
	}
	return (<LineVariant
		config={config}
		{...props}
	/>)
}

function addWeeksToDate(startDate: Date, numberOfWeeks: number) {
  const date = new Date(startDate); // Ensure it's a Date object
  date.setDate(date.getDate() + numberOfWeeks * 7);
  return date;
}

function getMonthStartInWeek(week: number, year: number) {
	// Get Jan 4th to ensure we're using ISO 8601 (week 1 contains Jan 4)
	const jan4 = new Date(year, 0, 4);

	// Get the Monday of week 1
	const dayOfWeek = jan4.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
	const diffToMonday = ((dayOfWeek + 6) % 7); // how many days to subtract to get to Monday
	const week1Monday = new Date(jan4);
	week1Monday.setDate(jan4.getDate() - diffToMonday);

	// Get the Monday of the target week
	const targetMonday = new Date(week1Monday);
	targetMonday.setDate(week1Monday.getDate() + (week - 1) * 7);

	// Check each day from Monday to Sunday of the target week
	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(targetMonday);
		currentDate.setDate(targetMonday.getDate() + i);

		if (currentDate.getDate() === 1) {
			return currentDate;
		}
	}

	// If no day in the week has a day=1, return null or throw
	return targetMonday;
}

function LineVariant({
	config,
	className,
	...props
}: {
	config: Extract<ChartProps, { chartType: "line" }>;
	className?: string;
}) {

	let cumulativeTotal = 0;
	const chartData = config.cells.map(cell => {
		cumulativeTotal += cell.value;
		const periodType = config.option3;
		const weekStart = periodType == "week" ? 
			addWeeksToDate(config.startDate, --cell.week) : 
			getMonthStartInWeek(cell.week, cell.year);
		return {
			x: formatDate(weekStart),
			y: config.type == "cumulative" ? cumulativeTotal : cell.value,
		};
	});
	
	const chartConfig = {
		y: {
			label: "Count",
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;
	return (
		<ChartContainer
			config={chartConfig}
			className={clsx(styles.chart, className)}
			{...props}
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
					dataKey="x"
					tickLine={false}
					tickMargin={8}
					axisLine={false}
					angle={-45}
					textAnchor="end"
				/>
				<YAxis
					axisLine={false}
					tickLine={false}
					tickMargin={10}
					tickCount={5}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							valueFormatter={(value) =>
								value.toLocaleString()
							}
						/>
					}
					cursor={false}
				/>
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

function formatDate(date: Date): string {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	const year = date.getFullYear().toString().slice(-2);

	return `${month}/${day}/${year}`;
}
