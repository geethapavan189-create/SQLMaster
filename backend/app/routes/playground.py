import time
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database.session import get_db
from app.schemas.playground import SQLExecuteRequest, SQLExecuteResponse, QueryExplanation
from app.middleware.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/playground", tags=["SQL Playground"])

# Dangerous SQL patterns to block
BLOCKED_PATTERNS = [
    r'\bDROP\b',
    r'\bALTER\b',
    r'\bTRUNCATE\b',
    r'\bCREATE\s+TABLE\b',
    r'\bCREATE\s+DATABASE\b',
    r'\bDROP\s+DATABASE\b',
    r'\bGRANT\b',
    r'\bREVOKE\b',
    r'\bDELETE\b(?!.*\bWHERE\b)',  # DELETE without WHERE
]


def validate_query(query: str) -> tuple[bool, str]:
    """Validate SQL query for safety."""
    query_upper = query.upper().strip()
    
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, query_upper, re.IGNORECASE | re.DOTALL):
            return False, f"Query blocked: dangerous operation detected. Pattern: {pattern.split('b')[1] if 'b' in pattern else pattern}"
    
    return True, ""


@router.post("/execute", response_model=SQLExecuteResponse)
async def execute_sql(
    request: SQLExecuteRequest,
):
    """Execute a SQL query in the playground."""
    from app.database.session import AsyncSessionLocal
    
    # Validate query
    is_valid, error_msg = validate_query(request.query)
    if not is_valid:
        return SQLExecuteResponse(
            success=False,
            message=error_msg,
        )
    
    start_time = time.time()
    
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(text(request.query))
            execution_time = int((time.time() - start_time) * 1000)
            
            # Check if query returns rows
            if result.returns_rows:
                columns = list(result.keys())
                rows = [list(row) for row in result.fetchall()]
                return SQLExecuteResponse(
                    success=True,
                    columns=columns,
                    rows=rows[:1000],
                    row_count=len(rows),
                    execution_time=execution_time,
                    message=f"Query executed successfully. {len(rows)} row(s) returned.",
                )
            else:
                await session.commit()
                return SQLExecuteResponse(
                    success=True,
                    row_count=result.rowcount,
                    execution_time=execution_time,
                    message=f"Query executed successfully. {result.rowcount} row(s) affected.",
                )
        
        except Exception as e:
            await session.rollback()
            execution_time = int((time.time() - start_time) * 1000)
            error_msg = str(e)
            # Clean up error message for user
            if 'UNIQUE constraint' in error_msg:
                error_msg = "Duplicate value violates unique constraint."
            elif 'no such table' in error_msg:
                error_msg = f"Table not found. Available tables: employees, departments, salaries, customers, orders, products, students, courses"
            elif 'no such column' in error_msg:
                error_msg = error_msg.split('\n')[0] if '\n' in error_msg else error_msg
            elif 'near' in error_msg:
                error_msg = error_msg.split('\n')[0] if '\n' in error_msg else error_msg
            else:
                error_msg = error_msg.split('\n')[0] if '\n' in error_msg else error_msg
            return SQLExecuteResponse(
                success=False,
                execution_time=execution_time,
                message=f"SQL Error: {error_msg}",
            )


@router.post("/explain", response_model=QueryExplanation)
async def explain_query(request: SQLExecuteRequest):
    """Explain a SQL query in beginner-friendly terms."""
    query = request.query.strip().upper()
    
    explanations = []
    tips = []
    
    # Basic query analysis
    if "SELECT" in query:
        explanations.append("This is a SELECT query that retrieves data from the database.")
        if "*" in query:
            explanations.append("The * (asterisk) means 'select all columns' from the table.")
            tips.append("Consider selecting only the columns you need instead of using * for better performance.")
    
    if "WHERE" in query:
        explanations.append("The WHERE clause filters rows based on specified conditions.")
    
    if "JOIN" in query:
        explanations.append("JOIN combines rows from two or more tables based on a related column.")
        if "LEFT JOIN" in query:
            explanations.append("LEFT JOIN returns all rows from the left table, even if there's no match in the right table.")
        elif "RIGHT JOIN" in query:
            explanations.append("RIGHT JOIN returns all rows from the right table, even if there's no match in the left table.")
        elif "INNER JOIN" in query:
            explanations.append("INNER JOIN returns only rows that have matching values in both tables.")
    
    if "GROUP BY" in query:
        explanations.append("GROUP BY groups rows that have the same values in specified columns.")
        if "HAVING" in query:
            explanations.append("HAVING filters groups after GROUP BY (like WHERE but for groups).")
    
    if "ORDER BY" in query:
        explanations.append("ORDER BY sorts the result set by one or more columns.")
        if "DESC" in query:
            explanations.append("DESC means descending order (highest to lowest, Z to A).")
    
    if "LIMIT" in query:
        explanations.append("LIMIT restricts the number of rows returned.")
    
    if "INSERT" in query:
        explanations.append("INSERT adds new rows to a table.")
    
    if "UPDATE" in query:
        explanations.append("UPDATE modifies existing rows in a table.")
        tips.append("Always use a WHERE clause with UPDATE to avoid modifying all rows.")
    
    if not explanations:
        explanations.append("This query performs a database operation. Break it down into smaller parts to understand each component.")
    
    return QueryExplanation(
        query=request.query,
        explanation=" ".join(explanations),
        optimization_tips=tips,
    )


@router.get("/datasets")
async def get_datasets():
    """Get available datasets for the playground."""
    return [
        {
            "name": "employees",
            "description": "Employee management database with departments and salaries",
            "tables": ["employees", "departments", "salaries"],
        },
        {
            "name": "ecommerce",
            "description": "E-commerce database with customers, orders, and products",
            "tables": ["customers", "orders", "products", "payments"],
        },
        {
            "name": "students",
            "description": "University database with students, courses, and enrollments",
            "tables": ["students", "courses", "enrollments"],
        },
    ]


@router.get("/schema/{dataset}")
async def get_dataset_schema(dataset: str):
    """Get schema for a specific dataset."""
    schemas = {
        "employees": {
            "tables": [
                {
                    "name": "employees",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "first_name", "type": "VARCHAR(50)"},
                        {"name": "last_name", "type": "VARCHAR(50)"},
                        {"name": "email", "type": "VARCHAR(100)"},
                        {"name": "department_id", "type": "INTEGER", "foreign_key": "departments.id"},
                        {"name": "salary", "type": "DECIMAL(10,2)"},
                        {"name": "hire_date", "type": "DATE"},
                        {"name": "job_title", "type": "VARCHAR(100)"},
                        {"name": "manager_id", "type": "INTEGER", "foreign_key": "employees.id"},
                    ],
                },
                {
                    "name": "departments",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "name", "type": "VARCHAR(100)"},
                        {"name": "location", "type": "VARCHAR(100)"},
                        {"name": "budget", "type": "DECIMAL(12,2)"},
                    ],
                },
                {
                    "name": "salaries",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "employee_id", "type": "INTEGER", "foreign_key": "employees.id"},
                        {"name": "amount", "type": "DECIMAL(10,2)"},
                        {"name": "from_date", "type": "DATE"},
                        {"name": "to_date", "type": "DATE"},
                    ],
                },
            ],
        },
        "ecommerce": {
            "tables": [
                {
                    "name": "customers",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "name", "type": "VARCHAR(100)"},
                        {"name": "email", "type": "VARCHAR(100)"},
                        {"name": "city", "type": "VARCHAR(50)"},
                        {"name": "country", "type": "VARCHAR(50)"},
                        {"name": "joined_date", "type": "DATE"},
                    ],
                },
                {
                    "name": "orders",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "customer_id", "type": "INTEGER", "foreign_key": "customers.id"},
                        {"name": "order_date", "type": "DATE"},
                        {"name": "total_amount", "type": "DECIMAL(10,2)"},
                        {"name": "status", "type": "VARCHAR(20)"},
                    ],
                },
                {
                    "name": "products",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "name", "type": "VARCHAR(200)"},
                        {"name": "category", "type": "VARCHAR(50)"},
                        {"name": "price", "type": "DECIMAL(10,2)"},
                        {"name": "stock", "type": "INTEGER"},
                    ],
                },
                {
                    "name": "payments",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "order_id", "type": "INTEGER", "foreign_key": "orders.id"},
                        {"name": "amount", "type": "DECIMAL(10,2)"},
                        {"name": "payment_method", "type": "VARCHAR(30)"},
                        {"name": "payment_date", "type": "DATE"},
                    ],
                },
            ],
        },
        "students": {
            "tables": [
                {
                    "name": "students",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "name", "type": "VARCHAR(100)"},
                        {"name": "email", "type": "VARCHAR(100)"},
                        {"name": "major", "type": "VARCHAR(50)"},
                        {"name": "gpa", "type": "DECIMAL(3,2)"},
                        {"name": "enrollment_year", "type": "INTEGER"},
                    ],
                },
                {
                    "name": "courses",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "name", "type": "VARCHAR(100)"},
                        {"name": "department", "type": "VARCHAR(50)"},
                        {"name": "credits", "type": "INTEGER"},
                        {"name": "instructor", "type": "VARCHAR(100)"},
                    ],
                },
                {
                    "name": "enrollments",
                    "columns": [
                        {"name": "id", "type": "INTEGER", "primary_key": True},
                        {"name": "student_id", "type": "INTEGER", "foreign_key": "students.id"},
                        {"name": "course_id", "type": "INTEGER", "foreign_key": "courses.id"},
                        {"name": "grade", "type": "VARCHAR(2)"},
                        {"name": "semester", "type": "VARCHAR(20)"},
                    ],
                },
            ],
        },
    }
    
    if dataset not in schemas:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    return schemas[dataset]
