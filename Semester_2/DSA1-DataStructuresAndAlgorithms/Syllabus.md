# DSA-1 – Detailed Syllabus

## Overview

| Module | Title | Maps to |
|--------|-------|---------|
| M1 | Complexity & Algorithmic Thinking | CO1 |
| M2 | Recursion & Recursive Thinking | CO2 |
| M3 | Arrays, Strings & the Core Patterns | CO3 |
| M4 | Searching & Binary Search | CO4 |
| M5 | Sorting (and a First Taste of Divide & Conquer) | CO5 |
| M6 | Linked Lists, Stacks & Queues (+ Their Patterns) | CO6 |

---

## Module 1 – Complexity & Algorithmic Thinking
**Maps to:** CO1

**The north star (Outside-In framing):**
- Solving real problems efficiently
- The running **problem-solving-engine project** and **pattern playbook**

### 1.1 What an algorithm is
- What an algorithm is
- What makes one algorithm better than another: **correctness** and **efficiency**

### 1.2 Measuring running time
- Counting operations
- The idea of growth with input size

### 1.3 Asymptotic notation
- **Big-O** notation
- A note on **Big-Omega** and **Big-Theta**
- Dropping constants and lower-order terms

### 1.4 The common complexity classes
- O(1)
- O(log n)
- O(n)
- O(n log n)
- O(n²)
- O(2ⁿ)
- What each class *feels like*

### 1.5 Space complexity
- Measuring memory
- The time-space tradeoff

### 1.6 Best, average and worst case
- Best case, average case, worst case
- Why we usually care about the worst case

### 1.7 The cost mindset (the core habit)
- Start with a **brute-force** solution
- **Analyse** it
- Then **optimise**
- The method used throughout the spine

### 1.8 Estimating feasibility
- Given input limits, what complexity is acceptable
- The interview/contest reasoning

### 1.9 Analysing simple code
- Loops
- Nested loops
- Basic recursion
- A bridge to Module 2

---

## Module 2 – Recursion & Recursive Thinking
**Maps to:** CO2

### 2.1 Why recursion early
- It is the seed of **divide & conquer**, **backtracking** and **dynamic programming**
- These are the powerful paradigms of DSA-3
- So the whole spine builds on it

### 2.2 What recursion is
- A function defined in terms of itself
- The **base case**
- The **recursive case**

### 2.3 The call stack
- How recursion executes
- The cost in stack space

### 2.4 Designing a recursive solution
- Identify the smaller sub-problem
- Combine

### 2.5 Classic recursion
- Factorial
- Fibonacci
- Power
- Sum / printing
- Analysing their complexity

### 2.6 Recursion on structures
- Arrays / strings (e.g., reverse, palindrome)
- Recursion as a way to traverse

### 2.7 Generating possibilities (a first taste of backtracking)
- Subsets
- Permutations
- The seed of module-by-module growth toward DSA-3

### 2.8 Recursion vs iteration
- When each is clearer or cheaper
- Converting between them

### 2.9 The danger of naive recursion
- Recomputation (e.g., naive Fibonacci)
- The hint of **memoisation / DP** to come (forward link to DSA-3)

### 2.10 Recursive thinking as a habit
- The mental move that unlocks the hardest problems later

---

## Module 3 – Arrays, Strings & the Core Patterns
**Maps to:** CO3

### 3.1 Arrays and strings as the workhorse data
- Storage
- Indexing
- The cost of operations: insert / delete / search

### 3.2 Dynamic arrays
- How they grow (amortised cost)
- The array behind most languages' lists

### 3.3 The brute-force baseline
- Solving array/string problems the obvious (slow) way
- Analysing it
- The starting point to optimise

### 3.4 The two-pointer pattern
- Opposite-ends pointers
- Same-direction pointers
- Examples: pair-sum in a sorted array, reversing, partitioning
- Turning O(n²) into O(n)

### 3.5 The sliding-window pattern
- Fixed windows
- Variable windows
- Examples: max/min subarray, longest substring with a property
- The pattern for contiguous-range problems

### 3.6 The prefix-sum pattern
- Precomputing cumulative sums for O(1) range queries
- Difference arrays
- Trading space for time

### 3.7 Recognising which pattern a problem needs
- The signals: **sorted?** **contiguous?** **range query?**
- These point to two-pointers vs sliding window vs prefix sums

### 3.8 Combining patterns
- Using a hash map for counting / lookups within the patterns
- A forward link to hashing in DSA-2

### 3.9 String-specific problems
- Searching
- Matching
- Transformation
- All using the patterns above

### 3.10 Complexity of the patterns
- Why the patterns win
- The thought process made rigorous

---

## Module 4 – Searching & Binary Search
**Maps to:** CO4

### 4.1 The searching problem
- Linear search
- Its O(n) cost
- The baseline

### 4.2 Binary search on a sorted array
- The algorithm
- Its O(log n) cost
- Why sorting enables it

### 4.3 Getting binary search right
- Boundary / invariant reasoning that makes it correct
- The classic source of bugs

### 4.4 Variants
- First / last occurrence
- Lower / upper bound
- Search in a rotated array

### 4.5 Binary-search-on-the-answer (the powerful pattern)
- When the answer is **monotonic**, binary-search the answer space
- Examples: minimum capacity / speed / size that works
- A technique that surprises with how widely it applies

### 4.6 Recognising binary-search-on-the-answer problems
- The monotonic-feasibility signal

### 4.7 Searching in 2-D / structured data
- Introduction

### 4.8 Comparing search strategies
- Choosing by the data and the query

### 4.9 Complexity of searching
- The role of pre-sorting
- A link to Module 5

### 4.10 Search patterns as interview staples
- The thought process behind them

---

## Module 5 – Sorting (and a First Taste of Divide & Conquer)
**Maps to:** CO5

### 5.1 Why sorting matters
- It enables binary search
- It enables the two-pointer pattern
- It enables grouping and much more
- The connective tissue of the course

### 5.2 Elementary sorts
- Bubble sort
- Selection sort
- Insertion sort
- How they work and their O(n²) cost
- When insertion sort is actually good

### 5.3 Mergesort
- The divide-and-conquer idea: split, sort halves, merge
- Guaranteed O(n log n)
- Stability

### 5.4 Quicksort
- Partitioning
- Divide and conquer
- Average O(n log n) and the worst case
- Pivot choice

### 5.5 Mergesort / quicksort as a FIRST TASTE of divide and conquer
- The recursion of Module 2 applied to a paradigm
- An explicit forward link to DSA-3

### 5.6 The O(n log n) lower bound for comparison sorting (awareness)
- Why we cannot do better by comparisons alone

### 5.7 Non-comparison sorts (awareness)
- Counting sort
- Radix sort
- When linear-time sorting is possible

### 5.8 Stability and in-place sorting
- Choosing a sort for a situation

### 5.9 Library sort vs implementing one
- Using a library sort
- Implementing one
- Why understanding it still matters

### 5.10 Sorting as the enabler of other patterns
- Applied in the project engine

---

## Module 6 – Linked Lists, Stacks & Queues (+ Their Patterns)
**Maps to:** CO6

### 6.1 Linked lists
- Singly, doubly and circular
- Insertion / deletion
- The trade-off vs arrays: O(1) insert vs no random access

### 6.2 Linked-list patterns
- The two-pointer / fast-slow technique
- Cycle detection
- Finding the middle
- n-th from end
- Recursion / pointers in action

### 6.3 Stacks
- The LIFO structure
- Array and linked implementations
- Applications: undo, call stack, expression evaluation, balanced parentheses

### 6.4 The monotonic-stack pattern
- Next-greater / next-smaller problems
- Histogram-style problems
- Solving them elegantly
- A high-value interview pattern

### 6.5 Queues
- The FIFO structure
- Circular queue
- Applications: scheduling, buffering, BFS
- A forward link to DSA-2 graphs

### 6.6 The deque and the monotonic-deque pattern
- The deque (double-ended queue)
- Sliding-window maximum in O(n)
- Tying back to Module 3

### 6.7 Choosing the right linear structure
- Matching the operations a problem needs to the structure

### 6.8 Putting it together
- The linear structures and patterns in the project engine

### 6.9 The synthesis
- The cost mindset, recursion and the patterns as one toolkit

### 6.10 The bridge to DSA-2
- For the seven continuing branches
- An honest, complete close for ME and CE
- What comes next (non-linear structures) and why

---
