import { setServers } from 'node:dns';
import { pathToFileURL } from 'node:url';
import { MongoClient } from 'mongodb';

const collectionNames = [
  'tenants',
  'sites',
  'users',
  'roles',
  'memberships',
  'refreshTokens',
  'pages',
  'contentRevisions',
  'services',
  'settings',
  'menus',
  'menuItems',
  'mediaAssets',
  'formDefinitions',
  'leads',
  'jobApplications',
  'leadActivities',
  'auditLogs',
  'categories',
  'tags',
  'authors',
  'blogPosts',
  'products',
  'highlights',
  'programs',
  'portfolioProjects',
  'careerOpenings',
  'contacts',
  'faqs',
  'testimonials',
  'teamMembers'
];

const tenantId = 'tenant-jac-media-land';
const siteId = 'site-jac-media-land';
const userId = 'user-local-admin';
const roleId = 'role-super-admin';
const now = new Date();

export const seedServices = [
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    subtitle: 'Brand identity and visual systems',
    tagline: 'Creative designs. Powerful impact.',
    description: 'We create thoughtful visual identities and brand assets that make businesses recognizable, credible, and ready to grow.',
    capabilities: ['Brand Identity', 'Campaign Design', 'Creative Systems'],
    featured: false
  },
  {
    slug: 'app-development',
    title: 'App Development',
    subtitle: 'Mobile and web applications',
    tagline: 'From idea to useful product.',
    description: 'We design and build dependable applications that solve real customer problems and support long-term business growth.',
    capabilities: ['Mobile Apps', 'Web Apps', 'Product Engineering'],
    featured: false
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    subtitle: 'Fast, modern, conversion-ready websites',
    tagline: 'Built to perform and convert.',
    description: 'We build responsive websites that combine clear storytelling, dependable engineering, and smooth user experiences.',
    capabilities: ['Business Websites', 'E-commerce', 'Performance'],
    featured: false
  },
  {
    slug: 'seo-marketing',
    title: 'SEO Marketing',
    subtitle: 'Search visibility and organic growth',
    tagline: 'Get found by the right audience.',
    description: 'We improve search visibility with research-led content, technical optimization, and measurable organic growth strategies.',
    capabilities: ['Technical SEO', 'Content Strategy', 'Local Search'],
    featured: false
  },
  {
    slug: 'ui-ux-design',
    title: 'UI / UX Design',
    subtitle: 'User-centered digital experiences',
    tagline: 'Clear, intuitive, and useful.',
    description: 'We turn complex product ideas into intuitive interfaces and journeys that feel easy for customers to understand and use.',
    capabilities: ['UX Research', 'Interface Design', 'Prototyping'],
    featured: false
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    subtitle: 'Campaigns that connect and convert',
    tagline: 'Smart strategy. Real outcomes.',
    description: 'We create focused digital campaigns that strengthen visibility, generate qualified leads, and support sustainable growth.',
    capabilities: ['Paid Campaigns', 'Lead Generation', 'Analytics'],
    featured: false
  },
  {
    slug: 'social-media',
    title: 'Social Media Management',
    subtitle: 'Content, community, and brand growth',
    tagline: 'Stay relevant. Build real connection.',
    description: 'We plan content, manage conversations, and grow communities so your brand stays active, consistent, and memorable.',
    capabilities: ['Content Planning', 'Community Management', 'Growth Reporting'],
    featured: true
  }
];

export const obsoleteSeedServiceSlugs = [
  'brand-strategy',
  'creative-design',
  'web-development',
  'video-production',
  'event-management'
];

const structuredContent = {
  highlights: [
    { slug: 'hours-of-support', title: 'Hours of Support', value: '35,064+' },
    { slug: 'projects', title: 'Projects', value: '2,300+' },
    { slug: 'happy-clients', title: 'Happy Clients', value: '3,000+' },
    { slug: 'smartmates', title: 'SmartMates', value: '30' }
  ],
  teamMembers: [
    {
      slug: 'john-charles',
      title: 'John Charles',
      role: 'Founder and CEO',
      image: 'john-founder.jpg',
      featured: true,
      message: 'Building a team where thoughtful ideas, bold creativity, and dependable execution come together to create work that matters.'
    },
    { slug: 'dharanidhran-p', title: 'DHARANIDHRAN P', role: 'HR & MANAGER', image: 'gowtham.webp?v=3' },
    { slug: 'kapeesh-s', title: 'KAPEESH S', role: 'TEAM LEAD', image: 'saranya.webp?v=3' },
    { slug: 'gowshik-s', title: 'GOWSHIK S', role: 'DEVELOPER', image: 'kanishk.webp?v=3' },
    { slug: 'mohan-raj-p', title: 'MOHAN RAJ P', role: 'UI UX DESIGNER', image: 'logesh.webp?v=3' },
    { slug: 'sahaya-stephen-s', title: 'SAHAYA STEPHEN S', role: 'DATA ANALYST', image: 'haritha.webp?v=3' },
    { slug: 'vinodh-t', title: 'VINODH T', role: 'DEVELOPER', image: 'ganapathi.webp?v=3' },
    { slug: 'mounika-v-m', title: 'MOUNIKA V M', role: 'SOCIAL MEDIA MANAGER', image: 'angamuthu.webp?v=3' }
  ],
  portfolioProjects: [
    { slug: 'gym', title: 'Gym', industry: 'Fitness', category: 'development', url: 'https://gym-ten-sandy.vercel.app/', visual: 'portfolio-visual-gym' },
    { slug: 'travel-agency', title: 'Travel Agency', industry: 'Travel', category: 'development', url: 'https://travel-agency-livid-delta.vercel.app/', visual: 'portfolio-visual-travel' },
    { slug: 'real-estate', title: 'Real Estate', industry: 'Property', category: 'development', url: 'https://real-estate-delta-lake.vercel.app/', visual: 'portfolio-visual-estate' },
    { slug: 'chartered-accountants', title: 'Chartered Accountants', industry: 'Professional services', category: 'development', url: 'https://chartered-accountant-website-opal.vercel.app/', visual: 'portfolio-visual-accountants' }
  ],
  programs: [
    {
      slug: 'internship',
      title: 'Internship Program',
      kind: 'active',
      launch: 'Open Now',
      description: 'Work alongside our team, develop practical industry skills, and gain professional exposure through real-time digital projects.',
      path: '/programs/internship',
      imageKey: 'internship'
    },
    {
      slug: 'full-stack-bootcamp',
      title: 'Full-Stack Bootcamp',
      kind: 'upcoming',
      launch: 'Launching Q3 2026',
      description: 'A practical pathway covering modern web development from interface to deployment.',
      imageKey: 'full-stack'
    },
    {
      slug: 'ui-ux-graphic-design',
      title: 'UI/UX & Graphic Design',
      kind: 'upcoming',
      launch: 'Launching Q4 2026',
      description: 'Build thoughtful design skills across digital products, brands, and visual systems.',
      imageKey: 'design'
    }
  ],
  careerOpenings: [
    {
      slug: 'talent-network',
      title: 'Join our Talent Network',
      department: 'Future Opportunities',
      location: 'Erode, Tamil Nadu / Flexible',
      employmentType: 'General Application',
      workplaceType: 'Flexible',
      salary: '',
      description: 'Tell us what you do well, what you want to learn next, and why JAC Media Land interests you.',
      responsibilities: [
        'Share the kind of work you want to do and the problems you enjoy solving.',
        'Tell us how you collaborate, learn, and make useful progress.'
      ],
      requirements: [
        'A thoughtful introduction and examples of relevant work or learning.',
        'Interest in building useful digital products, brands, or campaigns.'
      ],
      benefits: [
        'Consideration for suitable current and future opportunities.',
        'A respectful conversation when your profile matches an opening.'
      ],
      acceptingApplications: true,
      generalApplication: true
    }
  ],
  contacts: [
    {
      slug: 'primary',
      title: 'JAC Media Land Contact',
      phone: '+91 73388 91367',
      phoneHref: 'tel:+917338891367',
      email: 'jaccreationhouse@gmail.com',
      address: "NGS Complex, Chennimalai Rd, near Erode Art's and Science College, Rangampalayam, Erode, Tamil Nadu 638009",
      city: 'Erode, Tamil Nadu',
      responseTime: 'Response within one business day',
      heroTitle: "Bring us the challenge. We'll help shape the next move.",
      heroDescription: 'Share your goals, current roadblocks, or early idea. Our team will respond with clear next steps and the right mix of expertise.'
    }
  ]
};

async function ensureCollections(db) {
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name));
  await Promise.all(
    collectionNames
      .filter((name) => !existing.has(name))
      .map((name) => db.createCollection(name))
  );
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('sites').createIndex({ key: 1 }, { unique: true }),
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('refreshTokens').createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection('refreshTokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection('pages').createIndex({ tenantId: 1, siteId: 1, slug: 1 }, { unique: true }),
    db.collection('services').createIndex({ tenantId: 1, siteId: 1, slug: 1 }, { unique: true }),
    db.collection('settings').createIndex({ siteId: 1, namespace: 1, key: 1 }, { unique: true }),
    db.collection('menus').createIndex({ tenantId: 1, siteId: 1, key: 1 }, { unique: true }),
    db.collection('formDefinitions').createIndex({ tenantId: 1, siteId: 1, key: 1 }, { unique: true }),
    db.collection('contentRevisions').createIndex(
      { tenantId: 1, siteId: 1, entityType: 1, entityId: 1, revisionNumber: -1 },
      { unique: true }
    ),
    db.collection('leads').createIndex(
      { siteId: 1, formDefinitionId: 1, idempotencyKey: 1 },
      {
        unique: true,
        partialFilterExpression: { idempotencyKey: { $type: 'string' } }
      }
    ),
    db.collection('leads').createIndex({ tenantId: 1, siteId: 1, createdAt: -1 }),
    db.collection('jobApplications').createIndex({ tenantId: 1, siteId: 1, createdAt: -1 }),
    db.collection('jobApplications').createIndex(
      { siteId: 1, idempotencyKey: 1 },
      {
        unique: true,
        partialFilterExpression: { idempotencyKey: { $type: 'string' } }
      }
    ),
    ...Object.keys(structuredContent).map((name) =>
      db.collection(name).createIndex({ tenantId: 1, siteId: 1, slug: 1 }, { unique: true })
    ),
    db.collection('auditLogs').createIndex({ tenantId: 1, siteId: 1, createdAt: -1 }),
    db.collection('auditLogs').createIndex({ entityType: 1, entityId: 1, createdAt: -1 })
  ]);
}

async function seedStructuredContent(db) {
  for (const [collectionName, items] of Object.entries(structuredContent)) {
    await Promise.all(items.map((item, sortOrder) =>
      db.collection(collectionName).updateOne(
        { tenantId, siteId, slug: item.slug },
        {
          $set: { ...item, status: 'published', sortOrder, publishedAt: now, updatedAt: now },
          $setOnInsert: { id: `${collectionName}-${item.slug}`, tenantId, siteId, createdAt: now }
        },
        { upsert: true }
      )
    ));
  }
}

async function seed(db) {
  await db.collection('tenants').updateOne(
    { id: tenantId },
    {
      $set: { name: 'JAC Media Land', status: 'active', updatedAt: now },
      $setOnInsert: { id: tenantId, createdAt: now }
    },
    { upsert: true }
  );
  await db.collection('sites').updateOne(
    { id: siteId },
    {
      $set: { tenantId, key: 'jac-media-land', name: 'JAC Media Land', status: 'active', updatedAt: now },
      $setOnInsert: { id: siteId, createdAt: now }
    },
    { upsert: true }
  );
  await db.collection('roles').updateOne(
    { id: roleId },
    {
      $set: {
        tenantId,
        name: 'Super Admin',
        status: 'active',
        permissions: ['content.read', 'content.write', 'leads.read', 'leads.write', 'settings.write'],
        updatedAt: now
      },
      $setOnInsert: { id: roleId, createdAt: now }
    },
    { upsert: true }
  );
  await db.collection('users').updateOne(
    { id: userId },
    {
      $set: {
        email: 'admin@local.cms',
        name: 'Local Administrator',
        passwordHash: 'scrypt$local-bootstrap-salt$yG9fLFGKr8FspewQzM5h2Iw2A1Pmct5bFMd3AFr27VjZ6TUJDOORyJoI7dU5StoBqOQuhz66msw-060NyE-0wQ',
        status: 'active',
        updatedAt: now
      },
      $setOnInsert: { id: userId, createdAt: now }
    },
    { upsert: true }
  );
  await db.collection('memberships').updateOne(
    { tenantId, userId, roleId },
    {
      $set: { siteIds: [siteId], status: 'active', updatedAt: now },
      $setOnInsert: { id: 'membership-local-admin', tenantId, userId, roleId, createdAt: now }
    },
    { upsert: true }
  );
  await db.collection('pages').updateOne(
    { tenantId, siteId, slug: 'home' },
    {
      $set: {
        title: 'JAC Media Land',
        status: 'published',
        blocks: [],
        seo: { title: 'JAC Media Land' },
        publishedAt: now,
        updatedAt: now
      },
      $setOnInsert: { id: 'page-home', tenantId, siteId, slug: 'home', createdAt: now }
    },
    { upsert: true }
  );
  await Promise.all(
    seedServices.map((service, sortOrder) =>
      db.collection('services').updateOne(
        { tenantId, siteId, slug: service.slug },
        {
          $set: { ...service, status: 'published', sortOrder, publishedAt: now, updatedAt: now },
          $setOnInsert: { id: `service-${service.slug}`, tenantId, siteId, createdAt: now }
        },
        { upsert: true }
      )
    )
  );
  await db.collection('services').updateMany(
    {
      tenantId,
      siteId,
      id: { $in: obsoleteSeedServiceSlugs.map((slug) => `service-${slug}`) }
    },
    { $set: { status: 'archived', updatedAt: now } }
  );
  await db.collection('settings').updateOne(
    { siteId, namespace: 'site', key: 'identity' },
    {
      $set: {
        tenantId,
        visibility: 'public',
        value: { name: 'JAC Media Land', email: 'jaccreationhouse@gmail.com' },
        updatedAt: now
      },
      $setOnInsert: { id: 'setting-site-identity', siteId, namespace: 'site', key: 'identity', createdAt: now }
    },
    { upsert: true }
  );
  await db.collection('formDefinitions').updateOne(
    { tenantId, siteId, key: 'contact' },
    {
      $set: {
        name: 'Contact',
        status: 'active',
        fields: [
          { key: 'subject', required: true },
          { key: 'message', required: true }
        ],
        updatedAt: now
      },
      $setOnInsert: { id: 'form-contact', tenantId, siteId, key: 'contact', createdAt: now }
    },
    { upsert: true }
  );
  await seedStructuredContent(db);
}

export async function setupDatabase(options = {}) {
  if (options.loadEnv !== false) {
    try {
      process.loadEnvFile?.();
    } catch {
      // Local .env is optional.
    }
  }

  const uri = options.uri ?? process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017';
  const dbName = options.dbName ?? process.env.MONGODB_DB ?? 'jac_cms';
  const dnsServers = (
    options.dnsServers ??
    process.env.MONGODB_DNS_SERVERS ??
    '8.8.8.8,1.1.1.1'
  ).split(',').map((server) => server.trim()).filter(Boolean);
  if (uri.startsWith('mongodb+srv://') && dnsServers.length) setServers(dnsServers);
  const client = options.client ?? new MongoClient(uri);
  const ownsClient = !options.client;

  try {
    if (ownsClient) await client.connect();
    const db = client.db(dbName);
    await ensureCollections(db);
    await ensureIndexes(db);
    await seed(db);
    return { database: dbName, collections: collectionNames.length };
  } finally {
    if (ownsClient) await client.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await setupDatabase();
  console.log(`MongoDB ready: ${result.database} (${result.collections} collections)`);
}
