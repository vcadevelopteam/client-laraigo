import { IListStatePaginated, ITicket, IInteraction, IPerson, IAgent } from "@types";
import { createReducer, initialListPaginatedState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IBaseState {
    loading: boolean;
    code?: string;
    error: boolean;
    message?: string;
    data?: IPerson | null;
}

const initialPerson: IBaseState = {
    loading: false,
    code: undefined,
    error: false,
    message: undefined,
}

export interface IState {
    ticketList: IListStatePaginated<ITicket>;
    previewTicketList: IListStatePaginated<ITicket>;
    interactionList: IListStatePaginated<IInteraction>;
    ticketSelected: ITicket | null;
    agentSelected: IAgent | null;
    person: IBaseState;
    agentList: IListStatePaginated<IAgent>;
    showInfoPanel: boolean;
}

export const initialState: IState = {
    agentList: initialListPaginatedState,
    ticketList: initialListPaginatedState,
    previewTicketList: initialListPaginatedState,
    interactionList: initialListPaginatedState,
    person: initialPerson,
    ticketSelected: null,
    agentSelected: null,
    showInfoPanel: false
};

export default createReducer<IState>(initialState, {
    [actionTypes.GET_TICKETS]: caseFunctions.getTickets,
    [actionTypes.GET_TICKETS_SUCCESS]: caseFunctions.getTicketsSuccess,
    [actionTypes.GET_TICKETS_FAILURE]: caseFunctions.getTicketsFailure,
    [actionTypes.GET_TICKETS_RESET]: caseFunctions.getTicketsReset,

    [actionTypes.GET_AGENTS]: caseFunctions.getAgents,
    [actionTypes.GET_AGENTS_SUCCESS]: caseFunctions.getAgentsSuccess,
    [actionTypes.GET_AGENTS_FAILURE]: caseFunctions.getAgentsFailure,
    [actionTypes.GET_AGENTS_RESET]: caseFunctions.getAgentsReset,

    [actionTypes.GET_INTERACTIONS]: caseFunctions.getInteractions,
    [actionTypes.GET_INTERACTIONS_SUCCESS]: caseFunctions.getInteractionsSuccess,
    [actionTypes.GET_INTERACTIONS_FAILURE]: caseFunctions.getInteractionsFailure,
    [actionTypes.GET_INTERACTIONS_RESET]: caseFunctions.getInteractionsReset,
    
    [actionTypes.GET_TICKETS_BY_PERSON]: caseFunctions.getTicketsByPerson,
    [actionTypes.GET_TICKETS_BY_PERSON_SUCCESS]: caseFunctions.getTicketsByPersonSuccess,
    [actionTypes.GET_TICKETS_BY_PERSON_FAILURE]: caseFunctions.getTicketsByPersonFailure,
    [actionTypes.GET_TICKETS_BY_PERSON_RESET]: caseFunctions.getTicketsByPersonReset,

    [actionTypes.GET_PERSON]: caseFunctions.getPerson,
    [actionTypes.GET_PERSON_SUCCESS]: caseFunctions.getPersonSuccess,
    [actionTypes.GET_PERSON_FAILURE]: caseFunctions.getPersonFailure,
    [actionTypes.GET_PERSON_RESET]: caseFunctions.getPersonReset,

    [actionTypes.GET_DATA_TICKET]: caseFunctions.getDataTicket,
    [actionTypes.GET_DATA_TICKET_SUCCESS]: caseFunctions.getDataTicketSuccess,
    [actionTypes.GET_DATA_TICKET_FAILURE]: caseFunctions.getDataTicketFailure,
    [actionTypes.GET_DATA_TICKET_RESET]: caseFunctions.getDataTicketReset,

    [actionTypes.SELECT_TICKET]: caseFunctions.selectTicket,
    [actionTypes.RESET_SELECT_TICKET]: caseFunctions.resetSelectTicket,
    [actionTypes.SELECT_AGENT]: caseFunctions.selectAgent,
    [actionTypes.RESET_SELECT_AGENT]: caseFunctions.resetSelectAgent,
    
    [actionTypes.SHOW_INFO_PANEL]: caseFunctions.showInfoPanel,

    
});
