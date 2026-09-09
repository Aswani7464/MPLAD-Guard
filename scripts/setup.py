"""
MPLAD-Guard Project Setup Script

This script checks that the main project directories exist.
"""

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent

REQUIRED_DIRECTORIES = [
    "apps/web",
    "apps/mobile",
    "backend",
    "database",
    "ml",
    "data",
    "ai",
    "docs",
    "tests",
    "scripts",
]


def check_directories():
    print("Checking MPLAD-Guard project structure...\n")

    all_valid = True

    for directory in REQUIRED_DIRECTORIES:
        path = PROJECT_ROOT / directory

        if path.exists():
            print(f"[OK] {directory}")
        else:
            print(f"[MISSING] {directory}")
            all_valid = False

    print()

    if all_valid:
        print("Project structure is ready.")
    else:
        print("Some project directories are missing.")


if __name__ == "__main__":
    check_directories()
