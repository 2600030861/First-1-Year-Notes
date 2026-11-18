# Mathematics for AI – Module 6

## From Maths to Models

*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

For five modules you have been collecting tools: matrices (M1, M2), derivatives (M3), gradient descent (M4), probability (M5). This module is where the toolbox gets used on **one small dataset**, start to finish, and you watch the four strands hold hands.

Nothing new is introduced here in terms of machinery. What is new is the **assembly**: data becomes a matrix, the matrix becomes a function, the function becomes a number (the loss), and the number gets pushed down until the function is useful. That loop is training. It is the same loop in a two-parameter line fit and in a 400-billion-parameter language model.

One analogy: think of a **pressure cooker**. Linear algebra is the vessel (it holds the data), calculus is the thermometer (it tells you which way the heat is moving), optimisation is the flame knob (it actually changes something), and probability is the recipe's honesty about how much you can trust the result. Take away one and dinner does not happen.

**Prerequisites:** everything from M1–M5, but only these four working pieces:

1. `y = Xw` — a matrix times a vector gives predictions (M1.3).
2. `d/dw` of a squared error, and the chain rule (M3.2, M3.6).
3. `w <- w - lr * dL/dw` — the gradient-descent update (M4.4).
4. `p = 1/(1 + e^-z)` and "probability of a 0/1 outcome" (M5.4, M5.6).

---

## 6.1 The data-to-model pipeline mathematically

### Intuition

Every ML system, from a linear fit to GPT, is the same five boxes in a row. Once you can name the five boxes and say what shape of object sits between them, you can read almost any ML paper's method section.

### The idea, step by step

**Box 1 — Data as matrices/vectors.** One row = one example. One column = one feature.

```latex
X \in \mathbb{R}^{n \times d}, \qquad \mathbf{y} \in \mathbb{R}^{n}, \qquad n = \text{rows (examples)}, \quad d = \text{columns (features)}
```

**Box 2 — A model as a function.** A model is just a rule that eats a row and returns a number. For a line:

```latex
\hat{y} = f(\mathbf{x}; \mathbf{w}, b) = \mathbf{w}\cdot\mathbf{x} + b
```

The `;` means "these are the knobs we are allowed to turn". Data is fixed, parameters are free.

**Box 3 — A loss.** One number that says how wrong the model is on the whole dataset. Smaller = better.

```latex
L(\mathbf{w}, b) = \frac{1}{n}\sum_{i=1}^{n} \ell\big(\hat{y}_i,\ y_i\big) \qquad \text{loss} : \mathbb{R}^{d+1} \to \mathbb{R}
```

Notice the shape change: a whole table of predictions collapses into **one scalar**. That collapse is what makes optimisation possible — you cannot "minimise a table".

**Box 4 — Optimisation.** Search the parameter space for the smallest loss. **Box 5 — A trained model.** Freeze the knobs at `w*, b*`: the same function, now a product you can call on unseen rows.

```latex
(\mathbf{w}^{*}, b^{*}) = \operatorname*{arg\,min}_{\mathbf{w},\,b}\ L(\mathbf{w}, b)
```

Here is the whole pipeline as one picture:

```text
   DATA                 MODEL                  LOSS                OPTIMISATION          TRAINED MODEL
 (linear algebra)    (linear algebra)      (probability)      (calculus + optimisation)
                                                       
 x1  x2  |  y         z = w1*x1 + w2*x2 + b      L = 1/n * sum(l)     w <- w - lr * dL/dw      y_hat = w*.x + b*
 ----------------------------------------------------------------> repeat until L stops falling ------->
 [ 1  2  |  2 ]             |                        |                     |                        |
 [ 2  1  |  3 ]   X (4x2)  w (2x1)  -->  y_hat (4x1)  -->  L (1 number)  -->  new w  -->  frozen w*  -->  new row in,
 [ 3  3  |  5 ]                                                                                              number out
 [ 4  2  |  6 ]
```

**The dataset we carry through this whole module.** Four students, two features, two different targets. Same four rows everywhere, so you can see one problem solved three ways.

| Student | `x1` hours studied | `x2` hours slept | `y` marks (regression target) | `t` cleared exam (0/1) |
| --- | --- | --- | --- | --- |
| S1 | 1 | 2 | 2 | 0 |
| S2 | 2 | 1 | 3 | 0 |
| S3 | 3 | 3 | 5 | 1 |
| S4 | 4 | 2 | 6 | 1 |

`y` is a number we predict (regression, 6.2). `t` is a yes/no we predict (classification, 6.3). `x1, x2` are the inputs for the tiny network (6.4). Note `t = 1` exactly when marks are 5 or more — we will use that fact in 6.3.

**Example question:** Our four rows are stored with both features. (a) Give the shape of `X`, `w` and the prediction vector `y_hat`. (b) How many numbers does the loss produce, and why does that matter? (c) If we later add a third feature and a bias term, what changes in the shapes?

**Solution:**

Step 1 — Count rows and columns. 4 students, 2 features: `X` is `4 x 2`. (Reason: rows = examples, columns = features.)

Step 2 — Weights match the feature count: `w` is `2 x 1`. (Reason: one weight per column of `X`, so `Xw` is legal: `(4x2)(2x1) = (4x1)`.)

Step 3 — The loss averages those 4 numbers into **one scalar**. (Reason: optimisation needs a single objective to minimise; a vector has no "smallest" in general.)

Step 4 — With a bias, append a column of 1s to `X` (giving `4 x 3`) and append `b` to `w` (giving `3 x 1`). Shapes become `X: 4x3`, `w: 3x1`, still `y_hat: 4x1`.

**Final answer:** (a) `X` is 4x2, `w` is 2x1, `y_hat` is 4x1. (b) One number — the loss is a scalar so gradient descent has something to minimise. (c) `X` becomes 4x3 (column of 1s added), `w` becomes 3x1, `y_hat` stays 4x1.

⚠️ **Common trap:** Writing `Xw` when `w` is a row vector. Shapes must cancel from the inside out: `(4x2)(2x1)` works, `(4x2)(1x2)` does not. Half the marks in shape questions are lost here.

---

## 6.2 Linear regression end-to-end

### Intuition

You have hours studied on the x-axis and marks on the y-axis. Draw the straight line that sits "closest" to the four dots. That is linear regression. The only real question is what "closest" means — and that choice is where the probability strand quietly walks in.

### The idea, step by step

**Step 1 — The model.** One feature for now, so we drop `x2`:

```latex
\hat{y} = w x + b
```

`w` = slope (marks gained per extra hour), `b` = intercept (marks with zero study).

**Step 2 — The loss: squared error.** For each row the residual is `r_i = y_hat_i - y_i`. Square it (so + and - errors do not cancel) and average:

```latex
J(w,b) = \frac{1}{2n}\sum_{i=1}^{n}\big(\hat{y}_i - y_i\big)^2 = \frac{1}{2n}\sum_{i=1}^{n}\big(w x_i + b - y_i\big)^2
```

The `1/2` is cosmetic — it cancels with the 2 that falls out when we differentiate. It does not move the minimum.

**Why squared error and not absolute error?** Two reasons. (1) It is differentiable everywhere, so calculus applies. (2) The probability reason: if each mark is the true line plus Gaussian noise, `y_i = w x_i + b + e_i` with `e_i ~ N(0, sigma^2)`, then maximising the likelihood of the data is *exactly* minimising the sum of squares (M5.7). So least squares is not an arbitrary choice; it is the maximum-likelihood answer under a Gaussian-noise assumption. That is the probability strand contributing.

**Step 3 — Route A: normal equations (linear algebra).** Write all four rows at once. `X` gets a column of 1s so the bias is just another weight:

```latex
X = \begin{pmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \\ 1 & 4 \end{pmatrix}, \qquad \mathbf{y} = \begin{pmatrix} 2 \\ 3 \\ 5 \\ 6 \end{pmatrix}, \qquad \boldsymbol{\theta} = \begin{pmatrix} b \\ w \end{pmatrix}
```

We want `X theta = y`, but 4 equations, 2 unknowns, and `y` is not in the column space of `X`. So project (M1.9) — the leftover error must be orthogonal to the columns, giving the normal equations:

```latex
X^{\mathsf T}X\,\boldsymbol{\theta} = X^{\mathsf T}\mathbf{y}
```

Compute each piece:

```latex
X^{\mathsf T}X = \begin{pmatrix} 4 & 10 \\ 10 & 30 \end{pmatrix}, \qquad X^{\mathsf T}\mathbf{y} = \begin{pmatrix} 1\cdot2+1\cdot3+1\cdot5+1\cdot6 \\ 1\cdot2+2\cdot3+3\cdot5+4\cdot6 \end{pmatrix} = \begin{pmatrix} 16 \\ 47 \end{pmatrix}
```

`det = 4(30) - 10(10) = 20`, so

```latex
(X^{\mathsf T}X)^{-1} = \frac{1}{20}\begin{pmatrix} 30 & -10 \\ -10 & 4 \end{pmatrix} = \begin{pmatrix} 1.5 & -0.5 \\ -0.5 & 0.2 \end{pmatrix}
```

```latex
\boldsymbol{\theta} = \begin{pmatrix} 1.5 & -0.5 \\ -0.5 & 0.2 \end{pmatrix}\begin{pmatrix} 16 \\ 47 \end{pmatrix} = \begin{pmatrix} 24 - 23.5 \\ -8 + 9.4 \end{pmatrix} = \begin{pmatrix} 0.5 \\ 1.4 \end{pmatrix}
```

So `b = 0.5`, `w = 1.4`, i.e.

```latex
\hat{y} = 0.5 + 1.4x
```

**Check the fit** (never skip this):

| Student | `x` | `y` | `y_hat = 0.5 + 1.4x` | residual `r = y_hat - y` | `r^2` |
| --- | --- | --- | --- | --- | --- |
| S1 | 1 | 2 | 1.9 | -0.1 | 0.01 |
| S2 | 2 | 3 | 3.3 | 0.3 | 0.09 |
| S3 | 3 | 5 | 4.7 | -0.3 | 0.09 |
| S4 | 4 | 6 | 6.1 | 0.1 | 0.01 |

`SSE = 0.20`, `MSE = 0.20/4 = 0.05`, and `J = SSE/(2n) = 0.025`.

Two sanity checks that must hold for any least-squares line: **residuals sum to zero** (`-0.1+0.3-0.3+0.1 = 0`) and **residuals are orthogonal to the columns of X** (`sum r = 0` and `sum r*x = -0.1 + 0.6 - 0.9 + 0.4 = 0`). Both hold. Goodness of fit: `SST = sum (y - y_bar)^2` with `y_bar = 4` gives `4+1+1+4 = 10`, so `R^2 = 1 - SSE/SST = 1 - 0.2/10 = 0.98`.

**Step 4 — Route B: gradient descent (calculus + optimisation).** Same problem, no matrix inverse. Differentiate `J` — the only calculus is the chain rule on `(w x_i + b - y_i)^2`:

```latex
\frac{\partial J}{\partial w} = \frac{1}{n}\sum_{i=1}^{n}\big(\hat{y}_i - y_i\big)x_i, \qquad \frac{\partial J}{\partial b} = \frac{1}{n}\sum_{i=1}^{n}\big(\hat{y}_i - y_i\big)
```

(Reason: `d/dw` of `1/2 * r^2` is `r * dr/dw`, and `dr/dw = x_i`.)

Then walk downhill with `lr = 0.1`:

```latex
w \leftarrow w - \alpha\frac{\partial J}{\partial w}, \qquad b \leftarrow b - \alpha\frac{\partial J}{\partial b}
```

Iteration 1 from `(w, b) = (0, 0)`: all predictions are 0, so `r_i = -y_i = -2, -3, -5, -6`.

```latex
\frac{\partial J}{\partial w} = \frac{(-2)(1) + (-3)(2) + (-5)(3) + (-6)(4)}{4} = \frac{-47}{4} = -11.75, \qquad \frac{\partial J}{\partial b} = \frac{-16}{4} = -4
```

```latex
w = 0 - 0.1(-11.75) = 1.175, \qquad b = 0 - 0.1(-4) = 0.4
```

Continuing (these are the exact numbers a program prints):

| Iteration | `w` before update | `b` before update | `J` before update |
| --- | --- | --- | --- |
| 1 | 0.000000 | 0.000000 | 9.250000 |
| 2 | 1.175000 | 0.400000 | 0.276094 |
| 3 | 1.368750 | 0.466250 | 0.031868 |
| 4 | 1.400625 | 0.477438 | 0.025221 |
| after 4 steps | 1.405797 | 0.479538 | — |

It is crawling towards `(1.4, 0.5)` and `J` is crawling towards `0.025`, the value we got from the normal equations. **Both routes agree.** That is the whole point of 6.2: same model, same loss, two mathematical roads, one destination.

**Route A or Route B?** Use the closed form when `d` is small — one shot, no tuning. Use descent when `d` is huge or the loss is not quadratic, which covers logistic regression and every neural network.

**Java (Route A and Route B in one program):**

```java
public class MathToModels {
    public static void main(String[] args) {
        double[] x = {1, 2, 3, 4};          // hours studied
        double[] y = {2, 3, 5, 6};          // marks scored
        int n = x.length;

        // ---- Route 1: normal equations (only sums are needed for one feature)
        double sx = 0, sxx = 0, sy = 0, sxy = 0;
        for (int i = 0; i < n; i++) {
            sx += x[i];  sxx += x[i] * x[i];
            sy += y[i];  sxy += x[i] * y[i];
        }
        // solve  [ n  sx ][b]   [ sy  ]
        //        [ sx sxx ][w] = [ sxy ]  by Cramer's rule
        double det  = n * sxx - sx * sx;
        double bHat = (sxx * sy - sx * sxy) / det;
        double wHat = (n * sxy - sx * sy) / det;
        System.out.printf("normal equations: b = %.4f, w = %.4f%n", bHat, wHat);

        // ---- Route 2: gradient descent on J = 1/(2n) * sum (w*x+b - y)^2
        double w = 0, b = 0, lr = 0.1;
        for (int it = 1; it <= 4; it++) {
            double gw = 0, gb = 0, J = 0;
            for (int i = 0; i < n; i++) {
                double err = w * x[i] + b - y[i];
                gw += err * x[i];   // dJ/dw piece
                gb += err;          // dJ/db piece
                J  += err * err;
            }
            gw /= n;  gb /= n;  J /= 2 * n;
            System.out.printf("iter %d: w = %.6f, b = %.6f, J = %.6f%n", it, w, b, J);
            w -= lr * gw;
            b -= lr * gb;
        }
        System.out.printf("after 4 steps: w = %.6f, b = %.6f%n", w, b);
    }
}
```

It prints `normal equations: b = 0.5000, w = 1.4000`, then exactly the four rows of the table above, ending `after 4 steps: w = 1.405797, b = 0.479538`.

**Example question:** Fit the same model `y_hat = w x + b` using only the first three students (S1, S2, S3) with the normal equations. Report `w`, `b`, `SSE`, and explain in one line why the answer differs from the four-student fit.

**Solution:**

Step 1 — Collect sums for the 3 rows: `sum x = 1+2+3 = 6`, `sum x^2 = 1+4+9 = 14`, `sum y = 2+3+5 = 10`, `sum xy = 2+6+15 = 23`.

Step 2 — Normal equations `3b + 6w = 10` and `6b + 14w = 23`. (Reason: same `X^T X theta = X^T y` system, written out.)

Step 3 — Determinant `det = 3(14) - 6(6) = 42 - 36 = 6`.

Step 4 — Cramer: `w = (3(23) - 6(10))/6 = (69 - 60)/6 = 1.5` and `b = (14(10) - 6(23))/6 = (140 - 138)/6 = 0.3333`.

Step 5 — Predictions `0.3333 + 1.5x` at `x = 1, 2, 3` give `1.8333, 3.3333, 4.8333`. Residuals `-0.1667, 0.3333, -0.1667`, each squared `0.0278, 0.1111, 0.0278`.

Step 6 — `SSE = 1/6 = 0.1667`.

Step 7 — Why different: dropping S4 removes the point that pulls the line down at the right end, so the slope rises from 1.4 to 1.5. (Reason: least squares weights every row equally, so each row shifts the line.)

**Final answer:** `y_hat = 0.3333 + 1.5x`, `SSE = 1/6 ≈ 0.1667`. The slope is steeper than 1.4 because the four-student fit is dragged down by S4's `(4, 6)`.

⚠️ **Common trap:** Reporting `SSE = 0.1667` as "better than 0.20". It is a *smaller* number only because there is one fewer point — the fits are not comparable. Always compare `MSE` on the same rows, or on held-out rows.

---

## 6.3 Logistic regression

### Intuition

Now the target is 0/1: did the student clear the exam? A straight line answers with numbers like `0.5 + 1.4x`, which for `x = 4` gives `6.1` — not a probability, and it can go above 1 or below 0. We need to squash the line into `(0, 1)`. That squashing is the **sigmoid**.

### The idea, step by step

**Step 1 — The sigmoid.** Define `z = w x + b` (the same linear score as before, sometimes called the logit) and map it:

```latex
\sigma(z) = \frac{1}{1 + e^{-z}}
```

Properties you should be able to state: `sigma(0) = 0.5`, it is always between 0 and 1, it is increasing, and it saturates (`sigma(-6) ≈ 0.0025`, `sigma(+6) ≈ 0.9975`). Its derivative is beautifully self-referential:

```latex
\sigma'(z) = \sigma(z)\big(1 - \sigma(z)\big)
```

**Step 2 — Why the sigmoid, honestly.** Two reasons. (1) It maps the whole real line into `(0,1)`, so the output can be read as a probability. (2) It is the inverse of the **log-odds**, which is the natural scale for a yes/no bet. If `p` is the probability of clearing the exam, then

```latex
\text{odds} = \frac{p}{1-p}, \qquad \text{log-odds} = \ln\frac{p}{1-p} = z = wx + b
```

Inverting gives `p = 1/(1 + e^{-z})`, which is exactly the sigmoid. So logistic regression says: **the log-odds is a straight line in the features.** That is a much more believable assumption than "the probability is a straight line".

**Step 3 — Probabilistic interpretation.** Read the output as a Bernoulli probability (M5.6):

```latex
P(t = 1 \mid x) = \sigma(wx + b) = p, \qquad P(t = 0 \mid x) = 1 - p
```

Compact form (a standard trick worth knowing): `P(t | x) = p^t (1-p)^{1-t}`. Check it: if `t = 1` you get `p`, if `t = 0` you get `1 - p`.

**Step 4 — The loss: binary cross-entropy (BCE).** Take the negative log-likelihood of the four rows and average:

```latex
L(w,b) = -\frac{1}{n}\sum_{i=1}^{n}\Big[t_i \ln p_i + (1 - t_i)\ln(1 - p_i)\Big]
```

Why this and not squared error? Because it *is* the negative log-likelihood of the Bernoulli model — the probability strand again. Practically, it also punishes confident wrong answers brutally: predicting `p = 0.01` for a true `t = 1` costs `-ln(0.01) = 4.61`, while being right costs almost nothing.

**Step 5 — Derive the gradient (this is the exam bit).** Let `z = wx + b`, `p = sigma(z)`, and take one row's loss `l = -[t ln p + (1-t) ln(1-p)]`.

```latex
\begin{aligned}
\frac{\partial l}{\partial p} &= -\frac{t}{p} + \frac{1-t}{1-p} && \text{(differentiate the two logs)}\\[4pt]
\frac{\partial p}{\partial z} &= p(1-p) && \text{(sigmoid derivative)}\\[4pt]
\frac{\partial l}{\partial z} &= \left(-\frac{t}{p} + \frac{1-t}{1-p}\right)p(1-p) && \text{(chain rule)}\\[4pt]
&= -t(1-p) + (1-t)p = p - t && \text{(the algebra collapses)}
\end{aligned}
```

Then `dl/dw = (p - t)x` and `dl/db = (p - t)`. Averaging over rows:

```latex
\frac{\partial L}{\partial w} = \frac{1}{n}\sum_{i=1}^{n}(p_i - t_i)x_i, \qquad \frac{\partial L}{\partial b} = \frac{1}{n}\sum_{i=1}^{n}(p_i - t_i)
```

Look at how clean that is: **prediction minus truth, times input.** Identical in shape to the linear-regression gradient, except `p` is a probability. That is not a coincidence — both are "generalised linear models" with matching gradients.

**Step 6 — One worked numeric step.** Targets `t = 0, 0, 1, 1`. Start at `w = 0, b = 0`, so `z = 0` and `p = 0.5` for every row. Then `p_i - t_i = 0.5, 0.5, -0.5, -0.5`.

```latex
\frac{\partial L}{\partial w} = \frac{0.5(1) + 0.5(2) - 0.5(3) - 0.5(4)}{4} = \frac{0.5 + 1 - 1.5 - 2}{4} = \frac{-2}{4} = -0.5, \qquad \frac{\partial L}{\partial b} = \frac{0}{4} = 0
```

With `lr = 0.5`:

```latex
w = 0 - 0.5(-0.5) = 0.25, \qquad b = 0 - 0.5(0) = 0
```

Loss before: `L = ln 2 = 0.6931` (all four rows cost `ln 2`).

Loss after, at `(0.25, 0)`: `z = 0.25, 0.5, 0.75, 1.0` so `p = 0.5622, 0.6225, 0.6792, 0.7311`.

```latex
L = -\tfrac14\big[\ln(0.4378) + \ln(0.3775) + \ln(0.6792) + \ln(0.7311)\big] = \tfrac14\big[0.8259 + 0.9742 + 0.3868 + 0.3132\big] = 0.6250
```

It fell from `0.6931` to `0.6250`. Two more steps (all verified with the same loop in code):

| Iteration | `w` | `b` | `p` (S1..S4) | `L` | `dL/dw` | `dL/db` |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.0000 | 0.0000 | 0.5000, 0.5000, 0.5000, 0.5000 | 0.693147 | -0.5000 | 0.0000 |
| 2 | 0.2500 | 0.0000 | 0.5622, 0.6225, 0.6792, 0.7311 | 0.625037 | -0.0578 | 0.1487 |
| 3 | 0.2789 | -0.0744 | 0.5510, 0.6186, 0.6819, 0.7391 | 0.612427 | -0.0525 | 0.1476 |
| after 3 steps | 0.3051 | -0.1482 | — | — | — | — |

Those rows are what a plain Java loop prints: compute `pi = sigmoid(w*x[i] + b)`, accumulate `(pi - t[i])*x[i]` and `(pi - t[i])`, divide both by `n`, then step `w -= lr*gw` and `b -= lr*gb`. Nothing more is happening.

**Step 7 — One honest observation about our data.** Our four rows are *perfectly separable* by a threshold (`t = 1` for `x >= 3`). When data is separable, the loss keeps falling as `w` grows without bound: there is no finite minimum. That is why the probabilities drift slowly (S1 sits near 0.55 while `b` creeps negative) instead of snapping to 0 and 1. Nothing is broken — the mathematics is telling you the truth about this dataset. Real libraries add regularisation (M4.8) or early stopping for exactly this reason.

**Example question:** A model has `z = 1.4x + 0.5` (the regression line reused as a logit). Compute `p` for S1 and S4, the odds for S4, the BCE loss, and say in one line why this is a bad classifier here.

**Solution:**

Step 1 — S1: `z = 1.4(1) + 0.5 = 1.9`, so `p = 1/(1 + e^-1.9) = 1/(1 + 0.1496) = 0.8699`. (Reason: plug into the sigmoid.)

Step 2 — S4: `z = 1.4(4) + 0.5 = 6.1`, so `p = 1/(1 + e^-6.1) = 0.9978`.

Step 3 — Odds for S4: `p/(1-p) = 0.9978/0.0022 = 453.6`. (Reason: odds = p/(1-p); the model is claiming 453-to-1.)

Step 4 — BCE with `t = 0, 0, 1, 1`: the two negatives cost `-ln(1 - p)` and the two positives cost `-ln p`.
S1: `-ln(0.1301) = 2.0394`. S2 (`z = 3.3`, `p = 0.9644`): `-ln(0.0356) = 3.3358`. S3 (`z = 4.7`, `p = 0.9910`): `-ln(0.9910) = 0.0090`. S4: `-ln(0.9978) = 0.0022`.
`L = (2.0394 + 3.3358 + 0.0090 + 0.0022)/4 = 5.3864/4 = 1.3466`.

Step 5 — Compare with the trained value `0.6931` at `(w,b) = (0,0)`. The reused regression line is nearly twice as bad.

Step 6 — Why bad: S1 actually failed, yet gets an 87% chance of passing. Squared error on 0/1 labels rewards big confident margins, so it hands out extreme probabilities it cannot justify.

**Final answer:** `p(S1) = 0.8699`, `p(S4) = 0.9978`, odds `≈ 453.6`, `BCE = 1.3466` — worse than the untrained `0.6931`, because the regression line is badly calibrated as a probability.

⚠️ **Common trap:** Forgetting the `(1 - t)` half of BCE. If you write `L = -(1/n) sum t ln p`, the negative rows contribute nothing and the model happily gives every row `p = 1`.

---

## 6.4 A single neuron and a tiny neural network as mathematics

### Intuition

One neuron is: weighted sum, then squash. That is it. A network is many neurons, arranged in layers, each layer a matrix. The only genuinely new mathematics compared to 6.3 is that the loss now depends on weights through *two* squashing steps, so the chain rule has to be applied twice — that is backpropagation.

### The idea, step by step

**Step 1 — Weights as a matrix.** With 2 inputs and 2 hidden units, the hidden layer is a `2 x 2` matrix plus a `2 x 1` bias:

```latex
W^{(1)} = \begin{pmatrix} w_{11} & w_{12} \\ w_{21} & w_{22} \end{pmatrix}, \qquad \mathbf{b}^{(1)} = \begin{pmatrix} b_1 \\ b_2 \end{pmatrix}
```

Read `w_{jk}` as "weight from input `k` to hidden unit `j`". Then

```latex
\mathbf{z}^{(1)} = W^{(1)}\mathbf{x} + \mathbf{b}^{(1)}, \qquad \mathbf{h} = \sigma\big(\mathbf{z}^{(1)}\big)
```

`x` is `2 x 1`, `W x` is `2 x 1`, `h` is `2 x 1`. **The forward pass is just matrix-vector multiplication followed by an elementwise nonlinearity** — the M1.4 picture, with a squash on the end.

**Step 2 — Output layer.** One output unit with weights `v`:

```latex
z^{(2)} = \mathbf{v}\cdot\mathbf{h} + b_o = v_1 h_1 + v_2 h_2 + b_o, \qquad \hat{y} = \sigma\big(z^{(2)}\big)
```

**Step 3 — Loss.** Same BCE as 6.3, on the single output: `L = -[t ln y_hat + (1 - t) ln(1 - y_hat)]`.

**Step 4 — Backward pass = chain rule, twice.** Define the shorthand `delta = dL/dz` ("error at this layer's pre-activation"). Then:

```latex
\begin{aligned}
\delta^{(2)} &= \hat{y} - t && \text{(same clean form as 6.3)}\\
\frac{\partial L}{\partial v_j} &= \delta^{(2)} h_j, \qquad \frac{\partial L}{\partial b_o} = \delta^{(2)} && \text{(output weights)}\\
\delta^{(1)}_j &= \delta^{(2)} v_j\, h_j(1 - h_j) && \text{(push error back through } \sigma)\\
\frac{\partial L}{\partial w_{jk}} &= \delta^{(1)}_j x_k, \qquad \frac{\partial L}{\partial b_j} = \delta^{(1)}_j && \text{(input weights)}
\end{aligned}
```

Every factor has a name: `delta^(2)` is the output error, `v_j` says how strongly unit `j` affects the output, `h_j(1-h_j)` is the sigmoid slope at unit `j`, and `x_k` is the input. Nothing is magic — it is `dL/dw = dL/dz * dz/dw` applied layer by layer.

**Step 5 — A full hand pass on S3.** Input `x = (3, 3)`, target `t = 1`. Starting weights (deliberately tiny and round):

`W1 = [[0.1, 0.1], [-0.1, 0.2]]`, `b1 = (0.4, -0.2)`, `v = (0.5, -0.5)`, `b_o = 0`.

*Forward:*

```latex
\begin{aligned}
z_1 &= 0.1(3) + 0.1(3) + 0.4 = 1.0 &&\Rightarrow h_1 = \sigma(1.0) = 0.7311\\
z_2 &= -0.1(3) + 0.2(3) - 0.2 = 0.1 &&\Rightarrow h_2 = \sigma(0.1) = 0.5250\\
z^{(2)} &= 0.5(0.7311) - 0.5(0.5250) + 0 = 0.1031 &&\Rightarrow \hat{y} = \sigma(0.1031) = 0.5257\\
L &= -\ln(0.5257) = 0.6430
\end{aligned}
```

*Backward:*

```latex
\begin{aligned}
\delta^{(2)} &= 0.5257 - 1 = -0.4743\\
\frac{\partial L}{\partial v_1} &= -0.4743(0.7311) = -0.3467, \qquad \frac{\partial L}{\partial v_2} = -0.4743(0.5250) = -0.2490, \qquad \frac{\partial L}{\partial b_o} = -0.4743\\
\delta^{(1)}_1 &= -0.4743(0.5)(0.7311)(0.2689) = -0.0466\\
\delta^{(1)}_2 &= -0.4743(-0.5)(0.5250)(0.4750) = +0.0591\\
\frac{\partial L}{\partial w_{11}} &= \delta^{(1)}_1 x_1 = -0.0466(3) = -0.1399, \qquad \frac{\partial L}{\partial w_{12}} = -0.0466(3) = -0.1399, \qquad \frac{\partial L}{\partial b_1} = -0.0466\\
\frac{\partial L}{\partial w_{21}} &= 0.0591(3) = 0.1774, \qquad \frac{\partial L}{\partial w_{22}} = 0.1774, \qquad \frac{\partial L}{\partial b_2} = 0.0591
\end{aligned}
```

*One step with `lr = 0.5`* (subtract `lr * gradient`):

```latex
\begin{aligned}
v_1 &= 0.5 + 0.1734 = 0.6734, & v_2 &= -0.5 + 0.1245 = -0.3755, & b_o &= 0 + 0.2371 = 0.2371\\
w_{11} &= 0.1 + 0.0699 = 0.1699, & w_{12} &= 0.1699, & b_1 &= 0.4 + 0.0233 = 0.4233\\
w_{21} &= -0.1 - 0.0887 = -0.1887, & w_{22} &= 0.2 - 0.0887 = 0.1113, & b_2 &= -0.2 - 0.0296 = -0.2296
\end{aligned}
```

*Re-run the forward pass:* `y_hat = 0.6540`, `L = 0.4247`. The loss dropped from `0.6430` to `0.4247` in one step — the chain rule did its job.

Note the honest caveat: in real training the gradient is **averaged over all `n` rows** (one pass over the data is an "epoch"), not computed on a single row. We used one row because the arithmetic by hand is already 30 lines.

**Why the nonlinearity is not optional.** Without it, `h = W1 x + b1` and `y_hat = v·h + b_o`, so

```latex
\hat{y} = \mathbf{v}^{\mathsf T}W^{(1)}\mathbf{x} + (\mathbf{v}^{\mathsf T}\mathbf{b}^{(1)} + b_o) = \mathbf{c}\cdot\mathbf{x} + c_0
```

which is just another linear model. Ten linear layers in a row still collapse to one matrix (M1.4). The sigmoid is the only thing that stops the whole network being a straight line.

**Example question:** For S2 (`x1 = 2, x2 = 1`) and target `t = 0`, using the *starting* weights above, do the forward pass, compute the loss, and find all six gradients with respect to the input-side weights and biases.

**Solution:**

Step 1 — `z_1 = 0.1(2) + 0.1(1) + 0.4 = 0.7`, so `h_1 = sigma(0.7) = 0.6682`. (Reason: matrix-vector product, one row of `W1` at a time.)

Step 2 — `z_2 = -0.1(2) + 0.2(1) - 0.2 = -0.2`, so `h_2 = sigma(-0.2) = 0.4502`.

Step 3 — `z^(2) = 0.5(0.6682) - 0.5(0.4502) + 0 = 0.1090`, so `y_hat = sigma(0.1090) = 0.5272`.

Step 4 — Loss for `t = 0`: `L = -ln(1 - 0.5272) = -ln(0.4728) = 0.7491`. (Reason: for a negative row only the `(1-p)` term survives.)

Step 5 — `delta^(2) = y_hat - t = 0.5272 - 0 = +0.5272`. Positive, because the model is too optimistic for a failure.

Step 6 — `delta^(1)_1 = 0.5272(0.5)(0.6682)(0.3318) = 0.0584` and `delta^(1)_2 = 0.5272(-0.5)(0.4502)(0.5498) = -0.0652`.

Step 7 — Input-side gradients: `dL/dw11 = 0.0584(2) = 0.1169`, `dL/dw12 = 0.0584(1) = 0.0584`, `dL/db1 = 0.0584`; `dL/dw21 = -0.0652(2) = -0.1305`, `dL/dw22 = -0.0652(1) = -0.0652`, `dL/db2 = -0.0652`.

Step 8 — Sign check: positive gradients mean "increase this weight to *increase* the loss", so gradient descent pushes `w11, w12, b1` down and `w21, w22, b2` up.

**Final answer:** `y_hat = 0.5272`, `L = 0.7491`, `dL/dw11 = 0.1169`, `dL/dw12 = 0.0584`, `dL/db1 = 0.0584`, `dL/dw21 = -0.1305`, `dL/dw22 = -0.0652`, `dL/db2 = -0.0652`.

⚠️ **Common trap:** Forgetting the `h(1-h)` factor, or applying it at the output layer where the shortcut `y_hat - t` already includes it. At the output, `dL/dz = y_hat - t` (the sigmoid slope cancelled against the log). At a hidden layer you must multiply the slope in by hand.

---

## 6.5 Why these pieces fit

### Intuition

Four strands, four different jobs. Miss one and the pipeline has a hole: no representation and there is nothing to compute with, no calculus and you do not know which way to move, no optimisation and nothing ever moves, no probability and you cannot say how sure you are.

### The mapping

| Strand | What it contributes | Where it appears in our four rows |
| --- | --- | --- |
| **Linear algebra** (representation) | Stores data (`X`, 4x2), stores parameters (`w`, 2x1), computes predictions (`Xw`), and — via projection — gives the closed-form answer `(X^T X)^-1 X^T y` | `X^T X = [[4,10],[10,30]]`, `det = 20`, `w* = (0.5, 1.4)` |
| **Calculus** (sensitivity) | Says how the loss responds to each knob: partial derivatives and the chain rule; this *is* backpropagation | `dJ/dw = -11.75` at `(0,0)`; `dL/dz = p - t`; `delta^(1) = delta^(2) v h(1-h)` |
| **Optimisation** (learning) | Turns sensitivity into action: the update rule, the learning rate, when to stop; guarantees the squared-error problem has one global minimum (it is convex) | `w <- w - 0.1(-11.75) = 1.175`; `J: 9.25 -> 0.276 -> 0.032 -> 0.025` |
| **Probability** (uncertainty) | Chooses the loss honestly (Gaussian noise gives least squares; Bernoulli gives cross-entropy), turns scores into calibrated probabilities, and tells you when data cannot pin the parameters down (separability) | `p = sigma(0.3051x - 0.1482)`; BCE `0.6931 -> 0.6250`; separable data means no finite `w*` |

**The sentence to remember:** *linear algebra represents, calculus measures, optimisation moves, probability judges.*

**Example question:** Take the logistic update `w <- w - lr * (1/n) sum (p_i - t_i) x_i`. For each of the four strands, name the exact piece of this line it supplies.

**Solution:**

Step 1 — Linear algebra: `x_i` is a feature vector and the sum is a dot-product-style accumulation; with many features the whole thing is written `X^T (p - t)`, a matrix-vector product. (Reason: representation of data and parameters.)

Step 2 — Calculus: the expression `(p_i - t_i) x_i` exists only because we differentiated `L` and applied the chain rule. (Reason: it is `dL/dw`, not a guess.)

Step 3 — Optimisation: the `w <- w - lr * (...)` part — direction, step size, repetition until the loss flattens (the descent step from M4.4). **Probability:** `p_i = sigma(w x_i + b)` is a Bernoulli probability and the loss behind this gradient is a negative log-likelihood — the model class and the loss both come from probability.

**Final answer:** representation = `x_i` and the `X^T (p - t)` structure; sensitivity = `(p_i - t_i)x_i` being a derivative; learning = `w <- w - lr * gradient`; uncertainty = `p` as a Bernoulli probability and BCE as its log-likelihood.

⚠️ **Common trap:** Saying "optimisation finds the answer". Optimisation only *moves*; the direction comes from calculus and the target from probability. If your loss is wrong, a perfectly tuned optimiser will find the wrong answer very efficiently.

---

## 6.6 Reading the mathematics in ML documentation and papers

### Intuition

A paper's method section is not a secret language — it is our four strands written in shorthand. Ten symbols cover almost everything you will meet.

### The decoder table

| You see | Read it as |
| --- | --- |
| `x_i`, `w_j` | **subscript = index**, not power. "feature i", "weight j" |
| `x^{(i)}` | **superscript in brackets = example number**, not power. "the i-th row" |
| `w_{jk}` | weight at row `j`, column `k` of the matrix `W` |
| `sum_{i=1}^{n}` | add up over all `n` examples |
| `argmin_theta` | the value of `theta` that makes the thing after it smallest |
| `\|\|v\|\|_2^2` | squared Euclidean length = sum of squared entries |
| `E[...]`, `E_{x~p}[...]` | average (expected value), usually over the data distribution |
| `sigma(z)` | sigmoid in an ML paper; standard deviation in a statistics paper — context decides |
| `ln` / `log` | in ML, almost always log base `e` |
| `∂L/∂w` | how `L` changes when only `w` changes |

### Five decodings

1. `L = (1/n) sum_i (y_hat_i - y_i)^2` — mean squared error; `n` examples, subscript `i` indexes them. Our 6.2 loss without the `1/2`.
2. `theta* = argmin_theta L(theta)` — "the best parameters"; the `*` marks the optimum, not a multiplication.
3. `p(y | x; theta)` — probability of label `y` given input `x`, with parameters `theta` held fixed.
4. `E_{x~p_data}[ln q(x)]` — average log-probability the model `q` assigns to data drawn from the real distribution. This is what a generative model maximises.
5. `∂L/∂W^{(1)} = delta^{(1)} x^T` — an **outer product**: one column of gradients per input, all input weights differentiated in a single line.

**Example question:** Decode `J(theta) = -(1/m) sum_{i=1}^{m} [ t^{(i)} ln h_theta(x^{(i)}) + (1 - t^{(i)}) ln(1 - h_theta(x^{(i)})) ]`. Say what model and loss it is, what `h_theta` must be, and write our network's output-layer gradient in the same notation.

**Solution:**

Step 1 — `m` is the number of examples; `(i)` is a row index, not a power. (Reason: bracket superscript convention.)

Step 2 — `t^{(i)}` is the 0/1 label of row `i`; `h_theta(x^{(i)})` is the model's output for that row. (Reason: `h` for hypothesis, `theta` for parameters.)

Step 3 — `h_theta` must map to `(0,1)` because it appears inside `ln(...)` paired with `(1 - ...)`. So `h_theta(x) = sigma(theta . x)`. (Reason: it is used as a probability.)

Step 4 — The bracket is `t ln p + (1-t) ln(1-p)`: the Bernoulli log-likelihood. Negated and averaged = negative log-likelihood. (Reason: `-ln` of a probability is a cost.)

Step 5 — So this is **logistic regression with binary cross-entropy**, with `m` written instead of `n`.

Step 6 — Our network's output gradient in the same style: `∂L/∂v = (y_hat - t) h`, i.e. `∂L/∂v_j = delta^{(2)} h_j`. (Reason: chain rule through the output sigmoid.)

**Final answer:** logistic regression with BCE, `h_theta(x) = sigma(theta . x)`; the network version is `∂L/∂v_j = (y_hat - t) h_j`.

⚠️ **Common trap:** Reading `x^{(2)}` as "x squared". In ML papers, superscripts in brackets are indices. Plain `x^2` without brackets is a power.

---

## 6.7 Numerical and practical awareness

### Intuition

Hand maths assumes exact numbers. Computers have 64-bit floats, finite time, and matrices that are sometimes nearly singular. Knowing *why* libraries exist tells you what to look at when training misbehaves.

### The idea, step by step

**Why not just invert `X^T X`?** Two reasons. (1) Cost: inverting a `d x d` matrix is `O(d^3)`; with `d = 10,000` that is `10^12` operations. (2) Accuracy: forming `X^T X` **squares the condition number**. For our data, `(1/n)X^T X = [[1, 2.5],[2.5, 7.5]]` has eigenvalues `8.3503` and `0.1497`, so `cond = 55.8`. If `X` itself were badly conditioned, `X^T X` would be catastrophically worse. Libraries therefore use QR or SVD, or Cholesky on `X^T X` when it is safe.

**The learning-rate bound.** For a quadratic loss, gradient descent converges iff

```latex
\alpha < \frac{2}{\lambda_{\max}\big(\tfrac1n X^{\mathsf T}X\big)} = \frac{2}{8.3503} = 0.2395
```

So `lr = 0.1` is safe (we used it), `lr = 0.2` is safe but jumpy, and `lr = 0.25` **diverges** — verified: after 200 steps the weights reach `-9.4 x 10^6`. Same code, same data, one number changed.

**Symptom table — what the maths tells you:**

| Symptom | Mathematical cause | Fix |
| --- | --- | --- |
| Loss not decreasing at all | learning rate below the useful range, or a sign error in the gradient | raise `lr`; check `w <- w - lr*g` (minus, not plus) |
| Loss jumps up then NaN | `lr` above `2/lambda_max`; steps overshoot the bowl | lower `lr`, or standardise features |
| Weights grow without bound | perfectly separable data (our 6.3 case) | add L2 regularisation (M4.8) |
| Train loss ~0, test loss high | overfitting: `n` small relative to `d` | more data, fewer features, regularise |

**Example question:** From `(w, b) = (0, 0)`, take one gradient-descent step on our squared-error loss with `lr = 0.3`. Compute `J` before and after, and explain what happened.

**Solution:**

Step 1 — At `(0,0)` the gradients are `-11.75` and `-4` (from 6.2), and `J = 9.25`.

Step 2 — Update: `w = 0 - 0.3(-11.75) = 3.525`, `b = 0 - 0.3(-4) = 1.2`. (Reason: `w <- w - lr * gradient`.)

Step 3 — New predictions `3.525(1)+1.2 = 4.725`, `8.25`, `11.775`, `15.3`, so residuals are `2.725, 5.25, 6.775, 9.3`. (Reason: `y_hat - y`.)

Step 4 — `J = (2.725^2 + 5.25^2 + 6.775^2 + 9.3^2)/(2*4) = (7.426 + 27.563 + 45.901 + 86.49)/8 = 167.38/8 = 20.92`.

Step 5 — `J` went **up** from 9.25 to 20.92: the step overshot the bottom of the bowl and landed higher on the other side.

**Final answer:** `J` rises `9.25 -> 20.92`. The step was too long; the safe range here is `lr < 0.2395`.

⚠️ **Common trap:** Blaming the data or the model when the loss rises. Nine times out of ten it is the learning rate, and the mathematics gives you the exact threshold to check.

---

## 6.8 The bridge to the next courses

### Intuition

This module is the *why*. The next courses are the *how fast* and the *how sure*.

- **Computational Foundations for AI** takes the algorithms here — matrix multiply, the normal equations, gradient descent, the chain rule — and asks how to make them fast and correct in code: arrays and memory layout, BLAS-style libraries, automatic differentiation instead of hand-derived gradients, GPU parallelism, and numerical stability.
- **Mathematics for Data Science** takes the probability strand and turns it into inference: sampling, standard errors, confidence intervals, hypothesis tests, and the theory of when a model generalises rather than memorises.

**Cost arithmetic, the thing that decides which route you implement:**

| Task | Operations | With `n = 1,000,000` rows, `d = 100` features |
| --- | --- | --- |
| Build `X^T X` | `n d^2` | `10^10` |
| Invert `X^T X` | `d^3` | `10^6` |
| One gradient-descent step | `n d` | `10^8` |

So the normal equations cost about `10^10` operations *once*, while gradient descent costs `10^8` **per step** — a hundred steps are the same `10^10`. That is the whole trade-off in one line, and it is why deep learning (millions of parameters, no closed form) uses descent while small tabular problems use the closed form.

**Example question:** Our dataset has `n = 4`, `d = 1`. Compute both costs exactly, and say which route is cheaper for this dataset.

**Solution:**

Step 1 — `n d^2 = 4 * 1 = 4`; `d^3 = 1`. Normal-equation cost ≈ 5 operations. (Reason: build `X^T X`, then invert a 1x1.)

Step 2 — One descent step: `n d = 4`. (Reason: one pass over the rows computing residuals and gradients.)

Step 3 — Compare and conclude: the closed form is about one step's worth of work and gives the exact answer, so for `d = 1` it wins outright. The crossover only appears when `d` is in the thousands.

**Final answer:** closed form ≈ 5 operations vs 4 per descent step; for this dataset use the normal equations.

---

## 6.9 Limits of this course

### Intuition

Be clear about the edge of the map. What you have is the complete skeleton of supervised learning: representation, loss, gradient, update. What you do *not* have is the statistics of trusting a model, the theory of optimising hard non-convex problems, and the engineering of deep networks.

**Foundational here (you can do it by hand):** vectors/matrices as data, least squares by projection, partial derivatives and the chain rule, gradient descent and its learning rate, Bernoulli/Gaussian likelihoods and the two standard losses, forward and backward pass of a tiny network.

**Developed later:** sampling distributions, confidence intervals and p-values; regularisation theory and generalisation bounds; convexity proofs and constrained optimisation; momentum/Adam and second-order methods; convolutional and attention architectures, batch normalisation, initialisation theory.

**A taste of what statistics adds.** For our fit, `w_hat = 1.4`. How precise is that? With `sigma_hat^2 = SSE/(n-2) = 0.2/2 = 0.1` and `S_xx = sum (x_i - x_bar)^2 = 30 - 100/4 = 5`, the standard error is

`SE(w_hat) = sqrt(0.1/5) = 0.1414`, so `w_hat / SE(w_hat) = 1.4/0.1414 = 9.90`.

That formula belongs to the statistics course; it is here only to show the gap between "here is the number" and "here is how much to trust the number". With `n = 4` you should not trust it much, however big the ratio looks.

**Example question:** Our fit reports `R^2 = 0.98`. Compute the adjusted `R^2` for `n = 4`, one predictor, and state in two lines what this course can and cannot claim about it.

**Solution:**

Step 1 — Adjusted `R^2 = 1 - (1 - R^2)(n - 1)/(n - p - 1)` with `n = 4`, `p = 1`. (Reason: it penalises each predictor by a degree of freedom.)

Step 2 — `= 1 - 0.02 * 3/2 = 1 - 0.03 = 0.97`. Barely changed.

Step 3 — What we can claim: on these four rows the line explains 97-98% of the variation, and residuals are orthogonal to the features (checked in 6.2).

Step 4 — What we cannot claim: that the model predicts new students well, or that the slope is significantly non-zero. Both need held-out data and a sampling theory — the next course.

**Final answer:** adjusted `R^2 = 0.97`; the number is descriptive only, because `n = 4` gives almost no evidence about unseen rows.

---

## 6.10 AI/ML meaning throughout

### Intuition

Here is the promise of this course, kept. "AI" is not a black box with a personality; it is these four strands running in a loop on a matrix of numbers. You have now done the loop by hand, on real arithmetic, three times (line, classifier, network).

**You can now follow, end to end:**

1. A dataset arriving as `X` (`n x d`) and `y`.
2. A model written as a function with parameters.
3. A loss chosen for a reason (Gaussian noise -> squares; Bernoulli labels -> cross-entropy).
4. A gradient derived with the chain rule, by hand.
5. An update rule with a learning rate you can justify with an eigenvalue bound.
6. A trained model you can query with a new row.

**Example question:** A new student studied 5 hours and slept 4 hours. Using the network weights *after* the single step in 6.4, compute the predicted probability of clearing the exam, and state which strand each part of your computation used.

**Solution:**

Step 1 — Inputs `x = (5, 4)` and the updated weights `w11 = w12 = 0.1699`, `b1 = 0.4233`, `w21 = -0.1887`, `w22 = 0.1113`, `b2 = -0.2296`. (Linear algebra: matrix-vector product.) `z1 = 0.1699(5) + 0.1699(4) + 0.4233 = 0.8497 + 0.6797 + 0.4233 = 1.9527`, so `h1 = sigma(1.9527) = 0.8757`.

Step 2 — `z2 = -0.1887(5) + 0.1113(4) - 0.2296 = -0.9435 + 0.4452 - 0.2296 = -0.7279`, so `h2 = sigma(-0.7279) = 0.3257`.

Step 3 — `z^(2) = 0.6734(0.8757) - 0.3755(0.3257) + 0.2371 = 0.5897 - 0.1223 + 0.2371 = 0.7045`.

Step 4 — `y_hat = sigma(0.7045) = 0.6692`, about a 67% chance of clearing. (Probability: read it as a Bernoulli probability of `t = 1`; the weights came from calculus applied through optimisation.)

**Final answer:** `y_hat ≈ 0.669`, i.e. roughly 67% — computed by linear algebra (forward pass), read with probability (sigmoid), using weights that calculus and optimisation produced.

⚠️ **Common trap:** Calling this "the model thinks". It is a composition of four operations on numbers; the only place judgement enters is the choice of loss and data.

---

## Formula / rule summary table

| Model | Parameters | Prediction | Loss | Gradient | How to solve |
| --- | --- | --- | --- | --- | --- |
| Linear regression | `w`, `b` | `y_hat = wx + b` | `J = (1/2n) sum (y_hat - y)^2` | `dJ/dw = (1/n) sum (y_hat-y)x` | normal equations `X^T X theta = X^T y`, or descent |
| Logistic regression | `w`, `b` | `p = sigma(wx + b)` | BCE `= -(1/n) sum [t ln p + (1-t) ln(1-p)]` | `dL/dw = (1/n) sum (p - t)x` | descent only (no closed form) |
| Tiny network | `W1, b1, v, b_o` | `y_hat = sigma(v . sigma(W1 x + b1) + b_o)` | BCE on `y_hat` | chain rule: `delta^(2) = y_hat - t`, `delta^(1) = delta^(2) v h(1-h)` | descent (backpropagation) |

**Which one when?**

- Target is a number, relationship looks straight -> **linear regression**, try the normal equations first.
- Target is yes/no and you want a probability -> **logistic regression**.
- Relationship is clearly not straight, or you have several features interacting -> **a small network**.
- Need the exact minimiser and `d` is small -> **normal equations**. `d` large or loss not quadratic -> **gradient descent**.
- Loss not falling -> check the learning rate against `2/lambda_max` before touching anything else.

---

## Solved examples

**Example 1 (easy) — predict and score a new row.** Using `y_hat = 0.5 + 1.4x`, predict the marks of a student who studies 6 hours. If she actually scores 8, give the residual and say whether it is above or below the line.

Step 1 — Substitute: `y_hat = 0.5 + 1.4(6) = 0.5 + 8.4 = 8.9`. (Reason: the model is a function; feed it a number.)

Step 2 — Residual `r = y_hat - y = 8.9 - 8 = 0.9`. (Reason: residual = prediction minus truth.)

Step 3 — `r > 0`, so the line predicts **above** the actual mark. (Reason: positive residual means we over-predicted.)

**Final answer:** `y_hat = 8.9`, residual `+0.9`, an over-prediction.

**Example 2 (medium) — two features, by the matrix route.** Write `X^T X` for our four rows using both features plus a bias column, and state whether the normal equations have a unique solution.

Step 1 — Design matrix (bias, `x1`, `x2`): rows `(1,1,2)`, `(1,2,1)`, `(1,3,3)`, `(1,4,2)`. (Reason: the bias is a column of 1s.)

Step 2 — Sums: `sum 1 = 4`, `sum x1 = 10`, `sum x2 = 8`, `sum x1^2 = 1+4+9+16 = 30`, `sum x2^2 = 4+1+9+4 = 18`, `sum x1x2 = 2+2+9+8 = 21`.

Step 3 — Assemble: `X^T X = [[4,10,8],[10,30,21],[8,21,18]]`. (Reason: entry `(j,k)` = dot product of columns `j` and `k`.)

Step 4 — Check rank by elimination: `R2 - 2.5 R1 -> (0, 5, 1)`, `R3 - 2 R1 -> (0, 5, 2)`, then `R3 - R2 -> (0, 0, 1)`. Three pivots.

Step 5 — Full rank `= 3` = number of parameters, so `X^T X` is invertible and the fit is unique. (Reason: M1.5 uniqueness test.)

**Final answer:** `X^T X = [[4,10,8],[10,30,21],[8,21,18]]`, rank 3, unique least-squares solution.

**Example 3 (exam level) — compare the three models honestly.** Our three models report `SSE = 0.20` (linear), `BCE = 0.6124` (logistic, 3 steps), `BCE = 0.4247` (network, 1 step). Which is best?

Step 1 — `SSE` and `BCE` measure different things: squared distance on a continuous target vs negative log-likelihood on a 0/1 target. (Reason: different probability models.) So `0.20 < 0.4247` says nothing — cross-model loss comparison is meaningless unless the loss and target are identical.

Step 2 — Compare within a family instead: logistic `0.6931 -> 0.6124` is progress; network `0.6430 -> 0.4247` is progress.

Step 3 — Compare across families on a shared metric. Classification accuracy at the 3-step logistic weights: `p = 0.5392, 0.6135, 0.6829, 0.7451`, all above the 0.5 threshold, so all four predicted as 1 -> accuracy `2/4`. That is not a contradiction: three small steps leave every probability near 0.5, so thresholding is meaningless until the loss flattens.

**Final answer:** the losses are not comparable across families; within each family both are improving, and the classifier needs more than three steps before its accuracy means anything.

---

## Common traps and mistakes

- **Shapes not cancelled.** `(4x2)(2x1)` is fine, `(4x2)(1x2)` is not. Losing the shape check loses the marks even when the arithmetic is right.
- **Reporting SSE instead of MSE when comparing fits on different numbers of rows.** Fewer rows always lowers SSE; the comparison is meaningless.
- **Dropping the `1/2` inconsistently.** It changes the size of the gradient (and therefore the safe learning rate) by a factor of 2. Pick a convention and keep it.
- **Forgetting `(1-t) ln(1-p)` in BCE.** Negative rows then cost nothing and the model predicts 1 everywhere.
- **Using squared error for a 0/1 target.** It gives confident, badly calibrated probabilities (S1 got 0.87 while actually failing) and a worse loss.
- **Forgetting `h(1-h)` at a hidden layer, or adding it at the output layer.** At the output, `dL/dz = y_hat - t` already absorbed it.
- **Reusing a regression line as a classifier.** The numbers look plausible and the calibration is wrong.
- **Raising the learning rate when the loss explodes.** It is already too high; the bound is `2/lambda_max`.
- **Assuming a finite optimum always exists.** Perfectly separable data has none — our 6.3 case.

---

## Quick revision box

- ✅ Pipeline: data (matrix) -> model (function) -> loss (scalar) -> optimisation -> trained model. Five boxes, every ML system.
- ✅ Linear regression: `y_hat = wx + b`, loss `(1/2n) sum (y_hat-y)^2`, normal equations `X^T X theta = X^T y`. Our data: `X^T X = [[4,10],[10,30]]`, `det = 20`, `theta* = (0.5, 1.4)`, `SSE = 0.20`, `R^2 = 0.98`.
- ✅ Same answer by descent: gradients `-11.75, -4` at `(0,0)`; with `lr = 0.1`, `w` goes `0 -> 1.175 -> 1.369 -> 1.401 -> 1.406`, converging on 1.4. Safe range `lr < 2/lambda_max = 0.2395`.
- ✅ Logistic: `p = sigma(wx+b)`, log-odds `ln(p/(1-p)) = wx + b`, loss = BCE, and the gradient collapses to `(p - t)x`. At `(0,0)` that is `-0.5`; one step of `lr = 0.5` gives `L = 0.6250` (from `0.6931`).
- ✅ Network: forward = matrix-vector product + sigmoid; backward = `delta^(2) = y_hat - t`, `delta^(1) = delta^(2) v h(1-h)`, then `dL/dW = delta^(1) x^T`. One step took our loss `0.6430 -> 0.4247`.
- ✅ Without the nonlinearity a stack of layers collapses to one matrix — that is why activation functions exist.
- ✅ Strands: linear algebra represents, calculus measures, optimisation moves, probability judges.

---

## Practice questions

1. Using `y_hat = 0.5 + 1.4x`, predict the marks for `x = 7` and give the residual if the student actually scored 9.5.
2. Our four rows give `X^T X = [[4,10],[10,30]]` and `X^T y = (16, 47)`. Solve by Cramer's rule and verify the residuals sum to zero.
3. Continue the logistic run from `w = 0.3051, b = -0.1482` with `lr = 0.5`. Compute the four probabilities, both gradients, and the new weights.
4. For S1 (`x1 = 1, x2 = 2`, `t = 0`) with the starting network weights, compute the forward pass, the loss, `delta^(2)`, `delta^(1)`, and `dL/dv_1`.
5. In the update `theta <- theta - lr * (1/n) X^T (y_hat - y)`, name which strand supplies each factor, and say what happens if the sign is flipped.
6. A student's training loop prints losses `0.69, 0.62, 0.58, 1.94, 3.51, NaN`. Diagnose it using the mathematics, and state the bound you would check first.

## Answers

1. `y_hat = 0.5 + 9.8 = 10.3`; residual `= 10.3 - 9.5 = +0.8` (over-prediction). *Key step: substitute, then subtract truth.*
2. `det = 4(30) - 10(10) = 20`; `b = (30(16) - 10(47))/20 = (480-470)/20 = 0.5`; `w = (4(47) - 10(16))/20 = (188-160)/20 = 1.4`. Residuals `-0.1, 0.3, -0.3, 0.1` sum to 0. *Key step: Cramer's rule, then the orthogonality check.*
3. `p = 0.5391, 0.6135, 0.6829, 0.7450`; `dL/dw = -0.0512`, `dL/db = +0.1452`; new `w = 0.3307`, `b = -0.2208`, `L = 0.6003`. *Key step: `(p-t)x` averaged over the four rows.*
4. `z1 = 0.7, h1 = 0.6682`; `z2 = 0.1, h2 = 0.5250`; `z^(2) = 0.0716, y_hat = 0.5179`; `L = 0.7296`; `delta^(2) = 0.5179`; `delta^(1) = (0.0574, -0.0646)`; `dL/dv1 = 0.3461`. *Key step: positive `delta^(2)` because a 0/1 row got `p > 0.5`.*
5. `X^T` and `y_hat` = representation (linear algebra); `(y_hat - y)` = sensitivity (calculus); `lr` and the `<-` loop = learning (optimisation); the choice of loss behind `y_hat` = uncertainty (probability). Flipping the sign gives `theta + lr * gradient`: gradient ascent, so the loss grows without bound. *Key step: minus means downhill.*
6. The first three lines show healthy descent, then the loss explodes and overflows — the learning rate is above `2/lambda_max`, so steps overshoot the bowl. Check `lr < 2/lambda_max((1/n)X^T X)` first (here `0.2395`); also standardise features, since unscaled columns inflate `lambda_max`. *Key step: rising loss = step size, not model.*
