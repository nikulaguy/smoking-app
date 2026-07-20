import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { Card } from "./Card";

const meta = {
  title: "Socle/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=191-1777",
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Panneau d'information éditorial : fond subtil, jamais de flèche. */
export const Panel: Story = {
  args: {
    variant: "panel",
    badge: "Santé",
    title: "La nicotine a quitté ton corps",
    children:
      "Après 3 jours, il n'en reste plus une trace. Ce qui te tiraille maintenant, c'est l'habitude, pas la molécule.",
  },
};

/** Contenu tapable : bordure + flèche ↗ (règle sémantique 2026-07-12). */
export const LinkCard: Story = {
  args: {
    variant: "link",
    badge: "Étape suivante",
    title: "Termine ton profil · 2 min",
    children: "Pour que l'app s'adapte vraiment à toi.",
  },
};
