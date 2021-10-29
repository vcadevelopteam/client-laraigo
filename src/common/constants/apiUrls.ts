const ENV = "LOCAL";

const APIS_URL = {
    DEVELOP: {
        API: 'https://apix.laraigo.com/api',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux.zyxmeapp.com/zyxme/chatflow'
    },
    TESTING: {
        API: 'https://testapix.laraigo.com/api',
        WS: 'https://testsocket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux.zyxmeapp.com/zyxmetest/chatflow'
    },
    PRODUCTION: {
        API: 'https://apiprd.laraigo.com/api',
        WS: 'https://broker.laraigo.com',
        CHATFLOW: 'https://chatflow.s3-web.us-east.cloud-object-storage.appdomain.cloud'
    },
    LOCAL: {
        API: 'http://localhost:6065/api',
        // WS: 'http://localhost:7070',
        WS: 'https://broker.laraigo.com',
        CHATFLOW: 'https://localhost:4200'
    }
}

const BASE_URL = APIS_URL[ENV].API
const WS_URL = APIS_URL[ENV].WS
const CHATFLOW_URL = APIS_URL[ENV].CHATFLOW

export const apiUrls = {
    WS_URL,
    TICKET_URL: `${BASE_URL}/main`,
    LOGIN_URL: `${BASE_URL}/auth`,
    CONNECT_INBOX: `${BASE_URL}/auth/connect`,
    CHANGE_ORGANIZATION: `${BASE_URL}/auth/changeorganization`,
    LOGOUT_URL: `${BASE_URL}/auth/logout`,
    MAIN_URL: `${BASE_URL}/main`,
    MAIN_URL_PUBLIC: `${BASE_URL}/main/public/domainvalues`,
    MAIN_MULTI: `${BASE_URL}/main/multi`,
    MAIN_MULTI_PUBLIC: `${BASE_URL}/main/public/multi/domainvalues`,
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
    UPDATE_USER: `${BASE_URL}/user/update/info`,


    INTEGRATION_URL: `${BASE_URL}/load`,
    CHANNELS: `${BASE_URL}/channel`,
    GET_PAGELIST: `${BASE_URL}/channel/getpagelist`,
    VERIFY_CHANNEL: `${BASE_URL}/subscription/get/contract`,
    GET_PAGELISTSUB: `${BASE_URL}/subscription/getpagelist`,
    INSERT_CHANNEL: `${BASE_URL}/channel/insertchannel`,
    EXEC_SUB: `${BASE_URL}/subscription/createsubscription`,
    VALIDATE_NEW_USER: `${BASE_URL}/subscription/validateusername`,
    ACTIVATION_USER: `${BASE_URL}/subscription/activateuser`,
    DELETE_CHANNEL: `${BASE_URL}/channel/deletechannel`,

    PERSON: `${BASE_URL}/person`,


    CHATFLOW: `${CHATFLOW_URL}`,
};