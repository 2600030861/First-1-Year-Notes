# Semester II — Class Notes

A small static website for the second-semester subjects: module-wise notes **and** the
full syllabus of every subject. Plain HTML, one CSS file, plain JavaScript. No build
step, no server, and no internet needed at all: the web fonts fall back to system
serif/sans, and the maths typesetter (KaTeX) plus its fonts ship inside the folder.

## How to open it

Double-click `index.html`. Every page is linked relatively, so it works straight from
a folder, a USB stick, or a phone.

If you prefer a local server:

    python3 -m http.server 8000

then open http://localhost:8000

## The tree

    index.html             home — what the site is, the five subjects, search
      └ subject.html       ?id=dsa1 — 00 Syllabus, then the six modules
          ├ syllabus.html  ?id=dsa1 — the full syllabus (the 00 entry)
          └ module.html    ?id=dsa1&m=3 — one module of notes

Every subject opens on a **00 Syllabus** row above module 01 — the full unit and
sub-topic list that subject is examined on. The same 00 entry sits at the top of every
module's contents rail, and "previous" from module 01 goes back to it.

Every module page has the same parts, in this order:

1. Big picture, 30 seconds
2. Basics you must know first
3. Concept sections (one per syllabus sub-topic, numbered like the syllabus)
4. Formulas, rules and properties
5. Solved examples (question, full solution, final answer)
6. Common traps and mistakes
7. Quick revision box
8. Practice questions with hidden worked answers

## Files

    index.html          home page
    subject.html        module list for one subject
    syllabus.html       full syllabus of one subject
    module.html         one module of notes
    css/style.css       every style, light and dark theme included
    css/katex.min.css   maths typesetting stylesheet
    css/fonts/          KaTeX maths fonts (woff2), so maths works offline
    js/data.js          the content: subjects, 30 modules, 5 syllabi
    js/katex.min.js     maths typesetter (renders LaTeX to HTML in the browser)
    js/auto-render.min.js  finds the maths in a page and hands it to KaTeX
    js/theme.js         light / dark switch, remembers your choice
    js/app.js           page rendering, search, contents rail, progress ticks
    README.md           this file

The three inner pages are thin shells: `js/app.js` reads the id from the URL and
renders the page from `js/data.js`.

## Subjects

| id   | code  | subject | notes source |
|------|-------|---------|--------------|
| dsa1 | DSA-1 | Data Structures & Algorithms I | 6 module files |
| mtai | MTAI  | Mathematics for AI | module 1 from your file, 2–6 written for this site |
| ddca | DDCA  | Digital Design & Computer Architecture | 6 module files |
| csfe | CSFE  | English Communication (LSRW) | 6 module files |
| jpn  | JPN   | Japanese Language Proficiency (N5) | written for this site |

## Editing or adding notes

All content lives in `js/data.js` as one JavaScript object, `window.COURSE`, with
three keys: `subjects`, `notes` (id → array of modules) and `syllabus` (id → sections).

A module looks like this:

```js
{
  n: 3,
  title: "Arrays, Strings & the Core Patterns",
  tagline: "One line that says what this module gives you.",
  minutes: 45,
  sections: [
    { kind: "big", title: "Big picture, 30 seconds", html: "<p>...</p>" },
    { kind: "concept", num: "3.1", title: "Arrays and strings", html: "<p>...</p>" },
    { kind: "revision", title: "Quick revision box", html: "<ul><li>...</li></ul>" }
  ],
  practice: [
    { q: "Plain text of the question (used for search)",
      qHtml: "Formatted question, optional — supports code blocks",
      a: "<p>Worked answer.</p>", tag: "medium" }
  ]
}
```

Allowed `kind` values, in reading order: `big`, `basics`, `concept`, `formula`,
`example`, `trap`, `revision`. A concept section carries a `num` such as `"3.1"`.

The `html` strings may use these components (all styled in `css/style.css`):

- `<div class="fml"><div class="fml-eq">\[ formula \]</div><div class="fml-meta">…</div></div>`
- `<div class="eqn">\[ formula \]</div>` for a formula on its own, outside a formula card
- `<div class="note note--trap|note--why|note--exam|note--ai|note--bonus">…</div>`
- `<div class="tbl-wrap"><table>…</table></div>`
- `<pre class="code"><code>…</code></pre>` and `<pre class="ascii">…</pre>`
- `<div class="card">…<div class="res">final answer</div></div>`
- `<div class="steps"><div class="step"><span class="step-n">1</span><div>…</div></div></div>`
- `<div class="grid2"><div>…</div><div>…</div></div>`

## Maths

Every formula in `js/data.js` is written as **LaTeX**, never as ASCII art:

- `\\[ ... \\]` for a formula on its own line (display maths),
- `\\( ... \\)` for maths inside a sentence (inline maths).

KaTeX (vendored in `js/` and `css/`, fonts included) typesets it in the browser, so
matrices, fractions, sums, determinants and superscripts all render properly and the
site still works with no internet connection. Example:

```js
{ kind: "formula", title: "Matrix times a vector",
  html: "<div class=\"eqn\">\\[ \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}" +
        "\\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 17 \\\\ 39 \\end{pmatrix} \\]</div>" }
```

Keep real code (Java listings, truth tables, circuit diagrams) in
`<pre class="code">` / `<pre class="ascii">` — those are meant to stay monospaced, and
KaTeX is told to leave them alone.

The syllabus page renders whatever is in `COURSE.syllabus[id].sections`, each section
being `{ title, html }`. Add a subject by adding to `subjects`, `notes` and `syllabus`
under the same id — the top bar builds itself from the subject list.

## Reading progress

The tick next to a module, and the "Mark as read" button on a module page, are stored
in your browser's localStorage under `sem2-progress`. The theme choice is stored under
`sem2-theme`. Clearing site data resets both.

## A note on the Japanese modules

They use kana and kanji. Every phone, and Windows/macOS by default, has a CJK font, so
they render as-is; the page also asks for Noto Sans JP when you are online. If you see
empty boxes, install any Japanese font on that machine.
