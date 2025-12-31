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
  courseId: { type: Number, required: true, unique: true, min: 1 },
  title: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, trim: true, maxlength: 1000 },
  category: { type: String, trim: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  premium: { type: Boolean, default: false },
  courseImage: { type: String, trim: true },
  materialList: [{ type: String, trim: true }],
  quizList: [{ type: Number, min: 1 }],
  totalPoints: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

/**
 * Find a course by its unique courseId.
 * @param {number} courseId
 * @returns {Promise<Course|null>}
 */
CourseSchema.statics.findByCourseId = function(courseId) {
  return this.findOne({ courseId });
};

/**
 * List all premium courses.
 * @returns {Promise<Course[]>}
 */
CourseSchema.statics.listPremium = function() {
  return this.find({ premium: true });
};

/**
 * Mongoose model for Course.
 */
const Course = mongoose?.models?.Course || (mongoose?.model ? mongoose.model('Course', CourseSchema) : class {});
export default Course;
