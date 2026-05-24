const User = require('../models/User');
const VerificationRequest = require('../models/VerificationRequest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        linkedinUrl: user.linkedinUrl,
        currentCompany: user.currentCompany,
        currentRole: user.currentRole,
        karma: user.karma,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        linkedinUrl: user.linkedinUrl,
        currentCompany: user.currentCompany,
        currentRole: user.currentRole,
        karma: user.karma,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.linkedinUrl !== undefined) {
      user.linkedinUrl = req.body.linkedinUrl;
    }
    if (req.body.currentCompany !== undefined) {
      user.currentCompany = req.body.currentCompany;
    }
    if (req.body.currentRole !== undefined) {
      user.currentRole = req.body.currentRole;
    }

    await user.save();
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      linkedinUrl: user.linkedinUrl,
      currentCompany: user.currentCompany,
      currentRole: user.currentRole,
      karma: user.karma,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/auth/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ karma: { $gt: 0 } })
      .sort({ karma: -1 })
      .limit(10)
      .select('name role currentCompany currentRole karma profilePhoto linkedinUrl');

    let userRank = null;
    let userKarma = 0;
    
    if (req.user) {
      const currentUser = await User.findById(req.user._id);
      if (currentUser) {
        userKarma = currentUser.karma || 0;
        const higherKarmaCount = await User.countDocuments({ karma: { $gt: userKarma } });
        userRank = higherKarmaCount + 1;
      }
    }

    res.status(200).json({ topUsers, userRank, userKarma });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Switch user role
// @route   PUT /api/auth/switch-role
// @access  Private
const switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = user.role === 'student' ? 'alumni' : 'student';
    user.verificationStatus = 'unverified';

    await user.save();
    
    // Clear any previous verification requests for this user so they can submit a new one
    await VerificationRequest.deleteMany({ userId: user._id });
    
    // We can just issue a fresh token here or keep the old one since id doesn't change
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      linkedinUrl: user.linkedinUrl,
      currentCompany: user.currentCompany,
      currentRole: user.currentRole,
      karma: user.karma,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, getLeaderboard, switchRole };
