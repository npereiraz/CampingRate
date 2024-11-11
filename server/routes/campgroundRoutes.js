const express = require('express');
const router = express.Router();
const cors = require('cors');
const { createCampground, getAllCampgrounds, getCampgroundById, getUserCampgrounds, deleteCampground } = require('../controllers/campController');
const corsMiddleware = require('../middleware/corsMiddleware');
const multer = require('multer');
const { storage } = require('../cloudinary/cloudinary');
const authenticateJWT = require('../middleware/authMiddleware');

// Middleware for CORS
router.use(corsMiddleware);
// Set up multer to handle multiple image uploads
const upload = multer({ storage: storage });

// Use authenticateJWT middleware for the create route
router.post('/create', authenticateJWT, upload.array('images'), createCampground);
router.get('/user', authenticateJWT, getUserCampgrounds);
router.get('/', getAllCampgrounds);
router.get('/:id', getCampgroundById);
router.delete('/:id', authenticateJWT, deleteCampground);

module.exports = router;