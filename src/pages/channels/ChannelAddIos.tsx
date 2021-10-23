/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, FormControlLabel, FormGroup } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { ColorInput, FieldEdit, IOSSwitch, } from "components";
import { useHistory } from "react-router";
import paths from "common/constants/paths";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { insertChannel } from "store/channel/actions";
import { AppleIcon } from "icons";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddIos: FC = () => {
    const [waitSave, setWaitSave] = useState(false);
    const [setins, setsetins] = useState(false);
    const [channelreg, setChannelreg] = useState(true);
    const [showRegister, setShowRegister] = useState(true);
    const [showClose, setShowClose] = useState(false);
    const [showScript, setShowScript] = useState(false);
    const [integrationId, setIntegrationId] = useState('');
    const mainResult = useSelector(state => state.channel.channelList);
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [coloricon, setcoloricon] = useState("#000000");
    const [enable, setenable] = useState(false);
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
            "coloricon": "#000000",
        },
        "type": "SMOOCHIOS",
    })

    async function finishreg() {
        setsetins(true)
        dispatch(insertChannel(fields))
        setWaitSave(true);
    }
    async function goback() {
        history.push(paths.CHANNELS);
    }
    useEffect(() => {
        if (!mainResult.loading && setins){
            if (executeResult) {
                setsetins(false)
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setShowRegister(false);
                setShowClose(true);
                setShowScript(true);
                setIntegrationId(mainResult.data[0].integrationId);
            } else if (!executeResult) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
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
    return (
        <div style={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD)}}>
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
                            <AppleIcon style={{fill: `${coloricon}`, width: "100px" }}/>
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
                    {showRegister ? 
                        <Button
                            onClick={() => { finishreg() }}
                            className={classes.button}
                            disabled={channelreg}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.finishreg)}
                        </Button>
                        : null
                    }
                    {showClose ? 
                        <Button
                            onClick={() => { goback() }}
                            className={classes.button}
                            disabled={channelreg}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.close)}
                        </Button>
                        : null
                    }
                </div>
            </div>
            <div style={{ height: 20 }} />
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column' }}><pre style={{ background: '#f4f4f4', border: '1px solid #ddd', color: '#666', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word'}}><code>
                {
                    `Smooch.init(this, new Settings("${integrationId}"), new SmoochCallback<InitializationStatus>() {\n@Override\npublic void run(@NonNull Response<InitializationStatus> response) {\n// Handle the response, no casting required...\nif (response.getData() == InitializationStatus.SUCCESS) {\n// Your code after init is complete\n} else {\n// Something went wrong during initialization\n}\n}\n});`
                }
                </code></pre><div style={{ height: 20 }} />
            </div>
        </div>
    )
}