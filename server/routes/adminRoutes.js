import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import {
  getDashboardStats,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  getServices,
  createService,
  updateService,
  deleteService,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getContacts,
  deleteContact,
  exportContactsCSV,
  getSettings,
  updateSettings,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getCareerOpenings,
  createCareerOpening,
  updateCareerOpening,
  deleteCareerOpening,
  getCareerApplications,
  updateCareerApplication,
  deleteCareerApplication
} from '../controllers/adminController.js';

const router = express.Router();
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024
  }
});

// Stats Route
router.get('/stats', protect, getDashboardStats);

// File Upload Route
router.post('/upload', protect, upload.single('image'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'jac_uploads',
      resource_type: 'image'
    });

    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
});

// Projects
router.route('/projects')
  .get(getProjects)
  .post(protect, createProject);
router.route('/projects/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Gallery
router.route('/gallery')
  .get(getGallery)
  .post(protect, createGallery);
router.route('/gallery/:id')
  .put(protect, updateGallery)
  .delete(protect, deleteGallery);

// Services
router.route('/services')
  .get(getServices)
  .post(protect, createService);
router.route('/services/:id')
  .put(protect, updateService)
  .delete(protect, deleteService);

// Team
router.route('/team')
  .get(getTeam)
  .post(protect, createTeam);
router.route('/team/:id')
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

// Blogs
router.route('/blogs')
  .get(getBlogs)
  .post(protect, createBlog);
router.route('/blogs/:id')
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

// Testimonials
router.route('/testimonials')
  .get(getTestimonials)
  .post(protect, createTestimonial);
router.route('/testimonials/:id')
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial);

// Contact Enquiries
router.route('/contacts')
  .get(protect, getContacts);
router.route('/contacts/:id')
  .delete(protect, deleteContact);
router.get('/contacts-export', protect, exportContactsCSV);

// Settings
router.route('/settings')
  .get(getSettings)
  .put(protect, updateSettings);

// Programs
router.route('/programs')
  .get(getPrograms)
  .post(protect, createProgram);
router.route('/programs/:id')
  .put(protect, updateProgram)
  .delete(protect, deleteProgram);

// Career Openings
router.route('/career-openings')
  .get(getCareerOpenings)
  .post(protect, createCareerOpening);
router.route('/career-openings/:id')
  .put(protect, updateCareerOpening)
  .delete(protect, deleteCareerOpening);

// Career Applications
router.route('/career-applications')
  .get(protect, getCareerApplications);
router.route('/career-applications/:id')
  .put(protect, updateCareerApplication)
  .delete(protect, deleteCareerApplication);

export default router;
