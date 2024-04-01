import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldEdit } from 'components';
import { Typography } from '@material-ui/core';
import { Dictionary } from '@types';
import MapLeaflet from 'components/fields/MapLeaflet';

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
    row: Dictionary | null;
}

const DeliveryAddressTabDetail: React.FC<InventoryTabDetailProps> = ({ row }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div className={classes.containerDetail}>
            <Typography style={{fontSize: 30}}>{t(langKeys.deliveryaddress)}</Typography>
            <Typography className={classes.subtitle}>{`${t(langKeys.geolocation)}:`}</Typography>
            <div className='row-zyx' style={{marginBottom: 0, display: 'flex', justifyContent: 'center'}}>
                <div className='col-8' style={{marginBottom: 0}}>
                    <MapLeaflet
                        height={400}
                        marker={row && { lat: parseFloat(row?.latitude || 0), lng: parseFloat(row?.longitude || 0) }}
                    />
                </div>
            </div>
            <Typography className={classes.mapFooter}>{t(langKeys.address_found_in_geolocator)}</Typography>
            <div className={classes.centerSelf}>
                <div className={classes.addressForm}>
                    <FieldEdit
                        label={t(langKeys.latitude)}
                        type="number"
                        disabled={true}
                        valueDefault={row?.latitude}
                    />
                    <FieldEdit
                        label={t(langKeys.longitude)}
                        type="number"
                        disabled={true}
                        valueDefault={row?.longitude}
                    />
                </div>
            </div>
        </div>
    );
};
export default DeliveryAddressTabDetail;