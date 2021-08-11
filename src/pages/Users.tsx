/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getUserSel, getPropertySel, getChannelsByOrg, getValuesFromDomain, insProperty } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
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
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));

const DetailUsers: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDocType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCompanies = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataBillingGroups = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataStatusUsers = multiData[4] && multiData[4].success ? multiData[4].data : [];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.userid : 0,
            operation: row ? "EDIT" : "INSERT",
            description: row ? (row.description || '') : '',
            firstname: row ? (row.firstname || '') : '',
            lastname: row ? (row.lastname || '') : '',
            password: row ? (row.password || '') : '',
            usr: row ? (row.usr || '') : '',
            email: row ? (row.email || '') : '',
            doctype: row ? (row.doctype || '') : '',
            docnum: row ? (row.docnum || '') : '',
            company: row ? (row.company || '') : '',
            billinggroup: row ? (row.billinggroup || '') : '',
            registercode: row ? (row.registercode || '') : '',
            twofactorauthentication: row ? (row.twofactorauthentication || '') : '',
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
        register('description', { validate: (value) => (value && value.length) || 'This is required.' });
        register('twofactorauthentication', { validate: (value) => (value && value.length) || 'This is required.' });
    }, [edit, register]);

    const onSubmit = handleSubmit((data) => {
        dispatch(execute(insProperty(data)));
        dispatch(showBackdrop(true));
        setWaitSave(true)
    });

    return (
        <div>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.firstname} ${row.lastname}` : "New user"}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.firstname)}
                                className="col-6"
                                valueDefault={row ? (row.firstname || "") : ""}
                                onChange={(value) => setValue('firstname', value)}
                                error={errors?.firstname?.message}
                            />
                            : <FieldView
                                label={t(langKeys.firstname)}
                                value={row ? (row.firstname || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.lastname)}
                                className="col-6"
                                valueDefault={row ? (row.lastname || "") : ""}
                                onChange={(value) => setValue('lastname', value)}
                                error={errors?.lastname?.message}
                            />
                            : <FieldView
                                label={t(langKeys.lastname)}
                                value={row ? (row.lastname || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.user)}
                                className="col-6"
                                valueDefault={row ? (row.usr || "") : ""}
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
                                valueDefault={row ? (row.email || "") : ""}
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
                                valueDefault={row ? (row.doctype || "") : ""}
                                onChange={(value) => setValue('doctype', value.domainvalue)}
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
                                valueDefault={row ? (row.docnum || "") : ""}
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
                                valueDefault={row ? (row.company || "") : ""}
                                onChange={(value) => setValue('company', value.domainvalue)}
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
                                valueDefault={row ? (row.twofactorauthentication ? 'ACTIVO' : "INACTIVO") : "INACTIVO"}
                                onChange={(value) => setValue('twofactorauthentication', value.domainvalue)}
                                error={errors?.twofactorauthentication?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            /> :
                            <FieldView
                                label={t(langKeys.twofactorauthentication)}
                                value={row ? (row.twofactorauthentication ? "Active" : "Inactive") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.billingGroup)}
                                className="col-6"
                                valueDefault={row ? (row.billinggroup || "") : ""}
                                onChange={(value) => setValue('billinggroup', value.domainvalue)}
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
                                valueDefault={row ? (row.registercode || "") : ""}
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
                                valueDefault={row ? (row.status || "") : ""}
                                onChange={(value) => setValue('status', value.domainvalue)}
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
                    {edit &&
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >Save
                            </Button>
                        </div>
                    }
                </div>
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
                titlemodule={t(langKeys.property, { count: 2 })}
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