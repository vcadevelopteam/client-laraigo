import { IActionCall, IAgent, IInteraction, ITicket, ICloseTicketsParams, IReplyTicketParams, INewMessageParams, IReassignicketParams, IDeleteTicketParams } from "@types";
import { CommonService, InboxService } from "network";
import actionTypes from "./actionTypes";
import { getUsersBySupervisor, getConfigurationVariables, getTickets as getTicketRequestBody, getInteractionsByConversation, getInfoPerson, getTicketsByPerson, getClassificationLevel2 } from 'common/helpers';

export const getAgents = (): IActionCall => ({
    callAPI: () => CommonService.main(getUsersBySupervisor()),
    types: {
        loading: actionTypes.GET_AGENTS,
        success: actionTypes.GET_AGENTS_SUCCESS,
        failure: actionTypes.GET_AGENTS_FAILURE,
    },
    type: null,
});

export const resetGetAgents = (): IActionCall => ({ type: actionTypes.GET_AGENTS_RESET });


export const getTickets = (userid: number | null): IActionCall => ({
    callAPI: () => CommonService.main(getTicketRequestBody(userid)),
    types: {
        loading: actionTypes.GET_TICKETS,
        success: actionTypes.GET_TICKETS_SUCCESS,
        failure: actionTypes.GET_TICKETS_FAILURE,
    },
    type: null,
});

export const resetGetTickets = (): IActionCall => ({ type: actionTypes.GET_TICKETS_RESET });


export const getPerson = (personid: number): IActionCall => ({
    callAPI: () => CommonService.main(getInfoPerson(personid)),
    types: {
        loading: actionTypes.GET_PERSON,
        success: actionTypes.GET_PERSON_SUCCESS,
        failure: actionTypes.GET_PERSON_FAILURE,
    },
    type: null,
});

export const resetGetPerson = (): IActionCall => ({ type: actionTypes.GET_PERSON_RESET });

export const getTicketsPerson = (personid: number, conversationid: number): IActionCall => ({
    callAPI: () => CommonService.main(getTicketsByPerson(personid, conversationid)),
    types: {
        loading: actionTypes.GET_TICKETS_BY_PERSON,
        success: actionTypes.GET_TICKETS_BY_PERSON_SUCCESS,
        failure: actionTypes.GET_TICKETS_BY_PERSON_FAILURE,
    },
    type: null,
});

export const resetGetTicketsPerson = (): IActionCall => ({ type: actionTypes.GET_TICKETS_BY_PERSON_RESET });

export const getInteractions = (conversationid: number, lock: boolean, conversationold: number): IActionCall => ({
    callAPI: () => CommonService.main(getInteractionsByConversation(conversationid, lock, conversationold)),
    types: {
        loading: actionTypes.GET_INTERACTIONS,
        success: actionTypes.GET_INTERACTIONS_SUCCESS,
        failure: actionTypes.GET_INTERACTIONS_FAILURE,
    },
    type: null,
});

export const resetGetInteractions = (): IActionCall => ({ type: actionTypes.GET_INTERACTIONS_RESET });

export const getDataTicket = (ticket: ITicket): IActionCall => ({
    callAPI: () => CommonService.multiMain([
        getInteractionsByConversation(ticket.conversationid, false, 0),
        getInfoPerson(ticket.personid),
        getConfigurationVariables(ticket.communicationchannelid)
    ]),
    types: {
        loading: actionTypes.GET_DATA_TICKET,
        success: actionTypes.GET_DATA_TICKET_SUCCESS,
        failure: actionTypes.GET_DATA_TICKET_FAILURE,
    },
    type: null,
});

export const resetGetDataTicket = (): IActionCall => ({ type: actionTypes.GET_INTERACTIONS_RESET });

export const selectTicket = (ticket: ITicket): IActionCall => ({ type: actionTypes.SELECT_TICKET, payload: ticket });

export const resetSelectTicket = (): IActionCall => ({ type: actionTypes.SELECT_TICKET, payload: null });

export const selectAgent = (ticket: IAgent): IActionCall => ({ type: actionTypes.SELECT_AGENT, payload: ticket });


export const addTicket = (ticket: ITicket): IActionCall => ({ type: actionTypes.ADD_TICKET, payload: ticket });

export const modifyTicket = (ticket: ITicket): IActionCall => ({ type: actionTypes.MODIFY_TICKET, payload: ticket });

export const newMessageFromClient = (ticket: INewMessageParams): IActionCall => ({ type: actionTypes.NEW_MESSAGE_FROM_CLIENT, payload: ticket });

export const deleteTicket = (ticket: IDeleteTicketParams): IActionCall => ({ type: actionTypes.DELETE_TICKET, payload: ticket });

export const resetSelectAgent = (): IActionCall => ({ type: actionTypes.SELECT_AGENT, payload: null });

export const showInfoPanel = (): IActionCall => ({ type: actionTypes.SHOW_INFO_PANEL });

export const setUserType = (userType: "AGENT" | "SUPERVISOR"): IActionCall => ({ type: actionTypes.SET_USER_TYPE, payload: userType});

export const replyMessage = (interaction: IInteraction): IActionCall => ({ type: actionTypes.REPLY_MESSAGE, payload: interaction });

export const closeTicket = (params: ICloseTicketsParams): IActionCall => ({
    callAPI: () => InboxService.closeTicket(params),
    types: {
        loading: actionTypes.CLOSE_TICKET,
        success: actionTypes.CLOSE_TICKET_SUCCESS,
        failure: actionTypes.CLOSE_TICKET_FAILURE,
    },
    type: null,
});

export const resetCloseTicket = (): IActionCall => ({ type: actionTypes.CLOSE_TICKET_RESET });

export const replyTicket = (params: IReplyTicketParams): IActionCall => ({
    callAPI: () => InboxService.replyTicket(params),
    types: {
        loading: actionTypes.REPLY_TICKET,
        success: actionTypes.REPLY_TICKET_SUCCESS,
        failure: actionTypes.REPLY_TICKET_FAILURE,
    },
    type: null,
});

export const resetreplyTicket = (): IActionCall => ({ type: actionTypes.REPLY_TICKET_RESET });

export const reassignTicket = (params: IReassignicketParams): IActionCall => ({
    callAPI: () => InboxService.reassignTicket(params),
    types: {
        loading: actionTypes.REASSIGN_TICKET,
        success: actionTypes.REASSIGN_TICKET_SUCCESS,
        failure: actionTypes.REASSIGN_TICKET_FAILURE,
    },
    type: null,
});

export const resetReassignTicket = (): IActionCall => ({ type: actionTypes.REASSIGN_TICKET_RESET });


export const getTipificationLevel2 = (classificationid: number): IActionCall => ({
    callAPI: () => CommonService.main(getClassificationLevel2("TIPIFICACION", classificationid)),
    types: {
        loading: actionTypes.GET_TIPIFICATION_LEVEL_2,
        success: actionTypes.GET_TIPIFICATION_LEVEL_2_SUCCESS,
        failure: actionTypes.GET_TIPIFICATION_LEVEL_2_FAILURE,
    },
    type: null,
});

export const resetGetTipificationLevel2 = (): IActionCall => ({ type: actionTypes.GET_TIPIFICATION_LEVEL_2_RESET });

export const getTipificationLevel3 = (classificationid: number): IActionCall => ({
    callAPI: () => CommonService.main(getClassificationLevel2("TIPIFICACION", classificationid)),
    types: {
        loading: actionTypes.GET_TIPIFICATION_LEVEL_3,
        success: actionTypes.GET_TIPIFICATION_LEVEL_3_SUCCESS,
        failure: actionTypes.GET_TIPIFICATION_LEVEL_3_FAILURE,
    },
    type: null,
});

export const resetGetTipificationLevel3 = (): IActionCall => ({ type: actionTypes.GET_TIPIFICATION_LEVEL_3_RESET });