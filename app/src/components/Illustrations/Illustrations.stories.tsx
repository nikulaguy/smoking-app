import type { Meta, StoryObj } from "@storybook/react-vite";
import { Idea, Medal, Rocket, ThumbUp, Trophy } from "./Illustrations";

/**
 * Illustrations animées en boucle des écrans de jalon. Chaque illustration
 * joue son micro-scénario : fusée qui décolle et revient (fumée, rebond),
 * ampoule qui scintille puis s'éteint et se rallume, pouce qui se lève d'un
 * coup de ressort, trophée qui tremble et perd son couvercle (confettis),
 * médaille dont les rubans se déroulent puis flottent au vent.
 */
const meta = {
  title: "Socle/Illustrations",
  component: Rocket,
  tags: ["autodocs"],
} satisfies Meta<typeof Rocket>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fusee: Story = {
  render: () => <Rocket size={92} />,
};

export const Ampoule: Story = {
  render: () => <Idea size={110} />,
};

export const Pouce: Story = {
  render: () => <ThumbUp size={110} />,
};

export const Trophee: Story = {
  render: () => <Trophy size={110} />,
};

export const Medaille: Story = {
  render: () => <Medal size={110} />,
};

export const Toutes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
      <Rocket size={92} />
      <Idea size={110} />
      <ThumbUp size={110} />
      <Trophy size={110} />
      <Medal size={110} />
    </div>
  ),
};
