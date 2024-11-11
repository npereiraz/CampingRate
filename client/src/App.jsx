// App.js
import './App.css';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('isDarkMode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <UserContextProvider>
      <div className={isDarkMode ? 'dark' : ''}>
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <Toaster position='top-center' toastOptions={{ duration: 2000 }} />
        <Outlet context={{ isDarkMode }} />
      </div>
    </UserContextProvider>
  );
}

export default App;
