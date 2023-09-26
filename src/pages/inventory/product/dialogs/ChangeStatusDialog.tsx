/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldCheckbox,
  FieldEdit,
  FieldSelect,
  FieldView,
} from "components";
import { langKeys } from "lang/keys";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useSelector } from "hooks";
import React from "react";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { insStatusProduct, insStatusProductMas } from "common/helpers";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const ChangeStatusDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row?: any;
  massive?: boolean;
  selectedRows?: any;
  fetchData: any;
  fetchDataAux: any;
  setValueOutside?:any;
}> = ({ openModal, setOpenModal, row, massive = false, selectedRows, fetchData, fetchDataAux, setValueOutside }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const multiData = useSelector(state => state.main.multiDataAux);
  const dispatch = useDispatch();
  const executeRes = useSelector(state => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);

  const { register, handleSubmit:handleMainSubmit, setValue, getValues, reset, formState: { errors } } = useForm({
    defaultValues: {
        statusid: 0,
        productid: row?.productid || '',
        status: '',
        type: 'NINGUNO',
        comment: '',
        operation: 'INSERT',
        ismoveinventory: false
    }
  });

  React.useEffect(() => {
    register('productid');
    register('statusid');
    register('comment', { validate: (value:any) => (value && value.length) || t(langKeys.field_required) });
    register('status', { validate: (value:any) => (value && value.length) || t(langKeys.field_required) });
    register('type');
    register('ismoveinventory')
  }, [register]);

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            if(!!setValueOutside){
              console.log(getValues("status"))
              setValueOutside("status", getValues("status"))
            }else{
              fetchData(fetchDataAux)
            }
            setOpenModal(false);
            reset()
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

  const onMainSubmit = handleMainSubmit((data:any) => {
    const callback = () => {
        dispatch(showBackdrop(true));
        if(massive){
          dispatch(execute(insStatusProductMas({...data, productid: Object.keys(selectedRows).join(",")})));
        }else{
          dispatch(execute(insStatusProduct(data)));
        }
        setWaitSave(true);
    }
    dispatch(manageConfirmation({
        visible: true,
        question: massive?`Esto acción afectará a ${Object.keys(selectedRows).length} registros que se encuentran en la aplicación, ¿Desea continuar con dicho cambio?`:t(langKeys.confirmation_save),
        callback
    }))
});

  return (
    <DialogZyx open={openModal} title={t(langKeys.change_status)}>
      <form onSubmit={onMainSubmit}>
      {!massive && (
        <>
          <div className="row-zyx">
            <FieldView
              label={t(langKeys.code)}
              className={"col-6"}
              value= {row?.productid || ""}
            />
            <FieldView
              label={t(langKeys.description)}
              className={"col-6"}
              value= {row?.description || ""}
            />
          </div>
        </>
      )}
      <div className="row-zyx">
        {!massive && (
          <FieldView
            label={`${t(langKeys.status)} ${t(langKeys.current)}`}
            className={"col-6"}
            value= {row?.status || ""}
          />
        )}
        <FieldSelect
          label={`${t(langKeys.new)} ${t(langKeys.status)} `}
          className="col-6"
          valueDefault={getValues("status")}
          onChange={(value) => setValue("status", value?.domainvalue || '')}
          error={errors?.status?.message}
          data={multiData?.data?.[5]?.data}
          optionValue="domainvalue"
          optionDesc="domainvalue"
        />
      </div>
      <div className="row-zyx">
        <FieldCheckbox
          label={t(langKeys.move_new_status)}
          className={`col-6`}
          valueDefault={getValues('ismoveinventory')}
          onChange={(value) => {
            setValue("ismoveinventory", value);
          }}
        />
      </div>
      <div className="row-zyx">
        <FieldEdit
          label={t(langKeys.ticket_comment)}
          valueDefault={getValues("comment")}
          onChange={(value) => setValue('comment', value)}
          error={errors?.comment?.message}
          inputProps={{ maxLength: 256 }}
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
          onClick={onMainSubmit}
        >
          {t(langKeys.save)}
        </Button>
      </div>
      </form>
    </DialogZyx>
  );
};

export default ChangeStatusDialog;