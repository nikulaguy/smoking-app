// Code Connect (publish CLI) — contenus et data-viz.
import figma from "@figma/code-connect";
import { Card } from "../components/Card/Card";
import { LikertScale } from "../components/LikertScale/LikertScale";
import { RecapItem } from "../components/RecapList/RecapList";
import { StatMetric } from "../components/StatMetric/StatMetric";

figma.connect(Card, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=191-1777", {
  example: () => (
    <Card variant="panel" badge="Le délai" title="Vise dans les deux semaines">
      Assez proche pour rester motivé, assez loin pour te préparer.
    </Card>
  ),
});

figma.connect(StatMetric, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=67-1116", {
  example: () => (
    <StatMetric size="compact" metricLabel="dans ta poche, chaque jour">
      12,50 €
    </StatMetric>
  ),
});

figma.connect(RecapItem, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=74-1209", {
  example: () => <RecapItem label="Ta conso">11 à 20 / jour</RecapItem>,
});

figma.connect(LikertScale, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=27-309", {
  example: () => (
    <LikertScale
      legend={<span>« L’affirmation à évaluer. »</span>}
      points={7}
      name="question"
      anchorMin="Pas du tout"
      anchorMax="Tout à fait"
      value={value}
      onChange={(v) => setAnswer(v)}
    />
  ),
});
