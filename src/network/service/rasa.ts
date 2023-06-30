import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function rasatest(requestBody: any) {
    return APIManager.post(apiUrls.RASATESTINT, { data: requestBody }, true);
}
