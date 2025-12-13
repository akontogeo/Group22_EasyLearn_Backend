import { QuizService } from '../services/quizService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

// Get quiz details (without correct answers)
export async function getQuiz(req, res, next) {
  try {
    const { courseId, quizId } = req.params;
    const quiz = await QuizService.getQuiz(courseId, quizId);
    if (!quiz) return res.status(404).json(errorResponse('Not found', 'Quiz not found'));
    // Hide correct answers from response
    const q = { ...quiz, questions: (quiz.questions || []).map(({ questionId, questionText, options }) => ({ questionId, questionText, options })) };
    res.json(successResponse(q, 'Quiz retrieved'));
  } catch (err) {
    next(err);
  }
}

/**
 * Submit quiz answers
 */
export async function submitQuiz(req, res, next) {
  try {
    const { courseId, quizId } = req.params;
    const submission = req.body;
    const result = await QuizService.submitAnswers(courseId, quizId, submission);
    if (!result) return res.status(404).json(errorResponse('Not found', 'Quiz not found'));
    res.json(successResponse(result, 'Quiz graded'));
  } catch (err) {
    next(err);
  }
}
