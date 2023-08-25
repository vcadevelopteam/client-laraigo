/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react"; 
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import SearchProductDialog from "./DialogComponents/SearchProductDialog";

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
}

const WarehouseTab: React.FC<WarehouseTabProps> = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalSearch, setOpenModalSearch] = useState(false);;

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.warehouse),
        accessor: "warehouse",
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
          data={[]}
          download={false}
          filterGeneral={false}
          register={false}
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
