import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  profilePhoto: { type: String },
  employeeName: { type: String },
  designation: { type: String },
  email: { type: String },
  mobileNumber: { type: String },
  joiningDate: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  message: { type: String },
  socialMediaLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    facebook: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
