const Review = require('../schemas/review');

const getAllReviews = async (req, res) => {
    const { campgroundId } = req.params;
    try {
        const reviews = await Review.find({ campground: campgroundId }).populate('author', 'username');
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Create a review for a specific campground
const createReview = async (req, res) => {
    const { content, rating } = req.body;
    const { campgroundId } = req.params;

    if (!content) {
        return res.status(400).json({ error: 'Please write a review' });
    }
    if (content.length > 500) {
        return res.status(400).json({ error: 'Review can only have 500 characters' });
    }
    // Check rating
    if (rating === undefined || rating === null) {
        return res.status(400).json({ error: 'Rating is required' });
    }
    if (rating > 5 || rating < 1) {
        return res.status(400).json({ error: 'Not a valid rating' });
    }

    const userId = req.user.id;

    const review = new Review({
        content,
        rating,
        campground: campgroundId,
        author: userId
    });

    try {
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error creating review' });
    }
};

module.exports = {
    createReview,
    getAllReviews
}
