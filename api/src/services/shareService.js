const shareRepository = require('../repositories/shareRepository');
const workoutRepository = require('../repositories/workoutRepository');

/**
 * @typedef {Object} Share
 * @property {string} id - The unique identifier for the share.
 * @property {string} workoutId - The ID of the workout being shared.
 * @property {string} link - The URL link to the shared workout.
 * @property {string} qrCode - The QR code image data URL.
 */

/**
 * Service for managing shared workouts.
 * @class
 */
class ShareService {
  /**
   * Share a workout by its ID.
   * @param {string} workoutId - The ID of the workout to share.
   * @returns {Promise<Share>} The created share object.
   * @throws {Error} If the workout is not found.
   */
  async shareWorkout(workoutId) {
    const workout = await workoutRepository.findById(workoutId);
    if (!workout) {
      throw new Error('Workout not found');
    }

    return await shareRepository.createShare(workoutId);
  }

  /**
   * Get a shared workout by its share ID.
   * @param {string} shareId - The ID of the shared workout.
   * @returns {Promise<Share>} The shared workout object.
   * @throws {Error} If the shared workout is not found.
   */
  async getSharedWorkout(shareId) {
    const sharedWorkout = await shareRepository.findByShareId(shareId);
    if (!sharedWorkout) {
      throw new Error('Shared workout not found');
    }
    return sharedWorkout;
  }

  /**
   * Delete a shared workout by its share ID.
   * @param {string} shareId - The ID of the shared workout to delete.
   * @throws {Error} If the shared workout is not found.
   */
  async deleteShare(shareId) {
    const sharedWorkout = await shareRepository.findByShareId(shareId);
    if (!sharedWorkout) {
      throw new Error('Shared workout not found');
    }
    await shareRepository.deleteShare(shareId);
  }
}

module.exports = new ShareService(); 