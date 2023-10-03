/* eslint-disable react-hooks/exhaustive-deps */
import { Button, IconButton, makeStyles } from "@material-ui/core";
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
import { Add } from '@material-ui/icons';
import { execute } from "store/main/actions";
import { insProductDealer } from "common/helpers";
import TableSelectionDialog from "pages/inventory/product/dialogs/TableSelectionDialog";

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
  const multiDataAux = useSelector(state => state.main.multiDataAux);
  const [openModalManufacturer, setOpenModalManufacturer] = useState(false);
  const [openModalDistributor, setOpenModalDistributor] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);

  const columnsSelectionTable = React.useMemo(
    () => [
      {
        Header: t(langKeys.company),
        accessor: "manufacturercode",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.status),
        accessor: "status",
        width: "auto",
      },
    ],
    []
  )

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
    register("manufacturerid", { validate: (value) => ((value && value>0) ? true : t(langKeys.field_required) + "") });
    register("distributorid", { validate: (value) =>  ((value && value>0) ? true : t(langKeys.field_required) + "") });
    register("catalognumber");
    register("webpage");
    register("taxeid");
    register("isstockistdefault");
    register("averagedeliverytime", { validate: (value) => ((value && value>0) ? true : t(langKeys.field_required) + "") });
    register("lastprice", { validate: (value) => ((value && value>=0) ? true : t(langKeys.no_negative) + "") });
    register("lastorderdate");
    register("unitbuy");

  }, [openModal,register,getValues]);

  useEffect(() => {
    setValue("manufacturerid",selectedDistributor?.manufacturerid)
    setValue("manufacturer",selectedDistributor?.name)
  }, [selectedManufacturer])
  useEffect(() => {
    setValue("distributorid",selectedDistributor?.manufacturerid)
    setValue("distributor",selectedDistributor?.name)
  }, [selectedDistributor])

  useEffect(() => {
    if (waitSave) {
      if (!executeRes.loading && !executeRes.error) {
        dispatch(showSnackbar({show: true,severity: "success",message: t(langKeys.successful_register),}));
        dispatch(showBackdrop(false));
        fetchData()
        closeModal()
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

  function closeModal(){
    setOpenModal(false);
    setSelectedDistributor(null)
    setSelectedManufacturer(null)
    reset();
  }

  return (
    <>
    <DialogZyx
      open={openModal}
      title={`${t(langKeys.new)} ${t(langKeys.dealer)}`}
      maxWidth="xl"
    >
      <form onSubmit={onSubmit}>
        <div className="row-zyx">
          <div className="col-8">
            <div className="row-zyx">
              <FieldEdit
                label={t(langKeys.dealer)}
                valueDefault={selectedDistributor?.manufacturercode||""}
                className="col-6"
                disabled
                error={errors?.distributorid?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={()=>{setOpenModalDistributor(true)}} edge="end">
                      <Add  />
                    </IconButton>
                  ),
                }}
              />
              <FieldEdit
                label={t(langKeys.description)}
                valueDefault={selectedDistributor?.description||""}
                className="col-6"
                disabled
              />
              <FieldEdit
                label={t(langKeys.manufacturer)}
                valueDefault={selectedManufacturer?.manufacturercode||""}
                className="col-6"
                disabled
                error={errors?.manufacturerid?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={()=>{setOpenModalManufacturer(true)}} edge="end">
                      <Add  />
                    </IconButton>
                  ),
                }}
              />
              <FieldEdit
                label={t(langKeys.description)}
                valueDefault={selectedManufacturer?.description||""}
                className="col-6"
                disabled
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
                data={multiDataAux?.data?.[0]?.data||[]}
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
            onClick={closeModal}
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
    <TableSelectionDialog
      openModal={openModalDistributor}
      setOpenModal={setOpenModalDistributor}
      setRow={setSelectedDistributor}
      data={(multiDataAux?.data?.[4]?.data||[]).filter(x=>x.typemanufacter_desc ==="D")}
      columns={columnsSelectionTable}
      title={t(langKeys.dealer)}
    />
    <TableSelectionDialog
      openModal={openModalManufacturer}
      setOpenModal={setOpenModalManufacturer}
      setRow={setSelectedManufacturer}
      data={(multiDataAux?.data?.[4]?.data||[]).filter(x=>x.typemanufacter_desc ==="F")}
      columns={columnsSelectionTable}
      title={t(langKeys.manufacturer)}
    />
    </>
  );
};

export default RegisterDealerDialog;
