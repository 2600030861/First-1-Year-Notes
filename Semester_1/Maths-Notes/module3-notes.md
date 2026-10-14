# Module 3 — Combinatorics & Counting

---

## 1. Fundamental Counting Principles

**Sum Rule:** If a task can be done in one of *n₁* ways **or** one of *n₂* ways (mutually exclusive, no overlap), the total number of ways is n₁ + n₂.
- Example: A menu has 4 veg starters or 3 non-veg starters → 4 + 3 = 7 starter choices.

**Product Rule:** If a task consists of a sequence of steps, step 1 done in n₁ ways, step 2 in n₂ ways (independent of step 1's choice), etc., the total is n₁ × n₂ × ... × nₖ.
- Example: A password is 1 letter followed by 1 digit → 26 × 10 = 260 possibilities.

**Counting by Cases:** When a direct product/sum rule doesn't cleanly apply, split the problem into exhaustive, non-overlapping cases, count each separately, then sum (this is the sum rule applied deliberately as a strategy).
- Example: Count numbers from 1–100 divisible by 2 or 5. Split into "divisible by 2", "divisible by 5", handle overlap via inclusion-exclusion (see below) rather than naive addition.

---

## 2. Permutations and Combinations

**Permutation:** An **ordered** arrangement of r objects chosen from n distinct objects.
- P(n, r) = n! / (n−r)!
- Example: Arrange 3 of 5 books on a shelf → P(5,3) = 5!/2! = 60.

**Combination:** An **unordered** selection of r objects from n distinct objects.
- C(n, r) = n! / (r!(n−r)!) — also written ⁿCᵣ or (n choose r)
- Example: Choose 3 of 5 books to take on a trip (order doesn't matter) → C(5,3) = 10.

**Key distinction:** Permutation cares about order (arranging), combination doesn't (selecting).

### Permutations with Repetition
- If elements **can repeat** in each position: total arrangements = nʳ (choosing r positions from n options each time, product rule).
  - Example: A 4-digit PIN using digits 0–9 (repeats allowed) → 10⁴ = 10,000.
- If arranging a multiset with repeated identical items (e.g., letters of a word with repeats): 
  - Number of distinct arrangements = n! / (n₁! × n₂! × ... × nₖ!), where n₁,...,nₖ are the counts of each repeated item.
  - Example: Arrangements of "MISSISSIPPI" (11 letters: M-1, I-4, S-4, P-2) = 11!/(1!4!4!2!) = 34,650.

### Circular Permutations
- Arranging n distinct objects in a **circle** (rotations considered identical): (n−1)! arrangements.
  - Intuition: fix one object's position to remove rotational duplicates, then arrange the rest linearly.
- If reflections are also considered identical (e.g., a necklace that can be flipped): (n−1)!/2.

---

## 3. Combinations with Repetition (Stars-and-Bars)

**Problem type:** How many ways to choose r items from n **types**, where repetition of types is allowed and order doesn't matter (e.g., choosing r fruits from n varieties, unlimited stock of each)?

**Formula:** C(n + r − 1, r)

**Stars-and-Bars technique:** Represent r selected items as r "stars" (★) and use (n−1) "bars" (|) to divide them into n groups (one per type). The number of arrangements of these r stars and (n−1) bars in a row = C(n+r−1, r).

**Worked example:** Distribute 10 identical candies among 3 children (each child can get 0 or more).
- This is choosing with repetition: n = 3 types (children), r = 10 items (candies).
- Stars and bars: 10 stars, 2 bars (to split into 3 groups) → total symbols = 12, choose positions for the 2 bars → C(12, 2) = 66.

**General distribution formula:** Number of ways to distribute r identical items into n distinct groups (each group ≥ 0) = C(n+r−1, r). If each group must have **at least 1** item, first give 1 to each group, then distribute the remaining (r−n) freely: C((r−n)+n−1, r−n) = C(r−1, n−1).

---

## 4. Binomial Theorem & Binomial Coefficients

**Binomial Theorem:**
(x + y)ⁿ = Σₖ₌₀ⁿ C(n,k) xⁿ⁻ᵏ yᵏ

- Each term's coefficient C(n,k) is called a **binomial coefficient**.
- Example: (x+y)³ = C(3,0)x³ + C(3,1)x²y + C(3,2)xy² + C(3,3)y³ = x³ + 3x²y + 3xy² + y³.

### Pascal's Identity
C(n, k) = C(n−1, k−1) + C(n−1, k)

**Intuition:** To choose k items from n, either include a specific item (then choose k−1 more from the remaining n−1) or exclude it (then choose all k from the remaining n−1).

**Pascal's Triangle:** Arranging binomial coefficients in a triangular grid, where each entry is the sum of the two entries above it — a direct visual application of Pascal's identity.

### Common Combinatorial Identities

| Identity | Statement |
|---|---|
| Symmetry | C(n,k) = C(n, n−k) |
| Sum of row | Σₖ₌₀ⁿ C(n,k) = 2ⁿ (total subsets of an n-set — connects back to Module 2's power set!) |
| Vandermonde's identity | C(m+n, r) = Σₖ C(m,k)·C(n,r−k) |
| Hockey stick identity | Σᵢ₌ᵣⁿ C(i,r) = C(n+1, r+1) |

---

## 5. Inclusion-Exclusion Principle (General Form)

For n sets A₁, A₂, ..., Aₙ:

|A₁∪A₂∪...∪Aₙ| = Σ|Aᵢ| − Σ|Aᵢ∩Aⱼ| + Σ|Aᵢ∩Aⱼ∩Aₖ| − ... + (−1)ⁿ⁺¹|A₁∩A₂∩...∩Aₙ|

Pattern: alternately add all single-set sizes, subtract all pairwise intersections, add all triple intersections, and so on, alternating signs.

### Derangements

A **derangement** is a permutation of n objects where **no element appears in its original position** (every element is "displaced").

**Formula (derived via inclusion-exclusion):**
D(n) = n! · Σₖ₌₀ⁿ (−1)ᵏ/k! = n!(1 − 1/1! + 1/2! − 1/3! + ... ± 1/n!)

**Worked example — classic hat-check problem:** n people check hats; in how many ways can hats be returned so that **no one** gets their own hat back?
- D(n) as above. For n=4: D(4) = 4!(1 − 1 + 1/2 − 1/6 + 1/24) = 24 × (9/24) = 9.

**Derivation intuition:** Let Aᵢ = the set of permutations where element i IS in its original position (a "bad" event). We want |total| − |A₁∪A₂∪...∪Aₙ| (permutations avoiding *all* bad events). Apply inclusion-exclusion on the Aᵢ's, using |Aᵢ₁∩...∩Aᵢₖ| = (n−k)! (fixing k positions, permuting the rest freely).

---

## 6. Generalized Pigeonhole Principle & Counting Consequences

**Generalized form:** If n items are distributed into m containers, at least one container has ≥ ⌈n/m⌉ items.

**Counting consequence example:** Among any 100 people, at least ⌈100/12⌉ = 9 share a birth month.

**Application — guaranteed structure in sequences:** Among any n+1 integers chosen from {1, ..., 2n}, at least two must be consecutive, or (a classic variant) at least two must share a common factor structure, etc. — the principle guarantees combinatorial structure purely by counting, no probability needed.

---

## 7. Counting and Key-Space Sizing (Cryptographic Strength)

The **product rule** directly determines the size of a "key space" or "password space":

- A password of length L using an alphabet of size A has Aᴸ possible combinations (product rule, L independent positions).
  - Example: An 8-character password using lowercase letters only: 26⁸ ≈ 2.09 × 10¹¹ possibilities.
  - Adding uppercase, digits, symbols increases A, which grows the space **exponentially** with length — this is why length matters more than raw complexity per character in most brute-force resistance arguments.
- A cryptographic key of k bits has 2ᵏ possible keys (product rule with A=2 for each bit).
  - A 128-bit key → 2¹²⁸ ≈ 3.4 × 10³⁸ possible keys — this astronomically large count (not a probability argument) is exactly why brute-forcing modern keys is computationally infeasible.

**This is pure counting, not probability:** the *size* of the space is a combinatorial fact; only the *chance of guessing correctly within a given number of attempts* becomes a probability question layered on top of this count.

---

## 8. The Birthday Problem & Collision Counting

**Setup:** In a group of n people, how many people are needed before it becomes likely that two share a birthday (out of 365 possible days)?

**Combinatorial (counting) reasoning — not probability theory as taught here, but counted directly:**
- Total ways to assign birthdays to n people (with repetition allowed): 365ⁿ (product rule).
- Ways to assign birthdays with **all distinct** (no collision): 365 × 364 × 363 × ... × (365−n+1) = P(365, n) (permutation — each person picks a distinct day).
- **Fraction with no collision** = P(365,n) / 365ⁿ. The complement (1 − this fraction) gives the collision likelihood.
- Surprising result: this crosses 50% at just **n = 23** — far fewer than the "365/2" intuition suggests, because we're counting *pairs* (C(n,2) grows quadratically), not just individuals.

**Direct link to hash collisions:** If a hash function has m possible output values (like "365 days"), and you hash n items, the same counting structure applies:
- No-collision count = m × (m−1) × ... × (m−n+1) = P(m, n)
- This is exactly why hash table designers and cryptographers care about the **square root of the output space**, not the full space: collisions become likely once n approaches √m (the "birthday bound"), which is why a hash function needs an output space *much larger* than the number of expected items to keep collisions rare — and why cryptographic hash security against collision attacks is measured in **half** the bit-length (e.g., a 256-bit hash gives only ~128-bit collision resistance).

---

## 9. Recurrence Relations as Counting Tools

A **recurrence relation** expresses a combinatorial quantity aₙ in terms of earlier terms (aₙ₋₁, aₙ₋₂, ...), often derived by considering what happens with "the last item added."

**Worked example — counting binary strings of length n with no two consecutive 0s:**
- Let aₙ = count of such strings.
- Consider the last character: if it's a '1', the rest (n−1 chars) can be any valid string → aₙ₋₁ ways.
- If it's a '0', the character before it must be '1' (to avoid "00"), and the first (n−2) chars form any valid string → aₙ₋₂ ways.
- Recurrence: aₙ = aₙ₋₁ + aₙ₋₂ (this is the Fibonacci recurrence!) with base cases a₁=2, a₂=3.

**Why this matters for DSA/CS:** This is exactly the technique used to derive recurrences for algorithm analysis (e.g., counting subproblems in DP) — formulating "what's the last/first choice, and how does it reduce to a smaller version of the same problem" is the same combinatorial thinking behind recursive algorithm design and dynamic programming recurrences.

---

## 10. Generating Functions (Introductory View) as a Counting Device

**Idea:** Encode a sequence a₀, a₁, a₂, ... as the coefficients of a formal power series:
G(x) = a₀ + a₁x + a₂x² + a₃x³ + ...

**Why it's useful for counting:** Many counting problems (like stars-and-bars distributions) can be represented by multiplying together simple generating functions (one factor per "choice"), and the coefficient of xʳ in the product gives the count of ways to make r total selections — turning a combinatorics problem into an algebra problem.

**Simple example:** The generating function for choosing any number of items from an unlimited supply of one type is 1 + x + x² + x³ + ... = 1/(1−x). Multiplying n such factors together (for n types) gives 1/(1−x)ⁿ, whose coefficient of xʳ (by the generalized binomial series) recovers exactly the stars-and-bars formula C(n+r−1, r).

*(This module treats generating functions only conceptually as "a counting device" — full manipulation techniques typically come in a more advanced treatment.)*

---

## 11. Catalan Numbers (Structural Counting Example)

**Catalan numbers** Cₙ count a surprising variety of recursively-structured combinatorial objects, all secretly the same underlying count:

**Formula:** Cₙ = C(2n, n)/(n+1) = (2n)! / ((n+1)! n!)

Sequence: C₀=1, C₁=1, C₂=2, C₃=5, C₄=14, C₅=42, ...

**Things Catalan numbers count (a small sample):**
- The number of valid sequences of n pairs of balanced parentheses, e.g., "(())" and "()()" for n=2 → C₂=2.
- The number of distinct **binary search trees** with n nodes (a direct DSA connection!).
- The number of ways to triangulate a convex polygon with n+2 sides using non-crossing diagonals.
- The number of monotonic lattice paths from (0,0) to (n,n) that never cross above the diagonal.

**Recurrence relation for Catalan numbers:**
Cₙ₊₁ = Σₖ₌₀ⁿ Cₖ · Cₙ₋ₖ, with C₀ = 1.

*(Intuition for the BST connection: choosing which of the n keys is the root splits the remaining keys into a "left subtree count" and "right subtree count," and the recurrence sums over all possible split points — exactly mirroring the general Catalan recurrence structure.)*

---

### Quick Reference Summary

- **Sum rule:** mutually exclusive alternatives → add. **Product rule:** independent sequential steps → multiply.
- **Permutation P(n,r) = n!/(n−r)!** (order matters); **Combination C(n,r) = n!/(r!(n−r)!)** (order doesn't)
- **Repetition permutations:** nʳ (positions can repeat); **multiset arrangements:** n!/(n₁!n₂!...nₖ!)
- **Circular permutations:** (n−1)!
- **Stars-and-bars (combinations with repetition):** C(n+r−1, r)
- **Binomial theorem:** (x+y)ⁿ = Σ C(n,k)xⁿ⁻ᵏyᵏ; **Pascal's identity:** C(n,k)=C(n−1,k−1)+C(n−1,k)
- **Inclusion-exclusion (general):** alternate +/− over all intersection combinations
- **Derangements D(n) = n!·Σ(−1)ᵏ/k!** — permutations with no fixed points
- **Generalized pigeonhole:** ≥⌈n/m⌉ guaranteed in some container
- **Key-space sizing:** Aᴸ (product rule) → foundation of brute-force resistance arguments
- **Birthday bound:** collisions become likely around n ≈ √m — foundational to hash & cryptographic collision resistance
- **Recurrences:** define aₙ via smaller cases — same thinking as DP/recursive algorithm design
- **Generating functions:** encode sequences as power series coefficients — algebraic counting device
- **Catalan numbers Cₙ = C(2n,n)/(n+1)** — count balanced parens, BST shapes, polygon triangulations, and more
