#!/usr/bin/env bash
# Génère out/<slug>.m4a pour chaque script de audio-scripts.json.
# Prérequis (voir README) : venv piper-tts, fr.onnx(+.json), ffmpeg.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out
count=$(./venv/bin/python -c "import json;print(len(json.load(open('audio-scripts.json'))))")
for i in $(seq 0 $((count - 1))); do
  slug=$(./venv/bin/python -c "import json;print(json.load(open('audio-scripts.json'))[$i]['slug'])")
  text=$(./venv/bin/python -c "import json;print(json.load(open('audio-scripts.json'))[$i]['text'])")
  printf '%s' "$text" | ./venv/bin/python -m piper -m fr.onnx -f "out/$slug.wav" 2>/dev/null
  ffmpeg -hide_banner -loglevel error -y -i "out/$slug.wav" -ac 1 -c:a aac -b:a 48k "out/$slug.m4a"
  rm -f "out/$slug.wav"
  dur=$(ffprobe -hide_banner -loglevel error -show_entries format=duration -of csv=p=0 "out/$slug.m4a")
  printf '%-28s %5.0fs  %s\n' "$slug" "$dur" "$(ls -lh "out/$slug.m4a" | awk '{print $5}')"
done
echo "Total: $(du -sh out | awk '{print $1}')"
