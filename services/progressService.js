import { progress as mockProgress, nextProgressId } from '../utils/mockData.js';

// Progress service layer - uses in-memory mock data
export const ProgressService = {
  async getProgress(userId, courseId) {
    return mockProgress.find(p => String(p.userId) === String(userId) && String(p.courseId) === String(courseId));
  },

  async upsertProgress(userId, courseId, percentage) {
    const idx = mockProgress.findIndex(p => String(p.userId) === String(userId) && String(p.courseId) === String(courseId));
    if (idx !== -1) {
      mockProgress[idx].progressPercentage = percentage;
      return mockProgress[idx];
    }
    const newProgress = { progressId: nextProgressId(), userId: Number(userId), courseId: Number(courseId), progressPercentage: percentage };
    mockProgress.push(newProgress);
    return newProgress;
  }
};
