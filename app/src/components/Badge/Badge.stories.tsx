import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { Badge } from "./Badge";

const meta = {
  title: "Socle/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=101-1589",
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "default", children: "Palier à venir" },
};

export const Primary: Story = {
  args: { variant: "primary", children: "Jour 4" },
};

export const Alternate1: Story = {
  args: { variant: "alternate1", children: "Niveau 1 · Grimpeur" },
};

export const Alternate2: Story = {
  args: { variant: "alternate2", children: "Jour gravi" },
};

export const Alternate3: Story = {
  args: { variant: "alternate3", children: "Défi flash" },
};

export const Alternate4: Story = {
  args: { variant: "alternate4", children: "En pause" },
};

export const Alternate5: Story = {
  args: { variant: "alternate5", children: "Profil complété" },
};
