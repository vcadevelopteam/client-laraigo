import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import { ITicket } from "@types";
import { GetIcon } from 'components'

const ChatPanel: React.FC<{ classes: any, ticket: ITicket }> = ({ classes, ticket, ticket: { communicationchanneltype, displayname, imageurldef, ticketnum, firstconversationdate, lastconversationdate = null, countnewmessages, status } }) => {
    console.log(ticket);
    
    return (
        <div className={classes.containerChat}>
            CJAT
        </div>
    )
}

export default ChatPanel;