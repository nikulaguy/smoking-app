import { forwardRef } from "react";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import styles from "./ConseilsDate.module.css";

/** Une carte de conseil : badge (angle d'attaque), titre, texte. */
const TIPS = [
  {
    badge: "Le délai",
    title: "Vise dans les deux semaines",
    body: "Assez proche pour rester motivé, assez loin pour te préparer. Une date trop lointaine laisse le temps de changer d'avis : au-delà d'un mois, la motivation retombe.",
  },
  {
    badge: "Le stress",
    title: "Évite les tempêtes",
    body: "Ne cale pas ton jour J la veille d'un gros rendez-vous ou d'une période chargée. Mais n'attends pas le moment parfait : il y aura toujours une bonne raison de reporter.",
  },
  {
    badge: "Le symbole",
    title: "Une date qui compte",
    body: "Anniversaire, premier du mois, rentrée, nouvelle année ou Mois sans tabac en novembre : une date qui a du sens est plus facile à retenir et à honorer. Une date banale marche aussi.",
  },
  {
    badge: "Le cadre",
    title: "Vacances ou quotidien ?",
    body: "En vacances, tu es loin des automatismes (café, pauses, trajets). Dans ton quotidien, tu testes tout de suite en conditions réelles. Les deux marchent : choisis ton terrain.",
  },
  {
    badge: "L’engagement",
    title: "Dis-le autour de toi",
    body: "Note ta date, entoure-la, annonce-la à tes proches. Une date partagée engage bien plus qu'une date gardée secrète, et ton entourage saura t'épauler le jour J.",
  },
  {
    badge: "La préparation",
    title: "Le jour J se gagne avant",
    body: "D'ici ta date, chaque mission de ta préparation compte : tes raisons, tes alternatives, le grand tri. Arriver équipé au pied de la montagne change tout.",
  },
];

/**
 * Page de contenu « bien choisir sa date d'arrêt » (maquette 363:2884),
 * ouverte en sur-couche plein écran depuis l'écran de choix de date
 * (« Des conseils pour choisir une date ? »). Entrée par le haut, sortie
 * en sens inverse (grammaire des sur-couches). Ouverture par le parent :
 * `ref.current.showModal()`. Conseils issus de Tabac info service et des
 * programmes de référence (Smokefree.gov, American Cancer Society).
 */
export const ConseilsDate = forwardRef<HTMLDialogElement>((_props, ref) => (
  <dialog
    ref={ref}
    className={styles.dialog}
    aria-label="Des conseils pour choisir une date"
    tabIndex={-1}
    onToggle={(e) => {
      // showModal focalise le premier élément focusable (le CTA, en bas) :
      // reprendre le focus sur la page et repartir du haut du contenu.
      if (e.currentTarget.open) {
        e.currentTarget.scrollTop = 0;
        e.currentTarget.focus();
      }
    }}
  >
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Le bon moment</p>
        <h1 className={styles.title}>Le meilleur moment, c’est le tien.</h1>
        <p className={styles.intro}>
          Il n’y a pas de date magique. Mais une date posée à l’avance renforce
          ta motivation, laisse le temps de te préparer et transforme une envie
          en engagement. Quelques repères pour bien la choisir.
        </p>
        {TIPS.map((t) => (
          <Card key={t.badge} variant="panel" badge={t.badge} title={t.title}>
            {t.body}
          </Card>
        ))}
        <p className={styles.caption}>
          Conseils issus de Tabac info service (39 89, gratuit) et des
          programmes de référence internationaux.
        </p>
      </div>
      <div className={styles.ctaZone}>
        <Button
          variant="primary"
          onClick={(e) => e.currentTarget.closest("dialog")?.close()}
        >
          J’ai compris
        </Button>
      </div>
    </div>
  </dialog>
));
