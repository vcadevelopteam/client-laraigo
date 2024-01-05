import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import MapLeaflet from 'components/fields/MapLeaflet';
import { FieldEdit } from 'components';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';



const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    inputContainer: {
        flex: 7,
        marginBottom: 0,
        paddingRight: 20
    },
}));

interface DeliveryInfoProps {  
    row: Dictionary | null
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ row }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const mapStyles = {
        height: '300px',
        width: '100%',
    };

    const defaultCenter = {
        lat: parseFloat(row?.latitude || 0),
        lng: parseFloat(row?.longitude || 0),
    };

   


    return (    
        <div className={classes.container} >
            <div className={classes.rowContainer}>
                <div className={`row-zyx ${classes.inputContainer}`}>
                    <FieldEdit
                        label={t(langKeys.deliverytype)}
                        valueDefault={row?.deliverytype}
                        disabled={true}
                        className='col-6'
                    />
                    <FieldEdit
                        label={t(langKeys.deliverydate)}
                        valueDefault={row?.deliverydate}
                        disabled={true}
                        className='col-6'
                    />
                    <FieldEdit
                        label={t(langKeys.deliveryaddress)}
                        valueDefault={row?.address}
                        disabled={true}
                        className='col-6'
                    />
                    <FieldEdit
                        label={t(langKeys.transactionreference)}
                        valueDefault={row?.deliveryadressreference}
                        disabled={true}
                        className='col-6'
                    />
                </div>
                <div style={{ flex: 5 }}>
                    <LoadScript
                        googleMapsApiKey="AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w"
                    >
                        <GoogleMap
                            mapContainerStyle={mapStyles}
                            zoom={18}
                            center={defaultCenter}
                            mapTypeId="hybrid" 
                            options={{
                                mapTypeControl: false, 
                                streetViewControl: false, 
                            }}
                        >
                            {row && (
                                <Marker
                                    position={{ lat: parseFloat(row.latitude || 0), lng: parseFloat(row.longitude || 0) }}
                                />
                            )}
                        </GoogleMap>
                    </LoadScript>
                    {/*
                      <MapLeaflet
                        height={300}
                        marker={row && { lat: parseFloat(row?.latitude || 0), lng: parseFloat(row?.longitude || 0) }}           
                        />   
                    */}
                                 
                </div>               
            </div>           
        </div>            
    );
}

export default DeliveryInfo;