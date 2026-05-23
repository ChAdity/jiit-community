const Post = require('../models/Post');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');

// @desc    Get all posts (with pagination and filters)
// @route   GET /api/posts
// @access  Public (or protected if we want)
const getPosts = async (req, res) => {
  try {
    const { company, roleTitle, batchYear, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (company) query.company = { $regex: company, $options: 'i' };
    if (roleTitle) query.roleTitle = { $regex: roleTitle, $options: 'i' };
    if (batchYear) query.batchYear = batchYear;

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate('authorId', 'name profilePhoto linkedinUrl currentCompany currentRole karma')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.status(200).json({
      posts,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('authorId', 'name profilePhoto linkedinUrl batchYear currentCompany currentRole karma');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (verified alumni or admin)
const createPost = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ message: 'Only alumni and admins can create posts' });
    }

    const newPost = await Post.create({
      ...req.body,
      authorId: req.user._id
    });

    // Reward Karma
    await User.findByIdAndUpdate(req.user._id, { $inc: { karma: 10 } });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user is author or admin
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bookmark
// @route   POST /api/posts/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const existingBookmark = await Bookmark.findOne({ userId, postId });

    if (existingBookmark) {
      await existingBookmark.deleteOne();
      return res.status(200).json({ message: 'Bookmark removed', bookmarked: false });
    } else {
      await Bookmark.create({ userId, postId });
      return res.status(200).json({ message: 'Bookmark added', bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookmarks
// @route   GET /api/posts/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate({
      path: 'postId',
      populate: { path: 'authorId', select: 'name company roleTitle' }
    });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, getPostById, createPost, deletePost, toggleBookmark, getBookmarks };
