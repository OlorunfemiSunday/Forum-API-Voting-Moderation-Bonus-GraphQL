const Thread = require('../models/Thread');
const Comment = require('../models/Comment');

// Create a new thread
exports.createThread = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

    const thread = await Thread.create({
      title,
      content,
      author: req.user.id
    });

    res.status(201).json(thread);
  } catch (err) {
    console.error('Create thread error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// List all threads
exports.listThreads = async (req, res) => {
  try {
    const threads = await Thread.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error('List threads error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Build nested comment tree
async function buildCommentTree(threadId) {
  const comments = await Comment.find({ thread: threadId })
    .populate('author', 'name email')
    .sort({ createdAt: 1 })
    .lean();

  const byId = {};
  comments.forEach(c => { c.children = []; byId[c._id] = c; });

  const roots = [];
  comments.forEach(c => {
    if (c.parent) {
      const parent = byId[c.parent];
      if (parent) parent.children.push(c);
      else roots.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}

// Get a single thread with nested comments
exports.getThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate('author', 'name email');
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const comments = await buildCommentTree(thread._id);
    res.json({ thread, comments });
  } catch (err) {
    console.error('Get thread error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a thread and its comments (admin only)
exports.deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    await Comment.deleteMany({ thread: thread._id });
    await thread.deleteOne();

    res.json({ message: 'Thread and its comments deleted successfully' });
  } catch (err) {
    console.error('Delete thread error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
