/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect, FieldCheckbox } from "components";
import { langKeys } from "lang/keys";
import { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { execute, resetMainAux } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const RegisterClientDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const multiDataAux = useSelector(state => state.main.multiDataAux);

  const { register, handleSubmit:handleMainSubmit, setValue, getValues, reset} = useForm({
    defaultValues: {
        productattributeid: 0,
        productid: 0,
        attributeid: '',
        value: '',
        unitmeasureid: 0,
        status: 'ACTIVO',
        type: 'NINGUNO',
        operation: "INSERT"
    }
  });

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            reset()
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

React.useEffect(() => {
  register('unitmeasureid', { validate: (value) =>((value && value>0) ? true : t(langKeys.field_required) + "") });
  register('attributeid', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('value', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  dispatch(resetMainAux());
}, [register]);
  
const submitData = handleMainSubmit((data) => {
  const callback = () => {
      dispatch(showBackdrop(true));
      //dispatch(execute(insProductAttribute(data)));
      setWaitSave(true);
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_save),
      callback
  }))
});

  return (
    <DialogZyx open={openModal} title={`${t(langKeys.new)} ${t(langKeys.client )}`} maxWidth="md">
      <form onSubmit={submitData}>
      <div className="row-zyx">
          <FieldSelect
            label={t(langKeys.corporation)}
            className="col-6"
            data={(multiDataAux?.data?.[1]?.data||[])}
            optionValue="corpid"
            optionDesc="description"
          />
          <FieldSelect
            label={t(langKeys.organization)}
            className="col-6"
            data={(multiDataAux?.data?.[0]?.data||[])}
            optionValue="orgid"
            optionDesc="orgdesc"
          />
          <FieldSelect
            label={t(langKeys.partnertype)}
            className="col-6"
            data={[]}
            optionValue="domainvalue"
            optionDesc="domaindesc"
          />
          <FieldEdit
            label={t(langKeys.status)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.billingplan)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.billingcurrency)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.creationuser)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.commissionpercentage)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.lastmodificationuser)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.creationDate)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
          />
          <FieldEdit
            label={t(langKeys.lastmodificationdate)}
            valueDefault={getValues('value')}
            className="col-6"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
            disabled={true}
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
      </form>
    </DialogZyx>
  );
};

export default RegisterClientDialog;