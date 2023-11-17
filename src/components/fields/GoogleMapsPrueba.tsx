import React from "react";
import { GoogleMap, useLoadScript, Polygon } from "@react-google-maps/api";

interface MapContainerProps {
    coordinates: {
    points: {
        lat: number;
        lng: number;
    }[];
    };
    onMapClick: (e: { lat: number; lng: number }) => void;
}

const mapStyles = {
    height: "20rem",
    width: "100%",
};

const GoogleMaps: React.FC<MapContainerProps> = ({ coordinates, onMapClick }) => {
    const defaultCenter = {
        lat: coordinates.points[0].lat,
        lng: coordinates.points[0].lng,
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w",
    });

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Google Maps...</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={15}
            center={defaultCenter}
            onClick={(e) => {
            if (e.latLng) {
                onMapClick({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                });
            }
            }}
        >
            <Polygon
            paths={coordinates.points}
            options={{
                fillColor: "#7721AD",
                fillOpacity: 0.4,
                strokeColor: "#7721AD",
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: true,
                draggable: true,
                editable: true,
                visible: true,
            }}
            />
        </GoogleMap>
    );
};

export default GoogleMaps;
