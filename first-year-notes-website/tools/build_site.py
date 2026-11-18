#!/usr/bin/env python3
"""build_site.py — regenerate the notes website's data from the Markdown notes.

    python tools/build_site.py                 # writes notes-website/js/
    python tools/build_site.py --out some/dir  # writes into some/dir/js/

What it does
------------
* Semester 1 is parsed from Semester_1/<Subject>/*.md — every module file becomes
  one module page, the syllabus file becomes the 00 Syllabus page.
* Semester 2 comes from tools/sem2-source.json (hand-written module content that
  was already on the site); its syllabus + file links are merged in here.
* Any other Semester_N folder is picked up automatically: each sub-folder with
  Markdown files becomes a subject. A semester with no folders stays "upcoming".

Only js/data.js and js/notes/*.js are written. The HTML, CSS and KaTeX files are
static and are never touched, so re-running this after adding notes is safe.

Requires:  pip install markdown
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parents[1]
TOOLS = Path(__file__).resolve().parent

# ---------------------------------------------------------------- config

SEMESTERS = {
    1: {"label": "Semester 1", "short": "Sem I", "status": "ready",
        "blurb": "Human Values, Language Skills, Discrete Mathematics and Java \u2014 the "
                 "foundation semester, complete with every module and its syllabus."},
    2: {"label": "Semester 2", "short": "Sem II", "status": "ready",
        "blurb": "DSA-1, Mathematics for AI, Digital Design & Computer Architecture, English "
                 "Communication and Japanese \u2014 the semester that starts to feel like "
                 "computer science."},
    3: {"label": "Semester 3", "short": "Sem III", "status": "upcoming",
        "blurb": "The third semester has not started yet, so there are no notes to read yet. "
                 "New subjects go up as the semester runs: the syllabus first, then a module "
                 "at a time."},
}

# hand-written presentation details, keyed by the folder name in the repo
SUBJECT_META = {
    "Human-Values-Notes": {
        "id": "hv", "code": "HV", "short": "Human Values", "accent": "rose",
        "name": "Human Values & Professional Ethics",
        "desc": "Value education and self-exploration, harmony in the self, family and society, "
                "gender sensitisation, and ethical human conduct \u2014 the universal human "
                "values course, module by module."},
    "Language-Skills-Notes": {
        "id": "ls", "code": "LS", "short": "Language Skills", "accent": "olive",
        "name": "Language Skills for Engineers",
        "desc": "Accuracy and register, how professional vocabulary is built, the 7 Cs of "
                "writing, and the reading, listening and speaking habits an engineer is "
                "actually marked on."},
    "Maths-Notes": {
        "id": "dm", "code": "DM", "short": "Discrete Maths", "accent": "indigo",
        "name": "Discrete Mathematics",
        "desc": "Logic and proof techniques, sets and relations, counting, number theory and "
                "cryptography, graph theory, Boolean algebra, algebraic structures and coding "
                "theory \u2014 the maths under every CS course."},
    "PSPJ-JAVA-Notes": {
        "id": "java", "code": "PSPJ", "short": "Java", "accent": "teal",
        "name": "Programming with Java (PSPJ)",
        "desc": "From problem statement to running program: algorithms and flowcharts, control "
                "flow, methods and recursion, arrays, objects, inheritance, exceptions and the "
                "collections you actually use."},
}

ACCENTS = ["rose", "olive", "indigo", "teal", "sage", "accent", "blue", "gold", "plum"]

# semester 2 lives in tools/sem2-source.json; these map a subject id to its folder
S2_FOLDERS = {
    "dsa1": ("DSA1-DataStructuresAndAlgorithms", "DSA1-M0%d.md"),
    "mtai": ("MTAI-MathematicsForAI", "MTAI-M0%d.md"),
    "ddca": ("DDCA-DgitalDigineAndComputerArchitecture", "DDCA-M0%d.md"),
    "csfe": ("CSFE-CommunicationSkills", "CSFE-M0%d.md"),
    "jpn": ("Japanese-ForeignLanguageProficiency", "JP-M0%d.md"),
}

# ---------------------------------------------------------------- markdown

HEAD = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
EMOJI = re.compile(r"^[\s\u200d\ufe0f\u2190-\u2bff\U0001F000-\U0001FAFF\u2600-\u27BF]+")
NUM_PREFIX = re.compile(
    r"^(?:\d+(?:\.\d+)*[.)]?|CO\s*\d+|Module[\s\-]*\d+|TOPIC\s*\d+)\s*[:\-\u2014.)]?\s*", re.I)
LIST_START = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s+")


def mask_fences(lines):
    """Replace fenced code blocks with single-line placeholders."""
    out, blocks, i, n = [], {}, 0, 0
    while i < len(lines):
        if lines[i].lstrip().startswith("```"):
            buf = [lines[i]]
            i += 1
            while i < len(lines) and not lines[i].lstrip().startswith("```"):
                buf.append(lines[i])
                i += 1
            if i < len(lines):
                buf.append(lines[i])
                i += 1
            key = "@@C%d@@" % n
            n += 1
            blocks[key] = "\n".join(buf)
            out.append(key)
        else:
            out.append(lines[i])
            i += 1
    return out, blocks


def drop_toc_blocks(lines):
    """Remove 'Table of Contents' sections — the site builds its own."""
    out, i = [], 0
    while i < len(lines):
        m = HEAD.match(lines[i])
        if m and re.search(r"table of contents", m.group(2), re.I):
            lvl = len(m.group(1))
            i += 1
            while i < len(lines):
                mm = HEAD.match(lines[i])
                if mm and len(mm.group(1)) <= lvl:
                    break
                i += 1
            continue
        out.append(lines[i])
        i += 1
    return out


def loosen_lists(lines):
    """Python-Markdown needs a blank line before a list that follows a
    paragraph; GitHub does not. Add the blank line so both agree."""
    out = []
    for ln in lines:
        if (LIST_START.match(ln) and out and out[-1].strip()
                and not LIST_START.match(out[-1])
                and not HEAD.match(out[-1])
                and not out[-1].lstrip().startswith(("|", ">"))):
            out.append("")
        out.append(ln)
    return out


def demote(line, by=1):
    m = HEAD.match(line)
    if not m:
        return line
    lvl = min(len(m.group(1)) + by, 6)
    text = EMOJI.sub("", m.group(2)).strip() or m.group(2)
    return "#" * lvl + " " + text


def md_convert(text, blocks):
    """Markdown -> HTML, protecting maths and code fences from escaping."""
    maths = {}

    def keep_display(m):
        k = "@@D%d@@" % len(maths)
        maths[k] = ("display", m.group(1).strip())
        return k

    def keep_inline(m):
        k = "@@D%d@@" % len(maths)
        maths[k] = ("inline", m.group(1).strip())
        return k

    text = re.sub(r"\$\$(.+?)\$\$", keep_display, text, flags=re.S)
    text = re.sub(r"(?<!\$)\$([^$\n]+?)\$(?!\$)", keep_inline, text)

    html = markdown.markdown(text, extensions=["tables", "fenced_code", "attr_list"])

    for k, (kind, body) in maths.items():
        if kind == "display":
            wrapped = "\\[" + body + "\\]"
            html = html.replace("<p>" + k + "</p>",
                                '<div class="math-block">' + wrapped + "</div>")
        else:
            wrapped = "\\(" + body + "\\)"
        html = html.replace(k, wrapped)

    for k, fence in blocks.items():
        code = markdown.markdown(fence, extensions=["fenced_code"])
        code = code.replace("<pre>", '<pre class="code">')
        html = html.replace("<p>" + k + "</p>", code).replace(k, code)

    html = re.sub(r"<table>", '<div class="tbl-wrap"><table>', html)
    html = re.sub(r"</table>", "</table></div>", html)
    return html


def strip_md(s):
    s = re.sub(r"[`*_>#|]", "", s)
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)
    return re.sub(r"\s+", " ", s).strip()


def clean_title(raw, subject_name=None):
    t = raw.strip()
    t = EMOJI.sub("", t)
    if subject_name and t.lower().startswith(subject_name.lower()):
        t = t[len(subject_name):].lstrip(" \u2014-\u2013:")
    t = re.sub(r"^CO\s*\d+\s*/\s*Module\s*\d+\s*[\u2014\-\u2013:]\s*", "", t, flags=re.I)
    for _ in range(3):
        new = NUM_PREFIX.sub("", t)
        if new == t:
            break
        t = new
    t = re.sub(r"[`*]", "", t)
    return re.sub(r"\s+", " ", t).strip(" \u2014-\u2013:.")


def first_para(lines):
    for ln in lines:
        s = ln.strip()
        if not s or s.startswith(("#", "|", "-", "*", ">", "!", "1.", "2.", "3.")):
            continue
        if s.startswith("@@"):
            continue
        return strip_md(s)
    return ""


def parse_doc(path, subject_name=None):
    raw = path.read_text(encoding="utf-8", errors="replace")
    masked, blocks = mask_fences(raw.split("\n"))
    masked = drop_toc_blocks(masked)
    masked = [ln for ln in masked if ln.strip() not in ("---", "***", "___")]
    masked = loosen_lists(masked)

    heads = []
    for i, ln in enumerate(masked):
        m = HEAD.match(ln)
        if m:
            heads.append((i, len(m.group(1)), m.group(2)))
    if not heads:
        return path.stem, [], blocks, []

    first_i, _lvl, first_raw = heads[0]
    rest = [h for h in heads if h[0] > first_i]

    title = clean_title(first_raw, subject_name)
    if re.search(r"[\u2014\u2013-]\s*$", first_raw.strip()) or len(title) < 8:
        nxt = [h for h in rest if h[1] <= 2]
        if nxt:
            title = clean_title(nxt[0][2], subject_name) or title

    # split at the smallest heading level used more than once, so one stray
    # heading cannot collapse a whole file into a single section
    counts = {}
    for h in rest:
        counts[h[1]] = counts.get(h[1], 0) + 1
    repeated = sorted(l for l, c in counts.items() if c >= 2)
    split_level = repeated[0] if repeated else (min(counts) if counts else 2)
    split_level = min(split_level, 3)

    split_at = [h for h in rest if h[1] <= split_level]
    if split_at:
        overview = masked[first_i + 1:split_at[0][0]]
        sections = []
        for j, (idx, _l, text) in enumerate(split_at):
            end = split_at[j + 1][0] if j + 1 < len(split_at) else len(masked)
            sections.append((text, masked[idx + 1:end]))
    else:
        overview = masked[first_i + 1:]
        sections = []
    return title, sections, blocks, overview


KIND_RULES = [
    (r"\b(trap|traps|mistake|mistakes|pitfall|common error)", "trap"),
    (r"\b(formula|formulae|formulas|theorem|axioms?)\b", "formula"),
    (r"\b(solved example|examples?|worked)\b", "example"),
    (r"\b(revision|recap)\b", "revision"),
]


def kind_of(title):
    low = title.lower()
    for pat, kind in KIND_RULES:
        if re.search(pat, low):
            return kind
    return "concept"


def build_module(path, n, subject_name, rel):
    title, sections, blocks, overview = parse_doc(path, subject_name)

    out = []
    ov_text = "\n".join(overview)
    if len(strip_md(ov_text)) > 40:
        out.append({"kind": "big", "num": "", "title": "Overview",
                    "html": md_convert(ov_text, blocks)})

    counter = 0
    seen = {title.lower(), subject_name.lower()}
    for raw_title, body in sections:
        t = clean_title(raw_title, subject_name)
        if not t or t.lower() in seen:
            continue
        seen.add(t.lower())
        body_text = "\n".join(demote(ln, 1) for ln in body).strip()
        kind = kind_of(t)
        num = ""
        if kind == "concept":
            counter += 1
            num = str(counter)
        out.append({"kind": kind, "num": num, "title": t,
                    "html": md_convert(body_text, blocks)})

    words = len(re.findall(r"\S+", strip_md(path.read_text(encoding="utf-8", errors="replace"))))
    tagline = first_para(overview)
    if len(tagline) > 155:
        tagline = tagline[:155].rsplit(" ", 1)[0] + "\u2026"
    if not tagline:
        tagline = "%s \u00b7 module %d" % (subject_name, n)

    return {"n": n, "title": title, "tagline": tagline,
            "minutes": max(6, round(words / 190)),
            "sections": out, "practice": [], "file": rel}


def build_syllabus(path, rel, subject_name=None):
    title, sections, blocks, overview = parse_doc(path, subject_name)
    raw = path.read_text(encoding="utf-8", errors="replace")
    masked, _ = mask_fences(raw.split("\n"))
    masked = drop_toc_blocks(masked)
    levels = [len(m.group(1)) for m in (HEAD.match(ln) for ln in masked) if m]
    topics = levels.count(2) or levels.count(3)

    secs = []
    for raw_title, body in sections:
        t = clean_title(raw_title, subject_name)
        if not t:
            continue
        secs.append({"title": t,
                     "html": md_convert("\n".join(demote(ln, 1) for ln in body).strip(), blocks)})
    if not secs and overview:
        secs.append({"title": "Syllabus", "html": md_convert("\n".join(overview), blocks)})
    return {"title": title, "topics": topics, "sections": secs, "file": rel}


# ---------------------------------------------------------------- discovery

def natural_key(p: Path):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", p.name)]


def auto_meta(folder: Path, index: int):
    """Guess a subject's code / name / accent from its folder name."""
    code, _, rest = folder.name.partition("-")
    if not rest or len(code) > 7:
        code, rest = "", folder.name
    name = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", rest).replace("_", " ").replace("-", " ")
    name = re.sub(r"\s+", " ", name).strip()
    mods = sorted([p for p in folder.glob("*.md") if "syllabus" not in p.name.lower()],
                  key=natural_key)
    desc = ""
    if mods:
        _t, _s, _b, overview = parse_doc(mods[0], name)
        desc = first_para(overview)
        if len(desc) > 190:
            desc = desc[:190].rsplit(" ", 1)[0] + "\u2026"
    return {
        "id": re.sub(r"[^a-z0-9]+", "", folder.name.lower())[:12] or ("s%d" % index),
        "code": code or folder.name[:4].upper(),
        "short": (code or name)[:14],
        "accent": ACCENTS[index % len(ACCENTS)],
        "name": name or folder.name,
        "desc": desc or (name + " \u2014 module-wise notes and the full syllabus."),
    }


def discover_semester(n: int):
    folder = ROOT / ("Semester_%d" % n)
    if not folder.is_dir():
        return []
    out = []
    dirs = sorted([d for d in folder.iterdir() if d.is_dir() and list(d.glob("*.md"))])
    for i, d in enumerate(dirs):
        meta = dict(SUBJECT_META.get(d.name) or auto_meta(d, i))
        meta.setdefault("id", auto_meta(d, i)["id"])
        meta["sem"] = n
        meta["folder"] = str(d.relative_to(ROOT)).replace("\\", "/")
        out.append(meta)
    return out


# ---------------------------------------------------------------- build

def build(out: Path):
    subjects, index, syllabus, notes = [], {}, {}, {}

    # ---- semester 1 and anything else that has a Semester_N folder
    for sem in sorted(SEMESTERS):
        if sem == 2:
            continue
        for meta in discover_semester(sem):
            folder = ROOT / meta["folder"]
            files = sorted([p for p in folder.glob("*.md") if "syllabus" not in p.name.lower()],
                           key=natural_key)
            syl_files = sorted([p for p in folder.glob("*.md") if "syllabus" in p.name.lower()],
                               key=natural_key)
            mods = [build_module(p, i + 1, meta["name"], str(p.relative_to(ROOT)).replace("\\", "/"))
                    for i, p in enumerate(files)]
            notes[meta["id"]] = mods
            index[meta["id"]] = [{"n": m["n"], "title": m["title"], "tagline": m["tagline"],
                                  "minutes": m["minutes"], "secs": len(m["sections"]),
                                  "practice": 0, "file": m["file"]} for m in mods]
            if syl_files:
                sp = syl_files[0]
                syllabus[meta["id"]] = build_syllabus(
                    sp, str(sp.relative_to(ROOT)).replace("\\", "/"), meta["name"])
            subjects.append({k: meta[k] for k in ("id", "sem", "code", "short", "name",
                                                  "accent", "desc", "folder")})

    # ---- semester 2: hand-written content that already existed on the site
    src = TOOLS / "sem2-source.json"
    if src.exists():
        old = json.loads(src.read_text(encoding="utf-8"))
        for s in old["subjects"]:
            folder, pat = S2_FOLDERS.get(s["id"], ("", "%s"))
            subjects.append({"id": s["id"], "sem": 2, "code": s["code"], "short": s["short"],
                             "name": s["name"], "accent": s["accent"], "desc": s["desc"],
                             "folder": "Semester_2/" + folder})
            mods = old["notes"][s["id"]]
            for m in mods:
                rel = "Semester_2/%s/%s" % (folder, pat % m["n"])
                # only link a Markdown file that is actually in the repository
                m["file"] = rel if (ROOT / rel).exists() else None
            notes[s["id"]] = mods
            index[s["id"]] = [{"n": m["n"], "title": m["title"], "tagline": m["tagline"],
                               "minutes": m["minutes"], "secs": len(m["sections"]),
                               "practice": len(m.get("practice") or []),
                               "file": m["file"]} for m in mods]
            syllabus[s["id"]] = old["syllabus"][s["id"]]

    subjects.sort(key=lambda s: s["sem"])

    # ---- semester status follows the data
    semesters = []
    for n in sorted(SEMESTERS):
        info = dict(SEMESTERS[n])
        info["n"] = n
        info["subjects"] = sum(1 for s in subjects if s["sem"] == n)
        info["modules"] = sum(len(index[s["id"]]) for s in subjects if s["sem"] == n)
        if info["status"] == "upcoming" and info["subjects"]:
            info["status"] = "ready"
        semesters.append(info)

    core = {"semesters": semesters, "subjects": subjects,
            "index": index, "syllabus": syllabus, "notes": {}}

    js = out / "js"
    (js / "notes").mkdir(parents=True, exist_ok=True)
    for old in (js / "notes").glob("*.js"):
        old.unlink()

    (js / "data.js").write_text(
        "/* data.js - generated by tools/build_site.py. Do not edit by hand.\n"
        "   Subjects, module index and syllabi; full notes for a subject live in\n"
        "   js/notes/<id>.js and are loaded only when that subject is opened. */\n"
        "window.COURSE = " + json.dumps(core, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8")

    for sid, mods in notes.items():
        (js / "notes" / (sid + ".js")).write_text(
            "/* notes for %s - generated by tools/build_site.py */\n"
            "window.COURSE.notes = window.COURSE.notes || {};\n"
            "window.COURSE.notes[%s] = %s;\n"
            % (sid, json.dumps(sid), json.dumps(mods, ensure_ascii=False)),
            encoding="utf-8")

    for s in subjects:
        print("%-6s sem%d  %-36s %2d modules  %4d sections" % (
            s["id"], s["sem"], s["name"], len(index[s["id"]]),
            sum(m["secs"] for m in index[s["id"]])))
    for sm in semesters:
        print("semester %d: %s (%d subjects)" % (sm["n"], sm["status"], sm["subjects"]))
    return core


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "notes-website"),
                    help="site folder to write js/data.js and js/notes/ into")
    ap.add_argument("--root", default=str(ROOT),
                    help="repository root to read the Semester_N folders from")
    a = ap.parse_args()
    ROOT = Path(a.root).resolve()
    globals()["ROOT"] = ROOT
    build(Path(a.out))
