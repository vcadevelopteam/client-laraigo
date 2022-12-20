import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function calendarLogIn(request: any) {
    return APIManager.post(apiUrls.EVENTBOOKING_GOOGLE_LOGIN, { data: request }, true);
}

export function calendarDisconnect(request: any) {
    return APIManager.post(apiUrls.EVENTBOOKING_GOOGLE_DISCONNECT, { data: request }, true);
}

export function calendarValidate(request: any) {
    return APIManager.post(apiUrls.EVENTBOOKING_GOOGLE_VALIDATE, { data: request }, true);
}