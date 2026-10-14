# Module5 - Graph Theory & Its Applications

**Syllabus (Sessions 22–26):** Graphs (types, degree, handshaking lemma) · Adjacency matrix & list · Isomorphism · Walks, paths, cycles, connectivity, components, reachability · Euler paths & circuits · Hamiltonian paths & cycles · Shortest path & minimum spanning tree · Planar graphs, Euler's formula, graph colouring · Trees (rooted, binary) · Spanning trees, Cayley's formula, cut/cycle properties · Bipartite graphs & matchings · Graphs in technology (key-distribution topologies, social networks, dependency graphs)

## Table of Contents

**Session 22 — Graph basics**
1. [Graphs & Basic Terminology](#1-graphs--basic-terminology)
2. [Types of Graphs](#2-types-of-graphs)
3. [Degree & the Handshaking Lemma](#3-degree--the-handshaking-lemma)
4. [Graph Representations: Adjacency Matrix & Adjacency List](#4-graph-representations-adjacency-matrix--adjacency-list)
5. [Graph Isomorphism](#5-graph-isomorphism)

**Session 23 — Walks, Euler, Hamiltonian**

6. [Walks, Paths & Cycles](#6-walks-paths--cycles)
7. [Connectivity, Components & Reachability](#7-connectivity-components--reachability)
8. [Euler Paths & Euler Circuits](#8-euler-paths--euler-circuits)
9. [Hamiltonian Paths & Hamiltonian Cycles](#9-hamiltonian-paths--hamiltonian-cycles)

**Session 24 — Shortest path, MST, planarity, colouring**

10. [Shortest-Path Problems & Dijkstra's Algorithm](#10-shortest-path-problems--dijkstras-algorithm)
11. [Minimum Spanning Tree (MST)](#11-minimum-spanning-tree-mst)
12. [Planar Graphs & Euler's Formula](#12-planar-graphs--eulers-formula)
13. [Graph Colouring & Chromatic Number](#13-graph-colouring--chromatic-number)

**Session 25 — Trees**

14. [Trees](#14-trees)
15. [Rooted Trees & Binary Trees](#15-rooted-trees--binary-trees)
16. [Spanning Trees & Cayley's Formula](#16-spanning-trees--cayleys-formula)
17. [Cut Property & Cycle Property](#17-cut-property--cycle-property)

**Session 26 — Bipartite graphs, matchings, graphs in technology**

18. [Bipartite Graphs](#18-bipartite-graphs)
19. [Matchings (Maximum, Perfect, Hall's Theorem)](#19-matchings-maximum-perfect-halls-theorem)
20. [Graphs in Technology — Overview](#20-graphs-in-technology--overview)
21. [Key-Distribution Topologies](#21-key-distribution-topologies)
22. [Social / Network Structure](#22-social--network-structure)
23. [Dependency Graphs](#23-dependency-graphs)

[Master checklist of all questions](#-master-checklist--every-question-in-your-module-5-file) · [Quick formula sheet](#-quick-formula-sheet)

---

# 1. Graphs & Basic Terminology

## 📖 Explanation

A **graph** is a mathematical structure that models **relationships between objects**. Formally it is an ordered pair

$$G = (V, E)$$

where
- $V$ = a (finite) set of **vertices** (also called nodes or points), and
- $E$ = a set of **edges** (connections between vertices).

**Terminology**

| Term | Meaning |
|------|---------|
| **Vertex (node)** | a point of the graph, e.g. a station, a person, a city |
| **Edge** | a connection between two vertices, written $AB$ (undirected) or $(A,B)$ (directed from $A$ to $B$) |
| **Adjacent vertices** | two vertices joined by an edge |
| **Incident** | an edge is incident on the vertices it joins |
| **Order / size** | $\lvert V\rvert$ = number of vertices, $\lvert E\rvert$ = number of edges |

**How to model a real situation as a graph (the 3-step habit used in every case study):**
1. Decide what the **objects** are → vertices.
2. Decide what the **relationship / connection** is → edges.
3. Write $V$ and $E$ explicitly.

## 🧪 Examples

**Example 1 — four cities connected by roads.**
- $V = \{A,B,C,D\}$
- $E = \{AB, BC, CD, DA\}$
- $A$ and $B$ are adjacent vertices; the graph is a "square" (a cycle on 4 vertices).

## ❓ Questions in the module on this topic

*Topic 1 is the language used by every case study. The questions that ask you to "model … as a graph" are listed under Topic 3 (Case Study 1 and its practice version) and Topic 4.*

---

# 2. Types of Graphs

## 📖 Explanation

| Type | Definition | Real-life example |
|------|-----------|-------------------|
| **Simple graph** | no self-loops and no multiple (parallel) edges between the same pair of vertices | roads between towns with at most one direct road per pair |
| **Multigraph** | multiple edges between the same pair of vertices are allowed | two cities joined by both a road *and* a railway |
| **Directed graph (digraph)** | every edge has a **direction** (an ordered pair $(u,v)$) | Instagram followers: A follows B does *not* mean B follows A |
| **Weighted graph** | every edge carries a **weight** (distance, cost, time, capacity) | road network with distances |

Other terms from the module:
- **Self-loop:** an edge from a vertex to itself.
- **Complete graph $K_n$:** a simple graph with **exactly one edge between every pair of distinct vertices**. It has $n(n-1)/2$ edges. ($K_1,\dots,K_6$ appear in your notes.)

## 🧪 Examples

- **Simple graph:** $V=\{v_1,v_2,v_3\}$, $E=\{v_1v_2,\ v_2v_3,\ v_3v_1\}$ (a triangle, which is also $K_3$).
- **Multigraph:** two parallel edges join $v_1,v_2$ and two parallel edges join $v_1,v_3$.
- **Digraph:**

```text
A → B → C
↑
|
D
```
Edges: $(A,B),\ (B,C),\ (D,A)$.

- **Weighted graph:** $AB=5,\ AC=2,\ BC=3$ (a triangle with weights).

## ❓ Questions in the module on this topic

*The "Identify the type of graph" tasks of the case studies are listed under Topic 3.*

---

# 3. Degree & the Handshaking Lemma

## 📖 Explanation

**Degree of a vertex.** $\deg(v)$ = the number of edges incident on $v$. (A self-loop is conventionally counted twice.)

**Directed graphs.**
- **In-degree** $\deg^-(v)$ = number of **incoming** edges.
- **Out-degree** $\deg^+(v)$ = number of **outgoing** edges.

**Handshaking Lemma.** For every finite undirected graph

$$\sum_{v \in V} \deg(v) = 2\lvert E\rvert .$$

*Why it is true:* every edge has two endpoints, so it adds exactly $1$ to the degree of each endpoint — i.e. $2$ to the total. Summing over all edges gives $2\lvert E\rvert$. (Like counting handshakes: each handshake involves two hands.)

**Consequences**
- The sum of all degrees is always **even**.
- Therefore the number of vertices with **odd degree is always even**.
- The **degree sequence** (the degrees written in non-increasing order) is a useful fingerprint of a graph (used in isomorphism, Topic 5).

## 🧪 Examples

**Ex 1 — degrees in a graph** (square $ABCD$ with one diagonal $BD$):
$\deg(A)=2,\ \deg(B)=3,\ \deg(C)=2,\ \deg(D)=3$.

**Ex 2 — in/out-degree:** digraph $A\to B \leftarrow C$, $A\to D$.
- Vertex $B$: incoming $A\to B$, $C\to B$ ⇒ $\deg^-(B)=2,\ \deg^+(B)=0$.
- Vertex $A$: outgoing $A\to B$, $A\to D$ ⇒ $\deg^+(A)=2,\ \deg^-(A)=0$.

**Ex 3 — verify the lemma on a square** ($A,B,C,D$, edges $AB,BC,CD,DA$): $\lvert E\rvert=4$; all degrees $=2$; total $=8=2(4)$ ✓.

**Ex 4 — verify the lemma with a diagonal** (edges $AB,BC,CD,DA,AC$):
- Step 1 degrees: $\deg(A)=3,\ \deg(B)=2,\ \deg(C)=3,\ \deg(D)=2$.
- Step 2 sum: $3+2+3+2=10$.
- Step 3 count edges: $\lvert E\rvert=5$.
- Step 4: $2\lvert E\rvert=10$ ✓ verified.

## ❓ Questions in the module on this topic

### Case Study 1 — Metro Rail Network Analysis Using Graph Theory

A city transportation department wants to analyze a small metro rail network of five stations: **A (Central), B (Market), C (University), D (Airport), E (Industrial Zone)**. The direct rail connections are: A↔B, A↔C, B↔C, B↔D, C↔D, D↔E.

**Tasks:**
1. Model the metro system using graph theory.
2. Identify the type of graph.
3. Determine the degree of each station.
4. Verify the Handshaking Lemma.

### Practice Case Study — University Campus Road Network Analysis

A university administration wants to analyze the road network connecting five important locations on its campus: **A – Main Gate, B – Academic Block, C – Library, D – Hostel, E – Sports Complex**. The direct road connections are: A↔B, A↔C, B↔C, B↔D, C↔D, D↔E. The administration wants to use graph theory to study the connectivity of the campus road network.

**Tasks:**
1. Model the campus road network using graph theory. Represent each campus location as a vertex and each direct road connection as an edge.
2. Identify the type of graph.
3. Determine the degree of each location. Calculate the degree of each vertex A, B, C, D and E.
4. Verify the Handshaking Lemma.

---

# 4. Graph Representations: Adjacency Matrix & Adjacency List

## 📖 Explanation

A drawing is good for humans, but computers (and proofs) need an **exact mathematical representation**.

### Adjacency matrix

For a graph with $n$ vertices (fix an order $v_1,\dots,v_n$), the adjacency matrix is the $n\times n$ matrix $A=[a_{ij}]$ with

$$a_{ij}=\begin{cases}1 & \text{if there is an edge between } v_i \text{ and } v_j,\\ 0 & \text{otherwise.}\end{cases}$$

**Properties and remarks**
- **Undirected graph:** $A$ is **symmetric**, $A=A^T$, because $a_{ij}=a_{ji}$.
- **Directed graph:** $A$ need *not* be symmetric.
- **Self-loop** at $v_i$: $a_{ii}=1$.
- **Weighted graph:** put the **weight** in the entry instead of $1$.
- Row sum (of a simple undirected graph) of row $i$ = $\deg(v_i)$.

| Advantages | Disadvantages |
|------------|---------------|
| easy to implement | needs $n^2$ storage locations |
| fast edge lookup ($O(1)$) | wasteful (inefficient) for sparse graphs |
| convenient for mathematical computations | |

### Adjacency list

For **each vertex, store the list of vertices adjacent to it.**

### Comparison

| Feature | Adjacency matrix | Adjacency list |
|---------|------------------|----------------|
| Storage | $O(n^2)$ | $O(n+e)$ |
| Edge search | Fast | Slower |
| Sparse graphs | Inefficient | Efficient |
| Dense graphs | Efficient | Efficient |
| Implementation | Simple | Slightly complex |

($n$ = number of vertices, $e$ = number of edges.)

## 🧪 Examples

**Example — $V=\{A,B,C,D\}$, $E=\{AB,AC,BC,CD\}$**

Adjacency matrix (order $A,B,C,D$):

$$\begin{array}{c|cccc} & A & B & C & D\\ \hline A & 0&1&1&0\\ B & 1&0&1&0\\ C & 1&1&0&1\\ D & 0&0&1&0\end{array}$$

Adjacency list:

| Vertex | Adjacent vertices |
|--------|-------------------|
| A | B, C |
| B | A, C |
| C | A, B, D |
| D | C |

i.e. $A\to B\to C,\ B\to A\to C,\ C\to A\to B\to D,\ D\to C$.

## ❓ Questions in the module on this topic

### Case Study 2 — Designing and Verifying a City Metro Rail Network

A metropolitan transport authority is planning a metro rail network connecting five stations: **A = Central Station, B = Airport, C = University, D = IT Park, E = Railway Junction**. The direct rail connections are: $AB, AC, BC, BD, CD, DE$.

A second proposed network has stations $P,Q,R,S,T$ with direct connections: $PQ, PR, QR, QS, RS, ST$.

**Tasks:**
1. Draw the graph representing the first metro rail network.
2. Construct the adjacency matrix of the graph.
3. Construct the adjacency list representation of the graph.
4. Determine whether the two metro rail networks are isomorphic. *(see Topic 5)*
5. If they are isomorphic, provide a suitable vertex correspondence. *(see Topic 5)*

### Practice Case Study — Social Networking Platform

A social networking application contains five users: **A = Anjali, B = Bharat, C = Chaitanya, D = Divya, E = Esha**. The friendship relations are: $AB, AC, BC, BD, CE, DE$.

Another campus social network contains users $P,Q,R,S,T$ with friendship relations: $PQ, PR, QR, QS, RT, ST$.

**Tasks:**
1. Represent the friendship network as a graph.
2. Construct the adjacency matrix of the graph.
3. Construct the adjacency list of the graph.
4. Determine whether the two friendship networks are isomorphic. *(see Topic 5)*
5. Justify your answer by examining vertex degrees and adjacency relationships. *(see Topic 5)*

---

# 5. Graph Isomorphism

## 📖 Explanation

**Definition.** Two graphs $G_1=(V_1,E_1)$ and $G_2=(V_2,E_2)$ are **isomorphic** ($G_1\cong G_2$) if there is a **bijection** (one-to-one and onto mapping) $f:V_1\to V_2$ such that

$$\{u,v\}\in E_1 \iff \{f(u),f(v)\}\in E_2 .$$

In words: the two graphs have the **same structure**; only the vertex labels differ. The mapping **preserves adjacency**.

**Necessary conditions (checklist before searching for a mapping).** Isomorphic graphs must have the same
1. number of vertices,
2. number of edges,
3. **degree sequence**,
4. number of connected components,
5. cycle structure.

If **any** of these differ ⇒ **not isomorphic**.

> ⚠️ These conditions are **necessary but not sufficient.** Two graphs can pass all the checks and still be non-isomorphic, so for "yes" you must actually **exhibit a bijection and check every edge**.

**Procedure to prove isomorphism**
1. Compare vertices, edges, degree sequences.
2. Match vertices of the same degree (and same neighbourhood pattern).
3. Define $f$.
4. Map every edge of $G_1$ and check it is an edge of $G_2$ (and that the edge counts agree, so nothing extra exists).

## 🧪 Examples

**Example 1 — isomorphic.** $G_1$: $V_1=\{A,B,C,D\}$, $E_1=\{AB,BC,CD,DA\}$ (a square). $G_2$: $V_2=\{1,2,3,4\}$, $E_2=\{12,24,43,31\}$.
- Degree sequence of both $=(2,2,2,2)$.
- Mapping $f(A)=1,\ f(B)=2,\ f(C)=4,\ f(D)=3$.
- Edge check: $AB\to12,\ BC\to24,\ CD\to43,\ DA\to31$ — all are edges of $G_2$. Hence $G_1\cong G_2$.

**Example 2 — not isomorphic.** $G_1$: edges $AB,BC,CA$ (triangle) has degree sequence $(2,2,2)$. $G_2$: edges $12,23$ (path) has degree sequence $(2,1,1)$. Sequences differ ⇒ not isomorphic.

## ❓ Questions in the module on this topic

*(Statements of the two case studies are given in Topic 4; the isomorphism tasks are repeated here.)*

**Q-5.1 (Case Study 2, Tasks 4–5).** Network 1 has edges $AB, AC, BC, BD, CD, DE$ on stations $A,B,C,D,E$; Network 2 has edges $PQ, PR, QR, QS, RS, ST$ on stations $P,Q,R,S,T$. Determine whether the two metro rail networks are isomorphic, and if they are, provide a suitable vertex correspondence.

**Q-5.2 (Practice Case Study — Social Networking Platform, Tasks 4–5).** Network 1 has friendships $AB, AC, BC, BD, CE, DE$; Network 2 has friendships $PQ, PR, QR, QS, RT, ST$. Determine whether the two friendship networks are isomorphic, and justify your answer by examining vertex degrees and adjacency relationships.

---

# 6. Walks, Paths & Cycles

## 📖 Explanation

| Term | Definition |
|------|------------|
| **Walk** | a sequence of vertices in which consecutive vertices are joined by an edge. **Vertices and edges may repeat.** |
| **Length of a walk** | the number of edges traversed |
| **Path** | a walk in which **no vertex is repeated** |
| **Cycle** | a path that **starts and ends at the same vertex**, with no repeated vertices except first = last |
| **Cycle length** | the number of edges in the cycle |

**Hierarchy:** every cycle/path is a walk, but a walk need not be a path.

**Why cycles matter:** a cycle gives **two disjoint routes** between any two of its vertices, so if one link fails the network still works — **redundancy / fault tolerance** (used in network design, Topic 7 and Topic 21).

## 🧪 Examples

Graph: square $A-B-C-D-A$.
- **Walk:** $A\to B\to C\to B\to A$ (length $4$; repeats $B$ and the edge $BC$).
- **Path:** $A\to B\to C\to D$ (no repeated vertex).
- **Not a path:** $A\to B\to C\to B$ ($B$ repeated).
- **Cycle:** $A\to B\to C\to D\to A$ (cycle length $4$).

## ❓ Questions in the module on this topic

### Case Study 3 — Delivery Drone Network for a Logistics Company

A logistics company uses drones to transport packages among distribution centers. The drone routes are represented by the graph below (vertices = distribution centers, edges = drone routes).

```text
A ----- B ----- C
|        |
|        |
E ----- D-------
```

*(Sketch copied from your notes; the exact edges are in the original figure — take it from your slides.)*

**Tasks (Tasks 1, 2 and 4 are on this topic; Task 3 is under Topic 7):**
1. Determine whether a cycle exists.
2. Find a path from A to D.
3. Can a package be delivered from B to E? *(see Topic 7)*
4. Explain the advantage of the cycle in the network.

---

# 7. Connectivity, Components & Reachability

## 📖 Explanation

**Connected graph.** An undirected graph is **connected** if there is a **path between every pair of vertices.** Otherwise it is **disconnected.**

**Connected component.** A **maximal connected subgraph.** Every vertex lies in exactly one component; a disconnected graph has $\ge2$ components. An isolated vertex is a component by itself.

**Reachability.** Vertex $v$ is **reachable** from $u$ if there is a path from $u$ to $v$. Write $\mathrm{Reach}(u)$ for the set of vertices reachable from $u$.
- In an undirected graph, $\mathrm{Reach}(u)$ is exactly the component containing $u$.
- In a **directed** graph **reachability depends on edge directions:** $v$ reachable from $u$ does *not* imply $u$ reachable from $v$.

**Reasoning tip:** to show two vertices are *not* reachable, show they lie in different components (no edge crosses between the groups).

## 🧪 Examples

- **Connected:** $A-B-C$ with $D$ attached to $B$ — every vertex reachable from every other.
- **Disconnected:** edges $AB$ and $CD$ only — no path from $A$ to $C$.
- **Components:** edges $AB, BC, DE$ and isolated vertex $F$ ⇒ components $\{A,B,C\},\{D,E\},\{F\}$ ⇒ 3 components.
- **Reachability:** path graph $A-B-C-D$: $\mathrm{Reach}(A)=\{A,B,C,D\}$.
- **Directed:** $A\to B\to C$ and $D\to A$: from $A$ we reach $B,C$; from $C$ we cannot reach $A$.

**Full worked example from the notes:** graph with square $A,B,C,D$ (edges $AB,BC,CD,DA$) and a separate edge $EF$.
(a) walk: $A\to B\to C\to B\to A$; (b) path: $A\to B\to C\to D$; (c) cycle: $A\to B\to C\to D\to A$; (d) *not* connected, because $E,F$ are separated from $A,B,C,D$; (e) components $\{A,B,C,D\}$ and $\{E,F\}$ ⇒ 2 components; (f) $F$ is **not** reachable from $A$.

## ❓ Questions in the module on this topic

**Q-7.1 (Case Study 3, Task 3).** In the delivery-drone network of Topic 6, can a package be delivered from B to E?

### Practice Case Study — Emergency Evacuation Planning in a Shopping Mall

Management needs to determine whether all sections can be evacuated safely. The layout is represented by the graph below (vertices = mall sections, edges = corridors connecting sections).

```text
A ----- B ----- C
|       |
|       |
D ----- E

F ----- G
```

**Tasks:**
1. How many connected components exist?
2. Is the mall fully connected?
3. Is section G reachable from section A?
4. Find an evacuation path from A to C.

---

# 8. Euler Paths & Euler Circuits

## 📖 Explanation

**Definitions**
- **Euler path (Euler trail):** a path/trail that travels through **every edge exactly once.**
- **Euler circuit (Euler cycle):** an Euler path that **starts and ends at the same vertex.**

(Vertices may be revisited; it is the **edges** that are used exactly once.)

**Existence Theorem (Euler's theorem).** For a **connected** graph:
1. An **Euler circuit exists ⇔ every vertex has even degree.**
2. An **Euler path (but not a circuit) exists ⇔ exactly two vertices have odd degree.** The path must start at one odd vertex and end at the other.

(So: 0 odd vertices ⇒ circuit; 2 odd vertices ⇒ path only; 4 or more odd vertices ⇒ neither.)

**➕ Added — proof of the existence theorem** *(your syllabus asks for it; it is not in your notes)*

*Necessity (circuit ⇒ all degrees even).* Walk along an Euler circuit. Every time the circuit passes through a vertex $v$ it enters by one edge and leaves by another, using up edges of $v$ in **pairs.** The start vertex is also paired (the first edge out is matched with the last edge in). Since every edge of $v$ is used exactly once, $\deg(v)$ is even.

*Necessity for paths.* For an Euler path from $a$ to $b$ with $a\ne b$, the same pairing argument works at every internal vertex (even degree), but at $a$ the first edge is unpaired and at $b$ the last edge is unpaired, so exactly $a$ and $b$ have **odd** degree.

*Sufficiency (all degrees even, connected ⇒ circuit).* Start at any vertex $v$ and keep walking along unused edges. Because every vertex has even degree, whenever you enter a vertex $w\ne v$ there is always an unused edge to leave by (you have used an odd number of its edges), so the walk can only get stuck back at $v$. This gives a closed trail $C_1$. If $C_1$ misses some edges, then since the graph is connected some vertex $u$ on $C_1$ has an unused edge. All degrees in the leftover graph are still even, so repeat from $u$ to obtain another closed trail $C_2$ and **splice** it into $C_1$ at $u$. Continue until all edges are used. $\blacksquare$ *(For two odd vertices $a,b$: add a temporary edge $ab$, find an Euler circuit, then delete it.)*

**Link to routing:** Euler circuits answer "can a vehicle traverse every street exactly once?" — street sweeping, snow ploughing, mail delivery (the "Chinese postman problem" idea).

## 🧪 Examples (➕ Added)

- **Triangle $K_3$:** all degrees $2$ ⇒ Euler circuit $A\to B\to C\to A$.
- **Square with one diagonal** (edges $AB,BC,CD,DA,AC$): degrees $3,2,3,2$ ⇒ exactly two odd vertices ($A,C$) ⇒ Euler path but no circuit, e.g. $A\to B\to C\to D\to A\to C$.
- **$K_4$:** all degrees $3$ (four odd vertices) ⇒ no Euler path, no circuit.
- **Königsberg bridges:** degrees $3,3,3,5$ — four odd vertices ⇒ impossible (Euler's original problem).

## ❓ Questions in the module on this topic

### Case Study 4 — Street Sweeping (Euler Circuit)

A city wants a street sweeper to clean every street exactly once and return to the depot. The road network is represented as a connected graph where every intersection has an even number of roads.

**Tasks:**
1. Is an Euler circuit possible? If yes, why?
2. What is the advantage of using an Euler circuit?

---

# 9. Hamiltonian Paths & Hamiltonian Cycles

## 📖 Explanation

**Definitions**
- **Hamiltonian path:** a path that visits **every vertex exactly once.**
- **Hamiltonian cycle (circuit):** a Hamiltonian path that **returns to its starting vertex.**

**Key difference from Euler**
- **Euler** → **edges** (use every edge once).
- **Hamiltonian** → **vertices** (visit every vertex once).

**Useful conditions (from your notes)**
- A graph with a Hamiltonian cycle **must be connected.**
- If a vertex has **degree 1**, a Hamiltonian cycle is **impossible** (you could not enter and leave it by different edges).

**➕ Added — more existence reasoning**
- Any vertex of degree $<2$ rules out a Hamiltonian cycle; a graph with a **cut vertex** (a vertex whose removal disconnects it) cannot have a Hamiltonian cycle.
- **Sufficient conditions:** *Dirac's theorem* — a simple graph with $n\ge3$ vertices in which **every vertex has degree $\ge n/2$** has a Hamiltonian cycle. *Ore's theorem* — if $\deg(u)+\deg(v)\ge n$ for every pair of non-adjacent vertices, a Hamiltonian cycle exists.
- **Unlike Euler's theorem, there is no simple "if and only if" test.** Deciding whether a Hamiltonian cycle exists is an **NP-complete** (hard) problem — this is the "structure of hard problems" link in your syllabus; the Travelling Salesman Problem (Topic 10) is its weighted version.

**Method for answering a question:** (1) try to *find* a path/cycle by hand; (2) if you suspect none exists, give a **reason** (degree-1 vertex, cut vertex, bipartite-parity argument, etc.).

## 🧪 Examples (➕ Added)

- **Square $A-B-C-D-A$:** Hamiltonian cycle $A\to B\to C\to D\to A$.
- **Path graph $A-B-C-D$:** Hamiltonian *path* $A\to B\to C\to D$, but **no** Hamiltonian cycle (end vertices have degree 1).
- **Star with centre $C$ and leaves $A,B,D$:** no Hamiltonian path or cycle (leaves cannot all be visited once).
- **Complete graph $K_n$ ($n\ge3$):** always has a Hamiltonian cycle.

## ❓ Questions in the module on this topic

**Q-9.1 (Question-1, Session-23 Part 2).** For the graphs $G_1$ and $G_2$ shown in the figure, identify whether each graph has a Hamiltonian path and/or Hamiltonian circuit. Give the corresponding path or circuit wherever it exists. *[figure — take it from your slides]*

**Q-9.2 (Practice Problems, Session-23 Part 2).** Find a Hamiltonian path or a Hamiltonian circuit, if it exists, in each of the three graphs $G_1$, $G_2$, $G_3$ shown. If it does not exist, explain why. *[figure — take it from your slides]*

---

# 10. Shortest-Path Problems & Dijkstra's Algorithm

## 📖 Explanation

**Weighted graph.** A graph in which every edge has a number (weight) — distance, cost, time, capacity.

**Length of a path** in a weighted graph = the **sum of the weights** of its edges.

**Shortest-path problem.** Find a path between two vertices such that the **sum of edge weights is minimum.** It models routing data packets (shortest distance, minimum cost, minimum time), GPS navigation, delivery routes.

**Travelling Salesman Problem (TSP)** *(Example-1 in your notes)*: a salesman wants to visit each of $n$ cities exactly once and return to the start. In which order should he visit them to travel the minimum total distance? (This is "find the minimum-weight Hamiltonian cycle" — a hard problem, see Topic 9.)

**➕ Added — existence / optimality reasoning** *(your syllabus asks for the mathematical structure, not the running time)*
- *Existence:* if the graph is finite and $v$ is reachable from $u$, there are only finitely many paths from $u$ to $v$, so a path of **minimum length exists.** If $v$ is not reachable, there is no path at all (distance $=\infty$).
- *Optimal substructure:* if $P$ is a shortest path from $u$ to $v$ and $w$ lies on $P$, then the part of $P$ from $u$ to $w$ is itself a shortest $u$–$w$ path. (If a shorter one existed, you could swap it in and shorten $P$.) This is the property that makes Dijkstra's algorithm correct.
- Dijkstra's algorithm requires **non-negative** weights.

### Dijkstra's algorithm (greedy)

Finds the minimum distance from a source node to **all** other nodes (think: node = router, graph = network, weight = distance).

1. **Initialize:** distance(source) $=0$; all other distances $=\infty$; mark all nodes unvisited; predecessor of every node $=$ null.
2. **Select current node:** among unvisited nodes, choose the one with the **smallest current distance.**
3. **Update neighbours:** for every unvisited neighbour $N$ of the current node compute
   $$\text{newDist}=\text{distance}[\text{current}]+\text{weight}(\text{current},N).$$
   If $\text{newDist}<\text{distance}[N]$, set $\text{distance}[N]=\text{newDist}$ and $\text{predecessor}[N]=\text{current}$.
4. **Mark visited:** the current node is now final (never checked again).
5. **Repeat** from step 2 while unvisited nodes remain.
6. **End:** the distances are the shortest-path costs; follow the predecessors backwards to reconstruct the path.

## 🧪 Examples

**Example 1 — TSP** (as above): visit $n$ cities once each and return, minimising total distance.

**Example 2 (➕ Added, fully worked) — Dijkstra from $A$** on the weighted graph with edges $AB=4,\ AC=2,\ BC=1,\ BD=5,\ DE=2$.

| Step | Current (final) | $d(A)$ | $d(B)$ | $d(C)$ | $d(D)$ | $d(E)$ |
|------|-----------------|--------|--------|--------|--------|--------|
| init | – | 0 | ∞ | ∞ | ∞ | ∞ |
| 1 | $A$ (0) | 0 | 4 | 2 | ∞ | ∞ |
| 2 | $C$ (2) | 0 | 3 (via $C$) | 2 | ∞ | ∞ |
| 3 | $B$ (3) | 0 | 3 | 2 | 8 | ∞ |
| 4 | $D$ (8) | 0 | 3 | 2 | 8 | 10 |
| 5 | $E$ (10) | 0 | 3 | 2 | 8 | 10 |

Shortest path $A\to E$: $A\to C\to B\to D\to E$ with length $10$. Notice step 2: the direct edge $AB=4$ was beaten by going through $C$ ($2+1=3$).

## ❓ Questions in the module on this topic

### Case Study 5 — Shortest Delivery Route Using Dijkstra's Algorithm

A delivery company needs to deliver a package from a warehouse (**A**) to a customer (**C**). The city's road network is represented as a weighted graph, where locations are vertices and roads are edges. The weight of each edge represents the travel time (in minutes) between two locations. The company wants to determine the shortest route from the warehouse (A) to the customer (C) so that the package can be delivered in the minimum possible time.

**Task:** Using Dijkstra's Algorithm, determine the shortest path from A to C and calculate the minimum total travel time. *[weighted graph figure — take it from your slides]*

**Q-10.2 (Example-2 in the notes).** What is the length of a shortest path between $a$ and $z$ in the weighted graph $G$ shown? *[figure — take it from your slides; the figure text in your file is garbled]*

**Q-10.3 (Practice Problem, Session-24 Part 1).** Use Dijkstra's algorithm to find the shortest path between the vertices $A$ and $H$ in the weighted graph given. *[figure — take it from your slides]*

---

# 11. Minimum Spanning Tree (MST)

## 📖 Explanation

**Definition.** A **minimum spanning tree** of a connected weighted graph is a **tree that connects all vertices** and has the **minimum possible total weight.**

**Properties**
- Connects **every** vertex.
- Contains **no cycles.**
- For a graph with $n$ vertices, an MST has **exactly $n-1$ edges.**
- The total edge weight is **minimum** among all spanning trees.

**Selection method used in your notes (greedy):** sort edges by increasing weight and keep each edge **unless it would create a cycle**, until $n-1$ edges are chosen. (This is Kruskal's idea; the justification is the cut and cycle properties, Topic 17.)

**➕ Added — existence & uniqueness reasoning:** a connected finite graph has at least one spanning tree, hence (finitely many) at least one **minimum** one. If all edge weights are **distinct**, the MST is **unique**; with ties there may be several MSTs, but all have the same total weight.

**Applications:** laying roads/cables/pipelines at minimum cost, network design.

## 🧪 Examples

**Example 3 (from the notes) — village road network.**

| Road | Cost |
|------|------|
| A–B | 4 |
| A–C | 2 |
| B–C | 1 |
| B–D | 5 |
| D–E | 2 |

Choose the minimum-cost roads without creating a cycle: $B\text{–}C=1,\ A\text{–}C=2,\ D\text{–}E=2$, and then $B\text{–}D=5$ (rather than $A\text{–}B=4$, which would close the cycle $A,B,C$).
Total $=1+2+2+5=10$, i.e. **MST cost = ₹10 lakh.** (5 vertices ⇒ 4 edges ✓.)

## ❓ Questions in the module on this topic

### Practice Case Study — Connecting Villages with Minimum Construction Cost

A district administration plans to connect five villages with roads. The estimated construction costs (₹ lakh) are:

| Road | Cost (₹ lakh) |
|------|---------------|
| A–B | 4 |
| A–C | 2 |
| B–C | 1 |
| B–D | 5 |
| C–D | 8 |
| C–E | 10 |
| D–E | 2 |

The administration wants to connect all villages while minimizing the total construction cost and avoiding unnecessary roads.

**Tasks:**
1. Draw the weighted graph.
2. Select the roads that connect all villages with the minimum total cost.
3. Find the total construction cost of the resulting network.

### Case Study 10 — Designing an Electricity Distribution Network (MST part)

A power company plans to connect five villages (A, B, C, D, E) using electric cables. The cost of laying cables (₹ lakh) is:

| Cable | Cost |
|-------|------|
| A–B | 2 |
| A–C | 6 |
| B–C | 3 |
| B–D | 5 |
| C–D | 4 |
| D–E | 2 |

The company wants to connect all villages with the minimum construction cost.

**Tasks on this topic:**
1. Draw the weighted graph representing the electricity distribution network.
2. Using the Minimum Spanning Tree (MST) concept, select the edges that connect all five villages with minimum total cost.
4. Calculate the minimum total construction cost.

*(The other tasks of Case Study 10: Task 3 → Topic 17, Task 5 and Task 6 → Topic 16.)*

---

# 12. Planar Graphs & Euler's Formula

## 📖 Explanation

**Planar graph.** A graph that can be **drawn in the plane without any edges crossing** (edges may meet only at vertices). If the edges can be *redrawn* to avoid crossings, the graph is planar — so a particular drawing with crossings does not prove non-planarity.

**Complete graph $K_n$** (Topic 2): one edge between every pair of distinct vertices.

**Non-planar example:** $K_5$ (5 vertices, every vertex joined to every other) **cannot** be drawn without crossings, so it is non-planar.

**Euler's formula.** For every **connected planar** graph

$$V-E+F=2,$$

where $V$ = number of vertices, $E$ = number of edges, $F$ = number of **faces** (regions), **including the outer (unbounded) region.**

**➕ Added — consequences and tests**
- For a connected simple planar graph with $V\ge3$: $E\le 3V-6$. If a graph violates this, it is **non-planar.** For $K_5$: $E=10>3(5)-6=9$ ⇒ non-planar ✓.
- $K_{3,3}$ (3 houses × 3 utilities) is also non-planar. *Kuratowski's theorem:* a graph is planar iff it contains no subdivision of $K_5$ or $K_{3,3}$.
- Planar graphs are always 4-colourable (Four Colour Theorem, Topic 13).

**How to answer "is it planar?":** either **draw it without crossings** (planar), or show it contains/needs $K_5$ or $K_{3,3}$, or violates $E\le3V-6$ (non-planar).

## 🧪 Examples

**Example 1 — square.** $V=4,\ E=4,\ F=2$ (inside + outside) ⇒ $4-4+2=2$ ✓. No crossings ⇒ planar.

**Example 2 (➕ Added) — $K_4$.** Draw one vertex inside the triangle formed by the other three: no crossings ⇒ planar. $V=4,\ E=6,\ F=4$ ⇒ $4-6+4=2$ ✓.

## ❓ Questions in the module on this topic

### Case Study 6 — Designing an Intersection-Free Road Network (Planar Graphs)

A town municipality plans to connect four important locations: **A: Railway Station, B: Bus Stand, C: Hospital, D: Market.** The engineers represent the road network as a graph, where each location is a vertex and each proposed road is an edge. *[graph figure — take it from your slides]*

**Tasks:**
1. Draw the graph representing the road network.
2. Determine whether the graph is planar.
3. If it is not planar, suggest the minimum changes required to make it planar.

### Case Study 7 — Verifying a Park Layout Using Euler's Formula

A city is designing a public park with walking paths connecting different attractions. The layout is represented by the graph in the figure.

- Vertices (attractions): 6
- Edges (walking paths): 9
- Faces (enclosed regions including the outer region): 5

Before approving the design, the planning committee wants to verify whether the layout satisfies Euler's Formula for planar graphs.

**Tasks:**
1. Verify Euler's Formula.
2. Decide whether the given graph can represent a connected planar layout.

---

# 13. Graph Colouring & Chromatic Number

## 📖 Explanation

**Graph colouring.** Assign labels ("colours") to the **vertices** so that **no two adjacent vertices share the same colour.** Such a colouring is called a **proper colouring.**

**Chromatic number** $\chi(G)$ = the **minimum number of colours** needed for a proper colouring. The optimisation goal is always to find $\chi(G)$.

**How to find $\chi(G)$:** (1) find a valid colouring with $k$ colours ⇒ $\chi(G)\le k$; (2) show $k-1$ colours are impossible (e.g. the graph contains a triangle, which needs 3) ⇒ $\chi(G)\ge k$.

**➕ Added — useful facts**
- $\chi(K_n)=n$ (all vertices mutually adjacent).
- $\chi(G)\ge$ size of the largest complete subgraph (clique) in $G$.
- $\chi(G)\le \Delta+1$, where $\Delta$ is the maximum degree.
- $\chi(G)\le2$ for a graph with edges $\iff$ $G$ is **bipartite** $\iff$ $G$ has **no odd cycle** (Topic 18). Even cycles need 2 colours; odd cycles need 3.
- **Four Colour Theorem:** every planar graph has $\chi\le4$.

**Structural links (applications):**

| Application | Vertices | Edge means | Colours are |
|-------------|----------|-----------|-------------|
| Exam scheduling | courses | a student takes both | time slots |
| Frequency assignment | towers | towers interfere | frequencies |
| Register allocation | variables | live at the same time | registers |

## 🧪 Examples (➕ Added)

- **Triangle $K_3$:** all three vertices mutually adjacent ⇒ $\chi=3$.
- **Square (4-cycle):** colour alternately red, blue, red, blue ⇒ $\chi=2$.
- **Path or tree:** alternate two colours ⇒ $\chi=2$.

## ❓ Questions in the module on this topic

### Case Study 8 — Scheduling University Examinations Using Graph Colouring

A university is preparing the examination timetable for four courses: **A: Mathematics, B: Physics, C: Programming, D: Chemistry.** Some students are enrolled in more than one course, so the following pairs of courses cannot be scheduled at the same time:
- Mathematics – Physics
- Mathematics – Programming
- Physics – Chemistry
- Programming – Chemistry

The university models this as a graph where each course is a vertex and an edge represents a scheduling conflict.

**Tasks:**
1. Draw the conflict graph.
2. Colour the graph so that adjacent vertices have different colours.
3. Find the chromatic number and determine the minimum number of examination time slots required.

**Q-13.2 (Practice Problem-1, Session-24 Part 2).** Colour the vertices of the given graph using the minimum number of colours so that adjacent vertices have different colours, and determine the chromatic number $\chi(G)$ of the graph. *[figure — take it from your slides]*

### Case Study 2 (Session 26), Part B — Frequency Assignment

Five mobile towers have the following interference connections: A–B, A–C, B–C, B–D, C–E. Adjacent towers cannot use the same frequency.

**Tasks:**
1. Draw the interference graph.
2. Assign frequencies so that adjacent towers receive different frequencies.
3. Determine the minimum number of frequencies required.

---

# 14. Trees

## 📖 Explanation

**Tree.** A **connected graph with no cycles.** (It connects all vertices without forming any loop.)

**Properties of a tree** (a tree with $n$ vertices):
- It is **connected** and has **no cycles.**
- It has exactly **$n-1$ edges.**
- There is **exactly one path** between any two vertices.
- **Removing any edge disconnects** the tree.

**Formula:** number of edges $=n-1$.

**➕ Added — why $n-1$?** Start with $n$ isolated vertices (0 edges, $n$ components). Each edge added to build a connected acyclic graph must join two *different* components (an edge inside a component would create a cycle), so it reduces the number of components by exactly one. Going from $n$ components to $1$ takes exactly $n-1$ edges. Conversely, a connected graph with $n$ vertices and $n-1$ edges is a tree, and so is an acyclic graph with $n$ vertices and $n-1$ edges.

**How to test "is it a tree?":** (i) connected? (ii) no cycle? — or (i) connected and (ii) $E=n-1$.

**Why trees are optimal for networks:** a tree connects all nodes with the **fewest possible links** — no redundant (cycle-forming) connection — but it has **no fault tolerance** (removing any edge disconnects it).

## 🧪 Examples (➕ Added)

- **Path on 5 vertices:** $n=5$, edges $=4=n-1$ ✓ tree.
- **Star with centre $C$ and leaves $A,B,D,E$:** $n=5$, edges $=4$ ✓ tree.
- **Square (4-cycle):** $n=4$, edges $=4\ne3$ ⇒ contains a cycle ⇒ not a tree.

## ❓ Questions in the module on this topic

### Case Study 9 — Connecting Office Buildings Using Minimum Cable

A company has four office buildings (A, B, C, D) that need to be connected using communication cables. The management wants every office to communicate with the others while avoiding unnecessary cable connections. The proposed connections are: A–B, A–C and B–D.

**Tasks:**
1. Draw the graph representing the cable network.
2. Determine whether the graph is a tree.
3. Verify the number of edges using the tree property.

### Practice Case Study — Designing a Minimum-Cost Water Pipeline Network

A municipal corporation wants to supply water to four residential areas A, B, C and D. The areas need to be connected through water pipelines so that every area receives water, while avoiding unnecessary pipeline connections. The proposed pipeline connections are: A–B, A–C, B–D.

**Tasks:**
1. Draw the graph representing the water pipeline network.
2. Determine whether the graph is a tree.
3. Verify the number of edges using the tree property.
4. Explain why a tree provides a network connecting all areas without unnecessary connections.

---

# 15. Rooted Trees & Binary Trees

## 📖 Explanation

**Rooted tree.** A tree in which **one vertex is chosen as the root.** Every other vertex is connected to the root by exactly one path.

**Terminology**

| Term | Meaning |
|------|---------|
| **Root** | topmost vertex |
| **Parent** | vertex directly above another vertex |
| **Child** | vertex directly below its parent |
| **Leaf** | vertex with **no children** |
| **Level** | distance from the root (root is at level 0) |

➕ *Also used:* **siblings** (children of the same parent), **subtree** (a vertex with all its descendants), **height** (largest level).

**Binary tree.** A rooted tree in which **each node has at most two children**, called the **left child** and **right child.**
- Maximum two children per node.
- Used to represent hierarchical information.
- Every binary tree is a rooted tree, but **not every rooted tree is a binary tree.**

➕ At level $k$ a binary tree has at most $2^k$ nodes.

## 🧪 Examples

**Example 1 — rooted tree terminology.** Root $=A$ with children $B,C$; $B$ has children $D,E$.
- Parent of $D$ = $B$; children of $B$ = $D,E$.
- Leaves = $C,D,E$.
- Level of $A=0$; level of $B,C=1$; level of $D,E=2$.

**Example 2 — a binary tree.** Root $A$; left child $B$; right child $C$; $B$ has two children; $C$ has none ⇒ every node has at most two children ⇒ binary tree.

**Example 3 (from the notes, solved) — school records.** Principal ($A$), Class Teacher ($B$), Sports Teacher ($C$), Student 1 ($D$), Student 2 ($E$); each teacher supervises at most two people.
Root $=A$; left child of $A$ = $B$; right child of $A$ = $C$; left child of $B$ = $D$; right child of $B$ = $E$. Every node has at most two children ⇒ it is a binary tree.

## ❓ Questions in the module on this topic

*No separate practice questions for this topic in your notes (the school-records problem is given as a solved example above).*

---

# 16. Spanning Trees & Cayley's Formula

## 📖 Explanation

**Spanning tree.** A subgraph of a connected graph $G$ that is a **tree** and contains **all vertices** of $G$. (An MST is the spanning tree of least weight, Topic 11.)

**Facts**
- Every connected graph has at least one spanning tree (keep deleting edges from cycles until none remain).
- **Every spanning tree of a graph with $n$ vertices has exactly $n-1$ edges** (it is a tree on $n$ vertices, Topic 14).

**Cayley's formula (conceptual).** The number of different spanning trees of the **complete graph $K_n$** is

$$n^{n-2}.$$

(In your notes the exponent was lost in the text and appears as "n(n−2)"; the correct formula is $n^{n-2}$, as the example $4^{4-2}=16$ confirms.)

**Counting for other graphs:** Cayley's formula applies to $K_n$ only. For other graphs you count directly (or use the Matrix-Tree theorem — beyond this module).

**Why spanning trees matter in networks:** they provide connectivity for all nodes with the fewest links, avoid loops (e.g. in switching/broadcast), and give the cheapest option when weights are attached (MST).

## 🧪 Examples

- **Spanning trees of $K_4$:** $4^{4-2}=4^2=16$.
- **(➕ Added)** $K_3$: $3^{1}=3$ (drop any one of the three edges). $K_5$: $5^3=125$.

## ❓ Questions in the module on this topic

### Case Study 10 — Electricity Distribution Network (counting tasks)

*(Data table in Topic 11: edges A–B 2, A–C 6, B–C 3, B–D 5, C–D 4, D–E 2.)*

5. How many different spanning trees are possible for this graph?
6. Verify that every spanning tree of a graph with $n$ vertices contains exactly $n-1$ edges.

### Practice Case Study — Connecting Computers in a University Network

A university wants to connect four computer laboratories (A, B, C, D) using network cables. Every laboratory should be connected, but unnecessary cable connections should be avoided. The proposed connections are: A–B, A–C, A–D, B–C, B–D, C–D. Since every laboratory is directly connected to every other laboratory, the network forms a complete graph $K_4$.

**Tasks:**
1. How many different spanning trees are possible?
2. Verify that every spanning tree contains $n-1$ edges.
3. Explain why spanning trees are useful in designing communication networks.

---

# 17. Cut Property & Cycle Property

## 📖 Explanation

These two properties explain **why the greedy selection of Topic 11 gives a minimum spanning tree.**

**Cut.** A **cut** divides the vertices of a graph into two non-empty groups. The edges with one end in each group are the **edges crossing the cut.**

**Cut property.** Among all edges crossing a cut, the **edge of smallest weight** can be included in a minimum spanning tree (so you may safely pick it).
➕ *Precisely:* some MST contains it; if that minimum edge is **unique** then **every** MST contains it.

**Cycle.** A closed path in the graph.

**Cycle property.** In any cycle, the **edge with the largest weight is not required** in a minimum spanning tree (it can be discarded).
➕ *Precisely:* if the heaviest edge is **strictly** heavier than all other edges of the cycle, it belongs to **no** MST.

**How to use them in an answer:**
- *"Justify why edge $e$ must be selected"* → name a cut for which $e$ is the lightest crossing edge (cut property).
- *"Justify why edge $e$ is rejected"* → show a cycle in which $e$ is the heaviest (cycle property).

## 🧪 Examples

**Cut property example.** Edge weights: $AB=2,\ AC=5,\ BC=4$. Cut $\{A\}\mid\{B,C\}$. Crossing edges: $AB=2,\ AC=5$. The minimum is $AB$ ⇒ $AB$ is selected for the MST.

**Cycle property example.** Cycle $A-B-C-A$ with $AB=3,\ BC=6,\ AC=2$. The largest weight is $6$ ⇒ edge $BC$ is removed; the remaining edges form part of the MST.

## ❓ Questions in the module on this topic

### Case Study 10 — Electricity Distribution Network (cut-property task)

*(Data table in Topic 11: edges A–B 2, A–C 6, B–C 3, B–D 5, C–D 4, D–E 2.)*

3. Use the cut property to justify why the edge A–B must be selected.

---

# 18. Bipartite Graphs

## 📖 Explanation

**Definition.** A simple graph $G=(V,E)$ is **bipartite** if its vertex set can be **partitioned into two sets $V_1$ and $V_2$** ($V_1\cap V_2=\varnothing$) such that **every edge joins a vertex of $V_1$ to a vertex of $V_2$.** There is **no edge with both ends in the same set.**

**Complete bipartite graph $K_{m,n}$.** A bipartite graph in which **every vertex of the first set (size $m$) is joined to every vertex of the second set (size $n$).**

$$\lvert V(K_{m,n})\rvert=m+n,\qquad \lvert E(K_{m,n})\rvert=mn,$$

and $K_{m,n}$ is **regular if and only if $m=n$.**

**➕ Added — how to test bipartiteness**
- Try to **2-colour** the graph (Topic 13): colour a vertex red, its neighbours blue, their neighbours red, … If you ever need the same colour on two adjacent vertices, the graph is **not** bipartite.
- **Theorem:** a graph is bipartite $\iff$ it contains **no odd-length cycle.** So even cycles ($C_4,C_6,\dots$) and all trees are bipartite; triangles and $C_5$ are not.

**Why it matters:** bipartite graphs model **two different kinds of objects** and relationships *between* the kinds — workers/jobs, students/courses, users/products — which leads to matchings (Topic 19).

## 🧪 Examples

**Example 1 — $C_6$** (a 6-cycle) is bipartite: alternate its vertices between the two sets.

**Example 2 (from the notes, solved) — verify whether $G$ is bipartite.** The vertices of $G$ can be split into $X=\{A,C\}$ and $Y=\{B,D\}$. Vertices of $X$ join only to vertices of $Y$ and vice-versa; no two vertices inside the same set are adjacent. Therefore $G$ is bipartite.

## ❓ Questions in the module on this topic

*No practice questions on this topic in your notes.*

---

# 19. Matchings (Maximum, Perfect, Hall's Theorem)

## 📖 Explanation

**Matching.** A set of **edges with no common endpoint** (no vertex appears in two chosen edges).

**Maximum matching.** A matching with the **largest possible number of edges.**

**Perfect matching.** A matching that **covers every vertex** — every vertex is incident with exactly one edge of $M$. Equivalently

$$\lvert M\rvert=\frac{\lvert V\rvert}{2}.$$

(So a perfect matching can exist only when $\lvert V\rvert$ is even. Every perfect matching is a maximum matching.)

**Applications (from your notes):** online dating services, assigning tasks to servers, assigning crews to flights, planes to gates — i.e. **assignment problems.**

**➕ Added — Hall's theorem (conceptual)** *(named in your syllabus but not stated in your notes)*

Let $G$ be bipartite with parts $X$ (e.g. workers) and $Y$ (e.g. jobs). For a set $S\subseteq X$, let $N(S)$ be the set of vertices of $Y$ adjacent to at least one vertex of $S$.

> **Hall's Theorem.** There is a matching that covers **every vertex of $X$** $\iff$ for **every** subset $S\subseteq X$, $\;\lvert N(S)\rvert\ge\lvert S\rvert$.

*Intuition:* any group of $k$ workers must collectively be qualified for at least $k$ jobs ("Hall's condition"). If some group of $k$ workers is only qualified for fewer than $k$ jobs, they cannot all be assigned. Necessity is obvious; the theorem says this obvious condition is also enough.

**Using it:** to *prove* an assignment exists, check Hall's condition for all subsets $S$; to *disprove* it, exhibit one **bad set** $S$ with $\lvert N(S)\rvert<\lvert S\rvert$.

## 🧪 Examples

**Example 1 — a matching.** Edges $M=\{x_1y_1,\ x_2y_2,\ x_3y_3\}$: no vertex repeats ⇒ a matching.

**Example 2 — maximum matching.** Edges $x_1y_1,\ x_1y_2,\ x_2y_2,\ x_3y_3$. The matching $\{x_1y_1,\ x_2y_2,\ x_3y_3\}$ has size $3$; no larger matching is possible (only 3 vertices on each side) ⇒ maximum matching.

**Example 3 — perfect matching.** Edges $x_1y_1,\ x_2y_2,\ x_3y_3$: every vertex is matched exactly once ⇒ perfect matching ($\lvert M\rvert=3=6/2$).

**Example 4 (➕ Added) — Hall's condition.**
- Edges $x_1y_1,x_1y_2,x_2y_2,x_3y_3$: for $S=\{x_1,x_2\}$, $N(S)=\{y_1,y_2\}$, size $2\ge2$ ✓; every other subset also satisfies the condition ⇒ $X$ can be fully matched (as found above).
- Edges $x_1y_1,\ x_2y_1,\ x_3y_2$: for $S=\{x_1,x_2\}$, $N(S)=\{y_1\}$ has size $1<2$ ✗ ⇒ no matching covers all of $X$ (a maximum matching has size 2).

## ❓ Questions in the module on this topic

*No practice questions on Topics 18–19 in your notes (Session 26 Part 1 has no case study).*

---

# 20. Graphs in Technology — Overview

## 📖 Explanation

**Idea.** Graph theory is used to **model, analyse and solve problems in modern technological systems.** Components of a system become **vertices (nodes)**; interactions or relationships become **edges (links)**:

$$G=(V,E),\quad V=\text{finite set of nodes},\ E=\text{finite set of connections}.$$

This converts a complicated system into a mathematical model whose **structure, connectivity, efficiency, security and performance** can be studied.

**Where graphs appear**

| Area | Nodes → edges | Applications |
|------|---------------|--------------|
| Computer networks | computers, routers, switches → links | internet routing, network optimization, fault detection |
| Social networks | users → friendships/follows | Facebook, LinkedIn, Instagram, X |
| Navigation | intersections → roads | GPS, route planning, traffic optimization |
| Search engines | web pages → hyperlinks | web crawling, page ranking |
| Artificial intelligence | concepts/entities → relations | knowledge graphs, expert systems, NLP |
| Recommendation systems | users ↔ products/movies/songs | Netflix, Amazon, Spotify |
| Cybersecurity | systems → attack paths | vulnerability analysis, intrusion detection |
| Software engineering | modules → dependencies | dependency graphs, control-flow graphs, call graphs, version-control history (DAG) |
| Transport & logistics | places → routes | airline routes, railway scheduling, delivery routing |
| Biology & healthcare | genes/proteins → interactions | interaction networks, disease transmission |

**Advantages of graphs:** represent complex relationships efficiently; find optimal routes and shortest paths; improve search and recommendation; support network analysis and optimization; detect fraud and cyber threats; model real systems accurately.

**The three technology topics of your syllabus** are developed next: key-distribution topologies (Topic 21), social/network structure (Topic 22), dependency graphs (Topic 23).

## 🧪 Examples

See Topics 21–23.

## ❓ Questions in the module on this topic

*None separately — see Topics 21–23.*

---

# 21. Key-Distribution Topologies

## 📖 Explanation

**Key-distribution topology.** The way **cryptographic keys are distributed among users or devices** in a secure communication network. The choice affects **security, scalability and management.**

**Graph view (➕ Added).** Let the users be vertices and draw an edge when two parties share a key or a secure link. Then every topology below is a graph with a recognisable shape: pairwise = complete graph $K_n$; KDC = a **star**; hierarchical = a **tree**; mesh = dense/complete. A secure channel between two users exists exactly when they are **connected** by a path of trusted links, so *connectivity, cut vertices and cycles* decide reliability.

### The types

**1. Point-to-point (pairwise).** Each pair of users shares a **unique secret key.**
- ✔ high security; no central authority; simple for small networks.
- ✘ needs **many keys**; hard to manage as the number of users grows.
- **Number of keys for $n$ users:** $\dfrac{n(n-1)}{2}$ (one per pair, i.e. the number of edges of $K_n$).

**2. Centralized — Key Distribution Centre (KDC).** A **trusted server** generates and distributes session keys to users.
- ✔ easy key management; scalable; supports dynamic session keys.
- ✘ **single point of failure**; high dependence on the KDC.
- Examples: Kerberos authentication, enterprise networks.

**3. Hierarchical.** Keys flow through **multiple levels** of trusted authorities (Root CA → regional authorities → users).
- ✔ highly scalable; easier administration; suits large organisations.
- ✘ more complex management; failure at a higher level affects the levels below.
- Applications: Public Key Infrastructure (PKI), large enterprises.

**4. Mesh.** **Every participant** can establish secure keys with every other participant.
- ✔ high reliability; no central dependency; multiple communication paths.
- ✘ large number of keys; complex management.
- Applications: military communication, blockchain and peer-to-peer systems.

**5. Hybrid.** Combines centralized and decentralized approaches — e.g. a KDC distributes long-term keys while users set up temporary session keys directly.
- ✔ balanced security and scalability; flexible deployment.
- Applications: cloud computing, modern enterprise security.

> The "comparison of key-distribution topologies" table in your Module 5 file came out garbled (the column values are shifted), so I have not reproduced it. Copy it from your slides.

**Applications of key distribution:** secure communication systems, banking and financial transactions, military communication, VPNs, cloud security, IoT, wireless sensor networks, enterprise authentication.

## 🧪 Examples

- **Pairwise:** 10 users ⇒ $\dfrac{10\cdot9}{2}=45$ unique keys (from your notes).
- **(➕ Added)** 100 users ⇒ $\dfrac{100\cdot99}{2}=4950$ keys — shows why pairwise does not scale; a KDC needs only one key per user ($100$).
- **KDC structure:** KDC in the centre linked to $A,B,C$ (a star). Removing the KDC disconnects everyone ⇒ single point of failure.

## ❓ Questions in the module on this topic

### Practice Case Study-1 — Secure Communication and Software Dependency Analysis Using Graphs (Part A)

A software company is developing a secure online banking system. To ensure secure communication, the company must distribute encryption keys among five servers (A, B, C, D, E). The network is represented as a graph in which vertices are servers and edges are secure communication links.

**Part A — Key-Distribution Topology.** The secure communication links are: A–B, A–C, B–D, C–D, D–E.

**Tasks:**
1. Draw the graph representing the key-distribution network.
2. Determine whether every server can securely communicate (directly or indirectly) with every other server.
3. If the link D–E fails, explain mathematically how it affects the network.

---

# 22. Social / Network Structure

## 📖 Explanation

**Social network structure.** A graph-based representation of relationships among people, organisations or other entities.
- **Nodes (vertices):** individuals, groups, organisations (also devices).
- **Edges (links):** friendship, following, communication, collaboration, transactions.

**Components**
1. **Nodes** – people, organisations, devices, groups.
2. **Edges** – the relationships.
3. **Degree** – number of connections of a node. **High degree ⇒ popular or influential user; low degree ⇒ less connected user.**
4. **Communities (clusters)** – groups of nodes more densely connected to each other than to the rest.
5. **Central nodes** – users with many important connections that **spread information efficiently.**

**Types of social-network structure**

| Type | Shape | Advantages | Disadvantages |
|------|-------|------------|---------------|
| **Centralized** | one central node linked to all others (a star) | easy to manage; fast communication through the centre | single point of failure |
| **Decentralized** | several central nodes, each linking its own group | more reliable; better scalability | – |
| **Distributed** | all nodes interconnected, no central controller | highly fault-tolerant; no single point of failure | – |

**Applications:** social media (friend/follower networks), business (customer-relationship analysis), healthcare (disease-spread modelling), marketing (influencer identification), cybersecurity (fraud/attack detection), research (collaboration networks), transportation (traffic/route optimisation), telecommunications (network analysis).

**Benefits:** identifies influential individuals; recommends friends, products or content; detects communities and trends; improves communication efficiency; helps detect fraud and misinformation; supports decision-making.

**Real-world examples:** Facebook (friend relationships), LinkedIn (professional connections), Instagram (followers/following), X (followers, mentions, reposts), WhatsApp (communication networks), GitHub (collaboration among developers).

**Link to earlier topics:** "most influential user" is found with the **degree** (Topic 3); information spreads along **paths** and within **components** (Topics 6–7).

## 🧪 Examples

**Example — four users:** Alice, Bob, Carol, David; edges are friendships (e.g. Alice–Bob, Alice–Carol, Bob–Carol, Carol–David). The user with the most links (highest degree) is the most central.

## ❓ Questions in the module on this topic

### Case Study 2 (Session 26) — Social Network Analysis and Frequency Assignment Using Graphs (Part A)

A telecom company is planning to install mobile towers in a city while also analysing the city's social network to identify influential users for a marketing campaign. People in the social network are vertices and friendships are edges.

**Part A — Social Network Structure.** Five users (A, B, C, D, E) are connected as follows: A–B, A–C, B–D, C–D, D–E.

**Tasks:**
1. Draw the social network graph.
2. Identify the user connected to the maximum number of people.
3. Explain why that user is important in spreading information.

*(Part B of this case study — frequency assignment — is under Topic 13.)*

---

# 23. Dependency Graphs

## 📖 Explanation

**Dependency graph.** A **directed graph** that represents **dependencies between tasks, modules, files, packages or processes.**
- **Nodes (vertices):** tasks, modules or components.
- **Directed edges (arrows):** show that one component depends on another.

**Direction convention — read carefully.** Your notes state the definition as "$A\to B$ means $A$ depends on $B$, so $B$ must be completed first", but the **worked example and the case-study solutions in your notes use the opposite reading:** the arrow goes from the prerequisite to the dependent module ("$A\to B$: $A$ must be completed before $B$, i.e. $B$ depends on $A$"). Both conventions exist; **use the reading your instructor/slides use, and state your convention in your answer.** The Part B question below follows the second reading.

**Characteristics**
- **Directed** — edges have a direction.
- **Usually acyclic — a DAG** (Directed Acyclic Graph): no cycles.
- **Supports scheduling** — gives a correct execution order.
- **Identifies dependencies** — shows which components rely on which.

**➕ Added — the mathematics behind it:** a valid build/execution order exists **iff the graph has no directed cycle** (a cycle = circular dependency, impossible to satisfy). Such an order is called a **topological ordering** — list every module only after all of its prerequisites. A module with **no incoming edges** (no prerequisites) can be done first.

**Applications**
- **Software development:** dependencies between modules and libraries (Application → Business Logic → Database Library).
- **Project management:** Requirement Analysis → Design → Coding → Testing → Deployment.
- **Package management:** Maven (Java), npm (JavaScript), pip (Python).
- **Database systems:** dependencies between tables, views, stored procedures.
- **Compiler design:** order in which source files are compiled.
- **Build systems:** recompile only the files affected by a change.

**Advantages:** identifies execution order; prevents dependency conflicts; improves software maintenance; enables parallel execution where possible; detects missing or circular dependencies; optimises build and deployment.

## 🧪 Examples

**Example — diamond dependency** (prerequisite → dependent arrows):

```text
    A
   / \
  ↓   ↓
  B   C
   \ /
    ↓
    D
```

- $B$ and $C$ depend on $A$ (so $A$ comes first).
- $D$ depends on both $B$ and $C$.
- Valid order: $A,\ B,\ C,\ D$ (or $A,\ C,\ B,\ D$); $B$ and $C$ could run **in parallel.**

## ❓ Questions in the module on this topic

### Practice Case Study-1 (Part B) — Dependency Graph

The software modules have dependencies that determine the order in which they must be developed and tested:
- Module A must be completed before B and C.
- Module B must be completed before D.
- Module C must be completed before D.
- Module D must be completed before E.

**Tasks:**
1. Draw the dependency graph.
2. Identify the first module that should be developed.
3. Explain why Module E cannot be developed before Module D.

---

# ✅ Master Checklist — every question in your Module 5 file

| # | Question | Topic(s) |
|---|----------|----------|
| 1 | Case Study 1 — Metro Rail Network (model, type, degrees, Handshaking Lemma) | 3 |
| 2 | Practice Case Study — University Campus Road Network (same 4 tasks) | 3 |
| 3 | Case Study 2 — Designing a City Metro Rail Network (draw, matrix, list, isomorphism, correspondence) | 4, 5 |
| 4 | Practice Case Study — Social Networking Platform (graph, matrix, list, isomorphism, justification) | 4, 5 |
| 5 | Case Study 3 — Delivery Drone Network (cycle, path A→D, B→E, advantage of cycle) | 6, 7 |
| 6 | Practice Case Study — Emergency Evacuation in a Shopping Mall (components, connected?, reachability, path A→C) | 7 |
| 7 | Case Study 4 — Street Sweeping (Euler circuit?, advantage) | 8 |
| 8 | Question-1 — Hamiltonian path/circuit in $G_1$, $G_2$ (figure) | 9 |
| 9 | Practice Problems — Hamiltonian path/circuit in $G_1,G_2,G_3$ (figure) | 9 |
| 10 | Case Study 5 — Shortest delivery route A→C using Dijkstra (figure) | 10 |
| 11 | Example-2 — shortest path between $a$ and $z$ (figure) | 10 |
| 12 | Practice Problem — Dijkstra from A to H (figure) | 10 |
| 13 | Practice Case Study — Connecting Villages with Minimum Cost (MST) | 11 |
| 14 | Case Study 10 — Electricity Distribution Network (6 tasks: graph, MST, cut property, cost, number of spanning trees, $n-1$ edges) | 11, 16, 17 |
| 15 | Case Study 6 — Intersection-Free Road Network (planar?) | 12 |
| 16 | Case Study 7 — Park Layout and Euler's Formula | 12 |
| 17 | Case Study 8 — Scheduling University Examinations (graph colouring) | 13 |
| 18 | Practice Problem-1 — colour the graph and find $\chi(G)$ (figure) | 13 |
| 19 | Case Study 2 (Session 26) Part B — Frequency Assignment | 13 |
| 20 | Case Study 9 — Connecting Office Buildings (tree?) | 14 |
| 21 | Practice Case Study — Water Pipeline Network (tree, edges, why a tree) | 14 |
| 22 | Practice Case Study — University Network $K_4$ (spanning trees count, $n-1$ edges, usefulness) | 16 |
| 23 | Practice Case Study-1 Part A — Key-distribution network (draw, connectivity, effect of failure of D–E) | 21 |
| 24 | Case Study 2 (Session 26) Part A — Social network (draw, max degree user, why important) | 22 |
| 25 | Practice Case Study-1 Part B — Dependency graph (draw, first module, why E after D) | 23 |

*Topics with no questions in your notes: 1, 2, 15, 18, 19, 20.*

---

# 🧠 Quick formula sheet

- **Handshaking Lemma:** $\sum_{v}\deg(v)=2\lvert E\rvert$ ⇒ number of odd-degree vertices is even.
- **Complete graph:** $\lvert E(K_n)\rvert=\dfrac{n(n-1)}{2}$.
- **Adjacency matrix** (undirected) is symmetric; storage $O(n^2)$. **Adjacency list** storage $O(n+e)$.
- **Isomorphism:** bijection preserving adjacency; same $V$, $E$, degree sequence, components, cycle structure (necessary, not sufficient).
- **Euler circuit** ⇔ connected and all degrees even. **Euler path** (not circuit) ⇔ connected and exactly 2 odd vertices.
- **Hamiltonian:** visits every vertex once; no degree-1 vertex allowed for a cycle; Dirac: $n\ge3$, all $\deg\ge n/2$ ⇒ Hamiltonian cycle.
- **Dijkstra:** $\text{newDist}=d[\text{current}]+w(\text{current},N)$; update if smaller; weights $\ge0$.
- **MST:** $n-1$ edges, no cycle, minimum total weight. **Cut property:** lightest crossing edge is safe. **Cycle property:** heaviest edge of a cycle can be dropped.
- **Planar:** $V-E+F=2$ (connected); $E\le3V-6$ for simple planar $V\ge3$; $K_5$, $K_{3,3}$ non-planar.
- **Colouring:** $\chi(K_n)=n$; $\chi\le\Delta+1$; bipartite ⇔ $\chi\le2$ ⇔ no odd cycle; planar ⇒ $\chi\le4$.
- **Tree:** connected, acyclic, $n-1$ edges, unique path between any two vertices.
- **Cayley:** number of spanning trees of $K_n$ $=n^{n-2}$ (e.g. $4^2=16$).
- **Bipartite:** $K_{m,n}$ has $m+n$ vertices and $mn$ edges; regular iff $m=n$.
- **Perfect matching:** $\lvert M\rvert=\lvert V\rvert/2$. **Hall:** $\lvert N(S)\rvert\ge\lvert S\rvert$ for all $S\subseteq X$ ⇔ matching covering $X$.
- **Pairwise keys for $n$ users:** $n(n-1)/2$.