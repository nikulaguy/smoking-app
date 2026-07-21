import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { TOOLS } from "../../profile/personalization";
import { ToolTile } from "./ToolTile";

/** Icône d'outil telle que dans l'app : l'illustration du catalogue TOOLS
    (zen, puzzle, human-note, video-play, gift, heart-care — maquette 91:1420),
    jamais d'emoji. */
const illu = (key: keyof typeof TOOLS) => (
  <img src={TOOLS[key].illustration} alt="" width={44} height={44} />
);

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
  args: { children: "Respirer · 3 min", icon: illu("respirer") },
};

export const Disabled: Story = {
  args: { children: "Mini-jeu", icon: illu("jeu"), disabled: true },
};

/** Grille 2 colonnes de la boîte à outils, illustrations du catalogue TOOLS. */
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
      {Object.values(TOOLS).map((t) => (
        <ToolTile
          key={t.key}
          icon={<img src={t.illustration} alt="" width={44} height={44} />}
        >
          {t.label}
        </ToolTile>
      ))}
    </div>
  ),
};
