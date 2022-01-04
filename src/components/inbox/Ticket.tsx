import React, { useState, useEffect } from 'react'
import { useSelector } from 'hooks';
import Avatar from '@material-ui/core/Avatar';
import { styled, makeStyles } from '@material-ui/core/styles';
import { ITicket } from "@types";
import { GetIcon } from 'components'
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import { convertLocalDate, secondsToTime, getSecondsUntelNow } from 'common/helpers';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';

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
}> = ({ label, color, dateGo, isTimer, tooltip, regressive = false, labelOnNegative }) => {
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
                <div className={classes.label}>{isTimer ? secondsToTime(time || 0) : label}</div>
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

const ItemTicket: React.FC<{ classes: any, item: ITicket, setTicketSelected: (param: ITicket) => void }> = ({ classes, setTicketSelected, item, item: { personlastreplydate, communicationchanneltype, lastmessage, displayname, imageurldef, ticketnum, firstconversationdate, countnewmessages, status, communicationchannelid, lastreplyuser } }) => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const userType = useSelector(state => state.inbox.userType);
    const multiData = useSelector(state => state.main.multiData);
    const [dateToClose, setDateToClose] = useState<Date | null>(null)
    const dictAutoClose = useSelector(state => state.login.validateToken.user?.properties?.auto_close);
    const dictAutoCloseHolding = useSelector(state => state.login.validateToken.user?.properties?.auto_close_holding);

    const [iconColor, setIconColor] = useState('#7721AD');
    const { t } = useTranslation();

    React.useEffect(() => {
        if (!multiData.error && !multiData.loading && multiData?.data[6] && multiData.data[6].success) {
            const channelSelected = multiData.data[6].data.find(x => x.communicationchannelid === communicationchannelid);
            setIconColor(channelSelected?.coloricon || '#7721AD');
        }
    }, [multiData, communicationchannelid]);

    console.log(communicationchannelid);

    useEffect(() => {
        if (countnewmessages === 0) {
            const timeClose = (userType === "AGENT" || agentSelected?.userid !== 3) ? (dictAutoClose?.[communicationchannelid] || 0) : (dictAutoCloseHolding?.[communicationchannelid] || 0);
            // console.log(timeClose, lastreplyuser)
            console.log("timeClose", timeClose);
            if (timeClose === 0) {
                setDateToClose(null)
            } else {
                const datetmp = convertLocalDate(lastreplyuser);
                datetmp.setMinutes(datetmp.getMinutes() + timeClose);
                // console.log(datetmp)
                setDateToClose(datetmp)
            }
            // if (lastuser)
        } else {
            setDateToClose(null)
        }
    }, [dictAutoClose, dictAutoCloseHolding, countnewmessages, userType, agentSelected?.userid, communicationchannelid, lastreplyuser])


    return (
        <div
            className={clsx(classes.containerItemTicket, { [classes.itemSelected]: (ticketSelected?.conversationid === item.conversationid) })}
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

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <GetIcon channelType={communicationchanneltype} color={iconColor} />
                    <div className={classes.name}>{displayname || "-"}</div>
                </div>
                <div style={{ color: '#465a6ed9', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 230 }}>
                    {lastmessage}
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
                            dateGo={personlastreplydate || new Date().toISOString()}
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
                        />
                    }
                </div>
            </div>
        </div>

    )
}

export default ItemTicket;