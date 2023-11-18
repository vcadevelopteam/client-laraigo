import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';

const GoogleMaps = () => {
  const mapContainerStyle = {
    height: '20rem',
    width: '100%',
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const defaultPolygonCoords = [
    { lat: 37.7749, lng: -122.4194 },
    { lat: 37.7749, lng: -122.4198 },
    { lat: 37.7752, lng: -122.4198 },
    { lat: 37.7752, lng: -122.4194 },
  ];

  const [polygonCoords, setPolygonCoords] = useState(defaultPolygonCoords);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  const updatePolygonCoords = () => {
    if (polygon) {
      const updatedCoords = polygon
        .getPath()
        .getArray()
        .map((coord) => {
          return { lat: coord.lat(), lng: coord.lng() };
        });
      console.log('Polygon Updated:', updatedCoords);
      setPolygonCoords(updatedCoords);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>      
        <LoadScript googleMapsApiKey="AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
          onLoad={(map) => {
            setMap(map);

            const newPolygon = new window.google.maps.Polygon({
              paths: defaultPolygonCoords,
              editable: true,
              draggable: true,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
            });

            newPolygon.setMap(map);
            setPolygon(newPolygon);

            window.google.maps.event.addListener(newPolygon.getPath(), 'set_at', updatePolygonCoords);
            window.google.maps.event.addListener(newPolygon, 'dragend', updatePolygonCoords);
          }}
        >
          {polygon && (
            <Polygon
              paths={polygonCoords}
              editable
              draggable
              options={{
                strokeColor: '#7721AD',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#7721AD',
                fillOpacity: 0.35,
              }}
              onDragEnd={updatePolygonCoords}
              onMouseUp={updatePolygonCoords}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMaps;
