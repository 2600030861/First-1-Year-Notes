# Java Programming — 1st Year Syllabus
---

# Quick Module Summary

| Module       | Main Topics                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Module 1** | Problem solving, algorithms, flowcharts, Java basics, data types, variables, operators, type casting, expressions, console I/O |
| **Module 2** | Conditional statements, switch, loops, loop control, nested loops                                                              |
| **Module 3** | Methods, parameters, return values, overloading, recursion, 1D arrays, 2D arrays, matrix operations                            |
| **Module 4** | OOP, classes, objects, constructors, encapsulation, static members, inheritance, interfaces, overriding, exceptions            |
| **Module 5** | Strings, StringBuilder, StringBuffer, parsing, searching, sorting, Comparable, Comparator, file I/O                            |
| **Module 6** | Collections, generics, autoboxing, functional interfaces, lambdas, method references, streams, collectors, file streams        |

---

## Course Overview

This course introduces the fundamentals of **Java programming**, starting from computational thinking and basic programming concepts and progressing toward **object-oriented programming, exception handling, file I/O, collections, and functional programming with streams**.

---

# Module 1 — From Problem to Program: Computational Thinking & Java Foundations

## 1. Introduction to Problem Solving

* Understanding computational problems
* Problem-solving approaches
* Breaking a problem into smaller, manageable steps
* Designing solutions before writing code

## 2. Algorithms and Flowcharts

* Introduction to algorithms
* Characteristics of a good algorithm
* Writing algorithms using step-by-step instructions
* Introduction to flowcharts
* Common flowchart symbols
* Representing solutions using flowcharts

## 3. Java Environment

* Introduction to Java
* Features of Java
* Java Development Kit (JDK)
* Java Runtime Environment (JRE)
* Java Virtual Machine (JVM)
* Compilation and execution of Java programs

## 4. Structure of a Java Program

* Basic Java program structure
* `class` declaration
* `main()` method
* Statements and blocks
* Comments
* Compilation and execution

## 5. Java Programming Model

### Primitive Data Types

* `byte`
* `short`
* `int`
* `long`
* `float`
* `double`
* `char`
* `boolean`

### Variables

* Declaration
* Initialization
* Assignment
* Local variables

### Constants

* Using the `final` keyword
* Declaring constant values

### Identifiers

* Rules for naming identifiers
* Valid and invalid identifiers
* Naming conventions

### Literals

* Integer literals
* Floating-point literals
* Character literals
* String literals
* Boolean literals
* `null` literal

## 6. Operators

### Arithmetic Operators

* `+`
* `-`
* `*`
* `/`
* `%`

### Relational Operators

* `==`
* `!=`
* `>`
* `<`
* `>=`
* `<=`

### Logical Operators

* `&&`
* `||`
* `!`

### Assignment Operators

* `=`
* `+=`
* `-=`
* `*=`
* `/=`
* `%=`

### Unary Operators

* `+`
* `-`
* `++`
* `--`
* `!`

### Ternary Operator

* `condition ? expression1 : expression2`

### Bitwise Operators

* `&`
* `|`
* `^`
* `~`
* `<<`
* `>>`
* `>>>`

### Special Operators / Constructs

* Operators and constructs such as `instanceof`
* Understanding their appropriate usage

## 7. Type Casting

* Implicit type conversion
* Explicit type casting
* Widening conversion
* Narrowing conversion

## 8. Expression Evaluation

* Operator precedence
* Associativity
* Evaluation order
* Expressions involving multiple operators

## 9. Console Input and Output

### Formatted Output

* `System.out.print()`
* `System.out.println()`
* `System.out.printf()`
* Format specifiers

### Console Input

* Using the `Scanner` class
* Reading integers
* Reading floating-point values
* Reading characters
* Reading strings

---

# Module 2 — Control Flow: Selection & Iteration

## 1. Control Flow

* Understanding program execution flow
* Sequential execution
* Selection
* Iteration

## 2. Conditional Statements

### `if` Statement

* Basic conditional execution

### `if-else` Statement

* Two-way decision making

### Nested `if`

* Using conditions inside other conditions

### `if-else-if` Ladder

* Multiple-condition decision making

## 3. `switch` Statement

* `switch` syntax
* `case`
* `break`
* `default`
* Multiple cases
* Compound statements

## 4. Loops

### `while` Loop

* Entry-controlled loop
* Condition-based repetition

### `do-while` Loop

* Exit-controlled loop
* Guaranteed first execution

### `for` Loop

* Initialization
* Condition
* Update expression

## 5. Loop Control Statements

### `continue`

* Skipping the current iteration

### Infinite Loops

* Understanding infinite execution
* Common causes
* Avoiding unintended infinite loops

## 6. Nested Loops

* Loop inside another loop
* Applications of nested loops
* Pattern-based problems
* Working with tables and matrices

---

# Module 3 — Decomposition with Methods, Recursion & Arrays

## 1. Modular Programming

* Breaking programs into smaller modules
* Benefits of modular programming
* Code reuse
* Readability and maintainability

## 2. Methods

### Method Definition

* Method syntax
* Method declaration
* Return type
* Method name
* Parameters
* Method body

### Method Invocation

* Calling methods
* Passing arguments

### Parameter Passing

* Passing values to methods
* Understanding Java's pass-by-value behavior

### Return Values

* Returning values from methods
* `return` statement
* `void` methods

## 3. Method Overloading

* Multiple methods with the same name
* Different parameter lists
* Compile-time polymorphism

## 4. Recursion

* Introduction to recursive methods
* Base case
* Recursive case
* Recursive method execution
* Common recursive problems

## 5. One-Dimensional Arrays

### Array Basics

* Array declaration
* Array creation
* Array initialization
* Array indexing
* Array length

### Array Traversal

* Using traditional `for` loops
* Using enhanced `for-each` loops

### Array Operations

* Searching
* Summation
* Average calculation
* Counting techniques
* Finding minimum and maximum values

## 6. Two-Dimensional Arrays

* Creating 2D arrays
* Accessing elements using row and column indexes
* Traversing matrices
* Nested loops with 2D arrays

### Matrix Arithmetic

* Matrix addition
* Matrix subtraction
* Matrix multiplication
* Basic matrix operations

---

# Module 4 — Object-Oriented Modelling, Design & Exception Handling

## 1. Introduction to Object-Oriented Programming

* Object-oriented programming concepts
* Advantages of OOP
* Classes and objects
* Abstraction
* Encapsulation
* Inheritance
* Polymorphism

## 2. Classes and Objects

### Classes as Blueprints

* Defining a class
* Class members
* Fields
* Methods

### Objects as Instances

* Creating objects
* Object references
* Accessing fields and methods

### Object Creation

* Using the `new` keyword

### Reference Concepts

* Object references
* `null`
* Understanding reference variables

## 3. Constructors

### Default Constructors

* Purpose of constructors
* Constructor syntax

### Parameterized Constructors

* Passing values during object creation

### Constructor Overloading

* Multiple constructors
* Different parameter lists

### `this` Keyword

* Referring to the current object
* Resolving field and parameter name conflicts
* Calling another constructor

## 4. Encapsulation

* Private fields
* Information hiding
* Access control

### Accessors and Mutators

* Getter methods
* Setter methods

## 5. Instance vs Static Members

### Instance Members

* Belong to individual objects
* Access through object references

### Static Members

* Belong to the class
* Shared among objects

### Static Methods

* Declaring static methods
* Calling static methods

### Constants

* Using `static final`
* Creating class-level constants

## 6. `toString()` Method

* Object representation
* Overriding `toString()`
* Converting object information into readable text

## 7. Inheritance

* Basic concept of inheritance
* Parent/superclass
* Child/subclass
* Code reuse
* "Is-a" relationship

### Types of Inheritance

* Single inheritance
* Multilevel inheritance
* Hierarchical inheritance
* Understanding Java's restriction on multiple class inheritance

## 8. Interfaces

* Introduction to interfaces
* Interfaces as contracts
* "Is-a" relationships
* Implementing interfaces
* Programming to interfaces

## 9. Method Overriding

* Redefining inherited methods
* Runtime polymorphism
* Difference between overloading and overriding

## 10. Exception Handling

### Errors vs Exceptions

* Understanding errors
* Understanding exceptions
* Why exception handling is required

### Checked and Unchecked Exceptions

* Checked exceptions
* Unchecked exceptions
* Common examples

### `try-catch-finally`

* `try` block
* `catch` block
* `finally` block
* Handling exceptions safely

### Multi-Catch

* Handling multiple exception types
* Using multiple exceptions in one `catch`

### `throw`

* Explicitly throwing an exception

### `throws`

* Declaring exceptions that a method may throw

---

# Module 5 — Strings, Library Algorithms & File I/O

## 1. String Abstraction in Java

* Introduction to `String`
* String objects
* Character representation
* String immutability

## 2. String Operations

### Basic Operations

* `length()`
* Character indexing using `charAt()`
* `substring()`

### Concatenation

* `+` operator
* `concat()`

### Comparison

* `equals()`
* `equalsIgnoreCase()`
* Understanding `==` vs `equals()`

> **Important:** `==` compares references for objects, while `equals()` is used to compare string contents.

### Case Conversion

* `toUpperCase()`
* `toLowerCase()`

### Searching

* `contains()`
* `indexOf()`
* `lastIndexOf()`
* `startsWith()`
* `endsWith()`

## 3. Mutable Strings

### StringBuilder

* Mutable character sequences
* `append()`
* `insert()`
* `delete()`
* `reverse()`

### StringBuffer

* Mutable strings
* Basic operations
* Difference between `StringBuilder` and `StringBuffer`

## 4. Building and Parsing Text

### `split()`

* Splitting strings into tokens

### `join()`

* Joining multiple strings

### Trimming

* Removing unwanted leading and trailing whitespace

### Validation

* Checking whether input follows expected rules
* Basic text validation

### Tokenization

* Breaking records into individual fields
* Processing simple text records

## 5. Java Library Algorithms

### Searching

* Linear searching
* Binary searching
* `Arrays.binarySearch()`

### Sorting

* `Arrays.sort()`
* `Collections.sort()`

## 6. Ordering Objects

### Comparable

* Natural ordering
* Implementing `Comparable`
* `compareTo()`

### Comparator

* Custom ordering
* Implementing `Comparator`
* `compare()`

### Comparable vs Comparator

* Natural ordering vs custom ordering
* Choosing the appropriate approach

## 7. File I/O

### Modern Java File APIs

* `java.nio.file.Path`
* `java.nio.file.Files`

### Reading Text Files

* Reading complete files
* Reading files line by line
* Processing file contents

### Writing Text Files

* Creating files
* Writing text
* Appending data

### Buffered I/O

* Buffered readers
* Buffered writers
* Efficient text processing

### File Handling

* Handling missing files
* Handling malformed records
* Validating file data

### Try-with-Resources

* Automatic resource management
* Safely closing files and other resources

---

# Module 6 — Functional Programming with Collections & Streams

## 1. Java Collections Framework

Collections are used to store and manipulate groups of objects.

### List

* Ordered collection
* Allows duplicate elements
* Example: `ArrayList`

### Set

* Collection of unique elements
* Example: `HashSet`

### Map

* Stores key-value pairs
* Example: `HashMap`

## 2. Common Collection Classes

### ArrayList

* Adding elements
* Removing elements
* Accessing elements
* Searching
* Iterating

### HashSet

* Storing unique values
* Adding and removing elements
* Checking membership

### HashMap

* Key-value storage
* Adding entries
* Removing entries
* Looking up values
* Iterating through entries

### Ordered Collections

* Understanding ordered map/set implementations
* Basic usage of ordered collections

## 3. Generics

* Introduction to generics
* Typed collections
* Example: `List<String>`
* Type safety
* Reducing unnecessary type casting
* Compile-time error detection

## 4. Autoboxing

* Primitive types and wrapper classes
* Automatic conversion between primitives and wrapper objects
* Examples:

  * `int` ↔ `Integer`
  * `double` ↔ `Double`
  * `boolean` ↔ `Boolean`

## 5. Iterating Collections

### For-Each Loop

* Simple collection traversal

### Iterators

* Using `Iterator`
* Traversing collections safely

### Declarative Processing

* Moving from explicit iteration toward expressing **what should be done** using functional operations

## 6. Functional Interfaces

* Introduction to functional interfaces
* Using interfaces to parameterize behavior

### Predicate

* Represents a condition
* Typically returns `boolean`

### Function

* Accepts an input and produces an output

### Consumer

* Accepts an input and performs an action
* Does not return a result

### Supplier

* Produces a value without requiring an input

### Comparator

* Defines custom ordering

## 7. Lambda Expressions

* Introduction to lambda expressions
* Lambda syntax
* Passing behavior as an argument
* Using lambdas with collections and streams

## 8. Method References

* Introduction to method references
* Simplifying lambda expressions
* Common method-reference syntax

## 9. Stream API

Streams allow collections and other data sources to be processed using a declarative pipeline.

### Creating Streams

* Streams from collections
* Streams from file lines

### Intermediate Operations

* `filter()`
* `map()`
* `sorted()`
* `distinct()`
* `limit()`

Intermediate operations transform or filter stream data and generally return another stream.

### Terminal Operations

* `forEach()`
* `collect()`
* `count()`
* `reduce()`

Terminal operations produce a result or perform a final action.

## 10. Collectors

### `toList()`

* Collecting stream results into a list

### `groupingBy()`

* Grouping elements according to a property

### `counting()`

* Counting elements

### `joining()`

* Joining strings into a single result

## 11. Reports and Summaries

* Processing collections using streams
* Grouping records
* Counting records
* Generating summaries
* Creating simple reports

## 12. Reading File Lines as a Stream

* Using `Files.lines()`
* Processing file contents with streams
* Filtering file records
* Mapping file data
* Collecting results
* Handling resources correctly


