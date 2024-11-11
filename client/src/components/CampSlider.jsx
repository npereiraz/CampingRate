import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CampSlider = ({ images }) => {
    const settings = {
        navigation: true,
        pagination: {
            clickable: true,
        },
        modules: [Navigation, Pagination],
    };

    return (
        <Swiper {...settings} className="h-[200px] sm:h-[300px]">
            {images.map((img, index) => (
                <SwiperSlide key={index}>
                    <img
                        src={img.url}
                        alt={img.filename}
                        className="object-cover rounded-lg w-full h-full"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CampSlider;
