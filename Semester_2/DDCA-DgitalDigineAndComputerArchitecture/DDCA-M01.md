# DDCA – Module 1
## The Big Picture & the Language of the Machine
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

By the last module of this course you will have built a **CPU** — the chip that actually runs code — inside a simulator. Not a drawing of one, not a diagram in a book: a working machine that fetches instructions, adds numbers, makes decisions and runs a small program. That is the **north star**, and it is set today in section 1.1.

Module 1 does two jobs, in this order. First it **shows you the destination**: we run a complete RISC-V CPU on day one, so every small piece you learn afterwards has somewhere to plug in. Then it **gives you the language**: a computer is built out of two-state switches, and to talk about switches we need binary, two's complement, logic gates and a little Boolean algebra. That is the *entire* vocabulary of the machine — nothing else is hiding under the hood.

One analogy to hold: learning to drive. A good instructor does not start with "here is a spark plug". They let you drive on day one, then teach you the pedals, because now each part has a meaning. Module 1 is exactly that — drive first (1.1), then open the bonnet.

**The chain you should see by the end of this module:**

```text
   a program  ->  instructions  ->  bits (0/1)
                                        |
                                        v
                      Boolean algebra -> logic gates -> circuits
```

Everything in Modules 2 to 6 is that bottom arrow, repeated at larger and larger scale. Get the bottom arrow right and the CPU is just bookkeeping.

## Basics you must know first

- **Decimal place value.** In `347`, the `3` is worth 3 x 100, the `4` is 4 x 10, the `7` is 7 x 1 — each position is ten times the one on its right. Change the base and you have binary and hex.
- **Powers of two.** `2^0=1`, `2^1=2`, `2^2=4`, `2^3=8`, `2^4=16`, `2^5=32`, `2^6=64`, `2^7=128`, `2^8=256`, `2^10=1024`, `2^16=65536`. Learn these; they save you in every exam.
- **Bit, byte, word.** A **bit** is one two-state value (0 or 1). A **byte** is 8 bits. A **word** is the natural chunk a machine works with — 32 bits in RISC-V.
- **True/false logic.** You already met `AND`, `OR`, `NOT` in Mathematics for Computation (T01). Same rules here; only the inputs change (a wire carrying a voltage).
- **What a simulator is.** A program that pretends to be hardware, so you can build a circuit with a mouse and watch wires light up. No physical chips needed.

## 1.1 The north star

### Intuition

Imagine a flight simulator: you have never flown, yet on day one you are in the cockpit holding it level. You do not understand aerodynamics yet — but now aerodynamics has a *purpose*. That is what we do with the CPU today.

### The idea, step by step

**Step 1 — What we run.** We open **Ripes**, a free visual RISC-V simulator. It shows the program, the **register file** (the CPU's small scratch pads), memory, and the **datapath** (the wiring diagram) all at once. We load a tiny program:

```text
# x10 = 0x10010000 ; memory: [0x10010000] = 5 , [0x10010004] = 3
lw   x5, 0(x10)      # x5 <- word at address (x10 + 0)   -> x5 = 5
lw   x6, 4(x10)      # x6 <- word at address (x10 + 4)   -> x6 = 3
add  x7, x5, x6      # x7 <- x5 + x6                     -> x7 = 8
sw   x7, 8(x10)      # store x7 at address (x10 + 8)
```

Read `lw` as "load word" and `sw` as "store word". `x5`, `x6`, `x7`, `x10` are **registers**: named 32-bit storage slots inside the CPU. RISC-V has 32 of them, `x0` to `x31`.

**Step 2 — What we watch.** We press Run, then Step. Two things move:

| Step | Instruction | Program counter (PC) | What changed |
|------|-------------|----------------------|--------------|
| 1 | `lw x5, 0(x10)` | `0x00400000` -> `0x00400004` | `x5` became `0x00000005` |
| 2 | `lw x6, 4(x10)` | `0x00400004` -> `0x00400008` | `x6` became `0x00000003` |
| 3 | `add x7, x5, x6` | `0x00400008` -> `0x0040000C` | `x7` became `0x00000008` |
| 4 | `sw x7, 8(x10)` | `0x0040000C` -> `0x00400010` | memory word 2 became `0x00000008` |

The **program counter (PC)** is the register that says "which instruction is next". It went up by 4 each time because every RISC-V instruction is exactly 4 bytes long — that one fact powers Module 3's counter and Module 5's fetch unit.

**Step 3 — The punchline.** The `5 + 3 = 8` happened inside a block called the **ALU** (Arithmetic Logic Unit). Module 2 builds that block, the registers are Module 4, the PC is Module 3, the wiring is Module 5 — nothing in this course is decoration. **Step 4 — Why "extend".** In Module 6 you will add a *new* instruction (say `xor`): add one entry to the ALU's menu, add a few control signals, test it. That is real architecture work, and it is why the north star says "build **and extend**", not "memorise".

**Example question:** In Ripes, after the four instructions above run, what is the final value of `x7` in binary and in hex, and which block of the CPU produced it? Assume memory holds `5` and `3` as 32-bit words.

**Solution:**

- Step 1: `lw x5, 0(x10)` loads the word at `x10 + 0`, which is `5`. Reason: `lw` copies memory into a register; offset 0 means "no offset".
- Step 2: `lw x6, 4(x10)` loads the word at `x10 + 4`. Since a word is 4 bytes, `+4` is the *next* word, which is `3`.
- Step 3: `add x7, x5, x6` puts `5 + 3 = 8` into `x7`. Reason: `add` reads two registers, sends both to the ALU, writes the result to a third.
- Step 4: convert. `8 = 2^3`, a single `1` in the `2^3` position: `0000 0000 0000 0000 0000 0000 0000 1000`. Group into fours from the right: `0000 1000` -> `0` and `8` -> `0x00000008`.
- The producing block is the **ALU**, because `add` is arithmetic and the ALU is the only arithmetic block in the datapath.

**Final answer:** `x7 = 0b1000 = 0x00000008`, produced by the ALU.

⚠️ **Common trap:** Ripes shows registers in hex, so `0x00000008` is not "eight thousand and eight" — read hex as bit-groups, not as a decimal number. Also, `x7` holding `0x00000008` does not mean the CPU stored the digit "8"; it stores 32 voltage levels.

## 1.2 What is a computer, at the highest level

### Intuition

A kitchen. Ingredients come in (**input**), you follow a recipe (**process**), the fridge holds things (**store**), a dish goes out (**output**). The **cook** is the CPU, the **recipe book** is software, the **kitchen** is hardware. Change the recipe and the same kitchen makes a different dish — that is why one computer runs a game, a browser and a compiler.

### The idea, step by step

**Step 1 — The four jobs.** Every computer, from a ₹300 calculator to a data-centre server, does exactly four things:

| Job | Meaning | In a phone | In the CPU |
|-----|---------|-----------|------------|
| Input | get data in | touchscreen, mic, camera | reads memory or a device |
| Process | transform it | the chip | ALU + control |
| Store | keep it | flash, RAM | registers, memory |
| Output | show the result | screen, speaker | writes memory or a device |

**Step 2 — The CPU is the "brain", but be precise.** The CPU does not *hold* your photos and does not *display* anything. It **reads** data, **transforms** it, and **writes** it back. Everything else is other chips. The CPU is the part that decides *what happens next*, millions of times a second.

**Step 3 — Hardware vs software, without jargon.** Hardware is the part you can touch and cannot change by typing. Software is a list of instructions stored as numbers, which the hardware reads and obeys. The key idea: **software is data** — an instruction is just a 32-bit number sitting in memory. That is why you can download a new program onto the same chip: you are writing new numbers into memory.

**Example question:** A phone plays a song from flash storage through its speaker. Assign each item to input / process / store / output: (a) the flash chip, (b) the speaker, (c) the CPU decoding an instruction, (d) the microphone recording a voice memo.

**Solution:**

- (a) Flash chip = **store**. Reason: it holds bytes and hands them back on request; it does not transform them.
- (b) Speaker = **output**. Reason: it converts an electrical signal into sound, moving data out of the machine.
- (c) Decoding = **process**. Reason: decoding is the CPU working out what an instruction means — transforming control information.
- (d) Microphone = **input**. Reason: sound energy becomes an electrical signal entering the system.

**Final answer:** (a) store, (b) output, (c) process, (d) input.

⚠️ **Common trap:** Saying "the CPU stores the file" — storage is a separate subsystem. Also, "input" means *entering the machine*: a screen is output even though you touch it. Touch is only input when the touch sensor reports a position.

## 1.3 Why digital

### Intuition

You are at a noisy railway station and must pass a 10-digit phone number to a friend 20 metres away. Shouting all ten digits: hopeless, the noise eats it. Instead you ask one **yes/no** question at a time — "is the 4th digit a 7?" — and even through noise, "YES" and "NO" stay distinguishable. That is digital: reduce everything to a choice between two clear states, and each choice can be cleaned up before it is passed on.

### The idea, step by step

**Step 1 — Two states, on purpose.** A wire carries a voltage; we *agree* to call one range `0` and another range `1`. Nothing physical "is" a zero — it is a convention. For a 3.3 V CMOS part the datasheet might publish thresholds like these (illustrative values — always check the real logic family):

| Input voltage at a gate | What the gate is guaranteed to see |
|---|---|
| `0 V` to `0.8 V` | a solid logic `0` (`VIL` = max input low) |
| `0.8 V` to `2.0 V` | **undefined** — may read either way; forbidden zone |
| `2.0 V` to `3.3 V` | a solid logic `1` (`VIH` = min input high) |

```text
 3.3 V ─────────────────────────────  definitely 1
 2.0 V ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  VIH : above this, safe 1
       ░░░░░░ FORBIDDEN ZONE ░░░░░░
 0.8 V ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  VIL : below this, safe 0
   0 V ─────────────────────────────  definitely 0
```

**Step 2 — Noise immunity, the whole point.** Suppose the wire should carry `2.0 V` (a `1`) and noise adds `-0.6 V`, so `1.4 V` arrives. That lands in the forbidden zone — a *design failure*, not a "small error". Good design keeps noise much smaller than the band width. The **noise margin** is the gap between what a gate outputs and what the next gate needs:

```text
 NM_L = VIL - VOL      NM_H = VOH - VIH
```

**Meaning:** `VOL` is the highest voltage a gate outputs for `0`; `VOH` the lowest it outputs for `1`. **When to use:** whenever a signal must survive a long wire or a noisy board. **Tiny example:** if `VOH = 2.4 V` and `VIH = 2.0 V`, then `NM_H = 0.4 V`, so up to 0.4 V of noise on a `1` is harmless.

**Step 3 — Regeneration.** Every gate *outputs a clean value*: if `1.9 V` sneaks in and the gate still reads it as `1`, that gate outputs its own crisp `~3.3 V`. The error does not accumulate down a chain. Compare analog: if each amplifier stage adds 2 % error, after 50 stages the signal is lost. In digital each stage *resets* the error. This is the **digital abstraction** — we stop caring about volts and track only 0/1.

**Step 4 — Where the analogy stops working.** Digital is not "exact". Real wires have rise time, capacitance and delay; a `1` takes time to become a `1`. That is why Modules 3 and 6 care about clocks and timing. Digital buys *robustness against noise*, not immunity from physics.

**Example question:** A 3.3 V logic family has `VIL = 0.8 V`, `VIH = 2.0 V`. A signal meant to be a logic `1` arrives at `1.6 V`. (a) Is it a valid `1`? (b) If a gate outputs `0.35 V` for `0` and the receiver accepts up to `0.8 V` for `0`, what is `NM_L`?

**Solution:**

- (a) `1.6 V` is below `VIH = 2.0 V` and above `VIL = 0.8 V`. Reason: it sits in the forbidden zone, so the gate is **not guaranteed** to read `1` — it may read `1`, may read `0`, may even oscillate. Unreliable.
- (b) `NM_L = VIL - VOL = 0.8 - 0.35 = 0.45 V`. Reason: the output is at most 0.35 V and the input tolerates up to 0.8 V, leaving 0.45 V of noise budget.

**Final answer:** (a) not a valid `1` — forbidden zone; (b) `NM_L = 0.45 V`.

⚠️ **Common trap:** Believing "digital means exactly 0 V and 5 V". Real wires carry anything inside the valid bands. The other trap: thinking more noise margin is free — wider bands mean a bigger voltage swing to switch, which costs speed and power.

## 1.4 Number systems for first-years

### Intuition

Decimal uses ten symbols because we have ten fingers. A wire has two states, so the machine uses two symbols — that is all "binary" means: **base 2 instead of base 10**. Hexadecimal (base 16) is not a new idea, just a *shorthand* so humans never have to read 32 bits of `0101` at a time.

### The idea, step by step

**Step 1 — Positional value in any base.** In base `b`, digits `d3 d2 d1 d0` are worth `d3*b^3 + d2*b^2 + d1*b^1 + d0*b^0`. Same rule as decimal, new base.

**Step 2 — Binary to decimal.** Add the weights where a `1` sits.

```text
  1 0 1 1 0 1        weights 32 16 8 4 2 1
  keep only the 1s:  32 + 8 + 4 + 1 = 45
```

**Step 3 — Decimal to binary: divide by 2 repeatedly,** note each remainder, then read the remainders **bottom to top**.

```text
  45 / 2 = 22 rem 1   <- least significant bit (LSB)
  22 / 2 = 11 rem 0
  11 / 2 =  5 rem 1
   5 / 2 =  2 rem 1
   2 / 2 =  1 rem 0
   1 / 2 =  0 rem 1   <- most significant bit (MSB)
  read upwards: 1 0 1 1 0 1 = 45
```

**Step 4 — Hex, and why it is free.** Base 16 needs 16 symbols, so we borrow `A` to `F`:

| Hex | Binary | Hex | Binary | Hex | Binary | Hex | Binary |
|-----|--------|-----|--------|-----|--------|-----|--------|
| `0` | `0000` | `4` | `0100` | `8` | `1000` | `C` | `1100` |
| `1` | `0001` | `5` | `0101` | `9` | `1001` | `D` | `1101` |
| `2` | `0010` | `6` | `0110` | `A` | `1010` | `E` | `1110` |
| `3` | `0011` | `7` | `0111` | `B` | `1011` | `F` | `1111` |

The reason hex is convenient: `16 = 2^4`, so **one hex digit is exactly four bits**. Group the binary in fours from the right and translate each group independently — no arithmetic, just lookup. A 32-bit word becomes 8 hex digits, which fits on one line of paper.

**Step 5 — Worked conversions both ways.**

```text
  45  -> 0010 1101 (pad 101101 to 8 bits) -> 0010=2, 1101=D -> 0x2D
  0xB7 -> 1011 0111 -> 128 + 32 + 16 + 4 + 2 + 1 = 183
  156  -> 1001 1100 -> 1001 = 9, 1100 = C -> 0x9C
```

The `0x` prefix simply means "the following digits are hexadecimal".

**Example question:** (a) Convert `202` decimal to 8-bit binary and to hex. (b) Convert `0x5E` to decimal.

**Solution:**

- (a) The largest power of two not exceeding 202 is `128`, so bit 7 is 1; remainder `202 - 128 = 74`. Next weight `64 <= 74`, so bit 6 is 1; remainder `74 - 64 = 10`. Then `32 > 10` -> bit 5 = 0, `16 > 10` -> bit 4 = 0, `8 <= 10` -> bit 3 = 1, remainder `2`, `4 > 2` -> bit 2 = 0, `2 <= 2` -> bit 1 = 1, remainder `0`, `1 > 0` -> bit 0 = 0. So `202 = 1100 1010`. Reason: a weight either fits the remainder (bit 1) or does not (bit 0).
- Check: `128 + 64 + 8 + 2 = 202`. Correct.
- Hex: `1100 = 12 = C` and `1010 = 10 = A`, so `0xCA`.
- (b) `0x5E` -> `5 = 0101`, `E = 1110` -> `0101 1110`. Value `= 64 + 16 + 8 + 4 + 2 = 94`. Cross-check with hex weights: `5*16 + 14 = 80 + 14 = 94`.

**Final answer:** (a) `1100 1010` = `0xCA`; (b) `0x5E = 0101 1110 = 94`.

⚠️ **Common trap:** Grouping binary into fours **from the left**. Always group from the **right** (the LSB end) and pad the leftmost group with zeros. Second trap: reading `0x19` as "nineteen" — it is `25`. Third trap: dropping leading zeros when width matters; `0x0F` and `0xF` are the same number but only one is a byte.

## 1.5 Representing numbers the machine uses

### Intuition

A register has 32 bits and no idea what they "mean". The same pattern `1111 1111` can be `255` or `-1`. The bits do not know and do not care — **you** (or the instruction) decide the interpretation. This is the single most important mental shift in the module.

### The idea, step by step

**Step 1 — Unsigned.** All `n` bits are magnitude; the range is `0` to `2^n - 1`.

| Width | Unsigned range | Signed (two's complement) range |
|-------|----------------|-------------------------------|
| 4 bits | `0` to `15` | `-8` to `+7` |
| 8 bits | `0` to `255` | `-128` to `+127` |
| 32 bits | `0` to `4294967295` | `-2147483648` to `+2147483647` |

Signed gives up one magnitude bit to the sign but gains all the negatives: same `2^n` patterns, different split.

**Step 2 — Sign-magnitude, and why we skip it.** The obvious scheme is "top bit is the sign, rest is magnitude". Then `0000` and `1000` both mean zero, and addition needs extra logic to fix up signs. Ugly. We use two's complement instead.

**Step 3 — Two's complement, the definition.** Give the top bit a **negative** weight and every other bit a positive weight:

```text
  value(b3 b2 b1 b0) = -b3*8 + b2*4 + b1*2 + b0*1
```

Check: `1011 = -8 + 0 + 2 + 1 = -5`, and `0111 = 0 + 4 + 2 + 1 = 7`. A useful side effect: `(A')' = A`, invert twice and you are back.

**Step 4 — The "flip bits and add 1" rule.** To negate `x`: invert every bit (one's complement) and add 1. Why it works in one line: for any `n`-bit `x`, `x + (NOT x) = 1111...1 = 2^n - 1`, so `x + (NOT x) + 1 = 2^n`, and keeping only `n` bits makes `2^n` wrap to `0`. Hence `(NOT x) + 1` behaves exactly like `-x`.

```text
  -5 in 4 bits:   5 = 0101  ->  flip = 1010  ->  add 1 = 1011
  check: -8 + 0 + 2 + 1 = -5
```

**Step 5 — Addition and subtraction.** Addition is plain binary addition, discarding any carry out of the top bit; subtraction is "add the negation".

```text
   6 + (-3), 4 bits              5 - 3, 4 bits
     0110   ( 6)                   0101   ( 5)
   + 1101   (-3)                 + 1101   (-3 = negation of 0011)
   -------                       -------
    10011  carry 1 -> 0011 = 3   10010  carry 1 -> 0010 = 2
```

**Step 6 — Overflow.** **Overflow** means the true mathematical answer does not fit in the width. The rule for addition: **overflow occurs when both operands have the same sign and the result has the opposite sign.** A carry out of the top bit is *not* overflow by itself.

```text
   7 + 1  (4 bits)              -8 + (-1)  (4 bits)
     0111  (+7)                    1000  (-8)
   + 0001  (+1)                  + 1111  (-1)
   -------                       -------
     1000  = -8   WRONG            10111 -> 0111 = +7   WRONG
   two positives -> negative      two negatives -> positive
```

Both are overflow: the bit pattern is legal, the *interpretation* is broken.

**Step 7 — Sign extension.** To widen a signed number, copy the sign bit into all the new high bits. `1010` (4-bit `-6`) becomes `1111 1010` (8-bit `-6`); check `-128 + 64 + 32 + 16 + 8 + 2 = -6`. Zero-padding instead gives `0000 1010 = +10`. Wrong.

**Step 8 — Seeing it in Java.** Java's `int` is 32-bit two's complement, so it is a handy place to check your hand-work:

```java
public class TwosComplement {
    public static void main(String[] args) {
        int pattern = -6 & 0xF;                                // keep the low 4 bits of -6
        System.out.println(Integer.toBinaryString(pattern));   // prints 1010
        int raw = 0b1010;                                      // a 4-bit pattern
        int magnitude = (raw ^ 0xF) + 1;                       // flip 4 bits, then add 1
        System.out.println(magnitude + " -> " + (-magnitude)); // prints 6 -> -6
    }
}
```

`Integer.toBinaryString` prints no leading zeros, so you see `1010`, not `00001010`.

**Example question:** Working in 4 bits: (a) write `-5` in two's complement; (b) compute `0110 + 1101` and give the signed and unsigned reading of the result; (c) does `0110 + 0111` overflow?

**Solution:**

- (a) `5 = 0101`; flip -> `1010`; add 1 -> `1011`. Reason: flip-and-add-1 is the two's complement negation rule. Check by weight: `-8 + 0 + 2 + 1 = -5`. Correct.
- (b) Add column by column from the right: bit0 `0+1=1` carry 0; bit1 `1+0=1` carry 0; bit2 `1+1=0` carry 1; bit3 `0+1+1=0` carry 1, so the carry out is 1 and the result is `0011`. Reason: each column adds three values (two bits plus the incoming carry) and passes a carry up.
- (b, continued) Signed reading: `6 + (-3) = 3`, and `0011` is `+3`. Unsigned reading: `6 + 13 = 19 = 10011` in 5 bits, and the 4-bit truncation `0011 = 3` equals `19 mod 16`.
- (c) `0110 + 0111`: bit0 `0+1=1`; bit1 `1+1=0` carry 1; bit2 `1+1+1=1` carry 1; bit3 `0+0+1=1`. Result `1101`, no carry out. Signed reading `6 + 7 = 13`, but `1101 = -8 + 4 + 1 = -3`. Both operands positive and the result negative -> **overflow**; the true answer 13 exceeds the 4-bit maximum 7.

**Final answer:** (a) `1011`; (b) `0011` with carry out `1` (signed `+3`, unsigned `3`); (c) yes — overflow, since `1101` reads as `-3` but `6 + 7 = 13`.

⚠️ **Common trap:** Treating the top carry out as overflow. In (b) there *is* a carry out and *no* overflow. Second trap: applying "flip and add 1" to only part of the width — negate over the full fixed width. Third trap: zero-padding when widening a negative number.

## 1.6 Logic gates – the machine's alphabet

### Intuition

A gate is a tiny decision-maker with one output: feed it input voltages, it gives an output voltage by a fixed rule. No memory, no clock, no state — the output depends purely on the inputs *right now*. Seven such rules are enough to build a computer.

### The idea, step by step

**Step 1 — The two-input truth table.** Two inputs give `2^2 = 4` combinations, so four output values fully describe any two-input gate. That table *is* the gate's definition.

| `A` | `B` | AND `A.B` | OR `A+B` | NAND | NOR | XOR `A⊕B` | XNOR |
|-----|-----|-----------|----------|------|-----|-----------|------|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 | 1 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 |

`NOT` has one input: `NOT 0 = 1`, `NOT 1 = 0`, written `A'` (also `Ā` or `!A`).

**Step 2 — What each one *means*, in words.**

| Gate | Rule in plain words | Where it shows up later |
|------|--------------------|-------------------------|
| AND | output 1 only if **all** inputs are 1 | "enable this only if the control bit is 1" |
| OR | output 1 if **any** input is 1 | "the alarm sounds if any sensor trips" |
| NOT | output is the opposite | inverting a control signal |
| NAND | AND, then flipped | the universal block (1.9) |
| NOR | OR, then flipped | the SR latch (Module 3) |
| XOR | output 1 if the inputs **differ** | the adder's sum bit, and the subtract trick (2.4) |
| XNOR | output 1 if the inputs are **equal** | equality comparison (2.6) |

**Step 3 — Gate shapes.** Real schematics use distinctive outlines; the little circle at the output always means "invert".

```text
   AND            OR             NOT           XOR
  ___            ___            ___           ___
 A \             A \            A \            A \
    )--- Y          )--- Y         >o-- Y         )--- Y
 B /             B /                           B /
 (D shape)      (curved)       (triangle)    (curved + arc)
 NAND = AND with a circle; NOR = OR with a circle; XNOR = XOR with a circle
```

**Step 4 — Simulating them (hands-on).** In Logisim or Digital: drop two input pins, one gate, and an output probe or LED. Click the pins to cycle all four combinations and check each row against the truth table. Do this for all seven gates once — ten minutes, and the rest of the course feels real. Digital's analysis / truth-table feature will enumerate the inputs for you.

**Example question:** For the circuit `Y = (A OR B) AND NOT(A AND B)`, complete the truth table for all four input combinations and name the gate `Y` behaves like.

**Solution:**

- Column 1 is `A OR B`. Reason: OR is 1 if any input is 1.
- Column 2 is `A AND B`. Reason: AND is 1 only if both are 1.
- Column 3 is `NOT(A AND B)`. Reason: invert column 2.
- Column 4 is the AND of columns 1 and 3. Reason: the final gate is an AND.

| `A` | `B` | `A OR B` | `A AND B` | `NOT(A AND B)` | `Y` |
|-----|-----|----------|-----------|----------------|-----|
| 0 | 0 | 0 | 0 | 1 | **0** |
| 0 | 1 | 1 | 0 | 1 | **1** |
| 1 | 0 | 1 | 0 | 1 | **1** |
| 1 | 1 | 1 | 1 | 0 | **0** |

The `Y` column is `0,1,1,0` — exactly XOR. In Boolean algebra this is the standard identity `A ⊕ B = (A + B).(A.B)'`.

**Final answer:** `Y = 0,1,1,0`, so `Y = A ⊕ B` (XOR) — which also proves XOR can be built from AND, OR and NOT.

⚠️ **Common trap:** Reading NAND as "NOT of OR". NAND is `NOT(A AND B)`, NOR is `NOT(A OR B)`; they differ in three of four rows. Second trap: thinking XOR means "A or B or both" — XOR excludes the both-case, and that is the entire difference from OR.

## 1.7 Boolean basics

### Intuition

Boolean algebra is the grammar for gates. Just as `2(x + y) = 2x + 2y` lets you simplify arithmetic, Boolean laws let you simplify a circuit — and every term you remove is a physical gate you no longer build, power or wait for. This is the mathematics behind the K-maps of section 2.2.

### The idea, step by step

**Step 1 — Vocabulary and precedence.** A **variable** is a signal such as `A`; a **literal** is a variable or its complement (`A`, `A'`); a **term** is literals ANDed (`A'BC`); an **expression** is terms ORed (`A'BC + AB`). `NOT` binds tightest, then `AND`, then `OR`, so `A + B.C` means `A + (B.C)` and never `(A + B).C` — when in doubt, bracket.

**Step 2 — The laws you actually need.** Here `+` is OR, `.` is AND, `'` is NOT.

| Law | OR form | AND form | Why it is obvious |
|-----|---------|----------|-------------------|
| Identity | `A + 0 = A` | `A . 1 = A` | ORing with 0 changes nothing |
| Null | `A + 1 = 1` | `A . 0 = 0` | OR with 1 is always 1 |
| Idempotent | `A + A = A` | `A . A = A` | saying it twice adds nothing |
| Complement | `A + A' = 1` | `A . A' = 0` | one of them must be 1, the other 0 |
| Commutative | `A + B = B + A` | `A.B = B.A` | order does not matter |
| Associative | `A+(B+C) = (A+B)+C` | `A.(B.C) = (A.B).C` | grouping does not matter |
| Distributive | `A.(B+C) = A.B + A.C` | `A + B.C = (A+B).(A+C)` | the second form has no decimal analogue |
| Absorption | `A + A.B = A` | `A.(A+B) = A` | the `A` case already covers it |
| De Morgan | `(A + B)' = A'.B'` | `(A.B)' = A'+B'` | break the bar, flip the sign |

That second distributive law `A + B.C = (A+B).(A+C)` is where most people slip. Check it at `A=0, B=1, C=1`: left `= 0 + 1 = 1`; right `= (0+1).(0+1) = 1`. At `A=1`: left `= 1`; right `= 1.1 = 1`. Same.

**Step 3 — De Morgan, proved by table.** Worth seeing once, because you will use it to build OR from NAND in 1.9.

| `A` | `B` | `A+B` | `(A+B)'` | `A'` | `B'` | `A'.B'` |
|-----|-----|-------|---------|------|------|---------|
| 0 | 0 | 0 | **1** | 1 | 1 | **1** |
| 0 | 1 | 1 | **0** | 1 | 0 | **0** |
| 1 | 0 | 1 | **0** | 0 | 1 | **0** |
| 1 | 1 | 1 | **0** | 0 | 0 | **0** |

The bold columns match in every row, so `(A+B)' = A'.B'`. In words: **break the bar and change the operator**.

**Step 4 — Simplifying with a reason on every line.**

```text
  Y = A + A'.B
    = (A + A').(A + B)     distributive (OR over AND)
    = 1 . (A + B)          complement: A + A' = 1
    = A + B                identity
```

**Example question:** Simplify `Y = (A + B).(A + B')` to its shortest form, naming the law used at each step.

**Solution:**

- Step 1: `Y = A + B.B'`. Reason: the distributive law read backwards, `(A+X).(A+Y) = A + X.Y`, with `X = B`, `Y = B'`.
- Step 2: `B.B' = 0`. Reason: complement law.
- Step 3: `Y = A + 0`. Reason: substitute step 2.
- Step 4: `Y = A`. Reason: identity law `A + 0 = A`.
- Check `A=0, B=1`: original `= (0+1).(0+0) = 1.0 = 0`; simplified `= 0`. Match. Check `A=1, B=0`: original `= (1+0).(1+1) = 1`; simplified `= 1`. Match.

**Final answer:** `Y = A` — three literals and two gates collapse to a plain wire.

⚠️ **Common trap:** Applying De Morgan and forgetting to flip the operator: `(A.B)'` is `A' + B'`, not `A'.B'`. Second trap: using `A + B.C = (A+B).C`, which is wrong; the correct dual is `(A+B).(A+C)`.

## 1.8 From a truth table to a circuit

### Intuition

Someone hands you a specification: "the light is on when at least two of the three switches are on." How do you get from that sentence to a wiring diagram? The recipe is mechanical: **list every case, mark the rows where the output is 1, write one term per such row, OR the terms, simplify, then draw gates.** No creativity required — that is the beauty of it.

### The idea, step by step

**Step 1 — Minterm.** A **minterm** is one AND term that is 1 for exactly one row of the truth table. For inputs `A,B,C`, the row `A=0,B=1,C=1` gives the minterm `A'.B.C` — put `'` where the input is 0. Each row has its own minterm, and it is 1 on that row and 0 everywhere else.

**Step 2 — Sum of products (SOP).** OR together the minterms of all rows where the output must be 1. This is correct by construction: on a row where `F` should be 1 exactly one minterm fires and forces the output high; on a row where `F` should be 0 no minterm fires. This is the **canonical** (standard) SOP form.

**Step 3 — Simplify, then build.** The canonical form is correct but wasteful. Apply the Boolean laws (or a K-map in 2.2) to remove literals, then draw one gate per operator, left to right.

**Step 4 — Worked example: majority of three.** Specification: output 1 when at least two of `A, B, C` are 1.

| Row | `A` | `B` | `C` | `F` | minterm |
|-----|-----|-----|-----|-----|---------|
| 0 | 0 | 0 | 0 | 0 | — |
| 1 | 0 | 0 | 1 | 0 | — |
| 2 | 0 | 1 | 0 | 0 | — |
| 3 | 0 | 1 | 1 | 1 | `A'BC` |
| 4 | 1 | 0 | 0 | 0 | — |
| 5 | 1 | 0 | 1 | 1 | `AB'C` |
| 6 | 1 | 1 | 0 | 1 | `ABC'` |
| 7 | 1 | 1 | 1 | 1 | `ABC` |

Canonical SOP, also written `Σm(3,5,6,7)`:

```text
  F = A'BC + AB'C + ABC' + ABC
```

Now simplify, two terms at a time:

```text
  AB'C + ABC  = AC(B' + B) = AC(1) = AC
  A'BC + ABC  = BC(A' + A) = BC(1) = BC
  ABC' + ABC  = AB(C' + C) = AB(1) = AB
  so  F = AB + AC + BC
```

**Step 5 — Draw it.**

```text
  A ──┬──────────────┐
      │              ├──[AND]── AB ──┐
  B ──┴──────────────┘               │
  A ──┬──────────────┐               │
      │              ├──[AND]── AC ──┼──[OR]── F
  C ──┴──────────────┘               │
  B ──┬──────────────┐               │
      │              ├──[AND]── BC ──┘
  C ──┴──────────────┘
```

Three 2-input ANDs and one 3-input OR: **four gates**, instead of the canonical form's four 3-input ANDs plus a 4-input OR. Fewer gates, fewer transistors, less delay.

**Example question:** A 3-bit input `A B C` (`A` is the MSB) must produce `F = 1` when the number is **greater than 4**. Write the truth table, the canonical SOP, and the simplified circuit.

**Solution:**

- Rows above 4 are `101` (5), `110` (6), `111` (7). Reason: those are the only values greater than 4 in the range 0–7.

| `A` | `B` | `C` | value | `F` |
|-----|-----|-----|-------|-----|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 2 | 0 |
| 0 | 1 | 1 | 3 | 0 |
| 1 | 0 | 0 | 4 | 0 |
| 1 | 0 | 1 | 5 | 1 |
| 1 | 1 | 0 | 6 | 1 |
| 1 | 1 | 1 | 7 | 1 |

- Canonical SOP: `F = AB'C + ABC' + ABC`, that is `Σm(5,6,7)`.
- Simplify: `AB'C + ABC = AC(B' + B) = AC`, and `ABC' + ABC = AB(C' + C) = AB`, so `F = AC + AB = A(B + C)`.
- Verify `A(B+C)` on all eight rows: `000`->0; `001`->A=0 so 0; `010`->0; `011`->0; `100`->`1.(0+0)=0`; `101`->`1.(0+1)=1`; `110`->`1.(1+0)=1`; `111`->`1.(1+1)=1`. Every row matches.
- Circuit: one OR for `B+C`, one AND with `A`. **Two gates.**

**Final answer:** `F = Σm(5,6,7) = AB'C + ABC' + ABC = A(B + C)`, built from one OR and one AND.

⚠️ **Common trap:** Writing the minterm with the wrong polarity — row `A=0,B=1,C=1` is `A'BC`, not `ABC`. Second trap: missing one `F=1` row, which silently changes the function. Third trap: building the canonical form and stopping; exam questions almost always want the simplified form, and only that one is cheap in hardware.

## 1.9 NAND universality (the "aha")

### Intuition

A carpenter with one tool — a saw — can still build a chair, because every other cut can be *derived* from sawing. In logic, **NAND** is that saw. You can build NOT, AND and OR from NAND alone, and since `{NOT, AND, OR}` expresses any truth table, NAND expresses any truth table. One gate type, whole computer. Chip factories love it: one cell, optimised to death, replicated billions of times.

### The idea, step by step

**Step 1 — NOT from NAND.** Tie both inputs together: `NAND(A,A) = (A.A)' = A'`.

```text
        ┌──────┐
  A ────┤      │
        │ NAND ├──── A'
  A ────┤      │
        └──────┘
```

Check: `A=0` gives `NAND(0,0)=1`; `A=1` gives `NAND(1,1)=0`. Correct.

**Step 2 — AND from NAND.** NAND, then invert: `NAND(NAND(A,B), NAND(A,B)) = A.B`.

```text
        ┌──────┐        ┌──────┐
  A ────┤      │        │      │
        │ NAND ├───┬────┤ NAND ├──── A.B
  B ────┤      │   └────┤      │   (one wire feeds both inputs)
        └──────┘        └──────┘
```

Check `A=1,B=1`: the first NAND gives 0, and `NAND(0,0)=1=A.B`. Correct.

**Step 3 — OR from NAND.** This is where De Morgan earns its keep: `A + B = ((A+B)')' = (A'.B')'`, and each `'` is a NAND.

```text
        ┌──────┐
  A ────┤ NAND ├── A' ──┐  ┌──────┐
  A ────┤      │        ├──┤      │
        └──────┘        │  │ NAND ├──── A + B
        ┌──────┐        │  │      │
  B ────┤ NAND ├── B' ──┘  └──────┘
  B ────┤      │
        └──────┘
```

Check `A=0,B=0`: `A'=1, B'=1`, `NAND(1,1)=0=A+B`. Check `A=1,B=0`: `A'=0, B'=1`, `NAND(0,1)=1=A+B`. Correct.

**Step 4 — Why this is enough.** `{NOT, AND, OR}` is **functionally complete**: any truth table is a sum of products (1.8), which uses only AND for terms, OR to join them, and NOT for complemented literals. Replace each of those three with its NAND version and you have a NAND-only circuit. So NAND alone is functionally complete — **universal**.

**Step 5 — Bonus: XOR in 4 NANDs.** Worth memorising, because XOR appears in every adder.

```text
  n1 = A NAND B
  n2 = A NAND n1
  n3 = B NAND n1
  Y  = n2 NAND n3      (= A XOR B)
```

| `A` | `B` | `n1` | `n2` | `n3` | `Y` | XOR expected |
|-----|-----|------|------|------|-----|--------------|
| 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 0 | 0 |

**Step 6 — Same story for NOR.** NOR is universal too (swap AND and OR in the argument, by the dual of De Morgan). Real CMOS chips are usually NAND-dominant because a NAND gate is faster and smaller in CMOS than a NOR gate of the same fan-in.

**Example question:** Build `F = A'B + AB'` (that is, XOR) using **only** NAND gates. State the gate count and verify the circuit on the row `A=1, B=1`.

**Solution:**

- Step 1: recognise `A'B + AB' = A ⊕ B`. Reason: that is XOR written as a sum of minterms.
- Step 2: use the 4-NAND XOR — `n1 = A NAND B`, `n2 = A NAND n1`, `n3 = B NAND n1`, `F = n2 NAND n3`. Reason: a known NAND-only identity, and the table above confirms all four rows.
- Step 3: verify `A=1, B=1`: `n1 = NAND(1,1) = 0`; `n2 = NAND(1,0) = 1`; `n3 = NAND(1,0) = 1`; `F = NAND(1,1) = 0`. Expected `1 ⊕ 1 = 0`. Match.
- Step 4: count: four 2-input NAND gates. (The naive NAND build — inverters for `A'` and `B'`, two ANDs as NAND+NAND, then OR-from-NAND — needs 7 or more.)

**Final answer:** `F = A ⊕ B` from **4 NAND gates**, verified at `A=1,B=1` (`n1=0, n2=1, n3=1, F=0`).

⚠️ **Common trap:** Tying the two inputs of an **AND** gate gives a buffer (`A.A = A`), not an inverter — only NAND and NOR invert with tied inputs. Second trap: building OR-from-NAND without inverting the inputs first; plain `NAND(A,B)` is `(AB)'`, which is NAND, not OR.

## 1.10 Tooling & workflow orientation

### Intuition

A carpenter sharpens tools before building. Ten minutes of setup now saves hours later, because in Modules 2 to 6 you will build a dozen circuits and you must be able to *find* last week's working version. Three tools: a circuit simulator, a CPU visualiser, and version control.

### The idea, step by step

**Step 1 — The logic simulator (Logisim / Digital).** You place gates on a canvas, drag wires, attach input pins and output probes, and click to toggle inputs.

| Feature | What it is for |
|---------|----------------|
| Pin (input) / probe (output) | drive and observe signals |
| Wire and junction dot | a dot means "connected"; crossing wires with no dot are **not** connected |
| Subcircuit ("create circuit") | build a full adder once, reuse it 32 times — this is how the CPU gets built |
| Clock / tick | needed from Module 3 onwards |
| Analysis / truth-table tool | auto-enumerate every input combination |
| Splitter | break a 32-bit bus into wires, or join wires into a bus (Module 4) |

**Step 2 — The CPU visualiser (Ripes).** Loads real RISC-V programs, lights up the datapath as instructions execute, and single-steps while you watch registers and memory. Use Ripes when you are confused about *what* the hardware must do; use the simulator when you want to know *how*.

**Step 3 — Version control (Git).** Plain terminal commands, no code:

```text
  git init                                     # start tracking this folder
  git add .                                    # stage everything
  git commit -m "full adder: all 8 rows pass"   # save a restore point
  git log --oneline                             # see your history
```

Commit **after every working block**, with a message saying what works. When your ALU breaks at 2 a.m. in Module 2, you want the commit from when it worked.

**Step 4 — The habits used all course.** Not style points; these are how you avoid losing weekends.

1. **Name every wire and subcircuit** — `sum3`, not `wire_47`.
2. **Test a block completely before using it** — a full adder has 8 rows, so test 8, not 2.
3. **Test the boundaries first** — all-zeros, all-ones, and the row you think is impossible.
4. **Build bottom-up** — gate -> half adder -> full adder -> 4-bit adder -> 32-bit adder. Never build top-down and debug at the top.
5. **Keep one `README` line per block** saying what it does and what you tested, and save before experimenting.

**Example question:** You have just built a full adder as a subcircuit in Logisim. Describe exactly how you would verify it, and what you would commit to Git.

**Solution:**

- Step 1: place three input pins (`A`, `B`, `Cin`) and two output probes (`S`, `Cout`) on a test circuit that *instantiates* the subcircuit. Reason: test the block through its pins, exactly as it will be used.
- Step 2: enumerate all `2^3 = 8` combinations of `A, B, Cin`. Reason: three inputs means eight rows; anything less leaves a path untested.
- Step 3: for each row check `S` and `Cout` against the binary form of `A + B + Cin`. Example: `A=1, B=1, Cin=1` must give `S=1, Cout=1` because `1+1+1 = 3 = 11` in binary.
- Step 4: also run the simulator's truth-table/analysis feature and compare with your hand table. Reason: two independent methods catch a mis-wired input.
- Step 5: commit with `git commit -m "full adder: all 8 rows match hand truth table"`. Reason: the message is your evidence, and the commit is your restore point.

**Final answer:** test all 8 rows against `A+B+Cin`, confirm with the built-in truth-table tool, then commit with a message recording that all 8 rows pass.

⚠️ **Common trap:** Testing two rows and declaring the block done — a mis-wired `Cin` is invisible in six of the eight rows. Second trap: wires that cross without a junction dot look connected on screen but are not. Third trap: never committing, so there is no working version to return to.

## Formula / rule summary table

| Situation | Use this | One-line reason |
|-----------|----------|-----------------|
| decimal -> binary | divide by 2 repeatedly, read remainders bottom-up | each division peels off one bit |
| binary -> hex | group 4 bits from the **right** | `16 = 2^4`, one hex digit per nibble |
| hex -> decimal | `sum of digit x 16^position` | positional value in base 16 |
| negate a signed number | flip all bits, add 1 | `x + ~x + 1 = 2^n` wraps to 0 |
| read a two's complement value | top bit has weight `-2^(n-1)` | that is the definition of the encoding |
| widen a signed number | copy the sign bit leftwards | keeps both value and sign |
| detect add overflow | operands same sign, result opposite sign | the true answer left the range |
| simplify an expression | laws table (1.7), then K-map (2.2) | fewer gates = faster, cheaper, cooler |
| truth table -> circuit | SOP over the `F=1` rows, then simplify | correct by construction, then made cheap |
| build from one gate type | NAND (or NOR) | `{NOT,AND,OR}` is functionally complete |

**Which one when?** Read *"convert to hex"* -> group bits in fours, no arithmetic. Read *"is this negative?"* -> look at the top bit only. Read *"did it overflow?"* -> compare signs, do not look at the carry out. Read *"simplify"* -> laws for 2–3 literals, K-map for 3–4 variables. Read *"build it in the simulator with one gate type"* -> NAND.

## Solved examples

### Example 1 (easy) — number bases

Convert `0xB6` to binary and decimal, and say what it means as an 8-bit signed value.

**Solution:**

- Step 1: `B = 11 = 1011` and `6 = 0110`, so `0xB6 = 1011 0110`. Reason: one hex digit is four bits.
- Step 2: unsigned value `= 128 + 32 + 16 + 4 + 2 = 182`. Reason: add the weights where a `1` sits.
- Step 3: the top bit is `1`, so as a signed 8-bit number it is negative. Reason: in two's complement the MSB is the sign bit.
- Step 4: signed value `= -128 + 32 + 16 + 4 + 2 = -74`. Reason: the MSB's weight is `-128`. Cross-check: `~0xB6 = 0x49 = 73`, then `73 + 1 = 74`, so the value is `-74`. Match.

**Final answer:** `0xB6 = 1011 0110`; unsigned `182`; signed `-74`.

### Example 2 (easy–medium) — two's complement arithmetic

Working in 8 bits, compute `0x2C + 0xD5` and `0x2C - 0x2C`. For each, give the carry out and say whether overflow occurred.

**Solution:**

- Step 1: `0x2C = 0010 1100 = 32 + 8 + 4 = 44`. And `0xD5 = 1101 0101`, signed `-128 + 64 + 16 + 4 + 1 = -43`. Cross-check `0xD5`: `~0xD5 = 0x2A = 42`, `42 + 1 = 43`, so `-43`. Match.
- Step 2: add bit by bit from the right.

```text
     0010 1100          bit0: 0+1   = 1   carry 0
   + 1101 0101          bit1: 0+0   = 1   carry 0
   -----------          bit2: 1+1   = 0   carry 1
     0000 0001          bit3: 1+0+1 = 0   carry 1
   carry out = 1        bit4: 0+1+1 = 0   carry 1
                        bit5: 1+0+1 = 0   carry 1
                        bit6: 0+1+1 = 0   carry 1
                        bit7: 0+1+1 = 0   carry 1
```

- Step 3: signed check `44 + (-43) = 1`. Correct.
- Step 4: carry out `1`, but overflow **no** — the operands have *different* signs (`0` and `1`), so magnitude cannot have pushed the result out of range.
- Step 5: `0x2C - 0x2C` is `0x2C + (-0x2C)`, and `-0x2C = ~0x2C + 1 = 0xD3 + 1 = 0xD4`. So `0010 1100 + 1101 0100 = 1 0000 0000`: result `0x00`, carry out `1`. Reason: `x + (-x)` always gives 0 with a carry out — the `2^8` wrap.
- Step 6: overflow again **no**, for the same different-signs reason.

**Final answer:** `0x2C + 0xD5 = 0x01` with carry out `1`, no overflow; `0x2C - 0x2C = 0x00` with carry out `1`, no overflow.

### Example 3 (medium) — SOP from a word problem

A lift door opens (`D = 1`) if the "open" button is pressed (`O`), or if someone is in the doorway (`P`) and the door is not already locked (`L'`). Write the Boolean expression and build it from NAND gates only.

**Solution:**

- Step 1: translate the sentence. "or" -> OR, "and" -> AND, "not already locked" -> `L'`. So `D = O + P.L'`.
- Step 2: check edge cases. `O=1` gives `D=1` whatever else happens. `O=0, P=1, L=0` gives `D = 0 + 1.1 = 1`. `O=0, P=1, L=1` gives `D = 0 + 1.0 = 0` — a locked door does not open, exactly as specified.
- Step 3: `L'` from one NAND with tied inputs. Reason: `NAND(L,L) = L'`.
- Step 4: `P.L'` from two NANDs (one NAND, then a NAND with tied inputs = AND). Reason: step 2 of 1.9.
- Step 5: `O + P.L'` from OR-built-of-NAND: invert `O` with one NAND, then `NAND(O', P.L')`. Reason: `X + Y = NAND(X', Y)`.

```text
  L ─┬─[NAND]─ L' ─┐
  L ─┘             ├─[NAND]─ m ─┬─[NAND]─ n1 ─┐
  P ───────────────┘            └─┘           ├─[NAND]─ D
  O ─┬─[NAND]─ O' ────────────────────────────┘
  O ─┘
```

- Step 6: count gates: 1 for `L'`, 2 for the AND, 1 for `O'`, 1 final NAND = **5 NAND gates**.

**Final answer:** `D = O + P.L'`, built from 5 NAND gates.

### Example 4 (exam level) — specification to verified circuit

A 4-bit unsigned input `N = n3 n2 n1 n0` feeds a circuit whose output `F = 1` exactly when `N` is **odd and greater than 8**. Derive `F`, simplify it, and give the minimum gate count.

**Solution:**

- Step 1: "odd" means `n0 = 1`. Reason: the LSB decides parity in binary.
- Step 2: "greater than 8" for a 4-bit unsigned value means `N` in `{9,...,15}`. Reason: 4 bits cover 0–15, so everything above 8 is 9 to 15.
- Step 3: intersect. The odd values there are `9 = 1001`, `11 = 1011`, `13 = 1101`, `15 = 1111`. Reason: keep only rows with `n0 = 1`.
- Step 4: look for structure instead of minterms. All four have `n3 = 1` and `n0 = 1`, while `n2` and `n1` take all four combinations `00, 01, 10, 11` between them. So `F = n3 . n0`. Reason: a function that is 1 on exactly the rows where two variables are 1, and independent of the other two, is their AND.
- Step 5: verify on all 16 inputs via the formula — `F = 1` requires `n3 = 1` and `n0 = 1`, i.e. `N` in `{9, 11, 13, 15}`, which is exactly the set found. Correct.
- Step 6: gate count: one 2-input AND.
- Step 7: the canonical form for reference is `F = Σm(9,11,13,15) = n3n2'n1'n0 + n3n2'n1n0 + n3n2n1'n0 + n3n2n1n0`, which collapses to `n3.n0` — sixteen literals become two.

**Final answer:** `F = n3 . n0`, one AND gate, verified against all 16 input patterns.

## Common traps and mistakes

- **Grouping bits from the left for hex.** Hex digits align to the *least* significant end, so grouping from the left shifts every digit; and `0x19` is `16 + 9 = 25`, not nineteen.
- **Calling a carry out "overflow".** They are different signals: overflow is about the signed range, carry out about the unsigned width. Saying "carry out = 1, so overflow" loses the whole mark.
- **Zero-extending a negative number.** `1010` widened to `0000 1010` becomes `+10`, not `-6`. Copy the sign bit.
- **Confusing NAND with NOR.** The all-ones row is identical (`0`), so never memorise one row — the other three decide.
- **Applying De Morgan without flipping the operator** (`(A.B)' = A' + B'`) **or using `A + B.C = (A+B).C`** — the real dual law is `(A+B).(A+C)`.
- **Stopping at the canonical SOP.** It is correct but wasteful; the question wants the simplified form.
- **Wrong polarity in a minterm.** Row `A=0` contributes `A'`, never `A`.
- **Testing 2 of 8 rows in the simulator.** A mis-wired `Cin` hides in six rows.

## Quick revision box

- ✅ A computer does four jobs — input, process, store, output. The CPU is the processor, not the storage and not the display.
- ✅ Digital means two agreed voltage bands with a **forbidden zone** between them; noise immunity comes from every gate **regenerating** a clean value.
- ✅ `16 = 2^4`, so **1 hex digit = 4 bits**. Group from the right, pad on the left.
- ✅ Two's complement: the top bit has weight `-2^(n-1)`; to negate, **flip all bits and add 1**; `n` bits span `-2^(n-1)` to `2^(n-1) - 1`.
- ✅ Overflow = same-sign operands with an opposite-sign result. A carry out is **not** overflow.
- ✅ Seven gates: AND, OR, NOT, NAND, NOR, XOR, XNOR. XOR means *differ*, XNOR means *equal*.
- ✅ Truth table -> SOP over the `F=1` rows -> Boolean simplification -> gates. Correct by construction, then made cheap.
- ✅ NAND alone gives NOT, AND and OR, so NAND is **universal** — one cell type can build the whole CPU.

## Practice questions

1. Convert `0xE3` to binary, and give its unsigned and signed (8-bit) decimal values.
2. Working in 4 bits, compute `1011 + 0110`. Give the carry out, the signed value of both operands, and say whether overflow occurred.
3. Simplify `Y = AB + AB' + A'B` using Boolean laws, naming the law at each step.
4. A three-input function is 1 for `Σm(0,2,4,6)`. Write the canonical SOP, simplify it, and state the gate count.
5. Build `F = (A + B)'.C` using only NAND gates, and give the number of gates.
6. A 4-bit signed adder computes `0111 + 0010`. Give the 4-bit result, the carry out, the overflow flag, and say in one line what a program sees if it ignores the flag.

## Answers

**A1.** `E = 1110`, `3 = 0011`, so `0xE3 = 1110 0011`. Unsigned `= 128 + 64 + 32 + 2 + 1 = 227`. Signed `= -128 + 64 + 32 + 2 + 1 = -29`; cross-check `~0xE3 = 0x1C = 28`, `28 + 1 = 29`, so `-29`.

**A2.** Bit by bit: bit0 `1+0=1`; bit1 `1+1=0` carry 1; bit2 `0+1+1=0` carry 1; bit3 `1+0+1=0` carry 1. Result `0001`, carry out `1`. Operands are `1011 = -5` and `0110 = +6`; the signed sum `+1` matches `0001`. Different signs, so **no overflow**.

**A3.** `AB + AB' = A(B + B') = A.1 = A` (distributive, complement, identity). Then `A + A'B = (A + A')(A + B) = 1.(A + B) = A + B` (distributive OR over AND, complement, identity). **Final:** `Y = A + B`.

**A4.** Minterms `000`, `010`, `100`, `110` give `A'B'C' + A'BC' + AB'C' + ABC'`. Factor out `C'`: `C'(A'B' + A'B + AB' + AB) = C'.1 = C'`. So `F = C'` — one inverter, or zero gates if `C'` is already available. All four minterms have `C = 0`.

**A5.** De Morgan: `(A+B)' = A'.B'`, so `F = A'.B'.C`. Build `A' = NAND(A,A)` (1 gate), `B' = NAND(B,B)` (1 gate), the AND of `A'.B'` as `NAND` then invert (2 gates), then AND with `C` (2 gates) — **6 NAND gates** for a plain 2-input-AND build; a 3-input AND built as `NAND(NAND(x,C), NAND(x,C))` reusing one signal gives 5. State your assumption.

**A6.** `0111 + 0010`: bit0 `1+0=1`; bit1 `1+1=0` carry 1; bit2 `1+0+1=0` carry 1; bit3 `0+0+1=1`. Result `1001`, carry out `0`. Overflow **yes** — both operands positive, result `1001 = -7` negative, and `7 + 2 = 9 > 7` (the 4-bit maximum). A program that ignores the flag reads `1001` as `-7` and silently computes a wrong answer.
