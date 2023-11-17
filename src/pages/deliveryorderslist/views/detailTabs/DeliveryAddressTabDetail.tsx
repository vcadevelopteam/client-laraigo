import React, { useState, useEffect } from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { FieldEdit, TitleDetail } from "components";
import { Typography } from "@material-ui/core";
import GoogleMaps from "components/fields/GoogleMapsPrueba";

const default_latitude1 = -12.00000000000001; const default_longitude1 = -77.00000000000001; //coo sup izq
const default_latitude2 = -12.00200000000001; const default_longitude2 = -77.00000000000001; //coo sup der
const default_latitude3 = -12.00200000000001; const default_longitude3 = -77.00200000000001; //coo inf izq
const default_latitude4 = -12.00000000000001; const default_longitude4 = -77.00200000000001; //coo inf der
const fixedDifference = 0.002;

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    subtittle: {
        textAlign: "left",
        padding: "2rem 2rem 2rem 0",
        fontSize: "1.3rem",
    }, 
    maptext: {
        textAlign: "center",
        padding: "1rem 0rem 3rem 0",
        fontSize: "1rem",
        color: "gray",
    },
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors;
}

interface Coordinates {
    points: { lat: number; lng: number }[];
}

const DeliveryAddressTabDetail: React.FC<InventoryTabDetailProps> = ({ row, setValue, getValues, errors}) => {
    const { t } = useTranslation();
    const classes = useStyles();
 

    const [latitude1, setLatitude1] = useState<number | undefined>(undefined);
    const [longitude1, setLongitude1] = useState<number | undefined>(undefined);
    const [latitude2, setLatitude2] = useState<number | undefined>(undefined);
    const [longitude2, setLongitude2] = useState<number | undefined>(undefined);
    const [latitude3, setLatitude3] = useState<number | undefined>(undefined);
    const [longitude3, setLongitude3] = useState<number | undefined>(undefined);
    const [latitude4, setLatitude4] = useState<number | undefined>(undefined);
    const [longitude4, setLongitude4] = useState<number | undefined>(undefined);

    const [googleMapsCoordinates, setGoogleMapsCoordinates] = useState<Coordinates>({
        points: [
            { lat: default_latitude1 || 0, lng: default_longitude1 || 0 },
            { lat: default_latitude2 || 0, lng: default_longitude2 || 0 },
            { lat: default_latitude3 || 0, lng: default_longitude3 || 0 },
            { lat: default_latitude4 || 0, lng: default_longitude4 || 0 },
        ],
    });

    const handleMapClick = (e: { lat: number; lng: number }) => {

        setLatitude1(e.lat);
        setLongitude1(e.lng);

        setLatitude2(e.lat + fixedDifference);
        setLongitude2(e.lng);

        setLatitude3(e.lat + fixedDifference);
        setLongitude3(e.lng + fixedDifference);

        setLatitude4(e.lat);
        setLongitude4(e.lng + fixedDifference);

        setGoogleMapsCoordinates({
        points: [
            { lat: e.lat, lng: e.lng },
            { lat: e.lat + fixedDifference, lng: e.lng },
            { lat: e.lat + fixedDifference, lng: e.lng + fixedDifference },
            { lat: e.lat, lng: e.lng + fixedDifference },
        ],
        });
    };
        
    useEffect(() => {
        setLatitude1(default_latitude1);
        setLongitude1(default_longitude1);
        setLatitude2(default_latitude2);
        setLongitude2(default_longitude2);
        setLatitude3(default_latitude3);
        setLongitude3(default_longitude3);
        setLatitude4(default_latitude4);
        setLongitude4(default_longitude4);
    }, []);


    return (
    <div className={classes.containerDetail}>
        <div className="row-zyx">
            <TitleDetail title={t(langKeys.deliveryaddress)} />
        </div>

        <Typography className={classes.subtittle}>
            {t(langKeys.geolocation)}
        </Typography>

        <div className="row-zyx" style={{ paddingBottom: "1rem" }}>
            <FieldEdit
                label={`${t(langKeys.latitude)}: Coor 1`}
                type="number"
                valueDefault={latitude1?.toString() || ""}
                onChange={(value) => setLatitude1(Number(value))}
                className="col-6"
            />
            <FieldEdit
                label={`${t(langKeys.longitude)}: Coor 1`}
                type="number"
                valueDefault={longitude1?.toString() || ""}
                onChange={(value) => setLongitude1(Number(value))}
                className="col-6"
            />
            <FieldEdit
                label={`${t(langKeys.latitude)}: Coor 2`}
                type="number"
                valueDefault={latitude2?.toString() || ""}
                onChange={(value) => setLatitude2(Number(value))}
                className="col-6"
            />
            <FieldEdit
                label={`${t(langKeys.longitude)}: Coor 2`}
                type="number"
                valueDefault={longitude2?.toString() || ""}
                onChange={(value) => setLongitude2(Number(value))}
                className="col-6"
            />
            <FieldEdit
                label={`${t(langKeys.latitude)}: Coor 3`}
                type="number"
                valueDefault={latitude3?.toString() || ""}
                onChange={(value) => setLatitude3(Number(value))}
                className="col-6"
            />
            <FieldEdit
                label={`${t(langKeys.longitude)}: Coor 3`}
                type="number"
                valueDefault={longitude3?.toString() || ""}
                onChange={(value) => setLongitude3(Number(value))}
                className="col-6"
            />
            <FieldEdit
                label={`${t(langKeys.latitude)}: Coor 4`}
                type="number"
                valueDefault={latitude4?.toString() || ""}
                onChange={(value) => setLatitude4(Number(value))}
                className="col-6"
            />
            <FieldEdit
                label={`${t(langKeys.longitude)}: Coor 4`}
                type="number"
                valueDefault={longitude4?.toString() || ""}
                onChange={(value) => setLongitude4(Number(value))}
                className="col-6"
            />
        </div>
        <div className="row-zyx" style={{ justifyContent: "center" }}>
            <GoogleMaps coordinates={googleMapsCoordinates} onMapClick={handleMapClick} />
            <Typography className={classes.maptext}>
                {t(langKeys.address_found_in_geolocator)}
            </Typography>
        </div>
    </div>
    );
};

export default DeliveryAddressTabDetail;