import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function rasatest(requestBody: any) {
    return APIManager.post(apiUrls.RASATESTINT, { data: requestBody }, true);
}
export function rasatrain(requestBody: any) {
    return APIManager.post(apiUrls.RASATRAININT, { data: requestBody }, true);
}
export function rasadownload(requestBody: any) {
    return APIManager.post(apiUrls.RASADOWNLOADINT, { data: requestBody }, true);
}
export function rasaupload(data: any) {
    return APIManager.post(apiUrls.RASAUPLOADINT, { data }, true);
}
export function rasamodellist(requestBody: any) {
    return APIManager.post(apiUrls.RASAMODELLIST, { data: requestBody }, true);
}

