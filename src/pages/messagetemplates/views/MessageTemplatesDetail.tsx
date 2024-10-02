import { addTemplate } from "store/channel/actions";
import { Box, Checkbox, CircularProgress, IconButton, Paper } from "@material-ui/core";
import { Close, FileCopy, GetApp } from "@material-ui/icons";
import { Descendant } from "slate";
import { Dictionary, MultiData } from "@types";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core/styles";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { RichText, renderToString, toElement } from "components/fields/RichText";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import Picker from '@emoji-mart/react'

// import { EmojiData } from 'emoji-mart';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import WarningIcon from '@material-ui/icons/Warning';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import NotificationsIcon from '@material-ui/icons/Notifications';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import CloseIcon from '@material-ui/icons/Close';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import ImageIcon from '@material-ui/icons/Image';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import Tooltip from '@material-ui/core/Tooltip';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import DescriptionIcon from '@material-ui/icons/Description';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import {
    FormatBold as FormatBoldIcon,
    FormatItalic as FormatItalicIcon,
    Code as FormatCodeIcon,
    FormatStrikethrough as FormatStrikethroughIcon,
    EmojiEmotions as EmojiEmotionsIcon,
} from '@material-ui/icons';

import {
    execute,
    uploadFile,
} from "store/main/actions";

import {
    FieldEdit,
    FieldEditAdvanced,
    FieldEditAdvancedAux,
    FieldEditMulti,
    FieldMultiSelect,
    FieldSelect,
    FieldView,
    SingleLineInput,
    TemplateBreadcrumbs,
    TitleDetail,
} from "components";

import {
    insMessageTemplate,
    richTextToString,
} from "common/helpers";

import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import React, { FC, Suspense, useCallback, useEffect, useState, useRef, ChangeEvent } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import SaveIcon from "@material-ui/icons/Save";
import { AddButtonMenu, AddButtonMenuCard, CustomTextWithHelper, CustomTitleHelper, MessagePreviewAuthentication, MessagePreviewCarousel, MessagePreviewMultimedia } from "../components/components";
import { PDFRedIcon } from "icons";

const CodeMirror = React.lazy(() => import("@uiw/react-codemirror"));

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailProps {
    data: RowSelected;
    fetchData: () => void;
    multiData: MultiData[];
    setViewSelected: (view: string) => void;
    handleSynchronize: () => void;
}

const arrayBread = (view1: string, view2: string) => [
    { id: "view-1", name: view1 },
    { id: "view-2", name: view2 },
];

const useStyles = makeStyles((theme) => ({
    btnButton: {
        flexBasis: 0,
        flexGrow: 0,
        minHeight: "30px",
        minWidth: "max-content",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
    },
    buttonTitle: {
        marginRight: "0.25rem",
        width: "auto",
    },
    containerDetail: {
        background: "#fff",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    headerText: {
        flexBasis: "200px",
        flexGrow: 1,
    },
    headerType: {
        flexBasis: "130px",
        flexGrow: 0,
        marginRight: "10px",
    },
    mb1: {
        marginBottom: "0.25rem",
    },
    mediabutton: {
        flexBasis: 0,
        flexGrow: 1,
        margin: theme.spacing(1),
        minHeight: "30px",
        opacity: 0.8,
        padding: 0,
        "&:hover": {
            opacity: 1,
        },
    },
    categoryOption: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#EEEEEE',
        flex: 1,
        "&:hover": {
            backgroundColor: '#D8D8D8',
        },
    },
    checkbox: {
        backgroundColor: 'white',
        cursor: 'pointer',
        borderRadius: 30,
        height: 20,
        width: 20,
        appearance: 'none',
        border: '1px solid #A0A0A0',
        verticalAlign: 'middle',
        "&:checked": {
            backgroundColor: '#7721AD'
        }
    },
    checkboxHeadOption: {
        backgroundColor: 'white',
        cursor: 'pointer',
        borderRadius: '50%',
        height: '1.1rem',
        width: '1.1rem',
        appearance: 'none',
        border: '1px solid #A0A0A0',
        verticalAlign: 'middle',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'translate(-50%, -50%)',
        "&:checked": {
            backgroundColor: '#0E60A0'
        }
    },
    headerOption: {
        display: 'flex',
        padding: '20px 30px 20px 20px',
        border: '1px solid #E4E4E4',
        borderRadius: 10,
        cursor: 'pointer',
    },
    headerOptionSelected: {
        display: 'flex',
        padding: '20px 30px 20px 20px',
        border: '1px solid #0E60A0',
        borderRadius: 10,
        cursor: 'pointer',
        backgroundColor: '#F3F7FF'
    },
    warningContainer: {
        backgroundColor: '#FFD9D9',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 5
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20
    },
    uploadedImage: {
        width: '50%',
        minWidth: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #003170',
        borderRadius: 10,
        padding: '10px',
        gap: 8,
        backgroundColor: '#EAF4FF',
    },
    imageName: {
        color: '#004DB1',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '120px',
    },
    closeIcon: {
        color: 'red',
        height: 20,
        width: 'auto',
        border: '1px solid red',
        borderRadius: 10
    },
    iconHelpText: {
        width: 'auto',
        height: 17,
        cursor: 'pointer',
    },
    cardMedia: {
        width: '100%',
        objectFit: 'contain',
        height: '100%',
    },
    cardMediaContainer: {
        width: 200,
        height: 200,
        backgroundColor: '#EAF4FF',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselContainer: {
        display: 'flex',
        overflowX: 'auto',
    },
    carouselCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center',
        padding: '0px 8px 0px 8px',
        width: 500,
        minWidth: 500,
        marginBottom: 10,
    },
    addCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #B6B6B6',
        cursor: 'pointer',
        width: 150,
        minWidth: 150,
        marginBottom: 10
    },
    errorBorder: {
        "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: 'red',
        },
    },
}));

const DetailMessageTemplates: React.FC<DetailProps> = ({
    data: { row, edit },
    fetchData,
    multiData,
    setViewSelected,
    handleSynchronize,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const addRequest = useSelector((state) => state.channel.requestAddTemplate);
    const classes = useStyles();
    const dataCategory = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataLanguage = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const executeRes = useSelector((state) => state.main.execute);
    const uploadResult = useSelector((state) => state.main.uploadFile);
    const dataChannel =
        multiData[2] && multiData[2].success
            ? multiData[2].data
            //? multiData[2].data.filter((x) => x.type !== "WHAG" && x.type !== "WHAM")
            : [];
    const [bodyAlert, setBodyAlert] = useState("");
    const [bodyAttachment, setBodyAttachment] = useState(row?.body || "");
    const [disableInput, setDisableInput] = useState(false);
    const [disableNamespace, setDisableNamespace] = useState(false);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentTemplate, setFileAttachmentTemplate] = useState<File | null>(null);
    const [htmlEdit, setHtmlEdit] = useState(false);
    const [htmlLoad, setHtmlLoad] = useState<any>(undefined);
    const [isNew] = useState(row?.id ? false : true);
    const [isProvider, setIsProvider] = useState((row?.communicationchannelid && row?.communicationchannelid !== "0") ? true : false);
    const [waitAdd, setWaitAdd] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [waitUploadFile2, setWaitUploadFile2] = useState(false);
    const [waitUploadFile3, setWaitUploadFile3] = useState(false);
    const [bodyObject, setBodyObject] = useState<Descendant[]>(
        row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }]
    );
    const [category, setCategory] = useState(row ? row.category : '')
    const [isHeaderVariable, setIsHeaderVariable] = useState(row?.headervariables?.[0] ? true : false)
    const [headerType, setHeaderType] = useState(
        (row?.headertype === 'VIDEO' || row?.headertype === 'IMAGE' || row?.headertype === 'DOCUMENT') ? 'multimedia' :
            row?.headertype === 'TEXT' ? 'text' : 'none')
    const [filename, setFilename] = useState(row ? row?.header?.split('/')?.pop()?.replace(/%20/g, ' ') : '')
    const [uploading, setUploading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiButtonRef = useRef(null);
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
    const [cardAux, setCardAux] = useState<number | null>(null)
    const [buttonsType, setButtonsType] = useState('none')
    const [cursorPositionAux, setCursorPositionAux] = useState(0);
    const noop = () => {""};
    const [categoryChange, setCategoryChange] = useState('ACTIVADO');
    const [showError, setShowError] = useState(false);
    const [buttonsGeneral, setButtonsGeneral] = useState<Dictionary[]>(
        row?.firstbuttons === "quickreply" ? [
            { id: 1, name: "quickreply",items: [] },
            { id: 2, name: "generic", items: [] }
        ] : [
            { id: 2, name: "generic", items: [] },
            { id: 1, name: "quickreply",items: [] }
        ]
    )
    
    useEffect(() => {
        if (showEmojiPicker && emojiButtonRef.current) {
            const buttonRect = emojiButtonRef.current.getBoundingClientRect();
            const pickerHeight = 370; // Aproximadamente la altura del Picker
            const pickerWidth = 300; // Aproximadamente el ancho del Picker

            const availableHeight = window.innerHeight - buttonRect.bottom;
            const isPickerFit = availableHeight >= pickerHeight;

            setPickerPosition({
                top: isPickerFit ? buttonRect.bottom + window.scrollY : window.innerHeight - pickerHeight + window.scrollY,
                left: buttonRect.left + window.scrollX,
            });
        }
    }, [showEmojiPicker]);

    const handleEmojiPickerClick = () => {
        const input = document.getElementById('bodyInput');
        setCursorPositionAux(input.selectionStart ? input.selectionStart : getValues('body').length);
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleCategoryChange = (value) => {
        if (value) {
            setCategoryChange(value.value);
            setShowError(false);
        } else {
            setCategoryChange('');
            setShowError(true);
        }
    };

    const dataNewCategory = [
        { value: "AUTHENTICATION", description: t(langKeys.TEMPLATE_AUTHENTICATION) },
        { value: "MARKETING", description: t(langKeys.TEMPLATE_MARKETING) },
        { value: "UTILITY", description: t(langKeys.TEMPLATE_UTILITY) },
    ];

    const dataExternalStatus = [
        { value: "APPROVED", description: t(langKeys.TEMPLATE_APPROVED) },
        { value: "DELETED", description: t(langKeys.TEMPLATE_DELETED) },
        { value: "DISABLED", description: t(langKeys.TEMPLATE_DISABLED) },
        { value: "IN_APPEAL", description: t(langKeys.TEMPLATE_IN_APPEAL) },
        { value: "LOCKED", description: t(langKeys.TEMPLATE_LOCKED) },
        { value: "NONE", description: (t(langKeys.NONE) || "").toUpperCase() },
        { value: "PAUSED", description: t(langKeys.TEMPLATE_PAUSED) },
        { value: "PENDING", description: t(langKeys.TEMPLATE_PENDING) },
        { value: "PENDING_DELETION", description: t(langKeys.TEMPLATE_PENDING_DELETION) },
        { value: "REJECTED", description: t(langKeys.TEMPLATE_REJECTED) },
        { value: "SUBMITTED", description: t(langKeys.TEMPLATE_SUBMITTED) },
    ];

    const dataExternalLanguage = [
        { description: t(langKeys.TEMPLATE_AF), value: "AF" },
        { description: t(langKeys.TEMPLATE_AR), value: "AR" },
        { description: t(langKeys.TEMPLATE_AZ), value: "AZ" },
        { description: t(langKeys.TEMPLATE_BG), value: "BG" },
        { description: t(langKeys.TEMPLATE_BN), value: "BN" },
        { description: t(langKeys.TEMPLATE_CA), value: "CA" },
        { description: t(langKeys.TEMPLATE_CS), value: "CS" },
        { description: t(langKeys.TEMPLATE_DA), value: "DA" },
        { description: t(langKeys.TEMPLATE_DE), value: "DE" },
        { description: t(langKeys.TEMPLATE_EL), value: "EL" },
        { description: t(langKeys.TEMPLATE_EN), value: "EN" },
        { description: t(langKeys.TEMPLATE_EN_GB), value: "EN_GB" },
        { description: t(langKeys.TEMPLATE_EN_US), value: "EN_US" },
        { description: t(langKeys.TEMPLATE_ES), value: "ES" },
        { description: t(langKeys.TEMPLATE_ES_AR), value: "ES_AR" },
        { description: t(langKeys.TEMPLATE_ES_ES), value: "ES_ES" },
        { description: t(langKeys.TEMPLATE_ES_MX), value: "ES_MX" },
        { description: t(langKeys.TEMPLATE_ET), value: "ET" },
        { description: t(langKeys.TEMPLATE_FA), value: "FA" },
        { description: t(langKeys.TEMPLATE_FI), value: "FI" },
        { description: t(langKeys.TEMPLATE_FIL), value: "FIL" },
        { description: t(langKeys.TEMPLATE_FR), value: "FR" },
        { description: t(langKeys.TEMPLATE_GA), value: "GA" },
        { description: t(langKeys.TEMPLATE_GU), value: "GU" },
        { description: t(langKeys.TEMPLATE_HA), value: "HA" },
        { description: t(langKeys.TEMPLATE_HE), value: "HE" },
        { description: t(langKeys.TEMPLATE_HI), value: "HI" },
        { description: t(langKeys.TEMPLATE_HR), value: "HR" },
        { description: t(langKeys.TEMPLATE_HU), value: "HU" },
        { description: t(langKeys.TEMPLATE_ID), value: "ID" },
        { description: t(langKeys.TEMPLATE_IT), value: "IT" },
        { description: t(langKeys.TEMPLATE_JA), value: "JA" },
        { description: t(langKeys.TEMPLATE_KA), value: "KA" },
        { description: t(langKeys.TEMPLATE_KK), value: "KK" },
        { description: t(langKeys.TEMPLATE_KN), value: "KN" },
        { description: t(langKeys.TEMPLATE_KO), value: "KO" },
        { description: t(langKeys.TEMPLATE_KY_KG), value: "KY_KG" },
        { description: t(langKeys.TEMPLATE_LO), value: "LO" },
        { description: t(langKeys.TEMPLATE_LT), value: "LT" },
        { description: t(langKeys.TEMPLATE_LV), value: "LV" },
        { description: t(langKeys.TEMPLATE_MK), value: "MK" },
        { description: t(langKeys.TEMPLATE_ML), value: "ML" },
        { description: t(langKeys.TEMPLATE_MR), value: "MR" },
        { description: t(langKeys.TEMPLATE_MS), value: "MS" },
        { description: t(langKeys.TEMPLATE_NB), value: "NB" },
        { description: t(langKeys.TEMPLATE_NL), value: "NL" },
        { description: t(langKeys.TEMPLATE_PA), value: "PA" },
        { description: t(langKeys.TEMPLATE_PL), value: "PL" },
        { description: t(langKeys.TEMPLATE_PT_BR), value: "PT_BR" },
        { description: t(langKeys.TEMPLATE_PT_PT), value: "PT_PT" },
        { description: t(langKeys.TEMPLATE_RO), value: "RO" },
        { description: t(langKeys.TEMPLATE_RU), value: "RU" },
        { description: t(langKeys.TEMPLATE_RW_RW), value: "RW_RW" },
        { description: t(langKeys.TEMPLATE_SK), value: "SK" },
        { description: t(langKeys.TEMPLATE_SL), value: "SL" },
        { description: t(langKeys.TEMPLATE_SQ), value: "SQ" },
        { description: t(langKeys.TEMPLATE_SR), value: "SR" },
        { description: t(langKeys.TEMPLATE_SV), value: "SV" },
        { description: t(langKeys.TEMPLATE_SW), value: "SW" },
        { description: t(langKeys.TEMPLATE_TA), value: "TA" },
        { description: t(langKeys.TEMPLATE_TE), value: "TE" },
        { description: t(langKeys.TEMPLATE_TH), value: "TH" },
        { description: t(langKeys.TEMPLATE_TR), value: "TR" },
        { description: t(langKeys.TEMPLATE_UK), value: "UK" },
        { description: t(langKeys.TEMPLATE_UR), value: "UR" },
        { description: t(langKeys.TEMPLATE_UZ), value: "UZ" },
        { description: t(langKeys.TEMPLATE_VI), value: "VI" },
        { description: t(langKeys.TEMPLATE_ZH_CN), value: "ZH_CN" },
        { description: t(langKeys.TEMPLATE_ZH_HK), value: "ZH_HK" },
        { description: t(langKeys.TEMPLATE_ZH_TW), value: "ZH_TW" },
        { description: t(langKeys.TEMPLATE_ZU), value: "ZU" },
    ];

    const dataMessageType = [
        { value: "HSM", text: t(langKeys.messagetemplate_hsm) },
        { value: "HTML", text: t(langKeys.messagetemplate_html) },
        { value: "MAIL", text: t(langKeys.messagetemplate_mail).toUpperCase() },
        { value: "SMS", text: t(langKeys.messagetemplate_sms) },
    ];

    const dataTemplateType = [
        { value: "MULTIMEDIA", text: t(langKeys.messagetemplate_multimedia) },
        { value: "STANDARD", text: t(langKeys.messagetemplate_standard) },
        { value: "CAROUSEL", text: t(langKeys.messagetemplate_carousel) },
    ];

    const dataHeaderType = [
        { value: "none", text: t(langKeys.none) },
        { value: "text", text: t(langKeys.messagetemplate_text) },
        { value: "multimedia", text: t(langKeys.messagetemplate_multimedia) },
    ];

    const dataURLType = [
        { value: "static", text: t(langKeys.static) },
        { value: "dynamic", text: t(langKeys.dynamic) },
    ];

    const dataPriority = [
        { value: 1, text: t(langKeys.messagetemplate_low) },
        { value: 2, text: t(langKeys.messagetemplate_medium) },
        { value: 3, text: t(langKeys.messagetemplate_high) },
    ];

    const dataValidityPeriod = [
        { value: 1, text: `1 ${t(langKeys.minute)}` },
        { value: 2, text: `2 ${t(langKeys.minutes)}` },
        { value: 3, text: `3 ${t(langKeys.minutes)}` },
        { value: 5, text: `5 ${t(langKeys.minutes)}` },
        { value: 10, text: `10 ${t(langKeys.minutes)}` },
    ]

    const dataCountryCodes = [
        { value: 54, text: 'AR +54' },
        { value: 55, text: 'BR +55' },
        { value: 1, text: 'CA +1' },
        { value: 56, text: 'CH +56' },
        { value: 57, text: 'CO +57' },
        { value: 34, text: 'ES +34' },
        { value: 52, text: 'MX +52' },
        { value: 51, text: 'PE +51' },
        { value: 1, text: 'US +1' },
        { value: 44, text: 'UK +44' }
    ]

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger,
        watch,
        unregister,
    } = useForm({
        defaultValues: {
            attachment: row?.attachment || "",
            authenticationdata: row?.authenticationdata || {},
            body: row?.body || "",
            bodyvariables: row?.bodyvariables || [],
            buttonsgeneric: row ? row.buttonsgeneric || [] : [],
            buttonsquickreply: row ? row.buttonsquickreply || [] : [],
            carouseldata: row ? row.carouseldata || [] : [],
            buttonsenabled: row ? row.buttonsenabled : false,
            category: row?.category || "",
            communicationchannelid: row?.communicationchannelid || "",
            communicationchanneltype: row?.communicationchanneltype || "",
            communicationchanneldesc: row?.communicationchanneldesc || "",
            communicationchannelphone: row?.communicationchannelphone || "",
            description: row?.description || "",
            footer: row?.footer || "",
            footerenabled: row ? row.footerenabled : false,
            header: row?.header || "",
            headerenabled: row ? row.headerenabled : false,
            headertype: row?.headertype || "NONE",
            headervariables: row?.headervariables || [],
            id: row ? row.id : null,
            language: row?.language ? row.language.toUpperCase() : "",
            name: row?.name || "",
            namespace: row?.namespace || "",
            operation: row ? "EDIT" : "INSERT",
            priority: row?.priority || 2,
            provideraccountid: row?.provideraccountid || null,
            providerexternalid: row?.providerexternalid || null,
            providerid: row?.providerid || null,
            providermessagelimit: row?.providermessagelimit || null,
            providerpartnerid: row?.providerpartnerid || null,
            providerquality: row?.providerquality || null,
            providerstatus: row?.providerstatus || null,
            status: row?.status || "ACTIVO",
            templatetype: row?.templatetype === "STANDARD" ? "MULTIMEDIA" : (row?.templatetype || ""),
            type: row?.type || "",
        },
    });

    useEffect(() => {
        const quickReplyItems = getValues('buttonsquickreply');
        const genericItems = getValues('buttonsgeneric');
        setButtonsGeneral(prevButtons => prevButtons.map(button => {
            if (button.name === 'quickreply') {
                return { ...button, items: quickReplyItems };
            } else if (button.name === 'generic') {
                return { ...button, items: genericItems };
            }
            return button;
        }));
    }, [getValues('buttonsgeneric'), getValues('buttonsquickreply')]);

    const [templateTypeDisabled, setTemplateTypeDisabled] = useState(["SMS", "MAIL"].includes(getValues("type")));

    const [type] = watch(["type"]);
    React.useEffect(() => {
        register('authenticationdata');
        register("body");
        register("bodyvariables");
        register("category", {
            validate: (value) => {
                if (type === "HSM") return (value && value.length) || t(langKeys.field_required);
                return true;
            },
        });
        register("communicationchannelid", {
            validate: (value) => {
                if (type === "HSM") return (value && value.length && value !== "0") || t(langKeys.field_required);
                return true;
            },
        });
        register("carouseldata", {
            validate: (value) => {
                if (type === "HSM" && getValues('templatetype') === 'CAROUSEL') {
                    // Validar que value no esté vacío
                    if (!value || value.length === 0) {
                        return t(langKeys.field_required);
                    }
                    // Extraer todos los tipos de botones de todos los cards
                    const buttonTypes = value.flatMap((card: Dictionary) => card.buttons.map((button: Dictionary) => button.type));
                    // Validar que todos los tipos de botones sean iguales
                    const allSameType = buttonTypes.every((type: string, index: number, array) => type === array[0]);
                    if (!allSameType) {
                        return 'No se puede tener tipos de botones diferentes en el mismo card';
                    }
                    return true;
                }
                return true;
            },
        });
        register("communicationchanneltype");
        register("footer");
        register("header", {
            validate: (value) => {
                if (getValues('headertype') && getValues('headertype') !== 'NONE') return (value && value.length) || t(langKeys.field_required);
                return true;
            },
        });
        register("language", {
            validate: (value) => {
                if (type === "HSM") return (value && value.length) || t(langKeys.field_required);
                return true;
            },
        });
        register("name");
        register("namespace");
        register("templatetype", {
            validate: (value) => {
                if (type === "HSM" && getValues("category") !== 'AUTHENTICATION') return (value && value.length) || t(langKeys.field_required);
                return true;
            },
        });
        register("type");

        register("body", {
            validate: (value) => {
                if (type === "HSM" && getValues('category') !== 'AUTHENTICATION') return (value && (value || "").length <= 1024) || t(langKeys.field_required);
                if (type === "SMS") return (value && (value || "").length <= 160) || t(langKeys.field_required);
                return true;
            },
        });

        register("namespace", {
            validate: (value) => {
                if (type === "HSM") return (value && value.length) || t(langKeys.field_required);
                return true;
            },
        });

        switch (type) {
            case "HSM":                
                register("name", {
                    validate: (value) =>
                        (value && (value || "").match("^[a-z0-9_]+$") !== null) || t(langKeys.nametemplate_validation),
                });               
                if (getValues("footerenabled")) {
                    register("footer", {
                        validate: (value) => (value && value.length) || t(langKeys.field_required),
                    });
                }
                setTemplateTypeDisabled(false);
                onChangeTemplateMedia();
                break;

            case "MAIL":
            case "HTML":
                register("header", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
                register("name", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
                onChangeTemplateType({ value: "STANDARD" });
                setTemplateTypeDisabled(true);
                break;

            case "SMS":               
                register("name", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
                onChangeTemplateType({ value: "STANDARD" });
                setTemplateTypeDisabled(true);
                break;
        }

        if (type === "HSM") {          
            register("name", {
                validate: (value) =>
                    (value && (value || "").match("^[a-z0-9_]+$") !== null) || t(langKeys.nametemplate_validation),
            });          
            if (row?.footerenabled) {
                register("footer", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
            }

            onChangeTemplateMedia();
        } else {
            register("name", {
                validate: (value) => (value && value.length) || t(langKeys.field_required),
            });
            if (type === "SMS") {
                // register("body", {
                //     validate: (value) => (value && value.length <= 160) || "" + t(langKeys.validationchar),
                // });
            } else {               
                register("header", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
            }
        }
    }, [register, type]);

    useEffect(() => {
        import("@codemirror/lang-html").then((html) => {
            setHtmlLoad([html.html({ matchClosingTags: true })]);
        });
    }, []);

    useEffect(() => {
        if (!isNew && isProvider) {
            setDisableInput(true);
        }
    }, [isNew, isProvider]);

    useEffect(() => {
        if (waitAdd) {
            if (!addRequest.loading && !addRequest.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                handleSynchronize()
                setWaitAdd(false);
            } else if (addRequest.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(addRequest.code ?? "error_unexpected_error", {
                            module: t(langKeys.messagetemplate).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitAdd(false);
            }
        }
    }, [addRequest, waitAdd]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
                setWaitSave(false);
            } else if (executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(executeRes.code ?? "error_unexpected_error", {
                            module: t(langKeys.messagetemplate).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave]);

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue(
                    "attachment",
                    (getValues("attachment")
                        ? [getValues("attachment"), uploadResult?.url ?? ""]
                        : [uploadResult?.url ?? ""]
                    ).join(",")
                );
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult]);

    const onSubmit = handleSubmit((data) => {
        if (showError) {
            return;
        } else {
            if (data.type === "MAIL") {
                data.body = renderToString(toElement(bodyObject));
                if (data.body === `<div data-reactroot=""><p><span></span></p></div>`) {
                    setBodyAlert(t(langKeys.field_required));
                    return;
                } else {
                    setBodyAlert("");
                }
            }
    
            if (data.type === "HTML") {
                if (data.body) {
                    setBodyAlert("");
                } else {
                    setBodyAlert(t(langKeys.field_required));
                    return;
                }
            }
    
            if (isNew && data.type === 'HSM') {
                const dataAux = {
                    ...data,
                    headerenabled: (data.headertype !== 'NONE' && data.header !== '') ? true : false,
                    footerenabled: data.footer !== '' ? true : false,
                    buttonsenabled: (data.buttonsgeneric.length > 0 || data.buttonsquickreply.length > 0) ? true : false,
                    headervariables: getValues('headervariables')[0] === '' ? [getValues('header')] : getValues('headervariables'),
                    categorychange: categoryChange === 'ACTIVADO' ? true : false,
                    firstbuttons: (getValues('templatetype') === 'MULTIMEDIA' && 
                        (getValues('buttonsgeneric')?.length > 0 || getValues(`buttonsquickreply`)?.length > 0)) 
                        ? buttonsGeneral?.[0]?.name : null
                };
    
                const callback = () => {
                    if (data.type === "MAIL") {
                        data.body = renderToString(toElement(bodyObject));
                        if (data.body === '<div data-reactroot=""><p><span></span></p></div>') {
                            setBodyAlert(t(langKeys.field_required));
                            return;
                        } else {
                            setBodyAlert("");
                        }
                    }
    
                    if (data.type === "HTML") {
                        if (data.body) {
                            setBodyAlert("");
                        } else {
                            setBodyAlert(t(langKeys.field_required));
                            return;
                        }
                    }
    
                    dispatch(addTemplate({
                        ...dataAux,
                        authenticationdata: JSON.stringify(dataAux.authenticationdata),
                        bodyvariables: JSON.stringify(dataAux.bodyvariables),
                        buttonsgeneric: JSON.stringify(dataAux.buttonsgeneric),
                        buttonsquickreply: JSON.stringify(dataAux.buttonsquickreply),
                        carouseldata: JSON.stringify(dataAux.carouseldata),
                        headervariables: JSON.stringify(dataAux.headervariables)
                    }));
                    dispatch(showBackdrop(true));
                    setWaitAdd(true);
                };
    
                dispatch(
                    manageConfirmation({
                        visible: true,
                        question: t(langKeys.confirmation_save),
                        callback,
                    })
                );
            } else {
                const dataAux = {
                    ...data,
                    headerenabled: (data.headertype !== 'NONE' && data.header !== '') ? true : false,
                    footerenabled: data.footer !== '' ? true : false,
                    buttonsenabled: (data.buttonsgeneric.length > 0 || data.buttonsquickreply.length > 0) ? true : false,
                    categorychange: categoryChange === 'ACTIVADO' ? true : false,
                    firstbuttons: (getValues('templatetype') === 'MULTIMEDIA' && 
                        (getValues('buttonsgeneric')?.length > 0 || getValues(`buttonsquickreply`)?.length > 0)) 
                        ? buttonsGeneral?.[0]?.name : null // Añadido aquí también
                };
    
                const callback = () => {
                    if (dataAux.type === "MAIL") {
                        dataAux.body = renderToString(toElement(bodyObject));
                        if (dataAux.body === '<div data-reactroot=""><p><span></span></p></div>') {
                            setBodyAlert(t(langKeys.field_required));
                            return;
                        } else {
                            setBodyAlert("");
                        }
                    }
    
                    if (dataAux.type === "HTML") {
                        if (dataAux.body) {
                            setBodyAlert("");
                        } else {
                            setBodyAlert(t(langKeys.field_required));
                            return;
                        }
                    }
    
                    dispatch(execute(insMessageTemplate({ 
                        ...dataAux, 
                        bodyobject: getValues('type') === "MAIL" ? bodyObject : [], 
                    })));
                    dispatch(showBackdrop(true));
                    setWaitSave(true);
                };
    
                dispatch(
                    manageConfirmation({
                        visible: true,
                        question: t(langKeys.confirmation_save),
                        callback,
                    })
                );
            }
        }
    });
    
    
    

    useEffect(() => {
        if (row) {
            if (row.communicationchanneltype) {
                setDisableNamespace(row.communicationchanneltype !== "WHAT");
            } else {
                setDisableNamespace(false);
            }
        }
    }, [row, register]);
    
    const onChangeMessageType = (data: Dictionary) => {
        if (getValues("type") === "MAIL" && (data?.value || "") !== "MAIL") {
            setValue("body", richTextToString(bodyObject));
        }

        setIsProvider(false);

        setValue("communicationchannelid", "");
        setValue("communicationchanneltype", "");
        setValue("type", data?.value || "");
        setValue("category", '');
        setCategory('')
        setValue("templatetype", '')

        setValue('bodyvariables', [])
        setValue("headertype", "NONE");
        setIsHeaderVariable(false)
        trigger("headertype");
        setValue('buttonsgeneric', [])
        setValue('buttonsquickreply', [])
        setValue('carouseldata', [])

        //trigger("body");
        trigger("bodyvariables");
        trigger("category");
        trigger("communicationchannelid");
        trigger("communicationchanneltype");
        trigger("footer");
        trigger("language");
        //trigger("name");
        trigger("namespace");
        trigger("templatetype");
        trigger("type");
    };

    const onChangeTemplateMedia = async () => {
        if (getValues("footerenabled")) {
            register("footer", {
                validate: (value) => (value && value.length) || t(langKeys.field_required),
            });
        } else {
            register("footer");
        }

        trigger("footer");
        trigger("footerenabled");
        trigger("headerenabled");
    };

    const onChangeTemplateType = async (data: Dictionary) => {
        if (isNew) {
            setValue("templatetype", data?.value || "");
            trigger("templatetype");

            if (data?.value === "CAROUSEL") {
                setValue('carouseldata', [{ header: "", body: '', bodyvariables: [], buttons: [] }])
            } else {
                setValue('carouseldata', [])
            }

            setBodyObject(row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }])
            setValue('header', '')
            setValue('footer', '')
            setValue('buttonsgeneric', [])
            setValue('buttonsquickreply', [])
            setValue("headertype", "NONE");
            setValue('body', '')
            setHeaderType('none')
            trigger("headertype");
            trigger("footer");
            trigger('buttonsgeneric');
            trigger('buttonsquickreply');
            setValue('bodyvariables', [])
            trigger('bodyvariables');
            trigger('carouseldata')
        }
    };

    const onClickHeaderToogle = async ({ value }: { value?: boolean | null } = {}) => {
        if (value) {
            setValue("headerenabled", value);
        } else {
            setValue("headerenabled", !getValues("headerenabled"));
        }

        trigger("headerenabled");
        trigger("header");

        await onChangeTemplateMedia();
    };

    const onClickFooterToogle = async ({ value }: { value?: boolean | null } = {}) => {
        if (value) {
            setValue("footerenabled", value);
        } else {
            setValue("footerenabled", !getValues("footerenabled"));
        }

        trigger("footerenabled");
        trigger("footer");

        await onChangeTemplateMedia();
    };

    const onClickButtonsToogle = async ({ value }: { value?: boolean | null } = {}) => {
        if (value) {
            setValue("buttonsenabled", value);
        } else {
            setValue("buttonsenabled", !getValues("buttonsenabled"));
        }

        trigger("buttonsenabled");
    };

    const onChangeHeaderType = async (data: Dictionary) => {
        if (data) {
            if (data.value === 'text') {
                setHeaderType(data?.value || "");
                setValue("headertype", data?.value.toUpperCase() || "")
                setIsHeaderVariable(false)
                setValue('header', '')
                setValue('headervariables', [''])
                trigger("headervariables");
                trigger("headertype");
            } else {
                setHeaderType('multimedia' || "");
                setIsHeaderVariable(false)
                setValue('headertype', data?.value.toUpperCase())
                setValue('header', '')
                setValue('headervariables', [])
                trigger("headervariables");
                trigger("headertype");
            }
        } else {
            setHeaderType("none");
            setValue("headertype", "NONE")
            setIsHeaderVariable(false)
            setValue('header', '')
            setValue('headervariables', [])
            trigger("headervariables");
            trigger("headertype");
        }
    };

    const onChangeButton = (index: number, param: string, value: string) => {
        setValue(`buttonsgeneric.${index}.btn.${param}`, value);
        trigger('buttonsgeneric')
    };
    const onChangeButtonText = (index: number, value: string) => {
        setValue(`buttonsquickreply.${index}.btn.text`, value);
        setValue(`buttonsquickreply.${index}.btn.payload`, value);
        trigger('buttonsquickreply')
    };
    const onChangeCardsButton = (cindex: number, bindex: number, param: string, value: string) => {
        setValue(`carouseldata.${cindex}.buttons.${bindex}.btn.${param}`, value);
        trigger('carouseldata')
    }

    const onClickAddButton = async () => {
        if (getValues("buttonsgeneric") && getValues("buttonsgeneric").filter((btn: Dictionary) => { return btn.type === 'URL' }).length < 2) {
            setValue("buttonsgeneric", [...getValues("buttonsgeneric"), { type: 'URL', click_counter: false, btn: { text: "", type: "", url: "", variables: [''] } }]);
        }
        trigger("buttonsgeneric");
    };
    const onClickAddButtonText = async () => {
        if (getValues("buttonsquickreply") && getValues("buttonsquickreply").length < 10) {
            setValue("buttonsquickreply", [...getValues("buttonsquickreply"), { btn: { text: "", payload: "" }, type: "QUICK_REPLY" }]);
        }
        trigger("buttonsquickreply");
    };
    const onClickAddButtonPhone = async () => {
        if (getValues("buttonsgeneric") && getValues("buttonsgeneric").filter((btn: Dictionary) => { return btn.type === 'PHONE' }).length < 1) {
            setValue("buttonsgeneric", [...getValues("buttonsgeneric"), { type: 'PHONE', btn: { text: "", code: null, phone_number: "" } }]);
        }
        trigger("buttonsgeneric");
    };
    const onClickAddCard = async () => {
        if (getValues("carouseldata") && getValues('carouseldata').length < 10) {
            setValue('carouseldata', [...getValues('carouseldata'), { header: "", body: '', bodyvariables: [], buttons: [] }])
        }
        trigger("carouseldata");
    }

    useEffect(() => {
        const carouseldata = getValues("carouseldata");
        const allButtonsEmpty = carouseldata.every((item: Dictionary) => item.buttons.length === 0);
        if (allButtonsEmpty) setButtonsType('none');
    }, [getValues('carouseldata').map((item: Dictionary) => item.buttons)]);

    const onClickAddButtonTCard = async (index: number) => {
        const currentCards = getValues('carouseldata');
        if (currentCards && currentCards.length > index) {
            const updatedCards = currentCards.map((card: Dictionary, i: number) => {
                if (i === index) {
                    return {
                        ...card,
                        buttons: [...card.buttons, { type: 'QUICK_REPLY', btn: { text: '', payload: '' } }]
                    };
                }
                return card;
            });
            setValue('carouseldata', updatedCards);
            trigger('carouseldata');
            setButtonsType('text')
        }
    }
    const onClickAddButtonLCard = async (index: number) => {
        const currentCards = getValues('carouseldata');
        if (currentCards && currentCards.length > index) {
            const updatedCards = currentCards.map((card: Dictionary, i: number) => {
                if (i === index) {
                    return {
                        ...card,
                        buttons: [...card.buttons, { type: 'URL', btn: { text: "", type: "", url: "", variables: [''] } }]
                    };
                }
                return card;
            });
            setValue('carouseldata', updatedCards);
            trigger('carouseldata');
            setButtonsType('url')
        }
    }
    const onClickAddButtonPCard = async (index: number) => {
        const currentCards = getValues('carouseldata');
        if (currentCards && currentCards.length > index) {
            const updatedCards = currentCards.map((card: Dictionary, i: number) => {
                if (i === index) {
                    return {
                        ...card,
                        buttons: [...card.buttons, { type: 'PHONE', btn: { text: "", code: "", phone_number: "" } }]
                    };
                }
                return card;
            });
            setValue('carouseldata', updatedCards);
            trigger('carouseldata');
            setButtonsType('phone')
        }
    }
    const onClickRemoveButtonCard = async (cindex: number, bindex: number) => {
        const buttons = getValues(`carouseldata.${cindex}.buttons`);

        if (buttons && buttons.length > 0) {
            unregister(`carouseldata.${cindex}.buttons.${bindex}`);
            setValue(
                `carouseldata.${cindex}.buttons`,
                buttons.filter((x: Dictionary, i: number) => i !== bindex)
            );
        }
    }

    const onClickRemoveCard = async (index: number) => {
        const cards = getValues('carouseldata');

        if (cards && cards.length > 0) {
            unregister(`carouseldata.${index}`);
            setValue(
                'carouseldata',
                cards.filter((x: Dictionary, i: number) => i !== index)
            )
        }
    }
    const onClickRemoveButton = async (index: number) => {
        const btns = getValues("buttonsgeneric");

        if (btns && btns.length > 0) {
            unregister(`buttonsgeneric.${index}`);
            setValue(
                "buttonsgeneric",
                btns.filter((x: Dictionary, i: number) => i !== index)
            );
        }
    };
    const onClickRemoveButtonText = async (index: number) => {
        const btns = getValues("buttonsquickreply");

        if (btns && btns.length > 0) {
            unregister(`buttonsquickreply.${index}`);
            setValue(
                "buttonsquickreply",
                btns.filter((x: Dictionary, i: number) => i !== index)
            );
        }
    };

    const handleFileChange = useCallback((files: FileList | null) => {
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        const file = files?.item(0);

        if (file) {
            const fileType = getValues('headertype');
            const validTypes = {
                IMAGE: ['image/jpeg', 'image/png'],
                VIDEO: ['video/mp4'],
                DOCUMENT: ['application/pdf']
            };

            if (validTypes[fileType]?.includes(file.type)) {
                setFileAttachment(file);
                const fd = new FormData();
                fd.append("file", file, file.name);
                dispatch(uploadFile(fd));
                setUploading(true);
                setWaitUploadFile2(true);
            } else {
                if (fileType === 'IMAGE') alert("Tipo de archivo inválido. Por favor subir un archivo de imagen adecuado.");
                else if (fileType === 'VIDEO') alert("Tipo de archivo inválido. Por favor subir un archivo de video adecuado.");
                else alert("Tipo de archivo inválido. Por favor subir un archivo de documento adecuado.");
            }
        }
        // Reset the file input value to allow selecting the same file again
        if (fileInput) {
            fileInput.value = "";
        }
    }, [])

    useEffect(() => {
        if (waitUploadFile2) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('header', uploadResult?.url || '')
                setValue('headervariables', [uploadResult?.url] || [''])
                trigger('header')
                trigger('headervariables')
                setFilename(fileAttachment?.name || '')
                setUploading(false);
                setWaitUploadFile2(false);
            } else if (uploadResult.error) {
                setWaitUploadFile2(false);
            }
        }
    }, [waitUploadFile2, uploadResult])

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById("attachmentInput");
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);

        if (file) {
            setFileAttachment(file);
            const fd = new FormData();
            fd.append("file", file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, []);

    useEffect(() => {
        if (fileAttachmentTemplate) {
            const reader = new FileReader();
            reader.readAsText(fileAttachmentTemplate);
            reader.onload = (event: any) => {
                const content = event.target.result.toString();
                setValue("body", content);
                setBodyAttachment(content);
            };
        }
    }, [fileAttachmentTemplate]);

    const onChangeAttachmentTemplate = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachmentTemplate(file);
        }
    }, []);

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById("attachmentInput") as HTMLInputElement;

        if (input) {
            input.value = "";
        }

        setFileAttachment(null);
        setValue(
            "attachment",
            getValues("attachment")
                .split(",")
                .filter((a: string) => a !== f)
                .join(",")
        );

        trigger("attachment");
    };

    const changeProvider = async (value: any) => {
        if (!value || !isProvider) {
            //setValue("category", "");
        }

        if (value) {
            setIsProvider(true);

            if (getValues('type') === "HSM") {
                setValue("communicationchannelid", `${value.communicationchannelid}`);
                setValue("communicationchanneltype", value.type);
                setValue("communicationchanneldesc", value.communicationchanneldesc)
                setValue("communicationchannelphone", value.phone)
            }

            if (value.type === "WHAT") {
                setDisableNamespace(false);
            } else {
                setDisableNamespace(true);
                setValue("namespace", "-");
            }
        } else {
            setIsProvider(false);

            setValue("communicationchannelid", "");
            setValue("communicationchanneltype", "");

            setDisableNamespace(false);
        }

        trigger("category");
        trigger("communicationchannelid");
        trigger("communicationchanneltype");
        trigger("communicationchanneldesc");
        trigger("communicationchannelphone")
        trigger("footer");
        trigger("language");
        trigger("name");
        trigger("namespace");
        trigger("templatetype");
        trigger("type");
    };

    const changeCategory = (categoryText: string) => {
        setCategory(categoryText)
        setValue('category', categoryText)

        setBodyObject(row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }])
        setValue('footer', '')
        trigger('footer')
        setValue('bodyvariables', [])
        trigger('bodyvariables')
        setValue("headertype", "NONE");
        setIsHeaderVariable(false)
        trigger("headertype");
        setValue('buttonsgeneric', [])
        setValue('buttonsquickreply', [])
        setValue('carouseldata', [])

        if (categoryText === 'AUTHENTICATION') {
            setValue('authenticationdata', {
                buttontext: "",
                buttontype: null,
                buttonotptype: null,
                buttonpackagename: null,
                buttonautofilltext: null,
                buttonsignaturehash: null,
                codeexpirationminutes: 1,
                configurevalidityperiod: false,
                safetyrecommendation: false,
                showexpirationdate: false,
                validityperiod: ""
            })
            setValue('templatetype', '')
            trigger('templatetype')
            trigger('authenticationdata')
        } else {
            setValue('authenticationdata', {})
            trigger('authenticationdata')
        }
    }

    const handleImageRemove = (index: number) => {
        setValue(`carouseldata.${index}.header`, "");
        trigger('carouseldata')
    };

    const handleFileChangeAux = (files: FileList | null, index: number) => {
        const file = files?.item(0);
        if (file) {
            const maxSizeMB = 5;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                alert(`El archivo excede el tamaño máximo de ${maxSizeMB} MB.`);
                return;
            }
            const fd = new FormData();
            fd.append("file", file, file.name);
            setCardAux(index);
            dispatch(showBackdrop(true));
            dispatch(uploadFile(fd));
            setWaitUploadFile3(true);
        }
    };

    useEffect(() => {
        if (waitUploadFile3) {
            if (!uploadResult.loading && !uploadResult.error) {
                const newCards = [...getValues("carouseldata")];
                newCards[cardAux].header = uploadResult?.url;
                setValue(`carouseldata`, newCards)
                trigger('carouseldata')
                dispatch(showBackdrop(false))
                setWaitUploadFile3(false);
            } else if (uploadResult.error) {
                setWaitUploadFile3(false);
            }
        }
    }, [waitUploadFile3, uploadResult])
    
    const handleDragDropGeneral = (results: DropResult) => {
        const { source, destination, type } = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (type === 'group') {
            const reorderedItems = [...buttonsGeneral];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedStore] = reorderedItems.splice(sourceIndex, 1);
            reorderedItems.splice(destinationIndex, 0, removedStore);

            setButtonsGeneral(reorderedItems)
        }
    }

    const handleDragDrop = (results: DropResult) => {
        const { source, destination, type } = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (type === 'group') {
            const reorderedItems = [...getValues('buttonsquickreply')];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedStore] = reorderedItems.splice(sourceIndex, 1);
            reorderedItems.splice(destinationIndex, 0, removedStore);

            setValue('buttonsquickreply', reorderedItems)
            trigger('buttonsquickreply')
        }
    }

    const handleDragDropAux = (results: DropResult) => {
        const { source, destination, type } = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (type === 'group') {
            const reorderedItems = [...getValues('buttonsgeneric')];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedStore] = reorderedItems.splice(sourceIndex, 1);
            reorderedItems.splice(destinationIndex, 0, removedStore);

            setValue('buttonsgeneric', reorderedItems)
            trigger('buttonsgeneric')
        }
    }

    const handleDragDropCarrusel = (results: DropResult, index: number) => {
        const { source, destination, type } = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (type === 'group') {
            const reorderedItems = [...getValues(`carouseldata.${index}.buttons`)];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedStore] = reorderedItems.splice(sourceIndex, 1);
            reorderedItems.splice(destinationIndex, 0, removedStore);

            setValue(`carouseldata.${index}.buttons`, reorderedItems)
            trigger('carouseldata')
        }
    }

    const addEmoji = (emoji: any) => {
        const currentText = getValues('body');
        const start = currentText.substring(0, cursorPositionAux);
        const end = currentText.substring(cursorPositionAux);

        if (currentText.length <= 1022) {
            setValue('body', start + emoji.native + end);
            trigger('body');
        }
        setShowEmojiPicker(false);
    };

    const addVariableCard = (index: number) => {
        const newVariableNumber = getValues(`carouseldata.${index}.bodyvariables`).length + 1;
        if ((getValues(`carouseldata.${index}.body`).length + newVariableNumber.toString().length) <= 156) {
            const body = getValues(`carouseldata.${index}.body`);
            const newVariableTag = `{{${newVariableNumber}}}`;

            setValue(`carouseldata.${index}.body`, body + newVariableTag);
            setValue(`carouseldata.${index}.bodyvariables`, [...getValues(`carouseldata.${index}.bodyvariables`), { variable: newVariableNumber, text: '' }])
            trigger('carouseldata')
        }
    }

    const deleteVariableCard = (index: number) => {
        const cardVariables = getValues(`carouseldata.${index}.bodyvariables`)
        const lastVariable = cardVariables[cardVariables.length - 1];
        const variablePattern = new RegExp(`\\{\\{${lastVariable.variable}\\}\\}`, 'g');
        const updatedBody = getValues(`carouseldata.${index}.body`).replace(variablePattern, '');

        setValue(`carouseldata.${index}.bodyvariables`, cardVariables.slice(0, -1));
        setValue(`carouseldata.${index}.body`, updatedBody);
        trigger('carouseldata');
    }

    const addVariable = () => {
        const newVariableNumber = getValues('bodyvariables').length + 1;
        if ((getValues('body').length + newVariableNumber.toString().length) <= 1020) {
            const body = getValues('body');
            const newVariableTag = `{{${newVariableNumber}}}`;

            setValue('body', body + newVariableTag);
            trigger('body');
            setValue('bodyvariables', [...getValues('bodyvariables'), { variable: newVariableNumber, text: "" }]);
            trigger('bodyvariables');
        }
    };

    const deleteVariable = () => {
        const lastVariable = getValues('bodyvariables')[getValues('bodyvariables').length - 1];
        const variablePattern = new RegExp(`\\{\\{${lastVariable.variable}\\}\\}`, 'g');
        const updatedBody = getValues('body').replace(variablePattern, '');

        setValue('bodyvariables', getValues('bodyvariables').slice(0, -1));
        setValue('body', updatedBody);
        trigger('bodyvariables')
        trigger('body');
    }
    
    const changeHeaderType = (type: string) => {
        if(getValues('headertype') === "TEXT") {
            setValue('header', '')
            trigger('header')
            setValue('headervariables', [])
            trigger('headervariables')
        }
        setValue('headertype', type)
        trigger('headertype')
    }

    const changeSafetyRecommendation = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setValue('authenticationdata.safetyrecommendation', true);
            trigger('authenticationdata')
        } else {
            setValue('authenticationdata.safetyrecommendation', false);
            trigger('authenticationdata')
        }
    }

    const showExpirationDate = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setValue('authenticationdata.showexpirationdate', true);
            trigger('authenticationdata')
        } else {
            setValue('authenticationdata.showexpirationdate', false);
            trigger('authenticationdata')
        }
    }

    const configureValidityPeriod = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setValue('authenticationdata.configurevalidityperiod', true);
            trigger('authenticationdata')
        } else {
            setValue('authenticationdata.configurevalidityperiod', false);
            trigger('authenticationdata')
        }
    }

    const handleInputHeader = (e) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        const insertPosition = cursorPosition - 2;
        const isDeleting = value.length < getValues('header').length;

        if (!isDeleting && value.length > 60) {
            e.preventDefault();
            return;
        }

        if (value.length === 0) {
            setValue('header', value);
            setValue('headervariables', ['']);
            trigger('header');
            trigger('headervariables');
            setIsHeaderVariable(false)
            return;
        }

        if (isDeleting) {
            const variableRegex = /\{\{1\}\}/g;
            const hasVariable = variableRegex.test(value);

            if (!hasVariable) {
                setValue('headervariables', ['']);
                setIsHeaderVariable(false);
                trigger('headervariables');
            }

            setValue('header', value);
            trigger('header');
            return;
        } else {
            if (insertPosition >= 0 && value.slice(insertPosition, cursorPosition) === '{{') {
                if (!isHeaderVariable) {
                    const header = getValues('header')
                    setIsHeaderVariable(true)
                    setValue('headervariables', [''])
                    setValue('header', header + '{1}}')
                    trigger('headervariables')
                    trigger('header')
                    return;
                }
            }
            else {
                const variableRegex2 = /\{\{1\}\}/g;
                const hasVariable = variableRegex2.test(value);
                if (hasVariable) {
                    setValue('headervariables', ['']);
                    setIsHeaderVariable(true);
                    trigger('headervariables');
                }
                setValue('header', value);
                trigger('header');
                return;
            }
        }

        setValue('header', value)
        trigger('header')
    }

    const addHeaderVariable = () => {
        if (isHeaderVariable) {
            setIsHeaderVariable(false)
            setValue('headervariables', [''])
            trigger('headervariables')

            const variablePattern = new RegExp('\\{\\{1\\}\\}', 'g');
            const updatedHeader = getValues('header').replace(variablePattern, '');
            setValue('header', updatedHeader)
            trigger('header')
        } else {
            const header = getValues('header')
            setIsHeaderVariable(true)
            setValue('headervariables', [''])
            setValue('header', header + '{{1}}')
            trigger('headervariables')
            trigger('header')
        }
    }

    const handleInput = (e) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚüÜñÑ]/g, "");
        if (val.length > 60) {
            val = val.substring(0, 60);
        }
        setValue('footer', val);
        e.target.value = val;
        trigger('footer');
    };

    const handleQuickReply = (e, index: number) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚüÜñÑ]/g, "");
        if (val.length > 25) {
            val = val.substring(0, 25);
        }
        setValue(`buttonsquickreply.${index}.btn.text`, val);
        setValue(`buttonsquickreply.${index}.btn.payload`, val);
        e.target.value = val;
        trigger('buttonsquickreply')
    }
    
    const handleActionButtonText = (e, index: number) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚüÜñÑ]/g, "");
        if (val.length > 25) {
            val = val.substring(0, 25);
        }
        setValue(`buttonsgeneric.${index}.btn.text`, val);
        e.target.value = val;
        trigger('buttonsgeneric')
    }

    const handleActionButtonUrl = (e, index: number) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚüÜñÑ /.:-]/g, "");
        if (val.length > 2000) {
            val = val.substring(0, 2000);
        }
        setValue(`buttonsgeneric.${index}.btn.url`, val);
        e.target.value = val;
        trigger('buttonsgeneric')
    }

    const handleActionButtonPhone = (e, index: number) => {
        let val = e.target.value.replace(/[^0-9 ]/g, "");
        if (val.length > 20) {
            val = val.substring(0, 20);
        }
        setValue(`buttonsgeneric.${index}.btn.phone_number`, val);
        e.target.value = val;
        trigger('buttonsgeneric')
    }

    const handleQuickReplyCard = (e, index: number, bindex: number) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
        if (val.length > 25) {
            val = val.substring(0, 25);
        }
        setValue(`carouseldata.${index}.buttons.${bindex}.btn.text`, val);
        setValue(`carouseldata.${index}.buttons.${bindex}.btn.payload`, val);
        e.target.value = val;
        trigger('carouseldata')
    }

    const handleActionButtonTextCard = (e, index: number, bindex: number) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
        if (val.length > 25) {
            val = val.substring(0, 25);
        }
        setValue(`carouseldata.${index}.buttons.${bindex}.btn.text`, val);
        e.target.value = val;
        trigger('carouseldata')
    }

    const handleActionButtonUrlCard = (e, index: number, bindex: number) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9 /.:-]/g, "");
        if (val.length > 2000) {
            val = val.substring(0, 2000);
        }
        setValue(`carouseldata.${index}.buttons.${bindex}.btn.url`, val);
        e.target.value = val;
        trigger('carouseldata')
    }

    const handleActionButtonPhoneCard = (e, index: number, bindex: number) => {
        let val = e.target.value.replace(/[^0-9 ]/g, "");
        if (val.length > 20) {
            val = val.substring(0, 20);
        }
        setValue(`carouseldata.${index}.buttons.${bindex}.btn.phone_number`, val);
        e.target.value = val;
        trigger('carouseldata')
    }

    const addVariableAux = (cursorPosition: number) => {
        let newVariableNumber = 0;
        if (getValues('bodyvariables').length === 0) {
            newVariableNumber = 1;
        } else {
            newVariableNumber = getValues('bodyvariables')[getValues('bodyvariables').length - 1].variable + 1;
        }

        const body = getValues('body');
        const newVariableTag = `{{${newVariableNumber}}}`;
        const newBody = body.slice(0, cursorPosition) + newVariableTag + body.slice(cursorPosition);

        setValue('body', newBody);
        trigger('body');
        setValue('bodyvariables', [...getValues('bodyvariables'), { variable: newVariableNumber, text: "" }]);
        trigger('bodyvariables');
    };

    const handleInputBody = (e) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        const isDeleting = value.length < getValues('body').length;

        if (!isDeleting && value.length > 1024) {
            e.preventDefault();
            return;
        }

        if (value.length === 0) {
            setValue('body', value);
            setValue('bodyvariables', []);
            trigger('body');
            trigger('bodyvariables');
            return;
        }

        if (isDeleting) {
            const variableRegex2 = /\{\{(\d+)\}\}/g;
            let match;
            const variablesInBody = [];

            while ((match = variableRegex2.exec(value)) !== null) {
                const variableNumber = parseInt(match[1], 10);
                variablesInBody.push(variableNumber);
            }
            let updatedBodyVariables = getValues('bodyvariables').filter((variable: Dictionary) => variablesInBody.includes(variable.variable));
            updatedBodyVariables = updatedBodyVariables.map((variable: Dictionary, index: number) => ({
                ...variable,
                variable: index + 1,
            }));
            setValue('bodyvariables', updatedBodyVariables);
            trigger('bodyvariables');
            const cursorPositionAux = cursorPosition;
            const variableRegex = /\{\{(\d+)\}\}/g;
            let currentIndexInText = 0;
            const updatedText = value.replace(variableRegex, () => {
                const variable = updatedBodyVariables[currentIndexInText];
                currentIndexInText++;
                return `{{${variable.variable}}}`;
            });
            setValue('body', updatedText);
            trigger('body');
            setTimeout(() => {
                e.target.setSelectionRange(cursorPositionAux, cursorPositionAux);
            }, 0);
            return;
        } else {
            const insertPosition = cursorPosition - 2;
            if (insertPosition >= 0 && value.slice(insertPosition, cursorPosition) === '{{') {
                const newValue = value.slice(0, insertPosition) + value.slice(cursorPosition);
                setValue('body', newValue);
                trigger('body');
                if (getValues('bodyvariables').length < 20) {
                    if (getValues('bodyvariables').length === 0) {
                        if ((getValues('body').length + 1) <= 1020) {
                            addVariableAux(insertPosition);
                        }
                    }
                    else if ((getValues('body').length + (getValues('bodyvariables')[getValues('bodyvariables').length - 1].variable + 1).toString().length) <= 1020) {
                        addVariableAux(insertPosition);
                    }
                }
                setTimeout(() => {
                    e.target.setSelectionRange(insertPosition + 4 + getValues('bodyvariables')[getValues('bodyvariables').length - 1].variable.toString().length, insertPosition + 4 + getValues('bodyvariables')[getValues('bodyvariables').length - 1].variable.toString().length);
                }, 0);
                return;
            } else {
                const variableRegex2 = /\{\{(\d+)\}\}/g;
                let match;
                const variablesInBody = [];

                while ((match = variableRegex2.exec(value)) !== null) {
                    const variableNumber = parseInt(match[1], 10);
                    variablesInBody.push(variableNumber);
                }
                
                let updatedBodyVariables = getValues('bodyvariables');
                if (variablesInBody.length !== updatedBodyVariables.length) {
                    // Step 2: Identify the repeated variable number
                    const variableCounts = {};
                    let auxIndex = null;
                    variablesInBody.forEach((num, index) => {
                        variableCounts[num] = (variableCounts[num] || 0) + 1;
                        if (variableCounts[num] > 1) {
                            auxIndex = num;
                        }
                    });

                    if (auxIndex !== null) {
                        // Step 3: Insert new variable object at the correct position
                        updatedBodyVariables.splice(auxIndex - 1, 0, { variable: auxIndex, text: "" });

                        // Step 4: Update bodyvariables to have consecutive numbers
                        updatedBodyVariables = updatedBodyVariables.map((variable, index) => ({
                            ...variable,
                            variable: index + 1,
                        }));

                        // Step 5: Update variablesInBody to be ordered from 1 to n
                        const updatedVariablesInBody = variablesInBody.map((_, index) => index + 1);

                        // Step 6: Update body to reflect new variable numbers
                        let currentIndexInText = 0;
                        const updatedText = value.replace(variableRegex2, () => {
                            const variableNumber = updatedVariablesInBody[currentIndexInText];
                            currentIndexInText++;
                            return `{{${variableNumber}}}`;
                        });

                        setValue('bodyvariables', updatedBodyVariables);
                        trigger('bodyvariables');
                        setValue('body', updatedText);
                        trigger('body');
                        setTimeout(() => {
                            e.target.setSelectionRange(cursorPosition, cursorPosition);
                        }, 0);
                        return;
                    } else if (variablesInBody.length > updatedBodyVariables.length) {
                        updatedBodyVariables = [...updatedBodyVariables, { variable: variablesInBody[variablesInBody.length - 1], text: "" }]
                        setValue('bodyvariables', updatedBodyVariables);
                        trigger('bodyvariables');
                    }
                }
            }
        }

        setValue('body', value);
        trigger('body');
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const bodyVariables = getValues('bodyvariables');
        const existingVariables = bodyVariables.map(v => v.variable);
        const newVariables = [];
        let cleanedPaste = paste;

        const regex = /{{(\d+)}}/g;
        let match;
        while ((match = regex.exec(paste)) !== null) {
            const varNumber = parseInt(match[1], 10);
            if (!existingVariables.includes(varNumber) && !newVariables.includes(varNumber)) {
                newVariables.push(varNumber);
            } else {
                // Remove existing variable from the pasted text
                cleanedPaste = cleanedPaste.replace(match[0], '');
            }
        }

        // Check if the pasted content will exceed the max length
        const currentBody = getValues('body');
        const newBodyLength = currentBody.length + cleanedPaste.length;

        if (newBodyLength > 1024) {
            return;
        }

        newVariables.forEach(varNumber => {
            bodyVariables.push({ variable: varNumber, text: "" });
        });

        setValue('bodyvariables', bodyVariables);
        setValue('body', getValues('body') + cleanedPaste);
        trigger('body');
        trigger('bodyvariables');
    };

    const addVariableCardAux = (cursorPosition: number, index: number) => {
        let newVariableNumber = 0;
        if (getValues(`carouseldata.${index}.bodyvariables`).length === 0) {
            newVariableNumber = 1;
        } else {
            newVariableNumber = getValues(`carouseldata.${index}.bodyvariables`)[getValues(`carouseldata.${index}.bodyvariables`).length - 1].variable + 1;
        }

        const body = getValues(`carouseldata.${index}.body`);
        const newVariableTag = `{{${newVariableNumber}}}`;
        const newBody = body.slice(0, cursorPosition) + newVariableTag + body.slice(cursorPosition);

        setValue(`carouseldata.${index}.body`, newBody);
        setValue(`carouseldata.${index}.bodyvariables`, [...getValues(`carouseldata.${index}.bodyvariables`), { variable: newVariableNumber, text: "" }]);
        trigger('carouseldata');
    };

    const handleInputBodyCard = (e, index: number) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        const isDeleting = value.length < getValues(`carouseldata.${index}.body`).length;

        if (!isDeleting && value.length > 160) {
            e.preventDefault();
            return;
        }

        if (value.length === 0) {
            setValue(`carouseldata.${index}.body`, value);
            setValue(`carouseldata.${index}.bodyvariables`, []);
            trigger('carouseldata');
            return;
        }
        //test
        if (isDeleting) {
            // Recopilar todas las variables actuales del body
            const variableRegex2 = /\{\{(\d+)\}\}/g;
            let match;
            const variablesInBody = [];

            while ((match = variableRegex2.exec(value)) !== null) {
                const variableNumber = parseInt(match[1], 10);
                variablesInBody.push(variableNumber);
            }

            // Filtrar bodyvariables para eliminar las que ya no están presentes en variablesInBody
            let updatedBodyVariables = getValues(`carouseldata.${index}.bodyvariables`).filter((variable: Dictionary) => variablesInBody.includes(variable.variable));
            updatedBodyVariables = updatedBodyVariables.map((variable: Dictionary, index: number) => ({
                ...variable,
                variable: index + 1,
            }));
            setValue(`carouseldata.${index}.bodyvariables`, updatedBodyVariables);
            trigger('carouseldata');

            const cursorPositionAux = cursorPosition;
            const variableRegex = /\{\{(\d+)\}\}/g;
            let currentIndexInText = 0;
            const updatedText = value.replace(variableRegex, () => {
                const variable = updatedBodyVariables[currentIndexInText];
                currentIndexInText++;
                return `{{${variable.variable}}}`;
            });
            setValue(`carouseldata.${index}.body`, updatedText);
            trigger('carouseldata');

            setTimeout(() => {
                e.target.setSelectionRange(cursorPositionAux, cursorPositionAux);
            }, 0);
            return;
        } else {
            const insertPosition = cursorPosition - 2;
            if (insertPosition >= 0 && value.slice(insertPosition, cursorPosition) === '{{') {
                const newValue = value.slice(0, insertPosition) + value.slice(cursorPosition);
                setValue(`carouseldata.${index}.body`, newValue)
                trigger('carouseldata');
                if (getValues(`carouseldata.${index}.bodyvariables`).length < 20 && (getValues(`carouseldata.${index}.body`).length + (getValues(`carouseldata.${index}.bodyvariables`).length + 1).toString().length) <= 156) {
                    addVariableCardAux(insertPosition, index);
                }
                setTimeout(() => {
                    e.target.setSelectionRange(insertPosition + 4 + getValues(`carouseldata.${index}.bodyvariables`).length.toString().length, insertPosition + 4 + getValues(`carouseldata.${index}.bodyvariables`).length.toString().length);
                }, 0);
                return;
            } else {
                const variableRegex2 = /\{\{(\d+)\}\}/g;
                let match;
                const variablesInBody = [];

                while ((match = variableRegex2.exec(value)) !== null) {
                    const variableNumber = parseInt(match[1], 10);
                    variablesInBody.push(variableNumber);
                }
                
                let updatedBodyVariables = getValues(`carouseldata.${index}.bodyvariables`);
                if (variablesInBody.length !== updatedBodyVariables.length) {
                    // Step 2: Identify the repeated variable number
                    const variableCounts = {};
                    let auxIndex = null;
                    variablesInBody.forEach((num, index) => {
                        variableCounts[num] = (variableCounts[num] || 0) + 1;
                        if (variableCounts[num] > 1) {
                            auxIndex = num;
                        }
                    });

                    if (auxIndex !== null) {
                        // Step 3: Insert new variable object at the correct position
                        updatedBodyVariables.splice(auxIndex - 1, 0, { variable: auxIndex, text: "" });

                        // Step 4: Update bodyvariables to have consecutive numbers
                        updatedBodyVariables = updatedBodyVariables.map((variable, index) => ({
                            ...variable,
                            variable: index + 1,
                        }));

                        // Step 5: Update variablesInBody to be ordered from 1 to n
                        const updatedVariablesInBody = variablesInBody.map((_, index) => index + 1);

                        // Step 6: Update body to reflect new variable numbers
                        let currentIndexInText = 0;
                        const updatedText = value.replace(variableRegex2, () => {
                            const variableNumber = updatedVariablesInBody[currentIndexInText];
                            currentIndexInText++;
                            return `{{${variableNumber}}}`;
                        });

                        setValue(`carouseldata.${index}.bodyvariables`, updatedBodyVariables);
                        setValue(`carouseldata.${index}.body`, updatedText);
                        trigger('carouseldata');
                        setTimeout(() => {
                            e.target.setSelectionRange(cursorPosition, cursorPosition);
                        }, 0);
                        return;
                    } else if (variablesInBody.length > updatedBodyVariables.length) {
                        updatedBodyVariables = [...updatedBodyVariables, { variable: variablesInBody[variablesInBody.length - 1], text: "" }]
                        setValue(`carouseldata.${index}.bodyvariables`, updatedBodyVariables);
                    }
                }
            }
        }

        setValue(`carouseldata.${index}.body`, value);
        trigger('carouseldata');
    }

    const handlePasteCard = (e, index: number) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const bodyVariables = getValues(`carouseldata.${index}.bodyvariables`);
        const existingVariables = bodyVariables.map(v => v.variable);
        const newVariables = [];
        let cleanedPaste = paste;

        const regex = /{{(\d+)}}/g;
        let match;
        while ((match = regex.exec(paste)) !== null) {
            const varNumber = parseInt(match[1], 10);
            if (!existingVariables.includes(varNumber) && !newVariables.includes(varNumber)) {
                newVariables.push(varNumber);
            } else {
                // Remove existing variable from the pasted text
                cleanedPaste = cleanedPaste.replace(match[0], '');
            }
        }

        // Check if the pasted content will exceed the max length
        const currentBody = getValues(`carouseldata.${index}.body`);
        const newBodyLength = currentBody.length + cleanedPaste.length;

        if (newBodyLength > 160) {
            return;
        }

        newVariables.forEach(varNumber => {
            bodyVariables.push({ variable: varNumber, text: "" });
        });

        setValue(`carouseldata.${index}.bodyvariables`, bodyVariables);
        setValue(`carouseldata.${index}.body`, getValues(`carouseldata.${index}.body`) + cleanedPaste);
        trigger('carouseldata');
    };

    const handleTextFormatting = (format) => {
        const textarea = document.querySelector('textarea');
        const text = getValues('body');
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;

        if (selectionStart !== selectionEnd) {
            const selectedText = text.substring(selectionStart, selectionEnd);
            const formattedText = `${format}${selectedText}${format}`;
            const newText = text.substring(0, selectionStart) + formattedText + text.substring(selectionEnd);

            if (newText.length <= 1024) {
                setValue('body', newText);
            } else {
                // Optionally, you can add some feedback to the user that the text is too long
                console.warn('Formatted text would exceed the maximum length');
            }
        } else {
            if (text.length + format.length * 2 <= 1024) {
                setValue('body', text + format + format);
            } else {
                // Optionally, you can add some feedback to the user that the text is too long
                console.warn('Formatted text would exceed the maximum length');
            }
        }
        trigger('body');
    };

    const getQuality = (quality: string) => {
        if (quality === 'HIGH' || quality === 'MEDIUM' || quality === 'LOW') {
            return t(`template_${quality}`);
        } else {
            return t(langKeys.TEMPLATE_PENDING);
        }
    }

    const getLimitMessage = (providermessagelimit: string) => {
        let limit;
        if (providermessagelimit) {
            switch (providermessagelimit) {
                case "TIER_0.05K":
                    limit = `50 ${t('clients')}/24 ${t('hours')}`;
                    break;
                case "TIER_0.25K":
                    limit = `250 ${t('clients')}/24 ${t('hours')}`;
                    break;
                case "TIER_1K":
                    limit = `1K ${t('clients')}/24 ${t('hours')}`;
                    break;
                case "TIER_10K":
                    limit = `10K ${t('clients')}/24 ${t('hours')}`;
                    break;
                case "TIER_100K":
                    limit = `100K ${t('clients')}/24 ${t('hours')}`;
                    break;
                case "TIER_UNLIMITED":
                    limit = t('unlimited');
                    break;
                default:
                    limit = t('TEMPLATE2_UNREGISTERED');
                    break;
            }
        }
        return limit;
    };

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread(t(langKeys.messagetemplate), t(langKeys.messagetemplatedetail))}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail title={row ? `${row.name}` : t(langKeys.newmessagetemplate)} />
                    </div>
                    <div
                        style={{
                            alignItems: "center",
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <Button
                            color="primary"
                            onClick={() => setViewSelected("view-1")}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={waitUploadFile}
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            type="submit"
                            variant="contained"
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    {row?.showid && (
                        <div className="row-zyx">
                            <FieldView
                                className="col-12"
                                label={t(langKeys.messagetemplateid)}
                                value={row ? row.id || "" : ""}
                            />
                        </div>
                    )}
                    <div className='row-zyx'>
                        <div className="col-4" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.messagetype)}</span>
                            <span>{t(langKeys.messagetypetext)}</span>
                        </div>
                        {(!isNew && getValues('type') === 'HSM') && (
                            <div className="col-8" style={{ display: 'flex' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.messagetemplateid)}</span>
                                    <span>{t(langKeys.templateidentifier)}</span>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.quality)}</span>
                                    <span>{t(langKeys.templatequalitytext)}</span>
                                </div>
                                <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.messageslimit)}</span>
                                    <span>{t(langKeys.messageslimittext)}</span>
                                </div>
                            </div>
                        )}

                        {(isNew && getValues('type') === 'HSM' && (
                            <div className="col-8" style={{ display: 'flex' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <CustomTitleHelper
                                        title={t(langKeys.categorychange) + ' '}
                                        helperText={'Permite que Meta asigne cualquier categoría que determine apropiada para el template. Esto evita que las plantillas sean rechazadas durante el proceso de validación.'}
                                        titlestyle={{ fontWeight: 'bold', fontSize: 20 }}
                                    />
                                    <span>{t(langKeys.categorychangetext)}</span>
                                </div>
                            </div>
                        ))}


                    </div>
                    <div className="row-zyx" style={{ display: 'flex', alignItems: 'center' }}>
                        <FieldSelect
                            className="col-4"
                            data={dataMessageType}
                            disabled={disableInput}
                            error={errors?.type?.message}
                            onChange={onChangeMessageType}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues("type")}
                            variant="outlined"
                            size="small"
                        />
                        {getValues("type") === '' && (
                            <div className="col-4">
                                <div className={classes.warningContainer} style={{ width: 220 }}>
                                    <WarningIcon style={{ color: '#FF7575' }} />
                                    Selecciona una opción
                                </div>
                            </div>
                        )}
                        {(!isNew && getValues('type') === 'HSM') && (
                            <FieldEdit
                                className="col-2"
                                variant="outlined"
                                valueDefault={getValues('id')}
                                disabled
                                size="small"
                            />
                        )}
                        {(!isNew && getValues('type') === 'HSM') && (
                            <FieldEdit
                                className="col-2"
                                variant="outlined"
                                valueDefault={getQuality(getValues('providerquality')).toUpperCase()}
                                disabled
                                size="small"
                            />
                        )}
                        {(!isNew && getValues('type') === 'HSM') && (
                            <FieldEdit
                                className="col-4"
                                variant="outlined"
                                valueDefault={() => getLimitMessage(getValues('providermessagelimit'))}
                                disabled
                                size="small"
                            />
                        )}
                        {(isNew && getValues('type') === 'HSM' && (
                            <>
                               <FieldSelect
                                    className={`col-3 ${showError ? classes.errorBorder : ''}`}
                                    variant="outlined"
                                    data={[{ value: "ACTIVADO" }, { value: "DESACTIVADO" }]}
                                    size="small"
                                    valueDefault={categoryChange}
                                    onChange={handleCategoryChange}
                                    optionDesc="value"
                                    optionValue="value"
                                    error={showError}
                                />
                                {showError && (
                                    <p style={{ color: 'red', marginLeft: '33.6%', marginTop: '0', fontSize: '12px', paddingTop: '0' }}>
                                        {t(langKeys.field_required)}
                                    </p>
                                )}
                            </>                         
                        ))}
                    </div>
                    {getValues("type") === 'HSM' && (
                        <>
                            <div className='row-zyx' style={{ borderBottom: '1px solid black', paddingBottom: 10 }}>
                                <span style={{ fontWeight: 'bold', fontSize: 20 }}>{`${t(langKeys.configuration)} ${t(langKeys.template)}`}</span>
                            </div>
                            <div className='row-zyx' style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.category)}</span>
                                <span>Elige la categoría que mejor describa tu plantilla de mensaje.</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                                <div className={classes.categoryOption} style={{ cursor: !isNew ? '' : 'pointer' }} onClick={() => { if (isNew) changeCategory('MARKETING') }}>
                                    <input type="checkbox" checked={category === 'MARKETING'} className={classes.checkbox} />
                                    <VolumeUpIcon style={{ marginLeft: 10, marginRight: 10 }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Marketing</span>
                                        <span>Envía promociones o información sobre tus productos, servicios o negocio.</span>
                                    </div>
                                </div>
                                <div className={classes.categoryOption} style={{ cursor: !isNew ? '' : 'pointer' }} onClick={() => { if (isNew) changeCategory('UTILITY') }}>
                                    <input type="checkbox" checked={category === 'UTILITY'} className={classes.checkbox} />
                                    <NotificationsIcon style={{ marginLeft: 10, marginRight: 10 }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Utilidad</span>
                                        <span>Envía mensajes sobre un pedido o cuenta existentes.</span>
                                    </div>
                                </div>
                                <div className={classes.categoryOption} style={{ cursor: !isNew ? '' : 'pointer' }} onClick={() => { if (isNew) changeCategory('AUTHENTICATION') }}>
                                    <input type="checkbox" checked={category === 'AUTHENTICATION'} className={classes.checkbox} />
                                    <VpnKeyIcon style={{ marginLeft: 10, marginRight: 10 }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Autenticación</span>
                                        <span>Envía códigos para verificar una transacción o un inicio de sesión.</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {getValues('type') === 'HSM' && (
                        <span style={{ color: 'red' }}>{errors?.category?.message}</span>
                    )}
                    <div className="row-zyx">
                        {(getValues("type") !== "HSM" && getValues("type") !== '') && (
                            <FieldSelect
                                className="col-6"
                                data={dataCategory}
                                disabled={disableInput}
                                error={errors?.category?.message}
                                label={t(langKeys.category)}
                                onChange={(value) => {
                                    setValue("category", value?.domainvalue)
                                    trigger("category")
                                }}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                valueDefault={getValues("category")}
                            />
                        )}
                    </div>
                    {getValues("type") === "HSM" && (
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <span style={{ fontWeight: 'bold' }}>{t(langKeys.name)}</span>
                                <span>{t(langKeys.assignnametotemplate)}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <span style={{ fontWeight: 'bold' }}>{t(langKeys.language)}</span>
                                <span>{t(langKeys.chooseyourlanguage)}</span>
                            </div>
                        </div>
                    )}
                    <div className="row-zyx" style={{ marginBottom: 0 }}>
                        {getValues('type') !== '' && (
                            <FieldEdit
                                className="col-6"
                                disabled={disableInput}
                                error={errors?.name?.message}
                                label={getValues('type') !== 'HSM' ? t(langKeys.name) : ''}
                                onChange={(value) => {
                                    setValue("name", value)
                                    trigger('name')
                                }}
                                valueDefault={getValues("name")}
                                maxLength={512}
                                variant={getValues('type') !== 'HSM' ? 'standard' : "outlined"}
                            />
                        )}
                        {isProvider && (
                            <>
                                {getValues("type") !== '' && (
                                    <FieldSelect
                                        className="col-6"
                                        data={dataExternalLanguage}
                                        disabled={disableInput}
                                        error={errors?.language?.message}
                                        label={getValues('type') !== 'HSM' ? t(langKeys.language) : ''}
                                        variant={getValues('type') !== 'HSM' ? 'standard' : "outlined"}
                                        onChange={(value) => {
                                            if (value) {
                                                setValue("language", value.value)
                                                trigger("language")
                                            } else {
                                                setValue("language", '')
                                                trigger("language")
                                            }
                                        }}
                                        optionDesc="description"
                                        optionValue="value"
                                        valueDefault={getValues("language")}
                                        size="normal"
                                    />
                                )}
                            </>
                        )}
                        {!isProvider && (
                            <>
                                {getValues("type") !== '' && (
                                    <FieldSelect
                                        className="col-6"
                                        data={dataExternalLanguage}
                                        disabled={disableInput}
                                        error={errors?.language?.message}
                                        onChange={(value) => {
                                            if (value) {
                                                setValue("language", value.value)
                                                trigger("language")
                                            } else {
                                                setValue("language", '')
                                                trigger("language")
                                            }
                                        }}
                                        optionDesc="description"
                                        optionValue="value"
                                        uset={true}
                                        valueDefault={getValues("language")}
                                        label={getValues('type') !== 'HSM' ? t(langKeys.language) : ''}
                                        variant={getValues('type') !== 'HSM' ? 'standard' : "outlined"}
                                        size="normal"
                                    />
                                )}
                            </>
                        )}
                    </div>
                    {getValues("type") === "HSM" && (
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                            {getValues("category") !== 'AUTHENTICATION' && (
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <span style={{ fontWeight: 'bold' }}>{t(langKeys.templatetype)}</span>
                                    <span>Seleccione el tipo de plantilla que utilizarás</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <span style={{ fontWeight: 'bold' }}>{t(langKeys.channel)}</span>
                                <CustomTextWithHelper
                                    title={'Seleccione el canal en el que registrarás tu plantilla' + ' '}
                                    helperText={t(langKeys.channel_message_templates_help)}
                                /> 
                            </div>
                        </div>
                    )}
                    <div className="row-zyx">
                        {getValues("type") !== '' && (
                            <>
                                {getValues("category") !== 'AUTHENTICATION' && (
                                    <FieldSelect
                                        className="col-6"
                                        data={getValues("type") !== 'HSM' ? dataTemplateType : dataTemplateType.filter((x: Dictionary) => { return x.value !== 'STANDARD' })}
                                        disabled={templateTypeDisabled || disableInput}
                                        error={errors?.templatetype?.message}
                                        onChange={onChangeTemplateType}
                                        optionDesc="text"
                                        optionValue="value"
                                        valueDefault={getValues("templatetype")}
                                        label={getValues('type') !== 'HSM' ? t(langKeys.templatetype) : ''}
                                        variant={getValues('type') !== 'HSM' ? 'standard' : "outlined"}
                                        size="normal"
                                    />
                                )}
                                {getValues("type") === "HSM" && (
                                    <>
                                        {(!isNew) ? (
                                           
                                            <FieldMultiSelect
                                                className="col-6"
                                                data={dataChannel}
                                                disabled={true}
                                                error={errors?.communicationchannelid?.message}
                                                optionDesc="communicationchanneldesc"
                                                optionValue="communicationchannelid"
                                                valueDefault={getValues("communicationchannelid")}
                                                label={getValues('type') !== 'HSM' ? t(langKeys.channel) : ''}
                                                variant={getValues('type') !== 'HSM' ? 'standard' : "outlined"}
                                                size="normal"
                                            />
                                        ) : (
                                            <FieldSelect
                                                className="col-6"
                                                data={dataChannel}
                                                disabled={!isNew || disableInput}
                                                error={errors?.communicationchannelid?.message}
                                                optionDesc="communicationchanneldesc"
                                                optionValue="communicationchannelid"
                                                onChange={(value) => changeProvider(value)}
                                                valueDefault={getValues("communicationchannelid")}
                                                label={getValues('type') !== 'HSM' ? t(langKeys.channel) : ''}
                                                variant={getValues('type') !== 'HSM' ? 'standard' : "outlined"}
                                                size="normal"
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    {getValues("type") === 'HSM' &&
                        (getValues('name') !== '' && getValues('language') !== '' && getValues('templatetype') === 'MULTIMEDIA' && (getValues('communicationchannelid') !== "0" && getValues('communicationchannelid')) &&
                            (getValues('category') === 'UTILITY' || getValues('category') === 'MARKETING')) && (
                            <div>
                                <div className='row-zyx' style={{ borderBottom: '1px solid black', paddingBottom: 10 }}>
                                    <span className={classes.title}>{t(langKeys.templateedition)}</span>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: 20, maxWidth: '50%' }}>
                                        <span className={classes.title}>{t(langKeys.heading)}</span>
                                        <span style={{ marginBottom: 10 }}>Añade un título o elige qué tipo de contenido usarás para este encabezado.</span>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <div style={{ width: 180, marginBottom: 20 }}>
                                                <FieldSelect
                                                    data={dataHeaderType}
                                                    onChange={onChangeHeaderType}
                                                    optionDesc="text"
                                                    optionValue="value"
                                                    valueDefault={headerType}
                                                    variant="outlined"
                                                    disabled={!isNew}
                                                />
                                            </div>
                                            {getValues('headertype') === 'TEXT' && (
                                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <FieldEditAdvancedAux
                                                        inputProps={{
                                                            rows: 1,
                                                            maxRows: 1
                                                        }}
                                                        rows={1}
                                                        variant="outlined"
                                                        size="small"
                                                        maxLength={60}
                                                        valueDefault={getValues('header')}
                                                        error={errors?.header?.message}
                                                        onChange={handleInputHeader}
                                                        disabled={!isNew}
                                                        onInput={handleInputHeader}
                                                        style={{ border: '1px solid #BDBDBD', borderRadius: '4px', padding: '3px' }}
                                                    />
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                                                        <Button
                                                            className={classes.button}
                                                            startIcon={isHeaderVariable ? <ClearIcon /> : <AddIcon />}
                                                            onClick={addHeaderVariable}
                                                            disabled={!isNew}
                                                        >
                                                            {isHeaderVariable ? t(langKeys.deletevariable) : t(langKeys.addvariable)}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {getValues('headertype') === 'TEXT' && isHeaderVariable && (
                                            <div style={{ marginBottom: 20, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 'bold' }}>Ejemplos de contenido del encabezado</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px' }}>
                                                    <span>{'{{'}1{'}}'}</span>
                                                    <div style={{ backgroundColor: 'white', width: '100%' }}>
                                                        <FieldEdit
                                                            variant="outlined"
                                                            size="small"
                                                            maxLength={60}
                                                            valueDefault={getValues('headervariables')[0]}
                                                            onChange={(value) => {
                                                                setValue('headervariables.[0]', value)
                                                                trigger('headervariables')
                                                            }}
                                                            disabled={!isNew}
                                                        />
                                                    </div>
                                                </div>
                                                {getValues('headervariables')[0] === "" && (
                                                    <div className={classes.warningContainer}>
                                                        <WarningIcon style={{ color: '#FF7575' }} />
                                                        {t(langKeys.addexampletext)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {(headerType !== 'text' && headerType !== 'none') && (
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                                                    <div className={getValues('headertype') === 'IMAGE' ? classes.headerOptionSelected : classes.headerOption} onClick={() => { if (isNew) changeHeaderType('IMAGE') }}>
                                                        <div style={{ position: 'relative', marginRight: 10 }}>
                                                            <input type="checkbox" checked={getValues('headertype') === 'IMAGE'} className={classes.checkboxHeadOption} />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <ImageIcon style={{ height: 80, width: 'auto', color: getValues('headertype') === 'IMAGE' ? '#0E60A0' : '#9B9B9B' }} />
                                                            <span style={{ textAlign: 'center', color: getValues('headertype') === 'IMAGE' ? '#0E60A0' : '' }}>{t(langKeys.image)}</span>
                                                        </div>
                                                    </div>
                                                    <div className={getValues('headertype') === 'VIDEO' ? classes.headerOptionSelected : classes.headerOption} onClick={() => { if (isNew) changeHeaderType('VIDEO') }}>
                                                        <div style={{ position: 'relative', marginRight: 10 }}>
                                                            <input type="checkbox" checked={getValues('headertype') === 'VIDEO'} className={classes.checkboxHeadOption} />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <PlayCircleFilledIcon style={{ height: 80, width: 'auto', color: getValues('headertype') === 'VIDEO' ? '#0E60A0' : '#9B9B9B' }} />
                                                            <span style={{ textAlign: 'center', color: getValues('headertype') === 'VIDEO' ? '#0E60A0' : '' }}>{t(langKeys.video)}</span>
                                                        </div>
                                                    </div>
                                                    <div className={getValues('headertype') === 'DOCUMENT' ? classes.headerOptionSelected : classes.headerOption} onClick={() => { if (isNew) changeHeaderType('DOCUMENT') }}>
                                                        <div style={{ position: 'relative', marginRight: 10 }}>
                                                            <input type="checkbox" checked={getValues('headertype') === 'DOCUMENT'} className={classes.checkboxHeadOption} />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <DescriptionIcon style={{ height: 80, width: 'auto', color: getValues('headertype') === 'DOCUMENT' ? '#0E60A0' : '#9B9B9B' }} />
                                                            <span style={{ textAlign: 'center', color: getValues('headertype') === 'DOCUMENT' ? '#0E60A0' : '' }}>{t(langKeys.document)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(getValues('headertype') !== 'TEXT' && getValues('headertype') !== 'NONE') && (
                                                    <div style={{ marginBottom: 20, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 'bold' }}>Ejemplos de contenido del encabezado</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px' }}>
                                                            {t(langKeys[getValues('headertype')])}
                                                            {(getValues('headertype') === 'IMAGE' || getValues('headertype') === 'VIDEO' || getValues('headertype') === 'DOCUMENT') && (
                                                                <input
                                                                    type="file"
                                                                    accept={getValues('headertype') === 'IMAGE' ? '.jpg,.png' : getValues('headertype') === 'VIDEO' ? '.mp4' : '.pdf'}
                                                                    onChange={(e) => handleFileChange(e.target.files)}
                                                                    style={{ display: 'none' }}
                                                                    disabled={uploading}
                                                                    id="fileInput"
                                                                />
                                                            )}
                                                            {getValues('header') === '' ? (
                                                                <label htmlFor="fileInput">
                                                                    <Button
                                                                        startIcon={getValues('headertype') === 'IMAGE' ? <ImageIcon /> : getValues('headertype') === 'VIDEO' ? <VideoLibraryIcon /> : getValues('headertype') === 'DOCUMENT' ? <PDFRedIcon /> : <></>}
                                                                        variant="outlined"
                                                                        style={{ backgroundColor: '#F5F5F5' }}
                                                                        onClick={onClickAttachment}
                                                                        disabled={uploading || !isNew}
                                                                        component="span" // Esto es necesario para que el botón funcione como un input de tipo file
                                                                    >
                                                                        {getValues('headertype') === 'IMAGE' ? (getValues('header') !== '' ? 'Elegir otro archivo JPG o PNG' : 'Elegir archivo JPG o PNG') : getValues('headertype') === 'VIDEO' ? 'Elegir archivo MP4' : 'Elegir un documento PDF'}
                                                                    </Button>
                                                                </label>
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                                    <div style={{ display: 'flex', padding: 10, border: '1px solid #888888', borderRadius: 4, flex: 1 }}>
                                                                        <span style={{ color: 'black', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{filename}</span>
                                                                    </div>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setValue('header', '')
                                                                            setValue('headervariables', [])
                                                                            setFilename('')
                                                                        }}
                                                                        disabled={!isNew}
                                                                    >
                                                                        <ClearIcon />
                                                                    </IconButton>
                                                                </div>
                                                            )}
                                                            {uploading && (
                                                                <span>Subiendo...</span>
                                                            )}
                                                            <span style={{ color: 'red' }}>{errors?.header?.message}</span>
                                                        </div>
                                                        {getValues('header') === '' && (
                                                            <div className={classes.warningContainer}>
                                                                <WarningIcon style={{ color: '#FF7575' }} />
                                                                Añade contenido multimedia de ejemplo
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <span className={classes.title}>{t(langKeys.body)}</span>
                                        <span style={{ marginBottom: 5 }}>Introduce el texto de tu mensaje en el idioma que has seleccionado.</span>
                                        <div>
                                            <FieldEditAdvancedAux
                                                id="bodyInput"
                                                inputProps={{
                                                    rows: 8,
                                                    maxRows: 8
                                                }}
                                                valueDefault={getValues('body')}
                                                onChange={handleInputBody}
                                                maxLength={1024}
                                                error={errors?.body?.message}
                                                style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px' }}
                                                disabled={!isNew}
                                                onInput={handleInputBody}
                                                onPaste={handlePaste}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                                            <IconButton ref={emojiButtonRef} onClick={handleEmojiPickerClick} disabled={!isNew}>
                                                <EmojiEmotionsIcon />
                                            </IconButton>
                                            {showEmojiPicker && (
                                                <div style={{ position: 'absolute', top: pickerPosition.top, left: pickerPosition.left, zIndex: 1000 }}>
                                                    <Picker onSelect={addEmoji} />
                                                </div>
                                            )}
                                            <IconButton
                                                onClick={() => handleTextFormatting("*")}
                                                disabled={!isNew}
                                            >
                                                <FormatBoldIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleTextFormatting('_')}
                                                disabled={!isNew}
                                            >
                                                <FormatItalicIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleTextFormatting('~')}
                                                disabled={!isNew}
                                            >
                                                <FormatStrikethroughIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleTextFormatting('```')}
                                                disabled={!isNew}
                                            >
                                                <FormatCodeIcon />
                                            </IconButton>
                                            {getValues('bodyvariables').length < 20 && (
                                                <Button onClick={addVariable} disabled={!isNew} startIcon={<AddIcon />}>
                                                    Añadir Variable
                                                </Button>
                                            )}
                                            {getValues('bodyvariables').length > 0 && (
                                                <Button
                                                    className={classes.button}
                                                    startIcon={<CloseIcon />}
                                                    onClick={deleteVariable}
                                                    disabled={!isNew}
                                                >
                                                    {t(langKeys.deletevariable)}
                                                </Button>
                                            )}
                                        </div>
                                        {getValues('bodyvariables').length > 0 && (
                                            <div style={{ marginTop: 10, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 'bold' }}>{t(langKeys.text)}</span>
                                                {getValues('bodyvariables').map((v: Dictionary, index: number) => {
                                                    return (
                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px' }}>
                                                            <span>{'{{'}{v.variable}{'}}'}</span>
                                                            <div style={{ backgroundColor: 'white', width: '100%' }}>
                                                                <FieldEdit
                                                                    label={`Introduce el contenido para {{${v.variable}}}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    valueDefault={v.text}
                                                                    onChange={(value) => {
                                                                        const newBodyVariables = [...getValues('bodyvariables')];
                                                                        newBodyVariables[index].text = value;
                                                                        setValue('bodyvariables', newBodyVariables);
                                                                        trigger('bodyvariables')
                                                                    }}
                                                                    disabled={!isNew}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {getValues('bodyvariables').some(v => v.text === '') && (
                                                    <div className={classes.warningContainer}>
                                                        <WarningIcon style={{ color: '#FF7575' }} />
                                                        {t(langKeys.addexampletext)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <span className={classes.title} style={{ marginTop: 20 }}>{t(langKeys.footerpage)}</span>
                                        <span style={{ marginBottom: 5 }}>Añade una breve línea de texto en la parte inferior de tu plantilla de mensaje.</span>
                                        <FieldEditAdvancedAux
                                            error={errors?.footer?.message}
                                            maxLength={60}
                                            onInput={handleInput}
                                            onChange={handleInput}
                                            inputProps={{
                                                rows: 1,
                                                maxRows: 1
                                            }}
                                            rows={1}
                                            valueDefault={getValues("footer")}
                                            style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px' }}
                                            disabled={!isNew}
                                        />
                                        <span className={classes.title}>{t(langKeys.buttons)}</span>
                                        <span style={{ marginBottom: 5 }}>Crea botones que permitan a los clientes responder a tu mensaje o llevar a cabo alguna acción.</span>
                                        <div style={{ display: 'flex' }}>
                                            {(getValues("buttonsgeneric")?.length + getValues("buttonsquickreply")?.length) < 10 && (
                                                <div>
                                                    <AddButtonMenu
                                                        fastAnswer={onClickAddButtonText}
                                                        urlWeb={onClickAddButton}
                                                        callNumber={onClickAddButtonPhone}
                                                        textbtn={getValues('buttonsquickreply')}
                                                        urlbtn={getValues('buttonsgeneric').filter((btn: Dictionary) => { return btn.type === 'URL' })}
                                                        phonebtn={getValues('buttonsgeneric').filter((btn: Dictionary) => { return btn.type === 'PHONE' })}
                                                        isNew={isNew}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 10 }}>
                                            <EmojiObjectsIcon />
                                            <span style={{ marginLeft: 10 }}>Si añades más de tres botones, se mostrarán en una lista</span>
                                        </div>
                                        <DragDropContext onDragEnd={isNew ? handleDragDropGeneral : noop}>
                                            {(buttonsGeneral?.[0]?.items?.length > 0 || buttonsGeneral?.[1]?.items?.length > 0) && (
                                                <Droppable droppableId="root3" type="group" isDropDisabled={!isNew}>
                                                    {(provided) => (
                                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                                            {buttonsGeneral?.map((button: Dictionary, indexG: number) => {
                                                                return (
                                                                    <Draggable key={`button-${indexG}`} draggableId={`button-${indexG}`} index={indexG} isDragDisabled={!isNew}>
                                                                        {(provided) => (
                                                                            <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                                                {button.name === "quickreply" ? (
                                                                                    <DragDropContext onDragEnd={isNew ? handleDragDrop : noop}>
                                                                                        {button?.items?.length > 0 && (
                                                                                            <div className="row-zyx" style={{ display: 'flex', flexDirection: 'column', padding: 10, border: '1px solid #B4B4B4', borderRadius: 5, gap: '1rem' }}>
                                                                                                <div>
                                                                                                    <div style={{display: 'flex', justifyContent: 'center'}}><DragIndicatorIcon style={{ transform: 'rotate(90deg)' }}/></div>
                                                                                                    <div style={{ display: 'flex', padding: '0px 0px 0px 20px' }}>
                                                                                                        <ImportExportIcon style={{ color: '#0049CF' }} />
                                                                                                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.fastanswer)}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <React.Fragment>
                                                                                                    <Droppable droppableId="root" type="group" isDropDisabled={!isNew}>
                                                                                                        {(provided) => (
                                                                                                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                                                                                {button?.items?.map((btn: any, i: number) => {
                                                                                                                    return (
                                                                                                                        <Draggable key={`btn-${i}`} draggableId={`btn-${i}`} index={i} isDragDisabled={!isNew}>
                                                                                                                            {(provided) => (
                                                                                                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                                                                                                    <div style={{ display: 'flex', padding: 15, backgroundColor: '#F8F8F8', border: '1px solid #ADADAD', borderRadius: 5, alignItems: 'center', gap: 5 }}>
                                                                                                                                        <DragIndicatorIcon />
                                                                                                                                        <div style={{ flex: 1 }}>
                                                                                                                                            <FieldEditAdvancedAux
                                                                                                                                                disabled={disableInput || !isNew}
                                                                                                                                                label={t(langKeys.buttontext)}
                                                                                                                                                error={errors?.buttonsquickreply?.[i]?.btn?.text?.message}
                                                                                                                                                onInput={(e) => handleQuickReply(e, i)}
                                                                                                                                                onChange={(e) => handleQuickReply(e, i)}
                                                                                                                                                valueDefault={btn?.btn?.text || ""}
                                                                                                                                                variant="outlined"
                                                                                                                                                maxLength={25}
                                                                                                                                                rows={1}
                                                                                                                                                style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px' }}
                                                                                                                                                fregister={{
                                                                                                                                                    ...register(`buttonsquickreply.${i}.btn.text`, {
                                                                                                                                                        validate: (value) =>
                                                                                                                                                            (value && value.length) || t(langKeys.field_required),
                                                                                                                                                    }),
                                                                                                                                                }}
                                                                                                                                            />
                                                                                                                                        </div>
                                                                                                                                        <IconButton onClick={() => onClickRemoveButtonText(i)} disabled={!isNew}>
                                                                                                                                            <CloseIcon />
                                                                                                                                        </IconButton>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            )}
                                                                                                                        </Draggable>
                                                                                                                    );
                                                                                                                })}
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </Droppable>
                                                                                                </React.Fragment>
                                                                                            </div>
                                                                                        )}
                                                                                    </DragDropContext>
                                                                                ) : (
                                                                                    <DragDropContext onDragEnd={isNew ? handleDragDropAux : noop}> 
                                                                                        {button?.items?.length > 0 && (
                                                                                            <div className="row-zyx" style={{ display: 'flex', flexDirection: 'column', padding: 10, border: '1px solid #B4B4B4', borderRadius: 5, gap: '1rem' }}>
                                                                                                <div>
                                                                                                    <div style={{display: 'flex', justifyContent: 'center'}}><DragIndicatorIcon style={{ transform: 'rotate(90deg)' }}/></div>
                                                                                                    <div style={{ display: 'flex', padding: '0px 0px 0px 20px' }}>
                                                                                                        <ImportExportIcon style={{ color: '#0049CF' }} />
                                                                                                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.calltoaction)}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <React.Fragment>
                                                                                                    <Droppable droppableId="root2" type="group" isDropDisabled={!isNew}>
                                                                                                        {(provided) => (
                                                                                                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                                                                                {button?.items?.map((btn: any, i: number) => {
                                                                                                                    return (
                                                                                                                        <Draggable key={`btn-${i}`} draggableId={`btn-${i}`} index={i} isDragDisabled={!isNew}>
                                                                                                                            {(provided) => (
                                                                                                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                                                                                                    {btn.type === 'URL' ? (
                                                                                                                                        <>
                                                                                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                                                                                <DragIndicatorIcon />
                                                                                                                                                <div style={{ display: 'flex', padding: '10px 10px 0px 10px', backgroundColor: '#F8F8F8', border: '1px solid #ADADAD', borderRadius: 5, flex: 1, gap: 7 }}>
                                                                                                                                                    <div className="row-zyx" style={{ width: '100%', marginBottom: 0 }}>
                                                                                                                                                        <div style={{marginBottom: 10}}>
                                                                                                                                                            <Checkbox
                                                                                                                                                                color="primary"
                                                                                                                                                                checked={btn?.click_counter}
                                                                                                                                                                onChange={() => {
                                                                                                                                                                    if(btn?.click_counter) {
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.click_counter`, false);
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.url`, "");
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.text`, "");
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.type`, "");
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.variables`, [""]);
                                                                                                                                                                        trigger('buttonsgeneric')
                                                                                                                                                                    } else {
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.click_counter`, true);
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.url`, "");
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.text`, "");
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.type`, "dynamic");
                                                                                                                                                                        setValue(`buttonsgeneric.${i}.btn.variables`, [""]);
                                                                                                                                                                        trigger('buttonsgeneric')
                                                                                                                                                                    }
                                                                                                                                                                }}
                                                                                                                                                            />
                                                                                                                                                            <span>{t(langKeys.useregisteredlinkscount)}</span>
                                                                                                                                                        </div>
                                                                                                                                                        {!btn?.click_counter ? (
                                                                                                                                                            <>
                                                                                                                                                                <SingleLineInput
                                                                                                                                                                    className='col-4'
                                                                                                                                                                    label={t(langKeys.buttontext)}
                                                                                                                                                                    error={errors?.buttonsgeneric?.[i]?.btn?.text?.message}
                                                                                                                                                                    onInput={(e) => handleActionButtonText(e, i)}
                                                                                                                                                                    onChange={(e) => handleActionButtonText(e, i)}
                                                                                                                                                                    valueDefault={btn?.btn?.text || ""}
                                                                                                                                                                    maxLength={25}
                                                                                                                                                                    rows={1}
                                                                                                                                                                    inputProps={{
                                                                                                                                                                        rows: 1,
                                                                                                                                                                        maxRows: 1
                                                                                                                                                                    }}
                                                                                                                                                                    fregister={{
                                                                                                                                                                        ...register(`buttonsgeneric.${i}.btn.text`, {
                                                                                                                                                                            validate: (value) =>
                                                                                                                                                                                (value && value.length) || t(langKeys.field_required),
                                                                                                                                                                        }),
                                                                                                                                                                    }}
                                                                                                                                                                    disabled={!isNew}
                                                                                                                                                                    style={{ border: '1px solid #BFBFBF', borderRadius: '4px', padding: '8px'}}
                                                                                                                                                                />
                                                                                                                                                                <div className={btn?.btn?.type === 'dynamic' ? 'col-3' : 'col-4'}>
                                                                                                                                                                    <span>{t(langKeys.urltype)}</span>
                                                                                                                                                                    <FieldSelect
                                                                                                                                                                        data={dataURLType}
                                                                                                                                                                        error={errors?.buttonsgeneric?.[i]?.btn?.type?.message}
                                                                                                                                                                        onChange={(value) => onChangeButton(i, "type", value?.value)}
                                                                                                                                                                        optionDesc="text"
                                                                                                                                                                        optionValue="value"
                                                                                                                                                                        valueDefault={btn?.btn?.type || ""}
                                                                                                                                                                        variant="outlined"
                                                                                                                                                                        fregister={{
                                                                                                                                                                            ...register(`buttonsgeneric.${i}.btn.type`, {
                                                                                                                                                                                validate: (value) =>
                                                                                                                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                                                                                                                            }),
                                                                                                                                                                        }}
                                                                                                                                                                        disabled={!isNew}
                                                                                                                                                                        size="normal"
                                                                                                                                                                    />
                                                                                                                                                                </div>
                                                                                                                                                                <SingleLineInput
                                                                                                                                                                    className='col-4'
                                                                                                                                                                    label={t(langKeys.urlwebsite)}
                                                                                                                                                                    error={errors?.buttonsgeneric?.[i]?.btn?.url?.message}
                                                                                                                                                                    onInput={(e) => handleActionButtonUrl(e, i)}
                                                                                                                                                                    onChange={(e) => handleActionButtonUrl(e, i)}
                                                                                                                                                                    valueDefault={btn?.btn?.url || ""}
                                                                                                                                                                    rows={1}
                                                                                                                                                                    inputProps={{
                                                                                                                                                                        rows: 1,
                                                                                                                                                                        maxRows: 1
                                                                                                                                                                    }}
                                                                                                                                                                    maxLength={2000}
                                                                                                                                                                    fregister={{
                                                                                                                                                                        ...register(`buttonsgeneric.${i}.btn.url`, {
                                                                                                                                                                            validate: (value) =>
                                                                                                                                                                                (value && value.length) || t(langKeys.field_required),
                                                                                                                                                                        }),
                                                                                                                                                                    }}
                                                                                                                                                                    disabled={!isNew}
                                                                                                                                                                    style={{ border: '1px solid #BFBFBF', borderRadius: '4px', padding: '8px' }}
                                                                                                                                                                />
                                                                                                                                                                {btn?.btn?.type === 'dynamic' && (
                                                                                                                                                                    <div className="col-1" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                                                                                                                                        <span>{'{{'}1{'}}'}</span>
                                                                                                                                                                        <Tooltip title={t(langKeys.dynamicbuttontext)} placement="top">
                                                                                                                                                                            <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                                                                                                                                                        </Tooltip>
                                                                                                                                                                    </div>
                                                                                                                                                                )}
                                                                                                                                                            </>
                                                                                                                                                        ) : (
                                                                                                                                                            <>
                                                                                                                                                                <SingleLineInput
                                                                                                                                                                    className='col-4'
                                                                                                                                                                    label={t(langKeys.buttontext)}
                                                                                                                                                                    error={errors?.buttonsgeneric?.[i]?.btn?.text?.message}
                                                                                                                                                                    onInput={(e) => handleActionButtonText(e, i)}
                                                                                                                                                                    onChange={(e) => handleActionButtonText(e, i)}
                                                                                                                                                                    valueDefault={btn?.btn?.text || ""}
                                                                                                                                                                    maxLength={25}
                                                                                                                                                                    rows={1}
                                                                                                                                                                    inputProps={{
                                                                                                                                                                        rows: 1,
                                                                                                                                                                        maxRows: 1
                                                                                                                                                                    }}
                                                                                                                                                                    fregister={{
                                                                                                                                                                        ...register(`buttonsgeneric.${i}.btn.text`, {
                                                                                                                                                                            validate: (value) =>
                                                                                                                                                                                (value && value.length) || t(langKeys.field_required),
                                                                                                                                                                        }),
                                                                                                                                                                    }}
                                                                                                                                                                    disabled={!isNew}
                                                                                                                                                                    style={{ border: '1px solid #BFBFBF', borderRadius: '4px', padding: '8px'}}
                                                                                                                                                                />
                                                                                                                                                                <div className='col-8'>
                                                                                                                                                                    <div style={{marginBottom: 4}}>{t(langKeys.selectregisteredlink)}</div>
                                                                                                                                                                    <FieldSelect
                                                                                                                                                                        data={multiData?.[4]?.data || []}
                                                                                                                                                                        error={errors?.buttonsgeneric?.[i]?.btn?.url?.message}
                                                                                                                                                                        onChange={(value) => {
                                                                                                                                                                            if(value) {
                                                                                                                                                                                setValue(`buttonsgeneric.${i}.btn.url`, `https://redirect.laraigo.com/DEV?params={1}&to=${value?.url}`);
                                                                                                                                                                                setValue(`buttonsgeneric.${i}.btn.variables`, [`https://redirect.laraigo.com/DEV?params={853-542}&to=${value?.url}`]);
                                                                                                                                                                                trigger('buttonsgeneric')
                                                                                                                                                                            } else {
                                                                                                                                                                                setValue(`buttonsgeneric.${i}.btn.url`, "");
                                                                                                                                                                                setValue(`buttonsgeneric.${i}.btn.variables`, [""]);
                                                                                                                                                                                trigger('buttonsgeneric')
                                                                                                                                                                            }
                                                                                                                                                                        }}
                                                                                                                                                                        optionDesc="description"
                                                                                                                                                                        optionValue="linkregisterid"
                                                                                                                                                                        valueDefault={btn?.btn?.url || ""}
                                                                                                                                                                        variant="outlined"
                                                                                                                                                                        fregister={{
                                                                                                                                                                            ...register(`buttonsgeneric.${i}.btn.url`, {
                                                                                                                                                                                validate: (value) =>
                                                                                                                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                                                                                                                            }),
                                                                                                                                                                        }}
                                                                                                                                                                        disabled={!isNew}
                                                                                                                                                                        size="normal"
                                                                                                                                                                    />
                                                                                                                                                                </div>
                                                                                                                                                            </>
                                                                                                                                                        )}
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                                <IconButton onClick={() => onClickRemoveButton(i)} disabled={!isNew}>
                                                                                                                                                    <CloseIcon />
                                                                                                                                                </IconButton>
                                                                                                                                            </div>
                                                                                                                                            {(btn?.btn?.type === 'dynamic' && !btn?.click_counter) && (
                                                                                                                                                <div style={{ marginTop: 20, backgroundColor: '#F1F1F1', padding: 15, display: 'flex', flexDirection: 'column' }}>
                                                                                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                                                                                                                        <span>{'{{'}1{'}}'}</span>
                                                                                                                                                        <div style={{ backgroundColor: 'white', width: '100%' }}>
                                                                                                                                                            <FieldEdit
                                                                                                                                                                label={btn?.btn?.url !== '' ? `Introduce la URL completa de ${btn?.btn?.url}{{1}}` : ''}
                                                                                                                                                                variant="outlined"
                                                                                                                                                                size="small"
                                                                                                                                                                onChange={(value) => {
                                                                                                                                                                    setValue(`buttonsgeneric.${i}.btn.variables[0]`, value)
                                                                                                                                                                    trigger('buttonsgeneric')
                                                                                                                                                                }}
                                                                                                                                                                valueDefault={btn?.btn?.variables[0] || ""}
                                                                                                                                                                disabled={!isNew}
                                                                                                                                                            />
                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                    {getValues(`buttonsgeneric.${i}.btn.variables[0]`) === "" && (
                                                                                                                                                        <div className={classes.warningContainer}>
                                                                                                                                                            <WarningIcon style={{ color: '#FF7575' }} />
                                                                                                                                                            {t(langKeys.addexampletext)}
                                                                                                                                                        </div>
                                                                                                                                                    )}
                                                                                                                                                </div>
                                                                                                                                            )}
                                                                                                                                        </>
                                                                                                                                    ) : (
                                                                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                                                                            <DragIndicatorIcon />
                                                                                                                                            <div style={{ display: 'flex', padding: '15px 10px 0px 10px', backgroundColor: '#F8F8F8', border: '1px solid #ADADAD', borderRadius: 5, flex: 1, gap: 7 }}>
                                                                                                                                                <div className="row-zyx" style={{ width: '100%', marginBottom: 0 }}>
                                                                                                                                                    <SingleLineInput
                                                                                                                                                        className='col-4'
                                                                                                                                                        label={t(langKeys.buttontext)}
                                                                                                                                                        error={errors?.buttonsgeneric?.[i]?.btn?.text?.message}
                                                                                                                                                        onInput={(e) => handleActionButtonText(e, i)}
                                                                                                                                                        onChange={(e) => handleActionButtonText(e, i)}
                                                                                                                                                        valueDefault={btn?.btn?.text || ""}
                                                                                                                                                        variant="outlined"
                                                                                                                                                        maxLength={25}
                                                                                                                                                        rows={1}
                                                                                                                                                        inputProps={{
                                                                                                                                                            rows: 1,
                                                                                                                                                            maxRows: 1
                                                                                                                                                        }}
                                                                                                                                                        fregister={{
                                                                                                                                                            ...register(`buttonsgeneric.${i}.btn.text`, {
                                                                                                                                                                validate: (value) =>
                                                                                                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                                                                                                            }),
                                                                                                                                                        }}
                                                                                                                                                        size="small"
                                                                                                                                                        disabled={!isNew}
                                                                                                                                                        style={{ border: '1px solid #BFBFBF', borderRadius: '4px', padding: '8px' }}
                                                                                                                                                    />
                                                                                                                                                    <div className='col-4'>
                                                                                                                                                        <span>{t(langKeys.country)}</span>
                                                                                                                                                        <FieldSelect
                                                                                                                                                            data={dataCountryCodes}
                                                                                                                                                            onChange={(value) => {
                                                                                                                                                                if (value) {
                                                                                                                                                                    setValue(`buttonsgeneric.${i}.btn.code`, value.value);
                                                                                                                                                                    trigger('buttonsgeneric')
                                                                                                                                                                } else {
                                                                                                                                                                    setValue(`buttonsgeneric.${i}.btn.code`, null);
                                                                                                                                                                    trigger('buttonsgeneric')
                                                                                                                                                                }
                                                                                                                                                            }}
                                                                                                                                                            optionDesc="text"
                                                                                                                                                            optionValue="value"
                                                                                                                                                            error={errors?.buttonsgeneric?.[i]?.btn?.code?.message}
                                                                                                                                                            valueDefault={btn?.btn?.code || ""}
                                                                                                                                                            variant="outlined"
                                                                                                                                                            fregister={{
                                                                                                                                                                ...register(`buttonsgeneric.${i}.btn.code`, {
                                                                                                                                                                    validate: (value) =>
                                                                                                                                                                        (value && value !== 0) || t(langKeys.field_required),
                                                                                                                                                                }),
                                                                                                                                                            }}
                                                                                                                                                            disabled={!isNew}
                                                                                                                                                            size="normal"
                                                                                                                                                        />
                                                                                                                                                    </div>
                                                                                                                                                    <div className='col-4'>
                                                                                                                                                        <span>{t(langKeys.telephonenumber)}</span>
                                                                                                                                                        <FieldEditAdvancedAux
                                                                                                                                                            type="number"
                                                                                                                                                            error={errors?.buttonsgeneric?.[i]?.btn?.phone_number?.message}
                                                                                                                                                            onInput={(e) => handleActionButtonPhone(e, i)}
                                                                                                                                                            onChange={(e) => handleActionButtonPhone(e, i)}
                                                                                                                                                            valueDefault={btn?.btn?.phone_number || ""}
                                                                                                                                                            variant="outlined"
                                                                                                                                                            fregister={{
                                                                                                                                                                ...register(`buttonsgeneric.${i}.btn.phone_number`, {
                                                                                                                                                                    validate: (value) =>
                                                                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                                                                }),
                                                                                                                                                            }}
                                                                                                                                                            maxLength={20}
                                                                                                                                                            rows={1}
                                                                                                                                                            inputProps={{
                                                                                                                                                                rows: 1,
                                                                                                                                                                maxRows: 1
                                                                                                                                                            }}
                                                                                                                                                            disabled={!isNew}
                                                                                                                                                            style={{ border: '1px solid #BFBFBF', borderRadius: '4px', padding: '8px' }}
                                                                                                                                                        />
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                            <IconButton onClick={() => onClickRemoveButton(i)} disabled={!isNew}>
                                                                                                                                                <CloseIcon />
                                                                                                                                            </IconButton>
                                                                                                                                        </div>
                                                                                                                                    )}
                                                                                                                                </div>
                                                                                                                            )}
                                                                                                                        </Draggable>
                                                                                                                    );
                                                                                                                })}
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </Droppable>
                                                                                                </React.Fragment>
                                                                                            </div>
                                                                                        )}
                                                                                    </DragDropContext>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            )}
                                        </DragDropContext>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 20 }}>
                                        <span className={classes.title}>{t(langKeys.messagepreview)}</span>
                                        <span style={{ marginBottom: 10 }}>Vista previa del mensaje configurado a enviar</span>
                                        <div style={{ height: 'fit-content', width: '100%', border: '1px solid black' }}>
                                            <MessagePreviewMultimedia
                                                headerType={getValues('headertype')}
                                                header={getValues('header')}
                                                headervariables={getValues('headervariables')}
                                                body={getValues('body')}
                                                bodyvariables={getValues('bodyvariables')}
                                                footer={getValues('footer')}
                                                buttonstext={getValues('buttonsquickreply').map((btn: Dictionary) => { return btn?.btn?.text })}
                                                buttonslink={getValues('buttonsgeneric').map((btn: Dictionary) => { return { type: btn?.type, text: btn?.btn?.text } })}
                                                buttonsGeneral={buttonsGeneral}
                                                isNew={isNew}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    {(getValues("type") === 'HSM' && getValues('category') === 'AUTHENTICATION' && getValues('name') !== '' && getValues('language') !== '' && (getValues('communicationchannelid') !== "0" && getValues('communicationchannelid'))) && (
                        <div>
                            <div className='row-zyx' style={{ borderBottom: '1px solid black', paddingBottom: 10 }}>
                                <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.templateedition)}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: 20 }}>
                                    <span className={classes.title}>{t(langKeys.messagecontent)}</span>
                                    <span style={{ marginBottom: 10 }}>{t(langKeys.authenticationmessagecontent)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={getValues('authenticationdata.safetyrecommendation')}
                                            color="primary"
                                            onChange={(e) => changeSafetyRecommendation(e)}
                                            disabled={!isNew}
                                        />
                                        <span>{t(langKeys.addsecurityadvice)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={getValues('authenticationdata.showexpirationdate')}
                                            color="primary"
                                            onChange={(e) => showExpirationDate(e)}
                                            disabled={!isNew}
                                        />
                                        <span>{t(langKeys.addlastdatecode)}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #B4B4B4', backgroundColor: '#F1F1F1', padding: 15, borderRadius: 10, marginTop: 10, marginBottom: 20 }}>
                                        <span style={{ fontWeight: 'bold', marginBottom: 8 }}>{t(langKeys.expiresin)}</span>
                                        <div style={{ display: 'flex', gap: 20, alignItems: 'end' }}>
                                            <div style={{ width: 150 }}>
                                                <span style={{ fontSize: 10 }}>{t(langKeys.minutes)}</span>
                                                <FieldEditAdvancedAux
                                                    type="number"
                                                    valueDefault={getValues('authenticationdata.codeexpirationminutes')}
                                                    onInput={(e) => {
                                                        let val = e.target.value.replace(/[^0-9 ]/g, "");
                                                        if (val !== "") {
                                                            val = Math.max(1, Math.min(90, parseInt(val, 10))); // Asegura que el valor esté entre 0 y 91
                                                        }
                                                        setValue('authenticationdata.codeexpirationminutes', Number(val));
                                                        e.target.value = val;
                                                        trigger('authenticationdata');
                                                    }}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/[^0-9 ]/g, "");
                                                        if (val !== "") {
                                                            val = Math.max(1, Math.min(90, parseInt(val, 10))); // Asegura que el valor esté entre 0 y 91
                                                        }
                                                        setValue('authenticationdata.codeexpirationminutes', Number(val));
                                                        e.target.value = val;
                                                        trigger('authenticationdata');
                                                    }}
                                                    disabled={!isNew}
                                                    rows={1}
                                                    style={{ border: '1px solid #BFBFBF', borderRadius: '4px', padding: '5px' }}
                                                    fregister={{
                                                        ...register(`authenticationdata.codeexpirationminutes`, {
                                                            validate: (value) =>
                                                                (value && value >= Number(getValues('authenticationdata.validityperiod'))) || t(langKeys.field_nonnegative),
                                                        }),
                                                    }}
                                                />
                                            </div>
                                            <div className={classes.warningContainer}>
                                                <WarningIcon style={{ color: '#FF7575' }} />
                                                <span>{t(langKeys.introudceavalue)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={classes.title}>{t(langKeys.buttontext)}</span>
                                    <span style={{ marginBottom: 10 }}>{t(langKeys.buttontextauth)}</span>
                                    <div style={{ width: '50%', marginBottom: 20 }}>
                                        <FieldEditAdvanced
                                            inputProps={{
                                                rows: 1,
                                                maxRows: 1
                                            }}
                                            label={t(langKeys.code)}
                                            valueDefault={getValues('authenticationdata.buttontext')}
                                            onChange={(value) => {
                                                setValue('authenticationdata.buttontext', value)
                                                trigger('authenticationdata')
                                            }}
                                            maxLength={25}
                                            rows={1}
                                            disabled={!isNew}
                                            style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 5 }}>
                                        <span className={classes.title}>{t(langKeys.advanceconfig)}</span>
                                        <Tooltip title={t(langKeys.validtyperiodtitlehelptext)} arrow placement="top">
                                            <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                        </Tooltip>
                                    </div>
                                    <span className={classes.title}>{t(langKeys.validityperiodmessages)}</span>
                                    <span style={{ marginBottom: 10 }}>{t(langKeys.validityperiodtext)}</span>
                                    <div style={{ display: 'flex', alignItems: 'start', marginTop: 10 }}>
                                        <Checkbox
                                            checked={getValues('authenticationdata.configurevalidityperiod')}
                                            color="primary"
                                            onChange={(e) => configureValidityPeriod(e)}
                                            disabled={!isNew}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 'bold' }}>{t(langKeys.configvalidityperiod)}</span>
                                            <span>{t(langKeys.validityperiodconfigcondition)}</span>
                                        </div>
                                    </div>
                                    {getValues('authenticationdata.configurevalidityperiod') && (
                                        <div style={{ display: 'flex', flexDirection: 'column', padding: '15px 25px', backgroundColor: '#F5F5F5', border: '1px solid #ACACAC', borderRadius: 10, marginTop: 10 }}>
                                            <CustomTitleHelper
                                                title={t(langKeys.validityperiod) + ' '}
                                                helperText={t(langKeys.test)}
                                            />
                                            <div style={{ backgroundColor: 'white', width: 250, marginTop: 5 }}>
                                                <FieldSelect
                                                    data={dataValidityPeriod}
                                                    optionDesc="text"
                                                    optionValue="value"
                                                    variant="outlined"
                                                    valueDefault={getValues('authenticationdata.validityperiod')}
                                                    onChange={(value) => {
                                                        if (value) {
                                                            setValue('authenticationdata.validityperiod', value.value)
                                                            trigger('authenticationdata')
                                                        } else {
                                                            setValue('authenticationdata.validityperiod', '')
                                                            trigger('authenticationdata')
                                                        }
                                                    }}
                                                    disabled={!isNew}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 20 }}>
                                    <span className={classes.title}>{t(langKeys.messagepreview)}</span>
                                    <span style={{ marginBottom: 10 }}>Vista previa del mensaje configurado a enviar</span>
                                    <div style={{ height: 500, width: '100%', border: '1px solid black' }}>
                                        <MessagePreviewAuthentication
                                            buttontext={getValues('authenticationdata.buttontext')}
                                            safetyAdvice={getValues('authenticationdata.safetyrecommendation')}
                                            dateAdvice={getValues('authenticationdata.showexpirationdate')}
                                            expiresValue={getValues('authenticationdata.codeexpirationminutes')}
                                        />
                                    </div>
                                    <div style={{ height: 100 }} />
                                    {getValues('authenticationdata.codeexpirationminutes') < getValues('authenticationdata.validityperiod') && (
                                        <div style={{ display: 'flex', padding: 10, borderRadius: 8, gap: 10, backgroundColor: '#FFF5D1', marginTop: 10 }}>
                                            <WarningIcon style={{ color: '#D3A500' }} />
                                            <span>{t(langKeys.authtemplatemessage)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {getValues("type") === 'HSM' &&
                        (getValues('name') !== '' && getValues('language') !== '' && getValues('templatetype') === 'CAROUSEL' && (getValues('communicationchannelid') !== "0" && getValues('communicationchannelid')) &&
                            (getValues('category') === 'UTILITY' || getValues('category') === 'MARKETING')) && (
                            <div>
                                <div className='row-zyx' style={{ borderBottom: '1px solid black', paddingBottom: 10 }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.templateedition)}</span>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: 20, maxWidth: '50%' }}>
                                        <span className={classes.title}>{t(langKeys.bubblemessage)}</span>
                                        <span style={{ marginBottom: 10 }}>{t(langKeys.bubblemessagetext)}</span>
                                        <div>
                                            <FieldEditAdvancedAux
                                                id="bodyInput"
                                                variant="outlined"
                                                inputProps={{
                                                    rows: 8,
                                                    maxRows: 8
                                                }}
                                                valueDefault={getValues('body')}
                                                onChange={handleInputBody}
                                                maxLength={1024}
                                                disabled={!isNew}
                                                error={errors?.body?.message}
                                                style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px' }}
                                                onInput={handleInputBody}
                                                onPaste={handlePaste}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                                            <IconButton ref={emojiButtonRef} onClick={handleEmojiPickerClick} disabled={!isNew}>
                                                <EmojiEmotionsIcon />
                                            </IconButton>
                                            {showEmojiPicker && (
                                                <div style={{ position: 'absolute', top: pickerPosition.top, left: pickerPosition.left, zIndex: 1000 }}>
                                                    <Picker onEmojiSelect={addEmoji} />
                                                </div>
                                            )}
                                            <IconButton
                                                onClick={() => handleTextFormatting("*")}
                                                disabled={!isNew}
                                            >
                                                <FormatBoldIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleTextFormatting("_")}
                                                disabled={!isNew}
                                            >
                                                <FormatItalicIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleTextFormatting("~")}
                                                disabled={!isNew}
                                            >
                                                <FormatStrikethroughIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleTextFormatting("```")}
                                                disabled={!isNew}
                                            >
                                                <FormatCodeIcon />
                                            </IconButton>
                                            {getValues('bodyvariables').length < 20 && (
                                                <Button onClick={addVariable} disabled={!isNew} startIcon={<AddIcon />}>
                                                    Añadir Variable
                                                </Button>
                                            )}
                                            {getValues('bodyvariables').length > 0 && (
                                                <Button
                                                    className={classes.button}
                                                    startIcon={<CloseIcon />}
                                                    onClick={deleteVariable}
                                                    disabled={!isNew}
                                                >
                                                    {t(langKeys.deletevariable)}
                                                </Button>
                                            )}
                                        </div>
                                        {getValues('bodyvariables').length > 0 && (
                                            <div style={{ marginTop: 10, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 'bold' }}>{t(langKeys.text)}</span>
                                                {getValues('bodyvariables').map((v: Dictionary, index: number) => {
                                                    return (
                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px' }}>
                                                            <span>{'{{'}{v.variable}{'}}'}</span>
                                                            <div style={{ backgroundColor: 'white', width: '100%' }}>
                                                                <FieldEdit
                                                                    label={`Introduce el contenido para {{${v.variable}}}`}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    valueDefault={v.text}
                                                                    onChange={(value) => {
                                                                        setValue(`bodyvariables.${index}.text`, value);
                                                                        trigger('bodyvariables')
                                                                    }}
                                                                    disabled={!isNew}
                                                                    fregister={{
                                                                        ...register(`bodyvariables.${index}.text`, {
                                                                            validate: (value) =>
                                                                                (value && value.length) || t(langKeys.field_required),
                                                                        }),
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {getValues('bodyvariables').some(v => v.text === '') && (
                                                    <div className={classes.warningContainer}>
                                                        <WarningIcon style={{ color: '#FF7575' }} />
                                                        {t(langKeys.addexampletext)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 20 }}>
                                        <span className={classes.title}>{t(langKeys.messagepreview)}</span>
                                        <span style={{ marginBottom: 10 }}>Vista previa del mensaje configurado a enviar</span>
                                        <div style={{ height: 'fit-content', width: '100%', border: '1px solid black' }}>
                                            <MessagePreviewCarousel
                                                body={getValues('body')}
                                                bodyvariables={getValues('bodyvariables')}
                                                carouselCards={getValues('carouseldata')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row-zyx" style={{ marginTop: 20 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className={classes.title}>{t(langKeys.messagetemplate_carousel)}</span>
                                        <span style={{ marginBottom: 10 }}>Configura tus cards de carrusel añadiendo imágenes, texto, variables y botones</span>
                                        <span style={{ color: 'red', marginBottom: 10 }}>{errors?.carouseldata?.message}</span>
                                    </div>
                                    {getValues('carouseldata')?.length > 0 ? (
                                        <div>
                                            <div className={classes.carouselContainer}>
                                                <React.Fragment>
                                                    {getValues("carouseldata")?.map((card: any, index: number) => {
                                                        return (
                                                            <div key={`card-${index}`} className={classes.carouselCard}>
                                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
                                                                    <IconButton onClick={() => onClickRemoveCard(index)} disabled={!isNew} style={{ padding: 0 }}>
                                                                        <ClearIcon className={classes.closeIcon} />
                                                                    </IconButton>
                                                                </div>
                                                                {card.header !== '' ? (
                                                                    <div className={classes.uploadedImage}>
                                                                        <div className={classes.cardMediaContainer}>
                                                                            <img src={card.header} alt="Selected Image" className={classes.cardMedia} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: 10 }}>
                                                                            <span className={classes.imageName}>{card.header.split('/').pop().replace(/%20/g, ' ')}</span>
                                                                            <IconButton onClick={() => handleImageRemove(index)} disabled={!isNew} style={{ padding: 0 }}>
                                                                                <ClearIcon className={classes.closeIcon} />
                                                                            </IconButton>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <input
                                                                            type="file"
                                                                            accept={'.jpg,.png'}
                                                                            onChange={(e) => handleFileChangeAux(e.target.files, index)}
                                                                            style={{ display: 'none' }}
                                                                            id={`fileInput-${index}`}
                                                                            disabled={!isNew}
                                                                        />
                                                                        <div style={{ width: '50%' }}>
                                                                            <label htmlFor={`fileInput-${index}`} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                                                <div className={classes.uploadedImage} style={{ cursor: 'pointer', width: '100%' }}>
                                                                                    <ImageIcon style={{ color: '#004DB1', height: 170, width: 'auto' }} />
                                                                                    <span style={{ fontWeight: 'bold' }}>{t(langKeys.uploadImage)}</span>
                                                                                    <span style={{ color: '#004DB1' }}>Tamaño máximo 5 MB</span>
                                                                                </div>
                                                                            </label>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <div style={{ width: '90%', fontWeight: 'bold' }}>
                                                                    {t(langKeys.body)}
                                                                    <FieldEditAdvancedAux
                                                                        variant="outlined"
                                                                        inputProps={{
                                                                            rows: 4,
                                                                            maxRows: 4
                                                                        }}
                                                                        maxLength={160}
                                                                        rows={4}
                                                                        valueDefault={card?.body || ""}
                                                                        error={errors?.carouseldata?.[index]?.body?.message ? true : false}
                                                                        fregister={{
                                                                            ...register(`carouseldata.${index}.body`, {
                                                                                validate: (value) =>
                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                            }),
                                                                        }}
                                                                        onChange={(e) => handleInputBodyCard(e, index)}
                                                                        onInput={(e) => handleInputBodyCard(e, index)}
                                                                        onPaste={(e) => handlePasteCard(e, index)}
                                                                        disabled={!isNew}
                                                                        style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px' }}
                                                                    />
                                                                    {getValues(`carouseldata.${index}.bodyvariables`)?.length < 20 && (
                                                                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                                            <Button
                                                                                className={classes.button}
                                                                                startIcon={<AddIcon />}
                                                                                onClick={() => addVariableCard(index)}
                                                                                disabled={!isNew}
                                                                            >
                                                                                {t(langKeys.addvariable)}
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {(getValues(`carouseldata.${index}.buttons`)?.length < 2 && !(buttonsType === 'phone' && getValues(`carouseldata.${index}.buttons`).length === 1)) && (
                                                                    <div>
                                                                        <AddButtonMenuCard
                                                                            fastAnswer={() => onClickAddButtonTCard(index)}
                                                                            urlWeb={() => onClickAddButtonLCard(index)}
                                                                            callNumber={() => onClickAddButtonPCard(index)}
                                                                            textbtn={getValues(`carouseldata.${index}.buttons`).filter((btn: Dictionary) => { return btn.type === 'QUICK_REPLY' })}
                                                                            urlbtn={getValues(`carouseldata.${index}.buttons`).filter((btn: Dictionary) => { return btn.type === 'URL' })}
                                                                            phonebtn={getValues(`carouseldata.${index}.buttons`).filter((btn: Dictionary) => { return btn.type === 'PHONE' })}
                                                                            isNew={isNew}
                                                                            buttonsType={buttonsType}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <DragDropContext onDragEnd={(results) => handleDragDropCarrusel(results, index)}>
                                                                    <Droppable droppableId="root3" type="group">
                                                                        {(provided) => (
                                                                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '90%' }}>
                                                                                {getValues(`carouseldata.${index}.buttons`)?.map((btn: any, btni: number) => {
                                                                                    return (
                                                                                        <Draggable key={`btn-${btni}`} draggableId={`btn-${btni}`} index={btni} isDragDisabled={!isNew}>
                                                                                            {(provided) => (
                                                                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #9E9E9E', backgroundColor: '#F5F5F5', padding: 5 }}>
                                                                                                        {getValues(`carouseldata.${index}.buttons`).length === 2 && (
                                                                                                            <DragIndicatorIcon style={{ transform: 'rotate(90deg)' }} />
                                                                                                        )}
                                                                                                        {btn.type === 'QUICK_REPLY' ? (
                                                                                                            <>
                                                                                                                <span style={{ fontWeight: 'bold', margin: '6px 0px' }}>{t(langKeys.fastanswer)}</span>
                                                                                                                <div style={{ width: '100%' }}>
                                                                                                                    <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.buttontext)}</span>
                                                                                                                </div>
                                                                                                                <div style={{ display: 'flex', alignItems: 'start', width: '100%', padding: '0px 10px' }}>
                                                                                                                    <div style={{ flex: 1 }}>
                                                                                                                        <SingleLineInput
                                                                                                                            inputProps={{
                                                                                                                                rows: 1,
                                                                                                                                maxRows: 1
                                                                                                                            }}
                                                                                                                            rows={1}
                                                                                                                            maxLength={25}
                                                                                                                            valueDefault={btn?.btn?.text}
                                                                                                                            onInput={(e) => handleQuickReplyCard(e, index, btni)}
                                                                                                                            onChange={(e) => handleQuickReplyCard(e, index, btni)}
                                                                                                                            disabled={!isNew}
                                                                                                                            fregister={{
                                                                                                                                ...register(`carouseldata.${index}.buttons.${btni}.btn.text`, {
                                                                                                                                    validate: (value) =>
                                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                                }),
                                                                                                                            }}
                                                                                                                            style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px', backgroundColor: 'white' }}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                    <IconButton style={{ padding: 0, marginTop: 15 }} disabled={!isNew} onClick={() => onClickRemoveButtonCard(index, btni)}>
                                                                                                                        <ClearIcon />
                                                                                                                    </IconButton>
                                                                                                                </div>
                                                                                                            </>
                                                                                                        ) : btn.type === 'URL' ? (
                                                                                                            <>
                                                                                                                <span style={{ fontWeight: 'bold', margin: '6px 0px' }}>{t(langKeys.calltoaction)}</span>
                                                                                                                <div style={{ width: '100%' }}>
                                                                                                                    <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.buttontext)}</span>
                                                                                                                </div>
                                                                                                                <div style={{ display: 'flex', alignItems: 'start', width: '100%', padding: '0px 10px' }}>
                                                                                                                    <div style={{ flex: 1 }}>
                                                                                                                        <SingleLineInput
                                                                                                                            inputProps={{
                                                                                                                                rows: 1,
                                                                                                                                maxRows: 1
                                                                                                                            }}
                                                                                                                            rows={1}
                                                                                                                            maxLength={25}
                                                                                                                            valueDefault={btn?.btn?.text}
                                                                                                                            onInput={(e) => handleActionButtonTextCard(e, index, btni)}
                                                                                                                            onChange={(e) => handleActionButtonTextCard(e, index, btni)}
                                                                                                                            disabled={!isNew}
                                                                                                                            fregister={{
                                                                                                                                ...register(`carouseldata.${index}.buttons.${btni}.btn.text`, {
                                                                                                                                    validate: (value) =>
                                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                                }),
                                                                                                                            }}
                                                                                                                            style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px', backgroundColor: 'white' }}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                    <IconButton style={{ padding: 0, marginTop: 15 }} disabled={!isNew} onClick={() => onClickRemoveButtonCard(index, btni)}>
                                                                                                                        <ClearIcon />
                                                                                                                    </IconButton>
                                                                                                                </div>
                                                                                                                <div style={{ width: '100%' }}>
                                                                                                                    <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.urltype)}</span>
                                                                                                                </div>
                                                                                                                <div style={{ width: '100%', marginBottom: 20, padding: '0px 10px' }}>
                                                                                                                    <div style={{ backgroundColor: 'white' }}>
                                                                                                                        <FieldSelect
                                                                                                                            data={dataURLType}
                                                                                                                            variant="outlined"
                                                                                                                            optionDesc="text"
                                                                                                                            optionValue="value"
                                                                                                                            valueDefault={btn?.btn?.type}
                                                                                                                            onChange={(value) => {
                                                                                                                                if (value) {
                                                                                                                                    onChangeCardsButton(index, btni, "type", value?.value)
                                                                                                                                } else {
                                                                                                                                    onChangeCardsButton(index, btni, "type", "")
                                                                                                                                }
                                                                                                                            }}
                                                                                                                            disabled={!isNew}
                                                                                                                            fregister={{
                                                                                                                                ...register(`carouseldata.${index}.buttons.${btni}.btn.type`, {
                                                                                                                                    validate: (value) =>
                                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                                }),
                                                                                                                            }}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div style={{ width: '100%', display: 'flex' }}>
                                                                                                                    <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.urlwebsite)}</span>
                                                                                                                </div>
                                                                                                                <div style={{ display: 'flex', width: '100%', alignItems: 'start', padding: '0px 10px' }}>
                                                                                                                    <div style={{ flex: 1 }}>
                                                                                                                        <SingleLineInput
                                                                                                                            inputProps={{
                                                                                                                                rows: 1,
                                                                                                                                maxRows: 1
                                                                                                                            }}
                                                                                                                            rows={1}
                                                                                                                            maxLength={2000}
                                                                                                                            valueDefault={btn?.btn?.url}
                                                                                                                            onInput={(e) => handleActionButtonUrlCard(e, index, btni)}
                                                                                                                            onChange={(e) => handleActionButtonUrlCard(e, index, btni)}
                                                                                                                            disabled={!isNew}
                                                                                                                            fregister={{
                                                                                                                                ...register(`carouseldata.${index}.buttons.${btni}.btn.url`, {
                                                                                                                                    validate: (value) =>
                                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                                }),
                                                                                                                            }}
                                                                                                                            style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px', backgroundColor: 'white' }}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                    {btn?.btn?.type === 'dynamic' && (
                                                                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>{'{{'}1{'}}'}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                                {btn?.btn?.type === 'dynamic' && (
                                                                                                                    <>
                                                                                                                        <div style={{ width: '100%', display: 'flex' }}>
                                                                                                                            <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.addexampletext)}</span>
                                                                                                                        </div>
                                                                                                                        <div style={{ width: '100%', padding: '0px 10px' }}>
                                                                                                                            <div style={{ backgroundColor: 'white' }}>
                                                                                                                                <FieldEdit
                                                                                                                                    variant="outlined"
                                                                                                                                    size="small"
                                                                                                                                    onChange={(value) => {
                                                                                                                                        setValue(`carouseldata.${index}.buttons.${btni}.btn.variables[0]`, value);
                                                                                                                                        trigger('carouseldata')
                                                                                                                                    }}
                                                                                                                                    valueDefault={btn?.btn?.variables[0] || ""}
                                                                                                                                    disabled={!isNew}
                                                                                                                                    fregister={{
                                                                                                                                        ...register(`carouseldata.${index}.buttons.${btni}.btn.variables.${0}`, {
                                                                                                                                            validate: (value) =>
                                                                                                                                                (value && value.length) || t(langKeys.field_required),
                                                                                                                                        }),
                                                                                                                                    }}
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </>
                                                                                                                )}
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <span style={{ fontWeight: 'bold', margin: '6px 0px' }}>{t(langKeys.calltoaction)}</span>
                                                                                                                <div style={{ width: '100%' }}>
                                                                                                                    <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.buttontext)}</span>
                                                                                                                </div>
                                                                                                                <div style={{ display: 'flex', alignItems: 'start', width: '100%', padding: '0px 10px' }}>
                                                                                                                    <div style={{ flex: 1 }}>
                                                                                                                        <SingleLineInput
                                                                                                                            inputProps={{
                                                                                                                                rows: 1,
                                                                                                                                maxRows: 1
                                                                                                                            }}
                                                                                                                            rows={1}
                                                                                                                            maxLength={25}
                                                                                                                            valueDefault={btn?.btn?.text}
                                                                                                                            onInput={(e) => handleActionButtonTextCard(e, index, btni)}
                                                                                                                            onChange={(e) => handleActionButtonTextCard(e, index, btni)}
                                                                                                                            disabled={!isNew}
                                                                                                                            fregister={{
                                                                                                                                ...register(`carouseldata.${index}.buttons.${btni}.btn.text`, {
                                                                                                                                    validate: (value) =>
                                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                                }),
                                                                                                                            }}
                                                                                                                            style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px', backgroundColor: 'white' }}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                    <IconButton style={{ padding: 0, marginTop: 15 }} disabled={!isNew} onClick={() => onClickRemoveButtonCard(index, btni)}>
                                                                                                                        <ClearIcon />
                                                                                                                    </IconButton>
                                                                                                                </div>
                                                                                                                <div style={{ width: '100%' }}>
                                                                                                                    <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.country)}</span>
                                                                                                                </div>
                                                                                                                <div style={{ width: '100%', marginBottom: 20, padding: '0px 10px' }}>
                                                                                                                    <div style={{ backgroundColor: 'white' }}>
                                                                                                                        <FieldSelect
                                                                                                                            data={dataCountryCodes}
                                                                                                                            variant="outlined"
                                                                                                                            optionDesc="text"
                                                                                                                            optionValue="value"
                                                                                                                            valueDefault={btn?.btn?.code}
                                                                                                                            onChange={(value) => {
                                                                                                                                if (value) {
                                                                                                                                    onChangeCardsButton(index, btni, "code", value?.value)
                                                                                                                                } else {
                                                                                                                                    setValue(`carouseldata.${index}.buttons.${btni}.btn.code`, null);
                                                                                                                                    trigger('carouseldata')
                                                                                                                                }
                                                                                                                            }}
                                                                                                                            fregister={{
                                                                                                                                ...register(`carouseldata.${index}.buttons.${btni}.btn.code`, {
                                                                                                                                    validate: (value) =>
                                                                                                                                        (value && value !== 0) || t(langKeys.field_required),
                                                                                                                                }),
                                                                                                                            }}
                                                                                                                            disabled={!isNew}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div style={{ width: '100%' }}>
                                                                                                                    <span style={{ textAlign: 'start', paddingLeft: 10 }}>{t(langKeys.telephonenumber)}</span>
                                                                                                                </div>
                                                                                                                <div style={{ width: '100%', padding: '0px 10px' }}>
                                                                                                                    <FieldEditAdvancedAux
                                                                                                                        inputProps={{
                                                                                                                            rows: 1,
                                                                                                                            maxRows: 1
                                                                                                                        }}
                                                                                                                        rows={1}
                                                                                                                        type="number"
                                                                                                                        maxLength={20}
                                                                                                                        valueDefault={btn?.btn?.phone_number}
                                                                                                                        onInput={(e) => handleActionButtonPhoneCard(e, index, btni)}
                                                                                                                        onChange={(e) => handleActionButtonPhoneCard(e, index, btni)}
                                                                                                                        disabled={!isNew}
                                                                                                                        fregister={{
                                                                                                                            ...register(`carouseldata.${index}.buttons.${btni}.btn.phone_number`, {
                                                                                                                                validate: (value) =>
                                                                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                                                                            }),
                                                                                                                        }}
                                                                                                                        style={{ border: '1px solid #959595', borderRadius: '4px', padding: '8px', backgroundColor: 'white' }}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </Droppable>
                                                                </DragDropContext>
                                                            </div>
                                                        );
                                                    })}
                                                    {(getValues("carouseldata") && getValues('carouseldata').length < 10) && (
                                                        <div
                                                            className={classes.addCard}
                                                            onClick={() => { if (isNew) onClickAddCard() }}
                                                        >
                                                            <AddIcon style={{ color: '#B6B6B6', height: 40, width: 'auto' }} />
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            </div>
                                            {getValues('carouseldata').length > 0 && (
                                                <>
                                                    {getValues('carouseldata').map((card, cindex: number) => {
                                                        return (
                                                            <>
                                                                {card?.bodyvariables?.length > 0 && (
                                                                    <div style={{ marginTop: 10, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <span style={{ fontWeight: 'bold' }}>Texto {cindex + 1}</span>
                                                                            <Button
                                                                                className={classes.button}
                                                                                startIcon={<CloseIcon />}
                                                                                onClick={() => deleteVariableCard(cindex)}
                                                                                disabled={!isNew}
                                                                            >
                                                                                {t(langKeys.deletevariable)}
                                                                            </Button>
                                                                        </div>
                                                                        {getValues(`carouseldata.${cindex}.bodyvariables`).map((cv: Dictionary, vindex: number) => {
                                                                            return (
                                                                                <div key={vindex} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px' }}>
                                                                                    <span>{'{{'}{cv.variable}{'}}'}</span>
                                                                                    <div style={{ backgroundColor: 'white', width: '100%' }}>
                                                                                        <FieldEdit
                                                                                            label={`Introduce contenido para {{${cv.variable}}}`}
                                                                                            variant="outlined"
                                                                                            size="small"
                                                                                            valueDefault={cv.text}
                                                                                            onChange={(value) => {
                                                                                                setValue(`carouseldata.${cindex}.bodyvariables.${vindex}.text`, value)
                                                                                                trigger('carouseldata')
                                                                                            }}
                                                                                            disabled={!isNew}
                                                                                            fregister={{
                                                                                                ...register(`carouseldata.${cindex}.bodyvariables.${vindex}.text`, {
                                                                                                    validate: (value) =>
                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                }),
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                        {getValues(`carouseldata.${cindex}.bodyvariables`).some(cv => cv.text === '') && (
                                                                            <div className={classes.warningContainer}>
                                                                                <WarningIcon style={{ color: '#FF7575' }} />
                                                                                {t(langKeys.addexampletext)}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )
                                                    })}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #B6B6B6', cursor: 'pointer' }}
                                            onClick={() => { if (isNew) onClickAddCard() }}
                                            className="col-4"
                                        >
                                            <AddIcon style={{ color: '#B6B6B6', height: 40, width: 'auto' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    {(getValues("type") === "SMS") && (
                        <div className="row-zyx">
                            <FieldEditMulti
                                className="col-12"
                                disabled={disableInput}
                                error={errors?.body?.message}
                                label={t(langKeys.body)}
                                maxLength={getValues("type") === "SMS" ? 160 : 1024}
                                onChange={(value) => setValue("body", value)}
                                valueDefault={getValues("body")}
                            />
                        </div>
                    )}
                    {(getValues("type") === "MAIL" || getValues("type") === "HTML") && (
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={disableInput}
                                error={errors?.header?.message}
                                label={t(langKeys.subject)}
                                onChange={(value) => setValue("header", value)}
                                valueDefault={getValues("header")}
                            />
                            <FieldSelect
                                className="col-6"
                                data={dataPriority}
                                disabled={disableInput}
                                error={errors?.priority?.message}
                                label={t(langKeys.priority)}
                                onChange={(value) => setValue("priority", value?.value)}
                                optionDesc="text"
                                optionValue="value"
                                valueDefault={getValues("priority")}
                            />
                        </div>
                    )}
                    {getValues("type") === "MAIL" && (
                        <div className="row-zyx">
                            <React.Fragment>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.body)}
                                </Box>
                                <RichText
                                    spellCheck
                                    value={bodyObject}
                                    onChange={(value) => {
                                        setBodyObject(value);
                                    }}
                                    style={{
                                        borderColor: "#762AA9",
                                        borderRadius: "4px",
                                        borderStyle: "solid",
                                        borderWidth: "1px",
                                        padding: "10px",
                                    }}
                                />
                                <FieldEdit
                                    className={classes.headerText}
                                    disabled={true}
                                    error={bodyAlert}
                                    label={""}
                                />
                            </React.Fragment>
                        </div>
                    )}
                    {getValues("type") === "HTML" && (
                        <div className="row-zyx">
                            <Button component="label" disabled={disableInput} variant="contained">
                                <input
                                    accept=".html"
                                    onChange={(e) => onChangeAttachmentTemplate(e.target.files)}
                                    type="file"
                                />
                            </Button>
                            <FieldEdit className={classes.headerText} disabled={true} error={bodyAlert} label={""} />
                        </div>
                    )}
                    {getValues("type") === "HTML" && (
                        <div className="row-zyx">
                            {bodyAttachment && (
                                <React.Fragment>
                                    <MenuItem onClick={() => setHtmlEdit(!htmlEdit)} disabled={disableInput}>
                                        <ListItemIcon color="inherit">
                                            <RefreshIcon
                                                fontSize="small"
                                                style={{
                                                    color: "#7721AD",
                                                    width: 16,
                                                }}
                                            />
                                        </ListItemIcon>
                                        <div style={{ fontSize: 16 }}>
                                            {htmlEdit
                                                ? t(langKeys.messagetemplate_changetoview)
                                                : t(langKeys.messagetemplate_changetoeditor)}
                                        </div>
                                    </MenuItem>
                                    {!htmlEdit ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: bodyAttachment,
                                            }}
                                            style={{
                                                borderColor: "#762AA9",
                                                borderRadius: "4px",
                                                borderStyle: "solid",
                                                borderWidth: "1px",
                                                padding: "20px",
                                            }}
                                        />
                                    ) : (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <CodeMirror
                                                extensions={htmlLoad}
                                                height={"600px"}
                                                value={bodyAttachment}
                                                onChange={(value) => {
                                                    setValue("body", value || "");
                                                    setBodyAttachment(value || "");
                                                }}
                                            />
                                        </Suspense>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    )}
                    {(getValues("type") === "MAIL" || getValues("type") === "HTML") && (
                        <div className="row-zyx">
                            <FieldView label={t(langKeys.messagetemplate_attachment)} />
                            <React.Fragment>
                                <input
                                    accept="file/*"
                                    disabled={disableInput}
                                    id="attachmentInput"
                                    onChange={(e) => onChangeAttachment(e.target.files)}
                                    style={{ display: "none" }}
                                    type="file"
                                />
                                {
                                    <IconButton
                                        disabled={waitUploadFile || disableInput}
                                        onClick={onClickAttachment}
                                        style={{ borderRadius: "0px" }}
                                    >
                                        <AttachFileIcon color="primary" />
                                    </IconButton>
                                }
                                {Boolean(getValues("attachment")) &&
                                    getValues("attachment")
                                        .split(",")
                                        .map((f: string, i: number) => (
                                            <FilePreview
                                                key={`attachment-${i}`}
                                                src={f}
                                                onClose={(f) => handleCleanMediaInput(f)}
                                            />
                                        ))}
                                {waitUploadFile && fileAttachment && (
                                    <FilePreview key={`attachment-x`} src={fileAttachment} />
                                )}
                            </React.Fragment>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

interface FilePreviewProps {
    onClose?: (f: string) => void;
    src: File | string;
}

const useFilePreviewStyles = makeStyles((theme) => ({
    btnContainer: {
        color: "lightgrey",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    root: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        margin: theme.spacing(1),
        maxHeight: 80,
        maxWidth: 300,
        overflow: "hidden",
        padding: theme.spacing(1),
        width: "fit-content",
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes("http"), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = RegExp(/.*\/(.+?)\./).exec(src as string);
            return m && m.length > 1 ? m[1] : "";
        }
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split(".").pop()?.toUpperCase() ?? "-";
        }
        return (src as File).name?.split(".").pop()?.toUpperCase() ?? "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: "0.5em" }} />
            <div className={classes.infoContainer}>
                <div>
                    <div
                        style={{
                            fontWeight: "bold",
                            maxWidth: 190,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {getFileName()}
                    </div>
                    {getFileExt()}
                </div>
            </div>
            <div style={{ width: "0.5em" }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: "10%" }} />}
                {isUrl() && (
                    <a
                        download={`${getFileName()}.${getFileExt()}`}
                        href={src as string}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
};

export default DetailMessageTemplates;