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
    /* 26/10/2026 anh Vũ "duyệt hết": Thị trường gọn trên điện thoại; bảng Khuyến nghị thành thẻ trên tablet dọc */
    + "@media(max-width:760px){section.dh:not(.tvux-o)>.dhnc{display:none!important}#laban:not(.tvux-o)>.disc{display:none!important}article.tml .rsel{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none}article.tml .rsel::-webkit-scrollbar{display:none}article.tml .rsel>*{flex:none}}"
    + "@media(min-width:761px){.tvux-more.m-only{display:none!important}}"
    + "@media(min-width:761px) and (max-width:1023px){.dmx .tw2{display:none!important}.dmx:not(.v-ngay):not(.v-dien) .cards2{display:block!important}}"
    /* 26/10/2026 máy tính, các mục khác: Đọc nhanh xếp hai cột cho dòng ngắn; Công cụ lưới 2x2 */
    + "@media(min-width:1100px){html:not(.tvux-coarse) body:not(.v-homnay) #n5q{display:grid;grid-template-columns:1fr 1fr;column-gap:28px;align-items:start}html:not(.tvux-coarse) body:not(.v-homnay) #n5q>.qh,html:not(.tvux-coarse) body:not(.v-homnay) #n5q>.qm,html:not(.tvux-coarse) body:not(.v-homnay) #n5q>.abar,html:not(.tvux-coarse) body:not(.v-homnay) #n5q>.tvux-scan{grid-column:1/-1}}"
    + "@media(min-width:700px){.n5d{display:grid!important;grid-template-columns:1fr 1fr;gap:12px}.n5d>.n5c{margin:0!important}}"
    /* 26/10/2026 máy tính (anh Vũ duyệt): Hôm nay chia hai cột ngay từ đầu, dòng chữ không quá dài; Khuyến nghị biểu đồ cả hàng */
    + "#tvux-row{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;align-items:start;margin-top:14px}#tvux-row>.l{display:flex;flex-direction:column;gap:14px;min-width:0}#tvux-row>.l>*{margin-top:0!important;margin-bottom:0!important}body.tvux-desk #panel .hn.two{grid-template-columns:1fr}body.tvux-desk #panel .hn.two>.hc.r:empty{display:none}#tvux-row>aside .hn{margin-top:0}"
    + "@media(min-width:1100px){body.v-homnay #live .lhd,body.v-homnay #live .watch,body.v-homnay #live>ul.pts{max-width:820px}}"
    /* 26/10/2026 anh Vũ duyệt "đánh giá bố cục": Hôm nay gọn, bỏ lặp; Khuyến nghị gọn; nút Cào tin nhỏ; bỏ tiêu đề phụ Thị trường */
    + "article.tml .meta .hubk{display:none!important}"
    + "body.v-homnay #live .lbn,body.v-homnay #live .ckc{display:none!important}"
    + "body.v-homnay #live:not(.tvux-lvo)>ul.pts,body.v-homnay #live:not(.tvux-lvo)>.bimg,body.v-homnay #live:not(.tvux-lvo)>.src{display:none!important}"
    + "body.v-homnay .hn .cd>p.ky{display:none!important}.tvux-hide{display:none!important}"
    + ".tvux-more{display:block;width:100%;margin:10px 0 0;padding:9px 12px;min-height:40px;border:1px solid var(--line,#DCE2EC);border-radius:10px;background:transparent;color:var(--navy,#1F3864);font:600 13.5px/1.3 inherit;cursor:pointer;text-align:center}"
    + ".tvux-fold:not(.open){max-height:210px;overflow:hidden;position:relative}.tvux-fold:not(.open)::after{content:'';position:absolute;left:0;right:0;bottom:0;height:64px;background:linear-gradient(rgba(255,255,255,0),var(--surface,#fff));pointer-events:none}"
    + "@media(max-width:760px){article.dmx .kpis:not(.tvux-open)>.kpi:not(:nth-child(2)):not(:nth-child(4)){display:none!important}}@media(min-width:761px){article.dmx .kpis+.tvux-more{display:none!important}}"
    /* 26/10/2026 anh Vũ duyệt "đa thiết bị": tablet cảm ứng dùng thanh mục dưới đáy như điện thoại; màn rộng thì thanh mục bám đầu trang khi cuộn */
    + "@media(min-width:761px) and (max-width:1100px) and (pointer:coarse){nav.tabs#tabs{display:none!important}#bnav{display:grid!important;grid-template-columns:repeat(5,1fr)!important;position:fixed;left:0;right:0;bottom:0;z-index:58;background:#13213B;border-top:1px solid rgba(227,192,112,.32);padding:6px 4px calc(6px + env(safe-area-inset-bottom));box-shadow:0 -10px 28px rgba(8,16,32,.28)}#bnav button{appearance:none;-webkit-appearance:none;border:0;background:none;color:#AEB9CF;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:6px 1px 4px;min-height:58px;font:600 .78rem/1.1 var(--f-ui);position:relative;cursor:pointer;text-align:center}#bnav svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}#bnav button[aria-current=page]{color:#E3C070}#bnav button[aria-current=page]::before{content:'';position:absolute;top:-6px;left:30%;right:30%;height:3px;border-radius:0 0 3px 3px;background:#E3C070}#bnav .bd{position:absolute;top:1px;left:calc(50% + 8px);min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#E3C070;color:#13213B;font:800 .66rem/18px var(--f-ui);font-style:normal}body{padding-bottom:calc(84px + env(safe-area-inset-bottom))}#tvnqa-b{bottom:calc(84px + env(safe-area-inset-bottom))!important}#tvnrn{bottom:calc(70px + env(safe-area-inset-bottom))!important}}"
    + "@media(min-width:761px){html:not(.tvux-coarse) nav.tabs#tabs{position:sticky;top:0;z-index:56;background:var(--bg,#F6F7FA);padding-top:8px;padding-bottom:8px;margin-top:12px;transition:top .22s ease}html:not(.tvux-coarse) body:not(.kxuong) nav.tabs#tabs{top:var(--tvux-khh,0px)}}"
    + "@media(min-width:641px) and (max-width:1500px){#tvnqa-b{width:52px!important;height:52px!important;min-width:0!important;padding:0!important;border-radius:50%!important;justify-content:center!important;gap:0!important}#tvnqa-b>:not(svg){display:none!important}#tvnqa-b svg{margin:0!important}}"
    + "body .ckc{--ckbg:var(--surface,#fff);--ckch:var(--chip,#EEF2F8);--ckmut:var(--mute,#5B6B85);--ckink:var(--ink,#0E1A2B);--ckln:var(--line,#E3E7EF)}"
    + "#panel .cards2 .mc .tvux-scan:not(.wide){min-height:32px;margin-top:6px;padding:2px 0;border:0;font-weight:600;font-size:13px;color:var(--navy,#1F3864)}"
    + "@media(max-width:640px){#tvnqa-b{width:44px!important;height:44px!important;opacity:.92}}"
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
    + ".tvux-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.tvux-chips button,.tvux-chips a{min-height:40px;padding:8px 14px;border-radius:999px;border:1px solid var(--line,#DCE2EC);background:var(--card,#fff);color:var(--ink,#16213A);font:600 14px inherit;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}"
    + ".tvux-chips button[aria-pressed=true]{background:var(--navy,#16294A);border-color:var(--navy,#16294A);color:#fff}.tvux-chips a{border-color:var(--gold,#C8992F);color:var(--gold,#B8860B)}"
    + ".tvux-note{margin:8px 0 0;font-size:12.5px;color:var(--mute,#5B6579)}"
    + "body.n5 article.tml>.hubtabs,body.n5 article.tml>.hubtip{display:none!important}"
    + "body.n5 article.tml>[data-hubt~=day].hubhide:not(.tvg-x),body.n5 article.tml>[data-hubt~=tq].hubhide:not(.tvg-x),body.n5 #panel>#lbslot.hubhide:not(.tvg-x){display:block!important}"
    + "body.n5 article.tml.tvux-tin>[data-hubt~=tin].hubhide:not(.tvg-x){display:block!important}"
    + "body.n5 article.tml>section.hubsec[data-hubt=tq]:not(.hubbot):not(.hubrun):not(.tvux-open){display:none!important}"
    + "body.n5 article.tml .dhkl,body.n5 article.tml .ckc .kl,body.n5 #lbslot p.klu{display:none!important}"
    + ".tvux-tog{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:48px;margin:12px 0;padding:10px 14px;border:1px dashed var(--line,#C9D2E0);border-radius:12px;background:transparent;color:var(--navy,#1F3864);font:700 14.5px inherit;cursor:pointer;text-align:left}.tvux-tog small{display:block;font-weight:500;font-size:12px;color:var(--mute,#5B6579)}"
    + "abbr.tvux-g{text-decoration:underline dotted;text-underline-offset:3px;cursor:help}"
    + "#tvux-gp{position:fixed;z-index:2147482600;max-width:300px;padding:10px 12px;border-radius:12px;background:#16294A;color:#fff;font:500 13.5px/1.45 inherit;box-shadow:0 8px 24px rgba(0,0,0,.25)}#tvux-gp b{color:#E3C070;display:block;margin-bottom:2px}"
    + "body.tvux-cd #n5tg{display:none!important}"
    + "#tvux-maph{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0;min-width:44px;height:40px;padding:0 6px;margin:0 2px;border:1px solid rgba(227,192,112,.55);border-radius:12px;background:transparent;color:#E3C070;cursor:pointer;line-height:1}"
    + "#tvux-maph span{font-size:16px}#tvux-maph small{font-size:10.5px;font-weight:600;margin-top:2px;color:#E3C070}"
    + "#tvux-maph small{white-space:nowrap}@media(max-width:420px){html.tvg-on #tvux-maph{min-width:40px;padding:0}html.tvg-on #tvux-maph small{display:none}html.tvg-on #tvux-maph span{font-size:18px}html.tvg-on #kh .lg2{display:none}}"
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
      { id: "phantich", t: "Công cụ", d: "Khi muốn đào sâu: hàm ý, vĩ mô, báo cáo, cào tin theo mã", it: [
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
    flatTamly(art, bar);
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
  /* 25/10/2026 anh Vũ duyệt gộp: bỏ tầng tab con của Tâm lý (Tổng quan, Đáy & chu kỳ hiện liền một trang, Dòng tin mở bằng nút),
     Đồng hồ tâm lý và La bàn gọi chung là Nhiệt kế, mỗi điểm một nhãn, các khối Kết luận lặp ẩn đi (Đọc nhanh ở đầu trang là kết luận duy nhất) */
  var ZONE = function (v) { return v <= -50 ? "Rất sợ" : v <= -15 ? "Lo ngại" : v < 15 ? "Bình thường" : v < 50 ? "Lạc quan" : "Hưng phấn"; };
  function flatTamly(art, bar) {
    if (bar && !owner()) { var on = bar.querySelector("button.on"); if (on && on.dataset.k !== "tq") { var t0 = bar.querySelector('button[data-k="tq"]'); if (t0) t0.click(); } }
    var dh = art.querySelector("section.dh");
    if (dh && !dh.dataset.uxn) {
      var h3 = dh.querySelector(".dhh h3, h3"); if (h3) h3.textContent = EN() ? "Thermometer · Sentiment" : "Nhiệt kế · Tâm lý";
      var v = dh.querySelector(".dhv b"), n = v ? parseInt(v.textContent.replace("−", "-"), 10) : NaN, k = dh.querySelector("p.dhk");
      if (k && !isNaN(n) && !EN()) { var kb = k.querySelector("b"); if (kb) kb.textContent = ZONE(n); if (k.firstChild && k.firstChild.nodeType === 3) k.firstChild.nodeValue = "Tâm lý: "; }
      dh.dataset.uxn = "1";
    }
    var lb = document.querySelector("#panel #laban .lh h2");
    if (lb && !lb.dataset.uxn) { lb.dataset.uxn = "1"; lb.textContent = EN() ? "Thermometer · Trend" : "Nhiệt kế · Xu hướng"; lb.title = EN() ? "TVN cycle compass" : "La bàn chu kỳ TVN"; }
    var hs = art.querySelector("section.hubsec[data-hubt=tq]:not(.hubbot):not(.hubrun)");
    var hb0 = art.querySelector(".tvux-tog[data-t=hub]"); if (hb0) hb0.style.display = (hs && hs.classList.contains("tvg-x")) ? "none" : "";   /* gói miễn phí: phần này khóa, không hiện nút */
    if (hs && !hs.classList.contains("tvg-x") && !hb0) {
      var b1 = document.createElement("button"); b1.type = "button"; b1.className = "tvux-tog"; b1.dataset.t = "hub";
      b1.innerHTML = "<span>" + (EN() ? "Four implication gauges (Hub)" : "Bốn đồng hồ hàm ý (Hub)") + "<small>" + (EN() ? "Detail behind the sentiment score" : "Chi tiết phía sau điểm Tâm lý, bấm để mở") + "</small></span><i>▾</i>";
      b1.onclick = function () { var o = hs.classList.toggle("tvux-open"); b1.querySelector("i").textContent = o ? "▴" : "▾"; };
      hs.before(b1);
    }
    var tin = [].slice.call(art.children).filter(function (e) { return (e.getAttribute("data-hubt") || "") === "tin"; });
    if (tin.length && !art.querySelector(".tvux-tog[data-t=tin]")) {
      var b2 = document.createElement("button"); b2.type = "button"; b2.className = "tvux-tog"; b2.dataset.t = "tin";
      b2.innerHTML = "<span>" + (EN() ? "News flow, policy, forum" : "Dòng tin, chính sách, diễn đàn") + "<small>" + (EN() ? "What the market is talking about" : "Thị trường đang bàn gì, chính sách nói gì, bấm để mở") + "</small></span><i>▾</i>";
      b2.onclick = function () { var o = art.classList.toggle("tvux-tin"); b2.querySelector("i").textContent = o ? "▴" : "▾"; if (o) setTimeout(function () { b2.scrollIntoView({ behavior: "smooth", block: "start" }); }, 30); };
      tin[0].before(b2);
    }
  }
  /* Hôm nay: thẻ tâm lý thành Nhiệt kế, một nhãn theo vùng, thêm dòng Xu hướng (La bàn) khi được xem */
  var LBX = null; try { fetch(BASE + "la_ban.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { LBX = j && (j.latest || j.chinh_thuc); soon(); }).catch(function () { }); } catch (e) { }
  function tidyHomeNk() {
    if (EN()) return;
    document.querySelectorAll(".hn .cd.rt").forEach(function (c) {
      var lb2 = c.querySelector("p.lb2"); if (!lb2 || !/^Đồng hồ tâm lý$|^Nhiệt kế thị trường$/.test(lb2.textContent.trim())) return;
      lb2.textContent = "Nhiệt kế thị trường";
      var b = c.querySelector(".dh1 b"), sp = c.querySelector(".dh1 span"), n = b ? parseInt(b.textContent.replace("−", "-"), 10) : NaN;
      if (sp && !isNaN(n)) sp.textContent = "Tâm lý · " + ZONE(n);
      var ky = c.querySelector("p.ky"); if (ky) ky.style.display = "none";
      var nt = c.querySelector("p.rlnote"); if (nt) nt.textContent = "Tâm lý gộp giọng báo chí, diễn đàn và chính sách.";
      var x = c.querySelector(".tvux-xu");
      if (LBX && LBX.da_thi_truong) {
        var lk = lockOf("tam_ly");
        if (!x) { x = document.createElement("p"); x.className = "tvux-xu"; x.style.cssText = "margin:6px 0 0;font-size:14px;font-weight:600"; (c.querySelector(".dh1") || lb2).after(x); }
        var d = LBX.da_thi_truong.diem, txt = "Xu hướng · " + (LBX.da_thi_truong.trang_thai || "") + " (" + (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(d) + ", La bàn)";
        x.innerHTML = lk ? "Xu hướng · " + lk.trim() + ' <span style="font-weight:500;color:var(--mute,#5B6579)">gói TVN-Trading</span>' : esc(txt);
      }
      var go = c.querySelector("button.go"); if (go && /tâm lý/i.test(go.textContent)) go.textContent = "Xem Nhiệt kế →";
    });
  }
  /* Thuật ngữ: chạm để xem nghĩa */
  var GL = [
    ["T+2", "Sau 2 phiên giao dịch kể từ ngày khuyến nghị (cổ phiếu mua hôm nay về tài khoản sau 2 phiên)."],
    ["giá bình quân", "Giá trung bình theo khối lượng khớp trong phiên. Nhiều mã khớp trên giá bình quân là người mua chấp nhận trả giá cao."],
    ["MA50", "Đường trung bình giá đóng cửa 50 phiên gần nhất, thước đo xu hướng trung hạn."],
    ["đọc thuận chiều", "Điểm càng cao càng tốt: đà lên là thị trường khỏe."],
    ["đọc ngược chiều", "Đám đông càng sợ (điểm thấp) thì lịch sử thường càng gần đáy; càng hưng phấn thì càng gần đỉnh."],
    ["biên độ 60 phiên", "Vị trí của VN-Index giữa mức thấp nhất (0%) và cao nhất (100%) trong 60 phiên gần nhất."],
    ["bán ròng", "Giá trị bán nhiều hơn giá trị mua trong phiên."],
    ["mua ròng", "Giá trị mua nhiều hơn giá trị bán trong phiên."],
    ["khớp lệnh", "Giá trị giao dịch khớp trên sàn, không tính giao dịch thỏa thuận."],
    ["tỷ trọng", "Phần trăm vốn đang nắm cổ phiếu, phần còn lại để tiền mặt."],
    ["Đà thị trường", "Điểm La bàn gộp vĩ mô, kỹ thuật, dòng tiền, mức rơi cổ phiếu; trên +30 là đà lên, dưới −30 là đà xuống."],
    ["cắt lỗ", "Mức giá nếu thủng thì nên bán để giới hạn thua lỗ."]
  ];
  var GLRX = new RegExp("(" + GL.map(function (g) { return g[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "i");
  function gloss() {
    if (EN()) return;
    var roots = [document.getElementById("panel"), document.getElementById("n5q")].filter(Boolean);
    roots.forEach(function (root) {
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
        var p = n.parentElement; if (!p || !n.nodeValue || n.nodeValue.length < 3) return NodeFilter.FILTER_REJECT;
        if (p.closest("abbr,a,button,svg,script,style,textarea,input,select,summary,.tvux-tog,#tvux-map,.qh,h1,h2,h3,[data-tvgm],.tvg-lk")) return NodeFilter.FILTER_REJECT;
        return GLRX.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
      var list = [], x; while ((x = w.nextNode()) && list.length < 200) list.push(x);
      list.forEach(function (tn) {
        var m = GLRX.exec(tn.nodeValue); if (!m) return;
        var g = GL.filter(function (z) { return z[0].toLowerCase() === m[1].toLowerCase(); })[0]; if (!g) return;
        if (root.querySelector('abbr.tvux-g[data-g="' + g[0] + '"]')) return;          /* mỗi thuật ngữ chỉ gạch một lần trong mỗi vùng */
        var after = tn.splitText(m.index); after.splitText(m[1].length);
        var ab = document.createElement("abbr"); ab.className = "tvux-g"; ab.title = g[1]; ab.dataset.g = g[0]; ab.textContent = after.nodeValue; after.replaceWith(ab);
      });
    });
  }
  document.addEventListener("click", function (e) {                    /* nút "Xem Dòng tin (miễn phí)" của ô khóa: mở khối Dòng tin thay cho tab con đã bỏ */
    var tv = e.target.closest && e.target.closest('[data-tvg="tin"]'); if (!tv) return;
    var art = document.querySelector("#panel article.tml"), b = art && art.querySelector(".tvux-tog[data-t=tin]"); if (!b) return;
    e.preventDefault(); e.stopPropagation(); if (!art.classList.contains("tvux-tin")) b.click(); else b.scrollIntoView({ behavior: "smooth", block: "start" });
  }, true);
  document.addEventListener("click", function (e) {
    var old = document.getElementById("tvux-gp"), ab = e.target.closest && e.target.closest("abbr.tvux-g");
    if (old) old.remove(); if (!ab) return;
    var g = GL.filter(function (z) { return z[0] === ab.dataset.g; })[0]; if (!g) return;
    var p = document.createElement("div"); p.id = "tvux-gp"; p.innerHTML = "<b>" + esc(g[0]) + "</b>" + esc(g[1]); document.body.appendChild(p);
    var r = ab.getBoundingClientRect(), W = Math.min(300, innerWidth - 24); p.style.width = W + "px";
    p.style.left = Math.max(12, Math.min(innerWidth - W - 12, r.left)) + "px"; p.style.top = (r.bottom + 8 + p.offsetHeight > innerHeight ? Math.max(8, r.top - p.offsetHeight - 8) : r.bottom + 8) + "px";
  }, true);
  function tidySettings() {
    var p = document.getElementById("panel"); if (!p) return;
    var isCd = !!p.querySelector("#thsg"); document.body.classList.toggle("tvux-cd", isCd);   /* 25/10: Cài đặt không hiện thẻ Thế giới của Hôm nay */
    var hn = p.querySelector(".hn"); if (!hn || !isCd) return;
    var oldMap = p.querySelector(".tvux-mapcd"); if (oldMap) oldMap.remove();    /* Sơ đồ đã có nút trên thanh đầu, không lặp ở Cài đặt */
    acctCard(hn); startCard(hn);
  }
  /* Mở app vào trang nào (lưu trên máy) */
  var START = [["last", "Trang xem lần trước", "Last viewed"], ["homnay", "Hôm nay", "Today"], ["khuyennghi", "Khuyến nghị", "Picks"], ["bantin", "Bản tin mới nhất", "Latest bulletin"]];
  function startCard(hn) {
    if (hn.querySelector(".tvux-start")) return;
    var cur = LS("tvn_start") || "last", c = document.createElement("div"); c.className = "cd tvux-start";
    c.innerHTML = '<p class="lb2">' + (EN() ? "Open the app on" : "Mở app vào") + '</p><div class="tvux-chips">' + START.map(function (x) { return '<button type="button" data-v="' + x[0] + '" aria-pressed="' + (cur === x[0]) + '">' + esc(EN() ? x[2] : x[1]) + "</button>"; }).join("") + '</div><p class="tvux-note">' + (EN() ? "Saved on this device." : "Lưu trên máy này, lần mở app sau sẽ vào thẳng trang đã chọn.") + "</p>";
    c.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("button[data-v]"); if (!b) return; LS("tvn_start", b.dataset.v === "last" ? null : b.dataset.v); c.querySelectorAll("button[data-v]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); });
    var t = hn.querySelector("#thsg"), hs = t && t.closest(".cd"); if (hs && hs.parentNode === hn) hs.after(c); else hn.appendChild(c);   /* ngay sau Hiển thị */
  }
  /* Tài khoản: chỉ hiện khi trang đã nạp tvn-auth.js (từ ngày bật mở bán) */
  function acctCard(hn) {
    var A = window.TVNAuth; if (!A || typeof A.phien !== "function") return;
    var ph = {}; try { ph = A.phien() || {}; } catch (e) { }
    var sig = JSON.stringify([ph.dang_nhap, ph.goi, ph.han, ph.con_ngay]), old = hn.querySelector(".tvux-acct");
    if (old && old.dataset.sig === sig) return;
    var c = old || document.createElement("div"); c.className = "cd tvux-acct"; c.dataset.sig = sig;
    var on = !!ph.dang_nhap, ten = ph.ten_hien_thi || ph.ten || "", paid = (ph.quyen || []).length > 0;
    var han = ph.han ? String(ph.han).slice(0, 10).split("-").reverse().join("/") : "";
    var line = !on ? "Chưa đăng nhập. Gói TVN-Trading (3 triệu đồng / 3 tháng) mở khuyến nghị đủ vùng giá, Tâm lý và La bàn, số cũ, Vĩ mô đầy đủ, hỏi đáp."
      : (paid ? "Gói TVN-Trading" + (han ? " · dùng đến " + han : "") + (ph.con_ngay != null ? " (còn " + ph.con_ngay + " ngày)" : "") : "Tài khoản miễn phí");
    c.innerHTML = '<p class="lb2">Tài khoản</p>' + (on && ten ? '<p style="margin:4px 0 0;font-weight:700">' + esc(ten) + "</p>" : "") + '<p class="tvux-note" style="margin-top:4px">' + esc(line) + '</p><div class="tvux-chips">'
      + (on ? '<button type="button" data-a="mk">Đổi mật khẩu</button><button type="button" data-a="out">Đăng xuất</button>' : '<button type="button" data-a="in">Đăng nhập</button>')
      + '<a href="tel:0938004541">' + (on && paid ? "Gia hạn: 0938 004 541" : "Đăng ký gói: 0938 004 541") + "</a></div>";
    c.onclick = function (e) { var b = e.target.closest && e.target.closest("button[data-a]"); if (!b) return; var k = b.dataset.a;
      try { if (k === "in") A.moDangNhap(); else if (k === "out") A.dangXuat(); else if (k === "mk" && A.moDoiMk) A.moDoiMk(); } catch (er) { } };
    if (!old) hn.insertBefore(c, hn.firstElementChild || null);
  }
  function helpBtn() {
    var kin = document.querySelector("#kh .in");                    /* 25/10: nút Sơ đồ luôn thấy trên thanh đầu, cạnh nút cài đặt */
    if (kin && !document.getElementById("tvux-maph")) {
      var hb = document.createElement("button"); hb.type = "button"; hb.id = "tvux-maph"; hb.setAttribute("aria-label", EN() ? "Site map" : "Sơ đồ trang"); hb.title = EN() ? "Site map" : "Sơ đồ trang";
      hb.innerHTML = '<span aria-hidden="true">🗺</span><small>' + (EN() ? "Map" : "Sơ đồ") + "</small>"; hb.onclick = openMap;
      var btns = kin.querySelectorAll(":scope > button"), last = btns[btns.length - 1];
      if (last && last !== kin.firstElementChild) kin.insertBefore(hb, last); else kin.appendChild(hb);
    }
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
  /* 26/10/2026: Hôm nay chỉ giữ ý chính, phần chi tiết bấm mới mở; Khuyến nghị hiện 2 ô số chính */
  function moreBtn(after, label, labelOpen, target, cls, xc) {
    if (!after || !after.parentNode) return;
    var nx = after.nextElementSibling; if (nx && nx.classList.contains("tvux-more")) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "tvux-more" + (xc ? " " + xc : "");
    var sync = function () { b.textContent = target.classList.contains(cls) ? labelOpen : label; };
    b.addEventListener("click", function () { target.classList.toggle(cls); sync(); }); sync();
    after.parentNode.insertBefore(b, after.nextSibling);
  }
  function tidyLen() {
    var en = EN();
    try { var kh = document.getElementById("kh"); if (kh) document.documentElement.style.setProperty("--tvux-khh", kh.offsetHeight + "px"); if (matchMedia("(min-width:761px) and (max-width:1100px) and (pointer:coarse)").matches) document.documentElement.classList.add("tvux-coarse"); else document.documentElement.classList.remove("tvux-coarse"); } catch (e) { }
    if (document.body.classList.contains("v-homnay")) {
      var lv = document.getElementById("live"), lk = lv && lv.querySelector(":scope > .lk");
      if (lk && lv.querySelector(":scope > ul.pts, :scope > .bimg")) moreBtn(lk, en ? "Session detail, average price, chart ▾" : "Xem diễn biến phiên, giá bình quân, biểu đồ ▾", en ? "Collapse ▴" : "Thu gọn ▴", lv, "tvux-lvo");
      document.querySelectorAll("#panel .hn .cd").forEach(function (c) {
        var hd = c.querySelector(".lb2, h3, h4, .t, b"), t = (c.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40).toUpperCase();
        if (/^(CON SỐ TRONG NGÀY|NUMBERS OF THE DAY|KEY NUMBERS)/.test(t)) { var L = (typeof live !== "undefined" && live && live.latest) ? live.latest : null; if (L) c.classList.add("tvux-hide"); return; }
        if (/^(THỊ TRƯỜNG ĐANG NÓI GÌ|ĐIỂM NÓNG QUỐC TẾ|SẮP TỚI|WHAT THE MARKET|GLOBAL HOTSPOTS|COMING UP)/.test(t) && c.scrollHeight > 260) {
          if (!c.classList.contains("tvux-fold")) c.classList.add("tvux-fold");
          moreBtn(c, en ? "Show more ▾" : "Xem thêm ▾", en ? "Collapse ▴" : "Thu gọn ▴", c, "open");
        }
      });
    }
    var kp = document.querySelector("#panel article.dmx .kpis");
    if (kp && kp.children.length > 3) moreBtn(kp, (en ? "More figures (" : "Xem thêm ") + (kp.children.length - 2) + (en ? ") ▾" : " chỉ số ▾"), en ? "Collapse ▴" : "Thu gọn ▴", kp, "tvux-open");
  }
  function knOpen() { if (!matchMedia("(min-width:761px)").matches) return; var d = document.querySelector(".dmx .row2 details:not([data-uxo])"); if (d) { d.dataset.uxo = "1"; d.open = true; } }
  function tidyTT() {
    var en = EN(), art = document.querySelector("#panel article.tml"); if (!art) return;
    var dh = art.querySelector("section.dh"), nc = dh && dh.querySelector(":scope > .dhnc"), dm = dh && dh.querySelector(":scope > .dhm");
    if (nc && dm) moreBtn(dm, en ? "Contrarian view (Compass) ▾" : "Góc nhìn ngược chiều (La bàn) ▾", en ? "Collapse ▴" : "Thu gọn ▴", dh, "tvux-o", "m-only");
    var lb = document.querySelector("#panel #laban"), lx = lb && lb.querySelector(":scope > details.lbx");
    if (lx && lb.querySelector(":scope > .disc")) moreBtn(lx, en ? "Sources and back-test ▾" : "Nguồn và kiểm chứng La bàn ▾", en ? "Collapse ▴" : "Thu gọn ▴", lb, "tvux-o", "m-only");
    if (matchMedia("(max-width:760px)").matches) {
      var ck = [].slice.call(document.querySelectorAll("#panel .ckc")), last = ck[ck.length - 1];
      var fold = function (c) { if (!c || c.scrollHeight <= 260) return; if (!c.classList.contains("tvux-fold")) c.classList.add("tvux-fold"); moreBtn(c, en ? "Show more ▾" : "Xem thêm ▾", en ? "Collapse ▴" : "Thu gọn ▴", c, "open", "m-only"); };
      if (ck.length > 1) fold(last);
      [].slice.call(art.querySelectorAll(":scope > section.tmb")).forEach(function (sct) { if (/^(BA ĐIỀU ĐỌNG LẠI|THREE TAKEAWAYS)/.test((sct.textContent || "").trim().toUpperCase())) fold(sct); });
    }
  }
  function deskTop() {
    var wide = matchMedia("(min-width:1100px)").matches && !document.documentElement.classList.contains("tvux-coarse") && document.body.classList.contains("v-homnay");
    var row = document.getElementById("tvux-row"), lv = document.getElementById("live");
    document.body.classList.toggle("tvux-desk", !!wide);
    if (!wide) { if (row && lv) { [].slice.call(row.querySelector(".l").children).forEach(function (c) { lv.parentNode.insertBefore(c, lv); }); row.remove(); } return; }
    var q = document.getElementById("n5q"), tg = document.getElementById("n5tg"); if (!lv || !q) return;
    if (!row) { row = document.createElement("div"); row.id = "tvux-row"; row.innerHTML = '<div class="l"></div><aside><div class="hn"><div class="hc r"></div></div></aside>'; }
    if (row.nextElementSibling !== lv) lv.parentNode.insertBefore(row, lv);
    var L = row.querySelector(".l"), R = row.querySelector("aside .hc");
    if (q.parentNode !== L) L.insertBefore(q, L.firstChild);
    if (tg && tg.parentNode !== L) L.appendChild(tg);
    var rail = document.querySelector("#panel .hn .hc.r"), cards = rail ? [].slice.call(rail.children).filter(function (c) { return c.classList.contains("cd"); }) : [];
    if (cards.length) { R.innerHTML = ""; cards.forEach(function (c) { R.appendChild(c); }); }
  }
  function apply() {
    if (busy) return; busy = true;
    try { hintOnce(); helpBtn(); tidyHome(); tidyBantin(); tidyKN(); tidyTamly(); tidyHomeNk(); tidySettings(); scanBtns(); tidyLen(); deskTop(); knOpen(); tidyTT(); gloss(); minFont(); } catch (e) { if (window.console) console.warn("tvn-ux", e); }
    busy = false;
  }
  var t = 0; function soon() { clearTimeout(t); t = setTimeout(apply, 80); }
  function start() {
    try { var sp = LS("tvn_start"); if (sp && /^(homnay|khuyennghi|bantin)$/.test(sp) && !/[?&](p|f|t)=/.test(q) && !location.hash && typeof goTab === "function") goTab(sp); } catch (e) { }
    apply();
    var pn = document.getElementById("panel") || document.body;
    new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var x = ms[i].target; if (x && x.closest && x.closest("#tvux-map")) continue; soon(); return; } }).observe(pn, { childList: true, subtree: true });
    if (/[?&]map=1\b/.test(q)) setTimeout(openMap, 600);                       /* trang Thế giới, Vĩ mô, Hub mở sơ đồ bằng ?map=1 */
    if (!LS("tvn_map_v1") && !/[?&](p|f)=/.test(q)) setTimeout(function () { if (!LS("tvn_map_v1") && !document.getElementById("tvux-map")) openMap(); }, 2500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
