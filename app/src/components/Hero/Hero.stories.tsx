import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { Hero } from "./Hero";

const meta = {
  title: "Socle/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=101-1586",
  ),
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** L'astre et les couleurs suivent l'heure locale (QA : ?sky=day|dawn|dusk|night). */
export const Ascension: Story = {
  args: {
    creteHeight: 150,
    flag: true,
    children: (
      <>
        <p style={{ margin: 0, font: "var(--text-caption-1)", color: "var(--content-on-immersive-subtle)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Jour 4 sans fumer
        </p>
        <h1 style={{ margin: 0, font: "var(--text-h2)", color: "var(--content-on-immersive)" }}>
          Ton ascension.
        </h1>
      </>
    ),
  },
};

/** Sans soleil (onglets secondaires) et crête basse. */
export const Compact: Story = {
  args: {
    creteHeight: 70,
    sun: false,
    children: (
      <h1 style={{ margin: 0, font: "var(--text-h3)", color: "var(--content-on-immersive)" }}>
        Ton camp de base.
      </h1>
    ),
  },
};
