const express = require('express');
const router = express.Router();
const { submitVerification, getVerificationStatus } = require('../controllers/verificationController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/submit', protect, upload.single('idProof'), submitVerification);
router.get('/status', protect, getVerificationStatus);

module.exports = router;
