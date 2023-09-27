/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import {
  DialogZyx,
} from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import TableZyx from "components/fields/table-simple";
import { useSelector } from "hooks";
import { convertLocalDate, getProductStatusHistory } from "common/helpers";

const WarehouseSelectionDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  setRow: any
}> = ({ openModal, setOpenModal, setRow }) => {
  const { t } = useTranslation();
  const multiData = useSelector((state) => state.main.multiDataAux);
  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.warehouse),
        accessor: "name",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
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
    <DialogZyx open={openModal} title={t(langKeys.warehouse)} maxWidth="md">
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={multiData.data[8].data}
          loading={false}
          filterGeneral={false}
          onClickRow={(e)=>{setRow(e);setOpenModal(false)}}
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
      </div>
    </DialogZyx>
  );
};

export default WarehouseSelectionDialog;