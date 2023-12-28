/* eslint-disable react-hooks/exhaustive-deps */
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import {
  importProductManufacturer,
  importProducts,
  importProductsAttribute,
  importProductsWarehouse,
  uploadExcel,
} from "common/helpers";
import { execute } from "store/main/actions";
import { Button } from "@material-ui/core";
import BackupIcon from "@material-ui/icons/Backup";

interface ProductMassData {
  description: string;
  descriptionlarge: string;
  producttype: string;
  familyid: number;
  unitbuyid: number;
  unitdispatchid: number;
  imagereference: string;
  attachments: string;
  productcode: string;
  loteid: number;
  subfamilyid: number;
  status: string;
}
interface ProductWarehouseMassData {
  productid: number;
  warehouseid: number;
  priceunit: number;
  ispredeterminate: string;
  rackcode: string;
  typecostdispatch: number;
  unitdispatchid: number;
  unitbuyid: number;
  currentbalance: number;
  lotecode: string;
}
interface ProductDealerMassData {
  productid: number;
  manufacturerid: number;
  distributorid: number;
  model: string;
  catalognumber: string;
  webpage: string;
  taxeid: number;
  isstockistdefault: string;
  averagedeliverytime: string;
  lastprice: string;
  lastorderdate: string;
  unitbuy: number;
}
interface ProductSpecificationMassData {
  productid: number;
  attributeid: string;
  value: string;
  unitmeasureid: number;
}

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
  const multiData = useSelector(state => state.main.multiDataAux);

  const isValidProduct = (element:ProductMassData) => {
    const validDomainProductType = multiData.data[0].data.reduce(
      (a, d) => ({ ...a, [d.domainvalue]: true }),
      {}
    );
    const validDomainFamily = multiData.data[1].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainSubFamily = multiData.data[2].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainUnitBuy = multiData.data[3].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainUnitDispatch = multiData.data[4].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainLote = multiData.data[6].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainStatus = multiData.data[5].data.reduce(
      (a, d) => ({ ...a, [d.domainvalue]: true }),
      {}
    );

    return (
      element?.description?.toString()?.length <= 256 &&
      element?.productcode?.toString()?.length <= 20 &&
      element?.descriptionlarge?.toString()?.length <= 10000 &&
      validDomainProductType[element?.producttype] &&
      validDomainFamily[element?.familyid] &&
      validDomainSubFamily[element?.subfamilyid] &&
      validDomainUnitBuy[element?.unitbuyid] &&
      validDomainUnitDispatch[element?.unitdispatchid] &&
      validDomainLote[element?.loteid] &&
      validDomainStatus[element?.status] &&
      element?.description?.toString()?.length > 0
    );
  };

  const handleUploadProduct = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: ProductMassData[] = (await uploadExcel(file, undefined)) as ProductMassData[];
      if (data.length > 0) {
        const error = data.some((element) => !isValidProduct(element));
        if(!error){
          let dataToSend = data.map((x: any) => ({
            ...x,
            productid: 0,
            operation: "INSERT",
            type: "NINGUNO",
          }));
          dispatch(showBackdrop(true));
          dispatch(execute(importProducts(dataToSend)));
          setWaitUpload(true);
        }else{      
          dispatch(
            showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) })
          );
        }
      }
    }
  };

  const isValidProductWarehouse = (element:ProductWarehouseMassData) => {
    const validDomainProduct = multiData.data[7].data.reduce(
      (a, d) => ({ ...a, [d.productid]: true }),
      {}
    );
    const validDomainWarehouse = multiData.data[8].data.reduce(
      (a, d) => ({ ...a, [d.warehouseid]: true }),
      {}
    );
    const validDomainTypeCostDispatch = multiData.data[9].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainUnitBuy = multiData.data[3].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainUnitDispatch = multiData.data[4].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    return (
      validDomainProduct[element?.productid] &&
      validDomainWarehouse[element?.warehouseid] &&
      typeof element?.priceunit === 'number' && element?.priceunit > 0 &&
      ((element?.ispredeterminate === 'true')||(element?.ispredeterminate === 'false')) &&
      validDomainTypeCostDispatch[element?.typecostdispatch]&&
      validDomainUnitDispatch[element?.unitdispatchid] &&
      validDomainUnitBuy[element?.unitbuyid]
    );
  };


  const handleUploadWarehouse = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: ProductWarehouseMassData[] = (await uploadExcel(file, undefined)) as ProductWarehouseMassData[];
      if (data.length > 0) {
        const error = data.some((element) => !isValidProductWarehouse(element as ProductWarehouseMassData));
        if(!error){
          let dataToSend = data.map((x: any) => ({
            ...x,
            productwarehouseid: 0,
            operation: "INSERT",
            type: "NINGUNO",
            status: "ACTIVO",
          }));
          dispatch(showBackdrop(true));
          dispatch(execute(importProductsWarehouse(dataToSend)));
          setWaitUpload(true);
        }else{      
          dispatch(
            showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) })
          );
        }
      }
    }
  };

  const isValidProductDealer = (element:ProductDealerMassData) => {
    const validDomainProduct = multiData.data[7].data.reduce(
      (a, d) => ({ ...a, [d.productid]: true }),
      {}
    );
    const validDomainManufacturer = multiData.data[10].data.reduce(
      (a, d) => ({ ...a, [d.manufacturerid]: true }),
      {}
    );
    const validDomainTaxe = multiData.data[11].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    const validDomainUnitBuy = multiData.data[3].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );

    return (
      validDomainProduct[element?.productid] &&
      validDomainManufacturer[element?.manufacturerid] &&
      validDomainManufacturer[element?.distributorid] &&
      element?.model?.toString()?.length <=256 &&
      element?.catalognumber?.toString()?.length <=256 &&
      element?.webpage?.toString()?.length <=256 &&
      validDomainTaxe[element?.taxeid] &&
      ((element?.isstockistdefault === 'true')||(element?.isstockistdefault === 'false')) &&
      typeof element?.averagedeliverytime === 'number' && element?.averagedeliverytime > 0 &&
      typeof element?.lastprice === 'number' && element?.lastprice > 0 &&
      element?.lastorderdate?.toString()?.length >0 &&
      validDomainUnitBuy[element?.unitbuy]
    );
  };
  
  const handleUploadDealer = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: ProductDealerMassData[] = (await uploadExcel(file, undefined)) as ProductDealerMassData[];
      if (data.length > 0) {
        const error = data.some((element) => !isValidProductDealer(element));
        if(!error){
          let dataToSend = data.map((x: any) => ({
            ...x,
            lastorderdate: new Date((x.lastorderdate - 1) * 24 * 3600 * 1000),
            productcompanyid: 0,
            operation: "INSERT",
            type: "NINGUNO",
            status: "ACTIVO",
          }));
          dispatch(showBackdrop(true));
          dispatch(execute(importProductManufacturer(dataToSend)));
          setWaitUpload(true);
        }else{      
          dispatch(
            showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) })
          );
        }
      }
    }
  };
  const isValidProductSpecifications = (element:ProductSpecificationMassData) => {
    const validDomainProduct = multiData.data[7].data.reduce(
      (a, d) => ({ ...a, [d.productid]: true }),
      {}
    );
    const validDomainUnitBuy = multiData.data[12].data.reduce(
      (a, d) => ({ ...a, [d.domainid]: true }),
      {}
    );
    return (
      validDomainProduct[element?.productid] &&
      element?.attributeid?.toString()?.length <=56 &&
      element?.value?.toString()?.length <=9 &&
      validDomainUnitBuy[element?.unitmeasureid]
    );
  };
  
  const handleUploadSpecifications = async (files: any) => {
    const file = files?.item(0);
    if (file) {
      const data: ProductSpecificationMassData[] = (await uploadExcel(file, undefined)) as ProductSpecificationMassData[];
      if (data.length > 0) {
        const error = data.some((element) => !isValidProductSpecifications(element));
        if(!error){
          let dataToSend = data.map((x: any) => ({
            ...x,
            productattributeid: 0,
            operation: "INSERT",
            type: "NINGUNO",
            status: "ACTIVO",
          }));
          dispatch(showBackdrop(true));
          dispatch(execute(importProductsAttribute(dataToSend)));
          setWaitUpload(true);
        }else{      
          dispatch(
            showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) })
          );
        }
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
    if (selectedTemplate === "PRODUCT") handleUploadProduct(files);
    if (selectedTemplate === "WAREHOUSE") handleUploadWarehouse(files);
    if (selectedTemplate === "DEALER") handleUploadDealer(files);
    if (selectedTemplate === "SPECIFCATION") handleUploadSpecifications(files);
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
          data={[
            { desc: t(langKeys.product), value: "PRODUCT" },
            { desc: t(langKeys.warehouse), value: "WAREHOUSE" },
            { desc: t(langKeys.dealer), value: "DEALER" },
            { desc: t(langKeys.specifications), value: "SPECIFCATION" },
          ]}
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
