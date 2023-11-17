/* eslint-disable react-hooks/exhaustive-deps */
import { ChannelWorkplace } from "icons";
import { ColorInput, FieldEdit, FieldSelect } from "components";
import { FC, useEffect, useState } from "react";
import { getGroupList, insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { makeStyles, Breadcrumbs, Button, Box } from "@material-ui/core";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import ChannelEnableVirtualAssistant from './ChannelEnableVirtualAssistant';

import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";

interface whatsAppData {
    typeWhatsApp?: string;
    row?: any;
}

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "180px"
    },
}));

export const ChannelAddFacebookWorkplace: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useChannelAddStyles();
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<whatsAppData>();
    const mainResult = useSelector(state => state.channel.channelList);
    const grouplist = useSelector(state => state.channel.requestGetGroupList);
    const whatsAppData = location.state as whatsAppData | null;

    const [channelreg, setChannelreg] = useState(true);
    const [channelList, setChannelList] = useState<any>([]);
    const [waitGetGroups, setWaitGetGroups] = useState(false);
    const [coloricon, setcoloricon] = useState("#2d88ff");
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
            "coloricon": "#2d88ff",
            "voximplantcallsupervision": false
        },
        "type": "FBWM",
        "service": {
            "accesstoken": "",
            "siteid": "",
            "groupid": "",
        }
    })
    const [nextbutton, setNextbutton] = useState(true);
    const [setins, setsetins] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
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

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setsetins(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setViewSelected("enable-virtual-assistant")
            } else if (!executeResult) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [mainResult])

    useEffect(() => {
        if (!grouplist.loading && waitGetGroups) {
            if (grouplist.error) {
                const errormessage = t(langKeys.apikeydoesntexist).toLocaleLowerCase()
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setViewSelected("view1");
                setWaitGetGroups(false);
                setChannelList([])
            } else {
                setChannelList(grouplist?.data || [])
                dispatch(showBackdrop(false));
                setViewSelected("view2");
                setWaitGetGroups(false);
                setNextbutton(true)
            }
        }
    }, [grouplist])

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    function getgrouplistlocal() {
        dispatch(
            getGroupList({
                accesstoken: fields.service.accesstoken,
            }))
        dispatch(showBackdrop(true));
        setWaitGetGroups(true);
    }

    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    if (viewSelected === "view1") {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.connectface)} Workplace</div>

                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                let partialf = fields;
                                setNextbutton(value === "")
                                partialf.service.accesstoken = value
                                setFields(partialf)
                            }}
                            valueDefault={fields.service.accesstoken}
                            label={t(langKeys.authenticationtoken)}
                            className="col-6"
                        />
                    </div>
                    <div style={{ textAlign: "center", paddingTop: "20px", color: "#969ea5", fontStyle: "italic" }}>{t(langKeys.connectface4)}</div>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                    <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}><a style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton}
                            onClick={() => { getgrouplistlocal() }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    if (viewSelected === "view2") {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.connectface)} Workplace</div>

                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            data={channelList}
                            optionValue="id"
                            optionDesc="name"
                            onChange={(value) => {
                                let partialf = fields;
                                setNextbutton(!value?.id)
                                partialf.service.groupid = value.id
                                setFields(partialf)
                            }}
                            valueDefault={fields.service.groupid}
                            label={t(langKeys.group)}
                            className="col-6"
                        />
                    </div>
                    <div style={{ textAlign: "center", paddingTop: "20px", color: "#969ea5", fontStyle: "italic" }}>{t(langKeys.connectface4)}</div>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                    <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}><a style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton}
                            onClick={() => { setViewSelected("view3") }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }else if(viewSelected==="enable-virtual-assistant"){
        return <ChannelEnableVirtualAssistant
            communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid||null}
        />
    } else {
        return (
            <div style={{ width: "100%" }}>
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
                            valueDefault={fields.parameters.description}
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
                                <ChannelWorkplace style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
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

export default ChannelAddFacebookWorkplace;