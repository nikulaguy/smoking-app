import type { Meta, StoryObj } from "@storybook/react-vite";
import { design } from "../../../.storybook/utils";
import { TabBar } from "./TabBar";

const meta = {
  title: "App/TabBar",
  component: TabBar,
  tags: ["autodocs"],
  parameters: design(
    "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1094",
  ),
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccueilActif: Story = {
  render: () => (
    <TabBar>
      <TabBar.Item href="#" aria-current="page">
        Accueil
      </TabBar.Item>
      <TabBar.Item href="#">Fil</TabBar.Item>
      <TabBar.Item href="#">Défis</TabBar.Item>
      <TabBar.Item href="#">Profil</TabBar.Item>
    </TabBar>
  ),
};
