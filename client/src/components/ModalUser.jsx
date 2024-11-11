import React, { useState, useEffect, useContext } from 'react';
import LoginForm from './LoginForm';
import CreateForm from './CreateForm';
import { UserContext } from '../../context/userContext';
import axios from 'axios';

const ModalUser = ({ isOpen, onClose }) => {
    const { setUser } = useContext(UserContext);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
        } else {
            setIsMounted(false);
        }
        setError(null);
    }, [isOpen]);

    if (!isOpen && !isMounted) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password }, { withCredentials: true });
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setUser(response.data);
                onClose();
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <div
                className={`relative bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-96 transition-all duration-300 ease-in-out max-h-[90vh] overflow-y-auto transform ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
                    }`}
                style={{ transitionProperty: 'transform, opacity' }}
            >
                <button
                    className="text-2xl absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400"
                    onClick={onClose}
                >
                    &times;
                </button>

                {isLoginForm ? (
                    <div className='container'>
                        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Login</h2>
                        <LoginForm onClose={onClose} handleLogin={handleLogin} error={error} /> {/* Pass error as prop */}
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <button className="text-blue-500 hover:underline" onClick={toggleForm}>
                                Create an account
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className='container'>
                        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Create an Account</h2>
                        <CreateForm onClose={onClose} />
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <button className="text-blue-500 hover:underline" onClick={toggleForm}>
                                Login
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalUser;
