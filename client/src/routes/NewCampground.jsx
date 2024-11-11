import React, { useEffect, useContext, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import bgDay from '../assets/bgday2.jpg';
import bgNight from '../assets/bgnight.jpeg';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const NewCampground = () => {
    const { isDarkMode } = useOutletContext();
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        images: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Function to create a new campground
    const createCampground = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions

        setIsSubmitting(true); // Start submitting
        const { title, location, price, description, images } = formData;

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('location', location);
        formDataToSend.append('price', price);
        formDataToSend.append('description', description);

        images.forEach((image) => {
            formDataToSend.append('images', image);
        });

        try {
            const { data } = await axios.post('/api/campgrounds/create', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success('Created Campground successfully!');
                clearImages();
                navigate('/campgrounds')
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong during creation.'}`);
            } else {
                toast.error('Network error, please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle image selection and create previews
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setFormData({
            ...formData,
            images: files,
        });

        // Create previews
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    // Clear images
    const clearImages = () => {
        setFormData({ ...formData, images: [] });
        setImagePreviews([]);
    };

    // Check for user and loading status
    useEffect(() => {
        if (!loading && !user) {
            // Only redirect if loading is complete and no user is found
            toast.info('You must be logged in to create a campground.');
            navigate('/campgrounds');
        }
    }, [user, loading, navigate]);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    return (
        <div className='relative min-h-screen bg-neutral dark:bg-neutral-900 overflow-hidden'>
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
                <img src={bgDay} alt="Day background" className="h-full w-full object-cover blur-3xl brightness-115" style={{ position: 'fixed', top: 0, left: 0 }} />
            </div>
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                <img src={bgNight} alt="Night background" className="h-full w-full object-cover blur-3xl" style={{ position: 'fixed', top: 0, left: 0 }} />
            </div>
            <div className="relative mt-16 mx-auto max-w-[370px]">
                <div className="p-3">
                    <div className="bg-white/70 dark:bg-black/60 p-4 rounded-xl">
                        {user ? (
                            <form className="space-y-4" onSubmit={createCampground}>
                                <div>
                                    <label className="block text-black dark:text-gray-200">Title</label>
                                    <input
                                        name="title"
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-black dark:text-gray-200">Location</label>
                                    <input
                                        name="location"
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                                        placeholder="Location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-black dark:text-gray-200">Price</label>
                                    <input
                                        name="price"
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                                        placeholder="Price"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-black dark:text-gray-200">Description</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Description"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-black dark:text-gray-200">At least 1 image required</label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg"
                                        multiple
                                        onChange={handleImageChange}
                                        id="file-input"
                                        required
                                    />
                                    <label
                                        htmlFor="file-input"
                                        className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <span className="mr-2">Choose Images</span>
                                    </label>
                                    <div className="flex flex-wrap mt-2">
                                        {imagePreviews.map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-24 h-24 object-cover m-1 border border-gray-300 rounded"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-sky-500 text-white rounded-md w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        ) : null}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default NewCampground;
