import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from "components";
import {
    duplicateProduct,
    getAllAttributeProduct,
    getProductManufacturer,
    getProductProduct,
    getProductsWarehouse,
    insProduct,
    insProductAttribute,
    insProductDealer,
} from "common/helpers";
import { Dictionary, IFile } from "@types";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useForm } from "react-hook-form";
import { execute, getCollectionAux, resetMainAux } from "store/main/actions";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import { Tabs } from "@material-ui/core";
import ProductTabDetail from "./detailTabs/ProductTabDetail";
import { ExtrasMenu } from "../components/components";
import ChangeStatusDialog from "../dialogs/ChangeStatusDialog";
import StatusHistoryDialog from "../dialogs/StatusHistoryDialog";
import AlternativeProductTab from "./detailTabs/AlternativeProductTabDetail";
import AddToWarehouseDialog from "../dialogs/AddToWarehouseDialog";
import WarehouseTab from "./detailTabs/WarehouseTabDetail";
import DealerTab from "./detailTabs/DealerTabDetail";
import SpecificationTabDetail from "./detailTabs/SpecificationTabDetail";
import AttachmentDialog from "../dialogs/AttachmentDialog";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
    duplicated: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData?: any;
    fetchDataAux?: any;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        // marginTop: theme.spacing(2),
        // marginRight: theme.spacing(2),
        // padding: theme.spacing(2),
        // background: '#fff',
        width: "100%",
    },
    button: {
        marginRight: theme.spacing(2),
    },
    containerHeader: {
        padding: theme.spacing(1),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: "1px solid #bfbfc0",
        borderRadius: 4,
        color: "rgb(143, 146, 161)",
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "inherit",
    },
}));

const ProductMasterDetail: React.FC<DetailProps> = ({
    data: { row, edit, duplicated },
    setViewSelected,
    fetchData,
    fetchDataAux,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.main.execute);
    const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
    const [openModalStatusHistory, setOpenModalStatusHistory] = useState(false);
    const [openModalAddToWarehouse, setOpenModalAddToWarehouse] = useState(false);
    const [openModalAttachments, setOpenModalAttachments] = useState(false);
    const [dealerData, setDealerData] = useState<Dictionary[]>([]);
    const [specificationData, setSpecificationData] = useState<Dictionary[]>([]);
    const [cancelDuplication, setCancelDuplication] = useState(false);
    const initialValueAttachments = row?.attachments;
    const [files, setFiles] = useState<IFile[]>(
        initialValueAttachments ? initialValueAttachments.split(",").map((url: string) => ({ url })) : []
    );
    const classes = useStyles();
    const arrayBread = [
        { id: "main-view", name: t(langKeys.productMaster) },
        { id: "detail-view", name: `${t(langKeys.productMaster)} ${t(langKeys.detail)}` },
    ];

    const {
        register,
        handleSubmit: handleMainSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            productid: row?.productid || 0,
            description: row?.description || "",
            descriptionlarge: row?.descriptionlarge || "",
            producttype: row?.producttype || "",
            familyid: row?.familyid || 0,
            unitbuyid: row?.unitbuyid || 0,
            unitdispatchid: row?.unitdispatchid || 0,
            status: row?.status || "ACTIVO",
            operation: edit ? "EDIT" : "INSERT",
            productcode: edit ? row?.productcode : "",
            subfamilyid: row?.subfamilyid || 0,
            loteid: row?.loteid || 0,
            type: row?.type || "NINGUNO",
            imagereference: row?.imagereference || "",
            attachments: row?.attachments || "",
        },
    });

    const fetchProductWarehouse = () => {
        dispatch(getCollectionAux(getProductsWarehouse(row?.productid)));
    };

    const fetchProductProduct = () => {
        dispatch(getCollectionAux(getProductProduct(row?.productid)));
    };
    const fetchProductManufacturer = () => {
        dispatch(getCollectionAux(getProductManufacturer(row?.productid)));
    };

    const fetchProductAttributes = () => {
        dispatch(getCollectionAux(getAllAttributeProduct(row?.productid)));
    };

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                if (!cancelDuplication) {
                    dispatch(
                        showSnackbar({
                            show: true,
                            severity: "success",
                            message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        })
                    );
                }
                if (duplicated) {
                    const product_id = executeRes.data[0].p_tableid;
                    dispatch(
                        execute(duplicateProduct({ productid: product_id, productreferenceid: row?.productid || 0 }))
                    );
                }
                fetchData && fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setCancelDuplication(false);
                setWaitSave(false);
                setViewSelected("main-view");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                setCancelDuplication(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    React.useEffect(() => {
        register("productid");
        register("description", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("descriptionlarge");
        register("producttype", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("familyid");
        register("unitbuyid");
        register("unitdispatchid");
        register("status", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("productcode", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("subfamilyid");
        register("loteid");
        register("imagereference");

        dispatch(resetMainAux());
    }, [register]);

    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(
                execute(
                    {
                        header: insProduct({
                            ...data,
                            attachments: files?.map((item) => item.url)?.join(",") || "",
                        }),
                        detail: [
                            ...dealerData
                                .filter((x) => Boolean(x.operation))
                                .map((x) =>
                                    insProductDealer({
                                        ...data,
                                        ...x,
                                        p_tableid: x?.productid || 0,
                                    })
                                ),
                            ...specificationData
                                .filter((x) => Boolean(x.operation))
                                .map((x) =>
                                    insProductAttribute({
                                        ...data,
                                        ...x,
                                        p_tableid: x?.productid || 0,
                                    })
                                ),
                        ],
                    },
                    true
                )
            );

            setWaitSave(true);
        };
        if (duplicated) {
            callback();
        } else {
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback,
                })
            );
        }
    });
    function handleReturnMainView() {
        setViewSelected("main-view");
    }

    return (
        <form onSubmit={onMainSubmit} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={(view) => {
                            setViewSelected(view);
                        }}
                    />
                    <TitleDetail title={row?.description || `${t(langKeys.new)} ${t(langKeys.product)}`} />
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => {
                            handleReturnMainView();
                        }}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        {t(langKeys.save)}
                    </Button>

                    {edit && (
                        <ExtrasMenu
                            changeStatus={() => {
                                setOpenModalChangeStatus(true);
                            }}
                            statusHistory={() => setOpenModalStatusHistory(true)}
                            addToWarehouse={() => setOpenModalAddToWarehouse(true)}
                            showattachments={() => setOpenModalAttachments(true)}
                        />
                    )}
                </div>
            </div>
            <Tabs
                value={tabIndex}
                onChange={(_, i) => setTabIndex(i)}
                className={classes.tabs}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
            >
                <AntTab
                    label={
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Trans i18nKey={langKeys.product} />
                        </div>
                    }
                />
                <AntTab
                    label={
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Trans i18nKey={langKeys.warehouses} />
                        </div>
                    }
                />
                <AntTab
                    label={
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Trans i18nKey={langKeys.dealers} />
                        </div>
                    }
                />
                <AntTab
                    label={
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Trans i18nKey={langKeys.specifications} />
                        </div>
                    }
                />
            </Tabs>

            <AntTabPanel index={0} currentIndex={tabIndex}>
                <ProductTabDetail
                    row={row}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                    files={files}
                    setFiles={setFiles}
                />
                {edit && (
                    <AlternativeProductTab
                        row={row}
                        setValue={setValue}
                        getValues={getValues}
                        errors={errors}
                        fetchData={fetchProductProduct}
                        tabIndex={tabIndex}
                    />
                )}
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={tabIndex}>
                <WarehouseTab row={row} tabIndex={tabIndex} fetchData={fetchProductWarehouse} />
            </AntTabPanel>
            <AntTabPanel index={2} currentIndex={tabIndex}>
                <DealerTab
                    dataTable={dealerData}
                    setDataTable={setDealerData}
                    edit={edit}
                    row={row}
                    fetchData={fetchProductManufacturer}
                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}
                />
            </AntTabPanel>
                <AntTabPanel index={3} currentIndex={tabIndex}>
                    <SpecificationTabDetail 
                    dataTable={specificationData} edit={edit}
                    setDataTable={setSpecificationData} fetchData={fetchProductAttributes} row={row} tabIndex={tabIndex} />
                </AntTabPanel>
            <ChangeStatusDialog
                openModal={openModalChangeStatus}
                setOpenModal={setOpenModalChangeStatus}
                row={row}
                fetchData={fetchData}
                fetchDataAux={fetchDataAux}
                setValueOutside={setValue}
            />
            <StatusHistoryDialog
                openModal={openModalStatusHistory}
                setOpenModal={setOpenModalStatusHistory}
                row={row}
            />
            <AddToWarehouseDialog
                openModal={openModalAddToWarehouse}
                setOpenModal={setOpenModalAddToWarehouse}
                setTabIndex={setTabIndex}
                productid={row?.productid || 0}
                fetchdata={fetchProductWarehouse}
            />
            <AttachmentDialog openModal={openModalAttachments} setOpenModal={setOpenModalAttachments} row={row} />
        </form>
    );
};

export default ProductMasterDetail;
