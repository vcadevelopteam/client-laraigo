import React, { FC, useEffect, useState } from "react";
import { apiUrls } from "common/constants";
import { Box, Breadcrumbs, Button, makeStyles } from "@material-ui/core";
import { ChannelYouTube } from "icons";
import { ColorInput, FieldEdit, FieldSelect } from "components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { IChannel } from "@types";
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { listYouTube } from "store/google/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import GoogleLogInFrame from "./GoogleLogInFrame";
import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";
import ChannelEnableVirtualAssistant from "./ChannelEnableVirtualAssistant";

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
}

const useChannelAddStyles = makeStyles(() => ({
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
    buttonGoogle: {
        "& button": {
            justifyContent: "center",
            width: "200px",
        },
    },
}));

export const ChannelAddYouTube: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [channellist, setChannellist] = useState([]);
    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setColoricon] = useState("#FE0000");
    const [nextbutton, setNextbutton] = useState(true);
    const [setins, setSetins] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitExchange, setWaitExchange] = useState(false);
    const [waitList, setWaitList] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const exchangeCodeResult = useSelector((state) => state.google.requestExchangeCode);
    const executeResult = useSelector((state) => state.channel.successinsert);
    const history = useHistory();
    const listYouTubeResult = useSelector((state) => state.google.requestListYouTube);
    const location = useLocation<WhatsAppData>();
    const mainResult = useSelector((state) => state.channel.channelList);
    const whatsAppData = location.state as WhatsAppData | null;

    const channel = whatsAppData?.row as IChannel | null;

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: "YOUTUBE",
        parameters: {
            apikey: "",
            chatflowenabled: true,
            color: "",
            coloricon: "#FE0000",
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
            channel: "",
            idtoken: "",
            refreshtoken: "",
            scope: "",
            tokentype: "",
        },
    });

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    };

    async function finishreg() {
        dispatch(insertChannel(fields));
        setViewSelected("main");
        setSetins(true);
        setWaitSave(true);
    }

    function setnameField(value: string) {
        setChannelreg(value === "");
        const partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    function setchannelField(value: { id: string }) {
        setNextbutton(value === null);
        const partialf = fields;
        partialf.service.channel = value?.id || "";
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

                        dispatch(listYouTube({ accesstoken: exchangeCodeResult.data.access_token }));
                        dispatch(showBackdrop(true));
                        setWaitList(true);

                        setViewSelected("view2");
                        setChannellist([]);
                    }
                } else {
                    dispatch(
                        showSnackbar({
                            severity: "error",
                            show: true,
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
        if (waitList) {
            if (!listYouTubeResult.loading) {
                if (!listYouTubeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));

                    if (listYouTubeResult.data) {
                        if (listYouTubeResult.data.items) {
                            listYouTubeResult.data.items.forEach((element: { channelname: string; id: string }) => {
                                element.channelname = `https://www.youtube.com/channel/${element.id}`;
                            });
                            setChannellist(listYouTubeResult.data.items);
                        }
                    }
                } else {
                    dispatch(
                        showSnackbar({
                            severity: "error",
                            show: true,
                            message: t(
                                listYouTubeResult.msg ??
                                    listYouTubeResult.message ??
                                    listYouTubeResult.code ??
                                    "error_unexpected_error"
                            ),
                        })
                    );
                }
                dispatch(showBackdrop(false));
                setWaitList(false);
            }
        }
    }, [listYouTubeResult, waitList]);

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setSetins(false);
                setWaitSave(false);
                setViewSelected("enable-virtual-assistant")
            } else if (!executeResult) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(mainResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.property).toLocaleLowerCase(),
                        }),
                    })
                );
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
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.channel_youtubetitle)}
                        </div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>
                            {t(langKeys.channel_youtubealert1)}
                        </div>
                        <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>
                            {t(langKeys.channel_youtubealert2)}
                        </div>
                        <div
                            style={{
                                alignContent: "center",
                                alignItems: "center",
                                display: "flex",
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
                                onMouseDown={openprivacypolicies}
                                rel="noopener noreferrer"
                                style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }}
                            >
                                {t(langKeys.privacypoliciestitle)}
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (viewSelected === "view2") {
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
                            padding: "20px",
                            textAlign: "center",
                        }}
                    >
                        {t(langKeys.channel_youtubetitle)}
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            className="col-6"
                            data={channellist}
                            label={t(langKeys.selectchannellink)}
                            onChange={(value) => setchannelField(value)}
                            optionDesc="channelname"
                            optionValue="id"
                            valueDefault={fields.service.channel}
                        />
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={nextbutton}
                            variant="contained"
                            onClick={() => {
                                setViewSelected("viewfinishreg");
                            }}
                        >
                            {t(langKeys.next)}
                        </Button>
                    </div>
                </div>
            </div>
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
                        href="/"
                        key={"mainview"}
                        onClick={(e) => {
                            e.preventDefault();
                            setViewSelected("view2");
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
                                <ChannelYouTube style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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

export default ChannelAddYouTube;