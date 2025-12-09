import mongoose from 'mongoose';

const Schema = mongoose?.Schema || class {};
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  enrolledCourses: [{ type: Number }]
}, { timestamps: true });

const User = mongoose?.models?.User || (mongoose?.model ? mongoose.model('User', UserSchema) : class {});
export default User;
