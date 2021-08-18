/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, TemplateSwitch } from 'components';
import { getDomainValueSel, getPersonSel, getValuesFromDomain, insDomain, insDomainvalue } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute, getCollectionAux, resetMainAux} from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';

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
const DetailOrgUser: React.FC<ModalProps> = ({ data: { row, edit }, multiData, openModal, setOpenModal, updateRecords }) => {
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
            debugger
            reset({
                domaindesc: row?.domaindesc||'',
                domainvalue: row?.domainvalue||'',
                bydefault: row?.bydefault||false,
            })
    
            register('domainvalue', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            register('domaindesc', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            register('bydefault');
        }
    }, [openModal])

    return (
        <DialogZyx
            open={openModal}
            title="Register value"
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
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
                        value={row?.domainvalue||""}
                        className="col-6"
                    />}
                    {edit ?
                        <TemplateSwitch
                            label={t(langKeys.bydefault)}
                            className="col-6"
                            onChange={(value) => setValue('bydefault', !!value.bydefault)}
                        /> :
                        <FieldView
                            label={t(langKeys.default_organization)}
                            value={row ? (row.bydefault ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                            className={classes.mb2}
                        />
                    }
            <div className="row-zyx"></div>
                
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
                        value={row?.domaindesc|| ""}
                        className="col-6"
                    />}

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

    const [dataDomain, setdataDomain] = useState<Dictionary[]>([]);
    const [orgsToDelete, setOrgsToDelete] = useState<Dictionary[]>([]);
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
                accessor: 'userid',
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
        if (row.operation !== "INSERT") {
            setOrgsToDelete(p => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);
        }
        setdataDomain(p => p.filter(x => row.orgid !== x.orgid));
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
            id: row ? row.userid : 0,
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
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_edit) }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
                fetchData && fetchData();
            } else if (executeRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: executeRes.message }))
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
        debugger
        dispatch(resetMainAux())
        dispatch(getCollectionAux(getDomainValueSel((row?.domainname || "")))); 
    }, [register]);

    const onSubmit = handleSubmit((data) => {
        debugger
        dispatch(showBackdrop(true));
        dispatch(execute({
            header: insDomain({ ...data}),
            detail: [...dataDomain.filter(x => !!x.operation).map(x => insDomainvalue({ ...data,...x})), ...orgsToDelete.map(x => insDomainvalue(x))]
        }, true));
        setWaitSave(true)
    });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '80%' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.domainname}` : "New domain"}
                        />
                    </div>
                    {edit &&
                        <div style={{ marginRight: "-15%"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}</Button>
                        </div>
                    }
                </div>

                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.corporation)}
                                className="col-6"
                                valueDefault={row?.corpdesc || ""}
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
                                className="col-6"
                                valueDefault={row?.orgdesc || ""}
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
            <DetailOrgUser
                data={rowSelected}
                openModal={openDialogOrganization}
                setOpenModal={setOpenDialogOrganization}
                multiData={multiData}
                updateRecords={setdataDomain}
            />
        </div>
    );
}

const Person: FC = () => {
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
                Header: t(langKeys.action),
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

    const fetchData = () => dispatch(getCollection(getPersonSel(0)));

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
        if (!executeResult.loading && !executeResult.error && waitSave) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_edit) }))
            setWaitSave(false);
            fetchData();
        } else if (executeResult.error) {
            dispatch(showSnackbar({ show: true, success: false, message: executeResult.message }))
            dispatch(showBackdrop(false));
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
        dispatch(execute(insDomain({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.person_plural, { count: 2 })}
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

export default Person;