# Contributing to MPLAD-Guard

Thank you for contributing to MPLAD-Guard.

## Project Structure

Please follow the existing project structure when adding or modifying files.

Main areas include:

* `apps/web/` — React web application
* `apps/mobile/` — Mobile application
* `backend/` — FastAPI backend
* `database/` — Database schema and seed files
* `ml/` — Machine learning components
* `ai/` — AI components
* `data/` — Project data
* `docs/` — Documentation
* `tests/` — Testing
* `scripts/` — Project automation scripts

## Development Guidelines

* Keep code organized according to the project structure.
* Use clear and meaningful names for files, functions, and components.
* Avoid unnecessary changes to unrelated parts of the project.
* Do not commit passwords, API keys, tokens, or other secrets.
* Keep documentation updated when major functionality changes.
* Test changes before committing them.

## Frontend Development

The web application is located in:

`apps/web/`

Run the development server with:

```bash
cd apps/web
npm run dev
```

## Backend Development

The backend is located in:

`backend/`

Run the FastAPI development server with:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

## Git Workflow

Before making changes, update your local branch.

Create a separate branch for significant changes instead of directly modifying the main branch.

Use clear commit messages that describe the change.

Example:

```text
Add project risk dashboard
```

## Pull Requests

Pull requests should:

* Clearly describe the changes.
* Explain how the changes were tested.
* Avoid unrelated modifications.
* Avoid committing sensitive information.
* Include documentation updates when necessary.

## Security

Never commit:

* `.env` files containing real credentials
* API keys
* Database passwords
* Access tokens
* Private credentials

Use `.env.example` to document required environment variables without exposing their values.

