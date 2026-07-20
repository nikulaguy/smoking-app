import { Outlet, ScrollRestoration } from "react-router-dom";

/**
 * Layout racine de toutes les routes. `ScrollRestoration` garantit un
 * comportement de scroll normal : on arrive TOUJOURS en haut d'un nouvel écran,
 * et la position est restaurée au retour arrière.
 */
export const RootLayout = () => (
  <>
    <ScrollRestoration />
    <Outlet />
  </>
);
