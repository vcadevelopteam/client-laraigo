/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Typography, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { insarrayInventoryBalance } from "common/helpers";
import { execute } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const ReconcileBalanceDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
  data: any;
  fetchData: any
}> = ({ openModal, setOpenModal, row, data, fetchData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);

  useEffect(() => {
    if(openModal){
      fetchData()
    }
}, [openModal])

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
  
const submitData = (() => {
  const callback = () => {
      const newData = data.data.map((item: any) => ({
        ...item,
        isreconciled: true
      }));

      dispatch(showBackdrop(true));
      dispatch(execute(insarrayInventoryBalance(newData)));
      setWaitSave(true);
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_save),
      callback
  }))
});

  return (
    <DialogZyx open={openModal} title={t(langKeys.reconcilebalancesheets)} maxWidth="sm">
      <div className="row-zyx">
          <Typography />{t(langKeys.reconcilebalancetext)}
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="button"
          disabled={data.loading}
          startIcon={<SaveIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84" }}
          onClick={submitData}
        >
          {t(langKeys.save)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default ReconcileBalanceDialog;