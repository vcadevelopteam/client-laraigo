import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function rasatest(requestBody: any) {
    return APIManager.post(apiUrls.WATSONTESTINT, { data: requestBody }, true);
}

export function watsonmention(requestBody: any) {
    return APIManager.post(apiUrls.WATSONMENTION, { data: requestBody }, true);
}

export function watsonintent(requestBody: any) {
    return APIManager.post(apiUrls.WATSONINTENT, { data: requestBody }, true);
}

export function watsondeleteitem(requestBody: any) {
    return APIManager.post(apiUrls.WATSONITEMDELETE, { data: requestBody }, true);
}

export function watsonentity(requestBody: any) {
    return APIManager.post(apiUrls.WATSONENTITY, { data: requestBody }, true);
}
