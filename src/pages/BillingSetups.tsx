/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateSwitch, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldMultiSelect, IOSSwitch } from 'components';
import { billingSupportIns, getBillingConfigurationSel,getBillingPeriodCalc,billingpersonreportsel,billinguserreportsel, getBillingSupportSel, getPlanSel, getPaymentPlanSel, billingConfigurationIns, getBillingConversationSel, billingConversationIns, getBillingNotificationSel, billingNotificationIns, getBillingPeriodSel, getOrgSelList, getCorpSel, getBillingPeriodHSMSel, billingPeriodHSMUpd, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp, getLocaleDateString, getAppsettingInvoiceSel, updateAppsettingInvoice, getValuesFromDomain, getValuesFromDomainCorp } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute,exportData, getMultiCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Box, FormControlLabel, Tabs, TextField, IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core';
import { getCountryList } from 'store/signup/actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import * as locale from "date-fns/locale";
import Paper from '@material-ui/core/Paper';
import { DownloadIcon } from 'icons';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailSupportPlanProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
    dataPlan: any[];
}
interface DetailSupportPlanProps2 {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
    dataPlan: any;
}

const datatotalize = [{value:1,description: "CORPORATION"},{value:2,description: "ORGANIZATION"}]

const arrayBreadCostPerHSMPeriod = [
    { id: "view-1", name: "Cost Per HSM Period" },
    { id: "view-2", name: "Cost Per HSM Period detail" }
];

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
function formatNumberNoDecimals(num: number) {
    if (num)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}
const years = [{desc:"2010"},{desc:"2011"},{desc:"2012"},{desc:"2013"},{desc:"2014"},{desc:"2015"},{desc:"2016"},{desc:"2017"},{desc:"2018"},{desc:"2020"},{desc:"2021"},{desc:"2022"},{desc:"2023"},{desc:"2024"},{desc:"2025"}]
const months =[{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" },]

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
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        width: "100%",
        color: 'rgb(143, 146, 161)'
    },
    fieldsfilter: {
        width: 220,
    },
    transparent: {
        color:"transparent",
    },
    commentary: {
        fontStyle:"italic"
    }
}));

const DetailCostPerHSMPeriod: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            orgid: row?.orgid || '',
            corpid: row?.corpid || '',
            orgdesc: row?.orgdesc || '',
            corpdesc: row?.corpdesc || '',
            year: row?.year || 0,
            month: row?.month || 0,
            billingplan: row?.billingplan || '',
            country: row?.country || '',
            hsmquantity: row?.hsmquantity || 0,
            hsmcost: row?.hsmcost || 0,
            hsmutilityfee: row?.hsmutilityfee || 0,
            hsmutility: row?.hsmutility || 0,
            hsmcharge: row?.hsmcharge || 0,
            force: row?.force || true,
        }
    });

    React.useEffect(() => {
        register('corpid');
        register('orgid');
        register('year');
        register('month');
        register('hsmutilityfee');
        register('force');
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
            dispatch(execute(billingPeriodHSMUpd(data)));
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
                            breadcrumbs={arrayBreadCostPerHSMPeriod}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                           title={row? `${row.corpdesc} - ${row.orgdesc}` : ""}
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
                        <FieldView
                            className="col-6"
                            label={t(langKeys.billingplan)}
                            value={getValues("billingplan")}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.country)}
                            value={getValues("country")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.hsmquantity)}
                            value={getValues("hsmquantity").toString()}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.wacost)}
                            value={getValues("hsmcost").toFixed(2)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.pucommissionVCA)}
                            onChange={(value) => setValue('hsmutilityfee', value)}
                            valueDefault={getValues('hsmutilityfee')}
                            error={errors?.hsmutilityfee?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.hsmshippingcost)}
                            value={getValues("hsmcharge").toFixed(2)}
                        />
                        
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.vcacommissioncost)}
                            value={getValues("hsmutility").toFixed(2)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const CostPerHSMPeriod: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [disableSearch, setdisableSearch] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [dataMain, setdataMain] = useState({
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
        corpid: 0,
        orgid: 0,
    });
    const dataPlanList = dataPlan.data[0] && dataPlan.data[0].success? dataPlan.data[0].data : []
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : []
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : []
    useEffect(() => {
        setdisableSearch(dataMain.year === "" ) 
    }, [dataMain])

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingPeriodHSMSel(dataMain)))
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
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.billingplan),
                accessor: 'billingplan',
            },
            {
                Header: t(langKeys.country),
                accessor: 'country',
            },
            {
                Header: t(langKeys.hsmquantity),
                accessor: 'hsmquantity',
                type: 'number',
                sortType: 'number',
            },
            {
                Header: t(langKeys.wacost),
                accessor: 'hsmcost',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { hsmcost } = props.cell.row.original;
                    return (hsmcost || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.pucommissionVCA),
                accessor: 'hsmutilityfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { hsmutilityfee } = props.cell.row.original;
                    return (hsmutilityfee || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.vcacommissioncost),
                accessor: 'hsmutility',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { hsmutility } = props.cell.row.original;
                    return (hsmutility || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.hsmshippingcost),
                accessor: 'hsmcharge',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { hsmcharge } = props.cell.row.original;
                    return (hsmcharge || 0).toFixed(2);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingPeriodHSMSel(dataMain)));


    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
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
                                style={{width: 150}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                                data={years}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 300}}
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
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailCostPerHSMPeriod
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan = {dataPlanList}
            />
        )
    } else
        return null;
}
const PeriodReport: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeCalculate = useSelector(state => state.main.execute);
    const [waitCalculate, setWaitCalculate] = useState(false);
    const classes = useStyles();        
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector(state => state.main.exportData);
    const [datareport, setdatareport] = useState<any>([])
    const [requesttipe, setrequesttipe] = useState(2)
    const [dataMain, setdataMain] = useState({
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        corpid: user?.corpid || 0,
        orgid: user?.orgid || 0,
        totalize: 2,
    });
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : []
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : []

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
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.success) }))
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
            } else if (executeCalculate.error) {
                const message = t(executeCalculate.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message }))
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
            }
        }
    }, [executeCalculate,waitCalculate])

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
    const triggerExportDataCalc = () => {
        dispatch(showBackdrop(true));
        dispatch(execute(getBillingPeriodCalc(dataMain)))
        setWaitCalculate(true);
    };

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
                                style={{marginRight: 10}}
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataPerson()}
                                startIcon={<DownloadIcon />}
                            >
                                {`${t(langKeys.report)} ${t(langKeys.uniquecontacts)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataUser()}
                                startIcon={<DownloadIcon />}
                            >{`${t(langKeys.report)} ${t(langKeys.user_plural)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={resExportData.loading}
                                onClick={() => triggerExportDataCalc()}
                                //startIcon={<DownloadIcon />}
                            >{`${t(langKeys.calculate)}`}
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

const GeneralConfiguration: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const multiResult = useSelector(state => state.main.multiDataAux);
    
    const [domainCurrency, setDomainCurrency] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainDocument, setDomainDocument] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainInvoiceProvider, setDomainInvoiceProvider] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainPaymentProvider, setDomainPaymentProvider] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainPrinting, setDomainPrinting] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [edit, setEdit] = useState(true);
    const [waitSave, setWaitSave] = useState(false);

    const fetchData = () => dispatch(getCollection(getAppsettingInvoiceSel()));

    const [fields, setFields] = useState({
        "method": "UFN_APPSETTING_INVOICE_UPDATE",
        "parameters": {
            "ruc": "",
            "businessname": "",
            "tradename": "",
            "fiscaladdress": "",
            "ubigeo": "",
            "country": "",
            "emittertype": "",
            "currency": "",
            "invoiceserie": "",
            "invoicecorrelative": 0,
            "annexcode": "",
            "igv": 0.00,
            "printingformat": "",
            "xmlversion": "",
            "ublversion": "",
            "returnpdf": false,
            "returnxmlsunat": false,
            "returnxml": false,
            "invoiceprovider": "",
            "sunaturl": "",
            "token": "",
            "sunatusername": "",
            "paymentprovider": "",
            "publickey": "",
            "privatekey": ""
        }
    })

    useEffect(() => {
        fetchData();

        setDomainCurrency({ loading: true, data: [] });
        setDomainDocument({ loading: true, data: [] });
        setDomainInvoiceProvider({ loading: true, data: [] });
        setDomainPaymentProvider({ loading: true, data: [] });
        setDomainPrinting({ loading: true, data: [] });

        dispatch(getMultiCollectionAux([
            getValuesFromDomainCorp('BILLINGCURRENCY', '_CURRENCY', 1, 0),
            getValuesFromDomainCorp('BILLINGDOCUMENTTYPE', '_DOCUMENT', 1, 0),
            getValuesFromDomainCorp('BILLINGINVOICEPROVIDER', '_INVOICEPROVIDER', 1, 0),
            getValuesFromDomainCorp('BILLINGPAYMENTPROVIDER', '_PAYMENTPROVIDER', 1, 0),
            getValuesFromDomainCorp('BILLINGPRINTING', '_PRINTING', 1, 0),
        ]));
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading){
            dispatch(showBackdrop(false));
            if (mainResult.mainData.data) {
                if (mainResult.mainData.data[0]) {
                    setFields({
                        "method": "UFN_APPSETTING_INVOICE_UPDATE",
                        "parameters": {
                            "ruc": mainResult.mainData.data[0].ruc,
                            "businessname": mainResult.mainData.data[0].businessname,
                            "tradename": mainResult.mainData.data[0].tradename,
                            "fiscaladdress": mainResult.mainData.data[0].fiscaladdress,
                            "ubigeo": mainResult.mainData.data[0].ubigeo,
                            "country": mainResult.mainData.data[0].country,
                            "emittertype": mainResult.mainData.data[0].emittertype,
                            "currency": mainResult.mainData.data[0].currency,
                            "invoiceserie": mainResult.mainData.data[0].invoiceserie,
                            "invoicecorrelative": mainResult.mainData.data[0].invoicecorrelative,
                            "annexcode": mainResult.mainData.data[0].annexcode,
                            "igv": mainResult.mainData.data[0].igv,
                            "printingformat": mainResult.mainData.data[0].printingformat,
                            "xmlversion": mainResult.mainData.data[0].xmlversion,
                            "ublversion": mainResult.mainData.data[0].ublversion,
                            "returnpdf": mainResult.mainData.data[0].returnpdf,
                            "returnxmlsunat": mainResult.mainData.data[0].returnxmlsunat,
                            "returnxml": mainResult.mainData.data[0].returnxml,
                            "invoiceprovider": mainResult.mainData.data[0].invoiceprovider,
                            "sunaturl": mainResult.mainData.data[0].sunaturl,
                            "token": mainResult.mainData.data[0].token,
                            "sunatusername": mainResult.mainData.data[0].sunatusername,
                            "paymentprovider": mainResult.mainData.data[0].paymentprovider,
                            "publickey": mainResult.mainData.data[0].publickey,
                            "privatekey": mainResult.mainData.data[0].privatekey
                        }
                    });
                }
            }
        }
    }, [mainResult])

    useEffect(() => {
        const indexDomainCurrency = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_CURRENCY'));

        if (indexDomainCurrency > -1) {
            setDomainCurrency({ loading: false, data: multiResult.data[indexDomainCurrency] && multiResult.data[indexDomainCurrency].success ? multiResult.data[indexDomainCurrency].data : [] });
        }

        const indexDomainDocument = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_DOCUMENT'));

        if (indexDomainDocument > -1) {
            setDomainDocument({ loading: false, data: multiResult.data[indexDomainDocument] && multiResult.data[indexDomainDocument].success ? multiResult.data[indexDomainDocument].data : [] });
        }

        const indexDomainInvoiceProvider = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_INVOICEPROVIDER'));

        if (indexDomainInvoiceProvider > -1) {
            setDomainInvoiceProvider({ loading: false, data: multiResult.data[indexDomainInvoiceProvider] && multiResult.data[indexDomainInvoiceProvider].success ? multiResult.data[indexDomainInvoiceProvider].data : [] });
        }

        const indexDomainPaymentProvider = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_PAYMENTPROVIDER'));

        if (indexDomainPaymentProvider > -1) {
            setDomainPaymentProvider({ loading: false, data: multiResult.data[indexDomainPaymentProvider] && multiResult.data[indexDomainPaymentProvider].success ? multiResult.data[indexDomainPaymentProvider].data : [] });
        }

        const indexDomainPrinting = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_PRINTING'));

        if (indexDomainPrinting > -1) {
            setDomainPrinting({ loading: false, data: multiResult.data[indexDomainPrinting] && multiResult.data[indexDomainPrinting].success ? multiResult.data[indexDomainPrinting].data : [] });
        }
    }, [multiResult]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_edit) }))
                fetchData();
                dispatch(showBackdrop(false));
            }
            else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(executeResult.code || "error_unexpected_db_error") }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeResult, waitSave])

    const { handleSubmit, formState: { errors } } = useForm({
        defaultValues: fields.parameters
    });

    const onSubmit = handleSubmit(() => {
        const callback = () => {
            dispatch(execute(updateAppsettingInvoice(fields.parameters)));
            setWaitSave(true);
        }
        if (
            fields.parameters.ruc === '' ||
            fields.parameters.businessname === '' ||
            fields.parameters.tradename === '' ||
            fields.parameters.fiscaladdress === '' ||
            fields.parameters.ubigeo === '' ||
            fields.parameters.country === '' ||
            fields.parameters.emittertype === '' ||
            fields.parameters.currency === '' ||
            fields.parameters.invoiceserie === '' ||
            fields.parameters.invoicecorrelative === 0 ||
            fields.parameters.annexcode === '' ||
            fields.parameters.igv === 0 ||
            fields.parameters.printingformat === '' ||
            fields.parameters.xmlversion === '' ||
            fields.parameters.ublversion === '' ||
            fields.parameters.invoiceprovider === '' ||
            fields.parameters.sunaturl === '' ||
            fields.parameters.token === '' ||
            fields.parameters.sunatusername === '' ||
            fields.parameters.paymentprovider === '' ||
            fields.parameters.publickey === '' ||
            fields.parameters.privatekey === ''
            ) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.required_fields_missing) }));
        }
        else {
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {edit ?
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button> :
                            null
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetupgeneralinformation)}</Typography>

                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingruc)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.ruc || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, ruc: value}})}
                                error={errors?.ruc?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingruc)}
                                value={fields ? (fields.parameters.ruc || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingcompanyname)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.businessname || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, businessname: value}})}
                                error={errors?.businessname?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingcompanyname)}
                                value={fields ? (fields.parameters.businessname || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingcommercialname)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.tradename || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, tradename: value}})}
                                error={errors?.tradename?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingcommercialname)}
                                value={fields ? (fields.parameters.tradename || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingfiscaladdress)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.fiscaladdress || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, fiscaladdress: value}})}
                                error={errors?.fiscaladdress?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingfiscaladdress)}
                                value={fields ? (fields.parameters.fiscaladdress || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingubigeocode)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.ubigeo || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, ubigeo: value}})}
                                error={errors?.ubigeo?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingubigeocode)}
                                value={fields ? (fields.parameters.ubigeo || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldSelect
                                label={t(langKeys.billingcountry)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.country || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, country: value.code}})}
                                error={errors?.country?.message}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="code"
                            /> :
                            <FieldView
                                label={t(langKeys.billingcountry)}
                                value={fields ? (fields.parameters.country || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetupbillinginformation)}</Typography>

                    <div className="row-zyx">
                        { edit ?
                            <FieldSelect
                                label={t(langKeys.billingemittertype)}
                                loading={domainDocument.loading}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.emittertype || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, emittertype: value.domainvalue}})}
                                error={errors?.emittertype?.message}
                                data={domainDocument.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                uset={true}
                                prefixTranslation='billingfield_'
                            /> :
                            <FieldView
                                label={t(langKeys.billingemittertype)}
                                value={fields ? (fields.parameters.emittertype || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldSelect
                                label={t(langKeys.billingcurrency)}
                                loading={domainCurrency.loading}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.currency || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, currency: value.domainvalue}})}
                                error={errors?.currency?.message}
                                data={domainCurrency.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                uset={true}
                                prefixTranslation='billingfield_'
                            /> :
                            <FieldView
                                label={t(langKeys.billingcurrency)}
                                value={fields ? (fields.parameters.currency || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingserial)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.invoiceserie || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, invoiceserie: value}})}
                                error={errors?.invoiceserie?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingserial)}
                                value={fields ? (fields.parameters.invoiceserie || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingcorrelative)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.invoicecorrelative || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, invoicecorrelative: value}})}
                                error={errors?.invoicecorrelative?.message}
                                type='number'
                            /> :
                            <FieldView
                                label={t(langKeys.billingcorrelative)}
                                value={fields ? (fields.parameters.invoicecorrelative.toString() || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingannexcode)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.annexcode || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, annexcode: value}})}
                                error={errors?.annexcode?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingannexcode)}
                                value={fields ? (fields.parameters.annexcode || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingtax)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.igv || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, igv: value}})}
                                error={errors?.igv?.message}
                                type='number'
                            /> :
                            <FieldView
                                label={t(langKeys.billingtax)}
                                value={fields ? (fields.parameters.igv.toString() || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldSelect
                                label={t(langKeys.billingprintingformat)}
                                loading={domainPrinting.loading}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.printingformat || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, printingformat: value.domainvalue}})}
                                error={errors?.printingformat?.message}
                                data={domainPrinting.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                uset={true}
                                prefixTranslation='billingfield_'
                            /> :
                            <FieldView
                                label={t(langKeys.billingprintingformat)}
                                value={fields ? (fields.parameters.printingformat || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingxmlversion)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.xmlversion || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, xmlversion: value}})}
                                error={errors?.xmlversion?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingxmlversion)}
                                value={fields ? (fields.parameters.xmlversion || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingublversion)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.ublversion || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, ublversion: value}})}
                                error={errors?.ublversion?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingublversion)}
                                value={fields ? (fields.parameters.ublversion || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <TemplateSwitch
                                label={t(langKeys.billingreturnpdf)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.returnpdf || false) : false}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, returnpdf: value}})}
                            /> :
                            <FieldView
                                label={t(langKeys.billingreturnpdf)}
                                value={fields ? (fields.parameters.returnpdf ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <TemplateSwitch
                                label={t(langKeys.billingreturncsv)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.returnxmlsunat || false) : false}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, returnxmlsunat: value}})}
                            /> :
                            <FieldView
                                label={t(langKeys.billingreturncsv)}
                                value={fields ? (fields.parameters.returnxmlsunat ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <TemplateSwitch
                                label={t(langKeys.billingreturnxml)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.returnxml || false) : false}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, returnxml: value}})}
                            /> :
                            <FieldView
                                label={t(langKeys.billingreturnxml)}
                                value={fields ? (fields.parameters.returnxml ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                className="col-6"
                            />
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetupsunatinformation)}</Typography>

                    <div className="row-zyx">
                        { edit ?
                            <FieldSelect
                                label={t(langKeys.billinginvoiceprovider)}
                                loading={domainInvoiceProvider.loading}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.invoiceprovider || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, invoiceprovider: value.domainvalue}})}
                                error={errors?.invoiceprovider?.message}
                                data={domainInvoiceProvider.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                uset={true}
                                prefixTranslation='billingfield_'
                            /> :
                            <FieldView
                                label={t(langKeys.billinginvoiceprovider)}
                                value={fields ? (fields.parameters.invoiceprovider || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingapiendpoint)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.sunaturl || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, sunaturl: value}})}
                                error={errors?.sunaturl?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingapiendpoint)}
                                value={fields ? (fields.parameters.sunaturl || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingtoken)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.token || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, token: value}})}
                                error={errors?.token?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingtoken)}
                                value={fields ? (fields.parameters.token || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingusername)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.sunatusername || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, sunatusername: value}})}
                                error={errors?.sunatusername?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingusername)}
                                value={fields ? (fields.parameters.sunatusername || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetuppaymentinformation)}</Typography>

                    <div className="row-zyx">
                        { edit ?
                            <FieldSelect
                            label={t(langKeys.billingpaymentprovider)}
                                loading={domainPaymentProvider.loading}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.paymentprovider || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, paymentprovider: value.domainvalue}})}
                                error={errors?.paymentprovider?.message}
                                data={domainPaymentProvider.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                uset={true}
                                prefixTranslation='billingfield_'
                            /> :
                            <FieldView
                                label={t(langKeys.billingpaymentprovider)}
                                value={fields ? (fields.parameters.paymentprovider || '') : ''}
                                className="col-6"
                            />
                        }
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingpublickey)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.publickey || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, publickey: value}})}
                                error={errors?.publickey?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingpublickey)}
                                value={fields ? (fields.parameters.publickey || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        { edit ?
                            <FieldEdit
                                label={t(langKeys.billingprivatekey)}
                                className="col-6"
                                valueDefault={fields ? (fields.parameters.privatekey || '') : ''}
                                onChange={(value) => setFields({...fields, parameters: {...fields.parameters, privatekey: value}})}
                                error={errors?.privatekey?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.billingprivatekey)}
                                value={fields ? (fields.parameters.privatekey || '') : ''}
                                className="col-6"
                            />
                        }
                    </div>
                </div>
            </form>
        </div>
    );
}

const ContractedPlanByPeriod: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);

    const [dataMain, setdataMain] = useState({
        plan: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });
    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingConfigurationSel(dataMain)))
    }

    useEffect(() => {
        search()
    }, [])

    useEffect(() => {
        setdisableSearch(dataMain.year === "" ) 
    }, [dataMain])

    useEffect(() => {
        if (!mainResult.mainData.loading){
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'billingconfigurationid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
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
                Header: "Plan",
                accessor: 'plan',
            },
            {
                Header: t(langKeys.costbasedonthecontractedplan),
                accessor: 'basicfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return (basicfee || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.numberofagentshired),
                accessor: 'userfreequantity',
                type: 'number',
                sortType: 'number',
            },
            {
                Header: t(langKeys.useradditionalfee),
                accessor: 'useradditionalfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { useradditionalfee } = props.cell.row.original;
                    return (useradditionalfee || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.channelfreequantity),
                accessor: 'channelfreequantity',
                type: 'number',
                sortType: 'number',
            },
            {
                Header: t(langKeys.channelwhatsappfee),
                accessor: 'channelwhatsappfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { channelwhatsappfee } = props.cell.row.original;
                    return (channelwhatsappfee || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.clientfreequantity),
                accessor: 'clientfreequantity',
                type: 'number',
                sortType: 'number',
            },
            {
                Header: t(langKeys.clientadditionalfee),
                accessor: 'clientadditionalfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { clientadditionalfee } = props.cell.row.original;
                    return (clientadditionalfee || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.allowhsm),
                accessor: 'allowhsm',
                NoFilter: false,
                Cell: (props: any) => {
                    const { allowhsm } = props.cell.row.original;
                    return allowhsm?t(langKeys.yes):"No"
                }
            },
            {
                Header: t(langKeys.hsmfee),
                accessor: 'hsmfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { hsmfee } = props.cell.row.original;
                    return (hsmfee || 0).toFixed(2);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConfigurationSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if(duplicateop){
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_duplicate) }))
                }else{

                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setduplicateop(true)
        const callback = () => {
            dispatch(execute(billingConfigurationIns({ ...row, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_duplicate),
            callback
        }))
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingConfigurationIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingconfigurationid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    columns={columns}
                    ButtonsElement={() =>(
                        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{width: 150}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                                data={years}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 300}}
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
                                label="Plan"
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,plan:value?.plan||""}))}
                                data={dataPlan}
                                optionDesc="plan"
                                optionValue="plan"
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
                    register={true}
                    handleRegister={handleRegister}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailContractedPlanByPeriod
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan = {dataPlan}
            />
        )
    } else
        return null;
}

const DetailContractedPlanByPeriod: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    const [checkedaux, setCheckedaux] = useState(row?.allowhsm||false);
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadContractedPlan = [
        { id: "view-1", name: t(langKeys.contractedplan) },
        { id: "view-2", name: t(langKeys.contractedplandetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.billingconfigurationid || 0,
            year: row?.year ||new Date().getFullYear(),
            month: row?.month ||new Date().getMonth() + 1,
            plan: row?.plan||"",
            basicfee: row?.basicfee||0,
            userfreequantity: row?.userfreequantity||0,
            channelfreequantity: row?.channelfreequantity||0,
            clientfreequantity: row?.clientfreequantity||0,
            useradditionalfee: row?.useradditionalfee||0,
            channelwhatsappfee: row?.channelwhatsappfee||0,
            clientadditionalfee: row?.clientadditionalfee||0,
            channelotherfee: row?.channelotherfee||0,
            hsmfee: row?.hsmfee||0,
            allowhsm: row?.allowhsm||false,
            status: row? row.status : 'ACTIVO',
            type: row? row.type : '',
            description: row? row.description : '',
            operation: row? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any){
        if(e!==""){
            let datetochange = new Date(e+"-02")
            let mes = datetochange?.getMonth()+1
            let year = datetochange?.getFullYear()
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year',year)
            setValue('month',mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('allowhsm');
        register('channelotherfee');
        register('description');
        register('plan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('userfreequantity', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('channelfreequantity', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('clientfreequantity', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('useradditionalfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('channelwhatsappfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('clientadditionalfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('hsmfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
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
            dispatch(execute(billingConfigurationIns(data)));
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
                            breadcrumbs={arrayBreadContractedPlan}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row? `${row.description}` : t(langKeys.newcontractedplanbyperiod)}
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
                    <div className="row-zyx">
                        <TextField
                            id="date"
                            className="col-6"
                            type="month"
                            variant="outlined"
                            onChange={(e)=>handleDateChange(e.target.value)}
                            value={datetoshow}
                            size="small"
                        />
                        <FieldSelect
                            label="Plan"
                            className="col-6"
                            valueDefault={getValues("plan")}
                            onChange={(value) => setValue('plan',value.plan)}
                            data={dataPlan}
                            optionDesc="plan"
                            optionValue="plan"
                            error={errors?.plan?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.costbasedonthecontractedplan)}
                            onChange={(value) => setValue('basicfee', value)}
                            valueDefault={getValues('basicfee')}
                            error={errors?.basicfee?.message}
                            type="number"
                            className="col-6"
                        />
                        
                        <FieldEdit
                            label={t(langKeys.numberofagentshired)}
                            onChange={(value) => setValue('userfreequantity', value)}
                            valueDefault={getValues('userfreequantity')}
                            error={errors?.userfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.useradditionalfee)}
                            onChange={(value) => setValue('useradditionalfee', value)}
                            valueDefault={getValues('useradditionalfee')}
                            error={errors?.useradditionalfee?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.channelfreequantity)}
                            onChange={(value) => setValue('channelfreequantity', value)}
                            valueDefault={getValues('channelfreequantity')}
                            error={errors?.channelfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.channelwhatsappfee)}
                            onChange={(value) => setValue('channelwhatsappfee', value)}
                            valueDefault={getValues('channelwhatsappfee')}
                            error={errors?.channelwhatsappfee?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.clientfreequantity)}
                            onChange={(value) => setValue('clientfreequantity', value)}
                            valueDefault={getValues('clientfreequantity')}
                            error={errors?.clientfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.clientadditionalfee)}
                            onChange={(value) => setValue('clientadditionalfee', value)}
                            valueDefault={getValues('clientadditionalfee')}
                            error={errors?.clientadditionalfee?.message}
                            type="number"
                            className="col-6"
                        />
                        <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.allowhsm)}</Box>
                            <FormControlLabel
                                style={{paddingLeft:10}}
                                control={<IOSSwitch checked={checkedaux}  onChange={(e) => {setCheckedaux(e.target.checked) ;setValue('allowhsm', e.target.checked)}} />}
                                label={""}
                            />                        
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.hsmfee)}
                            onChange={(value) => setValue('hsmfee', value)}
                            valueDefault={getValues('hsmfee')}
                            error={errors?.hsmfee?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.channelotherfee)}
                            onChange={(value) => setValue('channelotherfee', value)}
                            valueDefault={getValues('channelotherfee')}
                            error={errors?.channelotherfee?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const ConversationCost: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);

    const [dataMain, setdataMain] = useState({
        countrycode: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });
    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingConversationSel(dataMain)))
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "" ) 
    }, [dataMain])

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
                accessor: 'billingconversationid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
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
                Header: t(langKeys.country),
                accessor: 'country',
            },
            {
                Header: t(langKeys.countrycode),
                accessor: 'countrycode',
            },
            {
                Header: t(langKeys.billingvcacomission),
                accessor: 'vcacomission',
                Cell: (props: any) => {
                    const { vcacomission } = props.cell.row.original;
                    return (vcacomission || 0).toFixed(3);
                }
            },
            {
                Header: t(langKeys.coststartedbycompany),
                accessor: 'companystartfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { companystartfee } = props.cell.row.original;
                    return (companystartfee || 0).toFixed(3);
                }
            },
            {
                Header: t(langKeys.customerinitiatedcost),
                accessor: 'clientstartfee',
                Cell: (props: any) => {
                    const { clientstartfee } = props.cell.row.original;
                    return (clientstartfee || 0).toFixed(3);
                }
            }
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConversationSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if(duplicateop){
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_duplicate) }))
                }else{

                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setduplicateop(true)
        const callback = () => {
            dispatch(execute(billingConversationIns({ ...row, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_duplicate),
            callback
        }))
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingConversationIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingconversationid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
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
                                style={{width: 150}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                                data={years}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 300}}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
                                data={months}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.country)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.countrycode}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,countrycode:value.map((o: Dictionary) => o.code).join()}))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="code"
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
                    register={true}
                    handleRegister={handleRegister}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailConversationCost
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan = {dataPlan}
            />
        )
    } else
        return null;
}

const DetailConversationCost: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadConversationCost = [
        { id: "view-1", name: t(langKeys.conversationcost) },
        { id: "view-2", name: t(langKeys.conversationcostdetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row? row.billingconversationid : 0,
            year: row?.year ||new Date().getFullYear(),
            month: row?.month ||new Date().getMonth() + 1,
            countrycode: row?.countrycode || 'PE',
            companystartfee: row?.companystartfee || 0.0,
            clientstartfee: row?.clientstartfee || 0.0,
            vcacomission: row?.vcacomission || 0.0,
            description: row?.description || "",
            status: row? row.status : 'ACTIVO',
            type: row? row.type : '',
            operation: row? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any){
        if(e!==""){
            let datetochange = new Date(e+"-02")
            let mes = datetochange?.getMonth()+1
            let year = datetochange?.getFullYear()
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year',year)
            setValue('month',mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('countrycode', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('companystartfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('clientstartfee', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('vcacomission', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
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
            dispatch(execute(billingConversationIns(data)));
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
                            breadcrumbs={arrayBreadConversationCost}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row? `${row.description}` : t(langKeys.newconversationplan)}
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
                    <div className="row-zyx">
                        <FieldView
                            label=''
                            value={t(langKeys.costcommentary)}
                            className={classes.commentary}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('description', value)}
                            valueDefault={getValues('description')}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                            <TextField
                                id="date"
                                className="col-6"
                                type="month"
                                variant="outlined"
                                onChange={(e)=>handleDateChange(e.target.value)}
                                value={datetoshow}
                                size="small"
                            />
                            <FieldSelect
                                label={t(langKeys.country)}
                                className="col-6"
                                valueDefault={getValues("countrycode")}
                                variant="outlined"
                                onChange={(value) => setValue("countrycode",value.code)}
                                error={errors?.countrycode?.message}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="code"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.billingvcacomission)}
                                onChange={(value) => setValue('vcacomission', value)}
                                valueDefault={getValues('vcacomission')}
                                error={errors?.vcacomission?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={t(langKeys.coststartedbycompany)}
                                onChange={(value) => setValue('companystartfee', value)}
                                valueDefault={getValues('companystartfee')}
                                error={errors?.companystartfee?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.customerinitiatedcost)}
                                onChange={(value) => setValue('clientstartfee', value)}
                                valueDefault={getValues('clientstartfee')}
                                error={errors?.clientstartfee?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                </div>
            </form>
        </div>
    );
}

const NotificationCost: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);

    const [dataMain, setdataMain] = useState({
        countrycode: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });
    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingNotificationSel(dataMain)))
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "" ) 
    }, [dataMain])

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
                accessor: 'billingnotificationid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
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
                Header: t(langKeys.country),
                accessor: 'country',
            },
            {
                Header: t(langKeys.countrycode),
                accessor: 'countrycode',
            },
            {
                Header: t(langKeys.billingvcacomission),
                accessor: 'vcacomission',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { vcacomission } = props.cell.row.original;
                    return (vcacomission || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.first_plural)} 250k`,
                accessor: 'c250000',
                Cell: (props: any) => {
                    const { c250000 } = props.cell.row.original;
                    return (c250000 || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.next_plural)} 750k`,
                accessor: 'c750000',
                Cell: (props: any) => {
                    const { c750000 } = props.cell.row.original;
                    return (c750000 || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.next_plural)} 2 ${t(langKeys.millions)}`,
                accessor: 'c2000000',
                Cell: (props: any) => {
                    const { c2000000 } = props.cell.row.original;
                    return (c2000000 || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.next_plural)} 3 ${t(langKeys.millions)}`,
                accessor: 'c3000000',
                Cell: (props: any) => {
                    const { c3000000 } = props.cell.row.original;
                    return (c3000000 || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.next_plural)} 4 ${t(langKeys.millions)}`,
                accessor: 'c4000000',
                Cell: (props: any) => {
                    const { c4000000 } = props.cell.row.original;
                    return (c4000000 || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.next_plural)} 5 ${t(langKeys.millions)}`,
                accessor: 'c5000000',
                Cell: (props: any) => {
                    const { c5000000 } = props.cell.row.original;
                    return (c5000000 || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.next_plural)} 10 ${t(langKeys.millions)}`,
                accessor: 'c10000000',
                Cell: (props: any) => {
                    const { c10000000 } = props.cell.row.original;
                    return (c10000000 || 0).toFixed(3);
                }
            },
            {
                Header: `${t(langKeys.greaterthan)} 25 ${t(langKeys.millions)}`,
                accessor: 'c25000000',
                Cell: (props: any) => {
                    const { c25000000 } = props.cell.row.original;
                    return (c25000000 || 0).toFixed(3);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingNotificationSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if(duplicateop){
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_duplicate) }))
                }else{

                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setduplicateop(true)
        const callback = () => {
            dispatch(execute(billingNotificationIns({ ...row, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_duplicate),
            callback
        }))
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingNotificationIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingnotificationid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
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
                                style={{width: 150}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                                data={years}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 300}}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,month:value.map((o: Dictionary) => o.val).join()}))}
                                data={months}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.country)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.countrycode}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,countrycode:value.map((o: Dictionary) => o.code).join()}))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="code"
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
                    register={true}
                    handleRegister={handleRegister}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailNotificationCost
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan = {dataPlan}
            />
        )
    } else
        return null;
}

const DetailNotificationCost: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadNotificationCost = [
        { id: "view-1", name: t(langKeys.notificationcost) },
        { id: "view-2", name: t(langKeys.notificationcostdetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row? row.billingnotificationid : 0,
            year: row?.year ||new Date().getFullYear(),
            month: row?.month ||new Date().getMonth() + 1,
            countrycode: row?.countrycode || 'PE',
            vcacomission: row?.vcacomission || 0.0,
            c250000: row?.c250000 || 0.0,
            c750000: row?.c750000 || 0.0,
            c2000000: row?.c2000000 || 0.0,
            c3000000: row?.c3000000 || 0.0,
            c4000000: row?.c4000000 || 0.0,
            c5000000: row?.c5000000 || 0.0,
            c10000000: row?.c10000000 || 0.0,
            c25000000: row?.c25000000 || 0.0,
            description: row?.description || "",
            status: row? row.status : 'ACTIVO',
            type: row? row.type : '',
            operation: row? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any){
        if(e!==""){
            let datetochange = new Date(e+"-02")
            let mes = datetochange?.getMonth()+1
            let year = datetochange?.getFullYear()
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year',year)
            setValue('month',mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('countrycode', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('vcacomission', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c250000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c750000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c2000000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c3000000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c4000000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c5000000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c10000000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('c25000000', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
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
            dispatch(execute(billingNotificationIns(data)));
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
                            breadcrumbs={arrayBreadNotificationCost}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row? `${row.description}` : t(langKeys.newnotificationcost)}
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
                    <div className="row-zyx">
                        <FieldView
                            label=''
                            value={t(langKeys.costcommentary)}
                            className={classes.commentary}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('description', value)}
                            valueDefault={getValues('description')}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                            <TextField
                                id="date"
                                className="col-6"
                                type="month"
                                variant="outlined"
                                onChange={(e)=>handleDateChange(e.target.value)}
                                value={datetoshow}
                                size="small"
                            />
                            <FieldSelect
                                label={t(langKeys.country)}
                                className="col-6"
                                valueDefault={getValues("countrycode")}
                                variant="outlined"
                                onChange={(value) => setValue("countrycode",value.code)}
                                error={errors?.countrycode?.message}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="code"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.billingvcacomission)}
                                onChange={(value) => setValue('vcacomission', value)}
                                valueDefault={getValues('vcacomission')}
                                error={errors?.vcacomission?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={`${t(langKeys.first_plural)} 250k`}
                                onChange={(value) => setValue('c250000', value)}
                                valueDefault={getValues('c250000')}
                                error={errors?.c250000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 750k`}
                                onChange={(value) => setValue('c750000', value)}
                                valueDefault={getValues('c750000')}
                                error={errors?.c750000?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 2 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c2000000', value)}
                                valueDefault={getValues('c2000000')}
                                error={errors?.c2000000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 3 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c3000000', value)}
                                valueDefault={getValues('c3000000')}
                                error={errors?.c3000000?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 4 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c4000000', value)}
                                valueDefault={getValues('c4000000')}
                                error={errors?.c4000000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 5 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c5000000', value)}
                                valueDefault={getValues('c5000000')}
                                error={errors?.c5000000?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 10 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c10000000', value)}
                                valueDefault={getValues('c10000000')}
                                error={errors?.c10000000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.greaterthan)} 25 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c25000000', value)}
                                valueDefault={getValues('c25000000')}
                                error={errors?.c25000000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                </div>
            </form>
        </div>
    );
}

const SupportPlan: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);

    const [dataMain, setdataMain] = useState({
        plan: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });
    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingSupportSel(dataMain)))
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
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
                type: "number",
                sortType: "number"
            },
            {
                Header: t(langKeys.supportplan),
                accessor: 'plan',
            },
            {
                Header: t(langKeys.supportprice),
                accessor: 'basicfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return (basicfee || 0).toFixed(2);
                }
            },
            {
                Header: t(langKeys.starttime),
                accessor: 'starttime',
            },
            {
                Header: t(langKeys.finishtime),
                accessor: 'finishtime',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingSupportSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if(duplicateop){
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_duplicate) }))
                }else{

                    dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.supportplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        setdisableSearch(dataMain.year === "" ) 
    }, [dataMain])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setduplicateop(true)
        const callback = () => {
            dispatch(execute(billingSupportIns({ ...row, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_duplicate),
            callback
        }))
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingSupportIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingsupportid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                {/* <div>
                    <div style={{width:"100%", display: "flex", padding: 10}}>
                        
                    </div>
                </div> */}

                <TableZyx
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{width: 150}}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,year:value?.desc||""}))}
                                data={years}
                                optionDesc="desc"
                                optionValue="desc"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{width: 300}}
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
                                label={t(langKeys.supportplan)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,plan:value?.description||""}))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="description"
                            />
                        
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    // titlemodule={t(langKeys.billingplan, { count: 2 })}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailSupportPlan
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan = {dataPlan}
            />
        )
    } else
        return null;
}

const DetailSupportPlan: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    
    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    const [waitSave, setWaitSave] = useState(false);
    
    const arrayBread = [
        { id: "view-1", name: t(langKeys.supportplan) },
        { id: "view-2", name: t(langKeys.supportplandetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row? row.billingsupportid : 0,
            startdate: row?.startdate || new Date(new Date().setDate(1)),
            enddate: row?.enddate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            year: row?.year ||new Date().getFullYear(),
            month: row?.month ||new Date().getMonth() + 1,
            plan: row?.plan||"",
            basicfee: row?.basicfee||0,
            starttime: row?.starttime || new Date().getTime(),
            finishtime: row?.finishtime || new Date().getTime(),
            status: row? row.status : 'ACTIVO',
            type: row? row.type : '',
            description: row? row.description : '',
            operation: row? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any){
        if(e!==""){
            let datetochange = new Date(e+"-02")
            let mes = datetochange?.getMonth()+1
            let year = datetochange?.getFullYear()
            let startdate = new Date(year, mes-1, 1)
            let enddate = new Date(year, mes, 0)
            setValue('startdate',startdate)
            setValue('enddate',enddate)
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year',year)
            setValue('month',mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('plan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => (value && value>=0) || t(langKeys.field_required) });
        register('starttime', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('finishtime', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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
            dispatch(execute(billingSupportIns(data)));
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
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row? `${row.description}` : t(langKeys.newsupportplan)}
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
                    <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.description)}
                                onChange={(value) => setValue('description', value)}
                                valueDefault={getValues('description')}
                                error={errors?.description?.message}
                                className="col-6"
                            />
                            <TextField
                                id="date"
                                className="col-6"
                                type="month"
                                variant="outlined"
                                onChange={(e)=>handleDateChange(e.target.value)}
                                value={datetoshow}
                                size="small"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldSelect
                                label="Plan"
                                className="col-6"
                                valueDefault={getValues("plan")}
                                onChange={(value) => setValue('plan',value.description)}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="description"
                                error={errors?.plan?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.supportprice)}
                                onChange={(value) => setValue('basicfee', value)}
                                valueDefault={getValues('basicfee')}
                                error={errors?.basicfee?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                type="time"
                                label={t(langKeys.starttime)}
                                error={errors?.starttime?.message}
                                className="col-6"
                                onChange={(value) => setValue('starttime', value)}
                                valueDefault={getValues("starttime")}
                            />
                            <FieldEdit
                                type="time"
                                label={t(langKeys.finishtime)}
                                error={errors?.finishtime?.message}
                                className="col-6"
                                onChange={(value) => setValue('finishtime', value)}
                                valueDefault={getValues("finishtime")}
                            />
                    </div>
                </div>
            </form>
        </div>
    );
}

const BillingSetup: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const countryListreq = useSelector(state => state.signup.countryList);
    const multiData = useSelector(state => state.main.multiData);
    const user = useSelector(state => state.login.validateToken.user);

    const [countryList, setcountryList] = useState<any>([]);
    const [dataPaymentPlan, setdataPaymentPlan] = useState<any>([]);
    const [dataPlan, setdataPlan] = useState<any>([]);
    const [pageSelected, setPageSelected] = useState(user?.roledesc === "SUPERADMIN"?0:6);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);

    useEffect(() => {
        if(!multiData.loading && sentfirstinfo){
            setsentfirstinfo(false)
            setdataPlan(multiData.data[0] && multiData.data[0].success? multiData.data[0].data : [])
            setdataPaymentPlan(multiData.data[3] && multiData.data[3].success? multiData.data[3].data : [])
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
                    <AntTab label={t(langKeys.billingsetupgeneralconfiguration)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.contractedplanbyperiod)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.conversationcost)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.notificationcost)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.supportplan)} />
                }
                {/*user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.costperHSMperiod)} />
                */}
                {/*user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.periodreport)} />
                */}
            </Tabs>
            {pageSelected === 0 &&
                <div style={{ marginTop: 16 }}>
                    <GeneralConfiguration dataPlan={countryList}/>
                </div>
            }
            {pageSelected === 1 &&
                <div style={{ marginTop: 16 }}>
                    <ContractedPlanByPeriod dataPlan={dataPaymentPlan}/>
                </div>
            }
            {pageSelected === 2 &&
                <div style={{ marginTop: 16 }}>
                    <ConversationCost dataPlan={countryList}/>
                </div>
            }
            {pageSelected === 3 &&
                <div style={{ marginTop: 16 }}>
                    <NotificationCost dataPlan={countryList}/>
                </div>
            }
            {pageSelected === 4 &&
                <div style={{ marginTop: 16 }}>
                    <SupportPlan dataPlan={dataPlan}/>
                </div>
            }
            {/*pageSelected === 6 &&
                <div style={{ marginTop: 16 }}>
                    <CostPerHSMPeriod dataPlan={multiData}/>
                </div>
            */}
            {/*pageSelected === 7 &&
                <div style={{ marginTop: 16 }}>
                    <PeriodReport dataPlan={multiData}/>
                </div>
            */}
        </div>
    );
}

export default BillingSetup;