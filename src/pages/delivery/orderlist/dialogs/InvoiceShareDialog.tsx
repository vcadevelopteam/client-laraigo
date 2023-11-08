/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Typography, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import DoneIcon from "@material-ui/icons/Done";


const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const InvoiceShareDialog: React.FC<{
  openModal: boolean;
  setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);

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
    <DialogZyx open={openModal} title={t(langKeys.postcreator_publish_facebookmockup_share) + " " + t(langKeys.receipt)} maxWidth="sm">
      
      <div className="row-zyx" style={{justifyContent: "center"}}>
        <FieldSelect
          label={t(langKeys.select) + " " + t(langKeys.email) + "/" + t(langKeys.sms)} 
          className="col-12"
          data={[]}
          optionValue="warehouseid"
          optionDesc="name"
        />       
      </div>    

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "end" }}>
        <Button
          className={classes.button}
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
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="button"
          startIcon={<DoneIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84" }}        
        >
        {t(langKeys.send)}
        </Button> 

      
       
      </div>     

    </DialogZyx>
  );
};

export default InvoiceShareDialog;