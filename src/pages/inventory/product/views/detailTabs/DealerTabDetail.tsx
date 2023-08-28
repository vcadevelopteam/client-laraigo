/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import SearchDealerDialog from "./DialogComponents/SearchDealerDialog";
import RegisterDealerDialog from "./DialogComponents/RegisterDealerDialog";

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

interface DealerTabProps {}

const DealerTab: React.FC<DealerTabProps> = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [openModalDealer, setOpenModalDealer] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.dealer),
        accessor: "dealer",
        width: "auto",
      },
      {
        Header: t(langKeys.manufacturer),
        accessor: "manufacturer",
        width: "auto",
      },
      {
        Header: t(langKeys.model),
        accessor: "model",
        width: "auto",
      },
      {
        Header: t(langKeys.catalog_nro),
        accessor: "catalog_nro",
        width: "auto",
      },
      {
        Header: t(langKeys.current_balance),
        accessor: "current_balance",
        width: "auto",
      },
      {
        Header: t(langKeys.last_price),
        accessor: "last_price",
        width: "auto",
      },
      {
        Header: t(langKeys.last_order_date),
        accessor: "last_order_date",
        width: "auto",
      },
      {
        Header: t(langKeys.purchase_unit),
        accessor: "purchase_unit",
        width: "auto",
      },
      {
        Header: `${t(langKeys.dealer)} ${t(langKeys.default)}`,
        accessor: "default_dealer",
        width: "auto",
      },
    ],
    []
  );
  function handleRegister() {
    setOpenModalDealer(true)
  }
  function search() {
    setOpenModalSearch(true)
  }
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={[]}
          download={false}
          filterGeneral={false}
          register={true}
          ButtonsElement={() => (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: 120, backgroundColor: "#55BD84" }}
                startIcon={<SearchIcon style={{ color: "white" }} />}
                onClick={() => search()}
              >
                {t(langKeys.search)}
              </Button>
            </div>
          )}
          handleRegister={handleRegister}
        />
      </div>
      <SearchDealerDialog
        openModal={openModalSearch}
        setOpenModal={setOpenModalSearch}
      />
      <RegisterDealerDialog
        openModal={openModalDealer}
        setOpenModal={setOpenModalDealer}
      />
    </div>
  );
};

export default DealerTab;
