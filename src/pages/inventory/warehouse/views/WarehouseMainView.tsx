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
import { type } from 'os';

const selectionKey = "warehouseid";

interface WarehouseMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: any;
  fetchDataAux: any;
}
interface WarehouseMassData {
  name:string;
  description:string;
  address:string;
  phone:number|string;
  latitude:number|string;
  longitude:number|string;
}

const WarehouseMainView: FC<WarehouseMainViewProps> = ({
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
    setRowSelected({ row: null, edit: false, duplicated: false });
  };

  const handleEdit = (row: Dictionary) => {
    setViewSelected("detail-view");
    setRowSelected({ row, edit: true, duplicated: false });
  };
  const handleDuplicate = (row: Dictionary) => {
    setViewSelected("detail-view");
    setRowSelected({ row, edit: false, duplicated: true });
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
        Header: t(langKeys.warehouse),
        accessor: "name",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
        Cell: (props: any) => {
          const row = props.cell.row.original;
          if(row.description.length>50){
            return `${row.description.substring(0, 50)}...`
          }else{
            return row.description;
          }
      }
      },
      {
        Header: t(langKeys.physicaladdress),
        accessor: "address",
        width: "auto",
      },
      {
        Header: t(langKeys.phone),
        accessor: "phone",
        width: "auto",
      },
      {
        Header: t(langKeys.latitude),
        accessor: "latitude",
        width: "auto",
        type:'number'
      },
      {
        Header: t(langKeys.longitude),
        accessor: "longitude",
        width: "auto",
        type:'number'
      },
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
  const isValidData = (element:WarehouseMassData) => {
    return (
      typeof element.name === 'string' && element.name.length > 0 &&
      typeof element.description === 'string' && element.description.length <= 256 &&
      typeof element.address === 'string' && element.address.length > 0 &&
      Number.isInteger(parseInt(element.phone.toString())) &&
      !Number.isNaN(parseFloat(element.latitude.toString())) &&
      !Number.isNaN(parseFloat(element.longitude.toString())) 
    );
  };

  const handleUpload = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: WarehouseMassData[] = (await uploadExcel(file, undefined)) as WarehouseMassData[];
      if (data.length > 0) {
        const error = data.some((element) => !isValidData(element));
        if(!error){
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
        }else{                 
          dispatch(
            showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) })
          );
        }
      }
    }
  };

  const handleTemplateWarehouse = () => {
    const data = [{testname:"testname"}, {testdesc:"testdesc"}, {testdesclong:"testdesclong"}, {testaddress:"testaddress"}, {"999999999":"999999999"}, {"12":"12"}, {"15":"15"}];
    const header = [
      "name",
      "description",
      "descriptionlarge",
      "address",
      "phone",
      "latitude",
      "longitude",
    ];
    exportExcel(
      `${t(langKeys.template)} ${t(langKeys.warehouses)}`,
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
            <Trans i18nKey={langKeys.warehouse} />
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
        importCSV={handleUpload}
        FiltersElement={(
          <Button
              variant="contained"
              color="primary"
              disabled={mainPaginated.loading}
              startIcon={<ListAltIcon color="secondary" />}
              onClick={handleTemplateWarehouse}
              style={{ backgroundColor: "#55BD84", marginLeft: "auto" }}
          >
              <Trans i18nKey={langKeys.template} />
          </Button>
      )}
      />
    </div>
  );
};

export default WarehouseMainView;