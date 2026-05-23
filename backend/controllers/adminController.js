const VerificationRequest = require('../models/VerificationRequest');
const User = require('../models/User');

// @desc    Get all pending verifications
// @route   GET /api/admin/verifications
// @access  Private/Admin
const getPendingVerifications = async (req, res) => {
  try {
    const requests = await VerificationRequest.find({ status: 'pending' })
      .populate('userId', 'name email profilePhoto')
      .sort({ createdAt: 1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve verification
// @route   PATCH /api/admin/verifications/:id/approve
// @access  Private/Admin
const approveVerification = async (req, res) => {
  try {
    const request = await VerificationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request is not pending' });

    request.status = 'verified';
    request.reviewedBy = req.user._id;
    request.reviewedAt = Date.now();
    await request.save();

    await User.findByIdAndUpdate(request.userId, {
      role: request.userType, // 'student' or 'alumni'
      verificationStatus: 'verified'
    });

    res.status(200).json({ message: 'Verification approved', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject verification
// @route   PATCH /api/admin/verifications/:id/reject
// @access  Private/Admin
const rejectVerification = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const request = await VerificationRequest.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request is not pending' });

    request.status = 'rejected';
    request.adminNote = adminNote || 'Proof rejected by admin';
    request.reviewedBy = req.user._id;
    request.reviewedAt = Date.now();
    await request.save();

    await User.findByIdAndUpdate(request.userId, {
      verificationStatus: 'rejected'
    });

    res.status(200).json({ message: 'Verification rejected', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPendingVerifications, approveVerification, rejectVerification };
