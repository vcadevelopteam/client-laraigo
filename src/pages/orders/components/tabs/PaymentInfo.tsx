import React from 'react';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldEdit } from 'components';
import { formatDate } from 'common/helpers';
import { PDFRedIcon, ImageIcon } from 'icons';
import { InputLabel } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: "#fff",
  },
  attachedText: {
    color:'black', 
    fontSize: '14px', 
    marginBottom: '8px',
  },
  attachedElement: {
    display:'flex', 
    paddingRight:'10px', 
    maxWidth: '100%', 
    border:'1px solid #C8C8C8', 
    padding: '5px 10px', 
    borderRadius:'20px', 
    marginRight:'7px' 
  },
  attachedIcon: {
    height:15, 
    width: 'auto'
  },
  attachedText2: {
    maxWidth: '120px', 
    overflow: 'hidden',
    paddingLeft:'5px', 
    fontSize: '15px', 
    whiteSpace: 'nowrap', 
    textOverflow: 'ellipsis' 
  }

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

  const openFile = (link: string) => {
    window.open(link, '_blank');
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
                <div className="col-4">
                    <InputLabel className={classes.attachedText}>{t(langKeys.attached)}</InputLabel>
                    <div  style={{overflowX:'auto'}}>
                        <FieldEdit
                            disabled={true}
                            InputProps={{                           
                                startAdornment:(
                                    [row?.payment_attachment?.split(',').map( (file: string, index: number)=>(
                                    <div style={{cursor:'pointer'}} key={index} className={classes.attachedElement} onClick={()=>openFile(file)}>
                                      {file.split('.').pop()?.toLowerCase() === 'pdf' ? <PDFRedIcon className={classes.attachedIcon}/> : <ImageIcon className={classes.attachedIcon}/>}
                                      <span className={classes.attachedText2}>{file}</span> 
                                    </div>
                                    ))]                            
                                )
                            }}
                        />
                    </div>
                </div>
            </div>
    </div>
  );
};

export default PaymentInfo;