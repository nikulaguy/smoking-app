import type { ReactNode } from "react";

/** Écran d'onglet en attente de développement (Fil, Défis, Profil). */
export const Placeholder = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => (
  <div
    style={{
      display: "grid",
      gap: "var(--spacing-base-3)",
      padding: "calc(var(--spacing-base-14)) var(--spacing-base-4)",
      textAlign: "center",
      alignContent: "start",
    }}
  >
    <h1 style={{ font: "var(--text-body-1)", fontWeight: 600, margin: 0 }}>
      {title}
    </h1>
    <p style={{ margin: 0, color: "var(--foreground-subtle)" }}>
      {children ?? "Écran à venir."}
    </p>
  </div>
);
