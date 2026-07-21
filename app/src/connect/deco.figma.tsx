// Code Connect (publish CLI) — décors « Ligne de crête » (Deco.tsx).
import figma from "@figma/code-connect";
import { Crete, CreteDivider, Soleil } from "../components/Deco/Deco";

figma.connect(Crete, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=104-1755", {
  example: () => <Crete height={110} flag />,
});

// Le drapeau est planté par la Crete elle-même (prop flag).
figma.connect(Crete, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=104-1760", {
  example: () => <Crete height={110} flag />,
});

figma.connect(CreteDivider, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=104-1758", {
  example: () => <CreteDivider />,
});

figma.connect(Soleil, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=104-1763", {
  example: () => <Soleil body={sky.body} />,
});
