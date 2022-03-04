/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TableZyx from '../components/fields/table-simple';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, FieldView, FieldEdit, FieldSelect, TemplateSwitch, TitleDetail, FieldMultiSelect } from 'components';
import { getDomainValueSel, getReportSchedulerSel, getValuesFromDomain, insDomain, insDomainvalue } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, getCollectionAux, resetMainAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import Box from '@material-ui/core/Box';
import { TextField } from '@material-ui/core';

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
    const user = useSelector(state => state.login.validateToken.user);
    const useradmin = user?.roledesc === "ADMINISTRADOR"
    const newrow = row===null
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const detailRes = useSelector(state => state.main.mainAux);
    const [dataDomain, setdataDomain] = useState<Dictionary[]>([]);
    const [domainToDelete, setDomainToDelete] = useState<Dictionary[]>([]);
    const [openDialogDomain, setOpenDialogDomain] = useState(false);
    const [origin, setOrigin] = useState('');
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDomainType = multiData[0] && multiData[1].success ? (useradmin?multiData[1].data.filter(x=>x.domainvalue === "BOT"):multiData[1].data) : [];

    const columns = React.useMemo(
        () => [
            {
                accessor: 'domainid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    if (!edit)
                        return null;
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
                Header: t(langKeys.code),
                accessor: 'domainvalue',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'domaindesc',
                NoFilter: true
            },
            /*{
                Header: t(langKeys.bydefault),
                accessor: 'bydefault',
                NoFilter: true,
                Cell: (prop: any) => {
                    const row = prop.cell.row.original;
                    const val = (row ? (row.bydefault ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative))
                    return val;
                }
            },*/
            {
                Header: t(langKeys.organization),
                accessor: 'organization',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                prefixTranslation: 'status_',
                accessor: 'status',
                NoFilter: true
            }
        ],
        []
    );

    useEffect(() => {
        if (!detailRes.loading && !detailRes.error) {
            setdataDomain(detailRes.data);
        }
    }, [detailRes]);

    const handleRegister = () => {
        setOpenDialogDomain(true)
        setRowSelected({ row, domainname, edit: false });
    }

    const handleDelete = (row: Dictionary) => {
        if (row && row.operation !== "INSERT") {
            setDomainToDelete(p => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);
        } else {
            row.operation = 'DELETE';
        }

        setdataDomain(p => p.filter(x => (row.operation === "DELETE" ? x.operation !== "DELETE" : row.domainid !== x.domainid)));
    }

    const handleView = (row: Dictionary) => {
        setOpenDialogDomain(true)
        setRowSelected({ row, domainname, edit: false })
    }

    const handleEdit = (row: Dictionary) => {
        setOpenDialogDomain(true)
        setRowSelected({ row, domainname, edit: true })
    }

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.domainid || 0,
            title: row?.title || '',
            status: row?.status || 'ACTIVO',
            origin: row?.origin || '',
            origintype: row?.origintype || '',
            reportid: row?.reportid || '',
            reportname: row?.reportname || '',
            filters: row?.filters || '',
            periodicity: row?.periodicity || '',
            group: row?.group || "",
            shippingschedule: row?.shippingschedule || 0,
            shippingrange: row?.shippingrange || "",
            to: row?.to || "",
            cc: row?.cc || "",
            subject: row?.subject || "",
            body: row?.body || "",
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
        register('reportid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('reportname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('filters', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('periodicity', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('group', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('shippingschedule', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('shippingrange', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('to', { validate: {
            validation: (value) => (value && value.length) || t(langKeys.field_required) ,
            isemail: (value)=> (value.includes('.') && value.includes('@')) || t(langKeys.emailverification)
        }});
        register('cc', { validate: {
            validation: (value) => (value && value.length) || t(langKeys.field_required) ,
            isemail: (value)=> (value.includes('.') && value.includes('@')) || t(langKeys.emailverification)
        }});
        register('subject', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });

        dispatch(resetMainAux());
        dispatch(getCollectionAux(getDomainValueSel((row?.domainname || ""))));
    }, [register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute({
                header: insDomain({ ...data }),
                detail: [
                    ...dataDomain.filter(x => !!x.operation).map(x => insDomainvalue({ ...data, ...x, status: data?.status, id: x.domainid ? x.domainid : 0 })),
                    ...domainToDelete.map(x => insDomainvalue({ ...x, id: x.domainid }))
                ]
            }, true));

            setWaitSave(true);
        }
        if(!!dataDomain.length){
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }else{
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.errorneedvalues) }))
        }
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
                            title={edit ? (row ? `${row.domainname}` : `${t(langKeys.new)} ${t(langKeys.reportscheduler_singular)}`) : `${t(langKeys.new)} ${t(langKeys.reportscheduler_singular)}`}
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
                        <FieldSelect
                            label={t(langKeys.origin)}
                            className="col-6"
                            valueDefault={getValues("origin")}
                            onChange={(value) =>{ setOrigin(value?.value || '');setValue('origin', value?.value || '')}}
                            error={errors?.origin?.message}
                            data={[
                                {value:"REPORT", desc: t(langKeys.report_plural)},
                                {value:"DASHBOARD", desc: t(langKeys.dashboard)},
                                {value:"TICKET", desc: t(langKeys.ticket_plural)},
                                {value:"CAMPAIGN", desc: t(langKeys.campaign_plural)},
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                        {!((origin!=="REPORT") && (origin!=="DASHBOARD")) && (
                            <FieldSelect
                                label={t(langKeys.origintype)}
                                className="col-6"
                                valueDefault={getValues("origintype")}
                                onChange={(value) =>{ setValue('origintype', value?.value || '')}}
                                error={errors?.origintype?.message} 
                                disabled={(origin!=="REPORT") && (origin!=="DASHBOARD")}
                                data={[
                                    {value:"SIMPLE", desc: "Simple"},
                                    {value:"CUSTOM", desc: t(langKeys.custom)},
                                ]}
                                optionDesc="desc"
                                optionValue="value"
                            />
                        )}
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={`${t(langKeys.report)}/${t(langKeys.dashboard)}`}
                            className="col-6"
                            valueDefault={row?.reportid || ""}
                            onChange={(value) => setValue('reportid', value?.value || '')}
                            error={errors?.reportid?.message}
                            disabled={(origin!=="REPORT") && (origin!=="DASHBOARD")}
                            data={[]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                        <FieldMultiSelect
                            label={t(langKeys.filters)}
                            className="col-6"
                            valueDefault={getValues('filters')}
                            onChange={(value) => setValue('filters', value.map((o: Dictionary) => o.domainvalue).join())}
                            error={errors?.filters?.message}
                            disabled={(origin!=="report") && (origin!=="dashboard")}
                            data={[]}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.periodicity)}
                            className="col-6"
                            valueDefault={row?.periodicity || ""}
                            onChange={(value) => setValue('periodicity', value?.value || '')}
                            error={errors?.periodicity?.message}
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
                            valueDefault={row?.group || ""}
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
                        <FieldEdit
                            label={t(langKeys.shippingschedule)}
                            className="col-6"
                            type="time"
                            valueDefault={row?.shippingschedule || ""}
                            onChange={(value) => setValue('shippingschedule', value)}
                            error={errors?.shippingschedule?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.shippingrange)}
                            className="col-6"
                            valueDefault={row?.shippingrange || ""}
                            onChange={(value) => setValue('shippingrange', value?.value || '')}
                            error={errors?.shippingrange?.message}
                            data={[
                                {value:"YESTERDAY", desc: t(langKeys.yesterday)},
                                {value:"BEFOREYESTERDAY", desc: t(langKeys.beforeyesterday)},
                                {value:"3DAYSAGO", desc: t(langKeys.threedaysago)},
                                {value:"1WEEKAGO", desc: t(langKeys.weekago)},
                                {value:"1MONTHAGO", desc: t(langKeys.monthago)},
                                {value:"1YEARAGO", desc: t(langKeys.yearago)},
                            ]}
                            optionDesc="desc"
                            optionValue="value"
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
                            onChange={(value) => setValue('to', value)}
                            error={errors?.to?.message}
                        />
                        <FieldEdit
                            label="Cc"
                            className="col-12"
                            valueDefault={row?.cc || ""}
                            onChange={(value) => setValue('cc', value)}
                            error={errors?.cc?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.subject)}
                            className="col-12"
                            valueDefault={row?.subject || ""}
                            onChange={(value) => setValue('subject', value)}
                            error={errors?.subject?.message}
                        />
                        <div className="col-12">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.body)}</Box>
                            <TextField
                                color="primary"
                                fullWidth
                                multiline
                                rows={8}
                                value={row?.body || ""}
                                variant={"outlined"}
                                error={!!errors?.body?.message}
                                helperText={errors?.body?.message || null}
                                onChange={(e) => {
                                    setValue('body', e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <DetailValue
                data={rowSelected}
                openModal={openDialogDomain}
                setOpenModal={setOpenDialogDomain}
                updateRecords={setdataDomain}
                dataDomain={dataDomain}
            />
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
            getValuesFromDomain("TIPODOMINIO")
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
            dispatch(execute(insDomain({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
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