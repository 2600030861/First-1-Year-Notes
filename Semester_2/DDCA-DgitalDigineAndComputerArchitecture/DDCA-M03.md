# DDCA – Module 3
## Remembering & Keeping Time: Sequential Logic
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

Everything in Module 2 was a calculator with amnesia. Give the ALU `3` and `5`, it says `8`; take the inputs away and the `8` never existed. A CPU cannot work like that — it must remember which instruction it is on, what sits in `x5`, whether a branch was taken, and it must *step*, one thing after another, forever. So this module answers two questions: **how do we make a circuit hold a value?** and **how do we make it change only at a controlled moment?**

Analogy: a railway signal box. The lever frame is combinational logic — pull a lever, points move. But the box also *remembers* which train is where, and a station clock says "now is the moment to update"; without it, two signalmen pulling levers at random derail trains.

Where you use it: the register file (M4), the program counter, the control unit (M5). This is where the machine stops being a calculator.

## Basics you must know first

- **NAND / NOR**: `NAND(a,b) = 0` only when both are 1; `NOR(a,b) = 1` only when both are 0. Latches are built from these, so know them cold.
- **Truth table**: `n` inputs -> `2^n` rows. **Combinational circuit**: output depends only on present inputs — no feedback, no memory.
- **2:1 multiplexer**: `Y = S ? B : A`. The hardware `if`, used constantly below.
- **Propagation delay `t_pd`**: time a gate needs after its input changes. The villain of 3.3.

## 3.1 The need for state and feedback

### Intuition
A light switch "remembers" because its *position* is the state. A doorbell button does not — press it, it rings; release, nothing. The difference is a loop: to hold a value, a circuit's own output must feed back into its own input. Combinational logic forbids loops by definition, so memory means breaking that rule on purpose.

### The idea, step by step
**1. Why combinational logic cannot remember.** `out = A AND B`. Set `A=1,B=1` -> `out=1`; set `B=0` -> `out=0`, and the `1` is gone. The value lived only as a voltage pattern tied to the input.

**2. The simplest memory — two inverters in a ring.**

```
   +-->[ NOT ]--Q-->[ NOT ]--+
   +--------------------------+
```

The second inverter outputs `NOT Q`, which the first turns back into `NOT(NOT Q) = Q`. Both `Q=0` and `Q=1` satisfy this: two stable solutions = **bistable** = one stored bit. (Three inverters would give `Q = NOT Q`, which has *no* solution — the ring oscillates. So even inversions -> memory, odd -> a clock, which is how crystal oscillators work.)

**3. Feedback makes an equation "sticky".** Take `Q = A OR Q`. If `A=1` then `Q = 1 OR Q = 1`, forced. If `A=0` then `Q = 0 OR Q = Q`, true for either value — so the circuit keeps what it had. Pulse `A` high once and `Q` stays 1. In general the rule for any state-holding circuit is `Q(t+1) = f( inputs(t), Q(t) )`: the next state depends on the present state, not just the inputs.

**Example question:** A circuit computes `Q = A OR Q` with feedback. (a) Show `A=0` holds. (b) From `Q=0`, trace `A = 0,1,0,0`. (c) Why is this not yet a usable one-bit memory?

**Solution:**

Step 1 — substitute `A=0`: `Q = 0 OR Q = Q` by the identity law, so any `Q` satisfies the equation and the loop preserves it. Hold confirmed.

Step 2 — trace with `Q(t+1) = A OR Q(t)`:

| step | A | Q(t) | `A OR Q(t)` | Q after |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 |
| 2 | 1 | 0 | 1 | 1 (set) |
| 3-4 | 0 | 1 | 1 | 1 (hold) |

Step 3 — part (c): once `Q=1` no input brings it back to 0, because `A=0` holds and `A=1` forces 1. It is a write-1-only "sticky set". A memory must store **both** 0 and 1, which needs a second input — exactly the `R` of the SR latch.

**Final answer:** (a) `Q=Q` when `A=0`, so it holds. (b) `Q = 0,1,1,1`. (c) It can only be set, never cleared, so it cannot store a 0 — half a memory.

⚠️ **Common trap:** Assuming "there is a loop, so it remembers". A loop stores only if both states are self-consistent. Always write the `Q(t) -> Q(t+1)` table and look for a real hold row for **both** `Q=0` and `Q=1`.

## 3.2 Latches and flip-flops

### Intuition
A **latch** is a shop door propped open: while it is open, whatever walks in walks in. A **flip-flop** is a turnstile that clicks once a second: one person through, only at the click. Both store a bit; the difference is *when* they may change — **level-sensitive** (the whole clock-high window) versus **edge-triggered** (one instant).

### The idea, step by step
**1. The SR latch from NOR gates (active-high).** Top NOR takes `R` and `Qbar`, outputs `Q`; bottom NOR takes `S` and `Q`, outputs `Qbar`.

```
   R -->[ NOR ]--+----> Q          top NOR: inputs R, Qbar
        ^        |                bottom NOR: inputs S, Q
        |        v
   S -->[ NOR ]--+----> Qbar       (each output feeds the other gate)
```

**2. Verify all four inputs by hand** (`NOR = 1` only when both inputs are 0):

| S | R | reasoning | result |
|---|---|---|---|
| 0 | 0 | `Q = NOR(0,Qbar) = Q`; `Qbar = NOT Q` | hold |
| 1 | 0 | bottom NOR sees `S=1` -> `Qbar=0`; top `(0,0)` -> `Q=1` | **SET** |
| 0 | 1 | top NOR sees `R=1` -> `Q=0`; bottom `(0,0)` -> `Qbar=1` | **RESET** |
| 1 | 1 | both NORs see a 1 -> `Q=Qbar=0` | **FORBIDDEN** |

**3. Why `S=R=1` is forbidden.** `Q=Qbar=0` breaks the promise that the outputs are complements, so anything reading `Qbar` gets garbage. Worse, when both inputs return to 0 together, both NOR gates want to output 1 and the winner is decided by mismatched gate delays — a **race**. An unpredictable final state is not a valid state.

**4. Characteristic table and equation.**

| S | R | Q(t+1) |
|---|---|---|
| 0 | 0 | `Q(t)` |
| 0 | 1 | 0 |
| 1 | 0 | 1 |
| 1 | 1 | undefined |

```
Q(t+1) = S + R' . Q(t)          subject to  S . R = 0
```

**Meaning**: `S` sets, `R` resets, `'` is NOT, `.` is AND, `+` is OR; `S.R = 0` is the formal "never both". **When to use**: to get the next state from inputs when deriving equations. **Tiny example**: `S=0,R=0,Q=0` -> `0 + 1.0 = 0` hold; `S=1,R=0` -> `1 + 1.Q = 1` set; `S=0,R=1` -> `0 + 0.Q = 0` reset.

**5. The NAND SR latch (active-low).** Same cross-coupling with NANDs: top takes `Sbar, Qbar` -> `Q`; bottom takes `Rbar, Q` -> `Qbar`.

| Sbar | Rbar | reasoning | result |
|---|---|---|---|
| 1 | 1 | `Q = NOT Qbar`, `Qbar = NOT Q` | hold |
| 0 | 1 | top NAND has a 0 -> `Q=1`; bottom `(1,1)` -> `Qbar=0` | **SET** |
| 1 | 0 | bottom NAND has a 0 -> `Qbar=1`; top `(1,1)` -> `Q=0` | **RESET** |
| 0 | 0 | both NANDs output 1 -> `Q=Qbar=1` | **FORBIDDEN** |

```
Q(t+1) = Sbar' + Rbar . Q(t)      subject to  Sbar + Rbar = 1
```

Check: `(0,1)` -> `1 + 1.Q = 1` set; `(1,0)` -> `0 + 0 = 0` reset; `(1,1)` -> `0 + 1.Q = Q` hold. The NAND latch is the NOR latch with every signal inverted, so "both 1 forbidden" becomes "both 0 forbidden".

**6. The D latch: make the invalid state impossible.** Feed one data input into both sides with `S = D'`, `R = D`, so `S.R = D'.D = 0` always; add an enable with `Sbar = NAND(D,EN)`, `Rbar = NAND(D',EN)`. Then `EN=0` gives `Sbar=Rbar=1` (**hold**, `D` ignored), and `EN=1` gives `Sbar=D'`, `Rbar=D`, so `D=1` -> `(0,1)` set, `D=0` -> `(1,0)` reset, i.e. `Q=D`.

```
Q(t+1) = EN . D + EN' . Q(t)      table:  EN=0 -> Q(t);  EN=1 -> D
```

**Meaning**: enabled -> take `D`; else keep `Q`. It is a 2:1 mux with `D` and `Q` as inputs. **When to use**: the standard "load" element and the guts of a register. **Tiny example**: `EN=0, D=1, Q=0` -> `0 + 1.0 = 0`, holds 0 and ignores `D`. While `EN=1` the latch is **transparent**: change `D`, `Q` follows at once.

**7. The D flip-flop: master-slave, edge-triggered.** `D -->[master D latch, EN=CLK']--Qm-->[slave D latch, EN=CLK]--> Q`. With `CLK=0` the master tracks `D` and the slave holds. At the rising edge the master freezes the value sampled *at that instant* and the slave copies it. During `CLK=1` the master ignores `D`. So `Q` changes only on the rising edge, where `Q(t+1) = D`.

**8. Level-sensitive vs edge-triggered, drawn.** 16 slots, period 8 (high 4, low 4), rising edges at slots 4 and 12. `_`=0, `-`=1, two characters per slot.

```
CLK     ________--------________--------
D       ________--__--__----______----__
Qlatch  ________--__--____________----__
Qff     ________________--------________
        ____^____________^____   <- rising edges (slots 4 and 12)
```

Decoded: `D` over the 16 slots is `0,0,0,0,1,0,1,0,1,1,0,0,0,1,1,0`. While `CLK=1` the latch copies `D` every slot, so at slots 4-7 it runs `1,0,1,0`; while `CLK=0` it holds. The flip-flop looks at `D` only at slots 4 and 12 (`D=1` then `D=0`), so `Q` rises at slot 4 and falls at slot 12 and the wiggles between are invisible. **The latch changed 6 times; the flip-flop twice — and both changes are perfectly predictable.** Symbols: a latch shows `EN -->|>`; a flip-flop shows a small triangle at the clock pin, and a circle there means falling-edge triggered.

### Formula / rule / table

```
Q(t+1) = S + R' . Q(t)   (NOR, S.R = 0)      Q(t+1) = Sbar' + Rbar . Q(t)   (NAND, Sbar+Rbar = 1)
Q(t+1) = EN . D + EN' . Q(t)   (D latch)     Q(t+1) = D   (D flip-flop, at the edge)
```

**Example question:** A NOR SR latch starts at `Q=0`.**Example question:** A NOR SR latch starts at `Q=0`. Inputs: `(1,0)`, `(0,0)`, `(0,1)`, `(0,0)`, `(1,1)`, `(0,0)`. Give `Q` after each and identify the illegal step.

**Solution:**

Step 1 — rule: `Q(t+1) = S + R'.Q(t)`, valid only while `S.R = 0`. Apply it:

| step | S | R | `S + R'.Q` | Q after |
|---|---|---|---|---|
| 1 | 1 | 0 | `1 + 1.0 = 1` | 1 (set) |
| 2 | 0 | 0 | `0 + 1.1 = 1` | 1 (hold) |
| 3 | 0 | 1 | `0 + 0.1 = 0` | 0 (reset) |
| 4 | 0 | 0 | `0 + 1.0 = 0` | 0 (hold) |
| 5,6 | 1,0 | 1,0 | `S=R=1` broken, then both gates race | `Q=Qbar=0`, then **indeterminate** |

Step 2 — cross-check against the characteristic table: `(1,0)`->1, `(0,0)`->hold, `(0,1)`->0, `(0,0)`->hold. Agrees.

Step 3 — at step 5 the outputs are not complements. At step 6 each NOR gate sees `(0,0)` and wants to output 1; the faster gate wins, decided by transistor mismatch and temperature, not by the inputs.

**Final answer:** `Q = 1,1,0,0`, then invalid, then **indeterminate**. Step 5 is illegal — which is exactly why the D latch exists.

⚠️ **Common trap:** Mixing up the polarities. NOR latch: active-high, forbidden `S=R=1`, outputs go `0,0`. NAND latch: active-**low**, forbidden `Sbar=Rbar=0`, outputs go `1,1`. Write "NAND = active-low, forbidden is both-0" at the top of your answer sheet before you start.

## 3.3 The clock and synchronous design

### Intuition
Imagine 500 people editing one shared document with no coordination. Chaos. Now say everyone may type only in the half-second after a bell, and must stop before the next bell. It works — changes land in a well-defined order and nobody reads a half-finished sentence. That bell is the **clock**; that rule is **synchronous design**. The clock is a square wave with **period** `T` seconds and **frequency** `f = 1/T` hertz; a 3 GHz CPU has `T = 0.333 ns`.

### The idea, step by step
**1. The problem.** `D -->[FF1]--A-->[ logic, delay t ]--B-->[FF2]--> Q`, both on one clock. At the edge `A` changes; `B` takes `t` seconds to settle. A level-sensitive `FF2` would sample `B` mid-ripple and follow it again — capturing half-settled bits, and different bits at different moments. That is a **race**, and it produces garbage.

**2. The fix.** Make `FF2` edge-triggered: it looks at `B` only at the edge, then ignores it. The only requirement is *"`B` has settled before the next edge"*. Every flip-flop then sees a correct stable value at the same instant and the system advances one clean step per clock. Correctness collapses to one inequality instead of infinitely many race scenarios — that is the payoff.

**3. Setup and hold time.** A real flip-flop needs `D` stable for a window around the edge: **setup time `t_su`** = stable for `t_su` *before* the edge; **hold time `t_h`** = stays stable for `t_h` *after*.

```
              |<-- t_su -->|<-- t_h -->|
   CLK  ______/^^^^^^^^^^^^^^^^^^^^^^^^\______
                 ^ rising edge = sampling instant
   D    XXXXXXXX=====================XXXXXXXX
                 ^                   ^
          X = don't care     = = data must be stable here
```

The window `[edge - t_su, edge + t_h]` is the **aperture**: data must not change inside it.

**4. The two inequalities.** For `FF1 -> logic -> FF2`:

```
setup:  T >= t_cq + t_pd(max) + t_su + t_skew
hold:   t_cq + t_pd(min)      >= t_h + t_skew
```

**Meaning**: `t_cq` is clock-to-Q (how long after the edge `Q` moves), `t_pd` the gate chain, `t_skew` the clock arrival difference. **When to use**: setup gives the **maximum frequency** (the longest such chain is the **critical path**); hold confirms nothing captures already-updated data. **Tiny example**: `t_cq=0.2`, `t_pd=1.5`, `t_su=0.1`, `t_skew=0.05` ns -> `T >= 1.85 ns`, `f <= 540.5 MHz`. Note the hold inequality has **no `T`** — so slowing the clock cannot fix a hold violation.

**5. What violation looks like: metastability.** If `D` moves inside the aperture, the internal latch is asked "0 or 1?" while the input is halfway. It can balance on the fence for an unpredictable time, then fall either way — sometimes a cycle late, sometimes *differently* for neighbouring bits of the same value. No software fixes this. Cures: pass asynchronous inputs through **two back-to-back flip-flops** (a synchroniser), and keep the period generous.

**6. The discipline.** All state in edge-triggered flip-flops on one clock; everything updates on the same edge; logic settles between edges; correctness = critical path shorter than `T`. Raw loops are never used outside these standard cells.

**Which one when?** "Maximum clock frequency", "how fast can this run", "critical path" -> setup check. "Hold violation", "data arrives too early", "race" -> hold check. Typical values on a modern chip: `T = 0.33 ns` (3 GHz), `t_cq` 50-300 ps, `t_su` 20-150 ps, `t_h` 10-100 ps, `t_skew` 10-100 ps.

**Example question:** A single-cycle datapath has `t_cq = 0.4 ns`; the critical path runs through instruction memory (`2.0 ns`), register file (`1.0 ns`), ALU (`2.0 ns`), data memory (`2.0 ns`), with `t_su = 0.1 ns`, `t_skew = 0.1 ns`. (a) Minimum period? (b) Maximum frequency? (c) If pipelining makes every stage at most `2.0 ns`, the new frequency?

**Solution:**

Step 1 — setup equation `T >= t_cq + t_pd(max) + t_su + t_skew`: data launched at one edge must cross the flip-flop, the whole logic path, and still meet setup before the next edge, with skew margin.

Step 2 — the critical path is the `lw` path (PC -> instruction memory -> register file -> ALU -> data memory): `t_pd(max) = 2.0 + 1.0 + 2.0 + 2.0 = 7.0 ns`.

Step 3 — substitute: `T >= 0.4 + 7.0 + 0.1 + 0.1 = 7.6 ns`, so `f = 1/7.6e-9 = 131.6e6` -> `131.6 MHz`.

Step 4 — pipelined: longest stage `2.0 ns`, so `T >= 0.4 + 2.0 + 0.1 + 0.1 = 2.6 ns`, `f = 1/2.6e-9 = 384.6 MHz`. Sanity check: `7.6/2.6 = 2.92x`, not 3.5x, because the fixed `0.6 ns` of register overhead does not shrink — which is why deep pipelining has diminishing returns.

**Final answer:** (a) `7.6 ns`; (b) `131.6 MHz`; (c) `2.6 ns` and `384.6 MHz`, about 2.9x faster.

⚠️ **Common trap:** Thinking a slower clock fixes a hold violation — the hold inequality contains no `T`. And do not add `t_pd` for *every* block: only the longest single path between two flip-flops counts.

## 3.4 Registers

### Intuition
A **register** is a row of flip-flops that all change together — a combination lock whose `n` wheels turn as one. You would never want wheel 2 updating while wheel 4 still spins, which is why they share one clock edge. And most of the time you want it to sit still, so it needs a **load enable**.

### The idea, step by step
**1. `n` bits, one clock.** A 4-bit register is four D flip-flops sharing `CLK`. On the rising edge all four capture at once, so the value appears atomically — no partial updates ever.

**2. The load enable.** Without it the register grabs a new value every clock, which is useless. Put a 2:1 mux in front of each flip-flop: `D_ff = EN ? D_in : Q`. `EN=1` loads; `EN=0` feeds the register its own output so it holds. That mux-per-bit is the universal register idiom.

**3. ASCII 4-bit register.** `EN` drives all four muxes: `0` = hold (`Q` fed back), `1` = load `D`.

```
   bit 3:  D3 -->[MUX]--> [>FF] --> Q3 --+   (Q3 feeds back to MUX input 0)
   bit 2:  D2 -->[MUX]--> [>FF] --> Q2 --+
   bit 1:  D1 -->[MUX]--> [>FF] --> Q1 --+
   bit 0:  D0 -->[MUX]--> [>FF] --> Q0 --+
   CLK --> all four flip-flops, same rising edge;  EN --> all four muxes
```

**4. Control table and worked trace.** Start `0101`; edges `(EN,D) = (1,1110)`, `(1,1000)`, `(0,0000)`, `(1,0110)`, `(0,1111)`.

| edge | EN | D | Q after | why |
|---|---|---|---|---|
| 0 | - | - | 0101 | initial |
| 1 | 1 | 1110 | 1110 | load |
| 2 | 1 | 1000 | 1000 | load |
| 3 | 0 | 0000 | 1000 | hold, `D` ignored |
| 4 | 1 | 0110 | 0110 | load |
| 5 | 0 | 1111 | 0110 | hold |

So the control rule is simply: `EN=0` -> hold at any edge; `EN=1` -> load on the rising edge only; a falling edge never does anything.

**5. Why it matters.** `EN` is the ancestor of `RegWrite` in the RISC-V register file (M4) and of `Load` on the program counter (3.6). Everywhere a value is stored there is a "should I store now?" signal.

**Example question:** A 4-bit register with load enable starts at `Q = 0101`. Rising edges 1-5 carry `(EN,D) = (1,1110)`, `(1,1000)`, `(0,0000)`, `(1,0110)`, `(0,1111)`. Give `Q` after each edge and how many bits change at edge 4.

**Solution:**

Step 1 — rule: `Q(t+1) = D` if `EN=1` at the edge, else `Q(t)`. Walking the edges:

| edge | EN | D | Q after | bits changed |
|---|---|---|---|---|
| start | - | - | 0101 | - |
| 1 | 1 | 1110 | 1110 | 3 |
| 2 | 1 | 1000 | 1000 | 3 |
| 3 | 0 | 0000 | 1000 | 0 |
| 4 | 1 | 0110 | 0110 | 3 |
| 5 | 0 | 1111 | 0110 | 0 |

Step 2 — verify edge 4: `1000 -> 0110`; bit3 `1->0` changed, bit2 `0->1` changed, bit1 `0->1` changed, bit0 `0->0` same -> three changes.

Step 3 — verify edge 1 for practice: `0101 -> 1110`; bit3 changed, bit2 same, bit1 changed, bit0 changed -> 3.

**Final answer:** `Q = 1110, 1000, 1000, 0110, 0110`. At edge 4 exactly **3 bits** change, simultaneously, so the register never holds a garbage mixed value.

⚠️ **Common trap:** Building "naked" flip-flops with no feedback mux. Then the register loads every clock and the value is destroyed one cycle later — the classic "my register is always wrong" simulator bug.

## 3.5 Shift registers

### Intuition
A **shift register** is a bucket brigade: every clock, each flip-flop hands its bit to its neighbour. Two consequences fall out — bits can arrive one at a time and leave all at once (how one wire carries a 32-bit number), and moving every bit one place left multiplies by 2.

### The idea, step by step
**1. Structure (serial in, parallel out).**

```
   serial_in -->[ D Q ]-->[ D Q ]-->[ D Q ]-->[ D Q ]--> serial_out
   CLK --> all four (one clock)     Q3      Q2      Q1      Q0  (parallel out)
```

**2. Next-state equations.** `Q3+ = serial_in`, `Q2+ = Q3`, `Q1+ = Q2`, `Q0+ = Q1`: each bit moves one place towards `Q0` per clock. **When to use**: serial-to-parallel (receiving a byte off a UART/SPI line) or parallel-to-serial (sending one).

**3. Worked serial trace.** Start `0000`, feed `serial_in = 1,1,0,1`.

| edge | in | Q3 | Q2 | Q1 | Q0 |
|---|---|---|---|---|---|
| start | - | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 0 | 0 |
| 2 | 1 | 1 | 1 | 0 | 0 |
| 3 | 0 | 0 | 1 | 1 | 0 |
| 4 | 1 | 1 | 0 | 1 | 1 |

Check edge 3 by hand: before it the register is `1100`; `Q3+=0`, `Q2+=1`, `Q1+=1`, `Q0+=0` -> `0110`. Matches. After 4 edges it holds `1011` — four bits arrived on one wire and now sit on four wires.

**4. Shifting as multiply and divide.** **Left shift by 1** (`<< 1`): bits move up, `0` fills the bottom -> `value * 2`. **Right shift by 1** (`>> 1` signed, `>>> 1` unsigned in Java): bits move down -> `value / 2` rounded down. 4-bit unsigned worked: `1011` = 11. `<< 1` -> `0110` = 6, because `11*2 = 22` and 4 bits hold `0..15`, so `22 mod 16 = 6` — the top bit fell off. `>> 1` -> `0101` = 5, since `11/2 = 5.5` truncated. So a shift register plus a load/shift mux is a 1-bit-per-clock multiplier or divider by 2.

**5. Bidirectional shift register and where this is used.** A 4:1 mux in front of each flip-flop selects hold (`S1S0 = 00`), shift right (`01`), shift left (`10`), or parallel load (`11`). Uses: serial links (UART, SPI, I2C — SPI is literally a shift-register loop); multiply/divide by powers of 2 (`x << 3` is `x * 8`, one gate delay instead of dozens); bit-serial arithmetic (one adder for `n` bits); CRC/checksum hardware (XOR taps, one clock per bit).

**Example question:** A 4-bit SIPO register starts at `0000` with `serial_in = 1,1,1,0,0,0`. (a) Contents after each clock? (b) Parallel output after clock 6? (c) A 4-bit *left* shift register holds `0110` and shifts left twice — value and arithmetic?

**Solution:**

Step 1 — use `Q3+=in, Q2+=Q3, Q1+=Q2, Q0+=Q1`.

| clock | in | Q3 | Q2 | Q1 | Q0 | hex |
|---|---|---|---|---|---|---|
| start | - | 0 | 0 | 0 | 0 | 0x0 |
| 1 | 1 | 1 | 0 | 0 | 0 | 0x8 |
| 2 | 1 | 1 | 1 | 0 | 0 | 0xC |
| 3 | 1 | 1 | 1 | 1 | 0 | 0xE |
| 4 | 0 | 0 | 1 | 1 | 1 | 0x7 |
| 5 | 0 | 0 | 0 | 1 | 1 | 0x3 |
| 6 | 0 | 0 | 0 | 0 | 1 | 0x1 |

Step 2 — check clock 4: before it `1110`; `Q3+=0, Q2+=1, Q1+=1, Q0+=1` -> `0111`. Matches. After clock 6 the parallel output is `0001`: the three 1s marched down and mostly out, since a 4-bit register holds only 4 bits.

Step 3 — part (c): left shift means `Q0+=Q1, Q1+=Q2, Q2+=Q3, Q3+=0`, so `0110` -> `1100` -> `1000`. Arithmetic check: `0110` = 6 and `6*2 = 12` = `1100` ✓; then `12*2 = 24`, but 4 bits max at 15, so `24 mod 16 = 8` = `1000` ✓.

**Final answer:** (a) `1000, 1100, 1110, 0111, 0011, 0001`. (b) `0001`. (c) `1000` = 8; two left shifts multiply by 4, so `6*4 = 24` truncated to 4 bits, losing the top bits.

⚠️ **Common trap:** Losing bits off the end without noticing. `1011 << 1` is `0110`, not `10110` — a 4-bit register cannot hold 5 bits. Also fix the direction first: left = towards MSB = multiply; right = towards LSB = divide.

## 3.6 Counters

### Intuition
A counter is a register that replaces its value with "the next one in a sequence" every clock. The analogy is an **odometer**: the last wheel spins every kilometre, the next moves only when the last rolls over from 9 to 0. That "move only when everything to my right is at maximum" rule *is* the next-state logic of a binary counter. And the punchline: the **program counter is just a counter with a load path**.

### The idea, step by step
**1. Why not ripple.** A naive counter chains `Q0` into the clock of `Q1`, and so on. Delays add up, and mid-ripple the output passes through nonsense values (`0111 -> 1000` passes `0110, 0100, 0000`), so any logic reading it mid-ripple gets garbage. **Synchronous** counters clock *all* flip-flops together and compute each next bit from the present state.

**2. The insight.** In `000,001,010,011,100,101,110,111`: `Q0` toggles every clock; `Q1` when `Q0=1`; `Q2` when `Q1=1` and `Q0=1`. General rule: **bit `i` toggles when all bits below it are 1**, because a carry only reaches position `i` when every lower position rolls over.

**3. State table.** Eight states, all used -> **mod-8**, needing `ceil(log2 8) = 3` flip-flops.

| present `Q2 Q1 Q0` | next `Q2+ Q1+ Q0+` | decimal |
|---|---|---|
| 000 | 001 | 0 -> 1 |
| 001 | 010 | 1 -> 2 |
| 010 | 011 | 2 -> 3 |
| 011 | 100 | 3 -> 4 |
| 100 | 101 | 4 -> 5 |
| 101 | 110 | 5 -> 6 |
| 110 | 111 | 6 -> 7 |
| 111 | 000 | 7 -> 0 |

**4. Next-state logic with D flip-flops.** With D flip-flops `D_i = Q_i+`, so copy the next-state column and simplify.

- `D0`: column `1,0,1,0,1,0,1,0` -> `D0 = Q0'`.
- `D1`: column `0,1,1,0,0,1,1,0`. Test `Q1 XOR Q0` on all eight: `0^0=0`, `0^1=1`, `1^0=1`, `1^1=0`, `0^0=0`, `0^1=1`, `1^0=1`, `1^1=0`. All match -> `D1 = Q1 XOR Q0`.
- `D2`: column `0,0,0,1,1,1,1,0`. Test `Q2 XOR (Q1 AND Q0)`: `0^0=0`, `0^0=0`, `0^0=0`, `0^(1.1)=1`, `1^0=1`, `1^0=1`, `1^(1.0)=1`, `1^(1.1)=0`. All match -> `D2 = Q2 XOR (Q1 AND Q0)`.

Pattern: `D_i = Q_i XOR (Q_{i-1} . ... . Q_0)` — "my own value, flipped if the carry reaches me".

**5. The same design with T flip-flops.** A T flip-flop toggles when `T=1`, so `T` is exactly the toggle condition: `T0 = 1`, `T1 = Q0`, `T2 = Q1 . Q0`. Cleaner, and it shows *why* it works; the D version is what you build in a simulator that has only D flip-flops.

**6. The circuit.**

```
     +--------+      +--------+      +--------+
D2-->|  DFF2  |--Q2->|  DFF1  |--Q1->|  DFF0  |--Q0->
     +--------+      +--------+      +--------+
         ^               ^               +-- inverter(Q0) ----> D0
         |               +-- XOR(Q1,Q0) -------------------> D1
         +-- XOR(Q2, AND(Q1,Q0)) --------------------------> D2
CLK ---> all three flip-flops, same rising edge
```

**7. Verify by simulation.** Java model (a model, not hardware — but it checks the sequence without wiring anything):

```java
public class Counter3 {
    public static void main(String[] args) {
        int q = 0;                              // 3-bit state, starts at 000
        for (int cycle = 0; cycle < 10; cycle++) {
            int d0 = (~q) & 1;                         // D0 = NOT Q0
            int d1 = ((q >> 1) ^ q) & 1;               // D1 = Q1 XOR Q0
            int d2 = ((q >> 2) ^ ((q >> 1) & q)) & 1;  // D2 = Q2 XOR (Q1 AND Q0)
            System.out.println("cycle " + cycle + " : Q = " + q
                               + "   D2D1D0 = " + d2 + d1 + d0);
            q = (d2 << 2) | (d1 << 1) | d0;             // rising edge: Q <- D
        }
    }
}
```

Prints `000/001`, `001/010`, `010/011`, `011/100`, `100/101`, `101/110`, `110/111`, `111/000`, `000/001`, `001/010` for cycles 0-9 (each entry is `Q / D2D1D0`). Read it as a hardware trace: each line shows what the flip-flops *display* and what the logic *computes*; at the edge `Q` becomes the `D` on the same line. Cycle 7 computes `000` and cycle 8 shows it — the wrap-around.

**8. The program-counter pattern.** Each cycle the PC must either move on (`PC + 4`) or jump:

```
PC(t+1) = Load ? Target : PC(t) + 4
   PC_plus4 -->[0]
               [MUX]--> D -->[ PC ]--> PC (to memory)
   Target ---->[1]             [>FF]
   PC_sel ---->(sel)  CLK ---->  ^--- [ PC + 4 adder ] <-- PC
```

One register, one adder, one mux — that is the entire difference between a plain counter and a program counter. Not a special block: just a counter that sometimes listens to something other than its own adder. The `+4` is because RISC-V instructions are 4 bytes and addresses are byte addresses (M4.5 makes that precise).

Design steps: (1) flip-flop count `n = ceil(log2 M)` for `M` states; (2) state table, present -> next, one row per state; (3) with D flip-flops `D_i = Q_i+`, copy the column; (4) with T flip-flops `T_i = Q_i XOR Q_i+`; (5) simplify and verify **every** row; (6) build with a shared clock and one next-state block per bit.

```
D_i = Q_i XOR (Q_{i-1} . ... . Q_0)      D_0 = Q_0'
T_i = Q_{i-1} . ... . Q_0                T_0 = 1
PC(t+1) = Load ? Target : PC(t) + 4
```

**Which one when?** "using D flip-flops" -> copy the next-state column. "using T or JK" -> derive the toggle condition. "how many flip-flops for a mod-M counter" -> `ceil(log2 M)`.

### Formula / rule / table

```
D_i = Q_i XOR (Q_{i-1} . ... . Q_0)      D_0 = Q_0'
T_i = Q_{i-1} . ... . Q_0                T_0 = 1
PC(t+1) = Load ? Target : PC(t) + 4
```

**Example question:** Design a 3-bit synchronous counter counting `000` to `111` and wrapping**Example question:** Design a 3-bit synchronous counter counting `000` to `111` and wrapping, using D flip-flops. (a) State table. (b) `D2, D1, D0`. (c) Verify at `011`. (d) If it drives the PC of a byte-addressed RISC-V machine, what PC follows 5 increments from 0?

**Solution:**

Step 1 — 8 states -> `log2 8 = 3` flip-flops. The state table is the one in step 3 above, built by incrementing in binary and verified row by row against `000..111`.

Step 2 — with D flip-flops `D_i = Q_i+`, so the D columns are the next-state columns: `D0 = 1,0,1,0,1,0,1,0`; `D1 = 0,1,1,0,0,1,1,0`; `D2 = 0,0,0,1,1,1,1,0`. `D0` alternates with `Q0` -> `D0 = Q0'`; `Q1 XOR Q0` matched all eight rows -> `D1 = Q1 XOR Q0`; `Q2 XOR (Q1 . Q0)` matched all eight rows -> `D2 = Q2 XOR (Q1 . Q0)`.

Step 3 — verification at `011`: `Q2=0, Q1=1, Q0=1`. `D0 = Q0' = 0`. `D1 = 1 XOR 1 = 0`. `D2 = 0 XOR (1.1) = 1`. Next state `100`, and the table says `011 -> 100` ✓.

Step 4 — part (d): each increment adds 4, so `0 -> 4 -> 8 -> 12 -> 16 -> 20`; PC = `20` = `0x00000014`. It is `+4` not `+1` because instructions are 4 bytes apart in a byte-addressed machine.

**Final answer:** (a) the 8-row table above. (b) `D0 = Q0'`, `D1 = Q1 XOR Q0`, `D2 = Q2 XOR (Q1 . Q0)`. (c) At `011`, `D = 100` — matches. (d) PC = `20` = `0x14`.

⚠️ **Common trap:** Drawing a ripple counter when the question says *synchronous* — chaining the clock is a different, slower, glitchy circuit and loses marks automatically. Second trap: `D2` must use `Q1` and `Q0`, the *outputs*, never `D1` and `D0`.

## 3.7 Finite State Machines

### Intuition
Think of a **vending machine**. It is in one of a few situations: waiting for money, 25 rupees in, dispensing. Insert a coin -> it moves between situations. At every moment it is in exactly **one** situation, and what happens next depends on that situation plus what you just did. That is a **finite state machine**: a finite set of states, rules for moving between them, and outputs attached. "Finite" is the point — small enough to write as a table, therefore small enough to build in gates. A CPU's control unit is exactly this: "I am in FETCH; the clock ticks, so I go to DECODE and assert `MemRead` and `IRWrite`."

### The idea, step by step
**1. The five ingredients.** **States** (the situations), **inputs** (what the world says), **outputs** (what the machine does), **transitions** (for each state and input, where to go next), and **reset** (which state you start in — without it the machine powers up somewhere random).

**2. State diagram (ASCII) for a `101` detector, Moore style.**

```
               x=0
     +--------------------+
     |        x=1         |
     v                    |
 +-------+ x=1 +-------+  |
 |  S0   |---->|  S1   |  |
 | none  |     |  "1"  |  |
 +-------+     +-------+  |
     ^ x=0         | x=0  |
     |             v      |
     |         +-------+  |
     +---------|  S2   |  |
               | "10"  |  |
               +-------+  |
                   | x=1  |
                   v      |
               +-------+x=1
               |  S3   |--+
               | "101" |
               +-------+
                   | x=0 -> S2
 Y = 1 in S3 only (Moore)
```

From `S0`, a `0` stays, a `1` goes to `S1`. From `S1`, a `0` gives "10" -> `S2`; a `1` stays ("...11" still ends in one 1). From `S2`, a `1` completes the pattern -> `S3`; a `0` gives "...100", nothing useful -> `S0`. From `S3`, a `0` gives "...1010" whose suffix is "10" -> `S2`; a `1` gives "...1011" whose suffix is "1" -> `S1`.

**3. Moore vs Mealy.**

| | Moore | Mealy |
|---|---|---|
| Output depends on | state only | state **and** input |
| Output changes | at clock edges only | can change between edges |
| States for `101` | 4 | 3 |
| Output timing / glitch risk | one cycle later, registered, safe | same cycle, combinational in `x`, can glitch |

Mealy is smaller and faster; Moore is safer and easier to reason about, which is why course designs and most control units use it. A label on a *node* is Moore; a label on an *arrow* is Mealy.

**4. State table.** One row per (state, input) pair:

| present | meaning | `x=0` next | `x=1` next | `Y` |
|---|---|---|---|---|
| S0 | nothing matched | S0 | S1 | 0 |
| S1 | "...1" | S2 | S1 | 0 |
| S2 | "...10" | S0 | S3 | 0 |
| S3 | "...101" | S2 | S1 | 1 |

**5. Check table against diagram.** Arrows: `S0-0->S0`, `S0-1->S1`, `S1-0->S2`, `S1-1->S1`, `S2-0->S0`, `S2-1->S3`, `S3-0->S2`, `S3-1->S1` = 8. Table has `4 x 2 = 8` cells. Match. Always do this count — it catches more errors than anything else.

**6. Why the control unit is an FSM.**

```
   +-------+  +--------+  +---------+  +--------+
   | FETCH |->| DECODE |->| EXECUTE |->| MEM/WB |--+
   +-------+  +--------+  +---------+  +--------+  |
       ^                                          |
       +------------------------------------------+
   each state asserts a fixed set of control signals
   (FETCH: MemRead=1, IRWrite=1, PCWrite=1)
```

Each state is one clock cycle driving a specific control-signal pattern; the "input" is the opcode, which decides whether EXECUTE takes the ALU, load or branch path. Same five ingredients, more rows. For the *single-cycle* CPU in this course the control unit collapses to pure combinational logic (every instruction finishes in one clock), so you will build a **decoder** — but multi-cycle behaviour, pipelining and exceptions all bring the FSM straight back.

**Which one when?** "Output must be glitch-free / registered" -> Moore. "Output must respond in the same cycle" or "fewest states" -> Mealy. "Fixed sequence of steps" -> Moore. "Detect and flag immediately" -> Mealy.

### Formula / rule / table

```
Moore:  k = ceil(log2 S) flip-flops,  Y = f(state bits)
Mealy:  Y = f(state bits, inputs),    states needed = pattern length n  (Moore: n + 1)
```

**Example question:** A Mealy machine detects `01` on a serial input.**Example question:** A Mealy machine detects `01` on a serial input. (a) How many states? (b) State diagram in text. (c) State table. (d) For `0,1,1,0,1`, when is `Y=1`?

**Solution:**

Step 1 — a length-2 pattern needs 2 Mealy states: `A` = nothing useful, `B` = "seen a 0". The output fires on the *transition*, so no separate "matched" state is needed.

Step 2 — diagram:

```
   A --x=0 / Y=0--> B
   A --x=1 / Y=0--> A
   B --x=0 / Y=0--> B     (still "seen a 0")
   B --x=1 / Y=1--> A     (0 then 1 -> match; the 1 starts nothing new)
```

Step 3 — state table:

| present | x | next | Y |
|---|---|---|---|
| A | 0 | B | 0 |
| A | 1 | A | 0 |
| B | 0 | B | 0 |
| B | 1 | A | 1 |

Step 4 — trace `0,1,1,0,1` from `A`:

| position | x | state before | Y | state after |
|---|---|---|---|---|
| 1 | 0 | A | 0 | B |
| 2 | 1 | B | **1** | A |
| 3 | 1 | A | 0 | A |
| 4 | 0 | A | 0 | B |
| 5 | 1 | B | **1** | A |

Step 5 — sanity check: `01` occurs at positions (1,2) and (4,5). Two matches, at 2 and 5 ✓. A Moore version needs 3 states and its output appears one cycle later; worth one line for the extra mark.

**Final answer:** (a) 2 states. (b) 4 arrows above. (c) 4-row table above. (d) `Y=1` at positions **2 and 5**, on the edge where the `1` of each `01` pair arrives.

⚠️ **Common trap:** (1) An **incomplete table** — drop the `x=1` self-loop on `B` and `011` falsely reports a match. (2) **Overlapping vs non-overlapping**: `10101` contains two overlapping matches of `101`; a non-overlapping detector returns one. If the question does not say, assume overlapping and state it. (3) Forgetting the reset state.

## 3.8 Designing a small FSM from a specification

### Intuition
FSM design is a recipe, not inspiration. Once you have it, any English sentence — "flag the LED when the user types 101", "assert `IRWrite` during fetch" — becomes gates mechanically, with a correctness check at every step: **spec -> state diagram -> state table -> encoding -> next-state logic -> output logic -> circuit -> verify.** Skip one and you lose marks.

### The idea, step by step
**1. Specification.** One serial input `x`, one output `Y`; `Y=1` whenever the last three bits received were `1,0,1`; overlapping matches count; start from reset. (Three decisions fixed for us: Moore, overlapping, single clock.)

**2. States, named by the longest useful suffix:** `S0` = nothing useful, `S1` = ends in `1`, `S2` = ends in `10`, `S3` = ends in `101`.

**3. The diagram as an arrow list** (draw the nodes yourself from these): `S0 --0--> S0` (a 0 when nothing matched keeps us nowhere) · `S0 --1--> S1` · `S1 --0--> S2` · `S1 --1--> S1` (self-loop: "...11" still ends in one 1) · `S2 --0--> S0` ("...100", trailing 0s useless) · `S2 --1--> S3` · `S3 --0--> S2` ("...1010" ends in "10") · `S3 --1--> S1` ("...1011" ends in "1"). Eight arrows, `4 x 2 = 8` cells. Complete.

**4. State table.** As in 3.7 step 4: `S0: 0->S0, 1->S1, Y=0`; `S1: 0->S2, 1->S1, Y=0`; `S2: 0->S0, 1->S3, Y=0`; `S3: 0->S2, 1->S1, Y=1`.

**5. Encoding.** 4 states -> `ceil(log2 4) = 2` flip-flops. Natural binary: `S0=00`, `S1=01`, `S2=10`, `S3=11`; bits `A` (MSB), `B` (LSB). Encoding affects gate count, not correctness.

**6. Encoded state table.**

| `A B` | state | `x=0` -> `A+ B+` | `x=1` -> `A+ B+` | `Y` |
|---|---|---|---|---|
| 0 0 | S0 | 0 0 | 0 1 | 0 |
| 0 1 | S1 | 1 0 | 0 1 | 0 |
| 1 0 | S2 | 0 0 | 1 1 | 0 |
| 1 1 | S3 | 1 0 | 0 1 | 1 |

**7. Next-state logic.** `A+ = 1` in rows `(0,1,x=0)`, `(1,0,x=1)`, `(1,1,x=0)`; the last two factor as `A.(B'.x + B.x') = A.(B XOR x)`:

```
A+ = A' . B . x'  +  A . (B XOR x)
B+ = x
```

`B+` is 1 in *every* row with `x=1` and no row with `x=0` — verify: the `x=0` column gives `0,0,0,0`, the `x=1` column gives `1,1,1,1` ✓.

**8. Output logic.** `Y=1` only in `S3 = 11`, Moore: `Y = A . B`.

**9. The circuit.** `D_A = (A' AND B AND x') OR (A AND (B XOR x))`; `D_B = x`; `Y = A AND B`.

```
   x --+-->[NOT]-- x' -->[AND with A,B]-- A'.B.x' --+
       |                                            v
       +------------------------------------------>[OR]--> D of FF A
   A,B -->[AND]-- A.(B^x) --------------------------> ^
   A,x -->[XOR]-- (B^x) --+                          |
                          +-->[AND]-- A.(B^x) --------+
   x ---------------------------------------------> D of FF B   (B+ = x)
   A,B -->[AND]-----------------------------------------> Y   (Y = A.B)
   CLK --> both flip-flops, rising edge.   RESET --> A=0, B=0 (S0)
```

**10. Verify by tracing the bit pattern.** Feed `1,0,1,1,0,1,0,0,1,0,1` through the state table by hand:

| i | x | state before | Y | state after |
|---|---|---|---|---|
| 0 | 1 | S0 | 0 | S1 |
| 1 | 0 | S1 | 0 | S2 |
| 2 | 1 | S2 | 0 | S3 |
| 3 | 1 | S3 | **1** | S1 |
| 4 | 0 | S1 | 0 | S2 |
| 5 | 1 | S2 | 0 | S3 |
| 6 | 0 | S3 | **1** | S2 |
| 7 | 0 | S2 | 0 | S0 |

`Y=1` at `i=3` and `i=6`. Hand-check against `1 0 1 1 0 1 0 0 1 0 1`: bits `i=0..2` = `1,0,1` -> first match, flagged at `i=3` (Moore is one cycle late) ✓; bits `i=3..5` = `1,0,1` -> second match, overlapping (it reuses the `1` at `i=3`), flagged at `i=6` ✓. Now check the equations at `i=3` (state `S3 = 11`, `x=1`): `A+ = A'.B.x' + A.(B XOR x) = 0 + 1.(1 XOR 1) = 0`; `B+ = x = 1` -> `01 = S1` ✓ matches the table. At `i=7` (state `S2 = 10`, `x=0`): `A+ = 1.0.1 + 1.(0 XOR 0) = 0`, `B+ = 0` -> `00 = S0` ✓.

**12. The recipe, written out.**


Deliverable and usual failure, step by step: spec (was "overlapping?" left undecided?) -> diagram (a missing self-loop) -> table (a blank cell) -> encoding (wrong bit count) -> next state (a row simplified away) -> output (a Mealy output written in a Moore table) -> circuit (no reset).

**Example question:** Design a Moore FSM that outputs `Y=1` for one cycle when it has seen two consecutive `1`s (pattern `11`), overlapping allowed, from reset. Full design.

**Solution:**

Step 1 — spec: one input `x`, one output `Y`, Moore, overlapping, reset to "nothing seen". States by longest useful suffix: `S0` = nothing useful, `S1` = ends in one `1`, `S2` = ends in `11` (match). Three states.

Step 2 — arrows: `S0-0->S0`, `S0-1->S1`; `S1-0->S0`, `S1-1->S2`; `S2-0->S0`, `S2-1->S2` (self-loop, so `111` still ends in `11`). Six arrows, `3 x 2 = 6` cells ✓. State table:

| present | `x=0` next | `x=1` next | `Y` |
|---|---|---|---|
| S0 | S0 | S1 | 0 |
| S1 | S0 | S2 | 0 |
| S2 | S0 | S2 | 1 |

Step 3 — encoding: 3 states need 2 flip-flops; `S0=00`, `S1=01`, `S2=10`, and `11` is **unused**. Bits `A` (MSB), `B` (LSB). Give the unused code an explicit next state of `00` — a real engineering habit.

Encoded rows, read straight off the table: `(00,0)->00`, `(00,1)->01`, `(01,0)->00`, `(01,1)->10`, `(10,0)->00`, `(10,1)->10`, `(11,0)->00`, `(11,1)->00`; and `Y` is 1 only in state `10`.

Step 4 — `A+ = 1` in rows `(0,1,x=1)` and `(1,0,x=1)`: both have `x=1` and `A XOR B = 1`, so `A+ = (A XOR B) . x`. `B+ = 1` only in `(0,0,x=1)`, so `B+ = A' . B' . x`. `Y = 1` only in `S2 = 10`, so `Y = A . B'`.

Step 5 — verify all eight rows: `(00,0)` -> `00` ✓; `(00,1)` -> `A+=0, B+=1` -> `01` ✓; `(01,0)` -> `00` ✓; `(01,1)` -> `A+=(0^1).1=1, B+=1.0.1=0` -> `10` ✓; `(10,0)` -> `00` ✓; `(10,1)` -> `A+=(1^0).1=1, B+=0` -> `10` ✓; `(11,0)` -> `00` ✓; `(11,1)` -> `A+=0, B+=0` -> `00` ✓. Every row matches.

Step 6 — trace `0,1,1,1,0,1,1` from `00`:

| i | x | `A B` before | Y | `A B` after |
|---|---|---|---|---|
| 1 | 0 | 0 0 | 0 | 0 0 |
| 2 | 1 | 0 0 | 0 | 0 1 |
| 3 | 1 | 0 1 | 0 | 1 0 |
| 4 | 1 | 1 0 | 1 | 1 0 |
| 5 | 0 | 1 0 | 1 | 0 0 |

Spot-check `i=4`: `A=1,B=0,x=1` -> `A+=(1^0).1=1`, `B+=0.1.1=0`, stays `10` — the self-loop the diagram promised ✓. Spot-check `i=5`: `x=0` -> `A+=0`, `B+=0` -> `00` ✓.

Read `Y` from the *before* column: 1 at `i=4` and `i=5`. Stream `0 1 1 1 0 1 1`: after `i=3` the last two bits are `1,1` -> match, so `Y=1` in cycle 4; at `i=4` the bits are still `1,1` (positions 3,4) -> overlapping match, so `Y` stays 1 in cycle 5; at `i=5` the `0` breaks the run, so `Y=0` from cycle 6. Correct.

**Final answer:** 3 states, 2 flip-flops, `S0=00, S1=01, S2=10`, with

```
D_A = (A XOR B) AND x
D_B = (NOT A) AND (NOT B) AND x
Y   = A AND (NOT B)
```

and reset `A=B=0`. Verified: `Y` is high for each completed pair of consecutive 1s, overlapping correctly.

⚠️ **Common trap:** Leaving the unused state code as a don't-care. With 3 states in 2 bits, `11` is unused; if the hardware picks a next state that loops back into `11`, the machine **locks up** and only a reset recovers it. Write the explicit row. Second trap: reading a Moore output in the same cycle as the last input bit — it appears one cycle *after*. Keep "state before" and "state after" columns in every trace table.

## Formula / rule summary table

| Words in the question | Tool | Key expression |
|---|---|---|
| "hold a value", "memory", "feedback" | latch / flip-flop | `Q(t+1) = f(inputs, Q(t))` |
| "set/reset with two buttons" | SR latch (NOR) | `Q+ = S + R'.Q`, `S.R = 0` |
| "load when enabled, else hold" / "changes only on the clock edge" | D latch / D flip-flop | `Q+ = EN.D + EN'.Q`; at the edge `Q+ = D` |
| "`n`-bit storage with a load signal" | register | one mux per bit, `EN ? D : Q` |
| "move bits one place per clock" / "multiply or divide by 2" | shift register | `Q_i+ = Q_{i-1}`; left `*2`, right `/2` |
| "count 0..M-1" | synchronous counter | `D_i = Q_i XOR (Q_{i-1}...Q_0)` |
| "which instruction is next" | program counter | `PC+ = Load ? Target : PC + 4` |
| "behaviour in steps / a controller" | FSM | state table + next-state logic |
| "how fast can this clock run" | setup check | `T >= t_cq + t_pd + t_su + t_skew` |
| "data arrives too early" | hold check | `t_cq + t_pd(min) >= t_h + t_skew` |
| "how many flip-flops" | encoding | `ceil(log2(states))` |

## Solved examples

### Example 1 (exam level) — timing budget

**Question:** A synchronous design has `t_cq = 0.15 ns`, `t_su = 0.10 ns`, `t_h = 0.05 ns`, `t_skew = 0.08 ns`; the logic between two flip-flops has worst case `0.90 ns` and best case `0.20 ns`. (a) Maximum frequency? (b) Is hold met? (c) A colleague says "hold violation, so drop to 100 MHz" — right?

**Solution:** Step 1 — setup: `T >= 0.15 + 0.90 + 0.10 + 0.08 = 1.23 ns`. Step 2 — `f = 1/1.23e-9 = 813.0e6`, so `813 MHz`. Step 3 — hold: `t_cq + t_pd(min) = 0.15 + 0.20 = 0.35` versus `t_h + t_skew = 0.05 + 0.08 = 0.13`; `0.35 >= 0.13`, **met** with `0.22 ns` margin. Step 4 — part (c): hold is already satisfied so there is nothing to fix, and even if it were violated the hold inequality contains no `T`, so slowing the clock cannot help. Fixes: add delay to the fast path, reduce skew, or use a flip-flop with smaller `t_h`.

**Final answer:** (a) `813 MHz`. (b) Met, margin `0.22 ns`. (c) No — hold violations are independent of clock period.

### Example 2 (exam level) — a counter with a load path

**Question:** Design the next-state logic for a 2-bit counter counting `00,01,10,11` normally, but taking `P1 P0` when `Load=1`. Give equations and structure.

**Solution:** Step 1 — normal counting: `D0 = Q0'`, `D1 = Q1 XOR Q0`. Step 2 — verify all four: `00 -> D0=1, D1=0^0=0` -> `01` ✓; `01 -> D0=0, D1=1^1=0` -> `10` ✓; `10 -> D0=1, D1=1^0=1` -> `11` ✓; `11 -> D0=0, D1=1^1=0` -> `00` ✓. Step 3 — add the load mux per bit:

```
D0 = Load ? P0 : Q0'
D1 = Load ? P1 : (Q1 XOR Q0)

   P1 -->[1]                          P0 -->[1]
          [MUX]--> D1 -->[>FF1]--Q1          [MUX]--> D0 -->[>FF0]--Q0
   cnt1->[0] (Q1 XOR Q0)      |     |  cnt0->[0] (Q0')        |
   Load ----------------------+-----+--------------------------+
```

Step 4 — check load: `Load=1, P1P0=10` -> `D1=P1=1, D0=P0=0` -> `10` ✓ regardless of current state. Check count: `Load=0, Q=11` -> `D1=1^1=0, D0=0` -> `00` ✓.

**Final answer:** `D0 = Load ? P0 : Q0'`, `D1 = Load ? P1 : (Q1 XOR Q0)`. This *is* the program counter of 3.6, with `P` as the branch target and "+1" replaced by "+4" (which needs a real adder rather than a toggle rule).

## Common traps and mistakes

- **Assuming feedback means memory.** A loop stores only if it has two self-consistent stable states. Cost: you "design" a circuit that does not work and cannot say why.
- **Swapping the latch polarities** (NOR: active-high, `S=R=1` forbidden, outputs `0,0`; NAND: active-low, `Sbar=Rbar=0` forbidden, outputs `1,1`), **or treating latch and flip-flop as interchangeable** (a latch is transparent for half a cycle, a flip-flop samples one instant). Cost: an inverted truth table and a whole waveform question.
- **A register with no feedback mux** (loads every clock, value dies a cycle later) **or a ripple counter drawn when "synchronous" is asked for** (slower, glitchy). Cost: hours of debugging, and automatic marks lost.
- **Computing `D_i` from lower-order `D`s.** `D2 = Q2 XOR (Q1 AND Q0)` — never `(D1 AND D0)`. Cost: wrong function and wrong timing.
- **An incomplete state table** (every (state, input) pair needs a row; a missing self-loop is the most common FSM error) **or undefined unused state codes** (they need explicit next states or the machine can lock up). Cost: a machine that is "correct but sometimes freezes".
- **Reading a Moore output in the same cycle as the last input bit**, or thinking a slower clock fixes a hold violation (no `T` in that inequality). Cost: off-by-one in every trace, and a wrong 4-mark answer.
- **Losing bits in a shift register.** `1011 << 1 = 0110`, not `10110`. Cost: a wrong value plus a missed overflow discussion.
- **`ceil(log2 M)` vs `log2 M`.** A mod-10 counter needs 4 flip-flops — not 3, and not 3.32. Cost: cannot represent state 9.

## Quick revision box

✅ **1.** Memory needs feedback. Even inversions in the loop -> bistable (memory); odd -> oscillates (clock). Combinational logic can never hold a value.

✅ **2.** NOR SR latch: active-high, `Q+ = S + R'.Q`, `S.R = 0`; `S=R=1` gives `Q=Qbar=0` then an unpredictable exit. NAND version: active-LOW, forbidden `Sbar=Rbar=0` (both outputs 1).

✅ **3.** D latch: `Q+ = EN.D + EN'.Q`, transparent while `EN=1`. D flip-flop: master-slave, `Q+ = D` at the edge only — level-sensitive vs edge-triggered is the whole difference. **4.** Clock discipline: all flip-flops update on one edge, logic settles in between. Correctness is one inequality: `T >= t_cq + t_pd + t_su + t_skew`. Violations give **metastability**, cured by two-flop synchronisers and adequate period.

✅ **5.** Register = `n` flip-flops + one 2:1 mux per bit: `Q+ = EN ? D : Q`. Shift register = `Q_i+ = Q_{i-1}`; left shifts multiply by 2, right shifts divide by 2, and bits fall off the end. **6.** Synchronous counter: bit `i` toggles when all lower bits are 1 — `D_0 = Q_0'`, `D_i = Q_i XOR (Q_{i-1}...Q_0)`; `T_i = Q_{i-1}...Q_0`. Verify every state-table row.

✅ **7.** PC = counter + load mux: `PC+ = Load ? Target : PC + 4`. The `+4` exists because RISC-V instructions are 4 bytes and addresses are byte addresses. **8.** FSM = states + inputs + outputs + transitions + reset. Moore: output from state (safe, one cycle late). Mealy: output from state and input (smaller, faster, can glitch). `k = ceil(log2 S)` flip-flops; always define unused codes.

## Practice questions

**Q1.** A 4-bit register with load enable holds `Q=1011`. `EN` is `1,0,1,0` on four consecutive rising edges with `D = 0101, 1111, 0011, 0000`. Give `Q` after each edge.

**Q2.** How many flip-flops does a counter with the sequence `000..111,000` need, and how many does a mod-12 counter need? Justify both.

**Q3.** A design has `t_cq = 0.2 ns`, `t_su = 0.1 ns`, `t_h = 0.05 ns`, `t_skew = 0.05 ns`, and a critical path of `1.6 ns`. (a) Maximum frequency? (b) If the path is split into two equal halves by a pipeline register (same `t_cq`, `t_su`), new frequency? (c) Why is the speed-up less than 2x?

**Q4.** Fully design a Moore FSM that outputs `Y=1` for one cycle when the input sequence ends in `00`, overlapping allowed: states, state table, encoding, equations, and a trace of `1,0,0,0`.

## Answers

**A1.** `EN=1` loads, `EN=0` holds. Edge 1: `0101`. Edge 2: hold `0101`. Edge 3: `0011`. Edge 4: hold `0011`. **Final answer: `Q = 0101, 0101, 0011, 0011`.**

**A2.** `000..111` is 8 states -> `ceil(log2 8) = 3` flip-flops. Mod-12 -> `ceil(log2 12) = 4` (3 bits hold only 8). **Final answer: 3 and 4.**

**A3.** (a) `T >= 0.2 + 1.6 + 0.1 + 0.05 = 1.95 ns` -> `f = 512.8 MHz`. (b) Halves of `0.8 ns`: `T >= 1.15 ns` -> `f = 869.6 MHz`. (c) `1.95/1.15 = 1.70x`, not 2x, because the fixed `0.35 ns` register overhead does not shrink. **Final answer: 512.8 MHz, 869.6 MHz, 1.70x.**

**A4.** Step 1 — states: `S0` = nothing (ends in `1` or empty), `S1` = ends in one `0`, `S2` = ends in `00` (match). Three states -> 2 flip-flops.

Step 2 — state table (`S2` self-loops on `x=0` so `000` keeps matching — overlapping):

| present | `x=0` next | `x=1` next | `Y` |
|---|---|---|---|
| S0 | S1 | S0 | 0 |
| S1 | S2 | S0 | 0 |
| S2 | S2 | S0 | 1 |

Step 3 — encoding `S0=00, S1=01, S2=10`; `11` unused -> next state `00`. Bits `A`, `B`. Reading the encoded rows: `(00,0)->01`, `(00,1)->00`, `(01,0)->10`, `(01,1)->00`, `(10,0)->10`, `(10,1)->00`, `(11,x)->00`; `Y` is 1 only in `10`.

Step 4 — `A+ = 1` in rows `(01,x=0)` and `(10,x=0)`, both with `A XOR B = 1` and `x=0`: `A+ = (A XOR B) . x'`. `B+ = 1` only in `(00,x=0)`: `B+ = A' . B' . x'`. `Y = 1` only in `S2 = 10`: `Y = A . B'`.

Step 5 — verify every row: `(00,0)` -> `A+=0, B+=1` -> `01` ✓; `(01,0)` -> `A+=1, B+=1.0.1=0` -> `10` ✓; `(10,0)` -> `A+=1.1=1, B+=0` -> `10` ✓; `(11,x)` -> `00` ✓; all `x=1` rows -> `00` ✓.

Step 6 — trace `1,0,0,0` from `00`:

Trace from `00`: `i=1` (`x=1`) stays `00`, `Y=0`; `i=2` (`x=0`) -> `01`; `i=3` (`x=0`) -> `10`; `i=4` (`x=0`) stays `10` with `Y=1`. So `Y=1` during cycle 4 — after the second `0` is absorbed, exactly "ends in `00`". A third `0` keeps `Y=1` (overlapping), correct.

**Final answer:** 3 states, 2 flip-flops, `S0=00, S1=01, S2=10`, with

```
D_A = (A XOR B) AND (NOT x)
D_B = (NOT A) AND (NOT B) AND (NOT x)
Y   = A AND (NOT B)
```

reset `A=B=0`. Verified on `1,0,0,0` -> `Y` high from cycle 4.
