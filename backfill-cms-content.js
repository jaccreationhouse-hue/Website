import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Highlight from './models/Highlight.js';
import ClientLogo from './models/ClientLogo.js';
import Team from './models/Team.js';
import Project from './models/Project.js';
import Service from './models/Service.js';
import Program from './models/Program.js';
import CareerOpening from './models/CareerOpening.js';
import Settings from './models/Settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const mongoUri = process.env.MONGODB_URI?.trim();

if (!mongoUri) {
  throw new Error('Missing required environment variable: MONGODB_URI');
}

const fallbackHighlights = [
  { slug: 'hours-of-support', title: 'Hours of Support', value: '35,064+' },
  { slug: 'projects', title: 'Projects', value: '2,300+' },
  { slug: 'happy-clients', title: 'Happy Clients', value: '3,000+' },
  { slug: 'smartmates', title: 'SmartMates', value: '30' }
];

const fallbackTrustedCompanies = [
  { slug: 'what-clicks', title: 'What Clicks', logoUrl: '/logos_opt/1.webp', website: '' },
  { slug: 'vs-dental', title: 'VS Dental', logoUrl: '/logos_opt/2.webp', website: '' },
  { slug: 'credia-mediations', title: 'Credia Mediations', logoUrl: '/logos_opt/3.webp', website: '' },
  { slug: 'thoospot', title: 'Thoospot', logoUrl: '/logos_opt/4.webp', website: '' },
  { slug: 'tetra-platfms', title: 'Tetra Platfms', logoUrl: '/logos_opt/5.webp', website: '' },
  { slug: 'prn-construction', title: 'PRN Construction', logoUrl: '/logos_opt/6.webp', website: '' },
  { slug: 'p-inc', title: 'P Inc.', logoUrl: '/logos_opt/7.webp', website: '' },
  { slug: 'pharach', title: 'Pharach', logoUrl: '/logos_opt/8.webp', website: '' },
  { slug: 'car-decore', title: 'Car Decore', logoUrl: '/logos_opt/9.webp', website: '' },
  { slug: 'pandiyan-agency', title: 'Pandiyan Agency', logoUrl: '/logos_opt/10.webp', website: '' }
];

const fallbackTeamMembers = [
  {
    slug: 'john-charles',
    title: 'John Charles',
    role: 'Founder and CEO',
    image: 'john-founder.jpg',
    featured: true,
    message: 'Building a team where thoughtful ideas, bold creativity, and dependable execution come together to create work that matters.'
  },
  { slug: 'dharanidhran-p', title: 'DHARANIDHRAN P', role: 'HR & MANAGER', image: 'dharanidhran.png' },
  { slug: 'kapeesh-s', title: 'KAPEESH S', role: 'TEAM LEAD', image: 'kapeesh.jpg' },
  { slug: 'gowshik-s', title: 'GOWSHIK S', role: 'DEVELOPER', image: 'gowsi.jpeg' },
  { slug: 'mohan-raj-p', title: 'MOHAN RAJ P', role: 'UI UX DESIGNER', image: 'mohan.jpeg' },
  { slug: 'sahaya-stephen-s', title: 'SAHAYA STEPHEN S', role: 'DATA ANALYST', image: 'stephen.jpeg' },
  { slug: 'vinodh-t', title: 'VINODH T', role: 'DEVELOPER', image: 'vno.jpeg' },
  { slug: 'nithya-sree-m', title: 'Nithya Sree M', role: 'Social Media Management', image: 'nithya.png' }
];

const fallbackPortfolioProjects = [
  { slug: 'gym', title: 'Gym', industry: 'Fitness', category: 'development', url: 'https://gym-ten-sandy.vercel.app/', visual: 'portfolio-visual-gym' },
  { slug: 'travel-agency', title: 'Travel Agency', industry: 'Travel', category: 'development', url: 'https://travel-agency-livid-delta.vercel.app/', visual: 'portfolio-visual-travel' },
  { slug: 'real-estate', title: 'Real Estate', industry: 'Property', category: 'development', url: 'https://real-estate-delta-lake.vercel.app/', visual: 'portfolio-visual-estate' },
  { slug: 'chartered-accountants', title: 'Chartered Accountants', industry: 'Professional services', category: 'development', url: 'https://chartered-accountant-website-opal.vercel.app/', visual: 'portfolio-visual-accountants' },
  { slug: 'logo-1', title: 'TM Brand Identity', industry: 'Corporate', category: 'logo', url: '/logos_opt/1.webp', visual: '/logos_opt/1.webp' },
  { slug: 'logo-2', title: 'Kidhev Logo', industry: 'Healthcare', category: 'logo', url: '/logos_opt/2.webp', visual: '/logos_opt/2.webp' },
  { slug: 'logo-3', title: 'Ww- Design', industry: 'Creative', category: 'logo', url: '/logos_opt/3.webp', visual: '/logos_opt/3.webp' },
  { slug: 'logo-4', title: 'GOTFYD Branding', industry: 'Marketing', category: 'logo', url: '/logos_opt/4.webp', visual: '/logos_opt/4.webp' },
  { slug: 'logo-5', title: 'Toilal ELE Logo', industry: 'Industrial', category: 'logo', url: '/logos_opt/5.webp', visual: '/logos_opt/5.webp' },
  { slug: 'logo-6', title: 'Uunet Wordmark', industry: 'Technology', category: 'logo', url: '/logos_opt/6.webp', visual: '/logos_opt/6.webp' },
  { slug: 'logo-7', title: 'HlGA Brand Identity', industry: 'Media', category: 'logo', url: '/logos_opt/7.webp', visual: '/logos_opt/7.webp' },
  { slug: 'logo-8', title: 'NM Monogram', industry: 'Creative', category: 'logo', url: '/logos_opt/8.webp', visual: '/logos_opt/8.webp' },
  { slug: 'logo-9', title: 'Level Up Learning', industry: 'Education', category: 'logo', url: '/logos_opt/9.webp', visual: '/logos_opt/9.webp' },
  { slug: 'logo-10', title: 'JAC Creative Brand', industry: 'Services', category: 'logo', url: '/logos_opt/10.webp', visual: '/logos_opt/10.webp' },
  { slug: 'logo-11', title: 'Lvel Design Logo', industry: 'Wellness', category: 'logo', url: '/logos_opt/11.webp', visual: '/logos_opt/11.webp' },
  { slug: 'logo-12', title: 'Corporate Emblem', industry: 'Finance', category: 'logo', url: '/logos_opt/12.webp', visual: '/logos_opt/12.webp' },
  { slug: 'logo-13', title: 'Upwork Identity', industry: 'Technology', category: 'logo', url: '/logos_opt/13.webp', visual: '/logos_opt/13.webp' },
  { slug: 'logo-14', title: 'VVM Traders', industry: 'Agriculture', category: 'logo', url: '/logos_opt/14.webp', visual: '/logos_opt/14.webp' }
];

const fallbackPrograms = [
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
];

const fallbackCareerOpenings = [
  {
    slug: 'talent-network',
    title: 'Apply for Jobs',
    department: 'Future Opportunities',
    location: 'Erode, Tamil Nadu / Flexible',
    employmentType: 'General Application',
    workplaceType: 'Flexible',
    description: 'Tell us what you do well, what you want to learn next, and why JAC MediaLand interests you.',
    responsibilities: ['Share the work you want to do and the problems you enjoy solving.'],
    requirements: ['A thoughtful introduction and examples of relevant work or learning.'],
    benefits: ['Consideration for suitable current and future opportunities.'],
    acceptingApplications: true,
    generalApplication: true
  }
];

const fallbackServices = [
  {
    title: 'Graphic Design',
    subtitle: 'Brand identity and visual systems',
    tagline: 'Creative designs. Powerful impact.',
    description: 'We create thoughtful visual identities and brand assets that make businesses recognizable, credible, and ready to grow.',
    path: '/services/graphic-design',
    capabilities: ['Brand Identity', 'Campaign Design', 'Creative Systems'],
    icon: 'FiPenTool'
  },
  {
    title: 'App Development',
    subtitle: 'Mobile and web applications',
    tagline: 'From idea to useful product.',
    description: 'We design and build dependable applications that solve real customer problems and support long-term business growth.',
    path: '/services/app-development',
    capabilities: ['Mobile Apps', 'Web Apps', 'Product Engineering'],
    icon: 'FiSmartphone'
  },
  {
    title: 'Website Development',
    subtitle: 'Fast, modern, conversion-ready websites',
    tagline: 'Built to perform and convert.',
    description: 'We build responsive websites that combine clear storytelling, dependable engineering, and smooth user experiences.',
    path: '/services/website-development',
    capabilities: ['Business Websites', 'E-commerce', 'Performance'],
    icon: 'FiCode'
  },
  {
    title: 'SEO Marketing',
    subtitle: 'Search visibility and organic growth',
    tagline: 'Get found by the right audience.',
    description: 'We improve search visibility with research-led content, technical optimization, and measurable organic growth strategies.',
    path: '/services/seo-marketing',
    capabilities: ['Technical SEO', 'Content Strategy', 'Local Search'],
    icon: 'FiSearch'
  },
  {
    title: 'UI / UX Design',
    subtitle: 'User-centered digital experiences',
    tagline: 'Clear, intuitive, and useful.',
    description: 'We turn complex product ideas into intuitive interfaces and journeys that feel easy for customers to understand and use.',
    path: '/services/ui-ux-design',
    capabilities: ['UX Research', 'Interface Design', 'Prototyping'],
    icon: 'FiLayers'
  },
  {
    title: 'Digital Marketing',
    subtitle: 'Campaigns that connect and convert',
    tagline: 'Smart strategy. Real outcomes.',
    description: 'We create focused digital campaigns that strengthen visibility, generate qualified leads, and support sustainable growth.',
    path: '/services/digital-marketing',
    capabilities: ['Paid Campaigns', 'Lead Generation', 'Analytics'],
    icon: 'FiTrendingUp'
  },
  {
    title: 'Social Media Management',
    subtitle: 'Content, community, and brand growth',
    tagline: 'Stay relevant. Build real connection.',
    description: 'We plan content, manage conversations, and grow communities so your brand stays active, consistent, and memorable.',
    path: '/services/social-media',
    capabilities: ['Content Planning', 'Community Management', 'Growth Reporting'],
    icon: 'FiUsers',
    featured: true
  }
];

const fallbackSettings = {
  companyName: 'JAC MediaLand',
  email: 'jaccreationhouse@gmail.com',
  phoneNumber: '+91 73388 91367',
  address: "NGS Complex, Chennimalai Rd, near Erode Art's and Science College, Rangampalayam, Erode, Tamil Nadu 638009",
  socialMediaLinks: {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: ''
  },
  footerContent: '(c) 2026 JAC MediaLand. IT Solutions. All rights reserved.'
};

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function pathToServiceSlug(value = '') {
  const trimmed = cleanString(value);
  if (!trimmed) return '';
  return trimmed.replace(/^\/+services\/+/, '').replace(/^\/+/, '');
}

function mergeMissingStrings(existing, incoming) {
  return cleanString(existing) || cleanString(incoming);
}

async function upsertHighlights() {
  for (const [index, item] of fallbackHighlights.entries()) {
    await Highlight.updateOne(
      { slug: item.slug },
      {
        $setOnInsert: {
          slug: item.slug,
          title: item.title,
          value: item.value,
          status: 'published',
          sortOrder: index + 1
        }
      },
      { upsert: true }
    );
  }
}

async function upsertTrustedCompanies() {
  for (const [index, item] of fallbackTrustedCompanies.entries()) {
    await ClientLogo.updateOne(
      { slug: item.slug },
      {
        $setOnInsert: {
          slug: item.slug,
          title: item.title,
          logoUrl: item.logoUrl,
          website: item.website || '',
          status: 'published',
          sortOrder: index + 1
        }
      },
      { upsert: true }
    );
  }
}

async function upsertTeamMembers() {
  for (const member of fallbackTeamMembers) {
    const existing = await Team.findOne({
      $or: [
        { employeeName: member.title },
        { employeeName: new RegExp(`^${escapeRegex(member.title)}$`, 'i') }
      ]
    });

    if (existing) {
      const nextFields = {};

      if (!cleanString(existing.designation)) nextFields.designation = member.role;
      if (!cleanString(existing.email)) nextFields.email = fallbackSettings.email;
      if (!cleanString(existing.profilePhoto)) nextFields.profilePhoto = member.image;
      if (!cleanString(existing.message) && cleanString(member.message)) nextFields.message = member.message;
      if (member.featured && !existing.featured) nextFields.featured = true;

      if (Object.keys(nextFields).length) {
        await Team.updateOne({ _id: existing._id }, { $set: nextFields });
      }
      continue;
    }

    await Team.create({
      employeeName: member.title,
      designation: member.role,
      email: fallbackSettings.email,
      profilePhoto: member.image,
      featured: member.featured || false,
      message: member.message || ''
    });
  }
}

async function upsertProjects() {
  for (const item of fallbackPortfolioProjects) {
    const existing = await Project.findOne({ title: item.title });
    if (existing) {
      const nextFields = {};

      if (!cleanString(existing.category)) nextFields.category = item.category;
      if (!cleanString(existing.industry)) nextFields.industry = item.industry;
      if (!cleanString(existing.description)) nextFields.description = 'Migrated from local website content.';
      if (!cleanString(existing.projectUrl)) nextFields.projectUrl = item.url;
      if (!cleanString(existing.thumbnailImage)) nextFields.thumbnailImage = item.visual;

      if (Object.keys(nextFields).length) {
        await Project.updateOne({ _id: existing._id }, { $set: nextFields });
      }
      continue;
    }

    await Project.create({
      title: item.title,
      category: item.category,
      industry: item.industry,
      description: 'Migrated from local website content.',
      projectUrl: item.url,
      thumbnailImage: item.visual
    });
  }
}

async function upsertServices() {
  for (const [index, item] of fallbackServices.entries()) {
    const slug = pathToServiceSlug(item.path) || slugify(item.title);
    const existing = await Service.findOne({
      $or: [
        { slug },
        { name: item.title }
      ]
    });

    if (existing) {
      const nextFields = {};

      if (!cleanString(existing.slug)) nextFields.slug = slug;
      if (!cleanString(existing.icon)) nextFields.icon = item.icon;
      if (!cleanString(existing.subtitle)) nextFields.subtitle = item.subtitle;
      if (!cleanString(existing.tagline)) nextFields.tagline = item.tagline;
      if (!cleanString(existing.description)) nextFields.description = item.description;
      if (!Array.isArray(existing.capabilities) || !existing.capabilities.length) nextFields.capabilities = item.capabilities;
      if (typeof existing.featured !== 'boolean') nextFields.featured = !!item.featured;
      if (!cleanString(existing.status)) nextFields.status = 'published';
      if (typeof existing.sortOrder !== 'number') nextFields.sortOrder = index + 1;

      if (Object.keys(nextFields).length) {
        await Service.updateOne({ _id: existing._id }, { $set: nextFields });
      }
      continue;
    }

    await Service.create({
      name: item.title,
      slug,
      icon: item.icon,
      subtitle: item.subtitle,
      tagline: item.tagline,
      description: item.description,
      capabilities: item.capabilities,
      featured: !!item.featured,
      status: 'published',
      sortOrder: index + 1
    });
  }
}

async function upsertPrograms() {
  for (const [index, item] of fallbackPrograms.entries()) {
    await Program.updateOne(
      { slug: item.slug },
      {
        $setOnInsert: {
          slug: item.slug,
          title: item.title,
          kind: item.kind,
          launch: item.launch,
          description: item.description,
          path: item.path || '',
          imageKey: item.imageKey || '',
          status: 'published',
          sortOrder: index + 1
        }
      },
      { upsert: true }
    );
  }
}

async function upsertCareerOpenings() {
  for (const [index, item] of fallbackCareerOpenings.entries()) {
    await CareerOpening.updateOne(
      { slug: item.slug },
      {
        $setOnInsert: {
          ...item,
          status: 'published',
          sortOrder: index + 1
        }
      },
      { upsert: true }
    );
  }
}

async function upsertSettings() {
  const existing = await Settings.findOne();

  if (!existing) {
    await Settings.create(fallbackSettings);
    return;
  }

  const nextFields = {
    companyName: mergeMissingStrings(existing.companyName, fallbackSettings.companyName),
    email: mergeMissingStrings(existing.email, fallbackSettings.email),
    phoneNumber: mergeMissingStrings(existing.phoneNumber, fallbackSettings.phoneNumber),
    address: mergeMissingStrings(existing.address, fallbackSettings.address),
    footerContent: mergeMissingStrings(existing.footerContent, fallbackSettings.footerContent),
    socialMediaLinks: {
      linkedin: mergeMissingStrings(existing.socialMediaLinks?.linkedin, fallbackSettings.socialMediaLinks.linkedin),
      twitter: mergeMissingStrings(existing.socialMediaLinks?.twitter, fallbackSettings.socialMediaLinks.twitter),
      facebook: mergeMissingStrings(existing.socialMediaLinks?.facebook, fallbackSettings.socialMediaLinks.facebook),
      instagram: mergeMissingStrings(existing.socialMediaLinks?.instagram, fallbackSettings.socialMediaLinks.instagram)
    }
  };

  await Settings.updateOne({ _id: existing._id }, { $set: nextFields });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function backfillCmsContent() {
  await mongoose.connect(mongoUri);
  console.log('Database Connected:', mongoose.connection.host);

  await upsertHighlights();
  await upsertTrustedCompanies();
  await upsertTeamMembers();
  await upsertProjects();
  await upsertServices();
  await upsertPrograms();
  await upsertCareerOpenings();
  await upsertSettings();

  console.log('CMS backfill completed successfully.');
}

backfillCmsContent()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('CMS backfill failed:', error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  });
