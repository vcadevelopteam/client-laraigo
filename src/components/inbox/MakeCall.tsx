import BackspaceIcon from '@material-ui/icons/Backspace';
import clsx from 'clsx';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialpadIcon from '@material-ui/icons/Dialpad';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PersonIcon from '@material-ui/icons/Person';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import PhoneIcon from '@material-ui/icons/Phone';
import React, { FC, MouseEventHandler, useState } from 'react'
import TextField from '@material-ui/core/TextField';

import { AntTab, FieldSelect, SearchField } from 'components';
import { Avatar, Fab, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { conversationOutboundValidate, selCommunicationChannelVoice } from 'common/helpers';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Dictionary } from "@types";
import { execute, resetExecute, getMultiCollectionAux3, resetMultiMainAux3 } from 'store/main/actions';
import { IconButton, Tabs } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { ListItemSkeleton } from 'components';
import { makeCall, setModalCall, getHistory, geAdvisors, setPhoneNumber } from 'store/voximplant/actions';
import { showSnackbar } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    grey: {
        backgroundColor: '#bdbdbd'
    },
    red: {
        backgroundColor: 'rgb(180, 26, 26)'
    },
    tabs: {
        paddingTop: 10,
        paddingBottom: 10,
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
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    rootpaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        height: 35,
        border: '1px solid #EBEAED',
    },
    inputPlaceholder: {
        '&::placeholder': {
            fontSize: "1rem",
            fontWeight: 500,
            color: '#84818A',
        },
    },
}));

const useNotificaionStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`,
            backgroundColor: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'start',
            fontSize: '0.8rem',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        title: {
            fontSize: '1rem',
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
        textOneLineplus: {
            flexGrow: 1,
            lineHeight: 1.1,
            overflow: 'hidden',
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "1.2rem",
            gridColumn: "span 2"
        },
        description: {
            whiteSpace: "initial",
            width: "calc(100% - 40px)",
            color: "#a39e9e",
            marginTop: 4
        },
        phoneicon: {
            width: 15,
            height: 15,
            color: "#a39e9e",
        },
        line: {
            backgroundColor: "#bfbfc0",
            width: '90%',
            height: 1,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }),
);

function yesterdayOrToday(datadate: Date, t: any) {
    const date = new Date(datadate);
    const yesterday = new Date();

    if (yesterday.toDateString() === date.toDateString()) {
        return t(langKeys.today);
    }

    yesterday.setDate(yesterday.getDate() - 1);

    if (yesterday.toDateString() === date.toDateString()) {
        return t(langKeys.yesterday);
    } else {
        return formatDate(String(datadate));
    }
}

interface NotificaionMenuItemProps {
    date?: Date;
    description: React.ReactNode;
    image: string;
    onClick?: MouseEventHandler<HTMLLIElement>;
    origin: string;
    title: React.ReactNode;
    user: string;
}

const NotificaionMenuItem: FC<NotificaionMenuItemProps> = ({ title, description, date, image, origin, onClick }) => {
    const classes = useNotificaionStyles();

    const { t } = useTranslation();

    return (
        <div>
            <MenuItem button className={classes.root} onClick={onClick}>
                <div style={{ gap: 8, alignItems: 'center', width: '100%', display: "grid", gridTemplateColumns: '[col1] 30px [col2] auto  [col3] 90px' }}>
                    <div style={{ gridColumnStart: "col1" }}>
                        {image ? <Avatar style={{ width: 30, height: 30 }} src={image} /> :
                            <Avatar style={{ width: 30, height: 30, fontSize: 18 }} >
                                <PersonIcon />
                            </Avatar>
                        }
                    </div>
                    <div style={{ gridColumnStart: "col2" }}>
                        <div className={clsx({
                            [classes.textOneLine]: origin !== "CONTACT",
                            [classes.textOneLineplus]: origin === "CONTACT"
                        })}>
                            <div className={classes.title}>{title}</div>
                        </div>
                        <div className={clsx(classes.description, classes.textOneLine)}>
                            {origin === "INBOUND" ? <PhoneCallbackIcon className={classes.phoneicon} /> : origin === "CONTACT" ? null : <PhoneForwardedIcon className={classes.phoneicon} />} {description}
                        </div>
                    </div>
                    {date &&
                        <div style={{ gridColumnStart: "col3", color: "#a39e9e", textAlign: 'right' }}>
                            {yesterdayOrToday(date, t)}
                        </div>
                    }
                </div>
            </MenuItem>
            <div className={classes.line}></div>
        </div>
    );
}

const MakeCall: React.FC = () => {
    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const advisors = useSelector(state => state.voximplant.requestGetAdvisors);
    const calls = useSelector(state => state.voximplant.calls);
    const historial = useSelector(state => state.voximplant.requestGetHistory);
    const history = useHistory();
    const multiData = useSelector(state => state.main.multiDataAux3);
    const personData = useSelector(state => state.inbox.person);
    const phonenumber = useSelector(state => state.voximplant.phoneNumber);
    const resExecute = useSelector(state => state.main.execute);
    const ringtone = React.useRef<HTMLAudioElement>(null);
    const showcall = useSelector(state => state.voximplant.showcall);
    const transferAction = useSelector(state => state.voximplant.transferAction);
    const user = useSelector(state => state.login.validateToken.user);

    const [callInLine, setCallInLine] = useState(true);
    const [communicationChannelList, setCommunicationChannelList] = useState<Dictionary[]>([]);
    const [filter, setfilter] = useState("");
    const [numberVox, setNumberVox] = useState("");
    const [pageSelected, setPageSelected] = useState(1);
    const [waiting2, setwaiting2] = useState(false);

    const { corpid, orgid, sitevoxi, ccidvoxi, userid } = useSelector(state => state.login.validateToken?.user!!);

    const [numberChannel, setNumberChannel] = useState(ccidvoxi || null);
    const [numberSite, setNumberSite] = useState(sitevoxi || null);

    React.useEffect(() => {
        dispatch(getMultiCollectionAux3([
            selCommunicationChannelVoice(),
        ]))

        return () => {
            dispatch(resetMultiMainAux3());
        }
    }, [])

    React.useEffect(() => {
        if (!resExecute.loading && !resExecute.error) {
            if (resExecute.key === "UFN_CONVERSATION_OUTBOUND_VALIDATE") {
                const { v_voximplantrecording } = resExecute.data[0];

                dispatch(setModalCall(false));
                let identifier = `${corpid}-${orgid}-${ccidvoxi}-0-0-.${sitevoxi}.${userid}.${v_voximplantrecording}`;

                if (numberChannel && numberSite) {
                    identifier = `${corpid}-${orgid}-${numberChannel}-0-0-.${numberSite}.${userid}.${v_voximplantrecording}`;
                }

                dispatch(resetExecute());
                dispatch(makeCall({ number: numberVox, site: identifier }));
                history.push('/message_inbox');
            }
        } else if (!resExecute.loading && resExecute.error && resExecute.key === "UFN_CONVERSATION_OUTBOUND_INS") {
            const errormessage = t(resExecute.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() });
            const messagetoshow = resExecute.code === "error_already_exists_record" ? t(langKeys.already_call_person) : errormessage;
            dispatch(showSnackbar({ show: true, severity: "error", message: messagetoshow }));
            setwaiting2(false);
        }
    }, [resExecute])

    React.useEffect(() => {
        if (multiData.data.length > 0) {
            if (multiData.data[0] && multiData.data[0].success) {
                setCommunicationChannelList(multiData.data[0].data || []);
            }
        }
    }, [multiData.data]);

    //Ring when the customer calls
    React.useEffect(() => {
        const isConnected = calls.some(call => call.statusCall === "CONNECTED");

        if (isConnected) {
            ringtone.current?.pause();
        } else {
            const connecting = calls.some(call => call.type === "INBOUND" && call.statusCall === "CONNECTING");
            setCallInLine(calls.some(call => call.statusCall !== "DISCONNECTED"));
            if (connecting) {
                ringtone.current?.pause();
                if (ringtone.current) {
                    ringtone.current.volume = (user?.properties?.ringer_volume || 100) / 100;
                    ringtone.current.currentTime = 0;
                }
                ringtone.current?.play();
            } else {
                ringtone.current?.pause();
            }
        }
    }, [calls])

    React.useEffect(() => {
        if (showcall && pageSelected === 2) {
            dispatch(getHistory());
        }
    }, [showcall, pageSelected, dispatch])

    React.useEffect(() => {
        if (showcall && pageSelected === 0) {
            dispatch(geAdvisors());
        }
    }, [showcall, pageSelected, dispatch])

    React.useEffect(() => {
        if (showcall) {
            setwaiting2(false);
            setNumberVox(transferAction ? "" : personData?.data?.phone || phonenumber || "");
            setNumberChannel(ccidvoxi || null);
            setNumberSite(sitevoxi || null);
            dispatch(setPhoneNumber(""));
        } else {
            setPageSelected(1);
        }
    }, [showcall])

    const setGlobalFilter = (value: string) => {
        setfilter(value);
    }

    return (
        <>
            <Dialog
                open={showcall}
                fullWidth
                maxWidth={"xs"}>
                <MuiDialogTitle disableTypography className={classes.root}>
                    <Typography variant="h6">{t(langKeys.phone)}</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                        dispatch(setModalCall(false));
                        setNumberVox("");
                        setNumberChannel(ccidvoxi || null);
                        setNumberSite(sitevoxi || null);
                    }}>
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
                        onChange={(_, value) => { setPageSelected(value); setGlobalFilter("") }}
                    >
                        <AntTab label={<ContactPhoneIcon style={{ color: pageSelected === 0 ? "gold" : "white" }} />} />
                        <AntTab label={<DialpadIcon style={{ color: pageSelected === 1 ? "gold" : "white" }} />} />
                        <AntTab label={<PhoneCallbackIcon style={{ color: pageSelected === 2 ? "gold" : "white" }} />} />
                    </Tabs>
                </DialogContent>
                <div style={{ height: (Object.keys(communicationChannelList || []).length > 1) ? 560 : 500 }}>
                    {pageSelected === 0 &&
                        <div style={{ width: "100%", height: '100%', overflow: 'overlay' }}>
                            <div style={{ padding: "12px 24px 0" }}>
                                <SearchField
                                    disabled={advisors?.loading}
                                    style={{ fontSize: "1rem" }}
                                    colorPlaceHolder='#FFF'
                                    inputProps={{ className: classes.inputPlaceholder }}
                                    handleChangeOther={setGlobalFilter}
                                    lazy
                                />
                            </div>
                            {advisors?.loading ? <ListItemSkeleton /> : advisors.data?.filter((x: any) => {
                                if (filter === "") {
                                    return false;
                                }
                                if (filter.toLowerCase() === "sin nombre") {
                                    return (x.personname?.trim() === x.phone?.trim())
                                }
                                return (x.personname?.toLowerCase()?.includes(filter.toLowerCase()) || x.phone?.includes(filter))
                            }).map((e: any, i: number) => (
                                <NotificaionMenuItem
                                    onClick={() => {
                                        if (!callInLine && !waiting2) {
                                            setwaiting2(true);
                                            setNumberVox(e.phone);
                                            dispatch(execute(conversationOutboundValidate({
                                                number: e.phone,
                                                communicationchannelid: numberChannel || ccidvoxi,
                                            })))
                                        }
                                    }}
                                    user={"none"}
                                    image={e.imageurldef}
                                    key={`advisor-${i}`}
                                    title={e.personname?.trim() === e.phone?.trim() ? t(langKeys.noname) : e.personname}
                                    description={e.phone}
                                    origin={"CONTACT"}
                                />
                            ))}
                        </div>
                    }
                    {pageSelected === 1 &&
                        <div className={classes.tabs}>
                            {(Object.keys(communicationChannelList || []).length > 1) && <div style={{ display: "flex", marginLeft: 70, marginRight: 70 }}>
                                <FieldSelect
                                    data={communicationChannelList}
                                    label={t(langKeys.communicationchannel)}
                                    optionDesc="communicationchanneldesc"
                                    optionValue="communicationchannelid"
                                    style={{ marginRight: "auto", marginLeft: "auto", width: "300px", marginBottom: 10, marginTop: 10 }}
                                    variant="outlined"
                                    valueDefault={numberChannel}
                                    onChange={(value) => { setNumberChannel(value?.communicationchannelid || null); setNumberSite(value?.communicationchannelsite || null); }}
                                    orderbylabel={true}
                                />
                            </div>}
                            <div style={{ display: "flex", marginLeft: 70, marginRight: 70 }}>
                                <TextField
                                    label={t(langKeys.phone)}
                                    value={numberVox}
                                    disabled={resExecute.loading || callInLine}
                                    style={{ marginRight: "auto", marginLeft: "auto", width: "300px", marginBottom: 25 }}
                                    onInput={(e: any) => {
                                        const val = e.target.value.replace(/[^0-9*#]/g, "");
                                        e.target.value = String(val);
                                    }}
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
                                    disabled={resExecute.loading || callInLine || !numberVox}
                                    onClick={() => {
                                        if (!callInLine) {
                                            dispatch(execute(conversationOutboundValidate({
                                                number: numberVox,
                                                communicationchannelid: numberChannel || ccidvoxi,
                                            })))
                                        }
                                        /*if (callInLine && transferAction) {
                                            dispatch(transferCall({
                                                url: `${ticketSelected?.commentexternalid}?mode=transfer&number=${numberVox}&name=${numberVox}`,
                                                number: ticketSelected?.personcommunicationchannel,
                                                conversationid: ticketSelected?.conversationid!!,
                                                transfernumber: numberVox,
                                                transfername: numberVox
                                            }))
                                            dispatch(setModalCall(false, false))
                                        }*/
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
                        <div style={{ width: "100%", height: '100%', overflow: 'overlay' }}>
                            {historial?.loading ? <ListItemSkeleton /> : historial.data?.map((e: any, i: number) => (
                                <NotificaionMenuItem
                                    onClick={() => {
                                        if (!callInLine && !waiting2) {
                                            setwaiting2(true);
                                            setNumberVox(e.phone);
                                            dispatch(execute(conversationOutboundValidate({
                                                number: e.phone,
                                                communicationchannelid: numberChannel || ccidvoxi,
                                            })))
                                        }
                                    }}
                                    user={"none"}
                                    image={e.imageurldef}
                                    key={`history-${i}`}
                                    title={e.name}
                                    description={(e.origin === "INBOUND" ? t(langKeys.inboundcall) : t(langKeys.outboundcall)) + " " + e?.totalduration || ""}
                                    origin={e.origin}
                                    date={e.createdate}
                                />
                            ))}
                        </div>
                    }
                </div>
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