import { ChannelWorkplace } from "icons";
import { ColorInput, FieldEdit, FieldSelect } from "components";
import { getGroupList, insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { makeStyles, Breadcrumbs, Button, Box } from "@material-ui/core";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import ChannelEnableVirtualAssistant from './ChannelEnableVirtualAssistant';
import { Dictionary, IChannel } from "@types";

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
}));

export const ChannelAddFacebookWorkplace: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [channelreg, setChannelreg] = useState(true);
    const [channelList, setChannelList] = useState<Dictionary[]>([]);
    const [waitGetGroups, setWaitGetGroups] = useState(false);
    const [coloricon, setColoricon] = useState("#2d88ff");
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
    const grouplist = useSelector((state) => state.channel.requestGetGroupList);
    const whatsAppData = location.state as WhatsAppData | null;

    const channel = whatsAppData?.row as IChannel | null;

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: "FBWM",
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
            coloricon: "#2d88ff",
            voximplantcallsupervision: false,
        },
        service: {
            accesstoken: "",
            siteid: "",
            groupid: "",
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

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setSetins(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                if (whatsAppData?.onboarding) {
                    history.push(paths.METACHANNELS, whatsAppData);
                    updateMetachannels(24);
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
        if (!grouplist.loading && waitGetGroups) {
            if (grouplist.error) {
                const errormessage = t(langKeys.apikeydoesntexist).toLocaleLowerCase();
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setViewSelected("view1");
                setWaitGetGroups(false);
                setChannelList([]);
            } else {
                setChannelList((grouplist?.data as unknown as Dictionary[]) ?? []);
                dispatch(showBackdrop(false));
                setViewSelected("view2");
                setWaitGetGroups(false);
                setNextbutton(true);
            }
        }
    }, [grouplist]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult]);

    function getgrouplistlocal() {
        dispatch(
            getGroupList({
                accesstoken: fields.service.accesstoken,
            })
        );
        dispatch(showBackdrop(true));
        setWaitGetGroups(true);
    }

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
                        }}
                    >
                        {t(langKeys.connectface)} Workplace
                    </div>

                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                const partialf = fields;
                                setNextbutton(value === "");
                                partialf.service.accesstoken = value;
                                setFields(partialf);
                            }}
                            valueDefault={fields.service.accesstoken}
                            label={t(langKeys.authenticationtoken)}
                            className="col-6"
                        />
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

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton}
                            onClick={() => {
                                getgrouplistlocal();
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
    }
    if (viewSelected === "view2") {
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
                        }}
                    >
                        {t(langKeys.connectface)} Workplace
                    </div>

                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            data={channelList}
                            optionValue="id"
                            optionDesc="name"
                            onChange={(value) => {
                                const partialf = fields;
                                setNextbutton(!value?.id);
                                partialf.service.groupid = value.id;
                                setFields(partialf);
                            }}
                            valueDefault={fields.service.groupid}
                            label={t(langKeys.group)}
                            className="col-6"
                        />
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

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton}
                            onClick={() => {
                                setViewSelected("view3");
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
                                <ChannelWorkplace style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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

export default ChannelAddFacebookWorkplace;