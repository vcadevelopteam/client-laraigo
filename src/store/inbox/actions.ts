import { IActionCall, IAgent, ITicket } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";
import { getUsersBySupervisor, getTickets as getTicketRequestBody, getInteractionsByConversation, getInfoPerson, getTicketsByPerson } from 'common/helpers';

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
    callAPI: () => CommonService.multiMain([getInteractionsByConversation(ticket.conversationid, false, 0), getInfoPerson(ticket.personid)]),
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

export const resetSelectAgent = (): IActionCall => ({ type: actionTypes.SELECT_AGENT, payload: null });

export const showInfoPanel = (): IActionCall => ({ type: actionTypes.SHOW_INFO_PANEL });