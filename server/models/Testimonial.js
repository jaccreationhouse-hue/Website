import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  clientPhoto: { type: String },
  clientName: { type: String },
  companyName: { type: String },
  feedback: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
