/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  TemplateIcons,
  Title,
} from "components";
import { langKeys } from "lang/keys";
import { Dictionary, IFetchData } from "@types";
import { useDispatch } from "react-redux";
import { execute, exportData } from "store/main/actions";
import TableZyx from "components/fields/table-simple";
import {
  showSnackbar,
  showBackdrop,
  manageConfirmation,
} from "store/popus/actions";
import { exportExcel, partnerIns, templateMaker, uploadExcel } from "common/helpers";
import { useSelector } from "hooks";
import { main } from "network/service/common";

const selectionKey = "warehouseid";

interface PartnersMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: any;
}

const PartnersMainView: FC<PartnersMainViewProps> = ({
  setViewSelected,
  setRowSelected,
  fetchData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const executeResult = useSelector((state) => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);
  const main = useSelector((state) => state.main.mainData);
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
        fetchData(fetchData);
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
        fetchData(fetchData);
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
        Cell: (props: any) => {
            const { enterprisepartner } = props.cell.row.original;
            return enterprisepartner ? t(langKeys.yes) : "No"
        }
      },
      {
        Header: t(langKeys.billingplan),
        accessor: "billingplan",
        width: "auto",
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
      },
      {
        Header: t(langKeys.puadditionalcontacts),
        accessor: "puadditionalcontacts",
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
    /*dispatch(exportData(getWarehouseExport({
        filters: {
            ...filters,
        },
        sorts,
        startdate: daterange.startDate!,
        enddate: daterange.endDate!,
    }), "", "excel", false, columnsExport));*/
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
        //dispatch(execute(importWarehouse(dataToSend)));
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
      `${t(langKeys.template)} ${t(langKeys.product)}`,
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
