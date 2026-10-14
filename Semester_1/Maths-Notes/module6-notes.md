# Module 6 - Boolean Algebra, Algebraic Structures, Finite Fields & Coding Theory

## Table of Contents

**Session 27 — Boolean algebra**
1. [Boolean Algebra: Definition & Axioms](#1-boolean-algebra-definition--axioms)
2. [Boolean Expressions, Boolean Functions & Truth Tables](#2-boolean-expressions-boolean-functions--truth-tables)
3. [Boolean Identities](#3-boolean-identities)
4. [Duality Principle](#4-duality-principle)
5. [Minterms, Maxterms, SOP (DNF) and POS (CNF)](#5-minterms-maxterms-sop-dnf-and-pos-cnf)
6. [Algebraic Simplification](#6-algebraic-simplification)
7. [Karnaugh Maps & Circuit Minimisation](#7-karnaugh-maps--circuit-minimisation)

**Session 28 — Algebraic structures**

8. [Binary Operations](#8-binary-operations)
9. [Semigroups](#9-semigroups)
10. [Monoids](#10-monoids)
11. [Groups (and Abelian Groups)](#11-groups-and-abelian-groups)
12. [Subgroups](#12-subgroups)
13. [Cyclic Groups](#13-cyclic-groups)

**Session 29 — Modular groups**

14. [The Additive Group of Integers Modulo n](#14-the-additive-group-of-integers-modulo-n)
15. [The Multiplicative Group Modulo a Prime and Group-Based Encryption](#15-the-multiplicative-group-modulo-a-prime-and-group-based-encryption)

**Session 30 — Rings, fields, finite fields**

16. [Rings](#16-rings)
17. [Fields](#17-fields)
18. [Finite Fields GF(p) and GF(2)](#18-finite-fields-gfp-and-gf2)
19. [The Field GF(2^n)](#19-the-field-gf2n)
20. [Parity and its Link to GF(2)](#20-parity-and-its-link-to-gf2)
21. [Polynomials over Z2 and CRC](#21-polynomials-over-z2-and-crc)

**Session 31 — Error-detecting and error-correcting codes**

22. [Hamming Distance](#22-hamming-distance)
23. [Hamming Bound (Sphere-Packing Bound)](#23-hamming-bound-sphere-packing-bound)
24. [Error-Detecting Codes](#24-error-detecting-codes)
25. [Error-Correcting Codes & Linear Codes (Hamming (7,4))](#25-error-correcting-codes--linear-codes-hamming-74)

[Master checklist of all questions](#-master-checklist--every-question-in-your-module-6-file) · [Quick formula sheet](#-quick-formula-sheet)

---

# 1. Boolean Algebra: Definition & Axioms

## 📖 Explanation

**Boolean algebra** is the branch of mathematics that deals with variables taking **two possible values: true ($1$) or false ($0$).** It is the mathematics behind logic, computer science and **digital circuit design.**

**Formal definition.** Let $B$ be a non-empty set with
- two binary operations $+$ (OR) and $\cdot$ (AND),
- two distinct elements $0$ and $1$,
- a unary operation $'$ (complement, NOT).

Then $B$ is a **Boolean algebra** if the following axioms hold for all $a,b,c\in B$:

| Axiom | Name | Statement |
|-------|------|-----------|
| **B1** | Identity laws | $a+0=a,\qquad a\cdot1=a$ |
| **B2** | Commutative laws | $a+b=b+a,\qquad a\cdot b=b\cdot a$ |
| **B3** | Associative laws | $(a+b)+c=a+(b+c),\qquad (a\cdot b)\cdot c=a\cdot(b\cdot c)$ |
| **B4** | Distributive laws | $a+(b\cdot c)=(a+b)\cdot(a+c),\qquad a\cdot(b+c)=(a\cdot b)+(a\cdot c)$ |
| **B5** | Complement laws | $a+a'=1,\qquad a\cdot a'=0$ |

> ⚠️ **Notice the first distributive law:** unlike ordinary arithmetic, **$+$ also distributes over $\cdot$**: $a+bc=(a+b)(a+c)$. This is the law students most often forget.

**Observation (preview of duality, Topic 4):** every axiom comes in a **pair** — one is obtained from the other by swapping $+\leftrightarrow\cdot$ and $0\leftrightarrow1$.

**➕ Added — standard models**
- **Two-valued Boolean algebra** $B=\{0,1\}$ with OR, AND, NOT — the one used in digital logic.
- The **power set** of a set (with $\cup,\cap$, complement, $\varnothing$, universal set) is also a Boolean algebra — this is the link back to Module 2 (set identities) and Module 1 (propositional logic: $\vee,\wedge,\neg$).

## 🧪 Examples

- In $B=\{0,1\}$: $1+0=1$ and $1\cdot0=0$; $a=1\Rightarrow a'=0$ and $a+a'=1+0=1$ ✓ (complement law).
- Check distributive law B4 with $a=1,b=0,c=0$: $a+bc=1+0=1$ and $(a+b)(a+c)=(1+0)(1+0)=1\cdot1=1$ ✓.

## ❓ Questions in the module on this topic

*No standalone questions on the axioms in your notes — they are used to justify steps in the case studies (Topics 2, 3 and 6).*

---

# 2. Boolean Expressions, Boolean Functions & Truth Tables

## 📖 Explanation

**Boolean variable.** A variable that takes values only in $B=\{0,1\}$.

**The set $B^n$.** $B^n=\{(x_1,x_2,\dots,x_n)\mid x_i\in B\}$ is the set of all $n$-tuples of 0s and 1s. It has $2^n$ elements.

**Boolean function of degree $n$.** A function $f:B^n\to B$.

**Truth table.** Lists **every input combination and the corresponding output.** For $n$ variables the table has $2^n$ rows.

**➕ Added:** there are $2^{2^n}$ different Boolean functions of degree $n$ (each of the $2^n$ rows can output 0 or 1): 4 functions of one variable, 16 of two, 256 of three.

**XOR (exclusive OR), $\oplus$.** Defined by $1\oplus1=0,\ 1\oplus0=1,\ 0\oplus1=1,\ 0\oplus0=0$:

| $x$ | $y$ | $x\oplus y$ |
|-----|-----|-------------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

XOR gives $1$ when the two inputs are **different** and $0$ when they are the same. Algebraic form:

$$x\oplus y=x\cdot y'+x'\cdot y .$$

**How to evaluate a function from its formula (the method used in every case study):** write all $2^n$ input rows, add helper columns for each complement ($T'$, $E'$, …), then compute each product term, then the OR of the terms.

## 🧪 Examples

**Example 1 — XOR as a function.** $F(A,B)=A\cdot B'+A'\cdot B$.
- $A=1,B=0$: $F=1\cdot1+0\cdot0=1$.
- $A=1,B=1$: $F=1\cdot0+0\cdot1=0$.

**Example 2 — AND.** $F(x,y)=xy$ is a Boolean function of degree 2 with $F(1,1)=1$, $F(1,0)=0$, $F(0,1)=0$, $F(0,0)=0$:

| $x$ | $y$ | $F(x,y)=xy$ |
|-----|-----|-------------|
| 1 | 1 | 1 |
| 1 | 0 | 0 |
| 0 | 1 | 0 |
| 0 | 0 | 0 |

**Example 3 — reading a formula.** $F(A,B,C)=A\cdot B'+C$.
- The term $A\cdot B'$ is true only when $A=1$ and $B=0$.
- "$+C$" means $F$ is also true **whenever $C=1$**, regardless of $A$ and $B$.

## ❓ Questions in the module on this topic

### Case Study 1 — Traffic Light Control System Using Boolean Algebra

A smart-city traffic-light controller uses three binary inputs:
- $V$ = Vehicle detected
- $T$ = Timer permits the Green phase
- $E$ = Emergency vehicle detected

The controller produces three outputs: $G$ = Green light, $Y$ = Yellow light, $R$ = Red light.

For the simplified model:

$$G=VTE',\qquad Y=VT'E',\qquad R=V'+E.$$

**Task 1:** Construct the truth table for $G$, $Y$ and $R$. Express the output functions using Boolean algebra and minterm notation. Identify and apply relevant Boolean axioms and identities to verify the functions.

**Task 2:** Simplify the given Boolean functions using Boolean identities and algebraic simplification. Then determine the dual of selected Boolean expressions by interchanging $+$ with $\cdot$ and $0$ with $1$. Explain how simplification removes redundant logic.

**Task 3:** Represent a selected Boolean function using a Karnaugh map (K-map) and obtain its minimum Boolean expression. Compare the original and simplified expressions.

*(Tasks are repeated under Topics 3, 4, 5, 6 and 7 where they apply.)*

### Practice Case Study — Smart Home Security System Using Boolean Algebra

A smart-home security system monitors the status of a door sensor, motion sensor and security mode. The system activates an alarm when suspicious activity is detected.

Three binary inputs: $D$ = Door is open, $M$ = Motion is detected, $S$ = Security mode is active.
Three outputs: $A$ = Alarm ON, $L$ = Security light ON, $N$ = Normal / no-alarm condition.

For the simplified model:

$$A=S(D+M),\qquad L=S(D+M'),\qquad N=A'.$$

**Task 1:** Construct the truth table for $A$, $L$ and $N$. Express the output functions using Boolean algebra and minterm notation. Identify and apply relevant Boolean axioms and identities to verify the functions.

**Task 2:** Simplify the given Boolean functions using Boolean identities and algebraic simplification. Determine the dual of selected Boolean expressions by interchanging $+$ with $\cdot$ and $0$ with $1$. Explain how simplification can reduce unnecessary logic gates in the security system.

**Task 3:** Represent the selected alarm function using a Karnaugh map (K-map) and obtain its minimum Boolean expression. Compare the original and simplified expressions.

---

# 3. Boolean Identities

## 📖 Explanation

Identities derived from the axioms let us **rewrite and simplify expressions.** (Each can be proved from B1–B5 or checked with a truth table.)

| Law | Form 1 | Form 2 (the dual) |
|-----|--------|-------------------|
| **Idempotent** | $A+A=A$ | $A\cdot A=A$ |
| **Domination** | $A+1=1$ | $A\cdot0=0$ |
| **Absorption** | $A+(A\cdot B)=A$ | $A\cdot(A+B)=A$ |
| **De Morgan's laws** | $(A\cdot B)'=A'+B'$ | $(A+B)'=A'\cdot B'$ |

**In words:** De Morgan — *the complement of an AND is the OR of the complements, and the complement of an OR is the AND of the complements.* (Extends to any number of variables: $(ABC)'=A'+B'+C'$.)

**➕ Added — other identities used constantly**

| Law | Statement |
|-----|-----------|
| Involution (double complement) | $(A')'=A$ |
| Complements of constants | $0'=1,\quad 1'=0$ |
| Combining adjacent terms | $AB+AB'=A$ and its dual $(A+B)(A+B')=A$ |
| Redundant literal | $A+A'B=A+B$ and its dual $A(A'+B)=AB$ |

**Proving an identity — two methods**
1. **Algebraically**, starting from one side and applying axioms/identities step by step (state the law used at each step).
2. **Truth table:** compute both sides for all $2^n$ input rows; the identity holds iff the columns are equal.

## 🧪 Examples

- **De Morgan:** simplify $(A+B)'$. By De Morgan's law, $(A+B)'=A'\cdot B'$.
- **Absorption inside a larger expression:** $R=V'+E+VE$. By absorption $E+VE=E$, so $R=V'+E$. *(This is how identities remove an unnecessary term.)*
- **(➕ Added) Proof of absorption from the axioms:** $A+AB=A\cdot1+A\cdot B=A(1+B)=A\cdot1=A$ (identity, distributive, domination, identity).

## ❓ Questions in the module on this topic

*Questions that ask you to "identify and apply relevant Boolean axioms and identities to verify the functions" (Task 1 of Case Study 1 and of the Smart Home Practice Case Study) are given in full under Topic 2.*

---

# 4. Duality Principle

## 📖 Explanation

**Dual of a statement.** The dual of any statement in a Boolean algebra is the statement obtained by **interchanging the operations $+$ and $\cdot$ and interchanging the elements $0$ and $1$.**

**Rules for taking the dual of an expression:**
- $\cdot\ \leftrightarrow\ +$
- $0\ \leftrightarrow\ 1$
- **variables and their complements stay unchanged.**

**Duality principle.** Every Boolean identity remains valid if we interchange AND with OR and $0$ with $1$. So each identity you prove automatically gives a second one for free (that is why the laws in Topic 3 come in pairs).

> ⚠️ **Two different things:**
> - The **dual of a valid identity** is another valid identity.
> - The **dual of an expression** (e.g. of a circuit's output function) is generally a **different function** — not another way of writing the same condition. Duality is about the *structural symmetry* of Boolean algebra, not about simplifying a particular circuit.

**Practical tip:** keep the original parenthesisation/precedence — $\cdot$ binds tighter than $+$, so write explicit brackets in the dual when needed.

## 🧪 Examples

- **Identity and its dual:** original $A+0=A$; dual $A\cdot1=A$. Both valid.
- **Find the dual of $x(y+0)$ and of $\bar{x}\cdot1+(\bar{y}+z)$.**
  - Dual of $x(y+0)$ is $x+(y\cdot1)$.
  - Dual of $\bar{x}\cdot1+(\bar{y}+z)$ is $(\bar{x}+0)\cdot(\bar{y}\cdot z)$.
- **Dual of a product term:** the dual of $VTE'$ is $V+T+E'$ — a different expression from $VTE'$.

## ❓ Questions in the module on this topic

*Questions on duality — Task 2 of Case Study 1 ("determine the dual of selected Boolean expressions by interchanging $+$ with $\cdot$ and $0$ with $1$") and of the Smart Home Practice Case Study — are given in full under Topic 2.*

---

# 5. Minterms, Maxterms, SOP (DNF) and POS (CNF)

## 📖 Explanation

**Minterm.** A Boolean **product** of the $n$ literals (variables or their complements) in which **each variable appears exactly once.**
- Two variables $a,b$: $ab,\ a'b,\ ab',\ a'b'$ (the complete set, 4 minterms).
- Three variables $a,b,c$: $abc,\ abc',\ ab'c,\ a'bc,\ ab'c',\ a'bc',\ a'b'c,\ a'b'c'$ (8 minterms).
- A minterm equals $1$ for **exactly one** input combination.

**Maxterm.** A Boolean **sum** of the $n$ literals in which each variable appears exactly once.
- Two variables: $a+b,\ a'+b,\ a+b',\ a'+b'$.
- A maxterm equals $0$ for **exactly one** input combination.

**Sum of Products (SOP) = Disjunctive Normal Form (DNF).** A function written as a **sum (OR) of minterms.**

**Product of Sums (POS) = Conjunctive Normal Form (CNF).** A function written as a **product (AND) of maxterms.**

**How to build them from a truth table**
- **SOP:** for every row where $F=1$, write the minterm (variable uncomplemented if its value is $1$, complemented if $0$); OR them.
- **POS:** for every row where $F=0$, write the maxterm (variable uncomplemented if its value is $0$, complemented if $1$); AND them.

**Minterm index notation $\sum m(\dots)$.** With a fixed variable order (e.g. $V,T,E$), read the input row as a binary number; that decimal number is the minterm's index. E.g. $(V,T,E)=(1,1,0)=110_2=6$ ⇒ the minterm $VTE'$ is $m_6$. A function is then written $F=\sum m(\text{list of indices where }F=1)$.

**➕ Added:** SOP/POS are *canonical* (full) forms — not necessarily minimal. They are the starting point for K-map simplification (Topic 7). This is exactly the normal-form idea from Module 1 (DNF/CNF).

## 🧪 Examples

**Example 1 — XOR in SOP.** $F(A,B)=1$ when $(A,B)=(1,0)$ or $(0,1)$.
- Minterms: $(1,0)\to A\cdot B'$; $(0,1)\to A'\cdot B$.
- SOP: $F=A\cdot B'+A'\cdot B$ (the XOR function).

**Example 2 — XOR in POS.** $F(A,B)=0$ when $(A,B)=(0,0)$ or $(1,1)$.
- Maxterms: $(0,0)\to(A+B)$; $(1,1)\to(A'+B')$.
- POS: $F=(A+B)\cdot(A'+B')$ — also the XOR function, in product-of-sums form.

## ❓ Questions in the module on this topic

*Questions asking you to express the output functions "using Boolean algebra and minterm notation" (Task 1 of Case Study 1 and of the Smart Home Practice Case Study) are given in full under Topic 2.*

---

# 6. Algebraic Simplification

## 📖 Explanation

**Goal.** Use Boolean identities to **reduce the number of terms and operations** of an expression — crucial in digital design because each term/operation is a **gate.** Fewer gates ⇒ lower cost, lower power consumption, lower complexity, faster circuits.

**Strategy**
1. **Factor** common literals (distributive law): $AB+AB'=A(B+B')$.
2. **Use complement laws:** $B+B'=1$.
3. **Use identity/domination:** $A\cdot1=A$.
4. Apply **absorption** to remove a term that is contained in another: $A+AB=A$.
5. Apply **De Morgan** to push complements inward.
6. Stop when no term or literal can be removed. State the law used at every step.

**Sign of a good answer:** every step is justified by a named axiom/identity.

## 🧪 Examples

**Example — simplify $F=A\cdot B+A\cdot B'$.**
$$F=A(B+B')=A\cdot1=A.$$
(Distributive law, complement law, identity law.) The simplified function is just $F=A$.

**Example — simplify $F=A+AB$.** By the absorption law, $F=A$.

**Circuit view.** The original circuit for $AB+AB'$ needs two AND gates, one NOT gate and one OR gate; the simplified circuit $F=A$ needs **just a wire.**

**(➕ Added) Example — four terms to one.** $F=VTE'+VTE+VT'E'+VT'E$:
group $=V\big[T(E'+E)+T'(E'+E)\big]=V(T+T')=V$.
*(This pattern — every combination of the remaining variables present — always collapses to the common literal.)*

## ❓ Questions in the module on this topic

*Questions asking you to "simplify the given Boolean functions using Boolean identities and algebraic simplification" and to explain how simplification removes redundant logic (Task 2 of Case Study 1 and of the Smart Home Practice Case Study) are given in full under Topic 2.*

---

# 7. Karnaugh Maps & Circuit Minimisation

## 📖 Explanation

**Why K-maps.** Algebraic simplification needs insight to spot terms to combine. A **Karnaugh map (K-map)** is a **graphical method** for finding terms that can be combined, practical for functions of a small number of variables (2–4).

**Layout.** A K-map has one cell for each minterm. Put a $1$ in a cell if that minterm is present in the SOP expansion (and $0$ or blank otherwise).

**Adjacent cells** = cells whose minterms differ in **exactly one literal.** E.g. $\bar{x}y$ is adjacent to $xy$ and to $\bar{x}\bar{y}$.

**2-variable map**

| $x\backslash y$ | $y=0$ | $y=1$ |
|-----------------|-------|-------|
| $x=0$ | $x'y'$ | $x'y$ |
| $x=1$ | $xy'$ | $xy$ |

**3-variable map.** Row variable $V$, column variables $TE$. **Columns are in Gray-code order $00,\ 01,\ 11,\ 10$** (only one bit changes between neighbouring columns), *not* in binary order.

**Grouping rules**
- Two adjacent $1$s combine and **eliminate one variable**, because $xy+xy'=x(y+y')=x\cdot1=x$.
- **Four** adjacent $1$s combine and **eliminate two variables.**
- If **all** cells are $1$, the function is the constant $1$ (no variables).
- Group sizes are powers of 2 (1, 2, 4, 8, …).
- **Circle the largest possible blocks, and cover all the 1s with the fewest blocks**, using the largest blocks first.
- In each group, keep the variables that **stay constant**; the variable that changes between $0$ and $1$ is **eliminated.**
- The minimal SOP is the OR of the product terms of the groups.

**➕ Added — extra K-map facts**
- The map **wraps around**: the first and last columns (and top/bottom rows) are also adjacent (that is why $00$ and $10$ are neighbours in the Gray order).
- A $1$ may belong to several groups (overlapping is allowed and often needed).
- **XOR cannot be simplified** by a K-map: its two $1$s are diagonal, hence not adjacent.
- For 4 variables the map is $4\times4$ with both rows and columns in Gray order.

**Link to circuit minimisation:** Boolean algebra is the theoretical foundation of digital circuits; simplification reduces the number of logic gates (cost, power, complexity); K-map reasoning is a systematic way to reach a minimal form.

$$\text{Complex Boolean expression}\ \to\ \text{simplification}\ \to\ \text{fewer gates}\ \to\ \text{simpler circuit}.$$

## 🧪 Examples

**Example (➕ Added, fully worked) — simplify $F(A,B,C)=\sum m(1,3,6,7)$.**

| $A\backslash BC$ | 00 | 01 | 11 | 10 |
|------------------|----|----|----|----|
| 0 | 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 |

- Group 1: $m_1,m_3$ (row 0, columns 01 and 11): $A=0$ and $C=1$ constant, $B$ changes ⇒ $A'C$.
- Group 2: $m_6,m_7$ (row 1, columns 10 and 11): $A=1$, $B=1$ constant, $C$ changes ⇒ $AB$.
- ($m_3,m_7$ would give $BC$, but both are already covered — it is redundant.)

$$F=A'C+AB.$$

Original: 4 three-variable minterms. Simplified: two 2-variable products.

## ❓ Questions in the module on this topic

**Q-7.1 (K-map example in the notes; the K-map figures are missing from your file).** Find the K-maps for (a) $xy+\bar{x}y$, (b) $x\bar{y}+\bar{x}y$, and (c) $x\bar{y}+\bar{x}y+\bar{x}\bar{y}$. Also simplify the sum-of-products expansions.

**Q-7.2 (Case Study 1, Task 3).** Represent a selected Boolean function of the traffic-light controller (inputs $V,T,E$) using a Karnaugh map and obtain its minimum Boolean expression. Compare the original and simplified expressions. *(Statement of the case study in Topic 2.)*

**Q-7.3 (Smart Home Practice Case Study, Task 3).** Represent the selected alarm function ($A=S(D+M)$, inputs $D,M,S$) using a Karnaugh map and obtain its minimum Boolean expression. Compare the original and simplified expressions. *(Statement in Topic 2.)*

---

# 8. Binary Operations

## 📖 Explanation

**Binary operation.** A rule that **combines two elements of a set to produce another element of the same set.** Formally, for a set $S$, a binary operation $*$ is a function

$$*:\ S\times S\to S .$$

The key requirement is **closure**: for all $a,b\in S$, $a*b\in S$ (the result never leaves the set).

**Properties an operation may have** (these are the building blocks of every structure that follows):

| Property | Meaning |
|----------|---------|
| **Closure** | $a*b\in S$ for all $a,b\in S$ |
| **Associativity** | $(a*b)*c=a*(b*c)$ |
| **Identity** | there is $e\in S$ with $e*a=a*e=a$ for all $a$ |
| **Inverse** | for each $a$ there is $a^{-1}$ with $a*a^{-1}=a^{-1}*a=e$ |
| **Commutativity** | $a*b=b*a$ |

**The ladder of structures** (each adds one requirement to the previous one):

$$\text{set with } * \xrightarrow{\ +\text{ associative}\ } \text{semigroup} \xrightarrow{\ +\text{ identity}\ } \text{monoid} \xrightarrow{\ +\text{ inverses}\ } \text{group} \xrightarrow{\ +\text{ commutative}\ } \text{abelian group}.$$

## 🧪 Examples

- Addition on $\mathbb{Z}$ is a binary operation: $a,b\in\mathbb{Z}\Rightarrow a+b\in\mathbb{Z}$.
- **(➕ Added) Not a binary operation:** subtraction on $\mathbb{N}=\{1,2,3,\dots\}$ ($2-5\notin\mathbb{N}$, not closed); division on $\mathbb{Z}$ ($1\div2\notin\mathbb{Z}$).

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 9. Semigroups

## 📖 Explanation

**Semigroup.** A set $S$ with a binary operation $*$ that is **associative**: $(S,*)$ is a semigroup if for all $a,b,c\in S$

$$(a*b)*c=a*(b*c).$$

(Closure is assumed because $*$ is a binary operation on $S$.) There need not be an identity or inverses.

## 🧪 Examples

- $(\mathbb{N},+)$ is a semigroup because addition is associative (here $\mathbb{N}=\{1,2,3,\dots\}$, so there is no identity).
- **(➕ Added)** Non-empty strings under concatenation form a semigroup; $(\mathbb{Z},-)$ is **not** a semigroup since $(5-3)-1=1\ne5-(3-1)=3$.

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 10. Monoids

## 📖 Explanation

**Monoid.** A semigroup **with an identity element.** $(M,*)$ is a monoid if

1. it is a semigroup (closed and associative), and
2. there is an element $e\in M$ such that $e*a=a*e=a$ for all $a\in M$.

Equivalently, a monoid satisfies: **closure, associativity, existence of identity.**

**To prove a structure is a monoid:** verify closure, associativity, and exhibit the identity.

## 🧪 Examples

**Example (from the notes, solved) — positive integers under multiplication.** Let $S=\{1,2,3,\dots\}$ with multiplication.
- *Closure:* the product of two positive integers is a positive integer (e.g. $1\times2=2\in S$).
- *Associativity:* $(a\times b)\times c=a\times(b\times c)$ (e.g. $(1\times2)\times3=1\times(2\times3)=6$).
- *Identity:* $a\times1=a$ for all $a$ (e.g. $2\times1=2$); the identity is $1$.

Hence $(\mathbb{Z}^+,\times)$ is a monoid.

**(➕ Added)** $(\{1,2,3,\dots\},+)$ is a semigroup but **not** a monoid (no identity); $(\{0,1,2,\dots\},+)$ **is** a monoid (identity $0$) but not a group (no inverses).

## ❓ Questions in the module on this topic

*No practice questions on this topic in your notes (the monoid proof above is a solved example).*

---

# 11. Groups (and Abelian Groups)

## 📖 Explanation

**Group.** A group is a **monoid in which every element has an inverse.** Formally $(G,*)$ is a group if

1. **Closure:** $a*b\in G$ for all $a,b\in G$.
2. **Associativity:** $(a*b)*c=a*(b*c)$.
3. **Identity:** there is $e\in G$ with $e*a=a*e=a$.
4. **Inverse:** for each $a\in G$ there is $a^{-1}\in G$ with $a*a^{-1}=a^{-1}*a=e$.

**Abelian (commutative) group.** A group in which, in addition, $a*b=b*a$ for all $a,b$.

**To prove a set is a group:** check the four axioms one by one (and commutativity for abelian).

**➕ Added — basic consequences**
- The identity is **unique** and each element's inverse is **unique.**
- $(a*b)^{-1}=b^{-1}*a^{-1}$ (order reverses).
- **Cancellation:** $a*b=a*c\Rightarrow b=c$.
- The number of elements $\lvert G\rvert$ is the **order** of the group.

> ⚠️ **Correction to your notes.** Your file gives "the set of positive integers (including zero) with addition, $G=\{0,1,2,3,\dots\}$" as an abelian group. **It is not a group:** $3$ has no inverse in the set (there is no non-negative integer $x$ with $3+x=0$). It is only a commutative **monoid.** The correct example is **$(\mathbb{Z},+)$**, which includes the negatives.

## 🧪 Examples

**Example 1 (from the notes) — $(\mathbb{Z},+)$ is a group.**
- Identity: $0$.
- Inverse: for each $a\in\mathbb{Z}$ the inverse is $-a$.
- Closure and associativity hold. (Also commutative ⇒ abelian group.)

**Example 2 (from the notes, solved) — non-singular $N\times N$ matrices under matrix multiplication form a group.**
- *Closure:* the product of two non-singular $N\times N$ matrices is again a non-singular $N\times N$ matrix.
- *Associativity:* matrix multiplication is associative.
- *Identity:* the identity matrix $I$ is non-singular.
- *Inverse:* every non-singular matrix has an inverse, which is also non-singular.

**(➕ Added)** This group is **not abelian** for $N\ge2$ since $AB\ne BA$ in general.

## ❓ Questions in the module on this topic

**Q-11.1 (Hamming (7,4) Case Study, Task 6).** Explain why the set of codewords generated by the generator matrix $G$ forms a group. *(Full case study in Topic 25.)*

---

# 12. Subgroups

## 📖 Explanation

**Subgroup.** A subset of a group that is itself a group under the **same** operation. Formally, if $(G,*)$ is a group, a subset $H\subseteq G$ is a subgroup if

1. $H$ is **non-empty;**
2. $H$ is **closed** under the operation;
3. $H$ **contains the identity** of $G$;
4. **every element of $H$ has its inverse in $H$.**

(Associativity is inherited from $G$.)

**➕ Added — shortcuts**
- **One-step test:** a non-empty subset $H$ is a subgroup iff $a*b^{-1}\in H$ for all $a,b\in H$ (for $(\mathbb{Z},+)$ this reads: $a-b\in H$).
- Every group $G$ has the **trivial subgroups** $\{e\}$ and $G$ itself.
- **Lagrange's theorem (statement only):** in a finite group, the order of any subgroup divides the order of the group.

## 🧪 Examples

**Example (from the notes) — even integers.** In $(\mathbb{Z},+)$ the set $2\mathbb{Z}$ of even integers is a subgroup:
- closed under addition (even + even = even);
- identity $0$ is included;
- the inverse of any even integer is also even.

**(➕ Added)**
- In $(\mathbb{Z}_6,+)$, $H=\{0,2,4\}$ is a subgroup (order 3 divides 6).
- The odd integers are **not** a subgroup of $(\mathbb{Z},+)$ (not closed: odd + odd = even; no identity $0$).

## ❓ Questions in the module on this topic

*No practice questions on this topic in your notes.*

---

# 13. Cyclic Groups

## 📖 Explanation

**Cyclic group.** A group generated by a **single element.** A group $G$ is cyclic if there exists $g\in G$ (a **generator**) such that every element of $G$ can be written as

$$g^n\ \text{(multiplicative notation)}\qquad\text{or}\qquad n\cdot g\ \text{(additive notation)}.$$

We write $G=\langle g\rangle$.

**➕ Added — useful facts**
- Every cyclic group is **abelian.**
- The **order** of an element $g$ is the smallest $k\ge1$ with $g^k=e$ (additively $k\cdot g=0$). $G=\langle g\rangle$ is finite of order $n$ iff $g$ has order $n$.
- A cyclic group of order $n$ has exactly $\phi(n)$ generators (Euler's totient from Module 4).
- Every subgroup of a cyclic group is cyclic.

## 🧪 Examples

**Example (from the notes) — $(\mathbb{Z}_6,+)$ is cyclic.**
- Generator: $1$.
- Elements: $0,1,2,3,4,5$.
- Each element is obtained by repeatedly adding $1$: $1,2,3,4,5,0$.

**(➕ Added)**
- Other generators of $\mathbb{Z}_6$: only $5$ (that is $\phi(6)=2$ generators: $1$ and $5$). $2$ is **not** a generator: $\langle2\rangle=\{0,2,4\}$.
- $(\mathbb{Z}_7^*,\times)$ is cyclic with generator $3$ (Topic 15).

## ❓ Questions in the module on this topic

*No practice questions on this topic in your notes. The cyclic groups $(\mathbb{Z}_n,+)$ and $(\mathbb{Z}_p^*,\times)$ are used in Topics 14–15.*

---

# 14. The Additive Group of Integers Modulo n

*(the group $(\mathbb{Z}_n,+)$)*

## 📖 Explanation

**Modular arithmetic (recap from Module 4).** Numbers "wrap around" after reaching $n$. For integers $a,b$:

$$a\equiv b\pmod n\iff n\mid(a-b).$$

**The group $(\mathbb{Z}_n,+)$.**

| Ingredient | Description |
|------------|-------------|
| **Set** | $\mathbb{Z}_n=\{0,1,2,\dots,n-1\}$ |
| **Operation** | addition modulo $n$ |
| **Identity** | $0$ |
| **Inverse** | for each $a$, the inverse is $n-a$ (the inverse of $0$ is $0$) |
| **Properties** | **always forms a cyclic group** (generated by $1$) |

**➕ Added:** the generators of $(\mathbb{Z}_n,+)$ are exactly the $k$ with $\gcd(k,n)=1$ (Module 4: coprime ⇒ invertible).

**Link to number theory:** $(\mathbb{Z}_n,+)$ connects directly to **divisibility and modular arithmetic** — congruences are the equality in this group.

## 🧪 Examples

**Example — $(\mathbb{Z}_5,+)$,** $\mathbb{Z}_5=\{0,1,2,3,4\}$.
- Generator $1$; the multiples are $1,2,3,4,0$ — every element is produced by repeated addition of $1$.
- So $(\mathbb{Z}_5,+)$ is cyclic of order $5$.

**(➕ Added)** In $\mathbb{Z}_{6}$: inverse of $2$ is $4$ since $2+4=6\equiv0$; inverse of $5$ is $1$.

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 15. The Multiplicative Group Modulo a Prime and Group-Based Encryption

*(the group $(\mathbb{Z}_p^*,\times)$)*

## 📖 Explanation

**The group $(\mathbb{Z}_p^*,\times)$.** The set of **non-zero** integers modulo a **prime** $p$ under multiplication modulo $p$.

| Ingredient | Description |
|------------|-------------|
| **Set** | $\mathbb{Z}_p^*=\{1,2,\dots,p-1\}$ |
| **Operation** | multiplication modulo $p$ |
| **Identity** | $1$ |
| **Inverse** | for each $a$ there is $a^{-1}$ with $a\cdot a^{-1}\equiv1\pmod p$ (it exists because $\gcd(a,p)=1$; find it with the extended Euclidean algorithm — Module 4) |
| **Properties** | **always a cyclic group of order $p-1$** |

A generator of $\mathbb{Z}_p^*$ is called a **primitive root** modulo $p$.

**➕ Added**
- Closure uses that $p$ is prime: if $p\nmid a$ and $p\nmid b$ then $p\nmid ab$, so the product stays in the set.
- For a **composite** $n$ the multiplicative group is $\mathbb{Z}_n^*=\{a:\gcd(a,n)=1\}$ (only the units) and has $\phi(n)$ elements.
- Not every element is a generator: in $\mathbb{Z}_7^*$ the element $2$ has order $3$ ($2,4,1$).

**Link to number theory.** $(\mathbb{Z}_p^*,\times)$ is central to **Fermat's Little Theorem:** $a^{p-1}\equiv1\pmod p$ for $a\in\mathbb{Z}_p^*$ (the order of every element divides $p-1$).

**Where it is used:**
- **Cryptography (RSA, Diffie–Hellman):** security rests on properties of $(\mathbb{Z}_p^*,\times)$; in Diffie–Hellman a primitive root is chosen to generate the keys.
- **Computer hashing:** multiplicative groups modulo primes are used in designing hash functions for data storage and retrieval.
- **Error detection in networks:** multiplicative inverses in $(\mathbb{Z}_p^*,\times)$ are used in polynomial division for cyclic redundancy checks (CRC).

### Group-based message encryption (the scheme behind Case Study 2)

Work in the cyclic group $(\mathbb{Z}_p^*,\times_p)$ with an agreed generator $g$.
1. **Private keys:** $a$ (user A), $b$ (user B).
2. **Public keys:** $A=g^a\bmod p,\quad B=g^b\bmod p$.
3. **Shared secret key:** A computes $K=B^a\bmod p$; B computes $K=A^b\bmod p$. Both equal $g^{ab}\bmod p$.
4. **Encrypt** message $M$: $C=(M\times K)\bmod p$.
5. **Decrypt:** $M=(C\times K^{-1})\bmod p$, where $K^{-1}$ is the multiplicative inverse of $K$ modulo $p$.

*(Decryption works because $C\cdot K^{-1}=M\cdot K\cdot K^{-1}=M$ — it uses exactly the inverse axiom of the group.)* ➕ This is Diffie–Hellman (Module 4) followed by a "multiplicative mask"; its security comes from the discrete-logarithm problem, so the toy primes used in exercises are insecure.

## 🧪 Examples

**Example (from the notes) — $(\mathbb{Z}_7^*,\times)$,** elements $\{1,2,3,4,5,6\}$. Check generator $3$:

| Power | $3^1$ | $3^2$ | $3^3$ | $3^4$ | $3^5$ | $3^6$ |
|-------|-------|-------|-------|-------|-------|-------|
| mod 7 | 3 | 2 | 6 | 4 | 5 | 1 |

All six elements are produced ⇒ $3$ is a **primitive root** (generator).

## ❓ Questions in the module on this topic

### Case Study 2 — Secure Message Encryption Using Group Theory

A cybersecurity company wants to design a simple cryptographic system for securely transmitting short messages. The system uses the cyclic group $(\mathbb{Z}_{11}^*,\times_{11})$, where multiplication is performed modulo 11. Suppose Student A wants to securely send the message represented by $M=7$ to Student B. Student A chooses the private key $a=3$, and Student B chooses the private key $b=4$. Both students agree to use the generator $g=2$.

**Tasks:**
1. Using the generator $g=2$, compute the public keys of both students. Also compute the common secret key shared by both students and verify that both students obtain the same value.
2. Encrypt the message $M=7$ using the shared secret key and the formula $C=(M\times K)\pmod{11}$, where $K$ is the shared secret key.
3. Decrypt the encrypted message using the formula $M=(C\times K^{-1})\pmod{11}$, where $K^{-1}$ is the multiplicative inverse of $K$ modulo 11. Verify that the decrypted message is the same as the original message.

### Practice Case Study — Secure Communication Using Group Theory

A banking technology company wants to develop a simple cryptographic system to protect confidential information transmitted between two branches. The system uses the multiplicative group $G=\{1,2,3,\dots,16\}$ modulo 17. Suppose User A wants to securely send a message represented by $M=6$ to User B. User A chooses the private key $a=5$, and User B chooses the private key $b=3$. Both users agree to use the generator $g=3$.

**Tasks:**
1. Using the generator $g=3$, compute the public keys of both users. Also compute the common secret key shared by both users and verify that both users obtain the same value.
2. Encrypt the message $M=6$ using the shared secret key and the formula $C=(M\times K)\bmod17$, where $K$ is the shared secret key.
3. Decrypt the encrypted message using the formula $M=(C\times K^{-1})\pmod{17}$, where $K^{-1}$ is the multiplicative inverse of $K$ modulo 17. Verify that the decrypted message is the same as the original message.

---

# 16. Rings

## 📖 Explanation

**Ring.** A non-empty set $R$ with **two operations**, addition ($+$) and multiplication ($\cdot$), such that

1. $(R,+)$ is an **abelian group;**
2. multiplication is **associative:** $(ab)c=a(bc)$;
3. multiplication **distributes over addition:** $a(b+c)=ab+ac$ and $(a+b)c=ac+bc$.

(So a ring has "addition with inverses" and "multiplication that need not have inverses.")

**➕ Added — terminology**
- **Commutative ring:** $ab=ba$ for all $a,b$.
- **Ring with identity:** there is an element $1$ with $1\cdot a=a\cdot1=a$.
- **Zero divisors:** non-zero $a,b$ with $ab=0$ can exist in a ring (e.g. in $\mathbb{Z}_6$: $2\cdot3=0$). This is exactly what stops some rings from being fields.

**Ring of integers modulo $n$, $\mathbb{Z}_n=\{0,1,\dots,n-1\}$** with all arithmetic performed modulo $n$.

**Why rings matter in computing (from the notes)**
- Modular arithmetic **prevents numbers from growing indefinitely.**
- Computer systems perform calculations efficiently using modular operations.
- Many cryptographic algorithms are built upon modular arithmetic derived from rings.
- Rings provide the foundation for secure mathematical computations.

## 🧪 Examples

**Examples of rings (from the notes):**
1. The integers $\mathbb{Z}$ under ordinary addition and multiplication.
2. Matrices of a fixed size under matrix addition and multiplication.
3. The integers modulo $n$, $\mathbb{Z}_n$.

**Example — arithmetic in $\mathbb{Z}_{10}$:**
- $7+8=15\equiv5\pmod{10}$
- $7\times8=56\equiv6\pmod{10}$

**(➕ Added)** $\mathbb{Z}_{10}$ is a ring but **not a field:** $2\cdot5=10\equiv0$ (zero divisors), and $2$ has no multiplicative inverse.

## ❓ Questions in the module on this topic

*No standalone questions on this topic. The polynomial ring $\mathbb{Z}_2[x]$ is used in the CRC case study (Topic 21).*

---

# 17. Fields

## 📖 Explanation

**Field.** A ring in which

- multiplication is **commutative;**
- there is a **multiplicative identity $1\ne0$;**
- **every non-zero element has a multiplicative inverse.**

In a field you can add, subtract, multiply **and divide** (by non-zero elements) — this is what makes encryption/decryption and error-correcting arithmetic possible.

**Examples of fields:** rational numbers $\mathbb{Q}$, real numbers $\mathbb{R}$, complex numbers $\mathbb{C}$, and **finite fields $GF(q)$.**

> **Not fields:** $\mathbb{Z}$ (only $\pm1$ have inverses) and $\mathbb{Z}_n$ for composite $n$.

**➕ Added — when is $\mathbb{Z}_n$ a field?** Exactly when **$n$ is prime.** If $n=p$ is prime, every non-zero residue is coprime to $p$ and so has an inverse (Module 4); if $n$ is composite there are zero divisors.

**Ladder (continues Topic 8):** ring → commutative ring with identity → **field** (all non-zero elements invertible). Equivalently a field is a commutative ring $F$ with $1\ne0$ such that $(F\setminus\{0\},\cdot)$ is an abelian group.

## 🧪 Examples

**Example — the finite field $GF(7)=\{0,1,2,3,4,5,6\}$.**
- $3\times5=15\equiv1\pmod 7$, hence $3^{-1}=5$.
- Since every non-zero element has an inverse, $GF(7)$ is a field.
- The existence of inverses makes encryption and decryption possible.

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 18. Finite Fields GF(p) and GF(2)

## 📖 Explanation

**Finite field (Galois field) $GF(q)$.** A field with a **finite number of elements.**
- The number of elements $q$ must be a **power of a prime:** $q=p^n$.
- Arithmetic is performed **modulo $p$** (for $n=1$; for $n>1$ see Topic 19).
- Finite fields are fundamental in **coding theory, cryptography and error detection.**

**Prime fields.** If $p$ is prime, $GF(p)=\{0,1,2,\dots,p-1\}$ with arithmetic modulo $p$ (this is $\mathbb{Z}_p$).

**The special field $GF(2)=\{0,1\}$** — the simplest finite field.
- Addition mod 2 is **XOR:** $0+0=0,\ 0+1=1,\ 1+0=1,\ 1+1=0.$
- Multiplication mod 2 is **AND.**
- In $GF(2)$, $1+1=0$, so every element is its own additive inverse ($-a=a$): subtraction equals addition.

## 🧪 Examples

**Example — $GF(5)=\{0,1,2,3,4\}$.**
- Addition mod 5: $3+4=7\equiv2$.
- Multiplication mod 5: $3\times4=12\equiv2$.
- Multiplicative inverses: $1^{-1}=1$; $2^{-1}=3$ because $2\times3=6\equiv1$.
- Every non-zero element has an inverse ⇒ $GF(5)$ is a field.

**(➕ Added) $GF(2)$ tables**

| $+$ | 0 | 1 |   | $\cdot$ | 0 | 1 |
|-----|---|---|---|---------|---|---|
| **0** | 0 | 1 | | **0** | 0 | 0 |
| **1** | 1 | 0 | | **1** | 0 | 1 |

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 19. The Field GF(2^n)

## 📖 Explanation

**Construction**
- **Base field:** $GF(2)=\{0,1\}$ with addition and multiplication mod 2.
- **Extension field $GF(2^n)$** contains $2^n$ elements.
- **Elements are polynomials of degree less than $n$** with coefficients in $\{0,1\}$:
  $$a_{n-1}x^{n-1}+\dots+a_1x+a_0,\qquad a_i\in\{0,1\}.$$
- **Addition:** add polynomials coefficient-wise mod 2 (i.e. XOR the bit strings).
- **Multiplication:** multiply the polynomials, then **reduce modulo an irreducible polynomial of degree $n$** (a polynomial that cannot be factored over $GF(2)$ into smaller-degree polynomials). Because the modulus is irreducible, every non-zero element has an inverse — so it really is a field.

> ⚠️ $GF(2^n)$ is **not** the same as $\mathbb{Z}_{2^n}$ (integers mod $2^n$). $\mathbb{Z}_{2^n}$ has zero divisors and is not a field; $GF(2^n)$ is built from *polynomials*.

**Applications of $GF(2^n)$**
- **Error-correcting codes** (Reed–Solomon, BCH codes).
- **Cryptography:** AES uses $GF(2^8)$.
- **Digital communications:** finite-field arithmetic ensures reliable transmission.

## 🧪 Examples

**Example — $GF(2^3)$.** Elements $a_2x^2+a_1x+a_0$ with each coefficient $0$ or $1$. The 8 elements are

$$0,\quad 1,\quad x,\quad x+1,\quad x^2,\quad x^2+1,\quad x^2+x,\quad x^2+x+1,$$

exactly $2^3=8$.

**(➕ Added) arithmetic in $GF(2^3)$ with the irreducible polynomial $x^3+x+1$.** In this field $x^3=x+1$ (since $x^3+x+1=0$ and $-1=1$).
- Addition: $(x+1)+(x^2+1)=x^2+x$ (the constants cancel: $1+1=0$).
- Multiplication: $x\cdot x^2=x^3=x+1$.

(AES uses $GF(2^8)$ with the irreducible polynomial $x^8+x^4+x^3+x+1$.)

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 20. Parity and its Link to GF(2)

## 📖 Explanation

**Parity** refers to whether the **number of 1s in a binary string is even or odd.**
- **Even parity:** the total number of 1s is even.
- **Odd parity:** the total number of 1s is odd.
- Used in **error detection** (the simple parity check).

**A parity bit** is an extra bit appended so that the whole string has the required parity.
**➕ Added:** the even-parity bit of a string equals the **XOR (sum mod 2) of its bits.**

**Link between $GF(2)$ (and $GF(2^n)$) and parity**
- Parity checks are essentially **computations in $GF(2)$.**
- The **XOR operation corresponds to addition in $GF(2)$.**
- More advanced error detection/correction (like **Hamming codes**) extend parity concepts, and use $GF(2^n)$ in their more general forms.

## 🧪 Examples

**Example — string 101101.** The number of 1s is $4$ ⇒ **even parity.** If **odd** parity is required, append a parity bit $1$, giving $1011011$ (now five 1s).

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 21. Polynomials over Z2 and CRC

## 📖 Explanation

**The ring $\mathbb{Z}_2[x]$.** Polynomials whose **coefficients are taken modulo 2.** In this ring $1+1=0$, so **polynomial addition (and subtraction) is the XOR** operation used in digital systems. Rules: $0+0=0,\ 0+1=1,\ 1+0=1,\ 1+1=0.$

**Bit strings ↔ polynomials.** Each bit is the coefficient of a power of $x$, **starting from the highest power on the left.** E.g. $1011\leftrightarrow x^3+x+1$.

**Cyclic Redundancy Check (CRC)** — error detection modelled by polynomial arithmetic over $\mathbb{Z}_2[x]$.

*Setting:* message $M$, **generator polynomial** $G(x)$ of degree $r$.

1. Write the message as a polynomial $M(x)$.
2. **Multiply by $x^r$** (this appends $r$ zeros to the message bits).
3. **Divide** $M(x)x^r$ by $G(x)$ in $\mathbb{Z}_2[x]$ (each step: divide the leading terms, multiply $G$ by the quotient term, XOR). The remainder $R(x)$ has degree $<r$ (written with $r$ bits).
4. **Transmit** $C(x)=M(x)x^r+R(x)$ (the message followed by the $r$ remainder bits).
5. **Receiver:** divide the received polynomial $T(x)$ by $G(x)$.
   - Remainder $=0$ ⇒ the word **passes the CRC check** (accept).
   - Remainder $\ne0$ ⇒ the word **fails** (reject; request retransmission if the protocol allows).

**Why it works (➕ Added):** $C(x)=M(x)x^r+R(x)$ leaves remainder $R+R=0$ when divided by $G$, so every valid codeword is a multiple of $G(x)$. If noise adds an error polynomial $E(x)$, the receiver gets $T=C+E$ with remainder equal to $E\bmod G$, which is non-zero unless $G$ divides $E$. Good generators detect all single-bit errors, all burst errors shorter than $r+1$ bits, etc.

**Link:** CRC uses multiplicative inverses/polynomial division in $GF(2)$ — see the applications list in Topic 15.

## 🧪 Examples

**(➕ Added, fully worked) — $M=1001$, $G(x)=x^3+x+1\ (1011)$.**
1. $M(x)=x^3+1$.
2. $M(x)x^3=x^6+x^3$ (binary $1001000$).
3. Divide by $x^3+x+1$:
   - $x^6\div x^3=x^3$; $x^3G=x^6+x^4+x^3$; XOR: $(x^6+x^3)+(x^6+x^4+x^3)=x^4$.
   - $x^4\div x^3=x$; $xG=x^4+x^2+x$; XOR: $x^4+(x^4+x^2+x)=x^2+x$.
   - Degree $2<3$, stop: $R(x)=x^2+x$ (binary $110$).
4. $C(x)=x^6+x^3+x^2+x$ ⇒ codeword $1001110$.
5. Check: $1001110$ divided by $1011$ leaves remainder $0$ ✓.

## ❓ Questions in the module on this topic

### Case Study 3 — Error Detection in Digital Communication Using Rings

A digital communication system transmits data using cyclic redundancy check (CRC) techniques. CRCs can be modeled using polynomial arithmetic over the ring $R=\mathbb{Z}_2[x]$, where coefficients are taken modulo 2. In this ring, $1+1=0$, so polynomial addition is equivalent to the XOR operation used in digital systems. A communication device wants to transmit the binary data $M=1101$. The system uses the generator polynomial $G(x)=x^3+x+1$. The binary representation of $G(x)$ is $G(x)=1011$. The CRC method appends three zeros to the data because the degree of $G(x)$ is 3.

**Tasks:**
1. Express the binary message $M=1101$ as a polynomial $M(x)$ over $\mathbb{Z}_2[x]$.
2. Multiply $M(x)$ by $x^3$, and divide $M(x)x^3$ by the generator polynomial $G(x)=x^3+x+1$.
3. Determine the remainder $R(x)$. Then construct the transmitted polynomial $C(x)=M(x)x^3+R(x)$. Give the corresponding binary codeword.
4. Suppose the transmitted binary codeword experiences a single-bit error during transmission. Assume that the received word is $1101010$. Determine the corresponding received polynomial $T(x)$.
5. Divide the received polynomial $T(x)$ by $G(x)=x^3+x+1$. Determine the remainder. Explain whether the receiver should accept or reject the received data.

> ⚠️ **Check this with your instructor/slides:** the solution in your notes observes that the given received word $1101010$ differs from the correctly computed transmitted codeword in **two** bit positions, not one — so the "single-bit error" wording does not match the numbers. The method for tasks 4–5 is unaffected (compute $T(x)$, divide by $G(x)$, look at the remainder).

---

# 22. Hamming Distance

## 📖 Explanation

**Hamming distance.** The Hamming distance $d(x,y)$ between two binary strings of **equal length** is the **number of positions at which the corresponding bits differ.**

- It measures **how many bit flips** are needed to change one string into the other.
- In coding theory it determines the **error-detecting and error-correcting capability** of a code.

**Minimum distance $d$ of a code.** The smallest Hamming distance between any two **distinct codewords.**

**Error-handling capability (from your notes and the Hamming bound):**
- A code with minimum distance $d$ can **detect up to $d-1$ errors.**
- It can **correct up to $t=\left\lfloor\dfrac{d-1}{2}\right\rfloor$ errors** (spheres of radius $t$ around codewords do not overlap — see Topic 23).

**➕ Added — properties**
- $d(x,y)=\text{(number of 1s in }x\oplus y)$ — the **weight** of the XOR.
- It is a distance (metric): $d(x,y)=0\iff x=y$; $d(x,y)=d(y,x)$; $d(x,z)\le d(x,y)+d(y,z)$.
- **Nearest-codeword decoding:** correct a received word to the closest codeword (smallest Hamming distance).

**Where it is used:** DNA sequencing (measuring mutations between genetic codes), data transmission such as Wi-Fi and Bluetooth (detecting corrupted packets), spell checkers (mistyping "cat" as "car" has distance 1).

## 🧪 Examples

**Example — $101101$ and $100001$.** Compare position by position: the strings differ in exactly **two positions** (the 3rd and 4th from the left), so $d=2$.
*(Your notes mention "positions 2 and 4"; counting from the left the differing positions are 3 and 4 — the distance, $2$, is the same.)*

**Example — "cat" vs "car":** they differ in one letter ⇒ distance $1$.

**(➕ Added) detection/correction:** if the minimum distance is $d=3$ then $t=\lfloor(3-1)/2\rfloor=1$: it corrects any 1-bit error (or detects up to 2 errors).

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes.*

---

# 23. Hamming Bound (Sphere-Packing Bound)

## 📖 Explanation

**Purpose.** The Hamming bound gives a **limit on the maximum number of codewords** $M$ in a block code of length $n$, alphabet size $q$ and minimum distance $d$. It ensures that **spheres of radius $t$** (where $t$ is the number of correctable errors) around the codewords **do not overlap.**

**Formula**

$$M\cdot\sum_{i=0}^{t}\binom{n}{i}(q-1)^i\ \le\ q^n,\qquad t=\left\lfloor\frac{d-1}{2}\right\rfloor .$$

Meaning of the symbols:
- $M$ = number of codewords,
- $n$ = length of a codeword,
- $q$ = alphabet size (**$q=2$ for binary codes**),
- $t$ = maximum number of correctable errors,
- $\binom{n}{i}(q-1)^i$ = number of words at distance exactly $i$ from a given word; the sum is the **size of one sphere** of radius $t$.

**Why it is true:** the $M$ spheres are disjoint and all lie inside the $q^n$ possible words, so $M\times(\text{sphere size})\le q^n$.

**Binary case** ($q=2$): $M\cdot\sum_{i=0}^{t}\binom{n}{i}\le2^n$.

**➕ Added**
- A code that **meets the bound with equality** is called a **perfect code** (the spheres fill the whole space).
- The bound is a **necessary limit**: a code that violates it cannot exist, but a code satisfying it is not guaranteed to exist.

**Real-world use:** satellite communication (designing codes that maximise efficiency with reliable transmission); QR-code error-correction levels (L, M, Q, H) balance storage capacity and error resilience.

## 🧪 Examples

**Example (from the notes) — binary code, $n=7$, $d=3$.**
- $t=\lfloor(3-1)/2\rfloor=1$.
- Bound: $M\left[\binom70\cdot1^0+\binom71\cdot1^1\right]\le2^7$, i.e. $M(1+7)\le128$, so $M\le16$.
- At most **16 codewords** can exist in such a code.

**(➕ Added)** The Hamming $(7,4)$ code has exactly $2^4=16$ codewords — it **meets the bound**, so it is a perfect code.

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes (the bound is given as a solved example).*

---

# 24. Error-Detecting Codes

## 📖 Explanation

**Error-detecting codes** identify **that** an error occurred during transmission (they do not necessarily say where).

| Method | Idea |
|--------|------|
| **Parity check** | add one bit so the total number of 1s is even (or odd) |
| **Checksum** | append a sum of the data values |
| **CRC (cyclic redundancy check)** | polynomial division in $GF(2)$ (Topic 21) |

**➕ Added — what a single parity bit can and cannot do:** it detects **any odd number** of bit flips (1, 3, 5, …) but misses an even number of flips (2, 4, …). A single-parity-bit code has minimum distance $2$, so it detects $d-1=1$ error and corrects none.

**Where used:** banking transactions (parity checks so account numbers are not mistyped), airline ticket barcodes (CRC ensures scanned codes are valid and not corrupted).

## 🧪 Examples

**Example — even parity.** Message $1011$ has three 1s; add the even-parity bit $1$ → $10111$ (four 1s). If one bit flips during transmission, the received word has an odd number of 1s, so the parity check **detects** the error.

## ❓ Questions in the module on this topic

*No standalone questions on this topic in your notes; the CRC case study is in Topic 21.*

---

# 25. Error-Correcting Codes & Linear Codes (Hamming (7,4))

## 📖 Explanation

**Error-correcting codes** not only **detect** errors but also **correct** them.

| Code | What it does | Used in |
|------|--------------|---------|
| **Hamming codes** | correct single-bit errors | mobile phones (GSM) |
| **Reed–Solomon codes** | correct multiple symbol errors | CDs/DVDs (scratches, dust), deep-space data |
| **Convolutional codes** | stream-oriented correction | wireless communication |

(NASA uses error-correcting codes to ensure data integrity in deep-space communication.)

**Hamming $(7,4)$ code.** Encodes **4 data bits into 7 bits** using **3 parity bits.**
- Minimum distance $d=3$ ⇒ corrects **1-bit errors.**
- Your notes also say it "detects 2-bit errors". With $d=3$ the code can **either** correct 1 error **or** detect up to 2 errors, not both at once (the extended $(8,4)$ code with $d=4$ does both).

### Linear-code reasoning (structural)

All operations are over the binary field $\mathbb{F}_2=\{0,1\}$ ($=GF(2)$), where $1+1=0$.

- **Generator matrix $G$** ($k\times n$): codeword $c=mG\pmod2$ for a message row-vector $m$.
- **Parity-check matrix $H$** (with $GH^T=0$): a word $c$ is a codeword iff $Hc^T=0$.
- **Syndrome** of a received word $r$: $s=Hr^T\pmod2$.
  - $s=0$ ⇒ $r$ is a codeword (no detectable error).
  - $s\ne0$ ⇒ error detected; if $s$ **equals column $j$ of $H$**, a single-bit error occurred in **position $j$** — flip that bit.
- **Systematic form:** $G=[I_k\mid P]$ and $H=[P^T\mid I_{n-k}]$. The first $k$ bits of the codeword are the message, so after correction the message is read off directly.
- **Requirement for single-error correction:** the $n$ columns of $H$ must be **distinct and non-zero** (so every position has its own syndrome). For $(7,4)$ the seven columns are the seven non-zero 3-bit vectors.

**The set of codewords forms a group (Task 6 of the case study).** Let $C=\{mG: m\in\mathbb{F}_2^4\}$ — there are $2^4=16$ codewords. Under bitwise XOR:
1. **Closure:** $c_1+c_2=m_1G+m_2G=(m_1+m_2)G\in C$.
2. **Associativity:** XOR is associative.
3. **Identity:** the zero message gives the zero codeword $0000000$.
4. **Inverse:** every codeword is its own inverse ($c+c=0$).
5. **Commutativity:** XOR is commutative ⇒ **abelian group.**

(This is why these codes are called **linear**: the sum of two codewords is a codeword. ➕ Consequently the minimum distance of a linear code equals the smallest weight of a non-zero codeword.)

> ⚠️ **About the matrices in your notes.** The generator matrix $G$ and parity-check matrix $H$ printed in your Hamming case study are **inconsistent** for single-error correction: the printed $H$ has two identical columns (columns 3 and 5), so it cannot tell those two positions apart. Your notes' own solution points this out and then switches to a different "examination version" whose rows are garbled in the file. **Check the exact matrices with your slides/instructor.** The ➕ clean standard version below shows how the method works when the matrices are consistent.

### ➕ Added: a clean standard Hamming (7,4) code

$$G=\begin{pmatrix}1&0&0&0&1&1&0\\0&1&0&0&1&0&1\\0&0&1&0&0&1&1\\0&0&0&1&1&1&1\end{pmatrix},\qquad H=\begin{pmatrix}1&1&0&1&1&0&0\\1&0&1&1&0&1&0\\0&1&1&1&0&0&1\end{pmatrix}.$$

The columns of $H$ are $110,\ 101,\ 011,\ 111,\ 100,\ 010,\ 001$ — all distinct and non-zero — and $GH^T=0$.

## 🧪 Examples

**(➕ Added, fully worked) — message $m=1011$ with the clean code above.**

1. **Encode:** $c=mG$ = row 1 + row 3 + row 4 = $1000110+0010011+0001111=1011010$. (Message $1011$, parity bits $010$.)
2. **Channel error in position 6:** received $r=1011000$.
3. **Syndrome:** $s=Hr^T\pmod2$ with $r=1011000$. Row 1 of $H$ is $1101100$: $s_1=1+0+0+1+0+0+0=2\equiv0$. Row 2 is $1011010$: $s_2=1+0+1+1+0+0+0=3\equiv1$. Row 3 is $0111001$: $s_3=0+0+1+1+0+0+0=2\equiv0$. Hence $s=(0,1,0)^T$.
4. **Locate:** $010$ is column 6 of $H$ ⇒ the error is in position 6.
5. **Correct:** flip bit 6 → $1011010$.
6. **Recover message:** first four bits $=1011$ ✓.

## ❓ Questions in the module on this topic

### Case Study — Error Detection and Correction Using a (7,4) Hamming Code

A digital communication system uses a binary $(7,4)$ Hamming code to transmit 4-bit messages reliably. The system uses the following generator matrix:

$$G=\begin{pmatrix}1&0&0&0&1&1&0\\0&1&0&0&1&0&1\\0&0&1&0&1&0&0\\0&0&0&1&0&1&1\end{pmatrix}.$$

The corresponding parity-check matrix is

$$H=\begin{pmatrix}1&1&1&0&1&0&0\\1&0&0&1&0&1&0\\0&1&0&1&0&0&1\end{pmatrix}.$$

All operations are performed over the binary field $\mathbb{F}_2=\{0,1\}$, where $1+1=0,\ 1+0=1,\ 0+0=0$. The message to be transmitted is $m=1101$.

*(The notes give the tasks as headings of the solution; they are:)*

**Task 1:** Encode the message $m=1101$. The encoded codeword is given by $c=mG\pmod2$.

**Task 2:** Assume that the 3rd bit is changed during transmission. Determine the received word $r$ and the error vector $e$.

**Task 3:** Calculate the syndrome of the received word, $s=Hr^T\pmod2$.

**Task 4:** Identify and correct the erroneous bit.

**Task 5:** Recover the original 4-bit message.

**Task 6:** Explain why the set of codewords forms a group.

> ⚠️ See the warning in the explanation above: the matrices printed in your notes are internally inconsistent (repeated columns in $H$); confirm the matrices with your instructor before answering Tasks 3–5.

---

# ✅ Master Checklist — every question in your Module 6 file

| # | Question | Topic(s) |
|---|----------|----------|
| 1 | Case Study 1 — Traffic Light Control (Task 1: truth table, minterms, verify with identities; Task 2: simplify, duals, redundancy; Task 3: K-map) | 2, 3, 4, 5, 6, 7 |
| 2 | Practice Case Study — Smart Home Security System (same three tasks) | 2, 3, 4, 5, 6, 7 |
| 3 | K-map example — K-maps and simplification of (a) $xy+\bar{x}y$, (b) $x\bar{y}+\bar{x}y$, (c) $x\bar{y}+\bar{x}y+\bar{x}\bar{y}$ | 7 |
| 4 | Case Study 2 — Secure Message Encryption in $\mathbb{Z}_{11}^*$ (public keys, shared key, encrypt, decrypt) | 15 |
| 5 | Practice Case Study — Secure Communication in the group modulo 17 (same three tasks) | 15 |
| 6 | Case Study 3 — CRC error detection over $\mathbb{Z}_2[x]$ (5 tasks incl. accept/reject) | 21 |
| 7 | (7,4) Hamming Code Case Study — Tasks 1–5 (encode, introduce error, syndrome, correct, recover message) | 25 |
| 8 | (7,4) Hamming Code Case Study — Task 6 (codewords form a group) | 11, 25 |

*Topics 3–6 have no separate questions; their tasks come from the case studies (items 1–2). Topics with no questions at all in your notes: 1, 8, 9, 10, 12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 24.*

---

# 🧠 Quick formula sheet

**Boolean algebra**
- Axioms: identity $a+0=a,\ a\cdot1=a$; complement $a+a'=1,\ a\cdot a'=0$; distributive both ways ($a+bc=(a+b)(a+c)$).
- Idempotent $A+A=A$; domination $A+1=1$; absorption $A+AB=A$; De Morgan $(AB)'=A'+B',\ (A+B)'=A'B'$.
- Dual: swap $+\leftrightarrow\cdot$ and $0\leftrightarrow1$ (variables unchanged).
- $n$ variables ⇒ $2^n$ rows; $2^{2^n}$ functions. $x\oplus y=xy'+x'y$.
- SOP = sum of minterms ($F=1$ rows); POS = product of maxterms ($F=0$ rows).
- K-map: Gray-code order $00,01,11,10$; pair removes 1 variable, quad removes 2.

**Algebraic structures**
- Semigroup: closed + associative. Monoid: + identity. Group: + inverses. Abelian: + commutative.
- Subgroup: non-empty, closed, identity, inverses (or $ab^{-1}\in H$).
- Cyclic: $G=\langle g\rangle$; cyclic group of order $n$ has $\phi(n)$ generators.
- $(\mathbb{Z}_n,+)$: identity $0$, inverse $n-a$, cyclic. $(\mathbb{Z}_p^*,\times)$: identity $1$, order $p-1$, cyclic.
- Group encryption: $A=g^a,\ B=g^b,\ K=g^{ab},\ C=MK,\ M=CK^{-1}\pmod p$.

**Rings and fields**
- Ring: $(R,+)$ abelian, $\cdot$ associative, distributive. Field: commutative, $1\ne0$, all non-zero invertible.
- $\mathbb{Z}_n$ is a field iff $n$ is prime. $GF(q)$ needs $q=p^n$. $GF(2)$: addition = XOR, multiplication = AND.
- $GF(2^n)$: polynomials of degree $<n$ over $GF(2)$, reduced mod an irreducible polynomial of degree $n$.

**Codes**
- Parity: count of 1s even/odd; XOR = addition in $GF(2)$.
- CRC: $C(x)=M(x)x^r+R(x)$, $R=M x^r\bmod G$; receiver remainder $0$ ⇒ accept.
- Hamming distance $d(x,y)$ = number of differing positions; detect $d-1$, correct $t=\lfloor(d-1)/2\rfloor$.
- Hamming bound: $M\sum_{i=0}^{t}\binom{n}{i}(q-1)^i\le q^n$. Example $n=7,d=3$: $M\le16$.
- Linear code: $c=mG$, $Hc^T=0$, syndrome $s=Hr^T$ = column of $H$ at the error position.