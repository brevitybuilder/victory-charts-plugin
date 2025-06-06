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

function getMonthStartInWeek(startDate: Date, week: number) {
	const base = new Date(startDate);
  
	// Step 1: Add weeks to start date
	const targetDate = new Date(base);
	targetDate.setDate(base.getDate() + week * 7);

	// Step 2: Look both backward and forward for the nearest 1st of a month
	for (let offset = 0; offset <= 31; offset++) {
		// Check backward first if offset > 0
		if (offset > 0) {
		const back = new Date(targetDate);
		back.setDate(back.getDate() - offset);
		if (back.getDate() === 1) return back;
		}

		// Check forward (including offset 0)
		const forward = new Date(targetDate);
		forward.setDate(forward.getDate() + offset);
		if (forward.getDate() === 1) return forward;
	}

	// Fallback (should never happen)
	return targetDate;
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
			addWeeksToDate(config.startDate, cell.week) : 
			getMonthStartInWeek(config.startDate, cell.week);
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
