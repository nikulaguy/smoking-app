import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { design } from "../../../.storybook/utils";
import { Radiobox } from "./Radiobox";

/**
 * Miroir du composant DS « radiobox » (états default / hover / checked /
 * disabled / error) et de ses atoms `atoms/radio/*`. La puce est un input
 * radio natif stylé ; hover uniquement sur les dispositifs à survol réel.
 * Composé par single-choice-option (coque container-field + ces atoms).
 */
const meta = {
  title: "Socle/Radiobox",
  component: Radiobox,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=49-639",
  ),
} satisfies Meta<typeof Radiobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Réponse", name: "demo" },
};

export const Checked: Story = {
  args: { children: "Réponse", name: "demo-checked", defaultChecked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radio")).toBeChecked();
  },
};

export const Disabled: Story = {
  args: { children: "Réponse", name: "demo-disabled", disabled: true },
};

export const Error: Story = {
  args: {
    children: "Réponse",
    name: "demo-error",
    "aria-invalid": true,
    conditions: "Choisis une option pour continuer.",
  },
};

export const Conditions: Story = {
  args: {
    children: "Oui, régulièrement",
    name: "demo-conditions",
    conditions: "Ta réponse reste privée.",
  },
};

/** Groupe radio natif : flèches pour changer, Tab pour entrer/sortir. */
export const Groupe: Story = {
  args: { children: "" },
  render: () => (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 12 }}>
      <legend style={{ marginBottom: 8 }}>Tu fumes aussi des joints ?</legend>
      <Radiobox name="groupe">Oui, régulièrement</Radiobox>
      <Radiobox name="groupe" defaultChecked>
        De temps en temps
      </Radiobox>
      <Radiobox name="groupe">Non, jamais</Radiobox>
    </fieldset>
  ),
};
