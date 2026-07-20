import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { StatMetric } from "./StatMetric";

const meta = {
  title: "App/StatMetric",
  component: StatMetric,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1116",
  ),
} satisfies Meta<typeof StatMetric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  args: { size: "hero", children: "4", metricLabel: "jours sans fumer" },
};

export const Compact: Story = {
  args: { size: "compact", children: "48 €", metricLabel: "dans ta poche" },
};
