import React, { useState, useEffect, useRef } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Marker {
    lat: number, lng: number
}
interface MapProps {
    marker?: Marker | null;
    height: number;
    onClick?: (marker: Marker) => void
}
const MapLeaflet: React.FC<MapProps> = ({ marker, height, onClick }) => {
    const [marker1, setMarker] = useState<L.Marker | null>(null);
    const map = useRef<L.Map | null>(null);
    const firstLoad = React.useRef(true);

    useEffect(() => {
        map.current = L.map("map").setView([marker?.lat ?? -12.065991, marker?.lng ?? -77.064289], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map.current);

        if (onClick) {
            map.current.on("click", (e) => {
                onClick(e.latlng)
            });
        }
        if (marker) {
            const initialMarker = L.marker([marker?.lat, marker?.lng]).addTo(map.current);
            setMarker(initialMarker);
        }
        setTimeout(() => { 
            firstLoad.current = false;
        }, 100);
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            return;
        }
        if (marker && marker1) {
            marker1.setLatLng([marker.lat, marker.lng]);
        } else if (!marker1 && marker && map.current) {
            const initialMarker = L.marker([marker?.lat, marker?.lng]).addTo(map.current);
            setMarker(initialMarker);
        }
        if (marker && map.current) {
            map.current.setView([marker?.lat, marker?.lng], 14);
        }
    }, [marker])
    

    return <div id="map" style={{ height: height }}></div>;
}

export default MapLeaflet;