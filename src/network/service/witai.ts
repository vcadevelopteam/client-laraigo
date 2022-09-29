import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function witaitest(requestBody: any) {
    return APIManager.post(apiUrls.WITAITEST, { data: requestBody }, true);
}

export function witaitrain() {
    return APIManager.post(apiUrls.WITAITRAIN, { data: {model: ""} }, true);
}