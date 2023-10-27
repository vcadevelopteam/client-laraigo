/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  TemplateIcons,
  Title,
} from "components";
import { langKeys } from "lang/keys";
import ListAltIcon from '@material-ui/icons/ListAlt';
import { DuplicateIcon } from "icons";
import { Dictionary, IFetchData } from "@types";
import { useDispatch } from "react-redux";
import { execute, exportData } from "store/main/actions";
import {
  showSnackbar,
  showBackdrop,
  manageConfirmation,
} from "store/popus/actions";
import { exportExcel, getWarehouseExport, importWarehouse, insWarehouse, templateMaker, uploadExcel } from "common/helpers";
import { useSelector } from "hooks";
import { Button } from "@material-ui/core";
import TablePaginated from "components/fields/table-paginated";

const selectionKey = "warehouseid";

interface WarehouseMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: any;
  fetchDataAux: any;
}

const InventoryConsumptionMainView: FC<WarehouseMainViewProps> = ({
  setViewSelected,
  setRowSelected,
  fetchData,
  fetchDataAux,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const executeResult = useSelector((state) => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);
  const mainPaginated = useSelector((state) => state.main.mainPaginated);
  const [totalrow, settotalrow] = useState(0);
  const [pageCount, setPageCount] = useState(0);
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
  const handleDuplicate = (row: Dictionary) => {
    setViewSelected("detail-view");
    setRowSelected({ row, edit: false });
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
        fetchData(fetchDataAux);
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
        execute(insWarehouse({ ...row, operation: "DELETE", status: "ELIMINADO" }))
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
        accessor: "warehouseid",
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
              ExtraICon={() => (
                <DuplicateIcon width={28} style={{ fill: "#7721AD" }} />
              )}
              extraOption={t(langKeys.duplicate)}
            />
          );
        },
      },
      {
        Header: t(langKeys.inventory_consumption),
        accessor: "inventory_consumption",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.transactiontype),
        accessor: "transactiontype",
        width: "auto",
      },
      {
        Header: t(langKeys.status),
        accessor: "status",
        width: "auto",
      }
    ],
    []
  );

  const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
    const columnsExport = columns.filter(x => !x.isComponent).map(x => ({
        key: x.accessor,
        alias: x.Header
    }))
    dispatch(exportData(getWarehouseExport({
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

  const handleUpload = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: any = await uploadExcel(file, undefined);
      if (data.length > 0) {
        let dataToSend = data.map((x: any) => ({
          ...x,
          warehouseid: 0,
          operation: "INSERT",
          type: "NINGUNO",
          status: "ACTIVO",
        }));
        dispatch(showBackdrop(true));
        dispatch(execute(importWarehouse(dataToSend)));
        setWaitUpload(true);
      }
    }
  };

  const handleTemplateWarehouse = () => {
    const data = [{}, {}, {}, {}, {}, {}];
    const header = [
      "name",
      "description",
      "address",
      "phone",
      "latitude",
      "longitude",
    ];
    exportExcel(
      `${t(langKeys.template)} ${t(langKeys.specifications)}`,
      templateMaker(data, header)
    );
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
            <Trans i18nKey={langKeys.inventory_consumption} />
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
        FiltersElement={(<div></div>)}
        initialSelectedRows={selectedRows}
        cleanSelection={cleanSelected}
        setCleanSelection={setCleanSelected}
        register={false}
      />
    </div>
  );
};

export default InventoryConsumptionMainView;
