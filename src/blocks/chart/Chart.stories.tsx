import type { Meta, StoryObj } from "@storybook/react";

import { Chart } from ".";

const meta: Meta<typeof Chart> = {
  title: "Example/Chart",
  component: Chart,
};

type Story = StoryObj<typeof Chart>;

export const Bar: Story = {
  render: () => <Chart chart="bar" />,
};

export const Line: Story = {
  render: () => <Chart chart="line" />,
};

export const Donut: Story = {
  render: () => <Chart chart="donut" />,
};

export const Radar: Story = {
  render: () => <Chart chart="radar" />,
};

export default meta;
