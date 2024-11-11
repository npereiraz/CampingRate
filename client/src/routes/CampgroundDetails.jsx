import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import bgDay from '../assets/bgday2.jpg';
import bgNight from '../assets/bgnight.jpeg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import MapboxMap from '../components/MapboxMap';
import CampSlider from '../components/CampSlider';
import Footer from '../components/Footer';
import Reviews from '../components/Reviews';

const CampgroundDetails = () => {
    const { isDarkMode } = useOutletContext();
    const { id } = useParams();
    const [campground, setCampground] = useState(null);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampground = async () => {
            try {
                const response = await axios.get(`/api/campgrounds/${id}`);
                setCampground(response.data);
            } catch (err) {
                navigate('/campgrounds');
            }
        };

        fetchCampground();
    }, [id]);

    const backButton = () => {
        navigate('/campgrounds');
    };
    //calculate reviews rating
    const calculateAverageRating = () => {
        if (reviews.length === 0) return null;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };

    const averageRating = calculateAverageRating();

    return (
        <div className='relative min-h-screen bg-neutral dark:bg-neutral-900 overflow-hidden'>
            {/* Background Images */}
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
                <img src={bgDay} alt="Day background" className="h-full w-full object-cover blur-3xl brightness-115" />
            </div>
            <div className={`fixed inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                <img src={bgNight} alt="Night background" className="h-full w-full object-cover blur-3xl" />
            </div>

            {/* Campground Details */}
            <div className="relative mt-28 mx-auto px-4 md:px-12 lg:px-20 max-w-screen-2xl">
                <button onClick={backButton} className='fixed top-16 p-2 text-black dark:text-white bg-white/70 dark:bg-black/70 z-10 rounded-full'>
                    <IoMdArrowRoundBack />
                </button>

                {campground && (
                    <div className="bg-white/50 dark:bg-black/60 rounded-xl pt-4 md:pt-12 pb-12 px-4 md:px-16">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div>
                                <h1 className="text-2xl font-bold text-black dark:text-neutral-200">{campground.title}</h1>
                                {campground && (
                                    <div className='mt-4'>
                                        <CampSlider images={campground.images} />
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <div>
                                        <p className='text-neutral-600 dark:text-neutral-400'>Price: {campground.price.toFixed(2)}€</p>
                                    </div >
                                    <div>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            {averageRating ? (
                                                <>
                                                    {averageRating}
                                                    <span className="text-yellow-500 text-xl"> ★</span>
                                                </>
                                            ) : (
                                                'No reviews yet'
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-black dark:text-neutral-200 mt-8">Description</h2>
                                <p className='text-black dark:text-neutral-300 mt-4'>{campground.description}</p>
                                <h2 className="text-xl font-bold text-black dark:text-neutral-200 mt-8">Location</h2>
                                <p className='text-black dark:text-neutral-300 mt-4'>{campground.location}</p>
                                {campground.latitude && campground.longitude ? (
                                    <div className="mt-4 max-w-xl sm:mb-4">
                                        <MapboxMap lat={campground.latitude} lng={campground.longitude} />
                                    </div>
                                ) : (
                                    <p className="mt-2 text-black dark:text-white">Location data not available.</p>
                                )}
                            </div>
                            <div>
                                <Reviews campgroundId={id} setReviews={setReviews} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
};

export default CampgroundDetails;
