import React from "react";
import {GoogleMap,useLoadScript,Marker
} from "@react-google-maps/api";
import { apiUrls } from "common/constants";

import "@reach/combobox/styles.css";

const libraries = ["places"];
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function MapFixedLocation({longitude,latitude, height}) {
  
  const mapContainerStyle = {
    height: height || "400px",
    width: "100%",
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiUrls.APIKEY_GMAPS,
    libraries,
  });
  const [center, setcenter] = React.useState({
    lat: latitude,
    lng: longitude,
    time: new Date(),
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <div>"Error"</div>;
  if (!isLoaded) return <div>Loading...</div>;
  
  return (
    <div>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        <Marker
          key={`${latitude}-${longitude}`}
          position={{ lat: latitude, lng: longitude }}
        />
      </GoogleMap>	  
    </div>
  );
}
