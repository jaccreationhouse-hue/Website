import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String },
  featuredImage: { type: String },
  category: { type: String },
  author: { type: String },
  description: { type: String },
  publishDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
