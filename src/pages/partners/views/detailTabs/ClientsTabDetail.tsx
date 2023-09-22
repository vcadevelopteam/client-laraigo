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
import { manageConfirmation, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";

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

interface ClientsTabDetailProps {
  fetchdata: any
  errors: FieldErrors<any>
  row: any
}

const ClientsTabDetail: React.FC<ClientsTabDetailProps> = ({fetchdata, errors, row}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dataProducts = useSelector(state => state.main.mainAux);
  const [openModal, setOpenModal] = useState(false);
  const [waitSave, setWaitSave] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchdata();
  }, [])

  const handleDelete = (row: Dictionary) => {
    const callback = () => {
      /*dispatch(
        execute(insWarehouse({ ...row, operation: "DELETE", status: "ELIMINADO" }))
      );*/
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
            />
          );
        },
      },
      {
        Header: t(langKeys.corporation),
        accessor: "productdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.organization),
        accessor: "descriptionlarge",
        width: "auto",
      },
      {
        Header: t(langKeys.partnertype),
        accessor: "standarcost",
        width: "auto",
      },
      {
        Header: t(langKeys.billingplan),
        accessor: "averagecost",
        width: "auto",
      },
      {
        Header: t(langKeys.active),
        accessor: "current_balance",
        width: "auto",
      }
    ],
    []
  );
  function handleRegister() {
    setOpenModal(true)
  }
  const handleEdit = (row: Dictionary) => {

  }

  return (
    <>
      <div className={classes.containerDetail}>
          <TableZyx
            columns={columns}
            titlemodule={t(langKeys.clients, { count: 2 })}
            data={dataProducts.data}
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
      />
    </>
  );
};

export default ClientsTabDetail;
