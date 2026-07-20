import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { Link } from "./Link";

const meta = {
  title: "Socle/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=139-1874",
  ),
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Action: Story = {
  args: { children: "Pas aujourd’hui" },
};

export const Navigation: Story = {
  args: {
    children: "Parler à quelqu’un",
    href: "https://www.tabac-info-service.fr",
    target: "_blank",
    rel: "noreferrer",
  },
};
