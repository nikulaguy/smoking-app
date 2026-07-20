import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { ContainerField } from "./ContainerField";

const meta = {
  title: "Socle/ContainerField",
  component: ContainerField,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=1-877",
  ),
} satisfies Meta<typeof ContainerField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Contenu du champ" },
};

export const Selected: Story = {
  render: () => <ContainerField data-state="selected">Sélectionné</ContainerField>,
};

export const Error: Story = {
  render: () => <ContainerField data-state="error">En erreur</ContainerField>,
};

export const Disabled: Story = {
  render: () => <ContainerField data-state="disabled">Désactivé</ContainerField>,
};

export const Compact: Story = {
  args: { children: "4", size: "compact" },
};

export const Tile: Story = {
  args: { children: "Respirer", size: "tile" },
};
