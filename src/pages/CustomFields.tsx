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
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, FieldView, FieldEdit, FieldSelect, TemplateSwitch } from 'components';
import { getDomainValueSel, getDomainSel, getValuesFromDomain, insDomain, insDomainvalue } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, getCollectionAux, resetMainAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Tooltip } from '@material-ui/core';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

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
        // marginTop: theme.spacing(2),
        // marginRight: theme.spacing(2),
        // padding: theme.spacing(2),
        // background: '#fff',
        width: '100%'
    },
    button: {
        marginRight: theme.spacing(2),
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    }
}));

const DetailValue: React.FC<ModalProps> = ({ data: { row, domainname, edit }, dataDomain, openModal, setOpenModal, updateRecords }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const { register, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm();
    const onSubmit = handleSubmit((data) => {
        if (!edit && dataDomain && dataDomain.some(d => d.domainvalue === data.domainvalue)) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.code_duplicate) }))
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
            title={`${t(langKeys.register)} ${t(langKeys.custom_field)}`}
            buttonText1={t(langKeys.cancel)}
            maxWidth="lg"
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.application)}
                    disabled={true}
                    className="col-3"
                    valueDefault={row?.domainname || domainname}
                    onChange={(value) => setValue('domainname', value)}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.custom_field)}
                    className="col-3"
                    valueDefault={getValues('domainvalue')}
                    onChange={(value) => setValue('domainvalue', value)}
                    error={errors?.domainvalue?.message}
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    className="col-3"
                    valueDefault={getValues('domaindesc')}
                    onChange={(value) => setValue('domaindesc', value)}
                    error={errors?.domaindesc?.message}
                />
                <FieldSelect
                    label={t(langKeys.ticket_reason)}
                    className="col-3"
                    valueDefault={getValues('domainvalue')}
                    onChange={(value) => setValue('domainvalue', value ? value.domainvalue : '')}
                    error={errors?.domainvalue?.message}
                    data={[]}
                    optionValue='a'
                    optionDesc='b'
                />
                <FieldSelect
                    label={t(langKeys.status)}
                    className="col-3"
                    valueDefault={getValues('domainvalue')}
                    onChange={(value) => setValue('domainvalue', value ? value.domainvalue : '')}
                    error={errors?.domainvalue?.message}
                    data={[]}
                    optionValue='a'
                    optionDesc='b'
                />
            </div>
        </DialogZyx>
    );
}

const DetailCustomFields: React.FC<DetailProps> = ({ data: { row, domainname, edit }, setViewSelected, multiData, fetchData, arrayBread }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const useradmin = (user?.roledesc ?? "").split(",").some(v => ["ADMINISTRADOR", "ADMINISTRADOR P"].includes(v));
    const newrow = row === null
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const detailRes = useSelector(state => state.main.mainAux);
    const [dataDomain, setdataDomain] = useState<Dictionary[]>([]);
    const [domainToDelete, setDomainToDelete] = useState<Dictionary[]>([]);
    const [openDialogDomain, setOpenDialogDomain] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDomainType = multiData[0] && multiData[1].success ? (useradmin ? multiData[1].data.filter(x => x.domainvalue === "BOT") : multiData[1].data) : [];

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
                Header: t(langKeys.custom_field),
                accessor: 'domainvalue',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'domaindesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'bydefault',
                NoFilter: true,
            },
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

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.domainid || 0,
            operation: row ? "EDIT" : "INSERT",
            description: row?.description || '',
            corporation: row?.corpdesc || '',
            organization: row?.orgdesc || '',
            domainname: row?.domainname || '',
            type: row?.type || '',
            status: row?.status || 'ACTIVO'
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
        register('domainname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });

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
                    ...domainToDelete.map(x => insDomainvalue({ ...x, id: x.domainid, description: data.description, type: data.type }))
                ]
            }, true));

            setWaitSave(true);
        }
        if (!!dataDomain.length) {
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        } else {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.errorneedvalues) }))
        }
    });
    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.custom_fields)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
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
                    <Accordion defaultExpanded={true} expanded={!row ? true : undefined} style={{ marginBottom: '8px' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography style={{ fontWeight: 'bold' }}>{t(langKeys.custom_fields_of)}{"Personas"}</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ justifyContent: 'space-around' }}>
                            <div className={classes.containerDetail}>
                                <div className="row-zyx">
                                    <FieldEdit
                                        label={t(langKeys.application)}
                                        className="col-6"
                                        disabled={true}
                                        valueDefault={row?.domainname || ""}
                                        onChange={(value) => setValue('domainname', value)}
                                        error={errors?.domainname?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.description)}
                                        className="col-6"
                                        disabled={true}
                                        valueDefault={row?.description || ""}
                                        onChange={(value) => setValue('description', value)}
                                        error={errors?.description?.message}
                                    />
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </form>

            <div className={classes.containerDetail}>
                <Accordion expanded={true} style={{ marginBottom: '8px' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Tooltip title={t(langKeys.custom_fields_list_helper)}>
                            <Typography style={{ fontWeight: 'bold' }}>{t(langKeys.custom_fields_list)}</Typography>
                        </Tooltip>
                        <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.custom_fields_list_helper)}</div>} arrow placement="top" >
                            <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                        </Tooltip>
                    </AccordionSummary>
                    <AccordionDetails>
                        {detailRes.error ? <h1>ERROR</h1> : (
                            <TableZyx
                                columns={columns}
                                data={dataDomain}
                                download={false}
                                onClickRow={handleEdit}
                                loading={detailRes.loading}
                                filterGeneral={false}
                                register={true}
                                pageSizeDefault={10}
                                handleRegister={handleRegister}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
            </div>

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

const CustomFields: FC = () => {
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
        { id: "view-1", name: t(langKeys.custom_fields) },
    ];
    function redirectFunc(view: string) {
        setViewSelected(view)
    }
    const columns = React.useMemo(
        () => [
            {
                accessor: 'domainid',
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
                Header: t(langKeys.application),
                helpText: t(langKeys.application_helper),
                accessor: 'domainname',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getDomainSel('')));

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
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.custom_fields)}
                    helperText={t(langKeys.custom_fields_helper)}
                    data={mainResult.mainData.data}
                    download={true}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    register={false}
                    handleRegister={handleRegister}
                />
            </div>
        )
    }
    else
        return (
            <DetailCustomFields
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
}

export default CustomFields;