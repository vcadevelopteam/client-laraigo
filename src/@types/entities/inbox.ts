import { Dictionary } from '@types';
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

export interface IMassiveCloseTicketsParams {
    listTickets: Dictionary[];
    motive: string;
    observation: string;
}

interface IMember {
    phone: string;
    email?: string;
    firstname?: string | undefined;
    lastname?: string | undefined;
    parameters: Dictionary[];
}
export interface ISendHSM {
    hsmtemplateid: number;
    communicationchannelid: number;
    platformtype: string;
    communicationchanneltype: string;
    listmembers: IMember[];
    type?: string;
}

export interface IReplyTicketParams extends ITicket {
    interactiontype: string;
    interactiontext: string;
    ticketWasAnswered?: boolean
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
    ticketWasAnswered: boolean
}

export interface IDeleteTicketParams {
    conversationid: number;
    ticketnum: string;
    status: string;
    orgid: number;
    isanswered: boolean;
    userid: number;
}

export interface IConnectAgentParams {
    isconnected: boolean;
    userid: number;
}

export interface IConnectAgentUIParams {
    connect: boolean;
    description?: string | null;
    motive?: string | null;
}