import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { langKeys } from 'lang/keys';
import { FieldErrors } from 'react-hook-form';
import { FieldEdit } from 'components';
import { Button, IconButton, Typography } from '@material-ui/core';
import GoogleMaps, {IsOrderCoordinateInsidePolygon } from 'components/fields/GoogleMaps';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    subtitle: {
        fontSize: '1.5rem',   
        marginBottom: '1rem'   
    },
    mapFooter: {
        fontSize: '1rem',   
        color: 'grey',
        textAlign: 'center', 
    },
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",        
    },   
    addbutton: {
        backgroundColor: "#55BD84",
        margin: "0 0 1rem 0",      
        '&:hover': {
            backgroundColor: '#55BD84',
            borderRadius: 4
        }
    },
    
}));

interface InventoryTabDetailProps {
errors: FieldErrors;
}

const DeliveryAddressTabDetail: React.FC<InventoryTabDetailProps> = ({ errors }) => {
    const { t } = useTranslation();
    const classes = useStyles();    
    const [coordinates, setCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([
        { latitude: -12.00000000000001, longitude: -77.00000000000001 },
    ]);

    const handleAddCoordinate = () => {
    setCoordinates((prevCoordinates) => [...prevCoordinates, { latitude: 0, longitude: 0 }]);
    };

    const handleDeleteCoordinate = (index: number) => {
    setCoordinates((prevCoordinates) => prevCoordinates.filter((_, i) => i !== index));
    };

    const handleCoordinatesChange = (newCoordinates: Array<{ latitude: number; longitude: number }>) => {
    setCoordinates(newCoordinates);
    };

    const [orderCoordinate, setOrderCoordinate] = useState<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
    const [isOrderInsidePolygon, setIsOrderInsidePolygon] = useState<boolean | null>(null);
    useEffect(() => {
        const isInside = IsOrderCoordinateInsidePolygon(
            { lat: orderCoordinate.latitude, lng: orderCoordinate.longitude },
            coordinates.map(coord => ({ lat: coord.latitude, lng: coord.longitude }))
        );
        setIsOrderInsidePolygon(isInside);
    }, [orderCoordinate, coordinates]);    

    return (
    <div className={classes.containerDetail}>
        <Typography className={classes.subtitle}>{t(langKeys.geolocation)}</Typography>
        <div className="row-zyx">
            <FieldEdit
                label={`${t(langKeys.latitude)} de Orden`}
                type="number"
                className="col-6"
                valueDefault={orderCoordinate.latitude}
                onChange={(newValue) => {
                    setOrderCoordinate({
                        ...orderCoordinate,
                        latitude: Number(newValue),
                    });
                }}
            />
            <FieldEdit
                label={`${t(langKeys.longitude)} de Orden`}
                type="number"
                className="col-6"
                valueDefault={orderCoordinate.longitude}
                onChange={(newValue) => {
                    setOrderCoordinate({
                        ...orderCoordinate,
                        longitude: Number(newValue),
                    });
                }}
            />
            <FieldEdit
                label={t(langKeys.message)}
                type="text"
                disabled={true}
                className="col-12"
                valueDefault={
                    isOrderInsidePolygon !== null
                        ? isOrderInsidePolygon
                            ? 'Coordenadas dentro del polígono.'
                            : 'Coordenadas fuera del polígono.'
                        : 'Cargando...'
                }
            />
        </div>
        <div className="row-zyx" style={{ justifyContent: 'center' }}>
        <GoogleMaps 
            coordinates={coordinates} 
            onCoordinatesChange={handleCoordinatesChange} 
        />
        </div>
        <Typography className={classes.mapFooter}>{t(langKeys.address_found_in_geolocator)}</Typography>
        <div style={{ textAlign: "right" }}>    
        <Button
            className={classes.addbutton}
            variant="contained"
            type="button"
            color="primary"
            startIcon={<AddIcon color="secondary" />}
            onClick={handleAddCoordinate}
        >
            {t(langKeys.add) + " " + t(langKeys.coordinate)}
        </Button>
        </div>
        {coordinates.map((coord, index) => (
        <div key={index} className="row-zyx">
            <div className="col-1">
            <IconButton onClick={() => handleDeleteCoordinate(index)}>
                <DeleteIcon />
            </IconButton>
            </div>
            <div className="col-5">
            <FieldEdit
                label={`${t(langKeys.latitude)} ${index + 1}`}
                type="number"
                valueDefault={coord.latitude}
                onChange={(newValue) => {
                setCoordinates((prevCoordinates) =>
                    prevCoordinates.map((prevCoord, i) =>
                    i === index ? { ...prevCoord, latitude: Number(newValue) } : prevCoord
                    )
                );
                }}
            />
            </div>
            <div className="col-5">
            <FieldEdit
                label={`${t(langKeys.longitude)} ${index + 1}`}
                type="number"
                valueDefault={coord.longitude}
                onChange={(newValue) => {
                setCoordinates((prevCoordinates) =>
                    prevCoordinates.map((prevCoord, i) =>
                    i === index ? { ...prevCoord, longitude: Number(newValue) } : prevCoord
                    )
                );
                }}
            />
            </div>
        </div>
        ))}
    </div>
    );
};
export default DeliveryAddressTabDetail;