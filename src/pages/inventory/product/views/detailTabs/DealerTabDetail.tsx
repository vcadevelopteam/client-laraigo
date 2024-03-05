/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import RegisterDealerDialog from "../../dialogs/RegisterDealerDialog";
import { useSelector } from "hooks";
import { TemplateIcons } from "components";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { execute } from "store/main/actions";
import { formatDate, insProductDealer } from "common/helpers";

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

interface DealerTabProps { 
  edit:boolean;
  row:any;
  fetchData: any;
  tabIndex: any;
  dataTable: Dictionary[];
  setDataTable: (a:Dictionary[])=>void;
  setTabIndex: any;
}

const DealerTab: React.FC<DealerTabProps> = ({row, fetchData, tabIndex, setTabIndex, dataTable,setDataTable, edit}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const [openModalDealer, setOpenModalDealer] = useState(false);
  const mainData = useSelector(state => state.main.mainAux);
  const executeResult = useSelector((state) => state.main.execute);

  useEffect(() => {
    if(!mainData?.loading && !mainData?.error && edit&& mainData?.key==="UFN_ALL_MANUFACTURER_PRODUCT_SEL"){
      setDataTable(mainData.data)
    }
  }, [mainData]);
  
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
        const errormessage = t(executeResult.code ?? "error_unexpected_error", {
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

  const handleDelete = (row: Dictionary, i:number) => {
    if(edit){
      const callback = () => {
        dispatch(
          execute(insProductDealer({ ...row, p_tableid: row.productid, operation: "DELETE", status: "ELIMINADO" }))
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
    }else{
      const dataTableAux = dataTable
      dataTableAux.splice(i,1)
      setDataTable(dataTableAux)
    }
  }
  
  const columns = React.useMemo(
    () => [
      {
          accessor: 'productcompanyid',
          NoFilter: true,
          isComponent: true,
          minWidth: 60,
          width: '1%',
          Cell: (props: any) => {
              const row = props.cell.row.original;
              return (
                  <TemplateIcons
                      deleteFunction={() => handleDelete(row, props.cell.row.index)}
                  />
              )
          }
      },
      {
        Header: t(langKeys.dealer),
        accessor: "distributordescription",
        width: "auto",
      },
      {
        Header: t(langKeys.manufacturer),
        accessor: "manufacturerdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.model),
        accessor: "model",
        width: "auto",
      },
      {
        Header: t(langKeys.catalog_nro),
        accessor: "catalognumber",
        width: "auto",
      },
      {
        Header: t(langKeys.current_balance),
        accessor: "currentbalance",
        width: "auto",
      },
      {
        Header: t(langKeys.last_price),
        accessor: "lastprice",
        width: "auto",
      },
      {
        Header: t(langKeys.last_order_date),
        accessor: "lastorderdate",
        width: "auto",
        Cell: (props: any) => {
            const { lastorderdate } = props.cell.row.original;
            return lastorderdate? formatDate(lastorderdate, { withTime: false }): ""
        }
      },
      {
        Header: t(langKeys.purchase_unit),
        accessor: "unitbuydescription",
        width: "auto",
      },
      {
        Header: `${t(langKeys.dealer)} ${t(langKeys.default)}`,
        accessor: "isstockistdefault",
        width: "auto",
        type: 'boolean',
        sortType: 'basic',
        Cell: (props: any) => {
            const { isstockistdefault } = props.cell.row.original;
            return isstockistdefault ? t(langKeys.yes) : "No"
        }
      },
    ],
    []
  );
  useEffect(() => {
      if (tabIndex === 2) {
        fetchData()
      }
  }, [tabIndex])

  function handleRegister() {
    setOpenModalDealer(true)
  }
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={dataTable}
          download={false}
          filterGeneral={false}
          register={true}
          loading={mainData.loading}
          handleRegister={handleRegister}
        />
      </div>
      <RegisterDealerDialog
        fetchData={fetchData}
        openModal={openModalDealer}
        setDataTable={setDataTable}
        edit={edit}
        setOpenModal={setOpenModalDealer}
        row={row}
      />
    </div>
  );
};

export default DealerTab;
