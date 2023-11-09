/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Typography, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { Trans, useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import ReceiptIcon from '@material-ui/icons/Receipt';
import InvoiceA4Dialog from "./InvoiceA4Dialog";
import InvoiceTicketDialog from "./InvoiceTicketDialog";
import InvoiceShareDialog from "./InvoiceShareDialog";



const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const ElectronicTicketAndInvoiceDialog: React.FC<{
  openModal: boolean;
  setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);

  const [openModalInvoiceA4, setOpenModalInvoiceA4] = useState(false);
  const [openModalInvoiceTicket, setOpenModalInvoiceTicket] = useState(false);
  const [openModalInvoiceShare, setOpenModalInvoiceShare] = useState(false);


  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code ?? "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])
  
  return (
    <DialogZyx open={openModal} title={t(langKeys.electronic_ticket_and_invoice)} maxWidth="sm">
      
      <div style={{justifyContent: "center", display:"flex", padding:"0.5rem 0 1rem 0", gap:"2rem"}}>
        <Button                        
          variant="contained"
          className={classes.button}
          color="primary"
          startIcon={<ReceiptIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84"}}
          onClick={() => {setOpenModalInvoiceA4(true)}}
        >
          <Trans i18nKey={t(langKeys.receipt) + " - " + t(langKeys.billingfield_billinga4)} /> 
          
        </Button>
        <Button                        
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<ReceiptIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84"}}
          onClick={() => {setOpenModalInvoiceTicket(true)}}

        >
          <Trans i18nKey={t(langKeys.receipt) + " - " + t(langKeys.ticket)} />
        </Button>    
      </div>

      <div style={{justifyContent: "center", display:"flex", padding:"0.5rem 0rem 1rem 0rem", gap:"2rem"}}>
        <Button                        
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<ShareIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84"}}
          onClick={() => {setOpenModalInvoiceShare(true)}}

        >
          <Trans i18nKey={t(langKeys.postcreator_publish_facebookmockup_share) + " " + t(langKeys.receipt)} />
        </Button>  
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
        <Button
          variant="contained"
          type="button"
          color="primary"
          startIcon={<ClearIcon color="secondary" />}
          style={{ backgroundColor: "#FB5F5F" }}
          onClick={() => {
            setOpenModal(false);
          }}
        >
          {t(langKeys.back)}
        </Button>      
      </div>
      <InvoiceA4Dialog
        openModal={openModalInvoiceA4}
        setOpenModal={setOpenModalInvoiceA4}
      />     
      <InvoiceTicketDialog
        openModal={openModalInvoiceTicket}
        setOpenModal={setOpenModalInvoiceTicket}
      /> 
      <InvoiceShareDialog
        openModal={openModalInvoiceShare}
        setOpenModal={setOpenModalInvoiceShare}
      /> 



    </DialogZyx>
  );
};

export default ElectronicTicketAndInvoiceDialog;