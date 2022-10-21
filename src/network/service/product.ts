import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function importXml(request: any) {
    return APIManager.post(apiUrls.PRODUCT_IMPORT, { data: request }, true);
}