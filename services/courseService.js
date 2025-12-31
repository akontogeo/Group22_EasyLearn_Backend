import { courses as mockCourses, nextCourseId } from '../utils/mockData.js';
import CourseModel from '../models/Course.js';
import { isDbConnected } from '../config/database.js';

/**
 * CourseService provides CRUD operations for courses.
 * Uses MongoDB if connected, otherwise falls back to in-memory mock data.
 */
export const CourseService = {
  /**
   * List all courses, optionally filtered by category, difficulty, or premium.
   * @param {Object} filters - Optional filters: category, difficulty, premium
   * @returns {Promise<Array>} Array of course objects
   */
  async list(filters = {}) {
    // If DB is connected, fetch from MongoDB with filters
    if (isDbConnected()) {
      const mongoFilter = {};
      if (filters.category) mongoFilter.category = filters.category;
      if (filters.difficulty) mongoFilter.difficulty = filters.difficulty;
      if (typeof filters.premium !== 'undefined') mongoFilter.premium = filters.premium;
      return CourseModel.find(mongoFilter).lean();
    }
    // Otherwise, filter mock data
    let res = mockCourses.slice();
    if (filters.category) res = res.filter(c => c.category === filters.category);
    if (filters.difficulty) res = res.filter(c => c.difficulty === filters.difficulty);
    if (typeof filters.premium !== 'undefined') res = res.filter(c => c.premium === filters.premium);
    return Promise.resolve(res);
  },

  /**
   * Get a course by its courseId.
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Object|null>} The course object or null if not found
   */
  async getById(courseId) {
    if (isDbConnected()) {
      return CourseModel.findOne({ courseId: Number(courseId) }).lean();
    }
    return mockCourses.find(c => String(c.courseId) === String(courseId));
  },

  /**
   * Create a new course.
   * @param {Object} payload - The course data to create
   * @returns {Promise<Object>} The created course object
   */
  async create(payload) {
    if (isDbConnected()) {
      // Find max courseId to increment
      const max = await CourseModel.findOne().sort({ courseId: -1 }).lean();
      const id = (max && max.courseId) ? Number(max.courseId) + 1 : 1;
      const toCreate = { courseId: id, ...payload };
      const created = await CourseModel.create(toCreate);
      return created.toObject();
    }
    // Use mock data if DB is not connected
    const newCourse = { courseId: nextCourseId(), ...payload };
    mockCourses.push(newCourse);
    return newCourse;
  },

  /**
   * Update an existing course by courseId.
   * @param {string|number} courseId - The course's ID
   * @param {Object} payload - The fields to update
   * @returns {Promise<Object|null>} The updated course object or null if not found
   */
  async update(courseId, payload) {
    if (isDbConnected()) {
      const updated = await CourseModel.findOneAndUpdate({ courseId: Number(courseId) }, payload, { new: true }).lean();
      return updated;
    }
    // Update in mock data
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    mockCourses[idx] = { ...mockCourses[idx], ...payload };
    return mockCourses[idx];
  },

  /**
   * Remove a course by courseId.
   * @param {string|number} courseId - The course's ID
   * @returns {Promise<Object|null>} The removed course object or null if not found
   */
  async remove(courseId) {
    if (isDbConnected()) {
      const removed = await CourseModel.findOneAndDelete({ courseId: Number(courseId) }).lean();
      return removed;
    }
    // Remove from mock data
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    return mockCourses.splice(idx, 1)[0];
  }
};
