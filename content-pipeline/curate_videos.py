import json, re
pool = json.load(open("videos_pool.json"))
NOISE = re.compile(r"\b(vape|vapote|puff|e-?cig|cigarette [ée]lectronique|cbd|snus|iqos|elfbar)\b", re.I)
OFFTOPIC = re.compile(r"\b(cannabis|joint|weed|beuh|shit|drogue dure|alcool|coca[iï]ne)\b", re.I)
cur = []
for v in pool:
    d = v["duration"] or 0
    if d < 45 or d > 1800: continue
    if NOISE.search(v["title"]): continue
    if OFFTOPIC.search(v["title"]): continue
    cur.append(v)
# dédup titre quasi identique
seen_t=set(); out=[]
for v in cur:
    k=re.sub(r"\W+","",v["title"].lower())[:40]
    if k in seen_t: continue
    seen_t.add(k); out.append(v)
out = out[:100]
json.dump(out, open("videos_curated.json","w"), ensure_ascii=False, indent=1)
print("curés:", len(out))
