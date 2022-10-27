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
import { execute } from 'store/main/actions';

const ManageCallInfoSupervisor: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const phoneinbox = useSelector(state => state.inbox.person.data?.phone);
    const [numberVox, setNumberVox] = useState("");
    const onholdstate = useSelector(state => state.voximplant.onhold);
    const onholdstatedate = useSelector(state => state.voximplant.onholddate);
    const [hold, sethold] = useState(!onholdstate);
    const call = useSelector(state => state.voximplant.call);
    const statusCall = useSelector(state => state.voximplant.statusCall);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [date, setdate] = useState<string>(new Date().toISOString());
    const [time, settime] = useState(0);
    const [timehold, settimehold] = useState(0);

    console.log("callanswereddate", ticketSelected?.callanswereddate)
    React.useEffect(() => {
        if (call?.type === "INBOUND" && statusCall === "CONNECTING") {
            sethold(true)
            setNumberVox(call.number.split("@")[0].split(":")?.[1] || "")
        } else if (call.type === "INBOUND" && statusCall !== "CONNECTING") {
            setNumberVox(call.number.split("@")[0].split(":")?.[1] || "")
        }
    }, [call, dispatch, statusCall])

    React.useEffect(() => {
        if (statusCall === "CONNECTED") {
            const datex = ticketSelected?.callanswereddate || new Date().toISOString();
            setdate(datex);
            settime(getSecondsUntelNow(convertLocalDate(datex)));
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
                            <div style={{ width: "100%", textAlign: "center" }}>
                                {(ticketSelected?.origin === "OUTBOUND") ? t(langKeys.outboundcall) : t(langKeys.inboundcall)}
                            </div>
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
export default ManageCallInfoSupervisor;