#!/usr/bin/env python3
"""Construit audio-scripts.json (~100 scripts FR) pour le TTS Piper.
Ton : tutoiement, calme, zéro culpabilisation, pas de tirets longs."""
import json, re

C = []  # (slug, title, theme, day_relevance, text)

def add(slug, title, theme, text, day=None):
    C.append({"slug": slug, "title": title, "theme": theme,
              "day_relevance": day, "text": " ".join(text.split())})

# ---- Respiration (12) ----
add("resp-446", "Respirer en 4-4-6", "respiration",
    "On respire ensemble. Inspire par le nez sur quatre temps. Retiens l'air sur quatre. Souffle par la bouche sur six, tout doucement. L'expiration plus longue calme le corps. Encore une fois, à ton rythme.")
add("resp-478", "La respiration du soir", "respiration",
    "Installe-toi confortablement. Inspire sur quatre temps. Retiens sur sept. Souffle très lentement sur huit. C'est une respiration qui prépare au calme. Trois cycles suffisent à faire redescendre la pression.")
add("resp-carree", "La respiration carrée", "respiration",
    "Quatre côtés, quatre temps égaux. Inspire, un, deux, trois, quatre. Retiens, quatre temps. Souffle, quatre temps. Poumons vides, quatre temps. Comme dessiner un carré avec ton souffle. Simple, régulier, apaisant.")
add("resp-soupir", "Le double soupir", "respiration",
    "Prends une première inspiration par le nez. Puis, sans souffler, une petite deuxième par-dessus, pour remplir tout en haut. Et relâche par la bouche, longuement. Deux soupirs comme ça, et le corps se dénoue.")
add("resp-ventre", "Respirer par le ventre", "respiration",
    "Pose une main sur ton ventre. À l'inspiration, c'est lui qui se gonfle, pas la poitrine. À l'expiration, il redescend doucement. Respirer par le ventre, c'est dire à ton corps que tout va bien.")
add("resp-compter", "Compter ses souffles", "respiration",
    "Rien à faire, juste compter. Inspire, un. Souffle. Inspire, deux. Souffle. Va jusqu'à dix, puis recommence. Si tu perds le fil, ce n'est pas grave, tu repars à un. L'esprit se pose sur les chiffres.")
add("resp-matin", "Réveiller son souffle", "respiration",
    "Au réveil, avant tout, trois grandes respirations. Inspire l'air frais du matin, sens-le descendre. Souffle la nuit qui reste. Ton souffle est déjà plus ample qu'hier. Chaque jour sans fumer, il s'ouvre un peu plus.")
add("resp-pause", "Trois minutes pour toi", "respiration",
    "Pose ce que tu fais. Trois minutes, rien que pour respirer. Inspire lentement, souffle plus lentement encore. Tu n'as rien à réussir. Juste être là, avec ton souffle, le temps que l'envie passe.")
add("resp-nez", "Tout par le nez", "respiration",
    "Ferme la bouche. Respire uniquement par le nez, calmement. L'air se réchauffe, se filtre, arrive doucement. C'est plus lent, plus profond. En quelques respirations, le rythme cardiaque suit et ralentit.")
add("resp-eau", "Comme une vague", "respiration",
    "Imagine la mer. À l'inspiration, la vague monte sur le sable. À l'expiration, elle se retire lentement. Ton souffle suit ce mouvement, sans effort. Monte, retire-toi. Le calme vient avec le va-et-vient.")
add("resp-tension", "Relâcher les épaules", "respiration",
    "Inspire en montant les épaules vers les oreilles. Retiens un instant. Puis souffle en les laissant tomber d'un coup. La tension part avec l'air. Recommence trois fois, et sens le haut du corps s'alléger.")
add("resp-ancre", "Ton souffle, ton ancre", "respiration",
    "Quand tout s'agite, il reste ton souffle. Il est toujours là, disponible. Reviens à lui, une inspiration, une expiration. Tu n'as pas besoin d'aller ailleurs. Ton souffle te ramène ici, maintenant.")

# ---- Cohérence cardiaque (6) ----
add("coh-365", "Cohérence, la base", "coherence",
    "Cinq secondes pour inspirer, cinq pour souffler. Six respirations par minute. C'est le rythme qui met le cœur en cohérence. On le tient cinq minutes. Inspire cinq, souffle cinq. Régulier comme un métronome doux.")
add("coh-guide", "Cohérence guidée", "coherence",
    "Inspire, deux, trois, quatre, cinq. Souffle, deux, trois, quatre, cinq. Continue à ce rythme. Ton cœur, ta respiration et ton esprit s'accordent. En quelques minutes, le stress baisse et l'envie avec lui.")
add("coh-visuel", "Monter et descendre", "coherence",
    "Imagine une balle qui monte quand tu inspires, cinq secondes, et qui redescend quand tu souffles, cinq secondes. Suis-la des yeux fermés. Monte, descends. Ce mouvement régulier apaise tout le système nerveux.")
add("coh-fleur", "Le souffle de la fleur", "coherence",
    "Inspire comme si tu sentais une fleur, doucement, cinq secondes. Souffle comme si tu faisais vaciller une bougie sans l'éteindre, cinq secondes. Sentir, souffler. Le geste est doux, le cœur suit.")
add("coh-avant", "Avant un moment tendu", "coherence",
    "Tu sens qu'un moment difficile approche. Prends une longueur d'avance. Cinq minutes de cohérence, inspire cinq, souffle cinq. Tu arrives calme, prêt. Le craving trouve un corps déjà apaisé.")
add("coh-nuit", "Cohérence pour dormir", "coherence",
    "Allongé, respire cinq secondes à l'inspiration, cinq à l'expiration. Mais insiste un peu plus sur le souffle qui sort. Le corps comprend qu'il peut lâcher. Le sommeil vient plus facilement sur un rythme lent.")

# ---- Anti-envie / craving (15) ----
add("env-vague", "Surfer l'envie", "anti-envie",
    "L'envie est une vague. Elle monte, atteint un sommet, puis redescend toujours. Tu n'as pas à lutter contre elle, juste à rester debout dessus le temps qu'elle passe. Respire, observe. Elle est déjà en train de refluer.")
add("env-delai", "Attendre dix minutes", "anti-envie",
    "Tu n'as pas à dire non pour toujours, juste pas maintenant. Accorde-toi dix minutes. Bois un verre d'eau, change de pièce, occupe tes mains. Dans dix minutes, l'envie aura beaucoup baissé, souvent elle sera partie.")
add("env-eau", "Un grand verre d'eau", "anti-envie",
    "Va boire un grand verre d'eau, lentement, gorgée par gorgée. Ce geste occupe la bouche et les mains, ceux-là mêmes qui réclament la cigarette. Le temps du verre, l'envie perd de sa force.")
add("env-mains", "Occuper ses mains", "anti-envie",
    "L'envie passe beaucoup par les mains. Attrape quelque chose : un stylo, une balle, tes clés. Manipule, tourne, presse. Pendant que tes mains sont prises, le geste automatique de fumer n'a plus de place.")
add("env-marche", "Bouger deux minutes", "anti-envie",
    "Lève-toi et marche, même deux minutes, même sur place. Le mouvement change la chimie du corps et coupe l'envie. Monte un étage, fais le tour de la pièce. Au retour, tu verras, ce n'est déjà plus pareil.")
add("env-froid", "De l'eau froide", "anti-envie",
    "Passe tes poignets sous l'eau froide, ou asperge ton visage. Le froid réveille, recentre, et casse net la spirale de l'envie. Une petite secousse pour l'esprit, et te revoilà présent.")
add("env-pourquoi", "Ton pourquoi", "anti-envie",
    "Au moment de l'envie, souviens-toi pourquoi tu as commencé cet arrêt. Ta raison à toi. Elle est plus forte qu'une cigarette. Repense à elle, garde-la devant les yeux. C'est elle qui décide, pas l'envie.")
add("env-5432", "Cinq, quatre, trois", "anti-envie",
    "Ancre-toi. Nomme cinq choses que tu vois. Quatre que tu entends. Trois que tu peux toucher. Deux que tu sens. Une que tu goûtes. Le temps de cet inventaire, ton esprit quitte l'envie et revient au réel.")
add("env-scan", "Où est l'envie ?", "anti-envie",
    "Curieux plutôt que contre. Où sens-tu l'envie dans ton corps ? La gorge, la poitrine, les mains ? Observe-la comme une sensation, sans la juger. Rien qu'en la regardant, elle perd son emprise et se dissout.")
add("env-recompense", "La vraie récompense", "anti-envie",
    "La cigarette promet un soulagement de quelques minutes, puis reprend son dû. Résister, c'est la vraie récompense : la fierté, le souffle, la liberté qui reste. Ce moment gagné, personne ne te l'enlève.")
add("env-substitut", "Autre chose en bouche", "anti-envie",
    "Un chewing-gum, un bâton de réglisse, un fruit croquant, une tisane chaude. Donne à ta bouche autre chose à faire. Le besoin est souvent un geste plus qu'un manque. Remplace le geste, et l'envie s'apaise.")
add("env-respire", "Respirer plutôt qu'allumer", "anti-envie",
    "La cigarette, c'est d'abord une grande inspiration. Alors offre-toi cette inspiration sans elle. Trois respirations profondes, lentes, comme une bouffée mais d'air pur. Le corps reçoit ce qu'il cherchait, en mieux.")
add("env-message", "Écris à un proche", "anti-envie",
    "Plutôt que d'allumer, envoie un message à quelqu'un qui compte. Dis-lui bonjour, ou juste que tu tiens bon. Le lien coupe l'envie, et tu transformes ce moment en petit pas partagé.")
add("env-liste", "Ce que tu gagnes", "anti-envie",
    "Prends dix secondes pour lister ce que cette envie non fumée te rapporte. Un peu d'argent, un peu de souffle, un peu de fierté. Ça paraît petit, mais additionné, jour après jour, ça change une vie.")
add("env-nuit", "Une envie le soir", "anti-envie",
    "Le soir, la fatigue rend l'envie plus forte. C'est normal. Ne lutte pas de front : baisse la lumière, respire lentement, et va vers le sommeil. Demain matin, tu seras fier d'avoir laissé passer celle-là.")

# ---- Motivation / sens (12) ----
add("mot-toi", "D'abord pour toi", "motivation",
    "Tu ne fais pas ça pour les autres, ni pour la morale. Tu le fais pour toi, pour te sentir libre et fier. C'est la plus solide des raisons. Cette énergie vient de l'intérieur, et personne ne peut te la retirer.")
add("mot-proches", "Pour ceux que tu aimes", "motivation",
    "Pense à ceux qui comptent pour toi. À l'exemple que tu leur donnes, au temps que tu veux passer avec eux, en pleine forme. Chaque jour sans fumer, c'est un peu de vie que tu leur offres, et que tu t'offres.")
add("mot-liberte", "Reprendre les commandes", "motivation",
    "Fumer, c'est laisser un paquet décider de tes pauses, de ton humeur, de ton argent. Arrêter, c'est reprendre les commandes. Plus rien ne te sonne, plus rien ne te tient. Tu redeviens libre de ton temps.")
add("mot-argent", "Ce que tu mets de côté", "motivation",
    "Compte ce que la cigarette te coûtait par semaine, par mois, par an. C'est un voyage, un cadeau, une réserve. Cet argent qui partait en fumée reste maintenant dans ta poche. Il devient tes projets.")
add("mot-fierte", "La fierté du soir", "motivation",
    "Le soir, quand tu repenses à ta journée sans fumer, il y a cette petite fierté tranquille. Tu as tenu. Tu t'es choisi. Cette fierté-là ne s'achète pas, elle se gagne, une journée après l'autre.")
add("mot-identite", "Tu n'es plus fumeur", "motivation",
    "Le changement le plus fort, c'est de ne plus te penser comme un fumeur qui arrête, mais comme quelqu'un qui ne fume pas. Ce n'est pas une privation, c'est qui tu es en train de devenir. Et ça te va bien.")
add("mot-progres", "Regarde le chemin", "motivation",
    "Ne regarde pas seulement la montagne qui reste. Retourne-toi et vois le chemin déjà parcouru. Chaque jour franchi est une preuve que tu en es capable. Tu as déjà fait le plus dur : commencer.")
add("mot-souffle", "Ton souffle revient", "motivation",
    "Monter un escalier sans t'arrêter. Sentir vraiment un plat, un parfum. Courir après quelqu'un en riant. Ton souffle et tes sens reviennent, jour après jour. C'est ça que tu gagnes, concrètement.")
add("mot-difficile", "Les jours sans", "motivation",
    "Il y aura des jours plus durs. Ça ne veut pas dire que tu échoues, ça veut dire que tu traverses. Sois doux avec toi ces jours-là. Tenir un jour difficile, c'est encore plus fort que tenir un jour facile.")
add("mot-futur", "Dans un an", "motivation",
    "Imagine-toi dans un an. Le souffle ample, l'odeur partie, l'argent économisé, la fierté installée. Cette personne-là existe déjà en germe, dans chaque envie que tu laisses passer aujourd'hui.")
add("mot-petit", "Un pas suffit", "motivation",
    "Tu n'as pas à arrêter pour toute ta vie d'un coup. Tu as juste à ne pas fumer maintenant, aujourd'hui. C'est tout. Additionne les maintenant, et les jours se construisent tout seuls.")
add("mot-choix", "Chaque envie, un choix", "motivation",
    "Chaque envie qui passe est une petite occasion de te choisir. Ce n'est pas un combat, c'est un vote. À chaque fois, tu votes pour la personne que tu veux être. Et ces votes-là s'accumulent.")

# ---- Bienfaits santé (timeline, 12) ----
add("sante-20min", "Après 20 minutes", "sante",
    "Vingt minutes seulement après ta dernière cigarette, ton pouls et ta tension commencent déjà à redescendre. Ton corps n'attend pas pour se réparer. Il a commencé, là, maintenant.", day=1)
add("sante-8h", "Après 8 heures", "sante",
    "Huit heures sans fumer, et le taux de monoxyde de carbone dans ton sang a chuté de moitié. L'oxygène recircule mieux. Tes organes respirent. Tu le sens à peine, mais tout se remet en route.", day=1)
add("sante-24h", "Après 24 heures", "sante",
    "Un jour entier. Le monoxyde de carbone a quitté ton corps, et le risque d'accident cardiaque commence déjà à baisser. Vingt-quatre heures, et ton cœur te dit déjà merci.", day=1)
add("sante-48h", "Après 48 heures", "sante",
    "Deux jours. La nicotine a totalement quitté ton organisme. Ton goût et ton odorat se réveillent. Les aliments reprennent de la saveur, les parfums de la profondeur. Bienvenue à nouveau dans tes sens.", day=2)
add("sante-72h", "Après 72 heures", "sante",
    "Trois jours. C'est souvent le pic du manque, alors sois fier d'y être. En même temps, tes bronches se détendent et respirer devient plus facile. Le plus dur du sevrage physique est derrière toi.", day=3)
add("sante-2sem", "Après deux semaines", "sante",
    "Deux semaines à un mois. Ta circulation s'améliore nettement, marcher et bouger deviennent plus faciles. Le souffle est là. Ton corps a passé un cap, et ça se sent dans le quotidien.", day=14)
add("sante-1mois", "Après un mois", "sante",
    "Un mois. La toux et l'essoufflement diminuent. Tes poumons commencent à se nettoyer pour de bon, les petits cils qui les protègent repoussent. Tu récupères de l'énergie que tu avais oubliée.", day=30)
add("sante-3mois", "Après trois mois", "sante",
    "Trois mois. Ta fonction pulmonaire a nettement progressé, parfois de près d'un tiers. Le risque cardiaque continue de chuter. Le sommet approche, et ton corps est déjà un autre.", day=90)
add("sante-peau", "Ta peau respire", "sante",
    "En quelques semaines, ta peau retrouve des couleurs. Mieux oxygénée, mieux irriguée, elle paraît plus nette et plus reposée. Le teint terne des fumeurs s'efface doucement. Ton miroir le remarquera.")
add("sante-gout", "Le goût revient", "sante",
    "As-tu remarqué que le café a un goût plus rond, que les plats sont plus francs ? En arrêtant, tes papilles et ton nez se régénèrent. Manger redevient un plaisir plein. C'est un cadeau discret de l'arrêt.")
add("sante-cardio", "Ton cœur récupère", "sante",
    "Chaque jour sans fumer, ton cœur travaille un peu moins pour rien. La tension baisse, les vaisseaux se détendent. Sur un an, le risque de maladie cardiaque est presque divisé par deux. C'est énorme, et c'est pour toi.")
add("sante-poumons", "Tes poumons se nettoient", "sante",
    "Tes poumons sont faits pour se réparer. Une fois la fumée partie, les cils qui balaient les impuretés repoussent et se remettent au travail. La toux des premières semaines, c'est souvent ça : le grand ménage qui commence.")

# ---- Sommeil / détente (10) ----
add("dodo-refuge", "Le refuge de pierre", "sommeil",
    "Ferme les yeux. Un sentier de montagne au petit matin, l'air pur qui entre facilement. À chaque pas tu montes, sans te presser. Plus haut, un refuge de pierre t'attend, un feu de bois qui réchauffe. Tu y arrives. Tu es bien.")
add("dodo-plage", "La plage au soleil", "sommeil",
    "Imagine une plage tranquille en fin de journée. Le sable tiède sous toi, le bruit régulier des vagues. À chaque vague qui se retire, tu t'enfonces un peu plus dans la détente. Il n'y a rien à faire, juste écouter la mer.")
add("dodo-scan", "Détendre le corps", "sommeil",
    "Porte ton attention sur tes pieds, et relâche-les. Puis tes jambes, ton ventre, tes épaules, ta mâchoire, ton front. À chaque zone, laisse le poids s'installer. Le corps devient lourd, calme. Le sommeil s'approche.")
add("dodo-foret", "La forêt calme", "sommeil",
    "Une forêt au coucher du soleil. La lumière dorée entre les arbres, l'odeur de terre et de résine. Tes pas sont silencieux sur la mousse. Chaque respiration te dépose un peu plus dans ce lieu paisible.")
add("dodo-nuages", "Regarder les nuages", "sommeil",
    "Allongé dans l'herbe, tu regardes des nuages passer, lents, sans forme précise. Tes pensées font pareil : elles passent, tu les laisses filer. Aucune n'a besoin d'être retenue. Le ciel se vide, ton esprit aussi.")
add("dodo-poids", "Se laisser porter", "sommeil",
    "Sens le lit qui te porte entièrement. Tu n'as plus rien à tenir, plus rien à contrôler. Laisse ton corps peser, s'enfoncer, se confier au matelas. Respire lentement. Tu es en sécurité, tu peux lâcher.")
add("dodo-journee", "Poser la journée", "sommeil",
    "La journée est finie, tu l'as traversée sans fumer, ou tu as fait de ton mieux. Dépose-la, comme un sac qu'on pose enfin. Rien à régler ce soir. Demain est un autre jour. Cette nuit, tu te reposes, simplement.")
add("dodo-souffle", "Compter vers le sommeil", "sommeil",
    "Respire lentement et compte tes expirations à l'envers, à partir de dix. Dix, le corps se pose. Neuf, les épaules tombent. Huit, la mâchoire se relâche. Continue, sans effort. Souvent, on n'arrive jamais à un.")
add("dodo-gratitude", "Trois choses douces", "sommeil",
    "Avant de dormir, repense à trois petites choses agréables d'aujourd'hui. Un rayon de soleil, un sourire, un moment tranquille. Rien de grand. L'esprit s'endort mieux sur du doux que sur des soucis.")
add("dodo-etoiles", "Sous les étoiles", "sommeil",
    "Imagine-toi allongé dehors, une nuit claire, à regarder les étoiles. Le silence est immense et bienveillant. Tu te sens tout petit et parfaitement à ta place. Ta respiration ralentit au rythme du ciel.")

# ---- Ancrage / pleine conscience (7) ----
add("anc-present", "Revenir à l'instant", "ancrage",
    "Où es-tu, là, maintenant ? Sens tes pieds au sol, le poids de ton corps, l'air sur ta peau. Tu n'es ni dans hier ni dans demain. Juste ici. L'instant présent est le seul endroit où l'envie n'a pas de prise.")
add("anc-mains", "Sentir ses mains", "ancrage",
    "Ferme les yeux et porte toute ton attention sur tes mains. La température, les picotements, le contact de l'air. Reste là une minute. Ramener l'esprit dans le corps suffit souvent à faire redescendre l'agitation.")
add("anc-sons", "Écouter autour", "ancrage",
    "Sans bouger, écoute. Le son le plus proche, puis le plus lointain. Un bruit continu, un bruit qui va et vient. N'analyse pas, écoute simplement. Les sons te ramènent dans le présent, doucement.")
add("anc-cafe", "Boire en conscience", "ancrage",
    "La prochaine boisson chaude, prends-la vraiment. La chaleur de la tasse dans tes mains, la vapeur, la première gorgée. Un instant entier rien que pour ça. C'est un plaisir simple, et il n'a pas besoin de cigarette.")
add("anc-pas", "Marcher en conscience", "ancrage",
    "Marche un peu plus lentement que d'habitude. Sens chaque pied qui se pose, se déroule, se soulève. Le rythme régulier de la marche apaise l'esprit. Quelques pas attentifs, et l'envie s'est éloignée.")
add("anc-corps", "Trois grandes minutes", "ancrage",
    "Une minute pour observer tes pensées, sans les suivre. Une minute pour ramener l'attention sur ton souffle. Une minute pour élargir à tout ton corps. Trois minutes qui remettent de l'ordre quand tout va trop vite.")
add("anc-sourire", "Un demi-sourire", "ancrage",
    "Détends ton visage et laisse venir un léger sourire, même pour rien. Le corps envoie alors au cerveau un signal d'apaisement. C'est étrange et ça marche : le calme peut commencer par le visage.")

# ---- Situations à risque (15) ----
add("sit-reveil", "La première du matin", "situation",
    "Le réveil, le café, et d'habitude la cigarette. C'est le geste le plus ancré. Ce matin, remplace-le : trois respirations profondes à la fenêtre, un verre d'eau. Le corps cherche un rituel, offre-lui celui-là.")
add("sit-cafe", "Le café sans clope", "situation",
    "Le café appelle la cigarette par habitude, pas par besoin. Casse le lien : bois-le à un autre endroit, ou tiens la tasse de l'autre main. Savoure vraiment le café. En quelques jours, le duo se défait tout seul.")
add("sit-repas", "Après le repas", "situation",
    "La fin du repas est un moment classique d'envie. Lève-toi de table, va te laver les dents, bois de l'eau, ou sors deux minutes. Change la suite habituelle du repas, et l'automatisme perd son signal.")
add("sit-soiree", "En soirée", "situation",
    "En soirée, entre l'ambiance et les autres qui fument, l'envie monte. Prépare-toi : un verre non alcoolisé dans la main, une phrase simple pour décliner, un pote au courant. Tu peux profiter de la fête sans la cigarette.")
add("sit-alcool", "Un verre en main", "situation",
    "L'alcool baisse la garde et réveille l'envie. Ce n'est pas de la faiblesse, c'est chimique. Alterne avec de l'eau, garde tes mains occupées, et rappelle-toi pourquoi tu tiens. Un moment de vigilance, et ça passe.")
add("sit-trajet", "Sur le trajet", "situation",
    "Le trajet, les mains libres, l'esprit qui vagabonde : terrain d'envie. Occupe-le autrement. Un podcast, une musique, un appel, ou juste respirer au rythme de tes pas. Le trajet peut devenir ton moment à toi.")
add("sit-pause", "La pause au travail", "situation",
    "La pause cigarette, c'était surtout une vraie pause. Garde la pause, change le contenu. Sors prendre l'air, étire-toi, appelle quelqu'un. Tu as le droit de souffler. Simplement, autrement.")
add("sit-stress", "Un coup de stress", "situation",
    "Le stress monte et la cigarette semble être la solution. Mais elle ne règle rien, elle ne fait que déplacer. La vraie détente, c'est le souffle. Trois expirations longues, et le stress redescend d'un cran, pour de vrai.")
add("sit-ennui", "Quand tu t'ennuies", "situation",
    "L'ennui pousse à fumer pour s'occuper. Alors donne à l'ennui autre chose : marche un peu, envoie un message, range un tiroir, bois un thé. Une petite action à la place du geste, et l'envie n'a pas le temps de s'installer.")
add("sit-colere", "Quand tu es agacé", "situation",
    "La colère cherche une sortie, et la cigarette s'offre comme exutoire. Mais elle t'enlève le contrôle au lieu de te le rendre. Souffle fort et long, deux ou trois fois. Bouge. La tension redescend, et c'est toi qui gardes la main.")
add("sit-attente", "En attendant", "situation",
    "Faire la queue, attendre un bus, patienter : ces temps morts appellent la cigarette. Remplis-les autrement. Respire, observe autour de toi, occupe tes mains. Un temps d'attente n'est pas un temps à fumer.")
add("sit-telephone", "Au téléphone", "situation",
    "Téléphoner et fumer allaient souvent ensemble. Pendant l'appel, prends un stylo, gribouille, marche un peu. Donne à ta main occupée un autre rôle. La conversation se passe très bien sans la fumée.")
add("sit-ecran", "Devant un écran", "situation",
    "Devant l'ordinateur ou la télé, la main cherche machinalement le paquet. Éloigne-le, mets un verre d'eau à la place. Fais une vraie coupure toutes les demi-heures. L'écran n'a pas besoin de cigarette pour tourner.")
add("sit-conduite", "Au volant", "situation",
    "En voiture, seul, l'envie revient par habitude. Aère, mets une musique que tu aimes, mâche un chewing-gum. Fais de ton habitacle un espace sans fumée, plus agréable, plus net. Ton trajet y gagne.")
add("sit-autres", "Les autres fument", "situation",
    "Autour de toi, certains fument encore, et l'odeur rappelle l'envie. Ce n'est pas contre toi. Éloigne-toi un instant, respire de l'air frais, reviens quand ça passe. Leur choix n'a pas à devenir le tien.")

# ---- Rechute / bienveillance (8) ----
add("rech-glissade", "Une glissade, pas une chute", "bienveillance",
    "Si tu as refumé, ce n'est pas fini, et ce n'est pas un échec. Une cigarette n'efface pas les jours gravis. C'est une glissade, pas une chute. Ton corps garde le terrain gagné. On repart d'où tu es, sans te juger.")
add("rech-comprendre", "Comprendre, pas se punir", "bienveillance",
    "Plutôt que de t'en vouloir, regarde ce qui s'est passé. Quel moment, quelle émotion, quel déclencheur ? Ce n'est pas une faute à punir, c'est une information précieuse. Elle t'aide à mieux préparer la prochaine fois.")
add("rech-repartir", "Repartir maintenant", "bienveillance",
    "Le meilleur moment pour repartir, ce n'est pas lundi, ni demain. C'est maintenant, à la prochaine décision. Tu n'as pas tout perdu. Tu as juste un pas à refaire, et tu sais déjà comment marcher.")
add("rech-doux", "Sois doux avec toi", "bienveillance",
    "Arrêter de fumer est un des changements les plus difficiles qui soient. Tu t'y attelles, c'est déjà courageux. Parle-toi comme tu parlerais à un ami qui traverse ça : avec patience, pas avec dureté.")
add("rech-normal", "Les rechutes sont normales", "bienveillance",
    "La plupart des gens qui arrêtent pour de bon ont rechuté avant. Ce n'est pas l'exception, c'est le chemin habituel. Chaque tentative t'apprend quelque chose. Tu ne repars jamais de zéro, tu repars de ton expérience.")
add("rech-acquis", "Ce qui reste gagné", "bienveillance",
    "Même après une cigarette, l'argent économisé reste économisé, les jours sans restent vécus, ce que tu as appris reste appris. Rien de tout ça ne s'annule. Tu construis sur du solide, même les jours moins bons.")
add("rech-jour1", "Le jour de l'arrêt", "bienveillance",
    "Aujourd'hui commence quelque chose. Pas besoin d'être parfait, juste de commencer. Le camp de base t'attend. Chaque petite victoire compte, même minuscule. On avance un jour à la fois, ensemble.")
add("rech-fier", "Fier du chemin", "bienveillance",
    "Prends un instant pour reconnaître ce que tu fais. Tu affrontes une des habitudes les plus tenaces qui soient, et tu tiens. Peu importe le rythme. Le simple fait d'essayer, encore, mérite ta fierté.")

print(json.dumps(C, ensure_ascii=False, indent=2))
