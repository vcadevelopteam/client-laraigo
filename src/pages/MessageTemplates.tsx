/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from '@material-ui/icons/Add';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CodeMirror from '@uiw/react-codemirror';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import React, { FC, useCallback, useEffect, useState } from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import TableZyx from '../components/fields/table-simple';

import { Box, CircularProgress, IconButton, Paper } from '@material-ui/core';
import { Close, FileCopy, GetApp } from '@material-ui/icons';
import { convertLocalDate, getMessageTemplateSel, getValuesFromDomain, insMessageTemplate, richTextToString, selCommunicationChannelWhatsApp } from 'common/helpers';
import { Descendant } from "slate";
import { Dictionary, MultiData } from "@types";
import { execute, getCollection, getMultiCollection, resetAllMain, uploadFile } from 'store/main/actions';
import { FieldEdit, FieldEditMulti, FieldSelect, FieldView, RichText, TemplateBreadcrumbs, TemplateIcons, TitleDetail } from 'components';
import { html } from '@codemirror/lang-html';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { renderToString, toElement } from 'components/fields/RichText';
import { useDispatch } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { synchronizeTemplate } from 'store/channel/actions';

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
    const synchronizeRequest = useSelector(state => state.channel.requestSynchronizeTemplate);

    const [communicationChannelList, setCommunicationChannelList] = useState<Dictionary[]>([]);
    const [communicationChannel, setCommunicationChannel] = useState<any>(null);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [showId, setShowId] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);
    const [waitSynchronize, setWaitSynchronize] = useState(false);

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
            {
                accessor: 'fromprovider',
                Header: t(langKeys.messagetemplate_fromprovider),
                NoFilter: true,
                Cell: (props: any) => {
                    const { fromprovider } = props.cell.row.original;
                    return (fromprovider ? t(langKeys.yes) : t(langKeys.no)).toUpperCase();
                }
            },
            {
                accessor: 'externalstatus',
                Header: t(langKeys.messagetemplate_externalstatus),
                NoFilter: true,
                Cell: (props: any) => {
                    const { externalstatus } = props.cell.row.original;
                    return (externalstatus ? t(externalstatus) : t(langKeys.none)).toUpperCase();
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
            selCommunicationChannelWhatsApp(),
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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

    useEffect(() => {
        if (mainResult.multiData.data.length > 0) {
            if (mainResult.multiData.data[2] && mainResult.multiData.data[2].success) {
                setCommunicationChannelList(mainResult.multiData.data[2].data || []);
            }
        }
    }, [mainResult.multiData.data])

    useEffect(() => {
        if (waitSynchronize) {
            if (!synchronizeRequest.loading && !synchronizeRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(synchronizeRequest.code || "success") }))
                dispatch(showBackdrop(false));
                fetchData();
                setWaitSynchronize(false);
            }
            else if (synchronizeRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(synchronizeRequest.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                fetchData();
                setWaitSynchronize(false);
            }
        }
    }, [synchronizeRequest, waitSynchronize])

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

    const handleSynchronize = (channel: any) => {
        const callback = () => {
            dispatch(synchronizeTemplate(channel));
            dispatch(showBackdrop(true));
            setWaitSynchronize(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.messagetemplate_synchronize_alert01) + `${channel.communicationchanneldesc} (${channel.phone})` + t(langKeys.messagetemplate_synchronize_alert02),
            callback
        }))
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
                ButtonsElement={() => (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <FieldSelect
                            label={t(langKeys.communicationchannel)}
                            style={{ width: 300 }}
                            valueDefault={communicationChannel?.communicationchannelid}
                            variant="outlined"
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                            data={communicationChannelList}
                            onChange={(value) => { setCommunicationChannel(value) }}
                        />
                        <Button
                            disabled={!communicationChannel}
                            variant="contained"
                            color="primary"
                            style={{ width: 140, backgroundColor: "#55BD84" }}
                            startIcon={<RefreshIcon style={{ color: 'white' }} />}
                            onClick={() => { handleSynchronize(communicationChannel) }}
                        >{t(langKeys.messagetemplate_synchronize)}
                        </Button>
                    </div>
                )}
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

    const [bodyAttachment, setBodyAttachment] = useState(row?.body || "");
    const [bodyAlert, setBodyAlert] = useState("");
    const [bodyObject, setBodyObject] = useState<Descendant[]>(row?.bodyobject || [{ "type": "paragraph", "children": [{ "text": row?.body || "" }] }]);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentTemplate, setFileAttachmentTemplate] = useState<File | null>(null);
    const [htmlEdit, setHtmlEdit] = useState(false);
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
            buttonsenabled: ![null, undefined].includes(row?.buttonsenabled) ? row?.buttonsenabled : false,
            category: row?.category || '',
            description: row?.description || '',
            footer: row?.footer || '',
            footerenabled: ![null, undefined].includes(row?.footerenabled) ? row?.footerenabled : false,
            header: row?.header || '',
            headerenabled: ![null, undefined].includes(row?.headerenabled) ? row?.headerenabled : false,
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
            fromprovider: row?.fromprovider || false,
            externalid: row?.externalid || '',
            externalstatus: row?.externalstatus || '',
            communicationchannelid: row?.communicationchannelid || 0,
            communicationchanneltype: row?.communicationchanneltype || '',
            exampleparameters: row?.exampleparameters || '',
        }
    });

    const [templateTypeDisabled, setTemplateTypeDisabled] = useState(['SMS', 'MAIL'].includes(getValues('type')));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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
                setBodyAlert(t(langKeys.field_required));
                return
            }
            else {
                setBodyAlert("");
            }
        }

        if (data.type === 'HTML') {
            if (data.body) {
                setBodyAlert("");
            }
            else {
                setBodyAlert(t(langKeys.field_required));
                return

            }
        }

        const callback = () => {
            if (data.type === 'MAIL') {
                data.body = renderToString(toElement(bodyObject));
                if (data.body === '<div data-reactroot=""><p><span></span></p></div>') {
                    setBodyAlert(t(langKeys.field_required));
                    return;
                }
                else {
                    setBodyAlert("");
                }
            }

            if (data.type === 'HTML') {
                if (data.body) {
                    setBodyAlert("");
                }
                else {
                    setBodyAlert(t(langKeys.field_required));
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
                register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                register('body', { validate: (value) => (value && (value || '').length <= 1024) || "" + t(langKeys.validationchar) });
                register('header', { validate: (value) => true });
                register('footer', { validate: (value) => true });

                if (row?.headerenabled) {
                    register('header', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                }

                if (row?.footerenabled) {
                    register('footer', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                }

                onChangeTemplateMedia();
            }
            else {
                register('namespace', { validate: (value) => true });
                if (type === "SMS") {
                    register('header', { validate: (value) => true });
                    register('body', { validate: (value) => (value && (value || '').length <= 160) || "" + t(langKeys.validationchar) });
                    register('footer', { validate: (value) => true });
                }
                else {
                    register('header', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                    register('body', { validate: (value) => true });
                    register('footer', { validate: (value) => true });
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
                setValue('body', '');

                register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                register('body', { validate: (value) => (value && (value || '').length <= 1024) || "" + t(langKeys.validationchar) });
                register('header', { validate: (value) => true });
                register('footer', { validate: (value) => true });

                if (getValues('headerenabled')) {
                    register('header', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                }

                if (getValues('footerenabled')) {
                    register('footer', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                }

                setTemplateTypeDisabled(false);
                onChangeTemplateMedia();
                break;

            case 'MAIL':
            case 'HTML':
                setValue('body', '');
                setValue('namespace', '');

                register('namespace', { validate: (value) => true });
                register('header', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
                register('body', { validate: (value) => true });
                register('footer', { validate: (value) => true });

                onChangeTemplateType({ value: 'STANDARD' });
                setTemplateTypeDisabled(true);
                break;

            case 'SMS':
                setValue('body', '');
                setValue('namespace', '');

                register('namespace', { validate: (value) => true });
                register('header', { validate: (value) => true });
                register('body', { validate: (value) => (value && (value || '').length <= 160) || "" + t(langKeys.validationchar) });
                register('footer', { validate: (value) => true });
                onChangeTemplateType({ value: 'STANDARD' });
                setTemplateTypeDisabled(true);
                break;
        }
    }

    const onChangeTemplateMedia = async () => {
        if (getValues('headerenabled')) {
            register('header', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        }
        else {
            register('header', { validate: (value) => true });
        }

        if (getValues('footerenabled')) {
            register('footer', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        }
        else {
            register('footer', { validate: (value) => true });
        }

        await trigger('header');
        await trigger('footer');
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
        await trigger('header');

        await onChangeTemplateMedia();
    }

    const onClickFooterToogle = async ({ value }: { value?: Boolean | null } = {}) => {
        if (value) {
            setValue('footerenabled', value);
        }
        else {
            setValue('footerenabled', !getValues('footerenabled'));
        }
        await trigger('footerenabled');
        await trigger('footer');

        await onChangeTemplateMedia();
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
                        {edit ? <FieldSelect
                            className="col-6"
                            data={dataMessageType}
                            error={errors?.type?.message}
                            label={t(langKeys.messagetype)}
                            onChange={onChangeMessageType}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues('type')}
                        /> : <FieldView
                            className="col-6"
                            label={t(langKeys.messagetype)}
                            value={row ? (row.type || "") : ""}
                        />}
                        {edit ? <FieldEdit
                            className="col-6"
                            error={errors?.name?.message}
                            label={t(langKeys.name)}
                            onChange={(value) => setValue('name', value)}
                            valueDefault={getValues('name')}
                        /> : <FieldView
                            className="col-6"
                            label={t(langKeys.name)}
                            value={row ? (row.name || "") : ""}
                        />}
                    </div>
                    <div className="row-zyx">
                        {edit ? <FieldSelect
                            className="col-6"
                            data={dataCategory}
                            error={errors?.category?.message}
                            label={t(langKeys.category)}
                            onChange={(value) => setValue('category', value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            valueDefault={getValues('category')}
                        /> : <FieldView
                            className="col-6"
                            label={t(langKeys.category)}
                            value={row ? (row.category || "") : ""}
                        />}
                        {edit ? <FieldSelect
                            className="col-6"
                            data={dataLanguage}
                            error={errors?.language?.message}
                            label={t(langKeys.language)}
                            onChange={(value) => setValue('language', value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            valueDefault={getValues('language')}
                        /> : <FieldView
                            className="col-6"
                            label={t(langKeys.language)}
                            value={row ? (row.language || "") : ""}
                        />}
                    </div>
                    {getValues('type') === 'HSM' && <div className="row-zyx">
                        {edit ? <FieldEdit
                            className="col-12"
                            error={errors?.namespace?.message}
                            label={t(langKeys.namespace)}
                            onChange={(value) => setValue('namespace', value)}
                            valueDefault={getValues('namespace')}
                        /> : <FieldView
                            className="col-12"
                            label={t(langKeys.namespace)}
                            value={row ? (row.namespace || "") : ""}
                        />}
                    </div>}
                    <div className="row-zyx">
                        {edit ? <FieldSelect
                            className="col-12"
                            data={dataTemplateType}
                            disabled={templateTypeDisabled}
                            error={errors?.templatetype?.message}
                            label={t(langKeys.templatetype)}
                            onChange={onChangeTemplateType}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues('templatetype')}
                        /> : <FieldView
                            className="col-12"
                            label={t(langKeys.templatetype)}
                            value={row ? (row.templatetype || "") : ""}
                        />}
                    </div>
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('type') === 'HSM') && <div className="row-zyx">
                        {edit && <React.Fragment>
                            <Button
                                className={classes.mediabutton}
                                onClick={() => onClickHeaderToogle()}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: getValues('headerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                            >{t(langKeys.header)}</Button>
                            <Button
                                className={classes.mediabutton}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                            >{t(langKeys.body)}</Button>
                            <Button
                                className={classes.mediabutton}
                                onClick={() => onClickFooterToogle()}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: getValues('footerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                            >{t(langKeys.footer)}</Button>
                            <Button
                                className={classes.mediabutton}
                                onClick={() => onClickButtonsToogle()}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: getValues('buttonsenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                            >{t(langKeys.buttons)}</Button>
                        </React.Fragment>}
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('headerenabled') && getValues('type') === 'HSM') && <div className="row-zyx">
                        {edit ? <React.Fragment>
                            <FieldSelect
                                className={classes.headerType}
                                data={dataHeaderType}
                                label={t(langKeys.headertype)}
                                onChange={onChangeHeaderType}
                                optionDesc="text"
                                optionValue="value"
                                valueDefault={getValues('headertype')}
                            />
                            <FieldEdit
                                className={classes.headerText}
                                error={errors?.header?.message}
                                label={t(langKeys.header)}
                                onChange={(value) => setValue('header', value)}
                                valueDefault={getValues('header')}
                            />
                        </React.Fragment> : <FieldView
                            className="col-12"
                            label={t(langKeys.header)}
                            value={row ? (row.header || "") : ""}
                        />}
                    </div>}
                    {(getValues('type') === 'SMS' || getValues('type') === 'HSM') && <div className="row-zyx">
                        {edit ? <FieldEditMulti
                            className="col-12"
                            error={errors?.body?.message}
                            label={t(langKeys.body)}
                            maxLength={getValues('type') === 'SMS' ? 160 : 1024}
                            onChange={(value) => setValue('body', value)}
                            valueDefault={getValues('body')}
                        /> : <FieldEditMulti
                            className="col-12"
                            disabled={true}
                            label={t(langKeys.body)}
                            valueDefault={row ? (row.body || "") : ""}
                        />}
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('footerenabled') && getValues('type') === 'HSM') && <div className="row-zyx">
                        {edit ? <FieldEditMulti
                            className="col-12"
                            error={errors?.footer?.message}
                            label={t(langKeys.footer)}
                            maxLength={60}
                            onChange={(value) => setValue('footer', value)}
                            rows={2}
                            valueDefault={getValues('footer')}
                        /> : <FieldView
                            className="col-12"
                            label={t(langKeys.footer)}
                            value={row ? (row.footer || "") : ""}
                        />
                        }
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('buttonsenabled') && getValues('type') === 'HSM') && <div className="row-zyx" style={{ alignItems: 'flex-end' }}>
                        <FieldView
                            className={classes.buttonTitle}
                            label={t(langKeys.buttons)}
                        />
                        {(edit && getValues('buttons')?.length < 3) && <Button
                            className={classes.btnButton}
                            color="primary"
                            onClick={() => onClickAddButton()}
                            startIcon={<AddIcon color="primary" />}
                            style={{ margin: "10px" }}
                            type="button"
                            variant="outlined"
                        >{t(langKeys.addbutton)}
                        </Button>}
                        {(edit && getValues('buttons')?.length > 0) && <Button
                            className={classes.btnButton}
                            color="primary"
                            onClick={() => onClickRemoveButton()}
                            startIcon={<RemoveIcon color="primary" />}
                            style={{ margin: "10px" }}
                            type="button"
                            variant="outlined"
                        >{t(langKeys.removebutton)}
                        </Button>}
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('buttonsenabled') && getValues('type') === 'HSM') && <div className="row-zyx">
                        {edit ? <React.Fragment>
                            {getValues('buttons')?.map((btn: any, i: number) => {
                                return (<div key={`btn-${i}`} className="col-4">
                                    <FieldEdit
                                        className={classes.mb1}
                                        error={errors?.buttons?.[i]?.title?.message}
                                        fregister={{
                                            ...register(`buttons.${i}.title`, {
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.title)}
                                        onChange={(value) => onChangeButton(i, 'title', value)}
                                        valueDefault={btn?.title || ""}
                                    />
                                    <FieldSelect
                                        className={classes.mb1}
                                        data={dataButtonType}
                                        error={errors?.buttons?.[i]?.type?.message}
                                        fregister={{
                                            ...register(`buttons.${i}.type`, {
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.type)}
                                        onChange={(value) => onChangeButton(i, 'type', value?.value)}
                                        optionDesc="text"
                                        optionValue="value"
                                        valueDefault={btn?.type || ""}
                                    />
                                    <FieldEdit
                                        className={classes.mb1}
                                        error={errors?.buttons?.[i]?.payload?.message}
                                        fregister={{
                                            ...register(`buttons.${i}.payload`, {
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.payload)}
                                        onChange={(value) => onChangeButton(i, 'payload', value)}
                                        valueDefault={btn?.payload || ""}
                                    />
                                </div>)
                            })}
                        </React.Fragment> : getValues('buttons')?.map((btn: any, i: number) => {
                            return (<div key={`btn${i}`} className="col-4">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.title)}
                                    value={btn?.title || ""}
                                />
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.type)}
                                    value={btn?.type || ""}
                                />
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.payload)}
                                    value={btn?.payload || ""}
                                />
                            </div>)
                        })}
                    </div>}
                    {(getValues('type') === 'MAIL' || getValues('type') === 'HTML') && <div className="row-zyx">
                        {edit ? <FieldEdit
                            className="col-6"
                            error={errors?.header?.message}
                            label={t(langKeys.subject)}
                            onChange={(value) => setValue('header', value)}
                            valueDefault={getValues('header')}
                        /> : <FieldView
                            className="col-6"
                            label={t(langKeys.subject)}
                            value={row ? (row.header || "") : ""}
                        />}
                        {edit ? <FieldSelect
                            className="col-6"
                            data={dataPriority}
                            error={errors?.priority?.message}
                            label={t(langKeys.priority)}
                            onChange={(value) => setValue('priority', value?.value)}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues('priority')}
                        /> : <FieldView
                            className="col-6"
                            label={t(langKeys.priority)}
                            value={row ? (row.priority || "") : ""}
                        />}
                    </div>}
                    {getValues('type') === 'MAIL' && <div className="row-zyx">
                        <React.Fragment>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.body)}</Box>
                            <RichText
                                onChange={(value) => {
                                    setBodyObject(value)
                                }}
                                spellCheck
                                style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#762AA9", borderRadius: "4px", padding: "10px" }}
                                value={bodyObject}
                            />
                            <FieldEdit
                                className={classes.headerText}
                                disabled={true}
                                error={bodyAlert}
                                label={''}
                            />
                        </React.Fragment>
                    </div>}
                    {getValues('type') === 'HTML' && <div className="row-zyx">
                        {edit && <Button
                            component="label"
                            variant="contained"
                        >
                            <input
                                accept=".html"
                                onChange={(e) => onChangeAttachmentTemplate(e.target.files)}
                                type="file"
                            />
                        </Button>}
                        <FieldEdit
                            className={classes.headerText}
                            disabled={true}
                            error={bodyAlert}
                            label={''}
                        />
                    </div>}
                    {getValues('type') === 'HTML' && <div className="row-zyx">
                        {bodyAttachment && <React.Fragment>
                            <MenuItem onClick={() => setHtmlEdit(!htmlEdit)}>
                                <ListItemIcon color="inherit">
                                    <RefreshIcon style={{ width: 16, color: "#7721AD" }} fontSize="small" />
                                </ListItemIcon>
                                <div style={{ fontSize: 16 }}>{htmlEdit ? t(langKeys.messagetemplate_changetoview) : t(langKeys.messagetemplate_changetoeditor)}</div>
                            </MenuItem>
                            {!htmlEdit ? <div style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#762AA9", borderRadius: "4px", padding: "20px" }} dangerouslySetInnerHTML={{ __html: bodyAttachment }} /> : <CodeMirror
                                value={getValues('body')}
                                height={"600px"}
                                onChange={(value) => { setValue('body', value || ""); setBodyAttachment(value || ""); }}
                                extensions={[html({ matchClosingTags: true })]}
                            />}
                        </React.Fragment>}
                    </div>}
                    {(getValues('type') === 'MAIL' || getValues('type') === 'HTML') && <div className="row-zyx">
                        <FieldView label={t(langKeys.files)} />
                        {edit ? <React.Fragment>
                            <input
                                accept="file/*"
                                id="attachmentInput"
                                onChange={(e) => onChangeAttachment(e.target.files)}
                                style={{ display: 'none' }}
                                type="file"
                            />
                            {<IconButton
                                disabled={waitUploadFile}
                                onClick={onClickAttachment}
                                style={{ borderRadius: "0px" }}
                            >
                                <AttachFileIcon color="primary" />
                            </IconButton>}
                            {!!getValues("attachment") && getValues("attachment").split(',').map((f: string, i: number) => (
                                <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                            ))}
                            {waitUploadFile && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
                        </React.Fragment> : <React.Fragment>
                            {getValues("attachment").split(',').map((f: string, i: number) => (
                                <FilePreview key={`attachment-view-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                            ))}
                        </React.Fragment>}
                    </div>}
                </div>
            </form>
        </div>
    );
}

interface FilePreviewProps {
    onClose?: (f: string) => void;
    src: File | string;
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