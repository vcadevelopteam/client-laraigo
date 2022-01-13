import { ITransaction } from '@types';
import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function postActivationUser(token: string) {
    const data = { userCode: token };
    return APIManager.post(apiUrls.ACTIVATION_USER, { data }, false);
}

export function postSaveUser(requestBody: ITransaction) {
    return APIManager.post(apiUrls.SAVE_USER, { data: requestBody }, true);
}