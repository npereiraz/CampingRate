const Campground = require('../schemas/campground');
const axios = require('axios');
const Review = require('../schemas/review');
const { cloudinary } = require('../cloudinary/cloudinary');

// Function to get coordinates from an address using Mapbox
const getMapboxCoordinates = async (address) => {
    const accessToken = process.env.MAP_BOX_TOKEN; // Replace with your Mapbox access token
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.features.length > 0) {
            return {
                latitude: data.features[0].geometry.coordinates[1], // Latitude
                longitude: data.features[0].geometry.coordinates[0], // Longitude
            };
        } else {
            console.error('No results found');
            return null;
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

const createCampground = async (req, res) => {
    try {
        const { title, location, price, description } = req.body;

        // Basic field validations
        if (!title) return res.status(400).json({ error: 'Title is required' });
        if (title.length > 50) return res.status(400).json({ error: 'Title can only have 50 characters' });
        if (!location) return res.status(400).json({ error: 'Location is required' });
        if (location.length > 255) return res.status(400).json({ error: 'Location can only have 255 characters' });
        if (!price) return res.status(400).json({ error: 'Price is required' });
        if (price < 0) return res.status(400).json({ error: 'Price has to be positive' });
        if (price > 99999999) return res.status(400).json({ error: 'Price is too high' });
        if (price.toString().split(".")[1]?.length > 2) return res.status(400).json({ error: 'Price must have at most two decimal places' });
        if (!description) return res.status(400).json({ error: 'Description is required' });
        if (description.length > 500) return res.status(400).json({ error: 'Description can only have 500 characters' });

        // Validate images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }

        // Get coordinates from Mapbox (or another geolocation service)
        const coordinates = await getMapboxCoordinates(location);
        if (!coordinates) return res.status(400).json({ error: 'Could not get coordinates for the provided address.' });

        // Format images for database storage
        const images = req.files.map(file => ({
            url: file.path,       // URL of the uploaded image
            filename: file.filename // Filename of the uploaded image
        }));

        // Create campground entry in the database
        const campground = await Campground.create({
            title,
            location,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            price,
            description,
            images,
            author: req.user.id,
        });

        // Return the created campground with status 201
        return res.status(201).json(campground);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the campground.' });
    }
}

const getAllCampgrounds = async (req, res) => {
    try {
        const campgrounds = await Campground.find().populate('author', 'username');

        // Calculate average ratings
        const campgroundsWithRatings = await Promise.all(campgrounds.map(async (campground) => {
            const reviews = await Review.find({ campground: campground._id }); // Fetch reviews for each campground
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : null; // Calculate average

            return {
                ...campground.toObject(),
                averageRating // Add average rating to campground data
            };
        }));

        res.json(campgroundsWithRatings); // Return the modified campgrounds array
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching campgrounds' });
    }
};
// Function to get a campground by ID
const getCampgroundById = async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate('author', 'username');
        if (!campground) {
            return res.status(404).json({ error: 'Campground not found' });
        }
        return res.status(200).json(campground);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching campground' });
    }
};
//get camp by user
const getUserCampgrounds = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID

        const campgrounds = await Campground.find({ author: userId }).populate('author', 'username');

        // Calculate average ratings for each campground
        const campgroundsWithRatings = await Promise.all(campgrounds.map(async (campground) => {
            const reviews = await Review.find({ campground: campground._id });
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : null;

            return {
                ...campground.toObject(),
                averageRating,
            };
        }));

        res.json(campgroundsWithRatings); // Return the filtered campgrounds
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user campgrounds' });
    }
};

const deleteCampground = async (req, res) => {
    try {
        const campgroundId = req.params.id;

        // Find the campground and check if it exists
        const campground = await Campground.findById(campgroundId);
        if (!campground) {
            return res.status(404).json({ error: 'Campground not found' });
        }

        // Delete associated reviews
        await Review.deleteMany({ campground: campgroundId });

        // Delete images from Cloudinary
        for (let image of campground.images) {
            // Assuming 'filename' is the public ID from Cloudinary
            const result = await cloudinary.uploader.destroy(image.filename);
            console.log(result); // Optionally log the result of the deletion
        }

        // Delete the campground itself
        await Campground.findByIdAndDelete(campgroundId);

        res.status(200).json({ message: 'Campground deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete campground' });
    }
};

module.exports = {
    createCampground,
    getAllCampgrounds,
    getCampgroundById,
    getUserCampgrounds,
    deleteCampground
}
