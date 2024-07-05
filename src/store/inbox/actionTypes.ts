const actionType = {
    SEND_BLOCK: 'inbox/SEND_BLOCK',
    SEND_BLOCK_FAILURE: 'inbox/SEND_BLOCK_FAILURE',
    SEND_BLOCK_SUCCESS: 'inbox/SEND_BLOCK_SUCCESS',
    SEND_BLOCK_RESET: 'inbox/SEND_BLOCK_RESET',

    GET_AGENTS: 'inbox/GET_AGENTS',
    GET_AGENTS_FAILURE: 'inbox/GET_AGENTS_FAILURE',
    GET_AGENTS_SUCCESS: 'inbox/GET_AGENTS_SUCCESS',
    GET_AGENTS_RESET: 'inbox/GET_AGENTS_RESET',

    GET_TICKETS: 'inbox/GET_TICKETS',
    GET_TICKETS_FAILURE: 'inbox/GET_TICKETS_FAILURE',
    GET_TICKETS_SUCCESS: 'inbox/GET_TICKETS_SUCCESS',
    GET_TICKETS_RESET: 'inbox/GET_TICKETS_RESET',

    GET_INTERACTIONS_EXTRA: 'inbox/GET_INTERACTIONS_EXTRA',
    GET_INTERACTIONS_EXTRA_FAILURE: 'inbox/GET_INTERACTIONS_EXTRA_FAILURE',
    GET_INTERACTIONS_EXTRA_SUCCESS: 'inbox/GET_INTERACTIONS_EXTRA_SUCCESS',
    GET_INTERACTIONS_EXTRA_RESET: 'inbox/GET_INTERACTIONS_EXTRA_RESET',

    GET_PERSON: 'inbox/GET_PERSON',
    GET_PERSON_FAILURE: 'inbox/GET_PERSON_FAILURE',
    GET_PERSON_SUCCESS: 'inbox/GET_PERSON_SUCCESS',
    GET_PERSON_RESET: 'inbox/GET_PERSON_RESET',

    GET_TICKETS_BY_PERSON: 'inbox/GET_TICKETS_BY_PERSON',
    GET_TICKETS_BY_PERSON_FAILURE: 'inbox/GET_TICKETS_BY_PERSON_FAILURE',
    GET_TICKETS_BY_PERSON_SUCCESS: 'inbox/GET_TICKETS_BY_PERSON_SUCCESS',
    GET_TICKETS_BY_PERSON_RESET: 'inbox/GET_TICKETS_BY_PERSON_RESET',
    
    UPD_QUICKREPLIES: 'inbox/UPD_QUICKREPLIES',

    GET_QUICKREPLIES: 'inbox/GET_QUICKREPLIES',
    GET_QUICKREPLIES_FAILURE: 'inbox/GET_QUICKREPLIES_FAILURE',
    GET_QUICKREPLIES_SUCCESS: 'inbox/GET_QUICKREPLIES_SUCCESS',
    GET_QUICKREPLIES_RESET: 'inbox/GET_QUICKREPLIES_RESET',

    GET_TIPIFICATION_LEVEL_2: 'inbox/GET_TIPIFICATION_LEVEL_2',
    GET_TIPIFICATION_LEVEL_2_FAILURE: 'inbox/GET_TIPIFICATION_LEVEL_2_FAILURE',
    GET_TIPIFICATION_LEVEL_2_SUCCESS: 'inbox/GET_TIPIFICATION_LEVEL_2_SUCCESS',
    GET_TIPIFICATION_LEVEL_2_RESET: 'inbox/GET_TIPIFICATION_LEVEL_2_RESET',

    GET_TIPIFICATION_LEVEL_3: 'inbox/GET_TIPIFICATION_LEVEL_3',
    GET_TIPIFICATION_LEVEL_3_FAILURE: 'inbox/GET_TIPIFICATION_LEVEL_3_FAILURE',
    GET_TIPIFICATION_LEVEL_3_SUCCESS: 'inbox/GET_TIPIFICATION_LEVEL_3_SUCCESS',
    GET_TIPIFICATION_LEVEL_3_RESET: 'inbox/GET_TIPIFICATION_LEVEL_3_RESET',
    REESCHEDULE_CALL: 'inbox/REESCHEDULE_CALL',
    REESCHEDULE_CALL_SUCCESS: 'inbox/REESCHEDULE_CALL_SUCCESS',
    REESCHEDULE_CALL_FAILURE: 'inbox/REESCHEDULE_CALL_FAILURE',

    CLOSE_TICKET: 'inbox/CLOSE_TICKET',
    CLOSE_TICKET_FAILURE: 'inbox/CLOSE_TICKET_FAILURE',
    CLOSE_TICKET_SUCCESS: 'inbox/CLOSE_TICKET_SUCCESS',
    CLOSE_TICKET_RESET: 'inbox/CLOSE_TICKET_RESET',


    FILTER_TICKETS: 'inbox/FILTER_TICKETS',
    FILTER_TICKETS_FAILURE: 'inbox/FILTER_TICKETS_FAILURE',
    FILTER_TICKETS_SUCCESS: 'inbox/FILTER_TICKETS_SUCCESS',
    FILTER_TICKETS_RESET: 'inbox/FILTER_TICKETS_RESET',



    MASSIVE_CLOSE_TICKET: 'inbox/MASSIVE_CLOSE_TICKET',
    MASSIVE_CLOSE_TICKET_FAILURE: 'inbox/MASSIVE_CLOSE_TICKET_FAILURE',
    MASSIVE_CLOSE_TICKET_SUCCESS: 'inbox/MASSIVE_CLOSE_TICKET_SUCCESS',
    MASSIVE_CLOSE_TICKET_RESET: 'inbox/MASSIVE_CLOSE_TICKET_RESET',
    
    REPLY_TICKET: 'inbox/REPLY_TICKET',
    REPLY_TICKET_FAILURE: 'inbox/REPLY_TICKET_FAILURE',
    REPLY_TICKET_SUCCESS: 'inbox/REPLY_TICKET_SUCCESS',
    REPLY_TICKET_RESET: 'inbox/REPLY_TICKET_RESET',

    REASSIGN_TICKET: 'inbox/REASSIGN_TICKET',
    REASSIGN_TICKET_FAILURE: 'inbox/REASSIGN_TICKET_FAILURE',
    REASSIGN_TICKET_SUCCESS: 'inbox/REASSIGN_TICKET_SUCCESS',
    REASSIGN_TICKET_RESET: 'inbox/REASSIGN_TICKET_RESET',
    
    GET_DATA_TICKET: 'inbox/GET_DATA_TICKET',
    GET_DATA_TICKET_FAILURE: 'inbox/GET_DATA_TICKET_FAILURE',
    GET_DATA_TICKET_SUCCESS: 'inbox/GET_DATA_TICKET_SUCCESS',
    GET_DATA_TICKET_RESET: 'inbox/GET_DATA_TICKET_RESET',

    CONNECT_AGENT_API: 'inbox/CONNECT_AGENT_API',
    CONNECT_AGENT_API_FAILURE: 'inbox/CONNECT_AGENT_API_FAILURE',
    CONNECT_AGENT_API_SUCCESS: 'inbox/CONNECT_AGENT_API_SUCCESS',
    CONNECT_AGENT_API_RESET: 'inbox/CONNECT_AGENT_API_RESET',

    SEND_HSM: 'inbox/SEND_HSM',
    SEND_HSM_FAILURE: 'inbox/SEND_HSM_FAILURE',
    SEND_HSM_SUCCESS: 'inbox/SEND_HSM_SUCCESS',
    SEND_HSM_RESET: 'inbox/SEND_HSM_RESET',

    IMPORT_TICKET: 'inbox/IMPORT_TICKET',
    IMPORT_TICKET_FAILURE: 'inbox/IMPORT_TICKET_FAILURE',
    IMPORT_TICKET_SUCCESS: 'inbox/IMPORT_TICKET_SUCCESS',
    RESET_SHOW_MODAL_CLOSE: 'inbox/RESET_SHOW_MODAL_CLOSE',
    IMPORT_TICKET_RESET: 'inbox/IMPORT_TICKET_RESET',

    GET_DATA_FOR_OUTBOUND: 'main/GET_DATA_FOR_OUTBOUND',
    GET_DATA_FOR_OUTBOUND_FAILURE: 'main/GET_DATA_FOR_OUTBOUND_FAILURE',
    GET_DATA_FOR_OUTBOUND_SUCCESS: 'main/GET_DATA_FOR_OUTBOUND_SUCCESS',
    GET_DATA_FOR_OUTBOUND_RESET: 'main/GET_DATA_FOR_OUTBOUND_RESET',
    UPDATE_CLASSIFICATION_PERSON: 'main/UPDATE_CLASSIFICATION_PERSON',

    SELECT_TICKET: 'inbox/SELECT_TICKET',
    RESET_SELECT_TICKET: 'inbox/RESET_SELECT_TICKET',

    SHOW_INFO_PANEL: 'inbox/SHOW_INFO_PANEL',
    SET_USER_TYPE: 'inbox/SET_USER_TYPE',

    SELECT_AGENT: 'inbox/SELECT_AGENT',
    REPLY_MESSAGE: 'inbox/REPLY_MESSAGE',
    ADD_TICKET: 'inbox/ADD_TICKET',
    MODIFY_TICKET: 'inbox/MODIFY_TICKET',
    RESET_SELECT_AGENT: 'inbox/RESET_SELECT_AGENT',
    NEW_MESSAGE_FROM_CLIENT: 'inbox/NEW_MESSAGE_FROM_CLIENT',
    DELETE_TICKET: 'inbox/DELETE_TICKET',
    PERSON_SAW_CHAT: 'inbox/PERSON_SAW_CHAT',
    ANSWERED_CALL: 'inbox/ANSWERED_CALL',
    UPDATE_EXTERNAL_IDS: 'inbox/UPDATE_EXTERNAL_IDS',
    SET_SHOW_GO_TO_BOTTOM: 'inbox/SET_SHOW_GO_TO_BOTTOM',
    SET_AGENTS_TO_REASSIGN: 'inbox/SET_AGENTS_TO_REASSIGN',
    
    NEW_TICKET_CALL: 'inbox/NEW_TICKET_CALL',
    CALL_CONNECTED: 'inbox/CALL_CONNECTED',
    
    CONNECT_AGENT_WS: 'inbox/CONNECT_AGENT_WS',
    CONNECT_AGENT_UI: 'inbox/CONNECT_AGENT_UI',
    GO_TO_BOTTOM: 'inbox/GO_TO_BOTTOM',
    SET_IS_FILTERING: 'inbox/SET_IS_FILTERING',
    UPDATE_PERSON: 'inbox/UPDATE_PERSON',
    CLEAN_ALERT: 'inbox/CLEAN_ALERT',
    CHANGE_STATUS_TICKET: 'inbox/CHANGE_STATUS_TICKET',
    
    FORCEDDISCONECTION: 'inbox/FORCEDDISCONECTION',
    FORCEDDISCONECTION_RESET: 'inbox/FORCEDDISCONECTION_RESET',
    SET_DATA_USER: 'inbox/SET_DATA_USER',
    
    WS_CONNECT: 'WS_CONNECT',
    WS_CONNECTED: 'WS_CONNECTED',
    EMIT_EVENT: 'EMIT_EVENT',
    RESET_INBOX_SUPERVISOR: 'RESET_INBOX_SUPERVISOR',
    CHANGE_STATUS_TICKET_WS: 'CHANGE_STATUS_TICKET_WS',
    WS_DISCONNECT: 'socket/WS_DISCONNECT',
    SHOW_LOG_INTERACTIONS: 'socket/SHOW_LOG_INTERACTIONS',
    SET_HIDE_LOGS_ON_TICKET: 'socket/SET_HIDE_LOGS_ON_TICKET',
    
    SET_LIBRARY: 'inbox/SET_LIBRARY',
    SET_SEARCHTERM: 'inbox/SET_SEARCHTERM',
    SET_PINNEDCOMMENTS: 'inbox/SET_PINNEDCOMMENTS',
};

export default actionType;