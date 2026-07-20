# Questionnaire de profilage

Spécification complète. C'est la brique dont dépend toute la personnalisation.

## Principe

Profilage en **deux temps** pour combattre le churn (les jeunes hédonistes décrochent a 70% des la 1re session) :
- **Phase 1, onboarding express (Jour 0, < 2 min)** : juste ce qu'il faut pour donner de la valeur immédiate.
- **Phase 2, profilage progressif (J1 a J7)** : gamifié, l'app « apprend a te connaître » chapitre par chapitre.

Statut des items :
- Validé verbatim : a reprendre tel quel (ex : HSI).
- Opérationnalisé pour le design : formulation a finaliser sur la source validée avant prod ; structure et scoring bons pour concevoir.

Convention retenue : items design prêts a maquetter maintenant, verbatim validés injectés juste avant le développement.

---

## PHASE 1 — Onboarding express (Jour 0)

### Module 0 — Données pratiques
Alimente les compteurs temps réel (argent économisé, cigarettes non fumées, bénéfices santé).

Parti pris UX (décisions du 2026-07-12) : minimiser la saisie clavier. Tout passe par des sélecteurs plein écran (pas de dropdown desktop miniature sur mobile), sauf le prix qui est pré-rempli.

| # | Question | Réponse |
|---|---|---|
| 0.0 | Tu fumes plutôt... | choix unique : cigarettes / tabac a rouler |
| 0.1 | Cigarettes par jour | sélecteur plein écran, tranches : moins de 5 / 5 a 10 / 11 a 20 / 21 a 30 / plus de 30 |
| 0.2 | Prix de ton paquet | champ pré-rempli avec le prix moyen selon la localisation (France : 12,50 € le paquet de 20 ; tabac a rouler : prix du pot de 30 g, ~16,50 €), aide « Ajuste si besoin » |
| 0.4 | Tu fumes depuis | sélecteur plein écran, tranches (maquette 2b) : moins de 5 ans / 5 a 10 / 11 a 20 / 21 a 30 / plus de 30 ans |
| 0.5 | As-tu une date d'arrêt en tête ? | choix unique : date / « pas encore, aide-moi » |
| 0.5 bis | On vise quand ? | **suggestions guidées** (pas de calendrier) : demain / dans 3 jours / ce week-end / dans 2 semaines / une autre date. Principe : assez proche pour rester motivé, assez loin pour se préparer |

Cas « Une autre date » (traité 2026-07-12, écran « 3a · Une autre date ») : sélectionner cette option **révèle un champ date sous la liste** (progressive disclosure, focus déplacé dessus). En web : `input type="date"` natif avec `min = demain` (le sélecteur de l'OS sert de date picker, pas de calendrier custom). Choisir une autre option masque le champ et vide sa valeur. Le CTA reste désactivé tant que la date est vide ou invalide (date passée = erreur).
| 0.6 | Tu fumes aussi des joints ? (optionnel) | choix unique : oui régulièrement / de temps en temps / non jamais / je préfère ne pas répondre |
| 0.7 | En une phrase : pourquoi tu arrêtes ? (optionnel) | saisie libre courte (~120 caractères max), skippable. Alimente le panneau « ta phrase » de l'outil Tes raisons : c'est l'utilisateur qu'on citera aux moments difficiles |

Règles pour 0.6 (ajout 2026-07-12) :
- Question **optionnelle et non culpabilisante**, avec mention de confidentialité (« Ta réponse reste privée »). Réponse « préfère ne pas répondre » toujours proposée.
- Pourquoi on la pose : en France le cannabis est très majoritairement fumé **mélangé au tabac** ; continuer les joints en arrêtant la cigarette maintient la dépendance nicotinique et fausse les compteurs. C'est aussi un marqueur du profil polyconsommateur (cluster jeunes hédonistes).
- Effet : active le modificateur « co-consommation cannabis » de la matrice (contenu dédié, alternatives, orientation CJC). Aucun contenu moralisateur.
- Prudence contenu : les alternatives type CBD sont présentées comme **piste aux preuves émergentes**, jamais comme traitement prouvé (pas d'allégation médicale). Sources CBD a vérifier en prochaine passe de recherche.

États maquettés (section Figma « États & variantes ») : état initial (sélecteurs vides « Choisir », CTA désactivé tant que les champs requis sont vides), variante tabac a rouler (libellés et prix du pot adaptés), état erreurs (messages contextuels par champ, slot d'erreur natif de l'input). Le CTA des sélecteurs plein écran est désactivé tant qu'aucune option n'est choisie.

Règles de calcul :
- **Les tranches de 0.1 sont alignées sur les bandes de scoring HSI** (10 ou moins = 0, 11-20 = 1, 21-30 = 2, 31+ = 3) : une seule réponse alimente a la fois le compteur d'économies et le score de dépendance (pas de doublon avec la question 1.2 du HSI, qui est dérivée).
- **Tabac a rouler** : conversion en coût par cigarette (~40 cigarettes par pot de 30 g, valeur a affiner). Le compteur d'économies utilise le coût par cigarette quel que soit le type.
- Le prix par défaut est localisé (géoloc ou locale du navigateur), toujours éditable.

### Module 1 — Dépendance physique (HSI, verbatim)
Score 0 a 6.

**1.1 Le matin, combien de temps après ton réveil fumes-tu ta première cigarette ?**
- Dans les 5 minutes (3)
- 6 a 30 minutes (2)
- 31 a 60 minutes (1)
- Après 60 minutes (0)

**1.2 Combien de cigarettes fumes-tu par jour ?**
- 10 ou moins (0)
- 11 a 20 (1)
- 21 a 30 (2)
- 31 ou plus (3)

Scoring : 0-1 faible, 2-4 modérée, 5-6 forte. La 1.2 recoupe la 0.1 (une seule saisie, deux usages).

---

## PHASE 2 — Profilage progressif (J1 a J7)

### Module 2 — Profil motivationnel (cœur du système)
Source : F-SCMS (validée en français) et RFQ. Théorie de l'autodétermination, 6 dimensions. Version design a 12 items (2 par dimension), a porter a 18 verbatim avant prod.

Consigne : « Pourquoi veux-tu arrêter de fumer ? Dis-nous a quel point tu es d'accord. » Échelle 1 (pas du tout) a 7 (tout a fait).

| Dimension | Registre | Item (design) |
|---|---|---|
| Amotivation | (aucun) | Honnêtement, je ne suis pas sûr de vouloir arrêter |
| Régulation externe | extrinsèque | Parce qu'on me met la pression (proches, médecin, loi) |
| Introjectée | extrinsèque | Parce que je culpabilise ou j'aurais honte de continuer |
| Identifiée | intrinsèque | Parce que c'est important pour mes objectifs (santé, sport, argent) |
| Intégrée | intrinsèque | Parce que ne plus fumer correspond a la personne que je veux être |
| Intrinsèque | intrinsèque | Parce que je me sentirai libre et fier de moi |

La peur et la culpabilité logent dans la dimension introjectée.

**2.bis Motivations de surface (multi-sélection)**, alimente la pondération du feed :
santé, peur de la maladie, argent, enfants ou famille, image et peau, souffle et sport, grossesse, odeur, reprendre le contrôle, liberté.

Maquette (écran « 2bis Tes moteurs ») : grille 2 colonnes de multi-choice-option, libellés courts (Santé, Argent, Famille, Image, Souffle, Liberté, Odeur, Contrôle, Grossesse, Maladie), **max 3 moteurs** avec compteur, CTA « Terminer le chapitre ».

Scoring : motivation internalisée = identifiée + intégrée + intrinsèque ; contrôlée = externe + introjectée. Le ratio intrinsèque/extrinsèque prédit l'abstinence a 12 mois et sert de KPI de fond (il doit monter dans le temps).

### Module 3 — Auto-efficacité (SASEQ)
Source : SASEQ, 6 items, alpha=0.89. Consigne : « A quel point es-tu sûr de tenir sans fumer dans ces situations ? » Échelle 1 (pas sûr) a 5 (totalement sûr).
1. Quand tu es stressé ou anxieux
2. Quand tu bois de l'alcool ou en soirée
3. Quand tu es entouré de fumeurs
4. Quand tu es en colère ou contrarié
5. Avec un café ou après un repas
6. Quand tu t'ennuies ou tu es seul

Scoring : moyenne. Faible (< 3) déclenche la configuration soutien élevé, micro-objectifs, zéro compétition. Les situations basses deviennent des decision points prioritaires du moteur JITAI.

### Parti pris UX des échelles (Phase 2)
Décision 2026-07-12 : les échelles Likert (motivation 1-7, SASEQ 1-5, Hexad 1-7) sont rendues en **rangée segmentée** (pastilles numérotées, ancres textuelles aux extrémités), une question par écran, CTA désactivé tant que rien n'est choisi. Chaque module = un chapitre gamifié : écran d'intro (skippable via « Plus tard »), écrans d'items, feedback de fin de module qui montre ce que l'app a appris. Maquettes : sections Figma « Phase 2 · Motivation (SDT) » (intro, item, 2bis moteurs, feedback), « Phase 2 · Auto-efficacité (SASEQ) » (intro, item + erreur, feedback), « Phase 2 · Type de joueur (Hexad) » (intro, item, feedback), « Phase 2 · Toi (optionnel) », « Phase 2 · Contexte social » (entourage, moments) et « Phase 2 · Clôture » (écran « Profil complet », bascule vers l'app). Patterns types, pas les items un par un : les questions 4.2 (partenaire), 4.3 (alcool) et 4.5 (tentatives) reprennent le pattern single-choice démontré par « Entourage » et n'ont pas d'écran dédié. Les écrans du module Toi portent chacun un lien « Passer cette question ».

Organisation Figma (décision 2026-07-12) : **un écran ne vit qu'a un seul endroit**. Colonne = écran ; ligne 1 = état nominal ; lignes suivantes = ses déclinaisons d'état. Pas de composants-écrans (overrides imbriqués trop fragiles) : la cohérence visuelle est portée par les composants atomiques et le socle container-field.

### Module 3 bis — Toi (âge et sexe, optionnel)
Ajouté le 2026-07-12. En Phase 2 (jamais au Jour 0), skippable, avec un « pourquoi on demande » affiché.

| # | Question | Réponse | Usage |
|---|---|---|---|
| 3b.1 | Ton âge | tranches : moins de 18 / 18-24 / 25-34 / 35-44 / 45-54 / 55 et plus | Améliore la séparation des archétypes (les 3 clusters validés sont corrélés a l'âge) ; calibre les contenus bénéfices (peau/sport vs cardio/cancer) |
| 3b.2 | Tu es | une femme / un homme / autre / je préfère ne pas le dire | Le cluster 3 validé est majoritairement féminin ; contenus santé spécifiques (contraception + tabac, grossesse) ; jamais obligatoire |
| 3b.3 (si femme) | Es-tu enceinte ou en projet ? | oui / non / je préfère ne pas le dire | Active le parcours périnatal (moteur de surface grossesse) et le contenu médical adapté |

Règles : réponses « préfère ne pas dire » toujours proposées, aucun blocage si skip, microcopy explicative (« Ça nous aide a te proposer des contenus plus justes »). Mineur (< 18) : adapter le contenu, pas de collecte marketing.

### Module 4 — Contexte social et déclencheurs

| # | Question | Rôle |
|---|---|---|
| 4.1 | Combien de proches fument autour de toi ? (0 / 1-2 / 3-5 / beaucoup) | Variable prédictive validée |
| 4.2 | Ton ou ta partenaire fume ? (oui / non / pas de partenaire) | Facteur de rechute |
| 4.3 | Bois-tu de l'alcool régulièrement ? (jamais / occasionnel / régulier) | Comorbidité |
| 4.4 | Tes moments les plus a risque (multi, **10 options** : réveil, café, pause, trajet, repas, soirée, stress, ennui, alcool, social ; **max 5**, décision 2026-07-12) | Decision points JITAI. UX : grille 2 colonnes de multi-choice-option (case carrée = multi, rond = unique) ; au max atteint, les options restantes passent en Disabled avec compteur explicatif |
| 4.5 | As-tu déja essayé d'arrêter ? Combien de fois ? | Historique |

### Module 5 — Type de joueur (Hexad court)
Source : Hexad. Version 6 items (1 par type), a porter a 12. Échelle 1 a 7.

| Type | Item | Gamification |
|---|---|---|
| Philanthrope | J'aime aider les autres sans rien attendre | Parrainage, entraide |
| Sociable | Interagir avec les autres me motive | Communauté, défis de groupe |
| Battant | J'aime relever des défis et progresser | Objectifs, niveaux, badges |
| Esprit libre | J'aime explorer et faire a ma façon | Personnalisation, contenus a débloquer |
| Joueur | Les points et récompenses me motivent | Streaks, récompenses fréquentes |
| Perturbateur | J'aime tester les limites | Défis extrêmes, modes alternatifs |

Scoring : type dominant = score max. Le noyau universel (self-monitoring, progression, challenge, quête) est actif pour tous.

---

## Profil de sortie (handoff design vers dev)

```
profil = {
  dependance:      { hsi: 0-6, niveau: faible|modérée|forte },
  motivation:      { ratio_intr_extr: float,
                     dominante: intrinsèque|identifiée|introjectée|externe|amotivation,
                     moteurs_surface: [santé, argent, enfants, ...] },
  auto_efficacite: { score: 1-5, situations_faibles: [stress, alcool, ...] },
  social:          { fumeurs_entourage: 0-3, partenaire_fumeur: bool, alcool: 0-2 },
  declencheurs:    [réveil, café, soirée, ...],
  type_joueur:     { dominant: Battant|Sociable|..., scores: {...} },
  historique:      { tentatives: int }
}
```

De ce vecteur on dérive un archétype principal (jeune hédoniste / habituel CSP+ / forte fumeuse en détresse) plus des modificateurs (faible auto-efficacité, motivation a internaliser, entourage fumeur), qui pilotent la matrice de personnalisation.

## Règles UX transverses

- Un écran, une question. Progression visible.
- Feedback après chaque module : l'app annonce ce qu'elle a compris et ce qu'elle adapte.
- Jamais de culpabilisation par défaut. Le registre peur/culpabilité n'est activé que pour les profils qui y répondent, toujours avec une action de sortie.
- Tout est skippable en Phase 2 (sauf Modules 0 et 1). Complété plus tard via micro-questions (EMA).
- Re-profilage périodique (SASEQ et motivation) pour mesurer l'internalisation.
