/* ============================================================
   app.js — renders the three page types from COURSE data
     home      : subject grid, search, stats
     subject   : module list for one subject
     module    : one module's notes, with a sticky contents rail
   Data lives in data.js (window.COURSE).
   ============================================================ */
(function () {
  "use strict";

  var C = window.COURSE || { subjects: [], notes: {} };
  var PROG_KEY = "sem2-progress";

  /* ---------- tiny helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function q(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function subById(id) {
    for (var i = 0; i < C.subjects.length; i++) if (C.subjects[i].id === id) return C.subjects[i];
    return null;
  }
  function modsOf(id) {
    var list = C.notes[id] || [];
    return list.slice().sort(function (a, b) { return a.n - b.n; });
  }
  function accentVars(s) {
    if (!s || !s.accent) return "";
    return ' style="--acc:var(--' + s.accent + ');--acc-soft:var(--' + s.accent + '-soft)"';
  }
  function href(subject, m) {
    return "module.html?id=" + encodeURIComponent(subject) + "&m=" + m;
  }
  function subHref(id) { return "subject.html?id=" + encodeURIComponent(id); }

  /* ---------- progress (which modules you have read) ---------- */
  function readProgress() {
    try {
      var raw = localStorage.getItem(PROG_KEY);
      var o = raw ? JSON.parse(raw) : {};
      return (o && typeof o === "object") ? o : {};
    } catch (e) { return {}; }
  }
  function writeProgress(o) {
    try { localStorage.setItem(PROG_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function isRead(id, n) {
    var p = readProgress();
    return !!(p[id] && p[id].indexOf(n) !== -1);
  }
  function setRead(id, n, on) {
    var p = readProgress();
    var arr = p[id] || [];
    var i = arr.indexOf(n);
    if (on && i === -1) arr.push(n);
    if (!on && i !== -1) arr.splice(i, 1);
    p[id] = arr;
    writeProgress(p);
  }
  function readCount(id) {
    var p = readProgress();
    return (p[id] || []).length;
  }

  /* ---------- shared chrome ---------- */
  function topbar(active) {
    var links = C.subjects.map(function (s) {
      return '<a href="' + subHref(s.id) + '"' + (active === s.id ? ' aria-current="page"' : "") +
        '>' + esc(s.short || s.code) + "</a>";
    }).join("");
    return '<header class="topbar">' +
      '<a class="brand" href="index.html"><span class="brand-mark">II</span><span class="brand-name">Semester II Notes</span></a>' +
      '<nav class="topnav">' + links + "</nav>" +
      '<button class="theme-btn" id="themeBtn" type="button" aria-pressed="false" ' +
      'aria-label="Switch between light and dark mode" title="Switch to dark mode">' +
      '<svg class="t-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.9A8.6 8.6 0 1 1 11.1 3a6.7 6.7 0 0 0 9.9 9.9Z"/></svg>' +
      '<svg class="t-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.2v2.2M12 19.6v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.2 12h2.2M19.6 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>' +
      "</button></header>";
  }
  function mountChrome(active) {
    var host = $("#chrome");
    if (host) host.outerHTML = topbar(active);
    var btn = $("#themeBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        var root = document.documentElement;
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        try { localStorage.setItem("sem2-theme", next); } catch (e) {}
        root.setAttribute("data-theme", next);
        var meta = document.getElementById("themeColor");
        if (meta) meta.setAttribute("content", next === "dark" ? "#14110e" : "#f7f3ee");
        btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
        btn.title = next === "dark" ? "Switch to light mode" : "Switch to dark mode";
      });
      // reflect whatever theme.js decided
      var mode = document.documentElement.getAttribute("data-theme") || "light";
      btn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
      btn.title = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
  }
  function foot(note) {
    return '<footer class="foot"><span>' + esc(note || "Semester II · class notes") +
      '</span><span><a href="index.html">All subjects</a> · built for offline reading</span></footer>';
  }


  /* ---------- typeset maths (KaTeX, vendored so it works offline) ---------- */
  function typesetMath(root) {
    if (!window.renderMathInElement) return;
    var host = root || document.getElementById("page");
    if (!host) return;
    window.renderMathInElement(host, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
      throwOnError: false
    });
    var eqs = host.querySelectorAll(".fml-eq, .eqn");
    for (var i = 0; i < eqs.length; i++) eqs[i].classList.add("is-math");
  }

  /* ---------- section labels ---------- */
  var KIND = {
    big: { kicker: "Start here", label: "Big picture" },
    basics: { kicker: "Prerequisites", label: "Basics first" },
    concept: { kicker: "Concept", label: "Concept" },
    formula: { kicker: "Rules & formulas", label: "Formulas" },
    example: { kicker: "Worked out", label: "Examples" },
    trap: { kicker: "Watch out", label: "Traps" },
    revision: { kicker: "Night before", label: "Revision box" }
  };

  /* ============================================================
     HOME
     ============================================================ */
  function renderHome() {
    var totalMods = 0, totalQ = 0, totalSections = 0;
    C.subjects.forEach(function (s) {
      var ms = modsOf(s.id);
      totalMods += ms.length;
      ms.forEach(function (m) {
        totalQ += (m.practice || []).length;
        totalSections += (m.sections || []).length;
      });
    });

    var grid = C.subjects.map(function (s) {
      var ms = modsOf(s.id);
      var done = readCount(s.id);
      var pct = ms.length ? Math.round(done / ms.length * 100) : 0;
      return '<a class="subj-card" href="' + subHref(s.id) + '"' + accentVars(s) + ">" +
        '<div class="subj-code">' + esc(s.code) + "</div>" +
        "<h3>" + esc(s.name) + "</h3>" +
        "<p>" + esc(s.desc) + "</p>" +
        '<div class="mini-bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="subj-foot"><span>' + ms.length + " modules · " +
        ms.reduce(function (a, m) { return a + (m.practice || []).length; }, 0) + " Qs</span>" +
        '<span class="go">' + (done ? done + "/" + ms.length + " read" : "open →") + "</span></div></a>";
    }).join("");

    var totalTopics = 0;
    var syl = C.syllabus || {};
    Object.keys(syl).forEach(function (k) { totalTopics += syl[k].topics || 0; });

    var stats = '<div class="stats">' +
      '<div><div class="v">' + totalMods + '</div><div class="k">Modules</div></div>' +
      '<div><div class="v">' + totalSections + '</div><div class="k">Note sections</div></div>' +
      '<div><div class="v">' + totalQ + '</div><div class="k">Practice questions</div></div>' +
      '<div><div class="v">' + totalTopics + '</div><div class="k">Syllabus sub-topics</div></div>' +
      "</div>";

    $("#subjectGrid").innerHTML = grid;
    $("#stats").innerHTML = stats;
    $("#footHost").innerHTML = foot("Semester II · " + totalMods + " modules · offline friendly");
    setupSearch();
  }

  function setupSearch() {
    var input = $("#search");
    var hits = $("#hits");
    if (!input) return;

    var index = [];
    C.subjects.forEach(function (s) {
      index.push({ kind: "subject", id: s.id, title: s.name, sub: s.short || s.code, m: null,
        text: (s.name + " " + s.code + " " + s.desc).toLowerCase() });
      modsOf(s.id).forEach(function (m) {
        var secText = (m.sections || []).map(function (x) { return x.title || ""; }).join(" ");
        index.push({ kind: "module", id: s.id, title: "M" + m.n + " · " + m.title, sub: s.short || s.code,
          m: m.n, text: (m.title + " " + (m.tagline || "") + " " + secText + " " + s.name).toLowerCase() });
      });
    });

    function run() {
      var v = input.value.trim().toLowerCase();
      if (v.length < 2) { hits.innerHTML = ""; return; }
      var out = index.filter(function (r) { return r.text.indexOf(v) !== -1; }).slice(0, 14);
      if (!out.length) {
        hits.innerHTML = '<div class="empty-note">Nothing matched “' + esc(input.value.trim()) + '”. Try a topic like <em>recursion</em>, <em>gradient</em> or <em>particles</em>.</div>';
        return;
      }
      hits.innerHTML = out.map(function (r) {
        var hrefTo = r.kind === "subject" ? subHref(r.id) : href(r.id, r.m);
        return '<a class="hit" href="' + hrefTo + '"><span class="sub">' + esc(r.sub) + "</span>" +
          "<span>" + esc(r.title) + '</span><span class="mt">' +
          (r.kind === "subject" ? "subject" : "module " + r.m) + "</span></a>";
      }).join("");
    }
    input.addEventListener("input", run);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = $(".hit", hits);
        if (first) window.location.href = first.getAttribute("href");
      }
      if (e.key === "Escape") { input.value = ""; hits.innerHTML = ""; }
    });
  }

  /* ============================================================
     SUBJECT PAGE
     ============================================================ */
  function renderSubject() {
    var id = q("id");
    var s = subById(id);
    if (!s) { notFound("That subject does not exist."); return; }
    var ms = modsOf(id);
    var done = readCount(id);
    var qCount = ms.reduce(function (a, m) { return a + (m.practice || []).length; }, 0);

    document.title = s.name + " · Semester II notes";

    var syl = (C.syllabus || {})[id];
    var sylRow = syl ? '<a class="mod-row mod-row--syl" href="syllabus.html?id=' + encodeURIComponent(id) + '">' +
      '<div class="mod-n">00</div>' +
      "<div><h3>Syllabus</h3><p>Every unit and sub-topic this subject is examined on, in order — " +
      "read it before the first module and again before the exam.</p></div>" +
      '<div class="mod-meta"><span>' + ((syl.sections || []).length) + " units</span><span>·</span><span>" +
      (syl.topics || 0) + " sub-topics</span><span>·</span><span>no reading time</span>" +
      '<span class="arrow">→</span></div></a>' : "";

    var rows = ms.map(function (m) {
      var read = isRead(id, m.n);
      var secs = (m.sections || []).length;
      return '<a class="mod-row" href="' + href(id, m.n) + '">' +
        '<div class="mod-n">' + (m.n < 10 ? "0" + m.n : m.n) + "</div>" +
        "<div><h3>" + esc(m.title) + "</h3><p>" + esc(m.tagline || "") + "</p></div>" +
        '<div class="mod-meta">' +
        '<span class="done-mark' + (read ? " on" : "") + '">✓</span>' +
        "<span>" + (m.minutes || 12) + " min</span><span>·</span><span>" + secs + " sections</span>" +
        "<span>·</span><span>" + (m.practice || []).length + " Qs</span>" +
        '<span class="arrow">→</span></div></a>';
    }).join("");

    var idx = C.subjects.indexOf(s);
    var prev = C.subjects[idx - 1], next = C.subjects[idx + 1];

    $("#page").innerHTML =
      '<div class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>' +
      "<span>" + esc(s.short || s.code) + "</span><span class=\"sep\">/</span>" +
      '<span class="here">Modules</span></div>' +
      '<header class="hero"' + accentVars(s) + ">" +
      '<div class="eyebrow">' + esc(s.code) + '<span class="dot"></span>Semester 2' +
      '<span class="dot"></span>' + ms.length + " modules</div>" +
      "<h1>" + esc(s.name) + "</h1>" +
      '<p class="lede">' + esc(s.desc) + "</p>" +
      '<div class="chips">' +
      '<span class="chip"><b>' + ms.length + "</b> modules</span>" +
      '<span class="chip"><b>' + qCount + "</b> practice questions</span>" +
      '<span class="chip"><b>' + done + "/" + ms.length + "</b> read</span>" +
      '<a class="chip chip--acc" href="syllabus.html?id=' + encodeURIComponent(s.id) + '">syllabus →</a>' +
      "</div></header>" +
      '<div class="mod-list">' + sylRow + rows + "</div>" +
      '<div class="pager">' +
      (prev ? '<a href="' + subHref(prev.id) + '"><span class="dir">← Previous subject</span>' +
        '<span class="ttl">' + esc(prev.name) + "</span></a>"
        : '<a class="disabled" href="#"><span class="dir">← Previous subject</span><span class="ttl">—</span></a>') +
      (next ? '<a class="next" href="' + subHref(next.id) + '"><span class="dir">Next subject →</span>' +
        '<span class="ttl">' + esc(next.name) + "</span></a>"
        : '<a class="next disabled" href="#"><span class="dir">Next subject →</span><span class="ttl">—</span></a>') +
      "</div>" + foot(s.code + " · " + ms.length + " modules");
  }

  /* ============================================================
     MODULE PAGE
     ============================================================ */
  function renderModule() {
    var id = q("id"), n = parseInt(q("m"), 10);
    var s = subById(id);
    var ms = modsOf(id);
    var m = null;
    for (var i = 0; i < ms.length; i++) if (ms[i].n === n) m = ms[i];
    if (!s || !m) { notFound("That module does not exist."); return; }

    document.title = s.short + " M" + m.n + " · " + m.title;

    var secs = m.sections || [];
    var practice = m.practice || [];
    var read = isRead(id, m.n);

    /* --- body --- */
    var body = secs.map(function (sec, i) {
      var meta = KIND[sec.kind] || KIND.concept;
      var num = sec.kind === "concept" ? (sec.num || (i + 1)) : "—";
      var inner = sec.kind === "revision" ? '<div class="rev">' + sec.html + "</div>" : sec.html;
      return '<section class="sec" id="s' + i + '">' +
        '<div class="sec-head"><div class="sec-num">' + esc(num) + "</div>" +
        "<div><div class=\"sec-kicker\">" + esc(meta.kicker) + "</div>" +
        "<h2>" + esc(sec.title) + "</h2></div></div>" +
        '<div class="sec-body">' + inner + "</div></section>";
    }).join("");

    var quiz = "";
    if (practice.length) {
      quiz = '<section class="sec" id="practice">' +
        '<div class="sec-head"><div class="sec-num">—</div>' +
        '<div><div class="sec-kicker">Test yourself</div><h2>Practice questions</h2></div></div>' +
        '<div class="sec-body"><p class="small">Click a question to open the worked answer. ' +
        practice.length + " questions, easy to exam level.</p>" +
        '<div class="quiz">' + practice.map(function (p, i) {
          var tag = (p.tag || "").toLowerCase();
          return '<details class="q"><summary><span class="q-n">' + (i + 1 < 10 ? "0" : "") + (i + 1) +
            "</span><span>" + (p.qHtml || esc(p.q)) + '</span><span class="q-tag t-' + esc(tag) + '">' +
            esc(p.tag || "") + "</span></summary>" +
            '<div class="a">' + (p.a || "") + "</div></details>";
        }).join("") + "</div>" +
        '<div class="quiz-bar"><span>' + practice.length + " questions</span>" +
        '<button type="button" id="revealAll">Reveal all answers</button></div>' +
        "</div></section>";
    }

    /* --- contents rail --- */
    var toc = '<div class="toc-title">Contents</div>' +
      '<a class="toc-syl" href="syllabus.html?id=' + encodeURIComponent(id) + '">' +
      '<span class="n">00</span>Syllabus</a><div class="toc-sep"></div>' +
      secs.map(function (sec, i) {
      var meta = KIND[sec.kind] || KIND.concept;
      var num = sec.kind === "concept" ? (sec.num || "") : "—";
      var short = sec.title;
      if (short.length > 46) {
        short = short.slice(0, 46);
        var sp = short.lastIndexOf(" ");
        if (sp > 26) short = short.slice(0, sp);
        short += "…";
      }
      return '<a href="#s' + i + '"><span class="n">' + esc(num) + "</span>" + esc(short) + "</a>";
    }).join("") +
      (practice.length ? '<div class="toc-sep"></div><a href="#practice"><span class="n">—</span>Practice (' +
        practice.length + ")</a>" : "") +
      '<div class="toc-meta">' + esc(s.short || s.code) + " · module " + m.n + " of " + ms.length +
      "<br>read time <b>" + (m.minutes || 12) + " min</b><br>subject read <b>" + readCount(id) + "/" +
      ms.length + "</b></div>";

    /* --- pager --- */
    var prevM = null, nextM = null;
    for (var k = 0; k < ms.length; k++) {
      if (ms[k].n === m.n) {
        prevM = ms[k - 1] || null;
        nextM = ms[k + 1] || null;
      }
    }
    var pager = '<div class="pager">' +
      (prevM ? '<a href="' + href(id, prevM.n) + '"><span class="dir">← Module ' + prevM.n +
        '</span><span class="ttl">' + esc(prevM.title) + "</span></a>"
        : '<a href="syllabus.html?id=' + encodeURIComponent(id) + '"><span class="dir">← 00 · Syllabus</span>' +
        '<span class="ttl">' + esc(s.name) + " syllabus</span></a>") +
      (nextM ? '<a class="next" href="' + href(id, nextM.n) + '"><span class="dir">Module ' + nextM.n +
        ' →</span><span class="ttl">' + esc(nextM.title) + "</span></a>"
        : '<a class="next" href="' + subHref(id) + '"><span class="dir">Next →</span><span class="ttl">' +
        esc(s.name) + " · all modules</span></a>") +
      "</div>";

    $("#page").innerHTML =
      '<div class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>' +
      '<a href="' + subHref(id) + '">' + esc(s.short || s.code) + '</a><span class="sep">/</span>' +
      '<span class="here">Module ' + m.n + "</span></div>" +
      '<div class="wrap">' +
      '<nav class="toc" id="toc" aria-label="Module contents">' + toc + "</nav>" +
      '<div class="main">' +
      '<header class="hero"' + accentVars(s) + ">" +
      '<div class="eyebrow">' + esc(s.short || s.code) + '<span class="dot"></span>Module ' + m.n +
      '<span class="dot"></span>class notes</div>' +
      "<h1>" + esc(m.title) + "</h1>" +
      '<p class="lede">' + esc(m.tagline || "") + "</p>" +
      '<div class="chips">' +
      '<span class="chip"><b>' + (m.minutes || 12) + "</b> min read</span>" +
      '<span class="chip"><b>' + secs.length + "</b> sections</span>" +
      '<span class="chip"><b>' + practice.length + "</b> practice Qs</span>" +
      '<a class="chip chip--acc" href="syllabus.html?id=' + encodeURIComponent(s.id) +
      '">' + esc(s.name) + " · syllabus</a></div>" +
      '<button class="read-btn' + (read ? " on" : "") + '" id="readBtn" type="button">' +
      '<span class="tick">✓</span><span>' + (read ? "Marked as read" : "Mark as read") + "</span></button>" +
      "</header>" +
      body + quiz + pager +
      foot(s.code + " · module " + m.n + " of " + ms.length) +
      "</div></div>";

    /* --- behaviour --- */
    var readBtn = $("#readBtn");
    if (readBtn) {
      readBtn.addEventListener("click", function () {
        var on = !isRead(id, m.n);
        setRead(id, m.n, on);
        readBtn.classList.toggle("on", on);
        readBtn.lastChild.textContent = on ? "Marked as read" : "Mark as read";
        var meta = $(".toc-meta");
        if (meta) meta.innerHTML = esc(s.short || s.code) + " · module " + m.n + " of " + ms.length +
          "<br>read time <b>" + (m.minutes || 12) + " min</b><br>subject read <b>" + readCount(id) +
          "/" + ms.length + "</b>";
      });
    }

    var revealAll = $("#revealAll");
    if (revealAll) {
      revealAll.addEventListener("click", function () {
        var all = document.querySelectorAll(".q");
        var anyClosed = false;
        for (var i = 0; i < all.length; i++) if (!all[i].open) anyClosed = true;
        for (var j = 0; j < all.length; j++) all[j].open = anyClosed;
        revealAll.textContent = anyClosed ? "Hide all answers" : "Reveal all answers";
      });
    }

    typesetMath($("#page"));
    spy();
    readingLine();
  }

  /* ---------- contents rail scroll spy ---------- */
  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll("#toc a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var a = map[e.target.id];
        if (a) a.classList.add("active");
      });
    }, { rootMargin: "-72px 0px -68% 0px", threshold: 0 });

    document.querySelectorAll(".sec").forEach(function (sec) { io.observe(sec); });
  }

  /* ---------- thin reading progress line ---------- */
  function readingLine() {
    var bar = document.createElement("div");
    bar.className = "readline";
    bar.innerHTML = "<i></i>";
    document.body.appendChild(bar);
    var fill = bar.firstChild;
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.pageYOffset / h) : 0;
      fill.style.width = Math.max(0, Math.min(1, p)) * 100 + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    items.forEach(function (n) { io.observe(n); });
    // safety net: nothing may stay invisible if the observer never fires
    setTimeout(function () {
      items.forEach(function (n) { n.classList.add("in"); });
    }, 900);
  }

  /* ============================================================
     SYLLABUS PAGE
     ============================================================ */
  function renderSyllabus() {
    var id = q("id");
    var s = subById(id);
    var syl = (C.syllabus || {})[id];
    if (!s || !syl) { notFound("That syllabus does not exist."); return; }
    var ms = modsOf(id);
    document.title = s.name + " · Syllabus";

    var secs = syl.sections || [];
    var body = secs.map(function (sec, i) {
      return '<section class="sec" id="y' + i + '">' +
        '<div class="sec-head"><div class="sec-num">' + (i < 9 ? "0" + (i + 1) : i + 1) + "</div>" +
        "<div><div class=\"sec-kicker\">Syllabus</div><h2>" + esc(sec.title) + "</h2></div></div>" +
        '<div class="sec-body">' + sec.html + "</div></section>";
    }).join("");

    var toc = '<div class="toc-title">Syllabus</div>' + secs.map(function (sec, i) {
      var t = sec.title;
      if (t.length > 46) { t = t.slice(0, 46); var sp = t.lastIndexOf(" "); if (sp > 26) t = t.slice(0, sp); t += "…"; }
      return '<a href="#y' + i + '"><span class="n">' + (i < 9 ? "0" + (i + 1) : i + 1) + "</span>" + esc(t) + "</a>";
    }).join("") +
      '<div class="toc-meta">' + esc(s.short || s.code) + "<br>modules <b>" + ms.length + "</b>" +
      "<br>topics <b>" + (syl.topics || 0) + "</b></div>";

    $("#page").innerHTML =
      '<div class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>' +
      '<a href="' + subHref(id) + '">' + esc(s.short || s.code) + '</a><span class="sep">/</span>' +
      '<span class="here">Syllabus</span></div>' +
      '<div class="wrap">' +
      '<nav class="toc" id="toc" aria-label="Syllabus contents">' + toc + "</nav>" +
      '<div class="main">' +
      '<header class="hero"' + accentVars(s) + ">" +
      '<div class="eyebrow">' + esc(s.code) + '<span class="dot"></span>Semester 2' +
      '<span class="dot"></span>official syllabus</div>' +
      "<h1>" + esc(s.name) + "</h1>" +
      '<p class="lede">The syllabus the six modules follow, exactly as it was handed out — ' +
      "every unit, every sub-topic in order. Use it to check nothing is left before an exam.</p>" +
      '<div class="chips">' +
      '<span class="chip"><b>' + ms.length + "</b> modules</span>" +
      '<span class="chip"><b>' + (syl.topics || 0) + "</b> sub-topics</span>" +
      '<span class="chip"><b>' + secs.length + "</b> units</span>" +
      '<a class="chip chip--acc" href="' + subHref(id) + '">notes →</a>' +
      "</div></header>" +
      body +
      '<div class="pager">' +
      '<a href="' + subHref(id) + '"><span class="dir">← Back</span><span class="ttl">' +
      esc(s.name) + " modules</span></a>" +
      '<a class="next" href="' + href(id, 1) + '"><span class="dir">Start reading →</span>' +
      '<span class="ttl">Module 1 · ' + esc(ms.length ? ms[0].title : "") + "</span></a>" +
      "</div>" + foot(s.code + " · syllabus") +
      "</div></div>";

    spy();
    readingLine();
  }

  function notFound(msg) {
    $("#page").innerHTML = '<header class="hero"><div class="eyebrow">404</div><h1>' + esc(msg) +
      '</h1><p class="lede">The link is broken or the subject id is missing.</p>' +
      '<p><a href="index.html">← Back to all subjects</a></p></header>' + foot();
  }

  /* ---------- boot ---------- */
  function boot() {
    var page = document.body.getAttribute("data-page");
    mountChrome(q("id"));
    if (page === "home") renderHome();
    else if (page === "subject") renderSubject();
    else if (page === "module") renderModule();
    else if (page === "syllabus") renderSyllabus();
    reveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
