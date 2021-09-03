/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldEditMulti } from 'components';
import { getIntegrationManagerSel, insIntegrationManager, getValuesFromDomain } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { NestedValue, useForm } from 'react-hook-form';
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
        flexBasis: '130px',
        marginRight: '10px',
    },
    selectInput2: {
        flexGrow: 1,
        flexBasis: '200px',
    },
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
    { value: "", text: "NO AUTH" }, // Setear en diccionario los text
    { value: "BASIC", text: "BASIC" }, // Setear en diccionario los text
    { value: "BEARER", text: "BEARER" }, // Setear en diccionario los text
];

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
                Header: t(langKeys.name),
                accessor: 'name',
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

const DetailIntegrationManager: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    
    const { register, handleSubmit, setValue, getValues, unregister, trigger, formState: { errors } } = useForm<{
        id: number,
        description: string,
        type: string,
        status: string,
        method: string,
        url: string,
        authorization: NestedValue<{
            type: string,
            username?: string,
            password?: string,
            token?: string
        }>,
        headers: NestedValue<{
            key: string;
            value: any;
        }[]>,
        bodytype: string,
        body: string,
        operation: string
    }>({
        defaultValues: {
            id: row ? row.id : 0,
            description: row ? (row.description || '') : '',
            type: row ? row.type : 'STANDARD',
            status: row ? row.status : 'ACTIVO',
            method: row ? row.method : 'GET',
            url: row ? row.url : 'url',
            authorization: row ? JSON.parse(row.authorization) : {},
            headers: row ? JSON.parse(row.headers): [],
            bodytype: row ? row.bodytype : 'JSON',
            body: row ? row.body : '',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
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

    const onChangeType = (data: Dictionary) => {
        setValue('type', data?.value || '');
        switch (data?.value || 'STANDARD') {
            case 'STANDARD':
                unregister([]);    
                break;
            case 'CUSTOM':
                unregister(['method','url','authorization','headers','bodytype','body']);
                break;
        }
    }

    const onChangeMethod = async (data: Dictionary) => {
        setValue('method', data?.value || '');
        await trigger('method');
    }

    const onChangeAuthorization = async (data: Dictionary) => {
        setValue('method', data?.value || '');
        await trigger('method');
    }

    // const onClickHeaderToogle = async ({ value } : { value? : Boolean | null} = {}) => {
    //     if (value)
    //         setValue('headerenabled', value)
    //     else
    //         setValue('headerenabled', !getValues('headerenabled'));
    //     await trigger('headerenabled');
    // }

    // const onClickFooterToogle = async ({ value } : { value? : Boolean | null} = {}) => {
    //     if (value)
    //         setValue('footerenabled', value)
    //     else
    //         setValue('footerenabled', !getValues('footerenabled'));
    //     await trigger('footerenabled');
    // }

    // const onClickButtonsToogle = async ({ value } : { value? : Boolean | null} = {}) => {
    //     if (value)
    //         setValue('buttonsenabled', value)
    //     else
    //         setValue('buttonsenabled', !getValues('buttonsenabled'));
    //     await trigger('buttonsenabled');
    // }

    // const onChangeHeaderType = async (data: Dictionary) => {
    //     setValue('headertype', data?.value || '');
    //     await trigger('headertype');
    // }

    // const onChangeButton = (index: number, param: string, value: string) => {
    //     setValue(`buttons.${index}.${param}`, value);
    // }

    // const onClickAddButton = async () => {
    //     if (getValues('buttons') && getValues('buttons').length < 3)
    //         setValue('buttons', [...getValues('buttons'), { title: '', type: '', payload: '' }])
    //     await trigger('buttons');
    // }

    // const onClickRemoveButton = async () => {
    //     let btns = getValues('buttons');
    //     if (btns && btns.length > 0)
    //     {
    //         unregister(`buttons.${btns.length - 1}`);
    //         setValue('buttons', btns.filter((x: any, i: number) => i !== btns.length - 1));
    //     }
    //     await trigger('buttons');
    // }

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
                            <FieldSelect
                                label={t(langKeys.type)}
                                className="col-12"
                                valueDefault={row?.type || "STANDARD"}
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
                                        label={t(langKeys.requesttype)}
                                        className={classes.selectInput1}
                                        valueDefault={row?.method || 'GET'}
                                        onChange={onChangeMethod}
                                        error={errors?.method?.message}
                                        data={dataMethodType}
                                        optionDesc="text"
                                        optionValue="value"
                                    />
                                    <FieldEdit
                                        label={t(langKeys.url)}
                                        className={classes.selectInput2}
                                        valueDefault={row?.url || ""}
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
                                    label={t(langKeys.authorization)}
                                    valueDefault={row?.authorization || ''}
                                    onChange={onChangeAuthorization}
                                    error={errors?.authorization?.message}
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
                                            valueDefault={row?.authorization?.username || ""}
                                            onChange={(value) => setValue('authorization.username', value)}
                                            error={errors?.authorization?.message}
                                        />
                                        <FieldEdit
                                            label={t(langKeys.password)}
                                            className="col-6"
                                            valueDefault={row?.authorization?.password || ""}
                                            onChange={(value) => setValue('authorization.password', value)}
                                            error={errors?.authorization?.message}
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
                                        className="col-6"
                                        valueDefault={row?.authorization?.token || ""}
                                        onChange={(value) => setValue('authorization.token', value)}
                                        error={errors?.authorization?.message}
                                    />
                                    :
                                    <FieldView
                                        label={t(langKeys.token)}
                                        value={row?.authorization?.token || ""}
                                        className="col-6"
                                    />
                                }
                            </div>
                            :
                            null
                        }
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