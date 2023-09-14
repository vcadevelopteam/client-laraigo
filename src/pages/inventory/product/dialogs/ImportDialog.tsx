/* eslint-disable react-hooks/exhaustive-deps */
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { importProducts, uploadExcel } from "common/helpers";
import { execute } from "store/main/actions";
import { Button } from "@material-ui/core";
import BackupIcon from "@material-ui/icons/Backup";

const ImportDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  fetchData: any;
  fetchDataAux: any;
}> = ({ openModal, setOpenModal, fetchData, fetchDataAux }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const importRes = useSelector((state) => state.main.execute);
  const [waitUpload, setWaitUpload] = useState(false);
  const multiData = useSelector(state => state.main.multiData);

  const handleUploadProduct = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: any = await uploadExcel(file, undefined);
      if (data.length > 0) {
        dispatch(showBackdrop(true));
        dispatch(execute(importProducts(data)));
        setWaitUpload(true);
      }
    }
  };
  const handleUploadWarehouse = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: any = await uploadExcel(file, undefined);
      if (data.length > 0) {
        dispatch(showBackdrop(true));
        dispatch(execute(importProducts(data)));
        setWaitUpload(true);
      }
    }
  };

  useEffect(() => {
    if (waitUpload) {
      if (!importRes.loading && !importRes.error) {
        dispatch(
          showSnackbar({
            show: true,
            severity: "success",
            message: t(langKeys.successful_import),
          })
        );
        setOpenModal(false);
        dispatch(showBackdrop(false));
        setWaitUpload(false);
        fetchData(fetchDataAux);
        setOpenModal(false);
      } else if (importRes.error) {
        dispatch(
          showSnackbar({
            show: true,
            severity: "error",
            message: t(importRes.code || "error_unexpected_error"),
          })
        );
        dispatch(showBackdrop(false));
        setWaitUpload(false);
      }
    }
  }, [importRes, waitUpload]);

  const handleUpload = async (files: FileList | null) => {
    if (selectedTemplate === "PRODUCT") {
      handleUploadProduct(files);
    }
    else if (selectedTemplate === "WAREHOUSE") {
      handleUploadWarehouse(files);
    }
  };

  return (
    <DialogZyx
      open={openModal}
      title={t(langKeys.import)}
      button1Type="button"
      buttonText1={t(langKeys.cancel)}
      handleClickButton1={() => setOpenModal(false)}
    >
      <div className="row-zyx">
        <FieldSelect
          label={t(langKeys.template)}
          className="col-12"
          valueDefault={selectedTemplate}
          onChange={(value) => setSelectedTemplate(value?.value)}
          data={[{ desc: t(langKeys.product), value: "PRODUCT" },
          { desc: t(langKeys.warehouse), value: "WAREHOUSE" }]}
          optionDesc="desc"
          optionValue="value"
        />
      </div>
      <input
        name="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        id="laraigo-upload-csv-file"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e.target.files)}
      />
      <label htmlFor="laraigo-upload-csv-file">
        <Button
          variant="contained"
          component="span"
          color="primary"
          disabled={!selectedTemplate}
          startIcon={<BackupIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84" }}
        >
          <Trans i18nKey={langKeys.import} />
        </Button>
      </label>
    </DialogZyx>
  );
};

export default ImportDialog;
