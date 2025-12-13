import express from 'express';
import * as quizCtrl from '../controllers/quizController.js';
import { requireBodyFields } from '../middleware/validation.js';

// mergeParams allows access to :courseId from parent route
const router = express.Router({ mergeParams: true });

router.get('/:quizId', quizCtrl.getQuiz);
router.post('/:quizId/submit', requireBodyFields(['userId','answers']), quizCtrl.submitQuiz);

export default router;
