# Mathematics for AI – Module 1

## Vectors, Matrices & Linear Systems

*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

AI models never see "a photo" or "a sentence". They see **lists of numbers**. Linear algebra is the toolkit for handling lists of numbers (vectors) and tables of numbers (matrices).

This module answers five questions:

1. How do we store one data point? -> **vector**
2. How do we compare two data points? -> **dot product, norm, cosine similarity**
3. How do we store a whole dataset and transform it? -> **matrix**
4. How do we solve for unknowns? -> **Ax = b, Gaussian elimination, inverse**
5. How much real information is in the data? -> **rank, basis, projection, least squares**

**Prerequisites:** school algebra, solving 2 equations in 2 unknowns, basic trigonometry (cos of an angle).

---

## 1.1 Vectors as data

### Intuition

A vector is just an ordered list of numbers. Think of it as a **row in your Excel sheet**: one student = (marks in maths, marks in physics, attendance %).

In R^n (read "R-n"), n is the number of entries. R^2 is the flat plane, R^3 is 3D space, R^1000 is a 1000-feature data point (we cannot draw it, but the maths works the same).

### Notation

```latex
\mathbf{v} = (v_1, v_2, \dots, v_n) \in \mathbb{R}^n, \qquad \text{e.g. } \mathbf{v} = (2, 3) \in \mathbb{R}^2
```

### Geometric meaning

A vector is an **arrow from the origin to a point**. (2, 3) means: go 2 right, 3 up. It has a **length** and a **direction**.

### Feature vector (the AI meaning)

A data point = a vector of its features.

```latex
\mathbf{x} = (\underbrace{1200}_{\text{area}},\ \underbrace{3}_{\text{bedrooms}},\ \underbrace{10}_{\text{age}})
```

A grayscale image of 28x28 pixels = a vector in R^784 (flatten the pixels). A word embedding = a vector in R^300 or more.

### Vector operations

**Addition** – add entry by entry.

```latex
(1,2) + (3,4) = (1+3,\ 2+4) = (4,6)
```

Geometry: place the second arrow at the tip of the first (tip-to-tail).

**Scalar multiplication** – multiply every entry by a number c.

```latex
3\,(1,2) = (3,6)
```

Geometry: stretches the arrow by c. If c is negative the arrow flips direction.

**Subtraction** – a - b = a + (-1)b. Geometry: arrow from tip of b to tip of a.

### Linear combination

Mix vectors using scalars and add:

```latex
c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \dots + c_k\mathbf{v}_k = \sum_{i=1}^{k} c_i\mathbf{v}_i
```

Example: 2\*(1, 0) + 3\*(0, 1) = (2, 3). Any point in the plane can be built from (1,0) and (0,1) like this.

**Why it matters:** a neural-network neuron computes w1*x1 + w2*x2 + ... = a linear combination of the inputs. A linear combination is the most basic move in AI.

### Common traps

- You can only add vectors of the **same size**.
- Vector (1,2) is not the same as (2,1): **order matters**.

---

## 1.2 Dot product, norms and distance

### Dot product

**Intuition:** multiply matching entries and add. It measures "how much two vectors point the same way".

```latex
\mathbf{a}\cdot\mathbf{b} = a_1 b_1 + a_2 b_2 + \dots + a_n b_n = \sum_{i=1}^{n} a_i b_i
```

Example: a = (1, 2, 3), b = (4, 5, 6)

```latex
\mathbf{a}\cdot\mathbf{b} = 1\cdot 4 + 2\cdot 5 + 3\cdot 6 = 4 + 10 + 18 = 32
```

**Use when:** you need a similarity score, a projection, or an angle.

### Length (norm)

**Intuition:** distance from origin = Pythagoras.

```latex
\|\mathbf{a}\| = \sqrt{a_1^2 + a_2^2 + \dots + a_n^2} = \sqrt{\mathbf{a}\cdot\mathbf{a}}
```

Example: ||(3, 4)|| = sqrt(9 + 16) = 5.

A **unit vector** has length 1. Make any vector a unit vector by dividing by its length: a / ||a||. (Called normalising.)

Other norms used in AI:

```latex
\begin{aligned}
\|\mathbf{a}\|_1 &= |a_1| + |a_2| + \dots + |a_n| && \text{(Manhattan distance, used in Lasso)} \\
\|\mathbf{a}\|_2 &= \sqrt{a_1^2 + \dots + a_n^2} && \text{(usual length, used in Ridge)}
\end{aligned}
```

### Distance between two data points

```latex
d(\mathbf{a},\mathbf{b}) = \|\mathbf{a}-\mathbf{b}\| = \sqrt{(a_1-b_1)^2 + \dots + (a_n-b_n)^2}
```

Example: d((1,2), (4,6)) = sqrt(9 + 16) = 5. **Use when:** k-nearest neighbours, k-means clustering.

### Angle between vectors

The key link between dot product and angle:

```latex
\mathbf{a}\cdot\mathbf{b} = \|\mathbf{a}\|\,\|\mathbf{b}\|\cos\theta
```

So

```latex
\cos\theta = \frac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|\,\|\mathbf{b}\|}
```

- a . b > 0: angle less than 90 degrees (similar direction)
- a . b = 0: exactly 90 degrees (**orthogonal**, no similarity)
- a . b < 0: angle more than 90 degrees (opposite-ish)

### Cosine similarity

The cosine formula above, used as a similarity score between -1 and 1.

```latex
\operatorname{cos\_sim}(\mathbf{a},\mathbf{b}) = \frac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|\,\|\mathbf{b}\|}
```

Example: a = (1, 0), b = (1, 1)

```latex
\begin{aligned}
\mathbf{a}\cdot\mathbf{b} &= 1, \quad \|\mathbf{a}\| = 1, \quad \|\mathbf{b}\| = \sqrt{2} \\
\operatorname{cos\_sim} &= \frac{1}{\sqrt{2}} \approx 0.707 \quad (\theta = 45^\circ)
\end{aligned}
```

### Why these measure similarity in AI

- **Distance** says how far apart two points are: small distance = similar.
- **Cosine similarity** ignores length and only checks direction. Perfect for text: a long and a short document on the same topic point the same way even though their word counts differ.
- Search engines, recommender systems and chatbots' embeddings all rank things by cosine similarity or dot product.

### Common traps

- Cosine similarity is undefined if a vector is the zero vector (division by zero).
- Distance is affected by feature scales (marks 0-100 vs salary in lakhs), so **normalise features** first.

---

## 1.3 Matrices as data and as transformations

### What is a matrix?

A rectangular table of numbers with m rows and n columns (an m x n matrix).

```latex
A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} \in \mathbb{R}^{2\times 3}
```

Entry a\_ij = row i, column j.

### A dataset as a matrix

Stack data points as rows, features as columns.

```latex
X = \begin{array}{r|ccc} & \text{area} & \text{bedrooms} & \text{age} \\ \hline \text{house 1} & 1200 & 3 & 10 \\ \text{house 2} & 800 & 2 & 5 \\ \text{house 3} & 1500 & 4 & 20 \end{array}
```

This is the X matrix (n samples x d features). Your Excel sheet **is** a matrix.

### Matrix-vector multiplication

**Method 1 (row view):** each output entry = dot product of a row with the vector.

```latex
\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}\begin{pmatrix} 5 \\ 6 \end{pmatrix} = \begin{pmatrix} 1\cdot5 + 2\cdot6 \\ 3\cdot5 + 4\cdot6 \end{pmatrix} = \begin{pmatrix} 17 \\ 39 \end{pmatrix}
```

**Method 2 (column view, more powerful):** Ax = a linear combination of the columns of A, with weights from x.

```latex
\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}\begin{pmatrix} 5 \\ 6 \end{pmatrix} = 5\begin{pmatrix} 1 \\ 3 \end{pmatrix} + 6\begin{pmatrix} 2 \\ 4 \end{pmatrix} = \begin{pmatrix} 17 \\ 39 \end{pmatrix}
```

**Size rule:** (m x n) times (n x 1) gives (m x 1). The inner numbers must match.

**Meaning:** predictions of a linear model are y = Xw. Each house's price = dot product of its features with the weights.

### Matrix-matrix multiplication

(m x n) times (n x p) gives (m x p). Entry (i, j) = row i of A dot column j of B.

```latex
\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}\begin{pmatrix} 0 & 1 \\ 3 & 2 \end{pmatrix} = \begin{pmatrix} 1\cdot0+2\cdot3 & 1\cdot1+2\cdot2 \\ 3\cdot0+4\cdot3 & 3\cdot1+4\cdot2 \end{pmatrix} = \begin{pmatrix} 6 & 5 \\ 12 & 11 \end{pmatrix}
```

**Meaning:** doing one transformation after another (see 1.4). Each layer of a neural network is a matrix multiplication.

### Rules to remember

```latex
\begin{aligned}
AB &\neq BA \text{ in general} && \text{(order matters!)} \\
(AB)C &= A(BC) && \text{(associative)} \\
A(B+C) &= AB + AC && \text{(distributive)} \\
(AB)^{\mathsf T} &= B^{\mathsf T}A^{\mathsf T} && \text{(transpose reverses order)} \\
AI &= IA = A && \text{(identity)}
\end{aligned}
```

Transpose A^T: swap rows and columns.

### Common traps

- Checking sizes first saves you: if inner dimensions do not match, the product does not exist.
- Never assume AB = BA.

---

## 1.4 Linear transformations

### Intuition

A matrix is a **machine** that takes a vector in and gives a vector out, by reshaping space (rotating, stretching, squashing). A transformation T is **linear** if

```latex
T(\mathbf{u}+\mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v}) \qquad\text{and}\qquad T(c\mathbf{u}) = c\,T(\mathbf{u})
```

Grid lines stay straight and the origin stays fixed.

### The secret: columns tell the story

The columns of A are where the basis vectors (1,0) and (0,1) land. So to build a matrix for a transformation, track where e1 = (1,0) and e2 = (0,1) go and write them as columns.

### Standard 2D examples

```latex
\begin{aligned}
\text{Scaling (by } a \text{ in } x,\ b \text{ in } y\text{):} \quad & \begin{pmatrix} a & 0 \\ 0 & b \end{pmatrix} \\[4pt]
\text{Rotation by } \theta\text{:} \quad & \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} \\[4pt]
\text{Projection onto } x\text{-axis:} \quad & \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} \\[4pt]
\text{Reflection about } x\text{-axis:} \quad & \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}
\end{aligned}
```

Example: rotate (1, 0) by 90 degrees. cos90 = 0, sin90 = 1.

```latex
\begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}\begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ 1 \end{pmatrix} \qquad (1,0) \mapsto (0,1)
```

### Composition

Applying T1 then T2 equals multiplying matrices **right to left**:

```latex
T_2\big(T_1(\mathbf{x})\big) = (A_2 A_1)\,\mathbf{x}
```

Example: scale by 2 (S = 2I) then rotate 90 degrees (R). Combined matrix = R S. Since the order changes the result (rotate-then-shear is not shear-then-rotate), AB != BA now has a geometric reason.

### AI meaning

A neural-network layer = linear transformation (matrix W) followed by a nonlinearity. Stacking layers = composing transformations. Without the nonlinearity, many layers would collapse into one matrix (A2 A1 is just another matrix).

---

## 1.5 Systems of linear equations

### Representation Ax = b

Two equations, two unknowns:

```latex
\begin{aligned} 2x + y &= 5 \\ x - y &= 1 \end{aligned}
```

Write as

```latex
\underbrace{\begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix}}_{A}\underbrace{\begin{pmatrix} x \\ y \end{pmatrix}}_{\mathbf{x}} = \underbrace{\begin{pmatrix} 5 \\ 1 \end{pmatrix}}_{\mathbf{b}} \qquad\text{i.e.}\quad A\mathbf{x} = \mathbf{b}
```

A = coefficient matrix, x = unknowns, b = right-hand side. Column view: "is b a linear combination of the columns of A?"

### Gaussian elimination (step by step)

**Idea:** use row operations to make the system triangular, then solve from the bottom up. Allowed operations:

1. Swap two rows
2. Multiply a row by a non-zero number
3. Add a multiple of one row to another

These do not change the solution.

**Augmented matrix** \[A | b\]:

```latex
[A \mid \mathbf{b}] = \left(\begin{array}{cc|c} 2 & 1 & 5 \\ 1 & -1 & 1 \end{array}\right)
```

Step 1: R2 <- R2 - (1/2) R1

```latex
\left(\begin{array}{cc|c} 2 & 1 & 5 \\ 1 & -1 & 1 \end{array}\right) \xrightarrow{R_2 \leftarrow R_2 - \frac12 R_1} \left(\begin{array}{cc|c} 2 & 1 & 5 \\ 0 & -\tfrac32 & -\tfrac32 \end{array}\right)
```

Step 2: back substitution

```latex
-\tfrac32\, y = -\tfrac32 \;\Rightarrow\; y = 1, \qquad 2x + 1 = 5 \;\Rightarrow\; x = 2
```

**Check:** 2(2) + 1 = 5 and 2 - 1 = 1. Both hold.

**Reduced row echelon form (Gauss-Jordan):** keep going until the left side is the identity. The right side is then the answer directly.

### Existence and uniqueness of solutions

After elimination, look at the rows:

- **Unique solution:** every variable has a pivot (leading non-zero entry). Example above.
- **No solution (inconsistent):** a row like `[0 0 | 5]` (means 0 = 5, impossible). Geometrically: parallel lines.
- **Infinitely many solutions:** a free variable exists (a column without a pivot) and no contradiction. Geometrically: same line or plane.

Quick test with rank (see 1.8):

```latex
\begin{cases}
\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf{b}]) = n & \Rightarrow \text{unique solution} \\
\operatorname{rank}(A) = \operatorname{rank}([A\mid\mathbf{b}]) < n & \Rightarrow \text{infinitely many solutions} \\
\operatorname{rank}(A) < \operatorname{rank}([A\mid\mathbf{b}]) & \Rightarrow \text{no solution}
\end{cases}
```

(n = number of unknowns.)

### Example with no solution

```latex
\begin{aligned} x + y &= 2 \\ x + y &= 5 \end{aligned}
```

R2 - R1 gives 0 = 3. Impossible, so no solution.

### Common traps

- Apply every row operation to the **whole row including b**.
- Do not divide by zero: swap rows to get a non-zero pivot.
- In AI, real data usually gives **more equations than unknowns** (no exact solution), which is why we need least squares (1.9).

---

## 1.6 Matrix inverse and determinant

### Intuition

The inverse A^-1 is the **undo button** of a matrix. If A rotates by 30 degrees, A^-1 rotates back by 30 degrees.

```latex
AA^{-1} = A^{-1}A = I
```

If A is invertible, Ax = b has the solution x = A^-1 b.

### Determinant (meaning)

For a square matrix, det(A) is the **factor by which A scales area (2D) or volume (3D)**. If det = 0, space gets squashed flat (a plane collapses to a line), information is lost, and you cannot undo it.

### 2 x 2 computation

```latex
A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}, \qquad \det(A) = ad - bc, \qquad A^{-1} = \frac{1}{ad-bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}
```

Memory trick: swap the diagonal entries, flip the signs of the off-diagonal ones, divide by the determinant.

Example: A = \[2 1; 5 3\]

```latex
\begin{aligned}
\det\begin{pmatrix} 2 & 1 \\ 5 & 3 \end{pmatrix} &= 2\cdot3 - 1\cdot5 = 1 \\
A^{-1} &= \frac11\begin{pmatrix} 3 & -1 \\ -5 & 2 \end{pmatrix} = \begin{pmatrix} 3 & -1 \\ -5 & 2 \end{pmatrix} \\
AA^{-1} &= \begin{pmatrix} 2\cdot3+1\cdot(-5) & 2\cdot(-1)+1\cdot2 \\ 5\cdot3+3\cdot(-5) & 5\cdot(-1)+3\cdot2 \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \checkmark
\end{aligned}
```

### 3 x 3 determinant (expand along first row)

```latex
\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & i \end{vmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)
```

Example: det \[1 2 3; 0 1 4; 5 6 0\]

```latex
\begin{aligned}
\begin{vmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & 0 \end{vmatrix} &= 1(1\cdot0 - 4\cdot6) - 2(0\cdot0 - 4\cdot5) + 3(0\cdot6 - 1\cdot5) \\
&= -24 + 40 - 15 = 1
\end{aligned}
```

### When does an inverse exist?

A square matrix A is invertible when ALL of these are true (they are equivalent):

- det(A) != 0
- rank(A) = n (full rank)
- columns are linearly independent
- Ax = 0 has only the solution x = 0
- Ax = b has exactly one solution for every b

Otherwise A is **singular** (no inverse).

### Useful rules

```latex
(AB)^{-1} = B^{-1}A^{-1}, \qquad \det(AB) = \det(A)\det(B), \qquad \det(A^{\mathsf T}) = \det(A)
```

### Common traps

- Only **square** matrices have inverses (and not all of them).
- In practice we avoid computing A^-1 on computers; we solve Ax = b by elimination because it is faster and more accurate.

---

## 1.7 Vector spaces (applied view)

### Intuition

A **vector space** is a collection of vectors where you can add them and scale them and **never leave the collection**. R^2 and R^3 are the standard examples. The rules are just the usual algebra: closure under addition and scalar multiplication, a zero vector, and negatives.

### Subspace

A subspace is a vector space living **inside** a bigger one. A set W inside R^n is a subspace if:

1. It contains the zero vector.
2. u, v in W  =>  u + v in W.
3. c in R, u in W  =>  c\*u in W.

Examples in R^3: a line through the origin, a plane through the origin. A plane that does **not** pass through the origin is NOT a subspace (fails rule 1).

Worked check: W = { (x, y) : y = 2x }. Zero vector (0,0) is in W. (1,2) + (3,6) = (4,8) has 8 = 2*4, so it stays in. c*(1,2) = (c, 2c) stays in. So W is a subspace (a line through the origin).

### Span

The span of vectors v1, ..., vk = **all possible linear combinations** of them.

```latex
\operatorname{span}\{\mathbf{v}_1,\dots,\mathbf{v}_k\} = \{\, c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k : c_1,\dots,c_k \in \mathbb{R} \,\}
```

- span of one non-zero vector in R^2 = a line
- span of two non-parallel vectors in R^2 = the whole plane

To test if b is in the span of the columns of A: check if Ax = b has a solution.

### Linear independence

**Intuition:** vectors are independent if **none of them is redundant**, i.e. none can be built from the others.

Formal test: v1, ..., vk are independent if

```latex
c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k = \mathbf{0} \;\Longrightarrow\; c_1 = c_2 = \dots = c_k = 0
```

Example: (1,2) and (2,4): 2\*(1,2) - 1\*(2,4) = 0 with non-zero coefficients, so **dependent**. Example: (1,0) and (0,1): c1\*(1,0) + c2\*(0,1) = (c1, c2) = 0 means c1 = c2 = 0, so **independent**.

How to test in practice: put vectors as columns of a matrix, row-reduce. If every column has a pivot, they are independent.

Shortcuts: more than n vectors in R^n are always dependent. Any set containing the zero vector is dependent.

### Basis and dimension

A **basis** = a set of vectors that is (1) independent and (2) spans the space. It is the **smallest complete set of directions**: every vector in the space can be written in exactly one way as a combination of basis vectors.

Standard basis of R^3: e1 = (1,0,0), e2 = (0,1,0), e3 = (0,0,1).

**Dimension** = number of vectors in a basis (all bases of a space have the same size). dim R^n = n. A line has dimension 1, a plane has dimension 2.

**Coordinates:** if b = c1*v1 + c2*v2 in basis {v1, v2}, then (c1, c2) are the coordinates of b in that basis.

### AI meaning

If two features are dependent (for example height in cm and height in inches), one is redundant. The independent directions are the real information. PCA finds a better basis for your data.

---

## 1.8 Rank and the column / row space

### Column space and row space

```latex
\begin{aligned}
\operatorname{Col}(A) &= \operatorname{span}\{\text{columns of } A\} = \{A\mathbf{x}\} && \text{(all possible outputs)} \\
\operatorname{Row}(A) &= \operatorname{span}\{\text{rows of } A\}
\end{aligned}
```

Intuition: Col(A) is the set of all b for which Ax = b is solvable.

### Rank

**Rank = number of independent columns = number of pivots after Gaussian elimination = dim Col(A) = dim Row(A).**

Key fact: **row rank = column rank**, always.

Example:

```latex
\begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 3 & 6 & 9 \end{pmatrix} \xrightarrow{\;R_2 \leftarrow R_2 - 2R_1,\; R_3 \leftarrow R_3 - 3R_1\;} \begin{pmatrix} 1 & 2 & 3 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix}, \qquad \operatorname{rank}(A) = 1
```

All rows are multiples of one row, so the data really lives on a line.

### Useful facts

```latex
\begin{aligned}
\operatorname{rank}(A) &\le \min(m,n) && (A \text{ is } m\times n) \\
\text{full rank:}\quad \operatorname{rank}(A) &= \min(m,n) \\
\operatorname{rank}(A) + \dim\operatorname{Null}(A) &= n && \text{(rank–nullity, } n = \text{number of columns)}
\end{aligned}
```

Null space Null(A) = all x with Ax = 0. Example above: n = 3, rank = 1, so dim Null(A) = 2.

### Dimensionality of data

- A dataset with 1000 features but rank 20 really lives in a **20-dimensional** world; the other directions are redundant.
- Low rank = compressible. This is the idea behind PCA, SVD, recommender systems (low-rank user-item matrices) and LoRA fine-tuning.
- Rank deficiency (dependent features) is called **multicollinearity** and makes regression unstable.

### Common traps

- Rank is counted from the pivots, not from the number of non-zero rows before elimination.
- rank(A) = rank(A^T).

---

## 1.9 Orthogonality and orthonormal bases

### Orthogonality

Two vectors are **orthogonal** (perpendicular) when

```latex
\mathbf{u}\cdot\mathbf{v} = 0
```

Example: (1, 2) . (2, -1) = 2 - 2 = 0, so they are orthogonal.

If a vector is orthogonal to every vector in a subspace, it is orthogonal to that subspace.

### Orthonormal basis

Orthogonal + every vector has length 1:

```latex
\mathbf{q}_i\cdot\mathbf{q}_j = 0 \ (i\neq j), \qquad \mathbf{q}_i\cdot\mathbf{q}_i = 1
```

Example: (1/sqrt2, 1/sqrt2) and (1/sqrt2, -1/sqrt2) form an orthonormal basis of R^2.

**Why it is great:**

- Coordinates are just dot products: if b = c1*q1 + c2*q2 then ci = qi . b. No equation-solving needed.
- For a matrix Q with orthonormal columns: **Q^T Q = I**. For a square one, Q^-1 = Q^T (the inverse is free!).
- Rotations keep lengths and angles unchanged.

(Gram-Schmidt turns any basis into an orthonormal one; the idea: subtract from each new vector its projections onto the earlier ones, then normalise.)

### Projection onto a line

Project b onto the direction of a:

```latex
\operatorname{proj}_{\mathbf{a}}(\mathbf{b}) = \frac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{a}\cdot\mathbf{a}}\,\mathbf{a}
```

Example: b = (3, 4), a = (1, 0). a . b = 3, a . a = 1, so proj = 3\*(1,0) = (3, 0). The shadow of b on the x-axis.

The leftover **error** e = b - proj is orthogonal to a.

### Projection onto a subspace

Let the columns of A span the subspace (A has independent columns). Projection of b onto Col(A):

```latex
\begin{aligned}
\hat{\mathbf{x}} &= (A^{\mathsf T}A)^{-1}A^{\mathsf T}\mathbf{b} && \text{(best coefficients)} \\
\mathbf{p} &= A\hat{\mathbf{x}} && \text{(the projection)} \\
P &= A(A^{\mathsf T}A)^{-1}A^{\mathsf T} && \text{(projection matrix)}
\end{aligned}
```

Key property: the error b - p is orthogonal to every column of A, i.e. A^T (b - A x\_hat) = 0.

### Least squares (why projection matters)

Problem: Ax = b has **no exact solution** (more equations than unknowns; b is not in Col(A)). We pick the x that makes Ax **closest** to b, minimising ||Ax - b||^2.

Solution: project b onto Col(A). This gives the **normal equations**:

```latex
A^{\mathsf T}A\,\hat{\mathbf{x}} = A^{\mathsf T}\mathbf{b}
```

**Worked example:** fit a line y = c + d\*t through points (t, y) = (0, 1), (1, 2), (2, 2).

```latex
\begin{aligned}
A &= \begin{pmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{pmatrix}, \quad \mathbf{b} = \begin{pmatrix} 1 \\ 2 \\ 2 \end{pmatrix} \\[6pt]
A^{\mathsf T}A &= \begin{pmatrix} 3 & 3 \\ 3 & 5 \end{pmatrix}, \quad A^{\mathsf T}\mathbf{b} = \begin{pmatrix} 5 \\ 6 \end{pmatrix} \\[6pt]
3c + 3d &= 5, \quad 3c + 5d = 6 \;\Rightarrow\; d = \tfrac12,\ c = \tfrac76
\end{aligned}
```

Best line: y = 7/6 + (1/2) t. Check: predictions = 1.167, 1.667, 2.167; errors = -0.167, 0.333, -0.167. Sum of errors = 0 and errors are orthogonal to the columns of A (sum of errors \* t = 0\*(-0.167) + 1*0.333 + 2*(-0.167) = 0).

### AI meaning

Linear regression **is** least squares: weights w = (X^T X)^-1 X^T y. Training is projecting the target vector onto the space spanned by the features.

---

## 1.10 AI/ML meaning throughout

| Maths idea | What it is in AI |
| --- | --- |
| Vector | One data point (feature vector), an embedding, a weight vector |
| Matrix | A whole dataset X (samples x features), or a layer's weights W |
| Dot product | Similarity, a neuron's weighted sum, attention scores |
| Norm / distance | Error size, k-NN, clustering, regularisation (L1, L2) |
| Cosine similarity | Comparing text/image embeddings, semantic search |
| Matrix multiplication | A forward pass through a layer |
| Linear transformation | What each layer does before the nonlinearity |
| Ax = b | Linear models, systems that must be solved |
| Inverse / determinant | Closed-form solutions, whether a transformation loses information |
| Span, basis | The directions your data actually uses; feature space |
| Rank | True dimensionality of data; low-rank compression (PCA, SVD, LoRA) |
| Orthogonality | Independent features, PCA components, stable numerics |
| Projection / least squares | Linear regression, fitting models to noisy data |

**Why linear algebra is the language of AI:** data = vectors/matrices, models = linear maps plus simple nonlinearities, and learning = solving or approximating equations like Ax = b. GPUs are fast mainly because they multiply matrices fast.

---

## Which formula when? (quick guide)

| I need to... | Use |
| --- | --- |
| Combine features with weights | w . x (dot product) |
| Find length of a vector | sqrt(a . a) |
| Measure how far apart two points are |  |
| Measure similarity ignoring size | (a . b) / ( |
| Check if two vectors are perpendicular | a . b = 0 |
| Apply a transformation | A x |
| Do transformation 1 then 2 | A2 A1 |
| Solve Ax = b | Gaussian elimination |
| Check if a square matrix is invertible | det(A) != 0 |
| Invert a 2x2 matrix | (1/(ad-bc)) \[d -b; -c a\] |
| Check independence | Row-reduce: pivot in every column? |
| Count real dimensions of data | rank(A) |
| Project b on a line | ((a . b)/(a . a)) a |
| Best fit when no exact solution | A^T A x = A^T b |

---

## Quick revision box

- Vector = list of numbers = arrow = data point. Linear combination = c1 v1 + c2 v2 + ...
- a . b = sum of products = ||a|| ||b|| cos(theta). Zero means perpendicular.
- cos\_sim = (a . b) / (||a|| ||b||), between -1 and 1.
- Matrix = dataset or transformation. Columns of A show where basis vectors land.
- (m x n)(n x p) = (m x p). AB != BA. (AB)^T = B^T A^T. (AB)^-1 = B^-1 A^-1.
- Gaussian elimination: row-reduce \[A | b\]. Unique / none / infinite from pivots.
- det = area scale factor. det = 0 means singular, no inverse.
- Subspace: has 0, closed under + and scalar multiples. Span = all combinations. Basis = independent + spanning. Dimension = size of basis.
- Rank = number of pivots = dim Col(A). Rank-nullity: rank + nullity = n.
- Orthonormal: qi . qj = 0, qi . qi = 1, so Q^T Q = I.
- Least squares: A^T A x = A^T b. Error is orthogonal to Col(A).

---

## Common traps (summary)

- Sizes must match before multiplying; AB and BA are different.
- Always apply row operations to the full augmented row.
- Zero determinant means no inverse. Do not divide by it.
- A plane not through the origin is not a subspace.
- A set of vectors containing the zero vector is always dependent.
- Cosine similarity of the zero vector is undefined.
- Normalise features before using distances.

---

## Practice questions

1. Let a = (2, -1, 3), b = (1, 4, 0). Find a . b, ||a||, and cos(theta) between a and b.
2. Compute the distance between (1, 2, 3) and (4, 6, 15).
3. Multiply \[1 2; 0 1\] by \[3 1; 2 4\]. Then check whether AB = BA.
4. Write the 2 x 2 matrix that rotates vectors by 90 degrees. Apply it to (2, 3).
5. Solve by Gaussian elimination: x + 2y + z = 4, 2x + y - z = 1, x - y + 2z = 3.
6. For A = \[4 7; 2 6\], find det(A) and A^-1. Verify A A^-1 = I.
7. Is {(1, 2, 3), (2, 4, 6), (1, 0, 1)} linearly independent? Justify.
8. Find the rank of \[1 2 3; 2 4 6; 1 0 1\] and the dimension of its null space.
9. Check whether W = { (x, y, z) : x + y + z = 0 } is a subspace of R^3 and find a basis.
10. Project b = (2, 3) onto a = (1, 1). Verify the error is orthogonal to a.
11. Fit a line y = c + d\*t to (0, 1), (1, 3), (2, 4) using the normal equations.
12. Explain in 2-3 lines why cosine similarity is preferred over Euclidean distance for text embeddings.

*Answers to check yourself: Q1: a.b = 2 - 4 + 0 = -2; ||a|| = sqrt14. Q2: sqrt(9+16+144) = 13. Q4: \[0 -1; 1 0\], result (-3, 2). Q6: det = 10, inverse = (1/10)\[6 -7; -2 4\]. Q7: dependent (second = 2 x first). Q10: proj = (2.5, 2.5).*