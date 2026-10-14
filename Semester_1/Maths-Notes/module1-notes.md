# Module 1 — Mathematical Logic & Proof Techniques

---

## 1. Propositions and Logical Connectives

**Proposition:** A declarative sentence that is either **True (T)** or **False (F)**, but not both.

- "7 is a prime number" → Proposition (True)
- "Close the door!" → Not a proposition (it's a command)
- "x + 2 = 5" → Not a proposition on its own (truth depends on x) — this is a *predicate*, covered later.

### Logical Connectives

| Name | Symbol | Read as | Meaning |
|---|---|---|---|
| Negation | ¬p (or ~p) | "not p" | True when p is False |
| Conjunction | p ∧ q | "p and q" | True only when both are True |
| Disjunction | p ∨ q | "p or q" | True when at least one is True |
| Implication | p → q | "if p then q" | False only when p is True and q is False |
| Biconditional | p ↔ q | "p if and only if q" | True when p and q have the same truth value |

### Truth Tables

**Negation**

| p | ¬p |
|---|---|
| T | F |
| F | T |

**Conjunction (AND)**

| p | q | p ∧ q |
|---|---|---|
| T | T | T |
| T | F | F |
| F | T | F |
| F | F | F |

**Disjunction (OR)**

| p | q | p ∨ q |
|---|---|---|
| T | T | T |
| T | F | T |
| F | T | T |
| F | F | F |

**Implication**

| p | q | p → q |
|---|---|---|
| T | T | T |
| T | F | F |
| F | T | T |
| F | F | T |

> Key intuition: p → q is only False when a *true hypothesis leads to a false conclusion*. If p is False, the implication is **vacuously true** — "if pigs fly, I'll give you $1000" is technically true if pigs never fly.

**Biconditional**

| p | q | p ↔ q |
|---|---|---|
| T | T | T |
| T | F | F |
| F | T | F |
| F | F | T |

---

## 2. Tautologies, Contradictions, Contingencies

- **Tautology:** A compound proposition that is **always True**, regardless of the truth values of its components.
  - Example: p ∨ ¬p ("p or not p") — always true (Law of Excluded Middle).
- **Contradiction:** A compound proposition that is **always False**.
  - Example: p ∧ ¬p — always false.
- **Contingency:** A proposition that is **neither** a tautology nor a contradiction — its truth value depends on the inputs.
  - Example: p → q (true in 3 rows, false in 1).

**How to check:** Build the full truth table. If the final column is all T → tautology; all F → contradiction; mixed → contingency.

---

## 3. Logical Equivalence

Two propositions **P** and **Q** are **logically equivalent** (written P ≡ Q) if they have identical truth values in every row of their truth table — equivalently, if P ↔ Q is a tautology.

### Principal Laws of Logic

| Law | Statement |
|---|---|
| Identity | p ∧ T ≡ p ; p ∨ F ≡ p |
| Domination | p ∨ T ≡ T ; p ∧ F ≡ F |
| Idempotent | p ∧ p ≡ p ; p ∨ p ≡ p |
| Double Negation | ¬(¬p) ≡ p |
| Commutative | p ∧ q ≡ q ∧ p ; p ∨ q ≡ q ∨ p |
| Associative | (p ∧ q) ∧ r ≡ p ∧ (q ∧ r) ; similarly for ∨ |
| **Distributive** | p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r) ; p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r) |
| **De Morgan's Laws** | ¬(p ∧ q) ≡ ¬p ∨ ¬q ; ¬(p ∨ q) ≡ ¬p ∧ ¬q |
| Absorption | p ∨ (p ∧ q) ≡ p ; p ∧ (p ∨ q) ≡ p |
| Negation | p ∨ ¬p ≡ T ; p ∧ ¬p ≡ F |
| Implication as OR | p → q ≡ ¬p ∨ q |
| **Contrapositive Law** | p → q ≡ ¬q → ¬p |

**Worked example — proving De Morgan's Law using a truth table:**

| p | q | p∧q | ¬(p∧q) | ¬p | ¬q | ¬p∨¬q |
|---|---|---|---|---|---|---|
| T | T | T | F | F | F | F |
| T | F | F | T | F | T | T |
| F | T | F | T | T | F | T |
| F | F | F | T | T | T | T |

Columns ¬(p∧q) and ¬p∨¬q match exactly → equivalence proven.

---

## 4. Conditional and Biconditional Reasoning

For a conditional statement **p → q**:

| Name | Form | Relation to original |
|---|---|---|
| Original (Conditional) | p → q | — |
| **Converse** | q → p | swap hypothesis & conclusion |
| **Inverse** | ¬p → ¬q | negate both |
| **Contrapositive** | ¬q → ¬p | swap AND negate |

**Key fact:** The original and its contrapositive are **always logically equivalent** (p → q ≡ ¬q → ¬p). The converse and inverse are also equivalent to each other, but **not** equivalent to the original in general.

Example: "If it rains, the ground is wet." (p → q)
- Converse: "If the ground is wet, it rains." (not necessarily true — could be a sprinkler)
- Inverse: "If it doesn't rain, the ground isn't wet." (also not necessarily true)
- Contrapositive: "If the ground is not wet, it didn't rain." (logically must be true if original is true)

### Necessary vs Sufficient Conditions

For p → q:
- **p is a sufficient condition for q**: p being true is *enough* to guarantee q.
- **q is a necessary condition for p**: q *must* be true for p to be true (q is required, though not necessarily enough on its own).

Example: "If you are a dog (p), then you are a mammal (q)."
- Being a dog is **sufficient** for being a mammal.
- Being a mammal is **necessary** for being a dog (but not sufficient — a cat is also a mammal).

For biconditional p ↔ q: p is **necessary and sufficient** for q (and vice versa).

---

## 5. Rules of Inference & Validity of Arguments

An **argument** is a sequence of propositions (premises) leading to a conclusion. It is **valid** if whenever all premises are true, the conclusion must also be true.

### Core Rules of Inference

| Rule | Form | Example |
|---|---|---|
| **Modus Ponens** | p → q, p ⊢ q | "If it rains, streets are wet. It rains. ∴ Streets are wet." |
| **Modus Tollens** | p → q, ¬q ⊢ ¬p | "If it rains, streets are wet. Streets aren't wet. ∴ It didn't rain." |
| **Hypothetical Syllogism** | p → q, q → r ⊢ p → r | Chaining two conditionals |
| **Disjunctive Syllogism** | p ∨ q, ¬p ⊢ q | "It's Monday or Tuesday. Not Monday. ∴ Tuesday." |
| **Addition** | p ⊢ p ∨ q | From p, you may conclude p ∨ (anything) |
| **Simplification** | p ∧ q ⊢ p | From a conjunction, extract either part |
| **Conjunction** | p, q ⊢ p ∧ q | Combine two known truths |
| **Resolution** | p ∨ q, ¬p ∨ r ⊢ q ∨ r | Core rule used in automated theorem proving / SAT solvers |

**Worked example (Modus Tollens + Hypothetical Syllogism combined):**
1. p → q ("If I study, I pass")
2. q → r ("If I pass, I graduate")
3. ¬r ("I did not graduate")
- From 1, 2 via Hypothetical Syllogism: p → r
- From that and 3, via Modus Tollens: ¬p → "I did not study"

### Common Fallacies (invalid patterns to avoid)
- **Affirming the Consequent:** p → q, q ⊢ p (INVALID — this is the fallacy version of assuming the converse holds)
- **Denying the Antecedent:** p → q, ¬p ⊢ ¬q (INVALID — this assumes the inverse holds)

---

## 6. Predicates and Quantifiers

A **predicate** P(x) is a statement whose truth depends on the variable x (becomes a proposition once x is assigned a value or quantified).

### Quantifiers

| Symbol | Name | Meaning |
|---|---|---|
| ∀x P(x) | Universal quantifier | "For all x, P(x) is true" |
| ∃x P(x) | Existential quantifier | "There exists an x such that P(x) is true" |

Example: Let P(x): "x is even", domain = integers.
- ∀x P(x) → False (not every integer is even)
- ∃x P(x) → True (e.g., x = 2)

### Nested Quantifiers

Order matters! 
- ∀x ∃y (x + y = 0) — "for every x, there's some y that makes it zero" → True over integers (y = −x)
- ∃y ∀x (x + y = 0) — "there's one single y that works for every x" → False (no single y works for all x)

### Negating Quantified Statements

| Statement | Negation |
|---|---|
| ¬(∀x P(x)) | ≡ ∃x ¬P(x) |
| ¬(∃x P(x)) | ≡ ∀x ¬P(x) |

For nested quantifiers, negation flips **every** quantifier and negates the innermost predicate:
- ¬(∀x ∃y P(x,y)) ≡ ∃x ∀y ¬P(x,y)

**Example:** "All students passed the exam" = ∀x P(x). Negation = "There exists a student who did NOT pass" = ∃x ¬P(x). (NOT "all students failed" — that's a common mistake.)

---

## 7. Normal Forms (CNF & DNF)

- **DNF (Disjunctive Normal Form):** An OR of ANDs.
  - Form: (a ∧ b) ∨ (¬a ∧ c) ∨ ...
- **CNF (Conjunctive Normal Form):** An AND of ORs.
  - Form: (a ∨ b) ∧ (¬a ∨ c) ∧ ...

Every propositional formula can be converted into an equivalent CNF or DNF (using De Morgan's laws, distributive laws, and double negation).

**Conceptual importance:**
- **SAT (Boolean Satisfiability Problem):** Almost always stated in CNF — "does there exist an assignment of T/F to variables making the whole CNF formula true?" This is the canonical NP-complete problem.
- **Digital circuits:** DNF corresponds naturally to a sum-of-products circuit design (OR of AND gates); CNF to product-of-sums.
- **Query logic / databases:** WHERE clauses combining conditions with AND/OR map directly onto these normal forms, useful for query optimization.

**Worked example — converting to CNF:**
Convert ¬(p ∧ q) → r to CNF.
1. Rewrite implication: ¬(¬(p ∧ q)) ∨ r
2. Double negation: (p ∧ q) ∨ r
3. Distribute: (p ∨ r) ∧ (q ∨ r) ← this is CNF.

---

## 8. Methods of Proof

| Method | Idea | When to use |
|---|---|---|
| **Direct Proof** | Assume p is true, show a logical chain leads to q. | Straightforward algebraic/structural claims |
| **Proof by Contraposition** | Prove ¬q → ¬p instead of p → q (equivalent). | When "p is true" is hard to work with directly, but "q is false" gives more structure |
| **Proof by Contradiction** | Assume the negation of the goal is true, derive a contradiction (something false), conclude the original must be true. | Great for proving non-existence, irrationality, infinitude |
| **Proof by Cases** | Split into exhaustive, mutually exclusive cases; prove the claim in each. | When the domain naturally splits (e.g., n even vs odd) |
| **Disproof by Counterexample** | To disprove a universal claim ∀x P(x), exhibit one x where P(x) is false. | Refuting a conjecture |

**Example — Direct Proof:** Prove: if n is even, then n² is even.
- Assume n is even → n = 2k for some integer k.
- n² = (2k)² = 4k² = 2(2k²), which is 2×(integer) → n² is even. ∎

**Example — Proof by Contradiction:** Prove √2 is irrational.
- Assume, for contradiction, √2 is rational → √2 = a/b in lowest terms (gcd(a,b)=1).
- Then 2 = a²/b² → a² = 2b² → a² is even → a is even → a = 2k.
- Substitute: (2k)² = 2b² → 4k² = 2b² → b² = 2k² → b² is even → b is even.
- But then both a and b are even, contradicting gcd(a,b) = 1. ∎ (So √2 cannot be rational.)

**Example — Proof by Cases:** Prove: for any integer n, n² + n is even.
- Case 1: n is even → n = 2k → n² + n = 4k² + 2k = 2(2k² + k) → even.
- Case 2: n is odd → n = 2k+1 → n² + n = (2k+1)² + (2k+1) = (2k+1)(2k+2) = 2(2k+1)(k+1) → even.
- Both cases give even → statement proven for all integers. ∎

**Example — Counterexample:** Disprove: "All prime numbers are odd."
- p = 2 is prime and even → counterexample found → statement is false.

---

## 9. Mathematical Induction

Used to prove statements P(n) hold for **all** integers n ≥ some base value.

### Standard (Weak) Induction
1. **Base Case:** Show P(n₀) is true (usually n₀ = 0 or 1).
2. **Inductive Step:** Assume P(k) is true (inductive hypothesis) for some arbitrary k ≥ n₀, then prove P(k+1) is true.
3. **Conclusion:** By induction, P(n) holds for all n ≥ n₀.

**Worked example:** Prove 1 + 2 + 3 + ... + n = n(n+1)/2 for all n ≥ 1.
- Base case (n=1): LHS = 1, RHS = 1(2)/2 = 1. ✓
- Inductive step: Assume 1+2+...+k = k(k+1)/2. Show for k+1:
  - 1+2+...+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k/2 + 1) = (k+1)(k+2)/2. This matches the formula with n = k+1. ✓
- By induction, the formula holds for all n ≥ 1. ∎

### Strong Induction
- **Inductive Step** differs: assume P(n₀), P(n₀+1), ..., P(k) are **all** true, then prove P(k+1).
- Useful when P(k+1) depends on more than just the immediately preceding case (e.g., proving every integer > 1 has a prime factorization, Fibonacci-related proofs).

### Well-Ordering Principle
Every non-empty set of **positive integers** (or non-negative integers) has a **least element**. 
- This principle is logically equivalent to the principle of mathematical induction — either can be used to derive the other.
- Often used as an alternative proof technique: assume a counterexample set is non-empty, extract its least element, and derive a contradiction.

---

## 10. Reasoning about Program/Protocol Correctness (Informal, Logic-Based)

Even without code, correctness reasoning uses logical assertions:

- **Precondition (P):** A logical assertion that must be true *before* an operation/step executes.
- **Postcondition (Q):** A logical assertion guaranteed to be true *after* the operation, **given** the precondition held.
- **Invariant:** A condition that remains true throughout a process (e.g., every iteration of a loop, every step of a protocol) — it must hold at the start and be preserved by each step.

**Hoare-triple style notation (conceptual):** {P} S {Q} means: "If P holds before step S runs, then Q holds after S runs."

**Example (informal, no code):** Consider a step "increase counter by 1, starting from a non-negative counter."
- Precondition: counter ≥ 0
- Postcondition: counter ≥ 1
- If we repeat this step in a loop, the invariant "counter ≥ 0" holds before and after every iteration — this is the property that lets us reason the counter never becomes invalid, without tracing every single run.

This mirrors induction: the invariant holding initially = base case; the invariant being preserved by one step = inductive step; therefore, the invariant holds after any number of steps = conclusion for all n.

---

## 11. Common Proof Pitfalls & Standards of Rigor

**Pitfalls to avoid:**
1. **Circular reasoning** — assuming what you're trying to prove.
2. **Confusing a statement with its converse** — proving q → p when you needed p → q.
3. **Proof by example** — showing it works for a few cases does NOT prove a universal (∀) claim; only a single counterexample is needed to *disprove* one.
4. **Incomplete case analysis** — missing a case makes the proof invalid, even if all covered cases are correct.
5. **Unjustified steps** — every implication in a proof must follow from a definition, previously established result, or a valid rule of inference — not "intuition."
6. **Off-by-one/base-case errors in induction** — forgetting or mis-stating the base case invalidates the whole induction.
7. **Assuming what needs proving mid-proof** ("begging the question").

**Standards of a rigorous proof:**
- Clearly state what is given (hypotheses/definitions) and what is to be shown.
- Every step must be logically justified.
- Use precise definitions — don't rely on intuition alone for terms like "even," "prime," "divides."
- End with a clear conclusion (often marked with ∎ or Q.E.D.).
- The proof should be *complete*: it should cover every case in the domain being discussed, with no gaps.

---

### Quick Reference Summary

- **Logical equivalence tools:** De Morgan's, Distributive, Contrapositive, Implication-as-OR
- **p → q ≡ ¬q → ¬p** (contrapositive) — always true; converse/inverse are NOT equivalent to the original
- **Valid inference patterns:** Modus Ponens, Modus Tollens, Hypothetical/Disjunctive Syllogism, Resolution
- **Invalid patterns:** Affirming the Consequent, Denying the Antecedent
- **¬∀ ≡ ∃¬** and **¬∃ ≡ ∀¬**
- **CNF = AND of ORs** (used in SAT); **DNF = OR of ANDs** (used in circuit sum-of-products)
- **Proof toolkit:** direct, contraposition, contradiction, cases, counterexample, induction (weak/strong), well-ordering
