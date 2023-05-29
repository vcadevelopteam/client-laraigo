import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { showSnackbar } from 'store/popus/actions';
import { editChannel, resetEditChannel } from 'store/channel/actions';
import { getEditChannel } from 'common/helpers';
import { useHistory, useLocation } from 'react-router';
import { IChannel } from '@types';
import { Box, Breadcrumbs, Button, FormControlLabel, IconButton, Link, makeStyles } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { ColorInput, FieldEdit, FieldView, IOSSwitchPurple } from 'components';
import { formatNumber } from 'common/helpers';
import PublishIcon from '@material-ui/icons/Publish';
import Tooltip from '@material-ui/core/Tooltip';

import { uploadFile } from 'store/main/actions';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import paths from 'common/constants/paths';
import { CircularProgress } from '@material-ui/core';
import InfoIcon from "@material-ui/icons/Info";

const useFinalStepStyles = makeStyles(theme => ({
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "2em",
        color: "#7721ad",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

const ChannelEdit: FC = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const classes = useFinalStepStyles();
    const edit = useSelector(state => state.channel.editChannel);
    const history = useHistory();
    const location = useLocation();
    const channel = location.state as IChannel | null;

    const [name, setName] = useState("");
    const [auto, setAuto] = useState(false);
    const [welcometoneurl, setwelcometoneurl] = useState("");
    const [holdingtoneurl, setholdingtoneurl] = useState("");
    const [checkedCallSupervision, setCheckedCallSupervision] = useState(false);
    const [checkedRecording, setCheckedRecording] = useState(false);
    const [hexIconColor, setHexIconColor] = useState("");
    const [serviceCredentials, setServiceCredentials] = useState<any>({});
    const [waitUploadFile, setWaitUploadFile] = useState("");
    const uploadResult = useSelector(state => state.main.uploadFile);

    useEffect(() => {
        if (!channel) {
            history.push(paths.CHANNELS);
        } else {
            setName(channel.communicationchanneldesc);
            setAuto(true);
            channel.coloricon && setHexIconColor(channel.coloricon);
            if (channel.servicecredentials) {
                setServiceCredentials(JSON.parse(channel.servicecredentials));
                setholdingtoneurl(channel?.voximplantholdtone || "")
                setwelcometoneurl(channel?.voximplantwelcometone || "")
                setCheckedCallSupervision(!!channel?.voximplantcallsupervision || false)
                let voximplantrecording = null;
                if (channel?.voximplantrecording?.includes("recording")) {
                    voximplantrecording = JSON.parse(channel?.voximplantrecording)
                } else {
                    voximplantrecording = { recording: false, recordingstorage: 'month3', recordingquality: 'hd' }
                }
                setCheckedRecording(voximplantrecording.recording)
            }
        }

        return () => {
            dispatch(resetEditChannel());
        };
    }, [history, channel, dispatch]);



    useEffect(() => {
        if (waitUploadFile !== "") {
            if (!uploadResult.loading && !uploadResult.error) {
                waitUploadFile === "welcome" ? setwelcometoneurl(String(uploadResult.url)) : setholdingtoneurl(String(uploadResult.url))
                setWaitUploadFile("");
            } else if (uploadResult.error) {
                setWaitUploadFile("");
            }
        }
    }, [waitUploadFile, uploadResult, dispatch])

    useEffect(() => {
        if (edit.loading) return;
        if (edit.error === true) {
            dispatch(showSnackbar({
                message: edit.message!,
                show: true,
                severity: "error"
            }));
        } else if (edit.success) {
            dispatch(showSnackbar({
                message: t(langKeys.communicationchannel_editsuccess),
                show: true,
                severity: "success"
            }));
            history.push(paths.CHANNELS);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, history, dispatch]);

    const handleSubmit = useCallback(() => {
        if (!channel) return;
        const id = channel!.communicationchannelid;
        let recordingtosend = JSON.stringify({ recording: checkedRecording, recordingstorage: 'month3', recordingquality: 'hd' })
        const body = getEditChannel(id, channel, name, auto, hexIconColor, welcometoneurl, holdingtoneurl, checkedCallSupervision, channel?.type === "VOXI" ? recordingtosend : "");
        dispatch(editChannel(body));
    }, [name, hexIconColor, auto, channel, welcometoneurl, holdingtoneurl, checkedCallSupervision, checkedRecording, dispatch]);

    const handleGoBack = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        history.push(paths.CHANNELS);
    }, [history]);

    if (!channel) {
        return <div />;
    }

    const onUploadFile = (files: any, type: string) => {
        const selectedFile = files[0];
        if (selectedFile.size <= (1024 * 1024 * 5)) {
            var fd = new FormData();
            fd.append('file', selectedFile, selectedFile.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(type);
        } else {
            dispatch(showSnackbar({ show: true, severity: "warning", message: '' + (t(langKeys.filetoolarge)) + " Max: 5Mb" }))
        }

    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div style={{ width: "700px", marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', flex: 'wrap' }}>
                <div className={classes.title}>
                    {t(langKeys.communicationchannel_edit)}
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <FieldEdit
                            onChange={(value) => setName(value)}
                            label={t(langKeys.givechannelname)}
                            disabled={edit.loading}
                            valueDefault={channel!.communicationchanneldesc}
                        />
                        {channel?.phone && <>
                            <div>
                                <FieldView
                                    label={t(langKeys.phone)}
                                    value={channel!.phone}
                                />
                            </div>
                        </>}
                        {channel?.type === "VOXI" && <>
                            {serviceCredentials?.countryname && <div>
                                <FieldView
                                    label={t(langKeys.country)}
                                    value={serviceCredentials?.countryname}
                                />
                            </div>}
                            {serviceCredentials?.categoryname && <div>
                                <FieldView
                                    label={t(langKeys.category)}
                                    value={t(serviceCredentials?.categoryname)}
                                />
                            </div>}
                            {serviceCredentials?.statename && <div>
                                <FieldView
                                    label={t(langKeys.voximplant_state)}
                                    value={serviceCredentials?.statename}
                                />
                            </div>}
                            {serviceCredentials?.regionname && <div>
                                <FieldView
                                    label={t(langKeys.voximplant_region)}
                                    value={serviceCredentials?.regionname}
                                />
                            </div>}
                            {serviceCredentials?.costvca && <div>
                                <FieldView
                                    label={t(langKeys.voximplant_pricealert)}
                                    value={`$${formatNumber(parseFloat(serviceCredentials?.costvca || 0))}`}
                                />
                            </div>
                            }
                        </>}
                        {(channel?.type === "FBDM" || channel?.type === "FBWA") && <>
                            {serviceCredentials?.siteId && <div className="row-zyx">
                                <FieldView
                                    label={t(langKeys.url)}
                                    className="col-6"
                                    value={`https://www.facebook.com/${serviceCredentials?.siteId}`}
                                />
                            </div>}
                        </>}
                        <div>
                            <div >
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.givechannelcolor)}
                                </Box>
                                <ColorInput hex={hexIconColor} onChange={e => setHexIconColor(e.hex)} />
                            </div>
                        </div>
                    </div>
                    {channel?.type === "VOXI" &&
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: 'flex' }}>
                                    {t(langKeys.welcometone)}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.tonestooltip)}</div>} arrow placement="top" >
                                            <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                                        </Tooltip>
                                    </div>
                                </Box>

                                <div style={{ display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                        {(uploadResult.loading && waitUploadFile === "welcome") ?
                                            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CircularProgress size={30} />
                                            </div> :
                                            <FieldEdit
                                                valueDefault={welcometoneurl?.split("/")?.[welcometoneurl?.split("/")?.length - 1]?.replaceAll("%20", " ")}
                                                disabled={true}
                                            />
                                        }
                                    </div>
                                    <div>
                                        <input
                                            accept=".mp3,audio/*"
                                            id="contained-button-file"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => { onUploadFile(e.target.files, "welcome") }}
                                        />
                                        <label htmlFor="contained-button-file" style={{ height: 0 }}>
                                            <IconButton color="primary" aria-label="upload picture" size="small" component="span" disabled={uploadResult.loading}>
                                                <PublishIcon />
                                            </IconButton>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div >
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: 'flex' }}>
                                    {t(langKeys.standbytone)}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.tonestooltip)}</div>} arrow placement="top" >
                                            <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                                        </Tooltip>
                                    </div>
                                </Box>

                                <div style={{ display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                        {(uploadResult.loading && waitUploadFile === "holding") ?
                                            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CircularProgress size={30} />
                                            </div> :
                                            <FieldEdit
                                                valueDefault={holdingtoneurl?.split("/")?.[holdingtoneurl?.split("/")?.length - 1]?.replaceAll("%20", " ")}
                                                disabled={true}
                                            />
                                        }
                                    </div>
                                    <div>
                                        <input
                                            accept=".mp3,audio/*"
                                            id="contained-button-file2"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => { onUploadFile(e.target.files, "holding") }}
                                        />
                                        <label htmlFor="contained-button-file2">
                                            <IconButton color="primary" size="small" aria-label="upload picture" component="span" disabled={uploadResult.loading}>
                                                <PublishIcon />
                                            </IconButton>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {t(langKeys.voicechannel_callsupervisor)}
                                <Tooltip title={`${t(langKeys.voicechannel_callsupervisortooltip)}`} placement="top-start">
                                    <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                </Tooltip>
                                <FormControlLabel
                                    control={<IOSSwitchPurple checked={checkedCallSupervision} onChange={(e) => { setCheckedCallSupervision(e.target.checked); }} />}
                                    label={""}
                                    style={{ marginRight: "4px", marginLeft: 50 }}
                                />
                            </div>
                            <div>
                                {t(langKeys.voicechannel_recording)}
                                <Tooltip title={`${t(langKeys.voicechannel_recordingtooltip)}`} placement="top-start">
                                    <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                </Tooltip>
                                <FormControlLabel
                                    control={<IOSSwitchPurple checked={checkedRecording} onChange={(e) => { setCheckedRecording(e.target.checked) }} />}
                                    label={""}
                                    style={{ marginRight: "4px", marginLeft: 50 }}
                                />
                            </div>
                        </div>
                    }
                </div>
                <div style={{ marginLeft: 'auto', marginTop: 16 }}>
                    <Button
                        onClick={handleSubmit}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={edit.loading || uploadResult.loading}
                    >
                        <Trans i18nKey={langKeys.finishreg} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChannelEdit;