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
        display: 'flex',
        flexDirection: 'column',
        flex: 7,
        paddingRight: 30,
    },
    inputContainer2: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20,
    },
    fieldEditElement: {
        width: '50%',
        paddingRight: 30
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
                <div className={classes.inputContainer}>
                    <div className={classes.inputContainer2}>
                        <div className={classes.fieldEditElement}>
                            <FieldEdit
                                label={t(langKeys.deliverytype)}
                                valueDefault={row?.deliverytype}
                                disabled={true}
                            />
                        </div>
                        <div className={classes.fieldEditElement}>
                            <FieldEdit
                                label={t(langKeys.deliverydate)}
                                valueDefault={formatDate(row?.deliverydate, { withTime: false })}                     
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className={classes.inputContainer2}>
                        <div className={classes.fieldEditElement}>
                            <FieldEdit
                                label={t(langKeys.deliveryaddress)}
                                valueDefault={row?.deliveryaddress}
                                disabled={true}
                            />
                        </div>
                        <div className={classes.fieldEditElement}>
                            <FieldEdit
                                label={t(langKeys.transactionreference)}
                                valueDefault={row?.deliveryadressreference}
                                disabled={true}
                            />
                        </div>
                    </div>
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