import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  photoUrl: { type: String },
  title: { type: String },
  description: { type: String },
  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
