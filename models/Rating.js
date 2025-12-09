import mongoose from 'mongoose';

const Schema = mongoose?.Schema || class {};
const RatingSchema = new Schema({
  ratingId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

const Rating = mongoose?.models?.Rating || (mongoose?.model ? mongoose.model('Rating', RatingSchema) : class {});
export default Rating;
