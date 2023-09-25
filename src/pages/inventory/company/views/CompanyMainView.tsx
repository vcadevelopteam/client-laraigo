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
import { exportExcel, getCompanyExport, importManufacturer, insWarehouse, templateMaker, uploadExcel } from "common/helpers";
import { useSelector } from "hooks";
import { Button } from "@material-ui/core";
import TablePaginated from "components/fields/table-paginated";

const selectionKey = "manufacturerid";

interface CompanyMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: any;
  fetchDataAux: any;
}
interface InsertCompany {
  manufacturercode: string;
  description: string;
  descriptionlarge: string;
  typemanufacterid: number;
  currencyid: number;
  clientenumbers: string;
  taxeid: number;
  beginpage: string;
  ispaymentdelivery: string;
}
const CompanyMainView: FC<CompanyMainViewProps> = ({
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
  const multiData = useSelector(state => state.main.multiDataAux);

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
    setRowSelected({ row:{...row, name:""}, edit: false, duplicated: true });
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
        accessor: "manufacturerid",
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
        Header: t(langKeys.company),
        accessor: "manufacturercode",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.type),
        accessor: "typemanufacter_desc",
        width: "auto",
      },
      {
        Header: `N° ${t(langKeys.client)}`,
        accessor: "clientenumbers",
        width: "auto",
      },
      {
        Header: t(langKeys.homepage),
        accessor: "beginpage",
        width: "auto",
      },
      {
        Header: t(langKeys.currency),
        accessor: "currency_desc",
        width: "auto",
      },
    ],
    []
  );

  const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
    const columnsExport = columns.filter(x => !x.isComponent).map(x => ({
        key: x.accessor,
        alias: x.Header
    }))
    dispatch(exportData(getCompanyExport({
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

  const isValidData = (element:InsertCompany) => {
    const validDomainTypeManufacturer = multiData.data[0].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainTaxes = multiData.data[2].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainCurrency = multiData.data[1].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );

    return (
      ((element.ispaymentdelivery === 'true')||(element.ispaymentdelivery === 'false')) &&
      typeof element.beginpage === 'string' && element.beginpage.length <= 136 &&
      validDomainTaxes[element.taxeid] &&
      typeof element.clientenumbers === 'string' && element.clientenumbers.length <= 136 &&
      validDomainCurrency[element.currencyid] &&
      validDomainTypeManufacturer[element.typemanufacterid] &&
      typeof element.description === 'string' && element.description.length <= 256 &&
      typeof element.descriptionlarge === 'string' && element.descriptionlarge.length <= 1000 &&
      typeof element.manufacturercode === 'string' && element.manufacturercode.length <= 20
    );
  };

  const handleUpload = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: InsertCompany[] = (await uploadExcel(file, undefined)) as InsertCompany[];
      if (data.length > 0) {
        const error = data.some((element) => !isValidData(element));
        if(!error){
          let dataToSend = data.map((x: any) => ({
            ...x,
            manufacturerid: 0,
            operation: "INSERT",
            type: "NINGUNO",
            status: "ACTIVO",
          }));
          dispatch(showBackdrop(true));
          dispatch(execute(importManufacturer(dataToSend)));
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
    const data = [{}, {}, {}, 
      multiData.data[0].data.reduce((a,d) => ({...a, [d.domainid]: `${d.domaindesc}`}),{}),
      multiData.data[1].data.reduce((a,d) => ({...a, [d.domainid]: `${d.domaindesc}`}),{}),
       {}, 
       multiData.data[2].data.reduce((a,d) => ({...a, [d.domainid]: `${d.domaindesc}`}),{}),
       {},
       {true:"true",false:"false"},
      ];
    const header = [
      "manufacturercode",
      "description",
      "descriptionlarge",
      "typemanufacterid",
      "currencyid",
      "clientenumbers",
      "taxeid",
      "beginpage",
      "ispaymentdelivery",
    ];
    exportExcel(
      `${t(langKeys.template)} ${t(langKeys.company)}`,
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
            <Trans i18nKey={langKeys.company_plural} />
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
        ButtonsElement={() => (
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

export default CompanyMainView;
