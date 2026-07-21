import { cx } from "class-variance-authority";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { atom } from "../../atom";
import {
  containerFieldVariants,
  type ContainerFieldVariants,
} from "../ContainerField/ContainerField";
import { Radiobox, radioboxText } from "../Radiobox/Radiobox";
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
 * à la fois. Toute la rangée est cliquable (le label englobe l'input radio
 * natif). Structure : coque container-field (socle commun des états), et dans
 * son slot les atoms du Radiobox (puce, intitulé, conditions). Le groupe
 * d'options est un fieldset avec legend = la question ; toutes les options
 * partagent le même name. Ne jamais mélanger deux groupes de choix sur un
 * même écran. (Description canonique, synchronisée avec le champ natif du
 * composant Figma 3:36 et sa fiche de doc.)
 */
export const SingleChoiceOption = ({
  children,
  description,
  size = "default",
  className,
  id,
  ...inputProps
}: SingleChoiceOptionProps) => {
  // RGAA 11.1.2 : même englobant, le label porte un for explicite vers l'id
  // de l'input.
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <SingleChoiceOption.Root
      className={cx(containerFieldVariants({ size }), className)}
      htmlFor={inputId}
    >
      <Radiobox.Input type="radio" id={inputId} {...inputProps} />
      <Radiobox.Texts>
        <span className={radioboxText.label}>{children}</span>
        {description && (
          <span className={radioboxText.conditions}>{description}</span>
        )}
      </Radiobox.Texts>
    </SingleChoiceOption.Root>
  );
};

/** Coque de l'option — un label qui englobe l'input (rangée entière cliquable). */
SingleChoiceOption.Root = atom("label", styles.option);
