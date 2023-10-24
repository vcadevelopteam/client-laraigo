/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { useSelector } from "hooks";
import { FieldErrors } from "react-hook-form";
import RegisterClientDialog from "../../dialogs/RegisterClientDialog";
import { Dictionary } from "@types";
import { TemplateIcons } from "components";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import { customerByPartnerIns } from "common/helpers";

const useStyles = makeStyles((theme) => ({
  containerDetail: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: "#fff",
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

interface RowSelected {
  row2: Dictionary | null;
  edit: boolean;
}

interface ClientsTabDetailProps {
  fetchdata: any
  errors: FieldErrors<any>
  row: any
}

const ClientsTabDetail: React.FC<ClientsTabDetailProps> = ({fetchdata, errors, row}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dataCustomers = useSelector(state => state.main.mainAux);
  const [openModal, setOpenModal] = useState(false);
  const [waitSave, setWaitSave] = useState(false);
  const dispatch = useDispatch();
  const executeRes = useSelector(state => state.main.execute);
  const [selectedRow, setSelectedRow] = useState<RowSelected>({
    row2: null,
    edit: false,
  });

  useEffect(() => {
    fetchdata();
  }, [])

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
            fetchdata();
            dispatch(showBackdrop(false));
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.customer).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

  const handleDelete = (row: Dictionary) => {
    const callback = () => {
      dispatch(
        execute(customerByPartnerIns({ ...row, operation: "DELETE", status: "ELIMINADO", id: row.customerpartnerid }))
      );
      dispatch(showBackdrop(true));
      setWaitSave(true);
    };

    dispatch(
      manageConfirmation({
        visible: true,
        question: t(langKeys.confirmation_delete),
        callback,
      })
    );
  };

  const columns = React.useMemo(
    () => [
      {
        accessor: "inventoryid",
        NoFilter: true,
        isComponent: true,
        minWidth: 60,
        width: "1%",
        Cell: (props: any) => {
          const row = props.cell.row.original;
          return (
            <TemplateIcons
              deleteFunction={() => handleDelete(row)}
              editFunction={() => handleEdit(row)}
            />
          );
        },
      },
      {
        Header: t(langKeys.corporation),
        accessor: "corporation",
        width: "auto",
      },
      {
        Header: t(langKeys.organization),
        accessor: "organization",
        width: "auto",
      },
      {
        Header: t(langKeys.partnertype),
        accessor: "typepartner",
        width: "auto",
      },
      {
        Header: t(langKeys.monthlyplancost),
        accessor: "plancost",
        width: "auto",
      },
      {
        Header: t(langKeys.billingplan),
        accessor: "billingplan",
        width: "auto",
      },
      {
        Header: t(langKeys.active),
        accessor: "status",
        width: "auto",
      }
    ],
    []
  );
  function handleRegister() {
    setSelectedRow({row2: null, edit: false})
    setOpenModal(true)
  }
  const handleEdit = (row2: Dictionary) => {
    setSelectedRow({ row2, edit: true });
    setOpenModal(true)
  }

  return (
    <>
      <div className={classes.containerDetail}>
          <TableZyx
            columns={columns}
            titlemodule={t(langKeys.clients, { count: 2 })}
            data={dataCustomers.data}
            download={true}
            onClickRow={handleEdit}
            register={true}
            handleRegister={handleRegister}
          />
      </div>
      <RegisterClientDialog
        openModal={openModal}
        setOpenModal={setOpenModal}
        row={row}
        fetchData={fetchdata}
        data={selectedRow}
      />
    </>
  );
};

export default ClientsTabDetail;
