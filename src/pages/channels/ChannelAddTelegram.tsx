import { FC, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { Facebook as FacebookIcon} from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect, TemplateSwitch } from "components";
import { useHistory } from "react-router";
import paths from "common/constants/paths";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsList, insertChannel } from "store/channel/actions";

const useChannelAddStyles = makeStyles(theme => ({
    centerbutton: {
        marginLeft: "calc(50% - 96px)",
        marginTop: "30px",
        marginBottom: "20px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddTelegram: FC = () => {
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
        },
        "type": "TELEGRAM",
        "service": {
            "accesstoken": "",
            "siteid": "",
            "appid": "1094526090706564"
        }
    })

    async function finishreg() {
        setsetins(true)
        dispatch(insertChannel(fields))
        setWaitSave(true);
        setViewSelected("main")
    }
    useEffect(() => {
        if (waitSave && setins) {
            if (mainResult.loading && !mainResult.error) {
                setsetins(false)
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                history.push(paths.CHANNELS)
            } else if (mainResult.error) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult,waitSave])
    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    function setnameField(value: any) {
        setChannelreg(value==="")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    function setvalField(value: any) {
        let partialf = fields;
        partialf.parameters.chatflowenabled = value
        setFields(partialf)
    }
    function setBotName(val:string){
        setNextbutton(val===""||fields.service.accesstoken==="")
        let partialf = fields;
        partialf.service.siteid=val
        partialf.parameters.communicationchannelowner=val
        partialf.parameters.communicationchannelsite=val
        setFields(partialf)
    }
    function setBotKey(val:string){
        setNextbutton(val===""||fields.parameters.communicationchannelowner==="")
        let partialf = fields;
        partialf.service.accesstoken=val
        setFields(partialf)
    }
    if(viewSelected==="view1"){
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD)}}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.connecttelegram)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.connecttelegramins)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setBotName(value)}
                            label={t(langKeys.enterbotname)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setBotKey(value)}
                            label={t(langKeys.enterbotapikey)}
                            className="col-6"
                        />
                    </div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton}
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
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
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
                        <TemplateSwitch
                            onChange={(value) => setvalField(value)}
                            label={t(langKeys.enablechatflow)}
                            className="col-6"
                        />
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