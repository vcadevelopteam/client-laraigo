import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import { Dictionary, ITicket } from "@types";
import { GetIcon } from 'components'
import { count } from 'console';

const secondsToTime = (seconds: number): string => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds / 60) % 60);
    const ss = Math.floor(seconds % 60);
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

const getSecondsUntelNow = (date: Date): number => Math.floor((new Date().getTime() - date.getTime()) / 1000);

const convertLocalDate = (date: string | null, validateWithToday: boolean): Date => {
    if (!date) return new Date()
    const nn = new Date(date)
    const dateCleaned = new Date(nn.getTime() + (nn.getTimezoneOffset() * 60 * 1000 * -1));
    return validateWithToday ? (dateCleaned > new Date() ? new Date() : dateCleaned) : dateCleaned;
}

const LabelGo: React.FC<{ label?: string, color: string, isTimer?: boolean; timer?: number }> = ({ label, color, timer, isTimer }) => {
    const [time, settime] = useState(isTimer ? timer : -1);
    if (!label) {
        setTimeout(() => {
            settime((time || 0) + 1)
        }, 1000);
    }
    return (
        <div style={{ position: 'relative' }}>
            <div style={{ color: color, padding: '4px 6px', whiteSpace: 'nowrap', fontSize: '14px' }}>{isTimer ? secondsToTime(time || 0) : label}</div>
            <div style={{ backgroundColor: color, width: '100%', height: '28px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
        </div>
    )
}

const ItemTicket: React.FC<{ classes: any, item: ITicket }> = ({ classes, item: { communicationchanneltype, displayname, imageurldef, ticketnum, firstconversationdate, lastconversationdate = null, countnewmessages, status } }) => (
    <div className={classes.containerItemTicket}>
        <Avatar src={imageurldef} />
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <GetIcon channelType={communicationchanneltype}/>
                <div className={classes.name}>{displayname}</div>
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

export default ItemTicket;