// const BASE_URL = 'http://52.116.128.51:5065/api';
const BASE_URL = 'http://52.116.128.51:6065/api';
//const BASE_URL = 'http://localhost:6065/api';

export const apiUrls = {
    TICKET_URL: `${BASE_URL}/main`,
    LOGIN_URL: `${BASE_URL}/auth`,
    LOGOUT_URL: `${BASE_URL}/auth/logout`,
    MAIN_URL: `${BASE_URL}/main`,
    MAIN_MULTI: `${BASE_URL}/main/multi`,
    EXECUTE_TRANSACTION: `${BASE_URL}/main/executetransaction`,
    MAIN_PAGINATED: `${BASE_URL}/main/paginated`,
};