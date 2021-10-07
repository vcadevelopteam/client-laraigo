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
    replyexternalid?: string | null;
    personlastreplydate?: string | null;
    channelicon: string;
    coloricon: string;
    lastseendate?: string | null;
    finishdate?: string | null;
    isAnswered?: boolean;
}