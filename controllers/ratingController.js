import { RatingService } from '../services/ratingService.js';
import { CourseService } from '../services/courseService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * Get ratings for a course
 */
export async function getRatings(req, res, next) {
  try {
    const { courseId } = req.params;
    // ensure the course exists
    const course = await CourseService.getById(courseId);
    if (!course) return res.status(404).json(errorResponse('Not found', 'Course not found'));

    const list = await RatingService.listByCourse(courseId);
    if (!list || list.length === 0) return res.json(successResponse([], `No ratings found for course ${courseId}`));
    res.json(successResponse(list, `Ratings for course ${courseId} retrieved`));
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
