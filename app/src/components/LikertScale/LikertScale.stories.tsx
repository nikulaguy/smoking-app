import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { design } from "../../../.storybook/utils";
import { LikertScale } from "./LikertScale";

const meta = {
  title: "Questionnaire/LikertScale",
  component: LikertScale,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=27-309",
  ),
} satisfies Meta<typeof LikertScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SeptPoints: Story = {
  args: {
    legend: "« J'arrête parce que je culpabilise de continuer. »",
    points: 7,
    name: "motivation",
    anchorMin: "Pas du tout d'accord",
    anchorMax: "Tout à fait d'accord",
  },
};

export const CinqPoints: Story = {
  args: {
    legend: "« Tu es stressé ou anxieux. »",
    points: 5,
    name: "saseq",
    anchorMin: "Pas sûr du tout",
    anchorMax: "Totalement sûr",
  },
};

export const Erreur: Story = {
  args: {
    ...SeptPoints.args,
    name: "motivation-err",
    error: "Choisis une valeur pour continuer.",
  },
};

/** Sélection contrôlée : un tap sélectionne, re-tap ne désélectionne pas. */
export const Interaction: Story = {
  args: { ...CinqPoints.args, name: "saseq-play" },
  render: function ControlledScale(args) {
    const [value, setValue] = useState<number>();
    return <LikertScale {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: "2" }));
    await expect(canvas.getByRole("radio", { name: "2" })).toBeChecked();
  },
};
