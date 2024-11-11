import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

const TopCampgroundsSlider = ({ topCampgrounds }) => {
    const navigate = useNavigate();

    const settings = {
        navigation: true,
        pagination: { clickable: true },
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        modules: [Navigation, Pagination, Autoplay],
    };

    return (
        <Swiper {...settings} className="mySwiper h-[270px] sm:h-[320px]">
            {topCampgrounds.map((campground) => (
                <SwiperSlide
                    key={campground._id}
                    onClick={() => navigate(`/campgrounds/${campground._id}`)}
                    className="cursor-pointer text-center"
                >
                    <img
                        src={campground.images[0]?.url.replace('/upload/', '/upload/w_400/')}
                        alt={campground.title}
                        className="object-cover rounded-lg w-full h-[200px] sm:h-[250px]"
                    />
                    <div className="mt-2 text-black dark:text-white">
                        <h3 className="text-sm font-bold">{campground.title} - <span className='font-medium'>{campground.averageRating}</span> <span className='text-yellow-500'>★</span></h3>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default TopCampgroundsSlider;