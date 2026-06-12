export interface CollectionField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email' | 'checkbox' | 'select' | 'list' | 'date';
  help?: string;
  options?: readonly string[];
  placeholder?: string;
}

export const websiteCollections = [
  {
    key: 'highlights',
    label: 'Our Highlights',
    description: 'Headline statistics shown across the website.',
    fields: [
      { key: 'value', label: 'Display value', type: 'text', placeholder: '35,064+', help: 'Include symbols such as + or % exactly as visitors should see them.' }
    ]
  },
  {
    key: 'teamMembers',
    label: 'People Behind Our Success',
    description: 'Founder spotlight and team member profiles.',
    fields: [
      { key: 'role', label: 'Role', type: 'text', placeholder: 'UI / UX Designer' },
      { key: 'image', label: 'Image filename or URL', type: 'text', placeholder: 'member.webp' },
      { key: 'featured', label: 'Founder spotlight', type: 'checkbox', help: 'Show this person in the featured founder panel.' },
      { key: 'message', label: 'Profile message', type: 'textarea', placeholder: 'A short leadership or profile message.' }
    ]
  },
  {
    key: 'portfolioProjects',
    label: 'Portfolio',
    description: 'Published projects, links, categories, and visuals.',
    fields: [
      { key: 'industry', label: 'Industry', type: 'text', placeholder: 'Fitness' },
      { key: 'category', label: 'Category', type: 'select', options: ['development', 'ux', 'brand', 'logo', 'packaging'] },
      { key: 'url', label: 'Live project URL', type: 'url', placeholder: 'https://example.com' },
      { key: 'visual', label: 'Visual style class', type: 'text', placeholder: 'portfolio-visual-gym' }
    ]
  },
  {
    key: 'programs',
    label: 'Our Programs',
    description: 'Active and upcoming learning programs.',
    fields: [
      { key: 'kind', label: 'Program state', type: 'select', options: ['active', 'upcoming'] },
      { key: 'launch', label: 'Launch label', type: 'text', placeholder: 'Open Now' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'path', label: 'Website path', type: 'text', placeholder: '/programs/internship' },
      { key: 'imageKey', label: 'Image key', type: 'text', placeholder: 'internship' }
    ]
  },
  {
    key: 'careerOpenings',
    label: 'Careers',
    description: 'Open positions and talent-network opportunities.',
    fields: [
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Erode, Tamil Nadu / Flexible' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'Engineering' },
      { key: 'employmentType', label: 'Employment type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'General Application'] },
      { key: 'workplaceType', label: 'Workplace type', type: 'select', options: ['On-site', 'Hybrid', 'Remote', 'Flexible'] },
      { key: 'salary', label: 'Salary or compensation', type: 'text', placeholder: 'Competitive / Based on experience' },
      { key: 'description', label: 'Role summary', type: 'textarea' },
      { key: 'responsibilities', label: 'Responsibilities', type: 'list', help: 'Enter one responsibility per line.' },
      { key: 'requirements', label: 'Requirements', type: 'list', help: 'Enter one requirement per line.' },
      { key: 'benefits', label: 'Benefits', type: 'list', help: 'Enter one benefit per line.' },
      { key: 'closingDate', label: 'Closing date', type: 'date', help: 'Leave empty when there is no fixed closing date.' },
      { key: 'acceptingApplications', label: 'Accepting applications', type: 'checkbox' },
      { key: 'generalApplication', label: 'General talent-network opening', type: 'checkbox', help: 'Applications are not tied to a specific role.' }
    ]
  },
  {
    key: 'contacts',
    label: 'Contacts',
    description: 'Contact-page copy, phone, email, and address.',
    fields: [
      { key: 'phone', label: 'Phone number', type: 'text', placeholder: '+91 73388 91367' },
      { key: 'phoneHref', label: 'Phone link', type: 'text', placeholder: 'tel:+917338891367' },
      { key: 'email', label: 'Email address', type: 'email' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'responseTime', label: 'Response-time message', type: 'text' },
      { key: 'heroTitle', label: 'Contact hero title', type: 'textarea' },
      { key: 'heroDescription', label: 'Contact hero description', type: 'textarea' }
    ]
  }
] as const;

export type WebsiteCollectionKey = typeof websiteCollections[number]['key'];

export function websiteCollection(key: string) {
  return websiteCollections.find((collection) => collection.key === key);
}
