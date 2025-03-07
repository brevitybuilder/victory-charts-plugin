import clsx from "clsx";
import type * as React from "react";
import { Legend, Pie, PieChart } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "../../common/Chart";

import * as commonStyles from "../../common/Chart/styles.module.css";
import * as styles from "./styles.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	data: {
		label: string;
		value: number;
		fill: string;
	}[];
}

export function DoughnutChart({ data, className, ...props }: Props) {
	const chartConfig: ChartConfig = {};
	const totalValue = data.reduce((acc, datum) => acc + datum.value, 0);
	const chartData = data.map((datum) => {
		chartConfig[datum.label] = {
			label: datum.label,
			color: datum.fill,
		};
		return {
			...datum,
			percent: (datum.value / totalValue) * 100,
		};
	});
	return (
		<ChartContainer
			config={chartConfig}
			className={clsx(styles.chart, className)}
			{...props}
		>
			<PieChart data={chartData}>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
					formatter={(value, name, item, _idx, payload) => {
						console.log(payload);
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
				<Legend verticalAlign="middle" align="right" />
			</PieChart>
		</ChartContainer>
	);
}
