import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  slug: { type: String, trim: true, unique: true },
  title: { type: String, trim: true },
  value: { type: String, trim: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Highlight', highlightSchema);
