import { useAppNavigate } from "../lib/nav";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import { useProfile } from "../profile/profile";
import styles from "../compte/Compte.module.css";

/**
 * Mission « Prépare tes alternatives » : le catalogue des gestes qui
 * remplacent la cigarette. Contenu adapté des recommandations de
 * Tabac info service (l'envie passe en 3 à 5 minutes : l'objectif est
 * d'avoir un réflexe prêt AVANT le jour J).
 */
const ALTERNATIVES: { badge: string; title: string; text: string }[] = [
  {
    badge: "Boire",
    title: "Un grand verre d’eau",
    text: "Lentement, gorgée par gorgée. Ça occupe la bouche et les mains, et ça aide à éliminer la nicotine.",
  },
  {
    badge: "Respirer",
    title: "Trois respirations profondes",
    text: "Inspire par le nez, souffle longuement par la bouche. C’est le geste le plus proche de la bouffée, sans la clope.",
  },
  {
    badge: "Bouger",
    title: "Une courte marche",
    text: "Changer de pièce, sortir cinq minutes, monter un escalier : le mouvement coupe l’envie et libère la tension.",
  },
  {
    badge: "Mâcher",
    title: "Chewing-gum ou bâton de réglisse",
    text: "Sans sucre de préférence. Un fruit, un légume à croquer ou un verre d’eau pétillante marchent aussi.",
  },
  {
    badge: "Les mains",
    title: "De quoi occuper tes doigts",
    text: "Balle anti-stress, stylo, élastique, ton téléphone (un mini-jeu de l’app, par exemple). Les mains oisives réclament la cigarette.",
  },
  {
    badge: "La tête",
    title: "Changer d’activité 5 minutes",
    text: "L’envie ne dure que 3 à 5 minutes : lance une musique, un message à ton allié, une petite tâche. Elle sera passée avant la fin.",
  },
  {
    badge: "Substituts",
    title: "Les substituts nicotiniques",
    text: "Patchs, gommes, pastilles : ils doublent tes chances de réussite et sont remboursés sur ordonnance. Parles-en à un professionnel ou au 39 89.",
  },
];

export const Alternatives = () => {
  const navigate = useAppNavigate();
  const { state, togglePrepMission } = useProfile();

  const done = () => {
    if (!state.prepChecklist?.includes("alternatives"))
      togglePrepMission("alternatives");
    navigate(-1);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Ta préparation</p>
        <h1 className={styles.titleLg}>Tes alternatives à l’envie.</h1>
        <p className={styles.helperSm}>
          Une envie dure 3 à 5 minutes. Choisis deux ou trois gestes dans cette
          liste et prépare-les pour le jour J : le réflexe prêt, l’envie passe.
        </p>
        {ALTERNATIVES.map((a) => (
          <Card key={a.title} variant="panel" badge={a.badge} title={a.title}>
            {a.text}
          </Card>
        ))}
        <p className={styles.caption}>
          Adapté des conseils de Tabac info service (
          <a href="https://www.tabac-info-service.fr" target="_blank" rel="noreferrer">
            tabac-info-service.fr
          </a>
          , 39 89).
        </p>
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
