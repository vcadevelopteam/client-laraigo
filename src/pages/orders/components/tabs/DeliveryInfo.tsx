import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import MapLeaflet from 'components/fields/MapLeaflet';
import { FieldEdit } from 'components';

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        color: "#2E2C34",
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
            <div className="row-zyx" style={{paddingTop: 20}}>
                <div className="row-zyx" style={{paddingTop: 20}}>
                    <FieldEdit
                        label={t(langKeys.deliverytype)}
                        className="col-6"
                        valueDefault={row?.deliverytype || "-"}                           
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.deliverydate)}
                        className="col-6"
                        valueDefault={row?.deliverydate || "-"}                           
                        disabled={true}              
                    />
                </div>
                <div className="row-zyx" style={{paddingTop: 20}}>
                    <FieldEdit
                        label={t(langKeys.deliveryaddress)}
                        className="col-6"
                        valueDefault={row?.deliveryaddress || "-"}                           
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.transactionreference)}
                        className="col-6"
                        valueDefault={row?.transactionreference || "-"}                           
                        disabled={true}              
                    />
                </div>               
            </div>
            <div className="col-12">
                <MapLeaflet
                    height={300}
                    /*marker={row && { lat: parseFloat(row?.longitude || 0), lng: parseFloat(row?.latitude || 0) }}*/
                    marker={{lat: 0, lng: 0}}                    
                />
            </div>  
        </div>            
    );
}

export default DeliveryInfo;