import json, subprocess
QUERIES = [
  "arrêter de fumer conseils","sevrage tabagique","bienfaits arrêter de fumer",
  "arrêt du tabac témoignage","gérer le manque de tabac","tabac et santé prévention",
  "comment arrêter de fumer médecin","effets du tabac sur le corps","arrêt tabac motivation",
  "cigarette dépendance nicotine","arrêter de fumer astuces","poumons après arrêt tabac",
]
seen, pool = set(), []
for q in QUERIES:
    r = subprocess.run(["./venv/bin/yt-dlp","--flat-playlist","-J","--no-warnings",
                        f"ytsearch15:{q}"], capture_output=True, text=True)
    if r.returncode != 0:
        print("ERR", q, r.stderr[:80]); continue
    data = json.loads(r.stdout or "{}")
    for e in data.get("entries") or []:
        vid = e.get("id")
        if not vid or vid in seen: continue
        seen.add(vid)
        pool.append({"id":vid,"title":e.get("title") or "","channel":e.get("channel") or e.get("uploader") or "","duration":e.get("duration") or 0})
    print(f"{q}: pool={len(pool)}")
json.dump(pool, open("videos_pool.json","w"), ensure_ascii=False, indent=1)
print("TOTAL pool:", len(pool))
