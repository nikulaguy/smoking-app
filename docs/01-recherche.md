# Rapport de recherche

Base de preuves : 26 sources primaires (méta-analyses Cochrane, ECR, études psychométriques, JMIR), 124 affirmations extraites, 25 vérifiées de façon contradictoire, 15 confirmées, 2 réfutées. Recherche menée le 2026-07-12.

Niveau de confiance par affirmation : « confirmé N-0 » = validé par vote contradictoire ; « plausible » = source primaire mais vérification coupée par quota (a reconfirmer, pas douteux sur le fond).

## 1. Il n'existe pas « un » fumeur : les typologies sont validées empiriquement

- **3 sous-types de fumeurs** (analyse de clusters, 749 adultes, ECR app web néerlandaise, confirmé 3-0) :
  1. Jeunes hédonistes légers-modérés (25%) : jeunes, diplômés, polyconsommateurs, recherche de sensation.
  2. Habituels d'âge moyen, CSP+ (41%) : consommation modérée a forte, ancrage dans l'habitude.
  3. Fumeuses plus âgées, fortes fumeuses, CSP- (34%) : désespoir, anxiété, impulsivité, dépression, alcool.
- **Le profil prédit l'abandon de l'app** (confirmé 3-0, chi2=20.90, p<0.001). Les jeunes hédonistes décrochent des la 1re session (69,8% contre ~40%), hazard ratio 1,5. Le principal risque de churn est identifiable des l'onboarding.
- **Tailoring recommandé par les auteurs** (confirmé 3-0) : gamification + récompenses pour les hédonistes ; rupture d'habitude + soutien alcool pour les habituels ; régulation émotionnelle + TCC humeur pour les fortes fumeuses en détresse.
- **6 typologies qualitatives** de progression vers l'arrêt (confirmé 2-0) : committed smokers, aware smokers, forced attempters, struggling attempters, pragmatic ex-smokers, committed non-smokers.
- **L'hétérogénéité justifie la personnalisation** (confirmé 3-0). Deux variables prédictives du succès : baisse du nombre de fumeurs dans l'entourage, et sentiment de contrôle (auto-efficacité).

Sources : PMC8569479, PMC5827703, ScienceDirect S0277953619303788.

## 2. Motivations : la santé domine, mais le poids varie selon le profil

- **La motivation santé écrase tout** (confirmé 3-0) : odds ratio ~22,5 pour l'intention d'arrêter, loin devant la famille (~3,9). Un diagnostic de santé personnel motive 28% des fumeurs a forte intention contre 4,6% des faibles.
- **Intrinsèque vs extrinsèque** (confirmé 3-0, échelle RFQ) : 4 dimensions, 2 intrinsèques (santé, self-control), 2 extrinsèques (renforcement immédiat, influence sociale). Un ratio intrinsèque/extrinsèque élevé prédit l'abstinence a 12 mois.
- La peur et la culpabilité relèvent du registre extrinsèque/introjecté, moins durable. A utiliser avec prudence.

Sources : PMC12273549, PubMed 9426790 & 2195084.

## 3. Instruments validés pour l'onboarding

| Instrument | Mesure | Longueur | Confiance |
|---|---|---|---|
| HSI | Dépendance physique | 2 items | plausible |
| FTND (Fagerström) | Dépendance nicotinique | 6 items, 0-10 | plausible |
| RFQ | Motivation intrinsèque/extrinsèque | 20 items | confirmé 3-0 |
| F-SCMS | 6 types de motivation (SDT), validée en français sur 13 044 fumeurs via app | 18 items | plausible |
| SASEQ | Auto-efficacité a l'arrêt | 6 items, alpha=0.89 | plausible |

## 4. Efficacité des interventions numériques

- **La personnalisation double presque l'effet** (confirmé) : RR 1,86 vs soins standards, contre RR 1,50 pour un protocole standardisé.
- **Les apps génériques ne prouvent pas leur effet** : méta-analyse 9 ECR, ~13 000 adultes, OR 1,25, p=0,06. La personnalisation est ce qui sort de cette zone d'inefficacité.
- **Le SMS automatisé marche** (confirmé, Cochrane, 13 ECR) : +54% de taux d'arrêt vs soutien minimal.
- **Les JITAI surperforment** (confirmé) : app Smart-T 16,4% d'abstinence a 26 semaines vs 10,0% pour QuitGuide (OR 1,81).

## 5. Gamification

- **Double le succès a court terme** (confirmé, méta-analyse 2025, 15 ECR, 5075 participants) : RR 1,91. Effet qui s'atténue au-dela de 6 mois.
- **Noyau universel** (confirmé, étude Hexad) : self-monitoring, progression, challenge, quête. A implémenter pour tous.
- **Couche personnalisée** via les 6 types Hexad (Philanthropist, Socializer, Achiever, Free Spirit, Player, Disruptor).
- Alerte : les apps santé freemium ont des incitations structurelles aux dark patterns (conflit profit/santé).

## 6. Adaptation temps réel (JITAI)

- **Cadre Nahum-Shani** (confirmé) : 4 composants (decision points, intervention options, tailoring variables, decision rules).
- **Réalité technique** : prédiction ML de rechute encore modérée (ROC-AUC ~0,66). Commencer par des règles simples et de l'auto-déclaratif (EMA), pas d'IA prédictive au départ.

## 7. Affirmations réfutées (a ne pas propager)

- Trajectoires majoritairement non linéaires : réfuté (1-2), les fumeurs sont surtout persistants.
- Dépendance forte associée a une intention d'arrêter plus forte : réfuté (1-2), lien non fiable.

## Sources principales

PMC8569479, PMC5827703, ScienceDirect S0277953619303788, PubMed 9426790, PubMed 2195084, PMC12273549, PMC9407113, Cochrane CD006611.pub5, Nature s41562-025-02295-2, JMIR e43242, PMC5364076 (Nahum-Shani JITAI), tobaccoinduceddiseases (méta-analyse gamification 2025), PMC12583868 (modèle Hexad).
