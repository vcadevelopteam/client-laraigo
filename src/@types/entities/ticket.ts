import { Call } from 'voximplant-websdk/Call/Call';

export interface ITicket {
    conversationid: number;
    ticketnum: string;
    firstconversationdate: string;
    lastreplyuser: string;
    lastconversationdate?: string | null;
    status: string;
    lastmessage: string;
    personcommunicationchannel: string;
    displayname: string;
    personid: number;
    communicationchannelid: number;
    communicationchannelsite: string;
    communicationchanneltype: string;
    imageurldef: string;
    countnewmessages: number;
    postexternalid?: string | null;
    commentexternalid?: string | null;
    usergroup?: string | null;
    replyexternalid?: string | null;
    personlastreplydate?: string | null;
    coloricon: string;
    lastseendate?: string | null;
    finishdate?: string | null;
    origin?: string | null;
    isAnswered?: boolean;
    call?: Call | null;
    callanswereddate?: string | null;
    // channelicon: string;
}