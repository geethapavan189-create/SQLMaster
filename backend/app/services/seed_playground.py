"""Seed playground sample data tables."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


async def seed_playground_tables(db: AsyncSession):
    """Create and populate sample tables for the SQL playground."""

    # Create employees table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100),
            department_id INTEGER,
            salary DECIMAL(10,2),
            hire_date DATE,
            job_title VARCHAR(100),
            manager_id INTEGER
        )
    """))

    # Create departments table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            location VARCHAR(100),
            budget DECIMAL(12,2)
        )
    """))

    # Create salaries table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS salaries (
            id INTEGER PRIMARY KEY,
            employee_id INTEGER,
            amount DECIMAL(10,2),
            from_date DATE,
            to_date DATE
        )
    """))

    # Create customers table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100),
            city VARCHAR(50),
            country VARCHAR(50),
            joined_date DATE
        )
    """))

    # Create orders table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            customer_id INTEGER,
            order_date DATE,
            total_amount DECIMAL(10,2),
            status VARCHAR(20)
        )
    """))

    # Create products table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            category VARCHAR(50),
            price DECIMAL(10,2),
            stock INTEGER
        )
    """))

    # Create students table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100),
            major VARCHAR(50),
            gpa DECIMAL(3,2),
            enrollment_year INTEGER
        )
    """))

    # Create courses table
    await db.execute(text("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            department VARCHAR(50),
            credits INTEGER,
            instructor VARCHAR(100)
        )
    """))

    # Seed departments
    await db.execute(text("""
        INSERT OR IGNORE INTO departments (id, name, location, budget) VALUES
        (1, 'Engineering', 'San Francisco', 2000000),
        (2, 'Marketing', 'New York', 800000),
        (3, 'Sales', 'Chicago', 1200000),
        (4, 'Human Resources', 'New York', 500000),
        (5, 'Finance', 'San Francisco', 900000),
        (6, 'Product', 'San Francisco', 1500000),
        (7, 'Design', 'Los Angeles', 700000),
        (8, 'Support', 'Austin', 600000)
    """))

    # Seed employees
    await db.execute(text("""
        INSERT OR IGNORE INTO employees (id, first_name, last_name, email, department_id, salary, hire_date, job_title, manager_id) VALUES
        (1, 'John', 'Smith', 'john.smith@company.com', 1, 95000, '2019-03-15', 'Senior Engineer', NULL),
        (2, 'Sarah', 'Johnson', 'sarah.j@company.com', 1, 105000, '2018-07-01', 'Tech Lead', 1),
        (3, 'Michael', 'Williams', 'michael.w@company.com', 1, 82000, '2020-01-10', 'Software Engineer', 2),
        (4, 'Emily', 'Brown', 'emily.b@company.com', 1, 78000, '2021-06-15', 'Junior Engineer', 2),
        (5, 'David', 'Jones', 'david.j@company.com', 2, 72000, '2020-03-20', 'Marketing Manager', NULL),
        (6, 'Jessica', 'Davis', 'jessica.d@company.com', 2, 65000, '2021-01-05', 'Content Specialist', 5),
        (7, 'Robert', 'Miller', 'robert.m@company.com', 3, 88000, '2019-09-01', 'Sales Director', NULL),
        (8, 'Amanda', 'Wilson', 'amanda.w@company.com', 3, 67000, '2020-11-15', 'Account Executive', 7),
        (9, 'James', 'Taylor', 'james.t@company.com', 3, 71000, '2020-05-20', 'Sales Representative', 7),
        (10, 'Lisa', 'Anderson', 'lisa.a@company.com', 4, 68000, '2019-12-01', 'HR Manager', NULL),
        (11, 'Daniel', 'Thomas', 'daniel.t@company.com', 5, 92000, '2018-04-10', 'Finance Director', NULL),
        (12, 'Jennifer', 'Jackson', 'jennifer.j@company.com', 5, 76000, '2021-03-01', 'Financial Analyst', 11),
        (13, 'Christopher', 'White', 'chris.w@company.com', 6, 110000, '2017-08-15', 'Product Manager', NULL),
        (14, 'Maria', 'Garcia', 'maria.g@company.com', 6, 95000, '2019-02-20', 'Senior PM', 13),
        (15, 'Kevin', 'Martinez', 'kevin.m@company.com', 7, 85000, '2020-07-01', 'Lead Designer', NULL),
        (16, 'Ashley', 'Robinson', 'ashley.r@company.com', 7, 72000, '2021-09-15', 'UI Designer', 15),
        (17, 'Brian', 'Clark', 'brian.c@company.com', 1, 88000, '2020-04-01', 'Backend Engineer', 2),
        (18, 'Nicole', 'Lewis', 'nicole.l@company.com', 1, 91000, '2019-11-10', 'Frontend Engineer', 2),
        (19, 'Andrew', 'Lee', 'andrew.l@company.com', 8, 58000, '2022-01-15', 'Support Specialist', NULL),
        (20, 'Rachel', 'Walker', 'rachel.w@company.com', 8, 55000, '2022-06-01', 'Support Agent', 19),
        (21, 'Thomas', 'Hall', 'thomas.h@company.com', 3, 74000, '2021-02-10', 'Account Manager', 7),
        (22, 'Stephanie', 'Allen', 'steph.a@company.com', 2, 69000, '2021-08-20', 'SEO Specialist', 5),
        (23, 'Mark', 'Young', 'mark.y@company.com', 1, 115000, '2017-01-05', 'Engineering Manager', NULL),
        (24, 'Laura', 'King', 'laura.k@company.com', 4, 62000, '2022-03-15', 'HR Specialist', 10),
        (25, 'Steven', 'Wright', 'steven.w@company.com', 5, 83000, '2020-09-01', 'Accountant', 11)
    """))

    # Seed customers
    await db.execute(text("""
        INSERT OR IGNORE INTO customers (id, name, email, city, country, joined_date) VALUES
        (1, 'Alice Cooper', 'alice@email.com', 'New York', 'USA', '2022-01-15'),
        (2, 'Bob Martinez', 'bob@email.com', 'Los Angeles', 'USA', '2022-03-20'),
        (3, 'Carol White', 'carol@email.com', 'London', 'UK', '2022-02-10'),
        (4, 'David Kim', 'david@email.com', 'Tokyo', 'Japan', '2022-04-05'),
        (5, 'Eva Schmidt', 'eva@email.com', 'Berlin', 'Germany', '2022-05-12'),
        (6, 'Frank Brown', 'frank@email.com', 'Chicago', 'USA', '2022-06-01'),
        (7, 'Grace Lee', 'grace@email.com', 'Seoul', 'South Korea', '2022-07-20'),
        (8, 'Henry Wilson', 'henry@email.com', 'Sydney', 'Australia', '2022-08-15'),
        (9, 'Iris Chen', 'iris@email.com', 'Toronto', 'Canada', '2022-09-10'),
        (10, 'Jack Taylor', 'jack@email.com', 'New York', 'USA', '2022-10-05')
    """))

    # Seed orders
    await db.execute(text("""
        INSERT OR IGNORE INTO orders (id, customer_id, order_date, total_amount, status) VALUES
        (1, 1, '2024-01-05', 150.00, 'completed'),
        (2, 1, '2024-02-10', 89.99, 'completed'),
        (3, 2, '2024-01-15', 250.00, 'completed'),
        (4, 3, '2024-02-20', 175.50, 'shipped'),
        (5, 4, '2024-03-01', 320.00, 'completed'),
        (6, 5, '2024-03-10', 45.99, 'pending'),
        (7, 1, '2024-03-15', 199.99, 'processing'),
        (8, 6, '2024-03-20', 88.00, 'completed'),
        (9, 7, '2024-04-01', 560.00, 'completed'),
        (10, 2, '2024-04-05', 125.00, 'shipped'),
        (11, 8, '2024-04-10', 95.50, 'completed'),
        (12, 3, '2024-04-15', 210.00, 'pending'),
        (13, 9, '2024-05-01', 430.00, 'completed'),
        (14, 10, '2024-05-10', 67.99, 'completed'),
        (15, 4, '2024-05-15', 189.00, 'processing')
    """))

    # Seed products
    await db.execute(text("""
        INSERT OR IGNORE INTO products (id, name, category, price, stock) VALUES
        (1, 'Laptop Pro 15', 'Electronics', 1299.99, 50),
        (2, 'Wireless Mouse', 'Electronics', 29.99, 200),
        (3, 'USB-C Hub', 'Electronics', 49.99, 150),
        (4, 'Standing Desk', 'Furniture', 499.99, 30),
        (5, 'Ergonomic Chair', 'Furniture', 349.99, 45),
        (6, 'Monitor 27"', 'Electronics', 399.99, 75),
        (7, 'Mechanical Keyboard', 'Electronics', 89.99, 120),
        (8, 'Desk Lamp', 'Furniture', 39.99, 200),
        (9, 'Webcam HD', 'Electronics', 69.99, 90),
        (10, 'Notebook Pack', 'Stationery', 12.99, 500),
        (11, 'Headphones Pro', 'Electronics', 199.99, 80),
        (12, 'Phone Stand', 'Accessories', 19.99, 300)
    """))

    # Seed students
    await db.execute(text("""
        INSERT OR IGNORE INTO students (id, name, email, major, gpa, enrollment_year) VALUES
        (1, 'Alex Johnson', 'alex@university.edu', 'Computer Science', 3.8, 2021),
        (2, 'Bella Smith', 'bella@university.edu', 'Mathematics', 3.5, 2020),
        (3, 'Charlie Brown', 'charlie@university.edu', 'Physics', 3.2, 2022),
        (4, 'Diana Lee', 'diana@university.edu', 'Computer Science', 3.9, 2021),
        (5, 'Ethan Davis', 'ethan@university.edu', 'Engineering', 3.1, 2020),
        (6, 'Fiona Wilson', 'fiona@university.edu', 'Biology', 3.7, 2022),
        (7, 'George Miller', 'george@university.edu', 'Computer Science', 3.4, 2023),
        (8, 'Hannah Taylor', 'hannah@university.edu', 'Mathematics', 3.6, 2021)
    """))

    # Seed courses
    await db.execute(text("""
        INSERT OR IGNORE INTO courses (id, name, department, credits, instructor) VALUES
        (1, 'Intro to Programming', 'Computer Science', 4, 'Dr. Smith'),
        (2, 'Data Structures', 'Computer Science', 4, 'Dr. Johnson'),
        (3, 'Calculus I', 'Mathematics', 3, 'Prof. Williams'),
        (4, 'Linear Algebra', 'Mathematics', 3, 'Prof. Davis'),
        (5, 'Physics 101', 'Physics', 4, 'Dr. Brown'),
        (6, 'Database Systems', 'Computer Science', 3, 'Dr. Garcia')
    """))

    await db.commit()
