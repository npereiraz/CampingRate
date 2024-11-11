const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser, loginUser, getProfile, logoutUser } = require('../controllers/authController');
const corsMiddleware = require('../middleware/corsMiddleware');

// Middleware for CORS
router.use(corsMiddleware);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.post('/logout', logoutUser);

module.exports = router;