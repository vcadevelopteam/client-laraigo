import React, { FC, useEffect, useState } from "react";
import { apiUrls } from "common/constants";
import { Breadcrumbs, Box, Button, makeStyles } from "@material-ui/core";
import { ChannelMyBusiness } from "icons";
import { ColorInput, FieldEdit } from "components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import ChannelEnableVirtualAssistant from './ChannelEnableVirtualAssistant';
import { IChannel } from "@types";

import GoogleLogInFrame from "./GoogleLogInFrame";
import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
}

const useChannelAddStyles = makeStyles(() => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "180px",
    },
    buttonGoogle: {
        "& button": {
            width: "200px",
            justifyContent: "center",
        },
    },
}));

export const ChannelAddBusiness: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setColoricon] = useState("#a503fc");
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
        type: "BUSINESS",
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
            coloricon: "#a503fc",
            voximplantcallsupervision: false,
        },
        service: {
            accesstoken: "",
            refreshtoken: "",
            scope: "",
            tokentype: "",
            idtoken: "",
            channel: "",
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

                        setViewSelected("viewfinishreg");
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
                setWaitSave(false);
                setViewSelected("enable-virtual-assistant")
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

    if (viewSelected === "view1") {
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
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "2em",
                                color: "#7721ad",
                                padding: "20px",
                            }}
                        >
                            {t(langKeys.channel_businesstitle)}
                        </div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>
                            {t(langKeys.channel_businessalert1)}
                        </div>
                        <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>
                            {t(langKeys.channel_businessalert2)}
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
                        <div style={{ textAlign: "center", paddingTop: "20px", color: "#969ea5", fontStyle: "italic" }}>
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
        )
    } else if(viewSelected==="enable-virtual-assistant"){
        return <ChannelEnableVirtualAssistant
            communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid||null}
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
                            setViewSelected("view1");
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
                                <ChannelMyBusiness style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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

export default ChannelAddBusiness;