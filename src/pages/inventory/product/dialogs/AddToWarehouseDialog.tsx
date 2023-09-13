/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldCheckbox, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { insProductWarehouse } from "common/helpers";
import { execute } from "store/main/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));
const AddToWarehouseDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  setTabIndex: (dat: any) => void;
  productid: number;
  row?: any;
}> = ({ openModal, setOpenModal, setTabIndex, productid, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const multiData = useSelector((state) => state.main.multiDataAux);
  const executeRes = useSelector(state => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);

  const {
    register,
    handleSubmit: handleSubmitWarehouse,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productwarehouseid: row?.productwarehouseid || 0,
      productid: row?.productid || productid,
      warehouseid: row?.warehouseid || 0,
      priceunit: row?.priceunit || 0,
      ispredeterminate: row?.ispredeterminate || false,
      rackcode: row?.rackcode || "",
      typecostdispatch: row?.typecostdispatch || 0,
      unitdispatchid: row?.unitdispatchid || 0,
      unitbuyid: row?.unitbuyid || 0,
      currentbalance: row?.currentbalance || 0,
      lotecode: row?.lotecode || "",
      status: row?.status || "ACTIVO",
      type: row?.type || "NINGUNO",
      operation: row?.productwarehouseid ? "EDIT" : "INSERT",
    },
  });

  React.useEffect(() => {
    register("productid");
    register("warehouseid", {
      validate: (value) => (value && value > 0) || t(langKeys.field_required),
    });
    register('typecostdispatch', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
    register("priceunit", {
      validate: (value) => (value && value >= 0) || t(langKeys.no_negative),
    });
    register("currentbalance", {
      validate: (value) => (value && value >= 0) || t(langKeys.no_negative),
    });
    register('unitdispatchid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
    register('lotecode', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    register('unitbuyid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
    register("ispredeterminate");
    register("rackcode");
  }, [register]);

  useEffect(() => {
      if (waitSave) {
          if (!executeRes.loading && !executeRes.error) {
              dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
              dispatch(showBackdrop(false));
              setTabIndex(1);
              setOpenModal(false);
          } else if (executeRes.error) {
              const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
              dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
              setWaitSave(false);
              dispatch(showBackdrop(false));
          }
      }
  }, [executeRes, waitSave])

  const onMainSubmit = handleSubmitWarehouse((data) => {
    const callback = () => {
        dispatch(showBackdrop(true));
        dispatch(execute(insProductWarehouse(data)));

        setWaitSave(true);
    }
    dispatch(manageConfirmation({
        visible: true,
        question: t(langKeys.confirmation_save),
        callback
    }))
  });
  return (
    <DialogZyx open={openModal} title={t(langKeys.add_product_to_warehouse)}>
      <form
        onSubmit={onMainSubmit}
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        <div className="row-zyx">
          <FieldSelect
            label={t(langKeys.warehouse)}
            className="col-6"
            valueDefault={getValues("warehouseid")}
            onChange={(e) => {
              setValue("warehouseid", e.warehouseid);
            }}
            data={multiData.data[8].data}
            error={errors?.warehouseid?.message}
            optionDesc="description"
            optionValue="warehouseid"
          />
          <FieldSelect
            label={t(langKeys.typecostdispatch)}
            className="col-6"
            valueDefault={getValues("typecostdispatch")}
            onChange={(e) => {
              setValue("typecostdispatch", e.domainid);
            }}
            data={multiData.data[9].data}
            error={errors?.typecostdispatch?.message}
            optionDesc="domaindesc"
            optionValue="domainid"
          />
          <FieldEdit
            label={t(langKeys.transactioncost)}
            valueDefault={getValues("priceunit")}
            className="col-6"
            type="number"
            error={errors?.priceunit?.message}
            onChange={(value) => setValue("priceunit", value)}
          />
          <FieldCheckbox
            label={`${t(langKeys.warehouse)} ${t(langKeys.default)}`}
            className="col-6"
            valueDefault={getValues("ispredeterminate")}
            onChange={(value) => setValue("ispredeterminate", value)}
          />
          <FieldEdit
            label={t(langKeys.current_balance)}
            valueDefault={getValues("currentbalance")}
            className="col-6"
            type="number"
            error={errors?.currentbalance?.message}
            onChange={(value) => setValue("currentbalance", value)}
          />
          <FieldEdit
            label={t(langKeys.default_shelf)}
            valueDefault={getValues("rackcode")}
            className="col-6"
            onChange={(value) => setValue("rackcode", value)}
          />
          <FieldEdit
            label={t(langKeys.batch)}
            valueDefault={getValues("lotecode")}
            className="col-6"
            error={errors?.lotecode?.message}
            onChange={(value) => setValue("lotecode", value)}
          />
          <FieldSelect
              label={t(langKeys.dispatch_unit)}
              valueDefault={getValues('unitdispatchid')}
              className="col-6"
              onChange={(value) => setValue('unitdispatchid', value?.domainid||0)}
              error={errors?.unitdispatchid?.message}
              data={multiData.data[4].data}
              optionDesc="domaindesc"
              optionValue="domainid"
          />
          <FieldSelect
              label={t(langKeys.purchase_unit)}
              valueDefault={getValues('unitbuyid')}
              className="col-6"
              onChange={(value) => setValue('unitbuyid', value?.domainid||0)}
              error={errors?.unitbuyid?.message}
              data={multiData.data[3].data}
              optionDesc="domaindesc"
              optionValue="domainid"
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
            onClick={onMainSubmit}
            startIcon={<SaveIcon color="secondary" />}
            style={{ backgroundColor: "#55BD84" }}
          >
            {t(langKeys.save)}
          </Button>
        </div>
      </form>
    </DialogZyx>
  );
};

export default AddToWarehouseDialog;
