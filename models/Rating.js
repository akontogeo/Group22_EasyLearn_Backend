import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const RatingSchema = new Schema({
  ratingId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

export default model('Rating', RatingSchema);
