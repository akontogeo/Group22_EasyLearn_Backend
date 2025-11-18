import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProgressSchema = new Schema({
  progressId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  progressPercentage: { type: Number, default: 0 }
}, { timestamps: true });

export default model('Progress', ProgressSchema);
