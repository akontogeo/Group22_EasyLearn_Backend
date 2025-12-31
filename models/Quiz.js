import mongoose from 'mongoose';

/**
 * Quiz question schema definition for MongoDB using Mongoose.
 * Represents a single question in a quiz.
 * @typedef {Object} QuizQuestion
 * @property {number} questionId - Unique question identifier
 * @property {string} questionText - The question text
 * @property {Array<string>} options - List of possible answers
 * @property {number} correctOption - Index of the correct option
 */
const Schema = mongoose?.Schema || class {};

const QuizQuestionSchema = new Schema({
  questionId: { type: Number, required: true, min: 1 },
  questionText: { type: String, required: true, trim: true, minlength: 3 },
  options: [{ type: String, trim: true, minlength: 1 }],
  correctOption: { type: Number, min: 0 }
});

/**
 * Quiz schema definition for MongoDB using Mongoose.
 * Represents a quiz for a course, containing multiple questions.
 * @typedef {Object} Quiz
 * @property {number} quizId - Unique quiz identifier
 * @property {number} courseId - ID of the course this quiz belongs to
 * @property {string} title - Quiz title
 * @property {Array<QuizQuestion>} questions - List of quiz questions
 */

const QuizSchema = new Schema({
  quizId: { type: Number, required: true, unique: true, min: 1 },
  courseId: { type: Number, required: true, min: 1 },
  title: { type: String, required: true, trim: true, minlength: 3 },
  questions: { type: [QuizQuestionSchema], validate: v => Array.isArray(v) && v.length > 0 }
}, { timestamps: true });

/**
 * Find a quiz by its unique quizId.
 * @param {number} quizId
 * @returns {Promise<Quiz|null>}
 */
QuizSchema.statics.findByQuizId = function(quizId) {
  return this.findOne({ quizId });
};

/**
 * Mongoose model for Quiz.
 */
const Quiz = mongoose?.models?.Quiz || (mongoose?.model ? mongoose.model('Quiz', QuizSchema) : class {});
export default Quiz;
