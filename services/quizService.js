import { quizzes as mockQuizzes } from '../utils/mockData.js';

export const QuizService = {
  async getQuiz(courseId, quizId) {
    return mockQuizzes.find(q => String(q.quizId) === String(quizId) && String(q.courseId) === String(courseId));
  },

  async submitAnswers(courseId, quizId, submission) {
    // grading simple: compare submitted indexes with correctOption
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
