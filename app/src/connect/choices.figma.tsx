// Code Connect (publish CLI) — options de choix et leur socle.
import figma from "@figma/code-connect";
import { ContainerField } from "../components/ContainerField/ContainerField";
import { MultiChoiceOption } from "../components/MultiChoiceOption/MultiChoiceOption";
import { SingleChoiceOption } from "../components/SingleChoiceOption/SingleChoiceOption";
import { SelectField } from "../components/SelectField/SelectField";

figma.connect(SingleChoiceOption, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=3-36", {
  example: () => (
    <SingleChoiceOption
      name="groupe"
      checked={false}
      onChange={() => setAnswer("valeur")}
    >
      Réponse
    </SingleChoiceOption>
  ),
});

figma.connect(MultiChoiceOption, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=36-572", {
  example: () => (
    <MultiChoiceOption
      name="groupe"
      checked={false}
      onChange={() => toggle("valeur")}
    >
      Réponse
    </MultiChoiceOption>
  ),
});

figma.connect(ContainerField, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=1-877", {
  example: () => (
    <ContainerField size="default">
      {/* socle visuel commun : le contenu (input natif…) vient du consommateur */}
    </ContainerField>
  ),
});

figma.connect(SelectField, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=20-161", {
  example: () => (
    <SelectField
      label="Par jour"
      selectorTitle="Combien de cigarettes par jour ?"
      options={OPTIONS}
      value={value}
      onChange={(v) => setAnswer(v)}
    />
  ),
});
