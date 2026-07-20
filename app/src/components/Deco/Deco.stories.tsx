import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { Crete, CreteDivider, Soleil } from "./Deco";

const meta = {
  title: "Socle/Deco",
  component: Crete,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=104-1755",
  ),
} satisfies Meta<typeof Crete>;

export default meta;
type Story = StoryObj<typeof meta>;

const immersive = {
  position: "relative" as const,
  height: 220,
  background: "var(--surface-immersive)",
  overflow: "hidden",
};

/** Strates de crête, drapeau planté sur le pic (destination / progression). */
export const CreteAvecDrapeau: Story = {
  args: { height: 110, flag: true },
  render: (args) => (
    <div style={immersive}>
      <Crete {...args} />
    </div>
  ),
};

/** L'astre suit l'heure : soleil le jour, lune la nuit (voir Hero). */
export const Astres: Story = {
  render: () => (
    <div style={{ ...immersive, display: "flex", gap: 16 }}>
      <Soleil body="sun" style={{ position: "static" }} />
      <Soleil body="moon" style={{ position: "static" }} />
    </div>
  ),
};

/** Séparateur en ligne de crête, remplace les filets droits. */
export const Divider: Story = {
  render: () => <CreteDivider />,
};
