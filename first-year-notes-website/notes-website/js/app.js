/* ============================================================
   app.js — renders every page from COURSE data
     home      : subjects grouped by semester, search, stats
     subject   : module list for one subject
     module    : one module's notes, with a sticky contents rail
     syllabus  : the full syllabus of one subject

   Data:
     js/data.js            subjects, semester list, module index, syllabi
     js/notes/<id>.js      one subject's full notes, loaded on demand
   ============================================================ */
(function () {
  "use strict";

  var C = window.COURSE || { subjects: [], semesters: [], index: {}, notes: {}, syllabus: {} };
  var PROG_KEY = "fy-progress";
  var REPO = "https://github.com/2600030861/First-1-Year-Notes/blob/main/";

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
  function semOf(n) {
    var list = C.semesters || [];
    for (var i = 0; i < list.length; i++) if (list[i].n === n) return list[i];
    return { n: n, label: "Semester " + n, status: "ready" };
  }
  function semLabel(n) { return semOf(n).label; }
  function modsOf(id) {
    var list = C.index[id] || C.notes[id] || [];
    return list.slice().sort(function (a, b) { return a.n - b.n; });
  }
  function subjectsOf(sem) {
    return C.subjects.filter(function (s) { return s.sem === sem; });
  }
  function accentVars(s) {
    if (!s || !s.accent) return "";
    return ' style="--acc:var(--' + s.accent + ');--acc-soft:var(--' + s.accent + '-soft)"';
  }
  function href(subject, m) {
    return "module.html?id=" + encodeURIComponent(subject) + "&m=" + m;
  }
  function subHref(id) { return "subject.html?id=" + encodeURIComponent(id); }
  function sylHref(id) { return "syllabus.html?id=" + encodeURIComponent(id); }

  /* ---------- lazy loader for one subject's notes ---------- */
  function loadNotes(id, cb) {
    if (C.notes[id]) { cb(); return; }
    var s = document.createElement("script");
    s.src = "js/notes/" + id + ".js";
    s.onload = function () { cb(C.notes[id] ? null : new Error("empty")); };
    s.onerror = function () { cb(new Error("missing")); };
    document.head.appendChild(s);
  }

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
    var links = (C.semesters || []).map(function (sm) {
      var live = sm.status !== "upcoming";
      return '<a href="index.html#sem' + sm.n + '"' + (live ? "" : ' class="soon"') + ">" +
        esc(sm.short || ("Sem " + sm.n)) + (live ? "" : " · soon") + "</a>";
    }).join("");
    return '<header class="topbar">' +
      '<a class="brand" href="index.html"><span class="brand-mark">FY</span>' +
      '<span class="brand-name">First Year Notes</span></a>' +
      '<nav class="topnav">' + links + "</nav>" +
      '<button class="theme-btn" id="themeBtn" type="button" aria-pressed="false" ' +
      'aria-label="Switch between light and dark mode" title="Switch to dark mode">' +
      '<svg class="t-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.9A8.6 8.6 0 1 1 11.1 3a6.7 6.7 0 0 0 9.9 9.9Z"/></svg>' +
      '<svg class="t-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.2v2.2M12 19.6v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.2 12h2.2M19.6 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>' +
      "</button></header>";
  }
  function mountChrome(activeId) {
    var host = $("#chrome");
    if (!host) return;
    host.innerHTML = topbar(activeId);
    var btn = $("#themeBtn");
    if (btn) {
      var mode = document.documentElement.getAttribute("data-theme") || "light";
      btn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
      btn.title = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
  }
  function foot(note) {
    return '<footer class="foot"><span>' + esc(note || "First year · semester notes") +
      '</span><span><a href="index.html">All subjects</a> · <a href="' +
      "https://github.com/2600030861/First-1-Year-Notes" + '" target="_blank" rel="noopener">source repo</a>' +
      " · built for offline reading</span></footer>";
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
  }

  /* ---------- section labels ---------- */
  var KIND = {
    big: { kicker: "Start here", label: "Overview" },
    basics: { kicker: "Prerequisites", label: "Basics first" },
    concept: { kicker: "Topic", label: "Topic" },
    formula: { kicker: "Rules & formulas", label: "Formulas" },
    example: { kicker: "Worked out", label: "Examples" },
    trap: { kicker: "Watch out", label: "Traps" },
    revision: { kicker: "Night before", label: "Revision box" }
  };

  /* ============================================================
     HOME
     ============================================================ */
  function subjectCard(s) {
    var ms = modsOf(s.id);
    var done = readCount(s.id);
    var pct = ms.length ? Math.round(done / ms.length * 100) : 0;
    var qs = ms.reduce(function (a, m) { return a + (m.practice || 0); }, 0);
    return '<a class="subj-card" href="' + subHref(s.id) + '"' + accentVars(s) + ">" +
      '<div class="subj-code">' + esc(s.code) + "</div>" +
      "<h3>" + esc(s.name) + "</h3>" +
      "<p>" + esc(s.desc) + "</p>" +
      '<div class="mini-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="subj-foot"><span>' + ms.length + " modules" + (qs ? " · " + qs + " Qs" : "") + "</span>" +
      '<span class="go">' + (done ? done + "/" + ms.length + " read" : "open →") + "</span></div></a>";
  }

  function sectionHead(kicker, title) {
    return '<div class="sec-head"><div class="sec-num"></div><div>' +
      '<div class="sec-kicker">' + esc(kicker) + "</div><h2>" + esc(title) + "</h2></div></div>";
  }

  function soonPanel(sm) {
    var first = (C.semesters || []).filter(function (x) { return x.status !== "upcoming"; })[0];
    var back = first ? '<a class="soon-back" href="#sem' + first.n + '">read ' +
      esc(first.label.toLowerCase()) + " →</a>" : "";
    return '<div class="soon-card">' +
      '<div class="soon-badge">In the works</div>' +
      "<h3>" + esc(sm.label) + " notes</h3>" +
      "<p>Nothing to read here yet. This section fills up subject by subject as the semester " +
      "runs \u2014 the syllabus first, then a module at a time.</p>" +
      '<ul class="soon-list">' +
      "<li><b>Status</b><span>not started — notes begin when classes do</span></li>" +
      "<li><b>Structure</b><span>the same as the semesters above: syllabus first, then one page per module</span></li>" +
      "<li><b>Where it lands</b><span>this page, its own " + esc(sm.label) + " section, the same search</span></li>" +
      "</ul>" +
      '<div class="soon-foot">' +
      '<a href="https://github.com/2600030861/First-1-Year-Notes" target="_blank" rel="noopener">watch the repo ↗</a>' +
      back + "</div></div>";
  }

  function renderSemesters() {
    var host = $("#semesterSections");
    if (!host) return;
    host.innerHTML = (C.semesters || []).map(function (sm) {
      var subs = subjectsOf(sm.n);
      var mods = subs.reduce(function (a, s) { return a + modsOf(s.id).length; }, 0);
      var title = subs.length
        ? (subs.length + (subs.length === 1 ? " subject, " : " subjects, ") +
           mods + (mods === 1 ? " module" : " modules"))
        : "Coming soon";
      var body = subs.length
        ? '<div class="subj-grid">' + subs.map(subjectCard).join("") + "</div>"
        : soonPanel(sm);
      return '<section class="sec" id="sem' + sm.n + '">' +
        sectionHead(sm.label, title) +
        '<p class="sec-sub">' + esc(sm.blurb) + "</p>" + body + "</section>";
    }).join("");
  }

  function renumber() {
    var secs = document.querySelectorAll(".shell .sec");
    for (var i = 0; i < secs.length; i++) {
      var n = secs[i].querySelector(".sec-num");
      if (n) n.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
    }
  }

  function renderHome() {
    var totalMods = 0, totalSecs = 0, totalQ = 0, totalTopics = 0;
    C.subjects.forEach(function (s) {
      var ms = modsOf(s.id);
      totalMods += ms.length;
      ms.forEach(function (m) {
        totalSecs += m.secs || 0;
        totalQ += m.practice || 0;
      });
    });
    Object.keys(C.syllabus || {}).forEach(function (k) {
      totalTopics += (C.syllabus[k].topics || 0);
    });

    renderSemesters();
    var chips = $("#heroChips");
    if (chips) {
      var open = (C.semesters || []).filter(function (sm) { return sm.status !== "upcoming"; });
      chips.innerHTML = '<span class="chip"><b>' + C.subjects.length + "</b> subjects</span>" +
        '<span class="chip"><b>' + open.length + "</b> " + (open.length === 1 ? "semester" : "semesters") +
        " open</span>" +
        '<span class="chip"><b>' + Object.keys(C.syllabus || {}).length + "</b> syllabi</span>" +
        '<span class="chip"><b>light + dark</b></span>' +
        '<span class="chip"><b>works offline</b></span>';
    }

    var stats = $("#stats");
    if (stats) {
      stats.innerHTML = '<div class="stats">' +
        '<div><div class="v">' + C.subjects.length + '</div><div class="k">Subjects</div></div>' +
        '<div><div class="v">' + totalMods + '</div><div class="k">Modules</div></div>' +
        '<div><div class="v">' + totalSecs + '</div><div class="k">Note sections</div></div>' +
        '<div><div class="v">' + totalTopics + '</div><div class="k">Syllabus sub-topics</div></div>' +
        "</div>";
    }
    var fh = $("#footHost");
    if (fh) fh.innerHTML = foot("First year · " + C.subjects.length + " subjects · " +
      totalMods + " modules · offline friendly");
    renumber();
    setupSearch();
    jumpToHash();
  }

  function setupSearch() {
    var input = $("#search");
    var hits = $("#hits");
    if (!input) return;

    var index = [];
    C.subjects.forEach(function (s) {
      var tag = semLabel(s.sem).replace("Semester ", "Sem ");
      index.push({
        kind: "subject", id: s.id, title: s.name, sub: tag + " · " + (s.short || s.code), m: null,
        text: (s.name + " " + s.code + " " + (s.short || "") + " " + s.desc).toLowerCase()
      });
      modsOf(s.id).forEach(function (m) {
        index.push({
          kind: "module", id: s.id, title: "M" + m.n + " · " + m.title,
          sub: tag + " · " + (s.short || s.code), m: m.n,
          text: (m.title + " " + (m.tagline || "") + " " + s.name + " " + s.code).toLowerCase()
        });
      });
    });

    function run() {
      var v = input.value.trim().toLowerCase();
      if (v.length < 2) { hits.innerHTML = ""; return; }
      var out = index.filter(function (r) { return r.text.indexOf(v) !== -1; }).slice(0, 16);
      if (!out.length) {
        hits.innerHTML = '<div class="empty-note">Nothing matched “' + esc(input.value.trim()) +
          '”. Try a topic like <em>recursion</em>, <em>Euler circuit</em>, <em>tautology</em> or <em>keigo</em>.</div>';
        return;
      }
      hits.innerHTML = out.map(function (r) {
        var to = r.kind === "subject" ? subHref(r.id) : href(r.id, r.m);
        return '<a class="hit" href="' + to + '"><span class="sub">' + esc(r.sub) + "</span>" +
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
    var qCount = ms.reduce(function (a, m) { return a + (m.practice || 0); }, 0);

    document.title = s.name + " · " + semLabel(s.sem) + " notes";

    var syl = (C.syllabus || {})[id];
    var sylRow = syl ? '<a class="mod-row mod-row--syl" href="' + sylHref(id) + '">' +
      '<div class="mod-n">00</div>' +
      "<div><h3>Syllabus</h3><p>Every unit and sub-topic this subject is examined on, in order — " +
      "read it before the first module and again before the exam.</p></div>" +
      '<div class="mod-meta"><span>' + ((syl.sections || []).length) + " units</span><span>·</span><span>" +
      (syl.topics || 0) + " sub-topics</span>" +
      '<span class="arrow">→</span></div></a>' : "";

    var rows = ms.map(function (m) {
      var read = isRead(id, m.n);
      return '<a class="mod-row" href="' + href(id, m.n) + '">' +
        '<div class="mod-n">' + (m.n < 10 ? "0" + m.n : m.n) + "</div>" +
        "<div><h3>" + esc(m.title) + "</h3><p>" + esc(m.tagline || "") + "</p></div>" +
        '<div class="mod-meta">' +
        '<span class="done-mark' + (read ? " on" : "") + '">✓</span>' +
        "<span>" + (m.minutes || 12) + " min</span><span>·</span><span>" + (m.secs || 0) + " sections</span>" +
        (m.practice ? "<span>·</span><span>" + m.practice + " Qs</span>" : "") +
        '<span class="arrow">→</span></div></a>';
    }).join("");

    /* previous / next inside the same semester */
    var peers = subjectsOf(s.sem);
    var idx = peers.indexOf(s);
    var prev = peers[idx - 1], next = peers[idx + 1];

    $("#page").innerHTML =
      '<div class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>' +
      '<a href="index.html#sem' + s.sem + '">' + esc(semLabel(s.sem)) + '</a><span class="sep">/</span>' +
      '<span class="here">Modules</span></div>' +
      '<header class="hero"' + accentVars(s) + ">" +
      '<div class="eyebrow">' + esc(s.code) + '<span class="dot"></span>' + esc(semLabel(s.sem)) +
      '<span class="dot"></span>' + ms.length + " modules</div>" +
      "<h1>" + esc(s.name) + "</h1>" +
      '<p class="lede">' + esc(s.desc) + "</p>" +
      '<div class="chips">' +
      '<span class="chip"><b>' + ms.length + "</b> modules</span>" +
      (qCount ? '<span class="chip"><b>' + qCount + "</b> practice questions</span>" : "") +
      '<span class="chip"><b>' + done + "/" + ms.length + "</b> read</span>" +
      (syl ? '<a class="chip chip--acc" href="' + sylHref(s.id) + '">syllabus →</a>' : "") +
      (s.folder ? '<a class="chip" href="' + REPO + s.folder + '" target="_blank" rel="noopener">markdown source ↗</a>' : "") +
      "</div></header>" +
      '<div class="mod-list">' + sylRow + rows + "</div>" +
      '<div class="pager">' +
      (prev ? '<a href="' + subHref(prev.id) + '"><span class="dir">← Previous subject</span>' +
        '<span class="ttl">' + esc(prev.name) + "</span></a>"
        : '<a class="disabled" href="#"><span class="dir">← Previous subject</span><span class="ttl">—</span></a>') +
      (next ? '<a class="next" href="' + subHref(next.id) + '"><span class="dir">Next subject →</span>' +
        '<span class="ttl">' + esc(next.name) + "</span></a>"
        : '<a class="next" href="index.html#sem' + s.sem + '"><span class="dir">Next →</span>' +
        '<span class="ttl">All ' + esc(semLabel(s.sem)) + " subjects</span></a>") +
      "</div>" + foot(s.code + " · " + semLabel(s.sem) + " · " + ms.length + " modules");
  }

  /* ============================================================
     MODULE PAGE
     ============================================================ */
  function renderModule() {
    var id = q("id"), n = parseInt(q("m"), 10);
    var s = subById(id);
    if (!s) { notFound("That module does not exist."); return; }

    loadNotes(id, function (err) {
      if (err) { notFound("The notes for this subject could not be loaded."); return; }
      var ms = modsOf(id);                       /* light index: counts + pager */
      var full = (C.notes[id] || []).slice();    /* full content: sections + practice */
      var m = null;
      for (var i = 0; i < full.length; i++) if (full[i].n === n) m = full[i];
      if (!m) { notFound("That module does not exist."); return; }

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
        (C.syllabus[id] ? '<a class="toc-syl" href="' + sylHref(id) + '">' +
          '<span class="n">00</span>Syllabus</a><div class="toc-sep"></div>' : "") +
        secs.map(function (sec, i) {
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
        if (ms[k].n === m.n) { prevM = ms[k - 1] || null; nextM = ms[k + 1] || null; }
      }
      var pager = '<div class="pager">' +
        (prevM ? '<a href="' + href(id, prevM.n) + '"><span class="dir">← Module ' + prevM.n +
          '</span><span class="ttl">' + esc(prevM.title) + "</span></a>"
          : '<a href="' + sylHref(id) + '"><span class="dir">← 00 · Syllabus</span>' +
          '<span class="ttl">' + esc(s.name) + " syllabus</span></a>") +
        (nextM ? '<a class="next" href="' + href(id, nextM.n) + '"><span class="dir">Module ' + nextM.n +
          ' →</span><span class="ttl">' + esc(nextM.title) + "</span></a>"
          : '<a class="next" href="' + subHref(id) + '"><span class="dir">Next →</span><span class="ttl">' +
          esc(s.name) + " · all modules</span></a>") +
        "</div>";

      $("#page").innerHTML =
        '<div class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>' +
        '<a href="index.html#sem' + s.sem + '">' + esc(semLabel(s.sem)) + '</a><span class="sep">/</span>' +
        '<a href="' + subHref(id) + '">' + esc(s.short || s.code) + '</a><span class="sep">/</span>' +
        '<span class="here">Module ' + m.n + "</span></div>" +
        '<div class="wrap">' +
        '<nav class="toc" id="toc" aria-label="Module contents">' + toc + "</nav>" +
        '<div class="main">' +
        '<header class="hero"' + accentVars(s) + ">" +
        '<div class="eyebrow">' + esc(s.short || s.code) + '<span class="dot"></span>Module ' + m.n +
        '<span class="dot"></span>' + esc(semLabel(s.sem)) + "</div>" +
        "<h1>" + esc(m.title) + "</h1>" +
        '<p class="lede">' + esc(m.tagline || "") + "</p>" +
        '<div class="chips">' +
        '<span class="chip"><b>' + (m.minutes || 12) + "</b> min read</span>" +
        '<span class="chip"><b>' + secs.length + "</b> sections</span>" +
        (practice.length ? '<span class="chip"><b>' + practice.length + "</b> practice Qs</span>" : "") +
        (C.syllabus[id] ? '<a class="chip chip--acc" href="' + sylHref(s.id) + '">' +
          esc(s.name) + " · syllabus</a>" : "") +
        (m.file ? '<a class="chip" href="' + REPO + m.file + '" target="_blank" rel="noopener">' +
          "markdown ↗</a>" : "") +
        "</div>" +
        '<button class="read-btn' + (read ? " on" : "") + '" id="readBtn" type="button">' +
        '<span class="tick">✓</span><span>' + (read ? "Marked as read" : "Mark as read") + "</span></button>" +
        "</header>" +
        body + quiz + pager + foot(s.code + " · module " + m.n + " of " + ms.length) +
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
    });
  }

  /* ---------- contents rail scroll spy ---------- */
  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll("#toc a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (h.charAt(0) === "#") map[h.slice(1)] = a;
    });

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
      '<a href="index.html#sem' + s.sem + '">' + esc(semLabel(s.sem)) + '</a><span class="sep">/</span>' +
      '<a href="' + subHref(id) + '">' + esc(s.short || s.code) + '</a><span class="sep">/</span>' +
      '<span class="here">Syllabus</span></div>' +
      '<div class="wrap">' +
      '<nav class="toc" id="toc" aria-label="Syllabus contents">' + toc + "</nav>" +
      '<div class="main">' +
      '<header class="hero"' + accentVars(s) + ">" +
      '<div class="eyebrow">' + esc(s.code) + '<span class="dot"></span>' + esc(semLabel(s.sem)) +
      '<span class="dot"></span>official syllabus</div>' +
      "<h1>" + esc(s.name) + "</h1>" +
      '<p class="lede">The syllabus the modules follow, as it was handed out — every unit, every sub-topic ' +
      "in order. Use it to check nothing is left before an exam.</p>" +
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

  /* ---------- arriving from another page on index.html#sem2 ---------- */
  function jumpToHash() {
    if (!window.location.hash) return;
    var el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
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
