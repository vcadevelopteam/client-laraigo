import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { format } from "date-fns";
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const InsertDeliverySchedulesDialog: React.FC<{
  openModal: boolean;
  setOpenModal: (dat: boolean) => void;
  row: Dictionary
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);

  const signatureDateDefault = format(new Date(), 'yyyy-MM-dd');

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
    <DialogZyx open={openModal} title={t(langKeys.deliveryshifts)} maxWidth="sm">
      <div className="row-zyx">
        <FieldSelect
          label={t(langKeys.shifts)}
          className="col-4"
          data={[]}
          optionValue="shifts"
          optionDesc="name"
        />
        <div className="col-2"></div>
        <FieldEdit
          label={t(langKeys.from)}
          type="time"
          valueDefault={signatureDateDefault}
          className="col-3"
          />
        <FieldEdit
          label={t(langKeys.until)}
          type="time"
          valueDefault={signatureDateDefault}
          className="col-3"
        />
       

      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "end" }}>
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
          variant="contained"
          type="button"
          color="primary"
          startIcon={<AddIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84", margin:"1rem 0 " }}         
        >
         {t(langKeys.add)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default InsertDeliverySchedulesDialog;