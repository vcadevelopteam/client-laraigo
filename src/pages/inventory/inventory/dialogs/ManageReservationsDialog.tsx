/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  TemplateIcons
} from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { getInventoryBooking, insInventoryBooking } from "common/helpers";
import { execute, getCollectionAux2 } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
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
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const [openModalAddReservation, setOpenModalAddReservation] = useState(false);
  const data = useSelector(state => state.main.mainAux2);


  const fetchData = () => {
    dispatch(getCollectionAux2(getInventoryBooking(row?.inventoryid)))
  }
  useEffect(() => {
    if(openModal){
      fetchData()
    }
  }, [openModal]);

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            fetchData()
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code ?? "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

const handleDelete = (row: Dictionary) => {
  const callback = () => {
      dispatch(execute(insInventoryBooking({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
      dispatch(showBackdrop(true));
      setWaitSave(true);
  }

  dispatch(manageConfirmation({
      visible: true,
      question: t(langKeys.confirmation_delete),
      callback
  }))
}

const columns = React.useMemo(
  () => [
    {
      accessor: 'inventorybookingid',
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
        fetchData={fetchData}
      />
    </>
  );
};

export default ManageReservationsDialog;