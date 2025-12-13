import { quizzes as mockQuizzes } from '../utils/mockData.js';

// Quiz service layer - uses in-memory mock data
export const QuizService = {
  async getQuiz(courseId, quizId) {
    return mockQuizzes.find(q => String(q.quizId) === String(quizId) && String(q.courseId) === String(courseId));
  },

  // Grade quiz by comparing submitted answers with correct options
  async submitAnswers(courseId, quizId, submission) {
    const quiz = await this.getQuiz(courseId, quizId);
    if (!quiz) return null;
    const answers = submission.answers || [];
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && answers[idx] === q.correctOption) score += 1;
    });
    return { score, total: quiz.questions.length };
  }
};
