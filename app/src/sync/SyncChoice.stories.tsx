import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SyncChoice } from "./SyncChoice";

/**
 * Modale de choix des données à la connexion : le compte contient déjà un
 * profil ET l'appareil porte des saisies jamais synchronisées. Trois issues :
 * reprendre le compte (primary), garder le local (secondary), repartir de
 * zéro (ghost, avec warning de confirmation). Échap est neutralisé.
 */
const meta = {
  title: "Sync/SyncChoice",
  component: SyncChoice,
  tags: ["autodocs"],
} satisfies Meta<typeof SyncChoice>;

export default meta;
type Story = StoryObj<typeof meta>;

const conflictOf = (resolve: (c: "remote" | "local" | "reset") => void) => ({
  remote: { answers: {}, quitAt: "2026-07-25T00:00:00.000Z" },
  resolve,
});

export const Choix: Story = {
  args: { conflict: conflictOf(() => {}) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Ton compte contient déjà des données"),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Reprendre les données de mon compte" }),
    ).toBeVisible();
  },
};

export const WarningReset: Story = {
  args: { conflict: conflictOf(() => {}) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Repartir de zéro" }),
    );
    await waitFor(() =>
      expect(
        canvas.getByText("Tout effacer et repartir de zéro ?"),
      ).toBeVisible(),
    );
  },
};
