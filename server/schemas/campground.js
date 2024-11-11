const mongoose = require('mongoose')
const { Schema } = mongoose
const ImageSchema = new Schema({
    url: String,
    filename: String
});

const campgroundSchema = new Schema({
    title: {
        type: String,
        maxlength: 50,
        required: true,
    },
    location: {
        type: String,
        maxlength: 255,
        required: true,
    },
    latitude: String,
    longitude: String,
    price: {
        type: Number,
        min: 0,
        max: 99999999,
        required: true,
    },
    description: {
        type: String,
        maxlength: 500,
        required: true,
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

const CampgroundModel = mongoose.model('Campground', campgroundSchema);

module.exports = CampgroundModel;