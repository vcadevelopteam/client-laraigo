import { IRequestBody } from '@types';
import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function getPagelist(accessToken: String) {
    const data = { accessToken: accessToken };
    return APIManager.post(apiUrls.GET_PAGELIST, { data }, true);
}
export function insertchnl(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.INSERT_CHANNEL, { data: requestBody }, true);
}
export function deletechnl(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.DELETE_CHANNEL, { data: requestBody }, true);
}
