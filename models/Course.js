import mongoose from 'mongoose';

/**
 * Course schema definition for MongoDB using Mongoose.
 * Represents a course with metadata, materials, and quizzes.
 * @typedef {Object} Course
 * @property {number} courseId - Unique course identifier
 * @property {string} title - Course title
 * @property {string} [description] - Course description
 * @property {string} [category] - Course category
 * @property {string} [difficulty] - Course difficulty level
 * @property {boolean} [premium] - Whether the course is premium
 * @property {string} [courseImage] - URL to course image
 * @property {Array<string>} [materialList] - List of material URLs/IDs
 * @property {Array<number>} [quizList] - List of quiz IDs
 * @property {number} [totalPoints] - Total points for the course
 */
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

/**
 * Mongoose model for Course.
 */
const Course = mongoose?.models?.Course || (mongoose?.model ? mongoose.model('Course', CourseSchema) : class {});
export default Course;
