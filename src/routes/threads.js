const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Create a new thread
router.post('/', auth, threadController.createThread);

// List all threads
router.get('/', threadController.listThreads);

// Get a single thread by ID
router.get('/:id', threadController.getThread);

// Delete a thread (admin only)
router.delete('/:id', auth, roleCheck('admin'), threadController.deleteThread);

// Vote on a thread (upvote/downvote)
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { vote } = req.body; // 1 = upvote, -1 = downvote
    const thread = await threadController.Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    // Check if user already voted
    if (thread.hasVoted(req.user.id)) {
      return res.status(400).json({ error: 'You have already voted on this thread' });
    }

    // Add vote
    thread.votes.push({ user: req.user.id, vote });
    await thread.save();

    res.json({ message: 'Vote recorded', voteCount: thread.voteCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
