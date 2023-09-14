/* eslint-disable react-hooks/exhaustive-deps */
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { exportExcel, templateMaker } from "common/helpers";

const TemplateImportDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
}> = ({ openModal, setOpenModal }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { t } = useTranslation();

  const handleTemplateProduct = () => {
    const data = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    const header = [
      "description",
      "descriptionlarge",
      "producttype",
      "familyid",
      "unitbuyid",
      "unitdispatchid",
      "imagereference",
      "attachments",
      "productcode",
      "loteid",
      "subfamilyid",
    ];
    exportExcel(
      `${t(langKeys.template)} ${t(langKeys.product)}`,
      templateMaker(data, header)
    );
    setSelectedTemplate("");
    setOpenModal(false);
  };
  const handleTemplateAlmacen = () => {
    const data = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    const header = [
      "productid",
      "warehouseid",
      "priceunit",
      "ispredeterminate",
      "rackcode",
      "typecostdispatch",
      "unitdispatchid",
      "unitbuyid",
      "currentbalance",
      "lotecode",
    ];
    exportExcel(
      `${t(langKeys.template)} ${t(langKeys.warehouse)}`,
      templateMaker(data, header)
    );
    setSelectedTemplate("");
    setOpenModal(false);
  };
  const handleTemplateDealer = () => {
    const data = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    const header = [
      "productid",
      "manufacturerid",
      "distributorid",
      "model",
      "catalognumber",
      "webpage",
      "taxeid",
      "isstockistdefault",
      "averagedeliverytime",
      "lastprice",
      "lastorderdate",
      "unitbuy",
    ];
    exportExcel(
      `${t(langKeys.template)} ${t(langKeys.dealer)}`,
      templateMaker(data, header)
    );
    setSelectedTemplate("");
    setOpenModal(false);
  };
  const handleTemplateSpecification = () => {
    const data = [{}, {}, {}, {}];
    const header = [
        "productid",
        "attributeid",
        "value",
        "unitmeasureid"
    ];
    exportExcel(
      `${t(langKeys.template)} ${t(langKeys.specifications)}`,
      templateMaker(data, header)
    );
    setSelectedTemplate("");
    setOpenModal(false);
  };
  function handleDownloadTemplate() {
    if (selectedTemplate === "PRODUCT") handleTemplateProduct();
    if (selectedTemplate === "WAREHOUSE") handleTemplateAlmacen();
    if (selectedTemplate === "DEALER") handleTemplateDealer();
    if (selectedTemplate === "SPECIFICATION") handleTemplateSpecification();
  }

  return (
    <DialogZyx
      open={openModal}
      title={t(langKeys.import)}
      button1Type="button"
      buttonText1={t(langKeys.cancel)}
      handleClickButton1={() => setOpenModal(false)}
      button2Type="button"
      buttonText2={t(langKeys.download)}
      handleClickButton2={handleDownloadTemplate}
    >
      <div className="row-zyx">
        <FieldSelect
          label={t(langKeys.template)}
          className="col-12"
          valueDefault={selectedTemplate}
          onChange={(value) => setSelectedTemplate(value?.value)}
          data={[
            { desc: t(langKeys.product), value: "PRODUCT" },
            { desc: t(langKeys.warehouse), value: "WAREHOUSE" },
            { desc: t(langKeys.dealer), value: "DEALER" },
            { desc: t(langKeys.specifications), value: "SPECIFICATION" },
          ]}
          optionDesc="desc"
          optionValue="value"
        />
      </div>
    </DialogZyx>
  );
};

export default TemplateImportDialog;
