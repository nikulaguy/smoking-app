import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { design } from "../../../.storybook/utils";
import { SelectField } from "./SelectField";

const OPTIONS = [
  { value: "-5", label: "Moins de 5" },
  { value: "5-10", label: "5 à 10" },
  { value: "11-20", label: "11 à 20" },
  { value: "21-30", label: "21 à 30" },
  { value: "30+", label: "Plus de 30" },
];

const meta = {
  title: "Questionnaire/SelectField",
  component: SelectField,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=20-161",
  ),
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    label: "Cigarettes par jour",
    selectorTitle: "Combien de cigarettes par jour ?",
    options: OPTIONS,
  },
};

export const Filled: Story = {
  args: { ...Empty.args, value: "11-20" },
};

export const Erreur: Story = {
  args: { ...Empty.args, error: "Choisis une option pour continuer." },
};

/** Ouvre le sélecteur plein écran, choisit une tranche, valide. */
export const Interaction: Story = {
  args: Empty.args,
  render: function ControlledSelect(args) {
    const [value, setValue] = useState<string>();
    return <SelectField {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /cigarettes par jour/i }));
    const dialog = canvasElement.querySelector("dialog") as HTMLDialogElement;
    await waitFor(() => expect(dialog.open).toBe(true));
    await userEvent.click(within(dialog).getByLabelText("11 à 20"));
    await userEvent.click(within(dialog).getByRole("button", { name: "Valider" }));
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(canvas.getByRole("button", { name: /11 à 20/ })).toBeInTheDocument();
  },
};
