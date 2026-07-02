import mongoose from 'mongoose';

const clientLogoSchema = new mongoose.Schema({
  slug: { type: String, required: true, trim: true, unique: true },
  title: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true, trim: true },
  website: { type: String, default: '', trim: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ClientLogo', clientLogoSchema);
