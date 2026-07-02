import mongoose from 'mongoose';

const careerOpeningSchema = new mongoose.Schema({
  slug: { type: String, required: true, trim: true, unique: true },
  title: { type: String, required: true, trim: true },
  department: { type: String, default: '', trim: true },
  location: { type: String, required: true, trim: true },
  employmentType: { type: String, required: true, trim: true },
  workplaceType: { type: String, default: '', trim: true },
  salary: { type: String, default: '', trim: true },
  description: { type: String, required: true, trim: true },
  responsibilities: [{ type: String, trim: true }],
  requirements: [{ type: String, trim: true }],
  benefits: [{ type: String, trim: true }],
  closingDate: { type: String, default: '' },
  acceptingApplications: { type: Boolean, default: true },
  generalApplication: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('CareerOpening', careerOpeningSchema);
