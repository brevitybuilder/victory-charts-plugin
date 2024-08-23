import type { Meta, StoryObj } from "@storybook/react";

import { Chart } from ".";

const meta: Meta<typeof Chart> = {
  title: "Example/Chart",
  component: Chart,
};

type Story = StoryObj<typeof Chart>;

export const Bar: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Chart
        config={{
          chartType: "bar",
          columns: [
            {
              id: "value",
              title: "Value",
              type: "select",
              options: [
                {
                  id: "1",
                  title: "A",
                },
                {
                  id: "2",
                  title: "B",
                },
                {
                  id: "3",
                  title: "C",
                },
                {
                  id: "4",
                  title: "D",
                },
              ],
            },
          ],
          rows: [
            {
              id: "1",
              cells: [
                {
                  id: "1",
                  rowId: "1",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "2",
              cells: [
                {
                  id: "3",
                  rowId: "2",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "2",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "3",
              cells: [
                {
                  id: "1",
                  rowId: "3",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
          ],
          option1: "value",
          option2: "count",
        }}
      />
    </div>
  ),
};

export const Line: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Chart
        config={{
          chartType: "line",
          columns: [
            {
              id: "date",
              title: "Date",
              type: "date",
            },
          ],
          rows: [
            {
              id: "1",
              cells: [
                {
                  id: "1",
                  rowId: "1",
                  columnId: "date",
                  textValue: null,
                  numberValue: null,
                  dateValue: "2024-01-01T00:00:00.000Z",
                  selectValue: null,
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "2",
              cells: [
                {
                  id: "3",
                  rowId: "2",
                  columnId: "date",
                  textValue: null,
                  numberValue: null,
                  dateValue: "2024-02-01T00:00:00.000Z",
                  selectValue: null,
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "3",
              cells: [
                {
                  id: "1",
                  rowId: "3",
                  columnId: "date",
                  textValue: null,
                  numberValue: null,
                  dateValue: "2024-02-01T00:00:00.000Z",
                  selectValue: null,
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
          ],
          option1: "date",
          option2: "count",
          option3: "month",
        }}
      />
    </div>
  ),
};

export const Donut: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Chart
        config={{
          chartType: "donut",
          columns: [
            {
              id: "value",
              title: "Value",
              type: "select",
              options: [
                {
                  id: "1",
                  title: "A",
                },
                {
                  id: "2",
                  title: "B",
                },
                {
                  id: "3",
                  title: "C",
                },
                {
                  id: "4",
                  title: "D",
                },
              ],
            },
          ],
          rows: [
            {
              id: "1",
              cells: [
                {
                  id: "1",
                  rowId: "1",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "2",
              cells: [
                {
                  id: "3",
                  rowId: "2",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "2",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "3",
              cells: [
                {
                  id: "1",
                  rowId: "3",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
          ],
          option1: "value",
          option2: "count",
        }}
      />
    </div>
  ),
};

export const Radial: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Chart
        config={{
          chartType: "radial",
          columns: [
            {
              id: "value",
              title: "Value",
              type: "select",
              options: [
                {
                  id: "1",
                  title: "A",
                },
                {
                  id: "2",
                  title: "B",
                },
                {
                  id: "3",
                  title: "C",
                },
                {
                  id: "4",
                  title: "D",
                },
              ],
            },
          ],
          rows: [
            {
              id: "1",
              cells: [
                {
                  id: "1",
                  rowId: "1",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "2",
              cells: [
                {
                  id: "3",
                  rowId: "2",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "2",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "3",
              cells: [
                {
                  id: "1",
                  rowId: "3",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: false,
            },
          ],
        }}
      />
    </div>
  ),
};

export const Radar: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Chart
        config={{
          chartType: "radar",
          columns: [
            {
              id: "value",
              title: "Value",
              type: "select",
              options: [
                {
                  id: "1",
                  title: "A",
                },
                {
                  id: "2",
                  title: "B",
                },
                {
                  id: "3",
                  title: "C",
                },
                {
                  id: "4",
                  title: "D",
                },
              ],
            },
          ],
          rows: [
            {
              id: "1",
              cells: [
                {
                  id: "1",
                  rowId: "1",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "2",
              cells: [
                {
                  id: "3",
                  rowId: "2",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "2",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "3",
              cells: [
                {
                  id: "1",
                  rowId: "3",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
          ],
          option1: "value",
          option2: "count",
        }}
      />
    </div>
  ),
};

export const Polar: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Chart
        config={{
          chartType: "polar",
          columns: [
            {
              id: "value",
              title: "Value",
              type: "select",
              options: [
                {
                  id: "1",
                  title: "A",
                },
                {
                  id: "2",
                  title: "B",
                },
                {
                  id: "3",
                  title: "C",
                },
                {
                  id: "4",
                  title: "D",
                },
              ],
            },
          ],
          rows: [
            {
              id: "1",
              cells: [
                {
                  id: "1",
                  rowId: "1",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "2",
              cells: [
                {
                  id: "3",
                  rowId: "2",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "2",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: true,
            },
            {
              id: "3",
              cells: [
                {
                  id: "1",
                  rowId: "3",
                  columnId: "value",
                  textValue: null,
                  numberValue: null,
                  dateValue: null,
                  selectValue: "1",
                  userValue: null,
                  mutliSelectValue: null,
                },
              ],
              complete: false,
            },
          ],
          option1: "value",
          option2: "count",
        }}
      />
    </div>
  ),
};

export default meta;
