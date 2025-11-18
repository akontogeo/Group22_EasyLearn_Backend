import { UserService } from '../services/userService.js';
import { CourseService } from '../services/courseService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * List users
 */
export async function listUsers(req, res, next) {
  try {
    const data = await UserService.list();
    res.json(successResponse(data, 'Users retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get a single user by id
 */
export async function getUser(req, res, next) {
  try {
    const user = await UserService.getById(req.params.userId);
    if (!user) return res.status(404).json(errorResponse('Not found', 'User not found'));
    res.json(successResponse(user, 'User retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Create a user
 */
export async function createUser(req, res, next) {
  try {
    const payload = req.body;
    const created = await UserService.create(payload);
    res.status(201).json(successResponse(created, 'User created'));
  } catch (err) {
    next(err);
  }
}

/**
 * Update a user
 */
export async function updateUser(req, res, next) {
  try {
    const updated = await UserService.update(req.params.userId, req.body);
    if (!updated) return res.status(404).json(errorResponse('Not found', 'User not found'));
    res.json(successResponse(updated, 'User updated'));
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a user
 */
export async function deleteUser(req, res, next) {
  try {
    const removed = await UserService.remove(req.params.userId);
    if (!removed) return res.status(404).json(errorResponse('Not found', 'User not found'));
    res.json(successResponse(removed, 'User deleted'));
  } catch (err) {
    next(err);
  }
}

/**
 * Enroll user in course
 */
export async function enrollInCourse(req, res, next) {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

  const user = await UserService.getById(userId);
  const course = await CourseService.getById(courseId);

    if (!user || !course) return res.status(404).json(errorResponse('Not found', 'User or course not found'));
    if (course.premium && !user.isPremium) return res.status(400).json(errorResponse('Not allowed', 'Course is premium. Upgrade to enroll'));

    // modify enrollment
    const enrolled = (user.enrolledCourses || []).includes(Number(courseId));
    if (!enrolled) {
      const updated = await UserService.update(userId, { enrolledCourses: [...(user.enrolledCourses || []), Number(courseId)] });
      return res.json(successResponse(updated, 'Enrolled successfully'));
    }
    res.status(200).json(successResponse(user, 'Already enrolled'));
  } catch (err) {
    next(err);
  }
}

/**
 * Withdraw user from course
 */
export async function withdrawFromCourse(req, res, next) {
  try {
    const { userId, courseId } = req.params;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json(errorResponse('Not found', 'User not found'));
    const enrolled = (user.enrolledCourses || []).filter(c => String(c) !== String(courseId));
  const updated = await UserService.update(userId, { enrolledCourses: enrolled });
  // 204 No Content should not include a body
  res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/**
 * Simple recommendations: return other courses not enrolled
 */
export async function recommendations(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json(errorResponse('Not found', 'User not found'));
    const all = await CourseService.list();
    const recs = all.filter(c => !(user.enrolledCourses || []).includes(Number(c.courseId)));
    res.json(successResponse(recs, 'Recommendations'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get courses the user is enrolled in (detailed)
 */
export async function getUserCourses(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await UserService.getById(userId);
    if (!user) return res.status(404).json(errorResponse('Not found', 'User not found'));
    const allCourses = await CourseService.list();
    const enrolled = (user.enrolledCourses || []).map(id => allCourses.find(c => String(c.courseId) === String(id))).filter(Boolean);
    res.json(successResponse(enrolled, 'User courses retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Get progress for a user in a course
 */
export async function getProgress(req, res, next) {
  try {
    const { userId, courseId } = req.params;
    const { ProgressService } = await import('../services/progressService.js');
    const p = await ProgressService.getProgress(userId, courseId);
    if (!p) return res.status(404).json(errorResponse('Not found', 'Progress not found'));
    res.json(successResponse(p, 'Progress retrieved'));
  } catch (err) {
    next(err);
  }
}
