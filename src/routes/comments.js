const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/threads/:id/comments', auth, commentController.addComment); // mounted at /api/comments for compatibility
router.post('/:id/reply', auth, commentController.replyComment);

module.exports = router;
