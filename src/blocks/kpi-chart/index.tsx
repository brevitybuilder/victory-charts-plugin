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

function getDateOfWeekInYear(startDate: Date, week: number, year: number) {
  	const inputDate = new Date(startDate);
    const dayOfWeek = inputDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Get first day of the year
    const jan1 = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7 + (dayOfWeek - jan1.getDay());

    // Create the final date
    const resultDate = new Date(jan1);
    resultDate.setDate(jan1.getDate() + daysOffset);
    return resultDate;
}

function getMonthStartInWeek(startDate: Date, week: number, year: number) {
	const targetDate = getDateOfWeekInYear(startDate, week, year);
    
    const currentMonthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const nextMonthStart = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
    const prevMonthStart = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1);

    // Get time differences
    const diffCurrent = Math.abs(targetDate - currentMonthStart);
    const diffNext = Math.abs(targetDate - nextMonthStart);
    const diffPrev = Math.abs(targetDate - prevMonthStart);

    // Find nearest start of month
    if (diffPrev <= diffCurrent && diffPrev <= diffNext) {
        return prevMonthStart;
    } else if (diffCurrent <= diffNext) {
        return currentMonthStart;
    } else {
        return nextMonthStart;
    }
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
			getDateOfWeekInYear(config.startDate, cell.week, cell.year) : 
			getMonthStartInWeek(config.startDate, cell.week, cell.year);
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
