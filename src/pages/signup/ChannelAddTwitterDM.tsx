/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, FormControlLabel, FormGroup } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit, ColorInput, IOSSwitch } from "components";
import { TwitterIcon } from "icons";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddTwitterDM: FC<{setrequestchannels:(param:any)=>void,setlistchannels:(param:any)=>void}> = ({setrequestchannels,setlistchannels}) => {
    const [viewSelected, setViewSelected] = useState("view1");
    const [nextbutton, setNextbutton] = useState(true);
    const [nextbutton2, setNextbutton2] = useState(true);
    const [enable, setenable] = useState(false);
    const [coloricon, setcoloricon] = useState("#1D9BF0");
    const [channelreg, setChannelreg] = useState(true);
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
            "chatflowenabled": false,
            "integrationid": "",
            "color": "",
            "icons": "",
            "other": "",
            "form": "",
            "apikey": "",
            "coloricon": "#1D9BF0",
        },
        "type": "TWITTERDM",
        "service": {
            "consumerkey": "",
            "consumersecret": "",
            "accesstoken": "",
            "accesssecret": "",
            "devenvironment": "",
            "siteid": "",
        }
    })

    async function finishreg() {
        setrequestchannels((p:any)=>([...p,fields]))
        setlistchannels((p:any)=>({...p,twitterDM:false}))
    }
    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    function setvalField(value: any) {
        let partialf = fields;
        partialf.parameters.chatflowenabled = value
        setFields(partialf)
    }
    if(viewSelected==="view1"){
        return (
            <div style={{ width: '100%' }}>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.twittertitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.twittertitle2)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value==="" || fields.service.consumersecret===""||fields.service.accesstoken===""||fields.service.accesssecret==="")
                                let partialf = fields;
                                partialf.service.consumerkey= value
                                setFields(partialf)
                            }}
                            label={t(langKeys.consumerapikey)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value==="" || fields.service.consumerkey===""||fields.service.accesstoken===""||fields.service.accesssecret==="")
                                let partialf = fields;
                                partialf.service.consumersecret= value
                                setFields(partialf)
                            }}
                            label={t(langKeys.consumerapisecret)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value==="" || fields.service.consumerkey===""||fields.service.consumersecret===""||fields.service.accesssecret==="")
                                let partialf = fields;
                                partialf.service.accesstoken= value
                                setFields(partialf)
                            }}
                            label={t(langKeys.authenticationtoken)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value==="" || fields.service.consumerkey===""||fields.service.consumersecret===""||fields.service.accesstoken==="")
                                let partialf = fields;
                                partialf.service.accesssecret= value
                                setFields(partialf)
                            }}
                            label={t(langKeys.authenticationsecret)}
                            className="col-6"
                        />
                    </div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton}
                            onClick={() => { setViewSelected("view2") }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>

                    </div>

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
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.twittertitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.twittertitle2)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton2(value===""||fields.parameters.communicationchannelowner==="")
                                let partialf = fields;
                                partialf.service.devenvironment= value
                                setFields(partialf)
                            }}
                            label={t(langKeys.devenvironment)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton2(value===""||fields.service.devenvironment==="")
                                let partialf = fields;
                                partialf.service.siteid= value
                                partialf.parameters.communicationchannelowner = value
                                partialf.parameters.communicationchannelsite = value
                                setFields(partialf)
                            }}
                            label={t(langKeys.consumerpageid)}
                            className="col-6"
                        />
                    </div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton2}
                            onClick={() => { setViewSelected("viewfinishreg") }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
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
                                <TwitterIcon style={{fill: `${coloricon}`, width: "100px" }}/>
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
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <div className="col-6" style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.enablechatflow)}</Box>
                            <FormGroup>
                                <FormControlLabel control={<IOSSwitch onChange={(e) => {setvalField(e.target.checked);setenable(e.target.checked)}}/>} label={enable?t(langKeys.enable):t(langKeys.disabled)} />
                            </FormGroup>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={() => { finishreg() }}
                            className={classes.button}
                            disabled={channelreg}
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