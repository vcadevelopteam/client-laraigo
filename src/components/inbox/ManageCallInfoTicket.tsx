/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { ClickAwayListener, IconButton, makeStyles, Typography, List, ListItem, ListItemText, ListSubheader, Button } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import PersonIcon from '@material-ui/icons/Person';
import { useDispatch } from 'react-redux';
import { answerCall, hangupCall, rejectCall, holdCall, muteCall, unmuteCall, setHold, transferCall, hangupTransferCall, holdTransferCall, muteTransferCall, unmuteTransferCall, completeTransferCall, setTransferAction, setMute } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneIcon from '@material-ui/icons/Phone';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import PauseIcon from '@material-ui/icons/Pause';
import MicOffIcon from '@material-ui/icons/MicOff';
import { FieldEdit } from 'components';
import { Card, CardContent } from '@material-ui/core';
import { convertLocalDate, secondsToTime, getSecondsUntelNow, conversationCallHold } from 'common/helpers';
import { langKeys } from 'lang/keys';
import DialpadIcon from '@material-ui/icons/Dialpad';
import { execute } from 'store/main/actions';
import { CallTransferInactiveIcon, CallTransferActiveIcon } from 'icons';
import Dial from './Dial';
import { ICallGo } from '@types';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        border: '#878787 solid',
        color: '#878787',
        '&:hover': {
            border: '#7721AD solid',
            color: '#7721AD',
        },
    },
    transferListRoot: {
        width: '100%',
        height: 160,
        marginTop: 15,
        overflow: 'auto',
    },
    transferListSubheader: {
        lineHeight: 'inherit'

    },
    transferListItem: {
        borderRadius: '10px',
        padding: '0px 10px',
        '&:hover': {
            backgroundColor: '#dcdcdc',
            boxShadow: 'none',
        },
    },
}));

const ManageCallInfoTicket: React.FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [call, setCall] = useState<ICallGo | undefined>(undefined);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const [date, setdate] = useState<string>(new Date().toISOString());
    const [time, settime] = useState(0);
    const resValidateToken = useSelector(state => state.login.validateToken?.user!!);
    // Variables to transfer
    const agentToReassignList = useSelector(state => state.inbox.agentToReassignList);
    const transferAction = useSelector(state => state.voximplant.transferAction);
    // const [transferEnable, setTransferEnable] = useState(false);
    const [transferUser, setTransferUser] = useState<{ userid: number, name: string } | null>(null);
    const [transferStep, setTransferStep] = useState(1);
    const [transferFilter, setTransferFilter] = useState("");
    const [openDial, setOpenDial] = useState(false);
    const calls = useSelector(state => state.voximplant.calls);

    useEffect(() => {
        const call = calls.find(call => `${call.number}_VOXI` === ticketSelected?.personcommunicationchannel && call.statusCall !== "DISCONNECTED")
        if (!call) {
            return;
        }
        setCall(call)
    }, [calls, ticketSelected?.conversationid])

    React.useEffect(() => {
        if (call?.statusCall === "CONNECTED") {
            const datex = ticketSelected?.callanswereddate || new Date().toISOString();
            setdate(datex);
            settime(getSecondsUntelNow(convertLocalDate(datex)));
        }
        else {
            dispatch(setTransferAction(false))
            setTransferUser(null)
        }
    }, [call?.statusCall])

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (call?.statusCall === "CONNECTED") {
            interval = setTimeout(() => {
                settime(getSecondsUntelNow(convertLocalDate(date)));
            }, 1000)
        } else {
            settime(0)
        }
        return () => {
            if (interval) {
                clearTimeout(interval)
            }
        };
    }, [time, call?.statusCall, date]);

    const triggerHold = () => {
        if (call?.onhold) {
            const timeToAdd = getSecondsUntelNow(convertLocalDate(call?.onholddate))
            dispatch(execute(conversationCallHold({
                holdtime: timeToAdd,
                conversationid: ticketSelected?.conversationid
            })))
        }
        dispatch(holdCall({ call: call?.call!!, flag: !!call?.onhold, number: call?.number }));
        dispatch(setHold({ hold: !call?.onhold, number: call?.number }))
    }

    const transferHold = () => {
        if (!call?.onhold) {
            dispatch(setHold({ hold: true, number: call?.number }))
        }
    }

    const handleClickAway = () => {
        setOpenDial(false)
    };

    return (
        <div style={{ width: "100%" }}>
            <Card style={{ maxWidth: "500px" }}>
                <CardContent>
                    <div>
                        <div>
                            <div style={{ marginLeft: "auto", marginTop: 20, marginRight: "auto", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#bdbdbd" }}>
                                <PersonIcon style={{ color: "white", width: "100px", height: "100px" }} />
                            </div>
                        </div>
                        <div>
                            {(call?.type === "OUTBOUND" && call?.statusCall === "CONNECTING") && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    {t(langKeys.outboundcall)}
                                </div>
                            )}
                            {(call?.type === "INBOUND" && call?.statusCall === "CONNECTING") && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    {t(langKeys.inboundcall)}
                                </div>
                            )}
                            {call?.statusCall === "DISCONNECTED" ?
                                (<div style={{ display: "flex", width: "100%" }}>
                                    <TextField
                                        label={t(langKeys.phone)}
                                        value={call?.number}
                                        style={{ marginRight: "auto", marginLeft: "auto", width: "400px" }}
                                        type="number"
                                        disabled={true}
                                    />
                                </div>) : (
                                    <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "20px", marginTop: 10 }}>
                                        {call?.number}
                                    </div>
                                )
                            }
                            {(call?.statusCall === "CONNECTED" && !call?.onhold) &&
                                <div style={{ fontSize: "15px", marginLeft: "auto", marginRight: "auto", width: "100px", textAlign: "center" }}>
                                    {(secondsToTime(time || 0))}
                                </div>
                            }
                            {(call?.statusCall === "CONNECTED" && call?.onhold) &&
                                <div style={{ fontSize: "15px", marginLeft: "auto", marginRight: "auto", width: "200px", textAlign: "center" }}>
                                    {t(langKeys.waittime)} {(secondsToTime(getSecondsUntelNow(convertLocalDate(call?.onholddate))))}
                                </div>
                            }
                        </div>
                        <div style={{ justifyContent: 'center', marginBottom: 12, marginTop: 10, display: "flex" }}>
                            {(call?.type === "OUTBOUND" && call?.statusCall === "CONNECTING") && (
                                <IconButton //rejectcall
                                    style={{ marginLeft: "auto", marginRight: "auto", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#fa6262' }}
                                    onClick={() => {
                                        dispatch(hangupCall({ call: call.call!!, number: call.number, ticketSelected }))
                                    }}
                                >
                                    <CallEndIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                </IconButton>
                            )}
                            {(call?.type === "INBOUND" && call?.statusCall === "CONNECTING") && (
                                <>
                                    <IconButton //answercall
                                        style={{ marginLeft: "10px", marginRight: "auto", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#55bd84' }}
                                        onClick={() => {
                                            dispatch(answerCall({ call: call.call!!, number: call.number }))
                                            setCall({
                                                ...call,
                                                statusCall: "CONNECTED"
                                            })
                                        }}
                                    >
                                        <PhoneIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                    <IconButton //rejectcall
                                        style={{ marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#fa6262' }}
                                        onClick={() => dispatch(rejectCall({ call: call.call!!, number: call.number, ticketSelected }))}
                                    >
                                        <CallEndIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                </>
                            )}
                            {call?.statusCall === "CONNECTED" && (
                                <div style={{ display: "grid", width: "100%", gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col3] 50px 50px [col4] 50px auto', }}>
                                    {(call?.mute || call?.onhold) ? (
                                        <IconButton //unmuteself
                                            style={{ gridColumnStart: "col1", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#7721ad' }}
                                            onClick={() => {
                                                dispatch(unmuteCall({ call: call.call!!, number: call.number }));
                                                dispatch(setMute({ mute: false, number: call.number }))
                                            }}>
                                            <MicOffIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                        </IconButton>
                                    ) : (
                                        <IconButton //muteself
                                            style={{ gridColumnStart: "col1", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#55bd84' }}
                                            onClick={() => {
                                                dispatch(muteCall({ call: call.call!!, number: call.number }));
                                                dispatch(setMute({ mute: true, number: call.number }))
                                            }}>
                                            <MicIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                        </IconButton>
                                    )}
                                    <IconButton //holdcall
                                        style={{ gridColumnStart: "col2", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: !call?.onhold ? '#bdbdbd' : '#781baf' }}
                                        onClick={triggerHold}
                                    >
                                        <PauseIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                    <div style={{ gridColumnStart: "col3", marginLeft: "auto", marginRight: "10px", width: "60px", textAlign: "center" }}>
                                        <IconButton //transfercall
                                            style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#bdbdbd' }}
                                            disabled={!!call.transfer}
                                            onClick={() => {
                                                setTransferUser(null)
                                                setTransferFilter("")
                                                setTransferStep(1)
                                                dispatch(setTransferAction(!transferAction))
                                            }}
                                        >
                                            {
                                                transferAction
                                                    ? <>
                                                        <CallTransferActiveIcon title="Transferir" style={{ color: "white", width: "35px", height: "35px" }} />
                                                    </>
                                                    : <CallTransferInactiveIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                            }
                                        </IconButton>
                                        {transferAction && <span style={{ color: '#781baf' }}>{t(langKeys.transfer)}</span>}
                                    </div>
                                    <IconButton //hangupcall
                                        style={{ gridColumnStart: "col4", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#fa6262' }}
                                        onClick={() => dispatch(hangupCall({ call: call.call!!, number: call.number, ticketSelected }))}
                                    >
                                        <CallEndIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>

                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            {call?.transfer?.transfernumber && <Card style={{ maxWidth: "500px", marginTop: 50 }}>
                <CardContent>
                    <div>
                        <div>
                            <div style={{ marginLeft: "auto", marginTop: 20, marginRight: "auto", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#bdbdbd" }}>
                                <PersonIcon style={{ color: "white", width: "100px", height: "100px" }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "20px", marginTop: 10 }}>
                                {call.transfer?.transfername || call.transfer?.transfernumber}
                            </div>
                            {(call.transfer?.statusCall === "CONNECTING") &&
                                <div style={{ fontSize: "15px", marginLeft: "auto", marginRight: "auto", width: "100px", textAlign: "center" }}>
                                    {t(langKeys.connecting)}
                                </div>
                            }
                            {(call.transfer?.statusCall === "CONNECTED" && call.transfer?.hold) &&
                                <div style={{ fontSize: "15px", marginLeft: "auto", marginRight: "auto", width: "200px", textAlign: "center" }}>
                                    {t(langKeys.waittime)} {(secondsToTime(getSecondsUntelNow(convertLocalDate(call.transfer?.holddate))))}
                                </div>
                            }
                        </div>
                        <div style={{ justifyContent: 'center', marginBottom: 12, marginTop: 10, display: "flex" }}>
                            <div style={{ display: "grid", width: "100%", gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col3] 50px 50px [col4] 50px auto', }}>
                                {(call.transfer?.mute || call.transfer?.hold) ? (
                                    <IconButton //unmuteself
                                        style={{ gridColumnStart: "col1", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#7721ad' }}
                                        onClick={() => { dispatch(unmuteTransferCall(call?.call)) }}>
                                        <MicOffIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                ) : (
                                    <IconButton //muteself
                                        style={{ gridColumnStart: "col1", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: call.transfer?.statusCall === "CONNECTED" ? '#55bd84' : '#bdbdbd' }}
                                        disabled={call.transfer?.statusCall !== "CONNECTED"}
                                        onClick={() => { dispatch(muteTransferCall(call?.call)) }}>
                                        <MicIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                )}
                                <IconButton //holdcall
                                    style={{ gridColumnStart: "col2", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: call.transfer?.hold && call.transfer?.statusCall === "CONNECTED" ? '#781baf' : '#bdbdbd' }}
                                    disabled={call.transfer?.statusCall !== "CONNECTED"}
                                    onClick={() => { dispatch(holdTransferCall({ call: call?.call, hold: call.transfer?.hold })) }}
                                >
                                    <PauseIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                </IconButton>
                                <IconButton //transfercall
                                    style={{ gridColumnStart: "col3", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#bdbdbd' }}
                                    disabled={true}
                                >
                                    <CallTransferInactiveIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                </IconButton>
                                <IconButton //hangupcall
                                    style={{ gridColumnStart: "col4", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#fa6262' }}
                                    onClick={() => dispatch(hangupTransferCall(call?.call))}
                                >
                                    <CallEndIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                </IconButton>
                            </div>
                        </div>
                        <div style={{ justifyContent: 'center', marginBottom: 12, marginTop: 10, display: "flex" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={call.transfer?.statusCall !== "CONNECTED"}
                                onClick={() => {
                                    if (call.transfer?.statusCall === "CONNECTED") {
                                        dispatch(completeTransferCall({ call: call?.call, number: call.transfer?.transfernumber }))
                                    }
                                }}
                            >
                                {t(langKeys.complete_transfer)}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>}
            <Card style={{ maxWidth: "500px", marginRight: "auto", marginTop: 50, display: transferAction ? "block" : "none", position: 'relative' }}>
                {transferStep === 1 && <>
                    <IconButton
                        size="small"
                        className={classes.closeButton}
                        onClick={() => {
                            dispatch(setTransferAction(false))
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {t(langKeys.transfercall)}
                        </Typography>
                        <div>
                            <FieldEdit
                                label={t(langKeys.searcher)}
                                variant='outlined'
                                size="small"
                                valueDefault={transferFilter}
                                onChange={(value) => {
                                    setTransferFilter(value)
                                }}
                            />
                            <List className={classes.transferListRoot}>
                                <ListSubheader
                                    disableSticky={true}
                                    className={classes.transferListSubheader}
                                >
                                    {t(langKeys.user_plural)}
                                </ListSubheader>
                                {agentToReassignList.filter(x => x.hasvoxichannel
                                    && x.userid !== agentSelected?.userid
                                    && x.status === "ACTIVO"
                                    && x.displayname.toLowerCase().includes(transferFilter.toLowerCase()))
                                    .map((item, index) => (
                                        <ListItem
                                            button
                                            key={`transfer-${index}`}
                                            className={classes.transferListItem}
                                            onClick={() => {
                                                setTransferStep(2)
                                                setTransferUser({
                                                    userid: item.userid,
                                                    name: item.displayname
                                                })
                                            }}
                                        >
                                            <ListItemText
                                                primary={item.displayname}
                                            />
                                            <ListItemText
                                                primary={item.userid}
                                                style={{ textAlign: 'right' }}
                                            />
                                        </ListItem>
                                    ))}
                            </List>
                            <div style={{ justifyContent: 'center', marginBottom: 12, marginTop: 10, display: "flex" }}>
                                <ClickAwayListener onClickAway={handleClickAway}>
                                    <div>
                                        <IconButton
                                            style={{ marginLeft: "auto", marginRight: "auto", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#7721ad' }}
                                            onClick={() => {
                                                setOpenDial(true)
                                            }}
                                        >
                                            <DialpadIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                        </IconButton>
                                        <Dial
                                            open={openDial}
                                            setOpen={setOpenDial}
                                            triggerHold={transferHold}
                                        />
                                    </div>
                                </ClickAwayListener>
                            </div>
                        </div>
                    </CardContent>
                </>}
                {transferStep === 2 && <>
                    <IconButton
                        size="small"
                        className={classes.closeButton}
                        onClick={() => {
                            setTransferStep(1)
                            setTransferUser(null)
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {t(langKeys.transfercall)}
                        </Typography>
                        <div>
                            <div>
                                {t(langKeys.transferto, { from: call?.number, to: transferUser?.name })}
                            </div>
                            <div>
                                <div style={{ marginLeft: "auto", marginTop: 20, marginRight: "auto", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#bdbdbd" }}>
                                    <PersonIcon style={{ color: "white", width: "100px", height: "100px" }} />
                                </div>
                                <div style={{ fontSize: "15px", marginLeft: "auto", marginRight: "auto", width: "200px", textAlign: "center", marginTop: 10 }}>
                                    {transferUser?.name}
                                </div>
                            </div>
                            <div style={{ justifyContent: 'center', marginBottom: 12, marginTop: 10, display: "flex" }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        if (transferUser?.userid) {
                                            dispatch(transferCall({
                                                url: `${ticketSelected?.commentexternalid}?mode=transfer&number=user${transferUser?.userid}.${resValidateToken.orgid}&name=${transferUser.name}`,
                                                number: ticketSelected?.personcommunicationchannel,
                                                conversationid: ticketSelected?.conversationid!!,
                                                transfernumber: `user${transferUser?.userid}.${resValidateToken.orgid}`,
                                                transfername: transferUser.name,
                                            }))
                                            dispatch(transferHold)
                                            dispatch(setTransferAction(false))
                                        }
                                    }}
                                >
                                    {t(langKeys.tocall)}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </>}
            </Card>
        </div>
    )
}
export default ManageCallInfoTicket;