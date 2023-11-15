"use strict"
import React, { useEffect } from "react";
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

import { Libraries,	useLoadScript} from "@react-google-maps/api";
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
		['@media (min-width:600px)']: {
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
		['@media (min-width:760px)']: {
			flex: "0 0 50%",
			maxWidth: "50%",
		}
	}
}));
const libraries: Libraries = ["places"];

export default function Map() {

	const { token }: any = useParams();
	const haveReference = React.useRef(token.split("-")[4] ?? "t");

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

	if (loadError) return <div>"Error"</div>;
	if (!isLoaded) return <div>Loading...</div>;

	return (
		<div>
			<MapLeaflet
				marker={marker}
				height={400}
				onClick={onMapClick}
			/>
		</div>
	);
}

