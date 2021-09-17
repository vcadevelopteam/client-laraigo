import { apiUrls } from '../../common/constants';
import { ICloseTicketsParams, IReplyTicketParams } from '@types';
import { APIManager } from '../manager';
// import {  } from "common/helpers";


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

export function replyTicket({ conversationid, personid, communicationchannelid, ticketnum, personcommunicationchannel, interactiontext, interactiontype, communicationchannelsite, communicationchanneltype, postexternalid, commentexternalid, replyexternalid, isAnswered }: IReplyTicketParams) {
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
        newanswered: isAnswered,
    }
    return APIManager.post(apiUrls.REPLY_TICKET, { data: { data } }, true);
}