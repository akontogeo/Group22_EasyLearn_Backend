import mongoose from 'mongoose';

// User course progress tracking schema
const Schema = mongoose?.Schema || class {};
const ProgressSchema = new Schema({
  progressId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  progressPercentage: { type: Number, default: 0 }
}, { timestamps: true });

const Progress = mongoose?.models?.Progress || (mongoose?.model ? mongoose.model('Progress', ProgressSchema) : class {});
export default Progress;
