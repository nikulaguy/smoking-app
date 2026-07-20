import { cx } from "class-variance-authority";
import type { InputHTMLAttributes, ReactNode } from "react";
import { atom } from "../../atom";
import {
  containerFieldVariants,
  type ContainerFieldVariants,
} from "../ContainerField/ContainerField";
import styles from "./SingleChoiceOption.module.css";

interface SingleChoiceOptionProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Intitulé de l'option (texte ou contenu riche). */
  children: ReactNode;
  /** Petite description secondaire sous l'intitulé (optionnelle). */
  description?: ReactNode;
  /** Taille de la coque container-field. */
  size?: ContainerFieldVariants["size"];
}

/**
 * Option à choix unique au sein d'un groupe : une seule option sélectionnée
 * à la fois. Toute la rangée est cliquable (le label englobe l'input natif).
 * `description` ajoute une petite ligne secondaire sous l'intitulé.
 *
 * Le groupe d'options doit être un `<fieldset>` avec `<legend>` = la question,
 * et toutes les options partagent le même `name`. Clavier natif radio :
 * flèches pour changer, Tab pour entrer/sortir du groupe.
 */
export const SingleChoiceOption = ({
  children,
  description,
  size = "default",
  className,
  ...inputProps
}: SingleChoiceOptionProps) => (
  <SingleChoiceOption.Root
    className={cx(containerFieldVariants({ size }), className)}
  >
    <SingleChoiceOption.Input type="radio" {...inputProps} />
    <SingleChoiceOption.Label>
      <span className={styles.title}>{children}</span>
      {description && <span className={styles.description}>{description}</span>}
    </SingleChoiceOption.Label>
  </SingleChoiceOption.Root>
);

/** Coque de l'option — un label qui englobe l'input (rangée entière cliquable). */
SingleChoiceOption.Root = atom("label", styles.option);

/** Input radio natif, stylé en CSS (jamais de div role="radio"). */
SingleChoiceOption.Input = atom("input", styles.input);

/** Intitulé de l'option. */
SingleChoiceOption.Label = atom("span", styles.label);
