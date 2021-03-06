/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, TemplateSwitch } from 'components';
import { getDomainValueSel, getDomainSel, getValuesFromDomain, insDomain, insDomainvalue } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import {
    getCollection, resetMain, getMultiCollection,
    execute, getCollectionAux, resetMainAux,
} from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void
}
interface ModalProps {
    data: RowSelected;
    multiData: MultiData[];
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    updateRecords?: (record: any) => void;
}
const arrayBread = [
    { id: "view-1", name: "Domains" },
    { id: "view-2", name: "Domain detail" }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        // maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
}));
const DetailValue: React.FC<ModalProps> = ({ data: { row, edit }, multiData, openModal, setOpenModal, updateRecords }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const onSubmit = handleSubmit((data) => {
        if (!row)
            updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, operation: "INSERT" }])
        else
            updateRecords && updateRecords((p: Dictionary[]) => p.map(x => x.domainid === row.domainid ? { ...x, ...data, operation: (x.operation || "UPDATE") } : x))
        setOpenModal(false)
    });

    useEffect(() => {
        if (openModal) {
            reset({
                domaindesc: row?.domaindesc || '',
                domainvalue: row?.domainvalue || '',
                bydefault: row?.bydefault || false,
                status: 'ACTIVO'
            })

            register('domainvalue', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            register('domaindesc', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            register('bydefault');
            register('status');
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
                {edit ?
                    <FieldEdit
                        label={t(langKeys.domain)}
                        disabled={true}
                        className="col-6"
                        valueDefault={row?.domainname || ""}
                        onChange={(value) => setValue('domainname', value)}
                        error={errors?.domainvalue?.message}
                    /> :
                    <FieldView
                        label={t(langKeys.domain)}
                        value={row?.domainname || ""}
                        className="col-6"
                    />}
            </div>
            <div className="row-zyx">
                {edit ?
                    <FieldEdit
                        label={t(langKeys.code)}
                        className="col-6"
                        valueDefault={row?.domainvalue || ""}
                        onChange={(value) => setValue('domainvalue', value)}
                        error={errors?.domainvalue?.message}
                    /> :
                    <FieldView
                        label={t(langKeys.code)}
                        value={row?.domainvalue || ""}
                        className="col-6"
                    />}
                {edit ?
                    <FieldEdit
                        label={t(langKeys.description)}
                        className="col-6"
                        valueDefault={row?.domaindesc || ""}
                        onChange={(value) => setValue('domaindesc', value)}
                        error={errors?.domaindesc?.message}
                    /> :
                    <FieldView
                        label={t(langKeys.description)}
                        value={row?.domaindesc || ""}
                        className="col-6"
                    />
                }
            </div>
            <div className="row-zyx">
                {edit ?
                    <TemplateSwitch
                        label={t(langKeys.bydefault)}
                        className="col-6"
                        onChange={(value) => setValue('bydefault', !!value.bydefault)}
                    /> :
                    <FieldView
                        label={t(langKeys.bydefault)}
                        value={row ? (row.bydefault ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                        className={classes.mb2}
                    />
                }
            </div>
        </DialogZyx>
    );
}

const DetailDomains: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const detailRes = useSelector(state => state.main.mainAux); //RESULTADO DEL DETALLE
    const user = useSelector(state => state.login.validateToken.user);
    const [dataDomain, setdataDomain] = useState<Dictionary[]>([]);
    const [domainToDelete, setDomainToDelete] = useState<Dictionary[]>([]);
    const [openDialogStatus, setOpenDialogStatus] = useState(false);
    const [openDialogOrganization, setOpenDialogOrganization] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const dataDomainType = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const columns = React.useMemo(
        () => [
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
            {
                Header: t(langKeys.bydefault),
                accessor: 'bydefault',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
                //accessor: 'userid',
                accessor: 'domainid',
                NoFilter: true,
                isComponent: true,
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
        ],
        []
    );

    useEffect(() => {
        if (!detailRes.loading && !detailRes.error) {
            setdataDomain(detailRes.data);
        }
    }, [detailRes]);

    const handleRegister = () => {
        setOpenDialogOrganization(true)
        setRowSelected({ row: null, edit: true });
    }
    const handleDelete = (row: Dictionary) => {
        console.log('eliminar view 2');
        if (row && row.operation !== "INSERT") {
            setDomainToDelete(p => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);            
            console.log('entro aqui',row);
        }

        console.log(domainToDelete);
        setdataDomain(p => p.filter(x => row.domainid !== x.domainid));
        console.log('ejecuto el filtro');
    }

    const handleView = (row: Dictionary) => {
        setOpenDialogOrganization(true)
        setRowSelected({ row, edit: false })
    }

    const handleEdit = (row: Dictionary) => {
        setOpenDialogOrganization(true)
        setRowSelected({ row, edit: true })
    }
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            //id: row ? row.userid : 0,
            id: row ? row.domainid : 0,
            operation: row ? "EDIT" : "INSERT",
            description: row?.description || '',
            corporation: row?.corpdesc || '',
            organization: row?.orgdesc || '',
            domainname: row?.domainname || '',
            type: row?.type || '',
            status: row ? row.status : 'ACTIVO',
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
        register('status');
        register('corporation', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('organization', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('domainname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) })

        dispatch(resetMainAux())
        dispatch(getCollectionAux(getDomainValueSel((row?.domainname || ""))));
    }, [register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            console.log('boton grabar');
            dispatch(showBackdrop(true));
            dispatch(execute({
                header: insDomain({ ...data }),
                detail: [
                    //...dataDomain.filter(x => !!x.operation).map(x => insDomainvalue({ ...data, ...x })), 
                    ...domainToDelete.map(x => insDomainvalue(x))]
            }, true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.domainname}` : t(langKeys.newdomain)}
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
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}</Button>
                        }
                    </div>
                </div>

                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.corporation)}
                                className="col-6"
                                disabled={true}
                                valueDefault={row?.corpdesc || user?.corpdesc}
                                onChange={(value) => setValue('corporation', value)}
                                error={errors?.corporation?.message}
                            />
                            : <FieldView
                                label={t(langKeys.corporation)}
                                value={row?.corpdesc || ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.organization)}
                                disabled={true}
                                className="col-6"
                                valueDefault={row?.orgdesc || user?.orgdesc}
                                onChange={(value) => setValue('organization', value)}
                                error={errors?.organization?.message}
                            />
                            : <FieldView
                                label={t(langKeys.organization)}
                                value={row?.orgdesc || ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.domain)}
                                disabled={row ? true : false}
                                className="col-6"
                                valueDefault={row?.domainname || ""}
                                onChange={(value) => setValue('domainname', value)}
                                error={errors?.domainname?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.domain)}
                                value={row ? row.domainname : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                className="col-6"
                                valueDefault={row?.description || ""}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.description)}
                                value={row ? row.description : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.type)}
                                className="col-6"
                                valueDefault={row?.type || ""}
                                onChange={(value) => setValue('type', value ? value.domainvalue : '')}
                                error={errors?.type?.message}
                                data={dataDomainType}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            /> :
                            <FieldView
                                label={t(langKeys.type)}
                                value={row ? row.type : ""}
                                className="col-6"
                            />}
                    </div>
                </div>
            </form>

            <div className={classes.containerDetail}>
                {detailRes.error ? <h1>ERROR</h1> : (
                    <TableZyx
                        columns={columns}
                        titlemodule={t(langKeys.valuelist)}
                        data={dataDomain}
                        download={false}
                        loading={detailRes.loading}
                        filterGeneral={false}
                        register={edit}
                        handleRegister={handleRegister}
                    />
                )}
            </div>
            <DialogZyx
                open={openDialogStatus}
                title={t(langKeys.status)}
                buttonText1={t(langKeys.save)}
                handleClickButton1={() => setOpenDialogStatus(false)}
            >
                <FieldEdit
                    label={t(langKeys.description)}
                    className="col-6"
                    valueDefault={row?.description || ""}
                    onChange={(value) => setValue('description', value)}
                    error={errors?.description?.message}
                />
            </DialogZyx>
            <DetailValue
                data={rowSelected}
                openModal={openDialogOrganization}
                setOpenModal={setOpenDialogOrganization}
                multiData={multiData}
                updateRecords={setdataDomain}
            />
        </div>
    );
}

const Domains: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.domain),
                accessor: 'domainname',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
                //accessor: 'userid',
                accessor: 'userid',
                NoFilter: true,
                isComponent: true,
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
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getDomainSel('')));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("TIPODOMINIO"),
        ]));
        return () => {
            dispatch(resetMain());
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
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
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
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.domain_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else
        return (
            <DetailDomains
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}

export default Domains;