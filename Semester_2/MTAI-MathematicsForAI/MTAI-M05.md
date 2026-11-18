# Mathematics for AI – Module 5

## Probability

*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

A model that says "this email is spam" is guessing. A model that says "this email is spam with probability 0.97" is telling you how much to trust it. Probability is the language that turns a guess into a number you can act on.

Three things it buys us:

1. **Uncertainty is unavoidable.** Data is noisy, samples are small, labels are wrong sometimes. Probability is how we carry that honestly.
2. **Training is probabilistic.** "Most likely parameters given the data" is a probability statement, and cross-entropy loss is a probability formula in disguise.
3. **Decisions need thresholds.** A spam filter blocking at 0.5 versus 0.99 is a business decision built on a probability.

**Analogy:** a weather forecast says 70% chance of rain. It is not describing today's weather — it is describing how often, across all days that looked like today, it rained. That shift from "what happened" to "how often across many repeats" is the whole subject.

**Prerequisites:** fractions and percentages, sets (`A ∩ B`, `A ∪ B`), and the integral as area under a curve (Module 3, section 3.9).

---

## Basics you must know first

- **Experiment** – anything with an uncertain outcome: rolling a die, drawing an email at random.
- **Sample space `S`** – the set of all possible outcomes.
- **Event** – a subset of the sample space; "an outcome we care about".
- **`P(A)`** – a number between 0 and 1 saying how likely event `A` is.
- **Set notation** – `A ∩ B` means both happen (AND), `A ∪ B` means at least one happens (OR), `A^c` means `A` does not happen (NOT).

---

## 5.1 Probability foundations

### Intuition

Roll a die. You cannot say what will happen, but you can say that each face is equally likely, so each has probability `1/6`. Probability is bookkeeping for "how much of the total possibility" an outcome occupies.

Two ways to read `P(A) = 0.3`: the **frequency** reading (run the experiment many times, about 30% of runs give `A`) and the **belief** reading (you would bet 30 rupees against 70 on `A`). Both are useful in AI — the first for evaluating a model, the second for reasoning about a single prediction.

### The idea, step by step

**Step 1 – Fix the sample space.** For one die, `S = {1,2,3,4,5,6}`. Getting this wrong is the most common source of errors, because probabilities only make sense relative to a stated sample space.

**Step 2 – Describe events as subsets.** `A = "even" = {2,4,6}`. `B = "greater than 3" = {4,5,6}`.

**Step 3 – Assign probabilities with the three axioms.** These are the rules everything else is derived from:

```latex
\begin{aligned}
\text{(A1) Non-negativity:} \quad & P(A) \ge 0 \\
\text{(A2) Normalisation:} \quad & P(S) = 1 \\
\text{(A3) Addition:} \quad & A \cap B = \emptyset \Rightarrow P(A \cup B) = P(A) + P(B)
\end{aligned}
```

Everything else — the complement rule, the union rule, conditional probability — follows from these three. For equally likely outcomes, they give the counting rule `P(A) = (number of outcomes in A) / (total outcomes)`.

**Step 4 – Use the two consequences you will use constantly.**

```latex
P(A^c) = 1 - P(A), \qquad P(A \cup B) = P(A) + P(B) - P(A \cap B)
```

The subtraction fixes double-counting: outcomes in both `A` and `B` get counted twice otherwise. Tiny example: `P(even or >3) = 1/2 + 1/2 - 1/3 = 2/3`.

**Step 5 – Conditioning.** **Conditional probability** is probability after new information:

```latex
P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0
```

Read it as: shrink the world down to `B`, then ask what fraction of that smaller world is also in `A`. Tiny example: `P(even | >3) = P({4,6}) / P({4,5,6}) = (1/3)/(1/2) = 2/3`. Check by counting: given `{4,5,6}`, two of the three are even.

**What this means for AI:** a classifier's output `P(y = 1 | x)` is a conditional probability — the probability of the label given the features. Every "prediction" a model makes is conditioned on the input, never absolute. When someone forgets this, they confuse `P(spam | contains "free")` with `P(contains "free" | spam)`, which is the single most damaging mistake in applied ML.

**Example question:** A fair die is rolled. Let `A` be "the result is even" and `B` be "the result is greater than 3". Find `P(A)`, `P(B)`, `P(A ∩ B)`, `P(A ∪ B)` and `P(A | B)`.

**Solution:**

Step 1: write the sample space and the two events. `S = {1,2,3,4,5,6}`, `A = {2,4,6}`, `B = {4,5,6}`.
Step 2: count. Each face has probability `1/6`. `P(A) = 3/6 = 1/2` and `P(B) = 3/6 = 1/2`.
Step 3: the intersection is the outcomes in both. `A ∩ B = {4,6}`, so `P(A ∩ B) = 2/6 = 1/3`.
Step 4: the union, using the addition rule with the double-count removed. `P(A ∪ B) = 1/2 + 1/2 - 1/3 = 2/3`.
Check by listing: `A ∪ B = {2,4,5,6}`, which is `4/6 = 2/3`.

Step 5: condition on `B`, shrinking the world to `{4,5,6}`. `P(A | B) = (1/3)/(1/2) = 2/3`.

**Final answer:** `P(A) = 1/2`, `P(B) = 1/2`, `P(A ∩ B) = 1/3`, `P(A ∪ B) = 2/3`, `P(A | B) = 2/3`.

⚠️ **Common trap:** `P(A | B)` and `P(B | A)` are different numbers. Here `P(A | B) = 2/3` but `P(B | A) = (1/3)/(1/2) = 2/3` too — this example happens to be symmetric, so do not generalise from it. Always ask which event is the *given* one.

---

## 5.2 Independence and the multiplication rule

### Intuition

Two events are **independent** when knowing one tells you nothing about the other. Tossing a coin twice: the second toss does not care about the first. But "it rained yesterday" and "it rains today" are not independent — weather has memory.

In AI terms: independent features carry separate information. Dependent features are partly redundant, which is exactly the multicollinearity problem from Module 1.

### The idea, step by step

**Step 1 – The multiplication rule.** Rearranging the conditional probability definition gives the rule you will use most:

```latex
P(A \cap B) = P(A \mid B)\,P(B) = P(B \mid A)\,P(A)
```

In words: "both happen" = "`B` happens, then `A` happens given `B`". Tiny example: draw two cards without replacement. `P(both aces) = (4/52)(3/51) = 12/2652 ≈ 0.00452`.

**Step 2 – Independence.** `A` and `B` are independent exactly when conditioning changes nothing, `P(A | B) = P(A)`, which collapses the multiplication rule to:

```latex
P(A \cap B) = P(A)\,P(B) \qquad \text{(independence)}
```

Tiny example: `A = "even"`, `C = "1 or 2"` on a die. `P(A) = 1/2`, `P(C) = 1/3`, `P(A ∩ C) = P({2}) = 1/6 = (1/2)(1/3)`. Independent. Compare with `B = ">3"`: `P(A ∩ B) = 1/3 != (1/2)(1/2)`, so `A` and `B` are **not** independent.

**Step 3 – The law of total probability.** Split the world into cases that cannot overlap and cover everything (`B` and `B^c`), then add:

```latex
P(A) = P(A \mid B)\,P(B) + P(A \mid B^c)\,P(B^c)
```

This is how you compute a probability you cannot see directly, by conditioning on something you can. With many cases `B_1, ..., B_k` that partition `S`, the same sum runs over all of them.

**Tiny two-path example:** emails arrive from two servers. 60% come from server 1, of which 2% are spam; 40% come from server 2, of which 5% are spam. `P(spam) = (0.02)(0.6) + (0.05)(0.4) = 0.012 + 0.020 = 0.032`.
So 3.2% of all email is spam. Each term is one path through the tree: "came from server 1 **and** is spam", plus "came from server 2 **and** is spam".

**What this means for AI:** naive Bayes assumes features are independent **given the class** — a strong and usually false assumption that works surprisingly well. The law of total probability is also how we marginalise out a variable we do not care about: sum over all its values.

**Example question:** In a factory, machine 1 makes 70% of the items and machine 2 makes 30%. Machine 1 produces 1% defective items, machine 2 produces 4%. (a) What fraction of all items is defective? (b) Are "made by machine 1" and "defective" independent?

**Solution:**

Step 1: name the events. `M1`, `M2` for the machine; `D` for defective. Given: `P(M1) = 0.7`, `P(M2) = 0.3`, `P(D | M1) = 0.01`, `P(D | M2) = 0.04`.

Step 2: (a) apply the law of total probability — the two machines partition all items. `P(D) = (0.01)(0.7) + (0.04)(0.3)`.
Step 3: compute each path. `P(D) = 0.007 + 0.012 = 0.019`.
So 1.9% of all items are defective.

Step 4: (b) test independence. Compare `P(D | M1)` with `P(D)`. `P(D | M1) = 0.01`, which is not equal to `P(D) = 0.019`.
Step 5: confirm with the product rule. `P(D)P(M1) = (0.019)(0.7) = 0.0133`, but `P(D ∩ M1) = (0.01)(0.7) = 0.007`.
Since `0.007 != 0.0133`, the events are dependent.

**Final answer:** (a) `P(D) = 0.019`, i.e. 1.9% defective. (b) Not independent — knowing an item came from machine 1 lowers its defect probability from 1.9% to 1%, so the machine tells you something.

⚠️ **Common trap:** confusing "independent" with "mutually exclusive". Mutually exclusive means `P(A ∩ B) = 0` — they cannot both happen. Independent means `P(A ∩ B) = P(A)P(B)`. Two events with non-zero probability cannot be both: if `P(A ∩ B) = 0` and they are independent, then `P(A)P(B) = 0`, so one of them has probability zero.

---

## 5.3 Bayes' theorem

### Intuition

You believe something. New evidence arrives. How much should you change your mind? Bayes' theorem is the exact arithmetic of that update, and it is the reason a medical test that is "99% accurate" can still leave you with only a 17% chance of being ill.

The key move: you know how likely the **evidence** is given the **cause** (test positive given disease). You want the reverse (disease given a positive test). Bayes flips the condition.

### The idea, step by step

**Step 1 – Write the two ways to build `P(A ∩ B)`** (from 5.2) and set them equal:

```latex
P(A \mid B)P(B) = P(B \mid A)P(A) \quad\Longrightarrow\quad P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}
```

**Step 2 – Expand the denominator** with the law of total probability, since that is the part you can usually compute:

```latex
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B \mid A)P(A) + P(B \mid A^c)P(A^c)}
```

**Step 3 – Name the four pieces, because exam questions quote them in words.**

| Name | Symbol | Meaning |
| --- | --- | --- |
| Prior | `P(A)` | what you believed before the evidence |
| Likelihood | `P(B \mid A)` | how well the hypothesis explains the evidence |
| Evidence | `P(B)` | how common the evidence is overall |
| Posterior | `P(A \mid B)` | what you believe after the evidence |

**Step 4 – Work a full medical example.** A disease affects 1% of people. A test detects it 99% of the time when present (sensitivity) and wrongly flags 5% of healthy people (false positive rate). You test positive. What is `P(disease | positive)`?

```latex
P(D \mid +) = \frac{(0.99)(0.01)}{(0.99)(0.01) + (0.05)(0.99)} = \frac{0.0099}{0.0099 + 0.0495} = \frac{0.0099}{0.0594} \approx 0.1667
```

Only 16.67%. Why so low? Because healthy people vastly outnumber sick ones, so the 5% false-positive rate applied to the 99% healthy majority produces more false alarms than the 99% sensitivity applied to the 1% sick minority. This is the **base rate** effect, and it is the most examinable idea in the module.

**Step 5 – The naive Bayes classifier.** For an email with words `w_1, ..., w_n`, we want the class `c` (spam or ham) with the highest posterior:

```latex
P(c \mid w_1,\dots,w_n) \propto P(c)\prod_{i=1}^{n} P(w_i \mid c)
```

The "naive" step is assuming the words are independent **given the class**, which turns an impossible joint distribution into a product of word counts. We drop the denominator `P(w_1,...,w_n)` because it is the same for every class, and we only need to compare classes. In practice we work with logs to avoid multiplying tiny numbers into zero.

**What this means for AI:** Bayesian reasoning underlies spam filters, medical decision support, and the "prior" you set when you regularise. In deep learning the same idea appears as a prior over weights (L2 regularisation is a Gaussian prior — see 4.8 and 5.7 together).

**Example question:** 30% of email is spam. The word "free" appears in 60% of spam and in 5% of legitimate email. An email contains "free". What is the probability it is spam?

**Solution:**

Step 1: name the events. `S` = spam, `F` = contains "free". Given: `P(S) = 0.3`, `P(S^c) = 0.7`, `P(F | S) = 0.6`, `P(F | S^c) = 0.05`.

Step 2: write Bayes' theorem with the denominator expanded. `P(S | F) = P(F | S)P(S) / [P(F | S)P(S) + P(F | S^c)P(S^c)]`.
Step 3: compute the numerator — the "spam and contains free" path. `P(F | S)P(S) = (0.6)(0.3) = 0.18`.
Step 4: compute the second path — "ham and contains free". `P(F | S^c)P(S^c) = (0.05)(0.7) = 0.035`.
Step 5: the denominator is the total probability of seeing "free". `P(F) = 0.18 + 0.035 = 0.215`.
Step 6: divide. `P(S | F) = 0.18/0.215 ≈ 0.8372`.
Step 7: sanity-check the direction. The prior was 0.30 and the posterior is 0.84 — seeing "free" raised the belief a lot, which is what a useful word should do.

**Final answer:** `P(spam | "free") ≈ 0.837`, about 84%. Note the denominator is larger than the numerator by exactly the false-alarm mass `0.035`, which is the base-rate correction at work.

⚠️ **Common trap:** forgetting the prior and answering `P(spam | free) = P(free | spam) = 0.6`. The prior `P(S) = 0.3` and the competing path `0.035` are what turn 0.6 into 0.837. Omitting either the prior or the denominator is the classic way to lose all the marks on a Bayes question.

---

## 5.4 Random variables

### Intuition

A **random variable** is a rule that attaches a number to each outcome. Rolling a die gives outcomes `{1,...,6}`; the random variable `X` = "the number shown" just reports that number. Why bother? Because numbers can be added, averaged and plotted, while outcomes like "heads" cannot.

- **Discrete** random variable: takes separated values you can list (`0, 1, 2, ...`). Example: number of spam emails in an hour.
- **Continuous** random variable: takes any value in a range. Example: the time until the next email arrives, or a pixel intensity.

### The idea, step by step

**Step 1 – Discrete: the PMF.** The **probability mass function** gives the probability of each value:

```latex
p(x) = P(X = x), \qquad p(x) \ge 0, \qquad \sum_{x} p(x) = 1
```

The masses are literal lumps of probability sitting on each value, and they must add to 1.

**Step 2 – Continuous: the PDF.** A continuous variable has probability zero of taking any exact value (`P(X = 1.5) = 0`), so we use a **probability density function** where probability is *area*:

```latex
f(x) \ge 0, \qquad \int_{-\infty}^{\infty} f(x)\,dx = 1, \qquad P(a < X < b) = \int_a^b f(x)\,dx
```

Density is not probability. `f(x) = 3` is perfectly legal for a narrow distribution; only the area is capped at 1.

**Step 3 – The CDF, which works for both.** The **cumulative distribution function** is the running total:

```latex
F(x) = P(X \le x) = \sum_{t \le x} p(t) \ \text{(discrete)}, \qquad F(x) = \int_{-\infty}^{x} f(t)\,dt \ \text{(continuous)}
```

`F` always runs from 0 to 1, never decreases, and gives interval probabilities for free: `P(a < X <= b) = F(b) - F(a)`. For a continuous variable, differentiate it back to get the density: `f(x) = F'(x)`.

**Tiny discrete example:** `X` = number of heads in two fair tosses. `p(0) = 1/4`, `p(1) = 1/2`, `p(2) = 1/4`. These sum to 1. The CDF is `F(0) = 0.25`, `F(1) = 0.75`, `F(2) = 1`.

**What this means for AI:** a softmax layer outputs a PMF over classes — non-negative numbers summing to 1. A regression model that predicts a mean and a variance is predicting a conditional PDF. Reading a model's output "as a distribution" rather than "as a number" is what lets you talk about confidence.

**Example question:** A continuous random variable has density `f(x) = 2x` for `0 <= x <= 1` and `0` elsewhere. (a) Verify it is a valid PDF. (b) Find the CDF. (c) Find `P(0.5 < X < 0.8)`.

**Solution:**

Step 1: (a) check non-negativity. For `0 <= x <= 1`, `2x >= 0`.

Step 2: (a) check the total area is 1. `integral from 0 to 1 of 2x dx = 1 - 0 = 1`, which checks out.
Step 3: (b) integrate from the left up to `x`. `F(x) = integral from 0 to x of 2t dt = x^2` on `[0, 1]`.
So `F(x) = 0` for `x < 0`, `x^2` on `[0,1]`, and `1` for `x > 1`.

Step 4: (c) use `F` for the interval. `P(0.5 < X < 0.8) = F(0.8) - F(0.5) = 0.64 - 0.25 = 0.39`.
Step 5: verify by direct integration (reason: two routes must agree). `integral from 0.5 to 0.8 of 2x dx = 0.64 - 0.25 = 0.39`, which agrees.

**Final answer:** (a) valid, since `2x >= 0` and the total area is 1. (b) `F(x) = x^2` on `[0,1]`. (c) `P(0.5 < X < 0.8) = 0.39`.

⚠️ **Common trap:** treating `f(x)` as a probability. For the density above, `f(1) = 2`, which is not a probability at all. Only areas under `f` are probabilities, and `P(X = 0.7) = 0` exactly, even though the density there is 1.4.

---

## 5.5 Expectation, variance and standard deviation

### Intuition

A distribution is a shape. Two numbers summarise that shape well enough for most purposes: the **centre** (where is it?) and the **spread** (how wide is it?).

- **Expectation `E(X)`** – the long-run average, i.e. the balance point of the distribution.
- **Variance `Var(X)`** – the average squared distance from that centre.
- **Standard deviation `SD(X)`** – the square root of the variance, back in the original units.

In AI these are the model summaries: a predicted mean with no spread is a guess; a mean with a variance is a calibrated statement.

### The idea, step by step

**Step 1 – Expectation is a weighted average.** Weight each value by its probability:

```latex
E(X) = \sum_{x} x\,p(x) \ \text{(discrete)}, \qquad E(X) = \int_{-\infty}^{\infty} x\,f(x)\,dx \ \text{(continuous)}
```

`E` is linear, which is worth memorising: `E(aX + b) = aE(X) + b` and `E(X + Y) = E(X) + E(Y)` — the second holds even when `X` and `Y` are dependent.

**Step 2 – Variance is the average squared deviation.**

```latex
\operatorname{Var}(X) = E\big[(X - \mu)^2\big] = \sum_{x} (x - \mu)^2 p(x), \qquad \mu = E(X)
```

Squaring makes deviations positive and punishes large ones more. It also means variance is in **squared** units — rupees squared, not rupees — which is why we take the square root.

**Step 3 – The shortcut formula, which is faster by hand.** Expand the square and use linearity:

```latex
\operatorname{Var}(X) = E(X^2) - \big(E(X)\big)^2
```

Derivation in one line: `E[(X-μ)^2] = E[X^2 - 2μX + μ^2] = E(X^2) - 2μ·μ + μ^2 = E(X^2) - μ^2`. And `SD(X) = sqrt(Var(X))`. Also `Var(aX + b) = a^2 Var(X)` — shifting does not change spread, scaling does, squared.

**Step 4 – A full computation.** Let `X` be the number of support tickets a model-flagged customer raises: values `0, 1, 2, 3` with probabilities `0.1, 0.3, 0.4, 0.2`. `E(X) = 0(0.1) + 1(0.3) + 2(0.4) + 3(0.2) = 1.7`. `E(X^2) = 0(0.1) + 1(0.3) + 4(0.4) + 9(0.2) = 3.7`. `Var(X) = 3.7 - 2.89 = 0.81` and `SD(X) = sqrt(0.81) = 0.9`.
Check the probabilities first: `0.1 + 0.3 + 0.4 + 0.2 = 1.0`. The mean is 1.7 tickets and a typical deviation from it is 0.9 tickets.

**What this means for AI:** `E(X)` is what a regression model predicts; `Var(X)` is what an uncertainty-aware model also predicts. Mean squared error is literally an estimate of `E[(Y - y_hat)^2]` — the variance of the residual — which is why minimising MSE (Module 4) and estimating variance (here) are the same act.

**Example question:** `X` takes values `0, 1, 2, 3` with probabilities `0.1, 0.3, 0.4, 0.2`. Find `E(X)`, `E(X^2)`, `Var(X)` and `SD(X)`, then find `E(2X + 5)` and `Var(2X + 5)`.

**Solution:**

Step 1: check the distribution is valid: `0.1 + 0.3 + 0.4 + 0.2 = 1`.

Step 2: `E(X)` by weighting each value. `E(X) = 0(0.1) + 1(0.3) + 2(0.4) + 3(0.2) = 1.7`.
Step 3: `E(X^2)` — square the value first, then weight. `E(X^2) = 0(0.1) + 1(0.3) + 4(0.4) + 9(0.2) = 3.7`.
Step 4: the shortcut formula. `Var(X) = 3.7 - 2.89 = 0.81`.
Step 5: standard deviation. `SD(X) = sqrt(0.81) = 0.9`.
Step 6: apply the linearity rules. `E(2X+5) = 2(1.7) + 5 = 8.4` and `Var(2X+5) = 4(0.81) = 3.24`.
Note the `+5` shifts the mean but leaves the variance alone — spreading is unaffected by sliding the whole distribution sideways.

**Final answer:** `E(X) = 1.7`, `E(X^2) = 3.7`, `Var(X) = 0.81`, `SD(X) = 0.9`, `E(2X+5) = 8.4`, `Var(2X+5) = 3.24`.

⚠️ **Common trap:** computing `E(X^2)` as `(E(X))^2`. They are different: here `3.7` versus `2.89`. The gap between them **is** the variance, so mixing them up silently produces a variance of zero. Second trap: forgetting to square the constant in `Var(aX + b) = a^2 Var(X)`.

---

## 5.6 Key distributions

### Intuition

Most randomness you meet in practice has one of five shapes. Knowing the shape means you know the formula, the mean and the variance without deriving anything.

| Distribution | Story | Values | Mean | Variance |
| --- | --- | --- | --- | --- |
| Bernoulli(`p`) | one yes/no trial | `0` or `1` | `p` | `p(1-p)` |
| Binomial(`n, p`) | count of successes in `n` trials | `0..n` | `np` | `np(1-p)` |
| Uniform(`a, b`) | every value equally likely | `[a, b]` | `(a+b)/2` | `(b-a)^2/12` |
| Gaussian(`μ, σ^2`) | bell curve, sums of small effects | all reals | `μ` | `σ^2` |
| Poisson(`λ`) | count of rare events per unit time | `0, 1, 2, ...` | `λ` | `λ` |

### The idea, step by step

**Step 1 – Bernoulli: the single coin.** One trial, success with probability `p`:

```latex
P(X = 1) = p, \qquad P(X = 0) = 1 - p, \qquad E(X) = p, \qquad \operatorname{Var}(X) = p(1-p)
```

This is exactly the output of a binary classifier, and `p(1-p)` is largest at `p = 0.5` — a model that is unsure is the most variable one.

**Step 2 – Binomial: `n` independent Bernoullis added.** The count of successes:

```latex
P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}, \qquad E(X) = np, \qquad \operatorname{Var}(X) = np(1-p)
```

The binomial coefficient `C(n,k) = n!/(k!(n-k)!)` counts the orders in which the `k` successes could occur.

**Step 3 – Uniform: no preference.** On `[a, b]`, the density is a flat rectangle of height `1/(b-a)`, so probability is just length over total length. Mean is the midpoint; variance is `(b-a)^2/12`. Used for random initialisation of weights and for random train/test splits.

**Step 4 – Gaussian: the bell.** Parameters `μ` (centre) and `σ` (width). It gets its own section (5.7).

**Step 5 – Poisson: rare events in time.** For counts where the average rate is `λ` and events are independent:

```latex
P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}, \qquad E(X) = \operatorname{Var}(X) = \lambda
```

Mean equals variance — that is the signature of a Poisson. Used for request counts, defect counts, and event arrivals. (Awareness level only for this course.)

**Step 6 – Where AI meets each one.** Bernoulli: one binary label. Binomial: how many of 100 test images are misclassified. Uniform: weight init, dropout masks, random sampling. Gaussian: weight initialisation, noise injection, latent variables, and the assumed noise in regression. Poisson: counts in logs, clicks, or arrivals.

**What this means for AI:** choosing a distribution is choosing a loss. Assume Gaussian noise and maximum likelihood gives squared error. Assume Bernoulli labels and it gives cross-entropy. The distribution is not decoration — it decides what your training loop minimises.

**Example question:** A model is tested on 10 independent images and each has probability `0.2` of being misclassified. Let `X` be the number of misclassifications. Find `P(X = 2)`, `E(X)` and `Var(X)`.

**Solution:**

Step 1: identify the distribution. 10 independent trials, constant success probability `0.2`, counting successes, so `X ~ Binomial(10, 0.2)`.

Step 2: write the formula with the numbers. `P(X = 2) = C(10,2) (0.2)^2 (0.8)^8`.
Step 3: evaluate each factor. `C(10,2) = 45`, `(0.2)^2 = 0.04`, `(0.8)^8 = 0.16777216`.
Step 4: multiply. `P(X = 2) = 45 x 0.04 x 0.16777216 = 45 x 0.0067108864 ≈ 0.3020`.
Step 5: mean and variance from the `np` formulas. `E(X) = np = 2` and `Var(X) = np(1-p) = 10(0.2)(0.8) = 1.6`.

**Final answer:** `P(X = 2) ≈ 0.302`, `E(X) = 2`, `Var(X) = 1.6`. About 30% of the time you will see exactly 2 errors, and the typical count is 2 with spread `sqrt(1.6) ≈ 1.26`.

⚠️ **Common trap:** using Binomial when the trials are **not** independent or `p` is **not** constant — for example sampling images without replacement from a fixed test set. Then the correct model is hypergeometric, and the binomial answer is only an approximation. Also do not forget the `C(n,k)` factor: `p^k(1-p)^(n-k)` alone is the probability of one specific ordering.

---

## 5.7 The Gaussian in depth

### Intuition

Plot a histogram of almost anything real — heights, measurement errors, pixel noise, the sum of many small random effects — and you get a bell. That is not a coincidence; it is the Central Limit Theorem (5.9) at work. The Gaussian is the shape that appears when many small independent influences add up.

Two knobs describe it completely:

- `μ` (mu) — the **mean**, where the peak sits. Moving it slides the bell left or right.
- `σ` (sigma) — the **standard deviation**, how wide the bell is. A bigger `σ` means a flatter, wider bell. `σ^2` is the variance.

### The idea, step by step

**Step 1 – The density.** Written `X ~ N(μ, σ^2)`:

```latex
f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}}
```

The exponent says the density falls off with the **squared** distance from `μ`, which is why the tails are thin and the shoulders are fat. The constant in front is there only to make the total area 1 — you are never asked to integrate it by hand.

**Step 2 – The 68-95-99.7 rule.** For any Gaussian:

```latex
P(\mu - \sigma < X < \mu + \sigma) \approx 0.6827, \quad P(\mu - 2\sigma < X < \mu + 2\sigma) \approx 0.9545, \quad P(\mu - 3\sigma < X < \mu + 3\sigma) \approx 0.9973
```

This is the fastest sanity check in all of statistics. If a "Gaussian" has 20% of its mass beyond `3σ`, it is not a Gaussian.

**Step 3 – Standardisation.** Different Gaussians are all the same bell in different units. Subtract the mean and divide by the standard deviation to convert to the **standard normal** `Z ~ N(0, 1)`:

```latex
z = \frac{x - \mu}{\sigma}, \qquad P(X \le x) = \Phi(z)
```

`Φ` (phi, capital) is the standard normal CDF, read from a table or computed. `z` answers "how many standard deviations above the mean is this value?" — a **z-score**.

**Step 4 – Worked standardisation.** Adult heights are `N(170, 8^2)` in cm. Find `P(X < 182)` and `P(162 < X < 178)`. `z = (182 - 170)/8 = 12/8 = 1.5`, so `P(X < 182) = Φ(1.5) ≈ 0.9332`.
```latex
z_{low} = \frac{162-170}{8} = -1, \quad z_{high} = \frac{178-170}{8} = 1 \;\Rightarrow\; \Phi(1) - \Phi(-1) \approx 0.6827
```

So 93.3% are shorter than 182 cm, and 68.3% lie within one standard deviation — which is the 68-95-99.7 rule confirming itself.

**Step 5 – Why it dominates ML.** Four reasons: (a) the CLT makes it the natural model for aggregated noise; (b) it is fully described by two numbers, so it is cheap; (c) it is closed under addition — a sum of independent Gaussians is Gaussian; (d) it makes the maths tractable, so squared error, L2 regularisation and the whole least-squares story of Module 4 fall out of assuming Gaussian noise.

**What this means for AI:** `StandardScaler` in every ML pipeline is step 3 above. Weight initialisation draws from a Gaussian. Variational autoencoders assume a Gaussian latent space. And when you see `N(0, 1)` in a paper, it is the standardised version of whatever the real units were.

**Example question:** A feature has mean `170` and standard deviation `8`. Standardise `x = 186` and `x = 158`, and state what the z-scores mean. Then find the interval containing about 95% of values.

**Solution:**

Step 1: apply `z = (x - μ)/σ` to the first value. `z = (186 - 170)/8 = 16/8 = 2`.
Step 2: apply it to the second. `z = (158 - 170)/8 = -12/8 = -1.5`.
Step 3: interpret. `z = 2` means 186 is 2 standard deviations **above** the mean; `z = -1.5` means 158 is 1.5 standard deviations **below**. The z-score is unit-free, so it lets you compare a height in cm with a weight in kg.

Step 4: the 95% interval is `μ +/- 2σ` (the rule gives 95.45%, close enough for the usual approximation). `170 +/- 2(8) = 170 +/- 16 = [154, 186]`.
Step 5: check with z-scores: the interval `[154, 186]` corresponds to `z` from `-2` to `2`, and `Φ(2) - Φ(-2) ≈ 0.9545`.

**Final answer:** `z = 2` for `x = 186` and `z = -1.5` for `x = 158`; about 95% of values lie in `[154, 186]`.

⚠️ **Common trap:** dividing by the **variance** instead of the standard deviation. The formula is `(x - μ)/σ`, not `(x - μ)/σ^2`. Second trap: using `μ +/- 2σ` and claiming exactly 95% — the true value is 95.45%, so write "about 95%" or use `1.96σ` for the precise 95% figure.

---

## 5.8 Joint, marginal and conditional distributions

### Intuition

One variable is a story; two variables is a relationship. A **joint distribution** tells you how `X` and `Y` vary **together**. From it you can read off three things:

- **Marginal** – forget `Y`, what does `X` do on its own? (Sum over `Y`.)
- **Conditional** – given `Y = 1`, what does `X` do? (Slice the table, renormalise.)
- **Covariance / correlation** – do they move together, and how strongly?

### The idea, step by step

**Step 1 – The joint.** For discrete variables, a table of `p(x, y) = P(X = x, Y = y)` where everything sums to 1.

**Step 2 – Marginalise by summing out.** Add across the row or down the column:

```latex
p_X(x) = \sum_{y} p(x, y), \qquad p_Y(y) = \sum_{x} p(x, y)
```

**Step 3 – Condition by slicing and renormalising.**

```latex
p(y \mid x) = \frac{p(x, y)}{p_X(x)}
```

The slice `p(x, y)` for fixed `x` does not sum to 1, so we divide by `p_X(x)` to make it a proper distribution again.

**Step 4 – A full worked table.** Let `X` = number of product pages a visitor views (`0, 1, 2`) and `Y` = whether they buy (`0` = no, `1` = yes).

| `p(x, y)` | `Y = 0` | `Y = 1` | marginal `p_X(x)` |
| --- | --- | --- | --- |
| `X = 0` | 0.30 | 0.05 | 0.35 |
| `X = 1` | 0.25 | 0.15 | 0.40 |
| `X = 2` | 0.10 | 0.15 | 0.25 |
| marginal `p_Y(y)` | 0.65 | 0.35 | 1.00 |

Everything checks: rows sum to `0.35, 0.40, 0.25`, columns to `0.65, 0.35`, and the grand total is `1.00`.

Now the conditionals, slicing on `X` and dividing by its marginal:

```latex
P(Y=1 \mid X=0) = \frac{0.05}{0.35} = \frac17 \approx 0.143, \quad P(Y=1 \mid X=1) = \frac{0.15}{0.40} = 0.375, \quad P(Y=1 \mid X=2) = \frac{0.15}{0.25} = 0.60
```

So browsing more pages really does raise the purchase rate: 14%, then 38%, then 60%.

**Step 5 – Covariance measures joint movement.**

```latex
\operatorname{Cov}(X,Y) = E(XY) - E(X)E(Y), \qquad E(XY) = \sum_x\sum_y xy\,p(x,y)
```

Positive covariance: above-average `X` tends to come with above-average `Y`. The problem is units, so we divide by both standard deviations:

```latex
\rho = \operatorname{Corr}(X,Y) = \frac{\operatorname{Cov}(X,Y)}{\sigma_X \sigma_Y}, \qquad -1 \le \rho \le 1
```

`ρ` (rho) is unit-free. `ρ = 0` means **uncorrelated** — and note that uncorrelated is weaker than independent: it rules out linear relationships only.

**Step 6 – Compute both for the table.** `E(X) = 0(0.35) + 1(0.40) + 2(0.25) = 0.9`; `E(X^2) = 0 + 0.40 + 1.00 = 1.40`, so `Var(X) = 1.40 - 0.81 = 0.59`. For `Y`: `E(Y) = 0.35`, `E(Y^2) = 0.35`, so `Var(Y) = 0.35 - 0.1225 = 0.2275`. And `E(XY) = 1·1·0.15 + 2·1·0.15 = 0.45`, giving `Cov = 0.45 - (0.9)(0.35) = 0.135` and `ρ = 0.135 / sqrt(0.59 x 0.2275) = 0.135/0.3664 ≈ 0.368`.

**What this means for AI:** marginalising is what you do when you ignore a nuisance variable. Conditioning is what a classifier does. And the covariance matrix is exactly what PCA diagonalises in Module 2 — its eigenvectors are the principal directions, and its off-diagonal entries are the redundancies you want to remove.

**Example question:** Using the table above, find `p_X(1)`, `P(Y = 1)`, `P(X = 2 | Y = 1)`, and `E(XY)`.

**Solution:**

Step 1: `p_X(1)` is the row sum for `X = 1`. `p_X(1) = 0.25 + 0.15 = 0.40`.
Step 2: `P(Y = 1)` is the column sum for `Y = 1`. `P(Y = 1) = 0.05 + 0.15 + 0.15 = 0.35`.
Step 3: condition the other way this time — slice the column `Y = 1` and renormalise by `P(Y = 1)`. `P(X = 2 | Y = 1) = 0.15/0.35 = 3/7 ≈ 0.4286`.
Step 4: `E(XY)` sums `xy · p(x,y)` over all six cells. Only the cells with both `x` and `y` non-zero survive. `E(XY) = (1)(1)(0.15) + (2)(1)(0.15) = 0.15 + 0.30 = 0.45`.
Step 5: sanity-check the order of the conditionals. `P(Y=1 | X=2) = 0.60` but `P(X=2 | Y=1) = 0.4286` — different numbers from the same cell, because the denominators differ.

**Final answer:** `p_X(1) = 0.40`, `P(Y = 1) = 0.35`, `P(X = 2 | Y = 1) = 3/7 ≈ 0.429`, `E(XY) = 0.45`.

⚠️ **Common trap:** reading a conditional straight off the joint table. `p(2,1) = 0.15` is neither `P(X=2 | Y=1)` nor `P(Y=1 | X=2)` — you must divide by the right marginal. Second trap: reporting `ρ = 0` as proof of independence. It only rules out a *linear* relationship.

---

## 5.9 The Law of Large Numbers and the Central Limit Theorem

### Intuition

Two promises about averages, and they are why sampling works at all.

- **Law of Large Numbers (LLN):** as the sample grows, the sample average gets **closer to the true mean**. More data, less luck involved.
- **Central Limit Theorem (CLT):** the sample average is **approximately Gaussian**, whatever the underlying distribution was — provided `n` is reasonably large.

The first says the average converges. The second says *how* it fluctuates on the way there.

### The idea, step by step

**Step 1 – The LLN, formally.** For independent samples with mean `μ`:

```latex
\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i \;\xrightarrow{\;n \to \infty\;}\; \mu
```

Practical meaning: a model evaluated on 10,000 test images gives a far more trustworthy accuracy than one evaluated on 100. The estimate is not just better — it is *reliably* better.

**Step 2 – The CLT, formally.** For independent samples with mean `μ` and variance `σ^2`:

```latex
\bar{X}_n \approx N\!\left(\mu,\ \frac{\sigma^2}{n}\right) \quad \text{for large } n
```

The spread shrinks like `1/sqrt(n)`, so the **standard error** is:

```latex
SE = \frac{\sigma}{\sqrt{n}}
```

**Step 3 – Why the `sqrt(n)` matters commercially.** To halve the error you need **four times** the data. To get 10 times more precise, 100 times the data. This is the single most useful planning fact in experimentation.

**Step 4 – Numbers.** Suppose test accuracy has `σ = 8` percentage points (very noisy) and you evaluate on `n = 100` images. `SE = 8/sqrt(100) = 0.8` points.
So the measured accuracy is typically within about `0.8` of the truth, and 95% of the time within `1.96 x 0.8 = 1.568` points. With `n = 400`, `SE` halves to `0.4`.

**Step 5 – Why it is not a law about the data's shape.** The CLT is about the distribution of the **average**, not of the raw data. Roll a die (uniform, flat) and average 30 rolls: the average is already nearly bell-shaped. The raw data never becomes Gaussian; the average does.

**What this means for AI:** every reported metric is a sample average, so it has a standard error — a leaderboard difference of 0.3% on 500 examples is usually noise. The CLT is also why mini-batch gradient estimates (4.5) are well behaved: a batch average of per-example gradients is approximately Gaussian around the true gradient, which is exactly what makes SGD's noise analysable.

**Example question:** A model's per-image error has mean `0` and standard deviation `8`. You evaluate on `n = 100` images. What is the standard error of the average error, and what interval contains the average 95% of the time?

**Solution:**

Step 1: identify the quantity — the average of 100 independent errors, so the CLT applies. `X_bar_100 ≈ N(0, 8^2/100)`.
Step 2: compute the standard error. `SE = σ/sqrt(n) = 8/10 = 0.8`.
Step 3: build the 95% interval with the normal multiplier `1.96`. `0 +/- 1.96(0.8) = 0 +/- 1.568`, i.e. `[-1.568, 1.568]`.
Step 4: interpret, and note the consequence. The measured average is within about `+/-1.57` of the true mean with 95% confidence. To get `+/-0.8`, you would need `n = 400`, since `SE` scales as `1/sqrt(n)`.

**Final answer:** `SE = 0.8`, and the 95% interval for the average error is about `[-1.57, 1.57]`. Quadrupling the sample size halves the error.

⚠️ **Common trap:** applying the CLT to the raw data instead of the average. The raw errors are not Gaussian; the *mean of 100* of them is approximately so. Second trap: quoting a metric difference without its standard error — with `SE = 0.8`, a 1-point gap between two models is well inside the noise.

---

## 5.10 AI/ML meaning throughout

| Probability idea | What it is in AI |
| --- | --- |
| Conditional probability | `P(y \| x)` — every prediction is conditioned on the input |
| Independence | The naive Bayes assumption; redundant features |
| Law of total probability | Marginalising out nuisance variables |
| Bayes' theorem | Updating beliefs, spam filters, calibration, priors |
| Random variable | A feature, a label, a model output treated as uncertain |
| PMF / softmax output | Class probabilities from a classifier |
| PDF / density | Continuous outputs: prices, times, pixel values |
| Expectation | The predicted value; the loss averaged over data |
| Variance / SD | Uncertainty, error bars, confidence of a prediction |
| Bernoulli / Binomial | Binary labels, accuracy over `n` test items |
| Gaussian | Noise model, weight init, latent space, `N(0,1)` priors |
| Standardisation (z-score) | `StandardScaler` — required before most models |
| Covariance / correlation | Feature redundancy; the matrix PCA diagonalises |
| LLN | Why bigger test sets give better estimates |
| CLT / standard error | Why leaderboard gaps need error bars |

**Example question:** A classifier outputs `[0.7, 0.2, 0.1]` for three classes. A second model outputs `[0.4, 0.35, 0.25]`. Which is more confident, and how would you report each prediction as a probability statement?

**Solution:**

Step 1: check both are valid PMFs — non-negative and summing to 1.

Step 2: for the first model, `0.7 + 0.2 + 0.1 = 1`, and for the second `0.4 + 0.35 + 0.25 = 1`.

Step 3: measure confidence. The first model puts `0.7` on class 1; the second puts only `0.4` there, with `0.35` almost as likely. So the first is far more decisive.

Step 4: quantify the difference with the Bernoulli variance `p(1-p)` from 5.6, applied to the top class.

Step 5: first model, `0.7 x 0.3 = 0.21`; second model, `0.4 x 0.6 = 0.24`. The second has the higher variance, i.e. the more uncertain prediction.

**Final answer:** the first model is more confident (`0.7` versus `0.4` on the top class, and lower variance `0.21 < 0.24`). Report it as `P(class 1 | x) = 0.7` — a conditional probability, not a certainty. The second model's `0.4` versus `0.35` is close enough that a 0.5 threshold decision is fragile.

**Why this module matters:** classification is not "output a label" but "output a distribution over labels"; training is not "fit a curve" but "maximise likelihood" or equivalently "minimise cross-entropy"; and evaluation is not "one number" but "an estimate with a standard error". The boundary to formal statistics and inference — hypothesis tests, confidence intervals as a discipline, estimators — is the separate course *Mathematics for Data Science (T03)*; here we stop at the probabilistic machinery that AI actually uses.

---

## Formula / rule summary table

| Rule | Formula | When to use |
| --- | --- | --- |
| Complement | `P(A^c) = 1 - P(A)` | "at least one" questions, easiest route |
| Union | `P(A ∪ B) = P(A) + P(B) - P(A ∩ B)` | "or" questions |
| Conditional | `P(A \| B) = P(A ∩ B)/P(B)` | the word *given* appears |
| Multiplication | `P(A ∩ B) = P(A \| B)P(B)` | "both", sequential draws |
| Independence test | `P(A ∩ B) = P(A)P(B)` | checking whether events are unrelated |
| Total probability | `P(A) = Σ P(A \| B_i)P(B_i)` | cases that partition the world |
| Bayes | `P(A \| B) = P(B \| A)P(A)/P(B)` | evidence to cause, reversing a condition |
| Expectation | `E(X) = Σ x p(x)`, or the integral of `x f(x) dx` | the long-run average |
| Variance shortcut | `Var(X) = E(X^2) - (E(X))^2` | fastest by hand |
| Standard deviation | `SD = sqrt(Var)` | back to original units |
| Binomial | `C(n,k) p^k (1-p)^(n-k)` | `n` independent yes/no trials |
| Poisson | `λ^k e^(-λ) / k!` | rare counts per unit time |
| z-score | `z = (x - μ)/σ` | standardising, comparing across units |
| Covariance | `Cov = E(XY) - E(X)E(Y)` | do two variables move together |
| Correlation | `ρ = Cov/(σ_X σ_Y)` | unit-free strength, in `[-1, 1]` |
| Standard error | `SE = σ/sqrt(n)` | error bars on an average |

### Which formula when? (mini-guide)

- Words *and / both / then* -> multiplication rule `P(A ∩ B) = P(A | B)P(B)`.
- Words *or / either* -> addition rule, subtract the overlap.
- Words *given / if / among those* -> conditional probability.
- Asked "are these independent?" -> check `P(A ∩ B) = P(A)P(B)`, or compare `P(A | B)` with `P(A)`.
- Data arrives via several sources or cases -> law of total probability.
- You know `P(evidence | cause)` but want `P(cause | evidence)` -> Bayes.
- "Exactly `k` successes in `n` tries" -> Binomial (with `C(n,k)`).
- "How many arrived in an hour" with a known rate -> Poisson.
- "How many standard deviations from the mean" -> z-score.
- "Do `X` and `Y` move together" -> covariance; "how strongly" -> correlation.
- "How precise is this average" -> standard error `σ/sqrt(n)`.

---

## Solved examples

### Example 1 (easy): conditional probability and independence

**Question:** A card is drawn from a standard 52-card deck. Let `A` = "it is a heart" and `B` = "it is a face card" (J, Q, K). Find `P(A)`, `P(B)`, `P(A ∩ B)`, `P(A | B)`, and decide whether `A` and `B` are independent.

**Solution:**

Step 1: count the outcomes. 13 hearts, 12 face cards (3 per suit x 4 suits), and 3 heart face cards. `P(A) = 13/52 = 1/4` and `P(B) = 12/52 = 3/13`.
Step 2: the intersection — heart **and** face card. `P(A ∩ B) = 3/52`.
Step 3: condition on `B`. `P(A | B) = (3/52)/(12/52) = 3/12 = 1/4`.
Step 4: test independence by comparing with the product. `P(A)P(B) = (1/4)(3/13) = 3/52 = P(A ∩ B)`, so they are independent.
Step 5: read the result. `P(A | B) = 1/4 = P(A)`, so knowing the card is a face card tells you nothing about its suit.

**Final answer:** `P(A) = 1/4`, `P(B) = 3/13`, `P(A ∩ B) = 3/52`, `P(A | B) = 1/4`, and the events **are independent** — suit and face-ness are unrelated in a standard deck.

### Example 2 (medium): a two-feature naive Bayes decision

**Question:** A spam filter uses one word. 40% of mail is spam. The word "offer" appears in 50% of spam and 10% of ham. An email contains "offer". Using Bayes, is it classified as spam at a 0.5 threshold?

**Solution:**

Step 1: set out the givens. `P(S) = 0.4`, `P(S^c) = 0.6`, `P(O | S) = 0.5`, `P(O | S^c) = 0.1`.

Step 2: numerator (spam path). `P(O | S)P(S) = (0.5)(0.4) = 0.20`.
Step 3: the ham path. `P(O | S^c)P(S^c) = (0.1)(0.6) = 0.06`.
Step 4: total evidence. `P(O) = 0.20 + 0.06 = 0.26`.
Step 5: divide. `P(S | O) = 0.20/0.26 ≈ 0.7692`.
Step 6: compare with the threshold. `0.7692 > 0.5`, so it is classified spam. Note the prior alone was `0.4`, below the threshold — the word is what flipped the decision, which is exactly how naive Bayes behaves.

**Final answer:** `P(spam | "offer") ≈ 0.769`, above the 0.5 threshold, so the email is classified as **spam**.

### Example 3 (exam level): joint table to correlation

**Question:** Using the visitor table of 5.8, compute `E(X)`, `Var(X)`, `Cov(X, Y)` and `Corr(X, Y)`, and interpret.

**Solution:**

Step 1: the marginals, from the row and column sums: `p_X = (0.35, 0.40, 0.25)` and `p_Y = (0.65, 0.35)`.

Step 2: `E(X)` and `E(X^2)`. `E(X) = 0(0.35) + 1(0.40) + 2(0.25) = 0.90` and `E(X^2) = 0 + 0.40 + 1.00 = 1.40`.
Step 3: `Var(X)` by the shortcut. `Var(X) = 1.40 - 0.81 = 0.59`.
Step 4: the same for `Y`. Since `Y` is 0/1, `E(Y^2) = E(Y)`. `E(Y) = 0.35`, `E(Y^2) = 0.35`, `Var(Y) = 0.35 - 0.1225 = 0.2275`.
Step 5: `E(XY)` from the cells where both are non-zero. `E(XY) = 0.15 + 0.30 = 0.45`.
Step 6: covariance. `Cov(X,Y) = 0.45 - 0.315 = 0.135`.
Step 7: correlation, dividing by both standard deviations. `σ_X = sqrt(0.59) ≈ 0.768` and `σ_Y = sqrt(0.2275) ≈ 0.477`. `ρ = 0.135/(0.768 x 0.477) = 0.135/0.3664 ≈ 0.368`.

**Final answer:** `E(X) = 0.9`, `Var(X) = 0.59`, `Cov(X,Y) = 0.135`, `ρ ≈ 0.368`. The positive covariance says visitors who view more pages buy more often, and `ρ ≈ 0.37` says the relationship is moderate, not tight — plenty of page-viewers still leave without buying.

---

## Common traps and mistakes

- **`P(A | B)` versus `P(B | A)`.** Reversing the condition is the classic Bayes error and gives wildly wrong answers when base rates are extreme.
- **Ignoring the base rate.** A 99%-accurate test on a 1%-prevalence disease gives a 17% posterior, not 99%.
- **Confusing independent with mutually exclusive.** Exclusive means `P(A ∩ B) = 0`; independent means `P(A ∩ B) = P(A)P(B)`. Non-zero-probability events cannot be both.
- **Treating a density as a probability.** `f(x)` can exceed 1; only the area under it is a probability, and `P(X = x) = 0` for continuous `X`.
- **Computing `E(X^2)` as `(E(X))^2`.** The difference between them *is* the variance; mixing them up gives zero spread.
- **Forgetting to square the constant** in `Var(aX + b) = a^2 Var(X)`.
- **Dropping the `C(n,k)` factor** in the binomial — that is the probability of one ordering, not of `k` successes in any order.
- **Reading a conditional off a joint table without dividing** by the correct marginal.
- **Reporting `ρ = 0` as independence.** It only rules out a linear relationship.
- **Quoting a metric difference with no standard error.** With `SE = 0.8`, a 1-point gap is noise.

---

## Quick revision box

- ✅ Axioms: `P(A) >= 0`, `P(S) = 1`, disjoint events add. Then `P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`, `P(A^c) = 1 - P(A)`, and `P(A | B) = P(A ∩ B)/P(B)`.
- ✅ Independent means `P(A ∩ B) = P(A)P(B)`; in general `P(A ∩ B) = P(A | B)P(B)`, and total probability gives `P(A) = Σ P(A | B_i)P(B_i)` over cases that partition the sample space.
- ✅ Bayes: posterior ∝ likelihood x prior. Always compute the denominator as the sum of all paths.
- ✅ PMF sums to 1, PDF integrates to 1, CDF runs 0 to 1 and gives `P(a < X <= b) = F(b) - F(a)`. Density is not probability.
- ✅ `E(X) = Σ x p(x)`, `Var(X) = E(X^2) - (E(X))^2`, `SD = sqrt(Var)`.
- ✅ Bernoulli `p`, `p(1-p)`; Binomial `np`, `np(1-p)`; Poisson `λ`, `λ`; Gaussian `μ`, `σ^2`; Uniform `(a+b)/2`, `(b-a)^2/12`.
- ✅ Gaussian: 68-95-99.7 within 1, 2, 3 sigma; standardise with `z = (x - μ)/σ`.
- ✅ `Cov = E(XY) - E(X)E(Y)`, `ρ = Cov/(σ_X σ_Y)` in `[-1,1]`; `SE = σ/sqrt(n)` shrinks like `1/sqrt(n)`.

---

## Practice questions

1. Two fair dice are rolled. Find `P(sum = 7)` and `P(sum = 7 | first die shows 3)`.
2. `P(A) = 0.4`, `P(B) = 0.5`, `P(A ∩ B) = 0.2`. Find `P(A ∪ B)`, `P(A | B)`, and decide whether `A` and `B` are independent.
3. A disease affects 2% of a population. A test has sensitivity 90% and specificity 95%. Given a positive test, what is `P(disease)`?
4. `X` takes values `1, 2, 3` with probabilities `0.2, 0.5, 0.3`. Find `E(X)`, `Var(X)` and `SD(X)`.
5. `X ~ Binomial(5, 0.3)`. Find `P(X = 2)`, `E(X)` and `Var(X)`.
6. A feature is `N(60, 5^2)`. Find the z-score of 70 and `P(X > 70)`.

## Answers

**1.** 36 equally likely outcomes. Sum 7 happens as `(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)` = 6 ways, so `P = 6/36 = 1/6`. Given the first die is 3, only `(3,4)` works out of 6 equally likely second-die values, so `P(sum = 7 | first = 3) = 1/6` — the same, because the dice are independent.

**2.** `P(A ∪ B) = 0.4 + 0.5 - 0.2 = 0.7`. `P(A | B) = 0.2/0.5 = 0.4`, which equals `P(A)`. And `P(A)P(B) = 0.2 = P(A ∩ B)`. So the events **are independent**.

**3.** Numerator `(0.9)(0.02) = 0.018`. Other path `(0.05)(0.98) = 0.049`. Denominator `0.018 + 0.049 = 0.067`. So `P(D | +) = 0.018/0.067 ≈ 0.269`, about **27%** — the base rate keeps it low despite a good test.

**4.** `E(X) = 0.2 + 1.0 + 0.9 = 2.1`. `E(X^2) = 0.2 + 2.0 + 2.7 = 4.9`. `Var(X) = 4.9 - 4.41 = 0.49`. `SD(X) = 0.7`.

**5.** `P(X = 2) = C(5,2)(0.3)^2(0.7)^3 = 10 x 0.09 x 0.343 = 0.3087`. `E(X) = np = 1.5`, `Var(X) = np(1-p) = 5(0.3)(0.7) = 1.05`.

**6.** `z = (70 - 60)/5 = 2`. Then `P(X > 70) = 1 - Φ(2) ≈ 1 - 0.9772 = 0.0228`, about **2.3%** — consistent with the 95% rule, which leaves about 5% split between the two tails beyond `2σ`.
