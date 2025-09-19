const Thread = require('../models/Thread');
const Comment = require('../models/Comment');

exports.createThread = async (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const thread = await Thread.create({ title, body, author: req.user.id });
  res.status(201).json(thread);
};

exports.listThreads = async (req, res) => {
  const threads = await Thread.find().populate('author', 'name email').sort({ createdAt: -1 });
  res.json(threads);
};

async function buildCommentTree(threadId) {
  const comments = await Comment.find({ thread: threadId }).populate('author', 'name email').sort({ createdAt: 1 }).lean();
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

exports.getThread = async (req, res) => {
  const thread = await Thread.findById(req.params.id).populate('author', 'name email');
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  const comments = await buildCommentTree(thread._id);
  res.json({ thread, comments });
};

exports.deleteThread = async (req, res) => {
  const thread = await Thread.findById(req.params.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  await Comment.deleteMany({ thread: thread._id });
  await thread.deleteOne();
  res.json({ message: 'Thread deleted' });
};
