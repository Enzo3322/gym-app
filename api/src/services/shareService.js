const shareRepository = require('../repositories/shareRepository');
const workoutRepository = require('../repositories/workoutRepository');

class ShareService {
  async shareWorkout(workoutId) {
    const workout = await workoutRepository.findById(workoutId);
    if (!workout) {
      throw new Error('Workout not found');
    }

    return await shareRepository.createShare(workoutId);
  }

  async getSharedWorkout(shareId) {
    const sharedWorkout = await shareRepository.findByShareId(shareId);
    if (!sharedWorkout) {
      throw new Error('Shared workout not found');
    }
    return sharedWorkout;
  }

  async deleteShare(shareId) {
    const sharedWorkout = await shareRepository.findByShareId(shareId);
    if (!sharedWorkout) {
      throw new Error('Shared workout not found');
    }
    await shareRepository.deleteShare(shareId);
  }
}

module.exports = new ShareService(); 