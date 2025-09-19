const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const Thread = require("../models/Thread");
const Comment = require("../models/Comment");

// List all threads (admin only)
router.get("/threads", auth, roleCheck("admin"), async (req, res) => {
  try {
    const threads = await Thread.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error("Admin list threads error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a comment (admin only)
router.delete("/comments/:id", auth, roleCheck("admin"), async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Admin delete comment error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
