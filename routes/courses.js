import express from 'express';
import * as courseCtrl from '../controllers/courseController.js';
import { basicAuth } from '../middleware/auth.js';
import { requireBodyFields } from '../middleware/validation.js';
import ratingsRouter from './ratings.js';

const router = express.Router();

// Course CRUD routes (POST, PUT, DELETE require admin auth)
router.get('/', courseCtrl.listCourses);
router.post('/', basicAuth, requireBodyFields(['title','description','category','difficulty','premium','totalPoints']), courseCtrl.addCourse);
router.get('/:courseId', courseCtrl.getCourse);
router.put('/:courseId', basicAuth, courseCtrl.editCourse);
router.delete('/:courseId', basicAuth, courseCtrl.removeCourse);

// Nested ratings routes
router.use('/:courseId/reviews', ratingsRouter);

export default router;
