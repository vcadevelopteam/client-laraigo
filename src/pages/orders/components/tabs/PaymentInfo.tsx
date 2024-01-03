import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
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
interface PaymentInfoProps {  
    row: Dictionary | null,
    multiData: MultiData[];
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ row, multiData }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (    
        <div className={classes.container} >
            <div className="row-zyx" style={{paddingTop: 20}}>
                <div className="row-zyx" style={{paddingTop: 20}}>
                    <FieldEdit
                        label={t(langKeys.paymentreceipt)}
                        className="col-4"
                        valueDefault={row?.paymentreceipt || "-"}                           
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.documenttype)}
                        className="col-4"
                        valueDefault={row?.documenttype || "-"}                           
                        disabled={true}              
                    />
                     <FieldEdit
                        label={t(langKeys.ticket_dni)}
                        className="col-4"
                        valueDefault={row?.ticket_dni || "-"}                           
                        disabled={true}              
                    />
                </div>
                <div className="row-zyx" style={{paddingTop: 20}}>
                    <FieldEdit
                        label={t(langKeys.businessname)}
                        className="col-4"
                        valueDefault={row?.businessname || "-"}                           
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.fiscaladdress)}
                        className="col-4"
                        valueDefault={row?.fiscaladdress || "-"}                           
                        disabled={true}              
                    />
                     <FieldEdit
                        label={t(langKeys.paymentdate)}
                        className="col-4"
                        valueDefault={row?.paymentdate || "-"}                           
                        disabled={true}              
                    />
                </div>
                <div className="row-zyx" style={{paddingTop: 20}}>
                    <FieldEdit
                        label={t(langKeys.paymentmethod)}
                        className="col-4"
                        valueDefault={row?.paymentmethod || "-"}                           
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.paymentamount)}
                        className="col-4"
                        valueDefault={row?.paymentamount || "-"}                           
                        disabled={true}              
                    />
                     <FieldEdit
                        label={t(langKeys.attached)}
                        className="col-4"
                        valueDefault={row?.attached || "-"}                           
                        disabled={true}              
                    />
                </div>       
            </div>
          
        </div>            
    );
}

export default PaymentInfo;