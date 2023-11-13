/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldEdit,
  FieldSelect
} from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { insInventoryBalance } from "common/helpers";
import { execute } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const CompleteInventoryConsumptionDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const multiData = useSelector(state => state.main.multiDataAux);
  const executeRes = useSelector(state => state.main.execute);
  const { register, handleSubmit:handleMainSubmit, setValue, getValues, reset, formState: { errors }} = useForm({
    defaultValues: {
        inventorybalanceid: 0,
        inventoryid: row?.inventoryid,
        status: "COMPLETADO",
        comment: "",
        type: 'NINGUNO',
        operation: "INSERT"
    }
  });

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_inventoryconsumption) }))
            dispatch(showBackdrop(false));
            reset()
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code ?? "error_unexpected_error", { module: t(langKeys.inventorybalance).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

React.useEffect(() => {
  register('comment')
  register('status', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
}, [register, openModal]);
  
const submitData = handleMainSubmit((data) => {
  const callback = () => {
      dispatch(showBackdrop(true));
      //dispatch(execute(insInventoryBalance(data)));
      setWaitSave(true);
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_save),
      callback
  }))
});

  return (
    <form onSubmit={submitData}>
    <DialogZyx open={openModal} title={`${t(langKeys.complete)} ${t(langKeys.inventory_consumption ).toLocaleLowerCase()}`} maxWidth="sm">
        <div className="row-zyx">
            <FieldSelect
                label={`${t(langKeys.new)} ${t(langKeys.status)}`}
                className="col-12"
                data={multiData?.data?.[0]?.data||[]}
                optionValue="domainvalue"
                optionDesc="domaindesc"
                valueDefault={getValues("status")}
                error={errors?.status?.message}
                onChange={(value) => setValue("status", value.manufacturerid)}  
            />
            <FieldEdit
              label={t(langKeys.ticket_comment)}
              type="text"
              valueDefault={getValues('comment')}
              className="col-12"
              onChange={(value) => {setValue('comment', value)}}
            />
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            type="button"
            color="primary"
            startIcon={<ClearIcon color="secondary" />}
            style={{ backgroundColor: "#FB5F5F" }}
            onClick={() => {
              setOpenModal(false);
              reset()
            }}
          >
            {t(langKeys.back)}
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="button"
            startIcon={<SaveIcon color="secondary" />}
            style={{ backgroundColor: "#55BD84" }}
            onClick={submitData}
          >
            {t(langKeys.save)}
          </Button>
        </div>
    </DialogZyx>
    </form>
  );
};

export default CompleteInventoryConsumptionDialog;