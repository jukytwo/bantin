(function () {
  /* TVN Insight · mở bán từng phần (anh Vũ duyệt 23/10/2026).
     Khách và tài khoản hết hạn: dùng phần miễn phí. Gói TVN-Trading (3 triệu đồng / 3 tháng): mở thêm theo quyền.
     Quyền: khuyen_nghi, tam_ly, luu_tru, hoi_dap_full, vi_mo_full (máy chủ tài khoản và tvn-auth.js do Vũ max giữ).
     Bản xem thử: chỉ bật khi mở trang với ?thu=1 (nhớ trong máy), tắt bằng ?thu=0. Trạng thái lấy từ thanh "Xem thử". */
  "use strict";
  if (window.__tvg) return; window.__tvg = 1;
  var LIVE = false;                                   /* 25/10/2026 anh Vũ cho mở lại toàn bộ để không ảnh hưởng người dùng; bật lại khi hoàn thiện */
  var LS = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  var q = location.search;
  if (/[?&]thu=1\b/.test(q)) LS("tvn_gate_thu", "1");
  if (/[?&]thu=0\b/.test(q)) { LS("tvn_gate_thu", null); LS("tvn_gate_mock", null); }
  var PREVIEW = LS("tvn_gate_thu") === "1";
  if (!LIVE && !PREVIEW) return;
  /* tvn-auth.js của máy chủ tài khoản (Vũ max, chạy từ 23:05 23/10/2026): chỉ nạp khi lớp khóa đang bật.
     data-dai="0": dùng dải thông báo của TVN Insight (anh Vũ đã duyệt); data-chip: nút tài khoản để ẩn, đăng nhập và đăng xuất qua dải. */
  var AUTH_SRC = "https://taikhoan.103-110-85-100.sslip.io/tvn-auth.js";
  if (!document.getElementById("tvg-acct")) { var ac0 = document.createElement("span"); ac0.id = "tvg-acct"; ac0.hidden = true; (document.body || document.documentElement).appendChild(ac0); }
  if (!window.TVNAuth && !document.querySelector('script[src="' + AUTH_SRC + '"]')) {
    var sa = document.createElement("script"); sa.src = AUTH_SRC; sa.async = true;
    sa.setAttribute("data-app", "bantin"); sa.setAttribute("data-dai", "0"); sa.setAttribute("data-chip", "#tvg-acct");
    sa.onload = function () { try { if (window.TVNAuth && TVNAuth.san_sang) TVNAuth.san_sang.then(function () { soon(); }); } catch (e) { } soon(); };
    (document.head || document.documentElement).appendChild(sa);
  }

  var TEL = "0938004541", TELF = "0938 004 541", PRICE = "3 triệu đồng / 3 tháng";
  var QN = {
    khuyen_nghi: "Khuyến nghị đủ vùng giá, mục tiêu, cắt lỗ và kết quả từng mã",
    tam_ly: "Tâm lý thị trường, La bàn chu kỳ, Đáy hay đỉnh",
    luu_tru: "Kho bản tin số cũ, tìm theo mã, so sánh hai số",
    vi_mo_full: "Vĩ mô đầy đủ: tự dự báo, kiểm chứng, tín dụng, chính sách, ngành",
    hoi_dap_full: "Hỏi đáp với trợ lý TVN"
  };
  var FREE = ["Tin hôm nay và Nhịp thị trường", "Bản tin mới nhất: bản đầy đủ, clip, nghe", "Thế giới → Việt Nam, Toàn cảnh thị trường", "Vĩ mô phần cơ bản", "Mã và hành động trong khuyến nghị"];
  var ALLQ = Object.keys(QN);
  var IN_FRAME = window.self !== window.top;
  var IS_DOC = /\/dashboard\.html$/.test(location.pathname);
  var IS_TC = /\/toancanh\/$/.test(location.pathname) || /\/toancanh\/index\.html$/.test(location.pathname);

  /* ---------- trạng thái tài khoản ---------- */
  function vnDay(off) { var d = new Date(Date.now() + 7 * 36e5 + (off || 0) * 864e5); return d.toISOString().slice(0, 10); }
  function mock() {
    var m = LS("tvn_gate_mock") || "khach";
    if (m === "khach" || m === "that") return { dang_nhap: false, quyen: [] };
    var han = vnDay(m === "goi" ? 62 : m === "sap" ? 5 : -3);
    return { dang_nhap: true, ten_hien_thi: "Anh Minh", goi: "TVN-Trading 3 tháng", han: han, quyen: m === "het" ? [] : ALLQ.slice() };
  }
  function cached() {                 /* phiên kiểm gần nhất tvn-auth.js lưu sẵn: vẽ đúng ngay từ đầu, không chờ máy chủ */
    try { if (!LS("tvn_the")) return null; var p = JSON.parse(LS("tvn_phien") || "null"); return p && p.dang_nhap ? p : null; } catch (e) { return null; }
  }
  function real() { return !!(window.TVNAuth && typeof TVNAuth.phien === "function") && (!PREVIEW || (LS("tvn_gate_mock") || "that") === "that"); }
  function state() {
    var s = null;
    if (real()) { try { var p = TVNAuth.phien() || {}; s = { dang_nhap: !!p.dang_nhap, ten_hien_thi: p.ten_hien_thi || p.ten || "", goi: p.goi_ten || p.goi || "", han: p.han || null, quyen: (p.quyen || []).slice() }; } catch (e) { s = null; } }
    if (!s && !window.TVNAuth && (!PREVIEW || (LS("tvn_gate_mock") || "that") === "that")) {   /* tvn-auth.js chưa tải xong hoặc VPS sập: dùng phiên đã lưu, không có thì coi như khách */
      var c = cached(); s = c ? { dang_nhap: true, ten_hien_thi: c.ten_hien_thi || c.ten || "", goi: c.goi_ten || c.goi || "", han: c.han || null, quyen: (c.quyen || []).slice() } : { dang_nhap: false, quyen: [] };
    }
    s = s || mock();
    s.quyen = s.quyen || [];
    s.con = s.han ? Math.ceil((Date.parse(s.han + "T23:59:59+07:00") - Date.now()) / 864e5) : null;
    s.het = !!(s.dang_nhap && s.con != null && s.con < 0);
    if (s.het) s.quyen = [];
    return s;
  }
  var S = state();
  function has(k) { return S.quyen.indexOf(k) >= 0; }
  function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function dmy(iso) { var p = String(iso || "").split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso; }

  /* ---------- giao diện ---------- */
  var css = ""
    + ".tvg{--tv-n:#16294A;--tv-g:#C8992F;--tv-gs:rgba(200,153,47,.13);--tv-s:#fff;--tv-i:#16213A;--tv-m:#5B6579;--tv-l:#DCE2EC;--tv-w:#B4532A;font-family:'Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}"
    + ":root[data-theme=dark] .tvg{--tv-n:#8FB0E8;--tv-g:#E2BE6A;--tv-gs:rgba(226,190,106,.14);--tv-s:#16203A;--tv-i:#E7ECF5;--tv-m:#9AA6BC;--tv-l:#2A3757;--tv-w:#F0A070}"
    + "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .tvg{--tv-n:#8FB0E8;--tv-g:#E2BE6A;--tv-gs:rgba(226,190,106,.14);--tv-s:#16203A;--tv-i:#E7ECF5;--tv-m:#9AA6BC;--tv-l:#2A3757;--tv-w:#F0A070}}"
    + "#tvg-b{background:var(--tv-s);color:var(--tv-i);border:1px solid var(--tv-l);border-left:4px solid var(--tv-g);border-radius:14px;padding:12px 14px;margin:10px 0 12px;position:relative;font-size:14px;line-height:1.5}"
    + "#tvg-b.w{border-left-color:var(--tv-w)}#tvg-b .h{font-weight:700;font-size:15px;color:var(--tv-n);padding-right:28px}#tvg-b .s{color:var(--tv-m);font-size:13.5px;margin-top:3px}#tvg-b .s2{font-size:13.5px;margin-top:6px}#tvg-b .dt summary{cursor:pointer;color:var(--tv-n);font-weight:600;font-size:13px;margin-top:6px}"
    + "#tvg-b ul{list-style:none;margin:8px 0 0;padding:0}#tvg-b li{padding:2px 0 2px 22px;position:relative;font-size:13.5px}#tvg-b li i{position:absolute;left:0;top:2px;font-style:normal}"
    + "#tvg-b .g2{display:grid;grid-template-columns:1fr;gap:6px 14px}@media(min-width:640px){#tvg-b .g2{grid-template-columns:1fr 1fr}}"
    + "#tvg-b .lb{font:700 11px/1.4 inherit;letter-spacing:.06em;text-transform:uppercase;color:var(--tv-g);margin-top:8px}"
    + "#tvg-b .x{position:absolute;top:6px;right:6px;width:32px;height:32px;border:0;background:none;color:var(--tv-m);font-size:20px;cursor:pointer;border-radius:8px}"
    + ".tvg .bt{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}"
    + ".tvg .bt a,.tvg .bt button{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:8px 14px;border-radius:10px;font:600 14px inherit;text-decoration:none;cursor:pointer;border:1px solid var(--tv-l);background:transparent;color:var(--tv-n)}"
    + ".tvg .bt .p{background:var(--tv-g);border-color:var(--tv-g);color:#16294A}"
    + "#tvg-pill{display:inline-flex;align-items:center;justify-content:center;gap:4px;flex:0 0 auto;height:32px;min-width:32px;margin:0 6px 0 auto;padding:0 8px;border-radius:16px;font:600 12px inherit;border:1px solid var(--tv-g);color:#E2BE6A;background:rgba(226,190,106,.12);cursor:pointer;white-space:nowrap}#tvg-pill i{font-style:normal}@media(max-width:480px){#tvg-pill span{display:none}}"
    + ".tvg-hid>*:not(.tvg-lk){display:none!important}.tvg-x{display:none!important}"
    + ".tvg-lk{background:var(--tv-s);color:var(--tv-i);border:1px dashed var(--tv-g);border-radius:14px;padding:14px;margin:8px 0;text-align:left;font-size:14px;line-height:1.5}"
    + ".tvg-lk .t{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--tv-n);font-size:15px}.tvg-lk .t svg{flex:0 0 18px;width:18px;height:18px;stroke:var(--tv-g);fill:none;stroke-width:2}"
    + ".tvg-lk .d{color:var(--tv-m);font-size:13.5px;margin-top:4px}.tvg-lk .tz{margin-top:8px;font-size:13.5px}"
    + ".tvg-m{display:inline-block;min-width:3.2em;text-align:center;border-radius:6px;background:var(--tv-gs);color:var(--tv-g);font-size:12px;font-weight:700;letter-spacing:.02em}"
    + ".tvg-q{color:var(--tv-g);font-weight:600}"
    + "#tvg-sh{position:fixed;inset:0;z-index:2147483000;background:rgba(10,16,30,.55);display:flex;align-items:flex-end;justify-content:center}"
    + "#tvg-sh .c{background:var(--tv-s);color:var(--tv-i);width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(0,0,0,.25)}"
    + "@media(min-width:640px){#tvg-sh{align-items:center}#tvg-sh .c{border-radius:18px}}"
    + "#tvg-sh .t{font-weight:700;font-size:17px;color:var(--tv-n)}#tvg-sh .d{color:var(--tv-m);margin-top:6px;font-size:14px}"
    + "#tvg-sh label{display:block;font-size:13px;color:var(--tv-m);margin-top:10px}#tvg-sh input{width:100%;box-sizing:border-box;margin-top:4px;padding:10px 12px;border-radius:10px;border:1px solid var(--tv-l);background:transparent;color:var(--tv-i);font:15px inherit}"
    + "#tvg-sw{position:fixed;left:6px;bottom:calc(74px + env(safe-area-inset-bottom));z-index:2147482000;display:flex;align-items:center;gap:3px;max-width:calc(100vw - 80px);padding:4px 6px;border-radius:12px;background:#16294A;color:#fff;font:600 11px inherit;box-shadow:0 4px 16px rgba(0,0,0,.3);overflow-x:auto}"
    + "#tvg-sw b{color:#E2BE6A;margin-right:2px}#tvg-sw button{flex:0 0 auto;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:8px;padding:5px 7px;font:600 11px inherit;cursor:pointer}#tvg-sw button.on{background:#E2BE6A;border-color:#E2BE6A;color:#16294A}"
    + "@media(max-width:480px){html.tvg-on #kh .dt{display:none}}"
    + ".tvg-lkb::after{content:' 🔒';font-size:.85em}"
    + "#tvnqa-b.tvg-qa{position:fixed}#tvnqa-b.tvg-qa::after{content:'🔒';position:absolute;top:-4px;right:-4px;font-size:13px;background:#fff;border-radius:50%;width:18px;height:18px;line-height:18px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.3)}";
  var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  document.documentElement.classList.add("tvg-on");

  var LOCK = '<svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  function btns(extra) {
    var h = '<div class="bt">';
    if (!S.dang_nhap) h += '<button type="button" data-tvg="login">Đăng nhập</button>';
    h += '<a class="p" href="tel:' + TEL + '">' + (S.dang_nhap ? "Gia hạn" : "Đăng ký gói") + ": " + TELF + "</a>" + (extra || "") + "</div>";
    return h;
  }
  function lockCard(title, desc, teaser, extra) {
    var d = document.createElement("div"); d.className = "tvg-lk tvg";
    d.innerHTML = '<div class="t">' + LOCK + "<span>" + esc(title) + "</span></div>"
      + '<div class="d">' + esc(desc || "Dành cho tài khoản gói TVN-Trading (" + PRICE + ").") + (S.het ? " Gói của bạn đã hết hạn ngày " + esc(dmy(S.han)) + "." : "") + "</div>"
      + (teaser ? '<div class="tz">' + teaser + "</div>" : "") + btns(extra);
    return d;
  }
  function lockEl(el, title, desc, teaser, extra) {
    if (!el || el.getAttribute("data-tvgl")) return;
    el.setAttribute("data-tvgl", "1"); el.classList.add("tvg-hid");
    el.appendChild(lockCard(title, desc, teaser, extra));
  }
  function sheet(title, desc, form) {
    var o = document.getElementById("tvg-sh"); if (o) o.remove();
    o = document.createElement("div"); o.id = "tvg-sh"; o.className = "tvg"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
    o.innerHTML = '<div class="c"><div class="t">' + esc(title) + '</div><div class="d">' + desc + "</div>" + (form || "") + btns('<button type="button" data-tvg="close">Đóng</button>') + "</div>";
    o.addEventListener("click", function (e) { if (e.target === o) o.remove(); });
    document.body.appendChild(o);
  }
  function needSheet(k) {
    sheet(k === "hoi_dap_full" ? "Hỏi đáp dành cho gói TVN-Trading" : "Phần này dành cho gói TVN-Trading",
      esc(QN[k] || "") + ". " + (S.het ? "Gói của bạn đã hết hạn ngày " + esc(dmy(S.han)) + ". " : "") + "Đăng ký gói TVN-Trading (" + PRICE + "): gọi <b>" + TELF + "</b>.");
  }
  function loginSheet() {
    if (window.TVNAuth && typeof TVNAuth.moDangNhap === "function") { if (PREVIEW) LS("tvn_gate_mock", "that"); TVNAuth.moDangNhap(); soon(); return; }
    sheet("Đăng nhập TVN Insight", "Một tài khoản dùng chung cho TVN Insight, Hub và Vĩ mô; mỗi tài khoản dùng trên 1 điện thoại, 1 máy tính, 1 máy tính bảng."
      + (PREVIEW ? '<br><i>Bản xem thử: bấm Đăng nhập để giả lập tài khoản có gói.</i>' : ""),
      '<label>Tên đăng nhập<input id="tvg-u" autocomplete="username" placeholder="ví dụ minh.nguyen"></label><label>Mật khẩu<input id="tvg-p" type="password" autocomplete="current-password"></label>'
      + '<div class="bt"><button type="button" class="p" data-tvg="dologin">Đăng nhập</button></div>');
  }

  /* ---------- dải thông báo mỗi lần mở app ---------- */
  function bannerHTML() {
    var lst = function (arr, ic) { return arr.map(function (t) { return "<li><i>" + ic + "</i>" + esc(t) + "</li>"; }).join(""); };
    var paid = ALLQ.map(function (k) { return QN[k]; });
    var more = function (a, b) { return '<details class="dt"><summary>Xem chi tiết</summary><div class="g2"><div><div class="lb">Đang xem được</div><ul>' + lst(a, "✓") + '</ul></div>' + (b ? '<div><div class="lb">Gói TVN-Trading mở thêm</div><ul>' + lst(b, "🔒") + "</ul></div>" : "") + "</div></details>"; };
    if (!S.dang_nhap || (!S.het && !S.quyen.length)) return '<div class="h">' + (S.dang_nhap ? "Chào " + esc(S.ten_hien_thi) + ", tài khoản của bạn đang ở bản miễn phí" : "Bạn đang dùng bản miễn phí") + "</div>"
      + '<div class="s">Xem được tin hôm nay, bản tin mới nhất kèm clip, Thế giới, Vĩ mô cơ bản.</div>'
      + '<div class="s2">🔒 Gói <b>TVN-Trading</b> (' + PRICE + ") mở thêm khuyến nghị đủ vùng giá, Tâm lý và La bàn, số cũ, Vĩ mô đầy đủ, hỏi đáp.</div>"
      + more(FREE, paid) + btns(S.dang_nhap ? '<button type="button" data-tvg="logout">Đăng xuất</button>' : "");
    if (S.het) return '<div class="h">Gói TVN-Trading đã hết hạn ngày ' + esc(dmy(S.han)) + "</div>"
      + '<div class="s">Chào ' + esc(S.ten_hien_thi || "") + ", bạn đang dùng bản miễn phí. Gia hạn để mở lại khuyến nghị đủ vùng giá, Tâm lý và La bàn, số cũ, Vĩ mô đầy đủ, hỏi đáp.</div>"
      + more(FREE, paid) + btns('<button type="button" data-tvg="logout">Đăng xuất</button>');
    var w = S.con != null && S.con <= 7, mine = ALLQ.filter(has).map(function (k) { return QN[k]; });
    return '<div class="h">Chào ' + esc(S.ten_hien_thi || "") + " · gói " + esc(S.goi || "TVN-Trading") + "</div>"
      + '<div class="s">' + (S.con == null ? "Bạn dùng được đầy đủ mọi phần của TVN Insight, Hub và Vĩ mô." : w ? "⚠ Gói còn <b>" + S.con + " ngày</b>, hết hạn ngày " + esc(dmy(S.han)) + ". Gia hạn sớm để không gián đoạn." : "Gói còn " + S.con + " ngày (tới " + esc(dmy(S.han)) + "). Bạn dùng được đầy đủ mọi phần của TVN Insight, Hub và Vĩ mô.") + "</div>"
      + more(mine.concat(FREE), null)
      + (w ? btns('<button type="button" data-tvg="logout">Đăng xuất</button>') : '<div class="bt"><button type="button" data-tvg="logout">Đăng xuất</button></div>');
  }
  function freeNow() { return !S.dang_nhap || (!S.het && !S.quyen.length); }
  function pillText() { return S.het ? "Hết hạn" : freeNow() ? "Miễn phí" : S.con != null ? S.con + " ngày" : "Có gói"; }
  function pillIcon() { return S.het ? "⚠" : freeNow() ? "🔓" : "★"; }
  function banner() {
    if (IN_FRAME || IS_DOC) return;
    if (!document.getElementById("tvg-acct")) { var ac = document.createElement("span"); ac.id = "tvg-acct"; ac.hidden = true; document.body.appendChild(ac); }
    var b = document.getElementById("tvg-b");
    if (!b) {
      b = document.createElement("section"); b.id = "tvg-b"; b.className = "tvg noen"; b.setAttribute("aria-live", "polite");
      var tabs = document.getElementById("tabs"), main = document.getElementById("main");
      if (tabs && tabs.parentNode) tabs.parentNode.insertBefore(b, tabs);
      else if (main && main.parentNode) main.parentNode.insertBefore(b, main);
      else document.body.insertBefore(b, document.body.firstChild);
    }
    b.classList.toggle("w", !!(S.het || (S.dang_nhap && S.con <= 7)));
    b.innerHTML = '<button type="button" class="x" data-tvg="hideb" aria-label="Thu gọn">×</button>' + bannerHTML();
    b.hidden = !!window.__tvgHide;
    var host = document.querySelector("#kh .in") || document.querySelector(".top .row1");
    if (host) {
      var p = document.getElementById("tvg-pill");
      if (!p) { p = document.createElement("button"); p.type = "button"; p.id = "tvg-pill"; p.className = "tvg"; p.setAttribute("data-tvg", "showb"); var ref = host.querySelector(".n5g"); if (ref) host.insertBefore(p, ref); else host.appendChild(p); }
      p.innerHTML = "<i>" + pillIcon() + "</i><span>" + esc(pillText()) + "</span>"; p.title = S.het ? "Gói đã hết hạn" : freeNow() ? "Bản miễn phí" : "Gói TVN-Trading" + (S.con != null ? " còn " + S.con + " ngày" : "");
    }
  }

  /* ---------- khóa từng chỗ ---------- */
  var PRX = /\d{1,3}(?:\.\d{3})+(?:\s*[-–]\s*\d{1,3}(?:\.\d{3})+)?/g;
  function maskPrices(el) {             /* che mọi mức giá dạng 30.500 hoặc 30.500-31.000 trong một đoạn chữ */
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, ns = [];
    while ((n = w.nextNode())) { PRX.lastIndex = 0; if (PRX.test(n.nodeValue)) ns.push(n); } PRX.lastIndex = 0;
    ns.forEach(function (t) { var s = document.createElement("span"); s.innerHTML = esc(t.nodeValue).replace(PRX, '<span class="tvg-m">🔒</span>'); t.parentNode.replaceChild(s, t); });
  }
  function lockKN() {
    if (has("khuyen_nghi")) return;
    /* mục Khuyến nghị: giữ mã và hành động, che giá, kết quả từng mã và chấm điểm từng số */
    document.querySelectorAll("article.dmx table.dm").forEach(function (t) {
      t.querySelectorAll("tbody tr").forEach(function (tr) {
        if (tr.classList.contains("grp") || tr.getAttribute("data-tvgm")) return; tr.setAttribute("data-tvgm", "1");
        [].slice.call(tr.children).forEach(function (td, i) { if (i >= 2) td.innerHTML = '<span class="tvg-m">🔒</span>'; });
      });
      if (!t.getAttribute("data-tvgc")) { t.setAttribute("data-tvgc", "1"); t.addEventListener("click", function (e) { if (has("khuyen_nghi")) return; e.preventDefault(); e.stopPropagation(); needSheet("khuyen_nghi"); }, true); }
    });
    document.querySelectorAll("article.dmx .cards2 .mc").forEach(function (c) {     /* thẻ từng mã trên điện thoại */
      if (c.getAttribute("data-tvgm")) return; c.setAttribute("data-tvgm", "1");
      var si = c.querySelector(".since"); if (si) si.innerHTML = esc(si.textContent.replace(/\s*·\s*giá tham chiếu\s*[\d.,]*/, "")) + ' · giá tham chiếu <span class="tvg-m">🔒</span>';
      c.querySelectorAll(".nums > div").forEach(function (x) { var sm = x.querySelector("small"); x.innerHTML = (sm ? sm.outerHTML : "") + '<span class="tvg-m">🔒</span>'; });
      c.querySelectorAll(".hd svg").forEach(function (x) { x.remove(); });
      var rb = c.querySelector(".rb"); if (rb) rb.parentNode.innerHTML = '<span class="tvg-q" style="font-size:13px">🔒 Cắt lỗ · vùng mua · mục tiêu dành cho gói TVN-Trading</span>';
      var ft = c.querySelector(".ft"); if (ft) { var v = ft.querySelector(".vr"); if (v) v.innerHTML = ""; var mo = ft.querySelector(".more"); if (mo) mo.remove(); }
      c.addEventListener("click", function (e) { if (has("khuyen_nghi")) return; e.preventDefault(); e.stopPropagation(); needSheet("khuyen_nghi"); }, true);
    });
    document.querySelectorAll("article.dmx .seg button").forEach(function (b, i) {     /* xem theo ngày, diễn biến: dành cho gói */
      if (i === 0 || b.getAttribute("data-tvgm")) return; b.setAttribute("data-tvgm", "1"); b.classList.add("tvg-lkb");
      b.addEventListener("click", function (e) { if (has("khuyen_nghi")) return; e.preventDefault(); e.stopImmediatePropagation(); needSheet("khuyen_nghi"); }, true);
    });
    document.querySelectorAll("article.dmx .byday").forEach(function (b) { var c = b.closest(".card"); if (c) lockEl(c, "Chấm điểm từng số bản tin", "Kết quả đúng sai sau T+2 của từng số dành cho gói TVN-Trading."); });
    var dmx = document.querySelector("article.dmx");
    if (dmx && /\bv-(ngay|dien)\b/.test(dmx.className)) { var b0 = dmx.querySelector(".seg button"); if (b0 && !b0.__tvg) { b0.__tvg = 1; setTimeout(function () { b0.click(); }, 0); } }
    if (dmx && !dmx.querySelector(".tvg-kn")) { var c = lockCard("Bạn đang xem mã và hành động", "Giá tham chiếu, vùng mua, mục tiêu, cắt lỗ và kết quả từng mã dành cho gói TVN-Trading (" + PRICE + ")."); c.classList.add("tvg-kn"); var k = dmx.querySelector(".kpis"); if (k) k.after(c); else dmx.prepend(c); }
    /* bài đăng trong mục Bản tin và bản đầy đủ: che mức giá trong dòng khuyến nghị */
    document.querySelectorAll("pre#post").forEach(function (p) {     /* bài đăng tải sau: kiểm lại mỗi lần, chỉ sửa khi còn giá */
      var t = p.textContent, ls = t.split("\n"), hit = false;
      ls = ls.map(function (l) { if (/Khuyến nghị|vùng mua|mục tiêu|cắt lỗ/i.test(l) && PRX.test(l)) { hit = true; PRX.lastIndex = 0; return l.replace(PRX, "🔒"); } PRX.lastIndex = 0; return l; });
      if (hit) p.textContent = ls.join("\n");
    });
    if (IS_DOC) {
      var s7 = document.getElementById("s7");
      if (s7 && !s7.getAttribute("data-tvgl")) {
        var head = s7.querySelector(".v2e"), h3 = s7.querySelector("h3");
        lockEl(s7, "Khuyến nghị cổ phiếu", "Vùng mua, mục tiêu, cắt lỗ và luận điểm từng mã dành cho gói TVN-Trading (" + PRICE + ").");
        [head, h3].forEach(function (x) { if (x) { x.classList.add("tvg-lk"); x.style.cssText = "display:block!important;border:0;padding:0;margin:0 0 6px;background:none"; } });
      }
      document.querySelectorAll("#s6 table, #s1 table").forEach(function (t) {
        if (t.getAttribute("data-tvgm")) return;
        var hd = (t.querySelector("thead") || t).textContent || "";
        if (!/Mục tiêu|Cắt lỗ|Vùng mua|vùng giá/i.test(hd)) return;
        t.setAttribute("data-tvgm", "1");
        t.querySelectorAll("tbody tr").forEach(function (tr) { [].slice.call(tr.children).forEach(function (td, i) { if (i >= 2) td.innerHTML = '<span class="tvg-m">🔒</span>'; }); });
      });
      ["#s6", "#tomluoc"].forEach(function (sel) { var x = document.querySelector(sel); if (x && !x.getAttribute("data-tvgp")) { x.setAttribute("data-tvgp", "1"); x.querySelectorAll("p,li,div.kl,.v2p li,.tlr,.fr").forEach(function (e) { if (/Vùng|mục tiêu|cắt lỗ|Mua mới|Tăng tỷ trọng/i.test(e.textContent)) maskPrices(e); }); } });
    }
  }
  function lockTL() {
    if (has("tam_ly")) return;
    var T = "La bàn chu kỳ, Tâm lý và Đáy hay đỉnh", D = "Đà thị trường, tâm lý đám đông, tín hiệu đáy, đỉnh và điều kiện kích hoạt dành cho gói TVN-Trading (" + PRICE + ").";
    document.querySelectorAll("section#laban").forEach(function (x) { lockEl(x, "La bàn chu kỳ TVN", D); });
    /* Đọc nhanh ở Thị trường */
    document.querySelectorAll("#n5q .qi").forEach(function (r) {
      if (r.getAttribute("data-tvgm")) return; var d = r.querySelector("div"); if (!d) return; var t = d.textContent.trim();
      var m = /^(Nhiệt kế|Đáy hay đỉnh|Tâm lý tổng hợp|Đồng hồ tâm lý|La bàn|Thermometer|Bottom or top)/.exec(t); if (!m) return;
      r.setAttribute("data-tvgm", "1"); d.innerHTML = "<b>" + esc(m[1]) + '</b> <span class="tvg-q">🔒 dành cho gói TVN-Trading</span>';
    });
    /* mục Tâm lý & chu kỳ: thẻ Tổng quan và Đáy & chu kỳ khóa, Dòng tin, Phân tích sâu, Thực thi mở */
    var art = document.querySelector("#panel article.tml");
    if (art) {
      var bar = art.querySelector(".hubtabs");
      if (bar) bar.querySelectorAll("button[data-k]").forEach(function (b) { if (/^(tq|day)$/.test(b.dataset.k)) b.classList.add("tvg-lkb"); });
      var cur = bar && bar.querySelector("button.on"), k = cur ? cur.dataset.k : "tq", lockTab = /^(tq|day)$/.test(k);
      [].slice.call(art.children).concat([].slice.call(document.querySelectorAll("#panel #lbslot"))).forEach(function (el) {
        var t = el.getAttribute("data-hubt"); if (!t) return;
        var only = t.split(" ").every(function (x) { return x === "tq" || x === "day"; });
        el.classList.toggle("tvg-x", only);
      });
      var lk = document.getElementById("tvg-tml");
      if (!lk) {
        lk = lockCard(T, D, null, '<button type="button" data-tvg="tin">Xem Dòng tin (miễn phí) ›</button>'); lk.id = "tvg-tml";
        var tip = art.querySelector(".hubtip"); if (tip) tip.after(lk); else art.prepend(lk);
      }
      lk.style.display = lockTab ? "" : "none";
      if (bar && !bar.getAttribute("data-tvgm")) { bar.setAttribute("data-tvgm", "1"); bar.addEventListener("click", function () { setTimeout(apply, 0); }); }
    }
    if (IS_TC) {
      document.querySelectorAll("#main section.card").forEach(function (c) { var h = c.querySelector("h2"); if (h && /La bàn chu kỳ|Nhiệt kế · Xu hướng/.test(h.textContent)) lockEl(c, "La bàn chu kỳ", D); });
      document.querySelectorAll("#main li").forEach(function (li) { if (!li.getAttribute("data-tvgm") && /^(La bàn|Xu hướng \(La bàn\)):/.test(li.textContent.trim())) { li.setAttribute("data-tvgm", "1"); li.innerHTML = '<b>La bàn:</b> <span class="tvg-q">🔒 dành cho gói TVN-Trading</span>'; } });
    }
    if (IS_DOC) document.querySelectorAll("section, div.w, div.ckc").forEach(function (x) {
      var h = x.querySelector(":scope > h3, :scope > .wh, :scope > .ckh"); if (h && /ĐÁY, HỒI PHỤC HAY ĐỈNH|La bàn chu kỳ|ĐỒNG HỒ TÂM LÝ/i.test(h.textContent)) lockEl(x, T, D);
    });
  }
  function lockLT() {
    if (has("luu_tru")) return;
    var a = document.querySelector("#panel article.arch");
    if (a && !a.getAttribute("data-tvgl")) {
      var n = a.querySelectorAll(".ar").length, last = [].slice.call(a.querySelectorAll(".ar .ah")).slice(2, 5).map(function (x) { return "<li>" + esc(x.firstChild ? x.firstChild.textContent.replace(/\*\*/g, "").slice(0, 90) : "") + "…</li>"; }).join("");
      lockEl(a, "Kho bản tin số cũ · " + n + " số", "Đọc lại, nghe, xem clip, tìm theo mã và so sánh hai số cũ dành cho gói TVN-Trading (" + PRICE + "). Bản tin mới nhất của mỗi loại vẫn miễn phí.", last ? '<ul style="margin:0;padding-left:18px;color:var(--tv-m)">' + last + "</ul>" : "");
    }
    document.querySelectorAll(".pstrip").forEach(function (p) {
      if (p.getAttribute("data-tvgm")) return; p.setAttribute("data-tvgm", "1");
      p.querySelectorAll("button").forEach(function (b) { b.classList.add("tvg-lkb"); });
      p.addEventListener("click", function (e) { if (has("luu_tru")) return; if (e.target.closest("button")) { e.preventDefault(); e.stopPropagation(); needSheet("luu_tru"); } }, true);
    });
    document.querySelectorAll("#n5bar .l2 button, #bnav [data-bn=arch]").forEach(function (b) { if (/Số cũ|Archive/.test(b.textContent) || b.getAttribute("data-bn") === "arch") b.classList.add("tvg-lkb"); });
  }
  function lockQA() {
    var b = document.getElementById("tvnqa-b"); if (b) b.classList.toggle("tvg-qa", !has("hoi_dap_full"));
  }
  new MutationObserver(function () {          /* mọi đường mở khung hỏi đáp: chưa có quyền thì đóng lại và báo */
    var h = document.documentElement;
    if (h.classList.contains("tvnqa-open") && !has("hoi_dap_full")) { h.classList.remove("tvnqa-open"); needSheet("hoi_dap_full"); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-tvg]");
    if (t) {
      var a = t.getAttribute("data-tvg") || "";
      if (a === "login") { e.preventDefault(); loginSheet(); return; }
      if (a === "dologin") { e.preventDefault(); if (PREVIEW) { LS("tvn_gate_mock", "goi"); location.reload(); } return; }
      if (a === "logout") { e.preventDefault(); if (real() && TVNAuth.dangXuat) { Promise.resolve(TVNAuth.dangXuat()).then(soon, soon); } else { LS("tvn_gate_mock", "khach"); location.reload(); } return; }
      if (a === "close") { var o = document.getElementById("tvg-sh"); if (o) o.remove(); return; }
      if (a === "hideb") { window.__tvgHide = 1; var b = document.getElementById("tvg-b"); if (b) b.hidden = true; return; }
      if (a === "showb") { window.__tvgHide = 0; var b2 = document.getElementById("tvg-b"); if (b2) { b2.hidden = false; b2.scrollIntoView({ behavior: "smooth", block: "center" }); } return; }
      if (a === "tin") { var tb = document.querySelector('.hubtabs button[data-k="tin"]'); if (tb) tb.click(); return; }
      if (a.indexOf("mock:") === 0) { LS("tvn_gate_mock", a.slice(5)); location.reload(); return; }
    }
    var qa = e.target.closest && e.target.closest("#tvnqa-b");
    if (qa && !has("hoi_dap_full")) { e.preventDefault(); e.stopImmediatePropagation(); needSheet("hoi_dap_full"); }
  }, true);

  /* ---------- thanh xem thử ---------- */
  function switcher() {
    if (!PREVIEW || IN_FRAME || document.getElementById("tvg-sw")) return;
    var m = LS("tvn_gate_mock") || "that", w = document.createElement("div"); w.id = "tvg-sw"; w.className = "tvg";
    w.innerHTML = "<b>Thử</b>" + [["that", "Tài khoản thật"], ["khach", "Khách"], ["goi", "Có gói"], ["sap", "Còn 5 ngày"], ["het", "Hết hạn"]].map(function (x) { return '<button type="button" data-tvg="mock:' + x[0] + '"' + (m === x[0] ? ' class="on"' : "") + ">" + x[1] + "</button>"; }).join("") + '<button type="button" onclick="location.search=\'?thu=0\'" title="Tắt bản xem thử">✕</button>';
    document.body.appendChild(w);
  }

  function wrapNav() {             /* thông báo hiện khi mở app; chuyển sang mục khác thì thu gọn, còn nút ở đầu trang */
    if (typeof window.goTab !== "function" || window.goTab.__tvg) return;
    var g = window.goTab, w2 = function () { window.__tvgHide = 1; var b = document.getElementById("tvg-b"); if (b) b.hidden = true; return g.apply(this, arguments); };
    w2.__tvg = 1; window.goTab = w2; try { goTab = w2; } catch (e) { }
  }
  var busy = false, SIG0 = null;
  function sig(x) { return (x.dang_nhap ? 1 : 0) + "|" + x.quyen.slice().sort().join(","); }
  function apply() {
    if (busy) return; busy = true;
    try {
      S = state();
      var g = sig(S); if (SIG0 === null) SIG0 = g;
      if (g !== SIG0) {                   /* đăng nhập, đăng xuất, đổi gói: tải lại trang để mở hoặc khóa đúng quyền mới (tối đa 3 lần mỗi phút) */
        var k = "tvg_rl", n = 0; try { var r = JSON.parse(sessionStorage.getItem(k) || "[]").filter(function (t) { return Date.now() - t < 6e4; }); n = r.length; r.push(Date.now()); sessionStorage.setItem(k, JSON.stringify(r)); } catch (e) { }
        if (n < 3) { busy = false; location.reload(); return; }
        SIG0 = g;
      } wrapNav(); banner(); lockKN(); lockTL(); lockLT(); lockQA(); switcher(); } catch (e) { if (window.console) console.warn("tvn-gate", e); }
    busy = false;
  }
  var tmr = 0;
  function soon() { clearTimeout(tmr); tmr = setTimeout(apply, 60); }
  function start() {
    if (LS("tvn_the") && !cached() && !window.TVNAuth && !start.w) {      /* có mã phiên nhưng chưa có phiên lưu: chờ tvn-auth.js tối đa 2,5 giây */
      start.w = 1; var t0 = Date.now(), iv = setInterval(function () { if (window.TVNAuth || Date.now() - t0 > 2500) { clearInterval(iv); start(); } }, 100); return;
    }
    apply();
    new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (t && t.closest && t.closest("#tvg-b,#tvg-pill,#tvg-sh,#tvg-sw,.tvg-lk")) continue; soon(); return; } }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("tvn-auth", soon);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
