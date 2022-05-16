import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function getCategories(request: any) {
    return APIManager.post(apiUrls.VOXIMPLANT_GET_CATEGORIES, { data: request }, true);
}

export function getCountryStates(request: any) {
    return APIManager.post(apiUrls.VOXIMPLANT_GET_COUNTRYSTATES, { data: request }, true);
}

export function getRegions(request: any) {
    return APIManager.post(apiUrls.VOXIMPLANT_GET_REGIONS, { data: request }, true);
}