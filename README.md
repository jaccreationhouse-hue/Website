# JAC MediaLand Workspace

This repo contains:

- `client/` - public website
- `admin/` - admin dashboard
- `server/` - CMS API

## Server deployment

The CMS server requires these environment variables at startup:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `PORT`
- `NODE_ENV`
- `CORS_ORIGINS` - comma-separated list of allowed frontend origins

Use [server/.env.example](D:/JAC/demo-web-main/server/.env.example:1) as the reference.

## Render setup

For the Render service that runs the CMS API:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

Then set the required environment variables in the Render dashboard and redeploy.

## Frontend environment

Both frontend apps should point at the deployed CMS API with:

- `VITE_CMS_API_URL`

Typical use:

- `client`: `https://your-api-service.onrender.com`
- `admin`: `https://your-api-service.onrender.com`

If the admin dashboard should preview website-local assets such as `/logos_opt/...` or team photos stored in `client/public/team`, also set:

- `VITE_SITE_URL`

Typical use:

- `admin`: `https://www.jacmedialand.com`

## Backfill existing content into CMS

To load the current local website fallback content into MongoDB without wiping existing CMS entries:

```bash
cd server
npm run backfill:cms
```

What it does:

- inserts missing homepage highlights
- inserts missing trusted company logos
- inserts missing team, portfolio, programs, and careers data
- enriches existing services with slugs, subtitles, taglines, capabilities, featured flags, and sort order
- fills missing global settings fields without deleting current values

This command is non-destructive and safe to re-run.
