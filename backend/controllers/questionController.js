const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const { company, status, sort, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (company) query.company = { $regex: company, $options: 'i' };

    // Privacy for students
    if (req.user && req.user.role === 'student') {
      query.authorId = req.user._id;
    }

    // Status filtering
    if (status === 'unanswered') {
      query.answersCount = 0;
    } else if (status === 'answered') {
      query.answersCount = { $gt: 0 };
    }

    // Sort logic
    let sortQuery = { createdAt: -1 };
    if (sort === 'oldest') sortQuery = { createdAt: 1 };

    const skip = (page - 1) * limit;

    const questions = await Question.find(query)
      .populate('authorId', 'name profilePhoto linkedinUrl currentCompany currentRole karma')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(query);

    res.status(200).json({
      questions,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get question by ID with answers
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('authorId', 'name profilePhoto currentCompany currentRole karma linkedinUrl');
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const answers = await Answer.find({ questionId: question._id })
      .populate('authorId', 'name profilePhoto role linkedinUrl currentCompany currentRole karma')
      .sort({ createdAt: 1 });

    res.status(200).json({ question, answers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ask a new question
// @route   POST /api/questions
// @access  Private (Verified Users)
const createQuestion = async (req, res) => {
  try {
    const { title, body, company } = req.body;

    const newQuestion = await Question.create({
      authorId: req.user._id,
      title,
      body,
      company
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Answer a question
// @route   POST /api/questions/:id/answers
// @access  Private (Verified Users)
const createAnswer = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { body } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const answer = await Answer.create({
      questionId,
      authorId: req.user._id,
      body
    });

    question.answersCount += 1;
    await question.save();

    // Reward Karma
    await User.findByIdAndUpdate(req.user._id, { $inc: { karma: 5 } });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestions, getQuestionById, createQuestion, createAnswer };
