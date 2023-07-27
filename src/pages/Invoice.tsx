import { Add, Close, FileCopy, GetApp, Refresh, Search } from "@material-ui/icons";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Dictionary, MultiData } from "@types";
import { DownloadIcon } from "icons";
import { getCountryList } from "store/signup/actions";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { langKeys } from "lang/keys";
import { makeStyles, styled, withStyles } from "@material-ui/core/styles";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { Skeleton } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import {
    Box,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    ListItem,
    Tabs,
    TextField,
} from "@material-ui/core";

import {
    agentModeList,
    billingArtificialIntelligenceSel,
    billingPeriodArtificialIntelligenceInsArray,
    billingPeriodArtificialIntelligenceSel,
    billingPeriodUpd,
    billingpersonreportsel,
    billingReportConversationWhatsApp,
    billingReportHsmHistory,
    billinguserreportsel,
    contactModeList,
    convertLocalDate,
    currencyList,
    dataCurrency,
    dataMonths,
    dateToLocalDate,
    dataYears,
    deleteInvoice,
    exportExcel,
    formatNumber,
    formatNumberFourDecimals,
    formatNumberNoDecimals,
    getAppsettingInvoiceSel,
    getBalanceSelSent,
    getBillingMessagingCurrent,
    getBillingPeriodCalcRefreshAll,
    getBillingPeriodSel,
    getBillingPeriodSummarySel,
    getBillingPeriodSummarySelCorp,
    getCorpSel,
    getCorpSelVariant,
    getInvoiceDetail,
    getMeasureUnit,
    getOrgSel,
    getOrgSelList,
    getPaymentPlanSel,
    getPlanSel,
    getValuesFromDomain,
    insInvoice,
    insInvoiceComment,
    invoiceRefresh,
    listPaymentCard,
    localesLaraigo,
    paymentCardInsert,
    planModeList,
    selBalanceData,
    selInvoice,
    selInvoiceClient,
    selInvoiceComment,
    templateMaker,
    uploadExcel,
} from "common/helpers";

import {
    AntTab,
    DialogZyx,
    FieldEdit,
    FieldEditArray,
    FieldEditMulti,
    FieldMultiSelect,
    FieldSelect,
    FieldView,
    IOSSwitch,
    TemplateBreadcrumbs,
    TemplateIcons,
    TitleDetail,
} from "components";

import {
    balance,
    cardCreate,
    cardDelete,
    charge,
    createCreditNote,
    createInvoice,
    emitInvoice,
    getExchangeRate,
    regularizeInvoice,
    reportPdf,
    resetBalance,
    resetCharge,
} from "store/culqi/actions";

import {
    cleanMemoryTable,
    execute,
    exportData,
    getCollection,
    getCollectionAux,
    getCollectionAux2,
    getMultiCollection,
    getMultiCollectionAux,
    setMemoryTable,
    uploadFile,
} from "store/main/actions";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import clsx from "clsx";
import CulqiModal from "components/fields/CulqiModal";
import DateFnsUtils from "@date-io/date-fns";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiPhoneNumber from "material-ui-phone-number";
import Paper from "@material-ui/core/Paper";
import PaymentIcon from "@material-ui/icons/Payment";
import React, { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableZyx from "../components/fields/table-simple";
import Typography from "@material-ui/core/Typography";

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailPropsPaymentMethod {
    data: RowSelected;
    fetchData: () => void;
    setViewSelected: (view: string) => void;
}

interface DetailProps {
    creditNote?: boolean;
    data?: Dictionary | null;
    fetchData: () => void;
    operationName?: string;
    regularize?: boolean;
    setViewSelected: (view: string) => void;
}

interface DetailSupportPlanProps2 {
    data: RowSelected;
    dataCorp: any;
    dataOrg: any;
    dataPaymentPlan: any;
    dataPlan: any;
    fetchData: () => void;
    setViewSelected: (view: string) => void;
}

const StyledTableCell = withStyles((theme) => ({
    body: {
        fontSize: 14,
    },
    head: {
        color: theme.palette.common.white,
        backgroundColor: "#7721ad",
    },
}))(TableCell);

const StyledTableRow = withStyles(() => ({}))(TableRow);

function getTaxableAmount(igv: number, num: number) {
    if (num && igv) return (num / (igv + 1)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return "0.00";
}

function getIgv(igv: number, num: number) {
    if (num && igv) return (num - num / (igv + 1)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return "0.00";
}

function toISOLocalString(date: { getTimezoneOffset: () => number; getTime: () => number }) {
    const z = (n: string | number) => ("0" + n).slice(-2);
    let off = date.getTimezoneOffset();
    const sign = off < 0 ? "+" : "-";
    off = Math.abs(off);
    return (
        new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, -1) +
        sign +
        z((off / 60) | 0) +
        ":" +
        z(off % 60)
    );
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.primary,
        fontSize: "22px",
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
    },
    containerField: {
        border: "1px solid #e1e1e1",
        borderRadius: theme.spacing(2),
        display: "flex",
        flex: "0 0 300px",
        flexDirection: "column",
        flexWrap: "wrap",
        gap: 16,
        padding: theme.spacing(2),
    },
    titleCard: {
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
    },
    buttoncomments: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 6,
        textTransform: "initial",
    },
    text: {
        fontSize: 15,
        fontWeight: 500,
    },
    imgContainer: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        display: "flex",
        height: 200,
        justifyContent: "center",
        width: 300,
    },
    img: {
        height: "100%",
        paddingTop: 10,
        width: "auto",
    },
    icon: {
        "&:hover": {
            color: theme.palette.primary.main,
            cursor: "pointer",
        },
    },
    containerDetail: {
        background: "#fff",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
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

const CssPhonemui = styled(MuiPhoneNumber)({
    "& label.Mui-focused": {
        color: "#7721ad",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#7721ad",
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: "#7721ad",
        },
    },
});

const IDCOSTPERPERIOD = "IDCOSTPERPERIOD";
const CostPerPeriod: React.FC<{ dataCorp: any; dataOrg: any; dataPaymentPlan: any; dataPlan: any }> = ({
    dataCorp,
    dataOrg,
    dataPaymentPlan,
    dataPlan,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        billingplan: "",
        corpid: user?.corpid ?? 0,
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        orgid: 0,
        supportplan: "",
        year: String(new Date().getFullYear()),
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(getBillingPeriodSel(dataMain)));
    }

    useEffect(() => {
        search();

        dispatch(
            setMemoryTable({
                id: IDCOSTPERPERIOD,
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
                accessor: "corpdesc",
                Header: t(langKeys.corporation),
            },
            {
                accessor: "partner",
                Header: t(langKeys.partner),
            },
            {
                accessor: "orgdesc",
                Header: t(langKeys.organization),
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
                accessor: "billingplan",
                Header: t(langKeys.contractedplan),
            },
            {
                accessor: "supportplan",
                Header: t(langKeys.supportplan),
            },
            {
                accessor: "plancurrency",
                Header: t(langKeys.billingperiod_plancurrency),
            },
            {
                accessor: "planmode",
                Header: t(langKeys.billingperiod_planmode),
            },
            {
                accessor: "plandate",
                Header: t(langKeys.billingperiod_plandate),
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <div>{dateToLocalDate(row.plandate)}</div>;
                },
            },
            {
                accessor: "taxableamount",
                Header: t(langKeys.taxableamount),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { taxableamount } = props.cell.row.original;
                    return formatNumber(taxableamount || 0);
                },
            },
            {
                accessor: "totalcharge",
                Header: t(langKeys.totalcharge),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { totalcharge } = props.cell.row.original;
                    return formatNumber(totalcharge || 0);
                },
            },
            {
                accessor: "clientquantity",
                Header: t(langKeys.uniquecontacts),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { clientquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(clientquantity || 0);
                },
            },
            {
                accessor: "conversationquantity",
                Header: t(langKeys.conversation_plural),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { conversationquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(conversationquantity || 0);
                },
            },
            {
                accessor: "interactionquantity",
                Header: t(langKeys.interaction_plural),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { interactionquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(interactionquantity || 0);
                },
            },
            {
                accessor: "supervisorquantity",
                Header: t(langKeys.billingreport_supervisor),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { supervisorquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(supervisorquantity || 0);
                },
            },
            {
                accessor: "asesorquantity",
                Header: t(langKeys.billingreport_agent),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { asesorquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(asesorquantity || 0);
                },
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingPeriodSel(dataMain)));

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (waitCalculate) {
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_calculate) })
                    );
                    setWaitCalculate(false);
                } else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                }
                dispatch(showBackdrop(false));
                fetchData && fetchData();
                setWaitSave(false);
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
                setWaitCalculate(false);
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave, waitCalculate]);

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleCalculate = () => {
        const callback = () => {
            dispatch(
                execute(
                    getBillingPeriodCalcRefreshAll(
                        parseInt(dataMain.year || "0"),
                        parseInt(dataMain.month || "0"),
                        dataMain.corpid,
                        dataMain.orgid
                    )
                )
            );
            dispatch(showBackdrop(true));
            setWaitCalculate(true);
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_calculate),
                visible: true,
            })
        );
    };

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 140 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 214 }}
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
                                data={dataCorp}
                                label={t(langKeys.corporation)}
                                optionDesc="description"
                                optionValue="corpid"
                                orderbylabel={true}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P", "ADMINISTRADOR LIMADERMA"].includes(
                                    user?.roledesc ?? ""
                                )}
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))
                                }
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                label={t(langKeys.organization)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, orgid: value?.orgid || 0 }))}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                data={dataOrg.filter((e: any) => {
                                    return e.corpid === dataMain.corpid;
                                })}
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataPaymentPlan}
                                label={t(langKeys.contractedplan)}
                                optionDesc="plan"
                                optionValue="plan"
                                orderbylabel={true}
                                valueDefault={dataMain.billingplan}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, billingplan: value ? value.plan : "" }))
                                }
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataPlan}
                                label={t(langKeys.supportplan)}
                                optionDesc="description"
                                optionValue="description"
                                orderbylabel={true}
                                valueDefault={dataMain.supportplan}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, supportplan: value ? value.description : "" }))
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
                    calculate={true}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleCalculate={handleCalculate}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    register={false}
                    initialPageIndex={
                        IDCOSTPERPERIOD === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDCOSTPERPERIOD === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDCOSTPERPERIOD === memoryTable.id
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
            <DetailCostPerPeriod
                data={rowSelected}
                dataCorp={dataCorp}
                dataOrg={dataOrg}
                dataPaymentPlan={dataPaymentPlan}
                dataPlan={dataPlan}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    } else return null;
};

const DetailCostPerPeriod: React.FC<DetailSupportPlanProps2> = ({
    data: { row, edit },
    dataPaymentPlan,
    dataPlan,
    fetchData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const auxRes = useSelector((state) => state.main.mainAux);
    const classes = useStyles();
    const executeRes = useSelector((state) => state.main.execute);
    const multiRes = useSelector((state) => state.main.multiData);

    const [allIndex, setAllIndex] = useState<any[]>([]);
    const [canEdit, setCanEdit] = useState(false);
    const [checkedChannel, setCheckedChannel] = useState(row?.channelcreateoverride || false);
    const [checkedUser, setCheckedUser] = useState(row?.usercreateoverride || false);
    const [dataArtificialBilling, setDataArtificialBilling] = useState<Dictionary[]>([]);
    const [dataArtificialIntelligence, setDataArtificialIntelligence] = useState<Dictionary[]>([]);
    const [dataArtificialIntelligenceDelete, setDataArtificialIntelligenceDelete] = useState<Dictionary[]>([]);
    const [pageSelected, setPageSelected] = useState(0);
    const [triggerSave, setTriggerSave] = useState(false);
    const [waitAiBilling, setWaitAiBilling] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadCostPerPeriod = [
        { id: "view-1", name: t(langKeys.costperperiod) },
        { id: "view-2", name: t(langKeys.costperperioddetail) },
    ];

    useEffect(() => {
        if (!auxRes.loading && !auxRes.error) {
            setDataArtificialIntelligence(auxRes.data);
            let array: any = [];
            let index = 0;
            auxRes.data?.forEach(() => {
                array = [...array, { index: index, allOk: true }];
                index++;
            });
            setAllIndex(array);
        }
    }, [auxRes]);

    useEffect(() => {
        if (waitAiBilling) {
            if (multiRes.data[0] && multiRes.data[0].success && multiRes.data[0].data) {
                if (multiRes.data[0].data[0]) {
                    if (multiRes.data[0].data[0].type) {
                        setDataArtificialBilling(
                            multiRes.data[0] && multiRes.data[0].success ? multiRes.data[0].data : []
                        );
                    }
                }
            }
        }
    }, [multiRes.data, waitAiBilling]);

    const getPeriodArtificialIntelligence = () =>
        dispatch(
            getCollectionAux(
                billingPeriodArtificialIntelligenceSel({
                    corpid: row?.corpid,
                    month: row?.month,
                    orgid: row?.orgid || 0,
                    plan: "",
                    provider: "",
                    type: "",
                    year: row?.year,
                })
            )
        );

    useEffect(() => {
        if (row?.year && row?.month) {
            dispatch(
                getMultiCollection([
                    billingArtificialIntelligenceSel({
                        month: row?.month,
                        plan: "",
                        provider: "",
                        type: "",
                        year: row?.year,
                    }),
                ])
            );
            setWaitAiBilling(true);
        }

        if (row?.invoicestatus && row?.paymentstatus) {
            if (row?.invoicestatus !== "INVOICED" && row?.paymentstatus !== "PAID") {
                setCanEdit(true);
            }
        } else {
            setCanEdit(true);
        }

        getPeriodArtificialIntelligence();
    }, []);

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger,
    } = useForm({
        defaultValues: {
            additionalservicefee1: row?.additionalservicefee1 || 0,
            additionalservicefee2: row?.additionalservicefee2 || 0,
            additionalservicefee3: row?.additionalservicefee3 || 0,
            additionalservicename1: row?.additionalservicename1 || "",
            additionalservicename2: row?.additionalservicename2 || "",
            additionalservicename3: row?.additionalservicename3 || "",
            asesorquantity: row?.asesorquantity || 0,
            basicfee: row?.basicfee || 0,
            billingplan: row?.billingplan || "",
            callchannelcost: row?.callchannelcost || 0,
            callothercost: row?.callothercost || 0,
            callphonecost: row?.callphonecost || 0,
            callpubliccost: row?.callpubliccost || 0,
            callrecordingcost: row?.callrecordingcost || 0,
            callvoipcost: row?.callvoipcost || 0,
            channelcharge: row?.channelcharge || 0,
            channelcreateoverride: row?.channelcreateoverride || false,
            channelfreequantity: row?.channelfreequantity || 0,
            channelothercharge: row?.channelothercharge || 0,
            channelotherfee: row?.channelotherfee || 0,
            channelotherquantity: row?.channelotherquantity || 0,
            channelwhatsappcharge: row?.channelwhatsappcharge || 0,
            channelwhatsappfee: row?.channelwhatsappfee || 0,
            channelwhatsappquantity: row?.channelwhatsappquantity || 0,
            clientadditionalcharge: row?.clientadditionalcharge || 0,
            clientadditionalfee: row?.clientadditionalfee || 0,
            clientfreequantity: row?.clientfreequantity || 0,
            clientquantity: row?.clientquantity || 0,
            conversationclientwhatcharge: row?.conversationclientwhatcharge || 0,
            conversationclientwhatfee: row?.conversationclientwhatfee || 0,
            conversationclientwhatfreequantity: row?.conversationclientwhatfreequantity || 0,
            conversationclientwhatquantity: row?.conversationclientwhatquantity || 0,
            conversationcompanywhatcharge: row?.conversationcompanywhatcharge || 0,
            conversationcompanywhatfee: row?.conversationcompanywhatfee || 0,
            conversationcompanywhatfreequantity: row?.conversationcompanywhatfreequantity || 0,
            conversationcompanywhatquantity: row?.conversationcompanywhatquantity || 0,
            conversationquantity: row?.conversationquantity || 0,
            conversationwhatcharge: row?.conversationwhatcharge || 0,
            corpdesc: row?.corpdesc || "",
            corpid: row?.corpid || 0,
            force: row?.force || true,
            freewhatsappchannel: row?.freewhatsappchannel || 0,
            freewhatsappconversations: row?.freewhatsappconversations || 0,
            interactionquantity: row?.interactionquantity || 0,
            mailcost: row?.mailcost || 0,
            mailquantity: row?.mailquantity || 0,
            minimummailquantity: row?.minimummailquantity || 0,
            minimumsmsquantity: row?.minimumsmsquantity || 0,
            month: row?.month || new Date().getMonth() + 1,
            orgdesc: row?.orgdesc || "",
            orgid: row?.orgid || 0,
            smscost: row?.smscost || 0,
            smsquantity: row?.smsquantity || 0,
            supervisorquantity: row?.supervisorquantity || 0,
            supportbasicfee: row?.supportbasicfee || 0,
            supportplan: row?.supportplan || "",
            totalcharge: row?.totalcharge || 0,
            unitepricepermail: row?.unitepricepermail || 0,
            unitpricepersms: row?.unitpricepersms || 0,
            useradditionalcharge: row?.useradditionalcharge || 0,
            useradditionalfee: row?.useradditionalfee || 0,
            usercreateoverride: row?.usercreateoverride || false,
            userfreequantity: row?.userfreequantity || 0,
            userquantity: row?.userquantity || 0,
            vcacomissionperconversation: row?.vcacomissionperconversation || 0,
            vcacomissionperhsm: row?.vcacomissionperhsm || 0,
            vcacomissionpermail: row?.vcacomissionpermail || 0,
            vcacomissionpersms: row?.vcacomissionpersms || 0,
            vcacomissionpervoicechannel: row?.vcacomissionpervoicechannel || 0,
            voximplantcallothercost: row?.voximplantcallothercost || 0,
            voximplantcallothervcacost: row?.voximplantcallothervcacost || 0,
            voximplantcallphonecost: row?.voximplantcallphonecost || 0,
            voximplantcallphonevcacost: row?.voximplantcallphonevcacost || 0,
            voximplantcallpubliccost: row?.voximplantcallpubliccost || 0,
            voximplantcallpublicvcacost: row?.voximplantcallpublicvcacost || 0,
            voximplantcallrecordingcost: row?.voximplantcallrecordingcost || 0,
            voximplantcallrecordingvcacost: row?.voximplantcallrecordingvcacost || 0,
            voximplantcallvoipcost: row?.voximplantcallvoipcost || 0,
            voximplantcallvoipvcacost: row?.voximplantcallvoipvcacost || 0,
            year: row?.year || new Date().getFullYear(),

            billingcurrency: row?.billingcurrency || "",
            plancurrency: row?.plancurrency || "",
            plandate: row?.plandate || null,
            planmode: row?.planmode || "",
            plancost: row?.plancost || 0,
            planinfrastructure: row?.planinfrastructure || 0,
            agentcurrency: row?.agentcurrency || "",
            agentmode: row?.agentmode || "",
            conversationuserquantity: row?.conversationuserquantity || "",
            conversationuserfreequantity: row?.conversationuserfreequantity || "",
            conversationusercurrency: row?.conversationusercurrency || "",
            conversationusergeneralvcacomission: row?.conversationusergeneralvcacomission || "",
            conversationusergeneralvcafee: row?.conversationusergeneralvcafee || "",
            conversationusermetacurrency: row?.conversationusermetacurrency || "",
            conversationusergeneralfee: row?.conversationusergeneralfee || "",
            conversationusergeneraltotalfee: row?.conversationusergeneraltotalfee || "",
            conversationbusinessutilityquantity: row?.conversationbusinessutilityquantity || "",
            conversationbusinessauthenticationquantity: row?.conversationbusinessauthenticationquantity || "",
            conversationbusinessmarketingquantity: row?.conversationbusinessmarketingquantity || "",
            conversationbusinesscurrency: row?.conversationbusinesscurrency || "",
            conversationbusinessutilityvcacomission: row?.conversationbusinessutilityvcacomission || "",
            conversationbusinessauthenticationvcacomission: row?.conversationbusinessauthenticationvcacomission || "",
            conversationbusinessmarketingvcacomission: row?.conversationbusinessmarketingvcacomission || "",
            conversationbusinessutilityvcafee: row?.conversationbusinessutilityvcafee || "",
            conversationbusinessauthenticationvcafee: row?.conversationbusinessauthenticationvcafee || "",
            conversationbusinessmarketingvcafee: row?.conversationbusinessmarketingvcafee || "",
            conversationbusinessmetacurrency: row?.conversationbusinessmetacurrency || "",
            conversationbusinessauthenticationfee: row?.conversationbusinessauthenticationfee || "",
            conversationbusinessutilityfee: row?.conversationbusinessutilityfee || "",
            conversationbusinessutilitytotalfee: row?.conversationbusinessutilitytotalfee || "",
            conversationbusinessmarketingfee: row?.conversationbusinessmarketingfee || "",
            conversationbusinessmarketingtotalfee: row?.conversationbusinessmarketingtotalfee || "",
            conversationbusinessauthenticationtotalfee: row?.conversationbusinessauthenticationtotalfee || "",
            conversationcurrency: row?.conversationcurrency || "",
            conversationvcacomission: row?.conversationvcacomission || "",
            conversationtotalfee: row?.conversationtotalfee || "",
            conversationfee: row?.conversationfee || "",
            contactmode: row?.contactmode || "",
            contactcount: row?.contactcount || "",
            contactquantity: row?.contactquantity || "",
            contactcurrency: row?.contactcurrency || "",
            contactwhatsappquantity: row?.contactwhatsappquantity || "",
            contactotherquantity: row?.contactotherquantity || "",
            contactwhatsappfee: row?.contactwhatsappfee || "",
            contactotherfee: row?.contactotherfee || "",
            contactwhatsapptotalfee: row?.contactwhatsapptotalfee || "",
            contactothertotalfee: row?.contactothertotalfee || "",
            contacttotalfee: row?.contacttotalfee || "",
            messagingcurrency: row?.messagingcurrency || "",
            consultingcurrency: row?.consultingcurrency || "",
            consultingconsultingfee: row?.consultingconsultingfee || "",
            consultingcontractquantity: row?.consultingcontractquantity || "",
            consultingcontractedfee: row?.consultingcontractedfee || "",
            consultingadditionalfee: row?.consultingadditionalfee || "",
            consultingtotalfee: row?.consultingtotalfee || "",
            consultingregisterprofile: row?.consultingregisterprofile || "",
            consultingunitfee: row?.consultingunitfee || "",
        },
    });

    React.useEffect(() => {
        register("additionalservicefee1");
        register("additionalservicefee2");
        register("additionalservicefee3");
        register("additionalservicename1");
        register("additionalservicename2");
        register("additionalservicename3");
        register("billingplan", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("callchannelcost");
        register("callothercost");
        register("callphonecost");
        register("callpubliccost");
        register("callrecordingcost");
        register("callvoipcost");
        register("channelcreateoverride");
        register("conversationclientwhatfreequantity");
        register("conversationcompanywhatfreequantity");
        register("corpid");
        register("force");
        register("freewhatsappconversations");
        register("mailcost");
        register("mailquantity");
        register("month");
        register("orgid");
        register("smscost");
        register("smsquantity");
        register("supportplan", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("totalcharge");
        register("unitepricepermail");
        register("unitpricepersms");
        register("usercreateoverride");
        register("vcacomissionperconversation");
        register("vcacomissionpermail");
        register("vcacomissionpersms");
        register("voximplantcallothercost");
        register("voximplantcallothervcacost");
        register("voximplantcallphonecost");
        register("voximplantcallphonevcacost");
        register("voximplantcallpubliccost");
        register("voximplantcallpublicvcacost");
        register("voximplantcallrecordingcost");
        register("voximplantcallrecordingvcacost");
        register("voximplantcallvoipcost");
        register("voximplantcallvoipvcacost");
        register("year");

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

        register("minimummailquantity", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("minimumsmsquantity", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("supportbasicfee", {
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

        register("vcacomissionperhsm", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("vcacomissionpervoicechannel", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                getPeriodArtificialIntelligence && getPeriodArtificialIntelligence();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeRes.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeRes.code ?? "error_unexpected_error", {
                            module: t(langKeys.billingplan).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave]);

    useEffect(() => {
        if (allIndex.length === dataArtificialIntelligence.length && triggerSave) {
            setTriggerSave(false);

            const error = allIndex.some((x: any) => !x.allOk);

            if (error) {
                return;
            }

            if (dataArtificialIntelligence.length > 0) {
                let duplicateCount =
                    dataArtificialIntelligence.filter(
                        (value, index, self) =>
                            index ===
                            self.findIndex(
                                (t) => t.type === value.type && t.provider === value.provider && t.status === "ACTIVO"
                            )
                    )?.length || 0;

                if (duplicateCount < dataArtificialIntelligence.length) {
                    dispatch(showSnackbar({ severity: "error", show: true, message: t(langKeys.aiduplicatealert) }));
                    return;
                }
            }

            const data = getValues();

            const callback = () => {
                const dataArtificialInsert = [...dataArtificialIntelligence, ...dataArtificialIntelligenceDelete];

                if (dataArtificialInsert.length > 0) {
                    dataArtificialInsert.map(function (object) {
                        object.corpid = row?.corpid || 0;
                        object.orgid = row?.orgid || 0;
                        return object;
                    });
                }

                if (dataArtificialInsert.length > 0) {
                    dispatch(
                        execute(
                            {
                                header: billingPeriodUpd(data),
                                detail: [
                                    billingPeriodArtificialIntelligenceInsArray(
                                        row?.corpid || 0,
                                        row?.orgid || 0,
                                        dataArtificialInsert
                                    ),
                                ]!,
                            },
                            true
                        )
                    );
                } else {
                    dispatch(execute(billingPeriodUpd(data)));
                }

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
        }
    }, [allIndex, triggerSave]);

    const onSubmit = handleSubmit((data) => {
        setTriggerSave(true);
        if (pageSelected === 7) {
            setAllIndex([]);
        }
    });

    const handleDelete = (row: Dictionary | null, index: number) => {
        if (row && row.operation !== "INSERT") {
            setDataArtificialIntelligenceDelete((p) => [...p, { ...row, operation: "DELETE", status: "ELIMINADO" }]);
        }
        const filterDataArtificialIntelligence = dataArtificialIntelligence.filter((x, i) => i !== index);
        setDataArtificialIntelligence(filterDataArtificialIntelligence);
    };

    const handleRegister = () => {
        setDataArtificialIntelligence((p) => [
            ...p,
            {
                aicost: 0,
                aiquantity: 0,
                corpid: row?.corpid || 0,
                id: 0,
                month: row?.month || 0,
                operation: "INSERT",
                orgid: row?.orgid || 0,
                status: "ACTIVO",
                year: row?.year || 0,
            },
        ]);
    };

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBreadCostPerPeriod}
                            handleClick={(id) => {
                                setViewSelected(id);
                                fetchData();
                            }}
                        />
                        <TitleDetail title={row ? `${row.corpdesc} - ${row.orgdesc}` : t(langKeys.neworganization)} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                            onClick={() => {
                                setViewSelected("view-1");
                                fetchData && fetchData();
                            }}
                        >
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={executeRes.loading || !canEdit}
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            type="submit"
                            variant="contained"
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <Tabs
                    indicatorColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                    style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                    textColor="primary"
                    value={pageSelected}
                    variant="fullWidth"
                >
                    <AntTab label={t(langKeys.generalinformation)} />
                    <AntTab label={t(langKeys.agents_plural)} />
                    <AntTab label={t(langKeys.channel_plural)} />
                    <AntTab label={t(langKeys.conversation_plural)} />
                    <AntTab label={t(langKeys.contact_plural)} />
                    <AntTab label={t(langKeys.messaging)} />
                    <AntTab label={t(langKeys.billingperiodvoice)} />
                    <AntTab label={t(langKeys.billingsetup_ai)} />
                    <AntTab label={t(langKeys.billingperiod_consulting)} />
                    <AntTab label="Extras" />
                </Tabs>
                {pageSelected === 0 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.corporation)}
                                value={getValues("corpdesc")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.organization)}
                                value={getValues("orgdesc")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView className="col-6" label={t(langKeys.year)} value={getValues("year")} />
                            <FieldView className="col-6" label={t(langKeys.month)} value={getValues("month")} />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={dataPaymentPlan}
                                disabled={!canEdit}
                                error={errors?.billingplan?.message}
                                label={t(langKeys.contractedplan)}
                                onChange={(value) => setValue("billingplan", value?.plan)}
                                optionDesc="plan"
                                optionValue="plan"
                                orderbylabel={true}
                                valueDefault={getValues("billingplan")}
                            />
                            <FieldSelect
                                className="col-6"
                                data={dataPlan}
                                disabled={!canEdit}
                                error={errors?.supportplan?.message}
                                label={t(langKeys.contractedsupportplan)}
                                onChange={(value) => setValue("supportplan", value?.description)}
                                optionDesc="description"
                                optionValue="description"
                                orderbylabel={true}
                                valueDefault={getValues("supportplan")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.billingcurrency?.message}
                                label={t(langKeys.billingperiod_billingcurrency)}
                                onChange={(value) => setValue("billingcurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("billingcurrency")}
                            />
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.plancurrency?.message}
                                label={t(langKeys.billingperiod_plancurrency)}
                                onChange={(value) => setValue("plancurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("plancurrency")}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-6">
                                <MuiPickersUtilsProvider
                                    locale={localesLaraigo()[navigator.language.split("-")[0]]}
                                    utils={DateFnsUtils}
                                >
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                        {t(langKeys.billingperiod_plandate)}
                                    </Box>
                                    <KeyboardDatePicker
                                        defaultValue={row?.plandate}
                                        disabled={!canEdit}
                                        error={errors?.plandate?.message}
                                        format="dd-MM-yyyy"
                                        invalidDateMessage={t(langKeys.invalid_date_format)}
                                        value={getValues("plandate")}
                                        onChange={(value: any) => {
                                            setValue("plandate", value || null);
                                            trigger("plandate");
                                        }}
                                        style={{ width: "100%" }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <FieldSelect
                                className="col-6"
                                data={planModeList}
                                disabled={!canEdit}
                                error={errors?.planmode?.message}
                                label={t(langKeys.billingperiod_planmode)}
                                onChange={(value) => setValue("planmode", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("planmode")}
                                uset={true}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.basicfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.costbasedonthecontractedplan)}
                                onChange={(value) => setValue("basicfee", value)}
                                type="number"
                                valueDefault={getValues("basicfee")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.plancost?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_plancost)}
                                onChange={(value) => setValue("plancost", value)}
                                type="number"
                                valueDefault={getValues("plancost")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.supportbasicfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.costbasedonthesupportplan)}
                                onChange={(value) => setValue("supportbasicfee", value)}
                                type="number"
                                valueDefault={getValues("supportbasicfee")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.planinfrastructure?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_planinfrastructure)}
                                onChange={(value) => setValue("planinfrastructure", value)}
                                type="number"
                                valueDefault={getValues("planinfrastructure")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.totalcharge)}
                                value={formatNumber(getValues("totalcharge") || 0)}
                            />
                        </div>
                    </div>
                )}
                {pageSelected === 1 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.userfreequantity?.message}
                                label={t(langKeys.numberofagentshired)}
                                onChange={(value) => setValue("userfreequantity", value)}
                                type="number"
                                valueDefault={getValues("userfreequantity")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.numberofactiveagents)}
                                value={String(getValues("userquantity"))}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.numberofactivesupervisors)}
                                value={String(getValues("supervisorquantity"))}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.numberofactiveadvisers)}
                                value={String(getValues("asesorquantity"))}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.agentcurrency?.message}
                                label={t(langKeys.billingperiod_agentcurrency)}
                                onChange={(value) => setValue("agentcurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("agentcurrency")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.useradditionalfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.useradditionalfee)}
                                onChange={(value) => setValue("useradditionalfee", value)}
                                type="number"
                                valueDefault={getValues("useradditionalfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.useradditionalcharge)}
                                value={formatNumber(getValues("useradditionalcharge") || 0)}
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
                                            checked={checkedUser}
                                            disabled={!canEdit}
                                            onChange={(e) => {
                                                setCheckedUser(e.target.checked);
                                                setValue("usercreateoverride", e.target.checked);
                                            }}
                                        />
                                    }
                                />
                            </div>
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={agentModeList}
                                disabled={!canEdit}
                                error={errors?.agentmode?.message}
                                label={t(langKeys.billingperiod_agentmode)}
                                onChange={(value) => setValue("agentmode", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("agentmode")}
                                uset={true}
                            />
                        </div>
                    </div>
                )}
                {pageSelected === 2 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.channelfreequantity?.message}
                                label={t(langKeys.channelfreequantity)}
                                onChange={(value) => setValue("channelfreequantity", value)}
                                type="number"
                                valueDefault={getValues("channelfreequantity")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
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
                                disabled={!canEdit}
                                error={errors?.freewhatsappchannel?.message}
                                label={t(langKeys.contractedplanfreewhatsappchannel)}
                                onChange={(value) => setValue("freewhatsappchannel", value)}
                                type="number"
                                valueDefault={getValues("freewhatsappchannel")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.channelwhatsappfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.channelwhatsappfee)}
                                onChange={(value) => setValue("channelwhatsappfee", value)}
                                type="number"
                                valueDefault={getValues("channelwhatsappfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.channelotherquantity)}
                                value={getValues("channelotherquantity").toString()}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.channelwhatsappquantity)}
                                value={getValues("channelwhatsappquantity").toString()}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.channelcharge)}
                                value={formatNumber(getValues("channelcharge") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.reportfreeconversations)}
                                value={getValues("freewhatsappconversations").toString()}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className={"col-6"} style={{ paddingBottom: "3px" }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                    {t(langKeys.allowchanneloverride)}
                                </Box>
                                <FormControlLabel
                                    label={""}
                                    style={{ paddingLeft: 10 }}
                                    control={
                                        <IOSSwitch
                                            checked={checkedChannel}
                                            disabled={!canEdit}
                                            onChange={(e) => {
                                                setCheckedChannel(e.target.checked);
                                                setValue("channelcreateoverride", e.target.checked);
                                            }}
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
                {pageSelected === 3 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.conversationquantity)}
                                value={getValues("conversationquantity").toString()}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.interactionquantity)}
                                value={getValues("interactionquantity").toString()}
                            />
                        </div>
                        <h3>
                            <b>{t(langKeys.billingperiod_conversationusersection)}</b>
                        </h3>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationuserquantity)}
                                value={getValues("conversationuserquantity").toString()}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationuserfreequantity)}
                                value={getValues("conversationuserfreequantity").toString()}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.conversationusercurrency?.message}
                                label={t(langKeys.billingperiod_conversationusercurrency)}
                                onChange={(value) => setValue("conversationusercurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("conversationusercurrency")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationusergeneralvcacomission?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationusergeneralvcacomission)}
                                onChange={(value) => setValue("conversationusergeneralvcacomission", value)}
                                type="number"
                                valueDefault={getValues("conversationusergeneralvcacomission")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationusergeneralvcafee)}
                                value={formatNumber(getValues("conversationusergeneralvcafee") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationusermetacurrency)}
                                value={getValues("conversationusermetacurrency")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationusergeneralfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationusergeneralfee)}
                                onChange={(value) => setValue("conversationusergeneralfee", value)}
                                type="number"
                                valueDefault={getValues("conversationusergeneralfee")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationusergeneraltotalfee)}
                                value={formatNumber(getValues("conversationusergeneraltotalfee") || 0)}
                            />
                        </div>
                        <h3>
                            <b>{t(langKeys.billingperiod_conversationbusinesssection)}</b>
                        </h3>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationbusinessutilityquantity)}
                                value={getValues("conversationbusinessutilityquantity").toString()}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationbusinessauthenticationquantity)}
                                value={getValues("conversationbusinessauthenticationquantity").toString()}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationbusinessmarketingquantity)}
                                value={getValues("conversationbusinessmarketingquantity").toString()}
                            />
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.conversationbusinesscurrency?.message}
                                label={t(langKeys.billingperiod_conversationbusinesscurrency)}
                                onChange={(value) => setValue("conversationbusinesscurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("conversationbusinesscurrency")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessutilityvcacomission?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessutilityvcacomission)}
                                onChange={(value) => setValue("conversationbusinessutilityvcacomission", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessutilityvcacomission")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessauthenticationvcacomission?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessauthenticationvcacomission)}
                                onChange={(value) => setValue("conversationbusinessauthenticationvcacomission", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessauthenticationvcacomission")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessmarketingvcacomission?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessmarketingvcacomission)}
                                onChange={(value) => setValue("conversationbusinessmarketingvcacomission", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessmarketingvcacomission")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessutilityvcafee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessutilityvcafee)}
                                onChange={(value) => setValue("conversationbusinessutilityvcafee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessutilityvcafee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationbusinessauthenticationvcafee)}
                                value={formatNumber(getValues("conversationbusinessauthenticationvcafee") || 0)}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessmarketingvcafee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessmarketingvcafee)}
                                onChange={(value) => setValue("conversationbusinessmarketingvcafee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessmarketingvcafee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.conversationbusinessmetacurrency?.message}
                                label={t(langKeys.billingperiod_conversationbusinessmetacurrency)}
                                onChange={(value) => setValue("conversationbusinessmetacurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("conversationbusinessmetacurrency")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessutilityfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessutilityfee)}
                                onChange={(value) => setValue("conversationbusinessutilityfee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessutilityfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessauthenticationfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessauthenticationfee)}
                                onChange={(value) => setValue("conversationbusinessauthenticationfee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessauthenticationfee")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessmarketingfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessmarketingfee)}
                                onChange={(value) => setValue("conversationbusinessmarketingfee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessmarketingfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessutilitytotalfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessutilitytotalfee)}
                                onChange={(value) => setValue("conversationbusinessutilitytotalfee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessutilitytotalfee")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessauthenticationtotalfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessauthenticationtotalfee)}
                                onChange={(value) => setValue("conversationbusinessauthenticationtotalfee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessauthenticationtotalfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.conversationbusinessmarketingtotalfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_conversationbusinessmarketingtotalfee)}
                                onChange={(value) => setValue("conversationbusinessmarketingtotalfee", value)}
                                type="number"
                                valueDefault={getValues("conversationbusinessmarketingtotalfee")}
                            />
                        </div>
                        <h3>
                            <b>{t(langKeys.billingperiod_conversationsection)}</b>
                        </h3>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.conversationcurrency?.message}
                                label={t(langKeys.billingperiod_conversationcurrency)}
                                onChange={(value) => setValue("conversationcurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("conversationcurrency")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationvcacomission)}
                                value={formatNumber(getValues("conversationvcacomission") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationtotalfee)}
                                value={formatNumber(getValues("conversationtotalfee") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_conversationfee)}
                                value={formatNumber(getValues("conversationfee") || 0)}
                            />
                        </div>
                    </div>
                )}
                {pageSelected === 4 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={contactModeList}
                                disabled={!canEdit}
                                error={errors?.contactmode?.message}
                                label={t(langKeys.billingperiod_contactmode)}
                                onChange={(value) => setValue("contactmode", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("contactmode")}
                                uset={true}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_contactcount)}
                                value={formatNumber(getValues("contactcount") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.clientfreequantity?.message}
                                label={t(langKeys.clientfreequantity)}
                                onChange={(value) => setValue("clientfreequantity", value)}
                                type="number"
                                valueDefault={getValues("clientfreequantity")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_contactquantity)}
                                value={formatNumber(getValues("contactquantity") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.contactcurrency?.message}
                                label={t(langKeys.billingperiod_contactcurrency)}
                                onChange={(value) => setValue("contactcurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("contactcurrency")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.clientadditionalfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.clientadditionalfee)}
                                onChange={(value) => setValue("clientadditionalfee", value)}
                                type="number"
                                valueDefault={getValues("clientadditionalfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.clientadditionalcharge)}
                                value={formatNumber(getValues("clientadditionalcharge") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_contactwhatsappquantity)}
                                value={formatNumber(getValues("contactwhatsappquantity") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_contactotherquantity)}
                                value={formatNumber(getValues("contactotherquantity") || 0)}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.contactwhatsappfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_contactwhatsappfee)}
                                onChange={(value) => setValue("contactwhatsappfee", value)}
                                type="number"
                                valueDefault={getValues("contactwhatsappfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.contactotherfee?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.billingperiod_contactotherfee)}
                                onChange={(value) => setValue("contactotherfee", value)}
                                type="number"
                                valueDefault={getValues("contactotherfee")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_contactwhatsapptotalfee)}
                                value={formatNumber(getValues("contactwhatsapptotalfee") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_contactothertotalfee)}
                                value={formatNumber(getValues("contactothertotalfee") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_contacttotalfee)}
                                value={formatNumber(getValues("contacttotalfee") || 0)}
                            />
                        </div>
                    </div>
                )}
                {pageSelected === 5 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.messagingcurrency?.message}
                                label={t(langKeys.billingperiod_messagingcurrency)}
                                onChange={(value) => setValue("messagingcurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("messagingcurrency")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.unitpricepersms?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.unitpricepersms)}
                                onChange={(value) => setValue("unitpricepersms", value)}
                                type="number"
                                valueDefault={getValues("unitpricepersms")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.vcacomissionpersms?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.vcacomissionpersms)}
                                onChange={(value) => setValue("vcacomissionpersms", value)}
                                type="number"
                                valueDefault={getValues("vcacomissionpersms")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.smsquantity)}
                                value={formatNumberNoDecimals(getValues("smsquantity") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.minimumsmsquantity?.message}
                                label={t(langKeys.minimumsmsquantity)}
                                onChange={(value) => setValue("minimumsmsquantity", value)}
                                type="number"
                                valueDefault={getValues("minimumsmsquantity")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.smscost)}
                                value={formatNumber(getValues("smscost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.unitepricepermail?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.unitepricepermail)}
                                onChange={(value) => setValue("unitepricepermail", value)}
                                type="number"
                                valueDefault={getValues("unitepricepermail")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.vcacomissionpermail?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.vcacomissionpermail)}
                                onChange={(value) => setValue("vcacomissionpermail", value)}
                                type="number"
                                valueDefault={getValues("vcacomissionpermail")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.mailquantity)}
                                value={formatNumberNoDecimals(getValues("mailquantity") || 0)}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.minimummailquantity?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.minimummailquantity)}
                                onChange={(value) => setValue("minimummailquantity", value)}
                                type="number"
                                valueDefault={getValues("minimummailquantity")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.mailcost)}
                                value={formatNumber(getValues("mailcost") || 0)}
                            />
                        </div>
                    </div>
                )}
                {pageSelected === 6 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-12"
                                disabled={!canEdit}
                                error={errors?.vcacomissionpervoicechannel?.message}
                                inputProps={{ step: "any" }}
                                label={t(langKeys.vcacomissionpervoicechannel)}
                                onChange={(value) => setValue("vcacomissionpervoicechannel", value)}
                                type="number"
                                valueDefault={getValues("vcacomissionpervoicechannel")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallphonecost)}
                                value={formatNumber(getValues("voximplantcallphonecost") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallphonevcacost)}
                                value={formatNumber(getValues("voximplantcallphonevcacost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.callphonecost)}
                                value={formatNumber(getValues("callphonecost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallpubliccost)}
                                value={formatNumber(getValues("voximplantcallpubliccost") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallpublicvcacost)}
                                value={formatNumber(getValues("voximplantcallpublicvcacost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.callpubliccost)}
                                value={formatNumber(getValues("callpubliccost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallvoipcost)}
                                value={formatNumber(getValues("voximplantcallvoipcost") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallvoipvcacost)}
                                value={formatNumber(getValues("voximplantcallvoipvcacost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.callvoipcost)}
                                value={formatNumber(getValues("callvoipcost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallrecordingcost)}
                                value={formatNumber(getValues("voximplantcallrecordingcost") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallrecordingvcacost)}
                                value={formatNumber(getValues("voximplantcallrecordingvcacost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.callrecordingcost)}
                                value={formatNumber(getValues("callrecordingcost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallothercost)}
                                value={formatNumber(getValues("voximplantcallothercost") || 0)}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.voximplantcallothervcacost)}
                                value={formatNumber(getValues("voximplantcallothervcacost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.callothercost)}
                                value={formatNumber(getValues("callothercost") || 0)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.callchannelcost)}
                                value={formatNumber(getValues("callchannelcost") || 0)}
                            />
                        </div>
                    </div>
                )}
                {pageSelected === 7 && (
                    <div className={classes.containerDetail}>
                        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                            <div className={classes.title}>
                                {t(langKeys.aitotalcost)}: {formatNumber(row?.totalaicost || 0)}
                            </div>
                            <div>
                                <Button
                                    className={classes.button}
                                    color="primary"
                                    disabled={auxRes.loading || !canEdit}
                                    onClick={handleRegister}
                                    startIcon={<Add color="secondary" />}
                                    style={{ backgroundColor: "#55BD84" }}
                                    variant="contained"
                                >
                                    {t(langKeys.addnewai)}
                                </Button>
                            </div>
                        </div>
                        {auxRes.loading ? (
                            <ListItemSkeleton />
                        ) : (
                            dataArtificialIntelligence.map((item, index) => (
                                <DetailArtificialIntelligence
                                    data={{ row: item, edit: canEdit }}
                                    handleDelete={handleDelete}
                                    index={index}
                                    intelligenceData={dataArtificialBilling}
                                    key={`ai-${item?.provider}-${item?.typeprovider}-${index * 1000}`}
                                    preData={dataArtificialIntelligence}
                                    setAllIndex={setAllIndex}
                                    triggerSave={triggerSave}
                                    updateRecords={setDataArtificialIntelligence}
                                />
                            ))
                        )}
                    </div>
                )}
                {pageSelected === 8 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.consultingcurrency?.message}
                                label={t(langKeys.billingperiod_consultingcurrency)}
                                onChange={(value) => setValue("consultingcurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("consultingcurrency")}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_consultingconsultingfee)}
                                value={String(getValues("consultingconsultingfee"))}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.consultingcontractquantity?.message}
                                label={t(langKeys.billingperiod_consultingcontractquantity)}
                                onChange={(value) => setValue("consultingcontractquantity", value)}
                                type="number"
                                valueDefault={getValues("consultingcontractquantity")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.consultingcontractedfee?.message}
                                label={t(langKeys.billingperiod_consultingcontractedfee)}
                                onChange={(value) => setValue("consultingcontractedfee", value)}
                                type="number"
                                valueDefault={getValues("consultingcontractedfee")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_consultingadditionalfee)}
                                value={String(getValues("consultingadditionalfee"))}
                            />
                            <FieldView
                                className="col-6"
                                label={t(langKeys.billingperiod_consultingtotalfee)}
                                value={String(getValues("consultingtotalfee"))}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={[]}
                                disabled={!canEdit}
                                error={errors?.consultingregisterprofile?.message}
                                label={t(langKeys.billingperiod_consultingregisterprofile)}
                                onChange={(value) => setValue("consultingregisterprofile", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("consultingregisterprofile")}
                            />
                            <FieldSelect
                                className="col-6"
                                data={currencyList}
                                disabled={!canEdit}
                                error={errors?.consultingcurrency?.message}
                                label={t(langKeys.billingperiod_consultingcurrency)}
                                onChange={(value) => setValue("consultingcurrency", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={getValues("consultingcurrency")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.consultingunitfee?.message}
                                label={t(langKeys.billingperiod_consultingunitfee)}
                                onChange={(value) => setValue("consultingunitfee", value)}
                                type="number"
                                valueDefault={getValues("consultingunitfee")}
                            />
                        </div>
                    </div>
                )}
                {pageSelected === 9 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.additionalservicename1?.message}
                                label={`${t(langKeys.additionalservicename)} 1`}
                                onChange={(value) => setValue("additionalservicename1", value)}
                                valueDefault={getValues("additionalservicename1")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.additionalservicefee1?.message}
                                inputProps={{ step: "any" }}
                                label={`${t(langKeys.additionalservicefee)} 1`}
                                onChange={(value) => setValue("additionalservicefee1", value)}
                                type="number"
                                valueDefault={getValues("additionalservicefee1")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.additionalservicename2?.message}
                                label={`${t(langKeys.additionalservicename)} 2`}
                                onChange={(value) => setValue("additionalservicename2", value)}
                                valueDefault={getValues("additionalservicename2")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.additionalservicefee2?.message}
                                inputProps={{ step: "any" }}
                                label={`${t(langKeys.additionalservicefee)} 2`}
                                onChange={(value) => setValue("additionalservicefee2", value)}
                                type="number"
                                valueDefault={getValues("additionalservicefee2")}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.additionalservicename3?.message}
                                label={`${t(langKeys.additionalservicename)} 3`}
                                onChange={(value) => setValue("additionalservicename3", value)}
                                valueDefault={getValues("additionalservicename3")}
                            />
                            <FieldEdit
                                className="col-6"
                                disabled={!canEdit}
                                error={errors?.additionalservicefee3?.message}
                                inputProps={{ step: "any" }}
                                label={`${t(langKeys.additionalservicefee)} 3`}
                                onChange={(value) => setValue("additionalservicefee3", value)}
                                type="number"
                                valueDefault={getValues("additionalservicefee3")}
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

interface ModalProps {
    data: RowSelected;
    handleDelete: (row: Dictionary | null, index: number) => void;
    index: number;
    intelligenceData: Dictionary[];
    openModal?: boolean;
    preData: (Dictionary | null)[];
    setAllIndex: (index: any) => void;
    setOpenModal?: (open: boolean) => void;
    triggerSave?: boolean;
    updateRecords?: (record: any) => void;
}

const DetailArtificialIntelligence: React.FC<ModalProps> = ({
    data: { row, edit },
    handleDelete,
    index,
    intelligenceData,
    preData,
    setAllIndex,
    triggerSave,
    updateRecords,
}) => {
    const { t } = useTranslation();

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        reset,
        setValue,
        trigger,
    } = useForm();

    useEffect(() => {
        if (triggerSave) {
            (async () => {
                const allOk = await trigger();
                const data = getValues();
                if (allOk) {
                    updateRecords &&
                        updateRecords((p: Dictionary[], itmp: number) => {
                            p[index] = { ...data, operation: p[index].operation === "INSERT" ? "INSERT" : "UPDATE" };
                            return p;
                        });
                }
                setAllIndex((p: number[]) => [...p, { index, allOk }]);
            })();
        }
    }, [triggerSave]);

    function updatefield(field: string, value: any) {
        updateRecords &&
            updateRecords((p: Dictionary[]) => {
                p[index] = { ...p[index], [field]: value };
                return p;
            });
    }

    useEffect(() => {
        reset({
            additionalfee: row ? row.additionalfee : 0.0,
            aicost: row ? row.aicost : 0.0,
            aiquantity: row ? row.aiquantity : 0,
            basicfee: row ? row.basicfee : 0.0,
            charlimit: row ? row.charlimit : 0,
            corpid: row ? row.corpid : 0,
            description: row ? row.description : "",
            freeinteractions: row ? row.freeinteractions : 0,
            id: row ? row.id : 0,
            measureunit: row ? row.measureunit : "",
            month: row ? row.month : 0,
            operation: row ? "UPDATE" : "INSERT",
            orgid: row ? row.orgid : 0,
            plan: row ? row.plan : "",
            provider: row ? row.provider : "",
            status: row ? row.status : "ACTIVO",
            type: row ? row.type : "",
            year: row ? row.year : 0,
        });

        register("aicost");
        register("aiquantity");
        register("corpid");
        register("description");
        register("id");
        register("measureunit");
        register("month");
        register("operation");
        register("orgid");
        register("plan", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("provider", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status");
        register("type", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("year");

        register("additionalfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("basicfee", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("charlimit", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });

        register("freeinteractions", {
            validate: (value) =>
                ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required),
        });
    }, [preData]);

    const onSubmit = handleSubmit((data) => {
        if (!row) updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, operation: "INSERT" }]);
        else
            updateRecords &&
                updateRecords((p: Dictionary[]) =>
                    p.map((x) => (x.orgid === row ? { ...x, ...data, operation: x.operation || "UPDATE" } : x))
                );
    });

    const onChangeArtificialIntelligence = (value: Dictionary) => {
        setValue("additionalfee", value?.additionalfee || 0.0);
        setValue("basicfee", value?.basicfee || 0.0);
        setValue("charlimit", value?.charlimit || 0);
        setValue("description", value?.description || "");
        setValue("freeinteractions", value?.freeinteractions || 0);
        setValue("measureunit", value?.measureunit || "");
        setValue("plan", value?.plan || "");
        setValue("provider", value?.provider || "");
        setValue("type", value?.type || "");

        updatefield("additionalfee", value?.additionalfee || 0.0);
        updatefield("basicfee", value?.basicfee || 0.0);
        updatefield("charlimit", value?.charlimit || 0);
        updatefield("description", value?.description || "");
        updatefield("freeinteractions", value?.freeinteractions || 0);
        updatefield("measureunit", value?.measureunit || "");
        updatefield("plan", value?.plan || "");
        updatefield("provider", value?.provider || "");
        updatefield("type", value?.type || "");

        trigger("additionalfee");
        trigger("basicfee");
        trigger("charlimit");
        trigger("description");
        trigger("freeinteractions");
        trigger("measureunit");
        trigger("plan");
        trigger("provider");
        trigger("type");

        updateRecords &&
            updateRecords((p: Dictionary[], itmp: number) => {
                p[index] = { ...p[index], corpid: value?.corpid, orgid: value?.orgid || 0 };
                return p;
            });
    };

    return (
        <Accordion defaultExpanded={row?.id === 0} style={{ marginBottom: "8px" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography>{row?.type ? `${row.type} - ${row.provider} (${row.plan})` : t(langKeys.newai)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={onSubmit} style={{ width: "100%" }}>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={intelligenceData}
                            disabled={!edit}
                            error={errors?.type?.message}
                            label={t(langKeys.aiservice)}
                            onChange={onChangeArtificialIntelligence}
                            optionDesc="typeproviderplan"
                            optionValue="typeproviderplan"
                            valueDefault={`${getValues("type")} - ${getValues("provider")} (${getValues("plan")})`}
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
                            error={errors?.plan?.message}
                            label={t(langKeys.billingsetup_plan)}
                            valueDefault={getValues("plan")}
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
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.freeinteractions?.message}
                            label={t(langKeys.billingsetup_minimuminteractions)}
                            type="number"
                            valueDefault={getValues("freeinteractions")}
                            onChange={(value) => {
                                setValue("freeinteractions", value || 0);
                                updatefield("freeinteractions", value || 0);
                            }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.basicfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingsetup_baseprice)}
                            type="number"
                            valueDefault={getValues("basicfee")}
                            onChange={(value) => {
                                setValue("basicfee", value || 0.0);
                                updatefield("basicfee", value || 0.0);
                            }}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.additionalfee?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.billingsetup_additionalprice)}
                            type="number"
                            valueDefault={getValues("additionalfee")}
                            onChange={(value) => {
                                setValue("additionalfee", value || 0.0);
                                updatefield("additionalfee", value || 0.0);
                            }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={true}
                            error={errors?.aiquantity?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.quantity)}
                            type="number"
                            valueDefault={formatNumberNoDecimals(getValues("aiquantity") || 0)}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={true}
                            error={errors?.aicost?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.aicost)}
                            type="number"
                            valueDefault={formatNumber(getValues("aicost") || 0)}
                        />
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <Button
                            color="primary"
                            disabled={!edit}
                            onClick={() => handleDelete(row, index)}
                            startIcon={<DeleteIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.delete)}
                        </Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
};

const ListItemSkeleton: FC = () => (
    <ListItem style={{ display: "flex", paddingLeft: 0, paddingRight: 0, paddingBottom: 8 }}>
        <Box style={{ padding: 20, backgroundColor: "white", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <Grid container direction="column">
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
                <Divider style={{ margin: "10px 0" }} />
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </ListItem>
);

const PeriodReport: React.FC<{ customSearch: any; dataCorp: any; dataOrg: any }> = ({
    customSearch,
    dataCorp,
    dataOrg,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const el = React.useRef<null | HTMLDivElement>(null);
    const executeCalculate = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const resExportData = useSelector((state) => state.main.exportData);
    const resultPdf = useSelector((state) => state.culqi.requestReportPdf);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        corpid: user?.corpid ?? 0,
        month: new Date().getMonth() + 1,
        orgid: user?.orgid ?? 0,
        totalize: 2,
        year: new Date().getFullYear(),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(
            new Date(new Date().setDate(1)).getMonth() + 1
        ).padStart(2, "0")}`,
    });

    const [canSearch, setCanSearch] = useState(false);
    const [datareport, setdatareport] = useState<any>([]);
    const [disableOrg, setDisableOrg] = useState(false);
    const [requestType, setRequestType] = useState(2);
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [waitPdf, setWaitPdf] = useState(false);
    const [waitSearch, setWaitSearch] = useState(false);

    const datatotalize = [
        { value: 1, description: t(langKeys.corporation) },
        { value: 2, description: t(langKeys.organization) },
    ];

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02");
            let mes = datetochange?.getMonth() + 1;
            let year = datetochange?.getFullYear();
            let datetoshow = `${year}-${String(mes).padStart(2, "0")}`;
            setdataMain((prev) => ({ ...prev, datetoshow, year, month: mes }));
        }
    }

    function search() {
        dispatch(showBackdrop(true));
        setRequestType(dataMain.totalize);
        if (dataMain.totalize === 2) {
            dispatch(getCollection(getBillingPeriodSummarySel(dataMain)));
        } else {
            dispatch(getCollection(getBillingPeriodSummarySelCorp(dataMain)));
        }
    }

    useEffect(() => {
        search();
    }, []);

    useEffect(() => {
        setCanSearch(false);

        if (dataMain) {
            if (dataMain.totalize) {
                if (dataMain.totalize === 1) {
                    setDisableOrg(true);

                    if (dataMain.corpid) {
                        setCanSearch(true);
                    }
                }
                if (dataMain.totalize === 2) {
                    setDisableOrg(false);

                    if (dataMain.corpid && dataMain.orgid) {
                        setCanSearch(true);
                    }
                }
            }
        }
    }, [dataMain]);

    useEffect(() => {
        if (customSearch?.corpid !== 0) {
            setdataMain((prev) => ({
                ...prev,
                corpid: customSearch?.corpid,
                datetoshow: `${customSearch?.year}-${String(customSearch?.month).padStart(2, "0")}`,
                month: customSearch?.month,
                orgid: customSearch?.orgid,
                totalize: customSearch?.totalize,
                year: customSearch?.year,
            }));
            setWaitSearch(true);
        }
    }, [customSearch]);

    useEffect(() => {
        if (waitSearch) {
            setWaitSearch(false);
            search();
        }
    }, [dataMain, waitSearch]);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            if (mainResult.mainData.data.length) {
                setdatareport(mainResult.mainData.data[0]);
            } else {
                setdatareport(null);
            }
            dispatch(showBackdrop(false));
        }
    }, [mainResult.mainData]);

    useEffect(() => {
        if (waitCalculate) {
            if (!executeCalculate.loading && !executeCalculate.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_calculate) }));
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
                search();
            } else if (executeCalculate.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeCalculate.code ?? "error_unexpected_error", {
                            module: t(langKeys.tipification).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
            }
        }
    }, [executeCalculate, waitCalculate]);

    const triggerExportDataPerson = () => {
        dispatch(exportData(billingpersonreportsel(dataMain), "BillingPersonReport", "excel", true));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataUser = () => {
        dispatch(exportData(billinguserreportsel(dataMain), "BillingUserReport", "excel", true));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataConversation = () => {
        dispatch(exportData(billingReportConversationWhatsApp(dataMain), "BillingUserConversation", "excel", true));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataConsulting = () => {
        window.alert("MISSING QUERY");
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataHsmHistory = (datatype: string) => {
        dispatch(
            exportData(
                billingReportHsmHistory({
                    corpid: dataMain.corpid,
                    month: dataMain.month,
                    orgid: dataMain.orgid,
                    type: datatype,
                    year: dataMain.year,
                }),
                "BillingUserHsmHistory",
                "excel",
                true
            )
        );
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const handleCalculate = () => {
        const callback = () => {
            dispatch(
                execute(getBillingPeriodCalcRefreshAll(dataMain.year, dataMain.month, dataMain.corpid, dataMain.orgid))
            );
            dispatch(showBackdrop(true));
            setWaitCalculate(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_calculate),
                visible: true,
            })
        );
    };

    const handleReportPdf = () => {
        if (datareport) {
            let intelligenceDetail: {}[] = [];

            if (datareport.artificialintelligencedata) {
                datareport.artificialintelligencedata.forEach((element: any) => {
                    intelligenceDetail.push({
                        aicost: `$${formatNumber(element.aicost || 0)}`,
                        aiquantity: formatNumberNoDecimals(element.aiquantity || 0),
                        freeinteractions: formatNumberNoDecimals(element.freeinteractions || 0),
                        igv: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, element.aicost) : "0.00"}`,
                        plan: element.plan,
                        provider: element.provider,
                        service: element.type,
                        additionalfee:
                            (element.aiquantity || 0) <= (element.freeinteractions || 0)
                                ? ""
                                : `$${formatNumberFourDecimals(element.additionalfee || 0)}`,
                        taxableamount: `$${datareport.taxrate !== 1
                                ? getTaxableAmount(datareport.taxrate ? datareport.taxrate - 1 : 0, element.aicost || 0)
                                : formatNumber(element.aicost)
                            }`,
                    });
                });
            }

            let reportbody = {
                parameters: {
                    additional01service: datareport.additionalservicefee1 ? datareport.additionalservicename1 : "",
                    additional01service1: "",
                    additional01service2: "",
                    additional02service: datareport.additionalservicefee2 ? datareport.additionalservicename2 : "",
                    additional02service1: "",
                    additional02service2: "",
                    additional03service: datareport.additionalservicefee3 ? datareport.additionalservicename3 : "",
                    additional03service1: "",
                    additional03service2: "",
                    agentadditional1: formatNumberNoDecimals(datareport.useradditionalquantity || 0),
                    agentadditional2: `$${formatNumberFourDecimals(datareport.useradditionalfee || 0)}`,
                    agentadditional5: `$${formatNumber(datareport.useradditionalcharge || 0)}`,
                    agentcontracted1: formatNumberNoDecimals(datareport.userfreequantity || 0),
                    agentcontracted2: "",
                    agentcontracted3: "",
                    agentcontracted4: "",
                    agentcontracted5: "",
                    basecost1: "",
                    basecost2: "",
                    basecost5: `$${datareport.basicfee ? formatNumber(datareport.basicfee || 0) : "0.00"}`,
                    channelcontracted1: formatNumberNoDecimals(datareport.channelfreequantity || 0),
                    channelcontracted2: "",
                    channelcontracted3: "",
                    channelcontracted4: "",
                    channelcontracted5: "",
                    channelother1: formatNumberNoDecimals(datareport.channelotherquantity || 0),
                    channelother2: `$${formatNumberFourDecimals(datareport.channelotherfee || 0)}`,
                    channelother5: `$${formatNumber(datareport.channelothercharge || 0)}`,
                    channelwhatsappadditional2: `$${formatNumberFourDecimals(datareport.channelwhatsappfee || 0)}`,
                    channelwhatsappadditional5: `$${formatNumber(datareport.channelwhatsappcharge || 0)}`,
                    channelwhatsappfree1: formatNumberNoDecimals(datareport.freewhatsappchannel || 0),
                    channelwhatsappfree2: "",
                    channelwhatsappfree3: "",
                    channelwhatsappfree4: "",
                    channelwhatsappfree5: "",
                    channelwhatsapptotal1: formatNumberNoDecimals(datareport.channelwhatsappquantity || 0),
                    channelwhatsapptotal2: "",
                    channelwhatsapptotal3: "",
                    channelwhatsapptotal4: "",
                    channelwhatsapptotal5: "",
                    contactadditional1: formatNumberNoDecimals(datareport.clientadditionalquantity || 0),
                    contactadditional2: `$${formatNumberFourDecimals(datareport.clientadditionalfee || 0)}`,
                    contactadditional5: `$${formatNumber(datareport.clientadditionalcharge || 0)}`,
                    contactfree1: formatNumberNoDecimals(datareport.clientfreequantity || 0),
                    contactfree2: "",
                    contactfree3: "",
                    contactfree4: "",
                    contactfree5: "",
                    contacttotal1: formatNumberNoDecimals(datareport.clientquantity || 0),
                    contacttotal2: "",
                    contacttotal3: "",
                    contacttotal4: "",
                    contacttotal5: "",
                    conversationwhatsappbusiness2: "",
                    conversationwhatsappbusiness5: `$${formatNumber(datareport.conversationcompanywhatcharge || 0)}`,
                    conversationwhatsappclient1: formatNumberNoDecimals(datareport.conversationclientwhatquantity || 0),
                    conversationwhatsappclient2: "",
                    conversationwhatsappclient5: `$${formatNumber(datareport.conversationclientwhatcharge || 0)}`,
                    conversationwhatsappfree2: "",
                    conversationwhatsappfree3: "",
                    conversationwhatsappfree4: "",
                    conversationwhatsappfree5: "",
                    generalinformationclient: requestType === 2 ? datareport.orgdesc : datareport.corpdesc,
                    generalinformationperiod: `${datareport.year}-${String(datareport.month).padStart(2, "0")}`,
                    generalinformationplan: datareport.billingplan,
                    intelligencedetail: intelligenceDetail,
                    messagingmail1: formatNumberNoDecimals(datareport.mailquantity || 0),
                    messagingmail5: `$${formatNumber(datareport.mailcost || 0)}`,
                    messagingminimummail1: formatNumberNoDecimals(datareport.minimummailquantity || 0),
                    messagingminimummail2: "",
                    messagingminimummail3: "",
                    messagingminimummail4: "",
                    messagingminimummail5: "",
                    messagingminimumsms1: formatNumberNoDecimals(datareport.minimumsmsquantity || 0),
                    messagingminimumsms2: "",
                    messagingminimumsms3: "",
                    messagingminimumsms4: "",
                    messagingminimumsms5: "",
                    messagingsms1: formatNumberNoDecimals(datareport.smsquantity || 0),
                    messagingsms5: `$${formatNumber(datareport.smscost || 0)}`,
                    supportplan: datareport.supportplan,
                    supportplan1: "",
                    supportplan2: "",
                    supportplan5: `$${formatNumber(datareport.supportbasicfee)}`,
                    totalagent: datareport.asesorquantity,
                    totalamount1: "",
                    totalamount2: "",
                    totalamount5: `$${formatNumber(datareport.totalcharge || 0)}`,
                    totalcontact: datareport.clientquantity,
                    totalconversation: datareport.conversationquantity,
                    totalinteraction: datareport.interactionquantity,
                    totalsupervisor: datareport.supervisorquantity,
                    voicecall1: "",
                    voicecall2: "",
                    voicecall5: `$${formatNumber(datareport.callpubliccost || 0)}`,
                    voiceothers1: "",
                    voiceothers2: "",
                    voiceothers5: `$${formatNumber(datareport.callothercost || 0)}`,
                    voicephone1: "",
                    voicephone2: "",
                    voicephone5: `$${formatNumber(datareport.callphonecost || 0)}`,
                    voicerecording1: "",
                    voicerecording2: "",
                    voicerecording5: `$${formatNumber(datareport.callrecordingcost || 0)}`,
                    voicevoip1: "",
                    voicevoip2: "",
                    voicevoip5: `$${formatNumber(datareport.callvoipcost || 0)}`,
                    additional01service3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                (datareport.additionalservicefee1 || 0) * datareport.taxrate
                            )
                            : formatNumber((datareport.additionalservicefee1 || 0) * datareport.taxrate)
                        }`,
                    additional01service4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.igv, (datareport.additionalservicefee1 || 0) * datareport.taxrate)
                            : "0.00"
                        }`,
                    additional01service5: `$${formatNumber(
                        (datareport.additionalservicefee1 || 0) * datareport.taxrate
                    )}`,
                    additional02service3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                (datareport.additionalservicefee2 || 0) * datareport.taxrate
                            )
                            : formatNumber((datareport.additionalservicefee2 || 0) * datareport.taxrate)
                        }`,
                    additional02service4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.igv, (datareport.additionalservicefee2 || 0) * datareport.taxrate)
                            : "0.00"
                        }`,
                    additional02service5: `$${formatNumber(
                        (datareport.additionalservicefee2 || 0) * datareport.taxrate
                    )}`,
                    additional03service3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                (datareport.additionalservicefee3 || 0) * datareport.taxrate
                            )
                            : formatNumber((datareport.additionalservicefee3 || 0) * datareport.taxrate)
                        }`,
                    additional03service4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.igv, (datareport.additionalservicefee3 || 0) * datareport.taxrate)
                            : "0.00"
                        }`,
                    additional03service5: `$${formatNumber(
                        (datareport.additionalservicefee3 || 0) * datareport.taxrate
                    )}`,
                    agentadditional3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.useradditionalcharge || 0
                            )
                            : formatNumber(datareport.useradditionalcharge)
                        }`,
                    agentadditional4: `$${datareport.taxrate !== 1
                            ? getIgv(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.useradditionalcharge || 0
                            )
                            : "0.00"
                        }`,
                    basecost3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.basicfee || 0
                            )
                            : formatNumber(datareport.basicfee)
                        }`,
                    basecost4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.basicfee || 0)
                            : "0.00"
                        }`,
                    channelother3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.channelothercharge || 0
                            )
                            : formatNumber(datareport.channelothercharge)
                        }`,
                    channelother4: `$${datareport.taxrate !== 1
                            ? getIgv(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.channelothercharge || 0
                            )
                            : "0.00"
                        }`,
                    channelwhatsappadditional1: formatNumberNoDecimals(
                        (datareport.channelwhatsappquantity - datareport.freewhatsappchannel < 0
                            ? 0
                            : datareport.channelwhatsappquantity - datareport.freewhatsappchannel) || 0
                    ),
                    contactadditional3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.clientadditionalcharge || 0
                            )
                            : formatNumber(datareport.clientadditionalcharge)
                        }`,
                    contactadditional4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.clientadditionalcharge) : "0.00"
                        }`,
                    conversationwhatsappbusiness1: formatNumberNoDecimals(
                        datareport.conversationcompanywhatquantity || 0
                    ),
                    conversationwhatsappbusiness3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.conversationcompanywhatcharge || 0
                            )
                            : formatNumber(datareport.conversationcompanywhatcharge)
                        }`,
                    conversationwhatsappbusiness4: `$${datareport.taxrate !== 1
                            ? getIgv(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.conversationcompanywhatcharge || 0
                            )
                            : "0.00"
                        }`,
                    conversationwhatsappclient3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.conversationclientwhatcharge || 0
                            )
                            : formatNumber(datareport.conversationclientwhatcharge)
                        }`,
                    conversationwhatsappclient4: `$${datareport.taxrate !== 1
                            ? getIgv(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.conversationclientwhatcharge || 0
                            )
                            : "0.00"
                        }`,
                    conversationwhatsappfree1: formatNumberNoDecimals(
                        (datareport.channelwhatsappquantity || 0) * (datareport.freewhatsappconversations || 0)
                    ),
                    channelwhatsappadditional3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.channelwhatsappcharge || 0
                            )
                            : formatNumber(datareport.channelwhatsappcharge)
                        }`,
                    channelwhatsappadditional4: `$${datareport.taxrate !== 1
                            ? getIgv(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.channelwhatsappcharge || 0
                            )
                            : "0.00"
                        }`,
                    messagingmail2: `$${formatNumberFourDecimals(
                        (datareport.unitepricepermail || 0) + (datareport.vcacomissionpermail || 0)
                    )}`,
                    messagingmail3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.mailcost || 0
                            )
                            : formatNumber(datareport.mailcost)
                        }`,
                    messagingmail4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.mailcost || 0)
                            : "0.00"
                        }`,
                    messagingsms2: `$${formatNumberFourDecimals(
                        (datareport.unitpricepersms || 0) + (datareport.vcacomissionpersms || 0)
                    )}`,
                    messagingsms3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.smscost || 0)
                            : formatNumber(datareport.smscost)
                        }`,
                    messagingsms4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.smscost || 0)
                            : "0.00"
                        }`,
                    supportplan3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(datareport.igv, datareport.supportbasicfee)
                            : formatNumber(datareport.supportbasicfee)
                        }`,
                    supportplan4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.supportbasicfee) : "0.00"
                        }`,
                    totalamount3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.totalcharge || 0
                            )
                            : formatNumber(datareport.totalcharge)
                        }`,
                    totalamount4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.totalcharge) : "0.00"
                        }`,
                    voicecall3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.callpubliccost || 0
                            )
                            : formatNumber(datareport.callpubliccost)
                        }`,
                    voicecall4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.callpubliccost || 0)
                            : "0.00"
                        }`,
                    voiceothers3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.callothercost || 0
                            )
                            : formatNumber(datareport.callothercost)
                        }`,
                    voiceothers4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.callothercost || 0)
                            : "0.00"
                        }`,
                    voicephone3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.callphonecost || 0
                            )
                            : formatNumber(datareport.callphonecost)
                        }`,
                    voicephone4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.callphonecost || 0)
                            : "0.00"
                        }`,
                    voicerecording3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.callrecordingcost || 0
                            )
                            : formatNumber(datareport.callrecordingcost)
                        }`,
                    voicerecording4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.callrecordingcost || 0)
                            : "0.00"
                        }`,
                    voicevoip3: `$${datareport.taxrate !== 1
                            ? getTaxableAmount(
                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                datareport.callvoipcost || 0
                            )
                            : formatNumber(datareport.callvoipcost)
                        }`,
                    voicevoip4: `$${datareport.taxrate !== 1
                            ? getIgv(datareport.taxrate ? datareport.taxrate - 1 : 0, datareport.callvoipcost || 0)
                            : "0.00"
                        }`,
                },
                dataonparameters: true,
                key: "period-report",
                method: "",
                reportname: "period-report",
                template: t(langKeys.billingreport_template),
            };

            dispatch(reportPdf(reportbody));
            dispatch(showBackdrop(true));
            setWaitPdf(true);
        }
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                window.open(resExportData.url, "_blank");
            } else if (resExportData.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(resExportData.code ?? "error_unexpected_error", {
                            module: t(langKeys.person).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (waitPdf) {
            if (!resultPdf.loading && !resultPdf.error) {
                dispatch(showBackdrop(false));
                setWaitPdf(false);
                if (resultPdf.datacard) {
                    window.open(resultPdf.datacard, "_blank");
                }
            } else if (resultPdf.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(resultPdf.code ?? "error_unexpected_error", {
                            module: t(langKeys.person).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitPdf(false);
            }
        }
    }, [resultPdf, waitPdf]);

    return (
        <Fragment>
            <div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <TextField
                        className={classes.fieldsfilter}
                        id="date"
                        onChange={(e) => handleDateChange(e.target.value)}
                        size="small"
                        type="month"
                        value={dataMain.datetoshow}
                        variant="outlined"
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        data={dataCorp}
                        label={t(langKeys.corporation)}
                        onChange={(value) => setdataMain((prev) => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))}
                        optionDesc="description"
                        optionValue="corpid"
                        orderbylabel={true}
                        valueDefault={dataMain.corpid}
                        variant="outlined"
                        disabled={["ADMINISTRADOR", "ADMINISTRADOR P", "ADMINISTRADOR LIMADERMA"].includes(
                            user?.roledesc ?? ""
                        )}
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        disabled={disableOrg}
                        label={t(langKeys.organization)}
                        onChange={(value) => setdataMain((prev) => ({ ...prev, orgid: value?.orgid || 0 }))}
                        optionDesc="orgdesc"
                        optionValue="orgid"
                        orderbylabel={true}
                        valueDefault={dataMain.orgid}
                        variant="outlined"
                        data={dataOrg.filter((e: any) => {
                            return e.corpid === dataMain.corpid;
                        })}
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        data={datatotalize}
                        label={t(langKeys.totalize)}
                        onChange={(value) => setdataMain((prev) => ({ ...prev, totalize: value?.value || 0 }))}
                        optionDesc="description"
                        optionValue="value"
                        orderbylabel={true}
                        valueDefault={dataMain.totalize}
                        variant="outlined"
                    />
                    <Button
                        color="primary"
                        disabled={mainResult.mainData.loading || !canSearch}
                        onClick={() => search()}
                        startIcon={<Search style={{ color: "white" }} />}
                        style={{ width: 120, backgroundColor: "#55BD84" }}
                        variant="contained"
                    >
                        {t(langKeys.search)}
                    </Button>
                    {!mainResult.mainData.loading && datareport && (
                        <Fragment>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => handleCalculate()}
                                startIcon={<Refresh color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {`${t(langKeys.calculate)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => handleReportPdf()}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {t(langKeys.download)}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataPerson()}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {`${t(langKeys.report)} ${t(langKeys.uniquecontacts)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataUser()}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {`${t(langKeys.report)} ${t(langKeys.agents_plural)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataConversation()}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {`${t(langKeys.report)} ${t(langKeys.conversationwhatsapp)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataConsulting()}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {`${t(langKeys.report)} ${t(langKeys.billingreport_consulting)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataHsmHistory("SMS")}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {`${t(langKeys.report)} ${t(langKeys.sms)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataHsmHistory("MAIL")}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {`${t(langKeys.report)} ${t(langKeys.mail)}`}
                            </Button>
                        </Fragment>
                    )}
                </div>
            </div>
            {!mainResult.mainData.loading && (
                <div style={{ width: "100%" }} ref={el}>
                    {datareport && (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.client)}
                                    value={requestType === 2 ? datareport.orgdesc : datareport.corpdesc}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView className="col-6" label={"Plan"} value={datareport.billingplan} />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.period)}
                                    value={`${datareport.year}-${String(datareport.month).padStart(2, "0")}`}
                                />
                            </div>
                            <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="left">
                                                {t(langKeys.billingreportitem)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {t(langKeys.billingreportquantity)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {t(langKeys.billingreportrate)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {t(langKeys.billingreporttaxableamount)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {t(langKeys.billingreporttaxableiva)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {t(langKeys.billingreportamount)}
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{t(langKeys.basecost)}</b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">
                                                $
                                                {datareport.taxrate !== 1
                                                    ? getTaxableAmount(
                                                        datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                        datareport.basicfee || 0
                                                    )
                                                    : formatNumber(datareport.basicfee)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                $
                                                {datareport.taxrate !== 1
                                                    ? getIgv(
                                                        datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                        datareport.basicfee || 0
                                                    )
                                                    : "0.00"}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                ${datareport.basicfee ? formatNumber(datareport.basicfee || 0) : "0.00"}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.agents_plural)}</b>
                                                </div>
                                                <div>{t(langKeys.contracted)}</div>
                                                <div>{t(langKeys.additional)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals(datareport.userfreequantity || 0)}</div>
                                                <div>
                                                    {formatNumberNoDecimals(datareport.useradditionalquantity || 0)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    ${formatNumberFourDecimals(datareport.useradditionalfee || 0)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.useradditionalcharge || 0
                                                        )
                                                        : formatNumber(datareport.useradditionalcharge)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.useradditionalcharge || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.useradditionalcharge || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.channel_plural)}</b>
                                                </div>
                                                <div>{t(langKeys.contracted)}</div>
                                                <div>{t(langKeys.whatsappfreechannel)}</div>
                                                <div>{t(langKeys.whatsappchannel)}</div>
                                                <div>{t(langKeys.whatsappadditionalchannel)}</div>
                                                <div>{t(langKeys.otherchannels)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals(datareport.channelfreequantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.freewhatsappchannel || 0)}</div>
                                                <div>
                                                    {formatNumberNoDecimals(datareport.channelwhatsappquantity || 0)}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        (datareport.channelwhatsappquantity -
                                                            datareport.freewhatsappchannel <
                                                            0
                                                            ? 0
                                                            : datareport.channelwhatsappquantity -
                                                            datareport.freewhatsappchannel) || 0
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(datareport.channelotherquantity || 0)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    ${formatNumberFourDecimals(datareport.channelwhatsappfee || 0)}
                                                </div>
                                                <div>${formatNumberFourDecimals(datareport.channelotherfee || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.channelwhatsappcharge || 0
                                                        )
                                                        : formatNumber(datareport.channelwhatsappcharge)}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.channelothercharge || 0
                                                        )
                                                        : formatNumber(datareport.channelothercharge)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.channelwhatsappcharge || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.channelothercharge || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.channelwhatsappcharge || 0)}</div>
                                                <div>${formatNumber(datareport.channelothercharge || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.billingreportconversations)}</b>
                                                </div>
                                                <div>{t(langKeys.billingreport_conversationfree)}</div>
                                                <div>{t(langKeys.billingreport_conversationusergeneral)}</div>
                                                <div>{t(langKeys.billingreport_conversationbusinessutility)}</div>
                                                <div>
                                                    {t(langKeys.billingreport_conversationbusinessauthentication)}
                                                </div>
                                                <div>{t(langKeys.billingreport_conversationbusinessmarketing)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        (datareport.channelwhatsappquantity || 0) *
                                                        (datareport.freewhatsappconversations || 0)
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        datareport.conversationclientwhatquantity || 0
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        datareport.conversationcompanywhatquantity || 0
                                                    )}
                                                </div>
                                                <div>{formatNumberNoDecimals(0)}</div>
                                                <div>{formatNumberNoDecimals(0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.conversationclientwhatcharge || 0
                                                        )
                                                        : formatNumber(datareport.conversationclientwhatcharge)}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.conversationcompanywhatcharge || 0
                                                        )
                                                        : formatNumber(datareport.conversationcompanywhatcharge)}
                                                </div>
                                                <div>${formatNumber(0)}</div>
                                                <div>${formatNumber(0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.conversationclientwhatcharge || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.conversationcompanywhatcharge || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div>${formatNumber(0)}</div>
                                                <div>${formatNumber(0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.conversationclientwhatcharge || 0)}</div>
                                                <div>
                                                    ${formatNumber(datareport.conversationcompanywhatcharge || 0)}
                                                </div>
                                                <div>${formatNumber(0)}</div>
                                                <div>${formatNumber(0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.billingreportmessaging)}</b>
                                                </div>
                                                <div>{t(langKeys.minimumsmsquantity)}</div>
                                                <div>{t(langKeys.billingreportsms)}</div>
                                                <div>{t(langKeys.minimummailquantity)}</div>
                                                <div>{t(langKeys.billingreportmail)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals(datareport.minimumsmsquantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.smsquantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.minimummailquantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.mailquantity || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {formatNumberFourDecimals(
                                                        (datareport.unitpricepersms || 0) +
                                                        (datareport.vcacomissionpersms || 0)
                                                    )}
                                                </div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {formatNumberFourDecimals(
                                                        (datareport.unitepricepermail || 0) +
                                                        (datareport.vcacomissionpermail || 0)
                                                    )}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.smscost || 0
                                                        )
                                                        : formatNumber(datareport.smscost)}
                                                </div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.mailcost || 0
                                                        )
                                                        : formatNumber(datareport.mailcost)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.smscost || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.mailcost || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.smscost || 0)}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.mailcost || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.periodreportvoice)}</b>
                                                </div>
                                                <div>{t(langKeys.periodreportphone)}</div>
                                                <div>{t(langKeys.periodreportpstn)}</div>
                                                <div>{t(langKeys.periodreportvoip)}</div>
                                                <div>{t(langKeys.periodreportrecording)}</div>
                                                <div>{t(langKeys.periodreportother)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callphonecost || 0
                                                        )
                                                        : formatNumber(datareport.callphonecost)}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callpubliccost || 0
                                                        )
                                                        : formatNumber(datareport.callpubliccost)}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callvoipcost || 0
                                                        )
                                                        : formatNumber(datareport.callvoipcost)}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callrecordingcost || 0
                                                        )
                                                        : formatNumber(datareport.callrecordingcost)}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callothercost || 0
                                                        )
                                                        : formatNumber(datareport.callothercost)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callphonecost || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callpubliccost || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callvoipcost || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callrecordingcost || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.callothercost || 0
                                                        )
                                                        : "0.00"}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.callphonecost || 0)}</div>
                                                <div>${formatNumber(datareport.callpubliccost || 0)}</div>
                                                <div>${formatNumber(datareport.callvoipcost || 0)}</div>
                                                <div>${formatNumber(datareport.callrecordingcost || 0)}</div>
                                                <div>${formatNumber(datareport.callothercost || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.billingreportcontacts)}</b>
                                                </div>
                                                <div>{t(langKeys.freecontacts)}</div>
                                                <div>{t(langKeys.billingreporttotalcontacts)}</div>
                                                <div>{t(langKeys.billingreportadditionalcontacts)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals(datareport.clientfreequantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.clientquantity || 0)}</div>
                                                <div>
                                                    {formatNumberNoDecimals(datareport.clientadditionalquantity || 0)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    ${formatNumberFourDecimals(datareport.clientadditionalfee || 0)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getTaxableAmount(
                                                            datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                            datareport.clientadditionalcharge || 0
                                                        )
                                                        : formatNumber(datareport.clientadditionalcharge)}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    $
                                                    {datareport.taxrate !== 1
                                                        ? getIgv(datareport.igv, datareport.clientadditionalcharge)
                                                        : "0.00"}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.clientadditionalcharge || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{t(langKeys.billingreport_infrastructure)}</b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">${formatNumber(0)}</StyledTableCell>
                                            <StyledTableCell align="right">${formatNumber(0)}</StyledTableCell>
                                            <StyledTableCell align="right">${formatNumber(0)}</StyledTableCell>
                                        </StyledTableRow>
                                        {datareport?.artificialintelligencedata?.map((item: any) => (
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>
                                                        <b>
                                                            {item.type} - {item.provider} ({item.plan})
                                                        </b>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{formatNumberNoDecimals(item.aiquantity || 0)}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {(item.aiquantity || 0) > (item.freeinteractions || 0) && (
                                                        <div>${formatNumberFourDecimals(item.additionalfee || 0)}</div>
                                                    )}
                                                    {(item.aiquantity || 0) <= (item.freeinteractions || 0) && (
                                                        <div style={{ color: "transparent" }}>.</div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getTaxableAmount(
                                                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                                item.aicost || 0
                                                            )
                                                            : formatNumber(item.aicost)}
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getIgv(datareport.igv, item.aicost)
                                                            : "0.00"}
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>${formatNumber(item.aicost || 0)}</div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>
                                                    {t(langKeys.supportplan)} {datareport.supportplan}
                                                </b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">
                                                $
                                                {datareport.taxrate !== 1
                                                    ? getTaxableAmount(datareport.igv, datareport.supportbasicfee)
                                                    : formatNumber(datareport.supportbasicfee)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                $
                                                {datareport.taxrate !== 1
                                                    ? getIgv(datareport.igv, datareport.supportbasicfee)
                                                    : "0.00"}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                ${formatNumber(datareport.supportbasicfee)}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{t(langKeys.billingreport_consulting)}</b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">${formatNumber(0)}</StyledTableCell>
                                            <StyledTableCell align="right">${formatNumber(0)}</StyledTableCell>
                                            <StyledTableCell align="right">${formatNumber(0)}</StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                {datareport.additionalservicefee1 ? (
                                                    <div
                                                        className={clsx({
                                                            [classes.transparent]:
                                                                datareport.additionalservicename1 === "",
                                                        })}
                                                    >
                                                        {datareport.additionalservicename1 === "" ? (
                                                            <div style={{ color: "transparent" }}>.</div>
                                                        ) : (
                                                            datareport.additionalservicename1
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee2 ? (
                                                    <div
                                                        className={clsx({
                                                            [classes.transparent]:
                                                                datareport.additionalservicename2 === "",
                                                        })}
                                                    >
                                                        {datareport.additionalservicename2 === "" ? (
                                                            <div style={{ color: "transparent" }}>.</div>
                                                        ) : (
                                                            datareport.additionalservicename2
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee3 ? (
                                                    <div
                                                        className={clsx({
                                                            [classes.transparent]:
                                                                datareport.additionalservicename3 === "",
                                                        })}
                                                    >
                                                        {datareport.additionalservicename3 === "" ? (
                                                            <div style={{ color: "transparent" }}>.</div>
                                                        ) : (
                                                            datareport.additionalservicename3
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">
                                                {datareport.additionalservicefee1 ? (
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getTaxableAmount(
                                                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                                (datareport.additionalservicefee1 || 0) *
                                                                datareport.taxrate
                                                            )
                                                            : formatNumber(
                                                                (datareport.additionalservicefee1 || 0) *
                                                                datareport.taxrate
                                                            )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee2 ? (
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getTaxableAmount(
                                                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                                (datareport.additionalservicefee2 || 0) *
                                                                datareport.taxrate
                                                            )
                                                            : formatNumber(
                                                                (datareport.additionalservicefee2 || 0) *
                                                                datareport.taxrate
                                                            )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee3 ? (
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getTaxableAmount(
                                                                datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                                (datareport.additionalservicefee3 || 0) *
                                                                datareport.taxrate
                                                            )
                                                            : formatNumber(
                                                                (datareport.additionalservicefee3 || 0) *
                                                                datareport.taxrate
                                                            )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {datareport.additionalservicefee1 ? (
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getIgv(
                                                                datareport.igv,
                                                                (datareport.additionalservicefee1 || 0) *
                                                                datareport.taxrate
                                                            )
                                                            : "0.00"}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee2 ? (
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getIgv(
                                                                datareport.igv,
                                                                (datareport.additionalservicefee2 || 0) *
                                                                datareport.taxrate
                                                            )
                                                            : "0.00"}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee3 ? (
                                                    <div>
                                                        $
                                                        {datareport.taxrate !== 1
                                                            ? getIgv(
                                                                datareport.igv,
                                                                (datareport.additionalservicefee3 || 0) *
                                                                datareport.taxrate
                                                            )
                                                            : "0.00"}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {datareport.additionalservicefee1 ? (
                                                    <div>
                                                        $
                                                        {formatNumber(
                                                            (datareport.additionalservicefee1 || 0) * datareport.taxrate
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee2 ? (
                                                    <div>
                                                        $
                                                        {formatNumber(
                                                            (datareport.additionalservicefee2 || 0) * datareport.taxrate
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                                {datareport.additionalservicefee3 ? (
                                                    <div>
                                                        $
                                                        {formatNumber(
                                                            (datareport.additionalservicefee3 || 0) * datareport.taxrate
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ color: "transparent" }}>.</div>
                                                )}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{t(langKeys.periodamount)}</b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">
                                                $
                                                {datareport.taxrate !== 1
                                                    ? getTaxableAmount(
                                                        datareport.taxrate ? datareport.taxrate - 1 : 0,
                                                        datareport.totalcharge || 0
                                                    )
                                                    : formatNumber(datareport.totalcharge)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                $
                                                {datareport.taxrate !== 1
                                                    ? getIgv(datareport.igv, datareport.totalcharge)
                                                    : "0.00"}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                ${formatNumber(datareport.totalcharge || 0)}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div style={{ paddingTop: 20, paddingBottom: 20, fontWeight: "bold", fontSize: "1.5em" }}>
                                {t(langKeys.servicedata)}
                            </div>
                            <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">
                                                <div>{datareport.clientwhatquantity}</div>
                                                <div>{t(langKeys.billingreport_unique)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <div>{datareport.clientquantity - datareport.clientwhatquantity}</div>
                                                <div>{t(langKeys.billingreport_other)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <div>{datareport.conversationquantity}</div>
                                                <div>{t(langKeys.billingreport_conversation)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <div>{datareport.interactionquantity}</div>
                                                <div>{t(langKeys.billingreport_interaction)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <div>{datareport.supervisorquantity}</div>
                                                <div>{t(langKeys.billingreport_supervisor)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <div>{datareport.asesorquantity}</div>
                                                <div>{t(langKeys.billingreport_agent)}</div>
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                    {!datareport && (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldView className="col-6" label={""} value={t(langKeys.billingperiodnotfound)} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Fragment>
    );
};

const IDPAYMENTS = "IDPAYMENTS";
const Payments: React.FC<{
    dataCorp: any;
    dataOrg: any;
    setCustomSearch(
        value: React.SetStateAction<{ year: number; month: number; corpid: number; orgid: number; totalize: number }>
    ): void;
}> = ({ dataCorp, dataOrg, setCustomSearch }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main.mainData);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        corpid: user?.corpid ?? 0,
        currency: "",
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        orgid: 0,
        paymentstatus: "",
        year: String(new Date().getFullYear()),
    });

    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [disableSearch, setdisableSearch] = useState(false);
    const [modalRowSelect, setModalRowSelect] = useState<Dictionary | null>(null);
    const [modalRowSend, setModalRowSend] = useState(false);
    const [rowSelect, setRowSelect] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitRefresh, setWaitRefresh] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const dataPayment = [
        { value: "PENDING", description: t(langKeys.PENDING) },
        { value: "PAID", description: t(langKeys.PAID) },
        { value: "NONE", description: t(langKeys.NONE) },
    ];

    const fetchData = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const search = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const refreshInvoice = (data: any) => {
        const callback = () => {
            dispatch(execute(invoiceRefresh(data)));
            dispatch(showBackdrop(true));
            setWaitRefresh(true);
        };

        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_invoicerefresh),
                callback,
            })
        );
    };

    useEffect(() => {
        fetchData();

        dispatch(
            setMemoryTable({
                id: IDPAYMENTS,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (rowSelect) {
            if (rowSelected) {
                setCustomSearch((prev) => ({
                    ...prev,
                    corpid: rowSelected?.corpid,
                    month: rowSelected?.month,
                    orgid: rowSelected?.orgid,
                    totalize: rowSelected?.orgid === 0 ? 1 : 2,
                    year: rowSelected?.year,
                }));
                setRowSelect(false);
            }
        }
    }, [rowSelected, rowSelect]);

    useEffect(() => {
        if (modalRowSend) {
            setViewSelected("view-2");
            setRowSelected(modalRowSelect);
            setModalRowSend(false);
        }
    }, [modalRowSelect, modalRowSend]);

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({ show: true, severity: "success", message: t(langKeys.invoicesuccessfullyvoided) })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeRes.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeRes.code ?? "error_unexpected_error", {
                            module: t(langKeys.organization_plural).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave]);

    useEffect(() => {
        if (waitRefresh) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeRes.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeRes.code ?? "error_unexpected_error", {
                            module: t(langKeys.organization_plural).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitRefresh(false);
            }
        }
    }, [executeRes, waitRefresh]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataInvoice(
                mainResult.data
                    .filter((x) => x.invoicestatus !== "CANCELED")
                    ?.map((x) => ({
                        ...x,
                        hasreportcolumn: x.hasreport ? t(langKeys.toreport) : t(langKeys.none),
                        invoicestatuscolumn: t(x.invoicestatus),
                        paymentstatuscolumn: t(x.paymentstatus),
                        urlcdrcolumn: x.urlcdr ? t(langKeys.cdrdocumentopen) : t(langKeys.pendingpayment),
                        urlxmlcolumn: x.urlxml ? t(langKeys.xmldocumentopen) : t(langKeys.pendingpayment),
                        docnumbercolumn:
                            x.serie && x.correlative
                                ? x.serie + "-" + x.correlative.toString().padStart(8, "0")
                                : "X000-00000000",
                    }))
            );
        }
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "orgid",
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original;

                    let showPayButton = false;
                    let showUpdateButton = false;

                    if (
                        !(
                            row.invoicestatus === "CANCELED" ||
                            row.invoicestatus === "ERROR" ||
                            row.invoicestatus === "PENDING" ||
                            row.paymentstatus !== "PENDING" ||
                            row.totalamount <= 0
                        )
                    ) {
                        showPayButton = true;
                    }

                    if (
                        row.hasreport &&
                        row.invoicestatus !== "INVOICED" &&
                        row.paymentstatus !== "PAID" &&
                        user?.roledesc === "SUPERADMIN"
                    ) {
                        showUpdateButton = true;
                    }

                    return (
                        <>
                            {showPayButton && (
                                <Button
                                    color="primary"
                                    startIcon={<PaymentIcon style={{ color: "white" }} />}
                                    style={{ backgroundColor: "#55BD84", marginRight: "10px" }}
                                    variant="contained"
                                    onClick={() => {
                                        setModalRowSelect(row);
                                        setModalRowSend(true);
                                    }}
                                >
                                    {t(langKeys.pay)}
                                </Button>
                            )}
                            {showUpdateButton && (
                                <Button
                                    color="primary"
                                    startIcon={<Refresh style={{ color: "white" }} />}
                                    style={{ backgroundColor: "#55BD84" }}
                                    variant="contained"
                                    onClick={() => {
                                        refreshInvoice(row);
                                    }}
                                >
                                    {t(langKeys.refresh)}
                                </Button>
                            )}
                        </>
                    );
                },
            },
            {
                accessor: "corpdesc",
                Header: t(langKeys.corporation),
            },
            {
                accessor: "orgdesc",
                Header: t(langKeys.organization),
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
                accessor: "currency",
                Header: t(langKeys.currency),
            },
            {
                accessor: "totalamount",
                Header: t(langKeys.totalamount),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { totalamount } = props.cell.row.original;
                    return formatNumber(totalamount || 0);
                },
            },
            {
                accessor: "invoicestatuscolumn",
                Header: t(langKeys.invoicestatus),
            },
            {
                accessor: "paymentstatuscolumn",
                Header: t(langKeys.paymentstatus),
            },
            {
                accessor: "hasreportcolumn",
                Header: t(langKeys.gotoreport),
                Cell: (props: any) => {
                    const selectedrow = props.cell.row.original;
                    const hasreport = selectedrow?.hasreport;
                    if (hasreport) {
                        return (
                            <Fragment>
                                <div>
                                    {
                                        <span
                                            onClick={() => {
                                                setRowSelected(selectedrow);
                                                setRowSelect(true);
                                            }}
                                            style={{
                                                color: "blue",
                                                cursor: "pointer",
                                                display: "block",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            {t(langKeys.toreport)}
                                        </span>
                                    }
                                </div>
                            </Fragment>
                        );
                    } else {
                        return t(langKeys.none);
                    }
                },
            },
            {
                accessor: "docnumbercolumn",
                Header: t(langKeys.billingvoucher),
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber =
                        (props.cell.row.original.serie ? props.cell.row.original.serie : "X000") +
                        "-" +
                        (props.cell.row.original.correlative
                            ? props.cell.row.original.correlative.toString().padStart(8, "0")
                            : "00000000");
                    return (
                        <Fragment>
                            <div>
                                {urlpdf ? (
                                    <a href={urlpdf} target="_blank" style={{ display: "block" }} rel="noreferrer">
                                        {docnumber}
                                    </a>
                                ) : (
                                    <span style={{ display: "block" }}>{docnumber}</span>
                                )}
                            </div>
                        </Fragment>
                    );
                },
            },
            {
                accessor: "urlxmlcolumn",
                Header: t(langKeys.xmldocument),
                Cell: (props: any) => {
                    const urlxml = props.cell.row.original.urlxml;
                    return (
                        <Fragment>
                            <div>
                                {urlxml ? (
                                    <a href={urlxml} target="_blank" style={{ display: "block" }} rel="noreferrer">
                                        {t(langKeys.xmldocumentopen)}
                                    </a>
                                ) : (
                                    <span style={{ display: "block" }}>{t(langKeys.pendingpayment)}</span>
                                )}
                            </div>
                        </Fragment>
                    );
                },
            },
            {
                accessor: "urlcdrcolumn",
                Header: t(langKeys.cdrdocument),
                Cell: (props: any) => {
                    const urlcdr = props.cell.row.original.urlcdr;
                    return (
                        <Fragment>
                            <div>
                                {urlcdr ? (
                                    <a href={urlcdr} target="_blank" style={{ display: "block" }} rel="noreferrer">
                                        {t(langKeys.cdrdocumentopen)}
                                    </a>
                                ) : (
                                    <span style={{ display: "block" }}>{t(langKeys.pendingpayment)}</span>
                                )}
                            </div>
                        </Fragment>
                    );
                },
            },
        ],
        []
    );

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 140 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 214 }}
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
                                data={dataCorp}
                                label={t(langKeys.corporation)}
                                optionDesc="description"
                                optionValue="corpid"
                                orderbylabel={true}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P", "ADMINISTRADOR LIMADERMA"].includes(
                                    user?.roledesc ?? ""
                                )}
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))
                                }
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                label={t(langKeys.organization)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, orgid: value?.orgid || 0 }))}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                data={dataOrg.filter((e: any) => {
                                    return e.corpid === dataMain.corpid;
                                })}
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataCurrency}
                                label={t(langKeys.currency)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, currency: value?.value || "" }))}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={dataMain.currency}
                                variant="outlined"
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataPayment}
                                label={t(langKeys.paymentstatus)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={dataMain.paymentstatus}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, paymentstatus: value?.value || "" }))
                                }
                            />
                            <Button
                                color="primary"
                                disabled={mainResult.loading || disableSearch}
                                onClick={search}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={dataInvoice}
                    download={true}
                    filterGeneral={false}
                    loading={mainResult.loading}
                    register={false}
                    initialPageIndex={
                        IDPAYMENTS === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDPAYMENTS === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDPAYMENTS === memoryTable.id ? (memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize) : 20
                    }
                />
            </div>
        );
    } else {
        return <PaymentsDetail fetchData={fetchData} data={rowSelected} setViewSelected={setViewSelected} />;
    }
};

const PaymentsDetail: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiSelector = useSelector((state) => state.culqi.request);
    const exchangeRequest = useSelector((state) => state.culqi.requestGetExchangeRate);
    const mainResult = useSelector((state) => state.main);
    const multiResult = useSelector((state) => state.main.multiDataAux);
    const user = useSelector((state) => state.login.validateToken.user);

    const [cardList, setCardList] = useState<any>([]);
    const [comments, setComments] = useState("");
    const [commentsError, setCommentsError] = useState("");
    const [detractionAlert, setDetractionAlert] = useState(false);
    const [detractionAmount, setDetractionAmount] = useState(0);
    const [favoriteCardCode, setFavoriteCardCode] = useState("");
    const [favoriteCardId, setFavoriteCardId] = useState(0);
    const [favoriteCardNumber, setFavoriteCardNumber] = useState("");
    const [override, setOverride] = useState(false);
    const [paymentCardCode, setPaymentCardCode] = useState("");
    const [paymentCardId, setPaymentCardId] = useState(0);
    const [paymentDisabled, setPaymentDisabled] = useState(false);
    const [paymentType, setPaymentType] = useState("FAVORITE");
    const [publicKey, setPublicKey] = useState("");
    const [purchaseOrder, setPurchaseOrder] = useState("");
    const [purchaseOrderError, setPurchaseOrderError] = useState("");
    const [showCulqi, setShowCulqi] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalPay, setTotalPay] = useState(0);
    const [waitPay, setWaitPay] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const dataPayment = [
        { val: "FAVORITE", description: t(langKeys.paymentfavorite) },
        { val: "CARD", description: t(langKeys.paymentcard) },
        { val: "CULQI", description: t(langKeys.paymentculqi) },
    ];

    const handlePay = () => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(
                charge({
                    comments: comments,
                    corpid: data?.corpid,
                    invoiceid: data?.invoiceid,
                    iscard: true,
                    metadata: {},
                    orgid: data?.orgid,
                    override: override,
                    paymentcardcode: paymentCardCode,
                    paymentcardid: paymentCardId,
                    purchaseorder: purchaseOrder,
                    token: null,
                    settings: {
                        amount: Math.round((totalPay * 100 + Number.EPSILON) * 100) / 100,
                        currency: data?.currency,
                        description: data?.productdescription,
                        title: data?.description,
                    },
                })
            );
            setWaitPay(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_payment),
                visible: true,
            })
        );
    };

    useEffect(() => {
        dispatch(getCollection(getAppsettingInvoiceSel()));
        dispatch(getExchangeRate(null));
        dispatch(getMultiCollectionAux([listPaymentCard({ corpid: user?.corpid ?? 0, id: 0, orgid: 0 })]));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    }, []);

    useEffect(() => {
        const indexCard = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_PAYMENTCARD_LST");

        if (indexCard > -1) {
            setCardList({
                loading: false,
                data:
                    multiResult.data[indexCard] && multiResult.data[indexCard].success
                        ? multiResult.data[indexCard].data
                        : [],
            });
        }
    }, [multiResult]);

    useEffect(() => {
        if (cardList) {
            if (cardList.data) {
                if (cardList.data.length > 0) {
                    let favoriteCard = cardList.data.find((o: { favorite: boolean }) => o.favorite === true);

                    if (favoriteCard) {
                        setFavoriteCardCode(favoriteCard.cardcode);
                        setFavoriteCardId(favoriteCard.paymentcardid);
                        setFavoriteCardNumber(favoriteCard.cardnumber);
                        setPaymentCardCode(favoriteCard.cardcode);
                        setPaymentCardId(favoriteCard.paymentcardid);
                    }
                }
            }
        }
    }, [cardList]);

    useEffect(() => {
        if (paymentType) {
            if (paymentType === "FAVORITE") {
                setPaymentCardId(favoriteCardId);
                setPaymentCardCode(favoriteCardCode);
            }

            if (paymentType === "CARD" || paymentType === "CULQI") {
                setPaymentCardId(0);
                setPaymentCardCode("");
            }
        }
    }, [paymentType]);

    useEffect(() => {
        if (waitPay) {
            if (!culqiSelector.loading && culqiSelector.data) {
                dispatch(
                    showSnackbar({
                        message: "" + t(culqiSelector.message ?? langKeys.success),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                dispatch(resetCharge());
                setWaitPay(false);
                handleCulqiSuccess && handleCulqiSuccess();
            } else if (culqiSelector.error) {
                dispatch(
                    showSnackbar({
                        message: "" + t(culqiSelector.message ?? langKeys.error_cos_unexpected),
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                dispatch(resetCharge());
                setWaitPay(false);
            }
        }
    }, [culqiSelector, waitPay]);

    useEffect(() => {
        if (waitSave) {
            if (!mainResult.mainData.loading && !exchangeRequest.loading) {
                dispatch(showBackdrop(false));

                if (mainResult.mainData.data) {
                    if (mainResult.mainData.data[0]) {
                        let appsetting = mainResult.mainData.data[0];
                        let country = data?.orgcountry || data?.corpcountry;
                        let doctype = data?.orgdoctype || data?.corpdoctype;

                        if (country && doctype) {
                            if (country === "PE" && doctype === "6") {
                                let compareamount = data?.totalamount || 0;

                                if (data?.currency === "USD") {
                                    compareamount = compareamount * (exchangeRequest?.exchangerate ?? 0);
                                }

                                if (compareamount > appsetting.detractionminimum) {
                                    setTotalPay(
                                        Math.round(
                                            ((data?.totalamount || 0) -
                                                (data?.totalamount || 0) * (appsetting.detraction || 0) +
                                                Number.EPSILON) *
                                            100
                                        ) / 100
                                    );
                                    setTotalAmount(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                    setOverride(true);
                                    setShowCulqi(true);
                                    setDetractionAlert(true);
                                    setDetractionAmount(
                                        Math.round(((appsetting.detraction || 0) * 100 + Number.EPSILON) * 100) / 100
                                    );
                                } else {
                                    setTotalPay(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                    setTotalAmount(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                    setShowCulqi(true);
                                }
                            } else {
                                setTotalPay(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                setTotalAmount(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                setShowCulqi(true);
                            }
                        }

                        setPublicKey(appsetting.publickey);
                    }
                }
            }
        }
    }, [mainResult, exchangeRequest, waitSave]);

    const handleCulqiSuccess = () => {
        setViewSelected("view-1");
        fetchData && fetchData();
    };

    const handlePurchaseOrder = (value: any) => {
        setPurchaseOrder(value);
        if (value.length > 15) {
            setPurchaseOrderError(t(langKeys.validation15char));
            setPaymentDisabled(true);
        } else {
            setPurchaseOrderError("");
            if (comments.length <= 150) {
                setPaymentDisabled(false);
            }
        }
    };

    const handleComments = (value: any) => {
        setComments(value);
        if (value.length > 150) {
            setCommentsError(t(langKeys.validation150char));
            setPaymentDisabled(true);
        } else {
            setCommentsError("");
            if (purchaseOrder.length <= 15) {
                setPaymentDisabled(false);
            }
        }
    };

    const paymentBread = [
        { id: "view-1", name: t(langKeys.payment) },
        { id: "view-2", name: t(langKeys.paymentdetail) },
    ];

    return (
        <div style={{ width: "100%" }}>
            <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={paymentBread}
                            handleClick={(id) => {
                                setViewSelected(id);
                                fetchData();
                            }}
                        />
                        <TitleDetail title={data?.description} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                            onClick={() => {
                                setViewSelected("view-1");
                                fetchData && fetchData();
                            }}
                        >
                            {t(langKeys.back)}
                        </Button>
                        {data?.paymentstatus === "PENDING" &&
                            (data?.invoicestatus === "INVOICED" || data?.invoicestatus === "DRAFT") &&
                            paymentType === "CULQI" &&
                            publicKey &&
                            showCulqi && (
                                <CulqiModal
                                    amount={Math.round((totalPay * 100 + Number.EPSILON) * 100) / 100}
                                    buttontitle={t(langKeys.proceedpayment)}
                                    comments={comments}
                                    corpid={data?.corpid}
                                    currency={data?.currency}
                                    description={data?.productdescription}
                                    disabled={paymentDisabled}
                                    invoiceid={data?.invoiceid}
                                    orgid={data?.orgid}
                                    override={override}
                                    publickey={publicKey}
                                    purchaseorder={purchaseOrder}
                                    successmessage={t(langKeys.culqipaysuccess)}
                                    title={data?.description}
                                    totalpay={totalPay}
                                    type="CHARGE"
                                    callbackOnSuccess={() => {
                                        handleCulqiSuccess();
                                    }}
                                ></CulqiModal>
                            )}
                        {data?.paymentstatus === "PENDING" &&
                            (data?.invoicestatus === "INVOICED" || data?.invoicestatus === "DRAFT") &&
                            (paymentType === "FAVORITE" || paymentType === "CARD") && (
                                <Button
                                    color="primary"
                                    disabled={paymentDisabled || !paymentCardId || !paymentCardCode}
                                    onClick={handlePay}
                                    startIcon={<AttachMoneyIcon color="secondary" />}
                                    style={{ backgroundColor: "#55BD84" }}
                                    type="button"
                                    variant="contained"
                                >
                                    {t(langKeys.proceedpayment)}
                                </Button>
                            )}
                    </div>
                </div>
                <div style={{ backgroundColor: "white", padding: 16 }}>
                    <div className="row-zyx">
                        <FieldView className={classes.section} label={""} value={t(langKeys.paymentmethod)} />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataPayment}
                            label={t(langKeys.paymentmethodtype)}
                            optionDesc="description"
                            optionValue="val"
                            orderbylabel={true}
                            valueDefault={paymentType}
                            onChange={(value) => {
                                setPaymentType(value?.val || 0);
                            }}
                        />
                        {paymentType === "CARD" && (
                            <FieldSelect
                                className="col-6"
                                label={t(langKeys.paymentmethodcard)}
                                loading={cardList.loading}
                                optionDesc="cardnumber"
                                optionValue="paymentcardid"
                                orderbylabel={true}
                                valueDefault={paymentCardId}
                                data={
                                    cardList.data
                                        ? cardList.data.filter((e: { favorite: boolean }) => e.favorite !== true)
                                        : []
                                }
                                onChange={(value) => {
                                    setPaymentCardCode(value?.cardcode || "");
                                    setPaymentCardId(value?.paymentcardid || 0);
                                }}
                            />
                        )}
                        {paymentType === "FAVORITE" && (
                            <FieldEdit
                                className="col-6"
                                disabled={true}
                                label={t(langKeys.paymentmethodcard)}
                                valueDefault={favoriteCardNumber}
                            />
                        )}
                    </div>
                    <div className="row-zyx">
                        <FieldView className={classes.section} label={""} value={t(langKeys.paymentinformation)} />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-4"
                            label={t(langKeys.servicedescription)}
                            value={data?.productdescription || ""}
                        />
                        <FieldView
                            className="col-4"
                            label={t(langKeys.totalamount)}
                            value={(data?.currency === "USD" ? "$" : "S/") + formatNumber(totalAmount || 0)}
                        />
                        <FieldView
                            className="col-4"
                            label={t(langKeys.totaltopay)}
                            value={(data?.currency === "USD" ? "$" : "S/") + formatNumber(totalPay || 0)}
                        />
                    </div>
                    {detractionAlert && (
                        <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={""}
                                value={
                                    t(langKeys.detractionnotepay1) +
                                    `${detractionAmount}` +
                                    t(langKeys.detractionnotepay2)
                                }
                            />
                        </div>
                    )}
                    <div className="row-zyx">
                        <FieldView className={classes.section} label={""} value={t(langKeys.additional_information)} />
                    </div>
                    {data?.invoicestatus === "DRAFT" && (
                        <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={""}
                                value={t(langKeys.additionalinformation2)}
                            />
                        </div>
                    )}
                    <div className="row-zyx">
                        {data?.invoicestatus === "DRAFT" && (
                            <FieldEdit
                                className="col-12"
                                error={purchaseOrderError}
                                label={t(langKeys.purchaseorder)}
                                onChange={(value) => handlePurchaseOrder(value)}
                                valueDefault={purchaseOrder}
                            />
                        )}
                        {data?.invoicestatus !== "DRAFT" && (
                            <FieldView
                                className="col-12"
                                label={t(langKeys.purchaseorder)}
                                value={data?.purchaseorder}
                            />
                        )}
                    </div>
                    <div className="row-zyx">
                        {data?.invoicestatus === "DRAFT" && (
                            <FieldEdit
                                className="col-12"
                                error={commentsError}
                                label={t(langKeys.comments)}
                                onChange={(value) => handleComments(value)}
                                valueDefault={comments}
                            />
                        )}
                        {data?.invoicestatus !== "DRAFT" && (
                            <FieldView label={t(langKeys.comments)} value={data?.comments} className="col-12" />
                        )}
                    </div>
                    {data?.invoicestatus === "DRAFT" && (
                        <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={""}
                                value={t(langKeys.additionalinformation1)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const IDBILLING = "IDBILLING";
const Billing: React.FC<{ dataCorp: any; dataOrg: any }> = ({ dataCorp, dataOrg }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main.mainData);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const multiResult = useSelector((state) => state.main.multiData);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        corpid: user?.corpid ?? 0,
        currency: "",
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        orgid: 0,
        paymentstatus: "",
        year: String(new Date().getFullYear()),
    });

    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [disableSearch, setdisableSearch] = useState(false);
    const [insertexcel, setinsertexcel] = useState(false);
    const [isCreditNote, setIsCreditNote] = useState(false);
    const [isRegularize, setIsRegularize] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalData, setOpenModalData] = useState<Dictionary | null>(null);
    const [operationName, setOperationName] = useState("");
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveImport, setwaitSaveImport] = useState(false);

    const dataPayment = [
        { value: "PENDING", description: t(langKeys.PENDING) },
        { value: "PAID", description: t(langKeys.PAID) },
        { value: "NONE", description: t(langKeys.NONE) },
    ];

    function isValidDate(dateString: string) {
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        return RegExp(regEx).exec(`${dateString}`) != null;
    }

    const fetchData = () => dispatch(getCollection(selInvoice(dataMain)));

    const getDocumentType = (documenttype: string) => {
        switch (documenttype) {
            case "0":
                return "billingfield_billingno";
            case "1":
                return "billingfield_billingdni";
            case "4":
                return "billingfield_billingextra";
            case "6":
                return "billingfield_billingruc";
            case "7":
                return "billingfield_billingpass";
            default:
                return "pendingpayment";
        }
    };

    useEffect(() => {
        fetchData();

        dispatch(
            setMemoryTable({
                id: IDBILLING,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
            dispatch(
                getMultiCollection([
                    getCorpSel(user?.roledesc === "ADMINISTRADOR" ? user?.corpid : 0),
                    getMeasureUnit(),
                    getValuesFromDomain("TYPECREDIT", null, user?.orgid, user?.corpid),
                    getAppsettingInvoiceSel(),
                ])
            );
        };
    }, []);

    useEffect(() => {
        setdisableSearch(dataMain.year === "");
    }, [dataMain]);

    useEffect(() => {
        if (!openModal) {
            if (waitSave) {
                if (!executeRes.loading && !executeRes.error) {
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(langKeys.deleteinvoicesuccess) })
                    );
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1");
                    fetchData && fetchData();
                } else if (executeRes.error) {
                    dispatch(
                        showSnackbar({
                            severity: "error",
                            show: true,
                            message: t(executeRes.code ?? "error_unexpected_error", {
                                module: t(langKeys.organization_plural).toLocaleLowerCase(),
                            }),
                        })
                    );
                    dispatch(showBackdrop(false));
                    setWaitSave(false);
                }
            }
        }
    }, [executeRes, waitSave]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataInvoice(
                mainResult.data.map((x) => ({
                    ...x,
                    invoicestatuscolumn: t(x.invoicestatus),
                    invoicetypecolumn: t(getInvoiceType(x.invoicetype)),
                    paymentstatuscolumn: t(x.paymentstatus),
                    receiverdocnumcolumn: x.receiverdocnum ? x.receiverdocnum : t(langKeys.pendingpayment),
                    receiverdoctypecolumn: t(getDocumentType(x.receiverdoctype)),
                    receiverbusinessnamecolumn: x.receiverbusinessname
                        ? x.receiverbusinessname
                        : t(langKeys.pendingpayment),
                    seriecolumn:
                        x.serie && x.correlative ? x.serie + "-" + x.correlative.toString().padStart(8, "0") : null,
                }))
            );
        }
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "corpid",
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    if (
                        (row.hasreport === false || row.hasreport === true) &&
                        row.invoicestatus !== "INVOICED" &&
                        row.paymentstatus !== "PAID"
                    ) {
                        return <TemplateIcons deleteFunction={() => handleDelete(row)} />;
                    } else {
                        if (row.invoicestatus !== "INVOICED" || row.type === "CREDITNOTE") {
                            return null;
                        } else {
                            return (
                                <TemplateIcons
                                    extraFunction={() => handleCreditNote(row)}
                                    extraOption={t(langKeys.generatecreditnote)}
                                />
                            );
                        }
                    }
                },
            },
            {
                accessor: "invoiceid",
                Header: t(langKeys.invoiceid),
            },
            {
                accessor: "corpdesc",
                Header: t(langKeys.corporation),
            },
            {
                accessor: "orgdesc",
                Header: t(langKeys.organization),
            },
            {
                accessor: "receiverdoctypecolumn",
                Header: t(langKeys.billingclienttype),
            },
            {
                accessor: "receiverdocnumcolumn",
                Header: t(langKeys.documentnumber),
            },
            {
                accessor: "receiverbusinessnamecolumn",
                Header: t(langKeys.businessname),
            },
            {
                accessor: "year",
                Header: t(langKeys.invoice_serviceyear),
            },
            {
                accessor: "month",
                Header: t(langKeys.invoice_servicemonth),
            },
            {
                accessor: "invoicestatuscolumn",
                Header: t(langKeys.invoicestatus),
            },
            {
                accessor: "paymentstatuscolumn",
                Header: t(langKeys.paymentstatus),
            },
            {
                accessor: "invoicetypecolumn",
                Header: t(langKeys.documenttype),
            },
            {
                accessor: "seriecolumn",
                Header: t(langKeys.billingvoucher),
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber =
                        props.cell.row.original.serie && props.cell.row.original.correlative
                            ? props.cell.row.original.serie +
                            "-" +
                            props.cell.row.original.correlative.toString().padStart(8, "0")
                            : null;
                    return (
                        <Fragment>
                            <div>
                                {urlpdf ? (
                                    <a
                                        href={urlpdf}
                                        rel="noreferrer"
                                        style={{ display: "block" }}
                                        target="_blank"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        {docnumber}
                                    </a>
                                ) : (
                                    <span style={{ display: "block" }}>{docnumber}</span>
                                )}
                            </div>
                        </Fragment>
                    );
                },
            },
            {
                accessor: "description",
                Header: t(langKeys.description),
            },
            {
                accessor: "invoicedate",
                Header: t(langKeys.invoicedate),
                Cell: (props: any) => {
                    const { invoicedate } = props.cell.row.original;
                    return invoicedate || null;
                },
            },
            {
                accessor: "expirationdate",
                Header: t(langKeys.expirationdate),
                Cell: (props: any) => {
                    const { expirationdate } = props.cell.row.original;
                    return expirationdate || null;
                },
            },
            {
                accessor: "currency",
                Header: t(langKeys.currency),
            },
            {
                accessor: "subtotal",
                Header: t(langKeys.taxbase),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { subtotal } = props.cell.row.original;
                    return formatNumber(subtotal || 0);
                },
            },
            {
                accessor: "taxes",
                Header: t(langKeys.billingtax),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { taxes } = props.cell.row.original;
                    return formatNumber(taxes || 0);
                },
            },
            {
                accessor: "totalamount",
                Header: t(langKeys.totalamount),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { totalamount } = props.cell.row.original;
                    return formatNumber(totalamount || 0);
                },
            },
            {
                accessor: "commentcontent",
                Header: t(langKeys.comments),
                Cell: (props: any) => {
                    const { commentcontent } = props.cell.row.original;
                    const rowdata = props.cell.row.original;
                    if (commentcontent) {
                        return (
                            <Fragment>
                                <div style={{ display: "inline-block" }}>
                                    {(commentcontent || "").substring(0, 50)}...{" "}
                                    <a
                                        rel="noreferrer"
                                        style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openInvoiceComment(rowdata);
                                        }}
                                    >
                                        {t(langKeys.seeMore)}
                                    </a>
                                </div>
                            </Fragment>
                        );
                    } else {
                        return (
                            <Fragment>
                                <div style={{ display: "inline-block" }}>
                                    <a
                                        rel="noreferrer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openInvoiceComment(rowdata);
                                        }}
                                        style={{
                                            color: "blue",
                                            cursor: "pointer",
                                            display: "block",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {t(langKeys.seeMore)}
                                    </a>
                                </div>
                            </Fragment>
                        );
                    }
                },
            },
        ],
        []
    );

    useEffect(() => {
        if (!openModal) {
            if (waitSaveImport) {
                if (!executeRes.loading && !executeRes.error) {
                    dispatch(
                        showSnackbar({
                            message: t(insertexcel ? langKeys.successful_import : langKeys.successful_delete),
                            severity: "success",
                            show: true,
                        })
                    );
                    dispatch(showBackdrop(false));
                    fetchData && fetchData();
                    setwaitSaveImport(false);
                    setinsertexcel(false);
                } else if (executeRes.error) {
                    dispatch(
                        showSnackbar({
                            severity: "error",
                            show: true,
                            message: t(executeRes.code ?? "error_unexpected_error", {
                                module: t(langKeys.tipification).toLocaleLowerCase(),
                            }),
                        })
                    );
                    dispatch(showBackdrop(false));
                    setwaitSaveImport(false);
                }
            }
        }
    }, [executeRes, waitSaveImport]);

    const handleTemplate = () => {
        const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_CORP_SEL");
        const indexOrg = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_ORG_SEL");

        const receiverdoctype = [
            { value: 0, description: "NO DOMICILIADO" },
            { value: 1, description: "DNI" },
            { value: 4, description: "CARNE EXT." },
            { value: 6, description: "RUC" },
            { value: 7, description: "PASAPORTE" },
        ];

        const invoicetype = [
            { value: "01", description: "FACTURA" },
            { value: "03", description: "BOLETA" },
        ];

        let corplist =
            multiResult.data[indexCorp] && multiResult.data[indexCorp].success ? multiResult.data[indexCorp].data : [];

        let orglist =
            multiResult.data[indexOrg] && multiResult.data[indexOrg].success ? multiResult.data[indexOrg].data : [];

        const data = [
            corplist.reduce((a, d) => ({ ...a, [d.corpid]: t(`${d.description}`) }), {}),
            orglist.reduce((a, d) => ({ ...a, [d.orgid]: t(`${d.orgdesc}`) }), {}),
            dataYears.reduce((a, d) => ({ ...a, [d?.value]: t(`${d?.value}`) }), {}),
            dataMonths.reduce((a, d) => ({ ...a, [+d.val]: t(`${+d.val}`) }), {}),
            {},
            receiverdoctype.reduce((a, d) => ({ ...a, [d.value]: t(`${d.description}`) }), {}),
            {},
            {},
            {},
            { "CODIGO DE PAIS": "CODIGO DE PAIS" },
            {},
            invoicetype.reduce((a, d) => ({ ...a, [d.value]: t(`${d.description}`) }), {}),
            {},
            {},
            {},
            {},
            { DRAFT: "DRAFT", INVOICED: "INVOICED", ERROR: "ERROR" },
            { PENDING: "PENDING", PAID: "PAID" },
            {},
            {},
            { CARD: "CARD", REGISTEREDCARD: "REGISTEREDCARD" },
            {},
            {},
            dataCurrency.reduce((a, d) => ({ ...a, [d.value]: t(`${d.description}`) }), {}),
            {},
            {},
            {},
            {},
            {},
            {
                typecredit_alcontado: "typecredit_alcontado",
                typecredit_15: "typecredit_15",
                typecredit_30: "typecredit_30",
                typecredit_45: "typecredit_45",
                typecredit_60: "typecredit_60",
                typecredit_90: "typecredit_90",
            },
        ];

        const header = [
            "corpid",
            "orgid",
            "year",
            "month",
            "description",
            "receiverdoctype",
            "receiverdocnum",
            "receiverbusinessname",
            "receiverfiscaladdress",
            "receivercountry",
            "receivermail",
            "invoicetype",
            "serie",
            "correlative",
            "invoicedate",
            "expirationdate",
            "invoicestatus",
            "paymentstatus",
            "paymentdate",
            "paidby",
            "paymenttype",
            "totalamount",
            "exchangerate",
            "currency",
            "urlcdr",
            "urlpdf",
            "urlxml",
            "purchaseorder",
            "comments",
            "credittype",
        ];

        exportExcel(`${t(langKeys.template)} - ${t(langKeys.invoice)}`, templateMaker(data, header));
    };

    const importCSV = async (files: any[]) => {
        setinsertexcel(true);
        const file = files[0];
        if (file) {
            const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_CORP_SEL");

            let corplist =
                multiResult.data[indexCorp] && multiResult.data[indexCorp].success
                    ? multiResult.data[indexCorp].data
                    : [];

            const receiverdoctypeList = [
                { value: 0, description: "NO DOMICILIADO" },
                { value: 1, description: "DNI" },
                { value: 4, description: "CARNE EXT." },
                { value: 6, description: "RUC" },
                { value: 7, description: "PASAPORTE" },
            ];

            const invoicetypeList = [
                { value: "01", description: "FACTURA" },
                { value: "03", description: "BOLETA" },
            ];

            let data: any = (await uploadExcel(file)) as any[];
            let errorcolumn = null;
            let errorcount = 1;
            let errorrow = 1;

            for (const dataobject of data) {
                if (["", null, undefined].includes(dataobject.description)) {
                    errorcolumn = t(langKeys.description);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.receiverdocnum)) {
                    errorcolumn = t(langKeys.receiverdocnum);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.receiverbusinessname)) {
                    errorcolumn = t(langKeys.receiverbusinessname);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.receiverfiscaladdress)) {
                    errorcolumn = t(langKeys.receiverfiscaladdress);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.receivercountry)) {
                    errorcolumn = t(langKeys.receivercountry);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.receivermail)) {
                    errorcolumn = t(langKeys.receivermail);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.invoicestatus)) {
                    errorcolumn = t(langKeys.invoicestatus);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.paymentstatus)) {
                    errorcolumn = t(langKeys.paymentstatus);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.totalamount)) {
                    errorcolumn = t(langKeys.totalamount);
                    errorrow = errorcount;
                }

                if (["", null, undefined].includes(dataobject.exchangerate)) {
                    errorcolumn = t(langKeys.exchangerate);
                    errorrow = errorcount;
                }

                if (!invoicetypeList.find((data) => data.value === dataobject.invoicetype)) {
                    errorcolumn = t(langKeys.invoicetype);
                    errorrow = errorcount;
                }

                if (!receiverdoctypeList.find((data) => data.value === dataobject.receiverdoctype)) {
                    errorcolumn = t(langKeys.receiverdoctype);
                    errorrow = errorcount;
                }

                if (!corplist.find((data) => data.corpid === dataobject.corpid)) {
                    errorcolumn = t(langKeys.corporation);
                    errorrow = errorcount;
                }

                if (!dataYears.find((data) => data.value === `${dataobject.year}`)) {
                    errorcolumn = t(langKeys.year);
                    errorrow = errorcount;
                }

                if (!dataMonths.find((data) => data.val === `${dataobject.month}`.padStart(2, "0"))) {
                    errorcolumn = t(langKeys.month);
                    errorrow = errorcount;
                }

                if (!dataCurrency.find((data) => data.value === dataobject.currency)) {
                    errorcolumn = t(langKeys.currency);
                    errorrow = errorcount;
                }

                if (dataobject.receivercountry) {
                    if (`${dataobject.receivercountry}`.length > 3) {
                        errorcolumn = t(langKeys.receivercountry);
                        errorrow = errorcount;
                    }
                }

                if (dataobject.invoicedate) {
                    if (!isValidDate(dataobject.invoicedate)) {
                        errorcolumn = t(langKeys.invoicedate);
                        errorrow = errorcount;
                    }
                }

                if (dataobject.expirationdate) {
                    if (!isValidDate(dataobject.expirationdate)) {
                        errorcolumn = t(langKeys.expirationdate);
                        errorrow = errorcount;
                    }
                }

                if (dataobject.paymentdate) {
                    if (!isValidDate(dataobject.paymentdate)) {
                        errorcolumn = t(langKeys.paymentdate);
                        errorrow = errorcount;
                    }
                }

                errorcount++;
            }

            if (!errorcolumn) {
                data = data.filter(
                    (d: any) =>
                        !["", null, undefined].includes(d.description) &&
                        !["", null, undefined].includes(d.receiverdocnum) &&
                        !["", null, undefined].includes(d.receiverbusinessname) &&
                        !["", null, undefined].includes(d.receiverfiscaladdress) &&
                        !["", null, undefined].includes(d.receivercountry) &&
                        !["", null, undefined].includes(d.receivermail) &&
                        !["", null, undefined].includes(d.invoicestatus) &&
                        !["", null, undefined].includes(d.paymentstatus) &&
                        !["", null, undefined].includes(d.totalamount) &&
                        !["", null, undefined].includes(d.exchangerate) &&
                        invoicetypeList.find((data) => data.value === d.invoicetype) &&
                        receiverdoctypeList.find((data) => data.value === d.receiverdoctype) &&
                        corplist.find((data) => data.corpid === d.corpid) &&
                        dataYears.find((data) => data.value === `${d.year}`) &&
                        dataMonths.find((data) => data.val === `${d.month}`.padStart(2, "0")) &&
                        dataCurrency.find((data) => data.value === d.currency)
                );

                if (data.length > 0) {
                    dispatch(showBackdrop(true));
                    dispatch(
                        execute(
                            {
                                header: null,
                                detail: data.map((x: any) =>
                                    insInvoice({
                                        ...x,
                                        comments: String(x.comments || ""),
                                        corpid: Number(x.corpid) || 0,
                                        correlative: Number(x.correlative) || 0,
                                        credittype: String(x.credittype),
                                        currency: String(x.currency),
                                        description: String(x.description),
                                        exchangerate: Number(x.exchangerate),
                                        expirationdate: new Date(x.expirationdate),
                                        invoicedate: new Date(x.invoicedate),
                                        invoicestatus: String(x.invoicestatus),
                                        invoicetype: String(x.invoicetype),
                                        month: Number(x.month),
                                        orgid: Number(x.orgid) || 0,
                                        paidby: String(x.paidby || ""),
                                        paymentdate: new Date(x.paymentdate),
                                        paymentstatus: String(x.paymentstatus),
                                        paymenttype: String(x.paymenttype || ""),
                                        purchaseorder: String(x.purchaseorder || ""),
                                        receiverbusinessname: String(x.receiverbusinessname),
                                        receivercountry: String(x.receivercountry),
                                        receiverdocnum: String(x.receiverdocnum),
                                        receiverdoctype: String(x.receiverdoctype),
                                        receiverfiscaladdress: String(x.receiverfiscaladdress),
                                        receivermail: String(x.receivermail),
                                        serie: String(x.serie || ""),
                                        status: "ACTIVO",
                                        totalamount: Number(x.totalamount),
                                        urlcdr: String(x.urlcdr || ""),
                                        urlpdf: String(x.urlpdf || ""),
                                        urlxml: String(x.urlxml || ""),
                                        year: Number(x.year),
                                    })
                                ),
                            },
                            true
                        )
                    );
                    setwaitSaveImport(true);
                }
            } else {
                dispatch(
                    showSnackbar({
                        message: t(langKeys.invoice_importvalidation, { column: errorcolumn, row: errorrow }),
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
            }
        }
    };

    const openInvoiceComment = (row: Dictionary) => {
        setViewSelected("view-1");
        setOpenModalData(row);
        setOpenModal(true);
    };

    const onModalSuccess = () => {
        setOpenModal(false);
        setViewSelected("view-1");
        fetchData && fetchData();
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(deleteInvoice(row)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.cancelinvoice),
                visible: true,
            })
        );
    };

    const handleView = (row: Dictionary) => {
        if (row.invoicestatus === "PENDING" || (row.invoicestatus === "DRAFT" && row.hasreport === true)) {
            setViewSelected("view-3");
            setRowSelected({ row: row, edit: true });
        } else {
            setViewSelected("view-2");
            setIsCreditNote(false);
            setIsRegularize(true);
            setOperationName("");
            setRowSelected(row);
        }
    };

    const handleCreditNote = (row: Dictionary) => {
        setViewSelected("view-2");
        setIsCreditNote(true);
        setIsRegularize(false);
        setOperationName("generatecreditnote");
        setRowSelected(row);
    };

    const handleRegister = () => {
        setViewSelected("view-3");
        setRowSelected({ row: null, edit: true });
    };

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case "01":
                return "emissorinvoice";
            case "03":
                return "emissorticket";
            case "07":
                return "emissorcreditnote";
            default:
                return "emissornone";
        }
    };

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <InvoiceCommentModal
                    data={openModalData}
                    onTrigger={onModalSuccess}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <FieldSelect
                                data={dataYears}
                                label={t(langKeys.year)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, year: value?.value || 0 }))}
                                optionDesc="value"
                                optionValue="value"
                                style={{ width: 140 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                data={dataMonths}
                                label={t(langKeys.month)}
                                optionDesc="val"
                                optionValue="val"
                                prefixTranslation="month_"
                                style={{ width: 214 }}
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
                                data={dataCorp}
                                label={t(langKeys.corporation)}
                                optionDesc="description"
                                optionValue="corpid"
                                orderbylabel={true}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P", "ADMINISTRADOR LIMADERMA"].includes(
                                    user?.roledesc ?? ""
                                )}
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))
                                }
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                label={t(langKeys.organization)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, orgid: value?.orgid || 0 }))}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                data={dataOrg.filter((e: any) => {
                                    return e.corpid === dataMain.corpid;
                                })}
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataCurrency}
                                label={t(langKeys.currency)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, currency: value?.value || "" }))}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={dataMain.currency}
                                variant="outlined"
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataPayment}
                                label={t(langKeys.paymentstatus)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={dataMain.paymentstatus}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, paymentstatus: value?.value || "" }))
                                }
                            />
                            <Button
                                color="primary"
                                disabled={mainResult.loading || disableSearch}
                                onClick={fetchData}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={dataInvoice}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    handleTemplate={handleTemplate}
                    importCSV={importCSV}
                    loading={mainResult.loading || multiResult.loading}
                    onClickRow={handleView}
                    register={true}
                    registertext={langKeys.generateinvoice}
                    initialPageIndex={
                        IDBILLING === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDBILLING === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDBILLING === memoryTable.id ? (memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize) : 20
                    }
                />
            </div>
        );
    } else if (viewSelected === "view-2") {
        return (
            <BillingOperation
                creditNote={isCreditNote}
                data={rowSelected}
                fetchData={fetchData}
                operationName={operationName}
                regularize={isRegularize}
                setViewSelected={setViewSelected}
            />
        );
    } else {
        return <BillingRegister data={rowSelected} fetchData={fetchData} setViewSelected={setViewSelected} />;
    }
};

const InvoiceCommentModal: FC<{
    data: any;
    onTrigger: () => void;
    openModal: boolean;
    setOpenModal: (param: any) => void;
}> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main.mainAux2);

    const [contentValidation, setContentValidation] = useState("");
    const [dataInvoiceComment, setDataInvoiceComment] = useState<Dictionary[]>([]);
    const [reloadExit, setReloadExit] = useState(false);
    const [waitLoad, setWaitLoad] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const [fields, setFields] = useState({
        commentcaption: "",
        commentcontent: "",
        commenttype: "text",
        corpid: data?.corpid,
        description: "",
        invoicecommentid: 0,
        invoiceid: data?.invoiceid,
        orgid: data?.orgid,
        status: "ACTIVO",
        type: "",
    });

    const fetchData = () => {
        dispatch(
            getCollectionAux2(
                selInvoiceComment({
                    corpid: data?.corpid,
                    invoicecommentid: 0,
                    invoiceid: data?.invoiceid,
                    orgid: data?.orgid,
                })
            )
        );
        setWaitLoad(true);
        dispatch(showBackdrop(true));
    };

    useEffect(() => {
        if (openModal && data) {
            setDataInvoiceComment([]);
            setContentValidation("");
            setReloadExit(false);

            let partialFields = fields;
            partialFields.commentcaption = "";
            partialFields.commentcontent = "";
            partialFields.commenttype = "text";
            partialFields.corpid = data?.corpid;
            partialFields.description = "";
            partialFields.invoicecommentid = 0;
            partialFields.invoiceid = data?.invoiceid;
            partialFields.orgid = data?.orgid;
            partialFields.status = "ACTIVO";
            partialFields.type = "";
            setFields(partialFields);

            fetchData();
        }
    }, [data, openModal]);

    useEffect(() => {
        if (waitLoad) {
            if (!mainResult.loading && !mainResult.error) {
                setDataInvoiceComment(mainResult.data);
                dispatch(showBackdrop(false));
                setWaitLoad(false);
            } else if (mainResult.error) {
                dispatch(showBackdrop(false));
                setWaitLoad(false);
            }
        }
    }, [mainResult, waitLoad]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);

                setDataInvoiceComment([]);

                let partialFields = fields;
                partialFields.commentcontent = "";
                setFields(partialFields);

                fetchData && fetchData();
                setReloadExit(true);
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.organization_plural).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleCommentRegister = () => {
        if (fields) {
            if (fields.commentcontent) {
                setContentValidation("");

                const callback = () => {
                    dispatch(execute(insInvoiceComment(fields)));
                    dispatch(showBackdrop(true));
                    setWaitSave(true);
                };

                dispatch(
                    manageConfirmation({
                        visible: true,
                        question: t(langKeys.confirmation_save),
                        callback,
                    })
                );
            } else {
                setContentValidation(t(langKeys.required_fields_missing));
            }
        }
    };

    const handleCommentDelete = (data: any) => {
        if (fields && data) {
            const callback = () => {
                let fieldTemporal = fields;

                fieldTemporal.commentcaption = data?.commentcaption;
                fieldTemporal.commentcontent = data?.commentcontent;
                fieldTemporal.commenttype = data?.commenttype;
                fieldTemporal.corpid = data?.corpid;
                fieldTemporal.description = data?.description;
                fieldTemporal.invoicecommentid = data?.invoicecommentid;
                fieldTemporal.invoiceid = data?.invoiceid;
                fieldTemporal.orgid = data?.orgid;
                fieldTemporal.status = "ELIMINADO";
                fieldTemporal.type = data?.type;

                dispatch(execute(insInvoiceComment(fieldTemporal)));
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
        }
    };

    return (
        <DialogZyx
            buttonText1={t(langKeys.close)}
            open={openModal}
            title={t(langKeys.invoicecomments)}
            handleClickButton1={() => {
                setOpenModal(false);
                if (reloadExit) {
                    onTrigger();
                }
            }}
        >
            <div style={{ overflowY: "auto" }}>
                {dataInvoiceComment.map((item) => (
                    <div
                        style={{
                            borderColor: "#762AA9",
                            borderRadius: "4px",
                            borderStyle: "solid",
                            borderWidth: "1px",
                            margin: "10px",
                            padding: "10px",
                        }}
                    >
                        <div style={{ display: "flex" }}>
                            <b style={{ width: "100%" }}>
                                {item.createby} {t(langKeys.invoiceat)}{" "}
                                {convertLocalDate(item.createdate || "").toLocaleString()}
                            </b>
                            <Button
                                className={classes.buttoncomments}
                                color="primary"
                                onClick={() => handleCommentDelete(item)}
                                style={{ backgroundColor: "#FB5F5F" }}
                                type="button"
                                variant="contained"
                            >
                                {t(langKeys.delete)}
                            </Button>
                        </div>
                        <FieldEditMulti
                            className="col-12"
                            disabled={true}
                            label={""}
                            valueDefault={item.commentcontent}
                        />
                    </div>
                ))}
                <div style={{ padding: "10px", margin: "10px" }}>
                    <div style={{ display: "flex" }}>
                        <b style={{ width: "100%" }}>
                            {t(langKeys.new)} {t(langKeys.invoicecomment)}
                        </b>
                        <Button
                            className={classes.buttoncomments}
                            color="primary"
                            onClick={() => handleCommentRegister()}
                            style={{ backgroundColor: "#55BD84" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                    <FieldEditMulti
                        className="col-12"
                        error={contentValidation}
                        label={""}
                        valueDefault={fields.commentcontent}
                        onChange={(value) => {
                            let partialf = fields;
                            partialf.commentcontent = value;
                            setFields(partialf);
                        }}
                    />
                </div>
            </div>
        </DialogZyx>
    );
};

const BillingOperation: FC<DetailProps> = ({
    creditNote,
    data,
    fetchData,
    operationName,
    regularize,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiResult = useSelector((state) => state.culqi.requestCreateCreditNote);
    const emitResult = useSelector((state) => state.culqi.requestEmitInvoice);
    const multiResult = useSelector((state) => state.main.multiDataAux);

    const [measureList, setMeasureList] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const [pageSelected, setPageSelected] = useState(0);
    const [productList, setProductList] = useState<any>([]);
    const [showDiscount, setShowDiscount] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const invocesBread = [
        { id: "view-1", name: t(langKeys.billingtitle) },
        { id: "view-2", name: t(langKeys.billinginvoicedetail) },
    ];

    const datacreditnote = [
        { value: "01", description: t(langKeys.billingcreditnote01) },
        { value: "04", description: t(langKeys.billingcreditnote04) },
    ];

    useEffect(() => {
        if (!data) {
            setViewSelected("view-1");
        }

        setMeasureList({ loading: false, data: [] });
        setProductList({ loading: false, data: [] });

        const trueinvoiceid = data?.referenceinvoiceid ? data.referenceinvoiceid : data?.invoiceid;

        dispatch(getMultiCollectionAux([getMeasureUnit(), getInvoiceDetail(data?.corpid, data?.orgid, trueinvoiceid)]));
    }, []);

    useEffect(() => {
        setValue("productdetail", []);

        if (productList) {
            if (productList.data) {
                let productInformationList: Partial<unknown>[] = [];

                productList.data.forEach(
                    (element: {
                        description: any;
                        measureunit: any;
                        productcode: any;
                        productnetprice: any;
                        quantity: any;
                    }) => {
                        productInformationList.push({
                            productcode: element.productcode,
                            productdescription: element.description,
                            productmeasure: element.measureunit,
                            productquantity: element.quantity,
                            productsubtotal: element.productnetprice,
                        });
                    }
                );

                fieldsAppend(productInformationList);
            }
        }
    }, [productList]);

    useEffect(() => {
        const indexMeasure = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_MEASUREUNIT_SEL");

        if (indexMeasure > -1) {
            setMeasureList({
                loading: false,
                data:
                    multiResult.data[indexMeasure] && multiResult.data[indexMeasure].success
                        ? multiResult.data[indexMeasure].data
                        : [],
            });
        }

        const indexProduct = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_INVOICEDETAIL_SELBYINVOICEID");

        if (indexProduct > -1) {
            setProductList({
                loading: false,
                data:
                    multiResult.data[indexProduct] && multiResult.data[indexProduct].success
                        ? multiResult.data[indexProduct].data
                        : [],
            });
        }
    }, [multiResult]);

    const {
        control,
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
    } = useForm<any>({
        defaultValues: {
            corpid: data?.corpid,
            creditnotediscount: 0.0,
            creditnotemotive: "",
            creditnotetype: "",
            hasreport: data?.hasreport,
            invoiceid: data?.invoiceid,
            invoicestatus: data?.invoicestatus,
            orgid: data?.orgid,
            productdetail: [],
        },
    });

    const { fields, append: fieldsAppend } = useFieldArray({
        control,
        name: "productdetail",
    });

    React.useEffect(() => {
        register("corpid", { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register("invoiceid", { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register("orgid");

        register("creditnotediscount", {
            validate: (value) =>
                regularize ||
                getValues("creditnotetype") !== "04" ||
                (value && value > 0 && value < data?.subtotal) ||
                "" + t(langKeys.discountvalidmessage),
        });

        register("creditnotemotive", {
            validate: (value) => regularize || (value && value.length > 10) || "" + t(langKeys.field_required_shorter),
        });

        register("creditnotetype", {
            validate: (value) => regularize || (value && value.length > 0) || "" + t(langKeys.field_required),
        });
    }, [register]);

    const getDocumentType = (documenttype: string) => {
        switch (documenttype) {
            case "0":
                return "billingfield_billingno";
            case "1":
                return "billingfield_billingdni";
            case "4":
                return "billingfield_billingextra";
            case "6":
                return "billingfield_billingruc";
            case "7":
                return "billingfield_billingpass";
            default:
                return "";
        }
    };

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case "01":
                return "emissorinvoice";
            case "03":
                return "emissorticket";
            case "07":
                return "emissorcreditnote";
            default:
                return "";
        }
    };

    const getCreditNoteType = (creditnotetype: string) => {
        switch (creditnotetype) {
            case "01":
                return "billingcreditnote01";
            case "04":
                return "billingcreditnote04";
            default:
                return "";
        }
    };

    const onSubmit = handleSubmit((data) => {
        if (
            data?.invoicestatus === "ERROR" ||
            (data?.invoicestatus !== "INVOICED" && data?.invoicestatus !== "ERROR" && data?.hasreport)
        ) {
            const callback = () => {
                dispatch(emitInvoice(data));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            };

            dispatch(
                manageConfirmation({
                    callback,
                    visible: true,
                    question:
                        data?.invoicestatus === "ERROR"
                            ? t(langKeys.confirmatiom_reemit)
                            : t(langKeys.confirmation_emit),
                })
            );
        } else {
            if (creditNote) {
                const callback = () => {
                    dispatch(createCreditNote(data));
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
            }

            if (regularize) {
                setOpenModal(true);
            }
        }
    });

    const onModalSuccess = () => {
        setOpenModal(false);
        setViewSelected("view-1");
        fetchData && fetchData();
    };

    useEffect(() => {
        if (waitSave) {
            if (
                data?.invoicestatus === "ERROR" ||
                (data?.invoicestatus !== "INVOICED" && data?.invoicestatus !== "ERROR" && data?.hasreport)
            ) {
                if (!emitResult.loading && !emitResult.error) {
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(emitResult.code ?? "success") })
                    );
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1");
                    fetchData && fetchData();
                    setWaitSave(false);
                } else if (emitResult.error) {
                    dispatch(
                        showSnackbar({
                            message: t(emitResult.code ?? "error_unexpected_db_error"),
                            severity: "error",
                            show: true,
                        })
                    );
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1");
                    fetchData && fetchData();
                    setWaitSave(false);
                }
            } else {
                if (!culqiResult.loading && !culqiResult.error) {
                    dispatch(
                        showSnackbar({ show: true, severity: "success", message: t(culqiResult.code ?? "success") })
                    );
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1");
                    fetchData && fetchData();
                    setWaitSave(false);
                } else if (culqiResult.error) {
                    dispatch(
                        showSnackbar({
                            severity: "error",
                            show: true,
                            message: t(culqiResult.code ?? "error_unexpected_db_error"),
                        })
                    );
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1");
                    fetchData && fetchData();
                    setWaitSave(false);
                }
            }
        }
    }, [culqiResult, emitResult, waitSave]);

    return (
        <div style={{ width: "100%" }}>
            <RegularizeModal data={data} openModal={openModal} setOpenModal={setOpenModal} onTrigger={onModalSuccess} />
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={invocesBread}
                            handleClick={(id) => {
                                setViewSelected(id);
                                fetchData();
                            }}
                        />
                        <TitleDetail title={operationName ? t(operationName) : t(langKeys.billinginvoiceview)} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            disabled={culqiResult.loading || emitResult.loading || multiResult.loading}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                            onClick={() => {
                                setViewSelected("view-1");
                                fetchData && fetchData();
                            }}
                        >
                            {t(langKeys.back)}
                        </Button>
                        {data?.invoicestatus === "ERROR" && data?.invoicetype !== "07" ? (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={culqiResult.loading || emitResult.loading || multiResult.loading}
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.reemitinvoice)}
                            </Button>
                        ) : null}
                        {data?.invoicestatus !== "INVOICED" &&
                            data?.invoicestatus !== "ERROR" &&
                            data?.invoicetype !== "07" &&
                            data?.hasreport ? (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={culqiResult.loading || emitResult.loading || multiResult.loading}
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.emitinvoice)}
                            </Button>
                        ) : null}
                        {data?.invoicestatus === "INVOICED" && creditNote ? (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={culqiResult.loading || emitResult.loading || multiResult.loading}
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.emitinvoice)}
                            </Button>
                        ) : null}
                        {data?.invoicestatus === "INVOICED" &&
                            data?.paymentstatus !== "PAID" &&
                            data?.invoicetype !== "07" &&
                            regularize ? (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={culqiResult.loading || emitResult.loading || multiResult.loading}
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                            >
                                {t(langKeys.regulatepayment)}
                            </Button>
                        ) : null}
                    </div>
                </div>
                <div style={{ backgroundColor: "white", padding: 16 }}>
                    <Tabs
                        indicatorColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                        style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                        textColor="primary"
                        value={pageSelected}
                        variant="fullWidth"
                    >
                        <AntTab label={t(langKeys.billinginvoicedata)} />
                        <AntTab label={t(langKeys.billingadditionalinfo)} />
                    </Tabs>
                    {pageSelected === 0 && (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.invoice_serviceyear)}
                                    value={data?.year}
                                />
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.invoice_servicemonth)}
                                    value={data?.month}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.billingclienttype)}
                                    value={t(getDocumentType(data?.receiverdoctype))}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.documentnumber)}
                                    value={data?.receiverdocnum}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.billingname)}
                                    value={data?.receiverbusinessname}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.invoicestatus)}
                                    value={t(data?.invoicestatus)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView label={t(langKeys.invoiceid)} value={data?.invoiceid} className="col-3" />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.documenttype)}
                                    value={t(getInvoiceType(data?.invoicetype))}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.billingvoucher)}
                                    value={
                                        (data?.serie ? data.serie : "X000") +
                                        "-" +
                                        (data?.correlative ? data?.correlative.toString().padStart(8, "0") : "00000000")
                                    }
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.invoicedate)}
                                    value={data?.invoicedate}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.credittype)}
                                    value={t(data?.credittype)}
                                />
                                <FieldView label={t(langKeys.dueDate)} value={data?.expirationdate} className="col-3" />
                                {data?.type === "CREDITNOTE" ? (
                                    <FieldView
                                        className="col-3"
                                        label={t(langKeys.referenceddocument)}
                                        value={
                                            (data?.referenceserie ? data.referenceserie : "X000") +
                                            "-" +
                                            (data?.referencecorrelative
                                                ? data?.referencecorrelative.toString().padStart(8, "0")
                                                : "00000000")
                                        }
                                    />
                                ) : (
                                    <FieldView
                                        className="col-3"
                                        label={t(langKeys.purchaseorder)}
                                        value={data?.purchaseorder}
                                    />
                                )}
                                {data?.type === "CREDITNOTE" ? (
                                    <FieldView
                                        className="col-3"
                                        label={t(langKeys.ticket_reason)}
                                        value={data?.creditnotemotive}
                                    />
                                ) : (
                                    <FieldView label={t(langKeys.comments)} value={data?.comments} className="col-3" />
                                )}
                            </div>
                            <div className="row-zyx">
                                <FieldView label={t(langKeys.currency)} value={data?.currency} className="col-3" />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.taxbase)}
                                    value={formatNumber(data?.subtotal || 0)}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.billingtax)}
                                    value={formatNumber(data?.taxes || 0)}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.totalamount)}
                                    value={formatNumber(data?.totalamount || 0)}
                                />
                            </div>
                            {data?.type === "CREDITNOTE" ? (
                                <div className="row-zyx">
                                    <FieldView
                                        className="col-3"
                                        label={t(langKeys.creditnotetype)}
                                        value={t(getCreditNoteType(data?.creditnotetype))}
                                    />
                                    {data?.creditnotetype === "04" ? (
                                        <FieldView
                                            className="col-3"
                                            label={t(langKeys.globaldiscount)}
                                            value={formatNumber(data?.creditnotediscount || 0)}
                                        />
                                    ) : null}
                                </div>
                            ) : null}
                            {creditNote ? (
                                <div className="row-zyx">
                                    <FieldSelect
                                        className="col-3"
                                        data={datacreditnote}
                                        error={errors?.creditnotetype?.message}
                                        label={t(langKeys.creditnotetype)}
                                        optionDesc="description"
                                        optionValue="value"
                                        orderbylabel={true}
                                        valueDefault={getValues("creditnotetype")}
                                        onChange={(value) => {
                                            setValue("creditnotetype", value?.value);
                                            setShowDiscount(value?.value === "04");
                                        }}
                                    />
                                    <FieldEdit
                                        className="col-3"
                                        error={errors?.creditnotemotive?.message}
                                        label={t(langKeys.ticket_reason)}
                                        onChange={(value) => setValue("creditnotemotive", value)}
                                        valueDefault={getValues("creditnotemotive")}
                                    />
                                    {showDiscount ? (
                                        <FieldEdit
                                            className="col-3"
                                            error={errors?.creditnotediscount?.message}
                                            inputProps={{ step: "any" }}
                                            label={t(langKeys.globaldiscount)}
                                            onChange={(value) => setValue("creditnotediscount", value)}
                                            type="number"
                                            valueDefault={getValues("creditnotediscount")}
                                        />
                                    ) : null}
                                </div>
                            ) : null}
                            <div className="row-zyx">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.description)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.measureunit)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.unitaryprice)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.quantity)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.billingsubtotal)} />
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((item, i) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <FieldView
                                                            label={""}
                                                            value={getValues(`productdetail.${i}.productdescription`)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldSelect
                                                            data={measureList.data}
                                                            disabled={true}
                                                            loading={measureList.loading}
                                                            optionDesc="description"
                                                            optionValue="code"
                                                            orderbylabel={true}
                                                            valueDefault={getValues(
                                                                `productdetail.${i}.productmeasure`
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView
                                                            label={""}
                                                            value={formatNumber(
                                                                getValues(`productdetail.${i}.productsubtotal`) || 0
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView
                                                            label={""}
                                                            value={formatNumber(
                                                                getValues(`productdetail.${i}.productquantity`) || 0
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView
                                                            label={""}
                                                            value={formatNumber(
                                                                (getValues(`productdetail.${i}.productsubtotal`) || 0) *
                                                                (getValues(`productdetail.${i}.productquantity`) ||
                                                                    0)
                                                            )}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    )}
                    {pageSelected === 1 && (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldView
                                    className={classes.section}
                                    label={""}
                                    value={t(langKeys.invoiceinformation)}
                                />
                            </div>
                            <div className="row-zyx">
                                {data?.urlpdf ? (
                                    <div className="col-4">
                                        <a href={data?.urlpdf} target="_blank" rel="noreferrer">
                                            {t(langKeys.urlpdf)}
                                        </a>
                                    </div>
                                ) : (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.urlpdf)}
                                        value={t(langKeys.pendingpayment)}
                                    />
                                )}
                                {data?.urlcdr ? (
                                    <div className="col-4">
                                        <a href={data?.urlcdr} target="_blank" rel="noreferrer">
                                            {t(langKeys.urlcdr)}
                                        </a>
                                    </div>
                                ) : (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.urlcdr)}
                                        value={t(langKeys.pendingpayment)}
                                    />
                                )}
                                {data?.urlxml ? (
                                    <div className="col-4">
                                        <a href={data?.urlxml} target="_blank" rel="noreferrer">
                                            {t(langKeys.urlxml)}
                                        </a>
                                    </div>
                                ) : (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.urlxml)}
                                        value={t(langKeys.pendingpayment)}
                                    />
                                )}
                            </div>
                            {data?.errordescription ? (
                                <div className="row-zyx">
                                    <FieldView
                                        className="col-12"
                                        label={t(langKeys.billingerror)}
                                        value={data?.errordescription}
                                    />
                                </div>
                            ) : null}
                            <div className="row-zyx">
                                <FieldView
                                    className={classes.section}
                                    label={""}
                                    value={t(langKeys.paymentinformation)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.paymentstatus)}
                                    value={t(data?.paymentstatus)}
                                />
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.paymentdate)}
                                    value={
                                        data?.paymentdate
                                            ? toISOLocalString(new Date(data?.paymentdate))
                                                .replace("T", " ")
                                                .substring(0, 19)
                                            : t(langKeys.none)
                                    }
                                />
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.billingusername)}
                                    value={data?.paymentdate ? data?.changeby : t(langKeys.none)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.paymentnote)}
                                    value={t(data?.invoicepaymentnote || langKeys.none)}
                                />
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.paymentcommentary)}
                                    value={t(data?.paymentcommentary || langKeys.none)}
                                />
                                {data?.invoicereferencefile ? (
                                    <div className="col-4">
                                        <a href={data?.invoicereferencefile} target="_blank" rel="noreferrer">
                                            {t(langKeys.paymentreferenceview)}
                                        </a>
                                    </div>
                                ) : (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.paymentfile)}
                                        value={t(langKeys.none)}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

const RegularizeModal: FC<{
    data: any;
    onTrigger: () => void;
    openModal: boolean;
    setOpenModal: (param: any) => void;
}> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const culqiResult = useSelector((state) => state.culqi.requestRegularizeInvoice);
    const uploadResult = useSelector((state) => state.main.uploadFile);

    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger,
    } = useForm({
        defaultValues: {
            corpid: data?.corpid,
            invoiceid: data?.invoiceid,
            invoicepaymentcommentary: "",
            invoicepaymentnote: "",
            invoicereferencefile: "",
            orgid: data?.orgid,
        },
    });

    React.useEffect(() => {
        register("corpid", { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register("invoiceid", { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register("orgid");

        register("invoicepaymentcommentary", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });

        register("invoicepaymentnote", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });

        register("invoicereferencefile", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });
    }, [register]);

    useEffect(() => {
        if (waitSave) {
            if (!culqiResult.loading && !culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(culqiResult.code ?? "success") }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                onTrigger();
            } else if (culqiResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(culqiResult.code ?? "error_unexpected_db_error"),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [culqiResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(regularizeInvoice(data));
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

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById("attachmentInput");
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachment(file);
            let fd = new FormData();
            fd.append("file", file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, []);

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById("attachmentInput") as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        setFileAttachment(null);
        setValue(
            "invoicereferencefile",
            getValues("invoicereferencefile")
                .split(",")
                .filter((a: string) => a !== f)
                .join("")
        );
        await trigger("invoicereferencefile");
    };

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue("invoicereferencefile", [getValues("invoicereferencefile"), uploadResult?.url ?? ""].join(""));
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult]);

    return (
        <DialogZyx
            button2Type="submit"
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            open={openModal}
            title={t(langKeys.regulatepayment)}
        >
            <FieldEdit
                className="col-12"
                error={errors?.invoicepaymentnote?.message}
                label={t(langKeys.paymentnote)}
                onChange={(value) => setValue("invoicepaymentnote", value)}
                valueDefault={getValues("invoicepaymentnote")}
            />
            <FieldEdit
                className="col-12"
                error={errors?.invoicepaymentcommentary?.message}
                label={t(langKeys.paymentcommentary)}
                onChange={(value) => setValue("invoicepaymentcommentary", value)}
                valueDefault={getValues("invoicepaymentcommentary")}
            />
            <FieldEdit
                disabled={true}
                error={errors?.invoicereferencefile?.message}
                label={t(langKeys.evidenceofpayment)}
                valueDefault={getValues("invoicereferencefile")}
            />
            <React.Fragment>
                <input
                    accept="image/*"
                    id="attachmentInput"
                    onChange={(e) => onChangeAttachment(e.target.files)}
                    style={{ display: "none" }}
                    type="file"
                />
                {
                    <IconButton onClick={onClickAttachment} disabled={waitUploadFile || fileAttachment !== null}>
                        <AttachFileIcon color="primary" />
                    </IconButton>
                }
                {!!getValues("invoicereferencefile") &&
                    getValues("invoicereferencefile")
                        .split(",")
                        .map((f: string, i: number) => (
                            <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                        ))}
                {waitUploadFile && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
            </React.Fragment>
        </DialogZyx>
    );
};

interface FilePreviewProps {
    onClose?: (f: string) => void;
    src: File | string;
}

const useFilePreviewStyles = makeStyles((theme) => ({
    root: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        margin: theme.spacing(1),
        maxHeight: 80,
        maxWidth: 300,
        overflow: "hidden",
        padding: theme.spacing(1),
        width: "fit-content",
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    btnContainer: {
        color: "lightgrey",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes("http"), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = RegExp(/.*\/(.+?)\./).exec(src as string);
            return m && m.length > 1 ? m[1] : "";
        }
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split(".").pop()?.toUpperCase() ?? "-";
        }
        return (src as File).name?.split(".").pop()?.toUpperCase() ?? "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: "0.5em" }} />
            <div className={classes.infoContainer}>
                <div>
                    <div
                        style={{
                            fontWeight: "bold",
                            maxWidth: 190,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {getFileName()}
                    </div>
                    {getFileExt()}
                </div>
            </div>
            <div style={{ width: "0.5em" }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: "10%" }} />}
                {isUrl() && (
                    <a
                        download={`${getFileName()}.${getFileExt()}`}
                        href={src as string}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
};

const BillingRegister: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiResult = useSelector((state) => state.culqi.requestCreateInvoice);
    const executeRes = useSelector((state) => state.main.execute);
    const invoicehasreport = data?.row?.hasreport || false;
    const multiResult = useSelector((state) => state.main.multiDataAux);
    const user = useSelector((state) => state.login.validateToken.user);

    const [amountTax, setAmountTax] = useState(0);
    const [amountTotal, setAmountTotal] = useState(0);
    const [appsettingData, setAppsettingData] = useState<any>([]);
    const [corpList, setCorpList] = useState<any>([]);
    const [creditTypeList, setCreditTypeList] = useState<any>([]);
    const [measureList, setMeasureList] = useState<any>([]);
    const [orgList, setOrgList] = useState<any>([]);
    const [pageSelected, setPageSelected] = useState(0);
    const [productList, setProductList] = useState<any>([]);
    const [savedCorp, setSavedCorp] = useState<any>();
    const [showInsertMessage, setShowInsertMessage] = useState(false);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [waitLoad, setWaitLoad] = useState(false);
    const [waitOrg, setWaitOrg] = useState(false);
    const [waitOrgLoad, setWaitOrgLoad] = useState(false);
    const [waitRefresh, setWaitRefresh] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const invocesBread = [
        { id: "view-1", name: t(langKeys.billingtitle) },
        { id: "view-3", name: t(langKeys.billinggeneration) },
    ];

    useEffect(() => {
        setCreditTypeList({ loading: true, data: [] });
        setCorpList({ loading: true, data: [] });
        setMeasureList({ loading: true, data: [] });
        setOrgList({ loading: false, data: [] });
        setProductList({ loading: false, data: [] });

        dispatch(
            getMultiCollectionAux([
                getCorpSel(user?.roledesc === "ADMINISTRADOR" ? user?.corpid : 0),
                getMeasureUnit(),
                getValuesFromDomain("TYPECREDIT", null, user?.orgid, user?.corpid),
                getAppsettingInvoiceSel(),
            ])
        );
    }, []);

    useEffect(() => {
        if (waitLoad) {
            if (data?.row) {
                if (
                    data.row.invoicestatus !== "INVOICED" &&
                    data.row.paymentstatus !== "PAID" &&
                    invoicehasreport &&
                    user?.roledesc === "SUPERADMIN"
                ) {
                    setShowUpdateButton(true);
                }

                dispatch(
                    getMultiCollectionAux([getInvoiceDetail(data.row.corpid, data.row.orgid, data.row.invoiceid)])
                );

                setValue("invoicecomments", data.row.comments);
                setValue("invoicecurrency", data.row.currency);
                setValue("invoicepurchaseorder", data.row.purchaseorder);

                let corporationdata;

                if (data.row.orgid) {
                    corporationdata = corpList.data.find((x: { corpid: any }) => x.corpid === data.row.corpid);

                    dispatch(getMultiCollectionAux([getOrgSel(0, corporationdata.corpid)]));
                    setValue("billbyorg", corporationdata?.billbyorg);
                    setSavedCorp(corporationdata);
                    setWaitOrg(true);
                } else {
                    if (corpList) {
                        if (corpList.data) {
                            corporationdata = corpList.data.find((x: { corpid: any }) => x.corpid === data.row.corpid);

                            setSubmitData(corporationdata);
                            setValue("billbyorg", corporationdata?.billbyorg);
                            setSavedCorp(null);
                        }
                    }
                }
            }
        }
    }, [waitLoad]);

    useEffect(() => {
        if (waitLoad && waitOrgLoad) {
            setWaitOrg(false);

            if (data?.row) {
                let organizationdata = orgList.data.find((x: { orgid: any }) => x.orgid === data.row.orgid);

                if (organizationdata) {
                    setSubmitData(organizationdata);
                } else {
                    setSubmitData(savedCorp);
                }
            }
        }
    }, [waitOrg, waitOrgLoad]);

    useEffect(() => {
        setValue("productdetail", []);

        if (data?.row) {
            if (productList) {
                if (productList.data) {
                    let productInformationList: Partial<unknown>[] = [];

                    productList.data.forEach(
                        (element: {
                            description: any;
                            measureunit: any;
                            netamount: any;
                            productcode: any;
                            quantity: any;
                        }) => {
                            productInformationList.push({
                                productcode: element.productcode,
                                productdescription: element.description,
                                productmeasure: element.measureunit,
                                productquantity: element.quantity,
                                productsubtotal: element.netamount,
                            });
                        }
                    );

                    fieldsAppend(productInformationList);

                    onProductChange();
                }
            }
        }
    }, [productList]);

    useEffect(() => {
        const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_CORP_SEL");

        if (indexCorp > -1) {
            setCorpList({
                loading: false,
                data:
                    multiResult.data[indexCorp] && multiResult.data[indexCorp].success
                        ? multiResult.data[indexCorp].data
                        : [],
            });
            setWaitLoad(true);
        }

        const indexOrg = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_ORG_SEL");

        if (indexOrg > -1) {
            setOrgList({
                loading: false,
                data:
                    multiResult.data[indexOrg] && multiResult.data[indexOrg].success
                        ? multiResult.data[indexOrg].data
                        : [],
            });
            setWaitOrgLoad(true);
        }

        const indexMeasure = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_MEASUREUNIT_SEL");

        if (indexMeasure > -1) {
            setMeasureList({
                loading: false,
                data:
                    multiResult.data[indexMeasure] && multiResult.data[indexMeasure].success
                        ? multiResult.data[indexMeasure].data
                        : [],
            });
        }

        const indexCreditType = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_DOMAIN_LST_VALORES");

        if (indexCreditType > -1) {
            setCreditTypeList({
                loading: false,
                data:
                    multiResult.data[indexCreditType] && multiResult.data[indexCreditType].success
                        ? multiResult.data[indexCreditType].data
                        : [],
            });
        }

        const indexProduct = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_INVOICEDETAIL_SELBYINVOICEID");

        if (indexProduct > -1) {
            setProductList({
                loading: false,
                data:
                    multiResult.data[indexProduct] && multiResult.data[indexProduct].success
                        ? multiResult.data[indexProduct].data
                        : [],
            });
        }

        const indexAppsetting = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_APPSETTING_INVOICE_SEL");

        if (indexAppsetting > -1) {
            setAppsettingData({
                loading: false,
                data:
                    multiResult.data[indexAppsetting] && multiResult.data[indexAppsetting].success
                        ? multiResult.data[indexAppsetting].data
                        : [],
            });
        }
    }, [multiResult]);

    const {
        control,
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger,
    } = useForm<any>({
        defaultValues: {
            autosendinvoice: null,
            billbyorg: false,
            clientbusinessname: "",
            clientcountry: "",
            clientcredittype: "",
            clientdocnumber: "",
            clientdoctype: "",
            clientfiscaladdress: "",
            clientmail: "",
            corpid: 0,
            invoicecomments: "",
            invoicecreatedate: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString().split("T")[0],
            invoicecurrency: "USD",
            invoiceduedate: "",
            invoiceid: data?.row ? data.row.invoiceid : 0,
            invoicepurchaseorder: "",
            invoicetotalamount: 0.0,
            month: data?.row ? data.row.month : 0,
            onlyinsert: false,
            orgid: 0,
            productdetail: [],
            year: data?.row ? data.row.year : 0,
        },
    });

    const {
        append: fieldsAppend,
        fields,
        remove: fieldRemove,
    } = useFieldArray({
        control,
        name: "productdetail",
    });

    React.useEffect(() => {
        register("autosendinvoice");
        register("clientcountry");
        register("clientcredittype");
        register("clientfiscaladdress");
        register("clientmail");
        register("corpid", { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register("invoiceduedate");
        register("month", { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register("year", { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });

        register("clientbusinessname", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });

        register("clientdocnumber", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });

        register("clientdoctype", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });

        register("invoicecomments", {
            validate: (value) => value === "" || (value || "").length <= 150 || "" + t(langKeys.validation150char),
        });

        register("invoicecreatedate", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });

        register("invoicecurrency", {
            validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required),
        });

        register("invoicepurchaseorder", {
            validate: (value) => value === "" || (value || "").length <= 15 || "" + t(langKeys.validation15char),
        });

        register("invoicetotalamount", {
            validate: (value) => (value && value > 0) || "" + t(langKeys.billingamountvalidation),
        });

        register("orgid", {
            validate: (value) =>
                getValues("billbyorg") === false || (value && value > 0) || "" + t(langKeys.field_required),
        });
    }, [register]);

    const setSubmitData = (data: any) => {
        setValue("autosendinvoice", data?.autosendinvoice);
        setValue("clientbusinessname", data?.businessname || "");
        setValue("clientcountry", data?.sunatcountry || "");
        setValue("clientcredittype", data?.credittype || "");
        setValue("clientdocnumber", data?.docnum || "");
        setValue("clientdoctype", data?.doctype || "");
        setValue("clientfiscaladdress", data?.fiscaladdress || "");
        setValue("clientmail", data?.contactemail || "");
        setValue("corpid", data?.corpid || 0);
        setValue("orgid", data?.orgid || 0);

        if (data?.credittype) {
            let dueDate = new Date(getValues("invoicecreatedate"));

            switch (data.credittype) {
                case "typecredit_15":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 15));
                    break;
                case "typecredit_30":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 30));
                    break;
                case "typecredit_45":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 45));
                    break;
                case "typecredit_60":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 60));
                    break;
                case "typecredit_90":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 90));
                    break;
            }

            setValue("invoiceduedate", dueDate.toISOString().split("T")[0]);
        } else {
            setValue("invoiceduedate", "");
        }

        if (data?.doctype) {
            if (appsettingData?.data) {
                let invoiceamount = getValues("invoicetotalamount");

                if (data?.doctype === "0") {
                    setAmountTax(0);
                    setAmountTotal(invoiceamount || 0);
                } else {
                    setAmountTax((invoiceamount || 0) * appsettingData.data[0].igv);
                    setAmountTotal((invoiceamount || 0) + (invoiceamount || 0) * appsettingData.data[0].igv);
                }
            }
        }

        trigger("autosendinvoice");
        trigger("clientbusinessname");
        trigger("clientcountry");
        trigger("clientcredittype");
        trigger("clientdocnumber");
        trigger("clientdoctype");
        trigger("clientfiscaladdress");
        trigger("clientmail");
        trigger("corpid");
        trigger("invoicecreatedate");
        trigger("invoiceduedate");
        trigger("orgid");
    };

    const getDocumentType = (documenttype: string) => {
        switch (documenttype) {
            case "0":
                return "billingfield_billingno";
            case "1":
                return "billingfield_billingdni";
            case "4":
                return "billingfield_billingextra";
            case "6":
                return "billingfield_billingruc";
            case "7":
                return "billingfield_billingpass";
            default:
                return "";
        }
    };

    const getDocumentResult = (country: string, documenttype: string) => {
        if ((country === "PE" && documenttype === "6") || (country !== "PE" && documenttype === "0")) {
            return "emissorinvoice";
        }

        if (country === "PE" && (documenttype === "1" || documenttype === "4" || documenttype === "7")) {
            return "emissorticket";
        }

        return "";
    };

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case "01":
                return "emissorinvoice";
            case "03":
                return "emissorticket";
            case "07":
                return "emissorcreditnote";
            default:
                return langKeys.pendingpayment;
        }
    };

    const onCreditTypeChange = (data: any) => {
        if (data) {
            let dueDate = new Date(getValues("invoicecreatedate"));

            switch (data) {
                case "typecredit_15":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 15));
                    break;
                case "typecredit_30":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 30));
                    break;
                case "typecredit_45":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 45));
                    break;
                case "typecredit_60":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 60));
                    break;
                case "typecredit_90":
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 90));
                    break;
            }

            setValue("invoiceduedate", dueDate.toISOString().split("T")[0]);
        } else {
            setValue("invoiceduedate", "");
        }

        trigger("invoiceduedate");
    };

    const onCorpChange = (data: any) => {
        setSubmitData(data);

        if (data) {
            dispatch(getMultiCollectionAux([getOrgSel(0, data.corpid)]));
            setValue("billbyorg", data.billbyorg);
            setSavedCorp(data);
        } else {
            setOrgList({ loading: false, data: [] });
            setValue("billbyorg", false);
            setSavedCorp(null);
        }
    };

    const onOrgChange = (data: any) => {
        if (data) {
            setSubmitData(data);
        } else {
            setSubmitData(savedCorp);
        }
    };

    const onProductChange = () => {
        let productDetail = getValues("productdetail");
        let totalAmount = 0.0;

        if (productDetail) {
            productDetail.forEach((element: any) => {
                if (element.productquantity && element.productsubtotal) {
                    totalAmount = totalAmount + element.productquantity * element.productsubtotal;
                }
            });
        }

        if (appsettingData) {
            if (appsettingData.data) {
                if (getValues("clientdoctype") === "0") {
                    setAmountTax(0);
                    setAmountTotal(totalAmount);
                } else {
                    setAmountTax(totalAmount * appsettingData.data[0].igv);
                    setAmountTotal(totalAmount + totalAmount * appsettingData.data[0].igv);
                }
            }
        }

        setValue("invoicetotalamount", totalAmount);
        trigger("invoicetotalamount");
    };

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(createInvoice(data));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                visible: true,
                question: showInsertMessage
                    ? t(langKeys.confirmation_save)
                    : `${t(langKeys.invoiceconfirmation01)}\n\n${t(langKeys.invoiceconfirmation02)}${getValues(
                        "clientdocnumber"
                    )}\n${t(langKeys.invoiceconfirmation03)}${getValues("clientbusinessname")}\n${t(
                        langKeys.invoiceconfirmation04
                    )}${getValues("year")}\n${t(langKeys.invoiceconfirmation05)}${getValues("month")}\n${t(
                        langKeys.invoiceconfirmation06
                    )}${t(
                        getDocumentResult(getValues("clientcountry") || "", getValues("clientdoctype") || "")
                    )}\n${t(langKeys.invoiceconfirmation07)}${t(getValues("clientcredittype"))}\n${t(
                        langKeys.invoiceconfirmation08
                    )}${getValues("invoicecurrency")}\n${t(langKeys.invoiceconfirmation09)}${formatNumber(
                        getValues("invoicetotalamount") || 0
                    )}\n${t(langKeys.invoiceconfirmation10)}${formatNumber(amountTax || 0)}\n${t(
                        langKeys.invoiceconfirmation11
                    )}${formatNumber(amountTotal || 0)}\n\n${t(langKeys.invoiceconfirmation12)}`,
            })
        );
    });

    const refreshInvoice = (data: any) => {
        const callback = () => {
            dispatch(execute(invoiceRefresh(data)));
            dispatch(showBackdrop(true));
            setWaitRefresh(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_invoicerefresh),
                visible: true,
            })
        );
    };

    useEffect(() => {
        if (waitRefresh) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
                setWaitRefresh(false);
            } else if (executeRes.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeRes.code ?? "error_unexpected_error", {
                            module: t(langKeys.organization_plural).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitRefresh(false);
            }
        }
    }, [executeRes, waitRefresh]);

    useEffect(() => {
        if (waitSave) {
            if (!culqiResult.loading && !culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(culqiResult.code ?? "success") }));
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
                setWaitSave(false);
            } else if (culqiResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(culqiResult.code ?? "error_unexpected_db_error"),
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
                setWaitSave(false);
            }
        }
    }, [culqiResult, waitSave]);

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={invocesBread}
                            handleClick={(id) => {
                                setViewSelected(id);
                                fetchData();
                            }}
                        />
                        <TitleDetail title={t(langKeys.emiteinvoicetitle)} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            disabled={culqiResult.loading || executeRes.loading || multiResult.loading}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                            onClick={() => {
                                setViewSelected("view-1");
                                fetchData && fetchData();
                            }}
                        >
                            {t(langKeys.back)}
                        </Button>
                        {!invoicehasreport && (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={culqiResult.loading || executeRes.loading || multiResult.loading}
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="submit"
                                variant="contained"
                                onClick={() => {
                                    setValue("onlyinsert", true);
                                    setShowInsertMessage(true);
                                }}
                            >
                                {t(langKeys.saveasdraft)}
                            </Button>
                        )}
                        {invoicehasreport && showUpdateButton && (
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={culqiResult.loading || executeRes.loading || multiResult.loading}
                                startIcon={<Refresh style={{ color: "white" }} />}
                                style={{ backgroundColor: "#55BD84" }}
                                variant="contained"
                                onClick={() => {
                                    refreshInvoice(data?.row || null);
                                }}
                            >
                                {t(langKeys.refresh)}
                            </Button>
                        )}
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={culqiResult.loading || executeRes.loading || multiResult.loading}
                            startIcon={<PaymentIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            type="submit"
                            variant="contained"
                            onClick={() => {
                                setValue("onlyinsert", false);
                                setShowInsertMessage(false);
                            }}
                        >
                            {t(langKeys.emitinvoice)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldView className={classes.section} label={""} value={t(langKeys.clientsearch)} />
                        <FieldView
                            className={classes.commentary}
                            label={""}
                            value={
                                t(langKeys.billingtypevalidation) +
                                (getValues("corpid") && getValues("orgid")
                                    ? t(langKeys.organization)
                                    : getValues("corpid")
                                        ? t(langKeys.corporation)
                                        : "")
                            }
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-3"
                            data={corpList.data}
                            disabled={invoicehasreport}
                            error={errors?.corpid?.message}
                            label={t(langKeys.corporation)}
                            loading={corpList.loading}
                            optionDesc="description"
                            optionValue="corpid"
                            orderbylabel={true}
                            valueDefault={data?.row?.corpid ? data?.row?.corpid : getValues("corpid")}
                            onChange={(value) => {
                                onCorpChange(value);
                            }}
                        />
                        <FieldSelect
                            className="col-3"
                            data={orgList.data}
                            disabled={getValues("billbyorg") === false || invoicehasreport}
                            error={errors?.orgid?.message}
                            label={t(langKeys.organization)}
                            loading={orgList.loading}
                            optionDesc="orgdesc"
                            optionValue="orgid"
                            orderbylabel={true}
                            valueDefault={data?.row?.orgid ? data?.row?.orgid : getValues("orgid")}
                            onChange={(value) => {
                                onOrgChange(value);
                            }}
                        />
                        <FieldSelect
                            className="col-3"
                            data={dataYears}
                            disabled={invoicehasreport}
                            error={errors?.year?.message}
                            label={t(langKeys.invoice_serviceyear)}
                            optionDesc="value"
                            optionValue="value"
                            valueDefault={data?.row?.year ? data?.row?.year.toString() : getValues("year")}
                            onChange={(value) => {
                                setValue("year", parseInt(value?.value || "0"));
                            }}
                        />
                        <FieldSelect
                            className="col-3"
                            data={dataMonths}
                            disabled={invoicehasreport}
                            error={errors?.month?.message}
                            label={t(langKeys.invoice_servicemonth)}
                            optionDesc="val"
                            optionValue="val"
                            valueDefault={(data?.row?.month || 0 || getValues("month")).toString().padStart(2, "0")}
                            onChange={(value) => {
                                setValue("month", parseInt(value?.val || "0"));
                            }}
                        />
                    </div>
                </div>
                <div style={{ backgroundColor: "white", padding: 16 }}>
                    <Tabs
                        indicatorColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                        style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                        textColor="primary"
                        value={pageSelected}
                        variant="fullWidth"
                    >
                        <AntTab label={t(langKeys.billinginvoicedata)} />
                    </Tabs>
                    {pageSelected === 0 && (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldEdit
                                    className="col-3"
                                    disabled={true}
                                    error={errors?.clientdoctype?.message}
                                    label={t(langKeys.billingclienttype)}
                                    valueDefault={t(getDocumentType(getValues("clientdoctype")))}
                                />
                                <FieldEdit
                                    className="col-3"
                                    disabled={true}
                                    error={errors?.clientdocnumber?.message}
                                    label={t(langKeys.documentnumber)}
                                    valueDefault={getValues("clientdocnumber")}
                                />
                                <FieldEdit
                                    className="col-3"
                                    disabled={true}
                                    error={errors?.clientbusinessname?.message}
                                    label={t(langKeys.billingname)}
                                    valueDefault={getValues("clientbusinessname")}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.invoicestatus)}
                                    value={t(data?.row?.invoicestatus || "DRAFT")}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.invoiceid)}
                                    value={data?.row?.invoiceid || t(langKeys.pendingsave)}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.documenttype)}
                                    value={t(getInvoiceType(data?.row?.invoicetype))}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.billingvoucher)}
                                    value={
                                        (data?.row?.serie ? data.row.serie : "X000") +
                                        "-" +
                                        (data?.row?.correlative
                                            ? data.row.correlative.toString().padStart(8, "0")
                                            : "00000000")
                                    }
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.invoicedate)}
                                    value={getValues("invoicecreatedate")}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldSelect
                                    className="col-3"
                                    data={creditTypeList.data}
                                    error={errors?.clientcredittype?.message}
                                    label={t(langKeys.credittype)}
                                    loading={creditTypeList.loading}
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                    orderbylabel={true}
                                    uset={true}
                                    onChange={(value) => {
                                        setValue("clientcredittype", value?.domainvalue);
                                        onCreditTypeChange(value?.domainvalue);
                                    }}
                                    valueDefault={
                                        data?.row?.credittype ? data.row.credittype : getValues("clientcredittype")
                                    }
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.dueDate)}
                                    value={getValues("invoiceduedate")}
                                />
                                <FieldEdit
                                    className="col-3"
                                    error={errors?.invoicepurchaseorder?.message}
                                    label={t(langKeys.purchaseorder)}
                                    onChange={(value) => setValue("invoicepurchaseorder", value)}
                                    valueDefault={getValues("invoicepurchaseorder")}
                                />
                                <FieldEdit
                                    className="col-3"
                                    error={errors?.invoicecomments?.message}
                                    label={t(langKeys.comments)}
                                    onChange={(value) => setValue("invoicecomments", value)}
                                    valueDefault={getValues("invoicecomments")}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldSelect
                                    className="col-3"
                                    data={dataCurrency}
                                    disabled={invoicehasreport}
                                    error={errors?.invoicecurrency?.message}
                                    label={t(langKeys.currency)}
                                    onChange={(value) => setValue("invoicecurrency", value?.value)}
                                    optionDesc="description"
                                    optionValue="value"
                                    orderbylabel={true}
                                    valueDefault={getValues("invoicecurrency")}
                                />
                                <FieldEdit
                                    className="col-3"
                                    disabled={true}
                                    error={errors?.invoicetotalamount?.message}
                                    label={t(langKeys.taxbase)}
                                    valueDefault={formatNumber(getValues("invoicetotalamount") || 0)}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.billingtax)}
                                    value={formatNumber(amountTax || 0)}
                                />
                                <FieldView
                                    className="col-3"
                                    label={t(langKeys.totalamount)}
                                    value={formatNumber(amountTotal || 0)}
                                />
                            </div>
                            <div className="row-zyx">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.description)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.measureunit)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.unitaryprice)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.quantity)} />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView label={""} value={t(langKeys.billingsubtotal)} />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="add"
                                                        color="primary"
                                                        disabled={invoicehasreport}
                                                        size="small"
                                                        style={{ marginLeft: "1rem" }}
                                                        onClick={() =>
                                                            fieldsAppend({
                                                                productcode: "S001",
                                                                productdescription: "",
                                                                productmeasure: "ZZ",
                                                                productquantity: 0,
                                                                productsubtotal: 0.0,
                                                            })
                                                        }
                                                    >
                                                        {" "}
                                                        <Add />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((item, i) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <FieldEditArray
                                                            disabled={invoicehasreport}
                                                            label={""}
                                                            error={
                                                                errors?.productdetail?.[i]?.productdescription?.message
                                                            }
                                                            fregister={{
                                                                ...register(`productdetail.${i}.productdescription`, {
                                                                    validate: (value: any) =>
                                                                        (value &&
                                                                            value.length &&
                                                                            value.length <= 250) ||
                                                                        (value.length < 250
                                                                            ? t(langKeys.field_required)
                                                                            : t(langKeys.validation250char)),
                                                                }),
                                                            }}
                                                            onChange={(value) =>
                                                                setValue(
                                                                    `productdetail.${i}.productdescription`,
                                                                    "" + value
                                                                )
                                                            }
                                                            valueDefault={getValues(
                                                                `productdetail.${i}.productdescription`
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldSelect
                                                            data={measureList.data}
                                                            disabled={invoicehasreport}
                                                            error={errors?.productdetail?.[i]?.productmeasure?.message}
                                                            label={""}
                                                            loading={measureList.loading}
                                                            optionDesc="description"
                                                            optionValue="code"
                                                            orderbylabel={true}
                                                            fregister={{
                                                                ...register(`productdetail.${i}.productmeasure`, {
                                                                    validate: (value: any) =>
                                                                        (value && value.length) ||
                                                                        t(langKeys.field_required),
                                                                }),
                                                            }}
                                                            onChange={(value) =>
                                                                setValue(
                                                                    `productdetail.${i}.productmeasure`,
                                                                    "" + value?.code
                                                                )
                                                            }
                                                            valueDefault={getValues(
                                                                `productdetail.${i}.productmeasure`
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldEditArray
                                                            disabled={invoicehasreport}
                                                            error={errors?.productdetail?.[i]?.productsubtotal?.message}
                                                            inputProps={{ step: "any" }}
                                                            label={""}
                                                            type="number"
                                                            fregister={{
                                                                ...register(`productdetail.${i}.productsubtotal`, {
                                                                    validate: (value: any) =>
                                                                        (value && value > 0) ||
                                                                        t(langKeys.field_required),
                                                                }),
                                                            }}
                                                            onChange={(value) => {
                                                                setValue(
                                                                    `productdetail.${i}.productsubtotal`,
                                                                    "" + value
                                                                );
                                                                onProductChange();
                                                            }}
                                                            valueDefault={getValues(
                                                                `productdetail.${i}.productsubtotal`
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldEditArray
                                                            disabled={invoicehasreport}
                                                            error={errors?.productdetail?.[i]?.productquantity?.message}
                                                            label={""}
                                                            type="number"
                                                            fregister={{
                                                                ...register(`productdetail.${i}.productquantity`, {
                                                                    validate: (value: any) =>
                                                                        (value && value > 0) ||
                                                                        t(langKeys.field_required),
                                                                }),
                                                            }}
                                                            onChange={(value) => {
                                                                setValue(
                                                                    `productdetail.${i}.productquantity`,
                                                                    "" + value
                                                                );
                                                                onProductChange();
                                                            }}
                                                            valueDefault={getValues(
                                                                `productdetail.${i}.productquantity`
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView
                                                            label={""}
                                                            value={formatNumber(
                                                                (getValues(`productdetail.${i}.productsubtotal`) || 0) *
                                                                (getValues(`productdetail.${i}.productquantity`) ||
                                                                    0)
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="add"
                                                            color="primary"
                                                            disabled={invoicehasreport}
                                                            size="small"
                                                            style={{ marginLeft: "1rem" }}
                                                            onClick={() => {
                                                                fieldRemove(i);
                                                                onProductChange();
                                                            }}
                                                        >
                                                            {" "}
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

const IDMESSAGINGPACKAGES = "IDMESSAGINGPACKAGES";
const MessagingPackages: React.FC<{ dataCorp: any; dataOrg: any }> = ({ dataCorp, dataOrg }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector((state) => state.main.mainData);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const user = useSelector((state) => state.login.validateToken.user);

    const [canRegister, setCanRegister] = useState(true);
    const [dataBalance, setDataBalance] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [viewSelected, setViewSelected] = useState("view-1");

    const [dataMain, setdataMain] = useState({
        all: true,
        balanceid: 0,
        corpid: user?.corpid ?? 0,
        operationtype: "",
        orgid: 0,
        type: "",
    });

    const transactionType = [
        { value: "HSM", description: t(langKeys.HSM) },
        { value: "MAIL", description: t(langKeys.MAIL) },
        { value: "SMS", description: t(langKeys.SMS) },
        { value: "GENERAL", description: t(langKeys.GENERAL) },
    ];
    const operationType = [
        { value: "ENVIO", description: t(langKeys.ENVIO) },
        { value: "COMPRA", description: t(langKeys.COMPRA) },
    ];

    const fetchData = () => dispatch(getCollection(selBalanceData(dataMain)));

    const search = () => dispatch(getCollection(selBalanceData(dataMain)));

    useEffect(() => {
        fetchData();

        if (user?.paymentmethod === "PREPAGO") {
            setCanRegister(true);
        }

        dispatch(
            setMemoryTable({
                id: IDMESSAGINGPACKAGES,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row: row, edit: false });
    };

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataBalance(
                mainResult.data.map((x) => ({
                    ...x,
                    descriptioncolumn: x.description ? x.description : t(langKeys.none),
                    documenttypecolumn: t(getInvoiceType(x.invoicetype)),
                    messagetemplatedesccolumn: x.messagetemplatedesc ? x.messagetemplatedesc : t(langKeys.none),
                    operationtypecolumn: t(x.operationtype),
                    typecolumn: t(x.type),
                    documentnumbercolumn:
                        x.serie && x.correlative
                            ? x.serie + "-" + x.correlative.toString().padStart(8, "0")
                            : "X000-00000000",
                }))
            );
        }
    }, [mainResult]);

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case "01":
                return "emissorinvoice";
            case "03":
                return "emissorticket";
            case "07":
                return "emissorcreditnote";
            default:
                return "emissornone";
        }
    };

    const columns = React.useMemo(
        () => [
            {
                accessor: "corpdesc",
                Header: t(langKeys.corporation),
            },
            {
                accessor: "orgdesc",
                Header: t(langKeys.organization),
            },
            {
                accessor: "transactiondate",
                Header: t(langKeys.transactiondate),
            },
            {
                accessor: "transactionuser",
                Header: t(langKeys.user),
            },
            {
                accessor: "typecolumn",
                Header: t(langKeys.transactionmessagetype),
            },
            {
                accessor: "descriptioncolumn",
                Header: t(langKeys.transactionreference),
            },
            {
                accessor: "amount",
                Header: t(langKeys.amount),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { amount } = props.cell.row.original;
                    return formatNumber(amount || 0);
                },
            },
            {
                accessor: "balance",
                Header: t(langKeys.transactionbalance),
                sortType: "number",
                type: "number",
                Cell: (props: any) => {
                    const { balance } = props.cell.row.original;
                    return formatNumber(balance || 0);
                },
            },
            {
                accessor: "operationtypecolumn",
                Header: t(langKeys.transactionoperationtype),
            },
            {
                accessor: "messagetemplatedesccolumn",
                Header: t(langKeys.template),
            },
            {
                accessor: "documenttypecolumn",
                Header: t(langKeys.documenttype),
            },
            {
                accessor: "documentnumbercolumn",
                Header: t(langKeys.billingvoucher),
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber =
                        (props.cell.row.original.serie ? props.cell.row.original.serie : "X000") +
                        "-" +
                        (props.cell.row.original.correlative
                            ? props.cell.row.original.correlative.toString().padStart(8, "0")
                            : "00000000");
                    return (
                        <Fragment>
                            <div>
                                {urlpdf ? (
                                    <a
                                        href={urlpdf}
                                        rel="noreferrer"
                                        style={{ display: "block" }}
                                        target="_blank"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        {docnumber}
                                    </a>
                                ) : (
                                    <span style={{ display: "block" }}>{docnumber}</span>
                                )}
                            </div>
                        </Fragment>
                    );
                },
            },
        ],
        []
    );

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={dataCorp}
                                label={t(langKeys.corporation)}
                                optionDesc="description"
                                optionValue="corpid"
                                orderbylabel={true}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P", "ADMINISTRADOR LIMADERMA"].includes(
                                    user?.roledesc ?? ""
                                )}
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))
                                }
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                label={t(langKeys.organization)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, orgid: value?.orgid || 0 }))}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                data={dataOrg.filter((e: any) => {
                                    return e.corpid === dataMain.corpid;
                                })}
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={transactionType}
                                label={t(langKeys.transactionmessagetype)}
                                onChange={(value) => setdataMain((prev) => ({ ...prev, type: value?.value || "" }))}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={dataMain.type}
                                variant="outlined"
                            />
                            <FieldSelect
                                className={classes.fieldsfilter}
                                data={operationType}
                                label={t(langKeys.transactionoperationtype)}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                                valueDefault={dataMain.operationtype}
                                variant="outlined"
                                onChange={(value) =>
                                    setdataMain((prev) => ({ ...prev, operationtype: value?.value || "" }))
                                }
                            />
                            <Button
                                color="primary"
                                disabled={mainResult.loading || false}
                                onClick={search}
                                startIcon={<Search style={{ color: "white" }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={dataBalance}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    loading={mainResult.loading}
                    onClickRow={handleView}
                    register={canRegister}
                    registertext={t(langKeys.transactionbuy)}
                    initialPageIndex={
                        IDMESSAGINGPACKAGES === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDMESSAGINGPACKAGES === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDMESSAGINGPACKAGES === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </div>
        );
    } else {
        return <MessagingPackagesDetail fetchData={fetchData} data={rowSelected} setViewSelected={setViewSelected} />;
    }
};

const MessagingPackagesDetail: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiSelector = useSelector((state) => state.culqi.request);
    const exchangeRequest = useSelector((state) => state.culqi.requestGetExchangeRate);
    const mainResult = useSelector((state) => state.main);
    const multiResult = useSelector((state) => state.main.multiDataAux);
    const user = useSelector((state) => state.login.validateToken.user);

    const [afterAmount, setAfterAmount] = useState(0);
    const [balanceSent, setBalanceSent] = useState<any>([]);
    const [beforeAmount, setBeforeAmount] = useState(0);
    const [buyAmount, setBuyAmount] = useState(0);
    const [buyAmountError, setBuyAmountError] = useState("");
    const [cardList, setCardList] = useState<any>([]);
    const [comments, setComments] = useState("");
    const [commentsError, setCommentsError] = useState("");
    const [confirmButton, setConfirmButton] = useState(true);
    const [corp, setCorp] = useState(0);
    const [corpError, setCorpError] = useState("");
    const [corpList, setCorpList] = useState<any>([]);
    const [currentBillbyorg, setCurrentBillbyorg] = useState(false);
    const [currentCountry, setCurrentCountry] = useState("");
    const [currentDoctype, setCurrentDoctype] = useState("");
    const [detractionAlert, setDetractionAlert] = useState(false);
    const [detractionAmount, setDetractionAmount] = useState(0);
    const [disableInput, setDisableInput] = useState(data?.row ? true : false);
    const [favoriteCardCode, setFavoriteCardCode] = useState("");
    const [favoriteCardId, setFavoriteCardId] = useState(0);
    const [favoriteCardNumber, setFavoriteCardNumber] = useState("");
    const [messagingList, setMessagingList] = useState<any>([]);
    const [org, setOrg] = useState(0);
    const [orgError, setOrgError] = useState("");
    const [orgList, setOrgList] = useState<any>([]);
    const [paymentCardCode, setPaymentCardCode] = useState("");
    const [paymentCardId, setPaymentCardId] = useState(0);
    const [paymentDisabled, setPaymentDisabled] = useState(false);
    const [paymentTax, setPaymentTax] = useState(0);
    const [paymentType, setPaymentType] = useState("FAVORITE");
    const [priceHsm, setPriceHsm] = useState(0);
    const [priceMail, setPriceMail] = useState(0);
    const [priceSms, setPriceSms] = useState(0);
    const [publicKey, setPublicKey] = useState("");
    const [purchaseOrder, setPurchaseOrder] = useState("");
    const [purchaseOrderError, setPurchaseOrderError] = useState("");
    const [reference, setReference] = useState("");
    const [referenceError, setReferenceError] = useState("");
    const [showCulqi, setShowCulqi] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalPay, setTotalPay] = useState(0);
    const [waitPay, setWaitPay] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const dataPayment = [
        { val: "FAVORITE", description: t(langKeys.paymentfavorite) },
        { val: "CARD", description: t(langKeys.paymentcard) },
        { val: "CULQI", description: t(langKeys.paymentculqi) },
    ];

    const handlePay = () => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(
                balance({
                    buyamount: buyAmount,
                    comments: comments,
                    corpid: corp,
                    invoiceid: data?.invoiceid,
                    iscard: true,
                    metadata: {},
                    orgid: org,
                    paymentcardcode: paymentCardCode,
                    paymentcardid: paymentCardId,
                    purchaseorder: purchaseOrder,
                    reference: reference,
                    token: null,
                    totalamount: totalAmount,
                    totalpay: totalPay,
                    settings: {
                        amount: Math.round((totalPay * 100 + Number.EPSILON) * 100) / 100,
                        currency: "USD",
                        description: reference,
                        title: reference,
                    },
                })
            );
            setWaitPay(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_payment),
                visible: true,
            })
        );
    };

    const handleCulqiSuccess = () => {
        setViewSelected("view-1");
        fetchData && fetchData();
    };

    useEffect(() => {
        setMessagingList({ loading: true, data: [] });
        setCorpList({ loading: true, data: [] });
        setOrgList({ loading: false, data: [] });

        dispatch(
            getMultiCollectionAux([
                getCorpSel(
                    ["ADMINISTRADOR", "ADMINISTRADOR P", "ADMINISTRADOR LIMADERMA"].includes(user?.roledesc || "")
                        ? user?.corpid ?? 0
                        : 0
                ),
                getBillingMessagingCurrent(new Date().getFullYear(), new Date().getMonth(), user?.countrycode ?? ""),
                listPaymentCard({ corpid: user?.corpid ?? 0, id: 0, orgid: 0 }),
            ])
        );

        if (data?.row === null) {
            dispatch(getCollection(getAppsettingInvoiceSel()));
            dispatch(getExchangeRate(null));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        } else {
            if (data?.row?.operationtype === "ENVIO") {
                setBalanceSent({ loading: true, data: [] });
                dispatch(
                    getMultiCollectionAux([
                        getBalanceSelSent(
                            data?.row?.corpid,
                            data?.row?.orgid,
                            data?.row?.transactiondate,
                            data?.row?.type,
                            data?.row?.module,
                            data?.row?.messagetemplateid
                        ),
                    ])
                );
            }
        }
    }, []);

    useEffect(() => {
        const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_CORP_SEL");

        if (indexCorp > -1) {
            setCorpList({
                loading: false,
                data:
                    multiResult.data[indexCorp] && multiResult.data[indexCorp].success
                        ? multiResult.data[indexCorp].data
                        : [],
            });
        }

        const indexOrg = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_ORG_SEL");

        if (indexOrg > -1) {
            setOrgList({
                loading: false,
                data:
                    multiResult.data[indexOrg] && multiResult.data[indexOrg].success
                        ? multiResult.data[indexOrg].data
                        : [],
            });
        }

        const indexMessaging = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_BILLINGMESSAGING_CURRENT");

        if (indexMessaging > -1) {
            setMessagingList({
                loading: false,
                data:
                    multiResult.data[indexMessaging] && multiResult.data[indexMessaging].success
                        ? multiResult.data[indexMessaging].data
                        : [],
            });
        }

        const indexSent = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_BALANCE_SEL_SENT");

        if (indexSent > -1) {
            setBalanceSent({
                loading: false,
                data:
                    multiResult.data[indexSent] && multiResult.data[indexSent].success
                        ? multiResult.data[indexSent].data
                        : [],
            });
        }

        const indexCard = multiResult.data.findIndex((x: MultiData) => x.key === "UFN_PAYMENTCARD_LST");

        if (indexCard > -1) {
            setCardList({
                loading: false,
                data:
                    multiResult.data[indexCard] && multiResult.data[indexCard].success
                        ? multiResult.data[indexCard].data
                        : [],
            });
        }
    }, [multiResult]);

    useEffect(() => {
        if (cardList) {
            if (cardList.data) {
                if (cardList.data.length > 0) {
                    let favoriteCard = cardList.data.find((o: { favorite: boolean }) => o.favorite === true);

                    if (favoriteCard) {
                        setFavoriteCardCode(favoriteCard.cardcode);
                        setFavoriteCardId(favoriteCard.paymentcardid);
                        setFavoriteCardNumber(favoriteCard.cardnumber);
                        setPaymentCardCode(favoriteCard.cardcode);
                        setPaymentCardId(favoriteCard.paymentcardid);
                    }
                }
            }
        }
    }, [cardList]);

    useEffect(() => {
        if (paymentType) {
            if (paymentType === "FAVORITE") {
                setPaymentCardId(favoriteCardId);
                setPaymentCardCode(favoriteCardCode);
            }

            if (paymentType === "CARD" || paymentType === "CULQI") {
                setPaymentCardId(0);
                setPaymentCardCode("");
            }
        }
    }, [paymentType]);

    useEffect(() => {
        if (waitPay) {
            if (!culqiSelector.loading && culqiSelector.data) {
                dispatch(
                    showSnackbar({
                        message: t(culqiSelector.message ?? langKeys.success),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                dispatch(resetBalance());
                handleCulqiSuccess && handleCulqiSuccess();
                setWaitPay(false);
            } else if (culqiSelector.error) {
                dispatch(
                    showSnackbar({
                        message: t(culqiSelector.message ?? "error_unexpected_db_error"),
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                dispatch(resetBalance());
                setWaitPay(false);
            }
        }
    }, [culqiSelector, waitPay]);

    useEffect(() => {
        if (!messagingList.loading) {
            if (messagingList.data) {
                setPriceHsm((messagingList.data[0].companystartfee || 0) + (messagingList.data[0].vcacomission || 0));
                setPriceSms((messagingList.data[0].pricepersms || 0) + (messagingList.data[0].vcacomissionpersms || 0));
                setPriceMail(
                    (messagingList.data[0].pricepermail || 0) + (messagingList.data[0].vcacomissionpermail || 0)
                );
            }
        }
    }, [messagingList]);

    useEffect(() => {
        updateTotalPay(buyAmount);
    }, [currentCountry, currentDoctype, buyAmount, totalPay, totalAmount]);

    useEffect(() => {
        if (
            buyAmount &&
            buyAmount > 0 &&
            comments.length <= 150 &&
            corp &&
            org &&
            purchaseOrder.length <= 15 &&
            reference &&
            totalPay &&
            totalPay > 0
        ) {
            setPaymentDisabled(false);
            setConfirmButton(false);
        } else {
            setPaymentDisabled(true);
            setConfirmButton(true);
        }
    }, [corp, org, comments, purchaseOrder, reference, buyAmount, totalPay]);

    useEffect(() => {
        if (waitSave) {
            if (!mainResult.mainData.loading && !exchangeRequest.loading) {
                dispatch(showBackdrop(false));

                if (mainResult.mainData.data) {
                    if (mainResult.mainData.data[0]) {
                        let appsetting = mainResult.mainData.data[0];

                        setPublicKey(appsetting.publickey);
                    }
                }
            }
        }
    }, [mainResult, exchangeRequest, waitSave]);

    const updateTotalPay = (buyAmount: number) => {
        if (currentCountry && currentDoctype) {
            if (currentCountry === "PE") {
                setTotalAmount(
                    Math.round(
                        ((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0)) + Number.EPSILON) * 100
                    ) / 100
                );
                if (currentDoctype === "6") {
                    let compareamount = (buyAmount || 0) * (exchangeRequest?.exchangerate ?? 0);

                    if (compareamount > mainResult.mainData.data[0].detractionminimum) {
                        setTotalPay(
                            Math.round(
                                ((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0)) -
                                    (buyAmount || 0) *
                                    (1 + (mainResult.mainData.data[0].igv || 0)) *
                                    (mainResult.mainData.data[0].detraction || 0) +
                                    Number.EPSILON) *
                                100
                            ) / 100
                        );
                        setDetractionAlert(true);
                        setDetractionAmount(
                            Math.round(((mainResult.mainData.data[0].detraction || 0) * 100 + Number.EPSILON) * 100) /
                            100
                        );
                        setPaymentTax(
                            Math.round(
                                ((buyAmount || 0) * (mainResult.mainData.data[0].igv || 0) + Number.EPSILON) * 100
                            ) / 100
                        );
                    } else {
                        setDetractionAlert(false);
                        setTotalPay(
                            Math.round(
                                ((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0)) + Number.EPSILON) * 100
                            ) / 100
                        );
                        setPaymentTax(
                            Math.round(
                                ((buyAmount || 0) * (mainResult.mainData.data[0].igv || 0) + Number.EPSILON) * 100
                            ) / 100
                        );
                    }
                } else {
                    setDetractionAlert(false);
                    setTotalPay(
                        Math.round(
                            ((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0)) + Number.EPSILON) * 100
                        ) / 100
                    );
                    setPaymentTax(
                        Math.round(((buyAmount || 0) * (mainResult.mainData.data[0].igv || 0) + Number.EPSILON) * 100) /
                        100
                    );
                }
            } else {
                setTotalAmount(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
                setDetractionAlert(false);
                setTotalPay(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
                setPaymentTax(0);
            }
        } else {
            setTotalAmount(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
            setDetractionAlert(false);
            setTotalPay(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
            setPaymentTax(0);
        }
        setAfterAmount(beforeAmount + totalAmount);
    };

    const handleCorp = (value: any) => {
        dispatch(getMultiCollectionAux([getOrgSel(0, value)]));

        if (value) {
            let corporationdata = corpList.data.find((x: { corpid: any }) => x.corpid === value);

            if (corporationdata) {
                setCurrentBillbyorg(corporationdata?.billbyorg);

                if (corporationdata.billbyorg === false) {
                    setCurrentCountry(corporationdata?.sunatcountry);
                    setCurrentDoctype(corporationdata?.doctype);
                }
            }
        }

        setCorp(value);
        setCorpError(value ? "" : t(langKeys.required));
    };

    const handleOrg = (value: any) => {
        if (value) {
            let organizationdata = orgList.data.find((x: { orgid: any }) => x.orgid === value);

            if (organizationdata) {
                setBeforeAmount(organizationdata?.balance || 0);
                setAfterAmount((organizationdata?.balance || 0) + totalAmount);

                if (currentBillbyorg) {
                    setCurrentCountry(organizationdata?.sunatcountry);
                    setCurrentDoctype(organizationdata?.doctype);
                }
            }
        } else {
            setBeforeAmount(0);
            setAfterAmount(totalAmount);
        }

        setOrg(value);
        setOrgError(value ? "" : t(langKeys.required));
    };

    const handleReference = (value: any) => {
        setReference(value);
        setReferenceError(value ? "" : t(langKeys.required));
    };

    const handleBuyAmount = (value: any) => {
        setBuyAmount(parseFloat(value));
        setBuyAmountError(value && value > 0 ? "" : t(langKeys.required));
    };

    const handlePurchaseOrder = (value: any) => {
        setPurchaseOrder(value);
        setPurchaseOrderError(value.length > 15 ? t(langKeys.validation15char) : "");
    };

    const handleComments = (value: any) => {
        setComments(value);
        setCommentsError(value.length > 150 ? t(langKeys.validation150char) : "");
    };

    const handleShowCulqi = () => {
        if (showCulqi) {
            setShowCulqi(false);
            setDisableInput(false);
        } else {
            setShowCulqi(true);
            setDisableInput(true);
        }
    };

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case "01":
                return "emissorinvoice";
            case "03":
                return "emissorticket";
            case "07":
                return "emissorcreditnote";
            default:
                return "emissornone";
        }
    };

    const paymentBread = [
        { id: "view-1", name: t(langKeys.messagingpackages) },
        { id: "view-2", name: data?.edit ? t(langKeys.messagingpackagesnew) : t(langKeys.messagingpackagesdetail) },
    ];

    return (
        <div style={{ width: "100%" }}>
            <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={paymentBread}
                            handleClick={(id) => {
                                setViewSelected(id);
                                fetchData();
                            }}
                        />
                        <TitleDetail
                            title={data?.edit ? t(langKeys.messagingpackagesnew) : t(langKeys.messagingpackagesdetail)}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                            onClick={() => {
                                setViewSelected("view-1");
                                fetchData && fetchData();
                            }}
                        >
                            {t(langKeys.back)}
                        </Button>
                        {data?.edit && (
                            <Button
                                color="primary"
                                disabled={confirmButton}
                                onClick={() => handleShowCulqi()}
                                startIcon={showCulqi ? <ClearIcon color="secondary" /> : <SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="button"
                                variant="contained"
                            >
                                {showCulqi ? t(langKeys.cancel) : t(langKeys.transactionconfirm)}
                            </Button>
                        )}
                        {paymentType === "CULQI" && publicKey && showCulqi && (
                            <CulqiModal
                                amount={Math.round((totalPay * 100 + Number.EPSILON) * 100) / 100}
                                buttontitle={t(langKeys.proceedpayment)}
                                buyamount={buyAmount}
                                comments={comments}
                                corpid={corp}
                                currency={"USD"}
                                description={reference}
                                disabled={paymentDisabled}
                                invoiceid={0}
                                orgid={org}
                                publickey={publicKey}
                                purchaseorder={purchaseOrder}
                                reference={reference}
                                successmessage={t(langKeys.culqipaysuccess)}
                                title={reference}
                                totalamount={totalAmount}
                                totalpay={totalPay}
                                type="BALANCE"
                                callbackOnSuccess={() => {
                                    handleCulqiSuccess();
                                }}
                            ></CulqiModal>
                        )}
                        {(paymentType === "FAVORITE" || paymentType === "CARD") && showCulqi && (
                            <Button
                                color="primary"
                                disabled={paymentDisabled || !paymentCardId || !paymentCardCode}
                                onClick={handlePay}
                                startIcon={<AttachMoneyIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                type="button"
                                variant="contained"
                            >
                                {t(langKeys.proceedpayment)}
                            </Button>
                        )}
                    </div>
                </div>
                <div style={{ backgroundColor: "white", padding: 16 }}>
                    {(!disableInput || data?.edit === false) && (
                        <div>
                            <div className="row-zyx">
                                {data?.edit ? (
                                    <FieldSelect
                                        className="col-6"
                                        data={corpList.data}
                                        disabled={disableInput}
                                        error={corpError}
                                        label={t(langKeys.corporation)}
                                        loading={corpList.loading}
                                        optionDesc="description"
                                        optionValue="corpid"
                                        orderbylabel={true}
                                        valueDefault={corp}
                                        onChange={(value) => {
                                            handleCorp(value?.corpid || 0);
                                        }}
                                    />
                                ) : (
                                    <FieldView
                                        className="col-6"
                                        label={t(langKeys.corporation)}
                                        value={data?.row?.corpdesc}
                                    />
                                )}
                                {data?.edit ? (
                                    <FieldSelect
                                        className="col-6"
                                        data={orgList.data}
                                        disabled={disableInput}
                                        error={orgError}
                                        label={t(langKeys.organization)}
                                        loading={orgList.loading}
                                        optionDesc="orgdesc"
                                        optionValue="orgid"
                                        orderbylabel={true}
                                        valueDefault={org}
                                        onChange={(value) => {
                                            handleOrg(value?.orgid || 0);
                                        }}
                                    />
                                ) : (
                                    <FieldView
                                        className="col-6"
                                        label={t(langKeys.organization)}
                                        value={data?.row?.orgdesc}
                                    />
                                )}
                            </div>
                            <div className="row-zyx">
                                {data?.edit ? (
                                    <FieldEdit
                                        className="col-12"
                                        disabled={disableInput}
                                        error={referenceError}
                                        label={t(langKeys.transactionreference)}
                                        onChange={(value) => handleReference(value)}
                                        valueDefault={reference}
                                    />
                                ) : (
                                    <FieldView
                                        className="col-12"
                                        label={t(langKeys.transactionreference)}
                                        value={data?.row?.description || t(langKeys.none)}
                                    />
                                )}
                            </div>
                            {data?.row?.operationtype !== "ENVIO" && (
                                <div className="row-zyx">
                                    {data?.edit ? (
                                        <FieldEdit
                                            className="col-4"
                                            disabled={disableInput}
                                            error={buyAmountError}
                                            inputProps={{ step: "any" }}
                                            label={t(langKeys.transactionbuyamount)}
                                            onChange={(value) => handleBuyAmount(value || 0)}
                                            type="number"
                                            valueDefault={buyAmount}
                                        />
                                    ) : (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.transactionbuyamount)}
                                            value={formatNumber(data?.row?.subtotal || 0)}
                                        />
                                    )}
                                    {data?.edit ? (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.billingtaxes)}
                                            value={"$" + formatNumber(paymentTax || 0)}
                                        />
                                    ) : (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.billingtaxes)}
                                            value={"$" + formatNumber(data?.row?.taxes || 0)}
                                        />
                                    )}
                                    {data?.edit ? (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.totalamount)}
                                            value={"$" + formatNumber(totalAmount || 0)}
                                        />
                                    ) : (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.totalamount)}
                                            value={"$" + formatNumber(data?.row?.amount || 0)}
                                        />
                                    )}
                                </div>
                            )}
                            <div className="row-zyx">
                                {data?.edit ? (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.transactionlastbalance)}
                                        value={"$" + formatNumber(beforeAmount || 0)}
                                    />
                                ) : (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.transactionlastbalance)}
                                        value={"$" + formatNumber(data?.row?.balance - data?.row?.amount || 0)}
                                    />
                                )}
                                {data?.edit ? (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.totalamount)}
                                        value={"$" + formatNumber(totalAmount || 0)}
                                    />
                                ) : (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.totalamount)}
                                        value={"$" + formatNumber(data?.row?.amount || 0)}
                                    />
                                )}
                                {data?.edit ? (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.transactionafterbalance)}
                                        value={"$" + formatNumber(afterAmount || 0)}
                                    />
                                ) : (
                                    <FieldView
                                        className="col-4"
                                        label={t(langKeys.transactionafterbalance)}
                                        value={"$" + formatNumber(data?.row?.balance || 0)}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    {disableInput && (
                        <div>
                            {data?.edit && (
                                <div className="row-zyx">
                                    <FieldView
                                        className={classes.section}
                                        label={""}
                                        value={t(langKeys.paymentmethod)}
                                    />
                                </div>
                            )}
                            {data?.edit && (
                                <div className="row-zyx">
                                    <FieldSelect
                                        className="col-6"
                                        data={dataPayment}
                                        label={t(langKeys.paymentmethodtype)}
                                        optionDesc="description"
                                        optionValue="val"
                                        orderbylabel={true}
                                        valueDefault={paymentType}
                                        onChange={(value) => {
                                            setPaymentType(value?.val || 0);
                                        }}
                                    />
                                    {paymentType === "CARD" && (
                                        <FieldSelect
                                            className="col-6"
                                            label={t(langKeys.paymentmethodcard)}
                                            loading={cardList.loading}
                                            optionDesc="cardnumber"
                                            optionValue="paymentcardid"
                                            orderbylabel={true}
                                            valueDefault={paymentCardId}
                                            data={
                                                cardList.data
                                                    ? cardList.data.filter(
                                                        (e: { favorite: boolean }) => e.favorite !== true
                                                    )
                                                    : []
                                            }
                                            onChange={(value) => {
                                                setPaymentCardCode(value?.cardcode || "");
                                                setPaymentCardId(value?.paymentcardid || 0);
                                            }}
                                        />
                                    )}
                                    {paymentType === "FAVORITE" && (
                                        <FieldEdit
                                            className="col-6"
                                            disabled={true}
                                            label={t(langKeys.paymentmethodcard)}
                                            valueDefault={favoriteCardNumber}
                                        />
                                    )}
                                </div>
                            )}
                            {(data?.edit || data?.row?.operationtype === "COMPRA") && (
                                <div className="row-zyx">
                                    <FieldView
                                        className={classes.section}
                                        label={""}
                                        value={t(langKeys.paymentinformation)}
                                    />
                                </div>
                            )}
                            {(data?.edit || data?.row?.operationtype === "COMPRA") && (
                                <div className="row-zyx">
                                    {data?.edit && (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.servicedescription)}
                                            value={
                                                t(langKeys.transactionrechargetitle) +
                                                toISOLocalString(new Date()).split("T")[0]
                                            }
                                        />
                                    )}
                                    {data?.row?.operationtype === "COMPRA" && (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.servicedescription)}
                                            value={
                                                t(langKeys.transactionrechargetitle) +
                                                toISOLocalString(new Date(data?.row?.createdate)).split("T")[0]
                                            }
                                        />
                                    )}
                                    {data?.edit && (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.totalamount)}
                                            value={"$" + formatNumber(totalAmount || 0)}
                                        />
                                    )}
                                    {data?.row?.operationtype === "COMPRA" && (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.totalamount)}
                                            value={"$" + formatNumber(data?.row?.amount || 0)}
                                        />
                                    )}
                                    {data?.edit && (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.totaltopay)}
                                            value={"$" + formatNumber(totalPay || 0)}
                                        />
                                    )}
                                    {data?.row?.operationtype === "COMPRA" && (
                                        <FieldView
                                            className="col-4"
                                            label={t(langKeys.totaltopay)}
                                            value={"$" + formatNumber(data?.row?.culqiamount || 0)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {data?.row?.operationtype === "COMPRA" && (
                        <div className="row-zyx">
                            <FieldView
                                className="col-4"
                                label={t(langKeys.documenttype)}
                                value={t(getInvoiceType(data?.row?.invoicetype))}
                            />
                            <FieldView
                                className="col-4"
                                label={t(langKeys.billingvoucher)}
                                onclick={() => {
                                    if (data?.row?.urlpdf) {
                                        window.open(data?.row?.urlpdf, "_blank");
                                    }
                                }}
                                styles={
                                    data?.row?.urlpdf
                                        ? { cursor: "pointer", textDecoration: "underline", color: "blue" }
                                        : undefined
                                }
                                value={
                                    (data?.row?.serie ? data?.row?.serie : "X000") +
                                    "-" +
                                    (data?.row?.correlative
                                        ? data?.row?.correlative.toString().padStart(8, "0")
                                        : "00000000")
                                }
                            />
                            <FieldView
                                className="col-4"
                                label={t(langKeys.purchaseorder)}
                                value={data?.row?.purchaseorder || t(langKeys.none)}
                            />
                        </div>
                    )}
                    {data?.row?.operationtype === "ENVIO" && (
                        <div className="row-zyx">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.transactionmessagetype)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.transactionreceiver)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.transactioncost)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.transactiondatetime)} />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView label={""} value={t(langKeys.user)} />
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {balanceSent?.data?.map(function (file: any) {
                                            return (
                                                <TableRow>
                                                    <TableCell>
                                                        <FieldView label={""} value={t(file?.type || langKeys.none)} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView label={""} value={file?.receiver} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView
                                                            label={""}
                                                            value={formatNumberFourDecimals(file?.amount || 0)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView
                                                            label={""}
                                                            value={toISOLocalString(new Date(file?.createdate))
                                                                .replace("T", " ")
                                                                .substring(0, 19)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldView label={""} value={file?.transactionuser} />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                    {!disableInput && (
                        <div>
                            <div className="row-zyx">
                                <FieldView
                                    className={classes.section}
                                    label={""}
                                    value={t(langKeys.transactioninformation)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.pricemessagesms)}
                                    value={"$" + formatNumberFourDecimals(priceSms || 0)}
                                />
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.pricemessagemail)}
                                    value={"$" + formatNumberFourDecimals(priceMail || 0)}
                                />
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.pricemessagehsm)}
                                    value={"$" + formatNumberFourDecimals(priceHsm || 0)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className={classes.commentary}
                                    label={""}
                                    value={t(langKeys.pricemessagenote1)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className={classes.commentary}
                                    label={""}
                                    value={t(langKeys.pricemessagenote2)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className={classes.commentary}
                                    label={""}
                                    value={t(langKeys.pricemessagenote)}
                                />
                                <a
                                    href={"https://developers.facebook.com/docs/whatsapp/pricing"}
                                    rel="noreferrer"
                                    style={{ display: "block" }}
                                    target="_blank"
                                >
                                    {"https://developers.facebook.com/docs/whatsapp/pricing"}
                                </a>
                            </div>
                        </div>
                    )}
                    {disableInput && (
                        <div>
                            {data?.edit && detractionAlert && (
                                <div className="row-zyx">
                                    <FieldView
                                        className={classes.commentary}
                                        label={""}
                                        value={
                                            t(langKeys.detractionnotepay1) +
                                            `${detractionAmount}` +
                                            t(langKeys.detractionnotepay2)
                                        }
                                    />
                                </div>
                            )}
                            {data?.edit && (
                                <div className="row-zyx">
                                    <FieldView
                                        className={classes.section}
                                        label={""}
                                        value={t(langKeys.additional_information)}
                                    />
                                </div>
                            )}
                            {data?.edit && (
                                <div className="row-zyx">
                                    <FieldView
                                        className={classes.commentary}
                                        label={""}
                                        value={t(langKeys.additionalinformation2)}
                                    />
                                </div>
                            )}
                            {data?.edit && (
                                <div className="row-zyx">
                                    <FieldEdit
                                        className="col-12"
                                        disabled={!disableInput}
                                        error={purchaseOrderError}
                                        label={t(langKeys.purchaseorder)}
                                        onChange={(value) => handlePurchaseOrder(value)}
                                        valueDefault={purchaseOrder}
                                    />
                                </div>
                            )}
                            {data?.edit && (
                                <div className="row-zyx">
                                    <FieldEdit
                                        className="col-12"
                                        disabled={!disableInput}
                                        error={commentsError}
                                        label={t(langKeys.comments)}
                                        onChange={(value) => handleComments(value)}
                                        valueDefault={comments}
                                    />
                                </div>
                            )}
                            {data?.edit && (
                                <div className="row-zyx">
                                    <FieldView
                                        className={classes.commentary}
                                        label={""}
                                        value={t(langKeys.additionalinformation1)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const IDPAYMENTMETHODS = "IDPAYMENTMETHODS";
const PaymentMethods: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const deleteRequest = useSelector((state) => state.culqi.requestCardDelete);
    const executeRequest = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main.mainData);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataPaymentMethods, setDataPaymentMethods] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: true });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitDelete, setWaitDelete] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const fetchData = () =>
        dispatch(
            getCollection(
                listPaymentCard({
                    corpid: user?.corpid ?? 0,
                    id: 0,
                    orgid: 0,
                })
            )
        );

    useEffect(() => {
        fetchData();

        dispatch(
            setMemoryTable({
                id: IDPAYMENTMETHODS,
            })
        );

        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row: row, edit: false });
    };

    const handleDelete = (row: Dictionary) => {
        if (row.favorite) {
            dispatch(
                showSnackbar({ severity: "error", show: true, message: t(langKeys.paymentmethod_preferreddelete) })
            );
        } else {
            const callback = () => {
                dispatch(cardDelete(row));
                dispatch(showBackdrop(true));
                setWaitDelete(true);
            };

            dispatch(
                manageConfirmation({
                    callback,
                    question: t(langKeys.confirmation_delete),
                    visible: true,
                })
            );
        }
    };

    const handleFavorite = (row: Dictionary) => {
        row.favorite = true;
        row.username = user?.usr;

        const callback = () => {
            dispatch(execute(paymentCardInsert(row)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_paymentcard),
                visible: true,
            })
        );
    };

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataPaymentMethods(
                mainResult.data.map((x) => ({
                    ...x,
                    favoritecolumn: t(x.favorite ? langKeys.affirmative : langKeys.negative),
                }))
            );
        }
    }, [mainResult]);

    useEffect(() => {
        if (waitDelete) {
            if (!deleteRequest.loading && !deleteRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                dispatch(showBackdrop(false));
                fetchData && fetchData();
                setWaitDelete(false);
            } else if (deleteRequest.error) {
                dispatch(
                    showSnackbar({
                        message: t(deleteRequest.msg ?? deleteRequest.code ?? "error_unexpected_error"),
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [deleteRequest, waitDelete]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRequest.loading && !executeRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.markpreferred_success) }));
                dispatch(showBackdrop(false));
                fetchData && fetchData();
                setWaitSave(false);
            } else if (executeRequest.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeRequest.code ?? "error_unexpected_error", {
                            module: t(langKeys.organization_plural).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRequest, waitSave]);

    const columns = React.useMemo(
        () => [
            {
                accessor: "corpid",
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            extraFunction={row.favorite ? undefined : () => handleFavorite(row)}
                            extraOption={row.favorite ? undefined : t(langKeys.markpreferred)}
                        />
                    );
                },
            },
            {
                accessor: "firstname",
                Header: t(langKeys.name_plural),
            },
            {
                accessor: "lastname",
                Header: t(langKeys.paymentorder_lastname),
            },
            {
                accessor: "mail",
                Header: t(langKeys.ticket_email),
            },
            {
                accessor: "phone",
                Header: t(langKeys.phone),
            },
            {
                accessor: "cardnumber",
                Header: t(langKeys.creditcardnumber),
            },
            {
                accessor: "favoritecolumn",
                Header: t(langKeys.preferred),
            },
        ],
        []
    );

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <TableZyx
                    columns={columns}
                    data={dataPaymentMethods}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    loading={mainResult.loading}
                    onClickRow={handleView}
                    register={true}
                    registertext={t(langKeys.create)}
                    initialPageIndex={
                        IDPAYMENTMETHODS === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDPAYMENTMETHODS === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    pageSizeDefault={
                        IDPAYMENTMETHODS === memoryTable.id
                            ? memoryTable.pageSize === -1
                                ? 20
                                : memoryTable.pageSize
                            : 20
                    }
                />
            </div>
        );
    } else {
        return <PaymentMethodsDetails data={rowSelected} fetchData={fetchData} setViewSelected={setViewSelected} />;
    }
};

const PaymentMethodsDetails: React.FC<DetailPropsPaymentMethod> = ({
    data: { edit, row },
    fetchData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const createRequest = useSelector((state) => state.culqi.requestCardCreate);

    const [checkedFavorite, setCheckedFavorite] = useState(row?.favorite || false);
    const [icon, setIcon] = useState(<></>);
    const [waitSave, setWaitSave] = useState(false);

    const datamonth = useMemo(
        () => [
            { id: 1, desc: "01" },
            { id: 2, desc: "02" },
            { id: 3, desc: "03" },
            { id: 4, desc: "04" },
            { id: 5, desc: "05" },
            { id: 6, desc: "06" },
            { id: 7, desc: "07" },
            { id: 8, desc: "08" },
            { id: 9, desc: "09" },
            { id: 10, desc: "10" },
            { id: 11, desc: "11" },
            { id: 12, desc: "12" },
        ],
        [t]
    );

    const arrayBreadPaymentMethods = [
        { id: "view-1", name: t(langKeys.paymentmethod) },
        { id: "view-2", name: t(langKeys.paymentmethodsdetail) },
    ];

    const emailRequired = (value: string) => {
        if (value.length === 0) {
            return t(langKeys.field_required);
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return t(langKeys.emailverification);
        }
    };

    const {
        control,
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
    } = useForm({
        defaultValues: {
            cardlimit: 16,
            cardnumber: row?.cardnumber || "",
            expirationmonth: row?.expirationmonth || "",
            expirationyear: row?.expirationyear || "",
            favorite: row?.favorite || false,
            firstname: row?.firstname || "",
            lastname: row?.lastname || "",
            mail: row?.mail || "",
            phone: row?.phone || "",
            securitycode: row?.securitycode || "",
        },
    });

    React.useEffect(() => {
        if (!edit) {
            if (row?.cardnumber) {
                if (row.cardnumber.slice(0, 1) === "4") {
                    setIcon(
                        <img
                            alt="aux"
                            src="https://static.culqi.com/v2/v2/static/img/visa.svg"
                            style={{ padding: 5 }}
                            width="50px"
                        ></img>
                    );
                    setValue("cardlimit", 19);
                } else if (row.cardnumber.slice(0, 2) === "51" || row.cardnumber.slice(0, 2) === "55") {
                    setIcon(
                        <img
                            alt="aux"
                            src="https://static.culqi.com/v2/v2/static/img/mastercard.svg"
                            style={{ padding: 5 }}
                            width="50px"
                        ></img>
                    );
                    setValue("cardlimit", 19);
                } else if (row.cardnumber.slice(0, 2) === "37" || row.cardnumber.slice(0, 2) === "34") {
                    setIcon(
                        <img
                            alt="aux"
                            src="https://static.culqi.com/v2/v2/static/img/amex.svg"
                            style={{ padding: 5 }}
                            width="50px"
                        ></img>
                    );
                    setValue("cardlimit", 18);
                } else if (
                    row.cardnumber.slice(0, 2) === "36" ||
                    row.cardnumber.slice(0, 2) === "38" ||
                    row.cardnumber.slice(0, 3) === "300" ||
                    row.cardnumber.slice(0, 3) === "305"
                ) {
                    setIcon(
                        <img
                            alt="aux"
                            src="https://static.culqi.com/v2/v2/static/img/diners.svg"
                            style={{ padding: 5 }}
                            width="50px"
                        ></img>
                    );
                    setValue("cardlimit", 17);
                } else {
                    setIcon(<></>);
                    setValue("cardlimit", 10);
                }
            }
        }
    }, [edit]);

    React.useEffect(() => {
        register("cardlimit");
        register("expirationmonth", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("favorite");
        register("firstname", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("lastname", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("mail", { validate: emailRequired, value: "" });
        register("phone", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("securitycode", { validate: (value) => (value && value.length) || t(langKeys.field_required) });

        register("cardnumber", {
            validate: (value) =>
                (value && value.length !== 0 && value.length === getValues("cardlimit")) ||
                (value.length === 0 ? t(langKeys.field_required) : t(langKeys.creditcardvalidate)),
        });

        register("expirationyear", {
            validate: (value) => (value && value.length && value.length <= 4) || t(langKeys.field_required),
        });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!createRequest.loading && !createRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
                setWaitSave(false);
            } else if (createRequest.error) {
                dispatch(
                    showSnackbar({
                        message: t(createRequest.msg ?? createRequest.code ?? "error_unexpected_error"),
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [createRequest, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(cardCreate(data));
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
                        <TemplateBreadcrumbs breadcrumbs={arrayBreadPaymentMethods} handleClick={setViewSelected} />
                        <TitleDetail title={row ? t(langKeys.paymentmethod) : t(langKeys.paymentmethodnew)} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            color="primary"
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
                    <h3>{t(langKeys.addpaymentmethodsub)}</h3>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.firstname?.message}
                            label={t(langKeys.name_plural)}
                            onChange={(value) => setValue("firstname", value)}
                            valueDefault={getValues("firstname")}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.lastname?.message}
                            label={t(langKeys.paymentorder_lastname)}
                            onChange={(value) => setValue("lastname", value)}
                            valueDefault={getValues("lastname")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.mail?.message}
                            label={t(langKeys.mailsection)}
                            onChange={(value) => setValue("mail", value)}
                            valueDefault={getValues("mail")}
                        />
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field, formState: { errors } }) => (
                                <CssPhonemui
                                    {...field}
                                    className="col-6"
                                    countryCodeEditable={false}
                                    defaultCountry={"pe"}
                                    disabled={!edit}
                                    error={!!errors?.phone}
                                    fullWidth
                                    helperText={errors?.phone?.message}
                                    label={t(langKeys.phone)}
                                    margin="normal"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                            rules={{
                                validate: (value) => {
                                    if (value.length === 0) {
                                        return `${t(langKeys.field_required)}`;
                                    } else if (value.length < 10) {
                                        return `${t(langKeys.validationphone)}`;
                                    }
                                },
                            }}
                        />
                    </div>
                    <h3>{t(langKeys.creditcard)}</h3>
                    {edit && (
                        <div style={{ display: "flex" }}>
                            <img
                                alt="aux2"
                                src="https://static.culqi.com/v2/v2/static/img/visa.svg"
                                style={{ padding: 5 }}
                                width="50px"
                            ></img>
                            <img
                                alt="aux2"
                                src="https://static.culqi.com/v2/v2/static/img/mastercard.svg"
                                style={{ padding: 5 }}
                                width="50px"
                            ></img>
                            <img
                                alt="aux2"
                                src="https://static.culqi.com/v2/v2/static/img/amex.svg"
                                style={{ padding: 5 }}
                                width="50px"
                            ></img>
                            <img
                                alt="aux2"
                                src="https://static.culqi.com/v2/v2/static/img/diners.svg"
                                style={{ padding: 5 }}
                                width="50px"
                            ></img>
                        </div>
                    )}
                    <div style={{ display: "flex", width: "100%" }}>
                        <div style={{ width: "50%" }}>
                            <div className="row-zyx">
                                <TextField
                                    className="col-9"
                                    defaultValue={getValues("cardnumber")}
                                    disabled={!edit}
                                    error={!!errors.cardnumber}
                                    fullWidth
                                    helperText={errors.cardnumber?.message}
                                    label={t(langKeys.creditcard)}
                                    margin="normal"
                                    size="small"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: icon,
                                    }}
                                    inputProps={{
                                        maxLength: getValues("cardlimit"),
                                    }}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, "");
                                        let spaces = Math.floor(val.length / 4);
                                        let partialvalue = val.slice(0, 4);
                                        for (let i = 1; i <= spaces; i++) {
                                            partialvalue += " " + val.slice(i * 4, (i + 1) * 4);
                                        }
                                        if (partialvalue.endsWith(" ")) {
                                            partialvalue = partialvalue.slice(0, -1);
                                        }
                                        e.target.value = partialvalue;
                                        setValue("cardnumber", partialvalue.trim());
                                    }}
                                    onInput={(e: any) => {
                                        if (e.target.value.slice(0, 1) === "4") {
                                            setIcon(
                                                <img
                                                    alt="aux"
                                                    src="https://static.culqi.com/v2/v2/static/img/visa.svg"
                                                    width="50px"
                                                    style={{ padding: 5 }}
                                                ></img>
                                            );
                                            setValue("cardlimit", 19);
                                        } else if (
                                            e.target.value.slice(0, 2) === "51" ||
                                            e.target.value.slice(0, 2) === "55"
                                        ) {
                                            setIcon(
                                                <img
                                                    alt="aux"
                                                    src="https://static.culqi.com/v2/v2/static/img/mastercard.svg"
                                                    width="50px"
                                                    style={{ padding: 5 }}
                                                ></img>
                                            );

                                            setValue("cardlimit", 19);
                                        } else if (
                                            e.target.value.slice(0, 2) === "37" ||
                                            e.target.value.slice(0, 2) === "34"
                                        ) {
                                            setIcon(
                                                <img
                                                    alt="aux"
                                                    src="https://static.culqi.com/v2/v2/static/img/amex.svg"
                                                    width="50px"
                                                    style={{ padding: 5 }}
                                                ></img>
                                            );

                                            setValue("cardlimit", 18);
                                        } else if (
                                            e.target.value.slice(0, 2) === "36" ||
                                            e.target.value.slice(0, 2) === "38" ||
                                            e.target.value.slice(0, 3) === "300" ||
                                            e.target.value.slice(0, 3) === "305"
                                        ) {
                                            setIcon(
                                                <img
                                                    alt="aux"
                                                    src="https://static.culqi.com/v2/v2/static/img/diners.svg"
                                                    width="50px"
                                                    style={{ padding: 5 }}
                                                ></img>
                                            );

                                            setValue("cardlimit", 17);
                                        } else {
                                            setIcon(<></>);

                                            setValue("cardlimit", 10);
                                        }
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                    }}
                                />
                                <div className={"col-3"} style={{ paddingBottom: "3px" }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                        {t(langKeys.preferred)}
                                    </Box>
                                    <FormControlLabel
                                        label={""}
                                        style={{ paddingLeft: 10 }}
                                        control={
                                            <IOSSwitch
                                                checked={checkedFavorite}
                                                disabled={!edit}
                                                onChange={(e) => {
                                                    setCheckedFavorite(e.target.checked);
                                                    setValue("favorite", e.target.checked);
                                                }}
                                            />
                                        }
                                    />
                                </div>
                            </div>
                            {edit && <h3>{t(langKeys.dueDate)}</h3>}
                            {edit && (
                                <div style={{ display: "flex" }}>
                                    <FieldSelect
                                        className="col-6"
                                        data={datamonth}
                                        error={errors.expirationmonth?.message}
                                        label={"MM"}
                                        optionDesc="desc"
                                        optionValue="id"
                                        style={{ marginTop: 8, marginRight: 10 }}
                                        valueDefault={getValues("expirationmonth")}
                                        variant="outlined"
                                        onChange={(data: (typeof datamonth)[number]) => {
                                            setValue("expirationmonth", data?.desc || "");
                                        }}
                                    />
                                    <TextField
                                        className="col-6"
                                        error={!!errors.expirationyear}
                                        fullWidth
                                        helperText={errors.expirationyear?.message}
                                        label={"YYYY"}
                                        margin="normal"
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        type="number"
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 4,
                                        }}
                                        onChange={(e) => {
                                            setValue("expirationyear", e.target.value);
                                        }}
                                    />
                                </div>
                            )}
                            {edit && (
                                <TextField
                                    error={!!errors.securitycode}
                                    fullWidth
                                    helperText={errors.securitycode?.message}
                                    label={t(langKeys.securitycode)}
                                    margin="normal"
                                    size="small"
                                    type="password"
                                    variant="outlined"
                                    inputProps={{
                                        maxLength: getValues("cardlimit") === 18 ? 4 : 3,
                                    }}
                                    onChange={(e) => {
                                        setValue("securitycode", e.target.value);
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ width: "50%" }}>
                            {edit && (
                                <div
                                    style={{
                                        border: "1px solid #7721ad",
                                        borderRadius: "15px",
                                        margin: "10px",
                                        padding: "20px",
                                        textAlign: "center",
                                    }}
                                >
                                    {t(langKeys.finishregwarn)}
                                </div>
                            )}
                            {edit && (
                                <div style={{ textAlign: "center", padding: "20px", color: "#7721ad", margin: "10px" }}>
                                    {t(langKeys.finishregwarn2)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const Invoice: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const multiData = useSelector((state) => state.main.multiData);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataCorp, setDataCorp] = useState<any>([]);
    const [dataOrg, setDataOrg] = useState<any>([]);
    const [dataPaymentPlan, setDataPaymentPlan] = useState<any>([]);
    const [dataPlan, setDataPlan] = useState<any>([]);
    const [pageSelected, setPageSelected] = useState(0);
    const [sentFirstInfo, setSentFirstInfo] = useState(false);

    const [customSearch, setCustomSearch] = useState({
        corpid: 0,
        month: 0,
        orgid: 0,
        totalize: 2,
        year: 0,
    });

    useEffect(() => {
        if (customSearch.corpid !== 0) {
            setPageSelected(1);
        }
    }, [customSearch]);

    useEffect(() => {
        if (!multiData.loading && sentFirstInfo) {
            setDataCorp(multiData.data[2] && multiData.data[2].success ? multiData.data[2].data : []);
            setDataOrg(multiData.data[1] && multiData.data[1].success ? multiData.data[1].data : []);
            setDataPaymentPlan(multiData.data[3] && multiData.data[3].success ? multiData.data[3].data : []);
            setDataPlan(multiData.data[0] && multiData.data[0].success ? multiData.data[0].data : []);
            setSentFirstInfo(false);
        }
    }, [multiData]);

    useEffect(() => {
        setSentFirstInfo(true);
        dispatch(getCountryList());
        if (user?.roledesc === "SUPERADMIN") {
            dispatch(getMultiCollection([getPlanSel(), getOrgSelList(0), getCorpSel(0), getPaymentPlanSel()]));
        } else {
            dispatch(
                getMultiCollection([
                    getPlanSel(),
                    getOrgSelList(user?.corpid ?? 0),
                    getCorpSelVariant(user?.corpid ?? 0, user?.orgid ?? 0, user?.usr ?? ""),
                    getPaymentPlanSel(),
                ])
            );
        }
    }, []);

    return (
        <div style={{ width: "100%" }}>
            {user?.roledesc === "SUPERADMIN" && (
                <div>
                    <Tabs
                        indicatorColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                        style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                        textColor="primary"
                        value={pageSelected}
                        variant="fullWidth"
                    >
                        <AntTab label={t(langKeys.costperperiod)} />
                        <AntTab label={t(langKeys.periodreport)} />
                        <AntTab label={t(langKeys.payments)} />
                        <AntTab label={t(langKeys.invoice)} />
                        <AntTab label={t(langKeys.messagingpackages)} />
                        <AntTab label={t(langKeys.paymentmethods)} />
                    </Tabs>
                    {pageSelected === 0 && (
                        <div style={{ marginTop: 16 }}>
                            <CostPerPeriod
                                dataCorp={dataCorp}
                                dataOrg={dataOrg}
                                dataPaymentPlan={dataPaymentPlan}
                                dataPlan={dataPlan}
                            />
                        </div>
                    )}
                    {pageSelected === 1 && (
                        <div style={{ marginTop: 16 }}>
                            <PeriodReport dataCorp={dataCorp} dataOrg={dataOrg} customSearch={customSearch} />
                        </div>
                    )}
                    {pageSelected === 2 && (
                        <div style={{ marginTop: 16 }}>
                            <Payments dataCorp={dataCorp} dataOrg={dataOrg} setCustomSearch={setCustomSearch} />
                        </div>
                    )}
                    {pageSelected === 3 && (
                        <div style={{ marginTop: 16 }}>
                            <Billing dataCorp={dataCorp} dataOrg={dataOrg} />
                        </div>
                    )}
                    {pageSelected === 4 && (
                        <div style={{ marginTop: 16 }}>
                            <MessagingPackages dataCorp={dataCorp} dataOrg={dataOrg} />
                        </div>
                    )}
                    {pageSelected === 5 && (
                        <div style={{ marginTop: 16 }}>
                            <PaymentMethods />
                        </div>
                    )}
                </div>
            )}
            {["ADMINISTRADOR", "ADMINISTRADOR P", "ADMINISTRADOR LIMADERMA"].includes(user?.roledesc ?? "") && (
                <div>
                    <Tabs
                        indicatorColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                        style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                        textColor="primary"
                        value={pageSelected}
                        variant="fullWidth"
                    >
                        <AntTab label={t(langKeys.periodreport)} />
                        <AntTab label={t(langKeys.payments)} />
                        <AntTab label={t(langKeys.messagingpackages)} />
                        <AntTab label={t(langKeys.paymentmethods)} />
                    </Tabs>
                    {pageSelected === 0 && (
                        <div style={{ marginTop: 16 }}>
                            <PeriodReport dataCorp={dataCorp} dataOrg={dataOrg} customSearch={customSearch} />
                        </div>
                    )}
                    {pageSelected === 1 && (
                        <div style={{ marginTop: 16 }}>
                            <Payments dataCorp={dataCorp} dataOrg={dataOrg} setCustomSearch={setCustomSearch} />
                        </div>
                    )}
                    {pageSelected === 2 && (
                        <div style={{ marginTop: 16 }}>
                            <MessagingPackages dataCorp={dataCorp} dataOrg={dataOrg} />
                        </div>
                    )}
                    {pageSelected === 3 && (
                        <div style={{ marginTop: 16 }}>
                            <PaymentMethods />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Invoice;