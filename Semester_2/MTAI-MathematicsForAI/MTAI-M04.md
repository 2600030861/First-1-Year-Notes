# Mathematics for AI – Module 4

## Optimization

*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

Every AI model is a function with knobs on it. Those knobs are the **parameters** (or **weights**), and a model is good when its knobs sit at good values. Optimization is the mathematics of finding those values automatically.

So the whole of training reduces to one sentence: **training a model = choose the parameters that make the error as small as possible.**

This module answers six questions:

1. What is the "error" we shrink? -> the **loss function**; training is minimising it
2. When can we solve it by hand? -> **gradient = 0, Hessian test**
3. When is the problem guaranteed easy? -> **convexity**
4. When we cannot solve it, how do we walk downhill? -> **gradient descent**
5. How do we make that walk practical? -> **SGD, mini-batches, momentum**
6. What if we must obey rules or keep the model simple? -> **Lagrange multipliers, regularisation**

**Analogy:** you are on a hillside in thick fog and cannot see the valley, but you can feel the slope under your feet. So you step downhill a little, feel again, step again. That is gradient descent, and it is exactly how a neural network learns.

**Prerequisites:** Module 3 (partial derivatives, the gradient, the Hessian) and Module 1 section 1.9 (projection and least squares). You should be able to differentiate `x^2`, `x^3` and a two-variable quadratic by hand.

---

## Basics you must know first

- **Function** – a rule turning inputs into one output. Here the input is the parameter vector `w`, the output is one number, the loss.
- **Derivative `f'(x)`** – the slope. Positive means the function rises as you move right.
- **Partial derivative** – slope while holding the other variables still, written `∂f/∂w_1`.
- **Gradient `∇f`** – the vector of all partial derivatives; it points in the direction of **steepest ascent**.
- **Hessian** – the matrix of all second partial derivatives; it describes **curvature** (bowl, dome or saddle).
- **Minimum** – a point lower than all nearby points (local) or lower than everything (global).

---

## 4.1 Optimization as the core of learning

### Intuition

Think of an equaliser with 10 sliders. You cannot compute "best" directly, but you can hear the result and nudge the sliders. Training is that loop: set the knobs, measure how wrong the output is, nudge, repeat.

Two words to fix first. The **loss function `L(w)`** is one number measuring how wrong the model is — lower is better, and it is also called the cost or objective. The **parameters `w`** are the numbers we may change; everything else (data, architecture) is fixed during training.

### The idea, step by step

**Step 1 – Write the model.** A guess at how inputs become outputs, e.g. `y_hat = w x`.

**Step 2 – Write the loss.** The default for regression is squared error:

```latex
L(w) = \sum_{i=1}^{n} \big(y_i - \hat{y}_i\big)^2
```

`y_i` is the true answer for point `i`, `y_hat_i` our prediction, `n` the number of points. We square so positive and negative errors do not cancel, and so big errors are punished far more than small ones.

**Step 3 – Plug in the data.** Now `L` is a plain function of `w` alone; the data has become constants.

**Step 4 – Minimise.** Find the `w` making `L` smallest. That is the trained model.

**What this means for AI:** this four-step recipe is not a toy. Swap in a bigger model and cross-entropy loss and the same recipe trains an image classifier. Only the scale changes.

Three common losses: squared error (regression), absolute error (regression with outliers), cross-entropy (classification).

**Example question:** A model predicts `y_hat = w x`. The training data is `(x, y) = (1, 2), (2, 3), (3, 5)`. Write `L(w)`, evaluate it at `w = 1` and `w = 1.5`, and find the minimising `w`.

**Solution:**

Step 1: sum the squared errors over the three points. `L(w) = (2 - w)^2 + (3 - 2w)^2 + (5 - 3w)^2`.
Step 2: expand each square (reason: we need a polynomial in `w` before differentiating).

```latex
(2-w)^2 = 4 - 4w + w^2, \quad (3-2w)^2 = 9 - 12w + 4w^2, \quad (5-3w)^2 = 25 - 30w + 9w^2
```

Step 3: collect constants, `w` terms and `w^2` terms separately. `L(w) = (4+9+25) - (4+12+30)w + (1+4+9)w^2 = 14w^2 - 46w + 38`.
Step 4: evaluate at the two asked values. `L(1) = 6` and `L(1.5) = 0.5`.
Step 5: differentiate, set to zero, and confirm it is a minimum.

```latex
L'(w) = 28w - 46 = 0 \Rightarrow w = \tfrac{23}{14} \approx 1.643, \qquad L'' = 28 > 0
```

Step 6: check by substitution. `L(23/14) = 38 - 529/7 + 529/14 = 3/14 ≈ 0.214`.

**Final answer:** `L(w) = 14w^2 - 46w + 38`, `L(1) = 6`, `L(1.5) = 0.5`, minimum at `w = 23/14 ≈ 1.643` with `L = 3/14 ≈ 0.214`.

⚠️ **Common trap:** the `w` that minimises training loss is not automatically the best model. Training loss is a means, not the goal. A model can drive it to near zero and still be useless on new data — that is overfitting, and it is why 4.8 exists.

---

## 4.2 Unconstrained optimization

### Intuition

Drop a marble into a valley. It stops at the bottom, where **the ground is flat in every direction**. That flatness is the whole test: at an interior optimum the gradient is the zero vector.

But flat ground is not always a bottom. A flat spot can also be the **top** of a hill (maximum) or a **mountain pass** between two peaks (saddle point) — flat, yet you go down one way and up another. Telling these apart needs curvature: the second derivative.

### The idea, step by step

**Step 1 – Find critical points** by solving `∇f = 0` (in one variable, `f'(x) = 0`).

**Step 2 – In one variable, read `f''`.**

```latex
f''(x) > 0 \Rightarrow \text{local minimum}, \quad f''(x) < 0 \Rightarrow \text{local maximum}, \quad f''(x) = 0 \Rightarrow \text{test fails}
```

**Tiny example:** `f(x) = x^3 - 3x^2 + 2` has `f'(x) = 3x(x-2)`, so critical points `x = 0, 2`. With `f''(x) = 6x - 6`: `f''(0) = -6 < 0` is a local max (`f(0) = 2`) and `f''(2) = 6 > 0` a local min (`f(2) = -2`).

**Step 3 – In two variables, build the Hessian** of second derivatives:

```latex
H = \begin{pmatrix} f_{xx} & f_{xy} \\ f_{xy} & f_{yy} \end{pmatrix} \qquad (\text{mixed partials agree: } f_{xy} = f_{yx})
```

**Step 4 – Apply the 2-D test** with `D = det(H) = f_{xx} f_{yy} - (f_{xy})^2` at the critical point:

```latex
\begin{cases}
D > 0,\ f_{xx} > 0 & \Rightarrow \text{local minimum (bowl)} \\
D > 0,\ f_{xx} < 0 & \Rightarrow \text{local maximum (dome)} \\
D < 0 & \Rightarrow \text{saddle point} \\
D = 0 & \Rightarrow \text{inconclusive}
\end{cases}
```

**What this means for AI:** a network's loss has millions of dimensions, so its Hessian has millions-squared entries — impossible to store, let alone test. We never run this test on a real network; we walk downhill (4.4). But the vocabulary of minima, maxima and saddles is exactly what we reason about.

**Example question:** Find and classify all critical points of `f(x, y) = x^2 + 3xy + y^2`.

**Solution:**

Step 1: partial derivatives. `f_x = 2x + 3y` and `f_y = 3x + 2y`.
Step 2: set both to zero (critical point condition) and solve.

```latex
2x + 3y = 0,\ 3x + 2y = 0 \;\Rightarrow\; 6x + 9y = 0,\ 6x + 4y = 0 \;\Rightarrow\; 5y = 0
```

So `y = 0`, then `x = 0`: `(0,0)` is the only critical point.

Step 3: second derivatives and the determinant. `f_xx = 2`, `f_yy = 2`, `f_xy = 3`, so `D = 4 - 9 = -5 < 0`.
Step 4: read the verdict. `D < 0` means the curvatures disagree in sign, so the surface rises one way and falls the other.

**Final answer:** the only critical point is `(0,0)` and it is a **saddle point** (`D = -5 < 0`), with `f(0,0) = 0`. The function has no minimum or maximum at all: taking `x = t, y = -t` gives `f = -t^2`, which goes to `-infinity`.

⚠️ **Common trap:** "gradient = 0" is a *candidate* condition, never a conclusion. Writing "since `∇f = 0`, this is the minimum" loses marks even when the final answer happens to be right. Always add the second-order check.

---

## 4.3 Convexity

### Intuition

Some valleys are simple: one basin, one bottom, no false floors. Those are **convex** problems, and they are the ones we can solve with confidence.

A **convex set** is one where the straight line between any two of its points stays inside — a disc is convex, a crescent moon is not (the chord across the hollow leaves the shape). A **convex function** is **bowl-shaped**: for any two points on the curve, the chord between them lies **above** the curve.

### The idea, step by step

**Step 1 – The definition.** For any `a, b` and any `t` between 0 and 1:

```latex
f\big(t a + (1-t) b\big) \;\le\; t f(a) + (1-t) f(b)
```

In words: the function at a **blend of inputs** is at most the **same blend of outputs**. The surface sags below its own chords.

**Tiny example:** `f(x) = x^2`, `a = 0`, `b = 2`, `t = 0.5`. Left side `f(1) = 1`; right side `0.5(0) + 0.5(4) = 2`. Since `1 <= 2`, the curve lies below the chord. Convex.

**Step 2 – Why convex problems are nice.** Three reasons worth memorising: (1) **every local minimum is a global minimum**, so descent cannot be trapped in a false valley; (2) **the set of minimisers is convex**, so solutions are well shaped; (3) **the Hessian is positive semi-definite everywhere**, giving clean convergence guarantees for a small enough learning rate.

A neural network is not convex, so none of this holds — we find *a* good local minimum and hope. That is why deep learning is engineering as much as mathematics.

**Step 3 – Recognising convexity.** Four practical tools:

```latex
\begin{aligned}
\text{1-D:} \quad & f''(x) \ge 0 \ \text{for all } x \\
\text{2-D+:} \quad & H(\mathbf{w}) \ \text{positive semi-definite everywhere} \\
\text{sums:} \quad & f, g \text{ convex} \Rightarrow f+g \text{ convex}, \ c f \text{ convex for } c \ge 0 \\
\text{affine:} \quad & f \text{ convex} \Rightarrow f(A\mathbf{x}+\mathbf{b}) \text{ convex}
\end{aligned}
```

**Positive semi-definite (PSD)** means `v^T H v >= 0` for every non-zero `v`. The quick hand test for a 2x2 symmetric Hessian is Sylvester's criterion: `f_xx >= 0` **and** `det(H) >= 0` (strict if both are `> 0`).

**What this means for AI:** linear regression with squared error is convex, logistic regression is convex, an SVM is convex. A neural network is **not**. That single fact explains why classical ML comes with guarantees and deep learning comes with "it usually works".

**Example question:** Is `f(x, y) = x^2 - 2xy + 3y^2` convex? Justify.

**Solution:**

Step 1: first derivatives, then second derivatives. `f_x = 2x - 2y`, `f_y = -2x + 6y`, hence `f_xx = 2`, `f_yy = 6`, `f_xy = -2`.
Step 2: the Hessian. It is constant (the function is a pure quadratic), so testing one point tests everywhere.

```latex
H = \begin{pmatrix} 2 & -2 \\ -2 & 6 \end{pmatrix}
```

Step 3: Sylvester's criterion. `f_xx = 2 > 0` and `det(H) = 12 - 4 = 8 > 0`.
Step 4: both hold strictly and `H` does not depend on `x, y`, so `H` is positive definite everywhere.

**Final answer:** yes, `f` is **strictly convex**. Its unique global minimum is where `∇f = 0`: `2x - 2y = 0` and `-2x + 6y = 0` give `x = y` and `4y = 0`, so the minimum is `(0,0)` with `f = 0`.

⚠️ **Common trap:** positive diagonal entries alone do not make a Hessian PSD. `[[2, 5], [5, 2]]` has both diagonal entries positive but `det = 4 - 25 = -17 < 0`, so it is indefinite. Check the determinant too.

---

## 4.4 Gradient descent

### Intuition

The gradient `∇f` points **uphill**, so to go down we step in the **opposite** direction. The step size is the **learning rate**. Too small and you crawl; too large and you leap over the valley onto the far slope, then leap back — you bounce, or blow up.

### The idea, step by step

**Step 1 – The update rule.** Start from a guess `w_0` and repeat:

```latex
\mathbf{w}_{k+1} = \mathbf{w}_k - \eta \, \nabla f(\mathbf{w}_k)
```

`η` (eta) is the **learning rate** (a small positive number such as 0.01 or 0.1) and `k` counts iterations. The minus sign is the entire trick: gradient points up, we want down.

**Step 2 – One iteration by hand.** Take `f(x) = x^2 - 4x + 4 = (x-2)^2`, so `f'(x) = 2x - 4`. From `x_0 = 0` with `η = 0.1`: `x_1 = 0 - 0.1(0 - 4) = 0.4`.
**Step 3 – The full run of five iterations.**

| Step `k` | `x_k` | `f'(x_k) = 2x_k - 4` | `x_{k+1} = x_k - 0.1 f'` | `f(x_{k+1}) = (x_{k+1}-2)^2` |
| --- | --- | --- | --- | --- |
| 0 | 0 | -4.0 | 0.4 | 2.56 |
| 1 | 0.4 | -3.2 | 0.72 | 1.6384 |
| 2 | 0.72 | -2.56 | 0.976 | 1.048576 |
| 3 | 0.976 | -2.048 | 1.1808 | 0.67108864 |
| 4 | 1.1808 | -1.6384 | 1.34464 | 0.4294967296 |

The loss falls: 2.56 -> 1.64 -> 1.05 -> 0.67 -> 0.43. The true minimum is at `x = 2` with `f = 0`; we are at `1.34464` after five steps. Slow but correct.

**Step 4 – Understand the speed.** The distance from the answer takes the values `-2, -1.6, -1.28, -1.024, -0.8192, -0.65536` — each exactly `0.8` times the previous. Not a coincidence:

```latex
x_{k+1} - 2 = (1 - 2\eta)(x_k - 2) \quad\Rightarrow\quad \text{error shrinks by the factor } |1 - \eta \cdot \text{curvature}|
```

Here `|1 - 0.2| = 0.8 < 1`, so we converge. That factor is the key number.

**Step 5 – Watch the learning rate.** With `η = 1` the factor is `|1-2| = 1` and we never shrink: from `x_0 = 0` we get `4, 0, 4, 0, ...` — a perfect oscillation. With `η = 1.1` the factor is `1.2 > 1` and the run **diverges**: `0 -> 4.4 -> -0.88 -> 5.456 -> -2.1472`.

| Learning rate | Factor `abs(1 - 2η)` | Behaviour |
| --- | --- | --- |
| 0.01 | 0.98 | converges, painfully slow |
| 0.1 | 0.8 | converges steadily (table above) |
| 0.4 | 0.2 | converges fast |
| 0.5 | 0 | lands on the minimum in one step |
| 1.0 | 1 | oscillates forever |
| 1.1 | 1.2 | diverges |

**Step 6 – In Java.** The same loop as runnable code:

```java
public class GradientDescent {
    // f(x) = x^2 - 4x + 4, so the slope is f'(x) = 2x - 4
    static double slope(double x) { return 2 * x - 4; }

    public static void main(String[] args) {
        double x = 0.0, lr = 0.1;            // starting guess, learning rate
        for (int step = 1; step <= 5; step++) {
            x = x - lr * slope(x);           // step downhill
            System.out.printf("step %d: x = %.4f, f = %.4f%n", step, x, (x - 2) * (x - 2));
        }
    }
}
```

It prints exactly the five rows of the hand table (`x` = 0.4000, 0.7200, 0.9760, 1.1808, 1.3446; `f` = 2.5600, 1.6384, 1.0486, 0.6711, 0.4295) — which is the point of a dry run: the code and the arithmetic must agree.

**What this means for AI:** replace `x` with a vector of a million weights, replace `slope` with the gradient from backpropagation, and this loop *is* how a neural network trains. The loop over steps becomes a loop over epochs; nothing else changes.

**Example question:** Run three iterations of gradient descent on `f(x) = x^2` from `x_0 = 4` with `η = 0.25`. What is the pattern, and how many iterations bring you within `0.01` of the minimum?

**Solution:**

Step 1: the gradient is `f'(x) = 2x`.

Step 2: iterate. `x_1 = 4 - 0.25(8) = 2`, `x_2 = 2 - 0.25(4) = 1`, `x_3 = 1 - 0.25(2) = 0.5`.

Step 3: spot the pattern. The factor is `|1 - 2(0.25)| = 0.5`, so each step halves the value: `x_k = 4/2^k`.

Step 4: solve for the tolerance. Need `4/2^k < 0.01`, i.e. `2^k > 400`. Since `2^8 = 256` and `2^9 = 512`, `k = 9`.

**Final answer:** `x_1 = 2`, `x_2 = 1`, `x_3 = 0.5`, with `x_k = 4/2^k`; nine iterations give `x_9 = 4/512 ≈ 0.0078 < 0.01`.

⚠️ **Common trap:** writing `x = x + lr * g` instead of minus. Adding the gradient climbs *uphill*, so the loss rises and people blame the data. The second classic is not recomputing the gradient **after** the update — inside the loop it must be evaluated at the current `x`, not the starting one.

---

## 4.5 Variants

### Intuition

Plain gradient descent uses the **entire dataset** before one step. With a million examples that is a million evaluations per step — wasteful, because most examples say roughly the same thing. So look at a small random slice, step, look at another slice. Steps get noisy but far cheaper, and you get many more of them.

- **Batch gradient descent** – all data, one step. Smooth, exact, slow.
- **Stochastic gradient descent (SGD)** – one random example per step. Very noisy, very fast.
- **Mini-batch SGD** – a small group (32 to 512 examples) per step. The practical default everywhere.

### The idea, step by step

**Step 1 – Why noise can help.** A mini-batch gradient is a noisy but **unbiased** estimate: on average it points the right way. The noise shakes the model out of shallow local minima and saddles, which is why SGD sometimes generalises better than batch descent.

```latex
\nabla L_{\text{batch}} = \frac{1}{n}\sum_{i=1}^{n}\nabla \ell_i(\mathbf{w}), \qquad \nabla L_{\text{mini}} = \frac{1}{|B|}\sum_{i\in B}\nabla \ell_i(\mathbf{w})
```

`ℓ_i` is the loss on one example and `B` is the mini-batch.

**Step 2 – Momentum.** Imagine a ball rolling downhill rather than a hiker stepping: it builds speed in a consistent direction and shrugs off small bumps. We keep a running average of past gradients:

```latex
\mathbf{v}_{k+1} = \beta\,\mathbf{v}_k + \nabla f(\mathbf{w}_k), \qquad \mathbf{w}_{k+1} = \mathbf{w}_k - \eta\,\mathbf{v}_{k+1}
```

`β` (beta, typically 0.9) is how much of the past velocity we keep. In a narrow valley the gradient zig-zags sideways; averaging cancels the zig-zag, keeps the component along the valley, and lets the effective step grow while gradients keep pointing the same way.

**Step 3 – Numbers, so it is not just words.** Gradient `2` at three consecutive steps, `η = 0.1`, `β = 0.9`, starting from `v = 0`:

| Step | gradient `g` | `v = 0.9v + g` | weight change `η v` |
| --- | --- | --- | --- |
| 1 | 2 | 2.00 | 0.200 |
| 2 | 2 | 3.80 | 0.380 |
| 3 | 2 | 5.42 | 0.542 |

Total movement `1.122` versus `3 x 0.2 = 0.6` without momentum — nearly double on a long shallow slope.

**Step 4 – When to use what.** Batch for small data and convex problems, SGD for huge or streaming data, mini-batch (32-512) as the deep-learning default because it uses the GPU well, and momentum when progress zig-zags.

**What this means for AI:** writing `optimizer = "sgd"` or `"adam"` in a training script is choosing from this list. Adam is momentum plus a per-parameter adaptive step size — the same ideas, with the step size tuned separately for each weight.

**Example question:** Four training examples give per-example gradients `3, -1, 2, -2` with respect to one weight `w`. Compute the full-batch gradient and the gradients of the mini-batches `{3, -1}` and `{2, -2}`. Comment.

**Solution:**

Step 1: full batch — average all four (the batch gradient is the mean of per-example gradients). `(3 - 1 + 2 - 2)/4 = 2/4 = 0.5`.
Step 2: the two mini-batches. `(3 - 1)/2 = 1.0` and `(2 - 2)/2 = 0`.
Step 3: check unbiasedness — the average of the mini-batch gradients should recover the batch gradient. `(1.0 + 0)/2 = 0.5`, which checks out.

**Final answer:** batch gradient `0.5`; the mini-batches give `1.0` and `0`. The estimates differ a lot from each other — that is the noise — but their mean is exactly right. With `η = 0.1` the two mini-batch steps move `w` by `-0.1` and `0` instead of a single `-0.05`: same average destination, different path.

⚠️ **Common trap:** do not divide a mini-batch gradient by `n` (the whole dataset size). Divide by the **batch size**. Using `n` makes steps microscopic and training appears stuck for no reason.

---

## 4.6 Least squares as optimization

### Intuition

In Module 1 section 1.9 we solved least squares by **projection** and produced the normal equations almost by magic. Now we earn them: least squares is an optimization problem with a quadratic loss, and setting the gradient to zero *produces* the normal equations. Two routes, one destination.

Picture: we want `Aw = b`, but `b` is not in the column space of `A` (too many equations, noisy data). So we settle for the closest reachable point. Closest means smallest squared error, and that closest point is the projection.

### The idea, step by step

**Step 1 – Write the objective.** `A` is the `n x d` data matrix (one row per sample), `b` the `n x 1` target:

```latex
L(\mathbf{w}) = \|A\mathbf{w} - \mathbf{b}\|^2 = (A\mathbf{w}-\mathbf{b})^{\mathsf T}(A\mathbf{w}-\mathbf{b})
```

`Aw - b` is the vector of residuals; its squared length is the sum of squared errors.

**Step 2 – Expand**, using that `w^T A^T b` and `b^T A w` are the same scalar:

```latex
L(\mathbf{w}) = \mathbf{w}^{\mathsf T}A^{\mathsf T}A\mathbf{w} - 2\,\mathbf{w}^{\mathsf T}A^{\mathsf T}\mathbf{b} + \mathbf{b}^{\mathsf T}\mathbf{b}
```

**Step 3 – Differentiate with respect to `w`.** Two standard facts: the gradient of `w^T M w` (with `M` symmetric) is `2Mw`, and the gradient of `c^T w` is `c`. So:

```latex
\nabla L(\mathbf{w}) = 2A^{\mathsf T}A\mathbf{w} - 2A^{\mathsf T}\mathbf{b}
```

**Step 4 – Set the gradient to zero** (this is 4.2 applied to a convex quadratic):

```latex
2A^{\mathsf T}A\mathbf{w} - 2A^{\mathsf T}\mathbf{b} = \mathbf{0} \quad\Longrightarrow\quad A^{\mathsf T}A\,\mathbf{w} = A^{\mathsf T}\mathbf{b}
```

These are the **normal equations**. `A^T A` is symmetric and positive semi-definite, and positive definite when the columns of `A` are independent, so this convex problem has the unique solution `w = (A^T A)^{-1} A^T b`.

**Step 5 – The link to projection.** The same statement reads `A^T(Aw - b) = 0`, which says the residual is **orthogonal to every column of `A`**. Orthogonal residual = foot of the perpendicular = the projection. Optimization and geometry agree, as they must.

**What this means for AI:** linear regression, polynomial fitting and the final layer of many models are all this one equation. `(X^T X)^{-1} X^T y` is the closed-form "train the model" formula — no loop, no learning rate, no epochs.

**Example question:** Fit `y = w_0 + w_1 x` to `(1, 2), (2, 3), (3, 5), (4, 6)` using the normal equations. Verify that the residuals sum to zero and are orthogonal to the input column.

**Solution:**

Step 1: build the design matrix (the column of 1s carries the intercept) and the target.

```latex
A = \begin{pmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \\ 1 & 4 \end{pmatrix}, \qquad \mathbf{b} = \begin{pmatrix} 2 \\ 3 \\ 5 \\ 6 \end{pmatrix}
```

Step 2: form `A^T A` and `A^T b` from the sums (`n = 4`, `Σx = 10`, `Σx^2 = 30`, `Σy = 16`, `Σxy = 2+6+15+24 = 47`).

```latex
A^{\mathsf T}A = \begin{pmatrix} 4 & 10 \\ 10 & 30 \end{pmatrix}, \qquad A^{\mathsf T}\mathbf{b} = \begin{pmatrix} 16 \\ 47 \end{pmatrix}
```

Step 3: solve the 2x2 system `4w_0 + 10w_1 = 16`, `10w_0 + 30w_1 = 47`. From the first, `w_0 = 4 - 2.5w_1`; substituting gives `40 - 25w_1 + 30w_1 = 47`, so `5w_1 = 7`, `w_1 = 1.4`, then `w_0 = 4 - 3.5 = 0.5`.

Step 5: predictions and residuals.

| `x` | `y` | `y_hat = 0.5 + 1.4x` | residual `y - y_hat` |
| --- | --- | --- | --- |
| 1 | 2 | 1.9 | +0.1 |
| 2 | 3 | 3.3 | -0.3 |
| 3 | 5 | 4.7 | +0.3 |
| 4 | 6 | 6.1 | -0.1 |

Step 6: verify both orthogonality conditions.

```latex
\sum r_i = 0.1 - 0.3 + 0.3 - 0.1 = 0 \ \checkmark, \qquad \sum x_i r_i = 0.1 - 0.6 + 0.9 - 0.4 = 0 \ \checkmark
```

**Final answer:** `y = 0.5 + 1.4x`, with residuals `+0.1, -0.3, +0.3, -0.1`. They sum to zero and are orthogonal to the `x` column, confirming `A^T(Aw - b) = 0`.

⚠️ **Common trap:** dropping the column of 1s when the model has an intercept. Without it you force the line through the origin — a different and usually worse model — and your residuals no longer sum to zero.

---

## 4.7 Constrained optimization

### Intuition

So far the parameters could go anywhere. Real problems have rules: a budget cap, a memory limit, non-negative weights, probabilities summing to 1. These are **constraints**, and the answer is usually "the best you can do while respecting the rule".

Picture: you want the lowest point in a valley but a fence crosses it. You walk downhill until you hit the fence, then slide **along the fence** until you cannot go lower. There, the downhill direction is exactly perpendicular to the fence — you *want* to keep going but the fence blocks you. That blocked-ness is what the Lagrange multiplier measures.

### The idea, step by step

**Step 1 – State the problem:** minimise `f(x, y)` subject to `g(x, y) = 0` (an **equality constraint**).

**Step 2 – Build the Lagrangian**, with one new variable `λ` (the **Lagrange multiplier**) per constraint:

```latex
\mathcal{L}(x, y, \lambda) = f(x, y) - \lambda\, g(x, y)
```

**Step 3 – Set every partial derivative to zero**, treating `λ` as just another variable:

```latex
\frac{\partial \mathcal{L}}{\partial x} = 0, \qquad \frac{\partial \mathcal{L}}{\partial y} = 0, \qquad \frac{\partial \mathcal{L}}{\partial \lambda} = -g(x,y) = 0
```

That last equation simply re-imposes the constraint — neat bookkeeping.

**Step 4 – Why it works, in one line.** At the constrained optimum, the gradient of `f` must be parallel to the gradient of `g`: you cannot improve `f` without violating `g`, so the only escape is straight through the constraint surface. `∇f = λ ∇g`.
Steps 2 and 3 produce exactly this.

**Step 5 – What `λ` means.** It is the **shadow price**: how much the optimal value of `f` changes if you relax the constraint by one unit. In ML, if you constrain "model size <= 10 MB", `λ` tells you what one extra MB buys in accuracy.

**Tiny example:** minimise `f(x,y) = xy` subject to `x + y = 4`. With `L = xy - λ(x+y-4)`, the conditions give `x = y = λ`, so `2x = 4`, `x = y = 2`, `f = 4` — indeed the largest product of two numbers summing to 4 is `2 x 2 = 4`.

**What this means for AI:** constrained optimization appears in SVMs (margin subject to correct classification), in resource-aware training (accuracy subject to latency), and in forcing outputs to be valid probabilities. The `λ` here and the `λ` of 4.8 are the same idea from two sides.

**Example question:** Minimise `f(x, y) = x^2 + y^2` subject to `x + y = 1` using Lagrange multipliers. Give the optimal point, the minimum value and `λ`.

**Solution:**

Step 1: write the constraint as `g(x,y) = x + y - 1 = 0` and build the Lagrangian.

```latex
\mathcal{L}(x, y, \lambda) = x^2 + y^2 - \lambda(x + y - 1)
```

Step 2: differentiate with respect to each variable and set to zero.

```latex
\frac{\partial \mathcal{L}}{\partial x} = 2x - \lambda = 0 \Rightarrow \lambda = 2x, \qquad \frac{\partial \mathcal{L}}{\partial y} = 2y - \lambda = 0 \Rightarrow \lambda = 2y
```

```latex
\frac{\partial \mathcal{L}}{\partial \lambda} = -(x + y - 1) = 0 \Rightarrow x + y = 1
```

Step 3: combine. From the first two, `2x = 2y`, so `x = y`. Substituting into the constraint: `2x = 1`, so `x = y = 0.5`.

Step 4: compute the value and the multiplier. `f(0.5, 0.5) = 0.25 + 0.25 = 0.5` and `λ = 2(0.5) = 1`.
Step 5: geometric check. This is the point on `x + y = 1` closest to the origin; that distance is `|0+0-1|/sqrt(1^2+1^2) = 1/sqrt2 ≈ 0.7071`, and `0.7071^2 = 0.5`.

Step 6: interpret `λ`. The optimum is `f* = c^2/2` for the constraint `x + y = c`, so `df*/dc = c = 1` at `c = 1`. Check: relaxing to `x + y = 1.1` gives `x = y = 0.55` and `f = 0.605`, up by `0.105`; tightening to `0.9` gives `f = 0.405`, down by `0.095`. Both `≈ λ x 0.1`.

**Final answer:** optimum at `(x, y) = (0.5, 0.5)`, minimum value `f = 0.5`, and `λ = 1`. This is the closest point on `x + y = 1` to the origin, at distance `1/sqrt2`.

⚠️ **Common trap:** the sign convention. Both `f - λg` and `f + λg` are used in different textbooks; the stationary point is identical but `λ` flips sign, so state your convention. The second trap is assuming Lagrange multipliers find the *global* optimum — they only find stationary points, so on a closed region you must also check the boundary.

---

## 4.8 Regularisation as an optimization idea

### Intuition

A student who memorises past papers word for word scores 100 on them and fails a new paper. A model that memorises training data does the same: it fits noise, using wild parameter values that swing violently between data points. The parameter values are the tell — memorising models have **huge weights**.

Regularisation is the mathematical version of "keep it simple": add a penalty for large weights so the optimizer must trade accuracy against simplicity.

### The idea, step by step

**Step 1 – The penalised objective.** Add a term that grows with the size of `w`:

```latex
J(\mathbf{w}) = L(\mathbf{w}) + \lambda\, R(\mathbf{w})
```

`L` is the usual loss, `R` the **penalty** (regulariser), `λ >= 0` the trade-off. `λ = 0` means no regularisation; a huge `λ` means "keep the weights near zero even if the fit suffers".

**Step 2 – L2 regularisation (Ridge)** penalises the sum of squares:

```latex
R(\mathbf{w}) = \|\mathbf{w}\|_2^2 = \sum_j w_j^2, \qquad \frac{\partial R}{\partial w_j} = 2w_j
```

The gradient contribution is `2λ w_j`, **proportional to the weight itself**: big weights get pushed hard, small ones gently. So L2 **shrinks everything smoothly** and rarely reaches exactly zero. It also adds `2λI` to `A^T A`, improving conditioning — which is why Ridge is the standard fix for collinear features.

**Step 3 – L1 regularisation (Lasso)** penalises the sum of absolute values:

```latex
R(\mathbf{w}) = \|\mathbf{w}\|_1 = \sum_j |w_j|, \qquad \frac{\partial R}{\partial w_j} = \operatorname{sign}(w_j)
```

The gradient contribution is `λ · sign(w_j)` — a **constant push toward zero regardless of the weight's size**. Compare:

| Weight size | L2 push toward zero | L1 push toward zero |
| --- | --- | --- |
| `w = 10` | `20λ` (strong) | `λ` |
| `w = 0.01` | `0.02λ` (almost nothing) | `λ` (full strength) |

**Step 4 – Why L1 gives sparsity.** For a tiny weight, L2's push is negligible but L1's is undiminished. So L1 drives small weights **all the way to exactly zero** and holds them there. Those features are effectively deleted — automatic feature selection.

**One-line geometric intuition:** the L1 "ball" of allowed weights is a **diamond with sharp corners on the axes**; the loss's elliptical level curves grow outward and almost always first touch the diamond at a corner, and a corner means some coordinates are exactly zero. The L2 ball is a smooth circle, so the touch point is generically off-axis and nothing is exactly zero.

**Step 5 – One worked comparison.** Take `L(w) = (w-3)^2`, so the unregularised answer is `w = 3`. With L2 and `λ = 1`, minimise `(w-3)^2 + w^2`: derivative `2(w-3) + 2w = 4w - 6 = 0` gives `w = 1.5`. With L2 and `λ = 0.5`: `2(w-3) + w = 3w - 6 = 0` gives `w = 2`. With L1 and `λ = 1` (for `w > 0`): `2(w-3) + 1 = 2w - 5 = 0` gives `w = 2.5`.

So: no penalty -> 3, mild L2 -> 2, strong L2 -> 1.5, L1 -> 2.5. Stronger `λ` always pulls toward zero, and the L2 closed form `w = 3/(1+λ)` shows the **proportional shrink** explicitly.

**What this means for AI:** every modern training script has a `weight_decay` setting — that is L2. Choosing L1 instead gives an inspectable model, because the surviving non-zero weights are the features it actually uses. Both justify "simpler models generalise better".

**Example question:** A model has loss `L(w) = (w - 3)^2` on one parameter. Find the optimal `w` for (a) no regularisation, (b) L2 with `λ = 2`, (c) L1 with `λ = 1`. Which gives the sparsest answer, and why?

**Solution:**

Step 1: write each objective and differentiate.

```latex
\begin{aligned}
\text{(a)}\quad & J = (w-3)^2, && J' = 2(w-3) = 0 &&\Rightarrow w = 3 \\
\text{(b)}\quad & J = (w-3)^2 + 2w^2, && J' = 2(w-3) + 4w = 6w - 6 = 0 &&\Rightarrow w = 1 \\
\text{(c)}\quad & J = (w-3)^2 + |w|, && \text{for } w>0:\ 2(w-3) + 1 = 2w - 5 = 0 &&\Rightarrow w = 2.5
\end{aligned}
```

Step 2: check the assumption in (c) that `w > 0`. We found `w = 2.5 > 0`, so it is consistent. (Had it come out negative we would redo the case `w < 0`, where the derivative is `2(w-3) - 1`.)

Step 3: confirm each is a minimum by the second derivative: `2 > 0`, `6 > 0`, `2 > 0`.

**Final answer:** (a) `w = 3`, (b) `w = 1`, (c) `w = 2.5`. None is exactly zero here, because in one dimension a single large weight has no reason to vanish. Sparsity shows up in **many** dimensions: with 100 features, L1 pushes the weakest 60 or so weights to exactly zero while L2 shrinks all 100 to small non-zero values. That is why L1 is called feature selection.

⚠️ **Common trap:** never penalise the **intercept** (bias). Shrinking it toward zero shifts the model off-centre, hurting accuracy without controlling complexity. Libraries exclude it by default; a hand-written loop usually does not.

---

## 4.9 Common pitfalls

### Intuition

Debugging a model that will not train is mostly asking "which of the five usual suspects is it?" Here they are, with how each looks from the outside.

**1. Local minima.** A non-convex loss can have several valleys, and gradient descent finds the one it walks into. In high dimensions, true bad local minima are rarer than people fear — most critical points are **saddles**, flat one way and curved down another. Momentum and noise help escape both.

**2. Saddle points.** Gradient is zero but it is not a minimum, so plain gradient descent slows to a crawl near one. This is a main reason momentum and adaptive methods exist.

**3. Learning rate** — the single most common cause of a broken run. Read the signature:

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Loss decreases extremely slowly | learning rate too small | multiply `η` by 3-10 |
| Loss oscillates, or becomes `NaN` / infinity | learning rate too large (or a division by zero) | divide `η` by 3-10, check for `log(0)` |
| Loss flat from step 1 | learning rate ~0, or gradients are zero | check the gradient computation |
| Loss falls then plateaus early | needs a decay schedule, or the model is too small | add decay, enlarge the model |

**4. Feature scaling.** If feature 1 ranges over `0-1` and feature 2 over `0-100000`, the loss surface is a long thin ravine. The gradient along feature 2 is enormous and along feature 1 tiny, so no single learning rate suits both: you either diverge in one direction or crawl in the other. **Standardising features** (subtract the mean, divide by the standard deviation) makes the surface round and the problem easy — which is why `StandardScaler` is step one in almost every pipeline.

**5. Silent logic bugs.** Loss falls nicely but the model is nonsense. Usual causes: labels shuffled out of alignment with inputs, a missing intercept column, the target accidentally included as a feature, or accuracy measured on the training set only.

**What this means for AI:** this list is the practical content of "why is my model not learning" — 4.3 and 4.4 turn a vague complaint into a specific diagnosis.

**Example question:** A model with two features has loss `L(w_1, w_2) = w_1^2 + 1000 w_2^2`. One learning rate `η` is used for both. For which `η` does each coordinate converge, and what does that tell you?

**Solution:**

Step 1: differentiate. `∂L/∂w_1 = 2w_1` and `∂L/∂w_2 = 2000 w_2`.
Step 2: write each update as a multiplication factor (the coordinates evolve independently here). `w_1 <- (1 - 2η) w_1` and `w_2 <- (1 - 2000η) w_2`.
Step 3: require both factors to lie strictly between -1 and 1. `0 < η < 1` for `w_1`, and `0 < η < 0.001` for `w_2`.
Step 4: intersect: the common safe range is `0 < η < 0.001`.

Step 5: interpret. At `η = 0.001`, `w_2` converges in one step but `w_1` shrinks by only `0.2%` per step, needing thousands of steps. At `η = 0.5`, `w_1` is fine but `w_2` blows up instantly.

**Final answer:** `0 < η < 1` for `w_1`, `0 < η < 0.001` for `w_2`, so any single `η` must be below `0.001` — and then `w_1` learns about 500 times too slowly. The fix is not a better learning rate but **rescaling the features** so the curvatures match, after which one `η` suits both.

⚠️ **Common trap:** tuning the learning rate for an hour when the real problem is unscaled features. If the loss curve is smooth but glacial, check the feature scales *before* touching `η`.

---

## 4.10 AI/ML meaning throughout

| Maths idea | What it is in AI |
| --- | --- |
| Loss function `L(w)` | The number training minimises: MSE, cross-entropy, hinge |
| Parameter vector `w` | All the weights and biases of the model |
| `∇f = 0` | A stationary point of the loss, where training settles |
| Hessian / curvature | Whether that point is a minimum, maximum or saddle |
| Convexity | One-valley guarantee: linear and logistic regression, SVMs |
| Non-convexity | Neural networks: many valleys, saddles, no guarantees |
| Gradient descent | The training loop of every neural network |
| Learning rate `η` | The `lr` hyperparameter, the most important one to tune |
| SGD / mini-batch | How real training consumes data (batches of 32-512) |
| Momentum | SGD with momentum, and half of Adam |
| Normal equations | Closed-form linear regression, `(X^T X)^{-1} X^T y` |
| Projection / orthogonality | Why the residual is perpendicular to the features |
| Lagrange multipliers | Constraints: SVMs, budgets, valid probability outputs |
| L1 / L2 penalty | Lasso / Ridge, `weight_decay`, feature selection |
| Feature scaling | Why `StandardScaler` is step one in every pipeline |

**Example question:** A training script sets `lr = 0.001`, `batch_size = 64` and `weight_decay = 0.01`, and trains by gradient descent. Name the part of this module each setting comes from.

**Solution:**

Step 1: `lr` is `η` in the update rule `w <- w - η ∇f(w)` — section 4.4. Too small and training crawls, too large and the loss diverges.

Step 2: `batch_size = 64` means the gradient is averaged over 64 examples per step — mini-batch SGD from 4.5, a noisy but unbiased estimate of the full gradient.

Step 3: `weight_decay = 0.01` adds `0.01 ‖w‖^2` to the loss — L2 regularisation from 4.8, whose gradient contribution is `2(0.01) w`, a proportional shrink of every weight.

**Final answer:** 4.4 supplies `lr`, 4.5 supplies `batch_size`, and 4.8 supplies `weight_decay`. The loop itself is 4.4, and the whole thing minimises the loss from 4.1.

**Why this module is the core of training:** everything else in this subject describes the model; this module describes how the model *changes*. Gradient descent plus the chain rule from Module 3 (backpropagation) is the complete mechanism by which a neural network learns, and every framework — PyTorch, TensorFlow, JAX — is an efficient implementation of the update rule in 4.4.

---

## Formula / rule summary table

| Rule | Formula | When to use |
| --- | --- | --- |
| Gradient at an optimum | `∇f(w) = 0` | to locate candidate points |
| 2-D test | `D = f_xx f_yy - f_xy^2` | classifying a critical point in two variables |
| Convexity (1-D) | `f''(x) >= 0` everywhere | checking for one global valley |
| Convexity (Hessian) | `H` PSD everywhere | checking a multivariable problem |
| Gradient descent | `w_{k+1} = w_k - η ∇f(w_k)` | when no closed form exists |
| Convergence factor | `abs(1 - η · curvature)` | predicting speed or divergence |
| Momentum | `v = βv + g`, `w = w - ηv` | zig-zagging or slow progress |
| Normal equations | `A^T A w = A^T b` | least squares with few features |
| Lagrangian | `L = f - λg`, `∇f = λ∇g` | one equality constraint |
| L2 (Ridge) | `L(w) + λ‖w‖_2^2`, grad `2λw` | shrink weights smoothly |
| L1 (Lasso) | `L(w) + λ‖w‖_1`, grad `λ sign(w)` | shrink, and force exact zeros |

### Which formula when? (mini-guide)

- Need to *find* where the loss is flat -> solve `∇f = 0`.
- Need to know *what kind* of flat point -> Hessian: `D > 0, f_xx > 0` min; `D > 0, f_xx < 0` max; `D < 0` saddle.
- Asked "is this problem guaranteed easy?" -> test convexity (`f'' >= 0`, or `H` PSD).
- Cannot solve `∇f = 0` by hand -> gradient descent.
- Asked "will it converge, and how fast?" -> the factor `abs(1 - η · curvature)`; `< 1` converges.
- Loss zig-zags -> lower `η`; crawls -> raise `η`; crawls in only one weight -> scale the features.
- More rows than columns and you want a line -> normal equations `A^T A w = A^T b`.
- Words *subject to* or *given that* appear -> Lagrange multiplier.
- Words *keep it simple*, *avoid overfitting*, *too many features* -> L2 (shrink) or L1 (delete).
- Need interpretable features (many exact zeros) -> L1; need stability with correlated features -> L2.

---

## Solved examples

### Example 1 (easy): classify a critical point in two variables

**Question:** Find and classify the critical point of `f(x, y) = x^2 + y^2 - 2x - 4y + 5`.

**Solution:**

Step 1: partial derivatives and the critical point condition. `f_x = 2x - 2 = 0` gives `x = 1`, and `f_y = 2y - 4 = 0` gives `y = 2`.
Step 2: second derivatives and the determinant. `f_xx = 2`, `f_yy = 2`, `f_xy = 0`, so `D = 4 - 0 = 4 > 0`.
Step 3: verdict. `D > 0` and `f_xx = 2 > 0`, so it is a **local minimum**. The Hessian is constant and positive definite, so the function is convex and this local minimum is also **global**.

Step 4: the value: `f(1, 2) = 1 + 4 - 2 - 8 + 5 = 0`.

**Final answer:** unique global minimum at `(1, 2)` with value `0`. Indeed `f = (x-1)^2 + (y-2)^2`, a bowl sitting on zero.

### Example 2 (medium): gradient descent on a two-variable quadratic

**Question:** Minimise `f(x, y) = x^2 + 2y^2` by gradient descent from `(2, 1)` with `η = 0.1`. Run four iterations and state the exact behaviour.

**Solution:**

Step 1: the gradient is `∇f = (2x, 4y)`, so the updates separate (no cross term): `x <- 0.8x` and `y <- 0.6y`.
Step 2: iterate and tabulate.

| `k` | `x_k` | `y_k` | `f = x^2 + 2y^2` |
| --- | --- | --- | --- |
| 0 | 2.0 | 1.0 | 6.0 |
| 1 | 1.6 | 0.6 | 3.28 |
| 2 | 1.28 | 0.36 | 1.8976 |
| 3 | 1.024 | 0.216 | 1.141888 |
| 4 | 0.8192 | 0.1296 | 0.704681 |

Check row 1 by hand: `x_1 = 2 - 0.1(4) = 1.6`, `y_1 = 1 - 0.1(4) = 0.6`, `f = 2.56 + 0.72 = 3.28`.

Step 3: explain the rates. `x` shrinks by `0.8` per step and `y` by `0.6`, so `y` converges faster — it has the larger curvature (`4` versus `2`). The factors are `|1 - 0.1(2)| = 0.8` and `|1 - 0.1(4)| = 0.6`.

**Final answer:** after four iterations `(x, y) ≈ (0.8192, 0.1296)` with `f ≈ 0.7047`, heading to the minimum `(0,0)`. Different coordinates converge at different rates set by their curvature — exactly the effect feature scaling fixes.

### Example 3 (exam level): normal equations versus gradient descent

**Question:** Fit `y = w_0 + w_1 x` to `(0, 1), (1, 2), (2, 4)` by (a) the normal equations and (b) two gradient-descent steps from `(0,0)` with `η = 0.1`. Compare.

**Solution:**

Step 1: sums. `n = 3`, `Σx = 3`, `Σx^2 = 5`, `Σy = 7`, `Σxy = 0 + 2 + 8 = 10`.

Step 2: (a) the normal equations.

```latex
\begin{pmatrix} 3 & 3 \\ 3 & 5 \end{pmatrix}\begin{pmatrix} w_0 \\ w_1 \end{pmatrix} = \begin{pmatrix} 7 \\ 10 \end{pmatrix}
```

Step 3: solve. Subtracting the first equation from the second gives `2w_1 = 3`, so `w_1 = 1.5`; then `3w_0 + 4.5 = 7`, so `w_0 = 2.5/3 ≈ 0.8333`.

Step 4: check the residuals. Predictions `0.8333, 2.3333, 3.8333`; residuals `+0.1667, -0.3333, +0.1667`. Sum `= 0`, and `Σ x r = 0 - 0.3333 + 0.3333 = 0`. `SSE = 0.02778 + 0.11111 + 0.02778 = 0.16667 = 1/6`.

Step 5: (b) gradient descent. The gradient of `L = ‖Aw - b‖^2` is `2A^T(Aw - b)`. At `w = (0,0)` the residual is `(-1, -2, -4)`, so `A^T r = (-7, -10)` and `∇L = (-14, -20)`. `w_1 = (0,0) - 0.1(-14, -20) = (1.4, 2.0)`.
Step 6: second step. At `(1.4, 2.0)` the predictions are `1.4, 3.4, 5.4`, residuals `+0.4, +1.4, +1.4`, so `A^T r = (3.2, 4.2)` and `∇L = (6.4, 8.4)`, giving `w_2 = (1.4, 2.0) - 0.1(6.4, 8.4) = (0.76, 1.16)`.

**Final answer:** (a) `w_0 = 5/6 ≈ 0.8333`, `w_1 = 1.5`, `SSE = 1/6`. (b) after two steps `w ≈ (0.76, 1.16)`, still short of the optimum but heading straight at it. The normal equations give the exact answer in one shot; gradient descent needs many steps but scales to millions of parameters, where `(A^T A)^{-1}` cannot be computed.

---

## Common traps and mistakes

- **"Gradient zero means minimum."** It means *stationary*. Without the second-order check you will report a saddle as a minimum.
- **Forgetting the minus sign in the update.** `w + η∇f` climbs the hill, so the loss rises and you hunt for a data bug that does not exist.
- **Dividing a mini-batch gradient by `n` instead of the batch size.** Steps become microscopic and training looks broken.
- **Tuning the learning rate while features are unscaled.** The real problem is conditioning; fix the scales first.
- **Dropping the intercept column** in a least-squares design matrix. Different model, worse fit, residuals no longer sum to zero.
- **Testing `D > 0` but forgetting `f_xx`.** `D > 0` alone cannot tell a minimum from a maximum.
- **Regularising the intercept.** It hurts accuracy and does not control complexity.
- **Stopping at the Lagrange stationary point.** On a closed region you must also check the boundary.

---

## Quick revision box

- ✅ Training = minimising a loss `L(w)`. Model -> loss -> plug in data -> minimise. Nothing more.
- ✅ At an interior optimum `∇f = 0`. Classify with `D = f_xx f_yy - f_xy^2`: `D > 0, f_xx > 0` min; `D > 0, f_xx < 0` max; `D < 0` saddle.
- ✅ Convex = bowl = every local min is global. Test: `f'' >= 0`, or Hessian PSD (`f_xx >= 0` and `det >= 0` in 2-D).
- ✅ Gradient descent: `w_{k+1} = w_k - η ∇f(w_k)`. For a quadratic the error shrinks by `abs(1 - η · curvature)` per step; `>= 1` means no convergence. Small `η` = slow, large `η` = oscillate or diverge (try `0.001` to `0.1`).
- ✅ SGD = one example per step, mini-batch = 32-512, momentum keeps `v = βv + g` to cancel zig-zag.
- ✅ Least squares: minimise `‖Aw - b‖^2` -> `A^T A w = A^T b`; the residual is orthogonal to the columns (Module 1 projection).
- ✅ Constrained: `L = f - λg`, solve `∇f = λ∇g` plus the constraint; `λ` is the shadow price.
- ✅ Regularisation: add `λ‖w‖^2` (L2, smooth shrink) or `λ‖w‖_1` (L1, constant push -> exact zeros -> feature selection).

---

## Practice questions

1. Classify the critical points of `f(x) = x^3 - 6x^2 + 9x`.
2. Find and classify the critical point of `f(x, y) = x^2 + y^2 + xy`.
3. Is `f(x) = x^4` convex? Is it strictly convex? Justify with the second derivative.
4. Run three iterations of gradient descent on `f(x) = (x - 5)^2` from `x_0 = 0` with `η = 0.2`, and give the convergence factor.
5. Fit `y = w_0 + w_1 x` to `(0, 2), (1, 3), (2, 5), (3, 6)` using the normal equations.
6. Minimise `x^2 + y^2` subject to `2x + y = 5` by Lagrange multipliers.

## Answers

**1.** `f'(x) = 3x^2 - 12x + 9 = 3(x-1)(x-3)`, so critical points at `x = 1, 3`. `f''(x) = 6x - 12`, so `f''(1) = -6 < 0` gives a local **maximum** at `x = 1` with `f = 4`, and `f''(3) = 6 > 0` gives a local **minimum** at `x = 3` with `f = 0`.

**2.** `f_x = 2x + y = 0` and `f_y = 2y + x = 0` give `x = y = 0`. Hessian `[[2, 1], [1, 2]]`, so `D = 4 - 1 = 3 > 0` and `f_xx = 2 > 0` -> **local minimum** at `(0,0)` with value `0`. The Hessian is constant and positive definite, so it is the global minimum.

**3.** `f'(x) = 4x^3` and `f''(x) = 12x^2 >= 0` for all `x`, so `f` is **convex**. It is also **strictly convex**: `f'' > 0` everywhere except the single isolated point `x = 0`, and an isolated zero of `f''` does not break strict convexity (`x^4` does curve upward). The minimum at `x = 0` is unique.

**4.** Gradient `f'(x) = 2(x - 5)`. `x_1 = 0 - 0.2(-10) = 2`; `x_2 = 2 - 0.2(-6) = 3.2`; `x_3 = 3.2 - 0.2(-3.6) = 3.92`. Factor `abs(1 - 2(0.2)) = 0.6`, so the error `x_k - 5` shrinks by `0.6` each step: `-5, -3, -1.8, -1.08`.

**5.** `n = 4`, `Σx = 6`, `Σx^2 = 14`, `Σy = 16`, `Σxy = 0 + 3 + 10 + 18 = 31`. The system is `4w_0 + 6w_1 = 16` and `6w_0 + 14w_1 = 31`. From the first, `w_0 = 4 - 1.5w_1`; substituting gives `24 - 9w_1 + 14w_1 = 31`, so `5w_1 = 7`, `w_1 = 1.4`, `w_0 = 1.9`. Answer: **`y = 1.9 + 1.4x`**.

**6.** `L = x^2 + y^2 - λ(2x + y - 5)`. Then `2x - 2λ = 0` gives `x = λ`, and `2y - λ = 0` gives `y = λ/2`. The constraint gives `2λ + λ/2 = 5`, so `2.5λ = 5` and `λ = 2`. Hence `x = 2`, `y = 1`, and the minimum value is `f = 4 + 1 = 5`. Check: the distance from the origin to `2x + y = 5` is `5/sqrt5 = sqrt5`, and `(sqrt5)^2 = 5`.
