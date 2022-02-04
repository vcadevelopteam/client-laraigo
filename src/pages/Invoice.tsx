/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { cleanMemoryTable, setMemoryTable, uploadFile } from 'store/main/actions';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldMultiSelect, DialogZyx, FieldEditArray, TemplateIcons } from 'components';
import { selInvoice, deleteInvoice, getLocaleDateString, selInvoiceClient, getBillingPeriodSel, billingPeriodUpd, getPlanSel, getOrgSelList, getCorpSel, getPaymentPlanSel, getBillingPeriodCalcRefreshAll, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp, billingpersonreportsel, billinguserreportsel, invoiceRefreshTest, getAppsettingInvoiceSel, getOrgSel, getMeasureUnit, getValuesFromDomain, getInvoiceDetail, selBalanceData, getBillingMessagingCurrent, getBalanceSelSent, getCorpSelVariant } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm, useFieldArray } from 'react-hook-form';
import ClearIcon from '@material-ui/icons/Clear';
import { getCollection, getMultiCollection, execute, exportData, getMultiCollectionAux } from 'store/main/actions';
import { createInvoice, regularizeInvoice, createCreditNote, getExchangeRate, emitInvoice } from 'store/culqi/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { CircularProgress, IconButton, Tabs, TextField } from '@material-ui/core';
import * as locale from "date-fns/locale";
import { DownloadIcon } from 'icons';
import {
    Close,
    FileCopy,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Add as AddIcon,
    GetApp
} from '@material-ui/icons';
import PaymentIcon from '@material-ui/icons/Payment';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
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
import jsPDF from 'jspdf';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Trans } from 'react-i18next';
import DomToImage from 'dom-to-image';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
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

function formatNumber(num: number) {
    if (num)
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}

function formatNumberFourDecimals(num: number) {
    if (num)
        return num.toFixed(4).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1')
    return "0.0000"
}

function formatNumberNoDecimals(num: number) {
    if (num)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}

export const DateOptionsMenuComponent = (value: any, handleClickItemMenu: (key: any) => void) => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(locale as any)[navigator.language.split('-')[0]]} >
            <KeyboardDatePicker
                format={getLocaleDateString()}
                value={value === '' ? null : value}
                onChange={(e: any) => handleClickItemMenu(e)}
                style={{ minWidth: '150px' }}
                views={["month", "year"]}
            />
        </MuiPickersUtilsProvider>
    )
}

const useStyles = makeStyles((theme) => ({
    
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
        color:"transparent",
    },
    commentary: {
        fontStyle:"italic"
    },
    section: {
        fontWeight:"bold"
    }
}));

const IDCOSTPERPERIOD = "IDCOSTPERPERIOD";
const CostPerPeriod: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const user = useSelector(state => state.login.validateToken.user);

    const classes = useStyles();
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : []
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : []
    const dataPaymentPlanList = dataPlan.data[3] && dataPlan.data[3].success? dataPlan.data[3].data : []
    const dataPlanList = dataPlan.data[0] && dataPlan.data[0].success? dataPlan.data[0].data : []
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);

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

    const dataYears = [{ desc: "2010" }, { desc: "2011" }, { desc: "2012" }, { desc: "2013" }, { desc: "2014" }, { desc: "2015" }, { desc: "2016" }, { desc: "2017" }, { desc: "2018" }, { desc: "2020" }, { desc: "2021" }, { desc: "2022" }, { desc: "2023" }, { desc: "2024" }, { desc: "2025" }];
    const dataMonths =[{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" }];

    function search(){
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
        if (!mainResult.mainData.loading){
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
                Header: t(langKeys.totalcharge),
                accessor: 'totalcharge',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { totalcharge } = props.cell.row.original;
                    return formatNumber(totalcharge || 0);
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
                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_calculate) }))
                    setWaitCalculate(false);
                }
                else {
                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
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
                        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{width: 140}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||0}))}
                                data={dataYears}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 214}}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
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
                                onChange={(value) => setdataMain(prev=>({...prev,corpid:value?.corpid||0,orgid:0}))}
                                data={dataCorpList}
                                optionDesc="description"
                                optionValue="corpid"
                                disabled={user?.roledesc === "ADMINISTRADOR"}
                            />
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,orgid:value?.orgid||0}))}
                                data={dataOrgList.filter((e:any)=>{return e.corpid===dataMain.corpid})}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                            />
                            <FieldSelect
                                label={t(langKeys.contractedplan)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.billingplan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,billingplan:value?value.plan:""}))}
                                data={dataPaymentPlanList}
                                optionDesc="plan"
                                optionValue="plan"
                            />
                            <FieldSelect
                                label={t(langKeys.supportplan)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.supportplan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,supportplan:value?value.description:""}))}
                                data={dataPlanList}
                                optionDesc="description"
                                optionValue="description"
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
                dataPlan = {dataPlan}
            />
        )
    } else
        return null;
}

const DetailCostPerPeriod: React.FC<DetailSupportPlanProps2> = ({ data: { row, edit }, setViewSelected, fetchData, dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataPaymentPlanList = dataPlan.data[3] && dataPlan.data[3].success? dataPlan.data[3].data : []
    const dataPlanList = dataPlan.data[0] && dataPlan.data[0].success? dataPlan.data[0].data : []
    const executeRes = useSelector(state => state.main.execute);

    const [pageSelected, setPageSelected] = useState(0);
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadCostPerPeriod = [
        { id: "view-1", name: t(langKeys.costperperiod) },
        { id: "view-2", name: t(langKeys.costperperioddetail) }
    ];

    if (row?.year !== new Date().getFullYear() || row?.month !== new Date().getMonth() + 1) {
        edit = false;
    }

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {            
            corpid: row?.corpid||0,
            orgid: row?.orgid||0,
            corpdesc: row?.corpdesc||"",
            orgdesc: row?.orgdesc||"",
            year: row?.year ||new Date().getFullYear(),
            month: row?.month ||new Date().getMonth() + 1,
            billingplan: row?.billingplan || "",
            supportplan: row?.supportplan || "",
            basicfee: row?.basicfee||0,
            userfreequantity: row?.userfreequantity||0,
            useradditionalfee : row?.useradditionalfee ||0,
            supervisorquantity: row?.supervisorquantity||0,
            asesorquantity: row?.asesorquantity||0,
            userquantity: row?.userquantity||0,
            useradditionalcharge: row?.useradditionalcharge||0,
            channelfreequantity: row?.channelfreequantity||0,
            channelwhatsappfee: row?.channelwhatsappfee||0,
            channelwhatsappquantity: row?.channelwhatsappquantity||0,
            channelwhatsappcharge: row?.channelwhatsappcharge||0,
            channelotherfee: row?.channelotherfee||0,
            channelotherquantity: row?.channelotherquantity||0,
            channelothercharge: row?.channelothercharge||0,
            channelcharge: row?.channelcharge||0,
            clientfreequantity: row?.clientfreequantity||0,
            clientquantity: row?.clientquantity||0,
            clientadditionalfee: row?.clientadditionalfee||0,
            clientadditionalcharge: row?.clientadditionalcharge||0,
            conversationquantity: row?.conversationquantity||0,
            conversationcompanywhatquantity: row?.conversationcompanywhatquantity||0,
            conversationcompanywhatfee: row?.conversationcompanywhatfee||0,
            conversationcompanywhatcharge: row?.conversationcompanywhatcharge||0,
            conversationclientwhatquantity: row?.conversationclientwhatquantity||0,
            conversationclientwhatfee: row?.conversationclientwhatfee||0,
            conversationclientwhatcharge: row?.conversationclientwhatcharge||0,
            conversationwhatcharge: row?.conversationwhatcharge||0,
            interactionquantity: row?.interactionquantity||0,
            supportbasicfee: row?.supportbasicfee||0,
            additionalservicename1: row?.additionalservicename1||"",
            additionalservicefee1: row?.additionalservicefee1||0,
            additionalservicename2: row?.additionalservicename2||"",
            additionalservicefee2: row?.additionalservicefee2||0,
            additionalservicename3: row?.additionalservicename3||"",
            additionalservicefee3: row?.additionalservicefee3||0,
            force: row?.force||true,
            totalcharge: row?.totalcharge||0,
            conversationclientwhatfreequantity: row?.conversationclientwhatfreequantity||0,
            conversationcompanywhatfreequantity: row?.conversationcompanywhatfreequantity||0,
            unitpricepersms: row?.unitpricepersms||0,
            vcacomissionpersms: row?.vcacomissionpersms||0,
            smsquantity: row?.smsquantity||0,
            smscost: row?.smscost||0,
            unitepricepermail: row?.unitepricepermail||0,
            vcacomissionpermail: row?.vcacomissionpermail||0,
            mailquantity: row?.mailquantity||0,
            mailcost: row?.mailcost||0,
        }
    });

    React.useEffect(() => {
        register('corpid');
        register('orgid');
        register('year');
        register('month');
        register('billingplan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('supportplan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('userfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('useradditionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('channelfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('channelwhatsappfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('channelotherfee');
        register('clientfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('clientadditionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('supportbasicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value))>=0) || t(langKeys.field_required) });
        register('additionalservicename1');
        register('additionalservicefee1');
        register('additionalservicename2');
        register('additionalservicefee2');
        register('additionalservicename3');
        register('additionalservicefee3');
        register('force');
        register('totalcharge');
        register('conversationclientwhatfreequantity');
        register('conversationcompanywhatfreequantity');
        register('unitpricepersms');
        register('vcacomissionpersms');
        register('smsquantity');
        register('smscost');
        register('unitepricepermail');
        register('vcacomissionpermail');
        register('mailquantity');
        register('mailcost');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingPeriodUpd(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
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
                            breadcrumbs={arrayBreadCostPerPeriod}
                            handleClick={(id) => {setViewSelected(id); fetchData();}}
                        />
                        <TitleDetail
                            title={row? `${row.corpdesc} - ${row.orgdesc}` : t(langKeys.neworganization)}
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
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.generalinformation)}/>
                    <AntTab label={t(langKeys.agents_plural)}/>
                    <AntTab label={t(langKeys.channel_plural)}/>
                    <AntTab label={t(langKeys.conversation_plural)}/>
                    <AntTab label={t(langKeys.contact_plural)}/>
                    <AntTab label={t(langKeys.messaging)}/>
                    <AntTab label="Extras"/>
                </Tabs>
                {pageSelected === 0  && <div className={classes.containerDetail}>
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
                        { edit ? <FieldSelect
                            label={t(langKeys.contractedplan)}
                            className="col-6"
                            valueDefault={getValues("billingplan")}
                            variant="outlined"
                            onChange={(value) => setValue('billingplan',value?.plan)}
                            data={dataPaymentPlanList}
                            error={errors?.billingplan?.message}
                            optionDesc="plan"
                            optionValue="plan"
                        /> : 
                            <FieldView
                            className="col-6"
                            label={t(langKeys.contractedplan)}
                            value={getValues("billingplan")}
                            />
                        }
                        { edit ? <FieldSelect
                            label={t(langKeys.contractedsupportplan)}
                            className="col-6"
                            valueDefault={getValues("supportplan")}
                            variant="outlined"
                            onChange={(value) => setValue('supportplan',value?.description)}
                            data={dataPlanList}
                            error={errors?.supportplan?.message}
                            optionDesc="description"
                            optionValue="description"
                        /> :
                            <FieldView
                            className="col-6"
                            label={t(langKeys.contractedsupportplan)}
                            value={getValues("supportplan")}
                            />
                        }
                        
                    </div>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
                            label={t(langKeys.costbasedonthecontractedplan)}
                            onChange={(value) => setValue('basicfee', value)}
                            valueDefault={getValues('basicfee')}
                            error={errors?.basicfee?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                            className="col-6"
                            label={t(langKeys.costbasedonthecontractedplan)}
                            value={getValues('basicfee')}
                            />
                        }
                        { edit ? <FieldEdit
                            label={t(langKeys.costbasedonthesupportplan)}
                            onChange={(value) => setValue('supportbasicfee', value)}
                            valueDefault={getValues('supportbasicfee')}
                            error={errors?.supportbasicfee?.message}
                            type="number"
                            className="col-6"
                        />:
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
                        { edit ? <FieldEdit
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
                            value={String(getValues("asesorquantity"))}
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
                            value={String(getValues("userquantity"))}
                        />
                    </div>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
                            label={t(langKeys.useradditionalfee)}
                            onChange={(value) => setValue('useradditionalfee', value)}
                            valueDefault={getValues('useradditionalfee')}
                            error={errors?.useradditionalfee?.message}
                            type="number"
                            className="col-6"
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
                </div>}
                {pageSelected === 2  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
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
                        { edit ? <FieldEdit
                            label={t(langKeys.channelwhatsappfee)}
                            onChange={(value) => setValue('channelwhatsappfee', value)}
                            valueDefault={getValues('channelwhatsappfee')}
                            error={errors?.channelwhatsappfee?.message}
                            type="number"
                            className="col-6"
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
                    </div>
                </div>}
                {pageSelected === 3  && <div className={classes.containerDetail}>
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
                            label={t(langKeys.conversationclientwhatfee)}
                            value={formatNumberFourDecimals(getValues("conversationclientwhatfee") || 0)}
                        />
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
                            label={t(langKeys.conversationcompanywhatfee)}
                            value={formatNumberFourDecimals(getValues("conversationcompanywhatfee") || 0)}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatcharge)}
                            value={formatNumber(getValues("conversationcompanywhatcharge") || 0)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationwhatcharge)}
                            value={formatNumber(getValues("conversationwhatcharge") || 0)}
                        />
                    </div>
                </div>}
                {pageSelected === 4  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
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
                        { edit ? <FieldEdit
                            label={t(langKeys.clientadditionalfee)}
                            onChange={(value) => setValue('clientadditionalfee', value)}
                            valueDefault={getValues('clientadditionalfee')}
                            error={errors?.clientadditionalfee?.message}
                            type="number"
                            className="col-6"
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
                {pageSelected === 5  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
                            label={t(langKeys.unitpricepersms)}
                            onChange={(value) => setValue('unitpricepersms', value)}
                            valueDefault={getValues('unitpricepersms')}
                            error={errors?.unitpricepersms?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.unitpricepersms)}
                                value={formatNumberFourDecimals(getValues("unitpricepersms") || 0)}
                            />
                        }
                        { edit ? <FieldEdit
                            label={t(langKeys.vcacomissionpersms)}
                            onChange={(value) => setValue('vcacomissionpersms', value)}
                            valueDefault={getValues('vcacomissionpersms')}
                            error={errors?.vcacomissionpersms?.message}
                            type="number"
                            className="col-6"
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
                        <FieldView
                            className="col-6"
                            label={t(langKeys.smscost)}
                            value={formatNumber(getValues("smscost") || 0)}
                        />
                    </div>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
                            label={t(langKeys.unitepricepermail)}
                            onChange={(value) => setValue('unitepricepermail', value)}
                            valueDefault={getValues('unitepricepermail')}
                            error={errors?.unitepricepermail?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={t(langKeys.unitepricepermail)}
                                value={formatNumberFourDecimals(getValues("unitepricepermail") || 0)}
                            />
                        }
                        { edit ? <FieldEdit
                            label={t(langKeys.vcacomissionpermail)}
                            onChange={(value) => setValue('vcacomissionpermail', value)}
                            valueDefault={getValues('vcacomissionpermail')}
                            error={errors?.vcacomissionpermail?.message}
                            type="number"
                            className="col-6"
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
                        <FieldView
                            className="col-6"
                            label={t(langKeys.mailcost)}
                            value={formatNumber(getValues("mailcost") || 0)}
                        />
                    </div>
                </div>}
                {pageSelected === 6  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
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
                        { edit ? <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 1`}
                            onChange={(value) => setValue('additionalservicefee1', value)}
                            valueDefault={getValues('additionalservicefee1')}
                            error={errors?.additionalservicefee1?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicefee)} 1`}
                                value={formatNumberFourDecimals(getValues("additionalservicefee1") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
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
                        { edit ? <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 2`}
                            onChange={(value) => setValue('additionalservicefee2', value)}
                            valueDefault={getValues('additionalservicefee2')}
                            error={errors?.additionalservicefee2?.message}
                            type="number"
                            className="col-6"
                        /> :
                            <FieldView
                                className="col-6"
                                label={`${t(langKeys.additionalservicefee)} 2`}
                                value={formatNumberFourDecimals(getValues("additionalservicefee2") || 0)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ? <FieldEdit
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
                        { edit ? <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 3`}
                            onChange={(value) => setValue('additionalservicefee3', value)}
                            valueDefault={getValues('additionalservicefee3')}
                            error={errors?.additionalservicefee3?.message}
                            type="number"
                            className="col-6"
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

const PeriodReport: React.FC <{ dataPlan: any, customSearch: any }> = ({ dataPlan, customSearch }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : [];
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : [];
    const executeCalculate = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const resExportData = useSelector(state => state.main.exportData);
    const user = useSelector(state => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        corpid: user?.corpid || 0,
        orgid: user?.orgid || 0,
        totalize: 2,
    });

    const [datareport, setdatareport] = useState<any>([]);
    const [requesttipe, setrequesttipe] = useState(2)
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [waitSearch, setWaitSearch] = useState(false);

    const el = React.useRef<null | HTMLDivElement>(null);

    const datatotalize = [{ value: 1, description: t(langKeys.corporation) }, { value: 2, description: t(langKeys.organization) }]

    function handleDateChange(e: any){
        if(e!==""){
            let datetochange = new Date(e+"-02")
            let mes = datetochange?.getMonth()+1
            let year = datetochange?.getFullYear()
            let datetoshow = `${year}-${String(mes).padStart(2, '0')}`
            setdataMain(prev=>({...prev,datetoshow,year,month:mes}))
        }
    }

    function search(){
        dispatch(showBackdrop(true))
        setrequesttipe(dataMain.totalize)
        if(dataMain.totalize===2){
            dispatch(getCollection(getBillingPeriodSummarySel(dataMain)))
        }else{
            dispatch(getCollection(getBillingPeriodSummarySelCorp(dataMain)))
        }
    }

    useEffect(() => {
        search()
    }, [])

    useEffect(() => {
        if (customSearch?.corpid !== 0) {
            setdataMain( prev => ({...prev,
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
        if (!mainResult.mainData.loading){
            if(mainResult.mainData.data.length){
                setdatareport(mainResult.mainData.data[0])
            }
            dispatch(showBackdrop(false))
        }
    }, [mainResult.mainData])

    useEffect(() => {
        if (waitCalculate) {
            if (!executeCalculate.loading && !executeCalculate.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_calculate) }))
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
                search();
            } else if (executeCalculate.error) {
                const message = t(executeCalculate.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message }))
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
            }
        }
    }, [executeCalculate, waitCalculate])

    const triggerExportDataPerson = () => {
        dispatch(exportData(billingpersonreportsel(dataMain),"BillingPersonReport","excel",true))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataUser = () => {
        dispatch(exportData(billinguserreportsel(dataMain),"BillingUserReport","excel",true))
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

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    const GenericPdfDownloader: React.FC<{ downloadFileName: string }> = ({ downloadFileName }) => {

        const downloadPdfDocument = () => {
            if (el.current) {
                const gg = document.createElement('div');
                gg.style.display = 'flex';
                gg.style.flexDirection = 'column';
                gg.style.gap = '8px';
                gg.id = "newexportcontainer"
                document.body.appendChild(gg);

                gg.innerHTML = el.current.innerHTML;
                document.body.appendChild(gg);
                const pdf = new jsPDF('p', 'mm');

                if (pdf) {
                    DomToImage.toPng(gg)
                        .then(imgData => {
                            var imgWidth = 210;
                            var pageHeight = 295;
                            var imgHeight = gg.scrollHeight * imgWidth / gg.offsetWidth;
                            var heightLeft = imgHeight;
                            var doc = new jsPDF('p', 'mm');
                            var position = 10; // give some top padding to first page

                            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;

                            while (heightLeft >= 0) {
                                position += heightLeft - imgHeight; // top padding for other pages
                                doc.addPage();
                                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                                heightLeft -= pageHeight;
                            }
                            doc.save(`${downloadFileName}.pdf`);
                            document.getElementById('newexportcontainer')?.remove();
                        });
                }
            }
        }
        return (
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={resExportData.loading}
                startIcon={<DownloadIcon />}
                onClick={downloadPdfDocument}
            ><Trans i18nKey={langKeys.download} />
            </Button>
        )
    }

    return (
        <Fragment>
            <div>
                <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                    <TextField
                        id="date"
                        className={classes.fieldsfilter}
                        type="month"
                        variant="outlined"
                        onChange={(e)=>handleDateChange(e.target.value)}
                        value={dataMain.datetoshow}
                        size="small"
                    />
                    <FieldSelect
                        label={t(langKeys.corporation)}
                        className={classes.fieldsfilter}
                        valueDefault={dataMain.corpid}
                        variant="outlined"
                        onChange={(value) => setdataMain(prev=>({...prev,corpid:value?.corpid||0,orgid:0}))}
                        data={dataCorpList}
                        optionDesc="description"
                        optionValue="corpid"
                        disabled={user?.roledesc === "ADMINISTRADOR"}
                    />
                    <FieldSelect
                        label={t(langKeys.organization)}
                        className={classes.fieldsfilter}
                        valueDefault={dataMain.orgid}
                        variant="outlined"
                        onChange={(value) => setdataMain(prev=>({...prev,orgid:value?.orgid||0}))}
                        data={dataOrgList.filter((e:any)=>{return e.corpid===dataMain.corpid})}
                        optionDesc="orgdesc"
                        optionValue="orgid"
                    />
                    <FieldSelect
                        label={t(langKeys.totalize)}
                        className={classes.fieldsfilter}
                        valueDefault={dataMain.totalize}
                        variant="outlined"
                        onChange={(value) => setdataMain(prev=>({...prev,totalize:value?.value||0}))}
                        data={datatotalize}
                        optionDesc="description"
                        optionValue="value"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainResult.mainData.loading}
                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                        style={{ width: 120, backgroundColor: "#55BD84" }}
                        onClick={() => search()}
                    >{t(langKeys.search)}
                    </Button>
                    {!mainResult.mainData.loading && mainResult.mainData.data.length &&(
                        <Fragment>
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
                            <GenericPdfDownloader
                                downloadFileName={'periodreport-' + new Date().toTimeString()}
                            />
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
                            >{`${t(langKeys.report)} ${t(langKeys.agent_plural)}`}
                            </Button>
                        </Fragment>)
                    }
                </div>
            </div>
            {
                !mainResult.mainData.loading && (
                <div style={{width:"100%"}} ref={el}>
                    <div className={classes.containerDetail}>
                        <div className="row-zyx" >
                            <FieldView
                                className="col-6"
                                label={t(langKeys.client)}
                                value={requesttipe===2?datareport.orgdesc:datareport.corpdesc}
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
                        <TableContainer component={Paper} style={{overflow: "hidden"}}>
                            <Table aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell>Item</StyledTableCell>
                                    <StyledTableCell align="right">{t(langKeys.quantity)}</StyledTableCell>
                                    <StyledTableCell align="right">{t(langKeys.unitaryprice)}</StyledTableCell>
                                    <StyledTableCell align="right">{t(langKeys.amount)}</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <b>{t(langKeys.basecost)}</b>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell  align="right">
                                        $ {datareport.basicfee?formatNumber(datareport.basicfee):"0.00"}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <div><b>{t(langKeys.agent_plural)}</b></div>
                                            <div>{t(langKeys.contracted)}</div>
                                            <div>{t(langKeys.additional)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>{formatNumberNoDecimals(datareport.userfreequantity)}</div>
                                            <div>{formatNumberNoDecimals(datareport.useradditionalquantity)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.useradditionalfee?formatNumber(datareport.useradditionalfee):"0.00"}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>                                            
                                            <div>$ {datareport.useradditionalcharge ?formatNumber(datareport.useradditionalcharge):"0.00"}</div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <div><b>{t(langKeys.channel_plural)}</b></div>
                                            <div>{t(langKeys.contracted)}</div>
                                            <div>{t(langKeys.whatsappchannel)}</div>
                                            <div>{t(langKeys.otherchannels)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>{formatNumberNoDecimals(datareport.channelfreequantity)}</div>
                                            <div>{formatNumberNoDecimals(datareport.channelwhatsappquantity)}</div>
                                            <div>{formatNumberNoDecimals(datareport.channelotherquantity)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.channelwhatsappfee?formatNumber(datareport.channelwhatsappfee):"0.00"}</div>
                                            <div>$ {datareport.channelotherfee?formatNumber(datareport.channelotherfee):"0.00"}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.channelwhatsappcharge?formatNumber(datareport.channelwhatsappcharge):"0.00"}</div>
                                            <div>$ {datareport.channelothercharge?formatNumber(datareport.channelothercharge):"0.00"}</div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <div><b>{t(langKeys.conversation_plural)}</b></div>
                                            <div>{t(langKeys.reportfreeconversations)}</div>
                                            <div>{t(langKeys.userinitiatedconversations)}</div>
                                            <div>{t(langKeys.businessinitiatedconversations)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>{formatNumberNoDecimals(0)}</div>
                                            <div>{formatNumberNoDecimals(0)}</div>
                                            <div>{formatNumberNoDecimals(0)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.channelwhatsappfee?formatNumber(0):"0.00"}</div>
                                            <div>$ {datareport.channelotherfee?formatNumber(0):"0.00"}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.channelwhatsappcharge?formatNumber(0):"0.00"}</div>
                                            <div>$ {datareport.channelothercharge?formatNumber(0):"0.00"}</div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <div><b>{t(langKeys.uniquecontacts)}</b></div>
                                            <div>{t(langKeys.freecontacts)}</div>
                                            <div>{t(langKeys.total)} {t(langKeys.contact_plural)}</div>
                                            <div>{t(langKeys.additional)} {t(langKeys.contact_plural)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>{formatNumberNoDecimals(datareport.clientfreequantity)}</div>
                                            <div>{formatNumberNoDecimals(datareport.clientquantity)}</div>
                                            <div>{formatNumberNoDecimals(datareport.clientadditionalquantity)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.clientadditionalfee?formatNumber(datareport.clientadditionalfee):"0.00"}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.clientadditionalcharge?formatNumber(datareport.clientadditionalcharge):"0.00"}</div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <b>{t(langKeys.supportplan)} {datareport.supportplan}</b>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell  align="right">
                                            $ {datareport.supportbasicfee?formatNumber(datareport.supportbasicfee):"0.00"}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    { (datareport.additionalservicefee1>0 || datareport.additionalservicefee2>0 || datareport.additionalservicefee3>0) &&
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            {datareport.additionalservicefee1>0? <div className={clsx({[classes.transparent]: datareport.additionalservicename1===""})}>{datareport.additionalservicename1===""?'.':datareport.additionalservicename1}</div>:""}
                                            {datareport.additionalservicefee2>0? <div className={clsx({[classes.transparent]: datareport.additionalservicename2===""})}>{datareport.additionalservicename2===""?'.':datareport.additionalservicename2}</div>:""}
                                            {datareport.additionalservicefee3>0? <div className={clsx({[classes.transparent]: datareport.additionalservicename3===""})}>{datareport.additionalservicename3===""?'.':datareport.additionalservicename3}</div>:""}
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell  align="right">
                                            {datareport.additionalservicefee1>0? <div>$ {datareport.additionalservicefee1?formatNumber(datareport.additionalservicefee1):"0.00"}</div>:""}
                                            {datareport.additionalservicefee2>0? <div>$ {datareport.additionalservicefee2?formatNumber(datareport.additionalservicefee2):"0.00"}</div>:""}
                                            {datareport.additionalservicefee3>0? <div>$ {datareport.additionalservicefee3?formatNumber(datareport.additionalservicefee3):"0.00"}</div>:""}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    }
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <b>{t(langKeys.periodamount)}</b>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell  align="right">
                                        $ {datareport.totalcharge?formatNumber(datareport.totalcharge):"0.00"}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{paddingTop: 30, fontWeight: "bold", fontSize: "1.5em"}}>{t(langKeys.servicedata)}</div>
                        <TableContainer component={Paper} style={{overflow: "hidden"}}>
                            <Table aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">
                                        <div>{datareport.clientwhatquantity}</div>
                                        <div>{t(langKeys.uniquecontacts)} Whatsapp</div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <div>{datareport.clientquantity - datareport.clientwhatquantity}</div>
                                        <div>{t(langKeys.uniquecontacts)} {t(langKeys.others)}</div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <div>{datareport.conversationquantity}</div>
                                        <div>{t(langKeys.conversation_plural)}</div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <div>{datareport.interactionquantity}</div>
                                        <div>{t(langKeys.interaction_plural)}</div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <div>{datareport.supervisorquantity}</div>
                                        <div>{t(langKeys.supervisor_plural)}</div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <div>{datareport.asesorquantity}</div>
                                        <div>{t(langKeys.assesor_plural)}</div>
                                    </StyledTableCell>
                                </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                    </div>

                </div>
                )
            }
        </Fragment>
    )
}

const IDPAYMENTS = "IDPAYMENTS";
const Payments: React.FC <{ dataPlan: any, setCustomSearch (value: React.SetStateAction<{ year: number; month: number; corpid: number; orgid: number; totalize: number; }>): void }> = ({ dataPlan, setCustomSearch }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : [];
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : [];
    const executeRes = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
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

    const dataYears = [{ desc: "2010" }, { desc: "2011" }, { desc: "2012" }, { desc: "2013" }, { desc: "2014" }, { desc: "2015" }, { desc: "2016" }, { desc: "2017" }, { desc: "2018" }, { desc: "2020" }, { desc: "2021" }, { desc: "2022" }, { desc: "2023" }, { desc: "2024" }, { desc: "2025" }];
    const dataMonths =[{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" }];

    const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]
    const dataPayment = [{ value: "PENDING", description: t(langKeys.PENDING) }, { value: "PAID", description: t(langKeys.PAID) }, { value:"NONE", description: t(langKeys.NONE) }]

    const fetchData = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const search = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const refreshAll = () => { dispatch(execute(invoiceRefreshTest(parseInt(dataMain.year || '0'), parseInt(dataMain.month || '0'), dataMain.corpid))); setWaitRefresh(true) }

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
                setCustomSearch( prev => ({...prev,
                    year: rowSelected?.year,
                    month: rowSelected?.month,
                    corpid: rowSelected?.corpid,
                    orgid: rowSelected?.orgid,
                    totalize: rowSelected?.orgid == 0 ? 1 : 2,
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
        setdisableSearch(dataMain.year === "" ) 
    }, [dataMain])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.invoicesuccessfullyvoided) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (waitRefresh) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.success) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitRefresh(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitRefresh])

    useEffect(() => {
        if (!mainResult.mainData.loading && !mainResult.mainData.error) {
            setDataInvoice(mainResult.mainData.data);
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
                    if (((row.invoicestatus === "ERROR" || row.invoicestatus === "PENDING" || row.invoicestatus === "CANCELED") || row.paymentstatus !== "PENDING") || row.totalamount <= 0)
                        return null;
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ width: 40, backgroundColor: "#55BD84" }}
                            startIcon={<PaymentIcon style={{ color: 'white' }} />}
                            onClick={() => {setModalRowSelect(row); setModalRowSend(true)}}
                        >{t(langKeys.pay)}
                        </Button>
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
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatus',
                Cell: (props: any) => {
                    const { paymentstatus } = props.cell.row.original;
                    return t(paymentstatus);
                }
            },
            {
                Header: t(langKeys.gotoreport),
                accessor: 'invoiceid',
                Cell: (props: any) => {
                    const selectedrow = props.cell.row.original;
                    const hasreport = selectedrow?.hasreport;
                    
                    if (hasreport) {
                        return (
                            <Fragment>
                                <div>
                                    {<span onClick={() => {setRowSelected(selectedrow); setRowSelect(true)}} style={{ display: "block", cursor: "pointer", color: "blue", textDecoration: "underline" }}>{t(langKeys.toreport)}</span>}
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
                accessor: 'docnumber',
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = (props.cell.row.original.serie ? props.cell.row.original.serie : 'X000') + '-' + (props.cell.row.original.correlative ? props.cell.row.original.correlative.toString().padStart(8, '0') : '00000000');
                    return (
                        <Fragment>
                            <div>
                                { (urlpdf ?
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
                accessor: 'urlxml',
                Cell: (props: any) => {
                    const urlxml = props.cell.row.original.urlxml;
                    return (
                        <Fragment>
                            <div>
                                { (urlxml ?
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
                accessor: 'urlcdr',
                Cell: (props: any) => {
                    const urlcdr = props.cell.row.original.urlcdr;
                    return (
                        <Fragment>
                            <div>
                                { (urlcdr ?
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
                                style={{width: 140}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||0}))}
                                data={dataYears}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 214}}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
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
                                onChange={(value) => setdataMain(prev=>({...prev,corpid:value?.corpid||0,orgid:0}))}
                                data={dataCorpList}
                                optionDesc="description"
                                optionValue="corpid"
                                disabled={user?.roledesc === "ADMINISTRADOR"}
                            />
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,orgid:value?.orgid||0}))}
                                data={dataOrgList.filter((e:any)=>{return e.corpid===dataMain.corpid})}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                            />
                            <FieldSelect
                                label={t(langKeys.currency)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.currency}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,currency:value?.value||''}))}
                                data={dataCurrency}
                                optionDesc="description"
                                optionValue="value"
                            />
                            <FieldSelect
                                label={t(langKeys.paymentstatus)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.paymentstatus}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,paymentstatus:value?.value||''}))}
                                data={dataPayment}
                                optionDesc="description"
                                optionValue="value"
                            />
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={search}
                            >{t(langKeys.search)}
                            </Button>
                            {user?.roledesc === "SUPERADMIN" && <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<RefreshIcon style={{ color: 'white' }} />}
                                onClick={refreshAll}
                            >{t(langKeys.refresh)}
                            </Button>}
                        </div>
                    )}
                    data={dataInvoice}
                    filterGeneral={false}
                    loading={mainResult.mainData.loading}
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
    const mainResult = useSelector(state => state.main);
    const exchangeRequest = useSelector(state => state.culqi.requestGetExchangeRate);

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
    const [Override, setOverride] = useState(false);
    const [detractionAlert, setDetractionAlert] = useState(false);
    const [detractionAmount, setDetractionAmount] = useState(0);

    useEffect(() => {
        dispatch(getCollection(getAppsettingInvoiceSel()));
        dispatch(getExchangeRate(null));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    }, [])

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
                                    setTotalAmount(Math.round(((data?.totalamount || 0) + Number.EPSILON) * 100) / 100);;
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
                            handleClick={(id) => {setViewSelected(id); fetchData();}}
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
                        {(data?.paymentstatus === "PENDING" && (data?.invoicestatus === "INVOICED" || data?.invoicestatus === "DRAFT") && publicKey && showCulqi) &&
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
                                override={Override}
                                totalpay={totalPay}
                            ></CulqiModal>
                        }
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: 16 }}>
                    <div className="row-zyx">
                        <FieldView
                            className={classes.section}
                            label={''}
                            value={t(langKeys.payment_information)}
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
                            value={(data?.currency === 'USD' ? '$' : 'S/')+formatNumber((totalAmount || 0))}
                        />
                        <FieldView
                            className="col-4"
                            label={t(langKeys.totaltopay)}
                            value={(data?.currency === 'USD' ? '$' : 'S/')+formatNumber((totalPay || 0))}
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
                    {data?.invoicestatus === "DRAFT"  && <div className="row-zyx">
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
const Billing: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : [];
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : [];
    const executeRes = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
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
    const [viewSelected, setViewSelected] = useState("view-1");
    const [isCreditNote, setIsCreditNote] = useState(false);
    const [isRegularize, setIsRegularize] = useState(false);
    const [operationName, setOperationName] = useState('');
    const [waitSave, setWaitSave] = useState(false);

    const dataYears = [{ desc: "2010" }, { desc: "2011" }, { desc: "2012" }, { desc: "2013" }, { desc: "2014" }, { desc: "2015" }, { desc: "2016" }, { desc: "2017" }, { desc: "2018" }, { desc: "2020" }, { desc: "2021" }, { desc: "2022" }, { desc: "2023" }, { desc: "2024" }, { desc: "2025" }];
    const dataMonths =[{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" }];

    const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]
    const dataPayment = [{ value: "PENDING", description: t(langKeys.PENDING) }, { value: "PAID", description: t(langKeys.PAID) }, { value:"NONE", description: t(langKeys.NONE) }]

    const fetchData = () => dispatch(getCollection(selInvoice(dataMain)));

    useEffect(() => {
        fetchData()
        dispatch(setMemoryTable({
            id: IDBILLING
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.deleteinvoicesuccess) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (!mainResult.mainData.loading && !mainResult.mainData.error) {
            setDataInvoice(mainResult.mainData.data);
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

                    if (row.hasreport === false && row.invoicestatus !== "INVOICED" && row.paymentstatus !== 'PAID') {
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
                accessor: 'receiverdoctype',
                Cell: (props: any) => {
                    const receiverdoctype = props.cell.row.original.receiverdoctype;
                    var documenttype = '';
                    switch (receiverdoctype) {
                        case '0':
                            documenttype = 'billingfield_billingno';
                            break;
                        case '1':
                            documenttype = 'billingfield_billingdni';
                            break;
                        case '4':
                            documenttype = 'billingfield_billingextra';
                            break;
                        case '6':
                            documenttype = 'billingfield_billingruc';
                            break;
                        case '7':
                            documenttype = 'billingfield_billingpass';
                            break;
                        default:
                            documenttype = 'pendingpayment';
                            break;
                    }
                    return t(documenttype);
                }
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: 'receiverdocnum',
                Cell: (props: any) => {
                    const receiverdocnum = props.cell.row.original.receiverdocnum;
                    return (
                        <Fragment>
                            <div>
                                { receiverdocnum ?
                                    <span style={{ display: "block" }}>{receiverdocnum}</span>
                                    :
                                    <span style={{ display: "block" }}>{t(langKeys.pendingpayment)}</span>
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.businessname),
                accessor: 'receiverbusinessname',
                Cell: (props: any) => {
                    const receiverbusinessname = props.cell.row.original.receiverbusinessname;
                    return (
                        <Fragment>
                            <div>
                                { receiverbusinessname ?
                                    <span style={{ display: "block" }}>{receiverbusinessname}</span>
                                    :
                                    <span style={{ display: "block" }}>{t(langKeys.pendingpayment)}</span>
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.invoicestatus),
                accessor: 'invoicestatus',
                Cell: (props: any) => {
                    const { invoicestatus } = props.cell.row.original;
                    return t(invoicestatus);
                }
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatus',
                Cell: (props: any) => {
                    const { paymentstatus } = props.cell.row.original;
                    return t(paymentstatus);
                }
            },
            {
                Header: t(langKeys.documenttype),
                accessor: 'invoicetype',
                Cell: (props: any) => {
                    const { invoicetype } = props.cell.row.original;
                    return <span style={{ display: "block" }}>{t(getInvoiceType(invoicetype))}</span>;
                }
            },
            {
                Header: t(langKeys.billingvoucher),
                accessor: 'serie',
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = (props.cell.row.original.serie ? props.cell.row.original.serie : 'X000') + '-' + (props.cell.row.original.correlative ? props.cell.row.original.correlative.toString().padStart(8, '0') : '00000000');
                    return (
                        <Fragment>
                            <div>
                                { (urlpdf ?
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
            },
            {
                Header: t(langKeys.expirationdate),
                accessor: 'expirationdate',
                Cell: (props: any) => {
                    const { expirationdate } = props.cell.row.original;
                    return (expirationdate || t(langKeys.none));
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
        ],
        []
    );

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
        if (row.invoicestatus === 'PENDING') {
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
            <TableZyx
                onClickRow={handleView}
                columns={columns}
                ButtonsElement={() => (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <FieldSelect
                            label={t(langKeys.year)}
                            style={{width: 140}}
                            valueDefault={dataMain.year}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||0}))}
                            data={dataYears}
                            optionDesc="desc"
                            optionValue="desc"
                        />
                        <FieldMultiSelect
                            label={t(langKeys.month)}
                            style={{width: 214}}
                            valueDefault={dataMain.month}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
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
                            onChange={(value) => setdataMain(prev=>({...prev,corpid:value?.corpid||0,orgid:0}))}
                            data={dataCorpList}
                            optionDesc="description"
                            optionValue="corpid"
                            disabled={user?.roledesc === "ADMINISTRADOR"}
                        />
                        <FieldSelect
                            label={t(langKeys.organization)}
                            className={classes.fieldsfilter}
                            valueDefault={dataMain.orgid}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,orgid:value?.orgid||0}))}
                            data={dataOrgList.filter((e:any)=>{return e.corpid===dataMain.corpid})}
                            optionDesc="orgdesc"
                            optionValue="orgid"
                        />
                        <FieldSelect
                            label={t(langKeys.currency)}
                            className={classes.fieldsfilter}
                            valueDefault={dataMain.currency}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,currency:value?.value||''}))}
                            data={dataCurrency}
                            optionDesc="description"
                            optionValue="value"
                        />
                        <FieldSelect
                            label={t(langKeys.paymentstatus)}
                            className={classes.fieldsfilter}
                            valueDefault={dataMain.paymentstatus}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,paymentstatus:value?.value||''}))}
                            data={dataPayment}
                            optionDesc="description"
                            optionValue="value"
                        />
                        <Button
                            disabled={mainResult.mainData.loading || disableSearch}
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
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
                registertext={langKeys.generateinvoice}
                pageSizeDefault={IDBILLING === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                initialPageIndex={IDBILLING === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                initialStateFilter={IDBILLING === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
            />
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
    const [invoiceStatus, setInvoiceStatus] = useState(data?.invoicestatus);

    const invocesBread = [
        { id: "view-1", name: t(langKeys.billingtitle) },
        { id: "view-2", name: t(langKeys.billinginvoicedetail) }
    ];

    const datacreditnote = [
        { value:"01", description: t(langKeys.billingcreditnote01) },
        { value:"04", description: t(langKeys.billingcreditnote04) }
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
                var productInformationList: Partial<unknown> [] = [];

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

    const { control, handleSubmit, register, trigger, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            corpid: data?.corpid,
            orgid: data?.orgid,
            invoiceid: data?.invoiceid,
            creditnotetype: '',
            creditnotemotive: '',
            creditnotediscount: 0.0,
            productdetail: []
        }
    });

    const { fields, append: fieldsAppend, remove: fieldRemove } = useFieldArray({
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
        if (invoiceStatus === 'ERROR') {
            const callback = () => {
                dispatch(emitInvoice(data));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            }
    
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmatiom_reemit),
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
            if (data?.invoicestatus === 'ERROR') {
                if (!emitResult.loading && !emitResult.error) {
                    dispatch(showSnackbar({ show: true, success: true, message: t(emitResult.code || "success") }))
                    dispatch(showBackdrop(false));
                    fetchData();
                    setViewSelected('view-1');
                    setWaitSave(false);
                }
                else if (emitResult.error) {
                    dispatch(showSnackbar({ show: true, success: false, message: t(emitResult.code || "error_unexpected_db_error") }))
                    dispatch(showBackdrop(false));
                    fetchData();
                    setViewSelected('view-1');
                    setWaitSave(false);
                }
            }
            else {
                if (!culqiResult.loading && !culqiResult.error) {
                    dispatch(showSnackbar({ show: true, success: true, message: t(culqiResult.code || "success") }))
                    dispatch(showBackdrop(false));
                    fetchData();
                    setViewSelected('view-1');
                    setWaitSave(false);
                }
                else if (culqiResult.error) {
                    dispatch(showSnackbar({ show: true, success: false, message: t(culqiResult.code || "error_unexpected_db_error") }))
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
                            handleClick={(id) => {setViewSelected(id); fetchData();}}
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
                        { (data?.invoicestatus === 'ERROR' && data?.invoicetype !== '07') ? (
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
                        { (data?.invoicestatus === 'INVOICED' && creditNote) ? (
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
                        { (data?.invoicestatus === 'INVOICED' && data?.paymentstatus !== 'PAID' && data?.invoicetype !== '07' && regularize) ? (
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
                        <AntTab label={t(langKeys.billinginvoicedata)}/>
                        <AntTab label={t(langKeys.billingadditionalinfo)}/>
                    </Tabs>
                    {pageSelected === 0  && <div className={classes.containerDetail}>
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
                                        type='number'
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
                    {pageSelected === 1  && <div className={classes.containerDetail}>
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
                        ) : null }
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
                                value={data?.paymentdate ? new Date(data?.paymentdate).toISOString().replace("T"," ").substring(0, 19) : t(langKeys.none)}
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

    const classes = useStyles();
    const culqiResult = useSelector(state => state.culqi.requestRegularizeInvoice);
    const uploadResult = useSelector(state => state.main.uploadFile);

    const [chatButton, setChatButton] = useState<File | string | null>(null);
    const [chatImgUrl, setChatImgUrl] = useState<string | undefined | null>(null);
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
        setChatImgUrl(getImgUrl(chatButton));
    }, [])

    useEffect(() => {
        if (waitSave) {
            if (!culqiResult.loading && !culqiResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(culqiResult.code || "success") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                onTrigger();
            }
            else if (culqiResult.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(culqiResult.code || "error_unexpected_db_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [culqiResult, waitSave])

    const getImgUrl = (file: File | string | null): string | null => {
        try {
            if (!file) {
                return null;
            }
            else {
                if (typeof file === "string") {
                    return file;
                }

                if (typeof file === "object") {
                    return URL.createObjectURL(file);
                }
            }

            return null;
        } catch (error) {
            return null;
        }
    }

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

    const onChangeChatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) {
            return;
        }
        else {
            setValue("invoicereferencefile", String(getImgUrl(e.target.files[0])))
            setChatButton(e.target.files[0]);
        }
    }

    const handleChatButtonClick = () => {
        const input = document.getElementById('chatBtnInput');
        input!.click();
    }

    const handleChatButtonClean = () => {
        if (!chatButton) {
            return;
        }
        else {
            const input = document.getElementById('chatBtnInput') as HTMLInputElement;
            input.value = "";
            setValue('invoicereferencefile', '');
            setChatButton(null);
        }
    }

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
    const [pageSelected, setPageSelected] = useState(0);
    const [amountTax, setAmountTax] = useState(0);
    const [amountTotal, setAmountTotal] = useState(0);

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
                            var corporationdata = corpList.data.find((x: { corpid: any; }) => x.corpid === data?.row.corpid);
                            
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
                    var productInformationList: Partial<unknown> [] = [];

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
            invoicecreatedate: new Date().toISOString().split('T')[0],
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
        register('invoicepurchaseorder', { validate: (value) => (value === '' || value.length <= 15) || "" + t(langKeys.validation15char) });
        register('invoicecomments', { validate: (value) => (value === '' || value.length <= 150) || "" + t(langKeys.validation150char) });
        register('autosendinvoice');
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
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    useEffect(() => {
        if (waitSave) {
            if (!culqiResult.loading && !culqiResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(culqiResult.code || "success") }))
                dispatch(showBackdrop(false));
                fetchData();
                setViewSelected('view-1');
                setWaitSave(false);
            }
            else if (culqiResult.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(culqiResult.code || "error_unexpected_db_error") }))
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
                            handleClick={(id) => {setViewSelected(id); fetchData();}}
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
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type='submit'
                            onClick={() => setValue('onlyinsert', true)}
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.saveasdraft)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type='submit'
                            onClick={() => setValue('onlyinsert', false)}
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
                            value={t(langKeys.billingtypevalidation)+((getValues('corpid') && getValues('orgid')) ? t(langKeys.organization) : ((getValues('corpid')) ? t(langKeys.corporation) : ''))}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.corporation)}
                            loading={corpList.loading}
                            onChange={(value) => { onCorpChange(value); }}
                            className="col-6"
                            valueDefault={getValues('corpid')}
                            data={corpList.data}
                            optionDesc="description"
                            optionValue="corpid"
                            error={errors?.corpid?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.organization)}
                            loading={orgList.loading}
                            onChange={(value) => { onOrgChange(value); }}
                            className="col-6"
                            valueDefault={getValues('orgid')}
                            data={orgList.data}
                            optionDesc="orgdesc"
                            optionValue="orgid"
                            disabled={(getValues('billbyorg') === false)}
                            error={errors?.orgid?.message}
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
                        <AntTab label={t(langKeys.billinginvoicedata)}/>
                    </Tabs>
                    {pageSelected === 0  && <div className={classes.containerDetail}>
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
                                valueDefault={getValues('clientcredittype')}
                                data={creditTypeList.data}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                                error={errors?.clientcredittype?.message}
                                uset={true}
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
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        valueDefault={getValues(`productdetail.${i}.productdescription`)}
                                                        error={errors?.productdetail?.[i]?.productdescription?.message}
                                                        onChange={(value) => setValue(`productdetail.${i}.productdescription`, "" + value)}
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
                                                        type='number'
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
                                                        type='number'
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
const MessagingPackages: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : [];
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : [];
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);
    
    const [dataBalance, setDataBalance] = useState<Dictionary[]>([]);
    const [disableSearch, setdisableSearch] = useState(false);
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
    const operationType = [{ value: "ENVIO", description: t(langKeys.ENVIO) }, { value:"COMPRA", description: t(langKeys.COMPRA) }]

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
        if (!mainResult.mainData.loading && !mainResult.mainData.error) {
            setDataBalance(mainResult.mainData.data);
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
                accessor: 'type',
                Cell: (props: any) => {
                    const { type } = props.cell.row.original;
                    return t(type);
                }
            },
            {
                Header: t(langKeys.transactionreference),
                accessor: 'description',
                Cell: (props: any) => {
                    const { description } = props.cell.row.original;
                    return (description || t(langKeys.none));
                }
            },
            {
                Header: t(langKeys.quantity),
                accessor: 'amount',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { amount } = props.cell.row.original;
                    return formatNumberFourDecimals(amount || 0);
                }
            },
            {
                Header: t(langKeys.transactionbalance),
                accessor: 'balance',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { balance } = props.cell.row.original;
                    return formatNumberFourDecimals(balance || 0);
                }
            },
            {
                Header: t(langKeys.transactionoperationtype),
                accessor: 'operationtype',
                Cell: (props: any) => {
                    const { operationtype } = props.cell.row.original;
                    return t(operationtype);
                }
            },
            {
                Header: t(langKeys.template),
                accessor: 'messagetemplatedesc',
                Cell: (props: any) => {
                    const { messagetemplatedesc } = props.cell.row.original;
                    return (messagetemplatedesc || t(langKeys.none));
                }
            },
            {
                Header: t(langKeys.documenttype),
                accessor: 'documenttype',
                Cell: (props: any) => {
                    const invoicetype = props.cell.row.original.invoicetype;
                    return t(getInvoiceType(invoicetype));
                }
            },
            {
                Header: t(langKeys.billingvoucher),
                accessor: 'documentnumber',
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = (props.cell.row.original.serie ? props.cell.row.original.serie : 'X000') + '-' + (props.cell.row.original.correlative ? props.cell.row.original.correlative.toString().padStart(8, '0') : '00000000');
                    return (
                        <Fragment>
                            <div>
                                { (urlpdf ?
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
                                onChange={(value) => setdataMain(prev => ({...prev, corpid: value?.corpid || 0, orgid: 0}))}
                                data={dataCorpList}
                                optionDesc="description"
                                optionValue="corpid"
                                disabled={user?.roledesc === "ADMINISTRADOR"}
                            />
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.orgid}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({...prev, orgid: value?.orgid || 0}))}
                                data={dataOrgList.filter((e:any)=>{ return e.corpid === dataMain.corpid })}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                            />
                            <FieldSelect
                                label={t(langKeys.transactionmessagetype)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.type}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({...prev, type: value?.value || ''}))}
                                data={transactionType}
                                optionDesc="description"
                                optionValue="value"
                            />
                            <FieldSelect
                                label={t(langKeys.transactionoperationtype)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.operationtype}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({...prev, operationtype: value?.value || ''}))}
                                data={operationType}
                                optionDesc="description"
                                optionValue="value"
                            />
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
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
                    loading={mainResult.mainData.loading}
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
    const exchangeRequest = useSelector(state => state.culqi.requestGetExchangeRate);
    const mainResult = useSelector(state => state.main);
    const multiResult = useSelector(state => state.main.multiDataAux);
    const user = useSelector(state => state.login.validateToken.user);

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
    const [detractionAlert, setDetractionAlert] = useState(false);
    const [detractionAmount, setDetractionAmount] = useState(0);
    const [messagingList, setMessagingList] = useState<any>([]);
    const [priceSms, setPriceSms] = useState(0);
    const [priceMail, setPriceMail] = useState(0);
    const [priceHsm, setPriceHsm] = useState(0);
    const [balanceSent, setBalanceSent] = useState<any>([]);
    const [paymentTax, setPaymentTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleCulqiSuccess = () => {
        fetchData();
        setViewSelected("view-1");
    }

    useEffect(() => {
        setMessagingList({ loading: true, data: [] });
        setCorpList({ loading: true, data: [] });
        setOrgList({ loading: false, data: [] });

        dispatch(getMultiCollectionAux([getCorpSel(user?.roledesc === "ADMINISTRADOR" ? user?.corpid : 0), getBillingMessagingCurrent(new Date().getFullYear(), new Date().getMonth(), user?.countrycode || '')]));

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
    }, [multiResult]);

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
                        setTotalPay(Math.round(((((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0))) - (((buyAmount || 0) * (1 + (mainResult.mainData.data[0].igv || 0))) * (mainResult.mainData.data[0].detraction || 0))) + Number.EPSILON) * 100) / 100);                                 ;
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
                            handleClick={(id) => {setViewSelected(id); fetchData();}}
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
                        {(publicKey && showCulqi) &&
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
                                    type='number'
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
                                    value={'$'+formatNumber(paymentTax || 0)}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.billingtaxes)}
                                    value={'$'+formatNumber(data?.row?.taxes || 0)}
                                />
                            )}
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$'+formatNumber((totalAmount || 0))}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$'+formatNumber((data?.row?.amount || 0))}
                                />
                            )}
                        </div>}
                        <div className="row-zyx">
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionlastbalance)}
                                    value={'$'+formatNumber(beforeAmount || 0)}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionlastbalance)}
                                    value={'$'+formatNumber((data?.row?.balance - data?.row?.amount) || 0)}
                                />
                            )}
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$'+formatNumber((totalAmount || 0))}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.totalamount)}
                                    value={'$'+formatNumber((data?.row?.amount || 0))}
                                />
                            )}
                            {data?.edit ? (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionafterbalance)}
                                    value={'$'+formatNumber(afterAmount || 0)}
                                />
                            ) : (
                                <FieldView
                                    className="col-4"
                                    label={t(langKeys.transactionafterbalance)}
                                    value={'$'+formatNumber(data?.row?.balance || 0)}
                                />
                            )}
                        </div>
                    </div>}
                    {disableInput && <div>
                        {(data?.edit || data?.row?.operationtype === "COMPRA") && <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.payment_information)}
                            />
                        </div>}
                        {(data?.edit || data?.row?.operationtype === "COMPRA") && <div className="row-zyx">
                            {data?.edit && <FieldView
                                className="col-4"
                                label={t(langKeys.servicedescription)}
                                value={t(langKeys.transactionrechargetitle) + new Date().toISOString().split('T')[0]}
                            />}
                            {data?.row?.operationtype === "COMPRA" && <FieldView
                                className="col-4"
                                label={t(langKeys.servicedescription)}
                                value={t(langKeys.transactionrechargetitle) + new Date(data?.row?.createdate).toISOString().split('T')[0]}
                            />}
                            {data?.edit && <FieldView
                                className="col-4"
                                label={t(langKeys.totalamount)}
                                value={'$'+formatNumber((totalAmount || 0))}
                            />}
                            {data?.row?.operationtype === "COMPRA" && <FieldView
                                className="col-4"
                                label={t(langKeys.totalamount)}
                                value={'$'+formatNumber((data?.row?.amount || 0))}
                            />}
                            {data?.edit && <FieldView
                                className="col-4"
                                label={t(langKeys.totaltopay)}
                                value={'$'+formatNumber((totalPay || 0))}
                            />}
                            {data?.row?.operationtype === "COMPRA" && <FieldView
                                className="col-4"
                                label={t(langKeys.totaltopay)}
                                value={'$'+formatNumber((data?.row?.culqiamount || 0))}
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
                                                    value={new Date(file?.createdate).toISOString().replace("T"," ").substring(0, 19)}
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
                                value={'$'+formatNumberFourDecimals((priceSms || 0))}
                            />
                            <FieldView
                                className="col-4"
                                label={t(langKeys.pricemessagemail)}
                                value={'$'+formatNumberFourDecimals((priceMail || 0))}
                            />
                            <FieldView
                                className="col-4"
                                label={t(langKeys.pricemessagehsm)}
                                value={'$'+formatNumberFourDecimals((priceHsm || 0))}
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

const Invoice: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const countryListreq = useSelector(state => state.signup.countryList);
    const multiData = useSelector(state => state.main.multiData);
    const user = useSelector(state => state.login.validateToken.user);

    const [countryList, setcountryList] = useState<any>([]);
    const [dataPaymentPlan, setdataPaymentPlan] = useState<any>([]);
    const [dataPlan, setdataPlan] = useState<any>([]);
    const [pageSelected, setPageSelected] = useState(0);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);

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
        if(!multiData.loading && sentfirstinfo) {
            setsentfirstinfo(false);
            setdataPlan(multiData.data[0] && multiData.data[0].success? multiData.data[0].data : []);
            setdataPaymentPlan(multiData.data[3] && multiData.data[3].success? multiData.data[3].data : []);
        }
    }, [multiData])

    useEffect(() => {
        if(!countryListreq.loading && countryListreq.data.length){
            setcountryList(countryListreq.data)
        }
    }, [countryListreq])

    useEffect(()=>{
        setsentfirstinfo(true)
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
    },[])

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
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 16 }}>
                        <CostPerPeriod dataPlan={multiData}/>
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 16 }}>
                        <PeriodReport dataPlan={multiData} customSearch={customSearch}/>
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 16 }}>
                        <Payments dataPlan={multiData} setCustomSearch={setCustomSearch}/>
                    </div>
                }
                {pageSelected === 3 &&
                    <div style={{ marginTop: 16 }}>
                        <Billing dataPlan={multiData}/>
                    </div>
                }
                {pageSelected === 4 &&
                    <div style={{ marginTop: 16 }}>
                        <MessagingPackages dataPlan={multiData}/>
                    </div>
                }
            </div>}
            {user?.roledesc === "ADMINISTRADOR" && <div>
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
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 16 }}>
                        <PeriodReport dataPlan={multiData} customSearch={customSearch}/>
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 16 }}>
                        <Payments dataPlan={multiData} setCustomSearch={setCustomSearch}/>
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 16 }}>
                        <MessagingPackages dataPlan={multiData}/>
                    </div>
                }
            </div>}
        </div>
        
    );
}

export default Invoice;