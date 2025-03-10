const shareService = require('../services/shareService');

class ShareController {
  async shareWorkout(req, res) {
    try {
      const { workoutId } = req.params;
      const share = await shareService.shareWorkout(workoutId);
      res.status(201).json(share);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSharedWorkout(req, res) {
    try {
      const { shareId } = req.params;
      const sharedWorkout = await shareService.getSharedWorkout(shareId);
      res.json(sharedWorkout);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteShare(req, res) {
    try {
      const { shareId } = req.params;
      await shareService.deleteShare(shareId);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ShareController(); 