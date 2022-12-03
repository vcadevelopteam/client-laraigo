import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import PersonIcon from '@material-ui/icons/Person';
import { useDispatch } from 'react-redux';
import { hangupCall, resetCall } from 'store/voximplant/actions';
import { Card, CardContent, Tooltip } from '@material-ui/core';
import { convertLocalDate, secondsToTime, getSecondsUntelNow, getTimeBetweenDates, timetoseconds, conversationSupervisionStatus } from 'common/helpers';
import { langKeys } from 'lang/keys';
import HearingIcon from '@material-ui/icons/Hearing';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { execute } from 'store/main/actions';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketSelected?.callanswereddate])

    useEffect(() => {
        if (call?.identifier) {
            const conversationid = parseInt(call.identifier.split("-")[3])
            if (conversationid === ticketSelected?.conversationid) {
                setSupervision(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const triggerSupervision = () => {
        if (!supervision) {
            setSupervision(true)
            const { userid, orgid } = resValidateToken.user!!;
            const url = `${ticketSelected?.commentexternalid}?mode=supervision&user=user${userid}.${orgid}`;
            fetch(url, { method: 'GET' })
                .catch(() => setSupervision(false))
                .then(() => {
                    dispatch(execute(conversationSupervisionStatus({
                        conversationid: ticketSelected?.conversationid,
                        status: "ACTIVO",
                        type: "SUPERVISION"
                    })));
                })
        } else {
            dispatch(execute(conversationSupervisionStatus({
                conversationid: ticketSelected?.conversationid,
                status: "INACTIVO",
                type: "SUPERVISION"
            })));
            setSupervision(false)
            dispatch(hangupCall(call.call));
            dispatch(resetCall());
        }
    }

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
                    {(ticketSelected?.status !== "CERRADO" && !!resValidateToken?.user?.voximplantcallsupervision) && (
                        <div style={{ display: "flex", justifyContent: "end" }}>
                            <Tooltip title={t(langKeys.monitor_call) || ""}>
                                <span>
                                    <ToggleButton
                                        value="check"
                                        disabled={time === 0 || !ticketSelected?.commentexternalid}
                                        selected={supervision}
                                        color="primary"
                                        onChange={triggerSupervision}
                                    >
                                        <HearingIcon />
                                    </ToggleButton>
                                </span>
                            </Tooltip>
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
                        {time === 0 ? (
                            <div style={{ fontSize: 16, textAlign: "center" }}>
                                {t(langKeys.ringing)}
                            </div>
                        ) : (
                            <div style={{ fontSize: 16, textAlign: "center" }}>
                                {(secondsToTime(time || 0))}
                            </div>
                        )}
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