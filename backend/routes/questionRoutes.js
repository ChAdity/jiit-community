const express = require('express');
const router = express.Router();
const { getQuestions, getQuestionById, createQuestion, createAnswer } = require('../controllers/questionController');
const { protect, verifiedOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getQuestions);
router.get('/:id', getQuestionById);
router.post('/', protect, verifiedOnly, createQuestion);
router.post('/:id/answers', protect, verifiedOnly, createAnswer);

module.exports = router;
