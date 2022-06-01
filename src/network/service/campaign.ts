import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function start(request: any) {
    return APIManager.post(apiUrls.CAMPAIGN_START, { data: request }, true);
}