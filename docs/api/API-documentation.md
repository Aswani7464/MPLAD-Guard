# MPLAD-Guard API Documentation

The MPLAD-Guard backend provides REST API endpoints for the web application.

## Backend

The backend is built using FastAPI.

Development server:

```text
http://127.0.0.1:8000
```

Interactive API documentation is available through FastAPI Swagger UI:

```text
http://127.0.0.1:8000/docs
```

## Main API Modules

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Projects

```text
POST /projects/
GET /projects/
PUT /projects/{id}
DELETE /projects/{id}
```

### Dashboard

```text
GET /dashboard/summary
```

### Risk

```text
GET /risk/{project_id}
POST /risk/
```

### Verification

```text
GET /verification/{project_id}
POST /verification/
PUT /verification/{verification_id}
```

### Analytics

```text
GET /analytics/projects
GET /analytics/risks
```

### Reports

```text
GET /reports/{project_id}
POST /reports/
```

### Notifications

```text
GET /notifications/
GET /notifications/user/{user_id}
```

### Health Check

```text
GET /health
```

## API Response Format

The API uses JSON responses.

Example:

```json
{
  "status": "success"
}
```

## Integration

The React web application communicates with the FastAPI backend through HTTP requests.

The frontend API services are located in:

```text
apps/web/src/services/
```

