import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './routes/Home.jsx'
import Campgrounds from './routes/Campgrounds.jsx'
import ErrorPage from './routes/ErrorPage.jsx'
import CampgroundDetails from './routes/CampgroundDetails.jsx';
import NewCampground from './routes/NewCampground.jsx'
import UserCampgrounds from './routes/UserCampgrounds.jsx'
import Profile from './routes/Profile.jsx'
import App from './App.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "campgrounds",
        element: <Campgrounds />,
      },
      {
        path: 'campgrounds/new',
        element: <NewCampground />,
      },
      {
        path: 'campgrounds/:id',
        element: <CampgroundDetails />,
      },
      {
        path: 'userCampgrounds',
        element: <UserCampgrounds />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
