(function () {
  /* TVN Insight · gọn bố cục và sơ đồ trang (anh Vũ duyệt 24/10/2026: "ok làm hết những gì đề xuất, sơ đồ trang là cần thiết").
     Không xóa nội dung: chỉ sắp lại, thu gọn và thêm lối đi. Tắt cả lớp này bằng ?ux=0 (mở lại bằng ?ux=1). */
  "use strict";
  if (window.__tvux) return; window.__tvux = 1;
  var LS = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  var q = location.search;
  if (/[?&]ux=0\b/.test(q)) LS("tvn_ux", "0");
  if (/[?&]ux=1\b/.test(q)) LS("tvn_ux", null);
  if (LS("tvn_ux") === "0") return;
  if (/[?&]chu=1\b/.test(q)) LS("tvn_chu", "1");          /* máy của anh Vũ: thấy phần nội bộ (bài đăng Facebook, Zalo) */
  if (/[?&]chu=0\b/.test(q)) LS("tvn_chu", null);
  var EN = function () { return window.TVN_LANG === "en"; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function owner() {
    if (LS("tvn_chu") === "1") return true;
    try { return !!(window.TVNAuth && TVNAuth.phien && TVNAuth.phien().chu); } catch (e) { return false; }
  }
  var BASE = location.pathname.replace(/[^/]*$/, "");

  var css = ""
    /* đầu trang: trên điện thoại bỏ dòng ngày bản tin để chữ TVN Insight không dính (ngày đã có ở Đọc nhanh) */
    + "@media(max-width:480px){#kh .dt{display:none!important}}"
    /* nút Hỏi TVN: nút tròn trên điện thoại, không che nội dung */
    + "@media(max-width:640px){#tvnqa-b{width:48px!important;height:48px!important;min-width:0!important;padding:0!important;border-radius:50%!important;justify-content:center!important;gap:0!important}#tvnqa-b>:not(svg){display:none!important}#tvnqa-b svg{margin:0!important}}"
    /* Điểm nóng quốc tế: tên một dòng đủ rộng, nhãn tình trạng xuống dưới */
    + ".hn .dnl .dnt{display:flex!important;flex-wrap:wrap;align-items:center;gap:2px 8px}.hn .dnl .dnt b{flex:1 1 100%;min-width:0;white-space:normal}.hn .dnl .dnt i{flex:0 0 auto}"
    /* nút bấm tối thiểu 40px */
    + ".arch .amr .am,.arch .aa button,.arch .aa label,.pstrip button,.edsw button,.hubtabs button,#n5bar .l2 button,#n5bar .l2 a,article.dmx .seg button,article.dmx .fch button,.arch .chips button,.rsel button{min-height:40px;display:inline-flex;align-items:center;justify-content:center}"
    + ".arch .amr{gap:6px!important;flex-wrap:wrap}.arch .amr .am{padding:6px 12px!important}"
    /* thanh mục con của Tâm lý luôn ở đầu, dính dưới thanh trên cùng */
    + "body.n5 article.tml .hubtabs{display:grid!important}"
    + "article.tml .hubtabs{position:sticky;top:var(--tvux-top,56px);z-index:6;background:var(--bg,#F6F7FA);padding:8px 0;margin:0 0 6px!important;box-shadow:0 6px 8px -8px rgba(0,0,0,.25)}"
    + ".tvux-links{display:grid;gap:8px;margin:8px 0 4px}.tvux-links a{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;border:1px solid var(--line,#DCE2EC);border-radius:12px;text-decoration:none;color:var(--ink,#16213A);background:var(--surface,#fff);min-height:48px}"
    + ".tvux-links a b{display:block;color:var(--navy,#1F3864)}.tvux-links a small{display:block;color:var(--mute,#5B6579);font-size:12.5px;margin-top:2px}.tvux-links a i{font-style:normal;color:var(--gold,#C8992F);font-weight:700}"
    /* Khuyến nghị: lịch sử gập lại */
    + "details.tvux-his{margin:10px 0}details.tvux-his>summary{cursor:pointer;list-style:none;padding:12px 14px;border:1px dashed var(--line,#DCE2EC);border-radius:12px;font-weight:600;color:var(--navy,#1F3864);min-height:44px}details.tvux-his>summary::-webkit-details-marker{display:none}details.tvux-his>summary:after{content:' ▾'}details.tvux-his[open]>summary:after{content:' ▴'}"
    + "tr.tvux-hide{display:none}tr.tvux-tog td{cursor:pointer;color:var(--navy,#1F3864);font-weight:600;text-align:left!important;padding:10px 6px}"
    /* sơ đồ trang */
    + ".tvux-scan{display:inline-flex;align-items:center;gap:4px;min-height:40px;margin-top:8px;padding:6px 12px;border:1px solid var(--gold,#C8992F);border-radius:10px;color:var(--gold,#B8860B);font-weight:700;font-size:13.5px;text-decoration:none}"
    + ".tvux-scan.wide{display:flex;flex-wrap:wrap;width:100%;justify-content:center;margin-top:10px}.tvux-scan small{flex-basis:100%;text-align:center;font-weight:500;font-size:12px;color:var(--mute,#5B6579)}"
    + "html:not(.tvux-chu) .hubtabs button[data-k=sau],html:not(.tvux-chu) .hubtabs button[data-k=run]{display:none!important}"
    + ".tvux-sum.hubsec,.tvux-sum{border:1px solid var(--line,#DCE2EC);border-left:4px solid var(--gold,#C8992F);border-radius:14px;background:rgba(200,153,47,.07);padding:12px 12px 8px;margin:10px 0 12px}"
    + ".tvux-sum .h{margin:0 0 6px;font-size:12.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--gold,#B8860B)}"
    + ".tvux-sum button{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--line,#E3E7EF);padding:9px 2px;min-height:44px;font:inherit;font-size:14.5px;line-height:1.45;color:inherit;cursor:pointer}"
    + ".tvux-sum button:first-of-type{border-top:0}.tvux-sum .ic{flex:0 0 auto;font-size:16px}.tvux-sum b{display:block;font-size:12.5px;color:var(--gold,#B8860B);margin-bottom:1px}.tvux-sum i{margin-left:auto;font-style:normal;color:var(--gold,#C8992F);font-weight:700}"
    + ".tvux-sum .ft{margin:4px 0 0;font-size:12px;color:var(--mute,#5B6579)}"
    + "#tvux-map{position:fixed;inset:0;z-index:2147482500;background:rgba(10,16,30,.55);display:flex;align-items:flex-end;justify-content:center}"
    + "#tvux-map .c{background:var(--surface,#fff);color:var(--ink,#16213A);width:100%;max-width:560px;max-height:88vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(0,0,0,.25);font-family:'Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}"
    + "@media(min-width:640px){#tvux-map{align-items:center}#tvux-map .c{border-radius:18px}}"
    + "#tvux-map h2{margin:0;font-size:18px;color:var(--navy,#1F3864)}#tvux-map .s{color:var(--mute,#5B6579);font-size:13.5px;margin:4px 0 10px}"
    + "#tvux-map .sec{border:1px solid var(--line,#DCE2EC);border-radius:14px;margin:8px 0;overflow:hidden}"
    + "#tvux-map .sh{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--chip,#EEF2F8);font-weight:700;color:var(--navy,#1F3864)}#tvux-map .sh .n{width:24px;height:24px;border-radius:50%;background:var(--gold,#C8992F);color:#16294A;display:inline-flex;align-items:center;justify-content:center;font-size:13px}"
    + "#tvux-map .sh small{display:block;font-weight:500;color:var(--mute,#5B6579);font-size:12px;margin-top:1px}#tvux-map .sh .tt{display:block}"
    + "#tvux-map button.it{display:flex;width:100%;text-align:left;gap:8px;align-items:flex-start;border:0;border-top:1px solid var(--line,#DCE2EC);background:transparent;color:inherit;padding:10px 12px;cursor:pointer;font:inherit;min-height:44px}"
    + "#tvux-map button.it b{display:block;font-size:14.5px}#tvux-map button.it span{display:block;color:var(--mute,#5B6579);font-size:12.5px;margin-top:1px}#tvux-map button.it em{margin-left:auto;font-style:normal;color:var(--gold,#C8992F);font-weight:700;padding-left:6px}"
    + "#tvux-map .ft{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}#tvux-map .ft button{min-height:44px;padding:8px 16px;border-radius:10px;border:1px solid var(--line,#DCE2EC);background:transparent;color:var(--navy,#1F3864);font:600 14px inherit;cursor:pointer}#tvux-map .ft .p{background:var(--gold,#C8992F);border-color:var(--gold,#C8992F);color:#16294A}"
    + ".tvux-mapbtn{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:6px 14px;border-radius:999px;border:1px solid var(--line,#DCE2EC);background:var(--surface,#fff);color:var(--navy,#1F3864);font:600 .85rem var(--f-ui,inherit);cursor:pointer;margin-left:6px;vertical-align:middle}";
  var st = document.createElement("style"); st.id = "tvux-css"; st.textContent = css; (document.head || document.documentElement).appendChild(st);

  /* ---------- sơ đồ trang ---------- */
  var gated = function () { return !!(window.__tvg); };
  function MAP() {
    return [
      { id: "homnay", t: "Hôm nay", d: "Mở app là thấy: điều quan trọng nhất trong ngày", it: [
        ["homnay", "", "Đọc nhanh", "Kết luận, ý chính, hành động của bản tin mới nhất"],
        ["homnay", "", "Nhịp thị trường", "Cập nhật hết phiên sáng 11:50 và hết phiên chiều 15:20"],
        ["homnay", "", "Thế giới → Việt Nam, điểm nóng, tâm lý tin tức, kịch bản, lịch sắp tới", "Các thẻ tóm tắt, bấm vào để đọc sâu"]] },
      { id: "thitruong", t: "Thị trường", d: "Tâm lý, chu kỳ, toàn cảnh và thế giới", it: [
        ["thitruong", "tamly", "Tâm lý & chu kỳ", "Đồng hồ tâm lý, La bàn chu kỳ, Đáy hay đỉnh, dòng tin, chính sách, F247", "tam_ly"],
        ["@toancanh", "", "Toàn cảnh thị trường", "Chỉ số, dòng tiền, ngành, 15 bộ lọc cổ phiếu sau mỗi phiên"],
        ["@thegioi", "", "Thế giới → Việt Nam", "Áp lực bên ngoài, bản đồ, lịch công bố, diễn biến chính"]] },
      { id: "bantin", t: "Bản tin", d: "Ba bản tin mỗi ngày, có bản đầy đủ, nghe, clip, PDF", it: [
        ["bantin", "sang", "Bản tin sáng", "06:00 thứ Hai tới thứ Sáu"],
        ["bantin", "phien", "Chốt phiên", "17:00 mỗi ngày giao dịch, kèm dự báo và khuyến nghị"],
        ["bantin", "tuan", "Chốt tuần", "08:00 thứ Bảy, tổng kết tuần và kế hoạch tuần tới"],
        ["bantin", "arch", "Số cũ", "Tìm theo mã, theo ngày, so sánh hai số", "luu_tru"]] },
      { id: "phantich", t: "Phân tích", d: "Vĩ mô và phân tích sâu, mở thành trang riêng", it: [
        ["@vimo", "", "Vĩ mô Việt Nam", "GDP, lạm phát, tín dụng, chính sách, dự báo, ngành", "vi_mo_full"],
        ["@hamy", "", "Hàm ý & chính sách", "Đọc hàm ý tin, chính sách và doanh nghiệp"],
        ["@baocao", "", "Báo cáo", "Báo cáo phân tích theo yêu cầu"],
        ["@thucthi", "", "🔎 Cào tin & phân tích", "Gõ mã, ngành hoặc câu hỏi: TVN cào tin mới nhất và trả báo cáo", "cao_tin"]] },
      { id: "khuyennghi", t: "Khuyến nghị", d: "Danh mục cổ phiếu TVN đang khuyến nghị và kết quả", it: [
        ["khuyennghi", "", "Danh mục đang khuyến nghị", "Mã, hành động, vùng mua, mục tiêu, cắt lỗ", "khuyen_nghi"],
        ["khuyennghi", "", "Kết quả và lịch sử", "Đúng sai sau T+2, so với VN-Index, các vị thế đã kết thúc", "khuyen_nghi"]] },
      { id: "caidat", t: "Cài đặt", d: "Biểu tượng bánh răng trên đầu trang", it: [
        ["caidat", "", "Giao diện, ngôn ngữ, cỡ chữ", "Sáng hoặc tối, tiếng Việt hoặc tiếng Anh"],
        ["caidat", "", "Nhóm Zalo TVN và sơ đồ trang", "Tham gia nhóm, mở lại sơ đồ này"]] }
    ];
  }
  var PG = { toancanh: BASE + "toancanh/", thegioi: "/tvn-hub/thegioi/", vimo: BASE + "xem/?p=vimo", hamy: BASE + "xem/?p=hamy", baocao: BASE + "xem/?p=baocao", thucthi: BASE + "xem/?p=thucthi" };
  function lockOf(k) {
    if (!k || !gated()) return "";
    var g = document.getElementById("tvg-pill"); if (!g) return "";
    var free = /Miễn phí|Hết hạn/.test(g.textContent || "");
    return free ? ' <span title="Dành cho gói TVN-Trading">🔒</span>' : "";
  }
  function openMap() {
    var o = document.getElementById("tvux-map"); if (o) o.remove();
    o = document.createElement("div"); o.id = "tvux-map"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Sơ đồ TVN Insight");
    var h = '<div class="c"><h2>Sơ đồ TVN Insight</h2><div class="s">5 mục ở thanh dưới đáy (máy tính: thanh trên đầu), mỗi mục có các trang con. Bấm vào dòng nào để tới thẳng trang đó.</div>';
    MAP().forEach(function (S, i) {
      h += '<div class="sec"><div class="sh"><span class="n">' + (i + 1) + '</span><span class="tt">' + esc(S.t) + "<small>" + esc(S.d) + "</small></span></div>";
      S.it.forEach(function (x) { h += '<button type="button" class="it" data-go="' + esc(x[0]) + '" data-sub="' + esc(x[1]) + '"><div><b>' + esc(x[2]) + lockOf(x[4]) + "</b><span>" + esc(x[3]) + "</span></div><em>›</em></button>"; });
      h += "</div>";
    });
    h += '<div class="s" style="margin-top:8px">Mỗi trang có dòng vị trí phía trên (ví dụ "Thị trường › Tâm lý & chu kỳ"); trang mở riêng luôn có "‹ TVN Insight" để quay về. Xem lại sơ đồ trong Cài đặt hoặc nút Sơ đồ cạnh Hướng dẫn.</div>'
      + '<div class="ft"><button type="button" data-x="1">Đóng</button><button type="button" class="p" data-x="1">Đã hiểu</button></div></div>';
    o.innerHTML = h;
    o.addEventListener("click", function (e) {
      if (e.target === o || (e.target.closest && e.target.closest("[data-x]"))) { o.remove(); LS("tvn_map_v1", "1"); return; }
      var b = e.target.closest && e.target.closest("button.it"); if (!b) return;
      o.remove(); LS("tvn_map_v1", "1");
      var g = b.getAttribute("data-go"), s = b.getAttribute("data-sub");
      if (g.charAt(0) === "@") { location.href = PG[g.slice(1)]; return; }
      if (typeof goTab === "function") { goTab(g, s || undefined); setTimeout(function () { var pn = document.getElementById("panel"), kh = document.getElementById("kh"); if (pn) window.scrollTo({ top: Math.max(0, pn.getBoundingClientRect().top + scrollY - (kh ? kh.getBoundingClientRect().height : 56) - 8), behavior: "smooth" }); }, 350); }
    });
    var esc_k = function (e) { if (e.key === "Escape" && document.getElementById("tvux-map")) { o.remove(); LS("tvn_map_v1", "1"); document.removeEventListener("keydown", esc_k); } };
    document.addEventListener("keydown", esc_k);
    document.body.appendChild(o);
    var f = o.querySelector(".ft .p"); if (f) try { f.focus({ preventScroll: true }); } catch (e) {}
  }
  window.tvnSoDo = openMap;

  /* ---------- từng chỗ ---------- */
  function tidyHome() {
    document.querySelectorAll(".hn .cd.rt p.lb2").forEach(function (p) {
      if (p.dataset.ux) return;
      if (/^Hành động$/.test(p.textContent.trim()) && p.parentNode.querySelector(".sc")) { p.dataset.ux = "1"; p.textContent = EN() ? "Scenarios" : "Kịch bản phiên tới"; }
    });
  }
  function tidyBantin() {
    var own = owner();
    document.querySelectorAll("section.part").forEach(function (s) { var h = s.querySelector("h2"); if (h && /Bài đăng Facebook|Facebook and Zalo/i.test(h.textContent)) s.style.display = own ? "" : "none"; });
    if (!EN()) document.querySelectorAll("#panel p.note").forEach(function (p) { if (/Bản tiếng Anh chưa có/i.test(p.textContent)) p.style.display = "none"; });
  }
  function tidyKN() {
    var c2 = document.querySelector("article.dmx .cards2");
    if (c2 && !c2.querySelector("details.tvux-his")) {
      var grp = [].slice.call(c2.querySelectorAll(":scope > .mgrp")).find(function (g) { return /Đã kết thúc|Closed|Ended/i.test(g.textContent); });
      if (grp) {
        var d = document.createElement("details"); d.className = "tvux-his";
        var n = 0, x = grp.nextElementSibling, mv = [];
        while (x && !x.classList.contains("mgrp")) { mv.push(x); if (x.classList.contains("mc")) n++; x = x.nextElementSibling; }
        d.innerHTML = "<summary>" + (EN() ? "History · " + n + " closed positions" : "Lịch sử · " + n + " vị thế đã kết thúc, bấm để xem") + "</summary>";
        grp.parentNode.insertBefore(d, grp); d.appendChild(grp); mv.forEach(function (m) { d.appendChild(m); });
      }
    }
    var tb = document.querySelector("article.dmx table.dm tbody");
    if (tb && !tb.querySelector("tr.tvux-tog")) {
      var rows = [].slice.call(tb.children), gi = rows.findIndex(function (r) { return r.classList.contains("grp") && /Đã kết thúc|Closed|Ended/i.test(r.textContent); });
      if (gi >= 0) {
        var rest = rows.slice(gi + 1), tr = document.createElement("tr"); tr.className = "tvux-tog";
        tr.innerHTML = '<td colspan="8">' + (EN() ? "Show " + rest.length + " closed positions ▾" : "Xem " + rest.length + " vị thế đã kết thúc ▾") + "</td>";
        rest.forEach(function (r) { r.classList.add("tvux-hide"); });
        tr.addEventListener("click", function () { var hid = rest[0] && rest[0].classList.contains("tvux-hide"); rest.forEach(function (r) { r.classList.toggle("tvux-hide", !hid); }); tr.firstChild.textContent = hid ? (EN() ? "Hide closed positions ▴" : "Ẩn các vị thế đã kết thúc ▴") : (EN() ? "Show " + rest.length + " closed positions ▾" : "Xem " + rest.length + " vị thế đã kết thúc ▾"); });
        rows[gi].after(tr);
      }
    }
    document.querySelectorAll("article.dmx .byday").forEach(function (b) {
      var c = b.closest(".card"); if (!c || c.dataset.ux || c.getAttribute("data-tvgl")) return; c.dataset.ux = "1";
      var h3 = c.querySelector("h3"), d = document.createElement("details"); d.className = "tvux-his";
      d.innerHTML = "<summary>" + esc(h3 ? h3.textContent : "Chấm điểm từng số") + (EN() ? " · tap to open" : " · bấm để mở") + "</summary>";
      [].slice.call(c.children).forEach(function (x) { if (x !== h3) d.appendChild(x); });
      if (h3) h3.style.display = "none"; c.appendChild(d);
    });
  }
  function tidyTamly() {
    var art = document.querySelector("#panel article.tml"); if (!art) return;
    var kh = document.getElementById("kh"); document.documentElement.style.setProperty("--tvux-top", (kh ? Math.round(kh.getBoundingClientRect().height) : 56) + "px");
    var bar = art.querySelector(".hubtabs");
    if (bar && art.firstElementChild !== bar) art.insertBefore(bar, art.firstChild);           /* thanh mục con lên đầu */
    var lb = document.querySelector("#panel > #lbslot"), dh = art.querySelector("section.dh");
    if (lb && dh) dh.after(lb);                                                                 /* đồng hồ tâm lý trước, La bàn sau */
    if (bar && !bar.dataset.ux) {
      bar.dataset.ux = "1";
      bar.addEventListener("click", function (e) {
        if (!e.target.closest("button[data-k]")) return;
        setTimeout(function () { var y = art.getBoundingClientRect().top + scrollY - (kh ? kh.getBoundingClientRect().height : 56) - 4; if (scrollY > y || scrollY < y - 400) window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); }, 30);
      });
    }
    var oldS = art.querySelector(".tvux-sum"); if (oldS) oldS.remove();                 /* 24/10: bỏ thẻ Kết luận nhanh, trùng khối Đọc nhanh */
    document.documentElement.classList.toggle("tvux-chu", owner());
    if (bar && !owner()) { var on = bar.querySelector("button.on"); if (on && /^(sau|run)$/.test(on.dataset.k)) { var t0 = bar.querySelector('button[data-k="tq"]'); if (t0) t0.click(); } }
    /* Phân tích sâu và Thực thi: lối sang trang riêng thay cho khung nhúng dài hơn 10 màn hình */
    [[".hubbot", [["hamy", "Hàm ý & chính sách", "Đọc hàm ý tin, chính sách và doanh nghiệp"], ["baocao", "Báo cáo", "Báo cáo phân tích theo yêu cầu, có PDF và ảnh"]]],
     [".hubrun", [["thucthi", "Thực thi TVN Intelligence", "Gõ mã hoặc câu hỏi rồi bấm Thực thi"]]]].forEach(function (z) {
      var s = document.querySelector("#panel " + z[0]); if (!s || s.dataset.ux) return; s.dataset.ux = "1";
      s.querySelectorAll("iframe.hubf").forEach(function (f) { f.style.display = "none"; f.removeAttribute("src"); });
      var L = document.createElement("div"); L.className = "tvux-links";
      L.innerHTML = z[1].map(function (x) { return '<a href="' + PG[x[0]] + '"><span><b>' + esc(x[1]) + "</b><small>" + esc(x[2]) + "</small></span><i>›</i></a>"; }).join("");
      s.appendChild(L);
    });
  }
  /* Kết luận nhanh của mục Tâm lý & chu kỳ: gom 4 kết luận rải rác (đồng hồ, La bàn, đáy-đỉnh, nên làm) lên đầu Tổng quan */
  function sumCard(art, bar) {
    var old = art.querySelector(".tvux-sum");
    var tq = bar && bar.querySelector('button[data-k="tq"]');
    var dh = art.querySelector("section.dh");
    var locked = (tq && tq.classList.contains("tvg-lkb")) || (dh && (dh.getAttribute("data-tvgl") || dh.closest(".tvg-hid")));
    if (locked || EN()) { if (old) old.remove(); return; }
    var T = function (el) { return el ? el.textContent.replace(/\s+/g, " ").replace(/^\s*Kết luận\s*:?\s*/i, "").trim() : ""; };
    var lb = document.querySelector("#panel #lbslot");
    var cks = art.querySelectorAll(".ckc"), ck0 = cks[0];
    var nen = null; (ck0 ? ck0 : art).querySelectorAll(".kl p").forEach(function (p) { if (!nen && /^\s*Nên làm/.test(p.textContent)) nen = p; });
    var rows = [
      ["🌡", "Đồng hồ tâm lý", T(dh && dh.querySelector(".dhkl")), dh],
      ["🧭", "La bàn chu kỳ", T(lb && lb.querySelector("p.klu")), lb],
      ["📉", "Đáy hay đỉnh", T(ck0 && ck0.querySelector("h3")), ck0],
      ["✅", "Nên làm", T(nen).replace(/^Nên làm\s*:\s*/, ""), nen && nen.closest(".ckc")]
    ].filter(function (r) { return r[2]; });
    if (rows.length < 2) { if (old) old.remove(); return; }
    var sig = rows.map(function (r) { return r[2]; }).join("|");
    if (old && old.dataset.sig === sig) return;
    var c = old || document.createElement("section"); if (!old) c.className = "tvux-sum hubsec"; c.setAttribute("data-hubt", "tq"); c.dataset.sig = sig;
    c.innerHTML = '<p class="h">Kết luận nhanh · Tâm lý & chu kỳ</p>' + rows.map(function (r, i) { return '<button type="button" data-i="' + i + '"><span class="ic">' + r[0] + '</span><span><b>' + esc(r[1]) + "</b>" + esc(r[2]) + "</span><i>›</i></button>"; }).join("") + '<p class="ft">Bấm từng dòng để xem chi tiết bên dưới.</p>';
    c.onclick = function (e) { var b = e.target.closest && e.target.closest("button[data-i]"); if (!b) return; var t = rows[+b.dataset.i][3]; if (t) { var kh = document.getElementById("kh"); window.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + scrollY - (kh ? kh.getBoundingClientRect().height : 56) - 64), behavior: "smooth" }); } };
    if (!old) { var after = art.querySelector(".rsel") || art.querySelector(".tmls") || bar; if (after) after.after(c); else art.insertBefore(c, art.firstChild); }
  }
  /* 24/10: nút "Cào tin" ngay chỗ người dùng nảy ra nhu cầu (thẻ mã, mục Thị trường); trang Hub nhận the, ma */
  function scanHref(the, ma) { return PG.thucthi + "&the=" + the + (ma ? "&ma=" + encodeURIComponent(ma) : ""); }
  function scanBtns() {
    if (EN()) return;
    var lk = lockOf("cao_tin");
    document.querySelectorAll("#panel .cards2 .mc").forEach(function (c) {
      if (c.querySelector(".tvux-scan") || c.closest("details.tvux-his")) return;
      var b = c.querySelector(".hd b"), ma = b && b.textContent.trim();
      if (!ma || !/^[A-Z0-9]{3}$/.test(ma)) return;
      var a = document.createElement("a"); a.className = "tvux-scan"; a.href = scanHref("dn", ma);
      a.innerHTML = "🔎 Cào tin " + esc(ma) + lk; c.appendChild(a);
    });
    var q = document.getElementById("n5q");
    if (q && document.body.classList.contains("n5-tamly") && !q.querySelector(".tvux-scan")) {
      var a2 = document.createElement("a"); a2.className = "tvux-scan wide"; a2.href = scanHref("vm");
      a2.innerHTML = "🔎 Cào tin thị trường ngay" + lk + "<small>TVN cào tin mới nhất, đọc hàm ý chính sách và trả báo cáo</small>"; q.appendChild(a2);
    }
  }
  function tidySettings() {
    var p = document.getElementById("panel"); if (!p || p.querySelector(".tvux-mapcd")) return;
    var hn = p.querySelector(".hn"); if (!hn || !p.querySelector("#thsg")) return;
    var c = document.createElement("div"); c.className = "cd tvux-mapcd";
    c.innerHTML = '<p class="lb2">' + (EN() ? "Site map" : "Sơ đồ trang") + '</p><p style="margin:4px 0 8px;color:var(--mute);font-size:.9rem">' + (EN() ? "All sections and where each feature lives." : "Toàn bộ các mục, trang con và tính năng nằm ở đâu.") + '</p><button type="button" class="tvux-mapbtn" style="margin:0">🗺 ' + (EN() ? "Open site map" : "Xem sơ đồ trang") + "</button>";
    c.querySelector("button").onclick = openMap;
    hn.insertBefore(c, hn.children[1] || null);
  }
  function helpBtn() {
    var h = document.getElementById("hdsd"); if (!h || document.getElementById("tvux-mapb")) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "tvux-mapb"; b.className = "tvux-mapbtn"; b.textContent = "🗺 Sơ đồ"; b.onclick = openMap; h.after(b);
  }
  function minFont() {           /* chữ nhỏ nhất 12px trong vùng nội dung (bỏ qua biểu đồ) */
    var p = document.getElementById("panel"); if (!p) return;
    p.querySelectorAll("small,span,em,i,b,td,th,div,p,a,button,label").forEach(function (e) {
      if (e.dataset.uxf || e.closest("svg,.rb,.bar,.legend,figure,.vch,.spark,.ctip,.sp")) return;
      if (e.children.length > 3) return;
      var f = parseFloat(getComputedStyle(e).fontSize); if (f && f < 11.9) { e.style.fontSize = "12px"; e.dataset.uxf = "1"; } else e.dataset.uxf = "0";
    });
  }
  /* hướng dẫn nổi: mỗi ngày tối đa một lần, không lặp ở mọi mục */
  function hintOnce() {
    if (typeof window.__khint !== "function" || window.__khint.__ux) return;
    var o = window.__khint, w = function (k) { var d = new Date().toISOString().slice(0, 10); if (LS("tvn_hint_day") === d) return; LS("tvn_hint_day", d); return o.apply(this, arguments); };
    w.__ux = 1; window.__khint = w;
  }

  var busy = false;
  function apply() {
    if (busy) return; busy = true;
    try { hintOnce(); helpBtn(); tidyHome(); tidyBantin(); tidyKN(); tidyTamly(); tidySettings(); scanBtns(); minFont(); } catch (e) { if (window.console) console.warn("tvn-ux", e); }
    busy = false;
  }
  var t = 0; function soon() { clearTimeout(t); t = setTimeout(apply, 80); }
  function start() {
    apply();
    var pn = document.getElementById("panel") || document.body;
    new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var x = ms[i].target; if (x && x.closest && x.closest("#tvux-map")) continue; soon(); return; } }).observe(pn, { childList: true, subtree: true });
    if (!LS("tvn_map_v1") && !/[?&](p|f)=/.test(q)) setTimeout(function () { if (!LS("tvn_map_v1") && !document.getElementById("tvux-map")) openMap(); }, 2500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
