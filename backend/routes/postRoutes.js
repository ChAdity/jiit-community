const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, deletePost, toggleBookmark, getBookmarks } = require('../controllers/postController');
const { protect, verifiedOnly } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.get('/bookmarks/all', protect, getBookmarks); 
router.get('/:id', getPostById);
router.post('/', protect, verifiedOnly, createPost);
router.delete('/:id', protect, deletePost);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
