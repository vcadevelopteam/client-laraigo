import { apiUrls } from '../../common/constants';
import { ICloseTicketsParams, ISendHSM, IReassignicketParams, IReplyTicketParams, IConnectAgentUIParams, IMassiveCloseTicketsParams, Dictionary } from '@types';
import { APIManager } from '../manager';
// import {  } from "common/helpers";


export function updateUserSettings({ oldpassword,password,confirmpassword,lastname,firstname,image,languagesettings }: Dictionary) {
    const data = {
        oldpassword,password,confirmpassword,lastname,firstname,image,languagesettings
    }
    return APIManager.post(apiUrls.UPDATE_USER, { data: { data } }, true);
}

export function closeTicket({ conversationid, motive, observation, ticketnum, personcommunicationchannel, communicationchannelsite, communicationchanneltype, status, isAnswered }: ICloseTicketsParams) {
    const data = {
        p_conversationid: conversationid,
        p_obs: observation,
        p_motivo: motive,
        ticketnum: ticketnum,
        p_messagesourcekey1: personcommunicationchannel,
        communicationchannelsite: communicationchannelsite,
        communicationchanneltype: communicationchanneltype,
        status: status,
        isanswered: isAnswered,
    }
    return APIManager.post(apiUrls.CLOSE_TICKET, { data: { data } }, true);
}

export function massiveCloseTicket({ listTickets, motive, observation }: IMassiveCloseTicketsParams) {
    const data = {
        listTickets,
        p_status: 'CERRADO',
        p_obs: observation,
        p_motivo: motive,
        autoclosetime: 0,
        closeby: "MASSIVEUI"
    }
    return APIManager.post(apiUrls.MASSIVE_CLOSE_TICKET, { data: { data } }, true);
}

export function triggerBlock(parameters: Dictionary) {
    return APIManager.post(apiUrls.TRIGGERBLOCK, { data: parameters }, true);
}

export function sendHSM(data: ISendHSM) {
    return APIManager.post(apiUrls.SEND_HSM, { data: { data } }, true);
}

export function importTicket(data: FormData) {
    return APIManager.post(apiUrls.IMPORT_TICKET, { data }, true);
}

export function replyTicket(params: IReplyTicketParams | IReplyTicketParams[], isList: boolean = false) {
    if (params instanceof Array) {
        const data = params.map(item => {
            const { conversationid, validateUserOnTicket, personid, communicationchannelid, ticketnum, personcommunicationchannel, interactiontext, interactiontype, communicationchannelsite, communicationchanneltype, postexternalid, commentexternalid, replyexternalid, isAnswered } = item;

            return {
                p_conversationid: conversationid,
                p_personid: personid,
                p_communicationchannelid: communicationchannelid,
                p_messagesourcekey1: personcommunicationchannel,
                p_messagetext: interactiontext,
                p_type: interactiontype,
                communicationchannelsite: communicationchannelsite,
                communicationchanneltype: communicationchanneltype,
                postexternalid,
                commentexternalid,
                replyexternalid,
                ticketnum: ticketnum,
                validateUserOnTicket,
                newanswered: isAnswered,
            }
        })
        return APIManager.post(isList ? apiUrls.REPLY_LIST_TICKET : apiUrls.REPLY_TICKET, { data: { data } }, true);
    } else {
        const { conversationid, validateUserOnTicket, personid, communicationchannelid, ticketnum, personcommunicationchannel, interactiontext, interactiontype, communicationchannelsite, communicationchanneltype, postexternalid, commentexternalid, replyexternalid, isAnswered, emailcocopy, emailcopy, uuid }: IReplyTicketParams = params;
        const data = {
            p_conversationid: conversationid,
            p_personid: personid,
            p_communicationchannelid: communicationchannelid,
            p_messagesourcekey1: personcommunicationchannel,
            p_messagetext: interactiontext,
            p_type: interactiontype,
            communicationchannelsite: communicationchannelsite,
            communicationchanneltype: communicationchanneltype,
            postexternalid,
            commentexternalid,
            replyexternalid,
            ticketnum: ticketnum,
            uuid: uuid,
            validateUserOnTicket,
            newanswered: isAnswered,
            p_emailcopy: emailcopy,
            p_emailcocopy: emailcocopy,
        }
        return APIManager.post(isList ? apiUrls.REPLY_LIST_TICKET : apiUrls.REPLY_TICKET, { data: { data } }, true);
    }
}

export function reassignTicket(paramtmp: IReassignicketParams) {
    const { newUserId, newUserGroup, observation, wasanswered } = paramtmp
    const data = {
        ...paramtmp,
        comment: observation,
        newuserid: newUserId,
        usergroup: newUserGroup,
        newConversation: true,
        isanswered: wasanswered,
    }
    return APIManager.post(apiUrls.REASSIGN_TICKET, { data: { data } }, true);
}

export function connectUser(params: IConnectAgentUIParams) {
    const data = {
        ...params
    }
    return APIManager.post(apiUrls.CONNECT_INBOX, { data: { data } }, true);
}