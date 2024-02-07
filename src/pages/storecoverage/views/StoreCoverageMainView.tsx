import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TemplateBreadcrumbs,  TemplateIcons,  TitleDetail,} from "components";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import { showSnackbar,  showBackdrop,  manageConfirmation,} from "store/popus/actions";
import { insStore } from "common/helpers";
import { useSelector } from "hooks";
import TableZyx from "components/fields/table-simple";
import { CellProps } from "react-table";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainPage: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {   
    marginTop: 4,
    marginLeft: theme.spacing(2),

  }
}));
interface InventoryMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: () => void;
}

const StoreCoverageMainView: FC<InventoryMainViewProps> = ({
  setViewSelected,
  setRowSelected,
  fetchData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const executeResult = useSelector((state) => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);
  const mainCollection = useSelector((state) => state.main.mainData); 
  const [waitExport, setWaitExport] = useState(false);
  const resExportData = useSelector(state => state.main.exportData);
  const [waitUpload, setWaitUpload] = useState(false);  
  const importRes = useSelector((state) => state.main.execute);

  const arrayBread = [
    { id: "main-view", name: t(langKeys.delivery) },
    { id: "detail-view", name: t(langKeys.storecoveragearea) },
  ];

  const handleRegister = () => {
    setViewSelected("detail-view");
    setRowSelected({ row: null, edit: false });
  };

  const handleEdit = (row: Dictionary) => {
    setViewSelected("detail-view");
    setRowSelected({ row, edit: true });
  };

  useEffect(() => {
    fetchData()
  },[]);

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

  const handleDelete = (row: Dictionary) => {
    const callback = () => {
      dispatch(
        execute(insStore({ ...row, id: row.storeid, coveragearea: JSON.stringify(row.coveragearea), operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" }))
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
        accessor: "storeid",
        NoFilter: true,
        disableGlobalFilter: true,
        isComponent: true,
        minWidth: 60,
        width: "1%",
        Cell: (props: CellProps<Dictionary>) => {
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
        Header: t(langKeys.organization),
        accessor: "organization",
        width: "auto",
      },
      {
        Header: t(langKeys.storezonename),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.telephonenumber),
        accessor: "phone",
        width: "auto",
      },
      {
        Header: t(langKeys.address),
        accessor: "address",
        width: "auto",
      },
      {
        Header: t(langKeys.warehouse),
        accessor: "warehouse",
        width: "auto",
      },
      {
        Header: t(langKeys.coveragearea),
        accessor: "area",
        width: "auto",
      },
      {
        Header: t(langKeys.status),
        accessor: "status",
        width: "auto",
      },
    ],
    []
  );

  return (
    <div className={classes.mainPage}>
      <div className={classes.header}>
        <div style={{ flexGrow: 1 }}>
         <TemplateBreadcrumbs
            breadcrumbs={arrayBread}
          />
          <TitleDetail
            title={ t(langKeys.storecoveragearea)}
          />
        </div>
      </div>
    
      <TableZyx
        columns={columns}
        data={mainCollection.data}     
        loading={mainCollection.loading}      
        onClickRow={handleEdit}
        handleRegister={handleRegister}
        register={true}
      />
    </div>
  );
};

export default StoreCoverageMainView;
