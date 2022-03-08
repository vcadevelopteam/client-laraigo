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
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, FieldView, FieldEdit, FieldSelect, TemplateSwitch, TitleDetail, FieldMultiSelect, RichText } from 'components';
import { getDomainValueSel, getReportSchedulerSel, getValuesFromDomain, reportSchedulerIns } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, getCollectionAux, resetMainAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import Box from '@material-ui/core/Box';
import { IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Descendant } from 'slate';
import { renderToString, toElement } from 'components/fields/RichText';

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

interface ModalProps {
    data: RowSelected;
    dataDomain: Dictionary[] | null;
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    updateRecords?: (record: any) => void;
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

const DetailValue: React.FC<ModalProps> = ({ data: { row, domainname, edit }, dataDomain, openModal, setOpenModal, updateRecords }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const { register, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm();
    const onSubmit = handleSubmit((data) => {
        if (!edit && dataDomain && dataDomain.some(d => d.domainvalue === data.domainvalue)) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.code_duplicate) }))
        }
        else {
            if (edit)
                updateRecords && updateRecords((p: Dictionary[]) => p.map(x => x.domainvalue === row?.domainvalue || '' ? { ...x, ...data, operation: (x.operation || "UPDATE") } : x));
            else
                updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, organization: user?.orgdesc || '', status: row?.status || 'ACTIVO', operation: "INSERT" }]);

            setOpenModal(false);
        }
    });

    useEffect(() => {
        if (openModal) {
            reset({
                domaindesc: row?.domaindesc || '',
                domainvalue: row?.domainvalue || '',
                bydefault: row?.bydefault || false,
                status: row?.status || 'ACTIVO',
                organization: user?.orgdesc || ''
            })

            register('domainvalue', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('domaindesc', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        }
    }, [openModal])

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.registervalue)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                {
                    <FieldEdit
                        label={t(langKeys.domain)}
                        disabled={true}
                        className="col-6"
                        valueDefault={row?.domainname || domainname}
                        onChange={(value) => setValue('domainname', value)}
                    />
                }
                {false &&
                    <TemplateSwitch
                        label={t(langKeys.bydefault)}
                        className="col-6"
                        valueDefault={getValues('bydefault')}
                        onChange={(value) => setValue('bydefault', value)}
                    />
                }
            </div>
            <div className="row-zyx">
                {
                    <FieldEdit
                        label={t(langKeys.code)}
                        disabled={edit ? true : false}
                        className="col-6"
                        valueDefault={getValues('domainvalue')}
                        onChange={(value) => setValue('domainvalue', value)}
                        error={errors?.domainvalue?.message}
                    />
                }
                {
                    <FieldEdit
                        label={t(langKeys.description)}
                        className="col-6"
                        valueDefault={getValues('domaindesc')}
                        onChange={(value) => setValue('domaindesc', value)}
                        error={errors?.domaindesc?.message}
                    />
                }
            </div>
        </DialogZyx>
    );
}

const DetailReportScheduler: React.FC<DetailProps> = ({ data: { row, domainname, edit }, setViewSelected, multiData, fetchData,arrayBread }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filters, setfilters] = useState<any[]>(row?.filterjson ? Object.entries(row.filterjson).reduce((acc:any,[key,value]) => [...acc, {"filter": key, "value": value} ] ,[]): [])
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const [origin, setOrigin] = useState(row?.origin || '');
    const [bodyobject, setBodyobject] = useState<Descendant[]>(row?.bodyobject || [{ "type": "paragraph", "children": [{ "text": row?.body || "" }] }])
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataReportSimple = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataRanges = multiData[2] && multiData[2].success ? multiData[2].data : [];

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
            schedule: row?.schedule || 0,
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
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
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
        register('reportname', { validate: (value) => (origin!=="REPORT")?(value && value.length) || t(langKeys.field_required):true });
        register('frecuency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('group', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('schedule', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('datarange', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('mailto', { validate: {
            validation: (value) => (value && value.length) || t(langKeys.field_required) ,
            isemail: (value)=> (value.includes('.') && value.includes('@')) || t(langKeys.emailverification)
        }});
        register('mailcc', { validate: {
            validation: (value) => (value && value.length) || t(langKeys.field_required) ,
            isemail: (value)=> (value.includes('.') && value.includes('@')) || t(langKeys.emailverification)
        }});
        register('mailsubject', { validate: (value) => (value && value.length) || t(langKeys.field_required) });

        dispatch(resetMainAux());
        dispatch(getCollectionAux(getDomainValueSel((row?.domainname || ""))));
    }, [register]);
    React.useEffect(() => {
        console.log(errors)
    }, [errors]);

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
        if (data.mailbody === `<div data-reactroot=""><p><span></span></p></div>`)
            return

        const callback = () => {
            data.mailbody = renderToString(toElement(bodyobject));
            if (data.mailbody === '<div data-reactroot=""><p><span></span></p></div>')
                return;
                
            const filtertosend = filters.length? filters.reduce(x => ({[x.filter]: x.value})): {}
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
        <div style={{width: "100%"}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread,{ id: "view-2", name: `${t(langKeys.reportscheduler_singular)} ${t(langKeys.detail)}` }]}
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
                            {t(langKeys.back)}
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
                        {/* {value:"DASHBOARD", desc: t(langKeys.dashboard)},*/ }
                        <FieldSelect
                            label={t(langKeys.origin)}
                            className="col-6"
                            valueDefault={getValues("origin")}
                            onChange={(value) =>{ setOrigin(value?.value || '');setValue('origin', value?.value || '')}}
                            error={errors?.origin?.message}
                            data={[
                                {value:"REPORT", desc: t(langKeys.report_plural)},
                               
                                {value:"TICKET", desc: t(langKeys.ticket_plural)},
                                {value:"CAMPAIGN", desc: t(langKeys.campaign_plural)},
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                        {!((origin!=="REPORT") && (origin!=="DASHBOARD")) && <FieldSelect
                            label={t(langKeys.report)}
                            className="col-6"
                            valueDefault={row?.reportname || ""}
                            onChange={(value) => setValue('reportname', value?.domainvalue || '')}
                            error={errors?.reportname?.message}
                            disabled={(origin!=="REPORT") && (origin!=="DASHBOARD")}
                            data={dataReportSimple}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />}
                    </div>
                    {(origin && origin !== "CAMPAIGN") &&<div className="row-zyx">
                        
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
                        {filters.map((x,i)=> (
                            <div className="row-zyx" key={i}>                                
                                <FieldSelect
                                    label={t(langKeys.filter)}
                                    className="col-5"
                                    valueDefault={x?.filter || ""}
                                    onChange={(value) => setValuefilter('filter', value.domainvalue, i)}
                                    data={[]}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <FieldEdit
                                    label={t(langKeys.value)}
                                    className="col-6"
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
                                {value:"DAY", desc: t(langKeys.day)},
                                {value:"WEEK", desc: t(langKeys.week)},
                                {value:"MONTH", desc: t(langKeys.month)},
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                        <FieldSelect
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
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.shippingschedule)}
                            className="col-6"
                            valueDefault={getValues("schedule")}
                            onChange={(value) => setValue('schedule', value?.value || "")}
                            error={errors?.schedule?.message}
                            data={[
                                {value: "00:00:00", desc: "00:00"},
                                {value: "01:00:00", desc: "01:00"},
                                {value: "02:00:00", desc: "02:00"},
                                {value: "03:00:00", desc: "03:00"},
                                {value: "04:00:00", desc: "04:00"},
                                {value: "05:00:00", desc: "05:00"},
                                {value: "06:00:00", desc: "06:00"},
                                {value: "07:00:00", desc: "07:00"},
                                {value: "08:00:00", desc: "08:00"},
                                {value: "09:00:00", desc: "09:00"},
                                {value: "10:00:00", desc: "10:00"},
                                {value: "11:00:00", desc: "11:00"},
                                {value: "12:00:00", desc: "12:00"},
                                {value: "13:00:00", desc: "13:00"},
                                {value: "14:00:00", desc: "14:00"},
                                {value: "15:00:00", desc: "15:00"},
                                {value: "16:00:00", desc: "16:00"},
                                {value: "17:00:00", desc: "17:00"},
                                {value: "18:00:00", desc: "18:00"},
                                {value: "19:00:00", desc: "19:00"},
                                {value: "20:00:00", desc: "20:00"},
                                {value: "21:00:00", desc: "21:00"},
                                {value: "22:00:00", desc: "22:00"},
                                {value: "23:00:00", desc: "23:00"},
                            ]}
                            optionDesc="value"
                            optionValue="desc"
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
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.subtitle}>{t(langKeys.reportschedulerdetail2)}</div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.to)}
                            className="col-12"
                            valueDefault={row?.to || ""}
                            onChange={(value) => setValue('mailto', value)}
                            error={errors?.mailto?.message}
                        />
                        <FieldEdit
                            label="Cc"
                            className="col-12"
                            valueDefault={row?.mailcc || ""}
                            onChange={(value) => setValue('mailcc', value)}
                            error={errors?.mailcc?.message}
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
                                />
                            </React.Fragment>
                        </div>
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
    const superadmin = user?.roledesc === "SUPERADMIN" || user?.roledesc === "ADMINISTRADOR"

    const arrayBread = [
        { id: "view-1", name: t(langKeys.reportscheduler) },
    ];
    function redirectFunc(view:string){
        if(view ==="view-0"){
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
                Header: `${t(langKeys.report_plural)}/${t(langKeys.dashboard_plural)}  ${t(langKeys.sent)}`,
                accessor: 'reportname',
                NoFilter: true
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getReportSchedulerSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("REPORTEAUTOMATICOESTANDAR"),
            getValuesFromDomain("REPORTEAUTOMATICORANGO"),
        ]));

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
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
            dispatch(execute(reportSchedulerIns({ ...row, id: row.reportschedulerid ,operation: 'DELETE', status: 'ELIMINADO' })));
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
            <div style={{width:"100%"}}>
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