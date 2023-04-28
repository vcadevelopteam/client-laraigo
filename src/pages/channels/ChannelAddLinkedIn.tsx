/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { FieldEdit, ColorInput } from "components";
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
import LinkedInIcon from '@material-ui/icons/LinkedIn';

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

export const ChannelAddLinkedIn: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setcoloricon] = useState("#0A66C2");
    const [nextbutton, setNextbutton] = useState(true);
    const [setins, setsetins] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);

    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "apikey": "",
            "chatflowenabled": true,
            "color": "",
            "coloricon": "#0A66C2",
            "communicationchannelowner": "",
            "communicationchannelsite": "",
            "description": "",
            "form": "",
            "icons": "",
            "id": 0,
            "integrationid": "",
            "other": "",
            "type": "",
            "voximplantcallsupervision": false,
        },
        "service": {
            "clientid": "",
            "clientsecret": "",
            "accesstoken": "",
            "refreshtoken": "",
            "organizationid": "",
        },
        "type": "LINKEDIN",
    })

    const classes = useChannelAddStyles();
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<whatsAppData>();
    const mainResult = useSelector(state => state.channel.channelList);
    const whatsAppData = location.state as whatsAppData | null;

    async function finishreg() {
        setsetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
        setViewSelected("main");
    }

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

    function setnameField(value: any) {
        setChannelreg(value === "");
        let partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
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
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_linkedintitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.channel_linkedintitle1)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value === "" || fields.service.clientsecret === "" || fields.service.accesstoken === "" || fields.service.refreshtoken === "" || fields.service.organizationid === "")
                                let partialf = fields;
                                partialf.service.clientid = value;
                                setFields(partialf);
                            }}
                            valueDefault={fields.service.clientid}
                            label={t(langKeys.linkedin_clientid)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(fields.service.clientid === "" || value === "" || fields.service.accesstoken === "" || fields.service.refreshtoken === "" || fields.service.organizationid === "")
                                let partialf = fields;
                                partialf.service.clientsecret = value;
                                setFields(partialf);
                            }}
                            valueDefault={fields.service.clientsecret}
                            label={t(langKeys.linkedin_clientsecret)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(fields.service.clientid === "" || fields.service.clientsecret === "" || value === "" || fields.service.refreshtoken === "" || fields.service.organizationid === "")
                                let partialf = fields;
                                partialf.service.accesstoken = value;
                                setFields(partialf);
                            }}
                            valueDefault={fields.service.accesstoken}
                            label={t(langKeys.linkedin_accesstoken)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(fields.service.clientid === "" || fields.service.clientsecret === "" || fields.service.accesstoken === "" || value === "" || fields.service.organizationid === "")
                                let partialf = fields;
                                partialf.service.refreshtoken = value;
                                setFields(partialf);
                            }}
                            valueDefault={fields.service.refreshtoken}
                            label={t(langKeys.linkedin_refreshtoken)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(fields.service.clientid === "" || fields.service.clientsecret === "" || fields.service.accesstoken === "" || fields.service.refreshtoken === "" || value === "")
                                let partialf = fields;
                                partialf.service.organizationid = value;
                                setFields(partialf);
                            }}
                            valueDefault={fields.service.organizationid}
                            label={t(langKeys.linkedin_organizationid)}
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
    } else {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
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
                                <LinkedInIcon style={{ fill: `${coloricon}`, width: "100px", height: "100px" }} />
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

export default ChannelAddLinkedIn;