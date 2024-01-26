import { Dictionary } from '@types';
import { Call } from 'voximplant-websdk/Call/Call';
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

export interface IFile {
    type: string;
    url: string;
    id: string;
    error?: boolean;
}
export interface IMassiveCloseTicketsParams {
    listTickets: Dictionary[];
    motive: string;
    observation: string;
}

export interface IImportTicket {
    data: Dictionary[];
}

interface IMember {
    personid: number;
    phone: string;
    email?: string;
    firstname?: string | undefined;
    lastname?: string | undefined;
    parameters: Dictionary[];
}
export interface ISendHSM {
    hsmtemplateid: number;
    hsmtemplatename: number;
    communicationchannelid: number;
    platformtype: string;
    communicationchanneltype: string;
    listmembers: IMember[];
    type?: string;
    shippingreason: string;
}

export interface IReplyTicketParams extends ITicket {
    interactiontype: string;
    emailcocopy?: string;
    emailcopy?: string;
    interactiontext: string;
    validateUserOnTicket: boolean;
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
    typeinteraction?: string;
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
    usergroup: string;
    orgid: number;
    isanswered: boolean;
    userid: number;
    closedTicket?: boolean;
}

export interface IConnectAgentParams {
    isconnected: boolean;
    userid: number;
    motive?: string | null;
}

export interface IConnectAgentUIParams {
    connect: boolean;
    description?: string | null;
    motive?: string | null;
}

export interface ITransfer {
    number?: string,
    transfername?: string,
    transfernumber?: string,
    statusCall?: string,
    mute?: boolean,
    hold?: boolean,
    holddate?: string
}

export interface ICallGo {
    call: Call;
    type: string;
    method?: string;
    number: string;
    name: string;
    site?: string; //ticket
    accessURL?: string; //ticket
    initCallDate?: string; //ticket
    personAnswerCallDate?: string; //ticket
    identifier: string; 
    statusCall: string;
    onhold?: boolean;
    mute?: boolean;
    onholddate?: string;
    transfer?: ITransfer;
}

export interface ILibrary {
    documentlibraryid: number;
    type: string;
    link: string;
    favorite: boolean;
    title: string;
    category: string;
}