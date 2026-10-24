/* Hỏi đáp TVN Insight · TVN & Partners
   Ưu tiên trả lời từ nội dung bản tin TVN (kb.json); không có mới hỏi trợ lý AI (Gemini miễn phí) qua trạm trung gian. */
(function () {
  "use strict";
  if (window.__tvnqa) return; window.__tvnqa = 1;
  try { if (window.self !== window.top) return; } catch (e) { return; }
  if (document.documentElement.classList.contains("embed")) return;

  var ME = document.currentScript;
  var BASE = ME && ME.src ? ME.src.replace(/qa\.js(\?.*)?$/, "") : "qa/";
  var ROOT = BASE.replace(/qa\/$/, "");
  var PROXY = (ME && ME.getAttribute("data-proxy")) || "";
  var ZALO = "https://zaloapp.com/qr/g/rkkgxm238?src=qr", HOT = "0936 090 649";
  var AI_DAY = 60, Q_MAX = 1500, VIMO = "https://jukytwo.github.io/vimo/";
  var MACRO = /\b(gdp|cpi|lam phat|tang truong kinh te|vi mo|fdi|xuat khau|nhap khau|dau tu cong|iip|pmi|ngan sach|no cong|du bao gdp)\b/;
  function vimoChip(q) { return MACRO.test(fold(q)) ? '<a href="' + VIMO + '" target="_blank" rel="noopener">Báo cáo vĩ mô TVN ›</a>' : ""; }

  /* ---------- chữ và tìm kiếm ---------- */
  function fold(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d"); }
  var STOP = {};
  ("la cua va co khong ko k kg hok nhu the nao gi bao nhieu toi tui ban minh anh chi em cho hoi ve trong voi thi ma nay do cac nhung mot duoc de o tai sao " +
   "vi khi se da dang ra a ha nhe nha vay roi chua hay hoac neu tu den tvn xin giup biet oi ah u um thay cai con nhieu it rat qua lam them nua dau cung " +
   "hien bay gio luc hom nao nhi ne di sang").split(" ").forEach(function (w) { STOP[w] = 1; });
  var KEEP = { sang: 1, dau: 1 };      // "sáng", "dầu" vẫn có nghĩa khi đứng cạnh từ khác; xử lý ở bigram
  var ALT = { giam: ["ha"], ha: ["giam"], co_phieu: [], tang: ["hoi"], hoi: ["tang"] };
  var SYN = { vni: "vn index", vnindex: "vn index", nn: "khoi ngoai", ck: "chung khoan", ls: "lai suat", tg: "ty gia", btc: "bitcoin", kn: "khuyen nghi" };
  function toks(s) { return fold(s).split(/[^a-z0-9]+/).filter(Boolean); }
  var ROMAN = { "1": "i", "2": "ii", "3": "iii", "4": "iv" };
  function qterms(q) {
    var t = [], w0 = toks(q);
    w0.forEach(function (w, i) {
      var m = /^q([1-4])$/.exec(w);                               // "Q3", "q3/2026" -> "quý III" như cách viết trong báo cáo
      if (m) { t.push("quy", ROMAN[m[1]]); return; }
      if (ROMAN[w] && w0[i - 1] === "quy") { t.push(ROMAN[w]); return; }   // "quý 3" -> "quý III"
      (SYN[w] ? SYN[w].split(" ") : [w]).forEach(function (x) { t.push(x); });
    });
    return t;
  }
  function macroQ(q) { var f = " " + qterms(q).join(" ") + " "; return MACRO.test(f) || /\squy (i|ii|iii|iv)\s/.test(f) && !tickersIn(q).length; }

  var KB = null, IDX = null, TICK = {}, loading = null;
  function load() {
    if (loading) return loading;
    loading = fetch(BASE + "kb.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (kb) {
      KB = kb; var N = kb.chunks.length, df = {}, tot = 0;
      if (!PROXY && kb.proxy) PROXY = String(kb.proxy);
      (kb.tickers || []).forEach(function (t) { TICK[t.toLowerCase()] = t; });
      IDX = kb.chunks.map(function (c) {
        var f = " " + toks((c.h || "") + " " + (c.h || "") + " " + c.t + " " + (c.s || "")).join(" ") + " ";
        var tf = {}, ws = f.trim().split(" ");
        ws.forEach(function (w) { tf[w] = (tf[w] || 0) + 1; });
        Object.keys(tf).forEach(function (w) { df[w] = (df[w] || 0) + 1; });
        tot += ws.length;
        return { f: f, tf: tf, n: ws.length };
      });
      var avg = tot / Math.max(1, N);
      IDX.forEach(function (x) { x.avg = avg; });
      IDX.df = df; IDX.N = N;
      return kb;
    });
    return loading;
  }
  function idf(w) { var d = IDX.df[w] || 0; return Math.log(1 + (IDX.N - d + 0.5) / (d + 0.5)); }
  function days(a, b) { if (!a || !b) return 0; return Math.max(0, (Date.parse(b) - Date.parse(a)) / 864e5); }

  var VNSYL = {};
  ("nga ban mua tin gia cao sao hai lai dau the tot xau hoa nam bao tai vay len hon ngo con cho mot hai tam tuy tre ton xin dan dau dien gom vua nho dot").split(" ").forEach(function (w) { VNSYL[w] = 1; });
  function tickersIn(q) {
    var out = {};
    (q.match(/(^|[^A-Za-z0-9])([A-Z][A-Z0-9]{2})(?=[^A-Za-z0-9]|$)/g) || []).forEach(function (m) { var t = m.replace(/[^A-Z0-9]/g, ""); if (TICK[t.toLowerCase()]) out[t] = 1; });
    (q.match(/[A-Za-z0-9]{3}(?![\w\u00C0-\u1EF9])/g) || []).forEach(function (raw) {
      var w = raw.toLowerCase();
      if (raw === raw.toUpperCase()) return;                       // viet hoa da xet o tren
      if (TICK[w] && !STOP[w] && !VNSYL[w] && !/^[A-Z][a-z]{2}$/.test(raw)) out[TICK[w]] = 1;   // "Nga", "Bao" viet hoa chu dau la ten rieng, khong phai ma
    });
    return Object.keys(out);
  }

  function search(q) {
    var all = qterms(q), terms = [], seen = {};
    /* Hỏi tin mới (có gì mới, mới nhất, hôm nay, gần đây): ưu tiên mạnh đoạn của bản tin mới nhất, "mới" không tính là từ khóa. */
    var fq = " " + all.join(" ") + " ", newsy = /\s(moi nhat|co gi moi|gi moi|hom nay|gan day|vua roi|cap nhat|dien bien)\s/.test(fq) || /\smoi\s*$/.test(fq);
    if (newsy) all = all.filter(function (w) { return w !== "moi" && w !== "nhat"; });
    all.forEach(function (w) { if ((!STOP[w] || KEEP[w]) && !seen[w] && (w.length > 1 || /\d/.test(w))) { seen[w] = 1; terms.push(w); } });
    var real = terms.filter(function (w) { return !KEEP[w] || all.length < 3; });
    var bigr = [];
    for (var i = 0; i + 1 < all.length; i++) if (!(STOP[all[i]] && STOP[all[i + 1]])) bigr.push(" " + all[i] + " " + all[i + 1] + " ");
    var tk = tickersIn(q), k1 = 1.2, b = 0.72, res = [], wsum = 0, mq = macroQ(q);
    real.forEach(function (w) { wsum += idf(w); });
    KB.chunks.forEach(function (c, i) {
      var x = IDX[i], s = 0, hit = 0, wh = 0, bh = 0;
      real.forEach(function (w) {
        var f = x.tf[w], ww = w;
        if (!f && ALT[w]) ALT[w].some(function (a) { if (x.tf[a]) { f = x.tf[a]; ww = a; return true; } });
        if (!f) return; hit++; wh += idf(w);
        s += idf(ww) * f * (k1 + 1) / (f + k1 * (1 - b + b * x.n / x.avg));
      });
      if (!hit) return;
      bigr.forEach(function (g) { if (x.f.indexOf(g) >= 0) { s += 1.4; bh++; } });
      s *= (c.w || 1);
      if (mq && c.ty === "vimo") s *= 1.6;                        // hỏi vĩ mô: ưu tiên Báo cáo vĩ mô TVN
      var dd = days(c.d, KB.built); s *= newsy ? Math.max(0.25, 1 - 0.25 * dd) : Math.max(0.55, 1 - 0.035 * dd);
      if (tk.length) {
        var has = tk.some(function (t) { return c.tk === t || (c.tks && c.tks.indexOf(t) >= 0); });
        if (!has) s *= 0.22; else if (c.ty === "reco" && tk.indexOf(c.tk) >= 0) s *= 1.7;
      }
      res.push({ c: c, s: s, cov: real.length ? hit / real.length : 0, cw: wsum ? wh / wsum : 0, bh: bh });
    });
    res.sort(function (a, b) { return b.s - a.s; });
    return { terms: real, tk: tk, res: res, nb: bigr.length };
  }

  function sentences(c, terms, tk) {
    if (c.ty === "faq" || c.ty === "reco" || c.t.length <= 220) return c.t;
    var ss = c.t.split(/(?<=[.;!?])\s+|\s·\s/).filter(function (x) { return x.trim().length > 2; });
    var sc = ss.map(function (x, i) {
      var f = " " + toks(x).join(" ") + " ", v = 0;
      terms.forEach(function (w) { if (f.indexOf(" " + w + " ") >= 0) v += 1; });
      tk.forEach(function (t) { if (x.indexOf(t) >= 0) v += 2; });
      return { i: i, v: v, x: x };
    });
    var top = sc.slice().sort(function (a, b) { return b.v - a.v || a.i - b.i; }).filter(function (o) { return o.v > 0; }).slice(0, 3);
    if (!top.length) return c.t.slice(0, 420) + "…";
    top.sort(function (a, b) { return a.i - b.i; });
    var out = "", last = -2;
    top.forEach(function (o) { var piece = o.x.trim(); out += (out ? (o.i === last + 1 ? " " : " … ") : "") + piece; last = o.i; });
    return out.length > 560 ? out.slice(0, 560).replace(/\s\S*$/, "") + "…" : out;
  }

  /* ---------- giao diện ---------- */
  var CSS = "" +
    "#tvnqa-b,#tvnqa-p{--qn:#16294A;--qn2:#0F1E38;--qg:#C8992F;--qg2:#E3C070;--qbg:#FFFFFF;--qsf:#F4F6FA;--qink:#0E1A2B;--qmu:#5B6B85;--qln:#E3E7EF;--qme:#EAF0FA;" +
    "font-family:'Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased}" +
    "@media (prefers-color-scheme:dark){html:not([data-theme=light]) #tvnqa-b,html:not([data-theme=light]) #tvnqa-p{--qbg:#111B2D;--qsf:#0B1424;--qink:#E8EDF6;--qmu:#9FB0CC;--qln:#22314C;--qme:#1B2B49}}" +
    "html[data-theme=dark] #tvnqa-b,html[data-theme=dark] #tvnqa-p{--qbg:#111B2D;--qsf:#0B1424;--qink:#E8EDF6;--qmu:#9FB0CC;--qln:#22314C;--qme:#1B2B49}" +
    "#tvnqa-b{position:fixed;right:14px;bottom:calc(var(--qbot,16px) + env(safe-area-inset-bottom,0px));z-index:59;display:flex;align-items:center;gap:7px;height:40px;padding:0 14px 0 11px;" +
    "border-radius:20px;border:1px solid rgba(227,192,112,.55);background:linear-gradient(135deg,#1C3460,#13213B);color:#fff;font-size:13px;font-weight:600;letter-spacing:.2px;cursor:pointer;" +
    "box-shadow:0 6px 18px rgba(8,16,32,.28),0 0 0 3px rgba(200,153,47,.10);transition:transform .18s,box-shadow .18s,opacity .2s;-webkit-tap-highlight-color:transparent}" +
    "#tvnqa-b:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(8,16,32,.32),0 0 0 4px rgba(200,153,47,.16)}" +
    "#tvnqa-b:focus-visible{outline:2px solid var(--qg2);outline-offset:2px}" +
    "#tvnqa-b svg{width:18px;height:18px;flex:none}#tvnqa-b .q-dot{width:6px;height:6px;border-radius:50%;background:var(--qg2);box-shadow:0 0 0 3px rgba(227,192,112,.18)}" +
    "#tvnqa-b.q-mini{width:40px;padding:0;justify-content:center}#tvnqa-b.q-mini span{display:none}" +
    "html.tvnqa-open #tvnqa-b{opacity:0;pointer-events:none}" +
    "#tvnqa-p{position:fixed;z-index:2147483001;left:0;right:0;bottom:0;height:min(80vh,640px);height:min(80dvh,640px);display:flex;flex-direction:column;background:var(--qbg);color:var(--qink);" +
    "border-radius:18px 18px 0 0;box-shadow:0 -10px 40px rgba(8,16,32,.30);transform:translateY(105%);transition:transform .28s cubic-bezier(.2,.8,.2,1);overflow:hidden}" +
    "html.tvnqa-open #tvnqa-p{transform:none}" +
    "@media (min-width:640px){#tvnqa-p{left:auto;right:18px;bottom:18px;width:380px;height:min(600px,calc(100vh - 36px));border-radius:16px;box-shadow:0 18px 50px rgba(8,16,32,.32);transform:translateY(16px) scale(.98);opacity:0;pointer-events:none;transition:transform .22s,opacity .22s}" +
    "html.tvnqa-open #tvnqa-p{transform:none;opacity:1;pointer-events:auto}}" +
    "#tvnqa-p,#tvnqa-p *{box-sizing:border-box}" +
    "#tvnqa-p p,#tvnqa-p div,#tvnqa-p span,#tvnqa-p a,#tvnqa-p b,#tvnqa-p small,#tvnqa-p button,#tvnqa-p textarea,#tvnqa-b span{font-family:'Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif!important;text-align:left;font-style:normal;max-width:none;hyphens:manual;text-indent:0}" +
    "#tvnqa-p p{font-size:14px;line-height:1.55;color:inherit;margin:0 0 6px;padding:0}" +
    "#tvnqa-p textarea::placeholder{color:var(--qmu);opacity:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#tvnqa-p .q-hd{flex:none;display:flex;align-items:center;gap:10px;padding:12px 12px 12px 14px;background:linear-gradient(135deg,#1C3460,#13213B);color:#fff;border-bottom:2px solid var(--qg)}" +
    "#tvnqa-p .q-mk{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(227,192,112,.14);border:1px solid rgba(227,192,112,.5);flex:none}" +
    "#tvnqa-p .q-mk svg{width:17px;height:17px}" +
    "#tvnqa-p .q-tt{flex:1;min-width:0}#tvnqa-p .q-tt b{display:block;font-size:14px;font-weight:700;letter-spacing:.2px}#tvnqa-p .q-tt small{display:block;font-size:11px;color:var(--qg2);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#tvnqa-p .q-x{width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.08);color:#fff;font-size:20px;line-height:1;cursor:pointer;display:grid;place-items:center}" +
    "#tvnqa-p .q-x:hover{background:rgba(255,255,255,.16)}" +
    "#tvnqa-p .q-bd{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:14px 14px 6px;background:var(--qsf);display:flex;flex-direction:column;gap:10px}" +
    "#tvnqa-p .q-m{max-width:92%;font-size:14px;line-height:1.55;word-wrap:break-word}" +
    "#tvnqa-p .q-me{align-self:flex-end;background:var(--qn);color:#fff;padding:8px 12px;border-radius:14px 14px 4px 14px}" +
    "#tvnqa-p .q-bot{align-self:flex-start;background:var(--qbg);border:1px solid var(--qln);padding:10px 12px;border-radius:14px 14px 14px 4px}" +
    "#tvnqa-p .q-bot p{margin:0 0 6px}#tvnqa-p .q-bot p:last-child{margin:0}" +
    "#tvnqa-p .q-tag{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;padding:2px 8px;border-radius:10px;margin-bottom:6px}" +
    "#tvnqa-p .q-tag.q-kb{color:#8A6514;background:rgba(200,153,47,.14);border:1px solid rgba(200,153,47,.4)}" +
    "#tvnqa-p .q-tag.q-ai{color:var(--qmu);background:transparent;border:1px solid var(--qln)}" +
    "@media (prefers-color-scheme:dark){html:not([data-theme=light]) #tvnqa-p .q-tag.q-kb{color:var(--qg2)}}html[data-theme=dark] #tvnqa-p .q-tag.q-kb{color:var(--qg2)}" +
    "#tvnqa-p .q-src{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}" +
    "#tvnqa-p .q-src a,#tvnqa-p .q-src span{font-size:11.5px;color:var(--qmu);text-decoration:none;border:1px solid var(--qln);border-radius:12px;padding:2px 9px;background:var(--qsf)}" +
    "#tvnqa-p .q-tw{overflow-x:auto;margin:6px 0 8px}#tvnqa-p .q-tw table{border-collapse:collapse;font-size:13px;min-width:100%}" +
    "#tvnqa-p .q-tw th,#tvnqa-p .q-tw td{border-bottom:1px solid var(--qln);padding:5px 8px;text-align:left;vertical-align:top}#tvnqa-p .q-tw th{color:var(--qmu);font-weight:600}" +
    "#tvnqa-p .q-wait{font-size:12px;color:var(--qmu);margin-bottom:6px}" +
    "#tvnqa-p .q-bot>*{animation:qin .38s ease both}@keyframes qin{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}" +
    "@media (prefers-reduced-motion:reduce){#tvnqa-p .q-bot>*{animation:none}}" +
    "#tvnqa-p p.q-hook{font-weight:600;color:var(--qn);font-size:15px;line-height:1.5}" +
    "@media (prefers-color-scheme:dark){html:not([data-theme=light]) #tvnqa-p p.q-hook{color:var(--qg2)}}html[data-theme=dark] #tvnqa-p p.q-hook{color:var(--qg2)}" +
    "#tvnqa-p .q-kl{display:flex;gap:9px;align-items:flex-start;margin:8px 0 10px;padding:10px 12px;border-radius:10px;background:rgba(200,153,47,.10);border-left:3px solid var(--qg)}" +
    "#tvnqa-p .q-kl .q-ic{margin-top:2px}#tvnqa-p .q-klh{display:block;font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:#8A6514;margin-bottom:2px}" +
    "@media (prefers-color-scheme:dark){html:not([data-theme=light]) #tvnqa-p .q-klh{color:var(--qg2)}}html[data-theme=dark] #tvnqa-p .q-klh{color:var(--qg2)}" +
    "#tvnqa-p .q-h{display:flex;align-items:center;gap:7px;margin:12px 0 4px;font-weight:700;font-size:13.5px;color:var(--qink)}" +
    "#tvnqa-p .q-ic{width:16px;height:16px;flex:0 0 16px;fill:none;stroke:var(--qg);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}" +
    "#tvnqa-p ul.q-ul{margin:2px 0 6px;padding:0;list-style:none}#tvnqa-p ul.q-ul li{position:relative;padding:3px 0 3px 16px;line-height:1.5}" +
    "#tvnqa-p ul.q-ul li::before{content:'';position:absolute;left:3px;top:.72em;width:6px;height:6px;border-radius:50%;background:var(--qg)}" +
    "#tvnqa-p .q-o, #tvnqa-p .q-o li{color:var(--qmu);font-size:13.5px}" +
    "#tvnqa-p p.q-out{margin-top:8px;padding:6px 0 6px 10px;border-left:2px solid var(--qln);color:var(--qmu);font-size:13.5px}" +
    "#tvnqa-p .q-src .q-cc{border:0;background:transparent;padding:2px 0;font-weight:600}" +
    "#tvnqa-p .q-sug{margin-top:8px;max-width:100%;overflow-x:auto}" +
    "#tvnqa-p .q-src a:hover{color:var(--qink);border-color:var(--qg)}" +
    "#tvnqa-p .q-more{margin-top:8px;display:flex;flex-wrap:wrap;gap:8px}" +
    "#tvnqa-p .q-more button{font:inherit;font-size:12px;font-weight:600;color:var(--qn);background:transparent;border:1px solid var(--qg);border-radius:14px;padding:4px 10px;cursor:pointer}" +
    "@media (prefers-color-scheme:dark){html:not([data-theme=light]) #tvnqa-p .q-more button{color:var(--qg2)}}html[data-theme=dark] #tvnqa-p .q-more button{color:var(--qg2)}" +
    "#tvnqa-p .q-rel{margin-top:8px;padding-top:8px;border-top:1px dashed var(--qln);font-size:13px;color:var(--qmu)}#tvnqa-p .q-rel div{margin:0 0 6px}" +
    "#tvnqa-p .q-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}" +
    "#tvnqa-p .q-chips button{font:inherit;font-size:12.5px;color:var(--qink);background:var(--qbg);border:1px solid var(--qln);border-radius:16px;padding:6px 11px;cursor:pointer;text-align:left}" +
    "#tvnqa-p .q-chips button:hover{border-color:var(--qg)}" +
    "#tvnqa-p .q-typ{display:inline-flex;gap:4px;padding:4px 0}#tvnqa-p .q-typ i{width:6px;height:6px;border-radius:50%;background:var(--qmu);opacity:.4;animation:tvnqa 1s infinite}" +
    "#tvnqa-p .q-typ i:nth-child(2){animation-delay:.15s}#tvnqa-p .q-typ i:nth-child(3){animation-delay:.3s}@keyframes tvnqa{50%{opacity:1;transform:translateY(-2px)}}" +
    "#tvnqa-p .q-ft{flex:none;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px));background:var(--qbg);border-top:1px solid var(--qln)}" +
    "#tvnqa-p form{display:flex;align-items:flex-end;gap:8px;margin:0}" +
    "#tvnqa-p textarea{flex:1;min-width:0;resize:none;max-height:160px;min-height:40px;box-sizing:border-box;font:inherit;font-size:16px;line-height:1.4;color:var(--qink);background:var(--qsf);" +
    "border:1px solid var(--qln);border-radius:20px;padding:9px 14px;outline:none}#tvnqa-p textarea:focus{border-color:var(--qg)}" +
    "#tvnqa-p .q-go{flex:none;width:40px;height:40px;border-radius:50%;border:0;background:var(--qg);color:#13213B;cursor:pointer;display:grid;place-items:center}" +
    "#tvnqa-p .q-go:disabled{opacity:.45;cursor:default}#tvnqa-p .q-go svg{width:18px;height:18px}" +
    "#tvnqa-p .q-note{font-size:10.5px;color:var(--qmu);text-align:center;margin:6px 4px 0}" +
    "#tvnqa-p a.lk{color:inherit;text-decoration:underline;text-decoration-color:var(--qg)}" +
    "#tvnqa-sh{position:fixed;inset:0;z-index:2147483000;background:rgba(8,14,26,.38);opacity:0;pointer-events:none;transition:opacity .2s}" +
    "html.tvnqa-open #tvnqa-sh{opacity:1;pointer-events:auto}@media (min-width:640px){#tvnqa-sh{display:none}}" +
    "@media print{#tvnqa-b,#tvnqa-p,#tvnqa-sh{display:none!important}}";

  var IC_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/><path d="M9.6 8.2a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.6-.8 1.1v.2" stroke="#E3C070"/><circle cx="12" cy="13.6" r=".4" fill="#E3C070" stroke="#E3C070"/></svg>';
  var IC_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function inl(x) {
    return esc(x).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/(https?:\/\/[^\s<)]+[^\s<.,;)])/g, '<a class="q-lk" href="$1" target="_blank" rel="noopener">$1</a>');
  }
  /* Biểu tượng cho tiêu đề đoạn trong câu trả lời (nét mảnh, màu vàng TVN). */
  var ICO = {
    kl: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    gia: '<path d="M3 17l5-5 4 4 8-8"/><path d="M14 8h6v6"/>',
    ro: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    kd: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    dg: '<path d="M12 3v18M5 7h14M7 7l-3 7a4 4 0 0 0 6 0zM17 7l-3 7a4 4 0 0 0 6 0z"/>',
    tien: '<path d="M4 7h13l-3-3M20 17H7l3 3"/>',
    mua: '<path d="M3 4h2l2 11h11l2-8H6"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
    lam: '<path d="M3 20V9l5 3V9l5 3V9l5 3V5h3v15z"/>',
    huong: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 11a3 3 0 1 0 0-6M21 20c0-2.6-1.6-4.8-4-5.6"/>',
    lich: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    ai: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    dot: '<path d="M12 6l6 6-6 6-6-6z"/>'
  };
  function icoFor(h) {
    var f = fold(h);
    var k = /ket luan|tom lai/.test(f) ? "kl" : /nguong|rui ro|bao ve|canh bao/.test(f) ? "ro" : /vung gia|gia dang|xu huong|ky thuat|nen lam gi|hanh dong/.test(f) ? "gia" :
      /kinh doanh|loi nhuan|doanh thu|tai chinh/.test(f) ? "kd" : /dat hay re|dinh gia|gia tri/.test(f) ? "dg" : /tien lon|dong tien|khoi ngoai|tu doanh/.test(f) ? "tien" :
      /ai mua/.test(f) ? "mua" : /ai lam ra|san xuat|nganh/.test(f) ? "lam" : /ai duoc huong|nguoi lao dong|nha dau tu/.test(f) ? "huong" :
      /quy iv|kich ban|theo doi|moc|lich/.test(f) ? "lich" : /ngoai bao cao/.test(f) ? "ai" : "dot";
    return '<svg class="q-ic" viewBox="0 0 24 24" aria-hidden="true">' + ICO[k] + "</svg>";
  }
  /* Định dạng câu trả lời AI: câu hook, khung Kết luận, tiêu đề có biểu tượng, gạch đầu dòng, bảng; các khối hiện dần. */
  function rich(s, plain) {
    s = String(s).replace(/\r/g, "").replace(/^\s*#{1,6}\s*(.+?)\s*#*\s*$/gm, "\n**$1**").replace(/^\s*(-{3,}|\*{3,}|_{3,})\s*$/gm, "");
    var lines = s.trim().split("\n"), blocks = [], para = [], list = null, tb = [];
    function fp() { if (para.length) { blocks.push({ k: "p", t: para.join("\n") }); para = []; } }
    function fl() { if (list) { blocks.push(list); list = null; } }
    function ft() { if (tb.length) { blocks.push({ k: "tb", rows: tb.slice() }); tb = []; } }
    lines.forEach(function (l) {
      var t = l.trim();
      if (!t) { fp(); fl(); ft(); return; }
      if (/^\|.*\|$/.test(t)) { fp(); fl(); tb.push(t); return; }
      ft();
      var hm = /^\*\*([^*]{2,70}?)\*\*\s*:?\s*$/.exec(t);
      if (hm) { fp(); fl(); blocks.push({ k: "h", t: hm[1].replace(/:$/, "") }); return; }
      var lm = /^(?:[-•*]|\d{1,2}[.)])\s+(.+)$/.exec(t);
      if (lm && !/^\*\*/.test(t)) { fp(); if (!list) list = { k: "ul", items: [] }; list.items.push(lm[1]); return; }
      if (list && /^\s{2,}/.test(l)) { list.items[list.items.length - 1] += " " + t; return; }
      fl(); para.push(t);
    });
    fp(); fl(); ft();
    var out = false, html = "", n = 0;
    blocks.forEach(function (b, i) {
      var cls = "", inner = "";
      if (b.k === "p" && /^(\*\*)?Ngoài báo cáo TVN/.test(b.t)) out = true;
      if (b.k === "h" && /^Ngoài báo cáo TVN/.test(b.t)) out = true;
      if (b.k === "h") { inner = '<div class="q-h' + (out ? " q-o" : "") + '">' + icoFor(b.t) + "<span>" + inl(b.t) + "</span></div>"; }
      else if (b.k === "ul") { inner = '<ul class="q-ul' + (out ? " q-o" : "") + '">' + b.items.map(function (x) { return "<li>" + inl(x) + "</li>"; }).join("") + "</ul>"; }
      else if (b.k === "tb") {
        var rows = b.rows.filter(function (l) { return !/^\|?\s*:?-{2,}/.test(l); }).map(function (l) { return l.replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); }); });
        inner = '<div class="q-tw"><table>' + rows.map(function (r, j) { return "<tr>" + r.map(function (c) { return (j ? "<td>" : "<th>") + inl(c) + (j ? "</td>" : "</th>"); }).join("") + "</tr>"; }).join("") + "</table></div>";
      } else {
        var t = b.t;
        if (/^\*\*\s*Kết luận/i.test(t) || /^Kết luận[^:]{0,30}:/i.test(t)) {
          var lab = "Kết luận", mm = /^\*\*\s*(Kết luận[^*:]*?)\s*:?\s*\*\*\s*:?\s*/i.exec(t) || /^(Kết luận[^:]{0,30}?)\s*:\s*/i.exec(t);
          if (mm) { lab = mm[1]; t = t.slice(mm[0].length); }
          inner = '<div class="q-kl">' + icoFor("Kết luận") + '<div><b class="q-klh">' + esc(lab) + "</b>" + inl(t).replace(/\n/g, "<br>") + "</div></div>";
        }
        else if (i === 0 && !plain && blocks.length >= 3 && t.length < 320 && !/^\*\*/.test(t)) inner = '<p class="q-hook">' + inl(t).replace(/\n/g, "<br>") + "</p>";
        else inner = '<p class="' + (out ? "q-out" : "") + '">' + inl(t).replace(/\n/g, "<br>") + "</p>";
      }
      html += inner.replace(/^<(\w+)/, '<$1 style="animation-delay:' + Math.min(n++ * 70, 900) + 'ms"');
    });
    return html;
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var btn, pan, body, ta, go, sub, busy = false, opened = false;

  function build() {
    var st = el("style"); st.textContent = CSS; document.head.appendChild(st);
    btn = el("button", "", IC_CHAT + "<span>Hỏi TVN</span>");
    btn.id = "tvnqa-b"; btn.type = "button"; btn.setAttribute("aria-label", "Hỏi đáp TVN Insight"); btn.setAttribute("aria-haspopup", "dialog");
    var sh = el("div"); sh.id = "tvnqa-sh";
    pan = el("div", "", '<div class="q-hd"><span class="q-mk">' + IC_CHAT + '</span><span class="q-tt"><b>Hỏi đáp TVN Insight</b><small>Trả lời từ bản tin TVN</small></span>' +
      '<button class="q-x" type="button" aria-label="Đóng">×</button></div><div class="q-bd" aria-live="polite"></div>' +
      '<div class="q-ft"><form><textarea rows="1" maxlength="' + Q_MAX + '" placeholder="Nhập câu hỏi…" aria-label="Câu hỏi"></textarea>' +
      '<button class="q-go" type="submit" aria-label="Gửi" disabled>' + IC_SEND + '</button></form>' +
      '<div class="q-note">Không nhập thông tin cá nhân. Thông tin tham khảo, không phải lời mời mua bán chứng khoán.</div></div>');
    pan.id = "tvnqa-p"; pan.setAttribute("role", "dialog"); pan.setAttribute("aria-label", "Hỏi đáp TVN Insight"); pan.setAttribute("aria-modal", "false");
    document.body.appendChild(btn); document.body.appendChild(sh); document.body.appendChild(pan);
    body = pan.querySelector(".q-bd"); ta = pan.querySelector("textarea"); go = pan.querySelector(".q-go"); sub = pan.querySelector(".q-tt small");
    btn.addEventListener("click", open);
    sh.addEventListener("click", close);
    pan.querySelector(".q-x").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && opened) close(); });
    ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(160, ta.scrollHeight) + "px"; go.disabled = !ta.value.trim() || busy; });
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } });
    pan.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); send(); });
    place(); setTimeout(place, 700); setTimeout(place, 2500);
    setInterval(vimoCheck, 1200); window.addEventListener("resize", debounce(place, 250));
    var lastY = 0;
    window.addEventListener("scroll", debounce(function () { var y = window.scrollY; btn.classList.toggle("q-mini", y > lastY + 4 && y > 300); lastY = y; }, 60), { passive: true });
  }
  function debounce(f, ms) { var t; return function () { clearTimeout(t); t = setTimeout(f, ms); }; }

  /* Đặt nút ngay trên thanh cố định ở đáy màn hình (thanh mục, trình nghe) nếu trang có. */
  function place() {
    var vh = window.innerHeight, vw = window.innerWidth, inset = 16;
    [[vw - 30, vh - 4], [vw / 2, vh - 4], [30, vh - 4], [vw - 30, vh - 30]].forEach(function (pt) {
      var list = document.elementsFromPoint ? document.elementsFromPoint(pt[0], pt[1]) : [];
      for (var i = 0; i < list.length; i++) {
        for (var n = list[i]; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
          if (n === btn || n === pan || n.id === "tvnqa-sh" || n.id === "tvnwm") break;
          var cs = getComputedStyle(n);
          if (cs.position === "fixed" || cs.position === "sticky") {
            var r = n.getBoundingClientRect();
            if (r.height >= 20 && r.height < vh * 0.4 && r.width >= vw * 0.45 && vh - r.bottom < 24 && cs.pointerEvents !== "none" && cs.visibility !== "hidden")
              inset = Math.max(inset, vh - r.top + 10);
            break;
          }
        }
      }
    });
    btn.style.setProperty("--qbot", Math.round(inset) + "px");
  }

  /* Tab Vĩ mô nhúng web app TVN Vĩ mô (đã có ô hỏi đáp riêng, dùng chung trạm): đang xem thì ẩn nút để chỉ còn một chỗ hỏi. */
  function vimoCheck() {
    var on = false, fr = document.querySelectorAll("iframe");
    for (var i = 0; i < fr.length; i++) {
      if (!/\/vimo\b/.test(fr[i].src || "")) continue;
      var r = fr[i].getBoundingClientRect();
      if (r.width > 0 && r.height > window.innerHeight * 0.4 && r.bottom > 0 && r.top < window.innerHeight && getComputedStyle(fr[i]).visibility !== "hidden") { on = true; break; }
    }
    btn.style.display = on ? "none" : "";
  }

  function scroll() { body.scrollTop = body.scrollHeight; }
  function add(cls, html) { var m = el("div", "q-m q-" + cls, html); body.appendChild(m); scroll(); return m; }

  /* Gợi ý câu hỏi theo bản tin mới nhất: hai câu "Vì sao" của bản tin gần nhất, một mã trong bảng khuyến nghị, kịch bản tuần tới, vĩ mô. */
  function suggestQs() {
    var cs = (KB && KB.chunks) || [], out = [], seen = {};
    var vs = cs.filter(function (c) { return /^Vì sao · /.test(c.h || "") && c.d; }).sort(function (a, b) { return String(b.d).localeCompare(String(a.d)); });
    vs.forEach(function (c) {
      if (out.length >= 2) return;
      var t = c.h.split(" · ")[1].replace(/[.…,;:]+$/, "").trim();
      if (t.length > 72) t = t.slice(0, 72).replace(/\s\S*$/, "");
      var q = "Vì sao " + t.charAt(0).toLowerCase() + t.slice(1) + "?";
      if (!seen[q]) { seen[q] = 1; out.push(q); }
    });
    var rc = cs.filter(function (c) { return c.ty === "reco" && c.tk; }).sort(function (a, b) { return String(b.d).localeCompare(String(a.d)); })[0];
    if (rc) out.push("Đánh giá cổ phiếu " + rc.tk);
    out.push("Kịch bản VN-Index tuần tới?", "TVN nhận định GDP quý III thế nào?");
    return out.slice(0, 5);
  }
  function welcome() {
    if (KB && KB.built) sub.textContent = "Theo bản tin TVN đến " + KB.built.slice(8, 10) + "/" + KB.built.slice(5, 7);
    var m = add("bot", "<p>Chào anh chị. Hỏi TVN về thị trường, cổ phiếu, ngành, vĩ mô hay thế giới; câu trả lời dựa trên bản tin và báo cáo TVN mới nhất. Gợi ý hôm nay:</p>");
    var ch = el("div", "q-chips");
    var qs = suggestQs();
    qs.forEach(function (q) { var b = el("button", "", esc(q)); b.type = "button"; b.addEventListener("click", function () { ask(q); }); ch.appendChild(b); });
    m.appendChild(ch);
  }

  function open() {
    if (!opened) {
      opened = true;
      var w = add("bot", '<span class="q-typ"><i></i><i></i><i></i></span>');
      load().then(function () { w.remove(); welcome(); }, function () { w.remove(); add("bot", "<p>Chưa tải được dữ liệu bản tin. Anh chị thử lại sau ít phút.</p>"); });
    }
    document.documentElement.classList.add("tvnqa-open");
    setTimeout(function () { if (window.matchMedia("(min-width:640px)").matches) ta.focus(); }, 260);
  }
  function close() { document.documentElement.classList.remove("tvnqa-open"); btn.focus({ preventScroll: true }); }

  function send() { var q = ta.value.trim(); if (!q || busy) return; ta.value = ""; ta.style.height = "auto"; go.disabled = true; ask(q); }

  function srcChip(c, sec) {
    var raw = c.s + (sec && c.h && c.ty !== "faq" ? " · " + c.h : "");
    var lab = esc(raw.length > 58 ? raw.slice(0, 56).replace(/\s\S*$/, "") + "…" : raw);
    if (c.u) return '<a href="' + esc(/^https?:/.test(c.u) ? c.u : ROOT + c.u) + '" target="_blank" rel="noopener">' + lab + " ›</a>";
    return "<span>" + lab + "</span>";
  }

  var hist = [];
  function ask(q) {
    q = q.slice(0, Q_MAX);
    add("me", esc(q));
    var wait = add("bot", '<span class="q-typ"><i></i><i></i><i></i></span>');
    busy = true;
    load().then(function () {
      var f = fold(q).trim();
      if (/^(xin chao|chao|hello|hi|alo|hey)\b/.test(f) && f.split(/\s+/).length <= 4) {
        wait.innerHTML = "<p>Chào anh chị. Anh chị cần tìm gì trong bản tin TVN: diễn biến thị trường, khuyến nghị một mã cổ phiếu, chính sách hay lịch sự kiện?</p>";
        return done();
      }
      /* Câu hỏi nối tiếp ngắn ("còn gì nữa", "thì sao"...): tìm theo câu hỏi trước cộng câu này, và để trợ lý AI nói thêm ý mới. */
      var core = f.replace(/\b(con gi nua|con gi|gi nua|thi sao|the con|cu the hon|chi tiet hon|noi them|them nua|vay|nua|a|nhe|khong|ko)\b/g, " ").replace(/\s+/g, " ").trim();
      var follow = hist.length > 0 && core.split(" ").filter(function (w) { return w.length > 1; }).length < 3;
      var r = search(follow ? hist[hist.length - 1].q + " " + q : q), best = r.res[0];
      /* Câu hỏi dài, nhiều ý (từ 2 dấu hỏi hoặc trên 120 ký tự): để trợ lý AI trả lời đủ từng ý thay vì một đoạn bản tin. */
      var longQ = q.length > 120 || (q.match(/\?/g) || []).length >= 2 || /\n/.test(q);
      if ((follow || longQ) && PROXY) return ai(wait, q, r, false).then(done, done);
      /* Câu hỏi cần đánh giá, giải thích (vì sao, đánh giá, triển vọng, có nên...): trợ lý AI tổng hợp từ đúng các đoạn bản tin TVN liên quan. */
      var why = /\b(vi sao|tai sao|giai thich|nghia la|la gi|co nen|nen mua|nen ban|nen giu|the nao|ra sao|y nghia|anh huong|tac dong|dan den|do dau|danh gia|phan tich|nhan dinh|trien vong|co tot|tot khong|xau khong|rui ro|co hoi|so sanh|tom tat|tong hop)\b/.test(f);
      var strong = best && (
        (r.tk.length === 1 && best.c.ty === "reco" && r.tk.indexOf(best.c.tk) >= 0 && (!why || !PROXY)) ||
        (best.c.ty === "faq" && best.cw >= 0.55 && best.s >= 2.5) ||
        (!PROXY && best.cw >= 0.7 && best.s >= 3.2));   // có trợ lý AI thì mọi câu (trừ hỏi đáp có sẵn và khuyến nghị đúng một mã) đều qua AI, AI dùng các đoạn bản tin TVN làm căn cứ trước   // câu hỏi "vì sao, có nên": trợ lý AI giải thích dựa trên đúng các đoạn bản tin
      if (PROXY) return ai(wait, q, r, false).then(done, done);   // như chatbot: mọi câu hỏi đều được trợ lý AI trả lời ngay, không phải bấm nút
      if (strong) { local(wait, q, r); return done(); }
      return ai(wait, q, r, false).then(done, done);
    }, function () { wait.innerHTML = "<p>Chưa tải được dữ liệu bản tin. Anh chị thử lại sau ít phút.</p>"; done(); });
  }
  function done() { busy = false; go.disabled = !ta.value.trim(); scroll(); }

  function local(box, q, r) {
    var best = r.res[0], c = best.c, txt = sentences(c, r.terms, r.tk);
    var h = '<span class="q-tag q-kb">Từ bản tin TVN</span>' + rich(txt, true) + '<div class="q-src">' + srcChip(c, true) + "</div>";
    var rel = [], used = {}; used[c.s + c.h + c.t.slice(0, 40)] = 1;
    for (var i = 1; i < r.res.length && rel.length < 2; i++) {
      var o = r.res[i]; if (o.cov < 0.5 || o.s < best.s * 0.45) break;
      var k = o.c.s + o.c.h + o.c.t.slice(0, 40); if (used[k]) continue; used[k] = 1; rel.push(o);
    }
    box.innerHTML = h;
    var more = el("div", "q-more");
    if (rel.length) {
      var b1 = el("button", "", "Xem thêm " + rel.length + " đoạn liên quan"); b1.type = "button";
      b1.addEventListener("click", function () {
        b1.remove();
        var d = el("div", "q-rel", rel.map(function (o) { return "<div>" + esc(sentences(o.c, r.terms, r.tk)) + '</div><div class="q-src">' + srcChip(o.c, true) + "</div>"; }).join(""));
        box.insertBefore(d, more); scroll();
      });
      more.appendChild(b1);
    }
    if (PROXY) {
      var b2 = el("button", "", "Giải thích thêm"); b2.type = "button";
      b2.addEventListener("click", function () {
        if (busy) return; more.remove(); busy = true; go.disabled = true;
        var w = add("bot", '<span class="q-typ"><i></i><i></i><i></i></span>');
        ai(w, q, r, true).then(done, done);
      });
      more.appendChild(b2);
    }
    if (more.childNodes.length && !PROXY) box.appendChild(more);   // có trợ lý AI thì không hiện nút phụ
    hist.push({ q: q, a: txt });
  }

  function quota() {
    var k = "tvnqa:" + new Date().toISOString().slice(0, 10), n = 0;
    try { n = +localStorage.getItem(k) || 0; } catch (e) { }
    return { n: n, inc: function () { try { localStorage.setItem(k, String(n + 1)); } catch (e) { } } };
  }
  function uid() {
    var u = "";
    try { u = localStorage.getItem("tvnqa:id") || ""; if (!u) { u = Math.random().toString(36).slice(2, 12); localStorage.setItem("tvnqa:id", u); } } catch (e) { u = "anon"; }
    return u;
  }

  /* Ẩn số điện thoại, thư điện tử, số tài khoản trước khi gửi trợ lý AI (nguyên tắc xác minh TVN, Phần IV.7). */
  function redact(t) {
    return String(t).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[đã ẩn]")
      .replace(/(^|[^\d.,])\d{9,}(?![\d.,]\d)/g, function (m, p) { return p + "[đã ẩn]"; })
      .replace(/(\+?84|0)[\s.-]?\d{2,3}[\s.-]?\d{3}[\s.-]?\d{3,4}/g, "[đã ẩn]");
  }

  function fallback(box, why, q) {
    box.innerHTML = '<span class="q-tag q-kb">TVN</span>' +
      "<p>" + (why || "Bản tin TVN hiện chưa đề cập nội dung này.") + " Anh chị có thể hỏi trực tiếp qua nhóm Zalo TVN hoặc hotline " + HOT + ".</p>" +
      '<div class="q-src">' + (q ? vimoChip(q) : "") + '<a href="' + ZALO + '" target="_blank" rel="noopener">Nhóm Zalo TVN ›</a><a href="tel:0936090649">Gọi ' + HOT + "</a></div>";
  }

  function ai(box, q, r, expand, again) {
    if (!PROXY) { fallback(box, undefined, q); return Promise.resolve(); }
    var qu = quota();
    if (qu.n >= AI_DAY) { fallback(box, "Hôm nay anh chị đã dùng hết " + AI_DAY + " lượt hỏi trợ lý AI.", q); return Promise.resolve(); }
    var ctx = [], tot = 0, seen = {};
    /* Hỏi một hay nhiều mã: luôn gửi kèm khuyến nghị mới nhất của TỪNG mã (nếu TVN có), để AI không bỏ sót mã nào. */
    /* Hỏi vĩ mô, GDP: kết luận chính và các kết luận của Báo cáo vĩ mô TVN luôn đi đầu, để AI trả lời theo đúng kết luận và cấu trúc của TVN. */
    if (macroQ(q)) {
      var vc = (KB.chunks || []).filter(function (c) { return c.ty === "vimo" && /^Kết luận/.test(c.h || ""); });
      var core = vc.filter(function (c) { return /^Kết luận chính/.test(c.h); })[0], kl = vc.filter(function (c) { return c !== core; });
      if (core) { seen[core.s + core.h + core.t.slice(0, 40)] = 1; tot += core.t.length; ctx.push({ s: core.s, h: "KẾT LUẬN CHÍNH CỦA TVN", d: core.d || "", t: core.t.slice(0, 1700), u: core.u || "" }); }
      if (kl.length) {
        var kt = kl.map(function (c, i) { seen[c.s + c.h + c.t.slice(0, 40)] = 1; return (i + 1) + ". " + c.t; }).join(" ").slice(0, 1780);
        tot += kt.length; ctx.push({ s: kl[0].s, h: "CÁC KẾT LUẬN CỦA TVN (theo thứ tự báo cáo)", d: kl[0].d || "", t: kt, u: kl[0].u || "" });
      }
    }
    (r.tk || []).slice(0, 6).forEach(function (t) {     // hồ sơ số liệu FireAnt của mã (giá, kỹ thuật, tài chính, định giá) đi đầu
      var hs = null;
      (KB.chunks || []).forEach(function (c) { if (c.ty === "hoso" && c.tk === t) hs = c; });
      if (hs) { seen[hs.s + hs.h + hs.t.slice(0, 40)] = 1; tot += hs.t.length; ctx.push({ s: hs.s, h: hs.h || "", d: hs.d || "", t: hs.t.slice(0, 1700), u: "" }); }
    });
    (r.tk || []).slice(0, 6).forEach(function (t) {
      var bestC = null;
      var rk = function (c) { return String(c.d || "") + (/^Chốt tuần/.test(c.s) ? "3" : /^Chốt phiên/.test(c.s) ? "2" : "1"); };
      (KB.chunks || []).forEach(function (c) { if (c.ty === "reco" && c.tk === t && (!bestC || rk(c) > rk(bestC))) bestC = c; });
      if (!bestC) return;
      var k = bestC.s + bestC.h + bestC.t.slice(0, 40); seen[k] = 1; tot += bestC.t.length;
      ctx.push({ s: bestC.s, h: bestC.h || "", d: bestC.d || "", t: bestC.t.slice(0, 1200), u: bestC.u || "" });
    });
    r.res.slice(0, 14).forEach(function (o) {
      if (ctx.length >= 12 || tot > 15000) return;
      var k = o.c.s + o.c.h + o.c.t.slice(0, 40); if (seen[k]) return; seen[k] = 1;
      var t = o.c.t.slice(0, 1200); tot += t.length;
      ctx.push({ s: o.c.s, h: o.c.h || "", d: o.c.d || "", t: t, u: o.c.u || "" });
    });
    var L = KB.latest || {};
    ["tuan", "sang", "phien"].forEach(function (e) { var x = L[e]; if (x && x.headline && ctx.length < 12) ctx.push({ s: x.s, h: "Tiêu đề", d: x.d, t: x.headline, u: x.u }); });
    var payload = { q: redact(q), ctx: ctx, hist: hist.slice(-4).map(function (h) { return { q: redact(h.q), a: h.a }; }), today: KB.built || "", uid: uid(), mode: expand ? "giai_thich" : "hoi", page: "bantin", the: (function () { try { return localStorage.getItem("tvn_the") || ""; } catch (e) { return ""; } })() };   /* v12: trạm kiểm gói TVN-Trading */
    var ctl = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (ctl) ctl.abort(); }, 120000);
    var body = JSON.stringify(payload);
    function call(n) {
      return fetch(PROXY, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body, signal: ctl ? ctl.signal : undefined })
        .then(function (res) { return res.text(); })
        .then(function (t) { return JSON.parse(t); })
        .catch(function (e) {
          if (n > 0 && !(ctl && ctl.signal.aborted)) return new Promise(function (ok) { setTimeout(ok, 1500); }).then(function () { return call(n - 1); });
          throw e;
        });
    }
    return call(1)
      .then(function (j) {
        clearTimeout(tm);
        if (!j || !j.ok || !j.a) {
          if (!again && j && j.e !== "off") return new Promise(function (ok) { setTimeout(ok, 2500); }).then(function () { return ai(box, q, r, expand, 1); });   // thử lại một lần
          var why = j && j.e === "quota" ? "Trợ lý AI đang hết lượt trong hôm nay." : "Trợ lý AI đang quá tải, anh chị hỏi lại sau ít phút.";
          if (r.tk && r.tk.length && tkLocal(box, r, why)) return;                        // hỏi mã: số liệu chính của mã và khuyến nghị TVN
          if (!expand && r.res[0] && r.res[0].cw >= 0.5) { local(box, q, r); box.insertAdjacentHTML("afterbegin", '<div class="q-wait">' + esc(why) + "</div>"); return; }
          fallback(box, why, q); return;
        }
        qu.inc();
        var used = {}, chips = [];
        (j.src || []).forEach(function (i) { var c = ctx[i]; if (!c) return; var k = c.s + c.h; if (used[k]) return; used[k] = 1; chips.push(srcChip(c, true)); });
        var none = /chưa đề cập/i.test(j.a) && !chips.length;
        if (none) chips = [vimoChip(q), '<a href="' + ZALO + '" target="_blank" rel="noopener">Hỏi qua nhóm Zalo TVN ›</a>', '<a href="tel:0936090649">Gọi ' + HOT + "</a>"];
        var outside = /Ngoài báo cáo TVN/.test(j.a);
        if (j.oos) { box.innerHTML = '<span class="q-tag q-kb">TVN</span>' + rich(j.a); hist.push({ q: q, a: "(ngoài phạm vi)" }); return; }   // câu ngoài phạm vi chứng khoán, kinh tế
        box.innerHTML = '<span class="q-tag q-ai">' + (outside ? "AI tham khảo · có phần ngoài báo cáo TVN" : "AI tham khảo · dựa trên bản tin TVN") + "</span>" + rich(j.a) +
          (chips.length ? '<div class="q-src">' + (none ? "" : '<span class="q-cc">Căn cứ</span>') + chips.filter(Boolean).slice(0, 4).join("") + "</div>" : "");
        if (j.sug) {                                   // gợi ý tìm kiếm Google: bắt buộc hiển thị khi câu trả lời dùng kết quả tra cứu
          try { var sg = el("div", "q-sug"); box.appendChild(sg); var sh = sg.attachShadow ? sg.attachShadow({ mode: "open" }) : sg; sh.innerHTML = String(j.sug); } catch (e) { }
        }
        hist.push({ q: q, a: String(j.a).replace(/\nNguồn tra cứu:[^\n]*/g, "").slice(0, 1200) });
      })
      .catch(function () {
        clearTimeout(tm);
        if (!again && !(ctl && ctl.signal.aborted)) return new Promise(function (ok) { setTimeout(ok, 2500); }).then(function () { return ai(box, q, r, expand, 1); });
        var why = "Chưa kết nối được trợ lý AI, anh chị hỏi lại sau ít phút.";
        if (r.tk && r.tk.length && tkLocal(box, r, why)) return;
        if (!expand && r.res[0] && r.res[0].cw >= 0.5) { local(box, q, r); box.insertAdjacentHTML("afterbegin", '<div class="q-wait">' + esc(why) + "</div>"); return; }
        fallback(box, why, q);
      });
  }

  /* Trợ lý AI lỗi khi hỏi mã cổ phiếu: tự viết vài câu từ hồ sơ số liệu FireAnt và khuyến nghị TVN, thay vì một dòng trích bản tin. */
  function vn(x, nd) { if (x == null || isNaN(x)) return "?"; return Number(x).toLocaleString("vi-VN", { maximumFractionDigits: nd == null ? 2 : nd, minimumFractionDigits: 0 }); }
  /* Câu hook từ số liệu thật của mã: nghịch lý giữa giá, định giá, lợi nhuận và dòng tiền. */
  function tkHook(t, x) {
    var down = x.m50 != null && x.m50 < 0, cheap = x.pe != null && x.pen != null && x.pe < x.pen;
    var lq = x.lnq || [], gr = lq.length >= 5 && lq[lq.length - 5][1] > 0 ? lq[lq.length - 1][1] / lq[lq.length - 5][1] - 1 : null;
    if (x.p250 > 30 && x.p20 < -3) return "**" + t + " tăng " + vn(x.p250, 0) + "% trong một năm nhưng mất " + vn(-x.p20, 1) + "% chỉ trong tháng qua: sóng lớn đang nghỉ hay đã hết?**";
    if (x.nn20 > 0 && x.p20 < 0) return "**Khối ngoại mua ròng " + vn(x.nn20, 0) + " tỷ trong 20 phiên, vậy mà giá " + t + " vẫn giảm " + vn(-x.p20, 1) + "%: ai đang bán cho họ?**";
    if (gr != null && gr > 0.3 && x.p20 < 0) return "**Lợi nhuận " + t + " tăng " + vn(gr * 100, 0) + "% so với cùng kỳ, nhưng giá lại đi xuống: thị trường đang lo điều gì phía trước?**";
    if (cheap && down) return "**" + t + " rẻ hơn ngành theo P/E, nhưng giá vẫn chưa ngừng giảm: rẻ chưa chắc đã là lúc mua.**";
    if (!cheap && x.pe != null && x.pen != null && !down) return "**" + t + " đắt hơn ngành mà giá vẫn giữ xu hướng tăng: thị trường đang trả thêm cho kỳ vọng nào?**";
    if (x.nn20 < 0 && x.p20 > 0) return "**Khối ngoại bán ròng " + vn(-x.nn20, 0) + " tỷ trong 20 phiên, nhưng giá " + t + " vẫn tăng " + vn(x.p20, 1) + "%: dòng tiền trong nước đang thấy gì?**";
    return "";
  }
  function tkLocal(box, r, why) {
    var parts = [], chips = [];
    r.tk.slice(0, 4).forEach(function (t) {
      var hs = null, rc = null;
      (KB.chunks || []).forEach(function (c) {
        if (c.ty === "hoso" && c.tk === t) hs = c;
        if (c.ty === "reco" && c.tk === t && (!rc || String(c.d || "") > String(rc.d || ""))) rc = c;
      });
      var x = hs && hs.x, ss = [];
      if (x) {
        var d = String(x.d || "").split("-").reverse().slice(0, 2).join("/");
        ss.push("Giá " + vn(x.g) + " nghìn đồng (phiên " + d + "), " + (x.p20 >= 0 ? "tăng " : "giảm ") + vn(Math.abs(x.p20), 1) + "% trong 1 tháng, " + (x.p250 >= 0 ? "tăng " : "giảm ") + vn(Math.abs(x.p250), 1) + "% trong 1 năm.");
        if (x.m50 != null && x.m200 != null) {
          var a50 = x.m50 >= 0, a200 = x.m200 >= 0;
          ss.push("Giá " + (a50 ? "trên" : "dưới") + " đường trung bình 50 phiên và " + (a200 ? "trên" : "dưới") + " đường 200 phiên: " +
            (a50 && a200 ? "xu hướng tăng còn giữ." : !a50 && a200 ? "đang điều chỉnh trong xu hướng tăng dài hạn." : a50 ? "đang hồi lên nhưng xu hướng dài hạn chưa đổi." : "xu hướng giảm.") +
            (x.rsi != null ? " Sức mạnh giá (RSI) " + vn(x.rsi, 0) + (x.rsi < 30 ? ", vùng bán quá mức." : x.rsi > 70 ? ", vùng mua quá mức." : ".") : ""));
        }
        if (x.pe != null) ss.push("P/E " + vn(x.pe, 1) + " lần" + (x.pen != null ? " (ngành " + vn(x.pen, 1) + "), " + (x.pe < x.pen ? "rẻ hơn ngành" : "đắt hơn ngành") : "") +
          (x.pb != null ? "; P/B " + vn(x.pb, 1) + (x.pbn != null ? " (ngành " + vn(x.pbn, 1) + ")" : "") : "") + (x.roe != null ? "; ROE " + vn(x.roe * (Math.abs(x.roe) < 1 ? 100 : 1), 1) + "%" : "") + ".");
        var lq = x.lnq || [];
        if (lq.length >= 5) { var a = lq[lq.length - 1], b = lq[lq.length - 5]; ss.push("Lợi nhuận " + a[0] + " đạt " + vn(a[1], 0) + " tỷ, " + (b[1] > 0 ? (a[1] >= b[1] ? "tăng " : "giảm ") + vn(Math.abs(a[1] / b[1] - 1) * 100, 0) + "% so với " + b[0] : "so với " + vn(b[1], 0) + " tỷ của " + b[0]) + "."); }
        if (x.nn20 != null) ss.push("20 phiên qua khối ngoại " + (x.nn20 >= 0 ? "mua" : "bán") + " ròng " + vn(Math.abs(x.nn20), 0) + " tỷ" + (x.td20 != null ? ", tự doanh " + (x.td20 >= 0 ? "mua" : "bán") + " ròng " + vn(Math.abs(x.td20), 0) + " tỷ" : "") + ".");
      }
      var hk = x ? tkHook(t, x) : "";
      if (rc) { ss.push("Khuyến nghị TVN: " + rc.t.replace(/^[A-Z0-9]{3}\s*[:·]\s*/, "")); chips.push(srcChip(rc, true)); }
      if (ss.length) parts.push((hk ? hk + "\n\n" : "") + "**" + t + (x && x.n ? " · " + x.n : "") + "**\n" + ss.join(" "));
    });
    if (!parts.length) return false;
    box.innerHTML = '<div class="q-wait">' + esc(why) + '</div><span class="q-tag q-kb">Số liệu TVN</span>' + rich(parts.join("\n\n")) +
      (chips.length ? '<div class="q-src">' + chips.slice(0, 4).join("") + "</div>" : "");
    hist.push({ q: "", a: parts.join(" ").slice(0, 1200) });
    return true;
  }

  function init() { if (document.getElementById("tvnqa-b")) return; build(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
