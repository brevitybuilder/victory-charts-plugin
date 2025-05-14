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
import { getWeekNumber } from "./utils";

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

type PeriodType = "week" | "month" | "quarter" | "year";

interface Period {
	start: Date;
	end: Date;
}

function alignStartDate(date: Date, periodType: PeriodType): Date {
	const aligned = new Date(date.getTime());

	switch (periodType) {
		case "week":
			// Weeks start on Monday (day 1)
			// getDay() returns 0 (Sun),1(Mon),2(Tue),3(Wed),4(Thu),5(Fri),6(Sat)
			// To get Monday, we find how many days we need to go back:
			// If day = 0 (Sun), go back 6 days
			// If day = 1 (Mon), go back 0 days
			// If day = 2 (Tue), go back 1 day, etc.
			const dayOfWeek = aligned.getDay();
			const offset = (dayOfWeek + 6) % 7; // number of days to go back to get Monday
			aligned.setDate(aligned.getDate() - offset);
			break;
		case "month":
			// Align to the 1st of the month
			aligned.setDate(1);
			break;
		case "quarter":
			// Align to the first day of the current quarter
			const currentMonth = aligned.getMonth();
			const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
			aligned.setMonth(quarterStartMonth, 1);
			break;
		case "year":
			// Align to Jan 1 of that year
			aligned.setMonth(0); // January
			aligned.setDate(1);
			break;
	}

	return aligned;
}

function alignEndDate(date: Date, periodType: PeriodType): Date {
	const aligned = new Date(date.getTime());

	switch (periodType) {
		case "week":
			// Weeks end on Sunday
			// If day = 0 (Sun), go forward 0 days
			// If day = 1 (Mon), go forward 6 days
			// If day = 2 (Tue), go forward 5 days, etc.
			const dayOfWeek = aligned.getDay();
			const forwardOffset = (7 - dayOfWeek) % 7;
			aligned.setDate(aligned.getDate() + forwardOffset);
			break;
		case "month":
			// Align to the last day of that month
			// Move to the next month at the 1st, then go back one day
			aligned.setMonth(aligned.getMonth() + 1, 1);
			aligned.setDate(aligned.getDate() - 1);
			break;
		case "quarter":
			// Align to the last day of the current quarter
			const currentMonth = aligned.getMonth();
			const quarterEndMonth = Math.floor(currentMonth / 3) * 3 + 2;
			aligned.setMonth(quarterEndMonth + 1, 1);
			aligned.setDate(aligned.getDate() - 1);
			break;
		case "year":
			// Align to Dec 31 of that year
			aligned.setMonth(11, 31); // December is month 11, day 31
			break;
	}

	return aligned;
}

function nextPeriodStart(date: Date, periodType: PeriodType): Date {
	const nextStart = new Date(date.getTime());
	switch (periodType) {
		case "week":
			// Next period starts the day after the current Sunday
			nextStart.setDate(nextStart.getDate() + 1);
			break;
		case "month":
			// Next period starts on the 1st of the next month
			nextStart.setMonth(nextStart.getMonth() + 1, 1);
			break;
		case "quarter":
			// Calculate the next quarter's start month
			const currentMonth = nextStart.getMonth();
			const nextQuarterStartMonth = Math.floor(currentMonth / 3) * 3 + 3;
			nextStart.setMonth(nextQuarterStartMonth, 1);
			break;
		case "year":
			// Next period starts on Jan 1 of the next year
			nextStart.setFullYear(nextStart.getFullYear() + 1, 0, 1);
			break;
	}
	return nextStart;
}

function periodEnd(date: Date, periodType: PeriodType): Date {
	const currentEnd = new Date(date.getTime());
	switch (periodType) {
		case "week":
			// end = start + 6 days (Monday-based week)
			currentEnd.setDate(currentEnd.getDate() + 6);
			break;
		case "month":
			// end = last day of the month starting from `date`
			// To find the last day of the month:
			currentEnd.setMonth(currentEnd.getMonth() + 1, 1);
			currentEnd.setDate(currentEnd.getDate() - 1);
			break;
		case "quarter":
			// Determine the quarter's end month
			const currentMonth = currentEnd.getMonth();
			const quarterEndMonth = Math.floor(currentMonth / 3) * 3 + 2;
			currentEnd.setMonth(quarterEndMonth + 1, 1); // Move to the first day of next month
			currentEnd.setDate(currentEnd.getDate() - 1); // Go back one day to get last day of quarter
			break;
		case "year":
			// end = Dec 31 of that year
			currentEnd.setMonth(11, 31);
			break;
	}
	return currentEnd;
}

function generatePeriods(
	startDate: Date,
	endDate: Date,
	periodType: PeriodType,
): Period[] {
	// Align the provided start and end to full periods
	const adjustedStart = alignStartDate(startDate, periodType);
	const adjustedEnd = alignEndDate(endDate, periodType);

	const periods: Period[] = [];

	let currentStart = new Date(adjustedStart.getTime());
	while (currentStart <= adjustedEnd) {
		let currentEnd = periodEnd(currentStart, periodType);
		if (currentEnd > adjustedEnd) {
			currentEnd = new Date(adjustedEnd.getTime());
		}

		periods.push({
			start: new Date(currentStart.getTime()),
			end: new Date(currentEnd.getTime()),
		});

		// Move to the next period start
		currentStart = nextPeriodStart(currentEnd, periodType);
	}

	return periods;
}

function isWeekInRange(year: number, week: number, startDate: Date, endDate: Date) {
    // Convert startDate and endDate to Date objects (if not already)
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get the Monday of the given ISO week
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay();
    const weekStart = new Date(simple);

    if (dayOfWeek <= 4) {
        weekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
        weekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }

    // Week ends on Sunday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Check if the week overlaps with the start-end date range
    return weekEnd >= start && weekStart <= end;
}

function LineVariant({
	config,
	className,
	...props
}: {
	config: Extract<ChartProps, { chartType: "line" }>;
	className?: string;
}) {
	const periods = generatePeriods(
		new Date(config.startDate),
		new Date(config.endDate),
		config.option3,
	);
	let cumulativeTotal = 0;
	const chartData = periods.map((period) => {
		const count = config.cells.reduce((acc, cell) => {
			const cellIsInRange = isWeekInRange(cell.year, cell.week, period.start, period.end);
			const valueNum = cellIsInRange ? cell.value : 0;
			return acc + valueNum;
		}, 0);
		cumulativeTotal += count;
		return {
			x: formatDate(period.start),
			y: config.type == "cumulative" ? cumulativeTotal : count,
		};
	});
	console.log("CHART DATA", chartData);
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
