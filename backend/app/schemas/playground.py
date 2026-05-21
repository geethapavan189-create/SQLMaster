"""SQL Playground schemas."""
from pydantic import BaseModel
from typing import Optional, List, Any


class SQLExecuteRequest(BaseModel):
    query: str
    dataset: str = "employees"


class SQLExecuteResponse(BaseModel):
    success: bool
    columns: List[str] = []
    rows: List[List[Any]] = []
    row_count: int = 0
    execution_time: int = 0  # ms
    message: str = ""


class DatasetSchema(BaseModel):
    name: str
    tables: List[dict]


class QueryExplanation(BaseModel):
    query: str
    explanation: str
    optimization_tips: List[str] = []
