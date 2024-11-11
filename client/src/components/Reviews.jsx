import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Reviews = ({ campgroundId, setReviews }) => {
    const { user } = useContext(UserContext);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setLocalReviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Function to handle star click
    const handleStarClick = (value) => {
        setRating(value);
    };

    // Function to render stars
    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isHovered = starValue <= hoveredRating;
            const isRated = starValue <= rating;

            return (
                <span
                    key={starValue}
                    className={`cursor-pointer text-2xl ${isRated || isHovered ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                    onClick={() => handleStarClick(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                >
                    ★
                </span>
            );
        });
    };

    const createReview = async (e) => {
        e.preventDefault();
        if (!reviewText || !rating) {
            toast.error('Please fill in the rating and review field');
            return;
        }
        try {
            const response = await axios.post(`/api/reviews/${campgroundId}`, {
                content: reviewText,
                rating,
            });
            toast.success('Review submitted successfully!');
            setReviewText('');
            setRating(0);
            setHoveredRating(0);
            fetchReviews();
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit review. Please try again.');
        }
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/reviews/${campgroundId}`);
            setLocalReviews(response.data);  // Update local reviews state
            setReviews(response.data);  // Update reviews in parent component
        } catch (err) {
            console.error(err);
            setError('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [campgroundId]);

    return (
        <div className='xl:mt-10'>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading reviews...</p>}
            {user ? (
                <form onSubmit={createReview}>
                    <h2 className="text-xl font-bold text-black dark:text-neutral-200">Leave a Review</h2>

                    {/* Star Rating */}
                    <div className="flex my-2">
                        {renderStars()}
                    </div>

                    {/* Review Textarea */}
                    <textarea
                        rows={4}
                        placeholder="Description"
                        required
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="mt-4 w-full p-2 border border-gray-300 rounded-md bg-white/50 dark:bg-gray-700/40 dark:text-white focus:outline-none"
                    ></textarea>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className='mt-1 px-6 py-2 text-black dark:text-neutral-200 bg-sky-500/50 hover:bg-sky-500/80 rounded-lg'
                        >
                            Send
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-sky-700 dark:text-sky-500 mt-4 text-center">
                    Please log in to leave a review.
                </p>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-bold text-black dark:text-neutral-200">Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="border border-gray-300 rounded-md p-4 mt-4 bg-white/50 dark:bg-gray-700/40">
                            <div className="flex items-center">
                                {/* Display rating stars */}
                                <div className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <span key={index} className={`text-xl ${index < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="ml-2 text-gray-500 dark:text-gray-400 text-sm">by {review.author?.username || 'Unknown'}</p>
                            </div>
                            <p className="mt-2 text-black dark:text-neutral-300 text-sm">{review.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to leave one!</p>
                )}
            </div>
        </div>
    );
};

export default Reviews;
