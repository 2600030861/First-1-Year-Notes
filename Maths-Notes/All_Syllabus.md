# Discrete Mathematics — 1st Year Syllabus

---

# Quick Module Summary

| Module       | Main Topics                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Module 1** | Propositions, logic, truth tables, equivalence, inference, predicates, quantifiers, normal forms, proofs, induction                                                              |
| **Module 2** | Sets, set operations, cardinality, relations, equivalence relations, partial orders, functions, closures, pigeonhole principle                                                   |
| **Module 3** | Counting principles, permutations, combinations, stars and bars, binomial theorem, inclusion-exclusion, derangements, recurrence counting, generating functions, Catalan numbers |
| **Module 4** | Divisibility, GCD, Euclidean algorithm, primes, modular arithmetic, CRT, Fermat, Euler, RSA, Diffie-Hellman, discrete logarithms, hash functions                                 |
| **Module 5** | Graphs, representations, connectivity, Euler/Hamiltonian paths, shortest paths, MSTs, planar graphs, colouring, trees, spanning trees, bipartite graphs, matchings               |
| **Module 6** | Boolean algebra, K-maps, recurrence relations, algebraic structures, groups, rings, fields, finite fields, coding theory, pseudo-randomness                                      |

---

## Course Overview

This course develops the mathematical foundations required for **computer science, programming, algorithms, cryptography, networks, digital logic, and theoretical computing**.

The syllabus covers:

* Mathematical logic and proof techniques
* Set theory, relations, and functions
* Combinatorics and counting
* Number theory and cryptographic foundations
* Graph theory and trees
* Boolean algebra, recurrence relations, and algebraic structures

---

# Module 1 — Mathematical Logic & Proof Techniques

## 1. Propositions and Logical Connectives

### Propositions

* Definition of a proposition
* Truth values
* Simple and compound propositions

### Logical Connectives

* Negation (`¬`)
* Conjunction (`∧`)
* Disjunction (`∨`)
* Implication (`→`)
* Biconditional (`↔`)

### Truth Tables

* Constructing truth tables
* Evaluating compound propositions
* Number of rows in a truth table

---

## 2. Tautologies, Contradictions & Contingencies

### Tautology

A proposition that is **true for every possible combination** of truth values.

### Contradiction

A proposition that is **false for every possible combination** of truth values.

### Contingency

A proposition that is **true for some combinations and false for others**.

---

## 3. Logical Equivalence

* Definition of logical equivalence
* Proving equivalence using truth tables
* Proving equivalence using logical laws

### Principal Laws

#### De Morgan's Laws

* `¬(P ∧ Q) ≡ ¬P ∨ ¬Q`
* `¬(P ∨ Q) ≡ ¬P ∧ ¬Q`

#### Distributive Laws

* `P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R)`
* `P ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R)`

#### Other Important Laws

* Identity laws
* Domination laws
* Idempotent laws
* Double-negation law
* Commutative laws
* Associative laws
* Absorption laws
* Negation laws

---

## 4. Conditional and Biconditional Reasoning

### Conditional Statements

* `P → Q`
* Meaning of implication
* Truth conditions

### Related Statements

* Converse
* Inverse
* Contrapositive

### Important Relationship

For a conditional statement:

`P → Q`

* Converse: `Q → P`
* Inverse: `¬P → ¬Q`
* Contrapositive: `¬Q → ¬P`

> A conditional statement and its contrapositive are logically equivalent.

### Necessary and Sufficient Conditions

* Necessary conditions
* Sufficient conditions
* Necessary and sufficient conditions

---

## 5. Rules of Inference

* Valid and invalid arguments
* Premises and conclusions
* Determining validity of arguments

### Important Rules

#### Modus Ponens

`P → Q`
`P`
∴ `Q`

#### Modus Tollens

`P → Q`
`¬Q`
∴ `¬P`

#### Syllogism

* Hypothetical syllogism
* Disjunctive syllogism

#### Resolution

* Resolution rule
* Role in automated reasoning

### Applications

* Logic-based computation
* Automated reasoning
* Validity checking

---

## 6. Predicates and Quantifiers

### Predicates

* Definition of predicates
* Predicate statements
* Variables and domains

### Universal Quantifier

* `∀`
* Meaning and usage

### Existential Quantifier

* `∃`
* Meaning and usage

### Nested Quantifiers

* Multiple quantifiers
* Order of quantifiers
* Interpreting nested statements

### Negation of Quantified Statements

* Negation of universal statements
* Negation of existential statements

Important rules:

`¬(∀x P(x)) ≡ ∃x ¬P(x)`

`¬(∃x P(x)) ≡ ∀x ¬P(x)`

---

## 7. Normal Forms

### Conjunctive Normal Form (CNF)

* Structure of CNF
* Conversion to CNF

### Disjunctive Normal Form (DNF)

* Structure of DNF
* Conversion to DNF

### Applications

* SAT problems
* Digital circuits
* Query logic
* Logic-based computation

---

## 8. Methods of Proof

### Direct Proof

* Starting from known assumptions
* Deriving the required conclusion

### Proof by Contraposition

* Proving `¬Q → ¬P` instead of `P → Q`

### Proof by Contradiction

* Assuming the opposite of the desired conclusion
* Deriving a contradiction

### Proof by Cases

* Dividing a problem into exhaustive cases
* Proving each case separately

### Disproof by Counterexample

* Finding a single counterexample
* Showing that a universal statement is false

---

## 9. Mathematical Induction

### Principle of Mathematical Induction

* Base case
* Inductive hypothesis
* Inductive step
* Conclusion

### Strong Induction

* Strong inductive hypothesis
* Difference between ordinary and strong induction

### Well-Ordering Principle

* Every non-empty set of positive integers has a least element
* Relationship with mathematical induction

---

## 10. Logic and Program/Protocol Correctness

Informal reasoning about correctness using:

* Preconditions
* Postconditions
* Logical assertions
* Invariants
* Reasoning about program states
* Reasoning about protocol correctness

> Focus is on logical reasoning and assertions rather than writing code.

---

## 11. Common Proof Pitfalls

* Assuming what needs to be proved
* Using unsupported claims
* Confusing implication with equivalence
* Incomplete case analysis
* Invalid use of examples
* Incorrect induction steps
* Ignoring edge cases
* Confusing necessary and sufficient conditions

### Standards of a Rigorous Proof

* Clear assumptions
* Logical sequence
* Justified steps
* Correct conclusion
* No unexplained logical gaps

---

# Module 2 — Set Theory, Relations & Functions

## 1. Sets

* Definition of a set
* Elements and membership
* Set notation
* Empty set
* Universal set

### Subsets

* Definition of subset
* Proper subsets
* Set equality

### Power Sets

* Definition of power set
* Number of subsets of a finite set

---

## 2. Set Operations

### Union

`A ∪ B`

### Intersection

`A ∩ B`

### Difference

`A − B`

### Complement

`Aᶜ`

### Venn Diagrams

* Visual representation of sets
* Reasoning using Venn diagrams

---

## 3. Set Identities

* Identity laws
* Domination laws
* Idempotent laws
* Complement laws
* De Morgan's laws
* Distributive laws
* Absorption laws

### Proving Set Identities

* Algebraic proof
* Element-based proof
* Venn diagram reasoning

---

## 4. Cartesian Products

* Ordered pairs
* Cartesian product
* `A × B`
* Properties of Cartesian products
* Applications to relations and functions

---

## 5. Cardinality

* Cardinality of finite sets
* Counting elements
* Cardinality of Cartesian products

### Inclusion-Exclusion Principle

For two sets:

`|A ∪ B| = |A| + |B| − |A ∩ B|`

---

## 6. Countable and Uncountable Sets

### Countable Sets

* Finite sets
* Countably infinite sets

### Uncountable Sets

* Meaning of uncountability
* Examples

### Cantor's Diagonalisation

* Basic diagonal argument
* Showing that certain sets are uncountable
* Conceptual connection to limits of computation

---

# Relations

## 7. Relations

* Definition of a relation
* Relations on sets
* Ordered-pair representation

### Representation

* Matrix representation
* Directed graph (digraph) representation

---

## 8. Properties of Relations

### Reflexive

`aRa` for every `a`

### Symmetric

If `aRb`, then `bRa`

### Antisymmetric

If `aRb` and `bRa`, then `a = b`

### Transitive

If `aRb` and `bRc`, then `aRc`

---

## 9. Equivalence Relations

An equivalence relation is:

* Reflexive
* Symmetric
* Transitive

### Equivalence Classes

* Definition
* Properties
* Partitioning a set

### Applications

* Hashing buckets
* Data partitioning
* Grouping equivalent objects

---

## 10. Partial and Total Orders

### Partial Order

* Reflexive
* Antisymmetric
* Transitive

### Total Order

* Every pair of elements is comparable

### Hasse Diagrams

* Constructing Hasse diagrams
* Reading relationships

### Elements

* Least element
* Greatest element
* Minimal element
* Maximal element

### Lattices

* Basic concept
* Relationship to ordered structures

### Applications

* Type hierarchies
* Dependency ordering

---

## 11. Closure of Relations

### Reflexive Closure

Adding the minimum relationships required to make a relation reflexive.

### Symmetric Closure

Adding relationships required to make a relation symmetric.

### Transitive Closure

Adding relationships required to make a relation transitive.

### Meaning

* Reachability
* Connectivity
* Relationship completion

---

# Functions

## 12. Functions

* Definition of a function
* Domain
* Codomain
* Range
* Function notation

---

## 13. Types of Functions

### Injective Function

* One-to-one mapping

### Surjective Function

* Onto mapping

### Bijective Function

* Both injective and surjective

---

## 14. Function Operations

### Composition

* `f ∘ g`
* Composition of functions

### Inverse

* Inverse functions
* Conditions for existence of an inverse

---

## 15. Special Functions in Computing

### Floor Function

`⌊x⌋`

### Ceiling Function

`⌈x⌉`

### Modulo

* Remainder-based function
* Modular mappings

### Hash Functions

* Set-to-set mappings
* Mathematical model of hashing
* Collision concept

---

## 16. Pigeonhole Principle

### Basic Principle

If more objects are placed into fewer containers, at least one container must contain more than one object.

### Applications

* Collision arguments
* Hashing
* Cryptography
* Counting problems

---

# Module 3 — Combinatorics & Counting

## 1. Fundamental Counting Principles

### Sum Rule

Used when choices are mutually exclusive.

### Product Rule

Used when a task consists of multiple independent stages.

### Counting by Cases

* Breaking a problem into cases
* Adding counts from different cases

---

## 2. Permutations

### Basic Permutations

* Arrangements of objects
* `n!`

### Permutations with Repetition

* Arrangements containing repeated objects

### Circular Permutations

* Arrangements around a circle
* Rotational equivalence

---

## 3. Combinations

### Basic Combinations

* Selecting objects without considering order
* Binomial coefficients

`C(n,r) = n! / (r!(n-r)!)`

### Combinations with Repetition

* Selecting objects when repetition is allowed

---

## 4. Stars and Bars

* Distributing identical objects
* Distribution among distinct groups
* Non-negative solutions
* Positive solutions

---

## 5. Binomial Theorem

### Binomial Expansion

`(x + y)^n`

### Binomial Coefficients

* `C(n,r)`

### Pascal's Identity

* Relationship between adjacent binomial coefficients
* Combinatorial interpretation

### Combinatorial Identities

* Basic binomial identities
* Proving identities combinatorially

---

## 6. Inclusion-Exclusion Principle

### General Form

Used to count elements in multiple overlapping sets.

* Two-set case
* Three-set case
* General inclusion-exclusion formula

---

## 7. Derangements

* Definition
* Permutations where no object remains in its original position
* Counting derangements
* Basic recurrence/formula

---

## 8. Generalised Pigeonhole Principle

* Generalised form
* Counting consequences
* Distribution arguments
* Collision arguments

---

## 9. Counting and Key-Space Sizing

* Counting possible passwords
* Counting possible keys
* Key-space size
* Relationship between key-space size and cryptographic strength

> Focus is mathematical sizing rather than implementing cryptographic systems.

---

## 10. Birthday Problem

* Birthday problem as a counting problem
* Number of possible pairs
* Collision counting
* Connection to hash collisions
* Connection to cryptographic attacks

> Focus on combinatorial reasoning rather than probability theory.

---

## 11. Recurrence Relations as Counting Tools

* Formulating recurrence relations
* Counting recursively defined structures
* Solving simple counting recurrences

---

## 12. Generating Functions

* Basic concept
* Generating functions as counting devices
* Representing sequences algebraically
* Introductory applications

---

## 13. Catalan Numbers

* Definition
* Basic recurrence
* Structural counting examples
* Applications to combinatorial structures

---

# Module 4 — Number Theory & Cryptographic Foundations

## 1. Divisibility

* Definition of divisibility
* Divisibility notation
* Properties of divisibility

---

## 2. Division Algorithm

For integers `a` and positive integer `b`:

`a = bq + r`

where:

`0 ≤ r < b`

---

## 3. Greatest Common Divisor and Least Common Multiple

### GCD

* Definition
* Properties
* Computing GCD

### LCM

* Definition
* Relationship between GCD and LCM

---

## 4. Euclidean Algorithm

* Computing GCD using repeated division
* Hand-executed procedure
* Mathematical reasoning behind the algorithm

---

## 5. Extended Euclidean Algorithm

* Computing Bézout coefficients
* Finding integers satisfying:

`ax + by = gcd(a,b)`

* Application to modular inverses

---

## 6. Prime Numbers

* Definition of prime numbers
* Composite numbers
* Properties of primes

### Fundamental Theorem of Arithmetic

Every integer greater than 1 can be uniquely expressed as a product of primes, apart from the order of the factors.

---

## 7. Infinitude of Primes

### Euclid's Proof

* Assume finitely many primes
* Construct a new number
* Derive a contradiction
* Conclude that infinitely many primes exist

---

# Modular Arithmetic

## 8. Congruences

* Definition of congruence
* Modular equivalence
* Residue classes

`a ≡ b (mod n)`

---

## 9. Arithmetic in `Zₙ`

* Modular addition
* Modular subtraction
* Modular multiplication
* Modular exponentiation

---

## 10. Fast Modular Exponentiation

### Exponentiation by Squaring

* Repeated squaring
* Reducing intermediate values modulo `n`
* Mathematical procedure for efficient exponentiation

---

## 11. Modular Inverses

* Definition
* Conditions for existence
* Computing modular inverses
* Extended Euclidean algorithm

---

## 12. Linear Congruences

* Solving congruences
* Conditions for solutions
* Finding all solutions

---

## 13. Chinese Remainder Theorem

* Statement of the theorem
* Conditions
* Solving systems of congruences
* Applications to modular computation

---

## 14. Fermat's Little Theorem

For a prime `p` and integer `a` not divisible by `p`:

`a^(p−1) ≡ 1 (mod p)`

---

## 15. Euler's Theorem

If `gcd(a,n) = 1`, then:

`a^φ(n) ≡ 1 (mod n)`

---

## 16. Euler Totient Function

### `φ(n)`

* Definition
* Counting integers relatively prime to `n`
* Properties
* Computing `φ(n)`

---

## 17. Primality Reasoning

* Mathematical basis of primality testing
* Fermat test idea
* Understanding why Fermat-based reasoning can suggest primality
* Mathematical limitations of the Fermat test

> Focus is mathematical reasoning, not programming an implementation.

---

# Cryptographic Foundations

## 18. RSA Mathematics

### Key Generation

* Selecting prime numbers
* Computing `n`
* Computing Euler's totient
* Selecting the public exponent
* Computing the private exponent

### Encryption

* Mathematical encryption transformation

### Decryption

* Mathematical decryption transformation

### Correctness

* Proving RSA correctness using Euler's theorem

---

## 19. Discrete Logarithm Problem

* Definition
* Modular exponentiation
* Difficulty of reversing exponentiation
* Mathematical basis of discrete-log cryptography

---

## 20. Diffie-Hellman Key Exchange

* Mathematical construction
* Public and private values
* Shared secret
* Why the discrete logarithm problem provides security

---

## 21. Hash Functions and One-Way Functions

* Mathematical concept of one-way functions
* Hash-function properties
* Collision concept
* Preimage concept
* Number-theoretic hardness assumptions
* Role in contemporary security

---

# Module 5 — Graph Theory & Trees

## 1. Introduction to Graphs

A graph consists of:

* Vertices
* Edges

### Types of Graphs

* Simple graphs
* Multigraphs
* Directed graphs
* Weighted graphs

---

## 2. Degree of a Vertex

* Degree of a vertex
* In-degree
* Out-degree
* Degree in undirected graphs

### Handshaking Lemma

For an undirected graph:

`Σ deg(v) = 2|E|`

Consequences:

* Number of odd-degree vertices is even.

---

## 3. Graph Representations

### Adjacency Matrix

* Matrix representation
* Reading connections from a matrix

### Adjacency List

* List-based mathematical representation
* Representing neighboring vertices

---

## 4. Graph Isomorphism

* Definition of isomorphic graphs
* Vertex correspondence
* Edge preservation
* Structural equivalence

---

# Walks, Paths & Connectivity

## 5. Walks

* Definition
* Vertices and edges in a walk

## 6. Paths

* Definition
* Simple paths
* Reachability

## 7. Cycles

* Definition
* Simple cycles
* Closed walks

## 8. Connectivity

* Connected graphs
* Connected components
* Reachability
* Directed connectivity concepts

---

# Euler and Hamiltonian Structures

## 9. Euler Paths and Circuits

### Euler Path

A path that uses every edge exactly once.

### Euler Circuit

A closed Euler path using every edge exactly once.

### Existence Conditions

For connected undirected graphs:

* Euler circuit → every vertex has even degree.
* Euler path → exactly zero or two vertices have odd degree.

### Existence Theorem

* Statement
* Reasoning/proof

---

## 10. Hamiltonian Paths and Cycles

### Hamiltonian Path

Visits every vertex exactly once.

### Hamiltonian Cycle

Visits every vertex exactly once and returns to the starting vertex.

### Existence Reasoning

* Conditions and sufficient conditions
* Structural reasoning
* Difference between Eulerian and Hamiltonian structures

### Applications

* Routing
* Travelling problems
* Hard computational problems

---

# Shortest Paths and Minimum Spanning Trees

## 11. Shortest-Path Structures

* Definition of shortest path
* Path length
* Weighted graphs
* Existence of shortest paths under appropriate conditions
* Optimality reasoning

> Algorithm complexity is outside this topic and belongs to DSA.

---

## 12. Minimum Spanning Trees

* Definition
* Spanning tree
* Minimum total edge weight
* Existence and optimality properties

---

# Planar Graphs and Colouring

## 13. Planar Graphs

* Definition
* Planar vs non-planar graphs
* Planar representations

### Euler's Formula

For a connected planar graph:

`V − E + F = 2`

---

## 14. Graph Colouring

* Vertex colouring
* Proper colouring
* Chromatic number

### Applications

* Register allocation
* Scheduling
* Frequency assignment

---

# Trees

## 15. Trees

### Definition

A tree is a connected graph with no cycles.

### Properties

* Connectedness
* Acyclicity
* Number of edges

For a tree with `n` vertices:

`|E| = n − 1`

---

## 16. Rooted Trees

* Root
* Parent
* Child
* Sibling
* Ancestor
* Descendant
* Leaf
* Internal vertex
* Height
* Depth

---

## 17. Binary Trees

* Definition
* Left child
* Right child
* Binary-tree terminology

---

## 18. Spanning Trees

* Definition
* Construction
* Properties
* Minimum spanning trees

### Cayley's Formula

For a complete graph with `n` labelled vertices:

`Number of spanning trees = n^(n−2)`

### Cut and Cycle Properties

* Cut property
* Cycle property
* Structural reasoning

---

## 19. Bipartite Graphs

* Definition
* Two-part vertex partition
* Characterisation using odd cycles

### Matchings

* Definition
* Maximum matching
* Perfect matching

### Hall's Theorem

* Statement
* Conceptual understanding
* Assignment problems

---

## 20. Graphs in Technology

Mathematical modelling of:

* Network topologies
* Key-distribution structures
* Social networks
* Dependency graphs
* Assignment structures
* Communication networks

---

# Module 6 — Algebraic & Discrete Structures

# Boolean Algebra

## 1. Boolean Algebra

* Boolean variables
* Boolean constants
* Boolean operations
* Boolean expressions

### Basic Operations

* AND
* OR
* NOT

---

## 2. Boolean Algebra Axioms and Identities

* Identity laws
* Null laws
* Idempotent laws
* Complement laws
* Involution law
* Commutative laws
* Associative laws
* Distributive laws
* Absorption laws

---

## 3. Principle of Duality

* Dual expressions
* Constructing duals
* Duality principle
* Using duality to derive Boolean identities

---

## 4. Boolean Functions

* Definition
* Variables
* Truth tables
* Boolean expressions
* Boolean functions of multiple variables

---

## 5. Boolean Function Representation

* Truth-table representation
* Algebraic representation
* Sum of Products (SOP)
* Product of Sums (POS)

---

## 6. Boolean Simplification

### Algebraic Simplification

* Applying Boolean identities
* Reducing expressions
* Equivalent Boolean expressions

### Karnaugh Maps

* K-map structure
* Grouping cells
* Simplifying Boolean functions
* Minimising logic expressions

### Applications

* Digital logic
* Circuit minimisation
* Logic design

---

# Recurrence Relations

## 7. Formulating Recurrences

* Definition of recurrence relation
* Initial conditions
* Modelling discrete processes
* Translating problems into recurrences

---

## 8. Linear Homogeneous Recurrences

* Linear recurrence relations
* Homogeneous recurrences
* Constant coefficients

### Characteristic Equation Method

* Constructing characteristic equations
* Finding roots
* Forming general solutions
* Applying initial conditions

---

## 9. Non-Homogeneous Recurrences

* Non-homogeneous recurrence relations
* Particular solutions
* General solutions
* Initial conditions

---

## 10. Applications of Recurrences

* Modelling discrete processes
* Population-style discrete models
* Counting structures
* Algorithm cost equations

> Focus is on mathematical formulation and solution rather than Big-O analysis.

---

# Algebraic Structures

## 11. Binary Operations

* Definition
* Closure
* Examples of binary operations

---

## 12. Algebraic Structures

### Semigroup

A set with a closed associative binary operation.

### Monoid

A semigroup with an identity element.

### Group

A set with:

* Closure
* Associativity
* Identity
* Inverse

---

## 13. Subgroups

* Definition
* Conditions for a subset to form a subgroup
* Examples

---

## 14. Cyclic Groups

* Generators
* Cyclic groups
* Order of a group
* Order of an element

---

## 15. Modular Groups

### `(Zₙ, +)`

* Integers modulo `n`
* Addition modulo `n`
* Group structure

### `(Zₚ*, ×)`

* Non-zero residues modulo prime `p`
* Multiplication modulo `p`
* Group structure

### Connection to Number Theory

* Modular arithmetic
* Euler's theorem
* Fermat's Little Theorem
* Cryptographic applications

---

# Rings and Fields

## 16. Introduction to Rings

* Definition
* Ring operations
* Basic properties

---

## 17. Introduction to Fields

* Definition
* Field properties
* Difference between rings and fields

---

## 18. Finite Fields

### `GF(p)`

* Finite field with `p` elements for prime `p`
* Addition and multiplication modulo `p`

### `GF(2ⁿ)`

* Conceptual introduction
* Binary finite fields
* Polynomial-based representation

### Applications

* Cryptography
* Coding theory
* AES mathematics

---

# Error-Detecting and Error-Correcting Codes

## 19. Parity

* Parity bits
* Even parity
* Odd parity
* Error detection

---

## 20. Hamming Distance

* Definition
* Distance between codewords
* Minimum Hamming distance
* Error detection capability
* Error correction capability

---

## 21. Hamming Bound

* Basic statement
* Relationship between code length and error correction
* Structural reasoning about linear codes

---

# Mathematical Pseudo-Randomness

## 22. Linear Congruential Structures

* Linear recurrence-based generation
* Modular arithmetic
* Mathematical structure of linear congruential generators

---

## 23. Linear-Feedback Structures

* Feedback-based recurrences
* Linear-feedback shift structures
* Mathematical generation of sequences

---

# 24. Synthesis

Understanding how different mathematical structures work together:

```text
Boolean Algebra
       ↓
Digital Logic & Circuit Design

Recurrence Relations
       ↓
Discrete Processes & Mathematical Models

Number Theory
       ↓
Cryptography

Finite Fields
       ↓
Cryptography & Coding Theory

Combinatorics
       ↓
Counting & Security Analysis

Graph Theory
       ↓
Networks, Dependencies & Routing
```

---

