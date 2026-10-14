# Module 2 — Set Theory, Relations & Functions

---

## 1. Sets, Subsets, Power Sets

**Set:** An unordered collection of distinct elements. Notation: A = {1, 2, 3}.

- **Subset:** A ⊆ B means every element of A is also in B.
- **Proper subset:** A ⊂ B means A ⊆ B and A ≠ B.
- **Empty set (∅):** The set with no elements — a subset of every set.
- **Power set P(A):** The set of *all* subsets of A, including ∅ and A itself.
  - If |A| = n, then |P(A)| = 2ⁿ.
  - Example: A = {1, 2} → P(A) = {∅, {1}, {2}, {1,2}} → 2² = 4 subsets.

---

## 2. Set Operations and Venn Reasoning

| Operation | Symbol | Meaning |
|---|---|---|
| Union | A ∪ B | Elements in A, or B, or both |
| Intersection | A ∩ B | Elements in both A and B |
| Difference | A − B (or A\B) | Elements in A but not in B |
| Complement | A' (or Aᶜ) | Elements in the universal set U but not in A |

Venn diagrams give visual intuition: two overlapping circles inside a rectangle (the universal set U). Shading the overlap = intersection; shading everything covered by either circle = union; shading outside both circles = complement of the union, etc.

### Set Identities (and how to prove them)

| Law | Statement |
|---|---|
| Identity | A ∪ ∅ = A ; A ∩ U = A |
| Domination | A ∪ U = U ; A ∩ ∅ = ∅ |
| Idempotent | A ∪ A = A ; A ∩ A = A |
| Complement | A ∪ A' = U ; A ∩ A' = ∅ |
| Double Complement | (A')' = A |
| Commutative | A ∪ B = B ∪ A ; A ∩ B = B ∩ A |
| Associative | (A∪B)∪C = A∪(B∪C) |
| **Distributive** | A ∪ (B∩C) = (A∪B) ∩ (A∪C) ; A ∩ (B∪C) = (A∩B) ∪ (A∩C) |
| **De Morgan's** | (A∪B)' = A'∩B' ; (A∩B)' = A'∪B' |
| Absorption | A ∪ (A∩B) = A ; A ∩ (A∪B) = A |

**Proving identities — two standard techniques:**

1. **Element-chasing (double inclusion):** To prove X = Y, show X ⊆ Y and Y ⊆ X separately, by taking an arbitrary element and tracing through definitions.

   *Example:* Prove A ∩ (B∪C) = (A∩B) ∪ (A∩C).
   - Let x ∈ A ∩ (B∪C) → x ∈ A and x ∈ (B∪C) → x ∈ A and (x∈B or x∈C) → (x∈A and x∈B) or (x∈A and x∈C) → x ∈ (A∩B) ∪ (A∩C). This shows LHS ⊆ RHS.
   - Reverse the steps for RHS ⊆ LHS (each step above is an "iff", so it works both ways).
   - Hence equality. ∎

2. **Membership table:** Like a truth table, but rows are combinations of "in/out" (1/0) for each set, and you check if the final columns for both sides match for every row — directly analogous to logical equivalence, since ∪ ↔ ∨, ∩ ↔ ∧, complement ↔ negation.

---

## 3. Cartesian Products & Cardinality

**Cartesian Product:** A × B = {(a, b) | a ∈ A, b ∈ B} — the set of all ordered pairs.
- Order matters: A × B ≠ B × A in general.
- |A × B| = |A| × |B| for finite sets.

**Cardinality:** |A| denotes the number of elements in a finite set A.

### Inclusion-Exclusion Principle (foundational form)

For two sets: |A ∪ B| = |A| + |B| − |A ∩ B|
(Subtract the overlap once, since it was counted twice.)

For three sets:
|A ∪ B ∪ C| = |A|+|B|+|C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|

**Worked example:** In a class of 50 students, 30 study Math, 25 study Physics, 15 study both. How many study at least one?
|Math ∪ Physics| = 30 + 25 − 15 = 40 students.

---

## 4. Countable vs Uncountable Sets; Cantor's Diagonalization

- **Countably infinite set:** A set that can be put in one-to-one correspondence (bijection) with the natural numbers ℕ = {1, 2, 3, ...}. Even though infinite, its elements can be "listed" in a sequence.
  - Examples: ℤ (integers) is countable; ℚ (rationals) is countable (surprisingly!).
- **Uncountable set:** An infinite set with **no** such bijection with ℕ — "too big" to list.
  - Example: ℝ (real numbers), or even just the reals in (0,1), is uncountable.

### Cantor's Diagonalization Argument (conceptual sketch)

Goal: Show the real numbers in (0,1) cannot be listed/counted.
1. **Assume** (for contradiction) that all reals in (0,1) *can* be listed as r₁, r₂, r₃, ... (an infinite list, each written as an infinite decimal).
2. **Construct** a new number d by going down the diagonal: take the 1st digit of r₁, 2nd digit of r₂, 3rd digit of r₃, etc., and change each digit (e.g., add 1, wrapping 9→0).
3. This new number d differs from **every** rᵢ in at least the i-th digit — so d cannot equal any number in the list.
4. But d is itself a valid real number in (0,1) — contradiction, since we assumed the list contained *all* of them.
5. Therefore, no such complete listing exists → (0,1) (and hence ℝ) is uncountable. ∎

**Conceptual link to computation:** This same diagonalization technique underlies the proof that the **Halting Problem is undecidable**, and that there exist more languages/problems than there are possible programs (since programs are countable, but the set of all possible functions/problems is uncountable). It's the formal boundary marking "limits of computation."

---

## 5. Relations

**Relation:** A subset R ⊆ A × B. If (a,b) ∈ R, we write a R b.
- When A = B, R is a **relation on A**.

### Representations
- **As a set of ordered pairs:** R = {(1,2), (2,3), (1,1)}
- **Matrix representation:** An n×n 0/1 matrix M where M[i][j] = 1 if (aᵢ, aⱼ) ∈ R, else 0.
- **Digraph (directed graph) representation:** Elements as nodes; draw an arrow from a to b whenever a R b. Reflexive pairs show as self-loops.

### Properties of Relations (on a set A)

| Property | Definition | Matrix/Digraph clue |
|---|---|---|
| **Reflexive** | ∀a ∈ A, (a,a) ∈ R | Every diagonal entry = 1; every node has a self-loop |
| **Symmetric** | (a,b) ∈ R → (b,a) ∈ R | Matrix is symmetric across the diagonal; every arrow has a matching reverse arrow |
| **Antisymmetric** | (a,b) ∈ R and (b,a) ∈ R → a = b | No two distinct nodes have arrows both ways |
| **Transitive** | (a,b) ∈ R and (b,c) ∈ R → (a,c) ∈ R | Any 2-step path implies a direct edge |

**Example:** R = {(a,b) : a ≤ b} on integers.
- Reflexive? Yes (a ≤ a always).
- Symmetric? No (2 ≤ 3 but not 3 ≤ 2).
- Antisymmetric? Yes (a ≤ b and b ≤ a ⟹ a = b).
- Transitive? Yes (a ≤ b, b ≤ c ⟹ a ≤ c).

---

## 6. Equivalence Relations, Partitions, Equivalence Classes

**Equivalence Relation:** A relation that is **reflexive, symmetric, AND transitive**, all three.
- Example: "has the same remainder mod 3 as" — reflexive, symmetric, transitive. ✓
- Example: "=" (equality) is the simplest equivalence relation.

**Equivalence Class** of element a, written [a]: the set of all elements related to a. {x ∈ A : x R a}

**Partition:** Equivalence classes always **partition** the set — meaning they divide A into non-overlapping subsets whose union is all of A. Every element belongs to exactly one equivalence class.

**Link to hashing/data partitioning:** A hash function that groups keys into buckets based on "same hash value" is effectively defining an equivalence relation (same-bucket-as), and the buckets are exactly the equivalence classes — a direct real-world use of this abstract structure. Similarly, sharding/partitioning data by a key range or hash is applying this same mathematical idea.

---

## 7. Partial Orders, Total Orders, Hasse Diagrams, Lattices

**Partial Order:** A relation that is **reflexive, antisymmetric, and transitive**.
- Example: "divides" (|) on positive integers; "⊆" on sets.
- A set with a partial order is called a **poset**.

**Total Order (linear order):** A partial order where *every* pair of elements is comparable (for any a, b: either a R b or b R a).
- Example: ≤ on integers is total; "divides" is NOT total (e.g., 2 and 3 are incomparable — neither divides the other).

### Hasse Diagram
A simplified visual of a poset: 
- Omit self-loops (reflexivity implied).
- Omit edges implied by transitivity (only draw "covering" relations — direct connections).
- Draw "greater" elements higher up; an edge going up means "is related to."

### Special Elements in a Poset
- **Maximal element:** Nothing above it (no b with a < b).
- **Minimal element:** Nothing below it.
- **Greatest element:** An element ≥ every other element (unique if it exists).
- **Least element:** An element ≤ every other element (unique if it exists).
- **Upper bound / Lower bound** of a subset: elements ≥ / ≤ every element of that subset.
- **Least Upper Bound (LUB / supremum, "join" ∨)** and **Greatest Lower Bound (GLB / infimum, "meet" ∧)**.

**Lattice:** A poset in which **every pair** of elements has both a join (LUB) and a meet (GLB).

**Link to computing:** Type hierarchies (e.g., subtype relationships in programming languages) form a poset under "is-a-subtype-of"; the join/meet operations correspond to finding the most specific common supertype or most general common subtype. Dependency graphs (e.g., build systems, task scheduling) rely on partial orders to define valid execution orderings (topological sort is essentially "linearizing" a partial order into a total order).

---

## 8. Closure of Relations

Given a relation R on A that may lack a property, its **closure** is the *smallest* relation ⊇ R that *does* have that property.

- **Reflexive closure:** R ∪ {(a,a) : a ∈ A} — add all missing self-loops.
- **Symmetric closure:** R ∪ {(b,a) : (a,b) ∈ R} — add all missing reverse pairs.
- **Transitive closure:** Add (a,c) whenever there's a chain a→b→c (repeat until no new pairs can be added). Formally, R⁺ = R ∪ R² ∪ R³ ∪ ... 

**Example:** R = {(1,2), (2,3)} on {1,2,3}.
- Reflexive closure: add (1,1), (2,2), (3,3).
- Symmetric closure: add (2,1), (3,2).
- Transitive closure: since (1,2) and (2,3) ∈ R, add (1,3) → R⁺ = {(1,2),(2,3),(1,3)}.

**Why it matters:** Transitive closure is exactly what's computed by reachability algorithms (e.g., "can node A reach node C in a graph?") — Warshall's algorithm computes transitive closure efficiently, which is foundational to graph reachability, database query evaluation (recursive queries), and dependency resolution.

---

## 9. Functions

**Function f: A → B:** A relation where **every** element of A (the domain) maps to **exactly one** element of B (the codomain).

- **Domain:** The input set A.
- **Codomain:** The declared output set B.
- **Range (image):** The actual set of outputs achieved, {f(a) : a ∈ A} ⊆ B (may be a proper subset of the codomain).

### Types of Functions

| Type | Definition | Intuition |
|---|---|---|
| **Injective (one-to-one)** | a₁ ≠ a₂ ⟹ f(a₁) ≠ f(a₂) | No two inputs share an output |
| **Surjective (onto)** | ∀b ∈ B, ∃a ∈ A such that f(a) = b | Every codomain element is "hit" |
| **Bijective** | Both injective and surjective | Perfect one-to-one pairing; invertible |

**Composition:** (g ∘ f)(x) = g(f(x)) — apply f first, then g. Requires the range of f to fit within the domain of g.

**Inverse function f⁻¹:** Exists **only if f is bijective**. f⁻¹(f(x)) = x and f(f⁻¹(y)) = y.

**Worked example:** f: ℤ → ℤ, f(x) = 2x.
- Injective? Yes (2x₁ = 2x₂ ⟹ x₁ = x₂).
- Surjective onto ℤ? No — odd numbers are never hit (range = even integers only, a proper subset of codomain ℤ).
- So f is injective but not surjective, hence not bijective, hence not invertible over ℤ→ℤ (though it is invertible if codomain is restricted to even integers).

---

## 10. Special Functions Relevant to Computing

- **Floor function ⌊x⌋:** The greatest integer ≤ x. ⌊3.7⌋ = 3, ⌊−3.7⌋ = −4.
- **Ceiling function ⌈x⌉:** The smallest integer ≥ x. ⌈3.2⌉ = 4, ⌈−3.2⌉ = −3.
- **Modulo as a function:** a mod n = the remainder when a is divided by n, always in range [0, n−1] for positive n. This is a function ℤ × ℤ⁺ → {0,...,n−1}.
- **Hashing functions as set-to-set mappings:** A hash function h: Keys → {0, 1, ..., m−1} (the bucket indices) is mathematically just a function from a (potentially huge/infinite) domain to a small finite codomain. Since |Keys| is typically far larger than the number of buckets, h **cannot be injective** — collisions are mathematically guaranteed once |Keys| > m (this connects directly to the pigeonhole principle below).

---

## 11. Pigeonhole Principle

**Statement:** If n items are placed into m containers, and n > m, then **at least one container holds more than one item.**

**Generalized form:** If n items go into m containers, at least one container holds ≥ ⌈n/m⌉ items.

### Consequences relevant to computing

- **Hash collisions:** If you hash more items than there are buckets (n > m), a collision is *guaranteed* — this is precisely the pigeonhole principle in action, and it's why collision-handling (chaining, open addressing) is a fundamental, unavoidable part of hash table design, not just an edge case.
- **Cryptography (birthday paradox / hash security):** In a cryptographic hash function with output space of size 2ᵏ, the pigeonhole principle guarantees collisions *exist* — the real security question (birthday bound) is only about how *hard* they are to *find*, not whether they exist. This underlies collision-resistance requirements in hash design (e.g., why 128-bit hashes are considered weak against ~2⁶⁴-effort birthday attacks).

**Worked example:** In any group of 13 people, at least two share a birth month (12 months = 12 "pigeonholes", 13 people = "pigeons" → n > m guarantees a collision).

---

### Quick Reference Summary

- **Power set size:** |P(A)| = 2ⁿ for |A| = n
- **Set identities mirror logic identities:** ∪↔∨, ∩↔∧, complement↔negation, De Morgan's applies to both
- **Inclusion-Exclusion (2 sets):** |A∪B| = |A|+|B|−|A∩B|
- **Cantor's diagonalization** → proves ℝ is uncountable → conceptually underlies undecidability results (e.g., Halting Problem)
- **Equivalence relation = reflexive + symmetric + transitive** → induces a partition into equivalence classes (≈ hashing buckets)
- **Partial order = reflexive + antisymmetric + transitive**; **total order** additionally requires every pair comparable
- **Closures:** smallest relation ⊇ R satisfying a property; transitive closure ↔ graph reachability
- **Bijective = injective + surjective** → only bijections have true inverses
- **Pigeonhole principle:** n > m items/containers ⟹ guaranteed collision — foundational to hashing & cryptographic collision arguments
