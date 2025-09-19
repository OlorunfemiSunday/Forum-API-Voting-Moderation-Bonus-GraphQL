const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vote: { type: Number, enum: [1, -1], required: true } // 1 = upvote, -1 = downvote
}, { _id: false });

const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  votes: [VoteSchema] // embed vote subdocuments
}, { timestamps: true });

// Virtual field: total vote count
ThreadSchema.virtual('voteCount').get(function() {
  return this.votes.reduce((total, v) => total + v.vote, 0);
});

// Method to check if a user has already voted
ThreadSchema.methods.hasVoted = function(userId) {
  return this.votes.some(v => v.user.toString() === userId.toString());
};

module.exports = mongoose.model('Thread', ThreadSchema);
