/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldEdit,
  FieldCheckbox
} from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { insInventoryBalance } from "common/helpers";
import { execute, resetMainAux } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const RegisterInventoryBalanceDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  fetchData:any;
  row: any;
}> = ({ openModal, setOpenModal, row,fetchData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const { register, handleSubmit:handleMainSubmit, setValue, getValues, reset, formState: { errors }} = useForm({
    defaultValues: {
        inventorybalanceid: 0,
        inventoryid: row?.inventoryid,
        shelf: "",
        lotecode: "",
        currentbalance: 0,
        recountphysical: 0,
        recountphysicaldate: new Date().toISOString().split('T')[0],
        duedate: new Date().toISOString().split('T')[0],
        shelflifedays: 0,
        isreconciled: false,
        status: 'ACTIVO',
        type: 'NINGUNO',
        operation: "INSERT"
    }
  });

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            fetchData()
            reset()
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.inventorybalance).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

React.useEffect(() => {
  register('shelflifedays', { validate: (value) =>((value && value>0) ? true : t(langKeys.field_required) + "") });
  register('currentbalance', { validate: (value) =>((value && value>0) ? true : t(langKeys.field_required) + "") });
  register('recountphysical', { validate: (value) =>((value>=0) ? true : t(langKeys.field_required) + "") });
  register('shelf', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('lotecode', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('recountphysicaldate', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('duedate', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
}, [register, openModal]);
  
const submitData = handleMainSubmit((data) => {
  const callback = () => {
      dispatch(showBackdrop(true));
      dispatch(execute(insInventoryBalance(data)));
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
    <DialogZyx open={openModal} title={`${t(langKeys.new)} ${t(langKeys.inventorybalance )}`} maxWidth="sm">
        <div className="row-zyx">
            <FieldEdit
              label={t(langKeys.shelf)}
              valueDefault={getValues('shelf')}
              className="col-6"
              error={errors?.shelf?.message}
              onChange={(value) => {setValue('shelf', value)}}
              inputProps={{ maxLength: 15 }}
            />
            <FieldEdit
              label={t(langKeys.dateofphysicalcount)}
              type="date"
              valueDefault={getValues('recountphysicaldate')}
              error={errors?.recountphysicaldate?.message}
              className="col-6"
              onChange={(value) => {setValue('recountphysicaldate', value)}}
            />
            <FieldEdit
              label={t(langKeys.batch)}
              valueDefault={getValues('lotecode')}
              className="col-6"
              error={errors?.lotecode?.message}
              onChange={(value) => {setValue('lotecode', value)}}
              inputProps={{ maxLength: 50 }}
            />
            <FieldCheckbox
              label={t(langKeys.isconciliated)}
              className="col-6"
              error={errors?.isreconciled?.message}
              valueDefault={getValues("isreconciled")}
              onChange={(value) => setValue("isreconciled", value)}
            />
            <FieldEdit
              label={t(langKeys.current_balance)}
              type={'number'}
              error={errors?.currentbalance?.message}
              valueDefault={getValues('currentbalance')}
              className="col-6"
              onChange={(value) => {setValue('currentbalance', value)}}
            />
            <FieldEdit
              label={t(langKeys.shelflifeindays)}
              valueDefault={getValues('shelflifedays')}
              className="col-6"
              error={errors?.shelflifedays?.message}
              type={'number'}
              onChange={(value) => {setValue('shelflifedays', value)}}
            />
            <FieldEdit
              label={t(langKeys.physicalcount)}
              valueDefault={getValues('recountphysical')}
              className="col-6"
              error={errors?.recountphysical?.message}
              type={'number'}
              onChange={(value) => {setValue('recountphysical', value)}}
            />
            <FieldEdit
              label={t(langKeys.dueDate)}
              type="date"
              valueDefault={getValues('duedate')}
              error={errors?.duedate?.message}
              className="col-6"
              onChange={(value) => {setValue('duedate', value)}}
            />
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

export default RegisterInventoryBalanceDialog;