# DDCA – Detailed Syllabus
*(Digital Design & Computer Architecture)*

## Overview

| Module | Title | Theme | Milestone |
|--------|-------|-------|-----------|
| M1 | The Big Picture & the Language of the Machine | What's inside a computer, bits & logic gates | North star set; tools ready |
| M2 | Making Decisions & Doing Maths | Combinational logic & the ALU | Working ALU in the simulator |
| M3 | Remembering & Keeping Time | Sequential logic | Register, program-counter-style counter, small FSM |
| M4 | Where the Machine Keeps Things | Registers, memory & the register file | Register file + instruction/data memory |
| M5 | The RISC-V Processor | Instruction set, datapath & control | Datapath assembled; one instruction traced end-to-end |
| M6 | Build It, Extend It & Look Ahead | Your RISC-V CPU, extensions, performance & modern architecture | Complete, extended single-cycle RISC-V CPU |

---

## Module 1 – The Big Picture & the Language of the Machine
**Subtitle:** What's Inside a Computer, Bits & Logic Gates – the north star + foundations

### 1.1 The north star (Outside-In hook)
- On day one, run a **complete working RISC-V CPU** executing a real program in a simulator
- The machine you will **build and extend** by the end
- We keep returning to it

### 1.2 What is a computer, at the highest level
- Input – process – store – output
- The CPU as the "brain"
- Hardware vs software (intuitive, no jargon yet)

### 1.3 Why digital
- Representing everything with two states (0 and 1)
- The digital abstraction and why it is reliable (**noise immunity**)
- Gently introduced

### 1.4 Number systems for first-years
- Binary and hexadecimal
- Converting to/from decimal
- Why hex is a convenient shorthand for binary

### 1.5 Representing numbers the machine uses
- Unsigned integers
- **Two's complement** (the standard for signed numbers)
- Binary addition / subtraction
- What "overflow" means
- With worked examples

### 1.6 Logic gates – the machine's alphabet
- AND, OR, NOT, NAND, NOR, XOR, XNOR
- Truth tables
- What each gate does
- Hands-on in simulation

### 1.7 Boolean basics
- Variables and the AND / OR / NOT operations
- A few key laws
- Building on the logic from *Mathematics for Computation (T01)*
- Just enough to design simple circuits

### 1.8 From a truth table to a circuit
- Expressing a desired behaviour as a **Boolean expression (sum-of-products)**
- Expressing it as **gates**
- The core design move, with examples

### 1.9 NAND universality (the "aha")
- Any logic can be built from one gate type
- So the whole machine is built from a tiny set of primitives

### 1.10 Tooling & workflow orientation (gentle)
- The visual logic simulator (**Logisim / Digital**)
- The RISC-V visualiser (**Ripes**)
- Starting a **Git repository**
- The habits we use all course

---

## Module 2 – Making Decisions & Doing Maths
**Subtitle:** Combinational Logic & the ALU – the first real piece of the CPU

**Connecting to the north star:** The part of the CPU that adds, subtracts and compares is built from combinational logic – we build it now.

### 2.1 Combinational logic
- Circuits whose output depends **only on the current inputs** (no memory)
- The defining idea

### 2.2 Simplifying logic with Karnaugh maps (K-maps)
- Fewer gates means faster, cheaper, lower-power hardware
- Taught with simple, worked examples

### 2.3 Arithmetic circuits
- The **half adder** and **full adder**
- Chaining them into a **ripple-carry adder**
- The idea of carry
- Why wide adders are slower

### 2.4 Subtraction with two's complement
- Turning an adder into an **adder/subtractor** with a control input
- Links back to Module 1

### 2.5 Data-routing blocks
- The **multiplexer** (a data selector)
- The **decoder**
- Small, intuitive, and used everywhere in the CPU

### 2.6 Comparators and other standard blocks (overview)
- Testing equality and ordering
- Needed for branches later

### 2.7 Building a simple ALU
- Combining add, subtract, AND, OR and a "set-less-than" compare into one block
- With an operation-select input
- The CPU's calculator

### 2.8 Designing a combinational circuit from a specification
- The disciplined flow from "what it must do" to a working, simulated circuit

### Milestone
- A **working ALU in the simulator**
- The first major sub-system of the RISC-V CPU, built and tested

---

## Module 3 – Remembering & Keeping Time
**Subtitle:** Sequential Logic – giving the machine memory

**Connecting to the north star:** A CPU must remember values and step through instructions one clock at a time. This needs memory in the hardware, which combinational logic alone cannot provide.

### 3.1 The need for state and feedback
- Why some circuits must "hold" a value

### 3.2 Latches and flip-flops
- The **SR latch**
- The **D latch**
- The **D flip-flop**
- The difference between **level-sensitive** and **edge-triggered** behaviour
- Kept concrete and simulated

### 3.3 The clock and synchronous design
- Why a clock signal and edge-triggering make complex digital systems reliable
- A gentle, intuitive note on **setup / hold time**

### 3.4 Registers
- A row of flip-flops that stores a multi-bit value
- The basic storage element of a CPU

### 3.5 Shift registers (brief)
- Shifting bits
- Where this is useful

### 3.6 Counters
- Synchronous counters
- The **program-counter pattern** (the register that tracks "which instruction is next" in the CPU)
- A direct link to the north star

### 3.7 Finite State Machines (FSMs)
- Describing step-by-step behaviour with states and transitions
- State diagram and state table
- The technique behind a **control unit**

### 3.8 Designing a small FSM from a specification
- Example: a simple controller
- Implementing it with flip-flops and logic

### Milestone
- A working **register**, a **program-counter-style counter**, and a **small FSM** in the simulator
- The CPU's memory-and-stepping fabric

---

## Module 4 – Where the Machine Keeps Things
**Subtitle:** Registers, Memory & the Register File – the CPU's storage

**Connecting to the north star:** The CPU needs a small set of fast working registers and a larger memory for its program and data – we build that storage now.

### 4.1 Memory as addressable storage
- The idea of an **address** and the data stored at it
- Kept intuitive

### 4.2 The register file
- The CPU's small, fast set of registers
- **Reading two and writing one per clock** – exactly what the datapath needs
- Built from the registers of Module 3

### 4.3 Random Access Memory (RAM)
- Read/write memory
- A simple, simulated RAM block
- Cell internals / CMOS belong to *CMOS VLSI (T04)*

### 4.4 Read-Only Memory (ROM)
- Holding the program and constants
- Where our CPU's instructions live

### 4.5 Memory organisation
- Words
- Addresses
- How memory is laid out and accessed

### 4.6 Connecting memory to the rest of the machine
- How instructions are **fetched**
- How data is **loaded / stored**

### 4.7 The memory hierarchy and WHY it exists (foundational)
- The speed-vs-size-vs-cost trade-off
- Registers, cache, main memory, storage
- The idea of **locality**
- Cache depth is covered later

### 4.8 The von Neumann bottleneck (awareness)
- Why memory access often limits speed
- A motivation for later architecture

### Milestone
- A working **register file** and **instruction/data memory** in the simulator
- The storage the RISC-V CPU will use

---

## Module 5 – The RISC-V Processor
**Subtitle:** Instruction Set, Datapath & Control – Assembling the Machine – putting the parts together into the CPU

**Closing in on the north star:** Now that we have an ALU, registers, memory and an FSM, we assemble them into the processor we saw on day one.

### 5.1 The stored-program idea
- Instructions and data live in memory
- The CPU fetches and executes them one by one

### 5.2 Instruction Set Architecture (ISA)
- The "contract" between hardware and software
- Why **RISC-V**: open, clean, modern
- Central to industry, India's microprocessor mission and research

### 5.3 A BOUNDED RISC-V subset for first-years (about ten instructions)
- Arithmetic / logic: `add`, `sub`, `and`, `or`, `slt`
- An immediate: `addi`
- Memory: `lw`, `sw`
- A branch: `beq`
- A jump: `jal`
- Enough to write real little programs and to build a CPU, without overwhelm

### 5.4 Registers and instruction formats
- The RISC-V register set
- The fields of an instruction: **opcode**, **registers**, **immediate**
- Read with worked examples

### 5.5 RISC-V assembly (foundational)
- Reading and writing short programs
- How a simple high-level idea (a loop, an if) becomes instructions
- Links to the Java course
- Run them in **Ripes**

### 5.6 The fetch-decode-execute cycle
- The loop every processor runs
- Traced step by step

### 5.7 The single-cycle datapath
- How the **program counter, instruction memory, register file, ALU and data memory** connect to execute an instruction
- Using the blocks built in Modules 2–4
- On a provided datapath skeleton

### 5.8 The control unit
- How control signals are produced (a decoder / FSM)
- Steering the datapath for each instruction type

### Milestone
- The **datapath assembled** and **one instruction traced end-to-end**
- The machine is nearly whole

---

## Module 6 – Build It, Extend It & Look Ahead
**Subtitle:** Your RISC-V CPU, Adding to It, Performance & Modern Architecture – the capstone: build & extend

**Reaching the north star:** Complete the single-cycle RISC-V CPU (datapath + control) so it runs the program from day one – the machine is now yours.

### 6.1 Running a program
- How a small program executes instruction by instruction on the built CPU
- Verifying the result
- Debugging by tracing signals

### 6.2 BUILD ADDITIONAL DESIGNS WITH RISC-V (the heart of this course's goal)
- Extending the CPU by adding a **NEW instruction** (e.g., XOR or a custom operation)
- What changes in the **ALU** and the **control unit**
- Step by step on a template

### 6.3 Extending the CPU with the outside world
- Adding a simple **memory-mapped output peripheral**
- Drive LEDs / a display in the simulator
- So the CPU can affect something
- The seed of all embedded design

### 6.4 A stretch extension (optional)
- A new branch/condition, or a simple input
- Reinforcing that the architecture is yours to modify

### 6.5 Performance basics (gentle)
- Clock period
- Cycles per instruction (**CPI**)
- What makes a processor faster

### 6.6 Why single-cycle is limited, and the idea of pipelining (awareness)
- Overlapping instructions like an assembly line
- Depth in advanced architecture

### 6.7 Caching and parallelism (awareness)
- The memory hierarchy revisited
- The broad idea of doing more at once
- The direction of modern computing

### 6.8 From your CPU to the real world and the forward map
- How this foundation scales to embedded/IoT microcontrollers, VLSI chips and edge-AI accelerators
- How **Embedded System Design & IoT**, **CMOS VLSI**, **Embedded AI / TinyML** and **Edge-AI / NPU** build on exactly this

### 6.9 Reflection
- A computer is no longer magic – you built one and extended it
- You have the strong base for everything that follows

---