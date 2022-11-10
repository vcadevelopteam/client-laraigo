import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function calendarLogIn(request: any) {
    return APIManager.post(apiUrls.EVENTBOOKING_GOOGLE_LOGIN, { data: request }, true);
}