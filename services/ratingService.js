import { ratings as mockRatings, nextRatingId } from '../utils/mockData.js';
import RatingModel from '../models/Rating.js';
import { isDbConnected } from '../config/database.js';

/**
 * RatingService provides operations for course ratings.
 * Uses MongoDB if connected, otherwise falls back to in-memory mock data.
 */
export const RatingService = {
  /**
   * List all ratings for a specific course.
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Array>} Array of rating objects
   */
  async listByCourse(courseId) {
    if (isDbConnected()) {
      return RatingModel.find({ courseId: Number(courseId) }).lean();
    }
    // Fallback to mock data
    return mockRatings.filter(r => String(r.courseId) === String(courseId));
  },

  /**
   * Create a new rating for a course.
   * @param {string|number} courseId - The course's ID
   * @param {Object} payload - The rating data to create
   * @returns {Promise<Object>} The created rating object
   */
  async create(courseId, payload) {
    if (isDbConnected()) {
      // Find max ratingId to increment
      const max = await RatingModel.findOne().sort({ ratingId: -1 }).lean();
      const id = (max && max.ratingId) ? Number(max.ratingId) + 1 : 1;
      const toCreate = { ratingId: id, courseId: Number(courseId), ...payload };
      const created = await RatingModel.create(toCreate);
      return created.toObject();
    }
    // Use mock data if DB is not connected
    const toCreate = { ...payload, courseId: Number(courseId) };
    const newRating = { ratingId: nextRatingId(), ...toCreate };
    mockRatings.push(newRating);
    return newRating;
  }
};
