import { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const CreateForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const { setUser } = useContext(UserContext);

    const registerUser = async (e) => {
        e.preventDefault();
        const { username, email, password } = formData;

        try {
            const { data } = await axios.post('/api/register', {
                username,
                email,
                password
            });

            if (data.error) {
                toast.error(data.error);
            } else {
                const loginResponse = await axios.post('/api/login', {
                    email,
                    password
                });

                if (loginResponse.data.error) {
                    toast.error(loginResponse.data.error);
                } else {
                    setUser(loginResponse.data);
                    toast.success('Created account successfully!');
                    onClose();
                }
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong during registration. Please try again.');
        }
    };

    return (
        <form className="space-y-4" onSubmit={registerUser}>
            <div>
                <label className="block text-black dark:text-gray-200">Username</label>
                <input
                    name="username"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                    placeholder='Username'
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className="block text-black dark:text-gray-200">Email</label>
                <input
                    name="email"
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                    placeholder='Email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className="block text-black dark:text-gray-200">Password</label>
                <input
                    name="password"
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
                    placeholder='Password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </div>
            <div className="flex justify-center">
                <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-md w-full">
                    Register
                </button>
            </div>
        </form>
    );
}

export default CreateForm;
