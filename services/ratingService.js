import { ratings as mockRatings, nextRatingId } from '../utils/mockData.js';

export const RatingService = {
  async listByCourse(courseId) {
    return mockRatings.filter(r => String(r.courseId) === String(courseId));
  },

  async create(courseId, payload) {
    const toCreate = { ...payload, courseId: Number(courseId) };
    const newRating = { ratingId: nextRatingId(), ...toCreate };
    mockRatings.push(newRating);
    return newRating;
  }
};
