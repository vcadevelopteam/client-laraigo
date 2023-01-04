import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function catalogBusinessList(request: any) {
    return APIManager.post(apiUrls.CATALOG_BUSINESSLIST, { data: request }, true);
}