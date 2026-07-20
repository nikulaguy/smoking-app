import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { design } from "../../../.storybook/utils";
import { MultiChoiceOption } from "./MultiChoiceOption";

const meta = {
  title: "Questionnaire/MultiChoiceOption",
  component: MultiChoiceOption,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=36-572",
  ),
} satisfies Meta<typeof MultiChoiceOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { children: "Café", name: "moments" },
};

export const Selected: Story = {
  args: { children: "Soirée", name: "moments-sel", defaultChecked: true },
};

/** Maximum atteint : les options restantes passent en disabled. */
export const MaxAtteint: Story = {
  args: { children: "Réveil", name: "moments-max", disabled: true },
};

/** Erreur (aria-invalid) : case, textes et coque en teinte error. */
export const Error: Story = {
  args: {
    children: "Réponse",
    name: "moments-error",
    "aria-invalid": true,
    description: "Une sélection est requise pour continuer",
  },
};

export const Interaction: Story = {
  args: { children: "Stress", name: "moments-play" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByLabelText("Stress");
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await userEvent.click(box);
    await expect(box).not.toBeChecked();
  },
};

/** Avec description : la petite ligne secondaire sous l'intitulé. */
export const AvecDescription: Story = {
  args: {
    children: "Note tes raisons",
    description: "Pourquoi tu arrêtes, en une phrase",
    name: "missions-desc",
    defaultChecked: true,
  },
};

/** Avec flèche de détail ↗ : cocher et ouvrir le détail sont deux gestes
 *  distincts (le bouton est un frère du label, jamais imbriqué). */
export const AvecDetail: Story = {
  args: {
    children: "Préviens un proche",
    description: "Un allié qui te soutient le jour J",
    name: "missions-detail",
    onDetail: () => {},
    detailLabel: "Voir le détail : Préviens un proche",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const detail = canvas.getByRole("button", {
      name: "Voir le détail : Préviens un proche",
    });
    await expect(detail).toBeInTheDocument();
    // le clic sur la flèche ne doit PAS cocher la case
    await userEvent.click(detail);
    await expect(canvas.getByRole("checkbox")).not.toBeChecked();
  },
};
