/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldEditMulti } from 'components';
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

const dataMessageType = [
    { value: "SMS", text: "SMS" }, // Setear en diccionario los text
    { value: "HSM", text: "HSM" }, // Setear en diccionario los text
];

const dataTemplateType = [
    { value: "STANDARD", text: "Standard (text only)" }, // Setear en diccionario los text
    { value: "MULTIMEDIA", text: "Media & Interactive" }, // Setear en diccionario los text
];

const dataHeaderType = [
    { value: 'text', text: 'Text' }, // Setear en diccionario los text
    { value: 'image', text: 'Image' }, // Setear en diccionario los text
    { value: 'document', text: 'Document' }, // Setear en diccionario los text
    { value: 'video', text: 'Video' } // Setear en diccionario los text
];

const dataButtonType = [
    { value: "url", text: "url" }, // Setear en diccionario los text
    { value: "quick_reply", text: "quickreply" }, // Setear en diccionario los text
];

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
                Header: t(langKeys.creationdate),
                accessor: 'createdate',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return new Date(new Date(row.createdate).getTime() - (new Date().getTimezoneOffset() / 60)).toLocaleDateString()
                }
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.name),
                accessor: 'name',
                NoFilter: true
            },
            {
                Header: t(langKeys.namespace),
                accessor: 'namespace',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
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
            getValuesFromDomain("LANGUAGE")
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

const DetailMessageTemplates: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataCategory = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataLanguage = multiData[1] && multiData[1].success ? multiData[1].data : [];

    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.id : 0,
            description: row ? (row.description || '') : '',
            type: row ? row.type : 'SMS',
            status: row ? row.status : 'ACTIVO',
            name: row ? row.name : '',
            namespace: row ? row.namespace : '',
            category: row ? row.category : '',
            language: row ? row.language : '',
            templatetype: row ? row.templatetype : 'STANDARD',
            headerenabled: row ? row.headerenabled : true,
            headertype: row ? row.headertype : 'text',
            header: row ? row.header : '',
            body: row ? row.body : '',
            footerenabled: row ? row.footerenabled : true,
            footer: row ? row.footer : '',
            buttonsenabled: row ? row.footerenabled : true,
            buttons: row ? row.buttons : [{ title: '', type: '', payload: '' }],
            operation: row ? "EDIT" : "INSERT"
        }
    });
    
    const [templateTypeDisabled, setTemplateTypeDisabled] = useState(getValues('templatetype') === 'STANDARD');
    const [, setTemplateType] = useState(getValues('templatetype'));
    const [, setHeaderType] = useState(getValues('headertype'));
    const [showHeader, setShowHeader] = useState(getValues('headerenabled'));
    const [showFooter, setShowFooter] = useState(getValues('footerenabled'));
    const [showButtons, setShowButtons] = useState(getValues('buttonsenabled'));
    
    React.useEffect(() => {
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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

    const onChangeMessageType = (data: Dictionary) => {
        setValue('type', data?.value || '');
        switch (data?.value) {
            case 'SMS':
                onChangeTemplateType({value: 'STANDARD'});
                setTemplateTypeDisabled(true);
                setShowHeader(false);
                setShowFooter(false);
                setShowButtons(false);
                break;
            case 'HSM':
                setTemplateTypeDisabled(false);    
                break;
        }
    }

    const onChangeTemplateType = (data: Dictionary) => {
        // setTemplateType(data?.value || 'STANDARD');
        setValue('templatetype', data?.value || 'STANDARD');
    }

    const onClickHeaderToogle = () => {
        setShowHeader(!showHeader);
        setValue('headerenabled', !getValues('headerenabled'));
    }


    const onClickFooterToogle = () => {
        setShowFooter(!showFooter);
        setValue('footerenabled', !getValues('footerenabled'));
    }

    const onClickButtonsToogle = () => {
        setShowButtons(!showButtons);
        setValue('buttonsenabled', !getValues('buttonsenabled'));
    }

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
                            <FieldSelect
                                label={t(langKeys.messagetype)}
                                className="col-12"
                                valueDefault={row?.type || "SMS"}
                                onChange={onChangeMessageType}
                                triggerOnChangeOnFirst={true}
                                error={errors?.type?.message}
                                data={dataMessageType}
                                optionDesc="text"
                                optionValue="value"
                            />
                            : <FieldView
                                label={t(langKeys.messagetype)}
                                value={row ? (row.type || "") : ""}
                                className="col-12"
                        />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.name)}
                                className="col-12"
                                valueDefault={getValues('name')}
                                onChange={(value) => setValue('name', value)}
                                error={errors?.name?.message}
                            />
                            : <FieldView
                                label={t(langKeys.name)}
                                value={row ? (row.name || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.category)}
                                className="col-6"
                                valueDefault={row ? (row.category || "") : ""}
                                onChange={(value) => setValue('category', value?.domainvalue)}
                                error={errors?.category?.message}
                                data={dataCategory}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.category)}
                                value={row ? (row.category || "") : ""}
                                className="col-6"
                        />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.language)}
                                className="col-6"
                                valueDefault={row ? (row.language || "") : ""}
                                onChange={(value) => setValue('language', value?.domainvalue)}
                                error={errors?.language?.message}
                                data={dataLanguage}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.language)}
                                value={row ? (row.language || "") : ""}
                                className="col-6"
                        />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.templatetype)}
                                className="col-6"
                                valueDefault={getValues('templatetype')}
                                onChange={onChangeTemplateType}
                                triggerOnChangeOnFirst={true}
                                error={errors?.templatetype?.message}
                                data={dataTemplateType}
                                optionDesc="text"
                                optionValue="value"
                                disabled={templateTypeDisabled}
                            />
                            : <FieldView
                                label={t(langKeys.templatetype)}
                                value={row ? (row.templatetype || "") : ""}
                                className="col-6"
                        />}
                    </div>
                    <div className="row-zyx">
                        {(edit && getValues('templatetype') === 'MULTIMEDIA') ? 
                            <React.Fragment>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className="col-3"
                                    style={{ backgroundColor: getValues('headerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                    onClick={onClickHeaderToogle}
                                >{t(langKeys.header)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className="col-3"
                                    style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                                >{t(langKeys.body)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className="col-3"
                                    style={{ backgroundColor: getValues('footerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                    onClick={onClickFooterToogle}
                                >{t(langKeys.footer)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className="col-3"
                                    style={{ backgroundColor: getValues('buttonsenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                    onClick={onClickButtonsToogle}
                                >{t(langKeys.buttons)}</Button>
                            </React.Fragment>
                        : null}
                    </div>
                    <div className="row-zyx">
                        {(getValues('templatetype') === 'MULTIMEDIA'
                        && getValues('headerenabled')) ?
                        edit ?
                            <React.Fragment>
                                <FieldSelect
                                label={t(langKeys.headertype)}
                                className="col-4"
                                valueDefault={getValues('headertype')}
                                onChange={(value) => {
                                    setHeaderType(value?.value || 'text');
                                    setValue('headertype', value?.value || 'text');
                                }}
                                error={errors?.header?.message}
                                data={dataHeaderType}
                                optionDesc="text"
                                optionValue="value"
                                />
                                <FieldEdit
                                label={t(langKeys.header)}
                                className="col-8"
                                valueDefault={row ? (row.header || "") : ""}
                                onChange={(value) => setValue('header', value)}
                                error={errors?.header?.message}
                                disabled={getValues('headertype') === 'text'}
                            />
                            </React.Fragment>
                            : <FieldView
                            label={t(langKeys.header)}
                            value={row ? (row.header || "") : ""}
                            className="col-12"
                            />
                        : null}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEditMulti
                            label={t(langKeys.body)}
                            className="col-12"
                            valueDefault={row ? (row.body || "") : ""}
                            onChange={(value) => setValue('body', value)}
                            error={errors?.body?.message}
                            maxLength={1024}
                            />
                            : <FieldView
                                label={t(langKeys.body)}
                                value={row ? (row.body || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {(getValues('templatetype') === 'MULTIMEDIA'
                        && getValues('footerenabled')) ?
                        edit ?
                            <FieldEditMulti
                                label={t(langKeys.footer)}
                                className="col-12"
                                valueDefault={row ? (row.footer || "") : ""}
                                onChange={(value) => setValue('footer', value)}
                                error={errors?.footer?.message}
                                maxLength={1024}
                            />
                            : <FieldView
                            label={t(langKeys.footer)}
                            value={row ? (row.footer || "") : ""}
                            className="col-12"
                        />
                        : null}
                    </div>
                    <div className="row-zyx">
                        {(getValues('templatetype') === 'MULTIMEDIA'
                        && getValues('buttonsenabled')) ?
                        edit ?
                            <FieldEditMulti
                                label={t(langKeys.footer)}
                                className="col-12"
                                valueDefault={row ? (row.footer || "") : ""}
                                onChange={(value) => setValue('footer', value)}
                                error={errors?.footer?.message}
                                maxLength={1024}
                            />
                            : <FieldView
                            label={t(langKeys.footer)}
                            value={row ? (row.footer || "") : ""}
                            className="col-12"
                        />
                        : null}
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



export default MessageTemplates;