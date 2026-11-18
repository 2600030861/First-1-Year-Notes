# DSA-1 – Module 5
## Sorting (and a First Taste of Divide & Conquer)
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture

Sorting means putting a collection into a defined order — smallest to largest, A to Z, cheapest first. On its own that sounds like a small chore. It is not. Sorting is the single most useful "preparation step" in all of DSA, because almost every fast algorithm in this course assumes the data is already in order.

One analogy before we start. Imagine a librarian with 500 unsorted book slips and a request: "find the slip for *Wings of Fire*". Unsorted, she reads them one by one — up to 500 checks. Sorted, she opens the middle, sees "M", and throws away half the pile in one glance. Ten such glances settle 500 slips. **Sorting is the price you pay once so that every later question becomes cheap.**

Where you will actually meet it:

- Binary search (Module 4) only works on sorted data.
- Two-pointer pair-sum (Module 3) drops from `O(n^2)` to `O(n)` after sorting.
- Grouping, duplicate removal and "are these two lists anagrams" become trivial because equal things end up next to each other.
- Ranking, medians, scheduling by deadline, merging calendars — all sorting in disguise.

So this module is the connective tissue: it takes the recursion of Module 2, the arrays of Module 3 and the binary search of Module 4, and welds them together.

## Basics you must know first

- **Big-O (Module 1).** A way of saying "how the running time grows as the input grows". `O(n)` means roughly one unit of work per element.
- **`log n` means "how many times can I halve n".** For `n = 8`: 8 → 4 → 2 → 1, that is 3 halvings, so `log2 8 = 3`. This single idea explains every `n log n` in this module.
- **Arrays and indexing (Module 3).** `a[i]` costs `O(1)`; inserting in the middle costs `O(n)` because everything must shift.
- **Recursion and the base case (Module 2).** A function that calls itself on a smaller input, and a stopping condition. Merge sort and quicksort are both recursion wearing a new hat.
- **In-place vs extra memory.** "In-place" means the algorithm rearranges the same array without building a second array of size `n`.
- **Stable sort.** If two items compare equal, a stable sort keeps them in their original relative order. We will use this a lot in 5.8.

## 5.1 Why sorting matters

### Intuition

Think of a deck of cards you have just been dealt. Before you can do anything clever — find the ace, check for a pair, decide what to discard — you first arrange the cards in your hand. Every card game move is easier on an ordered hand. Sorting is that arranging step for data.

### The idea, step by step

**Step 1 — Sorting enables binary search.** Binary search works by looking at the middle element and deciding "the answer is in the left half or the right half". That decision is only valid if the array is ordered. Unsorted, the middle element tells you nothing.

**Step 2 — Sorting enables the two-pointer pattern.** To find two numbers in an array that add up to a target, sorting first lets you put one pointer at each end: if the sum is too small, move the left pointer right; if too big, move the right pointer left. Each pointer only moves forward, so it is one pass. On unsorted data you would have to check every pair.

**Step 3 — Sorting makes equal things adjacent.** Once sorted, duplicates sit side by side. "Remove duplicates", "count frequencies", "group anagrams" all become one linear scan. Without sorting you need a hash map or a nested loop.

**Step 4 — Sorting enables greedy and interval logic, and it pays for itself.** Merging meeting times, scheduling by earliest deadline, finding the median — all start with "sort, then sweep". And one `O(n log n)` sort followed by 1000 binary searches at `O(log n)` each beats 1000 linear scans at `O(n)` each.

**Example question:** You are given an array of `n` integers and a target `T`. You must answer *whether any two different positions hold values that add up to `T`*. Solve it the brute-force way, then the sorted way, and compare the costs.

**Solution:**

Step 1: Brute force — try every pair `(i, j)` with `i < j`. Reason: that literally enumerates every possible answer.
Step 2: Number of pairs is `n(n-1)/2`, which is about `n^2/2`, so time is `O(n^2)`. Reason: two nested loops each running up to `n`.
Step 3: Space is `O(1)` — only two loop counters. Reason: no extra structure.
Step 4: Sorted approach — sort the array, cost `O(n log n)`. Reason: this is the cheapest known comparison sort (we prove the `n log n` part in 5.6).
Step 5: Put `left` at index `0`, `right` at index `n-1`. Compute `sum = a[left] + a[right]`. Reason: the smallest and largest available values bracket every other sum.
Step 6: If `sum == T`, answer yes. If `sum < T`, the only way to increase the sum is to move `left` right (`left++`). If `sum > T`, move `right` left (`right--`). Reason: each move discards values that provably cannot work with anything remaining.
Step 7: Repeat while `left < right`. Each pointer moves at most `n` times, so the scan is `O(n)`. Reason: two pointers, each monotonically advancing.
Step 8: Total is `O(n log n)` time (sort dominates) and `O(1)` extra space. Reason: the scan is cheaper than the sort.

Quick check on `a = [2, 7, 11, 15]`, `T = 9`. Sorted already. `left=0 (2)`, `right=3 (15)`: sum `17 > 9`, so `right--`. Now `2 + 11 = 13 > 9`, `right--`. Now `2 + 7 = 9` — found.

**Final answer:** brute force is `O(n^2)` time, `O(1)` space; sort-then-two-pointer is `O(n log n)` time, `O(1)` extra space, and it is the better choice whenever `n` is large.

⚠️ **Common trap:** sorting changes the *order*, so if the question asked for the original *indices* of the two numbers, sorting destroys that information. Either store `(value, index)` pairs or use a hash map. Many exam answers lose marks here.

## 5.2 Elementary sorts — bubble, selection, insertion

### Intuition

All three do the same job with the same childlike strategy: compare items and swap. They are the "by hand" methods.

- **Bubble sort:** repeatedly walk the array and swap any neighbouring pair that is out of order. Big values "bubble" to the right end, one per pass. Like bubbles rising in a soda glass.
- **Selection sort:** find the smallest remaining item and put it in the next slot. Like picking the shortest person in a line and moving them to the front, then repeating for the rest.
- **Insertion sort:** take the next card from the table and slide it into the correct place in your already-sorted hand. This is exactly how people sort playing cards.

### The idea, step by step

We will trace all three on the same array `[5, 2, 9, 1, 6]` so you can compare them fairly.

**Bubble sort.** One pass compares `a[j]` and `a[j+1]` for `j = 0 .. n-2-pass`, swapping when the left is bigger. After one full pass the largest element is guaranteed to be at the end, so the next pass can stop one slot earlier. If a pass makes zero swaps, the array is already sorted and we stop early.

| Pass | Comparisons made (with result) | Array after the pass |
|---|---|---|
| 1 | 5>2 swap, 5<9 keep, 9>1 swap, 9>6 swap | `[2, 5, 1, 6, 9]` |
| 2 | 2<5 keep, 5>1 swap, 5<6 keep | `[2, 1, 5, 6, 9]` |
| 3 | 2>1 swap, 2<5 keep | `[1, 2, 5, 6, 9]` |
| 4 | 1<2 keep — zero swaps, so stop | `[1, 2, 5, 6, 9]` |

Total swaps: `3 + 1 + 1 + 0 = 5`.

**Selection sort.** For each position `i` from `0` to `n-2`, scan `a[i..n-1]` to find the index `minIdx` of the smallest value, then swap `a[i]` with `a[minIdx]`.

| Step | `i` | `minIdx` found | Array after |
|---|---|---|---|
| 1 | 0 | 3 (value 1) | `[1, 2, 9, 5, 6]` |
| 2 | 1 | 1 (value 2) | `[1, 2, 9, 5, 6]` — no swap needed |
| 3 | 2 | 3 (value 5) | `[1, 2, 5, 9, 6]` |
| 4 | 3 | 4 (value 6) | `[1, 2, 5, 6, 9]` |

**Insertion sort.** Keep `a[0..i-1]` sorted. Take `key = a[i]`, shift every element greater than `key` one slot right, then drop `key` into the gap.

| Step | `i` | `key` | Elements shifted right | Array after |
|---|---|---|---|---|
| 1 | 1 | 2 | 5 | `[2, 5, 9, 1, 6]` |
| 2 | 2 | 9 | none (5 < 9) | `[2, 5, 9, 1, 6]` |
| 3 | 3 | 1 | 9, 5, 2 | `[1, 2, 5, 9, 6]` |
| 4 | 4 | 6 | 9 | `[1, 2, 5, 6, 9]` |

Now the Java for insertion sort — the only one of the three you are asked to write in full, and the one worth memorising.

```java
public class InsertionSort {
    static void insertionSort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];          // the card we just picked up
            int j = i - 1;
            while (j >= 0 && a[j] > key) {   // shift every bigger card one slot right
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;          // drop the card into the gap we opened
        }
    }
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 6};
        insertionSort(a);
        for (int x : a) System.out.print(x + " ");
    }
}
```

What it prints: `1 2 5 6 9 ` — matching the trace above, because the array after step 4 is `[1, 2, 5, 6, 9]`.

**Cost of all three.** Bubble: pass 1 does `n-1` comparisons, pass 2 does `n-2`, down to 1 — the sum is `n(n-1)/2`, which is `O(n^2)`. Selection: same sum, `n(n-1)/2` comparisons always, `O(n^2)`. Insertion: worst case `n(n-1)/2` shifts, `O(n^2)`.

**When insertion sort is actually good.** Its inner `while` stops as soon as it finds a smaller element. On nearly sorted data that happens almost immediately. Concretely, on `[1, 2, 3, 5, 4, 6, 7, 8]` it performs exactly **1 shift** — only the `4` has to move past the `5`. On the fully reversed `[8, 7, 6, 5, 4, 3, 2, 1]` it performs `28` shifts, the maximum possible. Same algorithm, 28× difference. That is why real library sorts switch to insertion sort for small sub-arrays (under about 16–32 elements).

### Formula / rule / table

| Sort | Best case | Average | Worst case | One-line reason for the worst case |
|---|---|---|---|---|
| Bubble (with early exit) | `O(n)` — already sorted, one pass, zero swaps | `O(n^2)` | `O(n^2)` — reverse sorted, every pair swaps | `n-1 + n-2 + ... + 1` comparisons |
| Selection | `O(n^2)` — always scans the whole tail | `O(n^2)` | `O(n^2)` | it never learns anything from the data's order |
| Insertion | `O(n)` — already sorted, each `while` fails on the first test | `O(n^2)` | `O(n^2)` — reverse sorted, everything shifts | each key travels the full length of the sorted part |

**Example question:** Using bubble sort on `[5, 2, 9, 1, 6]`, how many swaps happen in total, what is the array after pass 2, and why does the algorithm stop after pass 4?

**Solution:**

Step 1: Pass 1 compares `(5,2)`, `(2,9)`, `(9,1)`, `(9,6)`. Reason: `n-1 = 4` comparisons in the first pass.
Step 2: Swaps: `5>2` yes, `5<9` no, `9>1` yes, `9>6` yes — that is 3 swaps. Reason: a swap happens only when the left element is strictly bigger.
Step 3: Array after pass 1 is `[2, 5, 1, 6, 9]`. Reason: apply the three swaps in order.
Step 4: Pass 2 compares `(2,5)`, `(5,1)`, `(5,6)` — 3 comparisons, since the last slot is already fixed. Reason: pass `p` handles `n-p` positions.
Step 5: Only `5>1` swaps, so 1 swap. Array becomes `[2, 1, 5, 6, 9]`.
Step 6: Pass 3: `(2,1)` swaps → `[1, 2, 5, 6, 9]`, 1 swap. Pass 4: `(1,2)` does not swap.
Step 7: Pass 4 recorded zero swaps, so the `swapped` flag stays false and the loop breaks. Reason: a pass with no swap proves every adjacent pair is in order, which means the whole array is sorted.

Total swaps `= 3 + 1 + 1 + 0 = 5`.

**Final answer:** 5 swaps; after pass 2 the array is `[2, 1, 5, 6, 9]`; it stops after pass 4 because that pass made no swaps, proving the array is already sorted.

⚠️ **Common trap:** selection sort looks "faster" than bubble sort because it makes fewer swaps, but swaps are not the cost model — *comparisons* are, and selection always does `n(n-1)/2` of them. Also, a bubble sort written *without* the `swapped` flag is `O(n^2)` even on sorted input, which loses the `O(n)` best case.

## 5.3 Mergesort

### Intuition

You and a friend must sort 100 exam papers by roll number. You split the pile in half, each of you sorts your 50, then you *merge* the two sorted piles: look at the top paper of each pile, take the smaller one, repeat. Merging two sorted piles is easy and needs only one pass. The splitting is recursion.

That is the whole algorithm: **split, sort each half by the same method, merge.**

### The idea, step by step

**Step 1 — Split.** Cut the array at `mid = (lo + hi) / 2`. A one-element (or empty) array is already sorted — that is the base case.

**Step 2 — Conquer.** Recursively sort the left half and the right half.

**Step 3 — Merge.** Walk two indices `i` over the left half and `j` over the right half. Whichever current value is smaller goes into the temporary array next, and that index advances. When one side runs out, copy the rest of the other side.

**Step 4 — Copy back.** Put the merged temp array back into `a[lo..hi]`.

Full trace on `[38, 27, 43, 3, 9, 82, 10]`. With 7 elements, `mid = 7/2 = 3`, so the halves are `[38, 27, 43]` and `[3, 9, 82, 10]`.

| Step | Sub-array being merged | Left half | Right half | Result |
|---|---|---|---|---|
| 1 | `[27, 43]` | `[27]` | `[43]` | `[27, 43]` — 27 < 43, take 27, then drain |
| 2 | `[38, 27, 43]` | `[38]` | `[27, 43]` | `[27, 38, 43]` — 27 < 38, take 27; then 38 < 43, take 38; drain 43 |
| 3 | `[3, 9]` | `[3]` | `[9]` | `[3, 9]` |
| 4 | `[82, 10]` | `[82]` | `[10]` | `[10, 82]` — 10 < 82, take 10; drain 82 |
| 5 | `[3, 9, 82, 10]` | `[3, 9]` | `[10, 82]` | `[3, 9, 10, 82]` — 3, 9 from the left; then 10 < 82, 82 |
| 6 | `[38, 27, 43, 3, 9, 82, 10]` | `[27, 38, 43]` | `[3, 9, 10, 82]` | `[3, 9, 10, 27, 38, 43, 82]` |

Java code:

```java
public class MergeSort {
    static void mergeSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;                    // 0 or 1 element is already sorted
        int mid = lo + (hi - lo) / 2;            // safe midpoint, no overflow
        mergeSort(a, lo, mid);                   // sort the left half
        mergeSort(a, mid + 1, hi);               // sort the right half
        merge(a, lo, mid, hi);                   // stitch the two sorted halves
    }

    static void merge(int[] a, int lo, int mid, int hi) {
        int[] temp = new int[hi - lo + 1];
        int i = lo, j = mid + 1, k = 0;
        while (i <= mid && j <= hi) {            // both halves still have elements
            if (a[i] <= a[j]) temp[k++] = a[i++]; // '<=' keeps equal items stable
            else              temp[k++] = a[j++];
        }
        while (i <= mid) temp[k++] = a[i++];      // drain whatever is left
        while (j <= hi)  temp[k++] = a[j++];
        for (int t = 0; t < temp.length; t++) a[lo + t] = temp[t];  // copy back
    }

    public static void main(String[] args) {
        int[] a = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(a, 0, a.length - 1);
        for (int x : a) System.out.print(x + " ");
    }
}
```

What it prints: `3 9 10 27 38 43 82 ` — exactly the row-6 result above.

**Why `O(n log n)`, guaranteed.** The array is halved at every level, so the number of levels is `log2 n` (for `n = 8`, three levels: 8 → 4 → 2 → 1). At each level the total merging work is `n` comparisons, because every element is copied exactly once per level. Levels × work per level `= n log n`. Unlike quicksort, this does not depend on the data at all — even a sorted or reversed array takes the same time.

**Why `O(n)` extra space.** The `temp` array holds up to `n` elements. Also, the recursion is `log n` deep, which costs `log n` stack frames — negligible compared to `n`.

**Why it is stable.** In the merge, when the two current values are equal we take from the *left* half (`<=`). The left half holds the elements that came earlier in the original array, so ties keep their original order.

### Formula / rule / table

```text
T(n) = 2 . T(n/2) + c . n        with T(1) = 1
```

**Meaning:** sorting `n` elements costs two recursive sorts of `n/2` elements each, plus `c . n` work to merge.
**When to use:** whenever you need a guaranteed `n log n` sort, or a stable sort of objects, or you are sorting a linked list (merge sort is the natural choice there — see 6.x thinking in Module 6).
**Tiny example:** `n = 8` gives `T(8) = 2T(4) + 8 = 4T(2) + 16 = 8T(1) + 24 = 8 + 24 = 32`, and `n log2 n = 8 × 3 = 24` work units plus the base cases. Same growth.

**Example question:** Merge the sorted arrays `L = [1, 4, 7]` and `R = [2, 3, 8]` using the merge procedure, and count the comparisons.

**Solution:**

Step 1: `i = 0` (`L[0] = 1`), `j = 0` (`R[0] = 2`). Compare `1` and `2` → take `1`, `i` becomes 1. Output so far `[1]`. Reason: take the smaller head so the output stays sorted.
Step 2: Compare `L[1] = 4` and `R[0] = 2` → take `2`, `j` becomes 1. Output `[1, 2]`.
Step 3: Compare `4` and `R[1] = 3` → take `3`, `j` becomes 2. Output `[1, 2, 3]`.
Step 4: Compare `4` and `R[2] = 8` → take `4`, `i` becomes 2. Output `[1, 2, 3, 4]`.
Step 5: Compare `L[2] = 7` and `8` → take `7`, `i` becomes 3. Output `[1, 2, 3, 4, 7]`.
Step 6: `i = 3 > mid`, so the left half is empty. Drain the rest of `R`: append `8`. Output `[1, 2, 3, 4, 7, 8]`. Reason: the remaining elements are already sorted, so no comparisons are needed.

Comparisons used: 5 — one per step that compared two heads.

**Final answer:** `[1, 2, 3, 4, 7, 8]`, using 5 comparisons. In general merging costs at most `|L| + |R| - 1` comparisons.

⚠️ **Common trap:** forgetting to copy `temp` back into `a[lo..hi]`. Beginners often merge correctly and then print the original array. Second trap: writing `mid = (lo + hi) / 2` — correct in Java for arrays (indices are small) but it overflows in other settings; `lo + (hi - lo) / 2` is the habit worth building.

## 5.4 Quicksort

### Intuition

Quicksort picks one element called the **pivot** and rearranges the array so that everything smaller than the pivot sits to its left and everything bigger sits to its right. That single operation is called **partitioning**, and after it the pivot is in its final position forever. Then you recursively sort the left part and the right part.

Real-life picture: a teacher splits a class into "shorter than 160 cm" and "taller than 160 cm". Nobody in the short group needs comparing with anybody in the tall group ever again. That is the power move — one pass removes `n-1` comparisons from the future.

### The idea, step by step

We use the **Lomuto scheme** because it is the easiest to write correctly. Choose the last element as pivot. Keep a boundary index `i = lo - 1` meaning "everything up to `i` is smaller than the pivot". Walk `j` from `lo` to `hi-1`; whenever `a[j] <= pivot`, extend the small region by one (`i++`) and swap `a[i]` with `a[j]`. At the end, swap the pivot into position `i+1`.

Full trace on `[10, 80, 30, 90, 40, 50, 70]`, `pivot = 70`.

| Step | `j` | `a[j]` | `a[j] <= 70`? | `i` | Array after |
|---|---|---|---|---|---|
| start | — | — | — | -1 | `[10, 80, 30, 90, 40, 50, 70]` |
| 1 | 0 | 10 | yes | 0 | `[10, 80, 30, 90, 40, 50, 70]` (swap with itself) |
| 2 | 1 | 80 | no | 0 | `[10, 80, 30, 90, 40, 50, 70]` |
| 3 | 2 | 30 | yes | 1 | `[10, 30, 80, 90, 40, 50, 70]` |
| 4 | 3 | 90 | no | 1 | `[10, 30, 80, 90, 40, 50, 70]` |
| 5 | 4 | 40 | yes | 2 | `[10, 30, 40, 90, 80, 50, 70]` |
| 6 | 5 | 50 | yes | 3 | `[10, 30, 40, 50, 80, 90, 70]` |
| finish | — | swap `a[i+1] = a[4]` with `a[6]` | — | 4 | `[10, 30, 40, 50, 70, 90, 80]` |

The pivot `70` is now at index 4, with `[10, 30, 40, 50]` on its left and `[90, 80]` on its right. Recursing on those two gives `[10, 30, 40, 50]` (pivot 50 → index 3, then 40 → index 2, then 30 → index 1) and `[80, 90]`, and the full array becomes `[10, 30, 40, 50, 70, 80, 90]`.

Java code:

```java
public class QuickSort {
    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi];                 // last element is the pivot
        int i = lo - 1;                    // i marks the end of the "smaller" region
        for (int j = lo; j < hi; j++) {
            if (a[j] <= pivot) {           // this element belongs on the left
                i++;
                int t = a[i]; a[i] = a[j]; a[j] = t;
            }
        }
        int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;  // pivot into its final home
        return i + 1;                      // the pivot's index
    }
    static void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;              // 0 or 1 element: nothing to do
        int p = partition(a, lo, hi);
        quickSort(a, lo, p - 1);           // strictly left of the pivot
        quickSort(a, p + 1, hi);           // strictly right of the pivot
    }

    public static void main(String[] args) {
        int[] a = {10, 80, 30, 90, 40, 50, 70};
        quickSort(a, 0, a.length - 1);
        for (int x : a) System.out.print(x + " ");
    }
}
```

What it prints: `10 30 40 50 70 80 90 `.

**Average case `O(n log n)`.** A "typical" pivot lands near the middle, so the array splits roughly in half: `log n` levels of recursion, with `O(n)` work per level for partitioning. Hence `n log n`.

**Worst case `O(n^2)`.** If the pivot is always the smallest or always the largest, every partition peels off just one element. Then the recursion depth is `n`, and the work is `n + (n-1) + ... + 1 = n(n-1)/2`, which is `O(n^2)`. **This happens on already-sorted input when you always pick the last element.** Concretely, sorting `[1, 2, 3, 4, 5, 6]` with last-element pivot takes exactly 15 comparisons `= 6 × 5 / 2`. That is the worst case, and it is the *most common* real input — freshly sorted data — which is why naive quicksort is dangerous.

**Pivot choice is the fix.** Three standard choices: (a) random index — expected `O(n log n)` regardless of input; (b) median of the first, middle and last elements — kills the sorted-input case almost always; (c) middle element — cheap and works well in practice. Java's own `Arrays.sort` for primitives uses dual-pivot quicksort, a variant of the same idea.

**In-place, but not stable.** Partitioning only swaps elements inside the same array, so extra space is `O(log n)` for the recursion stack only (no `temp` array). But long-distance swaps destroy the original order of equal elements, so quicksort is **not stable**.

### Formula / rule / table

| Case | Time | When it happens |
|---|---|---|
| Best | `O(n log n)` | every pivot splits the array into two equal halves |
| Average | `O(n log n)` | random-ish data; `log n` levels × `O(n)` partition work |
| Worst | `O(n^2)` | sorted or reverse-sorted input with first/last pivot; one element peeled per level |
| Space | `O(log n)` average, `O(n)` worst | recursion stack depth |
| Stable? | No | swaps jump elements over each other |

**Example question:** Partition `[10, 80, 30, 90, 40, 50, 70]` using the Lomuto scheme with the last element as pivot. State the array afterwards, the pivot's final index, and the two sub-arrays that still need sorting.

**Solution:**

Step 1: `pivot = a[6] = 70`, `i = -1`. Reason: Lomuto always uses the last element and starts the small-region boundary outside the array.
Step 2: `j = 0`, `a[0] = 10 <= 70` → `i = 0`, swap `a[0]` with `a[0]` (no visible change). Reason: 10 belongs to the small side.
Step 3: `j = 1`, `a[1] = 80 > 70` → do nothing, `i` stays 0.
Step 4: `j = 2`, `a[2] = 30 <= 70` → `i = 1`, swap `a[1]` and `a[2]` → `[10, 30, 80, 90, 40, 50, 70]`. Reason: we push the small element to the boundary and the big one takes its place in the "not yet classified" zone.
Step 5: `j = 3`, `a[3] = 90 > 70` → skip.
Step 6: `j = 4`, `a[4] = 40 <= 70` → `i = 2`, swap `a[2]` and `a[4]` → `[10, 30, 40, 90, 80, 50, 70]`.
Step 7: `j = 5`, `a[5] = 50 <= 70` → `i = 3`, swap `a[3]` and `a[5]` → `[10, 30, 40, 50, 80, 90, 70]`.
Step 8: Loop ends at `j = 6`. Swap `a[i+1] = a[4]` with the pivot at `a[6]` → `[10, 30, 40, 50, 70, 90, 80]`. Reason: everything left of `i+1` is `<= 70`, everything right is `> 70`, so the pivot belongs exactly at `i+1`.
Step 9: Pivot index is `4`. Left sub-array `a[0..3] = [10, 30, 40, 50]`, right sub-array `a[5..6] = [90, 80]`.

**Final answer:** array `[10, 30, 40, 50, 70, 90, 80]`, pivot index `4`, sub-arrays `[10, 30, 40, 50]` and `[90, 80]`.

⚠️ **Common trap:** using `<` instead of `<=` in `if (a[j] <= pivot)`. With duplicates, a strict `<` puts all equal elements on the right, which can make the recursion unbalanced and, in the classic Hoare variant, can even loop forever. Second trap: recursing on `p` instead of `p-1`, which gives infinite recursion and a `StackOverflowError`.

## 5.5 Mergesort / quicksort as a first taste of divide and conquer

### Intuition

You have already met recursion (Module 2) as "a function that calls itself on a smaller input". **Divide and conquer (D&C)** is that same idea promoted to a *strategy*: when a problem is too big, cut it into smaller copies of itself, solve the copies, then glue the answers together.

The difference from plain recursion is the third step — the **combine**. Factorial has no combine step: `n! = n × (n-1)!` just wraps the answer. Merge sort has a real combine: the merge. That is what makes it a *paradigm*, not just a recursive formula.

Analogy: organising a wedding. You do not do everything yourself. You split the work — catering to one cousin, decoration to another, invitations to a third — each of them splits their own work further, and at the end you combine all the pieces into one event.

### The idea, step by step

**Step 1 — The three-part template.** Every D&C algorithm answers three questions:

```text
DIVIDE   : how do I cut the input into smaller pieces?
CONQUER  : solve each piece recursively (base case when it is small enough)
COMBINE  : how do I turn the small answers into the big answer?
```

**Step 2 — Merge sort in the template.** Divide: cut at `mid`. Conquer: sort both halves. Combine: merge two sorted arrays — all three steps are substantial. **Step 3 — Quicksort in the template.** Divide: partition around the pivot (this is the *expensive* step). Conquer: sort both parts. Combine: **nothing** — after partitioning, the array is already in place. This is the interesting contrast: quicksort does the hard work *before* recursing, merge sort does it *after*.

**Step 4 — Binary search in the template.** Divide: compare with the middle, discard one half. Conquer: search the surviving half. Combine: nothing, just return the answer up. This is why binary search is `O(log n)` — one branch, not two.

**Step 5 — The cost rule.** If dividing and combining cost `f(n)` and you make `b` recursive calls on inputs of size `n/b`, then `T(n) = b . T(n/b) + f(n)`. For merge sort `T(n) = 2T(n/2) + O(n)`, which expands to `O(n log n)`. For binary search `T(n) = T(n/2) + O(1)`, which expands to `O(log n)`. The number of branches is what decides everything: two branches with linear combine gives `n log n`; one branch with constant combine gives `log n`.

**Step 6 — Where this leads.** In DSA-3 you will meet the same template doing much heavier lifting: closest pair of points, fast multiplication, and above all **dynamic programming**, which is D&C plus a memory of answers already computed (that is the fix for the naive Fibonacci warning in Module 2).

### Formula / rule / table

| Algorithm | Divide | Combine | Branches | Result |
|---|---|---|---|---|
| Merge sort | cut at `mid` | merge two sorted halves | 2 | `O(n log n)` |
| Quicksort | partition around pivot | nothing | 2 | `O(n log n)` average |
| Binary search | compare with `mid` | nothing | 1 | `O(log n)` |
| Naive Fibonacci | `n-1` and `n-2` | add | 2 | `O(2^n)` — the trap |

**Example question:** Merge sort obeys `T(n) = 2 . T(n/2) + c . n` with `T(1) = 1`. Expand it to show `T(n) = O(n log n)`, and state which step of the D&C template the `c . n` term comes from.

**Solution:**

Step 1: Level 0 has one sub-problem of size `n`, cost `c . n`. Reason: that is the merge of the whole array.
Step 2: Level 1 has 2 sub-problems of size `n/2`, each costing `c . n/2`, total `2 × c . n/2 = c . n`. Reason: doubling the count while halving each size keeps the level total constant.
Step 3: Level 2 has 4 sub-problems of size `n/4`, total `4 × c . n/4 = c . n`. Reason: same balance.
Step 4: Level `k` has `2^k` sub-problems of size `n/2^k`, total `c . n`. Reason: by induction from steps 2 and 3.
Step 5: Recursion stops when the sub-problem size reaches 1, i.e. `n/2^k = 1`, so `k = log2 n`. Reason: that is the definition of a logarithm.
Step 6: Total cost `= (number of levels) × (cost per level) = (log2 n + 1) × c . n`. Reason: add the identical level totals.
Step 7: Drop constants and lower-order terms (Module 1) → `O(n log n)`.
Step 8: The `c . n` is the **COMBINE** step, the merge. Reason: merging inspects every element once per level.

**Final answer:** `T(n) = O(n log n)`, and the `c . n` term is the merge — the combine step of divide and conquer.

⚠️ **Common trap:** saying "divide and conquer makes things faster" without checking the combine cost. Splitting a problem in half and then doing `O(n^2)` work to combine gives `O(n^2)`, not `O(n log n)`. D&C only wins when the combine is cheap — linear or better.

## 5.6 The `O(n log n)` lower bound for comparison sorting

### Intuition

Here is a surprising claim: **no comparison-based sort can ever beat `O(n log n)` in the worst case.** Not "we have not found one" — it is impossible. The argument is a counting argument, and it is beautiful.

Think of a guessing game. I have hidden one of 1000 numbers and you may only ask yes/no questions. The best you can do is halve the possibilities each time: 1000 → 500 → 250 → ... → 1, about 10 questions. You can never guarantee finding the number in 5 questions, because 5 yes/no questions can only distinguish `2^5 = 32` possibilities, and there are 1000.

Sorting is that game in disguise.

### The idea, step by step

**Step 1 — A comparison sort only learns by comparing.** Every such algorithm (bubble, selection, insertion, merge, quick, heap) does exactly one kind of thing: compare `a[i]` with `a[j]` and branch on the answer. It never looks at the actual values in any other way.

**Step 2 — Draw the algorithm as a tree.** Each internal node is one comparison with two outcomes ("yes" / "no"). Each leaf is a final arrangement the algorithm might output. This is the **decision tree**.

**Step 3 — The tree must have at least `n!` leaves.** With `n` distinct items there are `n!` possible orderings, and the sort must be able to output the correct one in every case. Different orderings must end at different leaves, otherwise the algorithm would output the same arrangement for two different inputs and be wrong on one of them.

**Step 4 — A tree with `L` leaves has height at least `log2 L`.** Reason: a binary tree of height `h` has at most `2^h` leaves (each level doubles the count at best). So `2^h >= L`, i.e. `h >= log2 L`.

**Step 5 — So the worst-case number of comparisons is at least `log2(n!)`.** Reason: the height *is* the worst-case number of comparisons, since the worst input follows the longest root-to-leaf path.

**Step 6 — `log2(n!)` is about `n log2 n`, so `O(n log n)` is optimal.** For large `n`, `n!` is roughly `(n/e)^n` (Stirling's approximation), so `log2(n!) ≈ n log2 n - 1.44 n`, which is `Theta(n log n)` because the `n log n` term dominates. Every comparison sort therefore needs at least `~n log2 n` comparisons in the worst case, and merge sort and heap sort achieve that bound — which is why they are called asymptotically optimal.

### Formula / rule / table

```text
comparisons_worst_case  >=  log2(n!)  ~  n . log2(n)
```

**Meaning:** `n!` is the number of possible orderings; `log2` of it is the height a binary decision tree needs.
**When to use:** to justify why you cannot do better, and to answer "is merge sort optimal?" — yes, up to constants.
**Tiny example:** `n = 3` gives `3! = 6` orderings, `log2 6 = 2.58`, so at least 3 comparisons are needed. And indeed sorting 3 elements takes 3 comparisons in the worst case.

| `n` | `n!` | `log2(n!)` | Minimum comparisons (rounded up) | `n . log2 n` |
|---|---|---|---|---|
| 3 | 6 | 2.58 | 3 | 4.75 |
| 5 | 120 | 6.91 | 7 | 11.6 |
| 10 | 3628800 | 21.8 | 22 | 33.2 |
| 1000 | huge | 8529.4 | 8530 | 9966 |

Notice `log2(n!)` is always a bit *smaller* than `n log2 n` — both grow the same way, which is all that matters for Big-O.

**Example question:** What is the minimum number of comparisons any comparison sort needs in the worst case to sort 5 distinct elements? And why can it not be done in 5 comparisons?

**Solution:**

Step 1: Number of possible orderings is `5! = 120`. Reason: 5 choices for first position, 4 for second, and so on.
Step 2: Each comparison has 2 outcomes, so `k` comparisons can distinguish at most `2^k` orderings. Reason: each yes/no answer splits the remaining possibilities.
Step 3: We need `2^k >= 120`. Reason: every one of the 120 inputs must reach its own leaf.
Step 4: `2^6 = 64 < 120` and `2^7 = 128 >= 120`. Reason: direct computation.
Step 5: So `k >= 7`, i.e. at least 7 comparisons. Reason: `k` must be an integer, so we round up.
Step 6: With `k = 5` we could only distinguish `2^5 = 32` orderings, which is fewer than 120 — at least 88 orderings would be indistinguishable, so the algorithm would be wrong on some input. Reason: pigeonhole principle.

**Final answer:** at least **7** comparisons; 5 comparisons can separate only 32 of the 120 orderings, so at least two different inputs would be confused.

⚠️ **Common trap:** this bound applies **only to comparison sorts**. Counting sort and radix sort (next section) beat `O(n log n)` precisely because they never compare two elements — they use the *values* as array indices. Saying "no sort can be faster than `n log n`" without the word *comparison* is a mark-losing statement.

## 5.7 Non-comparison sorts — counting sort and radix sort

### Intuition

If you are sorting 1000 exam scripts by marks out of 100, you do not need to compare scripts at all. You make 101 labelled trays (0 to 100), drop each script into its tray, then read the trays in order. No comparisons, one pass over the pile. That is **counting sort**.

**Radix sort** extends the trick to big numbers: sort by the last digit, then the second-last, and so on. After the last pass the whole list is sorted. It works like filing a stack of letters by postcode — you can sort digit by digit.

### The idea, step by step

**Counting sort, step by step.** Input `[4, 2, 2, 8, 3, 3, 1]`, all values in `0..8`.

1. **Count.** `count[v]` = how many times `v` occurs: 1 appears once, 2 twice, 3 twice, 4 once, 8 once.
2. **Prefix sum.** Replace `count[v]` by the number of elements `<= v`, which is where the *last* copy of `v` must end up: values 0..8 give `[0, 1, 3, 5, 6, 6, 6, 6, 7]`.
3. **Place, going backwards.** For `i` from `n-1` down to `0`: write `a[i]` at index `count[a[i]] - 1`, then decrement `count[a[i]]`.

| Step | `i` | `a[i]` | `count[a[i]]` before | Writes to index | `out` (indices 0..6) |
|---|---|---|---|---|---|
| start | — | — | — | — | `_ _ _ _ _ _ _` |
| 1 | 6 | 1 | 1 | 0 | `1 _ _ _ _ _ _` |
| 2 | 5 | 3 | 5 | 4 | `1 _ _ _ 3 _ _` |
| 3 | 4 | 3 | 4 | 3 | `1 _ _ 3 3 _ _` |
| 4 | 3 | 8 | 7 | 6 | `1 _ _ 3 3 _ 8` |
| 5 | 2 | 2 | 3 | 2 | `1 _ 2 3 3 _ 8` |
| 6 | 1 | 2 | 2 | 1 | `1 2 2 3 3 _ 8` |
| 7 | 0 | 4 | 6 | 5 | `1 2 2 3 3 4 8` |

Result `[1, 2, 2, 3, 3, 4, 8]`. Going backwards is not a style choice: it means the *later* copy of a value is placed last, so equal elements keep their original order — counting sort is stable.

```java
import java.util.Arrays;

public class CountingSort {
    static void countingSort(int[] a, int k) {   // every value is between 0 and k
        int[] count = new int[k + 1];
        for (int x : a) count[x]++;                       // 1. count frequencies
        for (int v = 1; v <= k; v++) count[v] += count[v - 1];  // 2. prefix sums
        int[] out = new int[a.length];
        for (int i = a.length - 1; i >= 0; i--) {         // 3. backwards = stable
            out[count[a[i]] - 1] = a[i];
            count[a[i]]--;
        }
        for (int i = 0; i < a.length; i++) a[i] = out[i]; // 4. copy back
    }
    public static void main(String[] args) {
        int[] a = {4, 2, 2, 8, 3, 3, 1};
        countingSort(a, 8);
        System.out.println(Arrays.toString(a));
    }
}
```

What it prints: `[1, 2, 2, 3, 3, 4, 8]`.

**Cost: `O(n + k)` time, `O(n + k)` space.** One pass to count, one pass over the `k+1` counters, one pass to place. Reason for the space: the `count` array of size `k+1` plus the `out` array of size `n`. This is linear only when `k` is comparable to `n`. If `k` is huge — say you sort `[1000000, 2]` — you allocate a million counters to sort two numbers. That is the trap.

**Radix sort.** Sort by the least significant digit, then the next, and so on, using a *stable* counting sort on each digit (base 10, so `k = 9`, cheap). Stability of each pass is essential: it is what preserves the ordering established by earlier digits. Trace on `[170, 45, 75, 90, 802, 24, 2, 66]`:

| Pass | Digit sorted | Array after the pass |
|---|---|---|
| start | — | `[170, 45, 75, 90, 802, 24, 2, 66]` |
| 1 | units | `[170, 90, 802, 2, 24, 45, 75, 66]` |
| 2 | tens | `[802, 2, 24, 45, 66, 170, 75, 90]` |
| 3 | hundreds | `[2, 24, 45, 66, 75, 90, 170, 802]` |

**Cost: `O(d . (n + b))`** where `d` is the number of digits and `b` the base. For fixed-width integers `d` is a constant (at most 10 for `int`), so this is effectively `O(n)`. Space is `O(n + b)`.

**When linear-time sorting is possible:** when the keys are integers (or fixed-length strings) from a known, *small* range, so you can use them as indices. **Limits:** it needs `O(k)` or `O(n + b)` extra memory, it cannot sort arbitrary objects without mapping them to integers, and it is not in-place.

### Formula / rule / table

| Sort | Time | Extra space | Stable | Works on |
|---|---|---|---|---|
| Counting sort | `O(n + k)` | `O(n + k)` | Yes | small non-negative integer keys |
| Radix sort (LSD) | `O(d . (n + b))` | `O(n + b)` | Yes | fixed-width integers / strings |

**Example question:** Sort `[4, 2, 2, 8, 3, 3, 1]` with counting sort. Show the frequency array, the prefix array, and the final output. Then state why this approach would be a bad idea for the input `[1000000, 5]`.

**Solution:**

Step 1: Frequencies over `0..8`: value 1 → 1, 2 → 2, 3 → 2, 4 → 1, 8 → 1, all others 0. Reason: one pass over the array.
Step 2: Prefix sums: `[0, 1, 3, 5, 6, 6, 6, 6, 7]`. Reason: `count[v] += count[v-1]` accumulates how many elements are `<= v`.
Step 3: Place backwards: `1`→index 0, `3`→index 4, `3`→index 3, `8`→index 6, `2`→index 2, `2`→index 1, `4`→index 5. Reason: `count[v]-1` is the last free slot for `v`.
Step 4: Output `[1, 2, 2, 3, 3, 4, 8]`. Reason: fill the slots in index order.
Step 5: For `[1000000, 5]`, `k = 1000000`, so we allocate arrays of a million entries to sort two numbers: time `O(n + k)` is dominated by `k`, and space is a million ints (4 MB) for nothing. Reason: the cost depends on the *range*, not the count.

**Final answer:** output `[1, 2, 2, 3, 3, 4, 8]`; for `[1000000, 5]` counting sort is `O(k) = O(10^6)` time and memory, so a comparison sort (`O(n log n)`, here trivial) is far better.

⚠️ **Common trap:** counting sort does **not** work with negative numbers as written (a negative index crashes), and it silently wastes memory when the key range is large. Also, dropping the `-1` in `count[a[i]] - 1` shifts every element one slot right and corrupts the output — the classic off-by-one here.

## 5.8 Stability and in-place sorting

### Intuition

**Stable** means: if two items are "equal" by the comparison key, they stay in their original relative order. It matters the moment your records have more than one field. Sort a list of students by marks, and two students with 80 marks should stay in roll-number order — a stable sort keeps them that way, an unstable sort may swap them.

**In-place** means: the algorithm rearranges the same array instead of building a second one of size `n`. It matters when memory is tight or the array is huge.

The classic real use of stability is **multi-key sorting by repeated stable sorts**: to sort employees by department, and within each department by salary, you first sort by salary, then **stably** sort by department. Because the second sort is stable, the salary order inside each department survives. Do it the other way round with an unstable sort and the inner order is destroyed.

### The idea, step by step

**Why selection sort is unstable.** Take `[3a, 3b, 2]` where `3a` and `3b` are equal keys in that original order. Selection sort finds the minimum `2` at index 2 and swaps it with index 0, giving `[2, 3b, 3a]`. The two 3s have swapped places. Reason: the long-distance swap jumped `3a` over `3b`.

**Why insertion sort is stable.** It shifts only while `a[j] > key`, strictly greater — an equal element stops the shift, so `key` lands *after* its twin. **Why merge sort is stable.** The merge takes from the left half when `a[i] <= a[j]`, ties included, and left-half elements came earlier. **Why counting sort is stable.** Placing backwards fills each value's slots from the right end, so later copies land later.

**Why quicksort is not.** Partitioning swaps elements across the whole array, exactly like selection sort.

### Formula / rule / table

| Sort | Stable? | In-place? | Best | Average | Worst | Extra space |
|---|---|---|---|---|---|---|
| Bubble | Yes | Yes | `O(n)` | `O(n^2)` | `O(n^2)` | `O(1)` |
| Selection | No | Yes | `O(n^2)` | `O(n^2)` | `O(n^2)` | `O(1)` |
| Insertion | Yes | Yes | `O(n)` | `O(n^2)` | `O(n^2)` | `O(1)` |
| Merge sort | Yes | No | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |
| Quicksort | No | Yes | `O(n log n)` | `O(n log n)` | `O(n^2)` | `O(log n)` stack |
| Counting sort | Yes | No | `O(n + k)` | `O(n + k)` | `O(n + k)` | `O(n + k)` |
| Radix sort | Yes | No | `O(d(n+b))` | `O(d(n+b))` | `O(d(n+b))` | `O(n + b)` |

**Which one when?**

- Need a *guaranteed* `n log n` and stability, memory is fine → **merge sort**.
- Need speed on primitives, average case is what matters, memory is tight → **quicksort**.
- Array is tiny (under ~20) or nearly sorted → **insertion sort**.
- Keys are small non-negative integers → **counting sort**.
- Keys are large integers of fixed width → **radix sort**.
- You must not disturb equal keys → never selection sort or plain quicksort.

**Example question:** You have employee records already sorted by salary. You now want them grouped by department, and inside each department still ordered by salary. Which property of a sort do you need, and which of `selection sort`, `merge sort`, `quicksort` would you pick? Justify.

**Solution:**

Step 1: The operation is "sort by department without destroying the existing salary order". Reason: that is exactly a second-key sort.
Step 2: For the salary order to survive, equal departments must keep their incoming order — so the sort must be **stable**. Reason: stability is defined as preserving the relative order of equal keys.
Step 3: Selection sort is unstable (the `[3a, 3b, 2]` example above), so it can shuffle salaries inside a department. Reject.
Step 4: Plain Lomuto quicksort is unstable for the same reason — long-distance swaps. Reject.
Step 5: Merge sort is stable (the `<=` in the merge) and gives `O(n log n)` guaranteed. Accept.
Step 6: Total cost `O(n log n)` for this second sort. Reason: one merge sort.

**Final answer:** stability is required; choose **merge sort** (or Java's `Arrays.sort` on objects, which is TimSort and stable). Selection sort and plain quicksort can break the salary order inside each department.

⚠️ **Common trap:** "selection sort uses fewer swaps so it is stable" — no. Fewer swaps, still unstable. The other classic: assuming `Arrays.sort(int[])` is stable. It is not, because primitives have no identity to preserve; see 5.9.

## 5.9 Library sort vs implementing one

### Intuition

You will almost never hand-write a sort in a real project — you call `Arrays.sort`. But the library is not one algorithm; it is a *set* of algorithms chosen by type, and knowing which one runs tells you the cost, whether your equal elements survive, and why a `Comparator` bug can crash your program.

### The idea, step by step

**Step 1 — `Arrays.sort(int[])`, `long[]`, `char[]`, `double[]`** use **dual-pivot quicksort**: two pivots, three regions per pass, in-place, average `O(n log n)`, worst `O(n^2)` in theory but engineered so that it is practically never hit. It is **not stable**, and it cannot be — primitives have no identity.

**Step 2 — `Arrays.sort(Object[])` and `Collections.sort(List)`** use **TimSort**: a hybrid of merge sort and insertion sort that finds already-sorted runs and merges them. Guaranteed `O(n log n)` worst case, **stable**, and it needs `O(n)` extra space. This is why sorting an `Integer[]` is slower than sorting an `int[]` — objects, boxing, and a stable merge instead of in-place swaps.

**Step 3 — The practical consequence.** If you need stability with primitives, you must sort an object array (or sort the indices) — for example to sort `int[]` values while keeping the original index of each.

**Step 4 — Why understanding it still matters.** (a) In an interview you will be asked to *implement* merge sort or quicksort — the library is not allowed. (b) You must know the complexity of the call you are making, to reason about your whole algorithm's cost. (c) Comparator bugs: `(a, b) -> a - b` overflows for large ints and silently produces a wrong order; `Integer.compare(a, b)` is the correct form. (d) Knowing that TimSort needs `O(n)` space explains memory complaints in large sorts.

```java
import java.util.*;

public class LibrarySorts {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 6};
        Arrays.sort(a);                       // dual-pivot quicksort, ascending
        System.out.println(Arrays.toString(a));   // [1, 2, 5, 6, 9]
        Integer[] b = {5, 2, 9, 1, 6};
        Arrays.sort(b, Collections.reverseOrder());  // TimSort with a comparator
        System.out.println(Arrays.toString(b));   // [9, 6, 5, 2, 1]
        String[] names = {"Ravi", "Asha", "Meera"};
        Arrays.sort(names);                   // natural (alphabetical) order
        System.out.println(Arrays.toString(names));  // [Asha, Meera, Ravi]
    }
}
```

All three lines are verified: `[1, 2, 5, 6, 9]`, `[9, 6, 5, 2, 1]`, `[Asha, Meera, Ravi]`.

### Formula / rule / table

| Call | Algorithm | Worst case | Stable | Extra space |
|---|---|---|---|---|
| `Arrays.sort(int[])` | dual-pivot quicksort | `O(n^2)` (practically `n log n`) | No | `O(log n)` |
| `Arrays.sort(Object[])` | TimSort | `O(n log n)` | Yes | `O(n)` |
| `Collections.sort(list)` | TimSort | `O(n log n)` | Yes | `O(n)` |

**Example question:** You must sort `int[] marks = {72, 88, 65, 88, 90}` so that the two 88s keep their original positions relative to each other, and you must be able to say what the sort costs. Can `Arrays.sort(int[])` guarantee this? What will you do instead?

**Solution:**

Step 1: `Arrays.sort(int[])` uses dual-pivot quicksort, which is **not stable**. Reason: it swaps elements across long distances.
Step 2: For two equal `88`s there is no visible difference in an `int[]`, so nothing is lost *here* — but the guarantee does not exist. Reason: with primitives, "equal" values are indistinguishable, so stability is meaningless; with records it is not.
Step 3: If the records were objects (say `Student` with `marks` and `rollNo`), you would need stability. Reason: the two students with 88 marks must keep roll-number order.
Step 4: Then you would use `Arrays.sort(Student[], comparator)`, which is TimSort: stable, `O(n log n)` worst case, `O(n)` extra space. Reason: `Object[]` overloads use TimSort.
Step 5: Cost of the primitive version: average `O(n log n)`, `O(log n)` stack. Reason: quicksort's recursion depth.

**Final answer:** `Arrays.sort(int[])` gives no stability guarantee (dual-pivot quicksort); for a guaranteed stable sort use `Arrays.sort` on an object array, which is TimSort with `O(n log n)` worst case and `O(n)` extra space.

⚠️ **Common trap:** writing `Arrays.sort(arr, (x, y) -> y - x)` to sort descending. For large values `y - x` overflows `int` and the comparator returns the wrong sign, which can throw `IllegalArgumentException: Comparison method violates its general contract!` in TimSort. Use `Integer.compare(y, x)`.

## 5.10 Sorting as the enabler of other patterns

### Intuition

Sorting is rarely the answer itself — it is the move that makes the real answer cheap. Once the data is ordered, a whole family of patterns switches on.

### The idea, step by step

**Step 1 — Binary search (Module 4).** Sorted → `O(log n)` lookups. Unsorted → `O(n)`.

**Step 2 — Two pointers from both ends (Module 3).** Pair-sum, three-sum, container-with-most-water, palindrome checks on sorted data.

**Step 3 — Grouping, deduplication and intervals.** Equal keys become adjacent, so "remove duplicates" and "group anagrams (sort each word's letters)" are one scan; and sorting intervals by start time turns merge-intervals and meeting-room counting into a single sweep.

**Step 4 — Greedy scheduling.** Sort by end time, then take every activity that starts after the last chosen end. Sorting is what makes the greedy choice provably right.

**Step 5 — Selection problems.** k-th smallest, median, percentile — sort once and index, or use quickselect (partition, which is 5.4 again).

**Step 6 — In the project engine.** The problem-solving engine from Module 1 keeps a list of candidate solutions; sorting them by cost turns "find the best" into "read index 0", and sorting the task log by timestamp turns "what happened first" into a scan.

### Formula / rule / table

| Problem | Without sorting | With one `O(n log n)` sort |
|---|---|---|
| Two-sum existence | `O(n^2)` | `O(n)` scan |
| Remove duplicates | `O(n^2)` or hash map | `O(n)` adjacent scan |
| Merge intervals | not well defined | `O(n)` sweep after sort |
| k-th smallest | `O(n log n)` or quickselect `O(n)` avg | read `a[k-1]` |
| Activity selection (greedy) | greedy is not correct | greedy is optimal |

**Example question:** Given intervals `[[1,3], [2,6], [8,10], [15,18]]`, merge all overlapping ones and state the cost. Why must you sort first?

**Solution:**

Step 1: Sort by start time: `[[1,3], [2,6], [8,10], [15,18]]` — already sorted here. Cost `O(n log n)`. Reason: without sorting, `[2,6]` might appear before `[1,3]` and overlaps would be missed.
Step 2: Keep `current = [1,3]`. Compare with `[2,6]`: `2 <= 3`, so they overlap; extend `current` to `[1, max(3,6)] = [1,6]`. Reason: overlapping means the next start is inside the current interval.
Step 3: Compare `[1,6]` with `[8,10]`: `8 > 6`, no overlap. Emit `[1,6]`, set `current = [8,10]`.
Step 4: Compare `[8,10]` with `[15,18]`: `15 > 10`, no overlap. Emit `[8,10]`, set `current = [15,18]`.
Step 5: End of list, emit the last one.
Step 6: Each interval is examined once, so the sweep is `O(n)`. Reason: one pass, one comparison per interval.

**Final answer:** `[[1,6], [8,10], [15,18]]`, total `O(n log n)` time (the sort) plus `O(n)` space for the output.

⚠️ **Common trap:** sorting when the question explicitly forbids reordering — for example "return the original indices". Also: sorting inside a loop, which turns an `O(n log n)` algorithm into `O(n^2 log n)`.

## Formula / rule summary table

| Question you are asked | Answer |
|---|---|
| Fastest average comparison sort | quicksort, `O(n log n)` average, in-place, unstable |
| Sort with a guaranteed `n log n` | merge sort (also stable) or heap sort |
| Sort that is stable *and* in-place | insertion sort / bubble sort — but only `O(n^2)` |
| Best sort for nearly sorted data | insertion sort, `O(n)` when the data is already ordered |
| Best sort for small `n` (under ~20) | insertion sort — no recursion overhead, cache friendly |
| Best sort for small integer keys | counting sort, `O(n + k)` |
| Can any comparison sort beat `n log n`? | No — decision-tree lower bound `log2(n!)` |
| Which library call is stable? | `Arrays.sort(Object[])`, `Collections.sort` (TimSort) |
| Which library call is in-place and fastest for primitives? | `Arrays.sort(int[])` (dual-pivot quicksort) |

## Solved examples

**Example 1 (easy) — trace selection sort.** Sort `[7, 3, 9, 4]` using selection sort. Show the array after every swap and count comparisons and swaps.

Step 1: `i = 0`. Scan `a[0..3] = 7, 3, 9, 4`. Smallest is `3` at index 1, so `minIdx = 1`. Reason: we compare 7 with 3, 9, 4 — three comparisons.
Step 2: `minIdx != i`, so swap `a[0]` and `a[1]` → `[3, 7, 9, 4]`. Swap count 1.
Step 3: `i = 1`. Scan `a[1..3] = 7, 9, 4` — two comparisons. Smallest is `4` at index 3, so swap `a[1]` and `a[3]` → `[3, 4, 9, 7]`. Swap count 2.
Step 4: `i = 2`. Scan `a[2..3] = 9, 7` — one comparison. Smallest is `7` at index 3, so swap `a[2]` and `a[3]` → `[3, 4, 7, 9]`. Swap count 3; `i = 3` is the last index, so the outer loop ends.

Comparisons `= 3 + 2 + 1 = 6 = n(n-1)/2` with `n = 4`. Swaps `= 3`.

**Final answer:** `[3, 4, 7, 9]`, 6 comparisons, 3 swaps. Cost `O(n^2)` comparisons, `O(n)` swaps — the swap count is why selection sort is preferred when writing is expensive.

**Example 2 (exam level) — quicksort's worst case, quantified.** Sort `[1, 2, 3, 4, 5, 6]` with Lomuto partitioning and the last element as pivot. Count the total comparisons, name the case, and state the fix.

Step 1: `lo = 0, hi = 5`, `pivot = 6`. Every element is `<= 6`, so all five are swapped forward and `i` ends at 4. Then the pivot swaps into index 5 — it was already there. Comparisons: 5.
Step 2: Recurse on `[1, 2, 3, 4, 5]`, `pivot = 5`. Comparisons: 4. The pivot stays at index 4.
Step 3: Recurse on `[1, 2, 3, 4]`, `pivot = 4` — 3 comparisons. Then 2, then 1, then 0 (a single element needs no comparison).
Step 5: Total `= 5 + 4 + 3 + 2 + 1 = 15 = n(n-1)/2` with `n = 6`. Reason: each partition peels off exactly one element, so the recursion is a chain of depth `n`, not a tree of depth `log n`.
Step 6: This is the **worst case**, `O(n^2)`. Reason: the work is a sum of `n` terms rather than `log n` levels of `n` work.
Step 7: Fix: pick a random index or the median of first/middle/last as pivot, so sorted input no longer produces the degenerate split. Reason: a near-middle pivot splits the array roughly in half, giving `log n` levels.

**Final answer:** 15 comparisons, which is `n(n-1)/2` — the `O(n^2)` worst case, triggered by *already sorted* input with a last-element pivot. The fix is randomised or median-of-three pivot selection.

**Example 3 (exam level) — counting sort versus comparison sort.** You must sort 10 million integers, all between 0 and 1000. Which sort, and what is the cost? Would your answer change if the values were 64-bit timestamps?

Step 1: Range `k = 1000`, tiny compared with `n = 10^7`. Reason: counting sort's cost `O(n + k)` is dominated by `n`.
Step 2: Counting sort: `O(n + k) = O(10^7)` time and `O(n + k)` space ≈ 40 MB for the output plus 4 KB for the counters (`10^7` ints × 4 bytes). A comparison sort would be `O(n log n) ≈ 10^7 × 23 ≈ 2.3 × 10^8` comparisons — roughly 23× more work. Reason: `log2(10^7) ≈ 23.3`.
Step 4: So counting sort wins clearly. Reason: `k << n`, which is exactly when non-comparison sorting pays off.
Step 5: With 64-bit timestamps, `k` is astronomically large, so counting sort's `count` array is impossible — you would need `2^64` counters. Radix sort with base `2^16` still works: `d = 4` passes of `O(n + 65536)`, so `O(4n)` — linear, because a fixed-width key splits into a constant number of digits.

**Final answer:** counting sort, `O(n + k)` time and space — about 23× fewer operations than comparison sorting. For 64-bit timestamps, use radix sort with a fixed number of passes instead; counting sort is impossible because the key range is unbounded.

## Common traps and mistakes

- **Saying "sorting is `O(n log n)`" without qualification.** Bubble/selection/insertion are `O(n^2)`; only merge, heap, quicksort (average) and the library sorts are `O(n log n)`. Related: quicksort is **not** always `O(n log n)` — its worst case is `O(n^2)`, on sorted input with a bad pivot. If the question says "guaranteed", the answer is merge sort or heap sort.
- **Calling quicksort stable or merge sort in-place.** Quicksort's long-distance swaps break ties, and merge sort needs an `O(n)` temp array — "in-place and `O(n log n)`" is impossible for a stable comparison sort of arrays in general.
- **Forgetting to copy the merged `temp` back** in merge sort. The array looks untouched even though the merge logic was perfect.
- **Using `<` instead of `<=` in a merge or in Lomuto.** In the merge it silently destroys stability; in Lomuto with many duplicates it can unbalance the recursion badly. And dropping the lower-bound caveat is just wrong: "no sort can beat `n log n`" is false, "no *comparison* sort can" is true.
- **`(a, b) -> a - b` as a comparator.** Integer overflow gives a wrong sign and TimSort throws `IllegalArgumentException`.

## Quick revision box

- ✅ Sorting costs `O(n log n)` once and then makes binary search `O(log n)`, two-pointer `O(n)`, grouping and interval sweeps trivial. It is the enabler, not the answer.
- ✅ Bubble, selection, insertion are all `O(n^2)` by the `n(n-1)/2` comparison sum. Insertion is `O(n)` on already-sorted data and is the best choice for small or nearly sorted arrays.
- ✅ Merge sort: split at `mid`, sort halves, merge with `<=`. Guaranteed `O(n log n)`, stable, `O(n)` extra space. `log n` levels × `n` merge work.
- ✅ Quicksort: Lomuto partition with the last element as pivot puts the pivot in its final place. Average `O(n log n)`, worst `O(n^2)` on sorted input with a last-element pivot, in-place but unstable, `O(log n)` stack.
- ✅ Divide and conquer = divide + conquer + combine. Quicksort does the work in *divide*; merge sort in *combine*; binary search has one branch, so it is `O(log n)`.
- ✅ The decision-tree argument: `n!` orderings, binary tree of height `h` has at most `2^h` leaves, so `h >= log2(n!) ≈ n log2 n`. Comparison sorting cannot beat `O(n log n)`.
- ✅ Counting sort is `O(n + k)` and radix sort `O(d(n + b))` — linear when the key range is small, both stable, both needing extra memory. `Arrays.sort(int[])` = dual-pivot quicksort, unstable; `Arrays.sort(Object[])` / `Collections.sort` = TimSort, stable, `O(n log n)` worst.

## Practice questions

**Q1 (easy).** Sort `[4, 1, 3, 2]` with insertion sort. Show the array after each outer-loop iteration and the total number of shifts.

**Q2 (easy).** Give the best, average and worst case of bubble sort with the early-exit flag, with a one-line reason for each.

**Q3 (medium).** `[9, 4, 7, 2, 6]` is partitioned once with Lomuto using the last element as pivot. Give the array afterwards and the pivot's index.

**Q4 (medium).** Explain why selection sort is not stable, using the array `[3a, 3b, 2]`.

**Q5 (medium-hard).** Sort `[21, 12, 33, 4]` with counting sort using key range `k = 33`. Give the prefix array and the output. What is the time and space cost, and why is it wasteful here?

## Answers

**A1.** Start `[4, 1, 3, 2]`. `i=1`, `key=1`: shift `4` → `[1, 4, 3, 2]` (1 shift). `i=2`, `key=3`: shift `4` → `[1, 3, 4, 2]` (1 shift). `i=3`, `key=2`: shift `4` then `3` → `[1, 2, 3, 4]` (2 shifts). **Final answer: `[1, 2, 3, 4]`, 4 shifts total.**

**A2.** Best `O(n)`: the array is already sorted, so the first pass makes zero swaps and the flag ends it. Average `O(n^2)`: about half of the `n(n-1)/2` pairs are out of order, and each out-of-order pair is swapped once. Worst `O(n^2)`: reverse-sorted input makes every comparison swap, and the flag never fires early.

**A3.** `pivot = 6`, `i = -1`. `9 > 6` skip; `4 <= 6` → `i=0`, swap `a[0],a[1]` → `[4, 9, 7, 2, 6]`; `7 > 6` skip; `2 <= 6` → `i=1`, swap `a[1],a[3]` → `[4, 2, 7, 9, 6]`. Then swap `a[i+1] = a[2]` with the pivot `a[4]` → `[4, 2, 6, 9, 7]`. **Final answer: `[4, 2, 6, 9, 7]`, pivot index 2.**

**A4.** `i = 0` finds the minimum `2` at index 2 and swaps it with index 0, giving `[2, 3b, 3a]`. The equal keys `3a` and `3b` have reversed their order, so the sort is unstable. The cause is the long-distance swap, which jumps `3a` over `3b` without any comparison between them.

**A5.** Frequencies: 4 → 1, 12 → 1, 21 → 1, 33 → 1. Prefix array over `0..33` is 0 everywhere except: `count[4]=1`, `count[12]=2`, `count[21]=3`, `count[33]=4` (each is "how many elements `<= v`"). Placing backwards: `4`→index 0, `33`→index 3, `12`→index 1, `21`→index 2. **Final answer: `[4, 12, 21, 33]`; time `O(n + k) = O(37)`, space `O(n + k)` — a 34-entry counter array to sort 4 numbers, so a comparison sort is far cheaper — sorting 4 items needs at most 5 comparisons, against 37 steps here.**
