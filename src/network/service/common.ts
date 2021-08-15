import { apiUrls } from '../../common/constants';
import { IRequestBody, ITransaction } from '@types';
import { APIManager } from '../manager';
import { removeAuthorizationToken } from "common/helpers";

export function login(usr: string, password: string) {
    const data = { usr, password };
    return APIManager.post(apiUrls.LOGIN_URL, { data: { data } }, false);
}
export function logout() {
    const tmp = APIManager.post(apiUrls.LOGOUT_URL, {}, true);
    removeAuthorizationToken()
    return tmp;
}

export function validateToken() {
    return APIManager.get(apiUrls.LOGIN_URL, {}, true);
}


export function main(requestBody: IRequestBody | ITransaction, transaction: boolean = false) {
    return APIManager.post(transaction ? apiUrls.EXECUTE_TRANSACTION : apiUrls.MAIN_URL, { data: requestBody }, true);
}

export function multiMain(requestBody: IRequestBody[]) {
    return APIManager.post(apiUrls.MAIN_MULTI, { data: requestBody }, true);
}

export function getTickets(page: number, pageSize: number) {
    const data = { page, pageSize, sort: 'DESC', query: [] };
    return APIManager.post(apiUrls.TICKET_URL, { data }, false);
}