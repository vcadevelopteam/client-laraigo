import React, { FC, useEffect, useState } from "react";
import { apiUrls } from "common/constants";
import { Box, Breadcrumbs, Button, FormControlLabel, makeStyles } from "@material-ui/core";
import { ChannelWhatsApp01 } from "icons";
import { ColorInput, FieldEdit, FieldSelect, IOSSwitch } from "components";
import { ConnectButton } from "360dialog-connect-button";
import { Dictionary, IChannel } from "@types";
import { getPhoneList, insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";
import ChannelEnableVirtualAssistant from "./ChannelEnableVirtualAssistant";

const useChannelAddStyles = makeStyles(() => ({
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
}));

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
    onboarding?: boolean;
}

interface CallbackData {
    channels: string;
    client: string;
}

export const ChannelAddWhatsAppOnboarding: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const [allowInsert, setAllowInsert] = useState(false);
    const [channelRegister, setChannelRegister] = useState(true);
    const [checkedCloud, setCheckedCloud] = useState(false);
    const [colorIcon, setColorIcon] = useState("#4AC959");
    const [dialogChannels, setDialogChannels] = useState<string | null>(null);
    const [dialogClient, setDialogClient] = useState<string | null>(null);
    const [numberList, setNumberList] = useState<Dictionary[]>([]);
    const [showLastStep, setShowLastStep] = useState(false);
    const [waitList, setWaitList] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const executeResult = useSelector((state) => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<WhatsAppData>();
    const mainResult = useSelector((state) => state.channel.channelList);
    const numberResult = useSelector((state) => state.channel.requestGetNumberList);
    const whatsAppData = location.state as WhatsAppData | null;

    const channel = whatsAppData?.row as IChannel | null;
    const [viewSelected, setViewSelected] = useState("view1");

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: "WHATSAPP",
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
            channelid: "",
            iscloud: false,
            partnerid: apiUrls.DIALOG360PARTNERID,
        },
    });

    async function finishRegister() {
        setAllowInsert(true);
        setWaitSave(true);
        dispatch(insertChannel(fields));
    }

    async function goBack() {
        setViewSelected("enable-virtual-assistant")
    }

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get("client")) {
            setDialogClient(query.get("client") ?? null);
        } else {
            setDialogClient(null);
        }
        if (query.get("channels")) {
            setDialogChannels(query.get("channels") ?? null);
        } else {
            setDialogChannels(null);
        }
    }, []);

    useEffect(() => {
        if (!mainResult.loading && allowInsert) {
            if (executeResult) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setAllowInsert(false);
                setWaitSave(false);
                goBack();
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
                setAllowInsert(false);
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

    useEffect(() => {
        if (waitList) {
            if (!numberResult.loading) {
                if (numberResult.data) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    dispatch(showBackdrop(false));
                    setWaitList(false);

                    if (numberResult.data) {
                        setNumberList((numberResult.data as unknown as Dictionary[]) || []);
                    } else {
                        setNumberList([]);
                    }
                } else {
                    dispatch(
                        showSnackbar({
                            severity: "error",
                            show: true,
                            message: t(numberResult.code ?? "error_unexpected_error", {
                                module: t(langKeys.channel).toLocaleLowerCase(),
                            }),
                        })
                    );
                    dispatch(showBackdrop(false));
                    setWaitList(false);
                }
            }
        }
    }, [numberResult, waitList]);

    useEffect(() => {
        if (dialogClient && dialogChannels) {
            dispatch(
                getPhoneList({
                    channelList: (dialogChannels || "").split("[").join("").split("]").join("").split(","),
                    partnerId: apiUrls.DIALOG360PARTNERID,
                })
            );
            dispatch(showBackdrop(true));
            setWaitList(true);
            setNumberList([]);
        }
    }, [dialogClient, dialogChannels]);

    function setNameField(value: string) {
        setChannelRegister(value === "");
        const partialFields = fields;
        partialFields.parameters.description = value;
        setFields(partialFields);
    }

    function setChecked(value: boolean) {
        const partialFields = fields;
        partialFields.service.iscloud = value ?? false;
        setFields(partialFields);
    }

    function setValueField(value: { channelId: string; phone: string }) {
        if (value) {
            const partialFields = fields;

            partialFields.parameters.communicationchannelowner = value?.channelId || "";
            partialFields.parameters.communicationchannelsite = value?.phone || "";
            partialFields.service.channelid = value?.channelId || "";

            setFields(partialFields);
            setShowLastStep(true);
        } else {
            const partialFields = fields;

            partialFields.parameters.communicationchannelowner = "";
            partialFields.parameters.communicationchannelsite = "";
            partialFields.service.channelid = "";

            setFields(partialFields);
            setShowLastStep(false);
        }
    }

    const handleCallback = (callbackEvent: unknown) => {
        setDialogChannels(null);
        setDialogClient(null);

        if (callbackEvent) {
            if ((callbackEvent as CallbackData).channels) {
                setDialogChannels((callbackEvent as CallbackData).channels || null);
            }

            if ((callbackEvent as CallbackData).client) {
                setDialogClient((callbackEvent as CallbackData).client || null);
            }
        }
    };
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
                    href="/"
                    key={"mainview"}
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
                <div>
                    <div
                        style={{
                            color: "#7721ad",
                            fontSize: "2em",
                            fontWeight: "bold",
                            padding: "16px",
                            textAlign: "center",
                        }}
                    >
                        {t(langKeys.connect_yourwhatsappnumber)}
                    </div>
                    <div
                        style={{
                            color: "#969ea5",
                            fontSize: "1.1em",
                            marginBottom: "10px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            maxWidth: "1200px",
                            padding: "16px",
                            textAlign: "center",
                        }}
                    >
                        {t(langKeys.connect_yourwhatsappnumberdetail)}
                    </div>
                    <ConnectButton
                        callback={handleCallback}
                        label={t(langKeys.connect_whatsappnumber)}
                        partnerId={`${apiUrls.DIALOG360PARTNERID}`}
                        queryParameters={{
                            redirect_url: `${window.location.origin}/channels/:id/add/ChannelAddWhatsAppOnboarding`,
                        }}
                        style={{
                            alignItems: "center",
                            backgroundColor: "#7721ad",
                            border: "1px solid #7721ad",
                            borderRadius: "4px",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            justifyItems: "center",
                            margin: "auto",
                            padding: "10px",
                            textAlign: "center",
                            textTransform: "none",
                        }}
                    />
                </div>
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
                        {t(langKeys.select_whatsappnumber)}
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            className="col-5"
                            data={numberList}
                            label={t(langKeys.linked_whatsappnumber)}
                            onChange={(value) => setValueField(value)}
                            optionDesc="phone"
                            optionValue="channelId"
                            valueDefault={fields.parameters.communicationchannelowner}
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
                                            setCheckedCloud(e.target.checked);
                                            setChecked(e.target.checked);
                                        }}
                                    />
                                }
                            />
                        </div>
                        <div className="col-3"></div>
                    </div>
                </div>
                {showLastStep && (
                    <>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "16px",
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
                                onChange={(value) => setNameField(value)}
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
                                    <ChannelWhatsApp01
                                        style={{ fill: `${colorIcon}`, height: "100px", width: "100px" }}
                                    />
                                    <ColorInput
                                        hex={fields.parameters.coloricon}
                                        onChange={(e) => {
                                            setFields((prev) => ({
                                                ...prev,
                                                parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                            }));
                                            setColorIcon(e.hex);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={channelRegister || mainResult.loading}
                                variant="contained"
                                onClick={() => {
                                    finishRegister();
                                }}
                            >
                                {t(langKeys.finishreg)}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChannelAddWhatsAppOnboarding;