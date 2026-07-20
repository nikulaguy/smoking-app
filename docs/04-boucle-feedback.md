# Boucle de feedback et adaptation évolutive

Ce qui rend l'app vivante : le profil et la configuration ne sont pas figés, ils se recalculent dans le temps a partir de ce que l'utilisateur fait et déclare. Objectif final : maximiser l'efficacité réelle et rendre l'utilisateur progressivement autonome.

## 1. Trois échelles de temps

| Échelle | Source | Ce qu'elle ajuste | Fréquence |
|---|---|---|---|
| **Micro (temps réel)** | EMA in-app, comportement | Notifications, contenu du moment, outil anti-craving | Continue |
| **Macro (individuel)** | Re-profilage, efficacité perçue | Archétype, modificateurs, config | Hebdo a mensuel |
| **Produit (population)** | A/B testing par sous-type | Les règles elles-mêmes | Cycles produit |

## 2. Micro-feedback : EMA (Ecological Momentary Assessment)

Courtes questions in-app pour nourrir l'adaptation en temps réel, sans capteurs au départ (la recherche montre que la prédiction ML de rechute reste modérée, ROC-AUC ~0,66 ; on commence donc par de l'auto-déclaratif simple et fiable).

- **Sondes courtes** : « Envie la, de 1 a 5 ? », « Comment tu te sens ? », déclenchées aux decision points ou a la demande.
- **Feedback d'outil** : après chaque intervention proposée (respiration, mini-jeu, contenu), une question binaire « Ça t'a aidé ? ». C'est le signal le plus précieux.
- **Effet immédiat** : une envie déclarée haute a un moment a risque déclenche l'outil correspondant au profil (cf. moteur de notifications, doc 03).

## 3. Macro-feedback : re-profilage et efficacité perçue

- **Re-test périodique** des échelles clés :
  - **SASEQ (auto-efficacité)** : prédicteur validé de rechute, doit monter dans le temps.
  - **Motivation (F-SCMS)** : on suit le **ratio intrinsèque/extrinsèque**, KPI de fond. Sa hausse signale l'internalisation, donc un arrêt plus durable.
  - **Entourage fumeur** : la baisse du nombre de fumeurs autour de soi est un prédicteur validé du succès, a re-mesurer.
- **Efficacité perçue** : « Cette semaine, l'app t'a aidé ? », notation des modules et des mécaniques. Un module mal noté par un profil est déprioritisé pour ce profil.
- **Déclaratif de statut** : jours sans fumer, rechutes (sans jugement), reprise.

## 4. Recalcul du profil et de la config

Le profil est un état vivant. Règles de recalcul :

| Événement | Recalcul déclenché |
|---|---|
| Re-test SASEQ | Modificateur « soutien élevé » ajouté ou retiré |
| Re-test motivation | Ratio intrinsèque/extrinsèque mis a jour ; modificateur « internalisation » ajusté ; bascule progressive du ton (récompense vers sens) |
| Baisse de l'engagement (voir signaux) | Réévaluation du rythme de notifications et des mécaniques |
| Feedback d'outil répété (aidé / pas aidé) | Pondération du feed et des interventions ajustée |
| Rechute déclarée | Passage en mode soutien, dédramatisation, relance douce |
| Changement d'entourage | Modificateur « entourage fumeur » réévalué |

Principe de transition : un utilisateur qui passe d'une motivation extrinsèque a intrinsèque voit son app changer de ton et de mécaniques. C'est visible et valorisé (« Tu ne le fais plus pour les autres, tu le fais pour toi »).

Renouvellement : l'effet de la gamification s'atténue après 6 mois (recherche). Prévoir des paliers de sens et de nouvelles mécaniques a moyen terme pour éviter la lassitude, surtout pour l'archétype habituel CSP+.

## 5. Boucle produit : A/B testing par sous-type

On améliore les règles de la matrice, pas seulement l'expérience individuelle.

- **Segmentation des tests** : tester une variation de mécanique par sous-type, car un effet moyen masque des effets opposés selon les profils (rappel : les hédonistes décrochent la ou les autres restent).
- **Mesure sur le vrai résultat** : on juge une variation sur l'abstinence et l'auto-efficacité, pas sur l'engagement seul.
- **Priorité** : sécuriser d'abord le parcours anti-churn du jeune hédoniste (le plus fragile, donc le plus rentable a corriger).

## 6. KPIs et anti-métriques

**KPIs (ce qu'on optimise)** :
- Jours sans fumer, taux d'abstinence a 1, 3, 6, 12 mois.
- Auto-efficacité (SASEQ) et sa progression.
- Ratio intrinsèque/extrinsèque et sa progression (internalisation).
- Rétention utile (revient et progresse), pas rétention brute.

**Anti-métriques (signaux d'alerte éthique, a ne PAS maximiser)** :
- Temps d'écran, scroll infini nocturne, notifications compulsives.
- Dépendance a l'app sans progression de l'autonomie.

Si un KPI d'engagement monte pendant que l'abstinence stagne, c'est un signal de dark pattern a corriger, pas un succès.

## 7. Signaux d'alerte et réengagement

- **Signaux de décrochage** : chute du taux de réponse aux notifications, sessions plus courtes, modules abandonnés. Déclenche une relance douce et une réévaluation du rythme.
- **Signaux de rechute** : rechute déclarée ou détectée (compteur remis). Réponse : dédramatisation, pas de culpabilisation, relance d'un micro-objectif.
- **Signaux de détresse** : mentions inquiétantes, détresse émotionnelle marquée. Réponse : orientation vers des ressources d'aide humaine et professionnelles. L'app n'est pas un dispositif de soin en santé mentale.

## 8. Format des événements (handoff design vers dev)

```
evenement = {
  type:        ema_sonde | feedback_outil | retest_echelle |
               statut_declare | signal_engagement | rechute,
  timestamp:   datetime,
  payload:     { ... selon type ... },
  effet:       { recalcul_profil: bool, ajustement_config: [...] }
}
```

Les événements alimentent en continu le vecteur de profil (doc 02) et la config (doc 03). La boucle est fermée : questionnaire -> profil -> config -> comportement -> feedback -> recalcul.
