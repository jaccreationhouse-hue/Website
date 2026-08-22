import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  slug: { type: String, trim: true, unique: true, sparse: true },
  icon: { type: String }, // e.g., 'FaCode', 'FaPaintBrush'
  subtitle: { type: String, default: '', trim: true },
  tagline: { type: String, default: '', trim: true },
  description: { type: String, trim: true },
  capabilities: [{ type: String, trim: true }],
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  sortOrder: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
