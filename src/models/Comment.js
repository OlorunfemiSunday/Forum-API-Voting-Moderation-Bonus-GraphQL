const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      vote: { type: Number, enum: [1, -1] }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
