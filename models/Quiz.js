import mongoose from 'mongoose';

// Quiz and question schema definitions
const Schema = mongoose?.Schema || class {};
const QuizQuestionSchema = new Schema({
  questionId: { type: Number, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctOption: { type: Number }
});

const QuizSchema = new Schema({
  quizId: { type: Number, required: true, unique: true },
  courseId: { type: Number, required: true },
  title: { type: String, required: true },
  questions: [QuizQuestionSchema]
}, { timestamps: true });

const Quiz = mongoose?.models?.Quiz || (mongoose?.model ? mongoose.model('Quiz', QuizSchema) : class {});
export default Quiz;
