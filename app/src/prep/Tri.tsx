import { useAppNavigate } from "../lib/nav";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import { useProfile } from "../profile/profile";
import styles from "../compte/Compte.module.css";

/**
 * Mission « Fais le tri » : passer le logement (et le reste) au peigne fin.
 * Hors de vue, hors de portée : chaque objet du fumeur qui reste est un
 * déclencheur en puissance le jour J.
 */
const ZONES: { badge: string; title: string; text: string }[] = [
  {
    badge: "Les stocks",
    title: "Paquets et tabac",
    text: "Paquets entamés, cartouches d’avance, pot de tabac à rouler, feuilles, filtres, tubes et la tubeuse. Tout part, même le paquet « de secours ».",
  },
  {
    badge: "Le feu",
    title: "Briquets et allumettes",
    text: "Tous les briquets qui traînent : poches, sacs, tiroirs, voiture. Garde-en un seul s’il sert aux bougies, rangé loin de la cuisine.",
  },
  {
    badge: "Les cendriers",
    title: "Intérieur, balcon, jardin",
    text: "Cendriers du salon, du balcon, de la terrasse, le pot improvisé près de la porte. Lavés et donnés, ou jetés.",
  },
  {
    badge: "La voiture",
    title: "L’habitacle complet",
    text: "Cendrier de bord, allume-cigare dégagé, boîte à gants, vide-poches. Un coup d’aspirateur et de désodorisant : l’odeur aussi est un déclencheur.",
  },
  {
    badge: "Les poches",
    title: "Sacs, vestes et manteaux",
    text: "Vide toutes les poches : mégots, briquets oubliés, paquets écrasés. Pense aux vestes de saison rangées dans l’armoire.",
  },
  {
    badge: "L’odeur",
    title: "Textiles et pièces fumeur",
    text: "Lave rideaux, plaids, housses ; aère en grand la pièce où tu fumais. Un chez-toi qui sent le propre ne te rappelle pas la clope.",
  },
  {
    badge: "Le coin fumeur",
    title: "Casse le rituel du lieu",
    text: "Réaménage le balcon ou le fauteuil du café-clope : une plante, une chaise déplacée. Le lieu change, l’automatisme perd ses repères.",
  },
];

export const Tri = () => {
  const navigate = useAppNavigate();
  const { state, togglePrepMission } = useProfile();

  const done = () => {
    if (!state.prepChecklist?.includes("tri")) togglePrepMission("tri");
    navigate(-1);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Ta préparation</p>
        <h1 className={styles.titleLg}>Le grand tri.</h1>
        <p className={styles.helperSm}>
          La veille du jour J, fais le tour : tout ce qui rappelle la cigarette
          sort de ta vue. Voilà la tournée complète, pièce par pièce.
        </p>
        {ZONES.map((z) => (
          <Card key={z.title} variant="panel" badge={z.badge} title={z.title}>
            {z.text}
          </Card>
        ))}
      </div>
      <div className={styles.ctaZone}>
        <Button variant="primary" onClick={done}>
          Valider
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Annuler
        </Button>
      </div>
    </div>
  );
};
