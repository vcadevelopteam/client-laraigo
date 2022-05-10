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
import { convertLocalDate, secondsToTime, getSecondsUntelNow } from 'common/helpers';
import { langKeys } from 'lang/keys';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import BackspaceIcon from '@material-ui/icons/Backspace';
import clsx from 'clsx';

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
            width: "100%",
            borderBottom: '1px solid #bfbfc0',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        title: {
            fontWeight: 'bold',
            whiteSpace: "initial",
            width: "calc(100% - 40px)"
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
        },
        description: {
            whiteSpace: "initial",
            width: "calc(100% - 40px)",
            color: "#c4c4c4",
            fontWeight: "bold"
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
                            <span>{origin == "INBOUND" ? <PhoneCallbackIcon style={{ width: 15, height: 15, color: "#c4c4c4" }} /> : <PhoneForwardedIcon style={{ width: 15, height: 15, color: "#c4c4c4" }} />} {description}</span>
                        </div>
                    </div>
                    <div style={{ gridColumnStart: "col3", color: "#c4c4c4", fontWeight: "bold" }}>
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
    const [hold, sethold] = useState(true);
    const [mute, setmute] = useState(false);
    const [advisertodiver, setadvisertodiver] = useState("");
    const [pageSelected, setPageSelected] = useState(0);
    const ringtone = React.useRef<HTMLAudioElement>(null);
    const call = useSelector(state => state.voximplant.call);
    const showcall = useSelector(state => state.voximplant.showcall);
    const statusCall = useSelector(state => state.voximplant.statusCall);
    const [date, setdate] = useState(new Date());
    const [time, settime] = useState(0);
    const historial = useSelector(state => state.voximplant.requestGetHistory);
    const sitevoxi = useSelector(state => state.login.validateToken?.user?.sitevoxi);

    React.useEffect(() => {
        dispatch(getHistory())
    }, [])

    React.useEffect(() => {
        if (call.type === "INBOUND" && statusCall === "CONNECTING") {
            setdate(new Date())
            settime(0)
            dispatch(setModalCall(true))
            sethold(true)
            setmute(false)
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
                        <div style={{ display: "flex", width: "100%" }}>
                            <TextField
                                label={t(langKeys.phone)}
                                value={numberVox}
                                style={{ marginRight: "auto", marginLeft: "auto", width: "400px", marginBottom: 25 }}
                                type="tel"
                                onChange={(e) => setNumberVox(e.target.value)}
                                disabled={statusCall !== "DISCONNECTED"}
                            />
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "1")}
                            >
                                1
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "2")}
                            >
                                2
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "3")}
                            >
                                3
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "4")}
                            >
                                4
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "5")}
                            >
                                5
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "6")}
                            >
                                6
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "7")}
                            >
                                7
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "8")}
                            >
                                8
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "9")}
                            >
                                9
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "*")}
                            >
                                *
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "0")}
                            >
                                0
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "#")}
                            >
                                #
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2", backgroundColor: '#55bd84' }}
                                onClick={() => {
                                    dispatch(makeCall({ number: numberVox, site: sitevoxi || "" }))
                                    sethold(true)
                                    setmute(false)
                                }}
                            >
                                <PhoneIcon style={{ color: "white", width: "35px", height: "35px" }} />
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => {
                                    setNumberVox(numberVox.slice(0, -1))
                                }}
                            >
                                <BackspaceIcon style={{ color: "#707070", width: "35px", height: "35px", paddingRight: 5 }} />
                            </IconButton>
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