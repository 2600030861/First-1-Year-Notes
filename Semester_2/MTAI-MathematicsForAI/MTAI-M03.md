# Mathematics for AI – Module 3

## Multivariable Calculus

*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

Module 1 stored data, Module 2 found its shape. This module is about **change**: if I nudge one number in my model, how much does the error move?

That single question is the whole of training. A model has parameters (weights), it produces a loss (how wrong it is), and learning means turning the parameters so the loss goes down. Calculus is the machinery that says *which way is down and by how much*. Every "the model learned" story ends in a derivative.

Analogy: you are standing on a foggy hillside and want the valley. You cannot see far, but you can feel the slope under your feet. Calculus is the instrument that reads the slope; walking downhill is optimisation (Module 4).

This module answers five questions:

1. What is a derivative, and what is it *for*? -> **rate of change = sensitivity**
2. What if the error depends on many parameters at once? -> **partial derivatives, the gradient**
3. What if the error is built out of nested steps (a network)? -> **the chain rule, backpropagation**
4. What does the *curvature* of the error tell us? -> **Jacobian, Hessian, Taylor**
5. How do we average over a continuous range (probabilities)? -> **integration**

**Prerequisites:** functions, graphs, limits at a basic level, the idea of a slope, summation notation, and Module 1's vectors and dot products.

---

## 3.1 Limits, continuity and the derivative

### Intuition

A **limit** asks: as x creeps towards a value, what does f(x) creep towards? A function is **continuous** if it actually arrives at that value — no jump, no hole. The **derivative** is then the limit of a slope: shrink the gap between two points on the curve to nothing and read the slope of the tangent.

For AI, the useful reading is: **derivative = sensitivity**. "If I change this parameter by a tiny amount, how much does the loss change?" A slope is just sensitivity drawn as a picture.

### The idea, step by step

**Step 1 – Limit and continuity.** `lim_{x -> a} f(x) = L` means f(x) gets arbitrarily close to L as x approaches a (f(a) itself need not exist): for `f(x) = (x^2-1)/(x-1)`, undefined at 1 but equal to `x+1` elsewhere, the limit as `x -> 1` is 2. And f is **continuous** at a if `lim_{x -> a} f(x) = f(a)` — the limit exists *and* equals the value. All the losses and activations we use are continuous (ReLU too, even though its derivative jumps at 0).

**Step 3 – Derivative, as a rate of change.** The definition, and what each piece means:

```latex
f'(x) = \lim_{h \to 0}\frac{f(x+h) - f(x)}{h}
```

`f(x+h) - f(x)` is the change in output, `h` is the change in input, so the fraction is "change out per change in". Letting `h -> 0` gives the instantaneous rate.

**Step 4 – Derivative, as a slope.** The same number is the slope of the tangent line at x, and the tangent line is the best straight-line approximation there: `f(x+h) ≈ f(x) + f'(x) h`. That approximation is what every gradient step relies on (3.8).

**Step 5 – Do it once by hand.** For `f(x) = x^2` at `x = 3`:

```latex
\frac{f(3+h) - f(3)}{h} = \frac{(3+h)^2 - 9}{h} = \frac{9 + 6h + h^2 - 9}{h} = 6 + h \;\xrightarrow{h\to 0}\; 6
```

So `f'(3) = 6`: at x = 3, the curve rises 6 units per unit of x. Meaning for a model: if the loss is `L(w) = w^2` and we are at `w = 3`, raising w by 0.01 raises L by about `6 x 0.01 = 0.06` — check: `3.01^2 = 9.0601`, indeed up by 0.0601.

**Step 6 – Standard derivatives you must have cold.** `d/dx (x^n) = n x^(n-1)`; `d/dx (e^x) = e^x`; `d/dx (ln x) = 1/x`; `d/dx (sin x) = cos x`; `d/dx (cos x) = -sin x`; derivative of a constant is 0.

**Example question:** Using the limit definition, find `f'(x)` for `f(x) = x^2 + 2x`, evaluate it at `x = 1`, and interpret the answer for a loss function.

**Solution:**

Step 1 — write the difference quotient (reason: this is the definition):

```latex
\frac{f(x+h) - f(x)}{h} = \frac{\big[(x+h)^2 + 2(x+h)\big] - \big[x^2 + 2x\big]}{h}
```

Step 2 — expand the bracket: `x^2 + 2xh + h^2 + 2x + 2h`. Subtract `x^2 + 2x` to get `2xh + h^2 + 2h`.

Step 3 — divide by h (reason: every term has a factor h, so the division is legal for `h != 0`): `2x + h + 2`.

Step 4 — let `h -> 0`: `f'(x) = 2x + 2`.

Step 5 — evaluate: `f'(1) = 4`.

Step 6 — interpret and check numerically: at x = 1, `f(1) = 3`; at `x = 1.01`, `f = 1.0201 + 2.02 = 3.0401`, an increase of 0.0401 ≈ `4 x 0.01` ✓.

**Final answer:** `f'(x) = 2x + 2`, so `f'(1) = 4` — near x = 1, increasing the input by 0.01 increases the output by about 0.04.

⚠️ **Common trap:** Cancelling `h` before it appears in every term, or "setting h = 0" too early (which gives 0/0). The legal order is always: expand, cancel, *then* take the limit. Second trap: writing `f'(a)` when the question wants `f'(x)` — the derivative is a function, the slope at a point is a number.

---

## 3.2 Differentiation rules and the single-variable chain rule

### Intuition

You do not want to take limits every time. The rules are shortcuts, and one of them — the **chain rule** — is the single most important formula in machine learning, because models are *nested* functions: a loss contains a prediction, which contains a weighted sum, which contains a weight.

Think of it as **sensitivity plumbing**. If a 1% change in w causes a 3% change in u, and a 1% change in u causes a 5% change in L, then a 1% change in w causes about 15% in L. Sensitivities multiply along a chain. That is the chain rule, and backpropagation (3.6) is this idea applied mechanically to a whole network.

### The idea, step by step

**Step 1 – The four rules.** Power `(x^n)' = n x^(n-1)`; product `(uv)' = u'v + uv'`; quotient `(u/v)' = (u'v - uv')/v^2`; chain `f(g(x))' = f'(g(x)) g'(x)`.

**Step 2 – Read the chain rule in words.** "Derivative of the outside, evaluated at the inside, times the derivative of the inside." For `y = (3x + 1)^5`: outside is `( )^5`, inside is `3x + 1`, so `y' = 5(3x+1)^4 x 3 = 15(3x+1)^4`.

**Step 3 – The sensitivity version.** If `L` depends on `u` and `u` depends on `w`, then

```latex
\frac{dL}{dw} = \frac{dL}{du}\cdot\frac{du}{dw}
```

This is the form to remember for AI: **multiply the local sensitivities along the path**. If several paths lead from w to L, add the contributions (that is the multivariable case, 3.6).

**Step 4 – A loss example, by hand.** Let `L(w) = (wx - y)^2` with `x = 2`, `y = 5`, at `w = 1`. Inside: `u = wx - y = 2 - 5 = -3`, so `L = 9`. Outside derivative: `dL/du = 2u = -6`. Inside derivative: `du/dw = x = 2`. Hence

```latex
\frac{dL}{dw} = 2(wx - y)\cdot x = 2(-3)(2) = -12
```

Check numerically: at `w = 1.001`, `u = 2.002 - 5 = -2.998`, `L = 8.988004`, a change of `-0.011996` for `+0.001`, i.e. slope `-11.996 ≈ -12` ✓.

**Step 5 – Why the sign matters.** `dL/dw = -12` at `w = 1` means *increasing* w *decreases* L, and fast. So the training step should increase w — which is exactly `w <- w - eta x dL/dw` with a positive eta (3.5).

**Example question:** A loss is `L(w) = (w^2 - 4)^2`. Find `dL/dw` and evaluate it at `w = 3` and `w = 2`. Explain what the two answers mean for training.

**Solution:**

Step 1 — identify the nesting (reason: chain rule): outside `( )^2`, inside `w^2 - 4`.

Step 2 — differentiate outside, times inside:

```latex
\frac{dL}{dw} = 2(w^2 - 4)\cdot(2w) = 4w(w^2 - 4)
```

Step 3 — at `w = 3`: `4(3)(9 - 4) = 12 x 5 = 60`.

Step 4 — at `w = 2`: `4(2)(4 - 4) = 0`.

Step 5 — numeric check of the first: at `w = 3.001`, `w^2 = 9.006001`, so `L = 5.006001^2 = 25.060046`, a change of `0.060046` for `+0.001`, i.e. slope ≈ 60.05 ✓.

Step 6 — meaning: at `w = 3` the loss is steeply increasing (sensitivity 60 per unit), so training pushes w down hard. At `w = 2` the derivative is zero — a **stationary point**, and since `L(2) = 0` it is the minimum. Note the same value 0 occurs at `w = -2`, also a minimum, so this loss has two equally good solutions.

**Final answer:** `dL/dw = 4w(w^2 - 4)`; at `w = 3` it is 60 (steep, move away), at `w = 2` it is 0 (stationary point, and the minimum).

⚠️ **Common trap:** Forgetting the inner derivative — writing `2(w^2-4)` and losing the `2w`. That is the number-one chain-rule error, and in a network it silently scales every gradient. Second trap: expanding everything before differentiating (slow and error-prone); chain first, simplify later.

---

## 3.3 Functions of several variables

### Intuition

One input gives a curve; two inputs give a **surface** (a landscape you can walk on). Three or more give something you cannot draw — but every formula still works, and that is the point: a model's loss depends on thousands of parameters at once, so the loss is a function of many variables and we are walking on a surface we cannot see.

Two ways to picture a surface: as a **height map** (z above a plane), or as a **contour map** — level sets, the lines where the height is constant. Contours are the more useful picture, because they are what you can actually draw on paper.

Analogy: a topographic trekking map. Contour lines close together = steep; far apart = flat. The route you want goes perpendicular to the contours, straight downhill.

### The idea, step by step

**Step 1 – Notation.** `f: R^n -> R` takes a vector and returns a number. `f(w1, w2) = w1^2 + 2w2^2` is a surface in 3-D. The **graph** is the set of points `(w1, w2, f(w1,w2))`.

**Step 2 – Level sets.** A level set of value c is the set of inputs where `f = c`, written `{(w1, w2) : f(w1,w2) = c}`. For `f = w1^2 + 2w2^2` the level set is an ellipse (or a point, at c = 0). Level sets never cross, because one input cannot have two heights.

**Step 3 – The model meaning.** Take a one-parameter model `y_hat = w x` on data `(1,2), (2,3)` and the squared-error loss `L(w) = (w-2)^2 + (2w-3)^2`. That is a parabola in w: one input, easy. Now take two parameters, `y_hat = w1 + w2 x`, same data:

```latex
L(w_1,w_2) = (w_1 + w_2 - 2)^2 + (w_1 + 2w_2 - 3)^2
```

Now the loss is a surface over the `(w1, w2)` plane, and training means finding its lowest point. Its level sets are ellipses centred on the minimum (we compute that minimum in 3.5: it is `w = (1,1)`).

**Step 4 – Reading a contour map.** Contours close together mean a steep slope; wide apart mean flat. If the contours are long thin ellipses, the surface is a narrow valley — steep across, gentle along — and gradient descent will zig-zag (2.9, 4.4). This is the picture to hold whenever training is slow.

**Example question:** For `L(w1,w2) = w1^2 + 4w2^2`, describe the level sets, find the level curve through `(1,1)`, and say which direction is steeper.

**Solution:**

Step 1 — shape (reason: a sum of squares with positive coefficients): level sets `w1^2 + 4w2^2 = c` are ellipses centred at the origin, degenerate to a point at c = 0.

Step 2 — value at the point: `L(1,1) = 1 + 4 = 5`.

Step 3 — the level curve: `w1^2 + 4w2^2 = 5`, i.e. `w1^2/5 + w2^2/(5/4) = 1`. Semi-axis along w1 is `sqrt5 ≈ 2.236`; along w2 it is `sqrt(5/4) ≈ 1.118`.

Step 4 — check the extremes: `(2.236, 0)` gives `5 + 0 = 5` ✓ and `(0, 1.118)` gives `0 + 4(1.25) = 5` ✓.

Step 5 — steepness: moving 1 unit in w2 changes L by about `8w2` (the partial derivative, 3.4) while moving 1 unit in w1 changes it by `2w1`. At the same distance from the origin, the w2 direction is 4x steeper. Hence the ellipse is **squashed** in the w2 direction — the contours crowd there.

**Final answer:** level sets are ellipses `w1^2 + 4w2^2 = c`; through `(1,1)` the curve is `w1^2/5 + w2^2/1.25 = 1` with semi-axes 2.236 (w1) and 1.118 (w2); the w2 direction is the steeper one.

⚠️ **Common trap:** Confusing the *graph* (a surface in 3-D) with the *level set* (a curve in the 2-D input plane). The level set lives where the parameters live; the surface lives in height. Second trap: thinking a level set must be a closed loop — for `f = w1 + w2` the level sets are straight lines.

---

## 3.4 Partial derivatives

### Intuition

On a hillside you can walk north or east. A **partial derivative** is the slope you feel if you move in exactly one of those directions and freeze the other. It answers: "if I nudge *only* this parameter, how much does the loss move?"

That is precisely what we need for a model: each weight's partial derivative says how much *that* weight is to blame for the current error.

### The idea, step by step

**Step 1 – Definition.** Differentiate with respect to one variable, treating the others as constants: `∂f/∂x = lim_{h->0} [f(x+h, y) - f(x,y)] / h`. Notation: `∂f/∂x`, or `f_x`, or `∂_x f` all mean the same thing. The curly `∂` (read "del" or "partial") is used instead of `d` to warn you that other variables exist and are being held fixed.

**Step 2 – How to compute.** Literally: pretend y is a number like 7. For `f = x^2 y + 3xy^2 + y`:

```latex
\frac{\partial f}{\partial x} = 2xy + 3y^2, \qquad \frac{\partial f}{\partial y} = x^2 + 6xy + 1
```

Check the second one term by term: `x^2 y` gives `x^2`; `3x y^2` gives `3x(2y) = 6xy`; `y` gives 1.

**Step 3 – Evaluate at a point.** At `(1,2)`: `f_x = 2(1)(2) + 3(4) = 4 + 12 = 16` and `f_y = 1 + 6(1)(2) + 1 = 14`. Meaning: at that point, moving in x is slightly more influential than moving in y.

**Step 4 – Second partials.** Differentiate twice; for smooth functions the mixed ones agree, `f_xy = f_yx`. For the example: `f_xx = 2y`, `f_yy = 6x`, `f_xy = 2x + 6y`. At (1,2): `f_xx = 4`, `f_yy = 6`, `f_xy = 14`. Second partials measure **curvature** — how the slope itself changes — and they assemble into the Hessian (3.7).

**Example question:** A loss is `L(w1,w2) = (w1 + 2w2 - 3)^2 + w1^2`. Find both partial derivatives, evaluate them at `(1,1)`, and say what a gradient step would do there.

**Solution:**

Step 1 — `∂L/∂w1` (reason: chain rule on the square, then the plain `w1^2` term):

```latex
\frac{\partial L}{\partial w_1} = 2(w_1 + 2w_2 - 3)\cdot 1 + 2w_1
```

Step 2 — `∂L/∂w2` (reason: the inner derivative with respect to w2 is 2; the `w1^2` term is constant here):

```latex
\frac{\partial L}{\partial w_2} = 2(w_1 + 2w_2 - 3)\cdot 2 = 4(w_1 + 2w_2 - 3)
```

Step 3 — at `(1,1)`: the bracket is `1 + 2 - 3 = 0`, so `∂L/∂w1 = 0 + 2 = 2` and `∂L/∂w2 = 0`.

Step 4 — check numerically: `L(1,1) = 0 + 1 = 1`. With `w1 = 1.001`: bracket `= 0.001`, `L = 0.000001 + 1.002001 = 1.002002`, slope ≈ 2.002 ✓. With `w2 = 1.001`: bracket `= 0.002`, `L = 0.000004 + 1 = 1.000004`, slope ≈ 0.004 — not 0, but this is the *second-order* effect (`0.5 x 8 x 0.001^2`), so the first-order slope is indeed 0.

Step 5 — what a step does: with learning rate 0.1, `w1 <- 1 - 0.1(2) = 0.8` and `w2` does not move at first order, because the error is already flat in that direction *at this point*. Note the true minimum of this loss is not `(1,1)`; `w2` starts moving as soon as `w1` changes and the bracket becomes non-zero.

**Final answer:** `∂L/∂w1 = 2(w1 + 2w2 - 3) + 2w1` and `∂L/∂w2 = 4(w1 + 2w2 - 3)`; at `(1,1)` they are 2 and 0, so a gradient step moves `w1` down and leaves `w2` (to first order) alone.

⚠️ **Common trap:** Forgetting that the *other* variables are constants — so a term like `3xy^2` differentiated with respect to x gives `3y^2`, not `3y^2 + 6xy`. Second trap: mixing up `∂` and `d` in your answer; `df/dx` implies f depends on x alone, which is false here. Third: assuming both partials being zero is enough for a minimum — it is not, you also need the Hessian (3.7).

---

## 3.5 The gradient vector

### Intuition

Put all the partial derivatives into one vector. That vector is the **gradient**, and it has a magical property: it points in the direction of **steepest ascent**, and its length is the steepness in that direction. So to go downhill fastest, walk along `-gradient`.

That one sentence is the engine of modern AI. Every training step of every neural network is "compute the gradient, take a small step the other way".

Analogy: on a foggy hill, the gradient is a compass needle that always points uphill, with a length telling you how steep it is. Turn the needle 180 degrees and you have your downhill route.

### The idea, step by step

**Step 1 – Definition.** For `f(w1, ..., wn)`:

```latex
\nabla f = \left(\frac{\partial f}{\partial w_1},\ \frac{\partial f}{\partial w_2},\ \dots,\ \frac{\partial f}{\partial w_n}\right)
```

It is a vector of the same length as the parameter vector — one number per parameter, so one "blame score" per weight.

**Step 2 – Why it is the steepest direction.** The rate of change in a unit direction `u` is `∇f . u`. By Module 1's dot product, `∇f . u = ||∇f|| cos(theta)`, which is largest when `u` points along `∇f` (cos = 1) and most negative when it points opposite (cos = -1). So steepest ascent is `∇f`, steepest descent is `-∇f`, and the slope in either is `||∇f||`. That is a two-line proof, and it is worth memorising.

**Step 3 – A full worked gradient on a real loss.** Data `(x, y) = (1,2)` and `(2,3)`, model `y_hat = w1 + w2 x`, loss = half the sum of squared errors:

```latex
L(w_1,w_2) = \tfrac12\big[(w_1 + w_2 - 2)^2 + (w_1 + 2w_2 - 3)^2\big]
```

Differentiate with respect to `w1` (the inner derivative is 1 in both terms) and with respect to `w2` (inner derivatives 1 and 2):

```latex
\frac{\partial L}{\partial w_1} = (w_1+w_2-2) + (w_1+2w_2-3), \qquad \frac{\partial L}{\partial w_2} = (w_1+w_2-2) + 2(w_1+2w_2-3)
```

At the start `w = (0,0)`: errors are `-2` and `-3`, so

```latex
\nabla L = (-2-3,\ -2-6) = (-5,\ -8), \qquad \|\nabla L\| = \sqrt{25+64} = \sqrt{89} \approx 9.434, \qquad L = \tfrac12(4+9) = 6.5
```

**Step 4 – Take a step.** With learning rate `eta = 0.1`, `w <- w - eta ∇L`:

```latex
w = (0,0) - 0.1(-5,-8) = (0.5,\ 0.8)
```

New errors: `0.5 + 0.8 - 2 = -0.7` and `0.5 + 1.6 - 3 = -0.9`, so `L = (0.49 + 0.81)/2 = 0.65`. One step took the loss from 6.5 to 0.65. New gradient: `(-0.7-0.9,\ -0.7-1.8) = (-1.6,-2.5)`, so the next step gives `w = (0.66, 1.05)` and `L = (0.0841 + 0.0576)/2 = 0.07085`.

**Step 5 – Where does it stop?** The gradient is zero exactly when both errors vanish, i.e. `w1 + w2 = 2` and `w1 + 2w2 = 3`, giving `w = (1,1)` — the true minimum, where `L = 0`. (Module 4 solves this properly; here the point is that the gradient shrinks as we approach it.)

**Example question:** For `f(w1,w2) = w1^2 + 3w1w2 + w2^2`, find the gradient at `(1,2)`, its magnitude, and the unit vector of steepest descent. Verify that moving a tiny distance along the *ascent* direction increases f at the rate you predicted.

**Solution:**

Step 1 — partials (reason: treat the other variable as constant):

```latex
\frac{\partial f}{\partial w_1} = 2w_1 + 3w_2, \qquad \frac{\partial f}{\partial w_2} = 3w_1 + 2w_2
```

Step 2 — evaluate at `(1,2)`: `∇f = (2 + 6,\ 3 + 4) = (8, 7)`.

Step 3 — magnitude: `||∇f|| = sqrt(64 + 49) = sqrt113 ≈ 10.630`.

Step 4 — unit directions: steepest ascent `u = (8,7)/10.630 = (0.7526, 0.6585)`; steepest descent is `-u`.

Step 5 — verify with a tiny step: `f(1,2) = 1 + 6 + 4 = 11`. Move to `(1 + 0.001 x 0.7526,\ 2 + 0.001 x 0.6585) = (1.0007526, 2.0006585)`:

```latex
f = 1.0007526^2 + 3(1.0007526)(2.0006585) + 2.0006585^2 = 1.0015055 + 6.0064917 + 4.0026345 = 11.0106317
```

The increase is `0.0106317` over a distance of `0.001`, i.e. a rate of `10.63` — exactly `||∇f||` ✓. That confirms "gradient length = steepness in the steepest direction".

**Final answer:** `∇f(1,2) = (8,7)`, `||∇f|| = sqrt113 ≈ 10.63`, steepest descent direction `-(8,7)/sqrt113 ≈ (-0.753, -0.659)`, and a small step uphill raises f at 10.63 per unit distance.

⚠️ **Common trap:** Confusing the gradient (a vector of partials) with the directional derivative (a number, `∇f . u`). Second: forgetting the minus sign — `+∇f` is *ascent*, so gradient **descent** is `w <- w - eta ∇f`. Third: using a learning rate so large that the step overshoots the valley and the loss grows; `eta` must be small relative to the curvature.

---

## 3.6 The multivariable chain rule

### Intuition

Real models are chains: a weight feeds a weighted sum, which feeds an activation, which feeds a loss. The multivariable chain rule says sensitivities **multiply along the chain and add across branches**. Apply it mechanically from the loss backwards and you have backpropagation.

This section is concept only — you will not implement backprop here — but the mathematics is nothing more than what follows.

Analogy: a factory line. A defect in the last station can be traced back to each earlier station, and the "amount of blame" at each stage is the product of the sensitivities along the way.

### The idea, step by step

**Step 1 – The single-path rule.** If `L` depends on `z` and `z` depends on `w`, then `∂L/∂w = (∂L/∂z)(∂z/∂w)`.

**Step 2 – The multi-path rule.** If `w` influences `L` through several routes, add the routes, each route contributing the product of its local derivatives. For `L = f(u, v)` with `u = u(w)`, `v = v(w)`: `dL/dw = (∂L/∂u)(du/dw) + (∂L/∂v)(dv/dw)`.

**Step 3 – The computational graph.** Draw every intermediate value as a node and every dependency as an arrow. For one hidden unit:

```text
x --(w1)--> z = w1*x + b1 --(relu)--> a --(w2)--> yhat --(loss)--> L
```

Forward pass: compute left to right, storing each intermediate. Backward pass: compute `dL/d(each node)` right to left, reusing what you already computed. That reuse is why it is cheap — each node is visited once, no matter how big the graph.

**Step 4 – Do a full backward pass by hand.** Numbers: `x = 2`, `w1 = 1`, `b1 = 0`, `w2 = 0.5`, target `y = 3`, loss `L = (1/2)(yhat - y)^2`.

Forward: `z = 1(2) + 0 = 2`; `a = relu(2) = 2`; `yhat = 0.5(2) = 1`; `L = (1/2)(1-3)^2 = 2`.

Backward, one local derivative at a time:

```latex
\frac{\partial L}{\partial \hat{y}} = \hat{y} - y = -2, \quad \frac{\partial L}{\partial w_2} = \frac{\partial L}{\partial \hat{y}}\,a = -4, \quad \frac{\partial L}{\partial a} = \frac{\partial L}{\partial \hat{y}}\,w_2 = -1
```

```latex
\frac{\partial a}{\partial z} = 1 \ (\text{relu active}) \Rightarrow \frac{\partial L}{\partial z} = -1, \qquad \frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial z}\,x = -2, \qquad \frac{\partial L}{\partial b_1} = \frac{\partial L}{\partial z} = -1
```

**Step 5 – Check one of them numerically.** Nudge `w1` to 1.001: `z = 2.002`, `yhat = 1.001`, `L = (1/2)(1.001-3)^2 = 1.9980005`. Change `= -0.0019995` over `0.001`, so the slope is `-1.9995 ≈ -2` ✓ — the chain rule was right.

**Step 6 – Apply the update.** With `eta = 0.1`: `w1 <- 1 - 0.1(-2) = 1.2`, `b1 <- 0 + 0.1 = 0.1`, `w2 <- 0.5 - 0.1(-4) = 0.9`. New forward pass: `z = 1.2(2) + 0.1 = 2.5`, `yhat = 0.9(2.5) = 2.25`, `L = (1/2)(0.75)^2 = 0.28125`. The loss fell from 2 to 0.281 in one step.

**Example question:** A two-step chain has `L = (u - 4)^2`, `u = 3v`, `v = 2w + 1`. At `w = 1`, find `dL/dw` using the chain rule, and verify it numerically.

**Solution:**

Step 1 — forward values: `v = 2(1) + 1 = 3`, `u = 3(3) = 9`, `L = (9-4)^2 = 25`.

Step 2 — local derivatives (reason: differentiate each link separately):

```latex
\frac{\partial L}{\partial u} = 2(u-4) = 10, \qquad \frac{du}{dv} = 3, \qquad \frac{dv}{dw} = 2
```

Step 3 — multiply along the chain:

```latex
\frac{dL}{dw} = 10 \times 3 \times 2 = 60
```

Step 4 — numeric check: at `w = 1.001`, `v = 3.002`, `u = 9.006`, `L = 5.006^2 = 25.060036`. Change `0.060036` over `0.001` gives a slope of about `60.04` ✓.

Step 5 — interpretation: the loss is very sensitive to w here, so a training step would move w substantially; note that as u approaches 4 the first factor `2(u-4)` shrinks, so sensitivity falls automatically near the target — this is why training slows near a good solution.

**Final answer:** `dL/dw = 60` at `w = 1`, confirmed numerically (≈ 60.04).

⚠️ **Common trap:** Adding the local derivatives instead of multiplying them. In a chain you multiply; you only add when there are **several parallel paths** from the same variable. Second trap: forgetting that ReLU's derivative is 0 for negative input, which kills the gradient for that unit (the "dead ReLU" problem). Third: in a graph, mixing up the direction — the forward pass stores values, the backward pass only multiplies local derivatives.

---

## 3.7 Jacobian and Hessian

### Intuition

The gradient handles "many inputs, one output". Two more objects cover the rest. The **Jacobian** handles "many inputs, many outputs" — a matrix of first derivatives, one row per output. The **Hessian** handles second derivatives of a single output — a matrix of curvature, which tells you whether you are in a bowl, a dome or a saddle.

Analogy: the gradient says which way is down; the Hessian says what shape the ground is. Walking downhill with only the gradient is like feeling with your toes; the Hessian is knowing whether the ground curves up ahead.

### The idea, step by step

**Step 1 – Jacobian.** For `f: R^n -> R^m` with components `f1 ... fm`, the Jacobian is the m x n matrix `J_ij = ∂f_i/∂w_j`:

```latex
J = \begin{pmatrix} \partial f_1/\partial w_1 & \cdots & \partial f_1/\partial w_n \\ \vdots & & \vdots \\ \partial f_m/\partial w_1 & \cdots & \partial f_m/\partial w_n \end{pmatrix}
```

Shape rule: **m rows (outputs) by n columns (inputs)**. A single layer `f(x) = Wx + b` has `J = W` — the weight matrix *is* its Jacobian, which is why layer shapes look the way they do.

**Step 2 – What the Jacobian tells you.** It is the best linear approximation of a vector function: `f(w + d) ≈ f(w) + J d`. Each row is the gradient of one output; each column says how all outputs respond to one input. In backpropagation, the local derivative at a layer is exactly its Jacobian, and the backward pass multiplies Jacobians (3.6).

**Step 3 – Hessian.** For a scalar `f: R^n -> R`, the Hessian is the n x n matrix of second derivatives:

```latex
H = \begin{pmatrix} f_{w_1w_1} & f_{w_1w_2} & \cdots \\ f_{w_2w_1} & f_{w_2w_2} & \cdots \\ \vdots & & \ddots \end{pmatrix}, \qquad H = H^{\mathsf T} \text{ (mixed partials agree)}
```

Shape rule: **n x n, always square and symmetric**, because it belongs to one output.

**Step 4 – What the Hessian tells you.** At a point where `∇f = 0` (a critical point), the Hessian classifies it using Module 2's positive-definiteness:

| Hessian at a critical point | Meaning |
| --- | --- |
| positive definite (all eigenvalues > 0) | local **minimum** (bowl) |
| negative definite | local **maximum** (dome) |
| indefinite (mixed signs) | **saddle point** |
| singular (a zero eigenvalue) | flat direction; test is inconclusive |

Its eigenvalues are also the curvatures along the principal directions, so the ratio `lambda_max/lambda_min` is the condition number that decides how fast gradient descent converges (2.9).

**Step 5 – A worked Hessian for a real loss.** For our regression loss `L = (1/2)[(w1+w2-2)^2 + (w1+2w2-3)^2]`, differentiate the gradient `(e1 + e2, e1 + 2e2)` once more, where `e1 = w1+w2-2`, `e2 = w1+2w2-3`:

```latex
H = \begin{pmatrix} 1+1 & 1+2 \\ 1+2 & 1+4 \end{pmatrix} = \begin{pmatrix} 2 & 3 \\ 3 & 5 \end{pmatrix}
```

`det H = 10 - 9 = 1 > 0` and `H_11 = 2 > 0`, so H is positive definite: the loss surface is a genuine bowl with a single minimum — the `w = (1,1)` we found in 3.5. (Note that `H` is exactly `A^T A` for the feature matrix `A`, which is why least squares is always a bowl when the columns are independent.)

**Example question:** For `f(w1,w2) = w1^2 + w1w2 + w2^2 - 3w1`, find the gradient, the critical point, and the Hessian; classify the critical point.

**Solution:**

Step 1 — gradient:

```latex
\nabla f = (2w_1 + w_2 - 3,\ \ w_1 + 2w_2)
```

Step 2 — set it to zero (reason: critical points need both partials zero):

```latex
2w_1 + w_2 = 3, \qquad w_1 + 2w_2 = 0 \;\Rightarrow\; w_1 = -2w_2 \;\Rightarrow\; -4w_2 + w_2 = 3 \;\Rightarrow\; w_2 = -1,\ w_1 = 2
```

Step 3 — Hessian (second partials of each gradient component):

```latex
H = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}
```

Step 4 — classify: `H_11 = 2 > 0` and `det H = 4 - 1 = 3 > 0`, so H is positive definite; eigenvalues `3` and `1` (from `(2-lambda)^2 - 1 = 0`) are both positive.

Step 5 — value: `f(2,-1) = 4 - 2 + 1 - 6 = -3`.

**Final answer:** `∇f = (2w1 + w2 - 3, w1 + 2w2)`; the only critical point is `(2,-1)` with `f = -3`; `H = [[2,1],[1,2]]` is positive definite (eigenvalues 3, 1), so `(2,-1)` is a **local minimum** — and since H is positive definite everywhere, it is the global minimum.

⚠️ **Common trap:** Getting the Hessian's shape wrong — it is n x n for one output, not m x n (that is the Jacobian). Second: checking only `det H > 0` and forgetting `H_11`; `[[-2,-1],[-1,-2]]` also has positive determinant but is negative definite. Third: classifying a point that is not critical — the Hessian test applies **only** where the gradient is zero.

---

## 3.8 Taylor approximation

### Intuition

Taylor's idea: near a point, almost any smooth function looks like a polynomial. Use the value, the slope, and the curvature you already have, and you can predict nearby values without recomputing the function.

This is not a curiosity — it is how optimisation methods reason. "The gradient says the ground slopes down here; the curvature says how far to trust that" is a Taylor expansion in disguise, and it is why Newton's method uses the Hessian while gradient descent does not.

Analogy: predicting tomorrow's temperature from today's. Today 30 degrees, rising 2 per day, and the rise is slowing by 0.5 per day — the second-order forecast is better than the first.

### The idea, step by step

**Step 1 – Single variable.** Around a point `a`:

```latex
f(a+h) \approx f(a) + f'(a)h + \frac{f''(a)}{2}h^2 + \frac{f'''(a)}{6}h^3 + \dots
```

- zeroth order: a constant (useless for optimisation);
- first order: the tangent line — the gradient step;
- second order: a parabola — captures curvature, which is the Hessian's job.

**Step 2 – Worked single-variable example.** `f(x) = sqrt(x)` around `a = 4`: `f(4) = 2`, `f'(x) = 1/(2 sqrt x)` so `f'(4) = 1/4`, `f''(x) = -1/(4 x^{3/2})` so `f''(4) = -1/32`. Hence

```latex
\sqrt{4+h} \approx 2 + \frac{h}{4} - \frac{h^2}{64}
```

At `h = 0.1`: first order gives `2.025`, second order gives `2 + 0.025 - 0.00015625 = 2.02484375`. The true value is `2.02484567...`, so the second-order error is about `2 x 10^-6` — five correct decimals from three numbers.

**Step 3 – Multivariable version.** Around `w0`, with `d` the step:

```latex
f(\mathbf{w}_0 + \mathbf{d}) \approx f(\mathbf{w}_0) + \nabla f(\mathbf{w}_0)^{\mathsf T}\mathbf{d} + \tfrac12\,\mathbf{d}^{\mathsf T}H(\mathbf{w}_0)\,\mathbf{d}
```

Read it as: current value, plus "gradient times step", plus "half the step squared, weighted by curvature". The middle term is a dot product (Module 1), the last is a quadratic form (2.3) — nothing new, just assembled.

**Step 4 – Use it on our regression loss.** At `w0 = (0.5, 0.8)` we had `L = 0.65`, `∇L = (-1.6, -2.5)`, `H = [[2,3],[3,5]]`. With the step `d = (0.16, 0.25)`: `∇L.d = -1.6(0.16) - 2.5(0.25) = -0.881`, and `Hd = (2(0.16)+3(0.25), 3(0.16)+5(0.25)) = (1.07, 1.73)`, so `(1/2)d^T H d = (1/2)[0.16(1.07) + 0.25(1.73)] = 0.30185`. So `L ≈ 0.65 - 0.881 + 0.30185 = 0.07085`. That is **exactly** the value we computed in 3.5 — as it must be, because this loss is itself a quadratic, so its second-order Taylor expansion is exact and the third-order terms are zero. A nice check that both sections agree.

**Step 5 – Why optimisation methods use it.** Gradient descent keeps only the first-order term, so it must use a small `eta` to stay in the region where the tangent is trustworthy. Newton's method keeps the second-order term and solves `H d = -∇f` for the step, which jumps straight to the minimum of the local parabola — much faster when H is well conditioned, more fragile when it is not (Module 4).

**Example question:** Use a second-order Taylor expansion of `f(x) = sqrt(x)` at `a = 4` to estimate `sqrt(4.1)` and `sqrt(5)`, and comment on which estimate is better.

**Solution:**

Step 1 — derivatives at a = 4: `f = 2`, `f' = 1/4 = 0.25`, `f'' = -1/32 = -0.03125`.

Step 2 — write the expansion: `sqrt(4+h) ≈ 2 + 0.25h - 0.015625 h^2`.

Step 3 — at `h = 0.1`: `2 + 0.025 - 0.00015625 = 2.02484375`; true value `2.02484567`, error ≈ `2 x 10^-6`.

Step 4 — at `h = 1`: `2 + 0.25 - 0.015625 = 2.234375`; true value `sqrt5 = 2.2360679...`, error ≈ `0.0017`.

Step 5 — comment: the same formula is 800 times more accurate at h = 0.1 than at h = 1. Taylor is a **local** approximation — the error grows fast as you move away from a, which is exactly why learning rates must be small.

**Final answer:** `sqrt(4.1) ≈ 2.02484` (error ≈ 2 x 10^-6) and `sqrt(5) ≈ 2.23438` (error ≈ 0.0017); both use the same expansion, and the far point is far worse.

⚠️ **Common trap:** Forgetting the `1/2` in the second-order term of the multivariable version — it comes from the `f''(a)/2` in the single-variable formula, and dropping it doubles your curvature correction. Second: using a Taylor expansion far from the expansion point and trusting it. Third: confusing the Hessian term with a matrix multiplication in the wrong order; it is `d^T H d`, a scalar.

---

## 3.9 Integration essentials

### Intuition

Integration is **accumulation**: chop a region into thin strips, add up strip areas, and take the limit as the strips get thin. Definite integral = signed area under a curve.

Why it matters in AI: probabilities of continuous quantities are areas under a **density** curve, and averages (expected values) are integrals. "Expected loss", "the probability that the error exceeds 0.5", "the area under the ROC curve" — all integrals.

Analogy: a speedometer reading over a journey. The integral of speed over time is the distance travelled — you are adding up tiny `speed x time` rectangles.

### The idea, step by step

**Step 1 – The definite integral.** The limit of a sum of rectangles:

```latex
\int_a^b f(x)\,dx = \lim_{n\to\infty}\sum_{i=1}^{n} f(x_i)\,\Delta x, \qquad \Delta x = \frac{b-a}{n}
```

`dx` is the "infinitely thin width", `f(x)` is the height, so `f(x) dx` is a strip's area.

**Step 2 – The fundamental theorem.** Differentiation and integration undo each other: if `F' = f`, then `∫_a^b f = F(b) - F(a)`. So you integrate by finding an antiderivative — that is the practical route for everything in this course.

**Step 3 – Basic antiderivatives.** `∫ x^n dx = x^(n+1)/(n+1)` for `n != -1`; `∫ e^x dx = e^x`; `∫ (1/x) dx = ln|x|`; `∫ cos x dx = sin x`.

**Step 4 – The probability link.** A **probability density** `p(x)` on an interval satisfies two conditions: `p(x) >= 0` and the total area is 1:

```latex
\int_{-\infty}^{\infty} p(x)\,dx = 1, \qquad P(a \le X \le b) = \int_a^b p(x)\,dx, \qquad E[X] = \int x\,p(x)\,dx
```

Variance follows as `Var(X) = E[X^2] - (E[X])^2`, and `E[X^2] = ∫ x^2 p(x) dx`. (Module 5 develops this; here we just compute.)

**Step 5 – A worked density.** Let `p(x) = 3x^2` on `[0,1]`, 0 elsewhere. Check: `∫_0^1 3x^2 dx = [x^3]_0^1 = 1` ✓. Then `E[X] = ∫_0^1 3x^3 dx = [3x^4/4]_0^1 = 0.75` and `E[X^2] = ∫_0^1 3x^4 dx = 3/5 = 0.6`, so `Var(X) = 0.6 - 0.5625 = 0.0375`. Interpretation: this density piles up near 1, so the mean is above the midpoint 0.5 — which is what we got.

**Example question:** The error of a sensor is modelled by the uniform density `p(x) = 1/2` on `[0,2]` (zero elsewhere). Verify it is a valid density, find `E[X]` and `Var(X)`, and find `P(X <= 0.5)`.

**Solution:**

Step 1 — total area (reason: a density must integrate to 1):

```latex
\int_0^2 \frac12\,dx = \left[\frac{x}{2}\right]_0^2 = 1\ \checkmark
```

Step 2 — expected value:

```latex
E[X] = \int_0^2 x\cdot\frac12\,dx = \left[\frac{x^2}{4}\right]_0^2 = 1
```

Step 3 — second moment: `E[X^2] = ∫_0^2 x^2/2 dx = [x^3/6]_0^2 = 8/6 = 4/3`.

Step 4 — variance: `Var(X) = 4/3 - 1^2 = 1/3 ≈ 0.333`.

Step 5 — probability: `P(X <= 0.5) = ∫_0^{0.5} 1/2 dx = 0.25`. Check against intuition: the interval `[0,0.5]` is a quarter of the support `[0,2]`, and the density is flat, so a quarter of the probability ✓.

**Final answer:** valid density (area 1); `E[X] = 1`; `Var(X) = 1/3`; `P(X <= 0.5) = 0.25`.

⚠️ **Common trap:** Forgetting the limits or the `dx`, and writing `∫ x p(x)` with no bounds when the question asks for a number. Second: computing `E[X^2]` and calling it the variance — subtract `(E[X])^2`. Third: using a density that does not integrate to 1, which makes every later answer wrong; check that first, always.

---

## 3.10 AI/ML meaning throughout

| Maths idea | What it is in AI |
| --- | --- |
| Derivative | Sensitivity of the loss to one parameter |
| Chain rule | How blame flows backwards through nested layers |
| Function of several variables | The loss as a surface over the parameter space |
| Level set / contour | A map of "all parameter settings giving this error" |
| Partial derivative | How much one weight is to blame, others frozen |
| Gradient | Direction of steepest ascent; its negative is the training direction |
| Gradient magnitude | How steep the loss is; large means far from a good fit |
| Computational graph | The model written as a sequence of small operations |
| Backpropagation | The chain rule applied right to left on that graph |
| Jacobian | Local linear map of a layer; its rows are output gradients |
| Hessian | Curvature: bowl, dome or saddle; sets the safe learning rate |
| Taylor expansion | Why small steps are safe and how Newton's method jumps |
| Integral / density | Expected loss, probability of an error, continuous uncertainty |

**Why gradients drive learning.** Training means "make the loss smaller". The gradient is the only local information that says which way is smaller, and it is available for every parameter at once, at roughly the cost of one extra forward pass. That combination — correct direction, all parameters, cheap — is why gradient-based training won. Backpropagation is not a different idea from the chain rule; it is the chain rule organised so that shared intermediate values are computed once.

---

## Formula / rule summary table

| # | Formula | Meaning | When to use |
| --- | --- | --- | --- |
| 1 | `f'(x) = lim (f(x+h) - f(x))/h` | derivative as a limit of slopes | First principles; proofs |
| 2 | `(x^n)' = n x^(n-1)`, `(uv)' = u'v + uv'` | power, product | Any polynomial or product |
| 3 | `(u/v)' = (u'v - uv')/v^2` | quotient | Ratios, e.g. normalised losses |
| 4 | `f(g(x))' = f'(g(x)) g'(x)` | chain rule | Nested functions — everywhere in AI |
| 5 | `dL/dw = (dL/du)(du/dw)` | sensitivity along one path | Backpropagation, single route |
| 6 | `∂f/∂x` (y held fixed) | partial derivative | Many-parameter losses |
| 7 | `∇f = (∂f/∂w1, ..., ∂f/∂wn)` | gradient vector | Direction of steepest ascent |
| 8 | `∇f . u` = rate in direction u | directional derivative | Checking any direction |
| 9 | `w <- w - eta ∇L` | gradient descent step | Training |
| 10 | `dL/dw = sum over paths` | multivariable chain rule | Branches in a graph |
| 11 | `J_ij = ∂f_i/∂w_j` (m x n) | Jacobian | Vector outputs, layers |
| 12 | `H_ij = ∂²f/∂w_i∂w_j` (n x n) | Hessian | Curvature; classifying critical points |
| 13 | `f(a+h) ≈ f(a) + f'(a)h + f''(a)h²/2` | Taylor, one variable | Local approximation |
| 14 | `f(w+d) ≈ f(w) + ∇f.d + (1/2)d^T H d` | Taylor, several variables | Newton's method; step-size reasoning |
| 15 | `∫_a^b f dx = F(b) - F(a)` | definite integral | Areas, probabilities |
| 16 | `E[X] = ∫ x p(x) dx`, `Var = E[X²] - (E[X])²` | expectation, variance | Densities, expected loss |

### Which formula when? (quick guide)

- See *"rate of change"*, *"slope"*, *"from first principles"* -> the limit definition of `f'`.
- See a **product** of two functions -> `u'v + uv'`; a **ratio** -> the quotient rule.
- See a **function inside a function** -> chain rule, multiply the local derivatives.
- See *"how sensitive is the loss to this weight"* -> `dL/dw` by the chain rule.
- See *"how does the loss change if I move only w1"* -> the partial derivative, freezing the rest.
- See *"which direction decreases the loss fastest"* -> `-∇L`.
- See *"step of gradient descent"* -> `w <- w - eta ∇L`, then recompute the loss to check it fell.
- See a **network / nested expressions / branches** -> computational graph, backward pass, sum over paths.
- See *"many outputs"* -> Jacobian (m x n); *"one output, curvature"* -> Hessian (n x n).
- See *"is this critical point a min or a saddle"* -> Hessian definiteness (all eigenvalues positive = min).
- See *"approximate near a point"* -> Taylor; first order for a step, second order for curvature.
- See *"area under the curve"*, *"probability"*, *"expected value"* -> definite integral of the density.

---

## Solved examples

### Example 1 (easy) — gradient and one descent step

**Question:** `L(w1,w2) = w1^2 + 2w2^2`. Start at `(2,1)`, take one gradient-descent step with `eta = 0.1`, and confirm the loss fell.

**Solution:**

Step 1 — gradient: `∇L = (2w1, 4w2)`, so at `(2,1)` it is `(4, 4)`.

Step 2 — loss now: `L(2,1) = 4 + 2 = 6`.

Step 3 — update: `w <- (2,1) - 0.1(4,4) = (1.6, 0.6)`.

Step 4 — loss after: `1.6^2 + 2(0.6)^2 = 2.56 + 0.72 = 3.28`.

Step 5 — check the drop: `6 -> 3.28`, so the step worked. Note the direction: the gradient points uphill, so we subtracted it.

**Final answer:** `∇L(2,1) = (4,4)`; new point `(1.6, 0.6)`; loss fell from 6 to 3.28. (The minimum is `(0,0)` with `L = 0`, so further steps continue in the same spirit.)

### Example 2 (medium) — a full backward pass on a two-layer chain

**Question:** With `x = 2`, `w1 = 1`, `b1 = 0`, `w2 = 0.5`, `y = 3`, `z = w1x + b1`, `a = relu(z)`, `yhat = w2 a`, `L = (1/2)(yhat - y)^2`, compute all gradients and take one step with `eta = 0.1`.

**Solution:**

Step 1 — forward: `z = 2`, `a = 2`, `yhat = 1`, `L = (1/2)(-2)^2 = 2`.

Step 2 — backward, last link first: `∂L/∂yhat = yhat - y = -2`.

Step 3 — through `yhat = w2 a`: `∂L/∂w2 = (∂L/∂yhat) a = -4` and `∂L/∂a = (∂L/∂yhat) w2 = -1`.

Step 4 — through `a = relu(z)`: `∂a/∂z = 1` (positive input), so `∂L/∂z = -1`.

Step 5 — through `z = w1 x + b1`: `∂L/∂w1 = (∂L/∂z) x = -2` and `∂L/∂b1 = ∂L/∂z = -1`.

Step 6 — numeric check of `∂L/∂w1`: at `w1 = 1.001`, `L = 1.9980005`, a change of `-0.0019995` for `+0.001`, slope `≈ -2` ✓.

Step 7 — update: `w1 = 1.2`, `b1 = 0.1`, `w2 = 0.9`. New forward: `z = 2.5`, `yhat = 2.25`, `L = 0.28125`.

**Final answer:** `∂L/∂yhat = -2`, `∂L/∂w2 = -4`, `∂L/∂a = -1`, `∂L/∂z = -1`, `∂L/∂w1 = -2`, `∂L/∂b1 = -1`; after the step `(w1, b1, w2) = (1.2, 0.1, 0.9)` and the loss drops from 2 to 0.28125.

### Example 3 (exam level) — classify a critical point and use Taylor

**Question:** For `L(w1,w2) = w1^2 + 3w1w2 + w2^2`, find the critical point, classify it with the Hessian, and use a second-order Taylor expansion at `(1,2)` to estimate `L(1.05, 2.1)`.

**Solution:**

Step 1 — gradient: `∇L = (2w1 + 3w2, 3w1 + 2w2)`.

Step 2 — critical point: `2w1 + 3w2 = 0` and `3w1 + 2w2 = 0`. Subtracting gives `-w1 + w2 = 0`, so `w2 = w1`, and then `5w1 = 0`, so the only critical point is `(0,0)`.

Step 3 — Hessian: `H = [[2,3],[3,2]]` (constant here). `H_11 = 2 > 0` but `det H = 4 - 9 = -5 < 0`, so H is **indefinite** — eigenvalues from `(2-lambda)^2 - 9 = 0` are `5` and `-1`.

Step 4 — conclusion: `(0,0)` is a **saddle point**, not a minimum. Indeed `L(1,0) = 1 > 0` but `L(1,-1) = 1 - 3 + 1 = -1 < 0`.

Step 5 — Taylor at `(1,2)`: `L = 1 + 6 + 4 = 11`, `∇L = (2 + 6, 3 + 4) = (8,7)`, `H = [[2,3],[3,2]]`, and `d = (0.05, 0.1)`.

```latex
\nabla L^{\mathsf T}\mathbf{d} = 8(0.05) + 7(0.1) = 0.4 + 0.7 = 1.1, \qquad H\mathbf{d} = (2(0.05)+3(0.1),\ 3(0.05)+2(0.1)) = (0.4,\ 0.35)
```

```latex
\tfrac12\mathbf{d}^{\mathsf T}H\mathbf{d} = \tfrac12[0.05(0.4) + 0.1(0.35)] = \tfrac12(0.055) = 0.0275 \;\Rightarrow\; L \approx 11 + 1.1 + 0.0275 = 12.1275
```

Step 6 — exact check: `L(1.05, 2.1) = 1.1025 + 3(1.05)(2.1) + 4.41 = 1.1025 + 6.615 + 4.41 = 12.1275` ✓ — exact, because L is a quadratic.

**Final answer:** critical point `(0,0)`, `H = [[2,3],[3,2]]` indefinite (eigenvalues 5, -1), so it is a **saddle**; the Taylor estimate `L(1.05, 2.1) ≈ 12.1275` matches the exact value.

---

## Common traps and mistakes

- **Cancelling h before it appears everywhere** in the limit definition. Expand, cancel, then take the limit.
- **Dropping the inner derivative in the chain rule** (`2(w^2-4)` instead of `2(w^2-4)(2w)`). It silently rescales every gradient.
- **Adding instead of multiplying along a chain.** Multiply along a path; add across parallel paths.
- **Forgetting the other variables are constants** in a partial derivative.
- **Confusing gradient with directional derivative.** The gradient is a vector; the rate in a direction is `∇f . u`, a number.
- **Using `+∇f` for descent.** Descent is `w <- w - eta ∇f`.
- **A learning rate too large for the curvature.** The Taylor argument shows the step must stay in the region where the local model holds.
- **Classifying a non-critical point with the Hessian.** The test needs `∇f = 0` first.
- **Testing only `det H > 0`.** You also need `H_11 > 0` for a minimum; negative definite matrices can have positive determinant.
- **Mixing up Jacobian and Hessian shapes.** Jacobian is m x n (outputs x inputs); Hessian is n x n for one output.
- **Dropping the `1/2` in the second-order Taylor term.**
- **Treating `E[X^2]` as the variance.** Subtract `(E[X])^2`, and check the density integrates to 1 first.
- **Forgetting ReLU's derivative is 0 for negative input**, which kills the gradient for that unit.

---

## Quick revision box

- ✅ Derivative = sensitivity = slope. From first principles: expand, cancel h, then let `h -> 0`.
- ✅ Chain rule: multiply local derivatives along a path; add across parallel paths. That is backpropagation.
- ✅ Partial derivative: differentiate in one variable, freeze the rest. Gradient = vector of all partials.
- ✅ `∇f` points uphill; `-∇f` is the training direction; `||∇f||` is the steepness in that direction.
- ✅ Gradient descent: `w <- w - eta ∇f`, then recompute the loss to confirm it fell.
- ✅ Jacobian = first derivatives, m x n; Hessian = second derivatives, n x n, symmetric.
- ✅ At `∇f = 0`: Hessian positive definite -> minimum, negative definite -> maximum, indefinite -> saddle.
- ✅ Taylor: `f(w+d) ≈ f(w) + ∇f.d + (1/2) d^T H d`. First order = the gradient step; second order = the curvature correction. Exact for quadratics.
- ✅ Integral = area = accumulation. Density integrates to 1; `E[X] = ∫ x p(x) dx`; `Var = E[X²] - (E[X])²`.

---

## Practice questions

1. Differentiate `f(x) = 3x^4 - 2x + 7` and evaluate `f'(1)`.
2. Use the chain rule on `L(w) = (2w + 1)^3` to find `dL/dw`, then evaluate at `w = 1`.
3. For `f(x,y) = x^2y^3 + 4x - y`, find both partial derivatives and evaluate them at `(2,1)`.
4. For `L(w1,w2) = (w1 - 1)^2 + (w2 + 2)^2 + w1w2`, find the gradient and the critical point, then classify it with the Hessian.
5. A chain has `L = (u - 5)^2`, `u = 2v`, `v = 3w - 1`. At `w = 1`, find `dL/dw` and verify numerically.
6. A density is `p(x) = 2x` on `[0,1]`. Verify it integrates to 1, and find `E[X]`, `Var(X)` and `P(X <= 0.5)`.

## Answers

**1.** `f'(x) = 12x^3 - 2`, so `f'(1) = 10`.

**2.** Outside `( )^3`, inside `2w + 1`: `dL/dw = 3(2w+1)^2 x 2 = 6(2w+1)^2`. At `w = 1`: `6(3)^2 = 54`. Check: `L(1) = 27`, `L(1.001) = (3.002)^3 = 27.054054`, slope ≈ 54.05 ✓.

**3.** `f_x = 2xy^3 + 4` and `f_y = 3x^2y^2 - 1`. At `(2,1)`: `f_x = 2(2)(1) + 4 = 8` and `f_y = 3(4)(1) - 1 = 11`.

**4.** `∇L = (2(w1-1) + w2, 2(w2+2) + w1)`. Setting both to zero: `2w1 + w2 = 2` and `w1 + 2w2 = -4`. From the second, `w1 = -4 - 2w2`; substituting, `-8 - 4w2 + w2 = 2` gives `w2 = -10/3` and `w1 = -4 + 20/3 = 8/3`. Hessian `H = [[2,1],[1,2]]`: `H_11 = 2 > 0`, `det = 3 > 0`, so positive definite — a **minimum**, with `L = (5/3)^2 + (-4/3)^2 + (8/3)(-10/3) = 25/9 + 16/9 - 80/9 = -39/9 = -13/3 ≈ -4.333`.

**5.** `v = 3(1) - 1 = 2`, `u = 4`, `L = (4-5)^2 = 1`. Local derivatives: `dL/du = 2(u-5) = -2`, `du/dv = 2`, `dv/dw = 3`, so `dL/dw = -12`. Check: at `w = 1.001`, `v = 2.003`, `u = 4.006`, `L = 0.994^2 = 0.988036`, a change of `-0.011964` over `0.001`, slope ≈ `-11.96` ✓.

**6.** `∫_0^1 2x dx = [x^2]_0^1 = 1` ✓. `E[X] = ∫_0^1 2x^2 dx = 2/3`. `E[X^2] = ∫_0^1 2x^3 dx = 1/2`, so `Var(X) = 1/2 - 4/9 = 1/18 ≈ 0.0556`. `P(X <= 0.5) = ∫_0^{0.5} 2x dx = 0.25`.
