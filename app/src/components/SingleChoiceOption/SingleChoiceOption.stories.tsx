import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { design } from "../../../.storybook/utils";
import { SingleChoiceOption } from "./SingleChoiceOption";

const meta = {
  title: "Questionnaire/SingleChoiceOption",
  component: SingleChoiceOption,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=3-36",
  ),
} satisfies Meta<typeof SingleChoiceOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { children: "6 à 30 minutes", name: "demo" },
};

export const Selected: Story = {
  args: { children: "6 à 30 minutes", name: "demo-selected", defaultChecked: true },
};

export const Disabled: Story = {
  args: { children: "Après 60 minutes", name: "demo-disabled", disabled: true },
};

/** Avec description : la petite ligne secondaire sous l'intitulé. */
export const WithDescription: Story = {
  args: {
    children: "Sur cet appareil",
    name: "demo-description",
    description: "Sans compte, quand l’app est ouverte. Tout reste sur ton appareil.",
  },
};

/** Groupe complet : une seule option sélectionnée à la fois. */
export const Groupe: Story = {
  args: { children: "", name: "hsi" },
  render: () => (
    <fieldset style={{ border: 0, padding: 0, display: "grid", gap: 12 }}>
      <legend>Ta première cigarette du matin ?</legend>
      <SingleChoiceOption name="hsi" value="3">
        Dans les 5 minutes
      </SingleChoiceOption>
      <SingleChoiceOption name="hsi" value="2">
        6 à 30 minutes
      </SingleChoiceOption>
      <SingleChoiceOption name="hsi" value="1">
        31 à 60 minutes
      </SingleChoiceOption>
    </fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText("6 à 30 minutes"));
    await expect(canvas.getByLabelText("6 à 30 minutes")).toBeChecked();
    await userEvent.click(canvas.getByLabelText("Dans les 5 minutes"));
    await expect(canvas.getByLabelText("6 à 30 minutes")).not.toBeChecked();
  },
};
