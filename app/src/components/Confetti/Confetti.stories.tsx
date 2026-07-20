import type { Meta, StoryObj } from "@storybook/react-vite";
import { Confetti } from "./Confetti";

const meta = {
  title: "Socle/Confetti",
  component: Confetti,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pluie fine de célébration (teintes Core). Jouée à chaque complétion de la check-list de préparation. Décorative, éphémère, respecte prefers-reduced-motion.",
      },
    },
  },
} satisfies Meta<typeof Confetti>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pluie: Story = {};
