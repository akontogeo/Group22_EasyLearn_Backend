import { users as mockUsers, nextUserId } from '../utils/mockData.js';
import UserModel from '../models/User.js';
import { isDbConnected } from '../config/database.js';

/**
 * UserService provides CRUD operations for users.
 * Uses MongoDB if connected, otherwise falls back to in-memory mock data.
 */
export const UserService = {
  /**
   * List all users.
   * @returns {Promise<Array>} Array of user objects
   */
  async list() {
    // If DB is connected, fetch from MongoDB
    if (isDbConnected()) {
      return UserModel.find().lean();
    }
    // Otherwise, return mock users
    return Promise.resolve(mockUsers);
  },

  /**
   * Get a user by their userId.
   * @param {string|number} userId - The user's ID
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  async getById(userId) {
    if (isDbConnected()) {
      return UserModel.findOne({ userId: Number(userId) }).lean();
    }
    return mockUsers.find(u => String(u.userId) === String(userId));
  },

  /**
   * Create a new user.
   * @param {Object} payload - The user data to create
   * @returns {Promise<Object>} The created user object
   */
  async create(payload) {
    if (isDbConnected()) {
      // Find max userId to increment
      const max = await UserModel.findOne().sort({ userId: -1 }).lean();
      const id = (max && max.userId) ? Number(max.userId) + 1 : 1;
      const toCreate = { userId: id, ...payload };
      const created = await UserModel.create(toCreate);
      return created.toObject();
    }
    // Use mock data if DB is not connected
    const newUser = { userId: nextUserId(), ...payload };
    mockUsers.push(newUser);
    return newUser;
  },

  /**
   * Update an existing user by userId.
   * @param {string|number} userId - The user's ID
   * @param {Object} payload - The fields to update
   * @returns {Promise<Object|null>} The updated user object or null if not found
   */
  async update(userId, payload) {
    if (isDbConnected()) {
      const updated = await UserModel.findOneAndUpdate({ userId: Number(userId) }, payload, { new: true }).lean();
      return updated;
    }
    // Update in mock data
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    mockUsers[idx] = { ...mockUsers[idx], ...payload };
    return mockUsers[idx];
  },

  /**
   * Remove a user by userId.
   * @param {string|number} userId - The user's ID
   * @returns {Promise<Object|null>} The removed user object or null if not found
   */
  async remove(userId) {
    if (isDbConnected()) {
      const removed = await UserModel.findOneAndDelete({ userId: Number(userId) }).lean();
      return removed;
    }
    // Remove from mock data
    const idx = mockUsers.findIndex(u => String(u.userId) === String(userId));
    if (idx === -1) return null;
    return mockUsers.splice(idx, 1)[0];
  }
};
