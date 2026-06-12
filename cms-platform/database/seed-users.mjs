/**
 * Seed CMS users with provided credentials.
 *
 * Usage:  node database/seed-users.mjs
 *
 * Creates four team accounts with the Super Admin role on the
 * JAC Media Land tenant/site. Safe to re-run — uses upserts.
 */

import { setServers } from 'node:dns';
import { pathToFileURL } from 'node:url';
import { randomUUID, scryptSync } from 'node:crypto';
import { MongoClient } from 'mongodb';

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const tenantId = 'tenant-jac-media-land';
const siteId   = 'site-jac-media-land';
const roleId   = 'role-super-admin';
const now      = new Date();

const PASSWORD = 'jac@2026';

const USERS = [
  { id: 'user-kapeesh',       email: 'kapeeshkapeesh66@gmail.com',  name: 'Kapeesh S' },
  { id: 'user-vjcharles',     email: 'vjcharles1234@gmail.com',     name: 'VJ Charles' },
  { id: 'user-jaccreation',   email: 'jaccreationhouse@gmail.com',  name: 'JAC Creation House' },
  { id: 'user-dharanidharan', email: 'bdharanidharan2005@gmail.com', name: 'Dharanidharan B' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hashPassword(password, salt) {
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('base64url')}`;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function seedUsers() {
  try { process.loadEnvFile?.(); } catch { /* .env is optional */ }

  const uri    = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB  ?? 'jac_cms';

  const dnsServers = (process.env.MONGODB_DNS_SERVERS ?? '8.8.8.8,1.1.1.1')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (uri.startsWith('mongodb+srv://') && dnsServers.length) setServers(dnsServers);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Ensure the Super Admin role exists (idempotent)
    await db.collection('roles').updateOne(
      { id: roleId },
      {
        $set: {
          tenantId,
          name: 'Super Admin',
          status: 'active',
          permissions: ['content.read', 'content.write', 'leads.read', 'leads.write', 'settings.write'],
          updatedAt: now,
        },
        $setOnInsert: { id: roleId, createdAt: now },
      },
      { upsert: true },
    );

    for (const user of USERS) {
      const salt = randomUUID();
      const passwordHash = hashPassword(PASSWORD, salt);

      // Upsert user
      await db.collection('users').updateOne(
        { email: user.email },
        {
          $set: {
            name: user.name,
            passwordHash,
            status: 'active',
            updatedAt: now,
          },
          $setOnInsert: { id: user.id, email: user.email, createdAt: now },
        },
        { upsert: true },
      );

      // Fetch the actual user id (may already exist with a different id)
      const existing = await db.collection('users').findOne({ email: user.email });
      const actualUserId = existing?.id ?? user.id;

      // Upsert membership
      await db.collection('memberships').updateOne(
        { tenantId, userId: actualUserId, roleId },
        {
          $set: { siteIds: [siteId], status: 'active', updatedAt: now },
          $setOnInsert: {
            id: `membership-${user.id.replace('user-', '')}`,
            tenantId,
            userId: actualUserId,
            roleId,
            createdAt: now,
          },
        },
        { upsert: true },
      );

      console.log(`✓  ${user.name} <${user.email}>`);
    }

    console.log(`\nAll ${USERS.length} users seeded with password: ${PASSWORD}`);
    console.log('Role: Super Admin | Tenant: JAC Media Land');
  } finally {
    await client.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedUsers().catch((err) => { console.error(err); process.exit(1); });
}
