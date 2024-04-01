import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors } from 'react-hook-form';
import { FieldEdit } from 'components';
import { Typography } from '@material-ui/core';
import GoogleMaps from 'components/fields/GoogleMaps';
import { Dictionary } from '@types';

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
        marginTop: '1.5rem',
        marginBottom: '1.5rem', 
    },
    addressForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: 500,
        backgroundColor: '#F7F7F7',
        padding: 20
    },
    centerSelf: {
        display: 'flex',
        justifyContent: 'center'
    },
}));

interface InventoryTabDetailProps {
    errors: FieldErrors;
    row: Dictionary | null;
}

const DeliveryAddressTabDetail: React.FC<InventoryTabDetailProps> = ({ errors, row }) => {
    const { t } = useTranslation();
    const classes = useStyles();    
    const [coordinates, setCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([
        { latitude: row?.latitude, longitude: row?.longitude },
    ]);

    const handleCoordinatesChange = (newCoordinates: Array<{ latitude: number; longitude: number }>) => {
        setCoordinates(newCoordinates);
    };

    return (
    <div className={classes.containerDetail}>
        <Typography style={{fontSize: 30}}>{t(langKeys.deliveryaddress)}</Typography>
        <Typography className={classes.subtitle}>{`${t(langKeys.geolocation)}:`}</Typography>
        <div className={classes.centerSelf}>
            <div style={{ width: '70%' }}>
                <GoogleMaps 
                    coordinates={coordinates} 
                    onCoordinatesChange={handleCoordinatesChange} 
                />
            </div>
        </div>
        <Typography className={classes.mapFooter}>{t(langKeys.address_found_in_geolocator)}</Typography>
        {coordinates.map((coord, index) => (
            <div key={index} className={classes.centerSelf}>
                <div className={classes.addressForm}>
                    <FieldEdit
                        label={t(langKeys.latitude)}
                        type="number"
                        disabled={true}
                        valueDefault={coord.latitude}
                    />
                    <FieldEdit
                        label={t(langKeys.longitude)}
                        type="number"
                        disabled={true}
                        valueDefault={coord.longitude}
                    />
                </div>
            </div>
        ))}
    </div>
    );
};
export default DeliveryAddressTabDetail;