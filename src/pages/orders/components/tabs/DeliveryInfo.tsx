import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import MapLeaflet from 'components/fields/MapLeaflet';
import { FieldEdit } from 'components';
import { formatDate } from 'common/helpers';

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
        paddingRight: 20,
        gap: '0 4rem',
    },
}));

interface DeliveryInfoProps {  
    row: Dictionary | null
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ row }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (    
        <div className={classes.container} >
            <div className={classes.rowContainer}>
                <div className={`row-zyx ${classes.inputContainer}`}>
                    <FieldEdit
                        label={t(langKeys.deliverytype)}
                        valueDefault={row?.deliverytype}
                        disabled={true}
                        className='col-5'                                    
                    />
                    <FieldEdit
                        label={t(langKeys.deliverydate)}
                        valueDefault={formatDate(row?.deliverydate, { withTime: false })}                     
                        disabled={true}
                        className='col-5'
                    />
                    <FieldEdit
                        label={t(langKeys.deliveryaddress)}
                        valueDefault={row?.deliveryaddress}
                        disabled={true}
                        className='col-5'
                    />
                    <FieldEdit
                        label={t(langKeys.transactionreference)}
                        valueDefault={row?.deliveryadressreference}
                        disabled={true}
                        className='col-5'
                    />
                </div>
                <div style={{ flex: 6 }}>
                <MapLeaflet
                    height={300}
                    marker={ { lat: parseFloat(row?.latitude || 0), lng: parseFloat(row?.longitude || 0) }}           
                />   
                   
                    
                                 
                </div>               
            </div>      
            
        </div>            
    );
}

export default DeliveryInfo;