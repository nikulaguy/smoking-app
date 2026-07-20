import { cx } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";
import { atom } from "../../atom";
import { Button } from "../Button/Button";
import { containerFieldVariants } from "../ContainerField/ContainerField";
import { SingleChoiceOption } from "../SingleChoiceOption/SingleChoiceOption";
import styles from "./SelectField.module.css";

export interface SelectFieldOption {
  value: string;
  label: ReactNode;
}

interface SelectFieldProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> {
  /** Libellé du champ. */
  label: ReactNode;
  /** Incitation affichée quand aucune valeur n'est choisie. */
  placeholder?: string;
  /** Titre du sélecteur plein écran (par défaut : le libellé du champ). */
  selectorTitle?: ReactNode;
  options: SelectFieldOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Message d'erreur (champ requis non renseigné à la validation). */
  error?: ReactNode;
}

/**
 * Champ de sélection fermé : au tap, ouvre un sélecteur PLEIN ÉCRAN
 * (dialog natif : focus piégé et Échap gratuits) — jamais de liste
 * déroulante flottante sur mobile. À la validation, le focus revient
 * au déclencheur et le nouvel intitulé annonce la valeur.
 */
export const SelectField = ({
  label,
  placeholder = "Choisir",
  selectorTitle,
  options,
  value,
  onChange,
  error,
  className,
  ...props
}: SelectFieldProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(value);
  const labelId = useId();
  const valueId = useId();
  const errorId = useId();
  const groupName = useId();
  const selected = options.find((o) => o.value === value);

  const open = () => {
    setDraft(value);
    dialogRef.current?.showModal();
  };
  const validate = () => {
    if (draft !== undefined) onChange?.(draft);
    dialogRef.current?.close();
  };

  return (
    <SelectField.Root className={className}>
      <SelectField.Label id={labelId}>{label}</SelectField.Label>
      <button
        type="button"
        className={cx(containerFieldVariants({}), styles.trigger)}
        aria-haspopup="dialog"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-describedby={error ? errorId : undefined}
        data-state={error ? "error" : undefined}
        onClick={open}
        {...props}
      >
        <SelectField.Value id={valueId} data-empty={!selected}>
          {selected ? selected.label : placeholder}
        </SelectField.Value>
        <SelectField.Chevron aria-hidden viewBox="0 0 16 16" width="16" height="16">
          <path
            d="M3 6l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SelectField.Chevron>
      </button>
      {error && <SelectField.Error id={errorId}>{error}</SelectField.Error>}

      <SelectField.Selector ref={dialogRef} aria-labelledby={`${labelId}-title`}>
        <SelectField.SelectorTitle id={`${labelId}-title`}>
          {selectorTitle ?? label}
        </SelectField.SelectorTitle>
        <SelectField.Options>
          {options.map((o) => (
            <SingleChoiceOption
              key={o.value}
              name={groupName}
              value={o.value}
              checked={draft === o.value}
              onChange={() => setDraft(o.value)}
            >
              {o.label}
            </SingleChoiceOption>
          ))}
        </SelectField.Options>
        <Button variant="primary" disabled={draft === undefined} onClick={validate}>
          Valider
        </Button>
      </SelectField.Selector>
    </SelectField.Root>
  );
};

/** Conteneur du champ. */
SelectField.Root = atom("div", styles.root);

/** Libellé du champ. */
SelectField.Label = atom("span", styles.fieldLabel);

/** Valeur courante (ou incitation en style placeholder). */
SelectField.Value = atom("span", styles.value);

/** Chevron décoratif du déclencheur. */
SelectField.Chevron = atom("svg", styles.chevron);

/** Message d'erreur, relié au déclencheur. */
SelectField.Error = atom("p", styles.errorMsg);

/** Sélecteur plein écran (dialog natif). */
SelectField.Selector = atom("dialog", styles.selector);

/** Titre du sélecteur. */
SelectField.SelectorTitle = atom("h2", styles.selectorTitle);

/** Groupe d'options du sélecteur. */
SelectField.Options = atom("fieldset", styles.options);
