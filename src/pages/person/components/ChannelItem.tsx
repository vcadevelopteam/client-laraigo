import { Box, Button, Grid, IconButton, makeStyles } from "@material-ui/core";
import { getChannelListByPersonBody, unLinkPerson } from "common/helpers";
import { useSelector } from "hooks";
import { langKeys } from "lang/keys";
import { FC, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getChannelListByPerson } from "store/person/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { execute } from "store/main/actions";
import { Property } from "./index";
import { GetIcon } from "components";
import { setModalCall, setPhoneNumber } from "store/voximplant/actions";
import { PhoneIcon } from "icons";
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CallIcon from '@material-ui/icons/Call';
import ForumIcon from '@material-ui/icons/Forum';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import { ChannelItemProps } from "../model";
import { useChannelItemStyles } from "../styles";

const nameschannel: { [x: string]: string } = {
    "ANDR": "T_ANDROID",
    "APPL": "T_IOS",
    "APPS": "T_APP_STORE",
    "CHATZ": "T_CHAT_WEB",
    "CHAZ": "T_CHAT_WEB",
    "FACEBOOKWORPLACE": "T_WORKPLACE_MESSENGER",
    "FBDM": "T_FACEBOOK_MESSENGER",
    "FBMS": "T_FACEBOOK_MESSENGER",
    "FBWA": "T_FACEBOOK_WALL",
    "FBWM": "T_WORKPLACE_WALL",
    "FBWP": "T_WORKPLACE_MESSENGER",
    "FORM": "T_WEB_FORM",
    "GOBU": "T_MY_BUSINESS",
    "INDM": "T_INSTAGRAM_DIRECT",
    "INMS": "T_INSTAGRAM_DIRECT",
    "INST": "T_INSTAGRAM_WALL",
    "LINE": "T_LINE",
    "LNKD": "T_LINKEDIN",
    "MAII": "T_MAIL",
    "MAIL": "T_MAIL",
    "PLAY": "T_PLAY_STORE",
    "SMS": "T_SMS",
    "SMSI": "T_SMS",
    "TEAM": "T_TEAMS",
    "TELE": "T_TELEGRAM",
    "TKTA": "T_TIKTOK",
    "TKTK": "T_TIKTOK",
    "TKTT": "T_TIKTOK",
    "TWDM": "T_TWITTER_MESSENGER",
    "TWIT": "T_TWITTER_WALL",
    "TWMS": "T_TWITTER_MESSENGER",
    "VOXI": "T_VOICE",
    "WEBM": "T_CHAT_WEB",
    "WHAC": "T_WHATSAPP",
    "WHAD": "T_WHATSAPP",
    "WHAG": "T_WHATSAPP",
    "WHAM": "T_WHATSAPP",
    "WHAP": "T_WHATSAPP",
    "WHAT": "T_WHATSAPP",
    "YOUA": "T_YOUTUBE",
    "YOUT": "T_YOUTUBE",
};

const ChannelItem: FC<ChannelItemProps> = ({ channel, person }) => {
    const { t } = useTranslation();
    const classes = useChannelItemStyles();
    const dispatch = useDispatch();
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const callOnLine = useSelector(state => state.voximplant.callOnLine);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const [waitUnLink, setWaitUnLink] = useState(false);
    const unLinkRes = useSelector(state => state.main.execute);

    const personIdentifier = useMemo(() => {
        if (!channel) return '';
        const index = channel.personcommunicationchannel.lastIndexOf('_');
        return channel.personcommunicationchannel.substring(0, index);
    }, [channel]);

    useEffect(() => {
        if (waitUnLink) {
            if (!unLinkRes.loading && !unLinkRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: "Vinculación correcta" }))
                setWaitUnLink(false);
                dispatch(getChannelListByPerson(getChannelListByPersonBody(channel.personid)));
            } else if (unLinkRes.error) {
                const message = t(unLinkRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message }))
                dispatch(showBackdrop(false));
                setWaitUnLink(false);
            }
        }
    }, [unLinkRes, waitUnLink])

    return (
        <div className={classes.root}>
            {channel.originpersonid && (
                <div style={{ textAlign: "right" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        disabled={unLinkRes.loading}
                        startIcon={<LinkOffIcon color="secondary" />}
                        onClick={() => {
                            dispatch(execute(unLinkPerson({
                                personid: channel.personid,
                                personcommunicationchannel: channel.personcommunicationchannel
                            })))
                            setWaitUnLink(true)
                        }}
                    >
                        {"Desvincular"}
                    </Button>
                </div>
            )}
            <GetIcon channelType={channel.type} width={120} height={120} color='#8F92A1' />
            <div>
                <Box className={classes.propertyRoot}>
                    <div className={classes.contentContainer}>
                        <label className={classes.propTitle}>{<Trans i18nKey={langKeys.communicationchannel} />}</label>
                        <div style={{ height: 4 }} />
                        <div className={classes.propSubtitle}>
                            <div className={classes.subtitle}>
                                <span>{
                                    (nameschannel[channel.type] || '').includes("T_")
                                        ? t((langKeys as any)[nameschannel[channel.type]])
                                        : nameschannel[channel.type]}</span>
                            </div>
                            <div className={classes.subtitle}>
                                {channel.displayname}
                            </div>
                        </div>
                    </div>
                </Box>
            </div>
            <div>

            </div>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        icon={<LibraryAddIcon style={{ color: "#8F92A1" }} />}
                        title={<Trans i18nKey={langKeys.firstConnection} />}
                        subtitle={channel.firstcontact}
                        m={1}
                        classesAlt={classes}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        icon={<PersonOutlineIcon style={{ color: "#8F92A1" }} />}
                        title={<Trans i18nKey={langKeys.fullname} />}
                        subtitle={
                            <div style={{ display: "flex" }}>
                                {(false && (!voxiConnection.error && !voxiConnection.loading && userConnected && !callOnLine && (channel.type.includes("WHA") || channel.type.includes("VOXI")))) &&
                                    <IconButton
                                    className={classes.buttonphone}
                                    onClick={() => { dispatch(setPhoneNumber(channel.personcommunicationchannelowner.replaceAll('+', ''))); dispatch(setModalCall(true)) }}
                                    >
                                        <PhoneIcon style={{ width: "20px", height: "20px" }} />
                                    </IconButton>
                                }
                                <div className={classes.propSubtitle}>{channel.personcommunicationchannelowner || "-"}</div>
                            </div>}
                        m={1}
                        classesAlt={classes}
                        />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        icon={<CallIcon style={{ color: "#8F92A1" }} />}
                        title={<Trans i18nKey={langKeys.cellphone} />}
                        subtitle={personIdentifier}
                        classesAlt={classes}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.lastConnection} />}
                        subtitle={channel.lastcontact}
                        icon={<LibraryAddIcon style={{ color: "#8F92A1" }} />}
                        classesAlt={classes}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        icon={<ForumIcon style={{ color: "#8F92A1" }} />}
                        title={<Trans i18nKey={langKeys.conversationquantity} />}
                        subtitle={(channel.conversations || 0) > 0 ? channel.firstcontact : ""}
                        classesAlt={classes}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        icon={<RecentActorsIcon style={{ color: "#8F92A1" }} />}
                        title={<Trans i18nKey={langKeys.document} />}
                        subtitle={person.documentnumber || '0'}
                        classesAlt={classes}
                        m={1}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default ChannelItem;