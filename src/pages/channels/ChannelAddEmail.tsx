import { apiUrls } from "common/constants";
import { Breadcrumbs, Box, Button, makeStyles } from "@material-ui/core";
import { ChannelMail } from "icons";
import { ColorInput, FieldEdit } from "components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import ChannelEnableVirtualAssistant from './ChannelEnableVirtualAssistant';
import { IChannel } from "@types";

import GoogleLogInFrame from "./GoogleLogInFrame";
import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";
import React, { FC, useEffect, useState } from "react";
import { updateMetachannels } from "common/helpers";

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
    onboarding?: boolean;
}

const useChannelAddStyles = makeStyles(() => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "180px",
    },
    button2: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "100%",
    },
    buttonGoogle: {
        "& button": {
            width: "200px",
            justifyContent: "center",
        },
    },
}));

export const ChannelAddEmail: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setColoricon] = useState("#1D9BF0");
    const [nextbutton, setNextbutton] = useState(true);
    const [registerInfobip, setRegisterInfobip] = useState(false);
    const [registerGmail, setRegisterGmail] = useState(false);
    const [registerImap, setRegisterImap] = useState(false);
    const [setins, setSetins] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitExchange, setWaitExchange] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const dispatch = useDispatch();
    const classes = useChannelAddStyles();
    const exchangeCodeResult = useSelector((state) => state.google.requestExchangeCode);
    const executeResult = useSelector((state) => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<WhatsAppData>();
    const mainResult = useSelector((state) => state.channel.channelList);
    const whatsAppData = location.state as WhatsAppData | null;

    const channel = whatsAppData?.row as IChannel | null;

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: "INFOBIPEMAIL",
        parameters: {
            id: edit && channel ? channel.communicationchannelid : 0,
            description: "",
            type: "",
            communicationchannelsite: "",
            communicationchannelowner: "",
            chatflowenabled: true,
            integrationid: "",
            color: "",
            icons: "",
            other: "",
            form: "",
            apikey: "",
            coloricon: "#1D9BF0",
            voximplantcallsupervision: false,
        },
        service: {
            apikey: "",
            url: "",
            emittername: "",
            accesstoken: "",
            refreshtoken: "",
            scope: "",
            tokentype: "",
            idtoken: "",
            imapaccesstoken: "",
            imapusername: "",
            imappassword: "",
            imapincomingendpoint: "",
            imaphost: "",
            imapincomingport: "",
            imapport: "",
            imapssl: "",
        },
    });

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    };

    async function finishreg() {
        setSetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
        setViewSelected("main");
    }

    function setnameField(value: string) {
        setChannelreg(value === "");
        const partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    useEffect(() => {
        if (waitExchange) {
            if (!exchangeCodeResult.loading) {
                if (!exchangeCodeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (exchangeCodeResult.data) {
                        const partialFields = fields;
                        partialFields.service.accesstoken = exchangeCodeResult.data.access_token;
                        partialFields.service.idtoken = exchangeCodeResult.data.id_token;
                        partialFields.service.refreshtoken = exchangeCodeResult.data.refresh_token;
                        partialFields.service.scope = exchangeCodeResult.data.scope;
                        partialFields.service.tokentype = exchangeCodeResult.data.token_type;
                        setFields(partialFields);

                        setViewSelected("view2");
                    }
                } else {
                    dispatch(
                        showSnackbar({
                            show: true,
                            severity: "error",
                            message: t(
                                exchangeCodeResult.msg ??
                                exchangeCodeResult.message ??
                                exchangeCodeResult.code ??
                                "error_unexpected_error"
                            ),
                        })
                    );
                }
                dispatch(showBackdrop(false));
                setWaitExchange(false);
            }
        }
    }, [exchangeCodeResult, waitExchange]);

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setSetins(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                if (whatsAppData?.onboarding) {
                    history.push(paths.METACHANNELS, whatsAppData);
                    updateMetachannels(13);
                } else {
                    setWaitSave(false);
                    setViewSelected("enable-virtual-assistant");
                }
            } else if (!executeResult) {
                const errormessage = t(mainResult.code ?? "error_unexpected_error", {
                    module: t(langKeys.property).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [mainResult]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult]);

    if (edit && !channel) {
        return <div />;
    }
    if (viewSelected === "enable-virtual-assistant") {
        return <ChannelEnableVirtualAssistant
            communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid || null}
        />
    }
    if (viewSelected === "view1") {
        if (registerInfobip) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            key={"mainview"}
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setRegisterInfobip(false);
                                setRegisterGmail(false);
                                setRegisterImap(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "2em",
                                color: "#7721ad",
                                padding: "20px",
                            }}
                        >
                            {t(langKeys.emailtitle)}
                        </div>
                        <div
                            style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}
                        >
                            {t(langKeys.emailtitle2)}
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        value === "" ||
                                        fields.service.emittername === "" ||
                                        fields.service.url === "" ||
                                        !/\S+@\S+\.\S+/.test(fields.service.emittername) ||
                                        !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+\\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
                                            fields.service.url
                                        )
                                    );
                                    const partialf = fields;
                                    partialf.service.apikey = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.apikey}
                                label={t(langKeys.apikey)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        value === "" ||
                                        fields.service.emittername === "" ||
                                        fields.service.apikey === "" ||
                                        !/\S+@\S+\.\S+/.test(fields.service.emittername) ||
                                        !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
                                            value
                                        )
                                    );
                                    const partialf = fields;
                                    partialf.service.url = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.url}
                                label={t(langKeys.url)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        value === "" ||
                                        fields.service.apikey === "" ||
                                        fields.service.url === "" ||
                                        !/\S+@\S+\.\S+/.test(value) ||
                                        !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
                                            fields.service.url
                                        )
                                    );
                                    const partialf = fields;
                                    partialf.service.emittername = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.emittername}
                                label={t(langKeys.emitteremail)}
                                className="col-6"
                            />
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                disabled={nextbutton}
                                onClick={() => {
                                    setViewSelected("view2");
                                }}
                                className={classes.button}
                                variant="contained"
                                color="primary"
                            >
                                {t(langKeys.next)}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else if (registerGmail) {
            return (
                <>
                    <meta name="google-signin-client_id" content={`${apiUrls.GOOGLECLIENTID_CHANNEL}`} />
                    <script src="https://apis.google.com/js/platform.js" async defer></script>
                    <div style={{ width: "100%" }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                color="textSecondary"
                                key={"mainview"}
                                href="/"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setRegisterInfobip(false);
                                    setRegisterGmail(false);
                                    setRegisterImap(false);
                                }}
                            >
                                {t(langKeys.previoustext)}
                            </Link>
                        </Breadcrumbs>
                        <div>
                            <div
                                style={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: "2em",
                                    color: "#7721ad",
                                    padding: "20px",
                                }}
                            >
                                {t(langKeys.channel_gmailtitle)}
                            </div>
                            <div
                                style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}
                            >
                                {t(langKeys.channel_gmailalert1)}
                            </div>
                            <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>
                                {t(langKeys.channel_gmailalert2)}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignContent: "center",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <GoogleOAuthProvider clientId={`${apiUrls.GOOGLECLIENTID_CHANNEL}`}>
                                    <GoogleLogInFrame setWaitExchange={setWaitExchange} />
                                </GoogleOAuthProvider>
                            </div>
                            <div
                                style={{
                                    textAlign: "center",
                                    paddingTop: "20px",
                                    color: "#969ea5",
                                    fontStyle: "italic",
                                }}
                            >
                                {t(langKeys.connectface4)}
                            </div>
                            <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}>
                                <a
                                    style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }}
                                    onMouseDown={openprivacypolicies}
                                    rel="noopener noreferrer"
                                >
                                    {t(langKeys.privacypoliciestitle)}
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (registerImap) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            key={"mainview"}
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setRegisterInfobip(false);
                                setRegisterGmail(false);
                                setRegisterImap(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "2em",
                                color: "#7721ad",
                                padding: "20px",
                            }}
                        >
                            {t(langKeys.imaptitle)}
                        </div>
                        <div
                            style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}
                        >
                            {t(langKeys.imaptitle2)}
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        value === "" ||
                                        fields.service.imappassword === "" ||
                                        fields.service.imapincomingendpoint === "" ||
                                        fields.service.imaphost === "" ||
                                        fields.service.imapincomingport === "" ||
                                        fields.service.imapport === "" ||
                                        fields.service.imapssl === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imapusername = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imapusername}
                                label={t(langKeys.imapusername)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        fields.service.imapusername === "" ||
                                        value === "" ||
                                        fields.service.imapincomingendpoint === "" ||
                                        fields.service.imaphost === "" ||
                                        fields.service.imapincomingport === "" ||
                                        fields.service.imapport === "" ||
                                        fields.service.imapssl === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imappassword = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imappassword}
                                label={t(langKeys.imappassword)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        fields.service.imapusername === "" ||
                                        fields.service.imappassword === "" ||
                                        fields.service.imapincomingendpoint === "" ||
                                        fields.service.imaphost === "" ||
                                        fields.service.imapincomingport === "" ||
                                        fields.service.imapport === "" ||
                                        fields.service.imapssl === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imapaccesstoken = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imapaccesstoken}
                                label={t(langKeys.imapaccesstoken)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        fields.service.imapusername === "" ||
                                        fields.service.imappassword === "" ||
                                        value === "" ||
                                        fields.service.imaphost === "" ||
                                        fields.service.imapincomingport === "" ||
                                        fields.service.imapport === "" ||
                                        fields.service.imapssl === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imapincomingendpoint = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imapincomingendpoint}
                                label={t(langKeys.imapincomingendpoint)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        fields.service.imapusername === "" ||
                                        fields.service.imappassword === "" ||
                                        fields.service.imapincomingendpoint === "" ||
                                        fields.service.imaphost === "" ||
                                        value === "" ||
                                        fields.service.imapport === "" ||
                                        fields.service.imapssl === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imapincomingport = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imapincomingport}
                                label={t(langKeys.imapincomingport)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        fields.service.imapusername === "" ||
                                        fields.service.imappassword === "" ||
                                        fields.service.imapincomingendpoint === "" ||
                                        value === "" ||
                                        fields.service.imapincomingport === "" ||
                                        fields.service.imapport === "" ||
                                        fields.service.imapssl === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imaphost = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imaphost}
                                label={t(langKeys.imaphost)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        fields.service.imapusername === "" ||
                                        fields.service.imappassword === "" ||
                                        fields.service.imapincomingendpoint === "" ||
                                        fields.service.imaphost === "" ||
                                        fields.service.imapincomingport === "" ||
                                        value === "" ||
                                        fields.service.imapssl === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imapport = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imapport}
                                label={t(langKeys.imapport)}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(
                                        fields.service.imapusername === "" ||
                                        fields.service.imappassword === "" ||
                                        fields.service.imapincomingendpoint === "" ||
                                        fields.service.imaphost === "" ||
                                        fields.service.imapincomingport === "" ||
                                        fields.service.imapport === "" ||
                                        value === ""
                                    );
                                    const partialf = fields;
                                    partialf.service.imapssl = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.imapssl}
                                label={t(langKeys.imapssl)}
                                className="col-6"
                            />
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                disabled={nextbutton}
                                onClick={() => {
                                    setViewSelected("view2");
                                }}
                                className={classes.button}
                                variant="contained"
                                color="primary"
                            >
                                {t(langKeys.next)}
                            </Button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                color="textSecondary"
                                key={"mainview"}
                                href="/"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (whatsAppData?.onboarding) {
                                        history.push(paths.METACHANNELS, whatsAppData);
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
                    </div>
                    <div style={{ width: "100%", marginTop: "20px", alignItems: "center", display: "flex" }}>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                onClick={() => {
                                    setRegisterInfobip(true);
                                    const partialField = fields;
                                    partialField.type = "INFOBIPEMAIL";
                                    setFields(partialField);
                                }}
                                className={classes.button2}
                                disabled={false}
                                variant="contained"
                                color="primary"
                            >
                                {t(langKeys.registerinfobip)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                onClick={() => {
                                    setRegisterGmail(true);
                                    const partialField = fields;
                                    partialField.type = "GMAIL";
                                    setFields(partialField);
                                }}
                                className={classes.button2}
                                disabled={false}
                                variant="contained"
                                color="primary"
                            >
                                {t(langKeys.registergmail)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                onClick={() => {
                                    setRegisterImap(true);
                                    const partialField = fields;
                                    partialField.type = "IMAP";
                                    setFields(partialField);
                                }}
                                className={classes.button2}
                                disabled={false}
                                variant="contained"
                                color="primary"
                            >
                                {t(langKeys.registerimap)}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    } else if (viewSelected === "enable-virtual-assistant") {
        return <ChannelEnableVirtualAssistant
            communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid || null}
        />
    } else {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
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
                                        if (channelreg || mainResult.loading || nextbutton) {
                                            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.onboading_channelcomplete) }));
                                        } else {
                                            finishreg();
                                        }
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
                                setViewSelected("view1");
                            }
                        }}
                    >
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
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
                            onChange={(value) => setnameField(value)}
                            label={t(langKeys.givechannelname)}
                            className="col-6"
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
                                <ChannelMail style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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
                            onClick={() => {
                                finishreg();
                            }}
                            className={classes.button}
                            disabled={channelreg || mainResult.loading}
                            variant="contained"
                            color="primary"
                        >
                            {t(langKeys.finishreg)}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
};

export default ChannelAddEmail;