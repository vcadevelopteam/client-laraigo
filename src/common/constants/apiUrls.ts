//const BASE_URL = 'http://localhost:6065/api'; //local

//const BASE_URL = 'https://apix.laraigo.com/api'; //dev
//const WS_URL = 'https://socket.laraigo.com'; //dev

const BASE_URL = 'https://testapix.laraigo.com/api'; //testing
const WS_URL = 'https://testsocket.laraigo.com'; //testing

// const CHATFLOW_URL = 'https://localhost:4200' //local
// const CHATFLOW_URL = 'https://zyxmelinux.zyxmeapp.com/zyxme/chatflow' //dev
const CHATFLOW_URL = 'https://zyxmelinux.zyxmeapp.com/zyxmetest/chatflow' //testing

// const CHATFLOW_URL = 'https://localhost:4200' //local
//const CHATFLOW_URL = 'https://zyxmelinux.zyxmeapp.com/zyxme/chatflow' //dev
// const CHATFLOW_URL = 'https://zyxmelinux.zyxmeapp.com/zyxmetest/chatflow' //testing

export const apiUrls = {
    WS_URL,
    TICKET_URL: `${BASE_URL}/main`,
    LOGIN_URL: `${BASE_URL}/auth`,
    CONNECT_INBOX: `${BASE_URL}/auth/connect`,
    CHANGE_ORGANIZATION: `${BASE_URL}/auth/changeorganization`,
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
    MASSIVE_CLOSE_TICKET: `${BASE_URL}/ticket/massiveclose`,
    REPLY_TICKET: `${BASE_URL}/ticket/reply`,
    REPLY_LIST_TICKET: `${BASE_URL}/ticket/reply/list`,
    REASSIGN_TICKET: `${BASE_URL}/ticket/reassign`,
    SEND_HSM: `${BASE_URL}/ticket/send/hsm`,


    INTEGRATION_URL: `${BASE_URL}/load`,
    GET_PAGELIST: `${BASE_URL}/channel/getpagelist`,
    GET_PAGELISTSUB: `${BASE_URL}/subscription/getpagelist`,
    INSERT_CHANNEL: `${BASE_URL}/channel/insertchannel`,
    EXEC_SUB: `${BASE_URL}/subscription/createsubscription`,
    VALIDATE_NEW_USER: `${BASE_URL}/subscription/validateusername`,
    DELETE_CHANNEL: `${BASE_URL}/channel/deletechannel`,

    PERSON: `${BASE_URL}/person`,

    CHATFLOW: `${CHATFLOW_URL}`,
};