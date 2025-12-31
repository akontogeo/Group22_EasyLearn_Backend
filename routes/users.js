import express from 'express';
import * as userCtrl from '../controllers/userController.js';
import { requireBodyFields } from '../middleware/validation.js';

const router = express.Router();

/**
 * User CRUD routes
 * @route GET /users
 * @route POST /users
 * @route GET /users/:userId
 * @route PUT /users/:userId
 * @route DELETE /users/:userId
 */
router.get('/', userCtrl.listUsers);
router.post('/', requireBodyFields(['username','email','password']), userCtrl.createUser);
router.get('/:userId', userCtrl.getUser);
router.put('/:userId', userCtrl.updateUser);
router.delete('/:userId', userCtrl.deleteUser);

/**
 * Course enrollment routes for users
 * @route GET /users/:userId/courses/:courseId
 * @route GET /users/:userId/courses
 * @route POST /users/:userId/courses
 * @route DELETE /users/:userId/courses/:courseId
 */
router.get('/:userId/courses/:courseId', userCtrl.getUserCourse);
router.get('/:userId/courses', userCtrl.getUserCourses);
router.post('/:userId/courses', requireBodyFields(['courseId']), userCtrl.enrollInCourse);
router.delete('/:userId/courses/:courseId', userCtrl.withdrawFromCourse);

/**
 * Get course recommendations for a user
 * @route GET /users/:userId/recommendations
 */
router.get('/:userId/recommendations', userCtrl.recommendations);

/**
 * User progress tracking for a course
 * @route GET /users/:userId/courses/:courseId/progress
 */
router.get('/:userId/courses/:courseId/progress', userCtrl.getProgress);

export default router;
