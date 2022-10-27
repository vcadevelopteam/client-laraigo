import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import PersonIcon from '@material-ui/icons/Person';
import { useDispatch } from 'react-redux';
import { answerCall, hangupCall, rejectCall, holdCall, muteCall, unmuteCall, setHold } from 'store/voximplant/actions';
import { Card, CardContent, Fab } from '@material-ui/core';
import { convertLocalDate, secondsToTime, getSecondsUntelNow, conversationCallHold, getTimeBetweenDates, timetoseconds } from 'common/helpers';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import HearingIcon from '@material-ui/icons/Hearing';
import { IconButton } from '@material-ui/core';
import IOSSwitch from "components/fields/IOSSwitch";

const ManageCallInfoSupervisor: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const phoneinbox = useSelector(state => state.inbox.person.data?.phone);
    const [numberVox, setNumberVox] = useState("");
    const resValidateToken = useSelector(state => state.login.validateToken);
    const call = useSelector(state => state.voximplant.call);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [supervision, setSupervision] = useState(false)
    const [time, settime] = useState(0);


    React.useEffect(() => {
        if (ticketSelected?.callanswereddate) {
            if (ticketSelected?.status === "CERRADO") {
                settime(timetoseconds(getTimeBetweenDates(convertLocalDate(ticketSelected?.callanswereddate), convertLocalDate(ticketSelected?.finishdate))))
            } else {
                settime(getSecondsUntelNow(convertLocalDate(ticketSelected?.callanswereddate)));
            }
        }
        if (call?.data?.conversationid === ticketSelected?.conversationid) {
            setSupervision(true)
        }
    }, [ticketSelected])

    useEffect(() => {
        if (supervision) {
            const { userid, orgid } = resValidateToken.user!!;
            const url = `${ticketSelected?.commentexternalid}?mode=supervision&user=user${userid}.${orgid}`;
            fetch(url, { method: 'GET' });
        } else {

        }
    }, [supervision])

    React.useEffect(() => {
        if (ticketSelected?.status === "CERRADO") {
            return;
        }
        let interval: NodeJS.Timeout | null = null;
        if (ticketSelected?.callanswereddate) {
            interval = setTimeout(() => {
                settime(getSecondsUntelNow(convertLocalDate(ticketSelected?.callanswereddate)));
            }, 1000)
        } else {
            settime(0)
        }
        return () => {
            if (interval) {
                clearTimeout(interval)
            }
        };
    }, [time, ticketSelected]);

    React.useEffect(() => {
        if (phoneinbox) {
            setNumberVox(phoneinbox)
        }
    }, [phoneinbox])

    return (
        <div style={{ width: "100%" }}>
            <Card style={{ maxWidth: "500px" }}>
                <CardContent>
                    {ticketSelected?.status !== "CERRADO" && (
                        <div style={{ display: "flex", justifyContent: "end" }}>
                            <div style={{ display: "flex", gap: 4,  }}>
                                <div>
                                    Supervisar
                                </div>
                                <IOSSwitch checked={supervision} onChange={(e) => setSupervision(e.target.checked)} name="checkedB" />
                            </div>
                        </div>
                    )}
                    <div>
                        <div style={{ marginLeft: "auto", marginTop: 20, marginRight: "auto", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#bdbdbd" }}>
                            <PersonIcon style={{ color: "white", width: "100px", height: "100px" }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: "column", gap: 4, marginTop: 4 }}>
                        <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "20px" }}>
                            {numberVox}
                        </div>
                        <div style={{ fontSize: 16, textAlign: "center" }}>
                            {(secondsToTime(time || 0))}
                        </div>
                        <div style={{ width: "100%", textAlign: "center", fontSize: 16 }}>
                            {(ticketSelected?.origin === "OUTBOUND") ? t(langKeys.outboundcall) : t(langKeys.inboundcall)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
export default ManageCallInfoSupervisor;