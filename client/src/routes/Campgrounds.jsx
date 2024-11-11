import React, { useState, useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import bgDay from '../assets/bgday2.jpg';
import bgNight from '../assets/bgnight.jpeg';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import Footer from '../components/Footer';
import TopCampgroundsSlider from '../components/TopCampgroundsSlider';
import { useNavigate } from 'react-router-dom';

const Campgrounds = () => {
    const { user } = useContext(UserContext);
    const [campgrounds, setCampgrounds] = useState([]);
    const [error, setError] = useState('');
    const { isDarkMode } = useOutletContext();
    const navigate = useNavigate();

    const fetchCampgrounds = async () => {
        try {
            const response = await axios.get('/api/campgrounds/');
            setCampgrounds(response.data);
        } catch (err) {
            setError('Failed to fetch items');
        }
    };

    useEffect(() => {
        fetchCampgrounds();
    }, []);

    const onClickCamp = (id) => {
        navigate(`/campgrounds/${id}`);
    };

    // Sort and get top 3 campgrounds by average rating
    const topCampgrounds = [...campgrounds]
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3);

    return (
        <div className='relative min-h-screen bg-neutral dark:bg-neutral-900 overflow-hidden'>
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
                <img src={bgDay} alt="Day background" className="h-full w-full object-cover blur-3xl brightness-115" style={{ position: 'fixed', top: 0, left: 0 }} />
            </div>
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                <img src={bgNight} alt="Night background" className="h-full w-full object-cover blur-3xl" style={{ position: 'fixed', top: 0, left: 0 }} />
            </div>

            <div className="relative mt-12 mx-auto px-4 md:px-12 lg:px-20 max-w-screen-2xl">

                {/* Top 3 Campgrounds Slider */}
                {topCampgrounds.length > 0 && (
                    <div className="flex justify-center">
                        <div className="my-8 max-w-[350px] sm:max-w-[600px] bg-white/50 dark:bg-black/60 p-4 rounded-xl">
                            <TopCampgroundsSlider topCampgrounds={topCampgrounds} />
                        </div>
                    </div>
                )}

                {error && <p className="text-black dark:text-white text-center">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 mb-20">
                    {campgrounds.map((campground) => (
                        <div key={campground._id} className='bg-white/50 dark:bg-black/50 p-4 rounded-xl cursor-pointer' onClick={() => onClickCamp(campground._id)}>
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
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Campgrounds;
