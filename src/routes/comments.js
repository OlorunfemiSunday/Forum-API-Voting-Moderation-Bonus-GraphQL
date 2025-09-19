const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Add a comment to a thread
router.post('/threads/:id/comments', auth, commentController.addComment);

// Reply to a comment
router.post('/:id/reply', auth, commentController.replyComment);

// Vote on a comment (upvote/downvote)
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { vote } = req.body; // 1 = upvote, -1 = downvote
    const comment = await commentController.Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // Check if user already voted
    if (comment.hasVoted(req.user.id)) {
      return res.status(400).json({ error: 'You have already voted on this comment' });
    }

    // Add vote
    comment.votes.push({ user: req.user.id, vote });
    await comment.save();

    res.json({ message: 'Vote recorded', voteCount: comment.voteCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
