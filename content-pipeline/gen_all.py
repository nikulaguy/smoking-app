import json, subprocess, os
os.makedirs("out", exist_ok=True)
scripts = json.load(open("audio-scripts.json"))
for i, s in enumerate(scripts, 1):
    slug = s["slug"]; wav = f"out/{slug}.wav"; m4a = f"out/{slug}.m4a"
    if os.path.exists(m4a):
        continue
    p = subprocess.run(["./venv/bin/python","-m","piper","-m","piper/fr.onnx","-f",wav],
                       input=s["text"].encode(), capture_output=True)
    if p.returncode != 0:
        print(f"[{i}] ERR {slug}: {p.stderr.decode()[:120]}"); continue
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",wav,
                    "-ac","1","-c:a","aac","-b:a","48k",m4a], check=True)
    os.remove(wav)
    print(f"[{i}/{len(scripts)}] {slug}")
print("DONE", len([f for f in os.listdir('out') if f.endswith('.m4a')]), "fichiers")
