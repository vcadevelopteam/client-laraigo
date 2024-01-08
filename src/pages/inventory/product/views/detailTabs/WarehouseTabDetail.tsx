/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"; 
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import SearchProductDialog from "../../dialogs/SearchProductDialog";
import { useSelector } from "hooks";
import { execute } from "store/main/actions";
import { Dictionary } from "@types";
import { insProductWarehouse } from "common/helpers";
import { useDispatch } from "react-redux";
import { TemplateIcons } from "components";
import { showBackdrop, showSnackbar } from "store/popus/actions";

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

interface WarehouseTabProps {
  tabIndex: number
  row?: any
  fetchData: any
}

const WarehouseTab: React.FC<WarehouseTabProps> = ({tabIndex,row,fetchData}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const dataWarehouse = useSelector(state => state.main.mainAux);
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const multiData = useSelector((state) => state.main.multiDataAux);

  useEffect(() => {
    if(tabIndex === 1){
      fetchData()
    }
  }, [tabIndex]);

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            fetchData();
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
  }, [executeRes, waitSave])

  const handleDelete = (data: Dictionary) => {
    dispatch(execute(insProductWarehouse({
      ...data,
      unitdispatchid: row.unitdispatchid,
      status: 'ELIMINADO',
      type: 'NINGUNO',
      operation: 'DELETE'
    })))
    setWaitSave(true);
  }

  const columns = React.useMemo(
    () => [
      {
        accessor: 'warehouseid',
        NoFilter: true,
        isComponent: true,
        minWidth: 60,
        width: '1%',
        Cell: (props: any) => {
            const row = props.cell.row.original;
            return (
                <TemplateIcons
                    deleteFunction={() => handleDelete(row)}
                />
            )
        }
      },
      {
        Header: t(langKeys.product),
        accessor: "productcode",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "productdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.default),
        accessor: "ispredeterminate",
        width: "auto",
        type: 'boolean',
        sortType: 'basic',
        Cell: (props: any) => {
            const { ispredeterminate } = props.cell.row.original;
            return ispredeterminate ? t(langKeys.yes) : "No"
        }
      },
      {
        Header: t(langKeys.standard_cost),
        accessor: "standarcost",
        width: "auto",
        Cell: (props: any) => {
            const { priceunit, typecostdispatchdescription } = props.cell.row.original;
            return typecostdispatchdescription === "ESTANDAR" ? parseFloat(priceunit) : "-"
        }
      },
      {
        Header: t(langKeys.average_cost),
        accessor: "averagecost",
        width: "auto",
        Cell: (props: any) => {
            const { priceunit, typecostdispatchdescription } = props.cell.row.original;
            return typecostdispatchdescription !== "ESTANDAR" ? parseFloat(priceunit) : "-"
        }
      },
      {
        Header: t(langKeys.current_balance),
        accessor: "currentbalance",
        width: "auto",
      },
      {
        Header: t(langKeys.batch),
        accessor: "lotecode",
        width: "auto",
      },
      {
        Header: t(langKeys.dispatch_unit),
        accessor: "unitdipatchdesc",
        width: "auto",
      },
      {
        Header: t(langKeys.purchase_unit),
        accessor: "unitbuydesc",
      },
    ],
    []
  );
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={dataWarehouse?.data?.map(y=>({...y, unitdipatchdesc: multiData.data[4].data.filter(x=>x.domainid===y?.unitdipatchid)?.[0]?.domainvalue,
            unitbuydesc: multiData.data[3].data.filter(x=>x.domainid===y?.unitbuyid)?.[0]?.domainvalue
          }))}
          download={false}
          filterGeneral={false}
          register={false}
          loading={dataWarehouse.loading}
        />
      </div>
      <SearchProductDialog
        openModal={openModalSearch}
        setOpenModal={setOpenModalSearch}
      />
    </div>
  );
};

export default WarehouseTab;