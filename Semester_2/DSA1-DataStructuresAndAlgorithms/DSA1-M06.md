# DSA-1 – Module 6
## Linked Lists, Stacks & Queues (+ Their Patterns)
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

So far every structure you have met is a *block*: an array is one continuous strip of memory, and `a[i]` jumps to a slot by arithmetic. That is wonderful for reading and terrible for rearranging, because inserting in the middle forces everything to shift.

This module is about the other family: **linked structures**, where each item carries a pointer to the next one and nothing sits in a fixed place. Add to that two *disciplines* for how items may be added and removed — **LIFO** (last in, first out) and **FIFO** (first in, first out) — and you have the three workhorses of everyday programming: linked lists, stacks and queues.

One analogy for the whole module. An array is a row of numbered cinema seats: you walk straight to seat 42. A linked list is a treasure hunt: each clue tells you where the next one is, so finding clue 42 means following 42 clues — but *inserting* a new clue in the middle is one scribble, you just redirect one arrow.

Then the real payoff: the *patterns*. A slow and a fast pointer detect a cycle in a list. A stack solves bracket matching and next-greater-element in one pass. A deque gives sliding-window maximum in `O(n)` instead of `O(n . k)`. These patterns are what interviews actually ask. Where you will use all of this: undo in an editor (stack), the back button (stack), a printer queue or a task scheduler (queue), bracket checking in a compiler (stack), breadth-first search over a graph (queue — that is DSA-2), and every "next greater element" style question (monotonic stack).

## Basics you must know first

- **Object references and `null`.** A class-type variable holds a *reference* to an object, or `null` for "no object here". `a.next` follows the reference, and walking a list means looping while `cur != null`. This is the one idea the whole module stands on.
- **Big-O and amortised cost (Module 1).** `O(1)` means constant work; array append is `O(1)` *amortised* because of occasional doubling.
- **Arrays and indexing (Module 3).** `a[i]` is `O(1)`; insert/delete in the middle is `O(n)` because of shifting.
- **The two-pointer pattern (Module 3).** Two indices moving at different speeds — it reappears here as two *node* pointers. In Java, `java.util.ArrayDeque` is the standard stack/queue/deque class; prefer it over the old `Stack`, which is synchronised and slower.

## 6.1 Linked lists — singly, doubly, circular

### Intuition

A singly linked list is a chain of small boxes. Each box holds a value and an arrow to the next box. The last box's arrow points at `null` — nothing. You keep one variable, `head`, pointing at the first box.

```text
head
  |
  v
+------+------+     +------+------+     +------+------+
|  10  |  o---|---->|  20  |  o---|---->|  30  | null |

+------+------+     +------+------+     +------+------+
  node 1              node 2              node 3
```

The arrows *are* the structure. There is no "index 2" — to reach node 3 you must pass through node 1 and node 2. That single fact explains every trade-off in this section.

### The idea, step by step

**Step 1 — The node.** Two fields: the value `int val`, and a reference `ListNode next` to the next node (`null` by default). The full class appears in the program below.

**Step 2 — Insert at the head: `O(1)`.** Make the new node point at the old head, then move `head` to the new node.

**Step 3 — Insert after a known node, and delete a known node: `O(1)` each.** Insert with `node.next = target.next; target.next = node;` — order matters, because overwriting `target.next` first loses the rest of the list. Delete with `prev.next = target.next;`, after which the target is unreachable and the garbage collector frees it.

**Step 4 — Search, or insert at position `k`: `O(n)`.** You must walk from the head, because there is no arithmetic shortcut. Inserting at position `k` costs `O(k)` to *find* the spot even though the splice itself is `O(1)`.

**Step 5 — The three flavours.**

| Flavour | Each node stores | Extra ability | Typical use |
|---|---|---|---|
| Singly linked | `val`, `next` | forward walk only | simple stacks, queues, most interview questions |
| Doubly linked | `val`, `next`, `prev` | walk backwards, delete a node given only that node | LRU cache, browser history, text editors |
| Circular | `val`, `next`, last points back to first | loop forever without null checks | round-robin scheduling, circular buffers |

```text
doubly:    null <-[prev|10|next]<->[prev|20|next]<->[prev|30|next]-> null
circular:  [10]->[20]->[30]      (30's next points back to 10)
```

**Step 6 — The trade-off against arrays.**

| Operation | Array | Singly linked list |
|---|---|---|
| Access `i`-th element | `O(1)` | `O(n)` — walk from head |
| Insert/delete at front | `O(n)` — shift everything | `O(1)` |
| Insert/delete at a *known* node | `O(n)` — shift | `O(1)` |
| Memory per element | 4 bytes for an `int` | 4 bytes + a reference (~8–16 bytes) |
| Cache friendliness | excellent, contiguous | poor, nodes scattered |

That last row matters in practice: a linked list is often *slower* than an array even when Big-O says otherwise, because the CPU fetches memory in blocks and scattered nodes mean cache misses. This is why Java's `ArrayList` beats `LinkedList` for almost everything.

Full Java for building, printing and deleting:

```java
public class LinkedListBasics {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode insertAtHead(ListNode head, int val) {
        ListNode node = new ListNode(val);
        node.next = head;
        return node;
    }
    static ListNode delete(ListNode head, int val) {   // delete the first node holding val
        if (head == null) return null;                 // empty list, nothing to do
        if (head.val == val) return head.next;         // deleting the head: just move head
        ListNode prev = head, cur = head.next;
        while (cur != null) {
            if (cur.val == val) { prev.next = cur.next; return head; }  // unlink it
            prev = cur; cur = cur.next;
        }
        return head;                                   // not found: list unchanged
    }
    static void print(ListNode head) {
        for (ListNode cur = head; cur != null; cur = cur.next) System.out.print(cur.val + " -> ");
        System.out.println("null");
    }
    public static void main(String[] args) {
        ListNode head = null;
        head = insertAtHead(head, 10);
        head = insertAtHead(head, 20);
        head = insertAtHead(head, 30);
        print(head);                  // 30 -> 20 -> 10 -> null
        print(delete(head, 20));      // 30 -> 10 -> null
    }
}
```

What it prints: `30 -> 20 -> 10 -> null` then `30 -> 10 -> null`. Reason: each insert puts the new value at the front, so the last inserted (30) comes first; deleting 20 links 30 straight to 10.

**Example question:** Start with an empty singly linked list. Insert `10`, then `20`, then `30` at the head, then delete the node holding `20`. Draw the list after each operation and state the cost of each step.

**Solution:**

Step 1: Empty list, `head = null`. Insert `10`: `node.next = null`, `head` becomes that node — list `10 -> null`, cost `O(1)`.
Step 2: Insert `20`: its `next` points at `10`, `head` moves to it — list `20 -> 10 -> null`, cost `O(1)`. Insert `30` the same way — list `30 -> 20 -> 10 -> null`, cost `O(1)`, because a head insert never touches the rest of the list.
Step 3: Delete `20`: `head` holds `30`, so the loop starts with `prev = 30`, `cur = 20`; `cur.val == 20`, so `prev.next = cur.next` gives `30.next = 10`. List: `30 -> 10 -> null`, cost `O(1)` because the loop ran once. Total for all four operations: `O(1)`.

**Final answer:** final list `30 -> 10 -> null`; all three head-inserts and this particular delete are `O(1)`. Note that deleting a node found *only by value* is `O(n)` in general, because finding it is the expensive part.

⚠️ **Common trap:** deleting the head node without special-casing it — writing `prev.next = cur.next` when `prev` is `null` throws a `NullPointerException`. The other classic: in an insert-after, writing `target.next = node` before `node.next = target.next`, which makes the node point at itself and loses the tail.

## 6.2 Linked-list patterns — fast/slow pointers, cycles, middle, n-th from end, reverse

### Intuition

You cannot jump to position `i` in a list, so the only tool you have is *walking*. The patterns below are all clever ways of walking: two walkers at different speeds, or two walkers with a fixed gap between them.

- **Fast/slow (Floyd's) pointers:** one walker takes one step, the other takes two. On a straight road the fast one finishes first. On a circular road the fast one eventually laps the slow one — they meet. That meeting *is* the cycle detector.
- **Fixed gap:** to find the 3rd node from the end, send a scout 3 steps ahead, then move both together. When the scout falls off the end, you are exactly 3 from the end.

### The idea, step by step

**Step 1 — Finding the middle.** `slow` moves one node per iteration, `fast` moves two, so when `fast` reaches the end, `slow` has covered half the distance. Trace on `1 -> 2 -> 3 -> 4 -> 5`: `(slow 2, fast 3)`, `(3, 5)`, then `fast.next` is `null` — middle is `3`. On `1 -> 2 -> 3 -> 4 -> 5 -> 6` the loop stops with `slow = 4`, i.e. the **second** middle, which is the usual convention.

**Step 2 — Detecting a cycle.** Run the same two pointers. If `fast` becomes `null` (or `fast.next` does), the list ends — no cycle; if `slow == fast`, there is one. *Why they must meet:* once `slow` enters the loop, `fast` is already inside it and gains exactly one node per iteration (it moves 2, `slow` moves 1), so the gap shrinks by 1 each time until it hits 0. They cannot jump over each other, because the gap changes by exactly 1.

Trace on `1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 3` (node 6 points back at node 3):

| Iteration | `slow` | `fast` | Met? |
|---|---|---|---|
| 1 | 2 | 3 | no |
| 2 | 3 | 5 | no |
| 3 | 4 | 3 | no (fast wrapped around) |
| 4 | 5 | 5 | **yes** |

They meet at node `5`.

**Step 3 — Finding where the cycle starts.** Keep one pointer at the meeting point, move the other back to `head`, then advance both **one** step at a time. Where they meet is the first node of the cycle.

*Why this works (the arithmetic).* Let `a` = distance from head to the cycle's first node, `b` = distance from the cycle start to the meeting point, and `c` = the rest of the cycle (`L = b + c`). Then `slow` walked `a + b`. `fast` walked `a + b + kL` for some whole number of laps `k`. Since `fast` walks twice as far: `a + b = kL`, so `a = kL - b = (k-1)L + c`. Reading that: `a` steps from the head and `c` steps from the meeting point land on the same node — the cycle start. Applying it to the trace: `slow` at `5`, `fast` reset to `1`; both move one at a time and meet at `3`.

**Step 4 — n-th node from the end.** Advance `fast` by `n` steps first, then move `fast` and `slow` together until `fast` is `null`. `slow` is then the n-th from the end, because the gap between them is always exactly `n`.

Trace on `1 -> 2 -> 3 -> 4 -> 5` with `n = 2`: `fast` moves to `3`; then `(slow 1, fast 3)`, `(2, 4)`, `(3, 5)`, and `fast` becomes `null`. `slow` is at `4` — the 2nd from the end.

**Step 5 — Reversing a list.** Walk the list with three pointers: `prev` (starts `null`), `cur` (starts `head`), and `next` (temporary). Each step: save `next`, flip `cur.next` to point backwards at `prev`, then advance `prev` and `cur`. At the end, `prev` is the new head.

| Step | `cur` | `next` saved | `cur.next` becomes | List so far (new head first) |
|---|---|---|---|---|
| 1 | 1 | 2 | `null` | `1` |
| 2 | 2 | 3 | 1 | `2 -> 1` |
| 3 | 3 | 4 | 2 | `3 -> 2 -> 1` |
| 4 | 4 | 5 | 3 | `4 -> 3 -> 2 -> 1` |
| 5 | 5 | `null` | 4 | `5 -> 4 -> 3 -> 2 -> 1` |

Java for the two most-asked patterns:

```java
public class ListPatterns {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    // Returns the first node of the cycle, or null if there is no cycle.
    static ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;            // one step
            fast = fast.next.next;       // two steps
            if (slow == fast) {          // they met inside the loop
                ListNode p = head;
                while (p != slow) {      // walk in from the head, one step each
                    p = p.next;
                    slow = slow.next;
                }
                return p;                // first node of the cycle
            }
        }
        return null;                     // fast fell off the end: no cycle
    }

    // Reverses the list in place and returns the new head.
    static ListNode reverse(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;    // 1. remember where we were going
            cur.next = prev;             // 2. flip this arrow backwards
            prev = cur;                  // 3. prev catches up
            cur = next;                  // 4. move on
        }
        return prev;                     // prev is the old tail = new head
    }
}
```

Dry run of `reverse` on `1 -> 2 -> 3 -> 4 -> 5` gives `5 -> 4 -> 3 -> 2 -> 1`, exactly the table above. Cost: `O(n)` time (each node visited once), `O(1)` extra space (three pointers). A recursive version is also possible but costs `O(n)` stack space.

**Example question:** A linked list is `1 -> 2 -> 3 -> 4 -> 5 -> 6` and node `6` points back to node `3`. Using Floyd's algorithm, show where the pointers meet, and then show how the first node of the cycle is found. State the total cost.

**Solution:**

Step 1: `slow = fast = 1`. Reason: both start at the head.
Step 2: Iteration 1: `slow` moves to `2`, `fast` moves `1 -> 2 -> 3`, so `fast = 3`. Not equal. Reason: `fast` takes two arrows per iteration.
Step 3: Iteration 2: `slow = 3`, `fast = 3 -> 4 -> 5 = 5`. Not equal. Iteration 3: `slow = 4`, `fast = 5 -> 6 -> 3 = 3` — not equal, `fast` has wrapped around.
Step 4: Iteration 4: `slow = 5`, `fast = 3 -> 4 -> 5 = 5`. Equal — **they meet at node 5**, because inside the cycle the gap shrinks by exactly 1 per iteration.
Step 5: To find the cycle start, keep one pointer at `5` and move the other to `head` (node `1`), then advance both one step at a time: `(2, 6)`, `(3, 3)` — they meet at node `3`, because `a` (head to cycle start) and `c` (meeting point to cycle start) reach it in the same number of steps. Cost: `O(n)` time (`slow` walks at most `n`, `fast` at most `2n`) and `O(1)` space (three pointers).

**Final answer:** they meet at node **5**; the cycle begins at node **3**; total `O(n)` time and `O(1)` space.

⚠️ **Common trap:** writing `while (fast != null && slow != null)` and then calling `fast.next.next`. If `fast.next` is `null` you get a `NullPointerException` — the loop condition must check **both** `fast != null` and `fast.next != null`. Second trap: after detecting the meeting, moving *both* pointers two steps to find the cycle start — that gives the wrong node.

## 6.3 Stacks — LIFO

### Intuition

A stack is a pile of plates. You add to the top and take from the top — the last plate placed is the first one lifted. That is **LIFO**: last in, first out.

Real-life pictures: the undo history in an editor (the most recent change is undone first), the browser back button, and the **call stack** — when a function calls another, the caller's state goes on top and is restored when the callee returns. That is why recursion costs stack space (Module 2).

### The idea, step by step

**Step 1 — The four operations.** `push(x)` puts `x` on top, `pop()` removes and returns the top, `peek()` (or `top()`) returns it without removing, `isEmpty()` tells you whether anything is there. All are `O(1)`.

**Step 2 — Array implementation.** Keep an `int[] data` and an index `top` starting at `-1`. `push` does `data[++top] = x`; `pop` does `return data[top--]`. Overflow when `top == capacity - 1`. This is the fastest version — contiguous memory, no allocation per push.

**Step 3 — Linked implementation.** Push = insert at head (`O(1)`); pop = remove the head (`O(1)`). No fixed capacity, but every push allocates a node. A stack is the one structure where a singly linked list is genuinely natural.

**Step 4 — Balanced parentheses.** Scan the string. Every opening bracket goes on the stack. Every closing bracket must match the bracket on top — if it does not, or the stack is empty, the string is invalid. At the end the stack must be empty, otherwise some opening bracket was never closed.

Trace on `{[()]}`: push `{`, push `[`, push `(`; then `)` matches `(` → pop; `]` matches `[` → pop; `}` matches `{` → pop. Stack empty at the end → **balanced**. On `{[(])}`: push `{`, `[`, `(`; `]` is read but the top is `(` → **mismatch, invalid**. On `(()(`: two pairs close, then `(` is left over at the end → **invalid**.

**Step 5 — Expression evaluation.** Machines do not do precedence; they want postfix (also called Reverse Polish Notation), where the operator comes *after* its two operands: `5 3 +` instead of `5 + 3`. Two rules make everything work:

- **Infix → postfix:** operands go straight to the output; `(` is pushed; `)` pops until `(`; an operator pops everything of higher or equal precedence first, then is pushed.
- **Evaluate postfix:** push operands; when an operator appears, pop two values `b` then `a`, compute `a op b`, push the result. Note the order — the first popped is the *right* operand.

**Example question:** Evaluate the postfix expression `5 3 + 8 2 - *` using a stack. Show the stack after every token, and give the final value.

**Solution:**

Step 1: Token `5` is an operand → push. Stack `[5]`; operands wait for an operator. Token `3` → push. Stack `[5, 3]`.
Step 2: Token `+` → pop `b = 3`, pop `a = 5`, compute `5 + 3 = 8`, push `8`. Stack `[8]`.
Step 3: Token `8` → push. Stack `[8, 8]`. Token `2` → push. Stack `[8, 8, 2]`.
Step 4: Token `-` → pop `b = 2`, pop `a = 8`, compute `8 - 2 = 6`, push `6`. Stack `[8, 6]`. Order matters — it is `a - b`, not `b - a`.
Step 5: Token `*` → pop `b = 6`, pop `a = 8`, compute `8 * 6 = 48`, push `48`. Stack `[48]`; input is finished, and a well-formed postfix expression leaves exactly one value — the answer.

**Final answer:** `48`. Cost: `O(n)` time for `n` tokens (each pushed and popped once) and `O(n)` space in the worst case.

Java for balanced brackets:

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class BalancedBrackets {
    static boolean isBalanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);                       // remember the opener
            } else if (c == ')' || c == ']' || c == '}') {
                if (stack.isEmpty()) return false;   // closer with nothing to close
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) return false;   // wrong type of closer
            }
            // any other character is ignored
        }
        return stack.isEmpty();                      // leftover openers mean unbalanced
    }

    public static void main(String[] args) {
        System.out.println(isBalanced("{[()]}"));   // true
        System.out.println(isBalanced("{[(])}"));   // false
        System.out.println(isBalanced("(()(") + " " + isBalanced(")("));  // false false
    }
}
```

What it prints: `true`, then `false`, then `false false` (the last line prints two results) — matching the four traces above. Cost: `O(n)` time (one push/pop per bracket) and `O(n)` space (worst case, all openers).

⚠️ **Common trap:** checking only the *count* of brackets instead of matching types — `([)]` has equal counts but is invalid. Second trap: forgetting the final `return stack.isEmpty()`, which makes `(((` look balanced. Third: in postfix evaluation, computing `b op a` instead of `a op b` — right for `+` and `*`, wrong for `-` and `/`.

## 6.4 The monotonic-stack pattern

### Intuition

You are standing in a queue of people and want to know, for each person, the first taller person to their right. The naive way is to look right for each person — `O(n^2)`. The clever way: keep a stack of people who are *still waiting* for someone taller. When a new person arrives, they are the answer for everyone shorter than them on the stack — so pop those, and record the answer. The stack then stays **monotonic** (values decreasing from bottom to top), and everyone is pushed and popped at most once.

### The idea, step by step

**Step 1 — Next greater element (NGE).** Scan left to right with a stack of *indices* whose answer is not yet known. Before pushing index `i`, pop every index whose value is smaller than `a[i]` — `a[i]` is their next greater element. Then push `i`. Anything left on the stack at the end has no greater element to its right, so it stays `-1`.

Trace on `[4, 5, 2, 25]`:

| Step | `i` | `a[i]` | Stack before | Popped (their answer) | Stack after | `result` |
|---|---|---|---|---|---|---|
| 1 | 0 | 4 | `[]` | none | `[0]` | `[-1, -1, -1, -1]` |
| 2 | 1 | 5 | `[0]` | 0 → answer `5` | `[1]` | `[5, -1, -1, -1]` |
| 3 | 2 | 2 | `[1]` | none (5 > 2) | `[1, 2]` | `[5, -1, -1, -1]` |
| 4 | 3 | 25 | `[1, 2]` | 2 → `25`, then 1 → `25` | `[3]` | `[5, 25, 25, -1]` |

Result `[5, 25, 25, -1]`. Index 3 (`25`) never gets popped, so it keeps `-1`.

**Step 2 — Next smaller element (NSE).** Identical, with the comparison flipped: pop while the top's value is **greater** than `a[i]`. On `[4, 5, 2, 25]` the result is `[2, 2, -1, -1]`: for `4` the next smaller is `2`, for `5` it is `2`, and for `2` and `25` there is none.

**Step 3 — Largest rectangle in a histogram.** For each bar, the biggest rectangle using that bar's height extends left and right until it hits a shorter bar. So we need, for each bar, "how far left and right can I go before a shorter bar?" — which is exactly NSE on both sides. The monotonic stack gives both boundaries in one pass: when a bar is popped, the current index `i` is its right boundary and the new stack top is its left boundary.

Trace on heights `[2, 1, 5, 6, 2, 3]`, with a sentinel height `0` appended at index 6 to flush the stack:

| Step | `i` | height `cur` | Popped bar | Left boundary | Area = `h × (i - left - 1)` | Best |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 | height 2 (index 0) | -1 | `2 × 1 = 2` | 2 |
| 2 | 4 | 2 | height 6 (index 3) | 2 | `6 × 1 = 6` | 6 |
| 3 | 4 | 2 | height 5 (index 2) | 1 | `5 × 2 = 10` | 10 |
| 4 | 6 | 0 | height 3 (index 5), then 2 (index 4), then 1 (index 1) | 4, 1, -1 | `3×1 = 3`, `2×4 = 8`, `1×6 = 6` | 10 |

Best is **10**, from bars 5 and 6 (indices 2 and 3) which both reach height 5 over a width of 2.

**Step 4 — Why it is `O(n)`.** Each index is pushed exactly once and popped at most once. The inner `while` looks expensive, but its total number of iterations across the whole scan cannot exceed `n`. So the work is at most `2n` pushes/pops — `O(n)`.

Java for next greater element:

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class NextGreater {
    static int[] nextGreater(int[] a) {
        int n = a.length;
        int[] res = new int[n];
        Arrays.fill(res, -1);                  // default: no greater element to the right
        Deque<Integer> stack = new ArrayDeque<>();   // holds indices, values decreasing
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && a[stack.peek()] < a[i]) {
                res[stack.pop()] = a[i];       // a[i] is the answer for that index
            }
            stack.push(i);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{4, 5, 2, 25})));   // [5, 25, 25, -1]
        System.out.println(Arrays.toString(nextGreater(new int[]{13, 7, 6, 12})));  // [-1, 12, 12, -1]
    }
}
```

What it prints: `[5, 25, 25, -1]` and `[-1, 12, 12, -1]`. Check the second one by hand: `13` has nothing bigger to its right, `7` and `6` are both beaten by `12`, and `12` is last. Correct.

### Formula / rule / table

| Problem | Stack order (bottom → top) | Pop condition |
|---|---|---|
| Next greater element | decreasing values | `a[top] < a[i]` |
| Next smaller element | increasing values | `a[top] > a[i]` |
| Largest rectangle | increasing heights | `h[top] > h[i]` |
| Stock span / daily temperatures | decreasing values | same as NGE, store the distance |

**Example question:** For `a = [4, 5, 2, 25]`, give the next greater element for every position using a monotonic stack, showing the stack contents. Why is the total cost `O(n)` rather than `O(n^2)`?

**Solution:**

Step 1: `i = 0`, `a[0] = 4`. Stack empty, nothing to pop; push `0` → `[0]`. Index 0 now waits for a bigger value.
Step 2: `i = 1`, `a[1] = 5`. Top `0` has `4 < 5`, so pop it and set `res[0] = 5`; stack empty, push `1` → `[1]`.
Step 3: `i = 2`, `a[2] = 2`. Top `1` has value `5`, and `5 < 2` is false, so no pop; push `2` → `[1, 2]`. Values now decrease from bottom to top — that is the "monotonic" part.
Step 4: `i = 3`, `a[3] = 25`. Top `2` has `2 < 25` → pop, `res[2] = 25`; new top `1` has `5 < 25` → pop, `res[1] = 25`; stack empty, push `3` → `[3]`. Index `3` is still on the stack at the end, so `res[3]` keeps `-1`.
Step 5: Cost `O(n)`: each index is pushed once and popped at most once, so the inner `while` cannot run more than `n` times in total.

**Final answer:** `[5, 25, 25, -1]`; `O(n)` time because every element enters and leaves the stack at most once, and `O(n)` space for the stack.

⚠️ **Common trap:** storing *values* on the stack instead of *indices*. With values you cannot write the answer back to the right position. Second trap: forgetting that leftover stack entries have no answer and must stay `-1`. Third: for the histogram, forgetting the sentinel `0` at the end, which leaves tall bars unprocessed and under-reports the area.

## 6.5 Queues — FIFO and the circular queue

### Intuition

A queue is a line at a ticket counter: the first person to arrive is the first served. That is **FIFO**: first in, first out. Adding happens at the **rear**, removing at the **front**.

Real-life pictures: a printer's job list, a CPU's ready queue, customers in a call centre, packets in a network buffer, and — importantly for DSA-2 — **breadth-first search**, which explores a graph level by level and needs a queue to remember "who is next at this distance".

### The idea, step by step

**Step 1 — The four operations.** `enqueue(x)` adds at the rear, `dequeue()` removes and returns the front, `peek()` reads the front, `isEmpty()`. All `O(1)`.

**Step 2 — The naive array queue and its problem.** Keep `front` and `rear` indices and grow `rear` on each enqueue. Dequeue just does `front++`. Two things go wrong: the array's front slots become dead space that can never be reused, and if you instead *shift* everything left after each dequeue, every dequeue costs `O(n)`.

**Step 3 — The circular queue fix.** Let the indices wrap around using modulo: `rear = (rear + 1) % capacity`. Now the dead slots at the front get reused, no shifting is ever needed, and every operation stays `O(1)`.

```text
capacity 5, after enqueue 10..50, dequeue 10,20, enqueue 60,70:

index:   0     1     2     3     4
        | 60  | 70  | 30  | 40  | 50  |
                    ^front        ^rear = 2 (wrapped via modulo)

reading order: 30, 40, 50, 60, 70   (front walks 2 -> 3 -> 4 -> 0 -> 1)
```

**Step 4 — Telling full from empty.** With only `front` and `rear`, "full" and "empty" look identical (both indices equal). Two standard fixes: keep a separate `size` counter, or keep one slot always empty and treat `(rear + 1) % capacity == front` as full. We use `size` — it is easier to get right.

**Step 5 — Applications.** Scheduling (round-robin: take the front job, run it, put it at the back), buffering (a printer or network holds work while the consumer is busy), and BFS: put the start node in the queue, then repeatedly dequeue a node and enqueue its unvisited neighbours. Because a queue is FIFO, nodes are visited in order of distance from the start — that is the forward link to graphs in DSA-2.

### Formula / rule / table

| Operation | Array queue (shifting) | Circular queue |
|---|---|---|
| Enqueue | `O(1)` | `O(1)` — `rear = (rear+1) % cap` |
| Dequeue | `O(n)` — shift everything | `O(1)` — `front = (front+1) % cap` |
| Space wasted | grows over time | none — slots are reused |

**Example question:** A circular queue of capacity 5 starts empty. Perform: enqueue `10, 20, 30, 40, 50`; dequeue twice; enqueue `60, 70`. Give the array contents, the `front` and `rear` indices, and the logical order of the elements.

**Solution:**

Step 1: `front = 0, rear = 0, size = 0`. Reason: both indices start at 0 and `size` distinguishes empty from full.
Step 2: enqueue `10` → `a[0]`, `rear = 1`, `size = 1`; then `20` → `a[1]`, `rear = 2`; `30` → `a[2]`, `rear = 3`; `40` → `a[3]`, `rear = 4`; `50` → `a[4]`, `rear = (4+1) % 5 = 0`, `size = 5`. Reason: the modulo wraps the rear to the start — that is what "circular" means.
Step 3: Now `size == capacity`, so the queue is full — a sixth enqueue would be rejected.
Step 4: dequeue → returns `a[0] = 10`, `front = 1`, `size = 4`. dequeue → returns `a[1] = 20`, `front = 2`, `size = 3`. Reason: removals always happen at `front`.
Step 5: enqueue `60` → `a[rear] = a[0] = 60` (the slot just freed!), `rear = 1`, `size = 4`; the wrap reuses dead space instead of wasting it. Then `70` → `a[1] = 70`, `rear = 2`, `size = 5` — full again.
Step 6: Array contents `[60, 70, 30, 40, 50]`, `front = 2`, `rear = 2`. Logical order starts at `front` and walks forward with wraparound: 2 → `30`, 3 → `40`, 4 → `50`, 0 → `60`, 1 → `70`. Every operation was `O(1)` — two index updates and a modulo, and no element ever moves.

**Final answer:** array `[60, 70, 30, 40, 50]`, `front = 2`, `rear = 2`, logical order `30, 40, 50, 60, 70`, and `front == rear` here while the queue is *full* — which is exactly why the `size` counter is needed.

Java implementation:

```java
public class CircularQueue {
    private int[] a;
    private int front, rear, size;

    CircularQueue(int capacity) {
        a = new int[capacity];
        front = 0; rear = 0; size = 0;
    }

    boolean enqueue(int v) {
        if (size == a.length) return false;    // full: refuse
        a[rear] = v;
        rear = (rear + 1) % a.length;          // wrap around
        size++;
        return true;
    }

    int dequeue() {
        if (size == 0) throw new RuntimeException("queue is empty");
        int v = a[front];
        front = (front + 1) % a.length;        // wrap around
        size--;
        return v;
    }

    boolean isEmpty() { return size == 0; }

    public static void main(String[] args) {
        CircularQueue q = new CircularQueue(5);
        for (int v : new int[]{10, 20, 30, 40, 50}) q.enqueue(v);
        System.out.println(q.dequeue() + " " + q.dequeue());   // 10 20
        q.enqueue(60); q.enqueue(70);
        System.out.print("order: ");
        while (!q.isEmpty()) System.out.print(q.dequeue() + " ");  // 30 40 50 60 70
        System.out.println();
    }
}
```

What it prints: `10 20` then `order: 30 40 50 60 70 ` — the same sequence derived in the trace. Cost: every operation `O(1)` time, `O(capacity)` space.

⚠️ **Common trap:** using `front == rear` to mean "empty" without a `size` counter or an intentionally empty slot — after the queue fills once, `front == rear` also means *full*, and the code then either reports a false empty or overwrites unread data. Second trap: forgetting the modulo on `front` as well as `rear`.

## 6.6 The deque and the monotonic-deque pattern

### Intuition

A **deque** (double-ended queue, pronounced "deck") lets you add and remove at *both* ends in `O(1)`. Think of a row of seats where people can enter or leave from either side.

The killer application is **sliding-window maximum**. In Module 3 you met the sliding window: for every window of size `k`, do something. The naive maximum recomputes by scanning all `k` elements, which is `O(n . k)`. With a deque we keep only the *useful* candidates: values that are smaller than something newer can never be the maximum again, so they get thrown away. The deque stays decreasing from front to back, the front is always the current maximum, and the total work is `O(n)`.

### The idea, step by step

**Step 1 — What the deque holds.** Indices, not values, and their values are **decreasing** from front to back. The front index is the largest value in the current window.

**Step 2 — The two rules, per new element `a[i]`.**

1. From the **back**: remove every index whose value is `<= a[i]`. Reason: they are older *and* no bigger, so they can never be a maximum again.
2. From the **front**: if the front index has fallen out of the window (`front <= i - k`), remove it. Reason: it is no longer inside the window.

Then push `i` at the back. Once `i >= k - 1`, `a[front]` is the answer for this window.

**Step 3 — Full trace** on `[1, 3, -1, -3, 5, 3, 6, 7]` with `k = 3`:

| Step | `i` | `a[i]` | Deque after popping from the back | Popped from the front | Deque (front → back) | Window max |
|---|---|---|---|---|---|---|
| 1 | 0 | 1 | — | — | `[0]` | — |
| 2 | 1 | 3 | removed `0` (1 ≤ 3) | — | `[1]` | — |
| 3 | 2 | -1 | nothing (-1 < 3) | — | `[1, 2]` | 3 |
| 4 | 3 | -3 | nothing | — | `[1, 2, 3]` | 3 |
| 5 | 4 | 5 | removed `3`, `2`, `1` | — | `[4]` | 5 |
| 6 | 5 | 3 | nothing (3 < 5) | — | `[4, 5]` | 5 |
| 7 | 6 | 6 | removed `5`, `4` | — | `[6]` | 6 |
| 8 | 7 | 7 | removed `6` | — | `[7]` | 7 |

Result `[3, 3, 5, 5, 6, 7]`. Note that step 4 never needed a front pop, because index `1` (value 3) was already discarded at step 5 by a bigger newcomer — the window eviction is often handled "for free" by rule 1.

**Step 4 — Why `O(n)`.** Each index enters the deque once and leaves at most once (either popped from the back or from the front). So there are at most `2n` operations total, no matter how the `while` loops are nested. Compare with `O(n . k)` for the naive scan — for `n = 10^6` and `k = 1000` that is a thousand-fold difference.

**Step 5 — Tying back to Module 3.** The sliding window told you *which* ranges to look at; the monotonic deque tells you how to maintain a maximum (or minimum) over those ranges in constant amortised time. The same trick answers "max in every window", "shortest subarray with sum at least `K`", and "jump game with limited jumps".

Java:

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class SlidingWindowMax {
    static int[] maxSlidingWindow(int[] a, int k) {
        int n = a.length;
        if (n == 0 || k == 0) return new int[0];
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();      // indices, values decreasing front->back
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();  // rule 1
            dq.addLast(i);
            if (dq.peekFirst() <= i - k) dq.pollFirst();                      // rule 2
            if (i >= k - 1) res[i - k + 1] = a[dq.peekFirst()];               // record max
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(
            maxSlidingWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
    }
}
```

What it prints: `[3, 3, 5, 5, 6, 7]` — the last column of the trace. Cost: `O(n)` time (each index added once, removed at most once), `O(k)` space (the deque never holds more than `k` indices).

**Example question:** Find the maximum of every window of size 3 in `[1, 3, -1, -3, 5, 3, 6, 7]` using a monotonic deque. Show the deque after each element and give the output array.

**Solution:**

Step 1: `i = 0`, value `1`: deque empty, push `0` → `[0]`, no output yet. `i = 1`, value `3`: back is `0` with `1 <= 3`, so pop it and push `1` → `[1]`; `1` can never be a maximum again because `3` is newer and bigger.
Step 2: `i = 2`, value `-1`: `3 > -1`, no back pop, push `2` → `[1, 2]`. The window `[1,3,-1]` is full, so record `a[1] = 3`. `i = 3`, value `-3`: push `3` → `[1, 2, 3]`, front `1 > 0`, record `3` again.
Step 3: `i = 4`, value `5`: pop `3`, `2`, `1` (all ≤ 5) → `[4]`, record `5`. `i = 5`, value `3`: push `5` → `[4, 5]`, front `4 > 2`, record `5`.
Step 4: `i = 6`, value `6`: pop `5` and `4` → `[6]`, record `6`. `i = 7`, value `7`: pop `6` → `[7]`, record `7`. Every index entered and left the deque once, so the whole scan is `O(n)`.

**Final answer:** `[3, 3, 5, 5, 6, 7]`, in `O(n)` time and `O(k)` space.

⚠️ **Common trap:** storing values instead of indices in the deque, which makes the "has this fallen out of the window?" test impossible. Second trap: using `<` instead of `<=` in rule 1 — it still works but keeps stale equal values, wasting space. Third: recording the answer *before* the front eviction, which can report an index that has already left the window.

## 6.7 Choosing the right linear structure

### Intuition

Every structure here is a different answer to "where may I add, and where may I remove?" Get the discipline right and the code almost writes itself; get it wrong and you end up fighting your own data structure.

### The idea, step by step

Ask three questions, in this order:

1. **Do I need random access by index?** If yes, use an **array / `ArrayList`** — no linked structure gives you `O(1)` indexing.
2. **Which end do I add and remove at?** Only the same end → **stack**. Opposite ends (add at back, remove at front) → **queue**. Both ends → **deque**.
3. **Do I insert or delete in the middle a lot, holding a reference to the node?** → **linked list**.

### Formula / rule / table

| Need | Structure | Reason |
|---|---|---|
| Access by index, mostly reading | array / `ArrayList` | `O(1)` indexing, cache friendly |
| Last in, first out | stack (`ArrayDeque`) | `push`/`pop` both `O(1)` |
| First in, first out | queue (`ArrayDeque`, `LinkedList`) | `addLast`/`pollFirst` both `O(1)` |
| Both ends | deque (`ArrayDeque`) | `O(1)` at either end |
| Fixed-size ring buffer | circular array queue | modulo reuse, zero shifting |
| Many middle inserts/deletes with a node reference | doubly linked list | `O(1)` splice |
| "Next bigger/smaller" scan / max over a moving window | monotonic stack / deque | each element pushed/popped once |
| Undo / back button / call stack | stack | most recent first |
| Task scheduling / BFS frontier / LRU cache | queue / hash map + doubly linked list | arrival order / `O(1)` lookup and move-to-front |

**Example question:** Name the structure you would use for each of these, with a one-line reason: (a) matching brackets in a compiler, (b) a printer's job list, (c) the browser's back button, (d) the maximum of every window of size 10 in a stream of a million numbers, (e) an LRU cache.

**Solution:**

Step 1: (a) **Stack** — the most recently opened bracket must close first, which is exactly LIFO. (b) **Queue** — jobs print in arrival order, FIFO. (c) **Stack** — the most recently visited page is the first you go back to. All three cost `O(1)` per operation; the signal is always the order in which items must come back out.
Step 2: (d) **Monotonic deque** — `O(n)` for a million elements instead of `O(n . k) = 10^7`, holding at most 10 indices. (e) **Hash map + doubly linked list** — the map gives `O(1)` lookup, the list keeps usage order and allows `O(1)` removal from the middle because each node knows its neighbours.

**Final answer:** (a) stack, (b) queue, (c) stack, (d) monotonic deque, (e) hash map + doubly linked list. The signal is always the *order* in which items must come back out.

⚠️ **Common trap:** choosing `LinkedList` in Java "because inserting is `O(1)`". You still pay `O(n)` to *find* the position, and you lose cache locality, so `ArrayList` usually wins. The other trap: using a stack for a problem that needs FIFO — BFS written with a stack becomes DFS, which visits nodes in the wrong order.

## 6.8 Putting it together — the linear structures in the project engine

### Intuition

The problem-solving engine from Module 1 has a loop: take a problem, try candidate solutions, keep the best. Every one of those steps needs a container, and now you can choose the right one deliberately.

### The idea, step by step

**Step 1 — The work list is a queue; the undo log is a stack.** New sub-problems are appended and processed in discovery order, so the engine is fair. Backtracking pops the last decision and reverts it — exactly LIFO, and the same discipline the call stack uses during recursion.

**Step 2 — Candidate solutions are a sorted list.** Sorting by cost (Module 5) turns "find the best" into "read index 0" and gives you a ranked list for free.

**Step 3 — The visited set is a hash set.** The engine must not revisit a state; in DSA-2 this becomes the `visited` array of graph search.

**Step 4 — Where the patterns plug in.** "Which pending task is the first with higher priority?" is next-greater-element, answered by a monotonic stack in `O(n)`; "best score over the last `k` attempts" is a monotonic deque, also `O(n)`.

| Engine part | Structure | Why that one |
|---|---|---|
| Pending sub-problems | queue | discovery order, fair |
| Backtrack / undo | stack | most recent decision first |
| Ranked candidates | sorted array | `O(1)` best, ordered output |
| Seen states | hash set | `O(1)` membership test |
| Recent-window statistics | monotonic deque | `O(n)` over the whole run |

**Example question:** The engine explores states with a queue and records every decision on a stack. It has just discovered states `A`, `B`, `C` in that order, and made decisions `d1`, `d2`, `d3`. Which state is processed next, which decision is undone first, and what would change if the queue were replaced by a stack?

**Solution:**

Step 1: The queue is `[A, B, C]` with `A` at the front, because `A` was discovered first. Reason: FIFO.
Step 2: The next state processed is `A`, leaving `[B, C]`. The decision stack is `[d1, d2, d3]` with `d3` on top, so `d3` is undone first. Reason: LIFO — you must reverse the most recent decision to return to a consistent state.
Step 3: If the queue became a stack, the next state would be `C`, and exploration would become depth-first. Both cost `O(1)` per operation, so only the *order* changes — and that changes which answer you reach first.

**Final answer:** process `A` next, undo `d3` first; swapping the queue for a stack turns breadth-first exploration into depth-first at the same `O(1)` per-operation cost.

⚠️ **Common trap:** mixing the two roles — using one container for both "pending work" and "undo history". They need opposite orders, so sharing one structure silently corrupts the backtracking.

## 6.9 The synthesis — cost mindset, recursion and patterns as one toolkit

### Intuition

Three habits now fit together, and this is the point of the whole course so far: the **cost mindset** (write the brute force, measure it, improve it), **recursion** (solve a smaller copy and combine), and **patterns** (recognise the shape and reach for the known `O(n)` tool).

### The idea, step by step

**Step 1 — Every pattern here is a cost story.** Naive next-greater is `O(n^2)`; the monotonic stack is `O(n)` because each element is pushed and popped once. Naive window-max is `O(n . k)`; the monotonic deque is `O(n)` for the same reason. A visited set detects a cycle in `O(n)` time but `O(n)` space; Floyd does it in `O(1)` space. The proof sentence is always "each element is touched a constant number of times".

**Step 2 — Recursion is everywhere here.** Reversing a list recursively is `O(n)` time and `O(n)` stack; iteratively it is `O(1)` space. And the call stack that runs your Module 2 recursion *is* the stack of 6.3.

**Step 3 — The honest limit.** Patterns are recognition tools, not magic: if a problem does not match a shape, go back to brute force and analyse it. Guessing a pattern that does not fit is how people lose 20 minutes in an interview.

**Example question:** You must find, for each of `n` days, how many days until a warmer temperature. Give the brute-force cost, the pattern, and the improved cost, with the one-line reason.

**Solution:**

Step 1: Brute force: for each day `i`, scan forward until a warmer day appears — the literal statement of the question.
Step 2: Worst case that is `n-1 + n-2 + ... = O(n^2)`, for example on a strictly decreasing list where nothing is ever warmer. Reason: nested scanning.
Step 3: The question is "next greater element" in disguise — the value is the temperature and the answer is the *distance* to that index, so store `j - i` instead of `a[j]`. Step 4: Use a monotonic stack of indices with decreasing temperatures: pop an index when a warmer day arrives and record `i - poppedIndex`. Cost `O(n)` time and `O(n)` space, because there are at most `n` pushes and `n` pops.

**Final answer:** `O(n^2)` brute force becomes `O(n)` with a monotonic stack, because each day enters and leaves the stack exactly once.

⚠️ **Common trap:** memorising patterns without their cost argument. In a viva the question is always "why is this `O(n)`?", and the answer is always "each element is pushed and popped at most once".

## 6.10 The bridge to DSA-2

### Intuition

Everything so far has been *linear*: one thing after another. DSA-2 is about **non-linear** structures — trees, graphs and hash tables — where an element can point to many others.

### The idea, step by step

**Step 1 — What carries over unchanged.** The cost mindset, Big-O, recursion, and the patterns. A tree node is a linked-list node with two `next` pointers, so a traversal *is* recursion on a linked structure. A graph's BFS *is* the queue of 6.5; its DFS *is* the stack of 6.3. Hash tables give the `O(1)` lookup a linked list cannot.

**Step 2 — What is genuinely new.** Trees add *hierarchy* and, when balanced, a `log n` depth that makes ordered search `O(log n)`; graphs add *arbitrary connections*, cycles everywhere and a `visited` set; hashing adds *direct addressing by key* — the structure behind `HashMap`.

**Step 3 — The seven continuing branches.** If you continue to DSA-2, expect trees (binary trees, BSTs, heaps, balanced trees), graphs (BFS, DFS, shortest paths) and hashing — all built from what you already have: a node with references, a stack or queue to control traversal, and a cost argument.

**Step 4 — An honest close for ME and CE.** If your branch ends here, this is a complete toolkit, not a fragment: you can store data, control order, sort it in `O(n log n)`, search it in `O(log n)`, and recognise the patterns interviewers ask about. Trees and graphs are refinements of the same two ideas — a node with links, plus a traversal order — so nothing here becomes wasted.

**Step 5 — What to revise first.** The three tables: the sort comparison table in Module 5, the linked-list trade-off in 6.1, and the "choose the structure" table in 6.7. Those answer most one-mark questions.

| DSA-1 idea | Where it reappears in DSA-2 |
|---|---|
| Linked node with `next` | tree node with `left`, `right` |
| Stack / recursion | depth-first search |
| Queue | breadth-first search, level-order traversal |
| Monotonic stack / deque | range-maximum problems, sliding windows |
| Cost argument "each element once" | every tree and graph traversal, `O(V + E)` |

**Example question:** Explain, in three sentences, why a tree traversal is "a linked list with recursion" and why BFS needs a queue.

**Solution:**

Step 1: A tree node stores a value and references to its children — exactly a linked-list node with two arrows instead of one.
Step 2: Visiting all nodes is then recursion: visit the node, recurse on each child, with `null` as the base case — the Module 2 template applied to a structure.
Step 3: BFS must finish all nodes at distance 1 before any at distance 2, so it needs "first discovered, first expanded" order, which is FIFO — hence a queue. A stack would dive deep, which is DFS.

**Final answer:** a tree node is a multi-pointer linked node, traversal is recursion over those pointers, and BFS's level-by-level order is exactly FIFO, so it needs a queue.

⚠️ **Common trap:** assuming a tree is just a linked list and writing `while (cur != null)` with a single `next`. Trees need recursion or an explicit stack/queue, because each node has two or more arrows and you must come back for the second one.

## Formula / rule summary table

| Structure | Order | Insert | Delete | Access | Search | Choose it when |
|---|---|---|---|---|---|---|
| Array / `ArrayList` | index | `O(n)` middle, `O(1)` end | `O(n)` | `O(1)` | `O(n)` unsorted | you need indexing |
| Singly linked list | sequence | `O(1)` at head | `O(1)` with `prev` | `O(n)` | `O(n)` | many head inserts, no indexing |
| Doubly linked list | sequence | `O(1)` at either end | `O(1)` given the node | `O(n)` | `O(n)` | LRU cache, undo chains |
| Stack (LIFO) | last in first out | `O(1)` push | `O(1)` pop | top only | `O(n)` | undo, brackets, next-greater |
| Queue (FIFO) | first in first out | `O(1)` enqueue | `O(1)` dequeue | front only | `O(n)` | scheduling, buffering, BFS |
| Circular queue | FIFO, fixed size | `O(1)` | `O(1)` | front only | `O(n)` | ring buffer, fixed capacity |
| Deque | both ends | `O(1)` either end | `O(1)` either end | both ends | `O(n)` | sliding-window max/min |
| Monotonic stack / deque | decreasing (or increasing) | `O(1)` amortised | `O(1)` amortised | top / front = max | — | next greater/smaller, histogram, window maximum |

**Which one when?** "Most recent first" → stack. "In arrival order" → queue. "Both ends" → deque. "By index" → array. "Next bigger element" → monotonic stack. "Max over last `k`" → monotonic deque. "Detect a loop or find the middle in one pass" → fast/slow pointers.

## Solved examples

**Example 1 (medium) — largest rectangle in a histogram.** Find the largest rectangle in `[2, 1, 5, 6, 2, 3]`.

Step 1: The rectangle using bar `i` has height `h[i]` and width = (index of the first shorter bar on the right) − (index of the first shorter bar on the left) − 1. Reason: a shorter bar caps the height, so it bounds the rectangle.
Step 2: Scan with a stack of indices whose heights increase from bottom to top, and append a sentinel height `0` at index 6 to flush everything at the end. Reason: the sentinel acts as a "shorter bar" for every remaining bar.
Step 3: `i = 1`, `h = 1`. Top is index 0 (height 2), and `2 > 1` → pop it; the left boundary is `-1` (stack empty), so area `= 2 × (1 - (-1) - 1) = 2`. Best `2`.
Step 4: `i = 4`, `h = 2`. Pop index 3 (height 6), left boundary 2 → area `6 × 1 = 6`. Then pop index 2 (height 5), left boundary 1 → area `5 × 2 = 10`. Best `10`.
Step 5: `i = 6`, `h = 0`. Pop index 5 (height 3), left boundary 4 → area `3 × 1 = 3`; pop index 4 (height 2), left boundary 1 → area `2 × 4 = 8`; pop index 1 (height 1), left boundary `-1` → area `1 × 6 = 6`. Best stays `10`, and every index was pushed once and popped once — amortised constant work per bar, so `O(n)`.

**Final answer:** `10`, from the two bars of heights 5 and 6 spanning width 2. `O(n)` time, `O(n)` space.

**Example 2 (exam level) — infix to postfix.** Convert `A * (B + C) - D` to postfix using a stack, showing the stack and output after each symbol.

| Step | Symbol | Action | Stack (bottom → top) | Output |
|---|---|---|---|---|
| 1 | `A` | operand → output | `[]` | `A` |
| 2 | `*` | stack empty → push | `[*]` | `A` |
| 3 | `(` | always push | `[*, (]` | `A` |
| 4 | `B` | operand → output | `[*, (]` | `A B` |
| 5 | `+` | top is `(`, so push | `[*, (, +]` | `A B` |
| 6 | `C` | operand → output | `[*, (, +]` | `A B C` |
| 7 | `)` | pop until `(` | `[*]` | `A B C +` |
| 8 | `-` | `*` has higher precedence → pop it, then push `-` | `[-]` | `A B C + *` |
| 9 | `D` | operand → output | `[-]` | `A B C + * D` |
| 10 | end | pop everything | `[]` | `A B C + * D -` |

Step-by-step reasons: at step 7 the `+` must come out before the `(` is discarded, because it belongs inside the brackets. At step 8 the incoming `-` has *lower* precedence than the `*` on top, so the `*` must be output first — that is what preserves `(A * (B+C))` as a unit before the subtraction. At step 10 the stack holds operators whose right operands are all done.

Check by evaluating `A B C + * D -` with `A=2, B=3, C=4, D=5`: `B C + = 7`, `A * 7 = 14`, `14 - 5 = 9`. And `2 * (3+4) - 5 = 14 - 5 = 9`. Matches.

**Final answer:** `A B C + * D -`, i.e. `ABC+*D-` without spaces, in `O(n)` time and `O(n)` space.

## Common traps and mistakes

- **Deleting a list node without handling the head.** `prev.next` with `prev == null` throws `NullPointerException` — check `head.val == val` first. Similarly, in an insert-after set `node.next = target.next` *before* `target.next = node`, or you lose the tail.
- **`while (fast != null && fast.next != null)` shortened to `while (fast != null)`.** Then `fast.next.next` crashes on the last node, and a `null`-unsafe traversal also breaks the middle and n-th-from-end patterns.
- **Reporting the cycle-start search wrongly.** After the meeting, reset **one** pointer to `head` and move **both one step**; moving both two steps gives the wrong node. And in a reversal, never flip before saving: `cur.next = prev` destroys the only route to the rest of the list.
- **Bracket matching by counting.** `([)]` has equal counts and is still invalid — match *types* via `peek()`. And never forget the final `return stack.isEmpty()`, or `(((` reports balanced.
- **Postfix evaluation in the wrong operand order.** Pop `b` then `a` and compute `a op b`; `b - a` flips every subtraction.
- **Queue "full" confused with "empty".** With only `front` and `rear` both look the same — keep a `size` counter, and remember the modulo on `front` as well as `rear`.
- **A monotonic stack holding values instead of indices.** Then you cannot write the answer back to the right position. Likewise, `LinkedList` is not always faster than `ArrayList` for inserts — finding the position is still `O(n)`, and cache locality is worse.

## Quick revision box

- ✅ A linked node = value + reference. Insert/delete at a known node is `O(1)`; access by index is `O(n)`. Arrays trade that the other way round, plus better cache behaviour. Fast/slow pointers give the middle in one pass and cycle detection in `O(1)` space — they must meet because the gap shrinks by exactly 1 per iteration.
- ✅ Cycle start: after meeting, reset one pointer to `head`, advance both one step. Reason: `a + b = kL`, so `a` and `c` reach the same node.
- ✅ Reverse a list with `prev`, `cur`, `next` in that order: save, flip, advance. `O(n)` time, `O(1)` space.
- ✅ Stack = LIFO, all operations `O(1)`. Bracket matching, postfix evaluation, undo, and the call stack itself.
- ✅ Monotonic stack solves next-greater, next-smaller and histogram problems in `O(n)` because each element is pushed and popped at most once.
- ✅ Queue = FIFO. A circular queue uses `(index + 1) % capacity` so no shifting is needed; keep a `size` counter to tell full from empty. The monotonic deque gives sliding-window maximum in `O(n)` — the upgrade of Module 3's `O(n . k)` scan.

## Practice questions

**Q1 (easy).** Insert `5`, `15`, `25` at the head of an empty singly linked list, then delete `15`. Give the list after each step and the cost of each operation.

**Q2 (easy).** Give the output of `isBalanced("([{}])")` and `isBalanced("[(])")`, with a one-line reason each.

**Q3 (medium).** Evaluate the postfix expression `6 2 3 * - 4 2 / +`. Show the stack after each token.

**Q4 (medium).** Find the next greater element for every position of `[13, 7, 6, 12]` using a monotonic stack, and state the cost.

**Q5 (exam level).** Find the maximum of every window of size 2 in `[4, 2, 7, 1, 9]` with a monotonic deque. Show the deque after each element and state the cost.

## Answers

**A1.** Insert `5`: `5 -> null`. Insert `15`: `15 -> 5 -> null`. Insert `25`: `25 -> 15 -> 5 -> null`. Delete `15`: `head` holds `25`, then `cur` is `15` and `prev.next = cur.next` gives `25 -> 5 -> null`. **Final answer: `25 -> 5 -> null`; all four operations are `O(1)`** (the delete found `15` on the first step).

**A2.** `isBalanced("([{}])")` → `true`: each closer matches the opener on top (`}`, `]`, `)` in that order). `isBalanced("[(])")` → `false`: after `[` and `(`, the `]` arrives while `(` is on top, so the types do not match.

**A3.** `6` → `[6]`; `2` → `[6, 2]`; `3` → `[6, 2, 3]`; `*` pops `3` and `2`, pushes `6` → `[6, 6]`; `-` pops `6` and `6`, pushes `0` → `[0]`; `4` → `[0, 4]`; `2` → `[0, 4, 2]`; `/` pops `2` and `4`, pushes `2` → `[0, 2]`; `+` pops `2` and `0`, pushes `2` → `[2]`. **Final answer: `2`** (since `6 - 2*3 = 0` and `0 + 4/2 = 2`).

**A4.** `i=0 (13)`: stack `[0]`. `i=1 (7)`: `13 > 7`, no pop, stack `[0, 1]`. `i=2 (6)`: no pop, stack `[0, 1, 2]`. `i=3 (12)`: pop `2` (6 < 12) → `res[2] = 12`; pop `1` (7 < 12) → `res[1] = 12`; top `0` has `13 > 12`, stop; push `3`. Leftovers keep `-1`. **Final answer: `[-1, 12, 12, -1]`; `O(n)` time** because each index is pushed and popped at most once.

**A5.** `i=0 (4)`: deque `[0]`. `i=1 (2)`: `4 > 2`, push → `[0, 1]`, window `[4,2]` max `4`. `i=2 (7)`: pop `1` (2 ≤ 7), pop `0` (4 ≤ 7), push → `[2]`, max `7`. `i=3 (1)`: push → `[2, 3]`, max `7`. `i=4 (9)`: pop `3` (1 ≤ 9), pop `2` (7 ≤ 9), push → `[4]`, max `9`. **Final answer: `[4, 7, 7, 9]`, in `O(n)` time and `O(k) = O(2)` space.**
