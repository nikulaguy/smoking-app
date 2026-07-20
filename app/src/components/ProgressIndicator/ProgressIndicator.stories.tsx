import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { ProgressIndicator } from "./ProgressIndicator";

const meta = {
  title: "Socle/ProgressIndicator",
  component: ProgressIndicator,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=4-9",
  ),
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Questionnaire: Story = {
  args: { children: "Étape 1 sur 3", progress: 1 / 3 },
};

export const Palier: Story = {
  args: { children: "Jour 4 sur 7", progress: 4 / 7 },
};

export const Lecture: Story = {
  args: { children: "1:12 · reste 1:28", progress: 0.45 },
};
