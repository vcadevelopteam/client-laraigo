/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import ChangeStatusDialog from "../dialogs/ChangeStatusDialog";
import { Trans, useTranslation } from "react-i18next";
import {
  TemplateIcons,
  Title,
} from "components";
import { langKeys } from "lang/keys";
import { DuplicateIcon } from "icons";
import { makeStyles } from "@material-ui/core/styles";
import { Dictionary, IFetchData } from "@types";
import { useDispatch } from "react-redux";
import { execute, exportData } from "store/main/actions";
import {
  showSnackbar,
  showBackdrop,
  manageConfirmation,
} from "store/popus/actions";
import { duplicateProduct, getProductsExport, insProduct } from "common/helpers";
import { useSelector } from "hooks";
import { Button } from "@material-ui/core";
import BackupIcon from "@material-ui/icons/Backup";
import TablePaginated from "components/fields/table-paginated";
import TemplateImportDialog from "../dialogs/TemplateImportDialog";
import ImportDialog from "../dialogs/ImportDialog";

const selectionKey = "productid";

interface ProductMasterMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: any;
  fetchDataAux: any;
}

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
  containerHeader: {
    padding: theme.spacing(1),
  },
  itemDate: {
    minHeight: 40,
    height: 40,
    border: "1px solid #bfbfc0",
    borderRadius: 4,
    color: "rgb(143, 146, 161)",
  },
}));

const ProductMasterMainView: FC<ProductMasterMainViewProps> = ({
  setViewSelected,
  setRowSelected,
  fetchData,
  fetchDataAux,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const executeResult = useSelector((state) => state.main.execute);
  const mainPaginated = useSelector((state) => state.main.mainPaginated);
  const [waitSave, setWaitSave] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);
  const [totalrow, settotalrow] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalTemplate, setOpenModalTemplate] = useState(false);
  const [waitExport, setWaitExport] = useState(false);
  const resExportData = useSelector(state => state.main.exportData);

  const handleRegister = () => {
    setViewSelected("detail-view");
    setRowSelected({ row: null, edit: false, duplicated: false });
  };

  const handleEdit = (row: Dictionary) => {
    setViewSelected("detail-view");
    setRowSelected({ row, edit: true, duplicated: false });
  };
  const handleDuplicate = (row: Dictionary) => {
    setRowSelected({ row, edit: false, duplicated: true });
    setViewSelected("detail-view");
  };

  const handleDelete = (row: Dictionary) => {
    const callback = () => {
      dispatch(
        execute(insProduct({ ...row, operation: "DELETE", status: "ELIMINADO" }))
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
    if (!mainPaginated.loading && !mainPaginated.error) {
      setPageCount(
        fetchDataAux.pageSize
          ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize)
          : 0
      );
      settotalrow(mainPaginated.count);
    }
  }, [mainPaginated]);

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
        fetchData(fetchDataAux);
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
        accessor: "domainid",
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
              extraFunction={() => handleDuplicate(row)}
              extraOption={t(langKeys.duplicate)}
              ExtraICon={() => <DuplicateIcon width={28} style={{ fill: '#7721AD' }} />}
            />
          );
        },
      },
      {
        Header: t(langKeys.product),
        accessor: "productcode",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.type),
        accessor: "producttype",
        width: "auto",
      },
      {
        Header: t(langKeys.family),
        accessor: "familydescription",
        width: "auto",
      },
      {
        Header: t(langKeys.subfamily),
        accessor: "subfamilydescription",
        width: "auto",
      },
      {
        Header: t(langKeys.purchase_unit),
        accessor: "unitbuydescription",
        width: "auto",
      },
      {
        Header: t(langKeys.dispatch_unit),
        accessor: "unitdispacthdescription",
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

  const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
    const columnsExport = columns.filter(x => !x.isComponent).map(x => ({
        key: x.accessor,
        alias: x.Header
    }))
    dispatch(exportData(getProductsExport({
        filters: {
            ...filters,
        },
        sorts,
        startdate: daterange.startDate!,
        enddate: daterange.endDate!,
    }), "", "excel", false, columnsExport));
    dispatch(showBackdrop(true));
    setWaitExport(true);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          flexDirection: "row",
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <Title>
            <Trans i18nKey={langKeys.productMaster} />
          </Title>
        </div>
      </div>
      <TablePaginated
        columns={columns}
        data={mainPaginated.data}
        totalrow={totalrow}
        loading={mainPaginated.loading}
        pageCount={pageCount}
        filterrange={true}
        download={true}
        initialStartDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()}
        initialEndDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime()}
        fetchData={fetchData}
        exportPersonalized={triggerExportData}
        useSelection={true}
        selectionKey={selectionKey}
        setSelectedRows={setSelectedRows}
        filterRangeDate="today"
        onClickRow={handleEdit}
        handleRegister={handleRegister}
        filterGeneral={false}
        initialSelectedRows={selectedRows}
        cleanSelection={cleanSelected}
        setCleanSelection={setCleanSelected}
        register={true}
        ButtonsElement={() => (
          <div
            className={classes.containerHeader}
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div>
                <Button
                  className={classes.button}
                  variant="contained"
                  component="span"
                  color="primary"
                  disabled={!Object.keys(selectedRows).length}
                  onClick={() => setOpenModalChangeStatus(true)}
                  style={{ backgroundColor: "#55BD84" }}
                >
                  <Trans i18nKey={langKeys.change_status} />
                </Button>
              </div>
              <div>
                <Button
                  className={classes.button}
                  variant="contained"
                  component="span"
                  color="primary"
                  onClick={() => setOpenModalImport(true)}
                  startIcon={<BackupIcon color="secondary" />}
                  style={{ backgroundColor: "#55BD84" }}
                >
                  <Trans i18nKey={langKeys.import} />
                </Button>
              </div>
              <div>
                <Button
                  className={classes.button}
                  variant="contained"
                  component="span"
                  color="primary"
                  onClick={() => setOpenModalTemplate(true)}
                  style={{ backgroundColor: "#55BD84" }}
                >
                  <Trans i18nKey={langKeys.template} />
                </Button>
              </div>
            </div>
          </div>
        )}
      />
      <TemplateImportDialog 
        openModal={openModalTemplate}
        setOpenModal={setOpenModalTemplate}
      />
      <ImportDialog 
        openModal={openModalImport}
        setOpenModal={setOpenModalImport}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
      <ChangeStatusDialog
        openModal={openModalChangeStatus}
        setOpenModal={setOpenModalChangeStatus}
        massive={true}
        selectedRows={selectedRows}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    </div>
  );
};

export default ProductMasterMainView;
