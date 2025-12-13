import express from 'express';
import * as userCtrl from '../controllers/userController.js';
import { requireBodyFields } from '../middleware/validation.js';

const router = express.Router();

// User CRUD routes
router.get('/', userCtrl.listUsers);
router.post('/', requireBodyFields(['username','email','password']), userCtrl.createUser);
router.get('/:userId', userCtrl.getUser);
router.put('/:userId', userCtrl.updateUser);
router.delete('/:userId', userCtrl.deleteUser);

// Course enrollment routes
router.get('/:userId/courses/:courseId', userCtrl.getUserCourse);
router.get('/:userId/courses', userCtrl.getUserCourses);
router.post('/:userId/courses', requireBodyFields(['courseId']), userCtrl.enrollInCourse);
router.delete('/:userId/courses/:courseId', userCtrl.withdrawFromCourse);

// Get course recommendations for user
router.get('/:userId/recommendations', userCtrl.recommendations);

// User progress tracking
router.get('/:userId/courses/:courseId/progress', userCtrl.getProgress);

export default router;
