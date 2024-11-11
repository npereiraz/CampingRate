import React, { useState, useContext, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import bgDay from '../assets/bgday2.jpg';
import bgNight from '../assets/bgnight.jpeg';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa'; // Import React Icons

const UserCampgrounds = () => {
    const { user, loading, token } = useContext(UserContext);
    const [campgrounds, setCampgrounds] = useState([]);
    const { isDarkMode } = useOutletContext();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchUserCampgrounds = async () => {
        try {
            const response = await axios.get('/api/campgrounds/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCampgrounds(response.data);
        } catch (err) {
            setError('Failed to fetch user campgrounds');
        }
    };

    const deleteCampground = async (campgroundId) => {
        // Confirm with the user before deleting
        const confirmDelete = window.confirm("Are you sure you want to delete this campground?");

        if (!confirmDelete) return; // If the user cancels, do nothing

        try {
            // Send DELETE request to the backend
            const response = await axios.delete(`/api/campgrounds/${campgroundId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send the token for authorization
                },
            });

            // If successful, remove the deleted campground from the state
            setCampgrounds(campgrounds.filter(campground => campground._id !== campgroundId));

            toast.success('Campground deleted successfully'); // Show success message
        } catch (err) {
            console.error("Error deleting campground:", err);
            toast.error('Failed to delete campground'); // Show error message
        }
    };

    useEffect(() => {
        if (!loading && user) {
            fetchUserCampgrounds();
        }
    }, [user, loading]);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            toast.info('You must be logged in to view your campgrounds.');
            navigate('/campgrounds');
        }
    }, [user, navigate, loading]);

    return (
        <div className='relative min-h-screen bg-neutral dark:bg-neutral-900 overflow-hidden'>
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
                <img src={bgDay} alt="Day background" className="h-full w-full object-cover blur-3xl brightness-115" style={{ position: 'fixed', top: 0, left: 0 }} />
            </div>
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                <img src={bgNight} alt="Night background" className="h-full w-full object-cover blur-3xl" style={{ position: 'fixed', top: 0, left: 0 }} />
            </div>

            <div className="relative mt-16 mx-auto px-4 md:px-12 lg:px-20 max-w-screen-2xl">
                {error ? (
                    <p className="text-black dark:text-white text-center">{error}</p>
                ) : campgrounds.length === 0 ? (
                    <p className="text-black dark:text-white text-center">No campgrounds found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 mb-20">
                        {campgrounds.map((campground) => (
                            <div key={campground._id} className='bg-white/50 dark:bg-black/50 p-4 rounded-xl relative'>
                                <div className="image-gallery">
                                    {campground.images.length > 0 && (
                                        <img
                                            key={campground.images[0].filename}
                                            src={campground.images[0].url.replace('/upload/', '/upload/w_400/')}
                                            alt={campground.title}
                                            className="campground-image w-full h-[200px] object-cover rounded-xl"
                                        />
                                    )}
                                </div>
                                <p className='text-black dark:text-neutral-200'>{campground.title}</p>
                                <p className='text-neutral-600 dark:text-neutral-400'>{campground.location}</p>
                                <div className="flex justify-between">
                                    <p className='text-black dark:text-neutral-200'>Price: {campground.price}€</p>
                                    {campground.averageRating ? (
                                        <p className='text-black dark:text-neutral-200'>Rating: {campground.averageRating} <span className='text-yellow-500 text-xl'>★</span></p>
                                    ) : (
                                        <p className='text-neutral-600 dark:text-neutral-400'>No reviews yet</p>
                                    )}
                                </div>

                                {/* Delete Button in the top-right corner */}
                                <div className="absolute top-7 right-7">
                                    <button
                                        onClick={() => deleteCampground(campground._id)}
                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                    >
                                        <FaTrash className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCampgrounds;
