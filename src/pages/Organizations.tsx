/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch } from 'components';
import { getCorpSel, getOrgSel, getValuesFromDomain, insOrg } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { getCurrencyList } from "store/signup/actions";
import ClearIcon from '@material-ui/icons/Clear';
import { IconButton, InputAdornment, Tabs } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailOrganizationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void,
    dataCurrency: Dictionary[];
}
const arrayBread = [
    { id: "view-1", name: "Organizations" },
    { id: "view-2", name: "Organization detail" }
];

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
}));

const DetailOrganization: React.FC<DetailOrganizationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, dataCurrency }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();    
    const [pageSelected, setPageSelected] = useState(0);    
    const [showPassword, setShowPassword] = useState(false);
    const [showCredential, setShowCredential] = useState(row?.default_credentials || false);

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCorp = multiData[2] && multiData[2].success ? multiData[2].data : [];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            corpid: row ? row.corpid: user?.corpid,
            description: row ? (row.orgdesc || '') : '',
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            id: row ? row.orgid : 0,
            operation: row ? "EDIT" : "INSERT",
            currency: row?.currency || "",
            email: row?.email || "",
            port: row?.port || 0,
            password: row?.password || "",
            host: row?.host || "",
            ssl: row?.ssl || false,
            private_mail: row?.private_mail || false,
            default_credentials: row?.default_credentials || false,
        }
    });

    React.useEffect(() => {
        register('corpid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('currency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('host');
        register('ssl');
        register('private_mail');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
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
        console.log(data)
        const callback = () => {
            dispatch(execute(insOrg(data)));
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
                            title={row ? `${row.orgdesc}` : t(langKeys.neworganization)}
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
                    <AntTab label={t(langKeys.informationorganization)}/>
                    <AntTab label={t(langKeys.emailconfiguration)}/>
                </Tabs>
                {pageSelected === 0  && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            (
                                !row && ['SUPERADMIN'].includes(user?.roledesc || "") ?
                                    <FieldSelect
                                        label={t(langKeys.corporation)}
                                        className="col-6"
                                        valueDefault={getValues('corpid')}
                                        onChange={(value) => setValue('corpid', value?.corpid)}
                                        error={errors?.corpid?.message}
                                        data={dataCorp}
                                        disabled={!['SUPERADMIN'].includes(user?.roledesc || "")}
                                        optionDesc="description"
                                        optionValue="corpid"
                                    />
                                    :
                                    <FieldEdit
                                        label={t(langKeys.corporation)} // "Corporation"
                                        className="col-6"
                                        valueDefault={row ? (row.corpdesc || "") : user?.corpdesc}
                                        disabled={true}
                                    />
                            )
                            : <FieldView
                                label={t(langKeys.corporation)}
                                value={user?.corpdesc}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                className="col-6"
                                onChange={(value) => setValue('description', value)}
                                valueDefault={getValues("description")}
                                error={errors?.description?.message}
                            />
                            : <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.orgdesc || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                uset={true}
                                label={t(langKeys.type)}
                                className="col-6"
                                valueDefault={getValues('type')}
                                onChange={(value) => setValue('type', value.domainvalue)}
                                error={errors?.type?.message}
                                data={dataType}
                                prefixTranslation="type_org_"
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.type)}
                                value={row ? (row.type || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={getValues('status')}
                                onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                                error={errors?.status?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.currency)}
                                className="col-6"
                                valueDefault={getValues('currency')}
                                onChange={(value) => setValue('currency', value ? value.code : '')}
                                error={errors?.currency?.message}
                                data={dataCurrency}
                                //uset={true}
                                //prefixTranslation="status_"
                                optionDesc="description"
                                optionValue="code"
                            />
                            : <FieldView
                                label={t(langKeys.currency)}
                                value={row ? (row.currency || "") : ""}
                                className="col-6"
                            />}
                    </div>
                </div>}
                {pageSelected === 1 && 
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            {edit ?
                                <TemplateSwitch
                                    label={t(langKeys.private_mail)}
                                    className="col-6"
                                    valueDefault={showCredential}
                                    onChange={(value) => {setValue('private_mail', value);setShowCredential(value)}}
                                /> :
                                <FieldView
                                    label={"private_mail"}
                                    value={row ? (row.private_mail  ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                    className="col-6"
                                />
                            }
                        </div>
                        {
                            showCredential &&

                            <Fragment>
                                <div className="row-zyx">
                                    {edit ?
                                        <FieldEdit
                                            label={t(langKeys.email)} //transformar a multiselect
                                            className="col-6"
                                            fregister={{
                                                ...register("email",{
                                                    validate: (value) => (((value && value.length) && (value.includes("@") && value.includes("."))) || t(langKeys.emailverification))|| t(langKeys.field_required)
                                                })
                                            }}
                                            error={errors?.email?.message}
                                            onChange={(value) => setValue('email', value)}
                                            valueDefault={getValues("email")}
                                        />
                                        : <FieldView
                                            label={t(langKeys.email)}
                                            value={row ? (row.email || "") : ""}
                                            className="col-6"
                                        />}
                                    {edit ?
                                        <FieldEdit
                                            label={t(langKeys.port)} //transformar a multiselect
                                            className="col-6"
                                            type="number"
                                            fregister={{
                                                ...register("port",{
                                                    validate: (value) => (value && value>0) || t(langKeys.validnumber) 
                                                })
                                            }}
                                            error={errors?.port?.message}
                                            onChange={(value) => setValue('port', value)}
                                            valueDefault={getValues("port")}
                                        />
                                        : <FieldView
                                            label={t(langKeys.port)}
                                            value={row ? (row.port || 0) : 0}
                                            className="col-6"
                                        />}
                                </div>
                                <div className="row-zyx">
                                    {edit ?
                                        <FieldEdit
                                            label={t(langKeys.password)} 
                                            className="col-6"
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(value) => setValue('password', value)}
                                            valueDefault={getValues("password")}
                                            fregister={{
                                                ...register("password"
                                                    //,{ validate: (value) => (value && value.length) || t(langKeys.field_required)}
                                                )
                                            }}
                                            error={errors?.password?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        : ""}
                                </div>
                                <div className="row-zyx">
                                    {edit ?
                                        <FieldEdit
                                        label={t(langKeys.host)}
                                        className="col-6"
                                        fregister={{
                                            ...register("host",{
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        error={errors?.host?.message}
                                        onChange={(value:any) => setValue('host', value)}
                                        valueDefault={getValues("host")}
                                        />
                                        : <FieldView
                                            label={t(langKeys.host)}
                                            value={row ? (row.host || "") : ""}
                                            className="col-6"
                                        />
                                    }
                                    {edit ?
                                        <TemplateSwitch
                                            label={"SSL"}
                                            className="col-3"
                                            valueDefault={getValues("ssl")}
                                            onChange={(value) => setValue('ssl', value)}
                                        /> :
                                        <FieldView
                                            label={"SSL"}
                                            value={row ? (row.ssl  ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                            className="col-6"
                                        />
                                    }
                                    {edit ?
                                        <TemplateSwitch
                                            label={t(langKeys.default_credentials)}
                                            className="col-3"
                                            valueDefault={getValues("default_credentials")}
                                            onChange={(value) => setValue('default_credentials', value)}
                                        /> :
                                        <FieldView
                                            label={t(langKeys.default_credentials)}
                                            value={row ? (row.default_credentials  ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                            className="col-6"
                                        />
                                    }
                                </div>
                            </Fragment>

                        }
                    </div>
                }
            </form>
        </div>
    );
}

const Organizations: FC = () => {
    const dispatch = useDispatch();
    const ressignup = useSelector(state => state.signup.currencyList);
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'orgid',
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
                Header: t(langKeys.description),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                prefixTranslation: 'type_org_',
                NoFilter: true,
                Cell: (props: any) => {
                    const { type } = props.cell.row.original;
                    return (t(`type_org_${type}`.toLowerCase()) || "").toUpperCase()
                }
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
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true,
                /*prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }*/
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getOrgSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getCurrencyList())
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPOORG"),
            getCorpSel(0)
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
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insOrg({ ...row,description: row.orgdesc, type: row.type, operation: 'DELETE', status: 'ELIMINADO', id: row.orgid, currency: row.currency })));
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
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.organization_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailOrganization
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                dataCurrency={ressignup.data}
            />
        )
    } else
        return null;

}

export default Organizations;