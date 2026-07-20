import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { ToolTile } from "./ToolTile";

const meta = {
  title: "App/ToolTile",
  component: ToolTile,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=91-1420",
  ),
} satisfies Meta<typeof ToolTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Respirer · 3 min", icon: "🧘" },
};

export const Disabled: Story = {
  args: { children: "Mini-jeu", icon: "🧩", disabled: true },
};

/** Grille 2 colonnes de la boîte a outils. */
export const Grille: Story = {
  args: { children: "" },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        maxWidth: 343,
      }}
    >
      <ToolTile icon="🧘">Respirer · 3 min</ToolTile>
      <ToolTile icon="🧩">Mini-jeu</ToolTile>
      <ToolTile icon="🎧">Histoire audio</ToolTile>
      <ToolTile icon="🎬">Vidéo · 1 min</ToolTile>
      <ToolTile icon="🎁">Une blague</ToolTile>
      <ToolTile icon="❤️">Tes raisons</ToolTile>
    </div>
  ),
};
