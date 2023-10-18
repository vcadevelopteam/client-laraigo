import React, { useState, useEffect, useRef } from 'react';
import "leaflet/dist/leaflet.css";
import L, {icon} from "leaflet";
import { uuidv4 } from 'common/helpers';

const ICON = icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
})

interface Marker {
    lat: number, lng: number
}
interface MapProps {
    marker?: Marker | null;
    height: number;
    onClick?: (marker: Marker) => void;
    id?: string;
}
const MapLeaflet: React.FC<MapProps> = ({ marker, height, onClick, id = uuidv4() }) => {
    const [marker1, setMarker] = useState<L.Marker | null>(null);
    const map = useRef<L.Map | null>(null);
    const firstLoad = React.useRef(true);

    const initMarker = (marker: Marker) => {
        if (map.current) {
            const new_marker = L.marker([marker?.lat, marker?.lng]).addTo(map.current);
            new_marker.setIcon(ICON)
            setMarker(new_marker);
        }
    }

    useEffect(() => {
        map.current = L.map(`map${id}`).setView([marker?.lat ?? -12.065991, marker?.lng ?? -77.064289], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map.current);

        if (onClick) {
            map.current.on("click", (e: any) => {
                onClick(e.latlng)
            });
        }
        if (marker)  initMarker(marker)
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
            marker1.setIcon(ICON)
        } else if (!marker1 && marker && map.current) {
            initMarker(marker)
        }
        if (marker && map.current) {
            map.current.setView([marker?.lat, marker?.lng], 14);
        }
    }, [marker])
    

    return (
        <div id={`map${id}`} style={{ height: height }}></div>
    )
}

export default MapLeaflet;