# JAC Headless CMS Platform

This is an independent CMS codebase with a NestJS API, Next.js admin application,
shared contracts, and MongoDB persistence. It does not require Docker or
Kubernetes.

## Applications

- `apps/api`: NestJS REST API and Swagger documentation
- `apps/admin`: Next.js administration panel
- `packages/contracts`: stable API contracts shared inside the CMS platform
- `database/bootstrap.mjs`: MongoDB collections, indexes, and development seed

## MongoDB Setup

Create a private environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace `<db_password>` in `MONGODB_URI`. URI-reserved
characters in a password must be percent encoded; for example, encode `@` as
`%40`. Keep `.env` private. For MongoDB Atlas, also allow your current IP address
and give the database user read/write access to `jac_cms`. The included
`MONGODB_DNS_SERVERS` setting works around Windows/Node SRV lookup failures
without changing system DNS settings.

Initialize collections, indexes, and seed data:

```powershell
npm install
npm run db:setup
```

You may instead use a locally installed MongoDB service by setting:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=jac_cms
```

## Local Development

Run these in separate PowerShell terminals:

```powershell
npm run dev:api
```

```powershell
npm run dev:admin
```

- Admin: `http://localhost:3000`
- API: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`

## Website Sections

Open `http://localhost:3000/collections` after signing in to manage:

- Our Highlights
- People Behind Our Success
- Portfolio
- Our Programs
- Careers
- Contacts

Published records are delivered to the website through the public structured
collection API. The website keeps its current local content as an availability
fallback.

## Local Bootstrap Login

The seed creates a development administrator:

- Email: `admin@local.cms`
- Password: `ChangeMe!123`

Replace or disable this account before any shared, staging, or production use.
