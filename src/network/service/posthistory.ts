import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function schedulePost(request: any) {
    return APIManager.post(apiUrls.POSTHISTORY_SCHEDULE, { data: request }, true);
}