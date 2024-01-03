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
            <div className="row-zyx" style={{marginBottom: 0}}>
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
                <div>
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