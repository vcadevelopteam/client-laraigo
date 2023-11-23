import { ColorInput, FieldEdit, FieldView, IOSSwitchPurple } from "components";
import { editChannel, resetEditChannel } from "store/channel/actions";
import { formatNumber, getEditChannel } from "common/helpers";
import { IChannel } from "@types";
import { langKeys } from "lang/keys";
import { showSnackbar } from "store/popus/actions";
import { Trans, useTranslation } from "react-i18next";
import { uploadFile } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";

import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    FormControlLabel,
    IconButton,
    Link,
    makeStyles,
} from "@material-ui/core";

import InfoIcon from "@material-ui/icons/Info";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import paths from "common/constants/paths";
import PublishIcon from "@material-ui/icons/Publish";
import React, { FC, useCallback, useEffect, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import ChannelEnableVirtualAssistant from './ChannelEnableVirtualAssistant';

const useFinalStepStyles = makeStyles(() => ({
    title: {
        color: "#7721ad",
        fontSize: "2em",
        fontWeight: "bold",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
        padding: "20px",
        textAlign: "center",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
}));

const ChannelEdit: FC = () => {
    type ServiceCredentialType = {
        categoryname: string;
        costvca: string;
        countryname: string;
        regionname: string;
        siteId: string;
        statename: string;
    };

    const { t } = useTranslation();

    const [auto, setAuto] = useState(false);
    const [checkedCallSupervision, setCheckedCallSupervision] = useState(false);
    const [checkedRecording, setCheckedRecording] = useState(false);
    const [hexIconColor, setHexIconColor] = useState("");
    const [holdingtoneurl, setHoldingtoneurl] = useState("");
    const [name, setName] = useState("");
    const [serviceCredentials, setServiceCredentials] = useState<ServiceCredentialType | null>(null);
    const [waitUploadFile, setWaitUploadFile] = useState("");
    const [welcometoneurl, setWelcometoneurl] = useState("");
    const [viewSelected, setViewSelected] = useState("main-view");
    const classes = useFinalStepStyles();
    const dispatch = useDispatch();
    const edit = useSelector((state) => state.channel.editChannel);
    const history = useHistory();
    const location = useLocation();
    const uploadResult = useSelector((state) => state.main.uploadFile);

    const channel = location.state as IChannel | null;

    useEffect(() => {
        if (!channel) {
            history.push(paths.CHANNELS);
        } else {
            setAuto(true);
            setName(channel.communicationchanneldesc);

            channel.coloricon && setHexIconColor(channel.coloricon);

            if (channel.servicecredentials) {
                setCheckedCallSupervision(Boolean(channel?.voximplantcallsupervision) || false);
                setHoldingtoneurl(channel?.voximplantholdtone ?? "");
                setServiceCredentials(JSON.parse(channel.servicecredentials));
                setWelcometoneurl(channel?.voximplantwelcometone ?? "");

                let voximplantrecording = null;

                if (channel?.voximplantrecording?.includes("recording")) {
                    voximplantrecording = JSON.parse(channel?.voximplantrecording);
                } else {
                    voximplantrecording = { recording: false, recordingstorage: "month3", recordingquality: "hd" };
                }

                setCheckedRecording(voximplantrecording.recording);
            }
        }

        return () => {
            dispatch(resetEditChannel());
        };
    }, [history, channel, dispatch]);

    useEffect(() => {
        if (waitUploadFile !== "") {
            if (!uploadResult.loading && !uploadResult.error) {
                waitUploadFile === "welcome"
                    ? setWelcometoneurl(String(uploadResult.url))
                    : setHoldingtoneurl(String(uploadResult.url));
                setWaitUploadFile("");
            } else if (uploadResult.error) {
                setWaitUploadFile("");
            }
        }
    }, [waitUploadFile, uploadResult, dispatch]);

    useEffect(() => {
        if (edit.loading) return;

        if (edit.error === true) {
            dispatch(
                showSnackbar({
                    message: t(edit.message ?? "error_unexpected_error"),
                    severity: "error",
                    show: true,
                })
            );
        } else if (edit.success) {
            if (!channel?.haveflow) {
                setViewSelected("enable-virtual-assistant")
            } else {
                dispatch(
                    showSnackbar({
                        message: t(langKeys.communicationchannel_editsuccess),
                        show: true,
                        severity: "success",
                    })
                );
                history.push(paths.CHANNELS);                
            }
        }
    }, [edit, history, dispatch]);

    const handleSubmit = useCallback(() => {
        if (!channel) return;

        const id = channel.communicationchannelid;
        const recordingtosend = JSON.stringify({
            recording: checkedRecording,
            recordingquality: "hd",
            recordingstorage: "month3",
        });

        const body = getEditChannel(
            id,
            channel,
            name,
            auto,
            hexIconColor,
            welcometoneurl,
            holdingtoneurl,
            checkedCallSupervision,
            channel?.type === "VOXI" ? recordingtosend : ""
        );

        dispatch(editChannel(body));
    }, [
        auto,
        channel,
        checkedCallSupervision,
        checkedRecording,
        dispatch,
        hexIconColor,
        holdingtoneurl,
        name,
        welcometoneurl,
    ]);

    const handleGoBack = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            history.push(paths.CHANNELS);
        },
        [history]
    );

    if (!channel) {
        return <div />;
    }

    const onUploadFile = (files: FileList | null, type: string) => {
        if (files) {
            const selectedFile = files[0];

            if (selectedFile.size <= 1024 * 1024 * 5) {
                const fd = new FormData();
                fd.append("file", selectedFile, selectedFile.name);
                dispatch(uploadFile(fd));
                setWaitUploadFile(type);
            } else {
                dispatch(
                    showSnackbar({
                        message: String(t(langKeys.filetoolarge)) + " Max: 5Mb",
                        severity: "warning",
                        show: true,
                    })
                );
            }
        }
    };
    if (viewSelected === "main-view") {
        return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div
                    style={{
                        display: "flex",
                        flex: "wrap",
                        flexDirection: "column",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "700px",
                    }}
                >
                    <div className={classes.title}>{t(langKeys.communicationchannel_edit)}</div>
                    <div style={{ display: "flex", gap: 24 }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                            <FieldEdit
                                disabled={edit.loading}
                                label={t(langKeys.givechannelname)}
                                onChange={(value) => setName(value)}
                                valueDefault={channel?.communicationchanneldesc}
                            />
                            {channel?.phone && (
                                <div>
                                    <FieldView label={t(langKeys.phone)} value={channel?.phone} />
                                </div>
                            )}
                            {channel?.type === "VOXI" && (
                                <>
                                    {serviceCredentials?.countryname && (
                                        <div>
                                            <FieldView
                                                label={t(langKeys.country)}
                                                value={serviceCredentials?.countryname}
                                            />
                                        </div>
                                    )}
                                    {serviceCredentials?.categoryname && (
                                        <div>
                                            <FieldView
                                                label={t(langKeys.category)}
                                                value={t(serviceCredentials?.categoryname)}
                                            />
                                        </div>
                                    )}
                                    {serviceCredentials?.statename && (
                                        <div>
                                            <FieldView
                                                label={t(langKeys.voximplant_state)}
                                                value={serviceCredentials?.statename}
                                            />
                                        </div>
                                    )}
                                    {serviceCredentials?.regionname && (
                                        <div>
                                            <FieldView
                                                label={t(langKeys.voximplant_region)}
                                                value={serviceCredentials?.regionname}
                                            />
                                        </div>
                                    )}
                                    {serviceCredentials?.costvca && (
                                        <div>
                                            <FieldView
                                                label={t(langKeys.voximplant_pricealert)}
                                                value={`$${formatNumber(parseFloat(serviceCredentials?.costvca || "0"))}`}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                            {(channel?.type === "FBDM" || channel?.type === "FBWA") && (
                                <>
                                    {serviceCredentials?.siteId && (
                                        <div className="row-zyx">
                                            <FieldView
                                                className="col-6"
                                                label={t(langKeys.url)}
                                                value={`https://www.facebook.com/${serviceCredentials?.siteId}`}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                            <div>
                                <div>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                        {t(langKeys.givechannelcolor)}
                                    </Box>
                                    <ColorInput hex={hexIconColor} onChange={(e) => setHexIconColor(e.hex)} />
                                </div>
                            </div>
                        </div>
                        {channel?.type === "VOXI" && (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div>
                                    <Box
                                        color="textPrimary"
                                        fontSize={14}
                                        fontWeight={500}
                                        lineHeight="18px"
                                        mb={0.5}
                                        style={{ display: "flex" }}
                                    >
                                        {t(langKeys.welcometone)}
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Tooltip
                                                arrow
                                                placement="top"
                                                title={<div style={{ fontSize: 12 }}>{t(langKeys.tonestooltip)}</div>}
                                            >
                                                <InfoRoundedIcon
                                                    color="action"
                                                    style={{ width: 15, height: 15, cursor: "pointer" }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </Box>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ flex: 1 }}>
                                            {uploadResult.loading && waitUploadFile === "welcome" ? (
                                                <div
                                                    style={{
                                                        alignItems: "center",
                                                        display: "flex",
                                                        flex: 1,
                                                        height: "100%",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <CircularProgress size={30} />
                                                </div>
                                            ) : (
                                                <FieldEdit
                                                    disabled={true}
                                                    valueDefault={welcometoneurl
                                                        ?.split("/")
                                                        ?.[welcometoneurl?.split("/")?.length - 1]?.replaceAll("%20", " ")}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                accept=".mp3,audio/*"
                                                id="contained-button-file"
                                                style={{ display: "none" }}
                                                type="file"
                                                onChange={(e) => {
                                                    onUploadFile(e.target.files, "welcome");
                                                }}
                                            />
                                            <label htmlFor="contained-button-file" style={{ height: 0 }}>
                                                <IconButton
                                                    aria-label="upload picture"
                                                    color="primary"
                                                    component="span"
                                                    disabled={uploadResult.loading}
                                                    size="small"
                                                >
                                                    <PublishIcon />
                                                </IconButton>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Box
                                        color="textPrimary"
                                        fontSize={14}
                                        fontWeight={500}
                                        lineHeight="18px"
                                        mb={0.5}
                                        style={{ display: "flex" }}
                                    >
                                        {t(langKeys.standbytone)}
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Tooltip
                                                arrow
                                                placement="top"
                                                title={<div style={{ fontSize: 12 }}>{t(langKeys.tonestooltip)}</div>}
                                            >
                                                <InfoRoundedIcon
                                                    color="action"
                                                    style={{ width: 15, height: 15, cursor: "pointer" }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </Box>

                                    <div style={{ display: "flex" }}>
                                        <div style={{ flex: 1 }}>
                                            {uploadResult.loading && waitUploadFile === "holding" ? (
                                                <div
                                                    style={{
                                                        alignItems: "center",
                                                        display: "flex",
                                                        flex: 1,
                                                        height: "100%",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <CircularProgress size={30} />
                                                </div>
                                            ) : (
                                                <FieldEdit
                                                    disabled={true}
                                                    valueDefault={holdingtoneurl
                                                        ?.split("/")
                                                        ?.[holdingtoneurl?.split("/")?.length - 1]?.replaceAll("%20", " ")}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                accept=".mp3,audio/*"
                                                id="contained-button-file2"
                                                style={{ display: "none" }}
                                                type="file"
                                                onChange={(e) => {
                                                    onUploadFile(e.target.files, "holding");
                                                }}
                                            />
                                            <label htmlFor="contained-button-file2">
                                                <IconButton
                                                    aria-label="upload picture"
                                                    color="primary"
                                                    component="span"
                                                    disabled={uploadResult.loading}
                                                    size="small"
                                                >
                                                    <PublishIcon />
                                                </IconButton>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {t(langKeys.voicechannel_callsupervisor)}
                                    <Tooltip
                                        placement="top-start"
                                        title={`${t(langKeys.voicechannel_callsupervisortooltip)}`}
                                    >
                                        <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                    </Tooltip>
                                    <FormControlLabel
                                        label={""}
                                        style={{ marginRight: "4px", marginLeft: 50 }}
                                        control={
                                            <IOSSwitchPurple
                                                checked={checkedCallSupervision}
                                                onChange={(e) => {
                                                    setCheckedCallSupervision(e.target.checked);
                                                }}
                                            />
                                        }
                                    />
                                </div>
                                <div>
                                    {t(langKeys.voicechannel_recording)}
                                    <Tooltip title={`${t(langKeys.voicechannel_recordingtooltip)}`} placement="top-start">
                                        <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                    </Tooltip>
                                    <FormControlLabel
                                        label={""}
                                        style={{ marginRight: "4px", marginLeft: 50 }}
                                        control={
                                            <IOSSwitchPurple
                                                checked={checkedRecording}
                                                onChange={(e) => {
                                                    setCheckedRecording(e.target.checked);
                                                }}
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ marginLeft: "auto", marginTop: 16 }}>
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={edit.loading || uploadResult.loading}
                            onClick={handleSubmit}
                            variant="contained"
                        >
                            <Trans i18nKey={langKeys.finishreg} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return <ChannelEnableVirtualAssistant/>
    }
};

export default ChannelEdit;