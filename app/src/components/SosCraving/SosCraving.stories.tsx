import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { SosCraving } from "./SosCraving";

const meta = {
  title: "App/SosCraving",
  component: SosCraving,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1107",
  ),
} satisfies Meta<typeof SosCraving>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Libellé élargi pour le profil « fumeuse en détresse ». */
export const Detresse: Story = {
  args: { children: "Un moment difficile ?" },
};
