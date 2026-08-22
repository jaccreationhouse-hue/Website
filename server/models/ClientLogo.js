import mongoose from 'mongoose';

const clientLogoSchema = new mongoose.Schema({
  slug: { type: String, trim: true, unique: true },
  title: { type: String, trim: true },
  logoUrl: { type: String, trim: true },
  website: { type: String, default: '', trim: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ClientLogo', clientLogoSchema);
