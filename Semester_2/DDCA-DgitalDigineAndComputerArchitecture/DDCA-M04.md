# DDCA – Module 4
## Where the Machine Keeps Things: Registers, Memory & the Register File
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

Module 3 gave us a single bit that can hold its value. Now we need somewhere to *keep things* — and a CPU needs two very different kinds of keeping.

The first is small, blazing fast, and right next to the ALU: a handful of **registers** (`x0` to `x31`), holding the values an instruction is working on right now. The second is large, slower, and holds the program itself plus all the data the program will ever touch: **memory**.

Analogy: a chef's kitchen. The **register file** is the small counter in front of you holding the three things you are chopping this second. **Memory** is the pantry and the fridge. You cannot cook out of the pantry directly — you have to walk over, fetch, and bring things back to the counter. Most of a CPU's design, and most of its speed problems, come from that walk.

Where you use it: this module builds the register file and the instruction/data memories that plug straight into the single-cycle RISC-V datapath in M5. After this module you have every storage block the CPU needs — the milestone is a working register file plus instruction and data memory in the simulator.

## Basics you must know first

- **Register** (M3.4): `n` flip-flops plus one 2:1 mux per bit, so it can load or hold.
- **Decoder** (M2.5): `k` input bits -> one of `2^k` output lines active. This is how an address picks one word out of many.
- **Multiplexer** (M2.5): `2^k` inputs, `k` select bits, one output. This is how memory hands back the word you asked for.
- **Binary and hex** (M1.4): one hex digit = exactly 4 bits, so `0x12345678` is 8 hex digits = 32 bits.
- **Byte**: 8 bits. **Word**: in RISC-V, 32 bits = 4 bytes. Say "word" and mean 4 bytes throughout this course.

## 4.1 Memory as addressable storage

### Intuition
A wall of **post-office boxes**. Each box has a number painted on it (the **address**) and holds one parcel (the **data**). You never say "give me the box third from the left" — you say "give me box 137". The number is the only handle you need, and it does not matter where the box physically is. That is what "random access" means: any address costs the same to reach.

### The idea, step by step
**1. Three words.** An **address** is a number that selects one storage location. A **word** is the chunk stored at one address — 32 bits in our machine. **Data** is the value inside. Memory is a table: address in, data out.

**2. How many addresses can `k` bits name?** Each address bit doubles the number of locations, so `k` bits name exactly `2^k` locations.

```
address bits k  ->  2^k locations
```

**Meaning**: `k` is the width of the address input. **When to use**: every time you size a memory. **Tiny example**: 12 address bits -> `2^12 = 4096` words.

**3. The same fact read backwards.** If you need `N` locations, you need `k = log2(N)` address bits, rounded **up**.

**4. The memory block, drawn.**

```
              +----------------------+
   address -->| A                D  |--> data out (32 bits)
   (k bits)   |                      |
              |     2^k words        |
   data in -->| DIN                  |
   (32 bits)  |                      |
              |  WE   (write enable) |
   WE ------->|                      |
              |  RE   (read enable)  |
   RE ------->|                      |
              +----------------------+
                  CLK (for writes)
```

Read the diagram as a promise: put an address on `A`, and if `RE=1` the word at that address appears on `D`. Put an address on `A` and data on `DIN` with `WE=1`, and at the clock edge that word is stored. Everything else in this module is a variation on these five wires.

**5. Two useful sanity numbers.** A memory of `2^k` words of `w` bits holds `2^k x w` bits. Our 32-bit machine with a 32-bit address could name `2^32 = 4,294,967,296` words — about 4 billion words, or 16 GiB of bytes.

### Formula / rule / table

```
locations = 2^(address bits)          address bits = ceil(log2(locations))
total bits stored = locations x word size
```

**Which one when?** "How many words can this address?" -> `2^k`. "How many address bits do I need?" -> `log2(N)`, rounded up. "How big is this memory in bytes?" -> `locations x (word size / 8)`.

**Example question:** A memory holds 1024 words of 32 bits. (a) How many address bits does it need? (b) How many bits does it store in total, and how many bytes? (c) What is the address of the last word, in decimal and hex? (d) If the machine is byte-addressed, how many address bits does the *system* need to reach all of it?

**Solution:**

Step 1 — address bits: `k = log2(1024) = 10`, since `2^10 = 1024`. Ten bits name exactly 1024 locations, no more and no fewer.

Step 2 — total bits: `1024 x 32 = 32768` bits.

Step 3 — bytes: `32768 / 8 = 4096` bytes = 4 KiB.

Step 4 — last address: addresses run `0` to `N-1`, so `1024 - 1 = 1023`. In hex, `1023 = 0x3FF` (check: `0x3FF = 3x256 + 15x16 + 15 = 768 + 240 + 15 = 1023` ✓).

Step 5 — part (d): byte addressing means each *byte* gets its own address, and there are 4096 bytes, so the system needs `log2(4096) = 12` address bits. That is `k + 2`, because each word is 4 bytes.

**Final answer:** (a) 10 address bits. (b) 32768 bits = 4096 bytes = 4 KiB. (c) address 1023 = `0x3FF`. (d) 12 address bits, since byte addressing gives every byte its own address.

⚠️ **Common trap:** Using `2^k` for the *last address* instead of `2^k - 1`. Addresses are zero-based, so 1024 words end at 1023, not 1024. Also: mixing up word count and byte count — a "1 KB memory" holds 1024 bytes = 256 words, not 1024 words.

## 4.2 The register file

### Intuition
The register file is the **small counter in front of the chef** — the few things actually being worked on right now. It is tiny (32 slots), it is the fastest storage in the machine, and it has exactly the shape the datapath needs: an instruction must read two source values and write one result, all in the same clock cycle.

Think of it as a **filing tray with three labelled slots**: "read A", "read B", "write C". Every cycle the datapath says "give me the contents of slot 5 and slot 6, and put this result into slot 7". Two reads, one write, simultaneously.

### The idea, step by step
**1. What it is made of.** 32 registers, each 32 bits wide, built from the Module 3 register (flip-flops + load-enable mux). Total storage: `32 x 32 = 1024` bits = 128 bytes. That is the *entire* fast storage of the CPU.

**2. Three ports.** A **port** is an independent access path with its own address input.

| port | address input | width | data direction |
|---|---|---|---|
| read port 1 | `rs1` (5 bits) | 32 bits | out (`RD1`) |
| read port 2 | `rs2` (5 bits) | 32 bits | out (`RD2`) |
| write port | `rd` (5 bits) | 32 bits | in (`WD`) |

Why 5 bits? Because `2^5 = 32` registers (section 4.1, read backwards).

**3. Reads are combinational, the write is clocked.** `RD1` and `RD2` appear as soon as `rs1`/`rs2` are valid — no clock needed, because reading does not change anything. The write happens only at a clock edge, and only if `RegWrite=1`. That asymmetry is the key idea: **reads are free and instant, writes are expensive and controlled.**

**4. The ASCII sketch (32 x 32).**

```
             32 registers x 32 bits = 1024 bits

  rs1[4:0] --->+-----------------------------+
               | [decoder 5->32]             |
               |   |  |  |        |           |
  rs2[4:0] --->|   v  v  v        v           |
               | +----+ +----+  +----+        |
               | |x0  | |x1  |..|x31 |        |
               | +----+ +----+  +----+        |
               |   |      |        |          |
               |   +------+--------+---> [MUX] ---> RD1 (32 bits)
               |   +------+--------+---> [MUX] ---> RD2 (32 bits)
               |          ^                    |
  rd[4:0]  --->| [decoder 5->32] -> one write-enable line per register
  WD[31:0] --->| data bus into every register's D input
  RegWrite --->| ANDed with each write-enable line
  CLK      --->| all 32 registers clock together
               +-----------------------------+
```

Read it in two halves. On the **read** side, `rs1` and `rs2` each drive a 5-to-32 decoder, and a big 32-to-1 multiplexer picks the requested register's output onto `RD1`/`RD2`. On the **write** side, `rd` drives a third 5-to-32 decoder whose 32 outputs are each ANDed with `RegWrite`; exactly one register sees `EN=1` and loads `WD` at the edge. Two reads and one write, every cycle.

**5. Why `x0` is hardwired to zero.** RISC-V says register `x0` always reads 0 and writes to it are ignored. Two reasons, and both are practical:

- **A free zero constant.** `addi x5, x0, 42` puts 42 into `x5` without needing a constant in memory. `add x5, x6, x0` is a move. Compilers use `x0` constantly.
- **It costs almost nothing.** Just tie that register's read lines to ground and gate off its write enable — one small AND gate per write line.

It also removes a class of bugs: you never have to ask "was `x0` overwritten?" because it cannot be.

**6. The rule in one line.** `RD1 = reg[rs1]`, `RD2 = reg[rs2]` combinationally; at the clock edge, `if (RegWrite) reg[rd] = WD`, except `rd = 0` which is discarded.

### Formula / rule / table

```
registers = 2^(register-number bits)       32 registers -> 5-bit rs1, rs2, rd
storage   = registers x width              32 x 32 = 1024 bits = 128 bytes
read      : RD1 = reg[rs1], RD2 = reg[rs2]           (combinational, instant)
write     : reg[rd] <- WD  only if RegWrite = 1      (at the clock edge)
x0        : reg[0] always reads 0; writes to x0 are thrown away
```

**Which one when?** "How wide is the register field?" -> `log2(number of registers)`. "How many read ports does this instruction need?" -> count its source registers (R-type needs 2, `lw` needs 1, `sw` needs 2, `jal` needs 0).

**Example question:** A register file holds `x0..x31`, all zero at reset, with `x0` hardwired to 0. Trace four consecutive cycles: (1) `RegWrite=1, rd=5, WD=100`; (2) `RegWrite=1, rd=0, WD=999`; (3) `RegWrite=0, rd=6, WD=200`; (4) `RegWrite=1, rd=6, WD=300`. Give the contents of `x5`, `x6`, `x0` after each cycle, and say what `rs1=5, rs2=6` reads in cycle 4.

**Solution:**

Step 1 — state the rule: a write lands only when `RegWrite=1` **and** `rd != 0`; otherwise nothing changes. `x0` reads 0 always.

Step 2 — walk the cycles:

| cycle | RegWrite | rd | WD | effect | x0 | x5 | x6 |
|---|---|---|---|---|---|---|---|
| start | - | - | - | - | 0 | 0 | 0 |
| 1 | 1 | 5 | 100 | `x5 = 100` | 0 | 100 | 0 |
| 2 | 1 | 0 | 999 | write to `x0` discarded | 0 | 100 | 0 |
| 3 | 0 | 6 | 200 | enable low, nothing written | 0 | 100 | 0 |
| 4 | 1 | 6 | 300 | `x6 = 300` | 0 | 100 | 300 |

Step 3 — cycle 2 is the interesting one: `RegWrite` is high but `rd=0`, so the write-enable line for `x0` is gated off and `x0` stays 0. If it had been written, every program using `x0` as a zero would silently break.

Step 4 — cycle 4 read: `RD1 = reg[5] = 100`, `RD2 = reg[6] = 300`. These appear combinationally in the same cycle, before any clock edge.

**Final answer:** after cycle 4, `x0 = 0`, `x5 = 100`, `x6 = 300`; the read gives `RD1 = 100`, `RD2 = 300`. Cycle 2 wrote nothing because `x0` is hardwired, and cycle 3 wrote nothing because `RegWrite=0`.

⚠️ **Common trap:** Forgetting that reads are combinational and writes are clocked. Students often draw a clock on the read ports, or expect a newly written value to be readable in the *same* cycle. Also: assuming `rd=0` throws an error — it does not, it is simply ignored, and that is deliberate.

## 4.3 Random Access Memory (RAM)

### Intuition
RAM is the **pantry**: big, cheap per item, and a short walk away. "Random access" means any address costs the same time to reach — unlike a tape, where reaching item 5000 means winding past 4999 others. Our simulated RAM is a plain array of words behind an address port, and that is genuinely all you need to know for this course.

### The idea, step by step
**1. Read/write memory.** RAM holds values you can both read and change. The word you read today may be different tomorrow — that is the "random" in RAM, meaning *not fixed*, as opposed to ROM.

**2. The block, with its control lines.**

```
                  +-------------------------+
   Address ------>| A                    D  |------> Data out (32)
   (k bits)       |                         |
                  |   RAM: 2^k x 32         |
   Data in ------>| DIN                     |
   (32 bits)      |                         |
                  |  WE   RE    CS          |
   Write Enable ->|                         |
   Read  Enable ->|                         |
   Chip Select -->|                         |
   CLK ---------->|  (writes latch on edge) |
                  +-------------------------+
```

- `WE` (write enable): 1 means "store `DIN` at `A` at the next clock edge".
- `RE` (read enable): 1 means "drive the word at `A` onto `D`".
- `CS` (chip select): 0 means "this chip ignores everything" — essential when several chips share one bus.

**3. Read and write are mutually exclusive.** In a single-port RAM, `WE` and `RE` are never both 1: you either read or you write in a cycle, not both. (Two-port memories exist but belong to a later course.)

**4. Access time.** **Access time** is the delay from putting a valid address on `A` to getting valid data on `D`. In our simulator it is one clock cycle; in real silicon it is tens of nanoseconds (see 4.7). It is *not* zero — that single fact drives the entire memory hierarchy.

**5. A worked write-then-read trace.** RAM starts all zeros.

| cycle | CS | WE | RE | A | DIN | D out | memory change |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 10 | 0x12345678 | - | `mem[10] = 0x12345678` |
| 2 | 1 | 0 | 1 | 10 | - | `0x12345678` | none (read) |
| 3 | 1 | 1 | 0 | 11 | 0xDEADBEEF | - | `mem[11] = 0xDEADBEEF` |
| 4 | 0 | 1 | 0 | 12 | 0xAAAA5555 | - | **nothing** (`CS=0`) |
| 5 | 1 | 0 | 1 | 12 | - | `0x00000000` | none (read) |

Cycle 4 is the lesson: with `CS=0` the chip is deaf, so address 12 stays 0 and cycle 5 reads 0.

**6. What we deliberately skip.** Cell internals — 6-transistor SRAM cells, 1-transistor DRAM cells with capacitors that must be refreshed, sense amplifiers, row/column addressing — all belong to *CMOS VLSI (T04)*. Here, RAM is a black box with an address, data, and control pins.

### Formula / rule / table

```
read  : if (CS = 1 and RE = 1) then D = mem[A]
write : if (CS = 1 and WE = 1) then mem[A] = DIN   at the clock edge
legal : never WE = 1 and RE = 1 on a single-port RAM
capacity = 2^(address bits) x word width
```

**Which one when?** "How long does this load take?" -> one access time (plus whatever the CPU adds). "Which word comes back?" -> `mem[A]`, and 0 for anything never written.

**Example question:** A 256-word RAM of 32 bits, all zeros, has `CS=1` throughout. Cycles: (1) `WE=1, A=0x20, DIN=0x00000007`; (2) `RE=1, A=0x20`; (3) `WE=1, A=0x21, DIN=0x00000009`; (4) `RE=1, A=0x21`; (5) `RE=1, A=0x22`. (a) Give the data out in cycles 2, 4, 5. (b) How many address bits does the RAM need? (c) What is its capacity in bytes?

**Solution:**

Step 1 — address bits: `log2(256) = 8`. Check: `2^8 = 256` ✓.

Step 2 — capacity: `256 x 32` bits `= 8192` bits `= 1024` bytes = 1 KiB.

Step 3 — cycle 2 reads the word just written: `mem[0x20] = 0x00000007`.

Step 4 — cycle 4 reads `mem[0x21] = 0x00000009`.

Step 5 — cycle 5 reads `mem[0x22]`, which was never written, so it returns 0: `0x00000000`. (Real RAM would return whatever garbage was there; a simulator usually zero-fills. Say which you assume.)

**Final answer:** (a) `0x00000007`, `0x00000009`, `0x00000000`. (b) 8 address bits. (c) 8192 bits = 1024 bytes = 1 KiB.

⚠️ **Common trap:** Forgetting `CS`, or reading a location that was never written and assuming it is 0 in real hardware. Also: mixing up "access time" (address to data) with "clock period" — in a single-cycle CPU the memory access time is what *sets* the clock period, which is exactly why single-cycle designs are slow (see 4.7 and 4.8).

## 4.4 Read-Only Memory (ROM)

### Intuition
ROM is the **recipe book on the shelf**: you read it, you never scribble in it. That sounds like a limitation, but it is a feature — a program does not change while it runs, so it can live in storage that cannot be written. Cheap, dense, and impossible to corrupt by accident.

Our CPU's instructions live in **instruction memory**, and in the simulator we build it as a ROM that is loaded once from a program file and then only ever read.

### The idea, step by step
**1. What ROM is.** Memory whose contents are fixed at manufacture or at "programming" time, and which can only be read afterwards. Variants exist (mask ROM, PROM, EPROM, EEPROM, flash) but for this course ROM = "read only, contents preset".

**2. Why the program goes in ROM.** Three reasons:
- The CPU **never writes** an instruction — it only fetches them. A write port would be dead silicon.
- The program must survive a power cycle. RAM forgets; ROM does not.
- Immutable code cannot be corrupted by a runaway pointer, which is a real safety property.

**3. The instruction memory block.** Identical to the RAM block minus the write side:

```
                  +-------------------------+
   PC ----------->| A                    D  |------> Instruction (32 bits)
   (32 bits)      |  Instruction ROM        |
                  |  2^k x 32               |
   CLK ---------->| (reads are combinational)|
                  +-------------------------+
```

In our single-cycle CPU the fetch is combinational: put `PC` on the address, get the instruction out in the same cycle.

**4. Constants live in ROM too.** Lookup tables — sine tables, character fonts, CRC tables, quantisation tables — are read-only data. If it never changes, ROM is cheaper and safer than RAM.

**5. ROM vs RAM, side by side.**

| Property | RAM | ROM |
|---|---|---|
| Read | yes | yes |
| Write | yes | no (at run time) |
| Contents after power-off | lost (volatile) | kept (non-volatile) |
| Speed | fast (SRAM) to moderate (DRAM) | fast, comparable to SRAM |
| Cost per bit | higher | lower |
| Density | lower | higher |
| Typical use in a CPU | data memory, register file's big cousin | instruction memory, constant tables |
| Control pins | `A`, `DIN`, `D`, `WE`, `RE`, `CS` | `A`, `D`, `RE`/`CS` |

**6. The one honest caveat.** "ROM" in a *simulator* is just an array you load at start-up and then promise not to write. The promise is enforced by your design, not by physics. Real ROM enforces it in the silicon.

### Formula / rule / table

```
instruction at PC  ->  instruction = imem[PC]        (combinational read)
ROM capacity       = 2^(address bits) x word width
no write port      ->  no WE, no DIN, no clock needed for reads
```

**Which one when?** "Where do the instructions live?" -> instruction memory, built as ROM. "Can this be modified at run time?" -> if no, ROM; if yes, RAM.

**Example question:** A RISC-V machine has byte-addressed memory and 4-byte instructions, and its instruction memory is a ROM of 1024 words. (a) Which word does the fetch of the instruction at PC `0x00000020` read? (b) How many address bits does the ROM need if it is *word*-addressed internally? (c) What is the highest PC this ROM can fetch, and what happens beyond it? (d) Why is there no write enable on this ROM?

**Solution:**

Step 1 — word index: `0x20 = 32` decimal, and instructions are 4 bytes, so word index `= 32 / 4 = 8`.

Step 2 — the fetch reads `imem[8]`. In general, the instruction at byte address `PC` is word `PC / 4`.

Step 3 — address bits for 1024 words: `log2(1024) = 10`.

Step 4 — highest PC: word 1023 is the last, and it occupies bytes `1023 x 4 = 4092` to `4095`, i.e. `0x00000FFC` to `0x00000FFF`. So the highest fetchable PC is `0x00000FFC`. Beyond `0x00000FFF` the address wraps or is out of range — in a real machine that would be a fault.

Step 5 — part (d): the CPU only ever reads instructions, never writes them, so a write port would be unused silicon. Removing it also makes the fetch purely combinational, which keeps the datapath simple.

**Final answer:** (a) word 8 (`imem[8]`). (b) 10 address bits. (c) highest PC `0x00000FFC`, the last word; anything above `0x00000FFF` is out of range. (d) because nothing ever writes an instruction — it would be dead hardware.

⚠️ **Common trap:** Confusing *word* index with *byte* address. With 4-byte instructions, PC `0x20` is word 8, not word 32. Always divide by 4 when the machine is byte-addressed. Second trap: giving the ROM a `WE` pin in a diagram "to be safe" — an examiner reads that as not understanding what ROM means.

## 4.5 Memory organisation

### Intuition
Three separate ideas live here, and students mix them up constantly.

**Words vs bytes**: is the address counting words or bytes? **Endianness**: when a 4-byte word is stored, which byte goes first? **Address decoding**: when you build a big memory out of several small chips, which chip answers?

Think of moving house. A **box** (word) holds four **shoes** (bytes). The removal company can label boxes ("box 5") or individual shoes ("shoe 20") — that is words vs bytes. When packing, do the left shoes go in first or the right? — that is endianness. And with four lorries each taking a range of boxes, someone must decide which lorry answers for box 7 — that is decoding.

### The idea, step by step
**1. Word addressing vs byte addressing.** A **word-addressed** memory has one address per word. A **byte-addressed** memory has one address per byte, so a 4-byte word spans four consecutive addresses.

```
32-bit word, byte-addressed:
  word index w  ->  byte addresses 4w, 4w+1, 4w+2, 4w+3
  byte address b ->  word index b / 4 , byte offset within word = b mod 4 = b[1:0]
```

**Meaning**: the bottom 2 address bits are the byte offset; the rest is the word index. **When to use**: to convert between a `PC` and an instruction-memory word index, or an address and a word in data memory. **Tiny example**: byte address `0x100C` -> word `0x100C / 4 = 0x403`, offset `0x100C mod 4 = 0`. (`0x100C = 4108`, `4108/4 = 1027 = 0x403` ✓.)

So a byte-addressed memory of `2^k` words needs `k + 2` address bits — exactly what we found in 4.1(d).

**2. Endianness.** When the 32-bit value `0x12345678` is stored at byte address `0x100`, one of two conventions decides the byte order.

- **Little-endian**: the *least* significant byte goes at the *lowest* address. (RISC-V, x86.)
- **Big-endian**: the *most* significant byte goes at the lowest address. (Many network protocols.)

Worked, `0x12345678` at byte address `0x100`:

| byte address | little-endian | big-endian |
|---|---|---|
| `0x100` | `0x78` (least significant) | `0x12` (most significant) |
| `0x101` | `0x56` | `0x34` |
| `0x102` | `0x34` | `0x56` |
| `0x103` | `0x12` (most significant) | `0x78` (least significant) |

Read either column bottom-to-top or top-to-bottom and you get the same 32-bit value; only the *layout in memory* differs. Note the little-endian column reads `78 56 34 12` — the value backwards, which is exactly the mental trick: **little-endian stores the little end first.**

RISC-V is little-endian. That matters the moment you dump memory in the simulator and try to read a number out of it.

**3. Alignment.** A 4-byte word is **aligned** if its address is a multiple of 4, i.e. its bottom two bits are `00`. RISC-V requires aligned `lw`/`sw`; an unaligned access is an exception. This is not fussiness — the hardware fetches the word in one go, and a word straddling two word-boundaries would need two accesses.

**4. Address decoding.** Real memories are built from several chips. **Address decoding** is the logic that decides which chip answers a given address: the high address bits select the chip, the low bits select the word inside it.

Worked: build 32 KB from 8 KB chips.
- `32 KB = 32768 = 2^15` -> 15 address bits `A14..A0`.
- `8 KB = 8192 = 2^13` -> 13 bits `A12..A0` go to every chip.
- `2^15 / 2^13 = 4` chips, selected by `A14, A13` through a **2-to-4 decoder**.

| `A14 A13` | chip selected | address range |
|---|---|---|
| 0 0 | chip 0 | `0x0000`-`0x1FFF` |
| 0 1 | chip 1 | `0x2000`-`0x3FFF` |
| 1 0 | chip 2 | `0x4000`-`0x5FFF` |
| 1 1 | chip 3 | `0x6000`-`0x7FFF` |

Check chip 1's range: `0x2000 = 8192`, and it covers 8192 bytes, so `8192` to `16383` = `0x2000` to `0x3FFF` ✓.

**5. Memory-mapped I/O uses the same trick.** Put a device at an address the RAM does not use, decode that address range, and the CPU talks to hardware with ordinary `lw`/`sw`. That is how Module 6's LED peripheral will work.

### Formula / rule / table

```
byte address b  ->  word index = b / 4,  byte offset = b mod 4 = b[1:0]
byte-addressed memory of 2^k words  ->  needs k + 2 address bits
chips needed = total size / chip size       chip-select bits = log2(chips needed)
aligned 4-byte word  ->  address mod 4 = 0  (bottom two bits are 00)
little-endian: least significant byte at the lowest address (RISC-V)
```

**Which one when?** "Which byte is at address X?" -> endianness table. "How many address bits?" -> words vs bytes decides whether it is `k` or `k+2`. "Which chip answers?" -> split the address into high (chip select) and low (offset) bits.

**Example question:** A little-endian RISC-V machine has `sw x5, 0(x6)` with `x5 = 0x12345678` and `x6 = 0x00001004`. (a) Which byte addresses does the store touch, and with what values? (b) If a program then executes `lb x7, 0(x6)` (load one signed byte), what does `x7` hold? (c) What would the four bytes be on a big-endian machine? (d) Is this address aligned?

**Solution:**

Step 1 — the address: `0x1004`. It is a multiple of 4 (`0x1004 / 4 = 0x401`, exactly), so it is aligned and the store touches exactly `0x1004`-`0x1007`.

Step 2 — little-endian layout: least significant byte first. `0x12345678` splits into bytes `12`, `34`, `56`, `78` from most to least significant.

| address | value |
|---|---|
| `0x1004` | `0x78` |
| `0x1005` | `0x56` |
| `0x1006` | `0x34` |
| `0x1007` | `0x12` |

Step 3 — part (b): `lb` at `0x1004` reads one byte = `0x78` = `0111 1000` in binary. As a *signed* byte, the top bit is 0, so the value is positive: `+120`. Sign extension fills the upper 24 bits with 0, giving `0x00000078` = 120.

Step 4 — part (c): big-endian puts the most significant byte first, so `0x1004 = 0x12`, `0x1005 = 0x34`, `0x1006 = 0x56`, `0x1007 = 0x78`. Note that `lb` at `0x1004` would then give `0x12` = 18 — a different number from the same code. **That is why endianness matters.**

Step 5 — part (d): `0x1004 mod 4 = 0`, so yes, aligned.

**Final answer:** (a) `0x1004 = 0x78`, `0x1005 = 0x56`, `0x1006 = 0x34`, `0x1007 = 0x12`. (b) `x7 = 0x00000078` = 120 (positive, so zero-extended by the sign bit). (c) big-endian gives `12 34 56 78` in that order, and `lb` would return `0x12` = 18. (d) aligned, since `0x1004` is a multiple of 4.

⚠️ **Common trap:** Reversing the bytes for *little*-endian. Little-endian means the little (least significant) end goes first, so the byte you see at the lowest address is the **last** two hex digits of the value. The second trap: forgetting that `lb` sign-extends — a byte `0xF0` loaded with `lb` becomes `0xFFFFFFF0`, not `0x000000F0`. The third: dividing by 4 in hex instead of decimal (divide the *value*, not the digits).

## 4.6 Connecting memory to the rest of the machine

### Intuition
Two different conversations happen between the CPU and memory, and they are easy to confuse.

**Fetching** is the CPU asking "what is the next thing to do?" — the address comes from the **program counter**, and the answer is an instruction. **Loading and storing** is the CPU saying "bring me the value at this computed address" or "put this value there" — the address comes from the **ALU**, and the data comes from (or goes to) the **register file**.

Same memory hardware, two completely different address sources. Keep them apart and the M5 datapath becomes obvious.

### The idea, step by step
**1. The fetch path.** `PC -> instruction memory address -> instruction out`. Because instructions are 4 bytes and the machine is byte-addressed, the next PC is `PC + 4`.

```
   +--------+   PC    +---------------------+
   |   PC   |-------->| instruction memory  |----> instruction (32 bits)
   | register|        |  (ROM, read-only)   |            |
   +--------+         +---------------------+            v
       ^                                            to control unit
       |                                                    and
       +<---- PC + 4 adder <---- (next-PC mux) <---- branch/jump target
```

**2. The load path (`lw`).** The instruction's immediate is added to a register value by the ALU, and that sum is the memory address.

```
   x6 (base) --->+------+
                 | ALU  |-- address -->+------------------+
   imm (offset)->+------+              |   data memory    |-- data --> write back
                                       |    (RAM)         |            into rd
   (read enable) --------------------->|                  |
                                       +------------------+
```

`lw x5, 8(x6)` means: address `= x6 + 8`, read that word, write it into `x5`.

**3. The store path (`sw`).** Same address computation, but the data flows the other way — from a register into memory.

```
   x6 (base) --->+------+                     +------------------+
                 | ALU  |-- address -------->|   data memory    |
   imm (offset)->+------+                     |    (RAM)         |
                                              |                  |
   x5 (data) ------------------------------>  | DIN              |
   (write enable) --------------------------> | WE               |
                                              +------------------+
```

`sw x5, 8(x6)` means: address `= x6 + 8`, store `x5`'s value there. **Nothing is written back to the register file** — that is the key difference from `lw`.

**4. The four signals every memory access needs.** An address (from PC or ALU), data (for stores), a direction (read or write), and an enable (is this an access at all?). Instructions that are not memory instructions must not disturb memory, so the enable is 0 for them.

**5. The one shared memory vs two separate memories decision.** A **von Neumann** machine uses one memory for both instructions and data (simpler, but the two uses compete for the same port). A **Harvard** machine uses two separate memories (can fetch and load in the same cycle). Our single-cycle CPU uses two blocks — instruction memory and data memory — which is Harvard-flavoured, and that is why one instruction can fetch *and* load in a single clock.

### Formula / rule / table

```
fetch       : instruction = imem[PC];   next PC = PC + 4
load  (lw)  : address = reg[rs1] + imm;  reg[rd] <- dmem[address]
store (sw)  : address = reg[rs1] + imm;  dmem[address] <- reg[rs2]
not a memory instruction  ->  MemRead = 0 and MemWrite = 0
```

**Which one when?** "Where does the address come from?" -> PC for fetch, ALU for load/store. "Does anything go back to the register file?" -> yes for `lw`, no for `sw`.

**Example question:** A single-cycle RISC-V machine has `x6 = 0x1000`, `x5 = 0xCAFEBABE`, and `mem[0x1008] = 0x0000002A`. Trace the two instructions `lw x7, 8(x6)` then `sw x5, 12(x6)`. For each: give the memory address, whether it is a read or a write, and what changes.

**Solution:**

Step 1 — `lw x7, 8(x6)`: the ALU computes `reg[rs1] + imm = 0x1000 + 8 = 0x1008`. `MemRead=1`, `MemWrite=0`.

Step 2 — the read returns `mem[0x1008] = 0x0000002A`, which is written into `x7`. So `x7 = 0x0000002A` after the clock edge.

Step 3 — `sw x5, 12(x6)`: the ALU computes `0x1000 + 12 = 0x100C`. `MemWrite=1`, `MemRead=0`.

Step 4 — the store data is `reg[rs2] = x5 = 0xCAFEBABE`, so `mem[0x100C] = 0xCAFEBABE` at the clock edge. The register file is **not** written (no `RegWrite`).

Step 5 — check the addresses are aligned: `0x1008 mod 4 = 0` ✓, `0x100C mod 4 = 0` ✓. Both are legal.

Step 6 — sanity check the difference: after both instructions, `x7` changed and `x5`/`x6` did not; memory at `0x100C` changed and memory at `0x1008` did not.

**Final answer:** `lw` reads `0x1008` and sets `x7 = 0x0000002A`; `sw` writes `0xCAFEBABE` to `0x100C` and changes no register. Both addresses come from the ALU, not from the PC.

⚠️ **Common trap:** Sending the store's result to the register file. `sw` writes *memory*, never a register — if you assert `RegWrite` on a store you corrupt a register silently. The second trap: using the PC as the data-memory address (that is the fetch path). The third: forgetting `MemWrite=0` on non-memory instructions, which makes `add` scribble on memory.

## 4.7 The memory hierarchy and why it exists

### Intuition
You want three things from storage: **big**, **fast**, and **cheap**. Physics says you can have two. A big memory is slow because more storage means longer wires and more addressing; a fast memory is expensive because fast cells are large.

The trick that buys all three is a **hierarchy** — a small fast layer in front of a big slow layer, exactly like a desk beside a filing cabinet beside a warehouse. You keep what you are using *now* on the desk. The filing cabinet holds this week's work. The warehouse holds everything.

It works because programs are **predictable** — they reuse the same data and the same instructions over and over. That predictability is called **locality**, and without it the whole hierarchy would be pointless.

### The idea, step by step
**1. The trade-off, in one table.** (Order-of-magnitude typical values for a 2020s laptop-class machine — memorise the *ratios*, not the exact numbers.)

| Level | Typical size | Typical access time | Relative cost per byte | Managed by |
|---|---|---|---|---|
| Registers | ~128 bytes (32 x 4 B) | under 1 ns (0 cycles) | highest | the compiler / programmer |
| L1 cache | 32-64 KB | ~1 ns (3-4 cycles) | very high | hardware |
| L2 cache | 256 KB-1 MB | ~4-10 ns | high | hardware |
| L3 cache (often shared) | several MB | ~15-30 ns | moderate | hardware |
| Main memory (DRAM) | 8-32 GB | ~50-100 ns | low | hardware + OS |
| SSD | 256 GB-2 TB | ~50-100 microseconds | very low | OS |
| Hard disk | 1-20 TB | ~5-10 ms | lowest | OS |

Read the table as a set of cliffs: registers to L1 is a few cycles, L1 to DRAM is ~100x, DRAM to SSD is ~1000x. Every level down is bigger, slower, and cheaper — and those three facts are not independent, they are the same fact.

**2. Temporal locality.** *If you used something, you will probably use it again soon.* The loop counter `i`, the accumulator `sum`, and the loop's own instructions are touched every single iteration.

**3. Spatial locality.** *If you used something, you will probably use its neighbour soon.* Arrays are stored contiguously, so `a[i]` and `a[i+1]` are adjacent — fetching one brings the other almost free.

**4. A loop that shows both.** Java, since that is what we write:

```java
public class Locality {
    public static void main(String[] args) {
        int[] a = new int[1000];
        for (int i = 0; i < a.length; i++) a[i] = i;

        int sum = 0;
        for (int i = 0; i < a.length; i++) {
            sum = sum + a[i];   // temporal: sum and i are reused every pass
        }                       // spatial : a[0], a[1], a[2] ... are adjacent
        System.out.println("sum = " + sum);
    }
}
```

What it prints: `sum = 499500`, because `0 + 1 + ... + 999 = 999 x 1000 / 2 = 499500`. (Worth checking: the Gauss formula `n(n-1)/2` with `n = 1000` gives `1000 x 999 / 2 = 499500` ✓.)

Now count the traffic. **Temporal**: `sum` and `i` are used 1000 times each but live in registers — essentially free. **Spatial**: the array is 1000 words = 4000 bytes, contiguous; one cache line (typically 64 bytes = 16 words) brings 16 useful values at once, so the loop needs about `1000/16 = 63` memory fetches instead of 1000. That is the entire magic of caches in one number.

**5. Why we stop here.** How a cache *decides* what to keep — direct-mapped vs set-associative, replacement policies, write-back vs write-through, miss penalties, AMAT — is a whole later course. In this module you only need: the hierarchy exists, it works because of locality, and it is the reason a machine can be both big and fast. Module 6.7 revisits it.

**6. Average memory access time, the one formula worth knowing now.**

```
AMAT = hit time + miss rate x miss penalty
```

**Meaning**: `hit time` is how long a hit takes, `miss rate` is the fraction of accesses that miss (1 - hit rate), `miss penalty` is the extra time a miss costs. **When to use**: to see why the top of the hierarchy matters so much. **Tiny example**: hit time 1 ns, hit rate 0.9, miss penalty 50 ns -> `AMAT = 1 + 0.1 x 50 = 6 ns` — a 10% miss rate makes the memory six times slower than a hit.

### Formula / rule / table

```
AMAT = hit time + miss rate x miss penalty
miss rate = 1 - hit rate
total time = number of accesses x AMAT
```

**Which one when?** "How much does this cache help?" -> `AMAT`. "Which level is this?" -> size and access time from the table above. "Why is this loop fast?" -> spatial locality (contiguous) or temporal locality (reuse).

**Example question:** A processor runs 1,000,000 loads. Its L1 hit time is 1 ns with a 95% hit rate; a miss costs an extra 80 ns to reach DRAM. (a) What is the AMAT? (b) What is the total memory time? (c) A redesign raises the hit rate to 99% but adds 0.2 ns to the hit time. Is it better?

**Solution:**

Step 1 — miss rate `= 1 - 0.95 = 0.05`.

Step 2 — `AMAT = 1 + 0.05 x 80 = 1 + 4 = 5 ns`.

Step 3 — total time `= 1,000,000 x 5 ns = 5,000,000 ns = 5 ms`.

Step 4 — redesign: miss rate `= 0.01`, hit time `= 1.2 ns`. `AMAT = 1.2 + 0.01 x 80 = 1.2 + 0.8 = 2.0 ns`.

Step 5 — compare: `2.0 ns` versus `5.0 ns`, so the redesign is `5/2 = 2.5x` faster. Total time `= 1,000,000 x 2.0 ns = 2 ms`.

Step 6 — sanity check the intuition: the extra 0.2 ns is paid on *every* access, but it bought a 4x reduction in misses, each worth 80 ns. `0.2 ns x 1 = 0.2` spent versus `0.04 x 80 = 3.2 ns` saved — a clear win.

**Final answer:** (a) `AMAT = 5 ns`. (b) `5 ms`. (c) Yes: `AMAT = 2.0 ns`, so 2.5x faster (total `2 ms`).

⚠️ **Common trap:** Using the hit *rate* where the miss *rate* belongs. `AMAT = hit time + hit rate x miss penalty` is wrong and gives a nonsense answer. Second trap: comparing levels by size only — a bigger cache is slower per access, and that is the whole point of having levels.

## 4.8 The von Neumann bottleneck

### Intuition
Here is the uncomfortable truth about the architecture we are building. Instructions and data live in the **same memory**, reached through **one** connection, one access at a time. But the CPU is enormously faster than that memory. So the CPU spends most of its life **waiting for the postman**.

This is the **von Neumann bottleneck**: the single path between processor and memory limits how fast the whole machine can go, no matter how clever the processor is. John von Neumann's stored-program design (instructions and data in one memory) is what makes general-purpose computing possible — and it is also what caps its speed.

### The idea, step by step
**1. The stored-program idea, and its price.** Putting instructions in the same memory as data was the great idea of 1945: the machine can treat a program as data, load it, and even modify it. The price is that fetching an instruction and fetching a piece of data use the *same* port, so they compete.

**2. The speed gap, in numbers.** Take a 3 GHz CPU: one cycle is `1/3e9 s = 0.333 ns`. DRAM takes about `60 ns` to answer.

```
cycles waiting = 60 ns / 0.333 ns = 180 cycles
```

**Meaning**: 180 cycles is roughly 180 instructions' worth of work that the CPU *could* have done, spent doing nothing. **Tiny example**: a program that misses once per 100 instructions and waits 180 cycles per miss spends `180/280 ≈ 64%` of its time waiting.

**3. Why the gap keeps growing.** Moore's law made transistors smaller and logic faster every generation. DRAM improved much more slowly, because it is limited by capacitance and by the wires to the chip. So the *ratio* — cycles of waiting per memory access — has grown for decades. This is often called the **memory wall**.

**4. The three ways out, all of which you will meet later.**

| Fix | Idea | Where you see it |
|---|---|---|
| **Caches** | keep recently used data close, so most accesses never reach DRAM | 4.7, Module 6.7 |
| **Pipelining / parallelism** | do something useful while waiting; overlap many accesses | Module 6.6 |
| **Locality-aware software** | write loops that walk memory in order | every performance-minded program |

**5. What it means for *our* CPU, concretely.** In the single-cycle design, the clock period must be long enough for the *slowest* instruction — and the slowest path includes instruction memory *and* data memory. So `T` is set by memory, and every instruction, even a trivial `add`, pays the memory's access time. That is the von Neumann bottleneck showing up as a design constraint you can measure with a stopwatch: one slow path, one slow clock, for everything.

**6. The honest summary.** The bottleneck does not make computers useless — caches hide almost all of it. But it is why a 3 GHz processor does not run 3 billion instructions per second, and why "memory-bound" is a phrase you will hear for the rest of your career.

### Formula / rule / table

```
cycles waiting per access = memory access time / clock period
fraction of time waiting  = (misses x miss penalty) / (misses x miss penalty + instructions)
AMAT (again)              = hit time + miss rate x miss penalty
```

**Which one when?** "Why is my program slow despite a fast CPU?" -> count memory accesses and multiply by the wait. "How much faster could this be?" -> compare `AMAT` with the ideal hit time.

**Example question:** A 2 GHz single-cycle CPU has a clock period set by its longest path: instruction memory 4 ns + register file 1 ns + ALU 2 ns + data memory 4 ns + overhead 1 ns. (a) What is the clock period and frequency? (b) What fraction of the clock period is memory access? (c) If the CPU instead ran at 2 GHz with no memory limit, how many times faster would it be? (d) Name two fixes.

**Solution:**

Step 1 — the longest path is the `lw` path, which includes both memories: `4 + 1 + 2 + 4 + 1 = 12 ns`. So `T = 12 ns`.

Step 2 — frequency: `f = 1/12e-9 = 83.3e6`, so `83.3 MHz`. Note that this is nowhere near 2 GHz — that is the whole point.

Step 3 — memory share: instruction memory `4 ns` plus data memory `4 ns` = `8 ns` out of `12 ns`, so `8/12 = 66.7%`.

Step 4 — part (c): at a true 2 GHz the period would be `0.5 ns`, so the ideal machine is `12 / 0.5 = 24x` faster. That factor of 24 is the price of memory in the clock period.

Step 5 — part (d): caches (so most accesses never reach the slow memory), and pipelining (so several instructions overlap and the slow path is not paid serially). Both are later modules.

**Final answer:** (a) `T = 12 ns`, `f = 83.3 MHz`. (b) `66.7%` of the period is memory access. (c) `24x` faster if memory were free. (d) Caches and pipelining (and, at the software level, locality-aware loops).

⚠️ **Common trap:** Adding up *every* block's delay instead of the single longest path. The `lw` path is longest because it visits both memories; a plain `add` does not. Second trap: saying the bottleneck is "the CPU is too slow" — it is the opposite: the CPU is fast and the memory is slow, and the gap is what costs you.

## Formula / rule summary table

| Words in the question | Tool | Key expression |
|---|---|---|
| "how many words can this address?" | address width | `locations = 2^k` |
| "how many address bits?" | address width | `k = ceil(log2 N)` (words); `k + 2` if byte-addressed |
| "how big is this memory?" | capacity | `locations x word width` bits |
| "how wide is the register field?" | register file | `log2(32) = 5` bits |
| "what does this read return?" | register file / RAM | `reg[rs]` / `mem[A]`, 0 if never written |
| "is this write kept?" | write enable | only if `RegWrite=1` (and `rd != 0`) |
| "which chip answers?" | decoding | high address bits -> decoder -> `CS` |
| "which byte is at address X?" | endianness | little-endian: least significant byte first |
| "word index from a byte address?" | words vs bytes | `b / 4`, offset `b mod 4` |
| "where does the fetch address come from?" | datapath | the PC; for `lw`/`sw` it is the ALU |
| "how fast is memory on average?" | hierarchy | `AMAT = hit + miss rate x penalty` |
| "why is it slow despite a fast CPU?" | von Neumann bottleneck | wait cycles = access time / clock period |

## Solved examples

### Example 1 (easy-medium) — sizing and decoding

**Question:** A byte-addressed machine has 64 KB of memory built from 16 KB chips. (a) How many address bits does the system need? (b) How many bits go to each chip? (c) How many chips, and how many chip-select bits? (d) Give the address range of the second chip.

**Solution:** Step 1 — `64 KB = 65536 = 2^16` bytes, so 16 address bits `A15..A0`. Step 2 — `16 KB = 16384 = 2^14`, so 14 bits `A13..A0` go to every chip. Step 3 — `2^16 / 2^14 = 4` chips, selected by `A15, A14` through a 2-to-4 decoder, i.e. 2 chip-select bits. Step 4 — chip 0 covers `0x0000`-`0x3FFF` (16384 bytes), chip 1 covers `0x4000`-`0x7FFF`.

**Final answer:** (a) 16 address bits. (b) 14 bits per chip. (c) 4 chips, 2 chip-select bits. (d) chip 1: `0x4000`-`0x7FFF`.

### Example 2 (exam level) — a full memory trace

**Question:** A little-endian RISC-V machine has `x10 = 0x2000`, `x11 = 0xA1B2C3D4`, and `mem[0x2000] = 0x00000001`. Execute, in order: (i) `lw x12, 0(x10)`; (ii) `sw x11, 4(x10)`; (iii) `lb x13, 4(x10)`; (iv) `lw x14, 8(x10)`. Give the final values of `x12`, `x13`, `x14`, and the four bytes at `0x2004`-`0x2007`.

**Solution:** Step 1 — (i) address `0x2000`, read `0x00000001`, so `x12 = 0x00000001`. Step 2 — (ii) address `0x2000 + 4 = 0x2004`, store `0xA1B2C3D4`; little-endian so `0x2004 = 0xD4`, `0x2005 = 0xC3`, `0x2006 = 0xB2`, `0x2007 = 0xA1`. Step 3 — (iii) `lb` at `0x2004` reads `0xD4` = `1101 0100`; the top bit is 1, so it is negative, and sign extension gives `0xFFFFFFD4`. As a signed number that is `-44` (since `0x100 - 0xD4 = 0x2C = 44`). Step 4 — (iv) address `0x2008`, never written, so it reads 0 (in a zero-filled simulator) and `x14 = 0x00000000`.

**Final answer:** `x12 = 0x00000001`, `x13 = 0xFFFFFFD4` (= -44), `x14 = 0x00000000`; bytes `0x2004..0x2007 = D4 C3 B2 A1`.

### Example 3 (exam level) — hierarchy arithmetic

**Question:** A CPU runs 10,000,000 loads. L1: 1 ns hit, 90% hit rate; a miss costs 90 ns extra. (a) AMAT? (b) Total time? (c) If a second-level cache catches 80% of the L1 misses with a 10 ns penalty, what is the new AMAT?

**Solution:** Step 1 — (a) miss rate `0.10`, `AMAT = 1 + 0.10 x 90 = 10 ns`. Step 2 — (b) `10,000,000 x 10 ns = 100,000,000 ns = 0.1 s`. Step 3 — (c) of the 10% that miss L1, 80% hit L2: `0.10 x 0.80 = 0.08` of all accesses cost `10 ns`; the remaining `0.10 x 0.20 = 0.02` go all the way and cost `90 ns`. So `AMAT = 1 + 0.08 x 10 + 0.02 x 90 = 1 + 0.8 + 1.8 = 3.6 ns`. Step 4 — check the total: `10,000,000 x 3.6 ns = 36 ms`, versus `100 ms` before — about `2.8x` faster.

**Final answer:** (a) `10 ns`. (b) `0.1 s`. (c) `AMAT = 3.6 ns`, total `36 ms`, about 2.8x faster.

## Common traps and mistakes

- **Using `2^k` as the last address.** Addresses are zero-based: 1024 words run `0` to `1023`. Cost: every range and size answer is off by one.
- **Confusing words with bytes.** A 1 KB memory is 1024 bytes = 256 words of 32 bits. Cost: a wrong capacity, a wrong address-bit count, a wrong chip count.
- **Forgetting the `+2` for byte addressing.** `2^k` words need `k` bits if word-addressed and `k + 2` if byte-addressed. Cost: the decoder splits the address at the wrong bit.
- **Reversing little-endian.** Little-endian puts the *least significant* byte at the *lowest* address, so you see the last two hex digits first. Cost: reading any memory dump backwards.
- **Forgetting that `lb` sign-extends.** `0xF0` loaded with `lb` is `0xFFFFFFF0`. Cost: a wrong value plus a wrong discussion of signedness.
- **Writing to `x0` and expecting it to stick.** `x0` is hardwired; the write is silently dropped. Cost: a program that "loses" a value with no error.
- **Asserting `RegWrite` on a store.** `sw` writes memory, never a register. Cost: a silently corrupted register.
- **Forgetting `MemWrite=0` on non-memory instructions.** Then `add` scribbles on memory. Cost: memory that changes for no reason, and hours of confusion.
- **Using the PC as the data-memory address.** Fetch uses the PC; `lw`/`sw` use the ALU. Cost: the datapath reads instructions as data.
- **Using hit rate in the AMAT formula.** It is `miss rate x miss penalty`. Cost: an answer that says a worse cache is faster.
- **Adding every block's delay instead of the longest path.** Only the single longest path between two flip-flops sets the clock. Cost: a clock period that is far too pessimistic.
- **Assuming a never-written RAM location is 0 in real hardware.** It holds whatever was there. Cost: a simulator result that does not reproduce on a chip.

## Quick revision box

✅ **1.** Memory is a table: address in, word out. `k` address bits name `2^k` locations, so `N` locations need `ceil(log2 N)` bits. Addresses run `0` to `N-1`.

✅ **2.** The register file is 32 registers x 32 bits = 1024 bits = 128 bytes, with **two combinational read ports** (`rs1`, `rs2`, 5 bits each) and **one clocked write port** (`rd`, `WD`, gated by `RegWrite`). `x0` always reads 0 and ignores writes.

✅ **3.** RAM = read/write, needs `A`, `DIN`, `D`, `WE`, `RE`, `CS`. `WE` and `RE` are never both 1 on a single port. Access time is not zero — that one fact drives the whole hierarchy.

✅ **4.** ROM = read-only, non-volatile, no `WE`. Instructions live in instruction memory built as ROM; so do constant tables. Our fetch is `instruction = imem[PC]`, combinationally.

✅ **5.** Byte addressing gives each byte its own address, so a `2^k`-word memory needs `k + 2` bits and word index `= byte address / 4`. RISC-V is **little-endian**: least significant byte at the lowest address.

✅ **6.** Address decoding splits the address into high bits (which chip, via a decoder -> `CS`) and low bits (which word inside the chip).

✅ **7.** Fetch takes its address from the **PC**; `lw`/`sw` take theirs from the **ALU** (`reg[rs1] + imm`). `lw` writes a register; `sw` writes memory only.

✅ **8.** The hierarchy exists because big + fast + cheap is impossible. Locality (temporal = reuse, spatial = neighbours) makes it work. `AMAT = hit time + miss rate x miss penalty`. The **von Neumann bottleneck** is the single CPU-memory path, and it is why a fast CPU still waits.

## Practice questions

**Q1.** A memory holds 4096 words of 16 bits. (a) How many address bits? (b) Total bits and bytes? (c) Address of the last word in hex?

**Q2.** A register file starts all zero. Cycles: (1) `RegWrite=1, rd=3, WD=0xAA`; (2) `RegWrite=1, rd=0, WD=0xBB`; (3) `RegWrite=0, rd=3, WD=0xCC`; (4) `RegWrite=1, rd=3, WD=0xDD`. Give `x0` and `x3` after each, and what `rs1=3` reads in cycle 3.

**Q3.** A little-endian machine stores `0x0BADF00D` at byte address `0x40`. Give the four bytes at `0x40`-`0x43`, and what `lb` at `0x43` returns as a signed value.

**Q4.** A byte-addressed machine needs 128 KB of memory from 32 KB chips. (a) Total address bits? (b) Bits per chip? (c) Number of chips and chip-select bits? (d) Range of the third chip?

**Q5.** A CPU runs 5,000,000 loads with a 1.5 ns hit time, 96% hit rate, and a 70 ns miss penalty. (a) AMAT? (b) Total time? (c) What would the hit rate need to be to halve the AMAT?

**Q6.** A single-cycle CPU's `lw` path is: instruction memory 3 ns, register file 1 ns, ALU 2 ns, data memory 3 ns, overhead 1 ns. (a) Clock period and frequency? (b) Fraction of the period spent in memory? (c) How many 3 GHz cycles is one such clock period?

## Answers

**A1.** (a) `log2(4096) = 12` bits. (b) `4096 x 16 = 65536` bits = 8192 bytes = 8 KiB. (c) `4096 - 1 = 4095 = 0xFFF` (check: `15x256 + 15x16 + 15 = 4095` ✓). **Final answer: 12 bits, 65536 bits / 8192 bytes, last address `0xFFF`.**

**A2.** Rule: write only if `RegWrite=1` and `rd != 0`; reads are combinational.

| cycle | effect | x0 | x3 |
|---|---|---|---|
| start | - | 0 | 0 |
| 1 | `x3 = 0xAA` | 0 | 0xAA |
| 2 | `rd=0` write dropped | 0 | 0xAA |
| 3 | `RegWrite=0`, nothing written | 0 | 0xAA |
| 4 | `x3 = 0xDD` | 0 | 0xDD |

Cycle 3 reads `RD1 = reg[3] = 0xAA` (the old value, since the write in cycle 4 has not happened yet). **Final answer: `x0 = 0` throughout; `x3 = 0xAA, 0xAA, 0xAA, 0xDD`; cycle 3 reads `0xAA`.**

**A3.** Little-endian puts the least significant byte first. `0x0BADF00D` has bytes `0B`, `AD`, `F0`, `0D` from most to least significant. So `0x40 = 0x0D`, `0x41 = 0xF0`, `0x42 = 0xAD`, `0x43 = 0x0B`. `lb` at `0x43` reads `0x0B` = `0000 1011`; the top bit is 0, so it is positive and `x` = `0x0000000B` = 11. **Final answer: `0D F0 AD 0B`; `lb` returns 11 (`0x0000000B`).**

**A4.** (a) `128 KB = 131072 = 2^17`, so 17 address bits. (b) `32 KB = 32768 = 2^15`, so 15 bits per chip. (c) `2^17 / 2^15 = 4` chips, selected by `A16, A15`, so 2 chip-select bits. (d) chip 0: `0x0000`-`0x7FFF`; chip 1: `0x8000`-`0xFFFF`; chip 2: `0x10000`-`0x17FFF`. **Final answer: 17 bits, 15 bits, 4 chips / 2 select bits, chip 2 = `0x10000`-`0x17FFF`.**

**A5.** (a) miss rate `= 0.04`, `AMAT = 1.5 + 0.04 x 70 = 1.5 + 2.8 = 4.3 ns`. (b) `5,000,000 x 4.3 ns = 21,500,000 ns = 21.5 ms`. (c) to halve `AMAT` to `2.15 ns`: `1.5 + miss x 70 = 2.15` -> `miss x 70 = 0.65` -> `miss = 0.00929`, so hit rate `= 1 - 0.00929 = 0.9907`, i.e. about **99.1%**. **Final answer: 4.3 ns, 21.5 ms, about 99.1% hit rate.**

**A6.** (a) the `lw` path is longest because it visits both memories: `3 + 1 + 2 + 3 + 1 = 10 ns`, so `f = 1/10e-9 = 100 MHz`. (b) memory = instruction memory `3 ns` + data memory `3 ns` = `6 ns` of `10 ns` = `60%`. (c) at 3 GHz one cycle is `0.333 ns`, so `10 / 0.333 = 30` cycles. **Final answer: 10 ns / 100 MHz, 60%, about 30 cycles of a 3 GHz machine.**
