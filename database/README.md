# MPLAD-Guard Database

The database component of the MPLAD-Guard Project Monitoring and Risk Analysis System.

## Structure

```text
database/
├── schema/
│   ├── users.sql
│   ├── projects.sql
│   ├── risks.sql
│   ├── verification.sql
│   ├── notifications.sql
│   └── analytics.sql
├── migrations/
├── seed/
│   └── seed.sql
└── README.md
```

## Database Platform

MPLAD-Guard uses **Supabase** for database storage and data management.

## Tables

### Users

Stores information about system users and their roles.

### Projects

Stores development project information, including location, budget, progress, and status.

### Risks

Stores project risk scores, risk levels, and risk descriptions.

### Verification

Stores project verification information and supporting evidence.

### Notifications

Stores notifications and alerts associated with system users.

### Analytics

Stores project performance metrics and analytical data.

## Seed Data

The `seed.sql` file contains sample project and system data used for development and testing.
