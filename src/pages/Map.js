import React from "react";
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
  const [marker, setMarker] = React.useState({
    lat: -12.164043457451433,
    lng: -76.98795506382666,
    time: new Date(),
  });
  const [selected, setSelected] = React.useState(null);
  const [directionData, setDirectionData] = React.useState({
    department: "",
    province: "",
    district: "",
    zone: "",
    postalcode: "",
    extra: ""
  });

  const onMapClick = React.useCallback((e) => {
    setMarker({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      });
  }, []);

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
      <Search panTo={panTo} setMarker={setMarker} />
    </div>
  );
}

function Search({ panTo,setMarker}) {
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
		setValue(e.target.value);
	};
  
  const [directionData, setDirectionData] = React.useState({
    department: "",
    province: "",
    district: "",
    zone: "",
    postalcode: "",
    extra: "",
    street: "",
    streetnumber: ""
  });

	const handleSelect = async (address) => {
		setValue(address, false);
		clearSuggestions();
    /*setDirectionData((prev)=>({...prev,
      department: "",
      province: "",
      district: "",
    }))*/
		try {
		const results = await getGeocode({ address });
    let dpd = {
      department: "",
      province: "",
      district: "",
      zone: "",
      postalcode: "",
    }
		const { lat, lng } = await getLatLng(results[0]);
    if(results){
      console.log(results)
      results[0].address_components.forEach(x=>{
        if(x.types.includes("administrative_area_level_1")){
          dpd.department = x.long_name
        }
        if(x.types.includes("administrative_area_level_2")){
          dpd.province = x.long_name
        }
        if(x.types.includes("locality")){
          dpd.district = x.long_name
        }
        if(x.types.includes("sublocality")){
          dpd.zone = x.long_name
        }
        if(x.types.includes("postal_code")){
          dpd.postalcode = x.long_name
        }
        if(x.types.includes("street_number")){
          dpd.streetnumber = x.long_name
        }
        if(x.types.includes("route")){
          dpd.street = x.long_name
        }
      })
      setDirectionData((prev)=>({...prev, department: dpd.department, province: dpd.province, district: dpd.district, zone:dpd.zone, postalcode: dpd.postalcode,
      street: dpd.street, streetnumber: dpd.streetnumber}))
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
				<TextField label={`N° ${t(langKeys.street)}`} variant="outlined" className="col-6" value={directionData.streetnumber} onChange={(e)=>{setDirectionData((prev)=>({...prev, streetnumber: e.target.value}))}}/>
			</div>
			<div className="row-zyx" style={{ marginBottom: "0px"}}>
				<TextField label={t(langKeys.postalcode)} variant="outlined" className="col-6" value={directionData.postalcode} onChange={(e)=>{setDirectionData((prev)=>({...prev, postalcode: e.target.value}))}}/>
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
