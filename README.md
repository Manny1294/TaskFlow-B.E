# TaskFlow Backend

Multi-tenant task management backend using schema-based tenancy with background CSV export jobs.

## Tech Stack
- Node.js + Express
- PostgreSQL + Sequelize
- Redis + Bull

## Architecture Summary
- `public.organizations` stores tenant metadata (`id`, `name`, `schemaName`).
- Each tenant has its own schema (for example `tenant_acme`, `tenant_globex`).
- Tenant schemas contain `users` and `tasks` tables.
- `x-tenant-id` and `x-user-id` headers simulate auth and control schema switching.

## Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env
```

3. Create PostgreSQL user/database (example):
```bash
createuser -s taskflow
createdb taskflow_db
```

4. Start Redis:
```bash
redis-server
```

5. Seed data:
```bash
npm run seed
```

6. Start server:
```bash
npm run dev
```

## Create a Tenant
This project seeds two tenants by default. To create a new tenant manually:
1. Insert an organization row into `public.organizations` with a unique `schema_name`.
2. Create that schema in Postgres (`CREATE SCHEMA ...`).
3. Sync `users` and `tasks` tables into that schema (use `schemaManager` utility).

## API Endpoints
Headers required for protected endpoints:
- `x-tenant-id`
- `x-user-id`

### Tasks
- `GET /tasks` - list tasks for current tenant
- `POST /tasks` - create task
- `PATCH /tasks/:id` - update task status (defaults to completed)
- `POST /tasks/export` - trigger background export (admin only)

### Exports
- `GET /exports/:id` - check export job status
- `GET /exports/<filename>.csv` - download generated CSV file

## Quick Testing (curl)
Get tasks for Acme (tenant 1, user 1):
```bash
curl -H "x-tenant-id: 1" -H "x-user-id: 1" http://localhost:5000/tasks
```

Trigger export:
```bash
curl -X POST -H "x-tenant-id: 1" -H "x-user-id: 1" http://localhost:5000/tasks/export
```

Check export status:
```bash
curl -H "x-tenant-id: 1" -H "x-user-id: 1" http://localhost:5000/exports/<jobId>
```

## Scripts
- `npm run dev` - run with nodemon
- `npm start` - run server
- `npm run seed` - seed organizations, users, tasks
- `npm run test:tenant` - verify tenant isolation from CLI
