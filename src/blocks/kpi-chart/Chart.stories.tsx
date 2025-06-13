// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";

import { ChartKPI } from ".";

const meta: Meta<typeof ChartKPI> = {
	title: "Example/ChartKPI",
	component: ChartKPI,
};

type Story = StoryObj<typeof ChartKPI>;

export const Line: Story = {
	render: () => (
		<div style={{ height: "500px", width: "100vh" }}>
			<ChartKPI
				config={{
					...chartData,
					chartType: "line",
					startDate: "01/01/2025",
					endDate: "05/13/2025",
					option3: "week",
					type: "preiodic"
				}}
				
			/>
		</div>
	),
};

const chartData = {
	cells: [{
        "id": "6E6bqFNXijJJTibp8AUJN",
        "week": 1,
        "year": 2025,
        "value": 10,
    },
    {
        "id": "LD7dfY6Dk6QnQdGyfUXpx",
        "week": 2,
        "year": 2025,
        "value": 11,
    },
    {
        "id": "AJAnFMGHiFcaeELBMndJH",
        "week": 3,
        "year": 2025,
        "value": 2,
    },
    {
        "id": "rCMaeqYDF3e7YM3abAr3e",
        "week": 4,
        "year": 2025,
        "value": 7,
    },
    {
        "id": "ej8yhtWnpJHbYKDYheNPc",
        "week": 5,
        "year": 2025,
        "value": 7,
    },
    {
        "id": "dHiUBtGGmrFfaArr4dKqc",
        "week": 6,
        "year": 2025,
        "value": 4,
    },
    {
        "id": "b4BnAfTXdn4aF9FHwVLUz",
        "week": 7,
        "year": 2025,
        "value": null,
    },
    {
        "id": "A3rFUnkxHa3U9gkjTERQy",
        "week": 8,
        "year": 2025,
        "value": 20,
    },
    {
        "id": "4JLgi6QRkUhxjyYkmEt6G",
        "week": 9,
        "year": 2025,
        "value": 20,
    },
    {
        "id": "hYjQTzAapqF9kb6WQxFLK",
        "week": 10,
        "year": 2025,
        "value": 9,
    },
    {
        "id": "q6UF7K9imDRjxjEVJcWVV",
        "week": 11,
        "year": 2025,
        "value": 11,
    }]
};

export default meta;
