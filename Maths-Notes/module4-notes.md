# Module 4 — Number Theory & Cryptographic Foundations

**Syllabus:** Divisibility · GCD · Euclidean algorithm · Primes · Modular arithmetic · CRT · Fermat · Euler · RSA · Diffie–Hellman · Discrete logarithms · Hash functions

---

## Table of Contents

1. [Divisibility & the Division Algorithm](#1-divisibility--the-division-algorithm)
2. [GCD and LCM](#2-gcd-and-lcm)
3. [Euclidean Algorithm](#3-euclidean-algorithm)
4. [Extended Euclidean Algorithm & Bézout's Identity](#4-extended-euclidean-algorithm--bézouts-identity)
5. [Primes, Fundamental Theorem of Arithmetic, Infinitude of Primes](#5-primes-fundamental-theorem-of-arithmetic-infinitude-of-primes)
6. [Modular Arithmetic (Congruences, Residue Classes, Operations, Fast Exponentiation)](#6-modular-arithmetic)
7. [Modular Inverse & Linear Congruences](#7-modular-inverse--linear-congruences)
8. [Chinese Remainder Theorem (CRT)](#8-chinese-remainder-theorem-crt)
9. [Euler's Totient Function φ(n)](#9-eulers-totient-function-φn)
10. [Fermat's Little Theorem](#10-fermats-little-theorem)
11. [Euler's Theorem](#11-eulers-theorem)
12. [Primality & the Fermat Test](#12-primality--the-fermat-test)
13. [RSA Public-Key Cryptosystem](#13-rsa-public-key-cryptosystem)
14. [Discrete Logarithm Problem (DLP)](#14-discrete-logarithm-problem-dlp)
15. [Diffie–Hellman Key Exchange](#15-diffiehellman-key-exchange)
16. [Hash Functions](#16-hash-functions)

---

# 1. Divisibility & the Division Algorithm

## 📖 Explanation

**Divisibility.** For integers $a, b$ with $a \neq 0$, we say **$a$ divides $b$** (written $a \mid b$) if there is an integer $k$ with

$$b = ak.$$

If no such $k$ exists we write $a \nmid b$. Think of it as "$b$ is exactly a multiple of $a$, with nothing left over."

**Basic properties** (for integers $a, b, c$):

| # | Property | Why it is true |
|---|----------|----------------|
| 1 | $a \mid a$ | $a = a \cdot 1$ |
| 2 | $a \mid 0$ | $0 = a \cdot 0$ |
| 3 | $a \mid b$ and $a \mid c \Rightarrow a \mid (b+c)$ | $b = ak_1,\ c = ak_2 \Rightarrow b+c = a(k_1+k_2)$ |
| 4 | $a \mid b \Rightarrow a \mid bc$ | $b = ak \Rightarrow bc = a(kc)$ |
| 5 | $a \mid b$ and $b \mid c \Rightarrow a \mid c$ (transitivity) | $b = ak_1,\ c = bk_2 = a(k_1k_2)$ |

**Division Algorithm (Theorem).** For integers $a$ and $b > 0$ there exist **unique** integers $q$ (quotient) and $r$ (remainder) such that

$$a = bq + r, \qquad 0 \le r < b.$$

- The remainder is *always* non-negative and strictly smaller than the divisor.
- $b \mid a \iff r = 0$.
- This is the engine behind the Euclidean algorithm, modular arithmetic and everything after it.
- For negative $a$: $-17 = 5(-4) + 3$ (so $q=-4$, not $-3$, because $r$ must be $\ge 0$).

## 🧪 Examples

1. $5 \mid 20$ since $20 = 5 \times 4$.
2. $7 \nmid 25$ because no integer $k$ satisfies $25 = 7k$ ($7\times3=21,\ 7\times4=28$).
3. **Division algorithm:** $57 = 8 \times 7 + 1$ → $q = 7,\ r = 1$.
4. $100 = 9 \times 11 + 1$ → $q = 11,\ r = 1$.

## ❓ Questions in the module on this topic

*No standalone practice questions in your notes for this topic — the Division Algorithm is used inside every Euclidean-algorithm question (see Topics 3 & 4). Examples 3 and 4 above are the only worked division examples.*

---

# 2. GCD and LCM

## 📖 Explanation

**GCD.** $\gcd(a,b)$ is the **largest positive integer that divides both** $a$ and $b$. Also written $(a,b)$.

**Properties**
1. $\gcd(a,b) = \gcd(b,a)$
2. $\gcd(a,0) = a$
3. $\gcd(a,a) = a$
4. If $\gcd(a,b) = 1$, then $a$ and $b$ are **coprime** (relatively prime). *This condition appears again and again: modular inverses, CRT, Euler's theorem, RSA.*

**LCM.** $\operatorname{lcm}(a,b)$ is the **smallest positive integer divisible by both** $a$ and $b$.

**Key relation (for positive integers):**

$$\boxed{\gcd(a,b)\times\operatorname{lcm}(a,b) = a\,b}$$

So once you know the GCD (fast, via Euclid), the LCM is $\dfrac{ab}{\gcd(a,b)}$ — no need to list multiples.

## 🧪 Examples

**Example 1 — GCD by listing factors:** $\gcd(24,36)$
- Factors of 24: $1,2,3,4,6,8,12,24$
- Factors of 36: $1,2,3,4,6,9,12,18,36$
- Common: $1,2,3,4,6,12$ → $\gcd(24,36) = \mathbf{12}$

**Example 2 — LCM by listing multiples:** $\operatorname{lcm}(12,18)$
- Multiples of 12: $12,24,36,48,60,\dots$
- Multiples of 18: $18,36,54,72,\dots$
- First common: $\operatorname{lcm}(12,18) = \mathbf{36}$

**Example 3 — checking the relation:** $\gcd(12,18)=6$, $\operatorname{lcm}=36$, and $6\times36 = 216 = 12\times18$ ✓

## ❓ Questions in the module on this topic

**Q-2.1 (Practice Problem 1, Session-17 Part-1)** Determine $\operatorname{lcm}(1492, 1066)$ if $\gcd(1492,1066)=2$.

---

# 3. Euclidean Algorithm

## 📖 Explanation

**Idea.** $\gcd(a,b) = \gcd(b,\ r)$ where $r$ is the remainder of $a \div b$. (Any common divisor of $a$ and $b$ also divides $a - bq = r$, and vice-versa.) So we replace the big pair by a smaller pair until the remainder hits $0$.

**Algorithm** (assume $a > b > 0$):

$$\begin{aligned}
a &= bq_1 + r_1, & 0 \le r_1 < b\\
b &= r_1q_2 + r_2, & 0 \le r_2 < r_1\\
r_1 &= r_2q_3 + r_3, & 0 \le r_3 < r_2\\
&\;\;\vdots\\
r_{n-1} &= r_nq_{n+1} + 0
\end{aligned}$$

> **The last non-zero remainder is the GCD.**

**Why it is efficient.** The remainders strictly decrease, so it always stops; in fact they at least halve every two steps, so it takes about $O(\log b)$ steps even for huge numbers — this is why RSA-size numbers are manageable.

## 🧪 Examples

**Example — $\gcd(252,105)$**

$$\begin{aligned}
252 &= 105\times2 + 42\\
105 &= 42\times2 + 21\\
42 &= 21\times2 + 0
\end{aligned}$$

Last non-zero remainder $=21$ → $\gcd(252,105)=\mathbf{21}$.

## ❓ Questions in the module on this topic

**Q-3.1 (Guided Practice Q-1, Session-17 Part-1)** Using the Division Algorithm, verify each step of the Euclidean Algorithm to determine $\gcd(160, 27)$.

---

# 4. Extended Euclidean Algorithm & Bézout's Identity

## 📖 Explanation

**Bézout's Identity.** For integers $a,b$ (not both zero) there exist integers $x,y$ with

$$ax + by = \gcd(a,b).$$

The **Extended Euclidean Algorithm** finds such $x,y$ by running the Euclidean algorithm and then **back-substituting**:

1. Run Euclid, writing every step as `remainder = a − b·q`.
2. Start from the *last non-zero remainder* (the gcd) and rewrite it using the previous equation.
3. Keep substituting upward until only $a$ and $b$ remain.

**Why it matters:**
- It gives **modular inverses**: if $\gcd(a,m)=1$ and $ax+my=1$, then $ax\equiv1\pmod m$ (Topic 7).
- It gives the **RSA private key** $d$ (Topic 13).
- It decides when $ax+by=c$ is solvable: **iff $\gcd(a,b)\mid c$.**

**General solution of $ax+by=c$** (when $g=\gcd(a,b)\mid c$): if $(x_0,y_0)$ is one solution, then all solutions are

$$x = x_0 + \frac{b}{g}\,t,\qquad y = y_0 - \frac{a}{g}\,t,\qquad t\in\mathbb Z.$$

## 🧪 Examples

**Example — find $x,y$ with $252x+105y=21$**

From Euclid: $21 = 105 - 42\times2$ and $42 = 252 - 105\times2$. Substitute:

$$21 = 105 - 2(252 - 2\cdot105) = -2\times252 + 5\times105.$$

So $x=-2,\ y=5$. **Check:** $252(-2)+105(5) = -504+525 = 21$ ✓

## ❓ Questions in the module on this topic

**Q-4.1 (Guided Practice Q-2, Session-17 Part-1)** Find integers $x$ and $y$ such that $160x + 27y = 1$ using the Extended Euclidean Algorithm.

**Q-4.2 (Practice Problem 2, Session-17 Part-1)** Find the general solution of the equation $1485x + 1745y = 15$.

---

# 5. Primes, Fundamental Theorem of Arithmetic, Infinitude of Primes

## 📖 Explanation

**Prime.** An integer $>1$ whose only positive divisors are $1$ and itself. (2, 3, 5, 7, 11, 13, 17, 19, …)

**Composite.** An integer $>1$ that is not prime (e.g. $4,6,8,9$).

**Unit.** $1$ is neither prime nor composite (only one positive divisor).

**Properties of primes**
1. Every prime is $>1$.
2. Every integer $>1$ is prime or composite.
3. The smallest prime is $2$.
4. $2$ is the **only even prime**.
5. Every composite number has at least one prime factor.

**Prime factorization.** Every composite number is a product of primes: $12=2^2\cdot3$, $30=2\cdot3\cdot5$, $84=2^2\cdot3\cdot7$.

**Fundamental Theorem of Arithmetic (FTA).** Every integer $n>1$ can be written as a product of primes, and this is **unique up to the order of the factors**:

$$n = p_1^{a_1}p_2^{a_2}\cdots p_k^{a_k}$$

with distinct primes $p_i$ and positive exponents $a_i$.

*Why uniqueness matters:* it is what makes gcd/lcm via factorization work, what makes $\phi(n)$ computable, and it is the reason RSA is safe — *multiplying* two primes is easy, but recovering them from the product is (believed) hard.

**Euclid's theorem — there are infinitely many primes.**

*Proof by contradiction:*
1. Assume only finitely many primes exist: $p_1,p_2,\dots,p_n$.
2. Build $N = p_1p_2\cdots p_n + 1$.
3. For each $p_i$, $N\equiv1\pmod{p_i}$, so **no listed prime divides $N$**.
4. But $N>1$ is either prime or has a prime divisor (FTA).
   - If $N$ is prime → it is a new prime not on the list.
   - If $N$ is composite → it has a prime divisor that is not on the list.
5. Either way a prime outside the list exists — contradiction. Hence infinitely many primes. ∎

> ⚠️ **Common misunderstanding:** $N$ need **not** itself be prime (e.g. $2\cdot3\cdot5\cdot7\cdot11\cdot13+1=30031=59\times509$ is composite). The proof only needs $N$ to have a prime factor *outside the list*.

## 🧪 Examples

**Prime factorizations**
- $360 = 2\times180 = 2^2\times90 = 2^3\times45 = 2^3\times3^2\times5$
- $756 = 2\times378 = 2^2\times189 = 2^2\times3\times63 = 2^2\times3^2\times21 = 2^2\times3^3\times7$
- $18 = 2\times3^2$ and $72 = 2^3\times3^2$ (unique).

**Illustrations of Euclid's proof**
- Suppose the only primes were $2,3,5$: $N = 2\cdot3\cdot5+1 = 31$ → prime and not in the list ✓.
- Suppose the only primes were $2,3,5,7$: $N = 2\cdot3\cdot5\cdot7+1 = 211$ → prime and new ✓.

## ❓ Questions in the module on this topic

**Q-5.1 (Practice Problem, Session-17 Part-2)** Using the primes $2, 11, 13, 17$, construct a number according to Euclid's method. Determine whether the resulting number is prime or composite.

---

# 6. Modular Arithmetic

*(Congruences, residue classes, $\mathbb Z_n$, properties, modular addition/multiplication, fast exponentiation)*

## 📖 Explanation

**Congruence.** For integers $a,b$ and positive integer $m$:

$$a\equiv b\pmod m\iff m\mid(a-b)\iff a,b\text{ leave the same remainder on division by }m.$$

Read: "$a$ is congruent to $b$ modulo $m$." Modular arithmetic is "clock arithmetic": numbers wrap around after reaching $m$.

**Residue class.** All integers congruent to $r$ mod $m$: $[r]=\{b\in\mathbb Z: b\equiv r \pmod m\}$.
- Mod 5 the classes are $[0],[1],[2],[3],[4]$.
- $[2]=\{\dots,-8,-3,2,7,12,\dots\}$.

**The set $\mathbb Z_m$.** $\mathbb Z_m=\{[0],[1],\dots,[m-1]\}$. Arithmetic in $\mathbb Z_m$ = do ordinary arithmetic then take the remainder mod $m$.

**Congruence is an equivalence relation**
1. *Reflexive:* $a\equiv a$ (since $n\mid0$).
2. *Symmetric:* $a\equiv b\Rightarrow b\equiv a$.
3. *Transitive:* $a\equiv b,\ b\equiv c\Rightarrow a\equiv c$.

**Arithmetic properties** — if $a\equiv b$ and $c\equiv d \pmod n$:

| Property | Result |
|----------|--------|
| Addition | $a+c\equiv b+d$ |
| Subtraction | $a-c\equiv b-d$ |
| Multiplication | $ac\equiv bd$ |
| Power | $a^k\equiv b^k$ for every positive integer $k$ |
| Cancellation | if $ac\equiv bc$ **and $\gcd(c,n)=1$** then $a\equiv b$ |

> ⚠️ **Division is NOT allowed freely.** You can only "cancel" $c$ when $\gcd(c,n)=1$. E.g. $2\cdot3\equiv2\cdot0\pmod6$ but $3\not\equiv0$.

**Modular addition / multiplication rules**

$$(a+b)\bmod n=\big[(a\bmod n)+(b\bmod n)\big]\bmod n$$
$$(ab)\bmod n=\big[(a\bmod n)(b\bmod n)\big]\bmod n$$

Reduce **first**, then combine — this keeps numbers small.

**Fast modular exponentiation (square-and-multiply).** To compute $a^k\bmod n$:
- if $k$ even: $a^k=(a^{k/2})^2$
- if $k$ odd: $a^k=a\cdot a^{k-1}$
- **reduce mod $n$ after every multiplication.**

Equivalent view: write $k$ in binary, repeatedly square $a$, and multiply together the powers matching the 1-bits. It needs only $O(\log k)$ multiplications — essential for RSA and Diffie–Hellman.

## 🧪 Examples

**Ex 1 — Residue classes mod 5:** $[2]$ contains $-8,-3,2,7,12$.

**Ex 2 — Modular addition:** $(58+47)\bmod13$. $58\equiv6,\ 47\equiv8 \pmod{13}$; $6+8=14\equiv\mathbf1$.

**Ex 3 — Modular multiplication:** $(45\times37)\bmod8$. $45\equiv5,\ 37\equiv5$; $5\times5=25\equiv\mathbf1\pmod8$.

**Ex 4 — Fast exponentiation:** $3^{13}\bmod7$

| Power | Value mod 7 |
|-------|-------------|
| $3^1$ | 3 |
| $3^2=9$ | 2 |
| $3^4=2^2$ | 4 |
| $3^8=4^2=16$ | 2 |

$13 = 8+4+1$ → $3^{13}\equiv3^8\cdot3^4\cdot3^1\equiv2\cdot4\cdot3=24\equiv\mathbf3\pmod7$.

## ❓ Questions in the module on this topic

### Case Study 1 — Bus Departure Scheduling Using Congruence Modulo $m$

A city transport department operates a bus service where buses depart from the central station every 15 minutes. To simplify scheduling, the department uses arithmetic modulo 15. The current time is represented as the number of minutes elapsed after 6:00 AM. Two times are considered equivalent if they leave the same remainder when divided by 15. Times that differ by a multiple of 15 minutes correspond to the same position in the departure cycle.

**Tasks:**
1. Express the following departure times (in minutes after 6:00 AM) as residue classes modulo 15: 32, 47, 68, 92, 113.
2. Determine which pairs of departure times are congruent modulo 15.
3. Explain how congruence modulo 15 can be used to identify buses that depart at the same position in the scheduling cycle.
4. Suppose a new departure time is recorded as 158 minutes after 6:00 AM. Determine which residue class modulo 15 it belongs to and identify the existing departure times that are congruent to it.

### Practice Case Study — Online Exam Timer (modulo 25)

System checks occur at 32, 57, 81, 107, 132 minutes (modulo 25).

1. Express each time as a residue class modulo 25.
2. Determine congruent pairs.
3. Explain how modular arithmetic helps identify repeated positions.
4. A new check at 157 minutes: find its residue class and earlier congruent checks.

### Practice Questions

- **Question 1:** Check whether $132 \equiv 32 \pmod{25}$.
- **Question 2:** Find $94 \pmod{25}$ and $213 \pmod{25}$.
- **Question 3:** Compute $(78 - 43) \pmod{25}$.

---

# 7. Modular Inverse & Linear Congruences

## 📖 Explanation

**Definition.** $x$ is the **modular inverse** of $a$ modulo $m$ if

$$ax\equiv1\pmod m,\quad\text{written }x\equiv a^{-1}\pmod m.$$

**Existence rule:** the inverse exists **if and only if $\gcd(a,m)=1$.**

**How to find it**
- *Small $m$:* try values.
- *Any $m$:* run the Extended Euclidean Algorithm on $(m,a)$ to get $ma'+ax=1$; then $ax\equiv1\pmod m$. If $x$ is negative, add $m$.

**Solving a linear congruence $ax\equiv b\pmod m$** (when $\gcd(a,m)=1$): multiply both sides by $a^{-1}$ → $x\equiv a^{-1}b\pmod m$.

**Applications:** decryption keys in affine/Caesar-type ciphers (Case Study 2 and the "secure access code"), the RSA private exponent, and CRT.

## 🧪 Examples

**Ex 1:** Inverse of 3 mod 7. Try values: $3\times5=15=14+1\equiv1$ → $3^{-1}\equiv\mathbf5\pmod7$.


## ❓ Questions in the module on this topic

### Case Study 2 — Secure ATM PIN Verification Using Modular Inverse

A bank uses modular arithmetic to secure customer transactions. During authentication, the system computes $17x \equiv 1 \pmod{43}$, where 17 is the encryption key, $x$ is the decryption (inverse) key, and 43 is the modulus. The bank needs to determine the inverse of 17 modulo 43.

### Practice Problem — Secure Access Code Using Modular Inverse

The access code is encoded as $y \equiv 5x \pmod{26}$.
1. Find the modular inverse of 5 modulo 26.
2. Verify it.
3. Find $7^{-1} \pmod{26}$ and $9^{-1} \pmod{26}$.
4. Check whether 13 has an inverse modulo 26.

---

# 8. Chinese Remainder Theorem (CRT)

## 📖 Explanation

**Theorem.** If $m_1,m_2,\dots,m_n$ are **pairwise coprime**, the system

$$x\equiv a_1\ (\mathrm{mod}\ m_1),\ \ x\equiv a_2\ (\mathrm{mod}\ m_2),\ \dots,\ x\equiv a_n\ (\mathrm{mod}\ m_n)$$

has a **unique** solution modulo $M=m_1m_2\cdots m_n$:

$$\boxed{x\equiv\sum_{i=1}^{n}a_i\,M_i\,M_i^{-1}\pmod M},\qquad M_i=\frac{M}{m_i},\quad M_i^{-1}\text{ = inverse of }M_i\bmod m_i.$$

**Procedure**
1. Compute $M=\prod m_i$.
2. For each $i$ compute $M_i=M/m_i$.
3. Find $M_i^{-1}\bmod m_i$ (Topic 7).
4. Add up $a_iM_iM_i^{-1}$ and reduce mod $M$.

**Why it works:** $M_i$ is divisible by every modulus except $m_i$, so in the sum every term except the $i$-th vanishes mod $m_i$, and the $i$-th term is $a_i\cdot(M_iM_i^{-1})\equiv a_i\cdot1$.

**Uses:** synchronising periodic events, splitting a big-modulus computation into small ones (also used to speed up RSA decryption).

## 🧪 Example

Solve $x\equiv2\pmod3,\ x\equiv3\pmod5$. $M=15$, $M_1=5$ ($5^{-1}\equiv2 \bmod 3$), $M_2=3$ ($3^{-1}\equiv2 \bmod 5$). $x=[2\cdot5\cdot2+3\cdot3\cdot2]\bmod15=38\bmod15=8$. Check: $8\equiv2\pmod3$, $8\equiv3\pmod5$ ✓.

## ❓ Questions in the module on this topic

### Case Study 3 — Traffic Signal Synchronization Using the Chinese Remainder Theorem

Three traffic signals operate on cycle lengths of 4, 5, and 7 minutes respectively. Their green light conditions are:
- $x \equiv 1 \pmod 4$
- $x \equiv 2 \pmod 5$
- $x \equiv 3 \pmod 7$

Find the earliest time $x$ when all three signals synchronize.

### Practice Problem (Session-19 Part-2)

Solve the simultaneous congruences $x \equiv 1 \pmod 4$ and $x \equiv 3 \pmod 5$.

---
# 9. Euler's Totient Function φ(n)

## 📖 Explanation

**Definition.** $\phi(n)$ = the number of positive integers $\le n$ that are relatively prime to $n$.

**Rules**

| Case | Formula |
|------|---------|
| $p$ prime | $\phi(p)=p-1$ |
| Prime power | $\phi(p^k)=p^k-p^{k-1}=p^k\left(1-\frac1p\right)$ |
| General $n=p_1^{a_1}\cdots p_r^{a_r}$ | $\phi(n)=n\left(1-\frac1{p_1}\right)\cdots\left(1-\frac1{p_r}\right)$ |
| $n=pq$ (distinct primes) | $\phi(n)=(p-1)(q-1)$ |

**Why $\phi(p^k)=p^k-p^{k-1}$:** among $1,\dots,p^k$ the only numbers *not* coprime to $p^k$ are the multiples of $p$, and there are $p^{k-1}$ of them.

**Why it matters:** $\phi(n)$ is the exponent in Euler's theorem (Topic 11) and the modulus for the RSA private key (Topic 13).

## 🧪 Examples

- $\phi(10)$: numbers $\le10$ coprime to 10 are $1,3,7,9$ → $\phi(10)=4$. Formula: $10(1-\tfrac12)(1-\tfrac15)=4$ ✓ (this value is used in the module's Euler example).
- $\phi(7)=6$.
- $\phi(8)=2^3-2^2=4$ (numbers $1,3,5,7$).
- $\phi(15)=(3-1)(5-1)=8$.

## ❓ Questions in the module on this topic

*No standalone questions in your notes for this topic; $\phi(n)$ is used inside the Euler example (Topic 11) and RSA (Topic 13).*

---

# 10. Fermat's Little Theorem

## 📖 Explanation

**Statement.** Let $p$ be prime. If $\gcd(a,p)=1$ (i.e. $p\nmid a$) then

$$a^{p-1}\equiv1\pmod p.$$

Equivalent form (holds for **every** integer $a$): $a^p\equiv a\pmod p$.

**Uses**
- Reduce huge exponents: $a^{k}\bmod p$ depends only on $k\bmod(p-1)$.
- Find inverses mod a prime: $a^{-1}\equiv a^{p-2}\pmod p$.
- Basis of the primality test (Topic 12).

## 🧪 Examples

- $2^6\equiv1\pmod7$ ($64=63+1$) ✓
- $3^{13}\bmod7$: $13=6\cdot2+1$ → $3^{13}\equiv(3^6)^2\cdot3\equiv3$ — matches the fast-exponentiation answer in Topic 6.

## ❓ Questions in the module on this topic

*None as standalone problems; Fermat's theorem is the prime special case of Euler's theorem, and the module's exponent example is under Topic 11.*

---

# 11. Euler's Theorem

## 📖 Explanation

**Statement.** If $\gcd(a,n)=1$ then

$$a^{\phi(n)}\equiv1\pmod n.$$

Fermat's Little Theorem is the special case $n=p$ prime, since $\phi(p)=p-1$.

**Technique for big powers:** if $\gcd(a,n)=1$, write the exponent as $k=\phi(n)\cdot q+r$; then $a^k\equiv a^r\pmod n$.

> ⚠️ The condition $\gcd(a,n)=1$ is required.

## 🧪 Example

**Find $3^{100}\bmod10$.** $\gcd(3,10)=1$ and $\phi(10)=4$, so $3^4\equiv1\pmod{10}$. Since $100=4\times25$:

$$3^{100}=(3^4)^{25}\equiv1^{25}\equiv\mathbf1\pmod{10}.$$

## ❓ Questions in the module on this topic

*No additional unsolved questions in your notes; the example above is the only exercise. (The Practice Problem printed next to it in Session-19 Part-2 is a CRT problem — see Q under Topic 8.)*

---

# 12. Primality & the Fermat Test

## 📖 Explanation

**Primality problem.** Decide whether $n>1$ is prime or composite.
- Small $n$: **trial division** by every prime up to $\sqrt n$ (if none divides $n$, then $n$ is prime).
- Huge $n$: use number-theoretic properties instead.

**Fermat's necessary condition.** If $n$ is prime, then for every $a$ with $\gcd(a,n)=1$:

$$a^{n-1}\equiv1\pmod n.$$

**Consequence (the test):** if $a^{n-1}\not\equiv1\pmod n$ for some $a$, then $n$ is **definitely composite.**

**Limitations**
- The condition is **necessary, not sufficient.** If the congruence holds, $n$ is only *probably* prime.
- A composite $n$ that passes for base $a$ is a **Fermat pseudoprime** to base $a$.
- **Carmichael numbers** (e.g. $561=3\times11\times17$) pass the test for **every** base coprime to $n$ while still being composite. So the plain Fermat test can be fooled; stronger tests (e.g. Miller–Rabin) are used in practice.

## 🧪 Examples (added for clarity)

- Test $n=15$, $a=2$: $2^{14}=16384$; $16384\bmod15=4\neq1$ → 15 is composite ✓.
- Test $n=7$, $a=2$: $2^6=64\equiv1\pmod7$ → consistent with 7 being prime.

## ❓ Questions in the module on this topic

*No numerical questions in your notes for this session — it is concept-only (necessary condition, pseudoprimes, Carmichael numbers).*

---

# 13. RSA Public-Key Cryptosystem

## 📖 Explanation

**Idea.** Each user has a **public key** (anyone can encrypt) and a **private key** (only the owner can decrypt). Security rests on the belief that **factoring** $n=pq$ is hard, while multiplying two primes is easy.

**Key generation**
1. Choose two distinct large primes $p,q$.
2. Modulus $n=pq$.
3. $\phi(n)=(p-1)(q-1)$.
4. Choose public exponent $e$ with $1<e<\phi(n)$ and $\gcd(e,\phi(n))=1$.
5. Compute private exponent $d$ with $ed\equiv1\pmod{\phi(n)}$ (**Extended Euclid**, Topic 4/7).
6. **Public key** $(e,n)$; **private key** $(d,n)$.

**Encryption:** $C\equiv M^e\pmod n$  **Decryption:** $M\equiv C^d\pmod n$   (message $M<n$)

**Correctness proof (from Euler's theorem)**

Since $ed\equiv1\pmod{\phi(n)}$, write $ed=1+k\phi(n)$. Then

$$C^d=(M^e)^d=M^{ed}=M^{1+k\phi(n)}=M\,\big(M^{\phi(n)}\big)^k.$$

If $\gcd(M,n)=1$, Euler gives $M^{\phi(n)}\equiv1\pmod n$, so

$$C^d\equiv M\cdot1^k\equiv M\pmod n.\ \ \blacksquare$$

*(Remark: the case $\gcd(M,n)\ne1$ is extremely unlikely for a large $n$; RSA still works there too, which can be shown with CRT, but your notes prove only the coprime case.)*

## 🧪 Example (added; small numbers for illustration only)

$p=5,\ q=11$ → $n=55$, $\phi=40$. Pick $e=7$ ($\gcd(7,40)=1$). Find $d$: $7d\equiv1\pmod{40}$; $7\times23=161=4\cdot40+1$ → $d=23$.
Encrypt $M=2$: $C=2^7=128\equiv18\pmod{55}$. Decrypt: $18^{23}\bmod55=2$ ✓.

## ❓ Questions in the module on this topic

*No numerical practice questions for RSA appear in your notes — only the algorithm and the correctness proof (which are the likely exam items: "State the RSA key generation steps" and "Prove RSA decryption works").*

---

# 14. Discrete Logarithm Problem (DLP)

## 📖 Explanation

**Problem.** Given a prime $p$, a generator $g$ and $y\equiv g^x\pmod p$, **find $x$.**

- **Easy direction:** computing $g^x\bmod p$ — fast by square-and-multiply.
- **Hard direction:** recovering $x$ from $y$ — no known efficient algorithm for large $p$.

This gives a **one-way function**, the foundation of Diffie–Hellman and related systems.

**Generator (primitive root).** $g$ is a generator mod $p$ if its powers $g^1,g^2,\dots,g^{p-1}$ produce every non-zero residue mod $p$ (its order is $p-1$).

**Security assumptions (names in your notes)**
- **DLA – Discrete Logarithm Assumption:** finding $x$ from $g^x$ is infeasible.
- **CDH – Computational Diffie–Hellman:** given $g^a,g^b$, computing $g^{ab}$ is infeasible.
- **DDH – Decisional Diffie–Hellman:** given $g^a,g^b$, one cannot distinguish $g^{ab}$ from a random element.

## 🧪 Example (added)

In $\mathbb Z_7$ with $g=3$: the powers $3^1,\dots,3^6$ are $3,2,6,4,5,1$ — every non-zero residue, so $3$ is a generator. The DLP asks: for $y=6$, which $x$ gives $3^x\equiv6$? (Answer $x=3$.) With a tiny $p$ you can try all exponents; for a 2048-bit $p$ that is impossible.

## ❓ Questions in the module on this topic

*No standalone DLP questions; it is used through the Diffie–Hellman case studies below.*

---

# 15. Diffie–Hellman Key Exchange

## 📖 Explanation

**Goal.** Two parties agree on a **shared secret key over a public channel** without ever sending the key.

**Protocol**
1. **Public parameters:** large prime $p$ and generator $g$.
2. **Alice:** picks private $a$, sends $A=g^a\bmod p$.
3. **Bob:** picks private $b$, sends $B=g^b\bmod p$.
4. **Shared secret:**
   - Alice: $K=B^a\bmod p=g^{ab}\bmod p$
   - Bob: $K=A^b\bmod p=g^{ab}\bmod p$

**What an eavesdropper sees:** $p,g,A,B$ only. Getting $K$ from these is the CDH problem.

**Security:** relies on DLA / CDH / DDH (Topic 14). **Small primes are insecure** because all exponents can be brute-forced; real systems use primes of $\ge2048$ bits.

> Plain DH does not authenticate the parties (a man-in-the-middle can interfere) — a general fact, beyond your notes, worth knowing for exams.

## 🧪 Examples

*Worked numbers are left to the case studies below.*

## ❓ Questions in the module on this topic

### Case Study 8 — Diffie–Hellman with $p = 23,\ g = 5,\ a = 6,\ b = 15$

*(The notes give these parameters in a walkthrough; the tasks below are the ones that walkthrough covers.)*
1. Compute Alice's and Bob's public keys.
2. Compute the shared secret as Alice and as Bob, and confirm they agree.
3. Explain why a small prime such as $p = 23$ is insecure.

### Case Study 9 — E-commerce Platform (Practice)

An e-commerce platform uses Diffie–Hellman with $p = 29$, $g = 2$, customer private key $a = 5$ and server private key $b = 12$. Calculate the public keys, the shared secrets, the information visible to an eavesdropper, and the security implications of using $p = 29$.

---

# 16. Hash Functions

> ⚠️ **Your Module 4 notes do not contain a hash-functions section** (the syllabus lists it, so it is probably covered in a later session). The material below is added from the standard syllabus content so the file is complete — check it against your class slides.

## 📖 Explanation

**Definition.** A hash function $h$ maps an input of **arbitrary length** to a **fixed-length output** (the *digest* or *hash*):

$$h:\{0,1\}^*\to\{0,1\}^n.$$

**Two families**
1. **Simple (data-structure) hashing** — e.g. $h(k)=k\bmod m$ for a hash table of size $m$. Goal: spread keys evenly; collisions are handled by chaining or probing. (Ties to your Module 2 "modulo/hashing functions" and the pigeonhole principle.)
2. **Cryptographic hashing** — e.g. SHA-256. Must satisfy:

| Property | Meaning |
|----------|---------|
| **Deterministic** | same input → same output |
| **Efficient** | fast to compute |
| **Preimage resistance (one-way)** | given $h(x)$, hard to find $x$ |
| **Second-preimage resistance** | given $x$, hard to find $x'\ne x$ with $h(x')=h(x)$ |
| **Collision resistance** | hard to find *any* $x\ne x'$ with $h(x)=h(x')$ |
| **Avalanche effect** | flipping one input bit changes about half the output bits |

**Collisions are unavoidable** (pigeonhole: infinitely many inputs, finitely many outputs). Security means they are *hard to find*.

**Birthday bound.** For an $n$-bit hash, a collision is found after about $2^{n/2}$ trials, so collision resistance is only about $n/2$ bits (SHA-256 → about $2^{128}$ work).

**Uses:** integrity checks, password storage (with salt), digital signatures (hash then sign with RSA), hash tables, blockchains.

**Link to this module:** modular arithmetic underlies simple hashes ($k\bmod m$); one-wayness is analogous to the discrete-log/factoring problems.

## 🧪 Examples (added)

- Hash table with $m=7$: keys $15,\ 22,\ 36$ → $15\bmod7=1,\ 22\bmod7=1,\ 36\bmod7=1$ → all collide in slot 1.
- Using a prime $m$ (e.g. 7 rather than 10) usually spreads keys better.

## ❓ Questions in the module on this topic

*None in your notes.*

---

# ✅ Master Checklist — every question in your Module 4 file

| # | Question | Topic |
|---|----------|-------|
| 1 | $\operatorname{lcm}(1492,1066)$ given $\gcd=2$ | 2 |
| 2 | $\gcd(160,27)$ via the Division Algorithm | 3 |
| 3 | $160x+27y=1$ (Extended Euclid) | 4 |
| 4 | General solution of $1485x+1745y=15$ | 4 |
| 5 | Euclid's method with primes $2,11,13,17$ | 5 |
| 6 | Case Study 1 — bus scheduling (mod 15), Tasks 1–4 | 6 |
| 7 | Online Exam Timer (mod 25), 4 tasks | 6 |
| 8 | Is $132\equiv32\pmod{25}$? | 6 |
| 9 | $94\bmod25$ and $213\bmod25$ | 6 |
| 10 | $(78-43)\bmod25$ | 6 |
| 11 | Case Study 2 — $17x\equiv1\pmod{43}$ | 7 |
| 12 | Secure Access Code $y\equiv5x\pmod{26}$ ($5^{-1}$, $7^{-1}$, $9^{-1}$, does 13 have an inverse?) | 7 |
| 13 | Case Study 3 — CRT traffic signals | 8 |
| 14 | $x\equiv1\pmod4,\ x\equiv3\pmod5$ | 8 |
| 15 | Case Study 8 — Diffie–Hellman, $p=23$ | 15 |
| 16 | Case Study 9 — Diffie–Hellman, $p=29$ | 15 |

---

## 🧠 Quick formula sheet

- $ab=\gcd(a,b)\cdot\operatorname{lcm}(a,b)$
- Bézout: $ax+by=\gcd(a,b)$; solvable for $c$ iff $\gcd\mid c$
- $a\equiv b\pmod m\iff m\mid(a-b)$
- Inverse of $a$ mod $m$ exists iff $\gcd(a,m)=1$
- CRT: $x=\sum a_iM_i(M_i^{-1}\bmod m_i)\pmod M$
- $\phi(p)=p-1$; $\phi(pq)=(p-1)(q-1)$; $\phi(p^k)=p^k-p^{k-1}$
- Fermat: $a^{p-1}\equiv1\pmod p$  Euler: $a^{\phi(n)}\equiv1\pmod n$
- RSA: $n=pq$, $ed\equiv1\pmod{\phi(n)}$, $C=M^e$, $M=C^d$
- DH: $A=g^a,\ B=g^b,\ K=g^{ab}$
