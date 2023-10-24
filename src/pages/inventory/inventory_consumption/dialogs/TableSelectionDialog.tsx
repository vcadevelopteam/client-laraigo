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

const TableSelectionDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  setRow: any;
  columns: any;
  data: any;
  title: string;
}> = ({ openModal, setOpenModal, setRow, columns, data,title }) => {
  const { t } = useTranslation();
  
  return (
    <DialogZyx open={openModal} title={title} maxWidth="md">
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={data||[]}
          loading={false}
          filterGeneral={false}
          onClickRow={(e)=>{setRow(e);setOpenModal(false)}}
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
      </div>
    </DialogZyx>
  );
};

export default TableSelectionDialog;