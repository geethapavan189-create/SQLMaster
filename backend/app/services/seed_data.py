"""Comprehensive seed data for SQLMaster platform."""
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizQuestion
from app.models.problem import Problem
from app.models.progress import Achievement
from app.models.challenge import DailyChallenge
from app.core.security import hash_password
from app.models.user import User
from datetime import date, timedelta


def get_all_lessons():
    """Return all lesson data organized by difficulty."""
    return [
        # ============================================================
        # BEGINNER LESSONS - Fundamentals
        # ============================================================
        {
            "title": "Introduction to Databases",
            "slug": "introduction-to-databases",
            "description": "Understand what databases are, why they exist, and how they power every application you use daily.",
            "difficulty": "beginner",
            "category": "Getting Started",
            "order_index": 1,
            "estimated_time": 15,
            "content": """# Introduction to Databases

## What is a Database?

A **database** is an organized collection of data stored and accessed electronically. Think of it like a super-powered spreadsheet that can handle millions of records and let multiple people access it simultaneously.

## Real-World Examples

Every app you use relies on databases:

| Application | What's Stored |
|-------------|---------------|
| Instagram | Posts, comments, likes, followers |
| Amazon | Products, orders, customers, reviews |
| Spotify | Songs, playlists, user preferences |
| Your Bank | Accounts, transactions, balances |

## Types of Databases

### Relational Databases (What we'll learn!)
- Store data in **tables** (like spreadsheets)
- Tables are connected through **relationships**
- Use **SQL** to query data
- Examples: PostgreSQL, MySQL, SQLite, SQL Server, Oracle

### NoSQL Databases
- Store data in flexible formats (documents, key-value, graphs)
- Examples: MongoDB, Redis, Cassandra

## Key Terminology

| Term | Meaning | Real-World Analogy |
|------|---------|-------------------|
| **Database** | Collection of related tables | A filing cabinet |
| **Table** | Collection of rows and columns | A single spreadsheet |
| **Row** (Record) | One entry in a table | One line in a spreadsheet |
| **Column** (Field) | One attribute/property | A column header |
| **Primary Key** | Unique identifier for each row | Student ID number |
| **Foreign Key** | Reference to another table | "See file #123" |

## How Data is Organized

Imagine a school database:

**Students Table:**
| id | name | age | grade |
|----|------|-----|-------|
| 1 | Alice | 20 | A |
| 2 | Bob | 21 | B |
| 3 | Carol | 19 | A |

**Courses Table:**
| id | course_name | instructor |
|----|-------------|-----------|
| 1 | Math 101 | Dr. Smith |
| 2 | English 201 | Prof. Jones |

These tables can be **linked** together — that's the power of relational databases!

## Why Learn Databases?

1. **Every application needs one** — web, mobile, desktop
2. **High-demand skill** — required for most tech jobs
3. **Data is everywhere** — understanding it gives you power
4. **Foundation for data science** — analytics, ML, AI all start here
""",
            "examples": [
                {"title": "View All Employees", "code": "-- See all data in the employees table\\nSELECT * FROM employees;"},
                {"title": "View Table Structure", "code": "-- See what columns a table has\\nSELECT * FROM employees LIMIT 3;"},
                {"title": "Count Records", "code": "-- How many employees are there?\\nSELECT COUNT(*) AS total_employees FROM employees;"},
                {"title": "View Departments", "code": "-- See all departments\\nSELECT * FROM departments;"},
            ],
            "syntax": None,
            "tips": [
                "A database is NOT just one table — it's a collection of related tables",
                "SQL is the language we use to talk to relational databases",
                "You don't need to memorize everything — practice makes perfect",
                "Every major company uses SQL databases"
            ],
        },
        {
            "title": "What is SQL?",
            "slug": "what-is-sql",
            "description": "Learn about SQL — the universal language for communicating with databases.",
            "difficulty": "beginner",
            "category": "Getting Started",
            "order_index": 2,
            "estimated_time": 12,
            "content": """# What is SQL?

## SQL = Structured Query Language

**SQL** (pronounced "sequel" or "S-Q-L") is the standard language for managing relational databases. Created in the 1970s, it's still the #1 language for data.

## What Can SQL Do?

- ✅ **Retrieve** data from databases (SELECT)
- ✅ **Insert** new records (INSERT)
- ✅ **Update** existing records (UPDATE)
- ✅ **Delete** records (DELETE)
- ✅ **Create** new tables and databases (CREATE)
- ✅ **Control** who can access data (GRANT/REVOKE)

## SQL Statement Categories

### DDL — Data Definition Language
*Defines the structure of your database*
```sql
CREATE TABLE ...   -- Create a new table
ALTER TABLE ...    -- Modify table structure
DROP TABLE ...     -- Delete a table
```

### DML — Data Manipulation Language
*Works with the data inside tables*
```sql
SELECT ...   -- Retrieve data
INSERT ...   -- Add new data
UPDATE ...   -- Change existing data
DELETE ...   -- Remove data
```

### DCL — Data Control Language
*Controls access permissions*
```sql
GRANT ...    -- Give permissions
REVOKE ...   -- Remove permissions
```

## Your First SQL Query

```sql
SELECT * FROM employees;
```

Let's break this down:
- `SELECT` → "I want to retrieve data"
- `*` → "Give me ALL columns"
- `FROM employees` → "From the employees table"

It's like saying: *"Show me everything in the employees table"*

## SQL Syntax Rules

1. **SQL is NOT case-sensitive** — `SELECT` = `select` = `Select`
2. **Convention**: Write keywords in UPPERCASE for readability
3. **End statements with semicolon** (;)
4. **Whitespace doesn't matter** — format for readability
5. **Single quotes** for text values: `'Hello'`

## Why SQL is Amazing

| Feature | Benefit |
|---------|---------|
| Universal | Works on PostgreSQL, MySQL, SQLite, etc. |
| Declarative | You say WHAT you want, not HOW to get it |
| Powerful | Can process millions of rows in seconds |
| Readable | Almost like English! |
| In-demand | Required for 50%+ of tech jobs |
""",
            "examples": [
                {"title": "Select All Data", "code": "-- Get everything from a table\\nSELECT * FROM employees;"},
                {"title": "Select Specific Columns", "code": "-- Get only names and salaries\\nSELECT first_name, salary FROM employees;"},
                {"title": "Filter with WHERE", "code": "-- Get employees in department 5\\nSELECT * FROM employees\\nWHERE department_id = 5;"},
                {"title": "Sort Results", "code": "-- Get employees sorted by salary (highest first)\\nSELECT * FROM employees\\nORDER BY salary DESC;"},
                {"title": "Count Records", "code": "-- How many employees do we have?\\nSELECT COUNT(*) FROM employees;"},
            ],
            "syntax": "SELECT column1, column2 FROM table_name;",
            "tips": [
                "SQL keywords are case-insensitive but UPPERCASE is convention",
                "Always end your SQL statements with a semicolon (;)",
                "Start with SELECT — it's the most used SQL command",
                "You'll write SQL every day as a developer or data analyst"
            ],
        },
        {
            "title": "SQL SELECT Statement",
            "slug": "sql-select",
            "description": "Master the SELECT statement — the most important and frequently used SQL command.",
            "difficulty": "beginner",
            "category": "Querying Data",
            "order_index": 3,
            "estimated_time": 20,
            "content": """# The SELECT Statement

## Overview

The `SELECT` statement is used to retrieve data from a database. It's the command you'll use most often — probably 80% of all SQL you write will start with SELECT.

## Basic Syntax

```sql
SELECT column1, column2, ...
FROM table_name;
```

## Select ALL Columns

The asterisk (*) means "all columns":

```sql
SELECT * FROM customers;
```

**Result:**
| id | name | email | city |
|----|------|-------|------|
| 1 | John | john@email.com | New York |
| 2 | Sarah | sarah@email.com | London |
| 3 | Mike | mike@email.com | Tokyo |

## Select SPECIFIC Columns

Only get the columns you need:

```sql
SELECT name, email FROM customers;
```

**Result:**
| name | email |
|------|-------|
| John | john@email.com |
| Sarah | sarah@email.com |
| Mike | mike@email.com |

## Column Aliases (AS)

Rename columns in your output:

```sql
SELECT 
  first_name AS "First Name",
  last_name AS "Last Name",
  salary AS "Annual Salary"
FROM employees;
```

## Calculations in SELECT

You can do math!

```sql
SELECT 
  name,
  price,
  price * 0.9 AS discounted_price,
  price * quantity AS total_value
FROM products;
```

## String Concatenation

Combine text columns:

```sql
SELECT 
  first_name || ' ' || last_name AS full_name
FROM employees;
```

## SELECT DISTINCT

Remove duplicate values:

```sql
-- How many unique cities do our customers live in?
SELECT DISTINCT city FROM customers;
```

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| Select only columns you need | Use SELECT * in production |
| Use meaningful aliases | Leave confusing column names |
| Format queries neatly | Write everything on one line |

## Execution Order

SQL doesn't execute top-to-bottom. The actual order is:
1. `FROM` — Which table?
2. `WHERE` — Filter rows
3. `GROUP BY` — Group rows
4. `HAVING` — Filter groups
5. `SELECT` — Choose columns
6. `ORDER BY` — Sort results
7. `LIMIT` — Limit rows
""",
            "examples": [
                {"title": "Select All Columns", "code": "SELECT * FROM employees;"},
                {"title": "Select Specific Columns", "code": "SELECT first_name, last_name, email\\nFROM employees;"},
                {"title": "Using Aliases", "code": "SELECT \\n  first_name AS name,\\n  salary * 12 AS annual_salary\\nFROM employees;"},
                {"title": "DISTINCT Values", "code": "-- Get unique departments\\nSELECT DISTINCT department_id\\nFROM employees;"},
                {"title": "Calculations", "code": "SELECT \\n  name,\\n  price,\\n  price * 1.1 AS price_with_tax\\nFROM products;"},
                {"title": "String Concatenation", "code": "SELECT \\n  first_name || ' ' || last_name AS full_name,\\n  email\\nFROM employees;"},
            ],
            "syntax": "SELECT [DISTINCT] column1 [AS alias], column2\\nFROM table_name;",
            "tips": [
                "SELECT * is fine for exploring, but specify columns in production code",
                "Use aliases to make your output more readable",
                "DISTINCT removes duplicate rows from results",
                "You can do math and string operations right in SELECT"
            ],
        },
        {
            "title": "SQL WHERE Clause",
            "slug": "sql-where",
            "description": "Filter data using conditions — get exactly the rows you need.",
            "difficulty": "beginner",
            "category": "Querying Data",
            "order_index": 4,
            "estimated_time": 25,
            "content": """# The WHERE Clause

## Overview

The `WHERE` clause filters rows based on conditions. Only rows that match your condition are returned.

## Basic Syntax

```sql
SELECT columns
FROM table_name
WHERE condition;
```

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` | Equal to | `WHERE age = 25` |
| `!=` or `<>` | Not equal | `WHERE city != 'London'` |
| `>` | Greater than | `WHERE salary > 50000` |
| `<` | Less than | `WHERE age < 30` |
| `>=` | Greater or equal | `WHERE price >= 10` |
| `<=` | Less or equal | `WHERE stock <= 100` |

## Text Filtering

Use single quotes for text values:

```sql
SELECT * FROM customers
WHERE city = 'New York';

SELECT * FROM employees
WHERE department = 'Engineering';
```

## Numeric Filtering

No quotes needed for numbers:

```sql
SELECT * FROM products
WHERE price > 29.99;

SELECT * FROM employees
WHERE salary >= 60000;
```

## Logical Operators

### AND — Both conditions must be true
```sql
SELECT * FROM employees
WHERE department = 'Sales' AND salary > 50000;
```

### OR — At least one condition must be true
```sql
SELECT * FROM employees
WHERE department = 'Sales' OR department = 'Marketing';
```

### NOT — Reverses the condition
```sql
SELECT * FROM employees
WHERE NOT department = 'HR';
```

### Combining AND, OR (use parentheses!)
```sql
SELECT * FROM employees
WHERE (department = 'Sales' OR department = 'Marketing')
  AND salary > 50000;
```

## Special Operators

### BETWEEN — Range of values (inclusive)
```sql
SELECT * FROM products
WHERE price BETWEEN 10 AND 50;
-- Same as: price >= 10 AND price <= 50
```

### IN — Match any value in a list
```sql
SELECT * FROM employees
WHERE department IN ('Sales', 'Marketing', 'HR');
-- Same as: dept = 'Sales' OR dept = 'Marketing' OR dept = 'HR'
```

### LIKE — Pattern matching
```sql
-- Names starting with 'J'
SELECT * FROM employees WHERE name LIKE 'J%';

-- Names ending with 'son'
SELECT * FROM employees WHERE name LIKE '%son';

-- Names containing 'ar'
SELECT * FROM employees WHERE name LIKE '%ar%';

-- Exactly 4 characters
SELECT * FROM employees WHERE name LIKE '____';
```

**Pattern wildcards:**
- `%` = any number of characters (including zero)
- `_` = exactly one character

### IS NULL / IS NOT NULL
```sql
-- Find employees without a manager
SELECT * FROM employees WHERE manager_id IS NULL;

-- Find employees WITH a phone number
SELECT * FROM employees WHERE phone IS NOT NULL;
```

⚠️ **Important:** Never use `= NULL`. Always use `IS NULL`!
""",
            "examples": [
                {"title": "Simple Comparison", "code": "SELECT * FROM employees\\nWHERE salary > 50000;"},
                {"title": "Text Filter", "code": "SELECT * FROM customers\\nWHERE country = 'USA';"},
                {"title": "AND Operator", "code": "SELECT * FROM employees\\nWHERE department_id = 3\\n  AND salary >= 60000;"},
                {"title": "OR Operator", "code": "SELECT * FROM products\\nWHERE category = 'Electronics'\\n   OR category = 'Computers';"},
                {"title": "BETWEEN", "code": "SELECT * FROM orders\\nWHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';"},
                {"title": "IN Operator", "code": "SELECT * FROM employees\\nWHERE job_title IN ('Manager', 'Director', 'VP');"},
                {"title": "LIKE Pattern", "code": "-- Find emails from gmail\\nSELECT * FROM customers\\nWHERE email LIKE '%@gmail.com';"},
                {"title": "IS NULL", "code": "-- Employees without a department\\nSELECT * FROM employees\\nWHERE department_id IS NULL;"},
            ],
            "syntax": "SELECT columns FROM table\\nWHERE condition1 [AND|OR] condition2;",
            "tips": [
                "Use single quotes for text values: WHERE name = 'John'",
                "Use IS NULL, never = NULL",
                "BETWEEN is inclusive on both ends",
                "Use parentheses when mixing AND and OR",
                "LIKE with % is powerful for searching text"
            ],
        },
        {
            "title": "SQL ORDER BY",
            "slug": "sql-order-by",
            "description": "Sort your query results in any order you want.",
            "difficulty": "beginner",
            "category": "Querying Data",
            "order_index": 5,
            "estimated_time": 12,
            "content": """# ORDER BY Clause

## Overview

`ORDER BY` sorts the result set. Without it, SQL returns rows in no guaranteed order.

## Syntax

```sql
SELECT columns
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC];
```

## Sorting Direction

- **ASC** (default) — Ascending: A→Z, 0→9, oldest→newest
- **DESC** — Descending: Z→A, 9→0, newest→oldest

## Examples

### Sort alphabetically
```sql
SELECT * FROM employees
ORDER BY last_name ASC;
```

### Sort by salary (highest first)
```sql
SELECT * FROM employees
ORDER BY salary DESC;
```

### Sort by multiple columns
```sql
-- First by department, then by salary within each department
SELECT * FROM employees
ORDER BY department_id ASC, salary DESC;
```

### Sort by alias/expression
```sql
SELECT name, price * quantity AS total
FROM products
ORDER BY total DESC;
```

### Sort by column position
```sql
-- Sort by the 3rd column in SELECT
SELECT first_name, last_name, salary
FROM employees
ORDER BY 3 DESC;
```

## NULL Values in Sorting

- In ASC order: NULLs appear **last** (in most databases)
- In DESC order: NULLs appear **first**

## Common Patterns

```sql
-- Latest orders first
SELECT * FROM orders ORDER BY order_date DESC;

-- Top 10 highest paid
SELECT * FROM employees ORDER BY salary DESC LIMIT 10;

-- Alphabetical customer list
SELECT * FROM customers ORDER BY name ASC;
```
""",
            "examples": [
                {"title": "Ascending (A-Z)", "code": "SELECT * FROM employees\\nORDER BY last_name ASC;"},
                {"title": "Descending (highest first)", "code": "SELECT * FROM employees\\nORDER BY salary DESC;"},
                {"title": "Multiple Columns", "code": "SELECT * FROM employees\\nORDER BY department_id ASC, salary DESC;"},
                {"title": "Sort by Expression", "code": "SELECT name, price, quantity,\\n  price * quantity AS total\\nFROM products\\nORDER BY total DESC;"},
            ],
            "syntax": "SELECT columns FROM table\\nORDER BY column [ASC|DESC];",
            "tips": [
                "ASC is the default — you can omit it",
                "Always use ORDER BY if you need a specific order",
                "You can sort by columns not in your SELECT",
                "Combine with LIMIT to get 'top N' results"
            ],
        },
        {
            "title": "SQL LIMIT & OFFSET",
            "slug": "sql-limit-offset",
            "description": "Control how many rows are returned and implement pagination.",
            "difficulty": "beginner",
            "category": "Querying Data",
            "order_index": 6,
            "estimated_time": 10,
            "content": """# LIMIT and OFFSET

## LIMIT — Restrict Number of Rows

```sql
-- Get only the first 5 rows
SELECT * FROM employees
LIMIT 5;
```

## OFFSET — Skip Rows

```sql
-- Skip first 10 rows, then get 5
SELECT * FROM employees
LIMIT 5 OFFSET 10;
```

## Common Use Cases

### Top N Results
```sql
-- Top 3 highest salaries
SELECT * FROM employees
ORDER BY salary DESC
LIMIT 3;
```

### Pagination
```sql
-- Page 1 (rows 1-10)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 0;

-- Page 2 (rows 11-20)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;

-- Page 3 (rows 21-30)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;
```

### Formula: `OFFSET = (page_number - 1) * page_size`

### Single Row
```sql
-- Get the newest order
SELECT * FROM orders
ORDER BY order_date DESC
LIMIT 1;
```

## Important Notes

- LIMIT without ORDER BY gives unpredictable results
- Always combine LIMIT with ORDER BY
- OFFSET 0 is the same as no OFFSET
- Large OFFSET values can be slow on big tables
""",
            "examples": [
                {"title": "First 10 Rows", "code": "SELECT * FROM employees\\nLIMIT 10;"},
                {"title": "Top 5 Salaries", "code": "SELECT * FROM employees\\nORDER BY salary DESC\\nLIMIT 5;"},
                {"title": "Pagination (Page 2)", "code": "SELECT * FROM products\\nORDER BY id\\nLIMIT 10 OFFSET 10;"},
                {"title": "Single Newest Record", "code": "SELECT * FROM orders\\nORDER BY created_at DESC\\nLIMIT 1;"},
            ],
            "syntax": "SELECT columns FROM table\\n[ORDER BY column]\\nLIMIT count [OFFSET skip];",
            "tips": [
                "Always use ORDER BY with LIMIT for predictable results",
                "LIMIT is essential for pagination in web apps",
                "OFFSET = (page - 1) * page_size"
            ],
        },
        {
            "title": "SQL INSERT INTO",
            "slug": "sql-insert",
            "description": "Add new records to your database tables.",
            "difficulty": "beginner",
            "category": "Modifying Data",
            "order_index": 9,
            "estimated_time": 15,
            "content": """# INSERT INTO Statement

## Overview

`INSERT INTO` adds new rows to a table.

## Syntax 1: Specify Columns

```sql
INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3);
```

## Syntax 2: All Columns (in order)

```sql
INSERT INTO table_name
VALUES (value1, value2, value3, ...);
```

## Examples

### Insert a single row
```sql
INSERT INTO customers (name, email, city)
VALUES ('John Smith', 'john@email.com', 'New York');
```

### Insert multiple rows
```sql
INSERT INTO products (name, price, category)
VALUES 
  ('Laptop', 999.99, 'Electronics'),
  ('Mouse', 29.99, 'Electronics'),
  ('Desk', 249.99, 'Furniture');
```

### Insert with NULL values
```sql
INSERT INTO employees (first_name, last_name, email, phone)
VALUES ('Jane', 'Doe', 'jane@company.com', NULL);
```

### Insert from another table
```sql
INSERT INTO archived_orders (id, customer_id, total)
SELECT id, customer_id, total_amount
FROM orders
WHERE order_date < '2023-01-01';
```

## Important Rules

1. Values must match the column data types
2. Required (NOT NULL) columns must have values
3. Text values need single quotes: `'Hello'`
4. Numbers don't need quotes: `42`, `99.99`
5. Use NULL for missing/unknown values
""",
            "examples": [
                {"title": "Insert One Row", "code": "INSERT INTO customers (name, email, city)\\nVALUES ('Alice Johnson', 'alice@email.com', 'Chicago');"},
                {"title": "Insert Multiple Rows", "code": "INSERT INTO products (name, price, stock)\\nVALUES \\n  ('Keyboard', 49.99, 100),\\n  ('Monitor', 299.99, 50),\\n  ('Headphones', 79.99, 200);"},
                {"title": "Insert from SELECT", "code": "INSERT INTO vip_customers (name, email)\\nSELECT name, email FROM customers\\nWHERE total_purchases > 10000;"},
            ],
            "syntax": "INSERT INTO table (col1, col2)\\nVALUES (val1, val2);",
            "tips": [
                "Always specify column names for clarity",
                "Use single quotes for text, no quotes for numbers",
                "You can insert multiple rows in one statement",
                "NULL means 'no value' or 'unknown'"
            ],
        },
        {
            "title": "SQL UPDATE Statement",
            "slug": "sql-update",
            "description": "Modify existing records in your database.",
            "difficulty": "beginner",
            "category": "Modifying Data",
            "order_index": 10,
            "estimated_time": 15,
            "content": """# UPDATE Statement

## Overview

`UPDATE` modifies existing rows in a table.

## Syntax

```sql
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
```

⚠️ **WARNING:** Always use WHERE! Without it, ALL rows get updated!

## Examples

### Update a single row
```sql
UPDATE employees
SET salary = 75000
WHERE id = 42;
```

### Update multiple columns
```sql
UPDATE employees
SET salary = 80000, department_id = 5
WHERE id = 42;
```

### Update multiple rows
```sql
-- Give everyone in Sales a 10% raise
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Sales';
```

### Update with calculation
```sql
-- Increase all prices by 5%
UPDATE products
SET price = price * 1.05;
```

### Update based on another condition
```sql
UPDATE orders
SET status = 'shipped'
WHERE status = 'processing' AND order_date < '2024-01-01';
```

## ⚠️ Common Mistakes

```sql
-- DANGEROUS! Updates ALL rows!
UPDATE employees SET salary = 0;

-- SAFE: Only updates one employee
UPDATE employees SET salary = 0 WHERE id = 1;
```

## Best Practice

Always run a SELECT first to verify which rows will be affected:

```sql
-- Step 1: Check what will be updated
SELECT * FROM employees WHERE department = 'Sales';

-- Step 2: If correct, run the update
UPDATE employees SET salary = salary * 1.10 WHERE department = 'Sales';
```
""",
            "examples": [
                {"title": "Update One Row", "code": "UPDATE employees\\nSET salary = 75000\\nWHERE id = 1;"},
                {"title": "Update Multiple Columns", "code": "UPDATE customers\\nSET city = 'San Francisco', country = 'USA'\\nWHERE id = 5;"},
                {"title": "Update with Calculation", "code": "-- 10% raise for Engineering\\nUPDATE employees\\nSET salary = salary * 1.10\\nWHERE department_id = 3;"},
                {"title": "Update Multiple Rows", "code": "UPDATE orders\\nSET status = 'cancelled'\\nWHERE status = 'pending'\\n  AND order_date < '2024-01-01';"},
            ],
            "syntax": "UPDATE table SET col = value\\nWHERE condition;",
            "tips": [
                "ALWAYS use WHERE unless you want to update every row",
                "Run a SELECT first to preview affected rows",
                "You can use calculations: SET price = price * 1.1",
                "Multiple columns: SET col1 = val1, col2 = val2"
            ],
        },
        {
            "title": "SQL DELETE Statement",
            "slug": "sql-delete",
            "description": "Remove records from your database safely.",
            "difficulty": "beginner",
            "category": "Modifying Data",
            "order_index": 11,
            "estimated_time": 12,
            "content": """# DELETE Statement

## Overview

`DELETE` removes rows from a table.

## Syntax

```sql
DELETE FROM table_name
WHERE condition;
```

⚠️ **WARNING:** Without WHERE, ALL rows are deleted!

## Examples

### Delete specific rows
```sql
DELETE FROM orders
WHERE status = 'cancelled';
```

### Delete one row
```sql
DELETE FROM customers
WHERE id = 42;
```

### Delete with multiple conditions
```sql
DELETE FROM products
WHERE stock = 0 AND discontinued = true;
```

## DELETE vs TRUNCATE vs DROP

| Command | What it does | Can undo? |
|---------|-------------|-----------|
| `DELETE` | Removes specific rows | Yes (with transaction) |
| `TRUNCATE` | Removes ALL rows (fast) | No |
| `DROP` | Removes entire table | No |

```sql
-- Delete some rows
DELETE FROM orders WHERE year = 2020;

-- Delete ALL rows (but keep table)
TRUNCATE TABLE temp_data;

-- Delete the entire table
DROP TABLE temp_data;
```

## Safety First!

```sql
-- Step 1: See what will be deleted
SELECT * FROM orders WHERE status = 'cancelled';

-- Step 2: If correct, delete
DELETE FROM orders WHERE status = 'cancelled';
```
""",
            "examples": [
                {"title": "Delete Specific Rows", "code": "DELETE FROM orders\\nWHERE status = 'cancelled';"},
                {"title": "Delete One Record", "code": "DELETE FROM customers\\nWHERE id = 42;"},
                {"title": "Delete Old Records", "code": "DELETE FROM logs\\nWHERE created_at < '2023-01-01';"},
                {"title": "Delete with Subquery", "code": "DELETE FROM employees\\nWHERE department_id IN (\\n  SELECT id FROM departments\\n  WHERE name = 'Closed Division'\\n);"},
            ],
            "syntax": "DELETE FROM table\\nWHERE condition;",
            "tips": [
                "ALWAYS use WHERE with DELETE",
                "Run SELECT first to verify what will be deleted",
                "DELETE is reversible within a transaction",
                "Use TRUNCATE to quickly remove all rows"
            ],
        },
        {
            "title": "SQL NULL Values",
            "slug": "sql-null-values",
            "description": "Understand and handle NULL — the concept of missing or unknown data.",
            "difficulty": "beginner",
            "category": "Querying Data",
            "order_index": 7,
            "estimated_time": 10,
            "content": """# NULL Values

## What is NULL?

NULL means **"no value"** or **"unknown"**. It's NOT zero, it's NOT an empty string — it's the absence of any value.

## Testing for NULL

```sql
-- ✅ Correct
SELECT * FROM employees WHERE phone IS NULL;
SELECT * FROM employees WHERE phone IS NOT NULL;

-- ❌ Wrong! This won't work!
SELECT * FROM employees WHERE phone = NULL;
```

## NULL in Calculations

Any calculation with NULL results in NULL:
```sql
SELECT 5 + NULL;      -- Result: NULL
SELECT NULL * 100;    -- Result: NULL
SELECT 'Hello' || NULL; -- Result: NULL
```

## COALESCE — Replace NULL with a default

```sql
SELECT 
  name,
  COALESCE(phone, 'No phone') AS phone,
  COALESCE(salary, 0) AS salary
FROM employees;
```

## NULLIF — Return NULL if values are equal

```sql
-- Returns NULL if divisor is 0 (prevents division by zero)
SELECT total / NULLIF(count, 0) AS average
FROM stats;
```

## NULL in Comparisons

| Expression | Result |
|-----------|--------|
| NULL = NULL | NULL (not TRUE!) |
| NULL != NULL | NULL |
| NULL > 5 | NULL |
| NULL AND TRUE | NULL |
| NULL OR TRUE | TRUE |
""",
            "examples": [
                {"title": "Find NULL Values", "code": "SELECT * FROM employees\\nWHERE manager_id IS NULL;"},
                {"title": "Find Non-NULL Values", "code": "SELECT * FROM customers\\nWHERE phone IS NOT NULL;"},
                {"title": "COALESCE Default", "code": "SELECT \\n  name,\\n  COALESCE(nickname, name) AS display_name\\nFROM users;"},
                {"title": "Count Non-NULL", "code": "-- COUNT(*) counts all rows\\n-- COUNT(column) counts non-NULL values\\nSELECT \\n  COUNT(*) AS total_rows,\\n  COUNT(phone) AS has_phone\\nFROM customers;"},
            ],
            "syntax": "WHERE column IS NULL\\nWHERE column IS NOT NULL\\nCOALESCE(column, default_value)",
            "tips": [
                "NULL is not zero and not empty string",
                "Use IS NULL, never = NULL",
                "COALESCE replaces NULL with a default value",
                "COUNT(*) counts all rows, COUNT(col) skips NULLs"
            ],
        },
        {
            "title": "SQL Operators",
            "slug": "sql-operators",
            "description": "Learn all SQL operators — arithmetic, comparison, logical, and more.",
            "difficulty": "beginner",
            "category": "Querying Data",
            "order_index": 8,
            "estimated_time": 15,
            "content": """# SQL Operators

## Arithmetic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| + | Addition | `price + tax` |
| - | Subtraction | `salary - deductions` |
| * | Multiplication | `price * quantity` |
| / | Division | `total / count` |
| % | Modulo (remainder) | `id % 2` (odd/even) |

```sql
SELECT name, price, price * 0.08 AS tax, price * 1.08 AS total
FROM products;
```

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| = | Equal |
| <> or != | Not equal |
| > | Greater than |
| < | Less than |
| >= | Greater or equal |
| <= | Less or equal |

## Logical Operators

| Operator | Description |
|----------|-------------|
| AND | Both conditions true |
| OR | At least one true |
| NOT | Reverses condition |
| IN | Matches any in list |
| BETWEEN | Within a range |
| LIKE | Pattern match |
| EXISTS | Subquery returns rows |
| ANY/ALL | Compare to set |

## BETWEEN
```sql
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
```

## IN
```sql
SELECT * FROM orders WHERE status IN ('pending', 'processing', 'shipped');
```

## LIKE Patterns
```sql
WHERE name LIKE 'A%'     -- Starts with A
WHERE name LIKE '%son'   -- Ends with son
WHERE name LIKE '%an%'   -- Contains 'an'
WHERE name LIKE '_o%'    -- Second letter is 'o'
```

## EXISTS
```sql
SELECT * FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```
""",
            "examples": [
                {"title": "Arithmetic", "code": "SELECT first_name, salary,\\n  salary * 12 AS annual_salary\\nFROM employees;"},
                {"title": "BETWEEN", "code": "SELECT * FROM employees\\nWHERE hire_date BETWEEN '2020-01-01' AND '2022-12-31';"},
                {"title": "IN Operator", "code": "SELECT * FROM products\\nWHERE category IN ('Electronics', 'Furniture');"},
                {"title": "LIKE Patterns", "code": "-- Find all Gmail users\\nSELECT * FROM customers\\nWHERE email LIKE '%@email.com';"},
                {"title": "Combined Operators", "code": "SELECT * FROM products\\nWHERE category = 'Electronics'\\n  AND price BETWEEN 50 AND 500\\n  AND stock > 0;"},
            ],
            "syntax": "Various — see examples above",
            "tips": [
                "Use parentheses to control AND/OR precedence",
                "BETWEEN is inclusive: BETWEEN 1 AND 10 includes both 1 and 10",
                "IN is cleaner than multiple OR conditions",
                "% in LIKE matches zero or more characters"
            ],
        },
        {
            "title": "SQL Aggregate Functions",
            "slug": "sql-aggregate-functions",
            "description": "Summarize data with COUNT, SUM, AVG, MIN, and MAX.",
            "difficulty": "beginner",
            "category": "Aggregation",
            "order_index": 12,
            "estimated_time": 18,
            "content": """# Aggregate Functions

## Overview

Aggregate functions perform calculations on a set of rows and return a single value.

## The Five Core Aggregates

| Function | Purpose | Example |
|----------|---------|---------|
| `COUNT()` | Count rows | How many employees? |
| `SUM()` | Total of values | Total revenue? |
| `AVG()` | Average value | Average salary? |
| `MIN()` | Smallest value | Lowest price? |
| `MAX()` | Largest value | Highest score? |

## COUNT

```sql
-- Count all rows
SELECT COUNT(*) FROM employees;

-- Count non-NULL values in a column
SELECT COUNT(phone) FROM customers;

-- Count distinct values
SELECT COUNT(DISTINCT department_id) FROM employees;
```

## SUM

```sql
-- Total salary expense
SELECT SUM(salary) FROM employees;

-- Total revenue from orders
SELECT SUM(amount) FROM payments WHERE year = 2024;
```

## AVG

```sql
-- Average salary
SELECT AVG(salary) FROM employees;

-- Average with rounding
SELECT ROUND(AVG(salary), 2) AS avg_salary FROM employees;
```

## MIN and MAX

```sql
-- Salary range
SELECT 
  MIN(salary) AS lowest,
  MAX(salary) AS highest,
  MAX(salary) - MIN(salary) AS range
FROM employees;

-- Earliest and latest order
SELECT MIN(order_date), MAX(order_date) FROM orders;
```

## Combining Aggregates

```sql
SELECT 
  COUNT(*) AS total_employees,
  SUM(salary) AS total_payroll,
  ROUND(AVG(salary), 2) AS avg_salary,
  MIN(salary) AS min_salary,
  MAX(salary) AS max_salary
FROM employees;
```

## With WHERE

```sql
-- Average salary in Engineering only
SELECT AVG(salary) FROM employees
WHERE department = 'Engineering';
```
""",
            "examples": [
                {"title": "COUNT", "code": "SELECT COUNT(*) AS total_customers\\nFROM customers;"},
                {"title": "SUM", "code": "SELECT SUM(total_amount) AS total_revenue\\nFROM orders\\nWHERE order_date >= '2024-01-01';"},
                {"title": "AVG with ROUND", "code": "SELECT ROUND(AVG(price), 2) AS avg_price\\nFROM products;"},
                {"title": "MIN and MAX", "code": "SELECT \\n  MIN(salary) AS lowest,\\n  MAX(salary) AS highest\\nFROM employees;"},
                {"title": "All Together", "code": "SELECT \\n  COUNT(*) AS count,\\n  SUM(salary) AS total,\\n  ROUND(AVG(salary)) AS average,\\n  MIN(salary) AS min,\\n  MAX(salary) AS max\\nFROM employees;"},
            ],
            "syntax": "SELECT AGGREGATE(column) FROM table [WHERE condition];",
            "tips": [
                "COUNT(*) counts all rows including NULLs",
                "COUNT(column) skips NULL values",
                "Use ROUND() with AVG() for cleaner output",
                "Aggregates collapse many rows into one result"
            ],
        },
        # ============================================================
        # INTERMEDIATE LESSONS
        # ============================================================
        {
            "title": "SQL GROUP BY",
            "slug": "sql-group-by",
            "description": "Group rows and apply aggregate functions to each group.",
            "difficulty": "intermediate",
            "category": "Aggregation",
            "order_index": 13,
            "estimated_time": 22,
            "content": """# GROUP BY Clause

## Overview

`GROUP BY` divides rows into groups and applies aggregate functions to each group separately.

## Syntax

```sql
SELECT column, AGGREGATE(column)
FROM table
GROUP BY column;
```

## How It Works

Without GROUP BY:
```sql
SELECT COUNT(*) FROM employees;  -- Returns: 100 (one number)
```

With GROUP BY:
```sql
SELECT department_id, COUNT(*) 
FROM employees
GROUP BY department_id;
-- Returns count for EACH department
```

**Result:**
| department_id | count |
|--------------|-------|
| 1 | 15 |
| 2 | 22 |
| 3 | 18 |

## Examples

### Count per group
```sql
SELECT city, COUNT(*) AS customer_count
FROM customers
GROUP BY city
ORDER BY customer_count DESC;
```

### Sum per group
```sql
SELECT department_id, SUM(salary) AS total_payroll
FROM employees
GROUP BY department_id;
```

### Average per group
```sql
SELECT category, ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY category;
```

### Multiple aggregates
```sql
SELECT 
  department_id,
  COUNT(*) AS employees,
  ROUND(AVG(salary)) AS avg_salary,
  MIN(salary) AS min_salary,
  MAX(salary) AS max_salary
FROM employees
GROUP BY department_id;
```

## GROUP BY Multiple Columns

```sql
SELECT department_id, job_title, COUNT(*) AS count
FROM employees
GROUP BY department_id, job_title
ORDER BY department_id, count DESC;
```

## The Golden Rule

> Every column in SELECT must either be:
> 1. In the GROUP BY clause, OR
> 2. Inside an aggregate function

```sql
-- ✅ Correct
SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;

-- ❌ Wrong! first_name is not grouped or aggregated
SELECT department_id, first_name, COUNT(*) FROM employees GROUP BY department_id;
```
""",
            "examples": [
                {"title": "Count per Group", "code": "SELECT department_id, COUNT(*) AS emp_count\\nFROM employees\\nGROUP BY department_id\\nORDER BY emp_count DESC;"},
                {"title": "Sum per Group", "code": "SELECT category, SUM(price * stock) AS inventory_value\\nFROM products\\nGROUP BY category;"},
                {"title": "Average per Group", "code": "SELECT department_id,\\n  ROUND(AVG(salary), 2) AS avg_salary\\nFROM employees\\nGROUP BY department_id;"},
                {"title": "Multiple Columns", "code": "SELECT country, city, COUNT(*) AS customers\\nFROM customers\\nGROUP BY country, city\\nORDER BY country, customers DESC;"},
            ],
            "syntax": "SELECT column, AGGREGATE(col)\\nFROM table\\nGROUP BY column;",
            "tips": [
                "Every non-aggregated column in SELECT must be in GROUP BY",
                "GROUP BY goes after WHERE but before ORDER BY",
                "You can GROUP BY multiple columns",
                "Use ORDER BY to sort the grouped results"
            ],
        },
        {
            "title": "SQL HAVING Clause",
            "slug": "sql-having",
            "description": "Filter groups after aggregation — WHERE for groups.",
            "difficulty": "intermediate",
            "category": "Aggregation",
            "order_index": 14,
            "estimated_time": 12,
            "content": """# HAVING Clause

## WHERE vs HAVING

| | WHERE | HAVING |
|--|-------|--------|
| Filters | Individual rows | Groups |
| When | Before grouping | After grouping |
| Can use aggregates? | No ❌ | Yes ✅ |

## Syntax

```sql
SELECT column, AGGREGATE(column)
FROM table
[WHERE condition]
GROUP BY column
HAVING aggregate_condition;
```

## Examples

### Departments with more than 5 employees
```sql
SELECT department_id, COUNT(*) AS emp_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

### Categories with average price above $50
```sql
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 50;
```

### Combining WHERE and HAVING
```sql
-- Active employees, grouped by department,
-- only showing departments with avg salary > 60000
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
WHERE is_active = true        -- filters rows BEFORE grouping
GROUP BY department_id
HAVING AVG(salary) > 60000;   -- filters groups AFTER grouping
```

## Complete Query Order

```sql
SELECT department_id, COUNT(*) AS count, AVG(salary) AS avg_sal
FROM employees
WHERE hire_date > '2020-01-01'   -- 1. Filter rows
GROUP BY department_id            -- 2. Group remaining rows
HAVING COUNT(*) >= 3              -- 3. Filter groups
ORDER BY avg_sal DESC             -- 4. Sort results
LIMIT 5;                          -- 5. Limit output
```
""",
            "examples": [
                {"title": "Filter by Count", "code": "SELECT department_id, COUNT(*) AS emp_count\\nFROM employees\\nGROUP BY department_id\\nHAVING COUNT(*) >= 3;"},
                {"title": "Filter by Average", "code": "SELECT department_id, AVG(salary) AS avg_sal\\nFROM employees\\nGROUP BY department_id\\nHAVING AVG(salary) > 80000;"},
                {"title": "WHERE + HAVING", "code": "SELECT category, SUM(stock) AS total_stock\\nFROM products\\nWHERE price > 20\\nGROUP BY category\\nHAVING SUM(stock) > 100;"},
            ],
            "syntax": "SELECT col, AGG(col) FROM table\\nGROUP BY col\\nHAVING AGG(col) condition;",
            "tips": [
                "HAVING is like WHERE but for groups",
                "WHERE filters before grouping, HAVING filters after",
                "You can use both WHERE and HAVING in the same query",
                "HAVING must reference aggregate functions"
            ],
        },
        {
            "title": "SQL INNER JOIN",
            "slug": "sql-inner-join",
            "description": "Combine data from two tables — the most common type of JOIN.",
            "difficulty": "intermediate",
            "category": "Joins",
            "order_index": 15,
            "estimated_time": 25,
            "content": """# INNER JOIN

## Why JOINs?

Data is split across multiple tables to avoid repetition. JOINs let you combine them back together.

## INNER JOIN — Only Matching Rows

Returns rows that have matching values in **both** tables.

## Syntax

```sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
```

## Visual Representation

```
Table A          Table B
┌─────┐         ┌─────┐
│  A  │         │  B  │
│  ┌──┼─────────┼──┐  │
│  │  │ RESULT  │  │  │
│  └──┼─────────┼──┘  │
└─────┘         └─────┘
```
Only the overlapping part is returned.

## Example

**employees table:**
| id | name | dept_id |
|----|------|---------|
| 1 | Alice | 1 |
| 2 | Bob | 2 |
| 3 | Carol | NULL |

**departments table:**
| id | dept_name |
|----|-----------|
| 1 | Engineering |
| 2 | Marketing |
| 3 | Sales |

```sql
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
```

**Result:**
| name | dept_name |
|------|-----------|
| Alice | Engineering |
| Bob | Marketing |

Carol is excluded (NULL dept_id doesn't match).
Sales is excluded (no employee has dept_id = 3).

## Multiple JOINs

```sql
SELECT 
  e.first_name,
  d.name AS department,
  s.amount AS salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
INNER JOIN salaries s ON e.id = s.employee_id;
```

## JOIN with WHERE

```sql
SELECT e.name, d.name AS dept, e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > 60000
ORDER BY e.salary DESC;
```

## JOIN with Aggregates

```sql
SELECT d.name, COUNT(*) AS emp_count, AVG(e.salary) AS avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.name
ORDER BY emp_count DESC;
```
""",
            "examples": [
                {"title": "Basic INNER JOIN", "code": "SELECT e.first_name, d.name AS department\\nFROM employees e\\nINNER JOIN departments d\\n  ON e.department_id = d.id;"},
                {"title": "JOIN with Filter", "code": "SELECT e.first_name, d.name, e.salary\\nFROM employees e\\nINNER JOIN departments d ON e.department_id = d.id\\nWHERE e.salary > 60000\\nORDER BY e.salary DESC;"},
                {"title": "JOIN with Aggregates", "code": "SELECT d.name, COUNT(*) AS employees,\\n  ROUND(AVG(e.salary)) AS avg_salary\\nFROM employees e\\nINNER JOIN departments d ON e.department_id = d.id\\nGROUP BY d.name;"},
                {"title": "Three Table JOIN", "code": "SELECT c.name, o.id AS order_id, p.name AS product\\nFROM customers c\\nINNER JOIN orders o ON c.id = o.customer_id\\nINNER JOIN order_items oi ON o.id = oi.order_id\\nINNER JOIN products p ON oi.product_id = p.id;"},
            ],
            "syntax": "SELECT cols FROM table1\\nINNER JOIN table2 ON table1.col = table2.col;",
            "tips": [
                "INNER JOIN = JOIN (they're the same)",
                "Use table aliases (e, d) for readability",
                "Only matching rows from both tables are returned",
                "The ON clause defines how tables are related"
            ],
        },
        {
            "title": "SQL LEFT JOIN",
            "slug": "sql-left-join",
            "description": "Get all rows from the left table, even without matches in the right table.",
            "difficulty": "intermediate",
            "category": "Joins",
            "order_index": 16,
            "estimated_time": 18,
            "content": """# LEFT JOIN (LEFT OUTER JOIN)

## Overview

Returns **all rows from the left table** and matching rows from the right table. If no match, right-side columns are NULL.

## Syntax

```sql
SELECT columns
FROM left_table
LEFT JOIN right_table ON left_table.col = right_table.col;
```

## Visual

```
Table A          Table B
┌─────────┐     ┌─────┐
│ ████████ │     │     │
│ ████████─┼─────┼──┐  │
│ ████████ │     │  │  │
│ ████████─┼─────┼──┘  │
│ ████████ │     │     │
└─────────┘     └─────┘
  ALL of A    + matches from B
```

## Example

```sql
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
```

**Result:**
| name | dept_name |
|------|-----------|
| Alice | Engineering |
| Bob | Marketing |
| Carol | NULL |  ← Carol has no department, still included!

## Use Cases

### Find unmatched rows (orphans)
```sql
-- Customers who never ordered
SELECT c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
```

### Include all items even without data
```sql
-- All products with their sales (including unsold ones)
SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS total_sold
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.name;
```

## LEFT JOIN vs INNER JOIN

| | INNER JOIN | LEFT JOIN |
|--|-----------|-----------|
| Left table rows | Only matching | ALL rows |
| Right table rows | Only matching | Only matching |
| NULLs in result | Never | When no match |
""",
            "examples": [
                {"title": "Basic LEFT JOIN", "code": "SELECT e.first_name, d.name AS department\\nFROM employees e\\nLEFT JOIN departments d ON e.department_id = d.id;"},
                {"title": "Find Orphan Records", "code": "-- Customers with no orders\\nSELECT c.name, c.email\\nFROM customers c\\nLEFT JOIN orders o ON c.id = o.customer_id\\nWHERE o.id IS NULL;"},
                {"title": "Count with Zeros", "code": "-- All departments with employee count (including empty ones)\\nSELECT d.name, COUNT(e.id) AS emp_count\\nFROM departments d\\nLEFT JOIN employees e ON d.id = e.department_id\\nGROUP BY d.name;"},
            ],
            "syntax": "SELECT cols FROM left_table\\nLEFT JOIN right_table ON condition;",
            "tips": [
                "LEFT JOIN keeps ALL rows from the left (first) table",
                "Use WHERE right.id IS NULL to find unmatched rows",
                "Great for finding 'customers without orders' type queries",
                "LEFT JOIN = LEFT OUTER JOIN (same thing)"
            ],
        },
        {
            "title": "SQL Subqueries",
            "slug": "sql-subqueries",
            "description": "Nest queries inside other queries for powerful data retrieval.",
            "difficulty": "intermediate",
            "category": "Advanced Queries",
            "order_index": 17,
            "estimated_time": 25,
            "content": """# Subqueries

## What is a Subquery?

A subquery is a query nested inside another query. The inner query runs first, and its result is used by the outer query.

## Types of Subqueries

### 1. Scalar Subquery (returns one value)
```sql
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### 2. Row Subquery (returns one row)
```sql
SELECT * FROM employees
WHERE (department_id, salary) = (
  SELECT department_id, MAX(salary) FROM employees GROUP BY department_id LIMIT 1
);
```

### 3. Table Subquery (returns multiple rows)
```sql
SELECT * FROM employees
WHERE department_id IN (
  SELECT id FROM departments WHERE location = 'New York'
);
```

## Subquery in WHERE

```sql
-- Employees earning above average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Employees in departments with budget > 1M
SELECT * FROM employees
WHERE department_id IN (
  SELECT id FROM departments WHERE budget > 1000000
);
```

## Subquery in FROM (Derived Table)

```sql
SELECT dept_name, avg_salary
FROM (
  SELECT d.name AS dept_name, AVG(e.salary) AS avg_salary
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  GROUP BY d.name
) AS dept_stats
WHERE avg_salary > 60000;
```

## Subquery in SELECT

```sql
SELECT 
  name,
  salary,
  (SELECT AVG(salary) FROM employees) AS company_avg,
  salary - (SELECT AVG(salary) FROM employees) AS diff_from_avg
FROM employees;
```

## EXISTS — Check if subquery returns rows

```sql
-- Customers who have placed at least one order
SELECT * FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```

## Correlated Subqueries

The inner query references the outer query:
```sql
-- Employees earning more than their department average
SELECT e.name, e.salary, e.department_id
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary) FROM employees
  WHERE department_id = e.department_id
);
```
""",
            "examples": [
                {"title": "Above Average", "code": "SELECT first_name, salary\\nFROM employees\\nWHERE salary > (SELECT AVG(salary) FROM employees);"},
                {"title": "IN Subquery", "code": "SELECT * FROM employees\\nWHERE department_id IN (\\n  SELECT id FROM departments\\n  WHERE location = 'San Francisco'\\n);"},
                {"title": "EXISTS", "code": "SELECT c.name\\nFROM customers c\\nWHERE EXISTS (\\n  SELECT 1 FROM orders o\\n  WHERE o.customer_id = c.id\\n  AND o.total_amount > 200\\n);"},
                {"title": "Correlated Subquery", "code": "-- Employees earning above their dept average\\nSELECT first_name, salary, department_id\\nFROM employees e\\nWHERE salary > (\\n  SELECT AVG(salary) FROM employees\\n  WHERE department_id = e.department_id\\n);"},
            ],
            "syntax": "SELECT cols FROM table\\nWHERE col OPERATOR (SELECT ...);",
            "tips": [
                "Subqueries run from inside out",
                "Use IN for subqueries returning multiple values",
                "EXISTS is often faster than IN for large datasets",
                "Correlated subqueries reference the outer query"
            ],
        },
        {
            "title": "SQL UNION",
            "slug": "sql-union",
            "description": "Combine results from multiple SELECT statements into one result set.",
            "difficulty": "intermediate",
            "category": "Advanced Queries",
            "order_index": 18,
            "estimated_time": 12,
            "content": """# UNION

## Overview

`UNION` combines the results of two or more SELECT statements into a single result set.

## UNION vs UNION ALL

| | UNION | UNION ALL |
|--|-------|-----------|
| Duplicates | Removed | Kept |
| Performance | Slower | Faster |
| Use when | Need unique rows | Duplicates OK |

## Syntax

```sql
SELECT columns FROM table1
UNION [ALL]
SELECT columns FROM table2;
```

## Rules

1. Same number of columns in each SELECT
2. Columns must have compatible data types
3. Column names come from the first SELECT

## Examples

```sql
-- All cities from both customers and suppliers
SELECT city FROM customers
UNION
SELECT city FROM suppliers;

-- All contacts (with duplicates)
SELECT name, email FROM customers
UNION ALL
SELECT name, email FROM employees;
```

## With ORDER BY

ORDER BY goes at the very end:
```sql
SELECT name, 'customer' AS type FROM customers
UNION ALL
SELECT name, 'employee' AS type FROM employees
ORDER BY name;
```
""",
            "examples": [
                {"title": "Basic UNION", "code": "SELECT city FROM customers\\nUNION\\nSELECT location AS city FROM departments\\nORDER BY city;"},
                {"title": "UNION ALL", "code": "SELECT name, email, 'customer' AS type\\nFROM customers\\nUNION ALL\\nSELECT first_name AS name, email, 'employee' AS type\\nFROM employees;"},
                {"title": "UNION with Filter", "code": "SELECT first_name, salary FROM employees WHERE department_id = 1\\nUNION\\nSELECT first_name, salary FROM employees WHERE salary > 90000;"},
            ],
            "syntax": "SELECT cols FROM table1\\nUNION [ALL]\\nSELECT cols FROM table2;",
            "tips": [
                "UNION removes duplicates (slower), UNION ALL keeps them (faster)",
                "Both SELECTs must have the same number of columns",
                "ORDER BY goes at the end of the entire UNION",
                "Column names come from the first SELECT"
            ],
        },
        {
            "title": "SQL CASE Expression",
            "slug": "sql-case",
            "description": "Add conditional logic to your queries — SQL's if/else.",
            "difficulty": "intermediate",
            "category": "Advanced Queries",
            "order_index": 19,
            "estimated_time": 15,
            "content": """# CASE Expression

## Overview

CASE adds if/then/else logic to SQL queries. It's like a switch statement.

## Syntax

```sql
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE default_result
END
```

## Examples

### Categorize values
```sql
SELECT name, salary,
  CASE
    WHEN salary >= 100000 THEN 'Senior'
    WHEN salary >= 60000 THEN 'Mid-Level'
    WHEN salary >= 30000 THEN 'Junior'
    ELSE 'Entry Level'
  END AS level
FROM employees;
```

### Conditional aggregation
```sql
SELECT 
  COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled
FROM orders;
```

### In ORDER BY
```sql
SELECT * FROM tasks
ORDER BY 
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END;
```

### In UPDATE
```sql
UPDATE products
SET price = CASE
  WHEN category = 'Electronics' THEN price * 1.10
  WHEN category = 'Clothing' THEN price * 1.05
  ELSE price
END;
```
""",
            "examples": [
                {"title": "Categorize Data", "code": "SELECT first_name, salary,\\n  CASE\\n    WHEN salary >= 80000 THEN 'High'\\n    WHEN salary >= 50000 THEN 'Medium'\\n    ELSE 'Low'\\n  END AS salary_band\\nFROM employees;"},
                {"title": "Conditional Count", "code": "SELECT\\n  SUM(CASE WHEN department_id = 1 THEN 1 ELSE 0 END) AS engineering,\\n  SUM(CASE WHEN department_id = 2 THEN 1 ELSE 0 END) AS marketing,\\n  SUM(CASE WHEN department_id = 3 THEN 1 ELSE 0 END) AS sales\\nFROM employees;"},
                {"title": "Custom Sort Order", "code": "SELECT first_name, job_title FROM employees\\nORDER BY CASE job_title\\n  WHEN 'Engineering Manager' THEN 1\\n  WHEN 'Tech Lead' THEN 2\\n  WHEN 'Senior Engineer' THEN 3\\n  ELSE 4\\nEND;"},
            ],
            "syntax": "CASE WHEN condition THEN result\\n     [WHEN ... THEN ...]\\n     ELSE default END",
            "tips": [
                "CASE can be used in SELECT, WHERE, ORDER BY, and UPDATE",
                "Always include ELSE for a default value",
                "Great for creating categories or labels",
                "Use for conditional aggregation (pivot-like queries)"
            ],
        },
        # ============================================================
        # ADVANCED LESSONS
        # ============================================================
        {
            "title": "SQL Window Functions",
            "slug": "sql-window-functions",
            "description": "Perform calculations across rows without collapsing them — the most powerful SQL feature.",
            "difficulty": "advanced",
            "category": "Window Functions",
            "order_index": 20,
            "estimated_time": 35,
            "content": """# Window Functions

## What Are Window Functions?

Window functions perform calculations across a set of rows **related to the current row** — without collapsing rows into groups like GROUP BY does.

## Key Difference from GROUP BY

| GROUP BY | Window Functions |
|----------|-----------------|
| Collapses rows into groups | Keeps all rows |
| One output row per group | One output row per input row |
| Loses individual row data | Retains individual row data |

## Syntax

```sql
function_name() OVER (
  [PARTITION BY column]
  [ORDER BY column]
)
```

## Ranking Functions

### ROW_NUMBER() — Unique sequential number
```sql
SELECT name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees;
```

### RANK() — Rank with gaps for ties
```sql
SELECT name, salary,
  RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees;
-- If two people tie for #2, next is #4 (skips #3)
```

### DENSE_RANK() — Rank without gaps
```sql
SELECT name, salary,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
-- If two people tie for #2, next is #3 (no gap)
```

## PARTITION BY — Window within groups

```sql
-- Rank employees within each department
SELECT name, department_id, salary,
  RANK() OVER (
    PARTITION BY department_id 
    ORDER BY salary DESC
  ) AS dept_rank
FROM employees;
```

## Aggregate Window Functions

```sql
SELECT name, department_id, salary,
  SUM(salary) OVER (PARTITION BY department_id) AS dept_total,
  AVG(salary) OVER (PARTITION BY department_id) AS dept_avg,
  salary - AVG(salary) OVER (PARTITION BY department_id) AS diff_from_avg
FROM employees;
```

## LAG and LEAD — Access adjacent rows

```sql
-- Compare each employee's salary to the previous one
SELECT name, salary,
  LAG(salary, 1) OVER (ORDER BY salary) AS prev_salary,
  LEAD(salary, 1) OVER (ORDER BY salary) AS next_salary,
  salary - LAG(salary, 1) OVER (ORDER BY salary) AS diff
FROM employees;
```

## Running Totals

```sql
SELECT order_date, amount,
  SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

## NTILE — Divide into buckets

```sql
-- Divide employees into 4 salary quartiles
SELECT name, salary,
  NTILE(4) OVER (ORDER BY salary) AS quartile
FROM employees;
```
""",
            "examples": [
                {"title": "ROW_NUMBER", "code": "SELECT first_name, salary,\\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank\\nFROM employees;"},
                {"title": "RANK with PARTITION", "code": "SELECT first_name, department_id, salary,\\n  RANK() OVER (\\n    PARTITION BY department_id\\n    ORDER BY salary DESC\\n  ) AS dept_rank\\nFROM employees;"},
                {"title": "Running Total", "code": "SELECT id, order_date, total_amount,\\n  SUM(total_amount) OVER (ORDER BY order_date) AS running_total\\nFROM orders;"},
                {"title": "LAG - Previous Row", "code": "SELECT first_name, hire_date, salary,\\n  LAG(salary) OVER (ORDER BY hire_date) AS prev_salary\\nFROM employees;"},
                {"title": "Percent of Total", "code": "SELECT first_name, salary,\\n  ROUND(salary * 100.0 / SUM(salary) OVER (), 2) AS pct_of_total\\nFROM employees;"},
            ],
            "syntax": "FUNCTION() OVER (\\n  [PARTITION BY col]\\n  [ORDER BY col]\\n)",
            "tips": [
                "Window functions don't reduce row count like GROUP BY",
                "PARTITION BY is like GROUP BY but keeps all rows",
                "ROW_NUMBER gives unique numbers, RANK allows ties",
                "LAG/LEAD let you compare with previous/next rows"
            ],
        },
        {
            "title": "Common Table Expressions (CTEs)",
            "slug": "sql-cte",
            "description": "Write cleaner, more readable queries with WITH clauses.",
            "difficulty": "advanced",
            "category": "Advanced SQL",
            "order_index": 21,
            "estimated_time": 20,
            "content": """# Common Table Expressions (CTEs)

## What is a CTE?

A CTE is a temporary named result set that you can reference within a query. Think of it as a "named subquery" that makes complex queries readable.

## Syntax

```sql
WITH cte_name AS (
  SELECT ...
)
SELECT * FROM cte_name;
```

## Why Use CTEs?

1. **Readability** — Break complex queries into logical steps
2. **Reusability** — Reference the same subquery multiple times
3. **Recursion** — Solve hierarchical problems

## Basic Example

```sql
-- Without CTE (hard to read)
SELECT * FROM (
  SELECT department_id, AVG(salary) as avg_sal
  FROM employees GROUP BY department_id
) dept_avg
WHERE avg_sal > 60000;

-- With CTE (much cleaner!)
WITH dept_averages AS (
  SELECT department_id, AVG(salary) as avg_sal
  FROM employees
  GROUP BY department_id
)
SELECT * FROM dept_averages
WHERE avg_sal > 60000;
```

## Multiple CTEs

```sql
WITH 
  high_earners AS (
    SELECT * FROM employees WHERE salary > 80000
  ),
  dept_counts AS (
    SELECT department_id, COUNT(*) as count
    FROM high_earners
    GROUP BY department_id
  )
SELECT d.name, dc.count
FROM dept_counts dc
JOIN departments d ON dc.department_id = d.id
ORDER BY dc.count DESC;
```

## Recursive CTE

For hierarchical data (org charts, categories, etc.):

```sql
WITH RECURSIVE org_chart AS (
  -- Base case: top-level managers
  SELECT id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL
  
  UNION ALL
  
  -- Recursive case: employees under managers
  SELECT e.id, e.name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level, name;
```
""",
            "examples": [
                {"title": "Basic CTE", "code": "WITH high_salary AS (\\n  SELECT * FROM employees\\n  WHERE salary > 70000\\n)\\nSELECT department_id, COUNT(*) AS count\\nFROM high_salary\\nGROUP BY department_id;"},
                {"title": "Multiple CTEs", "code": "WITH \\n  dept_stats AS (\\n    SELECT department_id,\\n      AVG(salary) AS avg_sal,\\n      COUNT(*) AS emp_count\\n    FROM employees\\n    GROUP BY department_id\\n  ),\\n  large_depts AS (\\n    SELECT * FROM dept_stats\\n    WHERE emp_count > 5\\n  )\\nSELECT * FROM large_depts\\nORDER BY avg_sal DESC;"},
                {"title": "CTE with JOIN", "code": "WITH recent_orders AS (\\n  SELECT customer_id, COUNT(*) AS order_count\\n  FROM orders\\n  WHERE order_date >= '2024-01-01'\\n  GROUP BY customer_id\\n)\\nSELECT c.name, ro.order_count\\nFROM customers c\\nJOIN recent_orders ro ON c.id = ro.customer_id\\nORDER BY ro.order_count DESC;"},
            ],
            "syntax": "WITH cte_name AS (\\n  SELECT ...\\n)\\nSELECT * FROM cte_name;",
            "tips": [
                "CTEs make complex queries much more readable",
                "You can define multiple CTEs separated by commas",
                "CTEs exist only for the duration of the query",
                "Recursive CTEs solve tree/hierarchy problems"
            ],
        },
        {
            "title": "SQL Indexes and Performance",
            "slug": "sql-indexes",
            "description": "Speed up your queries dramatically with proper indexing.",
            "difficulty": "advanced",
            "category": "Performance",
            "order_index": 22,
            "estimated_time": 25,
            "content": """# Indexes and Query Performance

## What is an Index?

An index is a data structure that speeds up data retrieval — like a book's index that helps you find topics without reading every page.

## Without Index vs With Index

| | Without Index | With Index |
|--|--------------|------------|
| How it searches | Scans every row (full table scan) | Jumps directly to matching rows |
| Speed (1M rows) | ~1000ms | ~1ms |
| Write speed | Fast | Slightly slower |
| Storage | No extra | Extra space needed |

## Creating Indexes

```sql
-- Single column index
CREATE INDEX idx_employees_email ON employees(email);

-- Multi-column index
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

## When to Create Indexes

✅ **DO index:**
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Columns with high selectivity (many unique values)

❌ **DON'T index:**
- Small tables (< 1000 rows)
- Columns with few unique values (boolean, status)
- Columns that are frequently updated
- Tables with heavy INSERT/UPDATE workloads

## EXPLAIN — Analyze Query Performance

```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE email = 'john@company.com';
```

This shows you:
- Whether an index is being used
- How many rows are scanned
- Actual execution time

## Query Optimization Tips

1. **Use indexes** on filtered/joined columns
2. **Avoid SELECT *** — only select needed columns
3. **Avoid functions on indexed columns** in WHERE
4. **Use LIMIT** when you don't need all rows
5. **Use EXISTS instead of IN** for large subqueries
6. **Avoid OR** — use UNION or IN instead
7. **Use appropriate data types** — smaller is faster

## Anti-Patterns

```sql
-- ❌ Bad: Function on indexed column (can't use index)
SELECT * FROM employees WHERE UPPER(email) = 'JOHN@COMPANY.COM';

-- ✅ Good: Store normalized, query directly
SELECT * FROM employees WHERE email = 'john@company.com';

-- ❌ Bad: Leading wildcard (can't use index)
SELECT * FROM products WHERE name LIKE '%phone%';

-- ✅ Good: Trailing wildcard (can use index)
SELECT * FROM products WHERE name LIKE 'phone%';
```
""",
            "examples": [
                {"title": "Employees by Department", "code": "-- This shows what an index would speed up:\\nSELECT * FROM employees\\nWHERE department_id = 1;"},
                {"title": "Filter by Email", "code": "-- Searching by email benefits from an index:\\nSELECT * FROM employees\\nWHERE email = 'sarah.j@company.com';"},
                {"title": "Sorted Query", "code": "-- ORDER BY benefits from indexes too:\\nSELECT * FROM orders\\nORDER BY order_date DESC\\nLIMIT 10;"},
            ],
            "syntax": "CREATE [UNIQUE] INDEX index_name\\nON table(column1, column2);",
            "tips": [
                "Indexes speed up reads but slow down writes",
                "Index columns used in WHERE, JOIN, and ORDER BY",
                "Use EXPLAIN to see if your indexes are being used",
                "Don't over-index — each index has maintenance cost"
            ],
        },
        {
            "title": "SQL Transactions",
            "slug": "sql-transactions",
            "description": "Ensure data integrity with atomic operations that either fully succeed or fully fail.",
            "difficulty": "advanced",
            "category": "Advanced SQL",
            "order_index": 23,
            "estimated_time": 20,
            "content": """# Transactions

## What is a Transaction?

A transaction is a group of SQL operations that are treated as a single unit. Either ALL operations succeed, or NONE of them do.

## ACID Properties

| Property | Meaning | Example |
|----------|---------|---------|
| **A**tomicity | All or nothing | Transfer: debit AND credit both happen or neither |
| **C**onsistency | Valid state to valid state | Account balance never goes negative |
| **I**solation | Transactions don't interfere | Two transfers don't corrupt each other |
| **D**urability | Committed = permanent | Power failure won't lose committed data |

## Syntax

```sql
BEGIN;  -- or START TRANSACTION

-- Your SQL operations here
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;  -- Make changes permanent
-- or
ROLLBACK;  -- Undo all changes
```

## Classic Example: Bank Transfer

```sql
BEGIN;

-- Debit from account A
UPDATE accounts SET balance = balance - 500 WHERE id = 1;

-- Credit to account B  
UPDATE accounts SET balance = balance + 500 WHERE id = 2;

-- If both succeeded:
COMMIT;

-- If anything went wrong:
-- ROLLBACK;
```

Without a transaction, if the system crashes between the two UPDATEs, money disappears!

## SAVEPOINT — Partial Rollback

```sql
BEGIN;
INSERT INTO orders (customer_id, total) VALUES (1, 100);
SAVEPOINT order_created;

INSERT INTO order_items (order_id, product_id) VALUES (1, 999);
-- Oops, product 999 doesn't exist!
ROLLBACK TO order_created;
-- Order still exists, but the bad item is undone

COMMIT;
```

## Isolation Levels

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|-----------|-------------------|--------------|
| READ UNCOMMITTED | Possible | Possible | Possible |
| READ COMMITTED | No | Possible | Possible |
| REPEATABLE READ | No | No | Possible |
| SERIALIZABLE | No | No | No |
""",
            "examples": [
                {"title": "Check Balance Before Transfer", "code": "-- Step 1: Check current state\\nSELECT * FROM customers WHERE id IN (1, 2);"},
                {"title": "Verify Order Exists", "code": "-- Before deleting, verify what you're about to change:\\nSELECT * FROM orders WHERE id = 5;"},
                {"title": "Safe Update Pattern", "code": "-- Always SELECT first, then UPDATE:\\nSELECT * FROM employees\\nWHERE department_id = 3 AND salary < 70000;"},
            ],
            "syntax": "BEGIN;\\n-- SQL statements\\nCOMMIT; -- or ROLLBACK;",
            "tips": [
                "Always use transactions for multi-step operations",
                "COMMIT makes changes permanent",
                "ROLLBACK undoes all changes since BEGIN",
                "Bank transfers are the classic transaction example"
            ],
        },
        {
            "title": "SQL Views",
            "slug": "sql-views",
            "description": "Create virtual tables from queries for reusability and security.",
            "difficulty": "intermediate",
            "category": "Database Objects",
            "order_index": 24,
            "estimated_time": 15,
            "content": """# Views

## What is a View?

A view is a **virtual table** based on a SELECT query. It doesn't store data — it runs the query each time you access it.

## Creating a View

```sql
CREATE VIEW view_name AS
SELECT columns FROM tables WHERE conditions;
```

## Example

```sql
-- Create a view for employee details
CREATE VIEW employee_details AS
SELECT 
  e.id, e.first_name, e.last_name,
  d.name AS department,
  e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- Now use it like a table!
SELECT * FROM employee_details WHERE department = 'Engineering';
```

## Why Use Views?

1. **Simplify complex queries** — Write once, use many times
2. **Security** — Hide sensitive columns
3. **Abstraction** — Change underlying tables without breaking apps
4. **Consistency** — Everyone uses the same logic

## Modifying Views

```sql
-- Replace existing view
CREATE OR REPLACE VIEW active_employees AS
SELECT * FROM employees WHERE is_active = true;

-- Delete a view
DROP VIEW employee_details;
```

## Updatable Views

Simple views can be updated:
```sql
-- This works if the view is simple enough
UPDATE active_employees SET salary = 75000 WHERE id = 1;
```
""",
            "examples": [
                {"title": "Simulating a View Query", "code": "-- A view is like saving this query with a name:\\nSELECT first_name, last_name, salary\\nFROM employees\\nWHERE salary > 80000;"},
                {"title": "Department Summary (View-like)", "code": "-- This could be saved as a view for reuse:\\nSELECT \\n  d.name AS department,\\n  COUNT(e.id) AS employees,\\n  ROUND(AVG(e.salary)) AS avg_salary\\nFROM departments d\\nLEFT JOIN employees e ON d.id = e.department_id\\nGROUP BY d.name;"},
                {"title": "Complex Query as View", "code": "-- Views simplify complex queries like this:\\nSELECT e.first_name, d.name AS dept,\\n  e.salary,\\n  RANK() OVER (PARTITION BY d.name ORDER BY e.salary DESC) AS rank\\nFROM employees e\\nJOIN departments d ON e.department_id = d.id;"},
            ],
            "syntax": "CREATE VIEW name AS\\nSELECT ...;",
            "tips": [
                "Views don't store data — they run the query each time",
                "Use views to simplify complex JOINs you use often",
                "Views can restrict access to sensitive columns",
                "DROP VIEW removes the view, not the underlying data"
            ],
        },
    ]


def get_all_problems():
    """Return comprehensive practice problems."""
    return [
        # EASY Problems
        Problem(title="Select All Employees", slug="select-all-employees", description="Write a query to retrieve all columns and all rows from the employees table.", difficulty="easy", category="SELECT", dataset="employees", hint="Use SELECT * to get all columns.", solution="SELECT * FROM employees", explanation="SELECT * retrieves every column from the table. The * is a wildcard meaning 'all columns'.", starter_code="-- Retrieve all data from employees table\\n", tags=["select", "basics"], order_index=1),
        Problem(title="Employee Names and Emails", slug="employee-names-emails", description="Select only the first_name, last_name, and email columns from the employees table.", difficulty="easy", category="SELECT", dataset="employees", hint="List specific column names after SELECT, separated by commas.", solution="SELECT first_name, last_name, email FROM employees", explanation="Specifying column names retrieves only those columns, which is more efficient than SELECT *.", starter_code="-- Select first_name, last_name, email\\n", tags=["select", "columns"], order_index=2),
        Problem(title="Unique Departments", slug="unique-departments", description="Find all unique department_id values from the employees table.", difficulty="easy", category="SELECT", dataset="employees", hint="Use DISTINCT to remove duplicates.", solution="SELECT DISTINCT department_id FROM employees", explanation="DISTINCT removes duplicate values, showing each department_id only once.", starter_code="-- Find unique department IDs\\n", tags=["select", "distinct"], order_index=3),
        Problem(title="High Salary Filter", slug="high-salary-filter", description="Find all employees with a salary greater than 70000.", difficulty="easy", category="WHERE", dataset="employees", hint="Use WHERE with the > operator.", solution="SELECT * FROM employees WHERE salary > 70000", explanation="WHERE salary > 70000 filters to only include rows where the salary column exceeds 70000.", starter_code="-- Employees earning more than 70000\\n", tags=["where", "comparison"], order_index=4),
        Problem(title="Employees in Department 3", slug="employees-dept-3", description="Find all employees who work in department_id = 3.", difficulty="easy", category="WHERE", dataset="employees", hint="Use WHERE with = for exact match.", solution="SELECT * FROM employees WHERE department_id = 3", explanation="WHERE department_id = 3 returns only rows where the department_id equals exactly 3.", starter_code="-- Employees in department 3\\n", tags=["where", "equality"], order_index=5),
        Problem(title="Sort by Salary", slug="sort-by-salary", description="List all employees sorted by salary from highest to lowest.", difficulty="easy", category="ORDER BY", dataset="employees", hint="Use ORDER BY with DESC for descending order.", solution="SELECT * FROM employees ORDER BY salary DESC", explanation="ORDER BY salary DESC sorts results from highest salary to lowest.", starter_code="-- Sort employees by salary (highest first)\\n", tags=["order by", "sorting"], order_index=6),
        Problem(title="Top 5 Earners", slug="top-5-earners", description="Find the 5 highest-paid employees. Show their first_name, last_name, and salary.", difficulty="easy", category="LIMIT", dataset="employees", hint="Combine ORDER BY DESC with LIMIT.", solution="SELECT first_name, last_name, salary FROM employees ORDER BY salary DESC LIMIT 5", explanation="ORDER BY salary DESC sorts highest first, then LIMIT 5 returns only the top 5 rows.", starter_code="-- Top 5 highest paid employees\\n", tags=["order by", "limit"], order_index=7),
        Problem(title="Employees Hired After 2022", slug="hired-after-2022", description="Find all employees hired after January 1, 2022.", difficulty="easy", category="WHERE", dataset="employees", hint="Use WHERE with > and a date string.", solution="SELECT * FROM employees WHERE hire_date > '2022-01-01'", explanation="Dates can be compared with > operator. Use 'YYYY-MM-DD' format.", starter_code="-- Employees hired after 2022-01-01\\n", tags=["where", "dates"], order_index=8),
        Problem(title="NULL Manager", slug="null-manager", description="Find all employees who don't have a manager (manager_id is NULL).", difficulty="easy", category="NULL", dataset="employees", hint="Use IS NULL, not = NULL.", solution="SELECT * FROM employees WHERE manager_id IS NULL", explanation="IS NULL checks for missing values. Never use = NULL as it won't work.", starter_code="-- Employees without a manager\\n", tags=["null", "is null"], order_index=9),
        Problem(title="Name Pattern Match", slug="name-pattern-match", description="Find all employees whose first_name starts with the letter 'J'.", difficulty="easy", category="WHERE", dataset="employees", hint="Use LIKE with the % wildcard.", solution="SELECT * FROM employees WHERE first_name LIKE 'J%'", explanation="LIKE 'J%' matches any string starting with 'J'. The % matches any number of characters.", starter_code="-- Names starting with J\\n", tags=["like", "pattern"], order_index=10),

        # MEDIUM Problems
        Problem(title="Department Employee Count", slug="department-employee-count", description="Count the number of employees in each department. Show department_id and the count.", difficulty="medium", category="GROUP BY", dataset="employees", hint="Use GROUP BY with COUNT().", solution="SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id", explanation="GROUP BY groups rows by department_id, then COUNT(*) counts rows in each group.", starter_code="-- Count employees per department\\n", tags=["group by", "count"], order_index=11),
        Problem(title="Average Salary by Department", slug="avg-salary-department", description="Calculate the average salary for each department. Round to 2 decimal places.", difficulty="medium", category="GROUP BY", dataset="employees", hint="Use AVG() with ROUND() and GROUP BY.", solution="SELECT department_id, ROUND(AVG(salary), 2) AS avg_salary FROM employees GROUP BY department_id", explanation="AVG(salary) calculates the mean, ROUND(..., 2) limits to 2 decimal places.", starter_code="-- Average salary per department\\n", tags=["group by", "avg", "round"], order_index=12),
        Problem(title="Departments with 5+ Employees", slug="departments-5-plus", description="Find departments that have more than 5 employees. Show department_id and count.", difficulty="medium", category="HAVING", dataset="employees", hint="Use GROUP BY with HAVING to filter groups.", solution="SELECT department_id, COUNT(*) AS emp_count FROM employees GROUP BY department_id HAVING COUNT(*) > 5", explanation="HAVING filters groups after aggregation. It's like WHERE but for grouped results.", starter_code="-- Departments with more than 5 employees\\n", tags=["group by", "having"], order_index=13),
        Problem(title="Employees with Departments", slug="employees-with-departments", description="List all employees with their department names. Show first_name, last_name, and department name.", difficulty="medium", category="JOIN", dataset="employees", hint="JOIN employees with departments on department_id.", solution="SELECT e.first_name, e.last_name, d.name AS department FROM employees e INNER JOIN departments d ON e.department_id = d.id", explanation="INNER JOIN combines rows from both tables where department_id matches the department's id.", starter_code="-- Join employees with their department names\\n", tags=["join", "inner join"], order_index=14),
        Problem(title="Total Salary per Department", slug="total-salary-dept", description="Find the total salary expense for each department. Show department name and total. Sort by total descending.", difficulty="medium", category="JOIN", dataset="employees", hint="JOIN with departments, then GROUP BY and SUM.", solution="SELECT d.name, SUM(e.salary) AS total_salary FROM employees e INNER JOIN departments d ON e.department_id = d.id GROUP BY d.name ORDER BY total_salary DESC", explanation="JOIN gets department names, GROUP BY groups by department, SUM totals the salaries.", starter_code="-- Total salary per department name\\n", tags=["join", "group by", "sum"], order_index=15),
        Problem(title="Second Highest Salary", slug="second-highest-salary", description="Find the second highest salary in the employees table.", difficulty="medium", category="Subquery", dataset="employees", hint="Use ORDER BY, LIMIT, and OFFSET.", solution="SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1", explanation="ORDER BY salary DESC puts highest first. OFFSET 1 skips the first row, LIMIT 1 gets the next one.", starter_code="-- Find the second highest salary\\n", tags=["subquery", "limit", "offset"], order_index=16),
        Problem(title="Above Average Salary", slug="above-average-salary", description="Find all employees whose salary is above the company average. Show name and salary.", difficulty="medium", category="Subquery", dataset="employees", hint="Use a subquery with AVG() in the WHERE clause.", solution="SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)", explanation="The subquery calculates the average, then the outer query filters employees above it.", starter_code="-- Employees earning above average\\n", tags=["subquery", "avg"], order_index=17),
        Problem(title="Customers Without Orders", slug="customers-without-orders", description="Find all customers who have never placed an order. Show customer name and email.", difficulty="medium", category="JOIN", dataset="ecommerce", hint="Use LEFT JOIN and check for NULL.", solution="SELECT c.name, c.email FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL", explanation="LEFT JOIN keeps all customers. WHERE o.id IS NULL finds those with no matching order.", starter_code="-- Customers who never ordered\\n", tags=["left join", "null"], order_index=18),
        Problem(title="Order Count per Customer", slug="order-count-customer", description="Count how many orders each customer has placed. Show customer name and order count, sorted by count descending.", difficulty="medium", category="JOIN", dataset="ecommerce", hint="JOIN customers with orders, GROUP BY customer, COUNT.", solution="SELECT c.name, COUNT(o.id) AS order_count FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.name ORDER BY order_count DESC", explanation="LEFT JOIN includes customers with 0 orders. COUNT(o.id) counts non-NULL order IDs.", starter_code="-- Order count per customer\\n", tags=["join", "group by", "count"], order_index=19),
        Problem(title="CASE Salary Bands", slug="case-salary-bands", description="Categorize employees into salary bands: 'High' (>80000), 'Medium' (50000-80000), 'Low' (<50000). Show name, salary, and band.", difficulty="medium", category="CASE", dataset="employees", hint="Use CASE WHEN for conditional logic.", solution="SELECT first_name, salary, CASE WHEN salary > 80000 THEN 'High' WHEN salary >= 50000 THEN 'Medium' ELSE 'Low' END AS salary_band FROM employees", explanation="CASE evaluates conditions in order and returns the first matching result.", starter_code="-- Categorize salaries into bands\\n", tags=["case", "conditional"], order_index=20),

        # HARD Problems
        Problem(title="Rank by Salary in Department", slug="rank-salary-department", description="Rank employees by salary within each department. Show name, department_id, salary, and rank.", difficulty="hard", category="Window Functions", dataset="employees", hint="Use RANK() with PARTITION BY and ORDER BY.", solution="SELECT first_name, department_id, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM employees", explanation="RANK() OVER with PARTITION BY creates separate rankings within each department.", starter_code="-- Rank employees by salary within department\\n", tags=["window functions", "rank"], order_index=21),
        Problem(title="Running Total of Orders", slug="running-total-orders", description="Calculate a running total of order amounts, ordered by order_date.", difficulty="hard", category="Window Functions", dataset="ecommerce", hint="Use SUM() as a window function with ORDER BY.", solution="SELECT id, order_date, total_amount, SUM(total_amount) OVER (ORDER BY order_date) AS running_total FROM orders", explanation="SUM() OVER (ORDER BY order_date) creates a cumulative sum as you go through dates.", starter_code="-- Running total of order amounts\\n", tags=["window functions", "running total"], order_index=22),
        Problem(title="Top Earner per Department", slug="top-earner-department", description="Find the highest-paid employee in each department. Show department name, employee name, and salary.", difficulty="hard", category="Window Functions", dataset="employees", hint="Use ROW_NUMBER() with PARTITION BY, then filter for rank = 1.", solution="SELECT department_id, first_name, salary FROM (SELECT department_id, first_name, salary, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn FROM employees) ranked WHERE rn = 1", explanation="ROW_NUMBER assigns 1 to the top earner in each department. The outer query filters for those.", starter_code="-- Highest paid employee per department\\n", tags=["window functions", "subquery"], order_index=23),
        Problem(title="Year-over-Year Growth", slug="yoy-growth", description="Calculate the total order amount per year and the percentage growth from the previous year.", difficulty="hard", category="Window Functions", dataset="ecommerce", hint="Use LAG() to get the previous year's total.", solution="SELECT year, total, ROUND((total - prev_total) * 100.0 / prev_total, 2) AS growth_pct FROM (SELECT EXTRACT(YEAR FROM order_date) AS year, SUM(total_amount) AS total, LAG(SUM(total_amount)) OVER (ORDER BY EXTRACT(YEAR FROM order_date)) AS prev_total FROM orders GROUP BY EXTRACT(YEAR FROM order_date)) yearly", explanation="LAG() gets the previous row's value. We calculate percentage change from it.", starter_code="-- Year over year order growth\\n", tags=["window functions", "lag", "growth"], order_index=24),
        Problem(title="Employees Above Department Average", slug="above-dept-average", description="Find employees who earn more than the average salary of their own department.", difficulty="hard", category="Subquery", dataset="employees", hint="Use a correlated subquery that references the outer query's department_id.", solution="SELECT first_name, department_id, salary FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)", explanation="This correlated subquery calculates the average for each employee's specific department.", starter_code="-- Employees earning above their department average\\n", tags=["correlated subquery"], order_index=25),
    ]


def get_all_quizzes():
    """Return quiz data with 10 questions per chapter + interview questions."""
    return [
        {
            "quiz": Quiz(title="Chapter 1: Getting Started", description="Databases, SQL basics, SELECT, WHERE, ORDER BY — prove you know the fundamentals.", difficulty="beginner", category="Getting Started", time_limit=600, passing_score=75),
            "questions": [
                QuizQuestion(question="What does SQL stand for?", question_type="mcq", options=["Structured Query Language", "Simple Query Language", "Standard Query Logic", "System Query Language"], correct_answer="Structured Query Language", explanation="SQL = Structured Query Language, created in the 1970s at IBM.", points=10, order_index=1),
                QuizQuestion(question="Which command retrieves data from a database?", question_type="mcq", options=["GET", "SELECT", "FETCH", "RETRIEVE"], correct_answer="SELECT", explanation="SELECT is the SQL command for querying/retrieving data.", points=10, order_index=2),
                QuizQuestion(question="What does SELECT * mean?", question_type="mcq", options=["Select the first column", "Select all columns", "Select all tables", "Select nothing"], correct_answer="Select all columns", explanation="The asterisk (*) is a wildcard meaning 'all columns'.", points=10, order_index=3),
                QuizQuestion(question="Which clause filters rows based on conditions?", question_type="mcq", options=["ORDER BY", "GROUP BY", "WHERE", "HAVING"], correct_answer="WHERE", explanation="WHERE filters individual rows based on conditions.", points=10, order_index=4),
                QuizQuestion(question="How do you sort results in descending order?", question_type="mcq", options=["ORDER BY col ASC", "ORDER BY col DESC", "SORT BY col DOWN", "ORDER BY col REVERSE"], correct_answer="ORDER BY col DESC", explanation="DESC = descending order (highest to lowest, Z to A).", points=10, order_index=5),
                QuizQuestion(question="Which operator checks for NULL values?", question_type="mcq", options=["= NULL", "== NULL", "IS NULL", "EQUALS NULL"], correct_answer="IS NULL", explanation="Always use IS NULL, never = NULL. NULL is not a value, it's the absence of one.", points=10, order_index=6),
                QuizQuestion(question="What does DISTINCT do?", question_type="mcq", options=["Sorts results", "Removes duplicate rows", "Counts rows", "Filters rows"], correct_answer="Removes duplicate rows", explanation="DISTINCT eliminates duplicate rows from the result set.", points=10, order_index=7),
                QuizQuestion(question="Which LIKE pattern matches names starting with 'A'?", question_type="mcq", options=["LIKE '%A'", "LIKE 'A%'", "LIKE '_A%'", "LIKE 'A_'"], correct_answer="LIKE 'A%'", explanation="'A%' means starts with A followed by any characters. % = any number of chars.", points=10, order_index=8),
                QuizQuestion(question="What will LIMIT 5 OFFSET 10 return?", question_type="mcq", options=["First 5 rows", "Rows 6-10", "Rows 11-15", "Last 5 rows"], correct_answer="Rows 11-15", explanation="OFFSET 10 skips first 10 rows, then LIMIT 5 returns the next 5 (rows 11-15).", points=10, order_index=9),
                QuizQuestion(question="What does INSERT INTO do?", question_type="mcq", options=["Retrieves data", "Adds new rows to a table", "Updates existing rows", "Deletes rows"], correct_answer="Adds new rows to a table", explanation="INSERT INTO adds new records/rows to a database table.", points=10, order_index=10),
            ]
        },
        {
            "quiz": Quiz(title="Chapter 2: Querying Data", description="Master filtering, sorting, patterns, NULL handling, and operators.", difficulty="beginner", category="Querying Data", time_limit=600, passing_score=75),
            "questions": [
                QuizQuestion(question="What does WHERE salary > 50000 do?", question_type="mcq", options=["Shows all salaries", "Shows only rows where salary exceeds 50000", "Sets salary to 50000", "Deletes rows below 50000"], correct_answer="Shows only rows where salary exceeds 50000", explanation="WHERE filters rows — only those meeting the condition are returned.", points=10, order_index=1),
                QuizQuestion(question="What does BETWEEN 10 AND 50 include?", question_type="mcq", options=["10 to 49", "11 to 50", "10 to 50 (inclusive)", "11 to 49"], correct_answer="10 to 50 (inclusive)", explanation="BETWEEN is inclusive on both ends — it includes the boundary values.", points=10, order_index=2),
                QuizQuestion(question="IN ('A', 'B', 'C') is equivalent to:", question_type="mcq", options=["= 'A' AND = 'B' AND = 'C'", "= 'A' OR = 'B' OR = 'C'", "LIKE 'A%'", "BETWEEN 'A' AND 'C'"], correct_answer="= 'A' OR = 'B' OR = 'C'", explanation="IN checks if a value matches ANY value in the list — it's shorthand for multiple OR conditions.", points=10, order_index=3),
                QuizQuestion(question="LIKE '%son' matches which name?", question_type="mcq", options=["Sonic", "Johnson", "Sony", "Stone"], correct_answer="Johnson", explanation="'%son' means 'ends with son'. % matches any characters before 'son'.", points=10, order_index=4),
                QuizQuestion(question="What is NULL in SQL?", question_type="mcq", options=["Zero", "Empty string", "The absence of any value", "False"], correct_answer="The absence of any value", explanation="NULL means 'unknown' or 'no value'. It's not 0, not empty string, not false.", points=10, order_index=5),
                QuizQuestion(question="Why does WHERE col = NULL not work?", question_type="mcq", options=["Syntax error", "NULL can't be compared with =", "It works fine", "Need double equals =="], correct_answer="NULL can't be compared with =", explanation="Nothing equals NULL, not even NULL itself. Always use IS NULL or IS NOT NULL.", points=10, order_index=6),
                QuizQuestion(question="COALESCE(phone, 'N/A') returns:", question_type="mcq", options=["Always 'N/A'", "phone if not NULL, otherwise 'N/A'", "NULL", "An error"], correct_answer="phone if not NULL, otherwise 'N/A'", explanation="COALESCE returns the first non-NULL value from its arguments.", points=10, order_index=7),
                QuizQuestion(question="ORDER BY salary DESC LIMIT 1 returns:", question_type="mcq", options=["Lowest salary", "Highest salary", "Average salary", "All salaries"], correct_answer="Highest salary", explanation="DESC sorts highest first, LIMIT 1 returns only that top row.", points=10, order_index=8),
                QuizQuestion(question="[Interview] How would you find the 3rd highest salary?", question_type="mcq", options=["ORDER BY salary DESC LIMIT 3", "ORDER BY salary DESC LIMIT 1 OFFSET 2", "WHERE salary = MAX(salary) - 2", "GROUP BY salary HAVING rank = 3"], correct_answer="ORDER BY salary DESC LIMIT 1 OFFSET 2", explanation="Sort descending, skip 2 rows (OFFSET 2), take 1 row — that's the 3rd highest.", points=10, order_index=9),
                QuizQuestion(question="[Interview] What's the difference between WHERE and HAVING?", question_type="mcq", options=["No difference", "WHERE filters rows before grouping, HAVING filters after", "HAVING is faster", "WHERE works on groups"], correct_answer="WHERE filters rows before grouping, HAVING filters after", explanation="WHERE operates on individual rows before GROUP BY. HAVING operates on aggregated groups after GROUP BY.", points=10, order_index=10),
            ]
        },
        {
            "quiz": Quiz(title="Chapter 3: Modifying Data", description="INSERT, UPDATE, DELETE — test your data manipulation skills.", difficulty="beginner", category="Modifying Data", time_limit=600, passing_score=75),
            "questions": [
                QuizQuestion(question="Which command adds new rows?", question_type="mcq", options=["ADD", "INSERT INTO", "CREATE", "APPEND"], correct_answer="INSERT INTO", explanation="INSERT INTO table (columns) VALUES (values) adds new rows.", points=10, order_index=1),
                QuizQuestion(question="What happens if you run UPDATE without WHERE?", question_type="mcq", options=["Error", "Nothing", "ALL rows get updated", "Only first row updates"], correct_answer="ALL rows get updated", explanation="Without WHERE, UPDATE affects every single row in the table — very dangerous!", points=10, order_index=2),
                QuizQuestion(question="DELETE FROM orders WHERE status = 'cancelled' does what?", question_type="mcq", options=["Deletes the orders table", "Removes only cancelled orders", "Removes all orders", "Changes status to NULL"], correct_answer="Removes only cancelled orders", explanation="DELETE with WHERE removes only rows matching the condition.", points=10, order_index=3),
                QuizQuestion(question="What's the difference between DELETE and TRUNCATE?", question_type="mcq", options=["No difference", "DELETE can use WHERE, TRUNCATE removes all rows", "TRUNCATE is slower", "DELETE removes the table"], correct_answer="DELETE can use WHERE, TRUNCATE removes all rows", explanation="DELETE removes specific rows (with WHERE). TRUNCATE removes ALL rows quickly without logging each.", points=10, order_index=4),
                QuizQuestion(question="INSERT INTO users VALUES (1, 'John') — what's the risk?", question_type="mcq", options=["No risk", "Column order might not match", "It's slower", "It creates duplicates"], correct_answer="Column order might not match", explanation="Without specifying columns, you rely on table column order which can change. Always specify columns.", points=10, order_index=5),
                QuizQuestion(question="How do you insert multiple rows in one statement?", question_type="mcq", options=["Multiple INSERT statements", "VALUES (row1), (row2), (row3)", "INSERT ALL", "BULK INSERT only"], correct_answer="VALUES (row1), (row2), (row3)", explanation="INSERT INTO table (cols) VALUES (v1), (v2), (v3) inserts multiple rows efficiently.", points=10, order_index=6),
                QuizQuestion(question="UPDATE employees SET salary = salary * 1.1 does what?", question_type="mcq", options=["Sets all salaries to 1.1", "Gives everyone a 10% raise", "Multiplies salary by 11", "Error — can't reference same column"], correct_answer="Gives everyone a 10% raise", explanation="salary * 1.1 means current salary + 10%. The SET can reference the current value.", points=10, order_index=7),
                QuizQuestion(question="What does DROP TABLE do vs DELETE?", question_type="mcq", options=["Same thing", "DROP removes the entire table structure, DELETE removes rows only", "DELETE is permanent, DROP is not", "DROP is faster DELETE"], correct_answer="DROP removes the entire table structure, DELETE removes rows only", explanation="DROP removes the table itself (structure + data). DELETE only removes rows, table still exists.", points=10, order_index=8),
                QuizQuestion(question="[Interview] How do you safely update data in production?", question_type="mcq", options=["Just run UPDATE", "Run SELECT first to verify rows, then UPDATE within a transaction", "Use DELETE then INSERT", "Update one row at a time"], correct_answer="Run SELECT first to verify rows, then UPDATE within a transaction", explanation="Best practice: SELECT to preview affected rows, then wrap UPDATE in a transaction so you can ROLLBACK if wrong.", points=10, order_index=9),
                QuizQuestion(question="[Interview] What is INSERT ... ON CONFLICT (upsert)?", question_type="mcq", options=["Insert that always fails", "Insert or update if row already exists", "Insert into multiple tables", "Conflict resolution for JOINs"], correct_answer="Insert or update if row already exists", explanation="UPSERT (INSERT ON CONFLICT) inserts a new row, or updates the existing one if a unique constraint is violated.", points=10, order_index=10),
            ]
        },
        {
            "quiz": Quiz(title="Chapter 4: Aggregation & Grouping", description="GROUP BY, HAVING, COUNT, SUM, AVG — summarize and analyze data.", difficulty="intermediate", category="Aggregation", time_limit=600, passing_score=75),
            "questions": [
                QuizQuestion(question="Which function counts rows?", question_type="mcq", options=["SUM()", "COUNT()", "TOTAL()", "NUM()"], correct_answer="COUNT()", explanation="COUNT() counts the number of rows.", points=10, order_index=1),
                QuizQuestion(question="What's the difference between COUNT(*) and COUNT(column)?", question_type="mcq", options=["No difference", "COUNT(*) is faster", "COUNT(column) skips NULL values", "COUNT(*) only counts distinct"], correct_answer="COUNT(column) skips NULL values", explanation="COUNT(*) counts all rows. COUNT(column) only counts rows where that column is not NULL.", points=10, order_index=2),
                QuizQuestion(question="Non-aggregated columns in SELECT must be in:", question_type="mcq", options=["WHERE clause", "HAVING clause", "GROUP BY clause", "ORDER BY clause"], correct_answer="GROUP BY clause", explanation="Every column in SELECT that isn't inside an aggregate function must appear in GROUP BY.", points=10, order_index=3),
                QuizQuestion(question="WHERE vs HAVING — which filters groups?", question_type="mcq", options=["WHERE", "HAVING", "Both", "Neither"], correct_answer="HAVING", explanation="WHERE filters rows before grouping. HAVING filters groups after aggregation.", points=10, order_index=4),
                QuizQuestion(question="What does ROUND(AVG(salary), 2) do?", question_type="mcq", options=["Rounds salary to nearest 2", "Calculates average rounded to 2 decimal places", "Returns top 2 salaries", "Groups by 2"], correct_answer="Calculates average rounded to 2 decimal places", explanation="AVG(salary) calculates the mean, ROUND(..., 2) limits output to 2 decimal places.", points=10, order_index=5),
                QuizQuestion(question="Which is the correct execution order?", question_type="mcq", options=["SELECT → FROM → WHERE → GROUP BY", "FROM → WHERE → GROUP BY → SELECT", "GROUP BY → WHERE → SELECT → FROM", "WHERE → FROM → GROUP BY → SELECT"], correct_answer="FROM → WHERE → GROUP BY → SELECT", explanation="SQL executes: FROM (get table) → WHERE (filter rows) → GROUP BY (group) → HAVING → SELECT → ORDER BY.", points=10, order_index=6),
                QuizQuestion(question="SUM(salary) returns:", question_type="mcq", options=["Average salary", "Total of all salary values", "Maximum salary", "Count of salaries"], correct_answer="Total of all salary values", explanation="SUM() adds up all values in the specified column.", points=10, order_index=7),
                QuizQuestion(question="Can you use WHERE with aggregate functions?", question_type="mcq", options=["Yes, always", "No, use HAVING instead", "Only with COUNT", "Only with SUM"], correct_answer="No, use HAVING instead", explanation="WHERE cannot use aggregate functions. Use HAVING to filter on aggregated values.", points=10, order_index=8),
                QuizQuestion(question="What does GROUP BY city, country do?", question_type="mcq", options=["Groups by city only", "Groups by country only", "Creates groups for each unique city+country combination", "Errors out"], correct_answer="Creates groups for each unique city+country combination", explanation="Multiple columns in GROUP BY create groups for each unique combination of those values.", points=10, order_index=9),
                QuizQuestion(question="MIN() and MAX() work on:", question_type="mcq", options=["Numbers only", "Text only", "Numbers, text, and dates", "Dates only"], correct_answer="Numbers, text, and dates", explanation="MIN/MAX work on any comparable type: numbers (smallest/largest), text (alphabetical), dates (earliest/latest).", points=10, order_index=10),
            ]
        },
        {
            "quiz": Quiz(title="Chapter 5: JOINs & Relationships", description="INNER JOIN, LEFT JOIN, multi-table queries — combine data like a pro.", difficulty="intermediate", category="Joins", time_limit=600, passing_score=75),
            "questions": [
                QuizQuestion(question="What does INNER JOIN return?", question_type="mcq", options=["All rows from both tables", "Only matching rows from both tables", "All rows from the left table", "All rows from the right table"], correct_answer="Only matching rows from both tables", explanation="INNER JOIN returns only rows where the join condition is satisfied in both tables.", points=10, order_index=1),
                QuizQuestion(question="What does LEFT JOIN return for unmatched rows?", question_type="mcq", options=["Nothing — row is excluded", "NULL values for right table columns", "An error", "Zero values"], correct_answer="NULL values for right table columns", explanation="LEFT JOIN keeps all left table rows. Unmatched right-side columns become NULL.", points=10, order_index=2),
                QuizQuestion(question="Which clause specifies the join condition?", question_type="mcq", options=["WHERE", "ON", "USING", "WITH"], correct_answer="ON", explanation="The ON clause specifies how two tables are related in a JOIN.", points=10, order_index=3),
                QuizQuestion(question="How do you find customers WITHOUT orders?", question_type="mcq", options=["INNER JOIN ... WHERE order IS NULL", "LEFT JOIN ... WHERE order.id IS NULL", "RIGHT JOIN ... WHERE customer IS NULL", "CROSS JOIN ... WHERE NULL"], correct_answer="LEFT JOIN ... WHERE order.id IS NULL", explanation="LEFT JOIN keeps all customers, then WHERE o.id IS NULL finds those with no matching order.", points=10, order_index=4),
                QuizQuestion(question="INNER JOIN and JOIN are:", question_type="mcq", options=["Different operations", "The same thing", "JOIN is faster", "INNER JOIN returns more rows"], correct_answer="The same thing", explanation="JOIN without a prefix defaults to INNER JOIN. They are identical.", points=10, order_index=5),
                QuizQuestion(question="What does FULL OUTER JOIN return?", question_type="mcq", options=["Only matching rows", "All rows from left table only", "All rows from both tables, with NULLs for non-matches", "Cartesian product"], correct_answer="All rows from both tables, with NULLs for non-matches", explanation="FULL OUTER JOIN returns all rows from both tables, filling NULLs where there's no match.", points=10, order_index=6),
                QuizQuestion(question="What is a self-join?", question_type="mcq", options=["Joining a table with itself", "Joining without ON clause", "Joining 3+ tables", "An automatic join"], correct_answer="Joining a table with itself", explanation="A self-join joins a table to itself, useful for hierarchical data like employee-manager.", points=10, order_index=7),
                QuizQuestion(question="What does CROSS JOIN produce?", question_type="mcq", options=["Only matching rows", "Cartesian product (every combination)", "Union of both tables", "Intersection of tables"], correct_answer="Cartesian product (every combination)", explanation="CROSS JOIN combines every row from table A with every row from table B.", points=10, order_index=8),
                QuizQuestion(question="[Interview] When would you use LEFT JOIN over INNER JOIN?", question_type="mcq", options=["When you want faster queries", "When you need ALL rows from one table even without matches", "When tables have no relationship", "Never — INNER JOIN is always better"], correct_answer="When you need ALL rows from one table even without matches", explanation="LEFT JOIN is used when you want to keep all records from one table, showing NULL where there's no match.", points=10, order_index=9),
                QuizQuestion(question="[Interview] How do you find employees who earn more than their manager?", question_type="mcq", options=["Subquery only", "Self-join: JOIN employees e2 ON e1.manager_id = e2.id WHERE e1.salary > e2.salary", "Not possible in SQL", "Use HAVING"], correct_answer="Self-join: JOIN employees e2 ON e1.manager_id = e2.id WHERE e1.salary > e2.salary", explanation="Self-join the employees table to itself — join employee to their manager, then compare salaries.", points=10, order_index=10),
            ]
        },
        {
            "quiz": Quiz(title="Chapter 6: Advanced SQL", description="Window functions, CTEs, subqueries, transactions — master-level concepts.", difficulty="advanced", category="Advanced", time_limit=720, passing_score=75),
            "questions": [
                QuizQuestion(question="What makes window functions different from GROUP BY?", question_type="mcq", options=["They're faster", "They don't collapse rows into groups", "They can only use SUM", "They require ORDER BY"], correct_answer="They don't collapse rows into groups", explanation="Window functions perform calculations across rows WITHOUT reducing the number of output rows.", points=10, order_index=1),
                QuizQuestion(question="What does PARTITION BY do in a window function?", question_type="mcq", options=["Filters rows", "Divides rows into groups for the window calculation", "Sorts the output", "Limits results"], correct_answer="Divides rows into groups for the window calculation", explanation="PARTITION BY creates separate 'windows' for the function to operate on, like GROUP BY but keeping all rows.", points=10, order_index=2),
                QuizQuestion(question="ROW_NUMBER() vs RANK() — what's the difference?", question_type="mcq", options=["No difference", "ROW_NUMBER gives unique numbers, RANK allows ties", "RANK is faster", "ROW_NUMBER only works with PARTITION BY"], correct_answer="ROW_NUMBER gives unique numbers, RANK allows ties", explanation="ROW_NUMBER always gives 1,2,3,4. RANK gives 1,2,2,4 (ties get same rank, next rank is skipped).", points=10, order_index=3),
                QuizQuestion(question="What does LAG(salary) OVER (ORDER BY hire_date) return?", question_type="mcq", options=["Next row's salary", "Previous row's salary", "Average salary", "Current salary"], correct_answer="Previous row's salary", explanation="LAG() accesses the previous row's value. LEAD() accesses the next row's value.", points=10, order_index=4),
                QuizQuestion(question="What is a CTE (Common Table Expression)?", question_type="mcq", options=["A permanent table", "A temporary named result set within a query", "A stored procedure", "A database view"], correct_answer="A temporary named result set within a query", explanation="CTEs (WITH clause) create temporary named result sets that exist only for the duration of the query.", points=10, order_index=5),
                QuizQuestion(question="What does a correlated subquery do?", question_type="mcq", options=["Runs once for the entire query", "References the outer query and runs once per row", "Creates a new table", "Joins two tables"], correct_answer="References the outer query and runs once per row", explanation="A correlated subquery references columns from the outer query and executes once for each outer row.", points=10, order_index=6),
                QuizQuestion(question="What is the purpose of an INDEX?", question_type="mcq", options=["Store backup data", "Speed up data retrieval", "Encrypt data", "Compress tables"], correct_answer="Speed up data retrieval", explanation="Indexes create data structures that allow the database to find rows quickly without scanning the entire table.", points=10, order_index=7),
                QuizQuestion(question="What does ACID stand for in transactions?", question_type="mcq", options=["Add, Create, Insert, Delete", "Atomicity, Consistency, Isolation, Durability", "Automatic, Concurrent, Independent, Durable", "Access, Control, Identity, Data"], correct_answer="Atomicity, Consistency, Isolation, Durability", explanation="ACID properties ensure reliable database transactions: all-or-nothing, valid states, no interference, permanent.", points=10, order_index=8),
                QuizQuestion(question="UNION vs UNION ALL — what's the difference?", question_type="mcq", options=["No difference", "UNION removes duplicates, UNION ALL keeps them", "UNION ALL is slower", "UNION can only combine 2 tables"], correct_answer="UNION removes duplicates, UNION ALL keeps them", explanation="UNION removes duplicate rows (slower). UNION ALL keeps all rows including duplicates (faster).", points=10, order_index=9),
                QuizQuestion(question="What does EXISTS do in a subquery?", question_type="mcq", options=["Counts rows", "Returns TRUE if the subquery returns any rows", "Creates a table", "Joins tables"], correct_answer="Returns TRUE if the subquery returns any rows", explanation="EXISTS returns TRUE/FALSE based on whether the subquery produces at least one row.", points=10, order_index=10),
            ]
        },
    ]


async def seed_lessons(db: AsyncSession):
    """Seed all lessons."""
    for lesson_data in get_all_lessons():
        lesson = Lesson(**lesson_data)
        db.add(lesson)
    await db.flush()


async def seed_quizzes(db: AsyncSession):
    """Seed quizzes with questions."""
    for quiz_data in get_all_quizzes():
        quiz = quiz_data["quiz"]
        db.add(quiz)
        await db.flush()
        for q in quiz_data["questions"]:
            q.quiz_id = quiz.id
            db.add(q)
    await db.flush()


async def seed_problems(db: AsyncSession):
    """Seed practice problems."""
    for problem in get_all_problems():
        db.add(problem)
    await db.flush()


async def seed_achievements(db: AsyncSession):
    """Seed achievements."""
    achievements = [
        Achievement(name="First Steps", description="Complete your first lesson", icon="🎯", xp_reward=50, requirement_type="lessons", requirement_value=1),
        Achievement(name="Quick Learner", description="Complete 5 lessons", icon="📚", xp_reward=100, requirement_type="lessons", requirement_value=5),
        Achievement(name="Knowledge Seeker", description="Complete 10 lessons", icon="🧠", xp_reward=200, requirement_type="lessons", requirement_value=10),
        Achievement(name="SQL Scholar", description="Complete all lessons", icon="🎓", xp_reward=500, requirement_type="lessons", requirement_value=20),
        Achievement(name="Problem Solver", description="Solve your first problem", icon="💡", xp_reward=50, requirement_type="problems", requirement_value=1),
        Achievement(name="Getting Warmed Up", description="Solve 5 problems", icon="🔥", xp_reward=100, requirement_type="problems", requirement_value=5),
        Achievement(name="Code Warrior", description="Solve 10 problems", icon="⚔️", xp_reward=200, requirement_type="problems", requirement_value=10),
        Achievement(name="SQL Master", description="Solve 25 problems", icon="👑", xp_reward=1000, requirement_type="problems", requirement_value=25),
        Achievement(name="Quiz Ace", description="Pass 3 quizzes", icon="✅", xp_reward=150, requirement_type="quizzes", requirement_value=3),
        Achievement(name="Perfect Score", description="Get 100% on any quiz", icon="💯", xp_reward=200, requirement_type="quizzes", requirement_value=1),
        Achievement(name="Streak Starter", description="3-day learning streak", icon="🔥", xp_reward=100, requirement_type="streak", requirement_value=3),
        Achievement(name="Dedicated Learner", description="7-day learning streak", icon="⭐", xp_reward=300, requirement_type="streak", requirement_value=7),
        Achievement(name="Unstoppable", description="30-day learning streak", icon="🏆", xp_reward=1000, requirement_type="streak", requirement_value=30),
    ]
    for a in achievements:
        db.add(a)
    await db.flush()


async def seed_daily_challenges(db: AsyncSession):
    """Seed daily challenges."""
    today = date.today()
    challenges = [
        DailyChallenge(title="Find the Highest Salary", description="Write a query to find the employee with the highest salary. Return all their details.", difficulty="easy", dataset="employees", solution="SELECT * FROM employees ORDER BY salary DESC LIMIT 1", hint="Sort by salary descending and limit to 1 row.", explanation="ORDER BY salary DESC puts the highest salary first, LIMIT 1 returns only that row.", xp_reward=30, challenge_date=today),
        DailyChallenge(title="Department Statistics", description="For each department, find the number of employees and the average salary. Round the average to 2 decimal places.", difficulty="medium", dataset="employees", solution="SELECT department_id, COUNT(*) AS emp_count, ROUND(AVG(salary), 2) AS avg_salary FROM employees GROUP BY department_id", hint="Use GROUP BY with COUNT and AVG. ROUND() for decimal places.", explanation="GROUP BY creates groups per department, then aggregate functions summarize each group.", xp_reward=50, challenge_date=today + timedelta(days=1)),
        DailyChallenge(title="Employees Without Departments", description="Find all employees who are not assigned to any department (department_id is NULL).", difficulty="easy", dataset="employees", solution="SELECT * FROM employees WHERE department_id IS NULL", hint="Use IS NULL to check for missing values.", explanation="IS NULL finds rows where a column has no value. Never use = NULL.", xp_reward=30, challenge_date=today + timedelta(days=2)),
        DailyChallenge(title="Top Customer by Orders", description="Find the customer who has placed the most orders. Show their name and order count.", difficulty="medium", dataset="ecommerce", solution="SELECT c.name, COUNT(o.id) AS order_count FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name ORDER BY order_count DESC LIMIT 1", hint="JOIN customers with orders, GROUP BY customer, COUNT, ORDER BY count DESC, LIMIT 1.", explanation="JOIN connects customers to their orders, GROUP BY counts per customer, then we sort and limit.", xp_reward=50, challenge_date=today + timedelta(days=3)),
        DailyChallenge(title="Salary Rank", description="Rank all employees by salary (highest first) using a window function. Show name, salary, and rank.", difficulty="hard", dataset="employees", solution="SELECT first_name, salary, RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM employees", hint="Use RANK() OVER (ORDER BY salary DESC).", explanation="RANK() assigns a rank to each row based on the ORDER BY. Ties get the same rank.", xp_reward=75, challenge_date=today + timedelta(days=4)),
    ]
    for c in challenges:
        db.add(c)
    await db.flush()


async def seed_admin_user(db: AsyncSession):
    """Create default admin user."""
    admin = User(
        username="admin",
        email="admin@sqlmaster.com",
        hashed_password=hash_password("admin123"),
        full_name="Admin User",
        is_admin=True,
        xp_points=0,
    )
    db.add(admin)
    await db.flush()


async def seed_all(db: AsyncSession):
    """Run all seed functions."""
    await seed_admin_user(db)
    await seed_lessons(db)
    await seed_quizzes(db)
    await seed_problems(db)
    await seed_achievements(db)
    await seed_daily_challenges(db)
    await db.commit()
