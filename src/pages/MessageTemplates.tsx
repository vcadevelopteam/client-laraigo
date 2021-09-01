/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getMessageTemplateSel, insMessageTemplate, getValuesFromDomain } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
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
    { id: "view-1", name: "Message Templates" },
    { id: "view-2", name: "Message Templates detail" }
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

const DetailMessageTemplates: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    // const user = useSelector(state => state.login.validateToken.user);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataCategory = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataType = [
        { value: "SMS", text: "SMS" }, // Setear en diccionario los text
        { value: "HSM", text: "HSM" }, // Setear en diccionario los text
    ];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.id : 0,
            description: row ? (row.description || '') : '',
            type: row ? row.type : 'HSM',
            status: row ? row.status : 'ACTIVO',
            hsmid: row ? row.hsmid : '',
            namespace: row ? row.namespace : '',
            message: row ? row.message : '',
            category: row ? row.category : '',
            header: row ? row.header : { type: '', value: '' },
            buttons: row ? row.buttons : [],
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('id');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('hsmid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('message', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('category');
        register('header');
        register('buttons');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insMessageTemplate(data)));
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
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.hsmid}` : t(langKeys.newmessagetemplate)}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.hsmid)}
                                className="col-6"
                                valueDefault={row ? (row.hsmid || "") : ""}
                                onChange={(value) => setValue('hsmid', value)}
                                error={errors?.hsmid?.message}
                            />
                            : <FieldView
                                label={t(langKeys.hsmid)}
                                value={row ? (row.hsmid || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.type)}
                                className="col-6"
                                valueDefault={row ? (row.type || "") : ""}
                                onChange={(value) => setValue('type', value.value)}
                                error={errors?.type?.message}
                                data={dataType}
                                optionDesc="text"
                                optionValue="value"
                            />
                            : <FieldView
                                label={t(langKeys.type)}
                                value={row ? (row.type || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.namespace)}
                                className="col-12"
                                valueDefault={row ? (row.namespace || "") : ""}
                                onChange={(value) => setValue('namespace', value)}
                                error={errors?.namespace?.message}
                            />
                            : <FieldView
                                label={t(langKeys.namespace)}
                                value={row ? (row.namespace || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                className="col-12"
                                valueDefault={row ? (row.description || "") : ""}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            />
                            : <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.description || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.category)}
                                className="col-12"
                                valueDefault={row ? (row.category || "") : ""}
                                onChange={(value) => setValue('category', value.domainvalue)}
                                error={errors?.category?.message}
                                data={dataCategory}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.category)}
                                value={row ? (row.category || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-12"
                                valueDefault={row ? (row.status || "") : ""}
                                onChange={(value) => setValue('status', value.domainvalue)}
                                error={errors?.status?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-12"
                            />}
                    </div>
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

const MessageTemplates: FC = () => {
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
                Header: t(langKeys.category),
                accessor: 'category',
                NoFilter: true
            },
            {
                Header: t(langKeys.hsmid),
                accessor: 'hsmid',
                NoFilter: true
            },
            {
                Header: t(langKeys.namespace),
                accessor: 'namespace',
                NoFilter: true
            },
            {
                Header: t(langKeys.message),
                accessor: 'message',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
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
            }
        ],
        []
    )

    const fetchData = () => dispatch(getCollection(getMessageTemplateSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("CATEGORIAHSM"),
            getValuesFromDomain("ESTADOGENERICO")
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
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
            dispatch(execute(insMessageTemplate({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
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
                titlemodule={t(langKeys.messagetemplate_plural, { count: 2 })}
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
            <DetailMessageTemplates
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}

export default MessageTemplates;