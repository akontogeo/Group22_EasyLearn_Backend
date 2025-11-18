import express from 'express';
import userRoutes from './users.js';
import courseRoutes from './courses.js';
import quizRoutes from './quizzes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
// quizzes nested under courses
router.use('/courses/:courseId/quizzes', quizRoutes);

export default router;
