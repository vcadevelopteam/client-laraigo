/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, FC, useCallback, useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import TableZyx from '../components/fields/table-simple';
import { Box, CircularProgress, IconButton, Paper } from '@material-ui/core';
import { Close, FileCopy, GetApp } from '@material-ui/icons';
import { getMessageTemplateSel, getValuesFromDomain, insMessageTemplate, richTextToString, selCommunicationChannelWhatsApp, dateToLocalDate } from 'common/helpers';
import { Descendant } from "slate";
import { Dictionary, MultiData } from "@types";
import { execute, getCollection, getMultiCollection, resetAllMain, uploadFile, cleanMemoryTable, setMemoryTable } from 'store/main/actions';
import { FieldEdit, FieldEditMulti, FieldSelect, FieldView, TemplateBreadcrumbs, TemplateIcons, TitleDetail } from 'components';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { RichText, renderToString, toElement } from 'components/fields/RichText';
import { useDispatch } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { synchronizeTemplate, deleteTemplate, addTemplate } from 'store/channel/actions';

const CodeMirror = React.lazy(() => import('@uiw/react-codemirror'));

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

const IDMESSAGETEMPLATE = "IDMESSAGETEMPLATE";
const MessageTemplates: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const synchronizeRequest = useSelector(state => state.channel.requestSynchronizeTemplate);
    const deleteRequest = useSelector(state => state.channel.requestDeleteTemplate);

    const [communicationChannelList, setCommunicationChannelList] = useState<Dictionary[]>([]);
    const [communicationChannel, setCommunicationChannel] = useState<any>(null);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [showId, setShowId] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);
    const [waitSynchronize, setWaitSynchronize] = useState(false);
    const [waitDelete, setWaitDelete] = useState(false);

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
                    return (
                        <div>{dateToLocalDate(row.createdate)}</div>
                    )
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
                prefixTranslation: 'messagetemplate_',
                NoFilter: true,
            },
            {
                accessor: 'templatetype',
                Header: t(langKeys.templatetype),
                prefixTranslation: 'messagetemplate_',
                NoFilter: true,
            },
            {
                accessor: 'name',
                Header: t(langKeys.name),
                NoFilter: true,
            },
            {
                accessor: 'namespace',
                Header: t(langKeys.namespace),
                NoFilter: true,
            },
            {
                accessor: 'status',
                Header: t(langKeys.status),
                prefixTranslation: 'status_',
                NoFilter: true,
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
                    return (externalstatus ? t(`TEMPLATE_${externalstatus}`) : t(langKeys.none)).toUpperCase();
                }
            },
        ],
        [showId]
    )

    const fetchData = () => dispatch(getCollection(getMessageTemplateSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(setMemoryTable({
            id: IDMESSAGETEMPLATE
        }));
        dispatch(getMultiCollection([
            getValuesFromDomain("MESSAGETEMPLATECATEGORY"),
            getValuesFromDomain("LANGUAGE"),
            selCommunicationChannelWhatsApp(),
        ]));
        return () => {
            dispatch(resetAllMain());
            dispatch(cleanMemoryTable());
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
        if (waitDelete) {
            if (!deleteRequest.loading && !deleteRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            } else if (deleteRequest.error) {
                const errormessage = t(deleteRequest.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [deleteRequest, waitDelete]);

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
        if (row?.fromprovider) {
            const callback = () => {
                dispatch(deleteTemplate({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id }));
                dispatch(showBackdrop(true));
                setWaitDelete(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback,
            }))
        }
        else {
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
                pageSizeDefault={IDMESSAGETEMPLATE === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                initialPageIndex={IDMESSAGETEMPLATE === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                initialStateFilter={IDMESSAGETEMPLATE === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
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
    const dataChannel = multiData[2] && multiData[2].success ? multiData[2].data.filter(x => x.type !== "WHAG") : [];
    const addRequest = useSelector(state => state.channel.requestAddTemplate);
    const executeRes = useSelector(state => state.main.execute);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const [htmlLoad, setHtmlLoad] = useState<any | undefined>(undefined)
    const [bodyAttachment, setBodyAttachment] = useState(row?.body || "");
    const [bodyAlert, setBodyAlert] = useState("");
    const [bodyObject, setBodyObject] = useState<Descendant[]>(row?.bodyobject || [{ "type": "paragraph", "children": [{ "text": row?.body || "" }] }]);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentTemplate, setFileAttachmentTemplate] = useState<File | null>(null);
    const [htmlEdit, setHtmlEdit] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isNew, setIsNew] = useState(row?.id ? false : true);
    const [isProvider, setIsProvider] = useState(row?.fromprovider ? true : false);
    const [disableInput, setDisableInput] = useState(false);
    const [disableNamespace, setDisableNamespace] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitAdd, setWaitAdd] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

    const dataExternalCategory = [
        { value: "ACCOUNT_UPDATE", description: t(langKeys.TEMPLATE_ACCOUNT_UPDATE) },
        { value: "PAYMENT_UPDATE", description: t(langKeys.TEMPLATE_PAYMENT_UPDATE) },
        { value: "PERSONAL_FINANCE_UPDATE", description: t(langKeys.TEMPLATE_PERSONAL_FINANCE_UPDATE) },
        { value: "SHIPPING_UPDATE", description: t(langKeys.TEMPLATE_SHIPPING_UPDATE) },
        { value: "RESERVATION_UPDATE", description: t(langKeys.TEMPLATE_RESERVATION_UPDATE) },
        { value: "ISSUE_RESOLUTION", description: t(langKeys.TEMPLATE_ISSUE_RESOLUTION) },
        { value: "APPOINTMENT_UPDATE", description: t(langKeys.TEMPLATE_APPOINTMENT_UPDATE) },
        { value: "TRANSPORTATION_UPDATE", description: t(langKeys.TEMPLATE_TRANSPORTATION_UPDATE) },
        { value: "TICKET_UPDATE", description: t(langKeys.TEMPLATE_TICKET_UPDATE) },
        { value: "ALERT_UPDATE", description: t(langKeys.TEMPLATE_ALERT_UPDATE) },
        { value: "AUTO_REPLY", description: t(langKeys.TEMPLATE_AUTO_REPLY) },
        { value: "TRANSACTIONAL", description: t(langKeys.TEMPLATE_TRANSACTIONAL) },
        { value: "MARKETING", description: t(langKeys.TEMPLATE_MARKETING) },
        { value: "OTP", description: t(langKeys.TEMPLATE_OTP) },
    ];

    const dataExternalStatus = [
        { value: "APPROVED", description: t(langKeys.TEMPLATE_APPROVED) },
        { value: "IN_APPEAL", description: t(langKeys.TEMPLATE_IN_APPEAL) },
        { value: "PENDING", description: t(langKeys.TEMPLATE_PENDING) },
        { value: "REJECTED", description: t(langKeys.TEMPLATE_REJECTED) },
        { value: "PENDING_DELETION", description: t(langKeys.TEMPLATE_PENDING_DELETION) },
        { value: "DELETED", description: t(langKeys.TEMPLATE_DELETED) },
        { value: "DISABLED", description: t(langKeys.TEMPLATE_DISABLED) },
        { value: "LOCKED", description: t(langKeys.TEMPLATE_LOCKED) },
        { value: "PAUSED", description: t(langKeys.TEMPLATE_PAUSED) },
        { value: "SUBMITTED", description: t(langKeys.TEMPLATE_SUBMITTED) },
        { value: "NONE", description: (t(langKeys.NONE) || "").toUpperCase() },
    ];

    const dataExternalLanguage = [
        { description: t(langKeys.TEMPLATE_AF), value: "AF" },
        { description: t(langKeys.TEMPLATE_SQ), value: "SQ" },
        { description: t(langKeys.TEMPLATE_AR), value: "AR" },
        { description: t(langKeys.TEMPLATE_AZ), value: "AZ" },
        { description: t(langKeys.TEMPLATE_BN), value: "BN" },
        { description: t(langKeys.TEMPLATE_BG), value: "BG" },
        { description: t(langKeys.TEMPLATE_CA), value: "CA" },
        { description: t(langKeys.TEMPLATE_ZH_CN), value: "ZH_CN" },
        { description: t(langKeys.TEMPLATE_ZH_HK), value: "ZH_HK" },
        { description: t(langKeys.TEMPLATE_ZH_TW), value: "ZH_TW" },
        { description: t(langKeys.TEMPLATE_HR), value: "HR" },
        { description: t(langKeys.TEMPLATE_CS), value: "CS" },
        { description: t(langKeys.TEMPLATE_DA), value: "DA" },
        { description: t(langKeys.TEMPLATE_NL), value: "NL" },
        { description: t(langKeys.TEMPLATE_EN), value: "EN" },
        { description: t(langKeys.TEMPLATE_EN_GB), value: "EN_GB" },
        { description: t(langKeys.TEMPLATE_EN_US), value: "EN_US" },
        { description: t(langKeys.TEMPLATE_ET), value: "ET" },
        { description: t(langKeys.TEMPLATE_FIL), value: "FIL" },
        { description: t(langKeys.TEMPLATE_FI), value: "FI" },
        { description: t(langKeys.TEMPLATE_FR), value: "FR" },
        { description: t(langKeys.TEMPLATE_KA), value: "KA" },
        { description: t(langKeys.TEMPLATE_DE), value: "DE" },
        { description: t(langKeys.TEMPLATE_EL), value: "EL" },
        { description: t(langKeys.TEMPLATE_GU), value: "GU" },
        { description: t(langKeys.TEMPLATE_HA), value: "HA" },
        { description: t(langKeys.TEMPLATE_HE), value: "HE" },
        { description: t(langKeys.TEMPLATE_HI), value: "HI" },
        { description: t(langKeys.TEMPLATE_HU), value: "HU" },
        { description: t(langKeys.TEMPLATE_ID), value: "ID" },
        { description: t(langKeys.TEMPLATE_GA), value: "GA" },
        { description: t(langKeys.TEMPLATE_IT), value: "IT" },
        { description: t(langKeys.TEMPLATE_JA), value: "JA" },
        { description: t(langKeys.TEMPLATE_KN), value: "KN" },
        { description: t(langKeys.TEMPLATE_KK), value: "KK" },
        { description: t(langKeys.TEMPLATE_RW_RW), value: "RW_RW" },
        { description: t(langKeys.TEMPLATE_KO), value: "KO" },
        { description: t(langKeys.TEMPLATE_KY_KG), value: "KY_KG" },
        { description: t(langKeys.TEMPLATE_LO), value: "LO" },
        { description: t(langKeys.TEMPLATE_LV), value: "LV" },
        { description: t(langKeys.TEMPLATE_LT), value: "LT" },
        { description: t(langKeys.TEMPLATE_MK), value: "MK" },
        { description: t(langKeys.TEMPLATE_MS), value: "MS" },
        { description: t(langKeys.TEMPLATE_ML), value: "ML" },
        { description: t(langKeys.TEMPLATE_MR), value: "MR" },
        { description: t(langKeys.TEMPLATE_NB), value: "NB" },
        { description: t(langKeys.TEMPLATE_FA), value: "FA" },
        { description: t(langKeys.TEMPLATE_PL), value: "PL" },
        { description: t(langKeys.TEMPLATE_PT_BR), value: "PT_BR" },
        { description: t(langKeys.TEMPLATE_PT_PT), value: "PT_PT" },
        { description: t(langKeys.TEMPLATE_PA), value: "PA" },
        { description: t(langKeys.TEMPLATE_RO), value: "RO" },
        { description: t(langKeys.TEMPLATE_RU), value: "RU" },
        { description: t(langKeys.TEMPLATE_SR), value: "SR" },
        { description: t(langKeys.TEMPLATE_SK), value: "SK" },
        { description: t(langKeys.TEMPLATE_SL), value: "SL" },
        { description: t(langKeys.TEMPLATE_ES), value: "ES" },
        { description: t(langKeys.TEMPLATE_ES_AR), value: "ES_AR" },
        { description: t(langKeys.TEMPLATE_ES_ES), value: "ES_ES" },
        { description: t(langKeys.TEMPLATE_ES_MX), value: "ES_MX" },
        { description: t(langKeys.TEMPLATE_SW), value: "SW" },
        { description: t(langKeys.TEMPLATE_SV), value: "SV" },
        { description: t(langKeys.TEMPLATE_TA), value: "TA" },
        { description: t(langKeys.TEMPLATE_TE), value: "TE" },
        { description: t(langKeys.TEMPLATE_TH), value: "TH" },
        { description: t(langKeys.TEMPLATE_TR), value: "TR" },
        { description: t(langKeys.TEMPLATE_UK), value: "UK" },
        { description: t(langKeys.TEMPLATE_UR), value: "UR" },
        { description: t(langKeys.TEMPLATE_UZ), value: "UZ" },
        { description: t(langKeys.TEMPLATE_VI), value: "VI" },
        { description: t(langKeys.TEMPLATE_ZU), value: "ZU" },
    ];

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
        { value: "phone_number", text: t(langKeys.messagetemplate_phonenumber) },
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
            externalstatus: row?.externalstatus || 'NONE',
            communicationchannelid: row?.communicationchannelid || 0,
            communicationchanneltype: row?.communicationchanneltype || '',
            servicecredentials: row?.communicationchannelservicecredentials || '',
            integrationid: row?.communicationchannelintegrationid || '',
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
        register('name', { validate: (value) => (value && ((value || "").match("^[a-z0-9_]+$") !== null)) || t(langKeys.nametemplate_validation) });
        register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('templatetype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('typeattachment');
        register('fromprovider');
        register('externalid');
        register('externalstatus');
        register('communicationchannelid');
        register('communicationchanneltype');
        register('servicecredentials');
        register('integrationid');
        register('exampleparameters');
    }, [edit, register]);

    useEffect(() => {
        import('@codemirror/lang-html').then(html => {
           setHtmlLoad([html.html({ matchClosingTags: true })])
        });
    }, [])

    useEffect(() => {
        if (!isNew && isProvider) {
            setDisableInput(true);
        }
    }, [isNew, isProvider])

    useEffect(() => {
        if (waitAdd) {
            if (!addRequest.loading && !addRequest.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (addRequest.error) {
                const errormessage = t(addRequest.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitAdd(false);
            }
        }
    }, [addRequest, waitAdd])

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

        if (isNew && isProvider) {
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

                dispatch(addTemplate({ ...data, bodyobject: bodyObject }));
                dispatch(showBackdrop(true));
                setWaitAdd(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            }))
        }
        else {
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
        }
    });

    useEffect(() => {
        if (row) {
            if (row.fromprovider && row.communicationchanneltype) {
                setDisableNamespace(row.communicationchanneltype === "WHAT" ? false : true);
            }
            else {
                setDisableNamespace(false);
            }


            const type = row?.type || "HSM";

            if (type === "HSM") {
                register('name', { validate: (value) => (value && ((value || "").match("^[a-z0-9_]+$") !== null)) || t(langKeys.nametemplate_validation) });
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
                register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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

        setIsProvider(false);

        setValue('fromprovider', false);
        setValue('externalid', '');
        setValue('externalstatus', '');
        setValue('communicationchannelid', 0);
        setValue('communicationchanneltype', '');
        setValue('exampleparameters', '');
        setValue('servicecredentials', '');
        setValue('integrationid', '');
        setValue('fromprovider', false);

        trigger('fromprovider');
        trigger('externalid');
        trigger('externalstatus');
        trigger('communicationchannelid');
        trigger('communicationchanneltype');
        trigger('exampleparameters');
        trigger('servicecredentials');
        trigger('integrationid');
        trigger('fromprovider');

        setValue('type', data?.value || '');

        trigger('type');

        switch (data?.value || 'HSM') {
            case 'HSM':
                setValue('body', '');

                register('name', { validate: (value) => (value && ((value || "").match("^[a-z0-9_]+$") !== null)) || t(langKeys.nametemplate_validation) });
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

                register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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

                register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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

    const changeProvider = async (value: any) => {
        if (value && isProvider) {
        }
        else {
            setValue('category', '');
        }

        if (value) {
            setIsProvider(true);

            setValue('fromprovider', true);
            setValue('externalid', '');
            setValue('externalstatus', 'PENDING');
            setValue('communicationchannelid', value.communicationchannelid);
            setValue('communicationchanneltype', value.type);
            setValue('exampleparameters', '');
            setValue('servicecredentials', value.servicecredentials);
            setValue('integrationid', value.integrationid);
            setValue('fromprovider', true);

            if (value.type === "WHAT") {
                setDisableNamespace(false);
            }
            else {
                setDisableNamespace(true);
                setValue('namespace', '-');
            }
        }
        else {
            setIsProvider(false);

            setValue('fromprovider', false);
            setValue('externalid', '');
            setValue('externalstatus', 'NONE');
            setValue('communicationchannelid', 0);
            setValue('communicationchanneltype', '');
            setValue('exampleparameters', '');
            setValue('servicecredentials', '');
            setValue('integrationid', '');
            setValue('fromprovider', false);

            setDisableNamespace(false);
        }

        trigger('fromprovider');
        trigger('externalid');
        trigger('externalstatus');
        trigger('communicationchannelid');
        trigger('communicationchanneltype');
        trigger('exampleparameters');
        trigger('servicecredentials');
        trigger('integrationid');
        trigger('fromprovider');
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
                        <FieldSelect
                            className="col-6"
                            data={dataMessageType}
                            error={errors?.type?.message}
                            label={t(langKeys.messagetype)}
                            onChange={onChangeMessageType}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues('type')}
                            disabled={disableInput}
                        />
                        <FieldEdit
                            className="col-6"
                            error={errors?.name?.message}
                            label={t(langKeys.name)}
                            onChange={(value) => setValue('name', value)}
                            valueDefault={getValues('name')}
                            disabled={disableInput}
                        />
                    </div>
                    <div className="row-zyx">
                        {isProvider && <>
                            {isNew && <FieldSelect
                                className="col-6"
                                data={dataExternalCategory}
                                error={errors?.category?.message}
                                label={t(langKeys.category)}
                                onChange={(value) => setValue('category', value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                valueDefault={getValues('category')}
                                disabled={disableInput}
                            />}
                            {!isNew && <FieldView
                                className="col-6"
                                label={t(langKeys.category)}
                                value={row ? (t(`TEMPLATE_${row.category}`)) : ""}
                            />}
                        </>}
                        {!isProvider && <FieldSelect
                            className="col-6"
                            data={dataCategory}
                            error={errors?.category?.message}
                            label={t(langKeys.category)}
                            onChange={(value) => setValue('category', value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            valueDefault={getValues('category')}
                            disabled={disableInput}
                        />}
                        {isProvider && <FieldSelect
                            className="col-6"
                            data={dataExternalLanguage}
                            error={errors?.language?.message}
                            label={t(langKeys.language)}
                            onChange={(value) => setValue('language', value?.value)}
                            optionDesc="description"
                            optionValue="value"
                            valueDefault={getValues('language')}
                            disabled={disableInput}
                        />}
                        {!isProvider && <FieldSelect
                            className="col-6"
                            data={dataLanguage}
                            error={errors?.language?.message}
                            label={t(langKeys.language)}
                            onChange={(value) => setValue('language', value?.domainvalue)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            valueDefault={getValues('language')}
                            disabled={disableInput}
                        />}
                    </div>
                    {getValues('type') === 'HSM' && <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataChannel}
                            error={errors?.communicationchannelid?.message}
                            label={t(langKeys.messagetemplate_fromprovider)}
                            onChange={(value) => changeProvider(value)}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                            valueDefault={getValues('communicationchannelid')}
                            disabled={!isNew || disableInput}
                        />
                        <FieldSelect
                            className="col-6"
                            data={dataExternalStatus}
                            error={errors?.externalstatus?.message}
                            label={t(langKeys.messagetemplate_externalstatus)}
                            optionDesc="description"
                            optionValue="value"
                            valueDefault={getValues('externalstatus')}
                            disabled={true}
                        />
                    </div>}
                    {getValues('type') === 'HSM' && <div className="row-zyx">
                        <FieldEdit
                            className="col-12"
                            error={errors?.namespace?.message}
                            label={t(langKeys.namespace)}
                            onChange={(value) => setValue('namespace', value)}
                            valueDefault={getValues('namespace')}
                            disabled={disableNamespace}
                        />
                    </div>}
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-12"
                            data={dataTemplateType}
                            disabled={templateTypeDisabled || disableInput}
                            error={errors?.templatetype?.message}
                            label={t(langKeys.templatetype)}
                            onChange={onChangeTemplateType}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues('templatetype')}
                        />
                    </div>
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('type') === 'HSM') && <div className="row-zyx">
                        <React.Fragment>
                            <Button
                                className={classes.mediabutton}
                                onClick={() => onClickHeaderToogle()}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: getValues('headerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                                disabled={disableInput}
                            >{t(langKeys.header)}</Button>
                            <Button
                                className={classes.mediabutton}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                                disabled={disableInput}
                            >{t(langKeys.body)}</Button>
                            <Button
                                className={classes.mediabutton}
                                onClick={() => onClickFooterToogle()}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: getValues('footerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                                disabled={disableInput}
                            >{t(langKeys.footer)}</Button>
                            <Button
                                className={classes.mediabutton}
                                onClick={() => onClickButtonsToogle()}
                                startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                style={{ backgroundColor: getValues('buttonsenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                type="button"
                                variant="contained"
                                disabled={disableInput}
                            >{t(langKeys.buttons)}</Button>
                        </React.Fragment>
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('headerenabled') && getValues('type') === 'HSM') && <div className="row-zyx">
                        <React.Fragment>
                            <FieldSelect
                                className={classes.headerType}
                                data={dataHeaderType}
                                label={t(langKeys.headertype)}
                                onChange={onChangeHeaderType}
                                optionDesc="text"
                                optionValue="value"
                                disabled={disableInput}
                                valueDefault={getValues('headertype')}
                            />
                            <FieldEdit
                                className={classes.headerText}
                                error={errors?.header?.message}
                                label={t(langKeys.header)}
                                onChange={(value) => setValue('header', value)}
                                valueDefault={getValues('header')}
                                disabled={disableInput && getValues('header') === "text"}
                            />
                        </React.Fragment>
                    </div>}
                    {(getValues('type') === 'SMS' || getValues('type') === 'HSM') && <div className="row-zyx">
                        <FieldEditMulti
                            className="col-12"
                            error={errors?.body?.message}
                            label={t(langKeys.body)}
                            maxLength={getValues('type') === 'SMS' ? 160 : 1024}
                            onChange={(value) => setValue('body', value)}
                            valueDefault={getValues('body')}
                            disabled={disableInput}
                        />
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('footerenabled') && getValues('type') === 'HSM') && <div className="row-zyx">
                        <FieldEditMulti
                            className="col-12"
                            error={errors?.footer?.message}
                            label={t(langKeys.footer)}
                            maxLength={60}
                            onChange={(value) => setValue('footer', value)}
                            rows={2}
                            valueDefault={getValues('footer')}
                            disabled={disableInput}
                        />
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('buttonsenabled') && getValues('type') === 'HSM') && <div className="row-zyx" style={{ alignItems: 'flex-end' }}>
                        <FieldView
                            className={classes.buttonTitle}
                            label={t(langKeys.buttons)}
                        />
                        {(getValues('buttons')?.length < 3) && <Button
                            className={classes.btnButton}
                            color="primary"
                            onClick={() => onClickAddButton()}
                            startIcon={<AddIcon color="primary" />}
                            style={{ margin: "10px" }}
                            type="button"
                            variant="outlined"
                            disabled={disableInput}
                        >{t(langKeys.addbutton)}
                        </Button>}
                        {(getValues('buttons')?.length > 0) && <Button
                            className={classes.btnButton}
                            color="primary"
                            onClick={() => onClickRemoveButton()}
                            startIcon={<RemoveIcon color="primary" />}
                            style={{ margin: "10px" }}
                            type="button"
                            variant="outlined"
                            disabled={disableInput}
                        >{t(langKeys.removebutton)}
                        </Button>}
                    </div>}
                    {(getValues('templatetype') === 'MULTIMEDIA' && getValues('buttonsenabled') && getValues('type') === 'HSM') && <div className="row-zyx">
                        <React.Fragment>
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
                                        disabled={disableInput}
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
                                        disabled={disableInput}
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
                                        disabled={disableInput}
                                    />
                                </div>)
                            })}
                        </React.Fragment>
                    </div>}
                    {(getValues('type') === 'MAIL' || getValues('type') === 'HTML') && <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            error={errors?.header?.message}
                            label={t(langKeys.subject)}
                            onChange={(value) => setValue('header', value)}
                            valueDefault={getValues('header')}
                            disabled={disableInput}
                        />
                        <FieldSelect
                            className="col-6"
                            data={dataPriority}
                            error={errors?.priority?.message}
                            label={t(langKeys.priority)}
                            onChange={(value) => setValue('priority', value?.value)}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues('priority')}
                            disabled={disableInput}
                        />
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
                        <Button
                            component="label"
                            variant="contained"
                            disabled={disableInput}
                        >
                            <input
                                accept=".html"
                                onChange={(e) => onChangeAttachmentTemplate(e.target.files)}
                                type="file"
                            />
                        </Button>
                        <FieldEdit
                            className={classes.headerText}
                            disabled={true}
                            error={bodyAlert}
                            label={''}
                        />
                    </div>}
                    {getValues('type') === 'HTML' && <div className="row-zyx">
                        {bodyAttachment && <React.Fragment>
                            <MenuItem onClick={() => setHtmlEdit(!htmlEdit)} disabled={disableInput}>
                                <ListItemIcon color="inherit">
                                    <RefreshIcon style={{ width: 16, color: "#7721AD" }} fontSize="small" />
                                </ListItemIcon>
                                <div style={{ fontSize: 16 }}>{htmlEdit ? t(langKeys.messagetemplate_changetoview) : t(langKeys.messagetemplate_changetoeditor)}</div>
                            </MenuItem>
                            {!htmlEdit ? <div style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#762AA9", borderRadius: "4px", padding: "20px" }} dangerouslySetInnerHTML={{ __html: bodyAttachment }} /> : (
                                <Suspense fallback={<div>Loading...</div>}>
                                    <CodeMirror
                                        value={getValues('body')}
                                        height={"600px"}
                                        onChange={(value) => { setValue('body', value || ""); setBodyAttachment(value || ""); }}
                                        extensions={htmlLoad}
                                    />
                                </Suspense>
                            )}
                        </React.Fragment>}
                    </div>}
                    {(getValues('type') === 'MAIL' || getValues('type') === 'HTML') && <div className="row-zyx">
                        <FieldView label={t(langKeys.messagetemplate_attachment)} />
                        <React.Fragment>
                            <input
                                accept="file/*"
                                id="attachmentInput"
                                onChange={(e) => onChangeAttachment(e.target.files)}
                                style={{ display: 'none' }}
                                type="file"
                                disabled={disableInput}
                            />
                            {<IconButton
                                disabled={waitUploadFile || disableInput}
                                onClick={onClickAttachment}
                                style={{ borderRadius: "0px" }}
                            >
                                <AttachFileIcon color="primary" />
                            </IconButton>}
                            {!!getValues("attachment") && getValues("attachment").split(',').map((f: string, i: number) => (
                                <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                            ))}
                            {waitUploadFile && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
                        </React.Fragment>
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