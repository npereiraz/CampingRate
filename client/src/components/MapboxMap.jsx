import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Setting the Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxMap = ({ lat, lng }) => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: 15,
        });

        // Add marker when map is fully loaded
        map.on('load', () => {
            new mapboxgl.Marker({ draggable: false })
                .setLngLat([lng, lat])
                .addTo(map);
        });

        return () => map.remove();
    }, [lat, lng]);

    return <div ref={mapContainerRef} className="h-72 w-full" />;
};

export default MapboxMap;
