import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const LoginForm = ({ onClose }) => {
    const { setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const { data } = await axios.post('/api/login', {
                email,
                password
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                setUser(data);
                onClose();
                toast.success("Logged in!");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <form onSubmit={loginUser} className="space-y-4">
            <div>
                <label className="block text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder='Password'
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder='Password'
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                />
            </div>
            <button type="submit" className="bg-sky-500 text-white rounded-md p-2 w-full">Login</button>
        </form>
    );
};

export default LoginForm;
