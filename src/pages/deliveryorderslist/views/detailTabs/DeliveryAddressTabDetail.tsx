import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { langKeys } from 'lang/keys';
import { FieldErrors } from 'react-hook-form';
import { FieldEdit } from 'components';
import { Button, IconButton, Typography } from '@material-ui/core';
import GoogleMaps from 'components/fields/GoogleMaps';

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

    const handlePolygonChange = (isInside: boolean) => {
        setIsCoordinateInsidePolygon(isInside);
        setValidationMessage(isInside ? 'Coordenadas dentro del polígono.' : 'Coordenadas fuera del polígono.');
    };

    const [isCoordinateInsidePolygon, setIsCoordinateInsidePolygon] = useState<boolean | null>(null);
    const [validationMessage, setValidationMessage] = useState<string>('');

    const initialCoordinates = { latitude: -12.00000000000008, longitude: -77.00000000000001 };
    const [coordinatesSearch, setCoordinatesSearch] = useState<{ latitude: number; longitude: number }>( initialCoordinates );
    const [currentLatitude, setCurrentLatitude] = useState<number>(initialCoordinates.latitude);
    const [currentLongitude, setCurrentLongitude] = useState<number>(initialCoordinates.longitude);


    return (
    <div className={classes.containerDetail}>
        <Typography className={classes.subtitle}>{t(langKeys.geolocation)}</Typography>

        <div className="row-zyx">
            <FieldEdit
            label={`${t(langKeys.latitude)} de Pedido`}
            type="number"
            className="col-6"
            valueDefault={initialCoordinates.latitude}
            onChange={(newValue) => {
                setCoordinatesSearch((prev) => ({ ...prev, latitude: Number(newValue) }));
                setCurrentLatitude(Number(newValue));
            }}
            />
            <FieldEdit
            label={`${t(langKeys.longitude)} de Pedido`}
            type="number"
            className="col-6"
            valueDefault={initialCoordinates.longitude}
            onChange={(newValue) => {
                setCoordinatesSearch((prev) => ({ ...prev, longitude: Number(newValue) }));
                setCurrentLongitude(Number(newValue));
            }}
            />
            <FieldEdit
                label={t(langKeys.message)}
                type="text"
                disabled={true}
                className="col-12"
                valueDefault={
                    isCoordinateInsidePolygon !== null
                        ? isCoordinateInsidePolygon
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
            onPolygonChange={handlePolygonChange}
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