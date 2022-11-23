/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { IconButton, Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import PersonIcon from '@material-ui/icons/Person';
import { useDispatch } from 'react-redux';
import { answerCall, hangupCall, rejectCall, holdCall, muteCall, unmuteCall, setHold } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneIcon from '@material-ui/icons/Phone';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import PauseIcon from '@material-ui/icons/Pause';
import MicOffIcon from '@material-ui/icons/MicOff';
import { FieldSelect } from 'components';
import { Card, CardContent } from '@material-ui/core';
import { convertLocalDate, secondsToTime, getSecondsUntelNow, conversationCallHold } from 'common/helpers';
import { langKeys } from 'lang/keys';
import DialpadIcon from '@material-ui/icons/Dialpad';
import { execute } from 'store/main/actions';

const ManageCallInfoTicket: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const phoneinbox = useSelector(state => state.inbox.person.data?.phone);
    const [numberVox, setNumberVox] = useState("");
    const onholdstate = useSelector(state => state.voximplant.onhold);
    const onholdstatedate = useSelector(state => state.voximplant.onholddate);
    const [hold, sethold] = useState(!onholdstate);
    const [mute, setmute] = useState(false);
    const call = useSelector(state => state.voximplant.call);
    const statusCall = useSelector(state => state.voximplant.statusCall);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [date, setdate] = useState<string>(new Date().toISOString());
    const [time, settime] = useState(0);
    const [timehold, settimehold] = useState(0);
    const [divertcall, setdivertcall] = useState(false);
    const [advisertodiver, setadvisertodiver] = useState("");
    const agentToReassignList = useSelector(state => state.inbox.agentToReassignList);

    React.useEffect(() => {
        if (call.type === "INBOUND" && statusCall === "CONNECTING") {
            sethold(true)
            setmute(false)
            setNumberVox(call.number)
        } else if (call.type === "INBOUND" && statusCall !== "CONNECTING") {
            setNumberVox(call.number)
        }
    }, [call, dispatch, statusCall])

    React.useEffect(() => {
        if (statusCall === "CONNECTED") {
            const datex = ticketSelected?.callanswereddate || new Date().toISOString();
            setdate(datex);
            settime(getSecondsUntelNow(convertLocalDate(datex)));
        }
        if (statusCall !== "CONNECTED") {
            setdivertcall(false)
            setadvisertodiver("")
        }
    }, [statusCall])

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (statusCall === "CONNECTED") {
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
    }, [time, statusCall, date]);

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (statusCall === "CONNECTED" && !hold) {
            interval = setTimeout(() => {
                settimehold(getSecondsUntelNow(convertLocalDate(onholdstatedate)));
            }, 1000)
        } else {
            settimehold(0)
        }
        return () => {
            if (interval) {
                clearTimeout(interval)
            }
        };
    }, [timehold, hold, statusCall]);

    React.useEffect(() => {
        if (phoneinbox) {
            setNumberVox(phoneinbox)
        }
    }, [phoneinbox])

    const triggerHold = () => {
        if (onholdstate) {
            const timeToAdd = getSecondsUntelNow(convertLocalDate(onholdstatedate))
            dispatch(execute(conversationCallHold({
                holdtime: timeToAdd,
                conversationid: ticketSelected?.conversationid
            })))
        }
        dispatch(holdCall({ call: call.call!!, flag: !hold, number: ticketSelected?.personcommunicationchannel }));
        sethold(!hold)
        dispatch(setHold(hold))
    }

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
                            {(call.type === "OUTBOUND" && statusCall === "CONNECTING") && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    {t(langKeys.outboundcall)}
                                </div>
                            )}
                            {(call.type === "INBOUND" && statusCall === "CONNECTING") && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    {t(langKeys.inboundcall)}
                                </div>
                            )}
                            {statusCall === "DISCONNECTED" ?
                                (<div style={{ display: "flex", width: "100%" }}>
                                    <TextField
                                        label={t(langKeys.phone)}
                                        value={numberVox}
                                        style={{ marginRight: "auto", marginLeft: "auto", width: "400px" }}
                                        type="number"
                                        onChange={(e) => setNumberVox(e.target.value)}
                                        disabled={true}
                                    />
                                </div>) : (
                                    <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "20px", marginTop: 10 }}>
                                        {numberVox}
                                    </div>
                                )
                            }
                            {(statusCall === "CONNECTED" && hold) &&
                                <div style={{ fontSize: "15px", marginLeft: "auto", marginRight: "auto", width: "100px", textAlign: "center" }}>
                                    {(secondsToTime(time || 0))}
                                </div>
                            }
                            {(statusCall === "CONNECTED" && !hold) &&
                                <div style={{ fontSize: "15px", marginLeft: "auto", marginRight: "auto", width: "200px", textAlign: "center" }}>
                                    {t(langKeys.waittime)} {(secondsToTime(getSecondsUntelNow(convertLocalDate(onholdstatedate))))}
                                </div>
                            }
                        </div>
                        <div style={{ justifyContent: 'center', marginBottom: 12, marginTop: 10, display: "flex" }}>
                            {(call.type === "OUTBOUND" && statusCall === "CONNECTING") && (
                                <IconButton //rejectcall
                                    style={{ marginLeft: "auto", marginRight: "auto", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#fa6262' }}
                                    onClick={() => {
                                        // dispatch(holdCall({ call: call.call, flag: true }));
                                        sethold(true)
                                        setmute(false)
                                        dispatch(hangupCall({ call: call.call!!, number: ticketSelected?.personcommunicationchannel }))
                                    }}
                                >
                                    <CallEndIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                </IconButton>
                            )}
                            {(call.type === "INBOUND" && statusCall === "CONNECTING") && (
                                <>
                                    <IconButton //answercall
                                        style={{ marginLeft: "10px", marginRight: "auto", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#55bd84' }}
                                        onClick={() => {
                                            dispatch(answerCall({ call: call.call!!, number: ticketSelected?.personcommunicationchannel }))
                                        }}
                                    >
                                        <PhoneIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                    <IconButton //rejectcall
                                        style={{ marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#fa6262' }}
                                        onClick={() => dispatch(rejectCall({ call: call.call!!, number: ticketSelected?.personcommunicationchannel }))}
                                    >
                                        <CallEndIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                </>
                            )}
                            {statusCall === "CONNECTED" && (
                                <div style={{ display: "grid", width: "100%", gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col4] 50px auto', }}>
                                    {(mute || !hold) ? (
                                        <IconButton //unmuteself
                                            style={{ gridColumnStart: "col1", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#7721ad' }}
                                            onClick={() => { dispatch(unmuteCall({ call: call.call!!, number: ticketSelected?.personcommunicationchannel })); setmute(false) }}>
                                            <MicOffIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                        </IconButton>
                                    ) : (
                                        <IconButton //muteself
                                            style={{ gridColumnStart: "col1", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#55bd84' }}
                                            onClick={() => { dispatch(muteCall({ call: call.call!!, number: ticketSelected?.personcommunicationchannel })); setmute(true) }}>
                                            <MicIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                        </IconButton>
                                    )}
                                    <IconButton //holdcall
                                        style={{ gridColumnStart: "col2", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: hold ? '#bdbdbd' : '#781baf' }}
                                        onClick={triggerHold}
                                    >
                                        <PauseIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>
                                    <IconButton //hangupcall
                                        style={{ gridColumnStart: "col4", marginLeft: "auto", marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#fa6262' }}
                                        onClick={() => dispatch(hangupCall({ call: call.call!!, number: ticketSelected?.personcommunicationchannel }))}
                                    >
                                        <CallEndIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                    </IconButton>

                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto", marginTop: 50, display: divertcall ? "block" : "none" }}>
                <CardContent>
                    <>
                        <div>
                            <Typography gutterBottom variant="h6" component="div">
                                {t(langKeys.transfercalltoadvisor)}
                            </Typography>
                            <div>
                                <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: 15 }}>
                                    <FieldSelect
                                        label={t(langKeys.advisor)}
                                        className="col-12"
                                        valueDefault={advisertodiver}
                                        style={{ marginRight: "auto", marginLeft: "auto", width: "400px" }}
                                        onChange={(value) => setadvisertodiver(value?.userid || '')}
                                        error={advisertodiver ? "" : t(langKeys.required)}
                                        data={agentToReassignList.filter(x => x.status === "ACTIVO")}
                                        optionDesc="displayname"
                                        optionValue="userid"
                                    />
                                </div>
                            </div>
                            <div style={{ justifyContent: 'center', marginBottom: 12, marginTop: 10, display: "flex" }}>
                                <IconButton //divertcall
                                    style={{ marginLeft: "auto", marginRight: "auto", width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#7721ad' }}
                                    onClick={() => {
                                        //dispatch(makeCall(numberVox))
                                        sethold(true)
                                        setmute(false)
                                    }}
                                >
                                    <DialpadIcon style={{ color: "white", width: "35px", height: "35px" }} />
                                </IconButton>
                            </div>
                        </div>
                    </>
                </CardContent>
            </Card>
        </div>
    )
}
export default ManageCallInfoTicket;