/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getOrgUserSel, getUserSel, getValuesFromDomain, insProperty } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute, getCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import LockOpenIcon from '@material-ui/icons/LockOpen';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Users" },
    { id: "view-2", name: "User detail" }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
}));

const DetailUsers: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const detailRes = useSelector(state => state.main.mainAux); //RESULTADO DEL DETALLE

    console.log(detailRes);

    const [openDialogStatus, setOpenDialogStatus] = useState(false);
    const [openDialogPassword, setOpenDialogPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDocType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCompanies = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataBillingGroups = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataStatusUsers = multiData[4] && multiData[4].success ? multiData[4].data : [];

    const columns = React.useMemo(
        () => [
            {
                Header: 'Organization',
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: 'Role',
                accessor: 'roledesc',
                NoFilter: true
            },
            {
                Header: 'Supervisor',
                accessor: 'supervisordesc',
                NoFilter: true
            },
            {
                Header: 'Group',
                accessor: 'groups',
                NoFilter: true
            },
            {
                Header: 'Label',
                accessor: 'labels',
                NoFilter: true
            },
            {
                Header: 'Channel',
                accessor: 'channels',
                NoFilter: true
            },
            {
                Header: 'Type',
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: 'Status',
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
                        // viewFunction={() => handleView(row)}
                        // deleteFunction={() => handleDelete(row)}
                        // editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
        ],
        []
    );

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.userid : 0,
            operation: row ? "EDIT" : "INSERT",
            description: row?.description || '',
            firstname: row?.firstname || '',
            lastname: row?.lastname || '',
            password: row?.password || '',
            usr: row?.usr || '',
            email: row?.email || '',
            doctype: row?.doctype || '',
            docnum: row?.docnum || '',
            company: row?.company || '',
            billinggroup: row?.billinggroup || '',
            registercode: row?.registercode || '',
            twofactorauthentication: row?.twofactorauthentication || 'INACTIVO',
            status: row ? row.status : 'ACTIVO',
        }
    });

    useEffect(() => {
        if (!executeRes.loading && !executeRes.error && waitSave) {
            dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_edit) }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
            fetchData();
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('type');
        register('id');
        register('password');
        register('status', { validate: (value) => (value && value.length) || 'This is required.' });
        register('firstname', { validate: (value) => (value && value.length) || 'This is required.' });
        register('lastname', { validate: (value) => (value && value.length) || 'This is required.' });
        register('usr', { validate: (value) => (value && value.length) || 'This is required.' });
        register('email', { validate: (value) => (value && value.length) || 'This is required.' });
        register('doctype', { validate: (value) => (value && value.length) || 'This is required.' });
        register('docnum', { validate: (value) => (value && value.length) || 'This is required.' });
        register('company', { validate: (value) => (value && value.length) || 'This is required.' });
        register('billinggroup', { validate: (value) => (value && value.length) || 'This is required.' });
        register('registercode', { validate: (value) => (value && value.length) || 'This is required.' });
        register('description');
        register('twofactorauthentication');

        dispatch(getCollectionAux(getOrgUserSel((row?.userid || 0), 0)));//TRAE LAS ORGANIZACIONES ASIGNADAS DEL USUARIO
    }, [edit, register]);

    const onSubmit = handleSubmit((data) => {
        console.log(data);

        // dispatch(execute(insProperty(data)));
        // dispatch(showBackdrop(true));
        // setWaitSave(true)
    });

    const onSubmitPassword = () => {
        if (password && password === confirmPassword) {
            setValue('password', password);
            setOpenDialogPassword(false);
        }
    }

    const onChangeStatus = (value: Dictionary) => {
        setValue('status', (value ? value.domainvalue : ''));
        value && setOpenDialogStatus(true)
    }

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
                            title={row ? `${row.firstname} ${row.lastname}` : "New user"}
                        />
                    </div>
                    {edit &&
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                startIcon={<LockOpenIcon color="secondary" />}
                                onClick={() => setOpenDialogPassword(true)}
                            >{t(row ? langKeys.changePassword : langKeys.setpassword)}</Button>
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
                                label={t(langKeys.firstname)}
                                className="col-6"
                                valueDefault={row?.firstname || ""}
                                onChange={(value) => setValue('firstname', value)}
                                error={errors?.firstname?.message}
                            />
                            : <FieldView
                                label={t(langKeys.firstname)}
                                value={row?.firstname || ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.lastname)}
                                className="col-6"
                                valueDefault={row?.lastname || ""}
                                onChange={(value) => setValue('lastname', value)}
                                error={errors?.lastname?.message}
                            />
                            : <FieldView
                                label={t(langKeys.lastname)}
                                value={row?.lastname || ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.user)}
                                className="col-6"
                                valueDefault={row?.usr || ""}
                                onChange={(value) => setValue('usr', value)}
                                error={errors?.usr?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.user)}
                                value={row ? row.usr : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.email)}
                                className="col-6"
                                valueDefault={row?.email || ""}
                                onChange={(value) => setValue('email', value)}
                                error={errors?.email?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.email)}
                                value={row ? row.email : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.docType)}
                                className="col-6"
                                valueDefault={row?.doctype || ""}
                                onChange={(value) => setValue('doctype', value ? value.domainvalue : '')}
                                error={errors?.doctype?.message}
                                data={dataDocType}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            /> :
                            <FieldView
                                label={t(langKeys.docType)}
                                value={row ? row.doctype : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.docNumber)}
                                className="col-6"
                                valueDefault={row?.docnum || ""}
                                onChange={(value) => setValue('docnum', value)}
                                error={errors?.docnum?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.docNumber)}
                                value={row ? row.docnum : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.company)}
                                className="col-6"
                                valueDefault={row?.company || ""}
                                onChange={(value) => setValue('company', value ? value.domainvalue : '')}
                                error={errors?.company?.message}
                                data={dataCompanies}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            /> :
                            <FieldView
                                label={t(langKeys.company)}
                                value={row ? row.company : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.twofactorauthentication)}
                                className="col-6"
                                valueDefault={row?.twofactorauthentication ? 'ACTIVO' : "INACTIVO"}
                                onChange={(value) => setValue('twofactorauthentication', (value ? value.domainvalue : ''))}
                                error={errors?.twofactorauthentication?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            /> :
                            <FieldView
                                label={t(langKeys.twofactorauthentication)}
                                value={row?.twofactorauthentication || ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.billingGroup)}
                                className="col-6"
                                valueDefault={row?.billinggroup || ""}
                                onChange={(value) => setValue('billinggroup', (value ? value.domainvalue : ''))}
                                error={errors?.billinggroup?.message}
                                data={dataBillingGroups}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            /> :
                            <FieldView
                                label={t(langKeys.billingGroup)}
                                value={row ? row.billinggroup : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.registerCode)}
                                className="col-6"
                                valueDefault={row?.registercode || ""}
                                onChange={(value) => setValue('registercode', value)}
                                error={errors?.registercode?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.registerCode)}
                                value={row ? row.registercode : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={row?.status || ""}
                                onChange={onChangeStatus}
                                error={errors?.status?.message}
                                data={dataStatusUsers}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            /> :
                            <FieldView
                                label={t(langKeys.status)}
                                value={row ? row.status : ""}
                                className="col-6"
                            />
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    {detailRes.loading ?
                        <h1>LOADING</h1> : (detailRes.error ? <h1>ERROR</h1> : (
                            <TableZyx
                                columns={columns}
                                titlemodule={t(langKeys.organization_plural)}
                                data={detailRes.data}
                                download={false}
                                filterGeneral={false}
                                register={edit}
                            // handleRegister={handleRegister}
                            />
                        ))
                    }
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
                <DialogZyx
                    open={openDialogPassword}
                    title={t(langKeys.setpassword)}
                    buttonText1={t(langKeys.cancel)}
                    buttonText2={t(langKeys.save)}
                    handleClickButton1={() => setOpenDialogPassword(false)}
                    handleClickButton2={onSubmitPassword}
                >
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.password)}
                            className="col-6"
                            type="password"
                            onChange={setPassword}
                        />
                        <FieldEdit
                            label={t(langKeys.confirmpassword)}
                            className="col-6"
                            type="password"
                            onChange={setConfirmPassword}
                        />
                    </div>
                </DialogZyx>
            </form>
        </div>
    );
}

const Users: FC = () => {
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
                Header: 'Email',
                accessor: 'email',
                NoFilter: true
            },
            {
                Header: 'Globalid',
                accessor: 'globalid',
                NoFilter: true
            },
            {
                Header: 'Groups',
                accessor: 'groups',
                NoFilter: true
            },
            {
                Header: 'Rols',
                accessor: 'roledesc',
                NoFilter: true
            },
            {
                Header: 'Status',
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: 'Type',
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: 'User',
                accessor: 'usr',
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

    const fetchData = () => dispatch(getCollection(getUserSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getValuesFromDomain("ESTADOGENERICO"), getValuesFromDomain("TIPODOCUMENTO"), getValuesFromDomain("EMPRESA"), getValuesFromDomain("GRUPOFACTURACION"), getValuesFromDomain("ESTADOUSUARIO")]));
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
        dispatch(execute(insProperty({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.propertyid })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.loading) {
            return <h1>LOADING</h1>;
        }
        else if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.user, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailUsers
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default Users;