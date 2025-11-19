import mongoose from 'mongoose';
import CourseModel from '../models/Course.js';
import UserModel from '../models/User.js';
import RatingModel from '../models/Rating.js';
import QuizModel from '../models/Quiz.js';
import ProgressModel from '../models/Progress.js';
import { courses as mockCourses, users as mockUsers, ratings as mockRatings, quizzes as mockQuizzes, progress as mockProgress } from '../utils/mockData.js';

let connected = false;

/**
 * Attempt to connect to MongoDB when `MONGO_URI` is provided.
 * If no URI is provided, the function logs a message and leaves the process
 * using the in-memory mock data. When connected, the function also seeds
 * the collections with mock data if they are empty.
 */
export async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not provided: running with in-memory mock data only.');
    connected = false;
    return;
  }

  try {
    await mongoose.connect(uri);
    connected = true;
    console.log('Connected to MongoDB');

    // Seed mock data if collections empty
    try {
      const courseCount = await CourseModel.countDocuments();
      if (courseCount === 0 && Array.isArray(mockCourses) && mockCourses.length) {
        await CourseModel.insertMany(mockCourses);
        console.log(`Seeded ${mockCourses.length} courses`);
      }

      const userCount = await UserModel.countDocuments();
      if (userCount === 0 && Array.isArray(mockUsers) && mockUsers.length) {
        await UserModel.insertMany(mockUsers);
        console.log(`Seeded ${mockUsers.length} users`);
      }

      const ratingCount = await RatingModel.countDocuments();
      if (ratingCount === 0 && Array.isArray(mockRatings) && mockRatings.length) {
        await RatingModel.insertMany(mockRatings);
        console.log(`Seeded ${mockRatings.length} ratings`);
      }

      const quizCount = await QuizModel.countDocuments();
      if (quizCount === 0 && Array.isArray(mockQuizzes) && mockQuizzes.length) {
        await QuizModel.insertMany(mockQuizzes);
        console.log(`Seeded ${mockQuizzes.length} quizzes`);
      }

      const progressCount = await ProgressModel.countDocuments();
      if (progressCount === 0 && Array.isArray(mockProgress) && mockProgress.length) {
        await ProgressModel.insertMany(mockProgress);
        console.log(`Seeded ${mockProgress.length} progress entries`);
      }
    } catch (seedErr) {
      console.error('Seeding mock data failed:', seedErr.message || seedErr);
    }

  } catch (err) {
    connected = false;
    console.error('Failed to connect to MongoDB, falling back to mock data.', err.message || err);
  }
}

export function isDbConnected() {
  return connected;
}
