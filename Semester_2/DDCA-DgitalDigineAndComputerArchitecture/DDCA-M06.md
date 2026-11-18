# Digital Design & Computer Architecture – Module 6
## Build It, Extend It & Look Ahead
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture
This is the capstone. In Module 5 you assembled the datapath and the control unit; here you *run* the machine, then *change* it. Three things happen, in this order. First, the program from day one executes on your CPU and you check the answer by hand, cycle by cycle, so you trust it. Second — and this is the real heart of the course — you add a brand-new instruction to your own processor: you decide the encoding, you add the operation to the ALU, you extend the decoder, and you watch it work. Third, you bolt the CPU onto the outside world with a memory-mapped output port, so a store instruction can light an LED. Then we step back and ask the engineering question: how fast is this thing, why is single-cycle a dead end, and where does the rest of computing go from here. Analogy: Module 5 built the car and the engine. Module 6 drives it, fits a new gear of your own design, wires up the headlights, and reads the speedometer.

## Basics you must know first
- **The single-cycle datapath and control** (Module 5) — PC, instruction memory, register file, immediate generator, ALU, data memory, and the control signals that steer them.
- **Instruction formats and encodings** (Module 5 §5.4) — the opcode is bits `6:0`; `funct3` is `14:12`; `funct7` is `31:25`.
- **`ALUOp` and `ALUControl`** (Module 5 §5.8) — `ALUOp` is the 2-bit hint from the main decoder; `ALUControl` is the 4-bit operation code.
- **Byte addressing and the 12-bit immediate limit** — an S-type or I-type immediate can only hold `-2048 .. +2047`, which decides where we are allowed to place a peripheral.
- **The performance formula** — `CPU time = instructions x CPI x clock period`. Everything in 6.5 is built on it.
- **Hexadecimal arithmetic** — you will compare addresses like `0x400` and `0x404` and mask bits out of them.

## 6.1 Running a program

### Intuition
The moment your CPU stops being a diagram. You load eleven instruction words and four data words into memory, set the PC to `0x00`, and let the clock tick. Thirty ticks later a value appears in a register and in a peripheral. Nothing magic happened in between — you can point at every wire that carried every bit.

Debugging is the other half of this. When a program gives the wrong answer, you do not stare at the source; you look at *signals*: which control line was high at which cycle, and which register changed when it should not have.

### The idea, step by step
**Step 1 — lay out memory before you run.** Three regions, chosen so every address fits in a 12-bit signed immediate: the program at `0x000`–`0x0FF`, the data array `{1, 2, 3, 4}` at `0x100`, and the output LED register at `0x400`. (The full map, with read/write permissions, is in 6.3.)

**Step 2 — the reference sheet you debug against.** Here is the machine you built, and the full control-signal table for it. Keep both on one page; every question below is answered by pointing at them.

```text
  +------+   PC    +-------------+  instr[31:0]  +-------------+
  |  PC  |-------->| INSTRUCTION |-------------->| IMMEDIATE   |--imm--+
  +------+         |   MEMORY    |               | GENERATOR   |       |
     ^             +-------------+               | I / S / B/J |       |
     |                   |                       +-------------+       |
     |            +------+------+                        |            |
     |            | rs1     rs2 |                        |            |
     |            v             v                        |            |
     |      +----------------------+                     |            |
     |      |    REGISTER FILE     |<------- wd ---------|------------+
     |      | rd1 = Reg[rs1]       |                     |            |
     |      | rd2 = Reg[rs2]       |                     |            |
     |      +----------------------+                     |            |
     |          |           |                            |            |
     |         rd1         rd2                           |            |
     |          |           v                            |            |
     |          |     +-----------+                      |            |
     |          |     |   MUX B   |<-- ALUSrc -----------+            |
     |          |     +-----------+                      |            |
     |          v           |                            |            |
     |   +----------------------------+                  |            |
     |   |           ALU              |                  |            |
     |   | A=rd1, B=MUX B, op=ALUCtrl |                  |            |
     |   | out: result , zero         |                  |            |
     |   +----------------------------+                  |            |
     |        |             |                            |            |
     |     result          zero                          |            |
     |        v             v                            |            |
     |  +---------+    +---------+                       |            |
     |  |  DATA   |    |   AND   |<-- Branch             |            |
     |  | MEMORY  |    +---------+                       |            |
     |  +---------+         | branchTaken                |            |
     |        |             v                            |            |
     |        |      +-----------+                       |            |
     |        |      |  PC MUX   |<-- Jump               |            |
     |        |      +-----------+                       |            |
     |        |            |                             |            |
     |        |      +-----------+                       |            |
     |        |      | PC + imm  |                       |            |
     |        |      +-----------+                       |            |
     |        |            |                             |            |
     |        +-----+------+                             |            |
     |              +--> [ WB MUX ]  ALU / D-MEM / PC+4               |
     |                       +------> wd ----------------------------+
     +---- next PC  (PC MUX: PC+4 or PC+imm)
```

| Instruction | opcode | RegWrite | ALUSrc | MemRead | MemWrite | Branch | Jump | MemtoReg | ALUOp |
|---|---|---|---|---|---|---|---|---|---|
| `add` `sub` `and` `or` `slt` | `0110011` | 1 | 0 | 0 | 0 | 0 | 0 | `00` | `10` |
| `addi` | `0010011` | 1 | 1 | 0 | 0 | 0 | 0 | `00` | `11` |
| `lw` | `0000011` | 1 | 1 | 1 | 0 | 0 | 0 | `01` | `00` |
| `sw` | `0100011` | 0 | 1 | 0 | 1 | 0 | 0 | `X` | `00` |
| `beq` | `1100011` | 0 | 0 | 0 | 0 | 1 | 0 | `X` | `01` |
| `jal` | `1101111` | 1 | `X` | 0 | 0 | 0 | 1 | `10` | `X` |

**Step 3 — the program.** The same array-sum from Module 5, with the result now going to the LED register at `0x400` instead of plain memory. **Step 4 — run it, one clock at a time.** The block below is the complete trace of the whole program: 30 instructions, 30 cycles, because CPI = 1 in a single-cycle machine. `next pc` is the PC after that cycle's edge.

```text
        addi x1, x0, 0x100       # x1 = base address of A  (256)
        addi x2, x0, 0           # x2 = i = 0
        addi x3, x0, 4           # x3 = n = 4
        addi x4, x0, 0           # x4 = sum = 0
loop:   beq  x2, x3, done        # if i == n, exit the loop
        lw   x5, 0(x1)           # x5 = A[i]
        add  x4, x4, x5          # sum = sum + A[i]
        addi x1, x1, 4           # point at the next word
        addi x2, x2, 1           # i++
        jal  x0, loop            # repeat
done:   sw   x4, 0x400(x0)       # write the sum to the LED register
```

```text
cycle  1 | pc=0x00 | addi x1,x0,0x100  | next pc=0x04 | x1 <- 256
cycle  2 | pc=0x04 | addi x2,x0,0      | next pc=0x08 | x2 <- 0
cycle  3 | pc=0x08 | addi x3,x0,4      | next pc=0x0C | x3 <- 4
cycle  4 | pc=0x0C | addi x4,x0,0      | next pc=0x10 | x4 <- 0
cycle  5 | pc=0x10 | beq x2,x3,24      | next pc=0x14 | branch not taken
cycle  6 | pc=0x14 | lw x5,0(x1)       | next pc=0x18 | x5 <- 1
cycle  7 | pc=0x18 | add x4,x4,x5      | next pc=0x1C | x4 <- 1
cycle  8 | pc=0x1C | addi x1,x1,4      | next pc=0x20 | x1 <- 260
cycle  9 | pc=0x20 | addi x2,x2,1      | next pc=0x24 | x2 <- 1
cycle 10 | pc=0x24 | jal x0,-20        | next pc=0x10 | no link (x0)
cycle 11 | pc=0x10 | beq x2,x3,24      | next pc=0x14 | branch not taken
cycle 12 | pc=0x14 | lw x5,0(x1)       | next pc=0x18 | x5 <- 2
cycle 13 | pc=0x18 | add x4,x4,x5      | next pc=0x1C | x4 <- 3
cycle 14 | pc=0x1C | addi x1,x1,4      | next pc=0x20 | x1 <- 264
cycle 15 | pc=0x20 | addi x2,x2,1      | next pc=0x24 | x2 <- 2
cycle 16 | pc=0x24 | jal x0,-20        | next pc=0x10 | no link (x0)
cycle 17 | pc=0x10 | beq x2,x3,24      | next pc=0x14 | branch not taken
cycle 18 | pc=0x14 | lw x5,0(x1)       | next pc=0x18 | x5 <- 3
cycle 19 | pc=0x18 | add x4,x4,x5      | next pc=0x1C | x4 <- 6
cycle 20 | pc=0x1C | addi x1,x1,4      | next pc=0x20 | x1 <- 268
cycle 21 | pc=0x20 | addi x2,x2,1      | next pc=0x24 | x2 <- 3
cycle 22 | pc=0x24 | jal x0,-20        | next pc=0x10 | no link (x0)
cycle 23 | pc=0x10 | beq x2,x3,24      | next pc=0x14 | branch not taken
cycle 24 | pc=0x14 | lw x5,0(x1)       | next pc=0x18 | x5 <- 4
cycle 25 | pc=0x18 | add x4,x4,x5      | next pc=0x1C | x4 <- 10
cycle 26 | pc=0x1C | addi x1,x1,4      | next pc=0x20 | x1 <- 272
cycle 27 | pc=0x20 | addi x2,x2,1      | next pc=0x24 | x2 <- 4
cycle 28 | pc=0x24 | jal x0,-20        | next pc=0x10 | no link (x0)
cycle 29 | pc=0x10 | beq x2,x3,24      | next pc=0x28 | branch TAKEN
cycle 30 | pc=0x28 | sw x4,0x400(x0)   | next pc=0x2C | mem[0x400] <- 10
```

**Step 5 — verify.** Six numbers, all checkable against the trace: total cycles **30** (4 setup + 4 x 6 loop body + 1 taken `beq` + 1 `sw`); `x4 = 10` (1+2+3+4); `mem[0x400] = 10` (the `sw` copied it there); `x1 = 272` (started 256, incremented four times by 4); `x2 = 4` (the counter reached `n`); `x3 = 4` and `x5 = 4` (the unchanged constant, and the last element loaded).

**Step 6 — debug by signals.** The trace tells you *what* happened; the control table tells you *why*. Use this lookup when your own build misbehaves:

| Symptom | Suspect signal | Reason |
|---|---|---|
| registers never change | `RegWrite` stuck at 0 | the write port is gated by it |
| `lw` loads the address, not the data | `MemtoReg` stuck at `00` | write-back is taking the ALU result |
| `sw` corrupts the next instruction | `MemWrite` high when it should not be | data memory and instruction memory share an address space |
| `beq` always falls through | `Branch` not reaching the AND gate, or `zero` never asserted | the ALU must produce `zero` from a subtract |
| loop runs forever | branch offset decoded as positive when it should be negative | sign extension of the B-format immediate |
| `addi` with a negative constant gives a huge number | immediate not sign-extended | `0xFFF` must become `-1`, not `4095` |

### Formula / rule / table
```text
cycles = instructions executed     (single-cycle, CPI = 1)
```
**Meaning:** in a single-cycle machine each instruction takes exactly one clock, so the two counts are equal. **When to use:** any "how many cycles" question about *this* CPU — and never for a pipelined one. **Tiny example:** the trace above has 30 instructions and 30 cycles.

**Example question:** Using the trace, at which cycle does the first `lw` complete, what value does it write, and what is in `x1` at the end of cycle 26?

**Solution:**
- Step 1: `lw x5, 0(x1)` first appears at `pc = 0x14`, which is cycle 6. *Reason: read the `pc` column.*
- Step 2: At that moment `x1 = 256` (set in cycle 1), so the address is `256 + 0 = 256`. *Reason: `lw` computes `rs1 + imm` in the ALU.*
- Step 3: `mem[256]` holds `1`, the first array element. *Reason: the array was preloaded at `0x100 = 256`.*
- Step 4: Cycle 26 is `addi x1, x1, 4` at `pc = 0x1C`, and `x1` was 268 before it. *Reason: read cycles 20 and 26 — `x1` goes 268 -> 272.*
- Step 5: So after cycle 26, `x1 = 272`. *Reason: 268 + 4.*

**Final answer:** the first `lw` completes in **cycle 6**, writing **1** into `x5`; after cycle 26, **`x1 = 272`**.

⚠️ **Common trap:** Forgetting that the PC shown in a cycle is the address *being executed* in that cycle, not the one being fetched for next time. Cycle 5 shows `pc=0x10` (the `beq`) with `next pc=0x14` — both numbers matter, and mixing them up makes every "how many cycles" answer off by one.

## 6.2 Building additional designs with RISC-V

### Intuition
This is the heart of the course: your CPU stops being a fixed product and becomes something you can *design*. Adding an instruction is not magic and it is not scary — it is a checklist of four places, and if you touch all four you are done.

Analogy: adding a dish to a restaurant menu. You write the item code (encoding), you buy the ingredient and teach the cook the recipe (ALU), you teach the order-taker to recognise the code (control decode), and you print it on the menu (the assembler). Miss any one and the dish never reaches a customer.

### The idea, step by step
**Step 1 — pick the encoding, using the bit-field map.** Here is every field position for all five formats in one table. This is the map you consult before touching anything.

| Format | opcode `6:0` | rd `11:7` | funct3 `14:12` | rs1 `19:15` | rs2 `24:20` | immediate bits | imm width |
|---|---|---|---|---|---|---|---|
| R | `0110011` | rd | funct3 | rs1 | rs2 | none | — |
| I | `0010011` / `0000011` | rd | funct3 | rs1 | — | `31:20` | 12 |
| S | `0100011` | — | funct3 | rs1 | rs2 | `31:25` + `11:7` | 12 |
| B | `1100011` | — | funct3 | rs1 | rs2 | `31`, `30:25`, `11:8`, `7` | 13 |
| J | `1101111` | rd | — | — | — | `31`, `30:21`, `20`, `19:12` | 21 |

**Step 2 — choose XOR, and notice it is already free.** `xor` is a real RV32I instruction: opcode `0110011` (same R-type group as `add`), `funct3 = 100`, `funct7 = 0000000`. In our subset `funct3 = 100` is unused — `000` add/sub, `010` slt, `110` or, `111` and — so nothing collides. Our CPU simply never decoded it. Encoding: `xor x5, x6, x7` = `0000000 00111 00110 100 00101 0110011` = `0x007342B3`.

**Step 3 — change the ALU.** The ALU already has an output multiplexer choosing between AND, OR, ADD, SUB and SLT results. Add one more input — a bitwise XOR of A and B — and give it the free code `0011`. Nothing else in the ALU changes: the same two operands, the same result bus, and `zero` still comes from the subtractor.

```text
      A[31:0] ----+----+----+----+----+
                  |    |    |    |    |
      B[31:0] ----+----+----+----+----+
                  |    |    |    |    |
                [AND][OR][ADD][SUB][XOR]      <- five parallel blocks
                  |    |    |    |    |
                  +----+----+----+----+
                          |
                 [ op mux, 5 inputs ] <--- ALUControl[3:0]
                          |
                       result[31:0]
```

**Step 4 — change the ALU control.** One line, because the ALU decoder is a `switch` on `funct3`: `if (funct3 == 0b100) return XOR;` — that is `0011`, the new operation code.

The existing rows are untouched: `funct3 = 000` with `funct7 = 0000000` is still ADD, with `funct7 = 0100000` still SUB.

**Step 5 — check the main control. Nothing changes.** This is the insight worth remembering: `xor` has the *same opcode* as `add`, so the main decoder already produces the right signals for it — `RegWrite 1`, `ALUSrc 0`, `MemRead 0`, `MemWrite 0`, `Branch 0`, `Jump 0`, `MemtoReg 00`, `ALUOp 10`. Only the ALU decoder needed teaching. A new *format* would have needed the main decoder; a new *operation in an existing format* does not.

**Step 6 — test it with a value where XOR differs from its neighbours.** Take `x5 = 0xF0F0` and `x6 = 0x0FF0`:
```text
  0xF0F0 = 1111 0000 1111 0000      0x0FF0 = 0000 1111 1111 0000
  XOR    = 1111 1111 0000 0000 = 0xFF00    (AND -> 0x00F0, OR -> 0xFFF0)
```
So `xor x5, x5, x6` must leave `0xFF00`. A good test vector is one where all four operations give *different* answers; testing with `0` and `0` proves nothing.

**Step 7 — the I-type twin, `xori`.** Adding `xori x5, x6, 15` (encoding `0x00F34293`) needs one extra decision: `xori` has opcode `0010011`, the same row as `addi`, so the main decoder gives `ALUOp = 11` — and our Module 5 ALU decoder returns ADD for *all* of `ALUOp = 11`. Fix it by looking at `funct3` in that branch too:
```text
   case 0b11:                      // I-type ALU group: funct3 only, never funct7
       if (funct3 == 0b000) return ADD;
       if (funct3 == 0b100) return XOR;
       return ADD;                 // safe default
```

**Step 8 — the assembler, in Java.** The last piece is teaching your tools the new mnemonic. This is the whole tiny assembler; it reproduces every encoding used in these notes.

```java
public class MiniAsm {
    // Each helper packs one instruction format into a 32-bit word.
    static int rType(int f7, int rs2, int rs1, int f3, int rd) {
        return (f7 << 25) | (rs2 << 20) | (rs1 << 15) | (f3 << 12) | (rd << 7) | 0x33;
    }
    static int iType(int imm, int rs1, int f3, int rd, int opcode) {
        return ((imm & 0xFFF) << 20) | (rs1 << 15) | (f3 << 12) | (rd << 7) | opcode;
    }
    static int sType(int imm, int rs2, int rs1) {
        return (((imm >> 5) & 0x7F) << 25) | (rs2 << 20) | (rs1 << 15)
             | (0b010 << 12) | ((imm & 0x1F) << 7) | 0x23;
    }
    static int bType(int imm, int rs2, int rs1, int f3) {
        return (((imm >> 12) & 1) << 31) | (((imm >> 5) & 0x3F) << 25)
             | (rs2 << 20) | (rs1 << 15) | (f3 << 12)
             | (((imm >> 1) & 0xF) << 8) | (((imm >> 11) & 1) << 7) | 0x63;
    }
    static int jType(int imm, int rd) {
        return (((imm >> 20) & 1) << 31) | (((imm >> 1) & 0x3FF) << 21)
             | (((imm >> 11) & 1) << 20) | (((imm >> 12) & 0xFF) << 12)
             | (rd << 7) | 0x6F;
    }

    // The "assembler": mnemonic in, 32-bit word out.
    static int encode(String mnemonic, int rd, int rs1, int rs2, int imm) {
        switch (mnemonic) {
            case "add":  return rType(0x00, rs2, rs1, 0b000, rd);
            case "sub":  return rType(0x20, rs2, rs1, 0b000, rd);
            case "xor":  return rType(0x00, rs2, rs1, 0b100, rd);   // our new instruction
            case "addi": return iType(imm, rs1, 0b000, rd, 0x13);
            case "xori": return iType(imm, rs1, 0b100, rd, 0x13);   // the I-type twin
            case "lw":   return iType(imm, rs1, 0b010, rd, 0x03);
            case "sw":   return sType(imm, rs2, rs1);
            case "beq":  return bType(imm, rs2, rs1, 0b000);
            case "jal":  return jType(imm, rd);
            default:     throw new IllegalArgumentException("unknown: " + mnemonic);
        }
    }

    public static void main(String[] args) {
        System.out.printf("xor  x5,x6,x7  -> 0x%08X%n", encode("xor", 5, 6, 7, 0));
        System.out.printf("xori x5,x6,15  -> 0x%08X%n", encode("xori", 5, 6, 0, 15));
        System.out.printf("sw   x4,0x400  -> 0x%08X%n", encode("sw", 0, 0, 4, 0x400));
    }
}
```
Verified output:
```text
xor  x5,x6,x7  -> 0x007342B3
xori x5,x6,15  -> 0x00F34293
sw   x4,0x400  -> 0x40402023
```

### Formula / rule / table
```text
new instruction = encoding + ALU operation + ALU control row + main control row (only if the opcode is new)
```
**Meaning:** the four places a change can land. **When to use:** as a checklist every time you extend the CPU. **Tiny example:** `xor` needed the first three but *not* the fourth, because its opcode `0x33` was already decoded.

| You are adding... | Encoding | ALU | ALU control | Main control |
|---|---|---|---|---|
| a new R-type operation (`xor`) | new `funct3` | yes | yes | no — opcode `0x33` exists |
| a new I-type operation (`xori`) | new `funct3` | yes | yes (`ALUOp 11` branch) | no — opcode `0x13` exists |
| a new instruction *format* (`jal`) | new opcode | maybe | maybe | **yes** |
| a new branch condition (`bne`) | new `funct3` | no | no | partly — branch condition logic |

**Example question:** Add `andi x5, x6, 0x0F` to the CPU. Give its encoding, list every change, and say what `x5` becomes if `x6 = 0xF5`.

**Solution:**
- Step 1: `andi` is I-type, opcode `0010011`, `funct3 = 111` (the AND code, matching the R-type `and`). *Reason: `andi` is `addi` with a different `funct3`.*
- Step 2: Encoding: `imm = 0x0F = 15`, `rs1 = 6`, `rd = 5`, so `000000001111 00110 111 00101 0010011`. *Reason: I-format field order.*
- Step 3: Bits -> `0000 0000 1111 0011 0111 0010 1001 0011` = `0x00F37293`. *Reason: group into nibbles.*
- Step 4: ALU: AND already exists, so no new hardware — just reuse `ALUControl = 0000`. *Reason: only genuinely new operations need new ALU hardware.*
- Step 5: ALU control: the `ALUOp = 11` branch must now return AND for `funct3 = 111`. That is the one real change. *Reason: `ALUOp = 11` currently only handles `000`.*
- Step 6: Main control: unchanged, because opcode `0x13` already maps to `ALUOp = 11`, `ALUSrc = 1`, `RegWrite = 1`. *Reason: the opcode row already exists.*
- Step 7: Execute: `0xF5 & 0x0F`. `0xF5 = 1111 0101`, masked with `0000 1111` keeps the low nibble -> `0101` = `0x05`. *Reason: AND with a mask clears the bits where the mask is 0.*

**Final answer:** `andi x5, x6, 0x0F` = **`0x00F37293`**; changes are one line in the `ALUOp = 11` branch of the ALU control (return AND for `funct3 = 111`) and one line in the assembler. With `x6 = 0xF5`, `x5 = 0x05`.

⚠️ **Common trap:** Adding the instruction to the ALU and the assembler but forgetting the ALU *control* — the hardware can XOR but nothing ever selects it, so `xor` quietly behaves like `add`. The other trap is testing with `xor` on values where XOR happens to equal OR (any time the two operands share no set bits, e.g. `0x0F ^ 0xF0 = 0xFF = 0x0F | 0xF0`). Pick a test where all the operations differ.

## 6.3 Extending the CPU with the outside world

### Intuition
Right now your CPU can only talk to itself. To affect anything you need a door in the wall. The trick is beautifully simple: give the door an *address*. Then a normal `sw` to that address does not go to memory at all — it goes to a register wired to an LED. The instruction set does not change at all; only the address decoder does.

Analogy: an apartment block where flat 1024 is not a flat but a noticeboard. Post a letter to 1024 and the caretaker pins it up instead of filing it. Nobody posting the letter needs to know.

### The idea, step by step
**Step 1 — decide the memory map.** Peripherals get addresses, and the decoder decides who answers each address.

| Address | Device | Read? | Write? |
|---|---|---|---|
| `0x000` – `0x0FF` | instruction memory | yes (fetch) | no |
| `0x100` – `0x3FF` | data RAM | yes | yes |
| `0x400` | **LED output register** | yes | yes |
| `0x404` | switch input (6.4) | yes | no |

**Step 2 — why `0x400` and not `0x2000`.** `sw`'s immediate is 12-bit **signed**, so it can only reach `-2048 .. +2047`. `0x400 = 1024` fits; `0x2000 = 8192` does not. Real RISC-V solves this with `lui` (load upper immediate) to build a big address in a register first — we do not have `lui` in our subset, so we keep the peripherals low in the map. That is a real design constraint, not a detail.

**Step 3 — write the decoder.** The LED register must be written exactly when the CPU stores to `0x400` — and, crucially, the RAM must *not* be written at the same time.

```text
                 +---------------------+
   MemWrite ---->|                     |
   addr[31:0] -->|   address decoder   |----> RAMWrite  = MemWrite AND (addr < 0x400)
                 |  (compare + gates)  |----> LedWrite  = MemWrite AND (addr == 0x400)
                 +---------------------+----> SwRead    = MemRead  AND (addr == 0x404)
                        ^
                        |
              RAMRead = MemRead AND (addr < 0x400)

   LedWrite --> [ D flip-flop x 32 ] --> LED[31:0]
```

**Step 4 — the store that lights the LED.** `sw x4, 0x400(x0)` = `0x40402023`. Decode it: opcode `0x23` (store), `funct3 = 010` (word), `rs1 = 0`, `rs2 = 4`, `imm = 1024`. In the datapath: `rd1 = 0`, `imm = 1024`, ALU ADD gives address `1024`, `rd2 = x4 = 10`, `MemWrite = 1`. The decoder sees `addr == 0x400`, so `LedWrite = 1` and `RAMWrite = 0`. The value `10` lands in the LED register and stays there.

**Step 5 — the program change.** One line: `sw x4, 0x400(x0)` instead of `sw x4, 0x200(x0)`. Everything else — the loop, the ALU, the control unit — is untouched. That is the whole point: memory-mapped I/O costs you a decoder, not an instruction set.

**Step 6 — why this is the seed of all embedded design.** A microcontroller is your CPU plus a pile of such registers: one for each GPIO pin, one for the UART's transmit byte, one for the timer. Reading and writing those registers *is* embedded programming. When you later write `digitalWrite(13, HIGH)` on an Arduino, the compiler turns it into a store to a fixed address — exactly the `sw` above.

### Formula / rule / table
```text
deviceWrite = MemWrite AND (address == deviceAddress)
deviceRead  = MemRead  AND (address == deviceAddress)
RAMWrite    = MemWrite AND NOT (address == deviceAddress)
```
**Meaning:** each device is enabled only when the memory operation and the address both match — and the RAM must be explicitly *excluded*, because it is enabled by default. **When to use:** every time you add a peripheral. **Tiny example:** `sw` to `0x400` -> `LedWrite = 1`, `RAMWrite = 0`.

**Example question:** You add a second peripheral — an 8-bit "segment display" at `0x404`. What changes in the decoder, and what does `sw x7, 0x404(x0)` do if `x7 = 0x0000002A`?

**Solution:**
- Step 1: The address range must exclude `0x404` from RAM: `RAMWrite = MemWrite AND (addr < 0x400)`. *Reason: RAM was `addr < 0x400` already, so `0x404` was never RAM — check before assuming.*
- Step 2: Add one more comparison: `SegWrite = MemWrite AND (addr == 0x404)`. *Reason: one comparator per device address.*
- Step 3: `sw x7, 0x404(x0)` decodes as store-word, `rs1 = 0`, `rs2 = 7`, `imm = 1028`. *Reason: `0x404 = 1028`, which fits the 12-bit signed field.*
- Step 4: The ALU computes address `0 + 1028 = 1028`; `rd2 = 0x2A`. *Reason: store address = `rs1 + imm`.*
- Step 5: The 8-bit display only has 8 wires, so the decoder takes the low 8 bits: `0x2A = 0010 1010`. *Reason: a narrower peripheral simply ignores the upper bits.*

**Final answer:** add one comparator, `SegWrite = MemWrite AND (addr == 0x404)`, and leave the RAM write condition as `addr < 0x400`. The store writes `0x2A`; the display lights the segments for `0010 1010`.

⚠️ **Common trap:** Forgetting to *exclude* the RAM. If `RAMWrite` is just `MemWrite`, then a store to `0x400` also writes RAM word 256 — usually harmless, but if your LED address overlapped real data it silently corrupts a variable. The second trap is a peripheral wider than the data bus, or one that needs a *byte* store while your CPU only has word stores.

## 6.4 A stretch extension (optional)

### Intuition
Two small extensions prove the point that the architecture is yours. One changes *when a branch is taken*; the other lets the CPU *read* the outside world instead of only writing to it. Neither needs new hardware — only new conditions.

### The idea, step by step
**Step 1 — add `bne` (branch if not equal).** Encoding: same B-format, opcode `1100011`, `funct3 = 001`. `bne x9, x10, 8` = `0x00A49463`.

**Step 2 — see what must change.** `beq` is taken when the ALU's `zero` flag is 1. `bne` is taken when it is 0. So the single AND gate must become a choice:

```text
   zero ----+-->[ MUX ]--> branchCond ----+
            |      ^                       |
    NOT zero+      |                       |
              funct3[0] (0 = beq, 1 = bne) |
                                           v
   Branch ----------------------------->[ AND ]--> branchTaken
```

**Step 3 — nothing else changes.** The ALU still subtracts (`ALUOp = 01`), `RegWrite` is still 0, `MemtoReg` is still `X`. The main decoder still maps opcode `1100011` to `Branch = 1`. Only the condition feeding the AND gate is new. That is one mux and one inverter.

**Step 4 — add an input port.** Put the switches at `0x404`. Reading them is `lw x6, 0x404(x0)` = `0x40402303`. The datapath needs a read-data mux:

```text
   RAMout ----->|         |
   Switches --->|  MUX    |----> readData ----> WB MUX ----> wd
                |         |
                +---------+
                    ^
        addr == 0x404  (from the address decoder)
```

**Step 5 — write the program that uses both.** Read the switches, and loop until they are non-zero:
```text
wait:   lw   x6, 0x404(x0)       # x6 = switch value
        beq  x6, x0, wait        # if still zero, branch back and wait
        sw   x6, 0x400(x0)       # otherwise echo it to the LEDs
```
The `beq`/`x0` test is exactly a "wait until non-zero" — which is why `bne` is convenient but not essential: you can always compare against `x0` and branch on equality.

### Formula / rule / table
```text
beq: taken = Branch AND zero
bne: taken = Branch AND (NOT zero)
```
**Meaning:** one bit of `funct3` selects which polarity feeds the branch AND gate. **When to use:** any new branch condition (`blt`, `bge` would need the ALU's sign/overflow bits as well). **Tiny example:** `x9 = 3`, `x10 = 3` -> `zero = 1` -> `beq` taken, `bne` not taken.

**Example question:** You want a `blt` (branch if less than). Why is it *not* just one mux, and what extra signal does the ALU need to provide?

**Solution:**
- Step 1: `beq`/`bne` only need the `zero` flag, which the subtractor already produces. *Reason: equality is "is the difference zero?"*
- Step 2: "Less than" is not a single flag of a plain subtractor: you need the sign of the difference *and* knowledge of overflow. *Reason: a signed comparison `a < b` is `(a - b)` negative, **unless** the subtraction overflowed, in which case the sign is wrong.*
- Step 3: So the ALU must output `less` (as `slt` already computes: sign of `A - B` XOR overflow) and the branch logic must use it. *Reason: `slt` exists precisely because signed comparison needs more than one bit.*
- Step 4: Concretely: `blt` is taken when `less = 1`; `bge` when `less = 0`. *Reason: same mux pattern, different source flag.*

**Final answer:** `blt` needs the ALU to expose a **`less` (signed-compare) flag** — sign of `A - B` corrected for overflow — and the branch mux to select it instead of `zero`. It is still "one mux", but the mux's *inputs* must be new ALU outputs, so it is a bigger change than `bne`.

⚠️ **Common trap:** Assuming `blt` can use the sign bit of the subtractor output directly. For `x = -2147483648` and `y = 1`, `x - y` overflows and the sign bit gives the wrong answer. That is why `slt` (and a correct `blt`) needs the overflow signal too.

## 6.5 Performance basics

### Intuition
Speed is not one number. A processor can be fast because it does few instructions, or because each instruction takes few cycles, or because each cycle is short. You can trade one against another — and a change that helps one can hurt another. That is why we need a formula instead of a feeling.

Analogy: delivering 1000 parcels. Time = (parcels) x (minutes per parcel) x (cost of a minute). Fewer parcels (better compiler), faster hands (lower CPI), or a cheaper minute (shorter clock) — three independent levers.

### The idea, step by step
**Step 1 — the three quantities.**
- **Clock period** `T` — the length of one cycle in seconds. Its reciprocal is the clock frequency `f = 1/T`.
- **CPI** — cycles per instruction, the average number of clocks one instruction takes.
- **Instruction count** `I` — how many instructions the program executes.

**Step 2 — the master formula.** `CPU time = I x CPI x T`, with `f = 1 / T`. Everything about performance is a consequence of this one line.

**Step 3 — measure our CPU.** In Module 5 we summed the block delays: PC `30` + I-Mem `200` + register read `100` + ALU `180` + D-Mem `250` + register write setup `100` = `860 ps`. That is the critical path, set by `lw`. So:

```text
T = 860 ps = 860 x 10^-12 s      f = 1 / 860 ps = 1.16 GHz
```

**Step 4 — a worked number.** One million instructions at CPI = 1 take `1,000,000 x 1 x 860 ps = 860,000,000 ps = 860 us` (= 0.86 ms). For 20 million instructions: `20,000,000 x 860 ps = 17.2 ms`.

**Step 5 — CPI is an average, so use a weighted mean.** A machine whose instruction classes take different cycle counts has
```text
CPI = sum over classes of ( fraction of class i x CPI of class i )
```
With a mix of 40% ALU at 4 cycles, 25% load at 5, 10% store at 4, 20% branch at 3, 5% jump at 3:
```text
CPI = 0.40x4 + 0.25x5 + 0.10x4 + 0.20x3 + 0.05x3
    = 1.60 + 1.25 + 0.40 + 0.60 + 0.15 = 4.00
```
Then 2 billion instructions at `T = 200 ps` take `2x10^9 x 4.00 x 200 ps = 1.6 s`.

**Step 6 — compare two designs honestly.** Design A: CPI 1.0, `T = 400 ps`. Design B: CPI 1.2, `T = 250 ps`. Same program, 1 billion instructions.
```text
A: 1x10^9 x 1.0 x 400 ps = 0.40 s
B: 1x10^9 x 1.2 x 250 ps = 0.30 s
```
B is faster by `0.40 / 0.30 = 1.33x` even though it needs *more* cycles per instruction. A shorter clock beat a better CPI.

**Step 7 — what makes a processor faster.** Three levers and one warning. **Fewer instructions** `I` (better compiler, better ISA, vector instructions that do four additions at once); **lower CPI** (pipelining, caches, fewer cycles per operation); **shorter `T`** (better circuits, faster transistors, deeper pipelining — which usually *raises* CPI).
- **The warning (Amdahl's law):** if you speed up only part of the machine, the total gain is capped by the part you did not speed up. Making memory 5x faster when only 20% of the time is memory gives `1 / (0.8 + 0.2/5) = 1.19x`, not 5x.

**Step 8 — the same arithmetic in Java.**
```java
public class Perf {
    public static void main(String[] args) {
        double tPs = 860;                    // critical path of our single-cycle CPU
        long instructions = 1_000_000L;
        double cpi = 1.0;                    // single cycle -> CPI is exactly 1
        double cpuTime = instructions * cpi * tPs * 1e-12;   // seconds

        System.out.printf("f = %.2f GHz, 1e6 instructions -> %.0f us%n",
                          1.0 / (tPs * 1e-12) / 1e9, cpuTime * 1e6);

        // weighted CPI from an instruction mix
        double[] frac = {0.40, 0.25, 0.10, 0.20, 0.05};
        int[] cycles = {4, 5, 4, 3, 3};
        double sum = 0;
        for (int k = 0; k < frac.length; k++) sum += frac[k] * cycles[k];
        System.out.printf("weighted CPI = %.2f -> 2e9 instructions take %.2f s%n",
                          sum, 2e9 * sum * 200e-12);
    }
}
```
Verified output:
```text
f = 1.16 GHz, 1e6 instructions -> 860 us
weighted CPI = 4.00 -> 2e9 instructions take 1.60 s
```

### Formula / rule / table
```text
CPU time = I x CPI x T
CPI      = (sum over i of f_i x CPI_i)          with  sum of f_i = 1
speedup  = time_old / time_new
```
**Meaning:** `I` = instruction count, `CPI` = average cycles per instruction, `T` = clock period, `f_i` = fraction of instructions in class `i`. **When to use:** any comparison of two designs, or any "how long does this program take" question. **Tiny example:** `I = 10^6`, `CPI = 1`, `T = 860 ps` -> `860 us`.

**Example question:** A program has 5 million instructions. Your CPU runs it at `T = 860 ps`, CPI = 1. You then add a cache that removes 20% of the cycles spent on loads, at the cost of raising `T` to `950 ps` (the cache sits in the load path). Is the new design faster?

**Solution:**
- Step 1: Baseline time `= 5x10^6 x 1 x 860 ps = 4.3x10^9 ps = 4.3 ms`. *Reason: the master formula.*
- Step 2: The cache change does not alter `I` or `CPI` here — in a single-cycle machine every instruction is still one cycle; the "20% of load cycles saved" can only show up as a shorter critical path. *Reason: with CPI = 1 there is nothing to save within a cycle except time.*
- Step 3: But the critical path got *longer* (`950 ps > 860 ps`), so every instruction is now slower. *Reason: the cache added delay to the load path, and the clock must fit the slowest path.*
- Step 4: New time `= 5x10^6 x 1 x 950 ps = 4.75 ms`. *Reason: same count, longer period.*
- Step 5: `4.75 > 4.3`, so the "optimisation" made it slower. *Reason: in a single-cycle machine, anything that lengthens the critical path hurts every instruction.*

**Final answer:** **No** — the new design takes 4.75 ms versus 4.30 ms. In a single-cycle CPU, saving work inside a cycle buys nothing (CPI is already 1); only shortening the *worst-case path* helps. This is exactly the limit that motivates pipelining.

⚠️ **Common trap:** Using CPI = 1 for a pipelined or cached machine. CPI = 1 is a property of *this* single-cycle design, not of RISC-V. The second trap: mixing units — `860 ps` is `860 x 10^-12 s`, not `860 x 10^-9 s`. A factor-of-1000 slip here is the most common lost mark in performance questions.

## 6.6 Why single-cycle is limited, and the idea of pipelining

### Intuition
In a single-cycle CPU, every instruction waits for the slowest one. An `add` needs 610 ps of work, but it is not allowed to finish early — it sits until the 860 ps `lw` clock runs out. And no two instructions ever overlap: while one is in the ALU, the instruction memory is idle.

Pipelining fixes both by turning computation into an assembly line. Each instruction still visits all five stations, but five instructions are in the factory at once, one per station. Analogy: a car wash with five bays. One car takes 5 minutes end to end, but a new car comes out every minute.

### The idea, step by step
**Step 1 — name the waste.** Our block delays are IF 230 ps, ID 100 ps, EX 180 ps, MEM 250 ps, WB 100 ps — sum 860 ps. So an R-type instruction (no MEM stage) uses only 610 ps and wastes 250 ps, and `beq` uses 510 ps and wastes 350 ps. The clock is set by the worst case and everyone pays for it.

**Step 2 — the five classic stages.**

| Stage | Name | What it does | Delay |
|---|---|---|---|
| IF | instruction fetch | PC -> instruction memory | 230 ps |
| ID | instruction decode / register read | decode fields, read `rs1`, `rs2`, sign-extend | 100 ps |
| EX | execute | ALU operation / address calculation | 180 ps |
| MEM | memory access | data memory read or write | 250 ps |
| WB | write back | write result into `rd` | 100 ps |

**Step 3 — the assembly line, as a space-time chart.** Rows are instructions, columns are clock cycles; each cell shows the stage that instruction is in.

```text
             cycle 1   cycle 2   cycle 3   cycle 4   cycle 5   cycle 6   cycle 7
  instr 1      IF        ID        EX        MEM       WB
  instr 2                IF        ID        EX        MEM       WB
  instr 3                          IF        ID        EX        MEM       WB
  instr 4                                    IF        ID        EX        MEM
  finished:      0         0         0         0         1         2         3
```
Once the pipe is full, one instruction finishes every cycle — throughput becomes one per clock, even though each instruction still takes five clocks from start to finish.

**Step 4 — the new clock period.** In a pipeline the clock must fit the *slowest stage*, not the whole instruction: `T = max(230, 100, 180, 250, 100) = 250 ps`. So `f = 4.0 GHz`, against `1.16 GHz` before.

**Step 5 — the honest speedup.** `860 / 250 = 3.44x`, not 5x, because the stages are unbalanced — MEM is 250 ps while ID is only 100 ps. For 20 million instructions: `17.2 ms` becomes about `5.0 ms`.

**Step 6 — hazards, named only.** Pipelining is not free, because instructions now overlap and can get in each other's way. Three kinds, which you will study properly in a later course:
- **Structural hazard** — two instructions want the same hardware in the same cycle (e.g. one wants to read data memory while another fetches an instruction from it).
- **Data hazard** — an instruction needs a value that the instruction ahead of it has not written back yet (`add x1, x2, x3` then `sub x4, x1, x5`).
- **Control hazard** — you do not know whether a branch is taken until the branch is executed, but you have already fetched the next instruction.

**Step 7 — where this goes.** Deeper pipelines (10, 15, 20 stages) give shorter clocks but more hazard pain, more power and worse branch penalties — the central trade-off of processor design, and why the industry settled on moderately deep, superscalar pipelines.

### Formula / rule / table
```text
T_pipelined = max over stages of (stage delay)
speedup     = T_single / T_pipelined        (ideal, ignoring hazards and fill)
```
**Meaning:** the clock is set by the slowest stage; the ideal speedup equals the number of stages only if all stages are equal. **When to use:** comparing a single-cycle design with a pipelined one. **Tiny example:** stages `230/100/180/250/100` ps -> `T = 250 ps` -> `speedup = 860/250 = 3.44x`.

**Example question:** You split the 250 ps MEM stage into two 125 ps stages, giving a 6-stage pipeline. What is the new clock period and speedup, ignoring hazards?

**Solution:**
- Step 1: The stage list becomes `230, 100, 180, 125, 125, 100`. *Reason: one stage split in two.*
- Step 2: `T = max(...) = 230 ps` — now IF is the slowest. *Reason: the maximum moved to a different stage.*
- Step 3: `f = 1 / 230 ps = 4.35 GHz`. *Reason: `f = 1/T`.*
- Step 4: Speedup `= 860 / 230 = 3.74x`, up from 3.44x. *Reason: same formula.*
- Step 5: To do better you must split IF too — the gain per extra stage shrinks as the stages balance. *Reason: you are levelling the maximum, and the maximum can only fall to the average, `860/6 = 143 ps`.*

**Final answer:** `T = 230 ps`, `f = 4.35 GHz`, speedup `3.74x`. Splitting further can at best reach `T = 143 ps` (a perfectly balanced 6-stage pipe) before the added register overhead eats the gain.

⚠️ **Common trap:** Saying "pipelining makes each instruction finish in one cycle instead of five." It does not — each instruction still takes five cycles of *latency*. Pipelining improves **throughput** (instructions completed per second), not latency. The second trap: quoting the ideal speedup (5x) as the real one when the stages are unequal.

## 6.7 Caching and parallelism

### Intuition
Two ideas, both about not waiting. A **cache** is a small, fast copy of the data you are likely to need next, kept next to the CPU — like keeping the salt on the table instead of walking to the pantry each time. **Parallelism** is doing several things at once — more cooks, not faster chopping.

### The idea, step by step
**Step 1 — the hierarchy, revisited.** Module 4 introduced this; here is what it costs in *time*, which is the only thing performance cares about.

| Level | Typical size | Typical access time | Managed by |
|---|---|---|---|
| registers | 32 x 4 bytes | under 1 cycle | the compiler |
| L1 cache | 16–64 KB | a few cycles | hardware, automatically |
| L2 / L3 cache | hundreds of KB to MBs | tens of cycles | hardware |
| DRAM (main memory) | GBs | hundreds of cycles | hardware + OS |
| flash / SSD | hundreds of GB | thousands to millions of cycles | OS |

The pattern to remember: each level down is roughly 10x bigger and 10x slower. A cache exists so that most accesses stop at a fast level.

**Step 2 — why a cache can work at all: locality.** Programs are not random.
- **Temporal locality** — if you used something, you will probably use it again soon (the loop counter `x2`, the instruction at `0x10` fetched 5 times in our trace).
- **Spatial locality** — if you used address `X`, you will probably use `X+4` soon (our array walk `0x100, 0x104, 0x108, 0x10C`).

Our array-sum program is a textbook case: one cache line holding `0x100`–`0x10C` serves all four loads.

**Step 3 — the arithmetic of a hit rate.** Suppose a hit costs 1 cycle, a miss costs 100 cycles, and 95% of accesses hit:
```text
average = 0.95 x 1 + 0.05 x 100 = 0.95 + 5 = 5.95 cycles
speedup vs always-missing = 100 / 5.95 = 16.8x
```
Note how a *5%* miss rate still dominates the average — that is why cache design is obsessed with hit rate.

**Step 4 — the kinds of parallelism.**
- **ILP (instruction-level parallelism)** — overlap instructions from one program: pipelining, and beyond it *superscalar* issue (several instructions start per cycle).
- **TLP (thread-level)** — several cores, or several threads per core.
- **DLP (data-level)** — one instruction on many data items: SIMD, vector units, GPUs.
- **Accelerators** — specialised blocks (an NPU for neural nets, a video decoder) that do one job far faster than a general CPU.

**Step 5 — the direction of modern computing.** Clock frequency stopped rising around the mid-2000s (power and heat — the "power wall"), so the industry moved to more cores, wider vectors and specialised accelerators. That is why your phone has a CPU, a GPU and an NPU: parallelism and specialisation, not raw clock speed.

### Formula / rule / table
```text
average access time = hit_rate x hit_time + miss_rate x miss_time
```
**Meaning:** the weighted mean of a fast case and a slow case, which is exactly the weighted-CPI formula from 6.5 in different clothes. **When to use:** any "is a cache worth it" question. **Tiny example:** 95% at 1 cycle, 5% at 100 -> `5.95` cycles average.

**Example question:** A cache has a 90% hit rate, hit time 1 cycle, miss time 50 cycles. A program makes 10 million memory accesses. How many cycles does memory cost, and what hit rate would you need to halve that?

**Solution:**
- Step 1: `average = 0.90 x 1 + 0.10 x 50 = 0.9 + 5.0 = 5.9 cycles`. *Reason: weighted mean.*
- Step 2: Total `= 10^7 x 5.9 = 5.9 x 10^7` cycles. *Reason: multiply by the access count.*
- Step 3: To halve it we need `average = 2.95`, so `2.95 = h x 1 + (1-h) x 50`. *Reason: same formula, unknown hit rate.*
- Step 4: `2.95 = h + 50 - 50h = 50 - 49h`, so `49h = 47.05`, giving `h = 0.96`. *Reason: solve the linear equation.*
- Step 5: Check: `0.96 x 1 + 0.04 x 50 = 0.96 + 2.0 = 2.96` — right. *Reason: substitute back.*

**Final answer:** `5.9 x 10^7` cycles at 90%; you would need a **96%** hit rate to halve it. A 6-point improvement in hit rate halves the memory cost — that is the leverage caches give you.

⚠️ **Common trap:** Thinking a cache "adds memory" or "makes memory bigger". A cache is a *copy*; the data still lives in DRAM, and a write must eventually reach it. The second trap: assuming a cache always helps — a program with no locality (random access over a huge array) can have a hit rate near zero, and then the cache is pure overhead.

## 6.8 From your CPU to the real world and the forward map

### Intuition
What you built is not a toy version of a processor — it *is* a processor, with fewer instructions and no pipeline. Everything bigger is the same picture with more of it. Once you have seen the whole loop closed (instruction -> decode -> datapath -> result), the rest of computer engineering stops being a mystery and becomes a set of extensions you can list.

### The idea, step by step
**Step 1 — the microcontroller.** A real embedded chip is your CPU plus: flash memory for the program (instruction memory that keeps its contents when power is off), SRAM for data, and a block of memory-mapped peripherals — GPIO, timers, UART, ADC. Our `0x400` LED register is exactly this pattern. A chip like this is what runs a washing machine.

**Step 2 — the VLSI step.** Your design is currently a diagram or a schematic. Turning it into silicon is a pipeline of its own: describe it in an HDL (Verilog/VHDL) -> **synthesis** to gates -> **place and route** to a physical layout -> **tape-out** -> fabrication. That is what the CMOS VLSI course covers, and it is why area, power and timing become first-class concerns there — your `860 ps` critical path becomes a physical constraint on where transistors may sit.

**Step 3 — the edge-AI accelerator.** A neural network's inner loop is a huge number of multiply-accumulate operations on arrays of numbers. A general CPU does them one at a time. An NPU instead builds a grid of multipliers with local storage (a systolic array) and streams data through — the same idea as our ALU, replicated and specialised, with a very wide datapath. TinyML pushes the same thing down to microcontrollers.

**Step 4 — the forward map.** What each later course adds to the machine you built:

| Course | What it adds to your CPU |
|---|---|
| Embedded System Design & IoT | peripherals, interrupts, timers, low-power modes, real-time constraints |
| CMOS VLSI | your diagram as transistors: area, delay, power, layout, tape-out |
| Embedded AI / TinyML | quantised arithmetic, MAC arrays, model deployment on an MCU |
| Edge-AI / NPU architecture | systolic arrays, dataflow, memory bandwidth for accelerators |
| Advanced computer architecture | pipelining in depth, hazards, caches, out-of-order, multicore |

**Step 5 — what your CPU still cannot do.** An honest list, so you know the shape of what is missing: `lui`/`auipc` (big constants and position independence), `jalr` (indirect calls and returns, needed for real functions), byte and half-word loads/stores, `M`-extension multiply/divide, `sltu` and unsigned compares, exceptions and interrupts (no trap handling at all), and any notion of privilege levels. Each is an extension of the same four-place checklist from 6.2.

### Formula / rule / table
```text
your CPU + memory + peripherals + interrupts  ->  a microcontroller
your CPU as gates + timing + power            ->  a VLSI chip
your CPU's ALU replicated and specialised     ->  an accelerator
```
**Meaning:** three scaling directions from one design. **When to use:** to place any new topic you meet on the map. **Tiny example:** our LED register at `0x400` is a one-device version of a GPIO peripheral.

**Example question:** You must turn your CPU into a battery-powered temperature logger: read a sensor every second, store readings, and sleep in between. Which three extensions matter most, and why?

**Solution:**
- Step 1: **A timer peripheral plus interrupts.** Polling in a loop wastes power; an interrupt lets the CPU sleep and wake only when the timer fires. *Reason: power is dominated by the time spent awake.*
- Step 2: **A wider input path (ADC or a memory-mapped sensor register).** The sensor value must appear at an address you can `lw`. *Reason: memory-mapped I/O is the only mechanism you have for input.*
- Step 3: **More storage or a serial port (UART/SPI) to get data out.** Internal RAM is tiny; readings must leave the chip. *Reason: `sw` to a peripheral is how data leaves.*
- Step 4: A low-power sleep mode is a control-unit change: gate the clock when idle. *Reason: the clock is what burns dynamic power.*

**Final answer:** a **timer + interrupt controller**, a **memory-mapped sensor input**, and a **serial output** — plus clock gating for sleep. Note that all three are the same trick as 6.3: give a new device an address and a decoder.

⚠️ **Common trap:** Thinking a real microcontroller is a different kind of machine from what you built. It is not — it is your datapath plus more addresses and a trap mechanism. What *is* genuinely different in real chips is the amount of engineering around timing, power and verification.

## 6.9 Reflection

### Intuition
At the start of the course a computer was magic: you typed, something happened. Now you know that between the typing and the happening there is a clock, a counter, a memory that hands out 32 bits, a decoder that raises a handful of wires, and an ALU that adds. You have traced every one of those wires for a real instruction, and then you changed the machine to do something it did not do before.

### The idea, step by step
**Step 1 — what you can now do, concretely.** Read a hex word and say what instruction it is. Hand-assemble an instruction. Predict a register's value after N cycles. Explain why a `lw` is slower than an `add`. Add an instruction to a working CPU and prove it works. Wire a peripheral to an address. Compute a CPU's clock frequency from its critical path.

**Step 2 — the three ideas that transfer everywhere.** *Abstraction* (the ISA hides the datapath); *the critical path sets the clock* (true of any synchronous digital system); *trade-offs are quantitative* (CPI vs clock vs instruction count — never "just make it faster").

**Step 3 — what to do next.** Extend your CPU with `lui` + `jalr` so it can call functions, then add a 5-stage pipeline and measure the real speedup against the 3.44x ideal. Both are small projects, and both will teach you more than reading about them.

### Formula / rule / table
```text
a computer = a clock + a PC + a memory of 32-bit words + a decoder + an ALU + a register file
```
**Meaning:** that is the whole machine, and you have built all six parts. **When to use:** whenever a processor starts to feel like magic again. **Tiny example:** our trace's 30 cycles is that machine, doing 30 laps.

**Example question:** A friend says "a CPU is basically a very fast calculator." In three lines, say what that gets right and what it misses.

**Solution:**
- Step 1: It gets the ALU right — arithmetic is at the centre, and it is fast. *Reason: every instruction we built funnels through the ALU or the memory.*
- Step 2: It misses the *sequencing*: a calculator has no PC, no stored program, and no way to decide what to do next. *Reason: the PC and the branch unit are what make it a computer rather than a calculator.*
- Step 3: It also misses that speed comes from the clock and the critical path, not from "being a calculator". *Reason: performance is `I x CPI x T`, not arithmetic throughput alone.*

**Final answer:** right that arithmetic is central; wrong that this is what makes it a computer — the stored program, the PC and the control unit are, and speed is a clock-and-path property, not a calculator property.

⚠️ **Common trap:** Deciding the subject is "done" because the CPU works. A single-cycle CPU with ten instructions is the *start* of architecture, not the end: pipelining, caches, exceptions and parallelism are all still ahead, and every one of them builds directly on the datapath you just wired.

## Formula / rule summary table

**Adding something to your CPU: which part changes?**

| You want to add... | Encoding table | ALU | ALU control | Main control | Decoder / mux |
|---|---|---|---|---|---|
| new R-type op (`xor`) | new `funct3` | yes | yes | no | no |
| new I-type op (`xori`, `andi`) | new `funct3` | maybe | yes | no | no |
| new format (`jal`) | new opcode | — | — | yes | new WB mux input |
| new branch (`bne`) | new `funct3` | no | no | no | branch-condition mux |
| output peripheral | — | no | no | no | address comparator |
| input peripheral | — | no | no | no | read-data mux |

**The numbers of your machine**

```text
block delays    PC 30 | I-Mem 200 | reg read 100 | ALU 180 | D-Mem 250 | reg write 100  (ps)
critical path   860 ps  (the lw path)      f = 1.16 GHz
CPI             1.0  (single cycle)  ->  cycles = instructions
pipeline        5 stages 230/100/180/250/100 -> T = 250 ps, f = 4.0 GHz, speedup 3.44x
program         11 instructions, 30 cycles, sum = 10 at address 0x400
```

**Which formula when?**
- "How long does this program take?" -> `CPU time = I x CPI x T`.
- "What is the average CPI?" -> the weighted mean `sum(f_i x CPI_i)`.
- "How fast is the clock?" -> `f = 1 / critical path`.
- "How much faster is the pipelined version?" -> `T_single / T_pipe` (ideal only).
- "Is the cache worth it?" -> `hit_rate x hit_time + miss_rate x miss_time`.
- "Which part should I speed up?" -> Amdahl: `1 / ((1-p) + p/k)`.

## Solved examples

**Example 1 (easy) — predict the trace.** Starting from the state after cycle 20 of the trace in 6.1 (`x1 = 268`, `x2 = 3`, `x4 = 6`, `x5 = 3`), what happens in cycles 21 to 24?

- Step 1: Cycle 21 is `addi x2, x2, 1` at `pc = 0x20`, so `x2 = 3 + 1 = 4`. *Reason: `addi` adds the immediate.*
- Step 2: Cycle 22 is `jal x0, -20` at `pc = 0x24`, so `PC = 0x24 - 20 = 0x10`. *Reason: the jump offset is relative.*
- Step 3: Cycle 23 is `beq x2, x3, 24` with `x2 = 4` and `x3 = 4`, so it is **taken**: `PC = 0x10 + 24 = 0x28`. *Reason: equality holds, so `zero = 1` and `PCSrc = 1`.*
- Step 4: Cycle 24 is the `sw` at `pc = 0x28`, storing `x4 = 10` to `0x400`. *Reason: the loop exited, so the store runs.*
- Step 5: So the run ends at cycle 24 here instead of 30 — this is the trace *truncated* after three iterations, which is why `x4` is 6 at the start. *Reason: with `x2` jumping to 4, the fourth iteration is skipped.*

**Final answer:** cycle 21 `x2 <- 4`; cycle 22 `PC <- 0x10`; cycle 23 branch **taken**, `PC <- 0x28`; cycle 24 `mem[0x400] <- 10`.

**Example 2 (medium) — a full extension.** Add `andi` to the CPU and show the complete diff, then compute `0x3C & 0x0F`.

- Step 1: Encoding: I-type, opcode `0010011`, `funct3 = 111`, `imm = 15`, `rs1 = 6`, `rd = 5` -> `0x00F37293`. *Reason: same format as `addi`, only `funct3` differs.*
- Step 2: ALU: AND already exists (used by `and`), so no new hardware — only `ALUControl = 0000` needs to be reachable from the I-type path. *Reason: reuse beats addition.*
- Step 3: ALU control: extend the `ALUOp = 11` branch to `if (funct3 == 0b111) return AND;`. *Reason: `ALUOp = 11` is the I-type ALU group.*
- Step 4: Main control: no change — opcode `0010011` already gives `RegWrite 1`, `ALUSrc 1`, `ALUOp 11`. *Reason: the row exists.*
- Step 5: Assembler: add `case "andi": return iType(imm, rs1, 0b111, rd, 0x13);`. *Reason: tools must know the mnemonic.*
- Step 6: Execute: `0x3C = 0011 1100`, `0x0F = 0000 1111`; AND keeps only bits set in both -> `0000 1100` = `0x0C`. *Reason: AND with a mask clears the high bits.*

**Final answer:** `andi x5, x6, 0x0F` = `0x00F37293`; changes are one line in the ALU control and one line in the assembler (plus a test). Result `0x0C`.

**Example 3 (exam level) — performance plus a peripheral.** Your CPU at `T = 860 ps` runs a program of 2 million instructions, CPI = 1, and 30% of the instructions are loads. You add a cache that shortens the load path so the critical path drops to 700 ps. What is the new run time, and what speedup do you get?

- Step 1: Old time `= 2x10^6 x 1 x 860 ps = 1.72x10^9 ps = 1.72 ms`. *Reason: master formula.*
- Step 2: The cache does not change `I` or `CPI` (still one cycle per instruction). *Reason: single-cycle machine.*
- Step 3: But it shortens the worst-case path: `T = 700 ps`. *Reason: the load path was the critical one.*
- Step 4: New time `= 2x10^6 x 1 x 700 ps = 1.40 ms`. *Reason: same count, shorter period.*
- Step 5: Speedup `= 1.72 / 1.40 = 1.23x`. *Reason: `time_old / time_new`.*
- Step 6: New frequency `= 1/700 ps = 1.43 GHz`, up from 1.16 GHz. *Reason: `f = 1/T`.*
- Step 7: Sanity check with Amdahl: only the load path improved, and the loads are 30% of instructions, so a large local gain still gives a modest overall gain. *Reason: the other 70% of instructions cannot go faster than 700 ps either.*

**Final answer:** new time **1.40 ms**, speedup **1.23x**, new clock **1.43 GHz**. Note the gain is limited because *every* instruction now waits on the same 700 ps clock.

## Common traps and mistakes
- **Mixing up the cycle's PC and the next PC.** The `pc` column is what executes *this* cycle; `next pc` is after the edge. Off-by-one everywhere if you swap them.
- **Adding an ALU operation but not the ALU control row.** The hardware can do it; nothing selects it; the instruction silently behaves like `add`.
- **Testing a new instruction on uninformative inputs.** `xor` on `0x0F` and `0xF0` gives the same answer as `or`. Choose inputs where all operations differ.
- **Assuming a new instruction always needs a main-control change.** If the opcode already exists (`0x33`, `0x13`), it does not.
- **Forgetting to gate the RAM write when adding a peripheral.** Then a store to the LED also writes memory.
- **Placing a peripheral above `+2047`.** The 12-bit signed immediate cannot reach it; you need `lui` (which our subset lacks).
- **Using CPI = 1 for a pipelined machine.** CPI = 1 is a property of this design, not of RISC-V.
- **Quoting the ideal pipelining speedup.** `860/250 = 3.44x`, not 5x — the stages are unequal, and hazards and fill make it worse.
- **Saying pipelining reduces instruction latency.** It reduces *throughput* time per instruction completed, not the five-stage latency of one instruction.
- **Unit slips in performance arithmetic.** `860 ps = 860 x 10^-12 s`. A factor of 1000 is the single most common lost mark.

## Quick revision box
- ✅ Run-then-verify: 11 instructions, 30 cycles, `x4 = 10`, `mem[0x400] = 10`, `x1 = 272`. CPI = 1 so cycles = instructions.
- ✅ Adding an instruction touches four places: encoding, ALU operation, ALU control row, main control row (the last only if the opcode is new).
- ✅ `xor` = opcode `0x33`, `funct3 100`, `funct7 0000000` -> `0x007342B3`; it needs no main-control change.
- ✅ Memory-mapped I/O: `LedWrite = MemWrite AND (addr == 0x400)`, and `RAMWrite` must *exclude* that address.
- ✅ Peripherals must sit within `-2048 .. +2047` because the store immediate is 12-bit signed; `0x2000` would need `lui`.
- ✅ `CPU time = I x CPI x T`; weighted `CPI = sum(f_i x CPI_i)`; our `T = 860 ps`, `f = 1.16 GHz`.
- ✅ Single-cycle wastes the gap between the worst case (`lw`, 860 ps) and the best case (`beq`, 510 ps). Pipelining gives `T = 250 ps`, `f = 4.0 GHz`, speedup 3.44x.
- ✅ Hazards are named, not solved, here: structural (same hardware), data (value not ready), control (branch unknown).

## Practice questions
1. In the 6.1 trace, which cycle has the first taken branch, and what is `x2` at that moment?
2. Encode `xor x9, x10, x11`, then say which control signals change compared with `add x9, x10, x11`.
3. Add `ori` to the CPU. Give its encoding for `ori x5, x6, 0x30`, list the changes, and compute the result if `x6 = 0x0F`.
4. A store to `0x400` also corrupts the data at RAM address `0x400`. What is wrong, and what is the corrected decoder expression?
5. A program has 8 million instructions, CPI = 1, `T = 860 ps`. You shorten the critical path to 600 ps but the compiler also makes it run 10% more instructions. Is the new version faster, and by how much?
6. Explain in three lines why adding a cache to a *single-cycle* CPU cannot reduce CPI, and what it can reduce instead.

## Answers
1. The first taken branch is **cycle 29** (`beq x2, x3, 24` at `pc = 0x10`), and at that moment `x2 = 4` (set in cycle 27), equal to `x3 = 4`, which is why it is taken and `next pc = 0x28`.
2. `xor x9, x10, x11` = `0000000 01011 01010 100 01001 0110011` = **`0x00B544B3`**. No control signal changes: it is the same opcode `0x33`, so `RegWrite 1, ALUSrc 0, MemRead 0, MemWrite 0, Branch 0, Jump 0, MemtoReg 00, ALUOp 10` — only `ALUControl` changes, from `0010` (ADD) to `0011` (XOR).
3. `ori` is I-type, opcode `0010011`, `funct3 = 110`, `imm = 0x30 = 48`, `rs1 = 6`, `rd = 5` -> `000000110000 00110 110 00101 0010011` = **`0x03036293`**. Changes: one line in the `ALUOp = 11` branch of the ALU control (`funct3 == 110` -> OR; no new ALU hardware) and one line in the assembler. `0x0F | 0x30 = 0x3F`.
4. `RAMWrite` is not excluding the peripheral address. Correct form: `RAMWrite = MemWrite AND (addr < 0x400)` and `LedWrite = MemWrite AND (addr == 0x400)` — the two conditions must be mutually exclusive.
5. Old: `8x10^6 x 1 x 860 ps = 6.88 ms`. New: instructions `= 8x10^6 x 1.1 = 8.8x10^6`, so time `= 8.8x10^6 x 600 ps = 5.28 ms`. Speedup `= 6.88 / 5.28 = 1.30x` — **yes, faster by about 1.30x**; the 30% shorter clock beat the 10% extra instructions.
6. CPI = 1 because a single-cycle machine has exactly one clock per instruction by construction — there are no extra cycles to remove. A cache can only shorten the *critical path* (the load path), which shortens `T`; CPI can only fall below 1 in a machine that already takes more than one cycle per instruction, such as a pipelined or multicycle design.
