import React, { FC, useEffect, useState } from "react";
import { activateChannel, insertChannel } from "store/channel/actions";
import { Box, Breadcrumbs, Button, FormControlLabel, makeStyles, TextField } from "@material-ui/core";
import { ChannelWhatsApp01 } from "icons";
import { ColorInput, FieldEdit, IOSSwitch } from "components";
import { IChannel } from "@types";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { styled } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import Link from "@material-ui/core/Link";
import MuiPhoneNumber from "material-ui-phone-number";
import paths from "common/constants/paths";
import ChannelEnableVirtualAssistant from "./ChannelEnableVirtualAssistant";

const useChannelAddStyles = makeStyles(() => ({
    centerbutton: {
        marginBottom: "20px",
        marginLeft: "calc(50% - 96px)",
        marginTop: "30px",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
    button2: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "100%",
    },
    fields1: {
        flex: 1,
        margin: "15px",
    },
    fields2: {
        flex: 1,
    },
    fields3: {
        flex: 1,
        marginLeft: "15px",
    },
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    "& .MuiInput-underline:after": {
        borderBottomColor: "#7721ad",
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: "#7721ad",
        },
    },
    "& label.Mui-focused": {
        color: "#7721ad",
    },
});

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
}

export const ChannelAddWhatsapp: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [channelreg, setChannelreg] = useState(true);
    const [checkedCloud, setCheckedCloud] = useState(false);
    const [coloricon, setColoricon] = useState("#4AC959");
    const [disablebutton, setDisablebutton] = useState(true);
    const [disablebutton2, setDisablebutton2] = useState(true);
    const [disablebutton3, setDisablebutton3] = useState(true);
    const [nextbutton, setNextbutton] = useState(true);
    const [setins, setSetins] = useState(false);
    const [setParameters, setSetParameters] = useState(true);
    const [setRegister360, setSetRegister360] = useState(false);
    const [setRegisterGupshup, setSetRegisterGupshup] = useState(false);
    const [setRegisterMeta, setSetRegisterMeta] = useState(false);
    const [setRegisterSmooch, setSetRegisterSmooch] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);

    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const executeActivationResult = useSelector((state) => state.channel.activateChannel);
    const executeResult = useSelector((state) => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<WhatsAppData>();
    const mainResult = useSelector((state) => state.channel.channelList);
    const whatsAppData = location.state as WhatsAppData | null;
    const set360 = false;
    const setsmooch = false;

    const errors = {
        accesstoken: "",
        brandaddress: "",
        brandname: "",
        customerfacebookid: "",
        email: "",
        firstname: "",
        lastname: "",
        nameassociatednumber: "",
        phone: "",
        phonenumberwhatsappbusiness: "",
    };

    const channel = whatsAppData?.row as IChannel | null;

    if (typeof location?.state === "undefined" || !location?.state) {
        history.push(paths.CHANNELS);
    }

    useEffect(() => {
        if (edit && !whatsAppData?.row) {
            history.push(paths.CHANNELS);
        }
    }, [history]);

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: whatsAppData?.typeWhatsApp === "DIALOG" ? "WHATSAPP" : "WHATSAPPSMOOCH",
        parameters: {
            apikey: "",
            chatflowenabled: true,
            color: "",
            coloricon: "#4AC959",
            communicationchannelowner: "",
            communicationchannelsite: "",
            description: "",
            form: "",
            icons: "",
            id: edit && channel ? channel.communicationchannelid : 0,
            integrationid: "",
            other: "",
            type: "",
            voximplantcallsupervision: false,
        },
        service: {
            accesstoken: "",
            apikey: "",
            apikeyid: "",
            apikeysecret: "",
            appid: "",
            appname: "",
            appnumber: "",
            brandaddress: "",
            brandname: "",
            customerfacebookid: "",
            email: "",
            firstname: "",
            iscloud: false,
            lastname: "",
            nameassociatednumber: "",
            phone: "",
            phonenumberwhatsappbusiness: "",
        },
    });

    async function finishreg() {
        setSetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
        setViewSelected("main");
    }

    useEffect(() => {
        if (!edit && whatsAppData?.typeWhatsApp === "DIALOG") {
            setSetRegister360(true);
            setSetRegisterGupshup(false);
            setSetRegisterMeta(false);
            setSetRegisterSmooch(false);

            const partialField = fields;
            partialField.type = "WHATSAPP";

            setFields(partialField);
        }

        if (!edit && whatsAppData?.typeWhatsApp === "SMOOCH") {
            setSetRegister360(false);
            setSetRegisterGupshup(false);
            setSetRegisterMeta(false);
            setSetRegisterSmooch(true);

            const partialField = fields;
            partialField.type = "WHATSAPPSMOOCHINSERT";

            setFields(partialField);
        }

        if (!edit && whatsAppData?.typeWhatsApp === "GUPSHUP") {
            setSetRegister360(false);
            setSetRegisterGupshup(true);
            setSetRegisterMeta(false);
            setSetRegisterSmooch(false);

            const partialField = fields;
            partialField.type = "WHATSAPPGUPSHUP";

            setFields(partialField);
        }

        if (!edit && whatsAppData?.typeWhatsApp === "META") {
            setSetRegister360(false);
            setSetRegisterGupshup(false);
            setSetRegisterMeta(true);
            setSetRegisterSmooch(false);

            const partialField = fields;
            partialField.type = "WHATSAPPMETA";

            setFields(partialField);
        }
    }, [whatsAppData]);

    useEffect(() => {
        if (edit && (whatsAppData?.row as IChannel).status === "ACTIVO") {
            if (setParameters) {
                setSetParameters(false);
                if (whatsAppData?.row) {
                    if (whatsAppData && (whatsAppData.row as IChannel).servicecredentials.length > 0) {
                        const serviceField = JSON.parse((whatsAppData.row as IChannel).servicecredentials);

                        setFields({
                            method: "UFN_COMMUNICATIONCHANNEL_INS",
                            type: "WHATSAPPSMOOCH",
                            parameters: {
                                apikey: (whatsAppData.row as IChannel).apikey,
                                chatflowenabled: (whatsAppData.row as IChannel).chatflowenabled,
                                color: `${(whatsAppData.row as IChannel).color}`,
                                coloricon: `${(whatsAppData.row as IChannel).coloricon}`,
                                communicationchannelowner: (whatsAppData.row as IChannel).communicationchannelowner,
                                communicationchannelsite: (whatsAppData.row as IChannel).communicationchannelsite,
                                description: (whatsAppData.row as IChannel).communicationchanneldesc,
                                form: (whatsAppData.row as IChannel).form,
                                icons: (whatsAppData.row as IChannel).icons,
                                id: (whatsAppData.row as IChannel).communicationchannelid,
                                integrationid: (whatsAppData.row as IChannel).integrationid,
                                other: (whatsAppData.row as IChannel).other,
                                type: (whatsAppData.row as IChannel).type,
                                voximplantcallsupervision: false,
                            },
                            service: {
                                accesstoken: serviceField.accesstoken,
                                apikey: "",
                                apikeyid: "",
                                apikeysecret: "",
                                appid: "",
                                appname: "",
                                appnumber: "",
                                brandaddress: serviceField.brandaddress,
                                brandname: serviceField.brandname,
                                customerfacebookid: serviceField.customerfacebookid,
                                email: serviceField.email,
                                firstname: serviceField.firstname,
                                iscloud: serviceField.iscloud,
                                lastname: serviceField.lastname,
                                nameassociatednumber: serviceField.nameassociatednumber,
                                phone: serviceField.phone,
                                phonenumberwhatsappbusiness: serviceField.phonenumberwhatsappbusiness,
                            },
                        });

                        setDisablebutton(false);
                    }
                }
            }
        }
    }, [setParameters]);

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setSetins(false);
                dispatch(showBackdrop(false));
                setSetins(false);
                setWaitSave(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                setViewSelected("enable-virtual-assistant");
            } else if (!executeResult) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(mainResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.channel).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [mainResult]);

    function checkissues() {
        setViewSelected("viewfinishreg");
    }

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult]);

    function setnameField(value: string) {
        setChannelreg(value === "");
        const partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    function setChecked(value: boolean) {
        const partialf = fields;
        partialf.service.iscloud = value ?? false;
        setFields(partialf);
    }

    function setApiKeyId(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.apikeyid = value;
        setFields(partialf);
    }

    function setApiKeySecret(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.apikeysecret = value;
        setFields(partialf);
    }

    function setAppId(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.appid = value;
        setFields(partialf);
    }

    function setAppName(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.appname = value;
        setFields(partialf);
    }

    function setApiKey(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.apikey = value;
        setFields(partialf);
    }

    function setAppNumber(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.appnumber = value;
        setFields(partialf);
    }

    function setAccessToken(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.accesstoken = value;
        setFields(partialf);
    }

    function setPhoneNumber(value: string) {
        setNextbutton(value === "");
        const partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.phone = value;
        setFields(partialf);
    }

    async function activateChannelfunc() {
        dispatch(showBackdrop(true));
        dispatch(activateChannel(fields));
    }

    useEffect(() => {
        if (!executeActivationResult.loading && (set360 || setsmooch)) {
            dispatch(showBackdrop(false));

            if (executeActivationResult.error) {
                dispatch(
                    showSnackbar({ show: true, severity: "error", message: String(executeActivationResult.message) })
                );
            } else {
                dispatch(showSnackbar({ show: true, severity: "success", message: "Success" }));
                history.push(paths.CHANNELS);
            }
        }
    }, [executeActivationResult]);

    if (viewSelected === "enable-virtual-assistant") {
        return (
            <ChannelEnableVirtualAssistant
                communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid || null}
            />
        );
    }

    if (viewSelected === "view1") {
        if (setRegister360) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterSmooch(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitledialog)}
                        </div>
                        <Button
                            className={classes.centerbutton}
                            color="primary"
                            disabled={nextbutton}
                            variant="contained"
                            onClick={() => {
                                setViewSelected("viewfinishreg");
                            }}
                        >
                            {t(langKeys.registerwhats)}
                        </Button>
                        <div className="row-zyx">
                            <div className={"col-3"}></div>
                            <FieldEdit
                                className="col-5"
                                label={t(langKeys.enterapikey)}
                                onChange={(value) => setAccessToken(value)}
                            />
                            <div className={"col-1"} style={{ paddingBottom: "3px" }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                    {t(langKeys.dialog_iscloud)}
                                </Box>
                                <FormControlLabel
                                    label={""}
                                    style={{ paddingLeft: 10 }}
                                    control={
                                        <IOSSwitch
                                            checked={checkedCloud}
                                            onChange={(e) => {
                                                setChecked(e.target.checked);
                                                setCheckedCloud(e.target.checked);
                                            }}
                                        />
                                    }
                                />
                            </div>
                            <div className={"col-3"}></div>
                        </div>
                    </div>
                </div>
            );
        } else if (setRegisterSmooch) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                                setSetRegisterSmooch(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlesmooch)}
                        </div>
                        <Button
                            className={classes.centerbutton}
                            color="primary"
                            disabled={disablebutton2}
                            variant="contained"
                            onClick={() => {
                                setViewSelected("viewfinishreg");
                            }}
                        >
                            {t(langKeys.registerwhats)}
                        </Button>
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.smooch_apikeyid)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeyId(e.target.value);
                                        setDisablebutton2(
                                            !e.target.value || !fields.service.apikeysecret || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.smooch_apikeysecret)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeySecret(e.target.value);
                                        setDisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.smooch_appid)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppId(e.target.value);
                                        setDisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.apikeysecret
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (setRegisterGupshup) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                                setSetRegisterSmooch(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlegupshup)}
                        </div>
                        <Button
                            className={classes.centerbutton}
                            color="primary"
                            disabled={disablebutton3}
                            variant="contained"
                            onClick={() => {
                                setViewSelected("viewfinishreg");
                            }}
                        >
                            {t(langKeys.registerwhats)}
                        </Button>
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppappid)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppId(e.target.value);
                                        setDisablebutton3(
                                            !e.target.value ||
                                                !fields.service.apikey ||
                                                !fields.service.appname ||
                                                !fields.service.appnumber
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppappname)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppName(e.target.value);
                                        setDisablebutton3(
                                            !e.target.value ||
                                                !fields.service.apikey ||
                                                !fields.service.appid ||
                                                !fields.service.appnumber
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppapikey)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKey(e.target.value);
                                        setDisablebutton3(
                                            !e.target.value ||
                                                !fields.service.appid ||
                                                !fields.service.appname ||
                                                !fields.service.appnumber
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppappnumber)}
                                    style={{ width: "100%" }}
                                    type={"number"}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppNumber(e.target.value);
                                        setDisablebutton3(
                                            !e.target.value ||
                                                !fields.service.apikey ||
                                                !fields.service.appid ||
                                                !fields.service.appname
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (setRegisterMeta) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                                setSetRegisterSmooch(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlemeta)}
                        </div>
                        <Button
                            className={classes.centerbutton}
                            color="primary"
                            disabled={disablebutton3}
                            variant="contained"
                            onClick={() => {
                                setViewSelected("viewfinishreg");
                            }}
                        >
                            {t(langKeys.registerwhats)}
                        </Button>
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.metaaccesstoken)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAccessToken(e.target.value);
                                        setDisablebutton3(!e.target.value || !fields.service.phone);
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.metaphonenumber)}
                                    style={{ width: "100%" }}
                                    type={"number"}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        setDisablebutton3(!fields.service.accesstoken || !e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (!edit || channel?.status === "INACTIVO") {
            return (
                <div style={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                color="textSecondary"
                                href="/"
                                key={"mainview"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    channel?.status === "INACTIVO"
                                        ? history.push(paths.CHANNELS, whatsAppData)
                                        : history.push(paths.CHANNELS_ADD, whatsAppData);
                                }}
                            >
                                {t(langKeys.previoustext)}
                            </Link>
                        </Breadcrumbs>
                    </div>
                    <div style={{ width: "100%", marginTop: "20px", alignItems: "center", display: "flex" }}>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(true);
                                    setSetRegisterGupshup(false);
                                    setSetRegisterMeta(false);
                                    setSetRegisterSmooch(false);

                                    const partialField = fields;
                                    partialField.type = "WHATSAPP";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.register360dialog)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(false);
                                    setSetRegisterGupshup(false);
                                    setSetRegisterMeta(false);
                                    setSetRegisterSmooch(true);

                                    const partialField = fields;
                                    partialField.type = "WHATSAPPSMOOCHINSERT";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.registersmooch)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(false);
                                    setSetRegisterGupshup(true);
                                    setSetRegisterMeta(false);
                                    setSetRegisterSmooch(false);

                                    const partialField = fields;
                                    partialField.type = "WHATSAPPGUPSHUP";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.registergupshup)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(false);
                                    setSetRegisterGupshup(false);
                                    setSetRegisterMeta(true);
                                    setSetRegisterSmooch(false);

                                    const partialField = fields;
                                    partialField.type = "WHATSAPPMETA";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.registermeta)}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else if (set360) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                channel?.status === "INACTIVO"
                                    ? history.push(paths.CHANNELS, whatsAppData)
                                    : history.push(paths.CHANNELS_ADD, whatsAppData);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitledialog)}
                        </div>
                        <Button
                            className={classes.centerbutton}
                            color="primary"
                            disabled={nextbutton}
                            onClick={activateChannelfunc}
                            variant="contained"
                        >
                            {t(langKeys.registerwhats)}
                        </Button>
                        <div className="row-zyx">
                            <div className={"col-3"}></div>
                            <FieldEdit
                                className="col-5"
                                label={t(langKeys.enterapikey)}
                                onChange={(value) => setAccessToken(value)}
                            />
                            <div className={"col-1"} style={{ paddingBottom: "3px" }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                    {t(langKeys.dialog_iscloud)}
                                </Box>
                                <FormControlLabel
                                    label={""}
                                    style={{ paddingLeft: 10 }}
                                    control={
                                        <IOSSwitch
                                            checked={checkedCloud}
                                            onChange={(e) => {
                                                setChecked(e.target.checked);
                                                setCheckedCloud(e.target.checked);
                                            }}
                                        />
                                    }
                                />
                            </div>
                            <div className={"col-3"}></div>
                        </div>
                    </div>
                </div>
            );
        } else if (setsmooch) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                channel?.status === "INACTIVO"
                                    ? history.push(paths.CHANNELS, whatsAppData)
                                    : history.push(paths.CHANNELS_ADD, whatsAppData);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlesmooch)}
                        </div>
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={"API Key ID"}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeyId(e.target.value);
                                        setDisablebutton2(
                                            !e.target.value || !fields.service.apikeysecret || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={"API Key Secret"}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeySecret(e.target.value);
                                        setDisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={"App ID"}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppId(e.target.value);
                                        setDisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.apikeysecret
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ width: "100%", padding: "20px 25%" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={disablebutton2}
                                variant="contained"
                                onClick={() => {
                                    activateChannelfunc();
                                }}
                            >
                                {t(langKeys.finishreg)}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else if (whatsAppData?.typeWhatsApp === "DIALOG") {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                channel?.status === "INACTIVO"
                                    ? history.push(paths.CHANNELS, whatsAppData)
                                    : history.push(paths.CHANNELS_ADD, whatsAppData);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitledialog)}
                        </div>
                        <Button
                            className={classes.centerbutton}
                            color="primary"
                            disabled={nextbutton}
                            variant="contained"
                            onClick={() => {
                                setViewSelected("viewfinishreg");
                            }}
                        >
                            {t(langKeys.registerwhats)}
                        </Button>
                        <div className="row-zyx">
                            <div className={"col-3"}></div>
                            <FieldEdit
                                className="col-5"
                                label={t(langKeys.enterapikey)}
                                onChange={(value) => setAccessToken(value)}
                            />
                            <div className={"col-1"} style={{ paddingBottom: "3px" }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                    {t(langKeys.dialog_iscloud)}
                                </Box>
                                <FormControlLabel
                                    label={""}
                                    style={{ paddingLeft: 10 }}
                                    control={
                                        <IOSSwitch
                                            checked={checkedCloud}
                                            onChange={(e) => {
                                                setChecked(e.target.checked);
                                                setCheckedCloud(e.target.checked);
                                            }}
                                        />
                                    }
                                />
                            </div>
                            <div className={"col-3"}></div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{ width: "100%" }}>
                    <div>
                        <div>
                            <div
                                style={{
                                    color: "#7721ad",
                                    fontSize: 32,
                                    fontWeight: 500,
                                    marginBottom: 10,
                                    textAlign: "center",
                                }}
                            >
                                {t(langKeys.brandpointcontact)}
                            </div>
                            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 16, color: "grey" }}>
                                {t(langKeys.brandpointcontact2)}
                            </div>
                            <div
                                style={{
                                    color: "#7721ad",
                                    display: "flex",
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textAlign: "center",
                                }}
                            >
                                <TextField
                                    className={classes.fields1}
                                    defaultValue={fields.service.firstname}
                                    disabled={edit}
                                    error={Boolean(errors.firstname)}
                                    fullWidth
                                    helperText={errors.firstname}
                                    label={t(langKeys.firstname)}
                                    margin="normal"
                                    name="firstname"
                                    size="small"
                                    value={fields.service.firstname}
                                    variant="outlined"
                                    onChange={(e) => {
                                        const partialf = { ...fields };
                                        partialf.service.firstname = e.target.value;
                                        setFields(partialf);
                                        setDisablebutton(
                                            !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                        );
                                    }}
                                />
                                <TextField
                                    className={classes.fields2}
                                    defaultValue={fields.service.lastname}
                                    disabled={edit}
                                    error={Boolean(errors.lastname)}
                                    fullWidth
                                    helperText={errors.lastname}
                                    label={t(langKeys.lastname)}
                                    margin="normal"
                                    name="lastname"
                                    size="small"
                                    value={fields.service.lastname}
                                    variant="outlined"
                                    onChange={(e) => {
                                        const partialf = { ...fields };
                                        partialf.service.lastname = e.target.value;
                                        setFields(partialf);
                                        setDisablebutton(
                                            !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                        );
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    color: "#7721ad",
                                    display: "flex",
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textAlign: "center",
                                }}
                            >
                                <TextField
                                    className={classes.fields1}
                                    defaultValue={fields.service.email}
                                    disabled={edit}
                                    error={Boolean(errors.email)}
                                    fullWidth
                                    helperText={errors.email}
                                    label={t(langKeys.email)}
                                    margin="normal"
                                    name="email"
                                    size="small"
                                    style={{ marginBottom: 0 }}
                                    value={fields.service.email}
                                    variant="outlined"
                                    onChange={(e) => {
                                        const partialf = { ...fields };
                                        partialf.service.email = e.target.value;
                                        setFields(partialf);
                                        setDisablebutton(
                                            !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                        );
                                    }}
                                />
                                <CssPhonemui
                                    className={classes.fields2}
                                    countryCodeEditable={false}
                                    defaultCountry={"pe"}
                                    disableAreaCodes={true}
                                    disabled={edit}
                                    error={Boolean(errors.phone)}
                                    fullWidth
                                    helperText={errors.phone}
                                    label={t(langKeys.phone)}
                                    margin="normal"
                                    name="phone"
                                    size="small"
                                    value={fields.service.phone}
                                    variant="outlined"
                                    onChange={(e) => {
                                        const partialf = { ...fields };
                                        partialf.service.phone = e;
                                        setFields(partialf);
                                        setDisablebutton(
                                            !e ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                        );
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    color: "grey",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    marginBottom: "15px",
                                    marginLeft: "15px",
                                    textAlign: "left",
                                }}
                            >
                                {t(langKeys.emailcondition)}
                            </div>
                            <div
                                style={{
                                    color: "#7721ad",
                                    fontSize: 32,
                                    fontWeight: 500,
                                    marginBottom: 10,
                                    textAlign: "center",
                                }}
                            >
                                {t(langKeys.whatsappinformation)}
                            </div>
                            <div
                                style={{
                                    color: "#7721ad",
                                    display: "flex",
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textAlign: "center",
                                }}
                            >
                                <TextField
                                    className={classes.fields3}
                                    defaultValue={fields.service.phonenumberwhatsappbusiness}
                                    disabled={edit}
                                    error={Boolean(errors.phonenumberwhatsappbusiness)}
                                    fullWidth
                                    helperText={errors.phonenumberwhatsappbusiness}
                                    label={t(langKeys.desiredphonenumberwhatsappbusiness)}
                                    margin="normal"
                                    name="phonenumberwhatsappbusiness"
                                    size="small"
                                    value={fields.service.phonenumberwhatsappbusiness}
                                    variant="outlined"
                                    onChange={(e) => {
                                        const partialf = { ...fields };
                                        partialf.service.phonenumberwhatsappbusiness = e.target.value;
                                        setFields(partialf);
                                        setDisablebutton(
                                            !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.nameassociatednumber
                                        );
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    color: "grey",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    marginBottom: "15px",
                                    marginLeft: "15px",
                                    textAlign: "left",
                                }}
                            >
                                {t(langKeys.whatsappinformation3) + " "}
                                <Link href="http://africau.edu/images/default/sample.pdf">
                                    {t(langKeys.whatsappguidedownload)}
                                </Link>
                            </div>
                            <div
                                style={{
                                    color: "#7721ad",
                                    display: "flex",
                                    fontSize: 32,
                                    fontWeight: 500,
                                    textAlign: "center",
                                }}
                            >
                                <TextField
                                    className={classes.fields3}
                                    defaultValue={fields.service.nameassociatednumber}
                                    disabled={edit}
                                    error={Boolean(errors.nameassociatednumber)}
                                    fullWidth
                                    helperText={errors.nameassociatednumber}
                                    label={t(langKeys.nameassociatednumber)}
                                    margin="normal"
                                    name="nameassociatednumber"
                                    size="small"
                                    value={fields.service.nameassociatednumber}
                                    variant="outlined"
                                    onChange={(e) => {
                                        const partialf = { ...fields };
                                        partialf.service.nameassociatednumber = e.target.value;
                                        setFields(partialf);
                                        setDisablebutton(
                                            !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness
                                        );
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    color: "grey",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    marginBottom: "15px",
                                    marginLeft: "15px",
                                    textAlign: "left",
                                }}
                            >
                                {t(langKeys.whatsappinformation4)}
                            </div>
                            <div
                                style={{
                                    color: "grey",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    marginBottom: "15px",
                                    marginLeft: "15px",
                                    textAlign: "left",
                                }}
                            >
                                <b>*{t(langKeys.whatsappsubtitle1)}</b>
                            </div>
                            <div style={{ width: "100%", alignItems: "center", display: "flex" }}>
                                <div style={{ flex: "1", margin: "0px 15px" }}>
                                    <Button
                                        className={classes.button2}
                                        color="primary"
                                        disabled={disablebutton}
                                        variant="contained"
                                        onClick={() => {
                                            checkissues();
                                        }}
                                    >
                                        {t(langKeys.next)}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    } else {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="textSecondary"
                        href="/"
                        key={"mainview"}
                        onClick={(e) => {
                            e.preventDefault();
                            setViewSelected("view1");
                        }}
                    >
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div
                        style={{
                            color: "#7721ad",
                            fontSize: "2em",
                            fontWeight: "bold",
                            marginLeft: "auto",
                            marginRight: "auto",
                            maxWidth: "800px",
                            padding: "20px",
                            textAlign: "center",
                        }}
                    >
                        {t(langKeys.commchannelfinishreg)}
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.givechannelname)}
                            onChange={(value) => setnameField(value)}
                            valueDefault={fields.parameters.description}
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
                                <ChannelWhatsApp01 style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
                                <ColorInput
                                    hex={fields.parameters.coloricon}
                                    onChange={(e) => {
                                        setFields((prev) => ({
                                            ...prev,
                                            parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                        }));
                                        setColoricon(e.hex);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={channelreg || mainResult.loading}
                            variant="contained"
                            onClick={() => {
                                finishreg();
                            }}
                        >
                            {t(langKeys.finishreg)}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
};

export default ChannelAddWhatsapp;