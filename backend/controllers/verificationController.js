const User = require('../models/User');
const VerificationRequest = require('../models/VerificationRequest');

// @desc    Submit verification request
// @route   POST /api/verification/submit
// @access  Private
const submitVerification = async (req, res) => {
  try {
    const { userType, collegeEmail, branch, batchYear, linkedinUrl } = req.body;
    
    // Check if request already exists and is pending or verified
    const existingReq = await VerificationRequest.findOne({
      userId: req.user._id,
      status: { $in: ['pending', 'verified'] }
    });

    if (existingReq) {
      return res.status(400).json({ message: 'Verification request already submitted or approved' });
    }

    if (userType === 'student') {
      if (!collegeEmail) return res.status(400).json({ message: 'College email required for student verification' });
      
      const domainMatch = collegeEmail.endsWith('@jiit.ac.in') || collegeEmail.endsWith('@mail.jiit.ac.in');
      if (!domainMatch) {
        return res.status(400).json({ message: 'Invalid college email domain. Must be @jiit.ac.in or @mail.jiit.ac.in' });
      }

      await User.findByIdAndUpdate(req.user._id, {
        role: 'student',
        verificationStatus: 'verified',
        collegeEmail,
        branch,
        batchYear
      });

      const newReq = await VerificationRequest.create({
        userId: req.user._id,
        userType: 'student',
        proofType: 'college_email',
        collegeEmail,
        branch,
        batchYear,
        status: 'verified'
      });

      return res.status(200).json({ message: 'Successfully verified as student', request: newReq });
    }

    if (userType === 'alumni') {
      // Allow mocking upload for MVP if cloudinary keys aren't provided
      const proofUrl = req.file ? req.file.path : 'https://mockurl.com/mock-id.jpg';

      if (!req.file && process.env.CLOUDINARY_API_KEY !== 'mock_key') {
        return res.status(400).json({ message: 'ID Proof upload required for alumni verification' });
      }

      const newReq = await VerificationRequest.create({
        userId: req.user._id,
        userType: 'alumni',
        proofType: 'college_id',
        proofUrl: proofUrl,
        linkedinUrl,
        branch,
        batchYear,
        status: 'pending'
      });

      await User.findByIdAndUpdate(req.user._id, {
        verificationStatus: 'pending'
      });

      return res.status(200).json({ message: 'Verification request submitted for admin review', request: newReq });
    }

    res.status(400).json({ message: 'Invalid user type' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get verification status
// @route   GET /api/verification/status
// @access  Private
const getVerificationStatus = async (req, res) => {
  try {
    const request = await VerificationRequest.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      verificationStatus: req.user.verificationStatus,
      request: request || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitVerification, getVerificationStatus };
