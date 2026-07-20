import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { TextField } from "./TextField";

const meta = {
  title: "Socle/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=97-1537",
  ),
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Ton adresse mail",
    placeholder: "toi@exemple.fr",
    caption: "Pas de mot de passe : on t'envoie un lien, tu cliques, c'est tout.",
  },
};

export const Rempli: Story = {
  args: { label: "Prix de ton paquet", defaultValue: "12.5" },
};

export const Erreur: Story = {
  args: {
    label: "Ton adresse mail",
    defaultValue: "pas-un-mail",
    error: "L'envoi a échoué. Vérifie l'adresse, ou réessaie dans un instant.",
  },
};

export const Date: Story = {
  args: {
    label: "Depuis quand ?",
    type: "date",
    caption: "Le jour de ta dernière cigarette : tes compteurs reprennent depuis ce jour-là.",
  },
};
