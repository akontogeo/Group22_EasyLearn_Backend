import mongoose from 'mongoose';

const QuizQuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctOption: { type: Number }
});

const QuizSchema = new mongoose.Schema({
  quizId: { type: Number, required: true, unique: true },
  courseId: { type: Number, required: true },
  title: { type: String, required: true },
  questions: [QuizQuestionSchema]
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
