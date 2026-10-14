# Module 6 — Functional Programming with Collections & Streams

> Beginner-friendly notes covering the Java Collections Framework (`List`, `Set`, `Map`), generics, autoboxing, iteration, functional interfaces, lambda expressions, method references, the Stream API, Collectors, report generation, and reading file lines as a stream — with theory and practical Java examples.

---

## Table of Contents
1. [Java Collections Framework](#1-java-collections-framework)
2. [Common Collection Classes](#2-common-collection-classes)
3. [Generics](#3-generics)
4. [Autoboxing](#4-autoboxing)
5. [Iterating Collections](#5-iterating-collections)
6. [Functional Interfaces](#6-functional-interfaces)
7. [Lambda Expressions](#7-lambda-expressions)
8. [Method References](#8-method-references)
9. [Stream API](#9-stream-api)
10. [Collectors](#10-collectors)
11. [Reports and Summaries](#11-reports-and-summaries)
12. [Reading File Lines as a Stream](#12-reading-file-lines-as-a-stream)
13. [Quick Recap / Cheat Sheet](#quick-recap--cheat-sheet)

---

## 1. Java Collections Framework

Arrays have a **fixed size** and limited features. The **Java Collections Framework** (package `java.util`) provides ready-made, resizable data structures to **store and manipulate groups of objects**.

### 1.1 The three core interfaces

| Interface | Idea | Duplicates? | Order | Typical class |
|---|---|---|---|---|
| `List` | Ordered sequence, accessed by index | **Allowed** | Insertion order kept | `ArrayList` |
| `Set` | Collection of **unique** elements | **Not allowed** | Usually none (depends on class) | `HashSet` |
| `Map` | **Key → value** pairs | Keys unique, values may repeat | Depends on class | `HashMap` |

> **Note:** `Map` is part of the framework but does **not** extend `Collection`. `List` and `Set` do (via `Collection`).

```
Iterable
  └── Collection
        ├── List   (ArrayList, LinkedList)
        ├── Set    (HashSet, LinkedHashSet, TreeSet)
        └── Queue  (...)

Map (HashMap, LinkedHashMap, TreeMap)   <- separate hierarchy
```

### 1.2 Programming to an interface
Declare variables using the **interface** type and create with a concrete class. It makes switching implementations easy.
```java
List<String> names = new ArrayList<>();     // preferred
Set<Integer> ids = new HashSet<>();
Map<String, Integer> ages = new HashMap<>();
```

### 1.3 Imports
```java
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;
// or simply: import java.util.*;
```

---

## 2. Common Collection Classes

### 2.1 `ArrayList`
A **resizable array**. Fast access by index; grows automatically.

#### Adding elements
```java
List<String> fruits = new ArrayList<>();
fruits.add("Apple");              // [Apple]
fruits.add("Banana");             // [Apple, Banana]
fruits.add(1, "Mango");           // insert at index 1 -> [Apple, Mango, Banana]
fruits.addAll(List.of("Fig", "Kiwi"));
```

#### Accessing elements
```java
System.out.println(fruits.get(0));     // Apple
System.out.println(fruits.size());     // 5
System.out.println(fruits.isEmpty());  // false
fruits.set(1, "Grape");                // replace element at index 1
```

#### Removing elements
```java
fruits.remove("Fig");        // remove by value (first match)
fruits.remove(0);            // remove by index
fruits.clear();              // remove everything
```
> **Beginner trap with `List<Integer>`:** `list.remove(1)` removes the element at **index 1**. To remove the **value** 1, use `list.remove(Integer.valueOf(1))`.

#### Searching
```java
List<String> list = new ArrayList<>(List.of("a", "b", "c", "b"));
list.contains("c");        // true
list.indexOf("b");         // 1  (first occurrence)
list.lastIndexOf("b");     // 3
list.indexOf("z");         // -1 (not found)
```

#### Iterating
```java
for (String s : list) {
    System.out.println(s);
}
for (int i = 0; i < list.size(); i++) {
    System.out.println(i + ": " + list.get(i));
}
list.forEach(s -> System.out.println(s));     // functional style (Section 7)
```

**Useful extras:**
```java
Collections.sort(list);                 // sort
Collections.reverse(list);              // reverse
Collections.max(numbers);               // largest
List<String> copy = new ArrayList<>(list);   // copy
List<String> fixed = List.of("x", "y");      // IMMUTABLE list (add() throws UnsupportedOperationException)
```

### 2.2 `HashSet`
Stores **unique** values; **no guaranteed order**. Very fast lookups (on average O(1)).

#### Storing unique values, adding and removing
```java
Set<String> cities = new HashSet<>();
cities.add("Delhi");
cities.add("Mumbai");
cities.add("Delhi");                       // duplicate — ignored
System.out.println(cities.size());         // 2

boolean added = cities.add("Delhi");       // false (already present)
cities.remove("Mumbai");
```

#### Checking membership
```java
System.out.println(cities.contains("Delhi"));   // true
System.out.println(cities.contains("Pune"));    // false
```

**Example — removing duplicates from a list:**
```java
List<Integer> nums = List.of(4, 2, 4, 7, 2, 9);
Set<Integer> unique = new HashSet<>(nums);
System.out.println(unique);      // e.g. [2, 4, 7, 9]  (order not guaranteed)
```

> **Important:** For custom classes stored in a `HashSet` (or used as `HashMap` keys), you must override **`equals()`** and **`hashCode()`**, otherwise duplicates will not be detected correctly.

### 2.3 `HashMap`
Stores **key-value pairs**. Keys are unique; looking up by key is very fast (average O(1)). No guaranteed order.

#### Adding entries and key-value storage
```java
Map<String, Integer> marks = new HashMap<>();
marks.put("Asha", 85);
marks.put("Ravi", 70);
marks.put("Meena", 92);
marks.put("Ravi", 75);          // same key -> value REPLACED (70 -> 75)
System.out.println(marks);      // {Asha=85, Ravi=75, Meena=92} (order may vary)
```

#### Looking up values
```java
System.out.println(marks.get("Asha"));               // 85
System.out.println(marks.get("Zoya"));               // null (key missing)
System.out.println(marks.getOrDefault("Zoya", 0));   // 0
System.out.println(marks.containsKey("Ravi"));       // true
System.out.println(marks.containsValue(92));         // true
```

#### Removing entries
```java
marks.remove("Ravi");
```

#### Useful update methods
```java
marks.putIfAbsent("Kiran", 60);               // add only if key is missing
marks.merge("Asha", 5, Integer::sum);          // add 5 to existing value -> 90
marks.computeIfAbsent("Neha", k -> 88);        // compute if missing
```

**Example — counting word frequency:**
```java
String[] words = {"java", "is", "fun", "java", "is", "great", "java"};
Map<String, Integer> freq = new HashMap<>();
for (String w : words) {
    freq.put(w, freq.getOrDefault(w, 0) + 1);
}
System.out.println(freq);    // {java=3, is=2, fun=1, great=1}
```

#### Iterating through entries
```java
// 1) entrySet() — key and value together (best)
for (Map.Entry<String, Integer> e : marks.entrySet()) {
    System.out.println(e.getKey() + " -> " + e.getValue());
}

// 2) keySet() — keys only
for (String name : marks.keySet()) { ... }

// 3) values() — values only
for (int m : marks.values()) { ... }

// 4) forEach with lambda
marks.forEach((name, score) -> System.out.println(name + " = " + score));
```

### 2.4 Ordered Collections
`HashSet` and `HashMap` don't promise any order. Java provides variants that **do**:

| Class | Order maintained | Notes |
|---|---|---|
| `LinkedHashSet` | **Insertion order** | Like `HashSet` but predictable |
| `LinkedHashMap` | **Insertion order** | Like `HashMap` but predictable |
| `TreeSet` | **Sorted** (natural or by `Comparator`) | Elements must be comparable |
| `TreeMap` | Sorted by **key** | Keys must be comparable |

```java
Set<String> linked = new LinkedHashSet<>();
linked.add("banana"); linked.add("apple"); linked.add("cherry");
System.out.println(linked);     // [banana, apple, cherry]  (insertion order)

Set<String> sorted = new TreeSet<>(linked);
System.out.println(sorted);     // [apple, banana, cherry]  (alphabetical)

Map<String, Integer> tree = new TreeMap<>();
tree.put("Meena", 92); tree.put("Asha", 85); tree.put("Ravi", 70);
System.out.println(tree);       // {Asha=85, Meena=92, Ravi=70}  (sorted by key)

TreeMap<String, Integer> tm = new TreeMap<>(tree);
tm.firstKey();      // Asha
tm.lastKey();       // Ravi
```
**Trade-off:** ordered versions give predictability; `TreeSet`/`TreeMap` take O(log n) per operation, `HashSet`/`HashMap` average O(1).

---

## 3. Generics

**Generics** let you write classes, interfaces and methods that work with **types as parameters**, written inside angle brackets `<>`.

### 3.1 Typed collections — `List<String>`
```java
List<String> names = new ArrayList<>();    // a list that holds ONLY Strings
names.add("Asha");
String first = names.get(0);                // no cast needed
```

### 3.2 Type safety and compile-time error detection
**Without generics (old raw types):**
```java
List list = new ArrayList();
list.add("Hello");
list.add(42);                       // allowed — anything goes!
String s = (String) list.get(1);    // compiles, but ClassCastException at RUNTIME
```

**With generics:**
```java
List<String> list = new ArrayList<>();
list.add("Hello");
list.add(42);       // COMPILE ERROR — caught immediately, before the program runs
```
Generic errors are detected at **compile time**, not at runtime — far easier to fix.

### 3.3 Reducing unnecessary type casting
```java
// Raw type — cast required every time
String s = (String) rawList.get(0);

// Generic — the compiler already knows the type
String s = typedList.get(0);
```

### 3.4 Diamond operator `<>`
The compiler infers the type on the right side:
```java
Map<String, List<Integer>> data = new HashMap<>();   // no need to repeat types
```

### 3.5 Writing your own generic class and method
```java
class Box<T> {
    private T item;
    Box(T item) { this.item = item; }
    T get() { return item; }
}

Box<String> b1 = new Box<>("Hello");
Box<Integer> b2 = new Box<>(100);
String s = b1.get();       // String, no cast

static <T> void printAll(List<T> items) {      // generic method
    for (T item : items) {
        System.out.println(item);
    }
}
```
Common type-parameter names: `T` (type), `E` (element), `K` (key), `V` (value).

> **Limitation:** Generics work only with **objects**, not primitives. `List<int>` is **invalid**; use `List<Integer>` (see Autoboxing next).

---

## 4. Autoboxing

Collections store **objects**, but Java also has **primitive** types. Each primitive has a matching **wrapper class**.

### 4.1 Primitive types and wrapper classes

| Primitive | Wrapper |
|---|---|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

### 4.2 Automatic conversion
- **Autoboxing:** primitive → wrapper (done automatically).
- **Unboxing:** wrapper → primitive (done automatically).

```java
Integer boxed = 5;        // autoboxing: int -> Integer
int plain = boxed;        // unboxing:   Integer -> int

Double d = 3.14;          // double <-> Double
double dp = d;

Boolean flag = true;      // boolean <-> Boolean
boolean f = flag;
```

**In collections (very common):**
```java
List<Integer> nums = new ArrayList<>();
nums.add(10);             // int 10 is autoboxed to Integer
nums.add(20);
int first = nums.get(0);  // Integer unboxed to int
int total = 0;
for (int n : nums) {      // unboxing in the loop
    total += n;
}
```

### 4.3 Things to watch out for
**1) `null` unboxing causes `NullPointerException`:**
```java
Map<String, Integer> m = new HashMap<>();
int x = m.get("missing");     // m.get() returns null -> NPE when unboxing
```
Use `getOrDefault("missing", 0)`.

**2) Compare wrapper objects with `equals()`, not `==`:**
```java
Integer a = 127, b = 127;
System.out.println(a == b);       // true  (small values are cached)
Integer c = 1000, d = 1000;
System.out.println(c == d);       // false (different objects!)
System.out.println(c.equals(d));  // true
```

**3) Performance:** boxing creates objects, so heavy numeric loops are slower with `Integer` than `int`.

**Useful wrapper methods:**
```java
Integer.parseInt("42");          // String -> int
Integer.valueOf(42);             // int -> Integer
Integer.MAX_VALUE;
Double.parseDouble("3.5");
Integer.compare(3, 5);           // -1
Integer.sum(2, 3);               // 5
```

---

## 5. Iterating Collections

### 5.1 For-Each loop
The simplest way to traverse any `Iterable` (list, set, map's `keySet()`, etc.).
```java
List<String> names = List.of("Asha", "Ravi", "Meena");
for (String name : names) {
    System.out.println(name);
}
```
**Limitation:** you **cannot safely add/remove** elements of the collection while looping.
```java
List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4));
for (int n : nums) {
    if (n % 2 == 0) {
        nums.remove(Integer.valueOf(n));   // ConcurrentModificationException!
    }
}
```

### 5.2 Iterators
An **`Iterator`** is an object that walks through a collection element by element.

**Main methods:**
- `hasNext()` — is there another element?
- `next()` — returns the next element
- `remove()` — removes the **last element returned by `next()`** (safe!)

```java
import java.util.Iterator;

List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
Iterator<Integer> it = nums.iterator();
while (it.hasNext()) {
    int n = it.next();
    if (n % 2 == 0) {
        it.remove();               // safe removal during traversal
    }
}
System.out.println(nums);          // [1, 3, 5]
```
**Traversing safely:** modifying a collection through the collection itself (`list.remove(...)`) during iteration causes `ConcurrentModificationException`; modifying through the **iterator's `remove()`** is safe.

**Simpler alternative:** `removeIf` with a condition:
```java
nums.removeIf(n -> n % 2 == 0);
```

**Iterating a `Set`/`Map`:**
```java
Iterator<Map.Entry<String, Integer>> it2 = marks.entrySet().iterator();
while (it2.hasNext()) {
    Map.Entry<String, Integer> e = it2.next();
    if (e.getValue() < 40) it2.remove();
}
```

### 5.3 Declarative processing
So far, our loops are **imperative**: we describe **how** to do the job step by step (create a result list, loop, test, add).

**Declarative / functional style** describes **what** we want, and lets the library handle the loop.

```java
// Imperative — HOW
List<String> result = new ArrayList<>();
for (String name : names) {
    if (name.length() > 4) {
        result.add(name.toUpperCase());
    }
}

// Declarative — WHAT (filter long names, convert to uppercase, collect)
List<String> result2 = names.stream()
        .filter(n -> n.length() > 4)
        .map(String::toUpperCase)
        .collect(Collectors.toList());
```
Benefits: shorter, more readable, easier to chain, easier to run in parallel. To write this style we need **functional interfaces**, **lambdas**, **method references** and **streams** — covered next.

---

## 6. Functional Interfaces

A **functional interface** is an interface with **exactly one abstract method**. It can be implemented using a **lambda expression**. This lets you **pass behavior (code) as a parameter**, just like data.

```java
@FunctionalInterface
interface Greeter {
    void greet(String name);      // single abstract method
}

Greeter g = name -> System.out.println("Hello, " + name);
g.greet("Asha");                  // Hello, Asha
```
`@FunctionalInterface` is optional but makes the compiler check that there is only one abstract method. (Default/static methods don't count.)

### 6.1 Parameterizing behavior
```java
static void applyToAll(List<Integer> list, Consumer<Integer> action) {
    for (int n : list) {
        action.accept(n);
    }
}

applyToAll(List.of(1, 2, 3), n -> System.out.println(n * n));   // prints 1 4 9
applyToAll(List.of(1, 2, 3), n -> System.out.println(n + 100)); // different behavior, same method
```

### 6.2 Built-in functional interfaces (`java.util.function`)

| Interface | Abstract method | Input → Output | Purpose |
|---|---|---|---|
| `Predicate<T>` | `boolean test(T t)` | `T → boolean` | A condition |
| `Function<T, R>` | `R apply(T t)` | `T → R` | Transform a value |
| `Consumer<T>` | `void accept(T t)` | `T → nothing` | Perform an action |
| `Supplier<T>` | `T get()` | `nothing → T` | Produce a value |
| `Comparator<T>` | `int compare(T a, T b)` | `(T, T) → int` | Custom ordering |

### 6.3 `Predicate<T>` — a condition
```java
Predicate<Integer> isEven = n -> n % 2 == 0;
Predicate<String> isLong = s -> s.length() > 5;

System.out.println(isEven.test(4));        // true
System.out.println(isLong.test("Java"));   // false

// Combining predicates
Predicate<Integer> isPositive = n -> n > 0;
Predicate<Integer> evenAndPositive = isEven.and(isPositive);
Predicate<Integer> odd = isEven.negate();
Predicate<Integer> either = isEven.or(isPositive);

list.removeIf(isEven);     // used by collections too
```

### 6.4 `Function<T, R>` — input to output
```java
Function<String, Integer> length = s -> s.length();
Function<Integer, Integer> square = n -> n * n;

System.out.println(length.apply("Hello"));   // 5
System.out.println(square.apply(6));         // 36

// Chaining
Function<Integer, Integer> addOne = n -> n + 1;
square.andThen(addOne).apply(5);     // square first, then add one -> 26
square.compose(addOne).apply(5);     // add one first, then square -> 36
```
Related: `BiFunction<T, U, R>` (two inputs), `UnaryOperator<T>` (T → T), `BinaryOperator<T>` ((T, T) → T).

### 6.5 `Consumer<T>` — perform an action
```java
Consumer<String> printer = s -> System.out.println("Name: " + s);
printer.accept("Asha");

Consumer<String> shout = s -> System.out.println(s.toUpperCase());
printer.andThen(shout).accept("ravi");     // runs both actions in order

names.forEach(printer);                     // forEach takes a Consumer
```

### 6.6 `Supplier<T>` — produce a value with no input
```java
Supplier<Double> random = () -> Math.random();
Supplier<String> greeting = () -> "Hello!";
Supplier<List<String>> newList = ArrayList::new;

System.out.println(greeting.get());     // Hello!
```
Used for lazy values, default values and object factories (e.g., `Optional.orElseGet(supplier)`).

### 6.7 `Comparator<T>` — custom ordering
(Covered in Module 5; here as a functional interface.)
```java
Comparator<String> byLength = (a, b) -> Integer.compare(a.length(), b.length());
List<String> words = new ArrayList<>(List.of("banana", "fig", "apple"));
words.sort(byLength);                        // [fig, apple, banana]
words.sort(Comparator.reverseOrder());
words.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));
```

---

## 7. Lambda Expressions

A **lambda expression** is a short, anonymous function — a block of code you can pass around. It provides a concise implementation of a functional interface.

### 7.1 Syntax
```
(parameters) -> expression
(parameters) -> { statements; }
```

| Form | Example |
|---|---|
| No parameters | `() -> System.out.println("Hi")` |
| One parameter (parentheses optional) | `n -> n * 2` |
| Multiple parameters | `(a, b) -> a + b` |
| Explicit types | `(int a, int b) -> a + b` |
| Block body (needs `return` if a value is produced) | `(a, b) -> { int s = a + b; return s; }` |

```java
Runnable r = () -> System.out.println("Running");
Function<Integer, Integer> doubleIt = n -> n * 2;
BinaryOperator<Integer> add = (a, b) -> a + b;
Predicate<String> empty = s -> s.isEmpty();
```
Parameter types are normally **inferred** by the compiler from the context.

### 7.2 Passing behavior as an argument
**Before lambdas (anonymous class — verbose):**
```java
Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
});
```
**With a lambda:**
```java
names.sort((a, b) -> a.length() - b.length());
```

### 7.3 Using lambdas with collections
```java
List<Integer> nums = new ArrayList<>(List.of(5, 8, 12, 3, 20));

nums.forEach(n -> System.out.println(n));          // Consumer
nums.removeIf(n -> n < 6);                          // Predicate -> [8, 12, 20]
nums.replaceAll(n -> n * 2);                        // UnaryOperator -> [16, 24, 40]
nums.sort((a, b) -> b - a);                         // Comparator -> descending

Map<String, Integer> stock = new HashMap<>(Map.of("pen", 10, "book", 0));
stock.forEach((item, qty) -> System.out.println(item + ": " + qty));
stock.computeIfAbsent("ink", k -> 5);
stock.merge("pen", 1, (oldV, newV) -> oldV + newV);
```

### 7.4 Variable capture rule
A lambda can use local variables from the enclosing method, but they must be **final or effectively final** (never reassigned after initialization).
```java
int limit = 10;
Predicate<Integer> over = n -> n > limit;     // OK

int count = 0;
list.forEach(x -> count++);      // COMPILE ERROR — 'count' is modified
```
(Instance and static fields can be modified inside lambdas; local variables cannot.)

---

## 8. Method References

A **method reference** is a shorthand for a lambda that **only calls an existing method**. It uses the `::` operator.

### 8.1 Four kinds

| Kind | Syntax | Equivalent lambda |
|---|---|---|
| Static method | `ClassName::staticMethod` | `x -> ClassName.staticMethod(x)` |
| Instance method of a **particular object** | `object::method` | `x -> object.method(x)` |
| Instance method of an **arbitrary object of a type** | `ClassName::instanceMethod` | `x -> x.instanceMethod()` |
| Constructor | `ClassName::new` | `() -> new ClassName()` |

### 8.2 Examples
```java
List<String> names = List.of("asha", "ravi", "meena");

// 1) Static method reference
names.stream().map(Integer::parseInt) ...            // s -> Integer.parseInt(s)

// 2) Particular object
names.forEach(System.out::println);                  // x -> System.out.println(x)

// 3) Instance method of an arbitrary object of that type
names.stream().map(String::toUpperCase);             // s -> s.toUpperCase()
names.stream().map(String::length);                  // s -> s.length()

// 4) Constructor reference
Supplier<List<String>> sup = ArrayList::new;         // () -> new ArrayList<>()
Function<String, StringBuilder> mk = StringBuilder::new;   // s -> new StringBuilder(s)
```

### 8.3 Simplifying lambdas — before and after
```java
nums.stream().map(n -> Integer.valueOf(n))   ->  nums.stream().map(Integer::valueOf)
words.sort((a, b) -> a.compareTo(b));        ->  words.sort(String::compareTo);
marks.merge("Asha", 5, (a, b) -> a + b);     ->  marks.merge("Asha", 5, Integer::sum);
```
> Use a method reference when it makes the code **clearer**. If the lambda does more than call one method, keep the lambda.

---

## 9. Stream API

A **stream** (`java.util.stream.Stream`) is a sequence of elements that supports **declarative, pipeline-style processing**.

**Key facts:**
- A stream is **not a data structure** — it does not store elements; it carries them from a source through operations.
- Streams **do not modify** the original collection.
- A stream can be consumed **only once**.
- Intermediate operations are **lazy** — nothing happens until a terminal operation runs.

### 9.1 Pipeline structure
```
Source  ->  Intermediate operations (0 or more)  ->  Terminal operation (exactly 1)
list.stream() .filter(...) .map(...) .sorted()      .collect(...) / .count() / .forEach(...)
```

### 9.2 Creating streams

**From collections:**
```java
List<String> names = List.of("Asha", "Ravi", "Meena");
Stream<String> s1 = names.stream();

Set<Integer> set = Set.of(1, 2, 3);
Stream<Integer> s2 = set.stream();

map.entrySet().stream();      // from a Map
map.keySet().stream();
map.values().stream();
```

**From arrays and values:**
```java
Arrays.stream(new int[]{1, 2, 3});
Stream.of("a", "b", "c");
IntStream.range(1, 5);            // 1,2,3,4 (end exclusive)
IntStream.rangeClosed(1, 5);      // 1,2,3,4,5
Stream.iterate(1, x -> x * 2).limit(5);   // 1,2,4,8,16
```

**From file lines:** `Files.lines(path)` (see Section 12).

### 9.3 Intermediate operations
They **transform or filter** data and **return another stream**, so they can be chained.

Sample data used below:
```java
List<Integer> nums = List.of(5, 2, 8, 2, 9, 4, 8, 1);
List<String> words = List.of("banana", "apple", "fig", "apple", "cherry");
```

#### `filter(Predicate)` — keep matching elements
```java
nums.stream().filter(n -> n % 2 == 0)       // 2, 8, 2, 4, 8
words.stream().filter(w -> w.length() > 4)  // banana, apple, apple, cherry
```

#### `map(Function)` — transform each element
```java
nums.stream().map(n -> n * n)                // 25, 4, 64, 4, 81, 16, 64, 1
words.stream().map(String::toUpperCase)      // BANANA, APPLE, ...
words.stream().map(String::length)           // 6, 5, 3, 5, 6
```

#### `sorted()` — sort elements
```java
nums.stream().sorted()                                  // 1, 2, 2, 4, 5, 8, 8, 9
nums.stream().sorted(Comparator.reverseOrder())         // 9, 8, 8, 5, 4, 2, 2, 1
words.stream().sorted(Comparator.comparing(String::length))   // by length
```

#### `distinct()` — remove duplicates (uses `equals()`)
```java
nums.stream().distinct()        // 5, 2, 8, 9, 4, 1
```

#### `limit(n)` — keep the first n elements (and `skip(n)` to skip the first n)
```java
nums.stream().limit(3)          // 5, 2, 8
nums.stream().skip(5)           // 4, 8, 1
```

**Other intermediate operations:** `peek()` (debugging), `flatMap()` (flatten nested collections), `mapToInt()` (turn into an `IntStream`).

### 9.4 Terminal operations
They **produce a result or perform a final action**, and **end** the stream.

#### `forEach(Consumer)` — act on each element
```java
words.stream().forEach(System.out::println);
```

#### `collect(Collector)` — gather results into a collection or other result
```java
List<Integer> evens = nums.stream()
        .filter(n -> n % 2 == 0)
        .collect(Collectors.toList());     // [2, 8, 2, 4, 8]
```
(Java 16+ shortcut: `.toList()` returns an immutable list.)

#### `count()` — number of elements
```java
long howMany = nums.stream().filter(n -> n > 4).count();    // 4
```

#### `reduce()` — combine all elements into one value
```java
int sum = nums.stream().reduce(0, (a, b) -> a + b);   // identity 0, then 5+2+8+2+9+4+8+1 = 39
int sum2 = nums.stream().reduce(0, Integer::sum);     // same, method reference
Optional<Integer> max = nums.stream().reduce(Integer::max);   // Optional[9]
```
`reduce(identity, accumulator)` — `identity` is the starting value and result for an empty stream.

**Other terminal operations:**
```java
nums.stream().anyMatch(n -> n > 8);        // true  (at least one)
nums.stream().allMatch(n -> n > 0);        // true  (every element)
nums.stream().noneMatch(n -> n > 100);     // true  (no element)
nums.stream().findFirst();                 // Optional[5]
nums.stream().min(Integer::compare);       // Optional[1]
nums.stream().max(Integer::compare);       // Optional[9]
nums.stream().mapToInt(Integer::intValue).sum();       // 39
nums.stream().mapToInt(Integer::intValue).average();   // OptionalDouble[4.875]
```
> `Optional` is a container that may or may not hold a value. Use `.get()`, `.orElse(default)`, `.isPresent()` or `.ifPresent(...)`.

### 9.5 Putting a pipeline together
```java
List<String> result = words.stream()
        .filter(w -> w.length() > 3)       // keep words longer than 3
        .map(String::toUpperCase)          // convert to uppercase
        .distinct()                        // remove duplicates
        .sorted()                          // alphabetical order
        .limit(2)                          // first two
        .collect(Collectors.toList());     // gather
System.out.println(result);                // [APPLE, BANANA]
```

**Streams are lazy — nothing runs without a terminal operation:**
```java
words.stream().filter(w -> { System.out.println("checking " + w); return true; });
// Prints NOTHING (no terminal operation)
```

**A stream can be used only once:**
```java
Stream<String> s = words.stream();
s.forEach(System.out::println);
s.forEach(System.out::println);   // IllegalStateException: stream has already been operated upon
```

### 9.6 Imperative vs stream — comparison

| Aspect | Loop (imperative) | Stream (declarative) |
|---|---|---|
| Style | Describe **how** | Describe **what** |
| Mutates variables? | Often (counters, result lists) | No — pipeline of transformations |
| Readability for data pipelines | Longer | Usually shorter and clearer |
| Debugging | Easier to step through | Harder in long chains |
| Best for | Complex control flow, early exits with side effects | Filter / map / group / summarize data |

---

## 10. Collectors

`Collectors` (in `java.util.stream`) provides ready-made recipes used with `collect()` to gather stream elements into lists, sets, maps, groups, counts or strings.

```java
import java.util.stream.Collectors;
```

### 10.1 `toList()` — collect into a list
```java
List<String> upper = names.stream()
        .map(String::toUpperCase)
        .collect(Collectors.toList());
```
Related: `Collectors.toSet()` (unique values), `Collectors.toMap(keyFn, valueFn)`:
```java
Map<String, Integer> nameLength = names.stream()
        .distinct()
        .collect(Collectors.toMap(n -> n, String::length));
```
> `toMap` throws `IllegalStateException` on duplicate keys unless you give a merge function: `toMap(k, v, (a, b) -> a)`.

### 10.2 `groupingBy()` — group elements by a property
Returns a `Map<K, List<T>>`: the key is the group, the value is the list of items in the group.
```java
List<String> words = List.of("apple", "banana", "avocado", "blueberry", "cherry");

Map<Character, List<String>> byFirstLetter = words.stream()
        .collect(Collectors.groupingBy(w -> w.charAt(0)));
System.out.println(byFirstLetter);
// {a=[apple, avocado], b=[banana, blueberry], c=[cherry]}

Map<Integer, List<String>> byLength = words.stream()
        .collect(Collectors.groupingBy(String::length));
// {5=[apple], 6=[banana, cherry], 7=[avocado], 9=[blueberry]}
```

### 10.3 `counting()` — count elements (usually as a downstream collector)
```java
long total = words.stream().collect(Collectors.counting());    // 5

Map<Character, Long> countByLetter = words.stream()
        .collect(Collectors.groupingBy(w -> w.charAt(0), Collectors.counting()));
System.out.println(countByLetter);      // {a=2, b=2, c=1}
```
`groupingBy(classifier, downstreamCollector)` — the second argument says **what to do with each group**.

**Other downstream collectors:**
```java
Collectors.summingInt(Student::getMarks)
Collectors.averagingInt(Student::getMarks)
Collectors.mapping(Student::getName, Collectors.toList())
Collectors.maxBy(Comparator.comparingInt(Student::getMarks))
```

**Sorted result (use `TreeMap`):**
```java
Map<Character, Long> sorted = words.stream()
        .collect(Collectors.groupingBy(w -> w.charAt(0), TreeMap::new, Collectors.counting()));
```

### 10.4 `joining()` — join strings into one result
```java
String csv = words.stream().collect(Collectors.joining(", "));
// apple, banana, avocado, blueberry, cherry

String formatted = words.stream()
        .map(String::toUpperCase)
        .collect(Collectors.joining(", ", "[", "]"));      // delimiter, prefix, suffix
// [APPLE, BANANA, AVOCADO, BLUEBERRY, CHERRY]
```
Works on a stream of **strings** (or `CharSequence`s). Convert other types with `map(String::valueOf)` first.

### 10.5 Collectors summary

| Collector | Result |
|---|---|
| `toList()` | `List<T>` |
| `toSet()` | `Set<T>` |
| `toMap(k, v)` | `Map<K, V>` |
| `groupingBy(f)` | `Map<K, List<T>>` |
| `groupingBy(f, counting())` | `Map<K, Long>` |
| `counting()` | `Long` |
| `joining(sep)` | `String` |
| `summingInt(f)`, `averagingInt(f)` | totals / averages |
| `partitioningBy(predicate)` | `Map<Boolean, List<T>>` (true / false groups) |

---

## 11. Reports and Summaries

Streams and collectors are ideal for turning **raw records** into **summaries and reports**: filter, group, count, total, and print.

### 11.1 Sample data model
```java
class Student {
    private final String name;
    private final String department;
    private final int marks;

    Student(String name, String department, int marks) {
        this.name = name;
        this.department = department;
        this.marks = marks;
    }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public int getMarks() { return marks; }

    @Override
    public String toString() { return name + "(" + department + ", " + marks + ")"; }
}

List<Student> students = List.of(
    new Student("Asha",   "CSE",  85),
    new Student("Ravi",   "ECE",  70),
    new Student("Meena",  "CSE",  92),
    new Student("Kiran",  "ECE",  60),
    new Student("Neha",   "CSE",  78),
    new Student("Arjun",  "MECH", 55)
);
```

### 11.2 Common summaries

**Filtering records and listing names:**
```java
List<String> toppers = students.stream()
        .filter(s -> s.getMarks() >= 80)
        .map(Student::getName)
        .collect(Collectors.toList());              // [Asha, Meena]
```

**Counting records:**
```java
long passed = students.stream().filter(s -> s.getMarks() >= 60).count();   // 5
```

**Grouping records:**
```java
Map<String, List<Student>> byDept = students.stream()
        .collect(Collectors.groupingBy(Student::getDepartment));
```

**Counting per group:**
```java
Map<String, Long> countByDept = students.stream()
        .collect(Collectors.groupingBy(Student::getDepartment, Collectors.counting()));
// {CSE=3, ECE=2, MECH=1}
```

**Average per group:**
```java
Map<String, Double> avgByDept = students.stream()
        .collect(Collectors.groupingBy(Student::getDepartment,
                 Collectors.averagingInt(Student::getMarks)));
// {CSE=85.0, ECE=65.0, MECH=55.0}
```

**Overall statistics:**
```java
IntSummaryStatistics stats = students.stream()
        .mapToInt(Student::getMarks)
        .summaryStatistics();
System.out.println(stats.getMin());       // 55
System.out.println(stats.getMax());       // 92
System.out.println(stats.getAverage());   // 73.33...
System.out.println(stats.getSum());       // 440
System.out.println(stats.getCount());     // 6
```

**Top scorer:**
```java
students.stream()
        .max(Comparator.comparingInt(Student::getMarks))
        .ifPresent(s -> System.out.println("Top: " + s));    // Top: Meena(CSE, 92)
```

**Pass / fail split:**
```java
Map<Boolean, List<Student>> split = students.stream()
        .collect(Collectors.partitioningBy(s -> s.getMarks() >= 60));
```

### 11.3 Generating a simple report
```java
public class ReportDemo {
    public static void main(String[] args) {
        List<Student> students = ...;   // as above

        System.out.println("=== Department Report ===");
        Map<String, List<Student>> byDept = students.stream()
                .collect(Collectors.groupingBy(Student::getDepartment, TreeMap::new, Collectors.toList()));

        byDept.forEach((dept, list) -> {
            double avg = list.stream().mapToInt(Student::getMarks).average().orElse(0);
            String names = list.stream().map(Student::getName).collect(Collectors.joining(", "));
            System.out.printf("%-5s | count: %d | avg: %.1f | %s%n", dept, list.size(), avg, names);
        });

        System.out.println("\nTop 3 students:");
        students.stream()
                .sorted(Comparator.comparingInt(Student::getMarks).reversed())
                .limit(3)
                .forEach(s -> System.out.println(" - " + s.getName() + ": " + s.getMarks()));
    }
}
```
**Output:**
```
=== Department Report ===
CSE   | count: 3 | avg: 85.0 | Asha, Meena, Neha
ECE   | count: 2 | avg: 65.0 | Ravi, Kiran
MECH  | count: 1 | avg: 55.0 | Arjun

Top 3 students:
 - Meena: 92
 - Asha: 85
 - Neha: 78
```
> `printf` format codes: `%s` string, `%d` integer, `%.1f` decimal with 1 place, `%-5s` left-aligned in width 5, `%n` newline.

---

## 12. Reading File Lines as a Stream

`Files.lines(Path)` reads a text file **lazily** as a `Stream<String>` — one element per line — so you can apply stream operations directly to file content.

```java
import java.nio.file.*;
import java.io.IOException;
import java.util.stream.*;
```

### 12.1 Using `Files.lines()` — and handling resources correctly
> **Important:** The stream returned by `Files.lines()` keeps the **file open**. It must be **closed**, so always use **try-with-resources** (Module 5). Also, it throws **`IOException`**.

```java
try (Stream<String> lines = Files.lines(Path.of("notes.txt"))) {
    lines.forEach(System.out::println);
} catch (IOException e) {
    System.out.println("Could not read file: " + e.getMessage());
}
```
Without try-with-resources, the file handle may stay open (resource leak).

### 12.2 Processing file contents with streams

**Count non-blank lines:**
```java
try (Stream<String> lines = Files.lines(Path.of("notes.txt"))) {
    long count = lines.filter(line -> !line.isBlank()).count();
    System.out.println("Non-blank lines: " + count);
}
```

**Total word count:**
```java
long words = lines
        .filter(l -> !l.isBlank())
        .flatMap(l -> Arrays.stream(l.trim().split("\\s+")))
        .count();
```

### 12.3 Filtering, mapping and collecting records
Assume `students.csv` contains:
```
Asha,CSE,85
Ravi,ECE,70
Meena,CSE,92
Kiran,ECE,60
```

```java
static List<Student> loadStudents(Path file) throws IOException {
    try (Stream<String> lines = Files.lines(file)) {
        return lines
                .map(String::trim)                       // clean each line
                .filter(l -> !l.isEmpty())               // skip blank lines
                .map(l -> l.split(","))                  // tokenize -> String[]
                .filter(f -> f.length == 3)              // keep well-formed records only
                .map(f -> new Student(f[0].trim(), f[1].trim(), Integer.parseInt(f[2].trim())))
                .collect(Collectors.toList());           // collect results
    }
}
```
> Remember to **collect inside** the `try` block (or return a list); once the stream is closed, it cannot be used.

**Filtering file records:**
```java
try (Stream<String> lines = Files.lines(Path.of("students.csv"))) {
    List<String> cseRecords = lines
            .filter(l -> l.contains(",CSE,"))
            .collect(Collectors.toList());
}
```

**Mapping file data:**
```java
List<String> names = lines.map(l -> l.split(",")[0]).collect(Collectors.toList());
// [Asha, Ravi, Meena, Kiran]
```

### 12.4 Full example — file to report
```java
public class FileReportDemo {
    public static void main(String[] args) {
        Path file = Path.of("students.csv");

        try (Stream<String> lines = Files.lines(file)) {
            Map<String, Long> countByDept = lines
                    .map(String::trim)
                    .filter(l -> !l.isEmpty())
                    .map(l -> l.split(","))
                    .filter(f -> f.length == 3)
                    .collect(Collectors.groupingBy(f -> f[1].trim(),
                                                   TreeMap::new,
                                                   Collectors.counting()));

            countByDept.forEach((dept, n) ->
                    System.out.println(dept + ": " + n + " student(s)"));

        } catch (NoSuchFileException e) {
            System.out.println("File not found: " + file);
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
    }
}
// Output:
// CSE: 2 student(s)
// ECE: 2 student(s)
```

### 12.5 Cautions
- **Bad data in a stream:** `Integer.parseInt` inside `map()` throws `NumberFormatException` and stops the whole pipeline. For untrusted data, validate first (e.g., with a helper method that returns `Optional`/`null` and is filtered out), or use a normal loop with try-catch per line.
- **`Files.lines()` can throw `UncheckedIOException`** while the stream is being consumed (an I/O error mid-read), in addition to `IOException` when opening.
- **Character encoding:** the default is UTF-8; invalid bytes cause `MalformedInputException`.
- **Pairing with `Files.readAllLines()`:** `readAllLines()` loads **everything** into memory (a `List<String>`), while `Files.lines()` is **lazy** and better for **large files**. You can also call `.stream()` on the list.

---

## Quick Recap / Cheat Sheet

- **Collections Framework:** `List` (ordered, duplicates OK → `ArrayList`), `Set` (unique → `HashSet`), `Map` (key→value → `HashMap`); program to the **interface** (`List<String> x = new ArrayList<>()`)
- **`ArrayList`:** `add`, `get`, `set`, `remove`, `contains`, `indexOf`, `size`; careful with `remove(int)` vs `remove(Object)` for `List<Integer>`
- **`HashSet`:** unique values, `add`/`remove`/`contains`; needs `equals()` + `hashCode()` for custom classes
- **`HashMap`:** `put`, `get`, `getOrDefault`, `containsKey`, `remove`, iterate with `entrySet()`; `merge`/`computeIfAbsent` for updates
- **Ordered variants:** `LinkedHashSet`/`LinkedHashMap` = insertion order; `TreeSet`/`TreeMap` = sorted
- **Generics (`List<String>`):** type safety, no casts, errors caught at **compile time**; no primitives (`List<int>` invalid)
- **Autoboxing:** auto `int↔Integer`, `double↔Double`, `boolean↔Boolean`; beware `null` unboxing (NPE) and `==` on wrapper objects (use `equals()`)
- **Iteration:** for-each (simple, but no modification), `Iterator` (`hasNext`, `next`, `remove` — safe removal), `removeIf`; **declarative** style says *what*, not *how*
- **Functional interfaces** = one abstract method: `Predicate<T>` (T→boolean), `Function<T,R>` (T→R), `Consumer<T>` (T→void), `Supplier<T>` (→T), `Comparator<T>` (T,T→int)
- **Lambda:** `(params) -> expression` or `{ block }`; captured local variables must be **effectively final**
- **Method reference:** `Class::staticMethod`, `object::method`, `Class::instanceMethod`, `Class::new`
- **Streams:** source → **intermediate** (lazy; `filter`, `map`, `sorted`, `distinct`, `limit`) → **terminal** (`forEach`, `collect`, `count`, `reduce`); a stream is used **once** and doesn't change the source
- **Collectors:** `toList()`, `groupingBy()` (+ `counting()` downstream), `joining()`, plus `toSet`, `toMap`, `partitioningBy`, `averagingInt`, `summingInt`
- **Reports:** filter → group → count/average → print with `forEach` and `printf`
- **`Files.lines(path)`:** lazy `Stream<String>` of file lines; **always use try-with-resources**, handle `IOException`, collect results before the stream closes, and validate malformed records

---
