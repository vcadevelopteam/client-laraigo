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

const ModalDocPreview: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  
  return (
    <DialogZyx open={Boolean(openModal)} title={openModal?.title||""} maxWidth="md">
        
      <div className="row-zyx">
        <iframe title="Document Viewer" src={openModal?.link||""} width="100%" height="700" />
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Button
          variant="contained"
          type="button"
          color="primary"
          startIcon={<ClearIcon color="secondary" />}
          style={{ backgroundColor: "#FB5F5F" }}
          onClick={() => {
            setOpenModal(null);
          }}
        >
          {t(langKeys.back)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default ModalDocPreview;