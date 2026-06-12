export interface CmsSectionItem {
  id?: string;
  slug: string;
  title: string;
  status?: 'draft' | 'published' | 'archived';
  sortOrder?: number;
}

export interface HighlightItem extends CmsSectionItem {
  value: string;
}

export interface TeamMemberItem extends CmsSectionItem {
  role: string;
  image?: string;
  featured?: boolean;
  message?: string;
}

export interface PortfolioProjectItem extends CmsSectionItem {
  industry: string;
  category: string;
  url: string;
  visual: string;
}

export interface ProgramItem extends CmsSectionItem {
  kind: 'active' | 'upcoming';
  launch: string;
  description: string;
  path?: string;
  imageKey?: string;
}

export interface CareerOpeningItem extends CmsSectionItem {
  department?: string;
  location: string;
  employmentType: string;
  workplaceType?: string;
  salary?: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  closingDate?: string;
  acceptingApplications?: boolean;
  generalApplication?: boolean;
}

export interface ContactItem extends CmsSectionItem {
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  city: string;
  responseTime: string;
  heroTitle: string;
  heroDescription: string;
}

export const fallbackHighlights: HighlightItem[] = [
  { slug: 'hours-of-support', title: 'Hours of Support', value: '35,064+' },
  { slug: 'projects', title: 'Projects', value: '2,300+' },
  { slug: 'happy-clients', title: 'Happy Clients', value: '3,000+' },
  { slug: 'smartmates', title: 'SmartMates', value: '30' }
];

export const fallbackTeamMembers: TeamMemberItem[] = [
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
];

export const fallbackPortfolioProjects: PortfolioProjectItem[] = [
  { slug: 'gym', title: 'Gym', industry: 'Fitness', category: 'development', url: 'https://gym-ten-sandy.vercel.app/', visual: 'portfolio-visual-gym' },
  { slug: 'travel-agency', title: 'Travel Agency', industry: 'Travel', category: 'development', url: 'https://travel-agency-livid-delta.vercel.app/', visual: 'portfolio-visual-travel' },
  { slug: 'real-estate', title: 'Real Estate', industry: 'Property', category: 'development', url: 'https://real-estate-delta-lake.vercel.app/', visual: 'portfolio-visual-estate' },
  { slug: 'chartered-accountants', title: 'Chartered Accountants', industry: 'Professional services', category: 'development', url: 'https://chartered-accountant-website-opal.vercel.app/', visual: 'portfolio-visual-accountants' }
];

export const fallbackPrograms: ProgramItem[] = [
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

export const fallbackCareerOpenings: CareerOpeningItem[] = [
  {
    slug: 'talent-network',
    title: 'Join our Talent Network',
    department: 'Future Opportunities',
    location: 'Erode, Tamil Nadu / Flexible',
    employmentType: 'General Application',
    workplaceType: 'Flexible',
    description: 'Tell us what you do well, what you want to learn next, and why JAC Media Land interests you.',
    responsibilities: ['Share the work you want to do and the problems you enjoy solving.'],
    requirements: ['A thoughtful introduction and examples of relevant work or learning.'],
    benefits: ['Consideration for suitable current and future opportunities.'],
    acceptingApplications: true,
    generalApplication: true
  }
];

export const fallbackContacts: ContactItem[] = [
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
];
