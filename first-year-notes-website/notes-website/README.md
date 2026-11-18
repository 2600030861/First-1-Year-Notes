# First Year Notes — the website

One static site for **every** first-year B.Tech CSE subject: Semester 1, Semester 2, and a
Semester 3 section that is marked *coming soon* until notes exist for it.

Plain HTML, one stylesheet, plain JavaScript. No build step to open it, no server, no
database. The maths typesetter (KaTeX) and its fonts ship inside the folder, so the notes
render correctly offline.

## How to open it

Double-click `index.html`. Every link is relative, so it works from a folder, a USB stick
or a phone. Or serve it locally:

    python3 -m http.server 8000

then open <http://localhost:8000>.

## The tree

    index.html                  home — both semesters, search, progress
      └ subject.html?id=java    one subject: 00 Syllabus, then its modules
          ├ syllabus.html?id=java      the full syllabus (the 00 entry)
          └ module.html?id=java&m=4    one module of notes

Every subject opens on a **00 Syllabus** row above module 01. Each module page has a
contents rail, a reading-progress line, a "mark as read" tick (remembered on the device)
and — where the notes have them — practice questions with hidden answers.

| Semester | Subjects | Status |
|----------|----------|--------|
| 1 | Human Values, Language Skills, Discrete Mathematics, Java (PSPJ) | open |
| 2 | DSA-1, Maths for AI, DDCA, English Communication, Japanese | open |
| 3 | — | coming soon |

## Files

    index.html  subject.html  module.html  syllabus.html   page shells
    css/style.css           one stylesheet, light + dark
    css/katex.min.css       maths typesetter styles
    css/fonts/*.woff2       maths fonts, bundled for offline use
    js/data.js              generated: subjects, module index, syllabi
    js/notes/<id>.js        generated: one subject's full notes, loaded on demand
    js/app.js               renders every page from that data
    js/theme.js             light / dark, remembered per device
    js/katex.min.js         vendored typesetter

Nothing in `js/data.js` or `js/notes/` should be edited by hand — both are generated.

## Adding notes (Semester 3, or anything new)

1. Put the Markdown in the repo under a semester folder, one folder per subject:

       Semester_3/OS-OperatingSystems/
           syllabus.md
           Module1-Notes.md
           Module2-Notes.md
           ...

   Any file whose name contains `syllabus` becomes the 00 Syllabus page. Every other
   `.md` file becomes a module, numbered in filename order. Headings split the module
   into sections; `$...$` and `$$...$$` maths, tables and fenced code all render.

2. Regenerate the data:

       pip install markdown
       python tools/build_site.py

   That writes `notes-website/js/data.js` and `notes-website/js/notes/*.js`. The HTML and
   CSS never need touching: the semester section, the subject cards, the module list and
   the search index all come from the data. A semester with no folders stays "coming soon".

3. Optional polish: add the subject to `SUBJECT_META` in `tools/build_site.py` to give it
   a proper name, code, colour and description. Without it, the folder name is used.

## Deploying on GitHub Pages

`.github/workflows/pages.yml` publishes the `notes-website` folder. Push, then in
**Settings → Pages** set the source to **GitHub Actions**. The site appears at
`https://<user>.github.io/First-1-Year-Notes/`.

The older `Semester_2/class-notes-website` folder is no longer deployed; its content is
kept in `tools/sem2-source.json` and is part of this site now. Delete the old folder
whenever you like.

## Credits

Notes: the `First-1-Year-Notes` repository. Type: Instrument Serif, Plus Jakarta Sans and
JetBrains Mono (with system fallbacks). Maths: KaTeX, vendored under its MIT licence.
