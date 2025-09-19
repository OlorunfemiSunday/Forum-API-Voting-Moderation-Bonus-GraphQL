const Comment = require('../models/Comment');
const Thread = require('../models/Thread');

exports.addComment = async (req, res) => {
  const { body } = req.body;
  const threadId = req.params.id;
  if (!body) return res.status(400).json({ error: 'body is required' });
  const thread = await Thread.findById(threadId);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  const comment = await Comment.create({ thread: threadId, body, author: req.user.id });
  res.status(201).json(comment);
};

exports.replyComment = async (req, res) => {
  const parentId = req.params.id;
  const { body } = req.body;
  if (!body) return res.status(400).json({ error: 'body is required' });
  const parent = await Comment.findById(parentId);
  if (!parent) return res.status(404).json({ error: 'Parent comment not found' });
  const comment = await Comment.create({ thread: parent.thread, parent: parentId, body, author: req.user.id });
  res.status(201).json(comment);
};
