# MPLAD-Guard Deployment Guide

This document describes the basic deployment structure of the MPLAD-Guard system.

## System Components

The system consists of:

```text
React Web Application
        ↓
FastAPI Backend
        ↓
Supabase Database
        ↓
ML / AI Services
```

## Web Application

The web application is located at:

```text
apps/web/
```

It uses Vite and React.

Development command:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

## Backend

The backend is located at:

```text
backend/
```

The FastAPI application can be started during development with:

```bash
python -m uvicorn app.main:app --reload
```

## Database

MPLAD-Guard uses Supabase for database services.

Database-related files are maintained in:

```text
database/
```

## Environment Variables

Sensitive configuration values should be stored in environment variables rather than committed directly to the repository.

The project-level environment configuration will be documented in:

```text
.env.example
```

## Deployment

Before production deployment:

1. Configure environment variables.
2. Configure the Supabase database.
3. Build the React application.
4. Deploy the FastAPI backend.
5. Configure the production API URL.
6. Test authentication and API connectivity.
7. Verify database access.
8. Test the complete application.

## Security

Production deployment should use:

* HTTPS
* Secure environment variables
* Proper authentication
* Database access policies
* Restricted API access
* Secure handling of user data

