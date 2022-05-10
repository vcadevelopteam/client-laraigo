import React, { useEffect, FC, useState, useRef, MouseEventHandler } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Fab, makeStyles, MenuItem, Tooltip, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialpadIcon from '@material-ui/icons/Dialpad';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useDispatch } from 'react-redux';
import { answerCall, hangupCall, rejectCall, makeCall, holdCall, setModalCall, muteCall, unmuteCall, getHistory } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import PhoneIcon from '@material-ui/icons/Phone';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch } from 'components';
import { Box, Grid, IconButton, InputAdornment, Tabs } from '@material-ui/core';
import { convertLocalDate, secondsToTime, getSecondsUntelNow, conversationOutboundIns } from 'common/helpers';
import { langKeys } from 'lang/keys';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import BackspaceIcon from '@material-ui/icons/Backspace';
import clsx from 'clsx';
import { execute } from 'store/main/actions';
import purple from '@material-ui/core/colors/red';
import { ITicket } from '@types';
import { emitEvent, newTicketCall } from 'store/inbox/actions';


const useStyles = makeStyles(theme => ({
    grey: {
        backgroundColor: '#bdbdbd'
    },
    red: {
        backgroundColor: 'rgb(180, 26, 26)'
    },
    tabs: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: "#7721ad",
        color: "white",
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: "white",
    },
    numpadbuttons: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: '#e7e3e3'
    },
    gridlinebuttons: {
        display: "grid",
        width: "100%",
        gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col3] 50px auto',
        paddingBottom: 25
    },
}));

const useNotificaionStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            backgroundColor: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'start',
            fontSize: '0.8rem',
            marginRight: 15,
            marginLeft: 15,
            width: "calc(100% - 30px)",
            borderBottom: '1px solid #bfbfc0',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        title: {
            whiteSpace: "initial",
            width: "calc(100% - 40px)",
            color: "#a39e9e",
        },
        date: {
            fontSize: 11,
            color: 'grey',
            textAlign: 'right',
        },
        textOneLine: {
            flexGrow: 1,
            lineHeight: 1.1,
            overflow: 'hidden',
            display: "flex",
            alignItems: "center",
            gap: 8
        },
        description: {
            whiteSpace: "initial",
            width: "calc(100% - 40px)",
            color: "#a39e9e",
        },
        phoneicon: {
            width: 15,
            height: 15,
            color: "#a39e9e",
        },
    }),
);
function yesterdayOrToday(datadate: Date, t: any) {
    console.log(datadate)
    const date = new Date(datadate)
    const yesterday = new Date();
    if (yesterday.toDateString() === date.toDateString()) {
        return t(langKeys.today);
    }
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === date.toDateString()) {
        return t(langKeys.yesterday);;
    } else {
        return formatDate(String(datadate))
    }
}


interface NotificaionMenuItemProps {
    title: React.ReactNode;
    description: React.ReactNode;
    // notification: LeadActivityNotification,
    image: string;
    user: string;
    origin: string;
    date: Date;
    onClick?: MouseEventHandler<HTMLLIElement>;
}

const NotificaionMenuItem: FC<NotificaionMenuItemProps> = ({ title, description, date, user, image, origin }) => {
    const classes = useNotificaionStyles();
    const { t } = useTranslation();
    return (
        <>
            <MenuItem button className={classes.root}>
                <div style={{ gap: 8, alignItems: 'center', width: '100%', display: "grid", gridTemplateColumns: '[col1] 30px [col2] auto  [col3] 90px' }}>
                    <div style={{ gridColumnStart: "col1" }}>
                        <Tooltip title={user}>
                            {image ? <Avatar style={{ width: 30, height: 30 }} src={image} /> :
                                <Avatar style={{ width: 30, height: 30, fontSize: 18 }} >
                                    {user?.split(" ").reduce((acc, item) => acc + (acc.length < 2 ? item.substring(0, 1).toUpperCase() : ""), "")}
                                </Avatar>
                            }
                        </Tooltip>
                    </div>
                    <div style={{ gridColumnStart: "col2" }}>
                        <div className={classes.textOneLine}>
                            <div className={classes.title}>{title}</div>
                        </div>
                        <div className={clsx(classes.description, classes.textOneLine)}>
                            {origin === "INBOUND" ? <PhoneCallbackIcon className={classes.phoneicon} /> : <PhoneForwardedIcon className={classes.phoneicon} />} {description}
                        </div>
                    </div>
                    <div style={{ gridColumnStart: "col3", color: "#a39e9e", }}>
                        {yesterdayOrToday(date, t)}
                    </div>
                </div>
            </MenuItem>
        </>
    );
}

const MakeCall: React.FC<{}> = ({ }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const phoneinbox = useSelector(state => state.inbox.person.data?.phone);
    const [numberVox, setNumberVox] = useState("");
    const resExecute = useSelector(state => state.main.execute);
    const [advisertodiver, setadvisertodiver] = useState("");
    const [pageSelected, setPageSelected] = useState(0);
    const ringtone = React.useRef<HTMLAudioElement>(null);
    const call = useSelector(state => state.voximplant.call);
    const showcall = useSelector(state => state.voximplant.showcall);
    const statusCall = useSelector(state => state.voximplant.statusCall);
    const [date, setdate] = useState(new Date());
    const [time, settime] = useState(0);
    const historial = useSelector(state => state.voximplant.requestGetHistory);
    const corpid = useSelector(state => state.login.validateToken?.user?.corpid);
    const orgid = useSelector(state => state.login.validateToken?.user?.orgid);
    const sitevoxi = useSelector(state => state.login.validateToken?.user?.sitevoxi);
    const ccidvoxi = useSelector(state => state.login.validateToken?.user?.ccidvoxi);

    React.useEffect(() => {
        if (!resExecute.loading && !resExecute.error) {
            if (resExecute.key === "UFN_CONVERSATION_OUTBOUND_INS") {
                const data: ITicket = {
                    conversationid: parseInt(resExecute.data[0].v_conversationid),
                    ticketnum: resExecute.data[0].v_ticketnum,
                    personid: parseInt(resExecute.data[0].v_personid),
                    communicationchannelid: ccidvoxi || 0,
                    status: "ASIGNADO",
                    imageurldef: "",
                    firstconversationdate: resExecute.data[0].firstconversationdate,
                    personlastreplydate: null,
                    countnewmessages: 0,
                    usergroup: "",
                    displayname: numberVox,
                    coloricon: '',
                    communicationchanneltype: "VOXI",
                    lastmessage: "LLAMADA SALIENTE",
                    personcommunicationchannel: `${numberVox}_VOXI`,
                    communicationchannelsite: sitevoxi || "",
                    lastreplyuser: "",
                }
                dispatch(setModalCall(false));
                const identifier = `${corpid}-${orgid}-${ccidvoxi}-${resExecute.data[0].v_conversationid}-${resExecute.data[0].v_personid}.${sitevoxi}`
                dispatch(makeCall({ number: numberVox, site: identifier || "", data }));
            }
        }
    }, [resExecute])


    React.useEffect(() => {
        dispatch(getHistory())
    }, [])

    React.useEffect(() => {
        if (call.type === "INBOUND" && statusCall === "CONNECTING") {
            setdate(new Date())
            settime(0)
            dispatch(setModalCall(true))
            ringtone.current?.pause();
            if (ringtone.current) {
                ringtone.current.currentTime = 0;
            }
            setNumberVox(call.number.split("@")[0].split(":")?.[1] || "")
            ringtone.current?.play();

        } else if (call.type === "INBOUND" && statusCall !== "CONNECTING") {
            setNumberVox(call.number.split("@")[0].split(":")?.[1] || "")
            ringtone.current?.pause();
        }
    }, [call, dispatch, statusCall])

    React.useEffect(() => {
        if (statusCall === "CONNECTED") {
            setdate(new Date())
            settime(0)
        }
    }, [statusCall])

    React.useEffect(() => {
        let timer = setTimeout(() => {
            settime(getSecondsUntelNow(convertLocalDate(String(date))));
            if (time >= 30 && (call.type === "INBOUND" && statusCall === "CONNECTING")) {
                dispatch(rejectCall(call.call))
                settime(0)
            }
        }, 1000)

        return () => {
            timer && clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    React.useEffect(() => {
        if (phoneinbox) {
            setNumberVox(phoneinbox)
        }
    }, [phoneinbox])


    return (
        <>
            <Dialog
                open={showcall}
                fullWidth
                maxWidth={"xs"}
                style={{ zIndex: 99999999 }}>
                <MuiDialogTitle disableTypography className={classes.root}>
                    <Typography variant="h6">{t(langKeys.phone)}</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => dispatch(setModalCall(false))}>
                        <HighlightOffIcon style={{ width: 30, height: 30 }} />
                    </IconButton>
                </MuiDialogTitle>
                <DialogContent style={{ padding: 0 }}>
                    <Tabs
                        value={pageSelected}
                        indicatorColor="primary"
                        variant="fullWidth"
                        style={{ borderBottom: '1px solid white', backgroundColor: '#7721ad' }}
                        textColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                    >
                        <AntTab label={<ContactPhoneIcon style={{ color: pageSelected === 0 ? "gold" : "white" }} />} />
                        <AntTab label={<DialpadIcon style={{ color: pageSelected === 1 ? "gold" : "white" }} />} />
                        <AntTab label={<PhoneCallbackIcon style={{ color: pageSelected === 2 ? "gold" : "white" }} />} />
                    </Tabs>
                </DialogContent>
                {pageSelected === 0 &&
                    <div className={classes.tabs}>
                        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: 15 }}>
                            <FieldSelect
                                label={t(langKeys.advisor)}
                                className="col-12"
                                valueDefault={advisertodiver}
                                style={{ marginRight: "auto", marginLeft: "auto", width: "400px" }}
                                onChange={(value) => setadvisertodiver(value?.userid || '')}
                                error={advisertodiver ? "" : t(langKeys.required)}
                                data={[]}
                                optionDesc="displayname"
                                optionValue="userid"
                            />
                        </div>
                    </div>
                }
                {pageSelected === 1 &&
                    <div className={classes.tabs}>
                        <div style={{ display: "flex", marginLeft: 70, marginRight: 70 }}>
                            <TextField
                                label={t(langKeys.phone)}
                                value={numberVox}
                                disabled={resExecute.loading || statusCall !== "DISCONNECTED"}
                                style={{ marginRight: "auto", marginLeft: "auto", width: "400px", marginBottom: 25 }}
                                type="tel"
                                onChange={(e) => setNumberVox(e.target.value)}
                            />
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <Fab
                                style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "1")}
                            >
                                1
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "2")}
                            >
                                2
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "3")}
                            >
                                3
                            </Fab>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <Fab
                                style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "4")}
                            >
                                4
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "5")}
                            >
                                5
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "6")}
                            >
                                6
                            </Fab>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <Fab
                                style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "7")}
                            >
                                7
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "8")}
                            >
                                8
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "9")}
                            >
                                9
                            </Fab>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <Fab
                                style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "*")}
                            >
                                *
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "0")}
                            >
                                0
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox + "#")}
                            >
                                #
                            </Fab>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <Fab
                                style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                                color="primary"
                                disabled={resExecute.loading}
                                onClick={() => {
                                    dispatch(execute(conversationOutboundIns({
                                        number: numberVox,
                                        communicationchannelid: ccidvoxi,
                                        personcommunicationchannelowner: numberVox,
                                        interactiontype: 'text',
                                        interactiontext: 'LLAMADA SALIENTE'
                                    })))
                                }}
                            >
                                <PhoneIcon style={{ color: "white", width: "35px", height: "35px" }} />
                            </Fab>
                            <Fab
                                style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                                onClick={() => setNumberVox(numberVox.slice(0, -1))}
                            >
                                <BackspaceIcon style={{ color: "#707070", width: "35px", height: "35px", paddingRight: 5 }} />
                            </Fab>
                        </div>
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ width: "100%", overflow: 'auto', height: '50vh' }}>
                        {historial.data?.map((e: any, i: number) => (
                            <NotificaionMenuItem
                                user={"none"}
                                image={e.imageurl}
                                key={`history-${i}`}
                                title={e.name}
                                description={(e.origin === "INBOUND" ? t(langKeys.inboundcall) : t(langKeys.outboundcall)) + " " + e?.totalduration || ""}
                                origin={e.origin}
                                date={e.createdate}
                            />
                        ))}
                    </div>
                }
            </Dialog>
            <audio ref={ringtone} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/7120-download-iphone-6-original-ringtone-42676.mp3" />
        </>
    )
}
export default MakeCall;

const formatDate = (strDate: string) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(strDate);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });

    return `${day}/${month}/${year}`;
}