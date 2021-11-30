/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop } from 'store/popus/actions';
import { Facebook as FacebookIcon} from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect, ColorInput } from "components";
import { InstagramIcon} from "icons";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsListSub } from "store/channel/actions";
import { apiUrls } from 'common/constants';

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddInstagram: FC<{setrequestchannels:(param:any)=>void,setlistchannels:(param:any)=>void,setOpenWarning:(param:any)=>void}> = ({setrequestchannels,setlistchannels,setOpenWarning}) => {
    const [viewSelected, setViewSelected] = useState("view1");
    const [nextbutton, setNextbutton] = useState(true);
    const [channelreg, setChannelreg] = useState(true);
    const mainResult = useSelector(state => state.channel.channelList)
    const [coloricon, setcoloricon] = useState("#F56040");
    const dispatch = useDispatch();
    const { t } = useTranslation();
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
        },
        "type": "INSTAGRAM",
        "service": {
            "accesstoken": "",
            "siteid": "",
            "appid": apiUrls.INSTAGRAMAPP
        }
    })

    async function finishreg() {
        setrequestchannels((p:any)=>([...p,fields]))
        setlistchannels((p:any)=>({...p,instagram:false}))
    }

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsListSub(r.accessToken))
            setViewSelected("view2")
            dispatch(showBackdrop(true));
        }
    }
    function setValueField(value: any) {
        setNextbutton(value==null)
        let partialf = fields;
        partialf.parameters.communicationchannelsite = value?.id||""
        partialf.parameters.communicationchannelowner = value?.name||""
        partialf.service.siteid = value?.id||""
        partialf.service.accesstoken = value?.access_token||""

        setFields(partialf)
    }
    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    if(viewSelected==="view1"){
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.connectinsta)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.connectinsta2)}</div>
                    <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.connectinsta3)}</div>
    
                        <FacebookLogin
                            appId={apiUrls.INSTAGRAMAPP}
                            autoLoad={false}
                            buttonStyle={{ marginLeft: "calc(50% - 135px)", marginTop: "30px", marginBottom: "20px", backgroundColor: "#7721AD", textTransform: "none" }}
                            fields="name,email,picture"
                            scope="instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_manage_metadata,pages_read_engagement,pages_show_list,public_profile"
                            callback={processFacebookCallback}
                            textButton={t(langKeys.linkinstagrampage)}
                            onClick={(e: any) => {
                                e.view.window.FB.init({
                                    appId: apiUrls.INSTAGRAMAPP,
                                    cookie: true,
                                    xfbml: true,
                                    version: 'v8.0'
                                });
                            }}
                            icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                        />
    
                    <div style={{ textAlign: "center", color: "#969ea5", fontStyle: "italic" }}>{t(langKeys.connectinsta4)}</div>
                    <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}><a href="https://app.laraigo.com/privacy" target="_blank" rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
    
                </div>
            </div>
        )
    }else if(viewSelected==="view2"){
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
                        {"<< Previous"}
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
    }else{
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view2") }}>
                        {"<< Previous"}
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
                            <div style={{display:"flex",justifyContent:"space-around", alignItems: "center"}}>
                                <InstagramIcon style={{fill: `${coloricon}`, width: "100px" }}/>
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
                            disabled={channelreg}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>

                    </div>

                </div>
            </div>
        )
    }
}