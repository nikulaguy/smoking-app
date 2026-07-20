import { supabase } from "../lib/supabase";
import type { ProfileState } from "../profile/profile";

/**
 * Export de portabilité (RGPD art. 20) : tout ce que l'app sait, dans
 * un fichier JSON lisible qui appartient à l'utilisateur. Côté front
 * l'export est réel (les données vivent en local).
 */
export const downloadProfileExport = (state: ProfileState) => {
  const payload = {
    app: "SmokingApp",
    exportedAt: new Date().toISOString(),
    profil: state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smokingapp-mes-donnees.json";
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Efface tout le profil et repart de zéro. Connecté : la fonction serveur
 * `delete-account` applique le protocole conforme (données produit effacées
 * immédiatement, demande horodatée, 30 jours de rétractation, connexion
 * suspendue), puis déconnexion. Le local est vidé dans tous les cas.
 */
export const deleteProfile = async () => {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) {
        // repli : on efface au moins les données produit distantes
        await supabase.from("profiles").delete().eq("id", data.session.user.id);
      }
      await supabase.auth.signOut();
    }
  }
  localStorage.removeItem("smokingapp.profile");
  localStorage.removeItem("smokingapp.onboarding");
  location.assign("/");
};
