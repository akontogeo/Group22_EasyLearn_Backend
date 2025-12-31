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
  progressId: { type: Number, required: true, unique: true, min: 1 },
  userId: { type: Number, required: true, min: 1 },
  courseId: { type: Number, required: true, min: 1 },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

/**
 * Find a user's progress for a specific course.
 * @param {number} userId
 * @param {number} courseId
 * @returns {Promise<Progress|null>}
 */
ProgressSchema.statics.findByUserAndCourse = function(userId, courseId) {
  return this.findOne({ userId, courseId });
};

/**
 * Mongoose model for Progress.
 */
const Progress = mongoose?.models?.Progress || (mongoose?.model ? mongoose.model('Progress', ProgressSchema) : class {});
export default Progress;
