import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { useRef } from "react";
import { design } from "../../../.storybook/utils";
import { FlowNav, QuitDialog } from "./FlowNav";

const meta = {
  title: "Socle/FlowNav",
  component: FlowNav,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=274-2154",
  ),
} satisfies Meta<typeof FlowNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Retour + quitter : toutes les étapes intermédiaires d'un flux. */
export const Complet: Story = {
  args: { onBack: () => {}, onQuit: () => {} },
};

/** Première étape d'un flux : pas de retour, seulement quitter. */
export const SansRetour: Story = {
  args: { onQuit: () => {} },
};

/** Écran final : retour seul (quitter n'a plus de sens). */
export const SansQuitter: Story = {
  args: { onBack: () => {} },
};

/** La confirmation de sortie : rassure (rien n'est perdu), Reprendre en action principale. */
export const ConfirmationDeSortie: Story = {
  args: { onBack: () => {}, onQuit: () => {} },
  render: function NavAvecDialog(args) {
    const ref = useRef<HTMLDialogElement>(null);
    return (
      <>
        <FlowNav {...args} onQuit={() => ref.current?.showModal()} />
        <QuitDialog ref={ref} onQuit={() => {}} />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Quitter l\u2019onboarding" }));
    const dialog = canvasElement.querySelector("dialog") as HTMLDialogElement;
    await expect(dialog.open).toBe(true);
    await userEvent.click(within(dialog).getByRole("button", { name: "Reprendre" }));
    await expect(dialog.open).toBe(false);
  },
};
