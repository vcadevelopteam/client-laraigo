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
import WarningIcon from '@material-ui/icons/Warning';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import NotificationsIcon from '@material-ui/icons/Notifications';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import CloseIcon from '@material-ui/icons/Close';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import ImageIcon from '@material-ui/icons/Image';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import DescriptionIcon from '@material-ui/icons/Description';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"

import {
    execute,
    uploadFile,
} from "store/main/actions";

import {
    FieldEdit,
    FieldEditMulti,
    FieldSelect,
    FieldView,
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
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import React, { FC, Suspense, useCallback, useEffect, useState } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Save";
import { AddButtonMenu, CustomTitleHelper, MessagePreviewAuthentication, MessagePreviewCarousel, MessagePreviewMultimedia } from "../components/components";

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
        cursor: 'pointer',
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
    uploadImage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #003170',
        borderRadius: 10,
        padding: '2px 20px',
        gap: 8,
        cursor: 'pointer',
        backgroundColor: '#EAF4FF',
    },
    uploadedImage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #003170',
        borderRadius: 10,
        padding: '2px 20px',
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
}));

const DetailMessageTemplates: React.FC<DetailProps> = ({
    data: { row, edit },
    fetchData,
    multiData,
    setViewSelected,
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
            ? multiData[2].data.filter((x) => x.type !== "WHAG" && x.type !== "WHAM")
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
    const [isProvider, setIsProvider] = useState(row?.fromprovider ? true : false);
    const [waitAdd, setWaitAdd] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [bodyObject, setBodyObject] = useState<Descendant[]>(
        row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }]
    );
    const [bodyObjectCar, setBodyObjectCar] = useState<Descendant[]>(
        row?.bodyobjectcar || [{ type: "paragraph", children: [{ text: row?.body || "" }] }]
    );
    const [category, setCategory] = useState(row ? row.category : '')
    const [headerMedia, setHeaderMedia] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isHeaderVariable, setIsHeaderVariable] = useState(false)
    const [bodyVariables, setBodyVariables] = useState<string[]>([])
    const [bubbleVariables, setBubbleVariables] = useState<string[]>([])
    const [addSafetyAdvice, setAddSafetyAdvice] = useState(false)
    const [addLastDateCode, setAddLastDateCode] = useState(false)
    const [cardsVariables, setCardsVariables] = useState<Dictionary[]>([])
    const [authButtonText, setAuthButtonText] = useState('')
    const [expiresValue, setExpiresValue] = useState(0)
    const [validatePeriod, setValidatePeriod] = useState(false)
    
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
        { value: "MAIL", text: t(langKeys.messagetemplate_mail) },
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
        { value: 1, text: `1 ${t(langKeys.minutes)}`},
        { value: 2, text: `2 ${t(langKeys.minutes)}`},
        { value: 3, text: `3 ${t(langKeys.minutes)}`},
        { value: 5, text: `5 ${t(langKeys.minutes)}`},
        { value: 10, text: `10 ${t(langKeys.minutes)}`},
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
            body: row?.body || "",
            buttons: row ? row.buttons || [] : [],
            buttonstext: row ? row.buttonstext || [] : [],
            carouselcards: row ? row.carouselcards || [] : [],
            buttonsenabled: ![null, undefined].includes(row?.buttonsenabled) ? row?.buttonsenabled : false,
            category: row?.category || "",
            communicationchannelid: row?.communicationchannelid || 0,
            communicationchanneltype: row?.communicationchanneltype || "",
            description: row?.description || "",
            exampleparameters: row?.exampleparameters || "",
            externalid: row?.externalid || "",
            externalstatus: row?.externalstatus || "NONE",
            footer: row?.footer || "",
            footerenabled: ![null, undefined].includes(row?.footerenabled) ? row?.footerenabled : false,
            fromprovider: row?.fromprovider || false,
            header: row?.header || "",
            headerenabled: ![null, undefined].includes(row?.headerenabled) ? row?.headerenabled : false,
            headertype: row?.headertype || "none",
            id: row ? row.id : 0,
            integrationid: row?.communicationchannelintegrationid || "",
            language: row?.language || "",
            name: row?.name || "",
            namespace: row?.namespace || "",
            operation: row ? "EDIT" : "INSERT",
            priority: row?.priority || 2,
            servicecredentials: row?.communicationchannelservicecredentials || "",
            status: row?.status || "ACTIVO",
            templatetype: row?.templatetype || "",
            type: row?.type || "",
            typeattachment: row?.typeattachment || "",
        },
    });

    const [templateTypeDisabled, setTemplateTypeDisabled] = useState(["SMS", "MAIL"].includes(getValues("type")));

    const [type] = watch(["type"]);

    React.useEffect(() => {
        register("body");
        register("category");
        register("communicationchannelid");
        register("communicationchanneltype");
        register("exampleparameters");
        register("externalid");
        register("externalstatus");
        register("footer");
        register("fromprovider");
        register("header");
        register("integrationid");
        register("language");
        register("name");
        register("namespace");
        register("servicecredentials");
        register("templatetype");
        register("type");
        register("typeattachment");

        register("body", {
            validate: (value) => {
                if (type === "HSM") return (value && (value || "").length <= 1024) || t(langKeys.field_required);
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
                // register("body", {
                //     validate: (value) => (value && (value || "").length <= 1024) || "" + t(langKeys.validationchar),
                // });
                register("name", {
                    validate: (value) =>
                        (value && (value || "").match("^[a-z0-9_]+$") !== null) || t(langKeys.nametemplate_validation),
                });
                // register("namespace", {
                //     validate: (value) => (value && value.length) || t(langKeys.field_required),
                // });
                if (getValues("headerenabled")) {
                    register("header", {
                        validate: (value) => (value && value.length) || t(langKeys.field_required),
                    });
                }
                if (getValues("footerenabled")) {
                    register("footer", {
                        validate: (value) => (value && value.length) || t(langKeys.field_required),
                    });
                }
                onChangeTemplateType({ value: "" });
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
                // register("body", {
                //     validate: (value) => (value && value.length <= 160) || "" + t(langKeys.validationchar),
                // });
                register("name", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
                onChangeTemplateType({ value: "STANDARD" });
                setTemplateTypeDisabled(true);
                break;
        }

        if (type === "HSM") {
            // register("body", {
            //     validate: (value) => (value && (value || "").length <= 1024) || "" + t(langKeys.validationchar),
            // });

            register("name", {
                validate: (value) =>
                    (value && (value || "").match("^[a-z0-9_]+$") !== null) || t(langKeys.nametemplate_validation),
            });

            // register("namespace", {
            //     validate: (value) => (value && value.length) || t(langKeys.field_required),
            // });

            if (row?.headerenabled) {
                register("header", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
            }

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

            // register("namespace");

            if (type === "SMS") {
                // register("body", {
                //     validate: (value) => (value && value.length <= 160) || "" + t(langKeys.validationchar),
                // });
            } else {
                // register("body", {
                //     validate: (value) => (value && value.length) || t(langKeys.field_required),
                // });
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
                fetchData && fetchData();
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

        if (isNew && isProvider) {
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

                dispatch(addTemplate({ ...data, bodyobject: bodyObject }));
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

                dispatch(execute(insMessageTemplate({ ...data, bodyobject: bodyObject })));
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
    });

    useEffect(() => {
        if (row) {
            if (row.fromprovider && row.communicationchanneltype) {
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

        setValue("communicationchannelid", 0);
        setValue("communicationchanneltype", "");
        setValue("exampleparameters", "");
        setValue("externalid", "");
        setValue("externalstatus", "");
        setValue("fromprovider", false);
        setValue("integrationid", "");
        setValue("servicecredentials", "");
        setValue("type", data?.value || "");
        setValue("category", '');
        setCategory('')

        setBodyVariables([])
        setValue("headertype", "none");
        setHeaderMedia('')
        setIsHeaderVariable(false)
        setSelectedFile(null)
        trigger("headertype");
        setValue('buttons', [])
        setValue('buttonstext', [])
        setValue('carouselcards', [])

        //trigger("body");
        trigger("category");
        trigger("communicationchannelid");
        trigger("communicationchanneltype");
        trigger("exampleparameters");
        trigger("externalid");
        trigger("externalstatus");
        trigger("footer");
        trigger("fromprovider");
        trigger("header");
        trigger("integrationid");
        trigger("language");
        //trigger("name");
        trigger("namespace");
        trigger("servicecredentials");
        trigger("templatetype");
        trigger("type");
        trigger("typeattachment");
    };

    const onChangeTemplateMedia = async () => {
        if (getValues("headerenabled")) {
            register("header", {
                validate: (value) => (value && value.length) || t(langKeys.field_required),
            });
        } else {
            register("header");
        }

        if (getValues("footerenabled")) {
            register("footer", {
                validate: (value) => (value && value.length) || t(langKeys.field_required),
            });
        } else {
            register("footer");
        }

        trigger("footer");
        trigger("footerenabled");
        trigger("header");
        trigger("headerenabled");
    };

    const onChangeTemplateType = async (data: Dictionary) => {
        setValue("templatetype", data?.value || "");
        trigger("templatetype");

        setBodyObject(row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }])
        setBodyObjectCar(row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }])
        setValue('header', '')
        setValue('footer', '')
        setValue('buttons', [])
        setValue('buttonstext', [])
        setValue("headertype", "none");
        setValue('carouselcards', [])
        trigger('carouselcards');
        trigger("headertype");
        trigger("header");
        trigger("footer");
        trigger('buttons');
        trigger('buttonstext');
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
        setValue("headertype", data?.value || "");
        setHeaderMedia('')
        setIsHeaderVariable(false)
        setValue('header', '')
        trigger("header")
        trigger("headertype");
    };

    const onChangeButton = (index: number, param: string, value: string) => {
        setValue(`buttons.${index}.btn.${param}`, value);
        trigger('buttons')
    };
    const onChangeButtonText = (index: number, param: string, value: string) => {
        setValue(`buttonstext.${index}.${param}`, value);
        trigger('buttonstext')
    };
    const onChangeCardsButton = (cindex: number, bindex: number, param: string, value: string, buttontype: string) => {
        setValue(`carouselcards.${cindex}.buttons${buttontype}.${bindex}.${param}`, value);
        trigger('carouselcards')
    }

    const onClickAddButton = async () => {
        if (getValues("buttons") && getValues("buttons").filter((btn: Dictionary) => {return btn.type === 'link'}).length < 2) {
            setValue("buttons", [...getValues("buttons"), { type: 'link', btn: { text: "", type: "", url: "", variable: "" } }]);
        }
        trigger("buttons");
    };
    const onClickAddButtonText = async () => {
        if (getValues("buttonstext") && getValues("buttonstext").length < 7) {
            setValue("buttonstext", [...getValues("buttonstext"), { text: "" }]);
        }
        trigger("buttonstext");
    };
    const onClickAddButtonPhone = async () => {
        if (getValues("buttons") && getValues("buttons").filter((btn: Dictionary) => {return btn.type === 'phone'}).length < 1) {
            setValue("buttons", [...getValues("buttons"), { type: 'phone', btn: { text: "", code: "", number: "" } }]);
        }
        trigger("buttons");
    };
    const onClickAddCard = async () => {
        if(getValues("carouselcards") && getValues('carouselcards').length < 10) {
            setValue('carouselcards', [...getValues('carouselcards'), { image: null, body: '', buttonstext: [], buttonslink: [], buttonsphone: [] }])
        }
        trigger("carouselcards");
    }
    const onClickAddButtonTCard = async (index: number) => {
        const currentCards = getValues('carouselcards');
        if (currentCards && currentCards.length > index) {
            const updatedCards = currentCards.map((card:Dictionary, i:number) => {
                if (i === index) {
                    return {
                        ...card,
                        buttonstext: [...card.buttonstext, {text: ''}]
                    };
                }
                return card;
            });
            setValue('carouselcards', updatedCards);
            trigger('carouselcards');
        }
    }
    const onClickAddButtonLCard = async (index: number) => {
        const currentCards = getValues('carouselcards');
        if (currentCards && currentCards.length > index) {
            const updatedCards = currentCards.map((card:Dictionary, i:number) => {
                if (i === index) {
                    return {
                        ...card,
                        buttonslink: [...card.buttonslink, { text: "", type: "", url: "" }]
                    };
                }
                return card;
            });
            setValue('carouselcards', updatedCards);
            trigger('carouselcards');
        }
    }
    const onClickAddButtonPCard = async (index: number) => {
        const currentCards = getValues('carouselcards');
        if (currentCards && currentCards.length > index) {
            const updatedCards = currentCards.map((card:Dictionary, i:number) => {
                if (i === index) {
                    return {
                        ...card,
                        buttonsphone: [...card.buttonsphone, { text: "", code: "", number: "" }]
                    };
                }
                return card;
            });
            setValue('carouselcards', updatedCards);
            trigger('carouselcards');
        }
    }
    const onClickRemoveTButtonCard = async (cindex: number, bindex: number) => {
        const buttonstext = getValues(`carouselcards.${cindex}.buttonstext`);

        if (buttonstext && buttonstext.length > 0) {
            unregister(`carouselcards.${cindex}.buttonstext.${bindex}`);
            setValue(
                `carouselcards.${cindex}.buttonstext`,
                buttonstext.filter((x: any, i: number) => i !== bindex)
            );
        }
    }
    const onClickRemoveLButtonCard = async (cindex: number, bindex: number) => {
        const buttonslink = getValues(`carouselcards.${cindex}.buttonslink`);

        if (buttonslink && buttonslink.length > 0) {
            unregister(`carouselcards.${cindex}.buttonslink.${bindex}`);
            setValue(
                `carouselcards.${cindex}.buttonslink`,
                buttonslink.filter((x: any, i: number) => i !== bindex)
            );
        }
    }
    const onClickRemovePButtonCard = async (cindex: number, bindex: number) => {
        const buttonsphone = getValues(`carouselcards.${cindex}.buttonsphone`);

        if (buttonsphone && buttonsphone.length > 0) {
            unregister(`carouselcards.${cindex}.buttonsphone.${bindex}`);
            setValue(
                `carouselcards.${cindex}.buttonsphone`,
                buttonsphone.filter((x: any, i: number) => i !== bindex)
            );
        }
    }

    const onClickRemoveCard = async (index: number) => {
        const cards = getValues('carouselcards');

        if (cards && cards.length > 0) {
            unregister(`carouselcards.${index}`);
            setValue(
                'carouselcards',
                cards.filter((x: any, i: number) => i !== index)
            )
        }
    }
    const onClickRemoveButton = async (index: number) => {
        const btns = getValues("buttons");

        if (btns && btns.length > 0) {
            unregister(`buttons.${index}`);
            setValue(
                "buttons",
                btns.filter((x: any, i: number) => i !== index)
            );
        }
    };
    const onClickRemoveButtonText = async (index: number) => {
        const btns = getValues("buttonstext");

        if (btns && btns.length > 0) {
            unregister(`buttonstext.${index}`);
            setValue(
                "buttonstext",
                btns.filter((x: any, i: number) => i !== index)
            );
        }
    };

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
            setValue("category", "");
        }

        if (value) {
            setIsProvider(true);

            setValue("communicationchannelid", value.communicationchannelid);
            setValue("communicationchanneltype", value.type);
            setValue("exampleparameters", "");
            setValue("externalid", "");
            setValue("externalstatus", "PENDING");
            setValue("fromprovider", true);
            setValue("integrationid", value.integrationid);
            setValue("servicecredentials", value.servicecredentials);

            if (value.type === "WHAT") {
                setDisableNamespace(false);
            } else {
                setDisableNamespace(true);
                setValue("namespace", "-");
            }
        } else {
            setIsProvider(false);

            setValue("communicationchannelid", 0);
            setValue("communicationchanneltype", "");
            setValue("exampleparameters", "");
            setValue("externalid", "");
            setValue("externalstatus", "NONE");
            setValue("fromprovider", false);
            setValue("integrationid", "");
            setValue("servicecredentials", "");

            setDisableNamespace(false);
        }

        trigger("body");
        trigger("category");
        trigger("communicationchannelid");
        trigger("communicationchanneltype");
        trigger("exampleparameters");
        trigger("externalid");
        trigger("externalstatus");
        trigger("footer");
        trigger("fromprovider");
        trigger("header");
        trigger("integrationid");
        trigger("language");
        trigger("name");
        trigger("namespace");
        trigger("servicecredentials");
        trigger("templatetype");
        trigger("type");
        trigger("typeattachment");
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const changeCategory = (categoryText: string) => {
        setCategory(categoryText)
        setValue('category', categoryText)

        setBodyObject(row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }])
        setBodyObjectCar(row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }])
        setValue('footer', '')
        trigger('footer')
        setBodyVariables([])
        setValue("headertype", "none");
        setHeaderMedia('')
        setIsHeaderVariable(false)
        setSelectedFile(null)
        trigger("headertype");
        setValue('buttons', [])
        setValue('buttonstext', [])
        setValue('carouselcards', [])
        setAddSafetyAdvice(false)
        setAddLastDateCode(false)
        setExpiresValue(0)
        setAuthButtonText('')
        setValidatePeriod(false)
    }

    const handleImageRemove = (index: number) => {
        const newCards = [...getValues("carouselcards")];
        newCards[index].image = null;
        setValue(`carouselcards.${index}.image`, null);
        trigger('carouselcards')
    };

    const handleFileChangeAux = (event, index: number) => {
        const file = event.target.files[0];
        if (file) {
            setValue(`carouselcards.${index}.image`, file)
            trigger('carouselcards')
        }
    };
    
    const handleDragDrop = (results) => {
        const {source, destination, type} = results;
        if(!destination) return;
        if(source.droppableId === destination.droppableId && source.index === destination.index) return;
        if(type === 'group'){
            const reorderedItems = [...getValues('buttonstext')];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedStore] = reorderedItems.splice(sourceIndex, 1);
            reorderedItems.splice(destinationIndex, 0, removedStore);

            setValue('buttonstext', reorderedItems)
            trigger('buttonstext')
        }
    }

    const handleDragDropAux = (results) => {
        const {source, destination, type} = results;
        if(!destination) return;
        if(source.droppableId === destination.droppableId && source.index === destination.index) return;
        if(type === 'group'){
            const reorderedItems = [...getValues('buttons')];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedStore] = reorderedItems.splice(sourceIndex, 1);
            reorderedItems.splice(destinationIndex, 0, removedStore);

            setValue('buttons', reorderedItems)
            trigger('buttons')
        }
    }

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
                    <div className='row-zyx' style={{display: 'flex', flexDirection: 'column'}}>
                        <span style={{fontWeight: 'bold', fontSize: 20}}>{t(langKeys.messagetype)}</span>
                        <span>{t(langKeys.messagetypetext)}</span>
                    </div>
                    <div className="row-zyx" style={{display: 'flex', alignItems: 'center'}}>
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
                        />
                        {getValues("type") === '' && (
                            <div className="col-4">
                                <div className={classes.warningContainer} style={{width: 220}}>
                                    <WarningIcon style={{color: '#FF7575'}}/>
                                    Selecciona una opción
                                </div>
                            </div>
                        )}
                    </div>
                    {getValues("type") === 'HSM' && (
                        <>
                            <div className='row-zyx' style={{borderBottom: '1px solid black', paddingBottom: 10}}>
                                <span style={{fontWeight: 'bold', fontSize: 20}}>{`${t(langKeys.configuration)} ${t(langKeys.template)}`}</span>
                            </div>
                            <div className='row-zyx' style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{fontWeight: 'bold', fontSize: 20}}>{t(langKeys.category)}</span>
                                <span>Elige la categoría que mejor describa tu plantilla de mensaje.</span>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', gap: '0.5rem'}}>
                                <div className={classes.categoryOption} onClick={() => changeCategory('MARKETING')}>
                                    <input type="checkbox" checked={category === 'MARKETING'} className={classes.checkbox}/>
                                    <VolumeUpIcon style={{marginLeft: 10, marginRight: 10}}/>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <span style={{fontWeight: 'bold', fontSize: 18}}>Marketing</span>
                                        <span>Envía promociones o información sobre tus productos, servicios o negocio.</span>
                                    </div>
                                </div>
                                <div className={classes.categoryOption} onClick={() => changeCategory('UTILITY')}>
                                    <input type="checkbox" checked={category === 'UTILITY'} className={classes.checkbox}/>
                                    <NotificationsIcon style={{marginLeft: 10, marginRight: 10}}/>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <span style={{fontWeight: 'bold', fontSize: 18}}>Utilidad</span>
                                        <span>Envía mensajes sobre un pedido o cuenta existentes.</span>
                                    </div>
                                </div>
                                <div className={classes.categoryOption} onClick={() => changeCategory('AUTHENTICATION')}>
                                    <input type="checkbox" checked={category === 'AUTHENTICATION'} className={classes.checkbox}/>
                                    <VpnKeyIcon style={{marginLeft: 10, marginRight: 10}}/>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <span style={{fontWeight: 'bold', fontSize: 18}}>Autenticación</span>
                                        <span>Envía códigos para verificar una transacción o un inicio de sesión.</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="row-zyx">
                        {(getValues("type") !== "HSM" && getValues("type") !== '') && (
                            <FieldSelect
                                className="col-6"
                                data={dataCategory}
                                disabled={disableInput}
                                error={errors?.category?.message}
                                label={t(langKeys.category)}
                                onChange={(value) => setValue("category", value?.domainvalue)}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                valueDefault={getValues("category")}
                            />
                        )}
                    </div>
                    {getValues("type") === "HSM" && (
                        <div style={{display: 'flex', marginBottom: 10}}>
                            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                <span style={{fontWeight: 'bold'}}>{t(langKeys.name)}</span>
                                <span>Asigna un nombre a la plantilla de mensaje</span>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                <span style={{fontWeight: 'bold'}}>{t(langKeys.language)}</span>
                                <span>Elige idiomas para tu plantilla de mensaje</span>
                            </div>
                        </div>
                    )}
                    <div className="row-zyx" style={{marginBottom: 0}}>
                        {getValues('type') !== '' &&(
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
                                            if(value) {
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
                                        data={dataLanguage}
                                        disabled={disableInput}
                                        error={errors?.language?.message}
                                        onChange={(value) => {
                                            if(value) {
                                                setValue("language", value.domainvalue)
                                                trigger("language")
                                            } else {
                                                setValue("language", '')
                                                trigger("language")
                                            }
                                        }}
                                        optionDesc="domaindesc"
                                        optionValue="domainvalue"
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
                        <div style={{display: 'flex', marginBottom: 10}}>
                            {getValues("category") !== 'AUTHENTICATION' && (
                                <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                    <span style={{fontWeight: 'bold'}}>{t(langKeys.templatetype)}</span>
                                    <span>Seleccione el tipo de plantilla que utilizarás</span>
                                </div>
                            )}
                            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                <span style={{fontWeight: 'bold'}}>{t(langKeys.channel)}</span>
                                <span>Seleccione el canal en el que registrarás tu plantilla</span>
                            </div>
                        </div>
                    )}
                    <div className="row-zyx">
                        {getValues("type") !== '' && (
                            <>
                                {getValues("category") !== 'AUTHENTICATION' && (
                                    <FieldSelect
                                        className="col-6"
                                        data={getValues("type") !== 'HSM' ? dataTemplateType : dataTemplateType.filter((x: Dictionary) => {return x.value !== 'STANDARD'})}
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
                            </>
                        )}
                    </div>
                    {getValues("type") === 'HSM' &&
                    (getValues('name') !== '' && getValues('language') !== '' && getValues('templatetype') === 'MULTIMEDIA' && (getValues('category') === 'UTILITY' || getValues('category') === 'MARKETING')) && (
                        <div>
                            <div className='row-zyx' style={{borderBottom: '1px solid black', paddingBottom: 10}}>
                                <span className={classes.title}>{t(langKeys.templateedition)}</span>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={{flex: 1, display: 'flex', flexDirection: 'column', paddingRight: 20, maxWidth: '50%'}}>
                                    <span className={classes.title}>{t(langKeys.heading)}</span>
                                    <span style={{marginBottom: 10}}>Añade un título o elige qué tipo de contenido usarás para este encabezado.</span>
                                    <div style={{display: 'flex', gap: 10}}>
                                        <div style={{width: 180, marginBottom: 20}}>
                                            <FieldSelect
                                                data={dataHeaderType}
                                                onChange={onChangeHeaderType}
                                                optionDesc="text"
                                                optionValue="value"
                                                valueDefault={getValues("headertype")}
                                                variant="outlined"
                                            />
                                        </div>
                                        {getValues('headertype') === 'text' && (
                                            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                                                <FieldEdit
                                                    variant="outlined"
                                                    size="small"
                                                    maxLength={60}
                                                    valueDefault={getValues('header')}
                                                    onChange={(value) => {
                                                        setValue('header', value)
                                                        trigger('header')
                                                    }}
                                                />
                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                                                    <Button
                                                        className={classes.button}
                                                        startIcon={isHeaderVariable ? <ClearIcon /> : <AddIcon />}
                                                        onClick={() => setIsHeaderVariable(!isHeaderVariable)}
                                                    >
                                                        {isHeaderVariable ? t(langKeys.deletevariable) : t(langKeys.addvariable)}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {getValues('headertype') === 'text' && isHeaderVariable && (
                                        <div style={{marginBottom: 20, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column'}}>
                                            <span style={{fontWeight: 'bold'}}>Ejemplos de contenido del encabezado</span>
                                            <div style={{display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px'}}>
                                                <span>{'{{'}1{'}}'}</span>
                                                <div style={{backgroundColor: 'white', width: '100%'}}>
                                                    <FieldEdit
                                                        variant="outlined"
                                                        size="small"
                                                        maxLength={60}
                                                        valueDefault={getValues('header')}
                                                        onChange={(value) => {
                                                            setValue('header', value)
                                                            trigger('header')
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className={classes.warningContainer}>
                                                <WarningIcon style={{color: '#FF7575'}}/>
                                                {t(langKeys.addexampletext)}
                                            </div>
                                        </div>
                                    )}
                                    {getValues('headertype') === 'multimedia' && (
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <div style={{display: 'flex', gap: 20, marginBottom: 20}}>
                                                <div className={headerMedia === 'image' ? classes.headerOptionSelected : classes.headerOption} onClick={() => {
                                                    setHeaderMedia('image')
                                                    setSelectedFile(null)
                                                }}>
                                                    <div style={{ position: 'relative', marginRight: 10 }}>
                                                        <input type="checkbox" checked={headerMedia === 'image'} className={classes.checkboxHeadOption}/>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <ImageIcon style={{ height: 80, width: 'auto', color: headerMedia === 'image' ? '#0E60A0' : '#9B9B9B' }} />
                                                        <span style={{ textAlign: 'center', color: headerMedia === 'image' ? '#0E60A0' : '' }}>{t(langKeys.image)}</span>
                                                    </div>
                                                </div>
                                                <div className={headerMedia === 'video' ? classes.headerOptionSelected : classes.headerOption} onClick={() => {
                                                    setHeaderMedia('video')
                                                    setSelectedFile(null)
                                                }}>
                                                    <div style={{ position: 'relative', marginRight: 10 }}>
                                                        <input type="checkbox" checked={headerMedia === 'video'} className={classes.checkboxHeadOption} />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <PlayCircleFilledIcon style={{ height: 80, width: 'auto', color: headerMedia === 'video' ? '#0E60A0' : '#9B9B9B' }} />
                                                        <span style={{ textAlign: 'center', color: headerMedia === 'video' ? '#0E60A0' : '' }}>{t(langKeys.video)}</span>
                                                    </div>
                                                </div>
                                                <div className={headerMedia === 'document' ? classes.headerOptionSelected : classes.headerOption} onClick={() => {
                                                    setHeaderMedia('document')
                                                    setSelectedFile(null)
                                                }}>
                                                    <div style={{ position: 'relative', marginRight: 10 }}>
                                                        <input type="checkbox" checked={headerMedia === 'document'} className={classes.checkboxHeadOption} />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <DescriptionIcon style={{ height: 80, width: 'auto', color: headerMedia === 'document' ? '#0E60A0' : '#9B9B9B' }} />
                                                        <span style={{ textAlign: 'center', color: headerMedia === 'document' ? '#0E60A0' : '' }}>{t(langKeys.document)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {headerMedia !== '' && (
                                                <div style={{marginBottom: 20, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column'}}>
                                                    <span style={{fontWeight: 'bold'}}>Ejemplos de contenido del encabezado</span>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px'}}>
                                                        {t(langKeys[headerMedia])}
                                                        {(headerMedia === 'image' || headerMedia === 'video') && (
                                                            <input
                                                                type="file"
                                                                accept={headerMedia === 'image' ? '.jpg,.png' : headerMedia === 'video' ? '.mp4' : ''}
                                                                onChange={handleFileChange}
                                                                style={{ display: 'none' }}
                                                                id="fileInput"
                                                            />
                                                        )}
                                                        {!selectedFile ? (
                                                            <label htmlFor="fileInput">
                                                                <Button
                                                                    startIcon={<ImageIcon/>}
                                                                    variant="outlined"
                                                                    style={{backgroundColor: '#F5F5F5'}}
                                                                    component="span" // Esto es necesario para que el botón funcione como un input de tipo file
                                                                >
                                                                    {headerMedia === 'image' ? (selectedFile ? 'Elegir otro archivo JPG o PNG' : 'Elegir archivo JPG o PNG'): headerMedia === 'video' ? 'Elegir archivo MP4' : 'Elegir un documento'}
                                                                </Button>
                                                            </label>
                                                        ) : (
                                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                                <div style={{padding: 10, border: '1px solid #888888', borderRadius: 4, width: 'fit-content', maxWidth: '100%'}}>
                                                                    {selectedFile.name}
                                                                </div>
                                                                <IconButton onClick={() => setSelectedFile(null)}>
                                                                    <ClearIcon />
                                                                </IconButton>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!selectedFile && (
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
                                    <span style={{marginBottom: 5}}>Introduce el texto de tu mensaje en el idioma que has seleccionado.</span>
                                    <React.Fragment>
                                        <RichText
                                            spellCheck
                                            emoji={true}
                                            value={bodyObject}
                                            onChange={(value) => {
                                                setBodyObject(value);
                                            }}
                                            positionEditable="top"
                                            style={{
                                                borderColor: "#762AA9",
                                                borderRadius: "4px",
                                                borderStyle: "solid",
                                                borderWidth: "1px",
                                                padding: "10px",
                                            }}
                                        />
                                    </React.Fragment>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                                        {bodyVariables.length < 20 &&(
                                            <Button
                                                className={classes.button}
                                                startIcon={<AddIcon />}
                                                onClick={() => setBodyVariables([...bodyVariables, ''])}
                                            >
                                                {t(langKeys.addvariable)}
                                            </Button>
                                        )}
                                        <Button
                                            className={classes.button}
                                            startIcon={<CloseIcon />}
                                            onClick={() => setBodyVariables(bodyVariables.slice(0,-1))}
                                        >
                                            {t(langKeys.deletevariable)}
                                        </Button>
                                    </div>
                                    {bodyVariables.length > 0 && (
                                        <div style={{marginTop: 10, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column'}}>
                                            <span style={{fontWeight: 'bold'}}>{t(langKeys.text)}</span>
                                            {bodyVariables.map((v: string, index: number) => {
                                                return (
                                                    <div key={index} style={{display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px'}}>
                                                        <span>{'{{'}{index + 1}{'}}'}</span>
                                                        <div style={{backgroundColor: 'white', width: '100%'}}>
                                                            <FieldEdit
                                                                variant="outlined"
                                                                size="small"
                                                                valueDefault={v}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className={classes.warningContainer}>
                                                <WarningIcon style={{color: '#FF7575'}}/>
                                                {t(langKeys.addexampletext)}
                                            </div>
                                        </div>
                                    )}
                                    <span className={classes.title} style={{marginTop: 20}}>{t(langKeys.footer)}</span>
                                    <span style={{marginBottom: 5}}>Añade una breve línea de texto en la parte inferior de tu plantilla de mensaje.</span>
                                    <FieldEditMulti
                                        error={errors?.footer?.message}
                                        maxLength={60}
                                        onChange={(value) => {
                                            setValue("footer", value)
                                            trigger('footer')
                                        }}
                                        rows={2}
                                        valueDefault={getValues("footer")}
                                    />
                                    <span className={classes.title}>{t(langKeys.buttons)}</span>
                                    <span style={{marginBottom: 5}}>Crea botones que permitan a los clientes responder a tu mensaje o llevar a cabo alguna acción.</span>
                                    <div style={{display: 'flex'}}>
                                        {(getValues("buttons")?.length + getValues("buttonstext")?.length) < 10 && (
                                            <div>
                                                <AddButtonMenu fastAnswer={onClickAddButtonText} urlWeb={onClickAddButton} callNumber={onClickAddButtonPhone} textbtn={getValues('buttonstext')} urlbtn={getValues('buttons').filter((btn: Dictionary) => { return btn.type === 'link'})} phonebtn={getValues('buttons').filter((btn: Dictionary) => { return btn.type === 'phone'})}/>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 10}}>
                                        <EmojiObjectsIcon />
                                        <span style={{marginLeft: 10}}>Si añades más de tres botones, se mostrarán en una lista</span>
                                    </div>
                                    <DragDropContext onDragEnd={handleDragDrop}>
                                        {getValues('buttonstext')?.length > 0 && (
                                            <div className="row-zyx" style={{display: 'flex', flexDirection: 'column', padding: 10, border: '1px solid #B4B4B4', borderRadius: 5, gap: '1rem'}}>
                                                <div style={{display: 'flex', padding: '10px 0px 0px 20px'}}>
                                                    <ImportExportIcon style={{color: '#0049CF'}} />
                                                    <span style={{fontWeight: 'bold'}}>{t(langKeys.fastanswer)}</span>
                                                </div>
                                                <React.Fragment>
                                                    <Droppable droppableId="root" type="group">
                                                        {(provided) => (
                                                            <div {...provided.droppableProps} ref={provided.innerRef} style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                                                                {getValues("buttonstext")?.map((btn: any, i: number) => {
                                                                    return (
                                                                        <Draggable key={`btn-${i}`} draggableId={`btn-${i}`} index={i}>
                                                                            {(provided) => (
                                                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                                                    <div style={{display: 'flex', padding: '20px 15px', backgroundColor: '#F8F8F8', border: '1px solid #ADADAD', borderRadius: 5, alignItems: 'center', gap: 5}}>
                                                                                        <DragIndicatorIcon />
                                                                                        <div style={{flex: 1}}>
                                                                                            <FieldEdit
                                                                                                disabled={disableInput}
                                                                                                label={t(langKeys.buttontext)}
                                                                                                error={errors?.buttonstext?.[i]?.text?.message}
                                                                                                onChange={(value) => onChangeButtonText(i, "text", value)}
                                                                                                valueDefault={btn?.text || ""}
                                                                                                variant="outlined"
                                                                                                maxLength={25}
                                                                                                fregister={{
                                                                                                    ...register(`buttonstext.${i}.text`, {
                                                                                                        validate: (value) =>
                                                                                                            (value && value.length) || t(langKeys.field_required),
                                                                                                    }),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <IconButton onClick={() => onClickRemoveButtonText(i)}>
                                                                                            <CloseIcon/>
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
                                    <DragDropContext onDragEnd={handleDragDropAux}>
                                        {getValues('buttons')?.length > 0 && (
                                            <div className="row-zyx" style={{display: 'flex', flexDirection: 'column', padding: 10, border: '1px solid #B4B4B4', borderRadius: 5, gap: '1rem'}}>
                                                <div style={{display: 'flex', padding: '10px 0px 0px 20px'}}>
                                                    <ImportExportIcon style={{color: '#0049CF'}} />
                                                    <span style={{fontWeight: 'bold'}}>{t(langKeys.calltoaction)}</span>
                                                </div>
                                                <React.Fragment>
                                                    <Droppable droppableId="root2" type="group">
                                                        {(provided) => (
                                                            <div {...provided.droppableProps} ref={provided.innerRef} style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                                                                {getValues("buttons")?.map((btn: any, i: number) => {
                                                                    return (
                                                                        <Draggable key={`btn-${i}`} draggableId={`btn-${i}`} index={i}>
                                                                            {(provided) => (
                                                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                                                    {btn.type === 'link' ? (
                                                                                        <>
                                                                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                                                                <DragIndicatorIcon />
                                                                                                <div style={{display: 'flex', padding: '20px 15px 5px 15px', backgroundColor: '#F8F8F8', border: '1px solid #ADADAD', borderRadius: 5, flex: 1, gap: 7}}>
                                                                                                    <div className="row-zyx" style={{width: '100%', marginBottom: 0, display: 'flex', alignItems: 'center'}}>
                                                                                                        <FieldEdit
                                                                                                            className='col-4'
                                                                                                            label={t(langKeys.buttontext)}
                                                                                                            error={errors?.buttons?.[i]?.btn?.text?.message}
                                                                                                            onChange={(value) => onChangeButton(i, "text", value)}
                                                                                                            valueDefault={btn?.btn?.text || ""}
                                                                                                            variant="outlined"
                                                                                                            maxLength={25}
                                                                                                            fregister={{
                                                                                                                ...register(`buttons.${i}.btn.text`, {
                                                                                                                    validate: (value) =>
                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                }),
                                                                                                            }}
                                                                                                            size="small"
                                                                                                        />
                                                                                                        <FieldSelect
                                                                                                            className={btn?.btn?.type === 'dynamic' ? 'col-3' : 'col-4'}
                                                                                                            data={dataURLType}
                                                                                                            label={t(langKeys.urltype)}
                                                                                                            error={errors?.buttons?.[i]?.btn?.type?.message}
                                                                                                            onChange={(value) => onChangeButton(i, "type", value?.value)}
                                                                                                            optionDesc="text"
                                                                                                            optionValue="value"
                                                                                                            valueDefault={btn?.btn?.type || ""}
                                                                                                            variant="outlined"
                                                                                                            fregister={{
                                                                                                                ...register(`buttons.${i}.btn.type`, {
                                                                                                                    validate: (value) =>
                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                }),
                                                                                                            }}
                                                                                                        />
                                                                                                        <FieldEdit
                                                                                                            className='col-4'
                                                                                                            label={t(langKeys.urlwebsite)}
                                                                                                            error={errors?.buttons?.[i]?.btn?.url?.message}
                                                                                                            onChange={(value) => onChangeButton(i, "url", value)}
                                                                                                            valueDefault={btn?.btn?.url || ""}
                                                                                                            variant="outlined"
                                                                                                            fregister={{
                                                                                                                ...register(`buttons.${i}.btn.url`, {
                                                                                                                    validate: (value) =>
                                                                                                                        (value && value.length) || t(langKeys.field_required),
                                                                                                                }),
                                                                                                            }}
                                                                                                            size="small"
                                                                                                        />
                                                                                                        {btn?.type === 'dynamic' && (
                                                                                                            <div className="col-1">
                                                                                                                <span>{'{{'}1{'}}'}</span>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <IconButton onClick={() => onClickRemoveButton(i)}>
                                                                                                    <CloseIcon/>
                                                                                                </IconButton>
                                                                                            </div>
                                                                                            {btn?.btn?.type === 'dynamic' && (
                                                                                                <div style={{marginTop: 20, backgroundColor: '#F1F1F1', padding: 15, display: 'flex', flexDirection: 'column'}}>
                                                                                                    <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
                                                                                                        <span>{'{{'}1{'}}'}</span>
                                                                                                        <div style={{backgroundColor: 'white', width: '100%'}}>
                                                                                                            <FieldEdit
                                                                                                                variant="outlined"
                                                                                                                size="small"
                                                                                                                onChange={(value) => onChangeButton(i, "variable", value)}
                                                                                                                valueDefault={btn?.btn?.variable || ""}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className={classes.warningContainer}>
                                                                                                        <WarningIcon style={{color: '#FF7575'}}/>
                                                                                                        {t(langKeys.addexampletext)}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    ) : (
                                                                                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                                                            <DragIndicatorIcon />
                                                                                            <div style={{display: 'flex', padding: '20px 15px 5px 15px', backgroundColor: '#F8F8F8', border: '1px solid #ADADAD', borderRadius: 5, flex: 1, gap: 7}}>
                                                                                                <div className="row-zyx" style={{width: '100%', marginBottom: 0}}>
                                                                                                    <FieldEdit
                                                                                                        className='col-4'
                                                                                                        label={t(langKeys.buttontext)}
                                                                                                        error={errors?.buttons?.[i]?.btn?.text?.message}
                                                                                                        onChange={(value) => onChangeButton(i, "text", value)}
                                                                                                        valueDefault={btn?.btn?.text || ""}
                                                                                                        variant="outlined"
                                                                                                        maxLength={25}
                                                                                                        fregister={{
                                                                                                            ...register(`buttons.${i}.btn.text`, {
                                                                                                                validate: (value) =>
                                                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                                                            }),
                                                                                                        }}
                                                                                                        size="small"
                                                                                                    />
                                                                                                    <FieldSelect
                                                                                                        className='col-4'
                                                                                                        data={dataURLType}
                                                                                                        label={t(langKeys.country)}
                                                                                                        error={errors?.buttons?.[i]?.btn?.code?.message}
                                                                                                        onChange={(value) => onChangeButton(i, "code", value?.value)}
                                                                                                        optionDesc="text"
                                                                                                        optionValue="value"
                                                                                                        valueDefault={btn?.btn?.code || ""}
                                                                                                        variant="outlined"
                                                                                                        fregister={{
                                                                                                            ...register(`buttons.${i}.btn.code`, {
                                                                                                                validate: (value) =>
                                                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                                                            }),
                                                                                                        }}
                                                                                                    />
                                                                                                    <FieldEdit
                                                                                                        className='col-4'
                                                                                                        type="number"
                                                                                                        label={t(langKeys.telephonenumber)}
                                                                                                        error={errors?.buttons?.[i]?.btn?.number?.message}
                                                                                                        onChange={(value) => onChangeButton(i, "number", value)}
                                                                                                        valueDefault={btn?.btn?.number || ""}
                                                                                                        variant="outlined"
                                                                                                        fregister={{
                                                                                                            ...register(`buttons.${i}.btn.number`, {
                                                                                                                validate: (value) =>
                                                                                                                    (value && value.length) || t(langKeys.field_required),
                                                                                                            }),
                                                                                                        }}
                                                                                                        size="small"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <IconButton onClick={() => onClickRemoveButton(i)}>
                                                                                                <CloseIcon/>
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
                                </div>
                                <div style={{flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 20}}>
                                    <span className={classes.title}>{t(langKeys.messagepreview)}</span>
                                    <span style={{marginBottom: 10}}>Vista previa del mensaje configurado a enviar</span>
                                    <div style={{height: 'fit-content', width: '100%', border: '1px solid black'}}>
                                        <MessagePreviewMultimedia
                                            headerType={getValues('headertype')}
                                            header={getValues('header')}
                                            selectedFile={selectedFile}
                                            bodyObject={bodyObject}
                                            footer={getValues('footer')}
                                            buttonstext={getValues('buttonstext').map((btn: Dictionary) => { return btn.text })}
                                            buttonslink={getValues('buttons').map((btn: Dictionary) => { return { type: btn.type, text: btn.btn.text } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {(getValues("type") === 'HSM' && getValues('category') === 'AUTHENTICATION' && getValues('name') !== '' && getValues('language') !== '') && (
                        <div>
                            <div className='row-zyx' style={{borderBottom: '1px solid black', paddingBottom: 10}}>
                                <span style={{fontWeight: 'bold', fontSize: 20}}>{t(langKeys.templateedition)}</span>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={{flex: 1, display: 'flex', flexDirection: 'column', paddingRight: 20}}>
                                    <span className={classes.title}>{t(langKeys.messagecontent)}</span>
                                    <span style={{marginBottom: 10}}>{t(langKeys.authenticationmessagecontent)}</span>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Checkbox
                                            checked={addSafetyAdvice}
                                            color="primary"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAddSafetyAdvice(true);
                                                } else {
                                                    setAddSafetyAdvice(false);
                                                }
                                            }}
                                        />
                                        <span>{t(langKeys.addsecurityadvice)}</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Checkbox
                                            checked={addLastDateCode}
                                            color="primary"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAddLastDateCode(true);
                                                } else {
                                                    setAddLastDateCode(false);
                                                }
                                            }}
                                        />
                                        <span>{t(langKeys.addlastdatecode)}</span>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #B4B4B4', backgroundColor: '#F1F1F1', padding: 15, borderRadius: 10, marginTop: 10, marginBottom: 20}}>
                                        <span style={{fontWeight: 'bold', marginBottom: 8}}>{t(langKeys.expiresin)}</span>
                                        <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
                                            <FieldEdit
                                                type="number"
                                                valueDefault={expiresValue}
                                                onChange={(value) => setExpiresValue(value)}
                                                label={t(langKeys.minutes)}
                                                variant="outlined"
                                                size="small"
                                            />
                                            <div className={classes.warningContainer}>
                                                <WarningIcon style={{color: '#FF7575'}}/>
                                                <span>{t(langKeys.introudceavalue)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={classes.title}>{t(langKeys.buttontext)}</span>
                                    <span style={{marginBottom: 10}}>{t(langKeys.buttontextauth)}</span>
                                    <div style={{width: '50%', marginBottom: 20}}>
                                        <FieldEdit
                                            label={t(langKeys.code)}
                                            valueDefault={authButtonText}
                                            onChange={(value) => setAuthButtonText(value)}
                                            maxLength={25}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </div>
                                    <span className={classes.title} style={{marginBottom: 10}}>{t(langKeys.advanceconfig)}</span>
                                    <span className={classes.title}>{t(langKeys.validityperiodmessages)}</span>
                                    <span style={{marginBottom: 10}}>{t(langKeys.validityperiodtext)}</span>
                                    <div style={{display: 'flex', alignItems: 'start', marginTop: 10}}>
                                        <Checkbox
                                            checked={validatePeriod}
                                            color="primary"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setValidatePeriod(true);
                                                } else {
                                                    setValidatePeriod(false);
                                                }
                                            }}
                                        />
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <span style={{fontWeight: 'bold'}}>{t(langKeys.configvalidityperiod)}</span>
                                            <span>{t(langKeys.validityperiodconfigcondition)}</span>
                                        </div>
                                    </div>
                                    {validatePeriod && (
                                        <div style={{display: 'flex', flexDirection: 'column', padding: '15px 25px', backgroundColor: '#F5F5F5', border: '1px solid #ACACAC', borderRadius: 10, marginTop: 10}}>
                                            <CustomTitleHelper
                                                title={t(langKeys.validityperiod) + ' '}
                                                helperText={t(langKeys.test)}
                                            /> 
                                            <div style={{backgroundColor: 'white', width: 250, marginTop: 5}}>
                                                <FieldSelect
                                                    data={dataValidityPeriod}
                                                    optionDesc="text"
                                                    optionValue="data"
                                                    variant="outlined"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div style={{flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 20}}>
                                    <span className={classes.title}>{t(langKeys.messagepreview)}</span>
                                    <span style={{marginBottom: 10}}>Vista previa del mensaje configurado a enviar</span>
                                    <div style={{height: 500, width: '100%', border: '1px solid black'}}>
                                        <MessagePreviewAuthentication
                                            buttontext={authButtonText}
                                            safetyAdvice={addSafetyAdvice}
                                            dateAdvice={addLastDateCode}
                                            expiresValue={expiresValue}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {getValues("type") === 'HSM' &&
                    (getValues('name') !== '' && getValues('language') !== '' && getValues('templatetype') === 'CAROUSEL' && (getValues('category') === 'UTILITY' || getValues('category') === 'MARKETING')) &&(
                        <div>
                            <div className='row-zyx' style={{borderBottom: '1px solid black', paddingBottom: 10}}>
                                <span style={{fontWeight: 'bold', fontSize: 20}}>{t(langKeys.templateedition)}</span>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={{flex: 1, display: 'flex', flexDirection: 'column', paddingRight: 20, maxWidth: '50%'}}>
                                    <span className={classes.title}>{t(langKeys.bubblemessage)}</span>
                                    <span style={{marginBottom: 10}}>{t(langKeys.bubblemessagetext)}</span>
                                    <React.Fragment>
                                        <RichText
                                            spellCheck
                                            emoji={true}
                                            value={bodyObjectCar}
                                            onChange={(value) => {
                                                setBodyObjectCar(value);
                                            }}
                                            positionEditable="top"
                                            style={{
                                                borderColor: "#762AA9",
                                                borderRadius: "4px",
                                                borderStyle: "solid",
                                                borderWidth: "1px",
                                                padding: "10px",
                                            }}
                                        />
                                    </React.Fragment>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                                        {bubbleVariables.length < 20 &&(
                                            <Button
                                                className={classes.button}
                                                startIcon={<AddIcon />}
                                                onClick={() => setBubbleVariables([...bubbleVariables, ''])}
                                            >
                                                {t(langKeys.addvariable)}
                                            </Button>
                                        )}
                                        <Button
                                            className={classes.button}
                                            startIcon={<CloseIcon />}
                                            onClick={() => setBubbleVariables(bubbleVariables.slice(0,-1))}
                                        >
                                            {t(langKeys.deletevariable)}
                                        </Button>
                                    </div>
                                    {bubbleVariables.length > 0 && (
                                        <div style={{marginTop: 10, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column'}}>
                                            <span style={{fontWeight: 'bold'}}>{t(langKeys.text)}</span>
                                            {bubbleVariables.map((v: string, index: number) => {
                                                return (
                                                    <div key={index} style={{display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px'}}>
                                                        <span>{'{{'}{index + 1}{'}}'}</span>
                                                        <div style={{backgroundColor: 'white', width: '100%'}}>
                                                            <FieldEdit
                                                                variant="outlined"
                                                                size="small"
                                                                valueDefault={v}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className={classes.warningContainer}>
                                                <WarningIcon style={{color: '#FF7575'}}/>
                                                {t(langKeys.addexampletext)}
                                            </div>
                                        </div>
                                    )}
                                    <span className={classes.title}>{t(langKeys.messagetemplate_carousel)}</span>
                                    <span style={{marginBottom: 10}}>Configura tus cards de carrusel añadiendo imágenes, texto, variables y botones</span>
                                    {getValues('carouselcards')?.length > 0 ? (
                                        <div className="row-zyx">
                                            <React.Fragment>
                                                {getValues("carouselcards")?.map((card: any, i: number) => {
                                                    return (
                                                        <div key={`card-${i}`} className="col-4" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', padding: '0px 8px 0px 8px'}}>
                                                            <div style={{display: 'flex', width: '100%', justifyContent: 'end'}}>
                                                                <IconButton onClick={() => onClickRemoveCard(i)} style={{padding: 0}}>
                                                                    <ClearIcon className={classes.closeIcon}/>
                                                                </IconButton>
                                                            </div>
                                                            {card.image ? (
                                                                <div className={classes.uploadedImage}>
                                                                    <ImageIcon style={{color: '#004DB1', height: 85, width: 'auto'}}/>
                                                                    <div style={{display: 'flex', gap: 10}}>
                                                                        <span className={classes.imageName}>{card.image.name}</span>
                                                                        <IconButton onClick={() => handleImageRemove(i)} style={{padding: 0}}>
                                                                            <ClearIcon className={classes.closeIcon}/>
                                                                        </IconButton>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className={classes.uploadImage} >
                                                                    <input
                                                                        type="file"
                                                                        accept={'.jpg,.png'}
                                                                        onChange={(e) => handleFileChangeAux(e, i)}
                                                                        style={{ display: 'none' }}
                                                                        id="fileInput2"
                                                                    />
                                                                    <label htmlFor="fileInput2">
                                                                        <ImageIcon style={{color: '#004DB1', height: 85, width: 'auto'}}/>
                                                                    </label>
                                                                    <span style={{fontWeight: 'bold'}}>{t(langKeys.uploadImage)}</span>
                                                                    <span style={{color: '#004DB1'}}>Tamaño máximo 5 MB</span>
                                                                </div>
                                                            )}
                                                            <div style={{width: '90%', fontWeight: 'bold'}}>
                                                                {t(langKeys.body)}
                                                                <FieldEdit
                                                                    variant="outlined"
                                                                    InputProps={{
                                                                        multiline: true,
                                                                    }}
                                                                    maxLength={160}
                                                                    valueDefault={card?.body || ""}
                                                                    onChange={(value) => {
                                                                        setValue(`carouselcards.${i}.body`, value)
                                                                        trigger('carouselcards')
                                                                    }}
                                                                    fregister={{
                                                                        ...register(`carouselcards.${i}.body`, {
                                                                            validate: (value) =>
                                                                                (value && value.length) || t(langKeys.field_required),
                                                                        }),
                                                                    }}
                                                                />
                                                                {cardsVariables.filter((card) => { return card.cindex === i }).length < 7 &&(
                                                                    <div style={{display: 'flex', justifyContent: 'end'}}>
                                                                        <Button
                                                                            className={classes.button}
                                                                            startIcon={<AddIcon />}
                                                                            onClick={() => setCardsVariables([...cardsVariables, { cindex: i, value: ''}])}
                                                                        >
                                                                            {t(langKeys.addvariable)}
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {((getValues(`carouselcards.${i}.buttonstext`)?.length + getValues(`carouselcards.${i}.buttonslink`)?.length + getValues(`carouselcards.${i}.buttonsphone`)?.length) < 2) && (
                                                                <div>
                                                                    <AddButtonMenu fastAnswer={() => onClickAddButtonTCard(i)} urlWeb={() => onClickAddButtonLCard(i)} callNumber={() => onClickAddButtonPCard(i)} textbtn={getValues(`carouselcards.${i}.buttonstext`)} urlbtn={getValues(`carouselcards.${i}.buttonslink`)} phonebtn={getValues(`carouselcards.${i}.buttonsphone`)}/>
                                                                </div>
                                                            )}
                                                            {getValues(`carouselcards.${i}.buttonstext`)?.map((btn: any, btni: number) => {
                                                                return (
                                                                    <div key={`btn-${btni}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #9E9E9E', backgroundColor: '#F5F5F5', padding: 5}}>
                                                                        <span style={{fontWeight: 'bold'}}>{t(langKeys.fastanswer)}</span>
                                                                        <div style={{width: '100%'}}>
                                                                            <span style={{textAlign: 'start', paddingLeft: 10}}>{t(langKeys.buttontext)}</span>
                                                                        </div>
                                                                        <div style={{display: 'flex'}}>
                                                                            <div style={{backgroundColor: 'white'}}>
                                                                                <FieldEdit
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    maxLength={25}
                                                                                    valueDefault={btn?.text}
                                                                                    onChange={(value) => {
                                                                                        setValue(`carouselcards.${i}.buttonstext.${btni}.text`, value)
                                                                                        trigger('carouselcards')
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <IconButton style={{padding: 0}} onClick={() => onClickRemoveTButtonCard(i, btni)}>
                                                                                <ClearIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                            {getValues(`carouselcards.${i}.buttonslink`)?.map((btn: any, btni: number) => {
                                                                return (
                                                                    <div key={`btn-${btni}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #9E9E9E', backgroundColor: '#F5F5F5', padding: 5}}>
                                                                        <span style={{fontWeight: 'bold'}}>{t(langKeys.calltoaction)}</span>
                                                                        <div style={{width: '100%'}}>
                                                                            <span style={{textAlign: 'start', paddingLeft: 10}}>{t(langKeys.buttontext)}</span>
                                                                        </div>
                                                                        <div style={{display: 'flex'}}>
                                                                            <div style={{backgroundColor: 'white'}}>
                                                                                <FieldEdit
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    maxLength={25}
                                                                                    valueDefault={btn?.text}
                                                                                    onChange={(value) => {
                                                                                        setValue(`carouselcards.${i}.buttonslink.${btni}.text`, value)
                                                                                        trigger('carouselcards')
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <IconButton style={{padding: 0}} onClick={() => onClickRemoveLButtonCard(i, btni)}>
                                                                                <ClearIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div style={{width: '100%'}}>
                                                                            <span style={{textAlign: 'start', paddingLeft: 10}}>{t(langKeys.urltype)}</span>
                                                                        </div>
                                                                        <div style={{width: '100%', backgroundColor: 'white'}}>
                                                                            <FieldSelect
                                                                                data={dataURLType}
                                                                                variant="outlined"
                                                                                optionDesc="text"
                                                                                optionValue="value"
                                                                                valueDefault={btn?.type}
                                                                                onChange={(value) => onChangeCardsButton(i, btni, "type", value?.value, 'link')}
                                                                                fregister={{
                                                                                    ...register(`carouselcards.${i}.buttonslink.${btni}.type`, {
                                                                                        validate: (value) =>
                                                                                            (value && value.length) || t(langKeys.field_required),
                                                                                    }),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div style={{width: '100%', display:'flex'}}>
                                                                            <span style={{textAlign: 'start', paddingLeft: 10}}>{t(langKeys.urlwebsite)}</span>
                                                                        </div>
                                                                        <div style={{width: '100%', display: 'flex'}}>
                                                                            <div style={{flex: 1, backgroundColor: 'white'}}>
                                                                                <FieldEdit
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                />
                                                                            </div>
                                                                            {btn?.type === 'dynamic' &&(
                                                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{'{{'}1{'}}'}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                            {getValues(`carouselcards.${i}.buttonsphone`)?.map((btn: any, btni: number) => {
                                                                return (
                                                                    <div key={`btn-${btni}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #9E9E9E', backgroundColor: '#F5F5F5', padding: 5}}>
                                                                        <span style={{fontWeight: 'bold'}}>{t(langKeys.calltoaction)}</span>
                                                                        <div style={{width: '100%'}}>
                                                                            <span style={{textAlign: 'start', paddingLeft: 10}}>{t(langKeys.buttontext)}</span>
                                                                        </div>
                                                                        <div style={{display: 'flex'}}>
                                                                            <div style={{backgroundColor: 'white'}}>
                                                                                <FieldEdit
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    maxLength={25}
                                                                                    valueDefault={btn?.text}
                                                                                    onChange={(value) => {
                                                                                        setValue(`carouselcards.${i}.buttonsphone.${btni}.text`, value)
                                                                                        trigger('carouselcards')
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <IconButton style={{padding: 0}} onClick={() => onClickRemovePButtonCard(i, btni)}>
                                                                                <ClearIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div style={{width: '100%'}}>
                                                                            <span style={{textAlign: 'start', paddingLeft: 10}}>{t(langKeys.country)}</span>
                                                                        </div>
                                                                        <div style={{backgroundColor: 'white', width: '100%'}}>
                                                                            <FieldSelect
                                                                                data={dataURLType}
                                                                                variant="outlined"
                                                                                optionDesc="text"
                                                                                optionValue="value"
                                                                            />
                                                                        </div>
                                                                        <div style={{width: '100%'}}>
                                                                            <span style={{textAlign: 'start', paddingLeft: 10}}>{t(langKeys.telephonenumber)}</span>
                                                                        </div>
                                                                        <div style={{backgroundColor: 'white', width: '100%'}}>
                                                                            <FieldEdit
                                                                                variant="outlined"
                                                                                size="small"
                                                                                type="number"
                                                                                maxLength={20}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                                <div 
                                                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #B6B6B6', cursor: 'pointer'}}
                                                    onClick={onClickAddCard}
                                                    className="col-4"
                                                >
                                                    <AddIcon style={{color: '#B6B6B6', height: 40, width: 'auto'}}/>
                                                </div>
                                            </React.Fragment>
                                            {cardsVariables.length > 0 && (
                                                <div style={{marginTop: 10, backgroundColor: '#E6E6E6', padding: 15, display: 'flex', flexDirection: 'column'}}>
                                                    <span style={{fontWeight: 'bold'}}>{t(langKeys.text)}</span>
                                                    {cardsVariables.map((cv: Dictionary, index: number) => {
                                                        return (
                                                            <div key={index} style={{display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0px'}}>
                                                                <span>{'{{'}{index + 1}{'}}'}</span>
                                                                <div style={{backgroundColor: 'white', width: '100%'}}>
                                                                    <FieldEdit
                                                                        variant="outlined"
                                                                        size="small"
                                                                        valueDefault={cv.value}
                                                                    />
                                                                </div>
                                                                <IconButton style={{margin: 0}} onClick={() => {
                                                                    const newVariables = cardsVariables.filter((_, i) => i !== index)
                                                                    setCardsVariables(newVariables)
                                                                }}>
                                                                    <ClearIcon/>
                                                                </IconButton>
                                                            </div>
                                                        );
                                                    })}
                                                    <div className={classes.warningContainer}>
                                                        <WarningIcon style={{color: '#FF7575'}}/>
                                                        {t(langKeys.addexampletext)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div 
                                            style={{display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #B6B6B6', cursor: 'pointer'}}
                                            onClick={onClickAddCard}
                                        >
                                            <AddIcon style={{color: '#B6B6B6', height: 40, width: 'auto'}}/>
                                        </div>
                                    )}
                                </div>
                                <div style={{flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 20}}>
                                    <span className={classes.title}>{t(langKeys.messagepreview)}</span>
                                    <span style={{marginBottom: 10}}>Vista previa del mensaje configurado a enviar</span>
                                    <div style={{height: 'fit-content', width: '100%', border: '1px solid black'}}>
                                        <MessagePreviewCarousel
                                            bodyObject={bodyObjectCar}
                                            carouselCards={getValues('carouselcards')}
                                        />
                                    </div>
                                </div>
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