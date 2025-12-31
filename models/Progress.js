import mongoose from 'mongoose';

/**
 * Progress schema definition for MongoDB using Mongoose.
 * Tracks a user's progress in a course.
 * @typedef {Object} Progress
 * @property {number} progressId - Unique progress identifier
 * @property {number} userId - ID of the user
 * @property {number} courseId - ID of the course
 * @property {number} progressPercentage - Progress percentage (0-100)
 */
const Schema = mongoose?.Schema || class {};

/**
 * Mongoose schema for Progress.
 */
const ProgressSchema = new Schema({
  progressId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  progressPercentage: { type: Number, default: 0 }
}, { timestamps: true });

/**
 * Mongoose model for Progress.
 */
const Progress = mongoose?.models?.Progress || (mongoose?.model ? mongoose.model('Progress', ProgressSchema) : class {});
export default Progress;
