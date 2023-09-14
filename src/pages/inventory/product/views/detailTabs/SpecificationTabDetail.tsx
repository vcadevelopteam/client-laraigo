/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import RegisterSpecificationDialog from "../../dialogs/RegisterSpecificationDialog";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { TemplateIcons } from "components";
import { Dictionary } from "@types";
import { execute } from "store/main/actions";
import { insProductAttribute } from "common/helpers";

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

interface SpecificationTabDetailProps {
  fetchData: any;
  row: any;
}

const SpecificationTabDetail: React.FC<SpecificationTabDetailProps> = ({fetchData, row}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalDealer, setOpenModalDealer] = useState(false);
  const dataAttributes = useSelector(state => state.main.mainAux);
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            fetchData();
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
  }, [executeRes, waitSave])

  const handleDelete = (data: Dictionary) => {
    dispatch(execute(insProductAttribute({
      ...data,
      status: 'ELIMINADO',
      type: 'NINGUNO',
      operation: 'DELETE'
    })))
    setWaitSave(true);
  }

  const columns = React.useMemo(
    () => [
      {
        accessor: 'productattributeid',
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
        Header: t(langKeys.attribute),
        accessor: "attributeid",
        width: "auto",
      },
      {
        Header: t(langKeys.value),
        accessor: "value",
        width: "auto",
      },
      {
        Header: t(langKeys.measureunit),
        accessor: "unitmeasureid",
        width: "auto",
      },
    ],
    []
  );
  function handleRegister() {
    setOpenModalDealer(true)
  }
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={dataAttributes.data}
          download={false}
          filterGeneral={false}
          register={true}
          handleRegister={handleRegister}
        />
      </div>
      <RegisterSpecificationDialog
        openModal={openModalDealer}
        setOpenModal={setOpenModalDealer}
        row={row}
        fetchData={fetchData}
      />
    </div>
  );
};

export default SpecificationTabDetail;
