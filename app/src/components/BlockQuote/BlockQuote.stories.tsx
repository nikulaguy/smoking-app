import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { BlockQuote } from "./BlockQuote";

const meta = {
  title: "Socle/BlockQuote",
  component: BlockQuote,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=151-1765",
  ),
} satisfies Meta<typeof BlockQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Pour mes enfants.", author: "Toi, au jour 0" },
};

export const Exergue: Story = {
  args: {
    children: "Pour mes enfants.",
    author: "Toi, au jour 0",
    size: "exergue",
  },
};
