import React,{useEffect} from "react";
import {GoogleMap,useLoadScript,Marker,InfoWindow,getDetails
} from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode,getLatLng,
} from "use-places-autocomplete";
import {Combobox,ComboboxInput,ComboboxPopover,ComboboxList,ComboboxOption,} from "@reach/combobox";
import { formatRelative } from "date-fns";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, TextField } from '@material-ui/core';
import {  FieldSelect } from 'components';

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
  height: "50vh",
  width: "100vw",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: -12.164043457451433,
  lng: -76.98795506382666,
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w",
    libraries,
  });
  const [directionData, setDirectionData] = React.useState({
    department: "",
    province: "",
    district: "",
    zone: "",
    zipcode: "",
    extra: "",
    street: "",
    streetNumber: "",
    movedmarker: false,
    generalAdress: ""
  });
  const [marker, setMarker] = React.useState({
    lat: -12.164043457451433,
    lng: -76.98795506382666,
    time: new Date(),
  });
  const [selected, setSelected] = React.useState(null);
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
    const urltosearch = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w`;
    const response = await fetch(urltosearch, {
        method: 'GET',
    });
    if (response.ok) {
        try {
            const r = await response.json();
            if (r.status === "OK" && r.results && r.results instanceof Array && r.results.length > 0) {
                console.log('ddd', r.results[0].formatted_address);
                cleanDataAddres(r.results[0].address_components);
                setDirectionData((prev)=>({...prev, 
                  movedmarker: true,
                  generalAdress: r.results[0].formatted_address
                }))
            }
        } catch (e) { }
    }
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
          onClick={() => {
            setSelected(marker);
          }}
        />
      </GoogleMap>	  
      <Search panTo={panTo} setMarker={setMarker} directionData={directionData} setDirectionData={setDirectionData} cleanDataAddres={cleanDataAddres}/>
    </div>
  );
}

function Search({ panTo,setMarker,directionData, setDirectionData, cleanDataAddres}) {
    const classes = useStyles();
    const { t } = useTranslation();
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
		location: { lat: () => 43.6532, lng: () => -79.3832 },
		radius: 100 * 1000,
		},
	});

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

	const handleInput = (e) => {
    console.log(e.target.value)
		setValue(e.target.value);
	};
  useEffect(() => {
    if(directionData.movedmarker){
      setDirectionData((prev)=>({...prev, 
        movedmarker: false
      }))
      setValue(directionData.generalAdress)
    }
  }, [directionData.movedmarker]);
	const handleSelect = async (address) => {
		setValue(address, false);
		clearSuggestions();
		try {
		const results = await getGeocode({ address });
		const { lat, lng } = await getLatLng(results[0]);
    if(results){
      cleanDataAddres(results[0].address_components)
    }
    setMarker({
      lat: lat,
      lng: lng,
      time: new Date(),
    });
		panTo({ lat, lng });
		} catch (error) {
		console.log("😱 Error: ", error);
		}
	};

  	return (
	  
	<div style={{width:"100%"}}>
		
		<div className={classes.searchLocationTitle}>{t(langKeys.searchLocationTitle)}</div>
		<div className="search">
			
		<div className={classes.containersearch}>
			<input type="hidden" id="tokenlocation" value='@ViewData["token"]'></input>
			<div className={classes.textlabel}>{t(langKeys.firstDataLocation)}</div>

			<Combobox onSelect={handleSelect} style={{width:"100%"}}>
        <ComboboxInput
          value={value}
          className={classes.formControl}
          onChange={handleInput}
          disabled={!ready}
          placeholder={t(langKeys.searchyourlocation)}
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
            </ComboboxList>
        </ComboboxPopover>
		</Combobox>

			<div className={classes.textlabel}>{t(langKeys.secondDataLocation)}</div>
			
			<div className="row-zyx" style={{ marginBottom: "0px"}}>
				<TextField label={t(langKeys.department)} variant="outlined" className="col-6" value={directionData.department} onChange={(e)=>{setDirectionData((prev)=>({...prev, department: e.target.value}))}}/>
				<TextField label={t(langKeys.province)} variant="outlined" className="col-6" value={directionData.province} onChange={(e)=>{setDirectionData((prev)=>({...prev, province: e.target.value}))}}/>
			</div>
			<div className="row-zyx" style={{ marginBottom: "0px"}}>
				<TextField label={t(langKeys.district)} variant="outlined" className="col-6" value={directionData.district} onChange={(e)=>{setDirectionData((prev)=>({...prev, district: e.target.value}))}}/>
				<TextField label={t(langKeys.zone)} variant="outlined" className="col-6" value={directionData.zone} onChange={(e)=>{setDirectionData((prev)=>({...prev, zone: e.target.value}))}}/>
			</div>
			<div className="row-zyx" style={{ marginBottom: "0px"}}>
				<TextField label={t(langKeys.street)} variant="outlined" className="col-6" value={directionData.street} onChange={(e)=>{setDirectionData((prev)=>({...prev, street: e.target.value}))}}/>
				<TextField label={`N° ${t(langKeys.street)}`} variant="outlined" className="col-6" value={directionData.streetNumber} onChange={(e)=>{setDirectionData((prev)=>({...prev, streetNumber: e.target.value}))}}/>
			</div>
			<div className="row-zyx" style={{ marginBottom: "0px"}}>
				<TextField label={t(langKeys.postalcode)} variant="outlined" className="col-6" value={directionData.zipcode} onChange={(e)=>{setDirectionData((prev)=>({...prev, zipcode: e.target.value}))}}/>
			</div>
			<div className="row-zyx" style={{ marginBottom: "0px"}}>
				<TextField label={t(langKeys.extraInformation)} multiline variant="outlined" style={{width:"100%"}} maxRows={4}  value={directionData.extra} onChange={(e)=>{setDirectionData((prev)=>({...prev, extra: e.target.value}))}}/>
			</div>
			<div style={{ marginLeft: "auto", paddingTop: "10px", marginRight: "auto", display: "block", width: "10%" }}>
				<Button
					variant="contained"
					type="button"
					color="primary"
					style={{ backgroundColor: "#eb002b" }}
				>{t(langKeys.send)}</Button>
			</div>
		</div>
		</div>
	</div>
  );
}
