import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  progressId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  progressPercentage: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
