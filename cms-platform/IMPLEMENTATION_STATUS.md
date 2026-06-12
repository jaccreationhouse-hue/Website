# CMS Platform Implementation Status

## Implemented

- Independent CMS npm workspace with no website source imports
- NestJS API with Swagger, CORS, strict DTO validation, and health endpoints
- MongoDB collections and compound indexes for tenancy, RBAC, publishing,
  editorial content, media, forms, leads, refresh tokens, and audit logs
- Explicit `tenantId` and `siteId` filters in MongoDB content and lead
  repositories
- MongoDB bootstrap command with JAC Media Land seed content and local admin
- HMAC access/refresh tokens, single-use refresh rotation, persisted refresh
  revocation, permissions, and site membership checks
- Public pages, services, settings, menus, and form-submission endpoints
- Structured CMS collections and admin editors for highlights, team members,
  portfolio projects, programs, career openings, and contacts
- Protected page publishing/revision, complete service catalogue read, and lead
  status workflow endpoints
- Next.js admin shell with login, dashboard, content, lead, and settings screens
- Website-owned CMS HTTP client, CMS-driven service catalogue with local
  fallback, durable contact lead submission, and obsolete service-worker cleanup
- Automated contract, domain, Mongo schema, website integration, build, and
  compiled API boot checks
- Docker and Kubernetes are intentionally not used

## Remaining Roadmap

- Full admin CRUD editors for blogs, taxonomy, authors, products, FAQs,
  testimonials, menus, forms, SEO, users, roles, media, and audit logs
- Media upload/storage flow, variants, malware scanning, and CDN invalidation
- Response caching, distributed rate limiting, queues, retries, and dead-letter
  handling where production scale requires them
- Audit-log writes for every protected mutation and approval/rollback UI
- Email/webhook notifications, lead assignment/export, and privacy retention jobs
- CMS migration of every current website page and route-specific SEO rendering
- Production CI/CD, monitoring, backups, restore drills, load testing, and
  penetration testing

## Known Dependency Advisory

The dependency audit reports two moderate advisories caused by Next.js `16.2.7`
pinning PostCSS `8.4.31`. npm currently offers only an unsafe major downgrade
as an automated fix. No high or critical advisories are reported.
