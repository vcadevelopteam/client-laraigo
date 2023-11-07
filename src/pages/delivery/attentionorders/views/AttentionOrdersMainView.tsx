/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  TemplateBreadcrumbs,
  TemplateIcons,
  Title,
  TitleDetail,
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
import { exportExcel, templateMaker, uploadExcel } from "common/helpers";
import { useSelector } from "hooks";
import { Button } from "@material-ui/core";
import TablePaginated from "components/fields/table-paginated";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const selectionKey = "warehouseid";

interface InventoryMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: any;
  fetchDataAux: any;
}

const AttentionOrdersMainView: FC<InventoryMainViewProps> = ({
  setViewSelected,
  setRowSelected,
  fetchData,
  fetchDataAux,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const executeResult = useSelector((state) => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);
  const mainPaginated = useSelector((state) => state.main.mainPaginated);
  const [totalrow, settotalrow] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [waitExport, setWaitExport] = useState(false);
  const resExportData = useSelector(state => state.main.exportData);
  const [waitUpload, setWaitUpload] = useState(false);  
  const importRes = useSelector((state) => state.main.execute);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const arrayBread = [
    { id: "main-view", name: t(langKeys.delivery) },
    { id: "detail-view", name: t(langKeys.attentionorders) },
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
        accessor: "storeid",
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
        Header: t(langKeys.ordernumber),
        accessor: "ordernumber",
        width: "auto",
      },
      {
        Header: t(langKeys.deliverynumber),
        accessor: "deliverynumber",
        width: "auto",
      },
      {
        Header: t(langKeys.clientname),
        accessor: "clientname",
        width: "auto",
      },
      {
        Header: t(langKeys.phone),
        accessor: "phone",
        width: "auto",
      },     
      {
        Header: t(langKeys.product),
        accessor: "product",
        width: "auto",
      },
      {
        Header: t(langKeys.requestedquantity),
        accessor: "quantity",
        width: "auto",
      },
      {
        Header: t(langKeys.orderstatus),
        accessor: "validated",
        width: "auto",
      },
      {
        Header: t(langKeys.deliverytype),
        accessor: "orderstatus",
        width: "auto",
      },
      {
        Header: t(langKeys.orderdate),
        accessor: "deliverytype",
        width: "auto",
      },
      {
        Header: t(langKeys.scheduledshift),
        accessor: "orderdate",
        width: "auto",
      },     
    ],
    []
  );

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
         <TemplateBreadcrumbs
            breadcrumbs={arrayBread}
          />
          <TitleDetail
            title={ t(langKeys.attentionorders)}
          />
        </div>
      </div>
      <TablePaginated
        columns={columns}
        data={mainPaginated.data}
        totalrow={totalrow}
        loading={mainPaginated.loading}
        pageCount={pageCount}
        fetchData={fetchData}
        onClickRow={handleEdit}
        useSelection={true}
        handleRegister={handleRegister}
        register={true}
        ButtonsElement={()=> (
          <Button
            variant="contained"
            color="primary"
            disabled={mainPaginated.loading}
            startIcon={<CheckCircleIcon color="secondary" />}             
            style={{ backgroundColor: "#55BD84", marginLeft: "auto" }}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              e.stopPropagation();
            }}
            >
            <Trans i18nKey={langKeys.prepare} />
          </Button>
        )}
      />
    </div>
  );
};

export default AttentionOrdersMainView;
