/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { useSelector } from "hooks";

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

interface ProductTabDetailProps {
  fetchdata: any
}

const ProductTabDetail: React.FC<ProductTabDetailProps> = ({fetchdata}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dataProducts = useSelector(state => state.main.mainAux);

  useEffect(() => {
    fetchdata();
  }, [])

  const columns = React.useMemo(
    () => [
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
        Header: t(langKeys.standard_cost),
        accessor: "standarcost",
        width: "auto",
      },
      {
        Header: t(langKeys.average_cost),
        accessor: "averagecost",
        width: "auto",
      },
      {
        Header: t(langKeys.current_balance),
        accessor: "currentbalance",
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
          data={dataProducts.data}
          download={false}
          filterGeneral={false}
          register={false}
        />
      </div>
    </div>
  );
};

export default ProductTabDetail;
