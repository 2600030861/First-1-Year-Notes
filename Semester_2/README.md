# Semester 2 — Class Notes

Friend-style notes for every module of every Semester 2 subject, written from the syllabus files kept in the same folders.
28 notes files, about 21,352 lines in total.

Each file follows the same shape: the big picture and prerequisites first, then every syllabus sub-topic in order — intuition, the idea step by step, a worked formula or table, an **Example question** with a full **Solution**, and a **Common trap** — then a summary table, extra solved examples, common traps, a quick revision box, and practice questions with answers at the end.

## Index

### Mathematics for AI

| File | Module | Lines |
|---|---|---|
| `MTAI-M01.md` | Vectors, Matrices & Linear Systems | 751 |
| `MTAI-M02.md` | Eigenvalues, SVD & PCA | 792 |
| `MTAI-M03.md` | Multivariable Calculus | 779 |
| `MTAI-M04.md` | Optimization | 799 |
| `MTAI-M05.md` | Probability | 787 |
| `MTAI-M06.md` | From Maths to Models | 848 |

### DSA-1: Data Structures & Algorithms

| File | Module | Lines |
|---|---|---|
| `DSA1-M01.md` | Complexity & Algorithmic Thinking | 798 |
| `DSA1-M02.md` | Recursion & Recursive Thinking | 798 |
| `DSA1-M03.md` | Arrays, Strings & the Core Patterns | 799 |
| `DSA1-M04.md` | Searching & Binary Search | 773 |
| `DSA1-M05.md` | Sorting (and a First Taste of Divide & Conquer) | 800 |
| `DSA1-M06.md` | Linked Lists, Stacks & Queues (+ Their Patterns) | 802 |

### DDCA: Digital Design & Computer Architecture

| File | Module | Lines |
|---|---|---|
| `DDCA-M01.md` | The Big Picture & the Language of the Machine | 799 |
| `DDCA-M02.md` | Making Decisions & Doing Maths | 800 |
| `DDCA-M03.md` | Remembering & Keeping Time: Sequential Logic | 799 |
| `DDCA-M04.md` | Where the Machine Keeps Things: Registers, Memory & the Register File | 772 |
| `DDCA-M05.md` | The RISC-V Processor | 813 |
| `DDCA-M06.md` | Build It, Extend It & Look Ahead | 816 |

### English Communication (LSRW)

| File | Module | Lines |
|---|---|---|
| `CSFE-M01.md` | Listening (CO1) | 574 |
| `CSFE-M02.md` | Speaking (CO2) | 710 |
| `CSFE-M03.md` | CO3 – Reading | 737 |
| `CSFE-M04.md` | CO4 – Writing | 623 |
| `CSFE-M05.md` | Presentation Skills (CO5) | 744 |
| `CSFE-M06.md` | Integration, Interviews & Certification (CO6) | 748 |

### Japanese (JLPT N5)

| File | Module | Lines |
|---|---|---|
| `JP-M01.md` | Kanji & Vocabulary | 775 |
| `JP-M02.md` | Core Grammar | 645 |
| `JP-M03.md` | Expressing Yourself with Elementary Grammar Patterns | 746 |
| `JP-M04.md` | The Four Skills: Reading, Listening, Speaking, Writing | 725 |

## How the notes are written

- Code is **Java** throughout, as you asked. Every snippet is short, commented in plain English, and states what it prints.
- Mathematics for AI uses fenced `latex` blocks for display formulas, matching the Module 1 file you already had. The other subjects use plain-text math in backticks so it survives copy-paste.
- Diagrams are ASCII, tables are Markdown. Nothing needs a renderer beyond a Markdown viewer.
- Japanese gives script + romaji + English the first time a word or pattern appears, then script + English.

## Two things to check against your professor's material

- **DDCA:** the logic-voltage thresholds (3.3 V family), the 2-bit `ALUOp` convention and the ALU-control code chosen for XOR are teaching choices, not fixed facts. Real RISC-V ALU control uses a different encoding. The files flag these as illustrative — relabel the tables in 5.8 and 6.2 if your slides differ.
- **Japanese:** the 80 kanji are a core N5 pick; some official lists run to about 103. Only the readings needed at N5 are listed.

## Known gap

`MTAI-MathematicsForAI/MTAI-M01.md` is your original file, kept exactly as you wrote it. It is the only file in the set without a per-sub-topic Example question and Solution block, because it predates this batch. Say the word and it can be brought in line with the other five.
