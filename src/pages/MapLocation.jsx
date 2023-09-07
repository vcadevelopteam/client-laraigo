import React,{useEffect} from "react";
import {GoogleMap,useLoadScript,Marker
} from "@react-google-maps/api";
import { apiUrls } from "common/constants";

import "@reach/combobox/styles.css";

const libraries = ["places"];
const mapContainerStyle = {
  height: "400px",
  width: "100%",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Map({directionData,setDirectionData}) {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiUrls.APIKEY_GMAPS,
    libraries,
  });
  const [center, setcenter] = React.useState({
    lat: directionData.lat,
    lng: directionData.lng,
    time: new Date(),
  });
  const [marker, setMarker] = React.useState({
    lat: directionData.lat,
    lng: directionData.lng,
    time: new Date(),
  });
  
  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition)
    }else{
      console.error('Geolocation not supported by this browser')
    }
  }
  async function showPosition(position) {
    if(directionData.lat === 0 && directionData.lng === 0){
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setDirectionData((prev)=>({...prev, 
        lat: lat,
        lng: lng,
      }))
      
      setMarker({
        lat: lat,
        lng: lng,
        time: new Date(),
      });
      setcenter({
        lat: lat,
        lng: lng,
      });
  
      const urltosearch = `${apiUrls.GETGEOCODE}?lat=${lat}&lng=${lng}`;
      const response = await fetch(urltosearch, {
          method: 'GET',
      });
      if (response.ok) {
          try {
              const r = await response.json();
              if (r.status === "OK" && r.results && r.results instanceof Array && r.results.length > 0) {
                  cleanDataAddres(r.results[0].address_components);
                  setDirectionData((prev)=>({...prev, 
                    movedmarker: true,
                    searchLocation: r.results[0].formatted_address
                  }))
              }
          } catch (e) { }
      }
    }
  }
  
  function cleanDataAddres(r) {
    const street_number = r.find(x => x.types.includes("street_number"));
    const postal_code = r.find(x => x.types.includes("postal_code"));
    const route = r.find(x => x.types.includes("route"));
    const administrative_area_level_1 = r.find(x => x.types.includes("administrative_area_level_1"));
    const administrative_area_level_2 = r.find(x => x.types.includes("administrative_area_level_2"));
    const locality = r.find(x => x.types.includes("locality"));
    const sublocality_level_1 = r.find(x => x.types.includes("sublocality_level_1"));

    setDirectionData((prev)=>({...prev, 
      department: administrative_area_level_1 ? administrative_area_level_1.long_name : "", 
      province: administrative_area_level_2 ? administrative_area_level_2.long_name : "", 
      district: locality ? locality.long_name : "", 
      zone: sublocality_level_1 ? sublocality_level_1.long_name : "", 
      zipcode: postal_code ? postal_code.long_name : "",
      street: route ? route.long_name : "", 
      streetNumber: street_number ? street_number.long_name : "",
    }))
  }
  async function onMapClick(e){
    const urltosearch = `${apiUrls.GETGEOCODE}?lat=${e.latLng.lat()}&lng=${e.latLng.lng()}`;
    const response = await fetch(urltosearch, {
        method: 'GET',
    });
    if (response.ok) {
        try {
            const r = await response.json();
            if (r.status === "OK" && r.results && r.results instanceof Array && r.results.length > 0) {
                cleanDataAddres(r.results[0].address_components);
                setDirectionData((prev)=>({...prev, 
                  movedmarker: true,
                  searchLocation: r.results[0].formatted_address
                }))
            }
        } catch (e) { }
    }
    setDirectionData((prev)=>({...prev, 
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }))
    setMarker({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      });
  }

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
        onClick={onMapClick}
      >
        <Marker
          key={`${marker.lat}-${marker.lng}`}
          position={{ lat: marker.lat, lng: marker.lng }}
        />
      </GoogleMap>	  
    </div>
  );
}
