import { apiUrls } from "common/constants";
import { ChannelFacebook, ChannelInstagram01, ChannelMessenger } from "icons";
import { ColorInput, FieldEdit, FieldSelect } from "components";
import { Facebook as FacebookIcon } from "@material-ui/icons";
import { getChannelsList, insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { makeStyles, Breadcrumbs, Button, Box } from "@material-ui/core";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import FacebookLogin from "react-facebook-login";
import Link from "@material-ui/core/Link";
import React, { FC, useEffect, useState } from "react";
import ChannelEnableVirtualAssistant from "./channels/ChannelEnableVirtualAssistant";
import { updateMetachannels } from "common/helpers";

const useChannelAddStyles = makeStyles(() => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "180px",
    },
}));

const IconSelect: FC<{ metatype: string, coloricon: String }> = ({ metatype, coloricon }) => {
    if (metatype === "Facebook") return <ChannelFacebook style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
    if (metatype === "Messenger") return <ChannelMessenger style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
    if (metatype === "Instagram") return <ChannelInstagram01 style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
    return <ChannelInstagram01 style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />

}
const MetaChannelsConfig: FC<{ setView: (a: string) => void, metatype: string, setchannelList: (a: any) => void, channelList: any, setmetachannelsDone: (a: any) => void, metachannelsDone: any }> = ({ setView, metatype, setchannelList, channelList, metachannelsDone, setmetachannelsDone }) => {
    const { t } = useTranslation();

    const [channelreg, setChannelreg] = useState(true);
    function getColor() {
        if (metatype === "Facebook") return "#2d88ff"
        if (metatype === "Messenger") return "#0078FF"
        if (metatype === "Instagram") return "#F56040"
        if (metatype === "Instagram Direct") return "#F56040"
    }
    const [coloricon, setColoricon] = useState(getColor());
    const [nextbutton, setNextbutton] = useState(true);
    const [enableAssistant, setenableAssistant] = useState(false);
    const [setins, setSetins] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);
    const [returnNow, setReturnNow] = useState(false);

    const dispatch = useDispatch();
    const classes = useChannelAddStyles();
    const executeResult = useSelector((state) => state.channel.successinsert);
    const mainResult = useSelector((state) => state.channel.channelList);
    function getType() {
        if (metatype === "Facebook") return "FACEBOOK"
        if (metatype === "Messenger") return "MESSENGER"
        if (metatype === "Instagram") return "INSTAGRAM"
        if (metatype === "Instagram Direct") return "INSTAMESSENGER"
    }
    function getid() {
        if (metatype === "Facebook") return 1
        if (metatype === "Messenger") return 2
        if (metatype === "Instagram") return 6
        if (metatype === "Instagram Direct") return 7
    }
    function getScope() {
        if (metatype === "Facebook") return "business_management,pages_manage_engagement,pages_manage_metadata,pages_messaging,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,pages_manage_posts"
        if (metatype === "Messenger") return "business_management,pages_manage_engagement,pages_manage_metadata,pages_messaging,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,pages_manage_posts"
        if (metatype === "Instagram") return "business_management,instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_manage_metadata,pages_read_engagement,pages_show_list,public_profile,instagram_content_publish"
        if (metatype === "Instagram Direct") return "business_management,instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_manage_metadata,pages_read_engagement,pages_show_list,public_profile,instagram_content_publish"
    }

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: getType(),
        parameters: {
            id: 0,
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
            coloricon: getColor() || "#2d88ff",
            voximplantcallsupervision: false,
        },
        service: {
            accesstoken: "",
            siteid: "",
            appid: metatype.includes("Instagram") ? apiUrls.INSTAGRAMAPP : apiUrls.FACEBOOKAPP,
        },
    });

    async function finishreg() {
        setSetins(true);
        dispatch(insertChannel(fields));
        updateMetachannels(getid() || 0);
        setWaitSave(true);
        setViewSelected("main");
    }

    function endReg() {
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.continuemetaconf),
            callback: () => {
                if (channelList.length) {
                    setViewSelected("view1");
                } else {
                    window.location.reload();
                }
            },
            callbackcancel: () => {
                window.location.reload();
            }
        }))
    }

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setSetins(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setmetachannelsDone([...metachannelsDone, metatype])
                if (returnNow) {
                    window.location.reload();
                } else {
                    if (channelList.length) {
                        setchannelList(channelList.shift());
                    }
                    if (enableAssistant) {
                        setViewSelected("enable-virtual-assistant")
                    } else {
                        endReg()
                    }
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

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsList(r.accessToken, `${metatype.includes("Instagram") ? apiUrls.INSTAGRAMAPP : apiUrls.FACEBOOKAPP}`));
            setViewSelected("view2");
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
    };

    function setValueField(value: { id: string; name: string; access_token: string } | null) {
        setNextbutton(value === null);

        const partialf = fields;
        partialf.parameters.communicationchannelsite = value?.id ?? "";
        partialf.parameters.communicationchannelowner = value?.name ?? "";
        partialf.service.siteid = value?.id ?? "";
        partialf.service.accesstoken = value?.access_token ?? "";

        setFields(partialf);
    }

    function setnameField(value: string) {
        setChannelreg(value === "");
        const partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    if (viewSelected === "view1") {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            key={"mainview"}
                            href="/"
                            onClick={(e) => {
                                e.preventDefault()
                                window.location.reload();
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="primary"
                            key={"mainview"}
                            href="/"
                            onClick={(e) => {
                                setchannelList(channelList.shift());
                                window.location.reload();
                            }}
                        >
                            {t(langKeys.skip)}
                        </Link>
                    </Breadcrumbs>
                </div>
                <div>
                    <div
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "2.5em",
                            color: "#A93DBE",
                            padding: "20px",
                            paddingBottom: 0
                        }}
                    >
                        {metatype.includes("Instagram") ? t(langKeys.connectinsta) : t(langKeys.connectface)}
                    </div>
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: "1.3em",
                            color: "#A93DBE",
                            padding: "0",
                        }}
                    >
                        (Facebook, Messenger, Instagram e Instagram Direct)
                    </div>
                    <div style={{ textAlign: "center", fontSize: "1.2em", fontWeight: "bold", padding: "20px", paddingBottom: 0 }}>
                        {t(langKeys.connectmetachannels2)}
                    </div>
                    <div style={{ textAlign: "center", paddingBottom: "30px", color: "grey", paddingTop: 0 }}>
                        {t(langKeys.connectmetachannels3)}
                    </div>
                    <FacebookLogin
                        appId={`${metatype.includes("Instagram") ? apiUrls.INSTAGRAMAPP : apiUrls.FACEBOOKAPP}`}
                        autoLoad={false}
                        buttonStyle={{
                            margin: "auto",
                            backgroundColor: "#A93DBE",
                            textTransform: "none",
                            display: "flex",
                            textAlign: "center",
                            justifyItems: "center",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        fields="name,email,picture"
                        scope={getScope()}
                        callback={processFacebookCallback}
                        textButton={metatype.includes("Instagram") ? t(langKeys.linkinstagrampage) : t(langKeys.linkfacebookpage)}
                        icon={<FacebookIcon style={{ color: "white", marginRight: "8px" }} />}
                        onClick={(e: any) => {
                            e.view.window.FB.init({
                                appId: metatype.includes("Instagram") ? apiUrls.INSTAGRAMAPP : apiUrls.FACEBOOKAPP,
                                cookie: true,
                                xfbml: true,
                                version: apiUrls.FACEBOOKVERSION,
                            });
                        }}
                        disableMobileRedirect={true}
                    />
                </div>
            </div>
        );
    } else if (viewSelected === "view2") {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            key={"mainview"}
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(manageConfirmation({
                                    visible: true,
                                    title: t(langKeys.confirmation),
                                    question: t(langKeys.channelconfigsave),
                                    callback: () => {
                                        if (channelreg || mainResult.loading || nextbutton) {
                                            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.onboading_channelcomplete) }));
                                        } else {
                                            setReturnNow(true);
                                            finishreg();
                                        }
                                    },
                                    callbackcancel: () => {
                                        window.location.reload();
                                    },
                                    textCancel: t(langKeys.decline),
                                    textConfirm: t(langKeys.accept),
                                    isBold: true,
                                    showClose: true,
                                }))
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="primary"
                            key={"mainview"}
                            href="/"
                            onClick={(e) => {
                                setchannelList(channelList.shift());
                                window.location.reload();
                            }}
                        >
                            {t(langKeys.skip)}
                        </Link>
                    </Breadcrumbs>
                </div>
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
                        {t(langKeys.connectface)}
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            onChange={(value) => setValueField(value)}
                            label={t(langKeys.selectpagelink) + " " + metatype}
                            className="col-6"
                            valueDefault={fields.parameters.communicationchannelsite}
                            data={mainResult.data}
                            optionDesc="name"
                            optionValue="id"
                        />
                    </div>
                    <div className="row-zyx" style={{ justifyContent: "center", paddingTop: 100 }}>
                        <div style={{ width: "50%", minWidth: 300 }}>
                            <h2>{t(langKeys.givechannelname)}</h2>
                            <FieldEdit
                                onChange={(value) => setnameField(value)}
                                valueDefault={fields.parameters.description}
                                className="col-6"
                            />
                        </div>
                    </div>
                    <div className="row-zyx" style={{ justifyContent: "center", paddingTop: 20 }}>
                        <div style={{ width: "50%", minWidth: 300, display: "flex", gap: 30 }}>
                            <h2 style={{ margin: 0 }}>{t(langKeys.giveitacolor)}</h2>
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
                    <div className="row-zyx" style={{ margin: 0 }}>
                        <div className="col-3"></div>
                        <div className="col-6">
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                {<IconSelect
                                    metatype={metatype}
                                    coloricon={coloricon || "black"}
                                />}
                            </div>
                        </div>
                    </div>
                    <div className="row-zyx" style={{ justifyContent: "center", paddingTop: 20 }}>
                        <div style={{ width: "50%", minWidth: 300, display: "flex", gap: 30 }}>
                            <div>
                                <h2 style={{ margin: 0 }}>{t(langKeys.virtualasistantquestion)}</h2>
                                <p>{t(langKeys.virtualasistantdesc)}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ justifyContent: "center", width: "100%", display: "flex", gap: 16 }}>
                        <Button
                            onClick={() => {
                                setenableAssistant(true)
                                finishreg();
                            }}
                            className={classes.button}
                            disabled={nextbutton || channelreg || mainResult.loading}
                            variant="outlined"
                            color="primary"
                        >
                            {t(langKeys.enableassistant)}
                        </Button>
                        <Button
                            onClick={() => {
                                finishreg();
                            }}
                            className={classes.button}
                            disabled={nextbutton || channelreg || mainResult.loading}
                            variant="contained"
                            color="primary"
                        >
                            {t(langKeys.finishreg)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    } else if (viewSelected === "enable-virtual-assistant") {
        return <ChannelEnableVirtualAssistant
            communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid || null}
            finishFunction={endReg}
            gobackFunction={() => {
                setViewSelected("view1");
            }}
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
                            setViewSelected("view2");
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
                            valueDefault={fields.parameters.description}
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
                                <ChannelFacebook style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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

export default MetaChannelsConfig;