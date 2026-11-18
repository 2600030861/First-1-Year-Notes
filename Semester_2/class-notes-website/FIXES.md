# What was fixed

The notes mixed two kinds of broken notation. Both are now gone.

## 1. Maths that had collapsed into ASCII / raw LaTeX

Examples of what the pages used to show, and what they show now:

| was | now |
|-----|-----|
| `(  1 2` / `3 4  )  (  5` / `6  ) = ...` — a matrix split across lines | a real 2×2 matrix times a column vector, brackets and all |
| `\cosθ - \sinθ` / `\sinθ \cosθ` — raw LaTeX commands in the text | the rotation matrix |
| `\beginarraycc\|c ... \endarray`, `\beginvmatrix ...`, `\begincases` | augmented matrix, determinant bars, cases |
| `\fraca·b‖a‖ ‖b‖`, `\tfrac32`, `[4pt]`, `[6pt]` | proper fractions and spacing |
| `\mid`, `\mathsf T`, `\Longrightarrow`, `\mapsto`, `\checkmark`, `\min` | the symbols they stand for |
| `R^n`, `O(n^2)`, `a_ij`, `σ_max`, `∇_θ`, `e^(−z)` | real superscripts and subscripts |
| `<=`, `>=`, `!=`, `->` in sentences | ≤, ≥, ≠, → |
| formulas sitting in grey monospace code blocks | typeset formulas in formula panels |

## 2. What was converted, subject by subject

| subject | formula panels retypeset | formula-in-code-block converted | notes |
|---------|--------------------------|----------------------------------|-------|
| Maths for AI | 72 (all six modules) | 1 | matrices, inverses, determinants, projection, SVD, gradients, probability, ML losses |
| DSA-1 | — | 10 | Big-O / Big-Omega / Big-Theta bounds, the complexity ladder, feasibility budget, prefix sums, search cases, sorting lower bound |
| DDCA | — | 17 | noise margins, two's-complement value, Boolean simplification, full adder, latch equations, setup/hold, counter equations, Moore/Mealy, FSM next-state, memory sizing, AMAT |
| English, Japanese | — | — | no maths in these modules; only the file names (`log_01.md`) were protected from being turned into subscripts |

Real code (Java listings), truth tables, K-maps, circuit diagrams and ASCII
drawings were deliberately **left** in monospace — they are supposed to be
aligned, not typeset.

## 3. How it is done

Every formula in `js/data.js` is now LaTeX between `\[ ... \]` (display) or
`\( ... \)` (inline). `js/katex.min.js` + `js/auto-render.min.js` typeset it on
load, using the stylesheet and fonts in `css/`. Everything is local, so the site
still works with no internet connection. See the "Maths" section of `README.md`.

`build_data.py`, `latex_mtai.py` and `latex_pre.py` are the one-off scripts that
did the conversion; they are not needed to read or edit the site.
