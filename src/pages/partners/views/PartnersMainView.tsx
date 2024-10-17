import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TemplateIcons } from "components";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import TableZyx from "components/fields/table-simple";
import {
  showSnackbar,
  showBackdrop,
  manageConfirmation,
} from "store/popus/actions";
import { partnerIns } from "common/helpers";
import { useSelector } from "hooks";
import { CellProps } from "react-table";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  }
}));

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}
interface PartnersMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: RowSelected) => void;
  fetchData: () => void;
}

const PartnersMainView: FC<PartnersMainViewProps> = ({
  setViewSelected,
  setRowSelected,
  fetchData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const executeResult = useSelector((state) => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);
  const main = useSelector((state) => state.main.mainData);
  const [waitExport, setWaitExport] = useState(false);
  const resExportData = useSelector(state => state.main.exportData);
  const [waitUpload, setWaitUpload] = useState(false);  
  const importRes = useSelector((state) => state.main.execute);

  const handleRegister = () => {
    setViewSelected("detail-view");
    setRowSelected({ row: null, edit: false });
  };

  const handleEdit = (row: Dictionary) => {
    setViewSelected("detail-view");
    setRowSelected({ row, edit: true });
  };

  useEffect(() => {
    if (waitUpload) {
      if (!importRes.loading && !importRes.error) {
        dispatch(
          showSnackbar({
            show: true,
            severity: "success",
            message: t(langKeys.successful_import),
          })
        );
        dispatch(showBackdrop(false));
        setWaitUpload(false);
        fetchData();
      } else if (importRes.error) {
        dispatch(
          showSnackbar({
            show: true,
            severity: "error",
            message: t(importRes.code || "error_unexpected_error"),
          })
        );
        dispatch(showBackdrop(false));
        setWaitUpload(false);
      }
    }
  }, [importRes, waitUpload]);

    const formatNumberWithTwoDecimals = (value: number | string) => {
        const num = Number(value);
        return num === 0 ? '0.00' : num.toFixed(2);
    };

  const handleDelete = (row: Dictionary) => {
    const callback = () => {
      dispatch(
        execute(partnerIns({ ...row, operation: "DELETE", status: "ELIMINADO", id: row.partnerid, type: "NINGUNO", signaturedate: new Date(row.signaturedate) }))
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

  useEffect(() => {
    if (waitExport) {
        if (!resExportData.loading && !resExportData.error) {
            dispatch(showBackdrop(false));
            setWaitExport(false);
            resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
        } else if (resExportData.error) {
            const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            dispatch(showBackdrop(false));
            setWaitExport(false);
        }
    }
}, [resExportData, waitExport]);

  useEffect(() => {
    if (waitSave) {
      if (!executeResult.loading && !executeResult.error) {
        dispatch(
          showSnackbar({
            show: true,
            severity: "success",
            message: t(langKeys.successful_delete),
          })
        );
        fetchData();
        dispatch(showBackdrop(false));
        setWaitSave(false);
      } else if (executeResult.error) {
        const errormessage = t(executeResult.code || "error_unexpected_error", {
          module: t(langKeys.domain).toLocaleLowerCase(),
        });
        dispatch(
          showSnackbar({ show: true, severity: "error", message: errormessage })
        );
        dispatch(showBackdrop(false));
        setWaitSave(false);
      }
    }
  }, [executeResult, waitSave]);

  const columns = React.useMemo(
    () => [
      {
        accessor: "partnerid",
        NoFilter: true,
        isComponent: true,
        minWidth: 60,
        width: "1%",
        Cell: (props: CellProps<Dictionary>) => {
          const row = props.cell.row.original || {}; 
          return (
            <TemplateIcons
              deleteFunction={() => handleDelete(row)}
              editFunction={() => handleEdit(row)}
            />
          );
        },
      },
      {
        Header: t(langKeys.partner),
        accessor: "company",
        width: "auto",
      },
      {
        Header: t(langKeys.isenterprise),
        accessor: "enterprisepartner",
        width: "auto",
        type: 'boolean',
        sortType: 'basic',
        Cell: (props: CellProps<Dictionary>) => {
            const { enterprisepartner } = props.cell.row.original || {}; 
            return enterprisepartner ? t(langKeys.yes) : "No"
        }
      },
      {
        Header: t(langKeys.billingperiod_billingcurrency),
        accessor: "billingcurrency",
        width: "auto",
      },
      {
        Header: t(langKeys.monthlyplancost),
        accessor: "montlyplancost",
        width: "auto",
        Cell: (props: CellProps<Dictionary>) => {
            const { montlyplancost } = props.cell.row.original || {};
            return formatNumberWithTwoDecimals(montlyplancost);
        },
      },
      {
        Header: t(langKeys.contactsincludedinplan),
        accessor: "numberplancontacts",
        width: "auto",
      },
      {
        Header: t(langKeys.additionalcontactcalculationtype),
        accessor: "typecalculation",
        width: "auto",
      },
      {
        Header: t(langKeys.numbercontactsperbag),
        accessor: "numbercontactsbag",
        width: "auto",
      },
      {
        Header: t(langKeys.priceperbag),
        accessor: "priceperbag",
        width: "auto",
        Cell: (props: CellProps<Dictionary>) => {
            const { priceperbag } = props.cell.row.original || {};
            return formatNumberWithTwoDecimals(priceperbag);
        },
      },
      {
        Header: t(langKeys.puadditionalcontacts),
        accessor: "puadditionalcontacts",
        width: "auto",
      },
    ],
    []
  );

  return (
    <div className={classes.main}>
      <TableZyx
        columns={columns}
        titlemodule={t(langKeys.partners, { count: 2 })}
        data={main.data}
        download={true}
        onClickRow={handleEdit}
        register={true}
        handleRegister={handleRegister}
      />
    </div>
  );
};

export default PartnersMainView;
