import React, { useState, useEffect } from 'react'
import { useSelector } from 'hooks';
import Avatar from '@material-ui/core/Avatar';
import { styled, makeStyles } from '@material-ui/core/styles';
import { Dictionary, ICallGo, ITicket } from "@types";
import { GetIcon } from 'components'
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import { useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { convertLocalDate, secondsToTime, getSecondsUntelNow, callUpdateToken, getTimeBetweenDates } from 'common/helpers';
import { answerCall, hangupCall } from 'store/voximplant/actions';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import { IconButton } from '@material-ui/core';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { PhoneCalling } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import Button from '@material-ui/core/Button';
import { getCollectionAux } from 'store/main/actions';

const useStyles = makeStyles((theme) => ({
    label: {
        color: ({ color }: any) => color,
        padding: '3px 3px',
        whiteSpace: 'nowrap',
        fontSize: 13,
        fontFamily: 'Calibri'
    },
    backgroundLabel: {
        backgroundColor: ({ color }: any) => color,
        width: '100%',
        height: '24px',
        opacity: '0.1',
        position: 'absolute',
        top: 0,
        left: 0
    },
    iconcall: {
        color: "white",
        width: "25px",
        height: "25px",
        animationName: "$spin",
        animationDuration: "5000ms",
        animationIterationCount: "infinite",
        animationTimingFunction: "linear",
    },
    "@keyframes spin": {
        "from": {
            transform: "rotate(0deg)"
        },
        "to": {
            transform: "rotate(360deg)"
        }
    },
    phoneCallingIcon: {
        '& span': {
            width: 25
        }
    },
}));

const LabelGo: React.FC<{
    label?: string,
    color: string,
    isTimer?: boolean;
    dateGo?: string;
    tooltip?: string;
    regressive?: boolean;
    labelOnNegative?: string;
    callback?: (time: number) => void
}> = ({ callback, label, color, dateGo, isTimer, tooltip, regressive = false, labelOnNegative = "" }) => {
    const classes = useStyles({ color });
    const isMounted = React.useRef<boolean | null>(null);
    const [time, settime] = useState(isTimer ? getSecondsUntelNow(convertLocalDate(dateGo, !regressive), regressive) : -1);

    React.useEffect(() => {
        isMounted.current = true;
        let timer = !label ? setTimeout(() => {
            if (isMounted.current) {
                const timeSeconds = getSecondsUntelNow(convertLocalDate(dateGo, !regressive), regressive);
                callback && callback(timeSeconds)
                settime(timeSeconds);
            }
        }, 1000) : null;

        return () => {
            timer && clearTimeout(timer);
            isMounted.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    return (
        <Tooltip title={tooltip || ''} arrow placement="top">
            <div style={{ position: 'relative' }}>
                <div className={classes.label}>{isTimer ? (time < 0 ? labelOnNegative : secondsToTime(time || 0)) : label}</div>
                <div className={classes.backgroundLabel}></div>
            </div>
        </Tooltip>
    )
}

const SmallAvatar = styled(Avatar)(() => ({
    width: 18,
    backgroundColor: '#b41a1a',
    height: 18,
    fontSize: 11,
}));

const ItemTicket: React.FC<{ classes: any, item: ITicket, setTicketSelected: (param: ITicket) => void }> = ({ classes, setTicketSelected, item, item: { conversationid, call, personlastreplydate, origin, communicationchanneltype, lastmessage, displayname, imageurldef, ticketnum, firstconversationdate, finishdate, countnewmessages, status, communicationchannelid, lastreplyuser, lastconversationdate, personcommunicationchannel } }) => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const localclasses = useStyles({ color: "red" });
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const userType = useSelector(state => state.inbox.userType);
    const multiData = useSelector(state => state.main.multiData);
    const [dateToClose, setDateToClose] = useState<Date | null>(null)
    const data14 = React.useRef<Dictionary[] | null>(null)
    const [refreshToken, setRefreshToken] = useState(-1)
    const dictAutoClose = useSelector(state => state.login.validateToken.user?.properties?.auto_close);
    const dictAutoCloseHolding = useSelector(state => state.login.validateToken.user?.properties?.auto_close_holding);
    const originLabel = useSelector(state => state.login.validateToken.user?.properties?.origin_label);
    const secondsToAnwserCall = useSelector(state => state.login.validateToken.user?.properties?.seconds_to_answer_call);
    const waitingcustomermessage = useSelector(state => state.login.validateToken.user?.properties?.waiting_customer_message);
    const calls = useSelector(state => state.voximplant.calls);
    const [callVoxi, setCallVoxi] = useState<ICallGo | null>(null);
    const dispatch = useDispatch();
    const [iconColor, setIconColor] = useState('#7721AD');
    const { t } = useTranslation();
    const [timeWaiting, setTimeWaiting] = useState(-1);
    const [waitingDate, setWaitingDate] = useState<string | null>(null);

    useEffect(() => {
        if (item.status === "ASIGNADO") {
            const callFound = calls.find(call => `${call.number}_VOXI` === item.personcommunicationchannel);
            if (callFound) {
                setCallVoxi(callFound);
            } else {
                setCallVoxi(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calls]);

    React.useEffect(() => {
        if (!multiData.error && !multiData.loading) {
            if (multiData?.data[6] && multiData.data[6].success) {
                const channelSelected = multiData.data[6].data.find(x => x.communicationchannelid === communicationchannelid);
                setIconColor(channelSelected?.coloricon || '#7721AD');
            }
            
            if (multiData?.data[14] && multiData.data[14].success) {
                data14.current = multiData.data[14].data;
            }
        }
    }, [multiData, communicationchannelid]);

    useEffect(() => {
        if (countnewmessages === 0 && personlastreplydate && lastreplyuser) {
            const timeClose = (userType === "AGENT" || agentSelected?.userid !== 3) ? (dictAutoClose?.[communicationchannelid] || 0) : (dictAutoCloseHolding?.[communicationchannelid] || 0);
            if (timeClose === 0) {
                setDateToClose(null)
            } else {
                const datetmp = convertLocalDate(lastreplyuser);
                datetmp.setMinutes(datetmp.getMinutes() + timeClose);
                setDateToClose(datetmp)
            }
        } else {
            setDateToClose(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dictAutoClose, dictAutoCloseHolding, countnewmessages, userType, agentSelected?.userid, communicationchannelid, lastreplyuser])

    useEffect(() => {
        let timer = null;
        if (callVoxi?.statusCall === "CONNECTED") {
            timer = setTimeout(() => {
                setRefreshToken(refreshToken * -1)
                dispatch(getCollectionAux(callUpdateToken()))
            }, 30000)
        } else {
            timer && clearTimeout(timer);
        }
    }, [dispatch, refreshToken, callVoxi])

    const validateTime = React.useCallback((time: number) => {
        if (userType === "AGENT" && (countnewmessages || 0) > 0) {
            if (data14.current) {

                const pAlerts = data14.current;

                const alert = pAlerts.find(x => x.groupname === item.usergroup && !!x.propertyvalue && x.propertyvalue !== "0");
                if (alert) {
                    const minutesAlert = parseInt(alert.propertyvalue)

                    if (!Number.isNaN(minutesAlert)) {
                        const secondsAlert = minutesAlert * 60;
                        if (time % secondsAlert === 0) {
                            const minuteswaiting = time / 60;
                            if (minuteswaiting >= 1) {
                                const messagetoshow = `Ticket ${ticketnum}: ` + (waitingcustomermessage || "Tu cliente está esperando {{minutos}} minutos por tu respuesta.").replace("{{minutos}}", minuteswaiting + "")
                                dispatch(showSnackbar({
                                    show: true,
                                    severity: "warning",
                                    message: messagetoshow,
                                    horizontal: "center",
                                    action: (
                                        <Button color="secondary" size="small" onClick={() => setTicketSelected(item)}>
                                            {t(langKeys.go_ticket)}
                                        </Button>
                                    )
                                }))
                            }
                        }
                    }
                }
            }
        }
    }, [countnewmessages, dispatch, item, setTicketSelected, t, ticketnum, userType, waitingcustomermessage])

    React.useEffect(() => {
        if (callVoxi?.type === "INBOUND" && callVoxi?.statusCall === "CONNECTING") {
            setWaitingDate(new Date().toISOString())
            setTimeWaiting(0);
        }
    }, [callVoxi])

    React.useEffect(() => {
        if (timeWaiting >= 0 && (secondsToAnwserCall || 0) > 0) {
            if (timeWaiting >= (secondsToAnwserCall || 0) && (callVoxi?.type === "INBOUND" && callVoxi?.statusCall === "CONNECTING")) {
                dispatch(answerCall({ call: callVoxi?.call!!, number: personcommunicationchannel }));
                setWaitingDate(null);
                setTimeWaiting(-1);
                return;
            }
            if (callVoxi?.type === "INBOUND" && callVoxi?.statusCall === "CONNECTING") {
                setTimeout(() => {
                    setTimeWaiting(getSecondsUntelNow(convertLocalDate(waitingDate)));
                }, 1000)
            } else {
                setTimeWaiting(-1);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeWaiting]);


    return (
        <div
            className={clsx(classes.containerItemTicket, {
                [classes.itemSelected]: (ticketSelected?.conversationid === conversationid)
            })}
            onClick={() => {
                setTicketSelected(item);
                // showvox()
            }}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    (countnewmessages || 0) > 0 ? <SmallAvatar>{countnewmessages > 9 ? '+9' : countnewmessages}</SmallAvatar> : null
                }
            >
                <Avatar src={imageurldef} />
            </Badge>

            <div className={clsx({
                [classes.ticketWithCall]: !!call,
                [classes.ticketWithoutCall]: !call
            })}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <GetIcon channelType={communicationchanneltype} color={iconColor} />
                    <div className={classes.name} style={{ maxWidth: (callVoxi?.statusCall === "CONNECTING" ? 165 : 200) }}>{displayname || "-"}</div>
                </div>
                <div style={{ color: '#465a6ed9', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 180, maxWidth: callVoxi ? 180 : 230 }}>
                    {(lastmessage?.split("&%MAIL%&")[0] || "").trim() || "-"}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <LabelGo
                        label={ticketnum}
                        tooltip={t(langKeys.ticket_number)}
                        color={status === 'ASIGNADO' ? "#55BD84" : (status === "PAUSADO" ? "#ffbf00" : "#FB5F5F")}
                    />
                    <LabelGo
                        isTimer={status !== "CERRADO"}
                        tooltip={t(langKeys.total_duration)}
                        label={status === "CERRADO" ? (finishdate ? getTimeBetweenDates(new Date(firstconversationdate || ""), new Date(finishdate || "")) : secondsToTime(0)) : undefined}
                        dateGo={status !== "CERRADO" ? (firstconversationdate || new Date().toISOString()) : undefined}
                        color="#465a6ed9"
                    />
                    {(communicationchanneltype !== "VOXI" && (countnewmessages || 0) > 0) &&
                        <LabelGo
                            isTimer={status !== "CERRADO"}
                            tooltip={t(langKeys.waiting_person_time)}
                            label={status === "CERRADO" ? getTimeBetweenDates(new Date(lastconversationdate ?? ""), new Date(finishdate ?? "")) : undefined}
                            dateGo={status !== "CERRADO" ? (lastconversationdate ?? new Date().toISOString()) : undefined}
                            color="#FB5F5F"
                            callback={validateTime}
                        />
                    }
                    {dateToClose &&
                        <LabelGo
                            isTimer={true}
                            regressive={true}
                            tooltip={t(langKeys.time_to_automatic_closing)}
                            dateGo={dateToClose.toISOString()}
                            color="#4128a7"
                            labelOnNegative={t(langKeys.ready_to_close)}
                        />
                    }
                    {(communicationchanneltype !== "VOXI" && originLabel) &&
                        <LabelGo
                            isTimer={false}
                            color={origin === "OUTBOUND" ? "#ffbf00" : "#0000ff"}
                            label={origin || "INBOUND"}
                        />
                    }
                </div>
            </div>
            {(!!callVoxi && callVoxi?.statusCall === "CONNECTING" && callVoxi.type === "INBOUND") &&
                <div style={{ flex: 1 }}>
                    <IconButton //answercall
                        style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: '#55bd84' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(answerCall({ call: callVoxi?.call!!, number: personcommunicationchannel }));
                        }}
                    >
                        <PhoneCallbackIcon className={localclasses.iconcall} />
                    </IconButton>
                </div>
            }
            {(!!callVoxi && callVoxi?.statusCall === "CONNECTING" && callVoxi.type === "OUTBOUND") && (
                <div style={{ flex: 1 }}>
                    <IconButton
                        className={localclasses.phoneCallingIcon}
                        style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: '#ffd33a', cursor: "default" }}
                    >
                        <PhoneCalling className={localclasses.iconcall} />
                    </IconButton>
                </div>
            )}
            {(!!callVoxi && callVoxi.statusCall === "CONNECTED") &&
                <div style={{ flex: 1 }}>
                    <IconButton
                        style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: 'rgb(180, 26, 26)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(hangupCall({ call: callVoxi.call!!, number: personcommunicationchannel }));
                        }}
                    >
                        <CallEndIcon style={{ color: "white", width: "30px", height: "30px" }} />
                    </IconButton>
                </div>
            }
        </div>

    )
}

export default ItemTicket;