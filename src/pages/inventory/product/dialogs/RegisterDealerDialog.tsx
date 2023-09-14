/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldCheckbox, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useForm } from "react-hook-form";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import React from "react";
import { execute } from "store/main/actions";
import { insProductDealer } from "common/helpers";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const RegisterDealerDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  fetchData: any;
  row: any
}> = ({ openModal, setOpenModal, row, fetchData }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector((state) => state.main.execute);
  const dispatch = useDispatch();
  const multiData = useSelector(state => state.main.multiDataAux);

  const { register,handleSubmit: handleMainSubmit,setValue,getValues,formState: { errors },reset} = useForm({
    defaultValues: {
      productid: row.productid,
      productcompanyid: 0,
      manufacturerid: 0,
      distributorid: 0,
      model: "",
      distributor: "",
      manufacturer: "",
      catalognumber: "",
      webpage: "",
      taxeid: 0,
      isstockistdefault: false,
      averagedeliverytime: 0,
      lastprice: 0,
      lastorderdate: null,
      unitbuy: 0,
      status: "ACTIVO",
      type: "NINGUNO",
      operation: "INSERT"
    },
  });

  React.useEffect(() => {
    register("productid");
    register('model')
    register("productcompanyid");
    register("manufacturerid", { validate: (value) => !!getValues("distributorid")?((value && value>0) ? true : t(langKeys.field_required) + ""):true });
    register("distributorid", { validate: (value) =>  !!getValues("manufacturerid")?((value && value>0) ? true : t(langKeys.field_required) + ""):true });
    register("catalognumber");
    register("webpage");
    register("taxeid");
    register("isstockistdefault");
    register("averagedeliverytime", { validate: (value) => ((value && value>0) ? true : t(langKeys.field_required) + "") });
    register("lastprice", { validate: (value) => ((value && value>=0) ? true : t(langKeys.no_negative) + "") });
    register("lastorderdate");
    register("unitbuy");

  }, [register,getValues]);

  useEffect(() => {
    if (waitSave) {
      if (!executeRes.loading && !executeRes.error) {
        dispatch(showSnackbar({show: true,severity: "success",message: t(langKeys.successful_register),}));
        dispatch(showBackdrop(false));
        setOpenModal(false)
        reset();
        fetchData()
      } else if (executeRes.error) {
        const errormessage = t(executeRes.code || "error_unexpected_error", {module: t(langKeys.domain).toLocaleLowerCase(),});
        dispatch(
          showSnackbar({ show: true, severity: "error", message: errormessage })
        );
        setWaitSave(false);
        dispatch(showBackdrop(false));
      }
    }
  }, [executeRes, waitSave]);

  const onSubmit = handleMainSubmit((data) => {
    const callback = () => {
      dispatch(showBackdrop(true));
      dispatch(execute(insProductDealer(data)));

      setWaitSave(true);
    };
    dispatch(
      manageConfirmation({
        visible: true,
        question: t(langKeys.confirmation_save),
        callback,
      })
    );
  });

  return (
    <DialogZyx
      open={openModal}
      title={`${t(langKeys.new)} ${t(langKeys.dealer)}`}
      maxWidth="xl"
    >
      <form onSubmit={onSubmit}>
        <div className="row-zyx">
          <div className="col-8">
            <div className="row-zyx">
              <FieldSelect
                label={t(langKeys.dealer)}
                className="col-6"
                valueDefault={getValues("distributorid")}
                onChange={(value) =>{
                  setValue("distributorid",value?.manufacturerid)
                  setValue("distributor",value?.name)
                }}
                error={errors?.distributorid?.message}
                data={(multiData?.data?.[10]?.data||[]).filter(x=>x.type==="DISTRIBUIDOR")}
                optionValue="manufacturerid"
                optionDesc="name"
              />
              <FieldEdit
                label={t(langKeys.description)}
                valueDefault={getValues("distributor")}
                className="col-6"
                disabled
                inputProps={{ maxLength: 256 }}
              />
              <FieldSelect
                label={t(langKeys.manufacturer)}
                className="col-6"
                valueDefault={getValues("manufacturerid")}
                onChange={(value) =>{
                  setValue("manufacturerid",value?.manufacturerid)                  
                  setValue("manufacturer",value?.name)
                }}
                error={errors?.manufacturerid?.message}
                data={(multiData?.data?.[10]?.data||[]).filter(x=>x.type==="FABRICANTE")}
                optionValue="manufacturerid"
                optionDesc="name"
              />
              <FieldEdit
                label={t(langKeys.description)}
                valueDefault={getValues("manufacturer")}
                className="col-6"
                disabled
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={t(langKeys.model)}
                valueDefault={getValues("model")}
                className="col-12"
                error={errors?.model?.message}
                onChange={(value) => setValue("model",value)}
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={t(langKeys.catalog_nro)}
                valueDefault={getValues("catalognumber")}
                className="col-12"
                error={errors?.catalognumber?.message}
                onChange={(value) => setValue("catalognumber",value)}
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={`${t(langKeys.website)} ${t(langKeys.manufacturer)}`}
                valueDefault={getValues("webpage")}
                className="col-12"
                error={errors?.webpage?.message}
                onChange={(value) => setValue("webpage",value)}
                inputProps={{ maxLength: 256 }}
              />
              <FieldSelect
                label={t(langKeys.taxcodes)}
                className="col-12"
                valueDefault={getValues("taxeid")}
                onChange={(value) =>
                  setValue("taxeid",value?.domainid)
                }
                error={errors?.taxeid?.message}
                data={multiData?.data?.[11]?.data||[]}
                optionValue="domainid"
                optionDesc="domaindesc"
              />
            </div>
          </div>
          <div className="col-4">
            <div className="row-zyx">
              <FieldCheckbox
                label={`${t(langKeys.dealer)} ${t(langKeys.default)}`}
                className={`col-12`}
                valueDefault={getValues("isstockistdefault")}
                onChange={(value) => setValue("isstockistdefault",value)}
              />
              <FieldEdit
                label={`${t(langKeys.averagedeliverytime)} (${t(
                  langKeys.day
                )})`}
                valueDefault={getValues("averagedeliverytime")}
                className="col-12"
                type="number"
                error={errors?.averagedeliverytime?.message}
                onChange={(value) => setValue("averagedeliverytime",value)}
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={t(langKeys.last_price)}
                valueDefault={getValues("lastprice")}
                className="col-12"
                type="number"
                error={errors?.lastprice?.message}
                onChange={(value) => setValue("lastprice",value)}
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={t(langKeys.last_order_date)}
                valueDefault={getValues("lastorderdate")}
                className="col-12"
                type="date"
                error={errors?.lastorderdate?.message}
                onChange={(value) => setValue("lastorderdate",value)}
                inputProps={{ maxLength: 256 }}
              />
              <FieldSelect
                label={t(langKeys.purchase_unit)}
                className="col-12"
                valueDefault={getValues("unitbuy")}
                error={errors?.unitbuy?.message}
                onChange={(value) => setValue("unitbuy",value?.domainid)}
                data={multiData?.data?.[3]?.data||[]}
                optionValue="domainid"
                optionDesc="domaindesc"
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="contained"
            type="button"
            color="primary"
            startIcon={<ClearIcon color="secondary" />}
            style={{ backgroundColor: "#FB5F5F" }}
            onClick={() => {
              reset();
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
            onClick={onSubmit}
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

export default RegisterDealerDialog;
