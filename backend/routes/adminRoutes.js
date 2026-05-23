const express = require('express');
const router = express.Router();
const { getPendingVerifications, approveVerification, rejectVerification } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/verifications', getPendingVerifications);
router.patch('/verifications/:id/approve', approveVerification);
router.patch('/verifications/:id/reject', rejectVerification);

module.exports = router;
