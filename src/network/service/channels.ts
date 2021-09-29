import { IRequestBody } from '@types';
import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function getPagelist(accessToken: String) {
    const data = { accessToken: accessToken };
    return APIManager.post(apiUrls.GET_PAGELIST, { data }, true);
}
export function getPagelistSub(accessToken: String) {
    const data = { accessToken: accessToken };
    return APIManager.post(apiUrls.GET_PAGELISTSUB, { data }, true);
}
export function insertchnl(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.INSERT_CHANNEL, { data: requestBody }, true);
}
export function execSub(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.EXEC_SUB, { data: requestBody }, true);
}
export function validateNewUser(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.VALIDATE_NEW_USER, { data: requestBody }, true);
}
export function deletechnl(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.DELETE_CHANNEL, { data: requestBody }, true);
}
