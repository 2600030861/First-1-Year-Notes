# Module 4 — Number Theory & Cryptographic Foundations

**Big picture:** Number theory studies integers. Divisibility → gcd → primes → modular arithmetic → theorems (Fermat, Euler) → RSA / Diffie-Hellman. Each idea is a building block for the next.

```
Divisibility → GCD/Euclid → Bézout → Modular inverse → Fermat/Euler → RSA
                  Primes → FTA → φ(n) ────────────────────────↗
                  Discrete log → Diffie-Hellman
```

---

## 1. Divisibility

**Definition:** For integers a, b with a ≠ 0, **a | b** ("a divides b") means b = a·k for some integer k.

**Properties** (a, b, c integers):
- If a | b and b | c, then a | c *(transitive)*
- If a | b and a | c, then a | (bx + cy) for all integers x, y *(linear combination)*
- If a | b and b ≠ 0, then |a| ≤ |b|

**Example:** 6 | 42 (42 = 6·7). Since 6 | 12 and 6 | 30, then 6 | (12·3 + 30·(−1)) = 6 ✓.

---

## 2. Division Algorithm

**Theorem:** For any integer a and positive integer b, there exist **unique** integers q (quotient) and r (remainder) with

  **a = bq + r, 0 ≤ r < b**

**Examples:**
- 47 = 5·9 + 2 → q = 9, r = 2
- −17 = 5·(−4) + 3 → q = −4, r = 3 (the remainder is never negative)

> Common mistake: writing −17 = 5·(−3) + (−2). Invalid, since r must satisfy 0 ≤ r < b.

---

## 3. GCD and LCM

**GCD:** gcd(a, b) is the largest positive integer dividing both a and b.
**Relatively prime (coprime):** gcd(a, b) = 1.
**LCM:** lcm(a, b) is the smallest positive integer divisible by both.

**Key relationship:** **gcd(a,b) · lcm(a,b) = a·b**

**Example:** gcd(12, 18) = 6, lcm(12, 18) = 36, and 6·36 = 216 = 12·18 ✓.

**Via prime factorization:** take the *minimum* exponents for gcd, *maximum* for lcm.
12 = 2²·3, 18 = 2·3² → gcd = 2·3 = 6, lcm = 2²·3² = 36.

---

## 4. Euclidean Algorithm

**Idea:** gcd(a, b) = gcd(b, a mod b). Repeat until the remainder is 0; the last nonzero remainder is the gcd.

**Why it works:** any common divisor of a and b also divides r = a − bq, and vice versa, so the pair (a,b) and (b,r) have the same common divisors.

**Example: gcd(252, 105)**
```
252 = 2·105 + 42
105 = 2·42  + 21
 42 = 2·21  + 0     → gcd = 21
```

---

## 5. Extended Euclidean Algorithm

**Bézout's identity:** for integers a, b (not both 0) there exist integers x, y with

  **ax + by = gcd(a, b)**

**Method:** run Euclid, then back-substitute.

**Example: find x, y with 240x + 46y = gcd(240, 46)**
```
240 = 5·46 + 10
 46 = 4·10 + 6
 10 = 1·6  + 4
  6 = 1·4  + 2      ← gcd = 2
  4 = 2·2  + 0
```
Back-substitute:
2 = 6 − 4 = 6 − (10 − 6) = 2·6 − 10
 = 2(46 − 4·10) − 10 = 2·46 − 9·10
 = 2·46 − 9(240 − 5·46) = **47·46 − 9·240**

So x = −9, y = 47. Check: −2160 + 2162 = 2 ✓.

**Use:** if gcd(a, n) = 1, then ax + ny = 1, so x is the inverse of a mod n (see §11).

---

## 6. Prime Numbers

**Prime:** an integer p > 1 whose only positive divisors are 1 and p.
**Composite:** an integer > 1 that is not prime. (1 is neither.)

**Useful facts:**
- 2 is the only even prime.
- If n is composite, it has a prime factor ≤ √n → to test primality by trial division, check primes up to √n.
- **Euclid's lemma:** if prime p | ab, then p | a or p | b.

**Example:** Is 97 prime? √97 ≈ 9.8; test 2, 3, 5, 7 — none divide 97 → prime.

### Fundamental Theorem of Arithmetic
Every integer n > 1 is a product of primes, **uniquely** up to order.

**Example:** 360 = 2³ · 3² · 5.

---

## 7. Infinitude of Primes (Euclid's Proof)

**Claim:** there are infinitely many primes.

**Proof (by contradiction):**
1. Suppose the only primes are p₁, p₂, …, pₖ.
2. Let N = p₁p₂⋯pₖ + 1.
3. N > 1, so it has a prime factor p. That p must be some pᵢ.
4. Then pᵢ | (p₁⋯pₖ) and pᵢ | N, so pᵢ | (N − p₁⋯pₖ) = 1. Impossible.
5. Contradiction → there are infinitely many primes. ∎

*Example:* {2, 3, 5} → N = 31 (prime, new). {2,3,5,7,11,13} → N = 30031 = 59·509 — not prime itself, but its prime factors are new. (The proof doesn't say N is prime, only that it has a new prime factor.)

---

## 8. Congruences

**Definition:** a ≡ b (mod n) means **n | (a − b)**, i.e. a and b leave the same remainder when divided by n.

**Examples:** 17 ≡ 2 (mod 5); −3 ≡ 4 (mod 7); 100 ≡ 0 (mod 10).

**Properties:** congruence is reflexive, symmetric, transitive (an equivalence relation). It splits the integers into n **residue classes** [0], [1], …, [n−1].

If a ≡ b and c ≡ d (mod n), then
- a + c ≡ b + d
- a − c ≡ b − d
- a·c ≡ b·d
- aᵏ ≡ bᵏ

---

## 9. Arithmetic in Zₙ

**Zₙ = {0, 1, …, n−1}** with operations done mod n.

**Examples in Z₁₀:**
- 7 + 8 = 15 ≡ 5
- 3 − 8 = −5 ≡ 5
- 7 · 8 = 56 ≡ 6

**Trick:** reduce as you go. Last digit of 7²⁰²⁶? Compute mod 10: 7¹=7, 7²=9, 7³=3, 7⁴=1 (cycle of 4). 2026 mod 4 = 2 → 7² = **9**.

> **Cancellation warning:** you *cannot* always divide. 6·2 ≡ 6·7 (mod 10) (both ≡ 2), but 2 ≢ 7. You may cancel a only if gcd(a, n) = 1.

---

## 10. Fast Modular Exponentiation (Square-and-Multiply)

**Problem:** compute aᵏ mod n without computing the huge aᵏ.

**Method:** write k in binary, repeatedly square, reduce mod n at every step, and multiply in the squares corresponding to 1-bits. Needs about log₂k multiplications instead of k.

**Example: 3¹³ mod 7.** 13 = 1101₂ = 8 + 4 + 1.
```
3¹ ≡ 3
3² ≡ 9 ≡ 2
3⁴ ≡ 2² = 4
3⁸ ≡ 4² = 16 ≡ 2
3¹³ = 3⁸·3⁴·3¹ ≡ 2·4·3 = 24 ≡ 3  (mod 7)
```

---

## 11. Modular Inverses

**Definition:** the inverse of a mod n is x with **ax ≡ 1 (mod n)**, written a⁻¹.

**Existence:** a⁻¹ exists **iff gcd(a, n) = 1**. It is unique mod n.

**How to find it:** use the extended Euclidean algorithm to get ax + ny = 1, then x is the inverse.

**Example: 7⁻¹ mod 26**
26 = 3·7 + 5; 7 = 1·5 + 2; 5 = 2·2 + 1.
1 = 5 − 2·2 = 5 − 2(7 − 5) = 3·5 − 2·7 = 3(26 − 3·7) − 2·7 = 3·26 − 11·7.
So 7⁻¹ ≡ −11 ≡ **15** (mod 26). Check: 7·15 = 105 = 4·26 + 1 ✓.

**Non-example:** 4 has no inverse mod 10 (gcd = 2).

---

## 12. Linear Congruences

**Problem:** solve **ax ≡ b (mod n)**.

**Rule:** let d = gcd(a, n).
- If d ∤ b → **no solution**.
- If d | b → exactly **d solutions** mod n. Divide through by d, solve (a/d)x ≡ (b/d) mod (n/d) using the inverse, then add multiples of n/d.

**Example: 6x ≡ 9 (mod 15).** d = gcd(6, 15) = 3, and 3 | 9 → 3 solutions.
Divide by 3: 2x ≡ 3 (mod 5). 2⁻¹ ≡ 3 (mod 5), so x ≡ 9 ≡ 4 (mod 5).
Solutions mod 15: **x ≡ 4, 9, 14**. Check: 6·4 = 24 ≡ 9 ✓.

**No-solution example:** 4x ≡ 5 (mod 10): gcd = 2 ∤ 5.

---

## 13. Chinese Remainder Theorem (CRT)

**Theorem:** if m₁, m₂, …, mₖ are **pairwise coprime**, then the system

 x ≡ a₁ (mod m₁), …, x ≡ aₖ (mod mₖ)

has a **unique solution modulo M = m₁m₂⋯mₖ**.

**Example: x ≡ 2 (mod 3), x ≡ 3 (mod 5).**
From the second: x = 3 + 5t. Substitute: 3 + 5t ≡ 2 (mod 3) → 2t ≡ −1 ≡ 2 → t ≡ 1 (mod 3). So x = 8. **x ≡ 8 (mod 15)**. Check: 8 mod 3 = 2 ✓, 8 mod 5 = 3 ✓.

**Classic (Sun Tzu):** x ≡ 2 (mod 3), 3 (mod 5), 2 (mod 7) → x ≡ **23** (mod 105).

**Applications:** split a big modular computation into small ones (used to speed up RSA decryption).

---

## 14. Fermat's Little Theorem

**Theorem:** if p is prime and p ∤ a, then

  **aᵖ⁻¹ ≡ 1 (mod p)**

Equivalent: aᵖ ≡ a (mod p) for every integer a.

**Examples:**
- 2⁶ = 64 = 9·7 + 1 ≡ 1 (mod 7) ✓
- 2¹⁰⁰ mod 7: 100 = 6·16 + 4 → 2¹⁰⁰ ≡ 2⁴ = 16 ≡ **2**.
- Inverse shortcut: a⁻¹ ≡ aᵖ⁻² (mod p). So 3⁻¹ mod 7 = 3⁵ = 243 ≡ 5 (since 3·5 = 15 ≡ 1 ✓).

---

## 15. Euler's Theorem

**Theorem:** if gcd(a, n) = 1, then

  **aᵠ⁽ⁿ⁾ ≡ 1 (mod n)**

It generalizes Fermat (for prime p, φ(p) = p − 1).

**Examples:**
- n = 10, φ = 4: 3⁴ = 81 ≡ 1 (mod 10) ✓
- Last digit of 7²²²: 222 mod 4 = 2, so 7²²² ≡ 7² = 49 ≡ **9** (mod 10).

---

## 16. Euler's Totient Function φ(n)

**Definition:** φ(n) = the number of integers in {1, …, n} that are coprime to n.

**Formulas:**
- φ(p) = p − 1 (p prime)
- φ(pᵏ) = pᵏ − pᵏ⁻¹ = pᵏ(1 − 1/p)
- **Multiplicative:** φ(mn) = φ(m)φ(n) if gcd(m, n) = 1
- General: φ(n) = n·∏(1 − 1/p) over distinct primes p | n

**Examples:**
- φ(9) = 9 − 3 = 6 (coprime: 1,2,4,5,7,8)
- φ(15) = φ(3)φ(5) = 2·4 = 8
- φ(36) = 36·(1 − ½)(1 − ⅓) = 36·½·⅔ = **12**
- φ(pq) = (p−1)(q−1) — the key formula for RSA.

---

## 17. Primality Reasoning (Fermat Test)

**Idea:** if n is prime, then aⁿ⁻¹ ≡ 1 (mod n) for every a coprime to n. So if the congruence **fails** for some a, n is definitely **composite**.

**Example:** n = 15, a = 2: 2¹⁴ = (2⁴)³·2² ≡ 1·4 = 4 ≢ 1 → 15 is composite.

**Limitation:** passing the test does **not** prove primality.
- **Pseudoprime:** composite n passing the test for base a. Example: 341 = 11·31 satisfies 2³⁴⁰ ≡ 1 (mod 341).
- **Carmichael numbers** (e.g. 561 = 3·11·17) pass for *every* coprime base, so the Fermat test can't detect them. Stronger tests (Miller–Rabin) fix this.

---

## 18. RSA Mathematics

**Key generation**
1. Choose two large primes p, q.
2. n = pq (public modulus).
3. φ(n) = (p−1)(q−1).
4. Choose public exponent e with 1 < e < φ(n), gcd(e, φ(n)) = 1.
5. Private exponent d = e⁻¹ mod φ(n), so **ed ≡ 1 (mod φ(n))**.

**Public key:** (n, e). **Private key:** d.

**Encryption:** c = mᵉ mod n  **Decryption:** m = cᵈ mod n

**Toy example:** p = 5, q = 11.
- n = 55, φ(n) = 40, choose e = 3, d = 27 (3·27 = 81 = 2·40 + 1 ✓).
- Message m = 8: c = 8³ = 512 ≡ **17** (mod 55).
- Decrypt: 17²⁷ mod 55 = **8** ✓ (verify via CRT: mod 5 gives 3, mod 11 gives 8 — matching 8 mod 5 and 8 mod 11).

**Correctness proof (for gcd(m, n) = 1):**
ed = 1 + kφ(n) for some integer k, so
cᵈ ≡ mᵉᵈ = m·(mᵠ⁽ⁿ⁾)ᵏ ≡ m·1ᵏ = m (mod n) by Euler's theorem. ∎

**Security:** anyone can see n, but recovering φ(n) (hence d) requires factoring n into p·q, which is infeasible for large n. Real RSA uses primes of ~1024+ bits and padding.

---

## 19. Discrete Logarithm Problem (DLP)

**Setting:** prime p, generator g. Forward direction is easy: given x, compute **y = gˣ mod p** (fast exponentiation).

**DLP:** given g, y, p, find x. No known efficient algorithm for large p.

**Example:** find x with 3ˣ ≡ 13 (mod 17). Powers of 3: 3, 9, 27≡10, 30≡13 → **x = 4**. (Brute force works for tiny p; not for 2048-bit p.)

This **one-way** behavior (easy forward, hard backward) underlies Diffie-Hellman.

---

## 20. Diffie-Hellman Key Exchange

**Goal:** Alice and Bob agree on a shared secret over a public channel.

**Steps:**
1. Public: prime p and generator g.
2. Alice picks secret a, sends **A = gᵃ mod p**.
3. Bob picks secret b, sends **B = gᵇ mod p**.
4. Alice computes **Bᵃ = gᵃᵇ**; Bob computes **Aᵇ = gᵃᵇ** (mod p). Same value!

**Example:** p = 23, g = 5, a = 4, b = 3.
- A = 5⁴ mod 23 = 4, B = 5³ mod 23 = 10.
- Alice: 10⁴ mod 23 = 18. Bob: 4³ mod 23 = 64 mod 23 = 18. **Shared secret = 18** ✓.

**Security:** an eavesdropper sees p, g, A, B but would need to solve the DLP to get a or b.

---

## 21. Hash Functions and One-Way Functions

**One-way function:** easy to compute f(x), computationally infeasible to find x from f(x). (Exponentiation mod p is a candidate; factoring gives another.)

**Hash function:** h maps arbitrary-length input to a fixed-length output (digest).

**Desired security properties:**
| Property | Meaning |
|---|---|
| **Preimage resistance** | Given h(x), hard to find any x′ with h(x′) = h(x) |
| **Second-preimage resistance** | Given x, hard to find x′ ≠ x with h(x′) = h(x) |
| **Collision resistance** | Hard to find any x ≠ x′ with h(x) = h(x′) |

**Collisions must exist** (pigeonhole: infinite inputs → finite outputs). Security means they are hard to *find*.

**Toy example:** h(x) = x mod 10 has collisions such as h(13) = h(23) = 3, and is trivially invertible — not secure.

**Birthday bound:** for an n-bit hash, collisions appear after about 2ⁿ⁄² tries, so a 256-bit hash gives ~128 bits of collision security.

**Roles:** password storage, digital signatures, integrity checks, blockchain.

---

## Quick Reference

| Topic | Key formula / rule |
|---|---|
| Division algorithm | a = bq + r, 0 ≤ r < b |
| gcd·lcm | gcd(a,b)·lcm(a,b) = ab |
| Euclid | gcd(a,b) = gcd(b, a mod b) |
| Bézout | ax + by = gcd(a,b) |
| Congruence | a ≡ b (mod n) ⇔ n \| (a−b) |
| Inverse exists | gcd(a,n) = 1 |
| Linear congruence | ax ≡ b (mod n): solvable iff gcd(a,n) \| b |
| CRT | coprime moduli → unique solution mod product |
| Fermat | aᵖ⁻¹ ≡ 1 (mod p) |
| Euler | aᵠ⁽ⁿ⁾ ≡ 1 (mod n), gcd(a,n)=1 |
| φ | φ(p)=p−1, φ(pq)=(p−1)(q−1) |
| RSA | c = mᵉ, m = cᵈ, ed ≡ 1 (mod φ(n)) |
| DH | shared secret = gᵃᵇ mod p |

## Common Mistakes
- Using a negative remainder in the division algorithm.
- Cancelling a factor mod n without checking gcd(a, n) = 1.
- Forgetting to reduce mod n at each step of exponentiation.
- Applying Fermat when p | a, or Euler when gcd(a, n) ≠ 1.
- Treating "passes the Fermat test" as proof of primality.
- Computing φ(mn) = φ(m)φ(n) when m and n are **not** coprime (e.g. φ(4) ≠ φ(2)φ(2)).
- In RSA, computing d mod n instead of mod φ(n).