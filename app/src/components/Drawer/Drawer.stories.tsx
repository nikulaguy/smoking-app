import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useEffect, useRef } from "react";
import { Button } from "../Button/Button";
import { Drawer } from "./Drawer";

const meta = {
  title: "Socle/Drawer",
  component: Drawer,
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Ouvre la modale au montage (rendu réel : overlay + ancrage bas). */
function OpenedDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.show(); // show() (non modal) : le portail Storybook reste testable
  }, []);
  return (
    <Drawer
      ref={ref}
      title="Supprimer ces informations ?"
      confirmLabel="Confirmer"
      cancelLabel="Annuler"
      onConfirm={() => {}}
    >
      Tu pourras les ajouter plus tard.
    </Drawer>
  );
}

export const Ouvert: Story = {
  args: {
    title: "Supprimer ces informations ?",
    confirmLabel: "Confirmer",
    cancelLabel: "Annuler",
    onConfirm: () => {},
  },
  render: OpenedDrawer,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Supprimer ces informations ?")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Annuler" }));
    // La fermeture est animée (380 ms, allow-discrete) : le dialog reste
    // visible le temps de la transition de sortie.
    await waitFor(() =>
      expect(canvas.queryByText("Supprimer ces informations ?")).not.toBeVisible(),
    );
  },
};

/** Déclenchement depuis un bouton parent (pattern d'usage réel). */
function TriggeredDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          ref.current?.show();
          ref.current?.focus();
        }}
      >
        Ouvrir la modale
      </Button>
      <Drawer
        ref={ref}
        title="Les rappels par mail nécessitent d’avoir un compte (gratuit)"
        confirmLabel="Se connecter"
        cancelLabel="Plus tard"
        onConfirm={() => {}}
      />
    </>
  );
}

export const Declenchement: Story = {
  args: {
    title: "",
    confirmLabel: "Se connecter",
    cancelLabel: "Plus tard",
    onConfirm: () => {},
  },
  render: TriggeredDrawer,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Ouvrir la modale" }));
    await expect(
      canvas.getByText(/nécessitent d’avoir un compte/),
    ).toBeVisible();
  },
};
