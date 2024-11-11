import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import bgDay from '../assets/bgday.jpeg';
import bgNight from '../assets/bgnight.jpeg';

const Home = () => {
    // Get the isDarkMode value from the Outlet context
    const { isDarkMode } = useOutletContext();

    return (
        <div className='relative bg-neutral min-h-screen dark:bg-neutral-900'>
            {/* Day Image */}
            <img
                src={bgDay}
                alt="Day background"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'
                    }`}
            />
            {/* Night Image */}
            <img
                src={bgNight}
                alt="Night background"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'
                    }`}
            />
            {/* Centered Hero Section */}
            <div className="container">
                <div className="flex items-center justify-center min-h-screen relative z-10">
                    <div className="text-center bg-white/40 dark:bg-black/40 backdrop-blur-sm p-4 sm:p-28 rounded-xl sm:rounded-full">
                        <h1 className="text-2xl font-bold text-black dark:text-white">Welcome to CampingRate</h1>
                        <p className="mt-6 text-md text-gray-900 dark:text-gray-300">
                            Discover the best campgrounds and outdoor experiences!
                        </p>
                        <div className="mt-8 mb-8 sm:mb-0">
                            <Link to="/campgrounds" className='font-medium hover:bg-white/50 dark:hover:bg-black/80 text-black dark:text-white py-2 px-4 border border-black dark:border-white rounded-lg'>View Campgrounds</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Home;
