/* ============================================================
   theme.js — light / dark mode
   Remembers the choice, falls back to the OS setting.
   Loaded on every page before app.js.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "sem2-theme";
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function systemMode() { return mq && mq.matches ? "dark" : "light"; }

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) { return null; }
  }

  function paint(mode) {
    root.setAttribute("data-theme", mode);
    var meta = document.getElementById("themeColor");
    if (meta) meta.setAttribute("content", mode === "dark" ? "#14110e" : "#f7f3ee");
    var btn = document.getElementById("themeBtn");
    if (btn) {
      btn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
      btn.title = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
    // let canvas demos or anything else react
    try {
      document.dispatchEvent(new CustomEvent("themechange", { detail: { mode: mode } }));
    } catch (e) {}
  }

  paint(stored() || root.getAttribute("data-theme") || systemMode());

  function wire() {
    var btn = document.getElementById("themeBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paint(next);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  if (mq) {
    var onSystem = function () { if (!stored()) paint(systemMode()); };
    if (mq.addEventListener) mq.addEventListener("change", onSystem);
    else if (mq.addListener) mq.addListener(onSystem);
  }
})();
