#!/usr/bin/env python3
"""Tu va lai trang bantin sau moi lan day (Guest, 25/11/2026, muc 4; anh Vu chot phuong an A "mot logo").

Vi sao: tac vu "Dong bo Kho cong khai" cua Vu TVN Team dung trang tu bo dung (artifact 1VcvZLMnkptq5JCopzaMit) roi
push --force, nen sua thang tren trang bi de. Tac vu do giu nguyen thu muc .github (GIU_TREN_TRANG trong kho_public),
nen quy trinh .github/workflows/va_bantin.yml chay tep nay sau moi lan day va va lai neu thieu.
Khi bo dung da co san doan sua (thu h-20261125-095836-sh, h-20261125-094214-mn) thi tep nay khong doi gi.

Va:
 1. v2/index.html: nam trong khung trang cong ty tvnpartners.com.vn thi gan lop trong-web, an bieu tuong, dong
    "TVN & Partners", logo dau trang, tieu de phu "TVN Insight" lap; mo rieng giu logo (dau "tvn-mot-logo").
 2. qa/qa.js: o Hoi TVN chay khi la khung cap 1 cua trang cong ty (dau "ancestorOrigins"), chi khi con dong chan cu.
Khong khop mau thi bao loi (lan chay do, chu kho nhan thu cua GitHub) thay vi doan.
"""
import os, subprocess, sys, time

V2 = "v2/index.html"
QA = "qa/qa.js"

JS = (r'<script>/*tvn-mot-logo 25/11/2026 (Guest, anh Vu chot phuong an A): nam trong khung trang cong ty tvnpartners.com.vn thi chi ghi ten san pham, '
      r'bo bieu tuong va dong "TVN & Partners", "TVN Insight" lap; mo rieng (app cai vao may, artifact) giu logo*/'
      r'try{if(window.top!==window.self){var mlA=location.ancestorOrigins,mlP=mlA&&mlA.length?mlA[mlA.length-1]:document.referrer;'
      r'if(/^https:\/\/(www\.)?tvnpartners\.com\.vn(\/|$)/.test(mlP||""))document.documentElement.classList.add("trong-web")}}catch(e){}</script>')
CSS = ('<style>/*tvn-mot-logo*/html.trong-web #top .lg,html.trong-web #sub.mac-dinh{display:none!important}'
       '@media (min-width:1024px){html.trong-web #rail .brand svg,html.trong-web #rail .brand small{display:none}'
       'html.trong-web #rail .brand{padding:4px 12px 18px}html.trong-web #rail .brand b{font-size:20px;letter-spacing:.2px}'
       'html.trong-web #rail{box-shadow:inset -1px 0 0 rgba(200,153,47,.35)}}</style>')
QA_CU = "  try { if (window.self !== window.top) return; } catch (e) { return; }"
QA_MOI = (
    "  /* 25/11/2026 (Guest, anh Vu bao o Hoi TVN khong tra loi): tu 14/11 ban tin v2 luon nam trong khung tvnpartners.com.vn/ban-tin-live,\n"
    "     nen cho chay khi la khung cap 1 cua trang cong ty; khung long sau hon (trang con trong v2) van bo qua nhu cu */\n"
    "  try {\n"
    "    if (window.self !== window.top) {\n"
    "      var AO = location.ancestorOrigins, PO = AO && AO.length ? AO[0] : document.referrer;\n"
    "      if (window.parent !== window.top || !/^https:\\/\\/(www\\.)?tvnpartners\\.com\\.vn(\\/|$)/.test(PO || \"\")) return;\n"
    "    }\n"
    "  } catch (e) { return; }")


def doc(p):
    return open(p, encoding="utf-8", newline="").read()


def ghi(p, s):
    open(p, "w", encoding="utf-8", newline="").write(s)


def mot(s, cu, moi, ten):
    if s.count(cu) != 1:
        raise SystemExit("Khong khop mau '%s' (%d cho): bo dung da doi, can xem lai va_bantin.py" % (ten, s.count(cu)))
    return s.replace(cu, moi)


def va_v2():
    if not os.path.exists(V2): return None
    s = doc(V2)
    if "tvn-mot-logo" in s: return None
    moc = 'location.replace("https://tvnpartners.com.vn/ban-tin-live/"+location.search+location.hash);</script>'
    s = mot(s, moc, moc + "\n" + JS, "script tvn-chuyen-wp")
    s = mot(s, "</head>", CSS + "\n</head>", "</head>")
    s = mot(s, '<small id="sub">TVN Insight</small>', '<small id="sub" class="mac-dinh">TVN Insight</small>', "#sub")
    b = '$("sub").textContent = sub || "TVN Insight";'
    s = mot(s, b, b + ' $("sub").classList.toggle("mac-dinh", $("sub").textContent === "TVN Insight");', "setFrame #sub")
    ghi(V2, s)
    return "v2 mot logo"


def va_qa():
    if not os.path.exists(QA): return None
    s = doc(QA)
    if "ancestorOrigins" in s or QA_CU not in s: return None
    ghi(QA, mot(s, QA_CU, QA_MOI, "qa.js chan khung"))
    return "qa.js khung cong ty"


def sh(*a, check=True):
    r = subprocess.run(a, capture_output=True, text=True)
    if check and r.returncode: raise SystemExit("%s: %s" % (" ".join(a), r.stderr[-400:]))
    return r


def main():
    sh("git", "config", "user.name", "github-actions[bot]")
    sh("git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com")
    for lan in range(1, 6):
        bao = [x for x in (va_v2(), va_qa()) if x]
        if not bao:
            print("Trang da du ban va, khong doi gi."); return
        sh("git", "add", V2, QA)
        sh("git", "commit", "-q", "-m", "Tu va lai: " + ", ".join(bao) + " (bo dung chua co, .github/va_bantin.py)")
        if sh("git", "push", "origin", "HEAD:main", check=False).returncode == 0:
            print("Da day: " + ", ".join(bao)); return
        print("Day bi tu choi (lan %d), lay ban moi va lam lai" % lan)
        time.sleep(10 * lan)
        sh("git", "fetch", "-q", "--depth", "1", "origin", "main")
        sh("git", "reset", "-q", "--hard", "origin/main")
    sys.exit("Khong day duoc sau 5 lan")


if __name__ == "__main__":
    main()
