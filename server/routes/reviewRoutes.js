const express = require('express');
const router = express.Router();
const corsMiddleware = require('../middleware/corsMiddleware');
const authenticateJWT = require('../middleware/authMiddleware');
const { getAllReviews, createReview } = require('../controllers/reviewController');

// Middleware for CORS
router.use(corsMiddleware);

router.post('/:campgroundId', authenticateJWT, createReview);
router.get('/:campgroundId', getAllReviews);

module.exports = router;
