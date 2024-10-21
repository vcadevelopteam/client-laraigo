import { ChannelTikTok } from "icons";
import { FieldEdit, ColorInput } from "components";
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
    button2: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "100%",
    },
}));

export const ChannelAddTikTok: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [channelreg, setChannelreg] = useState(true);
    const [checkedAyrshare, setCheckedAyrshare] = useState(true);
    const [coloricon, setColoricon] = useState("#000000");
    const [nextbutton, setNextbutton] = useState(true);
    const [setins, setSetins] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);

    const dispatch = useDispatch();
    const classes = useChannelAddStyles();
    const executeResult = useSelector((state) => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<WhatsAppData>();
    const mainResult = useSelector((state) => state.channel.channelList);
    const whatsAppData = location.state as WhatsAppData | null;

    const channel = whatsAppData?.row as IChannel | null;

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: "AYRSHARE-TIKTOK",
        parameters: {
            apikey: "",
            chatflowenabled: true,
            color: "",
            coloricon: "#000000",
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
            accountkey: "",
        },
    });

    async function finishreg() {
        setSetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
        setViewSelected("main");
    }

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

    function setnameField(value: string) {
        setChannelreg(value === "");
        const partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    if (edit && !channel) {
        return <div />;
    }

    if (viewSelected === "view1") {
        return (
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
                        {t(langKeys.channel_tiktoktitle)}
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>
                        {t(langKeys.channel_tiktokalert01)}
                    </div>
                    <div className="row-zyx">
                        <div style={{ width: "100%", marginTop: "20px", alignItems: "center", display: "flex" }}>
                            <div style={{ flex: "1", margin: "0px 15px" }}>
                                <Button
                                    onClick={() => {
                                        setCheckedAyrshare(true);
                                        const partialField = fields;
                                        partialField.type = "AYRSHARE-TIKTOK";
                                        partialField.service.accesstoken = "";
                                        partialField.service.apikey = "";
                                        partialField.service.accountkey = "";
                                        setFields(partialField);
                                        setNextbutton(true);
                                    }}
                                    className={classes.button2}
                                    disabled={checkedAyrshare}
                                    variant="contained"
                                    color="primary"
                                >
                                    {t(langKeys.channel_tiktokregisterayrshare)}
                                </Button>
                            </div>
                            <div style={{ flex: "1", margin: "0px 15px" }}>
                                <Button
                                    onClick={() => {
                                        setCheckedAyrshare(false);
                                        const partialField = fields;
                                        partialField.type = "TIKAPI-TIKTOK";
                                        partialField.service.accesstoken = "";
                                        partialField.service.apikey = "";
                                        partialField.service.accountkey = "";
                                        setFields(partialField);
                                        setNextbutton(true);
                                    }}
                                    className={classes.button2}
                                    disabled={!checkedAyrshare}
                                    variant="contained"
                                    color="primary"
                                >
                                    {t(langKeys.channel_tiktokregistertikapi)}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {checkedAyrshare && (
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(value === "");
                                    const partialf = fields;
                                    partialf.service.accesstoken = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.accesstoken}
                                label={t(langKeys.channel_tiktokaccesstoken)}
                                className="col-6"
                            />
                        </div>
                    )}
                    {!checkedAyrshare && (
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(value === "" || fields.service.accountkey === "");
                                    const partialf = fields;
                                    partialf.service.apikey = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.apikey}
                                label={t(langKeys.channel_tiktokapikey)}
                                className="col-6"
                            />
                        </div>
                    )}
                    {!checkedAyrshare && (
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={(value) => {
                                    setNextbutton(value === "" || fields.service.apikey === "");
                                    const partialf = fields;
                                    partialf.service.accountkey = value;
                                    setFields(partialf);
                                }}
                                valueDefault={fields.service.accountkey}
                                label={t(langKeys.channel_tiktokaccountkey)}
                                className="col-6"
                            />
                        </div>
                    )}
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
                                <ChannelTikTok style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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

export default ChannelAddTikTok;