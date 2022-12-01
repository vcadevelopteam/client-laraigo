/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { Facebook as FacebookIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { ColorInput, FieldEdit, FieldSelect } from "components";
import { useHistory, useLocation } from "react-router";
import paths from "common/constants/paths";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsList, insertChannel } from "store/channel/actions";
import { InstagramIcon } from "icons";
import { apiUrls } from 'common/constants';

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
        width: "180px",
    },
}));

export const ChannelAddInstagram: FC = () => {
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);
    const [setins, setsetins] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [channelreg, setChannelreg] = useState(true);
    const mainResult = useSelector(state => state.channel.channelList)
    const executeResult = useSelector(state => state.channel.successinsert)
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [coloricon, setcoloricon] = useState("#F56040");
    const classes = useChannelAddStyles();
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
            "coloricon": "#F56040",
            "voximplantcallsupervision": false
        },
        "type": "INSTAGRAM",
        "service": {
            "accesstoken": "",
            "siteid": "",
            "appid": apiUrls.INSTAGRAMAPP
        }
    })

    const location = useLocation<whatsAppData>();

    const whatsAppData = location.state as whatsAppData | null;

    const openprivacypolicies = () => {
        window.open("/privacy", '_blank');
    }

    const openviewsteps = () => {
        window.open("https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/a61f2d61-a974-42e4-b393-481ef8311bb0/Instagram_warning.png", '_blank');
    }

    async function finishreg() {
        setsetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
        setViewSelected("main");
    }

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setsetins(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                history.push(paths.CHANNELS);
            } else if (!executeResult) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsList(r.accessToken, apiUrls.INSTAGRAMAPP));
            setViewSelected("view2");
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
    }

    function setValueField(value: any) {
        setNextbutton(value === null)
        let partialf = fields;
        partialf.parameters.communicationchannelsite = value?.id || "";
        partialf.parameters.communicationchannelowner = value?.name || "";
        partialf.service.siteid = value?.id || "";
        partialf.service.accesstoken = value?.access_token || "";

        setFields(partialf);
    }

    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf)
    }

    if (viewSelected === "view1") {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.connectinsta)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", color: "#cc3333", padding: "20px" }}>{t(langKeys.instagram_warning)} <a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={openviewsteps} rel="noopener noreferrer">[{t(langKeys.view_steps)}]</a></div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.connectinsta2)}</div>
                    <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.connectinsta3)}</div>
                    <FacebookLogin
                        appId={apiUrls.INSTAGRAMAPP}
                        autoLoad={false}
                        buttonStyle={{ margin: "auto", backgroundColor: "#7721ad", textTransform: "none", display: "flex", textAlign: "center", justifyItems: "center", alignItems: "center", justifyContent: "center" }}
                        fields="name,email,picture"
                        scope="instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_manage_metadata,pages_read_engagement,pages_show_list,public_profile"
                        callback={processFacebookCallback}
                        textButton={t(langKeys.linkinstagrampage)}
                        icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                        onClick={(e: any) => {
                            e.view.window.FB.init({
                                appId: apiUrls.INSTAGRAMAPP,
                                cookie: true,
                                xfbml: true,
                                version: apiUrls.FACEBOOKVERSION,
                            });
                        }}
                        disableMobileRedirect={true}
                    />
                    <div style={{ textAlign: "center", paddingTop: "20px", color: "#969ea5", fontStyle: "italic" }}>{t(langKeys.connectinsta4)}</div>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                    <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}><a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                </div>
            </div>
        )
    } else if (viewSelected === "view2") {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.connectinsta)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            onChange={(value) => setValueField(value)}
                            label={t(langKeys.selectpagelink)}
                            className="col-6"
                            data={mainResult.data}
                            optionDesc="name"
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
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                {t(langKeys.givechannelcolor)}
                            </Box>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                <InstagramIcon style={{ fill: `${coloricon}`, width: "100px" }} />
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

export default ChannelAddInstagram