/* eslint-disable react-hooks/exhaustive-deps */
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
import { insInventoryBooking, insProductAttribute } from "common/helpers";
import { execute, resetMainAux } from "store/main/actions";
import { FieldCheckbox } from 'components';
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { FieldErrors, useForm } from "react-hook-form";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const AddReservationDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
  fetchData:any;
}> = ({ openModal, setOpenModal, row, fetchData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const multiDataAux = useSelector(state => state.main.multiDataAux);

  const { register, handleSubmit:handleMainSubmit, setValue, getValues, reset, formState:{errors}} = useForm({
    defaultValues: {
        inventorywarehouseid:0,
        inventoryid: row.inventoryid,
        productdescription: row.productdescription,
        ticketid: "",
        bookingtype: "",
        applicationdate: new Date(),
        productid: row?.productid,
        warehouseid: row?.warehouseid,
        bookingquantity: 0,
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
  register('bookingquantity', { validate: (value) =>((value && value>0) ? true : t(langKeys.field_required) + "") });
  register('bookingtype', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('applicationdate', { validate: (value) =>((value) ? true : t(langKeys.field_required) + "") });
}, [register, openModal]);
  
const submitData = handleMainSubmit((data) => {
  const callback = () => {
      dispatch(showBackdrop(true));
      dispatch(execute(insInventoryBooking(data)));
      setWaitSave(true);
  }
  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_save),
      callback
  }))
});

  return (
    <DialogZyx open={openModal} title={`${t(langKeys.add)} ${t(langKeys.reservations)}`} maxWidth="md">
      <form onSubmit={submitData}>
      <div className="row-zyx">
          <FieldEdit
            label={t(langKeys.ticketapplication)}
            //data={[]}
            valueDefault={getValues("ticketid")}
            onChange={(e)=>setValue("ticketid",e)}
            className="col-3"
            //optionValue="domainvalue"
            //optionDesc="domaindesc"
          />
          <FieldSelect
            label={t(langKeys.reservationtype)}
            className="col-3"
            valueDefault={getValues("bookingtype")}
            onChange={(e)=>setValue("bookingtype", e?.domainvalue||"")}
            error={errors?.bookingtype?.message}
            data={multiDataAux?.data?.[5]?.data}
            optionValue="domainvalue"
            optionDesc="domaindesc"
          />
          <FieldSelect
            label={t(langKeys.product)}
            className="col-3"
            data={multiDataAux?.data?.[2]?.data}
            valueDefault={getValues("productid")}
            disabled
            optionValue="productid"
            optionDesc="productcode"
          />
          <FieldEdit
            label={t(langKeys.description)}
            valueDefault={getValues('productdescription')}
            className="col-3"
            disabled
            inputProps={{ maxLength: 256 }}
          />
          <FieldSelect
            label={t(langKeys.warehouse)}
            className="col-4"
            valueDefault={getValues("warehouseid")}
            data={multiDataAux?.data?.[3]?.data}
            disabled
            optionValue="warehouseid"
            optionDesc="description"
          />
          <FieldEdit
            label={t(langKeys.reservedquantity)}
            valueDefault={getValues('bookingquantity')}
            error={errors?.bookingquantity?.message}
            className="col-4"
            type="number"
            onChange={(value) => {setValue('bookingquantity', value)}}
          />
          <FieldEdit
            label={t(langKeys.applicationdate)}
            type="date"
            valueDefault={getValues('applicationdate')}
            error={errors?.applicationdate?.message}
            className="col-4"
            onChange={(value) => {setValue('applicationdate', value)}}
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

export default AddReservationDialog;