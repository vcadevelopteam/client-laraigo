import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function getDashboard(body: any) {
    const uri = `${apiUrls.MAIN_DYNAMIC}/dashboard`;
    return APIManager.post(uri, { data: body }, true);
}
