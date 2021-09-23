// const BASE_URL = 'http://52.116.128.51:5065/api';
const BASE_URL = 'https://apix.laraigo.com/api';
//const BASE_URL = 'http://localhost:6065/api';

export const apiUrls = {
    WS_URL: 'https://socket.laraigo.com',
    TICKET_URL: `${BASE_URL}/main`,
    LOGIN_URL: `${BASE_URL}/auth`,
    CONNECT_INBOX: `${BASE_URL}/auth/connect`,
    LOGOUT_URL: `${BASE_URL}/auth/logout`,
    MAIN_URL: `${BASE_URL}/main`,
    MAIN_MULTI: `${BASE_URL}/main/multi`,
    EXECUTE_TRANSACTION: `${BASE_URL}/main/executetransaction`,
    MAIN_PAGINATED: `${BASE_URL}/main/paginated`,
    INTEGRATION: `${BASE_URL}/integration`,
    UPLOAD_FILE: `${BASE_URL}/upload`,
    EXPORT_DATA: `${BASE_URL}/main/exportexcel`,
    
    CLOSE_TICKET: `${BASE_URL}/ticket/close`,
    REPLY_TICKET: `${BASE_URL}/ticket/reply`,
    REPLY_LIST_TICKET: `${BASE_URL}/ticket/reply/list`,
    REASSIGN_TICKET: `${BASE_URL}/ticket/reassign`,


    INTEGRATION_URL: `${BASE_URL}/load`,
    GET_PAGELIST: `${BASE_URL}/channel/getpagelist`,
    INSERT_CHANNEL: `${BASE_URL}/channel/insertchannel`,
    DELETE_CHANNEL: `${BASE_URL}/channel/deletechannel`,
};