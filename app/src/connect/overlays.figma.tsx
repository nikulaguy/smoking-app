// Code Connect (publish CLI) — sur-couches, réglages et outils.
import figma from "@figma/code-connect";
import { Drawer } from "../components/Drawer/Drawer";
import { Switch } from "../components/Switch/Switch";
import { ToolTile } from "../components/ToolTile/ToolTile";

figma.connect(Drawer, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=316-3584", {
  example: () => (
    <Drawer
      ref={drawerRef}
      title="Supprimer ces informations ?"
      confirmLabel="Confirmer"
      cancelLabel="Annuler"
      onConfirm={handleConfirm}
    >
      Tu pourras les ajouter plus tard.
    </Drawer>
  ),
});

figma.connect(Switch, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=326-2411", {
  example: () => (
    <Switch
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
      description="Coupe ou réactive tous les rappels."
    >
      Toutes les notifications
    </Switch>
  ),
});

figma.connect(ToolTile, "https://www.figma.com/design/LDK3DSGI3aNuG0TeQhmZhq/Smoking-App?node-id=91-1420", {
  example: () => (
    <ToolTile
      icon={<img src={illustration} alt="" width={44} height={44} />}
      onClick={() => navigate(tool)}
    >
      Respirer · 3 min
    </ToolTile>
  ),
});
