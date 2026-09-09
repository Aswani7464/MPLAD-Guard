"""
MPLAD-Guard Database Seed Script

This script provides a placeholder for running
the database seed process.
"""

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SEED_FILE = PROJECT_ROOT / "database" / "seed" / "seed.sql"


def seed_database():
    print("MPLAD-Guard Database Seed")
    print("--------------------------")

    if SEED_FILE.exists():
        print(f"Seed file found: {SEED_FILE}")
        print("Database seed file is ready.")
        print()
        print("Run the SQL file through Supabase when required.")
    else:
        print("Seed file was not found.")


if __name__ == "__main__":
    seed_database()
