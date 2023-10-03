/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import {
  DialogZyx,
} from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import React from "react";
import { IFile } from "@types";
import { ItemFileShow } from "../components/components";

const AttachmentDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const initialValueAttachments = row?.attachments;
  const files = (initialValueAttachments? initialValueAttachments.split(',').map((url:string) => ({ url })):[]);

  return (
    <DialogZyx open={openModal} title={t(langKeys.messagetemplate_attachment)}>
      <div className="row-zyx">
        
        <div className="col-12">          
          {files?.length > 0 &&
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                  {files.map((item: IFile) => <ItemFileShow key={item.id} item={item} />)}
              </div>
          }
        </div>
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

export default AttachmentDialog;