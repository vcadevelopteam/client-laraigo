/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TableZyx from '../components/fields/table-simple';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons, TemplateBreadcrumbs, FieldEdit, FieldSelect, TitleDetail, FieldMultiSelectEmails } from 'components';
import { getDomainValueSel, getReportSchedulerSel, getValuesFromDomain, reportSchedulerIns, getReportschedulerreportsSel } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, getCollectionAux, resetMainAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Descendant } from 'slate';
import { RichText, renderToString, toElement } from 'components/fields/RichText';

interface RowSelected {
    row: Dictionary | null;
    domainname: string | "";
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void;
    arrayBread: any;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    subtitle: {
        fontWeight: "bold",
        fontSize: "20px",
        paddingBottom: "10px",
    },
    subtitle2: {
        fontWeight: "bold",
        fontSize: "15px",
        paddingBottom: "10px",
    },
    button: {
        marginRight: theme.spacing(2),
    }
}));

const DetailReportScheduler: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, arrayBread }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filters, setfilters] = useState<any[]>(row?.filterjson ? Object.entries(row.filterjson).reduce((acc: any, [key, value]) => [...acc, { "filter": key, "value": value }], []) : [])
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const [origin, setOrigin] = useState(row?.origin || '');
    const [bodyobject, setBodyobject] = useState<Descendant[]>(row?.mailbodyobject || [{ "type": "paragraph", "children": [{ "text": row?.mailbody || "" }] }])
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataReportSimpleAll = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataReportSimple = dataReportSimpleAll.filter(x => x.origin !== "TICKET")
    const dataRanges = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const [filterData, setfilterData] = useState(origin === "TICKET" ? JSON.parse(dataReportSimpleAll.filter(x => x.origin === "TICKET")?.[0].filterjson || "[]") : JSON.parse(dataReportSimple.find(x => (x.reportname === (row?.reportname)))?.filterjson || "[]").filter((x: any) => x.type !== "timestamp without time zone"));
    const [showError, setShowError] = useState("");

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.reportschedulerid || 0,
            title: row?.title || '',
            status: row?.status || 'ACTIVO',
            origin: row?.origin || '',
            origintype: row?.origintype || '',
            reportid: row?.reportid || 0,
            reportname: row?.reportname || '',
            filterjson: row?.filterjson || '',
            frecuency: row?.frecuency || '',
            group: row?.group || "",
            schedule: row?.schedule || "",
            datarange: row?.datarange || "",
            mailto: row?.mailto || "",
            mailcc: row?.mailcc || "",
            mailsubject: row?.mailsubject || "",
            mailbody: row?.mailbody || "",
            operation: row ? "EDIT" : "INSERT",
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('id');
        register('title', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('origin', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('origintype');
        register('reportname', { validate: (value) => (getValues("origin") === "REPORT" || getValues("origin") === "CAMPAIGN") ? (value && value.length) || t(langKeys.field_required) : true });
        register('frecuency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        //register('group', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('schedule', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('datarange', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('mailto', {
            validate: {
                validation: (value) => (value && value.length) || t(langKeys.field_required),
                isemail: (value) => (value.split(",").some((x: any) => x.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g))) || t(langKeys.emailverification)
            }
        });
        register('mailcc', {
            validate: {
                isemail: (value) => value ? (value.split(",").some((x: any) => x.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g))) || t(langKeys.emailverification) : true
            }
        });
        register('mailsubject', { validate: (value) => (value && value.length) || t(langKeys.field_required) });

        dispatch(resetMainAux());
        dispatch(getCollectionAux(getDomainValueSel((row?.domainname || ""))));
    }, [register]);

    function addfilter() {
        setfilters((p) => [...p, { filter: "", value: "" }])
    }
    function deleteitem(i: number) {
        setfilters(filters.filter((e, index) => index !== i))

    }
    function setValuefilter(field: string, value: string, i: number) {
        setfilters((p: Dictionary[]) => p.map((x, index) => index === i ? { ...x, [field]: value } : x))
    }

    const onSubmit = handleSubmit((data) => {
        data.mailbody = renderToString(toElement(bodyobject));
        if (data.mailbody === `<div data-reactroot=""><p><span></span></p></div>`) {
            setShowError(t(langKeys.field_required));
            return
        }

        setShowError("");

        const callback = () => {
            data.mailbody = renderToString(toElement(bodyobject));
            if (data.mailbody === '<div data-reactroot=""><p><span></span></p></div>')
                return;

            const filtertosend = filters.reduce((accumulator, element) => {
                return { ...accumulator, [element.filter]: element.value };
            }, {});

            dispatch(execute(reportSchedulerIns({ ...data, filterjson: JSON.stringify(filtertosend), mailbodyobject: bodyobject })));
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
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.reportscheduler_singular)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={edit ? (row ? `${row.title}` : `${t(langKeys.new)} ${t(langKeys.reportscheduler_singular)}`) : `${t(langKeys.new)} ${t(langKeys.reportscheduler_singular)}`}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}>
                            {t(langKeys.cancel)}
                        </Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}>
                                {t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.subtitle}>{t(langKeys.reportschedulerdetail1)}</div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.title)}
                            className="col-6"
                            valueDefault={row?.title || ""}
                            onChange={(value) => setValue('title', value)}
                            error={errors?.title?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={(value) => setValue('status', value?.domainvalue || '')}
                            error={errors?.status?.message}
                            data={dataDomainStatus}
                            optionDesc="domaindesc"
                            uset={true}
                            prefixTranslation="status_"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx">
                        {/* {value:"DASHBOARD", desc: t(langKeys.dashboard)},*/}
                        <FieldSelect
                            label={t(langKeys.origin)}
                            className="col-6"
                            valueDefault={getValues("origin")}
                            onChange={(value) => {
                                setOrigin(value?.value || '');
                                setValue('origin', value?.value || '')
                                setfilterData([])
                                if (value?.value === "TICKET") {
                                    setfilterData(JSON.parse(dataReportSimpleAll.filter(x => x.origin === "TICKET")?.[0].filterjson || "[]"))
                                }
                                if (value?.value !== "REPORT") {
                                    setfilters([])
                                }
                            }}
                            error={errors?.origin?.message}
                            data={[
                                { value: "REPORT", desc: t(langKeys.report_plural) },
                                { value: "TICKET", desc: t(langKeys.ticket_plural) },
                                { value: "CAMPAIGN", desc: t(langKeys.campaign_plural) },
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                        {!((origin !== "REPORT") && (origin !== "DASHBOARD")) && <FieldSelect
                            label={t(langKeys.report)}
                            className="col-6"
                            valueDefault={getValues("reportname")}
                            onChange={(value) => {
                                setValue('reportname', value?.reportname || '')
                                setValue('origintype', value?.origintype || '')
                                setValue('reportid', value?.reportid || 0)
                                setfilterData(JSON.parse(value?.filterjson || "[]").filter((x: any) => x.type !== "timestamp without time zone"))
                                setfilters([])
                            }}
                            error={errors?.reportname?.message}
                            disabled={(origin !== "REPORT") && (origin !== "DASHBOARD")}
                            data={dataReportSimple}
                            optionDesc="reportname"
                            optionValue="reportname"
                            uset={true}
                            prefixTranslation=""
                        />}
                        {!((origin !== "CAMPAIGN") && (origin !== "DASHBOARD")) && <FieldSelect
                            label={t(langKeys.reporttype)}
                            className="col-6"
                            valueDefault={getValues("reportname")}
                            onChange={(value) => {
                                setValue('reportname', value?.value || '');
                                setValue('origintype', 'STANDARD');
                                setValue('reportid', 0);
                                setfilterData(JSON.parse("[]").filter((x: any) => x.type !== "timestamp without time zone"))
                                setfilters([])
                            }}
                            error={errors?.reportname?.message}
                            disabled={(origin !== "CAMPAIGN") && (origin !== "DASHBOARD")}
                            data={[
                                { value: "DEFAULT", desc: t(langKeys.defaulttype) },
                                { value: "PROACTIVE", desc: t(langKeys.proactivetype) },
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />}
                    </div>
                    {((filterData && filters) && (filterData.length > 0)) && <div className="row-zyx">

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={classes.subtitle2}>{t(langKeys.filters)}</div>
                            <div>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    endIcon={<AddIcon style={{ color: "#deac32" }} />}
                                    style={{ backgroundColor: "#6c757d" }}
                                    onClick={() => addfilter()}
                                >{t(langKeys.addfilter)}
                                </Button>
                            </div>
                        </div>
                        {filters.map((x, i) => (
                            <div className="row-zyx" key={i}>
                                <FieldSelect
                                    label={t(langKeys.filter)}
                                    className="col-6"
                                    valueDefault={x?.filter || ""}
                                    onChange={(value) => {
                                        setValuefilter('filter', value.columnname, i)
                                    }}
                                    data={filterData}
                                    optionDesc="columnname"
                                    optionValue="columnname"
                                    uset={true}
                                    prefixTranslation="personalizedreport_"
                                />
                                <FieldEdit
                                    label={t(langKeys.value)}
                                    className="col-5"
                                    valueDefault={x?.value || ""}
                                    onChange={(value) => setValuefilter('value', value, i)}
                                />
                                <div className="col-1" style={{ paddingTop: "15px" }}>
                                    <IconButton aria-label="delete" onClick={() => deleteitem(i)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>}
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.periodicity)}
                            className="col-6"
                            valueDefault={getValues("frecuency")}
                            onChange={(value) => setValue('frecuency', value?.value || '')}
                            error={errors?.frecuency?.message}
                            data={[
                                { value: "DAY", desc: t(langKeys.day) },
                                { value: "WEEK", desc: t(langKeys.week) },
                                { value: "MONTH", desc: t(langKeys.month) },
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                        {
                            /*<FieldSelect
                            label={t(langKeys.group)}
                            className="col-6"
                            valueDefault={getValues("group")}
                            onChange={(value) => setValue('group', value?.value || '')}
                            error={errors?.group?.message}
                            data={[
                                {value:"day", desc: t(langKeys.day)},
                                {value:"week", desc: t(langKeys.week)},
                                {value:"month", desc: t(langKeys.month)},
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />*/}
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.shippingschedule)}
                            className="col-6"
                            type="time"
                            valueDefault={getValues("schedule")}
                            onChange={(value) => setValue('schedule', value)}
                            error={errors?.schedule?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.shippingrange)}
                            className="col-6"
                            valueDefault={getValues("datarange")}
                            onChange={(value) => setValue('datarange', value?.domainvalue || '')}
                            error={errors?.datarange?.message}
                            data={dataRanges}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            prefixTranslation="datarange_"
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.subtitle}>{t(langKeys.reportschedulerdetail2)}</div>
                    <div className="row-zyx">
                        <FieldMultiSelectEmails
                            label={t(langKeys.to)}
                            className="col-12"
                            valueDefault={getValues("mailto")}
                            onChange={(value: ({ domaindesc: string } | string)[]) => {
                                const mailto = value.map((o: any) => o.domaindesc || o).join();
                                setValue('mailto', mailto);
                            }}
                            data={[].concat(getValues('mailto').split(',').filter((i: any) => i !== '').map((domaindesc: any) => ({ domaindesc })))}
                            optionValue={"domaindesc"}
                            optionDesc={"domaindesc"}
                            error={errors?.mailto?.message}
                            loading={false}
                        />
                        <FieldMultiSelectEmails
                            label={"Cc"}
                            className="col-12"
                            valueDefault={getValues("mailcc")}
                            onChange={(value: ({ domaindesc: string } | string)[]) => {
                                const mailcc = value.map((o: any) => o.domaindesc || o).join();
                                setValue('mailcc', mailcc);
                            }}
                            data={[].concat(getValues('mailcc').split(',').filter((i: any) => i !== '').map((domaindesc: any) => ({ domaindesc })))}
                            optionValue={"domaindesc"}
                            optionDesc={"domaindesc"}
                            error={errors?.mailcc?.message}
                            loading={false}
                        />
                        <FieldEdit
                            label={t(langKeys.subject)}
                            className="col-12"
                            valueDefault={row?.mailsubject || ""}
                            onChange={(value) => setValue('mailsubject', value)}
                            error={errors?.mailsubject?.message}
                        />
                        <div className="row-zyx">
                            <React.Fragment>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.body)}</Box>
                                <RichText
                                    value={bodyobject}
                                    onChange={(value) => {
                                        setBodyobject(value)
                                    }}
                                    spellCheck
                                    onlyurl={true}
                                />
                            </React.Fragment>
                        </div>
                        <FieldEdit
                            label={''}
                            className="col-12"
                            valueDefault={''}
                            error={showError}
                            disabled={true}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const ReportScheduler: FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = (user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v));

    const arrayBread = [
        { id: "view-1", name: t(langKeys.reportscheduler) },
    ];
    function redirectFunc(view: string) {
        if (view === "view-0") {
            history.push(paths.CONFIGURATION)
            return;
        }
        setViewSelected(view)
    }
    const columns = React.useMemo(
        () => [
            {
                accessor: 'reportschedulerid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.name),
                accessor: 'title',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: `${t(langKeys.report_plural)} ${t(langKeys.sent_plural)}`,
                accessor: 'reportname',
                NoFilter: true,
                Cell: (props: any) => {
                    const { reportname, origin } = props.cell.row.original;
                    return (t(`${reportname ? (origin === "CAMPAIGN" ? `${origin}_${reportname}` : reportname) : origin}`.toLowerCase()) || "").toUpperCase()
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getReportSchedulerSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getReportschedulerreportsSel(),
            getValuesFromDomain("REPORTEAUTOMATICORANGO"),
        ]));

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, domainname: "", edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, domainname: row.domainname, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, domainname: row.domainname, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(reportSchedulerIns({ ...row, id: row.reportschedulerid, operation: 'DELETE', status: 'ELIMINADO' })));
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

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <div style={{ width: "100%" }}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.reportscheduler, { count: 2 })}
                    data={mainResult.mainData.data}
                    download={false}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    register={superadmin}
                    handleRegister={handleRegister}
                />
            </div>
        )
    }
    else
        return (
            <DetailReportScheduler
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
}

export default ReportScheduler;