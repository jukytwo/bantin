#!/usr/bin/env python3
"""Chuyen tep nang cua so cu trong jukytwo/bantin sang GitHub Releases (Vu max, 13/11/2026, thu i-20261113-r7gh).

Chay trong GitHub Actions (.github/workflows/releases.yml), dung GITHUB_TOKEN cua lan chay; khong can token rieng.
Moi lan chay (khong dua vao lich su commit, vi tac vu dong bo day --force):
  1. Doc archive.json. So giu tep nang = GIU so chot phien gan nhat (mac dinh 5). Moi so phien, tuan co ngay cu hon
     so chot phien thu GIU la "so cu" (ban sang da do dong bo tu bo).
  2. Voi moi so cu: tep nang (clip.mp4, nghe.mp3, nghe_en.mp3, anh1-3.png, chiase.png) con trong a/<id>/ thi tai len
     ban phat hanh "luutru-<id>" (gan nhanh "luutru", ten tep "<id>_<ten>"; trung kich thuoc thi khong tai lai), roi go khoi cay.
     Giu PDF, tomgon.png, baidang.txt, dashboard*.html, text.txt.
  3. Ban do lay tu chinh Releases (nguon dung), ghi vao archive.json (khoa "rel", go khoa tep nang khoi "files")
     va releases_map.json; dashboard*.html cua so cu tro thang vao URL ban phat hanh.
  4. Commit, day (khong --force); bi tu choi vi co lan day khac thi lay ban moi, lam lai tu dau (toi 4 lan).
Khong in, khong ghi token.
"""
import json, os, re, subprocess, sys, time, datetime

REPO = os.environ.get("GITHUB_REPOSITORY", "jukytwo/bantin")
GIU = max(1, int(os.environ.get("GIU") or 5))
TAG_PREFIX = "luutru-"
BRANCH_REL = "luutru"
HEAVY = {"clip.mp4": "clip", "nghe.mp3": "nghe", "nghe_en.mp3": "nghe_en",
         "anh1.png": "anh", "anh2.png": "anh", "anh3.png": "anh", "chiase.png": "chiase"}
HEAVY_KEYS = ("clip", "nghe", "nghe_en", "anh", "chiase")
DASH = ("dashboard.html", "dashboard_en.html")


def sh(*a, check=True, capture=True):
    r = subprocess.run(a, text=True, capture_output=capture)
    if check and r.returncode != 0:
        raise RuntimeError("%s loi %d: %s" % (" ".join(a[:3]), r.returncode, (r.stderr or "")[-400:]))
    return r


def gh_json(path):
    return json.loads(sh("gh", "api", "--paginate", "--slurp", path).stdout)


def releases():
    """{tag: {"id":..., "assets": {ten: (size, url)}}}"""
    out = {}
    for page in gh_json(f"repos/{REPO}/releases?per_page=100"):
        for r in page:
            out[r["tag_name"]] = {"id": r["id"], "assets": {a["name"]: (a["size"], a["browser_download_url"]) for a in r.get("assets", [])}}
    return out


def ensure_branch_rel():
    if sh("git", "ls-remote", "origin", "refs/heads/" + BRANCH_REL).stdout.strip(): return
    raise RuntimeError("thieu nhanh %s (kho_public.py tao nhanh nay); khong tu tao de tranh gan tag vao trang" % BRANCH_REL)


def dir_size(d):
    t = 0
    for root, dirs, files in os.walk(d):
        if ".git" in dirs: dirs.remove(".git")
        t += sum(os.path.getsize(os.path.join(root, n)) for n in files)
    return t


def apply_once():
    A = json.load(open("archive.json", encoding="utf-8"))
    items = A.get("items", [])
    ph = sorted({x.get("iso", "") for x in items if x.get("ed") == "phien"}, reverse=True)
    if len(ph) < GIU:
        return [], "chua du %d so chot phien, khong chuyen" % GIU
    moc = ph[GIU - 1]                                       # so phien, tuan co ngay < moc la so cu
    cu = [x for x in items if x.get("id") and x.get("ed") != "sang" and x.get("iso", "") < moc]
    R = releases(); bao = []
    for x in cu:
        sid = x["id"]; tag = TAG_PREFIX + sid; d = os.path.join("a", sid)
        local = [n for n in HEAVY if os.path.isfile(os.path.join(d, n))]
        if local:
            if tag not in R:
                ensure_branch_rel()
                sh("gh", "release", "create", tag, "--repo", REPO, "--target", BRANCH_REL,
                   "--title", "Lưu trữ " + (x.get("date") or sid),
                   "--notes", "Tệp nặng của bản tin " + sid + ". Đọc trang tin: https://jukytwo.github.io/bantin/")
                R[tag] = {"id": None, "assets": {}}
            up = []
            for n in local:
                p = os.path.join(d, n); an = sid + "_" + n
                have = R[tag]["assets"].get(an)
                if not have or have[0] != os.path.getsize(p):
                    q = os.path.join(os.environ.get("RUNNER_TEMP", "/tmp"), an)
                    with open(p, "rb") as s, open(q, "wb") as t: t.write(s.read())
                    up.append(q)
            if up:
                sh("gh", "release", "upload", tag, "--repo", REPO, "--clobber", *up)
                for q in up: os.remove(q)
                R = releases()
            for n in local:                                   # chi go khi ban phat hanh da co dung tep, dung kich thuoc
                an = sid + "_" + n; have = R.get(tag, {}).get("assets", {}).get(an)
                if not have or have[0] != os.path.getsize(os.path.join(d, n)):
                    raise RuntimeError("tai len chua xong: " + an)
                os.remove(os.path.join(d, n))
            bao.append("%s: %d tep" % (sid, len(local)))
        # ban do tu chinh Releases
        assets = R.get(tag, {}).get("assets", {})
        rel = {}
        for n in sorted(HEAVY):
            a = assets.get(sid + "_" + n)
            if not a: continue
            k = HEAVY[n]
            if k == "anh": rel.setdefault("anh", []).append(a[1])
            else: rel[k] = a[1]
        if not rel: continue
        f = dict(x.get("files") or {})
        for k in HEAVY_KEYS:
            if k in rel: f.pop(k, None)
        x["files"] = f; x["rel"] = rel
        for dn in DASH:                                       # trang so cu tro vao URL ban phat hanh
            p = os.path.join(d, dn)
            if not os.path.isfile(p): continue
            h = h0 = open(p, encoding="utf-8").read()
            for n in HEAVY:
                a = assets.get(sid + "_" + n)
                if a: h = re.sub(r'(["\'(])(?:\./)?' + re.escape(n) + r'(["\')])', lambda m: m.group(1) + a[1] + m.group(2), h)
            if h != h0: open(p, "w", encoding="utf-8").write(h)
    json.dump(A, open("archive.json", "w", encoding="utf-8"), ensure_ascii=False)
    tep, so = {}, {}
    for x in items:
        if not x.get("rel"): continue
        sid = x["id"]; so[sid] = {"tag": TAG_PREFIX + sid, "rel": x["rel"]}
        for n in sorted(HEAVY):
            a = R.get(TAG_PREFIX + sid, {}).get("assets", {}).get(sid + "_" + n)
            if a: tep["a/%s/%s" % (sid, n)] = a[1]
    M = {"phien_ban": 1, "cap_nhat": datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).isoformat(timespec="seconds"),
         "giu_so_phien": GIU, "moc_iso": moc, "tep": tep, "so": so}
    json.dump(M, open("releases_map.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return bao, "moc %s, %d so co ban do" % (moc, len(so))


def main():
    sh("git", "config", "user.name", "github-actions[bot]")
    sh("git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com")
    for lan in range(1, 5):
        bao, ghi = apply_once()
        sh("git", "add", "-A")
        if not sh("git", "status", "--porcelain").stdout.strip():
            print("Khong co gi doi. " + ghi); break
        msg = "Releases tu dong: " + (", ".join(bao) if bao else "cap nhat ban do") + " (" + ghi + ")"
        sh("git", "commit", "-q", "-m", msg[:600])
        r = sh("git", "push", "origin", "HEAD:main", check=False)
        if r.returncode == 0:
            print("Da day. " + msg[:600]); break
        print("Day bi tu choi (lan %d), lay ban moi va lam lai" % lan)
        time.sleep(15 * lan)
        sh("git", "fetch", "-q", "--depth", "1", "origin", "main")
        sh("git", "reset", "-q", "--hard", "origin/main")
    else:
        sys.exit("Khong day duoc sau 4 lan")
    print("Dung luong trang: %.1f MB" % (dir_size(".") / 1048576))


if __name__ == "__main__":
    main()
