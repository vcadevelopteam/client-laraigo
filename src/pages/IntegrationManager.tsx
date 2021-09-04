/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldEditMulti } from 'components';
import { getIntegrationManagerSel, insIntegrationManager, getValuesFromDomain } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
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
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Integration Manager" },
    { id: "view-2", name: "Integration Manager detail" }
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
        flexBasis: 0,
        flexGrow: 0,
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

const dataIntegrationType = [
    { value: "STANDARD", text: "STANDARD" }, // Setear en diccionario los text
    { value: "CUSTOM", text: "CUSTOM" }, // Setear en diccionario los text
];

const dataMethodType = [
    { value: "GET", text: "GET" }, // Setear en diccionario los text
    { value: "POST", text: "POST" }, // Setear en diccionario los text
];

const dataAuthorizationType = [
    { value: "NONE", text: "NO AUTH" }, // Setear en diccionario los text
    { value: "BASIC", text: "BASIC" }, // Setear en diccionario los text
    { value: "BEARER", text: "BEARER" }, // Setear en diccionario los text
];

const dataBodyType = [
    { value: "JSON", text: "JSON" }, // Setear en diccionario los text
    { value: "URLENCODED", text: "URL encoded" }, // Setear en diccionario los text
]

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
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
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

type HeaderType = {
    key: string;
    value: any;
}

type FormFields = {
    id: number,
    description: string,
    type: string,
    status: string,
    method: string,
    url: string,
    authorization: AuthorizationType,
    headers: Dictionary[],
    bodytype: string,
    body: string,
    bodydata: Dictionary[],
    operation: string
}

const DetailIntegrationManager: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    
    const { control, register, handleSubmit, setValue, getValues, unregister, trigger, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            id: row ? row.id : 0,
            description: row ? (row.description || '') : '',
            type: row ? row.type : 'STANDARD',
            status: row ? row.status : 'ACTIVO',
            method: row ? row.method : 'GET',
            url: row ? row.url : '',
            authorization: row ? JSON.parse(row.authorization) : {type: 'NONE'},
            headers: row ? JSON.parse(row.headers) : [],
            bodytype: row ? row.bodytype : 'JSON',
            body: row ? row.body : '',
            bodydata: (row && row.bodytype === 'URLENCODED') ? JSON.parse(row.body) : [],
            operation: row ? "EDIT" : "INSERT"
        }
    });

    const { fields: headers, append: headersAppend, remove: headersRemove, update: headersUpdate } = useFieldArray({
        control,
        name: "headers",
    });

    const { fields: bodydata, append: bodydataAppend, remove: bodydataRemove, update: bodydataUpdate } = useFieldArray({
        control,
        name: "bodydata",
    });

    React.useEffect(() => {
        register('description', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
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
        setValue('type', data?.value || '');
        await trigger('type');
        switch (data?.value || 'STANDARD') {
            case 'STANDARD':
                break;
            case 'CUSTOM':
                // unregister(['method','authorization.type','bodytype']);
                break;
        }
    }

    const onChangeMethod = async (data: Dictionary) => {
        setValue('method', data?.value || '');
        await trigger('method');
        switch (data?.value || 'GET') {
            case 'GET':
                // unregister(['bodytype']);
                break;
            case 'POST':
                break;
        }
    }

    const onChangeAuthorization = async (data: Dictionary) => {
        setValue('authorization.type', data?.value || '');
        await trigger('authorization.type');
    }

    const onClickAddHeader = async () => {
        headersAppend({ key: '', value: '' });
    }

    const onClickDeleteHeader = async (index: number) => {
        headersRemove(index);
    }

    const onBlurHeader = (index: any, param: string, value: string) => {
        headersUpdate(index, { ...headers[index], [param]: value});
    }

    const onClickAddBodydata = async () => {
        bodydataAppend({ key: '', value: '' });
    }

    const onClickDeleteBodydata = async (index: number) => {
        bodydataRemove(index);
    }

    const onBlurBodydata = (index: any, param: string, value: string) => {
        bodydataUpdate(index, { ...bodydata[index], [param]: value});
    }

    const onChangeBodyType = async (data: Dictionary) => {
        setValue('bodytype', data?.value || '');
        await trigger('bodytype');
    }

    return (
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.name}` : t(langKeys.newintegrationmanager)}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                className="col-12"
                                valueDefault={getValues('description')}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.description || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.type)}
                                className="col-12"
                                valueDefault={getValues('type')}
                                onChange={onChangeType}
                                error={errors?.type?.message}
                                data={dataIntegrationType}
                                optionDesc="text"
                                optionValue="value"
                            />
                            :
                            <FieldView
                                label={t(langKeys.type)}
                                value={row ? (row.type || "") : ""}
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
                                        data={dataMethodType}
                                        optionDesc="text"
                                        optionValue="value"
                                    />
                                    <FieldEdit
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
                                    value={row ? (row.url || "") : ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        <div className="row-zyx">
                            {edit ?
                                <FieldSelect
                                    fregister={{...register(`authorization.type`, {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    })}}    
                                    label={t(langKeys.authorization)}
                                    valueDefault={getValues('authorization.type')}
                                    onChange={onChangeAuthorization}
                                    error={errors?.authorization?.type?.message}
                                    data={dataAuthorizationType}
                                    optionDesc="text"
                                    optionValue="value"
                                />
                                :
                                <FieldView
                                    label={t(langKeys.authorization)}
                                    value={row ? (row.authorization || "") : ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        {getValues('authorization.type') === 'BASIC' ?
                            <div className="row-zyx">
                                {edit ?
                                    <React.Fragment>
                                        <FieldEdit
                                            label={t(langKeys.username)}
                                            className="col-6"
                                            valueDefault={getValues('authorization.username')}
                                            onChange={(value) => setValue('authorization.username', value)}
                                            error={errors?.authorization?.username?.message}
                                        />
                                        <FieldEdit
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
                        headers?.map((header: any, i: number) => {
                            return (
                                <div className="row-zyx" key={header.id}>
                                    <FieldView
                                        label={t(langKeys.key)}
                                        value={header?.key || ""}
                                        className="col-12"
                                    />
                                    <FieldView
                                        label={t(langKeys.value)}
                                        value={header?.value || ""}
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
                                        data={dataBodyType}
                                        optionDesc="text"
                                        optionValue="value"
                                    />
                                    {getValues('bodytype') === 'URLENCODED' ?
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        color="primary"
                                        className={classes.labelButton2}
                                        startIcon={<AddIcon color="primary" />}
                                        onClick={() => onClickAddBodydata()}
                                    >{t(langKeys.addparameter)}</Button>
                                    : null}
                                </React.Fragment>
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
                        && getValues('bodytype') === 'JSON') ?
                        <div className="row-zyx">
                            {edit ?
                                <FieldEditMulti
                                    label={t(langKeys.body)}
                                    className="col-12"
                                    valueDefault={getValues('body')}
                                    onChange={(value) => setValue('body', value)}
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
                                    bodydata?.map((field: any, i: number) => {
                                        return (
                                            <div className="row-zyx" key={field.id}>
                                                <FieldEdit
                                                    label={t(langKeys.key)}
                                                    className={classes.fieldRow}
                                                    valueDefault={field?.key || ""}
                                                    onBlur={(value) => onBlurBodydata(i, 'key', value)}
                                                    error={errors?.bodydata?.[i]?.key?.message}
                                                />
                                                <FieldEdit
                                                    label={t(langKeys.value)}
                                                    className={classes.fieldRow}
                                                    valueDefault={field?.value || ""}
                                                    onBlur={(value) => onBlurBodydata(i, 'value', value)}
                                                    error={errors?.bodydata?.[i]?.value?.message}
                                                />
                                                <IconButton
                                                    size="small"
                                                    className={classes.fieldButton}
                                                    onClick={() => onClickDeleteBodydata(i)}>
                                                    <DeleteIcon style={{ color: '#000000'}} />
                                                </IconButton>
                                            </div>
                                        )
                                    })
                                : bodydata?.map((header: any, i: number) => {
                                    return (
                                        <div className="row-zyx" key={header.id}>
                                            <FieldView
                                                label={t(langKeys.key)}
                                                value={header?.key || ""}
                                                className="col-12"
                                            />
                                            <FieldView
                                                label={t(langKeys.value)}
                                                value={header?.value || ""}
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
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
            </form>
        </div>
    );
}



export default IntegrationManager;