/* eslint-disable react-hooks/exhaustive-deps */
import { Button, IconButton, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldEdit,
  FieldSelect,
  FieldView
} from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import TableSelectionDialog from "./TableSelectionDialog";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const AddInventoryConsumptionLineDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
  rowSelected: any;
}> = ({ openModal, setOpenModal, row, rowSelected }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openModalUser, setOpenModalUser] = useState(false);

  const { register, handleSubmit:handleMainSubmit, setValue, getValues, reset, formState: { errors }} = useForm({
    defaultValues: {
        inventorybalanceid: 0,
        productid: rowSelected?.productid||"",
        description: rowSelected?.description||"",
        originshelf: rowSelected?.originshelf||"",
        originbatch: rowSelected?.originbatch||"",
        ticket: rowSelected?.ticket||"",
        quantity: rowSelected?.quantity||0,
        line: rowSelected?.line||0,
        unitcost: rowSelected?.unitcost||0,
        dispatchto: rowSelected?.dispatchto||"",
        inventoryid: row?.inventoryid,
        createby: row?.createby,
        shelf: "",
        lotecode: "",
        comment: rowSelected?.comment||"",
        currentbalance: 0,
        recountphysical: 0,
        recountphysicaldate: new Date().toISOString().split('T')[0],
        realdate: rowSelected?.realdate||null,
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
  register('dispatchto');
  register('comment');
  register('shelflifedays', { validate: (value) =>((value && value>0) ? true : t(langKeys.field_required) + "") });
  register('currentbalance', { validate: (value) =>((value && value>0) ? true : t(langKeys.field_required) + "") });
  register('recountphysical', { validate: (value) =>((value>=0) ? true : t(langKeys.field_required) + "") });
  register('shelf', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('lotecode', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('recountphysicaldate', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('realdate');
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

const columnsSelectionUser = React.useMemo(
  () => [
    {
      Header: t(langKeys.name),
      accessor: "manufacturercode",
      width: "auto",
    },
    {
      Header: t(langKeys.lastname),
      accessor: "description",
      width: "auto",
    },
    {
      Header: t(langKeys.user),
      accessor: "family",
      width: "auto",
    },
    {
      Header: t(langKeys.email),
      accessor: "subfamily",
      width: "auto",
    },
  ],
  []
)

const columnsSelectionProduct = React.useMemo(
  () => [
    {
      Header: t(langKeys.product),
      accessor: "manufacturercode",
      width: "auto",
    },
    {
      Header: t(langKeys.description),
      accessor: "description",
      width: "auto",
    },
    {
      Header: t(langKeys.family),
      accessor: "family",
      width: "auto",
    },
    {
      Header: t(langKeys.subfamily),
      accessor: "subfamily",
      width: "auto",
    },
  ],
  []
)

  return (
    <form onSubmit={submitData}>
    <DialogZyx open={openModal} title={t(langKeys.inventoryconsumptionlines )} maxWidth="lg">
        <div className="row-zyx">
            <div className="row-zyx col-4">
              <FieldView
                  label={t(langKeys.line)}
                  className="col-6"
                  value={rowSelected?.line||0}
              />
            </div>
            <div className="row-zyx col-4">
              <FieldView
                  label={t(langKeys.originshelf)}
                  className="col-6"
                  value={rowSelected?.originshelf||""}
              />
            </div>
            <FieldView
                label={t(langKeys.quantity)}
                className="col-2"
                value={rowSelected?.quantity||0}
            />
            <FieldEdit
              label={t(langKeys.dispatchto)}
              type="text"
              valueDefault={getValues('dispatchto')}
              className="col-2"
              maxLength={50}
              onChange={(value) => {setValue('dispatchto', value)}}
            />
            <div className="row-zyx col-4">
              <FieldSelect
                label={t(langKeys.transactiontype)}
                className="col-6"
                data={[]}
                optionValue="manufacturerid"
                optionDesc="description"
                valueDefault={getValues("shelf")}
                onChange={(value) => setValue("shelf", value.manufacturerid)}  
              />
            </div>
            <div className="row-zyx col-4">
              <FieldView
                  label={t(langKeys.originbatch)}
                  className="col-6"
                  value={rowSelected?.originbatch||""}
              />
            </div>
            
            <FieldView
                label={t(langKeys.unitcost)}
                className="col-2"
                value={parseFloat(rowSelected?.unitcost)||0}
            />
            <FieldView
                label={t(langKeys.createdBy)}
                className="col-2"
                value={rowSelected?.createby||""}
            />
            <FieldView
                label={t(langKeys.product)}
                className="col-2"
                value={rowSelected?.productid||""}
            />
            <FieldView
                label={t(langKeys.description)}
                className="col-2"
                value={rowSelected?.description||""}
            />
            <div className="row-zyx col-4">
              <FieldView
                  label={t(langKeys.ticketapplication)}
                  className="col-2"
                  value={rowSelected?.ticket||""}
              />
            </div>
            <FieldView
                label={t(langKeys.linecost)}
                className="col-2"
                value={parseFloat(rowSelected?.unitcost||"0") * (rowSelected?.quantity||0)}
            />
            <FieldEdit
              label={t(langKeys.realdate)}
              type="date"
              valueDefault={getValues('realdate')}
              className="col-2"
              onChange={(value) => {setValue('realdate', value)}}
            />
            <div className="row-zyx col-6"></div>
            <div className="row-zyx col-6">
              <FieldEdit
                label={t(langKeys.ticket_comment)}
                type="text"
                maxLength={256}
                valueDefault={getValues('comment')}
                onChange={(value) => {setValue('comment', value)}}
              />
            </div>
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
    <TableSelectionDialog
      openModal={openModalProduct}
      setOpenModal={setOpenModalProduct}
      setRow={setSelectedProduct}
      data={[]}
      columns={columnsSelectionProduct}
      title={t(langKeys.warehouse)}
    />
    <TableSelectionDialog
      openModal={openModalUser}
      setOpenModal={setOpenModalUser}
      setRow={setSelectedUser}
      data={[]}
      columns={columnsSelectionUser}
      title={t(langKeys.user)}
    />
    </form>
  );
};

export default AddInventoryConsumptionLineDialog;