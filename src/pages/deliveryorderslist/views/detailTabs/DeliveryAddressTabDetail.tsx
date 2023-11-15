import React, { useState, useEffect } from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { FieldEdit, TitleDetail } from "components";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

const default_latitude = -12.07672999152434;
const default_longitude = -77.09354067649065; 

interface MapContainerProps {
    coordinates: {
        latitude: number;
        longitude: number;
    };
}
  
const mapStyles = {
    height: "20rem",
    width: "100%",
};

const MapContainer: React.FC<MapContainerProps> = ({ coordinates }) => {
    const defaultCenter = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
  
    return (
      <LoadScript googleMapsApiKey="AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w">
        <GoogleMap mapContainerStyle={mapStyles} zoom={15} center={defaultCenter}>
          <Polygon
            paths={[
              { lat: coordinates.latitude - 0.001, lng: coordinates.longitude - 0.001 },
              { lat: coordinates.latitude + 0.001, lng: coordinates.longitude - 0.001 },
              { lat: coordinates.latitude + 0.001, lng: coordinates.longitude + 0.001 },
              { lat: coordinates.latitude - 0.001, lng: coordinates.longitude + 0.001 },
            ]}
            options={{
              fillColor: "#00FF00",
              fillOpacity: 0.4,
              strokeColor: "#FF0000",
              strokeOpacity: 1,
              strokeWeight: 2,
              clickable: true,
              draggable: true,
              editable: true,
              visible: true,
            }}
          />
        </GoogleMap>
      </LoadScript>
    );
};


//acá lo de antes, para visualiazar el tab detail Delivery Address
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

    image: {
        display: "flex",
        textAlign: "center",
        width: "50%",
        height: "25rem",
        objectFit: "cover",
    },
    imagetext: {
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

const DeliveryAddressTabDetail: React.FC<InventoryTabDetailProps> = ({ row, setValue, getValues, errors }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const importRes = useSelector((state) => state.main.execute);

    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    const [longitude, setLongitude] = useState<number | undefined>(undefined);

    const handleCoordinateChange = (value: number, isLatitude: boolean) => {
        if (isLatitude) {
          setLatitude(value);
        } else {
          setLongitude(value);
        }
    };  

    useEffect(() => { //effect provicional, para ponerle valuedefault funcional al google maps
        setLatitude(default_latitude);
        setLongitude(default_longitude);
    }, []);

    useEffect(() => {
        if (waitUpload) {
            if (!importRes.loading && !importRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_import),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            } else if (importRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(importRes.code || "error_unexpected_error"),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            }
        }
    }, [importRes, waitUpload]);


    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", {
                    module: t(langKeys.person).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_delete),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <TitleDetail title={t(langKeys.deliveryaddress)} />
            </div>
            <Typography className={classes.subtittle}>{t(langKeys.geolocation)}</Typography>            
            <div className="row-zyx" style={{ paddingBottom: "1rem" }}>
                <FieldEdit
                    label={t(langKeys.latitude) + ": "}
                    type="number"
                    valueDefault={default_latitude.toString()}
                    onChange={(value) => handleCoordinateChange(Number(value), true)}
                    className="col-6"
                />
                <FieldEdit
                    label={t(langKeys.longitude) + ": "}
                    type="number"
                    valueDefault={default_longitude.toString()}
                    onChange={(value) => handleCoordinateChange(Number(value), false)}
                    className="col-6"
                />
            </div>
            <div className="row-zyx" style={{ justifyContent: "center" }}>
                {latitude !== undefined && longitude !== undefined ? (
                    <MapContainer coordinates={{ latitude, longitude }} />
                ) : (
                    <LoadScript googleMapsApiKey="AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w">
                        <GoogleMap mapContainerStyle={mapStyles} zoom={2} center={{ lat: 0, lng: 0 }} />
                    </LoadScript>
                )}
                <Typography className={classes.imagetext}>{t(langKeys.address_found_in_geolocator)}</Typography>
            </div>
        </div>
    );
};

export default DeliveryAddressTabDetail;