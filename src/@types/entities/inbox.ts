import { ITicket } from './ticket'

export interface ICloseTicketsParams {
    conversationid: number;
    motive: string;
    observation: string;
    ticketnum: string;
    personcommunicationchannel: string;
    communicationchannelsite: string;
    communicationchanneltype: string;
    status: string;
    isAnswered: boolean;
}

export interface IReplyTicketParams extends ITicket {
    interactiontype: string;
    interactiontext: string;
    isAnswered: boolean;
}

export interface IReassignicketParams extends ITicket {
    newUserId: number;
    newUserGroup: string;
    observation: string;
    newConversation: boolean;
    wasanswered: boolean;
}


export interface INewMessageParams extends ITicket {
    typemessage: string;
    interactionid: number;
    newConversation: boolean;
    userid: number;
    usertype: string;
}