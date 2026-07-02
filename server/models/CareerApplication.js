import mongoose from 'mongoose';

const careerApplicationSchema = new mongoose.Schema({
  openingSlug: { type: String, default: '', trim: true, index: true },
  role: { type: String, default: '', trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: '', trim: true },
  experience: { type: String, default: '', trim: true },
  profileUrl: { type: String, default: '', trim: true },
  coverLetter: { type: String, required: true, trim: true },
  source: { type: String, default: 'website', trim: true },
  idempotencyKey: { type: String, default: '', trim: true },
  resumeUrl: { type: String, default: '', trim: true },
  resumeOriginalName: { type: String, default: '', trim: true },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'new'
  }
}, { timestamps: true });

careerApplicationSchema.index(
  { idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $exists: true, $type: 'string', $ne: '' }
    }
  }
);

export default mongoose.model('CareerApplication', careerApplicationSchema);
