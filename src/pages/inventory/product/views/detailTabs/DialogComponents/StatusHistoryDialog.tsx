/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import {
  DialogZyx,
} from "components";
import { langKeys } from "lang/keys";
import { UseFormGetValues } from "react-hook-form";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import React from "react";
import TableZyx from "components/fields/table-simple";

const StatusHistoryDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  getValues?: UseFormGetValues<any>;
  massive?: boolean;
}> = ({ openModal, setOpenModal, getValues, massive = false }) => {
  const { t } = useTranslation();
  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.status),
        accessor: "status",
        width: "auto",
        prefixTranslation: "status_",
        Cell: (props: any) => {
          const { status } = props.cell.row.original;
          return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
        },
      },
      {
        Header: t(langKeys.change_date),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.change_by),
        accessor: "description2",
        width: "auto",
      },
      {
        Header: t(langKeys.ticket_comment),
        accessor: "description3",
        width: "auto",
      },
    ],
    []
  );

  return (
    <DialogZyx open={openModal} title={t(langKeys.status_history)}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={[]}
          loading={false}
          filterGeneral={false}
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

export default StatusHistoryDialog;