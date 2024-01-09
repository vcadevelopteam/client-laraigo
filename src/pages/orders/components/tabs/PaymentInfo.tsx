import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldEdit } from 'components';
import { formatDate } from 'common/helpers';
import { PDFRedIcon, ImageIcon } from 'icons';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: "#fff",
  },
}));

interface PaymentInfoProps {
  row: Dictionary | null;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ row }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  if (!row) {
    return null;
  }

  const renderAttachments = (attachments: string | undefined) => {
    if (!attachments) {
      return null;
    }

    const files = attachments.split(',');

    return (
      <div>
        {files.map((file: string, index: number) => {
          const fileName = file.substring(file.lastIndexOf('/') + 1);
          const fileType = fileName.split('.').pop()?.toLowerCase();

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              {fileType === 'pdf' ? <PDFRedIcon /> : <ImageIcon />}
              <div style={{ marginLeft: '5px' }}>
                {fileName}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={classes.container}>
        <div className='row-zyx' style={{marginBottom: 0}}>
                <FieldEdit
                    label={t(langKeys.paymentreceipt)}
                    className="col-4"
                    valueDefault={row?.payment_receipt}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.documenttype)}
                    className="col-4"
                    valueDefault={row?.payment_document_type}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.ticket_dni)}
                    className="col-4"
                    valueDefault={row?.payment_document_number}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.businessname)}
                    className="col-4"
                    valueDefault={row?.payment_businessname}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.fiscaladdress)}
                    className="col-4"
                    valueDefault={row?.payment_fiscal_address}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.paymentdate)}
                    className="col-4"
                    valueDefault={formatDate(row?.payment_date, { withTime: false })}                     
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
                    valueDefault={row?.payment_amount}                           
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.attached)}
                    className="col-4"
                    valueDefault={row.payment_attachment}
                    disabled={true}
                />
                {renderAttachments(row.payment_attachment)}
            </div>
    </div>
  );
};

export default PaymentInfo;