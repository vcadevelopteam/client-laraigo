/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
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

interface ProductTabDetailProps {}

const ProductTabDetail: React.FC<ProductTabDetailProps> = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const multiData = useSelector(state => state.main.multiDataAux);

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.product),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "descriptionlarge",
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
    ],
    []
  );
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={multiData.data[0].data}
          download={false}
          filterGeneral={false}
          register={false}
        />
      </div>
    </div>
  );
};

export default ProductTabDetail;
