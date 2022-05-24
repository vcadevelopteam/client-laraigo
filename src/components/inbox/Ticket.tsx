import React, { useState, useEffect } from 'react'
import { useSelector } from 'hooks';
import Avatar from '@material-ui/core/Avatar';
import { styled, makeStyles } from '@material-ui/core/styles';
import { ITicket } from "@types";
import { GetIcon } from 'components'
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import { useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { convertLocalDate, secondsToTime, getSecondsUntelNow } from 'common/helpers';
import { answerCall, hangupCall } from 'store/voximplant/actions';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import { IconButton } from '@material-ui/core';
import { Call } from 'voximplant-websdk/Call/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';

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
    }
}));

const LabelGo: React.FC<{
    label?: string,
    color: string,
    isTimer?: boolean;
    dateGo?: string;
    tooltip?: string;
    regressive?: boolean;
    labelOnNegative?: string;
}> = ({ label, color, dateGo, isTimer, tooltip, regressive = false, labelOnNegative = "" }) => {
    const classes = useStyles({ color });
    const isMounted = React.useRef<boolean | null>(null);
    const [time, settime] = useState(isTimer ? getSecondsUntelNow(convertLocalDate(dateGo, !regressive), regressive) : -1);

    React.useEffect(() => {
        isMounted.current = true;
        let timer = !label ? setTimeout(() => {
            if (isMounted.current) {
                settime(getSecondsUntelNow(convertLocalDate(dateGo, !regressive), regressive));
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

const ItemTicket: React.FC<{ classes: any, item: ITicket, setTicketSelected: (param: ITicket) => void }> = ({ classes, setTicketSelected, item, item: { conversationid, call, personlastreplydate, communicationchanneltype, lastmessage, displayname, imageurldef, ticketnum, firstconversationdate, countnewmessages, status, communicationchannelid, lastreplyuser, lastconversationdate } }) => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const localclasses = useStyles({ color: "red" });
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const userType = useSelector(state => state.inbox.userType);
    const multiData = useSelector(state => state.main.multiData);
    const [dateToClose, setDateToClose] = useState<Date | null>(null)
    const dictAutoClose = useSelector(state => state.login.validateToken.user?.properties?.auto_close);
    const statusCall = useSelector(state => state.voximplant?.statusCall);
    const dictAutoCloseHolding = useSelector(state => state.login.validateToken.user?.properties?.auto_close_holding);
    const callVoxiTmp = useSelector(state => state.voximplant.call);
    const [callVoxi, setCallVoxi] = useState<Call | null>(null);
    const dispatch = useDispatch();

    const [iconColor, setIconColor] = useState('#7721AD');
    const { t } = useTranslation();

    useEffect(() => {
        if (callVoxiTmp && callVoxiTmp.call && callVoxiTmp.data?.conversationid === conversationid && item.status === "ASIGNADO") {
            setCallVoxi(callVoxiTmp.call);
        } else {
            setCallVoxi(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callVoxiTmp]);

    React.useEffect(() => {
        if (!multiData.error && !multiData.loading && multiData?.data[6] && multiData.data[6].success) {
            const channelSelected = multiData.data[6].data.find(x => x.communicationchannelid === communicationchannelid);
            setIconColor(channelSelected?.coloricon || '#7721AD');
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


    return (
        <div
            className={clsx(classes.containerItemTicket, {
                [classes.itemSelected]: (ticketSelected?.conversationid === conversationid)
            })}
            onClick={() => setTicketSelected(item)}>
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
                    <div className={classes.name}>{displayname || "-"}</div>
                </div>
                <div style={{ color: '#465a6ed9', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 180, maxWidth: callVoxi ? 180 : 230 }}>
                    {(lastmessage || "").trim() || "-"}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <LabelGo
                        label={ticketnum}
                        tooltip={t(langKeys.ticket_number)}
                        color={status === 'ASIGNADO' ? "#55BD84" : (status === "PAUSADO" ? "#ffbf00" : "#FB5F5F")}
                    />
                    <LabelGo
                        isTimer={true}
                        tooltip={t(langKeys.total_duration)}
                        dateGo={firstconversationdate || new Date().toISOString()}
                        color="#465a6ed9"
                    />
                    {(countnewmessages || 0) > 0 &&
                        <LabelGo
                            isTimer={true}
                            tooltip={t(langKeys.waiting_person_time)}
                            dateGo={lastconversationdate || new Date().toISOString()}
                            color="#FB5F5F"
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
                </div>
            </div>
            {(!!callVoxi && statusCall === "CONNECTING" && callVoxiTmp.type === "INBOUND") &&
                <div style={{ flex: 1 }}>
                    <IconButton //answercall
                        style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: '#55bd84' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(answerCall({ call: callVoxi!!, conversationid }));
                        }}
                    >
                        <PhoneCallbackIcon className={localclasses.iconcall} />
                    </IconButton>
                </div>
            }
            {(!!callVoxi && statusCall === "CONNECTING" && callVoxiTmp.type === "OUTBOUND") && (
                <div style={{ flex: 1 }}>
                    <IconButton
                        style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: '#ffd33a', cursor: "default" }}
                    >
                        <PhoneForwardedIcon style={{ color: "white", width: "30px", height: "30px" }} />
                    </IconButton>
                </div>
            )}
            {(!!callVoxi && statusCall === "CONNECTED") &&
                <div style={{ flex: 1 }}>
                    <IconButton
                        style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: 'rgb(180, 26, 26)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(hangupCall(callVoxi));
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