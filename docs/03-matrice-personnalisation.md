# Matrice de personnalisation

Le moteur central de l'app. Il transforme le vecteur de profil (sortie du questionnaire) en comportement concret : leviers de motivation, mécaniques de gamification, ton et rythme des notifications, pondération du feed.

## 1. Chaîne de décision

```
Vecteur de profil
      -> Archétype principal        (classification souple, priorité)
      -> Modificateurs              (overlays mesurés directement, cumulables)
      -> Configuration de l'app     (leviers, gamification, notifs, feed)
```

Principe clé : l'**archétype** donne la couleur générale, les **modificateurs** ajustent finement et priment sur l'archétype quand ils sont présents. Un modificateur est toujours issu d'une variable mesurée (pas inféré), donc plus fiable que l'archétype. Exemple : un jeune hédoniste avec auto-efficacité faible reçoit la config hédoniste mais adoucie par le modificateur « soutien élevé ».

## 2. Dérivation de l'archétype

Les 3 archétypes viennent des clusters validés par la recherche. Nous ne collectons pas l'âge ni la CSP directement, donc l'archétype est une classification souple par faisceau d'indices mesurés, pas une case rigide. Un 4e état « mixte » est le défaut si aucun faisceau ne domine.

| Archétype | Faisceau d'indices (variables du questionnaire) |
|---|---|
| **Jeune hédoniste** (churn +++) | type_joueur dominant = Joueur ou Esprit libre ; motivation contrôlée > internalisée, ou amotivation élevée ; dépendance faible a modérée ; alcool social ou régulier ; peu de tentatives passées |
| **Habituel CSP+** | dépendance modérée a forte ; motivation identifiée ou santé ; type Battant ; auto-efficacité moyenne a haute ; déclencheurs de routine (café, repas, pause) |
| **Forte fumeuse en détresse** | dépendance forte ; auto-efficacité faible ; déclencheurs stress, ennui, colère ; alcool régulier ; motivation santé mais faible confiance |
| **Mixte** (défaut) | aucun faisceau dominant : appliquer le noyau universel + modificateurs mesurés |

Note conception : si la classification s'avère trop imprécise en test, ajouter une question d'âge (tranche) et une auto-déclaration de contexte de vie améliorerait la séparation des clusters. A trancher après premiers tests utilisateurs.

## 3. Configuration par archétype

Rappel : le **noyau de gamification universel** (self-monitoring, progression, challenge, quête) est actif pour tous. Les mécaniques ci-dessous s'ajoutent par-dessus.

### Jeune hédoniste

- **Levier de motivation** : renforcement immédiat, plaisir, statut social. Bénéfices court terme (souffle, sport, peau, argent-plaisir), jamais la peur.
- **Gamification** : défis courts, récompenses fréquentes et visibles, streaks, compétition amicale, loteries, contenus a débloquer.
- **Ton des notifications** : léger, complice, fun, un peu provocateur.
- **Rythme** : soutenu au départ (leur tolérance au fun est haute), calé sur les moments sociaux (soirées, week-ends).
- **Feed** : gains immédiats et tangibles, défis viraux, témoignages de pairs du même âge.
- **Risque principal** : décrochage précoce (70% en 1re session). **Contre-mesure** : valeur immédiate des l'écran 1, premier badge dans les 60 premières secondes, aucun mur de questions.

### Habituel CSP+

- **Levier de motivation** : self-control, santé long terme, cohérence avec ses objectifs, retour sur investissement.
- **Gamification** : progression détaillée, data et graphiques, objectifs a moyen terme, badges de maîtrise, historique.
- **Ton des notifications** : factuel, respectueux, orienté données, sans infantilisation.
- **Rythme** : modéré et prévisible, aligné sur les déclencheurs de routine (matin, après repas, pause).
- **Feed** : rupture d'habitude, substituts de geste, économies cumulées projetées, articles de fond.
- **Risque principal** : lassitude, sentiment d'inutilité une fois la routine installée. **Contre-mesure** : nouveaux paliers de sens, data qui se raffine, objectifs qui montent en exigence.

### Forte fumeuse en détresse

- **Levier de motivation** : santé, soutien émotionnel, reprise de contrôle par petites victoires.
- **Gamification** : douce, centrée self-monitoring et encouragement. Célébration systématique des micro-progrès. **Aucune compétition, aucun classement.**
- **Ton des notifications** : bienveillant, chaleureux, jamais culpabilisant.
- **Rythme** : présent mais calme, jamais pressant. Priorité aux moments de stress déclarés.
- **Feed** : régulation émotionnelle, gestion du stress, TCC, témoignages de rechutes surmontées, communauté de soutien.
- **Risque principal** : abandon par découragement, rechute sur émotion négative. **Contre-mesure** : filet de sécurité émotionnel, zéro jugement, orientation vers ressources d'aide si signaux de détresse forts (voir garde-fou).

## 4. Modificateurs (overlays mesurés, cumulables)

Ils s'appliquent quel que soit l'archétype et priment en cas de conflit.

| Modificateur | Déclencheur (mesure) | Ajustement |
|---|---|---|
| **Soutien élevé** | SASEQ < 3 | Micro-objectifs, célébration systématique, zéro compétition, contenu « tu peux » |
| **Internalisation** | ratio intrinsèque/extrinsèque bas | Démarrer par récompenses extrinsèques, puis basculer progressivement vers sens et valeurs |
| **Entourage fumeur** | 4.1 >= 3-5 ou partenaire fumeur | Stratégies sociales, gestion de l'entourage, défis communautaires |
| **Forte dépendance** | HSI 5-6 | Proposer substituts nicotiniques, sevrage progressif, gestion intensive du craving |
| **Comorbidité alcool** | 4.3 régulier | Contenu alcool-tabac, vigilance renforcée sur les decision points de soirée |
| **Détresse émotionnelle** | déclencheurs stress/colère/ennui dominants + auto-efficacité faible | Régulation émotionnelle, ton adouci, garde-fou d'orientation |
| **Co-consommation cannabis** | 0.6 = oui régulièrement ou de temps en temps | Pédagogie dédiée (« le tabac de tes joints entretient la dépendance »), stratégie double (arrêter le mélange, pas forcément tout de front), alternatives présentées avec prudence (vaporisation sans tabac, CBD en piste émergente, substituts nicotiniques pour la part tabac), orientation vers les Consultations Jeunes Consommateurs si besoin. Renforce l'indice du profil polyconsommateur (jeunes hédonistes). Jamais de ton moralisateur ni d'allégation médicale. |

## 5. Pondération du feed par moteurs de surface

Le feed infini est trié par un score de pertinence pondéré selon les moteurs de surface cochés au Module 2.bis.

| Moteur de surface | Catégories de contenu boostées |
|---|---|
| Santé, peur de la maladie | Bénéfices santé chronologiques, faits médicaux, risques (dosés selon profil) |
| Argent | Compteur d'économies, projections, récompenses concrètes a s'offrir |
| Enfants, famille | Tabagisme passif, exemplarité, temps gagné avec les proches |
| Image, peau | Bénéfices esthétiques, avant/après, souffle |
| Souffle, sport | Performance physique, récupération cardio, défis sportifs |
| Grossesse | Contenu périnatal dédié, bénéfices pour le bébé |
| Odeur | Bénéfices sensoriels, goût, odorat |
| Contrôle, liberté | Récits d'autonomie, reprise de pouvoir, identité de non-fumeur |

Règle : le feed sert la progression, pas le temps passé. KPI de succès = jours sans fumer et auto-efficacité, jamais le temps d'écran.

## 6. Moteur de notifications (règles JITAI)

Cadre Nahum-Shani. Règles simples et transparentes au départ, pas d'IA prédictive. Table decision point x archétype.

| Decision point | Jeune hédoniste | Habituel CSP+ | Forte fumeuse en détresse |
|---|---|---|---|
| Réveil (1re cigarette) | Défi matinal fun | Rappel objectif du jour + data | Message doux, respiration |
| Café / après repas | Mini-jeu anti-craving | Substitut de geste suggéré | Encouragement calme |
| Pause / trajet | Streak a maintenir | Point de progression | Exercice de régulation |
| Soirée / alcool | Alerte complice + défi social | Rappel factuel du risque | Message de soutien anticipé |
| Stress / ennui déclaré (EMA) | Distraction ludique | Technique de gestion | Régulation émotionnelle prioritaire |

Dosage : le rythme fait partie du profil. Trop de notifications = désabonnement. On mesure le taux de réponse et on ajuste (voir boucle de feedback dans le doc suivant).

### La boîte a outils anti-envie (intervention options, enrichie 2026-07-12)

Jamais un outil unique : la variété évite l'usure et couvre tous les profils. Catalogue :

| Outil | Format | Note |
|---|---|---|
| Respiration guidée | 3 min | L'outil historique, pas le défaut universel |
| Mini-jeu | 60-90 s | Distraction cognitive (occupe les mains et la tête) |
| Histoire audio | 2-3 min | Micro-fiction ou récit apaisant, yeux fermés possibles |
| Vidéo pédagogique | ≤ 1 min | Un fait sur le corps qui se répare, format vertical |
| Une blague | instantané | Rupture d'état émotionnel par le rire |
| Tes raisons | instantané | Rappel personnalisé des moteurs du profil |
| Défi flash | 3 min | « Tiens 3 minutes chrono » (profils Battant uniquement) |

**Sélection et ordre personnalisés** : hédoniste → mini-jeu, blague, vidéo en tête (le fun d'abord, jamais le zen en premier) ; habituel CSP+ → vidéo pédagogique, respiration, rappel des gains ; fumeuse en détresse → respiration, histoire audio, tes raisons (apaisement d'abord, jamais de défi) ; Battant → défi flash, respiration, mini-jeu. Puis le **feedback réordonne** (doc 04) : chaque usage est suivi de « ça t'a aidé ? », les outils efficaces pour cette personne remontent.

Backlog contenu associé : banque de blagues, catalogue d'histoires audio, vidéos courtes (production ou licences), 2-3 mini-jeux simples.

## 7. Garde-fou éthique et de sécurité

- **Pas de dark patterns.** Métrique de succès = résultat de santé, pas rétention brute ni temps d'écran.
- **Registre peur/culpabilité** activé uniquement pour les profils qui y répondent (introjecté dominant), toujours avec une action de sortie immédiate.
- **Signaux de détresse forts** (détresse émotionnelle marquée, mentions inquiétantes) : orienter vers des ressources d'aide humaine et professionnelles. L'app n'est pas un dispositif de soin en santé mentale.
- **Autonomie** : l'objectif est de rendre l'app de moins en moins nécessaire dans le temps.

## 8. Format de sortie (handoff design vers dev)

```
config = {
  archetype:        jeune_hedoniste | habituel_csp+ | forte_fumeuse_detresse | mixte,
  modificateurs:    [soutien_eleve, internalisation, entourage_fumeur,
                     forte_dependance, comorbidite_alcool, detresse_emotionnelle],
  motivation:       { levier_prioritaire: str, registre_autorise: [intrinseque, ...] },
  gamification:     { noyau_universel: true,
                      mecaniques: [streaks, defis_courts, ...],
                      competition: bool },
  notifications:    { ton: str, frequence: faible|moderee|soutenue,
                      decision_points: [...] },
  feed:             { ponderation: { sante: 0-1, argent: 0-1, ... } },
  garde_fous:       { peur_culpabilite: bool, orientation_aide: bool }
}
```

Ce format est directement consommable par la future logique applicative et par le maquettage des écrans personnalisés.
