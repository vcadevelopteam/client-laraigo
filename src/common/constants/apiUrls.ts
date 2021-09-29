//const BASE_URL = 'http://localhost:6065/api'; //local

const BASE_URL = 'https://apix.laraigo.com/api'; //dev
const WS_URL = 'https://socket.laraigo.com'; //dev

// const BASE_URL = 'https://testapix.laraigo.com/api'; //testing
// const WS_URL = 'https://testsocket.laraigo.com'; //testing

export const apiUrls = {
    WS_URL,
    TICKET_URL: `${BASE_URL}/main`,
    LOGIN_URL: `${BASE_URL}/auth`,
    CONNECT_INBOX: `${BASE_URL}/auth/connect`,
    LOGOUT_URL: `${BASE_URL}/auth/logout`,
    MAIN_URL: `${BASE_URL}/main`,
    MAIN_MULTI: `${BASE_URL}/main/multi`,
    EXECUTE_TRANSACTION: `${BASE_URL}/main/executetransaction`,
    MAIN_PAGINATED: `${BASE_URL}/main/paginated`,
    MAIN_DYNAMIC: `${BASE_URL}/reportdesigner`,
    MAIN_DYNAMIC_EXPORT: `${BASE_URL}/reportdesigner/export`,
    INTEGRATION: `${BASE_URL}/integration`,
    UPLOAD_FILE: `${BASE_URL}/upload`,
    EXPORT_DATA: `${BASE_URL}/main/export`,
    
    CLOSE_TICKET: `${BASE_URL}/ticket/close`,
    REPLY_TICKET: `${BASE_URL}/ticket/reply`,
    REPLY_LIST_TICKET: `${BASE_URL}/ticket/reply/list`,
    REASSIGN_TICKET: `${BASE_URL}/ticket/reassign`,


    INTEGRATION_URL: `${BASE_URL}/load`,
    GET_PAGELIST: `${BASE_URL}/channel/getpagelist`,
    GET_PAGELISTSUB: `${BASE_URL}/subscription/getpagelist`,
    INSERT_CHANNEL: `${BASE_URL}/channel/insertchannel`,
    EXEC_SUB: `${BASE_URL}/subscription/createsubscription`,
    DELETE_CHANNEL: `${BASE_URL}/channel/deletechannel`,

    PERSON: `${BASE_URL}/person`,
};