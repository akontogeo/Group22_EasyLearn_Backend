import mongoose from 'mongoose';
import CourseModel from '../models/Course.js';
import UserModel from '../models/User.js';
import RatingModel from '../models/Rating.js';
import QuizModel from '../models/Quiz.js';
import ProgressModel from '../models/Progress.js';
import { 
  courses as mockCourses, 
  users as mockUsers, 
  ratings as mockRatings, 
  quizzes as mockQuizzes, 
  progress as mockProgress 
} from '../utils/mockData.js';

let connected = false;

/**
 * Seeds a collection with mock data if it's empty
 * @param {mongoose.Model} Model - The Mongoose model to seed
 * @param {Array} mockData - Array of mock data to insert
 * @param {string} collectionName - Name of the collection for logging
 * @returns {Promise<void>}
 */
async function seedCollection(Model, mockData, collectionName) {
  try {
    const count = await Model.countDocuments();
    
    if (count === 0 && Array.isArray(mockData) && mockData.length > 0) {
      await Model.insertMany(mockData);
      console.log(`✅ Seeded ${mockData.length} ${collectionName}`);
    }
  } catch (error) {
    console.error(`❌ Failed to seed ${collectionName}:`, error.message);
  }
}

/**
 * Seeds all collections with initial mock data if they are empty
 * @returns {Promise<void>}
 */
async function seedDatabase() {
  console.log('🌱 Checking database for initial data...');
  
  await seedCollection(CourseModel, mockCourses, 'courses');
  await seedCollection(UserModel, mockUsers, 'users');
  await seedCollection(RatingModel, mockRatings, 'ratings');
  await seedCollection(QuizModel, mockQuizzes, 'quizzes');
  await seedCollection(ProgressModel, mockProgress, 'progress entries');
  
  console.log('🌱 Database seeding completed');
}

/**
 * Establishes connection to MongoDB database
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise<boolean>} - Returns true if connection successful, false otherwise
 */
async function establishConnection(uri) {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    return false;
  }
}

/**
 * Connect to MongoDB and seed with mock data if collections are empty.
 * Falls back to in-memory mock data if MONGO_URI is not provided.
 * @returns {Promise<void>}
 */
export async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  
  // Check if MongoDB URI is provided
  if (!uri) {
    console.warn('⚠️  MONGO_URI not provided: running with in-memory mock data only.');
    connected = false;
    return;
  }
  
  // Attempt to connect to MongoDB
  connected = await establishConnection(uri);
  
  // Seed database if connection was successful
  if (connected) {
    await seedDatabase();
  } else {
    console.warn('⚠️  Falling back to in-memory mock data.');
  }
}

/**
 * Check if database connection is active
 * @returns {boolean} - True if connected to MongoDB, false otherwise
 */
export function isDbConnected() {
  return connected;
}