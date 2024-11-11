import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSunnyOutline } from "react-icons/io5";
import { AiOutlineMoon } from "react-icons/ai";
import { UserContext } from '../../context/userContext';
import ModalUser from './ModalUser';
import axios from 'axios';
import { toast } from 'react-hot-toast'

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
    const { user, setUser } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Toggle navbar menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Toggle profile dropdown
    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            setUser(null);
            toast.success('Logged out');
            navigate('/campgrounds');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <nav className='fixed w-full p-3 bg-white/80 backdrop-blur-sm z-[99] border-b border-gray-200 dark:bg-black/60 dark:border-black'>
                <div className="mx-auto flex items-center justify-between max-w-7xl">
                    <div className='text-black dark:text-white text-2xl font-bold'>CampingRate</div>

                    {/* Navbar links */}
                    <div className='ml-auto flex items-center space-x-4'>
                        <ul className='hidden md:flex space-x-4'>
                            <li><Link to="/" className='font-medium text-black dark:text-slate-200 hover:underline underline-offset-4 decoration-sky-500'>Home</Link></li>
                            <li><Link to="/campgrounds" className='font-medium text-black dark:text-slate-200 hover:underline underline-offset-4 decoration-sky-500'>Campgrounds</Link></li>

                            {/* Profile and dropdown */}
                            {!!user && (
                                <li className='relative font-medium text-black dark:text-slate-200'>
                                    <button onClick={toggleProfileMenu} className='hover:underline underline-offset-4 decoration-sky-500 no-transition'>Profile</button>
                                    {isProfileMenuOpen && (
                                        <ul className="absolute right-0 translate-x-12 mt-2 w-40 bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-lg py-2 z-50">
                                            <li><Link to="/campgrounds/new" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/70 text-sm text-black dark:text-slate-200" onClick={() => setIsProfileMenuOpen(false)}>Add Campground</Link></li>
                                            <li><Link to="/userCampgrounds" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/70 text-sm text-black dark:text-slate-200" onClick={() => setIsProfileMenuOpen(false)}>My Campgrounds</Link></li>
                                        </ul>
                                    )}
                                </li>
                            )}

                            <li className='font-medium text-black dark:text-slate-200'>
                                {user ? (
                                    <button onClick={logout} className='hover:underline underline-offset-4 decoration-sky-500 no-transition'>Logout</button>
                                ) : (
                                    <button onClick={() => setIsModalOpen(true)} className='hover:underline underline-offset-4 decoration-sky-500 no-transition'>Login</button>
                                )}
                            </li>
                        </ul>

                        {/* Dark mode toggle */}
                        <ul className='flex space-x-4'>
                            {isDarkMode ? (
                                <li><button onClick={toggleDarkMode}><IoSunnyOutline className='w-6 h-6 text-black dark:text-slate-200 no-transition' /></button></li>
                            ) : (
                                <li><button onClick={toggleDarkMode}><AiOutlineMoon className='w-6 h-6 text-black dark:text-slate-200 no-transition' /></button></li>
                            )}
                        </ul>
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className='text-black dark:text-neutral-200 no-transition'>
                            <svg fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} viewBox='0 0 24 24' className='w-6 h-6'>
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80' : 'max-h-0'}`}>
                    <ul className='flex flex-col'>
                        <li className='ml-2 py-1 text-black dark:text-neutral-100 no-transition'><Link to="/" onClick={toggleMenu}>Home</Link></li>
                        <li className='ml-2 py-1 text-black dark:text-neutral-100 no-transition'><Link to="/campgrounds" onClick={toggleMenu}>Campgrounds</Link></li>
                        {!!user && (
                            <ul>
                                <li className='ml-2 py-1 text-black dark:text-neutral-100'>Profile</li>
                                <li className='ml-4 py-1 text-black dark:text-neutral-100 no-transition'><Link to="/campgrounds/new" onClick={toggleMenu}>Add Campground</Link></li>
                                <li className='ml-4 py-1 text-black dark:text-neutral-100 no-transition'><Link to="/userCampgrounds" onClick={toggleMenu}>My Campgrounds</Link></li>
                            </ul>
                        )}
                        <li className='ml-2 py-1 text-black dark:text-neutral-100 no-transition'>
                            {user ? (
                                <button onClick={() => {
                                    toggleMenu();
                                    logout();
                                }}>Logout</button>
                            ) : (
                                <button onClick={() => {
                                    setIsModalOpen(true);
                                    toggleMenu();
                                    openModal();
                                }}>Login</button>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Modal component */}
            <ModalUser isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Navbar;
