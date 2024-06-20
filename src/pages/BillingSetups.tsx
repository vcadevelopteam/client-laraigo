import { Box, FormControlLabel, Tabs, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { Dictionary, MultiData, IBillingMessaging } from "@types";
import { getCountryList } from "store/signup/actions";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core/styles";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { Search } from "@material-ui/icons";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import ListAltIcon from '@material-ui/icons/ListAlt';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import {
    appsettingInvoiceIns,
    appsettingInvoiceSel,
    artificialIntelligencePlanSel,
    artificialIntelligenceServiceSel,
    array_trimmer,
    billingArtificialIntelligenceIns,
    billingArtificialIntelligenceSel,
    billingConfigurationIns,
    billingConversationIns,
    billingMessagingIns,
    billingSupportIns,
    currencySel,
    dataMonths,
    dataYears,
    exportExcel,
    uploadExcel,
    formatNumber,
    formatNumberFourDecimals,
    formatNumberNoDecimals,
    getBillingConfigurationSel,
    getBillingConversationSel,
    getBillingMessagingSel,
    getBillingSupportSel,
    getCorpSel,
    getOrgSelList,
    getPaymentPlanSel,
    getPlanSel,
    getValuesFromDomainCorp,
    templateMaker,
} from "common/helpers";

import {
    AntTab,
    FieldEdit,
    FieldEditArray,
    FieldMultiSelect,
    FieldSelect,
    FieldView,
    IOSSwitch,
    TemplateBreadcrumbs,
    TemplateIcons,
    TemplateSwitch,
    TitleDetail,
} from "components";

import {
    cleanMemoryTable,
    execute,
    getCollection,
    getMultiCollection,
    getMultiCollectionAux,
    setMemoryTable,
} from "store/main/actions";

import Button from "@material-ui/core/Button";
import TableZyx from "../components/fields/table-simple";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";
import React, { FC, Fragment, useEffect, useState } from "react";

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailSupportPlanProps {
    data: RowSelected;
    dataPlan: any[];
    currencyList?: any[];
    fetchData: () => void;
    setViewSelected: (view: string) => void;
}

interface DetailArtificialIntelligenceProps {
    data: RowSelected;
    fetchData: () => void;
    planData: any[];
    providerData: any[];
    setViewSelected: (view: string) => void;
}

interface DetailGeneralConfigurationProps {
    data: RowSelected;
    dataPlan: any[];
    currencyList: any[];
    domainDocument: { loading: boolean; data: Dictionary[] };
    domainInvoiceProvider: { loading: boolean; data: Dictionary[] };
    domainPaymentProvider: { loading: boolean; data: Dictionary[] };
    domainPrinting: { loading: boolean; data: Dictionary[] };
    domainLocation: { loading: boolean; data: Dictionary[] };
    fetchData: () => void;
    setViewSelected: (view: string) => void;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        background: "#fff",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    itemDate: {
        border: "1px solid #bfbfc0",
        borderRadius: 4,
        color: "rgb(143, 146, 161)",
        height: 40,
        minHeight: 40,
        width: "100%",
    },
    fieldsfilter: {
        width: 220,
    },
    transparent: {
        color: "transparent",
    },
    commentary: {
        fontStyle: "italic",
    },
    section: {
        fontWeight: "bold",
    },
}));

const IDGENERALCONFIGURATION = "IDGENERALCONFIGURATION";
const GeneralConfiguration: React.FC<{ dataPlan: any; currencyList: any }> = ({ dataPlan, currencyList }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const multiResult = useSelector((state) => state.main.multiDataAux);

    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    const [domainDocument, setDomainDocument] = useState<{ loading: boolean; data: Dictionary[] }>({
        data: [],
        loading: false,
    });

    const [domainInvoiceProvider, setDomainInvoiceProvider] = useState<{ loading: boolean; data: Dictionary[] }>({
        data: [],
        loading: false,
    });

    const [domainPaymentProvider, setDomainPaymentProvider] = useState<{ loading: boolean; data: Dictionary[] }>({
        data: [],
        loading: false,
    });

    const [domainPrinting, setDomainPrinting] = useState<{ loading: boolean; data: Dictionary[] }>({
        data: [],
        loading: false,
    });

    const [domainLocation, setDomainLocation] = useState<{ loading: boolean; data: Dictionary[] }>({
        data: [],
        loading: false,
    });

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(appsettingInvoiceSel()));
    }

    useEffect(() => {
        search();

        setDomainDocument({ loading: true, data: [] });
        setDomainInvoiceProvider({ loading: true, data: [] });
        setDomainPaymentProvider({ loading: true, data: [] });
        setDomainPrinting({ loading: true, data: [] });

        dispatch(
            getMultiCollectionAux([
                getValuesFromDomainCorp("BILLINGDOCUMENTTYPE", "_DOCUMENT", 1, 0),
                getValuesFromDomainCorp("BILLINGINVOICEPROVIDER", "_INVOICEPROVIDER", 1, 0),
                getValuesFromDomainCorp("BILLINGPAYMENTPROVIDER", "_PAYMENTPROVIDER", 1, 0),
                getValuesFromDomainCorp("BILLINGPRINTING", "_PRINTING", 1, 0),
                getValuesFromDomainCorp("BILLINGLOCATION", "_LOCATION", 1, 0),
            ])
        );

        dispatch(
            setMemoryTable({
                id: IDGENERALCONFIGURATION,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
        }
    }, [mainResult]);

    useEffect(() => {
        const indexDomainDocument = multiResult.data.findIndex(
            (x: MultiData) => x.key === "UFN_DOMAIN_LST_VALORES_DOCUMENT"
        );

        if (indexDomainDocument > -1) {
            setDomainDocument({
                loading: false,
                data:
                    multiResult.data[indexDomainDocument] && multiResult.data[indexDomainDocument].success
                        ? multiResult.data[indexDomainDocument].data
                        : [],
            });
        }

        const indexDomainInvoiceProvider = multiResult.data.findIndex(
            (x: MultiData) => x.key === "UFN_DOMAIN_LST_VALORES_INVOICEPROVIDER"
        );

        if (indexDomainInvoiceProvider > -1) {
            setDomainInvoiceProvider({
                loading: false,
                data:
                    multiResult.data[indexDomainInvoiceProvider] && multiResult.data[indexDomainInvoiceProvider].success
                        ? multiResult.data[indexDomainInvoiceProvider].data
                        : [],
            });
        }

        const indexDomainPaymentProvider = multiResult.data.findIndex(
            (x: MultiData) => x.key === "UFN_DOMAIN_LST_VALORES_PAYMENTPROVIDER"
        );

        if (indexDomainPaymentProvider > -1) {
            setDomainPaymentProvider({
                loading: false,
                data:
                    multiResult.data[indexDomainPaymentProvider] && multiResult.data[indexDomainPaymentProvider].success
                        ? multiResult.data[indexDomainPaymentProvider].data
                        : [],
            });
        }

        const indexDomainPrinting = multiResult.data.findIndex(
            (x: MultiData) => x.key === "UFN_DOMAIN_LST_VALORES_PRINTING"
        );

        if (indexDomainPrinting > -1) {
            setDomainPrinting({
                loading: false,
                data:
                    multiResult.data[indexDomainPrinting] && multiResult.data[indexDomainPrinting].success
                        ? multiResult.data[indexDomainPrinting].data
                        : [],
            });
        }

        const indexDomainLocation = multiResult.data.findIndex(
            (x: MultiData) => x.key === "UFN_DOMAIN_LST_VALORES_LOCATION"
        );

        if (indexDomainLocation > -1) {
            setDomainLocation({
                loading: false,
                data:
                    multiResult.data[indexDomainLocation] && multiResult.data[indexDomainLocation].success
                        ? multiResult.data[indexDomainLocation].data
                        : [],
            });
        }
    }, [multiResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "appsettingid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "location",
                Header: t(langKeys.billingconfiguration_location),
            },
            {
                accessor: "countrydesc",
                Header: t(langKeys.billingconfiguration_country),
            },
            {
                accessor: "businessname",
                Header: t(langKeys.billingconfiguration_businessname),
            },
            {
                accessor: "ruc",
                Header: t(langKeys.billingconfiguration_ruc),
            },
            {
                accessor: "tradename",
                Header: t(langKeys.billingconfiguration_tradename),
            },
            {
                accessor: "ubigeo",
                Header: t(langKeys.billingconfiguration_ubigeo),
            },
            {
                accessor: "fiscaladdress",
                Header: t(langKeys.billingconfiguration_fiscaladdress),
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(appsettingInvoiceSel()));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                dispatch(showBackdrop(false));
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.billingconfiguration).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                execute(
                    appsettingInvoiceIns({
                        ...row,
                        id: row.appsettingid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                    })
                )
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    register={true}
                    initialPageIndex={
                        IDGENERALCONFIGURATION === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDGENERALCONFIGURATION === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDGENERALCONFIGURATION === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </Fragment>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailGeneralConfiguration
                data={rowSelected}
                dataPlan={dataPlan}
                currencyList={currencyList}
                domainDocument={domainDocument}
                domainInvoiceProvider={domainInvoiceProvider}
                domainPaymentProvider={domainPaymentProvider}
                domainPrinting={domainPrinting}
                domainLocation={domainLocation}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    } else return null;
};

const DetailGeneralConfiguration: React.FC<DetailGeneralConfigurationProps> = ({
    data: { row, edit },
    dataPlan,
    currencyList,
    domainDocument,
    domainInvoiceProvider,
    domainPaymentProvider,
    domainPrinting,
    domainLocation,
    fetchData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);

    const [waitSave, setWaitSave] = useState(false);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.billingconfiguration) },
        { id: "view-2", name: t(langKeys.billingconfiguration_detail) },
    ];

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
    } = useForm({
        defaultValues: {
            annexcode: row?.annexcode || "",
            businessname: row?.businessname || "",
            country: row?.country || "",
            culqiurl: row?.culqiurl || "",
            culqiurlcardcreate: row?.culqiurlcardcreate || "",
            culqiurlcarddelete: row?.culqiurlcarddelete || "",
            culqiurlcardget: row?.culqiurlcardget || "",
            culqiurlcharge: row?.culqiurlcharge || "",
            culqiurlclient: row?.culqiurlclient || "",
            culqiurltoken: row?.culqiurltoken || "",
            currency: row?.currency || "",
            description: row?.description || 0,
            detraction: row?.detraction || 0,
            detractionaccount: row?.detractionaccount || "",
            detractioncode: row?.detractioncode || "",
            detractionminimum: row?.detractionminimum || 0,
            documenttype: row?.documenttype || "",
            emittertype: row?.emittertype || "",
            fiscaladdress: row?.fiscaladdress || "",
            id: row ? row.appsettingid : 0,
            igv: row?.igv || 0,
            invoicecorrelative: row?.invoicecorrelative || 0,
            invoicecreditcorrelative: row?.invoicecreditcorrelative || 0,
            invoicecreditserie: row?.invoicecreditserie || "",
            invoiceprovider: row?.invoiceprovider || "",
            invoiceserie: row?.invoiceserie || "",
            location: row?.location || "",
            operation: row ? "UPDATE" : "INSERT",
            operationcodeother: row?.operationcodeother || "",
            operationcodeperu: row?.operationcodeperu || "",
            paymentprovider: row?.paymentprovider || "",
            printingformat: row?.printingformat || "",
            privatekey: row?.privatekey || "",
            publickey: row?.publickey || "",
            returnpdf: row?.returnpdf || false,
            returnxml: row?.returnxml || false,
            returnxmlsunat: row?.returnxmlsunat || false,
            ruc: row?.ruc || "",
            status: row ? row.status : "ACTIVO",
            sunaturl: row?.sunaturl || "",
            sunatusername: row?.sunatusername || "",
            ticketcorrelative: row?.ticketcorrelative || 0,
            ticketcreditcorrelative: row?.ticketcreditcorrelative || 0,
            ticketcreditserie: row?.ticketcreditserie || "",
            ticketserie: row?.ticketserie || "",
            token: row?.token || "",
            tradename: row?.tradename || "",
            type: row?.type || "",
            ubigeo: row?.ubigeo || "",
            ublversion: row?.ublversion || "",
            xmlversion: row?.xmlversion || "",
        },
    });

    React.useEffect(() => {
        register("country", { validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)) });
        register("description");
        register("detraction");
        register("detractionminimum");
        register("documenttype", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });
        register("id");
        register("igv");
        register("invoicecorrelative");
        register("invoicecreditcorrelative");
        register("location", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });
        register("operation");
        register("returnpdf");
        register("returnxml");
        register("returnxmlsunat");
        register("ruc", { validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)) });
        register("status");
        register("sunatusername");
        register("ticketcorrelative");
        register("ticketcreditcorrelative");
        register("token", { validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)) });
        register("type");

        register("annexcode", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("culqiurl", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("currency", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("privatekey", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("publickey", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("sunaturl", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("tradename", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("ublversion", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("xmlversion", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("businessname", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("culqiurlcardcreate", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("culqiurlcarddelete", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("culqiurlcardget", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("culqiurlcharge", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("culqiurlclient", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("culqiurltoken", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("detractionaccount", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("detractioncode", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("emittertype", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("fiscaladdress", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("invoicecreditserie", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("invoiceprovider", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("invoiceserie", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("operationcodeother", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("operationcodeperu", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("paymentprovider", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("printingformat", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("ticketcreditserie", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("ticketserie", {
            validate: (value) => (value && value.length > 0) || String(t(langKeys.field_required)),
        });

        register("ubigeo", {
            validate: (value) =>
                getValues("country") === "PE"
                    ? (value && value.length > 0) || String(t(langKeys.field_required))
                    : true,
        });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.supportplan).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(appsettingInvoiceIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_save),
                visible: true,
            })
        );
    });

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs breadcrumbs={arrayBread} handleClick={setViewSelected} />
                        {row && <TitleDetail title={t(langKeys.billingconfiguration)} />}
                        {!row && <TitleDetail title={t(langKeys.billingconfiguration_new)} />}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            disabled={executeResult.loading}
                            onClick={() => setViewSelected("view-1")}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        {edit && (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={executeResult.loading}
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.save)}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">
                        {t(langKeys.billingsetupgeneralinformation)}
                    </Typography>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={domainLocation.data}
                            error={errors?.location?.message}
                            label={t(langKeys.billingconfiguration_location)}
                            loading={domainLocation.loading}
                            onChange={(value) => setValue("location", value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            orderbylabel={true}
                            prefixTranslation="billingfield_"
                            uset={true}
                            valueDefault={getValues("location")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.businessname?.message}
                            label={t(langKeys.billingcompanyname)}
                            onChange={(value) => setValue("businessname", value)}
                            valueDefault={getValues("businessname")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={domainDocument.data}
                            error={errors?.documenttype?.message}
                            label={t(langKeys.billingconfiguration_documenttype)}
                            loading={domainDocument.loading}
                            onChange={(value) => setValue("documenttype", value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            orderbylabel={true}
                            prefixTranslation="billingfield_"
                            uset={true}
                            valueDefault={getValues("documenttype")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.tradename?.message}
                            label={t(langKeys.billingcommercialname)}
                            onChange={(value) => setValue("tradename", value)}
                            valueDefault={getValues("tradename")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.ruc?.message}
                            label={t(langKeys.billingconfiguration_documentnumber)}
                            onChange={(value) => setValue("ruc", value)}
                            valueDefault={getValues("ruc")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.fiscaladdress?.message}
                            label={t(langKeys.billingfiscaladdress)}
                            onChange={(value) => setValue("fiscaladdress", value)}
                            valueDefault={getValues("fiscaladdress")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={getValues("country") !== "PE"}
                            error={errors?.ubigeo?.message}
                            label={t(langKeys.billingubigeocode)}
                            onChange={(value) => setValue("ubigeo", value)}
                            valueDefault={getValues("ubigeo")}
                        />
                        <FieldSelect
                            className="col-6"
                            data={dataPlan}
                            error={errors?.country?.message}
                            label={t(langKeys.billingcountry)}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                            valueDefault={getValues("country")}
                            onChange={(value) => {
                                setValue("country", value?.code);
                                if (value?.code !== "PE") {
                                    setValue("ubigeo", "");
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">
                        {t(langKeys.billingsetupbillinginformation)}
                    </Typography>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={domainDocument.data}
                            error={errors?.emittertype?.message}
                            label={t(langKeys.billingemittertype)}
                            loading={domainDocument.loading}
                            onChange={(value) => setValue("emittertype", value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            orderbylabel={true}
                            prefixTranslation="billingfield_"
                            uset={true}
                            valueDefault={getValues("emittertype")}
                        />
                        <FieldSelect
                            className="col-6"
                            data={currencyList ?? []}
                            error={errors?.currency?.message}
                            label={t(langKeys.billingcurrency)}
                            onChange={(value) => setValue("currency", value?.code)}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                            valueDefault={getValues("currency")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.invoiceserie?.message}
                            label={t(langKeys.billingserial)}
                            onChange={(value) => setValue("invoiceserie", value)}
                            valueDefault={getValues("invoiceserie")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.invoicecorrelative?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingcorrelative)}
                            onChange={(value) => setValue("invoicecorrelative", value)}
                            type="number"
                            valueDefault={getValues("invoicecorrelative")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.ticketserie?.message}
                            label={t(langKeys.ticketserial)}
                            onChange={(value) => setValue("ticketserie", value)}
                            valueDefault={getValues("ticketserie")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.ticketcorrelative?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.ticketcorrelative)}
                            onChange={(value) => setValue("ticketcorrelative", value)}
                            type="number"
                            valueDefault={getValues("ticketcorrelative")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.invoicecreditserie?.message}
                            label={t(langKeys.invoicecreditserial)}
                            onChange={(value) => setValue("invoicecreditserie", value)}
                            valueDefault={getValues("invoicecreditserie")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.invoicecreditcorrelative?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.invoicecreditcorrelative)}
                            onChange={(value) => setValue("invoicecreditcorrelative", value)}
                            type="number"
                            valueDefault={getValues("invoicecreditcorrelative")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.ticketcreditserie?.message}
                            label={t(langKeys.ticketcreditserial)}
                            onChange={(value) => setValue("ticketcreditserie", value)}
                            valueDefault={getValues("ticketcreditserie")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.ticketcreditcorrelative?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.ticketcreditcorrelative)}
                            onChange={(value) => setValue("ticketcreditcorrelative", value)}
                            type="number"
                            valueDefault={getValues("ticketcreditcorrelative")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.annexcode?.message}
                            label={t(langKeys.billingannexcode)}
                            onChange={(value) => setValue("annexcode", value)}
                            valueDefault={getValues("annexcode")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.igv?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingtax)}
                            onChange={(value) => setValue("igv", value)}
                            type="number"
                            valueDefault={getValues("igv")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.detractioncode?.message}
                            label={t(langKeys.detractioncode)}
                            onChange={(value) => setValue("detractioncode", value)}
                            valueDefault={getValues("detractioncode")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.detraction?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.detraction)}
                            onChange={(value) => setValue("detraction", value)}
                            type="number"
                            valueDefault={getValues("detraction")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.detractionaccount?.message}
                            label={t(langKeys.detractionaccount)}
                            onChange={(value) => setValue("detractionaccount", value)}
                            valueDefault={getValues("detractionaccount")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.detractionminimum?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.detractionminimum)}
                            onChange={(value) => setValue("detractionminimum", value)}
                            type="number"
                            valueDefault={getValues("detractionminimum")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.operationcodeperu?.message}
                            label={t(langKeys.operationcodeperu)}
                            onChange={(value) => setValue("operationcodeperu", value)}
                            valueDefault={getValues("operationcodeperu")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.operationcodeother?.message}
                            label={t(langKeys.operationcodeother)}
                            onChange={(value) => setValue("operationcodeother", value)}
                            valueDefault={getValues("operationcodeother")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={domainPrinting.data}
                            error={errors?.printingformat?.message}
                            label={t(langKeys.billingprintingformat)}
                            loading={domainPrinting.loading}
                            onChange={(value) => setValue("printingformat", value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            orderbylabel={true}
                            prefixTranslation="billingfield_"
                            uset={true}
                            valueDefault={getValues("printingformat")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.xmlversion?.message}
                            label={t(langKeys.billingxmlversion)}
                            onChange={(value) => setValue("xmlversion", value)}
                            valueDefault={getValues("xmlversion")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.ublversion?.message}
                            label={t(langKeys.billingublversion)}
                            onChange={(value) => setValue("ublversion", value)}
                            valueDefault={getValues("ublversion")}
                        />
                        <TemplateSwitch
                            className="col-6"
                            label={t(langKeys.billingreturnpdf)}
                            onChange={(value) => setValue("returnpdf", value)}
                            valueDefault={getValues("returnpdf")}
                        />
                    </div>
                    <div className="row-zyx">
                        <TemplateSwitch
                            className="col-6"
                            label={t(langKeys.billingreturncsv)}
                            onChange={(value) => setValue("returnxmlsunat", value)}
                            valueDefault={getValues("returnxmlsunat")}
                        />
                        <TemplateSwitch
                            className="col-6"
                            label={t(langKeys.billingreturnxml)}
                            onChange={(value) => setValue("returnxml", value)}
                            valueDefault={getValues("returnxml")}
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">
                        {t(langKeys.billingsetupsunatinformation)}
                    </Typography>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={domainInvoiceProvider.data}
                            error={errors?.invoiceprovider?.message}
                            label={t(langKeys.billinginvoiceprovider)}
                            loading={domainInvoiceProvider.loading}
                            onChange={(value) => setValue("invoiceprovider", value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            orderbylabel={true}
                            prefixTranslation="billingfield_"
                            uset={true}
                            valueDefault={getValues("invoiceprovider")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.sunaturl?.message}
                            label={t(langKeys.billingapiendpoint)}
                            onChange={(value) => setValue("sunaturl", value)}
                            valueDefault={getValues("sunaturl")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.token?.message}
                            label={t(langKeys.billingtoken)}
                            onChange={(value) => setValue("token", value)}
                            valueDefault={getValues("token")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.sunatusername?.message}
                            label={t(langKeys.billingusername)}
                            onChange={(value) => setValue("sunatusername", value)}
                            valueDefault={getValues("sunatusername")}
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">
                        {t(langKeys.billingsetuppaymentinformation)}
                    </Typography>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={domainPaymentProvider.data}
                            error={errors?.paymentprovider?.message}
                            label={t(langKeys.billingpaymentprovider)}
                            loading={domainPaymentProvider.loading}
                            onChange={(value) => setValue("paymentprovider", value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            orderbylabel={true}
                            prefixTranslation="billingfield_"
                            uset={true}
                            valueDefault={getValues("paymentprovider")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.culqiurl?.message}
                            label={t(langKeys.billingpaymentendpoint)}
                            onChange={(value) => setValue("culqiurl", value)}
                            valueDefault={getValues("culqiurl")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.publickey?.message}
                            label={t(langKeys.billingpublickey)}
                            onChange={(value) => setValue("publickey", value)}
                            valueDefault={getValues("publickey")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.privatekey?.message}
                            label={t(langKeys.billingprivatekey)}
                            onChange={(value) => setValue("privatekey", value)}
                            valueDefault={getValues("privatekey")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.culqiurlcardcreate?.message}
                            label={t(langKeys.culqiurlcardcreate)}
                            onChange={(value) => setValue("culqiurlcardcreate", value)}
                            valueDefault={getValues("culqiurlcardcreate")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.culqiurlclient?.message}
                            label={t(langKeys.culqiurlclient)}
                            onChange={(value) => setValue("culqiurlclient", value)}
                            valueDefault={getValues("culqiurlclient")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.culqiurltoken?.message}
                            label={t(langKeys.culqiurltoken)}
                            onChange={(value) => setValue("culqiurltoken", value)}
                            valueDefault={getValues("culqiurltoken")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.culqiurlcharge?.message}
                            label={t(langKeys.culqiurlcharge)}
                            onChange={(value) => setValue("culqiurlcharge", value)}
                            valueDefault={getValues("culqiurlcharge")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.culqiurlcardget?.message}
                            label={t(langKeys.culqiurlcardget)}
                            onChange={(value) => setValue("culqiurlcardget", value)}
                            valueDefault={getValues("culqiurlcardget")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.culqiurlcarddelete?.message}
                            label={t(langKeys.culqiurlcarddelete)}
                            onChange={(value) => setValue("culqiurlcarddelete", value)}
                            valueDefault={getValues("culqiurlcarddelete")}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const IDCONTRACTEDPLAN = "IDCONTRACTEDPLAN";
const ContractedPlanByPeriod: React.FC<{ dataPlan: any; currencyList: any }> = ({ dataPlan, currencyList }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        plan: "",
        year: String(new Date().getFullYear()),
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(getBillingConfigurationSel(dataMain)));
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    useEffect(() => {
        search();

        dispatch(
            setMemoryTable({
                id: IDCONTRACTEDPLAN,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
        }
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "billingconfigurationid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "year",
                Header: t(langKeys.year),
            },
            {
                accessor: "month",
                Header: t(langKeys.month),
            },
            {
                accessor: "plan",
                Header: t(langKeys.billingconfiguration_plan),
            },
            {
                accessor: "plancurrency",
                Header: t(langKeys.billingconfiguration_plancurrency),
            },
            {
                accessor: "vcacomission",
                Header: t(langKeys.billingconfiguration_vcacomission),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { vcacomission } = props.cell.row.original;
                    return formatNumberFourDecimals(vcacomission || 0);
                },
            },
            {
                accessor: "basicanualfee",
                Header: t(langKeys.billingconfiguration_basicanualfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { basicanualfee } = props.cell.row.original;
                    return formatNumber(basicanualfee || 0);
                },
            },
            {
                accessor: "basicfee",
                Header: t(langKeys.billingconfiguration_basicfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return formatNumber(basicfee || 0);
                },
            },
            {
                accessor: "userfreequantity",
                Header: t(langKeys.numberofagentshired),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { userfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(userfreequantity || 0);
                },
            },
            {
                accessor: "useradditionalfee",
                Header: t(langKeys.useradditionalfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { useradditionalfee } = props.cell.row.original;
                    return formatNumberFourDecimals(useradditionalfee || 0);
                },
            },
            {
                accessor: "usercreateoverride",
                editable: true,
                Header: t(langKeys.allowuseroverride),
                maxWidth: 180,
                NoFilter: false,
                sortType: "basic",
                type: "boolean",
                width: 180,
                Cell: (props: any) => {
                    const { usercreateoverride } = props.cell.row.original;
                    return usercreateoverride ? t(langKeys.yes) : "No";
                },
            },
            {
                accessor: "channelfreequantity",
                Header: t(langKeys.channelfreequantity),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { channelfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(channelfreequantity || 0);
                },
            },
            {
                accessor: "channelotherfee",
                Header: t(langKeys.contractedplanchannelotherfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { channelotherfee } = props.cell.row.original;
                    return formatNumberFourDecimals(channelotherfee || 0);
                },
            },
            {
                accessor: "freewhatsappchannel",
                Header: t(langKeys.contractedplanfreewhatsappchannel),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { freewhatsappchannel } = props.cell.row.original;
                    return formatNumberNoDecimals(freewhatsappchannel || 0);
                },
            },
            {
                accessor: "channelwhatsappfee",
                Header: t(langKeys.channelwhatsappfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { channelwhatsappfee } = props.cell.row.original;
                    return formatNumberFourDecimals(channelwhatsappfee || 0);
                },
            },
            {
                accessor: "whatsappconversationfreequantity",
                Header: t(langKeys.contractedplanfreewhatsappconversation),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { whatsappconversationfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(whatsappconversationfreequantity || 0);
                },
            },
            {
                accessor: "channelcreateoverride",
                editable: true,
                Header: t(langKeys.allowchanneloverride),
                maxWidth: 180,
                NoFilter: false,
                sortType: "basic",
                type: "boolean",
                width: 180,
                Cell: (props: any) => {
                    const { channelcreateoverride } = props.cell.row.original;
                    return channelcreateoverride ? t(langKeys.yes) : "No";
                },
            },
            {
                accessor: "clientfreequantity",
                Header: t(langKeys.clientfreequantity),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { clientfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(clientfreequantity || 0);
                },
            },
            {
                accessor: "clientadditionalfee",
                Header: t(langKeys.clientadditionalfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { clientadditionalfee } = props.cell.row.original;
                    return formatNumberFourDecimals(clientadditionalfee || 0);
                },
            },
            {
                accessor: "allowhsm",
                editable: true,
                Header: t(langKeys.allowhsm),
                maxWidth: 180,
                NoFilter: false,
                sortType: "basic",
                type: "boolean",
                width: 180,
                Cell: (props: any) => {
                    const { allowhsm } = props.cell.row.original;
                    return allowhsm ? t(langKeys.yes) : "No";
                },
            },
            {
                accessor: "vcacomissionperhsm",
                Header: t(langKeys.vcacomissionperhsm),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { vcacomissionperhsm } = props.cell.row.original;
                    return formatNumberFourDecimals(vcacomissionperhsm || 0);
                },
            },
            {
                accessor: "vcacomissionpervoicechannel",
                Header: t(langKeys.vcacomissionpervoicechannel),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { vcacomissionpervoicechannel } = props.cell.row.original;
                    return formatNumber(vcacomissionpervoicechannel || 0);
                },
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConfigurationSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false);
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) })
                    );
                } else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                }
                dispatch(showBackdrop(false));
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.billingplan).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                execute(
                    billingConfigurationIns({
                        ...row,
                        id: row.billingconfigurationid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                    })
                )
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: "4px" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 300 }}
                                uset={true}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({
                                        ...prev,
                                        month: value.map((o: Dictionary) => o.val).join(),
                                    }))
                                }
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataPlan}
                                label={t(langKeys.billingconfiguration_plan)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, plan: value?.plan || "" }))}
                                optionDesc="plan"
                                optionValue="plan"
                                orderbylabel={true}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                            />
                            <Button
                                color="primary"
                                disabled={mainResult.mainData.loading || disableSearch}
                                onClick={() => search()}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    register={true}
                    initialPageIndex={
                        IDCONTRACTEDPLAN === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDCONTRACTEDPLAN === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDCONTRACTEDPLAN === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </Fragment>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailContractedPlanByPeriod
                data={rowSelected}
                dataPlan={dataPlan}
                currencyList={currencyList}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    } else return null;
};

const DetailContractedPlanByPeriod: React.FC<DetailSupportPlanProps> = ({
    data: { row, edit },
    dataPlan,
    currencyList,
    fetchData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);

    const [checkedaux, setCheckedaux] = useState(row?.allowhsm || false);
    const [checkedchannel, setCheckedchannel] = useState(row?.channelcreateoverride || false);
    const [checkeduser, setCheckeduser] = useState(row?.usercreateoverride || false);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [waitSave, setWaitSave] = useState(false);

    const [datetoshow, setdatetoshow] = useState(
        row
            ? `${row.year}-${String(row.month).padStart(2, "0")}`
            : `${new Date(new Date().setDate(1)).getFullYear()}-${String(
                new Date(new Date().setDate(1)).getMonth() + 1
            ).padStart(2, "0")}`
    );

    const arrayBreadContractedPlan = [
        { id: "view-1", name: t(langKeys.contractedplan) },
        { id: "view-2", name: t(langKeys.contractedplandetail) },
    ];

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
    } = useForm({
        defaultValues: {
            allowhsm: row?.allowhsm || false,
            basicanualfee: row?.basicanualfee || 0,
            basicfee: row?.basicfee || 0,
            channelcreateoverride: row?.channelcreateoverride || false,
            channelfreequantity: row?.channelfreequantity || 0,
            channelotherfee: row?.channelotherfee || 0,
            channelwhatsappfee: row?.channelwhatsappfee || 0,
            clientadditionalfee: row?.clientadditionalfee || 0,
            clientfreequantity: row?.clientfreequantity || 0,
            description: row ? row.description : "",
            freewhatsappchannel: row?.freewhatsappchannel || 0,
            hsmfee: row?.hsmfee || 0,
            id: row?.billingconfigurationid || 0,
            month: row?.month || new Date().getMonth() + 1,
            operation: row ? "UPDATE" : "INSERT",
            plan: row?.plan || "",
            plancurrency: row ? row.plancurrency : "",
            status: row ? row.status : "ACTIVO",
            type: row ? row.type : "",
            useradditionalfee: row?.useradditionalfee || 0,
            usercreateoverride: row?.usercreateoverride || false,
            userfreequantity: row?.userfreequantity || 0,
            vcacomission: row?.vcacomission || 0,
            vcacomissionperhsm: row?.vcacomissionperhsm || 0,
            vcacomissionpervoicechannel: row?.vcacomissionpervoicechannel || 0,
            whatsappconversationfreequantity: row?.whatsappconversationfreequantity || 0,
            year: row?.year || new Date().getFullYear(),
        },
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            const datetochange = new Date(e + "-02");
            const mes = datetochange?.getMonth() + 1;
            const year = datetochange?.getFullYear();

            setdatetoshow(`${year}-${String(mes).padStart(2, "0")}`);
            setValue("year", year);
            setValue("month", mes);
        }
    }

    useEffect(() => {
        setExchangeRate(
            (currencyList ?? []).find((item) => {
                return item.code === (row?.plancurrency || "");
            })?.exchangerate || 0
        );
    }, [row]);

    React.useEffect(() => {
        register("allowhsm");
        register("channelcreateoverride");
        register("description");
        register("hsmfee");
        register("id");
        register("month");
        register("operation");
        register("plan", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("plancurrency", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status");
        register("type");
        register("usercreateoverride");
        register("year");

        register("basicanualfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("basicfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("channelfreequantity", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("channelotherfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("channelwhatsappfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("clientadditionalfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("clientfreequantity", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("freewhatsappchannel", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("useradditionalfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("userfreequantity", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("vcacomission", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("vcacomissionperhsm", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("vcacomissionpervoicechannel", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("whatsappconversationfreequantity", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.billingplan).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingConfigurationIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_save),
                visible: true,
            })
        );
    });

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs breadcrumbs={arrayBreadContractedPlan} handleClick={setViewSelected} />
                        {row && <TitleDetail title={t(langKeys.contractedplan)} />}
                        {!row && <TitleDetail title={t(langKeys.newcontractedplanbyperiod)} />}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            disabled={executeResult.loading}
                            onClick={() => setViewSelected("view-1")}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        {edit && (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={executeResult.loading}
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.save)}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <TextField
                            className="col-12"
                            id="date"
                            onChange={(e) => handleDateChange(e.target.value)}
                            size="small"
                            type="month"
                            value={datetoshow}
                            variant="outlined"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataPlan}
                            error={errors?.plan?.message}
                            label={t(langKeys.billingconfiguration_plan)}
                            onChange={(value) => setValue("plan", value?.plan)}
                            optionDesc="plan"
                            optionValue="plan"
                            orderbylabel={true}
                            valueDefault={getValues("plan")}
                        />
                        <FieldSelect
                            className="col-6"
                            data={currencyList ?? []}
                            error={errors?.plancurrency?.message}
                            label={t(langKeys.billingconfiguration_plancurrency)}
                            onChange={(value) => {
                                setValue("plancurrency", value?.code);
                                setExchangeRate(value?.exchangerate || 0);
                            }}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                            valueDefault={getValues("plancurrency")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.vcacomission?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconfiguration_vcacomission)}
                            onChange={(value) => setValue("vcacomission", value)}
                            type="number"
                            valueDefault={getValues("vcacomission")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.basicanualfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconfiguration_basicanualfee)}
                            onChange={(value) => setValue("basicanualfee", value)}
                            type="number"
                            valueDefault={getValues("basicanualfee")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.basicfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconfiguration_basicfee)}
                            onChange={(value) => setValue("basicfee", value)}
                            type="number"
                            valueDefault={getValues("basicfee")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.userfreequantity?.message}
                            label={t(langKeys.numberofagentshired)}
                            onChange={(value) => setValue("userfreequantity", value)}
                            type="number"
                            valueDefault={getValues("userfreequantity")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.useradditionalfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.useradditionalfee)}
                            onChange={(value) => setValue("useradditionalfee", value)}
                            type="number"
                            valueDefault={getValues("useradditionalfee")}
                        />
                        <div className={"col-6"} style={{ paddingBottom: "3px" }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                {t(langKeys.allowuseroverride)}
                            </Box>
                            <FormControlLabel
                                label={""}
                                style={{ paddingLeft: 10 }}
                                control={
                                    <IOSSwitch
                                        checked={checkeduser}
                                        onChange={(e) => {
                                            setCheckeduser(e.target.checked);
                                            setValue("usercreateoverride", e.target.checked);
                                        }}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.channelfreequantity?.message}
                            label={t(langKeys.channelfreequantity)}
                            onChange={(value) => setValue("channelfreequantity", value)}
                            type="number"
                            valueDefault={getValues("channelfreequantity")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.channelotherfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.contractedplanchannelotherfee)}
                            onChange={(value) => setValue("channelotherfee", value)}
                            type="number"
                            valueDefault={getValues("channelotherfee")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.freewhatsappchannel?.message}
                            label={t(langKeys.contractedplanfreewhatsappchannel)}
                            onChange={(value) => setValue("freewhatsappchannel", value)}
                            type="number"
                            valueDefault={getValues("freewhatsappchannel")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.channelwhatsappfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.channelwhatsappfee)}
                            onChange={(value) => setValue("channelwhatsappfee", value)}
                            type="number"
                            valueDefault={getValues("channelwhatsappfee")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.whatsappconversationfreequantity?.message}
                            label={t(langKeys.contractedplanfreewhatsappconversation)}
                            onChange={(value) => setValue("whatsappconversationfreequantity", value)}
                            type="number"
                            valueDefault={getValues("whatsappconversationfreequantity")}
                        />
                        <div className={"col-6"} style={{ paddingBottom: "3px" }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                {t(langKeys.allowchanneloverride)}
                            </Box>
                            <FormControlLabel
                                label={""}
                                style={{ paddingLeft: 10 }}
                                control={
                                    <IOSSwitch
                                        checked={checkedchannel}
                                        onChange={(e) => {
                                            setCheckedchannel(e.target.checked);
                                            setValue("channelcreateoverride", e.target.checked);
                                        }}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.clientfreequantity?.message}
                            label={t(langKeys.clientfreequantity)}
                            onChange={(value) => setValue("clientfreequantity", value)}
                            type="number"
                            valueDefault={getValues("clientfreequantity")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.clientadditionalfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.clientadditionalfee)}
                            onChange={(value) => setValue("clientadditionalfee", value)}
                            type="number"
                            valueDefault={getValues("clientadditionalfee")}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={"col-6"} style={{ paddingBottom: "3px" }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                {t(langKeys.allowhsm)}
                            </Box>
                            <FormControlLabel
                                label={""}
                                style={{ paddingLeft: 10 }}
                                control={
                                    <IOSSwitch
                                        checked={checkedaux}
                                        onChange={(e) => {
                                            setCheckedaux(e.target.checked);
                                            setValue("allowhsm", e.target.checked);
                                        }}
                                    />
                                }
                            />
                        </div>
                        <FieldEdit
                            className="col-6"
                            error={errors?.vcacomissionperhsm?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.vcacomissionperhsm)}
                            onChange={(value) => setValue("vcacomissionperhsm", value)}
                            type="number"
                            valueDefault={getValues("vcacomissionperhsm")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.vcacomissionpervoicechannel?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.vcacomissionpervoicechannel)}
                            onChange={(value) => setValue("vcacomissionpervoicechannel", value)}
                            type="number"
                            valueDefault={getValues("vcacomissionpervoicechannel")}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.billingconfiguration_exchangerate)}
                            value={formatNumber(exchangeRate || 0)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const IDCONVERSATIONCOST = "IDCONVERSATIONCOST";
const ConversationCost: React.FC<{ dataPlan: any; currencyList: any }> = ({ dataPlan, currencyList }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        countrycode: "",
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        year: String(new Date().getFullYear()),
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(getBillingConversationSel(dataMain)));
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    useEffect(() => {
        search();

        dispatch(
            setMemoryTable({
                id: IDCONVERSATIONCOST,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
        }
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "billingconversationid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "year",
                Header: t(langKeys.year),
            },
            {
                accessor: "month",
                Header: t(langKeys.month),
            },
            {
                accessor: "countrycode",
                Header: t(langKeys.countrycode),
            },
            {
                accessor: "country",
                Header: t(langKeys.country),
            },
            {
                accessor: "vcacomission",
                Header: t(langKeys.billingconversation_vcacomission),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { vcacomission } = props.cell.row.original;
                    return formatNumberFourDecimals(vcacomission || 0);
                },
            },
            {
                accessor: "plancurrency",
                Header: t(langKeys.billingconversation_plancurrency),
            },
            {
                accessor: "businessutilityfee",
                Header: t(langKeys.billingconversation_businessutilityfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { businessutilityfee } = props.cell.row.original;
                    return formatNumberFourDecimals(businessutilityfee || 0);
                },
            },
            {
                accessor: "businessauthenticationfee",
                Header: t(langKeys.billingconversation_businessauthenticationfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { businessauthenticationfee } = props.cell.row.original;
                    return formatNumberFourDecimals(businessauthenticationfee || 0);
                },
            },
            {
                accessor: "businessmarketingfee",
                Header: t(langKeys.billingconversation_businessmarketingfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { businessmarketingfee } = props.cell.row.original;
                    return formatNumberFourDecimals(businessmarketingfee || 0);
                },
            },
            {
                accessor: "usergeneralfee",
                Header: t(langKeys.billingconversation_usergeneralfee),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { usergeneralfee } = props.cell.row.original;
                    return formatNumberFourDecimals(usergeneralfee || 0);
                },
            },
            {
                accessor: "freequantity",
                Header: t(langKeys.billingconversation_freequantity),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { freequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(freequantity || 0);
                },
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConversationSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false);
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) })
                    );
                } else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                }
                dispatch(showBackdrop(false));
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.conversationcost).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                execute(
                    billingConversationIns({
                        ...row,
                        id: row.billingconversationid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                    })
                )
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: "4px" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 300 }}
                                uset={true}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({
                                        ...prev,
                                        month: value.map((o: Dictionary) => o.val).join(),
                                    }))
                                }
                            />
                            <FieldMultiSelect
                                className={classes.fieldsfilter}
                                data={dataPlan}
                                label={t(langKeys.country)}
                                optionDesc="description"
                                optionValue="code"
                                valueDefault={dataMain.countrycode}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({
                                        ...prev,
                                        countrycode: value.map((o: Dictionary) => o.code).join(),
                                    }))
                                }
                            />
                            <Button
                                color="primary"
                                disabled={mainResult.mainData.loading || disableSearch}
                                onClick={() => search()}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    register={true}
                    initialPageIndex={
                        IDCONVERSATIONCOST === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDCONVERSATIONCOST === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDCONVERSATIONCOST === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </Fragment>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailConversationCost
                data={rowSelected}
                dataPlan={dataPlan}
                currencyList={currencyList}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    } else return null;
};

const DetailConversationCost: React.FC<DetailSupportPlanProps> = ({
    data: { row, edit },
    dataPlan,
    currencyList,
    fetchData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);

    const [exchangeRate, setExchangeRate] = useState(0);
    const [waitSave, setWaitSave] = useState(false);

    const [datetoshow, setdatetoshow] = useState(
        row
            ? `${row.year}-${String(row.month).padStart(2, "0")}`
            : `${new Date(new Date().setDate(1)).getFullYear()}-${String(
                new Date(new Date().setDate(1)).getMonth() + 1
            ).padStart(2, "0")}`
    );

    const arrayBreadConversationCost = [
        { id: "view-1", name: t(langKeys.conversationcost) },
        { id: "view-2", name: t(langKeys.conversationcostdetail) },
    ];

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
    } = useForm({
        defaultValues: {
            businessauthenticationfee: row?.businessauthenticationfee || 0,
            businessmarketingfee: row?.businessmarketingfee || 0,
            businessutilityfee: row?.businessutilityfee || 0,
            countrycode: row?.countrycode || "",
            description: row?.description || "",
            freequantity: row?.freequantity || 0,
            id: row ? row.billingconversationid : 0,
            month: row?.month || new Date().getMonth() + 1,
            operation: row ? "UPDATE" : "INSERT",
            plancurrency: row ? row.plancurrency : "",
            status: row ? row.status : "ACTIVO",
            type: row ? row.type : "",
            usergeneralfee: row?.usergeneralfee || 0,
            vcacomission: row?.vcacomission || 0,
            year: row?.year || new Date().getFullYear(),
        },
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            const datetochange = new Date(e + "-02");
            const mes = datetochange?.getMonth() + 1;
            const year = datetochange?.getFullYear();

            setdatetoshow(`${year}-${String(mes).padStart(2, "0")}`);
            setValue("year", year);
            setValue("month", mes);
        }
    }

    useEffect(() => {
        setExchangeRate(
            (currencyList ?? []).find((item) => {
                return item.code === (row?.plancurrency || "");
            })?.exchangerate || 0
        );
    }, [row]);

    React.useEffect(() => {
        register("countrycode", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("description");
        register("id");
        register("month");
        register("operation");
        register("plancurrency", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status");
        register("type");
        register("year");

        register("businessauthenticationfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("businessmarketingfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("businessutilityfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("freequantity", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("usergeneralfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("vcacomission", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.conversationcost).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingConversationIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_save),
                visible: true,
            })
        );
    });

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs breadcrumbs={arrayBreadConversationCost} handleClick={setViewSelected} />
                        {row && <TitleDetail title={t(langKeys.conversationcost)} />}
                        {!row && <TitleDetail title={t(langKeys.newconversationplan)} />}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            disabled={executeResult.loading}
                            onClick={() => setViewSelected("view-1")}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        {edit && (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={executeResult.loading}
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.save)}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <TextField
                            className="col-12"
                            id="date"
                            onChange={(e) => handleDateChange(e.target.value)}
                            size="small"
                            type="month"
                            value={datetoshow}
                            variant="outlined"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataPlan}
                            error={errors?.countrycode?.message}
                            label={t(langKeys.country)}
                            onChange={(value) => setValue("countrycode", value?.code)}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                            valueDefault={getValues("countrycode")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.vcacomission?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconversation_vcacomission)}
                            onChange={(value) => setValue("vcacomission", value)}
                            type="number"
                            valueDefault={getValues("vcacomission")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={currencyList ?? []}
                            error={errors?.plancurrency?.message}
                            label={t(langKeys.billingconversation_plancurrency)}
                            onChange={(value) => {
                                setValue("plancurrency", value?.code);
                                setExchangeRate(value?.exchangerate || 0);
                            }}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                            valueDefault={getValues("plancurrency")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.businessutilityfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconversation_businessutilityfee)}
                            onChange={(value) => setValue("businessutilityfee", value)}
                            type="number"
                            valueDefault={getValues("businessutilityfee")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.businessauthenticationfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconversation_businessauthenticationfee)}
                            onChange={(value) => setValue("businessauthenticationfee", value)}
                            type="number"
                            valueDefault={getValues("businessauthenticationfee")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.businessmarketingfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconversation_businessmarketingfee)}
                            onChange={(value) => setValue("businessmarketingfee", value)}
                            type="number"
                            valueDefault={getValues("businessmarketingfee")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.usergeneralfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingconversation_usergeneralfee)}
                            onChange={(value) => setValue("usergeneralfee", value)}
                            type="number"
                            valueDefault={getValues("usergeneralfee")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.freequantity?.message}
                            label={t(langKeys.billingconversation_freequantity)}
                            onChange={(value) => setValue("freequantity", value)}
                            type="number"
                            valueDefault={getValues("freequantity")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.description?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.description)}
                            onChange={(value) => setValue("description", value)}
                            valueDefault={getValues("description")}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.billingconfiguration_exchangerate)}
                            value={formatNumber(exchangeRate || 0)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const IDARTIFICIALINTELLIGENCE = "IDARTIFICIALINTELLIGENCE";
const ArtificialIntelligence: React.FC<{ providerData: any; planData: any }> = ({ providerData, planData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        plan: "",
        provider: "",
        type: "",
        year: String(new Date().getFullYear()),
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [planCombo, setPlanCombo] = useState([]);
    const [providerCombo, setProviderCombo] = useState([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [typeCombo, setTypeCombo] = useState([]);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(billingArtificialIntelligenceSel(dataMain)));
    }

    useEffect(() => {
        if (providerData) {
            setProviderCombo(
                providerData.filter(
                    (elem: { provider: any }, index: any, self: any[]) =>
                        self.findIndex((t) => {
                            return t.provider === elem.provider;
                        }) === index
                )
            );
            setTypeCombo(
                providerData.filter(
                    (elem: { type: any }, index: any, self: any[]) =>
                        self.findIndex((t) => {
                            return t.type === elem.type;
                        }) === index
                )
            );
        }
        if (planData) {
            setPlanCombo(
                planData.filter(
                    (elem: { description: any }, index: any, self: any[]) =>
                        self.findIndex((t) => {
                            return t.description === elem.description;
                        }) === index
                )
            );
        }
    }, [providerData, planData]);

    useEffect(() => {
        search();

        dispatch(
            setMemoryTable({
                id: IDARTIFICIALINTELLIGENCE,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
        }
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "billingartificialintelligenceid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "year",
                Header: t(langKeys.year),
            },
            {
                accessor: "month",
                Header: t(langKeys.month),
            },
            {
                accessor: "provider",
                Header: t(langKeys.billingsetup_provider),
            },
            {
                accessor: "type",
                Header: t(langKeys.billingsetup_service),
            },
            {
                accessor: "measureunit",
                Header: t(langKeys.billingsetup_measureunit),
            },
            {
                accessor: "plan",
                Header: t(langKeys.billingsetup_plan),
            },
            {
                accessor: "freeinteractions",
                Header: t(langKeys.billingsetup_minimuminteractions),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { freeinteractions } = props.cell.row.original;
                    return formatNumberNoDecimals(freeinteractions || 0);
                },
            },
            {
                accessor: "basicfee",
                Header: t(langKeys.billingsetup_baseprice),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return formatNumber(basicfee || 0);
                },
            },
            {
                accessor: "additionalfee",
                Header: t(langKeys.billingsetup_additionalprice),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { additionalfee } = props.cell.row.original;
                    return formatNumber(additionalfee || 0);
                },
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(billingArtificialIntelligenceSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                dispatch(showBackdrop(false));
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.supportplan).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                execute(
                    billingArtificialIntelligenceIns({
                        ...row,
                        id: row.billingartificialintelligenceid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                    })
                )
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: "4px" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 300 }}
                                uset={true}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({
                                        ...prev,
                                        month: value.map((o: Dictionary) => o.val).join(),
                                    }))
                                }
                            />
                            <FieldSelect
                                data={providerCombo}
                                label={t(langKeys.billingsetup_provider)}
                                optionDesc="provider"
                                optionValue="provider"
                                style={{ width: 200 }}
                                valueDefault={dataMain.provider}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, provider: value?.provider || "" }))
                                }
                            />
                            <FieldSelect
                                data={typeCombo}
                                label={t(langKeys.billingsetup_service)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, type: value?.type || "" }))}
                                optionDesc="type"
                                optionValue="type"
                                style={{ width: 200 }}
                                valueDefault={dataMain.type}
                                variant="outlined"
                            />
                            <FieldSelect
                                data={planCombo}
                                label={t(langKeys.billingsetup_plan)}
                                optionDesc="description"
                                optionValue="description"
                                style={{ width: 200 }}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, plan: value?.description || "" }))
                                }
                            />
                            <Button
                                color="primary"
                                disabled={mainResult.mainData.loading || disableSearch}
                                onClick={() => search()}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    register={true}
                    initialPageIndex={
                        IDARTIFICIALINTELLIGENCE === memoryTable.id
                            ? memoryTable.page === -1
                                ? 0
                                : memoryTable.page
                            : 0
                    }
                    initialStateFilter={
                        IDARTIFICIALINTELLIGENCE === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDARTIFICIALINTELLIGENCE === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </Fragment>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailArtificialIntelligence
                data={rowSelected}
                fetchData={fetchData}
                planData={planData}
                providerData={providerData}
                setViewSelected={setViewSelected}
            />
        );
    } else return null;
};

const DetailArtificialIntelligence: React.FC<DetailArtificialIntelligenceProps> = ({
    data: { row, edit },
    fetchData,
    planData,
    providerData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);

    const [waitSave, setWaitSave] = useState(false);

    const [datetoshow, setdatetoshow] = useState(
        row
            ? `${row.year}-${String(row.month).padStart(2, "0")}`
            : `${new Date(new Date().setDate(1)).getFullYear()}-${String(
                new Date(new Date().setDate(1)).getMonth() + 1
            ).padStart(2, "0")}`
    );

    const arrayBread = [
        { id: "view-1", name: t(langKeys.billingsetup_artificialintelligence) },
        { id: "view-2", name: t(langKeys.billingsetup_artificialintelligencedetail) },
    ];

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger,
    } = useForm({
        defaultValues: {
            additionalfee: row?.additionalfee || 0,
            basicfee: row?.basicfee || 0,
            charlimit: row?.charlimit || 0,
            description: row ? row.description : "",
            freeinteractions: row?.freeinteractions || 0,
            id: row ? row.billingartificialintelligenceid : 0,
            measureunit: row?.measureunit || "",
            month: row?.month || new Date().getMonth() + 1,
            operation: row ? "UPDATE" : "INSERT",
            plan: row?.plan || "",
            provider: row?.provider || "",
            status: row ? row.status : "ACTIVO",
            type: row ? row.type : "",
            year: row?.year || new Date().getFullYear(),
        },
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            const datetochange = new Date(e + "-02");
            const mes = datetochange?.getMonth() + 1;
            const year = datetochange?.getFullYear();

            setdatetoshow(`${year}-${String(mes).padStart(2, "0")}`);
            setValue("year", year);
            setValue("month", mes);
        }
    }

    React.useEffect(() => {
        register("charlimit");
        register("description", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("id");
        register("measureunit", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("month");
        register("operation");
        register("plan", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("provider", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status");
        register("type");
        register("year");

        register("additionalfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("basicfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("freeinteractions", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.billingsetup_artificialintelligence).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingArtificialIntelligenceIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_save),
                visible: true,
            })
        );
    });

    function handleServiceChange(data: any) {
        if (data) {
            setValue("charlimit", data.charlimit || 0);
            setValue("measureunit", data.measureunit || "");
            setValue("provider", data.provider || "");
            setValue("type", data.type || "");
        } else {
            setValue("charlimit", 0);
            setValue("measureunit", "");
            setValue("provider", "");
            setValue("type", "");
        }

        trigger("measureunit");
        trigger("provider");
        trigger("type");
    }

    function handlePlanChange(data: any) {
        if (data) {
            setValue("additionalfee", data.additionalfee || 0);
            setValue("basicfee", data.basicfee || 0);
            setValue("freeinteractions", data.freeinteractions || 0);
            setValue("plan", data.description || "");
        } else {
            setValue("additionalfee", 0);
            setValue("basicfee", 0);
            setValue("freeinteractions", 0);
            setValue("plan", "");
        }

        trigger("additionalfee");
        trigger("basicfee");
        trigger("freeinteractions");
        trigger("plan");
    }

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs breadcrumbs={arrayBread} handleClick={setViewSelected} />
                        {row && <TitleDetail title={t(langKeys.billingsetup_artificialintelligence)} />}
                        {!row && <TitleDetail title={t(langKeys.billingsetup_artificialintelligencenew)} />}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            disabled={executeResult.loading}
                            onClick={() => setViewSelected("view-1")}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        {edit && (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={executeResult.loading}
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.save)}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <TextField
                            className="col-6"
                            id="date"
                            onChange={(e) => handleDateChange(e.target.value)}
                            size="small"
                            type="month"
                            value={datetoshow}
                            variant="outlined"
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.description?.message}
                            label={t(langKeys.description)}
                            onChange={(value) => setValue("description", value)}
                            valueDefault={getValues("description")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            error={errors?.type?.message}
                            label={t(langKeys.billingsetup_ai)}
                            optionDesc="typeprovider"
                            optionValue="typeprovider"
                            orderbylabel={true}
                            valueDefault={`${getValues("type")} - ${getValues("provider")}`}
                            data={providerData?.filter(
                                (v: { type: any; provider: any }, i: any, a: any[]) =>
                                    a.findIndex(
                                        (v2: { type: any; provider: any }) =>
                                            v.type === v2.type && v.provider === v2.provider
                                    ) === i
                            )}
                            onChange={(value) => {
                                handleServiceChange(value);
                            }}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={true}
                            error={errors?.provider?.message}
                            label={t(langKeys.billingsetup_provider)}
                            valueDefault={getValues("provider")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={true}
                            error={errors?.type?.message}
                            label={t(langKeys.billingsetup_service)}
                            valueDefault={getValues("type")}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={true}
                            error={errors?.type?.message}
                            label={t(langKeys.type)}
                            valueDefault={getValues("type")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={true}
                            error={errors?.measureunit?.message}
                            label={t(langKeys.billingsetup_measureunit)}
                            valueDefault={getValues("measureunit")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={planData}
                            error={errors?.plan?.message}
                            label={t(langKeys.billingsetup_plan)}
                            optionDesc="description"
                            optionValue="description"
                            valueDefault={getValues("plan")}
                            onChange={(value) => {
                                handlePlanChange(value);
                            }}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.freeinteractions?.message}
                            label={t(langKeys.billingsetup_minimuminteractions)}
                            onChange={(value) => setValue("freeinteractions", value)}
                            type="number"
                            valueDefault={getValues("freeinteractions")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.basicfee?.message}
                            label={t(langKeys.billingsetup_baseprice)}
                            onChange={(value) => setValue("basicfee", value)}
                            type="number"
                            valueDefault={getValues("basicfee")}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.additionalfee?.message}
                            label={t(langKeys.billingsetup_additionalprice)}
                            onChange={(value) => setValue("additionalfee", value)}
                            type="number"
                            valueDefault={getValues("additionalfee")}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const IDSUPPORTPLAN = "IDSUPPORTPLAN";
const SupportPlan: React.FC<{ dataPlan: any; currencyList: any }> = ({ dataPlan, currencyList }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        plan: "",
        year: String(new Date().getFullYear()),
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(getBillingSupportSel(dataMain)));
    }

    useEffect(() => {
        search();

        dispatch(
            setMemoryTable({
                id: IDSUPPORTPLAN,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
        }
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "billingsupportid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "year",
                Header: t(langKeys.year),
            },
            {
                accessor: "month",
                Header: t(langKeys.month),
            },
            {
                accessor: "plan",
                Header: t(langKeys.supportplan),
            },
            {
                accessor: "plancurrency",
                Header: t(langKeys.billingsupport_plancurrency),
            },
            {
                accessor: "basicfee",
                Header: t(langKeys.supportprice),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return formatNumber(basicfee || 0);
                },
            },
            {
                accessor: "starttime",
                Header: t(langKeys.starttime),
            },
            {
                accessor: "finishtime",
                Header: t(langKeys.finishtime),
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingSupportSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false);
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) })
                    );
                } else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                }
                dispatch(showBackdrop(false));
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.supportplan).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                execute(
                    billingSupportIns({ ...row, operation: "DELETE", status: "ELIMINADO", id: row.billingsupportid })
                )
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: "4px" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 300 }}
                                uset={true}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({
                                        ...prev,
                                        month: value.map((o: Dictionary) => o.val).join(),
                                    }))
                                }
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataPlan}
                                label={t(langKeys.supportplan)}
                                optionDesc="description"
                                optionValue="description"
                                orderbylabel={true}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, plan: value?.description || "" }))
                                }
                            />

                            <Button
                                color="primary"
                                disabled={mainResult.mainData.loading || disableSearch}
                                onClick={() => search()}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    register={true}
                    initialPageIndex={
                        IDSUPPORTPLAN === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDSUPPORTPLAN === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDSUPPORTPLAN === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </Fragment>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailSupportPlan
                data={rowSelected}
                dataPlan={dataPlan}
                currencyList={currencyList}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    } else return null;
};

const DetailSupportPlan: React.FC<DetailSupportPlanProps> = ({
    data: { row, edit },
    dataPlan,
    currencyList,
    fetchData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);

    const [exchangeRate, setExchangeRate] = useState(0);
    const [waitSave, setWaitSave] = useState(false);

    const [datetoshow, setdatetoshow] = useState(
        row
            ? `${row.year}-${String(row.month).padStart(2, "0")}`
            : `${new Date(new Date().setDate(1)).getFullYear()}-${String(
                new Date(new Date().setDate(1)).getMonth() + 1
            ).padStart(2, "0")}`
    );

    const arrayBread = [
        { id: "view-1", name: t(langKeys.supportplan) },
        { id: "view-2", name: t(langKeys.supportplandetail) },
    ];

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
    } = useForm({
        defaultValues: {
            basicfee: row?.basicfee || 0,
            description: row ? row.description : "",
            enddate: row?.enddate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            finishtime: row?.finishtime || new Date().getTime(),
            id: row ? row.billingsupportid : 0,
            month: row?.month || new Date().getMonth() + 1,
            operation: row ? "UPDATE" : "INSERT",
            plan: row?.plan || "",
            plancurrency: row?.plancurrency || "",
            startdate: row?.startdate || new Date(new Date().setDate(1)),
            starttime: row?.starttime || new Date().getTime(),
            status: row ? row.status : "ACTIVO",
            type: row ? row.type : "",
            year: row?.year || new Date().getFullYear(),
        },
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            const datetochange = new Date(e + "-02");
            const mes = datetochange?.getMonth() + 1;
            const year = datetochange?.getFullYear();
            const startdate = new Date(year, mes - 1, 1);
            const enddate = new Date(year, mes, 0);

            setValue("startdate", startdate);
            setValue("enddate", enddate);
            setdatetoshow(`${year}-${String(mes).padStart(2, "0")}`);
            setValue("year", year);
            setValue("month", mes);
        }
    }

    useEffect(() => {
        setExchangeRate(
            (currencyList ?? []).find((item) => {
                return item.code === (row?.plancurrency || "");
            })?.exchangerate || 0
        );
    }, [row]);

    React.useEffect(() => {
        register("description", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("finishtime", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("id");
        register("month");
        register("operation");
        register("plan", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("plancurrency", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("starttime", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status");
        register("type");
        register("year");

        register("basicfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.supportplan).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingSupportIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_save),
                visible: true,
            })
        );
    });

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs breadcrumbs={arrayBread} handleClick={setViewSelected} />
                        {row && <TitleDetail title={t(langKeys.supportplan)} />}
                        {!row && <TitleDetail title={t(langKeys.newsupportplan)} />}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            disabled={executeResult.loading}
                            onClick={() => setViewSelected("view-1")}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        {edit && (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={executeResult.loading}
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.save)}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <TextField
                            className="col-6"
                            id="date"
                            onChange={(e) => handleDateChange(e.target.value)}
                            size="small"
                            type="month"
                            value={datetoshow}
                            variant="outlined"
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.description?.message}
                            label={t(langKeys.description)}
                            onChange={(value) => setValue("description", value)}
                            valueDefault={getValues("description")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataPlan}
                            error={errors?.plan?.message}
                            label={t(langKeys.supportplan)}
                            onChange={(value) => setValue("plan", value?.description)}
                            optionDesc="description"
                            optionValue="description"
                            orderbylabel={true}
                            valueDefault={getValues("plan")}
                        />
                        <FieldSelect
                            className="col-6"
                            data={currencyList ?? []}
                            error={errors?.plancurrency?.message}
                            label={t(langKeys.billingsupport_plancurrency)}
                            onChange={(value) => {
                                setValue("plancurrency", value?.code);
                                setExchangeRate(value?.exchangerate || 0);
                            }}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                            valueDefault={getValues("plancurrency")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.starttime?.message}
                            label={t(langKeys.starttime)}
                            onChange={(value) => setValue("starttime", value)}
                            type="time"
                            valueDefault={getValues("starttime")}
                        />
                        <FieldEdit
                            label={t(langKeys.supportprice)}
                            className="col-6"
                            error={errors?.basicfee?.message}
                            inputProps={{ step: "any" }}
                            onChange={(value) => setValue("basicfee", value)}
                            type="number"
                            valueDefault={getValues("basicfee")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.finishtime?.message}
                            label={t(langKeys.finishtime)}
                            onChange={(value) => setValue("finishtime", value)}
                            type="time"
                            valueDefault={getValues("finishtime")}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.billingconfiguration_exchangerate)}
                            value={formatNumber(exchangeRate || 0)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const IDMESSAGINGCOST = "IDMESSAGINGCOST";
const MessagingCost: React.FC<{ dataPlan: any; currencyList: any }> = ({ dataPlan, currencyList }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        countrycode: "",
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        year: String(new Date().getFullYear()),
    });

    const [importData, setImportData] = useState<Dictionary>([]);
    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(getBillingMessagingSel(dataMain)));
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    useEffect(() => {
        search();

        dispatch(
            setMemoryTable({
                id: IDMESSAGINGCOST,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
        }
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "billingmessagingid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "year",
                Header: t(langKeys.year),
            },
            {
                accessor: "month",
                Header: t(langKeys.month),
            },
            {
                accessor: "countrycode",
                Header: t(langKeys.countrycode),
            },
            {
                accessor: "country",
                Header: t(langKeys.country),
            },
            {
                accessor: "plancurrency",
                Header: t(langKeys.billingconversation_plancurrency),
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingMessagingSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false);
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) })
                    );
                } else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                }
                dispatch(showBackdrop(false));
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.messagingcost).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                execute(
                    billingMessagingIns({
                        ...row,
                        id: row.billingmessagingid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                    })
                )
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                visible: true,
                callback,
                question: t(langKeys.confirmation_delete),
            })
        );
    };

    const handleTemplate = () => {
        const data = [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
        ];

        const header = [
            "year",
            "month",
            "description",
            "countrycode",
            "plancurrency",
            "pricepersms",
            "vcacomissionpersms",
            "minimumquantitysms",
            "fixedfeesms",
            "pricepermail",
            "vcacomissionpermail",
            "minimumquantitymail",
            "fixedfeemail",
            "priceperchatweb",
            "vcacomissionperchatweb",
            "minimumquantitychatweb",
            "fixedfeechatweb",
            "priceperfacebook",
            "vcacomissionperfacebook",
            "minimumquantityfacebook",
            "fixedfeefacebook",
            "pricepermybusiness",
            "vcacomissionpermybusiness",
            "minimumquantitymybusiness",
            "fixedfeemybusiness",
            "priceperinstagram",
            "vcacomissionperinstagram",
            "minimumquantityinstagram",
            "fixedfeeinstagram",
            "priceperinstagramdm",
            "vcacomissionperinstagramdm",
            "minimumquantityinstagramdm",
            "fixedfeeinstagramdm",
            "pricepermessenger",
            "vcacomissionpermessenger",
            "minimumquantitymessenger",
            "fixedfeemessenger",
            "pricepertelegram",
            "vcacomissionpertelegram",
            "minimumquantitytelegram",
            "fixedfeetelegram",
            "pricepertiktok",
            "vcacomissionpertiktok",
            "minimumquantitytiktok",
            "fixedfeetiktok",
            "pricepervoice",
            "vcacomissionpervoice",
            "minimumquantityvoice",
            "fixedfeevoice",
            "pricepertwitter",
            "vcacomissionpertwitter",
            "minimumquantitytwitter",
            "fixedfeetwitter",
            "priceperyoutube",
            "vcacomissionperyoutube",
            "minimumquantityyoutube",
            "fixedfeeyoutube",
        ];

        exportExcel(`${t(langKeys.template)} ${t(langKeys.import)}`, templateMaker(data, header));
    }

    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        files = null;

        if (file) {
            const excel: any = await uploadExcel(file, undefined);

            let data: IBillingMessaging[] = array_trimmer(excel);

            data = data.filter((f: IBillingMessaging) =>
                (f.year !== undefined && f.year >= 0)
                && (f.month !== undefined && f.month >= 0)
                && (f.description !== undefined && f?.description?.length > 0)
                && (f.countrycode !== undefined && f?.countrycode?.length > 0)
                && (f.plancurrency !== undefined && f?.plancurrency?.length > 0)
                && (f.pricepersms !== undefined)
                && (f.vcacomissionpersms !== undefined)
                && (f.minimumquantitysms !== undefined)
                && (f.fixedfeesms !== undefined)
                && (f.pricepermail !== undefined)
                && (f.vcacomissionpermail !== undefined)
                && (f.minimumquantitymail !== undefined)
                && (f.fixedfeemail !== undefined)
                && (f.priceperchatweb !== undefined)
                && (f.vcacomissionperchatweb !== undefined)
                && (f.minimumquantitychatweb !== undefined)
                && (f.fixedfeechatweb !== undefined)
                && (f.priceperfacebook !== undefined)
                && (f.vcacomissionperfacebook !== undefined)
                && (f.minimumquantityfacebook !== undefined)
                && (f.fixedfeefacebook !== undefined)
                && (f.pricepermybusiness !== undefined)
                && (f.vcacomissionpermybusiness !== undefined)
                && (f.minimumquantitymybusiness !== undefined)
                && (f.fixedfeemybusiness !== undefined)
                && (f.priceperinstagram !== undefined)
                && (f.vcacomissionperinstagram !== undefined)
                && (f.minimumquantityinstagram !== undefined)
                && (f.fixedfeeinstagram !== undefined)
                && (f.priceperinstagramdm !== undefined)
                && (f.vcacomissionperinstagramdm !== undefined)
                && (f.minimumquantityinstagramdm !== undefined)
                && (f.fixedfeeinstagramdm !== undefined)
                && (f.pricepermessenger !== undefined)
                && (f.vcacomissionpermessenger !== undefined)
                && (f.minimumquantitymessenger !== undefined)
                && (f.fixedfeemessenger !== undefined)
                && (f.pricepertelegram !== undefined)
                && (f.vcacomissionpertelegram !== undefined)
                && (f.minimumquantitytelegram !== undefined)
                && (f.fixedfeetelegram !== undefined)
                && (f.pricepertiktok !== undefined)
                && (f.vcacomissionpertiktok !== undefined)
                && (f.minimumquantitytiktok !== undefined)
                && (f.fixedfeetiktok !== undefined)
                && (f.pricepervoice !== undefined)
                && (f.vcacomissionpervoice !== undefined)
                && (f.minimumquantityvoice !== undefined)
                && (f.fixedfeevoice !== undefined)
                && (f.pricepertwitter !== undefined)
                && (f.vcacomissionpertwitter !== undefined)
                && (f.minimumquantitytwitter !== undefined)
                && (f.fixedfeetwitter !== undefined)
                && (f.priceperyoutube !== undefined)
                && (f.vcacomissionperyoutube !== undefined)
                && (f.minimumquantityyoutube !== undefined)
                && (f.fixedfeeyoutube !== undefined)
            );

            if (data.length > 0) {
                const table: Dictionary = data.reduce((a: any, d: IBillingMessaging, i: number) => ({
                    ...a,
                    [`${d.year}_${d.month}_${d.countrycode}_${i}`]: {
                        year: d.year || null,
                        month: d.month || null,
                        id: 0,
                        description: d.description || null,
                        status: 'ACTIVO',
                        type: '',
                        operation: 'INSERT',
                        countrycode: d.countrycode || null,
                        plancurrency: d.plancurrency || null,
                        pricepersms: d.pricepersms || null,
                        vcacomissionpersms: d.vcacomissionpersms || null,
                        minimumquantitysms: d.minimumquantitysms || null,
                        fixedfeesms: d.fixedfeesms || null,
                        pricepermail: d.pricepermail || null,
                        vcacomissionpermail: d.vcacomissionpermail || null,
                        minimumquantitymail: d.minimumquantitymail || null,
                        fixedfeemail: d.fixedfeemail || null,
                        priceperchatweb: d.priceperchatweb || null,
                        vcacomissionperchatweb: d.vcacomissionperchatweb || null,
                        minimumquantitychatweb: d.minimumquantitychatweb || null,
                        fixedfeechatweb: d.fixedfeechatweb || null,
                        priceperfacebook: d.priceperfacebook || null,
                        vcacomissionperfacebook: d.vcacomissionperfacebook || null,
                        minimumquantityfacebook: d.minimumquantityfacebook || null,
                        fixedfeefacebook: d.fixedfeefacebook || null,
                        pricepermybusiness: d.pricepermybusiness || null,
                        vcacomissionpermybusiness: d.vcacomissionpermybusiness || null,
                        minimumquantitymybusiness: d.minimumquantitymybusiness || null,
                        fixedfeemybusiness: d.fixedfeemybusiness || null,
                        priceperinstagram: d.priceperinstagram || null,
                        vcacomissionperinstagram: d.vcacomissionperinstagram || null,
                        minimumquantityinstagram: d.minimumquantityinstagram || null,
                        fixedfeeinstagram: d.fixedfeeinstagram || null,
                        priceperinstagramdm: d.priceperinstagramdm || null,
                        vcacomissionperinstagramdm: d.vcacomissionperinstagramdm || null,
                        minimumquantityinstagramdm: d.minimumquantityinstagramdm || null,
                        fixedfeeinstagramdm: d.fixedfeeinstagramdm || null,
                        pricepermessenger: d.pricepermessenger || null,
                        vcacomissionpermessenger: d.vcacomissionpermessenger || null,
                        minimumquantitymessenger: d.minimumquantitymessenger || null,
                        fixedfeemessenger: d.fixedfeemessenger || null,
                        pricepertelegram: d.pricepertelegram || null,
                        vcacomissionpertelegram: d.vcacomissionpertelegram || null,
                        minimumquantitytelegram: d.minimumquantitytelegram || null,
                        fixedfeetelegram: d.fixedfeetelegram || null,
                        pricepertiktok: d.pricepertiktok || null,
                        vcacomissionpertiktok: d.vcacomissionpertiktok || null,
                        minimumquantitytiktok: d.minimumquantitytiktok || null,
                        fixedfeetiktok: d.fixedfeetiktok || null,
                        pricepervoice: d.pricepervoice || null,
                        vcacomissionpervoice: d.vcacomissionpervoice || null,
                        minimumquantityvoice: d.minimumquantityvoice || null,
                        fixedfeevoice: d.fixedfeevoice || null,
                        pricepertwitter: d.pricepertwitter || null,
                        vcacomissionpertwitter: d.vcacomissionpertwitter || null,
                        minimumquantitytwitter: d.minimumquantitytwitter || null,
                        fixedfeetwitter: d.fixedfeetwitter || null,
                        priceperyoutube: d.priceperyoutube || null,
                        vcacomissionperyoutube: d.vcacomissionperyoutube || null,
                        minimumquantityyoutube: d.minimumquantityyoutube || null,
                        fixedfeeyoutube: d.fixedfeeyoutube || null,
                    }
                }), {});

                setImportData(table);

                const callback = () => {
                    dispatch(showBackdrop(true));
                }

                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback,
                }))
            }
            else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
            }
        }
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: "4px" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 300 }}
                                uset={true}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({
                                        ...prev,
                                        month: value.map((o: Dictionary) => o.val).join(),
                                    }))
                                }
                            />
                            <FieldMultiSelect
                                className={classes.fieldsfilter}
                                data={dataPlan}
                                label={t(langKeys.country)}
                                optionDesc="description"
                                optionValue="code"
                                valueDefault={dataMain.countrycode}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({
                                        ...prev,
                                        countrycode: value.map((o: Dictionary) => o.code).join(),
                                    }))
                                }
                            />
                            <Button
                                color="primary"
                                disabled={mainResult.mainData.loading || disableSearch}
                                onClick={() => search()}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                            <Button
                                color="primary"
                                disabled={mainResult.mainData.loading || disableSearch}
                                onClick={handleTemplate}
                                startIcon={<ListAltIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                <Trans i18nKey={langKeys.template} />
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    importCSV={handleUpload}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    register={true}
                    initialPageIndex={
                        IDMESSAGINGCOST === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDMESSAGINGCOST === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDMESSAGINGCOST === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </Fragment>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailMessagingCost
                data={rowSelected}
                dataPlan={dataPlan}
                currencyList={currencyList}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    } else return null;
};

const DetailMessagingCost: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, dataPlan, currencyList, fetchData, setViewSelected }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);

    const [openWarning, setOpenWarning] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const [datetoshow, setdatetoshow] = useState(
        row
            ? `${row.year}-${String(row.month).padStart(2, "0")}`
            : `${new Date(new Date().setDate(1)).getFullYear()}-${String(
                new Date(new Date().setDate(1)).getMonth() + 1
            ).padStart(2, "0")}`
    );

    const arrayBreadConversationCost = [
        { id: "view-1", name: t(langKeys.messagingcost) },
        { id: "view-2", name: t(langKeys.messagingcostdetail) },
    ];

    const handleClose = () => {
        setOpenWarning(false);
    };

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
    } = useForm({
        defaultValues: {
            countrycode: row?.countrycode || "",
            description: row?.description || "",
            id: row ? row.billingmessagingid : 0,
            month: row?.month || new Date().getMonth() + 1,
            operation: row ? "UPDATE" : "INSERT",
            plancurrency: row ? row.plancurrency : "",
            pricepermail: row?.pricepermail || 0,
            pricepersms: row?.pricepersms || 0,
            status: row ? row.status : "ACTIVO",
            type: row ? row.type : "",
            vcacomissionpermail: row?.vcacomissionpermail || 0,
            vcacomissionpersms: row?.vcacomissionpersms || 0,
            year: row?.year || new Date().getFullYear(),
            minimumquantitysms: row?.minimumquantitysms || 0,
            fixedfeesms: row?.fixedfeesms || 0,
            minimumquantitymail: row?.minimumquantitymail || 0,
            fixedfeemail: row?.fixedfeemail || 0,
            priceperchatweb: row?.priceperchatweb || 0,
            vcacomissionperchatweb: row?.vcacomissionperchatweb || 0,
            minimumquantitychatweb: row?.minimumquantitychatweb || 0,
            fixedfeechatweb: row?.fixedfeechatweb || 0,
            priceperfacebook: row?.priceperfacebook || 0,
            vcacomissionperfacebook: row?.vcacomissionperfacebook || 0,
            minimumquantityfacebook: row?.minimumquantityfacebook || 0,
            fixedfeefacebook: row?.fixedfeefacebook || 0,
            pricepermybusiness: row?.pricepermybusiness || 0,
            vcacomissionpermybusiness: row?.vcacomissionpermybusiness || 0,
            minimumquantitymybusiness: row?.minimumquantitymybusiness || 0,
            fixedfeemybusiness: row?.fixedfeemybusiness || 0,
            priceperinstagram: row?.priceperinstagram || 0,
            vcacomissionperinstagram: row?.vcacomissionperinstagram || 0,
            minimumquantityinstagram: row?.minimumquantityinstagram || 0,
            fixedfeeinstagram: row?.fixedfeeinstagram || 0,
            priceperinstagramdm: row?.priceperinstagramdm || 0,
            vcacomissionperinstagramdm: row?.vcacomissionperinstagramdm || 0,
            minimumquantityinstagramdm: row?.minimumquantityinstagramdm || 0,
            fixedfeeinstagramdm: row?.fixedfeeinstagramdm || 0,
            pricepermessenger: row?.pricepermessenger || 0,
            vcacomissionpermessenger: row?.vcacomissionpermessenger || 0,
            minimumquantitymessenger: row?.minimumquantitymessenger || 0,
            fixedfeemessenger: row?.fixedfeemessenger || 0,
            pricepertelegram: row?.pricepertelegram || 0,
            vcacomissionpertelegram: row?.vcacomissionpertelegram || 0,
            minimumquantitytelegram: row?.minimumquantitytelegram || 0,
            fixedfeetelegram: row?.fixedfeetelegram || 0,
            pricepertiktok: row?.pricepertiktok || 0,
            vcacomissionpertiktok: row?.vcacomissionpertiktok || 0,
            minimumquantitytiktok: row?.minimumquantitytiktok || 0,
            fixedfeetiktok: row?.fixedfeetiktok || 0,
            pricepervoice: row?.pricepervoice || 0,
            vcacomissionpervoice: row?.vcacomissionpervoice || 0,
            minimumquantityvoice: row?.minimumquantityvoice || 0,
            fixedfeevoice: row?.fixedfeevoice || 0,
            pricepertwitter: row?.pricepertwitter || 0,
            vcacomissionpertwitter: row?.vcacomissionpertwitter || 0,
            minimumquantitytwitter: row?.minimumquantitytwitter || 0,
            fixedfeetwitter: row?.fixedfeetwitter || 0,
            priceperyoutube: row?.priceperyoutube || 0,
            vcacomissionperyoutube: row?.vcacomissionperyoutube || 0,
            minimumquantityyoutube: row?.minimumquantityyoutube || 0,
            fixedfeeyoutube: row?.fixedfeeyoutube || 0,
        },
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            const datetochange = new Date(e + "-02");
            const mes = datetochange?.getMonth() + 1;
            const year = datetochange?.getFullYear();

            setdatetoshow(`${year}-${String(mes).padStart(2, "0")}`);
            setValue("year", year);
            setValue("month", mes);
        }
    }

    React.useEffect(() => {
        register("countrycode", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("description", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("id");
        register("month");
        register("operation");
        register("plancurrency", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status");
        register("type");
        register("year");

        register("pricepermail", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("pricepersms", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("vcacomissionpermail", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("vcacomissionpersms", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("minimumquantitysms", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeesms", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantitymail", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeemail", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("priceperchatweb", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionperchatweb", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantitychatweb", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeechatweb", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("priceperfacebook", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionperfacebook", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantityfacebook", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeefacebook", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("pricepermybusiness", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionpermybusiness", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantitymybusiness", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeemybusiness", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("priceperinstagram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionperinstagram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantityinstagram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeeinstagram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("priceperinstagramdm", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionperinstagramdm", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantityinstagramdm", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeeinstagramdm", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("pricepermessenger", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionpermessenger", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantitymessenger", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeemessenger", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("pricepertelegram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionpertelegram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantitytelegram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeetelegram", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("pricepertiktok", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionpertiktok", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantitytiktok", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeetiktok", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("pricepervoice", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionpervoice", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantityvoice", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeevoice", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("pricepertwitter", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionpertwitter", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantitytwitter", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeetwitter", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("priceperyoutube", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("vcacomissionperyoutube", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("minimumquantityyoutube", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register("fixedfeeyoutube", { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.messagingcost).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingMessagingIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_save),
                visible: true,
            })
        );
    });

    return (
        <>
            <Dialog
                aria-describedby="alert-dialog-description"
                aria-labelledby="alert-dialog-title"
                onClose={handleClose}
                open={openWarning}
            >
                <DialogTitle>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Trans i18nKey={langKeys.cancel} />
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Trans i18nKey={langKeys.goback} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        <Trans i18nKey={langKeys.no} />
                    </Button>
                    <Button onClick={() => setViewSelected("view-1")} color="primary" autoFocus>
                        <Trans i18nKey={langKeys.yes} />
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ width: "100%" }}>
                <form onSubmit={onSubmit}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <TemplateBreadcrumbs breadcrumbs={arrayBreadConversationCost} handleClick={(value) => { isModified ? setOpenWarning(true) : setViewSelected(value) }} />
                            {row && <TitleDetail title={t(langKeys.messagingcost)} />}
                            {!row && <TitleDetail title={t(langKeys.newmessagingplan)} />}
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <Button
                                color="primary"
                                disabled={executeResult.loading}
                                onClick={() => { isModified ? setOpenWarning(true) : setViewSelected("view-1") }}
                                startIcon={<ClearIcon color="secondary" />}
                                style={{ backgroundColor: "#FB5F5F" }}
                                type="button"
                                variant="contained"
                            >
                                {t(langKeys.back)}
                            </Button>
                            {edit && (
                                <Button
                                    className={classes.button}
                                    color="primary"
                                    disabled={executeResult.loading}
                                    startIcon={<SaveIcon color="secondary" />}
                                    style={{ backgroundColor: "#55BD84" }}
                                    type="submit"
                                    variant="contained"
                                >
                                    {t(langKeys.save)}
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <TextField
                                className="col-6"
                                id="date"
                                onChange={(e) => { handleDateChange(e.target.value); setIsModified(true) }}
                                size="small"
                                type="month"
                                value={datetoshow}
                                variant="outlined"
                            />
                            <FieldSelect
                                className="col-6"
                                data={dataPlan}
                                error={errors?.countrycode?.message}
                                label={t(langKeys.country)}
                                onChange={(value) => { setValue("countrycode", value?.code); setIsModified(true) }}
                                optionDesc="description"
                                optionValue="code"
                                orderbylabel={true}
                                valueDefault={getValues("countrycode")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                error={errors?.description?.message}
                                label={t(langKeys.description)}
                                onChange={(value) => { setValue("description", value); setIsModified(true) }}
                                valueDefault={getValues("description")}
                            />
                            <FieldSelect
                                className="col-6"
                                data={currencyList ?? []}
                                error={errors?.plancurrency?.message}
                                label={t(langKeys.billingconfiguration_plancurrency)}
                                onChange={(value) => {
                                    setValue("plancurrency", value?.code);
                                    setIsModified(true);
                                }}
                                optionDesc="description"
                                optionValue="code"
                                orderbylabel={true}
                                valueDefault={getValues("plancurrency")}
                            />
                        </div>
                        <div className="row-zyx">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_channel)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_minimumfree)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_fixedfee)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_pricepermessage)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_vcacomission)} />
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_chatweb)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitychatweb?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitychatweb", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitychatweb")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeechatweb?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeechatweb", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeechatweb")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.priceperchatweb?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("priceperchatweb", value); setIsModified(true) }}
                                                    valueDefault={getValues("priceperchatweb")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionperchatweb?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionperchatweb", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionperchatweb")}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_mail)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitymail?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitymail", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitymail")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeemail?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeemail", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeemail")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepermail?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepermail", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepermail")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpermail?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpermail", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpermail")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_facebook)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantityfacebook?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantityfacebook", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantityfacebook")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeefacebook?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeefacebook", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeefacebook")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.priceperfacebook?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("priceperfacebook", value); setIsModified(true) }}
                                                    valueDefault={getValues("priceperfacebook")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionperfacebook?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionperfacebook", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionperfacebook")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_mybusiness)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitymybusiness?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitymybusiness", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitymybusiness")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeemybusiness?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeemybusiness", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeemybusiness")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepermybusiness?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepermybusiness", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepermybusiness")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpermybusiness?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpermybusiness", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpermybusiness")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_instagram)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantityinstagram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantityinstagram", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantityinstagram")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeeinstagram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeeinstagram", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeeinstagram")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.priceperinstagram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("priceperinstagram", value); setIsModified(true) }}
                                                    valueDefault={getValues("priceperinstagram")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionperinstagram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionperinstagram", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionperinstagram")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_instagramdm)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantityinstagramdm?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantityinstagramdm", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantityinstagramdm")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeeinstagramdm?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeeinstagramdm", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeeinstagramdm")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.priceperinstagramdm?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("priceperinstagramdm", value); setIsModified(true) }}
                                                    valueDefault={getValues("priceperinstagramdm")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionperinstagramdm?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionperinstagramdm", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionperinstagramdm")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_messenger)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitymessenger?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitymessenger", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitymessenger")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeemessenger?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeemessenger", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeemessenger")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepermessenger?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepermessenger", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepermessenger")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpermessenger?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpermessenger", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpermessenger")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_sms)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitysms?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitysms", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitysms")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeesms?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeesms", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeesms")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepersms?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepersms", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepersms")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpersms?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpersms", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpersms")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_telegram)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitytelegram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitytelegram", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitytelegram")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeetelegram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeetelegram", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeetelegram")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepertelegram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepertelegram", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepertelegram")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpertelegram?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpertelegram", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpertelegram")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_tiktok)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitytiktok?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitytiktok", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitytiktok")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeetiktok?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeetiktok", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeetiktok")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepertiktok?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepertiktok", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepertiktok")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpertiktok?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpertiktok", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpertiktok")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_twitter)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantitytwitter?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantitytwitter", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantitytwitter")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeetwitter?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeetwitter", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeetwitter")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepertwitter?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepertwitter", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepertwitter")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpertwitter?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpertwitter", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpertwitter")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_voice)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantityvoice?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantityvoice", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantityvoice")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeevoice?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeevoice", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeevoice")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.pricepervoice?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("pricepervoice", value); setIsModified(true) }}
                                                    valueDefault={getValues("pricepervoice")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionpervoice?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionpervoice", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionpervoice")}
                                                />
                                            </TableCell>
                                        </TableRow><TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.messaging_youtube)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.minimumquantityyoutube?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("minimumquantityyoutube", value); setIsModified(true) }}
                                                    valueDefault={getValues("minimumquantityyoutube")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.fixedfeeyoutube?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("fixedfeeyoutube", value); setIsModified(true) }}
                                                    valueDefault={getValues("fixedfeeyoutube")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.priceperyoutube?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("priceperyoutube", value); setIsModified(true) }}
                                                    valueDefault={getValues("priceperyoutube")}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    error={errors?.vcacomissionperyoutube?.message}
                                                    inputProps={{ step: "any" }}
                                                    label={""}
                                                    type="number"
                                                    onChange={(value) => { setValue("vcacomissionperyoutube", value); setIsModified(true) }}
                                                    valueDefault={getValues("vcacomissionperyoutube")}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

const BillingSetup: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const countryResult = useSelector((state) => state.signup.countryList);
    const multiResult = useSelector((state) => state.main.multiData);
    const user = useSelector((state) => state.login.validateToken.user);

    const [countryList, setCountryList] = useState<any>([]);
    const [currencyList, setCurrencyList] = useState<any>([]);
    const [dataPaymentPlan, setDataPaymentPlan] = useState<any>([]);
    const [dataPlan, setDataPlan] = useState<any>([]);
    const [pageSelected, setPageSelected] = useState(user?.roledesc?.includes("SUPERADMIN") ? 0 : 6);
    const [planList, setPlanList] = useState<any>([]);
    const [providerList, setProviderList] = useState<any>([]);
    const [sentFirstInfo, setSentFirstInfo] = useState(false);

    useEffect(() => {
        if (!multiResult.loading && sentFirstInfo) {
            setSentFirstInfo(false);
            setCurrencyList(multiResult.data[6] && multiResult.data[6].success ? multiResult.data[6].data : []);
            setDataPaymentPlan(multiResult.data[3] && multiResult.data[3].success ? multiResult.data[3].data : []);
            setDataPlan(multiResult.data[0] && multiResult.data[0].success ? multiResult.data[0].data : []);
            setPlanList(multiResult.data[4] && multiResult.data[4].success ? multiResult.data[4].data : []);
            setProviderList(multiResult.data[5] && multiResult.data[5].success ? multiResult.data[5].data : []);
        }
    }, [multiResult]);

    useEffect(() => {
        if (!countryResult.loading && countryResult.data.length) {
            setCountryList(countryResult.data);
        }
    }, [countryResult]);

    useEffect(() => {
        setSentFirstInfo(true);
        dispatch(getCountryList());
        dispatch(
            getMultiCollection([
                getPlanSel(),
                getOrgSelList(0),
                getCorpSel(0),
                getPaymentPlanSel(),
                artificialIntelligencePlanSel({ description: "" }),
                artificialIntelligenceServiceSel({ provider: "", service: "" }),
                currencySel(),
            ])
        );
    }, []);

    return (
        <div style={{ width: "100%" }}>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                {user?.roledesc?.includes("SUPERADMIN") && (
                    <AntTab label={t(langKeys.billingsetupgeneralconfiguration)} />
                )}
                {user?.roledesc?.includes("SUPERADMIN") && <AntTab label={t(langKeys.contractedplanbyperiod)} />}
                {user?.roledesc?.includes("SUPERADMIN") && <AntTab label={t(langKeys.conversationcost)} />}
                {user?.roledesc?.includes("SUPERADMIN") && (
                    <AntTab label={t(langKeys.billingsetup_artificialintelligence)} />
                )}
                {user?.roledesc?.includes("SUPERADMIN") && <AntTab label={t(langKeys.messagingcost)} />}
                {user?.roledesc?.includes("SUPERADMIN") && <AntTab label={t(langKeys.supportplan)} />}
            </Tabs>
            {pageSelected === 0 && (
                <div style={{ marginTop: 16 }}>
                    <GeneralConfiguration dataPlan={countryList} currencyList={currencyList} />
                </div>
            )}
            {pageSelected === 1 && (
                <div style={{ marginTop: 16 }}>
                    <ContractedPlanByPeriod dataPlan={dataPaymentPlan} currencyList={currencyList} />
                </div>
            )}
            {pageSelected === 2 && (
                <div style={{ marginTop: 16 }}>
                    <ConversationCost dataPlan={countryList} currencyList={currencyList} />
                </div>
            )}
            {pageSelected === 3 && (
                <div style={{ marginTop: 16 }}>
                    <ArtificialIntelligence planData={planList} providerData={providerList} />
                </div>
            )}
            {pageSelected === 4 && (
                <div style={{ marginTop: 16 }}>
                    <MessagingCost dataPlan={countryList} currencyList={currencyList} />
                </div>
            )}
            {pageSelected === 5 && (
                <div style={{ marginTop: 16 }}>
                    <SupportPlan dataPlan={dataPlan} currencyList={currencyList} />
                </div>
            )}
        </div>
    );
};

export default BillingSetup;