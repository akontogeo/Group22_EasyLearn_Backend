import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  ratingId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
