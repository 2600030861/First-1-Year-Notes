# Mathematics for AI – Module 2

## Eigenvalues, SVD & PCA

*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

Module 1 gave us the tools to **store and transform** data. This module asks a different question: **what shape does the data have?**

If a matrix is a machine that reshapes space, a few directions come out still pointing the same way — only longer or shorter. Those are the **eigenvectors**; the stretch factors are the **eigenvalues**. That is the module in one line, and everything below is that idea in different clothes.

Analogy: shine a torch through a lens. Most rays bend, but one passes straight through (the optical axis). Eigenvectors are the un-bent rays of a matrix.

Five questions this module answers:

1. Which directions does a transformation leave alone? -> **eigenvalues and eigenvectors**
2. Can we switch to a basis where a matrix is only "stretch, stretch"? -> **diagonalisation**
3. How do we describe a bowl-shaped surface with a matrix? -> **quadratic forms, positive-definiteness**
4. What if the matrix is not square at all (a data table)? -> **SVD**
5. Which directions carry the real information in my dataset? -> **PCA, dimensionality reduction**

**Prerequisites:** vectors, dot product, matrix multiplication, determinant, inverse, rank, orthogonality, projection, least squares (all Module 1).

---

## 2.1 Eigenvalues and eigenvectors

### Intuition

Stretch a rubber sheet with the origin pinned. Most arrows drawn on it change direction; a few only get longer or shorter and keep pointing the same way. Those are the eigenvectors, and the stretch factor is the eigenvalue — hence the slogan "**the transformation only stretches me**". They are the natural axes of a dataset, of a layer, or of a loss surface: know them and you know how the thing behaves along each independent direction.

### The idea, step by step

**Step 1 – Write the claim as an equation.** "A leaves the direction of v alone but scales it by lambda" is exactly `A v = lambda v` with `v != 0`. `lambda` is a plain number (the eigenvalue). We forbid `v = 0` because `A 0 = lambda 0` is true for every lambda and says nothing.

**Step 2 – Make it solvable.** Bring everything to one side, inserting the identity `I` so that "matrix minus number" makes sense: `A v - lambda v = 0`, i.e. `(A - lambda I)v = 0`.

**Step 3 – Use a Module 1 fact.** This has a non-zero solution only if the matrix is singular, i.e. only if its determinant is zero. That is the **characteristic equation**, `det(A - lambda I) = 0` — for an n x n matrix, a polynomial of degree n in lambda.

**Step 4 – For each lambda, find the vectors.** Substitute back into `(A - lambda I)v = 0` and solve. You always get a whole line (or plane) of answers, so report the simplest non-zero one; that set is the **eigenspace**.

**Step 5 – Check with two free facts.** For an n x n matrix, `sum lambda_i = trace(A)` (sum of diagonal entries) and `prod lambda_i = det(A)`. These catch almost every arithmetic slip, so always use them.

### Worked computation for a 2 x 2 matrix

Take `A = [[4, 1],[2, 3]]`. Form `A - lambda I`, take the determinant, factor:

```latex
\det(A-\lambda I) = (4-\lambda)(3-\lambda) - 2 = 12 - 7\lambda + \lambda^2 - 2 = \lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2)
```

So `lambda1 = 5`, `lambda2 = 2`. Check: trace `= 4+3 = 7 = 5+2` ✓, det `= 12-2 = 10 = 5 x 2` ✓.

Eigenvector for `lambda = 5` — substitute and read the first row: `-x + y = 0`, so `v1 = (1, 1)`. For `lambda = 2`: `2x + y = 0`, so `v2 = (1, -2)`. Verify both (a 5-second check beats a wrong answer):

```latex
A(1,1) = (5,5) = 5(1,1)\ \checkmark \qquad A(1,-2) = (2,-4) = 2(1,-2)\ \checkmark
```

After substituting lambda the two rows always agree (they must — the determinant is 0). That is why only one equation is real, and why the answer is a line, not a point.

### Geometric meaning

`(1,1)` is stretched **5x** — points on that line move away from the origin but stay on it. `(1,-2)` is stretched **2x**, so it still grows, just far less. Every other vector is a mix, so it both turns and stretches. A **negative** eigenvalue flips its direction; an eigenvalue of **0** crushes a direction to nothing, making the matrix singular — the matrix version of "information is lost".

**Model meaning:** eigenvalues of a weight matrix say which input directions a layer amplifies and which it ignores; eigenvectors of a covariance matrix are the natural axes of a dataset (2.5); eigenvalues of the Hessian decide how fast gradient descent moves in each direction (Module 4).

### Tiny Java: eigenvalues of a 2 x 2 matrix

For 2 x 2, the characteristic polynomial is `lambda^2 - t*lambda + d = 0` (`t` = trace, `d` = determinant), so the quadratic formula finishes it.

```java
public class Eigen2x2 {
    public static void main(String[] args) {
        double a = 4, b = 1, c = 2, d = 3;       // matrix [[a, b], [c, d]]
        double t = a + d, det = a * d - b * c;   // trace, determinant
        double disc = t * t - 4 * det;           // discriminant
        if (disc < 0) { System.out.println("complex: no real eigen-directions"); return; }
        double l1 = (t + Math.sqrt(disc)) / 2, l2 = (t - Math.sqrt(disc)) / 2;
        System.out.println("lambda1=" + l1 + " v1=(" + b + "," + (l1 - a) + ")");
        System.out.println("lambda2=" + l2 + " v2=(" + b + "," + (l2 - a) + ")");
    }
}
```

Dry run: `t = 7`, `det = 10`, `disc = 9`, so it prints `lambda1=5.0 v1=(1.0,1.0)` and `lambda2=2.0 v2=(1.0,-2.0)` — what we found by hand. (The eigenvector `(b, lambda - a)` comes from the first row; if `b = 0`, use the second row.)

**Example question:** Find the eigenvalues and eigenvectors of `A = [[6, 2],[2, 3]]`, and say in one line what each eigenvector means.

**Solution:**

Step 1 — characteristic equation (reason: eigenvectors need `det = 0`):

```latex
\det(A-\lambda I) = (6-\lambda)(3-\lambda) - 4 = \lambda^2 - 9\lambda + 14 = (\lambda-7)(\lambda-2)
```

So `lambda1 = 7`, `lambda2 = 2`. Check: trace `= 9 = 7+2` ✓, det `= 14 = 7 x 2` ✓.

Step 2 — eigenvectors (reason: solve `(A - lambda I)v = 0`; the first row is enough): for 7, `-x + 2y = 0` gives `v1 = (2,1)`; for 2, `4x + 2y = 0` gives `v2 = (1,-2)`.

Step 3 — verify: `A(2,1) = (14,7) = 7(2,1)` ✓, `A(1,-2) = (2,-4) = 2(1,-2)` ✓.

Step 4 — meaning: `(2,1)` is stretched 7x, `(1,-2)` is stretched 2x; A is symmetric so they are perpendicular (`(2,1).(1,-2) = 0` ✓).

**Final answer:** `lambda1 = 7` with `v1 = (2,1)`; `lambda2 = 2` with `v2 = (1,-2)`; orthogonal eigen-directions, stretched 7x and 2x.

⚠️ **Common trap:** The two standard slips are sign errors while substituting lambda back, and reporting `v = (0,0)` after "solving" — which means you forgot that one row is a multiple of the other. Always finish with `A v = lambda v`. Also `det(A - lambda I)` and `det(lambda I - A)` differ by a sign and give the **same** eigenvalues.

---

## 2.2 Diagonalisation

### Intuition

Asking for `A^10` and multiplying ten times is miserable. But in the **eigenvector basis** the same matrix becomes diagonal, and a diagonal matrix just stretches each axis independently — so its powers are trivial. Change coordinates, do the easy thing, change back. Analogy: converting rupees to dollars, doing the arithmetic, converting back — the arithmetic is easier because in the new units the problem is diagonal.

### The idea, step by step

**Step 1 – The statement.** If A is n x n with n independent eigenvectors, put them as **columns** of P and the eigenvalues on the diagonal of D:

```latex
A = PDP^{-1}, \qquad D = \operatorname{diag}(\lambda_1,\dots,\lambda_n), \qquad P = [\,\mathbf{v}_1\ |\ \dots\ |\ \mathbf{v}_n\,]
```

Why: column i of `AP` is `A v_i = lambda_i v_i`, which is column i of `PD`. So `AP = PD`, and multiplying by `P^-1` gives the statement.

**Step 2 – When it exists.** Exactly when A has n independent eigenvectors. Safe exam condition: **n distinct eigenvalues** always give n independent ones. If an eigenvalue repeats you may still succeed, or the matrix may be *defective* and no diagonalisation exists.

**Step 3 – Why powers become cheap.** The P's cancel in pairs: `A^2 = (PDP^-1)(PDP^-1) = PD^2P^-1`, and generally `A^k = P D^k P^-1` where `D^k` has `lambda_i^k` on its diagonal.

**Step 4 – Full example** with eigenvalues 5, 2 and eigenvectors `(1,1)`, `(1,-2)`:

```latex
P = \begin{pmatrix} 1 & 1 \\ 1 & -2 \end{pmatrix}, \quad D = \begin{pmatrix} 5 & 0 \\ 0 & 2 \end{pmatrix}, \quad \det P = -3, \quad P^{-1} = \frac{1}{3}\begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix}
```

Check `P P^-1 = I`: row 1 with column 1 gives `(2+1)/3 = 1`, with column 2 gives `(1-1)/3 = 0` ✓. Now `A^2` two ways — directly `[[4,1],[2,3]]^2 = [[18,7],[14,11]]`, and via `P D^2 P^-1` with `D^2 = diag(25,4)`:

```latex
P D^2 P^{-1} = \frac{1}{3}\begin{pmatrix} 25 & 4 \\ 25 & -8 \end{pmatrix}\begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix} = \frac{1}{3}\begin{pmatrix} 54 & 21 \\ 42 & 33 \end{pmatrix} = \begin{pmatrix} 18 & 7 \\ 14 & 11 \end{pmatrix}\ \checkmark
```

For `A^10` the direct route needs nine multiplications; the diagonal route needs `5^10` and `2^10` on a calculator.

**Step 5 – Symmetric matrices: the good case.** If `A = A^T` then (i) all eigenvalues are real and (ii) eigenvectors for different eigenvalues are orthogonal. Proof of (ii) in two lines: if `A u = mu u` and `A v = lambda v`, then `lambda (u.v) = (Au).v = u.(A^T v) = u.(Av) = mu (u.v)`, and `lambda != mu` forces `u.v = 0`. (The middle step moves A to the other side of a dot product.)

Better still, a symmetric matrix diagonalises with an **orthonormal** P, so `P^-1 = P^T` and `A = P D P^T = lambda_1 q1 q1^T + ... + lambda_n qn qn^T`. Each `q q^T` is a projection matrix (Module 1), so a symmetric matrix is a **weighted sum of projections onto perpendicular directions** — the spectral theorem, and exactly the form PCA uses. Example: `A = [[2,1],[1,2]]` gives `lambda = 3, 1` with `(1,1)` and `(1,-1)`, and `(1,1).(1,-1) = 0` ✓.

**Model meaning:** repeated application of a matrix (recurrent layer, Markov chain of user states) is governed by `lambda_max^k`, so the largest eigenvalue dominates and the rest die out — that is why "the top eigenvector" answers so many questions. Covariance matrices are symmetric, so they always diagonalise with orthonormal axes, which is why PCA is numerically pleasant. And a weight matrix with an eigenvalue of magnitude > 1 blows up under repetition (exploding activations); < 1 and it vanishes.

**Example question:** For `A = [[2, 1],[1, 2]]`, write `A = P D P^T` with P orthogonal, and use it to find `A^3`.

**Solution:**

Step 1 — eigenvalues: `(2-lambda)^2 - 1 = 0` gives `2 - lambda = ±1`, so `lambda1 = 3`, `lambda2 = 1`.

Step 2 — eigenvectors: for 3, `-x + y = 0` so `v1 = (1,1)`; for 1, `x + y = 0` so `v2 = (1,-1)`. Normalise them, so that `P^-1 = P^T`:

```latex
P = \frac{1}{\sqrt2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}, \qquad D = \begin{pmatrix} 3 & 0 \\ 0 & 1 \end{pmatrix}
```

Step 3 — powers: `D^3 = diag(27,1)`, so

```latex
A^3 = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} 27 & 0 \\ 0 & 1 \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} = \frac{1}{2}\begin{pmatrix} 27 & 1 \\ 27 & -1 \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} = \frac{1}{2}\begin{pmatrix} 28 & 26 \\ 26 & 28 \end{pmatrix} = \begin{pmatrix} 14 & 13 \\ 13 & 14 \end{pmatrix}
```

Step 4 — verify with `A^2 A`: `A^2 = [[5,4],[4,5]]`, and `[[5,4],[4,5]][[2,1],[1,2]] = [[14,13],[13,14]]` ✓.

**Final answer:** `P = (1/sqrt2)[[1,1],[1,-1]]`, `D = diag(3,1)`, `A^3 = [[14,13],[13,14]]`.

⚠️ **Common trap:** Eigenvectors go in as **columns**, and eigenvalues must be in the **same order** — swap them and everything is wrong. `P^-1` sits on the **right** (`A = P^-1 D P` is a different, false statement). And independence is essential: `[[2,1],[0,2]]` has only the eigenvector `(1,0)`, so it **cannot** be diagonalised however hard you try.

---

## 2.3 Quadratic forms and positive-definiteness

### Intuition

A quadratic form is what you get by feeding a vector into a matrix **twice**: `x^T A x`. In 2-D it is the school expression `ax^2 + bxy + cy^2`, and its point is **shape** — bowl (one lowest point), dome (one highest point), or saddle (low one way, high the other). That is not a detail: it is the geometry of training. Bowl, and gradient descent rolls to the bottom and stops; saddle, and training stalls or wanders. So "is this quadratic form positive everywhere?" really asks "**is this loss nicely shaped?**"

Analogy: a marble on a surface. Bowl = it settles. Dome = it rolls off. Saddle = it slides one way while climbing another, like a mountain pass.

### The idea, step by step

**Step 1 – Definition.** For symmetric A, `Q(x) = x^T A x`; in 2-D with `A = [[a, b],[b, c]]` it is `Q(x,y) = ax^2 + 2bxy + cy^2`. We always take A symmetric because only the symmetric part survives the double sum. Note the **2b** — that is where most marks are lost.

**Step 2 – The classification.**

| Name | Condition | Shape |
| --- | --- | --- |
| positive definite (PD) | `x^T A x > 0` for all `x != 0` | bowl opening up, unique minimum |
| positive semidefinite (PSD) | `x^T A x >= 0` | bowl with a flat valley |
| negative definite | `x^T A x < 0` for all `x != 0` | dome, unique maximum |
| indefinite | takes both signs | saddle |

**Step 3 – The eigenvalue test (the honest one).** Write x in the orthonormal eigenbasis, `x = c1 q1 + ... + cn qn`. Then `Q = lambda1 c1^2 + ... + lambda_n cn^2`, so along each eigen-direction the surface behaves like `lambda_i` times a square. Hence PD iff all `lambda_i > 0`, and indefinite iff some are positive and some negative.

**Step 4 – The leading-minor test (the fast one).** The top-left square sub-determinants are `Delta1 = a11`, `Delta2 = det` of the top-left 2 x 2, ..., `Delta_n = det(A)`. Sylvester's criterion: A is PD exactly when **all** are strictly positive. For 2 x 2 this is short enough to memorise: `A = [[a,b],[b,c]]` is PD iff `a > 0` and `ac - b^2 > 0`.

**Step 5 – Worked example.** `Q = 5x^2 + 4xy + 2y^2`. Matching `ax^2 + 2bxy + cy^2`: `a = 5`, `2b = 4` so `b = 2`, `c = 2`. Then `A = [[5,2],[2,2]]`, `Delta1 = 5 > 0`, `Delta2 = 10 - 4 = 6 > 0`, so PD. Cross-check: `det(A - lambda I) = (5-lambda)(2-lambda) - 4 = lambda^2 - 7lambda + 6`, giving `lambda = 6, 1`, both positive ✓, and indeed `Q = 6c1^2 + c2^2`.

**Step 6 – A saddle.** `Q = x^2 + 4xy + y^2` gives `A = [[1,2],[2,1]]`: `Delta1 = 1 > 0` but `Delta2 = 1 - 4 = -3 < 0`, so not PD. Eigenvalues: `(1-lambda)^2 - 4 = 0` gives `3` and `-1` — one of each sign, so **indefinite**. Confirm by hand: `Q(1,0) = 1 > 0` but `Q(1,-1) = 1 - 4 + 1 = -2 < 0`. Both signs appear — a saddle.

**Why it appears in optimisation (Module 4 preview).** Near a critical point `w0` (gradient zero), a Taylor expansion (3.8) gives `L(w0 + d) ≈ L(w0) + g.d + (1/2) d^T H d`, where `g = 0` and H is the Hessian (3.7). So **the loss near a critical point is a quadratic form with matrix H**: PD means a local minimum (bowl) where gradient descent converges, negative definite means a maximum, indefinite means a **saddle** — which is why "gradient = 0" alone does not mean "good model". The eigenvalue *ratio* also sets the speed: a big ratio gives a long narrow valley and slow zig-zagging, and that ratio is the condition number (2.9).

**Example question:** For `Q(x,y) = 2x^2 + 6xy + 5y^2`, write it as `x^T A x`, decide whether it is positive definite, and describe the surface.

**Solution:**

Step 1 — read off the matrix (reason: the cross coefficient is `2b`): `2b = 6` so `b = 3`, `a = 2`, `c = 5`, hence `A = [[2,3],[3,5]]`.

Step 2 — expand to check: `2x^2 + 3xy + 3xy + 5y^2 = 2x^2 + 6xy + 5y^2` ✓.

Step 3 — leading minors: `Delta1 = 2 > 0`, `Delta2 = 10 - 9 = 1 > 0`, so PD.

Step 4 — eigenvalue cross-check (the two tests must agree): `det(A - lambda I) = (2-lambda)(5-lambda) - 9 = lambda^2 - 7lambda + 1`, so

```latex
\lambda = \frac{7 \pm \sqrt{45}}{2} \approx 6.854 \text{ and } 0.146 \qquad (\text{sum } 7 = \text{trace},\ \text{product } 1 = \det)\ \checkmark
```

Step 5 — shape: `Q ≈ 6.854 c1^2 + 0.146 c2^2` — a bowl about 47 times steeper in one direction, i.e. a long narrow valley.

**Final answer:** `A = [[2,3],[3,5]]`, positive definite (`Delta1 = 2`, `Delta2 = 1`, eigenvalues ≈ 6.854 and 0.146). The surface is an upward bowl, very steep along `q1` and almost flat along `q2`.

⚠️ **Common trap:** Two killers. (1) Putting the cross coefficient straight on the off-diagonal: `6xy` means off-diagonal **3**. (2) Testing only `det(A) > 0`: `[[-1,0],[0,-1]]` has det `= 1 > 0` yet is negative definite, so you also need `Delta1 > 0`. And `Delta2 = 0` means **semidefinite** (flat direction), not definite.

---

## 2.4 Singular Value Decomposition (SVD)

### Intuition

Eigenvectors only exist for **square** matrices, and a dataset is usually a rectangle (1000 students x 20 features). SVD works for **every** matrix. The picture: any matrix does exactly three simple things in a row — **rotate** the input (V^T), **stretch along the axes** by positive numbers (S), **rotate** the result (U). "Rotate, stretch, rotate." A matrix cannot shear, twist, or do anything cleverer. This is arguably the most useful theorem in applied mathematics, and it is why compression, recommendation and PCA all come back to it.

Analogy: any journey described as "turn to face north, walk a distance, turn again". Know the two turns and the distances and you know the whole journey.

### The idea, step by step

**Step 1 – The statement.** For any m x n matrix A there are orthogonal U (m x m), orthogonal V (n x n) and a rectangular "diagonal" S (m x n) with non-negative entries, such that

```latex
A = USV^{\mathsf T}, \qquad S = \operatorname{diag}(\sigma_1,\dots,\sigma_r), \qquad \sigma_1 \ge \sigma_2 \ge \dots \ge 0
```

The `sigma_i` are **singular values** (always real, always `>= 0`); columns of U are **left** singular vectors (directions in the output space), columns of V are **right** singular vectors (directions in the input space).

**Step 2 – Where the numbers come from.** Multiply `A = USV^T` by its transpose and use `U^T U = I`:

```latex
A^{\mathsf T}A = VS^{\mathsf T}U^{\mathsf T}USV^{\mathsf T} = V(S^{\mathsf T}S)V^{\mathsf T} \;\Longrightarrow\; \sigma_i^2 = \operatorname{eig}(A^{\mathsf T}A), \quad V = \operatorname{eigvec}(A^{\mathsf T}A)
```

Similarly `AA^T = U(SS^T)U^T` gives U. In practice: eigen-decompose the small square matrix `A^T A`, take square roots for the singular values, then get U from `u_i = A v_i / sigma_i`.

**Step 3 – Geometry.** `v_i` is a direction in the input space, `u_i` is where it lands, `sigma_i` is how much it stretches. The unit circle maps to an **ellipse** with semi-axes `sigma1`, `sigma2` along `u1`, `u2` — that sentence is the whole geometric content of SVD. A zero singular value means that direction is **crushed to nothing**, so `rank(A) =` the number of non-zero singular values.

**Step 4 – Full worked example.** Take `A = [[3, 0],[4, 5]]`.

*Form `A^T A`* (its eigenvectors give V):

```latex
A^{\mathsf T}A = \begin{pmatrix} 3 & 4 \\ 0 & 5 \end{pmatrix}\begin{pmatrix} 3 & 0 \\ 4 & 5 \end{pmatrix} = \begin{pmatrix} 25 & 20 \\ 20 & 25 \end{pmatrix}
```

*Eigenvalues* — `(25-lambda)^2 - 400 = 0` gives `25 - lambda = ±20`, so `lambda = 45, 5` (check: trace 50, det 225). Hence

```latex
\sigma_1 = \sqrt{45} = 3\sqrt5 \approx 6.708, \qquad \sigma_2 = \sqrt5 \approx 2.236
```

*Right singular vectors* — for 45, `-20x + 20y = 0` gives `x = y`; for 5, `20x + 20y = 0` gives `y = -x`:

```latex
V = \frac{1}{\sqrt2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}
```

*Left singular vectors* from `A v_i = sigma_i u_i`:

```latex
A\mathbf{v}_1 = \frac{1}{\sqrt2}\begin{pmatrix} 3 \\ 9 \end{pmatrix} \Rightarrow \mathbf{u}_1 = \frac{1}{\sqrt{10}}\begin{pmatrix} 1 \\ 3 \end{pmatrix}, \qquad A\mathbf{v}_2 = \frac{1}{\sqrt2}\begin{pmatrix} 3 \\ -1 \end{pmatrix} \Rightarrow \mathbf{u}_2 = \frac{1}{\sqrt{10}}\begin{pmatrix} 3 \\ -1 \end{pmatrix}
```

Check: `(1+9)/10 = 1` ✓, `(9+1)/10 = 1` ✓, `u1.u2 = (3-3)/10 = 0` ✓. Now assemble and verify:

```latex
U = \frac{1}{\sqrt{10}}\begin{pmatrix} 1 & 3 \\ 3 & -1 \end{pmatrix}, \quad S = \begin{pmatrix} 3\sqrt5 & 0 \\ 0 & \sqrt5 \end{pmatrix}, \quad US = \frac{1}{\sqrt{10}}\begin{pmatrix} 3\sqrt5 & 3\sqrt5 \\ 9\sqrt5 & -\sqrt5 \end{pmatrix}
```

Entry (1,1) `= 6sqrt5/(2sqrt5) = 3` ✓, (1,2) `= 0` ✓, (2,1) `= 8sqrt5/(2sqrt5) = 4` ✓, (2,2) `= 10sqrt5/(2sqrt5) = 5` ✓. So `USV^T = [[3,0],[4,5]] = A` ✓ and `rank = 2`.

**Step 5 – Low-rank approximation (the payoff).** Keep only the biggest singular value:

```latex
A_1 = \sigma_1\mathbf{u}_1\mathbf{v}_1^{\mathsf T} = \frac{3\sqrt5}{\sqrt{10}\sqrt2}\begin{pmatrix} 1 \\ 3 \end{pmatrix}\begin{pmatrix} 1 & 1 \end{pmatrix} = 1.5\begin{pmatrix} 1 & 1 \\ 3 & 3 \end{pmatrix} = \begin{pmatrix} 1.5 & 1.5 \\ 4.5 & 4.5 \end{pmatrix}
```

The error is `A - A1 = [[1.5,-1.5],[-0.5,0.5]]`, with Frobenius norm `sqrt(2.25+2.25+0.25+0.25) = sqrt5 = sigma2`. Not a coincidence — **Eckart-Young** says the best rank-k approximation zeroes all but the k largest singular values, and the error is `||A - Ak||_F = sqrt(sigma_{k+1}^2 + ... + sigma_r^2)`.

Here 4 numbers became 2 + 2 + 1 = 5, so compression is pointless at this size. For a 1000 x 1000 image with 20 meaningful singular values it is decisive: `20 x (1000+1000+1) ≈ 40,000` numbers instead of 1,000,000 — 96% saved, picture still fine.

**Model meaning:** compression (images, weight matrices, low-rank fine-tuning adapters); rank reveals real dimension, since a non-negligible `sigma20` means your "1000-feature" data really lives in 20 dimensions (2.6); denoising, because small singular values usually carry noise; embeddings, since "king - man + woman ≈ queen" comes from the top singular directions of a word co-occurrence matrix; and conditioning, since `sigma_max/sigma_min` is the condition number (2.9).

**Example question:** Find the SVD of `A = [[2, 0],[0, -3]]`, state its rank, and explain in one line why U is not the identity.

**Solution:**

Step 1 — `A^T A = diag(4,9)` (A is diagonal), so the eigenvalues are 9 and 4 and

```latex
\sigma_1 = 3, \qquad \sigma_2 = 2
```

Step 2 — right singular vectors, ordered to match `sigma1 >= sigma2`: `sigma1 = 3` goes with `e2 = (0,1)` and `sigma2 = 2` with `e1 = (1,0)`, so `V = [[0,1],[1,0]]`.

Step 3 — left singular vectors from `u_i = A v_i / sigma_i`: `u1 = (1/3)A(0,1)^T = (0,-1)^T` and `u2 = (1/2)A(1,0)^T = (1,0)^T`.

Step 4 — verify (signs are where people slip):

```latex
USV^{\mathsf T} = \begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}\begin{pmatrix} 3 & 0 \\ 0 & 2 \end{pmatrix}\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 2 \\ -3 & 0 \end{pmatrix}\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 2 & 0 \\ 0 & -3 \end{pmatrix}\ \checkmark
```

**Final answer:** `sigma1 = 3`, `sigma2 = 2`, `U = [[0,1],[-1,0]]`, `S = diag(3,2)`, `V = [[0,1],[1,0]]`; rank 2. U is not the identity because singular values must be **positive** — the negative eigenvalue `-3` is absorbed as a sign flip inside U.

⚠️ **Common trap:** Never call the eigenvalues of A the singular values. Here A has eigenvalues 2 and -3, but the singular values are 3 and 2 — always `>= 0`, always from `A^T A`. Also sort `sigma` descending (else U, S, V misalign and the product fails), and put `V^T`, not V, on the right.

---

## 2.5 Principal Component Analysis (PCA)

### Intuition

You have 20 features per student, but some move together (study hours and marks). The data is not really 20-dimensional — it is maybe 3-dimensional plus redundancy and noise. PCA finds the few directions along which the data actually spreads, and re-expresses every point using only those.

Analogy: photographing a long thin pencil. End-on it is a dot — everything lost; side-on it is a line — everything kept. PCA searches for the **best camera angle**: the direction where the data looks most spread out. "Most spread out" is measured by **variance**, which is why variance and covariance come first.

### The idea, step by step

**Step 1 – Variance.** For one feature with mean `x_bar`: `Var(x) = (1/n) sum (x_i - x_bar)^2` — the average squared distance from the mean. Big variance means the feature carries real differences; zero variance means a constant column, i.e. useless.

**Step 2 – Covariance.** `Cov(x,y) = (1/n) sum (x_i - x_bar)(y_i - y_bar)` — do they rise and fall together? Positive means yes, zero means unrelated, and a feature's covariance with itself is its variance. (Module 5 does this properly; here we only need the formula.)

**Step 3 – The covariance matrix.** For d features, C is d x d with `C_ij = Cov(i,j)`. In matrix form, with `X_c` the data after subtracting column means, `C = (1/n) X_c^T X_c`. C is symmetric, so (2.2) it has real eigenvalues and orthogonal eigenvectors. Its diagonal holds variances, its off-diagonal holds covariances.

**Step 4 – Standardise first.** If one feature is "salary in lakhs" (~10) and another "years of experience" (~3), the big-scale feature dominates the variance purely through its units. So divide each feature by its standard deviation: `z_i = (x_i - x_bar)/s_x`. Then every feature has variance 1 and C becomes the **correlation matrix** (diagonal of 1s). Rule of thumb: standardise when units differ or you care about *relative* importance; do not standardise when units match and you want the true scale of variation.

**Step 5 – Why eigen/SVD finds the best directions.** We want a unit `w` maximising the variance of the projections, `Var(X_c w) = (1/n)||X_c w||^2 = w^T ((1/n)X_c^T X_c) w = w^T C w` with `||w|| = 1`. That is a quadratic form (2.3) maximised on the unit circle, and the answer is the **top eigenvector of C**, with the maximum value being the top eigenvalue. The next direction must be orthogonal to the first, so it is the second eigenvector, and so on: **components = eigenvectors of C, variance captured = eigenvalues of C**. Equivalently, if `X_c = U S V^T` then `C = V(S^2/n)V^T`, so V holds the components and `lambda_i = sigma_i^2/n` — same answer, better numerics.

**Step 6 – The algorithm on a tiny dataset.** Four points, two features:

```latex
X = \begin{pmatrix} 1 & 1 \\ 2 & 3 \\ 3 & 2 \\ 4 & 4 \end{pmatrix}
```

*Means:* column 1 `= 10/4 = 2.5`, column 2 `= 10/4 = 2.5`. *Centre:*

```latex
X_c = \begin{pmatrix} -1.5 & -1.5 \\ -0.5 & 0.5 \\ 0.5 & -0.5 \\ 1.5 & 1.5 \end{pmatrix}
```

*Covariance* `C = (1/4)X_c^T X_c`: column 1 squared sums to `2.25+0.25+0.25+2.25 = 5`, column 2 likewise 5, and the cross products give `2.25 - 0.25 - 0.25 + 2.25 = 4`, so

```latex
C = \frac{1}{4}\begin{pmatrix} 5 & 4 \\ 4 & 5 \end{pmatrix} = \begin{pmatrix} 1.25 & 1.0 \\ 1.0 & 1.25 \end{pmatrix}
```

*Eigenvalues:* `(1.25-lambda)^2 - 1 = 0` gives `1.25 - lambda = ±1`, so `lambda1 = 2.25`, `lambda2 = 0.25` (check: trace 2.5, det 0.5625). *Eigenvectors:* for 2.25, `-x + y = 0` so `w1 = (1,1)/sqrt2`; for 0.25, `x + y = 0` so `w2 = (1,-1)/sqrt2`. Hence **PC1 = (0.707, 0.707)** with variance 2.25, and **PC2 = (0.707, -0.707)** with variance 0.25.

*Explained variance ratio:* `EVR1 = 2.25/2.5 = 90%`, `EVR2 = 10%`.

*Scores* — dot each centred point with PC1: `(-1.5,-1.5)` gives `-2.121`, `(-0.5,0.5)` gives 0, `(0.5,-0.5)` gives 0, `(1.5,1.5)` gives `2.121`. So four students become `-2.121, 0, 0, 2.121`. Check: mean 0, sum of squares `9`, divided by 4 gives `2.25 = lambda1` ✓.

That is all of PCA: **centre, covariance, eigenvalues, sort, project.** Two numbers per point became one, keeping 90% of the spread.

*The standardised variant:* each standard deviation is `sqrt(1.25) ≈ 1.118`, so the correlation matrix is `C/1.25 = [[1, 0.8],[0.8, 1]]` with eigenvalues 1.8 and 0.2 — still a 90/10 split, because both features happened to have equal variance. With unequal scales the answer would change, which is exactly why standardising matters.

**Model meaning:** PCA is **unsupervised** (it never looks at labels); each component is a *combination* of features and its weights say which features matter — here `w1 = (0.707,0.707)` means "both features equally, same direction", a general-size factor; it gives **decorrelated** features, which helps models that dislike correlated inputs; and it is a standard first step before clustering, 2-D visualisation and speed-up.

**Example question:** A centred 3-feature dataset has covariance matrix `C = [[4,2,0],[2,4,0],[0,0,1]]`. Find the components, the explained-variance ratios, and how many components keep at least 85% of the variance.

**Solution:**

Step 1 — spot the block structure (reason: feature 3 is uncorrelated with the others, so it is its own component): `C = [[B,0],[0,1]]` with `B = [[4,2],[2,4]]`.

Step 2 — eigenvalues of B: `(4-lambda)^2 - 4 = 0` gives `4 - lambda = ±2`, so `lambda = 6, 2`; hence C has eigenvalues `6, 2, 1`. Check trace `4+4+1 = 9 = 6+2+1` ✓.

Step 3 — eigenvectors: for 6, `-2x + 2y = 0` gives `(1,1,0)/sqrt2`; for 2, `2x + 2y = 0` gives `(1,-1,0)/sqrt2`; for 1, the third axis `(0,0,1)`.

Step 4 — total variance `9`, so the ratios are `6/9 = 66.7%`, `2/9 = 22.2%`, `1/9 = 11.1%`; cumulative `66.7%, 88.9%, 100%`, so **2 components** clear 85%.

**Final answer:** components `(1,1,0)/sqrt2`, `(1,-1,0)/sqrt2`, `(0,0,1)` with variances 6, 2, 1; EVR 66.7%, 22.2%, 11.1%; keep 2 components (88.9% kept, 11.1% lost).

⚠️ **Common trap:** Forgetting to **centre** first — then your "variance" is about the origin and PC1 merely points at the mean, a wrong answer that still looks plausible. Second: reporting "variance = 9" instead of 2.25 because you used the eigenvalues of `X^T X` without dividing by n. Third: marking `w1 = -(0.707,0.707)` wrong — eigenvectors are defined up to sign, so both are correct.

---

## 2.6 Dimensionality reduction

### Intuition

Why can high-dimensional data be compressed at all? Because real data does not fill its feature space — it lies on a **thin sheet** inside it. Faces are 1000 x 1000 pixels, yet the set of all faces is governed by a handful of factors: pose, lighting, expression, identity. You do not need a million numbers to describe a face.

Analogy: a train timetable has three columns (train, station, time) but the real structure is one route with stops — most of the table is predictable from little information. Redundancy is compressible.

### The idea, step by step

**Step 1 – What is preserved.** PCA keeps the **largest-variance** directions and preserves distances in the projected space as well as any linear method can. The squared reconstruction error equals the variance thrown away — Eckart-Young in data language: `error^2 = sum of the discarded lambda_i`.

**Step 2 – What is lost.** The small wiggles, the noise, and possibly genuine but small signal. Also lost: **interpretability** (a component is a mixture of features, not a feature) and **label-relevant structure** — PCA does not know your target, so a low-variance feature that perfectly predicts the label gets discarded. Examiners like this point.

**Step 3 – The numbers.** `EVR_i = lambda_i / (lambda_1 + ... + lambda_d)`, and `cumulative_k` is the same sum restricted to the first k, divided by the total. Pick the smallest k above your threshold (0.90 or 0.95 is usual). Our 2-D example: 1 component keeps 90%. The 3-feature example: 2 components keep 88.9%.

**Step 4 – Reading it as compression.** Original `n x d` numbers; after PCA with k components, `n x k` scores plus `d x k` weights. For `n = 10,000`, `d = 100`, `k = 5`: 1,000,000 numbers become 50,000 + 500 — about 5%. In our 2-D example, k = 1 keeps 90% of the variance in half the storage, while k = 2 keeps 100% and saves nothing.

**Model meaning:** fewer inputs means smaller weight matrices and faster training; dropping noise directions is a form of regularisation; projecting to 2-D lets you *see* clusters, the most common first-project use. One caution: do PCA **inside** cross-validation folds, not before splitting, or test information leaks into the components and accuracy looks better than it is.

**Example question:** A dataset has covariance eigenvalues `[5, 3, 1.5, 0.4, 0.1]`. Compute the explained variance ratios and the number of components needed for 90%. State one thing preserved and one thing lost.

**Solution:**

Step 1 — total variance (sum of eigenvalues): `5 + 3 + 1.5 + 0.4 + 0.1 = 10`.

Step 2 — individual ratios: `50%, 30%, 15%, 4%, 1%`.

Step 3 — cumulative: `50%, 80%, 95%, 99%, 100%`. The first value reaching 90% is at k = 3 (95%); k = 2 gives only 80%, which fails.

Step 4 — preserved: 95% of the total spread and the relative distances in that 3-D subspace. Lost: the 5% of variance in the two smallest directions (mostly the 0.1 direction, likely noise, plus 0.4 which may hold small real structure).

**Final answer:** EVR `50%, 30%, 15%, 4%, 1%`; cumulative `50/80/95/99/100%`; keep **k = 3** (95%). Preserved: 95% of variance and the main geometry. Lost: 5% of variance plus feature interpretability.

⚠️ **Common trap:** Saying "5 features reduced to 3, so we lost 40% of the information". You lost **5% of the variance**, and variance is not information in the label sense. Also watch the denominator (the sum, not `lambda1`), and never fit PCA on the full dataset before the train/test split.

---

## 2.7 Matrix factorisation as a recurring AI idea

### Intuition

A big matrix with simple hidden structure can be written as the product of two thin matrices. Once you see it, you see it everywhere: `A = PDP^-1`, `A = USV^T`, and now `R ≈ PQ^T`. The thin factors are smaller, denser and **meaningful** — they reveal the latent variables that generated the data.

Analogy: 60 students x 5 subjects looks complicated, but it may be driven by two hidden factors, "quantitative" and "verbal". Then each student is 2 numbers, each subject is 2 numbers, and the mark is a dot product: 300 numbers become 120 + 10.

### The idea, step by step

**Step 1 – The shape.** For an m x n matrix R and a chosen rank k, `R ≈ P Q^T` with `P` (m x k) and `Q` (n x k), and each predicted entry is a dot product, `r_ij = p_i . q_j`.

**Step 2 – Recommendation: users x items.** Rows are users, columns are movies, entries are ratings (mostly missing, since nobody rates everything). The low-rank assumption says tastes are driven by a few hidden factors. Filling in missing entries is then prediction, and it comes free from the factorisation.

**Step 3 – A tiny numeric example.** Two latent factors, "action" and "romance":

```latex
P = \begin{pmatrix} 3 & 1 \\ 2 & 1 \\ 1 & 3 \\ 0 & 3 \\ 1 & 2 \end{pmatrix}, \qquad Q = \begin{pmatrix} 2 & 0 \\ 1 & 1 \\ 0 & 2 \\ 1 & 0 \end{pmatrix}
```

Row 1 of `R = PQ^T`: `(3,1).(2,0) = 6`, `(3,1).(1,1) = 4`, `(3,1).(0,2) = 2`, `(3,1).(1,0) = 3`. Doing all five rows:

```latex
R = \begin{pmatrix} 6 & 4 & 2 & 3 \\ 4 & 3 & 2 & 2 \\ 2 & 4 & 6 & 1 \\ 0 & 3 & 6 & 0 \\ 2 & 3 & 4 & 1 \end{pmatrix}
```

Read as ratings on a 0-6 scale: user 4 `= (0,3)` is a pure romance fan, predicted 0, 3, 6, 0 — loves item 3, indifferent to 1 and 4. User 1 `= (3,1)` is mostly action: 6, 4, 2, 3. The structure is obvious **because** the matrix has rank 2. Recommendation step: if user 5 has not rated item 3, predict `(1,2).(0,2) = 4` and suggest it — the whole idea of matrix-factorisation recommenders, using nothing beyond Module 1's dot product. Storage: 20 numbers here become 18, no win, but at 1,000,000 users x 20,000 items with k = 50 it is 1,050,000 numbers instead of 20 billion.

**Step 4 – Finding P and Q in practice.** Minimise the squared error on the **observed** entries only, with a penalty so the factors do not blow up: `min over P,Q of sum over observed (i,j) of (r_ij - p_i.q_j)^2 + mu(||P||^2 + ||Q||^2)`. The second term is regularisation (Module 4, section 4.8). It is solved by gradient descent or alternating least squares. Notice the shape of the problem — **a loss plus parameters** — which Module 3 formalises.

**Step 5 – Embeddings as factorisation.** A word-context co-occurrence matrix is huge and sparse; factorising it gives each word a short dense vector, an **embedding**. The geometry of the factors then encodes meaning, because similar words had similar co-occurrence patterns. Modern methods change the objective, but the shape (`big matrix ≈ thin x thin`) is the same.

| Setting | Big matrix | Thin factors mean |
| --- | --- | --- |
| Recommendation | users x items | latent taste profiles |
| Embeddings | words x contexts | latent semantic dimensions |
| Compression | image / weight matrix | dominant directions (SVD) |
| Topic models | documents x words | latent topics |
| Fine-tuning | weight update | low-rank adapter |

Recurring lesson: **if a matrix is approximately low rank, a few latent numbers explain it, and those numbers are usually the interesting thing.**

**Example question:** A rating matrix is modelled with k = 2 factors, `P = [[2,1],[1,3],[3,1]]` for three users and `Q = [[1,2],[2,1]]` for two items. Write out the predicted matrix, give `r_23`, and state its rank.

**Solution:**

Step 1 — rule: `r_ij = p_i . q_j`.

Step 2 — compute every entry. User 1: `(2,1).(1,2) = 4`, `(2,1).(2,1) = 5`. User 2: `(1,3).(1,2) = 7`, `(1,3).(2,1) = 5`. User 3: `(3,1).(1,2) = 5`, `(3,1).(2,1) = 7`. So

```latex
\hat{R} = PQ^{\mathsf T} = \begin{pmatrix} 2 & 1 \\ 1 & 3 \\ 3 & 1 \end{pmatrix}\begin{pmatrix} 1 & 2 \\ 2 & 1 \end{pmatrix} = \begin{pmatrix} 4 & 5 \\ 7 & 5 \\ 5 & 7 \end{pmatrix}
```

Step 3 — read off the missing entry: `r_23 = 5`.

Step 4 — rank: R is a 3x2 times a 2x2, so `rank <= 2`; rows 1 and 2 are not multiples of each other (`(4,5)` vs `(7,5)`), so the rank is exactly 2 — not 1, because k = 2 gives two independent latent directions.

**Final answer:** `R = [[4,5],[7,5],[5,7]]`, `r_23 = 5`, rank 2 (= k).

⚠️ **Common trap:** Saying "rank 1" whenever you use latent factors — with k factors the rank is **k**. Second: putting missing entries into the loss as if a missing rating were a rating of 0 (missing means *unknown*, not *disliked*). Third: skipping the regularisation term, so factors blow up and predictions go wild outside the observed set.

---

## 2.8 Numerical reality

### Intuition

Everything above used tidy numbers chosen so the arithmetic works. Real matrices are 50,000 x 50,000 with entries like 0.0371826, and nobody solves a degree-50,000 polynomial. Hand computation gives way to algorithms — not because the mathematics changes, but because it must be reorganised to survive floating point. This section is awareness, not technique.

### The idea, step by step

**Step 1 – Never build the characteristic polynomial.** Expanding `det(A - lambda I)` at large n is numerically catastrophic: rounding errors in the coefficients become huge errors in the roots. Libraries use iterative methods instead.

**Step 2 – Power iteration (the simplest idea that works).** Repeatedly multiply and renormalise: `x_{k+1} = A x_k / ||A x_k||`. Why it works: write the start vector in the eigenbasis, `x0 = c1 q1 + c2 q2 + ...`. Each multiplication scales the `q_i` part by `lambda_i`, so after k steps the `q1` share is `(lambda1/lambda2)^k` times everything else — it takes over. The direction converges to the top eigenvector and the scaling factor to `lambda1`. It fails when `|lambda1| = |lambda2|` (no clear winner).

**Step 3 – A three-iteration dry run** on `A = [[2,1],[1,2]]` (true top eigenvalue 3, top eigenvector `(0.707,0.707)`), starting at `x0 = (1,0)`: iteration 1 gives `A x = (2, 1)` with norm 2.2361, so `u1 = (0.8944, 0.4472)` and the Rayleigh estimate is 2.6000; iteration 2 gives `(2.2361, 1.7889)`, norm 2.8636, `u2 = (0.7809, 0.6247)`, estimate 2.8824; iteration 3 gives `(2.1864, 2.0303)`, norm 2.9837, `u3 = (0.7328, 0.6805)`, estimate 2.9974.

The Rayleigh estimate is `u^T A u` — the quadratic form of 2.3 at the current unit vector — and it converges to the eigenvalue. After three iterations it reads 2.9974 and the direction `(0.733, 0.681)` is visibly heading to `(0.707, 0.707)`. Large matrices need a few dozen iterations, each one a matrix-vector product, which is exactly what a GPU does well.

**Step 4 – What libraries do.** Eigen-decomposition: QR iteration, or divide-and-conquer for symmetric matrices. SVD: bidiagonalisation plus implicit QR, or randomised SVD (project onto a small random subspace first) for very large matrices. All of them rest on **orthogonal transformations**, because orthogonal matrices preserve lengths and therefore do not amplify rounding error — the central design principle of numerical linear algebra.

**Step 5 – What this means in practice.** Use a library (NumPy's linear-algebra routines, or any ML framework): decades of tuning, against which a hand-written loop will be slower and less accurate. Expect **ordering** and **sign** differences, since eigenvectors are defined up to sign and repeated eigenvalues can come back in any basis of their eigenspace — both are correct. Small last-digit differences from your hand answer are normal; large ones mean a bug. And prefer the SVD of `X` over the eigen-decomposition of `X^T X`: squaring the matrix squares the condition number and costs you half your digits (2.9).

**Example question:** Explain in three or four lines why eigenvalues of `X^T X` are numerically worse than the SVD of `X`, and name the quantity that measures the damage.

**Solution:**

Step 1 — relate the two (reason: from 2.4, `sigma_i^2` are the eigenvalues of `X^T X`):

```latex
\sigma_i(X^{\mathsf T}X) = \sigma_i(X)^2 \qquad\Longrightarrow\qquad \kappa(X^{\mathsf T}X) = \left(\frac{\sigma_1}{\sigma_r}\right)^2 = \kappa(X)^2
```

Step 2 — conclude: if `kappa(X) = 10^4` (bad but common), then `kappa(X^T X) = 10^8`, and with about 16 digits of double precision you lose 8 of them — the smallest singular direction becomes noise.

**Final answer:** forming `X^T X` squares the condition number, roughly doubling the digits lost; the SVD works on `X` directly. The damage is measured by `kappa = sigma_max/sigma_min`.

⚠️ **Common trap:** Concluding a library is wrong because it differs in the 15th digit. And never test numerical code on a matrix whose answer you cannot verify by hand — always keep one small example where you know the exact answer, as above.

---

## 2.9 Norms of matrices and conditioning

### Intuition

A vector norm measures the size of an arrow; a **matrix norm** measures the size of a transformation — "how much can this stretch a vector?" Two natural answers: total entry size (Frobenius) or worst-case stretch (spectral). The second leads to the **condition number**, which answers the practical question: *if my input is slightly wrong, how wrong can my output be?*

Analogy: a microphone with huge gain. A whisper becomes a roar — but so does any tiny room noise. That is an ill-conditioned system: small input error, huge output error.

### The idea, step by step

**Step 1 – Frobenius norm.** Treat the matrix as one long vector of all entries: `||A||_F = sqrt(sum of a_ij^2) = sqrt(trace(A^T A)) = sqrt(sigma_1^2 + ... + sigma_r^2)`. Easy to compute, and it is the norm in the Eckart-Young error formula, but it says nothing about worst-case stretching.

**Step 2 – Spectral norm (2-norm).** The maximum stretch factor, `||A||_2 = max over unit x of ||Ax|| = sigma1` — the longest semi-axis of the output ellipse. For symmetric A it is `max |lambda_i|`.

**Step 3 – The condition number.** For invertible A, `kappa(A) = ||A|| ||A^-1|| = sigma_max / sigma_min`. Read it as an **amplification factor for relative error**: data off by a relative `eps` gives a solution off by up to `kappa x eps`. `kappa = 1` is perfect (orthogonal matrices never stretch); `kappa = 10^6` means you lose six digits.

**Step 4 – Worked numbers.** For `A = [[3,0],[4,5]]`, with `sigma = 3sqrt5 ≈ 6.708` and `sqrt5 ≈ 2.236`:

```latex
\kappa_2(A) = \frac{3\sqrt5}{\sqrt5} = 3, \qquad \|A\|_F = \sqrt{9+0+16+25} = \sqrt{50} = 5\sqrt2 \approx 7.071 = \sqrt{45+5}\ \checkmark
```

Now the nasty one, `B = [[1,1],[1,1.01]]` — two nearly identical columns:

```latex
B^{\mathsf T}B = \begin{pmatrix} 2 & 2.01 \\ 2.01 & 2.0201 \end{pmatrix}, \qquad \det = 2(2.0201) - (2.01)^2 = 4.0402 - 4.0401 = 0.0001
```

Eigenvalues from trace and determinant: `lambda1 ≈ 4.0201` (nearly the whole trace) and `lambda2 = 0.0001/4.0201 ≈ 0.0000249`, hence `sigma1 ≈ 2.005`, `sigma2 ≈ 0.00499` and `kappa ≈ 402`. Compare `kappa = 3` with `kappa ≈ 400`: same size, wildly different reliability. Two nearly parallel columns mean the matrix **almost** loses rank, and a matrix that almost loses rank almost loses its inverse.

**Step 5 – Where conditioning shows up in AI.** *Regression:* nearly collinear features make `X^T X` ill-conditioned, so fitted weights become huge and flip sign when one data point changes — ridge (`+ mu I`) improves the condition number, which is the real reason it stabilises fits. *Training:* the Hessian's condition number is the ratio of steepest to flattest curvature, and large `kappa` means a long narrow valley and slow zig-zagging descent, which is why input normalisation and momentum help. *Deep networks:* products of many matrices multiply condition numbers — the mathematical reason very deep plain networks are hard to train, and why residual connections help.

**Example question:** For `A = [[1, 2],[2, 4.01]]`, compute `det(A)`, estimate `kappa_2(A)`, and say whether solving `Ax = b` is safe in double precision.

**Solution:**

Step 1 — determinant (a near-zero determinant is the first warning): `1(4.01) - 2(2) = 0.01`.

Step 2 — `A^T A = [[5, 10.02],[10.02, 20.0801]]` (from `1+4`, `2+8.02`, `4+16.0801`).

Step 3 — eigenvalues from trace and determinant: trace `= 25.0801`, det `= 5(20.0801) - (10.02)^2 = 100.4005 - 100.4004 = 0.0001`, so `lambda1 ≈ 25.0801` and `lambda2 = 0.0001/25.0801 ≈ 3.99 x 10^-6`.

Step 4 — singular values and condition number: `sigma1 ≈ sqrt(25.08) ≈ 5.008`, `sigma2 ≈ sqrt(3.99 x 10^-6) ≈ 0.002`, so `kappa ≈ 5.008/0.002 ≈ 2500`.

Step 5 — interpret: double precision gives ~16 digits, and `kappa ≈ 2.5 x 10^3` costs about 3.4 of them, leaving ~12 — usable, but not comfortable. Forming `A^T A` explicitly would make it `≈ 6 x 10^6` and cost another 3-4 digits.

**Final answer:** `det(A) = 0.01` (nearly singular), `kappa_2(A) ≈ 2.5 x 10^3`. Solvable in double precision with ~12 trustworthy digits, but ill-conditioned: expect visible sensitivity to small changes in `b`, and never form `A^T A` explicitly for this matrix.

⚠️ **Common trap:** Confusing the determinant with the condition number. `det = 0.01` looks alarming, but the determinant scales with the matrix (multiply A by 10 and det grows 100x while `kappa` is unchanged). `kappa` is scale-invariant, which is why it is the right sensitivity measure. Also, for a **non-symmetric** matrix use the singular-value ratio, not the eigenvalue ratio.

---

## 2.10 AI/ML meaning throughout

| Maths idea | What it is in AI |
| --- | --- |
| Eigenvector / eigenvalue | A direction a transformation (or dataset, or loss surface) preserves, and how much it amplifies |
| Diagonalisation | Switching to the natural basis so a repeated operation becomes independent per-direction scaling |
| Symmetric matrix, orthogonal eigenvectors | Covariance matrices, Hessians — always give perpendicular natural axes |
| Quadratic form `x^T A x` | Local shape of a loss: bowl, dome or saddle |
| Positive definiteness | "This loss has a unique minimum that gradient descent can find" |
| SVD | Rotate-stretch-rotate; works for any rectangle, including every dataset |
| Singular values | How much each direction is amplified; zero = lost direction |
| Low-rank approximation | Compression, denoising, recommendation, low-rank fine-tuning adapters |
| Covariance matrix | Which features move together; the object PCA decomposes |
| PCA | The few directions carrying most of the variance; decorrelated features |
| Explained variance ratio | How much information a compression kept |
| Matrix factorisation `R ≈ PQ^T` | Latent factors behind ratings, words, topics, users |
| Condition number | How much small errors get amplified; why training is slow in narrow valleys |

**Why eigen and SVD underlie structure-finding:** every dataset is a matrix, and every matrix has preferred directions given by its singular vectors — the directions where the data is "loud". A model that knows the loud directions can ignore the quiet ones, which is compression, denoising, decorrelation and embedding at once. The eigenvalues say *how loud*, which is exactly what you need to decide what to throw away. Almost every "the model found structure" story in AI is this fact in some costume.

---

## Formula / rule summary table

| # | Formula | Meaning | When to use |
| --- | --- | --- | --- |
| 1 | `A v = lambda v`, `v != 0` | v is only stretched by A, factor lambda | Definition; preserved directions |
| 2 | `det(A - lambda I) = 0` | characteristic equation | Finding eigenvalues (small matrices) |
| 3 | `sum lambda = trace`, `prod lambda = det` | consistency checks | Always, right after computing eigenvalues |
| 4 | `A = P D P^-1` | eigenvector-basis diagonalisation | Powers, repeated application |
| 5 | `A^k = P D^k P^-1` | powers become scalar powers | `A^10`, Markov chains, stability |
| 6 | `A = P D P^T` (symmetric) | orthonormal diagonalisation | Covariance matrices, Hessians |
| 7 | `Q(x) = x^T A x` | quadratic form | Shape of a loss near a critical point |
| 8 | `Delta_k > 0` for all k | Sylvester / leading-minor test | Fast positive-definiteness check |
| 9 | `A = U S V^T` | rotate, stretch, rotate | Any matrix, especially rectangular data |
| 10 | `sigma_i^2 = eig(A^T A)`, `u_i = A v_i / sigma_i` | SVD by hand | Small worked examples |
| 11 | `rank = ` number of non-zero `sigma_i` | true dimension | Compression decisions |
| 12 | `A_k = sum_{i<=k} sigma_i u_i v_i^T` | best rank-k approximation | Compression, denoising |
| 13 | `Var(x) = (1/n) sum (x_i - xbar)^2` | spread of one feature | Before PCA; feature screening |
| 14 | `C = (1/n) X_c^T X_c` | covariance matrix | PCA, decorrelation |
| 15 | `w = eigvec(C)`, variance `= eigval(C)` | principal components | Finding the best directions |
| 16 | `EVR_i = lambda_i / sum lambda` | fraction of variance kept | Choosing how many components |
| 17 | `R ≈ P Q^T` | matrix factorisation | Recommendation, embeddings |
| 18 | `kappa = sigma_max / sigma_min` | condition number | Judging reliability of a solve |

### Which formula when? (quick guide)

- See *"direction that does not change"*, *"stretch factor"* -> `A v = lambda v`.
- See a **2 x 2 or 3 x 3** matrix and *"eigenvalues"* -> write `det(A - lambda I) = 0` and factor.
- See *"compute A^n for large n"* -> diagonalise, then `P D^n P^-1`. Never multiply n times.
- See *"A is symmetric"* -> real eigenvalues, orthogonal eigenvectors, `P D P^T`.
- See *"is this a minimum / bowl / convex"* -> quadratic form, then leading minors or eigenvalues of H.
- See *"for all x, Q(x) > 0"* -> positive definite: all `Delta_k > 0`.
- See a **rectangular** matrix, *"compress"*, *"rank"*, *"best approximation"* -> SVD.
- See *"find the SVD by hand"* -> `A^T A`, eigenvalues, square roots, then `u_i = A v_i / sigma_i`.
- See *"reduce dimensions"*, *"directions of greatest variance"* -> PCA: centre, covariance, eigenvectors.
- See *"how many components to keep"* -> cumulative explained variance ratio.
- See *"users x items"*, *"missing entries"*, *"latent factors"* -> `R ≈ PQ^T`.
- See *"will small errors blow up"*, *"unstable fit"*, *"narrow valley"* -> condition number.

---

## Solved examples

### Example 1 (easy) — diagonalise and take a power

**Question:** Diagonalise `A = [[5, 4],[1, 2]]` and use it to find `A^4`.

**Solution:**

Step 1 — characteristic equation: `(5-lambda)(2-lambda) - 4 = lambda^2 - 7lambda + 6 = (lambda-6)(lambda-1)`, so `lambda1 = 6`, `lambda2 = 1`. Check: trace 7 ✓, det `10-4 = 6` ✓.

Step 2 — eigenvectors: for 6, `-x + 4y = 0` so `v1 = (4,1)`; for 1, `4x + 4y = 0` so `v2 = (1,-1)`.

Step 3 — assemble, with `det P = 4(-1) - 1(1) = -5`:

```latex
P = \begin{pmatrix} 4 & 1 \\ 1 & -1 \end{pmatrix}, \quad D = \begin{pmatrix} 6 & 0 \\ 0 & 1 \end{pmatrix}, \quad P^{-1} = \frac{1}{5}\begin{pmatrix} 1 & 1 \\ 1 & -4 \end{pmatrix}
```

Step 4 — powers: `D^4 = diag(1296, 1)`, so

```latex
A^4 = \frac{1}{5}\begin{pmatrix} 5184 & 1 \\ 1296 & -1 \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 1 & -4 \end{pmatrix} = \frac{1}{5}\begin{pmatrix} 5185 & 5180 \\ 1295 & 1300 \end{pmatrix} = \begin{pmatrix} 1037 & 1036 \\ 259 & 260 \end{pmatrix}
```

Step 5 — verify with `A^2 A^2`: `A^2 = [[29,28],[7,8]]`, and `[[29,28],[7,8]]^2 = [[841+196, 812+224],[203+56, 196+64]] = [[1037,1036],[259,260]]` ✓.

**Final answer:** `P = [[4,1],[1,-1]]`, `D = diag(6,1)`, `A^4 = [[1037,1036],[259,260]]`.

### Example 2 (medium) — PCA by hand on collinear data

**Question:** Three students, two features (hours `h`, marks `m`): `(1,2)`, `(2,3)`, `(3,4)`. Find the components, the explained variance ratios and the 1-D representation. Comment on the result.

**Solution:**

Step 1 — means: `h_bar = 2`, `m_bar = 3`; centre to get `X_c = [[-1,-1],[0,0],[1,1]]`.

Step 2 — covariance: diagonal entries `(1+0+1)/3 = 2/3`, cross `((-1)(-1) + 0 + (1)(1))/3 = 2/3`:

```latex
C = \frac{1}{3}\begin{pmatrix} 2 & 2 \\ 2 & 2 \end{pmatrix} = \begin{pmatrix} 0.667 & 0.667 \\ 0.667 & 0.667 \end{pmatrix}
```

Step 3 — eigenvalues: `(2/3 - lambda)^2 - 4/9 = 0` gives `2/3 - lambda = ±2/3`, so `lambda1 = 4/3`, `lambda2 = 0`. Check: trace `4/3` ✓, det `4/9 - 4/9 = 0` ✓.

Step 4 — eigenvectors: for `4/3`, `-2x + 2y = 0` so `w1 = (1,1)/sqrt2`; for 0, `y = -x` so `w2 = (1,-1)/sqrt2`.

Step 5 — EVR: total variance `4/3`, so `EVR1 = 100%`, `EVR2 = 0%`.

Step 6 — scores (project on `w1`): `(-1,-1)` gives `-1.414`, `(0,0)` gives 0, `(1,1)` gives `1.414`; their variance is `(2+0+2)/3 = 4/3` ✓ matching `lambda1`.

Step 7 — interpretation: `lambda2 = 0` exactly, so the data lies **perfectly on a line** (`m = h + 1`). The "2-D dataset" was really 1-D, and the component `(0.707,0.707)` means "hours and marks equally" — a general-ability axis.

**Final answer:** `w1 = (1,1)/sqrt2` with variance `4/3` (100%), `w2 = (1,-1)/sqrt2` with variance 0; 1-D scores `-1.414, 0, 1.414`. The data is exactly rank 1, so dropping the second component loses nothing.

### Example 3 (exam level) — SVD, rank, norms and conditioning together

**Question:** For `A = [[1, 1],[1, -1]]`, find the full SVD, the rank, both matrix norms and the condition number. Is A a good "mixing" layer in a network?

**Solution:**

Step 1 — `A^T A` (note A is symmetric, so `A^T A = A^2`): `[[1,1],[1,-1]]^2 = [[2,0],[0,2]] = 2I`.

Step 2 — eigenvalues both 2, so `sigma1 = sigma2 = sqrt2`.

Step 3 — right singular vectors: since `A^T A = 2I`, **every** unit vector is an eigenvector, so pick the standard ones, `V = I`.

Step 4 — left singular vectors, `u_i = A v_i / sigma_i`: `u1 = (1/sqrt2)(1,1)^T`, `u2 = (1/sqrt2)(1,-1)^T`.

Step 5 — verify:

```latex
USV^{\mathsf T} = \frac{1}{\sqrt2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} \sqrt2 & 0 \\ 0 & \sqrt2 \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\ \checkmark
```

Step 6 — rank 2 (both singular values non-zero).

Step 7 — norms and conditioning: `||A||_2 = sigma1 = sqrt2 ≈ 1.414`, `||A||_F = sqrt(1+1+1+1) = 2 = sqrt(2+2)` ✓, `kappa = sqrt2/sqrt2 = 1`.

Step 8 — interpretation: `kappa = 1` is the best possible, and `A^T A = 2I` means A scales every length by exactly `sqrt2` and otherwise only rotates or reflects — it is `sqrt2` times an orthogonal matrix, so errors are never amplified and no information is lost.

**Final answer:** `sigma1 = sigma2 = sqrt2`, `U = (1/sqrt2)[[1,1],[1,-1]]`, `S = sqrt2 I`, `V = I`; rank 2; `||A||_2 = 1.414`, `||A||_F = 2`; `kappa = 1`. Yes — perfectly conditioned and information-preserving.

---

## Common traps and mistakes

- **Eigenvectors in rows of P instead of columns.** `A = PDP^-1` fails completely; costs the whole question.
- **Mismatched order of eigenvalues and eigenvectors.** Entry i of D must match column i of P. Check `AP = PD` before continuing.
- **Assuming every matrix diagonalises.** Repeated eigenvalues can leave too few independent eigenvectors (`[[2,1],[0,2]]`). Say so instead of inventing one.
- **Writing `2bxy` as `bxy`.** `6xy` means off-diagonal 3; every later conclusion then goes wrong.
- **Testing only `det(A) > 0` for PD.** Negative definite matrices can have positive determinant — you need all leading minors positive.
- **Calling eigenvalues of A "singular values".** Singular values come from `A^T A` and are never negative.
- **Not sorting singular values descending.** U, S, V misalign and `USV^T != A`.
- **Forgetting to centre the data in PCA.** The "first component" then points at the mean, not at the main spread.
- **Using eigenvalues of `X^T X` as variances without dividing by n.** Values come out n times too large.
- **Judging sensitivity by the determinant.** The determinant scales with the matrix; `kappa` does not.
- **Treating a missing rating as a zero rating.** Missing means unknown; the loss must skip those entries.
- **Marking an eigenvector's sign as wrong.** `v` and `-v` are both correct; only the direction matters.

---

## Quick revision box

- ✅ `A v = lambda v`: v keeps its direction, A stretches it by `lambda`. Eigenvalues from `det(A - lambda I) = 0`, then solve `(A - lambda I)v = 0`.
- ✅ Check every eigen-answer with `sum lambda = trace` and `prod lambda = det`.
- ✅ `A = P D P^-1` with eigenvectors as columns, same order as D; then `A^k = P D^k P^-1`.
- ✅ Symmetric matrices: real eigenvalues, orthogonal eigenvectors, `A = P D P^T = sum lambda_i q_i q_i^T`.
- ✅ `x^T A x` is a bowl/dome/saddle. PD iff all eigenvalues > 0 iff all leading minors > 0; PD Hessian at a critical point means a minimum.
- ✅ SVD: `A = U S V^T` = rotate, stretch, rotate, for any shape. `sigma_i^2 = eig(A^T A)`, `u_i = A v_i/sigma_i`, `rank` = number of non-zero `sigma`.
- ✅ Best rank-k approximation keeps the k biggest `sigma`; the error is the root of the squared discarded ones.
- ✅ PCA = centre, covariance `C = (1/n)X_c^T X_c`, components = eigenvectors of C, variance = eigenvalues, `EVR = lambda_i/sum lambda`.
- ✅ `kappa = sigma_max/sigma_min` is how much relative error is amplified; `kappa = 1` is perfect, large `kappa` means unstable fits and slow training.

---

## Practice questions

1. Find the eigenvalues and eigenvectors of `A = [[7, 2],[3, 2]]` and verify with the trace and determinant checks.
2. `A = [[1, 2],[0, 3]]` — find its eigenvalues and diagonalise it (give P, D and `P^-1`).
3. Show that `Q(x,y) = 4x^2 + 12xy + 13y^2` is positive definite and write it as `lambda_1 c_1^2 + lambda_2 c_2^2`.
4. Find the SVD of `A = [[0, 2],[0, 0]]` and state its rank.
5. A centred dataset has covariance matrix `C = [[4, 0],[0, 1]]`. Find the components and the explained variance ratios, and give the 1-D projection of the point `(2, 1)`.
6. A 3-user x 3-item rating matrix is modelled as `R = P Q^T` with `P = [[2,0],[0,2],[1,1]]` and `Q = [[1,0],[0,1],[1,1]]`. Write out R, predict `r_13`, and explain why the rank is 2.

## Answers

**1.** `(7-lambda)(2-lambda) - 6 = lambda^2 - 9lambda + 8 = (lambda-8)(lambda-1)`, so `lambda1 = 8`, `lambda2 = 1`. Check: trace 9 ✓, det `14-6 = 8` ✓. For 8: `-x + 2y = 0`, so `v1 = (2,1)`; for 1: `6x + 2y = 0`, so `v2 = (1,-3)`. Verify: `A(2,1) = (16,8) = 8(2,1)` ✓, `A(1,-3) = (1,3) = 1(1,-3)` ✓.

**2.** Upper triangular, so the eigenvalues are the diagonal: 1 and 3. For 1: `0x + 2y = 0`, so `v1 = (1,0)`; for 3: `-2x + 2y = 0`, so `v2 = (1,1)`. `P = [[1,1],[0,1]]`, `D = diag(1,3)`, `P^-1 = [[1,-1],[0,1]]`. Check `PDP^-1 = [[1,2],[0,3]]` ✓.

**3.** `A = [[4,6],[6,13]]` (cross term `12xy` gives off-diagonal 6). `Delta1 = 4 > 0`, `Delta2 = 52-36 = 16 > 0`, so PD. Eigenvalues from `lambda^2 - 17lambda + 16 = 0`: 16 and 1. For 16, `-12x + 6y = 0` gives `q1 = (1,2)/sqrt5`; for 1, `3x + 6y = 0` gives `q2 = (2,-1)/sqrt5`. Hence `Q = 16 c1^2 + c2^2`.

**4.** `A^T A = [[0,0],[0,4]]` with eigenvalues 4, 0, so `sigma1 = 2`, `sigma2 = 0`; `v1 = (0,1)`, `v2 = (1,0)`. `u1 = A v1/2 = (1,0)`; with `sigma2 = 0`, take `u2 = (0,1)`. So `U = I`, `S = [[2,0],[0,0]]`, `V = [[0,1],[1,0]]`, and `USV^T = [[0,2],[0,0]] = A` ✓. Rank 1 — the matrix crushes everything except the y-direction.

**5.** `C` is already diagonal, so the components are the standard axes: `w1 = (1,0)` with variance 4, `w2 = (0,1)` with variance 1. Total variance 5, so EVR = 80% and 20%. With one component, the projection of `(2,1)` is `2` (dot product with `(1,0)`), reconstructing to `(2,0)`; the discarded information is the second coordinate, 1.

**6.** `R = P Q^T = [[2,0],[0,2],[1,1]] x [[1,0,1],[0,1,1]] = [[2,0,2],[0,2,2],[1,1,2]]`, so `r_13 = 2`. Rank 2 because R is a product of a 3x2 and a 2x3 matrix, so `rank <= 2`, and rows 1 and 2 are independent; row 3 `(1,1,2)` is not their average, so the rank is not 1.
