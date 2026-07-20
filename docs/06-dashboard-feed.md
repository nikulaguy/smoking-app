# Dashboard et fil (app connectée)

Le cœur de l'app post-profil : la ou la matrice de personnalisation (doc 03) devient visible. Maquettes dans les sections Figma « App · Dashboard » et « App · Fil », pour un profil concret (celui de la clôture Phase 2 : moteurs santé + liberté, point chaud stress, style Battant).

## Structure de l'app connectée

- **Navigation** : tab bar basse fixe, 4 onglets (Accueil / Fil / Défis / Profil). Décision 2026-07-12.
- **SOS envie** : bouton flottant persistant au-dessus de la tab bar, sur tous les écrans connectés. Décision 2026-07-12. C'est le point d'entrée JITAI : le tap est aussi un signal (envie déclarée = EMA implicite, cf. doc 04).
- Ni la tab bar ni le SOS n'apparaissent dans le flux d'onboarding ni dans les sur-couches plein écran.

## Dashboard (Accueil)

**Direction visuelle validée (2026-07-12) : « Sommet »**, choisie parmi 3 explorations (Sommet / Quête RPG / Arcade dark, pistes B et C archivées en section Explo). Hero immersif en teal profond (Watery Green/90 de la palette core) : l'arrêt est une ascension. Semaine en 7 pastilles conquises/a conquérir, chip de niveau jaune (« NIVEAU 2 · GRIMPEUR »), corps clair.

Couleurs : la collection `_Core` de la lib Tokens n'étant pas publiée, une collection locale « _Explo (échantillons _Core) » porte les primitives copiées, et une collection **« App Semantic (local) »** expose les sémantiques aliasées : `surface/immersive`, `content/on-immersive(-subtle)`, `game/level`, `content/on-level`, `game/progress-done`, `game/progress-todo`. A terme : faire publier ces sémantiques (ou la collection core) par l'équipe DS.

Zones, de haut en bas, toutes pilotées par le profil :

| Zone | Contenu | Personnalisation |
|---|---|---|
| Header | « JOUR N SANS FUMER » + accroche | Ton selon l'archétype (Battant : record, défi) |
| Stats | 2 métriques compactes (argent, cigarettes évitées) | Ordre selon les moteurs (argent remonte si moteur argent) |
| Prochain palier | Carte avec barre de progression vers le prochain jalon | Le bénéfice mis en avant suit le moteur dominant (santé ici) |
| Défi du jour | Carte tapable (badge DÉFI) | Calibré style de jeu × déclencheurs (Battant × pause café) |

## Sur-couche SOS envie : la boîte a outils (enrichie 2026-07-12)

Plein écran, fond apaisant : « On tient 3 minutes ensemble. » puis **grille de 6 outils** (composant tool-tile, illustrations de la lib) : Respirer (3 min), Mini-jeu, Histoire audio, Vidéo (1 min), Une blague, Tes raisons. Sortie : « Ça va mieux, merci ».

- **Jamais que de la respiration** : la variété couvre tous les profils et évite l'usure d'un outil unique.
- **Ordre et sélection personnalisés** par le profil (matrice doc 03 § boîte a outils) puis réordonnés par le feedback « ça t'a aidé ? » (doc 04).
- Formats courts imposés : jeu 60-90 s, histoire 2-3 min, vidéo ≤ 1 min, blague instantanée : l'envie dure ~3 minutes, l'outil doit tenir dedans.
- Chaque usage est un signal JITAI journalisé (outil choisi + efficacité perçue).

## Fil

- **Cards DS (variant freeform)** avec badge de catégorie : SANTÉ, LIBERTÉ, DÉFI, ARGENT (+ futures : FAMILLE, IMAGE, SOUFFLE...).
- **Ordre = score de pertinence pondéré par les moteurs du profil** (doc 03 § pondération). Ici santé et liberté en tête.
- **Garde-fou éthique maquetté** : le fil est FINI. La carte « Le tour est fait pour aujourd'hui » (fond fade) clôt la session du jour : « Ton temps vaut mieux que notre fil. » Anti dark pattern assumé (doc 04 § anti-métriques), a ne jamais retirer pour de la rétention.
- Sous-titre du fil : « choisi pour toi, pas pour te retenir » : la promesse éthique est dans l'UI.

## Composants créés (page Composants, décrits + annotés)

| Composant | Rôle | Variants |
|---|---|---|
| `tab-item` | Onglet de navigation | Active / Inactive |
| `tab-bar` | Barre de navigation basse | (overrides : onglet actif, libellés) |
| `sos-craving` | Action d'aide immédiate flottante | (Button DS + ombre) |
| `stat-metric` | Métrique valeur + libellé | hero / compact |

Dette signalée en annotation : les icônes d'onglets (Accueil, Fil) n'existent pas dans Foundation - Icons (seuls star et people) : tab bar a libellés en attendant leur ajout a la lib.

## Onglet Défis : « Le chemin du sommet » (maquetté 2026-07-12)

La métaphore Sommet déclinée en parcours de paliers façon alpinisme : hero immersif, puis sentier vertical de jalons : Camp de base (24 h, franchi, coche succès), Premier refuge (3 jours, franchi), **La crête (7 jours, palier en cours** : marqueur jaune game/level, mini-progression jour 4/7, défi du jour rattaché), puis Haute altitude (14 j), Les nuages (1 mois) et Le sommet (3 mois) verrouillés. Connecteurs teal sur le chemin parcouru, gris ensuite. Les paliers sont ceux des bénéfices santé réels (badge, nicotine éliminée, sommeil...) : la gamification recouvre des jalons médicaux, pas des points arbitraires.

Explorations B (Quête RPG) et C (Arcade) supprimées après validation de la piste Sommet.

## États sensibles (maquettés 2026-07-12)

Trois écrans dans la section App · Dashboard (colonne = écran, états sous le nominal) :

- **Jour 1 (jour de l'arrêt)** : ton d'accueil, pas de performance. « Le camp de base t'attend. », niveau 1, semaine vierge, premières petites victoires affichées tôt (1,90 €, 3 clopes), objectif unique du soir (micro-objectif, matrice § faible auto-efficacité), badge a minuit.
- **Déclaration de rechute (sur-couche)** : l'écran le plus sensible du produit. « Une glissade, pas une chute. » : aucune culpabilisation, aucun rouge, rappel des acquis. Trois réponses (une cigarette / plusieurs / je refume régulièrement) ; la troisième déclenche l'orientation vers une aide humaine (« Parler a quelqu'un »). La déclaration est un signal EMA majeur (doc 04 : passage en mode soutien).
- **Lendemain de rechute (la remontée)** : dédramatisation totale : niveau conservé, acquis reformulés en préservation (« 48 € toujours dans ta poche », « 68 clopes jamais fumées »), métaphore de la glissade (« Ton chemin reste tracé », « on repart du refuge »), défi du jour = comprendre le déclencheur pour ajuster le plan.

Règle transverse : jamais de compteur remis a zéro brutalement a l'écran, jamais de rouge, jamais de reproche.

Validé le 2026-07-15 : **« ta phrase » en exergue** au-dessus des stats sur tous les dashboards (blockQuote DS citation 20 italique + « Toi, au jour 0 », panneau fond subtle, ligne de crête en signature, padding bas base-6). La raison avant les chiffres : la voix la plus persuasive est celle de l'utilisateur. L'ancienne phrase discrète en bas de flux est supprimée.

Complétés le 2026-07-14 (parité avec le code) : point d'entrée de la déclaration = lien discret « Tu as fumé ? Ça arrive, dis-le nous. » en fin de flux sur tous les dashboards (link DS standalone, jamais un bouton d'alerte) ; état « Je refume régulièrement » maquetté sous le nominal de la déclaration (panneau de soutien + « Parler a quelqu'un » en CTA principal, « Reprendre l'ascension » en secondaire, le lien d'aide standalone disparaît). Les écrans dashboard sont étirés en hauteur pour montrer tout le flux scrollable (comme la variante détresse).

## Variante d'archétype : fumeuse en détresse (maquettée 2026-07-12)

Même écran, même structure, mêmes composants : seuls le copy, les mécaniques et l'ordre changent (démonstration de la matrice doc 03). Comparaison avec le nominal (Battant) :

| Élément | Battant (nominal) | Fumeuse en détresse |
|---|---|---|
| Hero | « Ton record. Continue. » | « Un pas après l'autre. » (zéro performance) |
| Chip | NIVEAU 2 · GRIMPEUR | NIVEAU 2 · PAS À PAS |
| Semaine | « le sommet est a 3 jours » | « Chaque jour compte. Celui-ci aussi. » |
| Stats | « clopes évitées » | « **moments surmontés** » (recadrage émotionnel) |
| Bloc central | Défi du jour (+1 jour) | **Check-in d'humeur** (EMA, likert 5, « rien n'est noté contre toi ») |
| Action | Défi (challenge) | **Rituel** (« on y va ensemble », un seul micro-objectif) |
| SOS | « Une envie, là ? » | « **Un moment difficile ?** » (élargi a la détresse) |

Interdits pour ce profil (matrice) : compétition, classements, langage de défi/performance, culpabilisation. Le check-in d'humeur en position haute est le point d'entrée JITAI principal de ce profil (une humeur basse peut déclencher un outil de régulation).

## Écrans de détail des outils (maquettés 2026-07-12, section « App · Outils anti-envie »)

Sept écrans, une famille visuelle commune (fonds apaisants alternés, sortie toujours possible en bas) :

| Écran | Design | Points clés |
|---|---|---|
| Respiration guidée | Anneau de progression + cercle qui respire, compte a rebours 4 s | Auto-play (zéro friction), cycle 4-4-6, sortie « Arrêter, ça va mieux » |
| Mini-jeu « Éclate tout » | Aire de jeu, bulles colorées (palette core), chips score + chrono | 60-90 s max, score personnel, JAMAIS de classement social |
| Histoire audio | Illustration + lecteur (progression, pause) | « Ferme les yeux si tu veux ». **Catalogue réel (2026-07-15)** : 100 audios FR générés en TTS Piper (open source), lus depuis la table `contents`. |
| Vidéo pédagogique | Vignette + play, thème calé sur le jour (J4 → cœur) | ≤ 1 min, verticale. **Catalogue réel (2026-07-15)** : 74 vidéos YouTube FR de chaînes fiables (Allo Docteurs, C'est pas sorcier, Léon Bérard, AP-HM/AP-HP…), embed léger `youtube-nocookie`, lues depuis `contents`. |
| Une blague | Blague en grand + « Une autre ! » | Rupture d'état émotionnel ; « Envoyer a un pote » (levier social) ; feedback après 3 blagues |
| Tes raisons | Un panneau par moteur du profil + « ta phrase » du jour 0 | Généré du profil ; la voix la plus persuasive est celle de l'utilisateur |
| « Ça t'a aidé ? » | 3 options, un tap = enregistré + fermé | Après CHAQUE outil ; 2 gestes max ; c'est le signal qui réordonne la boîte a outils |

A ajouter a l'onboarding (noté) : « En une phrase, pourquoi tu arrêtes ? » (optionnel, jour 0) pour alimenter le panneau « ta phrase ».

## Onglet Profil : « Ton camp de base » (maquetté 2026-07-12)

Hero immersif (Grimpeur niveau 2, jour, XP, trophées), puis : **« Ce que l'app sait de toi »** en recap-items (moteurs, style, point chaud, ta phrase) : la personnalisation est transparente et corrigeable ; lien **« Refaire le point (3 min) »** = re-test SASEQ + motivation (doc 04 § re-profilage) ; réglages (notifications & rythme, données avec export/suppression, **aide & ressources humaines** = orientation CJC / Tabac Info Service) ; mention « Tes données restent a toi... rien n'est vendu, jamais. »

## Retour après absence (maquetté 2026-07-12)

Sur-couche a l'ouverture après ≥ 7 jours d'inactivité. « Content de te revoir. Aucun reproche : dis-nous juste où tu en es, on recale tout. » Trois réponses qui routent : tenu sans l'app → compteurs recalés + célébration ; refumé → parcours remontée ; je ne sais plus → mini check-in. L'absence n'est jamais un échec.

## Compte & données (maquetté 2026-07-12, section « App · Compte & données »)

Six écrans qui concrétisent la promesse RGPD et le cycle de vie du compte :

| Écran | Points clés |
|---|---|
| Connexion | **Compte optionnel et différé** : l'onboarding Jour 0 se fait sans compte, la création est proposée après « C'est parti ». Auth par **lien magique** (zéro mot de passe a stocker ou fuiter). « Continuer sans compte » possible (local). |
| Vérifie tes mails | État post-envoi : adresse affichée, expiration 15 min, renvoyer / changer d'adresse. **Champ de secours (2026-07-15)** : saisie du code du mail (ou collage du lien complet) + bouton « Valider le code », pour les cas où le lien ne s'ouvre pas sur l'appareil ou est consommé par un scanner de mail. |
| Infos personnelles | Prénom (optionnel, sert au ton), email, âge et sexe (sélecteurs, « préfère ne pas dire » dispo). Modifier âge/sexe **recalcule le profil**. |
| Tes données | Export (portabilité : JSON + PDF résumé), transparence (« ce qu'on stocke, et rien d'autre », hébergement UE), zone de suppression séparée en bordure erreur, jamais a un tap. |
| Suppression · confirmation | Double garde-fou : écran dédié + mail de confirmation + **30 jours de rétractation**. Export proposé avant. Le départ pour réussite est **célébré** (« le plus beau départ possible »), cohérent avec l'objectif d'autonomie. |
| Tes réponses d'onboarding | Chaque réponse du Jour 0 modifiable ; chaque ligne **rouvre l'écran d'onboarding existant** (réutilisation, pas de duplication) ; recalcul transparent des compteurs. |

Ajout 2026-07-14 : lien « Retour au profil » en bas de Tes données et Tes réponses d'onboarding (affordance de sortie, alignée sur le code).

Ajout 2026-07-14 : écran **Notifications & rythme** (maquette + code) : réglage du moteur JITAI (doc 04), l'utilisateur décide du volume. Rythme single-choice (Discret / Équilibré par défaut / Rapproché), rappels aux moments a risque (coché par défaut, moments listés depuis `social_moments`), promesse anti-métriques (« jamais la nuit, jamais pour te faire culpabiliser »), enregistrement immédiat sans bouton Valider.

Le Profil compte désormais 6 entrées de réglages : Compte & connexion, Infos personnelles, Tes réponses d'onboarding, Notifications & rythme, Tes données, Aide & ressources humaines. Dette DS signalée : pas de variant destructive du Button (secondary + texte error en attendant).

## Identité visuelle « Ligne de crête » (validée et déclinée 2026-07-12)

Choisie parmi 3 pistes (Ligne de crête / Courbes de niveau / Carnet d'expédition, non retenues supprimées). Le paysage entre dans l'interface, tokens DS et échantillons core conservés.

**Langage graphique (composants `deco/*`, purement décoratifs, aria-hidden en code)** :
- `deco/crete-hero` : strates de montagnes (2 plans) en bas des zones immersives (prévoir ~100px de padding bas).
- `deco/crete-divider` : séparateur en ligne de crête, remplace les filets droits entre blocs.
- `deco/drapeau` : marqueur universel de palier atteint / position conquise. Absent au Jour 1 (rien de conquis encore), présent partout ensuite, y compris post-rechute (les acquis restent plantés).
- `deco/soleil` : ponctuation lumineuse des heros, un seul par écran.

**Déclinaison appliquée** : dashboard nominal + états (Jour 1 sans drapeau, remontée et détresse avec) + variantes d'archétype, Défis, Profil, fil (header immersif « Choisi pour toi »), détail de défi, transitions (C'est parti, Profil complet : divider). Les sur-couches SOS et outils restent volontairement épurées : le calme prime au moment de l'envie.

## Finitions livrées (2026-07-12)

- **Variante hédoniste du dashboard** : « JOUR 4 · EN FEU », « La série continue. », chip SÉRIE ×4, stats recadrées (« a claquer ailleurs », « ta plus longue série »), Défi flash chrono avec badge Éclair. Compétition amicale possible ici uniquement.
- **Détail d'un défi** : hero immersif avec crête et drapeau, le « pourquoi » cite les données du profil (transparence), panneau récompense (+1 jour, +40 XP), astuce de grimpeur, **déclaratif basé confiance** (« Je l'ai fait », aucune preuve) et refus sans pénalité (« Pas aujourd'hui »).
- **Header immersif du fil** : cohérent avec la direction Sommet.
