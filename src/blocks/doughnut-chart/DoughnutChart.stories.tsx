import type { Meta, StoryObj } from "@storybook/react";

import { DoughnutChart } from ".";

const meta: Meta<typeof DoughnutChart> = {
  title: "Example/DoughnutChart",
  component: DoughnutChart,
};

type Story = StoryObj<typeof DoughnutChart>;

export const Primary: Story = {
  render: () => (
    <div style={{ width: "500px", height: "500px" }}>
      <DoughnutChart
        data={[
          {
            label: "Group A",
            value: 4,
            fill: "#8884d8",
          },
          {
            label: "Group B",
            value: 9,
            fill: "#83a6ed",
          },
        ]}
      />
    </div>
  ),
};

export default meta;
