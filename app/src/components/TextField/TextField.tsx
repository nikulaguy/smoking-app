import { cx } from "class-variance-authority";
import { type InputHTMLAttributes, type ReactNode, useId } from "react";
import { atom } from "../../atom";
import { containerFieldVariants } from "../ContainerField/ContainerField";
import styles from "./TextField.module.css";

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Libellé du champ. */
  label: ReactNode;
  /** Texte d'aide sous le champ. */
  caption?: ReactNode;
  /** Message d'erreur — remplace la caption et passe la coque en erreur. */
  error?: ReactNode;
}

/**
 * Champ de saisie texte (label + input natif dans la coque container-field
 * + caption d'aide ou message d'erreur relié par aria-describedby).
 */
export const TextField = ({
  label,
  caption,
  error,
  className,
  ...inputProps
}: TextFieldProps) => {
  const inputId = useId();
  const descId = useId();
  return (
    <TextField.Root className={className}>
      <TextField.Label htmlFor={inputId}>{label}</TextField.Label>
      <div className={containerFieldVariants({})}>
        <TextField.Input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={caption || error ? descId : undefined}
          {...inputProps}
        />
      </div>
      {(error || caption) && (
        <TextField.Caption
          id={descId}
          className={cx(error && styles.error)}
        >
          {error || caption}
        </TextField.Caption>
      )}
    </TextField.Root>
  );
};

/** Conteneur du champ. */
TextField.Root = atom("div", styles.root);

/** Libellé, relié à l'input. */
TextField.Label = atom("label", styles.label);

/** Input natif. */
TextField.Input = atom("input", styles.input);

/** Aide ou erreur sous le champ. */
TextField.Caption = atom("p", styles.caption);
