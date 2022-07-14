import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function exchangeCode(request: any) {
    return APIManager.post(apiUrls.GOOGLE_EXCHANGECODE, { data: request }, true);
}

export function listBlogger(request: any) {
    return APIManager.post(apiUrls.GOOGLE_LISTBLOGGER, { data: request }, true);
}

export function listYouTube(request: any) {
    return APIManager.post(apiUrls.GOOGLE_LISTYOUTUBE, { data: request }, true);
}