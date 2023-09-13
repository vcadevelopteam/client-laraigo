/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"; 
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import SearchProductDialog from "../../dialogs/SearchProductDialog";
import { useSelector } from "hooks";
import { getCollectionAux } from "store/main/actions";
import { IActionCall } from "@types";
import { getProductsWarehouse } from "common/helpers";
import { useDispatch } from "react-redux";

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

}

const WarehouseTab: React.FC<WarehouseTabProps> = ({tabIndex,row}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const dataWarehouse = useSelector(state => state.main.mainAux);
  
  const fetchData = () => {
      dispatch(
        getCollectionAux(getProductsWarehouse(row?.productid))
      );
  }
  useEffect(() => {
    if(tabIndex === 1){
      fetchData()
    }
  }, [tabIndex]);

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.warehouse),
        accessor: "name",
        width: "auto",
      },
      {
        Header: t(langKeys.default),
        accessor: "default",
        width: "auto",
      },
      {
        Header: t(langKeys.standard_cost),
        accessor: "standard_cost",
        width: "auto",
      },
      {
        Header: t(langKeys.average_cost),
        accessor: "average_cost",
        width: "auto",
      },
      {
        Header: t(langKeys.current_balance),
        accessor: "current_balance",
        width: "auto",
      },
      {
        Header: t(langKeys.batch),
        accessor: "batch",
        width: "auto",
      },
      {
        Header: t(langKeys.default_shelf),
        accessor: "default_shelf",
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
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={dataWarehouse.data}
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