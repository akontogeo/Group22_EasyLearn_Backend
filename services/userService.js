import { users as mockUsers, nextUserId } from '../utils/mockData.js';
import UserModel from '../models/User.js';
import { isDbConnected } from '../config/database.js';

/**
 * Mock-only UserService. All operations operate against the in-memory arrays in `utils/mockData.js`.
 */
export const UserService = {
  async list() {
    if (isDbConnected()) {
      return UserModel.find().lean();
    }
    return Promise.resolve(mockUsers);
  },

  async getById(userId) {
    if (isDbConnected()) {
      return UserModel.findOne({ userId: Number(userId) }).lean();
    }
    return mockUsers.find(u => String(u.userId) === String(userId));
  },

  async create(payload) {
    if (isDbConnected()) {
      const max = await UserModel.findOne().sort({ userId: -1 }).lean();
      const id = (max && max.userId) ? Number(max.userId) + 1 : 1;
      const toCreate = { userId: id, ...payload };
      const created = await UserModel.create(toCreate);
      return created.toObject();
    }

    const newUser = { userId: nextUserId(), ...payload };
    mockUsers.push(newUser);
    return newUser;
  },

  async create(payload) {
    const newUser = { userId: nextUserId(), ...payload };
    mockUsers.push(newUser);
    return newUser;
  },

  async update(userId, payload) {
    if (isDbConnected()) {
      const updated = await UserModel.findOneAndUpdate({ userId: Number(userId) }, payload, { new: true }).lean();
      return updated;
    }
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    mockUsers[idx] = { ...mockUsers[idx], ...payload };
    return mockUsers[idx];
  },

  async remove(userId) {
    if (isDbConnected()) {
      const removed = await UserModel.findOneAndDelete({ userId: Number(userId) }).lean();
      return removed;
    }
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    return mockUsers.splice(idx, 1)[0];
  }
};
