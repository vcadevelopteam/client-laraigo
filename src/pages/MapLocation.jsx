import React, { useEffect } from "react";
import { apiUrls } from "common/constants";
import MapLeaflet from "components/fields/MapLeaflet";

export default function MapLocation({ directionData, setDirectionData }) {
	const [marker, setMarker] = React.useState({
		lat: directionData.lat,
		lng: directionData.lng,
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
	async function showPosition(position) {
		if (directionData.lat === 0 && directionData.lng === 0) {
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;
			setDirectionData((prev) => ({
				...prev,
				lat: lat,
				lng: lng,
			}))

			setMarker({
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
	}

	function cleanDataAddres(r) {
		debugger
		const street_number = r.find(x => x.types.includes("street_number"));
		const postal_code = r.find(x => x.types.includes("postal_code"));
		const route = r.find(x => x.types.includes("route"));
		const administrative_area_level_1 = r.find(x => x.types.includes("administrative_area_level_1"));
		const administrative_area_level_2 = r.find(x => x.types.includes("administrative_area_level_2"));
		const locality = r.find(x => x.types.includes("locality"));
		const sublocality_level_1 = r.find(x => x.types.includes("sublocality_level_1"));
		const country = r.find(x => x.types.includes("country"));

		setDirectionData((prev) => ({
			...prev,
			department: administrative_area_level_1 ? administrative_area_level_1.long_name : "",
			province: administrative_area_level_2 ? administrative_area_level_2.long_name : "",
			district: locality ? locality.long_name : "",
			zone: sublocality_level_1 ? sublocality_level_1.long_name : "",
			zipcode: postal_code ? postal_code.long_name : "",
			street: route ? route.long_name : "",
			country: country ? country.long_name : "",
			streetNumber: street_number ? street_number.long_name : "",
		}))
	}

	async function onMapClick(e) {
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
		setDirectionData((prev) => ({
			...prev,
			lat: e.lat,
			lng: e.lng,
		}))
		setMarker({
			lat: e.lat,
			lng: e.lng,
		});
	}

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
