import { IListStatePaginated, ITicket, IGroupInteraction, IPerson, IAgent, Dictionary, IObjectState } from "@types";
import { createReducer, initialListPaginatedState, initialObjectState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IBaseState {
    loading: boolean;
    code?: string;
    error: boolean;
    message?: string;
}

export interface IPesonState extends IBaseState {
    data?: IPerson | null;
}

const initialTransaction: IBaseState = {
    loading: false,
    code: undefined,
    error: false,
    message: undefined,
}

export interface IState {
    ticketList: IListStatePaginated<ITicket>;
    ticketFilteredList: IListStatePaginated<ITicket>;
    previewTicketList: IListStatePaginated<ITicket>;
    interactionList: IListStatePaginated<IGroupInteraction>;
    interactionExtraList: IListStatePaginated<IGroupInteraction>;
    configurationVariables: IListStatePaginated<Dictionary>;
    richResponseList: IListStatePaginated<Dictionary>;
    tipificationsLevel2: IListStatePaginated<Dictionary>;
    tipificationsLevel3: IListStatePaginated<Dictionary>;
    ticketSelected: ITicket | null;
    agentSelected: IAgent | null;
    person: IPesonState;
    agentList: IListStatePaginated<IAgent>;
    triggerCloseTicket: IBaseState;
    triggerSendHSM: IBaseState;
    triggerMassiveCloseTicket: IBaseState;
    triggerReplyTicket: IBaseState;
    triggerReassignTicket: IBaseState;
    showInfoPanel: boolean;
    userType: "SUPERVISOR" | "AGENT" | null;
    wsConnected: boolean;
    userConnected: boolean;
    aNewTicket: boolean | null;
    aNewMessage: boolean | null;
    isOnBottom: boolean | null;
    showGoToBottom: boolean | null;
    triggerNewMessageClient: boolean;
    triggerConnectAgentGo: IBaseState;
    isFiltering: boolean;
    outboundData: IObjectState<Dictionary>;
}

export const initialState: IState = {
    agentList: initialListPaginatedState,
    ticketFilteredList: initialListPaginatedState,
    ticketList: initialListPaginatedState,
    previewTicketList: initialListPaginatedState,
    interactionList: initialListPaginatedState,
    richResponseList: initialListPaginatedState,
    interactionExtraList: initialListPaginatedState,
    configurationVariables: initialListPaginatedState,
    tipificationsLevel2: initialListPaginatedState,
    tipificationsLevel3: initialListPaginatedState,
    person: initialTransaction,
    triggerCloseTicket: initialTransaction,
    triggerSendHSM: initialTransaction,
    triggerMassiveCloseTicket: initialTransaction,
    triggerReplyTicket: initialTransaction,
    triggerConnectAgentGo: initialTransaction,
    triggerReassignTicket: initialTransaction,
    ticketSelected: null,
    agentSelected: null,
    aNewTicket: null,
    aNewMessage: null,
    showInfoPanel: false,
    userType: null,
    wsConnected: false,
    userConnected: !!localStorage.getItem("agentConnected"),
    isOnBottom: null,
    showGoToBottom: false,
    triggerNewMessageClient: false,
    isFiltering: false,
    outboundData: initialObjectState
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


    [actionTypes.FILTER_TICKETS]: caseFunctions.filterTickets,
    [actionTypes.FILTER_TICKETS_SUCCESS]: caseFunctions.filterTicketsSuccess,
    [actionTypes.FILTER_TICKETS_FAILURE]: caseFunctions.filterTicketsFailure,
    [actionTypes.FILTER_TICKETS_RESET]: caseFunctions.filterTicketsReset,


    [actionTypes.GET_INTERACTIONS_EXTRA]: caseFunctions.getInteractionsExtra,
    [actionTypes.GET_INTERACTIONS_EXTRA_SUCCESS]: caseFunctions.getInteractionsExtraSuccess,
    [actionTypes.GET_INTERACTIONS_EXTRA_FAILURE]: caseFunctions.getInteractionsExtraFailure,
    [actionTypes.GET_INTERACTIONS_EXTRA_RESET]: caseFunctions.getInteractionsExtraReset,
    
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
    //[actionTypes.REPLY_MESSAGE]: caseFunctions.addMessage,
    [actionTypes.SET_USER_TYPE]: caseFunctions.setUserType,
    [actionTypes.ADD_TICKET]: caseFunctions.addTicket,
    [actionTypes.MODIFY_TICKET]: caseFunctions.modifyTicket,
    [actionTypes.NEW_MESSAGE_FROM_CLIENT]: caseFunctions.newMessageFromClient,
    [actionTypes.DELETE_TICKET]: caseFunctions.deleteTicket,
    [actionTypes.PERSON_SAW_CHAT]: caseFunctions.personSawChat,
    [actionTypes.CONNECT_AGENT_WS]: caseFunctions.connectAgentWS,
    [actionTypes.CONNECT_AGENT_UI]: caseFunctions.connectAgentUI,

    [actionTypes.CLOSE_TICKET]: caseFunctions.closeTicket,
    [actionTypes.CLOSE_TICKET_SUCCESS]: caseFunctions.closeTicketSuccess,
    [actionTypes.CLOSE_TICKET_FAILURE]: caseFunctions.closeTicketFailure,
    [actionTypes.CLOSE_TICKET_RESET]: caseFunctions.closeTicketReset,
    
    
    
    [actionTypes.MASSIVE_CLOSE_TICKET]: caseFunctions.massiveCloseTicket,
    [actionTypes.MASSIVE_CLOSE_TICKET_SUCCESS]: caseFunctions.massiveCloseTicketSuccess,
    [actionTypes.MASSIVE_CLOSE_TICKET_FAILURE]: caseFunctions.massiveCloseTicketFailure,
    [actionTypes.MASSIVE_CLOSE_TICKET_RESET]: caseFunctions.massiveCloseTicketReset,



    [actionTypes.REPLY_TICKET]: caseFunctions.replyTicket,
    [actionTypes.REPLY_TICKET_SUCCESS]: caseFunctions.replyTicketSuccess,
    [actionTypes.REPLY_TICKET_FAILURE]: caseFunctions.replyTicketFailure,
    [actionTypes.REPLY_TICKET_RESET]: caseFunctions.replyTicketReset,


    [actionTypes.SEND_HSM]: caseFunctions.sendHSM,
    [actionTypes.SEND_HSM_SUCCESS]: caseFunctions.sendHSMSuccess,
    [actionTypes.SEND_HSM_FAILURE]: caseFunctions.sendHSMFailure,
    [actionTypes.SEND_HSM_RESET]: caseFunctions.sendHSMReset,

    

    [actionTypes.GET_DATA_FOR_OUTBOUND]: caseFunctions.getDataForOutbound,
    [actionTypes.GET_DATA_FOR_OUTBOUND_SUCCESS]: caseFunctions.getDataForOutboundSuccess,
    [actionTypes.GET_DATA_FOR_OUTBOUND_FAILURE]: caseFunctions.getDataForOutboundFailure,
    [actionTypes.GET_DATA_FOR_OUTBOUND_RESET]: caseFunctions.getDataForOutboundReset,


    [actionTypes.REASSIGN_TICKET]: caseFunctions.reassignTicket,
    [actionTypes.REASSIGN_TICKET_SUCCESS]: caseFunctions.reassignTicketSuccess,
    [actionTypes.REASSIGN_TICKET_FAILURE]: caseFunctions.reassignTicketFailure,
    [actionTypes.REASSIGN_TICKET_RESET]: caseFunctions.reassignTicketReset,


    [actionTypes.GET_TIPIFICATION_LEVEL_2]: caseFunctions.getTipificationLevel2,
    [actionTypes.GET_TIPIFICATION_LEVEL_2_SUCCESS]: caseFunctions.getTipificationLevel2Success,
    [actionTypes.GET_TIPIFICATION_LEVEL_2_FAILURE]: caseFunctions.getTipificationLevel2Failure,
    [actionTypes.GET_TIPIFICATION_LEVEL_2_RESET]: caseFunctions.getTipificationLevel2Reset,

    [actionTypes.CONNECT_AGENT_API]: caseFunctions.connectAgentUItmp,
    [actionTypes.CONNECT_AGENT_API_SUCCESS]: caseFunctions.connectAgentUItmpSuccess,
    [actionTypes.CONNECT_AGENT_API_FAILURE]: caseFunctions.connectAgentUItmpFailure,
    [actionTypes.CONNECT_AGENT_API_RESET]: caseFunctions.connectAgentUItmpReset,

    [actionTypes.GET_TIPIFICATION_LEVEL_3]: caseFunctions.getTipificationLevel3,
    [actionTypes.GET_TIPIFICATION_LEVEL_3_SUCCESS]: caseFunctions.getTipificationLevel3Success,
    [actionTypes.GET_TIPIFICATION_LEVEL_3_FAILURE]: caseFunctions.getTipificationLevel3Failure,
    [actionTypes.GET_TIPIFICATION_LEVEL_3_RESET]: caseFunctions.getTipificationLevel3Reset,
    [actionTypes.WS_CONNECTED]: caseFunctions.wsConnect,
    [actionTypes.GO_TO_BOTTOM]: caseFunctions.goToBottom,
    [actionTypes.SET_SHOW_GO_TO_BOTTOM]: caseFunctions.showGoToBottom,
    [actionTypes.SET_IS_FILTERING]: caseFunctions.setIsFiltering,
    [actionTypes.UPDATE_PERSON]: caseFunctions.updatePerson,
    [actionTypes.CLEAN_ALERT]: caseFunctions.cleanAlerts,
});
