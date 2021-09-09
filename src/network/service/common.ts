import { apiUrls } from '../../common/constants';
import { IRequestBody, IRequestBodyPaginated, ITransaction } from '@types';
import { APIManager } from '../manager';
import { removeAuthorizationToken } from "common/helpers";

export function login(usr: string, password: string, facebookid: string, googleid: string) {
    const data = { usr, password, facebookid, googleid };
    return APIManager.post(apiUrls.LOGIN_URL, { data: { data } }, false);
}
export function logout() {
    const tmp = APIManager.post(apiUrls.LOGOUT_URL, {}, true);
    removeAuthorizationToken()
    return tmp;
}

export function uploadFile(data: FormData) {
    return APIManager.post(apiUrls.UPLOAD_FILE, { data }, true);
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

export function mainPaginated(requestBody: IRequestBodyPaginated) {
    return APIManager.post(apiUrls.MAIN_PAGINATED, { data: requestBody }, true);
}

export function getTickets(page: number, pageSize: number) {
    const data = { page, pageSize, sort: 'DESC', query: [] };
    return APIManager.post(apiUrls.TICKET_URL, { data }, false);
}