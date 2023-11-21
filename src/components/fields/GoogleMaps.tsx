import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Polygon as GoogleMapsPolygon } from '@react-google-maps/api';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';

interface GoogleMapsProps {
    coordinates: Array<{ latitude: number; longitude: number }>;
    onCoordinatesChange: (newCoordinates: Array<{ latitude: number; longitude: number }>) => void;
    onPolygonChange: (isInside: boolean) => void;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ coordinates, onCoordinatesChange, onPolygonChange }) => {
    const { t } = useTranslation();
    const mapContainerStyle = {
        height: '20rem',
        width: '100%',
    };

    const [defaultPolygonCoords, setDefaultPolygonCoords] = useState<google.maps.LatLngLiteral[]>([]);
    const [isBeingEdited] = useState(false);
    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [isCoordinateInsidePolygon, setIsCoordinateInsidePolygon] = useState<boolean | null>(null);  
    const mapRef = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    useEffect(() => {
        setDefaultPolygonCoords(coordinates.map((coord) => ({ lat: coord.latitude, lng: coord.longitude })));
    }, [coordinates]);

    const calculatePolygonCenter = (polygonCoords: google.maps.LatLngLiteral[]) => {
        if (polygonCoords.length === 0) {
            return { lat: 0, lng: 0 };
        }
        const { length } = polygonCoords;
        const latSum = polygonCoords.reduce((sum, coord) => sum + coord.lat, 0);
        const lngSum = polygonCoords.reduce((sum, coord) => sum + coord.lng, 0);

        return { lat: latSum / length, lng: lngSum / length };
    };

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        setCenter(calculatePolygonCenter(defaultPolygonCoords));
    };

    const validateCoordinatesInsidePolygon = (
        coordinatesToValidate: google.maps.LatLngLiteral[]
      ): boolean => {
        if (polygonRef.current) {
          const polygon = polygonRef.current;
          const isInside = google.maps.geometry.poly.containsLocation(
            new google.maps.LatLng(coordinatesToValidate[0]),
            polygon
          );
          return isInside;
        }
        return false;
    };
      

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        event.latLng && (() => {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
    
            const clickCoords = event.latLng.toJSON();
            const latDiff = clickCoords.lat - center.lat;
            const lngDiff = clickCoords.lng - center.lng;
            const newPolygonCoords = defaultPolygonCoords.map((coord) => ({
                lat: coord.lat + latDiff,
                lng: coord.lng + lngDiff,
            }));

            const isInsidePolygon = validateCoordinatesInsidePolygon(newPolygonCoords);
            onPolygonChange(isInsidePolygon);
            setIsCoordinateInsidePolygon(isInsidePolygon);

    
            setDefaultPolygonCoords(newPolygonCoords);
            setCenter(calculatePolygonCenter(newPolygonCoords));
            onCoordinatesChange(newPolygonCoords.map((coord) => ({ latitude: coord.lat, longitude: coord.lng })));
        })();
    };    

    const handlePolygonAndVertexDragging = () => {
        if (polygonRef.current && !isBeingEdited) {
            const newPolygonCoords = polygonRef.current
                .getPath()
                .getArray()
                .map((coord) => ({
                    lat: coord.lat(),
                    lng: coord.lng(),
                }));
            setDefaultPolygonCoords(newPolygonCoords);
            setCenter(calculatePolygonCenter(newPolygonCoords));
            onCoordinatesChange(newPolygonCoords.map((coord) => ({ latitude: coord.lat, longitude: coord.lng })));
        }
    };

    const handlePolygonLoad = (polygon: google.maps.Polygon) => {
        polygonRef.current = polygon;
        google.maps.event.addListener(polygon, 'dragend', handlePolygonAndVertexDragging);  
        google.maps.event.addListener(polygon, 'mouseup', () => handlePolygonAndVertexDragging());      
    };

    const handlePolygonClick = (event: google.maps.PolyMouseEvent) => {
        if (event.latLng && polygonRef.current) {
            const polygon = polygonRef.current;
            const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
            const areaInSquareMeters = Math.abs(area);
    
            const title = `<b>${t(langKeys.coveragearea)}</b>`;
            const areaInfo = `<br>${t(langKeys.area)}: ${areaInSquareMeters.toFixed(2)} m²`;
    
            const contentString = title + areaInfo;
    
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }

            const infoWindow = new google.maps.InfoWindow({
                content: contentString,
                position: event.latLng,
            });
            infoWindowRef.current = infoWindow;
            infoWindow.open(mapRef.current);
        }
    };

    return (
        <div>
            <LoadScript googleMapsApiKey="AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14} onLoad={handleMapLoad} onClick={handleMapClick}>
                    {defaultPolygonCoords && (
                        <GoogleMapsPolygon
                            paths={defaultPolygonCoords}
                            onLoad={handlePolygonLoad}
                            onClick={handlePolygonClick}
                            editable={true}
                            draggable={true}
                            options={{
                                strokeColor: '#7721AD',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: '#7721AD',
                                fillOpacity: 0.35,
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};
export default GoogleMaps;