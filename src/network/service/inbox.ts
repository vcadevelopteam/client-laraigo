import { apiUrls } from '../../common/constants';
import { ICloseTicketsParams } from '@types';
import { APIManager, ExternalRequestManager } from '../manager';
import { removeAuthorizationToken } from "common/helpers";


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