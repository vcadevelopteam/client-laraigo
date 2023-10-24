/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import {
  DialogZyx,
} from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import TableZyx from "components/fields/table-simple";
import TablePaginated from "components/fields/table-paginated";

const SelectReservedProductsDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        accessor: "warehouseid",
        NoFilter: true,
        isComponent: true,
        minWidth: 60,
        width: "1%",
      },
      {
        Header: t(langKeys.product),
        accessor: "inventory_consumption",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.reservedquantity),
        accessor: "transactiontype",
        width: "auto",
      },
      {
        Header: t(langKeys.ticketapplication),
        accessor: "status",
        width: "auto",
      },
      {
        Header: t(langKeys.requestedby),
        accessor: "requestedby",
        width: "auto",
      },
      {
        Header: t(langKeys.applicationdate),
        accessor: "applicationdate",
        width: "auto",
      }
    ],
    []
  );
  
  return (
    <DialogZyx open={openModal} title={t(langKeys.selectreservedproducts)} maxWidth="lg">
      <div className="row-zyx">
        <TablePaginated
          columns={columns}
          data={[]}
          useSelection={true}
          setSelectedRows={setSelectedRows}
          initialSelectedRows={selectedRows}
          filterGeneral={false}
        />
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: 'flex-end' }}>
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
          variant="contained"
          color="primary"
          type="button"
          startIcon={<SaveIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84" }}
        >
          {t(langKeys.save)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default SelectReservedProductsDialog;