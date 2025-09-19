const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, threadController.createThread);
router.get('/', threadController.listThreads);
router.get('/:id', threadController.getThread);
router.delete('/:id', auth, roleCheck('admin'), threadController.deleteThread);

module.exports = router;
