import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  courseId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  difficulty: { type: String },
  premium: { type: Boolean, default: false },
  courseImage: { type: String },
  materialList: [{ type: String }],
  quizList: [{ type: Number }],
  totalPoints: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
