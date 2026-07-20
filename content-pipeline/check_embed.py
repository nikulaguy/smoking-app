import json, subprocess, os
os.environ["SSL_CERT_FILE"]=subprocess.run(["./venv/bin/python","-c","import certifi;print(certifi.where())"],capture_output=True,text=True).stdout.strip()
vids=json.load(open("videos_curated.json"))
ids=[v["id"] for v in vids]
urls=[f"https://www.youtube.com/watch?v={i}" for i in ids]
r=subprocess.run(["./venv/bin/yt-dlp","--skip-download","--no-warnings","-O","%(id)s|%(playable_in_embed)s"]+urls,
                 capture_output=True,text=True)
ok=set()
for line in r.stdout.splitlines():
    if "|" in line:
        i,emb=line.split("|",1)
        if emb.strip().lower()=="true": ok.add(i.strip())
keep=[v for v in vids if v["id"] in ok]
json.dump(keep, open("videos_final.json","w"), ensure_ascii=False, indent=1)
print("intégrables:", len(keep), "/", len(vids))
