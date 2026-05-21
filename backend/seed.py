"""Database seeding script."""
import asyncio
from app.database.session import AsyncSessionLocal, init_db
from app.services.seed_data import seed_all
from app.services.seed_playground import seed_playground_tables


async def main():
    """Initialize database and seed data."""
    print("Initializing database...")
    await init_db()
    print("Database tables created.")
    
    print("Seeding data...")
    async with AsyncSessionLocal() as session:
        try:
            await seed_all(session)
            print("App data seeded successfully!")
        except Exception as e:
            print(f"Error seeding app data: {e}")
            await session.rollback()

    print("Seeding playground tables...")
    async with AsyncSessionLocal() as session:
        try:
            await seed_playground_tables(session)
            print("Playground data seeded successfully!")
        except Exception as e:
            print(f"Error seeding playground data: {e}")
            await session.rollback()

    print("Done!")


if __name__ == "__main__":
    asyncio.run(main())
