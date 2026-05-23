export const pythonLessonsContent = {
  'py-introduction': `# Introduction to Python

## What is Python?

**Python** is a high-level, interpreted programming language created by Guido van Rossum in 1991. It's known for its simple, readable syntax that makes it perfect for beginners.

## Why Learn Python?

- **#1 most popular language** (2024 Stack Overflow survey)
- Used in **web development, AI/ML, data science, automation**
- **Easy to read** — looks almost like English
- **Huge community** — millions of libraries and resources
- **High-paying jobs** — average $120K+ salary

## Python vs Other Languages

| Feature | Python | Java | C++ |
|---------|--------|------|-----|
| Syntax | Simple | Verbose | Complex |
| Typing | Dynamic | Static | Static |
| Speed | Moderate | Fast | Fastest |
| Learning Curve | Easy | Medium | Hard |

## Your First Python Program

\`\`\`python
print("Hello, World!")
\`\`\`

That's it! One line. In Java, this would be 5+ lines.

## How Python Works

1. You write code in a .py file
2. Python interpreter reads it line by line
3. Converts to bytecode
4. Executes immediately

## Python Applications

- **Web Development** — Django, Flask, FastAPI
- **Data Science** — Pandas, NumPy, Matplotlib
- **Machine Learning** — TensorFlow, PyTorch, scikit-learn
- **Automation** — Scripts, web scraping, testing
- **Game Development** — Pygame
- **Desktop Apps** — Tkinter, PyQt

## Installing Python

1. Go to python.org
2. Download Python 3.11+
3. Install (check "Add to PATH")
4. Open terminal: \`python --version\`

## Running Python Code

### Interactive Mode (REPL)
\`\`\`python
>>> 2 + 3
5
>>> print("Hello")
Hello
\`\`\`

### Script Mode
Save as \`hello.py\` and run: \`python hello.py\`
`,

  'py-variables': `# Variables & Data Types

## What is a Variable?

A **variable** is a name that stores a value in memory. Think of it as a labeled box.

\`\`\`python
name = "Alice"    # str (text)
age = 25          # int (whole number)
height = 5.7      # float (decimal)
is_student = True # bool (True/False)
\`\`\`

## Naming Rules

- Must start with letter or underscore: \`my_var\`, \`_private\`
- Can contain letters, numbers, underscores
- Case-sensitive: \`age\`, \`Age\`, \`AGE\` are different
- Cannot use Python keywords: \`if\`, \`for\`, \`class\`, etc.
- Convention: use \`snake_case\` for variables

## Data Types

### Numbers
\`\`\`python
x = 10        # int
y = 3.14      # float
z = 2 + 3j    # complex
\`\`\`

### Strings
\`\`\`python
name = "Hello"
name = 'Hello'
multi = """Multiple
lines"""
\`\`\`

### Boolean
\`\`\`python
is_active = True
is_deleted = False
\`\`\`

### None
\`\`\`python
result = None  # No value assigned
\`\`\`

## Type Checking

\`\`\`python
x = 42
print(type(x))  # <class 'int'>

name = "Alice"
print(type(name))  # <class 'str'>
\`\`\`

## Type Conversion

\`\`\`python
# String to int
age = int("25")      # 25

# Int to string
text = str(100)      # "100"

# String to float
price = float("9.99")  # 9.99

# Float to int (truncates)
whole = int(3.7)     # 3
\`\`\`

## Multiple Assignment

\`\`\`python
# Assign multiple variables at once
x, y, z = 1, 2, 3

# Same value to multiple variables
a = b = c = 0
\`\`\`

## Constants (Convention)

\`\`\`python
# Use ALL_CAPS for constants (Python doesn't enforce this)
PI = 3.14159
MAX_SIZE = 100
API_KEY = "abc123"
\`\`\`
`,

  'py-operators': `# Operators in Python

## Arithmetic Operators

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| + | Addition | 5 + 3 | 8 |
| - | Subtraction | 10 - 4 | 6 |
| * | Multiplication | 3 * 4 | 12 |
| / | Division | 10 / 3 | 3.333 |
| // | Floor Division | 10 // 3 | 3 |
| % | Modulus | 10 % 3 | 1 |
| ** | Exponent | 2 ** 3 | 8 |

\`\`\`python
print(10 / 3)   # 3.3333 (float division)
print(10 // 3)  # 3 (floor division)
print(10 % 3)   # 1 (remainder)
print(2 ** 10)  # 1024 (power)
\`\`\`

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| == | Equal | 5 == 5 → True |
| != | Not equal | 5 != 3 → True |
| > | Greater than | 5 > 3 → True |
| < | Less than | 3 < 5 → True |
| >= | Greater or equal | 5 >= 5 → True |
| <= | Less or equal | 3 <= 5 → True |

## Logical Operators

\`\`\`python
# and — both must be True
True and True   # True
True and False  # False

# or — at least one True
True or False   # True
False or False  # False

# not — reverses
not True   # False
not False  # True
\`\`\`

## Assignment Operators

\`\`\`python
x = 10
x += 5   # x = x + 5 → 15
x -= 3   # x = x - 3 → 12
x *= 2   # x = x * 2 → 24
x /= 4   # x = x / 4 → 6.0
x //= 2  # x = x // 2 → 3.0
x **= 2  # x = x ** 2 → 9.0
\`\`\`

## Membership Operators

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print("apple" in fruits)      # True
print("grape" not in fruits)  # True
\`\`\`

## Identity Operators

\`\`\`python
a = [1, 2, 3]
b = a        # Same object
c = [1, 2, 3]  # Different object, same value

print(a is b)      # True (same object)
print(a is c)      # False (different objects)
print(a == c)      # True (same value)
\`\`\`
`,
};

export const pythonModuleTests = {
  'py-introduction': {
    questions: [
      { q: "Who created Python?", options: ["James Gosling", "Guido van Rossum", "Dennis Ritchie", "Bjarne Stroustrup"], answer: 1 },
      { q: "Python is a:", options: ["Compiled language", "Interpreted language", "Assembly language", "Markup language"], answer: 1 },
      { q: "Which is NOT a Python use case?", options: ["Web development", "Machine Learning", "Operating System kernel", "Data Science"], answer: 2 },
      { q: "What does print('Hello') do?", options: ["Saves to file", "Displays Hello on screen", "Creates a variable", "Nothing"], answer: 1 },
    ]
  },
  'py-variables': {
    questions: [
      { q: "Which is a valid variable name?", options: ["2name", "my-var", "_count", "class"], answer: 2 },
      { q: "What type is x = 3.14?", options: ["int", "str", "float", "bool"], answer: 2 },
      { q: "What does type(42) return?", options: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "42"], answer: 1 },
      { q: "int('3.14') will:", options: ["Return 3", "Return 3.14", "Raise an error", "Return '3.14'"], answer: 2 },
    ]
  },
  'py-operators': {
    questions: [
      { q: "What is 10 // 3?", options: ["3.33", "3", "4", "1"], answer: 1 },
      { q: "What is 2 ** 4?", options: ["8", "16", "6", "24"], answer: 1 },
      { q: "True and False equals:", options: ["True", "False", "None", "Error"], answer: 1 },
      { q: "What does 'in' operator check?", options: ["Data type", "Membership in a sequence", "Identity", "Equality"], answer: 1 },
    ]
  },
  'py-strings': {
    questions: [
      { q: "How to get length of string s?", options: ["s.length", "len(s)", "s.size()", "length(s)"], answer: 1 },
      { q: "'Hello'[1] returns:", options: ["H", "e", "l", "Error"], answer: 1 },
      { q: "f'Hi {name}' is called:", options: ["Concatenation", "f-string", "Template", "Raw string"], answer: 1 },
      { q: "'hello'.upper() returns:", options: ["'Hello'", "'HELLO'", "'hello'", "Error"], answer: 1 },
    ]
  },
  'py-input-output': {
    questions: [
      { q: "input() always returns:", options: ["int", "float", "str", "bool"], answer: 2 },
      { q: "print(1, 2, 3, sep='-') outputs:", options: ["1 2 3", "1-2-3", "123", "1,2,3"], answer: 1 },
      { q: "\\n in a string means:", options: ["Nothing", "New line", "Null", "Number"], answer: 1 },
    ]
  },
  'py-if-else': {
    questions: [
      { q: "What keyword handles additional conditions?", options: ["else if", "elif", "elseif", "elsif"], answer: 1 },
      { q: "if x > 5: — what's required after the colon?", options: ["Semicolon", "Indented block", "Curly braces", "Nothing"], answer: 1 },
      { q: "x = 5; 'big' if x > 3 else 'small' returns:", options: ["'big'", "'small'", "Error", "None"], answer: 0 },
    ]
  },
  'py-for-loops': {
    questions: [
      { q: "range(5) produces:", options: ["1,2,3,4,5", "0,1,2,3,4", "0,1,2,3,4,5", "5"], answer: 1 },
      { q: "What does 'break' do?", options: ["Skips iteration", "Exits the loop", "Pauses loop", "Restarts loop"], answer: 1 },
      { q: "for i in range(2, 10, 3) — values of i:", options: ["2,5,8", "2,3,4", "2,4,6,8", "3,6,9"], answer: 0 },
    ]
  },
  'py-while-loops': {
    questions: [
      { q: "While loop runs as long as:", options: ["Counter reaches 0", "Condition is True", "List is empty", "Always"], answer: 1 },
      { q: "'continue' in a loop:", options: ["Exits loop", "Skips to next iteration", "Pauses", "Breaks"], answer: 1 },
      { q: "What causes an infinite loop?", options: ["break statement", "Condition never becomes False", "Using range()", "return"], answer: 1 },
    ]
  },
  'py-comprehensions': {
    questions: [
      { q: "[x*2 for x in range(3)] equals:", options: ["[0,2,4]", "[2,4,6]", "[1,2,3]", "[0,1,2]"], answer: 0 },
      { q: "List comprehension is equivalent to:", options: ["while loop", "for loop + append", "recursion", "map only"], answer: 1 },
      { q: "{k:v for k,v in items} creates a:", options: ["List", "Set", "Dictionary", "Tuple"], answer: 2 },
    ]
  },
  'py-lists': {
    questions: [
      { q: "Lists are:", options: ["Immutable", "Mutable (changeable)", "Fixed size", "Only numbers"], answer: 1 },
      { q: "my_list[-1] returns:", options: ["First element", "Last element", "Error", "None"], answer: 1 },
      { q: "append() vs extend():", options: ["Same thing", "append adds one item, extend adds multiple", "extend is faster", "append returns new list"], answer: 1 },
      { q: "my_list[1:4] returns:", options: ["Elements at index 1,2,3", "Elements at index 1,2,3,4", "Element at index 4", "Error"], answer: 0 },
    ]
  },
  'py-tuples': {
    questions: [
      { q: "Tuples are:", options: ["Mutable", "Immutable", "Unordered", "Key-value pairs"], answer: 1 },
      { q: "Single element tuple:", options: ["(1)", "(1,)", "[1]", "{1}"], answer: 1 },
      { q: "a, b = (1, 2) is called:", options: ["Casting", "Unpacking", "Slicing", "Indexing"], answer: 1 },
    ]
  },
  'py-dictionaries': {
    questions: [
      { q: "Dictionaries store:", options: ["Ordered items", "Key-value pairs", "Only strings", "Unique numbers"], answer: 1 },
      { q: "Access value: d['key'] vs d.get('key'):", options: ["Same always", "get() returns None if key missing, [] raises error", "[] is faster", "get() is deprecated"], answer: 1 },
      { q: "d.keys() returns:", options: ["List of values", "List of keys", "List of tuples", "Integer"], answer: 1 },
    ]
  },
  'py-sets': {
    questions: [
      { q: "Sets contain:", options: ["Duplicates allowed", "Only unique values", "Key-value pairs", "Ordered items"], answer: 1 },
      { q: "set1 & set2 returns:", options: ["Union", "Intersection", "Difference", "Error"], answer: 1 },
      { q: "Can sets contain lists?", options: ["Yes", "No (unhashable)", "Only empty lists", "Depends"], answer: 1 },
    ]
  },
  'py-functions-basics': {
    questions: [
      { q: "Keyword to define a function:", options: ["function", "def", "func", "define"], answer: 1 },
      { q: "Function without return gives:", options: ["0", "''", "None", "Error"], answer: 2 },
      { q: "What is a docstring?", options: ["Comment", "Documentation string inside function", "Variable name", "Import"], answer: 1 },
    ]
  },
  'py-args-kwargs': {
    questions: [
      { q: "*args collects:", options: ["Keyword arguments", "Positional arguments as tuple", "A single argument", "Nothing"], answer: 1 },
      { q: "**kwargs collects:", options: ["Positional args", "Keyword arguments as dict", "All arguments", "Errors"], answer: 1 },
      { q: "def f(a, b=5): — b is:", options: ["Required", "Default parameter", "Keyword-only", "Positional-only"], answer: 1 },
    ]
  },
  'py-lambda': {
    questions: [
      { q: "lambda x: x*2 is:", options: ["Named function", "Anonymous function", "Class", "Module"], answer: 1 },
      { q: "map(func, list) returns:", options: ["New list", "Map object (iterator)", "None", "Dictionary"], answer: 1 },
      { q: "filter(lambda x: x>3, [1,2,3,4,5]) gives:", options: ["[1,2,3]", "[4,5]", "[3,4,5]", "Error"], answer: 1 },
    ]
  },
  'py-classes': {
    questions: [
      { q: "__init__ is:", options: ["Destructor", "Constructor", "Static method", "Class method"], answer: 1 },
      { q: "'self' refers to:", options: ["The class", "The current instance", "Parent class", "Nothing"], answer: 1 },
      { q: "class Dog: pass — creates:", options: ["Function", "Empty class", "Error", "Module"], answer: 1 },
    ]
  },
  'py-inheritance': {
    questions: [
      { q: "class Child(Parent): means:", options: ["Child contains Parent", "Child inherits from Parent", "Parent inherits from Child", "Error"], answer: 1 },
      { q: "super().__init__() calls:", options: ["Child's init", "Parent's init", "Both inits", "Nothing"], answer: 1 },
      { q: "Python supports:", options: ["Single inheritance only", "Multiple inheritance", "No inheritance", "Interface only"], answer: 1 },
    ]
  },
};
