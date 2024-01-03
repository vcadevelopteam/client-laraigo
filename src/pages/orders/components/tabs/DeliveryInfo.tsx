import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import MapLeaflet from 'components/fields/MapLeaflet';
import { FieldEdit } from 'components';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
}));
interface MultiData {
    data: Dictionary[];
    success: boolean; 
}
interface DeliveryInfoProps {  
    row: Dictionary | null,
    multiData: MultiData[];
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ row, multiData }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (    
        <div className={classes.container} >
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div className='row-zyx' style={{ flex: 7, marginBottom: 0, paddingRight: 20 }}>
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
                        valueDefault={row?.deliveryaddress}
                        disabled={true}
                        className='col-6'
                    />
                    <FieldEdit
                        label={t(langKeys.transactionreference)}
                        valueDefault={row?.transactionreference}
                        disabled={true}
                        className='col-6'
                    />
                </div>
                <div style={{ flex: 5 }}>
                    <MapLeaflet
                        height={300}
                        /*marker={row && { lat: parseFloat(row?.longitude || 0), lng: parseFloat(row?.latitude || 0) }}*/
                        marker={{lat: 0, lng: 0}}                    
                    />
                </div>
            </div>
        </div>            
    );
}

export default DeliveryInfo;