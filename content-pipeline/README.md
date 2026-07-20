# Pipeline de contenus (audios TTS + vidéos YouTube)

Alimente la table Supabase `public.contents` (type `audio` | `video`) lue par
les outils Audio/Vidéo de l'app. 100 % gratuit et open source.

## Audios — TTS Piper (offline, MIT)

Voix : `fr_FR-siwis-medium` (féminine, claire). Sortie : **M4A/AAC 48k mono**
(lu partout, iOS Safari inclus). Poids mesuré : ~6 Ko/s → ~0,8 Mo pour 2 min,
soit ~80-100 Mo pour 100 audios (< 10 % du 1 Go gratuit Supabase Storage).

### Installation (une fois)

```bash
python3 -m venv venv && ./venv/bin/pip install piper-tts
# voix FR (modèle + config)
curl -L -o fr.onnx      https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx
curl -L -o fr.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json
# ffmpeg requis (brew install ffmpeg)
```

### Génération

Les scripts vivent dans `audio-scripts.json` (`{ slug, title, theme, text }`).
`./generate-audios.sh` produit `out/<slug>.m4a` pour chacun.

### Upload + catalogue

Upload dans le bucket public `audios` (chemin `samples/` ou `v1/`), puis
insert dans `contents`. Pendant le seeding, ouvrir temporairement l'écriture :

```sql
create policy "seed audios anon" on storage.objects
  for insert to anon with check (bucket_id = 'audios');
-- ... uploads (POST /storage/v1/object/audios/<path>, clé publishable) ...
drop policy "seed audios anon" on storage.objects;  -- refermer après
```

URL publique : `.../storage/v1/object/public/audios/<path>`.

## Vidéos — YouTube (embed, jamais téléchargé)

On référence des vidéos FR de chaînes fiables (Tabac info service, Santé
publique France, Assurance Maladie, addictologie, médecins vulgarisateurs) et
on les **intègre** via `lite-youtube-embed` (Apache-2.0, `youtube-nocookie`).
Découverte des candidats via `yt-dlp` (métadonnées seules), filtrées FR /
`embeddable` / durée, puis curation avant insert dans `contents`
(`ref` = id YouTube, `source` = chaîne). Voir `fetch-videos.sh`.
