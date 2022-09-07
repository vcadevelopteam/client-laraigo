import React,{useEffect} from "react";
import {GoogleMap,useLoadScript,Marker
} from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode,getLatLng,
} from "use-places-autocomplete";
import {Combobox,ComboboxInput,ComboboxPopover,ComboboxList,ComboboxOption,} from "@reach/combobox";
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { getLocations } from 'store/getlocations/actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, TextField } from '@material-ui/core';
import { apiUrls } from "common/constants";

import "@reach/combobox/styles.css";
const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    searchLocationContainer: {
        height: '50vh', width: '100%'
    },
    searchLocationTitle:{
        color: "white",
        fontSize: "12px",
        textAlign: "center",
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor: "rgb(235, 0, 43)",
        paddingTop: "5px",
        paddingBottom: "5px",
        ['@media (min-width:600px)']: { // eslint-disable-line no-useless-computed-key
            fontSize: "18px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
        }
    },
    containersearch:{
        marginTop: "10px",
        maxWidth: "80%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    textlabel:{
        marginBottom: "10px",
        fontWeight: "bold",
        color: "rgb(235, 0, 43)",
    },
    formControl:{
        display: "block",
        width: "100%",
        height: "calc(1.5em + 0.75rem + 2px)",
        padding: "18.5px 14px",
        fontSize: "1rem",
        lineHeight: "1.5",
        color: "#495057",
        backgroundColor: "#fff",
        backgroundClip: "padding-box",
        border: "1px solid #ced4da",
        borderRadius: "0.25rem",
    },
    colxs12colmd6:{
        position: "relative",
        width: "100%",
        paddingRight: "15px",
        paddingLeft: "15px",
        ['@media (min-width:760px)']: { // eslint-disable-line no-useless-computed-key
            flex: "0 0 50%",
            maxWidth: "50%",
        }
    }
}));

const libraries = ["places"];
const mapContainerStyle = {
  height: "400px",
  width: "100%",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Map({setDirectionData}) {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4" /*"AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w"*/,
    libraries,
  });
  const [center, setcenter] = React.useState({
    lat: 0,
    lng: 0,
    time: new Date(),
  });
  const [marker, setMarker] = React.useState({
    lat: 0,
    lng: 0,
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
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
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
