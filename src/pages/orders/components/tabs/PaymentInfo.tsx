import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldEdit } from 'components';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
}));

interface PaymentInfoProps {  
    row: Dictionary | null
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ row }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (    
        <div className={classes.container}>
            <div className='row-zyx' style={{marginBottom: 0}}>
                <FieldEdit
                    label={t(langKeys.paymentreceipt)}
                    className="col-4"
                    valueDefault={row?.paymentreceipt}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.documenttype)}
                    className="col-4"
                    valueDefault={row?.documenttype}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.ticket_dni)}
                    className="col-4"
                    valueDefault={row?.ticket_dni}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.businessname)}
                    className="col-4"
                    valueDefault={row?.businessname}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.fiscaladdress)}
                    className="col-4"
                    valueDefault={row?.fiscaladdress}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.paymentdate)}
                    className="col-4"
                    valueDefault={row?.paymentdate}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.paymentmethod)}
                    className="col-4"
                    valueDefault={row?.paymentmethod}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.paymentamount)}
                    className="col-4"
                    valueDefault={row?.paymentamount}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.attached)}
                    className="col-4"
                    valueDefault={row?.attached}
                    disabled={true}              
                />
            </div>
        </div>            
    );
}

export default PaymentInfo;