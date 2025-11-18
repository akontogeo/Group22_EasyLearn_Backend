import { RatingService } from '../services/ratingService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * Get ratings for a course
 */
export async function getRatings(req, res, next) {
  try {
    const { courseId } = req.params;
    const list = await RatingService.listByCourse(courseId);
    res.json(successResponse(list, 'Ratings retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Submit a rating for a course
 */
export async function submitRating(req, res, next) {
  try {
    const { courseId } = req.params;
    const payload = req.body;
    if (!payload.userId || !payload.stars) return res.status(400).json(errorResponse('Missing fields', 'userId and stars are required'));
    if (payload.stars < 1 || payload.stars > 5) return res.status(400).json(errorResponse('Invalid stars', 'stars must be between 1 and 5'));
    const created = await RatingService.create(courseId, payload);
    res.status(201).json(successResponse(created, 'Rating created'));
  } catch (err) {
    next(err);
  }
}
