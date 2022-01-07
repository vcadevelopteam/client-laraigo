/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldMultiSelect, DialogZyx } from 'components';
import { selInvoice, insInvoice, cancelInvoice, getLocaleDateString, selInvoiceClient, selInvoiceChangePaymentStatus, regenerateInvoice, getBillingPeriodSel, billingPeriodUpd, getPlanSel, getOrgSelList, getCorpSel, getPaymentPlanSel, getBillingPeriodCalcRefreshAll, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp, billingpersonreportsel, billinguserreportsel, getBillingPeriodCalc, exportExcel } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import ClearIcon from '@material-ui/icons/Clear';
import { getCollection, getMultiCollection, execute, exportData } from 'store/main/actions';
import { sendInvoice } from 'store/culqi/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Box, FormHelperText, Grid, IconButton, MenuItem, Tabs, TextField } from '@material-ui/core';
import * as locale from "date-fns/locale";
import Menu from '@material-ui/core/Menu';
import { DownloadIcon } from 'icons';
import {
    Close,
    CloudUpload,
    Search as SearchIcon,
    Refresh as RefreshIcon,
} from '@material-ui/icons';
import PaymentIcon from '@material-ui/icons/Payment';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Visibility from '@material-ui/icons/Visibility';
import MoreVert from '@material-ui/icons/MoreVert';
import Fab from '@material-ui/core/Fab';
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

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: Dictionary | null;
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

const datatotalize = [{value:1,description: "CORPORATION"},{value:2,description: "ORGANIZATION"}]

const datacurrency = [{value:"PEN",description: "PEN"},{value:"USD",description: "USD"}]

const datapaymentstatus = [{value:"PENDING",description: "PENDING"},{value:"PAID",description: "PAID"}]

const years = [{desc:"2010"},{desc:"2011"},{desc:"2012"},{desc:"2013"},{desc:"2014"},{desc:"2015"},{desc:"2016"},{desc:"2017"},{desc:"2018"},{desc:"2020"},{desc:"2021"},{desc:"2022"},{desc:"2023"},{desc:"2024"},{desc:"2025"}]

const months =[{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" },]

function formatNumber(num: number) {
    if (num)
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}

function formatNumberNoDecimals(num: number) {
    if (num)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}

const getImgUrl = (file: File | string | null): string | null => {
    if (!file) return null;

    try {
        if (typeof file === "string") {
            return file;
        } else if (typeof file === "object") {
            return URL.createObjectURL(file);
        }
        return null;
    } catch (ex) {
        console.error(ex);
        return null;
    }
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
        // flex: '1 1 250px'
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
}));

const isEmpty = (str?: string) => {
    return !str || str.length === 0;
}

const invocesBread = [
    { id: "view-1", name: "Invoices" },
    { id: "view-2", name: "Invoice detail" }
];

const YEARS = [{ desc: "2010" }, { desc: "2011" }, { desc: "2012" }, { desc: "2013" }, { desc: "2014" }, { desc: "2015" }, { desc: "2016" }, { desc: "2017" }, { desc: "2018" }, { desc: "2020" }, { desc: "2021" }, { desc: "2022" }, { desc: "2023" }, { desc: "2024" }, { desc: "2025" }]
const MONTHS = [{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" },]

const statusToEdit = ["DRAFT", "INVOICED", "ERROR", "CANCELED"];

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

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingPeriodSel(dataMain)))
    }

    useEffect(() => {
        search()
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading){
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'billingsupportid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            editFunction={() => handleEdit(row)}
                        />
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
                    return (totalcharge || 0).toFixed(2);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingPeriodSel(dataMain)));

    useEffect(() => {
        setdisableSearch(dataMain.year === "" ) 
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
            dispatch(execute(getBillingPeriodCalcRefreshAll(0)));
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
                    ButtonsElement={() => (
                        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{width: 140}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                                data={years}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 214}}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
                                data={months}
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
            totalcharge: row?.totalcharge||0
        }
    });

    React.useEffect(() => {
        register('corpid');
        register('orgid');
        register('year');
        register('month');
        register('billingplan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('supportplan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basicfee');
        register('userfreequantity');
        register('useradditionalfee');
        register('channelfreequantity');
        register('channelwhatsappfee');
        register('channelotherfee');
        register('clientfreequantity');
        register('clientadditionalfee');
        register('supportbasicfee');
        register('additionalservicename1');
        register('additionalservicefee1');
        register('additionalservicename2');
        register('additionalservicefee2');
        register('additionalservicename3');
        register('additionalservicefee3');
        register('force');
        register('totalcharge');
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
                            handleClick={setViewSelected}
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
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.generalinformation)}/>
                    <AntTab label={t(langKeys.agent_plural)}/>
                    <AntTab label={t(langKeys.channel_plural)}/>
                    <AntTab label={t(langKeys.conversation)}/>
                    <AntTab label={t(langKeys.contact_plural)}/>
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
                            onChange={(value) => setValue('billingplan',value.plan)}
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
                            label={t(langKeys.supportplan)}
                            className="col-6"
                            valueDefault={getValues("supportplan")}
                            variant="outlined"
                            onChange={(value) => setValue('supportplan',value.description)}
                            data={dataPlanList}
                            error={errors?.supportplan?.message}
                            optionDesc="description"
                            optionValue="description"
                        /> :
                            <FieldView
                            className="col-6"
                            label={t(langKeys.supportplan)}
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
                            value={getValues('supportbasicfee').toFixed(2)}
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.totalcharge)}
                            value={getValues('totalcharge')}
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
                                value={getValues('useradditionalfee').toFixed(2)}
                            />
                        }
                        <FieldView
                            className="col-6"
                            label={t(langKeys.useradditionalcharge)}
                            value={getValues("useradditionalcharge").toFixed(2)}
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
                                value={getValues('channelfreequantity').toFixed(2)}
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
                                value={getValues('channelwhatsappfee').toFixed(2)}
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
                            value={getValues("channelcharge").toFixed(2)}
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
                            label={t(langKeys.conversationcompanywhatquantity)}
                            value={getValues("conversationcompanywhatquantity").toString()}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatfee)}
                            value={getValues("conversationcompanywhatfee").toFixed(2)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatcharge)}
                            value={getValues("conversationcompanywhatcharge").toFixed(2)}
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
                            label={t(langKeys.conversationclientwhatfee)}
                            value={getValues("conversationclientwhatfee").toFixed(2)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationclientwhatcharge)}
                            value={getValues("conversationclientwhatcharge").toFixed(2)}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationwhatcharge)}
                            value={getValues("conversationwhatcharge").toFixed(2)}
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
                                value={getValues("clientadditionalfee").toFixed(2)}
                            />
                        }
                        <FieldView
                            className="col-6"
                            label={t(langKeys.clientadditionalcharge)}
                            value={getValues("clientadditionalcharge").toFixed(2)}
                        />
                    </div>
                </div>}
                {pageSelected === 5  && <div className={classes.containerDetail}>
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
                                value={getValues("additionalservicefee1").toFixed(2)}
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
                                value={getValues("additionalservicefee2").toFixed(2)}
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
                                value={getValues("additionalservicefee3").toFixed(2)}
                            />
                        }
                    </div>
                </div>}
            </form>
        </div>
    );
}

const PeriodReport: React.FC <{ dataPlan: any, setPageSelected (param: any): void }> = ({ dataPlan, setPageSelected }) => {
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
            dispatch(execute(getBillingPeriodCalcRefreshAll(0)));
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
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => exportExcel(String(t(langKeys.periodreport) || '') + "Report", mainResult.mainData.data)}
                                startIcon={<DownloadIcon />}
                            >{`${t(langKeys.download)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"                            
                                style={{marginRight: 10}}
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
                <div style={{width:"100%"}}>
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
                        <TableContainer component={Paper}>
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
                        <TableContainer component={Paper}>
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

const Payments: React.FC <{ dataPlan: any, setPageSelected (param: any): void }> = ({ dataPlan, setPageSelected }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : [];
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : [];
    const executeRes = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const user = useSelector(state => state.login.validateToken.user);
    //const multiData = useSelector(state => state.main.multiData);

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
    const [waitSave, setWaitSave] = useState(false);

    const fetchData = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const search = () => dispatch(getCollection(selInvoiceClient(dataMain)));

    const goToReport = () => {
        setPageSelected(1);
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                    if (row.paymentstatus !== "PENDING")
                        return null;
                    return (
                        <CulqiModal
                            type="CHARGE"
                            invoiceid={row.invoiceid}
                            title={t(row.docnumber)}
                            description=""
                            currency={row.currency}
                            amount={row.totalamount * 100}
                            callbackOnSuccess={search}
                        ></CulqiModal>
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
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatus',
            },
            {
                Header: t(langKeys.gotoreport),
                accessor: 'invoiceid',
                Cell: (props: any) => {
                    return (
                        <Fragment>
                            <div>
                                {<span onClick={goToReport} style={{ display: "block", cursor: "pointer", color: "blue", textDecoration: "underline" }}>{t(langKeys.gotoreport)}</span>}
                            </div>
                        </Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: 'docnumber',
                Cell: (props: any) => {
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = props.cell.row.original.docnumber;
                    return (
                        <Fragment>
                            <div>
                                { (urlpdf ?
                                    <a href={urlpdf} target="_blank" style={{ display: "block" }} rel="noreferrer">{docnumber}</a>
                                    :
                                    <b style={{ display: "block" }}>{`${docnumber}0000`}</b>)
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
                                    <a href={urlxml} target="_blank" style={{ display: "block" }} rel="noreferrer">{t(langKeys.xmldocument)}</a>
                                    :
                                    <b style={{ display: "block" }}>{t(langKeys.pendingpayment)}</b>)
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
                                    <a href={urlcdr} target="_blank" style={{ display: "block" }} rel="noreferrer">{t(langKeys.cdrdocument)}</a>
                                    :
                                    <b style={{ display: "block" }}>{t(langKeys.pendingpayment)}</b>)
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
            <TableZyx
                columns={columns}
                ButtonsElement={() => (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <FieldSelect
                            label={t(langKeys.year)}
                            style={{width: 140}}
                            valueDefault={dataMain.year}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                            data={years}
                            optionDesc="desc"
                            optionValue="desc"
                        />
                        <FieldMultiSelect
                            label={t(langKeys.month)}
                            style={{width: 214}}
                            valueDefault={dataMain.month}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
                            data={months}
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
                            data={datacurrency}
                            optionDesc="description"
                            optionValue="value"
                        />
                        <FieldSelect
                            label={t(langKeys.paymentstatus)}
                            className={classes.fieldsfilter}
                            valueDefault={dataMain.paymentstatus}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,paymentstatus:value?.value||''}))}
                            data={datapaymentstatus}
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
                // titlemodule={t(langKeys.billingplan, { count: 2 })}
                data={dataInvoice}
                filterGeneral={false}
                loading={mainResult.mainData.loading}
                download={true}
                register={false}
            />
        )
    } else {
        return (
            <BillingDetail
                fetchData={fetchData}
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        );
    }
}

const Billing: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : [];
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : [];
    const executeRes = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const user = useSelector(state => state.login.validateToken.user);
    //const multiData = useSelector(state => state.main.multiData);

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
    const [functiontrigger, setfunctiontrigger] = useState('');
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);
    const [waitSend, setWaitSend] = useState(false);

    const fetchData = () => dispatch(getCollection(selInvoice(dataMain)));

    const search = () => dispatch(getCollection(selInvoice(dataMain)));

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        setdisableSearch(dataMain.year === "" ) 
    }, [dataMain])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                const message = functiontrigger === 'generate' ? "La factura se generó correctamente." : "Factura anulada correctamente";
                dispatch(showSnackbar({ show: true, success: true, message }))
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
                accessor: 'billingsupportid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                size="small"
                                onClick={() => handleView(row)}
                            >
                                <Visibility style={{ color: '#B6B4BA' }} />
                            </IconButton>
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
                Header: t(langKeys.documenttype),
                accessor: 'receiverdoctype',
                Cell: (props: any) => {
                    const receiverdoctype = props.cell.row.original.receiverdoctype;
                    return (
                        <Fragment>
                            <div>
                                { (receiverdoctype == '6' ?
                                    <span style={{ display: "block" }}>{t(langKeys.emissorinvoice)}</span>
                                    :
                                    <span style={{ display: "block" }}>{t(langKeys.emissorticket)}</span>)
                                }
                            </div>
                        </Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.bussinessname),
                accessor: 'receiverbusinessname',
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: 'receiverdocnum',
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
            },
            {
                Header: t(langKeys.amount),
                accessor: 'totalamount',
                type: 'number',
            },
            {
                Header: t(langKeys.invoicestatus),
                accessor: 'invoicestatus',
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatus',
            },
        ],
        []
    );

    const handleCancel = (row: Dictionary) => {
        setfunctiontrigger("cancel")
        const callback = () => {
            dispatch(execute(cancelInvoice(row.invoiceid)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.cancelinvoice),
            callback
        }))
    }

    const handleGenerate = (row: Dictionary) => {
        setfunctiontrigger("generate")
        const callback = () => {
            dispatch(execute(regenerateInvoice({ invoiceid: row.invoiceid })));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.regenerateinvoice),
            callback
        }))
    }

    const handleSend = (row: Dictionary) => {
        const callback = () => {
            dispatch(sendInvoice(row.invoiceid));
            dispatch(showBackdrop(true));
            setWaitSend(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.sendinvoice),
            callback
        }))
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected(row);
    }
    
    if (viewSelected === "view-1") {
        return (
            <TableZyx
                columns={columns}
                ButtonsElement={() => (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <FieldSelect
                            label={t(langKeys.year)}
                            style={{width: 140}}
                            valueDefault={dataMain.year}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                            data={years}
                            optionDesc="desc"
                            optionValue="desc"
                        />
                        <FieldMultiSelect
                            label={t(langKeys.month)}
                            style={{width: 214}}
                            valueDefault={dataMain.month}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
                            data={months}
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
                            data={datacurrency}
                            optionDesc="description"
                            optionValue="value"
                        />
                        <FieldSelect
                            label={t(langKeys.paymentstatus)}
                            className={classes.fieldsfilter}
                            valueDefault={dataMain.paymentstatus}
                            variant="outlined"
                            onChange={(value) => setdataMain(prev=>({...prev,paymentstatus:value?.value||''}))}
                            data={datapaymentstatus}
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
                data={dataInvoice}
                filterGeneral={false}
                loading={mainResult.mainData.loading}
                download={true}
                register={false}
            />
        )
    } else {
        return (
            <BillingDetail
                fetchData={fetchData}
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        );
    }
}

const BillingDetail: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);
    
    const [openModal, setOpenModal] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const { handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            invoiceid: data?.invoiceid || 0,
            filenumber: data?.filenumber || '',
            purchaseorder: data?.purchaseorder || '',
            executingunitcode: data?.executingunitcode || '',
            selectionprocessnumber: data?.selectionprocessnumber || '',
            contractnumber: data?.contractnumber || '',
            comments: data?.comments || '',
            paymentnote: data?.paymentnote || "",
            paymentfile: ""
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
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


    const onSubmit = handleSubmit((row) => {
        const callback = () => {
            dispatch(execute(insInvoice({ ...data!!, ...row })));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onPaid = () => {
        fetchData();
        setOpenModal(false);
        setViewSelected("view-1");
    }

    return (
        <div style={{ width: '100%' }}>
            <div>
                <PaymentComp
                    data={data}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    onTrigger={onPaid}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={invocesBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={data?.description}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {data?.paymentstatus === "PENDING" &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                startIcon={<PaymentIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                onClick={() => setOpenModal(true)}
                            >{t(langKeys.regulatepayment)}
                            </Button>
                        }
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: 16 }}>
                    <div className={classes.container}>
                        <div className={classes.containerField}>
                            <div className={classes.titleCard}>{t(langKeys.clientinformation)}</div>
                            <FieldView
                                label={t(langKeys.docType)}
                                value={data?.receiverdoctype}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.documentnumber)}
                                value={data?.receiverdocnum}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.bussinessname)}
                                value={data?.receiverbusinessname}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.address)}
                                value={data?.receiverfiscaladdress}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.country)}
                                value={data?.receivercountry}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.email)}
                                value={data?.receivermail}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div className={classes.titleCard}>{t(langKeys.invoiceinformation)}</div>
                            <FieldView
                                label={t(langKeys.documentnumber)}
                                value={data?.serie + " - " + (data?.correlative || "")}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.invoicedate)}
                                value={data?.invoicedate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.dueDate)}
                                value={data?.expirationdate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.totalamount)}
                                value={data?.totalamount}
                                className={classes.fieldView}
                            />

                            <FieldView
                                label={t(langKeys.currency)}
                                value={data?.currency}
                                className={classes.fieldView}
                            />
                            <div>
                                <a href={data?.urlpdf} target="_blank" rel="noreferrer">{t(langKeys.urlpdf)}</a>
                            </div>
                            <div>
                                <a href={data?.urlcdr} target="_blank" rel="noreferrer">{t(langKeys.urlcdr)}</a>
                            </div>
                            <div>
                                <a href={data?.urlxml} target="_blank" rel="noreferrer">{t(langKeys.urlxml)}</a>
                            </div>
                        </div>
                        <div className={classes.containerField} style={{ position: 'relative' }}>
                            <div className={classes.titleCard}>{t(langKeys.additional_information)}</div>
                            {statusToEdit.includes(data?.invoicestatus) ? (
                                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <Fab
                                        onClick={onSubmit}
                                        type="submit"
                                        size="small"
                                        style={{ position: 'absolute', top: 8, right: 8, zIndex: 99999, backgroundColor: '#fff' }}
                                    >
                                        <SaveIcon color="primary" />
                                    </Fab>
                                    <FieldEdit
                                        label={t(langKeys.filenumber)}
                                        className="col-6"
                                        type="number"
                                        valueDefault={getValues('filenumber')}
                                        onChange={(value) => setValue('filenumber', parseInt(value || "0"))}
                                        error={errors?.filenumber?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.purchaseorder)}
                                        className="col-6"
                                        valueDefault={getValues('purchaseorder')}
                                        onChange={(value) => setValue('purchaseorder', value)}
                                        error={errors?.purchaseorder?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.executingunitcode)}
                                        className="col-6"
                                        valueDefault={getValues('executingunitcode')}
                                        onChange={(value) => setValue('executingunitcode', value)}
                                        error={errors?.executingunitcode?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.selectionprocessnumber)}
                                        className="col-6"
                                        valueDefault={getValues('selectionprocessnumber')}
                                        onChange={(value) => setValue('selectionprocessnumber', value)}
                                        error={errors?.selectionprocessnumber?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.contractnumber)}
                                        className="col-6"
                                        valueDefault={getValues('contractnumber')}
                                        onChange={(value) => setValue('contractnumber', value)}
                                        error={errors?.contractnumber?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.comments)}
                                        className="col-6"
                                        valueDefault={getValues('comments')}
                                        onChange={(value) => setValue('comments', value)}
                                        error={errors?.comments?.message}
                                    />
                                </form>
                            ) : (
                                <>

                                    <FieldView
                                        label={t(langKeys.filenumber)}
                                        value={data?.filenumber}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.purchaseorder)}
                                        value={data?.purchaseorder}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.executingunitcode)}
                                        value={data?.executingunitcode}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.selectionprocessnumber)}
                                        value={data?.selectionprocessnumber}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.contractnumber)}
                                        value={data?.contractnumber}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.comments)}
                                        value={data?.comments}
                                        className={classes.fieldView}
                                    />
                                </>
                            )}
                        </div>
                        <div className={classes.containerField}>
                            <div className={classes.titleCard}>{t(langKeys.paymentinformation)}</div>
                            <FieldView
                                label={t(langKeys.paymentstatus)}
                                value={data?.paymentstatus}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.paymentdate)}
                                value={data?.paymentdate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.paidby)}
                                value={data?.paidby}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.email)}
                                value={data?.email}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.id_payment)}
                                value={data?.orderid}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.paymentnote)}
                                value={data?.paymentnote}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.paymentfile)}
                                value={data?.paymentfile}
                                className={classes.fieldView}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

const PaymentComp: FC<{ data: any, openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();
    
    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);
    const resInvoice = useSelector(state => state.culqi.request);
    
    const [chatBtn, setChatBtn] = useState<File | string | null>(null);
    const [waitSave, setWaitSave] = useState(false);
    const [waitSend, setWaitSend] = useState(false);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            invoiceid: data?.invoiceid || 0,
            paymentnote: '',
            paymentfile: ""
        }
    });

    const chatImgUrl = getImgUrl(chatBtn);

    const mandatoryFileField = (value: string | File | null) => {
        return !value ? t(langKeys.field_required) : undefined;
    }

    React.useEffect(() => {
        register('invoiceid');
        register('paymentnote', { validate: mandatoryFileField });
        register('paymentfile', { validate: mandatoryFileField });
    }, [register]);

    useEffect(() => {
        if (waitSend) {
            if (!executeRes.loading && !executeRes.error) {
                setWaitSave(false);
                setWaitSave(true);
                dispatch(sendInvoice(data.invoiceid));
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                setWaitSend(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSend])

    useEffect(() => {
        if (waitSave) {
            if (!resInvoice.loading && !resInvoice.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setWaitSend(false);
                onTrigger();
            }
            else if (executeRes.error) {
                const errormessage = t(resInvoice.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                setWaitSend(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [resInvoice, waitSave])

    const onSubmit = handleSubmit((dataf) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(selInvoiceChangePaymentStatus(dataf)));
            setWaitSend(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onChangeChatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setChatBtn(e.target.files[0]);
        setValue("paymentfile", String(getImgUrl(e.target.files[0])))
    }

    const handleChatBtnClick = () => {
        const input = document.getElementById('chatBtnInput');
        input!.click();
    }

    const handleCleanChatInput = () => {
        if (!chatBtn) return;
        const input = document.getElementById('chatBtnInput') as HTMLInputElement;
        input.value = "";
        setChatBtn(null);
        setValue('paymentfile', "");
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.pay)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <FieldEdit
                label={t(langKeys.paymentnote)}
                valueDefault={getValues('paymentnote')}
                error={errors?.paymentnote?.message}
                onChange={(value) => setValue('paymentnote', value)}
                className="col-12"
            />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <label className={classes.text}>
                                {t(langKeys.evidenceofpayment)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {chatImgUrl && <img src={chatImgUrl} alt="icon button" className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="chatBtnInput"
                                        type="file"
                                        onChange={onChangeChatInput}
                                    />
                                    <IconButton onClick={handleChatBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanChatInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                            <FormHelperText error={!isEmpty(errors?.paymentfile?.message)} style={{ marginLeft: 14 }}>
                                {errors?.paymentfile?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </DialogZyx>
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
    const [pageSelected, setPageSelected] = useState(user?.roledesc === "SUPERADMIN" ? 0 : 1);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);

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
        dispatch(getMultiCollection([
            getPlanSel(),
            getOrgSelList(0),
            getCorpSel(0),
            getPaymentPlanSel(),
        ]));
    },[])

    return (
        <div style={{ width: '100%' }}>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.costperperiod)} />
                }
                {(user?.roledesc === "SUPERADMIN" || user?.roledesc === "ADMIN") && 
                    <AntTab label={t(langKeys.periodreport)} />
                }
                {(user?.roledesc === "SUPERADMIN" || user?.roledesc === "ADMIN") && 
                    <AntTab label={t(langKeys.payments)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.invoice)} />
                }
            </Tabs>
            {pageSelected === 0 &&
                <div style={{ marginTop: 16 }}>
                    <CostPerPeriod dataPlan={multiData}/>
                </div>
            }
            {pageSelected === 1 &&
                <div style={{ marginTop: 16 }}>
                    <PeriodReport dataPlan={multiData} setPageSelected={setPageSelected}/>
                </div>
            }
            {pageSelected === 2 &&
                <div style={{ marginTop: 16 }}>
                    <Payments dataPlan={multiData} setPageSelected={setPageSelected}/>
                </div>
            }
            {pageSelected === 3 &&
                <div style={{ marginTop: 16 }}>
                    <Billing dataPlan={multiData}/>
                </div>
            }
        </div>
    );
}

export default Invoice;