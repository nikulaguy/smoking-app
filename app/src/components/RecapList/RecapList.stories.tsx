import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { RecapItem, RecapList } from "./RecapList";

const meta = {
  title: "App/RecapList",
  component: RecapList,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=74-1209",
  ),
} satisfies Meta<typeof RecapList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfilComplet: Story = {
  render: () => (
    <RecapList>
      <RecapItem label="Tes moteurs">Santé + liberté</RecapItem>
      <RecapItem label="Ton point chaud">Le stress</RecapItem>
      <RecapItem label="Ton style de jeu">Battant</RecapItem>
    </RecapList>
  ),
};
