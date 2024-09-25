import { IActionCall, IAgent, IInteraction, ITicket, ISendHSM, ICloseTicketsParams, IMassiveCloseTicketsParams, IReplyTicketParams, INewMessageParams, IReassignicketParams, IDeleteTicketParams, IPerson, Dictionary, ILibrary } from "@types";
import { CommonService, InboxService } from "network";
import actionTypes from "./actionTypes";
import { getUsersBySupervisor, getTicketsByFilter, getBlocksUserFromChatfow, getConfigurationVariables, getTickets as getTicketRequestBody, getInteractionsByConversation, getInfoPerson, getTicketsByPerson, getClassificationLevel2, getCommChannelLst, getMessageTemplateLst, getListQuickReply, getTicketsClosed as getTicketClosedRequestBody, getInappropriateWordsLst } from 'common/helpers';

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

export const checkPaymentPlan = (requestBody: Dictionary): IActionCall => ({
    callAPI: () => CommonService.reeschedulecall(requestBody),
    types: {
        loading: actionTypes.REESCHEDULE_CALL,
        success: actionTypes.REESCHEDULE_CALL_SUCCESS,
        failure: actionTypes.REESCHEDULE_CALL_FAILURE,
    },
    type: null,
});

export const filterTickets = (lastmessage: string, start_createticket: string, end_createticket: string, channels: string, conversationstatus: string, displayname: string, phone: string): IActionCall => ({
    callAPI: () => CommonService.main(getTicketsByFilter(
        lastmessage,
        start_createticket,
        end_createticket,
        channels,
        conversationstatus,
        displayname,
        phone
    )),
    types: {
        loading: actionTypes.FILTER_TICKETS,
        success: actionTypes.FILTER_TICKETS_SUCCESS,
        failure: actionTypes.FILTER_TICKETS_FAILURE,
    },
    type: null,
});

export const resetFilterTickets = (): IActionCall => ({ type: actionTypes.FILTER_TICKETS_RESET });

export const resetShowModal = (): IActionCall => ({ type: actionTypes.RESET_SHOW_MODAL_CLOSE });



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

export const getTicketsClosed = (userid: number | null): IActionCall => ({
    callAPI: () => CommonService.main(getTicketClosedRequestBody(userid)),
    types: {
        loading: actionTypes.GET_TICKETS_CLOSED,
        success: actionTypes.GET_TICKETS_CLOSED_SUCCESS,
        failure: actionTypes.GET_TICKETS_CLOSED_FAILURE,
    },
    type: null,
});

export const resetGetTicketsClosed = (): IActionCall => ({ type: actionTypes.GET_TICKETS_CLOSED_RESET });


export const getPerson = (personid: number, conversationid: number): IActionCall => ({
    callAPI: () => CommonService.main(getInfoPerson(personid, conversationid)),
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
        loading: actionTypes.GET_INTERACTIONS_EXTRA,
        success: actionTypes.GET_INTERACTIONS_EXTRA_SUCCESS,
        failure: actionTypes.GET_INTERACTIONS_EXTRA_FAILURE,
    },
    type: null,
});

export const resetGetInteractions = (): IActionCall => ({ type: actionTypes.GET_INTERACTIONS_EXTRA_RESET });

export const getDataTicket = (ticket: ITicket, lock: boolean): IActionCall => ({
    callAPI: () => CommonService.multiMain([
        getInteractionsByConversation(ticket.conversationid, lock, 0),
        getInfoPerson(ticket.personid, ticket.conversationid),
        getConfigurationVariables(ticket.communicationchannelid),
        getBlocksUserFromChatfow(ticket.communicationchannelid),
    ]),
    types: {
        loading: actionTypes.GET_DATA_TICKET,
        success: actionTypes.GET_DATA_TICKET_SUCCESS,
        failure: actionTypes.GET_DATA_TICKET_FAILURE,
    },
    type: null,
});

export const resetGetDataTicket = (): IActionCall => ({ type: actionTypes.GET_INTERACTIONS_EXTRA_RESET });

export const selectTicket = (ticket: ITicket | null): IActionCall => ({ type: actionTypes.SELECT_TICKET, payload: ticket });

export const updatePerson = (person: IPerson): IActionCall => ({ type: actionTypes.UPDATE_PERSON, payload: person });

export const resetSelectTicket = (): IActionCall => ({ type: actionTypes.RESET_SELECT_TICKET, payload: null });

export const selectAgent = (ticket: IAgent | null): IActionCall => ({ type: actionTypes.SELECT_AGENT, payload: ticket });


export const addTicket = (ticket: ITicket): IActionCall => ({ type: actionTypes.ADD_TICKET, payload: ticket });

export const updateInteractionByUUID = (data: { interactionid: number; uuid: string }): IActionCall => ({ type: actionTypes.UPDATE_INTERACTION_UUID, payload: data });

export const modifyTicket = (ticket: ITicket): IActionCall => ({ type: actionTypes.MODIFY_TICKET, payload: ticket });

export const changeStatusTicket = (conversationid: number, status: string): IActionCall => ({ type: actionTypes.CHANGE_STATUS_TICKET, payload: { conversationid, status } });

export const newMessageFromClient = (ticket: INewMessageParams): IActionCall => ({ type: actionTypes.NEW_MESSAGE_FROM_CLIENT, payload: ticket });

export const deleteTicket = (ticket: IDeleteTicketParams): IActionCall => ({ type: actionTypes.DELETE_TICKET, payload: ticket });

export const resetSelectAgent = (): IActionCall => ({ type: actionTypes.SELECT_AGENT, payload: null });

export const showInfoPanel = (): IActionCall => ({ type: actionTypes.SHOW_INFO_PANEL });

export const setUserType = (userType: "AGENT" | "SUPERVISOR"): IActionCall => ({ type: actionTypes.SET_USER_TYPE, payload: userType });

export const replyMessage = (interaction: IInteraction): IActionCall => ({ type: actionTypes.REPLY_MESSAGE, payload: interaction });

export const connectAgentUI = (payload: boolean): IActionCall => {
    localStorage.setItem("agentConnected", payload ? "1" : "")
    return { type: actionTypes.CONNECT_AGENT_UI, payload }
};

export const goToBottom = (payload: boolean | null): IActionCall => ({ type: actionTypes.GO_TO_BOTTOM, payload });

export const setAgentsToReassign = (payload: Dictionary[]): IActionCall => ({ type: actionTypes.SET_AGENTS_TO_REASSIGN, payload });

export const showGoToBottom = (payload: boolean | null): IActionCall => ({ type: actionTypes.SET_SHOW_GO_TO_BOTTOM, payload });

export const setIsFiltering = (payload: boolean | null): IActionCall => ({ type: actionTypes.SET_IS_FILTERING, payload });


export const sendHSM = (params: ISendHSM): IActionCall => ({
    callAPI: () => InboxService.sendHSM(params),
    types: {
        loading: actionTypes.SEND_HSM,
        success: actionTypes.SEND_HSM_SUCCESS,
        failure: actionTypes.SEND_HSM_FAILURE,
    },
    type: null,
});

export const resetSendHSM = (): IActionCall => ({ type: actionTypes.SEND_HSM_RESET });

export const getDataForOutbound = (): IActionCall => ({
    callAPI: async () => CommonService.multiMain([
        getCommChannelLst(),
        getMessageTemplateLst('')
    ]),
    types: {
        loading: actionTypes.GET_DATA_FOR_OUTBOUND,
        failure: actionTypes.GET_DATA_FOR_OUTBOUND_FAILURE,
        success: actionTypes.GET_DATA_FOR_OUTBOUND_SUCCESS,
    },
    type: null
})

export const resetGetDataForOutbount = () => ({ type: actionTypes.GET_DATA_FOR_OUTBOUND_RESET });



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




export const replyTicket = (params: IReplyTicketParams | IReplyTicketParams[], isList: boolean = false): IActionCall => ({
    callAPI: () => InboxService.replyTicket(params, isList),
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


export const massiveCloseTicket = (params: IMassiveCloseTicketsParams): IActionCall => ({
    callAPI: () => InboxService.massiveCloseTicket(params),
    types: {
        loading: actionTypes.MASSIVE_CLOSE_TICKET,
        success: actionTypes.MASSIVE_CLOSE_TICKET_SUCCESS,
        failure: actionTypes.MASSIVE_CLOSE_TICKET_FAILURE,
    },
    type: null,
});

export const resetMassiveCloseTicket = (): IActionCall => ({ type: actionTypes.MASSIVE_CLOSE_TICKET_RESET });



export const resetReassignTicket = (): IActionCall => ({ type: actionTypes.REASSIGN_TICKET_RESET });


export const importTicket = (data: any): IActionCall => ({
    callAPI: () => InboxService.importTicket(data),
    types: {
        loading: actionTypes.IMPORT_TICKET,
        success: actionTypes.IMPORT_TICKET_SUCCESS,
        failure: actionTypes.IMPORT_TICKET_FAILURE,
    },
    type: null,
});

export const resetImportTicket = (): IActionCall => ({ type: actionTypes.IMPORT_TICKET_RESET });


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


export const connectAgentAPI = (connect: boolean, description: string | null = null, motive: string | null = null): IActionCall => ({
    callAPI: () => InboxService.connectUser({ connect, description, motive }),
    types: {
        loading: actionTypes.CONNECT_AGENT_API,
        success: actionTypes.CONNECT_AGENT_API_SUCCESS,
        failure: actionTypes.CONNECT_AGENT_API_FAILURE,
    },
    type: null,
});

export const resetConnectAgentAPI = (): IActionCall => ({ type: actionTypes.CONNECT_AGENT_API_RESET });

export const cleanAlerts = (): IActionCall => ({ type: actionTypes.CLEAN_ALERT });

export const cleanInboxSupervisor = (): IActionCall => ({ type: actionTypes.RESET_INBOX_SUPERVISOR });

export const wsConnect = (payload: any): IActionCall => ({ type: actionTypes.WS_CONNECT, payload });

export const hideLogInteractions = (payload: boolean): IActionCall => ({ type: actionTypes.SHOW_LOG_INTERACTIONS, payload });

export const hideLogsOnTicket = (payload: boolean): IActionCall => ({ type: actionTypes.SET_HIDE_LOGS_ON_TICKET, payload });

export const emitEvent = (payload: any): IActionCall => ({ type: actionTypes.EMIT_EVENT, payload });

export const resetForcedDisconnection = (): IActionCall => ({ type: actionTypes.FORCEDDISCONECTION_RESET });

export const disconnectSocket = (): IActionCall => ({ type: actionTypes.WS_DISCONNECT });

export const newTicketCall = (payload: any): IActionCall => ({ type: actionTypes.NEW_TICKET_CALL, payload });

export const setDataUser = (payload: { holdingBySupervisor: "CANAL" | "GRUPO" | "TODO", botBySupervisor: "CANAL" | "GRUPO" | "TODO", userGroup: string, channels: string, role: string }): IActionCall => ({ type: actionTypes.SET_DATA_USER, payload });

export const updateClassificationPerson = (payload: boolean): IActionCall => ({ type: actionTypes.UPDATE_CLASSIFICATION_PERSON, payload });

export const setLibraryByUser = (payload: ILibrary[]): IActionCall => ({ type: actionTypes.SET_LIBRARY, payload });

export const triggerBlock = (parameters: Dictionary): IActionCall => ({
    callAPI: () => InboxService.triggerBlock(parameters),
    types: {
        loading: actionTypes.SEND_BLOCK,
        success: actionTypes.SEND_BLOCK_SUCCESS,
        failure: actionTypes.SEND_BLOCK_FAILURE,
    },
    type: null,
});


export const getQuickreplies = (): IActionCall => ({
    callAPI: () => CommonService.main(getListQuickReply()),
    types: {
        loading: actionTypes.GET_QUICKREPLIES,
        success: actionTypes.GET_QUICKREPLIES_SUCCESS,
        failure: actionTypes.GET_QUICKREPLIES_FAILURE,
    },
    type: null,
});

export const resetQuickreplies = (): IActionCall => ({ type: actionTypes.GET_QUICKREPLIES_RESET });

export const setSearchTerm = (payload: any): IActionCall => ({ type: actionTypes.SET_SEARCHTERM, payload });

export const setPinnedComments = (payload: any): IActionCall => ({ type: actionTypes.SET_PINNEDCOMMENTS, payload });

export const getInnapropiateWordTicketLst = (): IActionCall => ({
    callAPI: () => CommonService.main(getInappropriateWordsLst()),
    types: {
        loading: actionTypes.GET_INNAPROPIATEWORDS,
        success: actionTypes.GET_INNAPROPIATEWORDS_SUCCESS,
        failure: actionTypes.GET_INNAPROPIATEWORDS_FAILURE,
    },
    type: null,
});

export const resetInnapropiateWordTicketLst = (): IActionCall => ({ type: actionTypes.GET_INNAPROPIATEWORDS_RESET });