/* eslint-disable react-hooks/exhaustive-deps */
import { ChannelIos } from "icons";
import { ColorInput, FieldEdit, } from "components";
import { FC, useEffect, useState } from "react";
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { makeStyles, Breadcrumbs, Button, Box } from '@material-ui/core';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

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
}));

export const ChannelAddIos: FC<{ edit: boolean }> = ({ edit }) => {
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
            "coloricon": "#000000",
            "voximplantcallsupervision": false
        },
        "type": "SMOOCHIOS",
    })

    const location = useLocation<whatsAppData>();

    const whatsAppData = location.state as whatsAppData | null;

    async function finishreg() {
        setsetins(true)
        dispatch(insertChannel(fields))
        setWaitSave(true);
    }
    async function goback() {
        history.push(paths.CHANNELS);
    }
    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setsetins(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setShowRegister(false);
                setShowClose(true);
                setShowScript(true);
                setIntegrationId(mainResult.data[0].integrationId);
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

    function setnameField(value: any) {
        setChannelreg(value === "");
        let partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }
    return (
        <div style={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
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
                            <ChannelIos style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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
                    {showRegister ?
                        <Button
                            onClick={() => { finishreg() }}
                            className={classes.button}
                            disabled={channelreg || mainResult.loading}
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
            <div style={{ display: showScript ? 'flex' : 'none', height: 10 }} />
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}>
                {t(langKeys.iosstep1)}
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}><pre style={{ background: '#f4f4f4', border: '1px solid #ddd', color: '#666', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word', width: '100%', whiteSpace: 'break-spaces' }}><code>
                {`[Smooch initWithSettings:[SKTSettings settingsWithIntegrationId:@"${integrationId}"] completionHandler:^(NSError * _Nullable error, NSDictionary * _Nullable userInfo) {\n\tif (error == nil) {\n\t\t// Initialization complete\n\t} else {\n\t\t// Something went wrong\n\t}\n}];`}
            </code></pre><div style={{ height: 10 }} />
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}>
                {t(langKeys.iosstep2)}
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}><pre style={{ background: '#f4f4f4', border: '1px solid #ddd', color: '#666', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word', width: '100%', whiteSpace: 'break-spaces' }}><code>
                {`Smooch.initWith(SKTSettings(integrationId: "${integrationId}")) { (error: Error?, userInfo: [AnyHashable : Any]?) in\n\tif (error == nil) {\n\t\t// Initialization complete\n\t} else {\n\t\t// Something went wrong\n\t}\n}`}
            </code></pre><div style={{ height: 10 }} />
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}>
                {t(langKeys.iosstep3)}
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', height: 20 }} />
        </div>
    )
}

export default ChannelAddIos