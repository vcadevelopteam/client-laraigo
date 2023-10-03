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
import { getInventoryBooking, insProductAttribute } from "common/helpers";
import { execute, getCollectionAux2, resetMainAux } from "store/main/actions";
import { TemplateIcons } from 'components';
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import TableZyx from "components/fields/table-simple";
import { Dictionary } from "@types";
import AddReservationDialog from "./AddReservationDialog";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const ManageReservationsDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const [openModalAddReservation, setOpenModalAddReservation] = useState(false);
  const data = useSelector(state => state.main.mainAux2);

  useEffect(() => {
    if(openModal){
      dispatch(getCollectionAux2(getInventoryBooking(row?.inventoryid)));
    }
  }, [openModal]);

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

const handleDelete = (data: Dictionary) => {
  /*dispatch(execute(insProductAlternative({
    productalternativeid: data.productalternativeid,
    productid: data.productid,
    productaltid: data.productid,
    status: 'ELIMINADO',
    type: 'NINGUNO',
    operation: 'DELETE'
  })))*/
  setWaitSave(true);
}

const columns = React.useMemo(
  () => [
    {
      accessor: 'inventorywarehouseid',
      NoFilter: true,
      isComponent: true,
      minWidth: 60,
      width: '1%',
      Cell: (props: any) => {
          const row = props.cell.row.original;
          return (
              <TemplateIcons
                  deleteFunction={() => handleDelete(row)}
              />
          )
      }
    },
    {
      Header: t(langKeys.ticketapplication),
      accessor: "ticketid",
      width: "auto",
    },
    {
      Header: t(langKeys.reservationtype),
      accessor: "bookingtype",
      width: "auto",
    },
    {
      Header: t(langKeys.product),
      accessor: "productcode",
      width: "auto",
    },
    {
      Header: t(langKeys.description),
      accessor: "productdescription",
      width: "auto",
    },
    {
      Header: t(langKeys.warehouse),
      accessor: "warehousename",
      width: "auto",
    },
    {
      Header: t(langKeys.reservedquantity),
      accessor: "bookingquantity",
      width: "auto",
    },
    {
      Header: t(langKeys.applicationdate),
      accessor: "createdate",
      width: "auto",
    }
  ],
  []
);

function handleOpenAddReservationModal() {
  setOpenModalAddReservation(true)
}

  return (
    <>
      <DialogZyx open={openModal} title={t(langKeys.managereservations)} maxWidth="lg">
        <div className="row-zyx">
          <TableZyx
            columns={columns}
            data={data?.data}
            loading={data?.loading}
            download={false}
            filterGeneral={false}
            register={true}
            handleRegister={handleOpenAddReservationModal}
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
        </div>
      </DialogZyx>
      <AddReservationDialog
        openModal={openModalAddReservation}
        setOpenModal={setOpenModalAddReservation}
        row={row}
      />
    </>
  );
};

export default ManageReservationsDialog;