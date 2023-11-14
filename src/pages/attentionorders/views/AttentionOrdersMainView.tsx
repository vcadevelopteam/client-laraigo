import React, { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail} from "components";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from "react-redux";
import { showSnackbar, showBackdrop} from "store/popus/actions";
import { useSelector } from "hooks";
import { Button } from "@material-ui/core";
import TablePaginated from "components/fields/table-paginated";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { CellProps } from "react-table";

const useStyles = makeStyles((theme) => ({   
  button: {
    marginRight: theme.spacing(2),
    display: 'flex', 
    justifyContent: 'space-between',
    gap: '1rem', alignItems: 'center' 
  },       
  clientdetailposition: {
    paddingTop:"2rem", 
    paddingLeft:"0.9rem"
  },   
  div1: {    
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flex: 1, 
  },
  div2: {  
    display: "flex",
    gap: 8,
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 4,  
  }


}));

interface InventoryMainViewProps {
  setViewSelected: (view: string) => void;
  setRowSelected: (rowdata: any) => void;
  fetchData: () => void;
  fetchDataAux: () => void;
}

const AttentionOrdersMainView: FC<InventoryMainViewProps> = ({
  setViewSelected,
  setRowSelected,
  fetchData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();


  const executeResult = useSelector((state) => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);
  const mainPaginated = useSelector((state) => state.main.mainPaginated);
  const [totalrow] = useState(0);
  const [pageCount] = useState(0);
  const [waitExport, setWaitExport] = useState(false);
  const resExportData = useSelector(state => state.main.exportData);
  const [waitUpload, setWaitUpload] = useState(false);  
  const importRes = useSelector((state) => state.main.execute);

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
        Cell: (props: CellProps<Dictionary>) => {          
          const row = props.cell.row.original;
          return (
            <TemplateIcons
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
    <div className={classes.div1}>
      <div className={classes.div2}>
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
            style={{ backgroundColor: "#55BD84"}}
            onClick={(e) => {             
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
