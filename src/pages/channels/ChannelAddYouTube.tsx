import { apiUrls } from 'common/constants';
import { Breadcrumbs, Box, Button, makeStyles } from '@material-ui/core';
import { ChannelYouTube } from 'icons';
import { ColorInput, FieldEdit, FieldSelect } from "components";
import { FC, useEffect, useState } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { listYouTube } from "store/google/actions";
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import GoogleLogInFrame from './GoogleLogInFrame';
import Link from '@material-ui/core/Link';
import paths from "common/constants/paths";

interface whatsAppData {
    typeWhatsApp?: string;
    row?: any;
}

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
    buttonGoogle: {
        "& button": {
            width: "200px",
            justifyContent: "center",
        }
    },
}));

export const ChannelAddYouTube: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useChannelAddStyles();
    const exchangeCodeResult = useSelector(state => state.google.requestExchangeCode);
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const listYouTubeResult = useSelector(state => state.google.requestListYouTube);
    const location = useLocation<whatsAppData>();
    const mainResult = useSelector(state => state.channel.channelList);
    const whatsAppData = location.state as whatsAppData | null;

    const [channellist, setChannellist] = useState([]);
    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setcoloricon] = useState("#FE0000");
    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "id": 0,
            "description": "",
            "type": "",
            "communicationchannelsite": "",
            "communicationchannelowner": "",
            "chatflowenabled": true,
            "integrationid": "",
            "color": "",
            "icons": "",
            "other": "",
            "form": "",
            "apikey": "",
            "coloricon": "#FE0000",
            "voximplantcallsupervision": false
        },
        "type": "YOUTUBE",
        "service": {
            "accesstoken": "",
            "refreshtoken": "",
            "scope": "",
            "tokentype": "",
            "idtoken": "",
            "channel": "",
        }
    })
    const [nextbutton, setNextbutton] = useState(true);
    const [setins, setsetins] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitExchange, setWaitExchange] = useState(false);
    const [waitList, setWaitList] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    }

    async function finishreg() {
        setsetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
        setViewSelected("main");
    }

    function setnameField(value: any) {
        setChannelreg(value === "");
        let partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    function setchannelField(value: any) {
        setNextbutton(value === null);
        let partialf = fields;
        partialf.service.channel = value?.id || "";
        setFields(partialf);
    }

    useEffect(() => {
        if (waitExchange) {
            if (!exchangeCodeResult.loading) {
                if (!exchangeCodeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (exchangeCodeResult.data) {
                        let partialFields = fields;
                        partialFields.service.accesstoken = exchangeCodeResult.data.access_token;
                        partialFields.service.idtoken = exchangeCodeResult.data.id_token;
                        partialFields.service.refreshtoken = exchangeCodeResult.data.refresh_token;
                        partialFields.service.scope = exchangeCodeResult.data.scope;
                        partialFields.service.tokentype = exchangeCodeResult.data.token_type;
                        setFields(partialFields);

                        setViewSelected("view2");
                        setChannellist([]);

                        dispatch(listYouTube({ accesstoken: exchangeCodeResult.data.access_token }));
                        dispatch(showBackdrop(true));
                        setWaitList(true);
                    }
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((exchangeCodeResult.msg || exchangeCodeResult.message) || exchangeCodeResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitExchange(false);
            }
        }
    }, [exchangeCodeResult, waitExchange])

    useEffect(() => {
        if (waitList) {
            if (!listYouTubeResult.loading) {
                if (!listYouTubeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (listYouTubeResult.data) {
                        if (listYouTubeResult.data.items) {
                            listYouTubeResult.data.items.forEach((element: any) => {
                                element.channelname = `https://www.youtube.com/channel/${element.id}`;
                            });
                            setChannellist(listYouTubeResult.data.items);
                        }
                    }
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((listYouTubeResult.msg || listYouTubeResult.message) || listYouTubeResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitList(false);
            }
        }
    }, [listYouTubeResult, waitList])

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setsetins(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                history.push(paths.CHANNELS);
            } else if (!executeResult) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
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

    if (viewSelected === "view1") {
        return (
            <>
                <meta name="google-signin-client_id" content={apiUrls.GOOGLECLIENTID_CHANNEL} />
                <script src="https://apis.google.com/js/platform.js" async defer></script>
                <div style={{ width: '100%' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_youtubetitle)}</div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.channel_youtubealert1)}</div>
                        <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.channel_youtubealert2)}</div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            <GoogleOAuthProvider clientId={apiUrls.GOOGLECLIENTID_CHANNEL}>
                                <GoogleLogInFrame
                                    setWaitExchange={setWaitExchange}
                                />
                            </GoogleOAuthProvider>
                        </div>
                        <div style={{ textAlign: "center", paddingTop: "20px", color: "#969ea5", fontStyle: "italic" }}>{t(langKeys.connectface4)}</div>
                        <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}><a style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                    </div>
                </div>
            </>
        )
    } else if (viewSelected === "view2") {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_youtubetitle)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            onChange={(value) => setchannelField(value)}
                            label={t(langKeys.selectchannellink)}
                            className="col-6"
                            valueDefault={fields.service.channel}
                            data={channellist}
                            optionDesc="channelname"
                            optionValue="id"
                        />
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={() => { setViewSelected("viewfinishreg") }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={nextbutton}
                        >{t(langKeys.next)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view2") }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.commchannelfinishreg)}</div>
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
                            <div style={{ alignItems: "center", display: "flex", justifyContent: "space-around", marginTop: '20px' }}>
                                <ChannelYouTube style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
                                <ColorInput
                                    hex={fields.parameters.coloricon}
                                    onChange={e => {
                                        setFields(prev => ({
                                            ...prev,
                                            parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                        }));
                                        setcoloricon(e.hex)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={() => { finishreg() }}
                            className={classes.button}
                            disabled={channelreg || mainResult.loading}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.finishreg)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChannelAddYouTube;