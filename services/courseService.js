import { courses as mockCourses, nextCourseId } from '../utils/mockData.js';
import CourseModel from '../models/Course.js';
import { isDbConnected } from '../config/database.js';

export const CourseService = {
  async list(filters = {}) {
    // If DB connected, attempt to read from MongoDB
    if (isDbConnected()) {
      const mongoFilter = {};
      if (filters.category) mongoFilter.category = filters.category;
      if (filters.difficulty) mongoFilter.difficulty = filters.difficulty;
      if (typeof filters.premium !== 'undefined') mongoFilter.premium = filters.premium;
      return CourseModel.find(mongoFilter).lean();
    }

    // fallback to mock
    let res = mockCourses.slice();
    if (filters.category) res = res.filter(c => c.category === filters.category);
    if (filters.difficulty) res = res.filter(c => c.difficulty === filters.difficulty);
    if (typeof filters.premium !== 'undefined') res = res.filter(c => c.premium === filters.premium);
    return Promise.resolve(res);
  },

  async getById(courseId) {
    if (isDbConnected()) {
      return CourseModel.findOne({ courseId: Number(courseId) }).lean();
    }
    return mockCourses.find(c => String(c.courseId) === String(courseId));
  },

  async create(payload) {
    if (isDbConnected()) {
      const max = await CourseModel.findOne().sort({ courseId: -1 }).lean();
      const id = (max && max.courseId) ? Number(max.courseId) + 1 : 1;
      const toCreate = { courseId: id, ...payload };
      const created = await CourseModel.create(toCreate);
      return created.toObject();
    }

    const newCourse = { courseId: nextCourseId(), ...payload };
    mockCourses.push(newCourse);
    return newCourse;
  },

  async update(courseId, payload) {
    if (isDbConnected()) {
      const updated = await CourseModel.findOneAndUpdate({ courseId: Number(courseId) }, payload, { new: true }).lean();
      return updated;
    }
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    mockCourses[idx] = { ...mockCourses[idx], ...payload };
    return mockCourses[idx];
  },

  async remove(courseId) {
    if (isDbConnected()) {
      const removed = await CourseModel.findOneAndDelete({ courseId: Number(courseId) }).lean();
      return removed;
    }
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    return mockCourses.splice(idx, 1)[0];
  }
};
