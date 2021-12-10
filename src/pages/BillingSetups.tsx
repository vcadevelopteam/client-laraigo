/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch } from 'components';
import { billingSupportIns, getBillingConfigurationSel,billingpersonreportsel,billinguserreportsel, getBillingSupportSel, getPlanSel, getPaymentPlanSel, billingConfigurationIns,billingPeriodUpd, getBillingConversationSel, billingConversationIns, getBillingPeriodSel, getOrgSelList, getCorpSel, getBillingPeriodHSMSel, billingPeriodHSMUpd, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute,exportData } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Tabs, TextField } from '@material-ui/core';
import { getCountryList } from 'store/signup/actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DownloadIcon } from 'icons';
import {
    Search as SearchIcon,
} from '@material-ui/icons';

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

const arrayBread = [
    { id: "view-1", name: "Support Plan" },
    { id: "view-2", name: "Support Plan detail" }
];
const arrayBreadContractedPlan = [
    { id: "view-1", name: "Contracted Plan" },
    { id: "view-2", name: "Contracted Plan detail" }
];
const arrayBreadConversationCost = [
    { id: "view-1", name: "Conversation Cost" },
    { id: "view-2", name: "Conversation Cost detail" }
];
const arrayBreadCostPerPeriod = [
    { id: "view-1", name: "Cost Per Period" },
    { id: "view-2", name: "Cost Per Period detail" }
];
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
}));

const DetailSupportPlan: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    
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
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
const DetailContractedPlanByPeriod: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    
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
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
        setValue('year',year)
        setValue('month',mes)
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
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
                        <FieldEdit
                            label="Plan"
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
                            label={t(langKeys.supportplan)}
                            className="col-6"
                            valueDefault={getValues("plan")}
                            onChange={(value) => setValue('plan',value.plan)}
                            data={dataPlan}
                            optionDesc="plan"
                            optionValue="plan"
                            error={errors?.plan?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.costbasedonthecontractedplan)}
                            onChange={(value) => setValue('basicfee', value)}
                            valueDefault={getValues('basicfee')}
                            error={errors?.basicfee?.message}
                            type="number"
                            className="col-6"
                        />
                        
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.numberofagentshired)}
                            onChange={(value) => setValue('userfreequantity', value)}
                            valueDefault={getValues('userfreequantity')}
                            error={errors?.userfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.useradditionalfee)}
                            onChange={(value) => setValue('useradditionalfee', value)}
                            valueDefault={getValues('useradditionalfee')}
                            error={errors?.useradditionalfee?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.channelfreequantity)}
                            onChange={(value) => setValue('channelfreequantity', value)}
                            valueDefault={getValues('channelfreequantity')}
                            error={errors?.channelfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.channelwhatsappfee)}
                            onChange={(value) => setValue('channelwhatsappfee', value)}
                            valueDefault={getValues('channelwhatsappfee')}
                            error={errors?.channelwhatsappfee?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.clientfreequantity)}
                            onChange={(value) => setValue('clientfreequantity', value)}
                            valueDefault={getValues('clientfreequantity')}
                            error={errors?.clientfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.clientadditionalfee)}
                            onChange={(value) => setValue('clientadditionalfee', value)}
                            valueDefault={getValues('clientadditionalfee')}
                            error={errors?.clientadditionalfee?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <TemplateSwitch
                            label={t(langKeys.allowhsm)}
                            className="col-6"
                            valueDefault={getValues("allowhsm")}
                            onChange={(value) => setValue('allowhsm', value)}
                        /> 
                        <FieldEdit
                            label={t(langKeys.hsmfee)}
                            onChange={(value) => setValue('hsmfee', value)}
                            valueDefault={getValues('hsmfee')}
                            error={errors?.hsmfee?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
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
const DetailConversationCost: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [datetoshow, setdatetoshow] = useState(
        row? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    )
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row? row.billingconversationid : 0,
            year: row?.year ||new Date().getFullYear(),
            month: row?.month ||new Date().getMonth() + 1,
            countrycode: row?.countrycode || 'PE',
            companystartfee: row?.companystartfee || 0.0,
            description: row?.description || "",
            clientstartfee: row?.clientstartfee || 0.0,
            c250000: row?.c250000 || 0.0,
            c750000: row?.c750000 || 0.0,
            c2000000: row?.c2000000 || 0.0,
            c3000000: row?.c3000000 || 0.0,
            c4000000: row?.c4000000 || 0.0,
            c5000000: row?.c5000000 || 0.0,
            c10000000: row?.c10000000 || 0.0,
            c25000000: row?.c25000000 || 0.0,
            status: row? row.status : 'ACTIVO',
            type: row? row.type : '',
            operation: row? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
        setValue('year',year)
        setValue('month',mes)
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
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
                                label={t(langKeys.coststartedbycompany)}
                                onChange={(value) => setValue('companystartfee', value)}
                                valueDefault={getValues('companystartfee')}
                                error={errors?.companystartfee?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={t(langKeys.customerinitiatedcost)}
                                onChange={(value) => setValue('clientstartfee', value)}
                                valueDefault={getValues('clientstartfee')}
                                error={errors?.clientstartfee?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.first_plural)} 250k`}
                                onChange={(value) => setValue('c250000', value)}
                                valueDefault={getValues('c250000')}
                                error={errors?.c250000?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 750k`}
                                onChange={(value) => setValue('c750000', value)}
                                valueDefault={getValues('c750000')}
                                error={errors?.c750000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 2 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c2000000', value)}
                                valueDefault={getValues('c2000000')}
                                error={errors?.c2000000?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 3 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c3000000', value)}
                                valueDefault={getValues('c3000000')}
                                error={errors?.c3000000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 4 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c4000000', value)}
                                valueDefault={getValues('c4000000')}
                                error={errors?.c4000000?.message}
                                type="number"
                                className="col-6"
                            />
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 5 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c5000000', value)}
                                valueDefault={getValues('c5000000')}
                                error={errors?.c5000000?.message}
                                type="number"
                                className="col-6"
                            />
                    </div>
                    <div className="row-zyx">
                            <FieldEdit
                                label={`${t(langKeys.next_plural)} 10 ${t(langKeys.millions)}`}
                                onChange={(value) => setValue('c10000000', value)}
                                valueDefault={getValues('c10000000')}
                                error={errors?.c10000000?.message}
                                type="number"
                                className="col-6"
                            />
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
const DetailCostPerPeriod: React.FC<DetailSupportPlanProps2> = ({ data: { row, edit }, setViewSelected, fetchData,dataPlan }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);
    
    
    const dataPlanList = dataPlan.data[0] && dataPlan.data[0].success? dataPlan.data[0].data : []
    const dataPaymentPlanList = dataPlan.data[3] && dataPlan.data[3].success? dataPlan.data[3].data : []

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
            force: row?.force||true
            
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
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row? langKeys.successful_edit : langKeys.successful_register) }))
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
                    <AntTab label={t(langKeys.contact_plural)}/>
                    <AntTab label={t(langKeys.conversation)}/>
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
                        <FieldSelect
                            label={t(langKeys.billingplan)}
                            className="col-6"
                            valueDefault={getValues("billingplan")}
                            variant="outlined"
                            onChange={(value) => setValue('billingplan',value.plan)}
                            data={dataPaymentPlanList}
                            error={errors?.billingplan?.message}
                            optionDesc="plan"
                            optionValue="plan"
                        />
                        <FieldSelect
                            label={t(langKeys.supportplan)}
                            className="col-6"
                            valueDefault={getValues("supportplan")}
                            variant="outlined"
                            onChange={(value) => setValue('supportplan',value.description)}
                            data={dataPlanList}
                            error={errors?.supportplan?.message}
                            optionDesc="description"
                            optionValue="description"
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
                    </div>
                </div>}
                {pageSelected === 1 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.numberofagentshired)}
                            onChange={(value) => setValue('userfreequantity', value)}
                            valueDefault={getValues('userfreequantity')}
                            error={errors?.userfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.numberofactivesupervisors)}
                            value={String(getValues("supervisorquantity"))}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.numberofactiveadvisers)}
                            value={String(getValues("asesorquantity"))}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.numberofactiveagents)}
                            value={String(getValues("userquantity"))}
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
                        <FieldView
                            className="col-6"
                            label={t(langKeys.useradditionalcharge)}
                            value={getValues("useradditionalcharge").toFixed(2)}
                        />
                    </div>
                </div>}
                {pageSelected === 2  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.channelfreequantity)}
                            onChange={(value) => setValue('channelfreequantity', value)}
                            valueDefault={getValues('channelfreequantity')}
                            error={errors?.channelfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.channelwhatsappfee)}
                            onChange={(value) => setValue('channelwhatsappfee', value)}
                            valueDefault={getValues('channelwhatsappfee')}
                            error={errors?.channelwhatsappfee?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.channelwhatsappquantity)}
                            value={getValues("channelwhatsappquantity").toString()}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.channelwhatsappcharge)}
                            value={getValues("channelwhatsappcharge").toFixed(2)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.channelotherfee)}
                            onChange={(value) => setValue('channelotherfee', value)}
                            valueDefault={getValues('channelotherfee')}
                            error={errors?.channelotherfee?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.channelotherquantity)}
                            value={getValues("channelotherquantity").toString()}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.channelothercharge)}
                            value={getValues("channelothercharge").toFixed(2)}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.channelcharge)}
                            value={getValues("channelcharge").toFixed(2)}
                        />
                    </div>
                </div>}
                {pageSelected === 3  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.clientfreequantity)}
                            onChange={(value) => setValue('clientfreequantity', value)}
                            valueDefault={getValues('clientfreequantity')}
                            error={errors?.clientfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.clientquantity)}
                            value={getValues("clientquantity").toString()}
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
                        <FieldView
                            className="col-6"
                            label={t(langKeys.clientadditionalcharge)}
                            value={getValues("clientadditionalcharge").toFixed(2)}
                        />
                    </div>
                </div>}
                {pageSelected === 4  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationquantity)}
                            value={getValues("conversationquantity").toString()}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatquantity)}
                            value={getValues("conversationcompanywhatquantity").toString()}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.conversationcompanywhatfee)}
                            value={getValues("conversationcompanywhatfee").toFixed(2)}
                        />
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
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.interactionquantity)}
                            value={getValues("interactionquantity").toString()}
                        />
                    </div>
                </div>}
                {pageSelected === 5  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.supportbasicfee)}
                            onChange={(value) => setValue('supportbasicfee', value)}
                            valueDefault={getValues('supportbasicfee')}
                            error={errors?.supportbasicfee?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.additionalservicename)} 1`}
                            onChange={(value) => setValue('additionalservicename1', value)}
                            valueDefault={getValues('additionalservicename1')}
                            error={errors?.additionalservicename1?.message}
                            className="col-6"
                        />
                        <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 1`}
                            onChange={(value) => setValue('additionalservicefee1', value)}
                            valueDefault={getValues('additionalservicefee1')}
                            error={errors?.additionalservicefee1?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.additionalservicename)} 2`}
                            onChange={(value) => setValue('additionalservicename2', value)}
                            valueDefault={getValues('additionalservicename2')}
                            error={errors?.additionalservicename2?.message}
                            className="col-6"
                        />
                        <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 2`}
                            onChange={(value) => setValue('additionalservicefee2', value)}
                            valueDefault={getValues('additionalservicefee2')}
                            error={errors?.additionalservicefee2?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.additionalservicename)} 3`}
                            onChange={(value) => setValue('additionalservicename3', value)}
                            valueDefault={getValues('additionalservicename3')}
                            error={errors?.additionalservicename3?.message}
                            className="col-6"
                        />
                        <FieldEdit
                            label={`${t(langKeys.additionalservicefee)} 3`}
                            onChange={(value) => setValue('additionalservicefee3', value)}
                            valueDefault={getValues('additionalservicefee3')}
                            error={errors?.additionalservicefee3?.message}
                            type="number"
                            className="col-6"
                        />
                    </div>
                </div>}
            </form>
        </div>
    );
}
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
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
                            label={t(langKeys.vcacommissioncost)}
                            value={getValues("hsmutility").toFixed(2)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.hsmshippingcost)}
                            value={getValues("hsmcharge").toFixed(2)}
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
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataMain, setdataMain] = useState({
        startdate: new Date(new Date().setDate(1)),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        plan: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    });

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        let datetoshow = `${startdate.getFullYear()}-${String(startdate.getMonth()+1).padStart(2, '0')}`
        setdataMain(prev=>({...prev,startdate,enddate,datetoshow,year,month:mes}))
    }
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
                            viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
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
                Header: t(langKeys.supportplan),
                accessor: 'plan',
            },
            {
                Header: t(langKeys.supportprice),
                accessor: 'basicfee',
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
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
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

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingSupportIns({ ...row, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
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
                            <TextField
                                id="date"
                                className={classes.fieldsfilter}
                                type="month"
                                // style={{width: 200}}
                                variant="outlined"
                                onChange={(e)=>handleDateChange(e.target.value)}
                                value={dataMain.datetoshow}
                                size="small"
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
                                disabled={mainResult.mainData.loading}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    // titlemodule={t(langKeys.organization_plural, { count: 2 })}
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
const ContractedPlanByPeriod: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataMain, setdataMain] = useState({
        startdate: new Date(new Date().setDate(1)),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        plan: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    });

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        let datetoshow = `${startdate.getFullYear()}-${String(startdate.getMonth()+1).padStart(2, '0')}`
        setdataMain(prev=>({...prev,startdate,enddate,datetoshow,year,month:mes}))
    }
    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingConfigurationSel(dataMain)))
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
                            viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
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
                Header: "Plan",
                accessor: 'plan',
            },
            {
                Header: t(langKeys.costbasedonthecontractedplan),
                accessor: 'basicfee',
            },
            {
                Header: t(langKeys.numberofagentshired),
                accessor: 'userfreequantity',
            },
            {
                Header: t(langKeys.useradditionalfee),
                accessor: 'useradditionalfee',
            },
            {
                Header: t(langKeys.channelfreequantity),
                accessor: 'channelfreequantity',
            },
            {
                Header: t(langKeys.channelwhatsappfee),
                accessor: 'channelwhatsappfee',
            },
            {
                Header: t(langKeys.clientfreequantity),
                accessor: 'clientfreequantity',
            },
            {
                Header: t(langKeys.clientadditionalfee),
                accessor: 'clientadditionalfee',
            },
            {
                Header: t(langKeys.allowhsm),
                accessor: 'allowhsm',
            },
            {
                Header: t(langKeys.hsmfee),
                accessor: 'hsmfee',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConfigurationSel(dataMain)));


    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
        const callback = () => {
            dispatch(execute(billingConfigurationIns({ ...row, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
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
                                disabled={mainResult.mainData.loading}
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
const ConversationCost: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataMain, setdataMain] = useState({
        startdate: new Date(new Date().setDate(1)),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        countrycode: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    });

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        let datetoshow = `${startdate.getFullYear()}-${String(startdate.getMonth()+1).padStart(2, '0')}`
        setdataMain(prev=>({...prev,startdate,enddate,datetoshow,year,month:mes}))
    }
    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingConversationSel(dataMain)))
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
                            viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                            extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
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
                Header: t(langKeys.country),
                accessor: 'countrycode',
            },
            {
                Header: t(langKeys.coststartedbycompany),
                accessor: 'companystartfee',
            },
            {
                Header: t(langKeys.customerinitiatedcost),
                accessor: 'clientstartfee',
            },
            {
                Header: `${t(langKeys.first_plural)} 250k`,
                accessor: 'c250000',
            },
            {
                Header: `${t(langKeys.next_plural)} 750k`,
                accessor: 'c750000',
            },
            {
                Header: `${t(langKeys.next_plural)} 2 ${t(langKeys.millions)}`,
                accessor: 'c2000000',
            },
            {
                Header: `${t(langKeys.next_plural)} 3 ${t(langKeys.millions)}`,
                accessor: 'c3000000',
            },
            {
                Header: `${t(langKeys.next_plural)} 4 ${t(langKeys.millions)}`,
                accessor: 'c4000000',
            },
            {
                Header: `${t(langKeys.next_plural)} 5 ${t(langKeys.millions)}`,
                accessor: 'c5000000',
            },
            {
                Header: `${t(langKeys.next_plural)} 10 ${t(langKeys.millions)}`,
                accessor: 'c10000000',
            },
            {
                Header: `${t(langKeys.greaterthan)} 25 ${t(langKeys.millions)}`,
                accessor: 'c25000000',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConversationSel(dataMain)));


    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
        const callback = () => {
            dispatch(execute(billingConversationIns({ ...row, operation: 'DUPLICATE', id: 0 })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
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
                                label={t(langKeys.country)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.countrycode}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev=>({...prev,countrycode:value?.code||""}))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="code"
                            />
                            <Button
                                disabled={mainResult.mainData.loading}
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
const CostPerPeriod: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataMain, setdataMain] = useState({
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        billingplan: "",
        supportplan: "",
        corpid: user?.corpid || 0,
        orgid: 0,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });

    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : []
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : []
    const dataPlanList = dataPlan.data[0] && dataPlan.data[0].success? dataPlan.data[0].data : []
    const dataPaymentPlanList = dataPlan.data[3] && dataPlan.data[3].success? dataPlan.data[3].data : []

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let datetoshow = `${year}-${String(mes).padStart(2, '0')}`
        setdataMain(prev=>({...prev,datetoshow,year,month:mes}))
    }
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
                Header: t(langKeys.costbasedonthecontractedplan),
                accessor: 'basicfee',
            },
            {
                Header: t(langKeys.numberofagentshired),
                accessor: 'userfreequantity',
            },
            {
                Header: t(langKeys.numberofactivesupervisors),
                accessor: 'supervisorquantity',
            },
            {
                Header: t(langKeys.numberofactiveadvisers),
                accessor: 'asesorquantity',
            },
            {
                Header: t(langKeys.numberofactiveagents),
                accessor: 'userquantity',
            },            
            {
                Header: t(langKeys.useradditionalfee),
                accessor: 'useradditionalfee',
            },
            {
                Header: t(langKeys.useradditionalcharge),
                accessor: 'useradditionalcharge',
            },
            {
                Header: t(langKeys.channelfreequantity),
                accessor: 'channelfreequantity',
            },
            {
                Header: t(langKeys.channelwhatsappfee),
                accessor: 'channelwhatsappfee',
            },
            {
                Header: t(langKeys.channelwhatsappquantity),
                accessor: 'channelwhatsappquantity',
            },
            {
                Header: t(langKeys.channelwhatsappcharge),
                accessor: 'channelwhatsappcharge',
            },
            {
                Header: t(langKeys.channelotherfee),
                accessor: 'channelotherfee',
            },
            {
                Header: t(langKeys.channelotherquantity),
                accessor: 'channelotherquantity',
            },
            {
                Header: t(langKeys.channelothercharge),
                accessor: 'channelothercharge',
            },
            {
                Header: t(langKeys.channelcharge),
                accessor: 'channelcharge',
            },
            {
                Header: t(langKeys.conversationquantity),
                accessor: 'conversationquantity',
            },
            {
                Header: t(langKeys.conversationcompanywhatquantity),
                accessor: 'conversationcompanywhatquantity',
            },
            {
                Header: t(langKeys.conversationcompanywhatfee),
                accessor: 'conversationcompanywhatfee',
            },
            {
                Header: t(langKeys.conversationcompanywhatcharge),
                accessor: 'conversationcompanywhatcharge',
            },
            {
                Header: t(langKeys.conversationclientwhatquantity),
                accessor: 'conversationclientwhatquantity',
            },
            {
                Header: t(langKeys.conversationclientwhatfee),
                accessor: 'conversationclientwhatfee',
            },
            {
                Header: t(langKeys.conversationclientwhatcharge),
                accessor: 'conversationclientwhatcharge',
            },
            {
                Header: t(langKeys.conversationwhatcharge),
                accessor: 'conversationwhatcharge',
            },
            {
                Header: t(langKeys.interactionquantity),
                accessor: 'interactionquantity',
            },
            {
                Header: t(langKeys.clientfreequantity),
                accessor: 'clientfreequantity',
            },
            {
                Header: t(langKeys.clientquantity),
                accessor: 'clientquantity',
            },
            {
                Header: t(langKeys.clientadditionalfee),
                accessor: 'clientadditionalfee',
            },
            {
                Header: t(langKeys.clientadditionalcharge),
                accessor: 'clientadditionalcharge',
            },
            {
                Header: t(langKeys.supportbasicfee),
                accessor: 'supportbasicfee',
            },
            {
                Header: t(langKeys.totalcharge),
                accessor: 'totalcharge',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingPeriodSel(dataMain)));


    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
                                label={t(langKeys.billingplan)}
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
                                disabled={mainResult.mainData.loading}
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
const CostPerHSMPeriod: React.FC <{ dataPlan: any}> = ({ dataPlan }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataMain, setdataMain] = useState({
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        corpid: 0,
        orgid: 0,
    });
    const dataPlanList = dataPlan.data[0] && dataPlan.data[0].success? dataPlan.data[0].data : []
    const dataOrgList = dataPlan.data[1] && dataPlan.data[1].success? dataPlan.data[1].data : []
    const dataCorpList = dataPlan.data[2] && dataPlan.data[2].success? dataPlan.data[2].data : []

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let datetoshow = `${year}-${String(mes).padStart(2, '0')}`
        setdataMain(prev=>({...prev,datetoshow,year,month:mes}))
    }
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
            },
            {
                Header: t(langKeys.wacost),
                accessor: 'hsmcost',
            },
            {
                Header: t(langKeys.pucommissionVCA),
                accessor: 'hsmutilityfee',
            },
            {
                Header: t(langKeys.vcacommissioncost),
                accessor: 'hsmutility',
            },
            {
                Header: t(langKeys.hsmshippingcost),
                accessor: 'hsmcharge',
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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
                            <Button
                                disabled={mainResult.mainData.loading}
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
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let datetoshow = `${year}-${String(mes).padStart(2, '0')}`
        setdataMain(prev=>({...prev,datetoshow,year,month:mes}))
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
    }, [mainResult])

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
                                {`${t(langKeys.report)} ${t(langKeys.person)}`}
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
                        </Fragment>)
                    }
                </div>
            </div>
            {
                !mainResult.mainData.loading && mainResult.mainData.data.length && (
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
                                    <StyledTableCell align="right">{t(langKeys.rate)}</StyledTableCell>
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
                                        $ {datareport.basicfee?datareport.basicfee.toFixed(2):"0.00"}
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
                                            <div>{datareport.userfreequantity}</div>
                                            <div>{datareport.useradditionalquantity}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.useradditionalfee?datareport.useradditionalfee.toFixed(2):"0.00"}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>                                            
                                            <div>$ {datareport.useradditionalcharge ?datareport.useradditionalcharge.toFixed(2):"0.00"}</div>
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
                                            <div>{datareport.channelfreequantity}</div>
                                            <div>{datareport.channelwhatsappquantity}</div>
                                            <div>{datareport.channelotherquantity}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.channelwhatsappfee?datareport.channelwhatsappfee.toFixed(2):"0.00"}</div>
                                            <div>$ {datareport.channelotherfee?datareport.channelotherfee.toFixed(2):"0.00"}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.channelwhatsappcharge?datareport.channelwhatsappcharge.toFixed(2):"0.00"}</div>
                                            <div>$ {datareport.channelothercharge?datareport.channelothercharge.toFixed(2):"0.00"}</div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <div><b>{t(langKeys.contact_plural)}</b></div>
                                            <div>{t(langKeys.freecontacts)}</div>
                                            <div>{t(langKeys.total)} {t(langKeys.contact_plural)}</div>
                                            <div>{t(langKeys.additional)} {t(langKeys.contact_plural)}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>{datareport.clientfreequantity}</div>
                                            <div>{datareport.clientquantity}</div>
                                            <div>{datareport.clientadditionalquantity}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.clientadditionalfee?datareport.clientadditionalfee.toFixed(2):"0.00"}</div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div style={{color:"transparent"}}>.</div>
                                            <div>$ {datareport.clientadditionalcharge?datareport.clientadditionalcharge.toFixed(2):"0.00"}</div>
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
                                            {datareport.supportbasicfee?datareport.supportbasicfee.toFixed(2):"0.00"}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <div>{datareport.additionalservicename1}</div>
                                            <div>{datareport.additionalservicename2}</div>
                                            <div>{datareport.additionalservicename3}</div>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell  align="right">
                                            <div>$ {datareport.additionalservicefee1?datareport.additionalservicefee1.toFixed(2):"0.00"}</div>
                                            <div>$ {datareport.additionalservicefee2?datareport.additionalservicefee2.toFixed(2):"0.00"}</div>
                                            <div>$ {datareport.additionalservicefee3?datareport.additionalservicefee3.toFixed(2):"0.00"}</div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell >
                                            <b>{t(langKeys.periodamount)}</b>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell >
                                        </StyledTableCell>
                                        <StyledTableCell  align="right">
                                        $ {datareport.totalcharge?datareport.totalcharge.toFixed(2):"0.00"}
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
                                        <div>{datareport.userquantity}</div>
                                        <div>{t(langKeys.contact_plural)}</div>
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

const BillingSetup: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const countryListreq = useSelector(state => state.signup.countryList);    
    const multiData = useSelector(state => state.main.multiData);
    const [pageSelected, setPageSelected] = useState(user?.roledesc === "SUPERADMIN"?0:5);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);
    const [dataPlan, setdataPlan] = useState<any>([]);
    const [dataPaymentPlan, setdataPaymentPlan] = useState<any>([]);
    const [countryList, setcountryList] = useState<any>([]);
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
                    <AntTab label={t(langKeys.supportplan)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.contractedplanbyperiod)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.conversationcost)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.costperperiod)} />
                }
                {user?.roledesc === "SUPERADMIN" && 
                    <AntTab label={t(langKeys.costperHSMperiod)} />
                }
                <AntTab label={t(langKeys.periodreport)} />
            </Tabs>
            {pageSelected === 0 &&
                <div style={{ marginTop: 16 }}>
                    <SupportPlan dataPlan={dataPlan}/>
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
                    <CostPerPeriod dataPlan={multiData}/>
                </div>
            }
            {pageSelected === 4 &&
                <div style={{ marginTop: 16 }}>
                    <CostPerHSMPeriod dataPlan={multiData}/>
                </div>
            }
            {pageSelected === 5 &&
                <div style={{ marginTop: 16 }}>
                    <PeriodReport dataPlan={multiData}/>
                </div>
            }
        </div>
    );

}

export default BillingSetup;