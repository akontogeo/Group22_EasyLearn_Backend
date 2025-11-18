import { users as mockUsers, nextUserId } from '../utils/mockData.js';

/**
 * Mock-only UserService. All operations operate against the in-memory arrays in `utils/mockData.js`.
 */
export const UserService = {
  async list() {
    return Promise.resolve(mockUsers);
  },

  async getById(userId) {
    return mockUsers.find(u => String(u.userId) === String(userId));
  },

  async create(payload) {
    const newUser = { userId: nextUserId(), ...payload };
    mockUsers.push(newUser);
    return newUser;
  },

  async update(userId, payload) {
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    mockUsers[idx] = { ...mockUsers[idx], ...payload };
    return mockUsers[idx];
  },

  async remove(userId) {
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    return mockUsers.splice(idx, 1)[0];
  }
};
