/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import TableZyx from "components/fields/table-simple";
import { Dictionary } from "@types";

const selectionKey = "domainname";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));
const AddToWarehouseDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  setTabIndex: (dat: any) => void;
}> = ({ openModal, setOpenModal,setTabIndex }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);
  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.warehouse),
        accessor: "product",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
      },
    ],
    []
  );

  function onSubmitWarehouse() {
    setTabIndex(1)
    setOpenModal(false);
  }

  return (
    <DialogZyx open={openModal} title={t(langKeys.add_product_to_warehouse)}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={[]}
          download={false}
          filterGeneral={false}
          useSelection={true}
          setSelectedRows={setSelectedRows}
          initialSelectedRows={selectedRows}
          cleanSelection={cleanSelected}
          setCleanSelection={setCleanSelected}
          register={false}
          selectionKey={selectionKey}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Button
          variant="contained"
          type="button"
          color="primary"
          startIcon={<ClearIcon color="secondary" />}
          style={{ backgroundColor: "#FB5F5F" }}
          onClick={() => {
            setOpenModal(false);
          }}
        >
          {t(langKeys.back)}
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="button"
          onClick={onSubmitWarehouse}
          startIcon={<SaveIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84" }}
        >
          {t(langKeys.save)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default AddToWarehouseDialog;
