// Code Connect (publish CLI) — coque de l'app et navigation de flux.
import figma from "@figma/code-connect";
import { FlowNav } from "../components/FlowNav/FlowNav";
import { ProgressIndicator } from "../components/ProgressIndicator/ProgressIndicator";
import { SosCraving } from "../components/SosCraving/SosCraving";
import { TabBar } from "../components/TabBar/TabBar";

figma.connect(TabBar, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1094", {
  example: () => (
    <TabBar>
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end}>
          {t.label}
        </NavLink>
      ))}
    </TabBar>
  ),
});

figma.connect(SosCraving, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1107", {
  example: () => (
    <SosCraving onClick={() => sosRef.current?.showModal()}>
      Une envie, là ?
    </SosCraving>
  ),
});

figma.connect(FlowNav, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=274-2154", {
  example: () => <FlowNav onBack={prev} onQuit={askQuit} />,
});

figma.connect(ProgressIndicator, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=4-9", {
  example: () => (
    <ProgressIndicator progress={1 / 3}>Étape 1 sur 3</ProgressIndicator>
  ),
});
