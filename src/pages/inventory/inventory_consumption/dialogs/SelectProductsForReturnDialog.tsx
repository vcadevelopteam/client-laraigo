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
import { useSelector } from "hooks";
import { Dictionary } from "@types";

const selectionKey = "inventoryconsumptiondetailid";

const SelectProductsForReturnDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  updateRecords: (dat: any) => void;
}> = ({ openModal, setOpenModal, updateRecords }) => {
  const { t } = useTranslation();
  const multiData = useSelector((state) => state.main.multiData);
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});

  const columns = React.useMemo(
    () => [
      {
        accessor: "inventoryconsumptiondetailid",
        NoFilter: true,
        isComponent: true,
        minWidth: 60,
        width: "1%",
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
        Header: t(langKeys.dispatchedquantity),
        accessor: "transactiontype",
        width: "auto",
      },
      {
        Header: t(langKeys.ticketapplication),
        accessor: "ticketid",
        width: "auto",
      },
      {
        Header: t(langKeys.requestedby),
        accessor: "createby",
        width: "auto",
      },
      {
        Header: t(langKeys.dispatchdate),
        accessor: "applicationdate",
        width: "auto",
      }
    ],
    []
  );
  
  return (
    <DialogZyx open={openModal} title={t(langKeys.selectproductsforreturn)} maxWidth="lg">
      <div className="row-zyx">
          <TableZyx
              columns={columns}
              data={multiData?.data?.[2]?.data || []}
              useSelection={true}
              selectionKey={selectionKey}
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
          onClick={() => {
              const data = multiData?.data?.[2]?.data;
              const dataTosend = data
                  .filter((item) => Object.keys(selectedRows).includes(item.inventoryconsumptiondetailid.toString()))
                  .map((item) => ({
                      ...item,
                      comment: "",
                      dispatchto: "",
                      fromlote: "",
                      fromshelf: "",
                      inventoryconsumptiondetailid: 0,
                      line: 0,
                      operation: "INSERT",
                      p_tableid: 0,
                      onlinecost: Number(item.onlinecost),
                      realdate: null,
                      status: "ACTIVO",
                      type: "NINGUNO",
                      description: item.productdescription,
                      quantity: Number(item.quantity),
                      unitcost: Number(item.onlinecost)/Number(item.quantity),
                      productid: Number(item.productid),
                      ticketnumber: item.ticketid,
                      transactiontype: "DEVOLUCION",
                  }));

                  debugger
              updateRecords((p: Dictionary[]) => [...p, ...dataTosend]);
              setOpenModal(false);
              setSelectedRows({});
          }}
        >
          {t(langKeys.save)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default SelectProductsForReturnDialog;