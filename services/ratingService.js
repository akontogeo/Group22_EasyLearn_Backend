import { ratings as mockRatings, nextRatingId } from '../utils/mockData.js';
import RatingModel from '../models/Rating.js';
import { isDbConnected } from '../config/database.js';

// Rating service layer - uses MongoDB if connected, otherwise in-memory mock data
export const RatingService = {
  async listByCourse(courseId) {
    if (isDbConnected()) {
      return RatingModel.find({ courseId: Number(courseId) }).lean();
    }
    return mockRatings.filter(r => String(r.courseId) === String(courseId));
  },

  async create(courseId, payload) {
    if (isDbConnected()) {
      const max = await RatingModel.findOne().sort({ ratingId: -1 }).lean();
      const id = (max && max.ratingId) ? Number(max.ratingId) + 1 : 1;
      const toCreate = { ratingId: id, courseId: Number(courseId), ...payload };
      const created = await RatingModel.create(toCreate);
      return created.toObject();
    }

    const toCreate = { ...payload, courseId: Number(courseId) };
    const newRating = { ratingId: nextRatingId(), ...toCreate };
    mockRatings.push(newRating);
    return newRating;
  }
};
