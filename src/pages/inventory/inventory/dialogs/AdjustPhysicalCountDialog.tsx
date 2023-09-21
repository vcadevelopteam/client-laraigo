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
import { insProductAttribute } from "common/helpers";
import { execute, resetMainAux } from "store/main/actions";
import { FieldCheckbox } from 'components';
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import React from "react";
import TableZyx from "components/fields/table-simple";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const AdjustPhysicalCountDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);

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

const columns = React.useMemo(
  () => [
    {
      accessor: 'warehouseid',
      NoFilter: true,
      isComponent: true,
      minWidth: 60,
      width: '1%',
    },
    {
      Header: t(langKeys.product),
      accessor: "warehouse",
      width: "auto",
    },
    {
      Header: t(langKeys.warehouse),
      accessor: "current_balance",
      width: "auto",
    },
    {
      Header: t(langKeys.shelf),
      accessor: "overdueamount",
      width: "auto",
    },
    {
      Header: t(langKeys.batch),
      accessor: "subfamilydescription",
      width: "auto",
    },
    {
      Header: t(langKeys.physicalcount),
      accessor: "physicalcount",
      width: "auto",
    },
    {
      Header: t(langKeys.newcount),
      accessor: "newcount",
      width: "auto",
    },
    {
      Header: t(langKeys.dateofphysicalcount),
      accessor: "dateofphysicalcount",
      width: "auto",
    },
  ],
  []
);

  return (
    <DialogZyx open={openModal} title={t(langKeys.adjustphysicalcount)} maxWidth="xl">
      <form onSubmit={submitData}>
      <div className="row-zyx">
          <div className="row-zyx">
            <FieldEdit
              label={t(langKeys.dateofphysicalcount)}
              type="date"
              valueDefault={getValues('attributeid')}
              className="col-2"
              onChange={(value) => {setValue('attributeid', value)}}
              inputProps={{ maxLength: 256 }}
            />
            <Button
              className="col-1"
              variant="contained"
              color="primary"
              type="button"
              style={{ backgroundColor: "#55BD84" }}
            >
              {t(langKeys.apply)}
            </Button>
          </div>
          <div className="row-zyx">
            <TableZyx
              columns={columns}
              data={[]}
              download={false}
              filterGeneral={false}
              register={false}
            />
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

export default AdjustPhysicalCountDialog;