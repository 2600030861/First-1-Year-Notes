# Module 4 — Object-Oriented Modelling, Design & Exception Handling

> Beginner-friendly notes covering OOP concepts, classes and objects, constructors, encapsulation, instance vs static members, `toString()`, inheritance, interfaces, method overriding, and exception handling in Java.

---

## Table of Contents
1. [Introduction to Object-Oriented Programming](#1-introduction-to-object-oriented-programming)
2. [Classes and Objects](#2-classes-and-objects)
3. [Constructors](#3-constructors)
4. [Encapsulation](#4-encapsulation)
5. [Instance vs Static Members](#5-instance-vs-static-members)
6. [The `toString()` Method](#6-the-tostring-method)
7. [Inheritance](#7-inheritance)
8. [Interfaces](#8-interfaces)
9. [Method Overriding](#9-method-overriding)
10. [Exception Handling](#10-exception-handling)

---

## 1. Introduction to Object-Oriented Programming

### 1.1 What is OOP?
**Object-Oriented Programming (OOP)** is a programming style in which a program is organized around **objects**, which combine **data** (state) and **behaviour** (methods that work on that data).

| | Procedural programming | Object-oriented programming |
|---|---|---|
| Focus | Functions/procedures | Objects (data + methods together) |
| Data | Often shared/global, passed around | Hidden inside objects |
| Modelling | "What steps do I perform?" | "What things exist and what can they do?" |
| Example language | C | Java, C++, Python |

**Modelling idea:** look at the real-world problem, identify the **things (nouns)** → these become **classes**; identify what they **do (verbs)** → these become **methods**.

> *Library system:* nouns → `Book`, `Member`, `Librarian`; verbs → `borrow()`, `returnBook()`, `search()`.

### 1.2 Advantages of OOP
| Advantage | Explanation |
|---|---|
| **Modularity** | Each class is a self-contained unit |
| **Reusability** | Classes can be reused and extended (inheritance) |
| **Maintainability** | Changes stay local to one class |
| **Security / data hiding** | Internal data is protected from outside misuse (encapsulation) |
| **Flexibility** | Same interface, different behaviour (polymorphism) |
| **Real-world modelling** | Code structure mirrors the problem domain |

### 1.3 Classes and objects
- A **class** is a **blueprint/template** that describes what data and behaviour its objects will have.
- An **object** is a **concrete instance** of a class, created at run time, with its own values.

```
Class: Car (blueprint)             Objects (instances)
 fields : color, speed     ──▶     car1: red, 80
 methods: accelerate()             car2: blue, 120
```

### 1.4 The four pillars of OOP

| Pillar | Meaning | One-line example |
|---|---|---|
| **Abstraction** | Show *what* an object does; hide *how* it does it. Expose only essential features. | You press the accelerator without knowing engine internals |
| **Encapsulation** | Bundle data and methods together and **restrict direct access** to the data | `private` fields with public getters/setters |
| **Inheritance** | A new class **acquires** the fields and methods of an existing class | `Dog` extends `Animal` |
| **Polymorphism** | One interface, **many forms**: the same call behaves differently depending on the object | `animal.sound()` gives "Woof" or "Meow" |

> **Abstraction vs Encapsulation:** abstraction is about **design** (hiding complexity from the user); encapsulation is about **implementation** (hiding data inside the class using access control).

---

## 2. Classes and Objects

### 2.1 Classes as blueprints

#### Defining a class
```java
public class Student {
    // fields (state)
    String name;
    int age;
    double gpa;

    // methods (behaviour)
    void display() {
        System.out.println(name + " | " + age + " | " + gpa);
    }
}
```

#### Class members
The things defined inside a class are its **members**:
- **Fields** (also called instance variables / attributes): the data
- **Methods**: the behaviour
- (Also constructors, nested classes, initializer blocks, covered later or beyond this module)

#### Fields
- Declared inside the class but **outside any method**.
- Each object gets **its own copy** of every (non-static) field.
- Fields get **default values** automatically: `0`, `0.0`, `false`, `'\u0000'`, `null` (unlike local variables, which must be initialized).

#### Methods
Methods inside a class can directly use the object's fields.
```java
double getBonus() {
    return gpa * 10;        // uses this object's gpa
}
```

> **File rule:** a `.java` file may contain several classes, but at most **one `public` class**, and the file name must match it (`Student.java`).

### 2.2 Objects as instances

#### Creating objects
```java
Student s1 = new Student();    // create an object
Student s2 = new Student();    // another, separate object
```

#### Accessing fields and methods (dot operator)
```java
s1.name = "Priya";
s1.age = 20;
s1.gpa = 8.7;

s2.name = "Rahul";
s2.age = 21;
s2.gpa = 7.9;

s1.display();     // Priya | 20 | 8.7
s2.display();     // Rahul | 21 | 7.9
```
`s1` and `s2` have **independent** copies of `name`, `age`, `gpa`.

#### Complete example
```java
public class TestStudent {
    public static void main(String[] args) {
        Student s = new Student();
        System.out.println(s.name);   // null  (default for String)
        System.out.println(s.age);    // 0     (default for int)
        s.name = "Priya";
        s.display();
    }
}
```

### 2.3 Object creation — the `new` keyword

```java
Student s = new Student();
//  ^        ^    ^
//  type     |    constructor call
//        variable (reference)
```
What happens on this line:
1. **`Student s`** — declares a reference variable `s` (it can refer to a `Student` object).
2. **`new`** — allocates memory for a new object on the **heap**.
3. **`Student()`** — the **constructor** runs to initialize the object.
4. **`=`** — the address (reference) of the new object is stored in `s`.

You can separate declaration and creation:
```java
Student s;               // declaration only: s refers to nothing yet
s = new Student();       // creation
```

### 2.4 Reference concepts

#### Object references
A variable of a class type does **not hold the object itself**; it holds a **reference** (address) to the object.

```
Stack                 Heap
 s1 ───────────▶  [ name="Priya", age=20, gpa=8.7 ]
 s2 ───────────▶  [ name="Rahul", age=21, gpa=7.9 ]
```

**Copying a reference does not copy the object:**
```java
Student a = new Student();
a.name = "Priya";

Student b = a;           // b now refers to the SAME object
b.name = "Rahul";

System.out.println(a.name);   // Rahul  (a and b share one object)
```

```
 a ──┐
     ▼
   [ name="Rahul" ]
     ▲
 b ──┘
```

#### `null`
- `null` means **"this reference points to no object"**.
- Default value of any reference-type field.

```java
Student s = null;
s.display();      // NullPointerException at run time!
```
Using `.` on a `null` reference throws **`NullPointerException`** (NPE), one of the most common runtime errors. Check before use:
```java
if (s != null) {
    s.display();
}
```

#### Understanding reference variables

| Concept | Details |
|---|---|
| Primitive variable | Stores the **value itself** (`int x = 5;`) |
| Reference variable | Stores the **address of an object** |
| `==` on references | Compares **addresses** (are they the same object?) |
| `.equals()` | Compares **contents** if the class overrides it (e.g., `String`) |
| Garbage collection | An object with **no references** pointing to it becomes eligible for automatic memory cleanup by the JVM |

```java
Student x = new Student();
Student y = new Student();
Student z = x;

System.out.println(x == y);   // false (different objects)
System.out.println(x == z);   // true  (same object)

x = null;                     // x no longer refers to it, but z still does
```

---

## 3. Constructors

A **constructor** is a special block of code that runs **automatically when an object is created** with `new`. Its job is to **initialize** the new object.

### 3.1 Default constructors

#### Purpose of constructors
- Set the **initial state** of an object.
- Make sure objects are valid from the moment they exist.

#### Constructor syntax
```java
accessModifier ClassName(parameters) {
    // initialization code
}
```
Rules:
- The name **must be the same as the class name**.
- It has **no return type** (not even `void`).
- It is called **only** through `new` (or from another constructor with `this(...)` / `super(...)`).
- Constructors are **not inherited**.

```java
public class Student {
    String name;
    int age;

    public Student() {                 // no-argument constructor
        name = "Unknown";
        age = 18;
    }
}

Student s = new Student();            // constructor runs here
System.out.println(s.name);           // Unknown
```

#### The compiler-provided default constructor
If you write **no constructor at all**, the compiler adds an invisible **default (no-arg) constructor** that gives fields their default values.

> **Important:** The moment you write **any** constructor yourself, the compiler **stops** providing the default one. If you define only a parameterized constructor, `new Student()` will no longer compile unless you also write a no-arg constructor.

### 3.2 Parameterized constructors

Pass values at creation time:
```java
public class Student {
    String name;
    int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

Student s1 = new Student("Priya", 20);
Student s2 = new Student("Rahul", 21);
// Student s3 = new Student();   // ERROR: no no-arg constructor exists now
```

### 3.3 Constructor overloading

A class can have **multiple constructors** as long as their **parameter lists differ** (number, types, or order), exactly like method overloading.

```java
public class Student {
    String name;
    int age;
    double gpa;

    public Student() {
        this("Unknown", 18, 0.0);          // calls the 3-arg constructor
    }

    public Student(String name) {
        this(name, 18, 0.0);
    }

    public Student(String name, int age) {
        this(name, age, 0.0);
    }

    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }
}

Student a = new Student();                   // Unknown, 18, 0.0
Student b = new Student("Priya");            // Priya, 18, 0.0
Student c = new Student("Rahul", 21, 7.9);   // Rahul, 21, 7.9
```
Java chooses the constructor whose parameters match the arguments (resolved at compile time).

### 3.4 The `this` keyword

`this` is a reference to the **current object** (the object whose method or constructor is running).

#### Referring to the current object
```java
class Counter {
    int value;

    Counter increment() {
        value++;
        return this;          // return the current object (allows chaining)
    }
}

Counter c = new Counter();
c.increment().increment().increment();    // value = 3
```

#### Resolving field and parameter name conflicts
When a parameter has the **same name as a field**, the parameter **shadows** the field. Use `this.` to refer to the field.

```java
public Student(String name, int age) {
    this.name = name;     // this.name = field,  name = parameter
    this.age = age;
}

// Without this:
public Student(String name, int age) {
    name = name;          // BUG: assigns the parameter to itself; the field is never set
    age = age;
}
```

#### Calling another constructor: `this(...)`
- Used to reuse initialization code (**constructor chaining**).
- **Must be the first statement** in the constructor.
- You cannot create a cycle of `this(...)` calls (compile error).
- A constructor cannot use both `this(...)` and `super(...)` (each must be first).

(See the overloading example in 3.3.)

> `this` cannot be used inside a `static` method (there is no current object).

---

## 4. Encapsulation

**Encapsulation** = keeping a class's **data private** and allowing access only through **controlled public methods**.

### 4.1 Private fields, information hiding

**Problem without encapsulation:**
```java
public class BankAccount {
    public double balance;
}

BankAccount acc = new BankAccount();
acc.balance = -5000;       // nothing stops invalid data!
```

**Solution: make the field `private`:**
```java
public class BankAccount {
    private double balance;       // hidden from other classes
}
// acc.balance = 100;    // ERROR: balance has private access in BankAccount
```

**Information hiding** means other classes depend only on the **public interface** (methods), not on how data is stored internally. You can change the internals later without breaking users of the class.

### 4.2 Access control (access modifiers)

| Modifier | Same class | Same package | Subclass (other package) | Anywhere |
|---|---|---|---|---|
| `private` | Yes | No | No | No |
| *(default / package-private)* | Yes | Yes | No | No |
| `protected` | Yes | Yes | Yes | No |
| `public` | Yes | Yes | Yes | Yes |

**Rule of thumb:** make fields `private`; make methods meant for outside use `public`; keep helper methods `private`.

### 4.3 Accessors and mutators

Since fields are private, provide public methods to read and change them.

| Type | Also called | Purpose | Naming convention |
|---|---|---|---|
| **Accessor** | Getter | Read a field's value | `getName()`, `isActive()` (for boolean) |
| **Mutator** | Setter | Change a field's value (with validation) | `setName(String name)` |

```java
public class Student {
    private String name;
    private int age;

    // Constructor
    public Student(String name, int age) {
        this.name = name;
        setAge(age);                    // reuse validation
    }

    // Getters
    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        if (age > 0 && age < 120) {     // validation
            this.age = age;
        } else {
            System.out.println("Invalid age!");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Priya", 20);
        s.setAge(-5);                      // Invalid age!  (age stays 20)
        System.out.println(s.getAge());    // 20
    }
}
```

**Benefits of getters/setters:**
- **Validation** before changing data.
- **Read-only fields:** provide a getter but **no setter**.
- **Flexibility:** internal representation can change without affecting callers.
- **Control:** you can add logging, computed values, etc.

**Example — read-only and computed values:**
```java
public class Rectangle {
    private final double length;      // no setter => read-only
    private final double width;

    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }

    public double getArea() {         // computed, not stored
        return length * width;
    }
}
```

---

## 5. Instance vs Static Members

### 5.1 Instance members
- Declared **without** `static`.
- **Belong to individual objects**; each object has its **own copy** of instance fields.
- Accessed **through an object reference**: `obj.field`, `obj.method()`.
- Instance methods can access **both** instance and static members.

```java
public class Employee {
    private String name;          // instance field: one per object
    private double salary;

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    public void raise(double percent) {      // instance method
        salary += salary * percent / 100;
    }
}

Employee e1 = new Employee("Asha", 50000);
Employee e2 = new Employee("Ravi", 60000);
e1.raise(10);      // only e1's salary changes
```

### 5.2 Static members
- Declared with the keyword `static`.
- **Belong to the class itself**, not to any object.
- There is **only one copy**, **shared** by all objects of the class.
- Exist even if **no object has been created**.

```java
public class Employee {
    private static int count = 0;      // static field: ONE shared copy
    private String name;

    public Employee(String name) {
        this.name = name;
        count++;                        // every new object increments the same counter
    }

    public static int getCount() {      // static method
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Employee.getCount());   // 0  (no objects yet)
        new Employee("Asha");
        new Employee("Ravi");
        System.out.println(Employee.getCount());   // 2
    }
}
```

```
Class Employee      static count = 2   (one shared copy)
   │
   ├── e1: name="Asha"     (own copy of name)
   └── e2: name="Ravi"     (own copy of name)
```

### 5.3 Static methods

#### Declaring static methods
```java
public static int square(int n) {
    return n * n;
}
```

#### Calling static methods
- Preferred: through the **class name** → `ClassName.method()`
- Allowed but discouraged: through an object reference.
- Within the same class, the name alone is enough.

```java
int r = MathUtil.square(5);            // via class name (preferred)
double root = Math.sqrt(25);           // Math methods are static
int n = Integer.parseInt("42");        // static method of Integer
```

#### Restrictions of static methods
- They have **no `this`** (no current object).
- They **cannot directly access instance fields or instance methods**; they would need an object reference.
- `main` is static, so it can't call instance methods directly:

```java
public class Demo {
    int x = 10;

    void show() { System.out.println(x); }

    public static void main(String[] args) {
        // System.out.println(x);   // ERROR: non-static variable x cannot be referenced from a static context
        // show();                  // ERROR: non-static method show() cannot be referenced from a static context

        Demo d = new Demo();        // OK: create an object first
        d.show();                   // 10
    }
}
```

### 5.4 Comparison table

| Aspect | Instance member | Static member |
|---|---|---|
| Belongs to | Each object | The class |
| Copies in memory | One **per object** | **One** shared copy |
| Accessed via | Object reference | Class name (preferably) |
| Needs an object? | Yes | No |
| Can use `this`? | Yes | No |
| Can access instance members directly? | Yes | No |
| Typical use | Object state (`name`, `balance`) | Counters, utilities, constants |

### 5.5 Constants

#### Using `static final`
- `final` = the value **cannot be changed** after it is assigned.
- `static final` = a **class-level constant**, shared and unchangeable.
- Convention: **UPPER_CASE with underscores**.

```java
public class Circle {
    public static final double PI = 3.14159;       // class-level constant
    public static final int MAX_RADIUS = 100;

    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    public double area() {
        return PI * radius * radius;
    }
}

System.out.println(Circle.PI);      // 3.14159
// Circle.PI = 3.0;                 // ERROR: cannot assign a value to final variable PI
```

Other uses of `final`:

| Use | Effect |
|---|---|
| `final` variable | Value can be assigned only once |
| `final` field (non-static) | Must be assigned by declaration or in every constructor; each object may have a different value |
| `final` method | Cannot be overridden by subclasses |
| `final` class | Cannot be extended (e.g., `String`) |

> For a `final` **reference** variable, the reference cannot change, but the **object's contents can** (e.g., a `final int[]` array can still have its elements modified).

---

## 6. The `toString()` Method

### 6.1 Object representation

Every class in Java automatically inherits from the class **`Object`**, which has a method:
```java
public String toString()
```
The **default** version returns the class name plus a hash code, which is rarely useful:

```java
Student s = new Student("Priya", 20);
System.out.println(s);           // Student@1b6d3586   (not helpful)
```

### 6.2 Overriding `toString()`

Provide your own version that returns a **readable description** of the object. Use `@Override` so the compiler checks you got the signature right.

```java
public class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student[name=" + name + ", age=" + age + "]";
    }
}

Student s = new Student("Priya", 20);
System.out.println(s);                         // Student[name=Priya, age=20]
```

### 6.3 Converting object information into readable text

`toString()` is called **automatically** when an object is:
- passed to `System.out.println()` / `print()`
- concatenated with a `String` using `+`
- passed to `String.valueOf(obj)`

```java
String text = "Record: " + s;          // calls s.toString()
System.out.println(text);              // Record: Student[name=Priya, age=20]
```

You can use `String.format` for neat output:
```java
@Override
public String toString() {
    return String.format("Student{name='%s', age=%d}", name, age);
}
```

**Rules/notes:**
- It must be declared `public`, return `String`, and take no parameters.
- Printing a `null` reference with `println` prints `null`, but calling `obj.toString()` on `null` throws `NullPointerException`.
- Arrays do **not** have a readable `toString()`; use `Arrays.toString()`.

---

## 7. Inheritance

### 7.1 Basic concept

**Inheritance** lets one class (the **subclass**) **acquire the fields and methods** of another class (the **superclass**), and add or modify behaviour.

| Term | Meaning |
|---|---|
| **Parent / superclass / base class** | The class being inherited from |
| **Child / subclass / derived class** | The class that inherits |
| **`extends`** | Keyword used to inherit |

#### Code reuse
Common code lives in the superclass once; every subclass gets it for free.

#### "Is-a" relationship
Use inheritance only when the subclass **is a** kind of the superclass:
- `Dog` **is an** `Animal` ✔
- `Car` **is a** `Vehicle` ✔
- `Car` **is an** `Engine` ✘ (a car **has an** engine → use a field, i.e., *composition*)

### 7.2 Syntax and example

```java
class Animal {                         // superclass
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }
}

class Dog extends Animal {             // subclass
    public Dog(String name) {
        super(name);                   // call the superclass constructor
    }

    public void bark() {
        System.out.println(name + " says Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("Buddy");
        d.eat();        // inherited from Animal
        d.bark();       // defined in Dog
    }
}
```

**Output:**
```
Buddy is eating
Buddy says Woof!
```

### 7.3 The `super` keyword

| Use | Meaning |
|---|---|
| `super(args)` | Call a **superclass constructor** (must be the **first statement** in the constructor) |
| `super.method()` | Call the **superclass's version** of a method (useful when overridden) |
| `super.field` | Access a superclass field (e.g., when hidden) |

#### Constructor chaining
- Creating a subclass object **always runs a superclass constructor first**.
- If you don't write `super(...)`, the compiler inserts `super();` automatically, so the superclass **must have a no-arg constructor** (otherwise compile error).

```java
class A {
    A() { System.out.println("A constructor"); }
}
class B extends A {
    B() { System.out.println("B constructor"); }
}
class C extends B {
    C() { System.out.println("C constructor"); }
}

new C();
// Output:
// A constructor
// B constructor
// C constructor
```

### 7.4 What is inherited?
- **Inherited:** `public` and `protected` members (and package-private members, if in the same package).
- **`private` members exist in the object but are not directly accessible** in the subclass (use getters/setters).
- **Constructors are not inherited** (but can be called with `super(...)`).
- Every class implicitly extends **`Object`** if no `extends` is given, so `toString()`, `equals()`, `hashCode()` are always available.

### 7.5 Types of inheritance

#### Single inheritance
One subclass extends one superclass.
```
Animal
  ▲
 Dog
```
```java
class Animal { }
class Dog extends Animal { }
```

#### Multilevel inheritance
A chain: a class extends a class that itself extends another.
```
Vehicle
   ▲
  Car
   ▲
ElectricCar
```
```java
class Vehicle { void start() { System.out.println("Vehicle starts"); } }
class Car extends Vehicle { void drive() { System.out.println("Car drives"); } }
class ElectricCar extends Car { void charge() { System.out.println("Charging"); } }

ElectricCar e = new ElectricCar();
e.start();     // from Vehicle
e.drive();     // from Car
e.charge();    // own method
```

#### Hierarchical inheritance
**Several** subclasses extend the **same** superclass.
```
        Shape
       ▲  ▲  ▲
Circle  Rectangle  Triangle
```
```java
class Shape { void draw() { System.out.println("Drawing shape"); } }
class Circle extends Shape { }
class Rectangle extends Shape { }
class Triangle extends Shape { }
```

#### Summary table

| Type | Structure | Allowed with classes? |
|---|---|---|
| Single | A ← B | Yes |
| Multilevel | A ← B ← C | Yes |
| Hierarchical | A ← B, A ← C | Yes |
| **Multiple** | A ← C, B ← C (C extends both A and B) | **No** (classes), but **Yes** via interfaces |

#### Java's restriction on multiple class inheritance

A class can extend **only one** class:
```java
class C extends A, B { }     // COMPILE ERROR
```

**Why?** The **diamond problem**: if `A` and `B` both define `show()`, and `C` inherits from both, which `show()` does `C` inherit? Java avoids this ambiguity by allowing only **single class inheritance**.

```
     Animal
     ▲    ▲
   Bird   Fish           (both override move())
     ▲    ▲
      Hybrid             <- which move()?  Ambiguous!
```

Java gets the *benefits* of multiple inheritance (a type with several roles) through **interfaces** (Section 8): a class can **extend one class and implement many interfaces**.

### 7.6 `final` and inheritance
```java
final class Constants { }                     // cannot be extended
class A { final void show() { } }             // show() cannot be overridden
```

---

## 8. Interfaces

### 8.1 Introduction to interfaces

An **interface** is a **completely abstract type** that declares **what** a class must do, without saying **how**. It is a collection of method declarations (and constants).

```java
public interface Drawable {
    void draw();                    // implicitly public and abstract
}
```

Key facts:
- Declared with the keyword `interface`.
- Methods are implicitly **`public abstract`** (no body).
- Fields are implicitly **`public static final`** (constants).
- **Cannot be instantiated** (`new Drawable()` is an error).
- Since Java 8, interfaces may also contain **`default`** methods (with a body) and **`static`** methods.

```java
public interface Vehicle {
    int MAX_SPEED = 200;            // constant: public static final

    void start();                   // abstract
    void stop();                    // abstract

    default void honk() {           // default method (Java 8+)
        System.out.println("Beep!");
    }
}
```

### 8.2 Interfaces as contracts

An interface is a **contract**: any class that **implements** it **promises** to provide all its methods. Callers can rely on that promise without knowing the class.

### 8.3 Implementing interfaces

Use the keyword **`implements`**. The class **must implement every abstract method** (as `public`), unless the class is itself `abstract`.

```java
interface Drawable {
    void draw();
}

class Circle implements Drawable {
    @Override
    public void draw() {                 // must be public
        System.out.println("Drawing a circle");
    }
}

class Square implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a square");
    }
}
```

#### Implementing multiple interfaces
```java
interface Drawable  { void draw(); }
interface Resizable { void resize(double factor); }

class Circle implements Drawable, Resizable {
    private double radius = 1.0;

    @Override public void draw() { System.out.println("Circle r=" + radius); }
    @Override public void resize(double factor) { radius *= factor; }
}
```

#### Extending a class and implementing interfaces together
```java
class Dog extends Animal implements Pet, Trainable { }
```
(`extends` comes first, then `implements`.)

#### Interface extending interfaces
```java
interface A { void a(); }
interface B { void b(); }
interface C extends A, B { void c(); }     // interfaces CAN extend multiple interfaces
```

### 8.4 "Is-a" relationships with interfaces
A class that implements an interface **is-a** subtype of that interface:
- `Circle` **is a** `Drawable`
- `Circle` **is a** `Resizable`

So an object can be treated as any of its interface types.

### 8.5 Programming to interfaces

**Programming to an interface** means declaring variables, parameters, and return types using the **interface type**, not the concrete class. Code then works with **any** implementing class.

```java
Drawable d = new Circle();          // reference type = interface, object = Circle
d.draw();                           // Drawing a circle

d = new Square();                   // same variable, different implementation
d.draw();                           // Drawing a square
```

**Works with collections and methods:**
```java
static void render(Drawable shape) {         // accepts ANY Drawable
    shape.draw();
}

Drawable[] shapes = { new Circle(), new Square(), new Circle() };
for (Drawable s : shapes) {
    render(s);
}
```

**Why it matters:**
- **Loose coupling:** the caller does not depend on a specific class.
- **Flexibility:** swap implementations without changing the caller.
- **Testability and extensibility:** add new classes (e.g., `Triangle implements Drawable`) with **no change** to existing code.

> A reference of interface type can call **only the methods declared in that interface** (even if the actual object has more).

### 8.6 Interface vs abstract class (quick comparison)

| | Interface | Abstract class |
|---|---|---|
| Keyword | `interface` / `implements` | `abstract class` / `extends` |
| Multiple inheritance | A class can implement **many** | A class can extend **only one** |
| Fields | Only constants | Any kind of fields |
| Constructors | No | Yes |
| Method bodies | `default`/`static` only | Concrete and abstract methods |
| Best for | Defining a **capability/contract** (can-do) | Sharing **common code** between related classes (is-a) |

---

## 9. Method Overriding

### 9.1 Redefining inherited methods

**Method overriding** happens when a **subclass provides its own implementation** of a method that is already defined in its superclass (or interface), with the **same signature**.

```java
class Animal {
    void sound() {
        System.out.println("Some generic sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Woof!");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Meow!");
    }
}
```

**Rules for overriding:**

| Rule | Detail |
|---|---|
| Same **name** and **parameter list** | Exactly the same signature |
| Return type | Same, or a **subtype** of the original (covariant return) |
| Access level | **Cannot be more restrictive** (e.g., `public` → `protected` is an error; widening is OK) |
| `static` methods | Cannot be overridden (they are *hidden*) |
| `final` methods | Cannot be overridden |
| `private` methods | Not inherited, so not overridden |
| Constructors | Cannot be overridden |
| Checked exceptions | Cannot throw **new or broader** checked exceptions than the overridden method |
| `@Override` | Optional but **strongly recommended**: gives a compile error if you made a mistake in the signature |

**Calling the parent version:**
```java
class Dog extends Animal {
    @Override
    void sound() {
        super.sound();                    // Some generic sound
        System.out.println("Woof!");
    }
}
```

### 9.2 Runtime polymorphism

**Polymorphism** = one reference/method call, many behaviours.

In Java a **superclass reference** can refer to a **subclass object** (**upcasting**). When you call an overridden method through it, the JVM chooses the version **based on the actual object type at run time**. This is called **dynamic method dispatch** (late binding).

```java
Animal a1 = new Dog();      // superclass reference, subclass object
Animal a2 = new Cat();
Animal a3 = new Animal();

a1.sound();                 // Woof!         (decided at run time: Dog's version)
a2.sound();                 // Meow!
a3.sound();                 // Some generic sound
```

**Power of polymorphism: one loop, many behaviours**
```java
Animal[] zoo = { new Dog(), new Cat(), new Dog(), new Animal() };

for (Animal a : zoo) {
    a.sound();              // each object responds in its own way
}
// Woof! / Meow! / Woof! / Some generic sound
```

**Key points:**
- The **reference type** decides **which methods can be called** (checked at compile time).
- The **object type** decides **which version runs** (decided at run time).
- Calling a method that exists only in the subclass through a superclass reference is a compile error unless you **downcast**:

```java
Animal a = new Dog();
// a.bark();                    // ERROR: Animal has no bark()
if (a instanceof Dog) {
    Dog d = (Dog) a;            // downcast (safe because of the instanceof check)
    d.bark();
}
```
An invalid downcast throws `ClassCastException`.

> **Fields are not polymorphic.** Only instance **methods** are dispatched at run time; a field accessed through a reference uses the **reference's** declared type.

**Polymorphism through interfaces works the same way:**
```java
Drawable d = new Circle();
d.draw();                       // Circle's draw() runs
```

### 9.3 Overloading vs Overriding

| Aspect | **Overloading** | **Overriding** |
|---|---|---|
| Meaning | Same method name, **different parameters** | Subclass **redefines** an inherited method |
| Where | Usually **same class** (can also be across inheritance) | **Subclass and superclass** (inheritance required) |
| Parameter list | **Must differ** | **Must be the same** |
| Return type | Can differ (but not on its own) | Same or covariant |
| Access modifier | No restriction | Cannot be more restrictive |
| Polymorphism type | **Compile-time** (static binding) | **Run-time** (dynamic binding) |
| `static`/`private`/`final` methods | Can be overloaded | Cannot be overridden |
| Purpose | Convenience: same action with different inputs | Specialized behaviour in subclasses |

```java
class Calculator {
    int add(int a, int b)          { return a + b; }        // overload
    double add(double a, double b) { return a + b; }        // overload
}

class Parent { void show() { System.out.println("Parent"); } }
class Child extends Parent {
    @Override void show() { System.out.println("Child"); }  // override
}
```

---

## 10. Exception Handling

### 10.1 Errors vs Exceptions

#### Understanding errors and exceptions
- An **exception** is an **event during program execution that disrupts the normal flow** of instructions (e.g., dividing by zero, opening a missing file).
- In Java, exceptions are **objects** created and "thrown" when something goes wrong.

| | **Error** | **Exception** |
|---|---|---|
| Meaning | Serious problem, usually outside the program's control | Problem the program can often anticipate and handle |
| Recoverable? | Generally **not** (should not be caught) | **Yes**, can be caught and handled |
| Examples | `OutOfMemoryError`, `StackOverflowError` | `ArithmeticException`, `IOException`, `NumberFormatException` |
| Parent class | `java.lang.Error` | `java.lang.Exception` |

(In everyday conversation, "error" is also used for *compile-time* mistakes (syntax errors) and *logic* errors; those are different from run-time exceptions.)

#### The exception class hierarchy
```
                  Throwable
                  /       \
              Error       Exception
        (OutOfMemoryError,     /         \
         StackOverflowError)  |           RuntimeException  (unchecked)
                        IOException        /      |         \
                        SQLException  ArithmeticException  NullPointerException
                     (checked)        ArrayIndexOutOfBounds  NumberFormatException ...
```

#### Why exception handling is required
**Without handling**, an exception **terminates the program** and prints a stack trace:
```java
int a = 10, b = 0;
System.out.println(a / b);          // ArithmeticException: / by zero
System.out.println("Done");         // never reached
```

**With handling**, the program can recover gracefully:
- Prevents **abrupt crashes**.
- **Separates** normal logic from error-handling logic (cleaner code).
- Allows **meaningful messages** to the user.
- Allows **cleanup** of resources (files, connections).
- Lets errors **propagate** up to a method that knows how to deal with them.

### 10.2 Checked and Unchecked Exceptions

| | **Checked exceptions** | **Unchecked exceptions** |
|---|---|---|
| Superclass | `Exception` (but **not** `RuntimeException`) | `RuntimeException` (and `Error`) |
| Checked by compiler? | **Yes** | No |
| Must handle or declare? | **Yes**: `try-catch` **or** `throws` (else compile error) | No (optional) |
| Typical cause | External conditions (files, network, database) | **Programming bugs** (bad index, null, bad cast) |
| Examples | `IOException`, `FileNotFoundException`, `SQLException`, `InterruptedException` | `ArithmeticException`, `NullPointerException`, `ArrayIndexOutOfBoundsException`, `NumberFormatException`, `ClassCastException`, `IllegalArgumentException`, `InputMismatchException` |

> **Memory aid:** *Checked* = checked by the **compiler** at compile time. *Unchecked* = not checked at compile time; they occur at run time.

**Common exceptions and what causes them:**

| Exception | Typical cause | Example |
|---|---|---|
| `ArithmeticException` | Integer division by zero | `10 / 0` |
| `NullPointerException` | Using a `null` reference | `String s = null; s.length();` |
| `ArrayIndexOutOfBoundsException` | Invalid array index | `a[5]` on an array of size 5 |
| `NumberFormatException` | Invalid text-to-number conversion | `Integer.parseInt("abc")` |
| `ClassCastException` | Invalid downcast | `(Dog) new Cat()` via an `Animal` ref |
| `InputMismatchException` | `Scanner.nextInt()` given non-numeric input | typing `abc` |
| `FileNotFoundException` (checked) | File does not exist | `new FileReader("x.txt")` |
| `IOException` (checked) | General input/output failure | reading a closed stream |
| `InterruptedException` (checked) | A thread was interrupted while waiting | `Thread.sleep(1000)` |

> Note: dividing a **`double`** by zero does **not** throw an exception; it gives `Infinity` or `NaN`. Only **integer** division/modulo by zero throws `ArithmeticException`.

### 10.3 `try-catch-finally`

#### Syntax
```java
try {
    // code that MIGHT throw an exception
} catch (ExceptionType1 e) {
    // handle ExceptionType1
} catch (ExceptionType2 e) {
    // handle ExceptionType2
} finally {
    // code that ALWAYS runs (cleanup)
}
```

#### The `try` block
Contains the code that may throw an exception. If an exception occurs, the **rest of the try block is skipped** and control jumps to a matching `catch`.

#### The `catch` block
Handles a specific exception type. The parameter `e` is the exception object.

```java
try {
    int result = 10 / 0;
    System.out.println("Result: " + result);     // skipped
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
    System.out.println("Message: " + e.getMessage());   // / by zero
}
System.out.println("Program continues...");       // runs normally
```

Useful methods on an exception object:

| Method | Returns |
|---|---|
| `e.getMessage()` | Description message |
| `e.toString()` | Class name + message |
| `e.printStackTrace()` | Prints the full stack trace (useful for debugging) |

**Rules for catch blocks:**
- A `try` must be followed by **at least one `catch` or a `finally`**.
- Only the **first matching** `catch` runs.
- Order **from most specific to most general**. Putting a superclass first makes the subclass `catch` unreachable (compile error).

```java
try {
    int[] a = new int[3];
    a[5] = 10;
} catch (ArrayIndexOutOfBoundsException e) {      // specific first
    System.out.println("Bad index");
} catch (Exception e) {                           // general last
    System.out.println("Something else went wrong");
}

// WRONG ORDER:
// catch (Exception e) { }
// catch (ArrayIndexOutOfBoundsException e) { }   // ERROR: already caught
```

#### The `finally` block
- Runs **whether or not** an exception occurred, and whether or not it was caught.
- Used for **cleanup**: closing files, scanners, connections.
- Runs even if the `try` or `catch` contains `return`.
- It will **not** run only if the JVM stops (e.g., `System.exit()`) or crashes.

```java
Scanner sc = new Scanner(System.in);
try {
    System.out.print("Enter a number: ");
    int n = sc.nextInt();
    System.out.println("You entered " + n);
} catch (java.util.InputMismatchException e) {
    System.out.println("That was not a number!");
} finally {
    System.out.println("Closing scanner");
    sc.close();
}
```

**Execution flow:**
```
No exception :   try ──────────────▶ finally ──▶ continue
Exception caught: try ─(error)─▶ catch ─▶ finally ──▶ continue
Not caught:      try ─(error)─▶ finally ──▶ exception propagates upward
```

#### Handling exceptions safely — a practical example
```java
public class SafeDivide {
    public static void main(String[] args) {
        String[] inputs = {"10", "0", "abc"};

        for (String s : inputs) {
            try {
                int n = Integer.parseInt(s);
                System.out.println(100 / n);
            } catch (NumberFormatException e) {
                System.out.println("'" + s + "' is not a valid integer");
            } catch (ArithmeticException e) {
                System.out.println("Cannot divide by zero");
            } finally {
                System.out.println("Processed: " + s);
            }
        }
    }
}
```
**Output:**
```
10
Processed: 10
Cannot divide by zero
Processed: 0
'abc' is not a valid integer
Processed: abc
```

> **Bonus: try-with-resources** (Java 7+) closes resources automatically, so no explicit `finally` is needed:
> ```java
> try (Scanner sc = new Scanner(System.in)) {
>     int n = sc.nextInt();
> } catch (java.util.InputMismatchException e) {
>     System.out.println("Not a number");
> }
> ```

### 10.4 Multi-catch

#### Handling multiple exception types
You can use **several `catch` blocks**, each with different handling (shown above).

#### Using multiple exceptions in one `catch` (Java 7+)
When the **handling code is the same**, combine types with the pipe `|`:

```java
try {
    String s = args[0];
    int n = Integer.parseInt(s);
    System.out.println(10 / n);
} catch (ArrayIndexOutOfBoundsException | NumberFormatException | ArithmeticException e) {
    System.out.println("Invalid input: " + e.getMessage());
}
```

**Rules:**
- The exception types in a multi-catch **cannot be related by inheritance** (e.g., `Exception | ArithmeticException` is a compile error because `ArithmeticException` is already a subclass of `Exception`).
- The parameter `e` is **implicitly `final`** (cannot be reassigned).
- Useful to avoid duplicate code.

| Style | Use when |
|---|---|
| Separate `catch` blocks | Different exceptions need **different** handling |
| Multi-catch `A \| B` | Different exceptions need the **same** handling |

### 10.5 `throw`

The `throw` keyword **explicitly throws** an exception object from your code.

```java
throw new ExceptionType("message");
```

```java
public static void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative: " + age);
    }
    System.out.println("Age set to " + age);
}

public static void main(String[] args) {
    try {
        setAge(-5);
    } catch (IllegalArgumentException e) {
        System.out.println("Error: " + e.getMessage());   // Error: Age cannot be negative: -5
    }
}
```

**Key points:**
- `throw` is followed by **one exception object** (`throw new ...`).
- Execution **stops immediately** at the `throw` statement; control goes to the nearest matching `catch` (code after `throw` in that block is unreachable).
- You can throw built-in exceptions or your own **custom exceptions**.
- Within a `catch`, you can **rethrow** the exception: `throw e;`

#### Custom exceptions
Extend `Exception` (checked) or `RuntimeException` (unchecked):

```java
class InsufficientFundsException extends Exception {      // checked
    public InsufficientFundsException(String message) {
        super(message);
    }
}
```

### 10.6 `throws`

The `throws` keyword in a **method declaration** tells callers that **the method may throw** certain exceptions (it **passes the responsibility** of handling them to the caller).

```java
returnType methodName(parameters) throws ExceptionType1, ExceptionType2 {
    // body
}
```

**Example with a checked exception:**
```java
class BankAccount {
    private double balance;

    public BankAccount(double balance) {
        this.balance = balance;
    }

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(
                "Insufficient balance. Available: " + balance);
        }
        balance -= amount;
        System.out.println("Withdrawn: " + amount);
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);
        try {
            acc.withdraw(500);       // OK
            acc.withdraw(800);       // throws
        } catch (InsufficientFundsException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```
**Output:**
```
Withdrawn: 500.0
Error: Insufficient balance. Available: 500.0
```

If the caller neither handles nor declares a checked exception, the code **does not compile**:
```java
acc.withdraw(500);    // ERROR: unreported exception InsufficientFundsException;
                      // must be caught or declared to be thrown
```
The caller may either **catch** it (try-catch) **or** declare it in its own signature with `throws` (e.g., `public static void main(String[] args) throws InsufficientFundsException`).

#### `throw` vs `throws`

| | `throw` | `throws` |
|---|---|---|
| Purpose | **Actually throws** an exception object | **Declares** that a method may throw exceptions |
| Where | Inside a method body | In the method signature |
| Followed by | One exception **object** (`new ...`) | One or more exception **class names**, comma-separated |
| Number | Throws one exception at a time | Can declare multiple types |
| Example | `throw new ArithmeticException("bad");` | `void read() throws IOException` |

> For **unchecked** exceptions, `throws` is optional; for **checked** exceptions, you must handle them or declare them.

### 10.7 Full practical example

```java
import java.util.Scanner;
import java.util.InputMismatchException;

class InvalidMarksException extends Exception {
    public InvalidMarksException(String message) {
        super(message);
    }
}

public class ResultProcessor {

    static int readMarks(Scanner sc) throws InvalidMarksException {
        System.out.print("Enter marks (0-100): ");
        int marks = sc.nextInt();                       // may throw InputMismatchException
        if (marks < 0 || marks > 100) {
            throw new InvalidMarksException("Marks out of range: " + marks);
        }
        return marks;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        try {
            int marks = readMarks(sc);
            System.out.println("Accepted marks: " + marks);
        } catch (InvalidMarksException e) {
            System.out.println("Validation error: " + e.getMessage());
        } catch (InputMismatchException e) {
            System.out.println("Please enter a whole number");
        } finally {
            sc.close();
            System.out.println("Done");
        }
    }
}
```

**Sample runs:**
```
Enter marks (0-100): 85
Accepted marks: 85
Done

Enter marks (0-100): 150
Validation error: Marks out of range: 150
Done

Enter marks (0-100): abc
Please enter a whole number
Done
```

---

## Accuracy Notes for Exams

- **Classes vs objects:** A class is a blueprint (no memory for instance data on its own); an object is an instance created with `new` and stored on the heap. Object variables hold **references**.
- **Default constructor:** The compiler supplies a no-arg constructor **only if you write no constructor**. Writing any constructor removes it.
- **Constructor rules:** Same name as the class, no return type, not inherited. `this(...)`/`super(...)` must be the **first statement**, and only one of them can appear in a constructor.
- **Shadowing:** `name = name;` inside a constructor does **not** set the field; use `this.name = name;`.
- **`==` vs `.equals()`:** `==` compares references for objects. `.equals()` compares contents only if overridden (as in `String`).
- **`null`:** Calling a method on `null` throws `NullPointerException`. A `null` can be assigned to any reference type, never to a primitive.
- **Encapsulation:** Achieved with `private` fields plus public getters/setters; it is about **access control and data hiding**. Abstraction is about hiding **complexity**.
- **Static:** `static` members belong to the class and are shared. A static method cannot use `this` or access instance members directly.
- **Constants:** `static final` constants are named in `UPPER_CASE`. A `final` reference cannot be re-pointed, but the object it refers to can still change.
- **`toString()`:** Called implicitly by `println` and string concatenation. Override it as `public String toString()`. Without overriding, you get `ClassName@hash`.
- **Inheritance:** Java supports **single, multilevel, and hierarchical** inheritance of classes. A class cannot extend more than one class; multiple inheritance of type is achieved through **interfaces**. Constructors are not inherited, and the superclass constructor always runs first.
- **Interfaces:** Cannot be instantiated; methods are implicitly `public abstract`; fields are implicitly `public static final`; implementing methods must be declared `public`. A class may implement many interfaces.
- **Overriding:** Same signature; access cannot be more restrictive; `static`, `final`, `private` methods and constructors cannot be overridden. The version executed is decided by the **object's actual type at run time**. Fields are **not** overridden.
- **Overloading vs overriding:** Overloading = compile-time, different parameters. Overriding = run-time, same signature, needs inheritance.
- **Exceptions:** `Throwable` → `Error` and `Exception`. `RuntimeException` and its subclasses are **unchecked**; other `Exception` subclasses are **checked**. Checked exceptions must be caught or declared.
- **`catch` order:** Specific before general; the reverse is a compile error. In multi-catch, the types must not be subclass/superclass of each other.
- **`finally`:** Runs whether or not an exception occurs (even with `return`), except when the JVM exits (e.g., `System.exit()`).
- **`throw` vs `throws`:** `throw` actually throws one exception object; `throws` declares possible exception types in a method signature.
- **Division by zero:** Integer division by zero throws `ArithmeticException`; floating-point division by zero yields `Infinity`/`NaN`.

---

## Quick Recap / Cheat Sheet

- **OOP pillars:** Abstraction, Encapsulation, Inheritance, Polymorphism
- **Class** = blueprint (fields + methods); **object** = instance created with `new`; variables hold **references**
- **`null`** = no object; `.` on null → `NullPointerException`
- **Constructor:** same name as class, no return type, runs on `new`; overload with different parameters; compiler gives a default one only if you write none
- **`this`** = current object; resolves `this.x = x`; `this(...)` chains constructors (first statement)
- **Encapsulation:** `private` fields + public **getters/setters** (with validation)
- **Access:** `private` < default < `protected` < `public`
- **Instance members** → per object, via reference; **static members** → one per class, via `ClassName`
- **`static final`** = class-level constant (`UPPER_CASE`)
- **`toString()`** → override to print readable object info; used automatically by `println` and `+`
- **Inheritance:** `class B extends A`; "is-a"; `super(...)` for the parent constructor; single, multilevel, hierarchical; **no multiple class inheritance**
- **Interface:** a contract; `implements`; a class can implement many; program to the interface type
- **Overriding:** same signature in a subclass; `@Override`; **runtime polymorphism** (superclass reference, subclass object)
- **Overloading** = compile-time, different parameters; **Overriding** = run-time, same signature
- **Exceptions:** `Throwable` → `Error` | `Exception` → (checked) | `RuntimeException` (unchecked)
- **`try`** risky code; **`catch`** handle (specific first); **`finally`** always runs; **multi-catch** `A | B`
- **`throw`** = throw an exception now; **`throws`** = declare that a method may throw
- Checked exceptions must be **handled or declared**; unchecked need not be

---

*End of Module 4 Notes*