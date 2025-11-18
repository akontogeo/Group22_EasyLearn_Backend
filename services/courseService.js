import { courses as mockCourses, nextCourseId } from '../utils/mockData.js';

export const CourseService = {
  async list(filters = {}) {
    // basic filtering for mock
    let res = mockCourses.slice();
    if (filters.category) res = res.filter(c => c.category === filters.category);
    if (filters.difficulty) res = res.filter(c => c.difficulty === filters.difficulty);
    if (typeof filters.premium !== 'undefined') res = res.filter(c => c.premium === filters.premium);
    return Promise.resolve(res);
  },

  async getById(courseId) {
    return mockCourses.find(c => String(c.courseId) === String(courseId));
  },

  async create(payload) {
    const newCourse = { courseId: nextCourseId(), ...payload };
    mockCourses.push(newCourse);
    return newCourse;
  },

  async update(courseId, payload) {
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    mockCourses[idx] = { ...mockCourses[idx], ...payload };
    return mockCourses[idx];
  },

  async remove(courseId) {
    const idx = mockCourses.findIndex(c => String(c.courseId) === String(courseId));
    if (idx === -1) return null;
    return mockCourses.splice(idx, 1)[0];
  }
};
