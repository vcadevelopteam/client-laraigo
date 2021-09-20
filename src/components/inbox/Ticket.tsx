import React, { useState } from 'react'
import { useSelector } from 'hooks';
import Avatar from '@material-ui/core/Avatar';
import { ITicket } from "@types";
import { GetIcon } from 'components'
import clsx from 'clsx';
import { convertLocalDate, secondsToTime, getSecondsUntelNow } from 'common/helpers';

const LabelGo: React.FC<{ label?: string, color: string, isTimer?: boolean; timer?: number }> = ({ label, color, timer, isTimer }) => {
    const [time, settime] = useState(isTimer ? timer : -1);
    if (!label) {
        setTimeout(() => {
            settime((time || 0) + 1)
        }, 1000);
    }
    return (
        <div style={{ position: 'relative' }}>
            <div style={{ color: color, padding: '3px 4px', whiteSpace: 'nowrap', fontSize: '12px' }}>{isTimer ? secondsToTime(time || 0) : label}</div>
            <div style={{ backgroundColor: color, width: '100%', height: '24px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
        </div>
    )
}

const ItemTicket: React.FC<{ classes: any, item: ITicket, setTicketSelected: (param: ITicket) => void }> = ({ classes, setTicketSelected, item, item: { communicationchanneltype, lastmessage, displayname, imageurldef, ticketnum, firstconversationdate, lastconversationdate = null, countnewmessages, status } }) => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    return (
        (
            <div
                className={clsx(classes.containerItemTicket, { [classes.itemSelected]: (ticketSelected?.conversationid === item.conversationid) })}
                onClick={() => setTicketSelected(item)}
            >
                <Avatar src={imageurldef} />
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <GetIcon channelType={communicationchanneltype} />
                        <div className={classes.name}>{displayname}</div>
                    </div>
                    <div>
                        {lastmessage}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <LabelGo
                            label={ticketnum}
                            color={status === 'ASIGNADO' ? "#55BD84" : "#ffbf00"}
                        />
                        <LabelGo
                            isTimer={true}
                            timer={getSecondsUntelNow(convertLocalDate(firstconversationdate, true))}
                            color="#465a6ed9"
                        />
                        {(countnewmessages || 0) > 0 &&
                            <LabelGo
                                isTimer={true}
                                timer={getSecondsUntelNow(convertLocalDate(lastconversationdate, true))}
                                color="#FB5F5F"
                            />
                        }
                    </div>
                </div>
                {(countnewmessages || 0) > 0 &&
                    <div className={classes.containerNewMessages}>{(countnewmessages || 0)}</div>
                }
            </div>
        )
    )
}

export default ItemTicket;