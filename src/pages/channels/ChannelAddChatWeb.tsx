import { ChannelChat01 } from "icons";
import { Close, CloudUpload } from "@material-ui/icons";
import { ColorChangeHandler } from "react-color";
import { ColorInput, FieldEdit, IOSSwitch } from "components";
import { getEditChatWebChannel, getInsertChatwebChannel } from "common/helpers";
import { IChannel, IChatWebAdd, IChatWebAddFormField } from "@types";
import { langKeys } from "lang/keys";
import { showSnackbar } from "store/popus/actions";
import { TabPanel } from "pages/crm/components";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import ChannelEnableVirtualAssistant from './ChannelEnableVirtualAssistant';
import {
    AppBar,
    Box,
    Button,
    makeStyles,
    Link,
    Tab,
    Tabs,
    Typography,
    TextField,
    Grid,
    Select,
    IconButton,
    FormControl,
    MenuItem,
    Divider,
    Breadcrumbs,
    FormHelperText,
} from "@material-ui/core";

import {
    editChannel as getEditChannel,
    insertChannel2,
    resetInsertChannel,
    resetEditChannel,
} from "store/channel/actions";

import clsx from "clsx";
import paths from "common/constants/paths";
import React, { FC, useEffect, useRef, useState } from "react";

interface FieldTemplate {
    text: React.ReactNode;
    node: (
        onClose: (key: string) => void,
        data: IChatWebAddFormField,
        form: UseFormReturn<IChatWebAdd>,
        index: number
    ) => React.ReactNode;
    data: IChatWebAddFormField;
}

type ImageType = File | string | null;

const getImgUrl = (file: ImageType): string | null => {
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

const isEmpty = (str?: string) => {
    return !str || str.length === 0;
};

const useTabInterfacetyles = makeStyles((theme) => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
    icon: {
        "&:hover": {
            cursor: "pointer",
            color: theme.palette.primary.main,
        },
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
}));

const TabPanelInterface: FC<{ form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const {
        setValue,
        getValues,
        formState: { errors },
    } = form;

    const classes = useTabInterfacetyles();

    const { t } = useTranslation();

    const [headerBtn, setHeaderBtn] = useState<ImageType>(getValues("interface.iconbutton"));
    const [botBtn, setBotBtn] = useState<ImageType>(getValues("interface.iconbot"));
    const [chatBtn, setChatBtn] = useState<ImageType>(getValues("interface.iconbutton"));

    const handleChatBtnClick = () => {
        const input = document.getElementById("chatBtnInput");
        input?.click();
    };

    const handleHeaderBtnClick = () => {
        const input = document.getElementById("headerBtnInput");
        input?.click();
    };

    const handleBotBtnClick = () => {
        const input = document.getElementById("botBtnInput");
        input?.click();
    };

    const onChangeChatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setChatBtn(e.target.files[0]);
        setValue("interface.iconbutton", e.target.files[0]);
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

    const handleCleanChatInput = () => {
        if (!chatBtn) return;
        const input = document.getElementById("chatBtnInput") as HTMLInputElement;
        input.value = "";
        setChatBtn(null);
        setValue("interface.iconbutton", null);
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

    const chatImgUrl = getImgUrl(chatBtn);
    const headerImgUrl = getImgUrl(headerBtn);
    const botImgUrl = getImgUrl(botBtn);

    return (
        <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.title} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder={t(langKeys.chatHeaderTitle)} // "Título de la cabecera del chat"
                                name="titulo"
                                size="small"
                                defaultValue={getValues("interface.chattitle")}
                                onChange={(e) => setValue("interface.chattitle", e.target.value)}
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
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.subtitle} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder={t(langKeys.chatHeaderSubtitle)}
                                name="subtitulo"
                                size="small"
                                defaultValue={getValues("interface.chatsubtitle")}
                                onChange={(e) => setValue("interface.chatsubtitle", e.target.value)}
                                error={!isEmpty(errors?.interface?.chatsubtitle?.message)}
                                helperText={errors?.interface?.chatsubtitle?.message}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.chatButton} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
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
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.header} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
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
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.botButton} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
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
                </Box>
            </Grid>
        </Grid>
    );
};

const useTabColorStyles = makeStyles((theme) => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    colorOption: {
        width: 28,
        height: 28,
        padding: 0,
        minWidth: 28,
        minHeight: 28,
    },
}));

const TabPanelColors: FC<{ form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const { setValue, getValues } = form;
    const classes = useTabColorStyles();
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
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.chatHeader} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={headerColor} onChange={handleHeaderColorChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.chatBackground} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={backgroundColor} onChange={handleBackgroundColorChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.chatBorder} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={borderColor} onChange={handleBorderColorChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.clientMessage} count={2} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={clientMessageColor} onChange={handleClientMessageColorChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.botMessage} count={2} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={botMessageColor} onChange={handleBotMessageColorChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.iconscolorMessage} count={2} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={iconscolor} onChange={handleiconscolorChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

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

interface NameTemplateProps {
    onClose: () => void;
    form: UseFormReturn<IChatWebAdd>;
    title: React.ReactNode;
    data: IChatWebAddFormField;
    index: number;
}

const NameTemplate: FC<NameTemplateProps> = ({ data, onClose, title, form, index }) => {
    const classes = useTemplateStyles();
    const { t } = useTranslation();
    const [required, setRequired] = useState(data.required);
    const handleRequired = (checked: boolean) => {
        setRequired(checked);
        data.required = checked;
    };

    return (
        <div className={classes.root}>
            <div className={classes.headertitle}>
                <label className={clsx(classes.title, classes.fieldContainer)}>{title}</label>
                <IconButton color="primary" onClick={onClose} className={classes.closeBtn}>
                    <Close color="primary" className="fa fa-plus-circle" />
                </IconButton>
            </div>
            <div style={{ height: 18 }} />
            <Grid container direction="column">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                            <Grid container direction="column">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row" style={{ minHeight: 40 }}>
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.required} />
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <IOSSwitch
                                                    checked={required}
                                                    onChange={(_, v) => {
                                                        handleRequired(v);
                                                        form.setValue(`form.${index}.required`, v);
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.label} />
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField
                                                    placeholder={t(langKeys.label)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        form.setValue(`form.${index}.label`, e.target.value);
                                                        data.label = e.target.value;
                                                    }}
                                                    defaultValue={data.label}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                            <Grid container direction="column">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>Placeholder</label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField
                                                    placeholder="Placeholder"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        form.setValue(`form.${index}.placeholder`, e.target.value);
                                                        data.placeholder = e.target.value;
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
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.errorText} />
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField
                                                    placeholder={t(langKeys.errorText)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        form.setValue(`form.${index}.validationtext`, e.target.value);
                                                        data.validationtext = e.target.value;
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
                {data.field !== "DOCUMENTTYPE" && (
                    <>
                        <Divider style={{ margin: "22px 0" }} />
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box m={1}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.inputValidation} />
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={10}>
                                        <TextField
                                            placeholder={t(langKeys.inputValidation)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            onChange={(e) => {
                                                form.setValue(`form.${index}.inputvalidation`, e.target.value);
                                                data.inputvalidation = e.target.value;
                                            }}
                                            defaultValue={data.inputvalidation}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box m={1}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
                                        <label className={classes.text}>
                                            <Trans i18nKey={langKeys.validationOnKeychange} />
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={10}>
                                        <TextField
                                            placeholder={t(langKeys.validationOnKeychange)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            onChange={(e) => {
                                                form.setValue(`form.${index}.keyvalidation`, e.target.value);
                                                data.keyvalidation = e.target.value;
                                            }}
                                            defaultValue={data.keyvalidation}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </>
                )}
            </Grid>
        </div>
    );
};

const useTabFormStyles = makeStyles(() => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
}));

const FIRSTNAME_FIELD = "FIRSTNAME_FIELD";
const LASTNAME_FIELD = "LASTNAME_FIELD";
const PHONE_FIELD = "PHONE_FIELD";
const EMAIL_FIELD = "EMAIL_FIELD";
const DOCUMENT_FIELD = "DOCUMENT_FIELD";
const DOCUMENTTYPE_FIELD = "DOCUMENTTYPE_FIELD";
const SUPPLYNUMBER_FIELD = "SUPPLYNUMBER_FIELD";
const CONTACT = "CONTACT_FIELD";

const templates: { [x: string]: FieldTemplate } = {
    [FIRSTNAME_FIELD]: {
        text: <Trans i18nKey={langKeys.name} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(FIRSTNAME_FIELD)}
                    key={FIRSTNAME_FIELD}
                    title={<Trans i18nKey={langKeys.name} />}
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
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(LASTNAME_FIELD)}
                    key={LASTNAME_FIELD}
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
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(PHONE_FIELD)}
                    key={PHONE_FIELD}
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
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(EMAIL_FIELD)}
                    key={EMAIL_FIELD}
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
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(DOCUMENT_FIELD)}
                    key={DOCUMENT_FIELD}
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
    [DOCUMENTTYPE_FIELD]: {
        text: <Trans i18nKey={langKeys.docType} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(DOCUMENTTYPE_FIELD)}
                    key={DOCUMENTTYPE_FIELD}
                    title={<Trans i18nKey={langKeys.docType} />}
                />
            );
        },
        data: {
            field: "DOCUMENTTYPE",
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
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(SUPPLYNUMBER_FIELD)}
                    key={SUPPLYNUMBER_FIELD}
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
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(CONTACT)}
                    key={CONTACT}
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

const TabPanelForm: FC<{ form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const classes = useTabFormStyles();
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
    const [fieldList, setFieldList] = useState<React.ReactNode[]>([]);
    const [fields, setFields] = useState<FieldTemplate[]>(defFields.current);

    useEffect(() => {
        form.setValue(
            "form",
            fields.map((x) => x.data)
        );
        if (fields.length) {
            setEnable(true);
        }
        getMenuTemplates();
    }, [fields, form]);

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
        const fieldlist = fields.reduce((acc: any, x: any) => [...acc, x.data.field], []);
        for (const key in templates) {
            if (fieldlist.includes(templates[key].data.field)) continue;
            temp.push(
                <MenuItem key={key} value={key}>
                    {templates[key].text}
                </MenuItem>
            );
        }
        setFieldList(temp);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Grid container direction="column">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Typography className={classes.text}>
                                <Trans i18nKey={langKeys.wantAddFormToSiteQuestion} />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
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
                                    {fieldList}
                                </Select>
                            </FormControl>
                            <Button
                                disabled={fieldTemplate === ""}
                                variant="contained"
                                color="primary"
                                style={{ height: 40, minHeight: 40 }}
                                onClick={handleAddTemplate}
                            >
                                <Trans i18nKey={langKeys.add} /> +
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {fields.map((e, i) => e.node(handleCloseTemplate, e.data, form, i))}
        </div>
    );
};

const useTabBubbleStyles = makeStyles((theme) => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
    icon: {
        "&:hover": {
            cursor: "pointer",
            color: theme.palette.primary.main,
        },
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
}));

const TabPanelBubble: FC<{ form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const { setValue, getValues } = form;
    const classes = useTabBubbleStyles();
    const { t } = useTranslation();
    const [enable, setEnable] = useState(getValues("bubble.active"));
    const [waitingImg, setWaitingImg] = useState<ImageType>(getValues("bubble.iconbubble"));

    const handleWaitingBtnClick = () => {
        const input = document.getElementById("waitingBtnInput");
        input?.click();
    };

    const onChangeWaitingInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setWaitingImg(e.target.files[0]);
        setValue("bubble.iconbubble", e.target.files[0]);
    };

    const handleCleanWaitingInput = () => {
        if (!waitingImg) return;
        const input = document.getElementById("waitingBtnInput") as HTMLInputElement;
        input.value = "";
        setWaitingImg(null);
        setValue("bubble.iconbubble", null);
    };

    const handleEnableChange = (checked: boolean) => {
        setEnable(checked);
        setValue("bubble.active", checked);
    };

    const waitingImgUrl = getImgUrl(waitingImg);

    return (
        <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.enableWaitingMessage} />
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
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>{t(langKeys.text)}</label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder={t(langKeys.textOfTheMessage)}
                                name="text"
                                size="small"
                                defaultValue={getValues("bubble.messagebubble")}
                                onChange={(e) => setValue("bubble.messagebubble", e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1} style={{ display: enable ? "block" : "none" }}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.waitingMessageStyle} />
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
                </Box>
            </Grid>
        </Grid>
    );
};

const useTabExtrasStyles = makeStyles(() => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
}));

const TabPanelExtras: FC<{ form: UseFormReturn<IChatWebAdd> }> = ({ form }) => {
    const { setValue, getValues } = form;
    const classes = useTabExtrasStyles();
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

    const [enableBotName, setEnableBotName] = useState(getValues("extra.botnameenabled"));
    const [withBorder, setWithBorder] = useState(getValues("extra.withBorder"));
    const [withHour, setWithHour] = useState(getValues("extra.withHour"));

    const [iconColorActive, setIconColorActive] = useState(getValues("extra.iconColorActive"));
    const [iconColorDisabled, setIconColorDisabled] = useState(getValues("extra.iconColorDisabled"));

    const handleIconColorActiveChange: ColorChangeHandler = (e) => {
        setIconColorActive(e.hex);
        setValue("extra.iconColorActive", e.hex);
    };

    const handleIconColorDisabledChange: ColorChangeHandler = (e) => {
        setIconColorDisabled(e.hex);
        setValue("extra.iconColorDisabled", e.hex);
    };

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

    const handleWithBorderChange = (checked: boolean) => {
        setWithBorder(checked);
        setValue("extra.withBorder", checked);
    };
    const handleWithHourChange = (checked: boolean) => {
        setWithHour(checked);
        setValue("extra.withHour", checked);
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

    const handleEnableBotNameChange = (checked: boolean) => {
        setEnableBotName(checked);
        setValue("extra.botnameenabled", checked);
    };

    return (
        <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.uploadFile} count={2} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={uploadFile} onChange={(_, v) => handleUploadFileChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.uploadVideo} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={uploadVideo} onChange={(_, v) => handleUploadVideoChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.sendLocation} />
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
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.uploadImage} count={2} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={uploadImage} onChange={(_, v) => handleUploadImageChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.uploadAudio} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={uploadAudio} onChange={(_, v) => handleUploadAudioChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.refreshChat} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={reloadChat} onChange={(_, v) => handleReloadChatChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Powered by</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={poweredBy} onChange={(_, v) => handlePoweredByChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Divider style={{ margin: "22px 0 38px 0" }} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.inputAlwaysEnabled} />
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
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.abandonmentEvent} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={abandonEvent} onChange={(_, v) => handleAbandonEventChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.newMessageRing} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={alertSound} onChange={(_, v) => handleAlertSoundChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.formBaseHistory} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={formHistory} onChange={(_, v) => handleFormHistoryChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.sendMetaData} />
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
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                    variant="outlined"
                    placeholder="CSS Header"
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
                <TextField
                    variant="outlined"
                    placeholder="JS Script"
                    multiline
                    minRows={5}
                    maxRows={10}
                    fullWidth
                    defaultValue={getValues("extra.customjs")}
                    onChange={(e) => setValue("extra.customjs", e.target.value)}
                />
            </Grid>
            <Divider style={{ margin: "22px 0 38px 0" }} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={10} md={9} lg={9} xl={9}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.enableBotName} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={2} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={enableBotName} onChange={(_, v) => handleEnableBotNameChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: enableBotName ? "block" : "none" }}>
                <TextField
                    variant="outlined"
                    placeholder={t(langKeys.botName)}
                    fullWidth
                    defaultValue={getValues("extra.botnametext")}
                    onChange={(e) => setValue("extra.botnametext", e.target.value)}
                />
            </Grid>
            <Divider style={{ margin: "22px 0 38px 0" }} />

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: "0 8px" }}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Border</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={withBorder} onChange={(_, v) => handleWithBorderChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Es necesario las horas</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={withHour} onChange={(_, v) => handleWithHourChange(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Grid container direction="column">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Grid container direction="row">
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <label className={classes.text}>Icono de color activo</label>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <ColorInput
                                            hex={iconColorActive ?? "#fff"}
                                            onChange={handleIconColorActiveChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Grid container direction="column">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Grid container direction="row">
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <label className={classes.text}>Icono de color disabled</label>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <ColorInput
                                            hex={iconColorDisabled ?? "#fff"}
                                            onChange={handleIconColorDisabledChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: 8 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Tamaño de las letras de cliente/bot"
                        fullWidth
                        type="number"
                        defaultValue={getValues("extra.inputTextSize")}
                        onChange={(e) => setValue("extra.inputTextSize", Number(e.target.value))}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: 8 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Estilo de las letras de cliente/bot"
                        fullWidth
                        type="number"
                        defaultValue={getValues("extra.inputTextWeight")}
                        onChange={(e) => setValue("extra.inputTextWeight", Number(e.target.value))}
                    />
                </Grid>
            </Grid>

            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: 8 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Tamaño de las letras del input de texto"
                        fullWidth
                        type="number"
                        defaultValue={getValues("extra.chatTextSize")}
                        onChange={(e) => setValue("extra.chatTextSize", Number(e.target.value))}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ padding: 8 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Estilo de las letras del input de texto"
                        fullWidth
                        type="number"
                        defaultValue={getValues("extra.chatTextWeight")}
                        onChange={(e) => setValue("extra.chatTextWeight", Number(e.target.value))}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: "inherit",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        margin: "20px 0",
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: "8px 0",
        fontSize: 20,
        fontWeight: 500,
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#A59F9F",
    },
    scriptPreview: {
        width: "inherit",
        height: 111,
        minHeight: 111,
        backgroundColor: "white",
        border: "#A59F9F 1px solid",
        margin: "24px 0",
        padding: theme.spacing(2),
        position: "relative",
        overflowWrap: "break-word",
        overflow: "hidden",
    },
    scriptPreviewGradient: {
        backgroundImage: "linear-gradient(transparent, white)",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    scriptPreviewCopyBtn: {
        height: 45,
        width: 123,
        minHeight: 45,
        minWidth: 123,
        top: "50%",
        transform: "translateY(-50%)",
        right: theme.spacing(2),
        position: "absolute",
        alignSelf: "center",
    },
    scriptPreviewFullViewTxt: {
        margin: 0,
        position: "absolute",
        bottom: theme.spacing(1),
        left: "50%",
        transform: "translateX(-50%)",
        height: 24,

        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        KhtmlUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",

        "&:hover": {
            cursor: "pointer",
        },
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "inherit",
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
    activetab: {
        color: "white",
        backgroundColor: theme.palette.primary.main,
    },
}));

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
}

export const ChannelAddChatWeb: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [tabIndex, setTabIndex] = useState("0");
    const [showFinalStep, setShowFinalStep] = useState(false);
    const [viewSelected, setViewSelected] = useState("main-view");

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const insertChannel = useSelector((state) => state.channel.insertChannel);
    const editChannel = useSelector((state) => state.channel.editChannel);
    const service = useRef<IChatWebAdd | null>(null);
    const whatsAppData = location.state as WhatsAppData | null;
    const channel = whatsAppData?.row ? (whatsAppData?.row as IChannel | null) : (location.state as IChannel | null);

    if (!whatsAppData?.row) {
        if (channel && !service.current && channel.servicecredentials.length > 0) {
            service.current = JSON.parse(channel.servicecredentials);
        }
    }

    useEffect(() => {
        if (edit && !channel) {
            history.push(paths.CHANNELS);
        }

        return () => {
            dispatch(resetInsertChannel());
            dispatch(resetEditChannel());
        };
    }, [history, dispatch]);

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
            dispatch(
                showSnackbar({
                    message: t(langKeys.channelcreatesuccess),
                    show: true,
                    severity: "success",
                })
            );
        }
    }, [dispatch, insertChannel, t]);

    useEffect(() => {
        if (editChannel.loading) return;
        if (editChannel.error === true) {
            dispatch(
                showSnackbar({
                    message: insertChannel.message ?? "error_unexpected_error",
                    show: true,
                    severity: "error",
                })
            );
        } else if (editChannel.success) {
            if(edit && !channel?.haveflow){
                setViewSelected("enable-virtual-assistant")
            }else{
                dispatch(showSnackbar({
                    message: t(langKeys.channeleditsuccess),
                    show: true,
                    severity: "success"
                }));
                history.push(paths.CHANNELS);
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
                withBorder: true,
                withHour: true,

                persistentinput: true,
                abandonevent: true,
                alertsound: true,
                formhistory: true,
                enablemetadata: true,

                customcss: "",
                customjs: "",
                iconColorActive: "#fff",
                iconColorDisabled: "#fff",

                botnameenabled: true,
                botnametext: "",
                inputTextSize: 20,
                inputTextWeight: 20,
                chatTextSize: 20,
                chatTextWeight: 20,
            },
        },
    });

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

    const handleNext = () => {
        form.handleSubmit(() => setShowFinalStep(true))();
    };

    const handleSubmit = (name: string, auto: boolean, hexIconColor: string) => {
        const values = form.getValues();
        if (!channel) {
            const body = getInsertChatwebChannel(0, name, auto, hexIconColor, values);
            dispatch(insertChannel2(body));
        } else if (channel.status === "INACTIVO") {
            const id = channel.communicationchannelid;
            const body = getInsertChatwebChannel(id, name, auto, hexIconColor, values);
            dispatch(insertChannel2(body));
        } else {
            const id = channel.communicationchannelid;
            const body = getEditChatWebChannel(id, channel, values, name, auto, hexIconColor);
            dispatch(getEditChannel(body, "CHAZ"));
        }
    };

    const handleGoBack: React.MouseEventHandler = (e) => {
        e.preventDefault();
        if (!insertChannel.value?.integrationid) history.push(paths.CHANNELS);
    };

    if (edit && !channel) {
        return <div />;
    }

    if (viewSelected !== "main-view") {
        return <ChannelEnableVirtualAssistant/>
    }

    return (
        <div className={classes.root}>
            <div style={{ display: showFinalStep ? "none" : "flex", flexDirection: "column" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <h2 className={classes.title}>
                    <Trans i18nKey={langKeys.activeLaraigoOnYourWebsite} />
                </h2>
                <div style={{ height: 20 }} />
                <AppBar position="static" elevation={0}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, i: string) => setTabIndex(i)}
                        className={classes.tabs}
                        TabIndicatorProps={{ style: { display: "none" } }}
                    >
                        <Tab
                            className={clsx(classes.tab, tabIndex === "0" && classes.activetab)}
                            label={<Trans i18nKey={langKeys.interface} />}
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
                            label={<Trans i18nKey={langKeys.bubble} />}
                            value="3"
                        />
                        <Tab
                            className={clsx(classes.tab, tabIndex === "4" && classes.activetab)}
                            label={<Trans i18nKey={langKeys.extra} count={2} />}
                            value="4"
                        />
                    </Tabs>
                </AppBar>
                <TabPanel value="0" index={tabIndex}>
                    <TabPanelInterface form={form} />
                </TabPanel>
                <TabPanel value="1" index={tabIndex}>
                    <TabPanelColors form={form} />
                </TabPanel>
                <TabPanel value="2" index={tabIndex}>
                    <TabPanelForm form={form} />
                </TabPanel>
                <TabPanel value="3" index={tabIndex}>
                    <TabPanelBubble form={form} />
                </TabPanel>
                <TabPanel value="4" index={tabIndex}>
                    <TabPanelExtras form={form} />
                </TabPanel>
                <div style={{ height: 20 }} />
                <Button variant="contained" color="primary" onClick={handleNext}>
                    <Trans i18nKey={langKeys.next} />
                </Button>
            </div>
            <div style={{ display: showFinalStep ? "block" : "none" }}>
                <ChannelAddEnd
                    loading={insertChannel.loading || editChannel.loading}
                    integrationId={insertChannel.value?.integrationid}
                    insertChannel={insertChannel}
                    onSubmit={handleSubmit}
                    onClose={() => setShowFinalStep(false)}
                    channel={channel}
                />
            </div>
        </div>
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
    insertChannel: any;
}

const ChannelAddEnd: FC<ChannelAddEndProps> = ({ onClose, onSubmit, loading, integrationId, channel, insertChannel }) => {
    const classes = useFinalStepStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const [name, setName] = useState(channel?.communicationchanneldesc || "");
    const [enableVirtual, setEnableVirtual] = useState<number|null>(null);
    const [coloricon, setColoricon] = useState("#7721ad");
    const [auto] = useState(true);
    const [hexIconColor, setHexIconColor] = useState(channel?.coloricon || "#7721ad");

    const handleGoBack = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!integrationId) onClose?.();
    };

    const handleSave = () => {
        onSubmit(name, auto, hexIconColor);
    }
    const handleend = () => {
        setEnableVirtual(insertChannel.value.result.ufn_communicationchannel_ins)
    }
    if(enableVirtual){
        return <ChannelEnableVirtualAssistant
            communicationchannelid={enableVirtual}
        />
    }
    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div>
                <div className={classes.title}>
                    <Trans i18nKey={langKeys.commchannelfinishreg} />
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
                            <ChannelChat01 style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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
                <div style={{ paddingLeft: "80%" }}>
                    <Button
                        onClick={handleSave}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={loading || (`${integrationId}` !== "" && `${integrationId}` !== "undefined")}
                    >
                        <Trans i18nKey={langKeys.finishreg} />
                    </Button>
                </div>
            </div>
            <div style={{ display: integrationId ? "flex" : "none", height: 10 }} />
            <div
                style={{
                    display: integrationId ? "flex" : "none",
                    flexDirection: "column",
                    marginLeft: 120,
                    marginRight: 120,
                }}
            >
                {t(langKeys.chatwebstep)}
            </div>
            <div
                style={{
                    display: integrationId ? "flex" : "none",
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
                <Button variant="contained" color="primary" onClick={() => history.push(paths.CHANNELS)}>
                    {t(langKeys.close)}
                </Button>
            </div>
        </div>
    );
};

export default ChannelAddChatWeb;