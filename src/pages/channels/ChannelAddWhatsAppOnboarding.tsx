/* eslint-disable react-hooks/exhaustive-deps */
import { apiUrls } from "common/constants";
import { ColorInput, FieldEdit, FieldSelect } from "components";
import { ConnectButton } from "360dialog-connect-button";
import { FC, useEffect, useState } from "react";
import { insertChannel, getPhoneList } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { makeStyles, Breadcrumbs, Button, Box } from '@material-ui/core';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { WhatsappIcon } from "icons";

import Link from '@material-ui/core/Link';
import paths from "common/constants/paths";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        fontSize: '14px',
        fontWeight: 500,
        padding: 12,
        textTransform: 'initial',
        width: "180px",
    },
}));

interface whatsAppData {
    row?: any;
    typeWhatsApp?: string;

}

export const ChannelAddWhatsAppOnboarding: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useChannelAddStyles();
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<whatsAppData>();
    const mainResult = useSelector(state => state.channel.channelList);
    const numberResult = useSelector(state => state.channel.requestGetPageList);
    const whatsAppData = location.state as whatsAppData | null;

    const [channelRegister, setChannelRegister] = useState(true);
    const [colorIcon, setColorIcon] = useState("#4AC959");
    const [dialogClient, setDialogClient] = useState<string | null>(null);
    const [dialogChannels, setDialogChannels] = useState<string | null>(null);
    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "apikey": "",
            "chatflowenabled": true,
            "color": "",
            "coloricon": "#4AC959",
            "communicationchannelowner": "",
            "communicationchannelsite": "",
            "description": "",
            "form": "",
            "icons": "",
            "id": 0,
            "integrationid": "",
            "other": "",
            "type": "",
        },
        "service": {
            "channelid": "",
            "partnerid": apiUrls.DIALOG360PARTNERID
        },
        "type": "WHATSAPP",
    });
    const [allowInsert, setAllowInsert] = useState(false);
    const [showRegister, setShowRegister] = useState(true);
    const [numberList, setNumberList] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [waitList, setWaitList] = useState(false);

    async function finishRegister() {
        setAllowInsert(true);
        setWaitSave(true);
        dispatch(insertChannel(fields));
    }

    async function goBack() {
        history.push(paths.CHANNELS);
    }

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('client')) {
            setDialogClient(query.get('client') || null);
        }
        else {
            setDialogClient(null);
        }
        if (query.get('channels')) {
            setDialogChannels(query.get('channel') || null);
        }
        else {
            setDialogChannels(null);
        }
    }, [])

    useEffect(() => {
        if (!mainResult.loading && allowInsert) {
            if (executeResult) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setAllowInsert(false);
                setShowRegister(false);
                setWaitSave(false);
            } else if (!executeResult) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setAllowInsert(false);
                setShowRegister(false);
                setWaitSave(false);
            }
        }
    }, [mainResult])

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    useEffect(() => {
        if (waitList) {
            if (!numberResult.loading && !numberResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                dispatch(showBackdrop(false));
                setWaitList(false);

                if (numberResult.data) {
                    setNumberList(numberResult.data || []);
                }
                else {
                    setNumberList([]);
                }
            } else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(numberResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitList(false);
            }
        }
    }, [numberResult, waitList])

    useEffect(() => {
        console.log(`CLIENT: ${JSON.stringify(dialogClient)}`);
        console.log(`CHANNELS: ${JSON.stringify(dialogChannels)}`);

        if (dialogClient && dialogChannels) {
            dispatch(getPhoneList({ partnerId: apiUrls.DIALOG360PARTNERID, channelList: dialogChannels }));
            dispatch(showBackdrop(true));
            setWaitList(true);
        }
    }, [dialogClient, dialogChannels])

    function setNameField(value: any) {
        setChannelRegister(value === "");
        let partialFields = fields;
        partialFields.parameters.description = value;
        setFields(partialFields);
    }

    function setValueField(value: any) {
        if (value) {
            let partialFields = fields;
            partialFields.parameters.communicationchannelsite = value?.phone || "";
            partialFields.parameters.communicationchannelowner = value?.channelId || "";
            partialFields.service.channelid = value?.channelId || "";
            setFields(partialFields);
        }
        else {
            let partialFields = fields;
            partialFields.parameters.communicationchannelsite = "";
            partialFields.parameters.communicationchannelowner = "";
            partialFields.service.channelid = "";
            setFields(partialFields);
        }
    }

    const handleCallback = (callbackEvent: any) => {
        console.log(`CALLBACK: ${JSON.stringify(callbackEvent)}`);

        setDialogClient(null);
        setDialogChannels(null);

        if (callbackEvent) {
            if (callbackEvent.client) {
                setDialogClient(callbackEvent.client || null);
            }
            if (callbackEvent.channels) {
                setDialogChannels(callbackEvent.channels || null);
            }
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "16px" }}>{t(langKeys.connect_yourwhatsappnumber)}</div>
                    <div style={{ textAlign: "center", fontSize: "1.1em", color: "#969ea5", padding: "16px", marginLeft: "auto", marginRight: "auto", maxWidth: "1200px", marginBottom: "10px" }}>{t(langKeys.connect_yourwhatsappnumberdetail)}</div>
                    <ConnectButton
                        callback={handleCallback}
                        partnerId={apiUrls.DIALOG360PARTNERID}
                        style={{ margin: "auto", backgroundColor: "#7721ad", color: "#fff", border: "1px solid #7721ad", borderRadius: "4px", padding: "10px", textTransform: "none", display: "flex", textAlign: "center", justifyItems: "center", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        label={t(langKeys.connect_whatsappnumber)}
                        queryParameters={{
                            redirect_url: `${window.location.origin}/channels/:id/add/ChannelAddWhatsAppOnboarding`
                        }}
                    />
                </div>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.select_whatsappnumber)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            onChange={(value) => setValueField(value)}
                            label={t(langKeys.linked_whatsappnumber)}
                            className="col-6"
                            valueDefault={fields.parameters.communicationchannelowner}
                            data={mainResult.data}
                            optionDesc="phone"
                            optionValue="channelId"
                        />
                    </div>
                </div>
                {fields.service.channelid && <>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "16px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.commchannelfinishreg)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setNameField(value)}
                            label={t(langKeys.givechannelname)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <div className="col-6">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                {t(langKeys.givechannelcolor)}
                            </Box>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                <WhatsappIcon style={{ fill: `${colorIcon}`, width: "100px" }} />
                                <ColorInput
                                    hex={fields.parameters.coloricon}
                                    onChange={e => {
                                        setFields(prev => ({
                                            ...prev,
                                            parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                        }));
                                        setColorIcon(e.hex)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        {showRegister ?
                            <Button
                                onClick={() => { finishRegister() }}
                                className={classes.button}
                                disabled={channelRegister || mainResult.loading}
                                variant="contained"
                                color="primary"
                            >{t(langKeys.finishreg)}
                            </Button>
                            : null
                        }
                    </div>
                </>}
            </div>
        </div>
    )
}

export default ChannelAddWhatsAppOnboarding