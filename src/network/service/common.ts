import { apiUrls } from '../../common/constants';
import { IRequestBody } from '@types';
import { APIManager } from '../manager';

export function login(usr: string, password: string) {
    const data = { usr, password };
    return APIManager.post(apiUrls.LOGIN_URL, { data: { data } }, false);
}

export function main(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.MAIN_URL, { data: requestBody }, true);
}

export function getTickets(page: number, pageSize: number) {
    const data = { page, pageSize, sort: 'DESC', query: [] };
    return APIManager.post(apiUrls.TICKET_URL, { data }, false);
}