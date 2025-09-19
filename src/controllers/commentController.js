const Comment = require('../models/Comment');
const Thread = require('../models/Thread');

// Add a comment to a thread
exports.addComment = async (req, res) => {
  try {
    const { body } = req.body;
    const threadId = req.params.id;

    if (!body) return res.status(400).json({ error: 'Comment body is required' });

    const thread = await Thread.findById(threadId);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const comment = await Comment.create({
      thread: threadId,
      content: body,
      author: req.user.id
    });

    // Add comment reference to thread
    thread.comments.push(comment._id);
    await thread.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error('Add comment error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reply to an existing comment
exports.replyComment = async (req, res) => {
  try {
    const parentId = req.params.id;
    const { body } = req.body;

    if (!body) return res.status(400).json({ error: 'Reply body is required' });

    const parent = await Comment.findById(parentId);
    if (!parent) return res.status(404).json({ error: 'Parent comment not found' });

    const reply = await Comment.create({
      thread: parent.thread,
      content: body,
      author: req.user.id
    });

    // Add reply reference to parent comment
    parent.replies.push(reply._id);
    await parent.save();

    res.status(201).json(reply);
  } catch (err) {
    console.error('Reply comment error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
