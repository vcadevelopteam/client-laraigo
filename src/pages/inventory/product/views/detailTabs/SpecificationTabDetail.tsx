/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import RegisterSpecificationDialog from "../../dialogs/RegisterSpecificationDialog";

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

interface SpecificationTabDetailProps {}

const SpecificationTabDetail: React.FC<SpecificationTabDetailProps> = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalDealer, setOpenModalDealer] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.attribute),
        accessor: "attribute",
        width: "auto",
      },
      {
        Header: t(langKeys.value),
        accessor: "value",
        width: "auto",
      },
      {
        Header: t(langKeys.measureunit),
        accessor: "measureunit",
        width: "auto",
      },
    ],
    []
  );
  function handleRegister() {
    setOpenModalDealer(true)
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
          handleRegister={handleRegister}
        />
      </div>
      <RegisterSpecificationDialog
        openModal={openModalDealer}
        setOpenModal={setOpenModalDealer}
      />
    </div>
  );
};

export default SpecificationTabDetail;
