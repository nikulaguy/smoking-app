import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { Button } from "./Button";

const meta = {
  title: "Socle/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=101-1585",
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Commencer l'ascension" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Distraction express" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Pas aujourd’hui" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Continuer", disabled: true },
};
