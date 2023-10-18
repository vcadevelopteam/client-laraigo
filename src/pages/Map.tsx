"use strict"
import React, { useEffect } from "react";
import usePlacesAutocomplete, {
	getGeocode, getLatLng,
} from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption, } from "@reach/combobox";
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { getLocations } from 'store/getlocations/actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, TextField } from '@material-ui/core';
import {
	Libraries,
	useLoadScript
} from "@react-google-maps/api";
import { apiUrls } from "common/constants";
import MapLeaflet from "components/fields/MapLeaflet";
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
	searchLocationTitle: {
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
	containersearch: {
		marginTop: "10px",
		maxWidth: "80%",
		marginLeft: "auto",
		marginRight: "auto",
	},
	textlabel: {
		marginBottom: "10px",
		fontWeight: "bold",
		color: "rgb(235, 0, 43)",
	},
	formControl: {
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
	colxs12colmd6: {
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
const libraries: Libraries = ["places"];

export default function Map() {

	const { token }: any = useParams();
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: apiUrls.APIKEY_GMAPS + "",
		libraries,
	});
	const [directionData, setDirectionData] = React.useState({
		department: "",
		province: "",
		district: "",
		postalcode: "",
		zone: "",
		zipcode: "",
		reference: "",
		street: "",
		streetNumber: "",
		movedmarker: false,
		searchLocation: "",
		token: token
	});
	const [center, setcenter] = React.useState({
		lat: 0,
		lng: 0,
	});
	const [marker, setMarker] = React.useState({
		lat: 0,
		lng: 0,
	});

	useEffect(() => {
		getLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition)
		} else {
			console.error('Geolocation not supported by this browser')
		}
	}
	async function showPosition(position: any) {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;
		setMarker({
			lat: lat,
			lng: lng,
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
					setDirectionData((prev) => ({
						...prev,
						movedmarker: true,
						searchLocation: r.results[0].formatted_address
					}))
				}
			} catch (e) { }
		}
	}

	function cleanDataAddres(r: any[]) {
		const street_number = r.find(x => x.types.includes("street_number"));
		const postal_code = r.find(x => x.types.includes("postal_code"));
		const route = r.find(x => x.types.includes("route"));
		const administrative_area_level_1 = r.find(x => x.types.includes("administrative_area_level_1"));
		const administrative_area_level_2 = r.find(x => x.types.includes("administrative_area_level_2"));
		const locality = r.find(x => x.types.includes("locality"));
		const sublocality_level_1 = r.find(x => x.types.includes("sublocality_level_1"));
		const postalcode = r.find(x => x.types.includes("postal_code"));

		setDirectionData((prev) => ({
			...prev,
			department: administrative_area_level_1 ? administrative_area_level_1.long_name : "",
			province: administrative_area_level_2 ? administrative_area_level_2.long_name : "",
			district: locality ? locality.long_name : "",
			postalcode: postalcode ? postalcode.long_name : "",
			zone: sublocality_level_1 ? sublocality_level_1.long_name : "",
			zipcode: postal_code ? postal_code.long_name : "",
			street: route ? route.long_name : "",
			streetNumber: street_number ? street_number.long_name : "",
		}))
	}
	async function onMapClick(e: any) {
		const urltosearch = `${apiUrls.GETGEOCODE}?lat=${e.lat}&lng=${e.lng}`;
		const response = await fetch(urltosearch, {
			method: 'GET',
		});
		if (response.ok) {
			try {
				const r = await response.json();
				if (r.status === "OK" && r.results && r.results instanceof Array && r.results.length > 0) {
					cleanDataAddres(r.results[0].address_components);
					setDirectionData((prev) => ({
						...prev,
						movedmarker: true,
						searchLocation: r.results[0].formatted_address
					}))
				}
			} catch (e) { }
		}
		setMarker({
			lat: e.lat,
			lng: e.lng,
		});
	}

	// const mapRef = React.useRef();
	// const onMapLoad = React.useCallback((map) => {
	// 	mapRef.current = map;
	// }, []);
	// const panTo = React.useCallback(({ lat, lng }) => {
	// 	mapRef.current.panTo({ lat, lng });
	// 	mapRef.current.setZoom(14);
	// }, []);

	if (loadError) return <div>"Error"</div>;
	if (!isLoaded) return <div>Loading...</div>;

	return (
		<div>
			<MapLeaflet
				marker={marker}
				height={400}
				onClick={onMapClick}
			/>
			<Search setMarker={setMarker} directionData={directionData} setDirectionData={setDirectionData} cleanDataAddres={cleanDataAddres} marker={marker} />
		</div>
	);
}

function Search({ setMarker, directionData, setDirectionData, cleanDataAddres, marker } : any) {
	const classes = useStyles();
	const { t } = useTranslation();
	const getlocationdata = useSelector(state => state.getlocations);
	const dispatch = useDispatch();

	async function sendData() {
		setdisabled(true)
		dispatch(getLocations(
			{
				lon: marker.lng,
				lat: marker.lat,
				...directionData
			}))
	}
	useEffect(() => {
		if (getlocationdata.getLocations.success) {
			window.close();
		}
	}, [getlocationdata]);

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		debounce: 1000,
		requestOptions: {
			location: new window.google.maps.LatLng(43.6532, -79.3832),
			radius: 100 * 1000,
		},
	});
	const [disabled, setdisabled] = React.useState(false);

	// https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

	const handleInput = (e: any) => {
		setValue(e.target.value);
	};
	useEffect(() => {
		if (directionData.movedmarker) {
			setDirectionData((prev: any) => ({
				...prev,
				movedmarker: false
			}))
			setValue(directionData.searchLocation)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [directionData.movedmarker]);
	const handleSelect = async (address: any) => {
		setValue(address, false);

		setDirectionData((prev: any) => ({
			...prev,
			searchLocation: address
		}))
		clearSuggestions();
		try {
			const results = await getGeocode({ address });
			const { lat, lng } = await getLatLng(results[0]);
			if (results) {
				cleanDataAddres(results[0].address_components)
			}
			setMarker({
				lat: lat,
				lng: lng,
			});
			// panTo({ lat, lng });
		} catch (error) {
			console.warn("😱 Error: ", error);
		}
	};

	return (

		<div style={{ width: "100%" }}>

			<div className={classes.searchLocationTitle}>{t(langKeys.searchLocationTitle)}</div>
			<div className="search">

				<div className={classes.containersearch}>
					<div className={classes.textlabel}>{t(langKeys.firstDataLocation)}</div>

					<Combobox onSelect={handleSelect} style={{ width: "100%" }}>
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
									data.map(({ id, description }: any) => (
										<ComboboxOption key={id} value={description} />
									))}
							</ComboboxList>
						</ComboboxPopover>
					</Combobox>

					<div className={classes.textlabel}>{t(langKeys.secondDataLocation)}</div>

					<div className="row-zyx" style={{ marginBottom: "0px" }}>
						<TextField label={t(langKeys.department)} variant="outlined" size="small" className="col-6" value={directionData.department} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, department: e.target.value })) }} />
						<TextField label={t(langKeys.province)} variant="outlined" size="small" className="col-6" value={directionData.province} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, province: e.target.value })) }} />
					</div>
					<div className="row-zyx" style={{ marginBottom: "0px" }}>
						<TextField label={t(langKeys.district)} variant="outlined" size="small" className="col-6" value={directionData.district} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, district: e.target.value })) }} />
						<TextField label={t(langKeys.zone)} variant="outlined" size="small" className="col-6" value={directionData.zone} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, zone: e.target.value })) }} />
					</div>
					<div className="row-zyx" style={{ marginBottom: "0px" }}>
						<TextField label={t(langKeys.street)} variant="outlined" size="small" className="col-6" value={directionData.street} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, street: e.target.value })) }} />
						<TextField label={`N° ${t(langKeys.street)}`} variant="outlined" size="small" className="col-6" value={directionData.streetNumber} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, streetNumber: e.target.value })) }} />
					</div>
					<div className="row-zyx" style={{ marginBottom: "0px" }}>
						<TextField label={t(langKeys.postalcode)} variant="outlined" size="small" className="col-6" value={directionData.zipcode} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, zipcode: e.target.value })) }} />
					</div>
					<div className="row-zyx" style={{ marginBottom: "0px" }}>
						<TextField label={t(langKeys.extraInformation)} multiline variant="outlined" size="small" style={{ width: "100%" }} maxRows={4} value={directionData.reference} onChange={(e) => { setDirectionData((prev: any) => ({ ...prev, reference: e.target.value })) }} />
					</div>
					<div style={{ marginLeft: "auto", paddingTop: "10px", marginRight: "auto", display: "block", width: "10%" }}>
						<Button
							variant="contained"
							type="button"
							color="primary"
							onClick={() => sendData()}
							disabled={disabled}
							style={{ backgroundColor: "#eb002b" }}
						>{t(langKeys.send)}</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
