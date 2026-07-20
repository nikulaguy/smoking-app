import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";

const meta = {
  title: "Socle/Switch",
  component: Switch,
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { children: "Toutes les notifications", name: "demo-off" },
};

export const On: Story = {
  args: {
    children: "Toutes les notifications",
    name: "demo-on",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: { children: "Toutes les notifications", name: "demo-disabled", disabled: true },
};

/** Avec description + bascule au clavier et à la souris. */
export const WithDescription: Story = {
  args: {
    children: "Toutes les notifications",
    name: "demo-desc",
    defaultChecked: true,
    description: "Coupe tous les rappels d’un coup. Tu peux les rallumer quand tu veux.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("switch");
    await expect(input).toBeChecked();
    await userEvent.click(input);
    await expect(input).not.toBeChecked();
  },
};
