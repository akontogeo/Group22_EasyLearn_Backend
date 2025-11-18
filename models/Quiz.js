import mongoose from 'mongoose';

const { Schema, model } = mongoose;

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

export default model('Quiz', QuizSchema);
