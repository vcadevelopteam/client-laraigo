/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, Fragment, useEffect, useState, useMemo } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { cleanMemoryTable, getCollectionAux, getCollectionAux2, setMemoryTable, uploadFile } from 'store/main/actions';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldMultiSelect, DialogZyx, FieldEditArray, TemplateIcons, IOSSwitch, FieldEditMulti } from 'components';
import { selInvoice, deleteInvoice, selInvoiceClient, getBillingPeriodSel, billingPeriodUpd, getPlanSel, getOrgSelList, getCorpSel, getPaymentPlanSel, getBillingPeriodCalcRefreshAll, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp, billingpersonreportsel, billinguserreportsel, billingReportConversationWhatsApp, billingReportHsmHistory, invoiceRefresh, getAppsettingInvoiceSel, getOrgSel, getMeasureUnit, getValuesFromDomain, getInvoiceDetail, selBalanceData, getBillingMessagingCurrent, getBalanceSelSent, getCorpSelVariant, listPaymentCard, paymentCardInsert, uploadExcel, insInvoice, templateMaker, exportExcel, selInvoiceComment, insInvoiceComment, convertLocalDate, billingArtificialIntelligenceSel, billingPeriodArtificialIntelligenceSel, billingPeriodArtificialIntelligenceInsArray } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm, useFieldArray } from 'react-hook-form';
import ClearIcon from '@material-ui/icons/Clear';
import { getCollection, getMultiCollection, execute, exportData, getMultiCollectionAux } from 'store/main/actions';
import { createInvoice, regularizeInvoice, createCreditNote, getExchangeRate, emitInvoice, cardDelete, cardCreate, reportPdf } from 'store/culqi/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { CircularProgress, IconButton, Tabs, TextField, Box, FormControlLabel, Divider, Grid, ListItem } from '@material-ui/core';
import { DownloadIcon } from 'icons';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { dataYears, dataMonths } from 'common/helpers';
import {
    Close,
    FileCopy,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Add as AddIcon,
    GetApp
} from '@material-ui/icons';
import PaymentIcon from '@material-ui/icons/Payment';
import CulqiModal from 'components/fields/CulqiModal';
import { getCountryList } from 'store/signup/actions';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { charge, resetCharge, balance, resetBalance } from 'store/culqi/actions';
import { formatNumber, formatNumberFourDecimals, formatNumberNoDecimals } from 'common/helpers';
import { Skeleton } from '@material-ui/lab';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { Controller } from "react-hook-form";

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailPropsPaymentMethod {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
}

interface DetailProps {
    data?: Dictionary | null;
    creditNote?: boolean;
    regularize?: boolean;
    operationName?: string;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
}

interface DetailSupportPlanProps2 {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
    dataCorp: any;
    dataOrg: any;
    dataPaymentPlan: any;
    dataPlan: any;
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#7721ad",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
}))(TableRow);

function getTaxableAmount(igv: number, num: number) {
    if (num && igv)
        return (num / (igv + 1)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}

function getIgv(igv: number, num: number) {
    if (num && igv)
        return (num - (num / (igv + 1))).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}

function toISOLocalString(date: { getTimezoneOffset: () => number; getTime: () => number; }) {
    const z = (n: string | number) => ('0' + n).slice(-2);
    let off = date.getTimezoneOffset();
    const sign = off < 0 ? '+' : '-';
    off = Math.abs(off);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, -1) + sign + z(off / 60 | 0) + ':' + z(off % 60);
}

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '22px',
        color: theme.palette.text.primary,
    },
    fieldView: {
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16
    },
    containerField: {
        borderRadius: theme.spacing(2),
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 16,
        border: '1px solid #e1e1e1',
        padding: theme.spacing(2),
    },
    titleCard: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    buttoncomments: {
        padding: 6,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    text: {
        fontWeight: 500,
        fontSize: 15,
    },
    imgContainer: {
        borderRadius: 20,
        backgroundColor: 'white',
        width: 300,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        paddingTop: 10,
        height: '100%',
        width: 'auto',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    fieldsfilter: {
        width: 220,
    },
    transparent: {
        color: "transparent",
    },
    commentary: {
        fontStyle: "italic"
    },
    section: {
        fontWeight: "bold"
    }
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    '& label.Mui-focused': {
        color: '#7721ad',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7721ad',
        },
    },
});

const IDCOSTPERPERIOD = "IDCOSTPERPERIOD";
const CostPerPeriod: React.FC<{ dataCorp: any, dataOrg: any, dataPaymentPlan: any, dataPlan: any }> = ({ dataCorp, dataOrg, dataPaymentPlan, dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        billingplan: "",
        corpid: user?.corpid || 0,
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        orgid: 0,
        supportplan: "",
        year: String(new Date().getFullYear())
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingPeriodSel(dataMain)))
    }

    useEffect(() => {
        search()
        dispatch(setMemoryTable({
            id: IDCOSTPERPERIOD
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
            },
            {
                Header: t(langKeys.partner),
                accessor: 'partner',
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.contractedplan),
                accessor: 'billingplan',
            },
            {
                Header: t(langKeys.supportplan),
                accessor: 'supportplan',
            },
            {
                Header: t(langKeys.taxableamount),
                accessor: 'taxableamount',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { taxableamount } = props.cell.row.original;
                    return formatNumber(taxableamount || 0);
                }
            },
            {
                Header: t(langKeys.totalcharge),
                accessor: 'totalcharge',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { totalcharge } = props.cell.row.original;
                    return formatNumber(totalcharge || 0);
                }
            },
            {
                Header: t(langKeys.uniquecontacts),
                accessor: 'clientquantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { clientquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(clientquantity || 0);
                }
            },
            {
                Header: t(langKeys.conversation_plural),
                accessor: 'conversationquantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { conversationquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(conversationquantity || 0);
                }
            },
            {
                Header: t(langKeys.interaction_plural),
                accessor: 'interactionquantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { interactionquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(interactionquantity || 0);
                }
            },
            {
                Header: t(langKeys.supervisor_plural),
                accessor: 'supervisorquantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { supervisorquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(supervisorquantity || 0);
                }
            },
            {
                Header: t(langKeys.agent_plural),
                accessor: 'asesorquantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { asesorquantity } = props.cell.row.original;
                    return formatNumberNoDecimals(asesorquantity || 0);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingPeriodSel(dataMain)));

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (waitCalculate) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_calculate) }))
                    setWaitCalculate(false);
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave, waitCalculate])

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleCalculate = () => {
        const callback = () => {
            dispatch(execute(getBillingPeriodCalcRefreshAll(parseInt(dataMain.year || '0'), parseInt(dataMain.month || '0'), dataMain.corpid, dataMain.orgid)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
            setWaitCalculate(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_calculate),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    columns={columns}
                    onClickRow={handleEdit}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 140 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 214 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldSelect
                                label={t(langKeys.corporation)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))}
                                data={dataCorp}
                                optionDesc="description"
                                optionValue="corpid"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '')}
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, orgid: value?.orgid || 0 }))}
                                data={dataOrg.filter((e: any) => { return e.corpid === dataMain.corpid })}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.contractedplan)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.billingplan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, billingplan: value ? value.plan : "" }))}
                                data={dataPaymentPlan}
                                optionDesc="plan"
                                optionValue="plan"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.supportplan)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.supportplan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, supportplan: value ? value.description : "" }))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="description"
                                orderbylabel={true}
                            />
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={false}
                    calculate={true}
                    handleCalculate={handleCalculate}
                    pageSizeDefault={IDCOSTPERPERIOD === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDCOSTPERPERIOD === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDCOSTPERPERIOD === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailCostPerPeriod
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataCorp={dataCorp}
                dataOrg={dataOrg}
                dataPaymentPlan={dataPaymentPlan}
                dataPlan={dataPlan}
            />
        )
    } else
        return null;
}

const DetailCostPerPeriod: React.FC<DetailSupportPlanProps2> = ({ data: { row, edit }, setViewSelected, fetchData, dataPaymentPlan, dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const auxRes = useSelector(state => state.main.mainAux);
    const executeRes = useSelector(state => state.main.execute);
    const multiRes = useSelector(state => state.main.multiData);

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
        { id: "view-2", name: t(langKeys.costperperioddetail) }
    ];

    useEffect(() => {
        if (!auxRes.loading && !auxRes.error) {
            setDataArtificialIntelligence(auxRes.data);
            var array: any = [];
            var index = 0;
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
                        setDataArtificialBilling(multiRes.data[0] && multiRes.data[0].success ? multiRes.data[0].data : []);
                    }
                }
            }
        }
    }, [multiRes.data, waitAiBilling]);

    const getPeriodArtificialIntelligence = () => dispatch(getCollectionAux(billingPeriodArtificialIntelligenceSel({ corpid: row?.corpid, orgid: (row?.orgid || 0), year: row?.year, month: row?.month, provider: '', type: '', plan: '' })));

    useEffect(() => {
        if (row?.year && row?.month) {
            dispatch(getMultiCollection([
                billingArtificialIntelligenceSel({ year: row?.year, month: row?.month, provider: '', type: '', plan: '' }),
            ]));
            setWaitAiBilling(true);
        }

        if (row?.invoicestatus && row?.paymentstatus) {
            if (row?.invoicestatus !== "INVOICED" && row?.paymentstatus !== "PAID") {
                setCanEdit(true);
            }
        }
        else {
            setCanEdit(true);
        }

        getPeriodArtificialIntelligence();
    }, [])

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
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
        }
    });

    React.useEffect(() => {
        register('additionalservicefee1');
        register('additionalservicefee2');
        register('additionalservicefee3');
        register('additionalservicename1');
        register('additionalservicename2');
        register('additionalservicename3');
        register('basicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('billingplan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('callchannelcost');
        register('callothercost');
        register('callphonecost');
        register('callpubliccost');
        register('callrecordingcost');
        register('callvoipcost');
        register('channelcreateoverride');
        register('channelfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('channelotherfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('channelwhatsappfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('clientadditionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('clientfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('conversationclientwhatfreequantity');
        register('conversationcompanywhatfreequantity');
        register('corpid');
        register('force');
        register('freewhatsappchannel', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('freewhatsappconversations');
        register('mailcost');
        register('mailquantity');
        register('minimummailquantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('minimumsmsquantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('month');
        register('orgid');
        register('smscost');
        register('smsquantity');
        register('supportbasicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('supportplan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('totalcharge');
        register('unitepricepermail');
        register('unitpricepersms');
        register('useradditionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('usercreateoverride');
        register('userfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('vcacomissionperconversation');
        register('vcacomissionperhsm', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('vcacomissionpermail');
        register('vcacomissionpersms');
        register('vcacomissionpervoicechannel', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('voximplantcallothercost');
        register('voximplantcallothervcacost');
        register('voximplantcallphonecost');
        register('voximplantcallphonevcacost');
        register('voximplantcallpubliccost');
        register('voximplantcallpublicvcacost');
        register('voximplantcallrecordingcost');
        register('voximplantcallrecordingvcacost');
        register('voximplantcallvoipcost');
        register('voximplantcallvoipvcacost');
        register('year');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }));
                fetchData && fetchData();
                getPeriodArtificialIntelligence && getPeriodArtificialIntelligence();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(executeRes.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() }) }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (allIndex.length === dataArtificialIntelligence.length && triggerSave) {
            setTriggerSave(false);

            const error = allIndex.some((x: any) => !x.allOk);

            if (error) {
                return
            }

            if (dataArtificialIntelligence.length > 0) {
                const uniqueDataArtificialIntelligence = new Set(dataArtificialIntelligence.map(dataRow => dataRow.type && dataRow.provider));

                if (uniqueDataArtificialIntelligence.size < dataArtificialIntelligence.length) {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.aiduplicatealert) }));
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
                    dispatch(execute({
                        header: billingPeriodUpd(data),
                        detail: [billingPeriodArtificialIntelligenceInsArray(row?.corpid || 0, row?.orgid || 0, dataArtificialInsert)]!,
                    }, true));
                }
                else {
                    dispatch(execute(billingPeriodUpd(data)));
                }

                dispatch(showBackdrop(true));
                setWaitSave(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    }, [allIndex, triggerSave])

    const onSubmit = handleSubmit((data) => {
        setTriggerSave(true);
        if (pageSelected === 7) {
            setAllIndex([]);
        }
    });

    const handleDelete = (row: Dictionary | null, index: number) => {
        if (row && row.operation !== "INSERT") {
            setDataArtificialIntelligenceDelete(p => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);
        }
        const filterDataArtificialIntelligence = dataArtificialIntelligence.filter((x, i) => i !== index);
        setDataArtificialIntelligence(filterDataArtificialIntelligence);
    }

    const handleRegister = () => {
        setDataArtificialIntelligence(p => [...p, { id: 0, corpid: row?.corpid || 0, orgid: row?.orgid || 0, year: row?.year || 0, month: row?.month || 0, aicost: 0, aiquantity: 0, operation: "INSERT", status: "ACTIVO" }]);
    }

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBreadCostPerPeriod}
                            handleClick={(id) => { setViewSelected(id); fetchData(); }}
                        />
                        <TitleDetail
                            title={row ? `${row.corpdesc} - ${row.orgdesc}` : t(langKeys.neworganization)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => { setViewSelected("view-1"); fetchData(); }}
                        >{t(langKeys.back)}</Button>
                        {canEdit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.generalinformation)} />
                    <AntTab label={t(langKeys.agents_plural)} />
                    <AntTab label={t(langKeys.channel_plural)} />
                    <AntTab label={t(langKeys.conversation_plural)} />
                    <AntTab label={t(langKeys.contact_plural)} />
                    <AntTab label={t(langKeys.messaging)} />
                    <AntTab label={t(langKeys.billingperiodvoice)} />
                    <AntTab label={t(langKeys.billingsetup_ai)} />
                    <AntTab label="Extras" />
                </Tabs>
                {pageSelected === 0 && <div className={classes.containerDetail}>
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
                        <FieldView
                            className="col-6"
                            label={t(langKeys.year)}
                            value={getValues("year")}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.month)}
                            value={getValues("month")}
                        />
                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldSelect
                            label={t(langKeys.contractedplan)}
                            className="col-6"
                            valueDefault={getValues("billingplan")}
                            variant="outlined"
                            onChange={(value) => setValue('billingplan', value?.plan)}
                            data={dataPaymentPlan}
                            error={errors?.billingplan?.message}
                            optionDesc="plan"
                            optionValue="plan"
                            orderbylabel={true}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.contractedplan)}
                                value={getValues("billingplan")}
                            />
                        }
                        {canEdit ? <FieldSelect
                            label={t(langKeys.contractedsupportplan)}
                            className="col-6"
                            valueDefault={getValues("supportplan")}
                            variant="outlined"
                            onChange={(value) => setValue('supportplan', value?.description)}
                            data={dataPlan}
                            error={errors?.supportplan?.message}
                            optionDesc="description"
                            optionValue="description"
                            orderbylabel={true}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.contractedsupportplan)}
                                value={getValues("supportplan")}
                            />
                        }

                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.costbasedonthecontractedplan)}
                            onChange={(value) => setValue('basicfee', value)}
                            valueDefault={getValues('basicfee')}
                            error={errors?.basicfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.costbasedonthecontractedplan)}
                                value={getValues('basicfee')}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={t(langKeys.costbasedonthesupportplan)}
                            onChange={(value) => setValue('supportbasicfee', value)}
                            valueDefault={getValues('supportbasicfee')}
                            error={errors?.supportbasicfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.costbasedonthesupportplan)}
                                value={formatNumber(getValues('supportbasicfee') || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.totalcharge)}
                            value={formatNumber(getValues('totalcharge') || 0)}
                        />
                    </div>
                </div>}
                {pageSelected === 1 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.numberofagentshired)}
                            onChange={(value) => setValue('userfreequantity', value)}
                            valueDefault={getValues('userfreequantity')}
                            error={errors?.userfreequantity?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.numberofagentshired)}
                                value={String(getValues('userfreequantity'))}
                            />
                        }
                        <FieldView
                            className="col-6"
                            label={t(langKeys.numberofactiveadvisers)}
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
                            label={t(langKeys.numberofactiveagents)}
                            value={String(getValues("asesorquantity"))}
                        />
                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.useradditionalfee)}
                            onChange={(value) => setValue('useradditionalfee', value)}
                            valueDefault={getValues('useradditionalfee')}
                            error={errors?.useradditionalfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.useradditionalfee)}
                                value={formatNumber(getValues('useradditionalfee') || 0)}
                            />
                        }
                        <FieldView
                            className="col-6"
                            label={t(langKeys.useradditionalcharge)}
                            value={formatNumber(getValues("useradditionalcharge") || 0)}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.allowuseroverride)}</Box>
                            <FormControlLabel
                                style={{ paddingLeft: 10 }}
                                control={<IOSSwitch disabled={canEdit === false} checked={checkedUser} onChange={(e) => { setCheckedUser(e.target.checked); setValue('usercreateoverride', e.target.checked) }} />}
                                label={""}
                            />
                        </div>
                    </div>
                </div>}
                {pageSelected === 2 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.channelfreequantity)}
                            onChange={(value) => setValue('channelfreequantity', value)}
                            valueDefault={getValues('channelfreequantity')}
                            error={errors?.channelfreequantity?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.channelfreequantity)}
                                value={getValues('channelfreequantity')}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={t(langKeys.contractedplanchannelotherfee)}
                            onChange={(value) => setValue('channelotherfee', value)}
                            valueDefault={getValues('channelotherfee')}
                            error={errors?.channelotherfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.contractedplanchannelotherfee)}
                                value={formatNumberFourDecimals(getValues('channelotherfee') || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.contractedplanfreewhatsappchannel)}
                            onChange={(value) => setValue('freewhatsappchannel', value)}
                            valueDefault={getValues('freewhatsappchannel')}
                            error={errors?.freewhatsappchannel?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.contractedplanfreewhatsappchannel)}
                                value={getValues("freewhatsappchannel").toString()}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={t(langKeys.channelwhatsappfee)}
                            onChange={(value) => setValue('channelwhatsappfee', value)}
                            valueDefault={getValues('channelwhatsappfee')}
                            error={errors?.channelwhatsappfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.channelwhatsappfee)}
                                value={formatNumberFourDecimals(getValues('channelwhatsappfee') || 0)}
                            />
                        }
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
                        <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.allowchanneloverride)}</Box>
                            <FormControlLabel
                                style={{ paddingLeft: 10 }}
                                control={<IOSSwitch disabled={canEdit === false} checked={checkedChannel} onChange={(e) => { setCheckedChannel(e.target.checked); setValue('channelcreateoverride', e.target.checked) }} />}
                                label={""}
                            />
                        </div>
                    </div>
                </div>}
                {pageSelected === 3 && <div className={classes.containerDetail}>
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
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationclientwhatquantity)}
                            value={getValues("conversationclientwhatquantity").toString()}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationclientwhatfreequantity)}
                            value={getValues("conversationclientwhatfreequantity").toString()}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationclientwhatcharge)}
                            value={formatNumber(getValues("conversationclientwhatcharge") || 0)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatquantity)}
                            value={getValues("conversationcompanywhatquantity").toString()}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatfreequantity)}
                            value={getValues("conversationcompanywhatfreequantity").toString()}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatcharge)}
                            value={formatNumber(getValues("conversationcompanywhatcharge") || 0)}
                        />
                    </div>
                    <div className="row-zyx">
                        {canEdit && <FieldEdit
                            label={t(langKeys.vcacomissionperhsm)}
                            onChange={(value) => setValue('vcacomissionperhsm', value)}
                            valueDefault={getValues('vcacomissionperhsm')}
                            error={errors?.vcacomissionperhsm?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />}
                        {!canEdit && <FieldView
                            className="col-6"
                            label={t(langKeys.vcacomissionperhsm)}
                            value={formatNumberFourDecimals(getValues('vcacomissionperhsm') || 0)}
                        />}
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationwhatcharge)}
                            value={formatNumber(getValues("conversationwhatcharge") || 0)}
                        />
                    </div>
                </div>}
                {pageSelected === 4 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.clientfreequantity)}
                            onChange={(value) => setValue('clientfreequantity', value)}
                            valueDefault={getValues('clientfreequantity')}
                            error={errors?.clientfreequantity?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.clientfreequantity)}
                                value={getValues("clientfreequantity").toString()}
                            />
                        }
                        <FieldView
                            className="col-6"
                            label={t(langKeys.clientquantity)}
                            value={getValues("clientquantity").toString()}
                        />
                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.clientadditionalfee)}
                            onChange={(value) => setValue('clientadditionalfee', value)}
                            valueDefault={getValues('clientadditionalfee')}
                            error={errors?.clientadditionalfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.clientadditionalfee)}
                                value={formatNumberFourDecimals(getValues("clientadditionalfee") || 0)}
                            />
                        }
                        <FieldView
                            className="col-6"
                            label={t(langKeys.clientadditionalcharge)}
                            value={formatNumber(getValues("clientadditionalcharge") || 0)}
                        />
                    </div>
                </div>}
                {pageSelected === 5 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.unitpricepersms)}
                            onChange={(value) => setValue('unitpricepersms', value)}
                            valueDefault={getValues('unitpricepersms')}
                            error={errors?.unitpricepersms?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.unitpricepersms)}
                                value={formatNumberFourDecimals(getValues("unitpricepersms") || 0)}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={t(langKeys.vcacomissionpersms)}
                            onChange={(value) => setValue('vcacomissionpersms', value)}
                            valueDefault={getValues('vcacomissionpersms')}
                            error={errors?.vcacomissionpersms?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.vcacomissionpersms)}
                                value={formatNumberFourDecimals(getValues("vcacomissionpersms") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.smsquantity)}
                            value={formatNumberNoDecimals(getValues("smsquantity") || 0)}
                        />
                        {canEdit ? <FieldEdit
                            label={t(langKeys.minimumsmsquantity)}
                            onChange={(value) => setValue('minimumsmsquantity', value)}
                            valueDefault={getValues('minimumsmsquantity')}
                            error={errors?.minimumsmsquantity?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.minimumsmsquantity)}
                                value={formatNumberFourDecimals(getValues("minimumsmsquantity") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.smscost)}
                            value={formatNumber(getValues("smscost") || 0)}
                        />
                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.unitepricepermail)}
                            onChange={(value) => setValue('unitepricepermail', value)}
                            valueDefault={getValues('unitepricepermail')}
                            error={errors?.unitepricepermail?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.unitepricepermail)}
                                value={formatNumberFourDecimals(getValues("unitepricepermail") || 0)}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={t(langKeys.vcacomissionpermail)}
                            onChange={(value) => setValue('vcacomissionpermail', value)}
                            valueDefault={getValues('vcacomissionpermail')}
                            error={errors?.vcacomissionpermail?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.vcacomissionpermail)}
                                value={formatNumberFourDecimals(getValues("vcacomissionpermail") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.mailquantity)}
                            value={formatNumberNoDecimals(getValues("mailquantity") || 0)}
                        />
                        {canEdit ? <FieldEdit
                            label={t(langKeys.minimummailquantity)}
                            onChange={(value) => setValue('minimummailquantity', value)}
                            valueDefault={getValues('minimummailquantity')}
                            error={errors?.minimummailquantity?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.minimummailquantity)}
                                value={formatNumberFourDecimals(getValues("minimummailquantity") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.mailcost)}
                            value={formatNumber(getValues("mailcost") || 0)}
                        />
                    </div>
                </div>}
                {pageSelected === 6 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={t(langKeys.vcacomissionpervoicechannel)}
                            onChange={(value) => setValue('vcacomissionpervoicechannel', value)}
                            valueDefault={getValues('vcacomissionpervoicechannel')}
                            error={errors?.vcacomissionpervoicechannel?.message}
                            type="number"
                            className="col-12"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.vcacomissionpervoicechannel)}
                                value={formatNumber(getValues("vcacomissionpervoicechannel") || 0)}
                            />
                        }
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
                </div>}
                {pageSelected === 7 && <div className={classes.containerDetail}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <div className={classes.title}>{t(langKeys.aitotalcost)}: {formatNumber(row?.totalaicost || 0)}</div>
                        <div>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={auxRes.loading || !canEdit}
                                startIcon={<AddIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                onClick={handleRegister}
                            >{t(langKeys.addnewai)}
                            </Button>
                        </div>
                    </div>
                    {auxRes.loading ?
                        <ListItemSkeleton /> :
                        dataArtificialIntelligence.map((item, index) => (
                            <DetailArtificialIntelligence
                                key={`ai-${item?.provider}-${item?.typeprovider}-${index * 1000}`}
                                index={index}
                                data={{ row: item, edit: canEdit }}
                                updateRecords={setDataArtificialIntelligence}
                                preData={dataArtificialIntelligence}
                                triggerSave={triggerSave}
                                handleDelete={handleDelete}
                                setAllIndex={setAllIndex}
                                intelligenceData={dataArtificialBilling}
                            />
                        ))
                    }
                </div>}
                {pageSelected === 8 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={`${t(langKeys.additionalservicename)} 1`}
                            onChange={(value) => setValue('additionalservicename1', value)}
                            valueDefault={getValues('additionalservicename1')}
                            error={errors?.additionalservicename1?.message}
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicename)} 1`}
                                value={getValues("additionalservicename1")}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 1`}
                            onChange={(value) => setValue('additionalservicefee1', value)}
                            valueDefault={getValues('additionalservicefee1')}
                            error={errors?.additionalservicefee1?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicefee)} 1`}
                                value={formatNumberFourDecimals(getValues("additionalservicefee1") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={`${t(langKeys.additionalservicename)} 2`}
                            onChange={(value) => setValue('additionalservicename2', value)}
                            valueDefault={getValues('additionalservicename2')}
                            error={errors?.additionalservicename2?.message}
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicename)} 2`}
                                value={getValues("additionalservicename2")}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 2`}
                            onChange={(value) => setValue('additionalservicefee2', value)}
                            valueDefault={getValues('additionalservicefee2')}
                            error={errors?.additionalservicefee2?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicefee)} 2`}
                                value={formatNumberFourDecimals(getValues("additionalservicefee2") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {canEdit ? <FieldEdit
                            label={`${t(langKeys.additionalservicename)} 3`}
                            onChange={(value) => setValue('additionalservicename3', value)}
                            valueDefault={getValues('additionalservicename3')}
                            error={errors?.additionalservicename3?.message}
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicename)} 3`}
                                value={getValues("additionalservicename3")}
                            />
                        }
                        {canEdit ? <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 3`}
                            onChange={(value) => setValue('additionalservicefee3', value)}
                            valueDefault={getValues('additionalservicefee3')}
                            error={errors?.additionalservicefee3?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicefee)} 3`}
                                value={formatNumberFourDecimals(getValues("additionalservicefee3") || 0)}
                            />
                        }
                    </div>
                </div>}
            </form>
        </div>
    );
}

interface ModalProps {
    data: RowSelected;
    preData: (Dictionary | null)[];
    intelligenceData: Dictionary[];
    openModal?: boolean;
    setOpenModal?: (open: boolean) => void;
    updateRecords?: (record: any) => void;
    triggerSave?: boolean;
    index: number;
    setAllIndex: (index: any) => void;
    handleDelete: (row: Dictionary | null, index: number) => void;
}

const DetailArtificialIntelligence: React.FC<ModalProps> = ({ index, data: { row, edit }, updateRecords, preData, triggerSave, setAllIndex, handleDelete, intelligenceData }) => {
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (triggerSave) {
            (async () => {
                const allOk = await trigger();
                const data = getValues();
                if (allOk) {
                    updateRecords && updateRecords((p: Dictionary[], itmp: number) => {
                        p[index] = { ...data, operation: p[index].operation === "INSERT" ? "INSERT" : "UPDATE" }
                        return p;
                    })
                }
                setAllIndex((p: number[]) => [...p, { index, allOk }]);
            })()
        }
    }, [triggerSave])

    function updatefield(field: string, value: any) {
        updateRecords && updateRecords((p: Dictionary[], itmp: number) => {
            p[index] = { ...p[index], [field]: value }
            return p;
        })
    }

    useEffect(() => {
        reset({
            id: row ? row.id : 0,
            corpid: row ? row.corpid : 0,
            orgid: row ? row.orgid : 0,
            year: row ? row.year : 0,
            month: row ? row.month : 0,
            provider: row ? row.provider : '',
            measureunit: row ? row.measureunit : '',
            charlimit: row ? row.charlimit : 0,
            plan: row ? row.plan : '',
            freeinteractions: row ? row.freeinteractions : 0,
            basicfee: row ? row.basicfee : 0.00,
            additionalfee: row ? row.additionalfee : 0.00,
            description: row ? row.description : '',
            aiquantity: row ? row.aiquantity : 0,
            aicost: row ? row.aicost : 0.00,
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            operation: row ? 'UPDATE' : 'INSERT',
        })

        register('id');
        register('corpid');
        register('orgid');
        register('year');
        register('month');
        register('provider', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('measureunit');
        register('charlimit', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('plan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('freeinteractions', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('additionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('description');
        register('aiquantity');
        register('aicost');
        register('status');
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('operation');
    }, [preData])

    const onSubmit = handleSubmit((data) => {
        if (!row)
            updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, operation: "INSERT" }])
        else
            updateRecords && updateRecords((p: Dictionary[]) => p.map(x => x.orgid === row ? { ...x, ...data, operation: (x.operation || "UPDATE") } : x))
    });

    const onChangeArtificialIntelligence = (value: Dictionary) => {
        setValue('provider', value?.provider || '');
        setValue('measureunit', value?.measureunit || '');
        setValue('charlimit', value?.charlimit || 0);
        setValue('plan', value?.plan || '');
        setValue('freeinteractions', value?.freeinteractions || 0);
        setValue('basicfee', value?.basicfee || 0.00);
        setValue('additionalfee', value?.additionalfee || 0.00);
        setValue('description', value?.description || '');
        setValue('type', value?.type || '');

        updatefield('provider', value?.provider || '');
        updatefield('measureunit', value?.measureunit || '');
        updatefield('charlimit', value?.charlimit || 0);
        updatefield('plan', value?.plan || '');
        updatefield('freeinteractions', value?.freeinteractions || 0);
        updatefield('basicfee', value?.basicfee || 0.00);
        updatefield('additionalfee', value?.additionalfee || 0.00);
        updatefield('description', value?.description || '');
        updatefield('type', value?.type || '');

        trigger('provider');
        trigger('measureunit');
        trigger('charlimit');
        trigger('plan');
        trigger('freeinteractions');
        trigger('basicfee');
        trigger('additionalfee');
        trigger('description');
        trigger('type');

        updateRecords && updateRecords((p: Dictionary[], itmp: number) => {
            p[index] = { ...p[index], corpid: value?.corpid, orgid: value?.orgid || 0 }
            return p;
        })
    }

    return (
        <Accordion defaultExpanded={row?.id === 0} style={{ marginBottom: '8px' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{(row?.type) ? `${row.type} - ${row.provider} (${row.plan})` : t(langKeys.newai)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={onSubmit} style={{ width: '100%' }}>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.aiservice)}
                            className="col-6"
                            valueDefault={`${getValues('type')} - ${getValues('provider')} (${getValues('plan')})`}
                            onChange={onChangeArtificialIntelligence}
                            error={errors?.type?.message}
                            data={intelligenceData}
                            optionDesc="typeproviderplan"
                            optionValue="typeproviderplan"
                            disabled={!edit}
                        />
                        <FieldEdit
                            label={t(langKeys.billingsetup_provider)}
                            className="col-6"
                            valueDefault={getValues('provider')}
                            error={errors?.provider?.message}
                            disabled={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingsetup_service)}
                            className="col-6"
                            valueDefault={getValues('type')}
                            error={errors?.type?.message}
                            disabled={true}
                        />
                        <FieldEdit
                            label={t(langKeys.billingsetup_plan)}
                            className="col-6"
                            valueDefault={getValues('plan')}
                            error={errors?.plan?.message}
                            disabled={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingsetup_measureunit)}
                            className="col-6"
                            valueDefault={getValues('measureunit')}
                            error={errors?.measureunit?.message}
                            disabled={true}
                        />
                        <FieldEdit
                            label={t(langKeys.billingsetup_minimuminteractions)}
                            className="col-6"
                            valueDefault={getValues('freeinteractions')}
                            error={errors?.freeinteractions?.message}
                            type="number"
                            onChange={(value) => {
                                setValue('freeinteractions', value || 0);
                                updatefield('freeinteractions', value || 0);
                            }}
                            disabled={!edit}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingsetup_baseprice)}
                            className="col-6"
                            valueDefault={getValues('basicfee')}
                            error={errors?.basicfee?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                            onChange={(value) => {
                                setValue('basicfee', value || 0.00);
                                updatefield('basicfee', value || 0.00);
                            }}
                            disabled={!edit}
                        />
                        <FieldEdit
                            label={t(langKeys.billingsetup_additionalprice)}
                            className="col-6"
                            valueDefault={getValues('additionalfee')}
                            error={errors?.additionalfee?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                            onChange={(value) => {
                                setValue('additionalfee', value || 0.00);
                                updatefield('additionalfee', value || 0.00);
                            }}
                            disabled={!edit}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.quantity)}
                            className="col-6"
                            valueDefault={formatNumberNoDecimals(getValues('aiquantity') || 0)}
                            error={errors?.aiquantity?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                            disabled={true}
                        />
                        <FieldEdit
                            label={t(langKeys.aicost)}
                            className="col-6"
                            valueDefault={formatNumber(getValues('aicost') || 0)}
                            error={errors?.aicost?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                            disabled={true}
                        />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<DeleteIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => handleDelete(row, index)}
                            disabled={!edit}
                        >{t(langKeys.delete)}</Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
}

const ListItemSkeleton: FC = () => (
    <ListItem style={{ display: 'flex', paddingLeft: 0, paddingRight: 0, paddingBottom: 8 }}>
        <Box style={{ padding: 20, backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
            <Grid container direction="column">
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
                <Divider style={{ margin: '10px 0' }} />
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </ListItem>
)

const PeriodReport: React.FC<{ dataCorp: any, dataOrg: any, customSearch: any }> = ({ dataCorp, dataOrg, customSearch }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeCalculate = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const resExportData = useSelector(state => state.main.exportData);
    const user = useSelector(state => state.login.validateToken.user);
    const resultPdf = useSelector(state => state.culqi.requestReportPdf);

    const [dataMain, setdataMain] = useState({
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth() + 1).padStart(2, '0')}`,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        corpid: user?.corpid || 0,
        orgid: user?.orgid || 0,
        totalize: 2,
    });

    const [canSearch, setCanSearch] = useState(false);
    const [disableOrg, setDisableOrg] = useState(false);
    const [datareport, setdatareport] = useState<any>([]);
    const [requestType, setRequestType] = useState(2);
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [waitSearch, setWaitSearch] = useState(false);
    const [waitPdf, setWaitPdf] = useState(false);

    const el = React.useRef<null | HTMLDivElement>(null);

    const datatotalize = [{ value: 1, description: t(langKeys.corporation) }, { value: 2, description: t(langKeys.organization) }]

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02")
            let mes = datetochange?.getMonth() + 1
            let year = datetochange?.getFullYear()
            let datetoshow = `${year}-${String(mes).padStart(2, '0')}`
            setdataMain(prev => ({ ...prev, datetoshow, year, month: mes }))
        }
    }

    function search() {
        dispatch(showBackdrop(true))
        setRequestType(dataMain.totalize)
        if (dataMain.totalize === 2) {
            dispatch(getCollection(getBillingPeriodSummarySel(dataMain)))
        } else {
            dispatch(getCollection(getBillingPeriodSummarySelCorp(dataMain)))
        }
    }

    useEffect(() => {
        search()
    }, [])

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
    }, [dataMain])

    useEffect(() => {
        if (customSearch?.corpid !== 0) {
            setdataMain(prev => ({
                ...prev,
                datetoshow: `${customSearch?.year}-${String(customSearch?.month).padStart(2, '0')}`,
                year: customSearch?.year,
                month: customSearch?.month,
                corpid: customSearch?.corpid,
                orgid: customSearch?.orgid,
                totalize: customSearch?.totalize,
            }));
            setWaitSearch(true);
        }
    }, [customSearch])

    useEffect(() => {
        if (waitSearch) {
            setWaitSearch(false);
            search();
        }
    }, [dataMain, waitSearch])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            if (mainResult.mainData.data.length) {
                setdatareport(mainResult.mainData.data[0]);
            }
            else {
                setdatareport(null);
            }
            dispatch(showBackdrop(false))
        }
    }, [mainResult.mainData])

    useEffect(() => {
        if (waitCalculate) {
            if (!executeCalculate.loading && !executeCalculate.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_calculate) }))
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
                search();
            } else if (executeCalculate.error) {
                const message = t(executeCalculate.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message }))
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
            }
        }
    }, [executeCalculate, waitCalculate])

    const triggerExportDataPerson = () => {
        dispatch(exportData(billingpersonreportsel(dataMain), "BillingPersonReport", "excel", true))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataUser = () => {
        dispatch(exportData(billinguserreportsel(dataMain), "BillingUserReport", "excel", true))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataConversation = () => {
        dispatch(exportData(billingReportConversationWhatsApp(dataMain), "BillingUserConversation", "excel", true))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataHsmHistory = (datatype: string) => {
        dispatch(exportData(billingReportHsmHistory({ corpid: dataMain.corpid, orgid: dataMain.orgid, year: dataMain.year, month: dataMain.month, type: datatype }), "BillingUserHsmHistory", "excel", true))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const handleCalculate = () => {
        const callback = () => {
            dispatch(execute(getBillingPeriodCalcRefreshAll(dataMain.year, dataMain.month, dataMain.corpid, dataMain.orgid)));
            dispatch(showBackdrop(true));
            setWaitCalculate(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_calculate),
            callback
        }))
    }

    const handleReportPdf = () => {
        if (datareport) {
            var intelligenceDetail: {}[] = [];

            if (datareport.artificialintelligencedata) {
                datareport.artificialintelligencedata.forEach((element: any) => {
                    intelligenceDetail.push({
                        service: element.type,
                        provider: element.provider,
                        plan: element.plan,
                        freeinteractions: formatNumberNoDecimals(element.freeinteractions || 0),
                        aiquantity: formatNumberNoDecimals(element.aiquantity || 0),
                        additionalfee: ((element.aiquantity || 0) <= (element.freeinteractions || 0)) ? '' : `$${formatNumberFourDecimals(element.additionalfee || 0)}`,
                        taxableamount: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), element.aicost || 0) : formatNumber(element.aicost)}`,
                        igv: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, element.aicost) : "0.00"}`,
                        aicost: `$${formatNumber(element.aicost || 0)}`,
                    });
                });
            }

            var reportbody = {
                method: "",
                parameters: {
                    generalinformationclient: (requestType === 2 ? datareport.orgdesc : datareport.corpdesc),
                    generalinformationplan: (datareport.billingplan),
                    generalinformationperiod: `${datareport.year}-${String(datareport.month).padStart(2, '0')}`,
                    basecost1: "",
                    basecost2: "",
                    basecost3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.basicfee || 0) : formatNumber(datareport.basicfee)}`,
                    basecost4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.basicfee || 0) : "0.00"}`,
                    basecost5: `$${datareport.basicfee ? formatNumber(datareport.basicfee || 0) : "0.00"}`,
                    agentcontracted1: formatNumberNoDecimals(datareport.userfreequantity || 0),
                    agentcontracted2: "",
                    agentcontracted3: "",
                    agentcontracted4: "",
                    agentcontracted5: "",
                    agentadditional1: formatNumberNoDecimals(datareport.useradditionalquantity || 0),
                    agentadditional2: `$${formatNumberFourDecimals(datareport.useradditionalfee || 0)}`,
                    agentadditional3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.useradditionalcharge || 0) : formatNumber(datareport.useradditionalcharge)}`,
                    agentadditional4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.useradditionalcharge || 0) : "0.00"}`,
                    agentadditional5: `$${formatNumber(datareport.useradditionalcharge || 0)}`,
                    channelcontracted1: formatNumberNoDecimals(datareport.channelfreequantity || 0),
                    channelcontracted2: "",
                    channelcontracted3: "",
                    channelcontracted4: "",
                    channelcontracted5: "",
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
                    channelwhatsappadditional1: formatNumberNoDecimals(((datareport.channelwhatsappquantity - datareport.freewhatsappchannel) < 0 ? 0 : (datareport.channelwhatsappquantity - datareport.freewhatsappchannel)) || 0),
                    channelwhatsappadditional2: `$${formatNumberFourDecimals(datareport.channelwhatsappfee || 0)}`,
                    channelwhatsappadditional3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelwhatsappcharge || 0) : formatNumber(datareport.channelwhatsappcharge)}`,
                    channelwhatsappadditional4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelwhatsappcharge || 0) : "0.00"}`,
                    channelwhatsappadditional5: `$${formatNumber(datareport.channelwhatsappcharge || 0)}`,
                    channelother1: formatNumberNoDecimals(datareport.channelotherquantity || 0),
                    channelother2: `$${formatNumberFourDecimals(datareport.channelotherfee || 0)}`,
                    channelother3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelothercharge || 0) : formatNumber(datareport.channelothercharge)}`,
                    channelother4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelothercharge || 0) : "0.00"}`,
                    channelother5: `$${formatNumber(datareport.channelothercharge || 0)}`,
                    conversationwhatsappfree1: formatNumberNoDecimals((datareport.channelwhatsappquantity || 0) * (datareport.freewhatsappconversations || 0)),
                    conversationwhatsappfree2: "",
                    conversationwhatsappfree3: "",
                    conversationwhatsappfree4: "",
                    conversationwhatsappfree5: "",
                    conversationwhatsappclient1: formatNumberNoDecimals(datareport.conversationclientwhatquantity || 0),
                    conversationwhatsappclient2: "",
                    conversationwhatsappclient3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationclientwhatcharge || 0) : formatNumber(datareport.conversationclientwhatcharge)}`,
                    conversationwhatsappclient4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationclientwhatcharge || 0) : "0.00"}`,
                    conversationwhatsappclient5: `$${formatNumber(datareport.conversationclientwhatcharge || 0)}`,
                    conversationwhatsappbusiness1: formatNumberNoDecimals(datareport.conversationcompanywhatquantity || 0),
                    conversationwhatsappbusiness2: "",
                    conversationwhatsappbusiness3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationcompanywhatcharge || 0) : formatNumber(datareport.conversationcompanywhatcharge)}`,
                    conversationwhatsappbusiness4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationcompanywhatcharge || 0) : "0.00"}`,
                    conversationwhatsappbusiness5: `$${formatNumber(datareport.conversationcompanywhatcharge || 0)}`,
                    messagingminimumsms1: formatNumberNoDecimals(datareport.minimumsmsquantity || 0),
                    messagingminimumsms2: "",
                    messagingminimumsms3: "",
                    messagingminimumsms4: "",
                    messagingminimumsms5: "",
                    messagingsms1: formatNumberNoDecimals(datareport.smsquantity || 0),
                    messagingsms2: `$${formatNumberFourDecimals((datareport.unitpricepersms || 0) + (datareport.vcacomissionpersms || 0))}`,
                    messagingsms3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.smscost || 0) : formatNumber(datareport.smscost)}`,
                    messagingsms4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.smscost || 0) : "0.00"}`,
                    messagingsms5: `$${formatNumber(datareport.smscost || 0)}`,
                    messagingminimummail1: formatNumberNoDecimals(datareport.minimummailquantity || 0),
                    messagingminimummail2: "",
                    messagingminimummail3: "",
                    messagingminimummail4: "",
                    messagingminimummail5: "",
                    messagingmail1: formatNumberNoDecimals(datareport.mailquantity || 0),
                    messagingmail2: `$${formatNumberFourDecimals((datareport.unitepricepermail || 0) + (datareport.vcacomissionpermail || 0))}`,
                    messagingmail3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.mailcost || 0) : formatNumber(datareport.mailcost)}`,
                    messagingmail4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.mailcost || 0) : "0.00"}`,
                    messagingmail5: `$${formatNumber(datareport.mailcost || 0)}`,
                    voicephone1: "",
                    voicephone2: "",
                    voicephone3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callphonecost || 0) : formatNumber(datareport.callphonecost)}`,
                    voicephone4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callphonecost || 0) : "0.00"}`,
                    voicephone5: `$${formatNumber(datareport.callphonecost || 0)}`,
                    voicecall1: "",
                    voicecall2: "",
                    voicecall3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callpubliccost || 0) : formatNumber(datareport.callpubliccost)}`,
                    voicecall4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callpubliccost || 0) : "0.00"}`,
                    voicecall5: `$${formatNumber(datareport.callpubliccost || 0)}`,
                    voicevoip1: "",
                    voicevoip2: "",
                    voicevoip3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callvoipcost || 0) : formatNumber(datareport.callvoipcost)}`,
                    voicevoip4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callvoipcost || 0) : "0.00"}`,
                    voicevoip5: `$${formatNumber(datareport.callvoipcost || 0)}`,
                    voicerecording1: "",
                    voicerecording2: "",
                    voicerecording3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callrecordingcost || 0) : formatNumber(datareport.callrecordingcost)}`,
                    voicerecording4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callrecordingcost || 0) : "0.00"}`,
                    voicerecording5: `$${formatNumber(datareport.callrecordingcost || 0)}`,
                    voiceothers1: "",
                    voiceothers2: "",
                    voiceothers3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callothercost || 0) : formatNumber(datareport.callothercost)}`,
                    voiceothers4: `$${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callothercost || 0) : "0.00"}`,
                    voiceothers5: `$${formatNumber(datareport.callothercost || 0)}`,
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
                    contactadditional1: formatNumberNoDecimals(datareport.clientadditionalquantity || 0),
                    contactadditional2: `$${formatNumberFourDecimals(datareport.clientadditionalfee || 0)}`,
                    contactadditional3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.clientadditionalcharge || 0) : formatNumber(datareport.clientadditionalcharge)}`,
                    contactadditional4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.clientadditionalcharge) : "0.00"}`,
                    contactadditional5: `$${formatNumber(datareport.clientadditionalcharge || 0)}`,
                    supportplan: datareport.supportplan,
                    supportplan1: "",
                    supportplan2: "",
                    supportplan3: `$${datareport.taxrate !== 1 ? getTaxableAmount(datareport.igv, datareport.supportbasicfee) : formatNumber(datareport.supportbasicfee)}`,
                    supportplan4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.supportbasicfee) : "0.00"}`,
                    supportplan5: `$${formatNumber(datareport.supportbasicfee)}`,
                    additional01service: datareport.additionalservicefee1 ? datareport.additionalservicename1 : "",
                    additional01service1: "",
                    additional01service2: "",
                    additional01service3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), ((datareport.additionalservicefee1 || 0) * datareport.taxrate)) : formatNumber((datareport.additionalservicefee1 || 0) * datareport.taxrate)}`,
                    additional01service4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, ((datareport.additionalservicefee1 || 0) * datareport.taxrate)) : "0.00"}`,
                    additional01service5: `$${formatNumber((datareport.additionalservicefee1 || 0) * datareport.taxrate)}`,
                    additional02service: datareport.additionalservicefee2 ? datareport.additionalservicename2 : "",
                    additional02service1: "",
                    additional02service2: "",
                    additional02service3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), ((datareport.additionalservicefee2 || 0) * datareport.taxrate)) : formatNumber((datareport.additionalservicefee2 || 0) * datareport.taxrate)}`,
                    additional02service4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, ((datareport.additionalservicefee2 || 0) * datareport.taxrate)) : "0.00"}`,
                    additional02service5: `$${formatNumber((datareport.additionalservicefee2 || 0) * datareport.taxrate)}`,
                    additional03service: datareport.additionalservicefee2 ? datareport.additionalservicename2 : "",
                    additional03service1: "",
                    additional03service2: "",
                    additional03service3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), ((datareport.additionalservicefee2 || 0) * datareport.taxrate)) : formatNumber((datareport.additionalservicefee2 || 0) * datareport.taxrate)}`,
                    additional03service4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, ((datareport.additionalservicefee2 || 0) * datareport.taxrate)) : "0.00"}`,
                    additional03service5: `$${formatNumber((datareport.additionalservicefee2 || 0) * datareport.taxrate)}`,
                    totalamount1: "",
                    totalamount2: "",
                    totalamount3: `$${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.totalcharge || 0) : formatNumber(datareport.totalcharge)}`,
                    totalamount4: `$${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.totalcharge) : "0.00"}`,
                    totalamount5: `$${formatNumber(datareport.totalcharge || 0)}`,
                    totalcontact: datareport.clientquantity,
                    totalconversation: datareport.conversationquantity,
                    totalinteraction: datareport.interactionquantity,
                    totalagent: datareport.asesorquantity,
                    totalsupervisor: datareport.supervisorquantity,
                    intelligencedetail: intelligenceDetail,
                },
                dataonparameters: true,
                template: t(langKeys.billingreport_template),
                reportname: "period-report",
                key: "period-report",
            }

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
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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
                    window.open(resultPdf.datacard, '_blank');
                }
            } else if (resultPdf.error) {
                const errormessage = t(resultPdf.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitPdf(false);
            }
        }
    }, [resultPdf, waitPdf]);

    return (
        <Fragment>
            <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <TextField
                        id="date"
                        className={classes.fieldsfilter}
                        type="month"
                        variant="outlined"
                        onChange={(e) => handleDateChange(e.target.value)}
                        value={dataMain.datetoshow}
                        size="small"
                    />
                    <FieldSelect
                        label={t(langKeys.corporation)}
                        className={classes.fieldsfilter}
                        valueDefault={dataMain.corpid}
                        variant="outlined"
                        onChange={(value) => setdataMain(prev => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))}
                        data={dataCorp}
                        optionDesc="description"
                        optionValue="corpid"
                        disabled={["ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '')}
                        orderbylabel={true}
                    />
                    <FieldSelect
                        label={t(langKeys.organization)}
                        className={classes.fieldsfilter}
                        valueDefault={dataMain.orgid}
                        variant="outlined"
                        onChange={(value) => setdataMain(prev => ({ ...prev, orgid: value?.orgid || 0 }))}
                        data={dataOrg.filter((e: any) => { return e.corpid === dataMain.corpid })}
                        optionDesc="orgdesc"
                        optionValue="orgid"
                        orderbylabel={true}
                        disabled={disableOrg}
                    />
                    <FieldSelect
                        label={t(langKeys.totalize)}
                        className={classes.fieldsfilter}
                        valueDefault={dataMain.totalize}
                        variant="outlined"
                        onChange={(value) => setdataMain(prev => ({ ...prev, totalize: value?.value || 0 }))}
                        data={datatotalize}
                        optionDesc="description"
                        optionValue="value"
                        orderbylabel={true}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainResult.mainData.loading || !canSearch}
                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                        style={{ width: 120, backgroundColor: "#55BD84" }}
                        onClick={() => search()}
                    >{t(langKeys.search)}
                    </Button>
                    {!mainResult.mainData.loading && (
                        datareport && <Fragment>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                startIcon={<RefreshIcon color="secondary" />}
                                onClick={() => handleCalculate()}
                                style={{ backgroundColor: "#55BD84" }}
                            >{`${t(langKeys.calculate)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => handleReportPdf()}
                                startIcon={<DownloadIcon />}
                            >{t(langKeys.download)}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataPerson()}
                                startIcon={<DownloadIcon />}
                            >{`${t(langKeys.report)} ${t(langKeys.uniquecontacts)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataUser()}
                                startIcon={<DownloadIcon />}
                            >{`${t(langKeys.report)} ${t(langKeys.agents_plural)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataConversation()}
                                startIcon={<DownloadIcon />}
                            >{`${t(langKeys.report)} ${t(langKeys.conversationwhatsapp)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataHsmHistory('SMS')}
                                startIcon={<DownloadIcon />}
                            >{`${t(langKeys.report)} ${t(langKeys.sms)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataHsmHistory('MAIL')}
                                startIcon={<DownloadIcon />}
                            >{`${t(langKeys.report)} ${t(langKeys.mail)}`}
                            </Button>
                        </Fragment>)
                    }
                </div>
            </div>
            {
                !mainResult.mainData.loading && (
                    <div style={{ width: "100%" }} ref={el}>
                        {datareport && <div className={classes.containerDetail}>
                            <div className="row-zyx" >
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.client)}
                                    value={requestType === 2 ? datareport.orgdesc : datareport.corpdesc}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={"Plan"}
                                    value={datareport.billingplan}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.period)}
                                    value={`${datareport.year}-${String(datareport.month).padStart(2, '0')}`}
                                />
                            </div>
                            <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="left">{t(langKeys.billingreportitem)}</StyledTableCell>
                                            <StyledTableCell align="right">{t(langKeys.billingreportquantity)}</StyledTableCell>
                                            <StyledTableCell align="right">{t(langKeys.billingreportrate)}</StyledTableCell>
                                            <StyledTableCell align="right">{t(langKeys.billingreporttaxableamount)}</StyledTableCell>
                                            <StyledTableCell align="right">{t(langKeys.billingreporttaxableiva)}</StyledTableCell>
                                            <StyledTableCell align="right">{t(langKeys.billingreportamount)}</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <StyledTableRow>
                                            <StyledTableCell><b>{t(langKeys.basecost)}</b></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.basicfee || 0) : formatNumber(datareport.basicfee)}</StyledTableCell>
                                            <StyledTableCell align="right">${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.basicfee || 0) : "0.00"}</StyledTableCell>
                                            <StyledTableCell align="right">${datareport.basicfee ? formatNumber(datareport.basicfee || 0) : "0.00"}</StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div><b>{t(langKeys.agents_plural)}</b></div>
                                                <div>{t(langKeys.contracted)}</div>
                                                <div>{t(langKeys.additional)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals(datareport.userfreequantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.useradditionalquantity || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumberFourDecimals(datareport.useradditionalfee || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.useradditionalcharge || 0) : formatNumber(datareport.useradditionalcharge)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.useradditionalcharge || 0) : "0.00"}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.useradditionalcharge || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div><b>{t(langKeys.channel_plural)}</b></div>
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
                                                <div>{formatNumberNoDecimals(datareport.channelwhatsappquantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(((datareport.channelwhatsappquantity - datareport.freewhatsappchannel) < 0 ? 0 : (datareport.channelwhatsappquantity - datareport.freewhatsappchannel)) || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.channelotherquantity || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumberFourDecimals(datareport.channelwhatsappfee || 0)}</div>
                                                <div>${formatNumberFourDecimals(datareport.channelotherfee || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelwhatsappcharge || 0) : formatNumber(datareport.channelwhatsappcharge)}</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelothercharge || 0) : formatNumber(datareport.channelothercharge)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelwhatsappcharge || 0) : "0.00"}</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.channelothercharge || 0) : "0.00"}</div>
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
                                                <div><b>{t(langKeys.billingreportconversations)}</b></div>
                                                <div>{t(langKeys.reportfreeconversations)}</div>
                                                <div>{t(langKeys.userinitiatedconversations)}</div>
                                                <div>{t(langKeys.businessinitiatedconversations)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals((datareport.channelwhatsappquantity || 0) * (datareport.freewhatsappconversations || 0))}</div>
                                                <div>{formatNumberNoDecimals(datareport.conversationclientwhatquantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.conversationcompanywhatquantity || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationclientwhatcharge || 0) : formatNumber(datareport.conversationclientwhatcharge)}</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationcompanywhatcharge || 0) : formatNumber(datareport.conversationcompanywhatcharge)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationclientwhatcharge || 0) : "0.00"}</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.conversationcompanywhatcharge || 0) : "0.00"}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.conversationclientwhatcharge || 0)}</div>
                                                <div>${formatNumber(datareport.conversationcompanywhatcharge || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div><b>{t(langKeys.billingreportmessaging)}</b></div>
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
                                                <div>${formatNumberFourDecimals((datareport.unitpricepersms || 0) + (datareport.vcacomissionpersms || 0))}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumberFourDecimals((datareport.unitepricepermail || 0) + (datareport.vcacomissionpermail || 0))}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.smscost || 0) : formatNumber(datareport.smscost)}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.mailcost || 0) : formatNumber(datareport.mailcost)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.smscost || 0) : "0.00"}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.mailcost || 0) : "0.00"}</div>
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
                                                <div><b>{t(langKeys.periodreportvoice)}</b></div>
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
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callphonecost || 0) : formatNumber(datareport.callphonecost)}</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callpubliccost || 0) : formatNumber(datareport.callpubliccost)}</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callvoipcost || 0) : formatNumber(datareport.callvoipcost)}</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callrecordingcost || 0) : formatNumber(datareport.callrecordingcost)}</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callothercost || 0) : formatNumber(datareport.callothercost)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callphonecost || 0) : "0.00"}</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callpubliccost || 0) : "0.00"}</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callvoipcost || 0) : "0.00"}</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callrecordingcost || 0) : "0.00"}</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.callothercost || 0) : "0.00"}</div>
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
                                                <div><b>{t(langKeys.billingreportcontacts)}</b></div>
                                                <div>{t(langKeys.freecontacts)}</div>
                                                <div>{t(langKeys.billingreporttotalcontacts)}</div>
                                                <div>{t(langKeys.billingreportadditionalcontacts)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals(datareport.clientfreequantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.clientquantity || 0)}</div>
                                                <div>{formatNumberNoDecimals(datareport.clientadditionalquantity || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumberFourDecimals(datareport.clientadditionalfee || 0)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.clientadditionalcharge || 0) : formatNumber(datareport.clientadditionalcharge)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.clientadditionalcharge) : "0.00"}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>${formatNumber(datareport.clientadditionalcharge || 0)}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        {datareport?.artificialintelligencedata?.map((item: any) => (
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div><b>{item.type} - {item.provider} ({item.plan})</b></div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{formatNumberNoDecimals(item.aiquantity || 0)}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {((item.aiquantity || 0) > (item.freeinteractions || 0)) && <div>${formatNumberFourDecimals(item.additionalfee || 0)}</div>}
                                                    {((item.aiquantity || 0) <= (item.freeinteractions || 0)) && <div style={{ color: "transparent" }}>.</div>}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), item.aicost || 0) : formatNumber(item.aicost)}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>${datareport.taxrate !== 1 ? getIgv(datareport.igv, item.aicost) : "0.00"}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>${formatNumber(item.aicost || 0)}</div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        <StyledTableRow>
                                            <StyledTableCell><b>{t(langKeys.supportplan)} {datareport.supportplan}</b></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">${datareport.taxrate !== 1 ? getTaxableAmount(datareport.igv, datareport.supportbasicfee) : formatNumber(datareport.supportbasicfee)}</StyledTableCell>
                                            <StyledTableCell align="right">${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.supportbasicfee) : "0.00"}</StyledTableCell>
                                            <StyledTableCell align="right">${formatNumber(datareport.supportbasicfee)}</StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                {datareport.additionalservicefee1 ? <div className={clsx({ [classes.transparent]: datareport.additionalservicename1 === "" })}>{datareport.additionalservicename1 === "" ? <div style={{ color: "transparent" }}>.</div> : datareport.additionalservicename1}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee2 ? <div className={clsx({ [classes.transparent]: datareport.additionalservicename2 === "" })}>{datareport.additionalservicename2 === "" ? <div style={{ color: "transparent" }}>.</div> : datareport.additionalservicename2}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee3 ? <div className={clsx({ [classes.transparent]: datareport.additionalservicename3 === "" })}>{datareport.additionalservicename3 === "" ? <div style={{ color: "transparent" }}>.</div> : datareport.additionalservicename3}</div> : <div style={{ color: "transparent" }}>.</div>}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {datareport.additionalservicefee1 ? <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), ((datareport.additionalservicefee1 || 0) * datareport.taxrate)) : formatNumber((datareport.additionalservicefee1 || 0) * datareport.taxrate)}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee2 ? <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), ((datareport.additionalservicefee2 || 0) * datareport.taxrate)) : formatNumber((datareport.additionalservicefee2 || 0) * datareport.taxrate)}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee3 ? <div>${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), ((datareport.additionalservicefee3 || 0) * datareport.taxrate)) : formatNumber((datareport.additionalservicefee3 || 0) * datareport.taxrate)}</div> : <div style={{ color: "transparent" }}>.</div>}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {datareport.additionalservicefee1 ? <div>${datareport.taxrate !== 1 ? getIgv(datareport.igv, ((datareport.additionalservicefee1 || 0) * datareport.taxrate)) : "0.00"}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee2 ? <div>${datareport.taxrate !== 1 ? getIgv(datareport.igv, ((datareport.additionalservicefee2 || 0) * datareport.taxrate)) : "0.00"}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee3 ? <div>${datareport.taxrate !== 1 ? getIgv(datareport.igv, ((datareport.additionalservicefee3 || 0) * datareport.taxrate)) : "0.00"}</div> : <div style={{ color: "transparent" }}>.</div>}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {datareport.additionalservicefee1 ? <div>${formatNumber((datareport.additionalservicefee1 || 0) * datareport.taxrate)}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee2 ? <div>${formatNumber((datareport.additionalservicefee2 || 0) * datareport.taxrate)}</div> : <div style={{ color: "transparent" }}>.</div>}
                                                {datareport.additionalservicefee3 ? <div>${formatNumber((datareport.additionalservicefee3 || 0) * datareport.taxrate)}</div> : <div style={{ color: "transparent" }}>.</div>}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{t(langKeys.periodamount)}</b>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                ${datareport.taxrate !== 1 ? getTaxableAmount((datareport.taxrate ? datareport.taxrate - 1 : 0), datareport.totalcharge || 0) : formatNumber(datareport.totalcharge)}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                ${datareport.taxrate !== 1 ? getIgv(datareport.igv, datareport.totalcharge) : "0.00"}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                ${formatNumber(datareport.totalcharge || 0)}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div style={{ paddingTop: 20, paddingBottom: 20, fontWeight: "bold", fontSize: "1.5em" }}>{t(langKeys.servicedata)}</div>
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
                        </div>}
                        {!datareport && <div className={classes.containerDetail}>
                            <div className="row-zyx" >
                                <FieldView
                                    className="col-6"
                                    label={""}
                                    value={t(langKeys.billingperiodnotfound)}
                                />
                            </div>
                        </div>}
                    </div>
                )
            }
        </Fragment>
    )
}

const IDPAYMENTS = "IDPAYMENTS";
const Payments: React.FC<{ dataCorp: any, dataOrg: any, setCustomSearch(value: React.SetStateAction<{ year: number; month: number; corpid: number; orgid: number; totalize: number; }>): void }> = ({ dataCorp, dataOrg, setCustomSearch }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main.mainData);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        corpid: user?.corpid || 0,
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        orgid: 0,
        year: String(new Date().getFullYear()),
        paymentstatus: "",
        currency: ""
    });

    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [disableSearch, setdisableSearch] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [rowSelect, setRowSelect] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);
    const [waitRefresh, setWaitRefresh] = useState(false);
    const [modalRowSelect, setModalRowSelect] = useState<Dictionary | null>(null);
    const [modalRowSend, setModalRowSend] = useState(false);

    const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]
    const dataPayment = [{ value: "PENDING", description: t(langKeys.PENDING) }, { value: "PAID", description: t(langKeys.PAID) }, { value: "NONE", description: t(langKeys.NONE) }]

    const fetchData = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const search = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const refreshInvoice = (data: any) => {
        const callback = () => {
            dispatch(execute(invoiceRefresh(data)));
            dispatch(showBackdrop(true));
            setWaitRefresh(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_invoicerefresh),
            callback
        }))
    }

    useEffect(() => {
        fetchData()
        dispatch(setMemoryTable({
            id: IDPAYMENTS
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        if (rowSelect) {
            if (rowSelected) {
                setCustomSearch(prev => ({
                    ...prev,
                    year: rowSelected?.year,
                    month: rowSelected?.month,
                    corpid: rowSelected?.corpid,
                    orgid: rowSelected?.orgid,
                    totalize: rowSelected?.orgid === 0 ? 1 : 2,
                }));
                setRowSelect(false);
            }
        }
    }, [rowSelected, rowSelect])

    useEffect(() => {
        if (modalRowSend) {
            setViewSelected("view-2");
            setRowSelected(modalRowSelect);
            setModalRowSend(false);
        }
    }, [modalRowSelect, modalRowSend])

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.invoicesuccessfullyvoided) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (waitRefresh) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitRefresh(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitRefresh])

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataInvoice(mainResult.data.filter(x => x.invoicestatus !== 'CANCELED')?.map(x => ({
                ...x,
                invoicestatuscolumn: t(x.invoicestatus),
                paymentstatuscolumn: t(x.paymentstatus),
                hasreportcolumn: x.hasreport ? t(langKeys.toreport) : t(langKeys.none),
                docnumbercolumn: (x.serie && x.correlative) ? (x.serie + '-' + x.correlative.toString().padStart(8, '0')) : 'X000-00000000',
                urlxmlcolumn: x.urlxml ? t(langKeys.xmldocumentopen) : t(langKeys.pendingpayment),
                urlcdrcolumn: x.urlcdr ? t(langKeys.cdrdocumentopen) : t(langKeys.pendingpayment),
            })))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                accessor: 'orgid',
                Cell: (props: any) => {
                    const row = props.cell.row.original;

                    var showPayButton = false;
                    var showUpdateButton = false;

                    if (!(((row.invoicestatus === "ERROR" || row.invoicestatus === "PENDING" || row.invoicestatus === "CANCELED") || row.paymentstatus !== "PENDING") || row.totalamount <= 0)) {
                        showPayButton = true;
                    }

                    if (row.invoicestatus !== "INVOICED" && row.paymentstatus !== "PAID" && row.hasreport && user?.roledesc === "SUPERADMIN") {
                        showUpdateButton = true;
                    }

                    return (
                        <>
                            {showPayButton && <Button
                                variant="contained"
                                color="primary"
                                style={{ backgroundColor: "#55BD84", marginRight: "10px" }}
                                startIcon={<PaymentIcon style={{ color: 'white' }} />}
                                onClick={() => { setModalRowSelect(row); setModalRowSend(true) }}
                            >{t(langKeys.pay)}
                            </Button>}
                            {showUpdateButton && <Button
                                variant="contained"
                                color="primary"
                                style={{ backgroundColor: "#55BD84" }}
                                startIcon={<RefreshIcon style={{ color: 'white' }} />}
                                onClick={() => { refreshInvoice(row) }}
                            >{t(langKeys.refresh)}
                            </Button>}
                        </>
                    )
                }
            },
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
            },
            {
                Header: t(langKeys.totalamount),
                accessor: 'totalamount',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { totalamount } = props.cell.row.original;
                    return formatNumber(totalamount || 0);
                }
            },
            {
                Header: t(langKeys.invoicestatus),
                accessor: 'invoicestatuscolumn',
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatuscolumn',
            },
            {
                Header: t(langKeys.gotoreport),
                accessor: 'hasreportcolumn',
                Cell: (props: any) => {
                    const selectedrow = props.cell.row.original;
                    const hasreport = selectedrow?.hasreport;

                    if (hasreport) {
                        return (
                            <Fragment>
                                <div>
                                    {<span onClick={() => { setRowSelected(selectedrow); setRowSelect(true) }} style={{ display: "block", cursor: "pointer", color: "blue", textDecoration: "underline" }}>{t(langKeys.toreport)}</span>}
                                </div>
                            </Fragment>
                        )
                    } else {
                        return t(langKeys.none);
                    }
                }
            },
            {
                Header: t(langKeys.billingvoucher),
                accessor: 'docnumbercolumn',
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = (props.cell.row.original.serie ? props.cell.row.original.serie : 'X000') + '-' + (props.cell.row.original.correlative ? props.cell.row.original.correlative.toString().padStart(8, '0') : '00000000');
                    return (
                        <Fragment>
                            <div>
                                {(urlpdf ?
                                    <a href={urlpdf} target="_blank" style={{ display: "block" }} rel="noreferrer">{docnumber}</a>
                                    :
                                    <span style={{ display: "block" }}>{docnumber}</span>)
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.xmldocument),
                accessor: 'urlxmlcolumn',
                Cell: (props: any) => {
                    const urlxml = props.cell.row.original.urlxml;
                    return (
                        <Fragment>
                            <div>
                                {(urlxml ?
                                    <a href={urlxml} target="_blank" style={{ display: "block" }} rel="noreferrer">{t(langKeys.xmldocumentopen)}</a>
                                    :
                                    <span style={{ display: "block" }}>{t(langKeys.pendingpayment)}</span>)
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.cdrdocument),
                accessor: 'urlcdrcolumn',
                Cell: (props: any) => {
                    const urlcdr = props.cell.row.original.urlcdr;
                    return (
                        <Fragment>
                            <div>
                                {(urlcdr ?
                                    <a href={urlcdr} target="_blank" style={{ display: "block" }} rel="noreferrer">{t(langKeys.cdrdocumentopen)}</a>
                                    :
                                    <span style={{ display: "block" }}>{t(langKeys.pendingpayment)}</span>)
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
        ],
        []
    );

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: '100%' }}>
                <TableZyx
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 140 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 214 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldSelect
                                label={t(langKeys.corporation)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))}
                                data={dataCorp}
                                optionDesc="description"
                                optionValue="corpid"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '')}
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, orgid: value?.orgid || 0 }))}
                                data={dataOrg.filter((e: any) => { return e.corpid === dataMain.corpid })}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.currency)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.currency}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, currency: value?.value || '' }))}
                                data={dataCurrency}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.paymentstatus)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.paymentstatus}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, paymentstatus: value?.value || '' }))}
                                data={dataPayment}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                            />
                            <Button
                                disabled={mainResult.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={search}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={dataInvoice}
                    filterGeneral={false}
                    loading={mainResult.loading}
                    download={true}
                    register={false}
                    pageSizeDefault={IDPAYMENTS === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDPAYMENTS === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDPAYMENTS === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    } else {
        return (
            <PaymentsDetail
                fetchData={fetchData}
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        );
    }
}

const PaymentsDetail: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiSelector = useSelector(state => state.culqi.request);
    const mainResult = useSelector(state => state.main);
    const multiResult = useSelector(state => state.main.multiDataAux);
    const exchangeRequest = useSelector(state => state.culqi.requestGetExchangeRate);
    const user = useSelector(state => state.login.validateToken.user);

    const [cardList, setCardList] = useState<any>([]);
    const [comments, setComments] = useState('');
    const [purchaseOrder, setPurchaseOrder] = useState('');
    const [commentsError, setCommentsError] = useState('');
    const [purchaseOrderError, setPurchaseOrderError] = useState('');
    const [paymentDisabled, setPaymentDisabled] = useState(false);
    const [publicKey, setPublicKey] = useState('');
    const [showCulqi, setShowCulqi] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalPay, setTotalPay] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [waitPay, setWaitPay] = useState(false);
    const [override, setOverride] = useState(false);
    const [detractionAlert, setDetractionAlert] = useState(false);
    const [detractionAmount, setDetractionAmount] = useState(0);
    const [paymentCardId, setPaymentCardId] = useState(0);
    const [paymentCardCode, setPaymentCardCode] = useState('');
    const [paymentType, setPaymentType] = useState('FAVORITE');
    const [favoriteCardId, setFavoriteCardId] = useState(0);
    const [favoriteCardNumber, setFavoriteCardNumber] = useState('');
    const [favoriteCardCode, setFavoriteCardCode] = useState('');

    const dataPayment = [{ val: "FAVORITE", description: t(langKeys.paymentfavorite) }, { val: "CARD", description: t(langKeys.paymentcard) }, { val: "CULQI", description: t(langKeys.paymentculqi) }];

    const handlePay = () => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(charge({
                invoiceid: data?.invoiceid,
                settings: {
                    title: data?.description,
                    description: data?.productdescription,
                    currency: data?.currency,
                    amount: Math.round(((totalPay * 100) + Number.EPSILON) * 100) / 100,
                },
                token: null,
                metadata: {},
                purchaseorder: purchaseOrder,
                comments: comments,
                corpid: data?.corpid,
                orgid: data?.orgid,
                override: override,
                paymentcardid: paymentCardId,
                paymentcardcode: paymentCardCode,
                iscard: true,
            }));
            setWaitPay(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_payment),
            callback
        }))
    }

    useEffect(() => {
        dispatch(getCollection(getAppsettingInvoiceSel()));
        dispatch(getExchangeRate(null));
        dispatch(getMultiCollectionAux([listPaymentCard({ corpid: user?.corpid || 0, id: 0, orgid: 0 })]));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    }, []);

    useEffect(() => {
        const indexCard = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_PAYMENTCARD_LST'));

        if (indexCard > -1) {
            setCardList({ loading: false, data: multiResult.data[indexCard] && multiResult.data[indexCard].success ? multiResult.data[indexCard].data : [] });
        }
    }, [multiResult]);

    useEffect(() => {
        if (cardList) {
            if (cardList.data) {
                if (cardList.data.length > 0) {
                    var favoriteCard = cardList.data.find((o: { favorite: boolean; }) => o.favorite === true);

                    if (favoriteCard) {
                        setFavoriteCardId(favoriteCard.paymentcardid);
                        setFavoriteCardNumber(favoriteCard.cardnumber);
                        setFavoriteCardCode(favoriteCard.cardcode);
                        setPaymentCardId(favoriteCard.paymentcardid);
                        setPaymentCardCode(favoriteCard.cardcode);
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
                setPaymentCardCode('');
            }
        }
    }, [paymentType]);

    useEffect(() => {
        if (waitPay) {
            if (!culqiSelector.loading && culqiSelector.data) {
                dispatch(showSnackbar({ show: true, severity: "success", message: '' + t(culqiSelector.message || langKeys.success) }))
                dispatch(showBackdrop(false));
                dispatch(resetCharge());
                handleCulqiSuccess && handleCulqiSuccess();
                setWaitPay(false);
            }
            else if (culqiSelector.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: '' + t(culqiSelector.message || langKeys.error_cos_unexpected) }))
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
                        var appsetting = mainResult.mainData.data[0];
                        var country = (data?.orgcountry || data?.corpcountry);
                        var doctype = (data?.orgdoctype || data?.corpdoctype);

                        if (country && doctype) {
                            if (country === 'PE' && doctype === '6') {
                                var compareamount = (data?.totalamount || 0);

                                if (data?.currency === 'USD') {
                                    compareamount = compareamount * (exchangeRequest?.exchangerate || 0);
                                }

                                if (compareamount > appsetting.detractionminimum) {
                                    setTotalPay(Math.round(((data?.totalamount || 0) - ((data?.totalamount || 0) * (appsetting.detraction || 0)) + Number.EPSILON) * 100) / 100);
                                    setTotalAmount(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                    setOverride(true);
                                    setShowCulqi(true);
                                    setDetractionAlert(true);
                                    setDetractionAmount(Math.round((((appsetting.detraction || 0) * 100) + Number.EPSILON) * 100) / 100);
                                }
                                else {
                                    setTotalPay(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                    setTotalAmount(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);
                                    setShowCulqi(true);
                                }
                            }
                            else {
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
    }, [mainResult, exchangeRequest, waitSave])

    const handleCulqiSuccess = () => {
        fetchData();
        setViewSelected("view-1");
    }

    const handlePurchaseOrder = (value: any) => {
        setPurchaseOrder(value);
        if (value.length > 15) {
            setPurchaseOrderError(t(langKeys.validation15char));
            setPaymentDisabled(true);
        }
        else {
            setPurchaseOrderError('');
            if (comments.length <= 150) {
                setPaymentDisabled(false);
            }
        }
    }

    const handleComments = (value: any) => {
        setComments(value);
        if (value.length > 150) {
            setCommentsError(t(langKeys.validation150char));
            setPaymentDisabled(true);
        }
        else {
            setCommentsError('');
            if (purchaseOrder.length <= 15) {
                setPaymentDisabled(false);
            }
        }
    }

    const paymentBread = [
        { id: "view-1", name: t(langKeys.payment) },
        { id: "view-2", name: t(langKeys.paymentdetail) }
    ];

    return (
        <div style={{ width: '100%' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={paymentBread}
                            handleClick={(id) => { setViewSelected(id); fetchData(); }}
                        />
                        <TitleDetail
                            title={data?.description}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => { setViewSelected("view-1"); fetchData(); }}
                        >{t(langKeys.back)}</Button>
                        {(data?.paymentstatus === "PENDING" && (data?.invoicestatus === "INVOICED" || data?.invoicestatus === "DRAFT") && paymentType === "CULQI" && publicKey && showCulqi) &&
                            <CulqiModal
                                type="CHARGE"
                                invoiceid={data?.invoiceid}
                                title={data?.description}
                                description={data?.productdescription}
                                currency={data?.currency}
                                amount={Math.round(((totalPay * 100) + Number.EPSILON) * 100) / 100}
                                callbackOnSuccess={() => { handleCulqiSuccess() }}
                                buttontitle={t(langKeys.proceedpayment)}
                                purchaseorder={purchaseOrder}
                                comments={comments}
                                corpid={data?.corpid}
                                orgid={data?.orgid}
                                disabled={paymentDisabled}
                                successmessage={t(langKeys.culqipaysuccess)}
                                publickey={publicKey}
                                override={override}
                                totalpay={totalPay}
                            >
                            </CulqiModal>
                        }
                        {(data?.paymentstatus === "PENDING" && (data?.invoicestatus === "INVOICED" || data?.invoicestatus === "DRAFT") && (paymentType === "FAVORITE" || paymentType === "CARD")) &&
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                startIcon={<AttachMoneyIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                onClick={handlePay}
                                disabled={paymentDisabled || !paymentCardId || !paymentCardCode}
                            >{t(langKeys.proceedpayment)}
                            </Button>
                        }
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: 16 }}>
                    <div className="row-zyx">
                        <FieldView
                            className={classes.section}
                            label={''}
                            value={t(langKeys.paymentmethod)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.paymentmethodtype)}
                            onChange={(value) => { setPaymentType(value?.val || 0) }}
                            className="col-6"
                            valueDefault={paymentType}
                            data={dataPayment}
                            optionDesc="description"
                            optionValue="val"
                            orderbylabel={true}
                        />
                        {(paymentType === "CARD") && <FieldSelect
                            label={t(langKeys.paymentmethodcard)}
                            onChange={(value) => { setPaymentCardCode(value?.cardcode || ''); setPaymentCardId(value?.paymentcardid || 0); }}
                            className="col-6"
                            valueDefault={paymentCardId}
                            data={cardList.data ? cardList.data.filter((e: { favorite: boolean; }) => e.favorite !== true) : []}
                            optionDesc="cardnumber"
                            optionValue="paymentcardid"
                            loading={cardList.loading}
                            orderbylabel={true}
                        />}
                        {(paymentType === "FAVORITE") && <FieldEdit
                            className="col-6"
                            label={t(langKeys.paymentmethodcard)}
                            valueDefault={favoriteCardNumber}
                            disabled={true}
                        />}
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className={classes.section}
                            label={''}
                            value={t(langKeys.paymentinformation)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-4"
                            label={t(langKeys.servicedescription)}
                            value={data?.productdescription || ''}
                        />
                        <FieldView
                            className="col-4"
                            label={t(langKeys.totalamount)}
                            value={(data?.currency === 'USD' ? '$' : 'S/') + formatNumber((totalAmount || 0))}
                        />
                        <FieldView
                            className="col-4"
                            label={t(langKeys.totaltopay)}
                            value={(data?.currency === 'USD' ? '$' : 'S/') + formatNumber((totalPay || 0))}
                        />
                    </div>
                    {detractionAlert && <div className="row-zyx">
                        <FieldView
                            className={classes.commentary}
                            label={''}
                            value={t(langKeys.detractionnotepay1) + `${detractionAmount}` + t(langKeys.detractionnotepay2)}
                        />
                    </div>}
                    <div className="row-zyx">
                        <FieldView
                            className={classes.section}
                            label={''}
                            value={t(langKeys.additional_information)}
                        />
                    </div>
                    {data?.invoicestatus === "DRAFT" && <div className="row-zyx">
                        <FieldView
                            className={classes.commentary}
                            label={''}
                            value={t(langKeys.additionalinformation2)}
                        />
                    </div>}
                    <div className="row-zyx">
                        {data?.invoicestatus === "DRAFT" && <FieldEdit
                            label={t(langKeys.purchaseorder)}
                            onChange={(value) => handlePurchaseOrder(value)}
                            valueDefault={purchaseOrder}
                            error={purchaseOrderError}
                            className="col-12"
                        />}
                        {data?.invoicestatus !== "DRAFT" && <FieldView
                            label={t(langKeys.purchaseorder)}
                            value={data?.purchaseorder}
                            className="col-12"
                        />}
                    </div>
                    <div className="row-zyx">
                        {data?.invoicestatus === "DRAFT" && <FieldEdit
                            label={t(langKeys.comments)}
                            onChange={(value) => handleComments(value)}
                            valueDefault={comments}
                            error={commentsError}
                            className="col-12"
                        />}
                        {data?.invoicestatus !== "DRAFT" && <FieldView
                            label={t(langKeys.comments)}
                            value={data?.comments}
                            className="col-12"
                        />}
                    </div>
                    {data?.invoicestatus === "DRAFT" && <div className="row-zyx">
                        <FieldView
                            className={classes.commentary}
                            label={''}
                            value={t(langKeys.additionalinformation1)}
                        />
                    </div>}
                </div>
            </div>
        </div >
    )
}

const IDBILLING = "IDBILLING";
const Billing: React.FC<{ dataCorp: any, dataOrg: any }> = ({ dataCorp, dataOrg }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main.mainData);
    const multiResult = useSelector(state => state.main.multiData);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        corpid: user?.corpid || 0,
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        orgid: 0,
        year: String(new Date().getFullYear()),
        paymentstatus: "",
        currency: ""
    });

    const [insertexcel, setinsertexcel] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalData, setOpenModalData] = useState<Dictionary | null>(null);
    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [disableSearch, setdisableSearch] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [isCreditNote, setIsCreditNote] = useState(false);
    const [isRegularize, setIsRegularize] = useState(false);
    const [operationName, setOperationName] = useState('');
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveImport, setwaitSaveImport] = useState(false);

    const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]
    const dataPayment = [{ value: "PENDING", description: t(langKeys.PENDING) }, { value: "PAID", description: t(langKeys.PAID) }, { value: "NONE", description: t(langKeys.NONE) }]

    const fetchData = () => dispatch(getCollection(selInvoice(dataMain)));

    const getDocumentType = (documenttype: string) => {
        switch (documenttype) {
            case '0':
                return 'billingfield_billingno';
            case '1':
                return 'billingfield_billingdni';
            case '4':
                return 'billingfield_billingextra';
            case '6':
                return 'billingfield_billingruc';
            case '7':
                return 'billingfield_billingpass';
            default:
                return 'pendingpayment';
        }
    }

    useEffect(() => {
        fetchData()
        dispatch(setMemoryTable({
            id: IDBILLING
        }))
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(getMultiCollection([
                getCorpSel(user?.roledesc === "ADMINISTRADOR" ? user?.corpid : 0),
                getMeasureUnit(),
                getValuesFromDomain("TYPECREDIT", null, user?.orgid, user?.corpid),
                getAppsettingInvoiceSel()]));
        }
    }, [])

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    useEffect(() => {
        if (!openModal) {
            if (waitSave) {
                if (!executeRes.loading && !executeRes.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.deleteinvoicesuccess) }))
                    fetchData && fetchData();
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1")
                } else if (executeRes.error) {
                    const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                    setWaitSave(false);
                    dispatch(showBackdrop(false));
                }
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataInvoice(mainResult.data.map(x => ({
                ...x,
                receiverdoctypecolumn: t(getDocumentType(x.receiverdoctype)),
                receiverdocnumcolumn: x.receiverdocnum ? x.receiverdocnum : t(langKeys.pendingpayment),
                receiverbusinessnamecolumn: x.receiverbusinessname ? x.receiverbusinessname : t(langKeys.pendingpayment),
                invoicestatuscolumn: t(x.invoicestatus),
                paymentstatuscolumn: t(x.paymentstatus),
                invoicetypecolumn: t(getInvoiceType(x.invoicetype)),
                seriecolumn: (x.serie && x.correlative) ? (x.serie + '-' + x.correlative.toString().padStart(8, '0')) : null,
            })))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                accessor: 'corpid',
                Cell: (props: any) => {
                    const row = props.cell.row.original;

                    if ((row.hasreport === false || row.hasreport === true) && row.invoicestatus !== "INVOICED" && row.paymentstatus !== 'PAID') {
                        return (
                            <TemplateIcons
                                deleteFunction={() => handleDelete(row)}
                            />
                        )
                    }
                    else {
                        if (row.invoicestatus !== "INVOICED" || row.type === 'CREDITNOTE') {
                            return null;
                        }
                        else {
                            return (
                                <TemplateIcons
                                    extraFunction={() => handleCreditNote(row)}
                                    extraOption={t(langKeys.generatecreditnote)}
                                />
                            )
                        }
                    }
                }
            },
            {
                Header: t(langKeys.invoiceid),
                accessor: 'invoiceid',
            },
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
            },
            {
                Header: t(langKeys.billingclienttype),
                accessor: 'receiverdoctypecolumn',
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: 'receiverdocnumcolumn',
            },
            {
                Header: t(langKeys.businessname),
                accessor: 'receiverbusinessnamecolumn',
            },
            {
                Header: t(langKeys.invoice_serviceyear),
                accessor: 'year',
            },
            {
                Header: t(langKeys.invoice_servicemonth),
                accessor: 'month',
            },
            {
                Header: t(langKeys.invoicestatus),
                accessor: 'invoicestatuscolumn',
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatuscolumn',
            },
            {
                Header: t(langKeys.documenttype),
                accessor: 'invoicetypecolumn',
            },
            {
                Header: t(langKeys.billingvoucher),
                accessor: 'seriecolumn',
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = (props.cell.row.original.serie && props.cell.row.original.correlative) ? (props.cell.row.original.serie + '-' + props.cell.row.original.correlative.toString().padStart(8, '0')) : null;
                    return (
                        <Fragment>
                            <div>
                                {(urlpdf ?
                                    <a onClick={(e) => { e.stopPropagation(); }} href={urlpdf} target="_blank" style={{ display: "block" }} rel="noreferrer">{docnumber}</a>
                                    :
                                    <span style={{ display: "block" }}>{docnumber}</span>)
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.invoicedate),
                accessor: 'invoicedate',
                Cell: (props: any) => {
                    const { invoicedate } = props.cell.row.original;
                    return (invoicedate || null);
                }
            },
            {
                Header: t(langKeys.expirationdate),
                accessor: 'expirationdate',
                Cell: (props: any) => {
                    const { expirationdate } = props.cell.row.original;
                    return (expirationdate || null);
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
            },
            {
                Header: t(langKeys.taxbase),
                accessor: 'subtotal',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { subtotal } = props.cell.row.original;
                    return formatNumber(subtotal || 0);
                }
            },
            {
                Header: t(langKeys.billingtax),
                accessor: 'taxes',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { taxes } = props.cell.row.original;
                    return formatNumber(taxes || 0);
                }
            },
            {
                Header: t(langKeys.totalamount),
                accessor: 'totalamount',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { totalamount } = props.cell.row.original;
                    return formatNumber(totalamount || 0);
                }
            },
            {
                Header: t(langKeys.comments),
                accessor: 'commentcontent',
                Cell: (props: any) => {
                    const { commentcontent } = props.cell.row.original;
                    const rowdata = props.cell.row.original;
                    if (commentcontent) {
                        return (<Fragment>
                            <div style={{ display: 'inline-block' }}>
                                {(commentcontent || '').substring(0, 50)}... <a onClick={(e) => { e.stopPropagation(); openInvoiceComment(rowdata); }} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }} rel="noreferrer">{t(langKeys.seeMore)}</a>
                            </div>
                        </Fragment>)
                    }
                    else {
                        return (<Fragment>
                            <div style={{ display: 'inline-block' }}>
                                <a onClick={(e) => { e.stopPropagation(); openInvoiceComment(rowdata); }} style={{ display: "block", cursor: 'pointer', textDecoration: 'underline', color: 'blue' }} rel="noreferrer">{t(langKeys.seeMore)}</a>
                            </div>
                        </Fragment>)
                    }
                }
            },
        ],
        []
    );

    useEffect(() => {
        if (!openModal) {
            if (waitSaveImport) {
                if (!executeRes.loading && !executeRes.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(insertexcel ? langKeys.successful_import : langKeys.successful_delete) }))
                    setinsertexcel(false)
                    fetchData();
                    dispatch(showBackdrop(false));
                    setwaitSaveImport(false);
                } else if (executeRes.error) {
                    const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                    dispatch(showBackdrop(false));
                    setwaitSaveImport(false);
                }
            }
        }
    }, [executeRes, waitSaveImport])

    const handleTemplate = () => {
        const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_CORP_SEL'));
        const indexOrg = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_ORG_SEL'));
        const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]
        const receiverdoctype = [{ value: 0, description: "NO DOMICILIADO" }, { value: 1, description: "DNI" }, { value: 4, description: "CARNE EXT." }, { value: 6, description: "RUC" }, { value: 7, description: "PASAPORTE" }]
        const invoicetype = [{ value: "01", description: "FACTURA" }, { value: "03", description: "BOLETA" }]
        let corplist = multiResult.data[indexCorp] && multiResult.data[indexCorp].success ? multiResult.data[indexCorp].data : []
        let orglist = multiResult.data[indexOrg] && multiResult.data[indexOrg].success ? multiResult.data[indexOrg].data : []

        const data = [
            corplist.reduce((a, d) => ({ ...a, [d.corpid]: t(`${d.description}`) }), {}), //"corpid"
            orglist.reduce((a, d) => ({ ...a, [d.orgid]: t(`${d.orgdesc}`) }), {}), //"orgid"
            dataYears.reduce((a, d) => ({ ...a, [d?.value]: t(`${d?.value}`) }), {}), //"year"
            dataMonths.reduce((a, d) => ({ ...a, [+d.val]: t(`${+d.val}`) }), {}), //"month"
            {}, //"description"
            receiverdoctype.reduce((a, d) => ({ ...a, [d.value]: t(`${d.description}`) }), {}), //"receiverdoctype"
            {}, //"receiverdocnum"
            {}, //"receiverbusinessname"
            {}, //"receiverfiscaladdress"
            { "CODIGO DE PAIS": "CODIGO DE PAIS" }, //"receivercountry"
            {}, //"receivermail"
            invoicetype.reduce((a, d) => ({ ...a, [d.value]: t(`${d.description}`) }), {}), //"invoicetype"
            {}, //"serie"
            {}, //"correlative"
            {}, //"invoicedate"
            {}, //"expirationdate"
            { "DRAFT": "DRAFT", "INVOICED": "INVOICED", "ERROR": "ERROR" }, //"invoicestatus"
            { "PENDING": "PENDING", "PAID": "PAID" }, //"paymentstatus"
            {}, //"paymentdate"
            {}, //"paidby"
            { "CARD": "CARD", "REGISTEREDCARD": "REGISTEREDCARD" }, //"paymenttype"
            {}, //"totalamount"
            {}, //"exchangerate"
            dataCurrency.reduce((a, d) => ({ ...a, [d.value]: t(`${d.description}`) }), {}), //"currency"
            {}, //"urlcdr"
            {}, //"urlpdf"
            {}, //"urlxml"
            {}, //"purchaseorder"
            {}, //"comments"
            { "typecredit_alcontado": "typecredit_alcontado", "typecredit_15": "typecredit_15", "typecredit_30": "typecredit_30", "typecredit_45": "typecredit_45", "typecredit_60": "typecredit_60", "typecredit_90": "typecredit_90" }, //"credittype"
        ];
        const header = ["corpid", "orgid", "year", "month", "description", "receiverdoctype", "receiverdocnum", "receiverbusinessname", "receiverfiscaladdress", "receivercountry", "receivermail", "invoicetype", "serie", "correlative", "invoicedate", "expirationdate", "invoicestatus", "paymentstatus", "paymentdate", "paidby", "paymenttype", "totalamount", "exchangerate", "currency", "urlcdr", "urlpdf", "urlxml", "purchaseorder", "comments", "credittype"];
        exportExcel(`${t(langKeys.template)} - ${t(langKeys.invoice)}`, templateMaker(data, header));
    }

    const importCSV = async (files: any[]) => {
        setinsertexcel(true)
        const file = files[0];
        if (file) {
            const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_CORP_SEL'));
            const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]
            let corplist = multiResult.data[indexCorp] && multiResult.data[indexCorp].success ? multiResult.data[indexCorp].data : []
            const receiverdoctypeList = [{ value: 0, description: "NO DOMICILIADO" }, { value: 1, description: "DNI" }, { value: 4, description: "CARNE EXT." }, { value: 6, description: "RUC" }, { value: 7, description: "PASAPORTE" }]
            const invoicetypeList = [{ value: "01", description: "FACTURA" }, { value: "03", description: "BOLETA" }]

            let data: any = (await uploadExcel(file, undefined) as any[]);
            data = data.filter((d: any) => !['', null, undefined].includes(d.description)
                && !['', null, undefined].includes(d.receiverdocnum)
                && !['', null, undefined].includes(d.receiverbusinessname)
                && !['', null, undefined].includes(d.receiverfiscaladdress)
                && !['', null, undefined].includes(d.receivercountry)
                && !['', null, undefined].includes(d.receivermail)
                && !['', null, undefined].includes(d.invoicestatus)
                && !['', null, undefined].includes(d.paymentstatus)
                && !['', null, undefined].includes(d.totalamount)
                && !['', null, undefined].includes(d.exchangerate)
                && Object.keys(invoicetypeList.reduce((a, d) => ({ ...a, [d.value]: d.description }), {})).includes(d.invoicetype)
                && Object.keys(receiverdoctypeList.reduce((a, d) => ({ ...a, [d.value]: d.description }), {})).includes('' + d.receiverdoctype)
                && Object.keys(corplist.reduce((a, d) => ({ ...a, [d.corpid]: d.description }), {})).includes('' + d.corpid)
                && Object.keys(dataYears.reduce((a, d) => ({ ...a, [d.value]: d.value }), {})).includes('' + d.year)
                && Object.keys(dataMonths.reduce((a, d) => ({ ...a, [d.val]: d.val }), {})).includes(`${d.month}`.padStart(2, '0'))
                && Object.keys(dataCurrency.reduce((a, d) => ({ ...a, [d.value]: d.description }), {})).includes('' + d.currency)
            );

            if (data.length > 0) {
                dispatch(showBackdrop(true));
                dispatch(execute({
                    header: null,
                    detail: data.map((x: any) => insInvoice({
                        ...x,
                        corpid: Number(x.corpid) || 0,
                        orgid: Number(x.orgid) || 0,
                        year: Number(x.year),
                        month: Number(x.month),
                        receiverdoctype: String(x.receiverdoctype),
                        receiverdocnum: String(x.receiverdocnum),
                        receiverbusinessname: String(x.receiverbusinessname),
                        receiverfiscaladdress: String(x.receiverfiscaladdress),
                        receivercountry: String(x.receivercountry),
                        receivermail: String(x.receivermail),
                        invoicetype: String(x.invoicetype),
                        serie: String(x.serie || ''),
                        correlative: Number(x.correlative) || 0,
                        invoicedate: new Date(x.invoicedate),
                        expirationdate: new Date(x.expirationdate),
                        invoicestatus: String(x.invoicestatus),
                        paymentstatus: String(x.paymentstatus),
                        paymentdate: new Date(x.paymentdate),
                        paidby: String(x.paidby || ''),
                        paymenttype: String(x.paymenttype || ''),
                        totalamount: Number(x.totalamount),
                        exchangerate: Number(x.exchangerate),
                        currency: String(x.currency),
                        urlcdr: String(x.urlcdr || ''),
                        urlpdf: String(x.urlpdf || ''),
                        urlxml: String(x.urlxml || ''),
                        purchaseorder: String(x.purchaseorder || ''),
                        comments: String(x.comments || ''),
                        credittype: String(x.credittype),
                        description: String(x.description),
                        status: "ACTIVO",
                    }))
                }, true));
                setwaitSaveImport(true)
            }
        }
    }

    const openInvoiceComment = (row: Dictionary) => {
        setViewSelected("view-1");
        setOpenModalData(row);
        setOpenModal(true);
    }

    const onModalSuccess = () => {
        setOpenModal(false);
        fetchData();
        setViewSelected("view-1");
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(deleteInvoice(row)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.cancelinvoice),
            callback
        }))
    }

    const handleView = (row: Dictionary) => {
        if (row.invoicestatus === 'PENDING' || (row.invoicestatus === 'DRAFT' && row.hasreport === true)) {
            setViewSelected("view-3");
            setRowSelected({ row: row, edit: true });
        }
        else {
            setViewSelected("view-2");
            setIsCreditNote(false);
            setIsRegularize(true);
            setOperationName('');
            setRowSelected(row);
        }
    }

    const handleCreditNote = (row: Dictionary) => {
        setViewSelected("view-2");
        setIsCreditNote(true);
        setIsRegularize(false);
        setOperationName('generatecreditnote');
        setRowSelected(row);
    }

    const handleRegister = () => {
        setViewSelected("view-3");
        setRowSelected({ row: null, edit: true });
    }

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case '01':
                return 'emissorinvoice';
            case '03':
                return 'emissorticket';
            case '07':
                return 'emissorcreditnote';
            default:
                return 'emissornone';
        }
    }

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: '100%' }}>
                <InvoiceCommentModal
                    data={openModalData}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    onTrigger={onModalSuccess}
                />
                <TableZyx
                    onClickRow={handleView}
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 140 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 214 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldSelect
                                label={t(langKeys.corporation)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))}
                                data={dataCorp}
                                optionDesc="description"
                                optionValue="corpid"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '')}
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, orgid: value?.orgid || 0 }))}
                                data={dataOrg.filter((e: any) => { return e.corpid === dataMain.corpid })}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.currency)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.currency}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, currency: value?.value || '' }))}
                                data={dataCurrency}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.paymentstatus)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.paymentstatus}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, paymentstatus: value?.value || '' }))}
                                data={dataPayment}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                            />
                            <Button
                                disabled={mainResult.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={fetchData}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={dataInvoice}
                    filterGeneral={false}
                    importCSV={importCSV}
                    handleTemplate={handleTemplate}
                    download={true}
                    loading={mainResult.loading || multiResult.loading}
                    register={true}
                    handleRegister={handleRegister}
                    registertext={langKeys.generateinvoice}
                    pageSizeDefault={IDBILLING === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDBILLING === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDBILLING === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    } else if (viewSelected === "view-2") {
        return (
            <BillingOperation
                data={rowSelected}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
                creditNote={isCreditNote}
                regularize={isRegularize}
                operationName={operationName}
            />
        );
    } else {
        return (
            <BillingRegister
                data={rowSelected}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    }
}

const InvoiceCommentModal: FC<{ data: any, openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainAux2);
    const executeResult = useSelector(state => state.main.execute);

    const [dataInvoiceComment, setDataInvoiceComment] = useState<Dictionary[]>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [waitLoad, setWaitLoad] = useState(false);
    const [contentValidation, setContentValidation] = useState('');
    const [reloadExit, setReloadExit] = useState(false);

    const [fields, setFields] = useState({
        "corpid": data?.corpid,
        "orgid": data?.orgid,
        "invoiceid": data?.invoiceid,
        "invoicecommentid": 0,
        "description": '',
        "status": 'ACTIVO',
        "type": '',
        "commentcontent": '',
        "commenttype": 'text',
        "commentcaption": '',
    })

    const fetchData = () => {
        dispatch(getCollectionAux2(selInvoiceComment({
            corpid: data?.corpid,
            orgid: data?.orgid,
            invoiceid: data?.invoiceid,
            invoicecommentid: 0,
        })));
        setWaitLoad(true);
        dispatch(showBackdrop(true));
    }

    useEffect(() => {
        if (openModal && data) {
            setDataInvoiceComment([]);
            setContentValidation('');
            setReloadExit(false);

            let partialFields = fields;
            partialFields.corpid = data?.corpid;
            partialFields.orgid = data?.orgid;
            partialFields.invoiceid = data?.invoiceid;
            partialFields.invoicecommentid = 0;
            partialFields.description = '';
            partialFields.status = 'ACTIVO';
            partialFields.type = '';
            partialFields.commentcontent = '';
            partialFields.commenttype = 'text';
            partialFields.commentcaption = '';
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
                setWaitLoad(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [mainResult, waitLoad])

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);

                setDataInvoiceComment([]);

                let partialFields = fields;
                partialFields.commentcontent = '';
                setFields(partialFields);

                fetchData();

                setReloadExit(true);
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleCommentRegister = () => {
        if (fields) {
            if (fields.commentcontent) {
                setContentValidation('');

                const callback = () => {
                    dispatch(execute(insInvoiceComment(fields)));
                    dispatch(showBackdrop(true));
                    setWaitSave(true);
                }

                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback
                }))
            }
            else {
                setContentValidation(t(langKeys.required_fields_missing));
            }
        }
    }

    const handleCommentDelete = (data: any) => {
        if (fields && data) {
            const callback = () => {
                var fieldTemporal = fields;

                fieldTemporal.corpid = data?.corpid;
                fieldTemporal.orgid = data?.orgid;
                fieldTemporal.invoiceid = data?.invoiceid;
                fieldTemporal.invoicecommentid = data?.invoicecommentid;
                fieldTemporal.description = data?.description;
                fieldTemporal.status = 'ELIMINADO';
                fieldTemporal.type = data?.type;
                fieldTemporal.commentcontent = data?.commentcontent;
                fieldTemporal.commenttype = data?.commenttype;
                fieldTemporal.commentcaption = data?.commentcaption;

                dispatch(execute(insInvoiceComment(fieldTemporal)));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback
            }))
        }
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.invoicecomments)}
            buttonText1={t(langKeys.close)}
            handleClickButton1={() => { setOpenModal(false); if (reloadExit) { onTrigger(); } }}
        >
            <div style={{ overflowY: 'auto' }}>
                {dataInvoiceComment.map((item, index) => (
                    <div style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#762AA9", borderRadius: "4px", padding: "10px", margin: "10px" }}>
                        <div style={{ display: 'flex' }}>
                            <b style={{ width: '100%' }}>{item.createby} {t(langKeys.invoiceat)} {convertLocalDate(item.createdate || '').toLocaleString()}</b>
                            <Button
                                className={classes.buttoncomments}
                                variant="contained"
                                color="primary"
                                type='button'
                                style={{ backgroundColor: "#FB5F5F" }}
                                onClick={() => handleCommentDelete(item)}
                            >{t(langKeys.delete)}
                            </Button>
                        </div>
                        <FieldEditMulti
                            className="col-12"
                            label={''}
                            valueDefault={item.commentcontent}
                            disabled={true}
                        />
                    </div>
                ))}
                <div style={{ padding: "10px", margin: "10px" }}>
                    <div style={{ display: 'flex' }}>
                        <b style={{ width: '100%' }}>{t(langKeys.new)} {t(langKeys.invoicecomment)}</b>
                        <Button
                            className={classes.buttoncomments}
                            variant="contained"
                            color="primary"
                            type='button'
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => handleCommentRegister()}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                    <FieldEditMulti
                        className="col-12"
                        label={''}
                        valueDefault={fields.commentcontent}
                        error={contentValidation}
                        onChange={(value) => {
                            let partialf = fields;
                            partialf.commentcontent = value;
                            setFields(partialf);
                        }}
                    />
                </div>
            </div>
        </DialogZyx>
    )
}

const BillingOperation: FC<DetailProps> = ({ data, creditNote, regularize, operationName, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiResult = useSelector(state => state.culqi.requestCreateCreditNote);
    const emitResult = useSelector(state => state.culqi.requestEmitInvoice);
    const multiResult = useSelector(state => state.main.multiDataAux);

    const [measureList, setMeasureList] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const [pageSelected, setPageSelected] = useState(0);
    const [productList, setProductList] = useState<any>([]);
    const [showDiscount, setShowDiscount] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const invocesBread = [
        { id: "view-1", name: t(langKeys.billingtitle) },
        { id: "view-2", name: t(langKeys.billinginvoicedetail) }
    ];

    const datacreditnote = [
        { value: "01", description: t(langKeys.billingcreditnote01) },
        { value: "04", description: t(langKeys.billingcreditnote04) }
    ]

    useEffect(() => {
        if (!data) {
            setViewSelected("view-1");
        }

        setMeasureList({ loading: false, data: [] });
        setProductList({ loading: false, data: [] });

        const trueinvoiceid = (data?.referenceinvoiceid ? data.referenceinvoiceid : data?.invoiceid);

        dispatch(getMultiCollectionAux([getMeasureUnit(), getInvoiceDetail(data?.corpid, data?.orgid, trueinvoiceid)]));
    }, [])

    useEffect(() => {
        setValue('productdetail', []);

        if (productList) {
            if (productList.data) {
                var productInformationList: Partial<unknown>[] = [];

                productList.data.forEach((element: { description: any; productcode: any; measureunit: any; quantity: any; productnetprice: any; }) => {
                    productInformationList.push({
                        productdescription: element.description,
                        productcode: element.productcode,
                        productmeasure: element.measureunit,
                        productquantity: element.quantity,
                        productsubtotal: element.productnetprice,
                    })
                });

                fieldsAppend(productInformationList);
            }
        }
    }, [productList]);

    useEffect(() => {
        const indexMeasure = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_MEASUREUNIT_SEL'));

        if (indexMeasure > -1) {
            setMeasureList({ loading: false, data: multiResult.data[indexMeasure] && multiResult.data[indexMeasure].success ? multiResult.data[indexMeasure].data : [] });
        }

        const indexProduct = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_INVOICEDETAIL_SELBYINVOICEID'));

        if (indexProduct > -1) {
            setProductList({ loading: false, data: multiResult.data[indexProduct] && multiResult.data[indexProduct].success ? multiResult.data[indexProduct].data : [] });
        }
    }, [multiResult]);

    const { control, handleSubmit, register, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            corpid: data?.corpid,
            orgid: data?.orgid,
            invoiceid: data?.invoiceid,
            creditnotetype: '',
            creditnotemotive: '',
            creditnotediscount: 0.0,
            invoicestatus: data?.invoicestatus,
            productdetail: [],
            hasreport: data?.hasreport,
        }
    });

    const { fields, append: fieldsAppend } = useFieldArray({
        control,
        name: 'productdetail',
    });

    React.useEffect(() => {
        register('corpid', { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register('orgid');
        register('invoiceid', { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register('creditnotetype', { validate: (value) => (regularize || (value && value.length > 0)) || "" + t(langKeys.field_required) });
        register('creditnotemotive', { validate: (value) => (regularize || (value && value.length > 10)) || "" + t(langKeys.field_required_shorter) });
        register('creditnotediscount', { validate: (value) => (regularize || ((getValues('creditnotetype') !== '04') || (value && value > 0 && value < data?.subtotal))) || "" + t(langKeys.discountvalidmessage) });
    }, [register]);

    const getDocumentType = (documenttype: string) => {
        switch (documenttype) {
            case '0':
                return 'billingfield_billingno';
            case '1':
                return 'billingfield_billingdni';
            case '4':
                return 'billingfield_billingextra';
            case '6':
                return 'billingfield_billingruc';
            case '7':
                return 'billingfield_billingpass';
            default:
                return '';
        }
    }

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case '01':
                return 'emissorinvoice';
            case '03':
                return 'emissorticket';
            case '07':
                return 'emissorcreditnote';
            default:
                return '';
        }
    }

    const getCreditNoteType = (creditnotetype: string) => {
        switch (creditnotetype) {
            case '01':
                return 'billingcreditnote01';
            case '04':
                return 'billingcreditnote04';
            default:
                return '';
        }
    }

    const onSubmit = handleSubmit((data) => {
        if (data?.invoicestatus === 'ERROR' || ((data?.invoicestatus !== 'INVOICED' && data?.invoicestatus !== 'ERROR') && data?.hasreport)) {
            const callback = () => {
                dispatch(emitInvoice(data));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: data?.invoicestatus === 'ERROR' ? t(langKeys.confirmatiom_reemit) : t(langKeys.confirmation_emit),
                callback
            }))
        }
        else {
            if (creditNote) {
                const callback = () => {
                    dispatch(createCreditNote(data));
                    dispatch(showBackdrop(true));
                    setWaitSave(true);
                }

                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback
                }))
            }

            if (regularize) {
                setOpenModal(true);
            }
        }
    });

    const onModalSuccess = () => {
        setOpenModal(false);
        fetchData();
        setViewSelected("view-1");
    }

    useEffect(() => {
        if (waitSave) {
            if (data?.invoicestatus === 'ERROR' || ((data?.invoicestatus !== 'INVOICED' && data?.invoicestatus !== 'ERROR') && data?.hasreport)) {
                if (!emitResult.loading && !emitResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(emitResult.code || "success") }))
                    dispatch(showBackdrop(false));
                    fetchData();
                    setViewSelected('view-1');
                    setWaitSave(false);
                }
                else if (emitResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(emitResult.code || "error_unexpected_db_error") }))
                    dispatch(showBackdrop(false));
                    fetchData();
                    setViewSelected('view-1');
                    setWaitSave(false);
                }
            }
            else {
                if (!culqiResult.loading && !culqiResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(culqiResult.code || "success") }))
                    dispatch(showBackdrop(false));
                    fetchData();
                    setViewSelected('view-1');
                    setWaitSave(false);
                }
                else if (culqiResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(culqiResult.code || "error_unexpected_db_error") }))
                    dispatch(showBackdrop(false));
                    fetchData();
                    setViewSelected('view-1');
                    setWaitSave(false);
                }
            }
        }
    }, [culqiResult, emitResult, waitSave])

    return (
        <div style={{ width: '100%' }}>
            <RegularizeModal
                data={data}
                openModal={openModal}
                setOpenModal={setOpenModal}
                onTrigger={onModalSuccess}
            />
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={invocesBread}
                            handleClick={(id) => { setViewSelected(id); fetchData(); }}
                        />
                        <TitleDetail
                            title={operationName ? t(operationName) : t(langKeys.billinginvoiceview)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => { setViewSelected("view-1"); fetchData(); }}
                        >{t(langKeys.back)}</Button>
                        {(data?.invoicestatus === 'ERROR' && data?.invoicetype !== '07') ? (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type='submit'
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.reemitinvoice)}
                            </Button>
                        ) : null
                        }
                        {((data?.invoicestatus !== 'INVOICED' && data?.invoicestatus !== 'ERROR') && data?.invoicetype !== '07' && data?.hasreport) ? (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type='submit'
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.emitinvoice)}
                            </Button>
                        ) : null
                        }
                        {(data?.invoicestatus === 'INVOICED' && creditNote) ? (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type='submit'
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.emitinvoice)}
                            </Button>
                        ) : null
                        }
                        {(data?.invoicestatus === 'INVOICED' && data?.paymentstatus !== 'PAID' && data?.invoicetype !== '07' && regularize) ? (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type='submit'
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.regulatepayment)}
                            </Button>
                        ) : null
                        }
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: 16 }}>
                    <Tabs
                        value={pageSelected}
                        indicatorColor="primary"
                        variant="fullWidth"
                        style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                        textColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                    >
                        <AntTab label={t(langKeys.billinginvoicedata)} />
                        <AntTab label={t(langKeys.billingadditionalinfo)} />
                    </Tabs>
                    {pageSelected === 0 && <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.invoice_serviceyear)}
                                value={data?.year}
                                className="col-6"
                            />
                            <FieldView
                                label={t(langKeys.invoice_servicemonth)}
                                value={data?.month}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.docType)}
                                value={t(getDocumentType(data?.receiverdoctype))}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.documentnumber)}
                                value={data?.receiverdocnum}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.billingname)}
                                value={data?.receiverbusinessname}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.invoicestatus)}
                                value={t(data?.invoicestatus)}
                                className="col-3"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.invoiceid)}
                                value={data?.invoiceid}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.documenttype)}
                                value={t(getInvoiceType(data?.invoicetype))}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.billingvoucher)}
                                value={(data?.serie ? data.serie : 'X000') + '-' + (data?.correlative ? data?.correlative.toString().padStart(8, '0') : '00000000')}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.invoicedate)}
                                value={data?.invoicedate}
                                className="col-3"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.credittype)}
                                value={t(data?.credittype)}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.dueDate)}
                                value={data?.expirationdate}
                                className="col-3"
                            />
                            {(data?.type === 'CREDITNOTE') ? (
                                <FieldView
                                    label={t(langKeys.referenceddocument)}
                                    value={(data?.referenceserie ? data.referenceserie : 'X000') + '-' + (data?.referencecorrelative ? data?.referencecorrelative.toString().padStart(8, '0') : '00000000')}
                                    className="col-3"
                                />
                            ) : (
                                <FieldView
                                    label={t(langKeys.purchaseorder)}
                                    value={data?.purchaseorder}
                                    className="col-3"
                                />
                            )}
                            {(data?.type === 'CREDITNOTE') ? (
                                <FieldView
                                    label={t(langKeys.ticket_reason)}
                                    value={(data?.creditnotemotive)}
                                    className="col-3"
                                />
                            ) : (
                                <FieldView
                                    label={t(langKeys.comments)}
                                    value={data?.comments}
                                    className="col-3"
                                />
                            )}
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.currency)}
                                value={data?.currency}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.taxbase)}
                                value={formatNumber(data?.subtotal || 0)}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.billingtax)}
                                value={formatNumber(data?.taxes || 0)}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.totalamount)}
                                value={formatNumber(data?.totalamount || 0)}
                                className="col-3"
                            />
                        </div>
                        {(data?.type === 'CREDITNOTE') ? (
                            <div className="row-zyx">
                                <FieldView
                                    label={t(langKeys.creditnotetype)}
                                    value={t(getCreditNoteType(data?.creditnotetype))}
                                    className="col-3"
                                />
                                {(data?.creditnotetype === '04') ? (
                                    <FieldView
                                        label={t(langKeys.globaldiscount)}
                                        value={formatNumber(data?.creditnotediscount || 0)}
                                        className="col-3"
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {(creditNote) ? (
                            <div className="row-zyx">
                                <FieldSelect
                                    className="col-3"
                                    label={t(langKeys.creditnotetype)}
                                    onChange={(value) => { setValue('creditnotetype', value?.value); setShowDiscount(value?.value === '04') }}
                                    valueDefault={getValues('creditnotetype')}
                                    data={datacreditnote}
                                    optionDesc="description"
                                    optionValue="value"
                                    error={errors?.creditnotetype?.message}
                                    orderbylabel={true}
                                />
                                <FieldEdit
                                    label={t(langKeys.ticket_reason)}
                                    className="col-3"
                                    valueDefault={getValues('creditnotemotive')}
                                    onChange={(value) => setValue('creditnotemotive', value)}
                                    error={errors?.creditnotemotive?.message}
                                />
                                {(showDiscount) ? (
                                    <FieldEdit
                                        label={t(langKeys.globaldiscount)}
                                        className="col-3"
                                        valueDefault={getValues('creditnotediscount')}
                                        onChange={(value) => setValue('creditnotediscount', value)}
                                        error={errors?.creditnotediscount?.message}
                                        type="number"
                                        inputProps={{ step: "any" }}
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
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.description)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.measureunit)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.unitaryprice)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.quantity)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.billingsubtotal)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.map((item, i) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <FieldView
                                                        label={''}
                                                        value={getValues(`productdetail.${i}.productdescription`)}
                                                        className={classes.fieldView}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldSelect
                                                        className={classes.fieldView}
                                                        loading={measureList.loading}
                                                        valueDefault={getValues(`productdetail.${i}.productmeasure`)}
                                                        data={measureList.data}
                                                        optionDesc="description"
                                                        optionValue="code"
                                                        disabled={true}
                                                        orderbylabel={true}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView
                                                        label={''}
                                                        value={formatNumber(getValues(`productdetail.${i}.productsubtotal`) || 0)}
                                                        className={classes.fieldView}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView
                                                        label={''}
                                                        value={formatNumber(getValues(`productdetail.${i}.productquantity`) || 0)}
                                                        className={classes.fieldView}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView
                                                        label={''}
                                                        value={formatNumber((getValues(`productdetail.${i}.productsubtotal`) || 0) * (getValues(`productdetail.${i}.productquantity`) || 0))}
                                                        className={classes.fieldView}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>}
                    {pageSelected === 1 && <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldView
                                label={''}
                                value={t(langKeys.invoiceinformation)}
                                className={classes.section}
                            />
                        </div>
                        <div className="row-zyx">
                            {(data?.urlpdf) ? (
                                <div className='col-4'>
                                    <a href={data?.urlpdf} target="_blank" rel="noreferrer">{t(langKeys.urlpdf)}</a>
                                </div>
                            ) : (
                                <FieldView
                                    label={t(langKeys.urlpdf)}
                                    value={t(langKeys.pendingpayment)}
                                    className="col-4"
                                />
                            )}
                            {(data?.urlcdr) ? (
                                <div className='col-4'>
                                    <a href={data?.urlcdr} target="_blank" rel="noreferrer">{t(langKeys.urlcdr)}</a>
                                </div>
                            ) : (
                                <FieldView
                                    label={t(langKeys.urlcdr)}
                                    value={t(langKeys.pendingpayment)}
                                    className="col-4"
                                />
                            )}
                            {(data?.urlxml) ? (
                                <div className='col-4'>
                                    <a href={data?.urlxml} target="_blank" rel="noreferrer">{t(langKeys.urlxml)}</a>
                                </div>
                            ) : (
                                <FieldView
                                    label={t(langKeys.urlxml)}
                                    value={t(langKeys.pendingpayment)}
                                    className="col-4"
                                />
                            )}
                        </div>
                        {(data?.errordescription) ? (
                            <div className="row-zyx">
                                <FieldView
                                    label={t(langKeys.billingerror)}
                                    value={data?.errordescription}
                                    className="col-12"
                                />
                            </div>
                        ) : null}
                        <div className="row-zyx">
                            <FieldView
                                label={''}
                                value={t(langKeys.paymentinformation)}
                                className={classes.section}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.paymentstatus)}
                                value={t(data?.paymentstatus)}
                                className="col-4"
                            />
                            <FieldView
                                label={t(langKeys.paymentdate)}
                                value={data?.paymentdate ? toISOLocalString(new Date(data?.paymentdate)).replace("T", " ").substring(0, 19) : t(langKeys.none)}
                                className="col-4"
                            />
                            <FieldView
                                label={t(langKeys.billingusername)}
                                value={data?.paymentdate ? data?.changeby : t(langKeys.none)}
                                className="col-4"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.paymentnote)}
                                value={t(data?.invoicepaymentnote || langKeys.none)}
                                className="col-4"
                            />
                            <FieldView
                                label={t(langKeys.paymentcommentary)}
                                value={t(data?.paymentcommentary || langKeys.none)}
                                className="col-4"
                            />
                            {(data?.invoicereferencefile) ? (
                                <div className='col-4'>
                                    <a href={data?.invoicereferencefile} target="_blank" rel="noreferrer">{t(langKeys.paymentreferenceview)}</a>
                                </div>
                            ) : (
                                <FieldView
                                    label={t(langKeys.paymentfile)}
                                    value={t(langKeys.none)}
                                    className="col-4"
                                />
                            )}
                        </div>
                    </div>}
                </div>
            </form>
        </div >
    )
}

const RegularizeModal: FC<{ data: any, openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const culqiResult = useSelector(state => state.culqi.requestRegularizeInvoice);
    const uploadResult = useSelector(state => state.main.uploadFile);

    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);

    const { register, trigger, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            corpid: data?.corpid,
            orgid: data?.orgid,
            invoiceid: data?.invoiceid,
            invoicereferencefile: '',
            invoicepaymentnote: '',
            invoicepaymentcommentary: '',
        }
    });

    React.useEffect(() => {
        register('corpid', { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register('orgid');
        register('invoiceid', { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register('invoicereferencefile', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoicepaymentnote', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoicepaymentcommentary', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
        if (waitSave) {
            if (!culqiResult.loading && !culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(culqiResult.code || "success") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                onTrigger();
            }
            else if (culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(culqiResult.code || "error_unexpected_db_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [culqiResult, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(regularizeInvoice(data));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById('attachmentInput');
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachment(file);
            let fd = new FormData();
            fd.append('file', file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, [])

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById('attachmentInput') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        setFileAttachment(null);
        setValue('invoicereferencefile', getValues('invoicereferencefile').split(',').filter((a: string) => a !== f).join(''));
        await trigger('invoicereferencefile');
    }

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('invoicereferencefile', [getValues('invoicereferencefile'), uploadResult?.url || ''].join(''))
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.regulatepayment)}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
            buttonText2={t(langKeys.save)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <FieldEdit
                label={t(langKeys.paymentnote)}
                valueDefault={getValues('invoicepaymentnote')}
                error={errors?.invoicepaymentnote?.message}
                onChange={(value) => setValue('invoicepaymentnote', value)}
                className="col-12"
            />
            <FieldEdit
                label={t(langKeys.paymentcommentary)}
                valueDefault={getValues('invoicepaymentcommentary')}
                error={errors?.invoicepaymentcommentary?.message}
                onChange={(value) => setValue('invoicepaymentcommentary', value)}
                className="col-12"
            />
            <FieldEdit
                label={t(langKeys.evidenceofpayment)}
                valueDefault={getValues('invoicereferencefile')}
                error={errors?.invoicereferencefile?.message}
                disabled={true}
            />
            <React.Fragment>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="attachmentInput"
                    type="file"
                    onChange={(e) => onChangeAttachment(e.target.files)}
                />
                {<IconButton
                    onClick={onClickAttachment}
                    disabled={(waitUploadFile || fileAttachment !== null)}
                >
                    <AttachFileIcon color="primary" />
                </IconButton>}
                {!!getValues("invoicereferencefile") && getValues("invoicereferencefile").split(',').map((f: string, i: number) => (
                    <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                ))}
                {waitUploadFile && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
            </React.Fragment>
        </DialogZyx>
    )
}

interface FilePreviewProps {
    src: File | string;
    onClose?: (f: string) => void;
}

const useFilePreviewStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'white',
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 300,
        maxHeight: 80,
        alignItems: 'center',
        width: 'fit-content',
        overflow: 'hidden'
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'lightgrey',
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes('http'), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = (src as string).match(/.*\/(.+?)\./);
            return m && m.length > 1 ? m[1] : "";
        };
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split('.').pop()?.toUpperCase() || "-";
        }
        return (src as File).name?.split('.').pop()?.toUpperCase() || "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: '0.5em' }} />
            <div className={classes.infoContainer}>
                <div>
                    <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 190, whiteSpace: 'nowrap' }}>{getFileName()}</div>{getFileExt()}
                </div>
            </div>
            <div style={{ width: '0.5em' }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: '10%' }} />}
                {isUrl() && (
                    <a href={src as string} target="_blank" rel="noreferrer" download={`${getFileName()}.${getFileExt()}`}>
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}

const BillingRegister: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiResult = useSelector(state => state.culqi.requestCreateInvoice);
    const executeRes = useSelector(state => state.main.execute);
    const invoicehasreport = data?.row?.hasreport || false;
    const multiResult = useSelector(state => state.main.multiDataAux);
    const user = useSelector(state => state.login.validateToken.user);

    const [appsettingData, setAppsettingData] = useState<any>([]);
    const [creditTypeList, setCreditTypeList] = useState<any>([]);
    const [corpList, setCorpList] = useState<any>([]);
    const [orgList, setOrgList] = useState<any>([]);
    const [measureList, setMeasureList] = useState<any>([]);
    const [productList, setProductList] = useState<any>([]);
    const [savedCorp, setSavedCorp] = useState<any>();
    const [waitSave, setWaitSave] = useState(false);
    const [waitLoad, setWaitLoad] = useState(false);
    const [waitOrgLoad, setWaitOrgLoad] = useState(false);
    const [waitOrg, setWaitOrg] = useState(false);
    const [showInsertMessage, setShowInsertMessage] = useState(false);
    const [pageSelected, setPageSelected] = useState(0);
    const [amountTax, setAmountTax] = useState(0);
    const [amountTotal, setAmountTotal] = useState(0);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [waitRefresh, setWaitRefresh] = useState(false);

    const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]

    const invocesBread = [
        { id: "view-1", name: t(langKeys.billingtitle) },
        { id: "view-3", name: t(langKeys.billinggeneration) }
    ];

    useEffect(() => {
        setCreditTypeList({ loading: true, data: [] });
        setCorpList({ loading: true, data: [] });
        setMeasureList({ loading: true, data: [] });
        setOrgList({ loading: false, data: [] });
        setProductList({ loading: false, data: [] });

        dispatch(getMultiCollectionAux([getCorpSel(user?.roledesc === "ADMINISTRADOR" ? user?.corpid : 0), getMeasureUnit(), getValuesFromDomain("TYPECREDIT", null, user?.orgid, user?.corpid), getAppsettingInvoiceSel()]));
    }, [])

    useEffect(() => {
        if (waitLoad) {
            if (data?.row) {
                if (data?.row.invoicestatus !== "INVOICED" && data?.row.paymentstatus !== "PAID" && invoicehasreport && user?.roledesc === "SUPERADMIN") {
                    setShowUpdateButton(true);
                }

                dispatch(getMultiCollectionAux([getInvoiceDetail(data?.row.corpid, data?.row.orgid, data?.row.invoiceid)]));

                setValue('invoicecurrency', data?.row.currency);
                setValue('invoicepurchaseorder', data?.row.purchaseorder);
                setValue('invoicecomments', data?.row.comments);

                if (data?.row.orgid) {
                    var corporationdata = corpList.data.find((x: { corpid: any; }) => x.corpid === data?.row.corpid);

                    dispatch(getMultiCollectionAux([getOrgSel(0, corporationdata.corpid)]));
                    setValue('billbyorg', corporationdata?.billbyorg);
                    setSavedCorp(corporationdata);
                    setWaitOrg(true);
                }
                else {
                    if (corpList) {
                        if (corpList.data) {
                            corporationdata = corpList.data.find((x: { corpid: any; }) => x.corpid === data?.row.corpid);

                            setSubmitData(corporationdata);
                            setValue('billbyorg', corporationdata?.billbyorg);
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
                var organizationdata = orgList.data.find((x: { orgid: any; }) => x.orgid === data?.row.orgid);

                if (organizationdata) {
                    setSubmitData(organizationdata);
                }
                else {
                    setSubmitData(savedCorp);
                }
            }
        }
    }, [waitOrg, waitOrgLoad]);

    useEffect(() => {
        setValue('productdetail', []);

        if (data?.row) {
            if (productList) {
                if (productList.data) {
                    var productInformationList: Partial<unknown>[] = [];

                    productList.data.forEach((element: { description: any; productcode: any; measureunit: any; quantity: any; netamount: any; }) => {
                        productInformationList.push({
                            productdescription: element.description,
                            productcode: element.productcode,
                            productmeasure: element.measureunit,
                            productquantity: element.quantity,
                            productsubtotal: element.netamount,
                        })
                    });

                    fieldsAppend(productInformationList);

                    onProductChange();
                }
            }
        }
    }, [productList]);

    useEffect(() => {
        const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_CORP_SEL'));

        if (indexCorp > -1) {
            setCorpList({ loading: false, data: multiResult.data[indexCorp] && multiResult.data[indexCorp].success ? multiResult.data[indexCorp].data : [] });
            setWaitLoad(true);
        }

        const indexOrg = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_ORG_SEL'));

        if (indexOrg > -1) {
            setOrgList({ loading: false, data: multiResult.data[indexOrg] && multiResult.data[indexOrg].success ? multiResult.data[indexOrg].data : [] });
            setWaitOrgLoad(true);
        }

        const indexMeasure = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_MEASUREUNIT_SEL'));

        if (indexMeasure > -1) {
            setMeasureList({ loading: false, data: multiResult.data[indexMeasure] && multiResult.data[indexMeasure].success ? multiResult.data[indexMeasure].data : [] });
        }

        const indexCreditType = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES'));

        if (indexCreditType > -1) {
            setCreditTypeList({ loading: false, data: multiResult.data[indexCreditType] && multiResult.data[indexCreditType].success ? multiResult.data[indexCreditType].data : [] });
        }

        const indexProduct = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_INVOICEDETAIL_SELBYINVOICEID'));

        if (indexProduct > -1) {
            setProductList({ loading: false, data: multiResult.data[indexProduct] && multiResult.data[indexProduct].success ? multiResult.data[indexProduct].data : [] });
        }

        const indexAppsetting = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_APPSETTING_INVOICE_SEL'));

        if (indexAppsetting > -1) {
            setAppsettingData({ loading: false, data: multiResult.data[indexAppsetting] && multiResult.data[indexAppsetting].success ? multiResult.data[indexAppsetting].data : [] });
        }
    }, [multiResult]);

    const { control, handleSubmit, register, trigger, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            corpid: 0,
            orgid: 0,
            clientdoctype: '',
            clientdocnumber: '',
            clientbusinessname: '',
            clientfiscaladdress: '',
            clientcountry: '',
            clientmail: '',
            clientcredittype: '',
            invoicecreatedate: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString().split('T')[0],
            invoiceduedate: '',
            invoicecurrency: 'USD',
            invoicetotalamount: 0.00,
            invoicepurchaseorder: '',
            invoicecomments: '',
            autosendinvoice: null,
            productdetail: [],
            billbyorg: false,
            onlyinsert: false,
            invoiceid: data?.row ? data?.row.invoiceid : 0,
            year: data?.row ? data?.row.year : 0,
            month: data?.row ? data?.row.month : 0,
        }
    });

    const { fields, append: fieldsAppend, remove: fieldRemove } = useFieldArray({
        control,
        name: 'productdetail',
    });

    React.useEffect(() => {
        register('corpid', { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register('orgid', { validate: (value) => ((getValues('billbyorg') === false) || (value && value > 0)) || "" + t(langKeys.field_required) });
        register('clientdoctype', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('clientdocnumber', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('clientbusinessname', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('clientfiscaladdress');
        register('clientcountry');
        register('clientmail');
        register('clientcredittype');
        register('invoicecreatedate', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoiceduedate');
        register('invoicecurrency', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoicetotalamount', { validate: (value) => (value && value > 0) || "" + t(langKeys.billingamountvalidation) });
        register('invoicepurchaseorder', { validate: (value) => (value === '' || (value || '').length <= 15) || "" + t(langKeys.validation15char) });
        register('invoicecomments', { validate: (value) => (value === '' || (value || '').length <= 150) || "" + t(langKeys.validation150char) });
        register('autosendinvoice');
        register('year', { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
        register('month', { validate: (value) => (value && value > 0) || "" + t(langKeys.field_required) });
    }, [register]);

    const setSubmitData = (data: any) => {
        setValue('corpid', data?.corpid || 0);
        setValue('orgid', data?.orgid || 0);
        setValue('clientdoctype', data?.doctype || '');
        setValue('clientdocnumber', data?.docnum || '');
        setValue('clientbusinessname', data?.businessname || '');
        setValue('clientfiscaladdress', data?.fiscaladdress || '');
        setValue('clientcountry', data?.sunatcountry || '');
        setValue('clientmail', data?.contactemail || '');
        setValue('clientcredittype', data?.credittype || '');
        setValue('autosendinvoice', data?.autosendinvoice);

        if (data?.credittype) {
            var dueDate = new Date(getValues('invoicecreatedate'));

            switch (data.credittype) {
                case 'typecredit_15':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 15));
                    break;
                case 'typecredit_30':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 30));
                    break;
                case 'typecredit_45':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 45));
                    break;
                case 'typecredit_60':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 60));
                    break;
                case 'typecredit_90':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 90));
                    break;
            }

            setValue('invoiceduedate', dueDate.toISOString().split('T')[0]);
        }
        else {
            setValue('invoiceduedate', '');
        }

        if (data?.doctype) {
            if (appsettingData?.data) {
                var invoiceamount = getValues('invoicetotalamount');

                if (data?.doctype === '0') {
                    setAmountTax(0);
                    setAmountTotal(invoiceamount || 0);
                }
                else {
                    setAmountTax((invoiceamount || 0) * appsettingData.data[0].igv);
                    setAmountTotal((invoiceamount || 0) + ((invoiceamount || 0) * appsettingData.data[0].igv));
                }
            }
        }

        trigger('corpid');
        trigger('orgid');
        trigger('clientdoctype');
        trigger('clientdocnumber');
        trigger('clientbusinessname');
        trigger('clientfiscaladdress');
        trigger('clientcountry');
        trigger('clientmail');
        trigger('clientcredittype');
        trigger('autosendinvoice');
        trigger('invoicecreatedate');
        trigger('invoiceduedate');
    }

    const getDocumentType = (documenttype: string) => {
        switch (documenttype) {
            case '0':
                return 'billingfield_billingno';
            case '1':
                return 'billingfield_billingdni';
            case '4':
                return 'billingfield_billingextra';
            case '6':
                return 'billingfield_billingruc';
            case '7':
                return 'billingfield_billingpass';
            default:
                return '';
        }
    }

    const getDocumentResult = (country: string, documenttype: string) => {
        if ((country === 'PE' && documenttype === '6') || (country !== 'PE' && documenttype === '0')) {
            return 'emissorinvoice';
        }

        if ((country === 'PE') && (documenttype === '1' || documenttype === '4' || documenttype === '7')) {
            return 'emissorticket';
        }

        return '';
    }

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case '01':
                return 'emissorinvoice';
            case '03':
                return 'emissorticket';
            case '07':
                return 'emissorcreditnote';
            default:
                return langKeys.pendingpayment;
        }
    }

    const onCreditTypeChange = (data: any) => {
        if (data) {
            var dueDate = new Date(getValues('invoicecreatedate'));

            switch (data) {
                case 'typecredit_15':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 15));
                    break;
                case 'typecredit_30':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 30));
                    break;
                case 'typecredit_45':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 45));
                    break;
                case 'typecredit_60':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 60));
                    break;
                case 'typecredit_90':
                    dueDate = new Date(dueDate.setDate(dueDate.getDate() + 90));
                    break;
            }

            setValue('invoiceduedate', dueDate.toISOString().split('T')[0]);
        }
        else {
            setValue('invoiceduedate', '');
        }

        trigger('invoiceduedate');
    }

    const onCorpChange = (data: any) => {
        setSubmitData(data);

        if (data) {
            dispatch(getMultiCollectionAux([getOrgSel(0, data.corpid)]));
            setValue('billbyorg', data?.billbyorg);
            setSavedCorp(data);
        }
        else {
            setOrgList({ loading: false, data: [] });
            setValue('billbyorg', false);
            setSavedCorp(null);
        }
    }

    const onOrgChange = (data: any) => {
        if (data) {
            setSubmitData(data);
        }
        else {
            setSubmitData(savedCorp);
        }
    }

    const onProductChange = () => {
        var productDetail = getValues('productdetail');
        var totalAmount = 0.0;

        if (productDetail) {
            productDetail.forEach((element: any) => {
                if (element.productquantity && element.productsubtotal) {
                    totalAmount = totalAmount + (element.productquantity * element.productsubtotal);
                }
            });
        }

        if (appsettingData) {
            if (appsettingData.data) {
                if (getValues('clientdoctype') === '0') {
                    setAmountTax(0);
                    setAmountTotal(totalAmount);
                }
                else {
                    setAmountTax(totalAmount * appsettingData.data[0].igv);
                    setAmountTotal(totalAmount + (totalAmount * appsettingData.data[0].igv));
                }
            }
        }

        setValue('invoicetotalamount', totalAmount);
        trigger('invoicetotalamount');
    }

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(createInvoice(data));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: showInsertMessage ? t(langKeys.confirmation_save) : `${t(langKeys.invoiceconfirmation01)}\n\n${t(langKeys.invoiceconfirmation02)}${getValues('clientdocnumber')}\n${t(langKeys.invoiceconfirmation03)}${getValues('clientbusinessname')}\n${t(langKeys.invoiceconfirmation04)}${getValues('year')}\n${t(langKeys.invoiceconfirmation05)}${getValues('month')}\n${t(langKeys.invoiceconfirmation06)}${t(getDocumentResult(getValues('clientcountry') || '', getValues('clientdoctype') || ''))}\n${t(langKeys.invoiceconfirmation07)}${t(getValues('clientcredittype'))}\n${t(langKeys.invoiceconfirmation08)}${getValues('invoicecurrency')}\n${t(langKeys.invoiceconfirmation09)}${formatNumber(getValues('invoicetotalamount') || 0)}\n${t(langKeys.invoiceconfirmation10)}${formatNumber(amountTax || 0)}\n${t(langKeys.invoiceconfirmation11)}${formatNumber(amountTotal || 0)}\n\n${t(langKeys.invoiceconfirmation12)}`,
            callback
        }))
    });

    const refreshInvoice = (data: any) => {
        const callback = () => {
            dispatch(execute(invoiceRefresh(data)));
            dispatch(showBackdrop(true));
            setWaitRefresh(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_invoicerefresh),
            callback
        }))
    }

    useEffect(() => {
        if (waitRefresh) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                dispatch(showBackdrop(false));
                fetchData && fetchData();
                setViewSelected("view-1");
                setWaitRefresh(false);
            } else if (executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitRefresh(false);
            }
        }
    }, [executeRes, waitRefresh])

    useEffect(() => {
        if (waitSave) {
            if (!culqiResult.loading && !culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(culqiResult.code || "success") }))
                dispatch(showBackdrop(false));
                fetchData();
                setViewSelected('view-1');
                setWaitSave(false);
            }
            else if (culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(culqiResult.code || "error_unexpected_db_error") }))
                dispatch(showBackdrop(false));
                fetchData();
                setViewSelected('view-1');
                setWaitSave(false);
            }
        }
    }, [culqiResult, waitSave])

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={invocesBread}
                            handleClick={(id) => { setViewSelected(id); fetchData(); }}
                        />
                        <TitleDetail
                            title={t(langKeys.emiteinvoicetitle)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => { setViewSelected("view-1"); fetchData(); }}
                        >{t(langKeys.back)}</Button>
                        {!invoicehasreport && <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type='submit'
                            onClick={() => { setValue('onlyinsert', true); setShowInsertMessage(true); }}
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.saveasdraft)}
                        </Button>}
                        {(invoicehasreport && showUpdateButton) && <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => { refreshInvoice(data?.row || null) }}
                            startIcon={<RefreshIcon style={{ color: 'white' }} />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.refresh)}
                        </Button>}
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type='submit'
                            onClick={() => { setValue('onlyinsert', false); setShowInsertMessage(false); }}
                            startIcon={<PaymentIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.emitinvoice)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className='row-zyx'>
                        <FieldView
                            className={classes.section}
                            label={''}
                            value={t(langKeys.clientsearch)}
                        />
                        <FieldView
                            className={classes.commentary}
                            label={''}
                            value={t(langKeys.billingtypevalidation) + ((getValues('corpid') && getValues('orgid')) ? t(langKeys.organization) : ((getValues('corpid')) ? t(langKeys.corporation) : ''))}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.corporation)}
                            loading={corpList.loading}
                            onChange={(value) => { onCorpChange(value); }}
                            className="col-3"
                            valueDefault={data?.row?.corpid ? data?.row?.corpid : getValues('corpid')}
                            data={corpList.data}
                            optionDesc="description"
                            optionValue="corpid"
                            error={errors?.corpid?.message}
                            orderbylabel={true}
                            disabled={invoicehasreport}
                        />
                        <FieldSelect
                            label={t(langKeys.organization)}
                            loading={orgList.loading}
                            onChange={(value) => { onOrgChange(value); }}
                            className="col-3"
                            valueDefault={data?.row?.orgid ? data?.row?.orgid : getValues('orgid')}
                            data={orgList.data}
                            optionDesc="orgdesc"
                            optionValue="orgid"
                            disabled={(getValues('billbyorg') === false) || invoicehasreport}
                            error={errors?.orgid?.message}
                            orderbylabel={true}
                        />
                        <FieldSelect
                            label={t(langKeys.invoice_serviceyear)}
                            onChange={(value) => { setValue('year', parseInt(value?.value || '0')); }}
                            className="col-3"
                            valueDefault={data?.row?.year ? data?.row?.year.toString() : getValues('year')}
                            data={dataYears}
                            optionDesc="value"
                            optionValue="value"
                            error={errors?.year?.message}
                            disabled={invoicehasreport}
                        />
                        <FieldSelect
                            label={t(langKeys.invoice_servicemonth)}
                            onChange={(value) => { setValue('month', parseInt(value?.val || '0')); }}
                            className="col-3"
                            valueDefault={((data?.row?.month || 0) || getValues('month')).toString().padStart(2, "0")}
                            data={dataMonths}
                            optionDesc="val"
                            optionValue="val"
                            error={errors?.month?.message}
                            disabled={invoicehasreport}
                        />
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: 16 }}>
                    <Tabs
                        value={pageSelected}
                        indicatorColor="primary"
                        variant="fullWidth"
                        style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                        textColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                    >
                        <AntTab label={t(langKeys.billinginvoicedata)} />
                    </Tabs>
                    {pageSelected === 0 && <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.docType)}
                                valueDefault={t(getDocumentType(getValues('clientdoctype')))}
                                className="col-3"
                                error={errors?.clientdoctype?.message}
                                disabled={true}
                            />
                            <FieldEdit
                                label={t(langKeys.documentnumber)}
                                valueDefault={getValues('clientdocnumber')}
                                className="col-3"
                                error={errors?.clientdocnumber?.message}
                                disabled={true}
                            />
                            <FieldEdit
                                label={t(langKeys.billingname)}
                                valueDefault={getValues('clientbusinessname')}
                                className="col-3"
                                error={errors?.clientbusinessname?.message}
                                disabled={true}
                            />
                            <FieldView
                                label={t(langKeys.invoicestatus)}
                                value={t((data?.invoicestatus || 'DRAFT'))}
                                className="col-3"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.invoiceid)}
                                value={data?.invoiceid || t(langKeys.pendingsave)}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.documenttype)}
                                value={t(getInvoiceType(data?.invoicetype))}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.billingvoucher)}
                                value={(data?.serie ? data.serie : 'X000') + '-' + (data?.correlative ? data?.correlative.toString().padStart(8, '0') : '00000000')}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.invoicedate)}
                                value={getValues('invoicecreatedate')}
                                className="col-3"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-3"
                                label={t(langKeys.credittype)}
                                loading={creditTypeList.loading}
                                onChange={(value) => { setValue('clientcredittype', value?.domainvalue); onCreditTypeChange(value?.domainvalue); }}
                                valueDefault={data?.row?.credittype ? data?.row?.credittype : getValues('clientcredittype')}
                                data={creditTypeList.data}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                                error={errors?.clientcredittype?.message}
                                uset={true}
                                orderbylabel={true}
                            />
                            <FieldView
                                label={t(langKeys.dueDate)}
                                value={getValues('invoiceduedate')}
                                className="col-3"
                            />
                            <FieldEdit
                                label={t(langKeys.purchaseorder)}
                                className="col-3"
                                valueDefault={getValues('invoicepurchaseorder')}
                                onChange={(value) => setValue('invoicepurchaseorder', value)}
                                error={errors?.invoicepurchaseorder?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.comments)}
                                className="col-3"
                                valueDefault={getValues('invoicecomments')}
                                onChange={(value) => setValue('invoicecomments', value)}
                                error={errors?.invoicecomments?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-3"
                                label={t(langKeys.currency)}
                                onChange={(value) => setValue('invoicecurrency', value?.value)}
                                valueDefault={getValues('invoicecurrency')}
                                data={dataCurrency}
                                optionDesc="description"
                                optionValue="value"
                                error={errors?.invoicecurrency?.message}
                                orderbylabel={true}
                                disabled={invoicehasreport}
                            />
                            <FieldEdit
                                label={t(langKeys.taxbase)}
                                valueDefault={formatNumber(getValues('invoicetotalamount') || 0)}
                                className="col-3"
                                error={errors?.invoicetotalamount?.message}
                                disabled={true}
                            />
                            <FieldView
                                label={t(langKeys.billingtax)}
                                value={formatNumber(amountTax || 0)}
                                className="col-3"
                            />
                            <FieldView
                                label={t(langKeys.totalamount)}
                                value={formatNumber(amountTotal || 0)}
                                className="col-3"
                            />
                        </div>
                        <div className="row-zyx">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.description)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.measureunit)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.unitaryprice)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.quantity)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(langKeys.billingsubtotal)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    aria-label="add"
                                                    color="primary"
                                                    style={{ marginLeft: '1rem' }}
                                                    onClick={() => fieldsAppend({
                                                        productdescription: '',
                                                        productcode: 'S001',
                                                        productmeasure: 'ZZ',
                                                        productquantity: 0,
                                                        productsubtotal: 0.0,
                                                    })}
                                                    disabled={invoicehasreport}
                                                > <AddIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.map((item, i) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <FieldEditArray
                                                        className={classes.fieldView}
                                                        label={''}
                                                        fregister={{
                                                            ...register(`productdetail.${i}.productdescription`, {
                                                                validate: (value: any) => (value && value.length && value.length <= 250) || (value.length < 250 ? t(langKeys.field_required) : t(langKeys.validation250char))
                                                            })
                                                        }}
                                                        valueDefault={getValues(`productdetail.${i}.productdescription`)}
                                                        error={errors?.productdetail?.[i]?.productdescription?.message}
                                                        onChange={(value) => setValue(`productdetail.${i}.productdescription`, "" + value)}
                                                        disabled={invoicehasreport}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldSelect
                                                        className={classes.fieldView}
                                                        label={''}
                                                        fregister={{
                                                            ...register(`productdetail.${i}.productmeasure`, {
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        loading={measureList.loading}
                                                        onChange={(value) => setValue(`productdetail.${i}.productmeasure`, "" + value?.code)}
                                                        valueDefault={getValues(`productdetail.${i}.productmeasure`)}
                                                        data={measureList.data}
                                                        optionDesc="description"
                                                        optionValue="code"
                                                        error={errors?.productdetail?.[i]?.productmeasure?.message}
                                                        orderbylabel={true}
                                                        disabled={invoicehasreport}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldEditArray
                                                        className={classes.fieldView}
                                                        label={''}
                                                        fregister={{
                                                            ...register(`productdetail.${i}.productsubtotal`, {
                                                                validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        valueDefault={getValues(`productdetail.${i}.productsubtotal`)}
                                                        error={errors?.productdetail?.[i]?.productsubtotal?.message}
                                                        onChange={(value) => { setValue(`productdetail.${i}.productsubtotal`, "" + value); onProductChange(); }}
                                                        type="number"
                                                        inputProps={{ step: "any" }}
                                                        disabled={invoicehasreport}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldEditArray
                                                        className={classes.fieldView}
                                                        label={''}
                                                        fregister={{
                                                            ...register(`productdetail.${i}.productquantity`, {
                                                                validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        valueDefault={getValues(`productdetail.${i}.productquantity`)}
                                                        error={errors?.productdetail?.[i]?.productquantity?.message}
                                                        onChange={(value) => { setValue(`productdetail.${i}.productquantity`, "" + value); onProductChange(); }}
                                                        type="number"
                                                        disabled={invoicehasreport}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FieldView
                                                        className={classes.fieldView}
                                                        label={''}
                                                        value={formatNumber((getValues(`productdetail.${i}.productsubtotal`) || 0) * (getValues(`productdetail.${i}.productquantity`) || 0))}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        aria-label="add"
                                                        color="primary"
                                                        style={{ marginLeft: '1rem' }}
                                                        onClick={() => { fieldRemove(i); onProductChange(); }}
                                                        disabled={invoicehasreport}
                                                    > <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>}
                </div>
            </form>
        </div >
    )
}

const IDMESSAGINGPACKAGES = "IDMESSAGINGPACKAGES";
const MessagingPackages: React.FC<{ dataCorp: any, dataOrg: any }> = ({ dataCorp, dataOrg }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainData);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);

    const [dataBalance, setDataBalance] = useState<Dictionary[]>([]);
    const [canRegister, setCanRegister] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [viewSelected, setViewSelected] = useState("view-1");

    const [dataMain, setdataMain] = useState({
        corpid: user?.corpid || 0,
        orgid: 0,
        balanceid: 0,
        type: "",
        operationtype: "",
        all: true,
    });

    const transactionType = [{ value: "HSM", description: t(langKeys.HSM) }, { value: "MAIL", description: t(langKeys.MAIL) }, { value: "SMS", description: t(langKeys.SMS) }, { value: "GENERAL", description: t(langKeys.GENERAL) }]
    const operationType = [{ value: "ENVIO", description: t(langKeys.ENVIO) }, { value: "COMPRA", description: t(langKeys.COMPRA) }]

    const fetchData = () => dispatch(getCollection(selBalanceData(dataMain)));

    const search = () => dispatch(getCollection(selBalanceData(dataMain)));

    useEffect(() => {
        fetchData();

        if (user?.paymentmethod === 'PREPAGO') {
            setCanRegister(true);
        }

        dispatch(setMemoryTable({
            id: IDMESSAGINGPACKAGES
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row: row, edit: false });
    }

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataBalance(mainResult.data.map(x => ({
                ...x,
                typecolumn: t(x.type),
                descriptioncolumn: x.description ? x.description : t(langKeys.none),
                operationtypecolumn: t(x.operationtype),
                messagetemplatedesccolumn: x.messagetemplatedesc ? x.messagetemplatedesc : t(langKeys.none),
                documenttypecolumn: t(getInvoiceType(x.invoicetype)),
                documentnumbercolumn: (x.serie && x.correlative) ? (x.serie + '-' + x.correlative.toString().padStart(8, '0')) : 'X000-00000000',
            })))
        }
    }, [mainResult])

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case '01':
                return 'emissorinvoice';
            case '03':
                return 'emissorticket';
            case '07':
                return 'emissorcreditnote';
            default:
                return 'emissornone';
        }
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
            },
            {
                Header: t(langKeys.transactiondate),
                accessor: 'transactiondate',
            },
            {
                Header: t(langKeys.user),
                accessor: 'transactionuser',
            },
            {
                Header: t(langKeys.transactionmessagetype),
                accessor: 'typecolumn',
            },
            {
                Header: t(langKeys.transactionreference),
                accessor: 'descriptioncolumn',
            },
            {
                Header: t(langKeys.amount),
                accessor: 'amount',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { amount } = props.cell.row.original;
                    return formatNumber(amount || 0);
                }
            },
            {
                Header: t(langKeys.transactionbalance),
                accessor: 'balance',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { balance } = props.cell.row.original;
                    return formatNumber(balance || 0);
                }
            },
            {
                Header: t(langKeys.transactionoperationtype),
                accessor: 'operationtypecolumn',
            },
            {
                Header: t(langKeys.template),
                accessor: 'messagetemplatedesccolumn',
            },
            {
                Header: t(langKeys.documenttype),
                accessor: 'documenttypecolumn',
            },
            {
                Header: t(langKeys.billingvoucher),
                accessor: 'documentnumbercolumn',
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = (props.cell.row.original.serie ? props.cell.row.original.serie : 'X000') + '-' + (props.cell.row.original.correlative ? props.cell.row.original.correlative.toString().padStart(8, '0') : '00000000');
                    return (
                        <Fragment>
                            <div>
                                {(urlpdf ?
                                    <a onClick={(e) => { e.stopPropagation(); }} href={urlpdf} target="_blank" style={{ display: "block" }} rel="noreferrer">{docnumber}</a>
                                    :
                                    <span style={{ display: "block" }}>{docnumber}</span>)
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
        ],
        []
    );

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: '100%' }}>
                <TableZyx
                    onClickRow={handleView}
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.corporation)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.corpid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))}
                                data={dataCorp}
                                optionDesc="description"
                                optionValue="corpid"
                                disabled={["ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '')}
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, orgid: value?.orgid || 0 }))}
                                data={dataOrg.filter((e: any) => { return e.corpid === dataMain.corpid })}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.transactionmessagetype)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.type}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, type: value?.value || '' }))}
                                data={transactionType}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                            />
                            <FieldSelect
                                label={t(langKeys.transactionoperationtype)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.operationtype}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, operationtype: value?.value || '' }))}
                                data={operationType}
                                optionDesc="description"
                                optionValue="value"
                                orderbylabel={true}
                            />
                            <Button
                                disabled={mainResult.loading || false}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={search}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={dataBalance}
                    filterGeneral={false}
                    loading={mainResult.loading}
                    download={true}
                    register={canRegister}
                    handleRegister={handleRegister}
                    registertext={t(langKeys.transactionbuy)}
                    pageSizeDefault={IDMESSAGINGPACKAGES === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDMESSAGINGPACKAGES === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDMESSAGINGPACKAGES === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}

                />
            </div>
        )
    } else {
        return (
            <MessagingPackagesDetail
                fetchData={fetchData}
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        );
    }
}

const MessagingPackagesDetail: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiSelector = useSelector(state => state.culqi.request);
    const exchangeRequest = useSelector(state => state.culqi.requestGetExchangeRate);
    const mainResult = useSelector(state => state.main);
    const multiResult = useSelector(state => state.main.multiDataAux);
    const user = useSelector(state => state.login.validateToken.user);

    const [cardList, setCardList] = useState<any>([]);
    const [corp, setCorp] = useState(0);
    const [corpList, setCorpList] = useState<any>([]);
    const [corpError, setCorpError] = useState('');
    const [org, setOrg] = useState(0);
    const [orgList, setOrgList] = useState<any>([]);
    const [orgError, setOrgError] = useState('');
    const [reference, setReference] = useState('');
    const [referenceError, setReferenceError] = useState('');
    const [beforeAmount, setBeforeAmount] = useState(0);
    const [afterAmount, setAfterAmount] = useState(0);
    const [buyAmount, setBuyAmount] = useState(0);
    const [buyAmountError, setBuyAmountError] = useState('');
    const [comments, setComments] = useState('');
    const [commentsError, setCommentsError] = useState('');
    const [purchaseOrder, setPurchaseOrder] = useState('');
    const [purchaseOrderError, setPurchaseOrderError] = useState('');
    const [currentCountry, setCurrentCountry] = useState('');
    const [currentDoctype, setCurrentDoctype] = useState('');
    const [currentBillbyorg, setCurrentBillbyorg] = useState(false);
    const [totalPay, setTotalPay] = useState(0);
    const [paymentDisabled, setPaymentDisabled] = useState(false);
    const [publicKey, setPublicKey] = useState('');
    const [showCulqi, setShowCulqi] = useState(false);
    const [confirmButton, setConfirmButton] = useState(true);
    const [disableInput, setDisableInput] = useState(data?.row ? true : false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitPay, setWaitPay] = useState(false);
    const [detractionAlert, setDetractionAlert] = useState(false);
    const [detractionAmount, setDetractionAmount] = useState(0);
    const [messagingList, setMessagingList] = useState<any>([]);
    const [priceSms, setPriceSms] = useState(0);
    const [priceMail, setPriceMail] = useState(0);
    const [priceHsm, setPriceHsm] = useState(0);
    const [balanceSent, setBalanceSent] = useState<any>([]);
    const [paymentTax, setPaymentTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentCardId, setPaymentCardId] = useState(0);
    const [paymentCardCode, setPaymentCardCode] = useState('');
    const [paymentType, setPaymentType] = useState('FAVORITE');
    const [favoriteCardId, setFavoriteCardId] = useState(0);
    const [favoriteCardNumber, setFavoriteCardNumber] = useState('');
    const [favoriteCardCode, setFavoriteCardCode] = useState('');

    const dataPayment = [{ val: "FAVORITE", description: t(langKeys.paymentfavorite) }, { val: "CARD", description: t(langKeys.paymentcard) }, { val: "CULQI", description: t(langKeys.paymentculqi) }];

    const handlePay = () => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(balance({
                invoiceid: data?.invoiceid,
                settings: {
                    title: reference,
                    description: reference,
                    currency: 'USD',
                    amount: Math.round(((totalPay * 100) + Number.EPSILON) * 100) / 100,
                },
                token: null,
                metadata: {},
                corpid: corp,
                orgid: org,
                reference: reference,
                buyamount: buyAmount,
                comments: comments,
                purchaseorder: purchaseOrder,
                totalpay: totalPay,
                totalamount: totalAmount,
                paymentcardid: paymentCardId,
                paymentcardcode: paymentCardCode,
                iscard: true,
            }));
            setWaitPay(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_payment),
            callback
        }))
    }

    const handleCulqiSuccess = () => {
        fetchData();
        setViewSelected("view-1");
    }

    useEffect(() => {
        setMessagingList({ loading: true, data: [] });
        setCorpList({ loading: true, data: [] });
        setOrgList({ loading: false, data: [] });

        dispatch(getMultiCollectionAux([getCorpSel(["ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '') ? user?.corpid || 0 : 0), getBillingMessagingCurrent(new Date().getFullYear(), new Date().getMonth(), user?.countrycode || ''), listPaymentCard({ corpid: user?.corpid || 0, id: 0, orgid: 0 })]));

        if (data?.row === null) {
            dispatch(getCollection(getAppsettingInvoiceSel()));
            dispatch(getExchangeRate(null));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
        else {
            if (data?.row?.operationtype === "ENVIO") {
                setBalanceSent({ loading: true, data: [] });
                dispatch(getMultiCollectionAux([getBalanceSelSent(data?.row?.corpid, data?.row?.orgid, data?.row?.transactiondate, data?.row?.type, data?.row?.module, data?.row?.messagetemplateid)]));
            }
        }
    }, [])

    useEffect(() => {
        const indexCorp = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_CORP_SEL'));

        if (indexCorp > -1) {
            setCorpList({ loading: false, data: multiResult.data[indexCorp] && multiResult.data[indexCorp].success ? multiResult.data[indexCorp].data : [] });
        }

        const indexOrg = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_ORG_SEL'));

        if (indexOrg > -1) {
            setOrgList({ loading: false, data: multiResult.data[indexOrg] && multiResult.data[indexOrg].success ? multiResult.data[indexOrg].data : [] });
        }

        const indexMessaging = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_BILLINGMESSAGING_CURRENT'));

        if (indexMessaging > -1) {
            setMessagingList({ loading: false, data: multiResult.data[indexMessaging] && multiResult.data[indexMessaging].success ? multiResult.data[indexMessaging].data : [] });
        }

        const indexSent = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_BALANCE_SEL_SENT'));

        if (indexSent > -1) {
            setBalanceSent({ loading: false, data: multiResult.data[indexSent] && multiResult.data[indexSent].success ? multiResult.data[indexSent].data : [] });
        }

        const indexCard = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_PAYMENTCARD_LST'));

        if (indexCard > -1) {
            setCardList({ loading: false, data: multiResult.data[indexCard] && multiResult.data[indexCard].success ? multiResult.data[indexCard].data : [] });
        }
    }, [multiResult]);

    useEffect(() => {
        if (cardList) {
            if (cardList.data) {
                if (cardList.data.length > 0) {
                    var favoriteCard = cardList.data.find((o: { favorite: boolean; }) => o.favorite === true);

                    if (favoriteCard) {
                        setFavoriteCardId(favoriteCard.paymentcardid);
                        setFavoriteCardNumber(favoriteCard.cardnumber);
                        setFavoriteCardCode(favoriteCard.cardcode);
                        setPaymentCardId(favoriteCard.paymentcardid);
                        setPaymentCardCode(favoriteCard.cardcode);
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
                setPaymentCardCode('');
            }
        }
    }, [paymentType]);

    useEffect(() => {
        if (waitPay) {
            if (!culqiSelector.loading && culqiSelector.data) {
                dispatch(showSnackbar({ show: true, severity: "success", message: '' + t(culqiSelector.message || langKeys.success) }))
                dispatch(showBackdrop(false));
                dispatch(resetBalance());
                handleCulqiSuccess && handleCulqiSuccess();
                setWaitPay(false);
            }
            else if (culqiSelector.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: '' + t(culqiSelector.message || langKeys.error_cos_unexpected) }))
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
                setPriceMail((messagingList.data[0].pricepermail || 0) + (messagingList.data[0].vcacomissionpermail || 0));
            }
        }
    }, [messagingList]);

    useEffect(() => {
        updateTotalPay(buyAmount);
    }, [currentCountry, currentDoctype, buyAmount, totalPay, totalAmount]);

    useEffect(() => {
        if (corp && org && comments.length <= 150 && purchaseOrder.length <= 15 && reference && (buyAmount && buyAmount > 0) && (totalPay && totalPay > 0)) {
            setPaymentDisabled(false);
            setConfirmButton(false);
        }
        else {
            setPaymentDisabled(true);
            setConfirmButton(true);
        }
    }, [corp, org, comments, purchaseOrder, reference, buyAmount, totalPay])

    useEffect(() => {
        if (waitSave) {
            if (!mainResult.mainData.loading && !exchangeRequest.loading) {
                dispatch(showBackdrop(false));

                if (mainResult.mainData.data) {
                    if (mainResult.mainData.data[0]) {
                        var appsetting = mainResult.mainData.data[0];

                        setPublicKey(appsetting.publickey);
                    }
                }
            }
        }
    }, [mainResult, exchangeRequest, waitSave])

    const updateTotalPay = (buyAmount: number) => {
        if (currentCountry && currentDoctype) {
            if (currentCountry === 'PE') {
                setTotalAmount(Math.round((((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0))) + Number.EPSILON) * 100) / 100);
                if (currentDoctype === '6') {
                    var compareamount = (buyAmount || 0) * (exchangeRequest?.exchangerate || 0);

                    if (compareamount > mainResult.mainData.data[0].detractionminimum) {
                        setTotalPay(Math.round(((((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0))) - (((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0))) * (mainResult.mainData.data[0].detraction || 0))) + Number.EPSILON) * 100) / 100);
                        setDetractionAlert(true);
                        setDetractionAmount(Math.round((((mainResult.mainData.data[0].detraction || 0) * 100) + Number.EPSILON) * 100) / 100);
                        setPaymentTax(Math.round((((buyAmount || 0) * (mainResult.mainData.data[0].igv || 0)) + Number.EPSILON) * 100) / 100);
                    }
                    else {
                        setDetractionAlert(false);
                        setTotalPay(Math.round((((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0))) + Number.EPSILON) * 100) / 100);
                        setPaymentTax(Math.round((((buyAmount || 0) * (mainResult.mainData.data[0].igv || 0)) + Number.EPSILON) * 100) / 100);
                    }
                }
                else {
                    setDetractionAlert(false);
                    setTotalPay(Math.round((((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0))) + Number.EPSILON) * 100) / 100);
                    setPaymentTax(Math.round((((buyAmount || 0) * (mainResult.mainData.data[0].igv || 0)) + Number.EPSILON) * 100) / 100);
                }
            }
            else {
                setTotalAmount(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
                setDetractionAlert(false);
                setTotalPay(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
                setPaymentTax(0);
            }
        }
        else {
            setTotalAmount(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
            setDetractionAlert(false);
            setTotalPay(Math.round(((buyAmount || 0) + Number.EPSILON) * 100) / 100);
            setPaymentTax(0);
        }
        setAfterAmount(beforeAmount + totalAmount);
    }

    const handleCorp = (value: any) => {
        dispatch(getMultiCollectionAux([getOrgSel(0, value)]));

        if (value) {
            var corporationdata = corpList.data.find((x: { corpid: any; }) => x.corpid === value);
            if (corporationdata) {
                setCurrentBillbyorg(corporationdata?.billbyorg);
                if (corporationdata.billbyorg === false) {
                    setCurrentCountry(corporationdata?.sunatcountry);
                    setCurrentDoctype(corporationdata?.doctype);
                }
            }
        }

        setCorp(value);
        setCorpError(value ? '' : t(langKeys.required));
    }

    const handleOrg = (value: any) => {
        if (value) {
            var organizationdata = orgList.data.find((x: { orgid: any; }) => x.orgid === value);
            if (organizationdata) {
                setBeforeAmount((organizationdata?.balance || 0));
                setAfterAmount((organizationdata?.balance || 0) + totalAmount);
                if (currentBillbyorg) {
                    setCurrentCountry(organizationdata?.sunatcountry);
                    setCurrentDoctype(organizationdata?.doctype);
                }
            }
        }
        else {
            setBeforeAmount(0);
            setAfterAmount(totalAmount);
        }
        setOrg(value);
        setOrgError(value ? '' : t(langKeys.required));
    }

    const handleReference = (value: any) => {
        setReference(value);
        setReferenceError(value ? '' : t(langKeys.required));
    }

    const handleBuyAmount = (value: any) => {
        setBuyAmount(parseFloat(value));
        setBuyAmountError((value && value > 0) ? '' : t(langKeys.required));
    }

    const handlePurchaseOrder = (value: any) => {
        setPurchaseOrder(value);
        setPurchaseOrderError(value.length > 15 ? t(langKeys.validation15char) : '')
    }

    const handleComments = (value: any) => {
        setComments(value);
        setCommentsError(value.length > 150 ? t(langKeys.validation150char) : '');
    }

    const handleShowCulqi = () => {
        if (showCulqi) {
            setShowCulqi(false);
            setDisableInput(false);
        }
        else {
            setShowCulqi(true);
            setDisableInput(true);
        }
    }

    const getInvoiceType = (invoicetype: string) => {
        switch (invoicetype) {
            case '01':
                return 'emissorinvoice';
            case '03':
                return 'emissorticket';
            case '07':
                return 'emissorcreditnote';
            default:
                return 'emissornone';
        }
    }

    const paymentBread = [
        { id: "view-1", name: t(langKeys.messagingpackages) },
        { id: "view-2", name: (data?.edit ? t(langKeys.messagingpackagesnew) : t(langKeys.messagingpackagesdetail)) }
    ];

    return (
        <div style={{ width: '100%' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={paymentBread}
                            handleClick={(id) => { setViewSelected(id); fetchData(); }}
                        />
                        <TitleDetail
                            title={(data?.edit ? t(langKeys.messagingpackagesnew) : t(langKeys.messagingpackagesdetail))}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => { setViewSelected("view-1"); fetchData(); }}
                        >{t(langKeys.back)}</Button>
                        {data?.edit && <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={showCulqi ? (<ClearIcon color="secondary" />) : (<SaveIcon color="secondary" />)}
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => handleShowCulqi()}
                            disabled={confirmButton}
                        >{showCulqi ? t(langKeys.cancel) : t(langKeys.transactionconfirm)}</Button>}
                        {(paymentType === "CULQI" && publicKey && showCulqi) &&
                            <CulqiModal
                                type="BALANCE"
                                invoiceid={0}
                                title={reference}
                                description={reference}
                                currency={'USD'}
                                amount={Math.round(((totalPay * 100) + Number.EPSILON) * 100) / 100}
                                callbackOnSuccess={() => { handleCulqiSuccess() }}
                                buttontitle={t(langKeys.proceedpayment)}
                                disabled={paymentDisabled}
                                successmessage={t(langKeys.culqipaysuccess)}
                                publickey={publicKey}
                                corpid={corp}
                                orgid={org}
                                reference={reference}
                                buyamount={buyAmount}
                                totalamount={totalAmount}
                                comments={comments}
                                purchaseorder={purchaseOrder}
                                totalpay={totalPay}
                            ></CulqiModal>
                        }
                        {((paymentType === "FAVORITE" || paymentType === "CARD") && showCulqi) &&
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                startIcon={<AttachMoneyIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                onClick={handlePay}
                                disabled={paymentDisabled || !paymentCardId || !paymentCardCode}
                            >{t(langKeys.proceedpayment)}
                            </Button>
                        }
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: 16 }}>
                    {(!disableInput || data?.edit === false) && <div>
                        <div className="row-zyx">
                            {data?.edit ? (
                                <FieldSelect
                                    label={t(langKeys.corporation)}
                                    loading={corpList.loading}
                                    onChange={(value) => { handleCorp(value?.corpid || 0) }}
                                    className="col-6"
                                    valueDefault={corp}
                                    data={corpList.data}
                                    optionDesc="description"
                                    optionValue="corpid"
                                    error={corpError}
                                    disabled={disableInput}
                                    orderbylabel={true}
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
                                    label={t(langKeys.organization)}
                                    loading={orgList.loading}
                                    onChange={(value) => { handleOrg(value?.orgid || 0) }}
                                    className="col-6"
                                    valueDefault={org}
                                    data={orgList.data}
                                    optionDesc="orgdesc"
                                    optionValue="orgid"
                                    error={orgError}
                                    disabled={disableInput}
                                    orderbylabel={true}
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
                                    label={t(langKeys.transactionreference)}
                                    onChange={(value) => handleReference(value)}
                                    valueDefault={reference}
                                    error={referenceError}
                                    className="col-12"
                                    disabled={disableInput}
                                />
                            ) : (
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.transactionreference)}
                                    value={data?.row?.description || t(langKeys.none)}
                                />
                            )}
                        </div>
                        {data?.row?.operationtype !== "ENVIO" && <div className="row-zyx">
                            {data?.edit ? (
                                <FieldEdit
                                    label={t(langKeys.transactionbuyamount)}
                                    onChange={(value) => handleBuyAmount(value || 0)}
                                    valueDefault={buyAmount}
                                    error={buyAmountError}
                                    className="col-4"
                                    type="number"
                                    inputProps={{ step: "any" }}
                                    disabled={disableInput}
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
                                    value={'$' + formatNumber(paymentTax || 0)}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.billingtaxes)}
                                    value={'$' + formatNumber(data?.row?.taxes || 0)}
                                />
                            )}
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$' + formatNumber((totalAmount || 0))}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$' + formatNumber((data?.row?.amount || 0))}
                                />
                            )}
                        </div>}
                        <div className="row-zyx">
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionlastbalance)}
                                    value={'$' + formatNumber(beforeAmount || 0)}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionlastbalance)}
                                    value={'$' + formatNumber((data?.row?.balance - data?.row?.amount) || 0)}
                                />
                            )}
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$' + formatNumber((totalAmount || 0))}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$' + formatNumber((data?.row?.amount || 0))}
                                />
                            )}
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionafterbalance)}
                                    value={'$' + formatNumber(afterAmount || 0)}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionafterbalance)}
                                    value={'$' + formatNumber(data?.row?.balance || 0)}
                                />
                            )}
                        </div>
                    </div>}
                    {disableInput && <div>
                        {(data?.edit) && <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.paymentmethod)}
                            />
                        </div>}
                        {(data?.edit) && <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.paymentmethodtype)}
                                onChange={(value) => { setPaymentType(value?.val || 0) }}
                                className="col-6"
                                valueDefault={paymentType}
                                data={dataPayment}
                                optionDesc="description"
                                optionValue="val"
                                orderbylabel={true}
                            />
                            {(paymentType === "CARD") && <FieldSelect
                                label={t(langKeys.paymentmethodcard)}
                                onChange={(value) => { setPaymentCardCode(value?.cardcode || ''); setPaymentCardId(value?.paymentcardid || 0); }}
                                className="col-6"
                                valueDefault={paymentCardId}
                                data={cardList.data ? cardList.data.filter((e: { favorite: boolean; }) => e.favorite !== true) : []}
                                optionDesc="cardnumber"
                                optionValue="paymentcardid"
                                loading={cardList.loading}
                                orderbylabel={true}
                            />}
                            {(paymentType === "FAVORITE") && <FieldEdit
                                className="col-6"
                                label={t(langKeys.paymentmethodcard)}
                                valueDefault={favoriteCardNumber}
                                disabled={true}
                            />}
                        </div>}
                        {(data?.edit || data?.row?.operationtype === "COMPRA") && <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.paymentinformation)}
                            />
                        </div>}
                        {(data?.edit || data?.row?.operationtype === "COMPRA") && <div className="row-zyx">
                            {data?.edit && <FieldView
                                className="col-4"
                                label={t(langKeys.servicedescription)}
                                value={t(langKeys.transactionrechargetitle) + toISOLocalString(new Date()).split('T')[0]}
                            />}
                            {data?.row?.operationtype === "COMPRA" && <FieldView
                                className="col-4"
                                label={t(langKeys.servicedescription)}
                                value={t(langKeys.transactionrechargetitle) + toISOLocalString(new Date(data?.row?.createdate)).split('T')[0]}
                            />}
                            {data?.edit && <FieldView
                                className="col-4"
                                label={t(langKeys.totalamount)}
                                value={'$' + formatNumber((totalAmount || 0))}
                            />}
                            {data?.row?.operationtype === "COMPRA" && <FieldView
                                className="col-4"
                                label={t(langKeys.totalamount)}
                                value={'$' + formatNumber((data?.row?.amount || 0))}
                            />}
                            {data?.edit && <FieldView
                                className="col-4"
                                label={t(langKeys.totaltopay)}
                                value={'$' + formatNumber((totalPay || 0))}
                            />}
                            {data?.row?.operationtype === "COMPRA" && <FieldView
                                className="col-4"
                                label={t(langKeys.totaltopay)}
                                value={'$' + formatNumber((data?.row?.culqiamount || 0))}
                            />}
                        </div>}
                    </div>}
                    {(data?.row?.operationtype === "COMPRA") && <div className="row-zyx">
                        <FieldView
                            className="col-4"
                            label={t(langKeys.documenttype)}
                            value={t(getInvoiceType(data?.row?.invoicetype))}
                        />
                        <FieldView
                            onclick={() => { if (data?.row?.urlpdf) { window.open(data?.row?.urlpdf, "_blank"); } }}
                            label={t(langKeys.billingvoucher)}
                            value={(data?.row?.serie ? data?.row?.serie : 'X000') + '-' + (data?.row?.correlative ? data?.row?.correlative.toString().padStart(8, '0') : '00000000')}
                            className="col-4"
                            styles={(data?.row?.urlpdf) ? { cursor: 'pointer', textDecoration: 'underline', color: 'blue' } : undefined}
                        />
                        <FieldView
                            className="col-4"
                            label={t(langKeys.purchaseorder)}
                            value={data?.row?.purchaseorder || t(langKeys.none)}
                        />
                    </div>}
                    {(data?.row?.operationtype === "ENVIO") && <div className="row-zyx">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <FieldView
                                                label={''}
                                                value={t(langKeys.transactionmessagetype)}
                                                className={classes.fieldView}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FieldView
                                                label={''}
                                                value={t(langKeys.transactionreceiver)}
                                                className={classes.fieldView}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FieldView
                                                label={''}
                                                value={t(langKeys.transactioncost)}
                                                className={classes.fieldView}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FieldView
                                                label={''}
                                                value={t(langKeys.transactiondatetime)}
                                                className={classes.fieldView}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FieldView
                                                label={''}
                                                value={t(langKeys.user)}
                                                className={classes.fieldView}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {balanceSent?.data?.map(function (file: any) {
                                        return <TableRow>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={t(file?.type || langKeys.none)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={file?.receiver}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={formatNumberFourDecimals(file?.amount || 0)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={toISOLocalString(new Date(file?.createdate)).replace("T", " ").substring(0, 19)}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldView
                                                    label={''}
                                                    value={file?.transactionuser}
                                                    className={classes.fieldView}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>}
                    {!disableInput && <div>
                        <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.transactioninformation)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className="col-4"
                                label={t(langKeys.pricemessagesms)}
                                value={'$' + formatNumberFourDecimals((priceSms || 0))}
                            />
                            <FieldView
                                className="col-4"
                                label={t(langKeys.pricemessagemail)}
                                value={'$' + formatNumberFourDecimals((priceMail || 0))}
                            />
                            <FieldView
                                className="col-4"
                                label={t(langKeys.pricemessagehsm)}
                                value={'$' + formatNumberFourDecimals((priceHsm || 0))}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={''}
                                value={t(langKeys.pricemessagenote1)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={''}
                                value={t(langKeys.pricemessagenote2)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={''}
                                value={t(langKeys.pricemessagenote)}
                            />
                            <a href={'https://developers.facebook.com/docs/whatsapp/pricing'} target="_blank" style={{ display: "block" }} rel="noreferrer">{'https://developers.facebook.com/docs/whatsapp/pricing'}</a>
                        </div>
                    </div>}
                    {disableInput && <div>
                        {(data?.edit && detractionAlert) && <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={''}
                                value={t(langKeys.detractionnotepay1) + `${detractionAmount}` + t(langKeys.detractionnotepay2)}
                            />
                        </div>}
                        {data?.edit && <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.additional_information)}
                            />
                        </div>}
                        {data?.edit && <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={''}
                                value={t(langKeys.additionalinformation2)}
                            />
                        </div>}
                        {data?.edit && <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.purchaseorder)}
                                onChange={(value) => handlePurchaseOrder(value)}
                                valueDefault={purchaseOrder}
                                error={purchaseOrderError}
                                className="col-12"
                                disabled={!disableInput}
                            />
                        </div>}
                        {data?.edit && <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.comments)}
                                onChange={(value) => handleComments(value)}
                                valueDefault={comments}
                                error={commentsError}
                                className="col-12"
                                disabled={!disableInput}
                            />
                        </div>}
                        {data?.edit && <div className="row-zyx">
                            <FieldView
                                className={classes.commentary}
                                label={''}
                                value={t(langKeys.additionalinformation1)}
                            />
                        </div>}
                    </div>}
                </div>
            </div>
        </div >
    )
}

const IDPAYMENTMETHODS = "IDPAYMENTMETHODS";
const PaymentMethods: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const deleteRequest = useSelector(state => state.culqi.requestCardDelete);
    const executeRequest = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main.mainData);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);

    const [dataPaymentMethods, setDataPaymentMethods] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: true });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitDelete, setWaitDelete] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const fetchData = () => dispatch(getCollection(listPaymentCard({
        corpid: user?.corpid || 0,
        id: 0,
        orgid: 0,
    })));

    useEffect(() => {
        fetchData();

        dispatch(setMemoryTable({
            id: IDPAYMENTMETHODS
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row: row, edit: false });
    }

    const handleDelete = (row: Dictionary) => {
        if (row.favorite) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.paymentmethod_preferreddelete) }));
        }
        else {
            const callback = () => {
                dispatch(cardDelete(row));
                dispatch(showBackdrop(true));
                setWaitDelete(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback
            }))
        }
    }

    const handleFavorite = (row: Dictionary) => {
        row.favorite = true;
        row.username = user?.usr;

        const callback = () => {
            dispatch(execute(paymentCardInsert(row)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_paymentcard),
            callback
        }))
    }

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataPaymentMethods(mainResult.data.map(x => ({
                ...x,
                favoritecolumn: t(x.favorite ? langKeys.affirmative : langKeys.negative),
            })))
        }
    }, [mainResult])

    useEffect(() => {
        if (waitDelete) {
            if (!deleteRequest.loading && !deleteRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData && fetchData();
                setWaitDelete(false);
                dispatch(showBackdrop(false));
            } else if (deleteRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t((deleteRequest.msg || deleteRequest.code) || "error_unexpected_error") }))
                setWaitDelete(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [deleteRequest, waitDelete])

    useEffect(() => {
        if (waitSave) {
            if (!executeRequest.loading && !executeRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.markpreferred_success) }))
                fetchData && fetchData();
                setWaitSave(false);
                dispatch(showBackdrop(false));
            } else if (executeRequest.error) {
                const errormessage = t(executeRequest.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRequest, waitSave])

    const columns = React.useMemo(
        () => [
            {
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                accessor: 'corpid',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            extraFunction={row.favorite ? undefined : () => handleFavorite(row)}
                            extraOption={row.favorite ? undefined : t(langKeys.markpreferred)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.name_plural),
                accessor: 'firstname',
            },
            {
                Header: t(langKeys.ticket_lastname),
                accessor: 'lastname',
            },
            {
                Header: t(langKeys.ticket_email),
                accessor: 'mail',
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
            },
            {
                Header: t(langKeys.creditcardnumber),
                accessor: 'cardnumber',
            },
            {
                Header: t(langKeys.preferred),
                accessor: 'favoritecolumn',
            },
        ],
        []
    );

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: '100%' }}>
                <TableZyx
                    onClickRow={handleView}
                    columns={columns}
                    data={dataPaymentMethods}
                    filterGeneral={false}
                    loading={mainResult.loading}
                    download={true}
                    register={true}
                    handleRegister={handleRegister}
                    registertext={t(langKeys.create)}
                    pageSizeDefault={IDPAYMENTMETHODS === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDPAYMENTMETHODS === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDPAYMENTMETHODS === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    } else {
        return (
            <PaymentMethodsDetails
                data={rowSelected}
                fetchData={fetchData}
                setViewSelected={setViewSelected}
            />
        );
    }
}

const PaymentMethodsDetails: React.FC<DetailPropsPaymentMethod> = ({ data: { edit, row }, fetchData, setViewSelected }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const createRequest = useSelector(state => state.culqi.requestCardCreate);

    const [checkedFavorite, setCheckedFavorite] = useState(row?.favorite || false);
    const [icon, setIcon] = useState(<></>);
    const [waitSave, setWaitSave] = useState(false);

    const datamonth = useMemo(() => ([
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
    ]), [t]);

    const arrayBreadPaymentMethods = [
        { id: "view-1", name: t(langKeys.paymentmethod) },
        { id: "view-2", name: t(langKeys.paymentmethodsdetail) }
    ];

    const emailRequired = (value: string) => {
        if (value.length === 0) {
            return t(langKeys.field_required) as string;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return t(langKeys.emailverification) as string;
        }
    }

    const { register, handleSubmit, setValue, getValues, control, formState: { errors } } = useForm({
        defaultValues: {
            firstname: row?.firstname || '',
            lastname: row?.lastname || '',
            mail: row?.mail || '',
            cardnumber: row?.cardnumber || '',
            securitycode: row?.securitycode || '',
            expirationmonth: row?.expirationmonth || '',
            expirationyear: row?.expirationyear || '',
            phone: row?.phone || '',
            favorite: row?.favorite || false,
            cardlimit: 16,
        }
    });

    React.useEffect(() => {
        if (!edit) {
            if (row?.cardnumber) {
                if (row.cardnumber.slice(0, 1) === "4") {
                    setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>)
                    // setLimitNumbers(19);
                    setValue('cardlimit', 19);
                } else if (row.cardnumber.slice(0, 2) === "51" || row.cardnumber.slice(0, 2) === "55") {
                    setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>)
                    // setLimitNumbers(19);
                    setValue('cardlimit', 19);
                } else if (row.cardnumber.slice(0, 2) === "37" || row.cardnumber.slice(0, 2) === "34") {
                    setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>)
                    // setLimitNumbers(18);
                    setValue('cardlimit', 18);
                } else if (row.cardnumber.slice(0, 2) === "36" || row.cardnumber.slice(0, 2) === "38" || row.cardnumber.slice(0, 3) === "300" || row.cardnumber.slice(0, 3) === "305") {
                    setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>)
                    // setLimitNumbers(17);
                    setValue('cardlimit', 17);
                } else {
                    setIcon(<></>)
                    // setLimitNumbers(10);
                    setValue('cardlimit', 10);
                }
            }
        }
    }, [edit]);

    React.useEffect(() => {
        register('firstname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('lastname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('mail', { validate: emailRequired, value: '' });
        register('cardnumber', { validate: (value) => (value && value.length !== 0 && value.length === getValues('cardlimit')) || (value.length === 0 ? t(langKeys.field_required) : t(langKeys.creditcardvalidate)) });
        register('securitycode', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('expirationmonth', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('expirationyear', { validate: (value) => (value && value.length && value.length <= 4) || t(langKeys.field_required) });
        register('favorite');
        register('phone', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('cardlimit');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!createRequest.loading && !createRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                fetchData && fetchData();
                setWaitSave(false);
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (createRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t((createRequest.msg || createRequest.code) || "error_unexpected_error") }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [createRequest, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(cardCreate(data));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBreadPaymentMethods}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? t(langKeys.paymentmethod) : t(langKeys.paymentmethodnew)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <h3>{t(langKeys.addpaymentmethodsub)}</h3>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.firstname)}
                            onChange={(value) => setValue('firstname', value)}
                            valueDefault={getValues('firstname')}
                            error={errors?.firstname?.message}
                            className="col-6"
                            disabled={!edit}
                        />
                        <FieldEdit
                            label={t(langKeys.lastname)}
                            onChange={(value) => setValue('lastname', value)}
                            valueDefault={getValues('lastname')}
                            error={errors?.lastname?.message}
                            className="col-6"
                            disabled={!edit}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.email)}
                            onChange={(value) => setValue('mail', value)}
                            valueDefault={getValues('mail')}
                            error={errors?.mail?.message}
                            className="col-6"
                            disabled={!edit}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (value.length === 0) {
                                        return t(langKeys.field_required) as string;
                                    } else if (value.length < 10) {
                                        return t(langKeys.validationphone) as string;
                                    }
                                }
                            }}
                            render={({ field, formState: { errors } }) => (
                                <CssPhonemui
                                    {...field}
                                    className="col-6"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    defaultCountry={'pe'}
                                    label={t(langKeys.phone)}
                                    error={!!errors?.phone}
                                    helperText={errors?.phone?.message}
                                    disabled={!edit}
                                />
                            )}
                        />
                    </div>
                    <h3>{t(langKeys.creditcard)}</h3>
                    {edit && <div style={{ display: "flex" }}>
                        <img alt="aux2" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>
                        <img alt="aux2" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>
                        <img alt="aux2" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>
                        <img alt="aux2" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>
                    </div>}
                    <div style={{ display: "flex", width: "100%" }}>
                        <div style={{ width: "50%" }}>
                            <div className="row-zyx">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    label={t(langKeys.creditcard)}
                                    error={!!errors.cardnumber}
                                    helperText={errors.cardnumber?.message}
                                    disabled={!edit}
                                    defaultValue={getValues('cardnumber')}
                                    onPaste={e => {
                                        e.preventDefault()
                                    }}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                        let spaces = Math.floor(val.length / 4)
                                        let partialvalue = val.slice(0, 4)
                                        for (let i = 1; i <= spaces; i++) {
                                            partialvalue += " " + val.slice(i * 4, (i + 1) * 4)
                                        }
                                        if (partialvalue.slice(-1) === " ") {
                                            partialvalue = partialvalue.slice(0, -1);
                                        }
                                        e.target.value = partialvalue;

                                        setValue("cardnumber", partialvalue.trim());
                                    }}
                                    onInput={(e: any) => {
                                        if (e.target.value.slice(0, 1) === "4") {
                                            setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>)
                                            // setLimitNumbers(19);
                                            setValue('cardlimit', 19);
                                        } else if (e.target.value.slice(0, 2) === "51" || e.target.value.slice(0, 2) === "55") {
                                            setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>)
                                            // setLimitNumbers(19);
                                            setValue('cardlimit', 19);
                                        } else if (e.target.value.slice(0, 2) === "37" || e.target.value.slice(0, 2) === "34") {
                                            setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>)
                                            // setLimitNumbers(18);
                                            setValue('cardlimit', 18);
                                        } else if (e.target.value.slice(0, 2) === "36" || e.target.value.slice(0, 2) === "38" || e.target.value.slice(0, 3) === "300" || e.target.value.slice(0, 3) === "305") {
                                            setIcon(<img alt="aux" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>)
                                            // setLimitNumbers(17);
                                            setValue('cardlimit', 17);
                                        } else {
                                            setIcon(<></>)
                                            // setLimitNumbers(10);
                                            setValue('cardlimit', 10);
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: icon,
                                    }}
                                    inputProps={{
                                        maxLength: getValues('cardlimit'),
                                    }}
                                    className="col-9"
                                />
                                <div className={"col-3"} style={{ paddingBottom: '3px' }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.preferred)}</Box>
                                    <FormControlLabel
                                        style={{ paddingLeft: 10 }}
                                        control={<IOSSwitch checked={checkedFavorite} disabled={!edit} onChange={(e) => { setCheckedFavorite(e.target.checked); setValue('favorite', e.target.checked) }} />}
                                        label={""}
                                    />
                                </div>
                            </div>
                            {edit && <h3>{t(langKeys.dueDate)}</h3>}
                            {edit && <div style={{ display: "flex" }}>
                                <FieldSelect
                                    onChange={(data: typeof datamonth[number]) => {
                                        setValue('expirationmonth', data?.desc || "");
                                    }}
                                    variant="outlined"
                                    style={{ marginTop: 8, marginRight: 10 }}
                                    className="col-6"
                                    valueDefault={getValues('expirationmonth')}
                                    label={"MM"}
                                    error={errors.expirationmonth?.message}
                                    data={datamonth}
                                    optionDesc="desc"
                                    optionValue="id"
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    className="col-6"
                                    style={{ marginTop: 8 }}
                                    type="number"
                                    size="small"
                                    label={"YYYY"}
                                    error={!!errors.expirationyear}
                                    helperText={errors.expirationyear?.message}
                                    inputProps={{
                                        maxLength: 4
                                    }}
                                    onChange={(e) => {
                                        setValue("expirationyear", e.target.value);
                                    }}
                                />
                            </div>}
                            {edit && <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                type="password"
                                size="small"
                                label={t(langKeys.securitycode)}
                                error={!!errors.securitycode}
                                helperText={errors.securitycode?.message}
                                inputProps={{
                                    maxLength: getValues('cardlimit') === 18 ? 4 : 3
                                }}
                                onChange={(e) => {
                                    setValue("securitycode", e.target.value);
                                }}
                            />}
                        </div>
                        <div style={{ width: "50%" }}>
                            {edit && <div style={{ textAlign: "center", padding: "20px", border: "1px solid #7721ad", borderRadius: "15px", margin: "10px" }}>{t(langKeys.finishregwarn)}</div>}
                            {edit && <div style={{ textAlign: "center", padding: "20px", color: "#7721ad", margin: "10px" }}>{t(langKeys.finishregwarn2)}</div>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

const Invoice: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const multiData = useSelector(state => state.main.multiData);
    const user = useSelector(state => state.login.validateToken.user);

    const [dataCorp, setDataCorp] = useState<any>([]);
    const [dataOrg, setDataOrg] = useState<any>([]);
    const [dataPaymentPlan, setDataPaymentPlan] = useState<any>([]);
    const [dataPlan, setDataPlan] = useState<any>([]);
    const [pageSelected, setPageSelected] = useState(0);
    const [sentFirstInfo, setSentFirstInfo] = useState(false);

    const [customSearch, setCustomSearch] = useState({
        year: 0,
        month: 0,
        corpid: 0,
        orgid: 0,
        totalize: 2,
    });

    useEffect(() => {
        if (customSearch.corpid !== 0) {
            setPageSelected(1);
        }
    }, [customSearch])

    useEffect(() => {
        if (!multiData.loading && sentFirstInfo) {
            setSentFirstInfo(false);
            setDataPlan(multiData.data[0] && multiData.data[0].success ? multiData.data[0].data : []);
            setDataOrg(multiData.data[1] && multiData.data[1].success ? multiData.data[1].data : []);
            setDataCorp(multiData.data[2] && multiData.data[2].success ? multiData.data[2].data : []);
            setDataPaymentPlan(multiData.data[3] && multiData.data[3].success ? multiData.data[3].data : []);
        }
    }, [multiData])

    useEffect(() => {
        setSentFirstInfo(true);
        dispatch(getCountryList())
        if (user?.roledesc === "SUPERADMIN") {
            dispatch(getMultiCollection([
                getPlanSel(),
                getOrgSelList(0),
                getCorpSel(0),
                getPaymentPlanSel(),
            ]));
        }
        else {
            dispatch(getMultiCollection([
                getPlanSel(),
                getOrgSelList(user?.corpid || 0),
                getCorpSelVariant(user?.corpid || 0, user?.orgid || 0, user?.usr || ''),
                getPaymentPlanSel(),
            ]));
        }
    }, [])

    return (
        <div style={{ width: '100%' }}>
            {user?.roledesc === "SUPERADMIN" && <div>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.costperperiod)} />
                    <AntTab label={t(langKeys.periodreport)} />
                    <AntTab label={t(langKeys.payments)} />
                    <AntTab label={t(langKeys.invoice)} />
                    <AntTab label={t(langKeys.messagingpackages)} />
                    <AntTab label={t(langKeys.paymentmethods)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 16 }}>
                        <CostPerPeriod dataCorp={dataCorp} dataOrg={dataOrg} dataPaymentPlan={dataPaymentPlan} dataPlan={dataPlan} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 16 }}>
                        <PeriodReport dataCorp={dataCorp} dataOrg={dataOrg} customSearch={customSearch} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 16 }}>
                        <Payments dataCorp={dataCorp} dataOrg={dataOrg} setCustomSearch={setCustomSearch} />
                    </div>
                }
                {pageSelected === 3 &&
                    <div style={{ marginTop: 16 }}>
                        <Billing dataCorp={dataCorp} dataOrg={dataOrg} />
                    </div>
                }
                {pageSelected === 4 &&
                    <div style={{ marginTop: 16 }}>
                        <MessagingPackages dataCorp={dataCorp} dataOrg={dataOrg} />
                    </div>
                }
                {pageSelected === 5 &&
                    <div style={{ marginTop: 16 }}>
                        <PaymentMethods />
                    </div>
                }
            </div>}
            {["ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '') && <div>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.periodreport)} />
                    <AntTab label={t(langKeys.payments)} />
                    <AntTab label={t(langKeys.messagingpackages)} />
                    <AntTab label={t(langKeys.paymentmethods)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 16 }}>
                        <PeriodReport dataCorp={dataCorp} dataOrg={dataOrg} customSearch={customSearch} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 16 }}>
                        <Payments dataCorp={dataCorp} dataOrg={dataOrg} setCustomSearch={setCustomSearch} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 16 }}>
                        <MessagingPackages dataCorp={dataCorp} dataOrg={dataOrg} />
                    </div>
                }
                {pageSelected === 3 &&
                    <div style={{ marginTop: 16 }}>
                        <PaymentMethods />
                    </div>
                }
            </div>}
        </div>

    );
}

export default Invoice;