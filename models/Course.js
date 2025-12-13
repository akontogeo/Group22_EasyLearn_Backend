import mongoose from 'mongoose';

// Course schema definition
const Schema = mongoose?.Schema || class {};
const CourseSchema = new Schema({
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

const Course = mongoose?.models?.Course || (mongoose?.model ? mongoose.model('Course', CourseSchema) : class {});
export default Course;
