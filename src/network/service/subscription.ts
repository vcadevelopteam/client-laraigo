import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function recoverPassword(request: any) {
    return APIManager.post(apiUrls.RECOVERPASSWORD, { data: request }, true);
}

export function changePassword(request: any) {
    return APIManager.post(apiUrls.CHANGEPASSWORD, { data: request }, true);
}