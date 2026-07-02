import express from 'express';
import multer from 'multer';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Gallery from '../models/Gallery.js';
import Team from '../models/Team.js';
import Blog from '../models/Blog.js';
import Testimonial from '../models/Testimonial.js';
import Contact from '../models/Contact.js';
import Settings from '../models/Settings.js';
import Program from '../models/Program.js';
import Activity from '../models/Activity.js';
import CareerOpening from '../models/CareerOpening.js';
import CareerApplication from '../models/CareerApplication.js';
import { createCloudinaryStorage } from '../config/cloudinary.js';

const router = express.Router();
const storage = createCloudinaryStorage({
  folder: 'jac_resumes',
  resource_type: 'raw',
  allowed_formats: ['pdf', 'doc', 'docx']
});

const upload = multer({ storage });

function slugify(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function toCareerOpeningItem(opening) {
  return {
    id: opening._id,
    slug: opening.slug || slugify(opening.title),
    title: opening.title,
    department: opening.department || '',
    location: opening.location,
    employmentType: opening.employmentType,
    workplaceType: opening.workplaceType || '',
    salary: opening.salary || '',
    description: opening.description || '',
    responsibilities: opening.responsibilities || [],
    requirements: opening.requirements || [],
    benefits: opening.benefits || [],
    closingDate: opening.closingDate || '',
    acceptingApplications: opening.acceptingApplications !== false,
    generalApplication: opening.generalApplication || false,
    status: opening.status || 'published',
    sortOrder: opening.sortOrder || 0
  };
}

// Helper to log activities
const logActivity = async (action, description) => {
  try {
    await Activity.create({ action, description });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

// 1. Get Services
router.get('/v1/public/sites/:siteKey/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    // Map to client format if necessary
    const mapped = services.map(s => ({
      id: s._id,
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: s.name,
      description: s.description,
      status: 'published'
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Get Collections (projects, gallery, team, blogs, testimonials)
router.get('/v1/public/sites/:siteKey/collections/:collectionKey', async (req, res) => {
  const { collectionKey } = req.params;
  try {
    let items = [];
    if (collectionKey === 'projects' || collectionKey === 'portfolio' || collectionKey === 'portfolioProjects') {
      const projects = await Project.find().sort({ createdAt: 1 });
      items = projects.map(p => ({
        id: p._id,
        slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: p.title,
        industry: p.industry || '',
        category: p.category || '',
        url: p.projectUrl || '',
        visual: p.thumbnailImage || '',
        status: 'published'
      }));
    } else if (collectionKey === 'gallery') {
      items = await Gallery.find().sort({ createdAt: -1 });
    } else if (collectionKey === 'team' || collectionKey === 'teamMembers') {
      const team = await Team.find().sort({ createdAt: 1 });
      items = team.map(t => ({
        id: t._id,
        slug: t.employeeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: t.employeeName,
        role: t.designation || '',
        image: t.profilePhoto || '',
        featured: t.featured || false,
        message: t.message || '',
        status: 'published'
      }));
    } else if (collectionKey === 'blogs' || collectionKey === 'posts') {
      items = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 });
    } else if (collectionKey === 'programs') {
      const programs = await Program.find().sort({ createdAt: 1 });
      items = programs.map(p => ({
        id: p._id,
        slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: p.title,
        kind: p.kind || 'upcoming',
        launch: p.launch || '',
        description: p.description || '',
        path: p.path || '',
        imageKey: p.imageKey || '',
        status: p.status || 'published'
      }));
    } else if (collectionKey === 'careerOpenings') {
      const openings = await CareerOpening.find({ status: 'published' }).sort({ sortOrder: 1, createdAt: -1 });
      items = openings.map(toCareerOpeningItem);
    } else if (collectionKey === 'testimonials') {
      items = await Testimonial.find().sort({ createdAt: -1 });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Get Settings
router.get('/v1/public/sites/:siteKey/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne() || {};
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Contact Lead Submission
router.post('/v1/public/sites/:siteKey/forms/contact/submissions', async (req, res) => {
  const { contact, fields } = req.body;
  try {
    const newContact = await Contact.create({
      name: contact?.name || 'Anonymous',
      email: contact?.email || 'no-email@example.com',
      mobileNumber: contact?.phone || '',
      subject: fields?.subject || 'Website Contact Form Submission',
      message: fields?.message || JSON.stringify(fields || {})
    });

    await logActivity('New Enquiry', `Received message from "${newContact.name}" via public contact form.`);

    res.status(201).json({
      id: newContact._id,
      status: 'new',
      createdAt: newContact.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Job / Career Application Submission
router.post('/v1/public/sites/:siteKey/careers/applications', upload.single('resume'), async (req, res) => {
  const {
    openingSlug = '',
    idempotencyKey = '',
    source = 'website',
    name,
    email,
    phone = '',
    experience = '',
    profileUrl = '',
    coverLetter = '',
    role = ''
  } = req.body;
  try {
    if (!name || !email || !coverLetter) {
      return res.status(400).json({ message: 'Name, email, and cover letter are required.' });
    }
    if (!req.file?.path) {
      return res.status(400).json({ message: 'Resume upload is required.' });
    }
    if (req.body.website) {
      return res.status(400).json({ message: 'Spam submission blocked.' });
    }

    let resolvedRole = role || 'Open Position';
    if (openingSlug) {
      const opening = await CareerOpening.findOne({ slug: openingSlug });
      if (opening) {
        resolvedRole = opening.title;
      }
    }

    const existingApplication = idempotencyKey
      ? await CareerApplication.findOne({ idempotencyKey })
      : null;
    if (existingApplication) {
      return res.status(200).json({
        id: existingApplication._id,
        status: existingApplication.status,
        createdAt: existingApplication.createdAt
      });
    }

    const application = await CareerApplication.create({
      openingSlug,
      role: resolvedRole,
      name,
      email,
      phone,
      experience,
      profileUrl,
      coverLetter,
      source,
      idempotencyKey,
      resumeUrl: req.file.path,
      resumeOriginalName: req.file.originalname
    });

    await logActivity('Career Application', `New application received from "${application.name}" for "${application.role}".`);

    res.status(201).json({
      id: application._id,
      status: application.status,
      createdAt: application.createdAt
    });
  } catch (error) {
    if (error?.code === 11000 && req.body.idempotencyKey) {
      const application = await CareerApplication.findOne({ idempotencyKey: req.body.idempotencyKey });
      if (application) {
        return res.status(200).json({
          id: application._id,
          status: application.status,
          createdAt: application.createdAt
        });
      }
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
