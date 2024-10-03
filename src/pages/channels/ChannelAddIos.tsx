import { ChannelIos } from "icons";
import { ColorInput, FieldEdit } from "components";
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { makeStyles, Breadcrumbs, Button, Box } from "@material-ui/core";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { IChannel } from "@types";

import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";
import ChannelEnableVirtualAssistant from "./ChannelEnableVirtualAssistant";
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
}));

export const ChannelAddIos: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [waitSave, setWaitSave] = useState(false);
    const [setins, setSetins] = useState(false);
    const [channelreg, setChannelreg] = useState(true);
    const [showRegister, setShowRegister] = useState(true);
    const [showClose, setShowClose] = useState(false);
    const [showScript, setShowScript] = useState(false);
    const [integrationId, setIntegrationId] = useState("");
    const [coloricon, setColoricon] = useState("#000000");

    const dispatch = useDispatch();
    const mainResult = useSelector((state) => state.channel.channelList);
    const executeResult = useSelector((state) => state.channel.successinsert);
    const history = useHistory();
    const [viewSelected, setViewSelected] = useState("view1");
    const classes = useChannelAddStyles();
    const location = useLocation<WhatsAppData>();
    const whatsAppData = location.state as WhatsAppData | null;

    const channel = whatsAppData?.row as IChannel | null;

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: "SMOOCHIOS",
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
            coloricon: "#000000",
            voximplantcallsupervision: false,
        },
    });

    async function finishreg() {
        setSetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
    }

    async function goback() {
        setViewSelected("enable-virtual-assistant")
    }

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setSetins(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setShowRegister(false);
                setShowClose(true);
                setShowScript(true);
                setIntegrationId(mainResult.data[0].integrationId);
                if (whatsAppData?.onboarding) {
                    history.push(paths.METACHANNELS, whatsAppData);
                    updateMetachannels(21);
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

    function setnameField(value: string) {
        setChannelreg(value === "");
        const partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }
    if (viewSelected === "enable-virtual-assistant") {
        return <ChannelEnableVirtualAssistant
            communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid || null}
        />
    }

    if (edit && !channel) {
        return <div />;
    }

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
                            <ChannelIos style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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
                    {showRegister ? (
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
                    ) : null}
                    {showClose ? (
                        <Button
                            onClick={() => {
                                goback();
                            }}
                            className={classes.button}
                            disabled={channelreg}
                            variant="contained"
                            color="primary"
                        >
                            {t(langKeys.close)}
                        </Button>
                    ) : null}
                </div>
            </div>
            <div style={{ display: showScript ? "flex" : "none", height: 10 }} />
            <div
                style={{
                    display: showScript ? "flex" : "none",
                    flexDirection: "column",
                    marginLeft: 120,
                    marginRight: 120,
                }}
            >
                {t(langKeys.iosstep1)}
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
                        width: "100%",
                        whiteSpace: "break-spaces",
                    }}
                >
                    <code>
                        {`[Smooch initWithSettings:[SKTSettings settingsWithIntegrationId:@"${integrationId}"] completionHandler:^(NSError * _Nullable error, NSDictionary * _Nullable userInfo) {\n\tif (error == nil) {\n\t\t// Initialization complete\n\t} else {\n\t\t// Something went wrong\n\t}\n}];`}
                    </code>
                </pre>
                <div style={{ height: 10 }} />
            </div>
            <div
                style={{
                    display: showScript ? "flex" : "none",
                    flexDirection: "column",
                    marginLeft: 120,
                    marginRight: 120,
                }}
            >
                {t(langKeys.iosstep2)}
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
                        width: "100%",
                        whiteSpace: "break-spaces",
                    }}
                >
                    <code>
                        {`Smooch.initWith(SKTSettings(integrationId: "${integrationId}")) { (error: Error?, userInfo: [AnyHashable : Any]?) in\n\tif (error == nil) {\n\t\t// Initialization complete\n\t} else {\n\t\t// Something went wrong\n\t}\n}`}
                    </code>
                </pre>
                <div style={{ height: 10 }} />
            </div>
            <div
                style={{
                    display: showScript ? "flex" : "none",
                    flexDirection: "column",
                    marginLeft: 120,
                    marginRight: 120,
                }}
            >
                {t(langKeys.iosstep3)}
            </div>
            <div style={{ display: showScript ? "flex" : "none", height: 20 }} />
        </div>
    );
};

export default ChannelAddIos;