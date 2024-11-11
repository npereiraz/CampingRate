const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    content: {
        type: String,
        maxlength: 500,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground',
        required: true,
    },
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
