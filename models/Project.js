import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String },
  category: { type: String },
  industry: { type: String },
  description: { type: String },
  clientName: { type: String },
  projectDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'In Progress', 'Planned'], default: 'Completed' },
  technologiesUsed: [{ type: String }],
  thumbnailImage: { type: String },
  galleryImages: [{ type: String }],
  projectUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
