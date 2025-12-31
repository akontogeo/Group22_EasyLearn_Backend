import mongoose from 'mongoose';

/**
 * User schema definition for MongoDB using Mongoose.
 * Represents a user in the system.
 * @typedef {Object} User
 * @property {string} username - Unique username
 * @property {string} email - Unique email address
 * @property {string} password - Hashed password
 * @property {boolean} [isPremium] - Whether the user is premium
 * @property {Array<number>} [enrolledCourses] - List of enrolled course IDs
 */
const Schema = mongoose?.Schema || class {};
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  enrolledCourses: [{ type: Number }]
}, { timestamps: true });

/**
 * Mongoose model for User.
 */
const User = mongoose?.models?.User || (mongoose?.model ? mongoose.model('User', UserSchema) : class {});
export default User;
