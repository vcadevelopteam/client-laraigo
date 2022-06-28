/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from '@material-ui/icons/Add';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import React, { FC, useCallback, useEffect, useState } from 'react';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import TableZyx from '../components/fields/table-simple';

import { Box, CircularProgress, IconButton, Paper } from '@material-ui/core';
import { Close, FileCopy, GetApp } from '@material-ui/icons';
import { convertLocalDate, getMessageTemplateSel, getValuesFromDomain, insMessageTemplate, richTextToString } from 'common/helpers';
import { Descendant } from "slate";
import { Dictionary, MultiData } from "@types";
import { execute, getCollection, getMultiCollection, resetAllMain, uploadFile } from 'store/main/actions';
import { FieldEdit, FieldEditMulti, FieldSelect, FieldView, RichText, TemplateBreadcrumbs, TemplateIcons, TitleDetail } from 'components';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { renderToString, toElement } from 'components/fields/RichText';
import { useDispatch } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

interface RowSelected {
    edit: boolean,
    row: Dictionary | null,
}

interface DetailProps {
    data: RowSelected;
    fetchData: () => void;
    multiData: MultiData[];
    setViewSelected: (view: string) => void;
}

const arrayBread = (view1: string, view2: string) => [
    { id: "view-1", name: view1 },
    { id: "view-2", name: view2 },
];

const useStyles = makeStyles((theme) => ({
    btnButton: {
        flexGrow: 0,
        flexBasis: 0,
        minHeight: '30px',
        minWidth: 'max-content',
    },
    button: {
        fontSize: '14px',
        fontWeight: 500,
        padding: 12,
        textTransform: 'initial'
    },
    buttonTitle: {
        marginRight: '0.25rem',
        width: 'auto',
    },
    containerDetail: {
        background: '#fff',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    headerText: {
        flexBasis: '200px',
        flexGrow: 1,
    },
    headerType: {
        flexBasis: '130px',
        flexGrow: 0,
        marginRight: '10px',
    },
    mb1: {
        marginBottom: '0.25rem',
    },
    mediabutton: {
        margin: theme.spacing(1),
        flexBasis: 0,
        flexGrow: 1,
        minHeight: '30px',
        opacity: 0.8,
        padding: 0,
        '&:hover': {
            opacity: 1,
        }
    },
}));

const MessageTemplates: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);

    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [showId, setShowId] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
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
                accessor: 'createdate',
                Header: t(langKeys.creationdate),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.createdate).toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" })
                }
            },
            ...(showId ? [{
                accessor: 'templateid',
                Header: t(langKeys.messagetemplateid),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    if (row.showid) {
                        return row.id;
                    }
                    else {
                        return null;
                    }
                }
            }] : []),
            {
                accessor: 'type',
                Header: t(langKeys.type),
                NoFilter: true,
                prefixTranslation: 'messagetemplate_',
            },
            {
                accessor: 'templatetype',
                Header: t(langKeys.templatetype),
                NoFilter: true,
                prefixTranslation: 'messagetemplate_',
            },
            {
                accessor: 'name',
                Header: t(langKeys.name),
                NoFilter: true,
            },
            {
                accessor: 'namespace',
                Header: t(langKeys.namespace),
                NoFilter: true
            },
            {
                accessor: 'status',
                Header: t(langKeys.status),
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
                }
            },
        ],
        [showId]
    )

    const fetchData = () => dispatch(getCollection(getMessageTemplateSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("MESSAGETEMPLATECATEGORY"),
            getValuesFromDomain("LANGUAGE"),
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }));
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() });
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    useEffect(() => {
        if (mainResult.mainData.data.length > 0) {
            setShowId(mainResult.mainData.data[0]?.showid);
        }
    }, [mainResult.mainData.data])

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
            callback,
        }))
    }

    if (viewSelected === "view-1") {
        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <TableZyx
                onClickRow={handleEdit}
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
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataCategory = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataLanguage = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const executeRes = useSelector(state => state.main.execute);
    const uploadResult = useSelector(state => state.main.uploadFile);

    const [bodyAttachment, setBodyAttachment] = useState("");
    const [bodyObject, setBodyObject] = useState<Descendant[]>(row?.bodyobject || [{ "type": "paragraph", "children": [{ "text": row?.body || "" }] }]);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentTemplate, setFileAttachmentTemplate] = useState<File | null>(null);
    const [typeAttachment, setTypeAttachment] = useState("");
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

    const dataMessageType = [
        { value: "SMS", text: t(langKeys.messagetemplate_sms) },
        { value: "HSM", text: t(langKeys.messagetemplate_hsm) },
        { value: "MAIL", text: t(langKeys.messagetemplate_mail) },
        { value: "HTML", text: t(langKeys.messagetemplate_html) },
    ];

    const dataTemplateType = [
        { value: "STANDARD", text: t(langKeys.messagetemplate_standard) },
        { value: "MULTIMEDIA", text: t(langKeys.messagetemplate_multimedia) },
    ];

    const dataHeaderType = [
        { value: 'text', text: t(langKeys.messagetemplate_text) },
        { value: 'image', text: t(langKeys.messagetemplate_image) },
        { value: 'document', text: t(langKeys.messagetemplate_document) },
        { value: 'video', text: t(langKeys.messagetemplate_video) },
    ];

    const dataButtonType = [
        { value: "url", text: t(langKeys.messagetemplate_url) },
        { value: "quick_reply", text: t(langKeys.messagetemplate_quickreply) },
    ];

    const dataPriority = [
        { value: 1, text: t(langKeys.messagetemplate_low) },
        { value: 2, text: t(langKeys.messagetemplate_medium) },
        { value: 3, text: t(langKeys.messagetemplate_high) },
    ]

    const { control, register, handleSubmit, setValue, getValues, unregister, trigger, formState: { errors } } = useForm({
        defaultValues: {
            attachment: row?.attachment || '',
            body: row?.body || '',
            buttons: row ? (row.buttons || []) : [],
            buttonsenabled: ![null, undefined].includes(row?.buttonsenabled) ? row?.buttonsenabled : true,
            category: row?.category || '',
            description: row?.description || '',
            footer: row?.footer || '',
            footerenabled: ![null, undefined].includes(row?.footerenabled) ? row?.footerenabled : true,
            header: row?.header || '',
            headerenabled: ![null, undefined].includes(row?.headerenabled) ? row?.headerenabled : true,
            headertype: row?.headertype || 'text',
            id: row ? row.id : 0,
            language: row?.language || '',
            name: row?.name || '',
            namespace: row?.namespace || '',
            operation: row ? "EDIT" : "INSERT",
            priority: row?.priority || 2,
            status: row?.status || 'ACTIVO',
            templatetype: row?.templatetype || 'STANDARD',
            type: row?.type || 'HSM',
            typeattachment: row?.typeattachment || '',
        }
    });

    const [templateTypeDisabled, setTemplateTypeDisabled] = useState(['SMS', 'MAIL'].includes(getValues('type')));

    const { fields: buttons } = useFieldArray({
        control,
        name: "buttons",
    });

    React.useEffect(() => {
        register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('category', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('language', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('templatetype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }));
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() });
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('attachment', (!!getValues('attachment') ? [getValues('attachment'), uploadResult?.url || ''] : [uploadResult?.url || '']).join(','));
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])

    const onSubmit = handleSubmit((data) => {
        if (data.type === 'MAIL') {
            data.body = renderToString(toElement(bodyObject));
            if (data.body === `<div data-reactroot=""><p><span></span></p></div>`) {
                return
            }
        }

        const callback = () => {
            if (data.type === 'MAIL') {
                data.body = renderToString(toElement(bodyObject));
                if (data.body === '<div data-reactroot=""><p><span></span></p></div>') {
                    return;
                }
            }
            dispatch(execute(insMessageTemplate({ ...data, bodyobject: bodyObject })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback,
        }))
    });

    useEffect(() => {
        if (row) {
            const type = row?.type || "HSM";

            if (type === "HSM") {
                register('language', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            }
            else {
                if (type === "SMS") {
                    register('language', { validate: (value) => true });
                    register('namespace', { validate: (value) => true });
                    register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                }
                else {
                    register('language', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                    register('namespace', { validate: (value) => true });
                    register('body');
                }
            }
        }
    }, [row])

    const onChangeMessageType = (data: Dictionary) => {
        if (getValues('type') === 'MAIL' && (data?.value || '') !== 'MAIL') {
            setValue('body', richTextToString(bodyObject))
        }

        setValue('type', data?.value || '');
        trigger('type');

        switch (data?.value || 'HSM') {
            case 'HSM':
                register('language', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                setTemplateTypeDisabled(false);
                break;

            case 'HTML':
                register('typeattachment', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                break;

            case 'SMS':
            case 'MAIL':
                if ((data?.value || 'HSM') === "SMS") {
                    register('language', { validate: () => true });
                    register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                } else {
                    register('language', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                    register('body', { validate: () => true });
                }

                register('namespace', { validate: () => true });
                onChangeTemplateType({ value: 'STANDARD' });
                setTemplateTypeDisabled(true);
                break;
        }
    }

    const onChangeTemplateType = async (data: Dictionary) => {
        setValue('templatetype', data?.value || '');
        await trigger('templatetype');
    }

    const onClickHeaderToogle = async ({ value }: { value?: Boolean | null } = {}) => {
        if (value) {
            setValue('headerenabled', value);
        }
        else {
            setValue('headerenabled', !getValues('headerenabled'));
        }
        await trigger('headerenabled');
    }

    const onClickFooterToogle = async ({ value }: { value?: Boolean | null } = {}) => {
        if (value) {
            setValue('footerenabled', value);
        }
        else {
            setValue('footerenabled', !getValues('footerenabled'));
        }
        await trigger('footerenabled');
    }

    const onClickButtonsToogle = async ({ value }: { value?: Boolean | null } = {}) => {
        if (value) {
            setValue('buttonsenabled', value);
        }
        else {
            setValue('buttonsenabled', !getValues('buttonsenabled'));
        }
        await trigger('buttonsenabled');
    }

    const onChangeHeaderType = async (data: Dictionary) => {
        setValue('headertype', data?.value || '');
        await trigger('headertype');
    }

    const onChangeButton = (index: number, param: string, value: string) => {
        setValue(`buttons.${index}.${param}`, value);
    }

    const onClickAddButton = async () => {
        if (getValues('buttons') && getValues('buttons').length < 3) {
            setValue('buttons', [...getValues('buttons'), { title: '', type: '', payload: '' }]);
        }
        await trigger('buttons');
    }

    const onClickRemoveButton = async () => {
        let btns = getValues('buttons');

        if (btns && btns.length > 0) {
            unregister(`buttons.${btns.length - 1}`);
            setValue('buttons', btns.filter((x: any, i: number) => i !== btns.length - 1));
        }

        await trigger('buttons');
    }

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById('attachmentInput');
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);

        if (file) {
            setFileAttachment(file);
            let fd = new FormData();
            fd.append('file', file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, [])

    useEffect(() => {
        if (fileAttachmentTemplate) {
            var reader = new FileReader();
            reader.readAsText(fileAttachmentTemplate);
            reader.onload = (event: any) => {
                let content = event.target.result.toString();
                setValue('body', content);
                setBodyAttachment(content);
            };
        }
    }, [fileAttachmentTemplate])

    const onChangeAttachmentTemplate = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachmentTemplate(file);
        }
    }, [])

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById('attachmentInput') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        setFileAttachment(null);
        setValue('attachment', getValues('attachment').split(',').filter((a: string) => a !== f).join(','));
        await trigger('attachment');
    }

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread(t(langKeys.messagetemplate), t(langKeys.messagetemplatedetail))}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.name}` : t(langKeys.newmessagetemplate)}
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
                                disabled={waitUploadFile}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    {row?.showid && <div className="row-zyx">
                        <FieldView
                            label={t(langKeys.messagetemplateid)}
                            value={row ? (row.id || "") : ""}
                            className="col-12"
                        />
                    </div>}
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                uset={true}
                                label={t(langKeys.messagetype)}
                                className="col-12"
                                valueDefault={getValues('type')}
                                onChange={onChangeMessageType}
                                error={errors?.type?.message}
                                data={dataMessageType}
                                optionDesc="text"
                                optionValue="value"
                            />
                            :
                            <FieldView
                                label={t(langKeys.messagetype)}
                                value={row ? (row.type || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <React.Fragment>
                                <FieldEdit
                                    label={t(langKeys.name)}
                                    className="col-6"
                                    valueDefault={getValues('name')}
                                    onChange={(value) => setValue('name', value)}
                                    error={errors?.name?.message}
                                />
                                {getValues('type') === "HSM" && (
                                    <FieldEdit
                                        label={t(langKeys.namespace)}
                                        className="col-6"
                                        valueDefault={getValues('namespace')}
                                        onChange={(value) => setValue('namespace', value)}
                                        error={errors?.namespace?.message}
                                    />
                                )}
                                {getValues('type') === "HTML" && (
                                    <FieldSelect
                                        label={t(langKeys.type)}
                                        className="col-6"
                                        valueDefault={getValues('typeattachment')}
                                        onChange={(value) => { setValue('typeattachment', value?.val); setTypeAttachment(value?.val) }}
                                        error={errors?.typeattachment?.message}
                                        data={[{ val: "IMPORT", desc: t(langKeys.import) }, { val: "EDIT", desc: t(langKeys.edit) }]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                )}
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <FieldView
                                    label={t(langKeys.name)}
                                    value={row ? (row.name || "") : ""}
                                    className="col-6"
                                />
                                <FieldView
                                    label={t(langKeys.namespace)}
                                    value={row ? (row.namespace || "") : ""}
                                    className="col-6"
                                />
                            </React.Fragment>
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <React.Fragment>
                                <FieldSelect
                                    label={t(langKeys.category)}
                                    className="col-6"
                                    valueDefault={getValues('category')}
                                    onChange={(value) => setValue('category', value?.domainvalue)}
                                    error={errors?.category?.message}
                                    data={dataCategory}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                {getValues("type") !== 'SMS' && (
                                    <FieldSelect
                                        uset={true}
                                        label={t(langKeys.language)}
                                        className="col-6"
                                        valueDefault={getValues('language')}
                                        onChange={(value) => setValue('language', value?.domainvalue)}
                                        error={errors?.language?.message}
                                        data={dataLanguage}
                                        optionDesc="domaindesc"
                                        optionValue="domainvalue"
                                    />
                                )}
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <FieldView
                                    label={t(langKeys.category)}
                                    value={row ? (row.category || "") : ""}
                                    className="col-6"
                                />
                                <FieldView
                                    label={t(langKeys.language)}
                                    value={row ? (row.language || "") : ""}
                                    className="col-6"
                                />
                            </React.Fragment>
                        }
                    </div>
                    {getValues("type") === 'MAIL' &&
                        <div className="row-zyx">
                            {edit ?
                                <React.Fragment>
                                    <FieldSelect
                                        uset={true}
                                        label={t(langKeys.priority)}
                                        className="col-6"
                                        valueDefault={getValues('priority')}
                                        onChange={(value) => setValue('priority', value?.value)}
                                        error={errors?.priority?.message}
                                        data={dataPriority}
                                        prefixTranslation="priority_"
                                        optionDesc="text"
                                        optionValue="value"
                                    />
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <FieldView
                                        label={t(langKeys.priority)}
                                        value={row ? (row.priority || "") : ""}
                                        className="col-6"
                                    />
                                </React.Fragment>
                            }
                        </div>}
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                uset={true}
                                label={t(langKeys.templatetype)}
                                className="col-12"
                                valueDefault={getValues('templatetype')}
                                onChange={onChangeTemplateType}
                                error={errors?.templatetype?.message}
                                data={dataTemplateType}
                                optionDesc="text"
                                optionValue="value"
                                disabled={templateTypeDisabled}
                            />
                            :
                            <FieldView
                                label={t(langKeys.templatetype)}
                                value={row ? (row.templatetype || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    {getValues('templatetype') === 'MULTIMEDIA' ?
                        <div className="row-zyx">
                            {edit ?
                                <React.Fragment>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        className={classes.mediabutton}
                                        style={{ backgroundColor: getValues('headerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                        startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                        onClick={() => onClickHeaderToogle()}
                                    >{t(langKeys.header)}</Button>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        className={classes.mediabutton}
                                        style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                                        startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    >{t(langKeys.body)}</Button>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        className={classes.mediabutton}
                                        style={{ backgroundColor: getValues('footerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                        startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                        onClick={() => onClickFooterToogle()}
                                    >{t(langKeys.footer)}</Button>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        className={classes.mediabutton}
                                        style={{ backgroundColor: getValues('buttonsenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                        startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                        onClick={() => onClickButtonsToogle()}
                                    >{t(langKeys.buttons)}</Button>
                                </React.Fragment>
                                : null}
                        </div>
                        : null}
                    {getValues('type') === 'MAIL' ?
                        <div className="row-zyx">
                            {edit ?
                                <React.Fragment>
                                    <FieldEdit
                                        label={t(langKeys.header)}
                                        className="col-12"
                                        valueDefault={getValues('header')}
                                        onChange={(value) => setValue('header', value)}
                                        error={errors?.header?.message}
                                    />
                                </React.Fragment>
                                :
                                <FieldView
                                    label={t(langKeys.header)}
                                    value={row ? (row.header || "") : ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        : null}
                    {(getValues('templatetype') === 'MULTIMEDIA'
                        && getValues('headerenabled')) ?
                        <div className="row-zyx">
                            {edit ?
                                <React.Fragment>
                                    <FieldSelect
                                        uset={true}
                                        label={t(langKeys.headertype)}
                                        className={classes.headerType}
                                        valueDefault={getValues('headertype')}
                                        onChange={onChangeHeaderType}
                                        error={errors?.header?.message}
                                        data={dataHeaderType}
                                        optionDesc="text"
                                        optionValue="value"
                                    />
                                    <FieldEdit
                                        label={t(langKeys.header)}
                                        className={classes.headerText}
                                        valueDefault={getValues('header')}
                                        onChange={(value) => setValue('header', value)}
                                        error={errors?.header?.message}
                                    />
                                </React.Fragment>
                                :
                                <FieldView
                                    label={t(langKeys.header)}
                                    value={row ? (row.header || "") : ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        : null}
                    <div className="row-zyx">
                        {getValues('type') === 'MAIL' &&
                            <React.Fragment>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.body)}</Box>
                                <RichText
                                    value={bodyObject}
                                    onChange={(value) => {
                                        setBodyObject(value)
                                    }}
                                    spellCheck
                                />
                            </React.Fragment>
                        }
                        {(getValues('type') === 'HTML') &&
                            <React.Fragment>
                                {typeAttachment === 'IMPORT' &&
                                    <Button
                                        variant="contained"
                                        component="label"
                                    >
                                        <input
                                            type="file"
                                            onChange={(e) => onChangeAttachmentTemplate(e.target.files)}
                                        />
                                    </Button>}
                                {typeAttachment === 'EDIT' &&
                                    <FieldEditMulti
                                        label={t(langKeys.body)}
                                        className="col-12"
                                        valueDefault={getValues('body')}
                                        onChange={(value) => { setValue('body', value); setBodyAttachment(value) }}
                                        error={errors?.body?.message}
                                    />
                                }
                                <div dangerouslySetInnerHTML={{ __html: bodyAttachment }} />
                            </React.Fragment>
                        }
                        {(getValues('type') === 'SMS' || getValues('type') === 'HSM') &&
                            (
                                edit ?
                                    <FieldEditMulti
                                        label={t(langKeys.body)}
                                        className="col-12"
                                        valueDefault={getValues('body')}
                                        onChange={(value) => setValue('body', value)}
                                        error={errors?.body?.message}
                                        maxLength={1024}
                                    />
                                    : <FieldView
                                        label={t(langKeys.body)}
                                        value={row ? (row.body || "") : ""}
                                        className="col-12"
                                    />
                            )
                        }
                    </div>
                    {(getValues('templatetype') === 'MULTIMEDIA'
                        && getValues('footerenabled')) ?
                        <div className="row-zyx">
                            {edit ?
                                <FieldEditMulti
                                    label={t(langKeys.footer)}
                                    className="col-12"
                                    valueDefault={getValues('footer')}
                                    onChange={(value) => setValue('footer', value)}
                                    error={errors?.footer?.message}
                                    rows={2}
                                    maxLength={60}
                                />
                                :
                                <FieldView
                                    label={t(langKeys.footer)}
                                    value={row ? (row.footer || "") : ""}
                                    className="col-12"
                                />
                            }
                        </div>
                        : null}
                    {(getValues('templatetype') === 'MULTIMEDIA'
                        && getValues('buttonsenabled')) ?
                        <div className="row-zyx" style={{ alignItems: 'flex-end' }}>
                            <FieldView
                                label={t(langKeys.buttons)}
                                className={classes.buttonTitle}
                            />
                            {
                                edit && getValues('buttons')?.length < 3 &&
                                <Button
                                    variant="outlined"
                                    type="button"
                                    color="primary"
                                    className={classes.btnButton}
                                    startIcon={<AddIcon color="primary" />}
                                    onClick={() => onClickAddButton()}
                                >{t(langKeys.addbutton)}</Button>
                            }
                            {
                                edit && getValues('buttons')?.length > 0 &&
                                <Button
                                    variant="outlined"
                                    type="button"
                                    color="primary"
                                    className={classes.btnButton}
                                    startIcon={<RemoveIcon color="primary" />}
                                    onClick={() => onClickRemoveButton()}
                                >{t(langKeys.removebutton)}</Button>
                            }
                        </div>
                        : null}
                    {(getValues('templatetype') === 'MULTIMEDIA'
                        && getValues('buttonsenabled')) ?
                        <div className="row-zyx">
                            {edit ?
                                <React.Fragment>
                                    {getValues('buttons')?.map((btn: any, i: number) => {
                                        return (
                                            <div key={`btn-${i}`} className="col-4">
                                                <FieldEdit
                                                    fregister={{
                                                        ...register(`buttons.${i}.title`, {
                                                            validate: (value) => (value && value.length) || t(langKeys.field_required)
                                                        })
                                                    }}
                                                    label={t(langKeys.title)}
                                                    className={classes.mb1}
                                                    valueDefault={btn?.title || ""}
                                                    onChange={(value) => onChangeButton(i, 'title', value)}
                                                    error={errors?.buttons?.[i]?.title?.message}
                                                />
                                                <FieldSelect
                                                    uset={true}
                                                    fregister={{
                                                        ...register(`buttons.${i}.type`, {
                                                            validate: (value) => (value && value.length) || t(langKeys.field_required)
                                                        })
                                                    }}
                                                    label={t(langKeys.type)}
                                                    className={classes.mb1}
                                                    valueDefault={btn?.type || ""}
                                                    onChange={(value) => onChangeButton(i, 'type', value?.value)}
                                                    error={errors?.buttons?.[i]?.type?.message}
                                                    data={dataButtonType}
                                                    optionDesc="text"
                                                    optionValue="value"
                                                />
                                                <FieldEdit
                                                    fregister={{
                                                        ...register(`buttons.${i}.payload`, {
                                                            validate: (value) => (value && value.length) || t(langKeys.field_required)
                                                        })
                                                    }}
                                                    label={t(langKeys.payload)}
                                                    className={classes.mb1}
                                                    valueDefault={btn?.payload || ""}
                                                    onChange={(value) => onChangeButton(i, 'payload', value)}
                                                    error={errors?.buttons?.[i]?.payload?.message}
                                                />
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                                :
                                getValues('buttons')?.map((btn: any, i: number) => {
                                    return (
                                        <div key={`btn${i}`} className="col-4">
                                            <FieldView
                                                label={t(langKeys.title)}
                                                value={btn?.title || ""}
                                                className="col-12"
                                            />
                                            <FieldView
                                                label={t(langKeys.type)}
                                                value={btn?.type || ""}
                                                className="col-12"
                                            />
                                            <FieldView
                                                label={t(langKeys.payload)}
                                                value={btn?.payload || ""}
                                                className="col-12"
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        : null}
                    {getValues("type") === 'MAIL' &&
                        <div>
                            <FieldView label={t(langKeys.files)} />
                            {edit ?
                                <React.Fragment>
                                    <input
                                        accept="file/*"
                                        style={{ display: 'none' }}
                                        id="attachmentInput"
                                        type="file"
                                        onChange={(e) => onChangeAttachment(e.target.files)}
                                    />
                                    {<IconButton
                                        onClick={onClickAttachment}
                                        disabled={waitUploadFile}
                                    >
                                        <AttachFileIcon color="primary" />
                                    </IconButton>}
                                    {!!getValues("attachment") && getValues("attachment").split(',').map((f: string, i: number) => (
                                        <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                                    ))}
                                    {waitUploadFile && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {getValues("attachment").split(',').map((f: string, i: number) => (
                                        <FilePreview key={`attachment-view-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                                    ))}
                                </React.Fragment>
                            }
                        </div>}
                </div>
            </form>
        </div>
    );
}

interface FilePreviewProps {
    src: File | string;
    onClose?: (f: string) => void;
}

const useFilePreviewStyles = makeStyles(theme => ({
    btnContainer: {
        color: 'lightgrey',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    root: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(1),
        maxHeight: 80,
        maxWidth: 300,
        overflow: 'hidden',
        padding: theme.spacing(1),
        width: 'fit-content',
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes('http'), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = (src as string).match(/.*\/(.+?)\./);
            return m && m.length > 1 ? m[1] : "";
        };
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split('.').pop()?.toUpperCase() || "-";
        }
        return (src as File).name?.split('.').pop()?.toUpperCase() || "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: '0.5em' }} />
            <div className={classes.infoContainer}>
                <div>
                    <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 190, whiteSpace: 'nowrap' }}>{getFileName()}</div>{getFileExt()}
                </div>
            </div>
            <div style={{ width: '0.5em' }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: '10%' }} />}
                {isUrl() && (
                    <a href={src as string} target="_blank" rel="noreferrer" download={`${getFileName()}.${getFileExt()}`}>
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}

export default MessageTemplates;