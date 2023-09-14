import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldEdit,
  FieldSelect,
} from "components";
import { langKeys } from "lang/keys";
import { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { Dictionary } from "@types";
import { insProductAttribute } from "common/helpers";
import { execute, resetMainAux } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { reset } from "store/activationuser/caseFunctions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const RegisterSpecificationDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
  fetchData: any;
}> = ({ openModal, setOpenModal, row, fetchData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const multiData = useSelector(state => state.main.multiDataAux);
  const executeRes = useSelector(state => state.main.execute);

  const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } , reset} = useForm({
    defaultValues: {
        productattributeid: 0,
        productid: row.productid,
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
            fetchData()
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
      dispatch(execute(insProductAttribute(data)));
      setWaitSave(true);
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_save),
      callback
  }))
});

  return (
    <DialogZyx open={openModal} title={t(langKeys.change_status)} maxWidth="sm">
      <form onSubmit={submitData}>
      <div className="row-zyx">
          <FieldEdit
            label={t(langKeys.attribute)}
            valueDefault={getValues('attributeid')}
            className="col-12"
            onChange={(value) => {setValue('attributeid', value)}}
            inputProps={{ maxLength: 256 }}
          />
          <FieldEdit
            label={t(langKeys.value)}
            valueDefault={getValues('value')}
            className="col-12"
            onChange={(value) => {setValue('value', value)}}
            inputProps={{ maxLength: 256 }}
          />
          <FieldSelect
            label={t(langKeys.measureunit)}
            className="col-12"
            valueDefault={getValues('unitmeasureid')}
            onChange={(value) => setValue('unitmeasureid', value?.domainid)}
            error={""}
            data={multiData.data[3].data}
            optionValue="domainid"
            optionDesc="domainvalue"
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

export default RegisterSpecificationDialog;