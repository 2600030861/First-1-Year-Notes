# Digital Design & Computer Architecture – Module 5
## The RISC-V Processor
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture
For four modules you have been building body parts. Module 2 gave you an ALU (the calculator), Module 3 gave you registers and a counter (memory and a heartbeat), Module 4 gave you a register file and a memory (the storage). Module 5 is where we wire them together and the machine starts *doing things*. Two separate ideas meet here, and it pays to keep them apart: the **instruction set** (the list of commands and the exact bit patterns that mean each one — software's view) and the **datapath + control** (the wires and gates that actually carry them out — hardware's view). Analogy: a restaurant. The **menu** is the instruction set ("veg thali, item code 7"). The **kitchen** is the datapath — stove, cook, plates. The **head chef shouting orders** is the control unit, reading the item code and telling each station what to do this minute. A menu item the kitchen cannot cook is a lie; a kitchen that can cook things nobody can order is wasted. The instruction set and the datapath must match item by item. This is also the module where the course's north star — a working RISC-V CPU — stops being a picture and becomes something you can trace signal by signal.

## Basics you must know first
- **Two's complement** — how negatives are stored; `-4` in 12 bits is `1111 1111 1100`. Needed for every immediate field.
- **Hexadecimal** — one hex digit = 4 bits, so a 32-bit instruction is 8 hex digits. `0x` just marks a hex number.
- **The ALU with an operation-select input** (Module 2) — takes two numbers plus a code like `0010` and produces `A + B`.
- **The register file** (Module 4) — 32 slots, two read ports, one write port, writes only when `RegWrite = 1`.
- **The program counter** (Module 3) — a 32-bit register holding the address of the next instruction.
- **Edge-triggered flip-flops** (Module 3) — state changes only at the clock edge, which is why we can say "one instruction per cycle".

## 5.1 The stored-program idea

### Intuition
Think of a recipe book next to the vegetables. In the earliest computers the "recipe" was *wiring* — to run a different calculation you re-plugged cables. The stored-program idea says: write the recipe down as numbers and put it in the same memory as the ingredients. Changing the program now means changing numbers, not hardware. That single move is why a computer is a *general* machine: the hardware stays, the numbers change.

### The idea, step by step
**Step 1 — one memory, two kinds of content.** Instructions and data share one memory, addressed by number. Address `0x00` might hold `0x10000093` (an instruction); address `0x100` might hold `1` (data). Nothing in the memory says which is which — the CPU decides by *how it uses* the value: fed to the control unit it was an instruction, fed to the ALU it was data.

**Step 2 — instructions are just numbers, all the same size.** Every RISC-V instruction is exactly 32 bits (4 bytes), so instruction addresses step by 4: `0x00, 0x04, 0x08, ...`. The next instruction is always at `PC + 4` — no searching.

**Step 3 — fetch and execute, forever.** Fetch (read the 32 bits at `PC`), decode (work out which instruction it is and raise its control signals), execute (let the datapath do it), update (`PC <- PC + 4`, or the branch/jump target) — then repeat.

**Step 4 — a tiny memory picture.**

```text
address  contents(hex)  role
0x00     10000093       addi x1, x0, 0x100   <- instruction
0x100    00000001       the number 1         <- data
```

Notice `0x00000001` at `0x100` would also decode as a valid instruction. That is the point: the bit pattern is neutral; only the CPU's use gives it meaning. It is also why a bug that jumps into data crashes the machine — the CPU cheerfully tries to execute `1`.

### Formula / rule / table
```text
next instruction address = PC + 4
```
**Meaning:** `PC` is the program counter, `4` is the size of one instruction in bytes. **When to use:** for every instruction that is not a taken branch or a jump. **Tiny example:** `PC = 0x14` -> next fetch from `0x18`.

**Example question:** A memory word `0x00520233` sits at address `0x18`. Is it an instruction or data? If the CPU fetches it as an instruction and it is not a branch, what is the next fetch address?

**Solution:**
- Step 1: Look at the low 7 bits, `0x33` = `0110011` — the RISC-V opcode for the R-type arithmetic group. *Reason: the opcode is always bits `6:0`, so any word can be classified by it.*
- Step 2: Since the CPU is fetching from instruction memory at `PC = 0x18`, it treats the word as an instruction. *Reason: position in the fetch stream is what makes a word an instruction.*
- Step 3: It is not a branch or jump, so the next address is `PC + 4 = 0x18 + 0x04`. *Reason: every instruction is 4 bytes.*
- Step 4: `0x18 + 0x04 = 0x1C`.

**Final answer:** It is being used as an instruction (opcode `0x33`, R-type), and the next fetch is from `0x1C`.

⚠️ **Common trap:** Saying "the word at `0x18` *is* an instruction" as if memory labelled it. Memory has no labels — the same 32 bits would be plain data if an `lw` read them. Also wrong: "instructions live in a separate instruction memory, so they are a different kind of thing." In a von Neumann machine it is one memory, one kind of bits.

## 5.2 Instruction Set Architecture (ISA)

### Intuition
An ISA is a *contract*. You (the compiler writer) promise to ask only for the commands on the list, in the exact bit patterns on the list. The hardware designer promises every one of those patterns will work. Neither side needs to know what the other did inside. Real-life picture: a 3-pin socket. It does not care whether you plug in a fan or a charger — the plug shape is fixed, the appliance internals are free. That is why the same program compiled for RISC-V runs on chips from any vendor.

### The idea, step by step
**Step 1 — what the contract fixes.** The instruction set, the register set, the data types and sizes, the addressing modes, and the memory model (byte-addressed, little-endian for RISC-V). It does **not** fix how fast, how many pipeline stages, or how the gates are arranged — that is *microarchitecture*: the "how", not the "what".

**Step 2 — why RISC-V.** "RISC-V" is said "risk five"; the V is the Roman numeral, as it is the fifth generation of RISC designs from UC Berkeley. Four practical reasons:
- **Open** — the specification is free and public, so you can build a chip with no licence fee. ARM and x86 are proprietary.
- **Clean** — designed recently, with 40 years of ISA lessons already learned. No legacy quirks to memorise.
- **Modular** — a tiny base (`RV32I`, the integer base) plus optional bolt-ons: `M` multiply/divide, `F`/`D` floating point, `C` compressed 16-bit instructions, `A` atomics, `V` vectors. You pay only for what you use — which is exactly why a first-year course can take a 10-instruction slice of `RV32I`.
- **Real** — commercial cores, microcontroller chips and research processors all use it.

**Step 3 — India's stake.** India's microprocessor effort is built around RISC-V precisely because it is open: IIT Madras's **Shakti** processor family and C-DAC's **Vega** cores are indigenous RISC-V designs, and the government's **Digital India RISC-V (DIR-V)** programme is organised around them. The architecture you are about to build in a simulator is the one Indian teams are taping out in silicon.

**Step 4 — the two families, for contrast.** CISC (x86) has many complex variable-length instructions; RISC (RISC-V, ARM, MIPS) has few simple fixed-length ones that are easy to pipeline. Our datapath is simple *because* the instruction set is simple — that is the whole RISC bet.

### Formula / rule / table
**Comparison.** CISC (x86) has many complex, variable-length instructions (1 to 15 bytes) and lets operands come from memory; decoding is hard and pipelining is harder. RISC (RISC-V, ARM) has few simple fixed-length instructions, ALU work on registers only, easy decoding and a natural pipeline fit.

**Example question:** Your friend says "RISC-V is better than ARM because it is faster." Is that a correct statement about the ISA? Two lines.

**Solution:**
- Step 1: Separate ISA from microarchitecture. *Reason: speed comes from the implementation — pipeline depth, cache size, clock, transistor budget.*
- Step 2: The ISA only fixes which instructions exist and how they are encoded. Two RISC-V chips can be 100x apart in speed. *Reason: a contract does not say how fast you honour it.*
- Step 3: What RISC-V genuinely offers is openness (no fee), simplicity (easier to build fast) and modularity.

**Final answer:** No. Speed is a property of the microarchitecture, not the ISA. RISC-V's real advantages are open, clean and modular — which make it *easier* to build a fast chip, not automatically faster.

⚠️ **Common trap:** Writing "RISC has fewer instructions, so programs are shorter." Often the opposite: a RISC program needs *more* instructions (one x86 `add` can do memory-to-memory work that takes `lw`, `add`, `sw` in RISC-V). RISC wins on regularity and speed per instruction, not on instruction count.

## 5.3 A bounded RISC-V subset (about ten instructions)

### Intuition
You do not need all of RISC-V to build a CPU — just enough to write real programs: something to do maths, something to touch memory, something to decide, something to jump. Ten instructions is that minimum, and it is exactly what we will wire up. It is the "survival kit" version of the language: loops, ifs, array sums and function calls all still fit.

### The idea, step by step
**Step 1 — the arithmetic/logic five.** `add`, `sub`, `and`, `or`, `slt`, all R-type: two source registers, one destination. `slt` ("set less than") sets `rd = 1` if `rs1 < rs2` (signed) else `0`. It looks odd, but it is how you build `<` and `>` — RISC-V has no condition flags, so the comparison result is materialised as a 0 or 1.

**Step 2 — one immediate.** `addi rd, rs1, imm` computes `rd = rs1 + imm` with a 12-bit signed constant. This is the workhorse: it loads small constants (`addi x1, x0, 5`, since `x0` is always 0), increments counters, and bumps pointers.

**Step 3 — memory.** `lw rd, imm(rs1)` loads the word at address `rs1 + imm` into `rd`. `sw rs2, imm(rs1)` stores `rs2` to address `rs1 + imm`. Note the asymmetry: `lw`'s destination is the register being *written*, while `sw` has no destination register at all — both its register fields are sources.

**Step 4 — a branch.** `beq rs1, rs2, imm` jumps to `PC + imm` if `rs1 == rs2`, else falls through to `PC + 4`. It is the only decision-maker in our subset, and it is enough for `if` and `while`, because you can always compare against `x0` to test for zero.

**Step 5 — a jump.** `jal rd, imm` jumps to `PC + imm` and puts `PC + 4` (the return address) in `rd`. With `rd = x0` it is a plain unconditional jump (the link value is discarded, since `x0` ignores writes). With `rd = x1` it is a function call.

**Step 6 — the whole set.**

| # | Instruction | Format | What it does | Example | Effect |
|---|---|---|---|---|---|
| 1 | `add rd, rs1, rs2` | R | `rd = rs1 + rs2` | `add x4, x4, x5` | add two registers |
| 2 | `sub rd, rs1, rs2` | R | `rd = rs1 - rs2` | `sub x5, x6, x7` | subtract |
| 3 | `and rd, rs1, rs2` | R | `rd = rs1 & rs2` | `and x5, x6, x7` | bitwise AND |
| 4 | `or rd, rs1, rs2` | R | `rd = rs1 \| rs2` | `or x5, x6, x7` | bitwise OR |
| 5 | `slt rd, rs1, rs2` | R | `rd = (rs1 < rs2) ? 1 : 0` | `slt x5, x6, x7` | signed compare |
| 6 | `addi rd, rs1, imm` | I | `rd = rs1 + imm` | `addi x1, x0, 5` | `x1 = 5` |
| 7 | `lw rd, imm(rs1)` | I | `rd = Mem[rs1 + imm]` | `lw x5, 0(x1)` | load word |
| 8 | `sw rs2, imm(rs1)` | S | `Mem[rs1 + imm] = rs2` | `sw x4, 0x200(x0)` | store word |
| 9 | `beq rs1, rs2, imm` | B | `if (rs1 == rs2) PC += imm` | `beq x2, x3, 24` | branch if equal |
| 10 | `jal rd, imm` | J | `rd = PC + 4; PC += imm` | `jal x0, -20` | jump |

### Formula / rule / table
```text
ALU-type  : result = op(rs1, rs2)            (R-type)
Immediate : result = rs1 + imm               (I-type, 12-bit signed)
Load      : rd <- Mem[rs1 + imm]             (I-type, 12-bit signed)
Store     : Mem[rs1 + imm] <- rs2            (S-type, 12-bit signed)
Branch    : if (rs1 == rs2) PC <- PC + imm   (B-type, 13-bit signed, even)
Jump      : rd <- PC + 4; PC <- PC + imm     (J-type, 21-bit signed, even)
```
**Meaning:** `rs1`, `rs2` are source register numbers, `rd` the destination, `imm` a constant baked into the instruction. **When to use:** this is your checklist while writing assembly — first ask "register-register maths, an immediate, memory, or control flow?" **Tiny example:** to get `x5 = x6 + 7` you need `addi x5, x6, 7`, not `add`.

**Example question:** Write RISC-V from the subset to compute `x9 = 100 - x10`.

**Solution:**
- Step 1: `sub` needs both operands in registers, but `100` is a constant. *Reason: `sub` is R-type — it has no immediate field.*
- Step 2: Materialise the constant: `addi x11, x0, 100` gives `x11 = 100`. *Reason: `addi` with `rs1 = x0` is the idiom for loading a constant.*
- Step 3: Both operands are now registers: `sub x9, x11, x10` gives `x9 = 100 - x10`. *Reason: `sub rd, rs1, rs2` computes `rs1 - rs2` — order matters.*

**Final answer:**
```text
addi x11, x0, 100     # x11 = 100
sub  x9, x11, x10     # x9  = 100 - x10
```

⚠️ **Common trap:** Writing `sub x9, x10, 100` — the assembler refuses it. In RISC-V no arithmetic instruction takes an immediate except the ones with `i` in the name (`addi`, and later `andi`, `ori`, `slti`). Second trap: swapping the operands, `sub x9, x10, x11` is `x10 - x11`, and unlike addition that changes the answer.

## 5.4 Registers and instruction formats

### Intuition
The 32 registers are the CPU's two hands plus a small workbench. Everything the ALU touches must be on the bench first — you cannot do arithmetic directly on a shelf (memory). Thirty-two is a deliberate compromise: enough to keep a loop's variables in play, few enough that selecting one needs only 5 bits. The instruction formats are the *postal address layout* on the envelope: the decoder must find the opcode, the register numbers and the immediate in the same places every time, or the sorting office becomes chaos.

### The idea, step by step
**Step 1 — the 32 registers.** Named `x0` to `x31`, each 32 bits, held in the Module 4 register file. They also carry ABI (application binary interface) names that encode the calling *convention*.

| Register | ABI name | Role | Saved by |
|---|---|---|---|
| `x0` | `zero` | always 0, writes ignored | — |
| `x1` | `ra` | return address | caller |
| `x2` | `sp` | stack pointer | callee |
| `x3`–`x4` | `gp`, `tp` | global / thread pointer | never change |
| `x5`–`x7` | `t0`–`t2` | temporaries | caller |
| `x8`–`x9` | `s0`/`fp`, `s1` | saved registers | callee |
| `x10`–`x17` | `a0`–`a7` | arguments and return values | caller |
| `x18`–`x27` | `s2`–`s11` | saved registers | callee |
| `x28`–`x31` | `t3`–`t6` | temporaries | caller |

Two facts you will use constantly: `x0` is hardwired to 0 (reading gives 0, writing does nothing — it is a wire tied to ground inside the register file, not a special instruction), and registers are **not** memory (they have no addresses; the register number is baked into the instruction bits and cannot be computed at run time).

**Step 2 — five fields, five formats.** Every instruction shares a skeleton: **opcode** in bits `6:0`, **destination register** in bits `11:7`. The rest of the 32 bits are rearranged into five shapes. Why five? Because each type needs different information quickly, and keeping some bits in *fixed* positions lets the decoder start work before it has seen the whole instruction — note `rs1`, `rs2` and `rd` sit in the same place in R, I, S and B formats; only the immediate moves.

**Step 3 — the bit-field tables.** Read each left to right as bit 31 down to bit 0.

**R-format** (`add`, `sub`, `and`, `or`, `slt`)

| bits | 31:25 | 24:20 | 19:15 | 14:12 | 11:7 | 6:0 |
|---|---|---|---|---|---|---|
| field | funct7 | rs2 | rs1 | funct3 | rd | opcode |
| `add x5,x6,x7` | 0000000 | 00111 | 00110 | 000 | 00101 | 0110011 |

**I-format** (`addi`, `lw`)

| bits | 31:20 | 19:15 | 14:12 | 11:7 | 6:0 |
|---|---|---|---|---|---|
| field | imm[11:0] | rs1 | funct3 | rd | opcode |
| `lw x5,8(x6)` | 000000001000 | 00110 | 010 | 00101 | 0000011 |

**S-format** (`sw`) — the immediate is *split*, because bits `11:7` are needed for the second source register.

| bits | 31:25 | 24:20 | 19:15 | 14:12 | 11:7 | 6:0 |
|---|---|---|---|---|---|---|
| field | imm[11:5] | rs2 | rs1 | funct3 | imm[4:0] | opcode |
| `sw x5,8(x6)` | 0000000 | 00101 | 00110 | 010 | 01000 | 0100011 |

**B-format** (`beq`) — scrambled immediate; bit 0 is implicit 0 because branch targets are always even.

| bits | 31 | 30:25 | 24:20 | 19:15 | 14:12 | 11:8 | 7 | 6:0 |
|---|---|---|---|---|---|---|---|---|
| field | imm[12] | imm[10:5] | rs2 | rs1 | funct3 | imm[4:1] | imm[11] | opcode |
| `beq x5,x6,8` | 0 | 000000 | 00110 | 00101 | 000 | 0100 | 0 | 1100011 |

**J-format** (`jal`) — 20 immediate bits wrapped around `rd`; bit 0 implicit.

| bits | 31 | 30:21 | 20 | 19:12 | 11:7 | 6:0 |
|---|---|---|---|---|---|---|
| field | imm[20] | imm[10:1] | imm[11] | imm[19:12] | rd | opcode |
| `jal x1,8` | 0 | 0000001000 | 0 | 00000000 | 00001 | 1101111 |

**Step 4 — the opcodes and function codes to memorise.**

| Group | opcode `6:0` | hex | funct3 | funct7 |
|---|---|---|---|---|
| `add` | 0110011 | `0x33` | 000 | 0000000 |
| `sub` | 0110011 | `0x33` | 000 | 0100000 |
| `slt` | 0110011 | `0x33` | 010 | 0000000 |
| `or` | 0110011 | `0x33` | 110 | 0000000 |
| `and` | 0110011 | `0x33` | 111 | 0000000 |
| `addi` | 0010011 | `0x13` | 000 | — |
| `lw` | 0000011 | `0x03` | 010 | — |
| `sw` | 0100011 | `0x23` | 010 | — |
| `beq` | 1100011 | `0x63` | 000 | — |
| `jal` | 1101111 | `0x6F` | — | — |

Note `sub` is `add` with one bit flipped: `funct7` goes from `0000000` to `0100000`. That single bit is why the ALU control has to look at `funct7` at all.

**Step 5 — a worked decode, bit by bit.** Take `0x007302B3`.

```text
0x007302B3  =  0000 0000 0111 0011 0000 0010 1011 0011
               0000000 00111 00110 000 00101 0110011
               funct7  rs2   rs1   f3  rd    opcode
```
opcode `0110011` = `0x33` -> R-type arithmetic. `funct7 = 0000000` with `funct3 = 000` -> `add`. `rs1 = 00110 = 6`, `rs2 = 00111 = 7`, `rd = 00101 = 5`. So the word is `add x5, x6, x7`.

**Step 6 — the same thing in Java.** Keep this bit-field extractor in your notes; you will debug encodings with it.

```java
public class Decode {
    // Extract bits hi..lo from a 32-bit instruction word.
    static int bits(int word, int hi, int lo) {
        int width = hi - lo + 1;
        return (word >>> lo) & ((1 << width) - 1);   // shift down, then mask
    }
    public static void main(String[] args) {
        int w = 0x007302B3;                          // the instruction to decode
        System.out.printf("opcode=0x%02X rd=x%d funct3=%d rs1=x%d rs2=x%d funct7=0x%02X%n",
                          bits(w, 6, 0), bits(w, 11, 7), bits(w, 14, 12),
                          bits(w, 19, 15), bits(w, 24, 20), bits(w, 31, 25));
        // opcode 0x33 is the R-type group; funct3=000 with funct7=0000000 means add
        boolean isAdd = bits(w, 14, 12) == 0 && bits(w, 31, 25) == 0;
        System.out.println((isAdd ? "add" : "other") + " x" + bits(w, 11, 7)
                           + ", x" + bits(w, 19, 15) + ", x" + bits(w, 24, 20));
    }
}
```
Verified output:
```text
opcode=0x33 rd=x5 funct3=0 rs1=x6 rs2=x7 funct7=0x00
add x5, x6, x7
```

### Formula / rule / table
```text
R :  funct7    | rs2 | rs1 | funct3 | rd        | opcode
I :  imm[11:0]             | rs1 | funct3 | rd  | opcode
S :  imm[11:5] | rs2 | rs1 | funct3 | imm[4:0]  | opcode
B :  imm[12] | imm[10:5] | rs2 | rs1 | funct3 | imm[4:1] | imm[11] | opcode
J :  imm[20] | imm[10:1] | imm[11] | imm[19:12] | rd | opcode
```
**Meaning:** each row is the 32 bits from bit 31 (left) to bit 0 (right). **When to use:** R for register-register maths, I when there is an immediate and a destination, S for stores, B for branches, J for `jal`. **Tiny example:** `rd` is bits `11:7` in R, I and J formats, so a decoder can wire it once for all three.

**Example question:** Encode `sub x9, x10, x11` into machine code, showing each field, then give the hex.

**Solution:**
- Step 1: `sub` is R-type, opcode `0110011`. *Reason: all register-register arithmetic shares opcode `0x33`.*
- Step 2: `rd = 9` -> `01001`, `rs1 = 10` -> `01010`, `rs2 = 11` -> `01011`. *Reason: each is a 5-bit register number.*
- Step 3: `funct3 = 000`, `funct7 = 0100000` because it is `sub`, not `add`. *Reason: bit 30 of `funct7` is what distinguishes them.*
- Step 4: Assemble `0100000 01011 01010 000 01001 0110011`. *Reason: R-format order, bit 31 to bit 0.*
- Step 5: Group into nibbles: `0100 0000 1011 0101 0000 0100 1011 0011` = `0x40B504B3`.

**Final answer:**
```text
0100000 01011 01010 000 01001 0110011   =   0x40B504B3
funct7  rs2   rs1   f3  rd    opcode
```

⚠️ **Common trap:** Confusing `rs1` and `rs2`. In the *bit layout* `rs2` comes first (bits `24:20`) and `rs1` second (`19:15`) — the reverse of assembly order (`rs1` then `rs2`). Swapping them silently computes `x11 - x10` instead of `x10 - x11`. The other classic: forgetting that `addi`'s immediate is **sign-extended**, so `addi x1, x0, 4095` does not give 4095 — the field `4095` reads as `-1`. Range is only `-2048 .. +2047`.

## 5.5 RISC-V assembly

### Intuition
Assembly is the instruction set written for humans: one line = one instruction = one 32-bit word. No compiler magic — what you write is literally what the CPU does, in order. That is why we use it here: you can watch the machine think. If you have written Java, think of assembly as Java with all the convenience removed: no `for`, no `if`, no variables outside 32 numbered registers. Everything is built from compare-and-jump.

### The idea, step by step
**Step 1 — labels are addresses.** `loop:` is just a name for the address of the next instruction. `beq x2, x3, done` means "branch to whatever address `done` names"; the assembler computes the *offset* (`done - here`) and packs it in. That is why the branch field is a relative offset, not an absolute address: it keeps code position-independent and the field small.

**Step 2 — `if` becomes compare + branch.** Java `if (a == b) { x = 1; } else { x = 0; }` with `a` in `x10`, `b` in `x11`, `x` in `x12`:
```text
        beq  x10, x11, then      # if a == b, go to the "then" part
        addi x12, x0, 0          # else-branch: x = 0
        jal  x0, end             # skip over the then-branch
then:   addi x12, x0, 1          # then-branch: x = 1
end:    ...                      # carry on
```
There is no `else` instruction. An `if/else` is: branch to then, do else, *jump over* then, do then — two control transfers, not one.

**Step 3 — `while` becomes a label + branch back.** Java `while (i < n) { sum = sum + i; i = i + 1; }` with `i` in `x2`, `n` in `x3`, `sum` in `x4`:
```text
loop:   beq  x2, x3, done        # if i == n, exit
        add  x4, x4, x2          # sum += i
        addi x2, x2, 1           # i++
        jal  x0, loop            # back to the top
done:   ...
```
Note we branch on equality to *exit*, not on `<` to continue. With only `beq` available, "loop until `i == n`" is the same as "while `i < n`" provided `i` starts at 0 and steps by 1. (With the full instruction set you would write `blt x3, x2, done`.)

**Step 4 — the array-sum program used for the rest of the module.** Array `A = {1,2,3,4}` at byte address `0x100`; the sum goes to `0x200`.
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
done:   sw   x4, 0x200(x0)       # store the sum at address 0x200
```
Hand-check: the iterations add 1, 2, 3, 4 -> sum = **10**. Instructions executed = 4 setup + 4 x 6 loop body + 1 final taken `beq` + 1 `sw` = **30**. Both numbers are confirmed by the trace in Module 6.

**Step 5 — its machine code.** Note the offsets: `beq` jumps forward `0x28 - 0x10 = 24`; `jal` jumps back `0x10 - 0x24 = -20`.

| Address | Assembly | Machine code |
|---|---|---|
| `0x00` | `addi x1, x0, 0x100` | `0x10000093` |
| `0x04` | `addi x2, x0, 0` | `0x00000113` |
| `0x08` | `addi x3, x0, 4` | `0x00400193` |
| `0x0C` | `addi x4, x0, 0` | `0x00000213` |
| `0x10` | `beq x2, x3, 24` | `0x00310C63` |
| `0x14` | `lw x5, 0(x1)` | `0x0000A283` |
| `0x18` | `add x4, x4, x5` | `0x00520233` |
| `0x1C` | `addi x1, x1, 4` | `0x00408093` |
| `0x20` | `addi x2, x2, 1` | `0x00110113` |
| `0x24` | `jal x0, -20` | `0xFEDFF06F` |
| `0x28` | `sw x4, 0x200(x0)` | `0x20402023` |

**Step 6 — running it in Ripes.** Ripes is the visual RISC-V simulator used in this course. Button names shift slightly between versions; the steps do not.
1. Select the **single-cycle** processor in the processor selector — that is the machine you are building, so the datapath view matches your notes.
2. Paste the assembly into the editor; Ripes assembles it and shows the machine-code words.
3. Preload `1, 2, 3, 4` at `0x100, 0x104, 0x108, 0x10C` in the memory editor (an assembler `.word` directive does the same).
4. Open the **datapath** view and press step once per clock: each step highlights the active wires — the same signals you compute by hand in 5.7. Keep the register file and memory panels visible, and after each step check that only the expected register changed.
5. Run to the end and read `0x200`: it must hold `10`.

**Step 7 — the Java link.** Java's `int sum = 0; sum += a[i];` is exactly `x4 = 0`, then `lw`, then `add`. The difference: Java lets the compiler choose the storage; in assembly *you* are the compiler, and you must also do the address arithmetic Java hides from you.

### Formula / rule / table
```text
branch offset = target address - address of the branch instruction
```
**Meaning:** the immediate in `beq`/`jal` is a relative distance in bytes, not an absolute address. **When to use:** hand-assembling a branch, or reading an offset out of a trace. **Tiny example:** `beq` at `0x10` targeting `0x28` -> offset `= 0x28 - 0x10 = 0x18 = 24`.

**Example question:** Translate this Java into RISC-V using only our ten instructions, with `n` in `x10` and the answer in `x11`.
```java
int f = 0;              // count how many of 0..n-1 are even
for (int i = 0; i < n; i++) { if (i % 2 == 0) f = f + 1; }
```

**Solution:**
- Step 1: We have no modulo. But a number is even exactly when its lowest bit is 0. *Reason: bit 0 is the 1s place in binary.*
- Step 2: Mask the low bit. We have no `andi`, so build the mask in a register: `addi x12, x0, 1` then `and x13, x2, x12`. *Reason: `and` with 1 keeps only bit 0.*
- Step 3: If the result is 0 the number is even: `beq x13, x0, even`. *Reason: `beq` against `x0` is our only zero test.*
- Step 4: Close the loop with a backward `jal`. *Reason: unconditional jumps are `jal x0, label`.*
```text
        addi x11, x0, 0          # f = 0
        addi x2,  x0, 0          # i = 0
        addi x12, x0, 1          # constant 1 (the mask)
loop:   beq  x2, x10, done       # while i != n
        and  x13, x2, x12        # x13 = i & 1 -> 1 if odd, 0 if even
        beq  x13, x0, even       # if even, go increment f
        jal  x0, next            # odd: skip the increment
even:   addi x11, x11, 1         # f++
next:   addi x2, x2, 1           # i++
        jal  x0, loop            # repeat
done:   ...
```
- Step 5: Dry-run `n = 4` (i = 0,1,2,3). Even `i` are 0 and 2 -> `f = 2`. *Reason: confirms the loop counts correctly.*

**Final answer:** the loop above; for `n = 4` it leaves `x11 = 2`.

⚠️ **Common trap:** Believing `beq x2, x10, done` means "while i < n". It means "exit when i **equals** n" — only the same thing if `i` never overshoots. If a bug makes `i` jump from 3 to 5 with `n = 4`, the loop never exits and the simulator hangs rather than crashing. This is the most common first-year lab bug.

## 5.6 The fetch-decode-execute cycle

### Intuition
A CPU is a very obedient clerk with a to-do list. Look at the top item (the PC), read it, do it, move the bookmark forward, repeat — billions of times a second. There is no cleverness; all the intelligence is already in the list. We name the steps because in a single-cycle machine they are *not* separate in time (they happen in a chain inside one clock period). Naming them is what keeps the chain straight, and it is what lets us talk about pipelining later, where the steps finally do become separate in time.

### The idea, step by step
**Step 1 — fetch.** Send `PC` to the instruction memory's address port; the memory returns the 32-bit word stored there. Meanwhile an adder computes `PC + 4`.

**Step 2 — decode.** Split the 32 bits into fields. The opcode goes to the main control unit, which raises the control signals. The register numbers go to the register file's address ports, which immediately output the `rs1` and `rs2` values. The immediate generator reassembles the immediate bits into a 32-bit sign-extended value.

**Step 3 — execute.** The ALU does its job: add for addresses and arithmetic, subtract for `beq`. Data memory reads or writes if the instruction is `lw`/`sw`.

**Step 4 — write back and update the PC.** The result goes into `rd` (if `RegWrite = 1`); the PC gets `PC + 4` or the branch/jump target.

**Step 5 — trace the first three instructions.**

| Cycle | PC | Fetched word | Decoded as | Execute | Write back | Next PC |
|---|---|---|---|---|---|---|
| 1 | `0x00` | `0x10000093` | `addi x1, x0, 0x100` | `0 + 256 = 256` | `x1 <- 256` | `0x04` |
| 2 | `0x04` | `0x00000113` | `addi x2, x0, 0` | `0 + 0 = 0` | `x2 <- 0` | `0x08` |
| 3 | `0x08` | `0x00400193` | `addi x3, x0, 4` | `0 + 4 = 4` | `x3 <- 4` | `0x0C` |

**Step 6 — trace the first branch and the jump.**

| Cycle | PC | Instruction | Execute | Next PC | Why |
|---|---|---|---|---|---|
| 5 | `0x10` | `beq x2, x3, 24` | `0 - 4 != 0`, zero = 0 | `0x14` | not equal -> fall through |
| 10 | `0x24` | `jal x0, -20` | target `= 0x24 - 20 = 0x10` | `0x10` | unconditional jump back |

**Step 7 — cycles = instructions.** In a single-cycle machine every instruction takes exactly one clock, so "30 instructions" and "30 cycles" are the same number. Hold on to that: it is why single-cycle CPUs are simple but slow, and it is exactly what pipelining changes.

### Formula / rule / table
```text
PC_next = PC + 4                      normally
PC_next = PC + imm                    taken branch (beq)
PC_next = PC + imm, and rd <- PC + 4  jal
```
**Meaning:** the PC mux picks between the sequential path and the computed target. **When to use:** reading any trace, or predicting the next fetched address. **Tiny example:** `beq` at `0x10` with `imm = 24`, taken -> `PC_next = 0x28`.

**Example question:** A program is 8 instructions long, with a `beq` at `0x0C` that jumps to `0x1C` and is taken. Starting at `0x00`, list the PCs fetched and the number of cycles.

**Solution:**
- Step 1: `0x00, 0x04, 0x08, 0x0C` — four sequential fetches. *Reason: each is `PC + 4`.*
- Step 2: At `0x0C` the branch is taken, so the next PC is `0x1C`. *Reason: a taken branch uses `PC + imm`.*
- Step 3: `0x1C` is the last instruction (8 instructions span `0x00` to `0x1C`), so `0x10, 0x14, 0x18` are skipped. *Reason: the branch jumps over them.*
- Step 4: Count fetches: `0x00, 0x04, 0x08, 0x0C, 0x1C` = 5. *Reason: skipped instructions are never fetched, so they cost nothing.*
- Step 5: Single cycle -> cycles = instructions = 5. *Reason: CPI = 1.*

**Final answer:** PCs fetched `0x00, 0x04, 0x08, 0x0C, 0x1C`; **5 cycles**. The offset encoded in the `beq` is `0x1C - 0x0C = 16`.

⚠️ **Common trap:** Adding 1 to the PC instead of 4. RISC-V is **byte-addressed** with 4-byte instructions, so `PC + 4` is "next instruction" and `PC + 1` walks into the middle of a word and produces garbage. Related: the branch immediate is a *byte* offset too — `beq ... 24` moves 24 bytes = 6 instructions, not 24 instructions.

## 5.7 The single-cycle datapath

### Intuition
The datapath is a set of pipes connecting blocks you already built, with a few switches (multiplexers) choosing which way the water flows. The control unit is the hand on the switches. No block here is new — every one came from Modules 2, 3 and 4. What is new is the *wiring*. The design rule that makes it work: **one instruction per clock, and the clock period must be long enough for the slowest instruction to finish.** That rule is both the charm and the limit of the single-cycle design.

### The idea, step by step
**Step 1 — the blocks.** Nothing here is new hardware. The **PC** (Module 3) holds the address of the instruction being executed; **instruction memory** (Module 4) returns the 32-bit word at `PC`; the **`PC+4` adder** (Module 2) always computes `PC + 4`; the **register file** (Module 4) has two read ports and one write port gated by `RegWrite`; the **immediate generator** is new but is only wiring — it reassembles and sign-extends the I/S/B/J immediates; the **ALU** (Module 2) adds, subtracts, ANDs, ORs and sets-less-than; **data memory** (Module 4) reads or writes one word; the **branch adder** (Module 2) computes `PC + imm`; the **control unit** (a decoder — the Module 3 FSM idea) turns the opcode into the signals.

**Step 2 — the diagram.** One instruction per clock: fetch on the left, write back on the right, everything in between is combinational.

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

**Step 3 — the three mux decisions.** Everything confusing about the datapath is one of these. **MUX B** (the ALU's second input) picks `rd2` or `imm` by `ALUSrc` — `0` for R-type and `beq`, `1` for `lw`, `sw`, `addi`. The **WB MUX** picks what is written to `rd` (ALU result / data memory / `PC + 4`) by `MemtoReg[1:0]`. The **PC MUX** picks the next PC (`PC + 4` or `PC + imm`) by `PCSrc = (Branch AND zero) OR Jump`.

**Step 4 — trace `add x4, x4, x5` at `PC = 0x18`** (cycle 13 of the program, where `x4 = 1`, `x5 = 2`).

| Stage | What happens | Value |
|---|---|---|
| Fetch | `I-MEM[0x18]` | `0x00520233` |
| Decode | opcode `0x33`, `rd = 4`, `funct3 = 000`, `rs1 = 4`, `rs2 = 5`, `funct7 = 0` | R-type `add` |
| Control | `RegWrite 1`, `ALUSrc 0`, `MemRead 0`, `MemWrite 0`, `Branch 0`, `Jump 0`, `MemtoReg 00`, `ALUOp 10` | ALU control `0010` |
| Reg read, MUX B | `rd1 = Reg[4] = 1`, `rd2 = Reg[5] = 2`; `ALUSrc = 0` -> picks `rd2` | `1`, `2` |
| ALU | ADD `1 + 2` | `result 3`, `zero 0` |
| D-MEM | read 0, write 0 | untouched |
| WB | `MemtoReg 00` -> ALU result, `RegWrite 1` | `x4 <- 3` |
| PC | `PCSrc = 0` | `PC <- 0x1C` |

**Step 5 — trace `lw x5, 0(x1)` at `PC = 0x14`** (cycle 6, `x1 = 256`).

| Stage | What happens | Value |
|---|---|---|
| Fetch | `I-MEM[0x14]` | `0x0000A283` |
| Decode | opcode `0x03`, `rd = 5`, `funct3 = 010`, `rs1 = 1`, `imm = 0` | `lw` word |
| Control | `RegWrite 1`, `ALUSrc 1`, `MemRead 1`, `MemWrite 0`, `Branch 0`, `Jump 0`, `MemtoReg 01`, `ALUOp 00` | ALU control `0010` |
| Reg read, MUX B | `rd1 = Reg[1] = 256`; `rd2` unused; `ALUSrc = 1` -> picks `imm` | `256`, `0` |
| ALU | ADD `256 + 0` = the address | `result 256`, `zero 0` |
| D-MEM | `MemRead = 1` -> read word at 256 | `1` |
| WB | `MemtoReg 01` -> memory data, `RegWrite 1` | `x5 <- 1` |
| PC | `PCSrc = 0` | `PC <- 0x18` |

**Step 6 — trace `sw x4, 0x200(x0)` at `PC = 0x28`** (cycle 30, `x4 = 10`).

| Stage | What happens | Value |
|---|---|---|
| Fetch | `I-MEM[0x28]` | `0x20402023` |
| Decode | opcode `0x23`, `funct3 = 010`, `rs1 = 0`, `rs2 = 4`, `imm = 512` | `sw` word |
| Control | `RegWrite 0`, `ALUSrc 1`, `MemRead 0`, `MemWrite 1`, `Branch 0`, `Jump 0`, `MemtoReg X`, `ALUOp 00` | ALU control `0010` |
| Reg read, MUX B | `rd1 = Reg[0] = 0`, `rd2 = Reg[4] = 10`; `ALUSrc = 1` -> picks `imm` | `0`, `10`, `512` |
| ALU | ADD `0 + 512` = the address | `result 512`, `zero 0` |
| D-MEM | `MemWrite = 1` -> write `rd2` at 512 | `Mem[512] <- 10` |
| WB | `RegWrite = 0` -> nothing written | no register changes |
| PC | `PCSrc = 0` | `PC <- 0x2C` |

**Step 7 — trace `beq x2, x3, 24` at `PC = 0x10`, taken** (cycle 29, `x2 = 4`, `x3 = 4`).

| Stage | What happens | Value |
|---|---|---|
| Fetch | `I-MEM[0x10]` | `0x00310C63` |
| Decode | opcode `0x63`, `funct3 = 000`, `rs1 = 2`, `rs2 = 3`, `imm = 24` | `beq` |
| Control | `RegWrite 0`, `ALUSrc 0`, `MemRead 0`, `MemWrite 0`, `Branch 1`, `Jump 0`, `ALUOp 01` | ALU control `0110` |
| Reg read, MUX B | `rd1 = Reg[2] = 4`, `rd2 = Reg[3] = 4`; `ALUSrc = 0` -> picks `rd2` | `4`, `4` |
| ALU | SUB `4 - 4` | `result 0`, **`zero 1`** |
| AND gate | `Branch AND zero` = `1 AND 1` | `branchTaken 1` |
| Branch adder | `PC + imm` = `0x10 + 24` | `0x28` |
| PC | `PCSrc = 1` -> picks the target | `PC <- 0x28` |

**Step 8 — the immediate generator in Java.** Pure wiring, but B and J are fiddly. `signExtend` matters: RISC-V immediates are always signed.

```java
public class ImmGen {
    static int bits(int w, int hi, int lo) {
        int width = hi - lo + 1;
        return (w >>> lo) & ((1 << width) - 1);
    }
    // Sign-extend a value that has only 'width' meaningful bits.
    static int signExtend(int v, int width) {
        int shift = 32 - width;
        return (v << shift) >> shift;        // arithmetic shift copies the sign bit
    }
    static int immI(int w) { return signExtend(bits(w, 31, 20), 12); }
    static int immS(int w) { return signExtend((bits(w, 31, 25) << 5) | bits(w, 11, 7), 12); }
    static int immB(int w) {
        int v = (bits(w, 31, 31) << 12) | (bits(w, 7, 7) << 11)
              | (bits(w, 30, 25) << 5)  | (bits(w, 11, 8) << 1);
        return signExtend(v, 13);
    }
    static int immJ(int w) {
        int v = (bits(w, 31, 31) << 20) | (bits(w, 19, 12) << 12)
              | (bits(w, 20, 20) << 11) | (bits(w, 30, 21) << 1);
        return signExtend(v, 21);
    }
    public static void main(String[] args) {
        System.out.println(immI(0x00832283) + " " + immI(0xFFC30293) + " "   // 8 -4
                         + immS(0x00532423) + " " + immB(0x00310C63) + " "   // 8 24
                         + immJ(0xFEDFF06F));                                // -20
    }
}
```
Verified output: `8 -4 8 24 -20` (the five immediates above, in order).

### Formula / rule / table
| Instruction | ALU input A | ALU input B | ALU op | Write-back source | RegWrite | MemRead | MemWrite |
|---|---|---|---|---|---|---|---|
| `add`/`sub`/`and`/`or`/`slt` | `rd1` | `rd2` | per funct | ALU result | 1 | 0 | 0 |
| `addi` | `rd1` | `imm` | ADD | ALU result | 1 | 0 | 0 |
| `lw` | `rd1` | `imm` | ADD | data memory | 1 | 1 | 0 |
| `sw` | `rd1` | `imm` | ADD | (none) | 0 | 0 | 1 |
| `beq` | `rd1` | `rd2` | SUB | (none) | 0 | 0 | 0 |
| `jal` | — | — | — | `PC + 4` | 1 | 0 | 0 |

**Example question:** For `addi x7, x8, -1` at `PC = 0x2C` with `x8 = 20`, give the machine code, every control signal, the ALU inputs and output, the write-back and the next PC.

**Solution:**
- Step 1: `addi` is I-type: `imm = -1` = `0xFFF`, `rs1 = 8` = `01000`, `funct3 = 000`, `rd = 7` = `00111`, opcode `0010011`. *Reason: I-format is imm[11:0] | rs1 | funct3 | rd | opcode.*
- Step 2: Bits `111111111111 01000 000 00111 0010011` -> `0xFFF40393`. *Reason: group into nibbles.*
- Step 3: Control: `RegWrite 1` (writes a register), `ALUSrc 1` (immediate operand), `MemRead 0`, `MemWrite 0`, `Branch 0`, `Jump 0`, `MemtoReg 00`, `ALUOp 11` -> ALU control `0010` = ADD. *Reason: `addi` is an I-type ALU op, so the decoder must not consult `funct7`.*
- Step 4: Values `rd1 = x8 = 20`, `imm = -1` (sign-extended); MUX B picks `-1`. *Reason: `ALUSrc = 1`.*
- Step 5: ALU `20 + (-1) = 19`, `zero = 0`. *Reason: ADD.*
- Step 6: `MemtoReg 00` -> ALU result -> `x7 <- 19`; `PC <- 0x30`. *Reason: no branch, so `PC + 4`.*

**Final answer:**
```text
code 0xFFF40393
RegWrite 1  ALUSrc 1  MemRead 0  MemWrite 0  Branch 0  Jump 0
MemtoReg 00  ALUOp 11 -> ALU ADD
ALU 20 + (-1) = 19, zero = 0
WB x7 <- 19    next PC = 0x30
```

⚠️ **Common trap:** Saying `sw` "writes a register". It does not — `RegWrite = 0`, and there is no `rd` field at all in S-format; bits `11:7` hold `imm[4:0]`. Second trap: expecting the ALU to be idle during a load. It is not — it computes `rs1 + imm`, the address.

## 5.8 The control unit

### Intuition
The control unit is a translator between "what instruction is this?" and "which switches do I flip?". No data flows through it, only decisions. Two levels, like a manager and a supervisor: the **main decoder** reads the opcode and says "this is a load — allow a register write, use an immediate, read memory, write back from memory"; the **ALU decoder** reads `funct3`/`funct7` and says "and the ALU should add". Why two levels instead of one giant truth table? Because one table over 7 opcode bits plus 10 function bits would have thousands of rows; splitting keeps each decoder small — six opcodes on one side, a handful of function codes on the other.

### The idea, step by step
**Step 1 — the control signals and what each physically does.**

| Signal | Width | What it controls |
|---|---|---|
| `RegWrite` | 1 | enable the register file's write port |
| `ALUSrc` | 1 | MUX B: `0` = `rd2`, `1` = immediate |
| `MemRead` | 1 | data memory read enable |
| `MemWrite` | 1 | data memory write enable |
| `Branch` | 1 | allow `beq` to redirect the PC |
| `Jump` | 1 | force the PC to the jump target |
| `MemtoReg` | 2 | write-back select: `00` ALU, `01` memory, `10` `PC+4` |
| `ALUOp` | 2 | hint to the ALU decoder |

**Step 2 — the `ALUOp` encoding used in these notes.** Textbooks differ slightly, so here is the exact convention for this course:

| `ALUOp` | Meaning | Used by |
|---|---|---|
| `00` | always ADD (address calculation) | `lw`, `sw` |
| `01` | always SUB (equality test) | `beq` |
| `10` | look at `funct3` **and** `funct7` | R-type |
| `11` | look at `funct3` only, ignore `funct7` | `addi` |

The `11` case exists because in an I-type instruction the bits where `funct7` would be are part of the immediate. If the ALU decoder read them, `addi x5, x6, 32` (which has bit 30 set) would decode as a subtraction. That is a real bug people ship.

**Step 3 — the main control table.** `X` means "don't care".

| Instruction | opcode | RegWrite | ALUSrc | MemRead | MemWrite | Branch | Jump | MemtoReg | ALUOp |
|---|---|---|---|---|---|---|---|---|---|
| `add` `sub` `and` `or` `slt` | `0110011` | 1 | 0 | 0 | 0 | 0 | 0 | `00` | `10` |
| `addi` | `0010011` | 1 | 1 | 0 | 0 | 0 | 0 | `00` | `11` |
| `lw` | `0000011` | 1 | 1 | 1 | 0 | 0 | 0 | `01` | `00` |
| `sw` | `0100011` | 0 | 1 | 0 | 1 | 0 | 0 | `X` | `00` |
| `beq` | `1100011` | 0 | 0 | 0 | 0 | 1 | 0 | `X` | `01` |
| `jal` | `1101111` | 1 | `X` | 0 | 0 | 0 | 1 | `10` | `X` |

Read it as a story: only four rows write a register (`R`, `addi`, `lw`, `jal`); only one writes memory (`sw`); only one reads memory (`lw`); only `beq` and `jal` touch the PC specially.

**Step 4 — the ALU control table.**

| `ALUOp` | `funct3` | `funct7[5]` (bit 30) | `ALUControl` | Operation |
|---|---|---|---|---|
| `00` | X | X | `0010` | ADD |
| `01` | X | X | `0110` | SUB |
| `11` | `000` | X | `0010` | ADD |
| `10` | `000` | 0 | `0010` | ADD |
| `10` | `000` | 1 | `0110` | SUB |
| `10` | `111` | 0 | `0000` | AND |
| `10` | `110` | 0 | `0001` | OR |
| `10` | `010` | 0 | `0111` | SLT |

`ALUControl` codes (Patterson-style 4-bit encoding, with `0011` left free — we use it for XOR in Module 6): `0000` AND, `0001` OR, `0010` ADD, `0110` SUB, `0111` SLT.

**Step 5 — the same logic, as code.** The two decoders become one `switch` on `ALUOp` with a nested `switch` on `funct3` — the table above *is* that code, one row per branch. Two details matter when you write it: the default branch must return a safe operation (ADD), and the `ALUOp = 11` branch must never look at `funct7`.

**Step 6 — how `PCSrc` is made.** Two gates: `branchTaken = Branch AND zero` (using the ALU's zero flag), then `PCSrc = branchTaken OR Jump`. `jal` never uses the ALU — it just asserts `Jump`, and the PC mux takes the `PC + imm` input. That is why `ALUSrc` and `ALUOp` are "don't care" for `jal`.

### Formula / rule / table
```text
PCSrc = (Branch AND zero) OR Jump
```
**Meaning:** redirect the PC if either a taken branch or a jump says so. **When to use:** any question asking whether the PC takes the target path this cycle. **Tiny example:** `beq` with `zero = 0` and `Jump = 0` -> `PCSrc = 0` -> `PC + 4`.

**Example question:** The word at `PC = 0x40` is `0x00A4A023`. Decode it fully and give every control signal.

**Solution:**
- Step 1: opcode = low 7 bits; `0x23` = `0100011` -> store. *Reason: `0x23` is the store opcode.*
- Step 2: `funct3` = bits `14:12` = `010` -> store a **word**. *Reason: `010` is the 32-bit size code.*
- Step 3: `rs1` = bits `19:15` = `01001` = 9; `rs2` = bits `24:20` = `01010` = 10. *Reason: S-format puts `rs2` above `rs1`.*
- Step 4: `imm[11:5]` = bits `31:25` = `0000000`, `imm[4:0]` = bits `11:7` = `00000` -> `imm = 0`. *Reason: the S-format immediate is split in two.*
- Step 5: So the instruction is `sw x10, 0(x9)`. *Reason: store `rs2` at `rs1 + imm`.*
- Step 6: Control: `RegWrite 0`, `ALUSrc 1`, `MemRead 0`, `MemWrite 1`, `Branch 0`, `Jump 0`, `MemtoReg X`, `ALUOp 00` -> ALU ADD. *Reason: the store row of the main table.*

**Final answer:** `sw x10, 0(x9)`; signals `RegWrite 0, ALUSrc 1, MemRead 0, MemWrite 1, Branch 0, Jump 0, MemtoReg X, ALUOp 00`; ALU operation ADD.

⚠️ **Common trap:** Setting `RegWrite = 1` for `sw` because "it writes something" — it writes *memory*, so `MemWrite = 1` and `RegWrite = 0`. The other trap: using `ALUOp = 10` for `addi` and letting the ALU decoder read `funct7`; in an I-type word those bits are immediate data, so `addi x5, x6, 32` decodes as a subtraction. Use `ALUOp = 11`.

## Formula / rule summary table

**Which format when?**

| You see... | Format | Opcode | Fields that matter |
|---|---|---|---|
| two registers, one destination | R | `0x33` | `funct7`, `funct3`, `rs2`, `rs1`, `rd` |
| an immediate and a destination | I | `0x13` / `0x03` | `imm[11:0]`, `rs1`, `rd` |
| two registers and *no* destination | S | `0x23` | `imm[11:5]` + `imm[4:0]`, `rs2`, `rs1` |
| a comparison and a target | B | `0x63` | scrambled `imm`, `rs2`, `rs1` |
| a jump target and a link register | J | `0x6F` | scrambled `imm`, `rd` |

**Which control signal when?**

| Want to... | Signal | Value |
|---|---|---|
| write a register | `RegWrite` | 1 (`0` for `sw`, `beq`) |
| use the immediate as an ALU operand | `ALUSrc` | 1 (`lw`, `sw`, `addi`) |
| read data memory | `MemRead` | 1 (`lw` only) |
| write data memory | `MemWrite` | 1 (`sw` only) |
| allow a branch redirect | `Branch` | 1 (`beq` only) |
| force a jump | `Jump` | 1 (`jal` only) |
| choose the write-back source | `MemtoReg` | `00` ALU, `01` memory (`lw`), `10` `PC+4` (`jal`) |

**Key numbers to memorise**
```text
instruction = 32 bits = 4 bytes        PC increment = +4 bytes
registers = 32 (x0..x31), field width = 5 bits (2^5 = 32)
I-type imm = 12-bit signed -> -2048 .. +2047   (S-type the same)
B-type imm = 13-bit signed, always even -> -4096 .. +4094
J-type imm = 21-bit signed, always even -> about -1 MiB .. +1 MiB
```

## Solved examples

**Example 1 (easy) — read the fields.** The word `0x00B574B3` is fetched. What instruction is it?

- Step 1: opcode `0x33` -> R-type. *Reason: the opcode is bits `6:0`.*
- Step 2: binary `0000000 01011 01010 111 01001 0110011`, so `funct3 = 111` -> `and`. *Reason: `111` is AND in the R-type group.*
- Step 3: `rs1 = 01010 = 10`, `rs2 = 01011 = 11`, `rd = 01001 = 9`, `funct7 = 0000000`. *Reason: fixed field positions; only `sub` sets bit 30.*

**Final answer:** `and x9, x10, x11`.

**Example 2 (medium) — build the machine code.** Encode `beq x9, x10, -8`.
- Step 1: B-format, opcode `1100011`. *Reason: `beq` opcode is `0x63`.*
- Step 2: `-8` in 13-bit two's complement is `1 1111 1111 1000`, so `imm[12] = 1`, `imm[11] = 1`, `imm[10:5] = 111111`, `imm[4:1] = 1100`, `imm[0] = 0` implicit. *Reason: bit 0 is always 0 for branches.*
- Step 3: `rs1 = 9 = 01001`, `rs2 = 10 = 01010`, `funct3 = 000`. *Reason: branch fields.*
- Step 4: lay out `1` `111111` `01010` `01001` `000` `1100` `1` `1100011` (order: `imm[12]`, `imm[10:5]`, `rs2`, `rs1`, `funct3`, `imm[4:1]`, `imm[11]`, opcode). *Reason: B-format bit order.*
- Step 5: group into nibbles: `1111 1110 1010 0100 1000 1100 1110 0011` = `0xFEA48CE3`.

**Final answer:** `0xFEA48CE3`. Sanity check: `-8` = 2 instructions back, so a `beq` at `0x10` lands at `0x08`. Correct.

**Example 3 (exam level) — count the cycles of a nested loop.**
```text
        addi x1, x0, 10          # outer count = 10
        addi x2, x0, 0           # total = 0
outer:  addi x3, x0, 5           # inner count = 5
inner:  addi x2, x2, 1           # total++
        addi x3, x3, -1          # inner--
        beq  x3, x0, innerEnd    # if inner == 0, leave inner loop
        jal  x0, inner           # else repeat inner
innerEnd:
        addi x1, x1, -1          # outer--
        beq  x1, x0, end         # if outer == 0, finish
        jal  x0, outer           # else repeat outer
end:    ...
```
- Step 1: the inner body is `addi, addi, beq, jal` = 4 instructions, plus one extra taken `beq` when it exits: `4 x 5 + 1 = 21` per outer iteration. *Reason: the loop runs 5 times and exits once through a taken `beq`.*
- Step 2: per outer iteration add the inner setup `addi x3, x0, 5`, the `addi x1, x1, -1`, the `beq` and the `jal` = 4 more, so `21 + 4 = 25`. *Reason: count every fetched instruction.*
- Step 3: the outer body runs 10 times, but on the last pass the `beq x1, x0, end` is taken and the `jal` is *not* executed — so the last iteration is one instruction shorter. *Reason: a taken branch skips the `jal`.*
- Step 4: `10 x 25 - 1 = 249`, plus the 2 setup instructions = `251`. *Reason: setup happens once, before any loop.*
- Step 5: single cycle -> cycles = instructions = 251, and `x2 = 10 x 5 = 50`. *Reason: the inner body increments `x2` 50 times.*

**Final answer:** **251 cycles**, `x2 = 50`.

## Common traps and mistakes
- **`PC + 1` instead of `PC + 4`.** RISC-V is byte-addressed with 4-byte instructions. Costs marks in every trace question and breaks the machine.
- **Swapping `rs1` and `rs2` in the bit layout.** `rs2` is bits `24:20`, `rs1` is `19:15` — the reverse of assembly order. Silent wrong answers in `sub`, `slt`, `sw`.
- **Treating `addi`'s immediate as unsigned.** 12 bits, signed: `4095` in the field means `-1`. Range is `-2048 .. +2047`.
- **Forgetting the implicit zero bit in B and J formats.** Branch and jump offsets are always even; bit 0 is not stored. Dropping it halves your offset.
- **Setting `RegWrite = 1` for `sw`.** It writes memory: `RegWrite = 0`, `MemWrite = 1`.
- **Thinking `lw` does not use the ALU.** It does — it computes `rs1 + imm`. "The ALU is idle during a load" loses the datapath mark.
- **Reading `funct7` for I-type instructions.** Those bits are immediate data. That is why `ALUOp = 11` exists.
- **Believing `beq` writes a register.** It has no `rd`; bits `11:8` and `11:7` are immediate bits.
- **Confusing the branch *offset* with an absolute address.** `beq ... 24` means `PC + 24`, not address `24`.
- **Assuming `jal x0, ...` writes `x0`.** `x0` is hardwired to 0; the link value is computed and thrown away. The jump still happens.

## Quick revision box
- ✅ Stored program: instructions and data share one memory; the *use* of a word, not its location, makes it an instruction.
- ✅ ISA = the hardware/software contract. RISC-V is open, clean, modular (`RV32I` + extensions). Speed is microarchitecture, not ISA.
- ✅ Ten instructions: `add sub and or slt addi lw sw beq jal`. Opcodes: R `0x33`, `addi` `0x13`, `lw` `0x03`, `sw` `0x23`, `beq` `0x63`, `jal` `0x6F`.
- ✅ `x0` is always 0 and ignores writes; `x1 = ra`, `x2 = sp`, `x10`–`x17` = `a0`–`a7`. All formats share `rd` at bits `11:7` and `opcode` at `6:0`.
- ✅ `sub` differs from `add` only in `funct7` bit 30 (`0000000` vs `0100000`).
- ✅ Single cycle means CPI = 1: cycles = instructions, and the clock must fit the slowest path (the `lw` path).
- ✅ Three muxes decide everything: `ALUSrc` (`rd2`/imm), `MemtoReg` (ALU/memory/`PC+4`), `PCSrc` (`PC+4`/`PC+imm`, where `PCSrc = Branch·zero + Jump`).
- ✅ `ALUOp`: `00` add, `01` sub, `10` R-type (`funct3` + `funct7`), `11` I-type (`funct3` only).

## Practice questions
1. Decode `0x00C3A303`. Give the instruction, its format and the value of its immediate.
2. Encode `sw x10, 0(x9)` into hex, showing each field.
3. A `beq` at address `0x24` encodes the offset `-12`. What address does it jump to, and how many instructions back is that?
4. Using the array-sum program of 5.5, how many cycles does it take for a 6-element array? Show your counting.
5. Fill the full control-signal row for `jal x1, -8`, and say what lands in `x1` if the `jal` is at address `0x50`.
6. In terms of the datapath, why must a single-cycle CPU's clock period fit the *slowest* instruction? Name that instruction.

## Answers
1. opcode `0x03` -> load; `funct3 = 010` -> word; `rd = 6`, `rs1 = 7`, `imm[11:0] = 000000001100 = 12`. So **`lw x6, 12(x7)`**, I-format, **immediate 12**.
2. `imm = 0` -> `imm[11:5] = 0000000`, `imm[4:0] = 00000`; `rs2 = 10 = 01010`, `rs1 = 9 = 01001`, `funct3 = 010`, opcode `0100011`. Bits `0000000 01010 01001 010 00000 0100011` -> **`0x00A4A023`**.
3. Target `= 0x24 - 12 = 0x24 - 0x0C` = **`0x18`**, which is `0x24 - 0x18 = 12` bytes = **3 instructions back**.
4. Per element `beq, lw, add, addi, addi, jal` = 6; 6 elements -> `36`; plus 4 setup; plus 1 final taken `beq`; plus 1 `sw` = **42 cycles**; the stored sum is `1+2+3+4+5+6 = 21`.
5. `jal` row: `RegWrite 1`, `ALUSrc X`, `MemRead 0`, `MemWrite 0`, `Branch 0`, `Jump 1`, `MemtoReg 10`, `ALUOp X`. Then `x1 <- PC + 4 = 0x54` and `PC <- 0x50 - 8 = 0x48`.
6. Every instruction must finish fetch, decode, execute, memory and write-back inside one clock period, because the PC only updates at the edge. So the period is set by the longest path — the **`lw`** path: PC -> instruction memory -> register file -> ALU -> data memory -> register file write. R-type and `beq` are shorter but must wait for the same clock, and that waste is exactly what pipelining removes.
