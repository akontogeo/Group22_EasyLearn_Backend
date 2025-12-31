import mongoose from 'mongoose';

/**
 * Rating schema definition for MongoDB using Mongoose.
 * Represents a user's rating and review for a course.
 * @typedef {Object} Rating
 * @property {number} ratingId - Unique rating identifier
 * @property {number} userId - ID of the user who rated
 * @property {number} courseId - ID of the course being rated
 * @property {number} stars - Number of stars (1-5)
 * @property {string} [comment] - Optional review comment
 */
const Schema = mongoose?.Schema || class {};

const RatingSchema = new Schema({
  ratingId: { type: Number, required: true, unique: true, min: 1 },
  userId: { type: Number, required: true, min: 1 },
  courseId: { type: Number, required: true, min: 1 },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000 }
}, { timestamps: true });

/**
 * Find all ratings for a course.
 * @param {number} courseId
 * @returns {Promise<Rating[]>}
 */
RatingSchema.statics.findByCourseId = function(courseId) {
  return this.find({ courseId });
};

/**
 * Mongoose model for Rating.
 */
const Rating = mongoose?.models?.Rating || (mongoose?.model ? mongoose.model('Rating', RatingSchema) : class {});
export default Rating;
