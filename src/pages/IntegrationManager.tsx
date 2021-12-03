/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldEditMulti, FieldCheckbox, DialogZyx } from 'components';
import { getIntegrationManagerSel, insIntegrationManager, getValuesFromDomain, uuidv4, extractVariablesFromArray, downloadJson, uploadExcel, insarrayIntegrationManager, deldataIntegrationManager } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { apiUrls } from 'common/constants';
import { request_send, resetRequest } from 'store/integrationmanager/actions';
import { dictToArrayKV, extractVariables, isJson } from 'common/helpers';
import BackupIcon from '@material-ui/icons/Backup';

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
    { id: "view-1", name: "Integration Manager" },
    { id: "view-2", name: "Integration Manager detail" }
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
    selectInput1: {
        flexGrow: 0,
        flexBasis: '180px',
        marginRight: '10px',
    },
    selectInput2: {
        flexGrow: 1,
        flexBasis: '200px',
    },
    labelButton1: {
        width: 'auto',
        marginRight: '0.25rem',
    },
    labelButton2: {
        minWidth: 'max-content',
        minHeight: '30px',
        maxHeight: '48px',
        flexBasis: 0,
        flexGrow: 0,
    },
    checkboxRow: {
        flexGrow: 0,
        flexBasis: 0,
        marginRight: '0.5rem',
    },
    fieldRow: {
        flexGrow: 1,
        flexBasis: 0,
        marginRight: '0.5rem'
    },
    fieldButton: {
        flexGrow: 0,
        flexBasis: 0,
    }
}));

const dataIntegrationType: Dictionary = {
    STANDARD: 'standard',
    CUSTOM: 'custom',
};

const dataMethodType: Dictionary = {
    GET: 'GET',
    POST: 'POST',
};

const dataAuthorizationType: Dictionary = {
    NONE: 'none',
    BASIC: 'basic',
    BEARER: 'bearer',
};

const dataBodyType: Dictionary = {
    JSON: 'JSON',
    URLENCODED: 'URL encoded',
}

const dataLevel: Dictionary = {
    CORPORATION: 'corporation',
    ORGANIZATION: 'organization',
}

const dataLevelKeys = ['corpid','orgid','status'];

const IntegrationManager: FC = () => {
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
                accessor: 'id',
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
                accessor: 'name',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column;
                    return t(`${row[column.id]?.toLowerCase()}`).toUpperCase()
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
        ],
        []
    )

    const fetchData = () => dispatch(getCollection(getIntegrationManagerSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.integrationmanager).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

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
            dispatch(execute(insIntegrationManager({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
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
                titlemodule={t(langKeys.integrationmanager_plural, { count: 2 })}
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
            <DetailIntegrationManager
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}

type AuthorizationType = {
    type: string,
    username?: string,
    password?: string,
    token?: string
}

type FieldType = {
    id?: string,
    name: string,
    key: boolean,
}

type FormFields = {
    isnew: boolean,
    apikey: string,
    id: number,
    description: string,
    type: string,
    status: string,
    name: string,
    method: string,
    url: string,
    authorization: AuthorizationType,
    headers: Dictionary[],
    bodytype: string,
    body: string,
    parameters: Dictionary[],
    variables: string[],
    level: string,
    fields: FieldType[],
    operation: string
}

const DetailIntegrationManager: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const user = useSelector(state => state.login.validateToken.user);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [waitImport, setWaitImport] = useState(false);
    const [waitDelete, setWaitDelete] = useState(false);

    // const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    
    const dataKeys = new Set([...dataLevelKeys, ...(row?.fields?.filter((r: FieldType) => r.key)?.map((r: FieldType) => r.id) || [])]);

    const { control, register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            isnew: row ? false : true,
            apikey: row && (row.apikey || '') !== '' ? row.apikey : uuidv4(),
            id: row ? row.id : 0,
            description: row ? (row.description || '') : '',
            type: row ? (row.type || 'STANDARD') : 'STANDARD',
            status: row ? (row.status || 'ACTIVO') : 'ACTIVO',
            name: row ? (row.name || '') : '',
            method: row ? (row.method || 'GET') : 'GET',
            url: row ? (row.url || '') : '',
            authorization: row ? (row.authorization || { type: 'NONE' }) : { type: 'NONE' },
            headers: row ? (row.headers || []) : [],
            bodytype: row ? (row.bodytype || 'JSON') : 'JSON',
            body: row ? (row.body || '') : '',
            parameters: row ? (row.parameters || []) : [],
            variables: row ? (row.variables || []) : [],
            level: row ? (row.level || 'CORPORATION') : 'CORPORATION',
            fields: row
            ? (row.fields || [{name: 'corpid', key: true}, {name: 'status', key: false}])
            : [{name: 'corpid', key: true}, {name: 'status', key: false}],
            operation: row ? "EDIT" : "INSERT",
        }
    });

    const { fields: headers, append: headersAppend, remove: headersRemove, update: headersUpdate } = useFieldArray({
        control,
        name: "headers",
    });

    const { fields: parameters, append: parametersAppend, remove: parametersRemove, update: parametersUpdate } = useFieldArray({
        control,
        name: "parameters",
    });

    const { fields, append: fieldsAppend, remove: fieldsRemove, update: fieldsUpdate } = useFieldArray({
        control,
        name: "fields",
    });

    React.useEffect(() => {
        register('name', {
            validate: {
                value: (value: any) => (value && value.length) || t(langKeys.field_required),
                basiclatin: (value: any) => getValues('type') !== 'CUSTOM' || validateBasicLatinFieldName(value) || t(langKeys.field_basiclatinlowercase),
            }
        });
        register('type', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('method', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.integrationmanager).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        data.variables = data.variables || [];
        if (data.type === 'STANDARD') {
            let v: string[] = [];
            v = extractVariablesFromArray(data.headers, 'value', v);
            if (data.bodytype === 'JSON') {
                v = extractVariables(data.body, v);
            }
            else if (data.bodytype === 'URLENCODED') {
                v = extractVariablesFromArray(data.parameters, 'value', v);
            }
            data.variables = v;
        }
        else if (data.isnew && data.type === 'CUSTOM') {
            if (data.fields.filter(d => !dataLevelKeys.includes(d.name) && d.key === true).length === 0) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.field_key_required) }))
                return null;
            }
            let rex1 = new RegExp(/[^0-9a-zA-Z\s-_]/,'g');
            let rex2 = new RegExp(/[\s-]/,'g');
            let corpdesc = (user?.corpdesc || '').replace(rex1, '_').replace(rex2, '_').toLowerCase();
            let orgdesc = (user?.corpdesc || '').replace(rex1, '_').replace(rex2, '_').toLowerCase();
            let name = data.name.replace(rex1, '').replace(rex2, '_').toLowerCase();
            data.url = `${apiUrls.INTEGRATION_URL}/integration_${corpdesc}_${orgdesc}_${name}`;
        }
        
        const callback = () => {
            dispatch(execute(insIntegrationManager(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onChangeType = async (data: Dictionary) => {
        setValue('type', data?.key || '');
        await trigger('type');
    }

    const onChangeMethod = async (data: Dictionary) => {
        setValue('method', data?.key || '');
        await trigger('method');
    }

    const onChangeAuthorization = async (data: Dictionary) => {
        setValue('authorization.type', data?.key || '');
        await trigger('authorization.type');
    }

    const onClickAddHeader = async () => {
        headersAppend({ key: '', value: '' });
    }

    const onClickDeleteHeader = async (index: number) => {
        headersRemove(index);
    }

    const onBlurHeader = (index: any, param: string, value: any) => {
        headersUpdate(index, { ...headers[index], [param]: value});
    }

    const onChangeBodyType = async (data: Dictionary) => {
        setValue('bodytype', data?.key || '');
        await trigger('bodytype');
    }

    const onClickAddParameter = async () => {
        parametersAppend({ key: '', value: '' });
    }

    const onClickDeleteParameter = async (index: number) => {
        parametersRemove(index);
    }

    const onBlurParameter = (index: any, param: string, value: any) => {
        parametersUpdate(index, { ...parameters[index], [param]: value});
    }

    const onChangeBody = (value: string) => {
        setValue('body', value)
    }

    const onClickBeautify = async () => {
        let data = getValues('body');
        if (isJson(data)) {
            data = JSON.parse(data);
            data = JSON.stringify(data, null, 4);
            setValue('body', '');
            await trigger('body');
            setValue('body', data);
            await trigger('body');
        }
    }

    const onBlurBody = () => {
        let bodytype = getValues('bodytype');
        if (bodytype === 'JSON') {
            let data = getValues('body');
            validateJSON(data);
        }
    }

    const validateJSON = (data: string): any => {
        if (!isJson(data)) {
            return false;
        }
        else {
            return true;
        }
    }

    const onChangeLevel = async (data: Dictionary) => {
        setValue('level', data?.key || '');
        await trigger('level');
        if (data?.key === 'CORPORATION') {
            setValue('fields', [
                { name: 'corpid', key: true },
                { name: 'status', key: false },
                ...getValues('fields').filter(f => !dataLevelKeys.includes(f.name))
            ])
        }
        if (data?.key === 'ORGANIZATION') {
            setValue('fields', [
                { name: 'corpid', key: true },
                { name: 'orgid', key: true },
                { name: 'status', key: false },
                ...getValues('fields').filter(f => !dataLevelKeys.includes(f.name))
            ])
        }
    }

    const onClickAddField = async () => {
        fieldsAppend({ name: '', key: false });
    }

    const onClickDeleteField = async (index: number) => {
        fieldsRemove(index);
    }

    const onBlurField = (index: any, param: string, value: any) => {
        fieldsUpdate(index, { ...fields[index], [param]: value});
    }

    const disableKeys = (field: FieldType, i: number) => {
        if (dataLevelKeys.includes(field?.name)) {
            return true;
        }
        else if (dataKeys.has(field?.id) && !getValues('isnew')) {
            return true
        }
        return false;
    }

    const validateDuplicateFieldName = (field: FieldType, value: string): any => {
        let f = fields.filter((x: FieldType) => x.id !== field.id).map((m: FieldType) => m.name);
        return !f.includes(value);
    }

    const validateStartwithcharFieldName = (value: string): any => {
        let rex = new RegExp(/[a-z]/,'g');
        return rex.test(value[0]);
    }

    const validateBasicLatinFieldName = (value: string): any => {
        let rex = new RegExp(/^[a-z\d]+$/,'g');
        return rex.test(value);
    }

    const testRequestRes = useSelector(state => state.integrationmanager.request);
    const onClickTest = () => {
        dispatch(request_send(getValues()))
    }

    const [openDialogDomain, setOpenDialogDomain] = useState(false);

    useEffect(() => {
        if (testRequestRes?.data !== null) {
            setOpenDialogDomain(true);
        }
    }, [testRequestRes])

    const cleanRequestData = () => {
        dispatch(resetRequest());
    }

    const onClickInfo = () => {
        downloadJson("info",
            {
                "url": `${getValues('url')}/{operation}`,
                "insert_one": {
                    "data": fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data1`)}), {})
                },
                "insert_many": {
                    "data": [
                        fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data1`)}), {}),
                        fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data2`)}), {})
                    ]
                },
                "update": {
                    "data": fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data2`)}), {}),
                    "filter": fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data1`)}), {})
                },
                "remove": {
                    "filter": fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data1`)}), {})
                },
                "find_one": {
                    "filter": fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data1`)}), {}),
                    "sort": fields.reduce((a, d) => ({...a, [d.name]: "asc"}), {})
                },
                "find_many": {
                    "filter": fields.reduce((a, d) => ({...a, [d.name]: d.name === 'corpid' ? user?.corpid : (d.name === 'orgid' ? user?.orgid : `${d.name}_data1`)}), {}),
                    "sort": fields.reduce((a, d) => ({...a, [d.name]: "asc"}), {}),
                    "limit": 10
                }
            }
        );
    }

    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        if (file) {
            const data: any = await uploadExcel(file, undefined)
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                dispatch(execute(insarrayIntegrationManager(getValues('id'), data)));
                setWaitImport(true);
            }
        }
    }

    useEffect(() => {
        if (waitImport) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_transaction) }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.integrationmanager).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeRes, waitImport]);

    const onDeleteData = () => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(deldataIntegrationManager(getValues('id'))));
            setWaitDelete(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete_data),
            callback
        }))
    }

    useEffect(() => {
        if (waitDelete) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.integrationmanager).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [executeRes, waitDelete]);

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
                            title={row ? `${row.name}` : t(langKeys.newintegrationmanager)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {getValues('type') === 'STANDARD' &&
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            style={{ backgroundColor: "#7721AD" }}
                            onClick={() => onClickTest()}
                        >{t(langKeys.test)}</Button>
                        }
                        {!getValues('isnew') && getValues('type') === 'CUSTOM' && (
                            <React.Fragment>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={onDeleteData}
                                >{t(langKeys.deletedata)}</Button>
                                <input
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                                    id="uploadfile"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleUpload(e.target.files)}
                                />
                                <label htmlFor="uploadfile">
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        component="span"
                                        color="primary"
                                        startIcon={<BackupIcon color="secondary" />}
                                        style={{ backgroundColor: "#55BD84" }}
                                    >{t(langKeys.import)}</Button>
                                </label>
                            </React.Fragment>
                        )}
                        {getValues('type') === 'CUSTOM' &&
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            style={{ backgroundColor: "#7721AD" }}
                            onClick={() => onClickInfo()}
                        >{t(langKeys.info)}</Button>
                        }
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
                        {(edit && getValues('isnew')) ?
                            <FieldEdit
                                label={t(langKeys.name)}
                                className="col-12"
                                valueDefault={getValues('name')}
                                onChange={(value) => setValue('name', value)}
                                error={errors?.name?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.name)}
                                value={row?.name || ""}
                                className="col-12"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {(edit && getValues('isnew')) ?
                            <FieldSelect
                                uset={true}
                                label={t(langKeys.type)}
                                className="col-12"
                                valueDefault={getValues('type')}
                                onChange={onChangeType}
                                error={errors?.type?.message}
                                data={dictToArrayKV(dataIntegrationType)}
                                optionDesc="value"
                                optionValue="key"
                            />
                            :
                            <FieldView
                                label={t(langKeys.type)}
                                value={t(dataIntegrationType[row?.type]) || ""}
                                className="col-12"
                            />
                        }
                    </div>
                    {getValues('type') === 'STANDARD' ?
                    <React.Fragment>
                        <div className="row-zyx">
                            {edit ?
                                <React.Fragment>
                                    <FieldSelect
                                        fregister={{...register(`method`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })}}
                                        label={t(langKeys.requesttype)}
                                        className={classes.selectInput1}
                                        valueDefault={getValues('method')}
                                        onChange={onChangeMethod}
                                        error={errors?.method?.message}
                                        data={dictToArrayKV(dataMethodType)}
                                        optionDesc="value"
                                        optionValue="key"
                                    />
                                    <FieldEdit
                                        fregister={{...register(`url`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })}}
                                        label={t(langKeys.url)}
                                        className={classes.selectInput2}
                                        valueDefault={getValues('url')}
                                        onChange={(value) => setValue('url', value)}
                                        error={errors?.url?.message}
                                    />
                                </React.Fragment>
                                :
                                <FieldView
                                    label={t(langKeys.url)}
                                    value={row?.url || ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        <div className="row-zyx">
                            {edit ?
                                <FieldSelect
                                    uset={true}
                                    fregister={{...register(`authorization.type`, {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    })}}       
                                    label={t(langKeys.authorization)}
                                    valueDefault={getValues('authorization.type')}
                                    onChange={onChangeAuthorization}
                                    error={errors?.authorization?.type?.message}
                                    data={dictToArrayKV(dataAuthorizationType)}
                                    optionDesc="value"
                                    optionValue="key"
                                />
                                :
                                <FieldView
                                    label={t(langKeys.authorization)}
                                    value={row?.authorization?.type || ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        {getValues('authorization.type') === 'BASIC' ?
                            <div className="row-zyx">
                                {edit ?
                                    <React.Fragment>
                                        <FieldEdit
                                            fregister={{...register(`authorization.username`)}}
                                            label={t(langKeys.username)}
                                            className="col-6"
                                            valueDefault={getValues('authorization.username')}
                                            onChange={(value) => setValue('authorization.username', value)}
                                            error={errors?.authorization?.username?.message}
                                        />
                                        <FieldEdit
                                            fregister={{...register(`authorization.password`)}}
                                            label={t(langKeys.password)}
                                            className="col-6"
                                            valueDefault={getValues('authorization.password')}
                                            onChange={(value) => setValue('authorization.password', value)}
                                            error={errors?.authorization?.password?.message}
                                        />
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <FieldView
                                            label={t(langKeys.username)}
                                            value={row?.authorization?.username || ""}
                                            className="col-6"
                                        />
                                        <FieldView
                                            label={t(langKeys.password)}
                                            value={row?.authorization?.password || ""}
                                            className="col-6"
                                        />
                                    </React.Fragment>
                                }
                            </div>
                            :
                            null
                        }
                        {getValues('authorization.type') === 'BEARER' ?
                            <div className="row-zyx">
                                {edit ?
                                    <FieldEdit
                                        fregister={{...register(`authorization.token`)}}
                                        label={t(langKeys.token)}
                                        className="col-12"
                                        valueDefault={getValues('authorization.token')}
                                        onChange={(value) => setValue('authorization.token', value)}
                                        error={errors?.authorization?.token?.message}
                                    />
                                    :
                                    <FieldView
                                        label={t(langKeys.token)}
                                        value={row?.authorization?.token || ""}
                                        className="col-12"
                                    />
                                }
                            </div>
                            :
                            null
                        }
                        <div className="row-zyx" style={{ alignItems: 'flex-end' }}>
                            <React.Fragment>
                                <FieldView
                                    label={t(langKeys.header)}
                                    className={classes.labelButton1}
                                />
                                {edit ?
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        color="primary"
                                        className={classes.labelButton2}
                                        startIcon={<AddIcon color="primary" />}
                                        onClick={() => onClickAddHeader()}
                                    >{t(langKeys.addheader)}</Button>
                                    :
                                    null
                                }
                            </React.Fragment>
                        </div>
                        {edit ?
                            headers?.map((field: any, i: number) => {
                                return (
                                    <div className="row-zyx" key={field.id}>
                                        <FieldEdit
                                            label={t(langKeys.key)}
                                            className={classes.fieldRow}
                                            valueDefault={field?.key || ""}
                                            onBlur={(value) => onBlurHeader(i, 'key', value)}
                                            error={errors?.headers?.[i]?.key?.message}
                                        />
                                        <FieldEdit
                                            label={t(langKeys.value)}
                                            className={classes.fieldRow}
                                            valueDefault={field?.value || ""}
                                            onBlur={(value) => onBlurHeader(i, 'value', value)}
                                            error={errors?.headers?.[i]?.value?.message}
                                        />
                                        <IconButton
                                            size="small"
                                            className={classes.fieldButton}
                                            onClick={() => onClickDeleteHeader(i)}>
                                            <DeleteIcon style={{ color: '#000000'}} />
                                        </IconButton>
                                    </div>
                                )
                            })
                        :
                        headers?.map((field: any, i: number) => {
                            return (
                                <div className="row-zyx" key={field.id}>
                                    <FieldView
                                        label={t(langKeys.key)}
                                        value={field?.key || ""}
                                        className="col-12"
                                    />
                                    <FieldView
                                        label={t(langKeys.value)}
                                        value={field?.value || ""}
                                        className="col-12"
                                    />
                                </div>
                            )
                        })}
                        {getValues('method') === 'POST' ?
                        <div className="row-zyx">
                            {edit ?
                                <React.Fragment>
                                    <FieldSelect
                                        fregister={{...register(`bodytype`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })}}
                                        label={t(langKeys.bodytype)}
                                        className={classes.selectInput1}
                                        valueDefault={getValues('bodytype')}
                                        onChange={onChangeBodyType}
                                        error={errors?.bodytype?.message}
                                        data={dictToArrayKV(dataBodyType)}
                                        optionDesc="value"
                                        optionValue="key"
                                    />
                                    {getValues('bodytype') === 'JSON' ?
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        color="primary"
                                        className={classes.labelButton2}
                                        onClick={() => onClickBeautify()}
                                    >{t(langKeys.beautify)}</Button>
                                    : null}
                                    {getValues('bodytype') === 'URLENCODED' ?
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        color="primary"
                                        className={classes.labelButton2}
                                        startIcon={<AddIcon color="primary" />}
                                        onClick={() => onClickAddParameter()}
                                    >{t(langKeys.addparameter)}</Button>
                                    : null}
                                </React.Fragment>
                                :
                                <FieldView
                                    label={t(langKeys.bodytype)}
                                    value={row ? (row.bodytype || "") : ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        : null}
                        {(getValues('method') === 'POST'
                        && getValues('bodytype') === 'JSON') ?
                        <div className="row-zyx">
                            {edit ?
                                <FieldEditMulti
                                    fregister={{...register(`body`, {
                                        validate: {
                                            value: (value: any) => (value && value.length) || t(langKeys.field_required),
                                            invalid: (value: any) => validateJSON(value) || t(langKeys.invalidjson)
                                        }
                                    })}}    
                                    label={t(langKeys.body)}
                                    className="col-12"
                                    valueDefault={getValues('body')}
                                    onChange={onChangeBody}
                                    onBlur={onBlurBody}
                                    error={errors?.body?.message}
                                    rows={8}
                                />
                                :
                                <FieldView
                                    label={t(langKeys.body)}
                                    value={row ? (row.body || "") : ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        : null}
                        {(getValues('method') === 'POST'
                        && getValues('bodytype') === 'URLENCODED') ?
                            <React.Fragment>
                                {edit ?
                                    parameters?.map((field: any, i: number) => {
                                        return (
                                            <div className="row-zyx" key={field.id}>
                                                <FieldEdit
                                                    label={t(langKeys.key)}
                                                    className={classes.fieldRow}
                                                    valueDefault={field?.key || ""}
                                                    onBlur={(value) => onBlurParameter(i, 'key', value)}
                                                    error={errors?.parameters?.[i]?.key?.message}
                                                />
                                                <FieldEdit
                                                    label={t(langKeys.value)}
                                                    className={classes.fieldRow}
                                                    valueDefault={field?.value || ""}
                                                    onBlur={(value) => onBlurParameter(i, 'value', value)}
                                                    error={errors?.parameters?.[i]?.value?.message}
                                                />
                                                <IconButton
                                                    size="small"
                                                    className={classes.fieldButton}
                                                    onClick={() => onClickDeleteParameter(i)}>
                                                    <DeleteIcon style={{ color: '#000000'}} />
                                                </IconButton>
                                            </div>
                                        )
                                    })
                                : parameters?.map((field: any, i: number) => {
                                    return (
                                        <div className="row-zyx" key={field.id}>
                                            <FieldView
                                                label={t(langKeys.key)}
                                                value={field?.key || ""}
                                                className="col-12"
                                            />
                                            <FieldView
                                                label={t(langKeys.value)}
                                                value={field?.value || ""}
                                                className="col-12"
                                            />
                                        </div>
                                    )
                                })
                                }
                            </React.Fragment>
                        : null}
                    </React.Fragment>
                    : null}

                    {getValues('type') === 'CUSTOM' ?
                    <React.Fragment>
                        <div className="row-zyx">
                            {(edit && getValues('isnew')) ?
                                <React.Fragment>
                                    <FieldEdit
                                        label={t(langKeys.url)}
                                        className="col-12"
                                        valueDefault={getValues('url')}
                                        disabled={true}
                                        error={errors?.url?.message}
                                    />
                                </React.Fragment>
                                :
                                <FieldView
                                    label={t(langKeys.url)}
                                    value={row?.url || ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        <div className="row-zyx">
                            {(edit && getValues('isnew')) ?
                                <FieldEdit
                                    label={t(langKeys.apikey)}
                                    className="col-12"
                                    valueDefault={getValues('apikey')}
                                    disabled={true}
                                    error={errors?.apikey?.message}
                                />
                                :
                                <FieldView
                                    label={t(langKeys.apikey)}
                                    value={row?.apikey || ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        <div className="row-zyx">
                            {(edit && getValues('isnew')) ?
                                <FieldSelect
                                    uset={true}
                                    fregister={{...register(`level`, {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    })}}    
                                    label={t(langKeys.level)}
                                    className="col-12"
                                    valueDefault={getValues('level')}
                                    onChange={onChangeLevel}
                                    error={errors?.level?.message}
                                    data={dictToArrayKV(dataLevel)}
                                    optionDesc="value"
                                    optionValue="key"
                                />
                                :
                                <FieldView
                                    label={t(langKeys.level)}
                                    value={t(dataLevel[row?.level]) || ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        <div className="row-zyx" style={{ alignItems: 'flex-end' }}>
                            {edit ?
                                <React.Fragment>
                                    <FieldView
                                        label={t(langKeys.tablelayout)}
                                        className={classes.labelButton1}
                                    />
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        color="primary"
                                        className={classes.labelButton2}
                                        startIcon={<AddIcon color="primary" />}
                                        onClick={() => onClickAddField()}
                                    >{t(langKeys.addfield)}</Button>
                                </React.Fragment>
                                :
                                <FieldView
                                    label={t(langKeys.tablelayout)}
                                    className="col-12"
                                />
                            }
                        </div>
                        {edit ?
                            fields?.map((field: any, i: number) => {
                                return (
                                    <div className="row-zyx" key={field.id}>
                                        <FieldEdit
                                            fregister={{...register(`fields.${i}.name`, {
                                                validate: {
                                                    value: (value: any) => (value && value.length) || t(langKeys.field_required),
                                                    duplicate: (value: any) => validateDuplicateFieldName(field, value) || t(langKeys.field_duplicate),
                                                    startwithchar: (value: any) => validateStartwithcharFieldName(value) || t(langKeys.field_startwithchar),
                                                    basiclatin: (value: any) => validateBasicLatinFieldName(value) || t(langKeys.field_basiclatinlowercase),
                                                }
                                            })}}
                                            label={t(langKeys.name)}
                                            className={classes.fieldRow}
                                            valueDefault={field?.name || ""}
                                            disabled={disableKeys(field, i)}
                                            onBlur={(value) => onBlurField(i, 'name', value)}
                                            error={errors?.fields?.[i]?.name?.message}
                                        />
                                        {getValues('isnew') ?
                                        <FieldCheckbox
                                            label={t(langKeys.key)}
                                            className={`${classes.checkboxRow}`}
                                            valueDefault={field?.key}
                                            disabled={disableKeys(field, i)}
                                            onChange={(value) => onBlurField(i, 'key', value)}
                                            error={errors?.fields?.[i]?.key?.message}
                                        />
                                        : null}
                                        {!disableKeys(field, i) ?
                                        <IconButton
                                            size="small"
                                            className={classes.fieldButton}
                                            onClick={() => onClickDeleteField(i)}>
                                            <DeleteIcon style={{ color: '#000000'}} />
                                        </IconButton>
                                        : null}
                                    </div>
                                )
                            })
                        :
                        fields?.map((fields: any, i: number) => {
                            return (
                                <div className="row-zyx" key={fields.id}>
                                    <FieldView
                                        label={t(langKeys.name)}
                                        value={fields?.name || ""}
                                        className="col-12"
                                    />
                                    <FieldView
                                        label={t(langKeys.order)}
                                        value={fields?.order || ""}
                                        className="col-12"
                                    />
                                </div>
                            )
                        })}
                    </React.Fragment>
                    : null}
                </div>
            </form>

            <ModalIntegrationManager
                data={testRequestRes.data}
                openModal={openDialogDomain}
                setOpenModal={setOpenDialogDomain}
                cleanModalData={cleanRequestData}
            />

        </div>
    );
}

interface ModalProps {
    data: any;
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    cleanModalData: () => void;
}

const ModalIntegrationManager: React.FC<ModalProps> = ({ data, openModal, setOpenModal, cleanModalData }) => {
    const { t } = useTranslation();
    
    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.result)}
            buttonText2={t(langKeys.back)}
            handleClickButton2={() => {
                cleanModalData();
                setOpenModal(false);
            }}
            button2Type="button"
        >
            <div className="row-zyx">
                {JSON.stringify(data, null, 4)}
            </div>
        </DialogZyx>
    )
}

export default IntegrationManager;