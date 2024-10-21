import { ChannelAndroid } from "icons";
import { Close, CloudUpload } from "@material-ui/icons";
import { ColorChangeHandler } from "react-color";
import { ColorInput, FieldEdit, FieldSelect, IOSSwitch } from "components";
import { getEditChatWebChannel, getInputValidationSel, getInsertChatwebChannel, updateMetachannels } from "common/helpers";
import { getMultiCollection } from "store/main/actions";
import { IChatWebAdd, IChannel, IChatWebAddFormField } from "@types";
import { insertChannel2, editChannel as getEditChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { TabPanel } from "pages/crm/components";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";

import {
    makeStyles,
    Breadcrumbs,
    Button,
    Box,
    AppBar,
    Tabs,
    Tab,
    Grid,
    IconButton,
    FormHelperText,
    Tooltip,
    TextField,
    withStyles,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputAdornment,
} from "@material-ui/core";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import Avatar from "@material-ui/core/Avatar";
import clsx from "clsx";
import InfoIcon from "@material-ui/icons/Info";
import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";
import React, { FC, useEffect, useRef, useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import ChannelEnableVirtualAssistant from "./ChannelEnableVirtualAssistant";

interface FieldTemplate {
    data: IChatWebAddFormField;
    text: React.ReactNode;
    node: (
        onClose: (key: string) => void,
        data: IChatWebAddFormField,
        form: UseFormReturn<IChatWebAdd>,
        index: number,
        fields: any,
        setFields: (key: any) => void
    ) => React.ReactNode;
}

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}))(Tooltip);

const useTemplateStyles = makeStyles((theme) => ({
    root: {
        border: `${theme.palette.primary.main} 1px solid`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(3),
        margin: theme.spacing(1),
    },
    title: {
        fontWeight: 700,
        fontSize: 20,
        color: theme.palette.primary.main,
        margin: "0 0 12 0",
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
    fieldContainer: {
        margin: theme.spacing(1),
    },
    headertitle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    closeBtn: {
        border: `${theme.palette.primary.main} 1px solid`,
    },
}));

const FIRSTNAME_FIELD = "FIRSTNAME_FIELD";
const LASTNAME_FIELD = "LASTNAME_FIELD";
const PHONE_FIELD = "PHONE_FIELD";
const EMAIL_FIELD = "EMAIL_FIELD";
const DOCUMENT_FIELD = "DOCUMENT_FIELD";
const SUPPLYNUMBER_FIELD = "SUPPLYNUMBER_FIELD";
const CONTACT = "CONTACT_FIELD";

interface NameTemplateProps {
    onClose: () => void;
    form: UseFormReturn<IChatWebAdd>;
    title: React.ReactNode;
    data: IChatWebAddFormField;
    index: number;
    fields: any;
    setFields: (key: any) => void;
}

const NameTemplate: FC<NameTemplateProps> = ({ data, onClose, title, form, index, fields, setFields }) => {
    const classes = useTemplateStyles();
    const { t } = useTranslation();
    const [required, setRequired] = useState(data.required);
    const multiRes = useSelector((state) => state.main.multiData);

    const handleRequired = (checked: boolean) => {
        setRequired(checked);
        data.required = checked;
    };

    return (
        <div className={classes.root}>
            <div className={classes.headertitle}>
                <label className={clsx(classes.title, classes.fieldContainer)}>
                    <IconButton
                        style={{
                            color: "#7721ad",
                            width: 16,
                            height: 16,
                            padding: 0,
                            position: "relative",
                            right: 25,
                            marginRight: -16,
                            bottom: 30,
                        }}
                        onClick={() => {
                            const tempfields = fields;
                            const tempfield = fields[index];
                            tempfields[index] = tempfields[index + 1];
                            tempfields[index + 1] = tempfield;
                            setFields(tempfields);
                            form.trigger();
                        }}
                        disabled={index + 1 >= fields.length}
                    >
                        <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                        style={{
                            color: "#7721ad",
                            width: 16,
                            height: 16,
                            padding: 0,
                            right: 9,
                            marginRight: -16,
                            bottom: 30,
                        }}
                        onClick={() => {
                            const tempfields = fields;
                            const tempfield = fields[index];
                            tempfields[index] = tempfields[index - 1];
                            tempfields[index - 1] = tempfield;
                            setFields(tempfields);
                            form.trigger();
                        }}
                        disabled={index - 1 < 0}
                    >
                        <ArrowUpwardIcon width={"5px"} />
                    </IconButton>
                    {index + 1}) {title}
                </label>
                <IconButton color="primary" onClick={onClose} className={classes.closeBtn}>
                    <Close color="primary" className="fa fa-plus-circle" />
                </IconButton>
            </div>
            <div style={{ height: 18 }} />
            <Grid container direction="column">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="column">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row" style={{ minHeight: 40 }}>
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.required} />
                                                </label>
                                                <Tooltip title={`${t(langKeys.requiredTooltip)}`} placement="top-start">
                                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                                <IOSSwitch
                                                    checked={required}
                                                    onChange={(_, v) => {
                                                        handleRequired(v);
                                                        form.setValue(`form.${index}.required`, v);
                                                        form.trigger(`form.${index}.required`);
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.label} />
                                                </label>
                                                <Tooltip title={`${t(langKeys.labelTooltip)}`} placement="top-start">
                                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                                <TextField
                                                    placeholder={t(langKeys.label)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        form.setValue(`form.${index}.label`, e.target.value);
                                                        data.label = e.target.value;
                                                        form.trigger(`form.${index}.label`);
                                                    }}
                                                    defaultValue={data.label}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Box m={1}>
                                    <Grid container direction="row">
                                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                            <label className={classes.text}>Placeholder</label>
                                            <Tooltip title={`${t(langKeys.placeholderTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                onChange={(e) => {
                                                    form.setValue(`form.${index}.placeholder`, e?.target.value || "");
                                                    data.placeholder = e?.target.value || "";
                                                    form.trigger(`form.${index}.placeholder`);
                                                }}
                                                defaultValue={data.placeholder}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Box m={1}>
                                    <Grid container direction="row">
                                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                            <label className={classes.text}>
                                                <Trans i18nKey={langKeys.inputValidation} />
                                                <Tooltip
                                                    title={`${t(langKeys.inputValidationTooltip)}`}
                                                    placement="top-start"
                                                >
                                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                </Tooltip>
                                            </label>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                            <FieldSelect
                                                className="col-12"
                                                valueDefault={data.inputvalidation}
                                                variant="outlined"
                                                onChange={(e) => {
                                                    form.setValue(`form.${index}.inputvalidation`, e?.inputvalue || "");
                                                    data.inputvalidation = e?.inputvalue || "";
                                                }}
                                                data={multiRes.data?.[0]?.data || []}
                                                loading={multiRes.loading}
                                                optionDesc="description"
                                                optionValue="inputvalue"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Box m={1}>
                                    <Grid container direction="row">
                                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                            <label className={classes.text}>
                                                <Trans i18nKey={langKeys.validationOnKeychange} />
                                                <Tooltip
                                                    title={`${t(langKeys.validationOnKeychangeTooltip)}`}
                                                    placement="top-start"
                                                >
                                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                </Tooltip>
                                            </label>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                            <FieldSelect
                                                className="col-12"
                                                valueDefault={data.keyvalidation}
                                                variant="outlined"
                                                onChange={(e) => {
                                                    form.setValue(`form.${index}.keyvalidation`, e?.inputvalue || "");
                                                    data.keyvalidation = e?.inputvalue || "";
                                                }}
                                                data={multiRes.data?.[0]?.data || []}
                                                loading={multiRes.loading}
                                                optionDesc="description"
                                                optionValue="inputvalue"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Box m={1}>
                                    <Grid container direction="row">
                                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                            <label className={classes.text}>
                                                <Trans i18nKey={langKeys.errorText} />
                                                <Tooltip
                                                    title={`${t(langKeys.errorTextTooltip)}`}
                                                    placement="top-start"
                                                >
                                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                </Tooltip>
                                            </label>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                            <TextField
                                                placeholder={t(langKeys.errorText)}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                onChange={(e) => {
                                                    form.setValue(`form.${index}.validationtext`, e.target.value);
                                                    data.validationtext = e.target.value;
                                                    form.trigger(`form.${index}.validationtext`);
                                                }}
                                                defaultValue={data.validationtext}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

const templates: { [x: string]: FieldTemplate } = {
    [FIRSTNAME_FIELD]: {
        text: <Trans i18nKey={langKeys.name} />,
        node: (onClose, data, form, index, fields, setFields) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(FIRSTNAME_FIELD)}
                    key={FIRSTNAME_FIELD}
                    title={<Trans i18nKey={langKeys.name} />}
                    fields={fields}
                    setFields={setFields}
                />
            );
        },
        data: {
            field: "FIRSTNAME",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [LASTNAME_FIELD]: {
        text: <Trans i18nKey={langKeys.lastname} />,
        node: (onClose, data, form, index, fields, setFields) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(LASTNAME_FIELD)}
                    key={LASTNAME_FIELD}
                    fields={fields}
                    setFields={setFields}
                    title={<Trans i18nKey={langKeys.lastname} />}
                />
            );
        },
        data: {
            field: "LASTNAME",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [PHONE_FIELD]: {
        text: <Trans i18nKey={langKeys.phone} />,
        node: (onClose, data, form, index, fields, setFields) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(PHONE_FIELD)}
                    key={PHONE_FIELD}
                    fields={fields}
                    setFields={setFields}
                    title={<Trans i18nKey={langKeys.phone} />}
                />
            );
        },
        data: {
            field: "PHONE",
            type: "phone",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [EMAIL_FIELD]: {
        text: <Trans i18nKey={langKeys.email} />,
        node: (onClose, data, form, index, fields, setFields) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(EMAIL_FIELD)}
                    key={EMAIL_FIELD}
                    fields={fields}
                    setFields={setFields}
                    title={<Trans i18nKey={langKeys.email} />}
                />
            );
        },
        data: {
            field: "EMAIL",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [DOCUMENT_FIELD]: {
        text: <Trans i18nKey={langKeys.document} />,
        node: (onClose, data, form, index, fields, setFields) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(DOCUMENT_FIELD)}
                    key={DOCUMENT_FIELD}
                    fields={fields}
                    setFields={setFields}
                    title={<Trans i18nKey={langKeys.document} />}
                />
            );
        },
        data: {
            field: "DOCUMENT",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [SUPPLYNUMBER_FIELD]: {
        text: <Trans i18nKey={langKeys.supplynumber} />,
        node: (onClose, data, form, index, fields, setFields) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(SUPPLYNUMBER_FIELD)}
                    key={SUPPLYNUMBER_FIELD}
                    fields={fields}
                    setFields={setFields}
                    title={<Trans i18nKey={langKeys.supplynumber} />}
                />
            );
        },
        data: {
            field: "SUPPLYNUMBER",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [CONTACT]: {
        text: <Trans i18nKey={langKeys.contact} />,
        node: (onClose, data, form, index, fields, setFields) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(CONTACT)}
                    key={CONTACT}
                    fields={fields}
                    setFields={setFields}
                    title={<Trans i18nKey={langKeys.contact} />}
                />
            );
        },
        data: {
            field: "CONTACT",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
};

const useChannelAddStyles = makeStyles((theme) => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "180px",
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "inherit",
    },
    activetab: {
        color: "white",
        backgroundColor: "#7721ad!important",
    },
    tab: {
        // width: 130,
        height: 45,
        maxWidth: "unset",
        border: "#A59F9F 1px solid",
        borderRadius: 6,
        backgroundColor: "white",
        flexGrow: 1,
    },
    arrowRight: {
        width: 0,
        height: 0,
        borderTop: "20px solid transparent",
        borderBottom: "20px solid transparent",
    },
    currentArrow: {
        borderLeft: "20px solid #7721ad",
    },
    nextArrow: {
        borderLeft: "20px solid #c0bcbc",
    },
    previousArrow: {
        borderLeft: "20px solid #00b050",
    },
    step: {
        backgroundColor: "#7721ad",
        height: "40px",
        color: "white",
        padding: "10px 25px 5px",
        textAlign: "center",
        verticalAlign: "middle",
        width: 100,
    },
    currentStep: {
        backgroundColor: "#7721ad",
    },
    nextStep: {
        backgroundColor: "#c0bcbc",
    },
    previousStep: {
        backgroundColor: "#00b050",
    },
    separator: {
        borderBottom: "2px solid #D1CBCB",
        width: "15%",
        height: 0,
        paddingTop: 18,
        marginLeft: 4,
        marginRight: 4,
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
    imgContainer: {
        borderRadius: 20,
        backgroundColor: "white",
        width: 157,
        height: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    img: {
        height: "80%",
        width: "auto",
    },
    icon: {
        "&:hover": {
            cursor: "pointer",
            color: theme.palette.primary.main,
        },
    },
}));

const isEmpty = (str?: string) => {
    return !str || str.length === 0;
};

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
    onboarding?: boolean;
}

type ImageData = File | string | null;

const getImgUrl = (file: ImageData): string | null => {
    if (!file) return null;

    try {
        if (typeof file === "string") {
            return file;
        } else if (typeof file === "object") {
            return URL.createObjectURL(file);
        }
        return null;
    } catch (ex) {
        console.error(ex);
        return null;
    }
};

export const AndroidExtra: FC<{ setTabIndex: (f: string) => void; form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const classes = useChannelAddStyles();
    const { setValue, getValues } = form;
    const { t } = useTranslation();

    const [uploadFile, setUploadFile] = useState(getValues("extra.uploadfile"));
    const [uploadVideo, setUploadVideo] = useState(getValues("extra.uploadvideo"));
    const [uploadImage, setUploadImage] = useState(getValues("extra.uploadimage"));
    const [uploadAudio, setUploadAudio] = useState(getValues("extra.uploadaudio"));
    const [uploadLocation, setUploadLocation] = useState(getValues("extra.uploadlocation"));
    const [reloadChat, setReloadChat] = useState(getValues("extra.reloadchat"));
    const [poweredBy, setPoweredBy] = useState(getValues("extra.poweredby"));

    const [persistentInput, setPersistentInput] = useState(getValues("extra.persistentinput"));
    const [abandonEvent, setAbandonEvent] = useState(getValues("extra.abandonevent"));
    const [alertSound, setAlertSound] = useState(getValues("extra.alertsound"));
    const [formHistory, setFormHistory] = useState(getValues("extra.formhistory"));
    const [enableMetadata, setEnableMetadata] = useState(getValues("extra.enablemetadata"));

    const handleUploadFileChange = (checked: boolean) => {
        setUploadFile(checked);
        setValue("extra.uploadfile", checked);
    };

    const handleUploadVideoChange = (checked: boolean) => {
        setUploadVideo(checked);
        setValue("extra.uploadvideo", checked);
    };

    const handleUploadImageChange = (checked: boolean) => {
        setUploadImage(checked);
        setValue("extra.uploadimage", checked);
    };

    const handleUploadAudioChange = (checked: boolean) => {
        setUploadAudio(checked);
        setValue("extra.uploadaudio", checked);
    };

    const handleUploadLocationChange = (checked: boolean) => {
        setUploadLocation(checked);
        setValue("extra.uploadlocation", checked);
    };

    const handleReloadChatChange = (checked: boolean) => {
        setReloadChat(checked);
        setValue("extra.reloadchat", checked);
    };

    const handlePoweredByChange = (checked: boolean) => {
        setPoweredBy(checked);
        setValue("extra.poweredby", checked);
    };

    const handlePersistentInputChange = (checked: boolean) => {
        setPersistentInput(checked);
        setValue("extra.persistentinput", checked);
    };

    const handleAbandonEventChange = (checked: boolean) => {
        setAbandonEvent(checked);
        setValue("extra.abandonevent", checked);
    };

    const handleAlertSoundChange = (checked: boolean) => {
        setAlertSound(checked);
        setValue("extra.alertsound", checked);
    };

    const handleFormHistoryChange = (checked: boolean) => {
        setFormHistory(checked);
        setValue("extra.formhistory", checked);
    };

    const handleEnableMetadataChange = (checked: boolean) => {
        setEnableMetadata(checked);
        setValue("extra.enablemetadata", checked);
    };
    return (
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "50%", minWidth: 500, borderRight: "2px solid #76acdc", padding: 10 }}>
                <Grid container direction="column">
                    <div style={{ padding: "10px 0", paddingTop: 0 }}>
                        <Typography variant="h6">{t(langKeys.messagetemplate_attachment)}</Typography>
                    </div>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: "0 0 20px 0", paddingTop: 0 }}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.documents} />
                                            <Tooltip title={`${t(langKeys.documentsTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={uploadFile}
                                            onChange={(_, v) => handleUploadFileChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.image_plural} />
                                            <Tooltip title={`${t(langKeys.imageTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={uploadImage}
                                            onChange={(_, v) => handleUploadImageChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: "0 0 20px 0", paddingTop: 0 }}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            Audios
                                            <Tooltip title={`${t(langKeys.audioTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={uploadAudio}
                                            onChange={(_, v) => handleUploadAudioChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            Videos
                                            <Tooltip title={`${t(langKeys.videoTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={uploadVideo}
                                            onChange={(_, v) => handleUploadVideoChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.sendLocation} />
                                            <Tooltip title={`${t(langKeys.locationTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={uploadLocation}
                                            onChange={(_, v) => handleUploadLocationChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <div style={{ padding: "10px 0" }}>
                        <Typography variant="h6">{t(langKeys.additionalsettings)}</Typography>
                    </div>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            Powered by
                                            <Tooltip title={`${t(langKeys.poweredbyTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch checked={poweredBy} onChange={(_, v) => handlePoweredByChange(v)} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.startnewconversation} />
                                            <Tooltip
                                                title={`${t(langKeys.startnewconversationTooltip)}`}
                                                placement="top-start"
                                            >
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={reloadChat}
                                            onChange={(_, v) => handleReloadChatChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.inputAlwaysEnabled} />
                                            <Tooltip
                                                title={`${t(langKeys.inputAlwaysEnabledTooltip)}`}
                                                placement="top-start"
                                            >
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={persistentInput}
                                            onChange={(_, v) => handlePersistentInputChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.abandonmentEvent} />
                                            <Tooltip
                                                title={`${t(langKeys.abandonmentEventTooltip)}`}
                                                placement="top-start"
                                            >
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={abandonEvent}
                                            onChange={(_, v) => handleAbandonEventChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.newMessageRing} />
                                            <Tooltip
                                                title={`${t(langKeys.newMessageRingTooltip)}`}
                                                placement="top-start"
                                            >
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={alertSound}
                                            onChange={(_, v) => handleAlertSoundChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.formBaseHistory} />
                                            <Tooltip
                                                title={`${t(langKeys.formBaseHistoryTooltip)}`}
                                                placement="top-start"
                                            >
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={formHistory}
                                            onChange={(_, v) => handleFormHistoryChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.sendMetaData} />
                                            <Tooltip title={`${t(langKeys.sendMetaDataTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <IOSSwitch
                                            checked={enableMetadata}
                                            onChange={(_, v) => handleEnableMetadataChange(v)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <div style={{ padding: "10px 0" }}>
                        <Typography variant="h6">{t(langKeys.layoutconfig)}</Typography>
                    </div>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={0.5} color="textPrimary">
                            CSS Header
                            <Tooltip title={`${t(langKeys.cssheaderTooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                            </Tooltip>
                        </Box>
                        <TextField
                            variant="outlined"
                            multiline
                            minRows={5}
                            maxRows={10}
                            fullWidth
                            defaultValue={getValues("extra.customcss")}
                            onChange={(e) => setValue("extra.customcss", e.target.value)}
                        />
                    </Grid>
                    <div style={{ height: 20 }} />
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={0.5} color="textPrimary">
                            JS Script
                            <Tooltip title={`${t(langKeys.jsscriptTooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                            </Tooltip>
                        </Box>
                        <TextField
                            variant="outlined"
                            multiline
                            minRows={5}
                            maxRows={10}
                            fullWidth
                            defaultValue={getValues("extra.customjs")}
                            onChange={(e) => setValue("extra.customjs", e.target.value)}
                        />
                    </Grid>
                </Grid>
            </div>
            <div style={{ width: "50%", minWidth: 250, padding: 10 }}>
                <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                    <div
                        style={{
                            padding: 20,
                            margin: "20px 20px 0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: 75,
                            border: "1px solid",
                            borderRadius: "6px 6px 0 0 ",
                            backgroundColor: getValues("color.header"),
                            borderColor: getValues("color.border"),
                        }}
                    >
                        <Avatar
                            src={getImgUrl(getValues("interface.iconheader")) ?? ""}
                            style={{ width: 35, height: 35, border: "0.1px solid lightgray" }}
                        />
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                paddingLeft: 25,
                                fontSize: "1.1em",
                                paddingTop: 5,
                            }}
                        >
                            {getValues("interface.chattitle")}
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: 45,
                            border: "1px solid",
                            backgroundColor: getValues("color.header"),
                            borderColor: getValues("color.border"),
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1em",
                                paddingTop: 5,
                            }}
                        >
                            {getValues("interface.chatsubtitle")}
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: 200,
                            border: "1px solid",
                            flexDirection: "column",
                            backgroundColor: getValues("color.background"),
                            borderColor: getValues("color.border"),
                        }}
                    ></div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            width: "calc(100% - 40px)",
                            height: "calc(100% - 160px)",
                            border: "1px solid",
                            borderRadius: "0 0 6px 6px",
                            backgroundColor: "#e7e7e7",
                            borderColor: getValues("color.border"),
                        }}
                    >
                        <div style={{ width: "100%", display: "flex" }}>
                            <div style={{ paddingRight: 10 }}>
                                <Box
                                    style={{
                                        backgroundColor: "white",
                                        zIndex: 99,
                                        width: 160,
                                        marginRight: -160,
                                        position: "relative",
                                        bottom:
                                            (Number(uploadAudio) +
                                                Number(uploadFile) +
                                                Number(uploadImage) +
                                                Number(uploadLocation) +
                                                Number(uploadVideo)) *
                                            37,
                                        marginBottom:
                                            -(
                                                Number(uploadAudio) +
                                                Number(uploadFile) +
                                                Number(uploadImage) +
                                                Number(uploadLocation) +
                                                Number(uploadVideo)
                                            ) * 37,
                                    }}
                                >
                                    {uploadAudio && (
                                        <MenuItem style={{ border: "1px solid #ebeaed" }}>
                                            {t(langKeys.uploadAudio)}
                                        </MenuItem>
                                    )}
                                    {uploadFile && (
                                        <MenuItem style={{ border: "1px solid #ebeaed" }}>
                                            {t(langKeys.uploadFile)}
                                        </MenuItem>
                                    )}
                                    {uploadImage && (
                                        <MenuItem style={{ border: "1px solid #ebeaed" }}>
                                            {t(langKeys.uploadImage)}
                                        </MenuItem>
                                    )}
                                    {uploadLocation && (
                                        <MenuItem style={{ border: "1px solid #ebeaed" }}>
                                            {t(langKeys.sendLocation)}
                                        </MenuItem>
                                    )}
                                    {uploadVideo && (
                                        <MenuItem style={{ border: "1px solid #ebeaed" }}>
                                            {t(langKeys.uploadVideo)}
                                        </MenuItem>
                                    )}
                                </Box>
                                <IconButton id="circleopenmenu" style={{ padding: 0 }}>
                                    <AddCircleIcon
                                        style={{ width: 35, height: 35, color: getValues("color.iconscolor") }}
                                    />
                                </IconButton>
                            </div>
                            <div style={{ width: "90%" }}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    disabled={!persistentInput}
                                    size="small"
                                    style={{ backgroundColor: "white" }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SendIcon style={{ color: getValues("color.iconscolor") }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                        {poweredBy && <div style={{ width: "100%", textAlign: "center" }}>Powered by Laraigo</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
export const AndroidForm: FC<{ setTabIndex: (f: string) => void; form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const classes = useChannelAddStyles();
    const { getValues } = form;
    const { t } = useTranslation();
    const defFields = useRef<FieldTemplate[]>(
        (form.getValues("form") || []).map((x) => {
            return {
                ...templates[`${x.field}_FIELD`],
                data: x,
            } as FieldTemplate;
        })
    );

    const [enable, setEnable] = useState(false);
    const [fieldTemplate, setFieldTemplate] = useState<string>("");
    const [fields, setFields] = useState<FieldTemplate[]>(defFields.current);

    useEffect(() => {
        form.setValue(
            "form",
            fields.map((x) => x.data)
        );
    }, [fields, form]);

    useEffect(() => {
        handleAddTemplate();
    }, [fieldTemplate]);

    const handleCloseTemplate = (key: string) => {
        const newFields = fields.filter((e) => e.data.field !== templates[key].data.field);
        setFields(newFields);
    };

    const handleAddTemplate = () => {
        if (fieldTemplate === "") return;

        setFields([...fields, templates[fieldTemplate]]);
        setFieldTemplate("");
    };

    const getMenuTemplates = () => {
        const temp: React.ReactNode[] = [];
        for (const key in templates) {
            if (fields.includes(templates[key])) continue;
            temp.push(
                <MenuItem key={key} value={key}>
                    {templates[key].text}
                </MenuItem>
            );
        }
        return temp;
    };

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "50%", minWidth: 500, borderRight: "2px solid #76acdc", padding: 10 }}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                                <Typography className={classes.text}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.wantAddFormToSiteQuestion} />
                                        <Tooltip
                                            title={`${t(langKeys.wantAddFormToSiteQuestionTooltip)}`}
                                            placement="top-start"
                                        >
                                            <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                        </Tooltip>
                                    </label>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                <IOSSwitch checked={enable} onChange={(_, v) => setEnable(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: enable ? "block" : "none" }}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Typography className={classes.text}>
                                    <Trans i18nKey={langKeys.selectField} />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                <FormControl style={{ width: 160, marginRight: 20 }}>
                                    <Select
                                        variant="outlined"
                                        value={fieldTemplate}
                                        onChange={(e) => setFieldTemplate(e.target.value as string)}
                                        displayEmpty
                                        style={{ height: 40 }}
                                    >
                                        <MenuItem value={""}>
                                            <em>
                                                <Trans i18nKey={langKeys.select} /> -
                                            </em>
                                        </MenuItem>
                                        {getMenuTemplates()}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {fields.map((e, i) => e.node(handleCloseTemplate, e.data, form, i, fields, setFields))}
            </div>
            <div style={{ width: "50%", minWidth: 500, display: "flex", paddingLeft: 24, paddingBottom: 24, gap: 8 }}>
                <div style={{ width: "50%", minWidth: 250, padding: 10 }}>
                    <div>
                        <Typography variant="subtitle1">1) {t(langKeys.formbeforecompletetion)}</Typography>
                    </div>
                    <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                        <div
                            style={{
                                padding: 20,
                                margin: "20px 20px 0 20px",
                                display: "flex",
                                width: "calc(100% - 40px)",
                                height: 75,
                                border: "1px solid",
                                borderRadius: "6px 6px 0 0 ",
                                backgroundColor: getValues("color.header"),
                                borderColor: getValues("color.border"),
                            }}
                        >
                            <Avatar
                                src={getImgUrl(getValues("interface.iconheader")) ?? ""}
                                style={{ width: 35, height: 35, border: "0.1px solid lightgray" }}
                            />
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    paddingLeft: 25,
                                    fontSize: "1.1em",
                                    paddingTop: 5,
                                }}
                            >
                                {getValues("interface.chattitle")}
                            </div>
                        </div>
                        <div
                            style={{
                                padding: 5,
                                margin: "0 20px",
                                display: "flex",
                                width: "calc(100% - 40px)",
                                height: 45,
                                border: "1px solid",
                                backgroundColor: getValues("color.header"),
                                borderColor: getValues("color.border"),
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    textAlign: "center",
                                    fontSize: "1em",
                                    paddingTop: 5,
                                }}
                            >
                                {getValues("interface.chatsubtitle")}
                            </div>
                        </div>
                        <div
                            style={{
                                padding: 5,
                                margin: "0 20px",
                                display: "flex",
                                width: "calc(100% - 40px)",
                                height: "calc(100% - 160px)",
                                border: "1px solid",
                                flexDirection: "column",
                                borderRadius: "0 0 6px 6px",
                                backgroundColor: getValues("color.background"),
                                borderColor: getValues("color.border"),
                            }}
                        >
                            {fields.map((e, i) => (
                                <div key={i} style={{ padding: "8px 0" }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={0.5} color="textPrimary">
                                        {e.data.label}
                                    </Box>
                                    <TextField
                                        type={e.data.type}
                                        fullWidth
                                        placeholder={e.data.placeholder}
                                        size="small"
                                        variant="outlined"
                                        disabled
                                    />
                                </div>
                            ))}
                            <div style={{ display: "flex", marginLeft: "calc(50% - 80px" }}>
                                <div
                                    className={clsx(classes.step)}
                                    style={{ backgroundColor: "white", color: "black", width: 140 }}
                                >
                                    {t(langKeys.sendData)}
                                </div>
                                <div
                                    className={clsx(classes.arrowRight)}
                                    style={{ borderLeft: "20px solid white" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width: "50%", minWidth: 250, padding: 10 }}>
                    <div>
                        <Typography variant="subtitle1">2) {t(langKeys.formaftercompletitionerror)}</Typography>
                    </div>
                    <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                        <div
                            style={{
                                padding: 20,
                                margin: "20px 20px 0 20px",
                                display: "flex",
                                width: "calc(100% - 40px)",
                                height: 75,
                                border: "1px solid",
                                borderRadius: "6px 6px 0 0 ",
                                backgroundColor: getValues("color.header"),
                                borderColor: getValues("color.border"),
                            }}
                        >
                            <Avatar
                                src={getImgUrl(getValues("interface.iconheader")) ?? ""}
                                style={{ width: 35, height: 35, border: "0.1px solid lightgray" }}
                            />
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    paddingLeft: 25,
                                    fontSize: "1.1em",
                                    paddingTop: 5,
                                }}
                            >
                                {getValues("interface.chattitle")}
                            </div>
                        </div>
                        <div
                            style={{
                                padding: 5,
                                margin: "0 20px",
                                display: "flex",
                                width: "calc(100% - 40px)",
                                height: 45,
                                border: "1px solid",
                                backgroundColor: getValues("color.header"),
                                borderColor: getValues("color.border"),
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    textAlign: "center",
                                    fontSize: "1em",
                                    paddingTop: 5,
                                }}
                            >
                                {getValues("interface.chatsubtitle")}
                            </div>
                        </div>
                        <div
                            style={{
                                padding: 5,
                                margin: "0 20px",
                                display: "flex",
                                width: "calc(100% - 40px)",
                                height: "calc(100% - 160px)",
                                border: "1px solid",
                                flexDirection: "column",
                                borderRadius: "0 0 6px 6px",
                                backgroundColor: getValues("color.background"),
                                borderColor: getValues("color.border"),
                            }}
                        >
                            {fields.map((e, i) => (
                                <div key={i} style={{ padding: "8px 0" }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={0.5} color="textPrimary">
                                        {e.data.label}
                                    </Box>
                                    <TextField
                                        type={e.data.type}
                                        fullWidth
                                        placeholder={e.data.placeholder}
                                        size="small"
                                        variant="outlined"
                                        disabled
                                        error
                                        helperText={e.data.validationtext || ""}
                                    />
                                </div>
                            ))}
                            <div style={{ display: "flex", marginLeft: "calc(50% - 80px" }}>
                                <div
                                    className={clsx(classes.step)}
                                    style={{ backgroundColor: "white", color: "black", width: 140 }}
                                >
                                    {t(langKeys.sendData)}
                                </div>
                                <div
                                    className={clsx(classes.arrowRight)}
                                    style={{ borderLeft: "20px solid white" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const AndroidColor: FC<{ setTabIndex: (f: string) => void; form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const classes = useChannelAddStyles();
    const { setValue, getValues } = form;
    const { t } = useTranslation();
    const [headerColor, setHeaderColor] = useState(getValues("color.header"));
    const [backgroundColor, setBackgroundColor] = useState(getValues("color.background"));
    const [borderColor, setBorderColor] = useState(getValues("color.border"));
    const [clientMessageColor, setClientMessageColor] = useState(getValues("color.client"));
    const [botMessageColor, setBotMessageColor] = useState(getValues("color.bot"));
    const [iconscolor, setIconscolor] = useState(getValues("color.iconscolor"));

    const handleHeaderColorChange: ColorChangeHandler = (e) => {
        setHeaderColor(e.hex);
        setValue("color.header", e.hex);
    };

    const handleBackgroundColorChange: ColorChangeHandler = (e) => {
        setBackgroundColor(e.hex);
        setValue("color.background", e.hex);
    };

    const handleBorderColorChange: ColorChangeHandler = (e) => {
        setBorderColor(e.hex);
        setValue("color.border", e.hex);
    };

    const handleClientMessageColorChange: ColorChangeHandler = (e) => {
        setClientMessageColor(e.hex);
        setValue("color.client", e.hex);
    };

    const handleBotMessageColorChange: ColorChangeHandler = (e) => {
        setBotMessageColor(e.hex);
        setValue("color.bot", e.hex);
    };
    const handleiconscolorChange: ColorChangeHandler = (e) => {
        setIconscolor(e.hex);
        setValue("color.iconscolor", e.hex);
    };

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "50%", minWidth: 500, borderRight: "2px solid #76acdc", padding: 10 }}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="column">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: 10 }}>
                                <Grid container direction="row">
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}></Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.chatHeader} />
                                            <Tooltip title={`${t(langKeys.chatHeaderTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <ColorInput hex={headerColor} onChange={handleHeaderColorChange} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: 10 }}>
                                <Grid container direction="row">
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}></Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.chatBackground} />
                                            <Tooltip
                                                title={`${t(langKeys.chatBackgroundTooltip)}`}
                                                placement="top-start"
                                            >
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <ColorInput hex={backgroundColor} onChange={handleBackgroundColorChange} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: 10 }}>
                                <Grid container direction="row">
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}></Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.chatBorder} />
                                            <Tooltip title={`${t(langKeys.chatBorderTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <ColorInput hex={borderColor} onChange={handleBorderColorChange} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: 10 }}>
                                <Grid container direction="row">
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}></Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.clientMessage} count={2} />
                                        </label>
                                        <Tooltip
                                            title={`${t(langKeys.clientMessageColorTooltip)}`}
                                            placement="top-start"
                                        >
                                            <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <ColorInput
                                            hex={clientMessageColor}
                                            onChange={handleClientMessageColorChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: 10 }}>
                                <Grid container direction="row">
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}></Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.botMessage} count={2} />
                                            <Tooltip title={`${t(langKeys.botMessageTooltip)}`} placement="top-start">
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <ColorInput hex={botMessageColor} onChange={handleBotMessageColorChange} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: 10 }}>
                                <Grid container direction="row">
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}></Grid>
                                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.iconscolorMessage} count={2} />
                                            <Tooltip
                                                title={`${t(langKeys.iconscolorMessageTooltip)}`}
                                                placement="top-start"
                                            >
                                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                            </Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <ColorInput hex={iconscolor} onChange={handleiconscolorChange} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div
                style={{
                    width: "50%",
                    minWidth: 500,
                    display: "flex",
                    paddingLeft: 24,
                    paddingBottom: 24,
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                <div style={{ display: "flex", width: "100%", flexDirection: "column" }} className={classes.tab}>
                    <div
                        style={{
                            padding: 20,
                            margin: "20px 20px 0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: 75,
                            border: "1px solid",
                            borderRadius: "6px 6px 0 0 ",
                            backgroundColor: headerColor,
                            borderColor: borderColor,
                        }}
                    >
                        <Avatar
                            src={getImgUrl(getValues("interface.iconheader")) ?? ""}
                            style={{ width: 35, height: 35, border: "0.1px solid lightgray" }}
                        />
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                paddingLeft: 25,
                                fontSize: "1.1em",
                                paddingTop: 5,
                            }}
                        >
                            {getValues("interface.chattitle")}
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: 45,
                            border: "1px solid",
                            backgroundColor: headerColor,
                            borderColor: borderColor,
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1em",
                                paddingTop: 5,
                            }}
                        >
                            {getValues("interface.chatsubtitle")}
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: "calc(100% - 160px)",
                            border: "1px solid",
                            flexDirection: "column",
                            borderRadius: "0 0 6px 6px",
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                        }}
                    >
                        <div
                            style={{
                                fontSize: "0.8em",
                                paddingTop: 5,
                                width: 50,
                                textAlign: "center",
                                whiteSpace: "initial",
                                wordWrap: "break-word",
                            }}
                        >
                            {getValues("extra.botnametext")}
                        </div>
                        <div style={{ display: "flex", height: "auto", paddingLeft: 10 }}>
                            <Avatar
                                src={getImgUrl(getValues("interface.iconbot")) ?? ""}
                                style={{ width: 30, height: 30, border: "0.1px solid", borderColor: borderColor }}
                            />
                            <div
                                style={{
                                    height: "auto",
                                    width: "80%",
                                    border: "1px solid",
                                    borderColor: borderColor,
                                    backgroundColor: botMessageColor,
                                    borderRadius: 8,
                                    marginLeft: 10,
                                    padding: 10,
                                    fontSize: "1.1em",
                                    paddingTop: 5,
                                }}
                            >
                                Te saluda {getValues("extra.botnametext") || "bot"}. en qúe puedo ayudarte
                            </div>
                        </div>
                        <div
                            style={{
                                height: "auto",
                                width: "80%",
                                border: "1px solid",
                                borderColor: borderColor,
                                borderRadius: 8,
                                backgroundColor: clientMessageColor,
                                marginLeft: "20%",
                                marginTop: 10,
                                padding: 10,
                                fontSize: "1.1em",
                                paddingTop: 5,
                            }}
                        >
                            Hola
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            width: "calc(100% - 40px)",
                            border: "1px solid",
                            borderRadius: "0 0 6px 6px",
                            backgroundColor: "#e7e7e7",
                            borderColor: getValues("color.border"),
                        }}
                    >
                        <div style={{ width: "100%", display: "flex" }}>
                            <div style={{ paddingRight: 10 }}>
                                <IconButton id="circleopenmenu" style={{ padding: 0 }}>
                                    <AddCircleIcon
                                        style={{ width: 35, height: 35, color: getValues("color.iconscolor") }}
                                    />
                                </IconButton>
                            </div>
                            <div style={{ width: "90%" }}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    disabled={true}
                                    size="small"
                                    style={{ backgroundColor: "white" }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SendIcon style={{ color: getValues("color.iconscolor") }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const AndroidInterface: FC<{ setTabIndex: (f: string) => void; form: UseFormReturn<IChatWebAdd> }> = ({
    form,
}) => {
    const classes = useChannelAddStyles();
    const {
        setValue,
        getValues,
        formState: { errors },
    } = form;
    const { t } = useTranslation();
    const [enable, setEnable] = useState(getValues("bubble.active"));
    const [msgTooltip, setMsgTooltip] = useState(getValues("bubble.messagebubble"));
    const [chatTittle, setChatTittle] = useState(getValues("interface.chattitle"));
    const [chatSubtittle, setChatSubtittle] = useState(getValues("interface.chatsubtitle"));
    const [botnametext, setBotnametext] = useState(getValues("extra.botnametext"));
    const [msgTooltipIMGPosition, setMsgTooltipIMGPosition] = useState({
        right: document?.getElementById("msgtooltip")?.clientWidth ?? 0,
        bottom: document?.getElementById("msgtooltip")?.clientHeight ?? 0,
    });
    const [chatBtn, setChatBtn] = useState<ImageData>(getValues("interface.iconbutton"));
    const [waitingImg, setWaitingImg] = useState<ImageData>(getValues("bubble.iconbubble"));
    const [headerBtn, setHeaderBtn] = useState<ImageData>(getValues("interface.iconheader"));
    const [botBtn, setBotBtn] = useState<ImageData>(getValues("interface.iconbot"));
    const chatImgUrl = getImgUrl(chatBtn);
    const waitingImgUrl = getImgUrl(waitingImg);
    const headerImgUrl = getImgUrl(headerBtn);
    const botImgUrl = getImgUrl(botBtn);

    useEffect(() => {
        setMsgTooltipIMGPosition({
            right: document?.getElementById("msgtooltip")?.clientWidth ?? 0,
            bottom: document?.getElementById("msgtooltip")?.clientHeight ?? 0,
        });
    }, [msgTooltip]);

    const handleEnableChange = (checked: boolean) => {
        setEnable(checked);
        setValue("bubble.active", checked);
    };

    const onChangeChatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setChatBtn(e.target.files[0]);
        setValue("interface.iconbutton", e.target.files[0]);
    };

    const handleChatBtnClick = () => {
        const input = document.getElementById("chatBtnInput");
        input?.click();
    };

    const handleCleanChatInput = () => {
        if (!chatBtn) return;
        const input = document.getElementById("chatBtnInput") as HTMLInputElement;
        input.value = "";
        setChatBtn(null);
        setValue("interface.iconbutton", null);
    };

    const onChangeWaitingInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setWaitingImg(e.target.files[0]);
        setValue("bubble.iconbubble", e.target.files[0]);
    };

    const handleWaitingBtnClick = () => {
        const input = document.getElementById("waitingBtnInput");
        input?.click();
    };

    const handleCleanWaitingInput = () => {
        if (!waitingImg) return;
        const input = document.getElementById("waitingBtnInput") as HTMLInputElement;
        input.value = "";
        setWaitingImg(null);
        setValue("bubble.iconbubble", null);
    };

    const onChangeHeaderInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setHeaderBtn(e.target.files[0]);
        setValue("interface.iconheader", e.target.files[0]);
    };

    const onChangeBotInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setBotBtn(e.target.files[0]);
        setValue("interface.iconbot", e.target.files[0]);
    };

    const handleHeaderBtnClick = () => {
        const input = document.getElementById("headerBtnInput");
        input?.click();
    };

    const handleBotBtnClick = () => {
        const input = document.getElementById("botBtnInput");
        input?.click();
    };

    const handleCleanHeaderInput = () => {
        if (!headerBtn) return;
        const input = document.getElementById("headerBtnInput") as HTMLInputElement;
        input.value = "";
        setHeaderBtn(null);
        setValue("interface.iconheader", null);
    };

    const handleCleanBotInput = () => {
        if (!botBtn) return;
        const input = document.getElementById("botBtnInput") as HTMLInputElement;
        input.value = "";
        setBotBtn(null);
        setValue("interface.iconbot", null);
    };

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "50%", minWidth: 500, borderRight: "2px solid #76acdc", padding: 10 }}>
                <Grid container direction="column">
                    <Grid container direction="row" style={{ display: "flex", width: "100%", margin: "5px 8px" }}>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.chatButton} />
                                <Tooltip title={`${t(langKeys.chatButtonTooltip)}`} placement="top-start">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                <div className={classes.imgContainer}>
                                    {chatImgUrl && <img src={chatImgUrl} alt="icon button" className={classes.img} />}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-around",
                                        marginLeft: 12,
                                    }}
                                >
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="chatBtnInput"
                                        type="file"
                                        onChange={onChangeChatInput}
                                    />
                                    <IconButton onClick={handleChatBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanChatInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                            <FormHelperText
                                error={!isEmpty(errors?.interface?.iconbutton?.message)}
                                style={{ marginLeft: 14 }}
                            >
                                {errors?.interface?.iconbutton?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.bubble} />
                                        <Tooltip title={`${t(langKeys.bubbleTooltip)}`} placement="top-start">
                                            <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <IOSSwitch checked={enable} onChange={(_, v) => handleEnableChange(v)} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1} style={{ display: enable ? "block" : "none" }}>
                            <Grid container direction="row">
                                <Grid item xs={1} sm={2} md={2} lg={2} xl={2} />
                                <Grid item xs={11} sm={2} md={2} lg={2} xl={2}>
                                    <label className={classes.text}>{t(langKeys.text)}</label>
                                    <Tooltip title={`${t(langKeys.bubbleTooltipText)}`} placement="top-start">
                                        <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder={t(langKeys.textOfTheMessage)}
                                        name="text"
                                        size="small"
                                        defaultValue={getValues("bubble.messagebubble")}
                                        onChange={(e) => {
                                            setValue("bubble.messagebubble", e.target.value);
                                            setMsgTooltip(e.target.value);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container direction="row" style={{ width: "100%", display: enable ? "flex" : "none" }}>
                        <Grid item xs={1} sm={2} md={2} lg={2} xl={2} />
                        <Grid item xs={11} sm={2} md={2} lg={2} xl={2}>
                            <label className={classes.text} style={{ margin: "5px 8px" }}>
                                <Trans i18nKey={langKeys.image} />
                                <Tooltip title={`${t(langKeys.bubbleTooltipImage)}`} placement="top-start">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                <div className={classes.imgContainer}>
                                    {waitingImgUrl && (
                                        <img src={waitingImgUrl} alt="bubble button" className={classes.img} />
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-around",
                                        marginLeft: 12,
                                    }}
                                >
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="waitingBtnInput"
                                        type="file"
                                        onChange={onChangeWaitingInput}
                                    />
                                    <IconButton onClick={handleWaitingBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanWaitingInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.title} />
                                        <Tooltip title={`${t(langKeys.interfaceTitleTooltip)}`} placement="top-start">
                                            <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="titulo"
                                        size="small"
                                        placeholder={t(langKeys.chatHeaderTitle)} // "Título de la cabecera del chat"
                                        defaultValue={getValues("interface.chattitle")}
                                        onChange={(e) => {
                                            setValue("interface.chattitle", e.target.value);
                                            setChatTittle(e.target.value);
                                        }}
                                        error={!isEmpty(errors?.interface?.chattitle?.message)}
                                        helperText={errors?.interface?.chattitle?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.subtitle} />
                                        <Tooltip
                                            title={`${t(langKeys.interfaceSubtitleTooltip)}`}
                                            placement="top-start"
                                        >
                                            <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder={t(langKeys.chatHeaderSubtitle)}
                                        name="subtitulo"
                                        size="small"
                                        defaultValue={getValues("interface.chatsubtitle")}
                                        onChange={(e) => {
                                            setValue("interface.chatsubtitle", e.target.value);
                                            setChatSubtittle(e.target.value);
                                        }}
                                        error={!isEmpty(errors?.interface?.chatsubtitle?.message)}
                                        helperText={errors?.interface?.chatsubtitle?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container direction="row" style={{ display: "flex", width: "100%", margin: "5px 8px" }}>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.header} />
                                <Tooltip title={`${t(langKeys.headerTooltip)}`} placement="top-start">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                <div className={classes.imgContainer}>
                                    {headerImgUrl && (
                                        <img src={headerImgUrl} alt="header button" className={classes.img} />
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-around",
                                        marginLeft: 12,
                                    }}
                                >
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="headerBtnInput"
                                        type="file"
                                        onChange={onChangeHeaderInput}
                                    />
                                    <IconButton onClick={handleHeaderBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanHeaderInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                            <FormHelperText
                                error={!isEmpty(errors?.interface?.iconheader?.message)}
                                style={{ marginLeft: 14 }}
                            >
                                {errors?.interface?.iconheader?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" style={{ display: "flex", width: "100%", margin: "5px 8px" }}>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.botButton} />
                                <Tooltip title={`${t(langKeys.botButtonTooltip)}`} placement="top-start">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                <div className={classes.imgContainer}>
                                    {botImgUrl && <img src={botImgUrl} alt="bot button" className={classes.img} />}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-around",
                                        marginLeft: 12,
                                    }}
                                >
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="botBtnInput"
                                        type="file"
                                        onChange={onChangeBotInput}
                                    />
                                    <IconButton onClick={handleBotBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanBotInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                            <FormHelperText
                                error={!isEmpty(errors?.interface?.iconbot?.message)}
                                style={{ marginLeft: 14 }}
                            >
                                {errors?.interface?.iconbot?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.botName} />
                                        <Tooltip title={`${t(langKeys.botNameTooltip)}`} placement="top-start">
                                            <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="titulo"
                                        size="small"
                                        placeholder={t(langKeys.botName)}
                                        defaultValue={getValues("extra.botnametext")}
                                        onChange={(e) => {
                                            setValue("extra.botnametext", e.target.value);
                                            setBotnametext(e.target.value);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <div
                style={{
                    width: "50%",
                    minWidth: 500,
                    display: "flex",
                    paddingLeft: 24,
                    paddingBottom: 24,
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                <div>
                    <Typography variant="h6">{t(langKeys.homepage)}</Typography>
                </div>
                <div style={{ display: "flex", width: "100%" }} className={classes.tab}>
                    <HtmlTooltip
                        arrow
                        open={enable}
                        placement="top-end"
                        title={
                            <React.Fragment>
                                {Boolean(waitingImgUrl) && (
                                    <Avatar
                                        src={waitingImgUrl ?? ""}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            border: "0.1px solid lightgray",
                                            position: "absolute",
                                            right: msgTooltipIMGPosition.right,
                                            bottom: msgTooltipIMGPosition.bottom,
                                        }}
                                    />
                                )}
                                <Typography color="inherit" id="msgtooltip">
                                    {msgTooltip}
                                </Typography>
                            </React.Fragment>
                        }
                    >
                        <Avatar
                            src={chatImgUrl ?? ""}
                            style={{
                                width: 75,
                                height: 75,
                                border: "0.1px solid lightgray",
                                top: "calc(50% - 38px)",
                                left: "calc(50% - 38px)",
                            }}
                        />
                    </HtmlTooltip>
                </div>
                <div>
                    <Typography variant="h6">Chat</Typography>
                </div>
                <div style={{ display: "flex", width: "100%", flexDirection: "column" }} className={classes.tab}>
                    <div
                        style={{
                            padding: 20,
                            margin: "20px 20px 0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: 75,
                            border: "#A59F9F 1px solid",
                            borderRadius: "6px 6px 0 0 ",
                        }}
                    >
                        <Avatar
                            src={headerImgUrl ?? ""}
                            style={{ width: 35, height: 35, border: "0.1px solid lightgray" }}
                        />
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                paddingLeft: 25,
                                fontSize: "1.1em",
                                paddingTop: 5,
                            }}
                        >
                            {chatTittle}
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: 45,
                            border: "#A59F9F 1px solid",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1em",
                                paddingTop: 5,
                            }}
                        >
                            {chatSubtittle}
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            margin: "0 20px",
                            display: "flex",
                            width: "calc(100% - 40px)",
                            height: "calc(100% - 160px)",
                            border: "#A59F9F 1px solid",
                            flexDirection: "column",
                            borderRadius: "0 0 6px 6px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "0.8em",
                                paddingTop: 5,
                                width: 50,
                                textAlign: "center",
                                whiteSpace: "initial",
                                wordWrap: "break-word",
                            }}
                        >
                            {botnametext}
                        </div>
                        <div style={{ display: "flex", height: 30, paddingLeft: 10 }}>
                            <Avatar
                                src={botImgUrl ?? ""}
                                style={{ width: 30, height: 30, border: "0.1px solid lightgray" }}
                            />
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    paddingLeft: 10,
                                    fontSize: "1.1em",
                                    paddingTop: 5,
                                }}
                            >
                                Te saluda {botnametext}. en qúe puedo ayudarte
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const ChannelAddAndroidDetail: FC<{ form: UseFormReturn<IChatWebAdd>; setView: (val: string) => void }> = ({
    form,
    setView,
}) => {
    const classes = useChannelAddStyles();
    const [tabIndex, setTabIndex] = useState("0");
    const { t } = useTranslation();
    const handleNext = () => {
        form.handleSubmit(() => setView("view-2"))();
    };
    return (
        <>
            <div style={{ height: 20 }} />
            <div style={{ display: "flex", width: "100%", paddingLeft: "calc(27.5% - 240px)", minWidth: 500 }}>
                <div style={{ display: "flex" }}>
                    <div
                        className={clsx(
                            classes.step,
                            tabIndex === "0" && classes.currentStep,
                            tabIndex > "0" && classes.previousStep,
                            tabIndex < "0" && classes.nextStep
                        )}
                    >
                        {t(langKeys.step)} 1
                    </div>
                    <div
                        className={clsx(
                            classes.arrowRight,
                            tabIndex === "0" && classes.currentArrow,
                            tabIndex > "0" && classes.previousArrow,
                            tabIndex < "0" && classes.nextArrow
                        )}
                    ></div>
                </div>
                <div className={classes.separator}> </div>
                <div style={{ display: "flex" }}>
                    <div
                        className={clsx(
                            classes.step,
                            tabIndex === "1" && classes.currentStep,
                            tabIndex > "1" && classes.previousStep,
                            tabIndex < "1" && classes.nextStep
                        )}
                    >
                        {t(langKeys.step)} 2
                    </div>
                    <div
                        className={clsx(
                            classes.arrowRight,
                            tabIndex === "1" && classes.currentArrow,
                            tabIndex > "1" && classes.previousArrow,
                            tabIndex < "1" && classes.nextArrow
                        )}
                    ></div>
                </div>
                <div className={classes.separator}> </div>
                <div style={{ display: "flex" }}>
                    <div
                        className={clsx(
                            classes.step,
                            tabIndex === "2" && classes.currentStep,
                            tabIndex > "2" && classes.previousStep,
                            tabIndex < "2" && classes.nextStep
                        )}
                    >
                        {t(langKeys.step)} 3
                    </div>
                    <div
                        className={clsx(
                            classes.arrowRight,
                            tabIndex === "2" && classes.currentArrow,
                            tabIndex > "2" && classes.previousArrow,
                            tabIndex < "2" && classes.nextArrow
                        )}
                    ></div>
                </div>
                <div className={classes.separator}> </div>
                <div style={{ display: "flex" }}>
                    <div
                        className={clsx(
                            classes.step,
                            tabIndex === "3" && classes.currentStep,
                            tabIndex > "3" && classes.previousStep,
                            tabIndex < "3" && classes.nextStep
                        )}
                    >
                        {t(langKeys.step)} 4
                    </div>
                    <div
                        className={clsx(
                            classes.arrowRight,
                            tabIndex === "3" && classes.currentArrow,
                            tabIndex > "3" && classes.previousArrow,
                            tabIndex < "3" && classes.nextArrow
                        )}
                    ></div>
                </div>
            </div>
            <div style={{ height: 20 }} />
            <AppBar position="static" elevation={0}>
                <Tabs
                    value={tabIndex}
                    className={classes.tabs}
                    onChange={(_, i: string) => setTabIndex(i)}
                    TabIndicatorProps={{ style: { display: "none" } }}
                >
                    <Tab
                        className={clsx(classes.tab, tabIndex === "0" && classes.activetab)}
                        label={<Trans i18nKey={langKeys.chatinterface} />}
                        value="0"
                    />
                    <Tab
                        className={clsx(classes.tab, tabIndex === "1" && classes.activetab)}
                        label={<Trans i18nKey={langKeys.color} count={2} />}
                        value="1"
                    />
                    <Tab
                        className={clsx(classes.tab, tabIndex === "2" && classes.activetab)}
                        label={<Trans i18nKey={langKeys.form} />}
                        value="2"
                    />
                    <Tab
                        className={clsx(classes.tab, tabIndex === "3" && classes.activetab)}
                        label={<Trans i18nKey={langKeys.extra} count={2} />}
                        value="3"
                    />
                </Tabs>
            </AppBar>
            <TabPanel value="0" index={tabIndex}>
                <AndroidInterface form={form} setTabIndex={setTabIndex} />
            </TabPanel>
            <TabPanel value="1" index={tabIndex}>
                <AndroidColor form={form} setTabIndex={setTabIndex} />
            </TabPanel>
            <TabPanel value="2" index={tabIndex}>
                <AndroidForm form={form} setTabIndex={setTabIndex} />
            </TabPanel>
            <TabPanel value="3" index={tabIndex}>
                <AndroidExtra form={form} setTabIndex={setTabIndex} />
            </TabPanel>
            <div style={{ height: 20 }} />
            <Button variant="contained" color="primary" onClick={handleNext} fullWidth>
                <Trans i18nKey={langKeys.next} />
            </Button>
        </>
    );
};

const useFinalStepStyles = makeStyles(() => ({
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "2em",
        color: "#7721ad",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "180px",
    },
}));
interface ChannelAddEndProps {
    loading: boolean;
    integrationId?: string;
    onSubmit: (name: string, auto: boolean, hexIconColor: string) => void;
    onClose?: () => void;
    channel: IChannel | null;
}

const ChannelAndroidAddEnd: FC<ChannelAddEndProps> = ({ onSubmit, loading, integrationId, channel }) => {
    const classes = useFinalStepStyles();
    const auto = true;

    const { t } = useTranslation();

    const [name, setName] = useState(channel?.communicationchanneldesc ?? "");
    const [coloricon, setColoricon] = useState("#90c900");
    const [hexIconColor, setHexIconColor] = useState(channel?.coloricon ?? "#90c900");

    const handleSave = () => {
        onSubmit(name, auto, hexIconColor);
    };

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <div>
                <div
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "2em",
                        color: "#7721ad",
                        padding: "20px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        maxWidth: "800px",
                    }}
                >
                    {t(langKeys.commchannelfinishreg)}
                </div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <FieldEdit
                        onChange={(value) => setName(value)}
                        label={t(langKeys.givechannelname)}
                        className="col-6"
                        disabled={loading || (`${integrationId}` !== "" && `${integrationId}` !== "undefined")}
                        valueDefault={channel?.communicationchanneldesc}
                    />
                </div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <Box color="textPrimary" fontSize={14} fontWeight={500} lineHeight="18px" mb={1}>
                            {t(langKeys.givechannelcolor)}
                        </Box>
                        <div
                            style={{
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "space-around",
                                marginTop: "20px",
                            }}
                        >
                            <ChannelAndroid style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
                            <ColorInput
                                hex={hexIconColor}
                                onChange={(e) => {
                                    setHexIconColor(e.hex);
                                    setColoricon(e.hex);
                                }}
                            />
                        </div>
                    </div>
                </div>
                {(channel?.communicationchannelsite && channel?.status === "ACTIVO") && <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: 120,
                        marginRight: 120,
                    }}
                >
                    <pre
                        style={{
                            background: "#f4f4f4",
                            border: "1px solid #ddd",
                            color: "#666",
                            pageBreakInside: "avoid",
                            fontFamily: "monospace",
                            lineHeight: 1.6,
                            maxWidth: "100%",
                            overflow: "auto",
                            padding: "1em 1.5em",
                            display: "block",
                            wordWrap: "break-word",
                        }}
                    >
                        <code>
                            {`<script src="https://zyxmelinux.zyxmeapp.com/zyxme/chat/src/chatwebclient.min.js" integrationid="${channel?.communicationchannelsite}"></script>`}
                        </code>
                    </pre>
                    <div style={{ height: 20 }} />
                </div>}
                <div style={{ paddingLeft: "80%" }}>
                    <Button
                        onClick={handleSave}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={!name || loading || (`${integrationId}` !== "" && `${integrationId}` !== "undefined")}
                    >
                        <Trans i18nKey={langKeys.finishreg} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const ChannelAddAndroid: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [showScript, setShowScript] = useState(false);
    const [integrationId, setIntegrationId] = useState<string | undefined>(undefined);
    const [view, setView] = useState("view-1");

    const history = useHistory();
    const dispatch = useDispatch();
    const service = useRef<IChatWebAdd | null>(null);
    const location = useLocation<WhatsAppData>();
    const insertChannel = useSelector((state) => state.channel.insertChannel);
    const editChannel = useSelector((state) => state.channel.editChannel);
    const whatsAppData = location.state as WhatsAppData | null;
    const channel = whatsAppData?.row ? (whatsAppData?.row as IChannel | null) : (location.state as IChannel | null);
    const [viewSelected, setViewSelected] = useState("main-view");

    useEffect(() => {
        dispatch(getMultiCollection([getInputValidationSel(0)]));
    }, []);

    useEffect(() => {
        if (insertChannel.loading) return;
        if (insertChannel.error === true) {
            dispatch(
                showSnackbar({
                    message: insertChannel.message ?? "error_unexpected_error",
                    show: true,
                    severity: "error",
                })
            );
        } else if (insertChannel.value) {
            dispatch(showBackdrop(false));
            setShowScript(true);
            dispatch(
                showSnackbar({
                    message: t(langKeys.channelcreatesuccess),
                    show: true,
                    severity: "success",
                })
            );

            if (whatsAppData?.onboarding) {
                history.push(paths.METACHANNELS, whatsAppData);
            }
        }
    }, [dispatch, insertChannel, t]);

    useEffect(() => {
        if (editChannel.loading) return;
        if (editChannel.error === true) {
            dispatch(
                showSnackbar({
                    message: editChannel.message ?? "error_unexpected_error",
                    show: true,
                    severity: "error",
                })
            );
        } else if (editChannel.success) {
            if (!channel?.haveflow) {
                setViewSelected("enable-virtual-assistant")
            } else {
                dispatch(showBackdrop(false));
                setShowScript(true);
                dispatch(
                    showSnackbar({
                        message: t(langKeys.channeleditsuccess),
                        show: true,
                        severity: "success",
                    })
                );

                if (whatsAppData?.onboarding) {
                    updateMetachannels(22);
                    history.push(paths.METACHANNELS, whatsAppData);
                } else {
                    history.push(paths.CHANNELS);
                }
            }

        }
    }, [dispatch, editChannel]);

    const form: UseFormReturn<IChatWebAdd> = useForm<IChatWebAdd>({
        defaultValues: service.current ?? {
            interface: {
                chattitle: "",
                chatsubtitle: "",
                iconbutton: null,
                iconheader: null,
                iconbot: null,
            },
            color: {
                header: "#fff",
                background: "#F9F9FA",
                border: "#EBEAED",
                client: "#fff",
                bot: "#aa53e0",
                iconscolor: "#aa53e0",
            },
            form: [],
            bubble: {
                active: true,
                messagebubble: "",
                iconbubble: null,
            },
            extra: {
                uploadfile: true,
                uploadaudio: true,
                uploadimage: true,
                uploadlocation: true,
                uploadvideo: true,
                reloadchat: true,
                poweredby: true,

                persistentinput: true,
                abandonevent: true,
                alertsound: true,
                formhistory: true,
                enablemetadata: true,

                customcss: "",
                customjs: "",

                botnameenabled: true,
                botnametext: "",
            },
        },
    });

    useEffect(() => {
        if (insertChannel.value?.integrationId) {
            setIntegrationId(insertChannel?.value?.integrationId);
        }
    }, [insertChannel]);

    useEffect(() => {
        const mandatoryStrField = (value: string) => {
            return value.length === 0 ? t(langKeys.field_required) : undefined;
        };

        const mandatoryFileField = (value: string | File | null) => {
            return !value ? t(langKeys.field_required) : undefined;
        };

        form.register("interface.chattitle", { validate: mandatoryStrField });
        form.register("interface.chatsubtitle", { validate: mandatoryStrField });
        form.register("interface.iconbutton", { validate: mandatoryFileField });
        form.register("interface.iconheader", { validate: mandatoryFileField });
        form.register("interface.iconbot", { validate: mandatoryFileField });
    }, [form, t]);

    const handleSubmit = (name: string, auto: boolean, hexIconColor: string) => {
        const values = form.getValues();
        dispatch(showBackdrop(true));
        if (!channel?.appintegrationid || channel?.onboarding === true) {
            const body = getInsertChatwebChannel(0, name, auto, hexIconColor, values, "SMOOCHANDROID", true);
            dispatch(insertChannel2(body));
        } else if (channel.status === "INACTIVO") {
            const id = channel.communicationchannelid;
            const body = getInsertChatwebChannel(id, name, auto, hexIconColor, values, "SMOOCHANDROID", false);
            dispatch(insertChannel2(body));
        } else {
            const id = channel.communicationchannelid;
            const body = getEditChatWebChannel(id, channel, values, name, auto, hexIconColor, "SMOOCHANDROID");
            dispatch(getEditChannel(body, "SMOOCHANDROID"));
        }
    }
    if (edit && !channel) {
        return <div />;
    }
    const handleend = () => {
        setViewSelected("enable-virtual-assistant")
    }
    if (viewSelected === "enable-virtual-assistant") {
        return <ChannelEnableVirtualAssistant
            communicationchannelid={insertChannel?.value?.result?.ufn_communicationchannel_ins || null}
        />
    }

    return (
        <div style={{ width: "100%" }}>
            <Breadcrumbs
                aria-label="breadcrumb"
                style={{ display: (!showScript && view) === "view-1" ? "block" : "none" }}
            >
                <Link
                    color="textSecondary"
                    key={"mainview"}
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        if (whatsAppData?.onboarding) {
                            dispatch(manageConfirmation({
                                visible: true,
                                title: t(langKeys.confirmation),
                                question: t(langKeys.channelconfigsave),
                                callback: () => {
                                    handleSubmit("DEFAULT", false, "#90c900");
                                },
                                callbackcancel: () => {
                                    history.push(paths.METACHANNELS, whatsAppData);
                                },
                                textCancel: t(langKeys.decline),
                                textConfirm: t(langKeys.accept),
                                isBold: true,
                                showClose: true,
                            }))
                        } else {
                            channel?.status === "INACTIVO"
                                ? history.push(paths.CHANNELS, whatsAppData)
                                : history.push(paths.CHANNELS_ADD, whatsAppData);
                        }
                    }}
                >
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <Breadcrumbs
                aria-label="breadcrumb"
                style={{ display: (!showScript && view) === "view-2" ? "block" : "none" }}
            >
                <Link
                    color="textSecondary"
                    key="mainview"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        setView("view-1");
                    }}
                >
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            {view === "view-1" && <ChannelAddAndroidDetail form={form} setView={setView} />}
            {view === "view-2" && (
                <>
                    {!showScript && (
                        <ChannelAndroidAddEnd
                            loading={insertChannel.loading || editChannel.loading}
                            integrationId={integrationId}
                            onSubmit={handleSubmit}
                            onClose={() => setView("view-1")}
                            channel={channel}
                        />
                    )}
                    <div style={{ display: showScript ? "flex" : "none", height: 10 }} />
                    <div style={{ display: showScript ? "flex" : "none", height: 10 }} />
                    <div
                        style={{
                            display: showScript ? "flex" : "none",
                            flexDirection: "column",
                            marginLeft: 120,
                            marginRight: 120,
                        }}
                    >
                        {t(langKeys.androidlibrary)}
                    </div>
                    <div
                        style={{
                            display: showScript ? "flex" : "none",
                            flexDirection: "column",
                            marginLeft: 120,
                            marginRight: 120,
                        }}
                    >
                        <pre
                            style={{
                                background: "#f4f4f4",
                                border: "1px solid #ddd",
                                color: "#666",
                                pageBreakInside: "avoid",
                                fontFamily: "monospace",
                                lineHeight: 1.6,
                                maxWidth: "100%",
                                overflow: "auto",
                                padding: "1em 1.5em",
                                display: "block",
                                wordWrap: "break-word",
                            }}
                        >
                            <code>
                                {`<script src="https://zyxmelinux.zyxmeapp.com/zyxme/chat/src/chatwebclient.min.js" integrationid="${integrationId}"></script>`}
                            </code>
                        </pre>
                        <div style={{ height: 20 }} />
                        <Button variant="contained" color="primary" onClick={() => {
                            if (whatsAppData?.onboarding) {
                                updateMetachannels(22);
                                history.push(paths.METACHANNELS, whatsAppData);
                            } else {
                                history.push(paths.CHANNELS);
                            }
                        }}>
                            {t(langKeys.close)}
                        </Button>
                    </div>
                    <div style={{ display: showScript ? "flex" : "none", height: 20 }}></div>
                </>
            )}
        </div>
    );
};

export default ChannelAddAndroid;