# DDCA – Module 2
## Making Decisions & Doing Maths
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

Module 1 gave you the alphabet: bits, numbers, gates, Boolean algebra. Module 2 uses that alphabet to build the **first real piece of the CPU** — the block that adds, subtracts and compares. That block is called the **ALU** (Arithmetic Logic Unit), and it is the "calculator" inside the processor you ran in Ripes on day one.

Everything in this module is **combinational**: no clock, no memory, output decided purely by the inputs in front of it. That sounds like a limitation, but it is exactly the right tool for arithmetic, because `A + B` must not depend on what was added five minutes ago.

The order is deliberate. We start with the *idea* of combinational logic (2.1), learn to make it **cheap** with Karnaugh maps (2.2), build the adder (2.3), bend the adder into a subtractor (2.4), add the data-routing blocks a CPU needs (2.5), build comparators for branches (2.6), glue everything into an ALU (2.7), and finish with the disciplined design flow you will reuse for the rest of the course (2.8).

**Connecting to the north star:** in Module 5 the RISC-V datapath sends register `rs1` and `rs2` into this ALU and takes the result back out. If your ALU is wrong, every `add`, `sub`, `and`, `or`, `slt` and every branch in the program is wrong. This is the module where the CPU starts actually computing.

```text
   Module 2 milestone:  [ ALU ]  in the simulator,
                        tested on all 5 operations,
                        with a working zero flag.
```

## Basics you must know first

- **Gates and truth tables** (Module 1.6): AND, OR, NOT, NAND, NOR, XOR, XNOR, and how to read a truth table.
- **Sum of products** (Module 1.8): write one minterm per `F=1` row, OR them, then simplify.
- **Boolean laws** (Module 1.7): especially the distributive laws and De Morgan.
- **Two's complement** (Module 1.5): flip bits and add 1; the top bit carries weight `-2^(n-1)`; overflow means same-sign operands, opposite-sign result.
- **Binary addition** (Module 1.5): column by column, carry to the left.

## 2.1 Combinational logic

### Intuition

A pocket calculator: press `7`, `+`, `5`, `=`, and you get 12. Press the same keys tomorrow and you get 12 again. It does not care what you did before. That is combinational logic — the answer depends only on what you are pressing **right now**. A **counter**, by contrast, *does* care about the past, because it remembers where it was. Anything with memory is **sequential** (Module 3).

### The idea, step by step

**Step 1 — The definition.** A **combinational circuit** is one whose output is a pure function of its present inputs. Two consequences follow immediately: no feedback loops (outputs must not depend on themselves), and no stored state. In maths language, `out = f(in)` — a function, not a state machine.

```text
   inputs ──►┌──────────────────┐──► outputs
             │  combinational   │
             │  (gates only)    │
             └──────────────────┘
        no clock, no memory, no feedback
```

**Step 2 — Why a CPU is mostly this.** Every arithmetic and logic instruction is a pure function. `add x7, x5, x6` must produce the same answer every time for the same registers. If the ALU remembered anything, the program would become unpredictable. So the ALU is combinational; only the *registers around it* hold state.

**Step 3 — What it cannot do, and what you must always specify.** A combinational block cannot count, "wait", remember a keypress or step through instructions — those need feedback and a clock (Module 3). For any design you must state the **inputs** with widths, the **outputs** with widths, and the **truth table or rule** connecting them; skip one and you will build the wrong circuit.

**Example question:** Classify each as combinational or sequential, with one reason: (a) a 4-bit adder, (b) a 4:1 multiplexer, (c) a counter that increments on every clock tick, (d) a register that holds a value until told to load.

**Solution:**

- (a) **Combinational.** Reason: the sum of two 4-bit numbers depends only on those two numbers — nothing is remembered.
- (b) **Combinational.** Reason: a multiplexer just passes one selected input to the output; the selection is a present input, not a stored value.
- (c) **Sequential.** Reason: the count depends on the previous count, so the circuit must store state and needs a clock.
- (d) **Sequential.** Reason: "holds a value" *is* memory; the output depends on the past, not only on the present inputs.

**Final answer:** (a) and (b) combinational; (c) and (d) sequential.

⚠️ **Common trap:** Calling a circuit combinational just because it has no visible clock wire. A cross-coupled NAND pair (an SR latch) has no clock and is still sequential, because its output feeds back into its own input.

## 2.2 Simplifying logic with Karnaugh maps (K-maps)

### Intuition

Two recipes for the same dish: one needs 12 ingredients, the other needs 4 and tastes the same. Which would you cook? Gates are ingredients — each one costs **area** on the chip, **delay** in the path, and **power** in the battery. A K-map is a picture that lets you *see* the 4-ingredient version instead of hunting for it with algebra.

### The idea, step by step

**Step 1 — Why fewer gates.** Three separate costs, all real: **cost** (more transistors = more silicon area = more rupees), **speed** (each gate adds delay, so a shorter expression is a faster circuit — critical in 2.3 where delays chain), and **power** (every gate that switches burns energy). One simplification can remove a whole level of logic.

**Step 2 — The map is a truth table folded into a grid.** Each cell is one minterm, and — this is the whole trick — **adjacent cells differ in exactly one variable**. So a pair of adjacent 1s can be merged into one term with one literal removed. That is the Boolean law `A'BC + ABC = BC(A'+A) = BC`, drawn as a picture.

**Step 3 — Gray-code ordering, and why.** Columns and rows are labelled in the order `00, 01, 11, 10` — not `00, 01, 10, 11`. Reason: with Gray order, each step changes exactly one bit, so neighbouring cells differ in one variable. With binary order, `01` and `10` differ in two bits, and grouping them would be illegal. Also, the map **wraps**: the left edge touches the right edge, and the top touches the bottom, because `00` and `10` also differ in one bit.

```text
  3-variable map  (rows A, columns BC in Gray order)

        BC=00   BC=01   BC=11   BC=10
  A=0  [ m0 ]  [ m1 ]  [ m3 ]  [ m2 ]
  A=1  [ m4 ]  [ m5 ]  [ m7 ]  [ m6 ]
          └──── wrap-around ─────┘
```

**Step 4 — The grouping rules.** Group 1s in rectangles of size `1, 2, 4, 8, 16...` (powers of two only); rectangles may wrap around edges; groups may overlap; use the **largest** groups possible; every 1 must be in at least one group. A group of `2^k` cells removes `k` literals.

| Group size | Literals removed | Term keeps |
|-----------|------------------|------------|
| 1 cell | 0 | all 3 (or 4) literals |
| 2 cells | 1 | 2 (or 3) literals |
| 4 cells | 2 | 1 (or 2) literals |

**Step 5 — Worked: 2 variables.** `F(A,B) = Σm(1,3)`, i.e. 1 on rows `01` and `11`.

```text
        B=0   B=1
  A=0    0     1      <- m1
  A=1    0     1      <- m3   (vertically adjacent -> merge)
```

The two 1s are vertically adjacent (differ only in `A`), so they merge: `A'B + AB = B`. **`F = B`.** One literal, no gates if `B` is a wire.

**Step 6 — Worked: 3 variables, a group of 4.** `F(A,B,C) = Σm(1,3,5,7)`.

```text
        BC=00  BC=01  BC=11  BC=10
  A=0     0      1      1      0
  A=1     0      1      1      0
```

The four 1s form a 2x2 block covering `BC = 01` and `BC = 11` in both rows. Inside that block `A` takes both values and `B` takes both values, while `C` is always 1. **`F = C`.** Check: minterms 1, 3, 5, 7 are `001, 011, 101, 111` — every one of them ends in `C = 1`. Correct.

**Step 7 — Worked: 3 variables with a wrap-around pair.** `F(A,B,C) = Σm(0,1,4,5,6)`.

```text
        BC=00  BC=01  BC=11  BC=10
  A=0     1      1      0      0
  A=1     1      1      0      1
```

Two groups. First, the four cells in columns `00` and `01` across both rows: `B` is 0 throughout, `A` and `C` vary, so that group is `B'`. Second, the two cells in row `A=1` at columns `00` and `10` — these are the **left and right edges of the row**, which wrap and are adjacent: `A` is 1 in both, `C` is 0 in both, `B` varies, so that group is `A.C'`. **`F = B' + A.C'`.** Check `m6 = 110`: `B' = 0`, `A.C' = 1.1 = 1` -> `F = 1`. Correct. Check `m2 = 010`: `B' = 0`, `A.C' = 0` -> `F = 0`. Correct.

**Step 8 — Worked: 4 variables.** `F(A,B,C,D) = Σm(0,1,2,3,8,9,10,11,14,15)`.

```text
          CD=00  CD=01  CD=11  CD=10
  AB=00     1      1      1      1
  AB=01     0      0      0      0
  AB=11     0      0      1      1
  AB=10     1      1      1      1
```

Group 1: rows `AB=00` and `AB=10` — the **top and bottom edges**, which wrap — all four columns. That is 8 cells, and `B = 0` in every one, so the term is `B'`. Group 2: the 2x2 block `m10, m11, m14, m15` where `A = 1` and `C = 1`, so the term is `A.C`. **`F = B' + A.C`**, from ten minterms to two terms.

**Step 9 — Don't-care terms.** Sometimes an input combination can never happen (for example, an unused BCD digit `1010`–`1111`), so its output does not matter. Mark those cells `X` and treat each `X` as 1 **if it makes a group bigger**, or as 0 if it does not. Example: `F(A,B,C) = Σm(1,3,7) + d(5)`.

```text
        BC=00  BC=01  BC=11  BC=10
  A=0     0      1      1      0
  A=1     0      X      1      0
```

Treating the `X` at `m5` as a 1 gives a 2x2 block over columns `01` and `11` in both rows, so **`F = C`** — one term. Without the don't-care the best you could do is two pairs, `A'C + B.C` (which also excludes `m5`), so the `X` saved you a term. In bigger maps a don't-care often saves more. Never *require* an `X` to be covered — only use it when it enlarges a group.

**Example question:** Simplify `F(A,B,C) = Σm(2,3,6,7)` using a K-map, and state how many 2-input gates the result needs.

**Solution:**

- Step 1: write the minterms in binary. `2 = 010`, `3 = 011`, `6 = 110`, `7 = 111`. Reason: `A` is the MSB.
- Step 2: fill the map.

```text
        BC=00  BC=01  BC=11  BC=10
  A=0     0      0      1      1
  A=1     0      0      1      1
```

- Step 3: the four 1s form a 2x2 block over columns `11` and `10` in both rows. Reason: columns `11` and `10` are adjacent in Gray order.
- Step 4: inside the block, `A` takes both values and `C` takes both values; only `B` stays 1. Reason: a group of 4 removes two literals.
- Step 5: `F = B`. Check all eight rows: `B=1` for `010, 011, 110, 111` only, which is exactly the minterm list.

**Final answer:** `F = B` — a single wire, **zero gates** (or one buffer if you must drive a load).

⚠️ **Common trap:** Grouping **diagonally**. Diagonally adjacent cells differ in two variables, so the merge is illegal — that is the single most common K-map error. Second trap: making a group of 3 or 6 (only powers of two). Third trap: forgetting the wrap-around edges, which is exactly where a free literal often hides. Fourth trap: writing a term with the wrong polarity — for a group where `A = 0`, the term contains `A'`.

## 2.3 Arithmetic circuits

### Intuition

You already add on paper: add a column, write the digit, carry the extra to the next column. A **half adder** is that idea for one column with no carry coming in. A **full adder** is one column that also accepts a carry. Chain 32 of them and you have a 32-bit adder — which is literally what is inside your CPU.

### The idea, step by step

**Step 1 — Half adder.** Two inputs `A, B`; two outputs: **sum** `S` and **carry out** `C`. Adding two bits gives `0, 1, 1, 10` — so `S` is 1 when the inputs differ (XOR) and `C` is 1 when both are 1 (AND).

| `A` | `B` | `S = A ⊕ B` | `C = A.B` | `A+B` as 2 bits |
|-----|-----|-------------|-----------|-----------------|
| 0 | 0 | 0 | 0 | `00` = 0 |
| 0 | 1 | 1 | 0 | `01` = 1 |
| 1 | 0 | 1 | 0 | `01` = 1 |
| 1 | 1 | 0 | 1 | `10` = 2 |

```text
        A ──┬──────────────┐
            │          ┌───┴───┐
            │          │  XOR  ├──── S  (= A ⊕ B)
        B ──┼──────────┴───┬───┘
            │          ┌───┴───┐
            └──────────┤  AND  ├──── C  (= A . B)
                       └───────┘
```

**Step 2 — Full adder.** Now a carry `Cin` arrives from the column on the right, so we add three bits. The sum bit is `A ⊕ B ⊕ Cin` (1 when an odd number of inputs are 1); the carry is 1 when **at least two** inputs are 1.

| `A` | `B` | `Cin` | `S` | `Cout` | total `A+B+Cin` |
|-----|-----|-------|-----|--------|-----------------|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 | 1 |
| 0 | 1 | 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 | 1 | 2 |
| 1 | 0 | 0 | 1 | 0 | 1 |
| 1 | 0 | 1 | 0 | 1 | 2 |
| 1 | 1 | 0 | 0 | 1 | 2 |
| 1 | 1 | 1 | 1 | 1 | 3 |

```text
  S    = A ⊕ B ⊕ Cin
  Cout = A.B + Cin.(A ⊕ B)      (also written  A.B + B.Cin + A.Cin)
```

**Meaning:** `S` is the low bit of the three-input count; `Cout` is the high bit. **When to use:** every column of a multi-bit adder. **Tiny example:** `A=1, B=1, Cin=1` gives `S=1, Cout=1` because `1+1+1 = 3 = 11`.

```text
  A ───┬──────────────┐
       │          ┌───┴───┐
       │          │  XOR  ├── s1 ──┬─────────────┐
  B ───┼──────────┴───┬───┘        │         ┌───┴───┐
       │              │            │         │  XOR  ├──── S
  Cin ─┼──────────────┼────────────┴─────────┴───┬───┘
       │              │                          │
       │          ┌───┴───┐  p1 = A.B      ┌─────┴───┐
       └──────────┤  AND  ├────────────────┤         │
                  └───────┘                │   OR    ├──── Cout
                  ┌───────┐  p2 = s1.Cin   │         │
      s1 ─────────┤  AND  ├────────────────┤         │
      Cin ────────┘       │                └─────────┘
                  └───────┘
```

**Step 3 — Chaining: the ripple-carry adder.** Feed the carry out of each column into the carry in of the next, with `Cin = 0` at the rightmost column. That is the whole design.

```text
   A3 B3      A2 B2      A1 B1      A0 B0
    │  │       │  │       │  │       │  │
   ┌▼──▼┐     ┌▼──▼┐     ┌▼──▼┐     ┌▼──▼┐
   │ FA │◄────┤ FA │◄────┤ FA │◄────┤ FA │◄── Cin = 0
   └─┬──┘ c3  └─┬──┘ c2  └─┬──┘ c1  └─┬──┘
     │          │          │          │
    S3         S2         S1         S0       Cout = c4
```

**Step 4 — Trace a real addition.** `0101 + 0011` (5 + 3) through the four columns:

```text
  bit  A  B  Cin  ->  S  Cout
   0   1  1   0   ->  0   1
   1   0  1   1   ->  0   1
   2   1  0   1   ->  0   1
   3   0  0   1   ->  1   0
  result 1000 = 8, carry out 0
```

Correct: `5 + 3 = 8`. Notice the carry walked left one column per step — that is why it is called a *ripple*.

**Step 5 — Why wide adders are slow.** The top column cannot finish until the carry has rippled through every column to its right. Each full adder costs about **2 gate delays** from `Cin` to `Cout`, so a 32-bit adder needs roughly `2 x 32 = 64` gate delays before `S31` is valid — no matter how fast each gate is. This is **carry propagation delay**, and it is why real CPUs use faster structures (carry-lookahead) or pipeline the work. (Exact delays depend on the gate library; the `2n` figure is the standard first estimate.)

**Step 6 — Verify in Java.** A few lines of bit manipulation reproduce the hardware exactly:

```java
public class RippleAdder4 {
    public static void main(String[] args) {
        int a = 0b0110, b = 0b0011;                  // 6 + 3
        int carry = 0, sum = 0;
        for (int i = 0; i < 4; i++) {
            int ai = (a >> i) & 1, bi = (b >> i) & 1;
            int s = ai ^ bi ^ carry;                 // sum bit
            int c = (ai & bi) | (carry & (ai ^ bi)); // carry out
            sum |= (s << i);
            carry = c;
        }
        System.out.println(Integer.toBinaryString(sum) + " carry=" + carry);
    }
}
```

It prints `1001 carry=0`, i.e. `6 + 3 = 9` with no carry out. Same as the hardware.

**Example question:** Using the full-adder table, compute `0110 + 0101` with a 4-bit ripple-carry adder, showing every column's carry, and give the final sum and the carry out.

**Solution:**

- Step 1: list the bits. `A = 0110` so `A3=0, A2=1, A1=1, A0=0`; `B = 0101` so `B3=0, B2=1, B1=0, B0=1`. Reason: bit 0 is the rightmost.
- Step 2: column 0 with `Cin = 0`: `0+1+0 = 1`, so `S0 = 1`, `c1 = 0`. Reason: the sum is 1 and there is no carry when the total is below 2.
- Step 3: column 1 with `Cin = 0`: `1+0+0 = 1`, so `S1 = 1`, `c2 = 0`.
- Step 4: column 2 with `Cin = 0`: `1+1+0 = 2 = 10`, so `S2 = 0`, `c3 = 1`. Reason: two ones make a sum bit of 0 and a carry of 1.
- Step 5: column 3 with `Cin = 1`: `0+0+1 = 1`, so `S3 = 1`, `Cout = 0`.
- Step 6: collect `S3 S2 S1 S0 = 1011`. Reason: MSB first.
- Check: `6 + 5 = 11`, and `1011 = 8 + 2 + 1 = 11`. Correct.

**Final answer:** `0110 + 0101 = 1011` with carry out `0`; the carries were `c1=0, c2=0, c3=1, Cout=0`.

⚠️ **Common trap:** Forgetting `Cin` when computing `Cout`. The carry out is 1 when **at least two** of `A, B, Cin` are 1 — not only when `A.B = 1`. Second trap: wiring the carry chain right-to-left (it flows LSB to MSB). Third trap: assuming a 32-bit adder is "instant". It is about 64 gate delays deep.

## 2.4 Subtraction with two's complement

### Intuition

You do not build a separate subtraction machine. You already own an adder, and Module 1 said `A - B = A + (-B)`, where `-B` is "flip the bits and add 1". So subtraction is just *addition of a modified B*. One wire decides which job the hardware does.

### The idea, step by step

**Step 1 — The XOR trick.** A 2-input XOR is a **controlled inverter**: `B ⊕ 0 = B`, and `B ⊕ 1 = B'`. So one control line, `SUB`, can either pass `B` through untouched or invert every bit of it.

| `SUB` | `B` | `B ⊕ SUB` | Effect |
|-------|-----|-----------|--------|
| 0 | `b` | `b` | pass through (addition) |
| 1 | `b` | `b'` | invert (subtraction) |

**Step 2 — The "+1" for free.** Two's complement negation is "flip and add 1". The flip comes from the XORs; the "+1" comes from feeding `SUB` itself into the `Cin` of the **lowest** full adder. In add mode `SUB = 0` so `Cin = 0`; in subtract mode `SUB = 1` so `Cin = 1`. No extra adder needed.

```text
   A[3:0] ─────────────►┌────────────────────┐
                        │  4-bit ripple      │
   B3 ─[XOR]─ B3' ──────►│  carry adder       ├──► S[3:0]
   B2 ─[XOR]─ B2' ──────►│  Cin of FA0 ──┐    │
   B1 ─[XOR]─ B1' ──────►│               │    │
   B0 ─[XOR]─ B0' ──────►└───────────────┼────┘
                                         │
   SUB ──┬────────────────────────────────┴──► (the +1)
         └──► second input of every XOR  (SUB = 0 passes B, SUB = 1 inverts it)
```

**Step 3 — The overflow flag.** Subtraction can overflow too, and the correct test is **not** the carry out. Define `V` (overflow) as:

```text
  V = Cout  XOR  Cin(into the MSB)
```

**Meaning:** `Cout` is the carry leaving the top column, `Cin(MSB)` the carry entering it. If they disagree, the sign of the result is wrong. **When to use:** every add and subtract, because a program must know when the answer is invalid. **Tiny example:** the `5 - 3` trace below has `Cout = 1` and `Cin(MSB) = 1`, so `V = 0` — a carry out with no overflow.

**Step 4 — Trace both directions.** `SUB = 1` inverts `B` and sets `Cin(FA0) = 1`. Left: `5 - 3` with `B = 0011`, `B' = 1100`. Right: `3 - 5` with `B = 0101`, `B' = 1010`.

```text
  5 - 3                          3 - 5
  bit  A  B'  Cin -> S  Cout      bit  A  B'  Cin -> S  Cout
   0   1   0   1  -> 0   1        0   1   0   1  -> 0   1
   1   0   0   1  -> 1   0        1   1   1   1  -> 1   1
   2   1   1   0  -> 0   1        2   0   0   1  -> 1   0
   3   0   1   1  -> 0   1        3   0   1   0  -> 1   0
  result 0010 = 2 , Cout = 1      result 1110 = -2 , Cout = 0
  V = 1 XOR 1 = 0                 V = 0 XOR 0 = 0
```

Both are correct. Note `Cout = 1` means "no borrow was needed" and `Cout = 0` means "a borrow was taken" — neither is an error.

**Step 5 — Trace an overflowing subtraction.** `6 - (-3) = 9`, which does not fit in 4 bits. `A = 0110`, `B = 1101`, so `B' = 0010` and `Cin = 1`:

```text
  0110 + 0010 + 1 = 1001  ->  result 1001 = -7 , Cout = 0 , Cin(MSB) = 1
  V = Cout XOR Cin(MSB) = 0 XOR 1 = 1   -> OVERFLOW
```

The true answer `+9` exceeds `+7`, and the hardware reports `-7`. That is why the flag exists.

**Example question:** An adder/subtractor has `A = 1001`, `B = 0101`, `SUB = 1`, 4 bits. Compute the result, the carry out, and the overflow flag, and interpret the answer.

**Solution:**

- Step 1: `SUB = 1`, so every bit of `B` is inverted: `B' = 1010`. Reason: the XORs invert when `SUB = 1`.
- Step 2: `Cin` of the lowest column is `SUB = 1`. Reason: that supplies the "+1" of two's complement.
- Step 3: column 0: `1+0+1 = 2` -> `S0 = 0`, carry 1. Column 1: `0+1+1 = 2` -> `S1 = 0`, carry 1. Column 2: `0+0+1 = 1` -> `S2 = 1`, carry 0. Column 3: `1+1+0 = 2` -> `S3 = 0`, carry 1.
- Step 4: result `0100`, `Cout = 1`, and the carry **into** the MSB column was `0` (from column 2).
- Step 5: `V = Cout XOR Cin(MSB) = 1 XOR 0 = 1` -> **overflow**. Reason: `1001` is `-7` and `0101` is `+5`, so the true answer `-7 - 5 = -12` is below the 4-bit minimum `-8`.
- Step 6: interpret: `0100` would read as `+4`, which is wrong; the flag tells the software to widen the arithmetic.

**Final answer:** result `0100`, carry out `1`, overflow `1`; the true answer `-12` does not fit in 4 bits.

⚠️ **Common trap:** Using `Cout` as the overflow flag in signed arithmetic. In the example above `Cout = 1` and there *is* overflow, but in `5 - 3` `Cout = 1` and there is *no* overflow — so `Cout` alone tells you nothing. Second trap: inverting only some of the `B` bits. Third trap: forgetting the `+1` (that is `B'`, one's complement, which is off by one).

## 2.5 Data-routing blocks

### Intuition

A railway junction with several incoming tracks and one outgoing track: a signal decides which train gets through. That is a **multiplexer** (MUX) — a data selector. A **decoder** is the opposite mood: give it a code, and it lights up exactly one of several outputs, like a lift button panel lighting the floor you pressed.

### The idea, step by step

**Step 1 — The 2:1 MUX.** Two data inputs, one select line. `S = 0` passes `I0`; `S = 1` passes `I1`.

| `S` | `Y` |
|-----|-----|
| 0 | `I0` |
| 1 | `I1` |

`Y = S'.I0 + S.I1` — select `I0` when `S` is 0, or `I1` when `S` is 1.

**Meaning:** the expression is "select `I0` when `S` is 0, or `I1` when `S` is 1" — a sum of two products, exactly as in Module 1.8. **When to use:** anywhere one of two sources must reach a destination. **Tiny example:** `I0 = 1, I1 = 0, S = 1` -> `Y = 0'.1 + 1.0 = 0`, i.e. `I1` got through.

**Step 2 — The 4:1 MUX.** Four data inputs, two select bits. Each input is gated by one minterm of the select lines:

```text
  Y = S1'.S0'.I0 + S1'.S0.I1 + S1.S0'.I2 + S1.S0.I3
```

```text
                 ┌────────────────┐
   I0 ───────────┤0               │
   I1 ───────────┤1    4:1 MUX    │
   I2 ───────────┤2               ├────────────── Y
   I3 ───────────┤3               │
   S1 ───────────┤S1  (MSB)       │
   S0 ───────────┤S0  (LSB)       │
                 └────────────────┘
```

| `S1` | `S0` | `Y` |
|------|------|-----|
| 0 | 0 | `I0` |
| 0 | 1 | `I1` |
| 1 | 0 | `I2` |
| 1 | 1 | `I3` |

**Step 3 — The 2-to-4 decoder.** Two inputs, four outputs, and **exactly one output is high** — the one whose index matches the input code. Each output is one minterm of the inputs.

| `A` (MSB) | `B` (LSB) | `Y3` | `Y2` | `Y1` | `Y0` |
|-----------|-----------|------|------|------|------|
| 0 | 0 | 0 | 0 | 0 | **1** |
| 0 | 1 | 0 | 0 | **1** | 0 |
| 1 | 0 | 0 | **1** | 0 | 0 |
| 1 | 1 | **1** | 0 | 0 | 0 |

```text
                 ┌────────────────┐
   A  ───────────┤A (MSB)   2-to-4├──── Y0 = A'.B'
   B  ───────────┤B (LSB)  DECODER├──── Y1 = A'.B
                 │                ├──── Y2 = A.B'
                 │                ├──── Y3 = A.B
                 └────────────────┘
```

**Step 4 — Where each appears in the CPU.** These two blocks are everywhere in Module 5.

| Block | Job in the RISC-V CPU |
|-------|-----------------------|
| MUX | choose ALU result vs memory data to write back; choose `PC+4` vs branch target for the next PC; choose register vs immediate as ALU input `B`; inside the ALU, choose the operation (2.7) |
| Decoder | decode the 7-bit opcode into control signals; decode the 5-bit register address in the register file (Module 4); decode `ALUOp` into the ALU's select lines |

**Example question:** A 4:1 MUX has `I0 = 0, I1 = 1, I2 = 0, I3 = 1`. (a) What is `Y` for `S1S0 = 10`? (b) Write the full Boolean expression and evaluate it for that case to confirm. (c) For a 2-to-4 decoder with `A B = 11`, which output is high?

**Solution:**

- (a) `S1S0 = 10` selects input `I2`, which is 0, so `Y = 0`. Reason: the select code is the index of the chosen input, read as a binary number (`10` = 2).
- (b) `Y = S1'S0'I0 + S1'S0I1 + S1S0'I2 + S1S0I3`. With `S1=1, S0=0`: the first three terms die because `S1' = 0` kills terms 1 and 2, and `S0'` is 1 but `S0` is 0 so terms 1 and 2 also have a 0 factor; specifically term 3 is `1.1.0 = 0` and term 4 is `1.0.1 = 0`. So `Y = 0`. Matches (a).
- (c) `A B = 11` means `Y3 = A.B = 1` and all others 0. Reason: exactly one decoder output is high, the one indexed by the input code.

**Final answer:** (a) `Y = 0`; (b) confirmed by the expression; (c) `Y3` is high.

⚠️ **Common trap:** Swapping `S1` and `S0` (MSB and LSB). `S1S0 = 10` means `S1 = 1, S0 = 0`, which selects `I2` — not `I1`. Second trap: expecting two decoder outputs high at once; a decoder is one-hot by construction, and if two are high there is a wiring bug. Third trap: forgetting that an `n`-to-`2^n` decoder needs `n` select bits, so a 3-to-8 decoder has 8 outputs.

## 2.6 Comparators and other standard blocks

### Intuition

Branches are how a program makes decisions — `beq` (branch if equal) is the `if` of assembly. To decide, the hardware must answer two questions: "are these two numbers the same?" and "which one is bigger?". Both are tiny combinational blocks sitting next to the ALU.

### The idea, step by step

**Step 1 — Equality: XNOR plus AND.** Two bits are equal exactly when they are the same, and that is what XNOR reports. For multi-bit numbers, all bit-pairs must be equal, so AND the XNORs together:

```text
  EQ = (A3 XNOR B3) . (A2 XNOR B2) . (A1 XNOR B1) . (A0 XNOR B0)
```

**Meaning:** `XNOR` is 1 when its two inputs match, so the AND is 1 only when every bit matches. **When to use:** `beq`, `bne`, and equality tests. **Tiny example:** `A = 1011, B = 1011` -> `EQ = 1`; `A = 1011, B = 1010` -> the `b0` pair is `1 XNOR 0 = 0` -> `EQ = 0`. The ALU can also do this by subtraction: `A - B = 0` means equal, which is why the **zero flag** (2.7) doubles as an equality signal.

**Step 2 — Unsigned ordering: subtract and look at the carry out.** Compute `A - B`. With unsigned numbers, `Cout = 1` means no borrow was needed, so `A >= B`; `Cout = 0` means `A < B`.

```text
  unsigned:  A >= B   <=>   Cout(A - B) = 1
             A <  B   <=>   Cout(A - B) = 0
```

**Step 3 — Signed ordering: subtract, then look at the sign — with a correction.** For signed numbers the sign bit of `A - B` says "negative", which means `A < B` — *unless* the subtraction overflowed, in which case the sign is a lie. So:

```text
  LT = sign(A - B)  XOR  V          (V = overflow flag from 2.4)
```

**Meaning:** `sign` is the top bit of the difference; `V` corrects for overflow. **When to use:** `slt`, `blt`, `bge` on signed values. **Tiny example:** `3 - 6 = -3` (`1101`, sign 1, `V = 0`) -> `LT = 1`, so `3 < 6`. Correct.

**Step 4 — Why the correction is not optional.** Take `A = 0110` (6) and `B = 1101` (-3), both 4-bit signed. `A - B = 6 - (-3) = 9`, which overflows. The hardware computes `0110 + 0011 = 1001`, whose sign bit is 1. Read naively, "sign = 1" says `A < B` — but 6 is clearly greater than -3. With the correction, `V = 1`, so `LT = 1 XOR 1 = 0`, correctly saying `A` is not less than `B`.

**Step 5 — The block set you now own:** adder, subtractor, MUX, decoder, equality comparator, magnitude comparator, zero detector. All combinational, and all of them appear in the Module 5 datapath.

**Example question:** 4-bit signed numbers `A = 0110` and `B = 1101`. (a) Are they equal? (b) Compute `A - B`, the overflow flag, and decide whether `A < B` using the corrected rule. (c) What would a naive "look at the sign bit" comparator conclude?

**Solution:**

- (a) Compare bit by bit: `0` vs `1` differ already, so `EQ = 0`. Reason: the XNOR of the MSBs is `0 XNOR 1 = 0`, and an AND with a 0 is 0.
- (b) `SUB = 1` inverts `B = 1101` to `0010` and sets `Cin = 1`. Then `0110 + 0010 + 1`: column 0 `0+0+1 = 1`; column 1 `1+1+0 = 0` carry 1; column 2 `1+0+1 = 0` carry 1; column 3 `0+0+1 = 1` carry 0. Result `1001`, `Cout = 0`, carry into MSB was `1`.
- (b, continued) `V = Cout XOR Cin(MSB) = 0 XOR 1 = 1` -> overflow. Reason: `+6 - (-3) = +9` exceeds `+7`.
- (b, continued) sign of `1001` is 1, so `LT = 1 XOR 1 = 0`: `A` is **not** less than `B`. Correct, since `6 > -3`.
- (c) The naive rule reads sign `= 1` and concludes `A < B`, which is wrong. Reason: it ignores that the difference overflowed the 4-bit range.

**Final answer:** (a) not equal; (b) `1001`, `V = 1`, `LT = 0` so `A > B`; (c) the naive comparator would wrongly say `A < B`.

⚠️ **Common trap:** Using the sign bit alone for signed comparison. It is only valid when `V = 0`. Second trap: mixing signed and unsigned rules — `Cout` works for unsigned, `sign XOR V` for signed; using `Cout` for signed gives nonsense. Third trap: using `EQ` when the question asks for "greater than or equal" — `GE` is `NOT LT`, not `EQ`.

## 2.7 Building a simple ALU

### Intuition

Now put the calculator together. Inside one box: an AND unit, an OR unit, an adder/subtractor, and a "less than" unit — all computing **at the same time**, with a selector at the end choosing which answer to publish. Wasteful? Slightly. But it is fast and simple, which is exactly what a CPU wants.

### The idea, step by step

**Step 1 — The operation select.** A 3-bit `ALUOp` picks the operation. These particular codes are our teaching choice — Module 5 shows the real RISC-V control encoding — and they cover the five operations of the course's instruction subset.

| `ALUOp` | Operation | Result | Used by |
|---------|-----------|--------|---------|
| `000` | AND | `A . B` (bitwise) | `and` |
| `001` | OR | `A + B` (bitwise OR) | `or` |
| `010` | ADD | `A + B` | `add`, `addi`, `lw`, `sw` |
| `110` | SUB | `A - B` | `sub`, `beq` (compare) |
| `111` | SLT | `0001` if `A < B` signed, else `0000` | `slt` |

**Step 2 — The block diagram.** All units are fed in parallel; a 5:1 MUX at the output is controlled by `ALUOp`.

```text
                 ┌──────────────────────────────────┐
   A ───────────►│                                  │
   B ───────────►│   AND ─┐                         │
                 │   OR  ─┼──► [ 5:1 MUX ] ─────────┼──► Result
                 │   ADD ─┤         ▲                │
                 │   SUB ─┤    ALUOp[2:0]            │
                 │   SLT ─┘                         │
                 └──────────────────────────────────┘
```

**Step 3 — SLT is built from the subtractor.** Reuse the subtraction: `A - B`, take its sign bit, XOR with the overflow flag (exactly the rule from 2.6), then zero-extend that single bit to the full width: `0001` or `0000`. No extra arithmetic hardware.

**Step 4 — The zero flag.** `Zero = NOR(Result[3], Result[2], Result[1], Result[0])`, which is 1 when every result bit is 0. This is what makes `beq` work: `beq` subtracts and branches when `Zero = 1`.

**Step 5 — Trace one ALU on real inputs.** `A = 0110` (6), `B = 0011` (3):

| `ALUOp` | Operation | Working | Result |
|---------|-----------|---------|--------|
| `000` | AND | `0110 . 0011` | `0010` |
| `001` | OR | `0110 + 0011` (bitwise) | `0111` |
| `010` | ADD | `0110 + 0011 = 1001` | `1001` |
| `110` | SUB | `0110 + 1101 = 1 0011` -> drop carry | `0011` |
| `111` | SLT | is `6 < 3`? no | `0000` |

Every row is a different operation on the same operands — that is the point of the MUX.

**Example question:** An ALU has `A = 0011` (3) and `B = 0110` (6). Give the result for each `ALUOp` in the table above, including the `Zero` flag for the `SUB` case, and state whether `SLT` should give `0001`.

**Solution:**

- `000` AND: `0011 . 0110` bit by bit -> `0010`. Reason: bitwise AND needs both bits set.
- `001` OR: `0011 + 0110` bitwise -> `0111`. Reason: bitwise OR needs either bit set.
- `010` ADD: `0011 + 0110`: column 0 `1+0=1`; column 1 `1+1=0` carry 1; column 2 `0+1+1=0` carry 1; column 3 `0+0+1=1`. Result `1001`, carry out 0.
- `110` SUB: invert `B` to `1001`, set `Cin = 1`: `0011 + 1001 + 1` -> column 0 `1+1+1=1` carry 1; column 1 `1+0+1=0` carry 1; column 2 `0+0+1=1` carry 0; column 3 `0+1+0=1`. Result `1101`, which is `-8+4+1 = -3`. Correct, since `3 - 6 = -3`.
- `110` Zero flag: `1101` is not all zeros, so `Zero = 0`. Reason: `Zero` is the NOR of all result bits.
- `111` SLT: sign of `1101` is 1, `V = Cout XOR Cin(MSB) = 0 XOR 0 = 0`, so `LT = 1 XOR 0 = 1`. `3 < 6` is true, so the result is `0001`.

**Final answer:** AND `0010`, OR `0111`, ADD `1001`, SUB `1101` (`Zero = 0`), SLT `0001`.

⚠️ **Common trap:** Forgetting that `SLT` must produce a **zero-extended** full-width value (`0001`), not just a single bit, because it flows into a 32-bit register. Second trap: computing the five operations in sequence instead of in parallel — in hardware they are all live at once and the MUX picks one. Third trap: putting the MUX *before* the operations (there would be nothing to select).

## 2.8 Designing a combinational circuit from a specification

### Intuition

A client says "the machine should beep when the sensor code is good". Vague words, no wires. The disciplined flow turns words into a tested circuit in seven fixed steps, and you never have to be clever — you only have to be *careful*. This is the same flow Module 6 will use when you add a new instruction.

### The idea, step by step

**Step 1 — The seven steps.** Write them on the front of your lab notebook:

```text
  1. Specification   : inputs, outputs, widths, exact rule
  2. Truth table     : every input combination, output filled in
  3. Boolean form    : canonical SOP from the F=1 rows
  4. Simplify        : Boolean laws and/or a K-map
  5. Gates           : draw the circuit from the simplified form
  6. Simulate        : build it, drive every input combination
  7. Test            : compare against the truth table; record the result
```

**Step 2 — Worked spec.** "A 3-bit sensor code `A B C` (`A` is the MSB) is *good* if its value is 1, 2, 3 or 5. Codes 0, 4, 6, 7 mean a fault. Output `G = 1` for good codes."

**Step 3 — Truth table (step 2).**

| `A` | `B` | `C` | value | `G` | minterm |
|-----|-----|-----|-------|-----|---------|
| 0 | 0 | 0 | 0 | 0 | — |
| 0 | 0 | 1 | 1 | 1 | `A'B'C` |
| 0 | 1 | 0 | 2 | 1 | `A'BC'` |
| 0 | 1 | 1 | 3 | 1 | `A'BC` |
| 1 | 0 | 0 | 4 | 0 | — |
| 1 | 0 | 1 | 5 | 1 | `AB'C` |
| 1 | 1 | 0 | 6 | 0 | — |
| 1 | 1 | 1 | 7 | 0 | — |

**Step 4 — Canonical SOP (step 3).** `G = A'B'C + A'BC' + A'BC + AB'C`, that is `Σm(1,2,3,5)`.

**Step 5 — Simplify with a K-map (step 4).**

```text
        BC=00  BC=01  BC=11  BC=10
  A=0     0      1      1      1
  A=1     0      1      0      0
```

Three groups. The pair `m3, m2` (columns `11` and `10`, row `A=0`) gives `A'.B`. The vertical pair `m1, m5` (column `BC=01` in both rows) gives `B'.C`. The pair `m3, m1` (columns `01` and `11`, row `A=0`) gives `A'.C`. So:

```text
  G = A'.B + A'.C + B'.C
```

**Step 6 — Check the simplification (a mandatory habit).** `m5 = 101`: `B'.C = 1.1 = 1` -> `G = 1`. `m0 = 000`: all three terms 0 -> `G = 0`. `m4 = 100`: `B'.C = 1.0 = 0` -> `G = 0`. `m6 = 110`: `B'.C = 0.0 = 0` -> `G = 0`. `m7 = 111`: `B'.C = 0.0 = 0` -> `G = 0`. All correct.

**Step 7 — Gates (step 5).** Three 2-input ANDs and a 3-input OR — five 2-input gates if you build the OR as two 2-input ORs.

```text
  A ─[NOT]─ A' ─┐
                ├─[AND]─ A'.B ─┐
  B ────────────┘              │
  A' ───────────┐              ├─[OR]─ q ─┐
                ├─[AND]─ A'.C ─┘           ├─[OR]─ G
  C ────────────┘                          │
  B ─[NOT]─ B' ─┐                          │
                ├─[AND]─ B'.C ─────────────┘
  C ────────────┘
```

**Step 8 — Simulate and test (steps 6 and 7).** Build it, drive all `2^3 = 8` input codes, compare against the table in step 3, and commit only when all eight match — that is the difference between "I think it works" and "it works".

**Example question:** Apply the seven-step flow to this specification: "a 3-bit input `A B C` must output `P = 1` when the value is 0, 3 or 6 (the only valid multiples of 3)." Give the truth table, the canonical SOP, the K-map, and the final expression, and say what the map tells you.

**Solution:**

- Step 1 (spec): inputs `A, B, C` (3 bits, `A` MSB); output `P` (1 bit); `P = 1` for values `0, 3, 6`.
- Step 2 (truth table): rows `000 -> 1`, `001 -> 0`, `010 -> 0`, `011 -> 1`, `100 -> 0`, `101 -> 0`, `110 -> 1`, `111 -> 0`. Reason: values 0, 3, 6 are `000`, `011`, `110`.
- Step 3 (canonical SOP): `P = A'B'C' + A'BC + ABC'`, that is `Σm(0,3,6)`.
- Step 4 (K-map):

```text
        BC=00  BC=01  BC=11  BC=10
  A=0     1      0      1      0
  A=1     0      0      0      1
```

- Step 5 (grouping): `m0`'s neighbours are `m1, m2, m4` — none of them is 1. `m3`'s neighbours are `m1, m2, m7` — none is 1. `m6`'s neighbours are `m2, m4, m7` — none is 1. So there are **no pairs**: every 1 is isolated and the K-map cannot simplify anything.
- Step 6 (final expression): `P = A'B'C' + A'BC + ABC'` — three 3-input ANDs and one 3-input OR, six gates as 2-input parts.
- Step 7 (lesson): a K-map is a *tool*, not a guarantee. When the 1s are not adjacent, nothing merges, and the honest answer is the canonical form. Do not invent a group.

**Final answer:** `P = A'B'C' + A'BC + ABC'`; no grouping is possible, so the canonical SOP is already minimal.

⚠️ **Common trap:** Skipping step 7 (testing) because the circuit "looks right". Second trap: forcing a group that is not adjacent just to make the answer shorter — illegal merges produce a circuit that fails on the untested rows. Third trap: losing track of which bit is the MSB between the spec, the truth table and the map; write `A B C` in the same order everywhere.

## Formula / rule summary table

| Situation | Use this | One-line reason |
|-----------|----------|-----------------|
| simplify 3–4 variables | K-map, groups of `1,2,4,8` | adjacency removes one literal per doubling |
| group wraps round the edge | treat left = right, top = bottom | Gray order makes those cells adjacent |
| add two bits | half adder: `S = A⊕B`, `C = A.B` | 1+1 = `10` |
| add three bits | full adder: `S = A⊕B⊕Cin`, `Cout = A.B + Cin.(A⊕B)` | two or more 1s make a carry |
| add `n` bits | chain `n` full adders, carry leftwards | the carry ripples one column per stage; about `2n` gate delays |
| subtract | invert `B` with XORs, feed `1` into `Cin` | `A - B = A + ~B + 1` |
| detect signed overflow | `V = Cout XOR Cin(MSB)` | the sign is wrong exactly when they differ |
| select one of `2^k` inputs | `2^k`:1 MUX, `k` select bits | the select code is the input index |
| activate one of `2^k` outputs | `k`-to-`2^k` decoder | one-hot by construction |
| test equality | AND of all bitwise XNORs | every bit must match |
| test `A < B` signed | `sign(A-B) XOR V` | the sign lies only when it overflowed |

**Which one when?** Read *"simplify this function"* -> K-map. Read *"build an adder"* -> half adder for one column, full adder for a chain. Read *"can this be done with an adder"* -> yes, invert and add 1. Read *"which input reaches the output"* -> MUX. Read *"which output goes high"* -> decoder. Read *"is A less than B"* -> subtract, then sign `XOR` overflow.

## Solved examples

### Example 1 (easy) — K-map with a wrap-around pair

Simplify `F(A,B,C) = Σm(3,4,6,7)` with a K-map, and verify the result on all eight rows.

**Solution:**

- Step 1: minterms in binary — `3 = 011`, `4 = 100`, `6 = 110`, `7 = 111`. Reason: `A` is the MSB.
- Step 2: fill the map.

```text
        BC=00  BC=01  BC=11  BC=10
  A=0     0      0      1      0
  A=1     1      0      1      1
```

- Step 3: `m3` and `m7` are vertically adjacent in column `BC=11` (A varies, B and C are both 1), giving `B.C`.
- Step 4: `m4` and `m6` sit in row `A=1` at columns `00` and `10` — the two edges of the row, which wrap — giving `A.C'` (`A = 1` and `C = 0` in both, `B` varies).
- Step 5: `F = B.C + A.C'`. Every 1 is covered: `m3` by the first term, `m7` by both, `m4` and `m6` by the second.
- Step 6: verify all eight rows. `000`: `BC=0`, `AC'=0` -> 0. `001`: `BC=0`, `AC'=0` -> 0. `010`: 0. `011`: `BC=1` -> 1. `100`: `AC'=1` -> 1. `101`: `BC=0` (`C=1`), `AC'=0` -> 0. `110`: `AC'=1` -> 1. `111`: `BC=1` -> 1. Matches `Σm(3,4,6,7)` exactly.

**Final answer:** `F = B.C + A.C'` — two 2-input ANDs and one OR, and it needs the wrap-around pair to stay this short.

### Example 2 (easy–medium) — one addition, all the flags

Using a 4-bit adder, compute `0110 + 1011`. Give the sum, the carry out, the overflow flag, and the signed and unsigned readings.

**Solution:**

- Step 1: `0110 = +6` signed and `6` unsigned; `1011 = -5` signed and `11` unsigned. Reason: `1011 = -8+2+1`.
- Step 2: column 0: `0+1 = 1`, carry 0. Column 1: `1+1 = 0`, carry 1. Column 2: `1+0+1 = 0`, carry 1. Column 3: `0+1+1 = 0`, carry 1.
- Step 3: result `0001`, carry out `1`. Reason: the carry left the top column.
- Step 4: signed check `6 + (-5) = 1` matches `0001 = +1`; unsigned check `6 + 11 = 17 = 1 0001`, and the 4-bit truncation `0001 = 1` equals `17 mod 16`. Both correct.
- Step 6: overflow: the operands have **different** signs (`0` and `1`), so `V = 0`. Reason: with different signs the result cannot leave the range.

**Final answer:** sum `0001`, carry out `1`, overflow `0`; signed `+1`, unsigned `1` (the true unsigned sum 17 needs 5 bits).

### Example 3 (medium) — implementing a function with a 4:1 MUX

Implement `F(A,B,C) = Σm(1,2,5,7)` using a single 4:1 MUX with `A, B` as the select lines, and find the four data inputs.

**Solution:**

- Step 1: group the truth table by the select pair `(A,B)`. Reason: the MUX will output whichever data input the select code points at, so each data input must equal `F` for the two remaining `C` values.

| `A` | `B` | `C=0` | `C=1` | data input |
|-----|-----|-------|-------|------------|
| 0 | 0 | `F(0,0,0)=0` | `F(0,0,1)=1` | `I0 = C` |
| 0 | 1 | `F(0,1,0)=1` | `F(0,1,1)=0` | `I1 = C'` |
| 1 | 0 | `F(1,0,0)=0` | `F(1,0,1)=1` | `I2 = C` |
| 1 | 1 | `F(1,1,0)=0` | `F(1,1,1)=1` | `I3 = C` |

- Step 2: read off the minterms. `Σm(1,2,5,7)` means `001, 010, 101, 111` are 1 — so `F(0,0,1)=1`, `F(0,1,0)=1`, `F(1,0,1)=1`, `F(1,1,1)=1`, and the other four are 0. Reason: the minterm index is the binary value of `A B C`.
- Step 3: for `I0` the two rows are `0` and `1`, i.e. exactly `C`; for `I1` they are `1` and `0`, i.e. `C'`; for `I2` and `I3` they are `0` and `1`, i.e. `C`.
- Step 4: verify end to end — `A=0, B=1, C=0` selects `I1 = C' = 1` and `F(0,1,0)` should be 1 (minterm 2); `A=1, B=1, C=0` selects `I3 = C = 0`, matching `F(1,1,0) = 0` (minterm 6 is absent). Both correct.

**Final answer:** `I0 = C`, `I1 = C'`, `I2 = C`, `I3 = C`, with `A, B` as `S1, S0`. Two wires and one inverter — cheaper than a 4-term SOP.

### Example 4 (exam level) — a 2-bit magnitude comparator

Design a combinational block that compares two 2-bit unsigned numbers `A = a1a0` and `B = b1b0` and outputs `GT = 1` when `A > B`. Derive it with a K-map and give the gate count.

**Solution:**

- Step 1 (spec): inputs `a1 a0 b1 b0` (4 bits); output `GT` (1 bit); `GT = 1` iff `A > B`.
- Step 2 (truth table, as minterms): list the six pairs where `A > B`. `(1,0)`, `(2,0)`, `(2,1)`, `(3,0)`, `(3,1)`, `(3,2)`. Reason: for each `A`, `B` must be smaller.
- Step 3 (convert to minterm indices, order `a1 a0 b1 b0`): `(1,0) = 0100 = m4`; `(2,0) = 1000 = m8`; `(2,1) = 1001 = m9`; `(3,0) = 1100 = m12`; `(3,1) = 1101 = m13`; `(3,2) = 1110 = m14`. So `GT = Σm(4,8,9,12,13,14)`.
- Step 4 (K-map, rows `a1a0`, columns `b1b0`):

```text
          b1b0=00  b1b0=01  b1b0=11  b1b0=10
  a1a0=00    0         0         0        0
  a1a0=01    1         0         0        0
  a1a0=11    1         1         0        1
  a1a0=10    1         1         0        0
```

- Step 5 (groups): `m4` pairs with `m12` — a vertical pair in column `00`, since rows `01` and `11` are adjacent — giving `a0.b1'.b0'`. Next, `m8, m9, m12, m13` form a 2x2 block over rows `11, 10` and columns `00, 01`, giving `a1.b1'`. Finally `m14` pairs with `m12` (column `10`, rows `11` and `10` adjacent), giving `a1.a0.b0'`.
- Step 6 (collect): `GT = a0.b1'.b0' + a1.b1' + a1.a0.b0'`.
- Step 7 (verify the tricky rows): `A = 3, B = 2` is `1110` = `m14`, and `a1.a0.b0' = 1.1.1 = 1` -> `GT = 1`. Correct. `A = 3, B = 3` is `1111`, where all three terms are 0 -> `GT = 0`. Correct.
- Step 8 (gate count): three 3-input ANDs and one 3-input OR — 4 gates if 3-input gates exist, otherwise 6 two-input gates. State the library assumption.

**Final answer:** `GT = a1.b1' + a0.b1'.b0' + a1.a0.b0'`, verified on the boundary rows `A = 3, B = 2` and `A = 3, B = 3`.

## Common traps and mistakes

- **Diagonal grouping in a K-map.** Diagonal cells differ in two variables, so the merge is illegal and the circuit fails on rows you never tested.
- **Groups that are not powers of two** (3 or 6 cannot become a term), **or forgetting the wrap-around** — left touches right and top touches bottom, and missing it usually costs a literal.
- **Wrong polarity in a term** — a group where `A = 0` contributes `A'`, not `A` — **or ignoring `Cin` in `Cout` and treating `Cout` as overflow.** The carry out is 1 when at least two of `A, B, Cin` are 1, and signed overflow is `Cout XOR Cin(MSB)` — a different signal.
- **Using one's complement for subtraction.** Flipping without the `+1` gives an answer that is off by one.
- **Swapping MUX select bits.** `S1S0 = 10` selects `I2`, not `I1`.
- **Expecting two decoder outputs high** (a decoder is one-hot), **or comparing signs without the overflow correction** — the sign bit lies exactly when the difference overflowed.
- **Returning a 1-bit `SLT`.** `slt` writes a full-width `0001`/`0000` into the register.
- **Skipping the simulation step.** A K-map that is right on paper still fails on a crossed wire.

## Quick revision box

- ✅ Combinational = output depends only on present inputs: no clock, no memory, no feedback. Anything that remembers is sequential.
- ✅ A K-map is a folded truth table in **Gray order**, so adjacent cells differ in one variable; groups of `2^k` remove `k` literals; edges wrap.
- ✅ Half adder: `S = A⊕B`, `C = A.B`. Full adder: `S = A⊕B⊕Cin`, `Cout = A.B + Cin.(A⊕B)`.
- ✅ Chain full adders into a ripple-carry adder; the carry walks left one column at a time, so an `n`-bit adder waits about `2n` gate delays.
- ✅ Subtract = invert `B` with XORs and feed `1` into `Cin`: `A - B = A + ~B + 1`. Overflow `V = Cout XOR Cin(MSB)`.
- ✅ MUX selects one of many inputs by its select code; a decoder turns a code into exactly one high output. Equality = AND of bitwise XNORs; signed `A < B` = `sign(A-B) XOR V`.
- ✅ The ALU computes AND, OR, ADD, SUB and SLT in parallel and a MUX driven by `ALUOp` publishes one; `Zero` is the NOR of all result bits.

## Practice questions

1. Simplify `F(A,B,C,D) = Σm(0,1,4,5,8,9,12,13)` with a K-map and name the single term you get.
2. A full adder has `A = 1, B = 0, Cin = 1`. Give `S` and `Cout`, and say what three-bit count they represent.
3. A 4-bit adder/subtractor has `A = 1010`, `B = 0011`, `SUB = 1`. Give the result, the carry out and the overflow flag.
4. A 4:1 MUX has `I0 = 1, I1 = 0, I2 = 1, I3 = 1` and `S1S0 = 01`. Give `Y`, and give the value of the third product term in the MUX expression for that select code.
5. Design a 1-bit "greater than" output `G = A > B` for two 1-bit unsigned inputs, using a K-map if helpful, and then say how you would chain four such blocks plus equality signals to compare 4-bit numbers.
6. An ALU has `ALUOp = 110`, `A = 1000`, `B = 0001`, 4 bits. Give the result, the overflow flag, and the `Zero` flag.

## Answers

**A1.** Minterms `0,1,4,5,8,9,12,13` are exactly the rows where `C = 0` and `D = 0`. On the map they form the two left columns `CD = 00` and `CD = 01` across all four rows, a group of 8, so `F = C'`. Check `m6 = 0110`: `C = 1`, so `F = 0`, and 6 is not in the list. Correct.

**A2.** `S = A⊕B⊕Cin = 1⊕0⊕1 = 0`; `Cout = A.B + Cin.(A⊕B) = 0 + 1.1 = 1`. Together `Cout S = 10` = 2, and indeed `1+0+1 = 2`.

**A3.** `SUB = 1` inverts `B = 0011` to `1100` and sets `Cin = 1`. Column 0: `0+0+1 = 1`; column 1: `1+0+0 = 1`; column 2: `0+1+0 = 1`; column 3: `1+1+0 = 0` carry 1. Result `0111`, `Cout = 1`, carry into MSB was `0`, so `V = 1 XOR 0 = 1` — overflow. Check: `1010 = -6`, `0011 = 3`, and `-6 - 3 = -9` is below the 4-bit minimum `-8`.

**A4.** `S1S0 = 01` selects `I1 = 0`, so `Y = 0`. The third product term is `S1.S0'.I2 = 0.1.1 = 0`, because `S1 = 0` kills it. (Only the second term, `S1'.S0.I1 = 1.1.0 = 0`, is "selected" here, and it is 0 because `I1 = 0`.)

**A5.** For 1-bit inputs, `G = A.B'` (only `A=1, B=0` gives `G=1`). To compare 4-bit numbers, build a 1-bit slice per bit producing `gt_i`, `eq_i` and `lt_i` (`gt = a.b'`, `eq = a XNOR b`, `lt = a'.b`), then combine from the MSB down: `GT = gt3 + eq3.gt2 + eq3.eq2.gt1 + eq3.eq2.eq1.gt0`, i.e. "the first bit where they differ decides, and if all bits are equal the numbers are equal". This is a standard priority chain and matches how RISC-V's `slt` result is produced.

**A6.** `ALUOp = 110` is SUB: invert `B = 0001` to `1110`, set `Cin = 1`. Column 0: `0+0+1 = 1`; column 1: `0+1+0 = 1`; column 2: `0+1+0 = 1`; column 3: `1+1+0 = 0` carry 1. Result `0111`, `Cout = 1`, carry into MSB `0`, so `V = 1`. Check: `1000 = -8`, `0001 = 1`, and `-8 - 1 = -9` overflows the 4-bit range. `Zero = 0` because `0111` is not all zeros.
