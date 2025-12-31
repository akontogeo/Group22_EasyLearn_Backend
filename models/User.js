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
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, match: /.+@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  isPremium: { type: Boolean, default: false },
  enrolledCourses: [{ type: Number, min: 1 }]
}, { timestamps: true });

/**
 * Find a user by their email address.
 * @param {string} email
 * @returns {Promise<User|null>}
 */
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

/**
 * Mongoose model for User.
 */
const User = mongoose?.models?.User || (mongoose?.model ? mongoose.model('User', UserSchema) : class {});
export default User;
