# Module 5 — Strings, Library Algorithms & File I/O


## Table of Contents
1. [String Abstraction in Java](#1-string-abstraction-in-java)
2. [String Operations](#2-string-operations)
3. [Mutable Strings](#3-mutable-strings)
4. [Building and Parsing Text](#4-building-and-parsing-text)
5. [Java Library Algorithms](#5-java-library-algorithms)
6. [Ordering Objects](#6-ordering-objects)
7. [File I/O](#7-file-io)
8. [Quick Recap / Cheat Sheet](#quick-recap--cheat-sheet)

---

## 1. String Abstraction in Java

A **`String`** in Java represents a sequence of characters, such as `"Hello"` or `"Java 21"`. It is **not** a primitive type — it is a **class** (`java.lang.String`), so every string is an **object**.

### 1.1 Creating strings
```java
String s1 = "Hello";                  // string literal (most common)
String s2 = new String("Hello");      // explicit object creation
char[] letters = {'J', 'a', 'v', 'a'};
String s3 = new String(letters);      // from a char array -> "Java"
```

**String literal vs `new String(...)`:**
- Literals are stored in a special area called the **String Pool**. If the same literal appears twice, Java **reuses** the same object.
- `new String("Hello")` always creates a **new object** on the heap, even if the same text exists in the pool.

```java
String a = "Hello";
String b = "Hello";
String c = new String("Hello");

System.out.println(a == b);       // true  -> same object from the pool
System.out.println(a == c);       // false -> c is a separate object
System.out.println(a.equals(c));  // true  -> contents are the same
```

### 1.2 Character representation
Internally, a string is a sequence of `char` values. A `char` is a 16-bit **Unicode** character, so Java strings can hold letters from almost any language and symbols/emojis (some emojis take two `char`s).

```java
char ch = 'A';
System.out.println((int) ch);      // 65  -> Unicode/ASCII code of 'A'
System.out.println((char) 97);     // 'a'

String word = "Java";
// J=0, a=1, v=2, a=3  -> each character has an index starting at 0
```

**Useful `char` utilities (`Character` class):**
```java
Character.isDigit('7');      // true
Character.isLetter('x');     // true
Character.isUpperCase('A');  // true
Character.isWhitespace(' '); // true
Character.toUpperCase('b');  // 'B'
```

### 1.3 String immutability
**Strings are immutable** — once created, the contents of a `String` object can **never be changed**. Methods that seem to "modify" a string actually return a **new** string.

```java
String s = "hello";
s.toUpperCase();                 // returns "HELLO" but result is thrown away
System.out.println(s);           // hello  <- original unchanged

s = s.toUpperCase();             // reassign to capture the new string
System.out.println(s);           // HELLO
```

**Why are strings immutable?**
- **Security** — strings are used for file paths, passwords, network addresses; they must not be altered after validation.
- **String Pool safety** — many variables can share one object without one changing it for the others.
- **Thread safety** — immutable objects can be shared across threads freely.
- **Hashing** — the hash code can be cached, making strings efficient as `HashMap` keys.

> **Beginner trap:** Writing `s.concat("abc");` or `s.trim();` on its own line does **nothing useful**. Always store the returned value.

**Performance warning:** Repeated concatenation in a loop creates many temporary string objects.
```java
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;     // creates a NEW String every iteration — slow!
}
// Better: use StringBuilder (Section 3)
```

---

## 2. String Operations

### 2.1 Basic operations

#### `length()`
Returns the number of characters. (Note: for **strings** it is a **method** with parentheses; for **arrays** it is a field without parentheses.)
```java
String s = "Programming";
System.out.println(s.length());   // 11
```

#### Character indexing — `charAt(index)`
Returns the character at a given index (0-based).
```java
String s = "Java";
System.out.println(s.charAt(0));               // J
System.out.println(s.charAt(s.length() - 1));  // a  (last character)
// s.charAt(4) -> StringIndexOutOfBoundsException
```

**Traversing a string:**
```java
String word = "hello";
for (int i = 0; i < word.length(); i++) {
    System.out.println(i + " -> " + word.charAt(i));
}
```

**Example — count vowels:**
```java
static int countVowels(String text) {
    int count = 0;
    String vowels = "aeiouAEIOU";
    for (int i = 0; i < text.length(); i++) {
        if (vowels.indexOf(text.charAt(i)) != -1) {
            count++;
        }
    }
    return count;
}
// countVowels("Education") -> 5
```

#### `substring()`
Extracts part of a string. The **start index is inclusive**, the **end index is exclusive**.
```java
String s = "Hello, World";
System.out.println(s.substring(7));       // World        (from index 7 to end)
System.out.println(s.substring(0, 5));    // Hello        (index 0 to 4)
System.out.println(s.substring(7, 12));   // World
```
> **Tip:** `s.substring(a, b)` returns a string of length `b - a`.

### 2.2 Concatenation

#### `+` operator
```java
String first = "Ada";
String last = "Lovelace";
String full = first + " " + last;           // "Ada Lovelace"
String msg = "Total: " + 5 + 10;            // "Total: 510"  (left to right, all strings!)
String msg2 = "Total: " + (5 + 10);         // "Total: 15"   (parentheses first)
```

#### `concat()`
```java
String a = "Hello";
String b = a.concat(" World");   // "Hello World"
```
**Difference:** `+` can join strings with any type (it converts them to text automatically) and works with `null` (`"x" + null` gives `"xnull"`), while `concat()` accepts only a `String` and throws `NullPointerException` for `null`.

### 2.3 Comparison

#### `equals()` and `equalsIgnoreCase()`
```java
String a = "Java";
String b = "java";

System.out.println(a.equals(b));             // false (case-sensitive)
System.out.println(a.equalsIgnoreCase(b));   // true
```

#### Understanding `==` vs `equals()`
> **Important:** `==` compares **references** (are they the same object in memory?). `equals()` compares **contents** (do they contain the same characters?).

```java
String x = "hello";
String y = "hello";
String z = new String("hello");

System.out.println(x == y);        // true  (same pooled object)
System.out.println(x == z);        // false (different objects)
System.out.println(x.equals(z));   // true  (same text)
```
**Rule of thumb:** Always use `equals()` to compare strings. Use `==` only to check for `null` (`if (s == null)`).

**Safe comparison with possible `null`:**
```java
String input = null;
// input.equals("yes")  -> NullPointerException
"yes".equals(input);    // false, no exception (put the literal first)
```

#### `compareTo()` (ordering)
Compares two strings **lexicographically** (dictionary order, based on Unicode values). Returns:
- a **negative** number if the first string comes **before** the second,
- **0** if they are equal,
- a **positive** number if the first comes **after**.
```java
"apple".compareTo("banana");   // negative
"banana".compareTo("apple");   // positive
"apple".compareTo("apple");    // 0
```

### 2.4 Case conversion
```java
String s = "Java Programming";
System.out.println(s.toUpperCase());   // JAVA PROGRAMMING
System.out.println(s.toLowerCase());   // java programming
```
**Common use — case-insensitive handling of input:**
```java
String answer = "YeS";
if (answer.toLowerCase().equals("yes")) {
    System.out.println("Confirmed");
}
```

### 2.5 Searching

| Method | Purpose | Returns |
|---|---|---|
| `contains(str)` | Does the string contain the given text? | `boolean` |
| `indexOf(str/char)` | First position of text/char | `int` (index or `-1`) |
| `lastIndexOf(str/char)` | Last position of text/char | `int` (index or `-1`) |
| `startsWith(prefix)` | Does it begin with the prefix? | `boolean` |
| `endsWith(suffix)` | Does it end with the suffix? | `boolean` |

```java
String s = "the quick brown fox jumps over the lazy dog";

System.out.println(s.contains("fox"));        // true
System.out.println(s.indexOf("the"));         // 0   (first occurrence)
System.out.println(s.lastIndexOf("the"));     // 31  (last occurrence)
System.out.println(s.indexOf("cat"));         // -1  (not found)
System.out.println(s.indexOf('o'));           // 12
System.out.println(s.indexOf("o", 13));       // 17  (search starting from index 13)
System.out.println(s.startsWith("the"));      // true
System.out.println(s.endsWith("dog"));        // true
```

**Example — checking a file extension:**
```java
String fileName = "report.pdf";
if (fileName.endsWith(".pdf")) {
    System.out.println("It's a PDF file");
}
String ext = fileName.substring(fileName.lastIndexOf('.') + 1);   // "pdf"
```

### 2.6 Other handy methods
```java
"  hi  ".isEmpty();          // false  (length is not 0)
"".isEmpty();                // true
"   ".isBlank();             // true   (only whitespace; Java 11+)
"banana".replace('a', 'o');  // "bonono"
"banana".replace("an", "AN");// "bANANa"
String.valueOf(123);         // "123"  (convert to string)
"ha".repeat(3);              // "hahaha" (Java 11+)
```

---

## 3. Mutable Strings

Because `String` is immutable, Java provides **`StringBuilder`** and **`StringBuffer`** for strings that you need to **modify in place** (build, edit, reverse, etc.) without creating many throwaway objects.

### 3.1 `StringBuilder`
A **mutable** sequence of characters. Changes happen on the **same object**.

```java
StringBuilder sb = new StringBuilder();          // empty
StringBuilder sb2 = new StringBuilder("Hello");  // starts with "Hello"
```

#### `append()` — add to the end
```java
StringBuilder sb = new StringBuilder("Hello");
sb.append(" ");
sb.append("World");
sb.append('!');
sb.append(2026);
System.out.println(sb);          // Hello World!2026

// Method chaining (each method returns the same builder)
StringBuilder sb3 = new StringBuilder();
sb3.append("a").append("b").append("c");   // "abc"
```

#### `insert(index, value)` — add at a position
```java
StringBuilder sb = new StringBuilder("Hello World");
sb.insert(5, ",");               // "Hello, World"
sb.insert(0, ">> ");             // ">> Hello, World"
```

#### `delete(start, end)` and `deleteCharAt(index)`
`start` is inclusive, `end` is exclusive.
```java
StringBuilder sb = new StringBuilder("Hello, World");
sb.delete(5, 7);                 // removes ", "   -> "HelloWorld"
sb.deleteCharAt(0);              // removes 'H'    -> "elloWorld"
```

#### `reverse()`
```java
StringBuilder sb = new StringBuilder("Java");
sb.reverse();
System.out.println(sb);          // avaJ
```

**Example — palindrome check:**
```java
static boolean isPalindrome(String text) {
    String cleaned = text.toLowerCase();
    String reversed = new StringBuilder(cleaned).reverse().toString();
    return cleaned.equals(reversed);
}
// isPalindrome("Level") -> true
```

#### Other useful `StringBuilder` methods
```java
StringBuilder sb = new StringBuilder("Java");
sb.length();                // 4
sb.charAt(1);               // 'a'
sb.setCharAt(0, 'L');       // "Lava"   (modify a single character)
sb.replace(0, 1, "J");      // "Java"
sb.toString();              // convert back to a normal String
```

> **Important:** To use a `StringBuilder` result as a `String` (e.g., for `equals()` or passing to a method expecting a `String`), call **`toString()`**.

**Example — building text efficiently in a loop:**
```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i);
    if (i < 5) sb.append(", ");
}
System.out.println(sb);   // 1, 2, 3, 4, 5
```

### 3.2 `StringBuffer`
`StringBuffer` is also a **mutable** character sequence and has **the same methods** (`append`, `insert`, `delete`, `reverse`, ...).

```java
StringBuffer buf = new StringBuffer("Hello");
buf.append(" World");
buf.insert(0, ">> ");
buf.reverse();
System.out.println(buf);
```

### 3.3 `String` vs `StringBuilder` vs `StringBuffer`

| Feature | `String` | `StringBuilder` | `StringBuffer` |
|---|---|---|---|
| Mutable? | No (immutable) | Yes | Yes |
| Thread-safe? | Yes (immutable) | **No** | **Yes** (synchronized methods) |
| Speed | Slow for repeated changes | **Fastest** | Slightly slower (due to synchronization) |
| Typical use | Fixed text, constants | Building/editing text in single-threaded code | Mutable text shared between threads |

**Key difference — `StringBuilder` vs `StringBuffer`:** `StringBuffer` methods are **synchronized** (safe when multiple threads use the same object), while `StringBuilder` is not. In everyday code (single thread), prefer **`StringBuilder`** for better performance.

---

## 4. Building and Parsing Text

Real programs constantly **break text apart** (parsing) and **put it together** (building) — reading CSV lines, validating input, formatting output.

### 4.1 `split()` — splitting strings into tokens
`split(regex)` breaks a string into an **array of strings** (tokens) wherever the delimiter matches.

```java
String line = "apple,banana,cherry";
String[] fruits = line.split(",");
for (String f : fruits) {
    System.out.println(f);
}
// apple
// banana
// cherry
System.out.println(fruits.length);   // 3
```

**Splitting on whitespace** (one or more spaces):
```java
String sentence = "Java   is    fun";
String[] words = sentence.split("\\s+");   // ["Java", "is", "fun"]
```

**Special characters need escaping** (the argument is a *regular expression*):
```java
String path = "a.b.c";
path.split(".");      // WRONG: '.' means "any character" -> empty result
path.split("\\.");    // CORRECT -> ["a", "b", "c"]

String data = "x|y|z";
data.split("\\|");    // CORRECT -> ["x", "y", "z"]
```

**Limit parameter** — maximum number of parts:
```java
"a:b:c:d".split(":", 2);   // ["a", "b:c:d"]
```
> **Note:** Trailing empty strings are removed by default: `"a,b,,".split(",")` gives `["a", "b"]`. Use `split(",", -1)` to keep them.

### 4.2 `join()` — joining multiple strings
`String.join(delimiter, elements...)` combines strings with a separator.

```java
String result = String.join("-", "2026", "10", "14");
System.out.println(result);   // 2026-10-14

String[] names = {"Asha", "Ravi", "Meena"};
System.out.println(String.join(", ", names));   // Asha, Ravi, Meena

List<String> list = List.of("a", "b", "c");
System.out.println(String.join("|", list));     // a|b|c
```

### 4.3 Trimming — removing unwanted whitespace
```java
String raw = "   hello world   ";
System.out.println("[" + raw.trim() + "]");    // [hello world]
System.out.println("[" + raw.strip() + "]");   // [hello world] (Java 11+, Unicode-aware)
System.out.println("[" + raw.stripLeading() + "]");   // [hello world   ]
System.out.println("[" + raw.stripTrailing() + "]");  // [   hello world]
```
Trimming only removes whitespace at the **start and end**, not in the middle.

**Typical pattern — always clean user input first:**
```java
String name = userInput.trim();
if (name.isEmpty()) {
    System.out.println("Name cannot be blank");
}
```

### 4.4 Validation — checking input against rules
Validation means confirming that input follows expected rules **before** using it.

**Example — validating a username (3–12 letters/digits only):**
```java
static boolean isValidUsername(String name) {
    if (name == null) return false;
    name = name.trim();
    if (name.length() < 3 || name.length() > 12) return false;
    for (int i = 0; i < name.length(); i++) {
        if (!Character.isLetterOrDigit(name.charAt(i))) {
            return false;
        }
    }
    return true;
}
// isValidUsername("ravi99")   -> true
// isValidUsername("a!")       -> false
```

**Example — checking that a string is a valid integer:**
```java
static boolean isInteger(String text) {
    try {
        Integer.parseInt(text.trim());
        return true;
    } catch (NumberFormatException e) {
        return false;
    }
}
```

**Example — using `matches()` with a simple pattern:**
```java
"12345".matches("\\d+");                       // true  (only digits)
"abc123".matches("[a-zA-Z]+");                 // false
"user@mail.com".matches("[\\w.]+@[\\w.]+\\.\\w+");   // true (basic email shape)
```

**Converting text to numbers:**
```java
int n = Integer.parseInt("42");
double d = Double.parseDouble("3.14");
// Integer.parseInt("abc") -> NumberFormatException
```

### 4.5 Tokenization — processing simple text records
**Tokenization** is breaking a record (a line of text) into individual **fields**, then converting and using them.

**Example — parsing one CSV-style record:**
```java
String record = "101,Asha,85.5";
String[] fields = record.split(",");

int id = Integer.parseInt(fields[0].trim());
String name = fields[1].trim();
double marks = Double.parseDouble(fields[2].trim());

System.out.println(name + " (ID " + id + ") scored " + marks);
// Asha (ID 101) scored 85.5
```

**Example — processing multiple records safely:**
```java
String[] records = {
    "101,Asha,85.5",
    "102,Ravi,not-a-number",
    "103,Meena"                  // missing field
};

for (String rec : records) {
    String[] f = rec.split(",");
    if (f.length != 3) {
        System.out.println("Skipping malformed record: " + rec);
        continue;
    }
    try {
        int id = Integer.parseInt(f[0].trim());
        double marks = Double.parseDouble(f[2].trim());
        System.out.println(id + " " + f[1].trim() + " " + marks);
    } catch (NumberFormatException e) {
        System.out.println("Bad number in record: " + rec);
    }
}
```

**Alternative — `Scanner` for tokenizing:**
```java
Scanner sc = new Scanner("10 20 30");
int total = 0;
while (sc.hasNextInt()) {
    total += sc.nextInt();
}
System.out.println(total);   // 60
```

**Formatting output — `String.format()`:**
```java
String s = String.format("%s scored %.1f (rank %d)", "Asha", 85.456, 2);
// "Asha scored 85.5 (rank 2)"
// %s = string, %d = integer, %.2f = decimal with 2 places, %n = newline
```

---

## 5. Java Library Algorithms

Java ships with ready-made, well-tested algorithms for searching and sorting. Using them is almost always better than writing your own.

> Imports needed: `java.util.Arrays`, `java.util.Collections`, `java.util.List`, `java.util.ArrayList`.

### 5.1 Searching

#### Linear searching
Checks elements **one by one** from the start until the target is found or the end is reached. Works on **any** array/list (sorted or not). Time complexity: **O(n)**.
```java
static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
```

#### Binary searching
Works **only on sorted data**. Repeatedly compares the target with the **middle** element and discards half of the remaining range. Time complexity: **O(log n)** — much faster for large data.

**Manual implementation:**
```java
static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;     // avoids overflow
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;                    // search right half
        } else {
            high = mid - 1;                   // search left half
        }
    }
    return -1;   // not found
}
```

**Tracing** `binarySearch({2, 5, 8, 12, 16, 23, 38}, 23)`:
```
low=0, high=6, mid=3 -> arr[3]=12 < 23 -> low=4
low=4, high=6, mid=5 -> arr[5]=23 == 23 -> found at index 5
```

#### `Arrays.binarySearch()`
```java
int[] nums = {2, 5, 8, 12, 16, 23, 38};   // must be sorted!
int index = Arrays.binarySearch(nums, 23);
System.out.println(index);                 // 5

int missing = Arrays.binarySearch(nums, 10);
System.out.println(missing);               // -4
```
**Return value rules:**
- If found: the **index** of the element.
- If not found: **`-(insertion point) - 1`**, which is always **negative**. Here `10` would be inserted at index 3, so the result is `-(3) - 1 = -4`.
- Check with `if (result >= 0)` for "found".

> **Warning:** If the array is **not sorted**, the result is **undefined**. Always sort first (or be sure it is already sorted).

Works on `String[]`, `double[]`, `char[]`, object arrays, and `Collections.binarySearch(list, key)` for lists.

### 5.2 Sorting

#### `Arrays.sort()`
Sorts an array **in place** (the array itself is modified).
```java
int[] nums = {5, 2, 9, 1, 7};
Arrays.sort(nums);
System.out.println(Arrays.toString(nums));   // [1, 2, 5, 7, 9]

String[] names = {"Ravi", "Asha", "Meena"};
Arrays.sort(names);
System.out.println(Arrays.toString(names));  // [Asha, Meena, Ravi]
```

**Sorting a part of an array:**
```java
int[] a = {9, 8, 7, 6, 5};
Arrays.sort(a, 1, 4);    // sorts indices 1 to 3 only
// [9, 6, 7, 8, 5]
```

**Sorting in descending order** (needs an **object** array, not `int[]`):
```java
Integer[] boxed = {5, 2, 9, 1};
Arrays.sort(boxed, Collections.reverseOrder());
// [9, 5, 2, 1]
```

> **Beginner trap:** `Arrays.toString(arr)` is needed to print an array nicely; `System.out.println(arr)` prints a memory-address-like text such as `[I@1b6d3586`.

#### `Collections.sort()`
Sorts a **`List`** (e.g., `ArrayList`) in place.
```java
List<Integer> marks = new ArrayList<>(List.of(70, 45, 90, 60));
Collections.sort(marks);
System.out.println(marks);        // [45, 60, 70, 90]

Collections.sort(marks, Collections.reverseOrder());
System.out.println(marks);        // [90, 70, 60, 45]

List<String> words = new ArrayList<>(List.of("pear", "apple", "fig"));
Collections.sort(words);          // [apple, fig, pear]
```
> Modern alternative: `list.sort(null)` (natural order) or `list.sort(comparator)`.

#### `Arrays.sort()` vs `Collections.sort()`

| Aspect | `Arrays.sort()` | `Collections.sort()` |
|---|---|---|
| Works on | Arrays (`int[]`, `String[]`, `Object[]`) | `List` collections |
| Primitive support | Yes (`int[]`, `double[]`, ...) | No (lists hold objects) |
| Custom ordering | Yes, for object arrays | Yes |
| Modifies original | Yes | Yes |

**Common workflow — sort then binary search:**
```java
int[] data = {42, 7, 19, 3, 25};
Arrays.sort(data);                           // [3, 7, 19, 25, 42]
int pos = Arrays.binarySearch(data, 25);     // 3
```

**Sorting uses:** primitives use a tuned *Dual-Pivot Quicksort*; objects use *TimSort* (a **stable** sort — equal elements keep their original relative order). Both run in about **O(n log n)**.

---

## 6. Ordering Objects

Sorting numbers and strings is easy because Java already knows their order. For **your own classes** (e.g., `Student`), you must tell Java **how to compare** two objects. There are two ways: **`Comparable`** and **`Comparator`**.

**Without it, this fails:**
```java
List<Student> list = ...;
Collections.sort(list);   // COMPILE ERROR if Student does not implement Comparable
```

We will use this class in the examples:
```java
class Student {
    String name;
    int marks;
    int age;

    Student(String name, int marks, int age) {
        this.name = name;
        this.marks = marks;
        this.age = age;
    }

    @Override
    public String toString() {
        return name + "(" + marks + ", " + age + ")";
    }
}
```

### 6.1 `Comparable` — natural ordering
**Natural ordering** is the *default, single* way objects of a class are ordered. The class implements `Comparable<T>` and defines **`compareTo()`**.

```java
class Student implements Comparable<Student> {
    String name;
    int marks;
    int age;

    Student(String name, int marks, int age) {
        this.name = name;
        this.marks = marks;
        this.age = age;
    }

    @Override
    public int compareTo(Student other) {
        return this.marks - other.marks;     // ascending by marks
    }

    @Override
    public String toString() {
        return name + "(" + marks + ", " + age + ")";
    }
}
```

**`compareTo()` contract** — returns:
- **negative** if `this` should come **before** `other`,
- **zero** if they are considered equal in order,
- **positive** if `this` should come **after** `other`.

**Using it:**
```java
List<Student> students = new ArrayList<>();
students.add(new Student("Asha", 85, 20));
students.add(new Student("Ravi", 70, 22));
students.add(new Student("Meena", 92, 19));

Collections.sort(students);              // uses compareTo()
System.out.println(students);
// [Ravi(70, 22), Asha(85, 20), Meena(92, 19)]

Student[] arr = students.toArray(new Student[0]);
Arrays.sort(arr);                         // also works for arrays
```

> **Safer way to compare numbers:** `this.marks - other.marks` can **overflow** for very large/small values. Prefer `Integer.compare(this.marks, other.marks)`.

**Comparing strings and other types:**
```java
public int compareTo(Student other) {
    return this.name.compareTo(other.name);   // alphabetical by name
}
```

**Descending order:** flip the comparison.
```java
return Integer.compare(other.marks, this.marks);
```

### 6.2 `Comparator` — custom ordering
A **`Comparator<T>`** is a **separate** object that defines an ordering with its **`compare(a, b)`** method. It lets you sort the same class **in many different ways** without changing the class itself.

**Implementing as a named class:**
```java
import java.util.Comparator;

class SortByName implements Comparator<Student> {
    @Override
    public int compare(Student a, Student b) {
        return a.name.compareTo(b.name);
    }
}

class SortByAge implements Comparator<Student> {
    @Override
    public int compare(Student a, Student b) {
        return Integer.compare(a.age, b.age);
    }
}
```

**Using it:**
```java
Collections.sort(students, new SortByName());
Arrays.sort(arr, new SortByAge());
students.sort(new SortByName());         // List's own sort method
```

**Shorter versions: anonymous class and lambda**
```java
// Anonymous class
Collections.sort(students, new Comparator<Student>() {
    @Override
    public int compare(Student a, Student b) {
        return Integer.compare(b.marks, a.marks);   // descending by marks
    }
});

// Lambda expression (concise, preferred in modern Java)
students.sort((a, b) -> Integer.compare(b.marks, a.marks));

// Comparator helper methods
students.sort(Comparator.comparing(s -> s.name));
students.sort(Comparator.comparingInt(s -> s.age));
students.sort(Comparator.comparingInt((Student s) -> s.marks).reversed());
```

**Multi-level sorting** (sort by marks descending, then by name when marks tie):
```java
students.sort((a, b) -> {
    if (a.marks != b.marks) {
        return Integer.compare(b.marks, a.marks);
    }
    return a.name.compareTo(b.name);
});

// Same thing using helper methods
students.sort(Comparator.comparingInt((Student s) -> s.marks).reversed()
                        .thenComparing(s -> s.name));
```

### 6.3 `Comparable` vs `Comparator`

| Feature | `Comparable` | `Comparator` |
|---|---|---|
| Package | `java.lang` | `java.util` |
| Method | `compareTo(T other)` | `compare(T a, T b)` |
| Where defined | **Inside** the class being sorted | **Outside** — separate class/lambda |
| Number of orderings | **One** (natural ordering) | **Many** (as many comparators as you need) |
| Requires changing the class? | Yes | No (useful for classes you can't edit) |
| Used by default in | `Collections.sort(list)`, `Arrays.sort(arr)`, `TreeSet`, `TreeMap` | `Collections.sort(list, cmp)`, `Arrays.sort(arr, cmp)` |

**Choosing the right approach:**
- Use **`Comparable`** when the class has **one obvious natural order** (e.g., `String` alphabetical, `Integer` numeric, a `Student` by roll number).
- Use **`Comparator`** when you need **multiple or flexible orderings** (by name, by age, by marks), or when you **cannot modify** the class.
- You can combine them: give the class a natural order via `Comparable`, and use comparators for alternatives.

---

## 7. File I/O

**File I/O (Input/Output)** lets programs read data from files and write data to files, so information **persists** after the program ends.

### 7.1 Modern Java File APIs: `Path` and `Files`
Since Java 7, the **`java.nio.file`** package provides a cleaner, simpler API than the older `java.io.File` class.

```java
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
```

#### `Path` — represents a file/directory location
```java
Path p1 = Path.of("data.txt");                  // relative path (Java 11+)
Path p2 = Paths.get("folder", "notes.txt");     // folder/notes.txt
Path p3 = Path.of("C:/Users/me/docs/info.txt"); // absolute path

System.out.println(p1.getFileName());   // data.txt
System.out.println(p1.toAbsolutePath()); // full path from the current working directory
System.out.println(p2.getParent());     // folder
```
A `Path` is only a **description** of a location — it doesn't mean the file exists.

#### `Files` — utility class with static methods for file operations
```java
Path file = Path.of("data.txt");

Files.exists(file);                  // does it exist?
Files.notExists(file);
Files.isDirectory(file);
Files.size(file);                    // size in bytes (throws IOException if missing)
Files.createFile(file);              // create empty file
Files.createDirectories(Path.of("out/reports"));   // create folders
Files.copy(src, dest);               // copy a file
Files.move(src, dest);               // move/rename
Files.delete(file);                  // delete (throws if missing)
Files.deleteIfExists(file);          // delete only if present
```
Most `Files` methods throw **`IOException`** (a *checked exception*), so you must either wrap them in `try-catch` or declare `throws IOException`.

### 7.2 Reading Text Files

#### Reading the complete file at once
```java
import java.io.IOException;
import java.util.List;

public class ReadDemo {
    public static void main(String[] args) {
        Path file = Path.of("notes.txt");
        try {
            String content = Files.readString(file);           // whole file as ONE String (Java 11+)
            System.out.println(content);

            List<String> lines = Files.readAllLines(file);     // each line as an element
            for (String line : lines) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Could not read file: " + e.getMessage());
        }
    }
}
```
**When to use:** small/medium files. For **huge files**, reading everything into memory can cause `OutOfMemoryError` — use line-by-line reading instead.

#### Reading line by line (streaming)
```java
try (Stream<String> lines = Files.lines(Path.of("notes.txt"))) {
    lines.forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}
// needs: import java.util.stream.Stream;
```

#### Processing file contents
**Example — count lines and words, find the longest line:**
```java
static void analyze(Path file) throws IOException {
    List<String> lines = Files.readAllLines(file);
    int wordCount = 0;
    String longest = "";

    for (String line : lines) {
        if (!line.isBlank()) {
            wordCount += line.trim().split("\\s+").length;
        }
        if (line.length() > longest.length()) {
            longest = line;
        }
    }
    System.out.println("Lines: " + lines.size());
    System.out.println("Words: " + wordCount);
    System.out.println("Longest line: " + longest);
}
```

### 7.3 Writing Text Files

#### Creating files and writing text
```java
Path out = Path.of("output.txt");

// Write a whole string (creates the file if missing, OVERWRITES if it exists)
Files.writeString(out, "Hello, file!\nSecond line\n");

// Write a list of lines
List<String> lines = List.of("Line 1", "Line 2", "Line 3");
Files.write(out, lines);
```
> **Warning:** By default, writing **replaces** existing content (`CREATE` + `TRUNCATE_EXISTING`).

#### Appending data
Use `StandardOpenOption.APPEND` (together with `CREATE` so it works even when the file doesn't exist yet).
```java
import java.nio.file.StandardOpenOption;

Files.writeString(
    Path.of("log.txt"),
    "New log entry\n",
    StandardOpenOption.CREATE, StandardOpenOption.APPEND
);
```
| Option | Meaning |
|---|---|
| `CREATE` | Create the file if it doesn't exist |
| `CREATE_NEW` | Create the file, **fail** if it already exists |
| `APPEND` | Add to the end instead of overwriting |
| `TRUNCATE_EXISTING` | Clear the file first (default when writing) |

### 7.4 Buffered I/O
**Buffering** means data is read/written in **larger chunks** through a memory buffer instead of one character/byte at a time, which greatly reduces the number of slow disk operations.

#### `BufferedReader` — efficient line-by-line reading
```java
import java.io.BufferedReader;

try (BufferedReader reader = Files.newBufferedReader(Path.of("notes.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {     // null means end of file
        System.out.println(line);
    }
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```
`readLine()` returns one line at a time (without the newline) and **`null`** at the end of the file.

#### `BufferedWriter` — efficient writing
```java
import java.io.BufferedWriter;

try (BufferedWriter writer = Files.newBufferedWriter(Path.of("out.txt"))) {
    writer.write("First line");
    writer.newLine();                // platform-independent line break
    writer.write("Second line");
    writer.newLine();
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}

// Append mode
try (BufferedWriter writer = Files.newBufferedWriter(
        Path.of("out.txt"), StandardOpenOption.CREATE, StandardOpenOption.APPEND)) {
    writer.write("Appended line");
    writer.newLine();
}
```

**Efficient text processing — copy a file, converting each line to uppercase:**
```java
static void copyUppercase(Path src, Path dest) throws IOException {
    try (BufferedReader in = Files.newBufferedReader(src);
         BufferedWriter out = Files.newBufferedWriter(dest)) {
        String line;
        while ((line = in.readLine()) != null) {
            out.write(line.toUpperCase());
            out.newLine();
        }
    }
}
```

**Older-style equivalents** (you may see them in other code):
```java
new BufferedReader(new FileReader("notes.txt"));
new BufferedWriter(new FileWriter("out.txt"));
new PrintWriter("out.txt");   // has println(), printf()
```

### 7.5 File Handling

#### Handling missing files
```java
Path file = Path.of("students.txt");

if (Files.notExists(file)) {
    System.out.println("File not found: " + file);
    return;
}
```
Or catch the specific exception:
```java
try {
    List<String> lines = Files.readAllLines(file);
} catch (NoSuchFileException e) {
    System.out.println("File does not exist: " + e.getFile());
} catch (IOException e) {
    System.out.println("I/O problem: " + e.getMessage());
}
// NoSuchFileException is a subclass of IOException -> catch it FIRST
```

**Exception hierarchy to remember:**
```
Exception
  └── IOException
        ├── FileNotFoundException   (java.io: FileReader, Scanner(File), etc.)
        └── NoSuchFileException     (java.nio.file: Files.*)
```

#### Handling malformed records
Real files often contain bad lines: blank lines, missing fields, wrong data types. A robust program **skips or reports** them instead of crashing.

#### Validating file data — full example
Assume `students.txt` contains:
```
101,Asha,85
102,Ravi,seventy
103,Meena
,Kiran,60

104,Neha,92
```
```java
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class StudentLoader {

    static class Student {
        int id; String name; int marks;
        Student(int id, String name, int marks) {
            this.id = id; this.name = name; this.marks = marks;
        }
        public String toString() { return id + " " + name + " " + marks; }
    }

    static Student parseLine(String line, int lineNo) {
        if (line.isBlank()) {
            System.out.println("Line " + lineNo + ": blank, skipped");
            return null;
        }
        String[] f = line.split(",");
        if (f.length != 3) {
            System.out.println("Line " + lineNo + ": expected 3 fields, found " + f.length);
            return null;
        }
        try {
            int id = Integer.parseInt(f[0].trim());
            String name = f[1].trim();
            int marks = Integer.parseInt(f[2].trim());
            if (name.isEmpty()) {
                System.out.println("Line " + lineNo + ": empty name");
                return null;
            }
            if (marks < 0 || marks > 100) {
                System.out.println("Line " + lineNo + ": marks out of range (0-100)");
                return null;
            }
            return new Student(id, name, marks);
        } catch (NumberFormatException e) {
            System.out.println("Line " + lineNo + ": invalid number -> " + line);
            return null;
        }
    }

    public static void main(String[] args) {
        Path file = Path.of("students.txt");
        List<Student> valid = new ArrayList<>();

        try (BufferedReader reader = Files.newBufferedReader(file)) {
            String line;
            int lineNo = 0;
            while ((line = reader.readLine()) != null) {
                lineNo++;
                Student s = parseLine(line, lineNo);
                if (s != null) valid.add(s);
            }
        } catch (NoSuchFileException e) {
            System.out.println("File not found: " + file);
            return;
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
            return;
        }

        System.out.println("\nValid records:");
        valid.forEach(System.out::println);
    }
}
```
**Output:**
```
Line 2: invalid number -> 102,Ravi,seventy
Line 3: expected 3 fields, found 2
Line 4: empty name
Line 5: blank, skipped

Valid records:
101 Asha 85
104 Neha 92
```

**Validation checklist for file data:**
- Does the file exist and is it readable?
- Is the line blank or a comment?
- Does it have the **expected number of fields**?
- Can each field be **converted** to the expected type?
- Are the values in the **valid range** (e.g., marks 0–100)?
- Report the **line number** of problems to make debugging easy.

### 7.6 Try-with-Resources
Files, readers and writers are **resources** that must be **closed** after use; otherwise, data may not be fully written, and the operating system's file handles can leak.

#### The old way — `try-finally` (verbose and error-prone)
```java
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("notes.txt"));
    System.out.println(reader.readLine());
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### The modern way — **try-with-resources**
Resources declared in the parentheses after `try` are **closed automatically**, in **reverse order** of declaration, whether the block ends normally or because of an exception.
```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("notes.txt"))) {
    System.out.println(reader.readLine());
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
// reader.close() is called automatically here
```

**Multiple resources** — separate with semicolons:
```java
try (BufferedReader in = Files.newBufferedReader(Path.of("in.txt"));
     BufferedWriter out = Files.newBufferedWriter(Path.of("out.txt"))) {
    String line;
    while ((line = in.readLine()) != null) {
        out.write(line);
        out.newLine();
    }
}
// out is closed first, then in
```

**Rules:**
- The resource type must implement **`AutoCloseable`** (or `Closeable`). Readers, writers, `Scanner`, streams, and `Files.lines()` results all do.
- The resource variables are **implicitly `final`** and only visible inside the `try` block.
- A `catch` or `finally` block is **optional** (but checked exceptions like `IOException` must still be handled or declared).
- If both the body and `close()` throw exceptions, the body's exception is the main one and the `close()` exception is recorded as a **suppressed exception** (`e.getSuppressed()`).

**Your own resource:**
```java
class Connection implements AutoCloseable {
    Connection() { System.out.println("Opened"); }
    void send(String msg) { System.out.println("Sent: " + msg); }
    @Override
    public void close() { System.out.println("Closed"); }
}

try (Connection c = new Connection()) {
    c.send("Hello");
}
// Output:
// Opened
// Sent: Hello
// Closed
```

**Why prefer it?** Less code, no forgotten `close()`, correct behaviour even when exceptions occur.

---

## Quick Recap / Cheat Sheet

- **`String`** is an **immutable object**; literals live in the **String Pool**; methods like `toUpperCase()`, `trim()`, `concat()` **return new strings** — always store the result
- **`==`** compares references; **`equals()`** compares contents (`equalsIgnoreCase()` ignores case); `compareTo()` gives dictionary ordering
- **Basic methods:** `length()`, `charAt(i)`, `substring(start, endExclusive)`, `toUpperCase()`, `toLowerCase()`
- **Searching in strings:** `contains()`, `indexOf()`, `lastIndexOf()`, `startsWith()`, `endsWith()` (`-1` means not found)
- **`StringBuilder`**: mutable, fast, single-threaded → `append()`, `insert()`, `delete()`, `reverse()`, `toString()`; **`StringBuffer`**: same API but **thread-safe (synchronized)** and slightly slower
- **Parsing text:** `split(regex)` → array of tokens (escape special chars like `\\.` and `\\|`), `String.join(sep, items)`, `trim()`/`strip()`, `Integer.parseInt()` with `NumberFormatException` handling
- **Validation:** check null/blank, length, allowed characters, numeric range; tokenize records into fields and verify field counts
- **Linear search:** O(n), any data; **binary search:** O(log n), **sorted data only**; `Arrays.binarySearch()` returns index if found, else `-(insertionPoint) - 1`
- **Sorting:** `Arrays.sort(array)` for arrays, `Collections.sort(list)` for lists; both sort in place (~O(n log n))
- **`Comparable`** (`compareTo`) = one **natural** ordering defined **inside** the class; **`Comparator`** (`compare`) = **custom/multiple** orderings defined **outside** the class (lambdas and `Comparator.comparing(...)` make it concise)
- **File APIs:** `Path.of(...)` describes a location; `Files` has static methods (`exists`, `readString`, `readAllLines`, `lines`, `writeString`, `write`, `newBufferedReader`, `newBufferedWriter`)
- **Writing:** default **overwrites**; use `StandardOpenOption.CREATE, APPEND` to **append**
- **Buffered I/O** (`BufferedReader.readLine()` returns `null` at end-of-file; `BufferedWriter.write()` + `newLine()`) reduces slow disk access
- **Robust file handling:** check/catch missing files (`NoSuchFileException` before `IOException`), skip and report malformed lines, validate field count, type, and range
- **Try-with-resources:** `try (Resource r = ...) { ... }` auto-closes `AutoCloseable` resources in reverse order — always prefer it over manual `finally { close(); }`

---