import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
 
  buttonspace: {
    display: "flex", 
    gap: "10px", 
    alignItems: "center", 
    justifyContent: "end"
  },
  button: {
    marginRight: theme.spacing(2),
    justifyContent: "center", 
    margin:"0rem 8rem 1rem 9rem"
  },
 
}));

const PrintDialog: React.FC<{
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
    <DialogZyx open={openModal} title="" maxWidth="sm">
          
      <div className={classes.buttonspace} >
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
      <img style={{textAlign: "center"}} src="https://www.invoiceowl.com/wp-content/uploads/2023/02/freight-invoice-banner-template.svg" alt="Invoice"></img>

      <div className="row-zyx" >
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="button"
          style={{ backgroundColor: "#55BD84" }}        
        >
        {t(langKeys.print)}
        </Button> 
      </div>

    </DialogZyx>
  );
};

export default PrintDialog;